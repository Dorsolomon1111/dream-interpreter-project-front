import { User, AuthResponse, UserRegistration, UserLogin, SocialLoginRequest } from '../types/auth';

const API_BASE_URL = 'http://localhost:3000/api/auth';
const USE_MOCK_DATA = true; // Set to false when backend is ready

// Mock users database - these users exist for testing
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'demo@luna.com',
    firstName: 'Demo',
    lastName: 'User',
    isEmailVerified: true,
    socialProviders: {
      google: {
        id: 'google_123456789',
        email: 'demo@luna.com',
        connectedAt: new Date('2024-01-01'),
      }
    },
    preferences: {
      notifications: true,
      shareInsights: false,
      publicProfile: false,
    },
    subscription: {
      plan: 'premium',
      status: 'active',
    },
    stats: {
      totalDreams: 12,
      streakDays: 7,
      joinedAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isEmailVerified: true,
    preferences: {
      notifications: true,
      shareInsights: false,
      publicProfile: false,
    },
    subscription: {
      plan: 'free',
      status: 'active',
    },
    stats: {
      totalDreams: 5,
      streakDays: 3,
      joinedAt: new Date('2024-02-01'),
      lastLoginAt: new Date(),
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  }
];

export class AuthService {
  private static readonly TOKEN_KEY = 'luna_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'luna_refresh_token';
  private static readonly USER_KEY = 'luna_user';

