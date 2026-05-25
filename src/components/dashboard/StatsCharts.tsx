'use client'

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import type { EquityPoint } from '@/types'

interface Props {
  equity: EquityPoint[]
  monthlyData: { month: string; pnl: number }[]
  symbolData: { symbol: string; pnl: number }[]
}

const tooltipStyle = {
  contentStyle: {
    background: '#0D1318',
    border: '1px solid #1E2D3D',
    borderRadius: 6,
    fontSize: 12,
    fontFamily: 'JetBrains Mono',
    color: '#E8EDF2',
  }
}

export function StatsCharts({ equity, monthlyData, symbolData }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2.5">

      {/* Equity Curve */}
      <div className="bg-bg-1 border border-border rounded-md p-4">
        <div className="text-[13px] font-medium mb-4">Equity Curve</div>
        {equity.length > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={equity}>
              <defs>
                <linearGradient id="eg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E676" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00E676" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#4A6070', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => v.slice(5)} />
              <YAxis hide />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [(v >= 0 ? '+' : '') + v.toFixed(2) + ' USDT', 'P&L']} />
              <Area type="monotone" dataKey="value" stroke="#00E676" strokeWidth={1.5} fill="url(#eg2)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : <div className="h-40 flex items-center justify-center text-text-muted text-sm">داده‌ای وجود ندارد</div>}
      </div>

      {/* Monthly P&L */}
      <div className="bg-bg-1 border border-border rounded-md p-4">
        <div className="text-[13px] font-medium mb-4">P&L ماهانه</div>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fill: '#4A6070', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => v.slice(5)} />
              <YAxis hide />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [(v >= 0 ? '+' : '') + v.toFixed(2) + ' USDT', 'P&L']} />
              <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                {monthlyData.map((entry, i) => (
                  <Cell key={i} fill={entry.pnl >= 0 ? '#00E676' : '#FF4444'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="h-40 flex items-center justify-center text-text-muted text-sm">داده‌ای وجود ندارد</div>}
      </div>

    </div>
  )
}
