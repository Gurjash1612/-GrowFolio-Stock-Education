// Programmatic generator for 1000+ distinct interactive gamified lessons/stages
// for the three mini-games: Candlestick Matcher, Breakout Lessons, and Match Predictor.

export interface MatcherLesson {
  id: number;
  name: string;
  description: string;
  shape: string;
  options: string[];
  correctIdx: number;
  timeframe: string;
  ticker: string;
  context: string;
}

export interface BreakoutLesson {
  id: number;
  title: string;
  question: string;
  hint: string;
  options: string[];
  correctIdx: number;
  rewardGold: number;
  rewardXp: number;
  chartPattern: string;
  ticker: string;
  timeframe: string;
}

export interface PredictorLesson {
  id: number;
  title: string;
  description: string;
  initialChart: number[];
  ticker: string;
  bias: 'up' | 'down'; // 'up' = bullish drift, 'down' = bearish drift
  correctPrediction: 'up' | 'down';
  setupType: string;
  rewardGold: number;
  rewardXp: number;
}

// 20 high-quality candlestick patterns as basis
const BASE_PATTERNS = [
  {
    name: 'Hammer Pattern',
    keyFeature: 'a small upper real body and a very long lower wick/shadow (at least twice the size of the body) with little or no upper shadow',
    shape: 'hammer',
    behavior: 'signals a strong bullish reversal after a downtrend as buyers successfully drove the price back up from its lows',
    options: ['Hammer Pattern', 'Shooting Star', 'Gravestone Doji', 'Bearish Engulfing'],
    correctIdx: 0
  },
  {
    name: 'Shooting Star',
    keyFeature: 'a small lower real body, a long upper wick/shadow (at least twice the size of the body), and almost no lower shadow',
    shape: 'shooting',
    behavior: 'indicates a bearish reversal at the top of an uptrend as buyers push price high but sellers aggressively reject the peak',
    options: ['Bullish Engulfing', 'Hammer Pattern', 'Shooting Star', 'Spinning Top'],
    correctIdx: 2
  },
  {
    name: 'Doji Star',
    keyFeature: 'virtually identical opening and closing prices, forming a tiny or non-existent body with small upper and lower shadows',
    shape: 'doji',
    behavior: 'signals extreme indecision and a state of complete equilibrium where neither bulls nor bears can secure control',
    options: ['Doji Star', 'Marubozu', 'Tweezer Bottom', 'Three Black Crows'],
    correctIdx: 0
  },
  {
    name: 'Bullish Engulfing',
    keyFeature: 'a large green real body that completely covers or engulfs the small red body of the previous trading period',
    shape: 'engulfing_bullish',
    behavior: 'demonstrates overwhelming buying pressure that completely swallows previous selling momentum, suggesting an upward reversal',
    options: ['Hanging Man', 'Bearish Harami', 'Bullish Engulfing', 'Doji Star'],
    correctIdx: 2
  },
  {
    name: 'Bearish Engulfing',
    keyFeature: 'a large red real body that completely covers or engulfs the small green body of the previous trading period',
    shape: 'engulfing_bearish',
    behavior: 'signals powerful selling pressure that completely overrides previous buying interest, indicating an impending downward slide',
    options: ['Bearish Engulfing', 'Morning Star', 'Dragonfly Doji', 'Hammer Pattern'],
    correctIdx: 0
  },
  {
    name: 'Inverted Hammer',
    keyFeature: 'a small lower body, a long upper wick, and almost no lower shadow, occurring specifically at the bottom of a downtrend',
    shape: 'inverted_hammer',
    behavior: 'shows an early surge in buying pressure, indicating that buyers are starting to test resistance even if sellers closed the gap slightly',
    options: ['Shooting Star', 'Inverted Hammer', 'Tweezer Top', 'Gravestone Doji'],
    correctIdx: 1
  },
  {
    name: 'Hanging Man',
    keyFeature: 'a small upper real body with a very long lower shadow, occurring specifically at the peak of an extended uptrend',
    shape: 'hanging_man',
    behavior: 'signals a bearish warning as significant selling pressure emerged during the period, even though buyers pushed it back before the close',
    options: ['Hammer Pattern', 'Morning Star', 'Hanging Man', 'Marubozu'],
    correctIdx: 2
  },
  {
    name: 'Marubozu (Green)',
    keyFeature: 'a long, full green body with completely flat ends, meaning it has zero upper or lower wicks',
    shape: 'marubozu_green',
    behavior: 'represents absolute, uninterrupted bullish dominance from the opening bell straight to the close of the period',
    options: ['Doji Star', 'Marubozu (Green)', 'Shooting Star', 'Tweezer Bottom'],
    correctIdx: 1
  },
  {
    name: 'Marubozu (Red)',
    keyFeature: 'a long, full red body with absolutely no upper or lower wicks/shadows',
    shape: 'marubozu_red',
    behavior: 'indicates complete, ruthless bearish control, with sellers driving the asset price down continuously throughout the session',
    options: ['Marubozu (Red)', 'Bullish Engulfing', 'Three White Soldiers', 'Hammer Pattern'],
    correctIdx: 0
  },
  {
    name: 'Dragonfly Doji',
    keyFeature: 'a T-shaped bar with a long lower shadow, no upper shadow, and the open, high, and close all at the absolute high of the session',
    shape: 'dragonfly',
    behavior: 'represents strong bullish resilience where sellers drove prices down heavily, but buyers forced a recovery back to the session high',
    options: ['Gravestone Doji', 'Spinning Top', 'Dragonfly Doji', 'Inverted Hammer'],
    correctIdx: 2
  },
  {
    name: 'Gravestone Doji',
    keyFeature: 'an inverted T-shaped bar with a long upper shadow, no lower shadow, and the open, low, and close all at the absolute session low',
    shape: 'gravestone',
    behavior: 'represents a bearish warning where buyers staged a major rally, but sellers completely crushed the move by the close of the period',
    options: ['Gravestone Doji', 'Doji Star', 'Hanging Man', 'Morning Star'],
    correctIdx: 0
  },
  {
    name: 'Spinning Top',
    keyFeature: 'a small real body centered between upper and lower shadows of roughly equal and moderate length',
    shape: 'spinning_top',
    behavior: 'indicates a period of consolidation or contraction where both buying and selling attempts were neutralized, representing market hesitation',
    options: ['Marubozu', 'Spinning Top', 'Hammer Pattern', 'Bullish Engulfing'],
    correctIdx: 1
  },
  {
    name: 'Tweezer Bottom',
    keyFeature: 'two consecutive candles with matching, identical absolute lows, where the first is typically red and the second is green',
    shape: 'tweezer_bottom',
    behavior: 'shows that a specific price level has been twice rejected as support, signaling a highly reliable bullish pivot point',
    options: ['Tweezer Top', 'Tweezer Bottom', 'Three White Soldiers', 'Bearish Engulfing'],
    correctIdx: 1
  },
  {
    name: 'Tweezer Top',
    keyFeature: 'two consecutive candles with matching, identical absolute highs, where the first is green and the second is red',
    shape: 'tweezer_top',
    behavior: 'demonstrates that a specific upper price ceiling has been twice rejected as resistance, signaling a strong bearish turning point',
    options: ['Tweezer Top', 'Hammer Pattern', 'Doji Star', 'Bullish Engulfing'],
    correctIdx: 0
  },
  {
    name: 'Three White Soldiers',
    keyFeature: 'three consecutive long green candles, each opening within the previous body and closing near the high of the session',
    shape: 'three_soldiers',
    behavior: 'indicates a powerful, sustained trend reversal from a bear market to a robust, institutional-backed bullish expansion',
    options: ['Three Black Crows', 'Three White Soldiers', 'Marubozu', 'Morning Star'],
    correctIdx: 1
  },
  {
    name: 'Three Black Crows',
    keyFeature: 'three consecutive long red candles, each opening within the previous body and closing near the session low',
    shape: 'three_crows',
    behavior: 'signals a devastating and highly aggressive bearish breakdown, showing that major funds are liquidating their positions rapidly',
    options: ['Three Black Crows', 'Tweezer Top', 'Shooting Star', 'Hanging Man'],
    correctIdx: 0
  },
  {
    name: 'Morning Star',
    keyFeature: 'a long red candle, followed by a small-bodied star (red or green) that gaps down, and completed by a large green candle closing deep in the first candle\'s body',
    shape: 'morning_star',
    behavior: 'represents a three-period bullish reversal structure showing seller capitulation followed by a massive surge of new buying energy',
    options: ['Evening Star', 'Morning Star', 'Bullish Engulfing', 'Spinning Top'],
    correctIdx: 1
  },
  {
    name: 'Evening Star',
    keyFeature: 'a long green candle, followed by a small-bodied star that gaps up, and completed by a large red candle closing deep in the first candle\'s body',
    shape: 'evening_star',
    behavior: 'represents a three-period bearish reversal structure showing buyer exhaustion at a peak followed by aggressive distribution',
    options: ['Evening Star', 'Three Black Crows', 'Gravestone Doji', 'Hanging Man'],
    correctIdx: 0
  },
  {
    name: 'Bullish Harami',
    keyFeature: 'a small green body on the second day that is entirely contained within the massive red body of the previous trading day',
    shape: 'harami_bullish',
    behavior: 'indicates that selling pressure has suddenly paused or dried up, suggesting that a potential trend reversal is consolidating',
    options: ['Bearish Harami', 'Bullish Harami', 'Tweezer Bottom', 'Doji Star'],
    correctIdx: 1
  },
  {
    name: 'Bearish Harami',
    keyFeature: 'a small red body on the second day that is entirely contained within the massive green body of the previous trading day',
    shape: 'harami_bearish',
    behavior: 'indicates that buying momentum has stalled abruptly, suggesting the market is preparing for a distribution or pullback phase',
    options: ['Bearish Harami', 'Bullish Harami', 'Shooting Star', 'Tweezer Top'],
    correctIdx: 0
  }
];

