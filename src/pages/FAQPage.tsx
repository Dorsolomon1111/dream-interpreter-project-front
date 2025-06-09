import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import { faqData } from '../data/faqData';

interface FAQPageProps {
  expandedFAQ: string | null;
  setExpandedFAQ: (value: string | null) => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ expandedFAQ, setExpandedFAQ }) => {
  const navigate = useNavigate();

  // Scroll to top when FAQ page mounts - with proper scroll restoration handling
  useEffect(() => {
    // Disable automatic scroll restoration for this navigation
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top immediately and after a short delay
    window.scrollTo(0, 0);
    
    // Additional scroll to top after component has fully mounted
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      // Restore automatic scroll restoration when leaving
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <Brain className="w-12 h-12 mx-auto text-purple-400 mb-4 animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-300 mt-4">
          Everything you need to know about Luna's AI-powered dream interpretation.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-purple-300 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              {category.category}
            </h2>
            
            <div className="space-y-4">
              {category.questions.map((faq, faqIndex) => {
                const isExpanded = expandedFAQ === `${categoryIndex}-${faqIndex}`;
                return (
                  <div 
                    key={faqIndex}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden hover:border-purple-400/30 transition-all duration-300"
                  >
                    <button
                      onClick={() => setExpandedFAQ(isExpanded ? null : `${categoryIndex}-${faqIndex}`)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-all duration-300"
                    >
                      <h3 className="text-lg font-semibold text-white pr-4">{faq.q}</h3>
                      <ChevronRight 
                        className={`w-5 h-5 text-purple-400 transition-transform duration-300 flex-shrink-0 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="px-6 pb-6">
                        <div className="h-px bg-gradient-to-r from-purple-400/50 to-blue-400/50 mb-4"></div>
                        <p className="text-gray-300 leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* FAQ CTA */}
      <div className="max-w-4xl mx-auto mt-16">
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-3xl p-8 md:p-12 border border-purple-400/20 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-300 mb-6">
            Our support team is here to help you unlock the mysteries of your dreams
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/')}
              className="group relative px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transform hover:scale-105"
            >
              <span className="relative flex items-center gap-2">
                Try Dream Interpreter
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="relative px-8 py-3 rounded-full text-lg transition-all duration-300 bg-white/5 backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/60 hover:bg-white/10">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage; 