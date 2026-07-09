import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, Trophy, Calendar, Sparkles, Check, Coins, Award, Timer } from 'lucide-react';
import { Achievement } from '../types';
import { gameAudio } from '../utils/audio';

interface AnalyticsAndEventsProps {
  xp: number;
  gold: number;
  onAddRewards: (gold: number, xp: number) => void;
  completedLessons: string[];
  transactionsCount: number;
  portfolioProfit: number;
  streak: number;
}

export const AnalyticsAndEvents: React.FC<AnalyticsAndEventsProps> = ({
  xp,
  gold,
  onAddRewards,
  completedLessons,
  transactionsCount,
  portfolioProfit,
  streak,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'achievements' | 'events'>('analytics');

  // Achievements State
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const defaultAchievements: Achievement[] = [
      { id: 'a1', title: 'Rooted Sprout', description: 'Begin your financial garden and water the GrowTree 1 time.', target: 1, progress: 1, completed: true, claimed: false, rewardXp: 100, rewardGold: 30, icon: '🌱' },
      { id: 'a2', title: 'Academic Explorer', description: 'Complete at least 3 lessons inside the GrowFolio academy.', target: 3, progress: completedLessons.length, completed: completedLessons.length >= 3, claimed: false, rewardXp: 200, rewardGold: 50, icon: '📚' },
      { id: 'a3', title: 'Arena Tycoon', description: 'Engage in the simulator by executing 5 or more equity trades.', target: 5, progress: transactionsCount, completed: transactionsCount >= 5, claimed: false, rewardXp: 300, rewardGold: 100, icon: '💼' },
      { id: 'a4', title: 'Golden Portfolio', description: 'Earn over $1,500 in simulated trading equity gains.', target: 1500, progress: Math.max(0, Math.round(portfolioProfit)), completed: portfolioProfit >= 1500, claimed: false, rewardXp: 500, rewardGold: 200, icon: '🪙' },
      { id: 'a5', title: 'Hyper Streak', description: 'Maintain a 5-day study streak to establish learning consistency.', target: 5, progress: streak, completed: streak >= 5, claimed: false, rewardXp: 400, rewardGold: 150, icon: '🔥' },
    ];
    
    const saved = localStorage.getItem('gf_achievements_claimed');
    if (saved) {
      try {
        const claimedIds = JSON.parse(saved);
        return defaultAchievements.map(ach => ({
          ...ach,
          claimed: claimedIds.includes(ach.id),
        }));
      } catch (e) {}
    }
    return defaultAchievements;
  });

  // Sync achievements when completed lessons or stats update
  React.useEffect(() => {
    setAchievements(prev => prev.map(ach => {
      let progress = ach.progress;
      if (ach.id === 'a2') progress = completedLessons.length;
      if (ach.id === 'a3') progress = transactionsCount;
      if (ach.id === 'a4') progress = Math.max(0, Math.round(portfolioProfit));
      if (ach.id === 'a5') progress = streak;

      const completed = progress >= ach.target;
      return { ...ach, progress, completed };
    }));
  }, [completedLessons, transactionsCount, portfolioProfit, streak]);

  // Claim Achievement
  const handleClaimAchievement = (id: string, rewardXp: number, rewardGold: number) => {
    gameAudio.playClick();
    gameAudio.playLevelUp();
    gameAudio.playCoin();

    setAchievements(prev => 
      prev.map(ach => {
        if (ach.id === id) {
          return { ...ach, claimed: true };
        }
        return ach;
      })
    );

    // Save to local storage
    const savedClaimed = JSON.parse(localStorage.getItem('gf_achievements_claimed') || '[]');
    localStorage.setItem('gf_achievements_claimed', JSON.stringify([...savedClaimed, id]));

    onAddRewards(rewardGold, rewardXp);
  };

  // MOCK WEEKLY TOURNAMENT ACTIVE EVENT
  const WEEKLY_EVENTS = [
    {
      id: 'e1',
      title: 'Summer Growth Cup',
      description: 'Active stock tournament. Top players competing to generate the highest simulated portfolio returns in 48 hours!',
      timer: '14h 45m remaining',
      participants: 1420,
      rewards: '1,000 Gold / Golden Sapling Skin'
    },
    {
      id: 'e2',
      title: 'Doji Master Quiz Blitz',
      description: 'Special timed event. Quizzes on technical candlestick formations yield double XP multiplier rewards!',
      timer: '2 days remaining',
      participants: 840,
      rewards: 'Double XP Boost'
    }
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
      {/* Tab select header */}
      <div className="flex gap-2 border-b border-white/5 pb-4 mb-5">
        <button
          onClick={() => { gameAudio.playClick(); setActiveTab('analytics'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Study Analytics
        </button>
        <button
          onClick={() => { gameAudio.playClick(); setActiveTab('achievements'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'achievements' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}
        >
          <Trophy className="w-4 h-4" /> Collectible Badges
        </button>
        <button
          onClick={() => { gameAudio.playClick(); setActiveTab('events'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'events' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}
        >
          <Calendar className="w-4 h-4" /> Timed Arenas
        </button>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-[10px] font-mono text-white/40 block mb-1">COMPLETED LESSONS</span>
              <span className="text-xl md:text-2xl font-black text-blue-400">{completedLessons.length}</span>
              <span className="text-[9px] text-white/30 block mt-0.5">out of 1000 levels</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-[10px] font-mono text-white/40 block mb-1">TRADE TRANSACTIONS</span>
              <span className="text-xl md:text-2xl font-black text-emerald-400">{transactionsCount}</span>
              <span className="text-[9px] text-white/30 block mt-0.5">executed buy/sell runs</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-[10px] font-mono text-white/40 block mb-1">SIMULATED GAINS</span>
              <span className="text-xl md:text-2xl font-black text-yellow-400">${Math.round(portfolioProfit)}</span>
              <span className="text-[9px] text-white/30 block mt-0.5">overall net profit</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-[10px] font-mono text-white/40 block mb-1">CONSECUTIVE STREAK</span>
              <span className="text-xl md:text-2xl font-black text-pink-400">{streak} Days</span>
              <span className="text-[9px] text-white/30 block mt-0.5">study momentum</span>
            </div>
          </div>

          {/* High-fidelity Vector Study Growth Chart */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
            <h5 className="text-[11px] font-extrabold uppercase tracking-widest text-white/40 mb-3.5">Study Growth Speed Chart</h5>
            <div className="h-44 flex items-end relative pt-6 px-4">
              {/* Grid backgrounds Lines */}
              <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-white/5"></div>
              <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-white/5"></div>
              <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-white/5"></div>

              {/* Vector SVG Path for Area charts */}
              <svg viewBox="0 0 400 120" className="absolute inset-0 w-full h-full p-2" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path d="M0,120 L50,110 L100,95 L150,90 L200,60 L250,55 L300,40 L350,25 L400,10 L400,120 Z" fill="url(#chart-grad)" />
                {/* Curve line */}
                <path d="M0,120 L50,110 L100,95 L150,90 L200,60 L250,55 L300,40 L350,25 L400,10" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
              </svg>

              <div className="w-full flex justify-between text-[8px] font-mono text-white/30 pt-1 border-t border-white/5 z-10">
                <span>Day 1</span>
                <span>Day 2</span>
                <span>Day 3</span>
                <span>Day 4</span>
                <span>Day 5</span>
                <span>Day 6</span>
                <span>Day 7</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
          {achievements.map((ach) => {
            const isCompleted = ach.completed;
            const progressPct = Math.min(100, (ach.progress / ach.target) * 100);

            return (
              <div key={ach.id} className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                ach.claimed 
                  ? 'bg-zinc-900/40 border-zinc-800/60 opacity-60' 
                  : isCompleted
                  ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                  : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <span className="text-3xl bg-zinc-800 rounded-xl p-2.5 border border-white/5 select-none">{ach.icon}</span>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h5 className="font-bold text-xs text-white leading-none flex items-center gap-1.5">
                      {ach.title} 
                      {isCompleted && !ach.claimed && (
                        <span className="text-[8px] bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider animate-pulse">
                          CLAIM READY
                        </span>
                      )}
                    </h5>
                    <p className="text-[10px] text-white/50 leading-tight">{ach.description}</p>
                    
                    {/* Progress slider */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                      </div>
                      <span className="text-[8px] font-mono text-white/40">{ach.progress}/{ach.target}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {ach.claimed ? (
                    <div className="p-1.5 bg-green-500/10 rounded-xl text-green-400">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaimAchievement(ach.id, ach.rewardXp, ach.rewardGold)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-[10px] rounded-xl cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      <Coins className="w-3.5 h-3.5" /> Claim Reward (+{ach.rewardGold})
                    </button>
                  ) : (
                    <div className="text-[10px] font-bold text-white/20 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 cursor-not-allowed">
                      Locked
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: EVENTS */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          {WEEKLY_EVENTS.map((e) => (
            <div key={e.id} className="p-4 bg-gradient-to-r from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-2xl space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded">
                  Live Global Arena Challenge
                </span>
                
                <div className="flex items-center gap-1 text-[10px] text-pink-400 font-bold animate-pulse">
                  <Timer className="w-3.5 h-3.5" /> {e.timer}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-xs text-white md:text-sm">{e.title}</h5>
                <p className="text-[11px] text-white/50 leading-relaxed mt-1">{e.description}</p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[9px] font-mono text-white/40">
                <span>👥 {e.participants} participating traders</span>
                <span className="text-yellow-400 font-bold">🎯 Reward: {e.rewards}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AnalyticsAndEvents;
