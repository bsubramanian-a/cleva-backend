import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as qs from 'qs';
import { OauthtokensService } from 'src/modules/oauthtokens/oauthtokens.service';
dotenv.config();

@Injectable()
export class ZohoCRMService {
  private readonly apiBaseUrl = 'https://accounts.zoho.com.au/oauth/v2';
  private readonly apiURL = 'https://www.zohoapis.com.au/crm/v2';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly oauthService: OauthtokensService) {}
  async getAccessToken(): Promise<any> {
    const data = qs.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URL,
      code: process.env.TEMP_GRANT_TOKEN,
      grant_type: 'authorization_code',
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.apiBaseUrl}/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getUsers(): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const response = await axios.get(
        `${this.apiURL}/Contacts?fields=Email`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getJournals();
      }
    }
  }

  async getJournals(): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const response = await axios.get(
        `${this.apiURL}/Chapter_Assigned?fields=Name,Email`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          }, 
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getJournals();
      }
    }
  }

  async getExercises(): Promise<any> { 
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const response = await axios.get(
        `${this.apiURL}/Chapter_Exercises?fields=Name,Email`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          }, 
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getJournals();
      }
    }
  }

  async getSummary(): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const response = await axios.get(
        `${this.apiURL}/Chapter_Summary?fields=Name,Email,Summary_Content`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          }, 
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getJournals();
      }
    }
  }

  async getAdvice(): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const response = await axios.get(
        `${this.apiURL}/Recommendations?fields=Name,Email,Recommendation_Description`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          }, 
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getJournals();
      }
    }
  }
  
  async getAssets(): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const response = await axios.get(
        `${this.apiURL}/Financial_Accounts/search?criteria=(Asset_or_Liability:equals:Asset)&fields=Name,Email,Asset_or_Liability,Currency,Current_Value`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          }, 
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getJournals();
      }
    }
  }

  async getLiabilities(): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const response = await axios.get(
        `${this.apiURL}/Financial_Accounts/search?criteria=(Asset_or_Liability:equals:Liability)&fields=Name,Email,Asset_or_Liability,Currency,Current_Value`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          }, 
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getJournals();
      }
    }
  }

  async getProfile(email:string): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const response = await axios.get(
        `${this.apiURL}/Contacts/search?criteria=(Email:equals:${email})`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          }, 
        },
      );
      console.log("getProfile response", response);
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getJournals();
      }
    }
  }

  private refreshAccessToken(id?:number): Promise<string> {
    return new Promise((resolve, reject) => {
      const data = qs.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: process.env.REFRESH_TOKEN,
      });
  
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${this.apiBaseUrl}/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
      };
  
      axios
        .request(config)
        .then(async (response) => {
          console.log(JSON.stringify(response.data));
          const update_data = {
            access_token: response.data.access_token
          };
          
          await this.oauthService.update(id, update_data)
          resolve(response.data.access_token);
        })
        .catch((error) => {
          console.log('Getting Error2');
          console.log(error);
          reject(error);
        });
    });
  }  
}
