import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  useTodoApp,
  useAddCollaborator,
  useUpdateCollaboratorRole,
  useRemoveCollaborator,
} from '@/hooks/useCollaborators';
import {
  useTasks,
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
} from '@/hooks/useTasks';
import { useProfile } from '@/hooks/useAuth';
import { useFilterParams } from '@/hooks/useFilterParams';
import { useQueryClient } from '@tanstack/react-query';
import { searchUserByEmail } from '@/api/collaborators';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

import FilterBar from '@/components/FilterBar';
import KanbanBoard from '@/components/KanbanBoard';
import WorkflowView from '@/components/workflow/WorkflowView';
import TaskDetailPanel from '@/components/TaskDetailPanel';
import ActivityFeed from '@/components/ActivityFeed';
import {
  useDependencies,
  useCreateDependency,
  useDeleteDependency,
} from '@/hooks/useDependencies';

import {
  ArrowLeft,
  Plus,
  Trash2,
  Users,
  LayoutList,
  Kanban,
  GitBranch,
  Loader2,
  Crown,
  UserPlus,
  Eye,
  Pencil,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function TodoApp() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: todoApp } = useTodoApp(id!);
  const { data: profile } = useProfile();
  const {
    filters,
    view,
    selectedTaskId,
    setFilter,
    clearFilters,
    setView,
    setSelectedTask,
    hasActiveFilters,
  } = useFilterParams();
  const { data: tasks, isLoading: tasksLoading } = useTasks(id!, filters);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const addCollaborator = useAddCollaborator();
  const updateRole = useUpdateCollaboratorRole();
  const removeCollaborator = useRemoveCollaborator();
  const { data: dependencies = [] } = useDependencies(id!);
  const createDep = useCreateDependency();
  const deleteDep = useDeleteDependency();

  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [collabOpen, setCollabOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);

  const isOwner = profile && todoApp && profile.uuid === todoApp.ownerId;
  const myCollab = todoApp?.collaborators?.find(
    (c: any) => c.userId === profile?.uuid,
  );
  const myRole = isOwner ? 'OWNER' : myCollab?.role || 'VIEWER';
  const canEdit = myRole === 'OWNER' || myRole === 'EDITOR';

  const selectedTask =
    selectedTaskId && tasks
      ? tasks.find((t: any) => String(t.id) === selectedTaskId)
      : null;

  // WebSocket for real-time updates
  useEffect(() => {
    if (!id) return;
    const socket = io(
      import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`,
      { transports: ['websocket'] },
    );
    socket.emit('joinTodoApp', parseInt(id, 10));

    const events = [
      'taskCreated',
      'taskUpdated',
      'taskDeleted',
      'tasksReordered',
      'collaboratorAdded',
      'collaboratorRemoved',
      'collaboratorUpdated',
    ];
    events.forEach((e) =>
      socket.on(e, () => {
        queryClient.invalidateQueries({ queryKey: ['tasks', id] });
        queryClient.invalidateQueries({ queryKey: ['todoApp', id] });
      }),
    );
    ['dependencyCreated', 'dependencyDeleted'].forEach((e) =>
      socket.on(e, () => {
        queryClient.invalidateQueries({ queryKey: ['dependencies', id] });
      }),
    );
    socket.on('activityCreated', () => {
      queryClient.invalidateQueries({ queryKey: ['activities', id] });
    });

    return () => {
      socket.disconnect();
    };
  }, [id, queryClient]);

  const handleCreateTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createTask.mutate(
      {
        todoId: id!,
        data: { title: newTitle.trim(), status: 'TODO', priority: 'MEDIUM' },
      },
      {
        onSuccess: () => {
          setNewTitle('');
          setCreateOpen(false);
        },
      },
    );
  };

  const statusColors: Record<string, string> = {
    TODO: 'text-muted-foreground',
    IN_PROGRESS: 'text-primary',
    DONE: 'text-success',
  };

  const priorityColors: Record<string, string> = {
    HIGH: 'text-destructive',
    MEDIUM: 'text-warning',
    LOW: 'text-muted-foreground',
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="truncate text-lg font-semibold">
            {todoApp?.name || 'Loading...'}
          </h1>
          {todoApp?.owner && (
            <p className="text-xs text-muted-foreground truncate">
              by {todoApp.owner.name || todoApp.owner.email}
              {!isOwner && (
                <Badge variant="secondary" className="ml-2 text-[0.6rem]">
                  {myRole}
                </Badge>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant={activityOpen ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setActivityOpen(!activityOpen)}
            title="Activity"
          >
            <Activity className="h-4 w-4" />
          </Button>
          <Button
            variant={collabOpen ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setCollabOpen(!collabOpen)}
            title="Collaborators"
          >
            <Users className="h-4 w-4" />
          </Button>
          {canEdit && (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Task</span>
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-4">
          {/* View toggle + filter */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                className={cn(
                  'px-2.5 py-1.5 text-xs font-medium transition-colors',
                  view === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted',
                )}
                onClick={() => setView('list')}
              >
                <LayoutList className="h-3.5 w-3.5" />
              </button>
              <button
                className={cn(
                  'px-2.5 py-1.5 text-xs font-medium transition-colors',
                  view === 'kanban'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted',
                )}
                onClick={() => setView('kanban')}
              >
                <Kanban className="h-3.5 w-3.5" />
              </button>
              <button
                className={cn(
                  'px-2.5 py-1.5 text-xs font-medium transition-colors',
                  view === 'workflow'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted',
                )}
                onClick={() => setView('workflow')}
              >
                <GitBranch className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1">
              <FilterBar
                filters={filters}
                setFilter={setFilter}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </div>

          {/* Tasks */}
          {tasksLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : !tasks || tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground">No tasks yet.</p>
              {canEdit && (
                <Button
                  className="mt-3 gap-1"
                  size="sm"
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add task
                </Button>
              )}
            </div>
          ) : view === 'workflow' ? (
            <WorkflowView
              tasks={tasks}
              dependencies={dependencies}
              onNodeClick={(taskId) => setSelectedTask(String(taskId))}
              onConnect={(src, tgt) =>
                createDep.mutate({
                  todoId: id!,
                  sourceTaskId: src,
                  targetTaskId: tgt,
                })
              }
              onDeleteEdge={(depId) =>
                deleteDep.mutate({ todoId: id!, depId })
              }
              canEdit={canEdit}
            />
          ) : view === 'kanban' ? (
            <KanbanBoard
              tasks={tasks}
              todoId={id!}
              canEdit={canEdit}
              onTaskClick={(t) => setSelectedTask(String(t.id))}
            />
          ) : (
            <div className="space-y-1">
              {tasks.map((task: any) => (
                <div
                  key={task.id}
                  className="group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-all hover:border-border hover:bg-card cursor-pointer"
                  onClick={() => setSelectedTask(String(task.id))}
                >
                  {canEdit ? (
                    <Checkbox
                      checked={task.status === 'DONE'}
                      onCheckedChange={(checked) => {
                        updateTask.mutate({
                          todoId: id!,
                          taskId: task.id,
                          data: { status: checked ? 'DONE' : 'TODO' },
                        });
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0"
                    />
                  ) : (
                    <div
                      className={cn(
                        'h-4 w-4 rounded-full border-2 shrink-0',
                        task.status === 'DONE'
                          ? 'bg-success border-success'
                          : 'border-muted-foreground/40',
                      )}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium truncate',
                        task.status === 'DONE' &&
                          'line-through text-muted-foreground',
                      )}
                    >
                      {task.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {task.priority && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-[0.6rem] px-1.5',
                          priorityColors[task.priority],
                        )}
                      >
                        {task.priority}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={cn('text-[0.6rem]', statusColors[task.status])}
                    >
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask.mutate({ todoId: id!, taskId: task.id });
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {!canEdit && tasks && tasks.length > 0 && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <Eye className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                You have view-only access to this app.
              </p>
            </div>
          )}
        </div>

        {/* Side panels */}
        {(collabOpen || activityOpen) && (
          <aside className="hidden md:flex w-72 flex-col border-l border-border bg-card overflow-y-auto p-4 animate-in slide-in-from-right-2 duration-150">
            {collabOpen && (
              <CollaboratorPanel
                todoApp={todoApp}
                isOwner={!!isOwner}
                todoId={id!}
                addCollaborator={addCollaborator}
                removeCollaborator={removeCollaborator}
                updateRole={updateRole}
              />
            )}
            {activityOpen && !collabOpen && <ActivityFeed todoId={id!} />}
          </aside>
        )}
      </div>

      {/* Task detail slide-over */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          todoId={id!}
          canEdit={canEdit}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {/* Create task dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogClose onClick={() => setCreateOpen(false)} />
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTask}>
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                placeholder="What needs to be done?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newTitle.trim() || createTask.isPending}
              >
                {createTask.isPending ? (
                  <Loader2 className="animate-spin mr-1 h-4 w-4" />
                ) : null}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Mobile collaborator/activity panel */}
      <Dialog
        open={
          (collabOpen || activityOpen) &&
          typeof window !== 'undefined' &&
          window.innerWidth < 768
        }
        onOpenChange={() => {
          setCollabOpen(false);
          setActivityOpen(false);
        }}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogClose
            onClick={() => {
              setCollabOpen(false);
              setActivityOpen(false);
            }}
          />
          {collabOpen && (
            <CollaboratorPanel
              todoApp={todoApp}
              isOwner={!!isOwner}
              todoId={id!}
              addCollaborator={addCollaborator}
              removeCollaborator={removeCollaborator}
              updateRole={updateRole}
            />
          )}
          {activityOpen && !collabOpen && <ActivityFeed todoId={id!} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CollaboratorPanel({
  todoApp,
  isOwner,
  todoId,
  addCollaborator,
  removeCollaborator,
  updateRole,
}: any) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'VIEWER' | 'EDITOR'>('EDITOR');
  const [error, setError] = useState('');

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await searchUserByEmail(email.trim());
      if (!user) {
        setError('User not found.');
        return;
      }
      if (user.uuid === todoApp?.ownerId) {
        setError('Cannot add the owner.');
        return;
      }
      addCollaborator.mutate(
        { todoId, userId: user.uuid, role },
        { onSuccess: () => setEmail('') },
      );
    } catch {
      setError('User not found.');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Users className="h-4 w-4" />
        Collaborators
      </h3>

      {/* Owner */}
      {todoApp?.owner && (
        <div className="flex items-center gap-2.5 rounded-lg bg-muted/30 p-2.5">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-[0.55rem] bg-primary/10 text-primary">
              {todoApp.owner.email.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">
              {todoApp.owner.name || todoApp.owner.email}
            </p>
            <p className="text-[0.65rem] text-muted-foreground truncate">
              {todoApp.owner.email}
            </p>
          </div>
          <Badge className="shrink-0 text-[0.55rem]">
            <Crown className="h-2.5 w-2.5 mr-0.5" />
            Owner
          </Badge>
        </div>
      )}

      {/* Collaborators list */}
      {todoApp?.collaborators?.map((c: any) => (
        <div key={c.userId} className="flex items-center gap-2.5 p-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-[0.55rem]">
              {c.user?.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">
              {c.user?.name || c.user?.email}
            </p>
            <p className="text-[0.65rem] text-muted-foreground truncate">
              {c.user?.email}
            </p>
          </div>
          {isOwner ? (
            <div className="flex items-center gap-1">
              <Select
                value={c.role}
                onChange={(e) =>
                  updateRole.mutate({
                    todoId,
                    userId: c.userId,
                    role: e.target.value,
                  })
                }
                className="h-6 text-[0.6rem] px-1.5 w-20"
              >
                <option value="EDITOR">Editor</option>
                <option value="VIEWER">Viewer</option>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() =>
                  removeCollaborator.mutate({ todoId, userId: c.userId })
                }
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          ) : (
            <Badge variant="outline" className="text-[0.55rem]">
              {c.role === 'EDITOR' ? (
                <>
                  <Pencil className="h-2.5 w-2.5 mr-0.5" />
                  Editor
                </>
              ) : (
                <>
                  <Eye className="h-2.5 w-2.5 mr-0.5" />
                  Viewer
                </>
              )}
            </Badge>
          )}
        </div>
      ))}

      {/* Add collaborator form (owner only) */}
      {isOwner && (
        <form
          onSubmit={handleAdd}
          className="space-y-2 border-t border-border pt-3"
        >
          <p className="text-xs font-medium flex items-center gap-1">
            <UserPlus className="h-3 w-3" />
            Add collaborator
          </p>
          <Input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-8 text-xs"
          />
          <div className="flex gap-2">
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="h-8 text-xs flex-1"
            >
              <option value="EDITOR">Editor</option>
              <option value="VIEWER">Viewer</option>
            </Select>
            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs"
              disabled={!email.trim() || addCollaborator.isPending}
            >
              Add
            </Button>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </form>
      )}
    </div>
  );
}
