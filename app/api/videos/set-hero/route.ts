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

        // Aquí podrías añadir una verificación extra de rol si es necesario
        // if (user.role !== 'admin') ...

        const { videoId } = await req.json()

        if (!videoId) {
            return new NextResponse('Video ID is required', { status: 400 })
        }

        // 1. Quitar el estado de hero a cualquier video que lo tenga
        const { error: resetError } = await supabase
            .from('videos')
            .update({ is_hero: false } as any) // Type casting to bypass strict type checking if column exists but types are outdated
            .eq('is_hero', true)

        if (resetError) {
            console.error('Error resetting hero video:', resetError)
            return new NextResponse('Error resetting hero video', { status: 500 })
        }

        // 2. Establecer el nuevo hero
        const { error: updateError } = await supabase
            .from('videos')
            .update({ is_hero: true } as any)
            .eq('id', videoId)

        if (updateError) {
            console.error('Error updating hero video:', updateError)
            return new NextResponse('Error updating hero video', { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[SET_HERO_ERROR]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
