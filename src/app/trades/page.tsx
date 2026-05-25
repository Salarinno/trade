import { createClient } from '@/lib/supabase/server'
import { TradesTable } from '@/components/dashboard/TradesTable'
import Link from 'next/link'

export default async function TradesPage() {
  const supabase = createClient()
  const { data: trades = [] } = await supabase
    .from('trades')
    .select('*')
    .order('opened_at', { ascending: false })

  return (
    <div dir="rtl">
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 border-b border-border bg-bg/95 backdrop-blur">
        <h1 className="text-[14px] font-medium">معاملاتم</h1>
        <Link
          href="/trades/new"
          className="flex items-center gap-1.5 bg-green text-black text-[12px] font-medium px-3.5 py-1.5 rounded hover:opacity-85 transition-opacity"
        >
          <i className="ti ti-plus text-[14px]" />
          معامله جدید
        </Link>
      </div>
      <div className="p-6">
        <div className="bg-bg-1 border border-border rounded-md overflow-hidden">
          <TradesTable trades={trades || []} />
        </div>
      </div>
    </div>
  )
}
