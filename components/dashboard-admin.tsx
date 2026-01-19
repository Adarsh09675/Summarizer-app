import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toggleBlockUser, toggleUserRole } from '@/app/admin/users/actions'
import { CreateArticleForm } from '@/components/admin-create-article-form'

export async function AdminDashboard() {
    const supabase = await createClient()

    // 1. Fetch Users
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('role', { ascending: true }) // Show admins first (or users, depending on string sort)

    // 2. Fetch Articles (Simple list for now, or just the creation form? User asked for "assign article with title and description")
    // I'll assume they want to SEE assigned articles or just CREATE them.
    // Let's provide a list + creation form.
    const { data: articles } = await supabase
        .from('articles')
        .select('*, profiles(email)')
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-12">

            {/* Section 1: User Management */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-4">User Management</h2>
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase whitespace-nowrap">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase whitespace-nowrap">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase whitespace-nowrap">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {users?.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">{user.full_name || user.email?.split('@')[0] || 'No Name'}</div>
                                        <div className="text-sm text-gray-400">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400 capitalize whitespace-nowrap">{user.role}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_blocked ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
                                            {user.is_blocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <form action={async () => {
                                            'use server'
                                            await toggleBlockUser(user.id, !!user.is_blocked)
                                        }} className="inline-block">
                                            <Button size="sm" className={`${user.is_blocked ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'} text-white border-0`}>
                                                {user.is_blocked ? 'Unblock' : 'Block'}
                                            </Button>
                                        </form>

                                        <form action={async () => {
                                            'use server'
                                            await toggleUserRole(user.id)
                                        }} className="inline-block">
                                            {user.role === 'admin' ? (
                                                <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-900/20">
                                                    Revoke Admin
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-900/20">
                                                    Make Admin
                                                </Button>
                                            )}
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Section 2: Article Management (Creation & Assignment) */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-4">Assign Articles</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Creation Form */}
                    <div className="lg:col-span-1 p-6 rounded-xl border border-white/10 bg-white/5">
                        <h3 className="text-xl font-bold text-white mb-4">Create Assignment</h3>
                        <CreateArticleForm users={users?.filter(u => u.role !== 'admin') || []} />
                    </div>

                    {/* Article List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-xl font-bold text-white mb-4">Assigned Articles</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {articles?.map(article => (
                                <div key={article.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center group hover:bg-white/10 transition">
                                    <div>
                                        <div className="font-semibold text-white">{article.title}</div>
                                        <div className="text-sm text-gray-400">Assigned to: <span className="text-blue-400">{article.profiles?.email}</span></div>
                                    </div>
                                    {/* Could add delete button here if needed */}
                                </div>
                            ))}
                            {articles?.length === 0 && <div className="text-gray-500 italic">No assigned articles.</div>}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
