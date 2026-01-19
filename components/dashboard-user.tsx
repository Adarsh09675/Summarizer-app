import { createClient } from '@/utils/supabase/server'
import { UserDashboardClient } from '@/components/dashboard-user-client'

export async function UserDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch Summaries (Tasks)
    const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // Fetch Assigned Articles
    const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return <UserDashboardClient tasks={tasks || []} articles={articles || []} />
}
