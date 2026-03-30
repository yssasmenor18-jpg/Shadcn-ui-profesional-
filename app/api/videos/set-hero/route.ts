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

        const { id: videoId } = await req.json()

        if (!videoId) {
            return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
        }

        // 1. Quitar el estado de hero a cualquier video que lo tenga globalmente, saltando RLS
        const { error: resetError } = await supabase.rpc('unset_hero_videos');

        if (resetError) {
            console.error('Error resetting hero video:', resetError)
            return NextResponse.json({ error: 'Error resetting hero video', details: resetError.message }, { status: 500 })
        }

        // 2. Establecer el nuevo hero
        const { error: updateError } = await supabase
            .from('videos')
            .update({ is_hero: true } as any)
            .eq('id', videoId)

        if (updateError) {
            console.error('Error updating hero video:', updateError)
            return NextResponse.json({ error: 'Error updating hero video', details: updateError.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Internal API Error (set-hero):', error)
        return NextResponse.json({ error: 'Internal Error', details: error.message }, { status: 500 })
    }
}

