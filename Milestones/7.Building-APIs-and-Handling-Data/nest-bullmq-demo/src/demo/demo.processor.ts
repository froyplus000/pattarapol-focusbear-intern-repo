// src/demo/demo.processor.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

@Processor('demo', { concurrency: 5 })
export class DemoProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'echo') {
      // Simulate work + show progress updates
      for (let p = 0; p <= 100; p += 25) {
        await sleep(200);
        await job.updateProgress(p);
      }
      return { echoed: job.data.message };
    }

    if (job.name === 'maybe-fail') {
      const { message, failTimes } = job.data as {
        message: string;
        failTimes: number;
      };
      if (job.attemptsMade < failTimes) {
        throw new Error(
          `Failing on purpose (attempt ${job.attemptsMade + 1}/${failTimes})`,
        );
      }
      return { okAfterRetries: message };
    }

    // Unknown job name
    return null;
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    // eslint-disable-next-line no-console
    console.log(
      `[worker] ✅ completed "${job.name}" id=${job.id} result=`,
      result,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, err: Error) {
    if (!job) return;
    // eslint-disable-next-line no-console
    console.log(
      `[worker] ❌ failed "${job.name}" id=${job.id} attempt=${job.attemptsMade} error=${err.message}`,
    );
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job, progress: number) {
    // eslint-disable-next-line no-console
    console.log(
      `[worker] ⏳ progress "${job.name}" id=${job.id} = ${progress}%`,
    );
  }
}
