export interface LessonQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  levelNum: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  description: string;
  slides: string[];
  quizQuestion: string;
  quizOptions: string[];
  correctAnswerIndex: number;
  questions: LessonQuestion[];
  xpReward: number;
  goldReward: number;
}

// 10 core tracks of the curriculum
export const CURRICULUM_TRACKS = [
  {
    name: "Market Fundamentals",
    concepts: ["Bid/Ask Spread", "Order Book Liquidity", "Market Capitalization", "Stock Exchanges", "Dividends & Yields", "Stock Splits", "IPOs & Listings", "Share Buybacks", "Penny Stocks vs Blue Chips", "ETFs & Mutual Funds"],
    desc: "Master the building blocks of financial markets, asset types, and basic exchange mechanisms."
  },
  {
    name: "Technical Indicators",
    concepts: ["Simple Moving Averages (SMA)", "Exponential Moving Averages (EMA)", "Relative Strength Index (RSI)", "MACD Indicator", "Bollinger Bands", "Stochastic Oscillator", "Average True Range (ATR)", "Volume Profile", "VWAP", "Ichimoku Cloud"],
    desc: "Learn to apply advanced mathematical overlays on price charts to detect trends and momentum."
  },
  {
    name: "Price Chart Patterns",
    concepts: ["Support & Resistance Floors", "Trendline Channels", "Double Tops & Bottoms", "Head & Shoulders Patterns", "Bullish & Bearish Flags", "Symmetrical & Ascending Triangles", "Falling & Rising Wedges", "Cup & Handle Formations", "Market Gaps & Fills", "Fibonacci Retracements"],
    desc: "Discover the recurring geometric formations in price charts that reveal buyer and seller footprints."
  },
  {
    name: "Fundamental Analysis",
    concepts: ["Reading Balance Sheets", "Income Statement Analysis", "Cash Flow Statements", "Price-to-Earnings (P/E) Ratio", "Price-to-Book (P/B) Ratio", "Debt-to-Equity Metrics", "Earnings Per Share (EPS)", "PEG Ratio Valuation", "Operating Margin Analysis", "Free Cash Flow Valuation"],
    desc: "Evaluate the real financial health, earnings, and intrinsic value of underlying corporations."
  },
  {
    name: "Macroeconomics",
    concepts: ["Inflation & Purchasing Power", "Federal Funds Interest Rate", "GDP and Economic Cycles", "CPI Inflation Data", "Yield Curve Inversion", "Quantitative Easing & Tightening", "Employment Reports & Non-Farm Payrolls", "Fiscal vs Monetary Policy", "Global Currency Fluctuations", "Commodity Inflation & Oil"],
    desc: "Analyze how central banks, interest rates, inflation, and global economies influence stock prices."
  },
  {
    name: "Trading Strategies",
    concepts: ["Day Trading Mechanics", "Swing Trading Principles", "Scalping Volatility", "Position Long-Term Holding", "Momentum Trend Following", "Breakout Trading Entry", "Mean Reversion Arbitrage", "Gap & Go Strategies", "Short Selling Operations", "Trend Reversal Confirmation"],
    desc: "Formulate systematic execution plans, trade types, and holding periods to target market inefficiencies."
  },
  {
    name: "Options & Derivatives",
    concepts: ["Intro to Call Options", "Intro to Put Options", "Strike Price & Expirations", "Delta & Option Sensitivity", "Theta Option Time Decay", "Covered Call Income Generation", "Cash-Secured Put Buying", "Credit Spreads", "Iron Condor Strategies", "Futures & Leverage Contracts"],
    desc: "Unlock the high-leverage world of options, underlying contracts, risk Greeks, and hedging."
  },
  {
    name: "Trading Psychology",
    concepts: ["Overcoming FOMO Traps", "Loss Aversion & Cutting Losses", "Preventing Revenge Trading", "Overtrading Pitfalls", "Confirmation Bias in Research", "Risk Tolerance Profiles", "Maintaining a Trade Log", "Position Sizing Math", "Stop-Loss Execution Discipline", "Sticking to the Trade Plan"],
    desc: "Conquer the emotional battlegrounds of fear, greed, and ego to maintain flawless execution discipline."
  },
  {
    name: "Sectors & Industries",
    concepts: ["Technology & Software Sectors", "Healthcare & Biotech Stocks", "Financials & Banking Systems", "Energy & Oil Infrastructure", "Consumer Discretionary Markets", "Utilities & Dividend Stocks", "Defensive vs Cyclical Strategy", "REITs & Real Estate Stocks", "Industrial Sector Mechanics", "Sector Rotation Principles"],
    desc: "Navigate the 11 major stock market sectors and learn to rotate capital as business cycles rotate."
  },
  {
    name: "Advanced Market Mechanics",
    concepts: ["Dark Pools & Institutional Block Trading", "High-Frequency Trading (HFT)", "Market Maker Liquidity", "Payment for Order Flow (PFOF)", "Anatomy of a Short Squeeze", "Margin Loans & Leverage Caps", "Options Market Arbitrage", "The VIX Volatility Index", "Stock Borrow Rates", "Algorithmic Order Types"],
    desc: "Go behind the scenes of high-frequency execution, institutional routing, margin, and order flow."
  }
];

// Generates the metadata for all 1000 lessons
export function generateLessonsList(): { id: string; levelNum: number; level: 'beginner' | 'intermediate' | 'advanced'; title: string; description: string; trackName: string }[] {
  const list = [];
  for (let i = 1; i <= 1000; i++) {
    let level: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (i > 300 && i <= 700) {
      level = 'intermediate';
    } else if (i > 700) {
      level = 'advanced';
    }

    const trackIndex = (i - 1) % 10;
    const track = CURRICULUM_TRACKS[trackIndex];
    
    // Pick the concept index based on level division
    const conceptIndex = Math.floor((i - 1) / 10) % track.concepts.length;
    const concept = track.concepts[conceptIndex];
    
    list.push({
      id: `level-${i}`,
      levelNum: i,
      level,
      title: `Level ${i}: ${concept}`,
      description: `Master the foundational and advanced elements of ${concept} within our specialized ${track.name} curriculum.`,
      trackName: track.name
    });
  }
  return list;
}

