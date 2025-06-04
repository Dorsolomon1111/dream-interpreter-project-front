import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate there first
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // We're already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserDisplayName = () => {
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'User';
  };

  const getUserInitials = () => {
    if (user) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="relative z-50 p-6 lg:px-12">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Moon className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Luna</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {/* Navigation links that show for both authenticated and non-authenticated users */}
          {!isAuthenticated && (
            <>
              <button onClick={() => scrollToSection('features')} className="hover:text-purple-400 transition-colors cursor-pointer">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-purple-400 transition-colors cursor-pointer">How it Works</button>
              <button onClick={() => scrollToSection('testimonials')} className="hover:text-purple-400 transition-colors cursor-pointer">Testimonials</button>
            </>
          )}
          
          {/* Always show these links */}
          <Link to="/insights" className="hover:text-purple-400 transition-colors">Insights</Link>
          <Link to="/faq" className="hover:text-purple-400 transition-colors">FAQ</Link>
          
          {/* Show different UI based on authentication status */}
          {isAuthenticated ? (
            /* Authenticated User Menu */
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 px-4 py-2 bg-white/5 backdrop-blur-lg rounded-full border border-white/10 hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300"
              >
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials()}
                  </div>
                )}
                <span className="text-sm font-medium text-white">{user?.firstName || 'User'}</span>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      {user?.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt="Profile" 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {getUserInitials()}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold">{getUserDisplayName()}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                        {user?.subscription && (
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            user.subscription.plan === 'premium' 
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                              : 'bg-gray-600 text-gray-200'
                          }`}>
                            {user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate('/insights');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span>My Insights</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        // Navigate to profile/settings when we have that page
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    
                    <div className="border-t border-white/10 my-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Non-authenticated Sign In Button */
            <Link 
              to="/signin"
              className="relative px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-300 overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></span>
              <span className="relative font-medium">Start Free</span>
            </Link>
          )}
        </div>
        
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-lg p-6 md:hidden overflow-hidden transition-all duration-300 ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="flex flex-col space-y-4">
          {/* Mobile navigation for non-authenticated users */}
          {!isAuthenticated && (
            <>
              <button onClick={() => { scrollToSection('features'); setIsMenuOpen(false); }} className="hover:text-purple-400 transition-colors transform transition-all duration-300 hover:translate-x-2 text-left">Features</button>
              <button onClick={() => { scrollToSection('how-it-works'); setIsMenuOpen(false); }} className="hover:text-purple-400 transition-colors transform transition-all duration-300 hover:translate-x-2 text-left">How it Works</button>
              <button onClick={() => { scrollToSection('testimonials'); setIsMenuOpen(false); }} className="hover:text-purple-400 transition-colors transform transition-all duration-300 hover:translate-x-2 text-left">Testimonials</button>
            </>
          )}
          
          <Link to="/insights" onClick={() => setIsMenuOpen(false)} className="hover:text-purple-400 transition-colors transform transition-all duration-300 hover:translate-x-2 text-left">Insights</Link>
          <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="hover:text-purple-400 transition-colors transform transition-all duration-300 hover:translate-x-2 text-left">FAQ</Link>
          
          {isAuthenticated ? (
            /* Mobile authenticated user section */
            <>
              <div className="border-t border-white/20 pt-4">
                <div className="flex items-center space-x-3 mb-4 p-3 bg-white/5 rounded-lg">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getUserInitials()}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">{getUserDisplayName()}</p>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-400/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
              </button>
            </>
          ) : (
            /* Mobile sign in button for non-authenticated users */
            <Link to="/signin" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transform transition-all duration-300 hover:scale-105 text-center">
              Start Free
            </Link>
          )}
        </div>
      </div>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navigation; 