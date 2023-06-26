export class CreateUserDto {
  readonly email: string;
  readonly password?: string;
  readonly apple_user_id?:string;
  readonly delete_status?: boolean;
}