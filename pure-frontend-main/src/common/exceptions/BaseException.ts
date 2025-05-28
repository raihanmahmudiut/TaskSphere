import { AllExceptionErrorCodes } from '@/common/types/utils.type';

export class BaseException extends Error {
    constructor(
        public readonly errorCode?: AllExceptionErrorCodes,
        public readonly payload?: {
            reference?: string;
            errors?: unknown;
        }
    ) {
        super((errorCode as unknown as string) || 'Error');
        Error.captureStackTrace(this, this.constructor);
    }
}
