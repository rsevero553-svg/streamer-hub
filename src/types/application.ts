export type Gender = 'women' | 'men'
export type AppStatus = 'active' | 'inactive' | 'pending'
export type LinkType = 'android' | 'ios' | 'website' | 'download' | 'other'
export type ContactType = 'whatsapp' | 'telegram' | 'email' | 'other'

export interface AppEntity {
  id: string
  name: string
  slug: string
  description: string | null
  gender: Gender
  logo_url: string | null
  banner_url: string | null
  status: AppStatus
  agency_required: boolean
  withdrawal_type: string | null
  withdrawal_policy: string | null
  general_policy: string | null
  sort_order: number
  featured?: boolean
  target_audience: string | null
  minimum_age: number | null
  available_countries: string[] | null
  points_system: string | null
  last_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface AppActivity {
  id: string; app_id: string; name: string; description: string | null
  reward_value: number; reward_unit: string; is_active: boolean; sort_order: number
}

export interface WithdrawalMethod {
  id: string; app_id: string; name: string; description: string | null
  minimum_amount: number | null; maximum_amount: number | null
  frequency: string | null; processing_time: string | null; fee: string | null
  requirements: string | null; is_active: boolean
}

export interface Agency {
  id: string; app_id: string; name: string; description: string | null
  requirements: string | null; registration_instructions: string | null; is_active: boolean
}

export interface AgencyCode {
  id: string; app_id: string; agency_id: string | null; code: string
  description: string | null; is_copyable: boolean; is_active: boolean
}

export interface AppContact {
  id: string; app_id: string; type: ContactType; title: string; url: string
  description: string | null; is_active: boolean; sort_order: number
}

export interface AppLink {
  id: string; app_id: string; type: LinkType; title: string; url: string
  is_active: boolean; sort_order: number
}

export interface AppDetail extends AppEntity {
  activities: AppActivity[]
  withdrawal_methods: WithdrawalMethod[]
  agencies: Agency[]
  agency_codes: AgencyCode[]
  contacts: AppContact[]
  links: AppLink[]
}
