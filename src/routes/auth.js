import { Hono } from 'hono';
import { generateId, timestamp } from '../utils/id.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signJWT } from '../utils/jwt.js';

const auth = new Hono();

/**
 * POST /api/auth/register
 * Register a new user
 */
auth.post('/register', async (c) => {
  try {
    const { email, username, password } = await c.req.json();

    // Validation
    if (!email || !username || !password) {
      return c.json({ error: 'Email, username, and password are required' }, 400);
    }

    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format' }, 400);
    }

    // Check if user already exists
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ? OR username = ?'
    ).bind(email, username).first();

    if (existingUser) {
      return c.json({ error: 'Email or username already exists' }, 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = generateId();
    const now = timestamp();

    await c.env.DB.prepare(
      'INSERT INTO users (id, email, username, password_hash, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, email, username, passwordHash, now).run();

    // Generate JWT
    const token = await signJWT(
      { userId, email },
      c.env.JWT_SECRET,
      3600 // 1 hour
    );

    // Store session in KV
    await c.env.SESSIONS.put(`session:${userId}`, JSON.stringify({
      userId,
      email,
      createdAt: now
    }), { expirationTtl: 3600 });

    return c.json({
      user: {
        id: userId,
        email,
        username,
        createdAt: now
      },
      token
    }, 201);

  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Find user
    const user = await c.env.DB.prepare(
      'SELECT id, email, username, password_hash, created_at FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Generate JWT
    const token = await signJWT(
      { userId: user.id, email: user.email },
      c.env.JWT_SECRET,
      3600 // 1 hour
    );

    // Store session in KV
    const now = timestamp();
    await c.env.SESSIONS.put(`session:${user.id}`, JSON.stringify({
      userId: user.id,
      email: user.email,
      createdAt: now
    }), { expirationTtl: 3600 });

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

/**
 * GET /api/auth/verify
 * Verify current token and return user info
 */
auth.get('/verify', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const token = authHeader.substring(7);
    const { verifyJWT } = await import('../utils/jwt.js');
    const payload = await verifyJWT(token, c.env.JWT_SECRET);

    if (!payload) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    // Get fresh user data
    const user = await c.env.DB.prepare(
      'SELECT id, email, username, created_at FROM users WHERE id = ?'
    ).bind(payload.userId).first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user });
  } catch (error) {
    console.error('Verify error:', error);
    return c.json({ error: 'Verification failed' }, 500);
  }
});

/**
 * POST /api/auth/logout
 * Logout user (clear session)
 */
auth.post('/logout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: true });
    }

    const token = authHeader.substring(7);
    const jwtSecret = c.env.JWT_SECRET;
    const { verifyJWT } = await import('../utils/jwt.js');
    const payload = await verifyJWT(token, jwtSecret);

    if (payload) {
      await c.env.SESSIONS.delete(`session:${payload.userId}`);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ success: true }); // Always succeed
  }
});

export { auth as authRoutes };
