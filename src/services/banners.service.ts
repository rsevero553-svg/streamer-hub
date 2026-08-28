import { supabase } from './supabase'
import type { Banner } from '@/types/banner'

export async function fetchActiveBanners() {
  const nowIso = new Date().toISOString()
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('status', 'active')
    .order('sort_order')
  if (error) throw error
  return ((data ?? []) as Banner[]).filter(b => {
    if (b.starts_at && b.starts_at > nowIso) return false
    if (b.ends_at && b.ends_at < nowIso) return false
    return true
  })
}
