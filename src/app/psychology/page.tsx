import { createClient } from '@/lib/supabase/server'

const MOOD_EMOJI: Record<string, string> = { angry: '😤', sad: '😕', neutral: '😐', happy: '😊', fire: '🔥' }
const MOOD_LABEL: Record<string, string> = { angry: 'عصبانی', sad: 'ناراحت', neutral: 'معمولی', happy: 'خوب', fire: 'عالی' }

export default async function PsychologyPage() {
  const supabase = createClient()
  const { data: trades = [] } = await supabase
    .from('trades').select('*').eq('status', 'closed').order('opened_at', { ascending: false })

  const moodData: Record<string, { count: number; pnl: number; wins: number; losses: number }> = {}
  for (const t of trades || []) {
    const m = t.mood || 'unknown'
    if (!moodData[m]) moodData[m] = { count: 0, pnl: 0, wins: 0, losses: 0 }
    moodData[m].count++
    moodData[m].pnl += t.pnl || 0
    if (t.result === 'win') moodData[m].wins++
    if (t.result === 'loss') moodData[m].losses++
  }

  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i))
    return d.toISOString().split('T')[0]
  })
  const byDate: Record<string, { pnl: number; count: number }> = {}
  for (const t of trades || []) {
    const date = t.opened_at.split('T')[0]
    if (!byDate[date]) byDate[date] = { pnl: 0, count: 0 }
    byDate[date].pnl += t.pnl || 0
    byDate[date].count++
  }

  return (
    <div dir="rtl">
      <div className="sticky top-0 z-10 px-6 py-3.5 border-b border-border bg-bg/95 backdrop-blur">
        <h1 className="text-[14px] font-medium">روانشناسی ترید</h1>
      </div>
      <div className="p-6 flex flex-col gap-5">
        <div className="bg-bg-1 border border-border rounded-md overflow-hidden">
          <div className="px-4 py-3 border-b border-border text-[13px] font-medium">عملکرد بر اساس موود</div>
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-border bg-bg-2">
                {['موود','تعداد','برنده','بازنده','P&L','Win%'].map(h => (
                  <th key={h} className="px-4 py-2 font-mono text-[9px] text-text-muted uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(moodData).filter(([k]) => k !== 'unknown').map(([mood, d]) => (
                <tr key={mood} className="border-b border-border last:border-0 hover:bg-bg-2 transition-colors">
                  <td className="px-4 py-2.5">
                    <span className="text-lg ml-2">{MOOD_EMOJI[mood]}</span>
                    <span className="text-[12px] text-text-primary">{MOOD_LABEL[mood]}</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-text-secondary">{d.count}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-green">{d.wins}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-red-trade">{d.losses}</td>
                  <td className={`px-4 py-2.5 font-mono text-[12px] ${d.pnl >= 0 ? 'text-green' : 'text-red-trade'}`}>
                    {d.pnl >= 0 ? '+' : ''}{d.pnl.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-text-secondary">
                    {d.count > 0 ? ((d.wins / d.count) * 100).toFixed(0) + '%' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-bg-1 border border-border rounded-md p-4">
          <div className="text-[13px] font-medium mb-4">تقویم ۳۰ روزه</div>
          <div className="grid grid-cols-10 gap-1.5">
            {last30.map(date => {
              const d = byDate[date]
              const isWin = d && d.pnl > 0
              const isLoss = d && d.pnl < 0
              return (
                <div key={date} title={d ? `${date}: ${d.pnl.toFixed(2)} USDT` : date}
                  className={`aspect-square rounded flex items-center justify-center font-mono text-[9px] border cursor-default
                    ${isWin ? 'bg-green/[0.12] border-green/20 text-green' :
                      isLoss ? 'bg-red-trade/[0.12] border-red-trade/20 text-red-trade' :
                      'bg-bg-2 border-border text-text-muted'}`}>
                  {new Date(date).getDate()}
                </div>
              )
            })}
          </div>
          <div className="flex gap-4 mt-3">
            {[['سود','bg-green/[0.12] border-green/20'],['ضرر','bg-red-trade/[0.12] border-red-trade/20'],['بدون معامله','bg-bg-2 border-border']].map(([l,c]) => (
              <div key={l} className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <div className={`w-3 h-3 rounded border ${c}`} />{l}
              </div>
            ))}
          </div>
        </div>
        {(trades || []).filter(t => t.notes).length > 0 && (
          <div className="bg-bg-1 border border-border rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-border text-[13px] font-medium">آخرین یادداشت‌ها</div>
            <div className="divide-y divide-border">
              {(trades || []).filter(t => t.notes).slice(0, 5).map(t => (
                <div key={t.id} className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-text-muted">{t.opened_at.split('T')[0]}</span>
                    <span className="font-mono text-[10px] text-text-primary">{t.symbol}</span>
                    {t.mood && <span>{MOOD_EMOJI[t.mood]}</span>}
                  </div>
                  <p className="text-[12px] text-text-secondary leading-relaxed">{t.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
