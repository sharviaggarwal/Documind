import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://gdrfrlrcyrqvkxophyvf.supabase.co';

export const getSupabaseAnonKey = (): string => {
  return (
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    localStorage.getItem('documind_supabase_anon_key') ||
    ''
  );
};

export const setSupabaseAnonKey = (key: string) => {
  if (key) {
    localStorage.setItem('documind_supabase_anon_key', key.trim());
  } else {
    localStorage.removeItem('documind_supabase_anon_key');
  }
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const anonKey = getSupabaseAnonKey();
  if (!anonKey) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, anonKey);
  }
  return supabaseInstance;
};

export const resetSupabaseClient = () => {
  supabaseInstance = null;
};

export interface AuthUser {
  id: string;
  email: string;
  isGuest?: boolean;
}

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  // Check guest session first
  const guestUser = localStorage.getItem('documind_guest_user');
  if (guestUser) {
    try {
      return JSON.parse(guestUser);
    } catch {
      localStorage.removeItem('documind_guest_user');
    }
  }

  const client = getSupabase();
  if (!client) return null;

  try {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (user && user.email) {
      return { id: user.id, email: user.email };
    }
  } catch (err) {
    console.error('Error fetching Supabase user:', err);
  }

  return null;
};
