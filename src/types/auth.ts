export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  profilePicture?: string;
  dateOfBirth?: Date;
  timezone?: string;
  dreamGoals?: string[];
  socialProviders?: {
    google?: {
      id: string;
      email: string;
      connectedAt: Date;
    };
    apple?: {
      id: string;
      email?: string;
      connectedAt: Date;
    };
  };
  preferences: {
    notifications: boolean;
    shareInsights: boolean;
    publicProfile: boolean;
  };
  subscription: {
    plan: 'free' | 'premium' | 'pro';
    status: 'active' | 'inactive' | 'cancelled';
    expiresAt?: Date;
  };
  stats: {
    totalDreams: number;
    streakDays: number;
    joinedAt: Date;
    lastLoginAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegistration {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface UserLogin {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SocialLoginRequest {
  provider: 'google' | 'apple';
  token: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

export interface GoogleAuthResponse {
  access_token: string;
  id_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}

export interface AppleAuthResponse {
  authorization: {
    code: string;
    id_token: string;
    state?: string;
  };
  user?: {
    email?: string;
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthError {
  message: string;
  code?: string;
  details?: string[];
} 