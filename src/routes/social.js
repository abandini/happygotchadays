import { Hono } from 'hono';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { generateId, timestamp } from '../utils/id.js';

const social = new Hono();

/**
 * POST /api/social/posts
 * Create a new gotcha day post
 */
social.post('/posts', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const { petId, content, photoIds, anniversaryYear } = await c.req.json();

    if (!petId || !content) {
      return c.json({ error: 'Pet ID and content are required' }, 400);
    }

    // Verify pet ownership
    const pet = await c.env.DB.prepare(
      'SELECT user_id FROM pets WHERE id = ?'
    ).bind(petId).first();

    if (!pet) {
      return c.json({ error: 'Pet not found' }, 404);
    }

    if (pet.user_id !== user.id) {
      return c.json({ error: 'Not authorized to post for this pet' }, 403);
    }

    // Create post
    const postId = generateId();
    const now = timestamp();

    await c.env.DB.prepare(
      `INSERT INTO posts (id, pet_id, user_id, content, created_at, photo_ids, anniversary_year)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      postId,
      petId,
      user.id,
      content,
      now,
      photoIds ? JSON.stringify(photoIds) : null,
      anniversaryYear || null
    ).run();

    const post = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE id = ?'
    ).bind(postId).first();

    return c.json({ post }, 201);

  } catch (error) {
    console.error('Create post error:', error);
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

/**
 * GET /api/social/feed
 * Get personalized feed
 */
social.get('/feed', optionalAuth, async (c) => {
  try {
    const user = c.get('user');
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');

    let query;
    let bindings = [];

    if (user) {
      // Get posts from followed users
      query = `
        SELECT p.*, u.username, u.avatar_url, pet.name as pet_name, pet.species
        FROM posts p
        JOIN users u ON p.user_id = u.id
        JOIN pets pet ON p.pet_id = pet.id
        LEFT JOIN follows f ON p.user_id = f.following_id AND f.follower_id = ?
        WHERE f.follower_id = ? OR p.user_id = ? OR pet.is_public = 1
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `;
      bindings = [user.id, user.id, user.id, limit, offset];
    } else {
      // Public feed only
      query = `
        SELECT p.*, u.username, u.avatar_url, pet.name as pet_name, pet.species
        FROM posts p
        JOIN users u ON p.user_id = u.id
        JOIN pets pet ON p.pet_id = pet.id
        WHERE pet.is_public = 1
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `;
      bindings = [limit, offset];
    }

    const { results: posts } = await c.env.DB.prepare(query).bind(...bindings).all();

    // Get like counts and user's likes
    for (const post of posts) {
      const { count } = await c.env.DB.prepare(
        'SELECT COUNT(*) as count FROM likes WHERE post_id = ?'
      ).bind(post.id).first();
      post.like_count = count;

      if (user) {
        const userLike = await c.env.DB.prepare(
          'SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?'
        ).bind(post.id, user.id).first();
        post.user_liked = !!userLike;
      }
    }

    return c.json({ posts });

  } catch (error) {
    console.error('Get feed error:', error);
    return c.json({ error: 'Failed to retrieve feed' }, 500);
  }
});

/**
 * POST /api/social/posts/:id/like
 * Like a post
 */
social.post('/posts/:id/like', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const postId = c.req.param('id');

    // Check if post exists
    const post = await c.env.DB.prepare(
      'SELECT id FROM posts WHERE id = ?'
    ).bind(postId).first();

    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    // Check if already liked
    const existingLike = await c.env.DB.prepare(
      'SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?'
    ).bind(postId, user.id).first();

    if (existingLike) {
      return c.json({ error: 'Post already liked' }, 400);
    }

    // Create like
    const now = timestamp();
    await c.env.DB.prepare(
      'INSERT INTO likes (post_id, user_id, created_at) VALUES (?, ?, ?)'
    ).bind(postId, user.id, now).run();

    return c.json({ success: true });

  } catch (error) {
    console.error('Like post error:', error);
    return c.json({ error: 'Failed to like post' }, 500);
  }
});

/**
 * DELETE /api/social/posts/:id/like
 * Unlike a post
 */
social.delete('/posts/:id/like', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const postId = c.req.param('id');

    await c.env.DB.prepare(
      'DELETE FROM likes WHERE post_id = ? AND user_id = ?'
    ).bind(postId, user.id).run();

    return c.json({ success: true });

  } catch (error) {
    console.error('Unlike post error:', error);
    return c.json({ error: 'Failed to unlike post' }, 500);
  }
});

/**
 * POST /api/social/posts/:id/comment
 * Comment on a post
 */
social.post('/posts/:id/comment', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const postId = c.req.param('id');
    const { content } = await c.req.json();

    if (!content || content.trim().length === 0) {
      return c.json({ error: 'Comment content is required' }, 400);
    }

    // Check if post exists
    const post = await c.env.DB.prepare(
      'SELECT id FROM posts WHERE id = ?'
    ).bind(postId).first();

    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    // Create comment
    const commentId = generateId();
    const now = timestamp();

    await c.env.DB.prepare(
      'INSERT INTO comments (id, post_id, user_id, content, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(commentId, postId, user.id, content, now).run();

    const comment = await c.env.DB.prepare(
      'SELECT c.*, u.username, u.avatar_url FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?'
    ).bind(commentId).first();

    return c.json({ comment }, 201);

  } catch (error) {
    console.error('Comment error:', error);
    return c.json({ error: 'Failed to create comment' }, 500);
  }
});

/**
 * GET /api/social/posts/:id/comments
 * Get comments for a post
 */
social.get('/posts/:id/comments', async (c) => {
  try {
    const postId = c.req.param('id');

    const { results: comments } = await c.env.DB.prepare(
      `SELECT c.*, u.username, u.avatar_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`
    ).bind(postId).all();

    return c.json({ comments });

  } catch (error) {
    console.error('Get comments error:', error);
    return c.json({ error: 'Failed to retrieve comments' }, 500);
  }
});

/**
 * POST /api/social/follow/:userId
 * Follow a user
 */
social.post('/follow/:userId', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const followingId = c.req.param('userId');

    if (user.id === followingId) {
      return c.json({ error: 'Cannot follow yourself' }, 400);
    }

    // Check if user exists
    const targetUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE id = ?'
    ).bind(followingId).first();

    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Check if already following
    const existingFollow = await c.env.DB.prepare(
      'SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?'
    ).bind(user.id, followingId).first();

    if (existingFollow) {
      return c.json({ error: 'Already following this user' }, 400);
    }

    // Create follow
    const now = timestamp();
    await c.env.DB.prepare(
      'INSERT INTO follows (follower_id, following_id, created_at) VALUES (?, ?, ?)'
    ).bind(user.id, followingId, now).run();

    return c.json({ success: true });

  } catch (error) {
    console.error('Follow error:', error);
    return c.json({ error: 'Failed to follow user' }, 500);
  }
});

/**
 * DELETE /api/social/follow/:userId
 * Unfollow a user
 */
social.delete('/follow/:userId', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const followingId = c.req.param('userId');

    await c.env.DB.prepare(
      'DELETE FROM follows WHERE follower_id = ? AND following_id = ?'
    ).bind(user.id, followingId).run();

    return c.json({ success: true });

  } catch (error) {
    console.error('Unfollow error:', error);
    return c.json({ error: 'Failed to unfollow user' }, 500);
  }
});

export { social as socialRoutes };