// Generate 1050 Candlestick Matcher Lessons
export function generateMatcherLessons(): MatcherLesson[] {
  const lessons: MatcherLesson[] = [];
  const tickers = ["AAPL", "TSLA", "BTC/USD", "MSFT", "NVDA", "ETH/USD", "AMZN", "GOOGL", "NFLX", "AMD", "SPY", "QQQ", "COIN", "META", "JPM", "DIS"];
  const timeframes = ["5-Minute", "15-Minute", "1-Hour", "4-Hour", "Daily", "Weekly"];
  const contexts = [
    "directly at a critical 200-period EMA moving average line",
    "following a severe 12% multi-day corrective pullback",
    "forming right against a major horizontal support floor",
    "on significantly expanding volume following a quiet squeeze",
    "accompanied by an oversold RSI reading on the oscillator",
    "right at the lower channel boundary of an ascending regression channel",
    "after a rapid, vertical parabolic rally to local overhead supply",
    "colliding with a psychological round-number pricing barrier",
    "within an active Bollinger Band squeeze, signaling a volatility expansion",
    "at the key 61.8% Fibonacci retracement ratio node"
  ];

  for (let i = 1; i <= 1050; i++) {
    const base = BASE_PATTERNS[(i - 1) % BASE_PATTERNS.length];
    const ticker = tickers[i % tickers.length];
    const timeframe = timeframes[(i * 3) % timeframes.length];
    const context = contexts[(i * 7) % contexts.length];

    const description = `On the ${ticker} ${timeframe} chart, the price action is displaying ${base.keyFeature}, ${context}. This specific structure ${base.behavior}. Based on these technical factors, identify the correct candlestick pattern:`;

    lessons.push({
      id: i,
      name: base.name,
      description,
      shape: base.shape,
      options: base.options,
      correctIdx: base.correctIdx,
      timeframe,
      ticker,
      context
    });
  }

  return lessons;
}


