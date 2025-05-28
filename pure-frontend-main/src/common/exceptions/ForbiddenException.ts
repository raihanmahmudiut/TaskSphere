import { Exception } from '@/common/constants';
import { ExceptionErrorCodes } from '@/common/types/utils.type';

import { BaseException } from './BaseException';

export class ForbiddenException extends BaseException {
    constructor(
        errorCode?: ExceptionErrorCodes<typeof Exception.ForbiddenException>,
        payload?: {
            reference?: string;
            errors?: unknown;
        }
    ) {
        super(errorCode || 40300, payload);
        Error.captureStackTrace(this, this.constructor);
    }
}
