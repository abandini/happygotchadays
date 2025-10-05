import { html } from '../frontend/index.html.js';
import { css } from '../frontend/styles/main.css.js';
import { js } from '../frontend/scripts/app.js.js';
import { manifest } from '../frontend/manifest.json.js';
import { serviceWorker } from '../frontend/sw.js.js';

/**
 * Serve static files from Worker
 */
export async function serveStatic(c, next) {
  const url = new URL(c.req.url);
  const path = url.pathname;

  // Serve HTML
  if (path === '/' || path === '/index.html') {
    return c.html(html);
  }

  // Serve CSS
  if (path === '/styles/main.css') {
    return new Response(css, {
      headers: { 'Content-Type': 'text/css' }
    });
  }

  // Serve JavaScript
  if (path === '/scripts/app.js') {
    return new Response(js, {
      headers: { 'Content-Type': 'application/javascript' }
    });
  }

  // Serve PWA manifest
  if (path === '/manifest.json') {
    return c.json(manifest);
  }

  // Serve service worker
  if (path === '/sw.js') {
    return new Response(serviceWorker, {
      headers: { 'Content-Type': 'application/javascript' }
    });
  }

  await next();
}
