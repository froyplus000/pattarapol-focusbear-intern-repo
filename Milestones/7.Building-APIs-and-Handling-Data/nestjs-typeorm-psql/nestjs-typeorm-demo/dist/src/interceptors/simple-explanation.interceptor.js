"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleExplanationInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let SimpleExplanationInterceptor = class SimpleExplanationInterceptor {
    intercept(context, next) {
        console.log('🔥 STEP 1: Interceptor starts');
        const request = context.switchToHttp().getRequest();
        console.log('📝 STEP 2: Request info:', {
            method: request.method,
            url: request.url,
        });
        console.log('🚀 STEP 3: About to run your route handler function...');
        return next.handle().pipe((0, operators_1.tap)((result) => {
            console.log('✅ STEP 4: Your function returned:', result);
            console.log('🎉 STEP 5: Interceptor is done!');
        }));
    }
};
exports.SimpleExplanationInterceptor = SimpleExplanationInterceptor;
exports.SimpleExplanationInterceptor = SimpleExplanationInterceptor = __decorate([
    (0, common_1.Injectable)()
], SimpleExplanationInterceptor);
//# sourceMappingURL=simple-explanation.interceptor.js.map