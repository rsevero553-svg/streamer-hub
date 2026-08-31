import { supabase } from './supabase'

export interface AppNotification {
  id: string
  sender_id: string | null
  scope: 'global' | 'moderator_broadcast' | 'admin_to_moderator'
  target_moderator_id: string | null
  title: string
  body: string
  type: string
  created_at: string
}

export async function fetchMyNotifications(): Promise<AppNotification[]> {
  const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(30)
  if (error) throw error
  return (data ?? []) as AppNotification[]
}

export async function sendGlobalNotification(title: string, body: string, type = 'general') {
  const { data: userData } = await supabase.auth.getUser()
  const { error } = await supabase.from('notifications').insert({
    sender_id: userData.user?.id, scope: 'global', target_moderator_id: null, title, body, type
  })
  if (error) throw error
}

export async function sendAdminToModeratorNotification(moderatorId: string, title: string, body: string, type = 'membership_warning') {
  const { data: userData } = await supabase.auth.getUser()
  const { error } = await supabase.from('notifications').insert({
    sender_id: userData.user?.id, scope: 'admin_to_moderator', target_moderator_id: moderatorId, title, body, type
  })
  if (error) throw error
}

export async function sendModeratorBroadcast(moderatorId: string, title: string, body: string, type = 'general') {
  const { error } = await supabase.from('notifications').insert({
    sender_id: moderatorId, scope: 'moderator_broadcast', target_moderator_id: moderatorId, title, body, type
  })
  if (error) throw error
}
