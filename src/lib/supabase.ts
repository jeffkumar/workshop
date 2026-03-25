import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export type Update = {
  id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  profiles?: Profile
  likes?: Like[]
}

export type Like = {
  update_id: string
  user_id: string
  created_at: string
}
