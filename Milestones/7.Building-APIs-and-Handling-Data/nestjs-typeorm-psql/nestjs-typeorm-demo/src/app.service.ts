import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getSecretData(): object {
    console.log('🎯 Service: Processing secret data request...');
    return {
      secret: 'This is super secret data!',
      message: 'Only authenticated users can see this!',
      timestamp: new Date().toISOString(),
    };
  }
}
