'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const articleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    summary: z.string().optional(),
    user_id: z.string().uuid("Invalid user selected"),
})

// Define the state type for the form
type ArticleFormState = {
    error: string | null
    message: string | null
}

export async function createArticle(prevState: any, formData: FormData): Promise<ArticleFormState> {
    const supabase = await createClient()

    const data = {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        summary: formData.get('summary')?.toString() || undefined,
        user_id: formData.get('user_id') as string,
    }

    const result = articleSchema.safeParse(data)
    if (!result.success) {
        console.error('Validation error:', result.error)
        const errorMessage = result.error.issues?.[0]?.message || result.error.message || "Invalid input data"
        return { error: errorMessage, message: null }
    }

    const { error } = await supabase
        .from('articles')
        .insert(data)

    if (error) {
        return { error: error.message, message: null }
    }

    revalidatePath('/admin/articles')
    return { error: null, message: 'Article created successfully' }
}

export async function deleteArticle(articleId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId)

    if (error) {
        return { error: error.message }
    }
    revalidatePath('/admin/articles')
}

export async function updateArticle(id: string, formData: FormData) {
    const supabase = await createClient()

    const data = {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        summary: formData.get('summary')?.toString() || undefined,
    }

    const { error } = await supabase
        .from('articles')
        .update(data)
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/articles')
}

// ----------------------------------------------------------------------
// Task Management (Admin actions on User Tasks)
// ----------------------------------------------------------------------

export async function adminDeleteTask(taskId: string) {
    const supabase = await createClient()

    // RLS policy "Admins can do everything on tasks" will handle permission check
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

    if (error) {
        return { error: error.message }
    }
    revalidatePath('/admin/articles')
}

export async function adminUpdateTask(taskId: string, formData: FormData) {
    const supabase = await createClient()

    const data = {
        title: formData.get('title') as string,
        description: formData.get('description') as string, // tasks table uses 'description' not 'content'
        summary: formData.get('summary')?.toString() || undefined,
    }

    const { error } = await supabase
        .from('tasks')
        .update(data)
        .eq('id', taskId)

    if (error) {
        return { error: error.message }
    }
    revalidatePath('/admin/articles')
}
