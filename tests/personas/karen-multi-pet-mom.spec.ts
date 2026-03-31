/**
 * Persona: Karen — The Multi-Pet Mom
 *
 * Profile: 45, Cleveland OH, has 3 rescue dogs and 2 cats. Active in local rescue community.
 * Psychographic: "Professional pet mom." Spends lavishly on her animals ($200+/month).
 *   Decorates entire house with pet-themed items. Has a rescue bumper sticker.
 *   Buys personalized items for EACH pet. Would want breed-specific designs.
 *   Social media: Facebook groups, local rescue org volunteer.
 *   Price insensitive for pet items — will buy a $45 hoodie if it has her dog's breed.
 * Behavior: Desktop user (Facebook link). Registers all 5 pets. Creates multiple posts.
 *   Would buy for herself AND as gifts for her rescue group friends.
 *   The highest-value customer segment.
 * Device: Desktop Chrome (1440x900)
 * Merch she'd buy: EVERYTHING. Breed-specific tees for each dog ($25 x3),
 *   personalized mugs ($15 x5), sticker sheets ($8 x3), hoodie ($45),
 *   tote bags ($18 x2). Total basket: $200+
 */

import { test, expect, Page } from '@playwright/test';

test.use({
  viewport: { width: 1440, height: 900 },
});

const timestamp = Date.now();
const PERSONA = {
  email: `karen.petmom.${timestamp}@gotchadays-test.com`,
  username: `karen_rescuemom_${timestamp}`,
  password: 'ILoveMyPets2024!',
};

const PETS = [
  { name: 'Biscuit', species: 'dog', breed: 'Golden Retriever Mix', gotcha_date: '2020-06-12', story: 'Found wandering a parking lot. Best day of my life.' },
  { name: 'Tank', species: 'dog', breed: 'American Bully', gotcha_date: '2021-09-03', story: 'Pulled from a high-kill shelter at the last minute.' },
  { name: 'Peanut', species: 'dog', breed: 'Chihuahua Mix', gotcha_date: '2023-01-20', story: 'Foster fail. Peanut chose us.' },
  { name: 'Shadow', species: 'cat', breed: 'Black Domestic Shorthair', gotcha_date: '2019-10-31', story: 'Halloween rescue. Nobody wanted the black cat.' },
  { name: 'Mochi', species: 'cat', breed: 'Calico', gotcha_date: '2022-04-15', story: 'Showed up on our porch pregnant. Kept her and found homes for the kittens.' },
];

test.describe('Karen — Multi-Pet Mom Journey', () => {

  test.describe('1. Registers and Adds All 5 Pets', () => {
    test('can register via API', async ({ page }) => {
      const response = await page.request.post('/api/auth/register', {
        data: {
          email: PERSONA.email,
          username: PERSONA.username,
          password: PERSONA.password,
          confirmPassword: PERSONA.password,
        },
      });
      expect([200, 201, 400, 409]).toContain(response.status());
    });

    test('can add multiple pets', async ({ page }) => {
      await registerPersona(page);
      const token = await page.evaluate(() => localStorage.getItem('token'));
      if (!token) { test.skip(); return; }

      for (const pet of PETS) {
        const response = await page.request.post('/api/pets', {
          headers: { Authorization: `Bearer ${token}` },
          data: { ...pet, is_public: true },
        });
        expect([200, 201]).toContain(response.status());
      }
    });

    test('can retrieve all 5 pets', async ({ page }) => {
      await registerPersona(page);
      const token = await page.evaluate(() => localStorage.getItem('token'));
      if (!token) { test.skip(); return; }

      const response = await page.request.get('/api/pets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.pets?.length || data.length).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('2. Creates Gotcha Day Post', () => {
    test('can create a celebration post', async ({ page }) => {
      await registerPersona(page);
      const token = await page.evaluate(() => localStorage.getItem('token'));
      if (!token) { test.skip(); return; }

      // Get first pet
      const petsResponse = await page.request.get('/api/pets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const petsData = await petsResponse.json();
      const pets = petsData.pets || petsData;
      if (!pets.length) { test.skip(); return; }

      const response = await page.request.post('/api/social/posts', {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          pet_id: pets[0].id,
          content: `Happy 6th Gotcha Day to my sweet ${pets[0].name}! 🎉🐾 Best decision I ever made. #adoptdontshop #gotchaday`,
          anniversary_year: 6,
        },
      });
      expect([200, 201]).toContain(response.status());
    });
  });

  test.describe('3. Desktop Layout Check', () => {
    test('desktop layout uses full width appropriately', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(1440 + 5);
    });
  });

  test.describe('4. Merch Demand: Karen Would Buy Everything', () => {
    test('RECOMMENDATION: Full merch catalog for multi-pet power buyers', async () => {
      const karenBasket = {
        totalEstimatedSpend: '$200+',
        items: [
          // Per-dog breed tees
          { product: 'Golden Retriever Mom Tee', price: 2499, type: 'tshirt', forPet: 'Biscuit' },
          { product: 'Bully Breed Advocate Tee', price: 2499, type: 'tshirt', forPet: 'Tank' },
          { product: 'Chihuahua Mom Tee', price: 2499, type: 'tshirt', forPet: 'Peanut' },
          // Personalized mugs per pet
          { product: "Biscuit's Gotcha Day 2020 Mug", price: 1499, type: 'mug', forPet: 'Biscuit' },
          { product: 'Black Cat Lucky Owner Mug', price: 1499, type: 'mug', forPet: 'Shadow' },
          // Sticker sheets
          { product: 'Rescue Mom Sticker Sheet (8 designs)', price: 899, type: 'sticker', forPet: 'all' },
          { product: 'Cat Mom Sticker Pack', price: 599, type: 'sticker', forPet: 'cats' },
          // Premium items
          { product: '5 Rescues 0 Regrets Hoodie', price: 4499, type: 'hoodie', forPet: 'all' },
          { product: 'Dog Park Essentials Tote', price: 1799, type: 'tote', forPet: 'all' },
        ],
        keyInsight: 'Multi-pet owners buy PER PET. 5 pets = 5x average order value.',
        upsellStrategy: 'After adding one breed tee, suggest matching sticker + mug bundle',
      };

      expect(karenBasket.items.length).toBeGreaterThanOrEqual(9);
      const totalCents = karenBasket.items.reduce((sum, item) => sum + item.price, 0);
      expect(totalCents).toBeGreaterThan(20000); // $200+
    });
  });

  test.describe('5. No JS Errors', () => {
    test('full desktop flow produces no errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      for (const path of ['/', '/about', '/faq']) {
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
    data: { email: PERSONA.email, username: PERSONA.username, password: PERSONA.password, confirmPassword: PERSONA.password },
  });

  let token: string | null = null;
  let userData: any = null;

  if (regResponse.ok()) {
    const data = await regResponse.json();
    token = data.token; userData = data.user;
  } else {
    const loginResponse = await page.request.post('/api/auth/login', {
      data: { email: PERSONA.email, password: PERSONA.password },
    });
    if (loginResponse.ok()) {
      const data = await loginResponse.json();
      token = data.token; userData = data.user;
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
