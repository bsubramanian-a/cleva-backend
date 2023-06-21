import { GOAL_REPOSITORY } from '../../core/constants';
import { Goal } from './entities/goal.entity';

export const goalsProviders = [
  {
    provide: GOAL_REPOSITORY,
    useValue: Goal,
  },
];
