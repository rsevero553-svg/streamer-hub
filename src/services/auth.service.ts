import { supabase } from './supabase'

export async function resolveReferrerBySlug(slug: string): Promise<string | null> {
  const { data } = await supabase.from('profiles').select('id').eq('agency_slug', slug).eq('role', 'moderator').maybeSingle()
  return data?.id ?? null
}

export async function signUp(params: { fullName: string; phone: string; email: string; password: string; gender?: 'women' | 'men'; referredBy?: string | null }) {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        full_name: params.fullName,
        phone: params.phone,
        gender: params.gender ?? null,
        referred_by: params.referredBy ?? null
      }
    }
  })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
}
