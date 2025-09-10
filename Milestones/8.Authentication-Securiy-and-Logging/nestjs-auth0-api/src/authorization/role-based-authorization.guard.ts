import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { Request } from 'express';
import { ROLES_KEY } from './roles.decorator';

interface AuthenticatedRequest extends Request {
  user?: any;
}

@Injectable()
export class RoleBasedAuthorizationGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;
  private jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE') || '';
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN') || '';
    this.jwks = createRemoteJWKSet(
      new URL(`${this.AUTH0_DOMAIN}.well-known/jwks.json`),
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers?.authorization;

    // Check if authorization header exists
    if (
      !authHeader ||
      typeof authHeader !== 'string' ||
      !authHeader.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token: string = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify JWT token
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.AUTH0_DOMAIN,
        audience: this.AUTH0_AUDIENCE,
      });

      request.user = payload;

      // Get required roles from decorator
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      // If no roles are required, just check if token is valid
      if (!requiredRoles) {
        return true;
      }

      // Extract user roles from JWT payload
      const rolesClaimKey = 'https://nestjs-rbac-demo.com/roles';
      const userRoles: string[] = Array.isArray(payload[rolesClaimKey])
        ? (payload[rolesClaimKey] as string[])
        : [];

      // Check if user has at least one of the required roles
      const hasRole = requiredRoles.some((role) => userRoles.includes(role));

      if (!hasRole) {
        throw new ForbiddenException(
          `Access denied. Required roles: ${requiredRoles.join(', ')}. User roles: ${userRoles.join(', ') || 'none'}`,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error; // Re-throw ForbiddenException as-is
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
