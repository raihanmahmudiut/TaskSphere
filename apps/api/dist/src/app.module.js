"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const core_1 = require("@nestjs/core");
const filters_1 = require("./core/filters");
const users_module_1 = require("./modules/users/users.module");
const config_1 = require("@nestjs/config");
const drizzle_module_1 = require("./modules/drizzle/drizzle.module");
const schema = require("../src/db/index");
const auth_module_1 = require("./modules/auth/auth.module");
const todo_module_1 = require("./modules/todo/todo.module");
const websocket_module_1 = require("./modules/websocket/websocket.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env.local',
            }),
            drizzle_module_1.NestDrizzleModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const databaseUrl = configService.get('DATABASE_URL');
                    if (!databaseUrl) {
                        throw new Error('DATABASE_URL environment variable is not set');
                    }
                    return {
                        driver: 'postgres-js',
                        url: databaseUrl,
                        options: { schema: schema },
                    };
                },
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            todo_module_1.TodoModule,
            websocket_module_1.WebsocketModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_FILTER, useClass: filters_1.AllExceptionsFilter },
            {
                provide: core_1.APP_PIPE,
                useFactory: () => new common_1.ValidationPipe({
                    exceptionFactory: (errors) => {
                        return errors[0];
                    },
                }),
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map