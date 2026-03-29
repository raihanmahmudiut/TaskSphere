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
var ValidationExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const class_validator_1 = require("class-validator");
const bad_request_exception_1 = require("../exceptions/bad-request.exception");
let ValidationExceptionFilter = ValidationExceptionFilter_1 = class ValidationExceptionFilter {
    constructor(httpAdapterHost) {
        this.httpAdapterHost = httpAdapterHost;
        this.logger = new common_1.Logger(ValidationExceptionFilter_1.name);
    }
    catch(exception, host) {
        this.logger.verbose(exception);
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const httpStatus = common_1.HttpStatus.UNPROCESSABLE_ENTITY;
        const request = ctx.getRequest();
        const errorMsg = exception.constraints || exception.children[0].constraints;
        const err = bad_request_exception_1.BadRequestException.VALIDATION_ERROR(Object.values(errorMsg)[0]);
        const responseBody = {
            error: err.code,
            message: err.message,
            timestamp: new Date().toISOString(),
            traceId: request.id,
        };
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
};
exports.ValidationExceptionFilter = ValidationExceptionFilter;
exports.ValidationExceptionFilter = ValidationExceptionFilter = ValidationExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(class_validator_1.ValidationError),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost])
], ValidationExceptionFilter);
//# sourceMappingURL=validator-exception.filter.js.map