/**
 * Timezone-aware streak calculation engine for Tsonjin Cyber Academy.
 * Ensures:
 * 1. Brand new accounts start at 0 (never 5).
 * 2. Completing a lesson on Day 1 increments streak to 1.
 * 3. Additional lessons on the same calendar day keep streak at 1 (idempotent).
 * 4. Lessons on consecutive calendar days increment streak to 2, 3, 4, 5, 6... (unbounded).
 * 5. Missed days reset streak back to 1.
 */

export interface StreakData {
  streakDays: number;
  longestStreak: number;
  lastActiveDate: string; // ISO Date YYYY-MM-DD in user's local timezone
}

/**
 * Returns the current date formatted as YYYY-MM-DD in the user's specific timezone.
 */
export function getLocalDateString(date: Date = new Date(), timezone?: string): string {
  try {
    const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ulaanbaatar';
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date); // e.g. "2026-10-10"
  } catch {
    // Fallback if timezone string is invalid
    return date.toISOString().split('T')[0];
  }
}

/**
 * Calculates new streak metrics when a qualified learning activity occurs.
 */
export function calculateStreakUpdate(
  currentStreakDays: number,
  lastActiveDate: string | undefined | null,
  longestStreak: number = 0,
  activityDate: Date = new Date(),
  userTimezone?: string
): {
  streakDays: number;
  longestStreak: number;
  lastActiveDate: string;
  isNewDay: boolean;
} {
  const todayStr = getLocalDateString(activityDate, userTimezone);

  // Case 0: Never active before (brand-new account)
  if (!lastActiveDate || currentStreakDays === 0) {
    return {
      streakDays: 1,
      longestStreak: Math.max(1, longestStreak),
      lastActiveDate: todayStr,
      isNewDay: true,
    };
  }

  // Case 1: Already performed an activity on the exact same local calendar day
  if (lastActiveDate === todayStr) {
    return {
      streakDays: currentStreakDays,
      longestStreak: Math.max(currentStreakDays, longestStreak),
      lastActiveDate: todayStr,
      isNewDay: false,
    };
  }

  // Calculate day difference between today and lastActiveDate
  const todayParts = todayStr.split('-').map(Number);
  const lastParts = lastActiveDate.split('-').map(Number);

  const todayUtc = Date.UTC(todayParts[0], todayParts[1] - 1, todayParts[2]);
  const lastUtc = Date.UTC(lastParts[0], lastParts[1] - 1, lastParts[2]);
  const diffDays = Math.round((todayUtc - lastUtc) / (1000 * 60 * 60 * 24));

  // Case 2: Exact consecutive day (diffDays === 1) -> increment streak
  if (diffDays === 1) {
    const newStreak = currentStreakDays + 1;
    return {
      streakDays: newStreak,
      longestStreak: Math.max(newStreak, longestStreak),
      lastActiveDate: todayStr,
      isNewDay: true,
    };
  }

  // Case 3: Missed 1 or more days (diffDays > 1) -> streak resets to 1
  if (diffDays > 1) {
    return {
      streakDays: 1,
      longestStreak: Math.max(currentStreakDays, longestStreak),
      lastActiveDate: todayStr,
      isNewDay: true,
    };
  }

  // Case 4: Future or clock discrepancy (diffDays <= 0)
  return {
    streakDays: currentStreakDays,
    longestStreak: Math.max(currentStreakDays, longestStreak),
    lastActiveDate: todayStr,
    isNewDay: false,
  };
}
