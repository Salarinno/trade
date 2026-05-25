import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTradeById, deleteTradeAction } from '../actions'
import { cn, MOOD_EMOJI } from '@/lib/utils'

export default async function TradeDetailPage({ params }: { params: { id: string } }) {
  const trade = await getTradeById(params.id)
  if (!trade) notFound()

  const pnlColor = (trade.pnl || 0) > 0 ? 'text-green' : (trade.pnl || 0) < 0 ? 'text-red-trade' : 'text-amber-trade'

  const rows = [
    { label: 'نماد', value: trade.symbol },
    { label: 'جهت', value: trade.side === 'long' ? 'LONG' : 'SHORT' },
    { label: 'قیمت ورود', value: trade.entry_price },
    { label: 'قیمت خروج', value: trade.exit_price || '—' },
    { label: 'حد ضرر', value: trade.stop_loss },
    { label: 'حد سود', value: trade.take_profit },
    { label: 'حجم (USDT)', value: trade.size },
    { label: 'R:R', value: trade.risk_reward ? `1:${trade.risk_reward.toFixed(2)}` : '—' },
    { label: 'تاریخ ورود', value: trade.opened_at.split('T')[0] },
    { label: 'تاریخ خروج', value: trade.closed_at?.split('T')[0] || '—' },
    { label: 'استراتژی', value: trade.strategy || '—' },
  ]

  return (
    <div dir="rtl">
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 border-b border-border bg-bg/95 backdrop-blur">
        <h1 className="text-[14px] font-medium">{trade.symbol} — جزئیات</h1>
        <div className="flex items-center gap-2">
          <Link href={`/trades/${trade.id}/edit`}
            className="text-[12px] border border-border text-text-secondary px-3 py-1.5 rounded hover:border-border-2 transition-all">
            ویرایش
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 flex flex-col gap-4">
        {trade.pnl != null && (
          <div className={cn('rounded-md border px-5 py-4 flex items-center justify-between',
            trade.pnl > 0 ? 'bg-green/[0.06] border-green/20' :
            trade.pnl < 0 ? 'bg-red-trade/[0.06] border-red-trade/20' :
            'bg-amber-trade/[0.06] border-amber-trade/20'
          )}>
            <div>
              <div className="font-mono text-[9px] text-text-muted uppercase tracking-widest mb-1">نتیجه</div>
              <div className={`font-mono text-3xl ${pnlColor}`}>
                {trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(2)} USDT
              </div>
            </div>
            <div className="text-left">
              <div className={`font-mono text-lg ${pnlColor}`}>
                {(trade.pnl_percent || 0) > 0 ? '+' : ''}{(trade.pnl_percent || 0).toFixed(2)}%
              </div>
              <div className="font-mono text-[10px] text-text-muted mt-1">
                {trade.result === 'win' ? 'برنده' : trade.result === 'loss' ? 'بازنده' : 'سربه‌سر'}
              </div>
            </div>
          </div>
        )}

        <div className="bg-bg-1 border border-border rounded-md overflow-hidden">
          {rows.map((r, i) => (
            <div key={r.label} className={cn('flex items-center justify-between px-4 py-2.5',
              i < rows.length - 1 && 'border-b border-border')}>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wide">{r.label}</span>
              <span className="font-mono text-[12px] text-text-primary">{String(r.value)}</span>
            </div>
          ))}
        </div>

        {trade.mood && (
          <div className="bg-bg-1 border border-border rounded-md px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">{MOOD_EMOJI[trade.mood]}</span>
            <div>
              <div className="font-mono text-[9px] text-text-muted uppercase tracking-widest mb-0.5">حس در زمان معامله</div>
              <div className="text-sm text-text-primary">{trade.mood}</div>
            </div>
          </div>
        )}

        {trade.notes && (
          <div className="bg-bg-1 border border-border rounded-md p-4">
            <div className="font-mono text-[9px] text-text-muted uppercase tracking-widest mb-2">یادداشت</div>
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{trade.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
