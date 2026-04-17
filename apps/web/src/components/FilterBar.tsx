import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filters: {
    status?: string;
    priority?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
  setFilter: (key: string, value: string | null) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const statuses = ['TODO', 'IN_PROGRESS', 'DONE'] as const;
const priorities = ['LOW', 'MEDIUM', 'HIGH'] as const;

const statusLabels: Record<string, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};
const priorityColors: Record<string, string> = {
  LOW: 'text-muted-foreground',
  MEDIUM: 'text-warning',
  HIGH: 'text-destructive',
};

export default function FilterBar({
  filters,
  setFilter,
  clearFilters,
  hasActiveFilters,
}: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter('search', searchInput || null);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setFilter]);

  const toggleInList = (key: string, value: string) => {
    const current =
      filters[key as keyof typeof filters]?.split(',').filter(Boolean) || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilter(key, next.length > 0 ? next.join(',') : null);
  };

  const activeStatuses = filters.status?.split(',').filter(Boolean) || [];
  const activePriorities = filters.priority?.split(',').filter(Boolean) || [];

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Button
          variant={expanded ? 'secondary' : 'outline'}
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => setExpanded(!expanded)}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {hasActiveFilters && (
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1 text-muted-foreground shrink-0"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {expanded && (
        <div className="flex flex-wrap gap-4 rounded-lg border border-border bg-card p-3 animate-in slide-in-from-top-1 duration-150">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Status
            </p>
            <div className="flex flex-wrap gap-1">
              {statuses.map((s) => (
                <Badge
                  key={s}
                  variant={activeStatuses.includes(s) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer text-[0.65rem]',
                    activeStatuses.includes(s) && 'bg-primary',
                  )}
                  onClick={() => toggleInList('status', s)}
                >
                  {statusLabels[s]}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Priority
            </p>
            <div className="flex flex-wrap gap-1">
              {priorities.map((p) => (
                <Badge
                  key={p}
                  variant={activePriorities.includes(p) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer text-[0.65rem]',
                    !activePriorities.includes(p) && priorityColors[p],
                  )}
                  onClick={() => toggleInList('priority', p)}
                >
                  {p}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
