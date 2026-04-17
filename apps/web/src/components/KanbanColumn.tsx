import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface KanbanColumnProps {
  id: string;
  label: string;
  color: string;
  count: number;
  children: ReactNode;
}

export default function KanbanColumn({
  id,
  label,
  color,
  count,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-xl border-2 border-dashed p-2 transition-colors min-h-[200px]',
        color,
        isOver && 'border-primary bg-primary/5',
      )}
    >
      <div className="flex items-center justify-between px-2 py-1.5 mb-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </h3>
        <span className="text-xs text-muted-foreground">{count}</span>
      </div>
      <div className="flex flex-col gap-1.5 flex-1">{children}</div>
    </div>
  );
}
