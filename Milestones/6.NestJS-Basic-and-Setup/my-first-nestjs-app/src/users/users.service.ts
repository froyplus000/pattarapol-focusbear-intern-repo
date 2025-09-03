// src/users/users.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = ['Pattarapol Tantechasa', 'Folk', 'NestJS CLI DEMO'];
  findAll() {
    return this.users;
  }
}
