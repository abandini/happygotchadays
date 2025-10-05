/**
 * JWT utilities for authentication
 * Using Web Crypto API with HMAC for signing
 */

const ALGORITHM = { name: 'HMAC', hash: 'SHA-256' };

/**
 * Import JWT secret as CryptoKey
 */
async function getSecretKey(secret) {
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    ALGORITHM,
    false,
    ['sign', 'verify']
  );
}

/**
 * Base64 URL encode
 */
function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

/**
 * Sign JWT token
 * @param {object} payload - Token payload
 * @param {string} secret - JWT secret
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} - JWT token
 */
export async function signJWT(payload, secret, expiresIn = 3600) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);

  const claims = {
    ...payload,
    iat: now,
    exp: now + expiresIn
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(claims));
  const message = `${encodedHeader}.${encodedPayload}`;

  const key = await getSecretKey(secret);
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    ALGORITHM.name,
    key,
    encoder.encode(message)
  );

  const encodedSignature = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );

  return `${message}.${encodedSignature}`;
}

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {Promise<object|null>} - Decoded payload or null if invalid
 */
export async function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const message = `${encodedHeader}.${encodedPayload}`;

    const key = await getSecretKey(secret);
    const encoder = new TextEncoder();
    const signature = Uint8Array.from(
      base64UrlDecode(encodedSignature),
      c => c.charCodeAt(0)
    );

    const isValid = await crypto.subtle.verify(
      ALGORITHM.name,
      key,
      signature,
      encoder.encode(message)
    );

    if (!isValid) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) return null;

    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}
