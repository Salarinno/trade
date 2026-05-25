import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import type { User } from '@/types'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single()

  const user: User = profile || {
    id: authUser.id,
    email: authUser.email!,
    full_name: authUser.user_metadata?.full_name || 'کاربر',
    plan: 'free',
    created_at: authUser.created_at,
  }

  return (
    <div className="min-h-screen bg-bg" dir="rtl">
      <Sidebar user={user} />
      <main className="mr-[200px] min-h-screen">
        {children}
      </main>
    </div>
  )
}
