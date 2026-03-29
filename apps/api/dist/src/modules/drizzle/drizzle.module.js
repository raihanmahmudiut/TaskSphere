"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NestDrizzleModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestDrizzleModule = void 0;
const common_1 = require("@nestjs/common");
const drizzle_service_1 = require("./drizzle.service");
const drizzle_provider_1 = require("./drizzle.provider");
const db_constants_1 = require("../../core/constants/db.constants");
let NestDrizzleModule = NestDrizzleModule_1 = class NestDrizzleModule {
    static forRoot(options) {
        const providers = [
            ...(0, drizzle_provider_1.createNestDrizzleProviders)(options),
            drizzle_service_1.DrizzleService,
            drizzle_provider_1.connectionFactory,
        ];
        return {
            module: NestDrizzleModule_1,
            providers: providers,
            exports: [
                drizzle_provider_1.connectionFactory,
                drizzle_service_1.DrizzleService,
                db_constants_1.NEST_DRIZZLE_OPTIONS,
                db_constants_1.DRIZZLE_PROVIDER,
            ],
        };
    }
    static forRootAsync(options) {
        const optionProvider = this.createOptionsProvider(options);
        const providers = [optionProvider, drizzle_service_1.DrizzleService, drizzle_provider_1.connectionFactory];
        if (options.useClass && !options.useExisting && !options.useFactory) {
            providers.push({
                provide: options.useClass,
                useClass: options.useClass,
            });
        }
        return {
            module: NestDrizzleModule_1,
            imports: options.imports || [],
            providers: providers,
            exports: [
                drizzle_provider_1.connectionFactory,
                drizzle_service_1.DrizzleService,
                db_constants_1.NEST_DRIZZLE_OPTIONS,
                db_constants_1.DRIZZLE_PROVIDER,
            ],
        };
    }
    static createOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: db_constants_1.NEST_DRIZZLE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: db_constants_1.NEST_DRIZZLE_OPTIONS,
            useFactory: async (optionsFactory) => await optionsFactory.createNestDrizzleOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }
};
exports.NestDrizzleModule = NestDrizzleModule;
exports.NestDrizzleModule = NestDrizzleModule = NestDrizzleModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], NestDrizzleModule);
//# sourceMappingURL=drizzle.module.js.map