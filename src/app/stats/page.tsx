import { createClient } from '@/lib/supabase/server'
import { calcDashboardStats, calcEquityCurve } from '@/lib/stats'
import { formatPercent, formatRR, formatUSDT } from '@/lib/utils'
import { EquityChart } from '@/components/dashboard/EquityChart'

export default async function StatsPage() {
  const supabase = createClient()
  const { data: trades = [] } = await supabase
    .from('trades').select('*').eq('status', 'closed').order('opened_at', { ascending: false })

  const stats = calcDashboardStats(trades || [])
  const equity = calcEquityCurve(trades || [])

  const bySymbol: Record<string, { count: number; pnl: number; wins: number }> = {}
  for (const t of trades || []) {
    if (!bySymbol[t.symbol]) bySymbol[t.symbol] = { count: 0, pnl: 0, wins: 0 }
    bySymbol[t.symbol].count++
    bySymbol[t.symbol].pnl += t.pnl || 0
    if (t.result === 'win') bySymbol[t.symbol].wins++
  }
  const symbolStats = Object.entries(bySymbol)
    .map(([sym, d]) => ({ sym, ...d, wr: (d.wins / d.count) * 100 }))
    .sort((a, b) => b.pnl - a.pnl)

  const byMood: Record<string, { count: number; pnl: number }> = {}
  for (const t of trades || []) {
    if (!t.mood) continue
    if (!byMood[t.mood]) byMood[t.mood] = { count: 0, pnl: 0 }
    byMood[t.mood].count++
    byMood[t.mood].pnl += t.pnl || 0
  }
  const MOOD_EMOJI: Record<string, string> = { angry: '😤', sad: '😕', neutral: '😐', happy: '😊', fire: '🔥' }

  const metricCards = [
    { label: 'کل معاملات', value: String(stats.total_trades), sub: `${stats.winning_trades}W / ${stats.losing_trades}L` },
    { label: 'Win Rate', value: formatPercent(stats.win_rate), sub: 'نرخ موفقیت' },
    { label: 'میانگین R:R', value: formatRR(stats.avg_rr), sub: `بهترین: ${formatRR(stats.best_rr)}` },
    { label: 'Max Drawdown', value: '-' + formatPercent(stats.max_drawdown), sub: 'بیشترین افت' },
    { label: 'P&L کل', value: (stats.total_pnl >= 0 ? '+' : '') + formatUSDT(stats.total_pnl) + ' USDT', sub: formatPercent(stats.total_pnl_percent, true) },
    { label: 'استریک فعلی', value: stats.streak_type ? `${stats.current_streak}× ${stats.streak_type === 'win' ? 'W' : 'L'}` : '—', sub: stats.streak_type === 'win' ? 'برد متوالی' : 'باخت متوالی' },
  ]

  return (
    <div dir="rtl">
      <div className="sticky top-0 z-10 px-6 py-3.5 border-b border-border bg-bg/95 backdrop-blur">
        <h1 className="text-[14px] font-medium">آمار پیشرفته</h1>
      </div>
      <div className="p-6 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-2.5">
          {metricCards.map(c => (
            <div key={c.label} className="bg-bg-1 border border-border rounded-md p-4">
              <div className="font-mono text-[9px] text-text-muted uppercase tracking-widest mb-2">{c.label}</div>
              <div className="font-mono text-xl text-text-primary mb-1">{c.value}</div>
              <div className="text-[11px] text-text-muted">{c.sub}</div>
            </div>
          ))}
        </div>
        <div className="bg-bg-1 border border-border rounded-md p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium">Equity Curve</span>
            <span className="font-mono text-[10px] text-text-muted">{equity.length} نقطه</span>
          </div>
          <EquityChart data={equity} />
        </div>
        {symbolStats.length > 0 && (
          <div className="bg-bg-1 border border-border rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-border text-[13px] font-medium">عملکرد بر اساس نماد</div>
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-border bg-bg-2">
                  {['نماد', 'تعداد', 'Win Rate', 'P&L'].map(h => (
                    <th key={h} className="px-4 py-2 font-mono text-[9px] text-text-muted uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {symbolStats.map(s => (
                  <tr key={s.sym} className="border-b border-border last:border-0 hover:bg-bg-2 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-[12px] text-text-primary">{s.sym}</td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-text-secondary">{s.count}</td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-text-secondary">{s.wr.toFixed(0)}%</td>
                    <td className={`px-4 py-2.5 font-mono text-[12px] ${s.pnl >= 0 ? 'text-green' : 'text-red-trade'}`}>
                      {s.pnl >= 0 ? '+' : ''}{s.pnl.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {Object.keys(byMood).length > 0 && (
          <div className="bg-bg-1 border border-border rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-border text-[13px] font-medium">عملکرد بر اساس موود</div>
            <div className="grid grid-cols-5 divide-x divide-x-reverse divide-border">
              {Object.entries(byMood).map(([mood, d]) => (
                <div key={mood} className="p-4 text-center">
                  <div className="text-2xl mb-2">{MOOD_EMOJI[mood] || '—'}</div>
                  <div className="font-mono text-[10px] text-text-muted mb-1">{d.count} معامله</div>
                  <div className={`font-mono text-[12px] ${d.pnl >= 0 ? 'text-green' : 'text-red-trade'}`}>
                    {d.pnl >= 0 ? '+' : ''}{d.pnl.toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
