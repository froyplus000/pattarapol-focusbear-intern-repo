"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}
let DemoProcessor = class DemoProcessor extends bullmq_1.WorkerHost {
    async process(job) {
        if (job.name === 'echo') {
            for (let p = 0; p <= 100; p += 25) {
                await sleep(200);
                await job.updateProgress(p);
            }
            return { echoed: job.data.message };
        }
        if (job.name === 'maybe-fail') {
            const { message, failTimes } = job.data;
            if (job.attemptsMade < failTimes) {
                throw new Error(`Failing on purpose (attempt ${job.attemptsMade + 1}/${failTimes})`);
            }
            return { okAfterRetries: message };
        }
        return null;
    }
    onCompleted(job, result) {
        console.log(`[worker] ✅ completed "${job.name}" id=${job.id} result=`, result);
    }
    onFailed(job, err) {
        if (!job)
            return;
        console.log(`[worker] ❌ failed "${job.name}" id=${job.id} attempt=${job.attemptsMade} error=${err.message}`);
    }
    onProgress(job, progress) {
        console.log(`[worker] ⏳ progress "${job.name}" id=${job.id} = ${progress}%`);
    }
};
exports.DemoProcessor = DemoProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Object]),
    __metadata("design:returntype", void 0)
], DemoProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Error]),
    __metadata("design:returntype", void 0)
], DemoProcessor.prototype, "onFailed", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('progress'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Number]),
    __metadata("design:returntype", void 0)
], DemoProcessor.prototype, "onProgress", null);
exports.DemoProcessor = DemoProcessor = __decorate([
    (0, bullmq_1.Processor)('demo', { concurrency: 5 })
], DemoProcessor);
//# sourceMappingURL=demo.processor.js.map