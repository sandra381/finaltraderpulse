'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import SearchBar from '@/components/SearchBar'
import ResultCard from '@/components/ResultCard'
import { Toaster } from 'sonner'
import { getGamificationStats } from '@/lib/api'

interface GamificationStats {
  xp: number
  level: number
  badges: string[]
  nextLevelXP: number
  analysis_count: number
}

export default function DashboardPage() {
  const [currentSymbol, setCurrentSymbol] = useState<string>('')
  const [stats, setStats] = useState<GamificationStats | null>(null)

  const handleAnalyze = async (symbol: string) => {
    setCurrentSymbol(symbol)
    // Reload stats after analysis
    try {
      const newStats = await getGamificationStats()
      setStats(newStats)
    } catch (error) {
      console.error('Error updating stats:', error)
    }
  }

  const handleStatsUpdate = (newStats: GamificationStats) => {
    setStats(newStats)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onStatsUpdate={handleStatsUpdate} />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">TraderPulse Dashboard</h1>
          <SearchBar onAnalyze={handleAnalyze} />
          <ResultCard symbol={currentSymbol} />
        </div>
      </main>
      <Toaster />
    </div>
  )
}