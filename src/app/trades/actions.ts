'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { calcPnL, calcRR, getTradeResult } from '@/lib/utils'
import type { TradeFormData } from '@/types'

const tradeSchema = z.object({
  symbol: z.string().min(1, 'نماد الزامی است'),
  side: z.enum(['long', 'short']),
  entry_price: z.coerce.number().positive('قیمت ورود باید مثبت باشد'),
  exit_price: z.coerce.number().optional(),
  stop_loss: z.coerce.number().positive(),
  take_profit: z.coerce.number().positive(),
  size: z.coerce.number().positive('حجم باید مثبت باشد'),
  strategy: z.string().optional(),
  mood: z.enum(['angry', 'sad', 'neutral', 'happy', 'fire']).optional(),
  notes: z.string().optional(),
  opened_at: z.string(),
  closed_at: z.string().optional(),
})

export async function createTradeAction(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const raw = Object.fromEntries(formData.entries())
  const parsed = tradeSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const d = parsed.data
  const isClosed = !!d.exit_price && !!d.closed_at

  let pnl, pnlPercent, result, rr
  if (isClosed && d.exit_price) {
    const calc = calcPnL(d.entry_price, d.exit_price, d.size, d.side)
    pnl = calc.pnl
    pnlPercent = calc.pnlPercent
    result = getTradeResult(pnl)
    rr = calcRR(d.entry_price, d.stop_loss, d.take_profit, d.side)
  }

  const { error } = await supabase.from('trades').insert({
    user_id: user.id,
    symbol: d.symbol.toUpperCase(),
    side: d.side,
    status: isClosed ? 'closed' : 'open',
    result: result || null,
    entry_price: d.entry_price,
    exit_price: d.exit_price || null,
    stop_loss: d.stop_loss,
    take_profit: d.take_profit,
    size: d.size,
    pnl: pnl || null,
    pnl_percent: pnlPercent || null,
    risk_reward: rr || null,
    strategy: d.strategy || null,
    mood: d.mood || null,
    notes: d.notes || null,
    opened_at: d.opened_at,
    closed_at: d.closed_at || null,
  })

  if (error) return { error: 'خطا در ثبت معامله' }

  revalidatePath('/dashboard')
  revalidatePath('/trades')
  redirect('/trades')
}

export async function updateTradeAction(id: string, formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const raw = Object.fromEntries(formData.entries())
  const parsed = tradeSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const d = parsed.data
  const isClosed = !!d.exit_price && !!d.closed_at

  let pnl, pnlPercent, result, rr
  if (isClosed && d.exit_price) {
    const calc = calcPnL(d.entry_price, d.exit_price, d.size, d.side)
    pnl = calc.pnl
    pnlPercent = calc.pnlPercent
    result = getTradeResult(pnl)
    rr = calcRR(d.entry_price, d.stop_loss, d.take_profit, d.side)
  }

  const { error } = await supabase.from('trades')
    .update({
      symbol: d.symbol.toUpperCase(),
      side: d.side,
      status: isClosed ? 'closed' : 'open',
      result: result || null,
      entry_price: d.entry_price,
      exit_price: d.exit_price || null,
      stop_loss: d.stop_loss,
      take_profit: d.take_profit,
      size: d.size,
      pnl: pnl || null,
      pnl_percent: pnlPercent || null,
      risk_reward: rr || null,
      strategy: d.strategy || null,
      mood: d.mood || null,
      notes: d.notes || null,
      opened_at: d.opened_at,
      closed_at: d.closed_at || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'خطا در ویرایش معامله' }

  revalidatePath('/dashboard')
  revalidatePath('/trades')
  revalidatePath(`/trades/${id}`)
  redirect('/trades')
}

export async function deleteTradeAction(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { error } = await supabase.from('trades')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'خطا در حذف معامله' }

  revalidatePath('/dashboard')
  revalidatePath('/trades')
  redirect('/trades')
}

export async function getTrades(limit = 50, offset = 0) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', user.id)
    .order('opened_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return data || []
}

export async function getTradeById(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('trades')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  return data
}
