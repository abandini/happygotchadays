import { html } from '../frontend/index.html.js';
import { css } from '../frontend/styles/main.css.js';
import { themeCss } from '../frontend/styles/theme.css.js';
import imgBulldog from '../assets/img/adoption-day-bulldog-camp-pendleton-usmc.webp';
import imgBrothers from '../assets/img/adoption-day-brothers-new-dog-usmc.webp';
import imgKitten from '../assets/img/adoption-day-kitten-play-usmc.webp';
import imgToddler from '../assets/img/adoption-day-toddler-new-puppy-usmc.webp';
import fontYoungSerif from '../assets/fonts/young-serif-latin-400-normal.woff2';
import fontFigtree from '../assets/fonts/figtree-latin-wght-normal.woff2';
import oflYoungSerif from '../assets/fonts/OFL-young-serif.txt';
import oflFigtree from '../assets/fonts/OFL-figtree.txt';
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

  // Theme stylesheet (loaded after main.css)
  if (path === '/styles/theme.css') {
    return new Response(themeCss, { headers: { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': CACHE_STATIC } });
  }

  // Photos, fonts and font licenses (bundled via the wrangler Data rule; long cache, file names change with content)
  const BIN = {
    '/img/adoption-day-bulldog-camp-pendleton-usmc.webp': [imgBulldog, 'image/webp'],
    '/img/adoption-day-brothers-new-dog-usmc.webp': [imgBrothers, 'image/webp'],
    '/img/adoption-day-kitten-play-usmc.webp': [imgKitten, 'image/webp'],
    '/img/adoption-day-toddler-new-puppy-usmc.webp': [imgToddler, 'image/webp'],
    '/fonts/young-serif-latin-400-normal.woff2': [fontYoungSerif, 'font/woff2'],
    '/fonts/figtree-latin-wght-normal.woff2': [fontFigtree, 'font/woff2'],
  };
  if (BIN[path]) {
    return new Response(BIN[path][0], { headers: { 'Content-Type': BIN[path][1], 'Cache-Control': 'public, max-age=31536000, immutable' } });
  }
  if (path === '/fonts/OFL-young-serif.txt' || path === '/fonts/OFL-figtree.txt') {
    return new Response(path.endsWith('young-serif.txt') ? oflYoungSerif : oflFigtree, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': CACHE_STATIC } });
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
