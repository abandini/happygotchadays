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

describe('what-is-gotcha-day explainer', () => {
  it('renders every Q&A as an h2, cites its sources, and mirrors the visible text in FAQPage JSON-LD', async () => {
    const { EXPLAINER_QA } = await import('../../src/routes/seo.js');
    const res = await seo.request('/what-is-gotcha-day');
    expect(res.status).toBe(200);
    const html = await res.text();
    for (const f of EXPLAINER_QA) expect(html).toContain(`>${f.q}</h2>`);
    expect(html).toContain('https://www.shelteranimalscount.org/2025-report/');
    expect(html).toContain('https://www.dictionary.com/e/pop-culture/gotcha-day/');
    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const faq = ld.find((x) => x['@type'] === 'FAQPage');
    expect(faq.mainEntity.map((q) => q.name)).toEqual(EXPLAINER_QA.map((f) => f.q));
  });
  it('is in the sitemap', async () => {
    const xml = await (await seo.request('/sitemap.xml')).text();
    expect(xml).toContain('https://happygotchadays.com/what-is-gotcha-day');
  });
});
