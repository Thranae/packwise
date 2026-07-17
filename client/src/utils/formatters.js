/**
 * Format an ISO date string into a human-readable format.
 *
 * @param {string} dateString - An ISO 8601 date string.
 * @returns {string} A formatted date string, e.g. "Jan 15, 2026".
 */
export function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Extract uppercase initials from a name string.
 * Returns up to two letters (first letter of the first and last word).
 *
 * @param {string} name - The full name.
 * @returns {string} Uppercase initials, e.g. "JD" for "John Doe".
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') return '';

  const words = name.trim().split(/\s+/);
  if (words.length === 0) return '';

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

/**
 * Capitalize the first letter of a string.
 *
 * @param {string} str - The input string.
 * @returns {string} The string with its first letter capitalized.
 */
export function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
