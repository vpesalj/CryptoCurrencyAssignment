/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
        throw new NotFoundException('User not found...');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async create(username_: string) {
    try {
      const found = await this.prismaService.user.findUnique({
        where: {
          username: username_,
        },
      });
      if (found)
        return new BadRequestException(
          'User with this username already exists',
        );
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
          id: id,
        },
      });
      if (!found) throw new NotFoundException("User doesn't exist");
      if (found.deleted) throw new NotFoundException('User is deleted');
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
