import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Отсутствуют переменные окружения Supabase! Проверьте файл .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы данных для базы
export interface DreamData {
  id?: string;
  user_id: string;
  dream_name: string;
  image_url: string;
  target_amount: number;
  time_value: number;
  time_unit: 'days' | 'months' | 'years';
  saved_amount: number;
  start_date: string;
  last_saved_date?: string;
  created_at?: string;
  updated_at?: string;
}

