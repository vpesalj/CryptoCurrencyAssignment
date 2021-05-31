import { Module } from '@nestjs/common';
import { InvestmentsService } from 'src/investments/investments.service';
import { PrismaService } from 'src/prisma.service';
import { PortfolioService } from './portfolio.service';

@Module({
  providers: [PrismaService, PortfolioService, InvestmentsService],
})
export class PortfolioModule {}
