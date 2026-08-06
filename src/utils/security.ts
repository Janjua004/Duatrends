/**
 * Security & Input Sanitization Utilities for Production
 */

/**
 * Sanitize raw string input to prevent XSS (Cross-Site Scripting) and HTML injection
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/javascript:/gi, '')
    .replace(/onerror=/gi, '')
    .replace(/onload=/gi, '')
    .trim();
}

/**
 * Validate Pakistani & International phone numbers
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Matches 03XXXXXXXXX (11 digits) or +923XXXXXXXXX (13 digits) or standard intl 8-15 digits
  const phoneRegex = /^(\+92|0)?3\d{9}$|^[+]?[1-9]\d{7,14}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validate RFC 5322 Email Format
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Rate Limiting Tracker for Login & Forms
 */
const attemptStore: Record<string, { count: number; lockedUntil: number }> = {};

export function checkRateLimit(key: string, maxAttempts = 5, lockDurationMs = 15 * 60 * 1000): { allowed: boolean; remainingSeconds: number } {
  const now = Date.now();
  const record = attemptStore[key];

  if (!record) {
    return { allowed: true, remainingSeconds: 0 };
  }

  if (record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  if (record.lockedUntil <= now && record.count >= maxAttempts) {
    // Lock expired, reset counter
    delete attemptStore[key];
    return { allowed: true, remainingSeconds: 0 };
  }

  return { allowed: true, remainingSeconds: 0 };
}

export function recordFailedAttempt(key: string, maxAttempts = 5, lockDurationMs = 15 * 60 * 1000): { locked: boolean; remainingSeconds: number } {
  const now = Date.now();
  if (!attemptStore[key]) {
    attemptStore[key] = { count: 1, lockedUntil: 0 };
  } else {
    attemptStore[key].count += 1;
  }

  if (attemptStore[key].count >= maxAttempts) {
    attemptStore[key].lockedUntil = now + lockDurationMs;
    const remainingSeconds = Math.ceil(lockDurationMs / 1000);
    return { locked: true, remainingSeconds };
  }

  return { locked: false, remainingSeconds: 0 };
}

export function clearRateLimit(key: string) {
  delete attemptStore[key];
}
