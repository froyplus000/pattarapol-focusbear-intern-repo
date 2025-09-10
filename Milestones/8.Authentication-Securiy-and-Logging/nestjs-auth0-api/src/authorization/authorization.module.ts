import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationGuard } from './authorization.guard';
import { RoleBasedAuthorizationGuard } from './role-based-authorization.guard';

@Module({
  imports: [ConfigModule],
  providers: [AuthorizationGuard, RoleBasedAuthorizationGuard],
  exports: [AuthorizationGuard, RoleBasedAuthorizationGuard],
})
export class AuthorizationModule {}
