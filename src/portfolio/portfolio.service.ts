import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PortfolioService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    try {
      const portfolios = await this.prismaService.portfolio.findMany({
        where: {
          deleted: false,
        },
        include: {
          investments: true,
          portfolioValue: true,
          user: true,
        },
      });
      if (!portfolios) throw new Error('Portfolios not found');
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
      if (!values) throw new Error('Portfolio values not found');
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
          portfolioValue: true,
        },
      });
      if (!portfolio) {
        throw new Error('Portfolio not found...');
      }
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
          investments: {
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
    } catch (error) {
      throw error;
    }
  }

  async updateAfterNewInvestment(id: number, newValue: number) {
    try {
      const portfolio = await this.prismaService.portfolio.findUnique({
        where: {
          id: id * 1,
        },
      });
      if (!portfolio) {
        throw new Error('Portfolio not found...');
      }
      await this.prismaService.portfolio.update({
        where: {
          id: portfolio.id,
        },
        data: {
          value: portfolio.value + newValue,
          date: new Date(),
          portfolioValue: {
            create: {
              value: portfolio.value + newValue,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
