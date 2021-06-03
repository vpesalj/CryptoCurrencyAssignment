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
      throw new InternalServerErrorException(error);
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
      if (error.name === 'NotFound') {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  @Post()
  async create(@Body('username') username: string) {
    try {
      if (!username) throw new BadRequestException('Username is empty');
      return await this.userService.create(username);
    } catch (error) {
      if (error.name === 'UserConflict') {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
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
      if (error.name === 'UserConflict') {
        throw new ConflictException(error.message);
      } else if (error.name === 'NotFound') {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
