// ===== USER =====
export type Plan = 'free' | 'pro'

export interface User {
  id: string
  email: string
  full_name: string
  plan: Plan
  created_at: string
}

// ===== TRADE =====
export type TradeSide = 'long' | 'short'
export type TradeResult = 'win' | 'loss' | 'breakeven'
export type TradeStatus = 'open' | 'closed'
export type Mood = 'angry' | 'sad' | 'neutral' | 'happy' | 'fire'

export interface Trade {
  id: string
  user_id: string
  symbol: string          // e.g. BTC/USDT
  side: TradeSide
  status: TradeStatus
  result?: TradeResult
  entry_price: number
  exit_price?: number
  stop_loss: number
  take_profit: number
  size: number            // position size in USDT
  pnl?: number            // realized P&L
  pnl_percent?: number
  risk_reward?: number
  strategy?: string
  mood?: Mood
  notes?: string
  screenshot_url?: string
  opened_at: string
  closed_at?: string
  created_at: string
}

// ===== TRADE FORM =====
export interface TradeFormData {
  symbol: string
  side: TradeSide
  entry_price: number
  exit_price?: number
  stop_loss: number
  take_profit: number
  size: number
  strategy?: string
  mood?: Mood
  notes?: string
  opened_at: string
  closed_at?: string
}

// ===== STATS =====
export interface DashboardStats {
  total_pnl: number
  total_pnl_percent: number
  win_rate: number
  total_trades: number
  winning_trades: number
  losing_trades: number
  breakeven_trades: number
  best_rr: number
  avg_rr: number
  max_drawdown: number
  current_streak: number
  streak_type: 'win' | 'loss' | null
}

export interface EquityPoint {
  date: string
  value: number
  pnl: number
}

// ===== PLAN LIMITS =====
export const PLAN_LIMITS: Record<Plan, { trades_per_month: number; has_advanced_stats: boolean; has_risk_management: boolean; has_export: boolean }> = {
  free: {
    trades_per_month: 20,
    has_advanced_stats: false,
    has_risk_management: false,
    has_export: false,
  },
  pro: {
    trades_per_month: Infinity,
    has_advanced_stats: true,
    has_risk_management: true,
    has_export: true,
  },
}
