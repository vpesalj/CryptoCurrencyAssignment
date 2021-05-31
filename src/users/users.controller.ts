import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAll() {
    return this.userService.getAll();
  }

  @Get('/:id')
  async getOne(@Param() { id }) {
    return this.userService.getOne(id);
  }

  @Post()
  async create(@Body('username') username: string) {
    if (!username) {
      return 'Username field empty';
    }
    return await this.userService.create(username);
  }

  @Delete(':id/portfolio/:portfolioId')
  async delete(@Param() { id }, @Param() { portfolioId }) {
    if (!id || !portfolioId) {
      return 'Fields id and portfolio id can not be empty';
    }
    return await this.userService.delete(Number(id), Number(portfolioId));
  }
}
