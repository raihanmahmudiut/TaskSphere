import { AxiosError } from 'axios';

import { Exception } from '@/common/constants';
import {
    BadRequestException,
    BaseException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@/common/exceptions';
import {
    AllExceptionErrorCodes,
    ExceptionErrorCodes,
} from '@/common/types/utils.type';

import { APIExceptionResponse } from '../types/common.type';

export function transformApiError(error: AxiosError): {
    code?: number;
    success: false;
    data: APIExceptionResponse;
    message?: string;
    errorInstance?: BaseException;
} {
    const data = error.response?.data as APIExceptionResponse | undefined;

    let errorInstance: BaseException = new InternalServerErrorException(
        Exception.InternalServerErrorException.UNKNOWN.ERROR_CODE
    );

    if (error.response?.status === 400) {
        errorInstance = new BadRequestException(
            data?.error_code as ExceptionErrorCodes<
                typeof Exception.BadRequestException
            >
        );
    } else if (error.response?.status === 401) {
        errorInstance = new UnauthorizedException(
            data?.error_code as ExceptionErrorCodes<
                typeof Exception.UnauthorizedException
            >
        );
    } else if (error.response?.status === 403) {
        errorInstance = new ForbiddenException(
            data?.error_code as ExceptionErrorCodes<
                typeof Exception.ForbiddenException
            >
        );
    } else if (error.response?.status === 404) {
        errorInstance = new NotFoundException(
            data?.error_code as ExceptionErrorCodes<
                typeof Exception.NotFoundException
            >
        );
    } else if (error.response?.status === 422) {
        errorInstance = new UnprocessableEntityException(
            data?.error_code as ExceptionErrorCodes<
                typeof Exception.UnprocessableEntityException
            >
        );
    } else
        errorInstance = new InternalServerErrorException(
            data?.error_code
                ? (data.error_code as ExceptionErrorCodes<
                      typeof Exception.InternalServerErrorException
                  >)
                : 50000
        );

    return {
        code: error.response?.status,
        success: false,
        errorInstance,
        data: data ?? {
            error_code: 50000,
            status_code: 500,
        },
    };
}

export function getMessageFromErrorCode<T>(
    code: AllExceptionErrorCodes,
    context?: T
) {
    const errorTypes = Object.keys(Exception) as (keyof typeof Exception)[];

    for (const errorType of errorTypes) {
        const error = Exception[errorType];
        const errorKeys = Object.keys(error) as (keyof typeof error)[];

        for (const errorKey of errorKeys) {
            if ((error[errorKey].ERROR_CODE as typeof code) === code) {
                return error[errorKey].MESSAGE(context);
            }
        }
    }

    return 'Something went wrong!';
}
