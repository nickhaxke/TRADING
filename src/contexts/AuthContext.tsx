import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, requestNotificationPermission } from '../lib/firebase';
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user && user.emailVerified) {
        // Load user profile from Firestore
        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data() as UserProfile);
          } else {
            // Create default profile if it doesn't exist
            const defaultProfile: UserProfile = {
              uid: user.uid,
              email: user.email!,
              username: user.displayName || user.email!.split('@')[0],
              selectedPairs: [],
              alertsEnabled: false,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            await setDoc(doc(db, 'users', user.uid), defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email,
      username,
      selectedPairs: [],
      alertsEnabled: false,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
  };

  const signIn = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    if (!user.emailVerified) {
      await firebaseSignOut(auth);
      throw new Error('Please verify your email before signing in. Check your inbox for a verification link.');
    }

    // Request notification permission and update FCM token
    const fcmToken = await requestNotificationPermission();
    if (fcmToken && userProfile) {
      await updateDoc(doc(db, 'users', user.uid), {
        fcmToken,
        updatedAt: new Date()
      });
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) throw new Error('No user logged in');
    
    const updatedProfile = {
      ...updates,
      updatedAt: new Date()
    };
    
    await updateDoc(doc(db, 'users', user.uid), updatedProfile);
    setUserProfile({ ...userProfile, ...updatedProfile });
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in');
    
    const credential = EmailAuthProvider.credential(user.email!, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  };

  const updateUserEmail = async (newEmail: string, currentPassword: string) => {
    if (!user) throw new Error('No user logged in');
    
    const credential = EmailAuthProvider.credential(user.email!, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, newEmail);
    await sendEmailVerification(user);
    
    // Update profile in Firestore
    await updateUserProfile({ email: newEmail });
  };

  const resendVerification = async () => {
    if (!user) throw new Error('No user logged in');
    await sendEmailVerification(user);
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