export class CreateOauthtokenDto {
  readonly access_token: string;
  readonly refresh_token: string;
  readonly api_domain: string;
  readonly token_type: string;
  readonly expires_in?: number;
}
