'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createArticle } from '@/app/admin/articles/actions'

const initialState = {
    error: null as string | null,
    message: null as string | null
}

export function CreateArticleForm({ users }: { users: any[] }) {
    const [state, formAction] = useActionState(createArticle, initialState)

    return (
        <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm text-gray-300">Article Title</label>
                    <Input name="title" required placeholder="Enter article title" className="bg-white/10 border-white/20 text-white h-12" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-300">Assign To User</label>
                    <select name="user_id" required className="w-full h-12 rounded-md border border-white/20 bg-white/10 px-3 text-sm text-white focus:ring-2 focus:ring-blue-500">
                        <option value="" className="bg-gray-900">Select a user...</option>
                        {users?.map(u => (
                            <option key={u.id} value={u.id} className="bg-gray-900">
                                {u.email} ({u.full_name || 'No Name'})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2 h-full flex flex-col">
                    <label className="text-sm text-gray-300">Content / Description</label>
                    <textarea
                        name="content"
                        required
                        placeholder="Paste the full article content or description here..."
                        className="flex-1 w-full rounded-md border border-white/20 bg-white/10 p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                    />
                </div>
            </div>

            <div className="md:col-span-2 pt-4">
                {state?.error && (
                    <div className="text-red-400 text-sm mb-4 bg-red-900/20 p-3 rounded-lg border border-red-500/20">
                        Error: {state.error}
                    </div>
                )}
                <Button type="submit" className="w-full md:w-auto md:min-w-[200px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3">
                    Assign Article
                </Button>
            </div>
        </form>
    )
}
