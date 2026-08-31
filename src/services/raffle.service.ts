import { supabase } from './supabase'

export async function fetchModeratorAppsForRaffle(moderatorId: string) {
  const { data, error } = await supabase.from('apps').select('id, name').eq('owner_id', moderatorId).eq('status', 'active')
  if (error) throw error
  return data ?? []
}

export async function fetchNextRaffleAvailability(moderatorId: string): Promise<string | null> {
  const { data } = await supabase
    .from('raffle_draws')
    .select('next_available_at')
    .eq('moderator_id', moderatorId)
    .order('next_available_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data?.next_available_at ?? null
}

export async function drawRaffleWinner(moderatorId: string) {
  const { data, error } = await supabase.rpc('draw_raffle_winner', { p_moderator_id: moderatorId })
  if (error) throw error
  return data as { winner_entry_id: string; winner_name: string; app_name: string }
}
