import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getHi(): string {
    return 'Hi World!';
  }
  login(username: string, password: string): string {
    if (username === 'admin' && password === '1234') {
      return 'Login successful!';
    }
    return 'Invalid credentials';
  }
}
