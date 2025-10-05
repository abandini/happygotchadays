import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authRoutes } from './routes/auth.js';
import { petRoutes } from './routes/pets.js';
import { photoRoutes } from './routes/photos.js';
import { socialRoutes } from './routes/social.js';
import { searchRoutes } from './routes/search.js';
import { authMiddleware } from './middleware/auth.js';
import { serveStatic } from './middleware/static.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['https://happygotchadays.com', 'https://www.happygotchadays.com'],
  credentials: true,
}));

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'healthy', timestamp: Date.now() });
});

// API routes
app.route('/api/auth', authRoutes);
app.route('/api/pets', petRoutes);
app.route('/api/photos', photoRoutes);
app.route('/api/social', socialRoutes);
app.route('/api/search', searchRoutes);

// Serve static frontend files
app.use('/*', serveStatic);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
