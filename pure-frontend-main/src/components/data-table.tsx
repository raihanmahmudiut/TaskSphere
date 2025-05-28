'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { SpokeSpinner } from './spike-loader';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  loading?: boolean;
  minHeight?: number;
  maxHeight?: string;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  rowSelection?: RowSelectionState;
  rowClassName?: (row: TData) => string; // Add a prop for row className
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  loading,
  minHeight = 600,
  maxHeight = '600px',
  setRowSelection,
  rowSelection = {},
  rowClassName, // Add the new prop
}: DataTableProps<TData, TValue>) {
  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <div
      className={cn('rounded-md border', className, {
        'border-0': loading,
      })}
    >
      <Table
        className={cn('h-full w-full overflow-clip relative', {
          [`min-h-[${minHeight}px]`]: loading && minHeight,
        })}
        wrapperClassName={cn('overflow-y-auto', {
          [`min-h-[${minHeight}px]`]: loading && minHeight,
        })}
        maxHeight={!loading ? maxHeight : undefined}
      >
        <TableHeader
          className={cn(
            'sticky top-0 opacity-1 bg-secondary [&_tr]:border-b z-30',
            {
              'border-1': loading,
            }
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={`whitespace-nowrap text-center ${header.column.columnDef.meta?.thClassName ?? ''}`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className={cn('overflow-scroll h-full z-0')}>
          {loading ? (
            <TableRow className="w-full h-full">
              <TableCell colSpan={columns.length} className="p-0">
                <div className="flex justify-center items-center gap-2 h-full">
                  <SpokeSpinner size="xs" />
                  <span className="text-sm font-medium text-slate-500">
                    Loading...
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={rowClassName ? rowClassName(row.original) : ''}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`text-center ${cell.column.columnDef.meta?.tdClassName ?? ''}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
