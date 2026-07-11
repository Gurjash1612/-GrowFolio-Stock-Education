import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Bot, 
  GraduationCap, 
  Coins, 
  CheckCircle2, 
  ArrowUpRight, 
  ChevronRight, 
  Zap, 
  HelpCircle, 
  Play, 
  Sparkles,
  Award,
  BookOpen,
  User,
  Github,
  Linkedin,
  Instagram,
  Mail,
  X,
  Droplet,
  Smartphone,
  ChevronDown,
  Pause,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Phone
} from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: (tab?: 'dashboard' | 'academy' | 'simulator' | 'coach', subtab?: 'garden' | 'arcade' | 'rewards' | 'social' | 'notebook' | 'analytics') => void;
}

export function LandingPage({ onLaunchApp }: LandingPageProps) {
  const [activeScreenshot, setActiveScreenshot] = useState<'home' | 'academy' | 'simulator' | 'coach' | 'profile' | 'arcade'>('home');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  
  // Interactive App Reel States
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [reelPlaying, setReelPlaying] = useState(true);
  const [reelProgress, setReelProgress] = useState(0);

  // Auto-playing progress loop for the App Reel
  useEffect(() => {
    if (!showDemoModal || !reelPlaying) return;

    const intervalTime = 50; // Update progress every 50ms
    const totalDuration = 6000; // 6 seconds per slide
    const stepIncrement = (100 / (totalDuration / intervalTime));

    const timer = setInterval(() => {
      setReelProgress((prev) => {
        if (prev >= 100) {
          setActiveReelIndex((idx) => (idx + 1) % 5);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [showDemoModal, reelPlaying, activeReelIndex]);

  const handleNextReel = () => {
    setActiveReelIndex((prev) => (prev + 1) % 5);
    setReelProgress(0);
  };

  const handlePrevReel = () => {
    setActiveReelIndex((prev) => (prev - 1 + 5) % 5);
    setReelProgress(0);
  };
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'General Feedback', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      alert("Please fill in all the fields.");
      return;
    }
    setContactSubmitted(true);
  };

  // Floating particles generator for the GrowTree
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number; scale: number }[]>([]);

  useEffect(() => {
    // Generate static-ish particles for the background tree glow
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 60,
      delay: Math.random() * 5,
      scale: 0.5 + Math.random() * 0.8
    }));
    setParticles(newParticles);
  }, []);

  const features = [
    {
      icon: <Bot className="w-5 h-5 text-green-400" />,
      title: "AI Coach",
      description: "Get real-time feedback on your simulated trades. Personalized analysis on your emotional behavior and portfolio risk metrics."
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
      title: "Interactive Lessons",
      description: "Learn options greeks, fundamental analysis, and algorithmic market plumbing via bite-sized interactive flashcards."
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
      title: "Stock Simulator",
      description: "Simulate volatile live-price stocks (NVDA, TSLA) using realistic order books and real-time news impact catalysts."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      title: "GrowTree Companion",
      description: "Water and fertilize your visual Sprout companion. Watch your portfolio grow physically as your investing wisdom compounds."
    },
    {
      icon: <Zap className="w-5 h-5 text-green-400" />,
      title: "Daily Challenges",
      description: "Spin the Wheel of Fortune and answer fast-paced daily quests to earn bonus XP and virtual gold rewards."
    },
    {
      icon: <Award className="w-5 h-5 text-emerald-400" />,
      title: "XP & Leaderboards",
      description: "Climb the multi-tier investor leagues from Novice to Strategist, earning official verifiable certificates of completion."
    },
    {
      icon: <Coins className="w-5 h-5 text-green-400" />,
      title: "Virtual Portfolio",
      description: "Manage simulated starter cash. Unlock premium dashboard skins, cosmetic themes, and exotic Sprout companions."
    },
    {
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      title: "1,000+ Level Academy Arcade",
      description: "Put your charting skills to the test with rapid Market Predictor stages, Candlestick Matcher lessons, and Breakout puzzles with 1,000+ progressive levels."
    }
  ];

  const faqs = [
    {
      q: "Is GrowFolio free?",
      a: "Yes, absolutely! GrowFolio is completely free to play, learn, and simulate. You can practice as much as you like without any paywalls on core educational contents."
    },
    {
      q: "Can beginners use it?",
      a: "Definitely. In fact, GrowFolio is tailor-made for complete novices. We hold your hand from basic definitions all the way to complex derivative option spreads."
    },
    {
      q: "Is real money required?",
      a: "No. GrowFolio uses 100% simulated, risk-free virtual cash. It is designed entirely for educational mastery and psychological confidence before you ever touch a real broker."
    },
    {
      q: "Is the AI Coach always available?",
      a: "Yes. Our bespoke study advisor uses powerful, instant analytics pipelines to evaluate your trade performance, risk distributions, and behavioral pitfalls whenever you ask."
    }
  ];

  const REEL_SCENES = [
    {
      title: "🌱 Plant & Grow Your Sprout",
      subtitle: "Your Sprout's vitality mirrors your financial wisdom and portfolio balance.",
      badge: "COMPANION TREE",
      description: "Learn options greeks, answer fast daily quests, and top up virtual cash to cultivate exotic companion plants.",
    },
    {
      title: "📈 Risk-Free Trading Floor",
      subtitle: "Simulate nvda, tsla with dynamic news triggers and real-time order books.",
      badge: "STOCK SIMULATOR",
      description: "Execute simulated calls, puts, and stock purchases with zero actual capital hazard. Compound confidence.",
    },
    {
      title: "🎓 Master Options & Greeks",
      subtitle: "Bite-sized visual modules covering Delta, Gamma, Theta, and complex spreads.",
      badge: "ACADEMY DECK",
      description: "Master derivative mechanics through high-contrast diagrams, intuitive slider calculators, and flashcards.",
    },
    {
      title: "🤖 24/7 Smart AI Mentorship",
      subtitle: "GrowBot checks your emotional behavior, portfolio leverage, and trade timing.",
      badge: "GROWBOT AI COACH",
      description: "Get real-time critical advice on risk distribution and avoid critical psychological traps.",
    },
    {
      title: "🏆 Conquer the leagues",
      subtitle: "Earn virtual gold, solve daily quests, and unlock customizable dashboard skins.",
      badge: "INVESTOR LEAGUES",
      description: "Rise from Novice, to Day-Trader, up to elite Master Strategist with certified portfolio status badges.",
    }
  ];

  return (
    <div className="bg-[#000000] text-white min-h-screen font-sans selection:bg-emerald-500/30 selection:text-emerald-400 overflow-x-hidden relative">
      {/* Premium ambient high-tech grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0 opacity-60" />
      
      {/* HEADER NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/[0.04] py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)] text-emerald-400">
              <svg viewBox="0 0 100 100" className="w-5 h-5 animate-pulse" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 75 Q40 70 50 50 T80 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <path d="M50 50 Q60 30 75 35 Q60 48 50 50" fill="currentColor" />
              </svg>
            </div>
            <span className="text-sm font-black tracking-[0.25em] text-white uppercase font-mono">
              GROW<span className="text-emerald-400">FOLIO</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[10px] font-mono tracking-widest uppercase font-semibold text-white/50">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <button onClick={() => setShowAboutModal(true)} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none font-mono tracking-widest uppercase font-semibold">About Us</button>
            <a href="#screenshots" className="hover:text-white transition-colors">App Tour</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <button onClick={() => setShowContactModal(true)} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none font-mono tracking-widest uppercase font-semibold">Contact Us</button>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={onLaunchApp}
              className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.1)] transition-all duration-300 cursor-pointer"
            >
              Launch App
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-36 border-b border-white/[0.04] overflow-hidden">
        {/* Ambient neon radial glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] rounded-full bg-emerald-500/[0.03] blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 rounded-full bg-green-500/[0.01] blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest font-mono">The Gamified Investing Revolution</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7.5xl font-black tracking-tighter leading-[0.9] text-white">
              Learn. Play.<br />
              <span className="bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                Analyze. Invest.
              </span>
            </h1>

            <p className="text-xs md:text-sm text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              GrowFolio is the ultimate interactive learning sandbox. Practice real-time options trading, raise your custom companion GrowTree, and master professional financial strategies completely risk-free.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <button 
                onClick={onLaunchApp}
                className="px-7 py-4 bg-white hover:bg-neutral-100 text-neutral-950 font-black text-xs rounded-full flex items-center justify-center gap-2 shadow-[0_4px_30px_rgba(255,255,255,0.15)] transition-all duration-300 cursor-pointer group transform hover:scale-[1.02]"
              >
                Launch Simulator Demo
                <ArrowUpRight className="w-4 h-4 text-neutral-950 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button 
                onClick={() => {
                  setActiveReelIndex(0);
                  setReelProgress(0);
                  setReelPlaying(true);
                  setShowDemoModal(true);
                }}
                className="px-7 py-4 bg-transparent hover:bg-white/[0.05] border border-white/[0.1] text-white font-black text-xs rounded-full flex items-center justify-center gap-2 shadow-lg transition-all duration-300 cursor-pointer"
              >
                <Play className="w-4 h-4 text-emerald-400 fill-current" />
                Watch App Reel
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-8 border-t border-white/[0.04] grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div>
                <span className="block text-2xl font-mono font-black text-white bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">100%</span>
                <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">Risk-Free</span>
              </div>
              <div>
                <span className="block text-2xl font-mono font-black text-white bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">30+</span>
                <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">Pro Lessons</span>
              </div>
              <div>
                <span className="block text-2xl font-mono font-black text-white bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">AI</span>
                <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">Guided Coach</span>
              </div>
            </div>
          </div>

          {/* PHONE MOCKUP CONTAINER */}
          <div className="lg:col-span-5 flex justify-center relative">
            
            {/* Spinning decorative orbit circles */}
            <div className="absolute inset-0 border border-white/[0.03] rounded-full scale-110 pointer-events-none animate-[spin_40s_linear_infinite]" />
            <div className="absolute inset-4 border border-dashed border-emerald-500/10 rounded-full scale-100 pointer-events-none animate-[spin_25s_linear_infinite]" />

            {/* Premium Phone Case Frame */}
            <div className="w-[285px] h-[570px] bg-[#0c0c10] border-[8px] border-[#1d1d24] rounded-[52px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col justify-between p-3.5 ring-1 ring-white/10">
              
              {/* Dynamic island notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 absolute right-4" />
              </div>

              {/* Internal Screen Content Mockup */}
              <div className="flex-1 rounded-[36px] bg-neutral-950 overflow-hidden flex flex-col justify-between relative border border-white/[0.06] p-4 pt-6 text-left">
                
                {/* Simulated Ticker Bar */}
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-black bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">NVDA</span>
                    <span className="text-[9px] font-bold text-white/60">$128.50</span>
                  </div>
                  <span className="text-[8px] font-mono text-emerald-400 font-bold">+3.42% ▲</span>
                </div>

                {/* GrowTree Animation mockup inside phone */}
                <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
                  {/* Glowing light behind the sprout */}
                  <div className="absolute w-24 h-24 rounded-full bg-emerald-500/10 blur-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  
                  {/* Floating particles */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <span className="absolute top-8 left-10 text-[9px] animate-bounce text-emerald-400/80">💧</span>
                    <span className="absolute bottom-10 right-12 text-[10px] animate-pulse text-yellow-400">🪙 +15</span>
                    <span className="absolute top-12 right-6 text-[8px] animate-bounce text-emerald-400">🌱 XP</span>
                  </div>

                  {/* SVG Tree Graphic with premium linear gradients */}
                  <svg className="w-24 h-24 relative z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.35)]" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="phoneTrunkGrad" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#1e130c" />
                        <stop offset="100%" stopColor="#402c1d" />
                      </linearGradient>
                      <linearGradient id="phoneLeafGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#064e3b" />
                      </linearGradient>
                    </defs>
                    {/* Dirt Mound */}
                    <path d="M25,85 C25,80 75,80 75,85" stroke="#3b2314" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
                    {/* Trunk */}
                    <path d="M50,85 L50,45" stroke="url(#phoneTrunkGrad)" strokeWidth="6" strokeLinecap="round" />
                    {/* Branches */}
                    <path d="M50,65 Q35,55 30,50" stroke="url(#phoneTrunkGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M50,55 Q65,48 70,40" stroke="url(#phoneTrunkGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
                    {/* Glowing Green Leaves */}
                    <circle cx="50" cy="35" r="14" fill="url(#phoneLeafGrad)" opacity="0.9" />
                    <circle cx="32" cy="48" r="10" fill="url(#phoneLeafGrad)" opacity="0.8" />
                    <circle cx="68" cy="40" r="11" fill="url(#phoneLeafGrad)" opacity="0.85" />
                    
                    {/* Golden Coins inside Foliage */}
                    <circle cx="50" cy="35" r="2.5" fill="#fbbf24" />
                    <circle cx="68" cy="40" r="2.5" fill="#fbbf24" />
                  </svg>

                  <span className="text-[10px] font-mono text-white/50 tracking-wide mt-2">Emerald Sprout lvl 5</span>
                </div>

                {/* Quick actions mockup */}
                <div className="space-y-2">
                  {/* Watering Action */}
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-extrabold text-[9px] flex items-center justify-center gap-1">
                      <Droplet className="w-3 h-3 fill-current" />
                      Water Tree
                    </button>
                    <button className="flex-1 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-extrabold text-[9px] flex items-center justify-center gap-1">
                      <Coins className="w-3 h-3" />
                      Fertilize
                    </button>
                  </div>

                  {/* Simulator Panel Mockup */}
                  <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[8px] font-black uppercase text-white/40 font-mono">Market Simulator</span>
                      <span className="text-[8px] font-bold text-emerald-400">Cash: $15,420</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-white">Buy NVDA Shares</span>
                      <span className="text-[8px] font-bold text-neutral-950 bg-emerald-400 px-2 py-0.5 rounded">CONFIRM</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom bar pill indicator */}
              <div className="w-20 h-1 bg-zinc-800 rounded-full mx-auto mt-2" />
            </div>

            {/* FLOATING GROWTREE DECORATION OVERLAY */}
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-[#09090c]/85 border border-white/[0.08] backdrop-blur-xl rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-[0_12px_40px_rgba(0,0,0,0.85)] animate-bounce pointer-events-none hidden sm:flex">
              <span className="text-2xl">🌳</span>
              <span className="text-[9px] font-mono font-black text-emerald-400 mt-1">GrowTree Active</span>
              <span className="text-[8px] text-white/40 font-bold">XP Multiplier +1.5x</span>
            </div>

            {/* FLOATING CHART DECORATION OVERLAY */}
            <div className="absolute -top-6 -right-6 w-32 h-20 bg-[#09090c]/85 border border-white/[0.08] backdrop-blur-xl rounded-2xl p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] pointer-events-none hidden sm:block">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-mono font-bold text-white/50">Compound Gains</span>
                <span className="text-[8px] font-bold text-emerald-400">+256%</span>
              </div>
              {/* Mini visual SVG wave line */}
              <svg className="w-full h-8" viewBox="0 0 100 30">
                <path d="M0,25 Q15,22 30,12 T60,18 T90,3 T100,2" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M0,25 Q15,22 30,12 T60,18 T90,3 T100,2 L100,30 L0,30 Z" fill="url(#chart-glow)" opacity="0.15" />
                <defs>
                  <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

          </div>

        </div>
      </section>

      {/* WHY GROWFOLIO? (DUOLINGO FOR INVESTING COMPARISON) */}
      <section id="why-growfolio" className="py-20 max-w-7xl mx-auto px-6 border-b border-white/[0.04] relative">
        <div className="absolute top-1/2 left-10 w-96 h-96 rounded-full bg-emerald-500/[0.02] blur-[120px] pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">The Philosophy</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white">Why GrowFolio?</h2>
          <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
            Standard investing books are incredibly dry. We make understanding compound interest, market caps, and options greek matrices feel like playing **Duolingo** or a cozy RPG.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* THE GROWFOLIO WAY */}
          <div className="p-8 rounded-[32px] bg-gradient-to-b from-emerald-950/15 to-[#09090c] border border-emerald-500/20 flex flex-col justify-between space-y-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
                🎮
              </div>
              <h3 className="text-xl font-bold text-white">The GrowFolio Game-Loop</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Learn via visual mechanics. Answer bite-sized flashcard quizzes to earn water and gold. Water your companion Sprout, growing it into a massive branching GrowTree while visualising your compounding progress.
              </p>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-white/[0.04] text-xs text-neutral-200">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                Cozy gamified garden mechanics
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                Live sandbox simulation with zero risk
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                Instant AI diagnostics for study feedback
              </li>
            </ul>
          </div>

          {/* THE BORING TEXTBOOK WAY */}
          <div className="p-8 rounded-[32px] bg-zinc-950/20 border border-white/[0.04] flex flex-col justify-between space-y-6 opacity-60">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                📚
              </div>
              <h3 className="text-xl font-bold text-white/80">Traditional Finance Textbooks</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                Struggle through hundreds of pages of raw mathematical formulas and generic block text without knowing how option greeks apply to real market trends or volatile sentiment news triggers.
              </p>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-white/[0.04] text-xs text-white/50">
              <li className="flex items-center gap-2.5">
                <X className="w-4 h-4 text-red-500/60 flex-shrink-0" />
                Extremely dry static vocabulary tests
              </li>
              <li className="flex items-center gap-2.5">
                <X className="w-4 h-4 text-red-500/60 flex-shrink-0" />
                No live sandboxing or interactive charts
              </li>
              <li className="flex items-center gap-2.5">
                <X className="w-4 h-4 text-red-500/60 flex-shrink-0" />
                Zero interactive coaching or visual progression
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6 border-b border-white/[0.04] relative">
        {/* Glow corner */}
        <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-emerald-500/[0.02] blur-[130px] pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">The Engine</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white">Powerful Learning Features</h2>
          <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
            Everything you need to transform from an absolute trading novice into a professional finance master, backed by AI and real-time market simulation mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              className="bg-[#0b0b0f]/65 hover:bg-[#0f0f14]/85 border border-white/[0.04] hover:border-emerald-500/20 p-6 rounded-[24px] space-y-3.5 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-emerald-500/10 flex items-center justify-center transition-all">
                {feat.icon}
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{feat.title}</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ACADEMY ARCADE HERO FEATURE SECTION */}
      <section id="academy-arcade" className="py-20 max-w-7xl mx-auto px-6 border-b border-white/5 relative overflow-hidden">
        {/* Glow behind the arcade section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-amber-500/[0.03] blur-[130px] pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest font-mono">
            <Trophy className="w-3.5 h-3.5 animate-bounce" /> Brand New Feature
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            The Ultimate <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
              1,000+ Level Academy Arcade
            </span>
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Transition from learning definitions to building deep charting intuition. Test yourself with 3 separate high-fidelity mini-games covering thousands of visual trading puzzles.
          </p>
        </div>

        {/* 3 Game Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mb-12">
          {/* Card 1 */}
          <div className="bg-gradient-to-b from-zinc-900/80 to-black border border-white/5 hover:border-amber-500/30 p-6 rounded-3xl space-y-5 transition-all duration-300 group hover:-translate-y-1 relative">
            <div className="absolute top-4 right-4 bg-amber-500/10 text-amber-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-amber-500/15">
              1,050 LEVELS
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Market Predictor</h3>
              <p className="text-xs text-white/45 leading-relaxed">
                Read moving averages, resistance walls, and price breakouts to forecast if the price will spike or drop in rapid-fire scenarios.
              </p>
            </div>
            {/* Visual representation */}
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden h-24 flex flex-col justify-end">
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-emerald-500/10 to-transparent"></div>
              {/* Fake Mini Graph */}
              <div className="flex items-end gap-1 h-12 px-1">
                <div className="w-full bg-white/10 h-3 rounded-t"></div>
                <div className="w-full bg-white/10 h-5 rounded-t"></div>
                <div className="w-full bg-white/15 h-8 rounded-t"></div>
                <div className="w-full bg-emerald-500/40 h-11 rounded-t border-t border-emerald-400 animate-pulse"></div>
              </div>
              <span className="absolute top-2 left-3 text-[7.5px] font-mono text-white/40 uppercase">Forecast: SPK UP (+88% Win)</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-b from-zinc-900/80 to-black border border-white/5 hover:border-amber-500/30 p-6 rounded-3xl space-y-5 transition-all duration-300 group hover:-translate-y-1 relative">
            <div className="absolute top-4 right-4 bg-amber-500/10 text-amber-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-amber-500/15">
              1,050 LEVELS
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Candlestick Matcher</h3>
              <p className="text-xs text-white/45 leading-relaxed">
                Identify Bullish Hammers, Morning Stars, Hanging Men, and Dojis in real time. Train your visual pattern recognition like a professional trader.
              </p>
            </div>
            {/* Visual representation */}
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden h-24 flex items-center justify-center gap-2">
              {/* Miniature Red & Green Candles */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-red-500"></div>
                <div className="w-2.5 h-8 bg-red-500 rounded-sm"></div>
                <div className="w-0.5 h-3 bg-red-500"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-3 bg-red-500"></div>
                <div className="w-2.5 h-6 bg-red-500 rounded-sm"></div>
                <div className="w-0.5 h-4 bg-red-500"></div>
              </div>
              <div className="flex flex-col items-center animate-bounce">
                <div className="w-0.5 h-5 bg-green-500"></div>
                <div className="w-2.5 h-10 bg-green-500 rounded-sm border border-green-400"></div>
                <div className="w-0.5 h-2 bg-green-500"></div>
              </div>
              <span className="absolute bottom-2 left-3 text-[7.5px] font-mono text-white/40 uppercase">Bullish Hammer Detected</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-b from-zinc-900/80 to-black border border-white/5 hover:border-amber-500/30 p-6 rounded-3xl space-y-5 transition-all duration-300 group hover:-translate-y-1 relative">
            <div className="absolute top-4 right-4 bg-amber-500/10 text-amber-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-amber-500/15">
              1,050 LEVELS
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Breakout Forecaster</h3>
              <p className="text-xs text-white/45 leading-relaxed">
                Determine breakout corridors. Identify true momentum accelerations from fake trend lines, and set accurate price target thresholds.
              </p>
            </div>
            {/* Visual representation */}
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden h-24 flex flex-col justify-center">
              {/* Fake Trend Corridor */}
              <div className="relative h-12 w-full border-t border-dashed border-white/10 pt-2">
                <div className="absolute top-1 left-2 w-full h-0.5 border-t border-dashed border-white/20 -rotate-12"></div>
                <div className="absolute top-7 left-2 w-full h-0.5 border-t border-dashed border-white/20 -rotate-12"></div>
                <div className="absolute top-3 left-16 w-8 h-4 bg-amber-500/25 border border-amber-500/50 rounded flex items-center justify-center text-[7px] text-amber-300 font-bold font-mono">TARGET</div>
              </div>
              <span className="absolute bottom-2 left-3 text-[7.5px] font-mono text-white/40 uppercase">Corridor Breakout +150 XP</span>
            </div>
          </div>
        </div>

        {/* Big Play CTA Button */}
        <div className="text-center relative z-10">
          <button
            onClick={() => onLaunchApp('dashboard', 'arcade')}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all cursor-pointer inline-flex items-center gap-2.5 transform hover:scale-[1.02]"
          >
            <Trophy className="w-4 h-4 text-black animate-pulse" /> Play Academy Arcade Now (3,150 Total Levels!)
          </button>
          <p className="text-[10px] text-white/30 font-mono mt-3">
            🎯 Progress, Gold, and Achievements saved directly to your local browser profile. No signups required.
          </p>
        </div>
      </section>

      {/* APP TOUR INTERACTIVE SCREENSHOTS SWITCHER */}
      <section id="screenshots" className="py-20 max-w-7xl mx-auto px-6 border-b border-white/[0.04] relative">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">App Tour</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Visual App Tour</h2>
          <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
            Click the options below to explore the visual design and full interactive modules active inside GrowFolio.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-3xl mx-auto">
          {[
            { id: 'home', label: '🏡 Home Screen' },
            { id: 'academy', label: '🎓 Academy Module' },
            { id: 'simulator', label: '📈 Trading Simulator' },
            { id: 'coach', label: '🤖 AI Diagnostic Coach' },
            { id: 'profile', label: '👤 Custom Profile' },
            { id: 'arcade', label: '🎮 Academy Arcade' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveScreenshot(tab.id as any)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold border cursor-pointer transition-all duration-300 ${
                activeScreenshot === tab.id 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-neutral-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-black' 
                  : 'bg-[#0b0b0f]/50 border-white/[0.04] text-white/50 hover:text-white hover:border-emerald-500/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Display screen frame representing screenshot */}
        <div className="max-w-4xl mx-auto bg-[#07070a]/90 border border-white/[0.06] rounded-[32px] p-6 md:p-8 min-h-[400px] flex flex-col md:flex-row gap-8 items-center justify-between relative overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Subtle back ambient glow */}
          <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-10" />

          {/* Interactive Screen Details */}
          <div className="flex-1 space-y-4 relative z-10 max-w-md">
            {activeScreenshot === 'home' && (
              <>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/10">The Core Garden Hub</span>
                <h3 className="text-2xl font-extrabold text-white">Compounding Garden & Leaderboards</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Your primary dashboard. Track your portfolio equity curves, claim your active consecutive login streak bonuses, and view leagues rankings. Water your GrowTree using earned fluid supplies to witness physical tree branches growing!
                </p>
                <div className="grid grid-cols-2 gap-3 text-[11px] text-white/75 pt-2">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Real-time active streaks</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Unlockable cosmetics</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant gold collection</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multiple theme layouts</div>
                </div>
              </>
            )}

            {activeScreenshot === 'academy' && (
              <>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/10">Gamified Curriculum</span>
                <h3 className="text-2xl font-extrabold text-white">Full Option & Stocks Academy</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Go from beginner finance to advanced trading. Study topics in bite-sized units translated into several world languages. Answer interactive quiz questionnaires to prove your financial fluency and unlock certificates.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[11px] text-white/75 pt-2">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multi-language toggles</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dynamic slide decks</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Search filter indexes</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Smart bookmarking</div>
                </div>
              </>
            )}

            {activeScreenshot === 'simulator' && (
              <>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/10">Real-Time Price Sandbox</span>
                <h3 className="text-2xl font-extrabold text-white">Active Limit Order Trading</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Trade volatile virtual assets (NVDA, TSLA, BTC) impacted by dynamically updated catalyst news stories. Test technical analysis tools, buy long or short shares, check real-time bidding spreads, and analyze your average cost basis.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[11px] text-white/75 pt-2">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Real-time active orders</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> News impact indicators</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Transaction histories</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Interactive charts</div>
                </div>
              </>
            )}

            {activeScreenshot === 'coach' && (
              <>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/10">Interactive Study Assistant</span>
                <h3 className="text-2xl font-extrabold text-white">AI Coach Diagnostic Feed</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Your direct link to a personalized financial mentor. Ask questions, analyze complex simulator strategies, and receive automatic behavioral trade reviews. Learn why your trade entries succeeded or failed from a professional tutor.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[11px] text-white/75 pt-2">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant chat answers</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Risk diagnostics logs</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Behavior analysis reports</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tailored study pathways</div>
                </div>
              </>
            )}

            {activeScreenshot === 'profile' && (
              <>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/10">Aesthetic Customizer</span>
                <h3 className="text-2xl font-extrabold text-white">Custom Profile & Secure Login</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Personalize your visual trader avatar with premium accessories, clothing lines, and facial expressions. Secure your study advancements and simulated portfolio gains using Google or Apple authentication credentials.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[11px] text-white/75 pt-2">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Google & Apple Oauth</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dynamic avatar customizer</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verifiable PDF awards</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Complete sync stats</div>
                </div>
              </>
            )}

            {activeScreenshot === 'arcade' && (
              <>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/10">Academy Arcade</span>
                <h3 className="text-2xl font-extrabold text-white">1,000+ Level Trading Mini-Games</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Put your charting skills to the ultimate test in our gamified Arcade. Master technical configurations and candlestick layouts. Progress across 1,000+ levels across three advanced mini-games.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[11px] text-white/75 pt-2">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 1,000+ Level Campaign Mode</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Candlestick pattern matching</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Breakout target forecasting</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Gold and XP progression save</div>
                </div>
              </>
            )}

            <button 
              onClick={() => {
                if (activeScreenshot === 'arcade') {
                  onLaunchApp('dashboard', 'arcade');
                } else if (activeScreenshot === 'simulator') {
                  onLaunchApp('simulator');
                } else if (activeScreenshot === 'coach') {
                  onLaunchApp('coach');
                } else if (activeScreenshot === 'academy') {
                  onLaunchApp('academy');
                } else {
                  onLaunchApp();
                }
              }}
              className={`mt-6 px-5 py-3 border rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeScreenshot === 'arcade' 
                  ? 'bg-amber-500 hover:bg-amber-400 text-black border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'bg-white/5 hover:bg-white/10 border-white/[0.08] text-white'
              }`}
            >
              {activeScreenshot === 'arcade' ? '🎮 Play Academy Arcade Instantly' : 'Launch Sandbox Mode'}
              <ChevronRight className={`w-4 h-4 ${activeScreenshot === 'arcade' ? 'text-black' : 'text-emerald-400'}`} />
            </button>
          </div>

          {/* Interactive Screen Mockup representation */}
          <div className="flex-1 w-full max-w-sm bg-neutral-950 border border-white/[0.06] rounded-3xl p-5 min-h-[300px] flex flex-col justify-between relative shadow-inner">
            
            {/* Simple Dynamic screen header */}
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.04] mb-3">
              <span className="text-[9px] font-mono text-white/40 font-bold uppercase">GrowFolio App View v1.2</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[8px] text-emerald-400 font-bold">SIM ACTIVE</span>
              </div>
            </div>

            {/* Simulated Live Frame Content */}
            <div className="flex-1 flex flex-col justify-center space-y-3">
              {activeScreenshot === 'home' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <div>
                      <span className="text-[8px] text-white/40 block">MY SIMULATED BALANCE</span>
                      <span className="text-lg font-mono font-black text-white">$15,420.00</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-extrabold">+18.5% today</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/25 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🌳</span>
                      <div>
                        <h4 className="text-[10px] font-bold text-white">Your GrowTree is Healthy</h4>
                        <p className="text-[8px] text-white/40">Requires water in 4 hours</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-emerald-400 font-mono font-bold">lvl 5</span>
                  </div>
                </div>
              )}

              {activeScreenshot === 'academy' && (
                <div className="space-y-2">
                  <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl">
                    <span className="text-[8px] text-blue-400 font-bold block uppercase tracking-wider mb-0.5">Lesson 3 of 10</span>
                    <h4 className="text-xs font-black text-white">Delta & Option sensitivity</h4>
                    <p className="text-[9px] text-white/50 mt-1">Delta measures the rate of change in an option's premium relative to a $1 change in the underlying asset...</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[9px] rounded-lg">Check Answer</button>
                    <button className="px-3 py-1.5 bg-white/5 text-white/60 text-[9px] rounded-lg">Skip</button>
                  </div>
                </div>
              )}

              {activeScreenshot === 'simulator' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] text-white/50">
                    <span>Ticker: <b>TSLA</b></span>
                    <span>Bid: $182.40</span>
                  </div>
                  {/* Mini graph SVG */}
                  <svg className="w-full h-16 bg-white/[0.01] border border-white/[0.04] rounded-xl p-1" viewBox="0 0 100 40">
                    <path d="M0,35 Q20,32 40,15 T80,25 T100,2" fill="none" stroke="#10b981" strokeWidth="1.5" />
                    <circle cx="100" cy="2" r="2" fill="#10b981" />
                  </svg>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-1.5 bg-emerald-500/20 text-emerald-400 font-bold text-[9px] rounded-lg border border-emerald-500/30">Buy Long</button>
                    <button className="py-1.5 bg-red-500/20 text-red-400 font-bold text-[9px] rounded-lg border border-red-500/30">Sell Short</button>
                  </div>
                </div>
              )}

              {activeScreenshot === 'coach' && (
                <div className="space-y-2.5">
                  <div className="p-2.5 bg-purple-500/5 border border-purple-500/25 rounded-2xl text-[9px] text-white/70 space-y-1">
                    <span className="font-bold text-purple-400 block">🤖 GrowCoach AI:</span>
                    <p className="leading-relaxed">Your leverage margins are quite high. Try diversifying 20% of your capital into low-beta assets to stabilize your portfolio risk score!</p>
                  </div>
                  <div className="flex gap-1.5">
                    <input type="text" readOnly placeholder="Type your trading question..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[8px] text-white" />
                    <button className="px-2 py-1 bg-purple-600 text-white font-bold text-[8px] rounded-lg">Send</button>
                  </div>
                </div>
              )}

              {activeScreenshot === 'profile' && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl border border-white/10">
                      🤠
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">Trader GrowTrader</h4>
                      <p className="text-[8px] text-white/40">Bronze league competitor</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[8px] text-white/60">
                    <div className="p-1.5 bg-white/5 rounded border border-white/[0.04]">👔 Outfit: Business Casual</div>
                    <div className="p-1.5 bg-white/5 rounded border border-white/[0.04]">🎓 Progress: 8 / 30 Lessons</div>
                  </div>
                </div>
              )}

              {activeScreenshot === 'arcade' && (
                <div className="space-y-2 text-left">
                  <div className="p-2 bg-amber-500/5 border border-amber-500/15 rounded-xl text-[8px] space-y-1 text-white">
                    <span className="font-bold text-amber-400 block">🎮 GROWFOLIO ACADEMY ARCADE</span>
                    <p className="text-[7.5px] text-white/60 leading-normal">Test real chart setups with high-volume breakouts across multiple games.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-[8px]">
                    <div className="p-1.5 bg-zinc-900 border border-white/[0.04] rounded-lg text-center">
                      <span className="block text-[10px] mb-0.5">📈</span>
                      <strong className="block text-[8px] text-white">Predictor</strong>
                      <span className="text-[6.5px] text-white/40 font-mono">1,050 levels</span>
                    </div>
                    <div className="p-1.5 bg-zinc-900 border border-white/[0.04] rounded-lg text-center">
                      <span className="block text-[10px] mb-0.5">🕯️</span>
                      <strong className="block text-[8px] text-white">Matcher</strong>
                      <span className="text-[6.5px] text-white/40 font-mono">1,050 levels</span>
                    </div>
                    <div className="p-1.5 bg-zinc-900 border border-white/[0.04] rounded-lg text-center">
                      <span className="block text-[10px] mb-0.5">🎯</span>
                      <strong className="block text-[8px] text-white">Breakouts</strong>
                      <span className="text-[6.5px] text-white/40 font-mono">1,050 levels</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer mockup controls */}
            <div className="pt-2 border-t border-white/[0.04] mt-3 flex justify-between text-[8px] text-white/30 font-bold">
              <span>ACTIVE USER: GROWTRADER</span>
              <span>120 XP</span>
            </div>

          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-b border-white/[0.04] relative text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Real Endorsements</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Loved by Learning Investors</h2>
          <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
            Here is what active users, professional teachers, and visual learners say about using GrowFolio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              quote: "The easiest way to learn investing. Growing my custom Sprout while learning Delta Option Greeks gave me instant context that static finance books never could.",
              author: "Sarah Jenkins",
              role: "Junior Quant Trader",
              avatar: "👩‍💻"
            },
            {
              quote: "Our finance students absolute love the simulator. It removes the stress of real-world losses while creating realistic news triggers to test trade psychology.",
              author: "Marcus Vance",
              role: "University Finance Professor",
              avatar: "👨‍🏫"
            },
            {
              quote: "I unlocked the gold league certificate last week! The interactive AI coach acts like a 24/7 personal tutor explaining exact leverage boundaries.",
              author: "Devon Thorne",
              role: "Retail Investor",
              avatar: "🧙‍♂️"
            }
          ].map((test, idx) => (
            <div key={idx} className="bg-[#0b0b0f]/65 hover:bg-[#0f0f14]/85 border border-white/[0.04] p-6 rounded-3xl space-y-4 relative overflow-hidden flex flex-col justify-between shadow-lg transition-all duration-300">
              {/* Huge elegant double quotation mark background */}
              <span className="absolute -top-4 right-4 text-7xl font-serif text-white/5 pointer-events-none select-none">“</span>
              <p className="text-xs text-neutral-300 italic leading-relaxed relative z-10">"{test.quote}"</p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                <span className="text-2xl">{test.avatar}</span>
                <div>
                  <h4 className="text-xs font-black text-white">{test.author}</h4>
                  <p className="text-[10px] text-white/40">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-6 border-b border-white/[0.04] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-emerald-500/[0.02] blur-[100px] pointer-events-none" />

        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Frequently Asked Questions</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Got Questions?</h2>
          <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
            Everything you need to know about the GrowFolio simulation platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="bg-[#0b0b0f]/60 border border-white/[0.04] rounded-2xl overflow-hidden transition-all duration-300 shadow-md"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center cursor-pointer hover:bg-white/[0.01]"
                >
                  <span className="text-sm font-bold text-white pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-5 pt-0 text-xs text-white/50 leading-relaxed border-t border-white/5 bg-white/[0.005]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* EMAIL CONTACT & SOCIAL NEWSLETTER */}
      <section id="contact" className="py-20 max-w-7xl mx-auto px-6 relative">
        <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-green-500/[0.02] blur-[120px] pointer-events-none" />

        <div className="bg-gradient-to-br from-zinc-950 via-zinc-950 to-green-950/20 border border-white/10 rounded-[40px] p-8 md:p-12 text-center space-y-8 max-w-4xl mx-auto relative overflow-hidden">
          
          <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-20" />

          <div className="space-y-4 relative z-10">
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest font-mono">Get in Touch</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Connect with GrowFolio</h2>
            <p className="text-xs md:text-sm text-white/50 max-w-lg mx-auto leading-relaxed">
              We are here to help you. Reach out directly for support, inquiries, or collaboration opportunities.
            </p>
          </div>

          {/* Explicitly Listed Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto relative z-10 text-left">
            <div className="bg-white/[0.02] border border-white/5 hover:border-green-500/20 p-5 rounded-2xl transition-all flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 flex-shrink-0">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider block">Email Support</span>
                <a href="mailto:officialgrowfolio@gmail.com" className="text-xs font-bold text-white hover:text-green-400 transition-colors break-all">
                  officialgrowfolio@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 hover:border-green-500/20 p-5 rounded-2xl transition-all flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 flex-shrink-0">
                <Linkedin className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider block">LinkedIn Profile</span>
                <a 
                  href="https://linkedin.com/in/gurjash-singh" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs font-bold text-white hover:text-green-400 transition-colors break-all"
                >
                  Gurjash singh
                </a>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 hover:border-green-500/20 p-5 rounded-2xl transition-all flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 flex-shrink-0">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider block">Contact Number</span>
                <a href="tel:7364914111" className="text-xs font-bold text-white hover:text-green-400 transition-colors break-all">
                  7364914111
                </a>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto relative z-10 flex flex-col sm:flex-row gap-2 pt-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-green-500/50"
            />
            <button 
              onClick={() => alert("Thank you for subscribing! We will notify you of upcoming app releases.")}
              className="px-5 py-3 bg-green-500 hover:bg-green-400 text-black font-extrabold text-xs rounded-2xl shadow-lg transition-all cursor-pointer"
            >
              Get Updates
            </button>
          </div>

          {/* Social Icons Links */}
          <div className="flex justify-center gap-6 pt-4 relative z-10">
            <a 
              href="mailto:officialgrowfolio@gmail.com" 
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-green-400 border border-white/5 hover:border-green-500/20 transition-all"
              title="Email Address"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-green-400 border border-white/5 hover:border-green-500/20 transition-all"
              title="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-green-400 border border-white/5 hover:border-green-500/20 transition-all"
              title="Instagram Feed"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-neutral-950 py-12 text-center text-white/40 text-[11px] font-mono relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center text-green-400">
              <svg viewBox="0 0 100 100" className="w-3.5 h-3.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 75 Q40 70 50 50 T80 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <path d="M50 50 Q60 30 75 35 Q60 48 50 50" fill="currentColor" />
              </svg>
            </div>
            <span className="font-bold text-white">GROWFOLIO © {new Date().getFullYear()}</span>
          </div>

          <div className="flex gap-6">
            <button onClick={() => setShowAboutModal(true)} className="hover:text-green-400 cursor-pointer transition-colors bg-transparent border-none font-mono">About Us</button>
            <button onClick={() => setShowPrivacyModal(true)} className="hover:text-green-400 cursor-pointer transition-colors bg-transparent border-none font-mono">Privacy Policy</button>
            <button onClick={() => setShowTermsModal(true)} className="hover:text-green-400 cursor-pointer transition-colors bg-transparent border-none font-mono">Terms & Conditions</button>
            <button onClick={() => setShowContactModal(true)} className="hover:text-green-400 cursor-pointer transition-colors bg-transparent border-none font-mono">Contact Us</button>
          </div>

          <div className="flex items-center gap-1.5 text-white/60">
            <span>Created by</span>
            <a 
              href="https://singhgurjash733.github.io/GrowFolio" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors font-extrabold font-sans"
            >
              <svg viewBox="0 0 100 100" className="w-3 h-3 text-green-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 75 Q40 70 50 50 T80 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <path d="M50 50 Q60 30 75 35 Q60 48 50 50" fill="currentColor" />
              </svg>
              <span>Gurjash</span>
            </a>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE SMARTPHONE APP REEL / SHOWCASE */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="max-w-md w-full bg-zinc-950 border border-white/10 rounded-[36px] overflow-hidden shadow-2xl relative flex flex-col p-4 md:p-5"
            >
              {/* TOP STORY BAR */}
              <div className="space-y-3 mb-3">
                {/* Horizontal progress segments */}
                <div className="flex gap-1.5 px-0.5">
                  {REEL_SCENES.map((_, idx) => (
                    <div 
                      key={idx} 
                      className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden relative cursor-pointer"
                      onClick={() => {
                        setActiveReelIndex(idx);
                        setReelProgress(0);
                      }}
                    >
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-green-400 transition-all duration-75"
                        style={{ 
                          width: idx === activeReelIndex 
                            ? `${reelProgress}%` 
                            : idx < activeReelIndex 
                              ? '100%' 
                              : '0%' 
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Header title/badge */}
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-white/50 tracking-wider font-mono">
                      GROWFOLIO STORY REEL
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => setShowDemoModal(false)}
                    className="p-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                    title="Close Reel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* VERTICAL PHONE FRAME SCREEN */}
              <div className="relative aspect-[9/16] w-full rounded-[24px] bg-neutral-900 border border-white/10 overflow-hidden flex flex-col justify-between p-5 select-none">
                {/* Screen background decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none z-10" />
                <div className="absolute -top-1/4 -right-1/4 w-60 h-60 rounded-full bg-green-500/[0.03] blur-[60px] pointer-events-none" />
                <div className="absolute -bottom-1/4 -left-1/4 w-60 h-60 rounded-full bg-emerald-500/[0.03] blur-[60px] pointer-events-none" />

                {/* Left/Right click-to-skip targets */}
                <div className="absolute inset-y-0 left-0 w-1/4 z-20 cursor-w-resize" onClick={handlePrevReel} />
                <div className="absolute inset-y-0 right-0 w-1/4 z-20 cursor-e-resize" onClick={handleNextReel} />

                {/* Slide content container */}
                <div className="h-full flex flex-col justify-between relative z-10">
                  {/* Top: Scene category Badge */}
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold tracking-widest text-green-400 uppercase font-mono">
                      {REEL_SCENES[activeReelIndex].badge}
                    </span>
                    <span className="text-[10px] font-mono text-white/30 font-bold">
                      {activeReelIndex + 1} / 5
                    </span>
                  </div>

                  {/* Middle: Interactive animated graphics rendering based on slide index */}
                  <div className="my-auto flex-1 flex flex-col items-center justify-center p-2">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeReelIndex}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="w-full flex flex-col items-center justify-center"
                      >
                        {/* Slide 0: COMPANION TREE */}
                        {activeReelIndex === 0 && (
                          <div className="flex flex-col items-center gap-4 py-2">
                            {/* Glowing Aura Garden Circle */}
                            <div className="relative w-32 h-32 rounded-full bg-gradient-to-b from-green-500/10 to-transparent border border-green-500/10 flex items-center justify-center shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]">
                              <motion.div 
                                animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="text-6xl filter drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] select-none"
                              >
                                🌲
                              </motion.div>
                              
                              {/* Droplet animation */}
                              <motion.div
                                animate={{ y: [-20, 40], opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeIn" }}
                                className="absolute top-4 text-xl"
                              >
                                💧
                              </motion.div>

                              {/* Tiny sparkling lights */}
                              <span className="absolute top-2 right-4 text-xs animate-ping">✨</span>
                              <span className="absolute bottom-6 left-2 text-[10px] animate-pulse">⭐</span>
                            </div>

                            {/* Floating HUD metrics */}
                            <div className="w-full max-w-[200px] bg-black/60 border border-white/5 rounded-xl p-2.5 text-center space-y-1.5 backdrop-blur-md">
                              <div className="text-[10px] font-bold text-white font-mono flex justify-between">
                                <span>Sprout Level</span>
                                <span className="text-green-400">LVL 4</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: "10%" }}
                                  animate={{ width: "75%" }}
                                  transition={{ duration: 1.5 }}
                                  className="h-full bg-green-500 rounded-full" 
                                />
                              </div>
                              <div className="text-[8px] text-white/40 flex justify-between font-mono">
                                <span>XP Balance: 420</span>
                                <span className="text-green-400/80">+80 to grow</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Slide 1: STOCK SIMULATOR */}
                        {activeReelIndex === 1 && (
                          <div className="w-full flex flex-col items-center gap-3">
                            {/* Live Stock Ticker Chart Panel */}
                            <div className="w-full bg-black/50 border border-white/10 rounded-2xl p-3 space-y-2 backdrop-blur-md relative">
                              <div className="flex justify-between items-center">
                                <div className="text-left">
                                  <span className="text-[9px] font-mono font-bold text-white/40 uppercase">Simulated Ticker</span>
                                  <h4 className="text-xs font-black text-white font-mono leading-none">NVDA (NVIDIA)</h4>
                                </div>
                                <div className="text-right">
                                  <span className="text-[9px] font-mono text-green-400 font-bold block">+14.2%</span>
                                  <span className="text-xs font-bold text-white font-mono">$124.50</span>
                                </div>
                              </div>

                              {/* SVG Live Chart Animation */}
                              <div className="h-20 w-full relative flex items-end">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                                  {/* Grid lines */}
                                  <line x1="0" y1="10" x2="100" y2="10" stroke="white" strokeWidth="0.05" strokeDasharray="1" />
                                  <line x1="0" y1="20" x2="100" y2="20" stroke="white" strokeWidth="0.05" strokeDasharray="1" />
                                  <line x1="0" y1="30" x2="100" y2="30" stroke="white" strokeWidth="0.05" strokeDasharray="1" />

                                  {/* Line path */}
                                  <motion.path
                                    d="M 0,35 Q 20,38 40,25 T 70,28 T 100,5"
                                    fill="none"
                                    stroke="#22c55e"
                                    strokeWidth="1.5"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                                  />
                                </svg>
                                <div className="absolute right-0 top-1 w-2 h-2 rounded-full bg-green-400 animate-ping" />
                              </div>
                            </div>

                            {/* Live Order Book Catalyst Feed */}
                            <div className="w-full bg-green-500/10 border border-green-500/20 p-2.5 rounded-xl flex items-start gap-2">
                              <span className="text-sm">⚡</span>
                              <p className="text-[9px] text-green-400/90 text-left font-semibold leading-normal">
                                <strong>Catalyst Alert</strong>: High-performance computing demand triggers stock price lift! 📈
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Slide 2: MASTER OPTIONS */}
                        {activeReelIndex === 2 && (
                          <div className="w-full flex flex-col items-center gap-3">
                            {/* Flipping educational flashcard */}
                            <motion.div 
                              animate={{ rotateY: [0, 360] }}
                              transition={{ repeat: Infinity, repeatDelay: 4, duration: 1.2 }}
                              className="w-full bg-black/60 border border-white/5 rounded-2xl p-4 space-y-3 backdrop-blur-md text-left"
                            >
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-[9px] font-mono font-bold text-white/40 uppercase">Derivative Greek Basics</span>
                                <span className="text-[10px] text-purple-400 font-bold">DELTA (Δ)</span>
                              </div>
                              <div className="space-y-1.5">
                                <h4 className="text-xs font-extrabold text-white">What is Option Delta?</h4>
                                <p className="text-[9px] text-white/50 leading-relaxed">
                                  Measures the expected change in option price per $1 move in the underlying stock.
                                </p>
                              </div>

                              <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                                <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                                  <span className="block text-[8px] font-mono text-white/30">DELTA</span>
                                  <span className="text-xs font-mono font-bold text-purple-400">0.68</span>
                                </div>
                                <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                                  <span className="block text-[8px] font-mono text-white/30">THETA</span>
                                  <span className="text-xs font-mono font-bold text-red-400">-0.05</span>
                                </div>
                                <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                                  <span className="block text-[8px] font-mono text-white/30">GAMMA</span>
                                  <span className="text-xs font-mono font-bold text-green-400">0.03</span>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        )}

                        {/* Slide 3: AI COACH MENTORSHIP */}
                        {activeReelIndex === 3 && (
                          <div className="w-full flex flex-col items-center gap-3">
                            {/* Pulsing AI Neural Core */}
                            <div className="relative w-12 h-12 flex items-center justify-center">
                              <motion.div 
                                animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                className="absolute inset-0 rounded-full bg-teal-500/20 blur-md"
                              />
                              <div className="w-8 h-8 rounded-full bg-teal-500 border border-teal-300 flex items-center justify-center text-black font-extrabold shadow-lg">
                                <Bot className="w-4 h-4 text-white" />
                              </div>
                            </div>

                            {/* Chat bubble stream mockup */}
                            <div className="w-full space-y-2">
                              <div className="bg-white/5 border border-white/5 p-2 rounded-xl text-left max-w-[85%]">
                                <span className="block text-[8px] text-teal-400 font-bold font-mono">GROWBOT AI COACH</span>
                                <p className="text-[9px] text-white/80 leading-normal">
                                  "I see you hold concentrated calls. Implied volatility is elevated. Watch out for potential IV crush!"
                                </p>
                              </div>

                              <div className="bg-teal-500/10 border border-teal-500/20 p-2 rounded-xl text-left max-w-[85%] ml-auto">
                                <span className="block text-[8px] text-white/40 font-bold font-mono">YOU</span>
                                <p className="text-[9px] text-white/80 leading-normal">
                                  "Understood! Let's hedge with a spread to mitigate the decay."
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Slide 4: CONQUER LEAGUES */}
                        {activeReelIndex === 4 && (
                          <div className="flex flex-col items-center gap-3 py-1">
                            {/* Shiny Gold Badge */}
                            <div className="relative w-28 h-28 flex items-center justify-center">
                              {/* Rotating rays in background */}
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-full filter blur-sm"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="relative z-10 w-20 h-20 bg-gradient-to-b from-yellow-300 to-amber-500 rounded-3xl flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.4)] border border-yellow-200"
                              >
                                <Trophy className="w-10 h-10 text-neutral-900" />
                              </motion.div>
                              <span className="absolute top-2 left-4 text-xl animate-bounce">🪙</span>
                              <span className="absolute bottom-2 right-4 text-sm animate-pulse">⭐</span>
                            </div>

                            {/* Score table HUD */}
                            <div className="w-full max-w-[200px] bg-black/60 border border-white/5 rounded-xl p-2 font-mono text-[9px] text-left space-y-1">
                              <div className="text-white/40 text-[8px] font-bold uppercase tracking-wider text-center border-b border-white/5 pb-1">Leaderboards</div>
                              <div className="flex justify-between text-yellow-400 font-bold">
                                <span>1st. GrowFolio Pro</span>
                                <span>3,240 XP</span>
                              </div>
                              <div className="flex justify-between text-white">
                                <span className="font-bold">2nd. You (Novice)</span>
                                <span className="font-bold">2,980 XP</span>
                              </div>
                              <div className="flex justify-between text-white/50">
                                <span>3rd. Trading_Bull</span>
                                <span>2,850 XP</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Bottom: Caption card overlaid */}
                  <div className="space-y-2 pt-2 border-t border-white/5 bg-black/40 backdrop-blur-md p-3.5 rounded-2xl relative z-20">
                    <h3 className="text-sm font-black text-white tracking-tight leading-none text-left">
                      {REEL_SCENES[activeReelIndex].title}
                    </h3>
                    <p className="text-[10px] text-white/50 text-left leading-relaxed">
                      {REEL_SCENES[activeReelIndex].subtitle}
                    </p>
                    <p className="text-[9px] text-green-400/80 font-mono text-left font-bold">
                      {REEL_SCENES[activeReelIndex].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* FOOTER CONTROLS BAR */}
              <div className="flex items-center justify-between mt-4 px-1 gap-3">
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrevReel}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer border border-white/5"
                    title="Previous Slide"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={() => setReelPlaying(!reelPlaying)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer border border-white/5 flex items-center gap-1 text-[10px] font-mono"
                    title={reelPlaying ? "Pause Autoplay" : "Play Autoplay"}
                  >
                    {reelPlaying ? (
                      <>
                        <Pause className="w-4 h-4 text-green-400" />
                        <span>PAUSE</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-green-400 fill-current" />
                        <span>PLAY</span>
                      </>
                    )}
                  </button>

                  <button 
                    onClick={handleNextReel}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer border border-white/5"
                    title="Next Slide"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  onClick={() => {
                    setShowDemoModal(false);
                    onLaunchApp();
                  }}
                  className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-extrabold text-[10px] rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
                >
                  <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
                  Launch Game Instantly
                </button>
              </div>

              <div className="text-[9px] text-white/30 font-mono text-center mt-3 border-t border-white/5 pt-2">
                💡 Screen Recorder Tip: Pause or play slides to record your personalized app presentation!
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ABOUT US MODAL */}
        {showAboutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-xl w-full bg-zinc-950 border border-white/10 rounded-[32px] p-6 md:p-8 relative shadow-2xl flex flex-col gap-5 text-left max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  About GrowFolio
                </span>
                <button 
                  onClick={() => setShowAboutModal(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider font-mono">GROW<span className="text-green-400">FOLIO</span></h3>
                    <p className="text-xs text-white/40">The Gamified Investing Revolution</p>
                  </div>
                </div>

                <p className="text-xs text-white/60 leading-relaxed">
                  GrowFolio is a cutting-edge interactive sandbox designed to bridge the gap between complex derivatives, algorithmic financial markets, and novice retail investors. Our mission is to make financial literacy highly accessible, engaging, and risk-free through a beautifully stylized gamified simulator app.
                </p>

                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Our Founding Principles:</h4>
                  <ul className="text-xs text-white/50 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">✓</span>
                      <span><strong>Practical Sandbox</strong>: Play with real-time simulated order books on high-volatility stocks without capital hazards.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">✓</span>
                      <span><strong>Compound Learning</strong>: Complete comprehensive modular lessons that cover options greeks, chart support levels, and technical indicators.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">✓</span>
                      <span><strong>AI Coach Guidance</strong>: Learn the psychological discipline of professional trading under the mentorship of our bespoke Gemini-powered chatbot, GrowBot.</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-2">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-bold">Creator Profile & Team Support</span>
                  <div className="bg-gradient-to-r from-zinc-900 to-green-950/20 p-5 border border-white/5 rounded-2xl flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-black text-white">Gurjash Singh</div>
                        <p className="text-[11px] text-green-400 font-mono">Founding Developer & Lead Designer</p>
                      </div>
                      <div className="flex gap-2">
                        <a 
                          href="https://linkedin.com/in/gurjash-singh" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-green-400 border border-white/5 transition-colors flex items-center gap-1 text-[10px] font-mono" 
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                          <span>Gurjash singh</span>
                        </a>
                        <a 
                          href="tel:7364914111" 
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-green-400 border border-white/5 transition-colors flex items-center gap-1 text-[10px] font-mono" 
                          title="Call Creator"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>7364914111</span>
                        </a>
                        <a 
                          href="mailto:officialgrowfolio@gmail.com" 
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-green-400 border border-white/5 transition-colors" 
                          title="Email Support"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end border-t border-white/5 text-[10px] text-white/30 font-mono">
                Compounded with passion in 2026.
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* PRIVACY POLICY MODAL */}
        {showPrivacyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-xl w-full bg-zinc-950 border border-white/10 rounded-[32px] p-6 md:p-8 relative shadow-2xl flex flex-col gap-5 text-left max-h-[90vh]"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest font-bold">
                  GrowFolio Privacy Policy
                </span>
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2 scrollbar-thin text-xs text-white/60 leading-relaxed">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">1. User Consent and Scope</h4>
                  <p>By using GrowFolio, you consent to our simple, user-first privacy principles. This policy governs how we collect, process, and secure user-authored content, simulation metrics, and personal configuration details.</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">2. Local Storage and Offline-First Storage</h4>
                  <p>GrowFolio is designed with full privacy and convenience in mind. Almost all user-specific data—including your trading histories, available virtual gold balance, companion Sprout configurations, customizable note records, and lesson progress badges—is stored entirely locally on your browser cache via industry-standard client-side key-value pairs (LocalStorage).</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">3. AI Chatbot Privacy (Gemini API Integration)</h4>
                  <p>Our interactive AI coaching features (powered securely server-side by Google Gemini) do not transmit your private browser logs or personal keys. When interacting with GrowBot, only the contextual lesson parameters and your active simulated trades list are sent securely. This processing occurs on isolated, secure server routes without persistent tracking or profiling.</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">4. Absolute Non-Commercialization</h4>
                  <p>We are completely committed to zero ads and zero data brokers. We never sell, rent, monetize, or distribute your email, profile config, or note-taking items to any third-party marketing companies.</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">5. Contacts and Redress</h4>
                  <p>For any questions regarding Google Play Store compliance, data clearance, or to request general information, contact our Support and Compliance team:</p>
                  <div className="mt-2 bg-white/[0.02] border border-white/5 p-3 rounded-xl font-mono text-[11px] text-white/50 space-y-1">
                    <div>Team: GrowFolio Support Team</div>
                    <div>Inquiries: <a href="mailto:officialgrowfolio@gmail.com" className="text-green-400 hover:underline">officialgrowfolio@gmail.com</a></div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-white/30 font-mono">
                <span>Last Updated: June 2026</span>
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-4 py-1.5 bg-green-500 hover:bg-green-400 text-black font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* TERMS & CONDITIONS MODAL */}
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-xl w-full bg-zinc-950 border border-white/10 rounded-[32px] p-6 md:p-8 relative shadow-2xl flex flex-col gap-5 text-left max-h-[90vh]"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest font-bold">
                  GrowFolio Terms & Conditions
                </span>
                <button 
                  onClick={() => setShowTermsModal(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2 scrollbar-thin text-xs text-white/60 leading-relaxed">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200">
                  <strong>⚠️ Critical Educational Disclaimer</strong>: GrowFolio is 100% a paper trading simulator. All assets, prices, portfolios, news releases, and trade analysis are entirely simulated. We do not support real cash deposits or broker integrations.
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">1. Educational Purpose Only</h4>
                  <p>None of the statistical metrics, charting signals, options Greek definitions, chatbot replies, or educational lessons provided constitute official commercial, financial, tax, or investment advice. Users are fully responsible for any trading decisions executed on real, live brokerage accounts.</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">2. Simulated Game Items Value</h4>
                  <p>The virtual cash ($10,000 initial balance), earned virtual gold coins, experience points (XP), profile rewards, garden decorations, and companion sprout milestones exist solely to enrich the educational gamification system. They hold zero financial cash value and cannot be redeemed, sold, or exchanged for physical currency.</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">3. Permitted Platform Use</h4>
                  <p>Users must use this application constructively for personal financial self-improvement and educational mastery. Any attempts to exploit, script, DDoS, or reverse-engineer the automated pricing tickers or game progression rules are strictly forbidden.</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">4. Limitation of Liability</h4>
                  <p>In no event shall the GrowFolio Team, or any associated platform affiliates be held liable for any direct, indirect, incidental, or consequential losses, damages, or real-life investing setbacks incurred as a result of using this simulator tool.</p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-white/30 font-mono">
                <span>Created by GrowFolio Team</span>
                <button 
                  onClick={() => setShowTermsModal(false)}
                  className="px-4 py-1.5 bg-green-500 hover:bg-green-400 text-black font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer"
                >
                  I Accept Terms
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* CONTACT US MODAL WITH INTERACTIVE FORM */}
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-md w-full bg-zinc-950 border border-white/10 rounded-[32px] p-6 md:p-8 relative shadow-2xl flex flex-col gap-4 text-left"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest font-bold">
                  {contactSubmitted ? "Submission Received" : "Send an Inquiry"}
                </span>
                <button 
                  onClick={() => {
                    setShowContactModal(false);
                    setContactSubmitted(false);
                  }}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {!contactSubmitted ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onSubmit={handleContactSubmit}
                    className="space-y-4"
                  >
                    <p className="text-xs text-white/50">
                      Have suggestions or found a bug? Drop us a line. The GrowFolio team reviews feedback daily!
                    </p>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-wider text-white/40 font-bold block">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Your Name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-green-500/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-wider text-white/40 font-bold block">Your Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-green-500/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-wider text-white/40 font-bold block">Subject</label>
                      <select 
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-green-500/50"
                      >
                        <option value="General Feedback">General Feedback</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Bug Report">Bug Report</option>
                        <option value="Partnership / Collaboration">Partnership / Collaboration</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-wider text-white/40 font-bold block">Message Body</label>
                      <textarea 
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Your detailed suggestions..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-green-500/50 resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-green-500 hover:bg-green-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
                    >
                      Transmit Feedback Message
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="contact-success"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="py-6 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 mx-auto flex items-center justify-center text-3xl animate-bounce">
                      ✓
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">Transmission Successful!</h4>
                      <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed">
                        Thank you for your feedback, <strong>{contactForm.name}</strong>. Your message on "{contactForm.subject}" has been successfully logged.
                      </p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-left text-xs text-white/50 space-y-2">
                      <span className="text-[9px] font-mono text-green-400 uppercase tracking-widest block font-bold">Contact Desk</span>
                      <p>You can also reach the team directly at:</p>
                      <ul className="space-y-1 font-mono text-[11px] text-white/40">
                        <li>✉ Email: <a href="mailto:officialgrowfolio@gmail.com" className="text-white hover:text-green-400">officialgrowfolio@gmail.com</a></li>
                      </ul>
                    </div>

                    <button 
                      onClick={() => {
                        setShowContactModal(false);
                        setContactSubmitted(false);
                        setContactForm({ name: '', email: '', subject: 'General Feedback', message: '' });
                      }}
                      className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer border border-white/10"
                    >
                      Close Window
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
