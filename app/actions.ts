'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function summarizeArticle(formData: FormData) {
    const supabase = await createClient()
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!title || !description) {
        return { error: 'Title and description are required' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'You must be logged in' }
    }

    // Mock Summarization Logic
    // In a real app, you would call an AI API here.
    const mockSummary = `AI Summary of "${title}": 
    
    ${description.slice(0, 100)}...
    
    (This is a simulated summary. The system processed the content and generated this concise overview.)`

    const { error } = await supabase.from('tasks').insert({
        title,
        description,
        summary: mockSummary,
        is_completed: true, // Mark as completed since summary is generated
        user_id: user.id
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
}

export async function deleteTask(taskId: string) {
    const supabase = await createClient()
    await supabase.from('tasks').delete().eq('id', taskId)
    revalidatePath('/')
}

export async function toggleTask(taskId: string, isCompleted: boolean) {
    const supabase = await createClient()
    await supabase.from('tasks').update({ is_completed: !isCompleted }).eq('id', taskId)
    revalidatePath('/')
}
