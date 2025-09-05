// src/demo/demo.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class DemoService {
  constructor(@InjectQueue('demo') private readonly demoQueue: Queue) {}

  enqueueEcho(message: string) {
    return this.demoQueue.add(
      'echo',
      { message },
      { attempts: 1 }, // no retries for this simple job
    );
  }

  enqueueDelayed(message: string, delayMs = 5000) {
    return this.demoQueue.add(
      'echo',
      { message },
      { delay: delayMs, attempts: 1 },
    );
  }

  enqueueMaybeFail(message: string, failTimes = 1) {
    // Will throw until attemptsMade < failTimes, then succeed.
    return this.demoQueue.add(
      'maybe-fail',
      { message, failTimes },
      {
        attempts: failTimes + 1, // allow enough retries to eventually succeed
        backoff: { type: 'exponential', delay: 1000 },
      },
    );
  }
}
