/**
 * Generate a unique ID using crypto.randomUUID()
 */
export function generateId() {
  return crypto.randomUUID();
}

/**
 * Get current timestamp in seconds
 */
export function timestamp() {
  return Math.floor(Date.now() / 1000);
}
