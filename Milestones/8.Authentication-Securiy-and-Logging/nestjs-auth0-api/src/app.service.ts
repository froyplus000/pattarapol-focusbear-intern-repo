import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! This endpoint is public and requires no authentication.';
  }
  getDog(): string {
    return 'You can see this because you logged in as a DOG! 🐕';
  }
  getCat(): string {
    return 'You can see this because you logged in as a CAT! 🐱';
  }
}
