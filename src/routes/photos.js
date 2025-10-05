import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import { generateId, timestamp } from '../utils/id.js';

const photos = new Hono();

/**
 * POST /api/photos/upload
 * Upload a photo to R2
 */
photos.post('/upload', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const formData = await c.req.formData();
    const file = formData.get('file');
    const petId = formData.get('petId');
    const caption = formData.get('caption');

    if (!file || !petId) {
      return c.json({ error: 'File and petId are required' }, 400);
    }

    // Verify pet ownership
    const pet = await c.env.DB.prepare(
      'SELECT user_id FROM pets WHERE id = ?'
    ).bind(petId).first();

    if (!pet) {
      return c.json({ error: 'Pet not found' }, 404);
    }

    if (pet.user_id !== user.id) {
      return c.json({ error: 'Not authorized to upload photos for this pet' }, 403);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed' }, 400);
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return c.json({ error: 'File size must be less than 10MB' }, 400);
    }

    // Generate unique key for R2
    const photoId = generateId();
    const extension = file.name.split('.').pop() || 'jpg';
    const r2Key = `pets/${petId}/${photoId}.${extension}`;

    // Upload to R2
    await c.env.PHOTOS.put(r2Key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Save photo metadata to D1
    const now = timestamp();
    await c.env.DB.prepare(
      `INSERT INTO photos (id, pet_id, r2_object_key, caption, uploaded_at, file_size)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(photoId, petId, r2Key, caption || null, now, file.size).run();

    // Get the created photo
    const photo = await c.env.DB.prepare(
      'SELECT * FROM photos WHERE id = ?'
    ).bind(photoId).first();

    return c.json({ photo }, 201);

  } catch (error) {
    console.error('Upload photo error:', error);
    return c.json({ error: 'Failed to upload photo' }, 500);
  }
});

/**
 * GET /api/photos/:id
 * Get photo metadata
 */
photos.get('/:id', async (c) => {
  try {
    const photoId = c.req.param('id');

    const photo = await c.env.DB.prepare(
      'SELECT * FROM photos WHERE id = ?'
    ).bind(photoId).first();

    if (!photo) {
      return c.json({ error: 'Photo not found' }, 404);
    }

    return c.json({ photo });

  } catch (error) {
    console.error('Get photo error:', error);
    return c.json({ error: 'Failed to retrieve photo' }, 500);
  }
});

/**
 * GET /api/photos/:id/image
 * Get actual photo file from R2
 */
photos.get('/:id/image', async (c) => {
  try {
    const photoId = c.req.param('id');

    // Get photo metadata
    const photo = await c.env.DB.prepare(
      'SELECT r2_object_key FROM photos WHERE id = ?'
    ).bind(photoId).first();

    if (!photo) {
      return c.json({ error: 'Photo not found' }, 404);
    }

    // Get from R2
    const object = await c.env.PHOTOS.get(photo.r2_object_key);

    if (!object) {
      return c.json({ error: 'Photo file not found' }, 404);
    }

    // Return the image
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });

  } catch (error) {
    console.error('Get photo image error:', error);
    return c.json({ error: 'Failed to retrieve photo file' }, 500);
  }
});

/**
 * DELETE /api/photos/:id
 * Delete a photo
 */
photos.delete('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const photoId = c.req.param('id');

    // Get photo and verify ownership
    const photo = await c.env.DB.prepare(
      `SELECT photos.*, pets.user_id
       FROM photos
       JOIN pets ON photos.pet_id = pets.id
       WHERE photos.id = ?`
    ).bind(photoId).first();

    if (!photo) {
      return c.json({ error: 'Photo not found' }, 404);
    }

    if (photo.user_id !== user.id) {
      return c.json({ error: 'Not authorized to delete this photo' }, 403);
    }

    // Delete from R2
    await c.env.PHOTOS.delete(photo.r2_object_key);

    // Delete from D1
    await c.env.DB.prepare(
      'DELETE FROM photos WHERE id = ?'
    ).bind(photoId).run();

    return c.json({ success: true });

  } catch (error) {
    console.error('Delete photo error:', error);
    return c.json({ error: 'Failed to delete photo' }, 500);
  }
});

/**
 * GET /api/photos/pet/:petId
 * Get all photos for a pet
 */
photos.get('/pet/:petId', async (c) => {
  try {
    const petId = c.req.param('petId');

    const { results: photos } = await c.env.DB.prepare(
      'SELECT * FROM photos WHERE pet_id = ? ORDER BY uploaded_at DESC'
    ).bind(petId).all();

    return c.json({ photos });

  } catch (error) {
    console.error('Get pet photos error:', error);
    return c.json({ error: 'Failed to retrieve photos' }, 500);
  }
});

export { photos as photoRoutes };
