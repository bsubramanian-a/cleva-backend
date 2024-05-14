import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ZohoCRMService } from './service/zoho.service';
import { UsersService } from './modules/users/users.service';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { StreamChat } from 'stream-chat';

const chatClient = new StreamChat(process.env.STREAM_KEY, process.env.STREAM_SECRET);

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const generateRandomNumber = () => {
  const min = 100000; // Minimum value (inclusive)
  const max = 999999; // Maximum value (inclusive)

  // Generate a random number within the specified range
  const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);

  return randomNumber.toString(); // Convert the number to a string
};

@Injectable()
export class AppService {
  constructor(private readonly ZohoCRMService: ZohoCRMService, private readonly userService: UsersService) {}

  async sendVerificationEmail(email: string, verificationCode: string) {
    try {
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Verification Email',
        text: `Your verification code is: ${verificationCode}`,
      };

      await transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  }
  
  async verifyEmail(loginData: any) {
    console.log("logindata", loginData);
    const userType = loginData.user_type;
    // console.log("userType in verify email", userType);
    let dbuser = await this.userService.findOneByUserEmail(loginData?.email);

    if(!dbuser){
      dbuser = await this.userService.create({email: loginData?.email});
    }

    if(userType == 'advisor_coach') {
      const coachResult = await this.ZohoCRMService.getCoaches(loginData?.email);

      console.log("coachResult", coachResult?.users);

      if(coachResult?.users?.length > 0){
        // const coach = coachResult?.users[0];
        const randomCode = generateRandomNumber();
        // console.log("randomCode", randomCode);

        await this.userService.update(dbuser?.id, { otp: randomCode });

        // console.log("dbuser in coach", dbuser);
        await this.sendVerificationEmail(loginData?.email, randomCode);

        return {isUserExist: true};
      }

      return {isUserExist: false};
    } else {
      const users = await this.ZohoCRMService.getUsers();
      const user = users?.data?.find((user:any) => user?.Email === loginData?.email);

      if(user?.Email){
        const randomCode = generateRandomNumber();
        console.log("randomCode", randomCode);
        await this.userService.update(dbuser?.id, { otp: randomCode });
        await this.sendVerificationEmail(user?.Email, randomCode);

        return {isUserExist: true}
      }
      return {isUserExist: false};
    }
  }
  
  async verifyOTP(otp: any, email:string) {
    let user = await this.userService.findOneByUserEmail(email);
    if(user?.otp == otp){
      await this.userService.update(user?.id, { otp: "" });
      return {isCorrect: true};
    }

    return {error: "Otp is incorrect, please try again"};
  }

  async appleLogin(data: any) {
    const userType = data.user_type;
    let email = data?.email;
    let apple_user_id = data?.apple_user_id;
  
    if (!email) {
      const user = await this.userService.findOneByAppleUserId(apple_user_id);
  
      if (!user) {
        return { status: 'failed', message: "Login failed, please try a different method!" };
      }
  
      email = user.dataValues.email;
    } else {
      let user = await this.userService.findOneByUserEmail(email);
  
      if (user) {
        // User already exists with the given email, update the apple_user_id
        user.apple_user_id = apple_user_id;
        await this.userService.updateUser(user.id, user);
      } else {
        // User doesn't exist with the given email, create a new user
        user = await this.userService.create({ email, apple_user_id });
      }
    }
  
    const users = await this.ZohoCRMService.getUsers();
    const existingUser = users?.data?.find((user: any) => user.Email === email);
  
    if (!existingUser?.Email) {
      return { isUserExist: false };
    }
  
    try {
      let user = await this.userService.findOneByUserEmail(email);
      let isNewUser = false;
  
      if (!user) {
        isNewUser = true;
        user = await this.userService.create({ email });
      }
  
      const zohoUser: any = await this.ZohoCRMService.getUser(user?.email);
      const coach = await this.ZohoCRMService.getCoaches(zohoUser?.Owner?.email);
      const payload = { email: user.email};
      const secretKey = process.env.SECRET_KEY;
      const token = jwt.sign(payload, secretKey);

      const streamToken = await chatClient.createToken(zohoUser?.id?.toString());

      const userDetails = {
        name: zohoUser?.Full_Name,
        id: zohoUser?.id,
        streamToken,
        owner: zohoUser?.Owner,
        userType,
        coach_url: userType == 'advisor_coach' ? "" : coach?.users[0]?.Zoho_Bookings_Link
      }
  
      return { status: isNewUser ? 'register' : 'login', token, user: userDetails };
    } catch (err) {
      console.log("login error", err);
    }
  }  
  
