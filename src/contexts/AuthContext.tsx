import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrentUser } from '@/lib/types';
import { fetchCurrentUser } from '@/lib/api';
import { users, setCurrentUser as setMockCurrentUser } from '@/lib/mock-data';

interface AuthContextType {
  user: CurrentUser | null;
  loading: boolean;
  switchUser: (userId: string) => void;
  availableUsers: typeof users;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    setLoading(true);
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  }

  function switchUser(userId: string) {
    setMockCurrentUser(userId);
    loadUser();
  }

  return (
    <AuthContext.Provider value={{ user, loading, switchUser, availableUsers: users }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
