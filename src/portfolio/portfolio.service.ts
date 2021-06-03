import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomError } from 'src/custom-error/CustomError';
import { InvestmentGroupService } from 'src/investment-group/investment-group.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly invGroupService: InvestmentGroupService,
  ) {}

  async getAll() {
    try {
      const portfolios = await this.prismaService.portfolio.findMany({
        where: {
          deleted: false,
        },
        include: {
          investmentGroups: {
            select: {
              id: true,
              name: true,
              portfolio: true,
              investments: true,
              value: true,
            },
          },
          portfolioValue: true,
          user: true,
        },
      });
      return portfolios;
    } catch (error) {
      throw error;
    }
  }

  async getPortfolioHistory(id: number) {
    try {
      const values = await this.prismaService.portfolioValue.findMany({
        where: {
          portfolioId: id * 1,
        },
        include: {
          portfolio: true,
        },
      });
      return values;
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: number) {
    try {
      const portfolio = await this.prismaService.portfolio.findUnique({
        where: {
          id: id * 1,
        },
        include: {
          investmentGroups: {
            select: {
              id: true,
              name: true,
              date: true,
              value: true,
              investments: {
                select: {
                  id: true,
                  date: true,
                  name: true,
                  shortName: true,
                  amount: true,
                  value: true,
                  investmentValue: true,
                },
              },
            },
          },
          portfolioValue: true,
        },
      });
      if (!portfolio) throw new CustomError('Portfolio not found', 'NotFound');
      return portfolio;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      await this.prismaService.portfolio.update({
        where: {
          id: id,
        },
        data: {
          deleted: true,
          investmentGroups: {
            updateMany: {
              where: {
                portfolioId: id,
              },
              data: {
                deleted: true,
              },
            },
          },
        },
      });
      return 'Deleted';
    } catch (error) {
      throw error;
    }
  }

  async updateForScheduler(portfolio: any, portfolioValue: number) {
    try {
      return await this.prismaService.portfolio.update({
        where: {
          id: portfolio.id,
        },
        data: {
          value: portfolioValue,
          date: new Date(),
          portfolioValue: {
            create: {
              value: portfolioValue,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async portfolioScheduler(portfolios: any[]) {
    portfolios.map((portfolio) => {
      let portfolioValue = 0;
      portfolio.investmentGroups.map((invGroup) => {
        const invGroupValue = invGroup.investments.reduce(
          (acc, current) => acc + current.value,
          0,
        );
        this.invGroupService
          .updateForScheduler(invGroup, invGroupValue)
          .then((res) => res)
          .catch((error) => {
            throw error;
          });

        portfolioValue += invGroupValue;
      });
      this.updateForScheduler(portfolio, portfolioValue)
        .then((res) => res)
        .catch((err) => {
          throw err;
        });
    });
  }
}
