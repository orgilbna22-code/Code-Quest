import { StudentProfile, GameSettings, LeaderboardEntry, UserRole } from '../types';
import { calculateStreakUpdate } from './streakEngine';
import { normalizeUsername, validateUsernameRules, SecurityAuditLogEntry, UserSession } from './security';
import { formatGradeClass, validateGradeAndClass, promoteStudentGrade } from './gradeSystem';

const STORAGE_KEY_PROFILE = 'tsonjin_code_quest_profile_v3';
const STORAGE_KEY_SETTINGS = 'tsonjin_code_quest_settings_v3';
const STORAGE_KEY_LEADERBOARD = 'tsonjin_code_quest_leaderboard_v3';
const STORAGE_KEY_STUDENTS = 'tsonjin_code_quest_students_v4';
const STORAGE_KEY_AUDIT_LOGS = 'tsonjin_cyber_security_audit_logs';
const STORAGE_KEY_SESSIONS = 'tsonjin_cyber_user_sessions';

export const INITIAL_SETTINGS: GameSettings = {
  soundEnabled: true,
  animationsEnabled: true,
  timerEnabled: true,
  language: 'en',
};

export const INITIAL_PROFILE: StudentProfile = {
  id: 'st_orgil',
  name: 'Orgil',
  username: 'orgil',
  usernameNormalized: 'orgil',
  role: 'STUDENT',
  email: 'orgilbna22@gmail.com',
  phone: '+976 9911 2233',
  password: 'Passw0rd.0813',
  grade: '10-2',
  gradeNumber: 10,
  classSection: 2,
  avatar: '⚡',
  currentLevel: 1,
  unlockedLevels: [1],
  completedLevels: [],
  totalXp: 0,
  totalScore: 0,
  bestScore: 0,
  streakDays: 0,
  longestStreak: 0,
  lastActiveDate: '',
  unlockedAchievements: [],
  activeTrack: 'python',
  cppCurrentLevel: 101,
  cppUnlockedLevels: [101],
  cppCompletedLevels: [],
  cppXp: 0,
  loginSessionsCount: 2,
};

const BASE_LEADERBOARD: Omit<LeaderboardEntry, 'isCurrentStudent'>[] = [
  { id: '1', name: 'Temuulen B.', username: 'temuulen', grade: '11-1', xp: 2650, completedCount: 11, badge: 'Cyber Prodigy' },
  { id: '2', name: 'Nomin E.', username: 'nomin', grade: '10-2', xp: 2320, completedCount: 10, badge: 'Python Ace' },
  { id: '3', name: 'Anand G.', username: 'anand', grade: '11-3', xp: 1980, completedCount: 9, badge: 'Logic Master' },
  { id: '4', name: 'Khuslen M.', username: 'khuslen', grade: '10-1', xp: 1750, completedCount: 8, badge: 'Syntax Hunter' },
  { id: '5', name: 'Enkhjin T.', username: 'enkhjin', grade: '9-2', xp: 1420, completedCount: 6, badge: 'Rising Cyber' },
  { id: '6', name: 'Bilguun O.', username: 'bilguun', grade: '10-3', xp: 1150, completedCount: 5, badge: 'Code Cadet' },
];

