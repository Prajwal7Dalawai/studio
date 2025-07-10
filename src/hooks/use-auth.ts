
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  createElement,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { upsertUser } from '@/lib/firebase/firestore';
import type { User } from '@/lib/types';

export type AuthUser = User;

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          console.log("Auth state changed, user found. Upserting...");
          const appUser = await upsertUser(firebaseUser);
          setUser(appUser);
        } else {
          console.log("Auth state changed, no user.");
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async () => {
    setLoading(true);
    console.log('Attempting to sign in with popup...');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('signInWithPopup successful.');
      // The onAuthStateChanged listener will handle the user creation,
      // but we can stop the loading state here.
      // The listener might take a moment to fire, so we prevent a UI flicker.
      if (!user) {
         const appUser = await upsertUser(result.user);
         setUser(appUser);
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    } finally {
        setLoading(false);
    }
  };

  const logout = async () => {
    console.log('Attempting to sign out...');
    setLoading(true);
    try {
      await signOut(auth);
      console.log('Sign out successful.');
      setUser(null);
    } catch (error) {
      console.error('Error during sign-out:', error);
    } finally {
        setLoading(false);
    }
  };


  const value = { user, loading, login, logout, isAuthenticated: !!user && !loading };

  return createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
