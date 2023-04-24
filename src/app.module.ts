import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZohoCRMService } from './service/zoho.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ZohoCRMService],
})
export class AppModule {}
