import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    // this.logger.log('Logging Hello World...');
    return 'Hello World!';
  }

  mockLogin(username: string, password: string) {
    if (typeof password !== 'string') {
      const type = typeof password;
      this.logger.warn(
        {
          passwordType: type,
        },
        `Entered Password is not type of string`,
      );
      // ❌ Throw exception if password is not a string
      throw new BadRequestException('Password must be a string');
    }
    // Example: just mock check
    if (username === 'admin' && password === 'password') {
      // this.logger.info({ username }, 'User login successful');
      this.logger.log({ username }, 'User login successful');
      return {
        success: true,
        message: 'Login successful!',
        username: username,
      };
    } else {
      this.logger.warn({ username }, 'Invalid login attempt');
      return 'Invalid username or password';
    }
  }
}
