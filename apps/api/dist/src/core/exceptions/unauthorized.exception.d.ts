import { HttpException } from '@nestjs/common';
import { IException, IHttpUnauthorizedExceptionResponse } from './exceptions.interface';
export declare class UnauthorizedException extends HttpException {
    code: number;
    cause: Error;
    message: string;
    description: string;
    timestamp: string;
    traceId: string;
    constructor(exception: IException);
    setTraceId: (traceId: string) => void;
    generateHttpResponseBody: (message?: string) => IHttpUnauthorizedExceptionResponse;
    static TOKEN_EXPIRED_ERROR: (msg?: string) => UnauthorizedException;
    static JSON_WEB_TOKEN_ERROR: (msg?: string) => UnauthorizedException;
    static UNAUTHORIZED_ACCESS: (description?: string) => UnauthorizedException;
    static RESOURCE_NOT_FOUND: (msg?: string) => UnauthorizedException;
    static USER_NOT_VERIFIED: (msg?: string) => UnauthorizedException;
    static UNEXPECTED_ERROR: (error: any) => UnauthorizedException;
    static REQUIRED_RE_AUTHENTICATION: (msg?: string) => UnauthorizedException;
    static INVALID_RESET_PASSWORD_TOKEN: (msg?: string) => UnauthorizedException;
}
