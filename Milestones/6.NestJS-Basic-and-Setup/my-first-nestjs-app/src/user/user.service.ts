import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = ['Alice', 'Bob', 'John'];
  getUsers() {
    return this.users;
  }
}
