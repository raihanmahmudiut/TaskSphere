import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Dashboard from '../Dashboard';

vi.mock('../../hooks/useTodo', () => ({
  useTodoApps: () => ({
    data: [
      {
        id: 1,
        name: 'Test App',
        ownerId: 'user-1',
        tasks: [
          { id: 1, status: 'TODO' },
          { id: 2, status: 'DONE' },
        ],
        collaborators: [],
      },
      {
        id: 2,
        name: 'Shared App',
        ownerId: 'other-user',
        tasks: [],
        collaborators: [{ userId: 'user-1', role: 'EDITOR' }],
      },
    ],
    isLoading: false,
  }),
  useCreateTodoApp: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('../../hooks/useAuth', () => ({
  useProfile: () => ({
    data: { uuid: 'user-1', email: 'test@test.com', name: 'Test User' },
  }),
  useLogout: () => vi.fn(),
}));

describe('Dashboard', () => {
  it('renders todo app cards', () => {
    render(<Dashboard />);

    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('Shared App')).toBeInTheDocument();
  });

  it('shows correct task counts', () => {
    render(<Dashboard />);

    expect(screen.getByText(/2 tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/0 tasks/i)).toBeInTheDocument();
  });

  it('shows owner/shared badges', () => {
    render(<Dashboard />);

    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Shared')).toBeInTheDocument();
  });

  it('renders the new app button', () => {
    render(<Dashboard />);

    expect(
      screen.getByRole('button', { name: /new app/i }),
    ).toBeInTheDocument();
  });
});
