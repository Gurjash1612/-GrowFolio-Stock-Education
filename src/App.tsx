import React, { useState, useEffect, useRef } from 'react';
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
  DollarSign
} from 'lucide-react';

// Types
interface Lesson {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  slides: string[];
  quizQuestion: string;
  quizOptions: string[];
  correctAnswerIndex: number;
  xpReward: number;
  goldReward: number;
}

interface Stock {
  ticker: string;
  name: string;
  price: number;
  prevPrice: number;
  change: number;
  history: { open: number; high: number; low: number; close: number }[];
}

interface Transaction {
  ticker: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  timestamp: string;
}

interface NewsItem {
  id: string;
  title: string;
  impact: 'bullish' | 'bearish' | 'neutral';
  ticker: string;
  description: string;
}

// Initial Lessons Data
const LESSONS_DATA: Lesson[] = [
  {
    id: 'b1',
    level: 'beginner',
    title: 'Saving vs. Investing',
    description: 'Understand the power of compound interest and why cash loses value over time.',
    slides: [
      'Welcome to Investing! Money left in a standard bank savings account actually loses value over time due to inflation (rising cost of goods).',
      'Investing is the act of buying assets (like stocks, ETFs, or mutual funds) that can grow in value and outperform inflation.',
      'The secret weapon of investing is Compound Interest—earning returns on your previous returns. Over 20+ years, even small amounts multiply exponentially.',
      'Before investing, ensure you have an emergency savings fund of 3-6 months of expenses, so you never have to panic-sell your investments.'
    ],
    quizQuestion: 'Why does money left in a basic savings account typically lose purchasing power over time?',
    quizOptions: [
      'Because of stock market crashes',
      'Because inflation rates are usually higher than savings interest rates',
      'Because banks charge high maintenance fees',
      'Because of government tax penalties'
    ],
    correctAnswerIndex: 1,
    xpReward: 200,
    goldReward: 50
  },
  {
    id: 'b2',
    level: 'beginner',
    title: 'How Stock Markets Work',
    description: 'Learn what a share of a company actually is and how exchanges function.',
    slides: [
      'A stock represents partial ownership of a company. If a company has 1,000 shares and you own 10, you own 1% of that company!',
      'Companies list their shares on public Stock Exchanges (like the NYSE or NASDAQ) to raise capital to grow their business.',
      'Stock prices go up and down based on Supply and Demand. If more people want to buy (bullish) than sell (bearish), the price rises.',
      'As a shareholder, you can make money in two ways: Capital Gains (selling shares for more than you paid) and Dividends (cash payouts from profits).'
    ],
    quizQuestion: 'If a company has 10,000 shares and you own 100 shares, what percentage of the company do you own?',
    quizOptions: ['0.1%', '1.0%', '10.0%', '0.01%'],
    correctAnswerIndex: 1,
    xpReward: 200,
    goldReward: 50
  },
  {
    id: 'i1',
    level: 'intermediate',
    title: 'Anatomy of Candlesticks',
    description: 'Discover how to read the primary charts used by professional traders worldwide.',
    slides: [
      'A Candlestick chart shows 4 prices for a specific time period: Open, High, Low, and Close (OHLC).',
      'The "Body" (thick part) shows the difference between the Open and Close. A green body means close was higher than open. Red means lower.',
      'The "Wicks" or "Shadows" (thin lines at top and bottom) represent the absolute highest and lowest prices reached during that period.',
      'Multiple candlesticks form chart patterns, which traders analyze to predict future supply, demand, and momentum shifts.'
    ],
    quizQuestion: 'On a standard green candlestick, where is the "Open" price located?',
    quizOptions: [
      'At the very top of the upper wick',
      'At the top boundary of the solid body',
      'At the bottom boundary of the solid body',
      'At the very bottom of the lower wick'
    ],
    correctAnswerIndex: 2,
    xpReward: 250,
    goldReward: 75
  },
  {
    id: 'i2',
    level: 'intermediate',
    title: 'Support and Resistance',
    description: 'Identify critical floor and ceiling levels where stock prices pivot.',
    slides: [
      'Support is a price level where a falling stock tends to stop dropping and bounce back up, because buyers step in (demand exceeds supply).',
      'Resistance is a price level where a rising stock struggles to go higher, because sellers step in (supply exceeds demand).',
      'Once a price breaks through a Resistance level, that level often flips and becomes a new Support floor!',
      'Drawing Support and Resistance lines helps traders manage risk by pointing out safe entry and exit levels.'
    ],
    quizQuestion: 'What typically happens to a resistance level after the stock price successfully breaks out above it?',
    quizOptions: [
      'It disappears completely',
      'It tends to become a new support floor',
      'It causes the stock to instantly crash to zero',
      'It doubles in value'
    ],
    correctAnswerIndex: 1,
    xpReward: 250,
    goldReward: 75
  },
  {
    id: 'a1',
    level: 'advanced',
    title: 'Trading Psychology & Discipline',
    description: 'Master your emotions to avoid costly FOMO and panic-selling traps.',
    slides: [
      'The stock market is driven by two main emotions: Fear and Greed. Successful investing is about controlling both.',
      'FOMO (Fear Of Missing Out) leads investors to buy at the absolute top of a bubble because they see everyone else making money.',
      'Panic Selling leads investors to sell at the absolute bottom of a dip because they fear losing everything, locking in their losses.',
      'To build discipline, always create a Trade Plan before entering: decide your entry target, profit goal, and stop-loss level in advance.'
    ],
    quizQuestion: 'What is the main danger of FOMO (Fear Of Missing Out) in trading?',
    quizOptions: [
      'Buying shares at highly inflated prices near the top',
      'Selling profitable stocks too early',
      'Having your broker account locked',
      'Paying too little in investment taxes'
    ],
    correctAnswerIndex: 0,
    xpReward: 300,
    goldReward: 100
  }
];

const INITIAL_STOCKS: Stock[] = [
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 943.12,
    prevPrice: 932.00,
    change: 1.19,
    history: [
      { open: 920, high: 935, low: 915, close: 930 },
      { open: 930, high: 945, low: 925, close: 938 },
      { open: 938, high: 950, low: 930, close: 942 },
      { open: 942, high: 948, low: 935, close: 940 },
      { open: 940, high: 955, low: 938, close: 943.12 },
    ]
  },
  {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    price: 182.45,
    prevPrice: 185.20,
    change: -1.48,
    history: [
      { open: 192, high: 195, low: 188, close: 190 },
      { open: 190, high: 192, low: 184, close: 186 },
      { open: 186, high: 189, low: 182, close: 185.2 },
      { open: 185.2, high: 187, low: 180, close: 182.45 },
    ]
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: 178.90,
    prevPrice: 178.10,
    change: 0.45,
    history: [
      { open: 176, high: 178, low: 175, close: 177.2 },
      { open: 177.2, high: 179, low: 176.5, close: 178.1 },
      { open: 178.1, high: 180.2, low: 177.8, close: 178.9 },
    ]
  },
  {
    ticker: 'BTC',
    name: 'Bitcoin',
    price: 68420.00,
    prevPrice: 66800.00,
    change: 2.42,
    history: [
      { open: 65200, high: 66400, low: 64800, close: 66100 },
      { open: 66100, high: 67200, low: 65800, close: 66800 },
      { open: 66800, high: 69100, low: 66500, close: 68420 },
    ]
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 185.50,
    prevPrice: 184.10,
    change: 0.76,
    history: [
      { open: 181, high: 183.5, low: 180.2, close: 182.8 },
      { open: 182.8, high: 185, low: 182, close: 184.1 },
      { open: 184.1, high: 186.2, low: 183.5, close: 185.5 },
    ]
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    price: 421.15,
    prevPrice: 423.80,
    change: -0.62,
    history: [
      { open: 425, high: 429, low: 423, close: 426.2 },
      { open: 426.2, high: 428, low: 422, close: 423.8 },
      { open: 423.8, high: 425.5, low: 419.5, close: 421.15 },
    ]
  }
];

