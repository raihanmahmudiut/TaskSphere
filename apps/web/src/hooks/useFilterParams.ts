import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
import type { TaskFilters } from '../api/tasks';

export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: TaskFilters = useMemo(
    () => ({
      status: searchParams.get('status') || undefined,
      priority: searchParams.get('priority') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
    }),
    [searchParams],
  );

  const view = searchParams.get('view') || 'list';
  const selectedTaskId = searchParams.get('task') || null;

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams();
      const v = prev.get('view');
      if (v) next.set('view', v);
      return next;
    });
  }, [setSearchParams]);

  const setView = useCallback((v: string) => setFilter('view', v), [setFilter]);
  const setSelectedTask = useCallback(
    (id: string | null) => setFilter('task', id),
    [setFilter],
  );

  const hasActiveFilters = !!(
    filters.status ||
    filters.priority ||
    filters.search
  );

  return {
    filters,
    view,
    selectedTaskId,
    setFilter,
    clearFilters,
    setView,
    setSelectedTask,
    hasActiveFilters,
  };
}
