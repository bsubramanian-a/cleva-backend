export class CreateUserDto {
  readonly email: string;
  readonly password: string;
  readonly delete_status?: boolean;
}
