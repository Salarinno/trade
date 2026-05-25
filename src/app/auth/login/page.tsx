'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('ایمیل یا رمز عبور اشتباه است')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-mono text-green text-lg tracking-widest mb-1">
            Trade<span className="text-text-muted">//</span>Log
          </div>
          <p className="text-text-secondary text-sm">ورود به حساب کاربری</p>
        </div>
        <div className="bg-bg-1 border border-border rounded-lg p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-text-muted tracking-widest uppercase">ایمیل</label>
              <input name="email" type="email" required placeholder="example@email.com"
                className="bg-bg-2 border border-border rounded px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-2 transition-colors"
                dir="ltr" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-text-muted tracking-widest uppercase">رمز عبور</label>
              <input name="password" type="password" required placeholder="••••••••"
                className="bg-bg-2 border border-border rounded px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-2 transition-colors"
                dir="ltr" />
            </div>
            {error && (
              <div className="bg-red-trade/10 border border-red-trade/20 rounded px-3 py-2 text-sm text-red-trade">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="bg-green text-black font-medium text-sm py-2.5 rounded transition-opacity hover:opacity-85 disabled:opacity-50 mt-1">
              {loading ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-text-secondary mt-4">
          حساب ندارید؟{' '}
          <Link href="/auth/register" className="text-green hover:opacity-80">ثبت‌نام رایگان</Link>
        </p>
      </div>
    </div>
  )
}
