import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hi')
  getHi(): string {
    return this.appService.getHi();
  }
  @Post('login')
  login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): string {
    return this.appService.login(username, password);
  }
}
