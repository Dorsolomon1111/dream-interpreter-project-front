import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRegistration, UserLogin, AuthError, SocialLoginRequest } from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (userData: UserRegistration) => Promise<void>;
  login: (credentials: UserLogin) => Promise<void>;
  socialLogin: (socialRequest: SocialLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      if (AuthService.isAuthenticated()) {
        // Try to get current user from API
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } else {
        // Clear any stored user data
        setUser(null);
      }
    } catch (error: any) {
      console.warn('Failed to initialize auth:', error);
      // If token is invalid, clear auth data
      setUser(null);
      AuthService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: UserRegistration): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const authData = await AuthService.register(userData);
      setUser(authData.user);
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: UserLogin): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const authData = await AuthService.login(credentials);
      setUser(authData.user);
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (socialRequest: SocialLoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const authData = await AuthService.socialLogin(socialRequest);
      setUser(authData.user);
    } catch (error: any) {
      setError(error.message || 'Social login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await AuthService.logout();
    } catch (error: any) {
      console.warn('Logout error:', error);
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedUser = await AuthService.updateProfile(updates);
      setUser(updatedUser);
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await AuthService.changePassword(currentPassword, newPassword);
    } catch (error: any) {
      setError(error.message || 'Failed to change password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await AuthService.deleteAccount();
      setUser(null);
    } catch (error: any) {
      setError(error.message || 'Failed to delete account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (AuthService.isAuthenticated()) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error: any) {
      console.warn('Failed to refresh user:', error);
      // If refresh fails, logout
      await logout();
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    register,
    login,
    socialLogin,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    clearError,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 