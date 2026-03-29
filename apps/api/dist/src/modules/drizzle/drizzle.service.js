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
exports.DrizzleService = void 0;
const common_1 = require("@nestjs/common");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const db_constants_1 = require("../../core/constants/db.constants");
const postgres = require("postgres");
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
let DrizzleService = class DrizzleService {
    constructor(_NestDrizzleOptions) {
        this._NestDrizzleOptions = _NestDrizzleOptions;
        this.logger = new common_1.Logger('DrizzleService');
    }
    async migrate() {
        const client = postgres(this._NestDrizzleOptions.url, { max: 1 });
        await (0, migrator_1.migrate)((0, postgres_js_1.drizzle)(client), this._NestDrizzleOptions.migrationOptions);
    }
    async getDrizzle() {
        let client;
        if (!this._drizzle) {
            client = postgres(this._NestDrizzleOptions.url);
            try {
                await client `SELECT 1`;
                this.logger.log('Database connected successfully');
            }
            catch (error) {
                this.logger.error('Database connection error', error);
                throw error;
            }
            this._drizzle = (0, postgres_js_1.drizzle)(client, this._NestDrizzleOptions.options);
        }
        return this._drizzle;
    }
};
exports.DrizzleService = DrizzleService;
exports.DrizzleService = DrizzleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_constants_1.NEST_DRIZZLE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], DrizzleService);
//# sourceMappingURL=drizzle.service.js.map