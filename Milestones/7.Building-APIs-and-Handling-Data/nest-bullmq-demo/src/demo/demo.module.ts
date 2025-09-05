import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';
import { BullModule } from '@nestjs/bullmq';
import { DemoProcessor } from './demo.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'demo',
    }),
  ],
  controllers: [DemoController],
  providers: [DemoService, DemoProcessor],
})
export class DemoModule {}
