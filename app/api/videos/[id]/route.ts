import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient()
    try {
        const { id } = await params
        const body = await request.json()
        const { title, description, video_url, thumbnail_url, category } = body

        if (!id) {
            return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
        }

        if (!title || !video_url) {
            return NextResponse.json({ error: 'Title and Video URL are required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('videos')
            .update({ title, description, video_url, thumbnail_url, category })
            .eq('id', id)
            .select()

        if (error) {
            console.error('Supabase Error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!data || data.length === 0) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 })
        }

        return NextResponse.json(data[0])

    } catch (error) {
        console.error('Catch Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient()
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
        }

        const { error } = await supabase
            .from('videos')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Supabase Error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: 'Video deleted successfully' })

    } catch (error) {
        console.error('Catch Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
