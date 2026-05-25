'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-mono text-green-500 text-lg tracking-widest mb-1">
            Trade//Log
          </div>
          <p className="text-gray-400 text-sm">ورود به حساب کاربری</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest">ایمیل</label>
              <input name="email" type="email" required placeholder="example@email.com"
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none"
                dir="ltr" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest">رمز عبور</label>
              <input name="password" type="password" required placeholder="••••••••"
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none"
                dir="ltr" />
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button type="submit" disabled={loading}
              className="bg-green-500 text-black font-medium text-sm py-2.5 rounded hover:opacity-85 disabled:opacity-50">
              {loading ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          حساب ندارید؟{' '}
          <Link href="/auth/register" className="text-green-500">ثبت‌نام رایگان</Link>
        </p>
      </div>
    </div>
  )
}
