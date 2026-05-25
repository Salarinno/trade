'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTradeAction } from '../actions'
import { calcRR, calcPnL, cn } from '@/lib/utils'
import type { TradeSide, Mood } from '@/types'

const MOODS: { val: Mood; emoji: string; label: string }[] = [
  { val: 'angry', emoji: '😤', label: 'عصبانی' },
  { val: 'sad', emoji: '😕', label: 'ناراحت' },
  { val: 'neutral', emoji: '😐', label: 'معمولی' },
  { val: 'happy', emoji: '😊', label: 'خوب' },
  { val: 'fire', emoji: '🔥', label: 'عالی' },
]

const SYMBOLS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'ADA/USDT', 'AVAX/USDT', 'DOGE/USDT']

export default function NewTradePage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [side, setSide] = useState<TradeSide>('long')
  const [mood, setMood] = useState<Mood | ''>('')
  const [isClosed, setIsClosed] = useState(true)

  // Live R:R preview
  const [entry, setEntry] = useState('')
  const [sl, setSl] = useState('')
  const [tp, setTp] = useState('')
  const [size, setSize] = useState('')
  const [exitPrice, setExitPrice] = useState('')

  const rr = entry && sl && tp
    ? calcRR(+entry, +sl, +tp, side)
    : null

  const pnlPreview = isClosed && entry && exitPrice && size
    ? calcPnL(+entry, +exitPrice, +size, side)
    : null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    if (mood) fd.set('mood', mood)
    const result = await createTradeAction(fd)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const inputCls = 'w-full bg-bg-2 border border-border rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-2 transition-colors font-mono'
  const labelCls = 'font-mono text-[10px] text-text-muted tracking-widest uppercase mb-1.5 block'

  return (
    <div dir="rtl">
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 border-b border-border bg-bg/95 backdrop-blur">
        <h1 className="text-[14px] font-medium">ثبت معامله جدید</h1>
        <button onClick={() => router.back()} className="text-text-muted text-sm hover:text-text-secondary transition-colors">
          <i className="ti ti-arrow-right ml-1" />بازگشت
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Symbol + Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>نماد</label>
              <div className="relative">
                <select
                  name="symbol"
                  className={inputCls + ' appearance-none cursor-pointer'}
                >
                  {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="custom">سایر...</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>جهت معامله</label>
              <div className="grid grid-cols-2 gap-2">
                {(['long', 'short'] as TradeSide[]).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSide(s)}
                    className={cn(
                      'py-2 rounded text-sm font-medium transition-all border',
                      side === s && s === 'long' ? 'bg-green/[0.12] text-green border-green/30' :
                      side === s && s === 'short' ? 'bg-red-trade/[0.12] text-red-trade border-red-trade/30' :
                      'bg-bg-2 text-text-muted border-border hover:border-border-2'
                    )}
                  >
                    {s === 'long' ? '▲ LONG' : '▼ SHORT'}
                  </button>
                ))}
                <input type="hidden" name="side" value={side} />
              </div>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>قیمت ورود</label>
              <input name="entry_price" type="number" step="any" required placeholder="0.00"
                value={entry} onChange={e => setEntry(e.target.value)} className={inputCls} dir="ltr" />
            </div>
            <div>
              <label className={labelCls}>حد ضرر</label>
              <input name="stop_loss" type="number" step="any" required placeholder="0.00"
                value={sl} onChange={e => setSl(e.target.value)} className={inputCls} dir="ltr" />
            </div>
            <div>
              <label className={labelCls}>حد سود</label>
              <input name="take_profit" type="number" step="any" required placeholder="0.00"
                value={tp} onChange={e => setTp(e.target.value)} className={inputCls} dir="ltr" />
            </div>
          </div>

          {/* R:R Preview */}
          {rr !== null && (
            <div className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded border text-sm',
              rr >= 2 ? 'bg-green/[0.06] border-green/20 text-green' :
              rr >= 1 ? 'bg-amber-trade/[0.06] border-amber-trade/20 text-amber-trade' :
              'bg-red-trade/[0.06] border-red-trade/20 text-red-trade'
            )}>
              <span className="font-mono font-medium">R:R = ۱:{rr.toFixed(2)}</span>
              <span className="text-xs opacity-70">
                {rr >= 2 ? '✓ نسبت خوب' : rr >= 1 ? '⚠ حداقل قابل قبول' : '✗ نسبت ضعیف'}
              </span>
            </div>
          )}

          {/* Size + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>حجم (USDT)</label>
              <input name="size" type="number" step="any" required placeholder="100"
                value={size} onChange={e => setSize(e.target.value)} className={inputCls} dir="ltr" />
            </div>
            <div>
              <label className={labelCls}>تاریخ ورود</label>
              <input name="opened_at" type="datetime-local" required
                defaultValue={new Date().toISOString().slice(0, 16)} className={inputCls} dir="ltr" />
            </div>
          </div>

          {/* Closed toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsClosed(!isClosed)}
              className={cn(
                'w-10 h-5 rounded-full border transition-all relative',
                isClosed ? 'bg-green/[0.15] border-green/30' : 'bg-bg-2 border-border'
              )}
            >
              <div className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full transition-all',
                isClosed ? 'right-0.5 bg-green' : 'right-5 bg-text-muted'
              )} />
            </button>
            <span className="text-sm text-text-secondary">معامله بسته شده</span>
          </div>

          {/* Exit */}
          {isClosed && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>قیمت خروج</label>
                <input name="exit_price" type="number" step="any" placeholder="0.00"
                  value={exitPrice} onChange={e => setExitPrice(e.target.value)}
                  className={inputCls} dir="ltr" />
              </div>
              <div>
                <label className={labelCls}>تاریخ خروج</label>
                <input name="closed_at" type="datetime-local"
                  defaultValue={new Date().toISOString().slice(0, 16)} className={inputCls} dir="ltr" />
              </div>
            </div>
          )}

          {/* P&L Preview */}
          {pnlPreview && (
            <div className={cn(
              'px-4 py-2.5 rounded border text-sm font-mono',
              pnlPreview.pnl >= 0 ? 'bg-green/[0.06] border-green/20 text-green' : 'bg-red-trade/[0.06] border-red-trade/20 text-red-trade'
            )}>
              P&L پیش‌بینی: {pnlPreview.pnl >= 0 ? '+' : ''}{pnlPreview.pnl.toFixed(2)} USDT ({pnlPreview.pnlPercent.toFixed(2)}%)
            </div>
          )}

          {/* Mood */}
          <div>
            <label className={labelCls}>حس شما در این معامله</label>
            <div className="flex gap-2">
              {MOODS.map(m => (
                <button
                  key={m.val}
                  type="button"
                  onClick={() => setMood(mood === m.val ? '' : m.val)}
                  title={m.label}
                  className={cn(
                    'w-10 h-10 rounded text-lg transition-all border',
                    mood === m.val
                      ? 'bg-amber-trade/[0.12] border-amber-trade/30 scale-110'
                      : 'bg-bg-2 border-border hover:border-border-2'
                  )}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>یادداشت</label>
            <textarea name="notes" rows={3} placeholder="دلیل ورود، اشتباهات، درس‌ها..."
              className={inputCls + ' resize-none font-sans'} />
          </div>

          {error && (
            <div className="bg-red-trade/10 border border-red-trade/20 rounded px-3 py-2 text-sm text-red-trade">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-green text-black font-medium py-2.5 rounded hover:opacity-85 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'در حال ثبت...' : 'ثبت معامله'}
          </button>

        </form>
      </div>
    </div>
  )
}
