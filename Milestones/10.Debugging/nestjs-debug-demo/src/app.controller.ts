import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PinoLogger } from 'nestjs-pino';
import { reqUserDto, resUserDto } from './user.dto';
import type { Request } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: PinoLogger,
  ) {}

  @Get()
  getHello(): string {
    this.logger.info('GET / endpoint called');
    return this.appService.getHello();
  }

  @Get('users')
  getAllUsers(): { email: string; userData: resUserDto }[] {
    this.logger.info('GET /users endpoint called');
    const users = this.appService.getAllUsers();
    this.logger.info({ userCount: users.length }, 'Retrieved all users');
    return users;
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() body: reqUserDto, @Req() request: Request): resUserDto {
    // Log request headers and payload together for better readability
    this.logger.info(
      {
        request: {
          headers: {
            'content-type': request.headers['content-type'],
            'user-agent': request.headers['user-agent'],
            'content-length': request.headers['content-length'],
            host: request.headers.host,
          },
          payload: {
            name: body.name,
            email: body.email,
            // Password excluded for security
          },
          timestamp: new Date().toISOString(),
        },
      },
      'Creating new user - Request details',
    );

    try {
      const result = this.appService.createUser(
        body.name,
        body.email,
        body.password,
      );

      // Log successful response
      this.logger.info(
        { response: result, statusCode: HttpStatus.CREATED },
        'User creation successful',
      );

      return result;
    } catch (error: any) {
      // Log error details
      this.logger.error(
        {
          error: error.message,
          statusCode: error.status,
          requestBody: { name: body.name, email: body.email }, // No password in error logs
        },
        'User creation failed',
      );
      throw error;
    }
  }
}
