'use client'

import { useGamification } from '@/contexts/GamificationContext'
import { BarChart2, LayoutDashboard, Trophy, Zap } from 'lucide-react'

const BADGE_ICONS: Record<string, string> = {
  'First Analysis': '🔍',
  'Bull Market Expert': '🐂',
  Sentinel: '🛡️',
}

const BADGE_COLORS: Record<string, string> = {
  'First Analysis':
    'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Bull Market Expert':
    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Sentinel:
    'bg-purple-500/10 text-purple-400 border border-purple-500/20',
}

export default function Sidebar() {
  const { stats, isLoading } = useGamification()

  // XP within the current level (0–49), expressed as a percentage
  const currentLevelXP = stats ? stats.xp % 50 : 0
  const progressPct = (currentLevelXP / 50) * 100

  return (
    <aside className="w-64 shrink-0 flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground">
          <BarChart2 size={18} />
        </div>
        <span className="text-lg font-bold tracking-tight">TraderPulse</span>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        <button
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium
                     bg-primary/10 text-primary transition-colors hover:bg-primary/20"
        >
          <LayoutDashboard size={16} />
          Dashboard
        </button>
        <button
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium
                     text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Trophy size={16} />
          Gamification
        </button>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Gamification panel */}
      <div className="px-4 pb-6 space-y-4">
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-yellow-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your Progress
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-2 w-full rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
          ) : stats ? (
            <>
              {/* Level + XP row */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="text-2xl font-bold leading-none">{stats.level}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total XP</p>
                  <p className="text-lg font-semibold leading-none">{stats.xp}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{currentLevelXP} XP</span>
                  <span>{stats.nextLevelXP - stats.xp} to next</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Badges */}
              {stats.badges.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Badges</p>
                  <div className="flex flex-col gap-1.5">
                    {stats.badges.map((badge) => (
                      <span
                        key={badge}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
                          ${BADGE_COLORS[badge] ?? 'bg-accent text-accent-foreground border border-border'}`}
                      >
                        <span>{BADGE_ICONS[badge] ?? '🏅'}</span>
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis count */}
              <p className="text-xs text-muted-foreground text-right">
                {stats.analysis_count} analyses total
              </p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">No stats yet. Start analyzing!</p>
          )}
        </div>
      </div>
    </aside>
  )
}