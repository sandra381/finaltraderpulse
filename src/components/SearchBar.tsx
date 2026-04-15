'use client'
import React from 'react';
import { useState, KeyboardEvent } from 'react'
import { toast } from 'sonner'
import { analyzeSymbol } from '@/lib/api'
import { useGamification } from '@/contexts/GamificationContext'
import { Search, Loader2 } from 'lucide-react'

interface SearchBarProps {
  onAnalyze: (symbol: string) => void
}

export default function SearchBar({ onAnalyze }: SearchBarProps) {
  const [symbol, setSymbol] = useState('')
  const [loading, setLoading] = useState(false)
  const { updateStats } = useGamification()

  const handleAnalyze = async () => {
    const trimmed = symbol.trim()
    if (!trimmed) {
      toast.error('Please enter a stock symbol')
      return
    }

    setLoading(true)
    try {
      await analyzeSymbol(trimmed)
      await updateStats()
      onAnalyze(trimmed)
      toast.success(`Analysis for ${trimmed} completed!`)
    } catch (error) {
      toast.error(`Failed to analyze ${trimmed}. Check the symbol and try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAnalyze()
  }

  return (
    <div className="flex gap-3 items-center">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          id="symbol-input"
          type="text"
          placeholder="Enter stock symbol (e.g., AAPL, MSFT, TSLA)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-sm
                     placeholder:text-muted-foreground/60
                     focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-150"
        />
      </div>

      <button
        id="analyze-button"
        onClick={handleAnalyze}
        disabled={loading}
        className="h-11 px-6 rounded-xl font-semibold text-sm
                   bg-primary text-primary-foreground
                   hover:opacity-90 active:scale-95
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-150 flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Analyzing…
          </>
        ) : (
          'Analyze'
        )}
      </button>
    </div>
  )
}