import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { toggleBlockUser, toggleUserRole } from './actions'

export default async function UsersPage() {
    const supabase = await createClient()

    // 1. Fetch Users
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('role', { ascending: true }) // Show admins first (or users, depending on string sort)

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">User Management</h1>

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
        </div>
    )
}