// 15 high-quality breakout formations as basis
const BASE_BREAKOUTS = [
  {
    title: 'Symmetrical Triangle Breakout',
    question: 'Price is consolidating, printing higher lows and lower highs converging. Suddenly, a massive bullish volume spike registers at the apex. What is the most probable outcome?',
    hint: 'Symmetrical triangles represent a major volatility squeeze. High-volume breakouts in the trend direction tend to follow the volume spike.',
    options: ['Bullish Breakout Upwards', 'Bearish Breakdown Downwards', 'Lateral Sideways Consolidation'],
    correctIdx: 0,
    chartPattern: 'triangle'
  },
  {
    title: 'Double Bottom Neckline Breakout',
    question: 'The asset has twice tested a psychological floor of $100 and bounced. It is now trading right at the intermediate peak of $115 (the Neckline) on extreme buying volume. What is the next major target?',
    hint: 'A Double Bottom is completed when price breaks above the neckline. The measured target is the depth of the pattern ($15) added to the breakout point ($130).',
    options: ['Bearish Crash to $85', 'Bullish Breakout to $130+', 'Sideways range trade between $100 and $115'],
    correctIdx: 1,
    chartPattern: 'double_bottom'
  },
  {
    title: 'Rising Wedge Breakdown',
    question: 'The price is grinding upwards within converging trendlines (higher highs and much steeper higher lows) while trading volume is steadily declining. RSI shows a strong bearish divergence. What is the breakdown risk?',
    hint: 'A rising wedge is a bearish distribution pattern. The converging support line is highly fragile, especially on low volume, signaling exhaustion.',
    options: ['Parabolic Bullish Continuation', 'Bearish Breakdown Below Lower Support', 'Infinite Consolidation at the Apex'],
    correctIdx: 1,
    chartPattern: 'wedge_rising'
  },
  {
    title: 'Head and Shoulders Breakdown',
    question: 'A clear three-peak structure has formed: Left Shoulder ($150), Head ($165), Right Shoulder ($148). The price is now collapsing through the neckline support at $140 with heavy volume. What is the bias?',
    hint: 'The Head and Shoulders is a primary trend reversal pattern. A breakdown below the neckline on high volume confirms a bearish trend change.',
    options: ['Bearish Breakdown & Acceleration Downward', 'Bullish Trap & Immediate Reversal Upward', 'A flat trading channel for the next month'],
    correctIdx: 0,
    chartPattern: 'head_shoulders'
  },
  {
    title: 'Bullish Flag Continuation',
    question: 'After a vertical 25% price surge (Flagpole), the stock is drifting slightly downwards in a tight, parallel downward-sloping channel (Flag). Volume has dried up to a minimum. What is the classical entry trigger?',
    hint: 'Bull flags are bullish continuation setups. The entry is triggered when price breaks above the upper boundary of the flag on expanding volume.',
    options: ['Short selling when price hits the lower channel', 'Buying the bullish breakout above the upper flag line', 'Waiting for a complete return to the flagpole base'],
    correctIdx: 1,
    chartPattern: 'bullish_flag'
  },
  {
    title: 'Cup and Handle Squeeze',
    question: 'A long, rounded U-shaped base (Cup) is followed by a brief 5% consolidation pullback (Handle). Price is now testing the lip line resistance. What does this configuration tell us about the market equilibrium?',
    hint: 'The cup & handle shows long-term accumulation. The handle is a shakeout of weak hands before buyers trigger a major breakout.',
    options: ['Severe bearish exhaustion leading to a collapse', 'Bullish breakout above lip resistance', 'Complete lack of market interest'],
    correctIdx: 1,
    chartPattern: 'cup_handle'
  },
  {
    title: 'Double Top Rejection',
    question: 'The asset rallied to $250, pulled back to $225, and rallied again to $250 where it was rejected on low buying volume. It is now approaching the $225 support line. What indicates a double top confirmation?',
    hint: 'A Double Top is a bearish reversal pattern. It is confirmed ONLY when the price breaks below the central valley support (neckline) at $225.',
    options: ['The rejection at $250 is sufficient confirmation', 'Price breaking down cleanly below $225', 'An increase in buying volume at $230'],
    correctIdx: 1,
    chartPattern: 'double_top'
  },
  {
    title: 'Ascending Triangle Accumulation',
    question: 'Price is repeatedly bouncing off a horizontal resistance line at $50, while printing higher and higher lows along an ascending trendline. Volume is shrinking. What are the buyers doing?',
    hint: 'An ascending triangle indicates aggressive accumulation. Buyers are willing to buy at higher prices, pressing the sellers at $50.',
    options: ['Bulls are accumulating, leading to an upward breakout', 'Bears are distributing, leading to a massive dump', 'Traders are leaving the asset completely'],
    correctIdx: 0,
    chartPattern: 'triangle_ascending'
  },
  {
    title: 'Falling Wedge Bullish Reversal',
    question: 'An asset is sliding downwards within a converging channel (lower lows and much steeper lower highs) while volume is declining. Price is testing the upper wedge line. What is the bias?',
    hint: 'A falling wedge is a bullish pattern. The converging lines show sellers are losing momentum, making an upside breakout highly likely.',
    options: ['Sustained bearish breakdown downward', 'Bullish breakout above upper resistance', 'Flat, sideways consolidation forever'],
    correctIdx: 1,
    chartPattern: 'wedge_falling'
  },
  {
    title: 'Bear Flag Breakdown',
    question: 'Following a sharp, near-vertical 30% drop (Flagpole), the price begins a light, low-volume upward-sloping channel (Flag). Price is now resting on the flag\'s lower support. What is the risk?',
    hint: 'A bear flag is a bearish continuation pattern. A breakdown below the lower flag boundary on volume signals a continuation of the sell-off.',
    options: ['A full bullish recovery back to flagpole highs', 'Bearish breakdown and continuation of the crash', 'Complete lack of volatility in the near future'],
    correctIdx: 1,
    chartPattern: 'bear_flag'
  }
];

