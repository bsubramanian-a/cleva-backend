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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('User Management')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create Meeting', description: 'Use this to create meetings. This will also create a record in Zoho CRM also.' })  
  @ApiResponse({ status: 201, description: 'The Meeting has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto.data);
  }

  @Get()
  @ApiOperation({ summary: 'Create Meeting', description: 'Use this to create meetings. This will also create a record in Zoho CRM also.' })  
  @ApiResponse({ status: 201, description: 'The Meeting has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async findAll(@Res() res: Response) {
    const users = await this.usersService.findAll();
    const responseJSON = { data: { users: users, status: 200 } };
    res.status(200).send(responseJSON);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Create Meeting', description: 'Use this to create meetings. This will also create a record in Zoho CRM also.' })  
  @ApiResponse({ status: 201, description: 'The Meeting has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOne(+id);
    const responseJSON = { data: { user: user, status: 200 } };
    res.status(200).send(responseJSON);
  }

  @Get('getuserbyemail/:email')
  @ApiOperation({ summary: 'Create Meeting', description: 'Use this to create meetings. This will also create a record in Zoho CRM also.' })  
  @ApiResponse({ status: 201, description: 'The Meeting has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async getUserByUserId(
    @Param('email') email: string,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findOneByUserEmail(email);
    const responseJSON = { data: { user: user, status: 200 } };
    res.status(200).send(responseJSON);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Create Meeting', description: 'Use this to create meetings. This will also create a record in Zoho CRM also.' })  
  @ApiResponse({ status: 201, description: 'The Meeting has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(+id, updateUserDto.data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Create Meeting', description: 'Use this to create meetings. This will also create a record in Zoho CRM also.' })  
  @ApiResponse({ status: 201, description: 'The Meeting has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
