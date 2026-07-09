import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BookOpen, User, Droplet, Star, Check, ArrowRight } from 'lucide-react';
import { gameAudio } from '../utils/audio';

interface OnboardingFlowProps {
  onComplete: (data: {
    playerName: string;
    experience: 'beginner' | 'intermediate' | 'advanced';
    goal: string;
    sproutId: string;
  }) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [playerName, setPlayerName] = useState<string>('');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [goal, setGoal] = useState<string>('wealth');
  const [sproutId, setSproutId] = useState<string>('green_sprout');

  const handleNext = () => {
    gameAudio.playClick();
    let finalName = playerName.trim();
    if (step === 1 && !finalName) {
      finalName = 'GrowTrader';
      setPlayerName('GrowTrader');
    }
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      onComplete({ playerName: finalName || 'GrowTrader', experience, goal, sproutId });
      gameAudio.playLevelUp();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full bg-zinc-950 border border-white/10 rounded-[40px] p-8 text-center relative overflow-hidden flex flex-col justify-between min-h-[460px] shadow-2xl">
        {/* Ambient glow backgrounds */}
        <div className="absolute w-40 h-40 rounded-full bg-blue-600/10 -top-10 -left-10 blur-3xl" />
        <div className="absolute w-40 h-40 rounded-full bg-green-600/10 -bottom-10 -right-10 blur-3xl" />

        {/* STEP 1: NAME INPUT */}
        {step === 1 && (
          <div className="space-y-6 my-auto">
            <div className="text-4xl">🌱</div>
            <div>
              <h3 className="text-white font-extrabold text-xl md:text-2xl tracking-tight">Welcome to GrowFolio!</h3>
              <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                Step into a gamified universe designed to cultivate institutional-grade investing skills. First, what is your trader nickname?
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl max-w-sm mx-auto">
              <User className="w-4 h-4 text-white/30" />
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter nickname..."
                className="bg-transparent border-none text-xs md:text-sm text-white focus:outline-none flex-1 placeholder-white/20"
              />
            </div>
          </div>
        )}

        {/* STEP 2: EXPERIENCE SELECT */}
        {step === 2 && (
          <div className="space-y-5 my-auto">
            <div>
              <h3 className="text-white font-extrabold text-xl md:text-2xl tracking-tight">Select Investment Tier</h3>
              <p className="text-xs text-white/40 mt-1">We will tailor your learning path recommendations accordingly.</p>
            </div>

            <div className="space-y-2.5 text-left max-w-sm mx-auto">
              <button
                onClick={() => { gameAudio.playClick(); setExperience('beginner'); }}
                className={`w-full p-3.5 rounded-2xl border transition-all text-xs cursor-pointer flex items-center justify-between ${
                  experience === 'beginner' ? 'bg-blue-600/15 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/50'
                }`}
              >
                <div>
                  <span className="font-bold block">Novice Explorer</span>
                  <span className="text-[10px] opacity-70">Starts with Core Lesson 1 (Compound Interest, Dividends)</span>
                </div>
                {experience === 'beginner' && <Check className="w-4 h-4 text-blue-400" />}
              </button>

              <button
                onClick={() => { gameAudio.playClick(); setExperience('intermediate'); }}
                className={`w-full p-3.5 rounded-2xl border transition-all text-xs cursor-pointer flex items-center justify-between ${
                  experience === 'intermediate' ? 'bg-blue-600/15 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/50'
                }`}
              >
                <div>
                  <span className="font-bold block">Active Trader</span>
                  <span className="text-[10px] opacity-70">Starts near Lesson 301 (Charts, Volume Breakouts, Resistance)</span>
                </div>
                {experience === 'intermediate' && <Check className="w-4 h-4 text-blue-400" />}
              </button>

              <button
                onClick={() => { gameAudio.playClick(); setExperience('advanced'); }}
                className={`w-full p-3.5 rounded-2xl border transition-all text-xs cursor-pointer flex items-center justify-between ${
                  experience === 'advanced' ? 'bg-blue-600/15 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/50'
                }`}
              >
                <div>
                  <span className="font-bold block">Portfolio Strategist</span>
                  <span className="text-[10px] opacity-70">Starts near Lesson 701 (Derivatives, Valuation, Hedge Ratios)</span>
                </div>
                {experience === 'advanced' && <Check className="w-4 h-4 text-blue-400" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: GOALS SELECT */}
        {step === 3 && (
          <div className="space-y-5 my-auto">
            <div>
              <h3 className="text-white font-extrabold text-xl md:text-2xl tracking-tight">Choose Your Primary Goal</h3>
              <p className="text-xs text-white/40 mt-1">Determine which indicators and features to spotlight first.</p>
            </div>

            <div className="space-y-2 text-left max-w-sm mx-auto text-xs">
              {[
                { id: 'wealth', label: 'Accumulate Wealth', desc: 'Focus on dividend compounding & passive income portfolio models.' },
                { id: 'charts', label: 'Master Chart Analysis', desc: 'Drill down technical patterns, support break levels & indicators.' },
                { id: 'arena', label: 'Simulate High-Yield Trading', desc: 'Hone timing in the fast-paced stock and crypto market arena.' }
              ].map(g => (
                <button
                  key={g.id}
                  onClick={() => { gameAudio.playClick(); setGoal(g.id); }}
                  className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                    goal === g.id ? 'bg-blue-600/15 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/50'
                  }`}
                >
                  <div>
                    <span className="font-bold block">{g.label}</span>
                    <span className="text-[10px] opacity-75">{g.desc}</span>
                  </div>
                  {goal === g.id && <Check className="w-4 h-4 text-blue-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: SPROUT SELECT */}
        {step === 4 && (
          <div className="space-y-5 my-auto">
            <div>
              <h3 className="text-white font-extrabold text-xl md:text-2xl tracking-tight">Select Your Sprout Companion</h3>
              <p className="text-xs text-white/40 mt-1">This will plant the visual seeds of your investment garden tree!</p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {[
                { id: 'green_sprout', name: 'Emerald Sprout', emoji: '🌱' },
                { id: 'gold_sprout', name: 'Golden Seed', emoji: '🪙' },
                { id: 'cosmic_sprout', name: 'Cosmic Bud', emoji: '💫' }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => { gameAudio.playClick(); setSproutId(s.id); }}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center cursor-pointer ${
                    sproutId === s.id ? 'bg-blue-600/15 border-blue-500 text-white scale-105' : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  <span className="text-3xl mb-1">{s.emoji}</span>
                  <span className="text-[9px] font-bold leading-none">{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION FOOTER */}
        <div className="pt-6 border-t border-white/5 flex justify-between items-center">
          <span className="text-[10px] text-white/30 font-mono">Step {step} / 4</span>
          
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
          >
            {step < 4 ? 'Continue' : 'Enter Arena'} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default OnboardingFlow;
