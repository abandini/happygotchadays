import { describe, it, expect } from 'vitest';
import { seoRoutes as seo } from '../../src/routes/seo.js';
import { html as indexHtml } from '../../src/frontend/index.html.js';

describe('FAQ page', () => {
  it('links the dog-friendly brewery guide with nofollow, and keeps HTML out of the JSON-LD', async () => {
    const res = await seo.request('/faq');
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain('href="https://brewerytrip.com/blog/dog-friendly-ohio-breweries" rel="nofollow noopener"');
    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');
    expect(ld).toContain('Where can I take my dog to celebrate a gotcha day?');
    expect(ld).not.toContain('<a href');
  });
});

describe('home page', () => {
  it('shows no hard-coded community count', () => {
    expect(indexHtml).toContain('Celebrating a gotcha day this week?');
    expect(indexHtml).not.toMatch(/\d+<\/strong> pets are celebrating/);
  });
});
