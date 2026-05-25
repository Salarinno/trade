import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format number as USDT
export function formatUSDT(value: number, showSign = false): string {
  const formatted = new Intl.NumberFormat('fa-IR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(value))

  if (showSign) {
    return value >= 0 ? `+${formatted}` : `-${formatted}`
  }
  return formatted
}

// Format percent
export function formatPercent(value: number, showSign = false): string {
  const formatted = Math.abs(value).toFixed(1) + '٪'
  if (showSign) {
    return value >= 0 ? `+${formatted}` : `-${formatted}`
  }
  return formatted
}

// Format R:R ratio
export function formatRR(value: number): string {
  return `۱:${value.toFixed(1)}`
}

// Calculate R:R from trade params
export function calcRR(entry: number, stop: number, target: number, side: 'long' | 'short'): number {
  if (side === 'long') {
    const risk = entry - stop
    const reward = target - entry
    return risk > 0 ? reward / risk : 0
  } else {
    const risk = stop - entry
    const reward = entry - target
    return risk > 0 ? reward / risk : 0
  }
}

// Calculate P&L
export function calcPnL(entry: number, exit: number, size: number, side: 'long' | 'short') {
  const priceDiff = side === 'long' ? exit - entry : entry - exit
  const pnl = (priceDiff / entry) * size
  const pnlPercent = (priceDiff / entry) * 100
  return { pnl, pnlPercent }
}

// Determine trade result
export function getTradeResult(pnl: number): 'win' | 'loss' | 'breakeven' {
  if (pnl > 0) return 'win'
  if (pnl < 0) return 'loss'
  return 'breakeven'
}

// Mood emoji map
export const MOOD_EMOJI: Record<string, string> = {
  angry: '😤',
  sad: '😕',
  neutral: '😐',
  happy: '😊',
  fire: '🔥',
}

// Mood label map (Persian)
export const MOOD_LABEL: Record<string, string> = {
  angry: 'عصبانی',
  sad: 'ناراحت',
  neutral: 'معمولی',
  happy: 'خوب',
  fire: 'عالی',
}
