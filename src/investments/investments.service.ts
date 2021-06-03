import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Investment } from 'src/dto/investment.dto';
import { PrismaService } from 'src/prisma.service';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvestmentGroupService } from 'src/investment-group/investment-group.service';
import { CustomError } from 'src/custom-error/CustomError';
const fetch = require('node-fetch');

@Injectable()
export class InvestmentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly portfolioService: PortfolioService,
    private readonly invGroupService: InvestmentGroupService,
  ) {}

  async getAll() {
    try {
      const investments = await this.prismaService.investment.findMany({
        where: {
          deleted: false,
        },
      });
      return investments;
    } catch (error) {
      throw error;
    }
  }

  async getAllForPortfolio(id: number) {
    try {
      const investments = await this.prismaService.investmentGroup.findMany({
        where: {
          deleted: false,
          portfolioId: id,
        },
        include: {
          portfolio: {
            select: {
              id: true,
              date: true,
              value: true,
              portfolioValue: true,
            },
          },
          investments: {
            select: {
              id: true,
              date: true,
              name: true,
              shortName: true,
              amount: true,
              unitPrice: true,
              value: true,
              investmentValue: true,
            },
          },
        },
      });
      return investments;
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: number) {
    try {
      const investment = await this.prismaService.investment.findFirst({
        where: {
          id: id * 1,
          deleted: false,
        },
        include: {
          investmentValue: true,
        },
      });
      if (!investment) {
        throw new CustomError('Investment not found', 'NotFound');
      }
      return investment;
    } catch (error) {
      throw error;
    }
  }

  async create(inv: Investment) {
    try {
      const portfolio = await this.portfolioService.getOne(inv.portfolio.id);
      const newData = await this.getCryptoCurrencyData();

      newData.filter((item) => {
        if (item.name === inv.name) {
          inv.shortName = item.symbol;
          inv.unitPrice = item.quote.USD.price;
          inv.value = item.quote.USD.price * inv.amount;
        }
      });
      if (!inv.shortName) throw new CustomError('Name not valid', 'NotValid');

      const foundGroup = await this.invGroupService.findForNewInvestment(inv);
      let group;
      if (foundGroup) {
        group = {
          connect: {
            id: foundGroup.id,
          },
        };
      } else {
        group = {
          create: {
            name: inv.name,
            value: inv.unitPrice * inv.amount,
            portfolioId: inv.portfolio.id * 1,
          },
        };
      }
      const createdInvestment = await this.prismaService.investment.create({
        data: {
          name: inv.name,
          shortName: inv.shortName,
          amount: Number(inv.amount),
          value: inv.unitPrice * inv.amount,
          unitPrice: inv.unitPrice,
          investmentGroup: group,
          investmentValue: {
            create: {
              value: inv.value,
            },
          },
        },
      });
      await this.invGroupService.updateAfterNewInvestment(
        foundGroup,
        inv.value,
        portfolio,
      );
      return createdInvestment;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const found = await this.prismaService.investment.findFirst({
        where: { id: id * 1 },
      });
      if (!found) throw new CustomError('Investment not found', 'NotFound');
      if (found.deleted)
        throw new CustomError('Already deleted', 'InvestmentConflict');
      await this.prismaService.investmentValue.updateMany({
        where: {
          investmentId: id * 1,
        },
        data: {
          deleted: true,
        },
      });
      await this.prismaService.investment.update({
        where: {
          id: id * 1,
        },
        data: {
          deleted: true,
        },
      });
      return 'Deleted';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateScheduler() {
    try {
      const newData = await this.getCryptoCurrencyData();
      const investments = await this.getAll();
      this.investmentScheduler(newData, investments);
      const portfolios = await this.portfolioService.getAll();
      this.portfolioService.portfolioScheduler(portfolios);
    } catch (err) {
      throw err;
    }
  }

  async investmentScheduler(newCryptoData: any[], investments: any[]) {
    newCryptoData.filter((item) => {
      investments.filter((investment) => {
        if (item.name === investment.name) {
          investment.unitPrice = item.quote.USD.price;
          investment.value = item.quote.USD.price * investment.amount;
          this.prismaService.investment
            .update({
              where: {
                id: investment.id,
              },
              data: {
                unitPrice: investment.unitPrice,
                value: investment.value,
                investmentValue: {
                  create: {
                    value: investment.value,
                  },
                },
              },
            })
            .catch((err) => {
              throw err;
            });
        }
      });
    });
  }

  async getCryptoCurrencyData() {
    const response = await fetch(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CMC_PRO_API_KEY': '1b60cc98-8a70-47d1-ac8f-16ba9a594513',
        },
      },
    )
      .then((data) => {
        return data.json();
      })
      .catch((err) => {
        throw err;
      });
    return response.data;
  }
}
