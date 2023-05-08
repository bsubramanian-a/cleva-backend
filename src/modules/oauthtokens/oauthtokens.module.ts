import { Module } from '@nestjs/common';
import { OauthtokensService } from './oauthtokens.service';
import { OauthtokensController } from './oauthtokens.controller';
import { oauthtokensProviders } from './oauthtokens.provider';

@Module({
  controllers: [OauthtokensController],
  providers: [OauthtokensService, ...oauthtokensProviders],
})
export class OauthtokensModule {}
