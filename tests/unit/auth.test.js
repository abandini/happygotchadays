import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../../src/utils/password.js';
import { signJWT, verifyJWT } from '../../src/utils/jwt.js';
import { generateId } from '../../src/utils/id.js';

describe('Authentication Utilities', () => {
  describe('Password Hashing', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
    });

    it('should verify correct password', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword('wrongpassword', hash);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT', () => {
    const secret = 'test-secret-key-for-jwt';

    it('should create a valid JWT token', async () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = await signJWT(payload, secret, 3600);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should verify and decode a valid token', async () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = await signJWT(payload, secret, 3600);
      const decoded = await verifyJWT(token, secret);
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe('123');
      expect(decoded.email).toBe('test@example.com');
    });

    it('should reject invalid token', async () => {
      const invalidToken = 'invalid.token.here';
      const decoded = await verifyJWT(invalidToken, secret);
      expect(decoded).toBeNull();
    });

    it('should reject expired token', async () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = await signJWT(payload, secret, -1); // Expired
      const decoded = await verifyJWT(token, secret);
      expect(decoded).toBeNull();
    });
  });

  describe('ID Generation', () => {
    it('should generate a unique ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });

    it('should generate UUID format', () => {
      const id = generateId();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(id).toMatch(uuidRegex);
    });
  });
});