  /**
   * Register a new user
   */
  static async register(userData: UserRegistration): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      return this.mockRegister(userData);
    }

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // Store tokens and user data
    this.storeAuthData(data.data);

    return data.data;
  }

  /**
   * Login user
   */
  static async login(credentials: UserLogin): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      return this.mockLogin(credentials);
    }

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store tokens and user data
    this.storeAuthData(data.data);

    return data.data;
  }

  /**
   * Mock login implementation
   */
  private static async mockLogin(credentials: UserLogin): Promise<AuthResponse> {
    // Simulate realistic API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    // Find user by email
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Simple password validation - require non-empty password
    if (!credentials.password || credentials.password.length < 3) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.stats.lastLoginAt = new Date();
    user.updatedAt = new Date();

    // Create auth response
    const authResponse: AuthResponse = {
      user,
      token: `luna_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      refreshToken: `luna_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      expiresIn: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // Store auth data
    this.storeAuthData(authResponse);

    return authResponse;
  }

  /**
   * Mock register implementation
   */
  private static async mockRegister(userData: UserRegistration): Promise<AuthResponse> {
    // Simulate realistic API delay
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

    // Validate required fields
    if (!userData.firstName?.trim() || !userData.lastName?.trim() || !userData.email?.trim()) {
      throw new Error('All fields are required');
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(userData.email)) {
      throw new Error('Please enter a valid email address');
    }

    // Validate password strength
    if (!userData.password || userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(userData.password)) {
      throw new Error('Password must contain uppercase, lowercase, number, and special character');
    }

    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email.toLowerCase(),
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      isEmailVerified: false,
      preferences: {
        notifications: true,
        shareInsights: false,
        publicProfile: false,
      },
      subscription: {
        plan: 'free',
        status: 'active',
      },
      stats: {
        totalDreams: 0,
        streakDays: 0,
        joinedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to mock database
    MOCK_USERS.push(newUser);

    // Create auth response
    const authResponse: AuthResponse = {
      user: newUser,
      token: `luna_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      refreshToken: `luna_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      expiresIn: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // Store auth data
    this.storeAuthData(authResponse);

    return authResponse;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    if (USE_MOCK_DATA) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      this.clearAuthData();
      return;
    }

    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      // Always clear local storage
      this.clearAuthData();
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    if (USE_MOCK_DATA) {
      const user = this.getStoredUser();
      if (!user) {
        throw new Error('Authentication required');
      }
      return user;
    }

    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        await this.refreshToken();
        // Retry the request
        return this.getCurrentUser();
      }
      throw new Error(data.error || 'Failed to get user profile');
    }

    return data.data.user;
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: Partial<User>): Promise<User> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const user = this.getStoredUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const updatedUser = { ...user, ...updates, updatedAt: new Date() };
      this.storeUser(updatedUser);
      
      // Update in mock database
      const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        MOCK_USERS[userIndex] = updatedUser;
      }
      
      return updatedUser;
    }

    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        await this.refreshToken();
        return this.updateProfile(updates);
      }
      throw new Error(data.error || 'Failed to update profile');
    }

    // Update stored user data
    this.storeUser(data.data.user);

    return data.data.user;
  }

  /**
   * Change password
   */
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Simulate password validation
      if (!newPassword || newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }
      return;
    }

    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmNewPassword: newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        await this.refreshToken();
        return this.changePassword(currentPassword, newPassword);
      }
      throw new Error(data.error || 'Failed to change password');
    }
  }

  /**
   * Delete account
   */
  static async deleteAccount(): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user = this.getStoredUser();
      if (user) {
        // Remove from mock database
        const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          MOCK_USERS.splice(userIndex, 1);
        }
      }
      this.clearAuthData();
      return;
    }

    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete account');
    }

    // Clear local storage
    this.clearAuthData();
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<void> {
    if (USE_MOCK_DATA) {
      // Mock token refresh
      const user = this.getStoredUser();
      if (user) {
        const newToken = `luna_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newRefreshToken = `luna_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.storeToken(newToken);
        this.storeRefreshToken(newRefreshToken);
      }
      return;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Refresh token is invalid, clear auth data
      this.clearAuthData();
      throw new Error('Session expired. Please login again.');
    }

    // Store new tokens
    this.storeToken(data.data.token);
    this.storeRefreshToken(data.data.refreshToken);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  /**
   * Get stored authentication token
   */
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored refresh token
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get stored user data
   */
  static getStoredUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Store authentication data
   */
  private static storeAuthData(authData: AuthResponse): void {
    this.storeToken(authData.token);
    this.storeRefreshToken(authData.refreshToken);
    this.storeUser(authData.user);
  }

  /**
   * Store authentication token
   */
  private static storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Store refresh token
   */
  private static storeRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Store user data
   */
  private static storeUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear all authentication data
   */
  private static clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Make authenticated API request with automatic token refresh
   */
  static async makeAuthenticatedRequest(
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    let response = await fetch(url, { ...options, headers });

    // If token expired, try to refresh and retry
    if (response.status === 401) {
      await this.refreshToken();
      const newToken = this.getToken();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, { ...options, headers });
      }
    }

    return response;
  }

  /**
   * Social login with Google or Apple
   */
  static async socialLogin(socialRequest: SocialLoginRequest): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      return this.mockSocialLogin(socialRequest);
    }

    const response = await fetch(`${API_BASE_URL}/social-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(socialRequest),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Social login failed');
    }

    // Store tokens and user data
    this.storeAuthData(data.data);

    return data.data;
  }

  /**
   * Mock social login implementation
   */
  private static async mockSocialLogin(socialRequest: SocialLoginRequest): Promise<AuthResponse> {
    // Simulate realistic API delay
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));

    const { provider, token, email, firstName, lastName, profilePicture } = socialRequest;

    // Validate token format
    if (!token || token.length < 10) {
      throw new Error('Invalid authentication token');
    }

    // Check if user already exists with this email
    let user = MOCK_USERS.find(u => u.email.toLowerCase() === email?.toLowerCase());

    if (user) {
      // Update existing user with social provider info
      user.socialProviders = user.socialProviders || {};
      if (provider === 'google') {
        user.socialProviders.google = {
          id: `google_${Date.now()}`,
          email: email || user.email,
          connectedAt: new Date(),
        };
      } else if (provider === 'apple') {
        user.socialProviders.apple = {
          id: `apple_${Date.now()}`,
          email: email,
          connectedAt: new Date(),
        };
      }
      
      // Update profile picture if provided
      if (profilePicture) {
        user.profilePicture = profilePicture;
      }

      user.stats.lastLoginAt = new Date();
      user.updatedAt = new Date();
    } else {
      // Create new user for social login
      if (!email || !firstName || !lastName) {
        throw new Error('Email, first name, and last name are required for new accounts');
      }

      user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: email.toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        isEmailVerified: true, // Social accounts are pre-verified
        profilePicture,
        socialProviders: {
          [provider]: {
            id: `${provider}_${Date.now()}`,
            email: provider === 'apple' ? email : email,
            connectedAt: new Date(),
          }
        },
        preferences: {
          notifications: true,
          shareInsights: false,
          publicProfile: false,
        },
        subscription: {
          plan: 'free',
          status: 'active',
        },
        stats: {
          totalDreams: 0,
          streakDays: 0,
          joinedAt: new Date(),
          lastLoginAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add to mock database
      MOCK_USERS.push(user);
    }

    // Create auth response
    const authResponse: AuthResponse = {
      user,
      token: `luna_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      refreshToken: `luna_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      expiresIn: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // Store auth data
    this.storeAuthData(authResponse);

    return authResponse;
  }
} 