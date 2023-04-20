import { Initializer } from '@zohocrm/nodejs-sdk-2.0/routes/initializer';
import { OAuthToken, TokenType } from '@zohocrm/nodejs-sdk-2.0/models/authenticator/oauth_token';
import { UserSignature } from '@zohocrm/nodejs-sdk-2.0/routes/user_signature';
import { Logger, Levels } from '@zohocrm/nodejs-sdk-2.0/routes/logger/logger';
import { USDataCenter } from '@zohocrm/nodejs-sdk-2.0/routes/dc/us_data_center';
import { DBStore } from '@zohocrm/nodejs-sdk-2.0/models/authenticator/store/db_store';
import { FileStore } from '@zohocrm/nodejs-sdk-2.0/models/authenticator/store/file_store';
import { RequestProxy } from '@zohocrm/nodejs-sdk-2.0/routes/request_proxy';
import { SDKConfigBuilder } from '@zohocrm/nodejs-sdk-2.0/routes/sdk_config_builder';
import * as path from 'path';

export class InitializerN{
    static async initialize(){
        console.log("TokenType", TokenType)
        let logger = Logger.getInstance(Levels.INFO, "/Users/user_name/Documents/nodejs_sdk_log.log");
        let user = new UserSignature("dan@ffau.com.au");
        let environment = USDataCenter.PRODUCTION();
        let token = new OAuthToken("1000.J3V0FXL2JZKK3DDVP27K9014KZZB6P", "39297bb22c995ed0a48f90679c4b0e1444e75c781c", "1000.75ec86ce329c968b079c699e055c4bcd.5403509bdc06717e01ea4ce7bac093d5", 'authorization_code', "https://www.zohoapis.com");

        let tokenstore = new DBStore("cleva.crxdjct6nnoo.ap-south-1.rds.amazonaws.com", "Cleva", "ClevaAdmin", "AdminMeInCleva23", "5432");
        
        let sdkConfig = new SDKConfigBuilder() 
        .pickListValidation(false)
        .build();

        /*
        * The path containing the absolute directory path to store user specific JSON files containing module fields information. 
        */

        const rootDir = path.resolve(__dirname, '..'); // go up two levels from current directory
        let resourcePath = path.join(rootDir, 'resources');
        
        let proxy = new RequestProxy("proxyHost", 80);

        // let proxy = new RequestProxy("proxyHost", 80, "proxyUser", "password");
        
        await Initializer.initialize(user, environment, token, tokenstore, sdkConfig, resourcePath, logger, proxy)

        // await Initializer.initialize(user, environment, token, tokenstore, sdkConfig, resourcePath, logger, proxy);
    }
}

InitializerN.initialize()