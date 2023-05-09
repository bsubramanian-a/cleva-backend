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
    try {
      const response = await axios.get(
        `${this.apiURL}/Contacts?fields=Email`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${process.env.ACCESS_TOKEN}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
    }
  }

  async getJournals(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiURL}/Chapter_Assigned?fields=Name,Email`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${process.env.ACCESS_TOKEN}`,
          }, 
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
    }
  }

  async getExercises(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiURL}/Chapter_Exercises?fields=Name,Email`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${process.env.ACCESS_TOKEN}`,
          }, 
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
    }
  }

  async getSummary(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiURL}/Chapter_Summary?fields=Name,Email`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${process.env.ACCESS_TOKEN}`,
          }, 
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
    }
  }

  async getAdvice(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiURL}/Advice?fields=Name,Email`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${process.env.ACCESS_TOKEN}`,
          }, 
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
    }
  }
  
  async getAssets(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiURL}/Financial_Accounts/search?criteria=(Asset_or_Liability:equals:Asset)&fields=Name,Email,Asset_or_Liability,Currency,Current_Value`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${process.env.ACCESS_TOKEN}`,
          }, 
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
    }
  }

  async getLiabilities(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiURL}/Financial_Accounts/search?criteria=(Asset_or_Liability:equals:Liability)&fields=Name,Email,Asset_or_Liability,Currency,Current_Value`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${process.env.ACCESS_TOKEN}`,
          }, 
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
    }
  }

  async getProfile(email:string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiURL}/Accounts/search?criteria=(Owner.email:equals:${email})`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${process.env.ACCESS_TOKEN}`,
          }, 
        },
      );
      console.log("getProfile response", response);
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
    }
  }

  private async refreshAccessToken(): Promise<any> {
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
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return response.data.access_token;
      })
      .catch((error) => {
        console.log('Getting Error2');
        console.log(error);
      });
  }
}
