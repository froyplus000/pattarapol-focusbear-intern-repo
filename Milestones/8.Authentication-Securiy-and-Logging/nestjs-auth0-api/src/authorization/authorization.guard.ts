import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify } from 'jose';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;
  private jwks: any;

  constructor(private configService: ConfigService) {
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE') || '';
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN') || '';
    this.jwks = createRemoteJWKSet(
      new URL(`${this.AUTH0_DOMAIN}.well-known/jwks.json`),
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();
    const authHeader: string = request.headers?.authorization;

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
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.AUTH0_DOMAIN,
        audience: this.AUTH0_AUDIENCE,
      });

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
