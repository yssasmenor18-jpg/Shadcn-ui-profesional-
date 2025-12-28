import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()
    try {
        const { data: videos, error } = await supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Supabase Error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(videos)
    } catch (error) {
        console.error('Catch Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const supabase = await createClient()
    try {
        const body = await request.json()
        const { title, description, video_url, thumbnail_url, category } = body

        if (!title || !video_url) {
            return NextResponse.json({ error: 'Title and Video URL are required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('videos')
            .insert([
                {
                    title,
                    description,
                    video_url,
                    thumbnail_url: thumbnail_url || '',
                    category: category || 'Todos'
                }
            ])
            .select()

        if (error) {
            console.error('Supabase Error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data[0], { status: 201 })

    } catch (error) {
        console.error('Catch Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
