import { Exception } from '@/common/constants';
import { ExceptionErrorCodes } from '@/common/types/utils.type';

import { BaseException } from './BaseException';

export class InternalServerErrorException extends BaseException {
    constructor(
        errorCode?: ExceptionErrorCodes<
            typeof Exception.InternalServerErrorException
        >,
        payload?: {
            reference?: string;
            errors?: unknown;
        }
    ) {
        super(errorCode || 50000, payload);
        Error.captureStackTrace(this, this.constructor);
    }
}
