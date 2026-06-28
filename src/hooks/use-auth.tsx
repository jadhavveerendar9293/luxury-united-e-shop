import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

interface AuthUser {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Tables<'profiles'> | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<Tables<'profiles'>>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      const profile = data as Tables<'profiles'>;
      setProfile(profile);
      setUser({
        id: profile.user_id,
        email: profile.email,
        role: profile.role,
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
      });
    }
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: new Error(error.message) };
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) return { error: new Error(error.message) };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { error: new Error(error.message) };
    return { error: null };
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Tables<'profiles'>>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await (supabase as any)
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) return { error: new Error(error.message) };

    await fetchProfile(user.id);
    return { error: null };
  }, [user, fetchProfile]);

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
