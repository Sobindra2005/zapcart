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
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
