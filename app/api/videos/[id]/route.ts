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
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { id } = params
        const values = await req.json()

        const { data: video, error } = await supabase
            .from('videos')
            .update(values)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            return new NextResponse('Error updating video', { status: 500 })
        }

        return NextResponse.json(video)
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
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
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { id } = params

        const { error } = await supabase
            .from('videos')
            .delete()
            .eq('id', id)

        if (error) {
            return new NextResponse('Error deleting video', { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}
