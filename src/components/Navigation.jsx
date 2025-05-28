import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
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

  return (
    <nav className="relative z-50 p-6 lg:px-12">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Moon className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Luna</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => scrollToSection('features')} className="hover:text-purple-400 transition-colors cursor-pointer">Features</button>
          <button onClick={() => scrollToSection('how-it-works')} className="hover:text-purple-400 transition-colors cursor-pointer">How it Works</button>
          <button onClick={() => scrollToSection('testimonials')} className="hover:text-purple-400 transition-colors cursor-pointer">Testimonials</button>
          <Link to="/faq" className="hover:text-purple-400 transition-colors">FAQ</Link>
          <Link 
            to="/signin"
            className="relative px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-300 overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></span>
            <span className="relative font-medium">Start Free</span>
          </Link>
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
        isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="flex flex-col space-y-4">
          <button onClick={() => { scrollToSection('features'); setIsMenuOpen(false); }} className="hover:text-purple-400 transition-colors transform transition-all duration-300 hover:translate-x-2 text-left">Features</button>
          <button onClick={() => { scrollToSection('how-it-works'); setIsMenuOpen(false); }} className="hover:text-purple-400 transition-colors transform transition-all duration-300 hover:translate-x-2 text-left">How it Works</button>
          <button onClick={() => { scrollToSection('testimonials'); setIsMenuOpen(false); }} className="hover:text-purple-400 transition-colors transform transition-all duration-300 hover:translate-x-2 text-left">Testimonials</button>
          <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="hover:text-purple-400 transition-colors transform transition-all duration-300 hover:translate-x-2 text-left">FAQ</Link>
          <Link to="/signin" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transform transition-all duration-300 hover:scale-105 text-center">
            Start Free
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 