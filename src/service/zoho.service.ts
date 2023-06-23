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

  async getUserDetails(email, access_token) : Promise<any> {
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
      if(response?.data?.data?.length > 0){
        return response?.data?.data[0]?.Account_Name?.id
      }
      return "";
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
    }
  }

  async getOwnerId(email, access_token) : Promise<any> {
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
      if(response?.data?.data?.length > 0){
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
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
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
      return response.data;
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getUsers();
      }
    }
  }

  async getJournals(email:any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId =  await this.getUserDetails(email, access_token);

      if(ownerId != ""){
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

      return {data: []};
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getJournals(email);
      }
    }
  }

  async getExercises(email:any): Promise<any> { 
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId =  await this.getOwnerId(email, access_token);
      console.log("ownerId", ownerId, email);
      if(ownerId != ""){
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

      return {data: []};
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getExercises(email);
      }
    }
  }

  async getSummary(email:any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId =  await this.getOwnerId(email, access_token);

      if(ownerId != ""){
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

      return {data: []};
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getSummary(email);
      }
    }
  }

  async getAdvice(email:any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId =  await this.getOwnerId(email, access_token);

      if(ownerId != ""){
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

      return {data: []};
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getAdvice(email);
      }
    }
  }
  
  async getAssets(email:any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId =  await this.getUserDetails(email, access_token);
      // console.log("ownerId.........", ownerId)

      if(ownerId != ""){
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

      return {data: []};
    } catch (error) {
      console.log('Getting Error1');
      console.log(error);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getAssets(email);
      }
    }
  }

  async addAsset(asset: any, email:string): Promise<any> {
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

  async addLiability(liability: any, email:string): Promise<any> {
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
    }catch (error) {
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
          data: assetsWithAPI,
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

      return {data: []};
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateAssets(assets);
      }
    }
  }

  async updateProfile(datas:any, email:string): Promise<any> {
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
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateProfile(datas, email);
      }
    }
  }

  async getLiabilities(email:any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId =  await this.getUserDetails(email, access_token);

      if(ownerId != ""){
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

      return {data: []};
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
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
        return {status: response.status, "message": "Updated Successfully"};
      } else {
        // Generic failure message
        return {status: response.status, "message": "Update failed. Please try again later."};
      }
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateDependant(datas);
      }
      return {"message": error?.message};
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
        return {status: response.status, "message": "Updated Successfully"};
      } else {
        // Generic failure message
        return {status: response.status, "message": "Update failed. Please try again later."};
      }
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateEmployment(datas);
      }
      return {"message": error?.message};
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
        return {status: response.status, "message": "Updated Successfully"};
      } else {
        // Generic failure message
        return {status: response.status, "message": "Update failed. Please try again later."};
      }
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateExpenses(datas);
      }
      return {"message": error?.message};
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
        return {status: response.status, "message": "Updated Successfully"};
      } else {
        // Generic failure message
        return {status: response.status, "message": "Update failed. Please try again later."};
      }
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateExpenses(datas);
      }
      return {"message": error?.message};
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
        return {status: response.status, "message": "Updated Successfully"};
      } else {
        // Generic failure message
        return {status: response.status, "message": "Update failed. Please try again later."};
      }
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateINA(datas);
      }
      return {"message": error?.message};
      // Handle other errors as needed
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

      const account_id = response?.data?.data[0]?.Account_Name?.id;
      let accounts = [];
      if(account_id){
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

        if(nresponse?.data?.data?.length > 0){
          response.data.data[0].accounts =  nresponse?.data?.data?.filter((acc:any) => acc?.Email != null && acc?.Email != email);          
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

        if(incomeResponse?.data?.data?.length > 0){
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
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getProfile(email);
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

  async getGoalsByAccount(email:any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
    try {
      const ownerId =  await this.getUserDetails(email, access_token);

      if(ownerId != ""){
        const response = await axios.get(
          `${this.apiURL}/Goals/search?criteria=Household.id:equals:${ownerId}&sort_by=Created_Time&sort_order=desc`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token}`,
            },
          }
        );
        
        return response.data;
      }

      return {data: []};
    } catch (error) {
      console.log('Getting Error1');
      console.log(error?.response?.data);
      if(error?.response?.data?.code == 'INVALID_TOKEN'){
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getGoalsByAccount(email);
      }
    }
  }

  async getGoalsById(id:any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;

    try {
      const response = await axios.get(
        `${this.apiURL}/Goals/search?criteria=id:equals:${id}`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.getGoalsById(id);
      }
      return {"message": error?.message};
      // Handle other errors as needed
    }
  }

  async updateGoal(datas: any[], goalRepository:any): Promise<any> {
    const tokenFromDb = await this.oauthService.findAll();
    const access_token = tokenFromDb[0]?.dataValues?.access_token;
  
    const requestData = {
      data: datas,
    };

    const currentGoal = await this.getGoalsById(datas[0]?.id);
    // console.log("currentGoal", currentGoal?.data[0]);

    if(currentGoal?.data?.length > 0){
      const { id, Description, Current_Value, Name, Target_Date, Is_Financial_Goal, Target_Value, Goal_Type } = currentGoal?.data[0];

      await goalRepository.create({ zohoGoalId: id, description: Description, money_have: Current_Value, title: Name, targetDate: Target_Date, isFinancial: Is_Financial_Goal, money_need: Target_Value, goalType: Goal_Type});
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

      if (response.status === 200) {
        // Success message
        return {status: response.status, "message": "Updated Successfully"};
      } else {
        // Generic failure message
        return {status: response.status, "message": "Update failed. Please try again later."};
      }
    } catch (error) {
      console.log('Error updating assets with API', error?.response?.data);
      if (error?.response?.data?.code === 'INVALID_TOKEN') {
        await this.refreshAccessToken(tokenFromDb[0]?.dataValues?.id);
        return this.updateGoal(datas, goalRepository); 
      }
      return {"message": error?.message};
      // Handle other errors as needed
    }
  }
}
