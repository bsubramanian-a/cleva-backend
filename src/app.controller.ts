import { Body, Controller, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
  }

  @Get('test')
  async getTest() {
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

  @Get('exercises')
  async getExercises() {
    return this.appService.getExercises();
  }

  @Get('summary')
  async getSummary() {
    return this.appService.getSummary();
  }

  @Get('advice')
  async getAdvice() {
    return this.appService.getAdvice();
  }

  @Get('profile')
  async getProfile(@Req() req: any) {
    const email = req?.user?.email;
    return this.appService.getProfile(email);
  }

  @Get('assets')
  async getAssets() {
    return this.appService.getAssets();
  }
 
  @Put('assets')
  update( @Body() assets: any) {
    return this.appService.updateAssets(assets);
  }

  @Get('liabilities')
  async getLiabilities() {
    return this.appService.getLiabilities(); 
  }
}
