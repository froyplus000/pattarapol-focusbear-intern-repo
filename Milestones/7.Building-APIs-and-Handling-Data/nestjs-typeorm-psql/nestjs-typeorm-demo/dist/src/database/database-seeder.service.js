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
exports.DatabaseSeederService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
let DatabaseSeederService = class DatabaseSeederService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async seedUsers() {
        const existingUsers = await this.userRepository.count();
        if (existingUsers > 0) {
            console.log('👥 Users already exist, skipping user seeding...');
            return;
        }
        console.log('🌱 Seeding users...');
        const usersData = [
            {
                username: 'john_doe',
                firstName: 'John',
                lastName: 'Doe',
                age: 28,
                password: 'password123',
            },
            {
                username: 'jane_smith',
                firstName: 'Jane',
                lastName: 'Smith',
                age: 32,
                password: 'password456',
            },
            {
                username: 'admin_user',
                firstName: 'Admin',
                lastName: 'User',
                age: 30,
                password: 'admin123',
            },
            {
                username: 'test_user',
                firstName: 'Test',
                lastName: 'User',
                age: 25,
                password: 'test123',
            },
        ];
        for (const userData of usersData) {
            const user = this.userRepository.create(userData);
            await this.userRepository.save(user);
            console.log(`✅ Created user: ${userData.username}`);
        }
        console.log('🎉 User seeding completed!');
    }
    async seedAll() {
        console.log('🚀 Starting database seeding...');
        try {
            await this.seedUsers();
            console.log('✨ All seeding completed successfully!');
        }
        catch (error) {
            console.error('❌ Seeding failed:', error);
            throw error;
        }
    }
    async clearUsers() {
        console.log('🧹 Clearing users...');
        await this.userRepository.clear();
        console.log('✅ Users cleared');
    }
};
exports.DatabaseSeederService = DatabaseSeederService;
exports.DatabaseSeederService = DatabaseSeederService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DatabaseSeederService);
//# sourceMappingURL=database-seeder.service.js.map