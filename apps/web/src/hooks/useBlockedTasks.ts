import { useMemo } from 'react';
import type { TaskDependency } from '@/api/dependencies';

export interface BlockedInfo {
  isBlocked: boolean;
  blockedByTitles: string[];
}

export function useBlockedTasks(
  tasks: any[],
  dependencies: TaskDependency[],
): Map<number, BlockedInfo> {
  return useMemo(() => {
    const taskMap = new Map<number, any>();
    tasks.forEach((t) => taskMap.set(t.id, t));

    const blocked = new Map<number, BlockedInfo>();

    for (const task of tasks) {
      const prereqs = dependencies.filter((d) => d.targetTaskId === task.id);
      const incompletePrerequs = prereqs
        .map((d) => taskMap.get(d.sourceTaskId))
        .filter((t) => t && t.status !== 'DONE');

      blocked.set(task.id, {
        isBlocked: incompletePrerequs.length > 0,
        blockedByTitles: incompletePrerequs.map((t) => t.title),
      });
    }

    return blocked;
  }, [tasks, dependencies]);
}
