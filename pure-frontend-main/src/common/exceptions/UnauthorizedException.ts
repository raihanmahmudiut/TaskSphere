import { Exception } from '@/common/constants';
import { ExceptionErrorCodes } from '@/common/types/utils.type';

import { BaseException } from './BaseException';

export class UnauthorizedException extends BaseException {
    constructor(
        errorCode?: ExceptionErrorCodes<typeof Exception.UnauthorizedException>,
        payload?: {
            reference?: string;
            errors?: unknown;
        }
    ) {
        super(errorCode || 40100, payload);
        Error.captureStackTrace(this, this.constructor);
    }
}
