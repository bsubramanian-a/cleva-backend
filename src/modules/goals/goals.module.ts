import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { goalsProviders } from './goals.providers';
import { ZohoCRMService } from 'src/service/zoho.service';
import { OauthtokensService } from '../oauthtokens/oauthtokens.service';
import { oauthtokensProviders } from '../oauthtokens/oauthtokens.provider';

@Module({
  controllers: [GoalsController],
  providers: [GoalsService, ZohoCRMService, OauthtokensService, ...oauthtokensProviders, ...goalsProviders],
})
export class GoalsModule {}
