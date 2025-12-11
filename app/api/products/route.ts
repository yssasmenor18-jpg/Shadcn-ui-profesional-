import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Supabase Error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(products)
    } catch (error) {
        console.error('Catch Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const supabase = await createClient()
    try {
        const body = await request.json()
        const { name, description, price, stock, is_dtf } = body

        if (!name || price === undefined) {
            return NextResponse.json({ error: 'Name and Price are required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('products')
            .insert([
                { name, description, price, stock, is_dtf } as any
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
