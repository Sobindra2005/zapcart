/**
 * Cookie utility functions for secure token storage
 */

/**
 * Set a cookie with security flags
 * Note: For production, httpOnly cookies should be set by the server
 * This is a client-side fallback with security best practices
 */
export function setSecureCookie(
  name: string,
  value: string,
  days: number = 7
): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  
  // Security flags
  const secure = window.location.protocol === 'https:' ? 'Secure;' : '';
  const sameSite = 'SameSite=Strict;';
  
  document.cookie = `${name}=${value}; ${expires}; path=/; ${secure} ${sameSite}`;
}


/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
