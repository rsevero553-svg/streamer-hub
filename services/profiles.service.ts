import { supabase } from './supabase'
import type { Profile } from '@/types/user'

export async function fetchOwnProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) return null
  return data as Profile
}

export async function updateOwnProfile(userId: string, patch: Partial<Profile>) {
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', userId).select().single()
  if (error) throw error
  return data as Profile
}
