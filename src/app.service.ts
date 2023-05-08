import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ZohoCRMService } from './service/zoho.service';

@Injectable()
export class AppService {
  constructor(private readonly ZohoCRMService: ZohoCRMService) {}

  async getHello() {
    const assets = this.ZohoCRMService.getAssets();
    return assets;
  }

  async getAssets() {
    const assets = this.ZohoCRMService.getAssets();
    return assets;
  }
}
