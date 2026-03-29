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
var NotFoundExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let NotFoundExceptionFilter = NotFoundExceptionFilter_1 = class NotFoundExceptionFilter {
    constructor(httpAdapterHost) {
        this.httpAdapterHost = httpAdapterHost;
        this.logger = new common_1.Logger(NotFoundExceptionFilter_1.name);
    }
    catch(exception, host) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const httpStatus = exception instanceof common_1.HttpException ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const request = ctx.getRequest();
        const responseBody = {
            error: exception.code,
            message: exception.message,
            description: exception.description,
            traceId: request.id,
        };
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
};
exports.NotFoundExceptionFilter = NotFoundExceptionFilter;
exports.NotFoundExceptionFilter = NotFoundExceptionFilter = NotFoundExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.NotFoundException),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost])
], NotFoundExceptionFilter);
//# sourceMappingURL=not-found-exception.filter.js.map