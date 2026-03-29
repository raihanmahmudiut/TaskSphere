import { HttpException } from '@nestjs/common';
import { IException, IHttpInternalServerErrorExceptionResponse } from './exceptions.interface';
export declare class InternalServerErrorException extends HttpException {
    code: number;
    cause: Error;
    message: string;
    description: string;
    timestamp: string;
    traceId: string;
    constructor(exception: IException);
    setTraceId: (traceId: string) => void;
    generateHttpResponseBody: (message?: string) => IHttpInternalServerErrorExceptionResponse;
    static INTERNAL_SERVER_ERROR: (error: any) => InternalServerErrorException;
    static UNEXPECTED_ERROR: (error: any) => InternalServerErrorException;
}
