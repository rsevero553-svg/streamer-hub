import { supabase } from './supabase'
import type { AppEntity, AppDetail, Gender } from '@/types/application'

export async function fetchApps(gender?: Gender) {
  let query = supabase
    .from('apps')
    .select('*')
    .eq('status', 'active')
    .order('sort_order', { ascending: true })

  if (gender) query = query.eq('gender', gender)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as AppEntity[]
}

export async function fetchFeaturedApps() {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .eq('status', 'active')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(8)
  if (error) throw error
  return (data ?? []) as AppEntity[]
}

export async function fetchAppBySlug(slug: string): Promise<AppDetail | null> {
  const { data: app, error } = await supabase
    .from('apps')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !app) return null

  const [activities, withdrawal_methods, agencies, agency_codes, contacts, links, currency_conversions, income_sources] = await Promise.all([
    supabase.from('app_activities').select('*').eq('app_id', app.id).eq('is_active', true).order('sort_order'),
    supabase.from('app_withdrawal_methods').select('*').eq('app_id', app.id).eq('is_active', true),
    supabase.from('app_agencies').select('*').eq('app_id', app.id).eq('is_active', true),
    supabase.from('app_agency_codes').select('*').eq('app_id', app.id).eq('is_active', true),
    supabase.from('app_contacts').select('*').eq('app_id', app.id).eq('is_active', true).order('sort_order'),
    supabase.from('app_links').select('*').eq('app_id', app.id).eq('is_active', true).order('sort_order'),
    supabase.from('app_currency_conversions').select('*').eq('app_id', app.id).eq('is_active', true),
    supabase.from('app_income_sources').select('*').eq('app_id', app.id).eq('is_active', true).order('sort_order')
  ])

  return {
    ...app,
    activities: activities.data ?? [],
    withdrawal_methods: withdrawal_methods.data ?? [],
    agencies: agencies.data ?? [],
    agency_codes: agency_codes.data ?? [],
    contacts: contacts.data ?? [],
    links: links.data ?? [],
    currency_conversions: currency_conversions.data ?? [],
    income_sources: income_sources.data ?? []
  } as AppDetail
}
