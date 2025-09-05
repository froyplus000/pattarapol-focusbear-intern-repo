// src/demo/demo.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { DemoService } from './demo.service';

@Controller('demo')
export class DemoController {
  constructor(private readonly demo: DemoService) {}

  @Get('echo')
  async echo(@Query('msg') msg = 'hello') {
    const job = await this.demo.enqueueEcho(msg);
    return { queued: true, jobId: job.id, type: job.name, msg };
  }

  @Get('delay')
  async delay(@Query('msg') msg = 'delayed hello', @Query('ms') ms = '5000') {
    const job = await this.demo.enqueueDelayed(msg, parseInt(ms, 10));
    return { queued: true, jobId: job.id, type: job.name, delayMs: ms };
  }

  @Get('retry')
  async retry(@Query('msg') msg = 'retry me', @Query('fail') fail = '1') {
    const job = await this.demo.enqueueMaybeFail(msg, parseInt(fail, 10));
    return { queued: true, jobId: job.id, type: job.name, failTimes: fail };
  }
}
