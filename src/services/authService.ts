import { supabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

export class AuthService {
  /**
   * Get the current authenticated user
   */
  static async getCurrentUser(): Promise<{ user: User | null; error: any }> {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  }

  /**
   * Check if a user is currently authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<{ error: any }> {
    return supabase.auth.signOut();
  }

  /**
   * Subscribe to authentication state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    const { data: authListener } = supabase.auth.onAuthStateChange(callback);
    return authListener;
  }
} 