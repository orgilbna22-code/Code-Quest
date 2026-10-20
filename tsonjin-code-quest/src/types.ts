export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'find_correct_code'
  | 'find_error'
  | 'predict_output'
  | 'fill_blank'
  | 'code_challenge';

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD' | 'BOSS';

export interface LocalizedString {
  en: string;
  mn: string;
}

export interface MistakeDetail {
  whyWrong: string;
  whyWrongMn: string;
  conceptRule?: string;
  conceptRuleMn?: string;
}

export interface AnswerRecord {
  questionId: string;
  questionPrompt: string;
  questionPromptMn?: string;
  codeSnippet?: string;
  userAnswerText: string;
  correctAnswerText: string;
  isCorrect: boolean;
  explanation: string;
  explanationMn?: string;
  whyWrong?: string;
  whyWrongMn?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title?: string;
  prompt: string;
  promptMn?: string;
  codeSnippet?: string;
  options?: string[];
  optionsMn?: string[];
  correctAnswer: string | number; // index or exact string
  explanation: string;
  explanationMn?: string;
  whyWrongCommon?: string;
  whyWrongCommonMn?: string;
  mistakeDetails?: Record<string | number, MistakeDetail>;
  hint?: string;
  hintMn?: string;
  starterCode?: string;
  expectedOutput?: string;
  blankTemplate?: string; // for fill_blank: e.g. 'print(____)'
}

export interface ConceptSummary {
  heading: string;
  headingMn: string;
  explanation: string;
  explanationMn: string;
  codeExample: string;
  keyTakeaway: string;
  keyTakeawayMn: string;
  missionDirective?: string;
  missionDirectiveMn?: string;
  cyberTip?: string;
  cyberTipMn?: string;
}

export interface Level {
  id: number;
  title: string;
  titleMn?: string;
  subtitle: string;
  subtitleMn?: string;
  description: string;
  descriptionMn?: string;
  difficulty: Difficulty;
  xpReward: number;
  conceptSummary: ConceptSummary;
  questions: Question[];
  isBoss?: boolean;
}

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface StudentProfile {
  id?: string;
  name: string; // Display Name (e.g. "Orgil" or "Т. Оргил")
  username?: string; // Unique username (e.g. "orgil", "@orgil")
  usernameNormalized?: string; // lowercase trimmed unique key
  role?: UserRole;
  email?: string;
  phone?: string; // Mongolian phone (+976 ...)
  password?: string;
  avatar?: string;
  grade?: string; // e.g. "10-2"
  gradeNumber?: number; // e.g. 10
  classSection?: number; // e.g. 2
  currentLevel: number;
  unlockedLevels: number[];
  completedLevels: number[];
  totalXp: number;
  totalScore: number;
  bestScore: number;
  streakDays: number;
  longestStreak?: number;
  lastActiveDate: string;
  timezone?: string;
  unlockedAchievements: string[];
  activeTrack?: 'python' | 'cpp';
  cppCurrentLevel?: number;
  cppUnlockedLevels?: number[];
  cppCompletedLevels?: number[];
  cppXp?: number;
  cppCompletedExercises?: string[];
  cppCompletedProjects?: string[];
  lastUsernameChangeDate?: string;
  loginSessionsCount?: number;
}

export interface StudentAccount {
  id: string;
  username: string;
  usernameNormalized: string;
  displayName: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  gradeNumber: number;
  classSection: number;
  gradeFormatted: string; // e.g. "10-2"
  avatar?: string;
  profile: StudentProfile;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  username?: string;
  grade: string;
  xp: number;
  completedCount: number;
  badge?: string;
  isCurrentStudent?: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  timerEnabled: boolean;
  language: 'en' | 'mn';
}

export type ScreenState =
  | 'LOGIN'
  | 'MAIN_MENU'
  | 'DASHBOARD'
  | 'COURSES'
  | 'LEVELS'
  | 'GAMEPLAY'
  | 'CPP_GAMEPLAY'
  | 'PROFILE'
  | 'LEADERBOARD'
  | 'ACHIEVEMENTS'
  | 'SETTINGS'
  | 'PYTHON_SOURCE'
  | 'ORIENTATION'
  | 'ADMIN_PANEL';

