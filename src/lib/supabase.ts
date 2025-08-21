import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          selected_pairs: string[];
          alerts_enabled: boolean;
          timezone: string;
          fcm_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          selected_pairs?: string[];
          alerts_enabled?: boolean;
          timezone?: string;
          fcm_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string;
          selected_pairs?: string[];
          alerts_enabled?: boolean;
          timezone?: string;
          fcm_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

// Push notification helper (optional - can be implemented later)
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted');
    // You can implement FCM token generation here if needed
    return 'mock-fcm-token';
  }
  
  return null;
};