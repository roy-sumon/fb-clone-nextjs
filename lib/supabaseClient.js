import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://remnahwxlblswiyujozv.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable__xXYO47s1ndlHMvwfwQKyA_IWMlAW_S';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
