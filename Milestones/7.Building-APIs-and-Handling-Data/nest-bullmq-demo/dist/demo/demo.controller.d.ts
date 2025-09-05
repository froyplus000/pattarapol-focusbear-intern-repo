import { DemoService } from './demo.service';
export declare class DemoController {
    private readonly demo;
    constructor(demo: DemoService);
    echo(msg?: string): Promise<{
        queued: boolean;
        jobId: string | undefined;
        type: string;
        msg: string;
    }>;
    delay(msg?: string, ms?: string): Promise<{
        queued: boolean;
        jobId: string | undefined;
        type: string;
        delayMs: string;
    }>;
    retry(msg?: string, fail?: string): Promise<{
        queued: boolean;
        jobId: string | undefined;
        type: string;
        failTimes: string;
    }>;
}
