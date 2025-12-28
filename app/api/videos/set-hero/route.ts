import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()

        // Verificar autenticación y rol de administrador
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { videoId } = await req.json()

        if (!videoId) {
            return new NextResponse('Video ID is required', { status: 400 })
        }

        // 1. Quitar el estado de hero a cualquier video que lo tenga
        const { error: resetError } = await supabase
            .from('videos')
            .update({ is_hero: false } as any) // Fix type error if column types are not synced
            .eq('is_hero', true)

        if (resetError) {
            return new NextResponse('Error resetting hero video', { status: 500 })
        }

        // 2. Establecer el nuevo hero
        const { error: updateError } = await supabase
            .from('videos')
            .update({ is_hero: true } as any)
            .eq('id', videoId)

        if (updateError) {
            return new NextResponse('Error updating hero video', { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}
