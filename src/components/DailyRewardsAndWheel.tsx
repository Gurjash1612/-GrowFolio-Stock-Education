import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Coins, Award, Sparkles, RefreshCw, Star, Info, HelpCircle } from 'lucide-react';
import { gameAudio } from '../utils/audio';

interface DailyRewardsAndWheelProps {
  gold: number;
  xp: number;
  onAddRewards: (gold: number, xp: number) => void;
  streak: number;
  onIncrementStreak: () => void;
}

const CHEST_TYPES = [
  { id: 'bronze', name: 'Bronze Chest', cost: 100, color: 'border-amber-600 bg-amber-950/40 text-amber-500', emoji: '📦' },
  { id: 'silver', name: 'Silver Chest', cost: 250, color: 'border-slate-400 bg-slate-900/40 text-slate-300', emoji: '🥈' },
  { id: 'gold', name: 'Gold Chest', cost: 500, color: 'border-yellow-500 bg-yellow-950/40 text-yellow-500', emoji: '🪙' },
  { id: 'diamond', name: 'Diamond Chest', cost: 1000, color: 'border-cyan-400 bg-cyan-950/40 text-cyan-400', emoji: '💎' },
  { id: 'legendary', name: 'Legendary Chest', cost: 2000, color: 'border-rose-500 bg-rose-950/40 text-rose-500', emoji: '👑' },
];

const DAILY_DAYS = [
  { day: 1, rewardGold: 30, rewardXp: 100, emoji: '🌱' },
  { day: 2, rewardGold: 50, rewardXp: 150, emoji: '🌿' },
  { day: 3, rewardGold: 70, rewardXp: 200, emoji: '🍃' },
  { day: 4, rewardGold: 100, rewardXp: 250, emoji: '🌳' },
  { day: 5, rewardGold: 150, rewardXp: 300, emoji: '🪵' },
  { day: 6, rewardGold: 200, rewardXp: 400, emoji: '🌸' },
  { day: 7, rewardGold: 500, rewardXp: 1000, emoji: '💎' },
];

const WHEEL_SECTORS = [
  { label: '+50 Gold', gold: 50, xp: 0, color: '#F59E0B' },
  { label: '+100 XP', gold: 0, xp: 100, color: '#3B82F6' },
  { label: '+100 Gold', gold: 100, xp: 0, color: '#F59E0B' },
  { label: '+250 XP', gold: 0, xp: 250, color: '#10B981' },
  { label: '+200 Gold', gold: 200, xp: 0, color: '#EC4899' },
  { label: 'JACKPOT! +1000 Gold', gold: 1000, xp: 500, color: '#EF4444' },
];

