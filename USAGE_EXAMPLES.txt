// Example: How to get the current user in a Server Component
import { createClient } from '@/lib/supabase/server'

export default async function ExampleServerComponent() {
    const supabase = await createClient()

    // Get the current user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return <div>Not authenticated</div>
    }

    return (
        <div>
            <h1>Welcome, {user.email}</h1>
            <p>User ID: {user.id}</p>
        </div>
    )
}

// Example: How to use Supabase in a Client Component
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function ExampleClientComponent() {
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUser(user)
        }

        getUser()

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Welcome, {user.email}</h1>
        </div>
    )
}

// Example: How to query data with RLS (Row Level Security)
import { createClient } from '@/lib/supabase/server'

export async function getProducts() {
    const supabase = await createClient()

    // This will automatically use the authenticated user's session
    // and respect Row Level Security policies
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching products:', error)
        return []
    }

    return data
}

// Example: How to use auth in API Routes
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Your API logic here
    return NextResponse.json({ message: 'Success', userId: user.id })
}

// Example: How to protect a Server Action
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
    const supabase = await createClient()

    // Check authentication
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Your logic here
    const { data, error } = await supabase
        .from('products')
        .insert({
            name: formData.get('name'),
            user_id: user.id, // Associate with current user
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/products')
    return { data }
}
