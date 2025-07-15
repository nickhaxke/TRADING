import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      trades: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          pair: string;
          entry_price: number;
          stop_loss: number;
          take_profit: number;
          rr_ratio: number;
          lot_size: number | null;
          outcome: number;
          reason: string;
          notes: string | null;
          screenshot_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          pair: string;
          entry_price: number;
          stop_loss: number;
          take_profit: number;
          rr_ratio: number;
          lot_size?: number | null;
          outcome: number;
          reason: string;
          notes?: string | null;
          screenshot_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          pair?: string;
          entry_price?: number;
          stop_loss?: number;
          take_profit?: number;
          rr_ratio?: number;
          lot_size?: number | null;
          outcome?: number;
          reason?: string;
          notes?: string | null;
          screenshot_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};