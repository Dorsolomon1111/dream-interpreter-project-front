import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Loader2, Check, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { register, socialLogin, isLoading, error, clearError, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false
  });

  // Scroll to top when Sign Up page mounts
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

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }

    // Clear confirm password error if passwords match
    if (name === 'confirmPassword' && value === formData.password) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!Object.values(passwordStrength).every(Boolean)) {
      errors.password = 'Password does not meet requirements';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeToTerms) {
      errors.terms = 'Please agree to the terms and conditions';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await register(formData);
      // Navigation will happen automatically via useEffect when isAuthenticated changes
    } catch (error) {
      // Error handling is done in the AuthContext
      console.error('Registration failed:', error);
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
      console.error('Google signup failed:', error);
    }
  };

  // Handle Google OAuth error
  const handleGoogleError = () => {
    console.error('Google signup failed');
  };

  // Handle Apple Sign In (mock implementation)
  const handleAppleSignUp = async () => {
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
      console.error('Apple signup failed:', error);
    }
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Moon className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Luna</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Join Luna</h1>
          <p className="text-gray-400">Start your journey into dream interpretation</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Global Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-400/20 rounded-xl backdrop-blur-sm">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Terms Error */}
          {fieldErrors.terms && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-400/20 rounded-xl backdrop-blur-sm">
              <p className="text-red-300 text-sm text-center">{fieldErrors.terms}</p>
            </div>
          )}

          {/* Social Sign Up */}
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-3 mb-4">
              {/* Google Sign Up */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>

              {/* Apple Sign Up */}
              <button 
                onClick={handleAppleSignUp}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-black border border-white/20 rounded-xl hover:bg-gray-900 hover:border-white/30 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                <span className="text-sm font-medium text-white group-hover:text-gray-100">Sign up with Apple</span>
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

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                    fieldErrors.firstName 
                      ? 'border-red-400/50 focus:border-red-400' 
                      : 'border-white/10 focus:border-purple-400'
                  }`}
                  placeholder="First name"
                />
                {fieldErrors.firstName && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                    fieldErrors.lastName 
                      ? 'border-red-400/50 focus:border-red-400' 
                      : 'border-white/10 focus:border-purple-400'
                  }`}
                  placeholder="Last name"
                />
                {fieldErrors.lastName && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                    fieldErrors.password 
                      ? 'border-red-400/50 focus:border-red-400' 
                      : isPasswordStrong 
                        ? 'border-green-400/50 focus:border-green-400'
                        : 'border-white/10 focus:border-purple-400'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password Strength Indicators */}
              {formData.password && (
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full transition-colors ${passwordStrength.hasLength ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                    <span className={passwordStrength.hasLength ? 'text-green-400' : 'text-gray-400'}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full transition-colors ${passwordStrength.hasUpper ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                    <span className={passwordStrength.hasUpper ? 'text-green-400' : 'text-gray-400'}>One uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full transition-colors ${passwordStrength.hasLower ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                    <span className={passwordStrength.hasLower ? 'text-green-400' : 'text-gray-400'}>One lowercase letter</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full transition-colors ${passwordStrength.hasNumber ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                    <span className={passwordStrength.hasNumber ? 'text-green-400' : 'text-gray-400'}>One number</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full transition-colors ${passwordStrength.hasSpecial ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                    <span className={passwordStrength.hasSpecial ? 'text-green-400' : 'text-gray-400'}>One special character</span>
                  </div>
                </div>
              )}
              
              {fieldErrors.password && (
                <p className="mt-2 text-xs text-red-400">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                    fieldErrors.confirmPassword 
                      ? 'border-red-400/50 focus:border-red-400' 
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-400/50 focus:border-green-400'
                        : 'border-white/10 focus:border-purple-400'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-300 transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-start">
              <label className="flex items-start cursor-pointer group">
                <input 
                  type="checkbox" 
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="sr-only"
                />
                <div 
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 mt-0.5 flex-shrink-0 ${
                    agreeToTerms 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 shadow-lg shadow-purple-500/30' 
                      : 'bg-white/5 border-white/20 group-hover:border-purple-400/50 group-hover:bg-white/10'
                  }`}
                >
                  {agreeToTerms && (
                    <Check className="w-3 h-3 text-white animate-scale-in" />
                  )}
                </div>
                <span className="ml-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-5">
                  I agree to the{' '}
                  <button type="button" className="text-purple-400 hover:text-purple-300 transition-colors hover:underline">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-purple-400 hover:text-purple-300 transition-colors hover:underline">
                    Privacy Policy
                  </button>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-8">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/signin')}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage; 