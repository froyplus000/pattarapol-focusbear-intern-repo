import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly cfg: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const provided = (req.headers['x-api-key'] || req.headers['X-API-Key']) as
      | string
      | undefined;
    const expected = this.cfg.get<string>('API_KEY');

    if (!provided) {
      throw new UnauthorizedException(
        'API key required. Please provide x-api-key header.',
      );
    }

    if (provided !== expected) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
