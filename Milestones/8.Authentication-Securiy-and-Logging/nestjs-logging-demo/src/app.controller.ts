import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PinoLogger } from 'nestjs-pino';
import { LoginDto } from './login.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: PinoLogger,
  ) {}

  @Get()
  getHello(): string {
    this.logger.info('Hello world called!');
    return this.appService.getHello();
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    const username = body.username;
    this.logger.info({ username }, 'Login API called'); // log request
    return this.appService.mockLogin(body.username, body.password);
  }

  // Test endpoint to trigger exceptions
  @Get('test-error')
  testError() {
    this.logger.info('Test error endpoint called');
    throw new BadRequestException('This is a test error!');
  }
}
