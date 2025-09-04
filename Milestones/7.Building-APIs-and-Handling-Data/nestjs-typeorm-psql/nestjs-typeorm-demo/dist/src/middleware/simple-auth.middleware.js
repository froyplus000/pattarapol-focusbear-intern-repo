"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleAuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
let SimpleAuthMiddleware = class SimpleAuthMiddleware {
    use(req, res, next) {
        console.log('🔐 Middleware: Checking if user is logged in...');
        const hasToken = req.headers.authorization;
        if (!hasToken) {
            console.log('❌ Middleware: No token found! Access denied.');
            return res.status(401).json({ message: 'Please login first!' });
        }
        console.log('✅ Middleware: Token found! User is authenticated.');
        req.user = { id: 1, name: 'John Doe' };
        next();
    }
};
exports.SimpleAuthMiddleware = SimpleAuthMiddleware;
exports.SimpleAuthMiddleware = SimpleAuthMiddleware = __decorate([
    (0, common_1.Injectable)()
], SimpleAuthMiddleware);
//# sourceMappingURL=simple-auth.middleware.js.map