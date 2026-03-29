import { HttpException } from '@nestjs/common';
import { IException, IHttpForbiddenExceptionResponse } from './exceptions.interface';
export declare class ForbiddenException extends HttpException {
    code: number;
    cause: Error;
    message: string;
    description: string;
    timestamp: string;
    traceId: string;
    constructor(exception: IException);
    setTraceId: (traceId: string) => void;
    generateHttpResponseBody: (message?: string) => IHttpForbiddenExceptionResponse;
    static FORBIDDEN: (msg?: string) => ForbiddenException;
    static MISSING_PERMISSIONS: (msg?: string) => ForbiddenException;
}
