import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Loader2, Check, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Scroll to top when Sign Up page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    // Simulate sign up process
    setTimeout(() => {
      setIsLoading(false);
      // Could redirect to welcome page or show success message
    }, 2000);
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
          <h1 className="text-3xl font-bold mb-2">Join Luna</h1>
          <p className="text-gray-400">Start your journey into dream interpretation</p>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Sign Up Form */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                  placeholder="First name"
                  required
                />
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                  placeholder="Last name"
                  required
                />
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className="flex items-start">
              <div className="relative flex-shrink-0 mt-0.5">
                <input 
                  type="checkbox" 
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="sr-only"
                />
                <div 
                  onClick={() => setAgreeToTerms(!agreeToTerms)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    agreeToTerms 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400' 
                      : 'bg-white/5 border-white/20 hover:border-purple-400/50'
                  }`}
                >
                  {agreeToTerms && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-400 cursor-pointer leading-5">
                I agree to the{' '}
                <button type="button" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Terms of Service
                </button>
                {' '}and{' '}
                <button type="button" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Privacy Policy
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-white">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Sign Up */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-300">
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-300">
              <span className="text-sm font-medium">Apple</span>
            </button>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/signin')}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage; 