'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getQuote, getSentiment } from '@/lib/api'

interface QuoteData {
  symbol: string
  current_price: number
  percent_change: number
  volume: number
}

interface SentimentData {
  symbol: string
  sentiment: string
  justification: string
  timestamp: string
}

interface ResultCardProps {
  symbol?: string
}

export default function ResultCard({ symbol }: ResultCardProps) {
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [sentiment, setSentiment] = useState<SentimentData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (symbol) {
      loadData(symbol)
    }
  }, [symbol])

  const loadData = async (sym: string) => {
    setLoading(true)
    try {
      const [quoteData, sentimentData] = await Promise.all([
        getQuote(sym),
        getSentiment(sym)
      ])
      setQuote(quoteData)
      setSentiment(sentimentData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'bullish':
        return 'text-green-600'
      case 'bearish':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  if (!symbol) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">Enter a symbol and click Analyze to see results</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {quote && (
        <Card>
          <CardHeader>
            <CardTitle>{quote.symbol} Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Current Price</p>
                <p className="text-2xl font-bold">${quote.current_price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Change</p>
                <p className={`text-2xl font-bold ${quote.percent_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {quote.percent_change >= 0 ? '+' : ''}{quote.percent_change.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Volume</p>
                <p className="text-2xl font-bold">{quote.volume.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {sentiment && (
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Sentiment</p>
                <p className={`text-2xl font-bold ${getSentimentColor(sentiment.sentiment)}`}>
                  {sentiment.sentiment}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Justification</p>
                <p className="text-gray-700">{sentiment.justification}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  Analyzed at: {new Date(sentiment.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}