export const INITIAL_STUDENTS_ROSTER: StudentProfile[] = [
  {
    id: 'st_orgil',
    name: 'Orgil',
    username: 'orgil',
    usernameNormalized: 'orgil',
    role: 'STUDENT',
    email: 'orgilbna22@gmail.com',
    phone: '+976 9911 2233',
    password: 'Passw0rd.0813',
    grade: '10-2',
    gradeNumber: 10,
    classSection: 2,
    avatar: '⚡',
    currentLevel: 1,
    unlockedLevels: [1],
    completedLevels: [],
    totalXp: 0,
    totalScore: 0,
    bestScore: 0,
    streakDays: 0,
    longestStreak: 0,
    lastActiveDate: '',
    unlockedAchievements: [],
    loginSessionsCount: 1,
  },
  {
    id: 'st_temuulen',
    name: 'Temuulen B.',
    username: 'temuulen',
    usernameNormalized: 'temuulen',
    role: 'STUDENT',
    email: 'temuulen@gmail.com',
    phone: '+976 8811 5566',
    password: '123456',
    grade: '11-1',
    gradeNumber: 11,
    classSection: 1,
    avatar: '🚀',
    currentLevel: 11,
    unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    totalXp: 2650,
    totalScore: 4950,
    bestScore: 950,
    streakDays: 14,
    lastActiveDate: new Date().toISOString().split('T')[0],
    unlockedAchievements: ['first_code', 'python_beginner', 'decision_maker', 'loop_master', 'speed_coder'],
  },
  {
    id: 'st_nomin',
    name: 'Nomin E.',
    username: 'nomin',
    usernameNormalized: 'nomin',
    role: 'STUDENT',
    email: 'nomin@gmail.com',
    phone: '+976 9511 8899',
    password: '123456',
    grade: '10-2',
    gradeNumber: 10,
    classSection: 2,
    avatar: '🔮',
    currentLevel: 10,
    unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    totalXp: 2320,
    totalScore: 4300,
    bestScore: 880,
    streakDays: 10,
    lastActiveDate: new Date().toISOString().split('T')[0],
    unlockedAchievements: ['first_code', 'python_beginner', 'decision_maker', 'perfect_score'],
  },
  {
    id: 'st_anand',
    name: 'Anand G.',
    username: 'anand',
    usernameNormalized: 'anand',
    role: 'STUDENT',
    email: 'anand@gmail.com',
    phone: '+976 9900 1122',
    password: '123456',
    grade: '11-3',
    gradeNumber: 11,
    classSection: 3,
    avatar: '🤖',
    currentLevel: 9,
    unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    completedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
    totalXp: 1980,
    totalScore: 3600,
    bestScore: 820,
    streakDays: 8,
    lastActiveDate: new Date().toISOString().split('T')[0],
    unlockedAchievements: ['first_code', 'python_beginner', 'loop_master'],
  },
  {
    id: 'st_khuslen',
    name: 'Khuslen M.',
    username: 'khuslen',
    usernameNormalized: 'khuslen',
    role: 'STUDENT',
    email: 'khuslen@gmail.com',
    phone: '+976 8900 3344',
    password: '123456',
    grade: '10-1',
    gradeNumber: 10,
    classSection: 1,
    avatar: '💎',
    currentLevel: 8,
    unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
    completedLevels: [1, 2, 3, 4, 5, 6, 7],
    totalXp: 1750,
    totalScore: 3100,
    bestScore: 780,
    streakDays: 7,
    lastActiveDate: new Date().toISOString().split('T')[0],
    unlockedAchievements: ['first_code', 'python_beginner'],
  },
  {
    id: 'st_enkhjin',
    name: 'Enkhjin T.',
    username: 'enkhjin',
    usernameNormalized: 'enkhjin',
    role: 'STUDENT',
    email: 'enkhjin@gmail.com',
    phone: '+976 7711 4455',
    password: '123456',
    grade: '9-2',
    gradeNumber: 9,
    classSection: 2,
    avatar: '🛡️',
    currentLevel: 6,
    unlockedLevels: [1, 2, 3, 4, 5, 6],
    completedLevels: [1, 2, 3, 4, 5],
    totalXp: 1420,
    totalScore: 2450,
    bestScore: 710,
    streakDays: 6,
    lastActiveDate: new Date().toISOString().split('T')[0],
    unlockedAchievements: ['first_code', 'python_beginner'],
  },
  {
    id: 'st_bilguun',
    name: 'Bilguun O.',
    username: 'bilguun',
    usernameNormalized: 'bilguun',
    role: 'STUDENT',
    email: 'bilguun@gmail.com',
    phone: '+976 8877 6655',
    password: '123456',
    grade: '10-3',
    gradeNumber: 10,
    classSection: 3,
    avatar: '🌟',
    currentLevel: 5,
    unlockedLevels: [1, 2, 3, 4, 5],
    completedLevels: [1, 2, 3, 4],
    totalXp: 1150,
    totalScore: 1980,
    bestScore: 680,
    streakDays: 4,
    lastActiveDate: new Date().toISOString().split('T')[0],
    unlockedAchievements: ['first_code'],
  },
];

