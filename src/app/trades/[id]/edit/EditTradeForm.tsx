'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateTradeAction } from '../../actions'
import { cn } from '@/lib/utils'
import type { Trade, TradeSide, Mood } from '@/types'

const MOODS: { val: Mood; emoji: string }[] = [
  { val: 'angry', emoji: '😤' },
  { val: 'sad', emoji: '😕' },
  { val: 'neutral', emoji: '😐' },
  { val: 'happy', emoji: '😊' },
  { val: 'fire', emoji: '🔥' },
]

export function EditTradeForm({ trade }: { trade: Trade }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [side, setSide] = useState<TradeSide>(trade.side)
  const [mood, setMood] = useState<Mood | ''>(trade.mood || '')
  const [isClosed, setIsClosed] = useState(trade.status === 'closed')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    if (mood) fd.set('mood', mood)
    const result = await updateTradeAction(trade.id, fd)
    if (result?.error) { setError(result.error); setLoading(false) }
  }

  const inputCls = 'w-full bg-bg-2 border border-border rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-2 transition-colors font-mono'
  const labelCls = 'font-mono text-[10px] text-text-muted tracking-widest uppercase mb-1.5 block'

  return (
    <div dir="rtl">
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 border-b border-border bg-bg/95 backdrop-blur">
        <h1 className="text-[14px] font-medium">ویرایش معامله — {trade.symbol}</h1>
        <button onClick={() => router.back()} className="text-text-muted text-sm hover:text-text-secondary">
          <i className="ti ti-arrow-right ml-1" />بازگشت
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>نماد</label>
              <input name="symbol" defaultValue={trade.symbol} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>جهت</label>
              <div className="grid grid-cols-2 gap-2">
                {(['long', 'short'] as TradeSide[]).map(s => (
                  <button key={s} type="button" onClick={() => setSide(s)}
                    className={cn('py-2 rounded text-sm font-medium transition-all border',
                      side === s && s === 'long' ? 'bg-green/[0.12] text-green border-green/30' :
                      side === s && s === 'short' ? 'bg-red-trade/[0.12] text-red-trade border-red-trade/30' :
                      'bg-bg-2 text-text-muted border-border'
                    )}>
                    {s === 'long' ? '▲ LONG' : '▼ SHORT'}
                  </button>
                ))}
                <input type="hidden" name="side" value={side} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelCls}>قیمت ورود</label><input name="entry_price" type="number" step="any" required defaultValue={trade.entry_price} className={inputCls} dir="ltr" /></div>
            <div><label className={labelCls}>حد ضرر</label><input name="stop_loss" type="number" step="any" required defaultValue={trade.stop_loss} className={inputCls} dir="ltr" /></div>
            <div><label className={labelCls}>حد سود</label><input name="take_profit" type="number" step="any" required defaultValue={trade.take_profit} className={inputCls} dir="ltr" /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>حجم (USDT)</label><input name="size" type="number" step="any" required defaultValue={trade.size} className={inputCls} dir="ltr" /></div>
            <div><label className={labelCls}>تاریخ ورود</label><input name="opened_at" type="datetime-local" required defaultValue={trade.opened_at?.slice(0, 16)} className={inputCls} dir="ltr" /></div>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setIsClosed(!isClosed)}
              className={cn('w-10 h-5 rounded-full border transition-all relative', isClosed ? 'bg-green/[0.15] border-green/30' : 'bg-bg-2 border-border')}>
              <div className={cn('absolute top-0.5 w-4 h-4 rounded-full transition-all', isClosed ? 'right-0.5 bg-green' : 'right-5 bg-text-muted')} />
            </button>
            <span className="text-sm text-text-secondary">معامله بسته شده</span>
          </div>

          {isClosed && (
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>قیمت خروج</label><input name="exit_price" type="number" step="any" defaultValue={trade.exit_price || ''} className={inputCls} dir="ltr" /></div>
              <div><label className={labelCls}>تاریخ خروج</label><input name="closed_at" type="datetime-local" defaultValue={trade.closed_at?.slice(0, 16) || ''} className={inputCls} dir="ltr" /></div>
            </div>
          )}

          <div>
            <label className={labelCls}>حس</label>
            <div className="flex gap-2">
              {MOODS.map(m => (
                <button key={m.val} type="button" onClick={() => setMood(mood === m.val ? '' : m.val)}
                  className={cn('w-10 h-10 rounded text-lg border transition-all',
                    mood === m.val ? 'bg-amber-trade/[0.12] border-amber-trade/30 scale-110' : 'bg-bg-2 border-border hover:border-border-2'
                  )}>
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>یادداشت</label>
            <textarea name="notes" rows={3} defaultValue={trade.notes || ''} className={inputCls + ' resize-none font-sans'} />
          </div>

          {error && <div className="bg-red-trade/10 border border-red-trade/20 rounded px-3 py-2 text-sm text-red-trade">{error}</div>}

          <button type="submit" disabled={loading}
            className="bg-green text-black font-medium py-2.5 rounded hover:opacity-85 disabled:opacity-50 transition-opacity">
            {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </form>
      </div>
    </div>
  )
}
