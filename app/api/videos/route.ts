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

        let body;
        try {
            body = await req.json();
        } catch (e) {
            console.error('❌ Error parseando JSON del body:', e);
            return NextResponse.json({ error: 'Cuerpo de solicitud inválido (Invalid request body)' }, { status: 400 });
        }

        const { title, description, video_url, thumbnail_url, category, is_hero } = body

        console.log('Intentando insertar video para usuario:', user.id)

        // Si el nuevo video es hero, debemos quitar el hero de los demás primero
        // LIMITAR EL UPDATE SOLO A LOS VIDEOS DE ESTE USUARIO PARA EVITAR ERRORES DE RLS
        if (is_hero) {
            console.log('🔄 Marcando video como hero, desactivando antiguos para el usuario:', user.id);
            const { error: updateError } = await supabase
                .from('videos')
                .update({ is_hero: false })
                .match({ is_hero: true, user_id: user.id });
            
            if (updateError) {
                console.warn('⚠️ Advertencia al resetear hero videos:', updateError.message);
                // No detenemos el proceso por el momento para ver si el insert funciona
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
                    error: 'Error al crear el video (Error creating video)', 
                    details: dbError.message,
                    code: dbError.code 
                },
                { status: 500 }
            )
        }

        return NextResponse.json(video)
    } catch (error: any) {
        console.error('💥 Error crítico en /api/videos:', error)
        return NextResponse.json(
            { 
                error: 'Error interno del servidor (Internal server error)', 
                details: error.message || 'Error desconocido' 
            },
            { status: 500 }
        )
    }
}


