import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TodoApp from './pages/TodoApp';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import AuthProvider from './components/AuthProvider';
import Toaster from './components/Toaster';
import CommandPalette from './components/CommandPalette';
import { useUIStore } from './stores/uiStore';

function GlobalKeyboardListener() {
  const setCommandPalette = useUIStore((s) => s.setCommandPalette);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPalette(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setCommandPalette]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalKeyboardListener />
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/todo/:id" element={<TodoApp />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <CommandPalette />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
