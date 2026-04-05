import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';

export default function TodoApp() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: tasks, isLoading } = useTasks(id || '');
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const token = localStorage.getItem('token');
    const socket = io('http://localhost:3000', {
      auth: { token },
    });

    socket.on('connect', () => {
      socket.emit('joinRoom', `todo-app-${id}`);
    });

    const refreshTasks = () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
    };

    socket.on('taskCreated', refreshTasks);
    socket.on('taskUpdated', refreshTasks);
    socket.on('taskDeleted', refreshTasks);

    return () => {
      socket.emit('leaveRoom', `todo-app-${id}`);
      socket.disconnect();
    };
  }, [id, queryClient]);

  const handleCreateTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !id) return;
    createTask.mutate({ todoId: id, data: { title: newTaskTitle, status: 'TODO', priority: 'MEDIUM' } });
    setNewTaskTitle('');
  };

  const handleToggleStatus = (task: any) => {
    if (!id) return;
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    updateTask.mutate({ todoId: id, taskId: task.id, data: { status: newStatus } });
  };

  const handleDeleteTask = (taskId: number) => {
    if (!id) return;
    deleteTask.mutate({ todoId: id, taskId });
  };

  return (
    <div className="app-container" style={{ padding: '2rem', alignItems: 'stretch' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn" onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>&larr; Back</button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>App Tasks</h1>
        </div>
      </header>

      <div className="glass-panel" style={{ padding: '2rem', flex: 1 }}>
        <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="form-input" 
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={createTask.isPending}>Add Task</button>
        </form>

        {isLoading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading tasks...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks?.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No tasks yet.</p>
            ) : (
              tasks?.map((task: any) => (
                <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input 
                      type="checkbox" 
                      checked={task.status === 'DONE'} 
                      onChange={() => handleToggleStatus(task)}
                      style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                    />
                    <span style={{ textDecoration: task.status === 'DONE' ? 'line-through' : 'none', color: task.status === 'DONE' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {task.title}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7 }}>Delete</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
