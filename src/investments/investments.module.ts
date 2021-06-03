import { Module } from '@nestjs/common';
import { InvestmentGroupService } from 'src/investment-group/investment-group.service';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { PrismaService } from 'src/prisma.service';
import { InvestmentsController } from './investments.controller';
import { InvestmentsService } from './investments.service';

@Module({
  controllers: [InvestmentsController],
  providers: [
    PrismaService,
    PortfolioService,
    InvestmentsService,
    InvestmentGroupService,
  ],
})
export class InvestmentsModule {}
