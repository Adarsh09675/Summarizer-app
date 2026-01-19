import { signout } from '../auth/actions'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <nav className="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
                <h1 className="text-2xl font-bold text-red-500">
                    Admin Dashboard
                </h1>
                <form action={signout}>
                    <Button variant="outline" className="text-white bg-transparent border-white/20 hover:bg-white/10">
                        Sign Out
                    </Button>
                </form>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-colors">
                    <h3 className="text-xl font-semibold mb-2">User Management</h3>
                    <p className="text-gray-400">Manage registered users and roles.</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-colors">
                    <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                    <p className="text-gray-400">View usage statistics and summaries generated.</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-colors">
                    <h3 className="text-xl font-semibold mb-2">System Settings</h3>
                    <p className="text-gray-400">Configure AI models and limits.</p>
                </div>
            </div>
        </div>
    )
}
