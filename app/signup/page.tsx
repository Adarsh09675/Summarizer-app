'use client'

import { signup } from '../auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useActionState, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const initialState = {
    error: '',
}

export default function SignupPage() {
    const [state, formAction] = useActionState(signup, initialState)
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-bl from-gray-900 via-purple-900 to-violet-900 p-4 text-white">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Join the community today
                    </p>
                </div>

                <form action={formAction} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                                Full Name
                            </label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="mt-1 bg-white/90 border-white/20 text-gray-900 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                                Email address
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 bg-white/90 border-white/20 text-gray-900 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    className="mt-1 bg-white/90 border-white/20 text-gray-900 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500 pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {state?.error && (
                        <div className="text-red-300 text-sm text-center bg-red-900/40 p-2 rounded border border-red-500/50 font-medium">
                            {state.error}
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Sign up
                        </Button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-100 mt-4">
                    Already have an account?{' '}
                    <a href="/login" className="font-bold text-pink-300 hover:text-pink-200 hover:underline">
                        Sign in
                    </a>
                </p>
            </div >
        </div >
    )
}
