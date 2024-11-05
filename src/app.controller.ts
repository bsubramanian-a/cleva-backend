import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import * as KJUR from 'jsrsasign';
import { Subject } from 'rxjs';
import { ZoomService } from './service/zoom.service';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
const { v4: uuidv4 } = require('uuid');

@ApiExtraModels()
export class CreateMeetingDto {
  @ApiProperty() topic: string;
  @ApiProperty() time: string;
  @ApiProperty() date: string;
  @ApiProperty() userId: string;
  @ApiProperty() coachId: string;
}
// export class MeetingData {
//   topic: string;
//   id: string;
//   createdAt: string;
//   coachUrl: string;
//   joinUrl: string;
//   email: string; 
//   userId: string; 
//   coachId: string; 
//   starttime: string; 
//   endtime: string;
// }


@ApiBearerAuth()
@Controller()

export class AppController {
  constructor(private readonly appService: AppService, private readonly zoomService: ZoomService) { }

  @Get('get-zoom-token')
  @ApiTags('Zoom Integrations')
  @ApiOperation({ summary: 'Get Zoom Token', description: 'Use this to get the token from zoom.' })  
  @ApiResponse({ status: 201, description: 'The Meeting has been successfully end.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'}) 
  async getZoomtoken(@Query('subject') subject: string, @Query('userId') userId: string, @Req() req: any) {
    return this.generateSignature(process.env.ZOOM_VIDEO_SDK_KEY, process.env.ZOOM_VIDEO_SDK_SECRET, subject, 1, userId);
  }

