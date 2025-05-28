'use client';

import {
    type ColumnFiltersState,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type RowSelectionState,
    type SortingState,
    type TableOptions,
    type TableState,
    type Updater,
    useReactTable,
    type VisibilityState,
} from '@tanstack/react-table';
import {
    parseAsArrayOf,
    parseAsInteger,
    parseAsString,
    type Parser,
    useQueryState,
    type UseQueryStateOptions,
    useQueryStates,
} from 'nuqs';
import * as React from 'react';

import type { DatableFilterField, ExtendedSortingState } from '@/common/types';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { getSortingStateParser } from '@/lib/parsers';

interface UseDatableProps<TData>
    extends Omit<
            TableOptions<TData>,
            | 'state'
            | 'pageCount'
            | 'getCoreRowModel'
            | 'manualFiltering'
            | 'manualPagination'
            | 'manualSorting'
        >,
        Required<Pick<TableOptions<TData>, 'pageCount'>> {
    defaultGlobalFilterId?: string;

    /**
     * Defines the global filter key to use in the URL query.
     * Defaults to 'q' if not specified.
     * @default 'q'
     */

    /**
     * Defines filter fields for the table. Supports both dynamic faceted filters and search filters.
     */
    filterFields?: DatableFilterField<TData>[];

    /**
     * Enable notion-like advanced column filters.
     * Advanced filters and column filters cannot be used at the same time.
     * @default false
     */
    enableAdvancedFilter?: boolean;

    /**
     * Determines how query updates affect history.
     * @default "replace"
     */
    history?: 'push' | 'replace';

    /**
     * Indicates whether the page should scroll to the top when the URL changes.
     * @default false
     */
    scroll?: boolean;

    /**
     * Shallow mode keeps query states client-side, avoiding server calls.
     * @default true
     */
    shallow?: boolean;

    /**
     * Maximum time (ms) to wait between URL query string updates.
     * @default 50
     */
    throttleMs?: number;

    /**
     * Debounce time (ms) for filter updates to enhance performance during rapid input.
     * @default 300
     */
    debounceMs?: number;

    /**
     * Clear URL query key-value pair when state is set to default.
     * @default false
     */
    clearOnDefault?: boolean;

    /**
     * Observe Server Component loading states for non-shallow updates.
     * @see https://react.dev/reference/react/useTransition
     */
    startTransition?: React.TransitionStartFunction;

    initialState?: Omit<Partial<TableState>, 'sorting'> & {
        sorting?: ExtendedSortingState<TData>;
    };
}

