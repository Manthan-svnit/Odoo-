import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService, User, Company } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  company: Company | null;
  loading: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  registerCompany: (data: {
    companyName: string;
    adminName: string;
    adminEmail: string;
    password: string;
    country?: string;
    currency: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const userData = await apiService.getCurrentUser();
          setUser(userData);
          setCompany(userData.company);
        } catch (error) {
          console.error('Error fetching user data:', error);
          apiService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      setUser(response.user);
      setCompany(response.user.company);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive"
      });
      throw error;
    }
  };

  const registerCompany = async (data: {
    companyName: string;
    adminName: string;
    adminEmail: string;
    password: string;
    country?: string;
    currency: string;
  }) => {
    try {
      const response = await apiService.registerCompany(data);
      setUser(response.user);
      setCompany(response.user.company);
      toast({
        title: "Account created!",
        description: "Welcome to ExpenseFlow. Redirecting to dashboard...",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive"
      });
      throw error;
    }
  };

  const signOut = async () => {
    await apiService.logout();
    setUser(null);
    setCompany(null);
  };

  return (
    <AuthContext.Provider value={{ user, company, loading, signOut, login, registerCompany }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
