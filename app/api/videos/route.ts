import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(req.url)
        const category = searchParams.get('category')
        const search = searchParams.get('search')

        let query = supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false })

        if (category && category !== 'all') {
            query = query.eq('category', category)
        }

        if (search) {
            query = query.ilike('title', `%${search}%`)
        }

        const { data: videos, error } = await query

        if (error) {
            console.error('Fetch Videos Error:', error)
            return NextResponse.json({ error: 'Error fetching videos' }, { status: 500 })
        }

        return NextResponse.json(videos)
    } catch (error) {
        console.error('Internal API Error (GET):', error)
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error('Auth Error:', authError)
            return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 })
        }

        const body = await req.json()
        const { title, description, video_url, thumbnail_url, category, is_hero } = body

        console.log('Intentando insertar video para usuario:', user.id)

        // Si el nuevo video es hero, debemos quitar el hero de los demás primero
        if (is_hero) {
            const { error: updateError } = await supabase
                .from('videos')
                .update({ is_hero: false })
                .eq('is_hero', true)
            
            if (updateError) {
                console.warn('Advertencia al resetear hero videos:', updateError.message)
                // No detenemos el proceso, pero lo logueamos
            }
        }

        const { data: video, error: dbError } = await supabase
            .from('videos')
            .insert({
                title,
                description,
                video_url,
                thumbnail_url,
                category,
                is_hero: !!is_hero,
                user_id: user.id
            })
            .select()
            .single()

        if (dbError) {
            console.error('🔴 Error de Supabase al insertar video:', dbError)
            return NextResponse.json(
                { 
                    error: 'Error al crear el video en la base de datos', 
                    details: dbError.message,
                    code: dbError.code 
                },
                { status: 500 }
            )
        }

        return NextResponse.json(video)
    } catch (error: any) {
        console.error('💥 Error interno en API /api/videos:', error)
        return NextResponse.json(
            { 
                error: 'Error interno del servidor', 
                details: error.message || 'Error desconocido' 
            },
            { status: 500 }
        )
    }
}


