'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import SearchBar from '@/components/SearchBar'
import ResultCard from '@/components/ResultCard'
import { Toaster } from 'sonner'
import { GamificationProvider } from '@/contexts/GamificationContext'

export default function DashboardPage() {
  const [currentSymbol, setCurrentSymbol] = useState<string>('')

  const handleAnalyze = (symbol: string) => {
    setCurrentSymbol(symbol)
  }

  return (
    <GamificationProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Search for any stock symbol and get AI-powered sentiment analysis.
              </p>
            </div>

            {/* Search */}
            <SearchBar onAnalyze={handleAnalyze} />

            {/* Results */}
            <ResultCard symbol={currentSymbol} />
          </div>
        </main>

        {/* Sonner toast notifications */}
        <Toaster richColors position="top-right" />
      </div>
    </GamificationProvider>
  )
}