import { supabase } from './supabase'
import type { Guide } from '@/types/guide'

export async function fetchGuides(opts?: { appId?: string; generalOnly?: boolean }) {
  let query = supabase.from('app_guides').select('*').eq('is_active', true).order('sort_order')
  if (opts?.appId) query = query.eq('app_id', opts.appId)
  if (opts?.generalOnly) query = query.eq('is_general', true)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Guide[]
}

export async function fetchGuideById(id: string) {
  const { data, error } = await supabase.from('app_guides').select('*').eq('id', id).single()
  if (error) return null
  return data as Guide
}
