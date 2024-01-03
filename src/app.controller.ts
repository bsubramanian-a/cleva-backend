import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import * as KJUR from 'jsrsasign';
import { Subject } from 'rxjs';
import { ZoomService } from './service/zoom.service';
const { v4: uuidv4 } = require('uuid');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly zoomService: ZoomService) { }

  @Post('end-meeting')
  async endMeeting(@Body() body: any): Promise<any> {
    console.log("body", body);
  }

  @Post('create-meeting')
  async createMeeting(@Body() body: { topic: string, time: string, date: string, userId: string, coachId: string }, @Req() req: any): Promise<any> {
    const { topic, time, date, userId, coachId } = body;
    const email = req?.user?.email;

    const endTime = this.addMinutesToTime(time, 30);

    console.log("topic", topic);
    console.log("time", time);
    console.log("endTime", endTime);
    console.log("date", date);
    console.log("userId", userId);
    console.log("coachId", coachId);

    const meeting = await this.zoomService.createMeeting(topic, time, endTime, userId, coachId);
    return "meeting";
  }

  addMinutesToTime(timeString: string, minutes: number): string {
    console.log("timeString", timeString);
    console.log("minutes", minutes);
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] ?[APap][Mm]$/;
    if (!timeRegex.test(timeString)) {
      throw new Error('Invalid time format. Use hh:mm AM/PM.');
    }
  
    const [hours, originalMinutes, period] = timeString.split(/:| /);
  
    const totalMinutes = parseInt(hours, 10) * 60 + parseInt(originalMinutes, 10) + minutes;
    const newHours = (Math.floor(totalMinutes / 60) % 12 + 12) % 12 || 12; // Handle 12-hour time
    const newMinutes = totalMinutes % 60;
  
    // Determine the new period correctly
    const newPeriod = totalMinutes >= 720 ? 'PM' : 'AM'; // 720 minutes is 12 hours
  
    const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')} ${newPeriod}`;
    return formattedTime;
  }  
  
  generateSignature(sdkKey, sdkSecret, sessionName, role, userIdentity) {
    const iat = Math.round(new Date().getTime() / 1000) - 30
    const exp = iat + 60 * 60 * 2
    const oHeader = { alg: 'HS256', typ: 'JWT' }

    const oPayload = {
      app_key: sdkKey,
      tpc: sessionName,
      role_type: role,
      session_key: uuidv4(),
      user_identity: userIdentity,
      version: 1,
      iat: iat,
      exp: exp
    }

    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret)
    return sdkJWT
  }

  @Get('get-zoom-token')
  async getZoomtoken(@Query('subject') subject: string, @Query('userId') userId: string, @Req() req: any) {
    return this.generateSignature(process.env.ZOOM_VIDEO_SDK_KEY, process.env.ZOOM_VIDEO_SDK_SECRET, subject, 1, userId);
  }

  @Post('verify-email')
  async verifyEmail(@Body() loginData: any) {
    return this.appService.verifyEmail(loginData);
  }

  @Post('verify-otp')
  async verifyOTP(@Body() otpData: any) {
    return this.appService.verifyOTP(otpData?.otp, otpData?.email);
  }

  @Post('verify-apple-email')
  async appleLogin(@Body() loginData: any) {
    return this.appService.appleLogin(loginData);
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
  updateProfile(@Body() datas: any, @Req() req: any) {
    const email = req?.user?.email;
    return this.appService.updateProfile(datas, email);
  }

  @Get('assets')
  async getAssets(@Req() req: any) {
    const email = req?.user?.email;
    return this.appService.getAssets(email);
  }

  @Post('asset')
  addAsset(@Body() assets: any, @Req() req: any) {
    const email = req?.user?.email;
    return this.appService.addAsset(assets, email);
  }

  @Delete('asset/:id')
  deleteAsset(@Param('id') id: string) {
    return this.appService.deleteAsset(id);
  }

  @Put('assets')
  update(@Body() assets: any) {
    return this.appService.updateAssets(assets);
  }

  @Put('accounts')
  updateaccounts(@Body() accounts: any) {
    return this.appService.updateAccounts(accounts);
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

  @Put('income')
  updateIncome(@Body() datas: any) {
    return this.appService.updateIncome(datas);
  }

  @Put('ina')
  updateINA(@Body() datas: any) {
    return this.appService.updateINA(datas);
  }

  @Get('accounts')
  async getAccounts(@Req() req: any) {
    const email = req?.user?.email;
    return this.appService.getAccounts(email);
  }
}
