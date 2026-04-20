import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string }> = {
  TODO: { label: 'Todo', color: 'bg-muted text-muted-foreground' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-primary/20 text-primary' },
  DONE: { label: 'Done', color: 'bg-green-500/20 text-green-600' },
};

const priorityConfig: Record<string, { label: string; dot: string }> = {
  LOW: { label: 'Low', dot: 'bg-blue-400' },
  MEDIUM: { label: 'Med', dot: 'bg-yellow-400' },
  HIGH: { label: 'High', dot: 'bg-red-500' },
};

export type TaskNodeData = {
  label: string;
  status: string;
  priority: string | null;
  taskId: number;
  isBlocked?: boolean;
  blockedByTitles?: string[];
};

function TaskNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as TaskNodeData;
  const status = statusConfig[nodeData.status] || statusConfig.TODO;
  const priority = nodeData.priority
    ? priorityConfig[nodeData.priority]
    : null;

  const borderColor = nodeData.isBlocked
    ? 'border-destructive/40 border-dashed'
    : nodeData.status === 'DONE'
      ? 'border-green-500/40'
      : nodeData.status === 'IN_PROGRESS'
        ? 'border-primary/40'
        : 'border-border';

  return (
    <>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2" />
      <div
        className={cn(
          'rounded-lg border-2 bg-card px-4 py-3 shadow-sm min-w-[160px] max-w-[220px] group relative',
          borderColor,
          nodeData.isBlocked && 'opacity-75',
        )}
        title={
          nodeData.isBlocked
            ? `Blocked by: ${nodeData.blockedByTitles?.join(', ')}`
            : undefined
        }
      >
        <div className="flex items-center gap-2 mb-1.5">
          {nodeData.isBlocked && (
            <Lock className="w-3 h-3 text-destructive shrink-0" />
          )}
          {priority && !nodeData.isBlocked && (
            <span className={cn('w-2 h-2 rounded-full shrink-0', priority.dot)} />
          )}
          <span className="text-sm font-medium truncate">{nodeData.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', status.color)}>
            {status.label}
          </Badge>
          {nodeData.isBlocked && (
            <span className="text-[9px] text-destructive">Blocked</span>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2" />
    </>
  );
}

export default memo(TaskNodeComponent);
