'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { analyzeSymbol } from '@/lib/api'

interface SearchBarProps {
  onAnalyze: (symbol: string) => void
}

export default function SearchBar({ onAnalyze }: SearchBarProps) {
  const [symbol, setSymbol] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!symbol.trim()) {
      toast.error('Please enter a symbol')
      return
    }

    setLoading(true)
    try {
      await analyzeSymbol(symbol.trim())
      onAnalyze(symbol.trim())
      toast.success('Analysis completed!')
    } catch (error) {
      toast.error('Error analyzing symbol')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Enter stock symbol (e.g., AAPL, MSFT)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="flex-1"
        />
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>
    </div>
  )
}