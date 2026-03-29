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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const exceptions_constants_1 = require("./exceptions.constants");
class BadRequestException extends common_1.HttpException {
    constructor(exception) {
        super(exception.message, common_1.HttpStatus.BAD_REQUEST, {
            cause: exception.cause,
            description: exception.description,
        });
        this.setTraceId = (traceId) => {
            this.traceId = traceId;
        };
        this.generateHttpResponseBody = (message) => {
            return {
                _meta: {
                    message: message || this.message,
                    description: this.description,
                    timestamp: this.timestamp,
                    code: this.code,
                    traceId: this.traceId,
                },
            };
        };
        this.message = exception.message;
        this.cause = exception.cause;
        this.description = exception.description;
        this.code = exception.code;
        this.timestamp = new Date().toISOString();
    }
}
exports.BadRequestException = BadRequestException;
BadRequestException.HTTP_REQUEST_TIMEOUT = () => {
    return new BadRequestException({
        message: 'HTTP Request Timeout',
        code: exceptions_constants_1.ExceptionConstants.BadRequestCodes.HTTP_REQUEST_TIMEOUT,
    });
};
BadRequestException.RESOURCE_ALREADY_EXISTS = (msg) => {
    return new BadRequestException({
        message: msg || 'Resource Already Exists',
        code: exceptions_constants_1.ExceptionConstants.BadRequestCodes.RESOURCE_ALREADY_EXISTS,
    });
};
BadRequestException.RESOURCE_NOT_FOUND = (msg) => {
    return new BadRequestException({
        message: msg || 'Resource Not Found',
        code: exceptions_constants_1.ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
    });
};
BadRequestException.VALIDATION_ERROR = (msg) => {
    return new BadRequestException({
        message: msg || 'Validation Error',
        code: exceptions_constants_1.ExceptionConstants.BadRequestCodes.VALIDATION_ERROR,
    });
};
BadRequestException.UNEXPECTED = (msg) => {
    return new BadRequestException({
        message: msg || 'Unexpected Error',
        code: exceptions_constants_1.ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
    });
};
BadRequestException.INVALID_INPUT = (msg) => {
    return new BadRequestException({
        message: msg || 'Invalid Input',
        code: exceptions_constants_1.ExceptionConstants.BadRequestCodes.INVALID_INPUT,
    });
};
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: exceptions_constants_1.ExceptionConstants.BadRequestCodes,
        description: 'A unique code identifying the error.',
        example: exceptions_constants_1.ExceptionConstants.BadRequestCodes.VALIDATION_ERROR,
    }),
    __metadata("design:type", Number)
], BadRequestException.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Error)
], BadRequestException.prototype, "cause", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message for the exception',
        example: 'Bad Request',
    }),
    __metadata("design:type", String)
], BadRequestException.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'A description of the error message.',
        example: 'The input provided was invalid',
    }),
    __metadata("design:type", String)
], BadRequestException.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of the exception',
        format: 'date-time',
        example: '2022-12-31T23:59:59.999Z',
    }),
    __metadata("design:type", String)
], BadRequestException.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Trace ID of the request',
        example: '65b5f773-df95-4ce5-a917-62ee832fcdd0',
    }),
    __metadata("design:type", String)
], BadRequestException.prototype, "traceId", void 0);
//# sourceMappingURL=bad-request.exception.js.map