// Generate templates for each track
const TRACK_TEMPLATES: Record<number, { question: string; options: string[]; correctAnswerIndex: number; explanation: string }[]> = {
  // 0: Market Fundamentals
  0: [
    {
      question: "What is the core purpose of {{concept}}?",
      options: [
        "To guarantee that every market participant makes a risk-free 10% profit daily",
        "To establish a clear structural framework or asset type that coordinates how shares are traded and valued",
        "To allow companies to hide their financial statements from regulators",
        "To completely eliminate standard taxes for high-volume retail accounts"
      ],
      correctAnswerIndex: 1,
      explanation: "{{concept}} is essential because it structures how securities are categorized, processed, and fairly priced in public exchanges."
    },
    {
      question: "How does {{concept}} directly benefit an educated investor?",
      options: [
        "It provides a magical formula to predict exactly which stock will rise tomorrow",
        "It helps evaluate relative value, liquidity levels, and structural mechanics to avoid bad trades",
        "It exempts the investor from all capital loss limits",
        "It automatically connects them to direct institutional block trades"
      ],
      correctAnswerIndex: 1,
      explanation: "Understanding {{concept}} gives you the analytical tools to assess corporate size, share liquidity, and the transaction mechanics behind stock price moves."
    },
    {
      question: "Which is a common misconception regarding {{concept}}?",
      options: [
        "That it is closely monitored by federal regulatory agencies",
        "That it remains completely fixed and never shifts over the trading day",
        "That it can be influenced by corporate announcements or broad market demand",
        "That both retail and institutional traders use it as a foundational metric"
      ],
      correctAnswerIndex: 1,
      explanation: "A key misconception is that {{concept}} is static; in reality, it adjusts dynamically with every trade, order placement, or public announcement."
    },
    {
      question: "When researching {{concept}}, a professional analyst will prioritize:",
      options: [
        "Vague rumors shared on social media message boards",
        "Verified filings, official exchange reports, and historical data streams",
        "Unregulated advisory sites promising 100% win rates",
        "The absolute lowest-priced stocks regardless of corporate health"
      ],
      correctAnswerIndex: 1,
      explanation: "Evaluating {{concept}} requires high-quality, auditable financial records, official SEC filings, and reliable price feeds rather than speculative rumors."
    },
    {
      question: "How does high market volatility impact {{concept}}?",
      options: [
        "It can cause rapid fluctuations, wide price spreads, and quick shifts in total market values",
        "It freezes all transaction logs on public exchanges immediately",
        "It makes all stock option contracts completely worthless",
        "It guarantees that stock splits will be announced within 24 hours"
      ],
      correctAnswerIndex: 0,
      explanation: "High volatility creates rapid variations in buyer/seller alignment, which directly translates to quick shifts in metrics associated with {{concept}}."
    },
    {
      question: "If a company undergoes a major structural shift, how does it affect {{concept}}?",
      options: [
        "The company is immediately forced to liquidate all physical assets",
        "The metric updates dynamically to reflect the new share count, corporate valuation, or trading parameters",
        "The ticker symbol is permanently locked and cannot be traded again",
        "Brokers must refund all transaction fees to active shareholders"
      ],
      correctAnswerIndex: 1,
      explanation: "Corporate actions like mergers, splits, or share buybacks directly adjust the share architecture, immediately updating values related to {{concept}}."
    },
    {
      question: "Why do institutional block traders closely watch {{concept}}?",
      options: [
        "Because it dictates the physical weight of printed stock certs",
        "To gauge order routing depth and execute massive positions without causing massive price slippage",
        "Because they are legally required to buy the entire order book",
        "To bypass the daily volume caps set by the Federal Reserve"
      ],
      correctAnswerIndex: 1,
      explanation: "For large institutions, tracking {{concept}} is critical to evaluate trade execution speed and minimize market impact when buying or selling millions of shares."
    },
    {
      question: "In what way does {{concept}} relate to corporate liquidity?",
      options: [
        "It represents the total volume of liquid cash assets in the company's vault",
        "It directly affects how easily and cheaply you can enter or exit a stock position in the open market",
        "It refers only to companies that sell beverage or chemical products",
        "It indicates the speed of the stock exchange's data centers"
      ],
      correctAnswerIndex: 1,
      explanation: "Liquidity is heavily tied to {{concept}} because it dictates the density of active buy and sell orders, reducing bid-ask friction for retail traders."
    },
    {
      question: "Which of the following is true about how {{concept}} behaves across different sectors?",
      options: [
        "It remains identical for every single stock regardless of industry",
        "It exhibits distinct characteristics depending on sector growth, utility cash flow, or capital requirements",
        "It is only relevant for technology companies and completely ignored in energy",
        "It is determined entirely by a central sector council"
      ],
      correctAnswerIndex: 1,
      explanation: "Different sectors (such as Tech vs. Utilities) show completely different behaviors regarding {{concept}} due to varying cash flows, share counts, and investor demographics."
    },
    {
      question: "What is a primary risk of trading assets with highly unstable {{concept}}?",
      options: [
        "Your broker account being permanently deleted by regulators",
        "Experiencing extreme price slippage, wide bid-ask spreads, and difficulty exiting a losing position",
        "Being forced to work physically at the stock exchange",
        "Paying elevated capital gains tax on losing trades"
      ],
      correctAnswerIndex: 1,
      explanation: "An unstable or low-depth structure leads to illiquidity, making it incredibly risky because you may not find a buyer when you want to cut your losses."
    }
  ],

  // 1: Technical Indicators
  1: [
    {
      question: "What is the primary objective of applying {{concept}} to a price chart?",
      options: [
        "To guarantee that a stock price will never fall below the indicator line",
        "To filter out short-term price noise and identify trends or potential momentum shifts",
        "To calculate the exact fair book value of a company's physical equipment",
        "To bypass the need for any risk management or stop-loss orders"
      ],
      correctAnswerIndex: 1,
      explanation: "Technical indicators like {{concept}} are mathematical calculations based on price, volume, or open interest used to spot market trends, support/resistance, and momentum."
    },
    {
      question: "If {{concept}} exhibits a sudden bullish crossover or divergence, what is the typical implication?",
      options: [
        "That the company is about to file for bankruptcy",
        "That buying momentum is strengthening, suggesting a potential upward price trend",
        "That the stock exchanges are closed for standard trading",
        "That the stock has reached an absolute permanent ceiling"
      ],
      correctAnswerIndex: 1,
      explanation: "A bullish crossover or positive divergence in {{concept}} indicates that buying pressure is accelerating relative to price, suggesting an upward bias."
    },
    {
      question: "Which of the following describes a critical limitation of {{concept}}?",
      options: [
        "It can generate false signals or 'whipsaws' in choppy, range-bound (sideways) markets",
        "It can only be computed on monthly charts and is useless for daily charts",
        "It requires direct approval from the Security and Exchange Commission to use on a chart",
        "It is highly illegal for retail traders to view on public charting platforms"
      ],
      correctAnswerIndex: 0,
      explanation: "indicators like {{concept}} excel in strong trends but often generate frustrating false signals in congested, choppy, or sideways-trading ranges."
    },
    {
      question: "How should a trader interpret a 'divergence' between the price and {{concept}}?",
      options: [
        "As a technical glitch in the charting software that should be ignored",
        "As a sign that the current trend is losing steam and a price reversal may be near",
        "As a guarantee that a major dividend payment is about to be issued",
        "As proof that the stock is being permanently suspended from trading"
      ],
      correctAnswerIndex: 1,
      explanation: "Divergence occurs when price makes a new high but the indicator fails to do so, suggesting the underlying momentum is weakening and a reversal could occur."
    },
    {
      question: "In technical analysis, why is {{concept}} considered a 'lagging' indicator?",
      options: [
        "Because it causes your computer and trading software to run slowly",
        "Because it is derived from past price action, confirming trends rather than predicting them in advance",
        "Because it is only updated once per week on Friday close",
        "Because it is exclusively used by slow-acting retail investors"
      ],
      correctAnswerIndex: 1,
      explanation: "Indicators based on moving historical data are 'lagging' because they follow price action, helping to confirm established trends rather than predicting turning points."
    },
    {
      question: "In a powerful, accelerating uptrend, how does price typically interact with {{concept}}?",
      options: [
        "It continuously oscillates below the lower bounds of the indicator",
        "It generally trades above or repeatedly bounces off the indicator line as dynamic support",
        "It stays locked at exactly the same price decimal point for days",
        "It moves in the exact opposite direction of the indicator line"
      ],
      correctAnswerIndex: 1,
      explanation: "In an uptrend, {{concept}} often acts as dynamic support, with pullbacks finding buyers near the indicator line before continuing upward."
    },
    {
      question: "If {{concept}} reaches an extreme overbought or upper threshold, what is a disciplined response?",
      options: [
        "To immediately buy maximum shares with high leverage because the stock is invincible",
        "To exercise caution, as the momentum might be overextended and a cooling pullback is highly probable",
        "To immediately short the stock with your entire portfolio without waiting for confirmation",
        "To ignore the indicator since indicators do not apply to overextended stocks"
      ],
      correctAnswerIndex: 1,
      explanation: "An overbought reading suggests buying pressure has been intense and fast. It doesn't mean a crash is guaranteed, but the risk-to-reward ratio for new buys is poor."
    },
    {
      question: "What is the advantage of adjusting the time period settings of {{concept}}?",
      options: [
        "Shorter periods increase sensitivity to capture quick moves, while longer periods smooth out noise to show macro trends",
        "Shorter periods guarantee 100% accurate trade entries with zero drawdowns",
        "Longer periods allow you to skip paying capital gains taxes on your trades",
        "It lets you trade stocks outside of standard market hours"
      ],
      correctAnswerIndex: 0,
      explanation: "Adjusting settings shifts the balance: short periods give fast but noisy signals; long periods give reliable but delayed trend indicators."
    },
    {
      question: "Why do traders frequently combine {{concept}} with volume analysis?",
      options: [
        "Because using single indicators is strictly prohibited by stock exchanges",
        "To confirm whether price moves have strong institutional backing (high volume) or are weak and speculative",
        "To double the gold coins rewarded by the brokerage platform",
        "To hide their entry orders from automated market makers"
      ],
      correctAnswerIndex: 1,
      explanation: "Volume represents the fuel. A price breakout confirmed by volume and {{concept}} is far more reliable than one on low volume."
    },
    {
      question: "What is a primary danger of 'indicator overload' (adding too many indicators including {{concept}})?",
      options: [
        "It triggers an automatic suspension of your brokerage account",
        "It causes 'analysis paralysis' due to conflicting signals, leading to hesitation and poor execution",
        "It makes all stock charts load in black and white",
        "It forces you to pay double trading commissions to your broker"
      ],
      correctAnswerIndex: 1,
      explanation: "Using too many indicators can cause them to contradict each other, leading to confusion, late entries, or missing trades completely due to lack of clarity."
    }
  ],

  // 2: Price Chart Patterns
  2: [
    {
      question: "In technical analysis, how is {{concept}} best defined?",
      options: [
        "A highly illegal way to manipulate stock prices on a chart",
        "A distinct geometric configuration of price action that signals potential trend continuation or trend reversal",
        "A secret code embedded in charts by corporate management",
        "A random drawings made by computer glitches"
      ],
      correctAnswerIndex: 1,
      explanation: "Price chart patterns like {{concept}} represent visual consensus among buyers and sellers, helping to project future supply-and-demand shifts."
    },
    {
      question: "Why do market technicians look for {{concept}} on a chart?",
      options: [
        "To identify precise price levels where supply and demand are likely to pivot, providing clear entry and exit targets",
        "To secure guaranteed daily returns without any risk of capital loss",
        "To determine if a company's CEO is going to resign",
        "To bypass the need to verify how many shares they are purchasing"
      ],
      correctAnswerIndex: 0,
      explanation: "{{concept}} establishes clear price boundaries where the balance of power between bulls and bears is likely to shift, providing risk-managed trading setups."
    },
    {
      question: "Which of the following typically invalidates the pattern known as {{concept}}?",
      options: [
        "If the stock pays out a dividend during the pattern formation",
        "If price breaks cleanly through the defined boundary line in the opposite direction of the expected move",
        "If the stock is traded on a Tuesday instead of a Monday",
        "If a retail investor buys less than 10 shares"
      ],
      correctAnswerIndex: 1,
      explanation: "A pattern is invalidated if price breaks out in the wrong direction, indicating that the supply/demand thesis has failed and the pattern has broken down."
    },
    {
      question: "How should a disciplined trader manage risk when executing a trade based on {{concept}}?",
      options: [
        "By investing their entire account balance on a single trade without a stop-loss",
        "By placing a strict stop-loss order just outside the invalidation level of the pattern",
        "By waiting until the stock price reaches zero before exiting a failing position",
        "By calling the stock exchange to cancel their orders if the trade goes wrong"
      ],
      correctAnswerIndex: 1,
      explanation: "No pattern works 100% of the time. Placing a stop-loss just past the invalidation point ensures that a failed pattern results in only a small, managed loss."
    },
    {
      question: "What is meant by a 'measured move target' in relation to {{concept}}?",
      options: [
        "The distance from your computer monitor to your keyboard",
        "A price target projected by measuring the height of the pattern and adding or subtracting it from the breakout point",
        "The minimum volume of shares required to execute the trade",
        "A federally regulated profit ceiling that brokers must enforce"
      ],
      correctAnswerIndex: 1,
      explanation: "Technicians calculate profit targets by taking the height of the pattern (e.g. {{concept}}) and projecting that distance from the breakout point."
    },
    {
      question: "What does the 'neckline' or trigger line represent in {{concept}}?",
      options: [
        "The level where trading is permanently halted for the day",
        "The critical support or resistance line that must be broken to validate and activate the pattern",
        "The absolute lowest price the stock has ever reached in its history",
        "The average cost basis of the company's board of directors"
      ],
      correctAnswerIndex: 1,
      explanation: "The neckline or trigger boundary is the key line dividing a dormant pattern from an active breakout. Breaking it signals a trend shift."
    },
    {
      question: "Why is a breakout from {{concept}} on very low trading volume considered highly suspicious?",
      options: [
        "Because low volume breakouts are illegal under exchange regulations",
        "Because it suggests lack of institutional conviction, increasing the probability of a false breakout (bull or bear trap)",
        "Because low volume means the stock is being converted into a private asset",
        "Because it means brokers are charging double the commissions"
      ],
      correctAnswerIndex: 1,
      explanation: "High volume confirms institutional buying or selling power. Low volume suggests lack of interest, meaning the breakout can easily reverse and trap traders."
    },
    {
      question: "Which of the following best describes the difference between continuation and reversal patterns like {{concept}}?",
      options: [
        "Continuation patterns suggest the existing trend will resume, while reversal patterns suggest the current trend is ending and a new trend will begin in the opposite direction",
        "Continuation patterns can only be used by day traders, while reversal patterns are only for long-term investors",
        "Continuation patterns are always green, whereas reversal patterns are always red",
        "Continuation patterns do not require volume verification, but reversal patterns do"
      ],
      correctAnswerIndex: 0,
      explanation: "Continuation patterns (like flags) imply the market is pausing before resuming its trend. Reversals (like head & shoulders) signal a structural trend change."
    },
    {
      question: "How should a trader handle a 'pullback' or 'retest' of the breakout level of {{concept}}?",
      options: [
        "Panic-sell immediately, assuming the breakout was a complete failure",
        "Observe if the former resistance level flips to act as new support, which can offer a lower-risk entry opportunity",
        "Contact their broker to report a technical charting error",
        "Double their position size using maximum margin without waiting for confirmation"
      ],
      correctAnswerIndex: 1,
      explanation: "After a breakout, price often pulls back to retest the broken level. If the former resistance holds as support, it confirms the breakout strength and provides a clean entry."
    },
    {
      question: "Why do price patterns like {{concept}} recur on charts over decades across different assets?",
      options: [
        "Because they are programmed directly into stock exchanges by central banks",
        "Because they reflect the constant, repetitive nature of human psychology (fear, greed, and hope) in the market",
        "Because all companies are required by law to structure their stock price patterns",
        "Because retail investors coordinate their trades to draw specific shapes on charts"
      ],
      correctAnswerIndex: 1,
      explanation: "Human emotions and decision-making patterns don't change. Fear, greed, and bias create recurring visual footprints of supply and demand on charts."
    }
  ],

  // 3: Fundamental Analysis
  3: [
    {
      question: "What is the primary goal of performing Fundamental Analysis, specifically regarding {{concept}}?",
      options: [
        "To predict the exact minute-by-minute price movements of a stock",
        "To evaluate a company's real financial strength, profitability, and intrinsic value to see if a stock is under or overvalued",
        "To find geometric shapes like triangles and flags on a price chart",
        "To bypass the registration process of your brokerage account"
      ],
      correctAnswerIndex: 1,
      explanation: "Fundamental analysis focuses on economic factors, financial statements, and business metrics like {{concept}} to determine a company's fair intrinsic value."
    },
    {
      question: "Where can an investor find verified data about {{concept}}?",
      options: [
        "In anonymous chat rooms and social media hype channels",
        "In audited regulatory filings like Form 10-K (annual reports) and Form 10-Q (quarterly reports)",
        "By guessing based on the stock's daily price changes",
        "In private company emails obtained illegally"
      ],
      correctAnswerIndex: 1,
      explanation: "Public companies are legally required to file audited financial reports with the SEC, which are the gold standard for fundamental analysis metrics."
    },
    {
      question: "If a company has a highly favorable {{concept}} compared to its historical average and its competitors, what does this suggest?",
      options: [
        "The company is guaranteed to go bankrupt next month",
        "The stock may be undervalued or the company is operating with high financial efficiency",
        "The company is about to be forced to change its name",
        "The stock price will double exactly at the next market open"
      ],
      correctAnswerIndex: 1,
      explanation: "A strong, healthy metric in {{concept}} relative to peers indicates efficient operations, robust profitability, or a potentially attractive valuation."
    },
    {
      question: "Which of the following poses a major limitation when using {{concept}} in isolation?",
      options: [
        "It can be legally manipulated by retail stock buyers",
        "It doesn't capture qualitative aspects like management strength, pending lawsuits, or sudden technological shifts",
        "It can only be used to analyze utility stocks and is useless in tech",
        "It causes your trading software to slow down on weekends"
      ],
      correctAnswerIndex: 1,
      explanation: "No single metric paints a complete picture. Quantitative data like {{concept}} must be balanced with qualitative factors like corporate governance and competitive moat."
    },
    {
      question: "What is the difference between quantitative and qualitative fundamental metrics?",
      options: [
        "Quantitative metrics are hard numbers (like {{concept}}), while qualitative metrics are subjective values (like brand reputation or management quality)",
        "Quantitative metrics are only used by day traders, while qualitative are for swing traders",
        "Quantitative metrics are always negative, whereas qualitative are always positive",
        "Quantitative metrics are regulated by the Federal Reserve, while qualitative are not"
      ],
      correctAnswerIndex: 0,
      explanation: "Quantitative refers to measurable data from financial sheets, while qualitative refers to non-numeric attributes like company culture, brand power, and patents."
    },
    {
      question: "How does high corporate debt usually impact {{concept}}?",
      options: [
        "It makes the company completely immune to economic recessions",
        "It can increase financial risk, raise interest expenses, and potentially strain the metrics associated with corporate health",
        "It automatically forces a stock split to happen",
        "It increases the cash dividends paid out to retail investors"
      ],
      correctAnswerIndex: 1,
      explanation: "High debt creates high interest obligations. In downturns, this fixed expense can crush earnings, cash flows, and weaken fundamental metrics like {{concept}}."
    },
    {
      question: "Why should an investor compare {{concept}} across competitors within the SAME industry?",
      options: [
        "Because comparing metrics across completely different industries (like Software vs. Rail) is misleading due to different business models",
        "Because stock exchanges strictly forbid comparing stocks from different sectors",
        "Because all companies in the same industry have exactly the same stock price",
        "Because it is required to unlock advanced features in your brokerage app"
      ],
      correctAnswerIndex: 0,
      explanation: "Capital requirements, profit margins, and growth rates vary wildly by industry. Comparing a high-capex manufacturer to a low-capex software firm leads to flawed conclusions."
    },
    {
      question: "If a company shows a consistent year-over-year improvement in {{concept}}, what is this a sign of?",
      options: [
        "A technical software error on the brokerage server",
        "Growing operational efficiency, market share expansion, or stronger profitability",
        "An impending forced delisting from public exchanges",
        "That the company is paying zero taxes to the government"
      ],
      correctAnswerIndex: 1,
      explanation: "Steady improvement in key financial metrics is a highly bullish fundamental signal indicating a healthy, growing company with compounding value."
    },
    {
      question: "What is 'intrinsic value' in fundamental analysis?",
      options: [
        "The highest price a stock has ever reached in its history",
        "The calculated true value of a company based on its cash flows, assets, and earnings, independent of its current market price",
        "The physical value of the paper stock certificates",
        "The price of the stock on the day of its IPO"
      ],
      correctAnswerIndex: 1,
      explanation: "Intrinsic value is what a business is actually worth based on financial analysis. If the market price is below intrinsic value, the stock is considered a 'buy'."
    },
    {
      question: "Why does the market price of a stock often differ from its fundamental value?",
      options: [
        "Because stock exchanges make mathematical pricing mistakes daily",
        "Because short-term stock prices are driven by market sentiment, hype, and emotions, while fundamental value reflects actual business performance over the long term",
        "Because fundamental data is kept secret from the public for up to five years",
        "Because brokers set stock prices arbitrarily to maximize their own profits"
      ],
      correctAnswerIndex: 1,
      explanation: "In the short run, the stock market is a voting machine (sentiment, fear, greed). In the long run, it is a weighing machine (actual earnings, assets, fundamentals)."
    }
  ],

  // 4: Macroeconomics
  4: [
    {
      question: "How does {{concept}} primarily impact the stock market?",
      options: [
        "It directly changes the brand names of major consumer products",
        "It shifts broad economic conditions, influencing consumer spending, corporate borrow costs, and overall investor risk appetite",
        "It has zero impact on stock prices because stocks are independent of the global economy",
        "It forces brokers to halt trading on all tech stocks every Friday"
      ],
      correctAnswerIndex: 1,
      explanation: "Macro forces like {{concept}} shape the environment. For example, rising rates make borrowing expensive, shrinking corporate profits and stock valuations."
    },
    {
      question: "Why do stock investors closely monitor federal reports regarding {{concept}}?",
      options: [
        "To find out if any corporate executives are being arrested",
        "To anticipate shifts in monetary policy (like interest rate cuts or hikes) that will directly influence asset prices",
        "To receive direct cash payouts from the federal government",
        "To trade stocks without having to pay any transaction commissions"
      ],
      correctAnswerIndex: 1,
      explanation: "Central banks adjust monetary policies based on macroeconomic reports. Investors track these to adjust their portfolio risk ahead of policy changes."
    },
    {
      question: "If {{concept}} shows a highly unexpected or extreme reading, what is a typical stock market reaction?",
      options: [
        "The stock market instantly freezes and closes for the next 48 hours",
        "Spikes in market volatility, as investors rapidly reprice equities and bonds based on the new economic outlook",
        "All stocks are automatically split 3-for-1 to compensate investors",
        "The dollar value of gold drops to absolute zero instantly"
      ],
      correctAnswerIndex: 1,
      explanation: "Unanticipated economic data disrupts consensus expectations, causing rapid buying or selling as traders adjust their models to the new macroeconomic reality."
    },
    {
      question: "Which sector is generally most sensitive to shifts in {{concept}}?",
      options: [
        "High-debt growth sectors (like technology) and interest-rate-sensitive sectors (like financials and utilities)",
        "Only the agricultural sector, while others are completely immune",
        "No sector is sensitive because stock prices are determined solely by corporate earnings",
        "Sectors that trade exclusively on international exchanges"
      ],
      correctAnswerIndex: 0,
      explanation: "Growth sectors rely on borrowing for future cash flows; rising rates make those future flows less valuable today, making tech and real estate highly sensitive."
    },
    {
      question: "How do interest rates set by central banks influence {{concept}}?",
      options: [
        "They have no relationship whatsoever",
        "Interest rates act as the primary accelerator or brake on economic activity, directly driving inflation, borrowing capacity, and asset yields",
        "They force public companies to pay dividends in gold coins",
        "They dictate the physical location of stock exchanges"
      ],
      correctAnswerIndex: 1,
      explanation: "Central bank rates set the cost of money. High rates cool down inflation and GDP growth; low rates stimulate credit expansion and asset bubbles."
    },
    {
      question: "In macroeconomics, what is the 'yield curve' and why is it monitored alongside {{concept}}?",
      options: [
        "A physical curve on a stock certificate indicating its authenticity",
        "A line graph plotting interest rates of government bonds of different maturities, which serves as a powerful indicator of economic health and recessions",
        "The curve of a price chart when a stock is about to double in value",
        "The average age of retail investors actively trading on margin"
      ],
      correctAnswerIndex: 1,
      explanation: "The yield curve compares short-term and long-term interest rates. An 'inverted' yield curve has historically been an incredibly reliable warning sign of an impending recession."
    },
    {
      question: "Why does high inflation (rising CPI) generally pressure stock valuations?",
      options: [
        "Because inflation makes it illegal for corporations to generate profits",
        "Because it erodes consumer purchasing power, raises raw material costs, and forces central banks to raise interest rates to cool the economy",
        "Because it reduces the physical number of shares a company has issued",
        "Because it forces all retail brokerages to temporarily suspend operations"
      ],
      correctAnswerIndex: 1,
      explanation: "Inflation devalues future earnings, squeezes profit margins via higher input costs, and triggers rate hikes which discount future stock cash flows more aggressively."
    },
    {
      question: "What is the difference between Fiscal Policy and Monetary Policy?",
      options: [
        "Fiscal Policy is decided by the government (taxing & spending), while Monetary Policy is decided by the central bank (interest rates & money supply)",
        "Fiscal Policy is for day traders, while Monetary Policy is for pension funds",
        "Fiscal Policy is always positive, whereas Monetary Policy is always negative",
        "Fiscal Policy is regulated by the SEC, while Monetary Policy is regulated by the NYSE"
      ],
      correctAnswerIndex: 0,
      explanation: "Fiscal policy is set by Congress/administration via taxes and budget spending. Monetary policy is controlled by the independent Central Bank (the Fed) via interest rates."
    },
    {
      question: "How does a strengthening domestic currency affect multinational stock corporations?",
      options: [
        "It increases their international sales exponentially when converted back into domestic currency",
        "It can make domestic exports more expensive abroad and shrink the value of international revenues when converted back",
        "It has absolutely no impact on international sales metrics",
        "It causes the stock market to instantly halt trading in all foreign stocks"
      ],
      correctAnswerIndex: 1,
      explanation: "Multinationals earn heavy revenue in foreign currencies. A strong home currency means those foreign profits convert back into fewer home currency dollars, dragging on earnings."
    },
    {
      question: "What is a 'recession' and how does it fundamentally impact stock markets?",
      options: [
        "A period of high economic growth where stock prices double every week",
        "A significant decline in economic activity across the economy, leading to lower corporate earnings, higher unemployment, and typical bear markets",
        "A scheduled maintenance window where stock exchanges are closed for a month",
        "A minor adjustment in stock ticker codes"
      ],
      correctAnswerIndex: 1,
      explanation: "Recessions mean falling demand and higher unemployment, causing corporate earnings to contract. This usually triggers bear markets as stock prices adjust to lower profitability."
    }
  ],

  // 5: Trading Strategies
  5: [
    {
      question: "What is the underlying logic of a successful trading strategy involving {{concept}}?",
      options: [
        "To enter and exit positions completely at random based on gut feeling",
        "To exploit specific market inefficiencies, trends, or volatility with a mathematically positive risk-to-reward ratio",
        "To purchase stocks and promise to never sell them under any circumstances",
        "To manipulate stock order books to secure a guaranteed profit"
      ],
      correctAnswerIndex: 1,
      explanation: "A professional strategy like {{concept}} defines strict rules for entries, exits, and position sizing to capture repeating statistical edges in the market."
    },
    {
      question: "Why is a defined 'Trade Plan' critical when executing {{concept}}?",
      options: [
        "Because stock brokers will block your account if you do not submit a written plan",
        "To eliminate emotional decision-making (fear, greed) by deciding entry, stop-loss, and profit targets in advance",
        "To guarantee that you will make a profit on every single trade",
        "To hide your personal trading strategies from IRS tax audits"
      ],
      correctAnswerIndex: 1,
      explanation: "Without a trade plan, emotions take over. Planning entries and exits in advance shields you from panic-selling or chasing overextended bubbles."
    },
    {
      question: "Which of the following is the most important element of {{concept}}?",
      options: [
        "Having a high-speed computer with multiple expensive monitors",
        "Strict risk management, including precise position sizing and keeping losses small",
        "Subscribing to paid stock alert channels on social media",
        "Only buying stocks that are discussed on television"
      ],
      correctAnswerIndex: 1,
      explanation: "Risk management is key. Even a strategy with a 40% win rate can be highly profitable if losses are kept small while winning trades are allowed to run."
    },
    {
      question: "In trading, what does 'Risk-to-Reward Ratio' mean?",
      options: [
        "The ratio of money you invest to the amount of taxes you owe",
        "The ratio of the potential loss (distance to stop-loss) to the potential gain (distance to profit target) of a planned trade",
        "The speed at which a trade executed on your broker account",
        "The likelihood of a stock company going bankrupt within one year"
      ],
      correctAnswerIndex: 1,
      explanation: "A healthy risk-reward ratio (e.g. 1:3) means you risk $1 to potentially make $3. This allows you to stay profitable even if you lose more than half of your trades."
    },
    {
      question: "What is a 'Stop-Loss' order and why is it mandatory for disciplined traders?",
      options: [
        "An order that prevents you from selling a stock for a loss, guaranteeing you break even",
        "An automatic order placed with your broker to sell a security when it reaches a specific price, capping your maximum loss",
        "A request to temporarily halt trading on a highly volatile stock",
        "A system that prevents brokers from charging trading fees on losing trades"
      ],
      correctAnswerIndex: 1,
      explanation: "Stop-losses are the ultimate shield of capital. They automate the process of admitting a trade was wrong, preventing a small mistake from turning into a devastating loss."
    },
    {
      question: "What is 'Short Selling' and how is it used in strategies like {{concept}}?",
      options: [
        "Selling shares you own within 10 seconds of buying them",
        "Borrowing shares from a broker to sell them at a high price, hoping to buy them back cheaper later to profit from a price drop",
        "Selling your shares at a discount to close out your account",
        "A prohibited trading technique that only institutional hedge funds can use"
      ],
      correctAnswerIndex: 1,
      explanation: "Short selling allows you to profit in bear markets. You sell borrowed shares, wait for the price to drop, buy them back cheaper to return to the lender, and pocket the difference."
    },
    {
      question: "How does the 'holding period' differ between Day Trading and Swing Trading?",
      options: [
        "Day traders hold positions for minutes or hours (never overnight), while swing traders hold positions for days or weeks to capture multi-day trends",
        "Day traders hold positions for weeks, while swing traders hold positions for months",
        "Day trading is only done on weekends, while swing trading is done during weekdays",
        "Day trading has zero risk of loss, while swing trading is highly speculative"
      ],
      correctAnswerIndex: 0,
      explanation: "Day traders close all positions before the market closes to avoid overnight gap risk. Swing traders hold overnight to ride broader momentum swings."
    },
    {
      question: "What is a 'Trailing Stop-Loss'?",
      options: [
        "A stop-loss order that trails behind a rising stock price at a set distance, locking in profits while protecting against sudden reversals",
        "A stop-loss order that increases your loss limit as the stock price drops",
        "A technical indicator that plots historical moving averages on a chart",
        "A penalty fee charged by brokers for holding a losing trade too long"
      ],
      correctAnswerIndex: 0,
      explanation: "Trailing stops automatically adjust upward as price moves in your favor, letting you maximize profits on a massive breakout while securing gains if price suddenly reverses."
    },
    {
      question: "What does 'Position Sizing' refer to?",
      options: [
        "The physical dimensions of your charting software window on your desktop screen",
        "The calculated dollar amount or number of shares you trade, adjusted so that a single stop-loss hit risks only 1-2% of your total capital",
        "The location of your stock orders in the public exchange queue",
        "The percentage of shares you own compared to institutional mutual funds"
      ],
      correctAnswerIndex: 1,
      explanation: "Position sizing is the math of survival. By adjusting trade size based on the distance of your stop-loss, you ensure no single bad trade can wipe out your account."
    },
    {
      question: "Why is keeping a 'Trading Journal' highly recommended?",
      options: [
        "Because you are legally required to submit your journal to the SEC every year",
        "To review your trades objectively, track which setups are profitable, identify emotional errors, and refine your edge over time",
        "To write fictional stories about the stock market to share with friends",
        "To log the daily exchange rate of foreign currencies"
      ],
      correctAnswerIndex: 1,
      explanation: "A trading journal is the mirror of performance. It reveals your statistics, exposes behavioral traps (like revenge trading), and provides data to improve your strategy."
    }
  ],

  // 6: Options & Derivatives
  6: [
    {
      question: "What is an Option contract in the context of {{concept}}?",
      options: [
        "A binding contract forcing you to purchase a stock at whatever price the broker chooses",
        "A derivative contract giving you the right, but not the obligation, to buy or sell a stock at a specified price within a set time frame",
        "An insurance policy that guarantees you will never lose money on your stock trades",
        "A type of preferred share issued only to company founders"
      ],
      correctAnswerIndex: 1,
      explanation: "Options are derivatives because their value is derived from an underlying stock. They offer high leverage and unique hedging strategies but come with rapid time decay."
    },
    {
      question: "What is the key difference between a 'Call Option' and a 'Put Option'?",
      options: [
        "Calls profit when the stock price rises, while Puts profit when the stock price falls",
        "Calls are purchased on margin, while Puts are purchased with physical cash",
        "Calls can only be traded by retail accounts, while Puts are for institutions",
        "Calls have infinite expiration dates, while Puts expire in one day"
      ],
      correctAnswerIndex: 0,
      explanation: "A Call option gives the holder the right to buy the stock at a set price (bullish), while a Put option gives the right to sell the stock (bearish)."
    },
    {
      question: "What is the 'Strike Price' of an option contract?",
      options: [
        "The price at which the option contract was originally printed",
        "The predetermined price at which the underlying stock can be bought or sold if the option is exercised",
        "The fee you pay to your brokerage to execute an option trade",
        "The price at which the stock market halts trading during high volatility"
      ],
      correctAnswerIndex: 1,
      explanation: "The strike price is the locked price. If you own a $150 Call option, you have the right to purchase that stock at exactly $150 regardless of how high price spikes."
    },
    {
      question: "How does 'Time Decay' (Theta) affect option buyers?",
      options: [
        "It increases the value of their option contracts exponentially as expiration approaches",
        "It steadily erodes the premium/value of the option contract as each day passes, accelerating near expiration",
        "It extends the expiration date of the option contract automatically",
        "It halts trading on the option contract if the stock is inactive"
      ],
      correctAnswerIndex: 1,
      explanation: "Options are wasting assets. Every day that passes reduces the probability of the option being profitable, meaning Theta steadily devalues options for the buyer."
    },
    {
      question: "In option trading, what are the 'Greeks' (Delta, Gamma, Theta, Vega)?",
      options: [
        "A group of Greek financial analysts who publish option ratings weekly",
        "Mathematical metrics that measure an option contract's sensitivity to price movements, time decay, and implied volatility",
        "The tax brackets applied to short-term option contract gains",
        "The list of European stock exchanges where options can be traded"
      ],
      correctAnswerIndex: 1,
      explanation: "The Greeks are variables of options pricing models: Delta tracks price sensitivity, Theta tracks time decay, Vega tracks volatility sensitivity, and Gamma tracks Delta acceleration."
    },
    {
      question: "What is 'Implied Volatility' (IV) and why is it crucial for pricing {{concept}}?",
      options: [
        "The historical price range of a stock over the past ten years",
        "The market's expectation of a stock's future price fluctuations, which directly expands or shrinks option premiums",
        "The speed at which stock orders are filled by market makers",
        "The percentage of shares owned by corporate insiders"
      ],
      correctAnswerIndex: 1,
      explanation: "IV represents expected future movement. High IV means high uncertainty, which inflates option premiums, making options expensive to buy and lucrative to sell."
    },
    {
      question: "What is a 'Covered Call' strategy?",
      options: [
        "An options trade where you purchase a call option and cover it with a put option",
        "Selling a call option while simultaneously holding an equivalent amount of the underlying shares to generate steady premium income",
        "Buying call options with maximum leverage on margin to cover trading losses",
        "A regulatory requirement to insure your option contracts against crashes"
      ],
      correctAnswerIndex: 1,
      explanation: "By holding 100 shares and selling 1 Call option, you collect the premium cash. If the stock stays flat or rises slightly, you keep the cash, enhancing your portfolio yields."
    },
    {
      question: "What does it mean if an option is 'In-The-Money' (ITM)?",
      options: [
        "The option has positive intrinsic value because the current stock price has crossed the strike price in a profitable direction",
        "The option contract has been successfully refunded to your cash balance",
        "The option has expired worthless, returning all invested money to you",
        "The option is being traded inside a highly profitable hedge fund"
      ],
      correctAnswerIndex: 0,
      explanation: "For a Call, ITM means stock price is above strike price. For a Put, ITM means stock price is below strike. This means the contract has real cash execution value."
    },
    {
      question: "What is the maximum potential loss for a buyer of a Call or Put option?",
      options: [
        "An infinite amount of money, which can lead to negative account balances",
        "The exact premium (purchase price) originally paid to buy the option contract",
        "The current total value of their physical house and asset holdings",
        "Exactly half of the strike price multiplied by 100"
      ],
      correctAnswerIndex: 1,
      explanation: "Option buyers have capped risk. The worst-case scenario is the option expires out of the money and becomes worthless, meaning you lose only the premium you paid."
    },
    {
      question: "Why are Options considered highly leveraged instruments?",
      options: [
        "Because one option contract typically controls 100 shares of the underlying stock, allowing large gains or losses from a small initial cash outlay",
        "Because options are legally backed by gold leverage vaults",
        "Because option prices are determined directly by leveraged bank funds",
        "Because option buyers are required to trade with margin accounts"
      ],
      correctAnswerIndex: 0,
      explanation: "A single option contract lets you control 100 shares for a fraction of the cost of buying the actual shares, amplifying both percentage returns and loss speeds."
    }
  ],

  // 7: Trading Psychology
  7: [
    {
      question: "What is the primary psychological challenge addressed by {{concept}}?",
      options: [
        "Learning to memorize hundreds of financial accounting formulas",
        "Controlling primal emotional responses like fear and greed that hijack logical execution plans",
        "Increasing your typing speed to enter stock orders faster",
        "Developing a positive attitude toward paying trading commissions"
      ],
      correctAnswerIndex: 1,
      explanation: "Trading psychology focus is conquering emotional biases. Human brains are wired to secure fast gains and avoid pain, which triggers destructive trading behaviors."
    },
    {
      question: "Why does 'Loss Aversion' cause many retail traders to wipe out their accounts?",
      options: [
        "Because they cut their losing trades too quickly, missing out on massive recoveries",
        "Because the pain of a loss causes them to hold onto failing positions, hoping to break even, until a small loss turns into a devastating account blowup",
        "Because they are emotionally afraid of making a profitable trade",
        "Because brokers charge penalty fees for closing trades at a loss"
      ],
      correctAnswerIndex: 1,
      explanation: "Psychologists found humans feel the pain of loss twice as intensely as the joy of gain. Traders avoid the pain by refusing to cut losses, holding onto sinking ships."
    },
    {
      question: "What is 'Revenge Trading' in relation to {{concept}}?",
      options: [
        "Suing your broker for executing a bad trade",
        "Entering larger, impulsive, and highly risky trades immediately after a loss to try and 'make the money back' quickly",
        "Posting negative reviews about a stock company on social media",
        "Short-selling a stock because you dislike the CEO of the company"
      ],
      correctAnswerIndex: 1,
      explanation: "Revenge trading is an emotional response to a loss. It replaces discipline with rage and desperation, leading to oversized, unhedged trades and accelerated losses."
    },
    {
      question: "How does FOMO (Fear Of Missing Out) lead to severe trading drawdowns?",
      options: [
        "By causing traders to buy at the absolute top of a parabolic bubble because they see others making money, right before the bubble bursts",
        "By causing traders to keep their money in low-yield savings accounts",
        "By forcing traders to sell their winning positions too early",
        "By triggering automatic regulatory halts on their brokerage accounts"
      ],
      correctAnswerIndex: 0,
      explanation: "FOMO bypasses analysis. Seeing a stock skyrocket triggers jealousy and greed, urging traders to buy impulsively at inflated prices near the absolute peak."
    },
    {
      question: "What is 'Confirmation Bias' and how does it distort research?",
      options: [
        "Seeking out only positive news and opinions that support your existing stock position while ignoring bearish facts and red flags",
        "Verifying your financial data across multiple independent sources",
        "Receiving order execution confirmations from your brokerage app",
        "Waiting for technical patterns to be fully confirmed before entering"
      ],
      correctAnswerIndex: 0,
      explanation: "Confirmation bias shields our ego. If you are long on a stock, you will naturally look for bullish articles and dismiss warning signs, blinding you to rising risks."
    },
    {
      question: "Why is 'Overtrading' considered a silent account killer?",
      options: [
        "Because brokers charge massive inactivity fees for accounts that trade too little",
        "Because trading too frequently, chasing low-probability setups, and racking up commissions and spreads drains capital and exhausts mental energy",
        "Because it triggers audits from federal taxation agencies",
        "Because trading more than five times a day is illegal for retail accounts"
      ],
      correctAnswerIndex: 1,
      explanation: "Overtrading occurs when a trader is bored, impatient, or chasing losses. It reduces discipline, spreads attention too thin, and leads to poor risk execution."
    },
    {
      question: "In psychology, what is 'Overconfidence Bias' after a series of winning trades?",
      options: [
        "Believing you have mastered the market, leading you to break rules, increase risk sizes, and take careless positions that wipe out all previous gains",
        "Developing a healthy, sustainable trust in your trading strategy",
        "The ability to trade stocks on behalf of your family members",
        "A requirement to apply for institutional hedge fund job roles"
      ],
      correctAnswerIndex: 0,
      explanation: "A winning streak can make traders feel invincible, attributing market-driven success to personal genius. They increase risk, violate plans, and suffer major drawdowns."
    },
    {
      question: "How does having a written rule to risk only '1-2% per trade' assist psychologically?",
      options: [
        "It guarantees that you will make at least a 1-2% profit daily",
        "It keeps individual losses small enough to be emotionally insignificant, allowing you to stay calm and execute your plan without panic",
        "It qualifies your account for federal tax write-offs",
        "It decreases the amount of margin interest charged by your broker"
      ],
      correctAnswerIndex: 1,
      explanation: "If a loss represents only 1% of your account, you can easily accept being wrong and move on. If a loss is 20%, panic sets in, prompting emotional, irrational actions."
    },
    {
      question: "What is the psychological benefit of taking a break (stepping away from screens) after a major loss?",
      options: [
        "It allows your charting software to recalibrate its indicators",
        "It allows your nervous system to cool down, resetting your emotional state to prevent impulsive revenge trading",
        "It forces the stock exchanges to recover their prices",
        "It increases the leverage limits on your brokerage account"
      ],
      correctAnswerIndex: 1,
      explanation: "A major loss triggers a physiological 'fight or flight' response. Stepping away lets cortisol and adrenaline drop, restoring logical and disciplined decision-making."
    },
    {
      question: "A truly disciplined, professional trader views losses as:",
      options: [
        "A personal failure and a sign that the market is rigged against them",
        "The necessary cost of doing business, like electricity for a restaurant, which is managed and expected in any statistical model",
        "A sign that they must immediately change their entire trading strategy",
        "An opportunity to double their leverage to break even on the next trade"
      ],
      correctAnswerIndex: 1,
      explanation: "No strategy wins 100% of the time. Losses are inevitable business expenses. Accepting them calmly as a normal part of the process is the hallmark of professional psychological mastery."
    }
  ],

  // 8: Sectors & Industries
  8: [
    {
      question: "What is the purpose of dividing the stock market into Sectors like {{concept}}?",
      options: [
        "To group companies with similar business models and economic drivers, helping investors analyze cycles and rotate capital",
        "To make it illegal for investors to buy stocks in different industries",
        "To ensure that all stocks in the market have exactly the same price",
        "To create separate physical stock exchanges for each type of product"
      ],
      correctAnswerIndex: 0,
      explanation: "The market is organized into 11 GICS sectors. Grouping companies lets investors analyze trends, spot macro headwinds, and implement sector rotation strategies."
    },
    {
      question: "How does {{concept}} typically behave during an economic recession?",
      options: [
        "It is guaranteed to rise by at least 50% due to corporate regulations",
        "Its performance depends heavily on whether it is a Defensive sector (stable demand like Consumer Staples) or Cyclical sector (highly sensitive like Discretionary)",
        "It freezes completely and halts all stock transactions",
        "It is completely unaffected because recessions only impact banking stocks"
      ],
      correctAnswerIndex: 1,
      explanation: "Recessions crush cyclical sectors (travel, luxury goods) as consumers cut spending, while defensive sectors (utilities, healthcare, food) remain relatively stable."
    },
    {
      question: "Why is {{concept}} considered unique compared to other sectors?",
      options: [
        "Because it has entirely different corporate structures, accounting standards, regulatory oversight, or capital expenditures",
        "Because it is exempt from all standard financial auditing and taxation",
        "Because its stock prices are determined by the price of physical gold only",
        "Because only high-net-worth institutional investors are allowed to buy its shares"
      ],
      correctAnswerIndex: 0,
      explanation: "Every sector has distinct financial drivers. For example, Tech is driven by high R&D and rapid innovation, while Utilities are capital-heavy and highly regulated with steady dividends."
    },
    {
      question: "What is 'Sector Rotation' and how does it relate to {{concept}}?",
      options: [
        "The automated daily changing of stock ticker symbols by the exchange",
        "Moving investment capital from one sector to another based on where the economy is in the business cycle",
        "A technique to trade stocks without paying capital gains taxes",
        "Forcing corporate board members to rotate between different industries"
      ],
      correctAnswerIndex: 1,
      explanation: "As the economy shifts from recession to recovery and expansion, different sectors take turns outperforming. Savvy investors rotate capital to capture these macro waves."
    },
    {
      question: "Which of the following is considered a typical 'Defensive' sector?",
      options: [
        "Technology and Semiconductor stocks",
        "Consumer Staples, Healthcare, and Utilities",
        "Industrial manufacturing and Airline companies",
        "Oil drilling and Mining operations"
      ],
      correctAnswerIndex: 1,
      explanation: "Defensive sectors sell absolute necessities. People must buy groceries, use electricity, and take medicine regardless of how bad the recession is, keeping earnings stable."
    },
    {
      question: "What defines a 'Cyclical' stock sector?",
      options: [
        "A sector that only trades during specific seasons of the year",
        "A sector whose earnings and stock prices follow the ups and downs of the economic expansion and contraction cycle",
        "A sector that has guaranteed repeating price cycles every 30 days",
        "A sector regulated by a cyclical committee at the stock exchange"
      ],
      correctAnswerIndex: 1,
      explanation: "Cyclical sectors (e.g. Travel, Autos, Tech) excel when the economy is booming and consumers have high disposable income, but suffer heavily when growth contracts."
    },
    {
      question: "Why do interest rate hikes typically pressure high-growth sectors more than defensive ones?",
      options: [
        "Because rate hikes make it illegal to issue new software licenses",
        "Because growth companies rely heavily on borrowing for future expansion, and higher rates devalue the present value of their future cash flows",
        "Because high-growth stocks do not pay taxes to the government",
        "Because defensive sectors are legally exempt from interest rate shifts"
      ],
      correctAnswerIndex: 1,
      explanation: "Growth stocks have cash flows projected far into the future. High interest rates discount these distant cash flows more severely, crushing growth valuations."
    },
    {
      question: "What are REITs (Real Estate Investment Trusts) and which sector do they represent?",
      options: [
        "A form of options derivative representing leverage contracts",
        "Companies that own, operate, or finance income-producing real estate, offering high dividend yields in the Real Estate sector",
        "An institutional mutual fund that trades exclusively in bank stocks",
        "A government bond that pays interest in gold bullion"
      ],
      correctAnswerIndex: 1,
      explanation: "REITs trade like stocks but own real estate. By law, they must distribute at least 90% of taxable income to shareholders as dividends, making them income-generating giants."
    },
    {
      question: "How does the price of raw commodities (like oil or metals) influence corporate sectors?",
      options: [
        "It only affects the price of commodities futures, with no impact on standard stocks",
        "It increases costs for energy-consuming sectors (like Airlines) while boosting revenues for energy-producing sectors (like Oil & Gas)",
        "It forces all companies in the market to declare bankruptcy",
        "It automatically decreases corporate tax brackets for all sectors"
      ],
      correctAnswerIndex: 1,
      explanation: "Commodities are inputs. Higher oil prices raise expenses for transport and manufacturing firms, but translate directly into record earnings for energy producers."
    },
    {
      question: "An investor seeking passive income with low risk should focus on sectors with:",
      options: [
        "High-volatility biotech startups with zero current revenues",
        "Mature, cash-rich industries with stable demand and high dividend yields (like Utilities or Consumer Staples)",
        "Leveraged penny stocks trading on unregulated over-the-counter markets",
        "High-debt technology firms reinvesting all cash into R&D"
      ],
      correctAnswerIndex: 1,
      explanation: "Income-focused portfolios prioritize cash flow stability. Utilities and consumer staples offer defensive businesses, reliable profits, and consistent dividend payments."
    }
  ],

  // 9: Advanced Market Mechanics
  9: [
    {
      question: "What is the primary role of {{concept}} in modern market microstructure?",
      options: [
        "To set fixed stock prices at the start of every trading week",
        "To manage institutional liquidity, execute massive orders, or provide high-speed order routing with minimal market disruption",
        "To completely replace retail brokerage platforms with automated AI algorithms",
        "To bypass SEC oversight and federal tax filing requirements"
      ],
      correctAnswerIndex: 1,
      explanation: "{{concept}} represents the plumbing. High-speed market routing, dark pools, and market-making mechanics organize how billions of shares change hands instantly."
    },
    {
      question: "Why do institutional fund managers utilize {{concept}}?",
      options: [
        "To hide their criminal financial actions from regulatory detection",
        "To execute massive blocks of shares without revealing their hand and causing unfavorable price movements on public exchanges",
        "To buy stocks at a 50% discount compared to retail prices",
        "To trade options contracts without having to pay any option premiums"
      ],
      correctAnswerIndex: 1,
      explanation: "Large blocks can spike prices if dumped on public books. Institutional mechanics like dark pools match huge buyer and seller orders privately to avoid price shocks."
    },
    {
      question: "What is a 'Market Maker' and how do they interact with {{concept}}?",
      options: [
        "A company that physically prints paper stock certificates",
        "A specialized financial firm that stands ready to buy or sell securities at all times, providing continuous liquidity and pocketing the bid-ask spread",
        "An influential retail investor who coordinates stock hype on social media",
        "A regulatory officer who decides when stock exchanges should close"
      ],
      correctAnswerIndex: 1,
      explanation: "Market makers are liquidity providers. They quote both a bid (buy) and ask (sell) price, facilitating instant trades for retail accounts in exchange for the spread."
    },
    {
      question: "What is a 'Short Squeeze' and how does it play out?",
      options: [
        "A regulatory halt placed on a stock that is dropping too fast",
        "A rapid price spike triggered when short sellers are forced to buy back shares at high prices to cut their losses, accelerating the upward momentum",
        "A corporate action that shrinks the total number of issued shares",
        "A fee charged by brokers for shorting a stock on margin"
      ],
      correctAnswerIndex: 1,
      explanation: "Short sellers must buy to close. If a heavily shorted stock rises, shorts panic and buy to exit. This sudden buy demand triggers an explosive upward spiral."
    },
    {
      question: "What does 'Payment for Order Flow' (PFOF) mean for retail traders?",
      options: [
        "A monthly fee retail traders must pay to access live market data",
        "The practice where wholesale market makers pay brokerages to route retail orders to them, enabling commission-free trading but raising execution quality questions",
        "A direct refund of tax credits on capital losses",
        "The automatic buying of stocks using credit cards"
      ],
      correctAnswerIndex: 1,
      explanation: "PFOF makes 'zero-commission' trading possible. Wholesale market makers pay brokers for retail orders because retail flow is safe and predictable, allowing them to capture spreads easily."
    },
    {
      question: "What is 'High-Frequency Trading' (HFT) and how does it affect market liquidity?",
      options: [
        "Trading stocks only on days with extremely high market volume",
        "Algorithmic trading executing thousands of orders in fractions of a second, which tightens bid-ask spreads but can disappear during market crashes",
        "Buying stocks using ultra-high leverage margin accounts",
        "The direct manual trading of stock index futures"
      ],
      correctAnswerIndex: 1,
      explanation: "HFT algorithms exploit microscopic price differences. They add massive liquidity and narrow the bid-ask spread, but their liquidity can vanish instantly during high-stress flash crashes."
    },
    {
      question: "What is a 'Margin Call' and how is it triggered?",
      options: [
        "A phone call from a broker inviting you to apply for a premium credit card",
        "A demand from a broker requiring an investor to deposit additional cash or securities to meet minimum maintenance margin, or else have assets liquidated immediately",
        "A regulatory notification that a stock has split 2-for-1",
        "A technical signal indicating a stock has reached a support level"
      ],
      correctAnswerIndex: 1,
      explanation: "Margin is borrowed money. If your leveraged trades lose value and your equity drops below the maintenance threshold, the broker demands cash or sells your shares to protect their loan."
    },
    {
      question: "What is 'Dark Liquidity' or a 'Dark Pool'?",
      options: [
        "An unregulated, underground exchange trading illegal assets",
        "A private financial forum or exchange where institutions trade massive blocks of shares anonymously to avoid impacting public market prices",
        "Trading stocks of companies that operate utility or oil infrastructure",
        "A stock market crash that occurs during overnight hours"
      ],
      correctAnswerIndex: 1,
      explanation: "Dark pools are institutional matching engines. Because order books are invisible to the public, giant mutual funds can swap blocks of stock without alerting predatory algorithms."
    },
    {
      question: "How does the 'Stock Borrow Rate' influence the cost of short selling?",
      options: [
        "It is the interest rate you earn for holding cash in a brokerage account",
        "An annual fee charged by brokers to borrow hard-to-find shares for shorting, which spikes when short demand exceeds available borrow supply",
        "The commission rate charged for executing standard option trades",
        "The regulatory tax rate applied to short-term investment profits"
      ],
      correctAnswerIndex: 1,
      explanation: "To short, you must borrow shares. If a stock is highly popular to short and has low float, it becomes 'hard-to-borrow', driving borrow rates up to 100%+ annually, making shorting extremely expensive."
    },
    {
      question: "What is the VIX (Volatility Index) and how do advanced traders use it?",
      options: [
        "A stock index representing the top 30 technology corporations",
        "An index measuring the stock market's expectation of 30-day implied volatility derived from S&P 500 options, serving as the 'fear gauge'",
        "A derivative options contract that expires in one minute",
        "An automated charting tool that draws support and resistance lines"
      ],
      correctAnswerIndex: 1,
      explanation: "The VIX tracks S&P 500 option demand. When markets crash, investors buy puts for portfolio insurance, driving up option prices and causing the VIX to spike, signaling high fear."
    }
  ]
};

