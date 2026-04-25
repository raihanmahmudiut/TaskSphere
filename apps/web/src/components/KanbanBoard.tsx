import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { useUpdateTask, useReorderTasks } from '@/hooks/useTasks';
import { useUIStore } from '@/stores/uiStore';
import type { BlockedInfo } from '@/hooks/useBlockedTasks';

interface KanbanBoardProps {
  tasks: any[];
  todoId: string;
  canEdit: boolean;
  onTaskClick: (task: any) => void;
  blockedMap: Map<number, BlockedInfo>;
}

const columns = [
  { id: 'TODO', label: 'To Do', color: 'border-muted-foreground/30' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-primary/40' },
  { id: 'DONE', label: 'Done', color: 'border-success/40' },
] as const;

export default function KanbanBoard({
  tasks,
  todoId,
  canEdit,
  onTaskClick,
  blockedMap,
}: KanbanBoardProps) {
  const [localTasks, setLocalTasks] = useState<any[]>(tasks);
  const [activeId, setActiveId] = useState<number | null>(null);
  const updateTask = useUpdateTask();
  const reorderTasks = useReorderTasks();
  const addToast = useUIStore((s) => s.addToast);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // ms before drag activates — distinguishes tap from drag
        tolerance: 5, // px of movement allowed during delay
      },
    }),
  );

  if (activeId === null) {
    const idsChanged =
      JSON.stringify(tasks.map((t) => t.id)) !==
      JSON.stringify(localTasks.map((t) => t.id));
    const statusChanged = tasks.some(
      (t, i) => localTasks[i] && t.status !== localTasks[i].status,
    );
    if (idsChanged || statusChanged) {
      setLocalTasks(tasks);
    }
  }

  const getTasksByStatus = (status: string) =>
    localTasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.position - b.position);

  const activeTask = localTasks.find((t) => t.id === activeId);

  const handleDragStart = (event: DragStartEvent) => {
    if (!canEdit) return;
    setActiveId(event.active.id as number);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !canEdit) return;

    const activeTask = localTasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overColumn = columns.find((c) => c.id === over.id);
    if (overColumn && activeTask.status !== overColumn.id) {
      setLocalTasks((prev) =>
        prev.map((t) =>
          t.id === active.id ? { ...t, status: overColumn.id } : t,
        ),
      );
      return;
    }

    const overTask = localTasks.find((t) => t.id === over.id);
    if (overTask && activeTask.status !== overTask.status) {
      setLocalTasks((prev) =>
        prev.map((t) =>
          t.id === active.id ? { ...t, status: overTask.status } : t,
        ),
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    if (!canEdit) return;

    const { active } = event;
    const movedTask = localTasks.find((t) => t.id === active.id);
    const originalTask = tasks.find((t) => t.id === active.id);
    if (!movedTask || !originalTask) return;

    if (movedTask.status !== originalTask.status) {
      const blocked = blockedMap.get(movedTask.id);
      if (movedTask.status === 'DONE' && blocked?.isBlocked) {
        addToast({
          type: 'error',
          message: `Cannot mark as done. Blocked by: ${blocked.blockedByTitles.join(', ')}`,
        });
        setLocalTasks(tasks);
        return;
      }

      updateTask.mutate({
        todoId,
        taskId: movedTask.id,
        data: { status: movedTask.status },
      });
    }

    const sameStatusTasks = localTasks.filter(
      (t) => t.status === movedTask.status,
    );
    const reorderPayload = sameStatusTasks.map((t, i) => ({
      id: t.id,
      position: i,
    }));
    reorderTasks.mutate({ todoId, tasks: reorderPayload });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      modifiers={[restrictToWindowEdges]}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {columns.map((col) => {
          const colTasks = getTasksByStatus(col.id);
          return (
            <KanbanColumn
              key={col.id}
              id={col.id}
              label={col.label}
              color={col.color}
              count={colTasks.length}
            >
              <SortableContext
                items={colTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {colTasks.map((task) => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task)}
                    blocked={blockedMap.get(task.id)}
                  />
                ))}
              </SortableContext>
            </KanbanColumn>
          );
        })}
      </div>
      <DragOverlay>
        {activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
