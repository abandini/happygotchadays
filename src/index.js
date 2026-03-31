import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authRoutes } from './routes/auth.js';
import { petRoutes } from './routes/pets.js';
import { photoRoutes } from './routes/photos.js';
import { socialRoutes } from './routes/social.js';
import { searchRoutes } from './routes/search.js';
import { remindersRoutes } from './routes/reminders.js';
import { authMiddleware } from './middleware/auth.js';
import { serveStatic } from './middleware/static.js';
import { seoRoutes } from './routes/seo.js';

const app = new Hono();

const CANONICAL_ORIGIN = 'https://happygotchadays.com';

// HTTP → HTTPS redirect
app.use('*', async (c, next) => {
  if (c.req.header('x-forwarded-proto') === 'http') {
    const url = new URL(c.req.url);
    url.protocol = 'https:';
    return c.redirect(url.toString(), 301);
  }
  await next();
});

// www → non-www redirect (canonical domain)
app.use('*', async (c, next) => {
  const host = c.req.header('host');
  if (host === 'www.happygotchadays.com') {
    const url = new URL(c.req.url);
    url.host = 'happygotchadays.com';
    return c.redirect(url.toString(), 301);
  }
  await next();
});

// BEAST SEO middleware — override meta from KV mutations
app.use('*', async (c, next) => {
  await next();
  if (!c.env.BEAST_SEO) return;
  const ct = c.res.headers.get('content-type') || '';
  if (!ct.includes('text/html')) return;
  const path = new URL(c.req.url).pathname;
  try {
    const raw = await c.env.BEAST_SEO.get(`mutation:gotchadays:${path}`);
    if (!raw) return;
    const m = JSON.parse(raw);
    let replaced = false;
    c.res = new HTMLRewriter()
      .on('title', { text(t) { if (!replaced) { t.replace(m.title); replaced = true; } else { t.remove(); } } })
      .on('meta[name="description"]', { element(e) { e.setAttribute('content', m.description); } })
      .on('meta[property="og:title"]', { element(e) { e.setAttribute('content', m.title); } })
      .on('meta[property="og:description"]', { element(e) { e.setAttribute('content', m.description); } })
      .transform(c.res);
  } catch { /* KV read error — skip */ }
});

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['https://happygotchadays.com', 'https://www.happygotchadays.com'],
  credentials: true,
}));

// Security & cache headers for all responses
app.use('*', async (c, next) => {
  await next();
  // Add security headers
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'SAMEORIGIN');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
});

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'healthy', timestamp: Date.now() });
});

// SEO routes (sitemap, robots.txt, about, faq)
app.route('/', seoRoutes);

// API routes
app.route('/api/auth', authRoutes);
app.route('/api/pets', petRoutes);
app.route('/api/photos', photoRoutes);
app.route('/api/social', socialRoutes);
app.route('/api/search', searchRoutes);
app.route('/api/reminders', remindersRoutes);

// Serve static frontend files
app.use('/*', serveStatic);

// 404 handler — returns HTML for browsers, JSON for API clients
app.notFound((c) => {
  const accept = c.req.header('Accept') || '';
  if (accept.includes('text/html')) {
    return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found - HappyGotchaDays</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="${CANONICAL_ORIGIN}/">
  <style>
    body { font-family: 'Nunito', sans-serif; background: #FFF8E7; text-align: center; padding: 80px 20px; color: #2D3436; }
    h1 { font-size: 4rem; margin-bottom: 0.5rem; }
    p { font-size: 1.25rem; margin-bottom: 2rem; color: #636E72; }
    a { color: #FF6B6B; text-decoration: none; font-weight: 700; font-size: 1.1rem; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>🐾 404</h1>
  <p>This page wandered off! Let's get you back home.</p>
  <a href="/">Back to HappyGotchaDays</a>
</body>
</html>`, 404);
  }
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
