import Link from 'next/link'
import type { Trade } from '@/types'
import { cn } from '@/lib/utils'

export function TradesTable({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) {
    return (
      <div className="px-4 py-10 text-center text-text-muted text-sm">
        هنوز معامله‌ای ثبت نشده —{' '}
        <Link href="/trades/new" className="text-green hover:opacity-80">اولین معامله رو ثبت کن</Link>
      </div>
    )
  }

  return (
    <table className="w-full text-right">
      <thead>
        <tr className="border-b border-border bg-bg-2">
          {['تاریخ', 'نماد', 'R:R', 'P&L', 'نتیجه'].map(h => (
            <th key={h} className="px-4 py-2 font-mono text-[9px] text-text-muted tracking-widest uppercase text-right">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {trades.map((t) => (
          <tr
            key={t.id}
            className="border-b border-border last:border-0 hover:bg-bg-2 transition-colors cursor-pointer"
          >
            <td className="px-4 py-2.5">
              <Link href={`/trades/${t.id}`} className="font-mono text-[10px] text-text-muted block">
                {t.opened_at.split('T')[0]}
              </Link>
            </td>
            <td className="px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-text-primary">{t.symbol}</span>
                <span className={cn(
                  'text-[9px] font-mono px-1.5 py-0.5 rounded border',
                  t.side === 'long'
                    ? 'bg-green/[0.08] text-green border-green/20'
                    : 'bg-red-trade/[0.08] text-red-trade border-red-trade/20'
                )}>
                  {t.side === 'long' ? 'LONG' : 'SHORT'}
                </span>
              </div>
            </td>
            <td className="px-4 py-2.5 font-mono text-[11px] text-text-secondary">
              {t.risk_reward ? `۱:${t.risk_reward.toFixed(1)}` : '—'}
            </td>
            <td className={cn(
              'px-4 py-2.5 font-mono text-[12px]',
              (t.pnl || 0) > 0 ? 'text-green' : (t.pnl || 0) < 0 ? 'text-red-trade' : 'text-amber-trade'
            )}>
              {t.pnl != null
                ? ((t.pnl > 0 ? '+' : '') + t.pnl.toFixed(2))
                : t.status === 'open' ? <span className="text-blue-trade text-[10px]">باز</span> : '—'}
            </td>
            <td className="px-4 py-2.5">
              <div className={cn(
                'w-2 h-2 rounded-full mx-auto',
                t.result === 'win' ? 'bg-green' :
                t.result === 'loss' ? 'bg-red-trade' :
                t.result === 'breakeven' ? 'bg-amber-trade' :
                'bg-border'
              )} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
