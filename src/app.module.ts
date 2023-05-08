import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZohoCRMService } from './service/zoho.service';
import { DatabaseModule } from './core/database/database.module';
import { OauthtokensModule } from './modules/oauthtokens/oauthtokens.module';
import { OauthtokensService } from './modules/oauthtokens/oauthtokens.service';
import { oauthtokensProviders } from './modules/oauthtokens/oauthtokens.provider';

@Module({
  imports: [DatabaseModule, OauthtokensModule],
  controllers: [AppController],
  providers: [
    AppService,
    OauthtokensService,
    ZohoCRMService,
    ...oauthtokensProviders,
  ],
})
export class AppModule {}
