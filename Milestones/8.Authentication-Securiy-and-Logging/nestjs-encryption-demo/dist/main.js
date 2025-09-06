"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log('🚀 NestJS TypeORM Encrypted Demo is running!');
    console.log(`📡 Server: http://localhost:${port}`);
    console.log(`🔐 Database: PostgreSQL with typeorm-encrypted`);
    console.log(`🐳 pgAdmin: http://localhost:5050 (admin@demo.com / admin123)`);
    console.log('\n📋 Available endpoints:');
    console.log('  POST   /users          - Create user with encrypted data');
    console.log('  GET    /users          - Get all users (decrypted)');
    console.log('  GET    /users/raw      - Get raw database values (encrypted)');
    console.log('  GET    /users/:id      - Get specific user (decrypted)');
    console.log('  DELETE /users/:id      - Delete user');
    console.log('\n🔑 Encryption Key:', process.env.ENCRYPTION_KEY ? 'Loaded from .env' : 'Using fallback');
}
bootstrap();
//# sourceMappingURL=main.js.map