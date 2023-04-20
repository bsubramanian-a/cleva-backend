import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ZohoCRMService } from 'src/services/zoho-crm.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly zohoCRMService: ZohoCRMService) {}

  @Get()
  async getContacts() {
    return await this.zohoCRMService.getContacts();
  }
}
