"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const database_seeder_service_1 = require("../src/database/database-seeder.service");
async function bootstrap() {
    console.log('🚀 Starting seeding process...');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const seederService = app.get(database_seeder_service_1.DatabaseSeederService);
    try {
        const args = process.argv.slice(2);
        const command = args[0] || 'seed';
        switch (command) {
            case 'seed':
                await seederService.seedAll();
                break;
            case 'clear':
                await seederService.clearUsers();
                break;
            case 'fresh':
                await seederService.clearUsers();
                await seederService.seedAll();
                break;
            default:
                console.log('Available commands:');
                console.log('  npm run seed        - Seed database with sample data');
                console.log('  npm run seed:clear  - Clear all users');
                console.log('  npm run seed:fresh  - Clear users and seed fresh data');
                break;
        }
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
    await app.close();
    console.log('👋 Seeding process completed');
}
void bootstrap();
//# sourceMappingURL=seed.js.map