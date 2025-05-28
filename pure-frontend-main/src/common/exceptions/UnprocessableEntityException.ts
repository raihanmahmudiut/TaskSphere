import { Exception } from '@/common/constants';
import { ExceptionErrorCodes } from '@/common/types/utils.type';

import { BaseException } from './BaseException';

export class UnprocessableEntityException extends BaseException {
    constructor(
        errorCode?: ExceptionErrorCodes<
            typeof Exception.UnprocessableEntityException
        >,
        payload?: {
            reference?: string;
            errors?: unknown;
        }
    ) {
        super(errorCode || 42200, payload);
        Error.captureStackTrace(this, this.constructor);
    }
}
