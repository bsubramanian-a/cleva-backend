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
    private readonly ZohoCRMService: ZohoCRMService,
  ) {}

  async create(createGoalDto: any): Promise<Goal> {
    try {
      return await this.goalRepository.create<Goal>(createGoalDto);
    } catch (error) {
      //console.log(':error', error);
      throw new Error('Failed to create goal');
    }
  }

  async update(id: number, updateGoalDto: any): Promise<any> {
    try {
      return await this.goalRepository.update<Goal>(updateGoalDto, {
        where: { id },
      });
    } catch (error) {
      throw new Error('Failed to update goal');
    }
  }

  async getGoalsByAccount(email) {
    try {
      const goals = this.ZohoCRMService.getGoalsByAccount(email);
      return goals;
    } catch (err) {
      //console.log('getGoalsByAccount', err);
    }
  }

  async updateGoal(data) {
    try {
      const goals = this.ZohoCRMService.updateGoal(data, this.goalRepository);
      return goals;
    } catch (err) {
      //console.log('getGoalsByAccount', err);
    }
  }

  async createGoal(data) {
    try {
      const goals = await this.ZohoCRMService.createGoal(
        data,
        this.goalRepository,
      );
      return goals;
    } catch (err) {
      //console.log('getGoalsByAccount', err);
    }
  }

  async getChartData(
    tabSelection: string,
    zohoGoalId: string,
    todayValue:any
  ): Promise<{ x: string[]; y: number[] }> {

    const data = await this.goalRepository.findAll({
      where: {zohoGoalId},
      order: [['createdAt', 'ASC']],
      raw: true,
    });

    //console.log("data", data);

    const aggregatedData = {};
    // //console.log("tabSelection", tabSelection); 
    // Aggregate the data based on the specified interval
    for (const entry of data) {
      const timestamp = entry.createdAt.toISOString();
      const currentValue = entry.money_have;
      //console.log("current value", currentValue);
      const intervalKey = await this.getIntervalKey(timestamp, tabSelection);
      //console.log("intervalKey", intervalKey);

      if (!aggregatedData[intervalKey]) {
        aggregatedData[intervalKey] = {
          sum: 0,
          count: 0,
        };
      }

      aggregatedData[intervalKey].sum += parseInt(currentValue);
      aggregatedData[intervalKey].count += 1;
    }

    // const intervalKeys = Object.keys(aggregatedData);
    // let lastIntervalKey;

    // if (intervalKeys.length > 0) {
    //   lastIntervalKey = intervalKeys[intervalKeys.length - 1];
    // } else {
    //   // If no intervals exist, create one for the current date
    //   const today = new Date();
    //   lastIntervalKey = await this.getIntervalKey(today.toISOString(), tabSelection);

    //   aggregatedData[lastIntervalKey] = {
    //     sum: 0,
    //     count: 0,
    //   };
    // }

    // //console.log("lastIntervalKey", lastIntervalKey);
    // //console.log("aggregatedData", aggregatedData);

    // // Add the current value from Zoho to the last interval
    // aggregatedData[lastIntervalKey].sum += parseInt(todayValue);
    // aggregatedData[lastIntervalKey].count += 1;


    const chartData = {
      x: [],
      y: [],
    };

    // Prepare chart data based on the aggregated data
    Object.keys(aggregatedData).forEach((key) => {
      const averageValue:any = aggregatedData[key].sum / aggregatedData[key].count;

      chartData.x.push(key);
      chartData.y.push(parseInt(averageValue));
    });

    //console.log("chartData", chartData);

    return chartData;
  }

  async getIntervalKey(timestamp, interval) {
    const date = new Date(timestamp);
  
    if (interval === 'All') {
      // For the 'All' interval, return the year as the interval key
      return date.getFullYear().toString();
    } else if (interval === '6 mo') {
      // For the '6 mo' interval, return the year and half as the interval key
      const year = date.getFullYear();
      const half = date.getMonth() < 6 ? '1h' : '2h';
      return `${year} ${half}`;
    } else if (interval === '1 yr') {
      // For the '1 yr' interval, return the year as the interval key
      return date.getFullYear().toString();
    } else if (interval === '3 yrs') {
      // For the '3 yr' interval, return the decade as the interval key
      const year = date.getFullYear();
      const decade = Math.floor(year / 3) * 3;
      return `${decade}-${decade + 2}`;
    } else if (interval === '5 yrs') {
      // For the '5 yr' interval, return the decade as the interval key
      const year = date.getFullYear();
      const decade = Math.floor(year / 5) * 5;
      return `${decade}-${decade + 4}`;
    } else if (interval === '10 yrs') {
      // For the '10 yr' interval, return the decade as the interval key
      const year = date.getFullYear();
      const decade = Math.floor(year / 10) * 10;
      return `${decade}-${decade + 9}`;
    }
  
    // Handle other interval options as needed
    // ...
  }
  
}