  async verifySocialEmail(data: any) {
    const userType = data.user_type;
    let email = data?.email;
    console.log("verifySocialEmail", email);
    const users = await this.ZohoCRMService.getUsers();
    console.log("users from zoho crm service", users)
    const user = users?.data?.find((user:any) => user?.Email === email);
    if(!user?.Email){
      return {isUserExist : false}
    }
    
    try{
      let user = await this.userService.findOneByUserEmail(email);
      let isNewUser = false;
    
      if (!user) {
        isNewUser = true;
        user = await this.userService.create(email);
      }

      const zohoUser: any = await this.ZohoCRMService.getUser(user?.email)
      const coach = await this.ZohoCRMService.getCoaches(zohoUser?.Owner?.email);
      const payload = {email: user.email};
      const secretKey = process.env.SECRET_KEY;
      const token = jwt.sign(payload, secretKey);

      const streamToken = await chatClient.createToken(zohoUser?.id?.toString());

      const userDetails = {
        name: zohoUser?.Full_Name,
        id: zohoUser?.id,
        streamToken,
        owner: zohoUser?.Owner,
        userType,
        coach_url: userType == 'advisor_coach' ? "" : coach?.users[0]?.Zoho_Bookings_Link
      }

      if(isNewUser){
        return {status: 'register', token, user: userDetails};
      }else{
        return {status: 'login', token, user: userDetails};
      }
    }catch(err){
      console.log("login error", err);
    }
  }

  async login(loginData: any) {
    try{
      const userType = loginData.user_type;
      let user = await this.userService.findOneByUserEmail(loginData?.email);
      let isNewUser = false;
      let coach;

      console.log("user",user);
      console.log("loginData", loginData);
    
      if (!user) {
        isNewUser = true;
        console.log("yes new user", loginData);
        user = await this.userService.create(loginData);
      } else if(user.password == null) {
        let updateuser = await this.userService.update(user.id, { email: loginData.email, password: loginData.password });
        console.log("updateuser", updateuser);
        user = await this.userService.findOneByUserEmail(loginData?.email);
        console.log("updated user", user);
      }


      console.log("passwords",user.password, loginData.password)
    
      if (user.password === loginData.password) {
        let zohoUser: any;

        if(userType == 'advisor_coach') {
          console.log("userType", userType);
          let coach = await this.ZohoCRMService.getCoaches(user?.email);
          zohoUser = coach?.users[0];
        } else {
          console.log("userType", userType);
          zohoUser = await this.ZohoCRMService.getUser(user?.email);
          console.log("zohoUser", zohoUser);
          coach = await this.ZohoCRMService.getCoaches(zohoUser?.Owner?.email);          
          console.log("coach", coach);
        }

        // console.log("zohoUser", zohoUser);
        
        const payload = {email: user.email};
        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(payload, secretKey);
        console.log("payload",payload)
        console.log("token",token)
        console.log("secretKey",secretKey)

        const streamToken = await chatClient.createToken(zohoUser?.id?.toString());
        console.log("streamToken",streamToken)

        const userDetails = {
          name: userType == 'advisor_coach' ? zohoUser?.full_name : zohoUser?.Full_Name,
          id: zohoUser?.id,
          streamToken,
          owner: zohoUser?.Owner,
          userType,
          coach_url: userType == 'advisor_coach' ? "" : coach?.users[0]?.Zoho_Bookings_Link
        }
        console.log("userDetails",userDetails)
        console.log("isNewUser",isNewUser)
        
        if(isNewUser){
          console.log("coming inside new user")
          return {status: 'register', token, user: userDetails};
        }else{
          console.log("coming inside login")
          return {status: 'login', token, user: userDetails};
        }
      } else {
        return {status: 403, message: "Incorrect password!"};
      }
    }catch(err){
      console.log("login error", err);
    }
  }  

