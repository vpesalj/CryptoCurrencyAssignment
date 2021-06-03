import { Module } from '@nestjs/common';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { PrismaService } from 'src/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ScheduleModule } from '@nestjs/schedule';
import { InvestmentGroupService } from 'src/investment-group/investment-group.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [UsersController],
  providers: [
    PrismaService,
    UsersService,
    PortfolioService,
    InvestmentGroupService,
  ],
})
export class UsersModule {}
