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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_entity_1 = require("./entities/user.entity");
const logger_error_interceptor_1 = require("../interceptors/logger-error.interceptor");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    testExclude() {
        console.log('🧪 Testing @Exclude decorator...');
        const user = new user_entity_1.User();
        user.id = 1;
        user.username = 'testuser';
        user.firstName = 'Test';
        user.lastName = 'User';
        user.password = 'this-should-be-hidden';
        console.log('📋 Raw user object (before interceptor):', user);
        return user;
    }
    testError() {
        console.log('🚨 Testing LoggerErrorInterceptor...');
        throw new common_1.HttpException('This is a test error!', common_1.HttpStatus.BAD_REQUEST);
    }
    testCrash() {
        console.log('💥 Testing unexpected error...');
        throw new Error('Something went wrong unexpectedly!');
    }
    create(createUserDto) {
        console.log('📝 Creating user with data:', {
            ...createUserDto,
            password: '[HIDDEN]',
        });
        return this.usersService.create(createUserDto);
    }
    findAll() {
        console.log('📋 Getting all users (passwords will be hidden by interceptor)');
        return this.usersService.findAll();
    }
    findOne(id) {
        console.log(`👤 Getting user ${id} (password will be hidden by interceptor)`);
        return this.usersService.findOne(+id);
    }
    update(id, updateUserDto) {
        console.log(`✏️ Updating user ${id}`);
        return this.usersService.update(+id, updateUserDto);
    }
    remove(id) {
        console.log(`🗑️ Deleting user ${id}`);
        return this.usersService.remove(+id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", user_entity_1.User)
], UsersController.prototype, "testExclude", null);
__decorate([
    (0, common_1.Get)('test-error'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "testError", null);
__decorate([
    (0, common_1.Get)('test-crash'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "testCrash", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor, logger_error_interceptor_1.LoggerErrorInterceptor),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map