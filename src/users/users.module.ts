import { Module } from '@nestjs/common';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { PrismaService } from 'src/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [UsersController],
  providers: [PrismaService, UsersService, PortfolioService],
})
export class UsersModule {}
