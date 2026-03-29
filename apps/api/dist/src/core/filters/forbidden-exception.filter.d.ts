import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ForbiddenException } from '../exceptions';
export declare class ForbiddenExceptionFilter implements ExceptionFilter {
    private readonly httpAdapterHost;
    private readonly logger;
    constructor(httpAdapterHost: HttpAdapterHost);
    catch(exception: ForbiddenException, host: ArgumentsHost): void;
}
