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
            return new NextResponse('Error fetching videos', { status: 500 })
        }

        return NextResponse.json(videos)
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

        const body = await req.json()
        const { title, description, video_url, thumbnail_url, category, is_hero } = body

        const { data: video, error } = await supabase
            .from('videos')
            .insert({
                title,
                description,
                video_url,
                thumbnail_url,
                category,
                is_hero: is_hero || false,
                user_id: user.id
            })
            .select()
            .single()

        if (error) {
            return new NextResponse('Error creating video', { status: 500 })
        }

        return NextResponse.json(video)
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}
