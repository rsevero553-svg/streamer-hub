export interface SocialLink {
  id: string; platform: string; label: string | null; url: string
  icon: string | null; position: 'left' | 'right'; is_active: boolean; sort_order: number
}
export interface PlatformSetting {
  id: string; setting_key: string; setting_value: string | null
  description: string | null; is_public: boolean
}
export type LoadState = 'idle' | 'loading' | 'success' | 'empty' | 'error'
