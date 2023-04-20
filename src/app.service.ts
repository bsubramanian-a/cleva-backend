import { Injectable } from '@nestjs/common';
import { InitializerN } from './services/intializer';
import { ZCRMRestClient, APIConstants } from '@zohocrm/nodejs-sdk-2.0';

@Injectable()
export class AppService {
  private restClient: ZCRMRestClient;

  constructor() {
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getAssets() {
    await InitializerN.initialize();
    this.restClient = ZCRMRestClient.getInstance();
    const params = {
      page: 1,
      per_page: 10,
      sort_by: 'Created_Time',
      sort_order: 'desc',
    };
    const response = await this.restClient.API.MODULES.get('Assets', params);
    return response.data;
  }
}
