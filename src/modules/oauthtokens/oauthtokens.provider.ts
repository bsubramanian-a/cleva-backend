import { OAUTHTOKENS_REPOSITORY } from 'src/core/constants';
import { Oauthtoken } from './entities/oauthtoken.entity';

export const oauthtokensProviders = [
  {
    provide: OAUTHTOKENS_REPOSITORY,
    useValue: Oauthtoken,
  },
];
