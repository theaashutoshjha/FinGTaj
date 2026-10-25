import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import { app } from './app.js';
import { scheduler } from './scheduler.js';
import { renderCrawlerHtml } from './ssrRenderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '..', 'dist');

const port = process.env.PORT || 3000;

// Static Asset Serving & SPA Fallback for standalone production execution
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
    res.send('FingTaj Backend Server running. Please run "npm run build" to compile frontend.');
  });
}

// Start Server & Background Scheduler
app.listen(port, '0.0.0.0', () => {
  console.log(`========================================================`);
  console.log(`  FingTaj Pro Server running on port ${port} (0.0.0.0)`);
  console.log(`  Public URL: ${process.env.BASE_URL || `http://localhost:${port}`}`);
  console.log(`========================================================`);
  try {
    scheduler.start();
  } catch (err) {
    console.warn('[Scheduler] Startup warning:', err?.message || err);
  }
});

export { app };
