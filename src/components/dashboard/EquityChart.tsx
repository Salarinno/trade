'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { EquityPoint } from '@/types'

export function EquityChart({ data }: { data: EquityPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center text-text-muted text-sm">
        هنوز معامله‌ای ثبت نشده
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00E676" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#00E676" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fill: '#4A6070', fontSize: 9, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v.slice(5)}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            background: '#0D1318',
            border: '1px solid #1E2D3D',
            borderRadius: 6,
            fontSize: 12,
            fontFamily: 'JetBrains Mono',
            color: '#E8EDF2',
          }}
          formatter={(val: number) => [
            (val >= 0 ? '+' : '') + val.toFixed(2) + ' USDT',
            'P&L'
          ]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#00E676"
          strokeWidth={1.5}
          fill="url(#equityGrad)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
