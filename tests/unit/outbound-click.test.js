// Outbound-click tracking: every GA4 page ships an inline listener that sends "outbound_click"
// (same event and parameters as the domain-hub Worker sites) for links that leave happygotchadays.com.
import { describe, it, expect } from 'vitest';
import { runInNewContext } from 'node:vm';
import { OUTBOUND_CLICK_JS } from '../../src/utils/outbound-click.js';
import { seoRoutes as seo } from '../../src/routes/seo.js';
import { html as indexHtml } from '../../src/frontend/index.html.js';

// Runs the inline script on a fake page at `pageUrl`, clicks a link to `href`, returns the gtag calls.
function click(href, pageUrl = 'https://happygotchadays.com/faq', withGtag = true) {
  const calls = [];
  let handler;
  let installs = 0;
  const win = {};
  if (withGtag) win.gtag = (...args) => calls.push(args);
  const ctx = {
    window: win, location: new URL(pageUrl), URL,
    document: { addEventListener: (type, fn, capture) => { if (type === 'click' && capture) { handler = fn; installs++; } } },
    gtag: (...args) => win.gtag(...args),
  };
  const code = OUTBOUND_CLICK_JS.replace(/^<script>/, '').replace(/<\/script>$/, '');
  runInNewContext(code, ctx);
  runInNewContext(code, ctx); // a second copy must not add a second listener
  const a = { href: new URL(href, pageUrl).href, closest: (sel) => (sel === 'a[href]' ? a : null) };
  handler?.({ target: { closest: (sel) => (sel === 'a[href]' ? a : null) } });
  return { calls, installs };
}

const GA_CONFIG = 'gtag("config","G-0TETK91KG0");</script>';

describe('outbound click tracking', () => {
  it('is on the app shell and the server-rendered pages, right after the GA4 config', async () => {
    expect(indexHtml).toContain(GA_CONFIG + OUTBOUND_CLICK_JS);
    for (const path of ['/faq', '/privacy']) {
      const html = await (await seo.request(path)).text();
      expect(html).toContain(GA_CONFIG + OUTBOUND_CLICK_JS);
    }
    expect(OUTBOUND_CLICK_JS).not.toMatch(/src=/);
  });

  it('sends outbound_click with the domain-hub parameters for a same-owner site', () => {
    const { calls, installs } = click('https://brewerytrip.com/blog/dog-friendly-ohio-breweries?utm_source=hgd#top');
    expect(installs).toBe(1);
    expect(calls).toEqual([['event', 'outbound_click', {
      link_domain: 'brewerytrip.com',
      link_url: 'https://brewerytrip.com/blog/dog-friendly-ohio-breweries',
      outbound: true,
      transport_type: 'beacon',
    }]]);
  });

  it('cuts link_url to 100 characters', () => {
    const { calls } = click('https://example.org/' + 'a'.repeat(200));
    expect(calls[0][2].link_url).toHaveLength(100);
  });

  it('ignores internal links (relative, same host, www)', () => {
    expect(click('/privacy').calls).toHaveLength(0);
    expect(click('https://www.happygotchadays.com/shop').calls).toHaveLength(0);
    expect(click('https://happygotchadays.com/', 'https://www.happygotchadays.com/').calls).toHaveLength(0);
  });

  it('ignores non-web links and does nothing when gtag is missing', () => {
    expect(click('mailto:privacy@happygotchadays.com').calls).toHaveLength(0);
    expect(click('https://brewerytrip.com/', undefined, false).calls).toHaveLength(0);
  });
});
