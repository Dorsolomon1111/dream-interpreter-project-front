import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Loader2, Check, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

const SignInPage = () => {
  const navigate = useNavigate();
  const { login, socialLogin, isLoading, error, clearError, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  // Scroll to top when Sign In page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/insights');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Clear field errors when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (fieldErrors.email) {
      setFieldErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!email.trim()) {
      errors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      errors.password = 'Please enter your password';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await login({ email, password, rememberMe });
      // Navigation will happen automatically via useEffect when isAuthenticated changes
    } catch (error) {
      // Error handling is done in the AuthContext
      console.error('Login failed:', error);
    }
  };

  // Handle Google OAuth success
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      // Decode JWT token to get user info
      const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      await socialLogin({
        provider: 'google',
        token: credentialResponse.credential,
        email: payload.email,
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        profilePicture: payload.picture || undefined,
      });
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  // Handle Google OAuth error
  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  // Handle Apple Sign In (mock implementation)
  const handleAppleSignIn = async () => {
    try {
      // Note: Apple Sign In requires native implementation or web domain verification
      // For demo purposes, we'll simulate the flow
      const mockAppleResponse = {
        user: 'apple_user_' + Date.now(),
        email: 'user@privaterelay.appleid.com',
        name: {
          firstName: 'Apple',
          lastName: 'User'
        }
      };

      await socialLogin({
        provider: 'apple',
        token: 'mock_apple_token_' + Date.now(),
        email: mockAppleResponse.email,
        firstName: mockAppleResponse.name.firstName,
        lastName: mockAppleResponse.name.lastName,
      });
    } catch (error) {
      console.error('Apple login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Moon className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Luna</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to unlock your dream insights</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Global Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-400/20 rounded-xl backdrop-blur-sm">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Social Sign In */}
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-3 mb-4">
              {/* Google Sign In */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>

              {/* Apple Sign In */}
              <button 
                onClick={handleAppleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-black border border-white/20 rounded-xl hover:bg-gray-900 hover:border-white/30 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C6.624 0 2.23 4.394 2.23 9.787s4.394 9.787 9.787 9.787 9.787-4.394 9.787-9.787S17.41 0 12.017 0zm3.995 13.016c-.037.844-.548 1.425-1.197 1.425-.649 0-1.224-.584-1.224-1.425V7.983c0-.841.575-1.425 1.224-1.425.649 0 1.16.581 1.197 1.425v5.033zm-8.03 0c.037.844.548 1.425 1.197 1.425.649 0 1.224-.584 1.224-1.425V7.983c0-.841-.575-1.425-1.224-1.425-.649 0-1.16.581-1.197 1.425v5.033z"/>
                </svg>
                <span className="text-sm font-medium text-white group-hover:text-gray-100">Sign in with Apple</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900/50 text-gray-400">Or continue with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                    fieldErrors.email 
                      ? 'border-red-400/50 focus:border-red-400' 
                      : 'border-white/10 focus:border-purple-400'
                  }`}
                  placeholder="Enter your email"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                    fieldErrors.password 
                      ? 'border-red-400/50 focus:border-red-400' 
                      : 'border-white/10 focus:border-purple-400'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only" 
                />
                <div 
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                    rememberMe 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 shadow-lg shadow-purple-500/30' 
                      : 'bg-white/5 border-white/20 group-hover:border-purple-400/50 group-hover:bg-white/10'
                  }`}
                >
                  {rememberMe && (
                    <Check className="w-3 h-3 text-white animate-scale-in" />
                  )}
                </div>
                <span className="ml-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <button 
                type="button" 
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/signup')}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage; 