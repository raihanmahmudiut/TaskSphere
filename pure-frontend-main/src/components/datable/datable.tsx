import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import * as React from 'react';

import { DatablePagination } from '@/components/datable/datable-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/datable';
import { cn } from '@/lib/utils';

interface DatableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: TanstackTable<TData>;
  floatingBar?: React.ReactNode | null;
  headerStyles?: React.CSSProperties;
  cellStyles?: React.CSSProperties;
  tableClassName?: string;
  customText?: string;
  customElement?: React.ReactNode;
  isLoading?: boolean;
  pagination?: boolean;
}

export function Datable<TData>({
  table,
  floatingBar = null,
  children,
  className,
  tableClassName = '',
  customText,
  customElement,
  isLoading = false,
  pagination = true,
  ...props
}: DatableProps<TData>) {
  // const defaultHeaderStyles: React.CSSProperties = {
  //   minWidth: '150px',
  //   maxWidth: '250px',
  //   whiteSpace: 'nowrap',
  //   overflow: 'hidden',
  //   textOverflow: 'ellipsis',
  // };

  // const defaultCellStyles: React.CSSProperties = {
  //   minWidth: '150px',
  //   maxWidth: '250px',
  //   whiteSpace: 'nowrap',
  //   overflow: 'hidden',
  //   textOverflow: 'ellipsis',
  // };

  // const mergedHeaderStyles = { ...defaultHeaderStyles, ...headerStyles };
  // const mergedCellStyles = { ...defaultCellStyles, ...cellStyles };

  return (
    <div className={cn('w-full space-y-2.5', className)} {...props}>
      {children}
      <div className="relative overflow-auto rounded-md border">
        <Table className={cn('relative table-auto w-full', tableClassName)}>
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="sticky top-0 z-10">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        ...getCommonPinningStyles({ column: header.column }),

                        // ...mergedHeaderStyles,
                      }}
                      className="px-4 py-2 sticky"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),

                        // ...mergedCellStyles,
                      }}
                      className="px-4 py-2 break-words whitespace-normal overflow-wrap-break-word"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  {isLoading ? customElement : customText || 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <div className="flex flex-col gap-2.5">
          <DatablePagination table={table} />
          {table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
        </div>
      )}
    </div>
  );
}