// Generate 1050 Breakout Lessons
export function generateBreakoutLessons(): BreakoutLesson[] {
  const lessons: BreakoutLesson[] = [];
  const tickers = ["AAPL", "TSLA", "BTC/USD", "MSFT", "NVDA", "ETH/USD", "AMZN", "GOOGL", "NFLX", "AMD", "SPY", "QQQ", "COIN", "META", "JPM", "DIS"];
  const timeframes = ["15-Minute", "30-Minute", "1-Hour", "4-Hour", "Daily", "Weekly"];

  for (let i = 1; i <= 1050; i++) {
    const base = BASE_BREAKOUTS[(i - 1) % BASE_BREAKOUTS.length];
    const ticker = tickers[i % tickers.length];
    const timeframe = timeframes[(i * 2) % timeframes.length];

    // Create a unique question by injecting ticker & timeframe
    const uniqueQuestion = `[Level ${i}] On the ${ticker} ${timeframe} chart: ${base.question}`;
    const uniqueTitle = `Level ${i}: ${base.title}`;

    lessons.push({
      id: i,
      title: uniqueTitle,
      question: uniqueQuestion,
      hint: base.hint,
      options: base.options,
      correctIdx: base.correctIdx,
      rewardGold: 50 + (i % 5) * 10,
      rewardXp: 120 + (i % 4) * 20,
      chartPattern: base.chartPattern,
      ticker,
      timeframe
    });
  }

  return lessons;
}


