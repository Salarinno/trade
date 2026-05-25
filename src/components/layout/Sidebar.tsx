'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/auth/actions'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

const NAV = [
  { href: '/dashboard', icon: 'ti-layout-dashboard', label: 'داشبورد' },
  { href: '/trades/new', icon: 'ti-plus', label: 'معامله جدید' },
  { href: '/trades', icon: 'ti-notes', label: 'معاملاتم' },
]

const NAV_ANALYSIS = [
  { href: '/stats', icon: 'ti-chart-bar', label: 'آمار' },
  { href: '/risk', icon: 'ti-shield-check', label: 'ریسک' },
  { href: '/psychology', icon: 'ti-brain', label: 'روانشناسی' },
  { href: '/strategies', icon: 'ti-bulb', label: 'استراتژی' },
]

interface SidebarProps {
  user: User
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-[200px] bg-bg-1 border-l border-border flex flex-col min-h-screen fixed right-0 top-0 z-20" dir="rtl">

      {/* Logo */}
      <div className="font-mono text-green text-[13px] tracking-widest px-4 pt-4 pb-5">
        Trade<span className="text-text-muted">//</span>Log
      </div>

      {/* Main Nav */}
      <nav className="flex flex-col gap-0.5 px-2">
        {NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded text-[13px] transition-all border-r-2 border-transparent',
              pathname === item.href
                ? 'text-green bg-green/[0.08] border-r-green'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-2'
            )}
          >
            <i className={`ti ${item.icon} text-[15px]`} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-3 h-px bg-border" />

      {/* Analysis Nav */}
      <div className="px-4 mb-2">
        <span className="font-mono text-[9px] text-text-muted tracking-widest uppercase">تحلیل</span>
      </div>
      <nav className="flex flex-col gap-0.5 px-2">
        {NAV_ANALYSIS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded text-[13px] transition-all border-r-2 border-transparent',
              pathname === item.href
                ? 'text-green bg-green/[0.08] border-r-green'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-2'
            )}
          >
            <i className={`ti ${item.icon} text-[15px]`} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="mt-auto px-2 pb-4 flex flex-col gap-0.5">
        <div className="mx-2 mb-2 h-px bg-border" />

        {user.plan === 'free' && (
          <Link
            href="/upgrade"
            className="flex items-center gap-2.5 px-3 py-2 rounded text-[13px] text-amber-trade hover:bg-amber-trade/[0.08] transition-all"
          >
            <i className="ti ti-crown text-[15px]" />
            ارتقا به Pro
          </Link>
        )}

        <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2 rounded text-[13px] text-text-secondary hover:text-text-primary hover:bg-bg-2 transition-all">
          <i className="ti ti-settings text-[15px]" />
          تنظیمات
        </Link>

        {/* User chip */}
        <div className="mt-2 mx-1 bg-bg-2 border border-border rounded-md px-3 py-2 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green/[0.08] border border-green/20 flex items-center justify-center text-green font-mono text-[11px] flex-shrink-0">
            {user.full_name?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] text-text-primary truncate">{user.full_name}</div>
            <div className="text-[10px] font-mono text-green uppercase">{user.plan} plan</div>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="text-text-muted hover:text-text-secondary transition-colors">
              <i className="ti ti-logout text-[14px]" />
            </button>
          </form>
        </div>

      </div>
    </aside>
  )
}
