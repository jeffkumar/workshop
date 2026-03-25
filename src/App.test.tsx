import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('./lib/supabase', () => {
  const mockFn = vi.fn
  const mockChannel = {
    on: mockFn().mockReturnThis(),
    subscribe: mockFn().mockReturnThis(),
  }
  return {
    supabase: {
      auth: {
        getSession: mockFn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: mockFn().mockReturnValue({
          data: { subscription: { unsubscribe: mockFn() } },
        }),
      },
      from: mockFn().mockReturnValue({
        select: mockFn().mockReturnValue({
          order: mockFn().mockResolvedValue({ data: [], error: null }),
        }),
        insert: mockFn().mockResolvedValue({ data: null, error: null }),
      }),
      channel: mockFn().mockReturnValue(mockChannel),
      removeChannel: mockFn(),
    },
  }
})

describe('App', () => {
  it('renders without crashing', async () => {
    render(<App />)
    expect(await screen.findByText(/loading/i)).toBeInTheDocument()
  })
})
