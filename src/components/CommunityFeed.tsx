import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Send, Heart, MessageSquare, Shield, Trophy, Gift, Plus, UserPlus, Sparkles, Coins } from 'lucide-react';
import { Friend, CommunityPost } from '../types';
import { gameAudio } from '../utils/audio';

interface CommunityFeedProps {
  gold: number;
  xp: number;
  onAddRewards: (gold: number, xp: number) => void;
  avatarEmoji: string;
}

const INITIAL_FRIENDS: Friend[] = [
  { id: 'f1', name: 'BullRunner_99', avatarSeed: '🐂', xp: 4500, level: 12, status: 'online', hasGift: true },
  { id: 'f2', name: 'HodlQueen', avatarSeed: '👑', xp: 8200, level: 25, status: 'studying', hasGift: true },
  { id: 'f3', name: 'Warren_Jr', avatarSeed: '👴', xp: 12500, level: 41, status: 'offline', hasGift: false },
  { id: 'f4', name: 'BearTrap_X', avatarSeed: '🐻', xp: 2100, level: 6, status: 'online', hasGift: true },
];

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    author: 'Buffett_Disciple',
    handle: '@value_invest',
    role: 'Analyst',
    avatarEmoji: '📈',
    content: 'Just finished Lesson 142 on support and resistance lines! Pro-tip: Always wait for a confirmed volume breakout before jumping into technical patterns. HODL smart, folks!',
    likes: 18,
    comments: [
      { author: 'BullRunner_99', content: 'Agreed! False breakouts have trapped so many margin traders.', timestamp: '10m ago' },
      { author: 'HodlQueen', content: 'Thanks for the explanation! Super helpful tips.', timestamp: '5m ago' }
    ],
    timestamp: '1h ago',
    likedByMe: false,
  },
  {
    id: 'p2',
    author: 'OptionKid',
    handle: '@yolo_calls',
    role: 'Explorer',
    avatarEmoji: '🚀',
    content: 'Simulator is on FIRE! NVDA long calls just printed 40% equity gains in 10 ticks. Reinvesting everything into compounding dividends on Apple. Let the garden GROW!',
    likes: 34,
    comments: [
      { author: 'Warren_Jr', content: 'Slow down young trader, compounding interest in stable assets wins the marathon.', timestamp: '30m ago' }
    ],
    timestamp: '2h ago',
    likedByMe: false,
  }
];

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  gold,
  xp,
  onAddRewards,
  avatarEmoji
}) => {
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  
  // Custom Post Input State
  const [newPostText, setNewPostText] = useState<string>('');
  const [friendNameInput, setFriendNameInput] = useState<string>('');

  // Add Friend Trigger
  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendNameInput.trim()) return;
    
    gameAudio.playClick();
    const newF: Friend = {
      id: `f-${Date.now()}`,
      name: friendNameInput.trim(),
      avatarSeed: ['🦊', '🐱', '🐼', '🐯', '🐸', '🐨'][Math.floor(Math.random() * 6)],
      xp: Math.floor(Math.random() * 2000) + 100,
      level: Math.floor(Math.random() * 10) + 1,
      status: 'online',
      hasGift: false,
    };

    setFriends([...friends, newF]);
    setFriendNameInput('');
  };

  // Send Gift to Friend (+15 XP, costs nothing)
  const handleSendGift = (id: string) => {
    gameAudio.playClick();
    gameAudio.playCoin();
    
    setFriends(prev => 
      prev.map(f => {
        if (f.id === id) {
          return { ...f, hasGift: false };
        }
        return f;
      })
    );

    // Give user some coins/xp for being generous
    onAddRewards(15, 50);
    alert('Gift sent! You earned +15 Gold and +50 XP as a community generosity bonus!');
  };

  // Challenge Friend to Stock Prediction
  const handleChallengeFriend = (friendName: string) => {
    gameAudio.playClick();
    alert(`Challenge sent to ${friendName}! You will compete on stock market simulation accuracy over the next 24 hours.`);
  };

  // Submit Community Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    gameAudio.playClick();

    const newPost: CommunityPost = {
      id: `p-${Date.now()}`,
      author: 'You (GrowTrader)',
      handle: '@my_portfolio',
      role: xp > 15000 ? 'Legend' : xp > 10500 ? 'Analyst' : xp > 2500 ? 'Explorer' : 'Seed',
      avatarEmoji: avatarEmoji || '🌳',
      content: newPostText.trim(),
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      likedByMe: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');

    // Trigger instant mock AI Reply in 2 seconds to make the timeline feel alive!
    setTimeout(() => {
      const replies = [
        "Incredible insight! Let's keep trading responsibly.",
        "Your financial garden is taking absolute shape!",
        "Compounding returns is the 8th wonder of the world.",
        "Nice post! What lessons did you complete to learn this?"
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const botNames = ["BullRunner_99", "HodlQueen", "Warren_Jr"];
      const randomBot = botNames[Math.floor(Math.random() * botNames.length)];

      setPosts(prevPosts => 
        prevPosts.map(p => {
          if (p.id === newPost.id) {
            return {
              ...p,
              comments: [
                ...p.comments,
                { author: randomBot, content: randomReply, timestamp: '1s ago' }
              ]
            };
          }
          return p;
        })
      );
      gameAudio.playXpGain();
    }, 2200);
  };

  const handleLikePost = (id: string) => {
    gameAudio.playClick();
    setPosts(prev => 
      prev.map(p => {
        if (p.id === id) {
          const isLiked = !p.likedByMe;
          return {
            ...p,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
            likedByMe: isLiked
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
      {/* SOCIAL COMMUNITY TIMELINE COLUMN */}
      <div className="lg:col-span-8 space-y-6">
        {/* Create Post Form */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
          <form onSubmit={handleCreatePost} className="space-y-3.5">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xl">
                {avatarEmoji || '🌳'}
              </div>
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Share investment advice, tree milestones, or trading tips..."
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl p-3 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500 min-h-[75px] placeholder-white/30 resize-none"
              />
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-white/5">
              <span className="text-[10px] text-white/40">Keep discussion supportive and educational.</span>
              <button
                type="submit"
                disabled={!newPostText.trim()}
                className="px-4.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Send className="w-3 h-3 fill-current" /> Post Idea
              </button>
            </div>
          </form>
        </div>

        {/* Posts Feed Timeline */}
        <div className="space-y-4">
          {posts.map((p) => (
            <div key={p.id} className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
              {/* Post Header */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-xl">
                    {p.avatarEmoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white leading-none">{p.author}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${
                        p.role === 'Legend' 
                          ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' 
                          : p.role === 'Analyst'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      }`}>
                        {p.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/40">{p.handle} • {p.timestamp}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleLikePost(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition-colors cursor-pointer ${
                    p.likedByMe 
                      ? 'bg-red-500/15 border-red-500/30 text-red-400' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white/80'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${p.likedByMe ? 'fill-current' : ''}`} /> {p.likes}
                </button>
              </div>

              {/* Content body */}
              <p className="text-white/80 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">
                {p.content}
              </p>

              {/* Comments list section */}
              {p.comments.length > 0 && (
                <div className="bg-black/30 border border-white/5 rounded-2xl p-3.5 space-y-3">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-white/30 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-blue-400" /> Responses ({p.comments.length})
                  </span>
                  
                  <div className="space-y-2.5 divide-y divide-white/5">
                    {p.comments.map((comm, cidx) => (
                      <div key={cidx} className={`text-xs ${cidx > 0 ? 'pt-2.5' : ''}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-[11px] text-white/80">{comm.author}</span>
                          <span className="text-[9px] text-white/30 font-mono">{comm.timestamp}</span>
                        </div>
                        <p className="text-white/60 text-[11px] leading-relaxed font-medium">{comm.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIVALS, FRIENDS & LEADERBOARDS COLUMN */}
      <div className="lg:col-span-4 space-y-6">
        {/* Friends list */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
            <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-400" /> Active Allies
            </h4>
            <span className="text-[10px] font-mono text-white/40">{friends.length} friends</span>
          </div>

          {/* Add Friend Form */}
          <form onSubmit={handleAddFriend} className="flex gap-2 mb-4">
            <input
              type="text"
              value={friendNameInput}
              onChange={(e) => setFriendNameInput(e.target.value)}
              placeholder="Username..."
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-white/20"
            />
            <button
              type="submit"
              className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </form>

          {/* List items */}
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {friends.map((f) => (
              <div key={f.id} className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-lg relative border border-white/5">
                    {f.avatarSeed}
                    {/* Status dot */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-zinc-900 ${
                      f.status === 'online' ? 'bg-green-500' : f.status === 'studying' ? 'bg-amber-500 animate-pulse' : 'bg-gray-500'
                    }`} />
                  </div>
                  <div>
                    <h5 className="font-bold text-[11px] text-white">{f.name}</h5>
                    <p className="text-[9px] text-white/40 font-mono">Level {f.level} • {f.xp} XP</p>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  {f.hasGift && (
                    <button
                      onClick={() => handleSendGift(f.id)}
                      className="p-1 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-400 rounded-lg cursor-pointer"
                      title="Send Daily Gold Gift"
                    >
                      <Gift className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleChallengeFriend(f.name)}
                    className="p-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-lg cursor-pointer text-[10px] font-bold px-2"
                  >
                    Fight
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Trophy Standings */}
        <div className="bg-gradient-to-b from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-3xl p-5">
          <h4 className="text-yellow-500 font-bold text-sm flex items-center gap-1.5 mb-3">
            <Trophy className="w-4 h-4 fill-current animate-bounce" /> Weekly Arena Leaderboard
          </h4>
          <p className="text-[10px] text-white/40 mb-3.5">Compare your absolute educational growth speed with other top global players!</p>

          <div className="space-y-2">
            {/* Top Rank 1 */}
            <div className="flex justify-between items-center bg-yellow-500/5 p-2 rounded-xl border border-yellow-500/20">
              <span className="text-[10px] font-mono font-bold text-yellow-500">1st 🥇 Warren_Jr</span>
              <span className="text-[10px] font-mono text-white/60 font-bold">12,500 XP</span>
            </div>
            {/* Top Rank 2 */}
            <div className="flex justify-between items-center bg-slate-400/5 p-2 rounded-xl border border-slate-400/10">
              <span className="text-[10px] font-mono font-bold text-slate-300">2nd 🥈 HodlQueen</span>
              <span className="text-[10px] font-mono text-white/60 font-bold">8,200 XP</span>
            </div>
            {/* User Row */}
            <div className="flex justify-between items-center bg-blue-500/10 p-2 rounded-xl border border-blue-500/30">
              <span className="text-[10px] font-mono font-bold text-blue-400">3rd 🥉 You (Trader)</span>
              <span className="text-[10px] font-mono text-blue-400 font-bold">{xp} XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CommunityFeed;
