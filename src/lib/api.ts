const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface QuoteResponse {
  symbol: string
  current_price: number
  percent_change: number
  volume: number
}

export interface SentimentResponse {
  symbol: string
  sentiment: string
  justification: string
  timestamp: string
}

export interface GamificationStats {
  xp: number
  level: number
  badges: string[]
  nextLevelXP: number
  analysis_count: number
}

export interface AnalyzeRequest {
  symbol: string
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}

export async function getQuote(symbol: string): Promise<QuoteResponse> {
  return apiRequest<QuoteResponse>(`/api/v1/quote/${symbol}`)
}

export async function getSentiment(symbol: string): Promise<SentimentResponse> {
  return apiRequest<SentimentResponse>(`/api/v1/sentiment/${symbol}`)
}

export async function analyzeSymbol(symbol: string): Promise<any> {
  return apiRequest<any>('/api/v1/gamification/analyze', {
    method: 'POST',
    body: JSON.stringify({ symbol }),
  })
}

export async function getGamificationStats(): Promise<GamificationStats> {
  return apiRequest<GamificationStats>('/api/v1/gamification/stats')
}