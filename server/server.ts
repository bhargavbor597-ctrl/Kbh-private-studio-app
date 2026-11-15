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

  // Google Search Console verification file
  app.get('/google8ead62883de26aa2.html', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send('google-site-verification: google8ead62883de26aa2.html');
  });

  // Standalone HTML privacy policy for any app with custom privacyPolicyHtml
  app.get('/apps/:slug/privacy.html', async (req: Request, res: Response, next) => {
    try {
      const appItem = await storage.getAppBySlug(req.params.slug);
      if (appItem && appItem.privacyPolicyHtml) {
        const sanitized = appItem.privacyPolicyHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(sanitized);
      }
      return next();
    } catch {
      return next();
    }
  });

  // REST API router
  app.use('/api', apiRouter);

  // Serve static files in production
  const distPath = path.resolve(process.cwd(), 'dist');
  app.use(express.static(distPath, { redirect: false }));

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
