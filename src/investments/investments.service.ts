import { Injectable } from '@nestjs/common';
import { Investment } from 'src/dto/investment.dto';
import { PrismaService } from 'src/prisma.service';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { Cron } from '@nestjs/schedule';
const fetch = require('node-fetch');

@Injectable()
export class InvestmentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly portfolioService: PortfolioService,
  ) {}

  async getAllForPortfolio(id: number) {
    try {
      const investments = await this.prismaService.investment.findMany({
        where: {
          portfolioId: id,
        },
        include: {
          investmentValue: true,
          portfolio: true,
        },
      });
      return investments;
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      const investments = await this.prismaService.investment.findMany({
        where: {
          deleted: false,
        },
      });
      if (!investments) throw new Error('Investments not found');
      return investments;
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: number) {
    try {
      const investment = await this.prismaService.investment.findUnique({
        where: {
          id: id * 1,
        },
        include: {
          investmentValue: true,
        },
      });
      if (!investment) {
        throw new Error('Investment not found...');
      }
      return investment;
    } catch (error) {
      throw error;
    }
  }

  async create(inv: Investment) {
    try {
      const portfolio = await this.portfolioService.getOne(inv.portfolio.id);
      if (!portfolio) return 'Portfolio not found';
      const data = await this.getCryptoCurrencyData();

      data.filter((item) => {
        if (item.name === inv.name) {
          (inv.shortName = item.symbol), (inv.unitPrice = item.quote.USD.price);
        }
      });
      if (!inv.shortName) throw Error('Name not valid');
      const invValue = inv.unitPrice * inv.amount;

      const created = await this.prismaService.investment.create({
        data: {
          name: inv.name,
          shortName: inv.shortName,
          amount: Number(inv.amount),
          value: inv.unitPrice * inv.amount,
          unitPrice: inv.unitPrice,
          investmentValue: {
            create: {
              value: invValue,
            },
          },
          portfolio: {
            connect: {
              id: Number(inv.portfolio.id),
            },
          },
        },
      });

      await this.portfolioService.updateAfterNewInvestment(
        inv.portfolio.id,
        invValue,
      );
      return created;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      return this.prismaService.investment.delete({
        where: {
          id: id * 1,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Cron('45 * * * * *')
  async updateScheduler() {
    const newData = await this.getCryptoCurrencyData();
    const investments = await this.getAll();
    const portfolios = await this.portfolioService.getAll();
    this.updateInvestmentScheduler(newData, investments);
    this.updatePortfolioValueScheduler(portfolios);
  }

  async updateInvestmentScheduler(newCryptoData: any[], investments: any[]) {
    newCryptoData.filter((item) => {
      investments.filter((inv) => {
        if (item.name === inv.name) {
          inv.unitPrice = item.quote.USD.price;
          inv.value = item.quote.USD.price * inv.amount;
          this.prismaService.investment
            .update({
              where: {
                id: inv.id,
              },
              data: {
                unitPrice: inv.unitPrice,
                value: inv.value,
                date: new Date(),
                investmentValue: {
                  create: {
                    value: inv.value,
                    deleted: false,
                  },
                },
              },
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              throw err;
            });
        }
      });
    });
  }

  async updatePortfolioValueScheduler(portfolios: any[]) {
    portfolios.map((item) => {
      const totalValue = item.investments.reduce(
        (acc, current) => acc + current.value,
        0,
      );

      this.prismaService.portfolio
        .update({
          where: {
            id: item.id,
          },
          data: {
            value: totalValue,
            date: new Date(),
            portfolioValue: {
              create: {
                deleted: false,
                value: totalValue,
              },
            },
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          throw err;
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
