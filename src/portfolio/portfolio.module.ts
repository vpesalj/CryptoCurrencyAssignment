import { Module } from '@nestjs/common';
import { InvestmentGroupService } from 'src/investment-group/investment-group.service';
import { InvestmentsService } from 'src/investments/investments.service';
import { PrismaService } from 'src/prisma.service';
import { PortfolioService } from './portfolio.service';

@Module({
  providers: [
    PrismaService,
    PortfolioService,
    InvestmentsService,
    InvestmentGroupService,
  ],
})
export class PortfolioModule {}
