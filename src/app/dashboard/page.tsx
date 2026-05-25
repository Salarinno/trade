import { createClient } from '@/lib/supabase/server'
import { calcDashboardStats, calcEquityCurve } from '@/lib/stats'
import { formatUSDT, formatPercent, formatRR } from '@/lib/utils'
import { EquityChart } from '@/components/dashboard/EquityChart'
import { TradesTable } from '@/components/dashboard/TradesTable'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: trades = [] } = await supabase
    .from('trades')
    .select('*')
    .order('opened_at', { ascending: false })
    .limit(100)

  const stats = calcDashboardStats(trades || [])
  const equity = calcEquityCurve(trades || [])
  const recentTrades = (trades || []).slice(0, 5)

  const kpis = [
    {
      label: 'P&L کل',
      value: (stats.total_pnl >= 0 ? '+' : '') + formatUSDT(stats.total_pnl),
      sub: formatPercent(stats.total_pnl_percent, true) + ' بازدهی',
      color: stats.total_pnl >= 0 ? 'text-green' : 'text-red-trade',
    },
    {
      label: 'Win Rate',
      value: formatPercent(stats.win_rate),
      sub: `${stats.winning_trades} برنده از ${stats.total_trades}`,
      color: 'text-text-primary',
    },
    {
      label: 'میانگین R:R',
      value: formatRR(stats.avg_rr),
      sub: `بهترین: ${formatRR(stats.best_rr)}`,
      color: 'text-text-primary',
    },
    {
      label: 'Max Drawdown',
      value: '-' + formatPercent(stats.max_drawdown),
      sub: 'بیشترین افت سرمایه',
      color: stats.max_drawdown > 10 ? 'text-red-trade' : 'text-amber-trade',
    },
  ]

  return (
    <div dir="rtl">
      {/* Topbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 border-b border-border bg-bg/95 backdrop-blur">
        <h1 className="text-[14px] font-medium text-text-primary">داشبورد</h1>
        <Link
          href="/trades/new"
          className="flex items-center gap-1.5 bg-green text-black text-[12px] font-medium px-3.5 py-1.5 rounded hover:opacity-85 transition-opacity"
        >
          <i className="ti ti-plus text-[14px]" />
          معامله جدید
        </Link>
      </div>

      <div className="p-6 flex flex-col gap-5">

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-2.5">
          {kpis.map((k) => (
            <div key={k.label} className="bg-bg-1 border border-border rounded-md p-4">
              <div className="font-mono text-[9px] text-text-muted tracking-widest uppercase mb-2">{k.label}</div>
              <div className={`font-mono text-[22px] mb-1 ${k.color}`}>{k.value}</div>
              <div className="text-[11px] text-text-muted">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Chart + Donut */}
        <div className="grid grid-cols-[1fr_280px] gap-2.5">
          <div className="bg-bg-1 border border-border rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-medium">Equity Curve</span>
              <span className="font-mono text-[10px] text-text-muted">{equity.length} معامله</span>
            </div>
            <EquityChart data={equity} />
          </div>

          <div className="bg-bg-1 border border-border rounded-md p-4">
            <div className="text-[13px] font-medium mb-4">نتایج</div>
            <div className="flex flex-col items-center gap-4">
              {/* Simple donut via SVG */}
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="40" fill="none" stroke="#1E2D3D" strokeWidth="12" />
                {stats.total_trades > 0 && (
                  <>
                    <circle cx="55" cy="55" r="40" fill="none" stroke="#00E676" strokeWidth="12"
                      strokeDasharray={`${(stats.winning_trades / stats.total_trades) * 251.2} 251.2`}
                      strokeDashoffset="62.8" strokeLinecap="round" />
                    <circle cx="55" cy="55" r="40" fill="none" stroke="#FF4444" strokeWidth="12"
                      strokeDasharray={`${(stats.losing_trades / stats.total_trades) * 251.2} 251.2`}
                      strokeDashoffset={`${62.8 - (stats.winning_trades / stats.total_trades) * 251.2}`}
                      strokeLinecap="round" />
                  </>
                )}
                <text x="55" y="50" textAnchor="middle" fill="#E8EDF2" fontSize="14" fontFamily="JetBrains Mono">
                  {formatPercent(stats.win_rate)}
                </text>
                <text x="55" y="64" textAnchor="middle" fill="#4A6070" fontSize="9" fontFamily="Vazirmatn">Win Rate</text>
              </svg>

              <div className="w-full flex flex-col gap-2">
                {[
                  { label: 'برنده', val: stats.winning_trades, color: '#00E676' },
                  { label: 'بازنده', val: stats.losing_trades, color: '#FF4444' },
                  { label: 'سربه‌سر', val: stats.breakeven_trades, color: '#FFB300' },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                      <span className="text-text-secondary">{r.label}</span>
                    </div>
                    <span className="font-mono text-[11px] text-text-primary">{r.val} معامله</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-bg-1 border border-border rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-[13px] font-medium">آخرین معاملات</span>
            <Link href="/trades" className="text-[11px] text-green hover:opacity-80">مشاهده همه ←</Link>
          </div>
          <TradesTable trades={recentTrades} />
        </div>

      </div>
    </div>
  )
}
