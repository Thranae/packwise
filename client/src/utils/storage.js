/**
 * Retrieve a value from localStorage by key.
 * Returns null if the key does not exist or if parsing fails.
 *
 * @param {string} key - The localStorage key.
 * @returns {*} The parsed value, or null on failure.
 */
export function get(key) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item);
  } catch {
    // If the stored value is a plain string (not JSON), return it directly
    return localStorage.getItem(key);
  }
}

/**
 * Store a value in localStorage under the given key.
 * The value is JSON-serialized before storage.
 *
 * @param {string} key   - The localStorage key.
 * @param {*}      value - The value to store.
 */
export function set(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to set localStorage key "${key}":`, error);
  }
}

/**
 * Remove a value from localStorage by key.
 *
 * @param {string} key - The localStorage key to remove.
 */
export function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage key "${key}":`, error);
  }
}
