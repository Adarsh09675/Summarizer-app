'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateSummary } from '@/utils/gemini'

export type ActionState = {
    error?: string
    message?: string
    success: boolean
}

export async function summarizeArticle(prevState: any, formData: FormData): Promise<ActionState> {
    const supabase = await createClient()
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!title || !description) {
        return { error: 'Title and description are required', success: false }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'You must be logged in', success: false }
    }

    // Mock Summarization Logic
    // In a real app, you would call an AI API here.
    // const mockSummary = `AI Summary of "${title}": 
    // 
    // ${description.slice(0, 100)}...
    // 
    // (This is a simulated summary. The system processed the content and generated this concise overview.)`

    // Use Gemini
    console.log("Calling generateSummary...");
    const summary = await generateSummary(description);
    console.log("Summary result:", summary.slice(0, 50) + "...");

    // Check if summary generation failed (simple check for failure prefix)
    if (summary.startsWith("Failed to generate summary") || summary.startsWith("Summary can't be created")) {
        console.error("Summary generation failed condition met.");
        return { error: 'Summary can\'t be created at this moment', success: false }
    }

    console.log("Inserting task into Supabase...");
    const { error } = await supabase.from('tasks').insert({
        title,
        description,
        summary: summary,
        is_completed: true, // Mark as completed since summary is generated
        user_id: user.id
    })

    if (error) {
        console.error("Supabase Insert Error:", error);
        return { error: 'Summary can\'t be created at this moment', success: false }
    }

    console.log("Task inserted successfully.");
    revalidatePath('/')
    return { success: true, message: 'Summary is created successfully' }
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
