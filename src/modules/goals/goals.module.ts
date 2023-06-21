import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { goalsProviders } from './goals.providers';

@Module({
  controllers: [GoalsController],
  providers: [GoalsService, ...goalsProviders],
})
export class GoalsModule {}
