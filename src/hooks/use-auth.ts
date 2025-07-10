
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
  signInWithRedirect,
  signOut,
  getRedirectResult,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { upsertUser, updateUserProfile } from '@/lib/firebase/firestore';
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

  const refreshUser = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const appUser = await upsertUser(currentUser);
      setUser(appUser);
    }
  }, []);

  useEffect(() => {
    const handleAuthentication = async () => {
      setLoading(true);
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const appUser = await upsertUser(result.user);
          setUser(appUser);
        }
      } catch (error) {
        console.error("Error processing redirect result:", error);
      }

      const unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            // Check if user state is already set to avoid redundant fetches
            if (!user || user.uid !== firebaseUser.uid) {
               const appUser = await upsertUser(firebaseUser);
               setUser(appUser);
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      );
      return unsubscribe;
    };

    handleAuthentication();
  }, [user]);

  const login = async () => {
    setLoading(true);
    await signInWithRedirect(auth, googleProvider);
  };

  const logout = async () => {
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
