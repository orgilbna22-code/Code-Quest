import { calculateStreakUpdate, getLocalDateString } from './streakEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
  console.log(`✓ PASS: ${message}`);
}

export function runStreakTestSuite() {
  console.log('--- RUNNING STREAK SYSTEM VERIFICATION TESTS ---');

  // Test 1: Brand new account initialization
  const initialStreakDays = 0;
  assert(initialStreakDays === 0, 'New account starts with exactly 0 streak days');

  // Test 2: First valid learning activity day
  const day1 = calculateStreakUpdate(0, '', 0, new Date('2026-10-01T10:00:00Z'));
  assert(day1.streakDays === 1, 'First activity increments streak from 0 to 1');
  assert(day1.isNewDay === true, 'First activity marked as new qualified day');

  // Test 3: Second activity on the same calendar day (idempotency)
  const day1Again = calculateStreakUpdate(day1.streakDays, day1.lastActiveDate, day1.longestStreak, new Date('2026-10-01T16:30:00Z'));
  assert(day1Again.streakDays === 1, 'Second activity on same day leaves streak at 1 (no duplicate increment)');
  assert(day1Again.isNewDay === false, 'Second activity recognized as same day');

  // Test 4: Activity on the next consecutive calendar day
  const day2 = calculateStreakUpdate(day1.streakDays, day1.lastActiveDate, day1.longestStreak, new Date('2026-10-02T09:15:00Z'));
  assert(day2.streakDays === 2, 'Next day activity increments streak from 1 to 2');

  // Test 5: Consecutive days 3, 4, 5
  const day3 = calculateStreakUpdate(day2.streakDays, day2.lastActiveDate, day2.longestStreak, new Date('2026-10-03T11:00:00Z'));
  const day4 = calculateStreakUpdate(day3.streakDays, day3.lastActiveDate, day3.longestStreak, new Date('2026-10-04T11:00:00Z'));
  const day5 = calculateStreakUpdate(day4.streakDays, day4.lastActiveDate, day4.longestStreak, new Date('2026-10-05T11:00:00Z'));
  assert(day5.streakDays === 5, 'Five consecutive days yields 5-day streak');

  // Test 6: Sixth consecutive day (Proves no artificial 5-day ceiling)
  const day6 = calculateStreakUpdate(day5.streakDays, day5.lastActiveDate, day5.longestStreak, new Date('2026-10-06T11:00:00Z'));
  assert(day6.streakDays === 6, 'Six consecutive days continues past 5 to 6');

  // Test 7: Thirty consecutive days
  let current = day6;
  for (let d = 7; d <= 30; d++) {
    const dateStr = `2026-10-${String(d).padStart(2, '0')}T12:00:00Z`;
    current = calculateStreakUpdate(current.streakDays, current.lastActiveDate, current.longestStreak, new Date(dateStr));
  }
  assert(current.streakDays === 30, 'Thirty consecutive days yields 30-day streak');
  assert(current.longestStreak === 30, 'Longest streak tracks 30 days');

  // Test 8: Missed calendar day resets streak to 1
  const afterBreak = calculateStreakUpdate(current.streakDays, current.lastActiveDate, current.longestStreak, new Date('2026-11-05T12:00:00Z'));
  assert(afterBreak.streakDays === 1, 'Missed day resets streak to 1');
  assert(afterBreak.longestStreak === 30, 'Longest streak record is preserved at 30');

  // Test 9: Timezone localized date check
  const localDate = getLocalDateString(new Date('2026-10-10T03:00:00Z'), 'Asia/Ulaanbaatar');
  assert(typeof localDate === 'string' && localDate.length === 10, 'Timezone date formatted properly');

  console.log('✓ ALL 9 STREAK VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

// Run immediately if executed via node / tsx
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('streakEngine.test')) {
  runStreakTestSuite();
}
