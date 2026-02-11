
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pslzwoffmzttqrcvqgpj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UOvopFdxgu6y3XIrwwir1g_cXsxjmmr';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
