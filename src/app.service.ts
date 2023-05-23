import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ZohoCRMService } from './service/zoho.service';
import { UsersService } from './modules/users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AppService {
  constructor(private readonly ZohoCRMService: ZohoCRMService, private readonly userService: UsersService) {}

  // async getHello() {
  //   const assets = this.ZohoCRMService.getAssets();
  //   return assets;
  // }

  async verifyEmail(loginData: any) {
    const users = await this.ZohoCRMService.getUsers();
    const user = users?.data?.find((user:any) => user?.Email === loginData?.email);
    return {isUserExist: user?.Email ? true: false};
  }

  async login(loginData: any) {
    try{
      let user = await this.userService.findOneByUserEmail(loginData?.email);
      let isNewUser = false;
    
      if (!user) {
        isNewUser = true;
        user = await this.userService.create(loginData);
      }
    
      if (user.password === loginData.password) {
        const payload = {email: user.email };
        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(payload, secretKey);
        if(isNewUser){
          return {status: 'register', token};
        }else{
          return {status: 'login', token};
        }
      } else {
        return {status: 403, message: "Incorrect password!"};
      }
    }catch(err){
      console.log("login error", err);
    }
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

  async getLiabilities(email) {
    try{ 
      const liabilities = this.ZohoCRMService.getLiabilities(email);
      return liabilities;
    }catch(err){
      console.log("getLiabilities", err);
    }
  }

  async getProfile(email) {
    try{ 
      const profile = this.ZohoCRMService.getProfile(email);
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
}
