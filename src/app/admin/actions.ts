'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function requireAdmin() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard')
}

function generateSecret() {
  return randomBytes(24).toString('hex')
}

export async function createClientAction(prevState: { error: string | null }, formData: FormData) {
  await requireAdmin()

  const name = String(formData.get('name') || '').trim()
  const website = String(formData.get('website') || '').trim()
  const industry = String(formData.get('industry') || '').trim()
  const country = String(formData.get('country') || '').trim()
  const contactEmail = String(formData.get('contact_email') || '').trim()
  const loginEmail = String(formData.get('login_email') || '').trim()
  const loginPassword = String(formData.get('login_password') || '').trim()
  const assistantName = String(formData.get('assistant_name') || '').trim()
  const assistantUrl = String(formData.get('assistant_url') || '').trim()
  const monthlyFee = Number(formData.get('monthly_fee') || 79)
  const setupFee = Number(formData.get('setup_fee') || 999)

  if (!name || !loginEmail || !loginPassword) {
    return { error: 'Business name, login email, and login password are required.' }
  }

  const admin = createAdminClient()

  const { data: newClient, error: clientError } = await admin
    .from('clients')
    .insert({
      name,
      website: website || null,
      industry: industry || null,
      country: country || null,
      contact_email: contactEmail || null,
      status: 'active',
      monthly_fee: monthlyFee,
      setup_fee: setupFee,
      currency: 'USD',
    })
    .select()
    .single()

  if (clientError || !newClient) {
    return { error: clientError?.message || 'Could not create client.' }
  }

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email: loginEmail,
    password: loginPassword,
    email_confirm: true,
  })

  if (authError || !authUser.user) {
    return { error: authError?.message || 'Could not create the client login.' }
  }

  const { error: profileError } = await admin.from('profiles').insert({
    id: authUser.user.id,
    email: loginEmail,
    role: 'client',
    client_id: newClient.id,
  })

  if (profileError) {
    return { error: profileError.message }
  }

  const { error: connectionError } = await admin.from('assistant_connections').insert({
    client_id: newClient.id,
    assistant_name: assistantName || `${name} Assistant`,
    assistant_url: assistantUrl || null,
    status: 'pending',
    ingest_secret: generateSecret(),
  })

  if (connectionError) {
    return { error: connectionError.message }
  }

  const { error: subscriptionError } = await admin.from('subscriptions').insert({
    client_id: newClient.id,
    monthly_fee: monthlyFee,
    setup_fee: setupFee,
    currency: 'USD',
    status: 'ACTIVE',
  })

  if (subscriptionError) {
    return { error: subscriptionError.message }
  }

  revalidatePath('/admin')
  redirect(`/admin/clients/${newClient.id}`)
}

export async function regenerateSecretAction(connectionId: string, clientId: string) {
  await requireAdmin()

  const admin = createAdminClient()

  const { error } = await admin
    .from('assistant_connections')
    .update({ ingest_secret: generateSecret(), status: 'pending' })
    .eq('id', connectionId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/clients/${clientId}`)
}

export async function updateAssistantConnectionAction(
  connectionId: string,
  clientId: string,
  formData: FormData
) {
  await requireAdmin()

  const assistantName = String(formData.get('assistant_name') || '').trim()
  const assistantUrl = String(formData.get('assistant_url') || '').trim()

  const admin = createAdminClient()

  const { error } = await admin
    .from('assistant_connections')
    .update({
      assistant_name: assistantName || null,
      assistant_url: assistantUrl || null,
    })
    .eq('id', connectionId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/clients/${clientId}`)
}

export async function updateClientStatusAction(clientId: string, status: 'active' | 'inactive') {
  await requireAdmin()

  const admin = createAdminClient()

  const { error } = await admin.from('clients').update({ status }).eq('id', clientId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath(`/admin/clients/${clientId}`)
}
