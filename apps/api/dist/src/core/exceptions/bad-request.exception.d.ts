import { HttpException } from '@nestjs/common';
import { IException, IHttpBadRequestExceptionResponse } from './exceptions.interface';
export declare class BadRequestException extends HttpException {
    code: number;
    cause: Error;
    message: string;
    description: string;
    timestamp: string;
    traceId: string;
    constructor(exception: IException);
    setTraceId: (traceId: string) => void;
    generateHttpResponseBody: (message?: string) => IHttpBadRequestExceptionResponse;
    static HTTP_REQUEST_TIMEOUT: () => BadRequestException;
    static RESOURCE_ALREADY_EXISTS: (msg?: string) => BadRequestException;
    static RESOURCE_NOT_FOUND: (msg?: string) => BadRequestException;
    static VALIDATION_ERROR: (msg?: string) => BadRequestException;
    static UNEXPECTED: (msg?: string) => BadRequestException;
    static INVALID_INPUT: (msg?: string) => BadRequestException;
}
