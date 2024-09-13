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
  Query,
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
      const money_save = this.calculateSavings(
        createGoalDto?.targetDate,
        createGoalDto?.frequent_money_save,
        parseFloat(createGoalDto?.money_have),
        parseFloat(createGoalDto?.money_need),
      )?.toFixed(2);
      
      const goalData = {
        "ownerId": createGoalDto?.ownerId,
        "Goal_Owner_s": createGoalDto?.Goal_Owner_s,
        currentHouseHoldOwners: createGoalDto?.currentHouseHoldOwners,
        "Need_Money_By": createGoalDto?.when_money_need,
        "Description": createGoalDto?.description,
        "Current_Value": createGoalDto?.money_have,
        "Name": createGoalDto?.title,
        "Target_Date": createGoalDto?.targetDate,
        "Target_Value": createGoalDto?.money_need,
        "Goal_Type": createGoalDto?.goalType,
        "Priority": [
          createGoalDto?.goal_priority
        ],
        "Household": createGoalDto?.Household,
        "Save_Frequency": createGoalDto?.frequent_money_save,
        "Is_Financial_Goal" : createGoalDto?.isFinancial == "No" ? false : true,
        "Status": 'To Do',
      }

      const res = await this.goalsService.createGoal(goalData);
      console.log("zoho create goal res", res);

      const { currentHouseHoldOwners, ...updatedCreateGoalDto } = createGoalDto;
      let newData = { zohoGoalId: res?.zohoGoalId, ...updatedCreateGoalDto };

      await this.goalsService.create(newData);

      const dateObj = new Date(createGoalDto?.targetDate);
      const formattedDate = dateObj.toLocaleDateString('en-US');

      const frequency =
        createGoalDto?.frequent_money_save == 'Weekly'
          ? 'week'
          : createGoalDto?.frequent_money_save == 'Monthly'
          ? 'month'
          : 'fortnight';

      response.status(HttpStatus.OK).json({
        status: res?.status,
        targetDate: formattedDate,
        money_need: createGoalDto?.money_need,
        money_save: money_save,
        frequent_money_save: frequency
      });
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to create goal',
        error: error.message,
      });
    }
  }

  calculateSavings(targetDate, frequency, money_have, money_need) {
    const targetDateObj:any = new Date(targetDate);
    const currentDate:any = new Date();
  
    // Calculate the time difference in months, weeks, or fortnights based on the frequency
    let timeDifference;
    switch (frequency) {
      case 'Monthly':
        timeDifference = (targetDateObj.getFullYear() - currentDate.getFullYear()) * 12 + targetDateObj.getMonth() - currentDate.getMonth();
        if (targetDateObj.getDate() < currentDate.getDate()) {
          timeDifference--;
        }
        break;
      case 'Weekly':
        timeDifference = Math.ceil((targetDateObj - currentDate) / (1000 * 60 * 60 * 24 * 7));
        break;
      case 'Fortnightly':
        timeDifference = Math.ceil((targetDateObj - currentDate) / (1000 * 60 * 60 * 24 * 14));
        break;
      default:
        throw new Error('Invalid frequency');
    }
  
    // Calculate the amount to save in each period
    const amountToSave = (money_need - money_have) / timeDifference;
  
    return amountToSave;
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

  @Get('chartData')
  getChartData(@Query('interval') interval: string, @Query('zohoGoalId') zohoGoalId: string, @Query('todayValue') todayValue: any) {
    // Call the service method to fetch chart data based on the specified interval and zohoGoalId
    return this.goalsService.getChartData(interval, zohoGoalId, todayValue);
  }  
}
