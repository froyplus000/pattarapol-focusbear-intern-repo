import { Queue } from 'bullmq';
export declare class DemoService {
    private readonly demoQueue;
    constructor(demoQueue: Queue);
    enqueueEcho(message: string): Promise<import("bullmq").Job<any, any, string>>;
    enqueueDelayed(message: string, delayMs?: number): Promise<import("bullmq").Job<any, any, string>>;
    enqueueMaybeFail(message: string, failTimes?: number): Promise<import("bullmq").Job<any, any, string>>;
}
