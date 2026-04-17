import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function GuestRoute() {
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
