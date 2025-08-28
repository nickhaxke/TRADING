import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, requestNotificationPermission } from '../lib/supabase';
import { UserProfile } from '../types/forex';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateUserEmail: (newEmail: string, currentPassword: string) => Promise<void>;
  resendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user && session.user.email_confirmed_at) {
        await loadUserProfile(session.user);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const defaultProfile = {
          user_id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'User',
          selected_pairs: [],
          alerts_enabled: false,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert([defaultProfile])
          .select()
          .single();

        if (createError) throw createError;
        
        setUserProfile({
          uid: user.id,
          email: user.email!,
          username: newProfile.username,
          selectedPairs: newProfile.selected_pairs,
          alertsEnabled: newProfile.alerts_enabled,
          timezone: newProfile.timezone,
          fcmToken: newProfile.fcm_token,
          createdAt: new Date(newProfile.created_at),
          updatedAt: new Date(newProfile.updated_at)
        });
      } else if (error) {
        throw error;
      } else {
        setUserProfile({
          uid: user.id,
          email: user.email!,
          username: data.username,
          selectedPairs: data.selected_pairs,
          alertsEnabled: data.alerts_enabled,
          timezone: data.timezone,
          fcmToken: data.fcm_token,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    });

    if (error) throw error;
    
    // Note: Profile will be created automatically when email is confirmed
    // and the user signs in for the first time
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    if (!data.user?.email_confirmed_at) {
      await supabase.auth.signOut();
      throw new Error('Please verify your email before signing in. Check your inbox for a verification link.');
    }

    // Request notification permission and update FCM token
    const fcmToken = await requestNotificationPermission();
    if (fcmToken && userProfile) {
      await updateUserProfile({ fcmToken });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) throw new Error('No user logged in');
    
    const profileUpdates: any = {};
    
    if (updates.username !== undefined) profileUpdates.username = updates.username;
    if (updates.selectedPairs !== undefined) profileUpdates.selected_pairs = updates.selectedPairs;
    if (updates.alertsEnabled !== undefined) profileUpdates.alerts_enabled = updates.alertsEnabled;
    if (updates.timezone !== undefined) profileUpdates.timezone = updates.timezone;
    if (updates.fcmToken !== undefined) profileUpdates.fcm_token = updates.fcmToken;
    
    profileUpdates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(profileUpdates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    
    setUserProfile({
      ...userProfile,
      ...updates,
      updatedAt: new Date()
    });
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in');
    
    // First verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });
    
    if (verifyError) throw new Error('Current password is incorrect');
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
  };

  const updateUserEmail = async (newEmail: string, currentPassword: string) => {
    if (!user) throw new Error('No user logged in');
    
    // First verify current password
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });
    
    if (verifyError) throw new Error('Current password is incorrect');
    
    const { error } = await supabase.auth.updateUser({
      email: newEmail
    });
    
    if (error) throw error;
    
    // Update profile email will happen automatically when email is confirmed
  };

  const resendVerification = async () => {
    if (!user) throw new Error('No user logged in');
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email!
    });
    
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateUserProfile,
      updateUserPassword,
      updateUserEmail,
      resendVerification
    }}>
      {children}
    </AuthContext.Provider>
  );
};