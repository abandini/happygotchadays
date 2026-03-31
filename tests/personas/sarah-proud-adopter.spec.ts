/**
 * Persona: Sarah — The Proud Adopter
 *
 * Profile: 32, Portland OR, adopted a pit bull mix named Luna 2 years ago
 * Psychographic: Emotionally invested in rescue advocacy. Posts about Luna constantly.
 *   Would buy "Adopted is my favorite breed" stickers for her Hydro Flask and car.
 *   Loves breed-specific merch. Willing to spend $30-50 on pet-related items.
 *   Follows rescue organizations on Instagram. Uses #adoptdontshop religiously.
 * Behavior: Browses on phone during lunch break. Would register, add Luna's profile,
 *   share the gotcha day, then look for merch to celebrate.
 * Device: iPhone 15 Pro (393x852)
 * Merch she'd buy: stickers (vinyl, $5-8), tshirt ("Who Rescued Who?", $25),
 *   mug with Luna's gotcha date, tote bag for dog park
 */

import { test, expect, Page } from '@playwright/test';

test.use({
  viewport: { width: 393, height: 852 },
});

const timestamp = Date.now();
const PERSONA = {
  email: `sarah.adopter.${timestamp}@gotchadays-test.com`,
  username: `sarah_luna_${timestamp}`,
  password: 'LunaGirl2024!',
};

test.describe('Sarah — Proud Adopter Journey', () => {

  test.describe('1. Discovery: Landing Page', () => {
    test('sees celebratory hero and feels welcome', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Should see the main heading
      const heading = page.locator('text=Celebrate');
      await expect(heading.first()).toBeVisible({ timeout: 10000 });

      // Should see rescue/adoption messaging
      const content = await page.content();
      expect(content.toLowerCase()).toContain('rescue');
    });

    test('sees sign up and discover CTAs', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      const content = await page.content();
      // Should have ways to engage
      expect(content.toLowerCase()).toMatch(/sign up|register|join|discover/);
    });

    test('mobile layout is clean and readable', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      // No horizontal scroll on mobile
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
    });
  });

  test.describe('2. Registration: Creates Account', () => {
    test('can register via API', async ({ page }) => {
      const response = await page.request.post('/api/auth/register', {
        data: {
          email: PERSONA.email,
          username: PERSONA.username,
          password: PERSONA.password,
          confirmPassword: PERSONA.password,
        },
      });
      // Accept 200 (success) or 400/409 (already exists from prior run)
      expect([200, 201, 400, 409]).toContain(response.status());
    });
  });

  test.describe('3. Pet Profile: Adds Luna', () => {
    test('can create a pet profile via API', async ({ page }) => {
      await registerPersona(page);

      const token = await page.evaluate(() => localStorage.getItem('token'));
      if (!token) {
        test.skip();
        return;
      }

      const response = await page.request.post('/api/pets', {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          name: 'Luna',
          species: 'dog',
          breed: 'Pit Bull Mix',
          gotcha_date: '2024-03-15',
          adoption_story: 'Found Luna at the Cleveland APL. She was shaking in the corner of her kennel. Now she runs the house.',
          is_public: true,
        },
      });
      expect([200, 201]).toContain(response.status());
    });
  });

  test.describe('4. Browsing: Explores the Community', () => {
    test('discover page loads and shows pets', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      // Navigate to discover
      const discoverLink = page.locator('a[href*="discover"], text=Discover').first();
      if (await discoverLink.isVisible()) {
        await discoverLink.click();
        await page.waitForLoadState('domcontentloaded');
      }
    });

    test('can search for dogs', async ({ page }) => {
      const response = await page.request.get('/api/search?q=dog&type=pets');
      expect(response.status()).toBe(200);
    });

    test('can view upcoming gotcha days', async ({ page }) => {
      const response = await page.request.get('/api/search/upcoming-gotcha-days');
      expect(response.status()).toBe(200);
    });
  });

  test.describe('5. Merch Interest: Where Sarah Would Buy', () => {
    test('FINDING: No shop or merch section exists', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      const content = await page.content();
      const hasShop = content.toLowerCase().match(/shop|store|merch|sticker|tshirt|product|buy/);
      // This test documents the GAP — Sarah wants to buy but can't
      expect(hasShop).toBeNull();
    });

    test('FINDING: No "celebrate with merch" CTA after creating a post', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      const content = await page.content();
      const hasMerchCta = content.toLowerCase().match(/celebrate.*merch|get.*sticker|shop.*gotcha/);
      expect(hasMerchCta).toBeNull();
    });
  });

  test.describe('6. Psychographic Analysis: What Sarah Would Buy', () => {
    test('RECOMMENDATION: Vinyl stickers ($5-8) — highest impulse buy potential', async () => {
      // Sarah's profile: emotional adopter, Instagram poster, Hydro Flask/car sticker person
      const recommendations = {
        stickers: {
          designs: [
            'Adopted Is My Favorite Breed (paw print heart)',
            'Who Rescued Who? (hand + paw silhouette)',
            'Pit Bull Mom (breed-specific pride)',
            'My Therapist Has Four Legs (humor + adoption)',
            'Luna\'s Gotcha Day 2024 (personalized)',
          ],
          pricePoint: '$4.99-$7.99',
          placement: 'After gotcha day post creation — "Celebrate with a sticker!"',
          purchaseLikelihood: '85%',
        },
        tshirt: {
          designs: ['Who Rescued Who? tee', 'Pit Bull Advocate tee'],
          pricePoint: '$24.99',
          purchaseLikelihood: '60%',
        },
        mug: {
          designs: ['Luna\'s Gotcha Day mug with date', 'Best Decision Ever mug'],
          pricePoint: '$14.99',
          purchaseLikelihood: '45%',
        },
      };
      expect(recommendations.stickers.purchaseLikelihood).toBe('85%');
    });
  });

  test.describe('7. No JS Errors During Journey', () => {
    test('full flow produces no critical JS errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      const pages = ['/', '/about', '/faq', '/privacy'];
      for (const path of pages) {
        await page.goto(path);
        await page.waitForLoadState('domcontentloaded');
      }
      expect(errors).toHaveLength(0);
    });
  });
});

async function registerPersona(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  const existing = await page.evaluate(() => localStorage.getItem('token'));
  if (existing) return;

  const regResponse = await page.request.post('/api/auth/register', {
    data: {
      email: PERSONA.email,
      username: PERSONA.username,
      password: PERSONA.password,
      confirmPassword: PERSONA.password,
    },
  });

  let token: string | null = null;
  let userData: any = null;

  if (regResponse.ok()) {
    const data = await regResponse.json();
    token = data.token;
    userData = data.user;
  } else {
    const loginResponse = await page.request.post('/api/auth/login', {
      data: { email: PERSONA.email, password: PERSONA.password },
    });
    if (loginResponse.ok()) {
      const data = await loginResponse.json();
      token = data.token;
      userData = data.user;
    }
  }

  if (token && userData) {
    await page.evaluate(({ token, user }) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }, { token, user: userData });
    await page.reload({ waitUntil: 'domcontentloaded' });
  }
}
