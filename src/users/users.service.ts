/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PortfolioService } from '../portfolio/portfolio.service';
const fetch = require('node-fetch');

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly portfolioService: PortfolioService,
  ) {}

  async getAll() {
    try {
      const users = await this.prismaService.user.findMany({
        where: {
          deleted: false,
        },
        include: {
          portfolio: {
            select: {
              id: true,
              date: true,
              value: true,
              investments: {
                select: {
                  id: true,
                  date: true,
                  amount: true,
                  value: true,
                  deleted: true,
                  shortName: true,
                  name: true,
                  investmentValue: {
                    select: {
                      id: true,
                      value: true,
                      date: true,
                      deleted: true,
                    },
                  },
                },
              },
              portfolioValue: {
                select: {
                  id: true,
                  date: true,
                  value: true,
                  deleted: true,
                },
              },
            },
          },
        },
      });
      if (!users) {
        throw new Error('Users not found');
      }
      return users;
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
              portfolioValue: true,
            },
          },
        },
      });
      if (!user) {
        throw new Error('User not found...');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async create(username_: string) {
    try {
      const createUser = await this.prismaService.user.create({
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
      return createUser;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number, portfolioId: number) {
    try {
      await this.portfolioService.delete(portfolioId);
      await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: {
          deleted: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
