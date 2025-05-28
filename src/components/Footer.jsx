import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Globe, MessageCircle } from 'lucide-react';
import Mail from './icons/Mail';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-slate-900/50 backdrop-blur-lg border-t border-white/10 py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Moon className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Luna</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Unlocking the mysteries of your subconscious mind through AI-powered dream interpretation.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-purple-400 transition-colors">Home</Link></li>
              <li><Link to="/faq" className="hover:text-purple-400 transition-colors">FAQ</Link></li>
              <li><button className="hover:text-purple-400 transition-colors">About</button></li>
              <li><button className="hover:text-purple-400 transition-colors">Contact</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Research</a></li>
              <li><button className="hover:text-purple-400 transition-colors">FAQ</button></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <Globe className="w-6 h-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
              <MessageCircle className="w-6 h-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
              <Mail className="w-6 h-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>© 2025 Luna Dream Interpreter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 