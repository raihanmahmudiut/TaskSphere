import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InternalServerErrorException } from '../exceptions/internal-server-error.exception';
export declare class InternalServerErrorExceptionFilter implements ExceptionFilter {
    private readonly httpAdapterHost;
    private readonly logger;
    constructor(httpAdapterHost: HttpAdapterHost);
    catch(exception: InternalServerErrorException, host: ArgumentsHost): void;
}
