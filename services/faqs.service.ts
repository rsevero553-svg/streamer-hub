import { supabase } from './supabase'

export interface Faq {
  id: string
  question: string
  answer: string
  is_active: boolean
  sort_order: number
}

export async function fetchFaqs() {
  const { data, error } = await supabase.from('faqs').select('*').eq('is_active', true).order('sort_order')
  if (error) throw error
  return (data ?? []) as Faq[]
}
