import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { GamificationProvider, useGamification } from '@/contexts/GamificationContext'

// Mock the API
vi.mock('@/lib/api', () => ({
  getGamificationStats: vi.fn(),
}))

import { getGamificationStats } from '@/lib/api'

const mockGetGamificationStats = vi.mocked(getGamificationStats)

// Test component to access context
function TestComponent() {
  const { stats, updateStats, isLoading } = useGamification()
  return (
    <div>
      <div data-testid="stats">{JSON.stringify(stats)}</div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <button onClick={updateStats} data-testid="update-btn">Update</button>
    </div>
  )
}

describe('GamificationContext', () => {
  beforeEach(() => {
    mockGetGamificationStats.mockClear()
  })

  it('provides initial loading state', () => {
    mockGetGamificationStats.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(
      <GamificationProvider>
        <TestComponent />
      </GamificationProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('true')
    expect(screen.getByTestId('stats')).toHaveTextContent('null')
  })

  it('loads stats on mount', async () => {
    const mockStats = {
      xp: 100,
      level: 3,
      badges: ['First Analysis'],
      nextLevelXP: 150,
      analysis_count: 5
    }
    mockGetGamificationStats.mockResolvedValue(mockStats)

    render(
      <GamificationProvider>
        <TestComponent />
      </GamificationProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('stats')).toHaveTextContent(JSON.stringify(mockStats))
  })

  it('calls updateStats when button is clicked', async () => {
    const mockStats = {
      xp: 50,
      level: 2,
      badges: ['First Analysis'],
      nextLevelXP: 100,
      analysis_count: 1
    }
    mockGetGamificationStats.mockResolvedValue(mockStats)

    render(
      <GamificationProvider>
        <TestComponent />
      </GamificationProvider>
    )

    const button = screen.getByTestId('update-btn')
    button.click()

    expect(mockGetGamificationStats).toHaveBeenCalledTimes(2) // Once on mount, once on click
  })

  it('throws error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<TestComponent />)).toThrow(
      'useGamification must be used within a GamificationProvider'
    )

    consoleSpy.mockRestore()
  })
})