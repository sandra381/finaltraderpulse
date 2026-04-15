import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Sidebar from '@/components/Sidebar'
import { GamificationProvider } from '@/contexts/GamificationContext'

// Mock the API
vi.mock('@/lib/api', () => ({
  getGamificationStats: vi.fn(),
}))

import { getGamificationStats } from '@/lib/api'

const mockGetGamificationStats = vi.mocked(getGamificationStats)

describe('Sidebar', () => {
  beforeEach(() => {
    mockGetGamificationStats.mockClear()
  })

  it('renders logo and navigation', () => {
    mockGetGamificationStats.mockResolvedValue({
      xp: 50,
      level: 2,
      badges: ['First Analysis'],
      nextLevelXP: 100,
      analysis_count: 1,
    })

    render(
      <GamificationProvider>
        <Sidebar />
      </GamificationProvider>
    )

    expect(screen.getByText('TraderPulse')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Gamification')).toBeInTheDocument()
  })

  it('displays level and XP when stats are loaded', async () => {
    mockGetGamificationStats.mockResolvedValue({
      xp: 50,
      level: 2,
      badges: ['First Analysis'],
      nextLevelXP: 100,
      analysis_count: 1,
    })

    render(
      <GamificationProvider>
        <Sidebar />
      </GamificationProvider>
    )

    // Level is displayed as plain number "2"
    expect(await screen.findByText('2')).toBeInTheDocument()
    // Total XP
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('First Analysis')).toBeInTheDocument()
  })

  it('shows loading skeleton initially', () => {
    mockGetGamificationStats.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(
      <GamificationProvider>
        <Sidebar />
      </GamificationProvider>
    )

    // Loading state renders animated pulse divs, no stats text
    expect(screen.queryByText('Level 2')).not.toBeInTheDocument()
  })

  it('displays multiple badges', async () => {
    mockGetGamificationStats.mockResolvedValue({
      xp: 150,
      level: 4,
      badges: ['First Analysis', 'Bull Market Expert', 'Sentinel'],
      nextLevelXP: 200,
      analysis_count: 15,
    })

    render(
      <GamificationProvider>
        <Sidebar />
      </GamificationProvider>
    )

    expect(await screen.findByText('First Analysis')).toBeInTheDocument()
    expect(screen.getByText('Bull Market Expert')).toBeInTheDocument()
    expect(screen.getByText('Sentinel')).toBeInTheDocument()
  })
})