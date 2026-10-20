import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import { apiRouter } from './apiRouter.js';
import { storage } from './services/storage.js';

export async function createServer() {
  await storage.init();

  const app = express();

  // Basic security and parsing middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Dynamic /app-ads.txt endpoint served from organization settings
  app.get('/app-ads.txt', async (_req: Request, res: Response) => {
    try {
      const settings = await storage.getSettings();
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.send(settings.appAdsTxtContent || '# KHB Private Limited - app-ads.txt\n');
    } catch (err) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.send('# KHB Private Limited - app-ads.txt\n');
    }
  });

  // REST API router
  app.use('/api', apiRouter);

  // Serve static files in production
  const distPath = path.resolve(process.cwd(), 'dist');
  app.use(express.static(distPath));

  // SPA fallback
  app.get('*', (req: Request, res: Response, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        // In dev mode when dist/ might not exist yet, pass through
        next();
      }
    });
  });

  return app;
}

// Standalone execution (e.g. `node server.ts` or `npm start` on Render)
if (process.argv[1] && (process.argv[1].endsWith('server.ts') || process.argv[1].endsWith('server.js'))) {
  const PORT = process.env.PORT || 3000;
  createServer().then((app) => {
    app.listen(PORT, () => {
      console.log(`[KHB Server] Running full-stack production server on port ${PORT}`);
    });
  });
}
