import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';

@Controller('secret')
export class SecurityController {
  @UseGuards(ApiKeyGuard)
  @Get()
  getSecret() {
    return { secret: '🎟️ protected payload' };
  }
}
