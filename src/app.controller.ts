import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // async getHello() {
  //   return this.appService.getHello();
  // }

  // @Get('test')
  // async getTest() {
  //   return this.appService.getHello();
  // }

  @Post('verify-email')
  async verifyEmail(@Body() loginData: any) {
    return this.appService.verifyEmail(loginData);
  }

  @Post('verify-otp')
  async verifyOTP(@Body() otpData: any) {
    return this.appService.verifyOTP(otpData?.otp, otpData?.email);
  }

  @Post('verify-social-email')
  async verifySocialEmail(@Body() loginData: any) {
    return this.appService.verifySocialEmail(loginData);
  }

  @Post('login')
  async login(@Body() loginData: any) {
    return this.appService.login(loginData);
  }

  @Get('journals')
  async getJournals(@Req() req: any) {
    const email = req?.user?.email;
    return this.appService.getJournals(email);   
  }

  @Get('exercises')
  async getExercises(@Req() req: any) {
    const email = req?.user?.email;
    return this.appService.getExercises(email);
  }

  @Get('summary')
  async getSummary(@Req() req: any) {
    const email = req?.user?.email;
    return this.appService.getSummary(email);
  }

  @Get('advice')
  async getAdvice(@Req() req: any) {
    const email = req?.user?.email;
    return this.appService.getAdvice(email);
  }

  @Get('profile')
  async getProfile(@Req() req: any) {
    const email = req?.user?.email;
    return this.appService.getProfile(email);
  }

  @Put('profile')
  updateProfile( @Body() datas: any, @Req() req: any) {
    const email = req?.user?.email;
    return this.appService.updateProfile(datas, email);
  }

  @Get('assets')
  async getAssets(@Req() req: any) {
    const email = req?.user?.email;
    return this.appService.getAssets(email);
  }

  @Post('asset')
  addAsset( @Body() assets: any, @Req() req: any) {
    const email = req?.user?.email;
    return this.appService.addAsset(assets, email);
  }

  @Delete('asset/:id')
  deleteAsset(@Param('id') id: string) {
    return this.appService.deleteAsset(id);
  }
 
  @Put('assets')
  update( @Body() assets: any) {
    return this.appService.updateAssets(assets);
  }

  @Get('liabilities')
  async getLiabilities(@Req() req: any) {
    const email = req?.user?.email;
    return this.appService.getLiabilities(email); 
  }

  @Delete('liability/:id')
  deleteLiability(@Param('id') id: string) {
    return this.appService.deleteLiability(id);
  }

  @Post('liability')
  addLiability(@Body() assets: any, @Req() req: any) {
    const email = req?.user?.email;
    return this.appService.addLiability(assets, email);
  }

  @Get('account')
  async getAccount() {
    return this.appService.getAccount(); 
  }
  
  @Put('dependant')
  updateDependant(@Body() datas: any) {
    return this.appService.updateDependant(datas);
  }

  @Put('employment')
  updateEmployment(@Body() datas: any) {
    return this.appService.updateEmployment(datas);
  }

  @Put('expenses')
  updateExpenses(@Body() datas: any) {
    return this.appService.updateExpenses(datas);
  }

  @Put('ina')
  updateINA(@Body() datas: any) {
    return this.appService.updateINA(datas);
  }
}
