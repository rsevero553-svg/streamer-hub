import { supabase } from './supabase'
import type { SocialLink } from '@/types/misc'

export async function fetchSocialLinks() {
  const { data, error } = await supabase.from('social_links').select('*').eq('is_active', true).order('sort_order')
  if (error) throw error
  return (data ?? []) as SocialLink[]
}
