/**
 * Helper utility for generating random email addresses.
 * Used in negative login tests to avoid rate limiting
 * when testing with invalid credentials repeatedly.
 *
 * Each call produces a unique email using timestamp + random string.
 *
 * @param domain - Optional custom domain (defaults to 'example.com')
 * @returns A unique random email address string
 *
 * Examples:
 *   generateRandomEmail()              → "test_user_1718234567890_a3f2@example.com"
 *   generateRandomEmail('hudl.com')    → "test_user_1718234567890_a3f2@hudl.com"
 */
export function generateRandomEmail(domain: string = 'example.com'): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 6);
  return `test_user_${timestamp}_${randomString}@${domain}`;
}
