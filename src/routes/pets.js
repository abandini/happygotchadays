import { Hono } from 'hono';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { generateId, timestamp } from '../utils/id.js';

const pets = new Hono();

/**
 * POST /api/pets
 * Create a new pet profile
 */
pets.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const { name, species, breed, gotchaDate, adoptionStory, isPublic } = await c.req.json();

    // Validation
    if (!name || !species || !gotchaDate) {
      return c.json({ error: 'Name, species, and gotcha date are required' }, 400);
    }

    if (!['dog', 'cat'].includes(species)) {
      return c.json({ error: 'Species must be either "dog" or "cat"' }, 400);
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(gotchaDate)) {
      return c.json({ error: 'Gotcha date must be in YYYY-MM-DD format' }, 400);
    }

    // Create pet
    const petId = generateId();
    const now = timestamp();

    await c.env.DB.prepare(
      `INSERT INTO pets (id, user_id, name, species, breed, gotcha_date, adoption_story, created_at, is_public)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      petId,
      user.id,
      name,
      species,
      breed || null,
      gotchaDate,
      adoptionStory || null,
      now,
      isPublic !== false ? 1 : 0
    ).run();

    const pet = await c.env.DB.prepare(
      'SELECT * FROM pets WHERE id = ?'
    ).bind(petId).first();

    return c.json({ pet }, 201);

  } catch (error) {
    console.error('Create pet error:', error);
    return c.json({ error: 'Failed to create pet profile' }, 500);
  }
});

/**
 * GET /api/pets/:id
 * Get pet profile by ID
 */
pets.get('/:id', optionalAuth, async (c) => {
  try {
    const petId = c.req.param('id');
    const user = c.get('user');

    const pet = await c.env.DB.prepare(
      'SELECT * FROM pets WHERE id = ?'
    ).bind(petId).first();

    if (!pet) {
      return c.json({ error: 'Pet not found' }, 404);
    }

    // Check if pet is private and user is not the owner
    if (!pet.is_public && (!user || user.id !== pet.user_id)) {
      return c.json({ error: 'Pet profile is private' }, 403);
    }

    // Get owner info
    const owner = await c.env.DB.prepare(
      'SELECT id, username, avatar_url FROM users WHERE id = ?'
    ).bind(pet.user_id).first();

    // Get photos
    const { results: photos } = await c.env.DB.prepare(
      'SELECT id, r2_object_key, caption, uploaded_at FROM photos WHERE pet_id = ? ORDER BY uploaded_at DESC'
    ).bind(petId).all();

    return c.json({
      pet: {
        ...pet,
        owner,
        photos
      }
    });

  } catch (error) {
    console.error('Get pet error:', error);
    return c.json({ error: 'Failed to retrieve pet profile' }, 500);
  }
});

/**
 * PUT /api/pets/:id
 * Update pet profile
 */
pets.put('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const petId = c.req.param('id');
    const updates = await c.req.json();

    // Check ownership
    const pet = await c.env.DB.prepare(
      'SELECT user_id FROM pets WHERE id = ?'
    ).bind(petId).first();

    if (!pet) {
      return c.json({ error: 'Pet not found' }, 404);
    }

    if (pet.user_id !== user.id) {
      return c.json({ error: 'Not authorized to update this pet' }, 403);
    }

    // Build update query
    const allowedFields = ['name', 'species', 'breed', 'gotcha_date', 'adoption_story', 'is_public', 'profile_photo_url'];
    const updateFields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updateFields.length === 0) {
      return c.json({ error: 'No valid fields to update' }, 400);
    }

    values.push(petId);

    await c.env.DB.prepare(
      `UPDATE pets SET ${updateFields.join(', ')} WHERE id = ?`
    ).bind(...values).run();

    const updatedPet = await c.env.DB.prepare(
      'SELECT * FROM pets WHERE id = ?'
    ).bind(petId).first();

    return c.json({ pet: updatedPet });

  } catch (error) {
    console.error('Update pet error:', error);
    return c.json({ error: 'Failed to update pet profile' }, 500);
  }
});

/**
 * DELETE /api/pets/:id
 * Delete pet profile
 */
pets.delete('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const petId = c.req.param('id');

    // Check ownership
    const pet = await c.env.DB.prepare(
      'SELECT user_id FROM pets WHERE id = ?'
    ).bind(petId).first();

    if (!pet) {
      return c.json({ error: 'Pet not found' }, 404);
    }

    if (pet.user_id !== user.id) {
      return c.json({ error: 'Not authorized to delete this pet' }, 403);
    }

    // Get all photos for this pet to delete from R2
    const { results: photos } = await c.env.DB.prepare(
      'SELECT r2_object_key FROM photos WHERE pet_id = ?'
    ).bind(petId).all();

    // Delete photos from R2 bucket
    if (photos && photos.length > 0 && c.env.PHOTOS) {
      const deletePromises = photos
        .filter(p => p.r2_object_key)
        .map(p => c.env.PHOTOS.delete(p.r2_object_key));

      await Promise.allSettled(deletePromises);
    }

    // Delete pet (cascade will handle related DB records)
    await c.env.DB.prepare(
      'DELETE FROM pets WHERE id = ?'
    ).bind(petId).run();

    return c.json({ success: true });

  } catch (error) {
    console.error('Delete pet error:', error);
    return c.json({ error: 'Failed to delete pet profile' }, 500);
  }
});

/**
 * GET /api/pets/user/:userId
 * Get all pets for a user
 */
pets.get('/user/:userId', optionalAuth, async (c) => {
  try {
    const userId = c.req.param('userId');
    const currentUser = c.get('user');

    // If viewing own pets, show all. Otherwise, only show public
    let query = 'SELECT * FROM pets WHERE user_id = ?';
    if (!currentUser || currentUser.id !== userId) {
      query += ' AND is_public = 1';
    }
    query += ' ORDER BY created_at DESC';

    const { results: pets } = await c.env.DB.prepare(query).bind(userId).all();

    return c.json({ pets });

  } catch (error) {
    console.error('Get user pets error:', error);
    return c.json({ error: 'Failed to retrieve pets' }, 500);
  }
});

export { pets as petRoutes };
