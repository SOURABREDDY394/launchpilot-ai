import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const env = typeof import.meta !== "undefined" ? import.meta.env : undefined
const runtimeConfig = typeof window !== "undefined" ? window : {}

const supabaseUrl =
  runtimeConfig.__SUPABASE_URL__ ||
  (env && env.VITE_SUPABASE_URL) ||
  'https://your-project.supabase.co'

const supabaseAnonKey =
  runtimeConfig.__SUPABASE_ANON_KEY__ ||
  (env && env.VITE_SUPABASE_ANON_KEY) ||
  'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
