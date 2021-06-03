/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { CustomError } from '../custom-error/CustomError';
const fetch = require('node-fetch');

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly portfolioService: PortfolioService,
  ) {}

  async getAll() {
    try {
      return await this.prismaService.user.findMany({
        where: {
          deleted: false,
        },
        include: {
          portfolio: {
            select: {
              id: true,
              date: true,
              value: true,
              portfolioValue: true,
              investmentGroups: {
                select: {
                  id: true,
                  date: true,
                  value: true,
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
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: id * 1,
        },
        include: {
          portfolio: {
            select: {
              id: true,
              date: true,
              value: true,
              portfolioValue: true,
              investmentGroups: {
                select: {
                  id: true,
                  date: true,
                  value: true,
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
              },
            },
          },
        },
      });
      if (!user) {
        throw new CustomError('User not found', 'NotFound');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async create(username_: string) {
    try {
      const found = await this.prismaService.user.findFirst({
        where: {
          username: username_,
          deleted: false,
        },
      });
      if (found) throw new CustomError('User already exists', 'UserConflict');
      return await this.prismaService.user.create({
        data: {
          username: username_,
          portfolio: {
            create: {
              value: 0,
              portfolioValue: {
                create: {
                  value: 0,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number, portfolioId: number) {
    try {
      const found = await this.prismaService.user.findUnique({
        where: {
          id: id * 1,
        },
      });
      if (!found) throw new CustomError('User not found', 'NotFound');

      if (found.deleted)
        throw new CustomError('User already deleted', 'UserConflict');

      await this.portfolioService.delete(portfolioId);
      await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: {
          deleted: true,
        },
      });
      return 'Deleted';
    } catch (error) {
      throw error;
    }
  }
}
