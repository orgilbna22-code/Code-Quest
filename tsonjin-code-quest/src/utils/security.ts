/**
 * Robust User Account Security & Validation Engine for Tsonjin Cyber Academy
 * 
 * Implements:
 * - Case-insensitive normalized usernames (UNIQUE check)
 * - Display Name vs Username separation (@username vs Full Name)
 * - Reserved system name protection (admin, root, moderator, etc.)
 * - Mongolian Phone Number (+976) security, masking, rate limits, OTP simulation
 * - Grade-aware learning paths
 * - Session tracking, multi-device management, audit logging
 * - Account enumeration prevention
 */

export interface SecurityAuditLogEntry {
  id: string;
  timestamp: string;
  action:
    | 'ACCOUNT_CREATED'
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'USERNAME_CHANGED'
    | 'PHONE_VERIFIED'
    | 'GOOGLE_CONNECTED'
    | 'GRADE_PROMOTED'
    | 'LOGOUT_DEVICE'
    | 'LOGOUT_ALL_DEVICES';
  userId?: string;
  username?: string;
  details: string;
  ipMasked?: string;
}

export interface UserSession {
  id: string;
  device: string;
  browser: string;
  os: string;
  ipMasked: string;
  createdAt: string;
  lastActive: string;
  isCurrent: boolean;
}

export const RESERVED_USERNAMES = new Set([
  'admin',
  'administrator',
  'root',
  'support',
  'system',
  'moderator',
  'tsonjin',
  'api',
  'login',
  'signup',
  'guest',
  'superuser',
  'teacher',
  'director',
  'manager',
  'dev',
]);

/**
 * Normalizes username: lowercase and trim
 */
export function normalizeUsername(username: string): string {
  return (username || '')
    .trim()
    .toLowerCase()
    .replace(/^@+/, '');
}

/**
 * Validates username syntax (3-20 chars, letters, numbers, underscore only)
 */
export function validateUsernameRules(rawUsername: string): { valid: boolean; error?: string } {
  const norm = normalizeUsername(rawUsername);
  if (!norm) {
    return { valid: false, error: 'Хэрэглэгчийн нэр (Username) оруулна уу' };
  }
  if (norm.length < 3 || norm.length > 20) {
    return { valid: false, error: 'Хэрэглэгчийн нэр 3–20 тэмдэгт байх ёстой (3-20 characters required)' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(norm)) {
    return {
      valid: false,
      error: 'Зөвхөн үсэг, тоо, доогуур зураас (_) зөвшөөрөгдөнө. Хоосон зай болон тусгай тэмдэгт хориотой!',
    };
  }
  if (RESERVED_USERNAMES.has(norm)) {
    return {
      valid: false,
      error: `"${norm}" нь системийн нөөцөлсөн нэр тул ашиглах боломжгүй (Reserved username).`,
    };
  }
  return { valid: true };
}

/**
 * Generates creative smart username suggestions when taken
 */
export function generateUsernameSuggestions(base: string, existingUsernames: string[]): string[] {
  const norm = normalizeUsername(base);
  const existingSet = new Set(existingUsernames.map((u) => normalizeUsername(u)));
  const candidates: string[] = [
    `${norm}10`,
    `${norm}_dev`,
    `${norm}26`,
    `${norm}_cyber`,
    `${norm}_pro`,
    `the_${norm}`,
  ];
  return candidates.filter((c) => !existingSet.has(c) && !RESERVED_USERNAMES.has(c)).slice(0, 3);
}

/**
 * Mongolian Phone (+976) validation & masking
 */
export function sanitizeMongolianPhone(input: string): string {
  return input.replace(/[^\d+]/g, '');
}

export function isValidMongolianPhone(phone: string): boolean {
  const cleaned = sanitizeMongolianPhone(phone).replace(/^\+976/, '').replace(/^976/, '');
  // Mongolian mobile numbers are 8 digits typically starting with 8, 9, 7
  return /^[789]\d{7}$/.test(cleaned);
}

export function formatMongolianPhone(phone: string): string {
  const cleaned = sanitizeMongolianPhone(phone).replace(/^\+976/, '').replace(/^976/, '');
  if (cleaned.length === 8) {
    return `+976 ${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  return phone;
}

export function maskMongolianPhone(phone: string): string {
  const cleaned = sanitizeMongolianPhone(phone).replace(/^\+976/, '').replace(/^976/, '');
  if (cleaned.length === 8) {
    return `+976 •••• ${cleaned.slice(4)}`;
  }
  return '+976 •••• ••••';
}
