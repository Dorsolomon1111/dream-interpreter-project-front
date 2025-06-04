import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  Heart, 
  Moon, 
  Sun, 
  Cloud, 
  Star,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  ArrowLeft,
  Sparkles,
  Eye,
  Target,
  Zap,
  X,
  Share2,
  Download
} from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { getSavedDreams } from '../utils/localStorage';
import { useAuth } from '../contexts/AuthContext';

interface DreamInsights {
  totalDreams: number;
  sentimentAnalysis: {
    positive: number;
    negative: number;
    neutral: number;
  };
  commonTags: Array<{ tag: string; count: number }>;
  commonThemes: Array<{ theme: string; count: number }>;
  commonSymbols: Array<{ symbol: string; count: number }>;
  moodDistribution: Array<{ mood: string; count: number }>;
  averageClarity: number;
  recentActivity: {
    last7Days: number;
    last30Days: number;
  };
  dreamPatterns: {
    mostActiveDay: string;
    averageDreamLength: number;
    longestDream: number;
    shortestDream: number;
  };
}

const InsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [dreams, setDreams] = useState<any[]>([]);
  const [insights, setInsights] = useState<DreamInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'dreams'>('overview');
  const [selectedDream, setSelectedDream] = useState<any | null>(null);
  const [showDreamModal, setShowDreamModal] = useState(false);

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
    
    loadDreamInsights();
    
    return () => {
      clearTimeout(timeoutId);
      // Restore automatic scroll restoration when leaving
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showDreamModal) {
        closeDreamModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showDreamModal]);

  const loadDreamInsights = async () => {
    setIsLoading(true);
    try {
      // Try to get insights from backend API first
      const userId = "test-user-1"; // For testing - in real app this would come from auth
      
      try {
        const response = await fetch(`http://localhost:3000/api/dreams/insights?userId=${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.data && data.data.totalDreams > 0) {
            setInsights(data.data);
            setDreams(data.dreams || []);
            setIsLoading(false);
            return;
          }
        }
      } catch (apiError) {
        console.log('Backend API not available, falling back to localStorage');
      }

      // Fallback to localStorage if API call fails
      const savedDreams = getSavedDreams();
      setDreams(savedDreams);
      
      if (savedDreams.length === 0) {
        setInsights(null);
        setIsLoading(false);
        return;
      }

      // Generate mock insights for localStorage dreams
      const mockInsights: DreamInsights = {
        totalDreams: savedDreams.length,
        sentimentAnalysis: {
          positive: Math.floor(savedDreams.length * 0.4),
          negative: Math.floor(savedDreams.length * 0.3),
          neutral: Math.floor(savedDreams.length * 0.3),
        },
        commonTags: [
          { tag: 'vivid', count: Math.floor(savedDreams.length * 0.6) },
          { tag: 'symbolic', count: Math.floor(savedDreams.length * 0.4) },
          { tag: 'emotional', count: Math.floor(savedDreams.length * 0.3) },
        ],
        commonThemes: [
          { theme: 'transformation', count: Math.floor(savedDreams.length * 0.5) },
          { theme: 'relationships', count: Math.floor(savedDreams.length * 0.3) },
          { theme: 'growth', count: Math.floor(savedDreams.length * 0.2) },
        ],
        commonSymbols: [
          { symbol: 'water', count: Math.floor(savedDreams.length * 0.4) },
          { symbol: 'flying', count: Math.floor(savedDreams.length * 0.3) },
          { symbol: 'house', count: Math.floor(savedDreams.length * 0.2) },
        ],
        moodDistribution: [
          { mood: 'peaceful', count: Math.floor(savedDreams.length * 0.4) },
          { mood: 'anxious', count: Math.floor(savedDreams.length * 0.3) },
          { mood: 'curious', count: Math.floor(savedDreams.length * 0.3) },
        ],
        averageClarity: 7.2,
        recentActivity: {
          last7Days: Math.floor(savedDreams.length * 0.3),
          last30Days: savedDreams.length,
        },
        dreamPatterns: {
          mostActiveDay: 'Tuesday',
          averageDreamLength: 250,
          longestDream: 500,
          shortestDream: 100,
        },
      };

      setInsights(mockInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTagIcon = (tag: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'vivid': <Sparkles className="w-4 h-4" />,
      'symbolic': <Eye className="w-4 h-4" />,
      'emotional': <Heart className="w-4 h-4" />,
      'nightmare': <Cloud className="w-4 h-4" />,
      'good_dream': <Sun className="w-4 h-4" />,
      'lucid': <Target className="w-4 h-4" />,
      'flying': <Zap className="w-4 h-4" />,
    };
    return iconMap[tag] || <Star className="w-4 h-4" />;
  };

  const getTagColor = (tag: string) => {
    const colorMap: Record<string, string> = {
      'vivid': 'from-purple-500 to-pink-500',
      'symbolic': 'from-blue-500 to-cyan-500',
      'emotional': 'from-red-500 to-pink-500',
      'nightmare': 'from-gray-600 to-gray-800',
      'good_dream': 'from-yellow-400 to-orange-500',
      'lucid': 'from-green-400 to-blue-500',
      'flying': 'from-indigo-500 to-purple-500',
    };
    return colorMap[tag] || 'from-purple-500 to-blue-500';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const openDreamModal = (dream: any) => {
    setSelectedDream(dream);
    setShowDreamModal(true);
  };

  const closeDreamModal = () => {
    setSelectedDream(null);
    setShowDreamModal(false);
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeDreamModal();
    }
  };

  const handleShareDream = async (dream: any) => {
    const shareText = `🌙 My Dream Interpretation from Luna

📅 ${new Date(dream.timestamp).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    })}

💭 Dream: ${dream.dreamText}

🔮 Interpretation: ${dream.interpretation}

✨ Tags: ${dream.tags?.join(', ') || 'None'}
💝 Sentiment: ${dream.sentiment || 'Unknown'}
🎭 Mood: ${dream.mood || 'Unknown'}
⭐ Clarity: ${dream.clarity || 'Unknown'}/10

Interpreted by Luna - AI Dream Analysis
Visit: ${window.location.origin}
`;

    const shareData = {
      title: 'My Dream Interpretation - Luna',
      text: shareText,
      url: window.location.origin
    };

    try {
      // Try native Web Share API first (mobile browsers)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        
        // Show temporary success message
        const tempNotification = document.createElement('div');
        tempNotification.innerHTML = `
          <div class="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Dream copied to clipboard!
          </div>
        `;
        document.body.appendChild(tempNotification);
        
        setTimeout(() => {
          document.body.removeChild(tempNotification);
        }, 3000);
      }
    } catch (error: any) {
      // Check if user cancelled the share (this is normal behavior)
      if (error.name === 'AbortError' || error.message === 'Share canceled') {
        // User cancelled sharing - don't show error message
        return;
      }
      
      console.error('Error sharing dream:', error);
      // Only show error for actual failures, not cancellations
      const tempNotification = document.createElement('div');
      tempNotification.innerHTML = `
        <div class="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Unable to share dream
        </div>
      `;
      document.body.appendChild(tempNotification);
      
      setTimeout(() => {
        document.body.removeChild(tempNotification);
      }, 3000);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 mx-auto text-purple-400 animate-pulse mb-4" />
          <h2 className="text-2xl font-bold mb-2">Analyzing Your Dreams</h2>
          <p className="text-gray-400">Generating personalized insights...</p>
        </div>
      </div>
    );
  }

  if (!insights || dreams.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white">
        <Navigation />
        <div className="relative z-10 px-6 lg:px-12 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Moon className="w-20 h-20 mx-auto text-purple-400 mb-8 animate-float" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Your Dream Journey Awaits
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              Start interpreting your dreams to unlock personalized insights and patterns.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              Interpret Your First Dream
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 left-[10%] top-[20%]" />
        <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 right-[15%] bottom-[20%]" />
      </div>

      <Navigation />

      <div className="relative z-10 px-6 lg:px-12 py-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Brain className="w-16 h-16 mx-auto text-purple-400 mb-6 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Dream Insights
            </h1>
            {isAuthenticated && user && (
              <div className="mb-4">
                <p className="text-xl text-gray-300 mb-2">
                  Welcome back, <span className="text-purple-400 font-semibold">{user.firstName}</span>! ✨
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                  <span>📧 {user.email}</span>
                  <span>🎯 {user.subscription.plan} plan</span>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-300 hover:text-red-200 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
            <p className="text-xl text-gray-300">
              Discover patterns and meanings in your subconscious mind
            </p>
          </div>

          {/* Tab Navigation - Redesigned with Amazing Animations */}
          <div className="flex justify-center mb-16">
            <div className="relative bg-gradient-to-r from-slate-800/50 via-purple-900/30 to-slate-800/50 backdrop-blur-xl rounded-2xl p-1 border border-white/10 shadow-2xl shadow-purple-500/20">
              {/* Animated sliding background */}
              <div 
                className="absolute top-1 bottom-1 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 rounded-xl transition-all duration-500 ease-out shadow-lg shadow-purple-500/50"
                style={{
                  left: activeTab === 'overview' ? '4px' : activeTab === 'patterns' ? 'calc(33.333% + 1px)' : 'calc(66.666% - 1px)',
                  width: 'calc(33.333% - 2px)',
                }}
              />
              
              {/* Glowing particles effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-ping" style={{ top: '20%', left: '15%', animationDelay: '0s' }} />
                <div className="absolute w-1 h-1 bg-pink-400 rounded-full opacity-40 animate-ping" style={{ top: '70%', right: '20%', animationDelay: '1s' }} />
                <div className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full opacity-50 animate-ping" style={{ bottom: '25%', left: '80%', animationDelay: '2s' }} />
              </div>
              
              <div className="relative flex">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'patterns', label: 'Patterns', icon: TrendingUp },
                  { id: 'dreams', label: 'Dreams', icon: Moon },
                ].map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative px-8 py-4 rounded-xl transition-all duration-500 ease-out flex items-center justify-center gap-3 min-h-[56px] group ${
                      activeTab === tab.id 
                        ? 'text-white scale-105 font-bold' 
                        : 'text-gray-400 hover:text-white hover:scale-102 font-medium'
                    }`}
                    style={{ 
                      flex: '1',
                      transform: activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                  >
                    {/* Icon with special effects */}
                    <div className={`relative transition-all duration-500 ${
                      activeTab === tab.id ? 'animate-pulse' : 'group-hover:rotate-12'
                    }`}>
                      <tab.icon className={`w-5 h-5 transition-all duration-300 ${
                        activeTab === tab.id 
                          ? 'drop-shadow-lg filter brightness-110' 
                          : 'group-hover:scale-110'
                      }`} />
                      {activeTab === tab.id && (
                        <div className="absolute inset-0 w-5 h-5 bg-white/20 rounded-full blur-sm animate-pulse" />
                      )}
                    </div>
                    
                    {/* Text with glow effect */}
                    <span className={`relative transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'text-shadow-lg drop-shadow-sm' 
                        : 'group-hover:drop-shadow-sm'
                    }`}>
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="absolute inset-0 text-white/30 blur-sm animate-pulse">
                          {tab.label}
                        </div>
                      )}
                    </span>
                    
                    {/* Hover glow effect */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/0 via-pink-500/0 to-blue-600/0 transition-all duration-300 ${
                      activeTab !== tab.id ? 'group-hover:from-purple-600/10 group-hover:via-pink-500/10 group-hover:to-blue-600/10' : ''
                    }`} />
                  </button>
                ))}
              </div>
              
              {/* Bottom glow line */}
              <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse" />
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Moon className="w-8 h-8 text-purple-400" />
                    <span className="text-2xl font-bold">{insights.totalDreams}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Total Dreams</h3>
                  <p className="text-gray-400 text-sm">Dreams analyzed</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Star className="w-8 h-8 text-yellow-400" />
                    <span className="text-2xl font-bold">{insights.averageClarity.toFixed(1)}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Clarity Score</h3>
                  <p className="text-gray-400 text-sm">Average detail level</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Calendar className="w-8 h-8 text-blue-400" />
                    <span className="text-2xl font-bold">{insights.recentActivity.last7Days}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">This Week</h3>
                  <p className="text-gray-400 text-sm">Dreams recorded</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 text-green-400" />
                    <span className="text-lg font-bold">{insights.dreamPatterns.mostActiveDay}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Most Active</h3>
                  <p className="text-gray-400 text-sm">Dream day</p>
                </div>
              </div>

              {/* Sentiment Analysis */}
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-400" />
                  Emotional Landscape
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-500/10 rounded-2xl border border-green-500/20">
                    <div className="text-3xl font-bold text-green-400 mb-2">{insights.sentimentAnalysis.positive}</div>
                    <div className="text-green-300 font-semibold">Positive Dreams</div>
                    <div className="text-gray-400 text-sm mt-1">Uplifting & inspiring</div>
                  </div>
                  <div className="text-center p-6 bg-gray-500/10 rounded-2xl border border-gray-500/20">
                    <div className="text-3xl font-bold text-gray-400 mb-2">{insights.sentimentAnalysis.neutral}</div>
                    <div className="text-gray-300 font-semibold">Neutral Dreams</div>
                    <div className="text-gray-400 text-sm mt-1">Balanced & reflective</div>
                  </div>
                  <div className="text-center p-6 bg-red-500/10 rounded-2xl border border-red-500/20">
                    <div className="text-3xl font-bold text-red-400 mb-2">{insights.sentimentAnalysis.negative}</div>
                    <div className="text-red-300 font-semibold">Challenging Dreams</div>
                    <div className="text-gray-400 text-sm mt-1">Growth opportunities</div>
                  </div>
                </div>
              </div>

              {/* Common Themes & Tags */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    Common Themes
                  </h2>
                  <div className="space-y-4">
                    {insights.commonThemes.slice(0, 5).map((theme, index) => (
                      <div key={theme.theme} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                          <span className="font-semibold capitalize">{theme.theme}</span>
                        </div>
                        <div className="text-purple-400 font-bold">{theme.count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Eye className="w-6 h-6 text-blue-400" />
                    Dream Symbols
                  </h2>
                  <div className="space-y-4">
                    {insights.commonSymbols.slice(0, 5).map((symbol, index) => (
                      <div key={symbol.symbol} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                          <span className="font-semibold capitalize">{symbol.symbol}</span>
                        </div>
                        <div className="text-blue-400 font-bold">{symbol.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'patterns' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  Dream Patterns Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-2xl font-bold text-purple-400 mb-2">{insights.dreamPatterns.averageDreamLength}</div>
                    <div className="text-gray-300 font-semibold">Avg Length</div>
                    <div className="text-gray-400 text-sm">Characters</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-2xl font-bold text-blue-400 mb-2">{insights.dreamPatterns.longestDream}</div>
                    <div className="text-gray-300 font-semibold">Longest</div>
                    <div className="text-gray-400 text-sm">Most detailed</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-2xl font-bold text-yellow-400 mb-2">{insights.dreamPatterns.shortestDream}</div>
                    <div className="text-gray-300 font-semibold">Shortest</div>
                    <div className="text-gray-400 text-sm">Most concise</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-2xl font-bold text-green-400 mb-2">{insights.dreamPatterns.mostActiveDay}</div>
                    <div className="text-gray-300 font-semibold">Peak Day</div>
                    <div className="text-gray-400 text-sm">Most dreams</div>
                  </div>
                </div>
              </div>

              {/* Mood Distribution */}
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-400" />
                  Mood Distribution
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {insights.moodDistribution.map((mood, index) => (
                    <div key={mood.mood} className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="text-3xl font-bold text-purple-400 mb-2">{mood.count}</div>
                      <div className="text-gray-300 font-semibold capitalize">{mood.mood}</div>
                      <div className="text-gray-400 text-sm mt-1">Dreams with this mood</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dreams' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Your Dream Collection</h2>
                <p className="text-gray-400">Explore your interpreted dreams and their insights</p>
              </div>
              
              <div className="grid gap-6">
                {dreams.map((dream, index) => (
                  <div key={dream.id} className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold">Dream #{dream.id}</div>
                          <div className="text-gray-400 text-sm">{new Date(dream.timestamp).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {dream.tags?.map((tag: string) => (
                          <span 
                            key={tag}
                            className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getTagColor(tag)} text-white flex items-center gap-1`}
                          >
                            {getTagIcon(tag)}
                            {tag.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Dream Description:</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{dream.dreamText.substring(0, 200)}...</p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Interpretation:</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{dream.interpretation.substring(0, 150)}...</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {dream.sentiment && (
                          <span className={`flex items-center gap-1 ${getSentimentColor(dream.sentiment)}`}>
                            <Heart className="w-4 h-4" />
                            {dream.sentiment}
                          </span>
                        )}
                        {dream.clarity && (
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            Clarity: {dream.clarity}/10
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleShareDream(dream)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30 transition-all duration-300 group"
                          title="Share this dream"
                        >
                          <Share2 className="w-4 h-4 text-gray-400 group-hover:text-purple-400" />
                        </button>
                        <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-semibold" onClick={() => openDreamModal(dream)}>
                          View Full Dream →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showDreamModal && selectedDream && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-slate-900 rounded-3xl border border-white/10 max-w-4xl w-full max-h-[85vh] overflow-y-auto scrollbar-hide">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                    #{selectedDream.id}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Dream Details</h2>
                    <p className="text-gray-400">{new Date(selectedDream.timestamp).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
                <button 
                  onClick={closeDreamModal}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-400/30 flex items-center justify-center transition-all duration-300 group"
                >
                  <X className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Tags */}
              {selectedDream.tags && selectedDream.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Dream Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDream.tags.map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getTagColor(tag)} text-white flex items-center gap-1`}
                      >
                        {getTagIcon(tag)}
                        {tag.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dream Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Moon className="w-5 h-5 text-purple-400" />
                  Your Dream
                </h3>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <p className="text-gray-300 leading-relaxed">{selectedDream.dreamText}</p>
                </div>
              </div>

              {/* Interpretation */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  Luna's Interpretation
                </h3>
                <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-6 border border-purple-400/20">
                  <p className="text-gray-300 leading-relaxed">{selectedDream.interpretation}</p>
                </div>
              </div>

              {/* Dream Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedDream.sentiment && (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-pink-400" />
                      <span className="text-sm font-medium text-gray-400">Sentiment</span>
                    </div>
                    <div className={`font-semibold capitalize ${getSentimentColor(selectedDream.sentiment)}`}>
                      {selectedDream.sentiment}
                    </div>
                  </div>
                )}

                {selectedDream.mood && (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-400">Mood</span>
                    </div>
                    <div className="font-semibold text-white capitalize">
                      {selectedDream.mood}
                    </div>
                  </div>
                )}

                {selectedDream.clarity && (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-400">Clarity</span>
                    </div>
                    <div className="font-semibold text-white">
                      {selectedDream.clarity}/10
                    </div>
                  </div>
                )}

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-400">Length</span>
                  </div>
                  <div className="font-semibold text-white">
                    {selectedDream.dreamText.length} chars
                  </div>
                </div>
              </div>

              {/* Themes & Symbols */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedDream.themes && selectedDream.themes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      Themes
                    </h3>
                    <div className="space-y-2">
                      {selectedDream.themes.map((theme: string, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                          <span className="text-gray-300 capitalize">{theme}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDream.symbols && selectedDream.symbols.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-400" />
                      Symbols
                    </h3>
                    <div className="space-y-2">
                      {selectedDream.symbols.map((symbol: string, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                          <span className="text-gray-300 capitalize">{symbol}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button 
                  data-share-button
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300 flex items-center justify-center gap-2" 
                  onClick={() => handleShareDream(selectedDream)}
                >
                  <Share2 className="w-4 h-4" />
                  Share Dream
                </button>
                <button className="flex-1 py-3 px-6 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default InsightsPage; 