export function useDatable<TData>({
    pageCount = -1,
    filterFields = [],
    enableAdvancedFilter = false,
    history = 'replace',
    scroll = false,
    shallow = true,
    throttleMs = 50,
    debounceMs = 300,
    clearOnDefault = false,
    startTransition,
    initialState,
    defaultGlobalFilterId = 'q',
    ...props
}: UseDatableProps<TData>) {
    const queryStateOptions = React.useMemo<
        Omit<UseQueryStateOptions<string>, 'parse'>
    >(() => {
        return {
            history,
            scroll,
            shallow,
            throttleMs,
            debounceMs,
            clearOnDefault,
            startTransition,
        };
    }, [
        history,
        scroll,
        shallow,
        throttleMs,
        debounceMs,
        clearOnDefault,
        startTransition,
    ]);

    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
        initialState?.rowSelection ?? {}
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

    const [page, setPage] = useQueryState(
        'page',
        parseAsInteger.withOptions(queryStateOptions).withDefault(1)
    );
    const [perPage, setPerPage] = useQueryState(
        'perPage',
        parseAsInteger
            .withOptions(queryStateOptions)
            .withDefault(initialState?.pagination?.pageSize ?? 10)
    );
    const [sorting, setSorting] = useQueryState(
        'sort',
        getSortingStateParser<TData>()
            .withOptions(queryStateOptions)
            .withDefault(initialState?.sorting ?? [])
    );

    const [globalFilterValue, setGlobalFilterValue] = useQueryState(
        defaultGlobalFilterId,
        parseAsString.withOptions(queryStateOptions).withDefault('')
    );

    // Create parsers for each filter field
    const filterParsers = React.useMemo(() => {
        return filterFields.reduce<
            Record<string, Parser<string> | Parser<string[]>>
        >((acc, field) => {
            if (field.options) {
                // Faceted filter
                acc[field.id] = parseAsArrayOf(parseAsString, ',').withOptions(
                    queryStateOptions
                );
            } else {
                // Search filter
                acc[field.id] = parseAsString.withOptions(queryStateOptions);
            }

            return acc;
        }, {});
    }, [filterFields, queryStateOptions]);

    const [filterValues, setFilterValues] = useQueryStates(filterParsers);

    const debouncedSetFilterValues = useDebouncedCallback(
        setFilterValues,
        debounceMs
    );

    // Paginate
    const pagination: PaginationState = {
        pageIndex: page - 1, // zero-based index -> one-based index
        pageSize: perPage,
    };

    function onPaginationChange(updaterOrValue: Updater<PaginationState>) {
        if (typeof updaterOrValue === 'function') {
            const newPagination = updaterOrValue(pagination);
            void setPage(newPagination.pageIndex + 1);
            void setPerPage(newPagination.pageSize);
        } else {
            void setPage(updaterOrValue.pageIndex + 1);
            void setPerPage(updaterOrValue.pageSize);
        }
    }

    // Sort
    function onSortingChange(updaterOrValue: Updater<SortingState>) {
        if (typeof updaterOrValue === 'function') {
            const newSorting = updaterOrValue(
                sorting
            ) as ExtendedSortingState<TData>;
            void setSorting(newSorting);
        }
    }

    // Filter
    const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
        return enableAdvancedFilter
            ? []
            : Object.entries(filterValues).reduce<ColumnFiltersState>(
                  (filters, [key, value]) => {
                      if (value !== null) {
                          filters.push({
                              id: key,
                              value: Array.isArray(value) ? value : [value],
                          });
                      }

                      return filters;
                  },
                  []
              );
    }, [filterValues, enableAdvancedFilter]);

    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>(initialColumnFilters);

    // Memoize computation of searchableColumns and filterableColumns
    const { searchableColumns, filterableColumns } = React.useMemo(() => {
        return enableAdvancedFilter
            ? { searchableColumns: [], filterableColumns: [] }
            : {
                  searchableColumns: filterFields.filter(
                      (field) => !field.options
                  ),
                  filterableColumns: filterFields.filter(
                      (field) => field.options
                  ),
              };
    }, [filterFields, enableAdvancedFilter]);

    const onColumnFiltersChange = React.useCallback(
        (updaterOrValue: Updater<ColumnFiltersState>) => {
            // Don't process filters if advanced filtering is enabled
            if (enableAdvancedFilter) return;

            setColumnFilters((prev) => {
                const next =
                    typeof updaterOrValue === 'function'
                        ? updaterOrValue(prev)
                        : updaterOrValue;

                const filterUpdates = next.reduce<
                    Record<string, string | string[] | null>
                >((acc, filter) => {
                    if (searchableColumns.find((col) => col.id === filter.id)) {
                        // For search filters, use the value directly
                        acc[filter.id] = filter.value as string;
                    } else if (
                        filterableColumns.find((col) => col.id === filter.id)
                    ) {
                        // For faceted filters, use the array of values
                        acc[filter.id] = filter.value as string[];
                    }

                    return acc;
                }, {});

                prev.forEach((prevFilter) => {
                    if (!next.some((filter) => filter.id === prevFilter.id)) {
                        filterUpdates[prevFilter.id] = null;
                    }
                });

                void setPage(1);

                debouncedSetFilterValues(filterUpdates);

                return next;
            });
        },
        [
            debouncedSetFilterValues,
            enableAdvancedFilter,
            filterableColumns,
            searchableColumns,
            setPage,
        ]
    );

    const [globalFilter, setGlobalFilter] =
        React.useState<string>(globalFilterValue);

    const debouncedSetGlobalFilter = useDebouncedCallback((value: string) => {
        void setGlobalFilterValue(value);
    }, debounceMs);

    const onGlobalFilterChange = React.useCallback(
        (value: string) => {
            // Don't process filters if advanced filtering is enabled
            if (enableAdvancedFilter) return;

            setGlobalFilter(() => {
                const next = value;

                void setPage(1);

                debouncedSetGlobalFilter(next);

                return next;
            });
        },
        [debouncedSetGlobalFilter, enableAdvancedFilter, setPage]
    );

    const table = useReactTable({
        ...props,
        initialState,
        pageCount,
        state: {
            pagination,
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters: enableAdvancedFilter ? [] : columnFilters,
            globalFilter,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange,
        onSortingChange,
        onColumnFiltersChange,
        onGlobalFilterChange,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: enableAdvancedFilter
            ? undefined
            : getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: enableAdvancedFilter
            ? undefined
            : getFacetedRowModel(),
        getFacetedUniqueValues: enableAdvancedFilter
            ? undefined
            : getFacetedUniqueValues(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    });

    return { table, setGlobalFilterValue };
}
