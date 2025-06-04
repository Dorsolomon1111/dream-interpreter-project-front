import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import SignInPage from './pages/SignInPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import FAQPage from './pages/FAQPage.tsx';

// Main App Component
const LunaApp: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route 
          path="/faq" 
          element={
            <FAQPage 
              expandedFAQ={expandedFAQ} 
              setExpandedFAQ={setExpandedFAQ} 
            />
          } 
        />
      </Routes>
    </Router>
  );
};

export default LunaApp;