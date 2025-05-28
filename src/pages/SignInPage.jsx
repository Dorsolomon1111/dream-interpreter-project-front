import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Loader2, Check, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Scroll to top when Sign In page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate sign in process
    setTimeout(() => {
      setIsLoading(false);
      // Could redirect to dashboard or show success message
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

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
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only" 
                  />
                  <div 
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      rememberMe 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400' 
                        : 'bg-white/5 border-white/20 hover:border-purple-400/50'
                    }`}
                  >
                    {rememberMe && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm text-gray-400">Remember me</span>
              </label>
              <button type="button" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Social Sign In */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-300">
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-300">
              <span className="text-sm font-medium">Apple</span>
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/signup')}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
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