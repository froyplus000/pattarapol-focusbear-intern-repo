import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { resUserDto } from './user.dto';

@Injectable()
export class AppService {
  userDB: { [key: string]: any } = {};

  getHello(): string {
    return 'Hello World!';
  }

  createUser(name: string, email: string, password: string): resUserDto {
    // Validation
    if (!name || !email || !password) {
      throw new BadRequestException('Name, email, and password are required');
    }

    if (!email.includes('@')) {
      throw new BadRequestException('Invalid email format');
    }

    // Check for duplicate email
    if (this.userDB[email]) {
      throw new ConflictException('User with this email already exists');
    }

    const user = { name: name, email: email, password: password };
    this.userDB[email] = user;

    // Return response without password for security
    return { name: user.name, email: user.email };
  }

  getAllUsers(): { email: string; userData: resUserDto }[] {
    return Object.keys(this.userDB).map((email) => ({
      email,
      userData: {
        name: this.userDB[email].name,
        email: this.userDB[email].email,
      },
    }));
  }
}
