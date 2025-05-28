'use client';

import { type Table } from '@tanstack/react-table';
import * as React from 'react';

import type { DatableAdvancedFilterField } from '@/common/types';
import { DatableFilterList } from '@/components/datable/datable-filter-list';
import { DatableSortList } from '@/components/datable/datable-sort-list';
import { DatableViewOptions } from '@/components/datable/datable-view-options';
import { cn } from '@/lib/utils';

interface DatableAdvancedToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  // eslint-disable-next-line lines-around-comment
  /**
   * @format
   * The table instance returned from useDatable hook with pagination, sorting, filtering, etc.
   * @type Table<TData>
   */

  table: Table<TData>;

  /**
   * An array of filter field configurations for the data table.
   * @type DatableAdvancedFilterField<TData>[]
   * @example
   * const filterFields = [
   *   {
   *     id: 'name',
   *     label: 'Name',
   *     type: 'text',
   *     placeholder: 'Filter by name...'
   *   },
   *   {
   *     id: 'status',
   *     label: 'Status',
   *     type: 'select',
   *     options: [
   *       { label: 'Active', value: 'active', count: 10 },
   *       { label: 'Inactive', value: 'inactive', count: 5 }
   *     ]
   *   }
   * ]
   */
  filterFields: DatableAdvancedFilterField<TData>[];

  /**
   * Debounce time (ms) for filter updates to enhance performance during rapid input.
   * @default 300
   */
  debounceMs?: number;

  /**
   * Shallow mode keeps query states client-side, avoiding server calls.
   * Setting to `false` triggers a network request with the updated querystring.
   * @default true
   */
  shallow?: boolean;
}

export function DatableAdvancedToolbar<TData>({
  table,
  filterFields = [],
  debounceMs = 300,
  shallow = true,
  children,
  className,
  ...props
}: DatableAdvancedToolbarProps<TData>) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-2 overflow-auto p-1',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <DatableFilterList
          table={table}
          filterFields={filterFields}
          debounceMs={debounceMs}
          shallow={shallow}
        />
        <DatableSortList
          table={table}
          debounceMs={debounceMs}
          shallow={shallow}
        />
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DatableViewOptions table={table} />
      </div>
    </div>
  );
}
