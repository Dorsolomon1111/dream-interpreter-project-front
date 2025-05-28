import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import FAQPage from './pages/FAQPage';

// Main App Component
const LunaApp = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

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