import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { signout } from './auth/actions'
import { UserDashboard } from '@/components/dashboard-user'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch profile to get role
  let role = 'guest'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    role = profile?.role || 'user'
  }

  // If Admin, redirect to the Admin Panel (User Management by default)
  if (role === 'admin') {
    redirect('/admin/users')
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <nav className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Summarizer App
        </h1>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              {role === 'admin' && (
                <span className="px-3 py-1 rounded-full bg-purple-900/50 text-purple-200 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
                  Admin Mode
                </span>
              )}

              <form action={signout}>
                <Button variant="outline" className="text-white bg-transparent border-white/20 hover:bg-white/10">
                  Sign Out
                </Button>
              </form>
            </>
          ) : (
            <div className="flex gap-4">
              <a href="/login"><Button variant="ghost" className='text-white hover:text-white/80'>Login</Button></a>
              <a href="/signup"><Button className="bg-gradient-to-r from-blue-600 to-purple-600">Get Started</Button></a>
            </div>
          )}
        </div>
      </nav>

      {user ? (
        <>
          <UserDashboard />
        </>
      ) : (
        <main className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            Summarize Any Article with AI
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Paste your article link below and get a concise summary in seconds. Powered by advanced AI.
          </p>

          <div className="relative group max-w-2xl mx-auto mt-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black ring-1 ring-gray-900 rounded-lg leading-none p-4">
              <input
                type="text"
                placeholder="Enter article URL..."
                className="w-full bg-transparent text-white placeholder-gray-600 focus:outline-none p-2 text-lg"
              />
            </div>
            <Button className="mt-4 w-full bg-white text-black hover:bg-gray-200 font-bold py-3 text-lg" disabled={!user}>
              Login to Summarize
            </Button>
          </div>
        </main>
      )}
    </div>
  )
}
