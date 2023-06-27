import { Inject, Injectable } from '@nestjs/common';
import { GOAL_REPOSITORY } from 'src/core/constants';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { ZohoCRMService } from 'src/service/zoho.service';
import { Op } from 'sequelize';

@Injectable()
export class GoalsService {
  constructor(
    @Inject(GOAL_REPOSITORY) private readonly goalRepository: typeof Goal,
    private readonly ZohoCRMService: ZohoCRMService
  ) {}

  async create(createGoalDto: any): Promise<Goal> {
    try {
      return await this.goalRepository.create<Goal>(createGoalDto);
    } catch (error) {
      console.log(":error", error);
      throw new Error('Failed to create goal');
    }
  }
  
  async update(id: number, updateGoalDto: any): Promise<any> {
    try {
      return await this.goalRepository.update<Goal>(updateGoalDto, {
        where: {id},
      });
    } catch (error) {
      throw new Error('Failed to update goal'); 
    } 
  }

  async getGoalsByAccount(email) {
    try{ 
      const goals = this.ZohoCRMService.getGoalsByAccount(email);
      return goals;
    }catch(err){
      console.log("getGoalsByAccount", err);
    }
  }

  async updateGoal(data) {
    try{ 
      const goals = this.ZohoCRMService.updateGoal(data, this.goalRepository);
      return goals;
    }catch(err){
      console.log("getGoalsByAccount", err);
    }
  }

  async createGoal(data) {
    try{ 
      const goals = await this.ZohoCRMService.createGoal(data, this.goalRepository);
      return goals;
    }catch(err){
      console.log("getGoalsByAccount", err);
    }
  }

  async getChartData(tabSelection: string, zohoGoalId:string): Promise<{ x: string[], y: number[] }> {
    let startDate: Date | undefined;
    let interval: 'day' | 'week' | 'month' | 'year' = 'day'; // Adjust the interval as needed
  
    // if (tabSelection !== 'All') {
    //   if (tabSelection === '6 mo') {
    //     startDate = new Date();
    //     startDate.setMonth(startDate.getMonth() - 6);
    //     interval = 'week'; // Aggregate by week
    //   } else if (tabSelection === '1 yr') {
    //     startDate = new Date();
    //     startDate.setFullYear(startDate.getFullYear() - 1);
    //     interval = 'month'; // Aggregate by month
    //   } else if (tabSelection === '3 yrs') {
    //     startDate = new Date();
    //     startDate.setFullYear(startDate.getFullYear() - 3);
    //     interval = 'year'; // Aggregate by month
    //   } else if (tabSelection === '5 yrs') {
    //     startDate = new Date();
    //     startDate.setFullYear(startDate.getFullYear() - 5);
    //     interval = 'year'; // Aggregate by month
    //   } else {
    //     startDate = new Date();
    //     startDate.setFullYear(startDate.getFullYear() - 10);
    //     interval = 'year'; // Aggregate by month
    //   }
    // }

    // console.log("startDate", startDate);
    // console.log("tabSelection", tabSelection);
    // console.log("zohoGoalId", zohoGoalId);
    // console.log("interval", interval);
  
    const whereClause: any = {
      zohoGoalId: {
        [Op.eq]: zohoGoalId,
      },
    };
    
    if (startDate) {
      whereClause.createdAt = {
        [Op.gte]: startDate,
      };
    }
    
    const data = await this.goalRepository.findAll({
      where: whereClause,
      order: [['createdAt', 'ASC']],
      raw: true
    });

    // console.log("data", data);
    
    // Initialize the aggregatedData object with the appropriate keys for the selected interval
    const aggregatedData: Record<string, number> = {};

    // Sort the data by createdAt in ascending order
    data.sort((a: any, b: any) => a.createdAt - b.createdAt);

    // Iterate over the data to calculate the aggregated values
    data.forEach((entry: any, index: number) => {
      const timestamp = entry.createdAt.toISOString();
      const currentValue = entry.money_have;
    
      aggregatedData[timestamp] = parseFloat(currentValue);
    });
  
    console.log("aggregatedData", aggregatedData);
    const xValues: string[] = Object.keys(aggregatedData);
    const yValues: number[] = Object.values(aggregatedData);
  
    return { x: xValues, y: yValues };
  }  

  getIntervalKey(timestamp: string, interval: 'day' | 'week' | 'month' | 'year'): string {
    const date = new Date(timestamp);
  
    switch (interval) {
      case 'day':
        return date.toISOString().substring(0, 10); // YYYY-MM-DD
      case 'week': {
        const firstDayOfWeek = new Date(date.getTime());
        firstDayOfWeek.setDate(date.getDate() - date.getDay()); // Set to the first day (Sunday) of the week
        return firstDayOfWeek.toISOString().substring(0, 10); // YYYY-MM-DD
      }
      case 'month':
        return date.toISOString().substring(0, 7); // YYYY-MM
      case 'year':
        return date.toISOString().substring(0, 4); // YYYY
      default:
        throw new Error(`Invalid interval: ${interval}`);
    }
  }  
}
