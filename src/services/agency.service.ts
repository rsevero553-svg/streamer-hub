import { supabase } from './supabase'
import type { Profile } from '@/types/user'
import type { AppEntity, Gender } from '@/types/application'

export async function fetchAgencyBySlug(slug: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('agency_slug', slug).eq('role', 'moderator').maybeSingle()
  return (data as Profile) ?? null
}

export async function fetchAgencyApps(moderatorId: string, gender?: Gender) {
  let query = supabase.from('apps').select('*').eq('owner_id', moderatorId).eq('status', 'active').order('sort_order')
  if (gender) query = query.eq('gender', gender)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as AppEntity[]
}
