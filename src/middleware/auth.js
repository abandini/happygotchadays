import { verifyJWT } from '../utils/jwt.js';

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
export async function authMiddleware(c, next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const jwtSecret = c.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET not configured');
    return c.json({ error: 'Server configuration error' }, 500);
  }

  const payload = await verifyJWT(token, jwtSecret);

  if (!payload) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  // Attach user info to context
  c.set('user', { id: payload.userId, email: payload.email });

  await next();
}

/**
 * Optional authentication middleware
 * Checks for token but doesn't require it
 */
export async function optionalAuth(c, next) {
  const authHeader = c.req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const jwtSecret = c.env.JWT_SECRET;

    if (jwtSecret) {
      const payload = await verifyJWT(token, jwtSecret);
      if (payload) {
        c.set('user', { id: payload.userId, email: payload.email });
      }
    }
  }

  await next();
}
