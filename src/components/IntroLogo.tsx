import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Sparkles, ChevronRight } from 'lucide-react';

interface IntroLogoProps {
  onComplete: () => void;
}

export function IntroLogo({ onComplete }: IntroLogoProps) {
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    // Progress loader emulation
    const duration = 2400; // 2.4 seconds total loader
    const intervalTime = 30;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 300); // short delay after hitting 100%
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    // Show a subtle skip button after 1 second for user convenience
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(skipTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden select-none">
      {/* 1. Deep Space Cosmic Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.02] blur-[120px] pointer-events-none animate-pulse" />
      
      {/* Ambient Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />

      {/* 2. Floating Particle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 10,
              scale: Math.random() * 0.8 + 0.4,
              opacity: 0 
            }}
            animate={{ 
              y: -20,
              opacity: [0, 0.7, 0.7, 0],
              x: `calc(${Math.random() * window.innerWidth}px + ${Math.sin(i) * 40}px)`
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* 3. Centered Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* Animated Brand Sprout Logo */}
        <motion.div 
          className="relative mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Outer glowing pulsing orb */}
          <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl scale-125 animate-ping opacity-35" />
          
          {/* Core SVG Logo */}
          <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-zinc-900 to-black border border-emerald-500/20 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.15)] relative z-10">
            <svg viewBox="0 0 100 100" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Dynamic Rising Grid Lines inside logo */}
              <motion.path 
                d="M15 85 L85 85" 
                stroke="rgba(16,185,129,0.1)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
              <motion.path 
                d="M15 50 L85 50" 
                stroke="rgba(16,185,129,0.05)" 
                strokeWidth="1" 
                strokeDasharray="2 2"
              />

              {/* Sprouting Financial Trend Leaf Line */}
              <motion.path
                d="M20 75 Q40 70 50 50 T80 25"
                stroke="url(#emerald-gradient)"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
              />

              {/* Sprout Leaf 1 */}
              <motion.path
                d="M50 50 Q60 30 75 35 Q60 48 50 50"
                fill="#10b981"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.9 }}
                style={{ originX: "50px", originY: "50px" }}
              />

              {/* Sprout Leaf 2 (Smaller side shoot) */}
              <motion.path
                d="M38 64 Q25 55 20 62 Q30 68 38 64"
                fill="#34d399"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 1.1 }}
                style={{ originX: "38px", originY: "64px" }}
              />

              {/* Sparkling star at the tip of growth */}
              <motion.circle
                cx="80"
                cy="25"
                r="3.5"
                fill="#34d399"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 1.5, duration: 0.4 }}
              />

              <defs>
                <linearGradient id="emerald-gradient" x1="20" y1="75" x2="80" y2="25" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#065f46" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        {/* Brand Name Typography */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-1.5"
        >
          <h1 className="text-3xl font-black text-white tracking-[0.25em] pl-[0.25em] font-sans">
            GROWFOLIO
          </h1>
          <p className="text-[10px] font-bold text-emerald-400 tracking-[0.35em] pl-[0.35em] uppercase font-mono">
            Cultivate Your Capital
          </p>
        </motion.div>

        {/* Progress Loader */}
        <div className="w-48 h-[3px] bg-white/5 rounded-full mt-10 overflow-hidden relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-300 rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Loading details */}
        <motion.span 
          className="text-[9px] text-white/30 font-mono tracking-widest uppercase mt-3 inline-block"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {progress < 35 && 'Syncing sandboxes...'}
          {progress >= 35 && progress < 70 && 'Watering portfolio trees...'}
          {progress >= 70 && progress < 95 && 'Initializing market arena...'}
          {progress >= 95 && 'Ready to grow!'}
        </motion.span>

        {/* Skip button for expert/fast usability */}
        <AnimatePresence>
          {showSkip && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={onComplete}
              className="mt-8 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold text-white/50 hover:text-white flex items-center gap-1 transition-all cursor-pointer z-20"
            >
              Skip Intro
              <ChevronRight className="w-3 h-3 text-emerald-400" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle version footer */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white/15 tracking-widest uppercase">
        v2.4.0 • Sandbox Edition
      </div>
    </div>
  );
}
