import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const updateSession = async (request: NextRequest) => {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.next({
            request,
        })
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refreshing the auth token
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, is_blocked')
            .eq('id', user.id)
            .single()

        if (profile?.is_blocked) {
            await supabase.auth.signOut()

            // Prevent infinite redirect loop if already on /login
            if (!request.nextUrl.pathname.startsWith('/login')) {
                const url = request.nextUrl.clone()
                url.pathname = '/login'
                url.searchParams.set('error', 'Your account has been blocked')
                return NextResponse.redirect(url)
            }
        }

        if (request.nextUrl.pathname.startsWith('/admin') && profile?.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // List of public paths that don't require authentication
    const publicPaths = ['/login', '/signup', '/auth/callback', '/error']
    const isPublicPath = publicPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    )

    if (!user && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return supabaseResponse
}
