import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useTodoApps } from '@/hooks/useTodo';
import { Input } from '@/components/ui/input';
import {
  Search,
  LayoutDashboard,
  Settings,
  LogOut,
  Sun,
  Moon,
  ListTodo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  section: string;
}

export default function CommandPalette() {
  const open = useUIStore((s) => s.commandPaletteOpen);
  const setOpen = useUIStore((s) => s.setCommandPalette);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: todoApps } = useTodoApps();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = useMemo(() => {
    const actions: CommandItem[] = [
      {
        id: 'dashboard',
        label: 'Go to Dashboard',
        icon: LayoutDashboard,
        action: () => {
          navigate('/dashboard');
          setOpen(false);
        },
        section: 'Navigation',
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        action: () => {
          navigate('/settings');
          setOpen(false);
        },
        section: 'Navigation',
      },
      {
        id: 'theme',
        label:
          theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        icon: theme === 'dark' ? Sun : Moon,
        action: () => {
          toggleTheme();
          setOpen(false);
        },
        section: 'Actions',
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: LogOut,
        action: () => {
          logout();
          navigate('/login');
          setOpen(false);
        },
        section: 'Actions',
      },
    ];

    if (todoApps) {
      todoApps.forEach((app: any) => {
        actions.push({
          id: `app-${app.id}`,
          label: app.name,
          icon: ListTodo,
          action: () => {
            navigate(`/todo/${app.id}`);
            setOpen(false);
          },
          section: 'Todo Apps',
        });
      });
    }

    return actions;
  }, [todoApps, theme, navigate, setOpen, toggleTheme, logout]);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && filtered[activeIndex]) {
        filtered[activeIndex].action();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, activeIndex, setOpen]);

  if (!open || !isAuthenticated) return null;

  let currentSection = '';

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh]">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative z-50 w-full max-w-lg mx-4 rounded-xl border border-border bg-card shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="border-none shadow-none focus-visible:ring-0 h-11"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 text-[0.6rem] text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </p>
          ) : (
            filtered.map((item, index) => {
              const showSection = item.section !== currentSection;
              currentSection = item.section;
              const Icon = item.icon;
              return (
                <div key={item.id}>
                  {showSection && (
                    <p className="px-2 pt-2 pb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.section}
                    </p>
                  )}
                  <button
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors',
                      index === activeIndex
                        ? 'bg-accent text-accent-foreground'
                        : 'text-foreground hover:bg-accent/50',
                    )}
                    onClick={item.action}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </button>
                </div>
              );
            })
          )}
        </div>
        <div className="border-t border-border px-3 py-2 flex items-center gap-3 text-[0.6rem] text-muted-foreground">
          <span>
            <kbd className="rounded border border-border bg-muted px-1">↑↓</kbd>{' '}
            Navigate
          </span>
          <span>
            <kbd className="rounded border border-border bg-muted px-1">↵</kbd>{' '}
            Select
          </span>
          <span>
            <kbd className="rounded border border-border bg-muted px-1">
              esc
            </kbd>{' '}
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
