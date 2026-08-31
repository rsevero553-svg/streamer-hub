import { supabase } from './supabase'

export interface PayrollDocument {
  id: string
  uploaded_by: string | null
  scope: 'global' | 'moderator'
  moderator_id: string | null
  file_path: string
  file_name: string
  mime_type: string | null
  created_at: string
  expires_at: string
}

export async function fetchMyPayrollDocuments(): Promise<PayrollDocument[]> {
  const { data, error } = await supabase.from('payroll_documents').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as PayrollDocument[]
}

export async function uploadGlobalPayrollDocument(file: File) {
  const path = `global/${Date.now()}_${file.name}`
  const { error: uploadError } = await supabase.storage.from('payroll-docs').upload(path, file)
  if (uploadError) throw uploadError

  const { data: userData } = await supabase.auth.getUser()
  const { error } = await supabase.from('payroll_documents').insert({
    uploaded_by: userData.user?.id,
    scope: 'global',
    moderator_id: null,
    file_path: path,
    file_name: file.name,
    mime_type: file.type
  })
  if (error) throw error
}

export async function uploadModeratorPayrollDocument(moderatorId: string, file: File) {
  const path = `moderator/${moderatorId}/${Date.now()}_${file.name}`
  const { error: uploadError } = await supabase.storage.from('payroll-docs').upload(path, file)
  if (uploadError) throw uploadError

  const { error } = await supabase.from('payroll_documents').insert({
    uploaded_by: moderatorId,
    scope: 'moderator',
    moderator_id: moderatorId,
    file_path: path,
    file_name: file.name,
    mime_type: file.type
  })
  if (error) throw error
}

export async function getPayrollDownloadUrl(filePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from('payroll-docs').createSignedUrl(filePath, 60 * 5) // 5 minutos
  if (error) return null
  return data.signedUrl
}

export async function deletePayrollDocument(doc: PayrollDocument) {
  await supabase.storage.from('payroll-docs').remove([doc.file_path])
  await supabase.from('payroll_documents').delete().eq('id', doc.id)
}
