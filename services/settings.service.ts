import { supabase } from './supabase'

export async function fetchPublicSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('platform_settings').select('setting_key, setting_value').eq('is_public', true)
  if (error) throw error
  const map: Record<string, string> = {}
  for (const row of data ?? []) {
    if (row.setting_value !== null) map[row.setting_key] = row.setting_value
  }
  return map
}
