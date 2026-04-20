import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodoApps, useCreateTodoApp } from '../hooks/useTodo';
import { useProfile, useLogout } from '../hooks/useAuth';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  LogOut,
  LayoutDashboard,
  Users,
  Menu,
  X,
  ListTodo,
  Loader2,
  Settings,
  Command,
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: todoApps, isLoading } = useTodoApps();
  const { data: profile } = useProfile();
  const createTodoApp = useCreateTodoApp();
  const handleLogout = useLogout();
  const { sidebarOpen, setSidebar, setCommandPalette } = useUIStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');

  const handleCreateApp = (e: FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;
    createTodoApp.mutate(
      { name: newAppName.trim() },
      {
        onSuccess: () => {
          setNewAppName('');
          setCreateOpen(false);
        },
      },
    );
  };

  const initials = profile?.email
    ? profile.email.substring(0, 2).toUpperCase()
    : '??';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar p-4 transition-transform duration-200 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-bold tracking-tight">TaskSphere</h1>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebar(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <Button
            variant="secondary"
            className="justify-start gap-2"
            onClick={() => setSidebar(false)}
          >
            <LayoutDashboard className="h-4 w-4" />
            My Todos
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-2 text-muted-foreground"
            onClick={() => {
              setCommandPalette(true);
              setSidebar(false);
            }}
          >
            <Command className="h-4 w-4" />
            Search
            <kbd className="ml-auto text-[0.6rem] border border-border rounded px-1 text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
        </nav>

        <div className="border-t border-border pt-4 mt-4 space-y-1">
          <div className="flex items-center gap-3 mb-2 px-1">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-sm text-muted-foreground">
              {profile?.email}
            </span>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-lg md:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebar(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">My Todos</h2>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Todo</span>
          </Button>
        </header>

        <div className="p-4 md:p-6">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-border/50">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                    <Skeleton className="h-1.5 w-full rounded-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : todoApps?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <ListTodo className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No todos yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first app to get started.
              </p>
              <Button
                onClick={() => setCreateOpen(true)}
                className="mt-4 gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Create Todo
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {todoApps?.map((app: any) => {
                const isMine = profile && profile.uuid === app.ownerId;
                const taskCount = app.tasks?.length || 0;
                const doneCount =
                  app.tasks?.filter((t: any) => t.status === 'DONE').length ||
                  0;
                return (
                  <Card
                    key={app.id}
                    className="group cursor-pointer border-border/50 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                    onClick={() => navigate(`/todo/${app.id}`)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold group-hover:text-primary transition-colors">
                            {app.name}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                            {taskCount > 0 && (
                              <span className="ml-1 text-success">
                                · {doneCount} done
                              </span>
                            )}
                          </p>
                        </div>
                        <Badge
                          variant={isMine ? 'default' : 'secondary'}
                          className="shrink-0 text-[0.65rem]"
                        >
                          {isMine ? 'Owner' : 'Shared'}
                        </Badge>
                      </div>
                      {taskCount > 0 && (
                        <div className="mt-4">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{
                                width: `${(doneCount / taskCount) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {app.collaborators?.length > 0 && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {app.collaborators.length + 1} people
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogClose onClick={() => setCreateOpen(false)} />
          <DialogHeader>
            <DialogTitle>Create new todo</DialogTitle>
            <DialogDescription>
              Give your todo a name to get started.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateApp}>
            <div className="space-y-2">
              <Label htmlFor="app-name">Name</Label>
              <Input
                id="app-name"
                placeholder="e.g. Weekly groceries, Sprint tasks..."
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateOpen(false);
                  setNewAppName('');
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newAppName.trim() || createTodoApp.isPending}
              >
                {createTodoApp.isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
