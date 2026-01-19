import { createClient } from '@/utils/supabase/server'
import { ArticleForm } from './article-form'

export default async function CreateArticlePage() {
    const supabase = await createClient()
    const { data: users } = await supabase
        .from('profiles')
        .select('id, email')
        .order('email')

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">Create New Article</h1>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
                <ArticleForm users={users} />
            </div>
        </div>
    )
}

