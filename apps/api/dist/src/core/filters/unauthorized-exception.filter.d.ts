import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
export declare class UnauthorizedExceptionFilter implements ExceptionFilter {
    private readonly httpAdapterHost;
    private readonly logger;
    constructor(httpAdapterHost: HttpAdapterHost);
    catch(exception: UnauthorizedException, host: ArgumentsHost): void;
}
