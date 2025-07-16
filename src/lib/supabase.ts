import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
}

// Create client with fallback values to prevent runtime errors
export const supabase = createClient(
  supabaseUrl || 'https://dummy.supabase.co', 
  supabaseAnonKey || 'dummy-key'
)

export type Database = {
  public: {
    Tables: {
      decks: {
        Row: {
          id: string
          user_id: string
          deck_name: string
          created_at: string
          file_path: string
        }
        Insert: {
          id?: string
          user_id: string
          deck_name: string
          created_at?: string
          file_path: string
        }
        Update: {
          id?: string
          user_id?: string
          deck_name?: string
          created_at?: string
          file_path?: string
        }
      }
    }
  }
}