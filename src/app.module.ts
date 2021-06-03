import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { InvestmentsController } from './investments/investments.controller';
import { InvestmentsService } from './investments/investments.service';
import { InvestmentsModule } from './investments/investments.module';
import { PortfolioService } from './portfolio/portfolio.service';
import { PortfolioModule } from './portfolio/portfolio.module';
import { InvestmentGroupService } from './investment-group/investment-group.service';

@Module({
  imports: [UsersModule, InvestmentsModule, PortfolioModule],
  controllers: [AppController, UsersController, InvestmentsController],
  providers: [
    AppService,
    UsersService,
    PrismaService,
    InvestmentsService,
    PortfolioService,
    InvestmentGroupService,
  ],
})
export class AppModule {}