const MARKET_NEWS: NewsItem[] = [
  { id: 'n1', ticker: 'NVDA', title: 'NVIDIA releases custom AI chip architecture', impact: 'bullish', description: 'NVIDIA launched its next-generation ultra-efficient silicon, driving server farm demand.' },
  { id: 'n2', ticker: 'TSLA', title: 'Tesla Full Self-Driving receives approval in major markets', impact: 'bullish', description: 'Regulators fast-tracked driverless software rollouts, projecting a spike in subscription revenues.' },
  { id: 'n3', ticker: 'BTC', title: 'Institutional crypto ETF inflows hit record weekly highs', impact: 'bullish', description: 'Wall Street capital continues pouring into digital asset trusts, straining circulating supply.' },
  { id: 'n4', ticker: 'MSFT', title: 'Global cloud infrastructure outage limits business services', impact: 'bearish', description: 'Enterprise users experienced localized downtime, raising questions around operational resilience.' },
  { id: 'n5', ticker: 'AAPL', title: 'Supply chain friction delays next-gen hardware delivery', impact: 'bearish', description: 'Chipset shortages are expected to defer launch window sales targets into next fiscal quarter.' }
];

export default function App() {
  // Local Storage / State Init
  const [activeTab, setActiveTab] = useState<'dashboard' | 'academy' | 'simulator' | 'coach'>('dashboard');
  
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
    return saved ? parseFloat(saved) : 10000;
  });
  const [portfolio, setPortfolio] = useState<{ [ticker: string]: number }>(() => {
    const saved = localStorage.getItem('gf_portfolio');
    return saved ? JSON.parse(saved) : { NVDA: 5, AAPL: 10 };
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('gf_transactions');
    return saved ? JSON.parse(saved) : [
      { ticker: 'NVDA', type: 'BUY', shares: 5, price: 920, timestamp: '2026-06-25 10:30' },
      { ticker: 'AAPL', type: 'BUY', shares: 10, price: 176, timestamp: '2026-06-25 14:15' }
    ];
  });

  // Level Progression & Academy
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('gf_completed_lessons');
    return saved ? JSON.parse(saved) : ['b1'];
  });
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>(() => {
    const saved = localStorage.getItem('gf_unlocked_levels');
    return saved ? JSON.parse(saved) : ['beginner'];
  });

  // Active Lesson Session
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizIsCorrect, setQuizIsCorrect] = useState<boolean | null>(null);

  // Stock Market Simulator Data
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [selectedStockTicker, setSelectedStockTicker] = useState<string>('NVDA');
  const [tradeAmount, setTradeAmount] = useState<number>(1);
  const [news, setNews] = useState<NewsItem[]>(MARKET_NEWS);
  const [activeNews, setActiveNews] = useState<NewsItem | null>(MARKET_NEWS[0]);

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

  // Persistence Auto-save
  useEffect(() => {
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
  }, [xp, gold, streak, waterReady, cash, portfolio, transactions, completedLessons, unlockedLevels, unlockedDecorations, activeDecorations]);

  // Live Market Updates interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Small simulated tick changes for all stocks
      setStocks(prevStocks => 
        prevStocks.map(stock => {
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
  }, []);

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
    setShowWateringAnimation(true);
    setFloatingXp('+150 XP');
    
    setTimeout(() => {
      setXp(prev => prev + 150);
      setGold(prev => prev + 10);
      setWaterReady(false);
      setShowWateringAnimation(false);
      setTimeout(() => setFloatingXp(null), 1500);
    }, 1200);
  };

  // Trigger Lesson click
  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentSlideIndex(0);
    setQuizSubmitted(false);
    setSelectedQuizOption(null);
    setQuizIsCorrect(null);
  };

  // Submit slide quiz answer
  const handleQuizSubmit = () => {
    if (!activeLesson || selectedQuizOption === null) return;
    setQuizSubmitted(true);
    const isCorrect = selectedQuizOption === activeLesson.correctAnswerIndex;
    setQuizIsCorrect(isCorrect);
    
    if (isCorrect) {
      setXp(prev => prev + activeLesson.xpReward);
      setGold(prev => prev + activeLesson.goldReward);
      if (!completedLessons.includes(activeLesson.id)) {
        const updatedCompleted = [...completedLessons, activeLesson.id];
        setCompletedLessons(updatedCompleted);

        // Check level unlocking
        if (activeLesson.level === 'beginner' && updatedCompleted.includes('b1') && updatedCompleted.includes('b2')) {
          setUnlockedLevels(prev => [...prev, 'intermediate']);
        } else if (activeLesson.level === 'intermediate' && updatedCompleted.includes('i1') && updatedCompleted.includes('i2')) {
          setUnlockedLevels(prev => [...prev, 'advanced']);
        }
      }
    }
  };

  // Virtual simulator trading
  const handleSimTrade = (type: 'BUY' | 'SELL') => {
    if (tradeAmount <= 0) return;
    const totalCost = activeStock.price * tradeAmount;

    if (type === 'BUY') {
      if (cash < totalCost) {
        alert('Insufficient virtual cash to complete this transaction!');
        return;
      }
      setCash(prev => Math.round((prev - totalCost) * 100) / 100);
      setPortfolio(prev => ({
        ...prev,
        [selectedStockTicker]: (prev[selectedStockTicker] || 0) + tradeAmount
      }));
    } else {
      const owned = portfolio[selectedStockTicker] || 0;
      if (owned < tradeAmount) {
        alert('You do not own enough shares of this asset to sell!');
        return;
      }
      setCash(prev => Math.round((prev + totalCost) * 100) / 100);
      setPortfolio(prev => {
        const copy = { ...prev };
        copy[selectedStockTicker] -= tradeAmount;
        if (copy[selectedStockTicker] <= 0) delete copy[selectedStockTicker];
        return copy;
      });
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setTransactions(prev => [
      { ticker: selectedStockTicker, type, shares: tradeAmount, price: activeStock.price, timestamp },
      ...prev
    ]);
    setXp(prev => prev + 30); // Trading experience
  };

  // Purchase Decoration
  const handleBuyDecoration = (id: string, cost: number) => {
    if (gold < cost) {
      alert('Not enough gold! Pass more quizzes and lesson challenges.');
      return;
    }
    setGold(prev => prev - cost);
    setUnlockedDecorations(prev => [...prev, id]);
    setActiveDecorations(prev => [...prev, id]);
  };

  // Toggle decoration active state
  const handleToggleDecoration = (id: string) => {
    if (activeDecorations.includes(id)) {
      setActiveDecorations(prev => prev.filter(d => d !== id));
    } else {
      setActiveDecorations(prev => [...prev, id]);
    }
  };

  // Send message to Gemini AI Coach
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

  // SVG Drawing Helpers for GrowTree
  const renderTreeSVG = () => {
    return (
      <svg viewBox="0 0 200 220" className="w-56 h-56 drop-shadow-[0_0_30px_rgba(34,197,94,0.35)] transition-all duration-700">
        {/* Pot / Soil */}
        <path d="M70 180 L130 180 L120 205 L80 205 Z" fill="#322214" />
        <ellipse cx="100" cy="180" rx="30" ry="6" fill="#1f140a" />

        {/* Tree growth based on XP levels */}
        {xp < 1000 && (
          // SEED
          <g>
            <circle cx="100" cy="176" r="4" fill="#fbbf24" className="animate-pulse" />
            <path d="M100 176 Q97 165 103 158" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M103 158 C105 158 108 160 106 163 Z" fill="#10b981" />
          </g>
        )}

        {xp >= 1000 && xp < 2500 && (
          // SPROUT
          <g>
            <path d="M100 180 Q102 155 98 135" stroke="#78350f" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            {/* Left Leaf */}
            <path d="M99 155 Q85 145 88 136 Q98 142 99 155" fill="#10b981" stroke="#047857" strokeWidth="0.5" />
            {/* Right Leaf */}
            <path d="M99 145 Q115 135 110 126 Q102 135 99 145" fill="#34d399" stroke="#047857" strokeWidth="0.5" />
          </g>
        )}

        {xp >= 2500 && xp < 4500 && (
          // SAPLING
          <g>
            <path d="M100 180 Q101 140 100 110" stroke="#78350f" strokeWidth="6" fill="none" />
            <path d="M100 145 Q80 130 84 120" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M100 130 Q120 115 116 105" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            {/* Foliage Circles */}
            <circle cx="100" cy="100" r="18" fill="#10b981" opacity="0.9" />
            <circle cx="84" cy="118" r="12" fill="#059669" opacity="0.85" />
            <circle cx="116" cy="104" r="14" fill="#34d399" opacity="0.9" />
          </g>
        )}

        {xp >= 4500 && xp < 7000 && (
          // YOUNG TREE
          <g>
            <path d="M100 180 Q100 135 100 95" stroke="#5c2e0b" strokeWidth="8.5" fill="none" />
            <path d="M100 145 Q75 125 70 115" stroke="#5c2e0b" strokeWidth="4" fill="none" />
            <path d="M100 130 Q125 115 125 102" stroke="#5c2e0b" strokeWidth="4" fill="none" />
            
            {/* Crown Foliage */}
            <circle cx="100" cy="85" r="24" fill="#10b981" />
            <circle cx="75" cy="105" r="16" fill="#047857" />
            <circle cx="123" cy="95" r="18" fill="#34d399" />
            <circle cx="95" cy="105" r="14" fill="#059669" />
          </g>
        )}

        {xp >= 7000 && xp < 10500 && (
          // STRONG TREE
          <g>
            {/* Strong Trunk */}
            <path d="M94 180 L97 85 L103 85 L106 180 Z" fill="#5c2e0b" />
            <path d="M97 130 C70 115 65 100 60 95" stroke="#5c2e0b" strokeWidth="4.5" fill="none" />
            <path d="M103 120 C130 105 135 90 140 85" stroke="#5c2e0b" strokeWidth="4.5" fill="none" />
            
            {/* Large dense foliage cloud */}
            <circle cx="100" cy="70" r="28" fill="#047857" />
            <circle cx="72" cy="85" r="20" fill="#065f46" />
            <circle cx="128" cy="78" r="22" fill="#10b981" />
            <circle cx="90" cy="90" r="18" fill="#059669" />
            <circle cx="110" cy="90" r="18" fill="#34d399" />
          </g>
        )}

        {xp >= 10500 && xp < 15000 && (
          // BLOOMING TREE (Flowers)
          <g>
            <path d="M93 180 L97 80 L103 80 L107 180 Z" fill="#5c2e0b" />
            <path d="M97 125 Q65 110 60 90" stroke="#5c2e0b" strokeWidth="5" fill="none" />
            <path d="M103 115 Q135 100 138 80" stroke="#5c2e0b" strokeWidth="5" fill="none" />
            
            <circle cx="100" cy="65" r="30" fill="#047857" />
            <circle cx="68" cy="82" r="22" fill="#065f46" />
            <circle cx="132" cy="75" r="24" fill="#10b981" />
            <circle cx="100" cy="85" r="20" fill="#059669" />
            
            {/* Pink Blossoms */}
            <circle cx="95" cy="55" r="3.5" fill="#f43f5e" />
            <circle cx="105" cy="56" r="3.5" fill="#f43f5e" />
            <circle cx="135" cy="70" r="4" fill="#f43f5e" />
            <circle cx="68" cy="78" r="4.5" fill="#fda4af" />
            <circle cx="105" cy="85" r="3" fill="#fda4af" />
          </g>
        )}

        {xp >= 15000 && xp < 20000 && (
          // FRUIT TREE (Apples)
          <g>
            <path d="M92 180 L97 75 L103 75 L108 180 Z" fill="#451a03" />
            <path d="M97 120 Q60 105 55 85" stroke="#451a03" strokeWidth="5.5" fill="none" />
            <path d="M103 110 Q140 95 142 75" stroke="#451a03" strokeWidth="5.5" fill="none" />
            
            <circle cx="100" cy="60" r="32" fill="#15803d" />
            <circle cx="65" cy="80" r="24" fill="#166534" />
            <circle cx="135" cy="70" r="26" fill="#22c55e" />
            <circle cx="100" cy="85" r="22" fill="#16a34a" />
            
            {/* Red Apples */}
            <circle cx="95" cy="50" r="4.5" fill="#ef4444" />
            <circle cx="112" cy="55" r="4.5" fill="#ef4444" />
            <circle cx="130" cy="65" r="4.5" fill="#ef4444" />
            <circle cx="65" cy="74" r="5" fill="#ef4444" />
            <circle cx="98" cy="80" r="4" fill="#ef4444" />
          </g>
        )}

        {xp >= 20000 && (
          // GOLDEN TREE (Ultimate glowing tree)
          <g>
            <path d="M90 180 L97 70 L103 70 L110 180 Z" fill="#78350f" />
            <path d="M97 115 Q55 95 50 75" stroke="#78350f" strokeWidth="6" fill="none" />
            <path d="M103 105 Q145 85 145 65" stroke="#78350f" strokeWidth="6" fill="none" />
            
            {/* Glowing yellow golden leaf clusters */}
            <circle cx="100" cy="55" r="34" fill="#eab308" opacity="0.9" />
            <circle cx="60" cy="72" r="26" fill="#ca8a04" opacity="0.85" />
            <circle cx="140" cy="60" r="28" fill="#facc15" opacity="0.9" />
            <circle cx="100" cy="80" r="24" fill="#fef08a" opacity="0.8" />
            
            {/* Sparkle particles */}
            <polygon points="100,20 102,28 110,30 102,32 100,40 98,32 90,30 98,28" fill="#ffffff" className="animate-pulse" />
            <polygon points="50,45 51,50 56,51 51,52 50,57 49,52 44,51 49,50" fill="#facc15" className="animate-ping" />
            <polygon points="150,35 151,40 156,41 151,42 150,47 149,42 144,41 149,40" fill="#ffffff" />
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
            <circle cx="108" cy="68" r="6" fill="#fbbf24" className="shadow-lg" />
            <circle cx="78" cy="98" r="6" fill="#fbbf24" />
            <circle cx="118" cy="108" r="5" fill="#fbbf24" />
          </g>
        )}

        {activeDecorations.includes('crown') && (
          <g>
            {/* Golden crown sitting on top of the foliage crown */}
            <polygon points="85,25 90,38 100,28 110,38 115,25 110,48 90,48" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            <circle cx="85" cy="23" r="1.5" fill="#ef4444" />
            <circle cx="100" cy="26" r="1.5" fill="#ef4444" />
            <circle cx="115" cy="23" r="1.5" fill="#ef4444" />
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

  // Custom Candlestick Drawing
  const renderCandlestickChart = (stock: Stock) => {
    const width = 360;
    const height = 180;
    const padding = 20;

    const prices = stock.history.flatMap(h => [h.high, h.low, h.open, h.close]);
    const minPrice = Math.min(...prices) * 0.99;
    const maxPrice = Math.max(...prices) * 1.01;
    const priceRange = maxPrice - minPrice;

    const scaleY = (p: number) => height - padding - ((p - minPrice) / priceRange) * (height - 2 * padding);
    const candleWidth = Math.max(12, (width - 2 * padding) / stock.history.length - 8);

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 bg-black/30 border border-white/5 rounded-2xl p-2">
        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((ratio, i) => {
          const gridVal = minPrice + priceRange * ratio;
          const y = scaleY(gridVal);
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <text x={width - padding + 2} y={y + 3} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="start">
                ${Math.round(gridVal)}
              </text>
            </g>
          );
        })}

        {/* Draw each candlestick */}
        {stock.history.map((h, index) => {
          const x = padding + index * ((width - 2 * padding) / stock.history.length) + 10;
          const isGreen = h.close >= h.open;
          const strokeColor = isGreen ? '#22c55e' : '#ef4444';
          const bodyY = scaleY(Math.max(h.open, h.close));
          const bodyHeight = Math.max(2, Math.abs(scaleY(h.open) - scaleY(h.close)));
          
          return (
            <g key={index} className="group cursor-pointer">
              {/* Tooltip on hover */}
              <title>{`Candle ${index + 1}: Open: $${h.open.toFixed(2)}, Close: $${h.close.toFixed(2)}, High: $${h.high.toFixed(2)}, Low: $${h.low.toFixed(2)}`}</title>
              
              {/* Wick shadow line */}
              <line x1={x + candleWidth/2} y1={scaleY(h.high)} x2={x + candleWidth/2} y2={scaleY(h.low)} stroke={strokeColor} strokeWidth="1.5" />
              
              {/* Solid candle body */}
              <rect 
                x={x} 
                y={bodyY} 
                width={candleWidth} 
                height={bodyHeight} 
                fill={isGreen ? 'rgba(34,197,94,0.85)' : 'rgba(239,68,68,0.85)'} 
                stroke={strokeColor} 
                strokeWidth="1"
                className="transition-all duration-300 group-hover:brightness-125"
                rx="1"
              />
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div id="growfolio-root" className="min-h-screen bg-[#050505] text-white flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* Upper subtle glass background overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-green-950/20 via-transparent to-transparent pointer-events-none z-0"></div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex max-w-[1280px] w-full mx-auto relative z-10 p-4 md:p-6 gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <aside id="sidebar" className="hidden md:flex w-24 bg-white/[0.02] border border-white/10 rounded-[32px] flex-col items-center py-8 gap-10 backdrop-blur-md">
          {/* Brand Icon */}
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>

          <nav className="flex flex-col gap-6">
            <button 
              id="nav-dash"
              onClick={() => setActiveTab('dashboard')}
              className={`p-3.5 rounded-2xl transition-all duration-300 relative group ${
                activeTab === 'dashboard' ? 'bg-white/10 text-green-400 border border-white/10' : 'text-white/40 hover:text-white/80'
              }`}
              title="Dashboard"
            >
              <Home className="w-5 h-5" />
              <span className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Dashboard</span>
            </button>

            <button 
              id="nav-academy"
              onClick={() => setActiveTab('academy')}
              className={`p-3.5 rounded-2xl transition-all duration-300 relative group ${
                activeTab === 'academy' ? 'bg-white/10 text-blue-400 border border-white/10' : 'text-white/40 hover:text-white/80'
              }`}
              title="Academy Lessons"
            >
              <GraduationCap className="w-5 h-5" />
              <span className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Academy</span>
            </button>

            <button 
              id="nav-sim"
              onClick={() => setActiveTab('simulator')}
              className={`p-3.5 rounded-2xl transition-all duration-300 relative group ${
                activeTab === 'simulator' ? 'bg-white/10 text-green-400 border border-white/10' : 'text-white/40 hover:text-white/80'
              }`}
              title="Stock Simulator"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Simulator</span>
            </button>

            <button 
              id="nav-coach"
              onClick={() => setActiveTab('coach')}
              className={`p-3.5 rounded-2xl transition-all duration-300 relative group ${
                activeTab === 'coach' ? 'bg-white/10 text-purple-400 border border-white/10' : 'text-white/40 hover:text-white/80'
              }`}
              title="AI Advisor"
            >
              <Bot className="w-5 h-5" />
              <span className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">AI Coach</span>
            </button>
          </nav>

          <div className="mt-auto flex flex-col gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center" title="Ready to Grow!">
              <Droplet className="w-5 h-5 text-green-400 animate-bounce" />
            </div>
          </div>
        </aside>

        {/* MAIN DISPLAY REGION */}
        <main className="flex-1 flex flex-col gap-6">
          
          {/* HEADER BAR */}
          <header className="bg-white/[0.02] border border-white/10 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="md:hidden p-2.5 bg-green-500/10 border border-green-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  GrowFolio <span className="text-green-500 text-xs px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 font-normal">PRO</span>
                </h1>
                <p className="text-xs text-white/50">Grow Your Assets Alongside Your Knowledge</p>
              </div>
            </div>

            {/* Profile Level Indicators */}
            <div className="flex items-center gap-5 w-full md:w-auto">
              {/* XP Progression */}
              <div className="flex-1 md:flex-initial flex flex-col md:items-end min-w-[160px]">
                <div className="flex justify-between md:justify-end items-center gap-2 mb-1.5">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Investor Rank</span>
                  <span className="text-xs font-extrabold text-yellow-500 uppercase tracking-tight">{currentRank.title}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full border border-white/10 overflow-hidden relative" title={`XP: ${xp} / ${currentRank.nextAt}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                    style={{ width: `${xpProgressPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between w-full text-[9px] text-white/40 mt-1">
                  <span>{xp} XP</span>
                  <span>{currentRank.nextAt} XP for next rank</span>
                </div>
              </div>

              {/* Gold Counter */}
              <div className="bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2 flex items-center gap-2" title="Gold earned to unlock decorations">
                <Coins className="w-4 h-4 text-yellow-500 animate-spin" />
                <span className="font-mono text-sm font-bold text-yellow-400">{gold} <span className="text-[10px] text-white/40 font-sans">GOLD</span></span>
              </div>
            </div>
          </header>

          {/* TAB BAR FOR RESPONSIVE MOBILE */}
          <div className="flex md:hidden bg-white/5 border border-white/10 rounded-2xl p-1.5 justify-around backdrop-blur-md">
            <button onClick={() => setActiveTab('dashboard')} className={`flex-1 py-2.5 flex flex-col items-center rounded-xl text-[10px] ${activeTab === 'dashboard' ? 'bg-white/10 text-green-400' : 'text-white/50'}`}>
              <Home className="w-4 h-4 mb-0.5" /> Dashboard
            </button>
            <button onClick={() => setActiveTab('academy')} className={`flex-1 py-2.5 flex flex-col items-center rounded-xl text-[10px] ${activeTab === 'academy' ? 'bg-white/10 text-blue-400' : 'text-white/50'}`}>
              <GraduationCap className="w-4 h-4 mb-0.5" /> Academy
            </button>
            <button onClick={() => setActiveTab('simulator')} className={`flex-1 py-2.5 flex flex-col items-center rounded-xl text-[10px] ${activeTab === 'simulator' ? 'bg-white/10 text-green-400' : 'text-white/50'}`}>
              <TrendingUp className="w-4 h-4 mb-0.5" /> Simulator
            </button>
            <button onClick={() => setActiveTab('coach')} className={`flex-1 py-2.5 flex flex-col items-center rounded-xl text-[10px] ${activeTab === 'coach' ? 'bg-white/10 text-purple-400' : 'text-white/50'}`}>
              <Bot className="w-4 h-4 mb-0.5" /> AI Coach
            </button>
          </div>

          {/* VIEW ROUTER */}
          
          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div id="tab-dashboard" className="grid grid-cols-12 gap-6">
              
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
                    <Zap className="w-4 h-4 text-orange-500 animate-pulse" />
                    <span>{streak} Days</span>
                  </div>
                </div>

                {/* Floating XP pop indicator */}
                {floatingXp && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 bg-green-500 text-white font-bold px-4 py-1.5 rounded-full shadow-lg text-sm z-30 animate-bounce">
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
                      onClick={() => setActiveTab('academy')}
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

              {/* Learning Journey Roadmap Column */}
              <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                
                {/* Level Map */}
                <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 backdrop-blur-sm flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-md font-bold mb-5 flex items-center justify-between">
                      Learning Journey Roadmap
                      <span className="text-xs text-blue-400 font-normal hover:underline cursor-pointer flex items-center gap-1" onClick={() => setActiveTab('academy')}>
                        Open Academy <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </h3>
                    
                    <div className="space-y-4">
                      {/* LEVEL 1: BEGINNER */}
                      <div className={`p-4 rounded-2xl border transition-all ${
                        unlockedLevels.includes('beginner') 
                          ? 'bg-green-500/10 border-green-500/20 text-white' 
                          : 'bg-white/5 border-white/10 opacity-50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                            completedLessons.includes('b1') && completedLessons.includes('b2')
                              ? 'bg-green-500 text-white'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {completedLessons.includes('b1') && completedLessons.includes('b2') ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm">Level 1: Beginner Investor</h4>
                            <p className="text-[11px] text-white/60">Money management, compounding, & stock market fundamentals.</p>
                          </div>
                          {completedLessons.includes('b1') && completedLessons.includes('b2') && (
                            <span className="ml-auto text-[9px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">PASSED</span>
                          )}
                        </div>
                      </div>

                      {/* LEVEL 2: INTERMEDIATE */}
                      <div className={`p-4 rounded-2xl border transition-all ${
                        unlockedLevels.includes('intermediate') 
                          ? 'bg-blue-500/10 border-blue-500/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                          : 'bg-white/5 border-dashed border-white/15 opacity-50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                            unlockedLevels.includes('intermediate') ? 'bg-blue-500 text-white animate-pulse' : 'bg-white/10 text-white/40'
                          }`}>
                            {completedLessons.includes('i1') && completedLessons.includes('i2') ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm flex items-center gap-2">
                              Level 2: Intermediate Analyst
                              {unlockedLevels.includes('intermediate') && !unlockedLevels.includes('advanced') && (
                                <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-normal">Active</span>
                              )}
                            </h4>
                            <p className="text-[11px] text-white/60">Candlestick anatomy, support/resistance, & financial statement valuations.</p>
                          </div>
                          {!unlockedLevels.includes('intermediate') && (
                            <Lock className="ml-auto w-4 h-4 text-white/30" />
                          )}
                        </div>
                      </div>

                      {/* LEVEL 3: ADVANCED */}
                      <div className={`p-4 rounded-2xl border transition-all ${
                        unlockedLevels.includes('advanced') 
                          ? 'bg-purple-500/10 border-purple-500/20 text-white' 
                          : 'bg-white/5 border-dashed border-white/15 opacity-50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                            unlockedLevels.includes('advanced') ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/40'
                          }`}>
                            '3'
                          </div>
                          <div>
                            <h4 className="font-bold text-sm">Level 3: Advanced Portfolio Strategist</h4>
                            <p className="text-[11px] text-white/60">Risk management structures, derivatives trading, & psychology indices.</p>
                          </div>
                          {!unlockedLevels.includes('advanced') && (
                            <Lock className="ml-auto w-4 h-4 text-white/30" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daily challenges & checklist */}
                  <div className="mt-6 pt-5 border-t border-white/5">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-white/40 mb-3.5">Daily Missions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${!waterReady ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30'}`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold">Hydrate GrowTree</p>
                          <p className="text-[9px] text-white/40">+150 XP / +10 Gold</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${completedLessons.length > 1 ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30'}`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold">Pass One Quiz</p>
                          <p className="text-[9px] text-white/40">+200 XP / +50 Gold</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tree Customization Shop Panel */}
                <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 backdrop-blur-sm">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-yellow-500" /> GrowTree Decorations Shop
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Item 1 */}
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center">
                      <span className="text-2xl mb-1.5">🐦</span>
                      <span className="text-[11px] font-bold">Forest Birds</span>
                      {unlockedDecorations.includes('birds') ? (
                        <button 
                          onClick={() => handleToggleDecoration('birds')}
                          className={`mt-2.5 w-full py-1 rounded-lg text-[9px] font-bold transition-colors ${
                            activeDecorations.includes('birds') ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          {activeDecorations.includes('birds') ? 'Equipped' : 'Equip'}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleBuyDecoration('birds', 150)}
                          className="mt-2.5 w-full py-1 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-[9px] font-extrabold flex items-center justify-center gap-1"
                        >
                          <Coins className="w-3 h-3" /> 150
                        </button>
                      )}
                    </div>

                    {/* Item 2 */}
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center">
                      <span className="text-2xl mb-1.5">🦋</span>
                      <span className="text-[11px] font-bold">Butterflies</span>
                      {unlockedDecorations.includes('butterflies') ? (
                        <button 
                          onClick={() => handleToggleDecoration('butterflies')}
                          className={`mt-2.5 w-full py-1 rounded-lg text-[9px] font-bold transition-colors ${
                            activeDecorations.includes('butterflies') ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          {activeDecorations.includes('butterflies') ? 'Equipped' : 'Equip'}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleBuyDecoration('butterflies', 250)}
                          className="mt-2.5 w-full py-1 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-[9px] font-extrabold flex items-center justify-center gap-1"
                        >
                          <Coins className="w-3 h-3" /> 250
                        </button>
                      )}
                    </div>

                    {/* Item 3 */}
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center">
                      <span className="text-2xl mb-1.5">🍊</span>
                      <span className="text-[11px] font-bold">Golden Fruit</span>
                      {unlockedDecorations.includes('gold_fruit') ? (
                        <button 
                          onClick={() => handleToggleDecoration('gold_fruit')}
                          className={`mt-2.5 w-full py-1 rounded-lg text-[9px] font-bold transition-colors ${
                            activeDecorations.includes('gold_fruit') ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          {activeDecorations.includes('gold_fruit') ? 'Equipped' : 'Equip'}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleBuyDecoration('gold_fruit', 400)}
                          className="mt-2.5 w-full py-1 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-[9px] font-extrabold flex items-center justify-center gap-1"
                        >
                          <Coins className="w-3 h-3" /> 400
                        </button>
                      )}
                    </div>

                    {/* Item 4 */}
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center">
                      <span className="text-2xl mb-1.5">👑</span>
                      <span className="text-[11px] font-bold">Crown</span>
                      {unlockedDecorations.includes('crown') ? (
                        <button 
                          onClick={() => handleToggleDecoration('crown')}
                          className={`mt-2.5 w-full py-1 rounded-lg text-[9px] font-bold transition-colors ${
                            activeDecorations.includes('crown') ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          {activeDecorations.includes('crown') ? 'Equipped' : 'Equip'}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleBuyDecoration('crown', 600)}
                          className="mt-2.5 w-full py-1 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-[9px] font-extrabold flex items-center justify-center gap-1"
                        >
                          <Coins className="w-3 h-3" /> 600
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 2. ACADEMY VIEW */}
          {activeTab === 'academy' && (
            <div id="tab-academy" className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 backdrop-blur-sm min-h-[500px] flex flex-col">
              
              {!activeLesson ? (
                // Academy home level choice
                <div>
                  <h2 className="text-lg font-bold mb-1">GrowFolio Academy</h2>
                  <p className="text-xs text-white/50 mb-6">Complete bite-sized lessons, gain rank, and level up your financial wisdom.</p>

                  <div className="space-y-6">
                    {/* BEGINNER CATEGORY */}
                    <div>
                      <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3.5">Level 1: Beginner Fundamentals</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {LESSONS_DATA.filter(l => l.level === 'beginner').map(lesson => {
                          const isDone = completedLessons.includes(lesson.id);
                          return (
                            <div key={lesson.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-green-500/40 transition-all flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-0.5 rounded-full font-bold">100% Free</span>
                                  {isDone && <span className="text-[9px] bg-green-500 text-white font-bold px-2 py-0.5 rounded">Passed</span>}
                                </div>
                                <h4 className="font-bold text-sm mb-1">{lesson.title}</h4>
                                <p className="text-xs text-white/60 mb-4">{lesson.description}</p>
                              </div>
                              <button 
                                onClick={() => handleStartLesson(lesson)}
                                className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" /> {isDone ? 'Review Lesson' : 'Start Lesson (+200 XP)'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* INTERMEDIATE CATEGORY */}
                    <div className="pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 mb-3.5">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Level 2: Intermediate Analysis</h3>
                        {!unlockedLevels.includes('intermediate') && (
                          <span className="text-[10px] bg-white/5 text-white/40 border border-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold"><Lock className="w-3 h-3" /> Locked</span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {LESSONS_DATA.filter(l => l.level === 'intermediate').map(lesson => {
                          const isLocked = !unlockedLevels.includes('intermediate');
                          const isDone = completedLessons.includes(lesson.id);
                          return (
                            <div key={lesson.id} className={`bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between relative ${isLocked ? 'opacity-40' : 'hover:border-blue-500/40'}`}>
                              {isLocked && <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-2xl z-10 flex items-center justify-center">
                                <span className="bg-black/80 border border-white/10 text-white/60 text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Complete Level 1 to Unlock</span>
                              </div>}
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-bold">Analytical</span>
                                  {isDone && <span className="text-[9px] bg-green-500 text-white font-bold px-2 py-0.5 rounded">Passed</span>}
                                </div>
                                <h4 className="font-bold text-sm mb-1">{lesson.title}</h4>
                                <p className="text-xs text-white/60 mb-4">{lesson.description}</p>
                              </div>
                              <button 
                                onClick={() => handleStartLesson(lesson)}
                                disabled={isLocked}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" /> {isDone ? 'Review Lesson' : 'Start Lesson (+250 XP)'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ADVANCED CATEGORY */}
                    <div className="pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 mb-3.5">
                        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Level 3: Advanced Portfolio</h3>
                        {!unlockedLevels.includes('advanced') && (
                          <span className="text-[10px] bg-white/5 text-white/40 border border-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold"><Lock className="w-3 h-3" /> Locked</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {LESSONS_DATA.filter(l => l.level === 'advanced').map(lesson => {
                          const isLocked = !unlockedLevels.includes('advanced');
                          const isDone = completedLessons.includes(lesson.id);
                          return (
                            <div key={lesson.id} className={`bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between relative ${isLocked ? 'opacity-40' : 'hover:border-purple-500/40'}`}>
                              {isLocked && <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-2xl z-10 flex items-center justify-center">
                                <span className="bg-black/80 border border-white/10 text-white/60 text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Complete Level 2 to Unlock</span>
                              </div>}
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-bold">Derivatives</span>
                                  {isDone && <span className="text-[9px] bg-green-500 text-white font-bold px-2 py-0.5 rounded">Passed</span>}
                                </div>
                                <h4 className="font-bold text-sm mb-1">{lesson.title}</h4>
                                <p className="text-xs text-white/60 mb-4">{lesson.description}</p>
                              </div>
                              <button 
                                onClick={() => handleStartLesson(lesson)}
                                disabled={isLocked}
                                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" /> {isDone ? 'Review Lesson' : 'Start Lesson (+300 XP)'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Active Interactive Slide View
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header bar of lesson */}
                    <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
                      <div>
                        <span className="text-[10px] text-green-400 uppercase tracking-widest font-bold">Lesson Portal</span>
                        <h3 className="text-md font-bold text-white">{activeLesson.title}</h3>
                      </div>
                      <button 
                        onClick={() => setActiveLesson(null)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-white/50" />
                      </button>
                    </div>

                    {/* Interactive Slider Segment */}
                    {currentSlideIndex < activeLesson.slides.length ? (
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[220px] flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl pointer-events-none"></div>
                        
                        <div>
                          <div className="flex items-center gap-1 text-[10px] text-white/40 mb-3 font-mono font-bold">
                            <span>SLIDE</span>
                            <span className="bg-white/10 px-1.5 py-0.5 rounded text-white">{currentSlideIndex + 1}</span>
                            <span>OF</span>
                            <span>{activeLesson.slides.length}</span>
                          </div>
                          <p className="text-white text-sm md:text-base leading-relaxed font-medium">
                            {activeLesson.slides[currentSlideIndex]}
                          </p>
                        </div>

                        {/* Pagination control */}
                        <div className="flex justify-between items-center mt-8">
                          <button 
                            disabled={currentSlideIndex === 0}
                            onClick={() => setCurrentSlideIndex(prev => prev - 1)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          >
                            Previous
                          </button>
                          
                          <div className="flex gap-1.5">
                            {activeLesson.slides.map((_, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full transition-all ${currentSlideIndex === i ? 'bg-green-400 w-4' : 'bg-white/20'}`}></div>
                            ))}
                          </div>

                          <button 
                            onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                            className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-xl border border-green-500 shadow-md cursor-pointer"
                          >
                            Next Slide
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Final Slide Quiz Evaluation
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-500 mb-4 uppercase tracking-widest">
                          <Award className="w-5 h-5 text-yellow-400 animate-bounce" /> Level Graduation Quiz Question
                        </div>
                        
                        <p className="text-white text-sm font-bold mb-5 leading-relaxed">
                          {activeLesson.quizQuestion}
                        </p>

                        <div className="space-y-3">
                          {activeLesson.quizOptions.map((option, idx) => {
                            let optionStyle = 'bg-white/5 border-white/10 hover:border-white/30';
                            if (quizSubmitted) {
                              if (idx === activeLesson.correctAnswerIndex) {
                                optionStyle = 'bg-green-500/20 border-green-500 text-green-400 font-bold';
                              } else if (idx === selectedQuizOption) {
                                optionStyle = 'bg-red-500/20 border-red-500 text-red-400';
                              } else {
                                optionStyle = 'bg-white/5 border-white/10 opacity-40';
                              }
                            } else if (selectedQuizOption === idx) {
                              optionStyle = 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold';
                            }

                            return (
                              <button 
                                key={idx}
                                disabled={quizSubmitted}
                                onClick={() => setSelectedQuizOption(idx)}
                                className={`w-full p-4 rounded-2xl text-left text-xs md:text-sm border transition-all flex items-center justify-between ${optionStyle}`}
                              >
                                <span>{option}</span>
                                {selectedQuizOption === idx && !quizSubmitted && <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted ? (
                          <div className="mt-6 pt-5 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                              {quizIsCorrect ? (
                                <p className="text-green-400 text-sm font-bold flex items-center gap-1.5">
                                  🎉 Correct Answer! You earned +{activeLesson.xpReward} XP and +{activeLesson.goldReward} Gold coins.
                                </p>
                              ) : (
                                <p className="text-red-400 text-sm font-bold flex items-center gap-1.5">
                                  ❌ Incorrect Answer. Review the slides and try again!
                                </p>
                              )}
                            </div>
                            <button 
                              onClick={() => {
                                if (quizIsCorrect) {
                                  setActiveLesson(null);
                                } else {
                                  setCurrentSlideIndex(0);
                                  setQuizSubmitted(false);
                                  setSelectedQuizOption(null);
                                  setQuizIsCorrect(null);
                                }
                              }}
                              className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl border border-white/10 cursor-pointer"
                            >
                              {quizIsCorrect ? 'Finish Lesson' : 'Retry Slides'}
                            </button>
                          </div>
                        ) : (
                          <button 
                            disabled={selectedQuizOption === null}
                            onClick={handleQuizSubmit}
                            className="mt-6 w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-sm rounded-2xl transition-all shadow-md disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                          >
                            Submit Answer
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. SIMULATOR VIEW */}
          {activeTab === 'simulator' && (
            <div id="tab-sim" className="grid grid-cols-12 gap-6">
              
              {/* Main Chart Card */}
              <div className="col-span-12 lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-[32px] p-6 backdrop-blur-sm flex flex-col gap-5">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h3 className="text-md font-bold flex items-center gap-2">
                      Interactive Technical Simulator
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-bold border border-green-500/20 uppercase tracking-tighter">Live Feeds</span>
                    </h3>
                    <p className="text-[11px] text-white/50">Simulated 5-second charts to practice timing support and resistance zones.</p>
                  </div>
                  
                  {/* Stock Chooser Tickers */}
                  <div className="flex gap-1.5 overflow-x-auto max-w-full py-1">
                    {stocks.map(s => (
                      <button 
                        key={s.ticker}
                        onClick={() => setSelectedStockTicker(s.ticker)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selectedStockTicker === s.ticker ? 'bg-green-500 text-black font-extrabold shadow-md' : 'bg-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        {s.ticker}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Stats details */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase block font-bold">{activeStock.name}</span>
                    <span className="text-xl font-mono font-bold tracking-tight">${activeStock.price.toFixed(2)}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-white/40 uppercase block font-bold">24h Performance</span>
                    <span className={`text-sm font-bold flex items-center justify-end gap-0.5 ${activeStock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {activeStock.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {activeStock.change >= 0 ? '+' : ''}{activeStock.change.toFixed(2)}%
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-white/40 uppercase block font-bold">Volume</span>
                    <span className="text-xs font-mono font-medium text-white/80">42,850 Shares</span>
                  </div>
                </div>

                {/* Draw the beautiful dynamic candlestick graph */}
                <div className="flex-1 flex flex-col justify-center min-h-[200px]">
                  {renderCandlestickChart(activeStock)}
                </div>

                {/* Simulated live flashing message banner */}
                {activeNews && (
                  <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-center gap-3.5">
                    <div className={`w-2 h-8 rounded-full ${activeNews.impact === 'bullish' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`}></div>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-widest">
                        <span>BREAKING</span> • {activeNews.ticker} Alert
                      </p>
                      <p className="text-[11px] text-white/80 leading-relaxed font-medium mt-0.5">{activeNews.title}: {activeNews.description}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Trading desk panel */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                
                {/* Active Trading Desk */}
                <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 backdrop-blur-sm flex flex-col gap-4">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-white/40">Simulator Desk</h3>
                  
                  {/* Share selector */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/50 block mb-1.5">Trade Quantity (Shares)</label>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setTradeAmount(prev => Math.max(1, prev - 1))}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white font-bold text-sm cursor-pointer"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        min="1"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl text-center py-2 font-mono text-sm font-bold text-white outline-none focus:border-green-500"
                      />
                      <button 
                        onClick={() => setTradeAmount(prev => prev + 1)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white font-bold text-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-white/60">
                      <span>Stock Price:</span>
                      <span className="text-white">${activeStock.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Total Value:</span>
                      <span className="text-white font-bold">${(activeStock.price * tradeAmount).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <button 
                      onClick={() => handleSimTrade('BUY')}
                      className="py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-2xl shadow-lg border border-green-500 shadow-green-950/20 cursor-pointer"
                    >
                      Buy Shares
                    </button>
                    <button 
                      onClick={() => handleSimTrade('SELL')}
                      className="py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-2xl shadow-lg border border-red-500 shadow-red-950/20 cursor-pointer"
                    >
                      Sell Shares
                    </button>
                  </div>
                </div>

                {/* Virtual Portfolio Balance Card */}
                <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 backdrop-blur-sm flex flex-col gap-4">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-white/40">My Virtual Portfolio</h3>
                  
                  <div className="text-center py-2">
                    <span className="text-[10px] uppercase font-bold text-white/40 block mb-0.5">Total Assets Value</span>
                    <span className="text-2xl font-mono font-bold text-green-400 block">${totalPortfolioValue.toFixed(2)}</span>
                    <span className={`text-[11px] font-bold inline-block mt-0.5 ${portfolioProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {portfolioProfitLoss >= 0 ? '▲ Profit' : '▼ Loss'}: ${Math.abs(portfolioProfitLoss).toFixed(2)} ({portfolioProfitLossPercent.toFixed(2)}%)
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[160px] overflow-y-auto pt-2 border-t border-white/5">
                    <div className="flex justify-between items-center text-[10px] text-white/40 font-bold uppercase pb-1 border-b border-white/5">
                      <span>Asset</span>
                      <span>Shares Owned</span>
                      <span>Value</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-white/60 font-sans font-medium">💵 USD Cash</span>
                      <span className="text-white/40">-</span>
                      <span className="text-white font-bold">${cash.toFixed(2)}</span>
                    </div>

                    {Object.entries(portfolio).map(([ticker, shares]) => {
                      const stock = stocks.find(s => s.ticker === ticker);
                      const currentVal = Number(shares) * (stock?.price || 0);
                      return (
                        <div key={ticker} className="flex justify-between items-center text-xs font-mono">
                          <span className="text-white/90 font-sans font-bold flex items-center gap-1.5">{ticker}</span>
                          <span className="text-white/70">{shares} shares</span>
                          <span className="text-white font-bold">${currentVal.toFixed(2)}</span>
                        </div>
                      );
                    })}

                    {Object.keys(portfolio).length === 0 && (
                      <p className="text-[11px] text-white/40 text-center py-4">No active stock positions. Purchase your first shares using the desk above!</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 4. AI COACH VIEW */}
          {activeTab === 'coach' && (
            <div id="tab-coach" className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 backdrop-blur-sm min-h-[500px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 text-purple-400 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-md font-bold text-white flex items-center gap-1.5">
                        GrowBot Financial Advisor
                        <span className="text-[9px] bg-purple-500 text-white font-bold px-1.5 py-0.5 rounded uppercase">Gemini 3.5</span>
                      </h2>
                      <p className="text-[11px] text-white/40">Personalized automated advisory based on your direct learning progression.</p>
                    </div>
                  </div>
                </div>

                {/* Suggested prompt chips */}
                <div className="flex gap-2 mb-4 overflow-x-auto py-1">
                  <button 
                    onClick={() => setAiMessage('Explain candlestick bodies and shadow wicks')}
                    className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-white/70 hover:text-white transition-all whitespace-nowrap cursor-pointer"
                  >
                    💡 Candlesticks
                  </button>
                  <button 
                    onClick={() => setAiMessage('What are the rules of support and resistance?')}
                    className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-white/70 hover:text-white transition-all whitespace-nowrap cursor-pointer"
                  >
                    💡 Support & Resistance
                  </button>
                  <button 
                    onClick={() => setAiMessage('Can you review my current portfolio allocation?')}
                    className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-white/70 hover:text-white transition-all whitespace-nowrap cursor-pointer"
                  >
                    📊 Review Portfolio
                  </button>
                </div>

                {/* Chat transcript history */}
                <div className="space-y-4 max-h-[320px] overflow-y-auto p-2 border border-white/5 bg-black/20 rounded-2xl min-h-[240px]">
                  {aiHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed border transition-all ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600/10 border-blue-500/20 text-white font-medium' 
                          : 'bg-white/[0.03] border-white/10 text-white/90'
                      }`}>
                        {/* Format paragraph bullets */}
                        {msg.text.split('\n').map((line, i) => (
                          <p key={i} className={line.trim().startsWith('*') || line.trim().startsWith('-') ? 'pl-4 list-item mt-1 font-medium' : 'mt-1'}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl text-xs text-white/40 flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></div>
                        <span>GrowBot is analyzing market indicators...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendAiMessage} className="mt-4 flex gap-2 pt-4 border-t border-white/5">
                <input 
                  type="text" 
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  placeholder="Ask GrowBot: 'How do Call options work?' or ask for trading advice..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white placeholder-white/35 outline-none focus:border-purple-500 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={aiLoading}
                  className="px-5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Ask Coach
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* FOOTER SCROLLING TICKER */}
      <footer id="footer" className="h-11 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/10 px-6 flex items-center gap-6 overflow-hidden relative z-20">
        <div className="flex items-center gap-1.5 shrink-0 select-none">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest">Live Markets Tracker</span>
        </div>
        <div className="flex items-center gap-10 whitespace-nowrap text-[11px] font-mono animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
          {stocks.map(s => {
            const isGreen = s.change >= 0;
            return (
              <span key={s.ticker} className="inline-flex items-center gap-1.5" onClick={() => { setSelectedStockTicker(s.ticker); setActiveTab('simulator'); }}>
                <span className="text-white/60 font-bold">{s.ticker}</span>
                <span className="text-white font-semibold">${s.price.toFixed(2)}</span>
                <span className={isGreen ? 'text-green-500' : 'text-red-500'}>
                  {isGreen ? '▲' : '▼'} {isGreen ? '+' : ''}{s.change.toFixed(2)}%
                </span>
              </span>
            );
          })}
        </div>
      </footer>

    </div>
  );
}
