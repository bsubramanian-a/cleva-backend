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
        `${this.apiURL}/ChapterAssigned?fields=Email`,
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
      // console.log('refresh token', this.refreshAccessToken());
      //this.oAuthCredentials = await this.oauthService.findAll();
      //console.log(this.oAuthCredentials);
      //return this.oAuthCredentials;
      // const response = await axios.get(
      //   `${this.apiURL}/Assets?fields=Name,Owner,Email`,
      //   {
      //     headers: {
      //       Authorization: `Zoho-oauthtoken ${process.env.ACCESS_TOKEN}`,
      //     },
      //   },
      // );
      // return response.data;
      // const response = await axios.get(
      //   `${this.apiURL}/Financial_Accounts?fields=Account_Type`,
      //   {
      //     headers: {
      //       Authorization: `Zoho-oauthtoken ${process.env.ACCESS_TOKEN}`,
      //     },
      //   },
      // );
      // return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        const current_access_token: string = await this.refreshAccessToken();
        console.log('current_access_token', current_access_token);
        this.getAssets();
      } else {
        return error?.response?.data?.code;
      }
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
