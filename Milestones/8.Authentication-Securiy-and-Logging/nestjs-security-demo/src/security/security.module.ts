import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { ApiKeyGuard } from './api-key.guard';

@Module({
  controllers: [SecurityController],
  providers: [ApiKeyGuard],
})
export class SecurityModule {}
