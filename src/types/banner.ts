export interface Banner {
  id: string; title: string | null; subtitle: string | null; image_url: string
  link_url: string | null; button_text: string | null; status: 'active' | 'inactive'
  sort_order: number; starts_at: string | null; ends_at: string | null
}
