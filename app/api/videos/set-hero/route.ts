import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
    request: Request
) {
    const supabase = await createClient()
    try {
        const body = await request.json()
        const { id } = body

        if (!id) {
            return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
        }

        // 1. Quitar el estado de Hero de todos los videos
        const { error: resetError } = await supabase
            .from('videos')
            .update({ is_hero: false })
            .eq('is_hero', true)

        if (resetError) {
            console.error('Supabase Reset Error:', resetError)
            return NextResponse.json({ error: resetError.message }, { status: 500 })
        }

        // 2. Establecer el nuevo Hero
        const { data, error: setHeroError } = await supabase
            .from('videos')
            .update({ is_hero: true })
            .eq('id', id)
            .select()

        if (setHeroError) {
            console.error('Supabase Set Hero Error:', setHeroError)
            return NextResponse.json({ error: setHeroError.message }, { status: 500 })
        }

        return NextResponse.json(data[0])

    } catch (error) {
        console.error('Catch Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
