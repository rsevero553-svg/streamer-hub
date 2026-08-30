export type UserRole = 'user' | 'admin' | 'moderator'
export type Gender = 'women' | 'men'
export type MembershipStatus = 'none' | 'pending_review' | 'paid' | 'overdue'

export interface Profile {
  id: string
  full_name: string
  phone: string
  email: string | null
  gender: Gender | null
  role: UserRole
  avatar_url: string | null
  is_active: boolean
  agency_name: string | null
  agency_slug: string | null
  agency_logo_url: string | null
  moderator_whatsapp: string | null
  moderator_instagram: string | null
  moderator_telegram: string | null
  membership_status: MembershipStatus
  membership_expires_at: string | null
  referred_by: string | null
  created_at: string
}

export interface MembershipPayment {
  id: string
  moderator_id: string
  amount: number
  currency: string
  status: 'pending_review' | 'confirmed' | 'rejected'
  claimed_at: string
  confirmed_at: string | null
  confirmed_by: string | null
  notes: string | null
}
