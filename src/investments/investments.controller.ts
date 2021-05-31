import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Investment } from 'src/dto/investment.dto';
import { InvestmentsService } from './investments.service';

@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentService: InvestmentsService) {}

  @Get('user/:id')
  async getAllForPortfolio(@Param() { id }) {
    if (!id) {
      return 'Id not valid';
    }
    return this.investmentService.getAllForPortfolio(Number(id));
  }

  @Get(':id')
  async getOne(@Param() { id }) {
    if (!id) {
      return 'Id not valid';
    }
    return this.investmentService.getOne(Number(id));
  }

  @Post()
  async create(@Body() investment: Investment) {
    if (!investment.name || !investment.amount) {
      return 'Fields name and amount can not be empty';
    }
    return await this.investmentService.create(investment);
  }

  @Delete(':id')
  async delete(@Param() { id }) {
    if (!id) {
      return 'Id not valid';
    }
    return this.investmentService.delete(Number(id));
  }
}