  @Post('login')
  @ApiTags('Login, Verify OTP, Verify Social Email')
  @ApiOperation({ summary: 'Get Zoom Token', description: 'Use this to get the token from zoom.' })  
  @ApiResponse({ status: 201, description: 'The Meeting has been successfully end.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async login(@Body() loginData: any) {
    return this.appService.login(loginData);
  }

  @Post('verify-otp')
  @ApiTags('Login, Verify OTP, Verify Social Email')
  @ApiOperation({ summary: 'Get Zoom Token', description: 'Use this to get the token from zoom.' })  
  @ApiResponse({ status: 201, description: 'The Meeting has been successfully end.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async verifyOTP(@Body() otpData: any) {
    return this.appService.verifyOTP(otpData?.otp, otpData?.email);
  }

  @Post('verify-email')
  @ApiTags('Login, Verify OTP, Verify Social Email')
  @ApiOperation({ summary: 'Get Zoom Token', description: 'Use this to get the token from zoom.' })  
  @ApiResponse({ status: 201, description: 'The Meeting has been successfully end.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async verifyEmail(@Body() loginData: any) {
    return this.appService.verifyEmail(loginData);
  } 

  @Post('verify-apple-email')
  @ApiTags('Login, Verify OTP, Verify Social Email')
  @ApiOperation({ summary: 'Get Zoom Token', description: 'Use this to get the token from zoom.' })  
  @ApiResponse({ status: 201, description: 'The Meeting has been successfully end.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async appleLogin(@Body() loginData: any) {
    return this.appService.appleLogin(loginData);
  }

  @Post('verify-social-email')
  @ApiTags('Login, Verify OTP, Verify Social Email')
  @ApiOperation({ summary: 'Get Zoom Token', description: 'Use this to get the token from zoom.' })  
  @ApiResponse({ status: 201, description: 'The Meeting has been successfully end.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async verifySocialEmail(@Body() loginData: any) {
    return this.appService.verifySocialEmail(loginData);
  }  

  @Post('create-meeting')
  @ApiTags('Meeting Management')
  @ApiOperation({ summary: 'Create Meeting', description: 'Use this to create meetings. This will also create a record in Zoho CRM also.' })  
  @ApiResponse({ status: 201, description: 'The Meeting has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'}) 
  async createMeeting( @Body() body: CreateMeetingDto, @Req() req: any): Promise<any> {
    const { topic, time, date, userId, coachId } = body;
    const email = req?.user?.email;

    const startTimeString = `${date} ${time}`;
    const endTimeString = `${date} ${this.addMinutesToTime(time, 30)}`;
  
    const starttime = new Date(startTimeString);
    const endtime = new Date(endTimeString);

    const meeting = await this.zoomService.createMeeting(topic, starttime, endtime, userId, coachId);

    console.log("meeting create res", meeting);

    const meetingData = {
      topic, id: meeting?.id, createdAt: meeting?.created_at, coachUrl: meeting?.start_url, joinUrl: meeting?.join_url, email, userId, coachId, starttime, endtime
    }

    return this.appService.addMeeting(meetingData);
  }

  

  @Post('end-meeting')
  @ApiTags('Meeting Management')
  @ApiOperation({ summary: 'End Meeting', description: 'Use this to end the meetings. This will also create a record in Zoho CRM also.' })  
  @ApiResponse({ status: 201, description: 'The Meeting has been successfully end.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'}) 
  async endMeeting(@Body() body: any) {
    console.log("body", body);
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

  @Get('journals')
  async getJournals(@Req() req: any) {
    const email = req?.user?.email;
    return this.appService.getJournals(email);
  }

  @Get('exercises')
  async getExercises(@Req() req: any) {
    const email = req?.user?.email;
    console.log("req1",req.user)
    console.log("email1", email);
    return this.appService.getExercises(email);
  }

  @Get('supersorted')
  async getSuperSorted(@Req() req: any) {
    const email = req?.user?.email;
    console.log("req",req.user)
    console.log("email", email);
    return this.appService.getSuperSorted(email);
  }

  @Get('planbestateplanwill')
  async getPlanBEstatePlanWill(@Req() req: any) {
    const email = req?.user?.email;
    console.log("req",req.user)
    console.log("email", email);
    return this.appService.getPlanBEstatePlanWill(email);
  }

  @Put('planbestateplanwill')
  updatePlanBEstatePlanWill(@Body() datas: any, @Req() req: any) {
    const email = req?.user?.email;
    return this.appService.updatePlanBEstatePlanWill(datas, email);
  }

  @Get('moneyonautodrive')
  async getMoneyOnAutoDrive(@Req() req: any) {
    const email = req?.user?.email;
    console.log("req",req.user)
    console.log("email", email);
    return this.appService.getMoneyOnAutoDrive(email);
  }

  @Get('planbemergencyfund')
  async getPlanBEmergencyFund(@Req() req: any) {
    const email = req?.user?.email;
    console.log("req",req.user)
    console.log("email", email);
    return this.appService.getPlanBEmergencyFund(email);
  }

  @Get('planbinsurance')
  async getPlanBInsurance(@Req() req: any) {
    const email = req?.user?.email;
    console.log("req",req.user)
    console.log("email", email);
    return this.appService.getPlanBInsurance(email);
  }

  @Put('planbinsurance')
  updatePlanBInsurance(@Body() datas: any, @Req() req: any) {
    const email = req?.user?.email;
    return this.appService.updatePlanBInsurance(datas, email);
  }

  

  @Get('insuranceneedanalysis')
  async getInsuranceNeedAnalysis(@Req() req: any) {
    const email = req?.user?.email;
    console.log("req",req.user)
    console.log("email", email);
    return this.appService.getInsuranceNeedAnalysis(email);
  }

  @Get('financialaccounts')
  async getFinancialAccounts(@Req() req: any) {
    const email = req?.user?.email;
    console.log("req",req.user)
    console.log("email", email);
    return this.appService.getFinancialAccounts(email);
  }

  @Put('financialaccounts')
  updateFinancialAccounts(@Body() datas: any, @Req() req: any) {
    const email = req?.user?.email;
    return this.appService.updateFinancialAccounts(datas, email);
  }

  @Get('debtonatedebt')
  async getDebtonateDebt(@Req() req: any) {
    const email = req?.user?.email;
    console.log("req",req.user)
    console.log("email", email);
    return this.appService.getDebtonateDebt(email);
  }

  @Get('householdexpenses')
  async getHouseHoldExpenses(@Req() req: any) {
    const email = req?.user?.email;
    console.log("req",req.user)
    console.log("email", email);
    return this.appService.getHouseHoldExpenses(email);
  }

  @Put('householdexpenses')
  updateHouseHoldExpenses(@Body() datas: any, @Req() req: any) {
    const email = req?.user?.email;
    return this.appService.updateHouseHoldExpenses(datas, email);
  }

  @Get('rollingaccountbalance')
  async getRollingAccountBalance(@Req() req: any) {
    const email = req?.user?.email;
    console.log("req",req.user)
    console.log("email", email);
    return this.appService.getRollingAccountBalance(email);
  }

  @Get('notes')
  async getNotes(@Req() req: any) {
    const email = req?.user?.email;
    console.log("req",req.user)
    console.log("email", email);
    return this.appService.getNotes(email);
  }

  @Get('coachnotes')
  async getCoachNotes(@Req() req: any) {
    const email = req?.user?.email;
    console.log("req",req.user)
    console.log("email", email);
    return this.appService.getCoachNotes(email);
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

  @Get('get_account/:accountId')
  async getSpecificAccount(@Req() req: any, @Param('accountId') accountId:string) {
    const email = req?.user?.email;
    return this.appService.getSpecificAccount(email, accountId);
  }

  @Get('meetings/:type')
  @ApiTags('Meeting Management')
  @ApiOperation({ summary: 'Get Meeting Type', description: 'This is used to get type of meeting.' }) 
  async getMeetings(@Req() req: any, @Param('type') type: string) {
    const email = req?.user?.email;
    return this.appService.getMeetings(email, type);
  }
}
