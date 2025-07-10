
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
          const appUser = await upsertUser(firebaseUser);
          setUser(appUser);
        } else {
          setUser(null);
        }
        console.log("Auth state changed. Current user:", firebaseUser);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    console.log('Attempting to sign out...');
    setLoading(true);
    try {
      await signOut(auth);
      console.log('Sign out successful.');
    } catch (error) {
      console.error('Error during sign-out:', error);
      setLoading(false);
    }
  };

  const login = async () => {
    console.log('Attempting to sign in with popup...');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      console.log('signInWithPopup successful.');
    } catch (error) {
      console.error('Error during sign-in:', error);
      // In case of error, we should stop the loading state.
      setLoading(false);
    }
  };

  const value = { user, loading, login, logout, isAuthenticated: !!user };

  return createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
