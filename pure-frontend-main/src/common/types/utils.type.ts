import { Dispatch, SetStateAction } from 'react';
import React from 'react';

import { Exception } from '@/common/constants';

type ExceptionErrorObj<T> = {
    [K in keyof T]: T[K] extends { ERROR_CODE: number }
        ? T[K]['ERROR_CODE']
        : never;
};

export type ExceptionErrorCodes<
    T extends (typeof Exception)[keyof typeof Exception],
> = ExceptionErrorObj<T>[keyof ExceptionErrorObj<T>];

export type AllExceptionErrorCodes =
    | ExceptionErrorCodes<typeof Exception.BadRequestException>
    | ExceptionErrorCodes<typeof Exception.ForbiddenException>
    | ExceptionErrorCodes<typeof Exception.InternalServerErrorException>
    | ExceptionErrorCodes<typeof Exception.NotFoundException>
    | ExceptionErrorCodes<typeof Exception.UnauthorizedException>
    | ExceptionErrorCodes<typeof Exception.UnprocessableEntityException>;

export type Actions =
    | 'can_view'
    | 'can_insert'
    | 'can_edit'
    | 'can_delete'
    | 'can_authorize'
    | 'can_submit'
    | 'can_reject';

export type RecordListAPIResponse<T> = {
    items: Array<T>;
    meta: {
        total?: number;
        count?: number;
        per_page?: number;
        total_pages?: number;
        current_page?: number;
    };
};

export type ComponentListAPIResponse<T> = {
    items: Array<T>;
};

export type PermissionGroupAPIResponse<T> = {
    items: Array<T>;
};

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type IconMap = {
    [key: string]: React.ElementType;
};

export type DisbursementItemProps = {
    label: string;
    value: React.ReactNode;
    icon?: React.ElementType;
};
