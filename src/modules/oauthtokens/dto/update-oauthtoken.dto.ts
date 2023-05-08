import { PartialType } from '@nestjs/mapped-types';
import { CreateOauthtokenDto } from './create-oauthtoken.dto';

export class UpdateOauthtokenDto extends PartialType(CreateOauthtokenDto) {}
