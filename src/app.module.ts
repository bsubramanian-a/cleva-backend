import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ZohoCRMService } from './services/zoho-crm.service';
// import { ContactsController } from './modules/contacts/contacts.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
