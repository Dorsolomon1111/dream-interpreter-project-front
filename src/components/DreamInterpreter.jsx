import React, { useState } from 'react';
import { Feather, Brain, Loader2 } from 'lucide-react';
import { interpretDream } from '../utils/dreamInterpreter';

const DreamInterpreter = () => {
  const [dreamText, setDreamText] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);

  const handleInterpretDream = async () => {
    if (!dreamText.trim()) return;
    
    setIsInterpreting(true);
    try {
      const result = await interpretDream(dreamText);
      setInterpretation(result);
    } catch (error) {
      console.error('Error interpreting dream:', error);
      setInterpretation('Sorry, there was an error interpreting your dream. Please try again.');
    } finally {
      setIsInterpreting(false);
    }
  };

  return (
    <section id="interpreter" className="relative z-10 px-6 lg:px-12 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            <Feather className="inline-block w-8 h-8 mr-2 text-purple-400" />
            Share Your Dream
          </h2>
          
          <textarea
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            placeholder="Describe your dream in detail... What did you see? How did you feel? Who was there?"
            className="w-full h-48 p-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300 resize-none"
          />
          
          <button
            onClick={handleInterpretDream}
            disabled={isInterpreting || !dreamText.trim()}
            className="mt-6 w-full py-4 rounded-full text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative group overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transform hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.5)]"
          >
            <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center gap-2">
              {isInterpreting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Interpreting Your Dream...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Interpret Dream
                </>
              )}
            </span>
          </button>
          
          {interpretation && (
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl border border-purple-400/20 animate-fadeIn">
              <h3 className="text-xl font-bold mb-4 text-purple-300">Your Dream Interpretation</h3>
              <div className="whitespace-pre-wrap text-gray-300">{interpretation}</div>
              
              <div className="mt-6 flex gap-4">
                <button className="relative px-6 py-2.5 rounded-full transition-all duration-300 bg-white/5 backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/60 group overflow-hidden">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/20 to-purple-600/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  <span className="relative font-medium">Save Interpretation</span>
                </button>
                <button className="relative px-6 py-2.5 rounded-full transition-all duration-300 bg-white/5 backdrop-blur-sm border border-blue-400/30 hover:border-blue-400/60 group overflow-hidden">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-blue-600/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  <span className="relative font-medium">Share Insights</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DreamInterpreter; 