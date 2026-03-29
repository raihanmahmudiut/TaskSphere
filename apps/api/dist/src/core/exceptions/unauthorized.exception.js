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
exports.UnauthorizedException = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const exceptions_constants_1 = require("./exceptions.constants");
class UnauthorizedException extends common_1.HttpException {
    constructor(exception) {
        super(exception.message, common_1.HttpStatus.UNAUTHORIZED, {
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
exports.UnauthorizedException = UnauthorizedException;
UnauthorizedException.TOKEN_EXPIRED_ERROR = (msg) => {
    return new UnauthorizedException({
        message: msg || 'The authentication token provided has expired.',
        code: exceptions_constants_1.ExceptionConstants.UnauthorizedCodes.TOKEN_EXPIRED_ERROR,
    });
};
UnauthorizedException.JSON_WEB_TOKEN_ERROR = (msg) => {
    return new UnauthorizedException({
        message: msg || 'Invalid token specified.',
        code: exceptions_constants_1.ExceptionConstants.UnauthorizedCodes.JSON_WEB_TOKEN_ERROR,
    });
};
UnauthorizedException.UNAUTHORIZED_ACCESS = (description) => {
    return new UnauthorizedException({
        message: 'Access to the requested resource is unauthorized.',
        code: exceptions_constants_1.ExceptionConstants.UnauthorizedCodes.UNAUTHORIZED_ACCESS,
        description,
    });
};
UnauthorizedException.RESOURCE_NOT_FOUND = (msg) => {
    return new UnauthorizedException({
        message: msg || 'Resource Not Found',
        code: exceptions_constants_1.ExceptionConstants.UnauthorizedCodes.RESOURCE_NOT_FOUND,
    });
};
UnauthorizedException.USER_NOT_VERIFIED = (msg) => {
    return new UnauthorizedException({
        message: msg || 'User not verified. Please complete verification process before attempting this action.',
        code: exceptions_constants_1.ExceptionConstants.UnauthorizedCodes.USER_NOT_VERIFIED,
    });
};
UnauthorizedException.UNEXPECTED_ERROR = (error) => {
    return new UnauthorizedException({
        message: 'An unexpected error occurred while processing the request. Please try again later.',
        code: exceptions_constants_1.ExceptionConstants.UnauthorizedCodes.UNEXPECTED_ERROR,
        cause: error,
    });
};
UnauthorizedException.REQUIRED_RE_AUTHENTICATION = (msg) => {
    return new UnauthorizedException({
        message: msg ||
            'Your previous login session has been terminated due to a password change or reset. Please log in again with your new password.',
        code: exceptions_constants_1.ExceptionConstants.UnauthorizedCodes.REQUIRED_RE_AUTHENTICATION,
    });
};
UnauthorizedException.INVALID_RESET_PASSWORD_TOKEN = (msg) => {
    return new UnauthorizedException({
        message: msg || 'The reset password token provided is invalid. Please request a new reset password token.',
        code: exceptions_constants_1.ExceptionConstants.UnauthorizedCodes.INVALID_RESET_PASSWORD_TOKEN,
    });
};
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: exceptions_constants_1.ExceptionConstants.UnauthorizedCodes,
        description: 'A unique code identifying the error.',
        example: exceptions_constants_1.ExceptionConstants.UnauthorizedCodes.TOKEN_EXPIRED_ERROR,
    }),
    __metadata("design:type", Number)
], UnauthorizedException.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Error)
], UnauthorizedException.prototype, "cause", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message for the exception',
        example: 'The authentication token provided has expired.',
    }),
    __metadata("design:type", String)
], UnauthorizedException.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'A description of the error message.',
        example: 'This error message indicates that the authentication token provided with the request has expired, and therefore the server cannot verify the users identity.',
    }),
    __metadata("design:type", String)
], UnauthorizedException.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of the exception',
        format: 'date-time',
        example: '2022-12-31T23:59:59.999Z',
    }),
    __metadata("design:type", String)
], UnauthorizedException.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Trace ID of the request',
        example: '65b5f773-df95-4ce5-a917-62ee832fcdd0',
    }),
    __metadata("design:type", String)
], UnauthorizedException.prototype, "traceId", void 0);
//# sourceMappingURL=unauthorized.exception.js.map