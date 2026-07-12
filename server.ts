import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  app.use(express.json());

  // Lazy-loaded Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
        aiClient = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      }
    }
    return aiClient;
  }

  // AI Advisor chat endpoint
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, history, systemInstruction } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Graceful fallback for offline mode or missing API key
        const fallbackAnswers: { [key: string]: string } = {
          'candlestick': 'Candlestick charts show the open, high, low, and close prices of a stock for a specific time period. A green body means the price closed higher than it opened (bullish), while a red body means it closed lower (bearish).',
          'support': 'Support is a price level where a downtrend tends to pause due to a concentration of demand or buying interest. Resistance is the opposite—a price level where an uptrend pauses due to selling pressure.',
          'risk': 'Risk management is the key to longevity in trading. This includes setting stop-loss orders, avoiding over-leveraging, and never investing more than 1-2% of your capital in a single trade.',
          'portfolio': 'A balanced portfolio should distribute risk across different assets. Beginners often start with broad-market ETFs, index funds, and solid blue-chip stocks before moving into high-growth sectors or single equities.',
          'options': 'Options are financial derivatives that give buyers the right, but not the obligation, to buy (Call) or sell (Put) an underlying asset at a specific price before a certain date.',
        };

        const lowerMsg = message?.toLowerCase() || '';
        let answer = "That's a great question about investing! As your GrowFolio Coach, I suggest continuing to complete the lessons in our Academy to unlock more detailed analysis. Diversification, compounding interest, and understanding candlestick patterns are essential core skills!";
        
        for (const [key, text] of Object.entries(fallbackAnswers)) {
          if (lowerMsg.includes(key)) {
            answer = text;
            break;
          }
        }

        return res.json({
          text: `[Offline AI Mode] ${answer}`
        });
      }

      // Call Gemini API using the official gemini-3.5-flash model
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: message,
        config: {
          systemInstruction: systemInstruction || 'You are an encouraging, expert financial coach named GrowBot at GrowFolio. Keep responses crisp, actionable, engaging, and easy to read for retail investors. Use brief bullet points where appropriate.',
          temperature: 0.7,
        },
      });

      return res.json({
        text: response.text || 'I am sorry, I did not receive a proper response from the model.'
      });

    } catch (error: any) {
      console.error('Error in Gemini API Chat:', error);
      return res.status(500).json({
        error: 'Failed to generate response from Gemini API',
        details: error.message || error,
      });
    }
  });

  // Helper to generate a realistic 12-candlestick history trend from prevClose to current price
  const generateHistory = (currentPrice: number, prevClose: number, count = 12) => {
    const history = [];
    let price = prevClose;
    const step = (currentPrice - prevClose) / count;
    for (let i = 0; i < count; i++) {
      const open = price;
      const change = step + (Math.random() - 0.5) * (price * 0.015);
      const close = i === count - 1 ? currentPrice : price + change;
      const high = Math.max(open, close) * (1 + Math.random() * 0.008);
      const low = Math.min(open, close) * (1 - Math.random() * 0.008);
      history.push({
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2))
      });
      price = close;
    }
    return history;
  };

  // Real-time stock quotes proxy from Yahoo Finance with automated USD->INR conversion
  app.get('/api/stocks/quotes', async (req, res) => {
    try {
      const symbolsQuery = req.query.symbols as string;
      if (!symbolsQuery) {
        return res.status(400).json({ error: 'Symbols query parameter is required' });
      }

      // We append USDINR=X to get the current exact USD->INR exchange rate
      const allSymbols = `${symbolsQuery},USDINR=X`;
      const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${allSymbols}`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Yahoo Finance API responded with status ${response.status}`);
      }

      const data: any = await response.json();
      const results = data?.quoteResponse?.result || [];

      // Find exchange rate
      const rateObj = results.find((r: any) => r.symbol === 'USDINR=X');
      const conversionRate = rateObj?.regularMarketPrice || 83.5;

      const stocksList = results
        .filter((r: any) => r.symbol !== 'USDINR=X')
        .map((r: any) => {
          const isUSD = r.currency === 'USD';
          const multiplier = isUSD ? conversionRate : 1;

          const currentPrice = Number((r.regularMarketPrice * multiplier).toFixed(2));
          const prevClose = Number((r.regularMarketPreviousClose * multiplier).toFixed(2));
          const priceChangePercent = r.regularMarketChangePercent || 0;

          return {
            ticker: r.symbol,
            name: r.longName || r.shortName || r.symbol,
            price: currentPrice,
            prevPrice: prevClose,
            change: Number(priceChangePercent.toFixed(2)),
            history: generateHistory(currentPrice, prevClose)
          };
        });

      return res.json({ stocks: stocksList, conversionRate });
    } catch (error: any) {
      console.error('Error in fetchQuotes:', error);
      return res.status(500).json({ error: 'Failed to fetch real-time stock quotes', details: error.message });
    }
  });

  // Real-time stock search from Yahoo Finance
  app.get('/api/stocks/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
      }

      const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Yahoo Finance Search API responded with status ${response.status}`);
      }

      const data: any = await response.json();
      const quotes = data?.quotes || [];

      // Filter search results to relevant stock tickers from NSE, BSE, and US exchanges
      const filteredQuotes = quotes
        .filter((q: any) => {
          const sym = q.symbol || '';
          return sym.endsWith('.NS') || sym.endsWith('.BO') || (!sym.includes('.') && !sym.includes('-'));
        })
        .map((q: any) => ({
          ticker: q.symbol,
          name: q.shortname || q.longname || q.symbol,
          exchange: q.exchange || (q.symbol.endsWith('.NS') ? 'NSE' : q.symbol.endsWith('.BO') ? 'BSE' : 'US'),
          type: q.quoteType || 'EQUITY'
        }));

      return res.json({ results: filteredQuotes });
    } catch (error: any) {
      console.error('Error in searchStocks:', error);
      return res.status(500).json({ error: 'Failed to search stock tickers', details: error.message });
    }
  });

  // Dynamic asset serving and Vite routing middleware
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GrowFolio Full-Stack Server listening on port ${PORT}`);
  });
}

startServer();
