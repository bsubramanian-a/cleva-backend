import { Goal } from './../modules/goals/entities/goal.entity';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as qs from 'qs';
import { OauthtokensService } from 'src/modules/oauthtokens/oauthtokens.service';
import * as moment from 'moment-timezone';

dotenv.config();

@Injectable()
export class ZohoCRMService {
  private readonly apiBaseUrl = 'https://accounts.zoho.com.au/oauth/v2';
  private readonly apiURL = 'https://www.zohoapis.com.au/crm/v2';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly oauthService: OauthtokensService) { }
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

  async getUser(email: string): Promise<string> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    try {
      const response = await axios.get(
        `${this.apiURL}/Contacts/search?criteria=(Email:equals:${email})`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        }
      );

      console.log("contact search response", response?.data?.data);

      if (response?.data?.data?.length > 0) {
        return response?.data?.data[0];
      }

      return '';
    } catch (error) {
      console.log('Getting Error:', error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getUserDetails(email);
      }

      return "";
    }
  }

  async getUserById(id: string): Promise<string> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    try {
      const response = await axios.get(
        `${this.apiURL}/Contacts/search?criteria=(id:equals:${id})`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        }
      );

      if (response?.data?.data?.length > 0) {
        return response?.data?.data[0];
      }

      return '';
    } catch (error) {
      console.log('Getting Error:', error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getUserById(id);
      }

      return "";
    }
  }

  async getUserDetails(email: string): Promise<string> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    try {
      const response = await axios.get(
        `${this.apiURL}/Contacts/search?criteria=(Email:equals:${email})`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        }
      );

      if (response?.data?.data?.length > 0) {
        return response?.data?.data[0]?.Account_Name?.id || '';
      }

      return '';
    } catch (error) {
      console.log('Getting Error:', error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getUserDetails(email);
      }

      return "";
    }
  }

  async getOwnerId(email, access_token): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiURL}/Contacts/search?criteria=(Email:equals:${email})`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        },
      );
      // console.log("getUserDetails response", response);
      if (response?.data?.data?.length > 0) {
        return response?.data?.data[0]?.Created_By?.id
      }
      return "";
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
    }
  }

  async getAccount(): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const response = await axios.get(
        `${this.apiURL}/Contacts`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error2');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getAccount();
      }
    }
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
      console.log("users from zoho 2", response.data);
      return response.data;
    } catch (error) {
      console.log('Getting Error4');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getUsers();
      }
    }
  }

  async getCoachById(id: string): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const response = await axios.get(
        `${this.apiURL}/users/search?criteria=(id:equals:${id})`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        },
      );
      if(response?.data?.users?.length > 0){
        return response?.data?.users[0]
      }
      return [];
    } catch (error) {
      console.log('Getting Error3');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getCoachById(id);
      }
    }
  }

  async getCoaches(email: string): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const response = await axios.get(
        `${this.apiURL}/users/search?criteria=(email.id:equals:${email})`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log('Getting Error5');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getCoaches(email);
      }
    }
  }

  async getMeetings(email: any, type: string): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      if(type == "advisor_coach"){
        const response = await axios.get(
          `${this.apiURL}/Events/search?criteria=(Owner.email:equals:${email})`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          },
        );

        return response?.data?.data || [];
      }else{
        const response = await axios.get(
          `${this.apiURL}/Events`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          },
        );
        if(response?.data?.data?.length > 0){
          const userMeetings = response?.data?.data?.filter((meet: any) => meet?.Participants?.some((um: any) => um?.Email === email));
          return userMeetings;
        }

        return [];
      }
    } catch (error) {
      console.log('Getting Error6');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getMeetings(email, type);
      }
    }
  }

  convertToZohoFormatAndCalculateReminder(startTimeString, endTimeString, timeZone = 'Australia/Sydney') {
    // Convert to Zoho format with timezone offset
    let zohoFormattedStartDateTime = moment.tz(startTimeString, timeZone).format('YYYY-MM-DDTHH:mm:ssZ');

    let zohoFormattedEndDateTime = moment.tz(endTimeString, timeZone).format('YYYY-MM-DDTHH:mm:ssZ');
  
    // Calculate reminder time (15 minutes before)
    let zohoFormattedReminder = moment.tz(startTimeString, timeZone).subtract(15, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ');
  
    return {
      zohoFormattedStartDateTime,
      zohoFormattedEndDateTime,
      zohoFormattedReminder
    };
  }

  async addMeeting(data: any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    const {
      topic, id, createdAt, coachUrl, joinUrl, email, userId, coachId, starttime, endtime
    } = data;

    const result = this.convertToZohoFormatAndCalculateReminder(starttime, endtime);

    const user: any = await this.getUserById(userId);
    const coach: any = await this.getCoachById(coachId);

    console.log("coach", coach);

    const meetingData = {
      "$meeting_details": {
        topic, id, createdAt, coachUrl, joinUrl, starttime, endtime
      },
      "Participants": [{
        "id": userId,
        "Email": user?.Email,
        "name": user?.Full_Name,
        "invited": false,
        "type": "contact",
        "participant": userId,
        "status": "not_known",
      }, {
        "id": coachId,
        "Email": coach?.email,
        "name": coach?.full_name,
        "invited": false,
        "type": "contact",
        "participant": coachId,
        "status": "not_known"
      }],
      "Start_DateTime": result?.zohoFormattedStartDateTime,
      "End_DateTime": result?.zohoFormattedEndDateTime,
      "Event_Title": topic,
      "Remind_At": result?.zohoFormattedReminder
    }

    console.log("meeting data", meetingData);

    const requestData = {
      data: [meetingData],
    };

    try {
      const response = await axios.post(
        `${this.apiURL}/Events`,
        requestData,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Create meeting with API response", response?.data, response?.data?.data[0]?.details);
    } catch (error) {
      console.log('Error creating meeting with API', error?.response);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.addMeeting(data);
      }
    }
  }

  async getJournals(email: any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId = await this.getUserDetails(email);

      if (ownerId != "") {
        const response = await axios.get(
          `${this.apiURL}/Chapter_Assigned/search?criteria=(Account_HH.id:equals:${ownerId})&fields=Name,Email,Created_By`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          },
        );
        return response.data;
      }

      return { data: [] };
    } catch (error) {
      console.log('Getting Error7');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getJournals(email);
      }
    }
  }

  async getExercises(email: any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId = await this.getOwnerId(email, access_token);
      console.log("ownerId", ownerId, email);
      if (ownerId != "") {
        const response = await axios.get(
          `${this.apiURL}/Chapter_Exercises/search?criteria=(Created_By.id:equals:${ownerId})&fields=Name,Email,Created_By`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          },
        );
        return response.data;
      }

      return { data: [] };
    } catch (error) {
      console.log('Getting Error8');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getExercises(email);
      }
    }
  }

  async getSummary(email: any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId = await this.getOwnerId(email, access_token);

      if (ownerId != "") {
        const response = await axios.get(
          `${this.apiURL}/Chapter_Summary/search?criteria=(Created_By.id:equals:${ownerId})&fields=Name,Email,Created_By,Summary_Content`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          },
        );
        return response.data;
      }

      return { data: [] };
    } catch (error) {
      console.log('Getting Error9');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getSummary(email);
      }
    }
  }

  async getAdvice(email: any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId = await this.getOwnerId(email, access_token);

      if (ownerId != "") {
        const response = await axios.get(
          `${this.apiURL}/Recommendations/search?criteria=(Created_By.id:equals:${ownerId})&fields=Name,Email,Created_By,Recommendation_Description`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          },
        );
        return response.data;
      }

      return { data: [] };
    } catch (error) {
      console.log('Getting Error10');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getAdvice(email);
      }
    }
  }

  async getAssets(email: any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId = await this.getUserDetails(email);
      // console.log("ownerId.........", ownerId)

      if (ownerId != "") {
        const financialAccountsPromise = axios.get(
          `${this.apiURL}/Financial_Accounts/search?criteria=((Household.id:equals:${ownerId})and(Asset_or_Liability:equals:Asset))&fields=Name,Email,Asset_or_Liability,Currency,Current_Value,Household`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          }
        );

        const assetsPromise = axios.get(
          `${this.apiURL}/Assets/search?criteria=Household.id:equals:${ownerId}&fields=Name,Email,Asset_or_Liability,Currency,Current_Value,Household`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          }
        );

        const [financialAccountsResponse, assetsResponse] = await Promise.all([
          financialAccountsPromise,
          assetsPromise,
        ]);


        // Add a differentiating property to objects from Financial_Accounts API
        const assetsData = assetsResponse.data?.data?.map(item => {
          return {
            ...item,
            apiSource: 'assets',
          };
        });

        const mergedResponse = {
          data: [],
          info: null,
        };

        if (assetsData?.length > 0 && financialAccountsResponse?.data?.data) {
          mergedResponse.data = [...assetsData, ...financialAccountsResponse.data.data];
          mergedResponse.info = financialAccountsResponse.data.info;
        } else if (assetsData?.length > 0) {
          mergedResponse.data = assetsData;
        } else if (financialAccountsResponse?.data?.data) {
          mergedResponse.data = financialAccountsResponse.data.data;
          mergedResponse.info = financialAccountsResponse.data.info;
        }

        return mergedResponse;
      }

      return { data: [] };
    } catch (error) {
      console.log('Getting Error11');
      console.log(error);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getAssets(email);
      }
    }
  }

  async addAsset(asset: any, email: string): Promise<any> {
    const profile = await this.getProfile(email);
    const household = profile?.data[0]?.Account_Name;
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    asset.Household = household;
    try {
      const requestData = {
        data: [asset],
      };
      const response = await axios.post(
        `${this.apiURL}/Assets`,
        requestData,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log('Error adding assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.addAsset(asset, email);
      }
    }
  }

  async deleteAsset(assetId: string): Promise<void> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    try {
      let deleted = false;

      // Attempt to delete from the Assets API
      try {
        const assetResponse = await axios.delete(
          `${this.apiURL}/Assets/${assetId}`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          }
        );

        if (assetResponse.status === 200) {
          console.log('Asset deleted from Assets API successfully');
          deleted = true;
          return assetResponse?.data;
        }
      } catch (assetError) {
        console.log('Error deleting asset from Assets API', assetError?.response?.data);
      }

      // If not deleted from Assets API, attempt to delete from the Financial Accounts API
      if (!deleted) {
        try {
          const financialAccountResponse = await axios.delete(
            `${this.apiURL}/Financial_Accounts/${assetId}`,
            {
              headers: {
                Authorization: `Zoho-oauthtoken ${access_token}`,
              },
            }
          );

          if (financialAccountResponse.status === 200) {
            console.log('Asset deleted from Financial Accounts API successfully');
            deleted = true;
            return financialAccountResponse?.data;
          }
        } catch (financialAccountError) {
          console.log('Error deleting asset from Financial Accounts API', financialAccountError?.response?.data);
        }
      }

      // If not deleted from either API, asset ID was not found
      if (!deleted) {
        console.log('Asset ID not found');
      }
    } catch (error) {
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.deleteAsset(assetId);
      }
    }
  }

  async addLiability(liability: any, email: string): Promise<any> {
    const profile = await this.getProfile(email);
    const household = profile?.data[0]?.Account_Name;

    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    liability.Household = household;
    liability.Asset_or_Liability = 'Liability';

    try {
      const requestData = {
        data: [liability],
      };
      const response = await axios.post(
        `${this.apiURL}/Financial_Accounts`,
        requestData,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log('Error adding assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.addLiability(liability, email);
      }
    }
  }

  async deleteLiability(liabilityId: string): Promise<void> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    try {
      const financialAccountResponse = await axios.delete(
        `${this.apiURL}/Financial_Accounts/${liabilityId}`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        }
      );

      if (financialAccountResponse.status === 200) {
        console.log('Asset deleted from Financial Accounts API successfully');
        return financialAccountResponse?.data;
      }
    } catch (error) {
      console.log('Error adding assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.deleteLiability(liabilityId);
      }
    }
  }

  async updateAssets(assets: any[]): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    // Filter assets based on the "apiSource" field
    const assetsWithAPI = assets.filter(asset => asset.apiSource);
    const assetsWithoutAPI = assets.filter(asset => !asset.apiSource);
    // console.log("assetsWithAPI", assetsWithAPI);
    // console.log("assetsWithoutAPI", assetsWithoutAPI);

    try {
      // Update assets with "apiSource" using the corresponding API
      if (assetsWithAPI.length > 0) {
        const requestData = {
          data: assetsWithAPI
        };

        try {
          const response = await axios.put(
            `${this.apiURL}/Assets`,
            requestData,
            {
              headers: {
                Authorization: `Zoho-oauthtoken ${access_token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          // console.log("Update assets with API response", response.data);
          // Handle the response as needed
        } catch (error) {
          console.log('Error updating assets with API', error?.response?.data);
          if (error?.response?.data?.code === 'INVALID_TOKEN') {
            await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
            return this.updateAssets(assets);
          }
          // Handle other errors as needed
        }
      }

      // Update assets without "apiSource" using the Financial_Accounts API
      if (assetsWithoutAPI.length > 0) {
        const requestData = {
          data: assetsWithoutAPI,
        };

        try {
          const response = await axios.put(
            `${this.apiURL}/Financial_Accounts`,
            requestData,
            {
              headers: {
                Authorization: `Zoho-oauthtoken ${access_token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          // console.log("Update assets without API response", response.data);
          // Handle the response as needed
        } catch (error) {
          console.log('Error updating assets without API', error?.response?.data);
          if (error?.response?.data?.code === 'INVALID_TOKEN') {
            await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
            return this.updateAssets(assets);
          }
          // Handle other errors as needed
        }
      }

      return { data: [] };
    } catch (error) {
      console.log('Getting Error12');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateAssets(assets);
      }
    }
  }

  async updateProfile(datas: any, email: string): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    console.log("profile datas", datas, email);
    const requestData = {
      data: datas,
    };
    try {
      const response = await axios.post(
        `${this.apiURL}/Contacts/upsert?searchColumn=Email&searchValue=${email}`,
        requestData,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // console.log("updateAssets response", response)
      return response.data;
    } catch (error) {
      console.log('Getting Error13');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateProfile(datas, email);
      }
    }
  }

  async getLiabilities(email: any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId = await this.getUserDetails(email);

      if (ownerId != "") {
        const response = await axios.get(
          `${this.apiURL}/Financial_Accounts/search?criteria=((Household.id:equals:${ownerId})and(Asset_or_Liability:equals:Liability))&fields=Name,Email,Asset_or_Liability,Currency,Current_Value,Household`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          }
        );

        return response.data;
      }

      return { data: [] };
    } catch (error) {
      console.log('Getting Error14');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getLiabilities(email);
      }
    }
  }

  async updateDependant(datas: any[]): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    const requestData = {
      data: datas,
    };

    try {
      const response = await axios.put(
        `${this.apiURL}/Dependants`,
        requestData,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Success message
        return { status: response.status, "message": "Updated Successfully" };
      } else {
        // Generic failure message
        return { status: response.status, "message": "Update failed. Please try again later." };
      }
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateDependant(datas);
      }
      return { "message": error?.message };
      // Handle other errors as needed
    }
  }

  async updateEmployment(datas: any[]): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    const requestData = {
      data: datas,
    };

    try {
      const response = await axios.put(
        `${this.apiURL}/Employment_Details`,
        requestData,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Success message
        return { status: response.status, "message": "Updated Successfully" };
      } else {
        // Generic failure message
        return { status: response.status, "message": "Update failed. Please try again later." };
      }
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateEmployment(datas);
      }
      return { "message": error?.message };
      // Handle other errors as needed
    }
  }

  async updateExpenses(datas: any[]): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    const requestData = {
      data: datas,
    };

    try {
      const response = await axios.put(
        `${this.apiURL}/Household_Expenses`,
        requestData,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Success message
        return { status: response.status, "message": "Updated Successfully" };
      } else {
        // Generic failure message
        return { status: response.status, "message": "Update failed. Please try again later." };
      }
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateExpenses(datas);
      }
      return { "message": error?.message };
      // Handle other errors as needed
    }
  }

  async updateIncome(datas: any[]): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    const requestData = {
      data: datas,
    };

    try {
      const response = await axios.put(
        `${this.apiURL}/Household_Income`,
        requestData,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Success message
        return { status: response.status, "message": "Updated Successfully" };
      } else {
        // Generic failure message
        return { status: response.status, "message": "Update failed. Please try again later." };
      }
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateExpenses(datas);
      }
      return { "message": error?.message };
      // Handle other errors as needed
    }
  }

  async updateINA(datas: any[]): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    const requestData = {
      data: datas,
    };

    try {
      const response = await axios.put(
        `${this.apiURL}/INA`,
        requestData,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("response", response?.data?.data[0]?.details);

      if (response.status === 200) {
        // Success message
        return { status: response.status, "message": "Updated Successfully" };
      } else {
        // Generic failure message
        return { status: response.status, "message": "Update failed. Please try again later." };
      }
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateINA(datas);
      }
      return { "message": error?.message };
      // Handle other errors as needed
    }
  }

  async getProfile(email: string): Promise<any> {
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

      const account_id = response?.data?.data[0]?.Account_Name?.id;
      let accounts = [];
      if (account_id) {
        const nresponse = await axios.get(
          `${this.apiURL}/Contacts/search?criteria=(Account_Name.id:equals:${account_id})`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          },
        );

        const dependantResponse = await axios.get(
          `${this.apiURL}/Dependants/search?criteria=(Dependant_of.id:equals:${account_id})&fields=Name,Age,Record_Image,Email,Dependant_Until2,Dependant_of,Dependant_of_Person`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          },
        );

        if (nresponse?.data?.data?.length > 0) {
          response.data.data[0].accounts = nresponse?.data?.data?.filter((acc: any) => acc?.Email != null && acc?.Email != email);
        }

        let employmentResponse;

        if (response.data.data[0].accounts && response.data.data[0].accounts[0]?.id) {
          employmentResponse = await axios.get(
            `${this.apiURL}/Employment_Details/search?criteria=((Client_Name.id:equals:${response.data.data[0].id}) or (Client_Name.id:equals:${response.data.data[0].accounts[0].id}))&sort_by=Created_Time&sort_order=desc`,
            {
              headers: {
                Authorization: `Zoho-oauthtoken ${access_token}`,
              },
            }
          );
        } else {
          employmentResponse = await axios.get(
            `${this.apiURL}/Employment_Details/search?criteria=(Client_Name.id:equals:${response.data.data[0].id})`,
            {
              headers: {
                Authorization: `Zoho-oauthtoken ${access_token}`,
              },
            }
          );
        }

        const incomeResponse = await axios.get(
          `${this.apiURL}/Household_Income/search?criteria=Household.id:equals:${account_id}&sort_by=Created_Time&sort_order=desc`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          }
        );

        const expenseResponse = await axios.get(
          `${this.apiURL}/Household_Expenses/search?criteria=(Household.id:equals:${account_id})`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          },
        );

        let insuranceResponse;

        if (response.data.data[0].accounts && response.data.data[0].accounts[0]?.id) {
          insuranceResponse = await axios.get(
            `${this.apiURL}/INA/search?criteria=((Client_Name.id:equals:${response.data.data[0].id}) or (Client_Name.id:equals:${response.data.data[0].accounts[0].id}))`,
            {
              headers: {
                Authorization: `Zoho-oauthtoken ${access_token}`,
              },
            }
          );
        } else {
          employmentResponse = await axios.get(
            `${this.apiURL}/Employment_Details/search?criteria=(Client_Name.id:equals:${response.data.data[0].id})`,
            {
              headers: {
                Authorization: `Zoho-oauthtoken ${access_token}`,
              },
            }
          );
        }

        if (dependantResponse?.data?.data?.length > 0) {
          response.data.data[0].dependants = dependantResponse?.data?.data
        }

        if (employmentResponse?.data?.data?.length > 0) {
          response.data.data[0].employmentDetails = employmentResponse?.data?.data
        }

        if (incomeResponse?.data?.data?.length > 0) {
          response.data.data[0].income = incomeResponse?.data?.data;
        }

        if (expenseResponse?.data?.data?.length > 0) {
          response.data.data[0].expenses = expenseResponse?.data?.data
        }

        if (insuranceResponse?.data?.data?.length > 0) {
          response.data.data[0].insurance = insuranceResponse?.data?.data
        }
      }
      return response.data;
    } catch (error) {
      console.log('Getting Error15');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getProfile(email);
      }
    }
  }

  private refreshAccessToken(id?: number): Promise<string> {
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

      console.log("config",config);

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

  private refreshAccessTokenV4(id?: number): Promise<string> {
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
        url: `${this.apiBaseUrl}/token?refresh_token=${process.env.REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
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
          console.log('Getting Error3');
          console.log(error);
          reject(error);
        });
    });
  }

  async getGoalsByAccount(email: any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId = await this.getUserDetails(email);

      if (ownerId != "") {
        const response = await axios.get(
          `${this.apiURL}/Goals/search?criteria=Household.id:equals:${ownerId}&sort_by=Created_Time&sort_order=desc`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          }
        );

        // let goals = response?.data;
        // let goalIds = [];

        // if(response?.data?.data?.length > 0){
        //   goals?.data?.map((goals:any) => {
        //     goalIds?.push(goals?.id); 
        //   })
        // }

        // console.log("response?.data goals by account", response?.data);

        if (response?.data?.data?.length > 0) {
          for (const goal of response.data.data) {
            // console.log("goal", goal);

            const goalxcontacts = await axios.get(
              `${this.apiURL}/Goals_X_Contacts/search?criteria=(Goals.id:equals:${goal?.id})&fields=Goal_Owner_s,Goals`,
              {
                headers: {
                  Authorization: `Zoho-oauthtoken ${access_token}`,
                },
              }
            );

            if (goalxcontacts?.data?.data?.length > 0) {
              goal['owners'] = goalxcontacts?.data?.data;
            }
          }
        }

        // const goalxcontacts = await axios.get(
        //   `${this.apiURL}/Goals_X_Contacts/search?criteria=(Goals.id:in:${goalIds})&fields=Goal_Owner_s,Goals`,
        //   {
        //     headers: {
        //       Authorization: `Zoho-oauthtoken ${access_token}`,
        //     },
        //   }
        // );

        // console.log("goalxcontacts", goalxcontacts);

        return response.data;
      }

      return { data: [] };
    } catch (error) {
      console.log('Getting Error16');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getGoalsByAccount(email);
      }
    }
  }

  async getGoalsById(id: any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    try {
      const response = await axios.get(
        `${this.apiURL}/Goals/search?criteria=id:equals:${id}`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getGoalsById(id);
      }
      return { message: error?.message };
      // Handle other errors as needed
    }
  }

  async createGoal(datas: any, goalRepository: any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    console.log('datas', datas);

    const { currentHouseHoldOwners, Goal_Owner_s, ownerId, ...updatedDatas } = datas;

    const requestData = {
      data: [updatedDatas],
    };

    try {
      const response = await axios.post(
        `${this.apiURL}/Goals`,
        requestData,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // console.log("create goal owner", datas);

      if (datas?.Goal_Owner_s) {
        let tempOwner = [];
        if (datas?.Goal_Owner_s == 'Joint') {
          datas?.currentHouseHoldOwners?.map((cHO: any) => {
            let temp = {
              Goal_Owner_s: { id: cHO?.id, name: cHO?.name },
              Goals: {
                "name": datas?.Name,
                "id": response?.data?.data[0]?.details?.id
              }
            }

            tempOwner?.push(temp);
          })
        } else {
          let temp = {
            Goal_Owner_s: { id: datas?.ownerId, name: datas?.Goal_Owner_s },
            Goals: {
              "name": datas?.Name,
              "id": response?.data?.data[0]?.details?.id
            }
          }

          tempOwner?.push(temp);
        }

        console.log("tempOwner", tempOwner)

        const requestData = {
          data: tempOwner,
        };

        const createOwner = await axios.post(
          `${this.apiURL}/Goals_X_Contacts`,
          requestData,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log("createOwner", createOwner);
      }

      if (response.status === 200 || response?.status == 201) {
        // Success message
        return { status: response.status, "message": "Created Successfully", zohoGoalId: response?.data?.data[0]?.details?.id };
      } else {
        // Generic failure message
        return { status: response.status, "message": "Create failed. Please try again later." };
      }
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateGoal(datas, goalRepository);
      }
      return { "message": error?.message };
      // Handle other errors as needed
    }
  }

  async updateGoal(datas: any, goalRepository: any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    console.log("update goal data", datas);
    const { currentGoalOwners, currentHouseHoldOwners, Goal_Owner2_s, Goal_Owner_s, ...updatedDatas } = datas;
    const requestData = {
      data: [updatedDatas],
    };

    console.log("requestData update", requestData);
    // console.log("datas", datas);
    if (datas?.Current_Value) {
      const currentGoal = await this.getGoalsById(datas?.id);
      // console.log("currentGoal", currentGoal, datas);

      if (currentGoal?.data?.length > 0) {
        const { id, Description, Current_Value, Name, Target_Date, Is_Financial_Goal, Target_Value, Goal_Type, Status } = currentGoal?.data[0];
        console.log("updateGoal", id);

        await goalRepository.create({ zohoGoalId: id, description: Description, money_have: datas?.Current_Value, title: Name, targetDate: Target_Date, isFinancial: Is_Financial_Goal, money_need: Target_Value, goalType: Goal_Type, status: Status });
      }
    }

    try {
      const response = await axios.put(
        `${this.apiURL}/Goals`,
        requestData,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if ((datas?.Goal_Owner_s?.id || datas?.Goal_Owner_s == 'Joint') && datas?.currentGoalOwners?.length > 0) {
        const cownerids = datas?.currentGoalOwners.map(owner => owner.id).join(',');
        console.log("cownerids", cownerids);

        const goalxcontactsdelete = await axios.delete(
          `${this.apiURL}/Goals_X_Contacts?ids=${cownerids}&wf_trigger=true`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          }
        );

        console.log("goalxcontactsdelete res", goalxcontactsdelete)
      }

      if (datas?.Goal_Owner_s?.id || datas?.Goal_Owner_s == 'Joint') {
        let tempOwner = [];
        if (datas?.Goal_Owner_s == 'Joint') {
          datas?.currentHouseHoldOwners?.map((cHO: any) => {
            let temp = {
              Goal_Owner_s: { id: cHO?.id, name: cHO?.name },
              Goals: {
                "name": datas?.Name,
                "id": datas?.id
              }
            }

            tempOwner?.push(temp);
          })
        } else {
          let temp = {
            Goal_Owner_s: datas?.Goal_Owner_s,
            Goals: {
              "name": datas?.Name,
              "id": datas?.id
            }
          }

          tempOwner?.push(temp);
        }

        // console.log("tempOwner", tempOwner)

        const requestData = {
          data: tempOwner,
        };

        const createOwner = await axios.post(
          `${this.apiURL}/Goals_X_Contacts`,
          requestData,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // console.log("createOwner", createOwner);
      }

      if (response.status === 200) {
        // Success message
        return { status: response.status, "message": "Updated Successfully" };
      } else {
        // Generic failure message
        return { status: response.status, "message": "Update failed. Please try again later." };
      }
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateGoal(datas, goalRepository);
      }
      return { "message": error?.message };
      // Handle other errors as needed
    }
  }

  async getAccounts(email: any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId = await this.getUserDetails(email);

      if (ownerId != "") {
        const response = await axios.get(
          `${this.apiURL}/Financial_Accounts/search?criteria=(Household.id:equals:${ownerId})&sort_by=Created_Time&sort_order=desc`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          }
        );

        return response.data;
      }

      return { data: [] };
    } catch (error) {
      console.log('Getting Error17');
      console.log(error?.response?.data);
      if (error?.response?.data?.code == 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getAccounts(email);
      }
    }
  }

  async updateAccounts(accounts: any[]): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    const requestData = {
      data: [accounts],
    };

    try {
      const response = await axios.put(
        `${this.apiURL}/Financial_Accounts`,
        requestData,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // console.log("Update assets with API response", response.data);
      // Handle the response as needed
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateAccounts(accounts);
      }
      // Handle other errors as needed
    }
  }

  async checkScheduleAvailable(startTime: any, endTime: any, email: any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    try {
      const ownerId = await this.getUserDetails(email); // need to send coach id from frontend not owner id
      console.log("owner id", ownerId);

      // Make a request to fetch all events for the specified owner
      const response = await axios.get(
        `${this.apiURL}/Events`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        }
      );
      console.log("response===========", response?.data?.data);

      if (response?.data?.data) {
        const events = response.data.data;

        // Filter events based on the specified time range
        const eventsWithinTimeRange = events.filter((event: any) => {
          const eventStartTime = new Date(event.Start_DateTime);
          const eventEndTime = new Date(event.End_DateTime);

          // Check if the event falls within the specified time range
          return (
            eventStartTime >= new Date(startTime) &&
            eventEndTime <= new Date(endTime)
          );
        });

        // If eventsWithinTimeRange is not empty, meetings are scheduled at the specified time
        if (eventsWithinTimeRange.length > 0) {
          return true;
        }

        return false;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Getting Error18');
      console.log(error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.checkScheduleAvailable(startTime, endTime, email);
      }
      // Handle other errors as needed
      throw error;
    }
  }
}
