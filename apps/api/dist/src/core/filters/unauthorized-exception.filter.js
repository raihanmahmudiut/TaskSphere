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
var UnauthorizedExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const unauthorized_exception_1 = require("../exceptions/unauthorized.exception");
let UnauthorizedExceptionFilter = UnauthorizedExceptionFilter_1 = class UnauthorizedExceptionFilter {
    constructor(httpAdapterHost) {
        this.httpAdapterHost = httpAdapterHost;
        this.logger = new common_1.Logger(UnauthorizedExceptionFilter_1.name);
    }
    catch(exception, host) {
        this.logger.warn(exception);
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const httpStatus = exception.getStatus();
        const request = ctx.getRequest();
        exception.setTraceId(request.id);
        const responseBody = exception.generateHttpResponseBody();
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
};
exports.UnauthorizedExceptionFilter = UnauthorizedExceptionFilter;
exports.UnauthorizedExceptionFilter = UnauthorizedExceptionFilter = UnauthorizedExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(unauthorized_exception_1.UnauthorizedException),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost])
], UnauthorizedExceptionFilter);
//# sourceMappingURL=unauthorized-exception.filter.js.map