export const storage = {
  loadProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (data) {
        const parsed = JSON.parse(data);
        const completedLevels = parsed.completedLevels || [];
        let streak = typeof parsed.streakDays === 'number' ? parsed.streakDays : 0;
        if (completedLevels.length === 0 && streak === 5) {
          streak = 0;
        }

        // Normalize grade format if old style was loaded
        const gradeStr = formatGradeClass(parsed.gradeNumber || parsed.grade, parsed.classSection);
        const [gNum, sNum] = gradeStr.split('-').map(Number);

        return {
          ...INITIAL_PROFILE,
          ...parsed,
          username: parsed.username || 'orgil',
          usernameNormalized: normalizeUsername(parsed.username || 'orgil'),
          role: parsed.role || 'STUDENT',
          grade: gradeStr,
          gradeNumber: gNum || 10,
          classSection: sNum || 2,
          streakDays: streak,
          longestStreak: parsed.longestStreak || streak,
          unlockedLevels: parsed.unlockedLevels || [1],
          completedLevels,
          unlockedAchievements: parsed.unlockedAchievements || [],
          activeTrack: parsed.activeTrack || 'python',
          cppCurrentLevel: parsed.cppCurrentLevel || 101,
          cppUnlockedLevels: parsed.cppUnlockedLevels || [101],
          cppCompletedLevels: parsed.cppCompletedLevels || [],
          cppXp: parsed.cppXp || 0,
        };
      }
    } catch {
      // storage unavailable
    }
    return INITIAL_PROFILE;
  },

  saveProfile(profile: StudentProfile): void {
    try {
      const sanitized = {
        ...profile,
        usernameNormalized: normalizeUsername(profile.username || profile.name),
        grade: formatGradeClass(profile.gradeNumber || profile.grade, profile.classSection),
      };
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(sanitized));
      this.upsertStudent(sanitized);
    } catch {
      // ignore
    }
  },

  loadSettings(): GameSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (data) {
        return { ...INITIAL_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // storage unavailable
    }
    return INITIAL_SETTINGS;
  },

  saveSettings(settings: GameSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  },

  loadAllStudents(): StudentProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (data) {
        const parsed: StudentProfile[] = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s) => ({
            ...s,
            grade: formatGradeClass(s.gradeNumber || s.grade, s.classSection),
            usernameNormalized: normalizeUsername(s.username || s.name),
          }));
        }
      }
    } catch {
      // ignore
    }
    this.saveAllStudents(INITIAL_STUDENTS_ROSTER);
    return INITIAL_STUDENTS_ROSTER;
  },

  saveAllStudents(students: StudentProfile[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch {
      // ignore
    }
  },

  upsertStudent(student: StudentProfile): void {
    try {
      const currentList = this.loadAllStudents();
      const normUsername = normalizeUsername(student.username || student.name);
      const studentId = student.id || `st_${normUsername}`;
      const updatedStudent: StudentProfile = {
        ...student,
        id: studentId,
        usernameNormalized: normUsername,
        grade: formatGradeClass(student.gradeNumber || student.grade, student.classSection),
      };

      const existingIndex = currentList.findIndex(
        (s) =>
          s.id === studentId ||
          (s.usernameNormalized && s.usernameNormalized === normUsername) ||
          normalizeUsername(s.name) === normUsername
      );

      let newList: StudentProfile[];
      if (existingIndex >= 0) {
        newList = [...currentList];
        newList[existingIndex] = { ...newList[existingIndex], ...updatedStudent };
      } else {
        newList = [updatedStudent, ...currentList];
      }
      this.saveAllStudents(newList);
    } catch {
      // ignore
    }
  },

  deleteStudent(idOrName: string): StudentProfile[] {
    try {
      const currentList = this.loadAllStudents();
      const targetNorm = normalizeUsername(idOrName);
      const updated = currentList.filter(
        (s) => s.id !== idOrName && normalizeUsername(s.username || s.name) !== targetNorm
      );
      this.saveAllStudents(updated);
      return updated;
    } catch {
      return this.loadAllStudents();
    }
  },

  isValidGmail(email: string): boolean {
    const trimmed = email.trim().toLowerCase();
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(trimmed);
  },

  /**
   * Checks if username is taken in database (case-insensitive normalized)
   */
  checkUsernameAvailability(rawUsername: string): {
    available: boolean;
    error?: string;
    suggestions?: string[];
  } {
    const ruleCheck = validateUsernameRules(rawUsername);
    if (!ruleCheck.valid) {
      return { available: false, error: ruleCheck.error };
    }

    const norm = normalizeUsername(rawUsername);
    const students = this.loadAllStudents();
    const isTaken = students.some((s) => normalizeUsername(s.username || s.name) === norm);

    if (isTaken) {
      const existingUsernames = students.map((s) => s.username || s.name);
      const suggestions = [
        `@${norm}10`,
        `@${norm}_dev`,
        `@${norm}26`,
      ];
      return {
        available: false,
        error: '❌ Username already taken',
        suggestions,
      };
    }

    return { available: true };
  },

  /**
   * Multi-role and strict signup validation
   */
  registerStudentWithSchoolRules(params: {
    username: string; // @username
    displayName: string; // Full Name
    email: string; // @gmail.com
    phone?: string;
    password?: string;
    gradeNumber: number; // 6-12
    classSection: number; // 1-3
    avatar?: string;
    role?: UserRole;
  }): { success: boolean; error?: string; suggestions?: string[]; profile?: StudentProfile } {
    // 1. Username validation
    const usernameCheck = this.checkUsernameAvailability(params.username);
    if (!usernameCheck.available) {
      return {
        success: false,
        error: usernameCheck.error,
        suggestions: usernameCheck.suggestions,
      };
    }

    // 2. Display Name validation
    const displayName = params.displayName.trim();
    if (!displayName) {
      return { success: false, error: 'Нэрээ оруулна уу (Display name is required)' };
    }

    // 3. Email validation
    const email = params.email.trim().toLowerCase();
    if (!this.isValidGmail(email)) {
      return {
        success: false,
        error: 'Зөвхөн албан ёсны @gmail.com хаяг зөвшөөрөгдөнө! (Must be official @gmail.com)',
      };
    }

    // 4. Grade & Class Section validation
    const gradeVal = validateGradeAndClass(params.gradeNumber, params.classSection);
    if (!gradeVal.valid) {
      return { success: false, error: gradeVal.error };
    }

    // 5. Password validation
    const password = params.password ? params.password.trim() : '';
    if (!password || password.length < 4) {
      return { success: false, error: 'Нууц үг хамгийн багадаа 4 оронтой байх ёстой' };
    }

    // 6. Check email uniqueness
    const students = this.loadAllStudents();
    const existsEmail = students.find((s) => (s.email || '').toLowerCase() === email);
    if (existsEmail) {
      return { success: false, error: 'Энэ Gmail хаяг аль хэдийн бүртгэгдсэн байна! (Email already in use)' };
    }

    const normUsername = normalizeUsername(params.username);
    const formattedGrade = formatGradeClass(params.gradeNumber, params.classSection);

    const newStudent: StudentProfile = {
      id: `st_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: displayName,
      username: normUsername,
      usernameNormalized: normUsername,
      role: params.role || 'STUDENT',
      email,
      phone: params.phone || '',
      password,
      grade: formattedGrade,
      gradeNumber: params.gradeNumber,
      classSection: params.classSection,
      avatar: params.avatar || '⚡',
      currentLevel: 1,
      unlockedLevels: [1],
      completedLevels: [],
      totalXp: 0,
      totalScore: 0,
      bestScore: 0,
      streakDays: 0,
      longestStreak: 0,
      lastActiveDate: '',
      unlockedAchievements: [],
      activeTrack: 'python',
      cppCurrentLevel: 101,
      cppUnlockedLevels: [101],
      cppCompletedLevels: [],
      cppXp: 0,
      loginSessionsCount: 1,
    };

    this.upsertStudent(newStudent);
    this.saveProfile(newStudent);
    this.logAuditEvent({
      action: 'ACCOUNT_CREATED',
      userId: newStudent.id,
      username: newStudent.username,
      details: `Cadet account created with username @${newStudent.username}, grade ${newStudent.grade}`,
    });

    return { success: true, profile: newStudent };
  },

  /**
   * Login with account enumeration protection
   */
  loginCadetAccount(
    identifier: string, // username or email or phone
    password?: string
  ): { success: boolean; error?: string; profile?: StudentProfile } {
    const trimmed = identifier.trim().toLowerCase();
    const trimmedPass = (password || '').trim();

    if (!trimmed) {
      return { success: false, error: 'Нэвтрэх нэр эсвэл Gmail хаягаа оруулна уу' };
    }

    const students = this.loadAllStudents();
    const matched = students.find((s) => {
      const email = (s.email || '').toLowerCase();
      const uName = (s.username || '').toLowerCase();
      const uNorm = (s.usernameNormalized || '').toLowerCase();
      const displayName = s.name.toLowerCase();
      const phone = (s.phone || '').replace(/\s+/g, '');
      const inputPhone = trimmed.replace(/\s+/g, '');

      return (
        email === trimmed ||
        uName === trimmed ||
        uNorm === trimmed ||
        uName === trimmed.replace(/^@/, '') ||
        displayName === trimmed ||
        (phone && phone.includes(inputPhone) && inputPhone.length >= 8)
      );
    });

    if (!matched) {
      this.logAuditEvent({
        action: 'LOGIN_FAILED',
        details: 'Failed sign in attempt for unknown identifier (Enumeration protected)',
      });
      return {
        success: false,
        error: 'Нэвтрэх мэдээлэл буруу байна. (Invalid credentials or account does not exist)',
      };
    }

    if (matched.password && matched.password !== trimmedPass) {
      this.logAuditEvent({
        action: 'LOGIN_FAILED',
        userId: matched.id,
        username: matched.username,
        details: 'Incorrect password entered',
      });
      return {
        success: false,
        error: 'Нууц үг буруу байна! (Incorrect password)',
      };
    }

    const updated = {
      ...matched,
      loginSessionsCount: (matched.loginSessionsCount || 1) + 1,
    };
    this.saveProfile(updated);
    this.logAuditEvent({
      action: 'LOGIN_SUCCESS',
      userId: updated.id,
      username: updated.username,
      details: `Successful sign in for @${updated.username || updated.name}`,
    });

    return { success: true, profile: updated };
  },

  /**
   * Rate-limited Username Change with Audit Record
   */
  changeUsername(
    profile: StudentProfile,
    newUsername: string
  ): { success: boolean; error?: string; profile?: StudentProfile } {
    const norm = normalizeUsername(newUsername);
    if (norm === profile.usernameNormalized) {
      return { success: false, error: 'Шинэ нэр одоогийн нэртэй адилхан байна' };
    }

    const check = this.checkUsernameAvailability(newUsername);
    if (!check.available) {
      return { success: false, error: check.error };
    }

    // Rate-limit check (e.g. max once per 14 days)
    if (profile.lastUsernameChangeDate) {
      const lastDate = new Date(profile.lastUsernameChangeDate).getTime();
      const daysDiff = (Date.now() - lastDate) / (1000 * 60 * 60 * 24);
      if (daysDiff < 14) {
        const remaining = Math.ceil(14 - daysDiff);
        return {
          success: false,
          error: `Хэрэглэгчийн нэрийг 14 хоногт нэг удаа солих боломжтой. Үлдсэн: ${remaining} өдөр.`,
        };
      }
    }

    const updated: StudentProfile = {
      ...profile,
      username: norm,
      usernameNormalized: norm,
      lastUsernameChangeDate: new Date().toISOString(),
    };

    this.saveProfile(updated);
    this.logAuditEvent({
      action: 'USERNAME_CHANGED',
      userId: updated.id,
      username: updated.username,
      details: `Username changed from @${profile.username} to @${norm}`,
    });

    return { success: true, profile: updated };
  },

  /**
   * Yearly Grade Promotion without resetting progress
   */
  promoteStudent(profile: StudentProfile, newSection?: number): StudentProfile {
    const currentGrade = profile.gradeNumber || 10;
    const res = promoteStudentGrade(currentGrade, newSection || profile.classSection || 1);

    const updated: StudentProfile = {
      ...profile,
      gradeNumber: res.promotedGrade,
      classSection: res.newSection,
      grade: res.label,
    };

    this.saveProfile(updated);
    this.logAuditEvent({
      action: 'GRADE_PROMOTED',
      userId: updated.id,
      username: updated.username,
      details: `Student promoted to Grade ${res.label} with progress preserved`,
    });

    return updated;
  },

  // Security Audit Logging
  loadAuditLogs(): SecurityAuditLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'log_1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        action: 'LOGIN_SUCCESS',
        username: 'orgil',
        details: 'Signed in from Chrome on macOS (Tsonjin Campus IP)',
        ipMasked: '202.131.•••.14',
      },
      {
        id: 'log_2',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        action: 'ACCOUNT_CREATED',
        username: 'orgil',
        details: 'Cadet profile provisioned with role STUDENT',
        ipMasked: '202.131.•••.14',
      },
    ];
  },

  logAuditEvent(entry: Omit<SecurityAuditLogEntry, 'id' | 'timestamp'>): void {
    try {
      const logs = this.loadAuditLogs();
      const newEntry: SecurityAuditLogEntry = {
        id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        ipMasked: '202.131.•••.14',
        ...entry,
      };
      const updated = [newEntry, ...logs.slice(0, 49)];
      localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  // Multi-Device Sessions Management
  loadSessions(): UserSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [
      {
        id: 'sess_curr',
        device: 'MacBook Pro 14"',
        browser: 'Google Chrome',
        os: 'macOS Sonoma',
        ipMasked: '202.131.•••.14',
        createdAt: '2 hours ago',
        lastActive: 'Just now',
        isCurrent: true,
      },
      {
        id: 'sess_phone',
        device: 'iPhone 15 Pro',
        browser: 'Mobile Safari',
        os: 'iOS 18',
        ipMasked: '202.131.•••.89',
        createdAt: 'Yesterday at 20:15',
        lastActive: '14 hours ago',
        isCurrent: false,
      },
    ];
  },

  revokeSession(sessionId: string): UserSession[] {
    const list = this.loadSessions().filter((s) => s.id !== sessionId || s.isCurrent);
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(list));
    } catch {
      // ignore
    }
    this.logAuditEvent({
      action: 'LOGOUT_DEVICE',
      details: `Revoked session ${sessionId}`,
    });
    return list;
  },

  revokeAllOtherSessions(): UserSession[] {
    const list = this.loadSessions().filter((s) => s.isCurrent);
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(list));
    } catch {
      // ignore
    }
    this.logAuditEvent({
      action: 'LOGOUT_ALL_DEVICES',
      details: 'All other connected devices signed out securely',
    });
    return list;
  },

  loadLeaderboardRaw(): Omit<LeaderboardEntry, 'isCurrentStudent'>[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_LEADERBOARD);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return BASE_LEADERBOARD;
  },

  getLeaderboard(currentStudent: StudentProfile): LeaderboardEntry[] {
    const raw = this.loadLeaderboardRaw();
    const enrolled = this.loadAllStudents();

    const enrolledEntries: Omit<LeaderboardEntry, 'isCurrentStudent'>[] = enrolled.map((s) => ({
      id: s.id || s.name,
      name: s.name,
      username: s.username,
      grade: s.grade || '10-1',
      xp: s.totalXp,
      completedCount: s.completedLevels.length,
      badge: s.completedLevels.length >= 10 ? 'Cyber Hero' : s.totalXp > 1000 ? 'Code Cadet' : 'Active Learner',
    }));

    const nameMap = new Map<string, Omit<LeaderboardEntry, 'isCurrentStudent'>>();
    for (const item of [...raw, ...enrolledEntries]) {
      const key = item.name.trim().toLowerCase();
      const currentStudentKey = (currentStudent.name || '').trim().toLowerCase();
      if (key !== currentStudentKey) {
        if (!nameMap.has(key) || (nameMap.get(key)!.xp < item.xp)) {
          nameMap.set(key, item);
        }
      }
    }

    const list: LeaderboardEntry[] = [
      ...Array.from(nameMap.values()).map((item) => ({ ...item, isCurrentStudent: false })),
      {
        id: 'curr_student',
        name: currentStudent.name || 'You',
        username: currentStudent.username,
        grade: currentStudent.grade || '10-2',
        xp: currentStudent.totalXp,
        completedCount: currentStudent.completedLevels.length,
        badge: currentStudent.completedLevels.length >= 10 ? 'Cyber Hero' : 'Active Learner',
        isCurrentStudent: true,
      },
    ];

    list.sort((a, b) => b.xp - a.xp);
    return list;
  },

  saveLeaderboardRaw(entries: Omit<LeaderboardEntry, 'isCurrentStudent'>[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(entries));
    } catch {
      // ignore
    }
  },

  resetLeaderboard(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_LEADERBOARD);
    } catch {
      // ignore
    }
  },

  createNewStudent(
    name: string,
    grade = '10-2',
    startingLvl = 1,
    startingXp = 0,
    email?: string,
    password?: string
  ): StudentProfile {
    const validLvl = Math.min(12, Math.max(1, startingLvl));
    const unlocked = Array.from({ length: validLvl }, (_, i) => i + 1);
    const completed = Array.from({ length: validLvl - 1 }, (_, i) => i + 1);
    const generatedEmail =
      email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}${Math.floor(Math.random() * 90 + 10)}@gmail.com`;

    const cleanUsername = normalizeUsername(name);
    const formattedGrade = formatGradeClass(grade, 2);
    const [gNum, sNum] = formattedGrade.split('-').map(Number);

    const newStudent: StudentProfile = {
      id: `st_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      username: cleanUsername,
      usernameNormalized: cleanUsername,
      role: 'STUDENT',
      email: generatedEmail,
      phone: '+976 9911 0000',
      password: password || '123456',
      grade: formattedGrade,
      gradeNumber: gNum || 10,
      classSection: sNum || 2,
      avatar: '⚡',
      currentLevel: validLvl,
      unlockedLevels: unlocked,
      completedLevels: completed,
      totalXp: startingXp,
      totalScore: startingXp * 2,
      bestScore: 0,
      streakDays: completed.length > 0 ? 1 : 0,
      longestStreak: completed.length > 0 ? 1 : 0,
      lastActiveDate: completed.length > 0 ? new Date().toISOString().split('T')[0] : '',
      unlockedAchievements: validLvl > 1 ? ['first_code'] : [],
      loginSessionsCount: 1,
    };

    this.upsertStudent(newStudent);
    return newStudent;
  },

  resetAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_PROFILE);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      localStorage.removeItem(STORAGE_KEY_LEADERBOARD);
      localStorage.removeItem(STORAGE_KEY_STUDENTS);
      localStorage.removeItem(STORAGE_KEY_AUDIT_LOGS);
      localStorage.removeItem(STORAGE_KEY_SESSIONS);
    } catch {
      // ignore
    }
  },
};
