import { createClient } from '@/utils/supabase/server'
import { CreateArticleForm } from '@/components/admin-create-article-form'
import { AdminArticleList } from '@/components/admin-article-list'

export default async function ArticlesPage() {
    const supabase = await createClient()

    // Fetch users for the dropdown
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'admin')
        .order('email', { ascending: true })

    // 1. Fetch assigned articles (Created by Admin)
    const { data: articles } = await supabase
        .from('articles')
        .select('*, profiles(email, full_name)')
        .order('created_at', { ascending: false })

    // 2. Fetch user tasks (Created by Users)
    const { data: tasks } = await supabase
        .from('tasks')
        .select('*, profiles(email, full_name)')
        .order('created_at', { ascending: false })

    // 3. Merge and Normalize Data
    // We want a unified list of display items

    const formattedArticles = articles?.map(a => ({
        id: a.id,
        created_at: a.created_at,
        title: a.title,
        contentPreview: a.content,
        createdBy: 'Admin',
        assigneeEmail: a.profiles?.email,
        authorEmail: 'Admin', // Technically admin created it
        type: 'assignment' as const,
        original: a
    })) || []

    const formattedTasks = tasks?.map(t => ({
        id: t.id,
        created_at: t.created_at,
        title: t.title,
        contentPreview: t.description, // tasks use description/content field
        createdBy: t.profiles?.full_name || t.profiles?.email || 'User',
        assigneeEmail: 'Self',
        authorEmail: t.profiles?.email,
        type: 'summary' as const,
        original: t
    })) || []

    const allItems = [...formattedArticles, ...formattedTasks].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold text-white border-b border-white/10 pb-4">Article Management</h1>

            {/* Top Section: Create Assignment */}
            <section className="p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6">Create New Assignment</h2>
                <CreateArticleForm users={users || []} />
            </section>

            {/* Bottom Section: Article List */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Articles List</h2>
                    <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        {allItems.length} Total Items
                    </span>
                </div>

                <AdminArticleList items={allItems} />
            </section>
        </div>
    )
}
