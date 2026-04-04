import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

    // Refreshing the auth token
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // --- API AUDITING (Guardián) ---
    if (request.nextUrl.pathname.startsWith('/api')) {
        const ip = request.headers.get('x-forwarded-for') || (request as any).ip || 'unknown'
        const userAgent = request.headers.get('user-agent') || 'unknown'

        // Log request to api_logs table - REMOVE await to prevent blocking the middleware
        supabase.from('api_logs' as any).insert({
            method: request.method,
            url: request.nextUrl.pathname,
            user_id: user?.id,
            ip_address: ip,
            user_agent: userAgent
        }).then(({ error }) => {
            if (error) console.error('Audit Log Error:', error)
        })

        // --- API AUTH PROTECTION ---
        // Protected routes (everything except auth-related API or public ones)
        const isPublicApi = request.nextUrl.pathname.startsWith('/api/auth') ||
            request.nextUrl.pathname === '/api/public' // example

        if (!user && !isPublicApi) {

            return NextResponse.json(
                { error: 'Unauthorized access to API' },
                { status: 401 }
            )
        }
    }

    // --- AUTH PROTECTION GATE ---
    const publicPaths = ['/login', '/api/auth', '/auth/callback']
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

    // 1. Redirect unauthenticated users to login
    if (!user && !isPublicPath) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 2. Redirect authenticated users away from login to the welcome portal
    if (user && request.nextUrl.pathname === '/login') {
        const url = request.nextUrl.clone()
        url.pathname = '/welcome'
        return NextResponse.redirect(url)
    }

    // --- SECURITY HEADERS ---
    supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
    supabaseResponse.headers.set('X-Frame-Options', 'DENY')
    supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block')
    supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    supabaseResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
