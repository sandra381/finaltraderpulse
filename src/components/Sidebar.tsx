'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { getGamificationStats } from '@/lib/api'

interface GamificationStats {
  xp: number
  level: number
  badges: string[]
  nextLevelXP: number
  analysis_count: number
}

interface SidebarProps {
  onStatsUpdate: (stats: GamificationStats) => void
}

export default function Sidebar({ onStatsUpdate }: SidebarProps) {
  const [stats, setStats] = useState<GamificationStats | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await getGamificationStats()
      setStats(data)
      onStatsUpdate(data)
    } catch (error) {
      toast.error('Error loading gamification stats')
    }
  }

  const progress = stats ? ((stats.xp % 50) / 50) * 100 : 0

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg mr-3"></div>
          <h2 className="text-xl font-bold text-gray-900">TraderPulse</h2>
        </div>

        <nav className="mb-8">
          <ul className="space-y-2">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Dashboard
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Gamification
              </Button>
            </li>
          </ul>
        </nav>

        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Profile</h3>
          {stats && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Level {stats.level}</span>
                  <span>{stats.xp} XP</span>
                </div>
                <Progress value={progress} className="mt-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {stats.nextLevelXP - stats.xp} XP to next level
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Badges</h4>
                <div className="flex flex-wrap gap-1">
                  {stats.badges.map((badge, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}