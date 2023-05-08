import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ZohoCRMService } from './service/zoho.service';
import { UsersService } from './modules/users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AppService {
  constructor(private readonly ZohoCRMService: ZohoCRMService, private readonly userService: UsersService) {}

  async getHello() {
    const assets = this.ZohoCRMService.getAssets();
    return assets;
  }

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
          return {token};
        }
      } else {
        return "Incorrect password!";
      }
    }catch(err){
      console.log("login error", err);
    }
  }  

  async getJournals(){
    try{
      const journals = await this.ZohoCRMService.getJournals();
      console.log("journals", journals);
    }catch(err){
      console.log("getJournalExcercises", err);
    }
  }
  
  async getAssets() {
    const assets = this.ZohoCRMService.getAssets();
    return assets;
  }
}
