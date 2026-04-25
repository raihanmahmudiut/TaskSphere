import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import FilterBar from '../FilterBar';

describe('FilterBar', () => {
  const defaultProps = {
    filters: {},
    setFilter: vi.fn(),
    clearFilters: vi.fn(),
    hasActiveFilters: false,
  };

  it('renders search input', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('calls setFilter after debounce when typing in search', async () => {
    const setFilter = vi.fn();
    const user = userEvent.setup();
    render(<FilterBar {...defaultProps} setFilter={setFilter} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'test');

    await waitFor(
      () => {
        expect(setFilter).toHaveBeenCalledWith('search', 'test');
      },
      { timeout: 1000 },
    );
  });

  it('renders the Filters toggle button', () => {
    render(<FilterBar {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /filters/i }),
    ).toBeInTheDocument();
  });

  it('expands filter badges when Filters button is clicked', async () => {
    const user = userEvent.setup();
    render(<FilterBar {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: /filters/i }));

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('shows Clear button when hasActiveFilters is true', () => {
    render(<FilterBar {...defaultProps} hasActiveFilters={true} />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('calls clearFilters when Clear is clicked', async () => {
    const clearFilters = vi.fn();
    const user = userEvent.setup();
    render(
      <FilterBar
        {...defaultProps}
        hasActiveFilters
        clearFilters={clearFilters}
      />,
    );

    await user.click(screen.getByRole('button', { name: /clear/i }));
    expect(clearFilters).toHaveBeenCalledOnce();
  });
});
