import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export declare class DemoProcessor extends WorkerHost {
    process(job: Job<any, any, string>): Promise<any>;
    onCompleted(job: Job, result: any): void;
    onFailed(job: Job | undefined, err: Error): void;
    onProgress(job: Job, progress: number): void;
}
