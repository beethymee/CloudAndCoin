import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleGeminiChat } from './server/geminiHandler';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API status check
  app.get('/api', (req, res) => {
    res.json({
      status: 'online',
      runtime: 'Node.js 22',
      app: 'FinTrack AI',
      endpoints: ['/api/chat', '/api'],
    });
  });

  // API route for Gemini Chat
  app.post('/api/chat', async (req, res) => {
    try {
      const result = await handleGeminiChat(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    // Serve static assets from dist
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Development mode: mount Vite dev server middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`FinTrack AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
