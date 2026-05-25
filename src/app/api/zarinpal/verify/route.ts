import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ZARINPAL_MERCHANT = process.env.ZARINPAL_MERCHANT_ID!
const AMOUNT = 14900000

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const authority = searchParams.get('Authority')
  const status = searchParams.get('Status')

  if (status !== 'OK' || !authority) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/upgrade?status=failed`)
  }

  try {
    const res = await fetch('https://api.zarinpal.com/pg/v4/payment/verify.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: ZARINPAL_MERCHANT,
        amount: AMOUNT,
        authority,
      }),
    })

    const data = await res.json()

    if (data.data?.code === 100 || data.data?.code === 101) {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 1)

        await supabase.from('profiles').update({
          plan: 'pro',
          plan_expires_at: expiresAt.toISOString(),
        }).eq('id', user.id)
      }

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`)
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/upgrade?status=failed`)
  } catch {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/upgrade?status=error`)
  }
}