// Returns a complete, fully detailed Lesson object with slides and 10 questions
export function generateFullLesson(levelNum: number): Lesson {
  let level: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  if (levelNum > 300 && levelNum <= 700) {
    level = 'intermediate';
  } else if (levelNum > 700) {
    level = 'advanced';
  }

  const trackIndex = (levelNum - 1) % 10;
  const track = CURRICULUM_TRACKS[trackIndex];
  const conceptIndex = Math.floor((levelNum - 1) / 10) % track.concepts.length;
  const concept = track.concepts[conceptIndex];

  const title = `Level ${levelNum}: ${concept}`;
  const description = `Master the foundational and advanced elements of ${concept} within our specialized ${track.name} curriculum.`;

  // Dynamic slides tailored specifically to the level and concept
  const slides = [
    `Welcome to Level ${levelNum}! Today we are exploring "${concept}" in detail. This core concept resides inside our specialized "${track.name}" curriculum track, designed to transition you into a professional investor.`,
    `When analyzing "${concept}", the key mechanism is understanding how it coordinates market behavior. For instance, in "${track.name}", this principle helps traders manage capital, spot macro or technical trends, and align their strategy with institutional flows.`,
    `Let's look at a concrete real-world example: Imagine a public stock where "${concept}" is actively moving. A retail trader who ignores this metric might buy right into an institutional sell-wall or completely misjudge the company's financial liquidity, leading to rapid drawdowns.`,
    `To build absolute discipline with "${concept}", always formulate an actionable trade plan. Assess whether the current trend is overextended, set a strict invalidation level, use correct position sizing, and never let emotions override verified data. Let's start your 10-question graduation quiz!`
  ];

  // Retrieve templates for this track and replace placeholder with the actual concept
  const templates = TRACK_TEMPLATES[trackIndex] || TRACK_TEMPLATES[0];
  const questions: LessonQuestion[] = templates.map((tmpl) => {
    return {
      question: tmpl.question.replace(/\{\{concept\}\}/g, concept),
      options: tmpl.options.map(opt => opt.replace(/\{\{concept\}\}/g, concept)),
      correctAnswerIndex: tmpl.correctAnswerIndex,
      explanation: tmpl.explanation.replace(/\{\{concept\}\}/g, concept)
    };
  });

  // Backward-compatible placeholders for old App.tsx references
  const quizQuestion = questions[0].question;
  const quizOptions = questions[0].options;
  const correctAnswerIndex = questions[0].correctAnswerIndex;

  // Dynamic scale of XP/Gold rewards based on difficulty level
  let xpReward = 200;
  let goldReward = 50;
  if (level === 'intermediate') {
    xpReward = 250;
    goldReward = 75;
  } else if (level === 'advanced') {
    xpReward = 300;
    goldReward = 100;
  }

  return {
    id: `level-${levelNum}`,
    levelNum,
    level,
    title,
    description,
    slides,
    quizQuestion,
    quizOptions,
    correctAnswerIndex,
    questions,
    xpReward,
    goldReward
  };
}
