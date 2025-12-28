import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // Opcional: Verificar rol de admin aquí si es necesario
        // if (user.role !== 'admin') ...

        const { data: logs, error } = await supabase
            .from('audit_logs' as any)
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)

        if (error) {
            console.error('Error fetching audit logs:', error)
            return new NextResponse('Error fetching logs', { status: 500 })
        }

        return NextResponse.json(logs)
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { action, details } = await req.json()

        const { error } = await supabase
            .from('audit_logs' as any)
            .insert({
                user_id: user.id,
                action,
                details,
                ip_address: req.headers.get('x-forwarded-for') || 'unknown'
            })

        if (error) {
            return new NextResponse('Error creating log', { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}
