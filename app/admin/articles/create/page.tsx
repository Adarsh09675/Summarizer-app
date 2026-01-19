import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createArticle } from '../actions'

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
                <form action={createArticle} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-200">
                            Title
                        </label>
                        <Input
                            id="title"
                            name="title"
                            required
                            className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Article Title"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="user_id" className="block text-sm font-medium text-gray-200">
                            Assign to User
                        </label>
                        <select
                            id="user_id"
                            name="user_id"
                            required
                            className="flex h-10 w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                        >
                            <option value="" className="bg-gray-900">Select a user...</option>
                            {users?.map((user) => (
                                <option key={user.id} value={user.id} className="bg-gray-900">
                                    {user.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-200">
                            Summary
                        </label>
                        <textarea
                            id="summary"
                            name="summary"
                            rows={3}
                            className="flex min-h-[80px] w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                            placeholder="Brief summary of the article..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-200">
                            Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            required
                            rows={10}
                            className="flex min-h-[80px] w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                            placeholder="Full content of the article..."
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Create Article
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
