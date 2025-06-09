import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import FAQPage from './pages/FAQPage';
import InsightsPage from './pages/InsightsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

// Google OAuth Client ID - in production, store this in environment variables
const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

function App() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route 
                path="/faq" 
                element={
                  <FAQPage 
                    expandedFAQ={expandedFAQ} 
                    setExpandedFAQ={setExpandedFAQ} 
                  />
                } 
              />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;