'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn' // Assuming a utility for class names exists, or I will use template literals

import { Button } from '@/components/ui/button'
import { signout } from '@/app/auth/actions'

export function AdminNavbar() {
    const pathname = usePathname()

    const links = [
        { href: '/admin/users', label: 'User Management' },
        { href: '/admin/articles', label: 'Article Management' },
    ]

    return (
        <nav className="bg-gray-900 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-white font-bold text-xl">Admin Panel</span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname.startsWith(link.href)
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <form action={signout}>
                            <Button
                                variant="ghost"
                                className="text-gray-300 hover:text-white hover:bg-gray-800"
                            >
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    )
}
