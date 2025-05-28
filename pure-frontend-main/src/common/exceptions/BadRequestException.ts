import { Exception } from '@/common/constants';
import { ExceptionErrorCodes } from '@/common/types/utils.type';

import { BaseException } from './BaseException';

export class BadRequestException extends BaseException {
    constructor(
        errorCode?: ExceptionErrorCodes<typeof Exception.BadRequestException>,
        payload?: {
            reference?: string;
            errors?: unknown;
        }
    ) {
        super(errorCode || 40000, payload);
        Error.captureStackTrace(this, this.constructor);
    }
}
