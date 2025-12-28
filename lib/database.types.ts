export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "13.0.5"
    }
    public: {
        Tables: {
            customers: {
                Row: {
                    address: string | null
                    created_at: string | null
                    email: string
                    id: string
                    name: string
                    phone: string | null
                }
                Insert: {
                    address?: string | null
                    created_at?: string | null
                    email: string
                    id?: string
                    name: string
                    phone?: string | null
                }
                Update: {
                    address?: string | null
                    created_at?: string | null
                    email?: string
                    id?: string
                    name?: string
                    phone?: string | null
                }
                Relationships: []
            }
            products: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    is_dtf: boolean | null
                    name: string
                    price: number
                    stock: number
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_dtf?: boolean | null
                    name: string
                    price: number
                    stock?: number
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_dtf?: boolean | null
                    name?: string
                    price?: number
                    stock?: number
                }
                Relationships: []
            }
            videos: {
                Row: {
                    category: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    thumbnail_url: string
                    title: string
                    user_id: string | null
                    video_url: string
                }
                Insert: {
                    category?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    thumbnail_url: string
                    title: string
                    user_id?: string | null
                    video_url: string
                }
                Update: {
                    category?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    thumbnail_url?: string
                    title?: string
                    user_id?: string | null
                    video_url?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}


export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

