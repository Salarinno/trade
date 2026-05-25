import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CheckoutButton } from '@/components/upgrade/CheckoutButton'

const FEATURES = [
  { label: 'تعداد معاملات در ماه', free: '۲۰ معامله', pro: 'نامحدود' },
  { label: 'آمار پایه', free: true, pro: true },
  { label: 'Equity Curve', free: false, pro: true },
  { label: 'مدیریت ریسک', free: false, pro: true },
  { label: 'روانشناسی ترید', free: false, pro: true },
  { label: 'تحلیل بر اساس نماد', free: false, pro: true },
  { label: 'تحلیل بر اساس موود', free: false, pro: true },
  { label: 'خروجی PDF / Excel', free: false, pro: true },
  { label: 'پشتیبانی اولویت‌دار', free: false, pro: true },
]

export default async function UpgradePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
  const isPro = profile?.plan === 'pro'

  return (
    <div dir="rtl">
      <div className="sticky top-0 z-10 px-6 py-3.5 border-b border-border bg-bg/95 backdrop-blur">
        <h1 className="text-[14px] font-medium">ارتقا به Pro</h1>
      </div>

      <div className="max-w-3xl mx-auto p-6">

        {isPro && (
          <div className="bg-green/[0.08] border border-green/20 rounded-md px-4 py-3 mb-6 text-sm text-green font-mono">
            ✓ شما در حال حاضر پلن Pro دارید
          </div>
        )}

        {/* Plans */}
        <div className="grid grid-cols-2 gap-4 mb-8">

          {/* Free */}
          <div className="bg-bg-1 border border-border rounded-md p-5">
            <div className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-3">Free</div>
            <div className="font-mono text-3xl text-text-primary mb-1">۰</div>
            <div className="text-sm text-text-muted mb-5">تومان — همیشه رایگان</div>
            <div className="bg-bg-2 border border-border text-text-muted text-sm text-center py-2 rounded">
              پلن فعلی شما
            </div>
          </div>

          {/* Pro */}
          <div className="bg-bg-1 border-2 border-green/40 rounded-md p-5 relative">
            <div className="absolute -top-3 right-5 bg-green text-black text-[10px] font-mono font-medium px-3 py-1 rounded-full">
              پرطرفدار
            </div>
            <div className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-3">Pro</div>
            <div>
              <span className="font-mono text-3xl text-text-primary">۱۴۹,۰۰۰</span>
              <span className="text-sm text-text-muted mr-2">تومان / ماه</span>
            </div>
            <div className="text-[11px] text-text-muted mb-5 mt-1">یا ۱,۲۴۰,۰۰۰ تومان / سال (۳۰٪ تخفیف)</div>
            {!isPro
              ? <CheckoutButton />
              : <div className="bg-green/[0.1] border border-green/20 text-green text-sm text-center py-2 rounded">
                  ✓ فعال
                </div>
            }
          </div>
        </div>

        {/* Feature comparison */}
        <div className="bg-bg-1 border border-border rounded-md overflow-hidden">
          <div className="px-4 py-3 border-b border-border text-[13px] font-medium">مقایسه پلن‌ها</div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-2">
                <th className="px-4 py-2 text-right font-mono text-[9px] text-text-muted uppercase tracking-widest">امکانات</th>
                <th className="px-4 py-2 text-center font-mono text-[9px] text-text-muted uppercase tracking-widest">رایگان</th>
                <th className="px-4 py-2 text-center font-mono text-[9px] text-green uppercase tracking-widest">Pro</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, i) => (
                <tr key={f.label} className={i < FEATURES.length - 1 ? 'border-b border-border' : ''}>
                  <td className="px-4 py-2.5 text-sm text-text-secondary">{f.label}</td>
                  <td className="px-4 py-2.5 text-center font-mono text-[12px]">
                    {typeof f.free === 'boolean'
                      ? f.free ? <span className="text-green">✓</span> : <span className="text-text-muted">—</span>
                      : <span className="text-text-secondary">{f.free}</span>}
                  </td>
                  <td className="px-4 py-2.5 text-center font-mono text-[12px]">
                    {typeof f.pro === 'boolean'
                      ? f.pro ? <span className="text-green">✓</span> : <span className="text-text-muted">—</span>
                      : <span className="text-green">{f.pro}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
