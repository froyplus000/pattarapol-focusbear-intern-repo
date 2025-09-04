import { AppService } from './app.service';
declare module 'express-serve-static-core' {
    interface Request {
        user?: any;
    }
}
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getSecret(req: import('express').Request): object;
}
