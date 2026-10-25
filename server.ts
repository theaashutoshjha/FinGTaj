import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { app } from './server/app.js';
import { scheduler } from './server/scheduler.js';
import { renderCrawlerHtml } from './server/ssrRenderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    if (fs.existsSync(DIST_DIR)) {
      app.use(express.static(DIST_DIR));
      const indexPath = path.join(DIST_DIR, 'index.html');

      app.get('/{*splat}', (req, res) => {
        const rawPath = req.path || '';
        const baseUrl = process.env.BASE_URL || 'https://fingtaj.com';

        let baseHtml = '';
        try {
          baseHtml = fs.readFileSync(indexPath, 'utf-8');
        } catch {
          return res.sendFile(indexPath);
        }

        try {
          const renderedHtml = renderCrawlerHtml(rawPath, baseHtml, baseUrl);
          return res.send(renderedHtml);
        } catch (err) {
          console.error('[SSR] Error rendering crawler HTML, falling back:', err);
          return res.send(baseHtml);
        }
      });
    } else {
      app.get('/', (req, res) => {
        res.send('FingTaj build directory not found. Please run "npm run build".');
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FingTaj] Full-Stack Server running at http://0.0.0.0:${PORT} (${isProduction ? 'Production' : 'Development'})`);
    try {
      scheduler.start();
    } catch (err) {
      console.warn('[Scheduler] Startup warning:', err);
    }
  });
}

bootstrap();
