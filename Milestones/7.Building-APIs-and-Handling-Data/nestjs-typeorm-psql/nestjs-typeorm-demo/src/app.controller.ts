import { Controller, Get, UseInterceptors, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { SimpleExplanationInterceptor } from './interceptors/simple-explanation.interceptor';

// Extend Express Request type to include 'user'
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(SimpleExplanationInterceptor)
  getHello(): string {
    console.log('🏠 STEP 3.5: Inside getHello() - doing the actual work!');
    return this.appService.getHello();
  }

  @Get('secret')
  @UseInterceptors(SimpleExplanationInterceptor)
  getSecret(@Req() req: import('express').Request): object {
    console.log('🔒 Controller: Inside secret route');
    console.log('👤 Controller: User from middleware:', req.user);
    return this.appService.getSecretData();
  }
}
