import type { ColumnSort, Row } from '@tanstack/react-table';
import { type XOR } from 'ts-xor';
import { type z } from 'zod';

import { type DatableConfig } from '@/config/datable.config';
import { type filterSchema } from '@/lib/parsers';

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & object;

export type StringKeyOf<TData> = Extract<keyof TData, string>;

export interface SearchParams {
    [key: string]: string | string[] | undefined;
}

export interface Option {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    count?: number;
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
    id: StringKeyOf<TData>;
}

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[];

export type ColumnType = DatableConfig['columnTypes'][number];

export type FilterOperator = DatableConfig['globalOperators'][number];

export type JoinOperator = DatableConfig['joinOperators'][number]['value'];

export type DatableFilterField<TData> = XOR<
    {
        id: StringKeyOf<TData> | string;
        label: string;
        placeholder?: string;
        options?: Option[];
    },
    {
        id: StringKeyOf<TData> | string;
        label: string;
        placeholder?: string;
        datePicker?: boolean;
    }
>;

export type DatableGlobalFilterField<TData> = {
    showSearchButton?: boolean;
    onSearchButtonClick?: (searchTerm: string) => void;
} & DatableFilterField<TData>;

export type DatableAdvancedFilterField<TData> = {
    type: ColumnType;
} & DatableFilterField<TData>;

export type Filter<TData> = Prettify<
    Omit<z.infer<typeof filterSchema>, 'id'> & {
        id: StringKeyOf<TData>;
    }
>;

export interface DatableRowAction<TData> {
    row: Row<TData>;
    type: 'update' | 'delete' | 'view' | 'download' | 'detail' | string;
}
