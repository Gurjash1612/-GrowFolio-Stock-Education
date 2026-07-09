import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, Coins, Award, HelpCircle, ArrowUpRight, ArrowDownRight, RefreshCw, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { gameAudio } from '../utils/audio';
import { 
  generateMatcherLessons, 
  generateBreakoutLessons, 
  generatePredictorLessons,
  MatcherLesson,
  BreakoutLesson,
  PredictorLesson
} from '../utils/gameLessons';

interface MiniGamesProps {
  gold: number;
  xp: number;
  onAddRewards: (gold: number, xp: number) => void;
}

// Generate the massive lesson datasets at the module level
const MATCHER_LESSONS = generateMatcherLessons();
const BREAKOUT_LESSONS = generateBreakoutLessons();
const PREDICTOR_LESSONS = generatePredictorLessons();

export const MiniGames: React.FC<MiniGamesProps> = ({ gold, xp, onAddRewards }) => {
  const [activeGame, setActiveGame] = useState<'none' | 'predictor' | 'matcher' | 'breakout'>('none');

  // SHARED PROGRESSION & JUMP STATES
  const [predictorLevel, setPredictorLevel] = useState<number>(1);
  const [predictorInputLevel, setPredictorInputLevel] = useState<string>("1");
  const [predictorMode, setPredictorMode] = useState<'arcade' | 'campaign'>('campaign');

  const [matcherLevel, setMatcherLevel] = useState<number>(1);
  const [matcherInputLevel, setMatcherInputLevel] = useState<string>("1");

  const [breakoutLevel, setBreakoutLevel] = useState<number>(1);
  const [breakoutInputLevel, setBreakoutInputLevel] = useState<string>("1");

  // GAME 1: MARKET PREDICTOR STATES
  const [predictorChart, setPredictorChart] = useState<number[]>([100, 102, 101, 104, 103]);
  const [predictorBet, setPredictorBet] = useState<'up' | 'down' | null>(null);
  const [predictorActive, setPredictorActive] = useState<boolean>(false);
  const [predictorTicksLeft, setPredictorTicksLeft] = useState<number>(0);
  const [predictorStake, setPredictorStake] = useState<number>(30);
  const [predictorResult, setPredictorResult] = useState<string | null>(null);

  // GAME 2: CANDLESTICK MATCHER STATES
  const [matcherAnswered, setMatcherAnswered] = useState<boolean>(false);
  const [selectedMatcherOption, setSelectedMatcherOption] = useState<number | null>(null);

  // GAME 3: BREAKOUT PUZZLE STATES
  const [breakoutSubmitted, setBreakoutSubmitted] = useState<boolean>(false);
  const [selectedBreakoutOption, setSelectedBreakoutOption] = useState<number | null>(null);

  // LOAD PROGRESS FROM LOCALSTORAGE ON MOUNT
  useEffect(() => {
    try {
      const storedPredictor = localStorage.getItem('growfolio_highest_predictor');
      if (storedPredictor) {
        const val = parseInt(storedPredictor, 10);
        if (val >= 1 && val <= 1050) {
          setPredictorLevel(val);
          setPredictorInputLevel(val.toString());
        }
      }
      
      const storedMatcher = localStorage.getItem('growfolio_highest_matcher');
      if (storedMatcher) {
        const val = parseInt(storedMatcher, 10);
        if (val >= 1 && val <= 1050) {
          setMatcherLevel(val);
          setMatcherInputLevel(val.toString());
        }
      }

      const storedBreakout = localStorage.getItem('growfolio_highest_breakout');
      if (storedBreakout) {
        const val = parseInt(storedBreakout, 10);
        if (val >= 1 && val <= 1050) {
          setBreakoutLevel(val);
          setBreakoutInputLevel(val.toString());
        }
      }
    } catch (e) {}
  }, []);

  // MARKET PREDICTOR SIMULATION ENGINE (With probability-weighted bias drift)
  useEffect(() => {
    if (!predictorActive) return;

    const interval = setInterval(() => {
      setPredictorChart((prev) => {
        const last = prev[prev.length - 1];
        
        // Define random walk parameters
        let midDrift = 0.50; // default 50/50 drift
        if (predictorMode === 'campaign') {
          const currentStage = PREDICTOR_LESSONS[predictorLevel - 1];
          // Squeeze the market bias in the direction of technical probability
          if (currentStage.bias === 'up') {
            midDrift = 0.43; // biased upwards
          } else if (currentStage.bias === 'down') {
            midDrift = 0.57; // biased downwards
          }
        } else {
          midDrift = 0.47; // slight general upward drift in free play
        }

        const change = (Math.random() - midDrift) * 5.2;
        const next = Math.max(10, Math.round((last + change) * 100) / 100);
        return [...prev, next].slice(-8);
      });

      setPredictorTicksLeft((ticks) => {
        if (ticks <= 1) {
          setPredictorActive(false);
          clearInterval(interval);
          evaluatePredictor();
          return 0;
        }
        return ticks - 1;
      });
    }, 550);

    return () => clearInterval(interval);
  }, [predictorActive, predictorTicksLeft, predictorMode, predictorLevel]);

  const startPredictor = (direction: 'up' | 'down') => {
    const requiredStake = predictorMode === 'campaign' ? 0 : predictorStake;
    if (gold < requiredStake) {
      alert('Insufficient Gold coins for this prediction stake!');
      return;
    }
    gameAudio.playClick();
    if (requiredStake > 0) {
      onAddRewards(-requiredStake, 0); // subtract gold stake
    }

    setPredictorBet(direction);
    setPredictorActive(true);
    setPredictorTicksLeft(8);
    setPredictorResult(null);

    // Initial setup
    if (predictorMode === 'campaign') {
      const stage = PREDICTOR_LESSONS[predictorLevel - 1];
      setPredictorChart(stage.initialChart);
    } else {
      setPredictorChart([100, 101, 99, 102, 100]); // default starting reference point
    }
  };

  const evaluatePredictor = () => {
    setPredictorChart((chart) => {
      const startingPrice = predictorMode === 'campaign' ? PREDICTOR_LESSONS[predictorLevel - 1].initialChart[0] : 100;
      const endingPrice = chart[chart.length - 1];
      const isUp = endingPrice > startingPrice;

      const userGuessedUp = predictorBet === 'up';
      const actuallyUp = isUp;
      const isCorrect = userGuessedUp === actuallyUp;

      if (isCorrect) {
        // WINNER!
        const rewardGold = predictorMode === 'campaign' ? PREDICTOR_LESSONS[predictorLevel - 1].rewardGold : predictorStake * 2;
        const rewardXp = predictorMode === 'campaign' ? PREDICTOR_LESSONS[predictorLevel - 1].rewardXp : 80;
        onAddRewards(rewardGold, rewardXp);
        
        if (predictorMode === 'campaign') {
          setPredictorResult(`WIN! Stage ${predictorLevel} Completed! Price finished at $${endingPrice} (Starting: $${startingPrice}). You earned +${rewardGold} Gold & +${rewardXp} XP!`);
          
          // Move to next level automatically and persist progress
          const nextLvl = Math.min(1050, predictorLevel + 1);
          setPredictorLevel(nextLvl);
          setPredictorInputLevel(nextLvl.toString());
          try {
            localStorage.setItem('growfolio_highest_predictor', nextLvl.toString());
          } catch(e) {}
        } else {
          setPredictorResult(`WIN! Price finished at $${endingPrice} (Starting: $${startingPrice}). You earned +${rewardGold} Gold!`);
        }
        gameAudio.playCorrect();
        gameAudio.playXpGain();
      } else {
        // LOSER
        if (predictorMode === 'campaign') {
          setPredictorResult(`STAGE FAILED! Price finished at $${endingPrice} (Starting: $${startingPrice}). The technical setup had a different bias. Review the indicators and try again!`);
        } else {
          setPredictorResult(`LOSS! Price finished at $${endingPrice} (Starting: $${startingPrice}). Good luck next time!`);
        }
        gameAudio.playWrong();
      }
      return chart;
    });
  };

  // GAME 2: CANDLESTICK MATCHER SUBMIT HANDLER
  const submitMatcher = (optIdx: number) => {
    if (matcherAnswered) return;
    setSelectedMatcherOption(optIdx);
    setMatcherAnswered(true);

    const question = MATCHER_LESSONS[matcherLevel - 1];
    if (optIdx === question.correctIdx) {
      onAddRewards(50, 150);
      gameAudio.playCorrect();
      gameAudio.playXpGain();

      // Persist next level
      const nextLvl = Math.min(1050, matcherLevel + 1);
      try {
        localStorage.setItem('growfolio_highest_matcher', nextLvl.toString());
      } catch(e) {}
    } else {
      gameAudio.playWrong();
    }
  };

  const handleNextMatcherLevel = () => {
    gameAudio.playClick();
    setMatcherAnswered(false);
    setSelectedMatcherOption(null);
    const nextVal = Math.min(1050, matcherLevel + 1);
    setMatcherLevel(nextVal);
    setMatcherInputLevel(nextVal.toString());
  };

  // GAME 3: BREAKOUT PUZZLE SUBMIT HANDLER
  const submitBreakout = (optIdx: number) => {
    if (breakoutSubmitted) return;
    setSelectedBreakoutOption(optIdx);
    setBreakoutSubmitted(true);

    const puzzle = BREAKOUT_LESSONS[breakoutLevel - 1];
    if (optIdx === puzzle.correctIdx) {
      onAddRewards(puzzle.rewardGold, puzzle.rewardXp);
      gameAudio.playCorrect();
      gameAudio.playXpGain();

      // Persist next level
      const nextLvl = Math.min(1050, breakoutLevel + 1);
      try {
        localStorage.setItem('growfolio_highest_breakout', nextLvl.toString());
      } catch(e) {}
    } else {
      gameAudio.playWrong();
    }
  };

  const handleNextBreakoutLevel = () => {
    gameAudio.playClick();
    setBreakoutSubmitted(false);
    setSelectedBreakoutOption(null);
    const nextVal = Math.min(1050, breakoutLevel + 1);
    setBreakoutLevel(nextVal);
    setBreakoutInputLevel(nextVal.toString());
  };

  // LEVEL JUMP HELPERS
  const jumpToPredictorLevel = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(predictorInputLevel, 10);
    if (!isNaN(val) && val >= 1 && val <= 1050) {
      setPredictorLevel(val);
      setPredictorResult(null);
      setPredictorActive(false);
      gameAudio.playClick();
    } else {
      setPredictorInputLevel(predictorLevel.toString());
    }
  };

  const jumpToMatcherLevel = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(matcherInputLevel, 10);
    if (!isNaN(val) && val >= 1 && val <= 1050) {
      setMatcherLevel(val);
      setMatcherAnswered(false);
      setSelectedMatcherOption(null);
      gameAudio.playClick();
    } else {
      setMatcherInputLevel(matcherLevel.toString());
    }
  };

  const jumpToBreakoutLevel = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(breakoutInputLevel, 10);
    if (!isNaN(val) && val >= 1 && val <= 1050) {
      setBreakoutLevel(val);
      setBreakoutSubmitted(false);
      setSelectedBreakoutOption(null);
      gameAudio.playClick();
    } else {
      setBreakoutInputLevel(breakoutLevel.toString());
    }
  };

  // HIGH-QUALITY MULTI-CANDLESTICK VECTOR RENDERER
  const renderCandlestickShape = (shape: string) => {
    switch (shape) {
      case 'hammer':
        return (
          <div className="flex flex-col items-center py-6">
            <div className="w-0.5 h-4 bg-white/10"></div>
            <div className="w-10 h-6 bg-emerald-500 rounded border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
            <div className="w-0.5 h-16 bg-emerald-400"></div>
          </div>
        );
      case 'shooting':
        return (
          <div className="flex flex-col items-center py-6">
            <div className="w-0.5 h-16 bg-red-400"></div>
            <div className="w-10 h-6 bg-red-500 rounded border border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]"></div>
            <div className="w-0.5 h-4 bg-white/10"></div>
          </div>
        );
      case 'doji':
        return (
          <div className="flex flex-col items-center py-6">
            <div className="w-0.5 h-12 bg-white/40"></div>
            <div className="w-14 h-1 bg-white border border-white"></div>
            <div className="w-0.5 h-12 bg-white/40"></div>
          </div>
        );
      case 'engulfing_bullish':
        return (
          <div className="flex items-center gap-4 py-6">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-3 bg-red-400/50"></div>
              <div className="w-6 h-6 bg-red-500/60 rounded border border-red-500/40"></div>
              <div className="w-0.5 h-3 bg-red-400/50"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-emerald-400"></div>
              <div className="w-9 h-12 bg-emerald-500 rounded border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
              <div className="w-0.5 h-4 bg-emerald-400"></div>
            </div>
          </div>
        );
      case 'engulfing_bearish':
        return (
          <div className="flex items-center gap-4 py-6">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-3 bg-emerald-400/50"></div>
              <div className="w-6 h-6 bg-emerald-500/60 rounded border border-emerald-500/40"></div>
              <div className="w-0.5 h-3 bg-emerald-400/50"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-red-400"></div>
              <div className="w-9 h-12 bg-red-500 rounded border border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]"></div>
              <div className="w-0.5 h-4 bg-red-400"></div>
            </div>
          </div>
        );
      case 'inverted_hammer':
        return (
          <div className="flex flex-col items-center py-6">
            <div className="w-0.5 h-16 bg-emerald-400"></div>
            <div className="w-10 h-6 bg-emerald-500 rounded border border-emerald-400"></div>
            <div className="w-0.5 h-4 bg-white/10"></div>
          </div>
        );
      case 'hanging_man':
        return (
          <div className="flex flex-col items-center py-6">
            <div className="w-0.5 h-4 bg-white/10"></div>
            <div className="w-10 h-6 bg-red-500 rounded border border-red-400"></div>
            <div className="w-0.5 h-16 bg-red-400"></div>
          </div>
        );
      case 'marubozu_green':
        return (
          <div className="flex flex-col items-center py-6">
            <div className="w-10 h-20 bg-emerald-500 rounded border border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
          </div>
        );
      case 'marubozu_red':
        return (
          <div className="flex flex-col items-center py-6">
            <div className="w-10 h-20 bg-red-500 rounded border border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]"></div>
          </div>
        );
      case 'dragonfly':
        return (
          <div className="flex flex-col items-center py-6">
            <div className="w-14 h-1 bg-white border border-white"></div>
            <div className="w-0.5 h-20 bg-white/80"></div>
          </div>
        );
      case 'gravestone':
        return (
          <div className="flex flex-col items-center py-6">
            <div className="w-0.5 h-20 bg-white/80"></div>
            <div className="w-14 h-1 bg-white border border-white"></div>
          </div>
        );
      case 'spinning_top':
        return (
          <div className="flex flex-col items-center py-6">
            <div className="w-0.5 h-10 bg-white/30"></div>
            <div className="w-8 h-6 bg-amber-500/70 rounded border border-amber-400"></div>
            <div className="w-0.5 h-10 bg-white/30"></div>
          </div>
        );
      case 'tweezer_bottom':
        return (
          <div className="flex items-end gap-3 py-6">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-red-400"></div>
              <div className="w-7 h-10 bg-red-500 rounded border border-red-400"></div>
              <div className="w-0.5 h-8 bg-red-400"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-8 bg-emerald-400"></div>
              <div className="w-7 h-10 bg-emerald-500 rounded border border-emerald-400"></div>
              <div className="w-0.5 h-8 bg-emerald-400"></div>
            </div>
          </div>
        );
      case 'tweezer_top':
        return (
          <div className="flex items-start gap-3 py-6">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-8 bg-emerald-400"></div>
              <div className="w-7 h-10 bg-emerald-500 rounded border border-emerald-400"></div>
              <div className="w-0.5 h-4 bg-emerald-400"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-8 bg-red-400"></div>
              <div className="w-7 h-10 bg-red-500 rounded border border-red-400"></div>
              <div className="w-0.5 h-4 bg-red-400"></div>
            </div>
          </div>
        );
      case 'three_soldiers':
        return (
          <div className="flex items-end gap-2 py-6 pl-4">
            <div className="flex flex-col items-center translate-y-4">
              <div className="w-0.5 h-2 bg-emerald-400/50"></div>
              <div className="w-5 h-6 bg-emerald-500/80 rounded border border-emerald-400/50"></div>
              <div className="w-0.5 h-2 bg-emerald-400/50"></div>
            </div>
            <div className="flex flex-col items-center translate-y-2">
              <div className="w-0.5 h-2 bg-emerald-400"></div>
              <div className="w-5 h-7 bg-emerald-500 rounded border border-emerald-400"></div>
              <div className="w-0.5 h-2 bg-emerald-400"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-2 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <div className="w-5 h-8 bg-emerald-500 rounded border border-emerald-400"></div>
              <div className="w-0.5 h-2 bg-emerald-400"></div>
            </div>
          </div>
        );
      case 'three_crows':
        return (
          <div className="flex items-start gap-2 py-6 pl-4">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-2 bg-red-400"></div>
              <div className="w-5 h-8 bg-red-500 rounded border border-red-400"></div>
              <div className="w-0.5 h-2 bg-red-400"></div>
            </div>
            <div className="flex flex-col items-center translate-y-2">
              <div className="w-0.5 h-2 bg-red-400"></div>
              <div className="w-5 h-7 bg-red-500 rounded border border-red-400"></div>
              <div className="w-0.5 h-2 bg-red-400"></div>
            </div>
            <div className="flex flex-col items-center translate-y-4">
              <div className="w-0.5 h-2 bg-red-400/50"></div>
              <div className="w-5 h-6 bg-red-500/80 rounded border border-red-400/50"></div>
              <div className="w-0.5 h-2 bg-red-400/50"></div>
            </div>
          </div>
        );
      case 'morning_star':
        return (
          <div className="flex items-center gap-2 py-6">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-red-400"></div>
              <div className="w-5 h-10 bg-red-500 rounded border border-red-400"></div>
              <div className="w-0.5 h-4 bg-red-400"></div>
            </div>
            <div className="flex flex-col items-center translate-y-4">
              <div className="w-0.5 h-2 bg-white/40"></div>
              <div className="w-3 h-3 bg-amber-400 rounded-sm border border-amber-300 animate-pulse"></div>
              <div className="w-0.5 h-2 bg-white/40"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-emerald-400"></div>
              <div className="w-5 h-9 bg-emerald-500 rounded border border-emerald-400"></div>
              <div className="w-0.5 h-4 bg-emerald-400"></div>
            </div>
          </div>
        );
      case 'evening_star':
        return (
          <div className="flex items-center gap-2 py-6">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-emerald-400"></div>
              <div className="w-5 h-10 bg-emerald-500 rounded border border-emerald-400"></div>
              <div className="w-0.5 h-4 bg-emerald-400"></div>
            </div>
            <div className="flex flex-col items-center -translate-y-4">
              <div className="w-0.5 h-2 bg-white/40"></div>
              <div className="w-3 h-3 bg-amber-400 rounded-sm border border-amber-300 animate-pulse"></div>
              <div className="w-0.5 h-2 bg-white/40"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-red-400"></div>
              <div className="w-5 h-9 bg-red-500 rounded border border-red-400"></div>
              <div className="w-0.5 h-4 bg-red-400"></div>
            </div>
          </div>
        );
      case 'harami_bullish':
        return (
          <div className="flex items-center gap-2 py-6">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-red-400"></div>
              <div className="w-8 h-12 bg-red-500 rounded border border-red-400"></div>
              <div className="w-0.5 h-4 bg-red-400"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-2 bg-emerald-400"></div>
              <div className="w-4 h-5 bg-emerald-500 rounded border border-emerald-400"></div>
              <div className="w-0.5 h-2 bg-emerald-400"></div>
            </div>
          </div>
        );
      case 'harami_bearish':
        return (
          <div className="flex items-center gap-2 py-6">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-emerald-400"></div>
              <div className="w-8 h-12 bg-emerald-500 rounded border border-emerald-400"></div>
              <div className="w-0.5 h-4 bg-emerald-400"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-2 bg-red-400"></div>
              <div className="w-4 h-5 bg-red-500 rounded border border-red-400"></div>
              <div className="w-0.5 h-2 bg-red-400"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center py-6">
            <div className="w-0.5 h-12 bg-white/40"></div>
            <div className="w-16 h-1 bg-white border border-white"></div>
            <div className="w-0.5 h-12 bg-white/40"></div>
          </div>
        );
    }
  };

  // HIGH-QUALITY BREAKOUT PUZZLE SVG GRAPHICS
  const renderBreakoutChart = (pattern: string) => {
    let paths = "";
    let overlays = null;

    switch (pattern) {
      case "triangle":
      case "triangle_ascending":
        paths = "M 20 80 L 180 50 M 20 20 L 180 50";
        overlays = (
          <>
            <path d="M 25 50 L 50 25 L 75 70 L 100 35 L 125 60 L 150 42 L 175 52" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
            <path d="M 175 52 L 210 50" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeDasharray="3" />
            <circle cx="175" cy="52" r="4" fill="#fbbf24" className="animate-pulse" />
          </>
        );
        break;
      case "double_bottom":
        paths = "M 10 30 L 10 110 L 230 110";
        overlays = (
          <>
            <path d="M 30 40 L 70 100 L 110 50 L 150 100 L 190 40" fill="none" stroke="#10b981" strokeWidth="3" />
            <line x1="20" y1="50" x2="210" y2="50" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4" />
            <text x="140" y="44" fill="#f43f5e" className="text-[8px] font-mono">Neckline Breakout</text>
            <circle cx="190" cy="40" r="4" fill="#fbbf24" className="animate-pulse" />
          </>
        );
        break;
      case "wedge_rising":
        paths = "M 20 70 L 190 30 M 20 90 L 190 37";
        overlays = (
          <>
            <path d="M 25 85 L 50 50 L 80 72 L 110 40 L 140 60 L 170 33 M 170 33 L 195 55" fill="none" stroke="#ef4444" strokeWidth="2.5" />
            <circle cx="170" cy="33" r="4" fill="#fbbf24" className="animate-pulse" />
          </>
        );
        break;
      case "head_shoulders":
        overlays = (
          <>
            <path d="M 20 90 L 50 60 L 75 90 L 110 30 L 145 90 L 170 65 L 195 95" fill="none" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="15" y1="90" x2="205" y2="92" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4" />
            <text x="15" y="103" fill="#60a5fa" className="text-[8px] font-mono">Neckline Support</text>
            <circle cx="195" cy="95" r="4" fill="#fbbf24" className="animate-pulse" />
          </>
        );
        break;
      case "bullish_flag":
      case "bear_flag":
        overlays = (
          <>
            <line x1="40" y1="100" x2="40" y2="30" stroke="#10b981" strokeWidth="3" />
            <path d="M 40 30 L 120 45 L 40 55 L 120 70" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
            <line x1="40" y1="30" x2="120" y2="15" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="40" y1="50" x2="120" y2="35" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="120" cy="45" r="4" fill="#fbbf24" className="animate-pulse" />
          </>
        );
        break;
      case "cup_handle":
        overlays = (
          <>
            <path d="M 30 30 A 60 60 0 0 0 150 30" fill="none" stroke="#60a5fa" strokeWidth="3" />
            <path d="M 150 30 A 15 15 0 0 0 180 35" fill="none" stroke="#10b981" strokeWidth="3" />
            <line x1="25" y1="30" x2="190" y2="30" stroke="#ef4444" strokeWidth="1" strokeDasharray="3" />
            <circle cx="180" cy="35" r="4" fill="#fbbf24" className="animate-pulse" />
          </>
        );
        break;
      case "double_top":
        paths = "M 10 30 L 10 110 L 230 110";
        overlays = (
          <>
            <path d="M 30 100 L 70 40 L 110 90 L 150 40 L 190 100" fill="none" stroke="#ef4444" strokeWidth="3" />
            <line x1="20" y1="90" x2="210" y2="90" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4" />
            <circle cx="190" cy="100" r="4" fill="#fbbf24" className="animate-pulse" />
          </>
        );
        break;
      case "wedge_falling":
        paths = "M 20 30 L 190 70 M 20 50 L 190 77";
        overlays = (
          <>
            <path d="M 25 35 L 50 65 L 80 47 L 110 73 L 140 58 L 170 75" fill="none" stroke="#10b981" strokeWidth="2.5" />
            <circle cx="170" cy="75" r="4" fill="#fbbf24" className="animate-pulse" />
          </>
        );
        break;
      default:
        overlays = (
          <>
            <path d="M 20 80 L 60 40 L 100 70 L 140 30 L 180 50 L 210 20" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
            <circle cx="210" cy="20" r="4" fill="#fbbf24" className="animate-pulse" />
          </>
        );
        break;
    }

    return (
      <div className="bg-black/30 border border-white/5 rounded-3xl p-5 flex flex-col items-center justify-center min-h-[220px]">
        <svg className="w-60 h-32" viewBox="0 0 240 120">
          {paths && <path d={paths} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />}
          {overlays}
        </svg>
        <span className="text-[10px] text-white/30 font-mono mt-3 uppercase tracking-widest">Interactive Pattern Layout</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* SELECTION MENU / ARCADE BOARD */}
      {activeGame === 'none' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Game 1: Market Predictor Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="text-3xl mb-3">📈</div>
              <h4 className="text-white font-bold text-sm mb-1.5 flex items-center gap-1">
                Market Predictor <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full font-bold">1000+ Stages</span>
              </h4>
              <p className="text-white/40 text-[11px] leading-relaxed mb-4">
                Interactive price forecasting simulation. Study realistic starting charts, read trend metrics, and make forecasts across 1,000+ progressive campaign levels!
              </p>
            </div>
            <button 
              onClick={() => { gameAudio.playClick(); setActiveGame('predictor'); }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Play Predictor
            </button>
          </div>

          {/* Game 2: Candlestick Matcher */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="text-3xl mb-3">🕯️</div>
              <h4 className="text-white font-bold text-sm mb-1.5 flex items-center gap-1">
                Candlestick Matcher <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold">1000+ Lessons</span>
              </h4>
              <p className="text-white/40 text-[11px] leading-relaxed mb-4">
                Master professional technical analysis candlestick structures. Match vector charts representing 20 core patterns in 1,000+ lesson contexts.
              </p>
            </div>
            <button 
              onClick={() => { gameAudio.playClick(); setActiveGame('matcher'); }}
              className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Play Matcher
            </button>
          </div>

          {/* Game 3: Trendline Breakout Puzzle */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="text-white font-bold text-sm mb-1.5 flex items-center gap-1">
                Breakout Puzzle <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full font-bold">1000+ Lessons</span>
              </h4>
              <p className="text-white/40 text-[11px] leading-relaxed mb-4">
                Analyze high-level chart formations such as ascending wedges and flags. Forecast the breakdown target on 1,000+ fully-guided breakout puzzles.
              </p>
            </div>
            <button 
              onClick={() => { gameAudio.playClick(); setActiveGame('breakout'); }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Play Breakout
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 relative">
          
          {/* Back button */}
          <button 
            onClick={() => { gameAudio.playClick(); setActiveGame('none'); setPredictorResult(null); }}
            className="absolute top-6 right-6 text-white/50 hover:text-white text-xs bg-white/5 px-3 py-1.5 rounded-full cursor-pointer transition-all border border-white/5 hover:border-white/20"
          >
            ← Back to Arcade
          </button>

          {/* GAME 1 CONTENT: MARKET PREDICTOR */}
          {activeGame === 'predictor' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h4 className="text-white font-bold text-base flex items-center gap-1.5">
                    📈 Market Predictor Ticker
                  </h4>
                  <p className="text-xs text-white/40">Watch real-time charts. Correctly analyze technical indicators to clear campaign levels!</p>
                </div>

                {/* MODE SELECTOR */}
                <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/5 text-xs">
                  <button 
                    onClick={() => { setPredictorMode('campaign'); setPredictorResult(null); }}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${predictorMode === 'campaign' ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white'}`}
                  >
                    Campaign (1000+ Stages)
                  </button>
                  <button 
                    onClick={() => { setPredictorMode('arcade'); setPredictorResult(null); }}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${predictorMode === 'arcade' ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white'}`}
                  >
                    Free Arcade Replay
                  </button>
                </div>
              </div>

              {/* CAMPAIGN MODE LEVEL PAGINATION & SELECTOR */}
              {predictorMode === 'campaign' && (
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      disabled={predictorLevel <= 1 || predictorActive}
                      onClick={() => {
                        const prev = Math.max(1, predictorLevel - 1);
                        setPredictorLevel(prev);
                        setPredictorInputLevel(prev.toString());
                        setPredictorResult(null);
                        gameAudio.playClick();
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-white/80 font-mono">
                      Stage {predictorLevel} of 1050
                    </span>
                    <button 
                      disabled={predictorLevel >= 1050 || predictorActive}
                      onClick={() => {
                        const next = Math.min(1050, predictorLevel + 1);
                        setPredictorLevel(next);
                        setPredictorInputLevel(next.toString());
                        setPredictorResult(null);
                        gameAudio.playClick();
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Level Jump Input */}
                  <form onSubmit={jumpToPredictorLevel} className="flex items-center gap-1.5">
                    <label className="text-[10px] text-white/40 uppercase font-mono tracking-wider">Jump to Level:</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="1050" 
                      disabled={predictorActive}
                      value={predictorInputLevel}
                      onChange={(e) => setPredictorInputLevel(e.target.value)}
                      className="w-16 px-2 py-1 text-center bg-black/40 border border-white/10 text-white text-xs font-bold rounded-lg focus:border-blue-500 font-mono"
                    />
                    <button 
                      type="submit" 
                      disabled={predictorActive}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Go
                    </button>
                  </form>
                </div>
              )}

              {/* CURRENT CAMPAIGN LEVEL SCENARIO OVERVIEW */}
              {predictorMode === 'campaign' && (
                <div className="bg-blue-950/20 border border-blue-900/30 p-4 rounded-2xl">
                  <h5 className="text-white text-xs font-bold mb-1 flex items-center gap-1.5 text-blue-400">
                    <BookOpen className="w-3.5 h-3.5" /> SETUP DETAILS: {PREDICTOR_LESSONS[predictorLevel - 1].title}
                  </h5>
                  <p className="text-white/70 text-[11px] leading-relaxed">
                    {PREDICTOR_LESSONS[predictorLevel - 1].description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span>Bias Trend direction: <strong className="text-yellow-400 capitalize">{PREDICTOR_LESSONS[predictorLevel - 1].bias}</strong></span>
                    <span>Rewards: <strong className="text-green-400">+{PREDICTOR_LESSONS[predictorLevel - 1].rewardGold} Gold</strong>, <strong className="text-blue-400">+{PREDICTOR_LESSONS[predictorLevel - 1].rewardXp} XP</strong></span>
                  </div>
                </div>
              )}

              {/* ACTIVE GAME CANVAS */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-5 h-40 flex items-end justify-between relative overflow-hidden">
                <div className="absolute top-4 left-4 text-[10px] font-mono text-white/30">
                  {predictorMode === 'campaign' 
                    ? `Baseline Reference: $${PREDICTOR_LESSONS[predictorLevel - 1].initialChart[0]}.00`
                    : 'Baseline Reference: $100.00'
                  }
                </div>
                
                {/* Horizontal Baseline Line */}
                <div className="absolute left-0 right-0 h-0.5 border-t border-dashed border-white/10 top-1/2"></div>

                {/* Animated Chart Bars */}
                <div className="flex items-end gap-3 w-full h-full pt-10 z-10">
                  {predictorChart.map((val, idx) => {
                    const startingRef = predictorMode === 'campaign' ? PREDICTOR_LESSONS[predictorLevel - 1].initialChart[0] : 100;
                    // Scale the bars to fit in the viewport
                    const delta = val - startingRef;
                    const heightPercent = Math.min(95, Math.max(10, 50 + delta * 2.2));
                    
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <span className="text-[9px] font-mono font-bold text-white/40">${val}</span>
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-300 ${val > startingRef ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`} 
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RESULTS VIEW */}
              <div className="text-center">
                {predictorActive ? (
                  <div className="text-xs font-mono font-bold text-yellow-400 animate-pulse">
                    ⚡ RUNNING MULTI-TICK SIMULATION: {predictorTicksLeft} INTERVALS REMAINING...
                  </div>
                ) : predictorResult ? (
                  <div className="text-xs font-bold text-white bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed">
                    🎉 {predictorResult}
                  </div>
                ) : (
                  <div className="text-xs text-white/50">
                    {predictorMode === 'campaign' 
                      ? "Study the technical analysis context above, then forecast if the price will break UP or DOWN!"
                      : `Place your stake of ${predictorStake} Gold and forecast the direction to start the simulation!`
                    }
                  </div>
                )}
              </div>

              {/* CONTROLS */}
              <div className="flex gap-4 justify-center">
                <button
                  disabled={predictorActive}
                  onClick={() => startPredictor('up')}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all text-xs"
                >
                  <ArrowUpRight className="w-4 h-4 stroke-[3]" /> Forecast UP
                </button>
                <button
                  disabled={predictorActive}
                  onClick={() => startPredictor('down')}
                  className="px-8 py-3 bg-red-500 hover:bg-red-400 text-black font-black rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all text-xs"
                >
                  <ArrowDownRight className="w-4 h-4 stroke-[3]" /> Forecast DOWN
                </button>
              </div>
            </div>
          )}

          {/* GAME 2 CONTENT: CANDLESTICK MATCHER */}
          {activeGame === 'matcher' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h4 className="text-white font-bold text-base flex items-center gap-1.5">
                    🕯️ Candlestick Pattern Matcher
                  </h4>
                  <p className="text-xs text-white/40">Study the high-fidelity candlestick pattern vector and identify its correct trading terminology.</p>
                </div>
              </div>

              {/* LEVEL CONTROLLER & SEARCH */}
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    disabled={matcherLevel <= 1}
                    onClick={() => {
                      const prev = Math.max(1, matcherLevel - 1);
                      setMatcherLevel(prev);
                      setMatcherInputLevel(prev.toString());
                      setMatcherAnswered(false);
                      setSelectedMatcherOption(null);
                      gameAudio.playClick();
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-white/80 font-mono">
                    Lesson {matcherLevel} of 1050
                  </span>
                  <button 
                    disabled={matcherLevel >= 1050}
                    onClick={() => {
                      const next = Math.min(1050, matcherLevel + 1);
                      setMatcherLevel(next);
                      setMatcherInputLevel(next.toString());
                      setMatcherAnswered(false);
                      setSelectedMatcherOption(null);
                      gameAudio.playClick();
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={jumpToMatcherLevel} className="flex items-center gap-1.5">
                  <label className="text-[10px] text-white/40 uppercase font-mono tracking-wider">Jump to Lesson:</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="1050" 
                    value={matcherInputLevel}
                    onChange={(e) => setMatcherInputLevel(e.target.value)}
                    className="w-16 px-2 py-1 text-center bg-black/40 border border-white/10 text-white text-xs font-bold rounded-lg focus:border-green-500 font-mono"
                  />
                  <button 
                    type="submit" 
                    className="px-2.5 py-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Go
                  </button>
                </form>
              </div>

              {/* GAME ACTIVE PLAYBOARD */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Vector Canvas Column */}
                <div className="md:col-span-5 bg-black/30 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[220px]">
                  {renderCandlestickShape(MATCHER_LESSONS[matcherLevel - 1].shape)}
                  <span className="text-[10px] text-white/30 font-mono mt-3 uppercase tracking-widest">Interactive Pattern Vector</span>
                </div>

                {/* Question & Options Column */}
                <div className="md:col-span-7 space-y-4">
                  <div className="text-white text-xs md:text-sm font-medium leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="text-[9px] uppercase tracking-wider text-green-400 font-mono font-bold block">Scenario Challenge</span>
                    <p>{MATCHER_LESSONS[matcherLevel - 1].description}</p>
                  </div>

                  <div className="space-y-2">
                    {MATCHER_LESSONS[matcherLevel - 1].options.map((option, idx) => {
                      let btnStyle = 'bg-white/5 border-white/10 hover:border-white/30 text-white';
                      if (matcherAnswered) {
                        if (idx === MATCHER_LESSONS[matcherLevel - 1].correctIdx) {
                          btnStyle = 'bg-green-500/20 border-green-500 text-green-400 font-bold';
                        } else if (idx === selectedMatcherOption) {
                          btnStyle = 'bg-red-500/20 border-red-500 text-red-400';
                        } else {
                          btnStyle = 'bg-white/5 border-white/10 opacity-30';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={matcherAnswered}
                          onClick={() => submitMatcher(idx)}
                          className={`w-full p-3 rounded-xl border text-left text-xs md:text-sm transition-all cursor-pointer ${btnStyle}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {matcherAnswered && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleNextMatcherLevel}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Next Lesson Challenge (Level {matcherLevel + 1})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* GAME 3 CONTENT: BREAKOUT PUZZLE */}
          {activeGame === 'breakout' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h4 className="text-white font-bold text-base flex items-center gap-1.5">
                    🎯 Trendline Breakout Puzzle
                  </h4>
                  <p className="text-xs text-white/40">Read the high-volume technical analysis context and forecast the breakout breakdown direction.</p>
                </div>
              </div>

              {/* LEVEL CONTROLLER & JUMP */}
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    disabled={breakoutLevel <= 1}
                    onClick={() => {
                      const prev = Math.max(1, breakoutLevel - 1);
                      setBreakoutLevel(prev);
                      setBreakoutInputLevel(prev.toString());
                      setBreakoutSubmitted(false);
                      setSelectedBreakoutOption(null);
                      gameAudio.playClick();
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-white/80 font-mono">
                    Lesson {breakoutLevel} of 1050
                  </span>
                  <button 
                    disabled={breakoutLevel >= 1050}
                    onClick={() => {
                      const next = Math.min(1050, breakoutLevel + 1);
                      setBreakoutLevel(next);
                      setBreakoutInputLevel(next.toString());
                      setBreakoutSubmitted(false);
                      setSelectedBreakoutOption(null);
                      gameAudio.playClick();
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={jumpToBreakoutLevel} className="flex items-center gap-1.5">
                  <label className="text-[10px] text-white/40 uppercase font-mono tracking-wider">Jump to Lesson:</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="1050" 
                    value={breakoutInputLevel}
                    onChange={(e) => setBreakoutInputLevel(e.target.value)}
                    className="w-16 px-2 py-1 text-center bg-black/40 border border-white/10 text-white text-xs font-bold rounded-lg focus:border-indigo-500 font-mono"
                  />
                  <button 
                    type="submit" 
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Go
                  </button>
                </form>
              </div>

              {/* GAMEPLAY WORKSPACE */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Interactive SVG Chart Layout */}
                <div className="md:col-span-5">
                  {renderBreakoutChart(BREAKOUT_LESSONS[breakoutLevel - 1].chartPattern)}
                </div>

                {/* Question & Interactive Options column */}
                <div className="md:col-span-7 bg-white/5 p-5 rounded-3xl border border-white/5 space-y-4">
                  <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded font-mono">
                    {BREAKOUT_LESSONS[breakoutLevel - 1].title}
                  </span>

                  <p className="text-white text-xs md:text-sm font-bold leading-relaxed">
                    {BREAKOUT_LESSONS[breakoutLevel - 1].question}
                  </p>

                  <div className="bg-blue-500/10 border border-blue-500/20 p-3.5 rounded-xl text-blue-400 text-[11px] leading-relaxed">
                    💡 <span className="font-bold">Coach Tip:</span> {BREAKOUT_LESSONS[breakoutLevel - 1].hint}
                  </div>

                  <div className="space-y-2 pt-2">
                    {BREAKOUT_LESSONS[breakoutLevel - 1].options.map((option, idx) => {
                      let btnStyle = 'bg-white/5 border-white/10 hover:border-white/30 text-white';
                      if (breakoutSubmitted) {
                        if (idx === BREAKOUT_LESSONS[breakoutLevel - 1].correctIdx) {
                          btnStyle = 'bg-green-500/20 border-green-500 text-green-400 font-bold';
                        } else if (idx === selectedBreakoutOption) {
                          btnStyle = 'bg-red-500/20 border-red-500 text-red-400';
                        } else {
                          btnStyle = 'bg-white/5 border-white/10 opacity-30';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={breakoutSubmitted}
                          onClick={() => submitBreakout(idx)}
                          className={`w-full p-3 rounded-xl border text-left text-xs md:text-sm transition-all cursor-pointer ${btnStyle}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {breakoutSubmitted && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleNextBreakoutLevel}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 transition-all animate-fade-in"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Next Puzzle (Level {breakoutLevel + 1})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniGames;
