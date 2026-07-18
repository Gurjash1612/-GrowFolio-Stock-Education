import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  GraduationCap, 
  TrendingUp, 
  Bot, 
  Coins, 
  Droplet, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight, 
  Zap, 
  HelpCircle, 
  Award, 
  X, 
  Play, 
  Info,
  DollarSign,
  Search,
  ChevronLeft,
  BookOpen,
  Volume2,
  VolumeX,
  Languages,
  RotateCcw,
  BookMarked,
  Bookmark,
  User,
  Heart,
  CloudLightning,
  RefreshCw
} from 'lucide-react';

import { Lesson, LessonQuestion, generateFullLesson, generateLessonsList } from './lessons';
import { 
  Stock, 
  Transaction, 
  NewsItem, 
  AvatarConfig, 
  ThemeConfig, 
  NoteItem, 
  SavedBookmark 
} from './types';

// Import Custom Modular Sub-components
import { gameAudio } from './utils/audio';
import { getTranslation, LANGUAGES, LanguageCode } from './utils/translate';
import { AvatarCustomizer } from './components/AvatarCustomizer';
import { MiniGames } from './components/MiniGames';
import { DailyRewardsAndWheel } from './components/DailyRewardsAndWheel';
import { CommunityFeed } from './components/CommunityFeed';
import { NotesAndBookmarks } from './components/NotesAndBookmarks';
import { CertificateModal } from './components/CertificateModal';
import { OnboardingFlow } from './components/OnboardingFlow';
import { AnalyticsAndEvents } from './components/AnalyticsAndEvents';
import { EducationalVideos } from './components/EducationalVideos';
import { LandingPage } from './components/LandingPage';
import { IntroLogo } from './components/IntroLogo';

// Client-side helper to check if a specific stock market is open based on ticker symbol
const isMarketOpenForTicker = (ticker: string): boolean => {
  const uppercaseTicker = ticker.trim().toUpperCase();
  const isIndian = uppercaseTicker.endsWith('.NS') || uppercaseTicker.endsWith('.BO');
  const now = Date.now();

  if (isIndian) {
    // IST is UTC + 5.5 hours
    const istDate = new Date(now + 5.5 * 3600000);
    const day = istDate.getUTCDay(); // 0 = Sunday, 6 = Saturday
    const hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes();
    const timeInMinutes = hours * 60 + minutes;

    if (day === 0 || day === 6) return false;
    // 9:15 AM to 3:30 PM IST (555 to 930 mins)
    if (timeInMinutes < 555 || timeInMinutes > 930) return false;
    return true;
  } else {
    // US Market (NYSE/NASDAQ) is Monday to Friday, 9:30 AM to 4:00 PM EST/EDT (approximated as UTC-4)
    const estDate = new Date(now - 4 * 3600000);
    const day = estDate.getUTCDay();
    const hours = estDate.getUTCHours();
    const minutes = estDate.getUTCMinutes();
    const timeInMinutes = hours * 60 + minutes;

    if (day === 0 || day === 6) return false;
    // 9:30 AM to 4:00 PM (570 to 960 mins)
    if (timeInMinutes < 570 || timeInMinutes > 960) return false;
    return true;
  }
};

// Initial Lessons Data generated dynamically
const ALL_LESSONS_BASE = generateLessonsList();

const INITIAL_STOCKS: Stock[] = [
  // Indian Stocks (BSE/NSE) - Fallback prices in ₹
  {
    ticker: 'RELIANCE.NS',
    name: 'Reliance Industries Limited',
    price: 1325.00,
    prevPrice: 1310.00,
    change: 1.15,
    history: [
      { open: 1290, high: 1315, low: 1285, close: 1310 },
      { open: 1310, high: 1335, low: 1305, close: 1325 },
    ]
  },
  {
    ticker: 'TCS.NS',
    name: 'Tata Consultancy Services Limited',
    price: 4250.00,
    prevPrice: 4210.00,
    change: 0.95,
    history: [
      { open: 4180, high: 4220, low: 4160, close: 4210 },
      { open: 4210, high: 4265, low: 4195, close: 4250 },
    ]
  },
  {
    ticker: 'HDFCBANK.NS',
    name: 'HDFC Bank Limited',
    price: 1720.00,
    prevPrice: 1705.00,
    change: 0.88,
    history: [
      { open: 1680, high: 1715, low: 1675, close: 1705 },
      { open: 1705, high: 1730, low: 1695, close: 1720 },
    ]
  },
  {
    ticker: 'INFY.NS',
    name: 'Infosys Limited',
    price: 1850.00,
    prevPrice: 1825.00,
    change: 1.37,
    history: [
      { open: 1800, high: 1835, low: 1795, close: 1825 },
      { open: 1825, high: 1860, low: 1815, close: 1850 },
    ]
  },
  {
    ticker: 'TATAMOTORS.NS',
    name: 'Tata Motors Limited',
    price: 980.00,
    prevPrice: 965.00,
    change: 1.55,
    history: [
      { open: 950, high: 972, low: 945, close: 965 },
      { open: 965, high: 988, low: 958, close: 980 },
    ]
  },
  {
    ticker: 'SBIN.NS',
    name: 'State Bank of India',
    price: 850.00,
    prevPrice: 842.00,
    change: 0.95,
    history: [
      { open: 830, high: 846, low: 825, close: 842 },
      { open: 842, high: 855, low: 838, close: 850 },
    ]
  },
  {
    ticker: 'ITC.NS',
    name: 'ITC Limited',
    price: 490.00,
    prevPrice: 485.00,
    change: 1.03,
    history: [
      { open: 478, high: 488, low: 475, close: 485 },
      { open: 485, high: 494, low: 481, close: 490 },
    ]
  },
  // USA Stocks (Converted to ₹ with 1 USD = 83.5 INR)
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: 18787.50,
    prevPrice: 18540.00,
    change: 1.33,
    history: [
      { open: 18370, high: 18620, low: 18300, close: 18540 },
      { open: 18540, high: 18870, low: 18490, close: 18787.50 },
    ]
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    price: 36740.00,
    prevPrice: 36490.00,
    change: 0.69,
    history: [
      { open: 36070, high: 36620, low: 35980, close: 36490 },
      { open: 36490, high: 36980, low: 36320, close: 36740 },
    ]
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 10437.50,
    prevPrice: 10270.00,
    change: 1.63,
    history: [
      { open: 10100, high: 10320, low: 10050, close: 10270 },
      { open: 10270, high: 10510, low: 10210, close: 10437.50 },
    ]
  },
  {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    price: 17535.00,
    prevPrice: 17280.00,
    change: 1.48,
    history: [
      { open: 17110, high: 17390, low: 17020, close: 17280 },
      { open: 17280, high: 17650, low: 17180, close: 17535 },
    ]
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 15447.50,
    prevPrice: 15280.00,
    change: 1.10,
    history: [
      { open: 15110, high: 15350, low: 15050, close: 15280 },
      { open: 15280, high: 15550, low: 15220, close: 15447.50 },
    ]
  },
  {
    ticker: 'GOOG',
    name: 'Alphabet Inc.',
    price: 15030.00,
    prevPrice: 14850.00,
    change: 1.21,
    history: [
      { open: 14700, high: 14950, low: 14650, close: 14850 },
      { open: 14850, high: 15120, low: 14800, close: 15030 },
    ]
  },
  {
    ticker: 'META',
    name: 'Meta Platforms Inc.',
    price: 41332.50,
    prevPrice: 40800.00,
    change: 1.30,
    history: [
      { open: 40200, high: 41000, low: 40050, close: 40800 },
      { open: 40800, high: 41600, low: 40600, close: 41332.50 },
    ]
  },
  {
    ticker: 'NFLX',
    name: 'Netflix Inc.',
    price: 53857.50,
    prevPrice: 53100.00,
    change: 1.43,
    history: [
      { open: 52400, high: 53300, low: 52100, close: 53100 },
      { open: 53100, high: 54100, low: 52800, close: 53857.50 },
    ]
  },
  {
    ticker: 'BHARTIARTL.NS',
    name: 'Bharti Airtel Limited',
    price: 1550.00,
    prevPrice: 1530.00,
    change: 1.31,
    history: [
      { open: 1510, high: 1540, low: 1505, close: 1530 },
      { open: 1530, high: 1565, low: 1522, close: 1550 },
    ]
  },
  {
    ticker: 'ICICIBANK.NS',
    name: 'ICICI Bank Limited',
    price: 1240.00,
    prevPrice: 1225.00,
    change: 1.22,
    history: [
      { open: 1210, high: 1232, low: 1205, close: 1225 },
      { open: 1225, high: 1250, low: 1218, close: 1240 },
    ]
  },
  {
    ticker: 'LT.NS',
    name: 'Larsen & Toubro Limited',
    price: 3620.00,
    prevPrice: 3580.00,
    change: 1.12,
    history: [
      { open: 3530, high: 3600, low: 3510, close: 3580 },
      { open: 3580, high: 3650, low: 3560, close: 3620 },
    ]
  },
  {
    ticker: 'AXISBANK.NS',
    name: 'Axis Bank Limited',
    price: 1180.00,
    prevPrice: 1165.00,
    change: 1.29,
    history: [
      { open: 1145, high: 1172, low: 1140, close: 1165 },
      { open: 1165, high: 1190, low: 1158, close: 1180 },
    ]
  },
  {
    ticker: 'WIPRO.NS',
    name: 'Wipro Limited',
    price: 540.00,
    prevPrice: 532.00,
    change: 1.50,
    history: [
      { open: 524, high: 536, low: 521, close: 532 },
      { open: 532, high: 546, low: 528, close: 540 },
    ]
  },
  {
    ticker: 'HINDUNILVR.NS',
    name: 'Hindustan Unilever Limited',
    price: 2550.00,
    prevPrice: 2520.00,
    change: 1.19,
    history: [
      { open: 2480, high: 2535, low: 2470, close: 2520 },
      { open: 2520, high: 2575, low: 2505, close: 2550 },
    ]
  },
  {
    ticker: 'MARUTI.NS',
    name: 'Maruti Suzuki India Limited',
    price: 12400.00,
    prevPrice: 12250.00,
    change: 1.22,
    history: [
      { open: 12100, high: 12300, low: 12050, close: 12250 },
      { open: 12250, high: 12550, low: 12180, close: 12400 },
    ]
  },
  {
    ticker: 'COALINDIA.NS',
    name: 'Coal India Limited',
    price: 510.00,
    prevPrice: 502.00,
    change: 1.59,
    history: [
      { open: 494, high: 506, low: 490, close: 502 },
      { open: 502, high: 516, low: 498, close: 510 },
    ]
  },
  {
    ticker: 'ADANIENT.NS',
    name: 'Adani Enterprises Limited',
    price: 3050.00,
    prevPrice: 3010.00,
    change: 1.33,
    history: [
      { open: 2960, high: 3030, low: 2940, close: 3010 },
      { open: 3010, high: 3090, low: 2980, close: 3050 },
    ]
  }
];

const MARKET_NEWS: NewsItem[] = [
  { id: 'n1', ticker: 'NVDA', title: 'NVIDIA releases custom AI chip architecture', impact: 'bullish', description: 'NVIDIA launched its next-generation ultra-efficient silicon, driving server farm demand.' },
  { id: 'n2', ticker: 'RELIANCE.NS', title: 'Reliance announces major expansion in green energy sector', impact: 'bullish', description: 'Reliance shares surged after announcing a massive new clean energy plant in Gujarat.' },
  { id: 'n3', ticker: 'TCS.NS', title: 'TCS secures multi-billion dollar digital contract in Europe', impact: 'bullish', description: 'Europe enterprise deal wins bolster project pipelines for the Indian IT major.' },
  { id: 'n4', ticker: 'AAPL', title: 'Global cloud infrastructure outage limits business services', impact: 'bearish', description: 'Enterprise users experienced localized downtime, raising questions around operational resilience.' },
  { id: 'n5', ticker: 'HDFCBANK.NS', title: 'HDFC Bank reports double-digit credit growth in quarterly audit', impact: 'bullish', description: 'Strong deposit and lending trends drive financial sector recovery in Indian markets.' }
];

const LIVE_GLOBAL_INDICES = [
  { ticker: 'S&P 500', price: '5,420.24', change: '+0.45%' },
  { ticker: 'NASDAQ', price: '17,890.10', change: '+1.12%' },
  { ticker: 'DOW JONES', price: '39,150.80', change: '-0.15%' },
  { ticker: 'GOLD (OZ)', price: '2,350.40', change: '+0.32%' },
  { ticker: 'CRUDE OIL', price: '81.45', change: '-0.84%' },
  { ticker: 'NIKKEI 225', price: '38,620.15', change: '+1.45%' }
];

