import { html } from '../frontend/index.html.js';
import { css } from '../frontend/styles/main.css.js';
import { js } from '../frontend/scripts/app.js.js';
import { manifest } from '../frontend/manifest.json.js';
import { serviceWorker } from '../frontend/sw.js.js';
import ogImage from '../assets/og-image.png';
import appleTouchIcon from '../assets/apple-touch-icon.png';
import favicon32 from '../assets/favicon-32x32.png';
import favicon16 from '../assets/favicon-16x16.png';
import icon72 from '../assets/icons/icon-72x72.png';
import icon96 from '../assets/icons/icon-96x96.png';
import icon128 from '../assets/icons/icon-128x128.png';
import icon144 from '../assets/icons/icon-144x144.png';
import icon152 from '../assets/icons/icon-152x152.png';
import icon192 from '../assets/icons/icon-192x192.png';
import icon384 from '../assets/icons/icon-384x384.png';
import icon512 from '../assets/icons/icon-512x512.png';

// Cache durations
const CACHE_STATIC = 'public, max-age=604800, stale-while-revalidate=86400'; // 7 days
const CACHE_HTML = 'public, max-age=3600, stale-while-revalidate=600'; // 1 hour

// Binary PNG assets bundled via the wrangler `Data` rule (see wrangler.toml)
const PNG_ASSETS = {
  '/og-image.png': ogImage,
  '/apple-touch-icon.png': appleTouchIcon,
  '/favicon-32x32.png': favicon32,
  '/favicon-16x16.png': favicon16,
  '/favicon.ico': favicon32,
  '/icons/icon-72x72.png': icon72,
  '/icons/icon-96x96.png': icon96,
  '/icons/icon-128x128.png': icon128,
  '/icons/icon-144x144.png': icon144,
  '/icons/icon-152x152.png': icon152,
  '/icons/icon-192x192.png': icon192,
  '/icons/icon-384x384.png': icon384,
  '/icons/icon-512x512.png': icon512,
};

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

  // Serve PNG assets (og-image, favicons, PWA icons)
  if (PNG_ASSETS[path]) {
    return new Response(PNG_ASSETS[path], {
      headers: {
        'Content-Type': 'image/png',
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
