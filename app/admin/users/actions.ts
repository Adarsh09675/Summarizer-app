'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleBlockUser(userId: string, isBlocked: boolean) {
    const supabase = await createClient()

    // Verify admin status
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({ is_blocked: !isBlocked })
        .eq('id', userId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/users')
}

export async function toggleUserRole(userId: string) {
    const supabase = await createClient()

    // Verify admin status
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Check if requester is admin
    const { data: requesterProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (requesterProfile?.role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    // Fetch target user's current role
    const { data: targetProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

    if (!targetProfile) return { error: 'User not found' }

    const newRole = targetProfile.role === 'admin' ? 'user' : 'admin'

    const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/users')
}
