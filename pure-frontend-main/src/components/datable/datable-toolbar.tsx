/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client';

import './datable.css';

import type { Table } from '@tanstack/react-table';
import { Search, Wand2, X } from 'lucide-react';
import * as React from 'react';

import type {
  DatableFilterField,
  DatableGlobalFilterField,
} from '@/common/types';
import { DatableFacetedFilter } from '@/components/datable/datable-faceted-filter';
import { DatableViewOptions } from '@/components/datable/datable-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DatableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;

  /**
   * An array of filter field configurations for the data table.
   * When options are provided, a faceted filter is rendered.
   * Otherwise, a search filter is rendered.
   *
   * @example
   * const filterFields = [
   *   {
   *     id: 'name',
   *     label: 'Name',
   *     placeholder: 'Filter by name...'
   *   },
   *   {
   *     id: 'status',
   *     label: 'Status',
   *     options: [
   *       { label: 'Active', value: 'active', icon: ActiveIcon, count: 10 },
   *       { label: 'Inactive', value: 'inactive', icon: InactiveIcon, count: 5 }
   *     ]
   *   },
   * ]
   */
  filterFields?: DatableFilterField<TData>[];
  globalFilterField?: DatableGlobalFilterField<Record<PropertyKey, unknown>>;
  onGlobalFilterChange?: (value: string) => void;
  showFilterButton?: boolean;
  onFilterButtonClick?: () => void;
  isFiltering?: boolean;
  isFiltered?: boolean;
  onResetButtonClick?: () => void;
}

export function DatableToolbar<TData>({
  table,
  filterFields = [],
  globalFilterField,
  onGlobalFilterChange,
  children,
  className,
  isFiltering,
  showFilterButton = true,
  onFilterButtonClick,
  onResetButtonClick,
  ...props
}: DatableToolbarProps<TData>) {
  const isFiltered =
    props.isFiltered ||
    table.getState().columnFilters.length > 0 ||
    table.getState().globalFilter;

  const { searchableColumns, filterableColumns, datePickerColumns } =
    React.useMemo(() => {
      return {
        searchableColumns: filterFields.filter(
          (field) => !field.options && !field.datePicker
        ),
        filterableColumns: filterFields.filter((field) => field.options),
        datePickerColumns: filterFields.filter((field) => field.datePicker),
      };
    }, [filterFields]);

  const renderGlobalFilter = () =>
    globalFilterField && (
      <div className="relative flex items-center">
        <Input
          key={String(globalFilterField.id)}
          value={table.getState().globalFilter ?? ''}
          onChange={(e) =>
            onGlobalFilterChange?.(e.target.value) ||
            table.setGlobalFilter(String(e.target.value))
          }
          placeholder={globalFilterField.placeholder}
          className={cn('h-8 w-40 lg:w-64', {
            'pr-10':
              globalFilterField.showSearchButton &&
              table.getState().globalFilter,
          })}
          disabled={isFiltering}
        />
        {globalFilterField.showSearchButton &&
          table.getState().globalFilter && (
            <Button
              className="absolute right-0 h-full top-1/2 transform -translate-y-1/2 bg-black p-1 rounded flex items-center justify-center"
              onClick={() =>
                globalFilterField.onSearchButtonClick?.(
                  table.getState().globalFilter ?? ''
                )
              }
              disabled={isFiltering}
            >
              <Search className="text-white" size={16} />
            </Button>
          )}
      </div>
    );

  const renderSearchableColumns = () =>
    searchableColumns.map(
      (column) =>
        table.getColumn(String(column.id)) && (
          <Input
            key={String(column.id)}
            placeholder={column.placeholder}
            value={
              (table
                .getColumn(String(column.id))
                ?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table
                .getColumn(String(column.id))
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-40 lg:w-64"
            disabled={isFiltering}
          />
        )
    );

  const renderFilterableColumns = () =>
    filterableColumns.map(
      (column) =>
        table.getColumn(String(column.id)) && (
          <DatableFacetedFilter
            key={String(column.id)}
            column={table.getColumn(String(column.id))}
            title={column.label}
            options={column.options ?? []}
            disabled={isFiltering}
          />
        )
    );

  const renderDatePickerColumns = () =>
    datePickerColumns.map(
      (column) =>
        table.getColumn(String(column.id)) && (
          <DatableFacetedFilter
            key={String(column.id)}
            column={table.getColumn(String(column.id))}
            title={column.label}
            options={column.options ?? []}
            disabled={isFiltering}
            datePicker
          />
        )
    );

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-2 overflow-auto p-1',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2">
        {renderGlobalFilter()}
        {renderSearchableColumns()}
        {renderFilterableColumns()}
        {renderDatePickerColumns()}
        {isFiltered && (
          <div className="flex gap-2">
            {showFilterButton && (
              <Button
                aria-label="Apply filters"
                variant="default"
                className="h-8 px-2 lg:px-3 relative overflow-hidden"
                onClick={onFilterButtonClick}
                disabled={isFiltering}
              >
                <span
                  className={`transition-opacity duration-300 ${
                    isFiltering ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  Apply
                </span>
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    isFiltering ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Wand2
                    aria-hidden="true"
                    size={16}
                    className="text-white relative"
                  />
                  {isFiltering && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="sparkle top-[-10px] left-[-8px]" />
                      <span className="sparkle top-[-8px] right-[-10px]" />
                      <span className="sparkle bottom-[-10px] left-[5px]" />
                      <span className="sparkle bottom-[-8px] right-[5px]" />
                    </div>
                  )}
                </div>
              </Button>
            )}
            {showFilterButton && (
              <Button
                aria-label="Reset filters"
                variant="ghost"
                className={cn('h-8 px-2 lg:px-3')}
                onClick={() => {
                  table.resetColumnFilters();
                  table.setGlobalFilter('');
                  onResetButtonClick?.();
                }}
                disabled={isFiltering}
              >
                Reset
                <X className="ml-2 size-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DatableViewOptions table={table} />
      </div>
    </div>
  );
}
