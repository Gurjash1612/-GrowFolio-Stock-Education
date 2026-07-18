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

  // Base values dictionary for popular Indian and US stocks to provide high-fidelity simulated fallback
  const BASE_STOCK_VALUES: { [ticker: string]: { name: string; price: number; isUSD?: boolean } } = {
    'RELIANCE.NS': { name: 'Reliance Industries Limited', price: 1325.00 },
    'TCS.NS': { name: 'Tata Consultancy Services Limited', price: 4250.00 },
    'HDFCBANK.NS': { name: 'HDFC Bank Limited', price: 1720.00 },
    'INFY.NS': { name: 'Infosys Limited', price: 1850.00 },
    'TATAMOTORS.NS': { name: 'Tata Motors Limited', price: 980.00 },
    'SBIN.NS': { name: 'State Bank of India', price: 850.00 },
    'ITC.NS': { name: 'ITC Limited', price: 490.00 },
    'AAPL': { name: 'Apple Inc.', price: 225.00, isUSD: true },
    'MSFT': { name: 'Microsoft Corporation', price: 440.00, isUSD: true },
    'NVDA': { name: 'NVIDIA Corporation', price: 125.00, isUSD: true },
    'TSLA': { name: 'Tesla Inc.', price: 210.00, isUSD: true },
    'AMZN': { name: 'Amazon.com Inc.', price: 185.00, isUSD: true },
    'GOOGL': { name: 'Alphabet Inc.', price: 180.00, isUSD: true },
    'GOOG': { name: 'Alphabet Inc.', price: 180.00, isUSD: true },
    'META': { name: 'Meta Platforms Inc.', price: 495.00, isUSD: true },
    'NFLX': { name: 'Netflix Inc.', price: 645.00, isUSD: true },
    'BHARTIARTL.NS': { name: 'Bharti Airtel Limited', price: 1550.00 },
    'ICICIBANK.NS': { name: 'ICICI Bank Limited', price: 1240.00 },
    'LT.NS': { name: 'Larsen & Toubro Limited', price: 3620.00 },
    'AXISBANK.NS': { name: 'Axis Bank Limited', price: 1180.00 },
    'WIPRO.NS': { name: 'Wipro Limited', price: 540.00 },
    'HINDUNILVR.NS': { name: 'Hindustan Unilever Limited', price: 2550.00 },
    'MARUTI.NS': { name: 'Maruti Suzuki India Limited', price: 12400.00 },
    'COALINDIA.NS': { name: 'Coal India Limited', price: 510.00 },
    'ADANIENT.NS': { name: 'Adani Enterprises Limited', price: 3050.00 },
  };

  // Helper to check if a specific stock market is open based on ticker symbol
  const isMarketOpenForTicker = (ticker: string): boolean => {
    const uppercaseTicker = ticker.trim().toUpperCase();
    const isIndian = uppercaseTicker.endsWith('.NS') || uppercaseTicker.endsWith('.BO');
    const now = Date.now();

    if (isIndian) {
      // IST is UTC + 5.5 hours
      const istDate = new Date(now + 5.5 * 3600000);
      const day = istDate.getUTCDay(); // 0 = Sunday, 6 = Saturday
      const hours = istDate.getUTCHours();
      const minutes = istDate.getUTCMinutes();
      const timeInMinutes = hours * 60 + minutes;

      if (day === 0 || day === 6) {
        return false;
      }
      // 9:15 AM to 3:30 PM IST (555 to 930 mins)
      if (timeInMinutes < 555 || timeInMinutes > 930) {
        return false;
      }
      return true;
    } else {
      // US Market (NYSE/NASDAQ) is Monday to Friday, 9:30 AM to 4:00 PM EST/EDT (approximated as UTC-4)
      const estDate = new Date(now - 4 * 3600000);
      const day = estDate.getUTCDay();
      const hours = estDate.getUTCHours();
      const minutes = estDate.getUTCMinutes();
      const timeInMinutes = hours * 60 + minutes;

      if (day === 0 || day === 6) {
        return false;
      }
      // 9:30 AM to 4:00 PM (570 to 960 mins)
      if (timeInMinutes < 570 || timeInMinutes > 960) {
        return false;
      }
      return true;
    }
  };

  // Helper to generate dynamic, high-fidelity real-time simulated quote data
  const getFallbackQuote = (ticker: string, conversionRate = 83.5, isPracticeMode = false) => {
    const uppercaseTicker = ticker.trim().toUpperCase();
    let stockInfo = BASE_STOCK_VALUES[uppercaseTicker];
    
    if (!stockInfo) {
      // Create a stable deterministic fallback using string hash
      const hash = uppercaseTicker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const isUSD = !uppercaseTicker.endsWith('.NS') && !uppercaseTicker.endsWith('.BO');
      const baseVal = (hash % 1200) + 40; // ₹40 to ₹1240 base
      const name = uppercaseTicker.replace('.NS', '').replace('.BO', '') + (isUSD ? ' Corp.' : ' Ltd.');
      stockInfo = { name, price: baseVal, isUSD };
    }

    const isUSD = !!stockInfo.isUSD;
    const multiplier = isUSD ? conversionRate : 1;
    const hashSeed = uppercaseTicker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Check if real market is open
    const marketOpen = isPracticeMode || isMarketOpenForTicker(uppercaseTicker);
    
    // Simulate real-time ticking only if the market is open or practice mode is enabled!
    // Using a sine wave based on current time (every 30 seconds) to make prices tick up and down dynamically
    const timeFactor = marketOpen 
      ? Math.sin((Date.now() / 30000) + hashSeed) // goes from -1 to +1 dynamically
      : Math.sin(hashSeed); // perfectly static/frozen time-invariant close factor
      
    const fluctuationPercent = (timeFactor * 0.015); // -1.5% to +1.5% live fluctuation
    
    const basePrice = stockInfo.price * (1 + fluctuationPercent);
    const currentPrice = Number((basePrice * multiplier).toFixed(2));
    
    // Prev close: slightly different based on hash to show a steady daily trend
    const dayTrendFactor = (hashSeed % 10 - 4.5) * 0.005; // -2.25% to +2.25% stable daily offset
    const prevClose = Number((stockInfo.price * (1 + dayTrendFactor) * multiplier).toFixed(2));
    
    const changePercent = ((currentPrice - prevClose) / prevClose) * 100;

    return {
      ticker: uppercaseTicker,
      name: stockInfo.name,
      price: currentPrice,
      prevPrice: prevClose,
      change: Number(changePercent.toFixed(2)),
      history: generateHistory(currentPrice, prevClose)
    };
  };

  // Real-time stock quotes proxy from high-fidelity dynamic simulated engine with automated USD->INR conversion
  app.get('/api/stocks/quotes', (req, res) => {
    const defaultConversionRate = 83.5;
    try {
      const symbolsQuery = req.query.symbols as string;
      if (!symbolsQuery) {
        return res.status(400).json({ error: 'Symbols query parameter is required' });
      }

      // Read optional practice mode parameter
      const isPracticeMode = req.query.practice === 'true';

      // Generate dynamic simulated quotes instantly (with real-time micro-fluctuations based on system clock)
      const symbols = symbolsQuery.split(',').map(s => s.trim()).filter(Boolean);
      const stocksList = symbols.map(ticker => getFallbackQuote(ticker, defaultConversionRate, isPracticeMode));
      
      return res.json({ stocks: stocksList, conversionRate: defaultConversionRate });
    } catch (error: any) {
      console.error('Error in fetchQuotes handler:', error);
      return res.status(500).json({ error: 'Failed to retrieve stock quotes', details: error.message });
    }
  });

  // Real-time stock search from high-fidelity dictionary and dynamic generator
  app.get('/api/stocks/search', (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
      }

      const qUpper = query.toUpperCase().trim();
      const results = [];
      
      // Search in our BASE_STOCK_VALUES dictionary
      for (const [ticker, info] of Object.entries(BASE_STOCK_VALUES)) {
        if (ticker.includes(qUpper) || info.name.toUpperCase().includes(qUpper)) {
          const exchange = ticker.endsWith('.NS') ? 'NSE' : ticker.endsWith('.BO') ? 'BSE' : 'US';
          results.push({
            ticker,
            name: info.name,
            exchange,
            type: 'EQUITY'
          });
        }
      }
      
      // If no direct matching entries are found, dynamically construct a robust candidate so the flow never stops
      if (results.length === 0 && qUpper.length >= 2 && qUpper.length <= 12) {
        const isNSE = qUpper.endsWith('.NS');
        const isBSE = qUpper.endsWith('.BO');
        const ticker = isNSE || isBSE ? qUpper : `${qUpper}.NS`; // default to NSE for seamless Indian market focus
        const name = `${qUpper.replace('.NS', '').replace('.BO', '')} (Simulated Corp)`;
        results.push({
          ticker,
          name,
          exchange: isBSE ? 'BSE' : 'NSE',
          type: 'EQUITY'
        });
      }
      
      return res.json({ results });
    } catch (error: any) {
      console.error('Error in searchStocks handler:', error);
      return res.status(500).json({ error: 'Failed to search stock tickers', details: error.message });
    }
  });

  // Serve robots.txt dynamically or statically
  app.get('/robots.txt', async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
      let content = '';
      try {
        content = await fs.readFile(robotsPath, 'utf-8');
      } catch {
        const fallbackPath = path.join(process.cwd(), 'robots.txt');
        try {
          content = await fs.readFile(fallbackPath, 'utf-8');
        } catch {
          content = `User-agent: *\nAllow: /\n\nSitemap: https://gurjash1612.github.io/-GrowFolio-Stock-Education/sitemap.xml`;
        }
      }
      res.header('Content-Type', 'text/plain');
      return res.send(content);
    } catch (error) {
      console.error('Error serving robots.txt:', error);
      return res.status(500).send('Error serving robots.txt');
    }
  });

  // Serve sitemap.xsl dynamically
  app.get('/sitemap.xsl', async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const xslPath = path.join(process.cwd(), 'public', 'sitemap.xsl');
      let content = '';
      try {
        content = await fs.readFile(xslPath, 'utf-8');
      } catch {
        const fallbackPath = path.join(process.cwd(), 'sitemap.xsl');
        try {
          content = await fs.readFile(fallbackPath, 'utf-8');
        } catch {
          res.status(404).send('Not Found');
          return;
        }
      }
      res.header('Content-Type', 'application/xml');
      return res.send(content);
    } catch (error) {
      console.error('Error serving sitemap.xsl:', error);
      return res.status(500).send('Error serving sitemap.xsl');
    }
  });

  // Serve sitemap.xml dynamically with host replacement
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const fs = await import('fs/promises');
      let sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
      let sitemapContent = '';
      
      try {
        sitemapContent = await fs.readFile(sitemapPath, 'utf-8');
      } catch {
        // Fallback to dist folder in production builds
        const fallbackPath = path.join(process.cwd(), 'dist', 'sitemap.xml');
        try {
          sitemapContent = await fs.readFile(fallbackPath, 'utf-8');
        } catch {
          // Complete fallback if files are not accessible
          sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://gurjash1612.github.io/-GrowFolio-Stock-Education/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
        }
      }

      // Replace the default placeholder host with the actual requested protocol + host
      const host = `${req.protocol}://${req.get('host')}`;
      sitemapContent = sitemapContent.replace(/https:\/\/gurjash1612\.github\.io\/-GrowFolio-Stock-Education/g, host);

      res.header('Content-Type', 'application/xml');
      return res.send(sitemapContent);
    } catch (error) {
      console.error('Error serving dynamic sitemap:', error);
      return res.status(500).send('Error serving sitemap');
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
