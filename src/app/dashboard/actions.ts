'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function requireClient() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, client_id')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'client' || !profile.client_id) redirect('/admin')

  return { user, clientId: profile.client_id as string }
}

export async function updateBusinessDetailsAction(
  prevState: { error: string | null; success?: boolean },
  formData: FormData
) {
  const { clientId } = await requireClient()

  const name = String(formData.get('name') || '').trim()
  const website = String(formData.get('website') || '').trim()
  const contactEmail = String(formData.get('contact_email') || '').trim()
  const notificationEmail = String(formData.get('notification_email') || '').trim()
  const bookingUrl = String(formData.get('booking_url') || '').trim()

  if (!name) {
    return { error: 'Business name is required.' }
  }

  const admin = createAdminClient()

  const { error } = await admin
    .from('clients')
    .update({
      name,
      website: website || null,
      contact_email: contactEmail || null,
      notification_email: notificationEmail || null,
      booking_url: bookingUrl || null,
    })
    .eq('id', clientId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/settings')
  return { error: null, success: true }
}

export async function updatePasswordAction(
  prevState: { error: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const password = String(formData.get('password') || '')
  const confirmPassword = String(formData.get('confirm_password') || '')

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' }
  }
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  return { error: null, success: true }
}
