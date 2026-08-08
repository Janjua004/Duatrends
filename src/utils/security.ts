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

/**
 * Generate or retrieve a persistent device fingerprint
 */
export function getDeviceFingerprint(): string {
  const STORAGE_KEY = 'duatrends_device_fp';
  let fp = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('stylewing_device_fp');
  
  if (!fp) {
    // Generate unique device signature based on browser specs & random entropy
    const raw = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      Math.random().toString(36).substring(2)
    ].join('|');

    // Simple hash algorithm
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    fp = `dev_${Math.abs(hash)}_${Date.now().toString(36)}`;
    localStorage.setItem(STORAGE_KEY, fp);

    // Also store in cookie as backup against simple localStorage clear
    document.cookie = `${STORAGE_KEY}=${fp}; max-age=${365 * 24 * 60 * 60}; path=/`;
  }
  return fp;
}

/**
 * Check if the current device has reached the limit of 2 account registrations in 24 hours
 */
export function checkDeviceRegistrationLimit(): { allowed: boolean; remainingHours: number; message?: string } {
  const fp = getDeviceFingerprint();
  const STORAGE_KEY = `duatrends_reg_log_${fp}`;
  const now = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  let rawLogs: number[] = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(`stylewing_reg_log_${fp}`);
    if (saved) {
      rawLogs = JSON.parse(saved);
    }
  } catch (e) {
    rawLogs = [];
  }

  // Filter logs within the last 24 hours
  const recentRegs = rawLogs.filter(timestamp => now - timestamp < TWENTY_FOUR_HOURS);

  if (recentRegs.length >= 2) {
    const oldestTimestamp = Math.min(...recentRegs);
    const nextAvailableTime = oldestTimestamp + TWENTY_FOUR_HOURS;
    const remainingMs = Math.max(0, nextAvailableTime - now);
    const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000));

    return {
      allowed: false,
      remainingHours,
      message: `Security Limit: Maximum 2 accounts per device every 24 hours allowed. Please try again in ~${remainingHours} hour(s).`
    };
  }

  return { allowed: true, remainingHours: 0 };
}

/**
 * Record a new account registration timestamp for the device
 */
export function recordDeviceRegistration() {
  const fp = getDeviceFingerprint();
  const STORAGE_KEY = `duatrends_reg_log_${fp}`;
  const now = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  let rawLogs: number[] = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      rawLogs = JSON.parse(saved);
    }
  } catch (e) {
    rawLogs = [];
  }

  const recentRegs = rawLogs.filter(timestamp => now - timestamp < TWENTY_FOUR_HOURS);
  recentRegs.push(now);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentRegs));
}

/**
 * Anti-Bot Throttling: Protects database actions from script loops or automated rapid requests
 */
const botTracker: Record<string, { lastRequestTime: number; burstCount: number; cooldownUntil: number }> = {};

export function checkBotRequestThrottling(actionKey: string, minIntervalMs = 1500, maxBurst = 5): { allowed: boolean; message?: string } {
  const now = Date.now();
  const fp = getDeviceFingerprint();
  const fullKey = `${fp}_${actionKey}`;
  const record = botTracker[fullKey];

  if (!record) {
    botTracker[fullKey] = { lastRequestTime: now, burstCount: 1, cooldownUntil: 0 };
    return { allowed: true };
  }

  // Check if currently under cooldown lock
  if (record.cooldownUntil > now) {
    const waitSec = Math.ceil((record.cooldownUntil - now) / 1000);
    return {
      allowed: false,
      message: `Automated/rapid activity detected! System lock active for ${waitSec}s to protect server security.`
    };
  }

  const timeSinceLast = now - record.lastRequestTime;

  if (timeSinceLast < minIntervalMs) {
    record.burstCount += 1;
    record.lastRequestTime = now;

    if (record.burstCount >= maxBurst) {
      // Trigger 60-second cooldown lock on suspicious bot loop behavior
      record.cooldownUntil = now + 60 * 1000;
      return {
        allowed: false,
        message: 'Security Alert: Rapid automated loop detected! Action blocked for 60 seconds.'
      };
    }

    return {
      allowed: false,
      message: 'Please slow down! Requests submitted too quickly.'
    };
  } else {
    // Normal interval, reset burst counter
    record.burstCount = 1;
    record.lastRequestTime = now;
    return { allowed: true };
  }
}

