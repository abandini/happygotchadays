/**
 * Hash a password using Web Crypto API
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Base64 encoded hash
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return btoa(String.fromCharCode(...hashArray));
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Base64 encoded hash
 * @returns {Promise<boolean>} - True if password matches
 */
export async function verifyPassword(password, hash) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
