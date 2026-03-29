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
exports.InternalServerErrorException = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const exceptions_constants_1 = require("./exceptions.constants");
class InternalServerErrorException extends common_1.HttpException {
    constructor(exception) {
        super(exception.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR, {
            cause: exception.cause,
            description: exception.description,
        });
        this.setTraceId = (traceId) => {
            this.traceId = traceId;
        };
        this.generateHttpResponseBody = (message) => {
            return {
                _meta: {
                    code: this.code,
                    message: message || this.message,
                    description: this.description,
                    timestamp: this.timestamp,
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
exports.InternalServerErrorException = InternalServerErrorException;
InternalServerErrorException.INTERNAL_SERVER_ERROR = (error) => {
    return new InternalServerErrorException({
        message: 'We are sorry, something went wrong on our end. Please try again later or contact our support team for assistance.',
        code: exceptions_constants_1.ExceptionConstants.InternalServerErrorCodes.INTERNAL_SERVER_ERROR,
        cause: error,
    });
};
InternalServerErrorException.UNEXPECTED_ERROR = (error) => {
    return new InternalServerErrorException({
        message: 'An unexpected error occurred while processing the request.',
        code: exceptions_constants_1.ExceptionConstants.InternalServerErrorCodes.UNEXPECTED_ERROR,
        cause: error,
    });
};
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: exceptions_constants_1.ExceptionConstants.InternalServerErrorCodes,
        description: 'A unique code identifying the error.',
        example: exceptions_constants_1.ExceptionConstants.InternalServerErrorCodes.INTERNAL_SERVER_ERROR,
    }),
    __metadata("design:type", Number)
], InternalServerErrorException.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Error)
], InternalServerErrorException.prototype, "cause", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message for the exception',
        example: 'An unexpected error occurred while processing your request.',
    }),
    __metadata("design:type", String)
], InternalServerErrorException.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'A description of the error message.',
        example: 'The server encountered an unexpected condition that prevented it from fulfilling the request. This could be due to an error in the application code, a misconfiguration in the server, or an issue with the underlying infrastructure. Please try again later or contact the server administrator if the problem persists.',
    }),
    __metadata("design:type", String)
], InternalServerErrorException.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of the exception',
        format: 'date-time',
        example: '2022-12-31T23:59:59.999Z',
    }),
    __metadata("design:type", String)
], InternalServerErrorException.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Trace ID of the request',
        example: '65b5f773-df95-4ce5-a917-62ee832fcdd0',
    }),
    __metadata("design:type", String)
], InternalServerErrorException.prototype, "traceId", void 0);
//# sourceMappingURL=internal-server-error.exception.js.map