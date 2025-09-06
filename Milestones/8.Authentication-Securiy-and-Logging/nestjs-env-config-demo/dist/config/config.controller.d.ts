import { ConfigService } from '@nestjs/config';
export declare class ConfigController {
    private readonly config;
    constructor(config: ConfigService);
    demo(): {
        nodeEnv: string | undefined;
        appPort: number | undefined;
        database: {
            host: string | undefined;
            port: number | undefined;
            user: string | undefined;
            pass: string;
            name: string | undefined;
        };
    };
}
