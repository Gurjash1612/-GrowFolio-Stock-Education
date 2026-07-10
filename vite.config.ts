import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Helper to buffer and parse JSON body in raw Vite middleware
function getRequestBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

export default defineConfig(() => {
  return {
    base: process.env.GITHUB_ACTIONS ? '/GrowFolio/' : '/',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'vite-dev-api-server',
        configureServer(server) {
          server.middlewares.use('/api/gemini/chat', async (req: any, res: any) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }

            try {
              const { message, systemInstruction } = await getRequestBody(req);
              const apiKey = process.env.GEMINI_API_KEY;

              if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
                // Return offline fallback inside dev server
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

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ text: `[Dev Offline Mode] ${answer}` }));
                return;
              }

              // Initialize the official Google Gen AI Client
              const ai = new GoogleGenAI({
                apiKey: apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              const response = await ai.models.generateContent({
                model: 'gemini-3.5-flash',
                contents: message,
                config: {
                  systemInstruction: systemInstruction || 'You are an encouraging, expert financial coach named GrowBot at GrowFolio. Keep responses crisp, actionable, engaging, and easy to read for retail investors. Use brief bullet points where appropriate.',
                  temperature: 0.7,
                },
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ text: response.text || 'No response text generated.' }));

            } catch (error: any) {
              console.error('Vite Dev API Server Error:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Failed to generate content in Dev Server', details: error.message }));
            }
          });
        },
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
