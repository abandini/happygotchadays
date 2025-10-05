import { Hono } from 'hono';

const search = new Hono();

/**
 * GET /api/search
 * Search for pets and users
 */
search.get('/', async (c) => {
  try {
    const query = c.req.query('q');
    const type = c.req.query('type') || 'all'; // 'pets', 'users', or 'all'
    const limit = parseInt(c.req.query('limit') || '20');

    if (!query || query.trim().length < 2) {
      return c.json({ error: 'Search query must be at least 2 characters' }, 400);
    }

    const searchTerm = `%${query}%`;
    const results = {};

    // Search pets
    if (type === 'pets' || type === 'all') {
      const { results: pets } = await c.env.DB.prepare(
        `SELECT p.*, u.username as owner_username
         FROM pets p
         JOIN users u ON p.user_id = u.id
         WHERE p.is_public = 1 AND (p.name LIKE ? OR p.breed LIKE ?)
         ORDER BY p.created_at DESC
         LIMIT ?`
      ).bind(searchTerm, searchTerm, limit).all();
      results.pets = pets;
    }

    // Search users
    if (type === 'users' || type === 'all') {
      const { results: users } = await c.env.DB.prepare(
        `SELECT id, username, bio, avatar_url, created_at
         FROM users
         WHERE username LIKE ?
         LIMIT ?`
      ).bind(searchTerm, limit).all();
      results.users = users;
    }

    return c.json(results);

  } catch (error) {
    console.error('Search error:', error);
    return c.json({ error: 'Search failed' }, 500);
  }
});

/**
 * GET /api/search/discover
 * Discover new pets (trending, recent)
 */
search.get('/discover', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');

    // Get recent public pets with their latest posts
    const { results: pets } = await c.env.DB.prepare(
      `SELECT p.*, u.username as owner_username, u.avatar_url as owner_avatar
       FROM pets p
       JOIN users u ON p.user_id = u.id
       WHERE p.is_public = 1
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`
    ).bind(limit, offset).all();

    return c.json({ pets });

  } catch (error) {
    console.error('Discover error:', error);
    return c.json({ error: 'Discovery failed' }, 500);
  }
});

/**
 * GET /api/search/upcoming-gotcha-days
 * Get upcoming gotcha day anniversaries
 */
search.get('/upcoming-gotcha-days', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '20');

    // Get current date
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentDay = String(today.getDate()).padStart(2, '0');
    const currentDate = `${currentMonth}-${currentDay}`;

    // Find pets with upcoming gotcha days (within next 30 days)
    const { results: pets } = await c.env.DB.prepare(
      `SELECT p.*, u.username as owner_username, u.avatar_url as owner_avatar
       FROM pets p
       JOIN users u ON p.user_id = u.id
       WHERE p.is_public = 1
       ORDER BY substr(p.gotcha_date, 6) ASC
       LIMIT ?`
    ).bind(limit).all();

    // Calculate days until next anniversary for each pet
    pets.forEach(pet => {
      const gotchaDate = new Date(pet.gotcha_date);
      const thisYear = today.getFullYear();
      let nextAnniversary = new Date(thisYear, gotchaDate.getMonth(), gotchaDate.getDate());

      if (nextAnniversary < today) {
        nextAnniversary = new Date(thisYear + 1, gotchaDate.getMonth(), gotchaDate.getDate());
      }

      const daysUntil = Math.ceil((nextAnniversary - today) / (1000 * 60 * 60 * 24));
      const yearsWithFamily = thisYear - gotchaDate.getFullYear();

      pet.days_until_anniversary = daysUntil;
      pet.years_with_family = yearsWithFamily;
    });

    // Sort by days until anniversary
    pets.sort((a, b) => a.days_until_anniversary - b.days_until_anniversary);

    return c.json({ pets: pets.slice(0, limit) });

  } catch (error) {
    console.error('Upcoming gotcha days error:', error);
    return c.json({ error: 'Failed to retrieve upcoming gotcha days' }, 500);
  }
});

export { search as searchRoutes };
