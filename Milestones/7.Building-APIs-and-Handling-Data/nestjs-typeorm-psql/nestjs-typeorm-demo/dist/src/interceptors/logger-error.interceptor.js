"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggerErrorInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerErrorInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let LoggerErrorInterceptor = LoggerErrorInterceptor_1 = class LoggerErrorInterceptor {
    logger = new common_1.Logger(LoggerErrorInterceptor_1.name);
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip } = request;
        const userAgent = request.get('User-Agent') || '';
        const requestId = Math.random().toString(36).substr(2, 9);
        return next.handle().pipe((0, operators_1.catchError)((error) => {
            this.logger.error(`❌ Error in ${method} ${url}`, {
                requestId,
                method,
                url,
                ip,
                userAgent,
                errorMessage: error.message,
                errorStack: error.stack,
                timestamp: new Date().toISOString(),
            });
            let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            let message = 'Internal server error';
            if (error instanceof common_1.HttpException) {
                status = error.getStatus();
                message = error.message;
            }
            const errorResponse = {
                success: false,
                statusCode: status,
                message,
                requestId,
                timestamp: new Date().toISOString(),
                path: url,
            };
            this.logger.error(`📤 Sending error response:`, errorResponse);
            return (0, rxjs_1.throwError)(() => new common_1.HttpException(errorResponse, status));
        }));
    }
};
exports.LoggerErrorInterceptor = LoggerErrorInterceptor;
exports.LoggerErrorInterceptor = LoggerErrorInterceptor = LoggerErrorInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], LoggerErrorInterceptor);
//# sourceMappingURL=logger-error.interceptor.js.map