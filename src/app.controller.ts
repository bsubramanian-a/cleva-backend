import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
  }

  @Post('verify-email')
  async verifyEmail(@Body() loginData: any) {
    return this.appService.verifyEmail(loginData);
  }

  @Post('login')
  async login(@Body() loginData: any) {
    return this.appService.login(loginData);
  }

  @Get('journals')
  async getJournals() {
    return this.appService.getJournals();
  }

  @Get('assets')
  async getAssets() {
    return this.appService.getAssets();
  }
}
