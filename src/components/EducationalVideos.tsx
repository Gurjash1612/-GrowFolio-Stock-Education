import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Play, Pause, Award, Sparkles, ChevronRight, RotateCcw, Info } from 'lucide-react';
import { gameAudio } from '../utils/audio';

interface EducationalVideosProps {
  onAddRewards: (gold: number, xp: number) => void;
}

const VIDEO_LECTURES = [
  {
    id: 'v1',
    title: 'The Magic of Compound Interest',
    duration: '2:15',
    slides: [
      { text: 'Imagine planting a seed. Over time, that seed grows into a tree. Compound interest is like that tree producing seeds, which grow into more trees!', visual: '🌱 ➔ 🌳 ➔ 🌲🌲🌲' },
      { text: 'In finance, compound interest means you earn interest on your principal PLUS the interest you already accumulated. It is interest on interest!', visual: '💰 + 📈 = 🚀' },
      { text: 'Albert Einstein famously called compound interest the "8th Wonder of the World." Those who understand it earn it; those who do not, pay it.', visual: '🧠💡🎖️' }
    ],
    goldReward: 50,
    xpReward: 100
  },
  {
    id: 'v2',
    title: 'How the Stock Market Works',
    duration: '3:05',
    slides: [
      { text: 'A stock represents fractional ownership in a company. When you buy NVDA or AAPL, you own a tiny piece of their future earnings!', visual: '🏢 ➔ 🍕 (Fractional Slice)' },
      { text: 'The stock market operates like an auction. Buyers place "bid" orders, and sellers place "ask" orders. Price moves based on supply and demand.', visual: '⚖️ Buyers vs Sellers' },
      { text: 'If a company launches an incredible product, demand surges, bid prices go up, and your portfolio equity rises accordingly!', visual: '📈 Surging Growth' }
    ],
    goldReward: 60,
    xpReward: 120
  }
];

export const EducationalVideos: React.FC<EducationalVideosProps> = ({ onAddRewards }) => {
  const [selectedVideo, setSelectedVideo] = useState<typeof VIDEO_LECTURES[0] | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [watchedIds, setWatchedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('gf_watched_videos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!isPlaying || !selectedVideo) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next slide or finish
          if (currentSlide < selectedVideo.slides.length - 1) {
            setCurrentSlide(prevSlide => prevSlide + 1);
            return 0;
          } else {
            setIsPlaying(false);
            handleFinishVideo();
            return 100;
          }
        }
        return prev + 4; // increment progress bar
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, selectedVideo]);

  const handleStartVideo = (video: typeof VIDEO_LECTURES[0]) => {
    gameAudio.playClick();
    setSelectedVideo(video);
    setCurrentSlide(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleFinishVideo = () => {
    if (!selectedVideo) return;
    if (watchedIds.includes(selectedVideo.id)) {
      alert('Video finished! (You have already claimed rewards for this video).');
      setSelectedVideo(null);
      return;
    }

    gameAudio.playLevelUp();
    gameAudio.playCoin();

    const updated = [...watchedIds, selectedVideo.id];
    setWatchedIds(updated);
    localStorage.setItem('gf_watched_videos', JSON.stringify(updated));

    onAddRewards(selectedVideo.goldReward, selectedVideo.xpReward);
    alert(`🎉 Class completed! You watched "${selectedVideo.title}" and earned +${selectedVideo.goldReward} Gold and +${selectedVideo.xpReward} XP!`);
    setSelectedVideo(null);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
        <div>
          <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
            <Film className="w-5 h-5 text-indigo-400" /> GrowFolio Cinema Lectures
          </h4>
          <p className="text-[11px] text-white/40">Watch conceptual animated visual guides to speed up your investment garden vocabulary!</p>
        </div>
      </div>

      {!selectedVideo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VIDEO_LECTURES.map((v) => {
            const isWatched = watchedIds.includes(v.id);
            return (
              <div key={v.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center hover:border-white/20 transition-all">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded">
                    {v.duration} MIN LECTURE
                  </span>
                  <h5 className="text-xs md:text-sm font-bold text-white">{v.title}</h5>
                  <p className="text-[9px] text-white/40">Rewards: +{v.goldReward} Gold / +{v.xpReward} XP</p>
                </div>

                <button
                  onClick={() => handleStartVideo(v)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isWatched ? 'bg-white/10 text-white/50' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> {isWatched ? 'Rewatch' : 'Play Video'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6 bg-black/40 border border-white/10 p-6 rounded-2xl text-center relative overflow-hidden">
          {/* Progress bar line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/10">
            <div className="bg-indigo-500 h-full transition-all duration-150" style={{ width: `${progress}%` }} />
          </div>

          <div className="space-y-4 py-8">
            <div className="text-5xl animate-bounce mb-3">
              {selectedVideo.slides[currentSlide].visual}
            </div>
            
            <p className="text-white text-sm md:text-base font-medium max-w-md mx-auto leading-relaxed">
              {selectedVideo.slides[currentSlide].text}
            </p>
          </div>

          {/* Player controls */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs text-white/50">
            <span>Slide {currentSlide + 1} / {selectedVideo.slides.length}</span>

            <div className="flex gap-2">
              <button
                onClick={() => { gameAudio.playClick(); setIsPlaying(!isPlaying); }}
                className="p-2 bg-white/10 hover:bg-white/15 text-white rounded-lg cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={() => { gameAudio.playClick(); setSelectedVideo(null); }}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg cursor-pointer"
              >
                Exit Player
              </button>
            </div>

            <span className="font-mono">Progress: {Math.round(progress)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default EducationalVideos;
