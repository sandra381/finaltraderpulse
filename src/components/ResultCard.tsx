'use client'
import React from 'react';
import { useState, useEffect } from 'react'
import { getQuote, getSentiment, QuoteResponse, SentimentResponse } from '@/lib/api'
import { TrendingUp, TrendingDown, Minus, Activity, BarChart2, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface ResultCardProps {
  symbol?: string
}

function SentimentIcon({ sentiment }: { sentiment: string }) {
  switch (sentiment.toLowerCase()) {
    case 'bullish':
      return <TrendingUp size={20} className="text-emerald-400" />
    case 'bearish':
      return <TrendingDown size={20} className="text-red-400" />
    default:
      return <Minus size={20} className="text-yellow-400" />
  }
}

function sentimentColor(sentiment: string) {
  switch (sentiment.toLowerCase()) {
    case 'bullish':
      return 'text-emerald-400'
    case 'bearish':
      return 'text-red-400'
    default:
      return 'text-yellow-400'
  }
}

function sentimentBg(sentiment: string) {
  switch (sentiment.toLowerCase()) {
    case 'bullish':
      return 'bg-emerald-500/10 border-emerald-500/20'
    case 'bearish':
      return 'bg-red-500/10 border-red-500/20'
    default:
      return 'bg-yellow-500/10 border-yellow-500/20'
  }
}

export default function ResultCard({ symbol }: ResultCardProps) {
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [sentiment, setSentiment] = useState<SentimentResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (symbol) {
      loadData(symbol)
    } else {
      setQuote(null)
      setSentiment(null)
    }
  }, [symbol])

  const loadData = async (sym: string) => {
    setLoading(true)
    try {
      const [quoteData, sentimentData] = await Promise.all([
        getQuote(sym),
        getSentiment(sym),
      ])
      setQuote(quoteData)
      setSentiment(sentimentData)
    } catch (error) {
      toast.error(`Failed to load data for ${sym}`)
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!symbol) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center gap-3">
        <BarChart2 size={40} className="text-muted-foreground/40" />
        <p className="text-muted-foreground text-sm">
          Enter a stock symbol and click <strong>Analyze</strong> to see results.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 rounded-2xl bg-muted/40" />
        <div className="h-40 rounded-2xl bg-muted/40" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quote Card */}
      {quote && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-primary" />
            <h2 className="text-base font-semibold">{quote.symbol} · Live Quote</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-muted/40 p-4 space-y-1">
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-2xl font-bold">${quote.current_price.toFixed(2)}</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4 space-y-1">
              <p className="text-xs text-muted-foreground">Change</p>
              <p
                className={`text-2xl font-bold ${quote.percent_change >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
              >
                {quote.percent_change >= 0 ? '+' : ''}
                {quote.percent_change.toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4 space-y-1">
              <p className="text-xs text-muted-foreground">Volume</p>
              <p className="text-2xl font-bold">{quote.volume.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sentiment Card */}
      {sentiment && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <SentimentIcon sentiment={sentiment.sentiment} />
            <h2 className="text-base font-semibold">AI Sentiment Analysis</h2>
          </div>

          <div
            className={`flex items-center gap-3 rounded-xl border p-4 ${sentimentBg(
              sentiment.sentiment
            )}`}
          >
            <SentimentIcon sentiment={sentiment.sentiment} />
            <span className={`text-xl font-bold ${sentimentColor(sentiment.sentiment)}`}>
              {sentiment.sentiment}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {sentiment.justification}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <Clock size={12} />
            <span>Analyzed at {new Date(sentiment.timestamp).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}