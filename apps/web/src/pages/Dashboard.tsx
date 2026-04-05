import { useNavigate } from 'react-router-dom';
import { useTodoApps, useCreateTodoApp } from '../hooks/useTodo';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: todoApps, isLoading } = useTodoApps();
  const createTodoApp = useCreateTodoApp();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCreateApp = () => {
    const title = prompt('Enter a title for your new Todo App:');
    if (title) {
      createTodoApp.mutate({ title, description: 'A new awesome list' });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '280px', borderTop: 'none', borderBottom: 'none', borderLeft: 'none', borderRadius: 0, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>TaskSphere</h2>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button className="btn" style={{ justifyContent: 'flex-start', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}>My Todos</button>
          <button className="btn" style={{ justifyContent: 'flex-start', background: 'transparent', color: 'var(--text-muted)' }}>Shared with me</button>
        </nav>
        <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)' }}>Logout</button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>My Todos</h1>
          <button className="btn btn-primary" onClick={handleCreateApp}>+ New App</button>
        </header>

        {isLoading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading your apps...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {todoApps?.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>You haven't created any Todo apps yet.</p>
            ) : (
              todoApps?.map((app: any) => (
                <div 
                  key={app.id} 
                  className="glass-panel" 
                  onClick={() => navigate(`/todo/${app.id}`)}
                  style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform var(--transition-fast)' }} 
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} 
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{app.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{app.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '1rem' }}>Active</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
