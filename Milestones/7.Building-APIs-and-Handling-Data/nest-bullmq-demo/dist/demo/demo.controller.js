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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoController = void 0;
const common_1 = require("@nestjs/common");
const demo_service_1 = require("./demo.service");
let DemoController = class DemoController {
    demo;
    constructor(demo) {
        this.demo = demo;
    }
    async echo(msg = 'hello') {
        const job = await this.demo.enqueueEcho(msg);
        return { queued: true, jobId: job.id, type: job.name, msg };
    }
    async delay(msg = 'delayed hello', ms = '5000') {
        const job = await this.demo.enqueueDelayed(msg, parseInt(ms, 10));
        return { queued: true, jobId: job.id, type: job.name, delayMs: ms };
    }
    async retry(msg = 'retry me', fail = '1') {
        const job = await this.demo.enqueueMaybeFail(msg, parseInt(fail, 10));
        return { queued: true, jobId: job.id, type: job.name, failTimes: fail };
    }
};
exports.DemoController = DemoController;
__decorate([
    (0, common_1.Get)('echo'),
    __param(0, (0, common_1.Query)('msg')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DemoController.prototype, "echo", null);
__decorate([
    (0, common_1.Get)('delay'),
    __param(0, (0, common_1.Query)('msg')),
    __param(1, (0, common_1.Query)('ms')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DemoController.prototype, "delay", null);
__decorate([
    (0, common_1.Get)('retry'),
    __param(0, (0, common_1.Query)('msg')),
    __param(1, (0, common_1.Query)('fail')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DemoController.prototype, "retry", null);
exports.DemoController = DemoController = __decorate([
    (0, common_1.Controller)('demo'),
    __metadata("design:paramtypes", [demo_service_1.DemoService])
], DemoController);
//# sourceMappingURL=demo.controller.js.map