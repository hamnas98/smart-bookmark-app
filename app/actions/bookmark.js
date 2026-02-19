"use server";

import { createClient } from "../../lib/supabase/server";

export async function addBookmark(formData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Not authenticated' }

  const title = formData.get('title')?.toString().trim()
  const url = formData.get('url')?.toString().trim()

  if (!title || !url) return { error: 'Title and URL are required' }

  try { new URL(url) } catch { return { error: 'Please enter a valid URL (include https://)' } }

  const { error } = await supabase
    .from('bookmarks')
    .insert({ title, url, user_id: user.id })

  if (error) return { error: 'Failed to add bookmark. Please try again.' }

  // ← revalidatePath REMOVED — realtime handles the UI update
  return { success: true }
}

export async function editBookmark(id, formData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Not authenticated' }

  const title = formData.get('title')?.toString().trim()
  const url = formData.get('url')?.toString().trim()

  if (!title || !url) return { error: 'Title and URL are required' }

  try { new URL(url) } catch { return { error: 'Please enter a valid URL (include https://)' } }

  const { error } = await supabase
    .from('bookmarks')
    .update({ title, url, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Failed to update bookmark. Please try again.' }

  // ← revalidatePath REMOVED
  return { success: true }
}

export async function deleteBookmark(id) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Failed to delete bookmark. Please try again.' }

  // ← revalidatePath REMOVED
  return { success: true }
}
