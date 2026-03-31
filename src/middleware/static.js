import { html } from '../frontend/index.html.js';
import { css } from '../frontend/styles/main.css.js';
import { js } from '../frontend/scripts/app.js.js';
import { manifest } from '../frontend/manifest.json.js';
import { serviceWorker } from '../frontend/sw.js.js';

// Cache durations
const CACHE_STATIC = 'public, max-age=604800, stale-while-revalidate=86400'; // 7 days
const CACHE_HTML = 'public, max-age=3600, stale-while-revalidate=600'; // 1 hour

/**
 * Serve static files from Worker with proper cache headers
 */
export async function serveStatic(c, next) {
  const url = new URL(c.req.url);
  const path = url.pathname;

  // Serve HTML
  if (path === '/' || path === '/index.html') {
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': CACHE_HTML,
      },
    });
  }

  // Serve CSS
  if (path === '/styles/main.css') {
    return new Response(css, {
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Cache-Control': CACHE_STATIC,
      },
    });
  }

  // Serve JavaScript
  if (path === '/scripts/app.js') {
    return new Response(js, {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': CACHE_STATIC,
      },
    });
  }

  // Serve PWA manifest
  if (path === '/manifest.json') {
    return new Response(JSON.stringify(manifest), {
      headers: {
        'Content-Type': 'application/manifest+json; charset=utf-8',
        'Cache-Control': CACHE_STATIC,
      },
    });
  }

  // Serve service worker (must not be cached aggressively)
  if (path === '/sw.js') {
    return new Response(serviceWorker, {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Service-Worker-Allowed': '/',
      },
    });
  }

  await next();
}
