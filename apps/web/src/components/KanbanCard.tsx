import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import { Calendar, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlockedInfo } from '@/hooks/useBlockedTasks';

interface KanbanCardProps {
  task: any;
  onClick?: () => void;
  isOverlay?: boolean;
  blocked?: BlockedInfo;
}

const priorityColors: Record<string, string> = {
  HIGH: 'text-destructive bg-destructive/10',
  MEDIUM: 'text-warning bg-warning/10',
  LOW: 'text-muted-foreground bg-muted',
};

export default function KanbanCard({
  task,
  onClick,
  isOverlay,
  blocked,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={isOverlay ? undefined : onClick}
      className={cn(
        'rounded-lg border border-border bg-card p-3 cursor-pointer hover:border-primary/30 transition-all text-sm',
        isDragging && 'opacity-30',
        isOverlay && 'shadow-xl border-primary/50 rotate-2',
        blocked?.isBlocked && 'border-dashed border-destructive/30 opacity-75',
      )}
    >
      <div className="flex items-start gap-2">
        {blocked?.isBlocked && (
          <Lock className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
        )}
        <p
          className={cn(
            'font-medium leading-snug flex-1',
            task.status === 'DONE' && 'line-through text-muted-foreground',
          )}
        >
          {task.title}
        </p>
      </div>
      {blocked?.isBlocked && (
        <p className="text-[10px] text-destructive mt-1 truncate">
          Blocked by: {blocked.blockedByTitles.join(', ')}
        </p>
      )}
      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
        {task.priority && (
          <Badge
            variant="secondary"
            className={cn(
              'text-[0.6rem] px-1.5 py-0',
              priorityColors[task.priority],
            )}
          >
            {task.priority}
          </Badge>
        )}
        {task.dueDate && (
          <span className="flex items-center gap-1 text-[0.65rem] text-muted-foreground">
            <Calendar className="h-2.5 w-2.5" />
            {new Date(task.dueDate).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
      </div>
    </div>
  );
}
