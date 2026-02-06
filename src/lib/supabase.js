import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing! Check environment variables.')
} else if (supabaseAnonKey.length < 50) {
    console.warn('Supabase Anon Key looks too short. Check if it was copied correctly.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
