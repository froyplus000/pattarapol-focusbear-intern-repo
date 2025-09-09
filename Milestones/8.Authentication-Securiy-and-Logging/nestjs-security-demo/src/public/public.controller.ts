import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsString, Length } from 'class-validator';

class EchoDto {
  @IsString()
  @Length(1, 200)
  message: string;
}

@Controller()
export class PublicController {
  @Get('health')
  health() {
    return { ok: true, ts: new Date().toISOString() };
  }

  // Demonstrates whitelist validation & XSS-safe echo (no HTML rendering here)
  @Post('echo')
  echo(@Body() body: EchoDto) {
    // Because of ValidationPipe, body only has "message" and is string-limited
    return { echoed: body.message };
  }
}
