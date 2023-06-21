import { Inject, Injectable } from '@nestjs/common';
import { GOAL_REPOSITORY } from 'src/core/constants';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalsService {
  constructor(
    @Inject(GOAL_REPOSITORY) private readonly goalRepository: typeof Goal,
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
}
