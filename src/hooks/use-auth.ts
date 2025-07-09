"use client";

import { useState, useEffect } from 'react';

// This is a mock hook for demonstration purposes.
// In a real application, you would integrate this with Firebase Authentication.

type User = {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  branch: string;
  year: string;
  joinedAt: Date;
  photoURL: string;
};

const mockAdmin: User = {
  uid: 'admin-123',
  name: 'Admin User',
  email: 'admin@campus.dev',
  role: 'admin',
  branch: 'SYSTEM',
  year: 'N/A',
  joinedAt: new Date(),
  photoURL: 'https://placehold.co/100x100.png'
};

const mockStudent: User = {
  uid: 'student-456',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  role: 'student',
  branch: 'CSE',
  year: '3rd',
  joinedAt: new Date(),
  photoURL: 'https://placehold.co/100x100.png'
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth state from localStorage
    try {
      const storedUser = localStorage.getItem('campus-companion-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Revive date object
        parsedUser.joinedAt = new Date(parsedUser.joinedAt);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('campus-companion-user');
    }
    setLoading(false);
  }, []);

  const login = (role: 'student' | 'admin') => {
    const userToLogin = role === 'admin' ? mockAdmin : mockStudent;
    localStorage.setItem('campus-companion-user', JSON.stringify(userToLogin));
    setUser(userToLogin);
  };

  const logout = () => {
    localStorage.removeItem('campus-companion-user');
    setUser(null);
  };

  return { user, login, logout, isAuthenticated: !!user, loading };
};
