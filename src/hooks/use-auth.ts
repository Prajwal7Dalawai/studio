
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  createElement,
  useCallback,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { getFirebaseInstances } from '@/lib/firebase';
import { upsertUser } from '@/lib/firebase/firestore';
import type { User } from '@/lib/types';

export type AuthUser = User;

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { auth, googleProvider } = getFirebaseInstances();

  const refreshUser = useCallback(async () => {
    if (!auth?.currentUser) return;
    const appUser = await upsertUser(auth.currentUser);
    setUser(appUser);
  }, [auth]);

  useEffect(() => {
    // Ensure auth is initialized before using it
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const appUser = await upsertUser(firebaseUser);
          setUser(appUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  const login = async () => {
    if (!auth || !googleProvider) return;
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const appUser = await upsertUser(result.user);
        setUser(appUser);
      }
    } catch (error) {
      console.error("Authentication failed", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setUser(null);
  };

  const value = { user, loading, login, logout, isAuthenticated: !!user && !loading, refreshUser };

  return createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
