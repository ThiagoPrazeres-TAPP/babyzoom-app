import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          baby_name: string | null
          baby_birth_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          baby_name?: string | null
          baby_birth_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          baby_name?: string | null
          baby_birth_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      routines: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          time: string
          duration: string | null
          notes: string | null
          completed: boolean
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          time: string
          duration?: string | null
          notes?: string | null
          completed?: boolean
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          time?: string
          duration?: string | null
          notes?: string | null
          completed?: boolean
          date?: string
          created_at?: string
        }
      }
      naps: {
        Row: {
          id: string
          user_id: string
          start_time: string
          end_time: string | null
          duration_minutes: number | null
          quality: string | null
          notes: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_time: string
          end_time?: string | null
          duration_minutes?: number | null
          quality?: string | null
          notes?: string | null
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_time?: string
          end_time?: string | null
          duration_minutes?: number | null
          quality?: string | null
          notes?: string | null
          date?: string
          created_at?: string
        }
      }
      vaccines: {
        Row: {
          id: string
          user_id: string
          name: string
          age_recommendation: string
          type: string
          completed: boolean
          completed_date: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          age_recommendation: string
          type: string
          completed?: boolean
          completed_date?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          age_recommendation?: string
          type?: string
          completed?: boolean
          completed_date?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          icon: string | null
          unlocked: boolean
          unlocked_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          icon?: string | null
          unlocked?: boolean
          unlocked_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          icon?: string | null
          unlocked?: boolean
          unlocked_at?: string | null
          created_at?: string
        }
      }
    }
  }
}
