import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const userObj = profile || {
    id: user.id,
    email: user.email!,
    full_name: user.user_metadata?.full_name || 'کاربر',
    plan: 'free',
    created_at: user.created_at,
  }

  return (
    <div className="min-h-screen bg-bg" dir="rtl">
      <Sidebar user={userObj} />
      <main className="mr-[200px] min-h-screen">{children}</main>
    </div>
  )
}
