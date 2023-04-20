import { Injectable } from '@nestjs/common';
import { ZCRMRestClient, APIConstants } from '@zohocrm/nodejs-sdk-2.0';
import { Logger, Levels } from '@zohocrm/nodejs-sdk-2.0/routes/logger/logger';

@Injectable()
export class ZohoCRMService {
    private restClient: ZCRMRestClient;
    private readonly logger = new Logger(ZohoCRMService.name, {
        level: Levels.INFO
    });

    constructor(private readonly zohoCRMClient: ZCRMRestClient) {
      this.restClient = ZCRMRestClient.initialize({
        client_id: 'YOUR_CLIENT_ID',
        client_secret: 'YOUR_CLIENT_SECRET',
        refresh_token: 'YOUR_REFRESH_TOKEN',
        redirect_url: 'https://cleva.co/',
        grant_type: APIConstants.GRANT_TYPE_REFRESH,
        refresh_token_expiry_time: 'YOUR_REFRESH_TOKEN_EXPIRY_TIME',
        base_url: 'https://www.zohoapis.com',
      });
    }

    async getContacts(): Promise<any> {
        try {
          this.logger.log('Getting contacts from Zoho CRM...');
    
          const moduleAPIName = 'Contacts';
          const params = {
            page: 1,
            per_page: 10,
            sort_by: 'Created_Time',
            sort_order: 'desc',
          };
          const response = await this.restClient.API.MODULES.get(moduleAPIName, params);
          return response.data;
        } catch (error) {
          this.logger.error(`Error: ${error.message}`, error.stack);
          throw error;
        }
    }
}
  