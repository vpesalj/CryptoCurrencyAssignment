import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Investment } from 'src/dto/investment.dto';
import { InvestmentsService } from './investments.service';

@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentService: InvestmentsService) {}

  @Get('all/:id')
  async getAllForPortfolio(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
  ) {
    try {
      return await this.investmentService.getAllForPortfolio(Number(id));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  async getOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
  ) {
    try {
      return await this.investmentService.getOne(Number(id));
    } catch (error) {
      if (error.name === 'NotFound') {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  @Post()
  async create(@Body() investment: Investment) {
    try {
      if (!investment.name || !investment.amount) {
        return 'Fields name and amount can not be empty';
      }
      return await this.investmentService.create(investment);
    } catch (error) {
      if (error.name === 'NotValid') {
        throw new BadRequestException(error.message);
      } else if (error.name === 'NotFound') {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  @Delete(':id')
  async delete(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
  ) {
    try {
      return await this.investmentService.delete(Number(id));
    } catch (error) {
      if (error.name === 'InvestmentConflict') {
        throw new ConflictException(error.message);
      } else if (error.name === 'NotFound') {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
