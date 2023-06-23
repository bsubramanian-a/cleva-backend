import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { Response } from 'express';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  async create(@Body() createGoalDto: any, @Res() response: Response) { 
    try {
      const createdGoal = await this.goalsService.create(createGoalDto);
      response.status(HttpStatus.CREATED).json({
        status: 'success',
        message: 'Goal created successfully',
        data: createdGoal,
      });
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to create goal',
        error: error.message,
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateGoalDto: any,
    @Res() response: Response
  ) { 
    try {
      const updatedGoal = await this.goalsService.update(id, updateGoalDto);
      response.status(HttpStatus.OK).json({
        status: 'success',
        message: 'Goal updated successfully',
        data: updatedGoal,
      });
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to update goal',
        error: error.message,
      });
    }
  }

  @Get('goalsbyaccount')
  async getLiabilities(@Req() req: any) {
    const email = req?.user?.email;
    return this.goalsService.getGoalsByAccount(email); 
  }

  @Put('updategoals')
  updateGoal( @Body() data: any) {
    return this.goalsService.updateGoal(data);
  }
}
