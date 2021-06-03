import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from '../exception.filter';

@UseFilters(new HttpExceptionFilter())
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAll() {
    try {
      return await this.userService.getAll();
    } catch (error) {
      // throw new HttpException(error, 500);
      throw new HttpException('Something went wrong..', 500);
    }
  }

  @Get('/:id')
  async getOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
  ) {
    try {
      return await this.userService.getOne(id);
    } catch (error) {
      // throw new HttpException(error, 500);
      throw new HttpException('Something went wrong..', 500);
    }
  }

  @Post()
  async create(@Body('username') username: string) {
    try {
      if (!username) throw new BadRequestException('Username is empty');
      return await this.userService.create(username);
    } catch (error) {
      // throw new HttpException(error, 500);
      throw new HttpException('Something went wrong..', 500);
    }
  }

  @Delete(':id/portfolio/:portfolioId')
  async delete(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
    @Param(
      'portfolioId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    portfolioId: number,
  ) {
    try {
      return await this.userService.delete(Number(id), Number(portfolioId));
    } catch (error) {
      // throw new HttpException(error, 500);
      throw new HttpException('Something went wrong..', 500);
    }
  }
}
