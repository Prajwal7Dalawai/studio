
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
  signInWithRedirect,
  signOut,
  getRedirectResult,
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
          // This will handle the case where the page loads after a redirect
          // and the user is being authenticated.
          try {
            const result = await getRedirectResult(auth);
            if (result?.user) {
              const appUser = await upsertUser(result.user);
              setUser(appUser);
            }
          } catch (error) {
            console.error("Error getting redirect result:", error);
          }
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
      // The page will redirect, and the onAuthStateChanged listener will handle the result.
    } catch (error) {
      console.error('Error during sign-in redirect:', error);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error during sign-out:', error);
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