  async getMeetings(email, type){
    try{
      const meetings = await this.ZohoCRMService.getMeetings(email, type);

      return meetings;
    }catch(err){
      console.log("getJournal", err);
    }
  }

  async addMeeting(meetingData: any) {
    return await this.ZohoCRMService.addMeeting(meetingData);
  }

  async getJournals(email){
    try{
      const journals = await this.ZohoCRMService.getJournals(email);
      // console.log("journals", journals);
      return journals;
    }catch(err){
      console.log("getJournal", err);
    }
  }

  async getExercises(email){
    try{ 
      const excercises = await this.ZohoCRMService.getExercises(email);
      return excercises;
    }catch(err){
      console.log("getExercises", err);
    }
  }

  async getSummary(email){
    try{ 
      const summaries = await this.ZohoCRMService.getSummary(email);
      return summaries;
    }catch(err){
      console.log("getSummary", err);
    }
  }

  async getAdvice(email){
    try{ 
      const advice = await this.ZohoCRMService.getAdvice(email);
      return advice;
    }catch(err){
      console.log("getAdvice", err);
    }
  }

  async getAssets(email) {
    try{ 
      const assets = this.ZohoCRMService.getAssets(email);
      return assets;
    }catch(err){
      console.log("getAssets", err);
    }
  }

  async updateAssets(assets: any) {
    return await this.ZohoCRMService.updateAssets(assets);
  }

  async addAsset(asset: any, email:string) {
    return await this.ZohoCRMService.addAsset(asset, email);
  }

  async deleteAsset(id: string) {
    return await this.ZohoCRMService.deleteAsset(id);
  }

  async getLiabilities(email) {
    try{ 
      const liabilities = this.ZohoCRMService.getLiabilities(email);
      return liabilities;
    }catch(err){
      console.log("getLiabilities", err);
    }
  }

  async getAccounts(email) {
    try{ 
      const liabilities = this.ZohoCRMService.getAccounts(email);
      return liabilities;
    }catch(err){
      console.log("getAccounts", err);
    }
  }

  async addLiability(asset: any, email:string) {
    return await this.ZohoCRMService.addLiability(asset, email);
  }

  async deleteLiability(id: string) {
    return await this.ZohoCRMService.deleteLiability(id);
  }

  async getProfile(email) {
    try{ 
      const profile = this.ZohoCRMService.getProfile(email);
      console.log("profile", profile);
      return profile;
    }catch(err){
      console.log("getProfile", err);
    }
  }

  async updateProfile(datas: any, email:string) {
    return await this.ZohoCRMService.updateProfile(datas, email);
  }

  async getAccount() {
    try{ 
      const profile = this.ZohoCRMService.getAccount();
      return profile;
    }catch(err){
      console.log("getProfile", err);
    }
  }

  async updateDependant(datas: any) {
    return await this.ZohoCRMService.updateDependant(datas);
  }

  async updateEmployment(datas: any) {
    return await this.ZohoCRMService.updateEmployment(datas);
  }

  async updateExpenses(datas: any) {
    return await this.ZohoCRMService.updateExpenses(datas);
  }

  async updateIncome(datas: any) {
    return await this.ZohoCRMService.updateIncome(datas);
  }

  async updateINA(datas: any) {
    return await this.ZohoCRMService.updateINA(datas);
  }

  async updateAccounts(accounts: any) {
    return await this.ZohoCRMService.updateAccounts(accounts);
  }

  async checkScheduleAvailable(startTime: any, endTime: any, email: any) {
    return await this.ZohoCRMService.checkScheduleAvailable(startTime, endTime, email);    
  }
}
