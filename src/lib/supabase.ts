import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Card = {
  id: string;
  slug: string;
  sender_name: string;
  recipient_name: string;
  message: string;
  image_url: string | null;
  response: 'yes' | 'no' | null;
  responded_at: string | null;
  created_at: string;
};
