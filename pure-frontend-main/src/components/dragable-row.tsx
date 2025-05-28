import { flexRender, Row } from '@tanstack/react-table';
import { Grip } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';

import { Button } from './ui/button';
import { TableCell, TableRow } from './ui/table';

export function DraggableRow<T>({
  row,
  reorderRow,
}: {
  row: Row<T>;
  reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
}) {
  const [, dropRef] = useDrop({
    accept: 'row',
    drop: (draggedRow: Row<T>) => reorderRow(draggedRow.index, row.index),
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => row,
    type: 'row',
  });

  return (
    <TableRow
      ref={previewRef}
      className={isDragging ? 'opacity-50' : 'opacity-100'}
    >
      <TableCell ref={dropRef}>
        <Button variant="ghost" ref={dragRef} className="cursor-move">
          <Grip />
        </Button>
      </TableCell>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
