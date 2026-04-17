import { useState } from 'react';
import { useActivities } from '@/hooks/useTasks';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Activity, Loader2, ChevronDown } from 'lucide-react';

interface ActivityFeedProps {
  todoId: string;
}

const actionLabels: Record<string, string> = {
  'task.created': 'created task',
  'task.updated': 'updated task',
  'task.completed': 'completed task',
  'task.deleted': 'deleted task',
  'collaborator.added': 'added collaborator',
  'collaborator.removed': 'removed collaborator',
  'collaborator.role_changed': 'changed role for',
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ActivityFeed({ todoId }: ActivityFeedProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useActivities(todoId, page);

  const items = data?.items || [];

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Activity</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading...
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          No activity yet.
        </p>
      ) : (
        <div className="space-y-0">
          {items.map((item: any) => {
            const meta = item.metadata ? JSON.parse(item.metadata) : {};
            const initials =
              item.user?.email?.substring(0, 2).toUpperCase() || '??';
            const userName = item.user?.name || item.user?.email || 'Someone';
            const label = actionLabels[item.action] || item.action;

            return (
              <div
                key={item.id}
                className="flex items-start gap-2.5 py-2 border-l-2 border-border pl-3 ml-1.5"
              >
                <Avatar className="h-5 w-5 mt-0.5">
                  <AvatarFallback className="text-[0.5rem]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed">
                    <span className="font-medium">{userName}</span> {label}
                    {meta.title && (
                      <span className="font-medium"> "{meta.title}"</span>
                    )}
                  </p>
                  <p className="text-[0.65rem] text-muted-foreground">
                    {timeAgo(item.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          {items.length >= 20 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 gap-1 text-muted-foreground"
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronDown className="h-3 w-3" />
              Load more
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
