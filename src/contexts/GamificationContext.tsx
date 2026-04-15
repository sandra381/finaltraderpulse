'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'
import { getGamificationStats, GamificationStats } from '@/lib/api'

interface GamificationContextType {
  stats: GamificationStats | null
  updateStats: () => Promise<void>
  isLoading: boolean
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined)

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<GamificationStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const updateStats = async () => {
    setIsLoading(true)
    try {
      const newStats = await getGamificationStats()
      const previousBadges = stats?.badges || []
      const newBadges = newStats.badges.filter(badge => !previousBadges.includes(badge))

      // Show notifications for new badges
      newBadges.forEach(badge => {
        toast.success(`¡Nueva insignia: ${badge}!`, {
          duration: 5000,
        })
      })

      setStats(newStats)
    } catch (error) {
      console.error('Error updating gamification stats:', error)
      toast.error('Error updating gamification stats')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    updateStats()
  }, [])

  return (
    <GamificationContext.Provider value={{ stats, updateStats, isLoading }}>
      {children}
    </GamificationContext.Provider>
  )
}

export function useGamification() {
  const context = useContext(GamificationContext)
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider')
  }
  return context
}