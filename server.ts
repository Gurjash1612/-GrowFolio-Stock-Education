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
