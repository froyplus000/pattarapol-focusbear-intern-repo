import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  @Get('public')
  publicRoute() {
    return { message: 'Public OK' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('private')
  privateRoute(@Request() req: any) {
    console.log('User from JWT:', req.user);
    return {
      message: 'Private OK',
      user: req.user,
    };
  }
}
