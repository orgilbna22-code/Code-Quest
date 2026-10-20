import React, { useState, useEffect } from 'react';
import { ScreenState, StudentProfile, GameSettings, Level, AnswerRecord } from './types';
import { storage } from './utils/storage';
import { calculateStreakUpdate } from './utils/streakEngine';
import { LEVELS } from './data/curriculum';
import { CPP_LEVELS, CppLevel } from './data/cppCurriculum';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { Dashboard } from './components/Dashboard';
import { LevelSelect } from './components/LevelSelect';
import { GamePlay } from './components/GamePlay';
import { CppGamePlay } from './components/CppGamePlay';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { ProfileScreen } from './components/ProfileScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { PythonDesktopModal } from './components/PythonDesktopModal';
import { StudentLoginModal } from './components/StudentLoginModal';
import { OrientationModal } from './components/OrientationModal';
import { CoursesScreen } from './components/CoursesScreen';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CyberQuantumBackground3D } from './components/CyberQuantumBackground3D';
import { NexbotRobotCompanion3D } from './components/NexbotRobotCompanion3D';
import { soundFx } from './utils/sound';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(() => storage.loadProfile());
  const [settings, setSettings] = useState<GameSettings>(() => storage.loadSettings());
  const [screen, setScreen] = useState<ScreenState>('MAIN_MENU');
  const [activeLevel, setActiveLevel] = useState<Level>(LEVELS[0]);

  // Track management: Python vs C++
  const [activeTrack, setActiveTrack] = useState<'python' | 'cpp'>(() => profile.activeTrack || 'cpp');
  const [activeCppLevel, setActiveCppLevel] = useState<CppLevel>(() => {
    const currentId = profile.cppCurrentLevel || 101;
    return CPP_LEVELS.find((l) => l.id === currentId) || CPP_LEVELS[0];
  });

  // Admin Portal Authentication & State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('tsonjin_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // Level Complete Modal state
  const [completedLevelStats, setCompletedLevelStats] = useState<{
    level: Level;
    stats: {
      score: number;
      xpEarned: number;
      correctCount: number;
      totalQuestions: number;
      timeSpentSeconds: number;
      answersLog?: AnswerRecord[];
    };
    isReplay?: boolean;
  } | null>(null);

  // Sync profile to storage on change
  useEffect(() => {
    storage.saveProfile(profile);
  }, [profile]);

  // Sync settings to storage on change
  useEffect(() => {
    storage.saveSettings(settings);
  }, [settings]);

  // Track toggle handler
  const handleToggleTrack = (track: 'python' | 'cpp') => {
    soundFx.click(settings.soundEnabled);
    setActiveTrack(track);
    setProfile((prev) => ({ ...prev, activeTrack: track }));
  };

  // Admin access handler
  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setScreen('ADMIN_PANEL');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      sessionStorage.setItem('tsonjin_admin_auth', 'true');
    } catch {
      // ignore
    }
    setIsAdminLoginOpen(false);
    setScreen('ADMIN_PANEL');
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('tsonjin_admin_auth');
    } catch {
      // ignore
    }
    setScreen('MAIN_MENU');
  };

  // Global hotkey for Developer Admin Console: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleOpenAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminAuthenticated]);

  // Handler: Start or continue playing active quest (Python)
  const handleStartPlaying = () => {
    const currentLvl = LEVELS.find((l) => l.id === profile.currentLevel) || LEVELS[0];
    setActiveLevel(currentLvl);
    setScreen('GAMEPLAY');
  };

  const handleSelectLevel = (level: Level) => {
    setActiveLevel(level);
    setScreen('GAMEPLAY');
  };

  // Handler: Start or continue playing C++ track
  const handleStartCppPlaying = () => {
    const currentCpp =
      CPP_LEVELS.find((l) => l.id === (profile.cppCurrentLevel || 101)) || CPP_LEVELS[0];
    setActiveCppLevel(currentCpp);
    setScreen('CPP_GAMEPLAY');
  };

  const handleSelectCppLevel = (cppLevel: CppLevel) => {
    setActiveCppLevel(cppLevel);
    setScreen('CPP_GAMEPLAY');
  };

  // Handler: Finishing a Python level
  const handleFinishLevel = (stats: {
    score: number;
    xpEarned: number;
    correctCount: number;
    totalQuestions: number;
    timeSpentSeconds: number;
    answersLog: AnswerRecord[];
  }) => {
    const isAlreadyCompleted = profile.completedLevels.includes(activeLevel.id);
    const nextLevelId = activeLevel.id + 1;
    const isPerfect = stats.correctCount === stats.totalQuestions;
    const isFast = stats.timeSpentSeconds < 60;

    setProfile((prev) => {
      const alreadyCleared = prev.completedLevels.includes(activeLevel.id);
      const completedSet = new Set(prev.completedLevels);
      completedSet.add(activeLevel.id);

      const unlockedSet = new Set(prev.unlockedLevels);
      if (nextLevelId <= LEVELS.length) {
        unlockedSet.add(nextLevelId);
      }

      // Check achievements
      const achievementsSet = new Set(prev.unlockedAchievements);
      achievementsSet.add('first_code');

      if (completedSet.has(3)) achievementsSet.add('python_beginner');
      if (completedSet.has(6)) achievementsSet.add('decision_maker');
      if (completedSet.has(7) && completedSet.has(8)) achievementsSet.add('loop_master');
      if (completedSet.has(9) && completedSet.has(11)) achievementsSet.add('data_wizard');
      if (isPerfect) achievementsSet.add('perfect_score');
      if (isFast) achievementsSet.add('speed_coder');
      if (completedSet.size >= 10) achievementsSet.add('python_warrior');
      if (completedSet.has(12)) achievementsSet.add('boss_slayer');

      const nextLevelNum = Math.min(12, Math.max(prev.currentLevel, nextLevelId));
      
      const xpToAdd = alreadyCleared ? 0 : stats.xpEarned;
      const scoreToAdd = alreadyCleared ? 0 : stats.score;
      const newTotalScore = prev.totalScore + scoreToAdd;
      const newBestScore = Math.max(prev.bestScore, stats.score);
      const newTotalXp = prev.totalXp + xpToAdd;

      const streakResult = calculateStreakUpdate(
        prev.streakDays || 0,
        prev.lastActiveDate,
        prev.longestStreak || prev.streakDays || 0,
        new Date(),
        prev.timezone
      );

      return {
        ...prev,
        currentLevel: nextLevelNum,
        completedLevels: Array.from(completedSet),
        unlockedLevels: Array.from(unlockedSet),
        unlockedAchievements: Array.from(achievementsSet),
        totalXp: newTotalXp,
        totalScore: newTotalScore,
        bestScore: newBestScore,
        streakDays: streakResult.streakDays,
        longestStreak: streakResult.longestStreak,
        lastActiveDate: streakResult.lastActiveDate,
      };
    });

    setCompletedLevelStats({
      level: activeLevel,
      stats,
      isReplay: isAlreadyCompleted,
    });
  };

  // Handler: Finishing a C++ Level
  const handleFinishCppLevel = (stats: {
    score: number;
    xpEarned: number;
    correctCount: number;
    totalQuestions: number;
    timeSpentSeconds: number;
    answersLog: AnswerRecord[];
  }) => {
    const alreadyCleared = (profile.cppCompletedLevels || []).includes(activeCppLevel.id);
    const nextCppId = activeCppLevel.id + 1;

    setProfile((prev) => {
      const completedSet = new Set(prev.cppCompletedLevels || []);
      completedSet.add(activeCppLevel.id);

      const unlockedSet = new Set(prev.cppUnlockedLevels || [101]);
      if (nextCppId <= 115) {
        unlockedSet.add(nextCppId);
      }

      const achievementsSet = new Set(prev.unlockedAchievements);
      achievementsSet.add('cpp_starter');

      if (completedSet.has(108)) achievementsSet.add('cpp_pointers');
      if (completedSet.has(110)) achievementsSet.add('cpp_oop');
      if (completedSet.has(107)) achievementsSet.add('cpp_stl');
      if (completedSet.has(114)) achievementsSet.add('cpp_algorithm');
      if (completedSet.has(113)) achievementsSet.add('cpp_systems');

      const xpToAdd = alreadyCleared ? 0 : stats.xpEarned;
      const newCppXp = (prev.cppXp || 0) + xpToAdd;

      const streakResult = calculateStreakUpdate(
        prev.streakDays || 0,
        prev.lastActiveDate,
        prev.longestStreak || prev.streakDays || 0,
        new Date(),
        prev.timezone
      );

      return {
        ...prev,
        cppCurrentLevel: Math.max(prev.cppCurrentLevel || 101, nextCppId),
        cppCompletedLevels: Array.from(completedSet),
        cppUnlockedLevels: Array.from(unlockedSet),
        cppXp: newCppXp,
        unlockedAchievements: Array.from(achievementsSet),
        streakDays: streakResult.streakDays,
        longestStreak: streakResult.longestStreak,
        lastActiveDate: streakResult.lastActiveDate,
      };
    });

    // Provide completion stats in Level format for celebration modal
    setCompletedLevelStats({
      level: {
        id: activeCppLevel.id,
        title: activeCppLevel.title,
        titleMn: activeCppLevel.titleMn,
        subtitle: activeCppLevel.stageTitle,
        subtitleMn: activeCppLevel.stageTitleMn,
        description: activeCppLevel.summary,
        descriptionMn: activeCppLevel.summaryMn,
        difficulty: 'NORMAL',
        xpReward: activeCppLevel.xpReward,
        conceptSummary: {
          heading: activeCppLevel.title,
          headingMn: activeCppLevel.titleMn,
          explanation: activeCppLevel.summary,
          explanationMn: activeCppLevel.summaryMn,
          codeExample: activeCppLevel.codeSnippet,
          keyTakeaway: 'Master Modern C++20 standard practices.',
          keyTakeawayMn: 'C++20 орчин үеийн стандартыг дагаж ажиллаарай.',
        },
        questions: [],
      },
      stats,
      isReplay: alreadyCleared,
    });
  };

  // Level Complete Modal Actions
  const handleNextLevel = () => {
    setCompletedLevelStats(null);
    if (activeTrack === 'cpp') {
      const nextCpp = CPP_LEVELS.find((l) => l.id === activeCppLevel.id + 1);
      if (nextCpp) {
        setActiveCppLevel(nextCpp);
        setScreen('CPP_GAMEPLAY');
      } else {
        setScreen('LEVELS');
      }
    } else {
      const nextLvl = LEVELS.find((l) => l.id === activeLevel.id + 1);
      if (nextLvl) {
        setActiveLevel(nextLvl);
        setScreen('GAMEPLAY');
      } else {
        setScreen('LEVELS');
      }
    }
  };

  const handleRetry = () => {
    setCompletedLevelStats(null);
    if (activeTrack === 'cpp') {
      setScreen('CPP_GAMEPLAY');
    } else {
      setScreen('GAMEPLAY');
    }
  };

  const handleModalMainMenu = () => {
    setCompletedLevelStats(null);
    setScreen('MAIN_MENU');
  };

  const handleLogin = (loggedProfile: StudentProfile) => {
    setProfile(loggedProfile);
    storage.saveProfile(loggedProfile);
    setScreen('DASHBOARD');
  };

  return (
    <div className="relative min-h-screen bg-[#070908] text-white selection:bg-[#00C853] selection:text-[#0B0F0D]">
      {/* 3D Elegant Quantum Computational Background Animation */}
      <CyberQuantumBackground3D enabled={settings.animationsEnabled} />

      {/* Persistent Clean Header */}
      {screen !== 'LOGIN' && (
        <div className="relative z-20">
          <Header
            screen={screen}
            setScreen={setScreen}
            profile={profile}
            settings={settings}
            setSettings={setSettings}
            onOpenAdmin={handleOpenAdmin}
            activeTrack={activeTrack}
            onToggleTrack={handleToggleTrack}
          />
        </div>
      )}

      {/* Main Content Router */}
      <main className="relative z-10 pb-12">
        {screen === 'LOGIN' && (
          <StudentLoginModal
            currentProfile={profile}
            onLogin={handleLogin}
            settings={settings}
            setSettings={setSettings}
          />
        )}

        {screen === 'MAIN_MENU' && (
          <MainMenu
            setScreen={setScreen}
            settings={settings}
            setSettings={setSettings}
            profile={profile}
            startPlaying={handleStartPlaying}
            startCppPlaying={handleStartCppPlaying}
            activeTrack={activeTrack}
            onToggleTrack={handleToggleTrack}
          />
        )}

        {screen === 'DASHBOARD' && (
          <Dashboard
            profile={profile}
            settings={settings}
            onContinue={handleStartPlaying}
            onSelectLevel={handleSelectLevel}
            onSelectCppLevel={handleSelectCppLevel}
            onViewAchievements={() => setScreen('ACHIEVEMENTS')}
            onViewLeaderboard={() => setScreen('LEADERBOARD')}
            onOpenOrientation={() => setScreen('ORIENTATION')}
            activeTrack={activeTrack}
            onToggleTrack={handleToggleTrack}
          />
        )}

        {screen === 'LEVELS' && (
          <LevelSelect
            profile={profile}
            settings={settings}
            onSelectLevel={handleSelectLevel}
            onSelectCppLevel={handleSelectCppLevel}
            onBack={() => setScreen('MAIN_MENU')}
            activeTrack={activeTrack}
            onToggleTrack={handleToggleTrack}
          />
        )}

        {screen === 'GAMEPLAY' && (
          <GamePlay
            key={activeLevel.id}
            level={activeLevel}
            settings={settings}
            isReplay={profile.completedLevels.includes(activeLevel.id)}
            onFinishLevel={handleFinishLevel}
            onExitToLevels={() => setScreen('LEVELS')}
          />
        )}

        {screen === 'CPP_GAMEPLAY' && (
          <CppGamePlay
            key={activeCppLevel.id}
            level={activeCppLevel}
            settings={settings}
            isReplay={(profile.cppCompletedLevels || []).includes(activeCppLevel.id)}
            onFinishLevel={handleFinishCppLevel}
            onExitToLevels={() => setScreen('LEVELS')}
          />
        )}

        {screen === 'COURSES' && (
          <CoursesScreen
            profile={profile}
            settings={settings}
            onBack={() => setScreen('MAIN_MENU')}
            onSelectTrack={handleToggleTrack}
            onGoToLevels={() => setScreen('LEVELS')}
          />
        )}

        {screen === 'PROFILE' && (
          <ProfileScreen
            profile={profile}
            setProfile={setProfile}
            settings={settings}
            onBack={() => setScreen('MAIN_MENU')}
            onViewAchievements={() => setScreen('ACHIEVEMENTS')}
            onOpenCourses={() => setScreen('COURSES')}
          />
        )}

        {screen === 'LEADERBOARD' && (
          <LeaderboardScreen
            profile={profile}
            settings={settings}
            onBack={() => setScreen('MAIN_MENU')}
          />
        )}

        {screen === 'ACHIEVEMENTS' && (
          <AchievementsScreen
            profile={profile}
            settings={settings}
            onBack={() => setScreen('MAIN_MENU')}
          />
        )}

        {screen === 'SETTINGS' && (
          <SettingsScreen
            settings={settings}
            setSettings={setSettings}
            profile={profile}
            setProfile={setProfile}
            onBack={() => setScreen('MAIN_MENU')}
            onOpenAdmin={handleOpenAdmin}
          />
        )}

        {screen === 'PYTHON_SOURCE' && (
          <PythonDesktopModal
            onBack={() => setScreen('MAIN_MENU')}
            settings={settings}
          />
        )}

        {screen === 'ORIENTATION' && (
          <OrientationModal
            settings={settings}
            profile={profile}
            setProfile={setProfile}
            onBack={() => setScreen('MAIN_MENU')}
          />
        )}

        {screen === 'ADMIN_PANEL' && (
          <AdminPanel
            profile={profile}
            setProfile={setProfile}
            settings={settings}
            onExit={() => setScreen('MAIN_MENU')}
            onLogoutAdmin={handleLogoutAdmin}
            onPlayLevel={(lvl) => {
              setActiveLevel(lvl);
              setScreen('GAMEPLAY');
            }}
          />
        )}
      </main>

      {/* Level Complete Celebration Modal */}
      {completedLevelStats && (
        <LevelCompleteModal
          level={completedLevelStats.level}
          stats={completedLevelStats.stats}
          settings={settings}
          isReplay={completedLevelStats.isReplay}
          onNextLevel={handleNextLevel}
          onRetry={handleRetry}
          onMainMenu={handleModalMainMenu}
        />
      )}

      {/* Admin Developer Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
        soundEnabled={settings.soundEnabled}
      />

      {/* 3D Animated Cyber Robot Companion with Cursor Tracking */}
      <NexbotRobotCompanion3D
        soundEnabled={settings.soundEnabled}
        language={settings.language}
        celebrateTrigger={completedLevelStats ? 1 : 0}
      />
    </div>
  );
}
