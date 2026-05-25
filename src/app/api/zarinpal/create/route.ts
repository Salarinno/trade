import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ZARINPAL_MERCHANT = process.env.ZARINPAL_MERCHANT_ID!
const AMOUNT = 14900000 // ۱۴۹,۰۰۰ تومان = ۱۴۹۰۰۰۰۰ ریال
const CALLBACK_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/zarinpal/verify`

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const res = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: ZARINPAL_MERCHANT,
        amount: AMOUNT,
        description: 'اشتراک Pro ماهانه TradeLog',
        callback_url: CALLBACK_URL,
        metadata: { email: user.email, user_id: user.id },
      }),
    })

    const data = await res.json()

    if (data.data?.code === 100) {
      const authority = data.data.authority
      const url = `https://www.zarinpal.com/pg/StartPay/${authority}`
      return NextResponse.json({ url })
    }

    return NextResponse.json({ error: 'خطای درگاه پرداخت' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
