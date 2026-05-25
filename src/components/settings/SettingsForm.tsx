'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  profile: { full_name: string; email: string; plan: string; plan_expires_at?: string } | null
}

export function SettingsForm({ profile }: Props) {
  const [name, setName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleSave() {
    setSaving(true)
    setMsg('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('profiles')
      .update({ full_name: name }).eq('id', user.id)

    setMsg(error ? 'خطا در ذخیره' : 'ذخیره شد ✓')
    setSaving(false)
  }

  const inputCls = 'w-full bg-bg-2 border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-border-2 transition-colors'
  const labelCls = 'font-mono text-[10px] text-text-muted tracking-widest uppercase mb-1.5 block'

  return (
    <div className="flex flex-col gap-5">

      {/* Profile */}
      <div className="bg-bg-1 border border-border rounded-md p-5">
        <div className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-4">پروفایل</div>
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>نام کامل</label>
            <input value={name} onChange={e => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>ایمیل</label>
            <input value={profile?.email || ''} disabled className={inputCls + ' opacity-50 cursor-not-allowed'} dir="ltr" />
          </div>
          <button onClick={handleSave} disabled={saving}
            className="bg-green text-black font-medium text-sm py-2 rounded hover:opacity-85 disabled:opacity-50 transition-opacity w-fit px-6">
            {saving ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
          {msg && <div className="text-sm text-green font-mono">{msg}</div>}
        </div>
      </div>

      {/* Plan */}
      <div className="bg-bg-1 border border-border rounded-md p-5">
        <div className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-4">پلن</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-sm text-text-primary uppercase">{profile?.plan || 'free'}</div>
            {profile?.plan_expires_at && (
              <div className="text-xs text-text-muted mt-1">
                انقضا: {new Date(profile.plan_expires_at).toLocaleDateString('fa-IR')}
              </div>
            )}
          </div>
          {profile?.plan !== 'pro' && (
            <a href="/upgrade"
              className="bg-green text-black text-xs font-medium px-4 py-2 rounded hover:opacity-85 transition-opacity">
              ارتقا به Pro
            </a>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-bg-1 border border-red-trade/20 rounded-md p-5">
        <div className="font-mono text-[10px] text-red-trade uppercase tracking-widest mb-3">منطقه خطر</div>
        <p className="text-sm text-text-secondary mb-4">با حذف حساب، تمام معاملات و اطلاعات شما به صورت دائمی حذف خواهد شد.</p>
        <button className="border border-red-trade/40 text-red-trade text-sm px-4 py-2 rounded hover:bg-red-trade/10 transition-all">
          حذف حساب کاربری
        </button>
      </div>

    </div>
  )
}
