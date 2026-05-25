import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditTradeForm } from './EditTradeForm'

export default async function EditTradePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: trade } = await supabase.from('trades').select('*').eq('id', params.id).single()
  if (!trade) notFound()
  return <EditTradeForm trade={trade} />
}
