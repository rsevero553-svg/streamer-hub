export interface Guide {
  id: string; app_id: string | null; title: string; summary: string | null
  content: string | null; cover_url: string | null; telegram_url: string | null
  is_general: boolean; is_active: boolean; sort_order: number; created_at: string
  is_install_guide: boolean; daily_time_estimate: string | null; app_mode: string | null
}
