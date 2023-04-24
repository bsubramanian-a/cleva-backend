import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ZohoCRMService } from './service/zoho.service';

// import { InitializeBuilder } from '@zohocrm/nodejs-sdk-2.0/routes/initialize_builder';
// import { OAuthBuilder } from '@zohocrm/nodejs-sdk-2.0/models/authenticator/oauth_builder';
// import { UserSignature } from '@zohocrm/nodejs-sdk-2.0/routes/user_signature';
// import { Levels } from '@zohocrm/nodejs-sdk-2.0/routes/logger/logger';
// import { LogBuilder } from '@zohocrm/nodejs-sdk-2.0/routes/logger/log_builder';
// import { USDataCenter } from '@zohocrm/nodejs-sdk-2.0/routes/dc/us_data_center';
// import { DBBuilder } from '@zohocrm/nodejs-sdk-2.0/models/authenticator/store/db_builder';
// //import { FileStore } from '@zohocrm/nodejs-sdk-2.0/models/authenticator/store/file_store';
// import { SDKConfigBuilder } from '@zohocrm/nodejs-sdk-2.0/routes/sdk_config_builder';
// //import { ProxyBuilder } from '@zohocrm/nodejs-sdk-2.0/routes/proxy_builder';
// import { ZCRMRestClient } from '@zohocrm/nodejs-sdk-2.0';
// //import ZCRMRestClient from 'zcrmsdk';
// import * as dotenv from 'dotenv';
// dotenv.config();

@Injectable()
export class AppService {
  constructor(private readonly ZohoCRMService: ZohoCRMService) {}
  // private configJSON = {
  //   client_id: process.env.CLIENT_ID,
  //   client_secret: process.env.CLIENT_SECRET,
  //   redirect_url: process.env.REDIRECT_URL,
  //   user_identifier: process.env.ADMIN_EMAIL_ADDRESS,
  // };

  // async initialise() {
  //   const logger: LogBuilder = new LogBuilder()
  //     .level(Levels.INFO)
  //     .filePath('../logs/node_sdk_log.log')
  //     .build();

  //   const user = new UserSignature(process.env.ADMIN_EMAIL_ADDRESS);

  //   const environment = USDataCenter.PRODUCTION();

  //   const token = new OAuthBuilder()
  //     .clientId(process.env.CLIENT_ID)
  //     .clientSecret(process.env.CLIENT_SECRET)
  //     .refreshToken(process.env.TEMP_GRANT_TOKEN)
  //     .redirectURL(process.env.REDIRECT_URL)
  //     .build();

  //   const tokenstore = new DBBuilder()
  //     .host(process.env.DB_HOST)
  //     .databaseName(process.env.DB_NAME_DEVELOPMENT)
  //     .userName(process.env.DB_USER)
  //     .portNumber(process.env.DB_PORT)
  //     .tableName(process.env.DB_TABLENAME)
  //     .password(process.env.DB_PASS)
  //     .build();

  //   const sdkConfig = new SDKConfigBuilder()
  //     .pickListValidation(false)
  //     .autoRefreshFields(true)
  //     .build();

  //   const resourcePath = '/workspaces/cleva-backend/nodejs-app';

  //   //const store = new FileStore('../nodejs-app/nodejs_sdk_tokens.txt');

  //   try {
  //     (await new InitializeBuilder())
  //       .user(user)
  //       .environment(environment)
  //       .token(token)
  //       .store(tokenstore)
  //       .SDKConfig(sdkConfig)
  //       .resourcePath(resourcePath)
  //       .logger(logger)
  //       .initialize();
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   console.log('tokenstore', tokenstore);

  //   console.log('tokens get tokens', await tokenstore.getTokens());
  // }

  async getHello() {
    const assets = this.ZohoCRMService.getAssets();
    return assets;
    //const accessToken = this.ZohoCRMService.getAccessToken();
    //return JSON.stringify(accessToken);
    // await ZCRMRestClient.initialize(this.configJSON);
    // const authresponse = await ZCRMRestClient.generateAuthTokens(
    //   process.env.ADMIN_EMAIL_ADDRESS,
    //   process.env.TEMP_GRANT_TOKEN,
    // );
    // console.log('authresponse', authresponse);
    //this.initialise();
    // const params = {
    //   page: 1,
    //   per_page: 10,
    //   sort_by: 'Created_Time',
    //   sort_order: 'desc',
    // };
    // const response = await this.restClient
    //   .getInstance()
    //   .API.MODULES.get('Assets', params);
    // console.log(response.data);
    //return 'Hello World!' + process.env.CLIENT_ID;
  }
}