export const DailyRewardsAndWheel: React.FC<DailyRewardsAndWheelProps> = ({
  gold,
  xp,
  onAddRewards,
  streak,
  onIncrementStreak,
}) => {
  // States
  const [claimedDays, setClaimedDays] = useState<number[]>(() => {
    const saved = localStorage.getItem('gf_claimed_days');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [wheelAngle, setWheelAngle] = useState<number>(0);
  const [wheelSpinning, setWheelSpinning] = useState<boolean>(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  // Chest States
  const [activeChest, setActiveChest] = useState<string | null>(null);
  const [chestOpening, setChestOpening] = useState<boolean>(false);
  const [chestRewards, setChestRewards] = useState<{ gold: number; xp: number; badge?: string } | null>(null);

  // Claim Daily Rewards
  const handleClaimDay = (dayNum: number, rewardGold: number, rewardXp: number) => {
    if (claimedDays.includes(dayNum)) return;
    
    gameAudio.playClick();
    gameAudio.playCoin();
    gameAudio.playXpGain();

    const updated = [...claimedDays, dayNum];
    setClaimedDays(updated);
    localStorage.setItem('gf_claimed_days', JSON.stringify(updated));

    onAddRewards(rewardGold, rewardXp);
    
    // If consecutive day, increment streak
    if (dayNum === streak + 1) {
      onIncrementStreak();
    }
  };

  // Lucky Spin Wheel Trigger
  const handleSpinWheel = () => {
    if (gold < 50) {
      alert('Insufficient Gold! Spinning the Lucky Wheel costs 50 Gold.');
      return;
    }
    if (wheelSpinning) return;

    gameAudio.playClick();
    onAddRewards(-50, 0); // spend 50 gold

    setWheelSpinning(true);
    setWheelResult(null);

    // Random sector & full spins calculation
    const sectorCount = WHEEL_SECTORS.length;
    const targetSector = Math.floor(Math.random() * sectorCount);
    
    // Calculate final rotation degrees: (full rotations * 360) + (target angle offset)
    const extraSpins = 5; // spins 5 full rounds
    const degreesPerSector = 360 / sectorCount;
    const targetDegrees = (extraSpins * 360) + (targetSector * degreesPerSector) + (degreesPerSector / 2);

    setWheelAngle(targetDegrees);

    // Timing simulation for completion
    setTimeout(() => {
      setWheelSpinning(false);
      const won = WHEEL_SECTORS[targetSector];
      onAddRewards(won.gold, won.xp);
      setWheelResult(`You won: ${won.label}!`);
      
      if (won.gold > 200 || won.xp > 300) {
        gameAudio.playLevelUp();
      } else {
        gameAudio.playCoin();
        gameAudio.playXpGain();
      }
    }, 4000); // 4 seconds animation
  };

  // Buy and Open Chest boxes
  const handleOpenChest = (chestId: string, cost: number) => {
    if (gold < cost) {
      alert('Insufficient Gold coins to unlock this reward chest!');
      return;
    }
    gameAudio.playClick();
    onAddRewards(-cost, 0); // subtract gold

    setActiveChest(chestId);
    setChestOpening(true);
    setChestRewards(null);

    // Simulated timing of opening
    setTimeout(() => {
      // Determine random drops based on Chest quality
      let minG = 50, maxG = 150, minX = 100, maxX = 300;
      if (chestId === 'silver') { minG = 120; maxG = 300; minX = 250; maxX = 600; }
      else if (chestId === 'gold') { minG = 250; maxG = 650; minX = 600; maxX = 1200; }
      else if (chestId === 'diamond') { minG = 600; maxG = 1500; minX = 1500; maxX = 3000; }
      else if (chestId === 'legendary') { minG = 1500; maxG = 3500; minX = 3500; maxX = 7000; }

      const droppedGold = Math.floor(Math.random() * (maxG - minG)) + minG;
      const droppedXp = Math.floor(Math.random() * (maxX - minX)) + minX;

      onAddRewards(droppedGold, droppedXp);
      setChestOpening(false);
      setChestRewards({ gold: droppedGold, xp: droppedXp });
      gameAudio.playLevelUp();
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: DAILY LOGIN BONUSES */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
          <div>
            <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
              <Gift className="w-5 h-5 text-pink-400" /> Daily Check-In Grid
            </h4>
            <p className="text-[11px] text-white/40">Log in daily to scale your financial garden and claim multiplier bonuses!</p>
          </div>
          <div className="text-right text-[11px] font-mono text-pink-400 font-bold bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
            🔥 {streak} Day Streak
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {DAILY_DAYS.map((d) => {
            const isClaimed = claimedDays.includes(d.day);
            const isAvailable = d.day <= streak + 1 && !isClaimed;

            return (
              <button
                key={d.day}
                disabled={!isAvailable}
                onClick={() => handleClaimDay(d.day, d.rewardGold, d.rewardXp)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[110px] cursor-pointer ${
                  isClaimed 
                    ? 'bg-green-500/10 border-green-500/30 text-green-400 opacity-60' 
                    : isAvailable
                    ? 'bg-gradient-to-b from-blue-600/20 to-indigo-600/10 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.25)] hover:scale-105'
                    : 'bg-white/5 border-white/10 opacity-40 cursor-not-allowed'
                }`}
              >
                <span className="text-[10px] font-bold text-white/50 font-mono">DAY {d.day}</span>
                <span className="text-2xl my-1.5">{isClaimed ? '✅' : d.emoji}</span>
                <div>
                  <p className="text-[10px] font-bold font-mono text-yellow-400">+{d.rewardGold}G</p>
                  <p className="text-[9px] font-bold font-mono text-blue-400">+{d.rewardXp}XP</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: WHEEL OF FORTUNE & CHESTS SHOP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lucky Wheel */}
        <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col items-center text-center">
          <h4 className="text-white font-bold text-sm flex items-center gap-1.5 mb-1.5 w-full justify-start border-b border-white/5 pb-3">
            <RefreshCw className="w-5 h-5 text-yellow-400" /> Lucky Spin Wheel
          </h4>
          <p className="text-[11px] text-white/40 mb-6 w-full text-start">Spin for just <span className="text-yellow-400 font-bold">50 Gold</span>. Try your luck to win the Legendary Jackpot!</p>

          {/* Graphical Spin Wheel SVG */}
          <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
            {/* Sector indicator needle */}
            <div className="absolute -top-1 z-30 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-red-500 drop-shadow-md"></div>
            
            {/* Spinning Circle */}
            <div 
              style={{ 
                transform: `rotate(-${wheelAngle}deg)`, 
                transition: wheelSpinning ? 'transform 4s cubic-bezier(0.15, 0.85, 0.35, 1)' : 'none'
              }}
              className="w-full h-full rounded-full border-4 border-white/20 relative overflow-hidden shadow-2xl"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {WHEEL_SECTORS.map((sec, idx) => {
                  const angleStart = idx * (360 / WHEEL_SECTORS.length);
                  const angleEnd = (idx + 1) * (360 / WHEEL_SECTORS.length);
                  const midAngle = (angleStart + angleEnd) / 2;
                  
                  // Simple SVG Sector Paths
                  const x1 = 50 + 50 * Math.cos((angleStart * Math.PI) / 180);
                  const y1 = 50 + 50 * Math.sin((angleStart * Math.PI) / 180);
                  const x2 = 50 + 50 * Math.cos((angleEnd * Math.PI) / 180);
                  const y2 = 50 + 50 * Math.sin((angleEnd * Math.PI) / 180);

                  return (
                    <g key={idx}>
                      <path 
                        d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`} 
                        fill={sec.color} 
                        opacity="0.85"
                        stroke="#1E293B"
                        strokeWidth="0.5"
                      />
                    </g>
                  );
                })}
                <circle cx="50" cy="50" r="14" fill="#1E293B" stroke="#FFFFFF" strokeWidth="1.5" />
              </svg>
              {/* Overlay Text indicators labels */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[8px] font-bold text-white font-mono">
                SPIN
              </div>
            </div>
          </div>

          <button
            disabled={wheelSpinning || gold < 50}
            onClick={handleSpinWheel}
            className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-40"
          >
            {wheelSpinning ? 'SPINNING...' : 'Spin Wheel (50 Gold)'}
          </button>

          {wheelResult && (
            <div className="mt-3 text-xs text-yellow-400 font-bold bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20 w-full">
              🎉 {wheelResult}
            </div>
          )}
        </div>

        {/* Chest Shop */}
        <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-5">
          <h4 className="text-white font-bold text-sm flex items-center gap-1.5 mb-1.5 border-b border-white/5 pb-3">
            <Star className="w-5 h-5 text-yellow-500" /> Premium Reward Chests
          </h4>
          <p className="text-[11px] text-white/40 mb-4">Invest your accrued Gold to unlock high-yield mystery reward chests containing massive amounts of XP and Gold booster awards!</p>

          <div className="space-y-2.5 overflow-y-auto max-h-[220px] pr-2">
            {CHEST_TYPES.map((c) => (
              <div key={c.id} className={`flex justify-between items-center p-3 rounded-2xl border ${c.color} backdrop-blur-sm`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{c.emoji}</span>
                  <div>
                    <h5 className="font-bold text-xs text-white">{c.name}</h5>
                    <p className="text-[9px] text-white/40 font-mono">Unlock standard random booster drops</p>
                  </div>
                </div>

                <button
                  disabled={gold < c.cost}
                  onClick={() => handleOpenChest(c.id, c.cost)}
                  className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-[10px] rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <Coins className="w-3 h-3" /> {c.cost}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHEST OPENING FULLSCREEN MODAL OVERLAY */}
      <AnimatePresence>
        {activeChest && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-6"
          >
            <div className="bg-zinc-900 border border-white/10 rounded-[40px] max-w-sm w-full p-8 text-center relative overflow-hidden">
              {/* Dynamic light streak backing */}
              <div className="absolute w-48 h-48 rounded-full bg-yellow-500/10 -top-10 -left-10 blur-3xl animate-pulse"></div>

              {chestOpening ? (
                <div className="space-y-6">
                  {/* Vibrating chest icon */}
                  <motion.div 
                    animate={{ x: [-3, 3, -3, 3, 0], y: [-2, 2, -2, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 0.3 }}
                    className="text-7xl mb-4"
                  >
                    📦
                  </motion.div>
                  <h4 className="text-white text-base font-black uppercase tracking-widest animate-pulse">
                    Unlocking Chest Rewards...
                  </h4>
                  <p className="text-xs text-white/40">Sieving random multiplier drops...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-7xl mb-4 animate-bounce">
                    ✨🎁✨
                  </div>
                  <h4 className="text-yellow-400 text-xl font-black uppercase tracking-wider">
                    Chest Unlocked!
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Your calculated investments have returned major reward multipliers:
                  </p>

                  <div className="flex justify-center gap-4 py-2">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 px-4 py-2.5 rounded-2xl text-center">
                      <span className="text-lg">🪙</span>
                      <p className="text-xs text-yellow-400 font-mono font-bold">+{chestRewards?.gold} Gold</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-2.5 rounded-2xl text-center">
                      <span className="text-lg">⚡</span>
                      <p className="text-xs text-blue-400 font-mono font-bold">+{chestRewards?.xp} XP</p>
                    </div>
                  </div>

                  <button
                    onClick={() => { gameAudio.playClick(); setActiveChest(null); }}
                    className="mt-4 px-6 py-2 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-white/90 transition-all cursor-pointer"
                  >
                    Collect Rewards
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default DailyRewardsAndWheel;