// 12 core setup configurations for Market Predictor Stages
const BASE_PREDICTORS = [
  {
    title: 'Bullish Support Bounce',
    setupType: 'Support Bounce',
    description: 'The asset has pulled back to its key horizontal support. Sellers are exhausted, and a strong green candle has just completed. Forecast if the price will reclaim its high or collapse.',
    initialChart: [105, 102, 100, 99, 100, 102],
    bias: 'up' as const,
    correctPrediction: 'up' as const
  },
  {
    title: 'Bearish Resistance Rejection',
    setupType: 'Resistance Reject',
    description: 'The asset has rallied rapidly to a historical double-top resistance ceiling. Momentum oscillators are severely overbought. Predict the upcoming distribution pullback.',
    initialChart: [96, 101, 103, 104, 104, 102],
    bias: 'down' as const,
    correctPrediction: 'down' as const
  },
  {
    title: 'Bullish EMA Golden Cross',
    setupType: 'Golden Cross',
    description: 'The short-term exponential moving average (9 EMA) has crossed cleanly above the long-term 50 EMA on heavy institutional volume. The trend is accelerating.',
    initialChart: [97, 98, 99, 101, 102, 103],
    bias: 'up' as const,
    correctPrediction: 'up' as const
  },
  {
    title: 'Bearish Moving Average Death Cross',
    setupType: 'Death Cross',
    description: 'A major technical breakdown is unfolding as the short-term trendline crosses below the multi-month baseline. High volume is registering on the downside.',
    initialChart: [104, 103, 101, 100, 99, 97],
    bias: 'down' as const,
    correctPrediction: 'down' as const
  },
  {
    title: 'Bullish Flag Breakout Squeeze',
    setupType: 'Bull Flag Squeeze',
    description: 'A brief parallel consolidation flag has just registered an upside breakout candle on high volume. Short sellers are scrambling to cover their positions.',
    initialChart: [92, 101, 100, 99, 100, 102],
    bias: 'up' as const,
    correctPrediction: 'up' as const
  },
  {
    title: 'Bearish Head & Shoulders Breakdown',
    setupType: 'H&S Breakdown',
    description: 'The head and shoulders pattern has broken below the neckline on expanding volume. A cascading liquidating sell-off is highly likely.',
    initialChart: [102, 104, 105, 103, 101, 98],
    bias: 'down' as const,
    correctPrediction: 'down' as const
  },
  {
    title: 'Bullish Divergence Oversold Bounce',
    setupType: 'Bullish Divergence',
    description: 'While price action printed a lower low, the RSI momentum oscillator printed a clear higher low. Sellers are losing strength at these levels.',
    initialChart: [103, 101, 99, 98, 98, 100],
    bias: 'up' as const,
    correctPrediction: 'up' as const
  },
  {
    title: 'Bearish Divergence Exhaustion Peak',
    setupType: 'Bearish Divergence',
    description: 'The asset has printed a minor new high, but momentum indicators failed to confirm, displaying a steep downwards slope. The rally is running on fumes.',
    initialChart: [98, 100, 102, 103, 104, 103],
    bias: 'down' as const,
    correctPrediction: 'down' as const
  },
  {
    title: 'Bullish Symmetrical Apex Breakout',
    setupType: 'Apex Squeeze',
    description: 'The symmetrical triangle consolidation has reached its absolute apex. Buying orders are stacking up in the order book. Predict the breakout outcome.',
    initialChart: [99, 101, 100, 101, 100, 102],
    bias: 'up' as const,
    correctPrediction: 'up' as const
  },
  {
    title: 'Bearish Descending Squeeze Collapse',
    setupType: 'Descending Breakdown',
    description: 'Sellers are continuously forcing lower highs while pressing against a horizontal support line. The floor is weakening under repeated attacks.',
    initialChart: [103, 101, 101, 100, 100, 98],
    bias: 'down' as const,
    correctPrediction: 'down' as const
  },
  {
    title: 'Bullish Oversold Gap Fill',
    setupType: 'Gap Fill Bounce',
    description: 'An aggressive morning gap-down has pushed the price to deep oversold territory. The gap acts as a vacuum pulling price action back upwards.',
    initialChart: [108, 106, 96, 95, 96, 98],
    bias: 'up' as const,
    correctPrediction: 'up' as const
  },
  {
    title: 'Bearish Overbought Climax Rejection',
    setupType: 'Buying Climax',
    description: 'A massive, unsustainable parabolic spike has registered on astronomical volume. No new institutional buyers are left to support these levels.',
    initialChart: [90, 93, 98, 104, 108, 106],
    bias: 'down' as const,
    correctPrediction: 'down' as const
  }
];

