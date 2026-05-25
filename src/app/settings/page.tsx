import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsForm } from '@/components/settings/SettingsForm'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  return (
    <div dir="rtl">
      <div className="sticky top-0 z-10 px-6 py-3.5 border-b border-border bg-bg/95 backdrop-blur">
        <h1 className="text-[14px] font-medium">تنظیمات</h1>
      </div>
      <div className="max-w-xl mx-auto p-6">
        <SettingsForm profile={profile} />
      </div>
    </div>
  )
}
