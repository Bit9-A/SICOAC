import { createClient } from '@supabase/supabase-js'
import { CONFIG } from './config'

if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) {
  console.error('Supabase credentials are not fully configured in your .env file.')
}

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY)