// Generate 1050 Match Predictor Lessons
export function generatePredictorLessons(): PredictorLesson[] {
  const lessons: PredictorLesson[] = [];
  const tickers = ["AAPL", "TSLA", "BTC/USD", "MSFT", "NVDA", "ETH/USD", "AMZN", "GOOGL", "NFLX", "AMD", "SPY", "QQQ", "COIN", "META", "JPM", "DIS"];

  for (let i = 1; i <= 1050; i++) {
    const base = BASE_PREDICTORS[(i - 1) % BASE_PREDICTORS.length];
    const ticker = tickers[i % tickers.length];

    const uniqueTitle = `Stage ${i}: ${ticker} ${base.setupType}`;
    const uniqueDesc = `[Stage ${i}] ${base.description} Can you correctly analyze this ${ticker} chart trend setup?`;

    // Dynamic starting chart shift based on index to keep every single stage fresh!
    const chartOffset = (i % 10) - 5; // shifts starting prices slightly
    const customInitialChart = base.initialChart.map(price => price + chartOffset);

    lessons.push({
      id: i,
      title: uniqueTitle,
      description: uniqueDesc,
      initialChart: customInitialChart,
      ticker,
      bias: base.bias,
      correctPrediction: base.correctPrediction,
      setupType: base.setupType,
      rewardGold: 45 + (i % 6) * 10,
      rewardXp: 100 + (i % 5) * 15
    });
  }

  return lessons;
}
