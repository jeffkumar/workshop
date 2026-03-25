import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UpdateCard } from './UpdateCard'
import { Update, supabase } from '../lib/supabase'

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

const mockUseAuth = vi.fn()

vi.mock('../context/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

vi.mock('./UpdateForm', () => ({
  UpdateForm: () => <div data-testid="update-form">UpdateForm</div>,
}))

const mockUser = { id: 'user-1' }

function makeUpdate(overrides: Partial<Update> = {}): Update {
  return {
    id: 'update-1',
    user_id: 'user-1',
    content: 'Test update content',
    created_at: '2025-01-15T12:00:00Z',
    updated_at: '2025-01-15T12:00:00Z',
    profiles: {
      id: 'user-1',
      username: 'testuser',
      full_name: 'Test User',
      avatar_url: null,
      created_at: '2025-01-01T00:00:00Z',
    },
    likes: [],
    ...overrides,
  }
}

function setupSupabaseMock() {
  const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null })
  const mockDeleteEq2 = vi.fn().mockResolvedValue({ data: null, error: null })
  const mockDeleteEq1 = vi.fn().mockReturnValue({ eq: mockDeleteEq2 })
  const mockDeleteFn = vi.fn().mockReturnValue({ eq: mockDeleteEq1 })

  vi.mocked(supabase.from).mockReturnValue({
    delete: mockDeleteFn,
    insert: mockInsert,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)

  return { mockInsert, mockDeleteFn, mockDeleteEq1, mockDeleteEq2 }
}

describe('UpdateCard', () => {
  const onDeleted = vi.fn()
  const onUpdated = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({ user: mockUser })
    setupSupabaseMock()
  })

  it('renders update content and author', () => {
    render(
      <UpdateCard update={makeUpdate()} onDeleted={onDeleted} onUpdated={onUpdated} />
    )
    expect(screen.getByText('Test update content')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('shows like count of 0 when no likes', () => {
    render(
      <UpdateCard update={makeUpdate()} onDeleted={onDeleted} onUpdated={onUpdated} />
    )
    expect(screen.getByTestId('like-count')).toHaveTextContent('0')
  })

  it('shows correct like count', () => {
    const update = makeUpdate({
      likes: [
        { update_id: 'update-1', user_id: 'user-2', created_at: '2025-01-15T12:00:00Z' },
        { update_id: 'update-1', user_id: 'user-3', created_at: '2025-01-15T12:01:00Z' },
      ],
    })
    render(
      <UpdateCard update={update} onDeleted={onDeleted} onUpdated={onUpdated} />
    )
    expect(screen.getByTestId('like-count')).toHaveTextContent('2')
  })

  it('shows unfilled heart when user has not liked', () => {
    render(
      <UpdateCard update={makeUpdate()} onDeleted={onDeleted} onUpdated={onUpdated} />
    )
    const likeButton = screen.getByRole('button', { name: /like this update/i })
    expect(likeButton).toHaveTextContent('♡')
    expect(likeButton).not.toHaveClass('liked')
  })

  it('shows filled heart when user has liked', () => {
    const update = makeUpdate({
      likes: [
        { update_id: 'update-1', user_id: 'user-1', created_at: '2025-01-15T12:00:00Z' },
      ],
    })
    render(
      <UpdateCard update={update} onDeleted={onDeleted} onUpdated={onUpdated} />
    )
    const likeButton = screen.getByRole('button', { name: /unlike this update/i })
    expect(likeButton).toHaveTextContent('♥')
    expect(likeButton).toHaveClass('liked')
  })

  it('calls supabase insert when liking', async () => {
    const { mockInsert } = setupSupabaseMock()
    const user = userEvent.setup()
    render(
      <UpdateCard update={makeUpdate()} onDeleted={onDeleted} onUpdated={onUpdated} />
    )
    const likeButton = screen.getByRole('button', { name: /like this update/i })
    await user.click(likeButton)

    expect(supabase.from).toHaveBeenCalledWith('likes')
    expect(mockInsert).toHaveBeenCalledWith({ update_id: 'update-1', user_id: 'user-1' })
    expect(onUpdated).toHaveBeenCalled()
  })

  it('calls supabase delete when unliking', async () => {
    const { mockDeleteFn } = setupSupabaseMock()
    const user = userEvent.setup()
    const update = makeUpdate({
      likes: [
        { update_id: 'update-1', user_id: 'user-1', created_at: '2025-01-15T12:00:00Z' },
      ],
    })
    render(
      <UpdateCard update={update} onDeleted={onDeleted} onUpdated={onUpdated} />
    )
    const likeButton = screen.getByRole('button', { name: /unlike this update/i })
    await user.click(likeButton)

    expect(supabase.from).toHaveBeenCalledWith('likes')
    expect(mockDeleteFn).toHaveBeenCalled()
    expect(onUpdated).toHaveBeenCalled()
  })

  it('disables like button when user is not logged in', () => {
    mockUseAuth.mockReturnValue({ user: null })
    render(
      <UpdateCard update={makeUpdate()} onDeleted={onDeleted} onUpdated={onUpdated} />
    )
    const likeButton = screen.getByRole('button', { name: /like this update/i })
    expect(likeButton).toBeDisabled()
  })

  it('handles update with undefined likes gracefully', () => {
    const update = makeUpdate({ likes: undefined })
    render(
      <UpdateCard update={update} onDeleted={onDeleted} onUpdated={onUpdated} />
    )
    expect(screen.getByTestId('like-count')).toHaveTextContent('0')
  })

  it('shows edit and delete buttons for owner', () => {
    render(
      <UpdateCard update={makeUpdate()} onDeleted={onDeleted} onUpdated={onUpdated} />
    )
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('hides edit and delete buttons for non-owner', () => {
    mockUseAuth.mockReturnValue({ user: { id: 'other-user' } })
    render(
      <UpdateCard update={makeUpdate()} onDeleted={onDeleted} onUpdated={onUpdated} />
    )
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })
})