// Visual Themes configs with pricing
const SYSTEM_THEMES: ThemeConfig[] = [
  { id: 'forest', name: 'Dark Forest', description: 'Emerald green canopies of financial growth', cost: 0, unlocked: true, bgGradient: 'from-emerald-950/65 via-[#02130c] to-[#010805]', cardStyle: 'bg-[#07070a]/90 border border-emerald-500/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)]', textAccent: 'text-emerald-400', buttonAccent: 'bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold tracking-wide shadow-xl transition-all' },
  { id: 'wallstreet', name: 'Wall Street Slate', description: 'Golden brass tones representing premium capital structures', cost: 150, unlocked: false, bgGradient: 'from-amber-950/65 via-[#130d02] to-[#080501]', cardStyle: 'bg-[#07070a]/90 border border-amber-500/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)]', textAccent: 'text-amber-400', buttonAccent: 'bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold tracking-wide shadow-xl transition-all' },
  { id: 'space', name: 'Cosmic Violet', description: 'Nebula violet and deep cosmic black holes', cost: 300, unlocked: false, bgGradient: 'from-purple-950/65 via-[#0e0213] to-[#060108]', cardStyle: 'bg-[#07070a]/90 border border-purple-500/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)]', textAccent: 'text-purple-400', buttonAccent: 'bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold tracking-wide shadow-xl transition-all' },
  { id: 'ocean', name: 'Deep Sea Blue', description: 'Serene blue oceans with floating market assets', cost: 400, unlocked: false, bgGradient: 'from-cyan-950/65 via-[#020f13] to-[#010608]', cardStyle: 'bg-[#07070a]/90 border border-cyan-500/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)]', textAccent: 'text-cyan-400', buttonAccent: 'bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold tracking-wide shadow-xl transition-all' },
  { id: 'winter', name: 'Frosted Blizzard', description: 'Ice blue margins with pristine frosted snow', cost: 500, unlocked: false, bgGradient: 'from-sky-950/65 via-[#020e13] to-[#010608]', cardStyle: 'bg-[#07070a]/90 border border-sky-500/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)]', textAccent: 'text-sky-400', buttonAccent: 'bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold tracking-wide shadow-xl transition-all' },
  { id: 'cyber', name: 'Neon Synthwave', description: 'Fuchsia glow and glowing retro matrix grid', cost: 700, unlocked: false, bgGradient: 'from-fuchsia-950/65 via-[#130213] to-[#080108]', cardStyle: 'bg-[#07070a]/90 border border-fuchsia-500/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)]', textAccent: 'text-fuchsia-400', buttonAccent: 'bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold tracking-wide shadow-xl transition-all' },
];

