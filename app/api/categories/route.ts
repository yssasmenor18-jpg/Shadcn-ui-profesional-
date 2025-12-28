import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();

    try {
        // Consultamos la columna 'category' de la tabla 'videos'
        const { data, error } = await supabase
            .from('videos')
            .select('category')
            .not('category', 'is', null) // Ignoramos nulos
            .order('category', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Filtramos para tener solo categorías únicas (ya que la DB devuelve una fila por video)
        // Usamos un Set para eliminar duplicados
        const uniqueCategories = Array.from(new Set(data.map((item) => item.category)));

        return NextResponse.json(uniqueCategories);
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
