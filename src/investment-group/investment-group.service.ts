import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InvestmentGroupService {
  constructor(private readonly prismaService: PrismaService) {}

  async findForNewInvestment(investment: any) {
    try {
      return await this.prismaService.investmentGroup.findFirst({
        where: {
          name: investment.name,
          portfolioId: investment.portfolio.id * 1,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateAfterNewInvestment(group: any, newVal: number, portfolio: any) {
    try {
      if (group) {
        await this.prismaService.investmentGroup.update({
          where: {
            id: group.id * 1,
          },
          data: {
            value: Number(group.value) + Number(newVal),
            portfolio: {
              update: {
                value: Number(group.value) + Number(newVal),
              },
            },
          },
        });
      } else {
        await this.prismaService.portfolio.update({
          where: {
            id: portfolio.id * 1,
          },
          data: {
            value: Number(portfolio.value) + newVal,
          },
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async updateForScheduler(invGroup: any, totalValue: number) {
    try {
      const foundGroup = await this.prismaService.investmentGroup.findUnique({
        where: { id: invGroup.id * 1 },
      });
      if (!foundGroup) throw new NotFoundException('Group not found');

      await this.prismaService.investmentGroup.update({
        where: {
          id: invGroup.id * 1,
        },
        data: {
          value: Number(totalValue),
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