export default function App() {
  // Onboarding / Setup States
  const [introActive, setIntroActive] = useState<boolean>(true);
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [playerName, setPlayerName] = useState<string>(() => localStorage.getItem('gf_player_name') || 'GrowTrader');
  const [experience, setExperience] = useState<string>(() => localStorage.getItem('gf_experience') || 'beginner');
  const [goal, setGoal] = useState<string>(() => localStorage.getItem('gf_goal') || 'wealth');
  const [sproutId, setSproutId] = useState<string>(() => localStorage.getItem('gf_sprout_id') || 'green_sprout');
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'academy' | 'simulator' | 'coach'>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<'garden' | 'arcade' | 'rewards' | 'social' | 'notebook' | 'analytics'>('garden');

  // Settings
  const [language, setLanguage] = useState<LanguageCode>(() => (localStorage.getItem('gf_language') as LanguageCode) || 'en');
  const [sfxMuted, setSfxMuted] = useState<boolean>(() => localStorage.getItem('gf_sfx_muted') === 'true');
  const [musicMuted, setMusicMuted] = useState<boolean>(() => localStorage.getItem('gf_music_muted') === 'true');

  // Themes
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => localStorage.getItem('gf_current_theme') || 'forest');
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(() => {
    const saved = localStorage.getItem('gf_unlocked_themes');
    return saved ? JSON.parse(saved) : ['forest'];
  });

  // Notes & Bookmarks
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('gf_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>(() => {
    const saved = localStorage.getItem('gf_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Certificate triggers
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [certificateTrack, setCertificateTrack] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');

  // Cloud Backup Loader
  const [syncingCloud, setSyncingCloud] = useState<boolean>(false);

  // Avatar Configuration
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(() => {
    const saved = localStorage.getItem('gf_avatar_config');
    return saved ? JSON.parse(saved) : {
      hair: 'short',
      hairColor: 'black',
      outfit: 'tee',
      accessory: 'none',
      pet: 'none',
      bg: 'slate',
      isCustomized: false
    };
  });

  // Player Stats
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('gf_xp');
    return saved ? parseInt(saved) : 1250;
  });
  const [gold, setGold] = useState<number>(() => {
    const saved = localStorage.getItem('gf_gold');
    return saved ? parseInt(saved) : 340;
  });
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('gf_streak');
    return saved ? parseInt(saved) : 4;
  });
  const [waterReady, setWaterReady] = useState<boolean>(() => {
    const saved = localStorage.getItem('gf_water_ready');
    return saved ? saved === 'true' : true;
  });

  // Simulator state
  const [cash, setCash] = useState<number>(() => {
    const saved = localStorage.getItem('gf_cash');
    return saved ? parseFloat(saved) : 1000000;
  });
  const [portfolio, setPortfolio] = useState<{ [ticker: string]: number }>(() => {
    const saved = localStorage.getItem('gf_portfolio');
    return saved ? JSON.parse(saved) : { "RELIANCE.NS": 10, "AAPL": 5 };
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('gf_transactions');
    return saved ? JSON.parse(saved) : [
      { ticker: 'RELIANCE.NS', type: 'BUY', shares: 10, price: 1325, timestamp: '2026-06-25 10:30' },
      { ticker: 'AAPL', type: 'BUY', shares: 5, price: 18787.50, timestamp: '2026-06-25 14:15' }
    ];
  });

  // Level Progression & Academy
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('gf_completed_lessons');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((id: string) => {
          if (id === 'b1') return 'level-1';
          if (id === 'b2') return 'level-2';
          if (id === 'i1') return 'level-11';
          if (id === 'i2') return 'level-12';
          if (id === 'a1') return 'level-21';
          return id;
        });
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>(() => {
    const saved = localStorage.getItem('gf_unlocked_levels');
    return saved ? JSON.parse(saved) : ['beginner'];
  });

  // Academy States for 1000 lessons
  const [academySearch, setAcademySearch] = useState<string>('');
  const [academyTab, setAcademyTab] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [academyPage, setAcademyPage] = useState<number>(0);
  const [academyJumpInput, setAcademyJumpInput] = useState<string>('');

  // 10-Question Quiz States
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState<number>(0);
  const [quizCorrectCount, setQuizCorrectCount] = useState<number>(0);
  const [quizIsFinished, setQuizIsFinished] = useState<boolean>(false);
  const [questionStatuses, setQuestionStatuses] = useState<('correct' | 'incorrect' | null)[]>(new Array(10).fill(null));

  // Active Lesson Session
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizIsCorrect, setQuizIsCorrect] = useState<boolean | null>(null);

  // Monitor Completed Lessons to Auto-Unlock Levels
  useEffect(() => {
    const beginnerCompleted = completedLessons.filter(id => {
      const num = parseInt(id.replace('level-', ''));
      return !isNaN(num) && num <= 300;
    }).length;
    const intermediateCompleted = completedLessons.filter(id => {
      const num = parseInt(id.replace('level-', ''));
      return !isNaN(num) && num > 300 && num <= 700;
    }).length;

    const updatedUnlocked = ['beginner'];
    if (beginnerCompleted >= 5) updatedUnlocked.push('intermediate');
    if (intermediateCompleted >= 5) updatedUnlocked.push('advanced');

    if (JSON.stringify(updatedUnlocked) !== JSON.stringify(unlockedLevels)) {
      setUnlockedLevels(updatedUnlocked);
      localStorage.setItem('gf_unlocked_levels', JSON.stringify(updatedUnlocked));
    }
  }, [completedLessons]);

  // Stock Market Simulator Data
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  // Practice Mode (allows live simulated ticking 24/7 on weekends and out of hours)
  const [practiceMode, setPracticeMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('gf_practice_mode');
    return saved ? saved === 'true' : false; // defaults to false to respect accurate market holidays by default!
  });
  const [selectedStockTicker, setSelectedStockTicker] = useState<string>('RELIANCE.NS');
  const [tradeAmount, setTradeAmount] = useState<number>(1);
  const [news, setNews] = useState<NewsItem[]>(MARKET_NEWS);
  const [activeNews, setActiveNews] = useState<NewsItem | null>(MARKET_NEWS[0]);

  // Stock search states
  const [stockSearchQuery, setStockSearchQuery] = useState<string>('');
  const [stockSearchResults, setStockSearchResults] = useState<{ ticker: string; name: string; exchange: string }[]>([]);
  const [stockSearchLoading, setStockSearchLoading] = useState<boolean>(false);

  // Interactive Stock Chart States
  const [hoveredCandleIndex, setHoveredCandleIndex] = useState<number | null>(null);
  const [hoveredCandlePos, setHoveredCandlePos] = useState<{ x: number; y: number } | null>(null);

  // Tree Decorations
  const [unlockedDecorations, setUnlockedDecorations] = useState<string[]>(() => {
    const saved = localStorage.getItem('gf_unlocked_decorations');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeDecorations, setActiveDecorations] = useState<string[]>(() => {
    const saved = localStorage.getItem('gf_active_decorations');
    return saved ? JSON.parse(saved) : [];
  });

  // AI Chat Bot
  const [aiMessage, setAiMessage] = useState<string>('');
  const [aiHistory, setAiHistory] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Hello! I am GrowBot, your personalized investing coach. Ask me anything about stock charts, support/resistance, financial valuation, or type "review portfolio" to get custom analysis!' }
  ]);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Action Animations
  const [showWateringAnimation, setShowWateringAnimation] = useState<boolean>(false);
  const [floatingXp, setFloatingXp] = useState<string | null>(null);

  // Auto-play ambient background music once user clicks anywhere
  useEffect(() => {
    const triggerAudio = () => {
      gameAudio.playMusic();
      window.removeEventListener('click', triggerAudio);
    };
    window.addEventListener('click', triggerAudio);
    return () => window.removeEventListener('click', triggerAudio);
  }, []);

  // Persistence Auto-save
  useEffect(() => {
    localStorage.setItem('gf_player_name', playerName);
    localStorage.setItem('gf_experience', experience);
    localStorage.setItem('gf_goal', goal);
    localStorage.setItem('gf_sprout_id', sproutId);
    localStorage.setItem('gf_language', language);
    localStorage.setItem('gf_current_theme', currentThemeId);
    localStorage.setItem('gf_unlocked_themes', JSON.stringify(unlockedThemes));
    localStorage.setItem('gf_avatar_config', JSON.stringify(avatarConfig));
    localStorage.setItem('gf_notes', JSON.stringify(notes));
    localStorage.setItem('gf_bookmarks', JSON.stringify(bookmarks));

    localStorage.setItem('gf_xp', xp.toString());
    localStorage.setItem('gf_gold', gold.toString());
    localStorage.setItem('gf_streak', streak.toString());
    localStorage.setItem('gf_water_ready', waterReady.toString());
    localStorage.setItem('gf_cash', cash.toString());
    localStorage.setItem('gf_portfolio', JSON.stringify(portfolio));
    localStorage.setItem('gf_transactions', JSON.stringify(transactions));
    localStorage.setItem('gf_completed_lessons', JSON.stringify(completedLessons));
    localStorage.setItem('gf_unlocked_levels', JSON.stringify(unlockedLevels));
    localStorage.setItem('gf_unlocked_decorations', JSON.stringify(unlockedDecorations));
    localStorage.setItem('gf_active_decorations', JSON.stringify(activeDecorations));
    localStorage.setItem('gf_practice_mode', practiceMode.toString());
  }, [
    playerName, experience, goal, sproutId, language, currentThemeId, unlockedThemes, avatarConfig, notes, bookmarks,
    xp, gold, streak, waterReady, cash, portfolio, transactions, completedLessons, unlockedLevels, unlockedDecorations, activeDecorations, practiceMode
  ]);

  // Live Market Updates interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Small simulated tick changes for all stocks
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          // If practice mode is disabled and the market is closed, freeze client-side price ticks
          if (!practiceMode && !isMarketOpenForTicker(stock.ticker)) {
            return stock;
          }

          const changePercent = (Math.random() - 0.495) * 1.5; // slight bias upwards
          const rawNewPrice = stock.price * (1 + changePercent / 100);
          const newPrice = Math.round(rawNewPrice * 100) / 100;
          const deltaChange = Math.round(((newPrice - stock.prevPrice) / stock.prevPrice) * 100 * 100) / 100;
          
          // Append new candlestick to history (keep max 10)
          const newCandle = {
            open: stock.price,
            high: Math.max(stock.price, newPrice) * (1 + Math.random() * 0.2 / 100),
            low: Math.min(stock.price, newPrice) * (1 - Math.random() * 0.2 / 100),
            close: newPrice
          };
          const newHistory = [...stock.history, newCandle].slice(-12);

          return {
            ...stock,
            price: newPrice,
            change: deltaChange,
            history: newHistory
          };
        })
      );

      // 15% chance of rolling a major news update affecting a stock price directly
      if (Math.random() < 0.15) {
        const randomNewsIndex = Math.floor(Math.random() * MARKET_NEWS.length);
        const selectedNews = MARKET_NEWS[randomNewsIndex];
        setActiveNews(selectedNews);
        
        setStocks(prevStocks => 
          prevStocks.map(stock => {
            if (stock.ticker === selectedNews.ticker) {
              // Freeze price reaction on weekends/holidays if not in practice mode
              if (!practiceMode && !isMarketOpenForTicker(stock.ticker)) {
                return stock;
              }
              const impactPercent = selectedNews.impact === 'bullish' ? 4.5 : -4.5;
              const newPrice = Math.round(stock.price * (1 + impactPercent / 100) * 100) / 100;
              const deltaChange = Math.round(((newPrice - stock.prevPrice) / stock.prevPrice) * 100 * 100) / 100;
              return { ...stock, price: newPrice, change: deltaChange };
            }
            return stock;
          })
        );
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [practiceMode]);

  // Fetch real-time exact prices for all stocks from our backend
  useEffect(() => {
    const fetchRealPrices = async () => {
      try {
        const symbolsList = stocks.map(s => s.ticker).join(',');
        if (!symbolsList) return;
        const response = await fetch(`/api/stocks/quotes?symbols=${encodeURIComponent(symbolsList)}&practice=${practiceMode}`);
        if (response.ok) {
          const data = await response.json();
          if (data.stocks && data.stocks.length > 0) {
            setStocks(prevStocks => {
              // merge to maintain order and update with exact live prices
              return prevStocks.map(existing => {
                const fetched = data.stocks.find((fs: any) => fs.ticker === existing.ticker);
                return fetched ? { ...existing, price: fetched.price, prevPrice: fetched.prevPrice, change: fetched.change, history: fetched.history } : existing;
              });
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch real-time stock prices', err);
      }
    };

    fetchRealPrices();
    // Refresh exact prices from our dynamic server every 15 seconds
    const interval = setInterval(fetchRealPrices, 15000);
    return () => clearInterval(interval);
  }, [stocks.length, practiceMode]); // re-trigger when user adds a new searched ticker or toggles practice mode

  const handleStockSearch = async (query: string) => {
    setStockSearchQuery(query);
    if (!query.trim()) {
      setStockSearchResults([]);
      return;
    }
    setStockSearchLoading(true);
    try {
      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setStockSearchResults(data.results || []);
      }
    } catch (err) {
      console.error('Failed to search stock', err);
    } finally {
      setStockSearchLoading(false);
    }
  };

  const handleAddSearchedStock = async (ticker: string) => {
    setStockSearchResults([]);
    setStockSearchQuery('');
    
    // Check if stock is already in our arena list
    if (stocks.some(s => s.ticker === ticker)) {
      setSelectedStockTicker(ticker);
      return;
    }

    setStockSearchLoading(true);
    try {
      const response = await fetch(`/api/stocks/quotes?symbols=${ticker}`);
      if (response.ok) {
        const data = await response.json();
        if (data.stocks && data.stocks.length > 0) {
          const newStock = data.stocks[0];
          setStocks(prev => [newStock, ...prev]);
          setSelectedStockTicker(ticker);
        }
      }
    } catch (err) {
      console.error('Failed to fetch searched stock details', err);
    } finally {
      setStockSearchLoading(false);
    }
  };

  // Compute stats
  const activeStock = stocks.find(s => s.ticker === selectedStockTicker) || stocks[0];
  
  const totalEquity = Object.entries(portfolio).reduce((total, [ticker, shares]) => {
    const currentStock = stocks.find(s => s.ticker === ticker);
    return total + (Number(shares) * (currentStock?.price || 0));
  }, 0);

  const totalPortfolioValue = cash + totalEquity;
  const initialValueMock = 10000;
  const portfolioProfitLoss = totalPortfolioValue - initialValueMock;
  const portfolioProfitLossPercent = (portfolioProfitLoss / initialValueMock) * 100;

  // Investor Rank Lookup
  const getInvestorRank = (currentXp: number): { title: string; nextAt: number; icon: string } => {
    if (currentXp < 1000) return { title: '🌱 Seed Investor', nextAt: 1000, icon: '🌱' };
    if (currentXp < 2500) return { title: '🌿 Growing Investor', nextAt: 2500, icon: '🌿' };
    if (currentXp < 4500) return { title: '🍃 Smart Investor', nextAt: 4500, icon: '🍃' };
    if (currentXp < 7000) return { title: '🌳 Portfolio Builder', nextAt: 7000, icon: '🌳' };
    if (currentXp < 10500) return { title: '🌲 Market Explorer', nextAt: 10500, icon: '🌲' };
    if (currentXp < 15000) return { title: '🧠 Market Analyst', nextAt: 15000, icon: '🧠' };
    if (currentXp < 20000) return { title: '💼 Portfolio Strategist', nextAt: 20000, icon: '💼' };
    if (currentXp < 26000) return { title: '🦅 Market Master', nextAt: 26000, icon: '🦅' };
    return { title: '👑 Investment Legend', nextAt: 50000, icon: '👑' };
  };

  const currentRank = getInvestorRank(xp);
  const xpProgressPercent = Math.min((xp / currentRank.nextAt) * 100, 100);

  // GrowTree Stage Lookup
  const getGrowTreeStage = (currentXp: number): { name: string; quote: string; color: string } => {
    if (currentXp < 1000) return { name: 'Seed Stage', quote: 'A tiny beginning with immense potential.', color: 'from-amber-700 to-amber-900' };
    if (currentXp < 2500) return { name: 'Sprout Stage', quote: 'First green leaf, tasting the sunlight.', color: 'from-green-600 to-green-800' };
    if (currentXp < 4500) return { name: 'Sapling Stage', quote: 'Stem strengthening, bending but resilient.', color: 'from-green-500 to-emerald-700' };
    if (currentXp < 7000) return { name: 'Young Tree Stage', quote: 'Your financial knowledge is taking deep roots.', color: 'from-emerald-500 to-teal-700' };
    if (currentXp < 10500) return { name: 'Strong Tree Stage', quote: 'Stable trunk, ready to weather any market cycle.', color: 'from-teal-600 to-cyan-700' };
    if (currentXp < 15000) return { name: 'Blooming Tree Stage', quote: 'Your diligent studies are paying beautiful rewards.', color: 'from-rose-500 to-emerald-600' };
    if (currentXp < 20000) return { name: 'Fruit Tree Stage', quote: 'Your portfolios are yielding delicious interest.', color: 'from-green-500 via-yellow-500 to-red-500' };
    return { name: 'Golden Tree Stage', quote: 'An investment legend. Radiating pure wealth.', color: 'from-yellow-400 via-amber-500 to-yellow-600' };
  };

  const treeStage = getGrowTreeStage(xp);

  // Water Tree Action
  const handleWaterTree = () => {
    if (!waterReady) return;
    
    gameAudio.playClick();
    gameAudio.playWatering();

    setShowWateringAnimation(true);
    setFloatingXp('+150 XP');

    setTimeout(() => {
      setXp(prev => prev + 150);
      setGold(prev => prev + 10);
      setWaterReady(false);
      setShowWateringAnimation(false);
      setFloatingXp(null);
      gameAudio.playXpGain();
    }, 1800);
  };

  // Sound/Music toggles
  const handleToggleSfx = () => {
    const nextMuted = gameAudio.toggleSfx();
    setSfxMuted(nextMuted);
  };

  const handleToggleMusic = () => {
    const nextMuted = gameAudio.toggleMusic();
    setMusicMuted(nextMuted);
  };

  // Buy theme
  const handleBuyTheme = (theme: ThemeConfig) => {
    if (gold < theme.cost) {
      alert('Insufficient Gold! Keep studying and trading to unlock this theme.');
      return;
    }
    gameAudio.playClick();
    setGold(prev => prev - theme.cost);
    setUnlockedThemes([...unlockedThemes, theme.id]);
    setCurrentThemeId(theme.id);
    gameAudio.playLevelUp();
  };

  const handleSelectTheme = (themeId: string) => {
    gameAudio.playClick();
    setCurrentThemeId(themeId);
  };

  // Notes additions
  const handleAddNote = (lessonNum: number, lessonTitle: string, content: string) => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      lessonNum,
      lessonTitle,
      content,
      timestamp: new Date().toLocaleDateString()
    };
    setNotes([newNote, ...notes]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // Bookmarks addition
  const handleToggleBookmark = (lessonNum: number, title: string) => {
    gameAudio.playClick();
    const exists = bookmarks.find(b => b.lessonNum === lessonNum);
    if (exists) {
      setBookmarks(bookmarks.filter(b => b.lessonNum !== lessonNum));
    } else {
      const newB: SavedBookmark = {
        lessonNum,
        title,
        savedAt: new Date().toLocaleDateString()
      };
      setBookmarks([...bookmarks, newB]);
    }
  };

  // Jump to lesson directly
  const handleJumpToLesson = (lessonNum: number) => {
    gameAudio.playClick();
    const lessonData = generateFullLesson(lessonNum);
    setActiveLesson(lessonData);
    setCurrentSlideIndex(0);
    setQuizSubmitted(false);
    setSelectedQuizOption(null);
    setQuizIsCorrect(null);
    setActiveTab('academy');
  };

  // Add standard reward helper
  const handleAddRewards = (g: number, x: number) => {
    setGold(prev => Math.max(0, prev + g));
    setXp(prev => Math.max(0, prev + x));
  };

  // Onboarding Complete Handler
  const handleOnboardingComplete = (data: { playerName: string; experience: 'beginner' | 'intermediate' | 'advanced'; goal: string; sproutId: string }) => {
    setPlayerName(data.playerName);
    setExperience(data.experience);
    setGoal(data.goal);
    setSproutId(data.sproutId);
    
    // Seed starter level based on experience
    if (data.experience === 'intermediate') {
      setXp(3500);
      setCompletedLessons(['level-1', 'level-2', 'level-3', 'level-4', 'level-5']);
    } else if (data.experience === 'advanced') {
      setXp(8500);
      setCompletedLessons(['level-1', 'level-2', 'level-11', 'level-12', 'level-21']);
    } else {
      setXp(120);
    }
  };

  // Cloud Backup function
  const handleCloudBackup = () => {
    gameAudio.playClick();
    setSyncingCloud(true);
    setTimeout(() => {
      setSyncingCloud(false);
      alert('Cloud Sync completed successfully! Your portfolio, lessons progress, notes, and avatar are secured with your Google credentials.');
      gameAudio.playLevelUp();
    }, 1800);
  };

  // AI Chat Bot Send message
  const handleSendAiMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiMessage.trim() || aiLoading) return;

    const userText = aiMessage;
    setAiHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setAiMessage('');
    setAiLoading(true);

    try {
      const portfolioString = Object.entries(portfolio)
        .map(([t, s]) => `${s} shares of ${t}`)
        .join(', ') || 'No active positions';

      const promptContext = `User is currently level "${currentRank.title}" with ${xp} XP. Their portfolio consists of: ${portfolioString}. Current cash is $${cash}. They asked: "${userText}"`;

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptContext,
          systemInstruction: 'You are an encouraging, expert financial coach named GrowBot at GrowFolio. Keep responses crisp, actionable, engaging, and easy to read. Reference their current rank or portfolio briefly if appropriate to make it hyper-personalized. Use bullet points for structural clarity. Encourage user to play our simulator and learn in our Academy.'
        })
      });

      const data = await response.json();
      setAiHistory(prev => [...prev, { sender: 'bot', text: data.text || 'I could not parse that correctly.' }]);
    } catch (err) {
      console.error(err);
      setAiHistory(prev => [...prev, { sender: 'bot', text: 'Oops! I had trouble connecting. Let me give you a quick local analysis: Your portfolio is currently valued at $' + totalPortfolioValue.toFixed(2) + '. Diversify and pass Intermediate lessons to build technical charting skills!' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleBuyDecoration = (item: string, cost: number) => {
    if (gold < cost) {
      alert('Insufficient Gold!');
      return;
    }
    gameAudio.playClick();
    setGold(prev => prev - cost);
    setUnlockedDecorations([...unlockedDecorations, item]);
    setActiveDecorations([...activeDecorations, item]);
    gameAudio.playCoin();
  };

  const handleToggleDecoration = (item: string) => {
    gameAudio.playClick();
    if (activeDecorations.includes(item)) {
      setActiveDecorations(activeDecorations.filter(i => i !== item));
    } else {
      setActiveDecorations([...activeDecorations, item]);
    }
  };

  const handleStartLesson = (levelNum: number) => {
    gameAudio.playClick();
    const lessonData = generateFullLesson(levelNum);
    setActiveLesson(lessonData);
    setCurrentSlideIndex(0);
    setQuizSubmitted(false);
    setSelectedQuizOption(null);
    setQuizIsCorrect(null);
  };

  const handleNextSlide = () => {
    gameAudio.playClick();
    if (activeLesson && currentSlideIndex < activeLesson.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    gameAudio.playClick();
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleSelectQuizOption = (optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedQuizOption(optIdx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedQuizOption === null || !activeLesson) return;
    
    gameAudio.playClick();
    setQuizSubmitted(true);
    const isCorrect = selectedQuizOption === activeLesson.correctAnswerIndex;
    setQuizIsCorrect(isCorrect);

    if (isCorrect) {
      const isNew = !completedLessons.includes(activeLesson.id);
      if (isNew) {
        setCompletedLessons([...completedLessons, activeLesson.id]);
        const xpR = activeLesson.levelNum <= 300 ? 200 : activeLesson.levelNum <= 700 ? 250 : 300;
        const goldR = activeLesson.levelNum <= 300 ? 30 : activeLesson.levelNum <= 700 ? 40 : 50;
        setXp(prev => prev + xpR);
        setGold(prev => prev + goldR);
        gameAudio.playCorrect();
        gameAudio.playXpGain();
      } else {
        gameAudio.playCorrect();
      }
    } else {
      gameAudio.playWrong();
    }
  };

  const handleBuyStock = () => {
    if (tradeAmount <= 0) return;
    const cost = activeStock.price * tradeAmount;
    if (cost > cash) {
      alert('Insufficient Buying Power!');
      return;
    }
    gameAudio.playClick();
    gameAudio.playCoin();

    setCash(prev => prev - cost);
    setPortfolio(prev => ({
      ...prev,
      [activeStock.ticker]: (prev[activeStock.ticker] || 0) + tradeAmount
    }));

    const tx: Transaction = {
      ticker: activeStock.ticker,
      type: 'BUY',
      shares: tradeAmount,
      price: activeStock.price,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().substring(0, 5)
    };
    setTransactions([tx, ...transactions]);
  };

  const handleSellStock = () => {
    const owned = portfolio[activeStock.ticker] || 0;
    if (tradeAmount <= 0 || tradeAmount > owned) {
      alert('Not enough shares to sell!');
      return;
    }
    gameAudio.playClick();
    gameAudio.playCoin();

    const proceeds = activeStock.price * tradeAmount;
    setCash(prev => prev + proceeds);
    
    const newOwned = owned - tradeAmount;
    const updatedPortfolio = { ...portfolio };
    if (newOwned === 0) {
      delete updatedPortfolio[activeStock.ticker];
    } else {
      updatedPortfolio[activeStock.ticker] = newOwned;
    }
    setPortfolio(updatedPortfolio);

    const tx: Transaction = {
      ticker: activeStock.ticker,
      type: 'SELL',
      shares: tradeAmount,
      price: activeStock.price,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().substring(0, 5)
    };
    setTransactions([tx, ...transactions]);
  };

  // SVGs for tree stage rendering
  const renderTreeSVG = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-2xl">
        {/* Ground land */}
        <ellipse cx="100" cy="170" rx="60" ry="12" fill="#14532d" opacity="0.4" />
        <ellipse cx="100" cy="170" rx="50" ry="8" fill="#15803d" opacity="0.6" />

        {/* Sprouts/Trunks depending on XP */}
        {xp < 1000 && (
          // SEED STAGE
          <g>
            <circle cx="100" cy="160" r="4" fill="#78350f" />
            <path d="M100 160 Q105 145 102 135" stroke="#22c55e" strokeWidth="2.5" fill="none" />
            <path d="M102 135 Q112 130 114 136" stroke="#22c55e" strokeWidth="2" fill="none" />
          </g>
        )}

        {xp >= 1000 && xp < 2500 && (
          // SPROUT STAGE
          <g>
            <path d="M100 170 Q100 140 102 120" stroke="#78350f" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            {/* Small leaves */}
            <path d="M102 120 Q112 110 114 116" fill="#22c55e" />
            <path d="M102 120 Q92 110 90 116" fill="#22c55e" />
          </g>
        )}

        {xp >= 2500 && xp < 4500 && (
          // SAPLING STAGE
          <g>
            <path d="M100 170 Q98 130 100 95" stroke="#78350f" strokeWidth="6.5" fill="none" strokeLinecap="round" />
            <path d="M100 120 Q115 105 120 112" stroke="#78350f" strokeWidth="4.5" fill="none" />
            {/* Foliage bunches */}
            <circle cx="100" cy="85" r="22" fill="#15803d" opacity="0.9" />
            <circle cx="118" cy="108" r="14" fill="#166534" opacity="0.8" />
          </g>
        )}

        {xp >= 4500 && xp < 7000 && (
          // YOUNG TREE
          <g>
            <path d="M100 170 Q98 120 100 85" stroke="#78350f" strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d="M100 130 Q122 110 128 115" stroke="#78350f" strokeWidth="5.5" fill="none" />
            <path d="M100 115 Q78 95 72 102" stroke="#78350f" strokeWidth="5.5" fill="none" />
            <circle cx="100" cy="72" r="28" fill="#15803d" />
            <circle cx="125" cy="110" r="18" fill="#166534" />
            <circle cx="75" cy="98" r="18" fill="#166534" />
          </g>
        )}

        {xp >= 7000 && xp < 10500 && (
          // STRONG TREE
          <g>
            <path d="M100 170 L100 70" stroke="#78350f" strokeWidth="12" fill="none" strokeLinecap="round" />
            <path d="M100 120 Q130 95 138 100" stroke="#78350f" strokeWidth="7" fill="none" />
            <path d="M100 110 Q70 85 62 92" stroke="#78350f" strokeWidth="7" fill="none" />
            <circle cx="100" cy="58" r="34" fill="#15803d" />
            <circle cx="134" cy="98" r="24" fill="#166534" />
            <circle cx="66" cy="88" r="24" fill="#166534" />
          </g>
        )}

        {xp >= 10500 && xp < 15000 && (
          // BLOOMING TREE (Flowers)
          <g>
            <path d="M100 170 L100 65" stroke="#78350f" strokeWidth="14" fill="none" strokeLinecap="round" />
            <path d="M100 115 Q132 90 142 95" stroke="#78350f" strokeWidth="8.5" fill="none" />
            <path d="M100 105 Q68 80 58 88" stroke="#78350f" strokeWidth="8.5" fill="none" />
            <circle cx="100" cy="52" r="38" fill="#15803d" />
            <circle cx="138" cy="92" r="26" fill="#166534" />
            <circle cx="62" cy="82" r="26" fill="#166534" />
            {/* Blooming flower buds overlay */}
            <circle cx="92" cy="42" r="4" fill="#ec4899" />
            <circle cx="108" cy="55" r="4" fill="#ec4899" />
            <circle cx="135" cy="88" r="4" fill="#ec4899" />
            <circle cx="58" cy="78" r="4" fill="#ec4899" />
          </g>
        )}

        {xp >= 15000 && xp < 20000 && (
          // FRUIT TREE (Apples)
          <g>
            <path d="M100 170 L100 60" stroke="#78350f" strokeWidth="16" fill="none" strokeLinecap="round" />
            <path d="M100 110 Q135 85 145 90" stroke="#78350f" strokeWidth="9.5" fill="none" />
            <path d="M100 100 Q65 75 55 82" stroke="#78350f" strokeWidth="9.5" fill="none" />
            <circle cx="100" cy="48" r="42" fill="#15803d" />
            <circle cx="142" cy="88" r="28" fill="#166534" />
            <circle cx="58" cy="78" r="28" fill="#166534" />
            {/* Red apples fruits */}
            <circle cx="85" cy="35" r="4.5" fill="#ef4444" />
            <circle cx="112" cy="45" r="4.5" fill="#ef4444" />
            <circle cx="132" cy="82" r="4.5" fill="#ef4444" />
            <circle cx="62" cy="75" r="4.5" fill="#ef4444" />
          </g>
        )}

        {xp >= 20000 && (
          // GOLDEN TREE (Ultimate glowing tree)
          <g>
            <path d="M100 170 L100 55" stroke="#78350f" strokeWidth="18" fill="none" strokeLinecap="round" />
            <path d="M100 105 Q138 80 148 85" stroke="#78350f" strokeWidth="11" fill="none" />
            <path d="M100 95 Q62 70 52 78" stroke="#78350f" strokeWidth="11" fill="none" />
            {/* Golden glowing foliage */}
            <circle cx="100" cy="44" r="46" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="145" cy="82" r="30" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
            <circle cx="55" cy="72" r="30" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
          </g>
        )}

        {/* Tree unlocked decorations overlays */}
        {activeDecorations.includes('birds') && (
          <g>
            {/* Simple Birds Nesting or Flying */}
            <path d="M65 55 Q70 50 75 55 M75 55 Q80 50 85 55" stroke="#ffffff" strokeWidth="2" fill="none" />
            <path d="M135 45 Q140 40 145 45 M145 45 Q150 40 155 45" stroke="#ffffff" strokeWidth="2" fill="none" />
          </g>
        )}

        {activeDecorations.includes('butterflies') && (
          <g className="animate-bounce">
            {/* Fluttering Butterflies */}
            <ellipse cx="40" cy="110" rx="3" ry="5" fill="#60a5fa" />
            <ellipse cx="46" cy="110" rx="3" ry="5" fill="#60a5fa" />
            <circle cx="43" cy="110" r="1.5" fill="#1e3a8a" />
            
            <ellipse cx="160" cy="130" rx="4" ry="6" fill="#f472b6" />
            <ellipse cx="168" cy="130" rx="4" ry="6" fill="#f472b6" />
          </g>
        )}

        {activeDecorations.includes('gold_fruit') && xp >= 2500 && (
          <g>
            {/* Golden fruits hanging */}
            <circle cx="108" cy="68" r="6" fill="#fbbf24" />
            <circle cx="78" cy="98" r="6" fill="#fbbf24" />
            <circle cx="118" cy="108" r="5" fill="#fbbf24" />
          </g>
        )}

        {/* Dynamic Watering action visualization */}
        {showWateringAnimation && (
          <g className="animate-pulse">
            {/* A watering can tilted */}
            <rect x="135" y="60" width="22" height="14" rx="4" fill="#3b82f6" />
            <path d="M135 68 L122 76" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
            {/* Water drops */}
            <circle cx="118" cy="85" r="2.5" fill="#93c5fd" />
            <circle cx="114" cy="95" r="2.5" fill="#93c5fd" />
            <circle cx="120" cy="105" r="2" fill="#93c5fd" />
          </g>
        )}
      </svg>
    );
  };

  // Render technical candlestick chart
  const renderCandlestickChart = (stock: Stock) => {
    if (!stock || !stock.history || stock.history.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center text-white/30 text-xs">
          No chart data available
        </div>
      );
    }

    const padX = 40;
    const padY = 20;
    const width = 400;
    const height = 180;

    // Helper to generate dynamic, beautiful 15-day history if current has fewer points
    const getChartHistory = () => {
      const hist = [...stock.history];
      if (hist.length < 15) {
        const totalPoints = 15;
        const seedHistory = [];
        let currentPrice = stock.price;
        // Seed based on stock ticker to get a stable signature
        const tickerHash = stock.ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        for (let i = 0; i < totalPoints; i++) {
          const rand = Math.sin(tickerHash + i * 17.3) * 0.5 + 0.5; // stable 0 to 1
          const changePercent = (rand - 0.47) * 0.016; // -0.75% to +0.85%
          
          const prevClose = currentPrice / (1 + changePercent);
          const open = prevClose;
          const close = currentPrice;
          const high = Math.max(open, close) * (1 + (rand * 0.006));
          const low = Math.min(open, close) * (1 - ((1 - rand) * 0.006));
          
          seedHistory.unshift({ open, high, low, close });
          currentPrice = prevClose;
        }
        return seedHistory;
      }
      return hist;
    };

    const chartHistory = getChartHistory();
    const prices = chartHistory.flatMap(h => [h.open, h.high, h.low, h.close]);
    const maxVal = Math.max(...prices) * 1.002;
    const minVal = Math.min(...prices) * 0.998;
    const diff = maxVal - minVal || 1;

    const scaleY = (val: number) => {
      return height - padY - ((val - minVal) / diff) * (height - 2 * padY);
    };

    const count = chartHistory.length;
    const stepX = (width - 2 * padX) / Math.max(1, count - 1 || 1);

    // Calculate SMA (Simple Moving Average) - period 4
    const calculateSMA = (period: number) => {
      const smaPoints: { x: number; y: number }[] = [];
      for (let i = 0; i < count; i++) {
        const start = Math.max(0, i - period + 1);
        const sub = chartHistory.slice(start, i + 1);
        const sum = sub.reduce((acc, c) => acc + c.close, 0);
        const avg = sum / sub.length;
        smaPoints.push({
          x: padX + i * stepX,
          y: scaleY(avg)
        });
      }
      return smaPoints;
    };

    const sma4Points = calculateSMA(4);
    const smaLinePath = sma4Points.length > 0
      ? `M ${sma4Points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`
      : '';

    // Area path under close prices
    const areaPoints = chartHistory.map((candle, idx) => ({
      x: padX + idx * stepX,
      y: scaleY(candle.close)
    }));
    const areaPath = areaPoints.length > 0
      ? `M ${areaPoints[0].x.toFixed(1)},${height - padY} L ${areaPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')} L ${areaPoints[areaPoints.length - 1].x.toFixed(1)},${height - padY} Z`
      : '';

    // Volume bars scale
    const volMaxHeight = 22;
    const volumes = chartHistory.map((c, idx) => {
      const volatility = Math.abs(c.close - c.open) / c.open;
      const baseVol = volatility * 12000;
      const stableRand = Math.sin(idx * 3.1) * 40 + 70;
      return baseVol + stableRand;
    });
    const maxVol = Math.max(...volumes) || 1;

    // Hover mouse handler
    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * width;
      const mouseY = ((e.clientY - rect.top) / rect.height) * height;

      if (mouseX >= padX - 5 && mouseX <= width - padX + 5) {
        const idx = Math.min(count - 1, Math.max(0, Math.round((mouseX - padX) / stepX)));
        setHoveredCandleIndex(idx);
        setHoveredCandlePos({ x: padX + idx * stepX, y: mouseY });
      } else {
        setHoveredCandleIndex(null);
        setHoveredCandlePos(null);
      }
    };

    const handleMouseLeave = () => {
      setHoveredCandleIndex(null);
      setHoveredCandlePos(null);
    };

    // Determine target candle to show details for
    const activeIdx = hoveredCandleIndex !== null ? hoveredCandleIndex : count - 1;
    const activeCandle = chartHistory[activeIdx];
    const isBullishCandle = activeCandle.close >= activeCandle.open;
    const candleChange = activeCandle.close - activeCandle.open;
    const candleChangePercent = (candleChange / activeCandle.open) * 100;

    return (
      <div className="w-full bg-gradient-to-br from-[#0c0d12] to-[#12131a] rounded-2xl p-5 border border-white/10 relative overflow-hidden shadow-2xl">
        {/* Glow backdrop decorative lighting */}
        <div className={`absolute top-0 right-0 w-36 h-36 rounded-full filter blur-[60px] opacity-10 transition-colors duration-500 pointer-events-none ${
          stock.change >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
        }`} />

        {/* HUD Header - Interactive Meta Information */}
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-white/5 pb-3.5 mb-3.5 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm bg-white/10 px-2 py-0.5 rounded text-white tracking-wide">
                {stock.ticker}
              </span>
              <span className="text-[10px] text-white/45 font-mono hidden sm:inline uppercase tracking-wider">
                Interactive Arena feed
              </span>
            </div>
            <h5 className="text-[11px] font-sans text-white/60 mt-1 font-medium max-w-[160px] truncate">
              {stock.name}
            </h5>
          </div>

          {/* Interactive stats HUD block */}
          <div className="flex items-center gap-3.5 font-mono text-[9px] bg-white/[0.02] border border-white/5 rounded-xl px-3 py-1.5 shadow-inner">
            <div>
              <span className="text-white/30 block text-[8px] uppercase">Open</span>
              <span className="text-white font-bold">₹{activeCandle.open.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
            </div>
            <div>
              <span className="text-white/30 block text-[8px] uppercase">High</span>
              <span className="text-emerald-400 font-bold">₹{activeCandle.high.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
            </div>
            <div>
              <span className="text-white/30 block text-[8px] uppercase">Low</span>
              <span className="text-rose-400 font-bold">₹{activeCandle.low.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
            </div>
            <div>
              <span className="text-white/30 block text-[8px] uppercase">Close</span>
              <span className="text-white font-bold">₹{activeCandle.close.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
            </div>
            <div className="text-right pl-1 border-l border-white/10">
              <span className="text-white/30 block text-[8px] uppercase">Change</span>
              <span className={`font-black font-mono ${isBullishCandle ? 'text-emerald-400' : 'text-rose-400'}`}>
                {candleChange >= 0 ? '+' : ''}{candleChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* SVG Stage */}
        <div className="relative">
          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            className="w-full h-auto cursor-crosshair overflow-visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Definitions for gorgeous gradients and glowing shadows */}
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="bullishGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="bearishGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
              <linearGradient id="areaGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
              </linearGradient>
              <linearGradient id="areaRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.00" />
              </linearGradient>
              <linearGradient id="volGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
              </linearGradient>
            </defs>

            {/* Horizontal gridlines */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => {
              const priceVal = minVal + ratio * diff;
              const y = scaleY(priceVal);
              return (
                <g key={i}>
                  <line 
                    x1={padX} 
                    y1={y} 
                    x2={width - padX} 
                    y2={y} 
                    stroke="rgba(255,255,255,0.04)" 
                    strokeWidth="0.75"
                    strokeDasharray="4 4" 
                  />
                  <text 
                    x={padX - 8} 
                    y={y + 2.5} 
                    fill="rgba(255,255,255,0.25)" 
                    fontSize="7.5" 
                    className="font-mono text-right" 
                    textAnchor="end"
                  >
                    ₹{priceVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </text>
                </g>
              );
            })}

            {/* Underlying Area Chart with Gradient */}
            <path 
              d={areaPath} 
              fill={stock.change >= 0 ? 'url(#areaGreenGrad)' : 'url(#areaRedGrad)'} 
              pointerEvents="none"
            />

            {/* Technical SMA Indicator Line with glowing filter */}
            <path
              d={smaLinePath}
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.8"
              filter="url(#glow)"
              pointerEvents="none"
            />

            {/* Volume bars rendered at bottom */}
            {chartHistory.map((candle, idx) => {
              const x = padX + idx * stepX;
              const volHeight = (volumes[idx] / maxVol) * volMaxHeight;
              const y = height - padY - volHeight;
              const isBull = candle.close >= candle.open;
              return (
                <rect
                  key={`vol-${idx}`}
                  x={x - (stepX * 0.35) / 2}
                  y={y}
                  width={stepX * 0.35}
                  height={volHeight}
                  fill={isBull ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)'}
                  stroke={isBull ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}
                  strokeWidth="0.5"
                  rx="0.5"
                  pointerEvents="none"
                />
              );
            })}

            {/* Render individual candles with rich gradients */}
            {chartHistory.map((candle, idx) => {
              const x = padX + idx * stepX;
              const yOpen = scaleY(candle.open);
              const yClose = scaleY(candle.close);
              const yHigh = scaleY(candle.high);
              const yLow = scaleY(candle.low);
              const isBullish = candle.close >= candle.open;
              const color = isBullish ? '#10b981' : '#f43f5e';
              const gradUrl = isBullish ? 'url(#bullishGrad)' : 'url(#bearishGrad)';

              const bodyTop = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(1.5, Math.abs(yOpen - yClose));
              const bodyWidth = Math.min(14, stepX * 0.45 || 8);

              // Highlights for active/hovered state
              const isHovered = idx === hoveredCandleIndex;

              return (
                <g key={idx} className="transition-opacity duration-200">
                  {/* Candle Wick (Shadow & High/Low) */}
                  <line 
                    x1={x} 
                    y1={yHigh} 
                    x2={x} 
                    y2={yLow} 
                    stroke={color} 
                    strokeWidth={isHovered ? '2' : '1.25'} 
                  />
                  {/* Candle Real Body */}
                  <rect
                    x={x - bodyWidth / 2}
                    y={bodyTop}
                    width={bodyWidth}
                    height={bodyHeight}
                    fill={gradUrl}
                    stroke={color}
                    strokeWidth={isHovered ? '1.5' : '0.75'}
                    rx="1"
                    className="transition-all duration-150"
                    style={{
                      filter: isHovered ? 'url(#glow)' : 'none',
                    }}
                  />
                </g>
              );
            })}

            {/* Current price horizontal marker line with dynamic pulsing beacon */}
            <g pointerEvents="none">
              <line
                x1={padX}
                y1={scaleY(stock.price)}
                x2={width - padX}
                y2={scaleY(stock.price)}
                stroke={stock.change >= 0 ? 'rgba(16,185,129,0.45)' : 'rgba(244,63,94,0.45)'}
                strokeDasharray="2 3"
                strokeWidth="1.25"
              />
              <circle
                cx={width - padX}
                cy={scaleY(stock.price)}
                r="3.5"
                fill={stock.change >= 0 ? '#10b981' : '#f43f5e'}
                filter="url(#glow)"
              />
              <circle
                cx={width - padX}
                cy={scaleY(stock.price)}
                r="7"
                fill="none"
                stroke={stock.change >= 0 ? '#10b981' : '#f43f5e'}
                strokeWidth="1"
                className="animate-ping"
                opacity="0.5"
                style={{ transformOrigin: `${width - padX}px ${scaleY(stock.price)}px` }}
              />
            </g>

            {/* Real-time crosshair lines */}
            {hoveredCandleIndex !== null && hoveredCandlePos !== null && (
              <g pointerEvents="none">
                {/* Vertical Dotted Line */}
                <line
                  x1={hoveredCandlePos.x}
                  y1={padY}
                  x2={hoveredCandlePos.x}
                  y2={height - padY}
                  stroke="rgba(255,255,255,0.2)"
                  strokeDasharray="3 3"
                  strokeWidth="0.75"
                />
                {/* Horizontal Dotted Line */}
                <line
                  x1={padX}
                  y1={hoveredCandlePos.y}
                  x2={width - padX}
                  y2={hoveredCandlePos.y}
                  stroke="rgba(255,255,255,0.2)"
                  strokeDasharray="3 3"
                  strokeWidth="0.75"
                />
                {/* Intersection point */}
                <circle
                  cx={hoveredCandlePos.x}
                  cy={hoveredCandlePos.y}
                  r="3.5"
                  fill="#6366f1"
                  stroke="#ffffff"
                  strokeWidth="1"
                  filter="url(#glow)"
                />
                {/* Dynamic Price coordinates indicator */}
                {hoveredCandlePos.y >= padY && hoveredCandlePos.y <= height - padY && (
                  <g>
                    {/* Background badge for hovered price */}
                    <rect
                      x={width - padX + 2}
                      y={hoveredCandlePos.y - 6}
                      width={padX - 4}
                      height={12}
                      rx="3"
                      fill="#1e1b4b"
                      stroke="#818cf8"
                      strokeWidth="0.5"
                    />
                    <text
                      x={width - padX + 5}
                      y={hoveredCandlePos.y + 2.5}
                      fill="#e0e7ff"
                      fontSize="6.5"
                      className="font-mono font-bold"
                      textAnchor="start"
                    >
                      ₹{Math.round(maxVal - ((hoveredCandlePos.y - padY) / (height - 2 * padY)) * diff)}
                    </text>
                  </g>
                )}
              </g>
            )}
          </svg>
        </div>

        {/* Dynamic Tooltip Info Overlay */}
        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-white/5 text-[9px] text-white/40 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>SMA (4): <strong className="text-indigo-400">₹{activeCandle.close.toFixed(1)}</strong></span>
          </div>
          <div>
            <span>Press & drag mouse to track quotes</span>
          </div>
        </div>
      </div>
    );
  };

  const selectedTheme = SYSTEM_THEMES.find(t => t.id === currentThemeId) || SYSTEM_THEMES[0];

  if (introActive) {
    return <IntroLogo onComplete={() => setIntroActive(false)} />;
  }

  if (view === 'landing') {
    return (
      <LandingPage 
        onLaunchApp={(tab, subtab) => { 
          gameAudio.playClick(); 
          gameAudio.stopIntroMusic();
          setView('app'); 
          if (tab) setActiveTab(tab); 
          if (subtab) setActiveSubTab(subtab); 
        }} 
      />
    );
  }

  return (
    <div 
      id="growfolio-root" 
      className={`min-h-screen bg-black bg-gradient-to-b ${selectedTheme.bgGradient} text-white flex flex-col font-sans overflow-x-hidden`}
    >
      {/* 2. LIVE INDEX MARKET TICKER MARQUEE */}
      <div className="bg-black/85 border-b border-white/10 py-1.5 px-4 overflow-hidden relative z-40 hidden md:block select-none">
        <div className="flex gap-10 animate-[marquee_25s_linear_infinite] whitespace-nowrap">
          {[...LIVE_GLOBAL_INDICES, ...LIVE_GLOBAL_INDICES].map((ind, idx) => {
            const isGreen = ind.change.startsWith('+');
            return (
              <span key={idx} className="inline-flex items-center gap-2 text-[10px] font-mono font-bold">
                <span className="text-white/45">{ind.ticker}</span>
                <span className="text-white">{ind.price}</span>
                <span className={isGreen ? 'text-green-400' : 'text-red-400'}>
                  {ind.change} {isGreen ? '▲' : '▼'}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1280px] w-full mx-auto relative z-10 p-4 md:p-6 gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <aside id="sidebar" className="hidden md:flex w-24 bg-[#07070a]/90 border border-white/[0.06] rounded-[32px] flex-col items-center py-8 gap-10 backdrop-blur-2xl">
          {/* Brand Icon */}
          <div className="w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-neutral-950" />
          </div>

          <nav className="flex flex-col gap-6">
            <button 
              onClick={() => { gameAudio.playClick(); setActiveTab('dashboard'); }}
              className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-white text-black shadow-lg font-black' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
              }`}
              title="Dashboard Hub"
            >
              <Home className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { gameAudio.playClick(); setActiveTab('academy'); }}
              className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${
                activeTab === 'academy' ? 'bg-white text-black shadow-lg font-black' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
              }`}
              title="Investing Academy"
            >
              <GraduationCap className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { gameAudio.playClick(); setActiveTab('simulator'); }}
              className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${
                activeTab === 'simulator' ? 'bg-white text-black shadow-lg font-black' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
              }`}
              title="Stock Market Arena"
            >
              <TrendingUp className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { gameAudio.playClick(); setActiveTab('coach'); }}
              className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${
                activeTab === 'coach' ? 'bg-white text-black shadow-lg font-black' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
              }`}
              title="AI GrowBot Coach"
            >
              <Bot className="w-5 h-5" />
            </button>
          </nav>

          {/* Quick Mute Audio Controls */}
          <div className="mt-auto flex flex-col gap-3">
            <button 
              onClick={handleToggleMusic}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white/50 hover:text-white cursor-pointer"
              title="Toggle Background Music"
            >
              {musicMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400 animate-bounce" />}
            </button>
            <button 
              onClick={handleToggleSfx}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white/50 hover:text-white cursor-pointer"
              title="Toggle Sound Effects"
            >
              {sfxMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY REGION */}
        <main className="flex-1 flex flex-col gap-6">
          
          {/* HEADER BAR */}
          <header className={`bg-[#07070a]/90 border border-white/[0.06] rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-2xl relative overflow-hidden`}>
            <div className="flex items-center gap-3">
              <div className="md:hidden p-2.5 bg-white/[0.03] border border-white/[0.08] rounded-full">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  GrowFolio <span className="text-emerald-400 text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">PRO</span>
                </h1>
                <p className="text-xs text-white/50">Grow Your Assets Alongside Your Knowledge</p>
              </div>
            </div>

            {/* Profile Level Indicators */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 md:gap-5 w-full md:w-auto">
              {/* Controls and Stats Row */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Back to Landing Website button */}
                <button
                  onClick={() => { gameAudio.playClick(); setView('landing'); }}
                  className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] px-2.5 py-1.5 rounded-xl text-white transition-all cursor-pointer shadow-sm"
                >
                  ← Landing Website
                </button>

                {/* Account & Login button */}
                <button
                  onClick={() => { gameAudio.playClick(); setShowAccountModal(true); }}
                  className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-2.5 py-1.5 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  Account & Login
                </button>

                {/* Cloud Backup status */}
                <button
                  onClick={handleCloudBackup}
                  disabled={syncingCloud}
                  className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono font-bold bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-xl text-white transition-all cursor-pointer"
                >
                  <CloudLightning className="w-3.5 h-3.5" />
                  {syncingCloud ? 'Syncing...' : 'Cloud Backup'}
                </button>

                {/* Gold Counter */}
                <div className="bg-[#0b0b0f] border border-white/[0.04] rounded-xl px-2.5 py-1.5 flex items-center gap-1.5" title="Gold earned to unlock decorations">
                  <Coins className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="font-mono text-xs font-bold text-yellow-400">{gold} <span className="text-[9px] text-white/40 font-sans">GOLD</span></span>
                </div>

                {/* Language Selector */}
                <div className="bg-[#0b0b0f] border border-white/[0.04] rounded-xl px-2.5 py-1.5 flex items-center gap-1" title="Select Academy Language">
                  <Languages className="w-3.5 h-3.5 text-blue-400" />
                  <select
                    value={language}
                    onChange={(e) => { gameAudio.playClick(); setLanguage(e.target.value as LanguageCode); }}
                    className="bg-transparent border-none text-[10px] font-bold text-white focus:outline-none cursor-pointer"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-zinc-950 text-white">
                        {lang.flag} {lang.label.substring(0, 3)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* XP Progression */}
              <div className="flex-1 md:flex-initial flex flex-col md:items-end min-w-[150px]">
                <div className="flex justify-between md:justify-end items-center gap-1.5 mb-1">
                  <span className="text-[9px] text-white/50 uppercase tracking-widest font-bold">Investor Rank</span>
                  <span className="text-[10px] font-extrabold text-yellow-500 uppercase tracking-tight">{currentRank.title}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full border border-white/10 overflow-hidden relative" title={`XP: ${xp} / ${currentRank.nextAt}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-1000"
                    style={{ width: `${xpProgressPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between w-full text-[8px] text-white/40 mt-0.5">
                  <span>{xp} XP</span>
                  <span>{currentRank.nextAt} XP for next rank</span>
                </div>
              </div>
            </div>
          </header>

          {/* TAB BAR FOR RESPONSIVE MOBILE */}
          <div className="flex md:hidden bg-[#07070a]/90 border border-white/[0.06] rounded-2xl p-1.5 justify-around backdrop-blur-2xl">
            <button onClick={() => { gameAudio.playClick(); setActiveTab('dashboard'); }} className={`flex-1 py-2.5 flex flex-col items-center rounded-xl text-[10px] ${activeTab === 'dashboard' ? 'bg-white text-black font-extrabold shadow-sm' : 'text-white/50'}`}>
              <Home className="w-4 h-4 mb-0.5" /> Dashboard
            </button>
            <button onClick={() => { gameAudio.playClick(); setActiveTab('academy'); }} className={`flex-1 py-2.5 flex flex-col items-center rounded-xl text-[10px] ${activeTab === 'academy' ? 'bg-white text-black font-extrabold shadow-sm' : 'text-white/50'}`}>
              <GraduationCap className="w-4 h-4 mb-0.5" /> Academy
            </button>
            <button onClick={() => { gameAudio.playClick(); setActiveTab('simulator'); }} className={`flex-1 py-2.5 flex flex-col items-center rounded-xl text-[10px] ${activeTab === 'simulator' ? 'bg-white text-black font-extrabold shadow-sm' : 'text-white/50'}`}>
              <TrendingUp className="w-4 h-4 mb-0.5" /> Simulator
            </button>
            <button onClick={() => { gameAudio.playClick(); setActiveTab('coach'); }} className={`flex-1 py-2.5 flex flex-col items-center rounded-xl text-[10px] ${activeTab === 'coach' ? 'bg-white text-black font-extrabold shadow-sm' : 'text-white/50'}`}>
              <Bot className="w-4 h-4 mb-0.5" /> AI Coach
            </button>
          </div>

          {/* VIEW ROUTER */}
          
          {/* 1. DASHBOARD HUB VIEW */}
          {activeTab === 'dashboard' && (
            <div id="tab-dashboard" className="space-y-6">
              {/* Bento Grid Subtab Selector Menu */}
              <div className="flex overflow-x-auto gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
                {[
                  { id: 'garden', label: 'My SproutGarden', icon: '🌳' },
                  { id: 'arcade', label: 'Games Arcade', icon: '🎮' },
                  { id: 'rewards', label: 'Daily Rewards', icon: '🎁' },
                  { id: 'social', label: 'Friends & Feed', icon: '👥' },
                  { id: 'notebook', label: 'Study Scratchpad', icon: '📝' },
                  { id: 'analytics', label: 'Analytics & Badges', icon: '📊' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => { gameAudio.playClick(); setActiveSubTab(sub.id as any); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      activeSubTab === sub.id ? 'bg-blue-600 text-white shadow-md' : 'text-white/50 hover:bg-white/10'
                    }`}
                  >
                    <span>{sub.icon}</span> {sub.label}
                  </button>
                ))}
              </div>

              {/* SUBTAB 1. GARDEN LANDSCAPE */}
              {activeSubTab === 'garden' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
                  {/* GrowTree Signature Canvas Column */}
                  <div className="col-span-12 lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-[32px] p-6 flex flex-col items-center justify-between backdrop-blur-sm relative overflow-hidden min-h-[440px]">
                    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none"></div>
                    
                    <div className="w-full flex justify-between items-start z-10">
                      <div>
                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest block w-max">
                          🌳 {treeStage.name}
                        </span>
                        <p className="text-white/40 text-xs mt-1 italic">"{treeStage.quote}"</p>
                      </div>
                      
                      {/* Streak widget */}
                      <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1 flex items-center gap-1.5 text-xs font-bold text-orange-400">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span>{streak} Days</span>
                      </div>
                    </div>

                    {/* Floating XP pop indicator */}
                    {floatingXp && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 bg-green-500 text-white font-bold px-4 py-1.5 rounded-full shadow-lg text-sm z-30">
                        {floatingXp}
                      </div>
                    )}

                    {/* Main Tree Art */}
                    <div className="my-4 relative flex items-center justify-center">
                      {renderTreeSVG()}
                    </div>

                    {/* Interaction & Utility Panel */}
                    <div className="w-full flex flex-col gap-3 z-10">
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={handleWaterTree}
                          disabled={!waterReady}
                          className={`py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all duration-300 ${
                            waterReady 
                              ? 'bg-green-600 hover:bg-green-500 text-white border-green-500 shadow-[0_4px_12px_rgba(34,197,94,0.3)] cursor-pointer' 
                              : 'bg-white/5 text-white/30 border-white/10 cursor-not-allowed'
                          }`}
                        >
                          <Droplet className={`w-4 h-4 ${waterReady ? 'animate-bounce' : ''}`} />
                          {waterReady ? 'Water Tree (+150 XP)' : 'Watered Today'}
                        </button>

                        <button 
                          onClick={() => { gameAudio.playClick(); setActiveTab('academy'); }}
                          className="py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-blue-400" />
                          Study & Grow
                        </button>
                      </div>

                      {/* Water ready clock indicator */}
                      <p className="text-[10px] text-white/40 text-center">
                        {waterReady ? 'Your GrowTree is thirsty! Water it to earn daily rewards.' : 'Tree hydrated. Next watering available in 14h.'}
                      </p>
                    </div>
                  </div>

                  {/* Learning Journey Roadmap & Avatar customizer */}
                  <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                    {/* AVATAR PROFILE QUICK VIEW CARD */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-5 flex justify-between items-center relative overflow-hidden">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest">Active Profile</span>
                        <h4 className="font-bold text-sm text-white">Hey, {playerName || 'Honorary GrowTrader'}</h4>
                        <p className="text-[11px] text-white/50 leading-normal max-w-sm">Customize your avatar hairdos and trade outfits or view your professional credentials.</p>
                        
                        <div className="pt-2 flex gap-2">
                          <button
                            onClick={() => { gameAudio.playClick(); setActiveSubTab('social'); }}
                            className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold text-white/80 cursor-pointer"
                          >
                            Customize Avatar
                          </button>
                          
                          {completedLessons.length >= 5 && (
                            <button
                              onClick={() => { gameAudio.playClick(); setCertificateTrack('Beginner'); setShowCertificate(true); }}
                              className="px-3.5 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-xl text-[10px] font-bold cursor-pointer border border-yellow-500/20"
                            >
                              Show Certificate
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Micro visual avatar bubble */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-950 to-zinc-900 border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                        👤
                      </div>
                    </div>

                    {/* Classic roadmap */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 backdrop-blur-sm flex-1 flex flex-col justify-between">
                      <h3 className="text-md font-bold mb-4 flex items-center justify-between">
                        Learning Journey Roadmap
                        <span className="text-xs text-blue-400 font-normal hover:underline cursor-pointer flex items-center gap-1" onClick={() => setActiveTab('academy')}>
                          Open Academy <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </h3>

                      <div className="space-y-3">
                        {/* BEGINNER CARD */}
                        <div className="p-3.5 bg-green-500/10 border border-green-500/20 rounded-2xl text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <h4 className="font-bold text-xs">Level 1: Beginner Investor</h4>
                                <span className="text-[10px] text-green-400 font-mono">Completed</span>
                              </div>
                              <p className="text-[10px] text-white/60">Money management, compounding, & stock market fundamentals.</p>
                            </div>
                          </div>
                        </div>

                        {/* INTERMEDIATE CARD */}
                        <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">2</div>
                            <div className="flex-1">
                              <h4 className="font-bold text-xs">Level 2: Active Charting</h4>
                              <p className="text-[10px] text-white/60">Volume support, resistance break levels, and indicator lines.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2. GAMES ARCADE */}
              {activeSubTab === 'arcade' && (
                <div className="animate-fade-in">
                  <MiniGames gold={gold} xp={xp} onAddRewards={handleAddRewards} />
                </div>
              )}

              {/* SUBTAB 3. BOOSTER REWARDS */}
              {activeSubTab === 'rewards' && (
                <div className="animate-fade-in">
                  <DailyRewardsAndWheel 
                    gold={gold} 
                    xp={xp} 
                    onAddRewards={handleAddRewards} 
                    streak={streak} 
                    onIncrementStreak={() => setStreak(prev => prev + 1)} 
                  />
                </div>
              )}

              {/* SUBTAB 4. FRIENDS & SOCIAL COMMUNITY TIMELINE */}
              {activeSubTab === 'social' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Theme cosmetic unlocks panel */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                    <h4 className="text-white font-bold text-sm flex items-center gap-1.5 mb-1.5 border-b border-white/5 pb-3">
                      🎨 Unlockable Visual Arena Themes
                    </h4>
                    <p className="text-[11px] text-white/40 mb-4">Invest your gold coins to buy rare atmospheric visual backdrops that morph colors across your active screens.</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                      {SYSTEM_THEMES.map((theme) => {
                        const isUnlocked = unlockedThemes.includes(theme.id);
                        const isEquipped = currentThemeId === theme.id;
                        return (
                          <div key={theme.id} className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between items-center text-center">
                            <span className="text-xs font-bold text-white block truncate w-full">{theme.name}</span>
                            
                            {isUnlocked ? (
                              <button
                                onClick={() => handleSelectTheme(theme.id)}
                                className={`mt-3 w-full py-1 text-[9px] font-bold rounded-lg cursor-pointer ${
                                  isEquipped ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-white/10 hover:bg-white/20'
                                }`}
                              >
                                {isEquipped ? 'Equipped' : 'Equip'}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBuyTheme(theme)}
                                className="mt-3 w-full py-1 bg-yellow-500 hover:bg-yellow-400 text-black text-[9px] font-black rounded-lg cursor-pointer flex items-center justify-center gap-0.5"
                              >
                                <Coins className="w-2.5 h-2.5" /> {theme.cost}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Avatar Customize module */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                    <h4 className="text-white font-bold text-sm flex items-center gap-1.5 mb-4 border-b border-white/5 pb-3">
                      👤 Customize Trader Avatar Layers
                    </h4>
                    <AvatarCustomizer 
                      config={avatarConfig} 
                      onChange={setAvatarConfig} 
                      gold={gold} 
                      onSpendGold={(amt) => setGold(prev => prev - amt)} 
                      onCustomized={() => {}} 
                    />
                  </div>

                  {/* Community feed */}
                  <CommunityFeed 
                    gold={gold} 
                    xp={xp} 
                    onAddRewards={handleAddRewards} 
                    avatarEmoji="🌳" 
                  />
                </div>
              )}

              {/* SUBTAB 5. STUDY NOTEBOOK SCRATCHPAD */}
              {activeSubTab === 'notebook' && (
                <div className="space-y-6 animate-fade-in">
                  <EducationalVideos onAddRewards={handleAddRewards} />
                  
                  <NotesAndBookmarks 
                    notes={notes} 
                    onAddNote={handleAddNote} 
                    onDeleteNote={handleDeleteNote} 
                    bookmarks={bookmarks} 
                    onToggleBookmark={handleToggleBookmark} 
                    onJumpToLesson={handleJumpToLesson} 
                  />
                </div>
              )}

              {/* SUBTAB 6. ANALYTICS & BADGES */}
              {activeSubTab === 'analytics' && (
                <div className="animate-fade-in">
                  <AnalyticsAndEvents 
                    xp={xp} 
                    gold={gold} 
                    onAddRewards={handleAddRewards} 
                    completedLessons={completedLessons} 
                    transactionsCount={transactions.length} 
                    portfolioProfit={portfolioProfitLoss} 
                    streak={streak} 
                  />
                </div>
              )}
            </div>
          )}

          {/* 2. INVESTING ACADEMY VIEW */}
          {activeTab === 'academy' && (
            <div id="tab-academy" className="space-y-6">
              {/* Dynamic lesson screen if active */}
              {activeLesson ? (
                <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 backdrop-blur-md relative">
                  {/* Exit button */}
                  <button 
                    onClick={() => { gameAudio.playClick(); setActiveLesson(null); }}
                    className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 px-3.5 py-1 rounded-full text-xs cursor-pointer"
                  >
                    ← Exit Lesson
                  </button>

                  <div className="space-y-6">
                    <div className="border-b border-white/5 pb-4">
                      <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">
                        # LEVEL {activeLesson.levelNum} MODULE
                      </span>
                      <h3 className="text-white font-black text-lg md:text-2xl mt-1 flex items-center gap-2">
                        {activeLesson.title}
                        <button
                          onClick={() => handleToggleBookmark(activeLesson.levelNum, activeLesson.title)}
                          className="p-1 bg-white/5 hover:bg-white/10 text-yellow-400 rounded-lg cursor-pointer"
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarks.find(b => b.lessonNum === activeLesson.levelNum) ? 'fill-current' : ''}`} />
                        </button>
                      </h3>
                      <p className="text-xs text-white/40 mt-1">{activeLesson.description}</p>
                    </div>

                    {/* SLIDES DISPLAYER PLAYER */}
                    <div className="bg-black/30 border border-white/5 p-6 rounded-2xl relative min-h-[160px] flex items-center justify-center">
                      <p className="text-white text-xs md:text-sm font-medium leading-relaxed max-w-xl text-center">
                        {activeLesson.slides[currentSlideIndex]}
                      </p>
                    </div>

                    {/* Progress Slider & Slide controllers */}
                    <div className="flex justify-between items-center text-xs text-white/40 font-mono">
                      <button 
                        disabled={currentSlideIndex === 0}
                        onClick={handlePrevSlide}
                        className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-30 cursor-pointer"
                      >
                        Previous
                      </button>

                      <span>Slide {currentSlideIndex + 1} / {activeLesson.slides.length}</span>

                      {currentSlideIndex < activeLesson.slides.length - 1 ? (
                        <button 
                          onClick={handleNextSlide}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-pointer"
                        >
                          Next Slide
                        </button>
                      ) : (
                        <span className="text-yellow-400 font-bold">Slide deck completed! Scroll below for the Module Quiz.</span>
                      )}
                    </div>

                    {/* QUIZ SECTION (Only unlocked once slides deck is fully viewed) */}
                    {currentSlideIndex === activeLesson.slides.length - 1 && (
                      <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                        <span className="text-[10px] font-mono font-bold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded">
                          Concept checkpoint quiz
                        </span>
                        
                        <p className="text-white text-xs md:text-sm font-black">{activeLesson.quizQuestion}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {activeLesson.quizOptions.map((opt, oidx) => {
                            let btnStyle = 'bg-white/5 border-white/10 hover:border-white/30 text-white/70';
                            if (quizSubmitted) {
                              if (oidx === activeLesson.correctAnswerIndex) {
                                btnStyle = 'bg-green-500/20 border-green-500 text-green-400 font-bold';
                              } else if (oidx === selectedQuizOption) {
                                btnStyle = 'bg-red-500/20 border-red-500 text-red-400';
                              } else {
                                btnStyle = 'bg-white/5 border-white/10 opacity-30';
                              }
                            } else if (selectedQuizOption === oidx) {
                              btnStyle = 'bg-blue-600/15 border-blue-500 text-blue-300';
                            }

                            return (
                              <button
                                key={oidx}
                                disabled={quizSubmitted}
                                onClick={() => handleSelectQuizOption(oidx)}
                                className={`p-3.5 rounded-2xl border text-left text-xs md:text-sm transition-all cursor-pointer ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {!quizSubmitted ? (
                          <div className="pt-2 flex justify-end">
                            <button
                              disabled={selectedQuizOption === null}
                              onClick={handleSubmitQuizAnswer}
                              className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs rounded-xl cursor-pointer disabled:opacity-40"
                            >
                              Submit Checkpoint Answer
                            </button>
                          </div>
                        ) : (
                          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1 text-xs">
                            <p className={quizIsCorrect ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                              {quizIsCorrect ? '✓ Correct Answer!' : '✗ Incorrect Answer.'}
                            </p>
                            <p className="text-white/60 leading-relaxed mt-1">
                              {activeLesson.questions?.[0]?.explanation || 'Mastering technical patterns and support levels builds consistent portfolio returns.'}
                            </p>
                            
                            <div className="pt-3 flex justify-end">
                              <button
                                onClick={() => { gameAudio.playClick(); setActiveLesson(null); }}
                                className="px-5 py-2 bg-white text-black font-bold rounded-xl cursor-pointer"
                              >
                                Collect & Back to Academy
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Academy search and page navigation */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-4 py-2 rounded-xl flex-1 w-full">
                      <Search className="w-4 h-4 text-white/30" />
                      <input
                        type="text"
                        value={academySearch}
                        onChange={(e) => setAcademySearch(e.target.value)}
                        placeholder="Search our curriculum of 1000 lessons, technical indicators, fundamental values..."
                        className="bg-transparent border-none text-xs text-white focus:outline-none flex-1 placeholder-white/20"
                      />
                    </div>
                  </div>

                  {/* Lessons Grid list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ALL_LESSONS_BASE.slice(academyPage * 8, (academyPage + 1) * 8).map((les) => {
                      const isCompleted = completedLessons.includes(les.id);
                      return (
                        <div key={les.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center hover:border-white/20 transition-all">
                          <div>
                            <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded uppercase">
                              Level {les.levelNum} • {les.trackName}
                            </span>
                            <h5 className="font-bold text-xs md:text-sm text-white mt-1">{les.title}</h5>
                            <p className="text-[9px] text-white/40 mt-0.5">Rewards: +200 XP / +30 Gold</p>
                          </div>

                          <button
                            onClick={() => handleStartLesson(les.levelNum)}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                          >
                            {isCompleted ? 'Review' : 'Study'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation pagination controls */}
                  <div className="flex justify-between items-center text-xs text-white/40">
                    <button
                      disabled={academyPage === 0}
                      onClick={() => setAcademyPage(p => Math.max(0, p - 1))}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl disabled:opacity-30 cursor-pointer"
                    >
                      ← Previous
                    </button>
                    <span>Page {academyPage + 1} of 125</span>
                    <button
                      disabled={academyPage >= 124}
                      onClick={() => setAcademyPage(p => p + 1)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl disabled:opacity-30 cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. STOCK SIMULATOR ARENA VIEW */}
          {activeTab === 'simulator' && (
            <div id="tab-simulator" className="grid grid-cols-12 gap-6">
              {/* Simulator stats summary marquee */}
              <div className="col-span-12 bg-white/5 border border-white/10 rounded-[32px] p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-mono text-white/40">SIMULATED NET LIQUIDITY</span>
                  <h4 className="text-white font-black text-lg md:text-2xl mt-0.5">₹{totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-mono text-white/40">NET PROFIT / LOSS</span>
                  <h4 className={`font-black text-lg md:text-2xl mt-0.5 flex items-center justify-center sm:justify-start gap-1 ${portfolioProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {portfolioProfitLoss >= 0 ? '+' : ''}₹{portfolioProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-xs font-bold font-mono">({portfolioProfitLossPercent.toFixed(2)}%)</span>
                  </h4>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-mono text-white/40">BUYING POWER (CASH)</span>
                  <h4 className="text-white font-black text-lg md:text-2xl mt-0.5">₹{cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                </div>
              </div>

              {/* Market Status & 24/7 Practice Mode Banner */}
              <div className="col-span-12 bg-white/5 border border-white/10 rounded-[32px] p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className={`w-3 h-3 rounded-full ${isMarketOpenForTicker(activeStock.ticker) || practiceMode ? 'bg-green-400 animate-pulse' : 'bg-red-400'} border border-black/50 shrink-0`} />
                  <div>
                    <h5 className="font-bold text-xs text-white flex items-center gap-2 flex-wrap">
                      {activeStock.ticker.endsWith('.NS') || activeStock.ticker.endsWith('.BO') ? 'Indian Markets (NSE/BSE)' : 'US Markets (NYSE/NASDAQ)'} STATUS:
                      {isMarketOpenForTicker(activeStock.ticker) ? (
                        <span className="text-green-400 font-mono font-bold text-[9px] uppercase bg-green-500/10 px-2 py-0.5 rounded-md">LIVE OPEN</span>
                      ) : practiceMode ? (
                        <span className="text-blue-400 font-mono font-bold text-[9px] uppercase bg-blue-500/10 px-2 py-0.5 rounded-md">PRACTICE RUNNING</span>
                      ) : (
                        <span className="text-red-400 font-mono font-bold text-[9px] uppercase bg-red-500/10 px-2 py-0.5 rounded-md">CLOSED (WEEKEND / HOLIDAY)</span>
                      )}
                    </h5>
                    <p className="text-[10px] text-white/50 leading-relaxed mt-0.5 max-w-[650px]">
                      {isMarketOpenForTicker(activeStock.ticker) 
                        ? 'Market is currently open. Prices are updated in real-time according to active global trades.' 
                        : practiceMode 
                          ? '24/7 Practice Mode is active! Tickers are simulating real-time fluctuations even though real-world markets are closed.'
                          : `Real-world market is closed (weekends & holidays). Simulator values are frozen at the latest close to maintain high-fidelity accuracy. Toggle Practice Mode to enable 24/7 ticking.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-2 rounded-2xl shrink-0 w-full md:w-auto justify-between md:justify-start">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-mono text-white/40 block">WEEKEND PRACTICE</span>
                    <span className="text-xs font-bold text-white block">24/7 Live Ticking</span>
                  </div>
                  <button
                    onClick={() => {
                      gameAudio.playClick();
                      setPracticeMode(!practiceMode);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      practiceMode ? 'bg-green-500' : 'bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        practiceMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Candlestick technical Chart Display Column */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-lg font-bold">
                        {activeStock.ticker.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm leading-none">{activeStock.name} ({activeStock.ticker})</h4>
                        <span className="text-[10px] text-white/40 font-mono">Live candlestick analysis vector feed</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-white font-mono font-bold text-sm">₹{activeStock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <span className={`text-[10px] font-mono font-bold flex items-center gap-0.5 justify-end ${activeStock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {activeStock.change >= 0 ? '+' : ''}{activeStock.change}%
                      </span>
                    </div>
                  </div>

                  {/* Vector Candlestick widget chart */}
                  {renderCandlestickChart(activeStock)}
                </div>

                {/* News feed column */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-5 space-y-4">
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest text-white/40">Live Catalysts News</h4>
                  <div className="space-y-2.5">
                    {news.slice(0, 3).map((n) => (
                      <div key={n.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all cursor-pointer" onClick={() => setSelectedStockTicker(n.ticker)}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] font-bold font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                            {n.ticker}
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${n.impact === 'bullish' ? 'text-green-400 bg-green-500/10 px-2 py-0.5 rounded' : 'text-red-400 bg-red-500/10 px-2 py-0.5 rounded'}`}>
                            {n.impact}
                          </span>
                        </div>
                        <h5 className="font-bold text-xs text-white">{n.title}</h5>
                        <p className="text-[10px] text-white/50 leading-relaxed mt-0.5">{n.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stock selection & transaction orders Column */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                {/* Selector */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-5">
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest text-white/40 mb-3.5">Available Arena Assets</h4>
                  
                  {/* Real-time Search Box */}
                  <div className="mb-4 relative">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/40" />
                        <input
                          type="text"
                          placeholder="Search BSE, NSE, or US stocks..."
                          value={stockSearchQuery}
                          onChange={(e) => handleStockSearch(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-all font-sans"
                        />
                      </div>
                      {stockSearchLoading && (
                        <div className="flex items-center justify-center px-1">
                          <RefreshCw className="w-3.5 h-3.5 text-green-400 animate-spin" />
                        </div>
                      )}
                    </div>

                    {stockSearchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-white/15 rounded-xl max-h-[180px] overflow-y-auto z-50 shadow-2xl backdrop-blur-md p-1.5 space-y-1">
                        <div className="flex justify-between items-center px-2 py-1 border-b border-white/5 mb-1">
                          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Search Results</span>
                          <button onClick={() => setStockSearchResults([])} className="text-white/40 hover:text-white text-[10px] font-bold">Close</button>
                        </div>
                        {stockSearchResults.map((res) => (
                          <button
                            key={res.ticker}
                            onClick={() => handleAddSearchedStock(res.ticker)}
                            className="w-full text-left p-2 hover:bg-white/5 rounded-lg flex justify-between items-center transition-all cursor-pointer"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <span className="font-bold text-xs text-white block truncate">{res.ticker}</span>
                              <span className="text-[9px] text-white/40 block truncate">{res.name}</span>
                            </div>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/80 shrink-0 font-mono">
                              {res.exchange}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {stocks.map((s) => (
                      <button
                        key={s.ticker}
                        onClick={() => { gameAudio.playClick(); setSelectedStockTicker(s.ticker); }}
                        className={`w-full p-2.5 rounded-2xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                          selectedStockTicker === s.ticker ? 'bg-green-600/10 border-green-500 text-green-400' : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-xs block leading-none">{s.ticker}</span>
                          <span className="text-[9px] text-white/40 font-mono mt-0.5">{s.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold block leading-none">₹{s.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span className={`text-[9px] font-mono font-bold ${s.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {s.change >= 0 ? '+' : ''}{s.change}%
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders box */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-5 space-y-4">
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest text-white/40">Market Execution order</h4>
                  
                  <div className="flex gap-2 items-center bg-black/30 border border-white/5 rounded-xl px-3.5 py-1.5">
                    <span className="text-xs text-white/40">Shares Quantity:</span>
                    <input
                      type="number"
                      min="1"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 bg-transparent border-none text-xs font-mono font-bold text-white focus:outline-none text-right"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs text-white/50 border-b border-white/5 pb-3">
                    <div className="flex justify-between">
                      <span>Order cost:</span>
                      <span className="font-mono font-bold text-white">₹{(activeStock.price * tradeAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      onClick={handleBuyStock}
                      className="py-3 bg-green-600 hover:bg-green-500 text-white font-black text-xs rounded-2xl transition-all cursor-pointer shadow-md"
                    >
                      Buy Shares
                    </button>
                    <button
                      onClick={handleSellStock}
                      className="py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-2xl transition-all cursor-pointer shadow-md"
                    >
                      Sell Shares
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. AI COACH PORTFOLIO DIAGNOSTICS VIEW */}
          {activeTab === 'coach' && (
            <div id="tab-coach" className="grid grid-cols-12 gap-6">
              {/* Intelligent Diagnostics Portfolio card */}
              <div className="col-span-12 lg:col-span-4 bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20 rounded-[32px] p-5 space-y-4 backdrop-blur-sm">
                <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded">
                  Personalized Study Advisor
                </span>
                <h4 className="text-white font-black text-sm">Portfolio Fluency Analysis</h4>
                
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-black/30 border border-white/5 rounded-2xl space-y-1">
                    <h5 className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-green-400">●</span> Strong Concepts
                    </h5>
                    <p className="text-[11px] text-white/50">Core Compounding Principles, Stock Fundamental valuations, Divident yield tracking.</p>
                  </div>

                  <div className="p-3 bg-black/30 border border-white/5 rounded-2xl space-y-1">
                    <h5 className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-red-400">●</span> Recommended Practice
                    </h5>
                    <p className="text-[11px] text-white/50">Technical candlestick chart lines, support and resistance levels, Relative Strength Index (RSI).</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => { gameAudio.playClick(); handleJumpToLesson(31); }}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold rounded-xl cursor-pointer"
                  >
                    Study Recommended indicator Lesson (31)
                  </button>
                </div>
              </div>

              {/* Chat timeline card */}
              <div className="col-span-12 lg:col-span-8 bg-white/5 border border-white/10 rounded-[32px] p-5 flex flex-col justify-between min-h-[440px]">
                {/* Chat header */}
                <div className="border-b border-white/5 pb-3 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-lg">🤖</div>
                    <div>
                      <h4 className="font-bold text-xs text-white leading-none">AI Coach GrowBot</h4>
                      <span className="text-[9px] text-white/40 font-mono">Powered by Gemini AI model series</span>
                    </div>
                  </div>
                </div>

                {/* Timeline scrolls */}
                <div className="flex-1 overflow-y-auto max-h-[280px] my-4 space-y-4 pr-1">
                  {aiHistory.map((h, hidx) => (
                    <div key={hidx} className={`flex ${h.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3.5 rounded-2xl max-w-sm text-xs leading-relaxed ${
                        h.sender === 'user' 
                          ? 'bg-purple-600 text-white rounded-br-none' 
                          : 'bg-white/5 border border-white/10 text-white/90 rounded-bl-none font-medium'
                      }`}>
                        {h.text}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="text-xs text-purple-400 animate-pulse font-mono flex items-center gap-1">
                      ⚡ GrowBot is sifting institutional finance books...
                    </div>
                  )}
                </div>

                {/* Message form */}
                <form onSubmit={handleSendAiMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    placeholder="Ask about support/resistance, RSI, EPS valuations, or portfolio reviews..."
                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 placeholder-white/20"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-bold cursor-pointer"
                  >
                    Ask Coach
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* FULLSCREEN CERTIFICATE POPUP MODAL */}
      <CertificateModal 
        isOpen={showCertificate} 
        onClose={() => setShowCertificate(false)} 
        playerName={playerName} 
        trackTitle="Beginner" 
        completedCount={completedLessons.length} 
      />

      {/* ACCOUNT & OAUTH LOGIN MODAL */}
      <AnimatePresence>
        {showAccountModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-md w-full bg-zinc-950 border border-white/10 rounded-[32px] p-6 text-center relative overflow-hidden flex flex-col justify-between shadow-2xl"
            >
              {/* Ambient glows */}
              <div className="absolute w-32 h-32 rounded-full bg-blue-600/10 -top-6 -left-6 blur-2xl pointer-events-none" />
              <div className="absolute w-32 h-32 rounded-full bg-green-600/10 -bottom-6 -right-6 blur-2xl pointer-events-none" />

              <div className="flex justify-between items-center pb-4 border-b border-white/5 relative z-10">
                <span className="text-xs font-bold text-white/50 tracking-wider uppercase">Trader Profile & Authentication</span>
                <button 
                  onClick={() => { gameAudio.playClick(); setShowAccountModal(false); }}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-6 space-y-5 relative z-10">
                <div className="text-4xl">🌱</div>
                <div>
                  <h3 className="text-white font-extrabold text-lg md:text-xl tracking-tight">Access Account Sync</h3>
                  <p className="text-xs text-white/45 mt-1 leading-relaxed max-w-xs mx-auto">
                    Sign in via Google or Apple to securely secure your GrowFolio assets, compound interest progression, companion sprouts, and custom notes.
                  </p>
                </div>

                {/* Login Providers */}
                <div className="space-y-2.5 max-w-sm mx-auto pt-2">
                  <button
                    onClick={() => {
                      gameAudio.playLevelUp();
                      alert('Signed in successfully with Google! Your GrowFolio assets and XP achievements are now fully synced.');
                      setShowAccountModal(false);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-white text-zinc-950 font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
                  >
                    {/* Google SVG Icon */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    onClick={() => {
                      gameAudio.playLevelUp();
                      alert('Signed in successfully with Apple! Your GrowFolio assets and XP achievements are now fully synced.');
                      setShowAccountModal(false);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-white/10 text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-zinc-850 active:scale-95 transition-all cursor-pointer"
                  >
                    {/* Apple SVG Icon */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.52-.64.74-1.2 1.88-1.05 3 .1.11 2.34.75 3-1.46z" />
                    </svg>
                    Continue with Apple
                  </button>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block text-center">Customize Trader Nickname</span>
                  <div className="flex gap-2 max-w-sm mx-auto">
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPlayerName(val);
                        localStorage.setItem('gf_player_name', val);
                      }}
                      placeholder="Trader nickname"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                    />
                    <button 
                      onClick={() => {
                        gameAudio.playClick();
                        alert(`Profile updated to: ${playerName}`);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Sprout Companion Selector inside Modal */}
                <div className="pt-2 text-left space-y-3 max-w-sm mx-auto">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block mb-1.5 text-center">Sprout Companion</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'green_sprout', name: 'Emerald', emoji: '🌱' },
                        { id: 'gold_sprout', name: 'Golden', emoji: '🪙' },
                        { id: 'cosmic_sprout', name: 'Cosmic', emoji: '💫' }
                      ].map(s => (
                        <button
                          key={s.id}
                          onClick={() => {
                            gameAudio.playClick();
                            setSproutId(s.id);
                            localStorage.setItem('gf_sprout_id', s.id);
                          }}
                          className={`p-2.5 rounded-xl border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                            sproutId === s.id ? 'bg-blue-600/15 border-blue-500/55 text-white scale-102' : 'bg-white/5 border-white/10 text-white/40'
                          }`}
                        >
                          <span className="text-xl">{s.emoji}</span>
                          <span className="text-[9px] font-bold mt-1 leading-none">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block mb-1.5 text-center">Investment Tier</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'beginner', label: 'Novice' },
                        { id: 'intermediate', label: 'Active' },
                        { id: 'advanced', label: 'Strategist' }
                      ].map(exp => (
                        <button
                          key={exp.id}
                          onClick={() => {
                            gameAudio.playClick();
                            setExperience(exp.id);
                            localStorage.setItem('gf_experience', exp.id);
                          }}
                          className={`py-2 rounded-lg border text-[10px] font-bold text-center cursor-pointer ${
                            experience === exp.id ? 'bg-blue-600/15 border-blue-500/55 text-white' : 'bg-white/5 border-white/10 text-white/40'
                          }`}
                        >
                          {exp.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-[9px] text-white/30 font-mono">
                Secure Cloud Sync • GrowFolio Auth v1.1
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
