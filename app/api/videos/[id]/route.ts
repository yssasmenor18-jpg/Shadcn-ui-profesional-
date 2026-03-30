import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params
        const values = await req.json()

        // Si estamos poniendo este video como hero, quitar el hero a los demás
        // debido a la restricción de clave única is_hero=true, y usando RPC para saltear RLS
        if (values.is_hero) {
            await supabase.rpc('unset_hero_videos');
        }

        const { data: video, error } = await supabase
            .from('videos')
            .update(values)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating video:', error)
            return NextResponse.json({ error: 'Error updating video', details: error.message }, { status: 500 })
        }

        return NextResponse.json(video)
    } catch (error: any) {
        console.error('Internal API Error (PATCH):', error)
        return NextResponse.json({ error: 'Internal Error', details: error.message }, { status: 500 })
    }
}


export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params

        const { error } = await supabase
            .from('videos')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting video:', error)
            return NextResponse.json({ error: 'Error deleting video', details: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Internal API Error (DELETE):', error)
        return NextResponse.json({ error: 'Internal Error', details: error.message }, { status: 500 })
    }
}

