import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { Res } from '@nestjs/common/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto.data);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const users = await this.usersService.findAll();
    const responseJSON = { data: { users: users, status: 200 } };
    res.status(200).send(responseJSON);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOne(+id);
    const responseJSON = { data: { user: user, status: 200 } };
    res.status(200).send(responseJSON);
  }

  @Get('getuserbyemail/:email')
  async getUserByUserId(
    @Param('email') email: string,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findOneByUserEmail(email);
    const responseJSON = { data: { user: user, status: 200 } };
    res.status(200).send(responseJSON);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(+id, updateUserDto.data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
