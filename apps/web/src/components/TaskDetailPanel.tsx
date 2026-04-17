import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { X, Trash2, Calendar, Flag, AlignLeft } from 'lucide-react';
import { useUpdateTask, useDeleteTask } from '@/hooks/useTasks';

interface TaskDetailPanelProps {
  task: any;
  todoId: string;
  canEdit: boolean;
  onClose: () => void;
}

const statusOptions = [
  { value: 'TODO', label: 'To Do', color: 'bg-muted text-muted-foreground' },
  {
    value: 'IN_PROGRESS',
    label: 'In Progress',
    color: 'bg-primary/15 text-primary',
  },
  { value: 'DONE', label: 'Done', color: 'bg-success/15 text-success' },
];

const priorityOptions = [
  { value: '', label: 'None' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

export default function TaskDetailPanel({
  task,
  todoId,
  canEdit,
  onClose,
}: TaskDetailPanelProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
  }, [task]);

  const save = useCallback(
    (data: Record<string, any>) => {
      if (!canEdit) return;
      updateTask.mutate({ todoId, taskId: task.id, data });
    },
    [canEdit, todoId, task.id, updateTask],
  );

  const handleTitleBlur = () => {
    if (title.trim() && title !== task.title) save({ title: title.trim() });
  };

  const handleDescBlur = () => {
    if (description !== (task.description || '')) save({ description });
  };

  const handleDelete = () => {
    if (confirm('Delete this task?')) {
      deleteTask.mutate({ todoId, taskId: task.id });
      onClose();
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-md overflow-y-auto border-l border-border bg-card shadow-2xl animate-in slide-in-from-right-4 duration-200">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Task Details
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-5">
          {/* Title */}
          <div>
            {canEdit ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                className="text-lg font-semibold border-none px-0 h-auto focus-visible:ring-0 shadow-none"
              />
            ) : (
              <h2 className="text-lg font-semibold">{task.title}</h2>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              Status
            </Label>
            {canEdit ? (
              <div className="flex flex-wrap gap-1.5">
                {statusOptions.map((opt) => (
                  <Badge
                    key={opt.value}
                    className={`cursor-pointer text-xs ${task.status === opt.value ? opt.color : 'bg-transparent text-muted-foreground border-border'}`}
                    variant={task.status === opt.value ? 'default' : 'outline'}
                    onClick={() => save({ status: opt.value })}
                  >
                    {opt.label}
                  </Badge>
                ))}
              </div>
            ) : (
              <Badge
                className={
                  statusOptions.find((o) => o.value === task.status)?.color
                }
              >
                {statusOptions.find((o) => o.value === task.status)?.label}
              </Badge>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Flag className="h-3 w-3" /> Priority
            </Label>
            {canEdit ? (
              <Select
                value={task.priority || ''}
                onChange={(e) => save({ priority: e.target.value || null })}
                className="w-full"
              >
                {priorityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            ) : (
              <span className="text-sm">{task.priority || 'None'}</span>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3 w-3" /> Due Date
            </Label>
            {canEdit ? (
              <Input
                type="date"
                value={
                  task.dueDate
                    ? new Date(task.dueDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) => save({ dueDate: e.target.value || null })}
              />
            ) : (
              <span className="text-sm">
                {formatDate(task.dueDate) || 'Not set'}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <AlignLeft className="h-3 w-3" /> Description
            </Label>
            {canEdit ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescBlur}
                placeholder="Add a description..."
                rows={4}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            ) : (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {task.description || 'No description.'}
              </p>
            )}
          </div>

          {/* Meta */}
          <div className="rounded-lg bg-muted/30 p-3 space-y-1 text-xs text-muted-foreground">
            <p>Created: {formatDate(task.createdAt)}</p>
            <p>Updated: {formatDate(task.updatedAt)}</p>
          </div>

          {/* Delete */}
          {canEdit && (
            <Button
              variant="destructive"
              size="sm"
              className="w-full gap-1.5"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete task
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
