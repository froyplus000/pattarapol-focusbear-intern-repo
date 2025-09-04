export class CreateUserDto {
  username: string;
  password: string; // 🔑 Users can provide password when creating account
  firstName?: string;
  lastName?: string;
}
