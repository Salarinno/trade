'use client'

import { useState } from 'react'

export function CheckoutButton() {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    const res = await fetch('/api/zarinpal/create', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('خطا در اتصال به درگاه پرداخت')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-green text-black font-medium text-sm py-2.5 rounded hover:opacity-85 disabled:opacity-50 transition-opacity"
    >
      {loading ? 'در حال انتقال...' : 'خرید Pro ↗'}
    </button>
  )
}
