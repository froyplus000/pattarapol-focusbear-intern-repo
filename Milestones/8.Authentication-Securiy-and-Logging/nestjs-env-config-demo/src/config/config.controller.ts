import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

function mask(value?: string) {
  if (!value) return '';
  if (value.length <= 4) return '****';
  return value.slice(0, 2) + '****' + value.slice(-2);
}

@Controller('config')
export class ConfigController {
  constructor(private readonly config: ConfigService) {}

  @Get('demo')
  demo() {
    const nodeEnv = this.config.get<string>('nodeEnv');
    const port = this.config.get<number>('app.port');

    const dbHost = this.config.get<string>('db.host');
    const dbPort = this.config.get<number>('db.port');
    const dbUser = this.config.get<string>('db.user');
    const dbPass = this.config.get<string>('db.pass');
    const dbName = this.config.get<string>('db.name');

    // Return non-sensitive overview (mask secrets)
    return {
      nodeEnv,
      appPort: port,
      database: {
        host: dbHost,
        port: dbPort,
        user: dbUser,
        pass: mask(dbPass),
        name: dbName,
      },
    };
  }
}
