import { Exception } from '@/common/constants';
import { ExceptionErrorCodes } from '@/common/types/utils.type';

import { BaseException } from './BaseException';

export class NotFoundException extends BaseException {
    constructor(
        errorCode?: ExceptionErrorCodes<typeof Exception.NotFoundException>,
        payload?: {
            reference?: string;
            errors?: unknown;
        }
    ) {
        super(errorCode || 40400, payload);
        Error.captureStackTrace(this, this.constructor);
    }
}
