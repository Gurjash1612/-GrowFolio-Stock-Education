export interface Stock {
  ticker: string;
  name: string;
  price: number;
  prevPrice: number;
  change: number;
  history: { open: number; high: number; low: number; close: number }[];
}

export interface Transaction {
  ticker: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  timestamp: string;
}

export interface NewsItem {
  id: string;
  title: string;
  impact: 'bullish' | 'bearish' | 'neutral';
  ticker: string;
  description: string;
}

export interface AvatarConfig {
  hair: string;
  hairColor: string;
  outfit: string;
  accessory: string;
  pet: string;
  bg: string;
  isCustomized: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
  rewardXp: number;
  rewardGold: number;
  icon: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  rewardXp: number;
  rewardGold: number;
  type: 'water' | 'quiz' | 'trade' | 'game';
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  bgGradient: string;
  cardStyle: string;
  textAccent: string;
  buttonAccent: string;
}

export interface Friend {
  id: string;
  name: string;
  avatarSeed: string;
  xp: number;
  level: number;
  status: 'online' | 'offline' | 'studying';
  hasGift: boolean;
}

export interface CommunityPost {
  id: string;
  author: string;
  handle: string;
  role: 'Seed' | 'Explorer' | 'Analyst' | 'Legend';
  avatarEmoji: string;
  content: string;
  likes: number;
  comments: { author: string; content: string; timestamp: string }[];
  timestamp: string;
  likedByMe?: boolean;
}

export interface NoteItem {
  id: string;
  lessonNum: number;
  lessonTitle: string;
  content: string;
  timestamp: string;
}

export interface SavedBookmark {
  lessonNum: number;
  title: string;
  savedAt: string;
}
