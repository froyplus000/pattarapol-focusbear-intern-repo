"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const configuration_1 = __importDefault(require("./config/configuration"));
const config_controller_1 = require("./config/config.controller");
const joi_1 = __importDefault(require("joi"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                validationSchema: joi_1.default.object({
                    NODE_ENV: joi_1.default.string()
                        .valid('development', 'production', 'test')
                        .default('development'),
                    APP_PORT: joi_1.default.number().default(3000),
                    DB_HOST: joi_1.default.string().required(),
                    DB_PORT: joi_1.default.number().default(5432),
                    DB_USER: joi_1.default.string().required(),
                    DB_PASS: joi_1.default.string().required(),
                    DB_NAME: joi_1.default.string().required(),
                }),
                envFilePath: [
                    `.env.${process.env.NODE_ENV}.local`,
                    `.env.${process.env.NODE_ENV}`,
                    `.env.local`,
                    `.env`,
                ],
                expandVariables: true,
            }),
        ],
        controllers: [app_controller_1.AppController, config_controller_1.ConfigController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map