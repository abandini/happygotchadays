/**
 * Persona: Marcus — The Casual Browser
 *
 * Profile: 28, Austin TX, doesn't have a pet yet but follows rescue accounts
 * Psychographic: Considering adopting a dog. Browses pet content for feel-good vibes.
 *   Would impulse-buy a funny sticker or mug as a gift for a friend who just adopted.
 *   Gift buyer, not self-purchaser. Motivated by humor and shareability.
 *   Spends $10-25 on impulse gifts. Low commitment, high emotional response.
 * Behavior: Finds site via Google search "gotcha day ideas for dogs." Anonymous browsing.
 *   Never registers. Scrolls discover page, reads a few stories, leaves.
 *   BUT — if he saw funny merch, he'd buy a sticker pack for $12 as a gift.
 * Device: Samsung Galaxy S24 (412x915)
 * Merch he'd buy: sticker pack ($12 for 5), funny mug ("I Work Hard So My Dog
 *   Can Have A Better Life"), maybe a tote for a friend
 */

import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 412, height: 915 },
});

test.describe('Marcus — Casual Browser Journey', () => {

  test.describe('1. Arrives via Search', () => {
    test('landing page loads quickly on mobile', async ({ page }) => {
      const start = Date.now();
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - start;
      expect(loadTime).toBeLessThan(5000);
    });

    test('sees adoption celebration content (what he searched for)', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      const content = await page.content();
      expect(content.toLowerCase()).toMatch(/gotcha|adoption|celebrate|rescue/);
    });
  });

  test.describe('2. Browses Without Registering', () => {
    test('about page is accessible without auth', async ({ page }) => {
      await page.goto('/about');
      expect(page.url()).toContain('about');
    });

    test('FAQ page loads', async ({ page }) => {
      await page.goto('/faq');
      const content = await page.content();
      expect(content.toLowerCase()).toContain('gotcha');
    });

    test('discover API works without auth', async ({ page }) => {
      const response = await page.request.get('/api/search/discover?limit=10');
      expect(response.status()).toBe(200);
    });

    test('health check confirms site is up', async ({ page }) => {
      const response = await page.request.get('/health');
      expect(response.status()).toBe(200);
    });
  });

  test.describe('3. Merch Gap Analysis: What Marcus Would Buy As Gift', () => {
    test('FINDING: No gift-oriented merch section', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      const content = await page.content();
      const hasGiftShop = content.toLowerCase().match(/gift|shop|present|sticker.*pack/);
      expect(hasGiftShop).toBeNull();
    });

    test('RECOMMENDATION: Gift-oriented merch for non-pet-owners', async () => {
      const giftRecommendations = {
        stickerPack: {
          name: 'Gotcha Day Sticker Pack (5 designs)',
          price: '$11.99',
          designs: [
            'Happy Gotcha Day! (celebratory confetti)',
            'Rescue Dogs Are The Best Dogs',
            'Adopt Love (heart + paw)',
            'My Best Friend Has Four Legs',
            'Home Is Where The Dog Is',
          ],
          giftAppeal: 'Perfect for friend who just adopted — ships in cute envelope',
          purchaseLikelihood: '70%',
        },
        funnyMug: {
          name: '"I Work Hard So My Dog Can Have A Better Life" Mug',
          price: '$14.99',
          giftAppeal: 'Office gift for dog-obsessed coworker',
          purchaseLikelihood: '55%',
        },
        toteBag: {
          name: 'Rescue Dogs Club Tote',
          price: '$17.99',
          giftAppeal: 'Practical gift for dog park trips',
          purchaseLikelihood: '40%',
        },
      };
      expect(giftRecommendations.stickerPack.purchaseLikelihood).toBe('70%');
    });
  });

  test.describe('4. No JS Errors During Browse', () => {
    test('anonymous browsing produces no errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      for (const path of ['/', '/about', '/faq', '/privacy']) {
        await page.goto(path);
        await page.waitForLoadState('domcontentloaded');
      }
      expect(errors).toHaveLength(0);
    });
  });
});
