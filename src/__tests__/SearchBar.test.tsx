import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import SearchBar from '@/components/SearchBar'
import { GamificationProvider } from '@/contexts/GamificationContext'

// Mock the entire API module so both SearchBar and GamificationProvider work
vi.mock('@/lib/api', () => ({
  analyzeSymbol: vi.fn(),
  getGamificationStats: vi.fn(),
}))

import { analyzeSymbol, getGamificationStats } from '@/lib/api'

const mockAnalyzeSymbol = vi.mocked(analyzeSymbol)
const mockGetGamificationStats = vi.mocked(getGamificationStats)

const defaultStats = {
  xp: 0,
  level: 1,
  badges: [],
  nextLevelXP: 50,
  analysis_count: 0,
}

describe('SearchBar', () => {
  const mockOnAnalyze = vi.fn()

  beforeEach(() => {
    mockAnalyzeSymbol.mockClear()
    mockOnAnalyze.mockClear()
    mockGetGamificationStats.mockResolvedValue(defaultStats)
  })

  it('renders input and button', () => {
    render(
      <GamificationProvider>
        <SearchBar onAnalyze={mockOnAnalyze} />
      </GamificationProvider>
    )

    expect(screen.getByPlaceholderText(/enter stock symbol/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument()
  })

  it('calls onAnalyze and API when form is submitted', async () => {
    const user = userEvent.setup()
    mockAnalyzeSymbol.mockResolvedValue({
      xp: 10,
      level: 1,
      badges: ['First Analysis'],
      nextLevelXP: 50,
    })
    mockGetGamificationStats.mockResolvedValue({
      ...defaultStats,
      xp: 10,
      badges: ['First Analysis'],
    })

    render(
      <GamificationProvider>
        <SearchBar onAnalyze={mockOnAnalyze} />
      </GamificationProvider>
    )

    const input = screen.getByPlaceholderText(/enter stock symbol/i)
    const button = screen.getByRole('button', { name: /analyze/i })

    await user.type(input, 'AAPL')
    await user.click(button)

    await waitFor(() => {
      expect(mockAnalyzeSymbol).toHaveBeenCalledWith('AAPL')
    })
    await waitFor(() => {
      expect(mockOnAnalyze).toHaveBeenCalledWith('AAPL')
    })
  })

  it('does not call onAnalyze for empty symbol', async () => {
    const user = userEvent.setup()

    render(
      <GamificationProvider>
        <SearchBar onAnalyze={mockOnAnalyze} />
      </GamificationProvider>
    )

    const button = screen.getByRole('button', { name: /analyze/i })
    await user.click(button)

    expect(mockOnAnalyze).not.toHaveBeenCalled()
    expect(mockAnalyzeSymbol).not.toHaveBeenCalled()
  })

  it('converts input to uppercase', async () => {
    const user = userEvent.setup()

    render(
      <GamificationProvider>
        <SearchBar onAnalyze={mockOnAnalyze} />
      </GamificationProvider>
    )

    const input = screen.getByPlaceholderText(/enter stock symbol/i)
    await user.type(input, 'aapl')

    expect(input).toHaveValue('AAPL')
  })
})