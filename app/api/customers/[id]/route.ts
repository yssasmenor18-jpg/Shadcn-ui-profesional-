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
        const { name, email, phone, address } = body

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('customers')
            .update({ name, email, phone, address })
            .eq('id', id)
            .select()

        if (error) {
            console.error('Supabase Error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!data || data.length === 0) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
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
        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Supabase Error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: 'Customer deleted successfully' })

    } catch (error) {
        console.error('Catch Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
