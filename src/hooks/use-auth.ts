
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
    // This function runs once when the component mounts to check for a redirect result.
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          // If there's a result, a user has just signed in via redirect.
          // We upsert the user to Firestore and update our state.
          const appUser = await upsertUser(result.user);
          setUser(appUser);
        }
      } catch (error) {
        console.error("Error processing redirect result:", error);
      }
    };

    handleRedirectResult();

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // This handles subsequent auth state changes, e.g., page reloads for an already logged-in user.
          if (!user) { // Only run upsert if user is not already set by redirect result
            const appUser = await upsertUser(firebaseUser);
            setUser(appUser);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  const login = async () => {
    setLoading(true);
    try {
      // Start the redirect flow
      await signInWithRedirect(auth, googleProvider);
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
