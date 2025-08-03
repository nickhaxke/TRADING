import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, getCurrentUser, signIn as localSignIn, signUp as localSignUp, signOut as localSignOut } from '../lib/localStorage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user on app start
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const user = await localSignUp(email, password, username);
      setUser(user);
    } catch (error: any) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const user = await localSignIn(email, password);
      setUser(user);
    } catch (error: any) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await localSignOut();
      setUser(null);
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};