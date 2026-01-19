'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export async function login(prevState: any, formData: FormData): Promise<{ error: string | null }> {
    const supabase = await createClient()

    // validate data
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const result = loginSchema.safeParse(data)
    if (!result.success) {
        return { error: 'Invalid email or password format' }
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')

    // Check if user is blocked
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_blocked')
            .eq('id', user.id)
            .single()

        if (profile?.is_blocked) {
            await supabase.auth.signOut()
            return { error: 'Your account has been blocked. Please contact support.' }
        }
    }

    redirect('/')
}

export async function signup(prevState: any, formData: FormData): Promise<{ error: string | null }> {
    const supabase = await createClient()

    const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const result = signupSchema.safeParse(data)
    if (!result.success) {
        return { error: result.error.issues[0].message }
    }

    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                full_name: data.name,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
