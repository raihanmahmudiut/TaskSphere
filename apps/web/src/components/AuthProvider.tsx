import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useProfile } from '@/hooks/useAuth';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { hydrate, isHydrated, isAuthenticated } = useAuthStore();
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <>{isHydrated ? children : null}</>;
}

export function ProfileLoader({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  useProfile();
  return <>{children}</>;
}
