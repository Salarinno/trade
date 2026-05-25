import type { Trade, DashboardStats, EquityPoint } from '@/types'

export function calcDashboardStats(trades: Trade[]): DashboardStats {
  const closed = trades.filter(t => t.status === 'closed' && t.pnl !== null)

  const wins = closed.filter(t => t.result === 'win')
  const losses = closed.filter(t => t.result === 'loss')
  const breakevens = closed.filter(t => t.result === 'breakeven')

  const totalPnl = closed.reduce((s, t) => s + (t.pnl || 0), 0)
  const winRate = closed.length > 0 ? (wins.length / closed.length) * 100 : 0

  const rrs = closed.filter(t => t.risk_reward).map(t => t.risk_reward!)
  const bestRR = rrs.length > 0 ? Math.max(...rrs) : 0
  const avgRR = rrs.length > 0 ? rrs.reduce((s, r) => s + r, 0) / rrs.length : 0

  // Max Drawdown
  let peak = 0, maxDD = 0, running = 0
  for (const t of closed) {
    running += t.pnl || 0
    if (running > peak) peak = running
    const dd = peak > 0 ? ((peak - running) / peak) * 100 : 0
    if (dd > maxDD) maxDD = dd
  }

  // Current streak
  let streak = 0
  let streakType: 'win' | 'loss' | null = null
  for (const t of [...closed].reverse()) {
    if (!streakType) {
      if (t.result === 'win') { streakType = 'win'; streak = 1 }
      else if (t.result === 'loss') { streakType = 'loss'; streak = 1 }
    } else if (t.result === streakType) {
      streak++
    } else break
  }

  const initialCapital = 10000
  const totalPnlPercent = (totalPnl / initialCapital) * 100

  return {
    total_pnl: totalPnl,
    total_pnl_percent: totalPnlPercent,
    win_rate: winRate,
    total_trades: closed.length,
    winning_trades: wins.length,
    losing_trades: losses.length,
    breakeven_trades: breakevens.length,
    best_rr: bestRR,
    avg_rr: avgRR,
    max_drawdown: maxDD,
    current_streak: streak,
    streak_type: streakType,
  }
}

export function calcEquityCurve(trades: Trade[]): EquityPoint[] {
  const closed = trades
    .filter(t => t.status === 'closed' && t.pnl !== null && t.closed_at)
    .sort((a, b) => new Date(a.closed_at!).getTime() - new Date(b.closed_at!).getTime())

  let running = 0
  return closed.map(t => {
    running += t.pnl || 0
    return {
      date: t.closed_at!.split('T')[0],
      value: running,
      pnl: t.pnl || 0,
    }
  })
}
