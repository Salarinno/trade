-- ============================================
-- TradeLog — Supabase Database Schema
-- اجرا کن در Supabase > SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ===== PROFILES =====
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  plan_expires_at timestamptz,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ===== TRADES =====
create table public.trades (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  symbol text not null,
  side text not null check (side in ('long', 'short')),
  status text not null default 'closed' check (status in ('open', 'closed')),
  result text check (result in ('win', 'loss', 'breakeven')),
  entry_price numeric(20, 8) not null,
  exit_price numeric(20, 8),
  stop_loss numeric(20, 8) not null,
  take_profit numeric(20, 8) not null,
  size numeric(20, 4) not null,
  pnl numeric(20, 4),
  pnl_percent numeric(10, 4),
  risk_reward numeric(10, 4),
  strategy text,
  mood text check (mood in ('angry', 'sad', 'neutral', 'happy', 'fire')),
  notes text,
  screenshot_url text,
  opened_at timestamptz not null,
  closed_at timestamptz,
  created_at timestamptz default now()
);

-- ===== STRATEGIES =====
create table public.strategies (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  rules text[],
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ===== ROW LEVEL SECURITY =====
alter table public.profiles enable row level security;
alter table public.trades enable row level security;
alter table public.strategies enable row level security;

-- Profiles: only own row
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trades: only own trades
create policy "Users can CRUD own trades" on public.trades
  for all using (auth.uid() = user_id);

-- Strategies: only own strategies
create policy "Users can CRUD own strategies" on public.strategies
  for all using (auth.uid() = user_id);

-- ===== INDEXES =====
create index trades_user_id_idx on public.trades(user_id);
create index trades_opened_at_idx on public.trades(opened_at desc);
create index trades_symbol_idx on public.trades(symbol);
