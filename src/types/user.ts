export type UserRole = 'user' | 'admin'
export type Gender = 'women' | 'men'

export interface Profile {
  id: string; full_name: string; phone: string; email: string | null
  gender: Gender | null; role: UserRole; avatar_url: string | null
  is_active: boolean; created_at: string
}
