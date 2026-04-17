import { create } from 'zustand';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

type Theme = 'dark' | 'light';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  toasts: Toast[];
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setSidebar: (open: boolean) => void;
  setCommandPalette: (open: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem('theme') as Theme) || 'dark';
};

let toastCounter = 0;

export const useUIStore = create<UIState>((set, get) => ({
  theme: getStoredTheme(),
  sidebarOpen: false,
  commandPaletteOpen: false,
  toasts: [],

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    set({ theme: next });
  },

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },

  setSidebar: (open) => set({ sidebarOpen: open }),
  setCommandPalette: (open) => set({ commandPaletteOpen: open }),

  addToast: (toast) => {
    const id = `toast-${++toastCounter}`;
    const newToast = { ...toast, id };
    set((s) => ({ toasts: [...s.toasts, newToast] }));
    const duration = toast.duration ?? 4000;
    setTimeout(() => get().dismissToast(id), duration);
  },

  dismissToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));
