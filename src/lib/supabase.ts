import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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