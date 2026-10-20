import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Star,
  Flame,
  Award,
  Lock,
  Unlock,
  CheckCircle2,
  Users,
  Plus,
  Trash2,
  Download,
  Upload,
  RefreshCcw,
  Play,
  RotateCcw,
  LogOut,
  Sliders,
  Check,
  Edit2,
  FileCode2,
  BookOpen,
  UserPlus,
  UserCheck,
  GraduationCap,
} from 'lucide-react';
import { StudentProfile, GameSettings, Level, LeaderboardEntry } from '../types';
import { LEVELS } from '../data/curriculum';
import { storage } from '../utils/storage';
import { soundFx } from '../utils/sound';
import { ALL_CLASS_LABELS } from '../utils/gradeSystem';

interface AdminPanelProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  settings: GameSettings;
  onExit: () => void;
  onLogoutAdmin: () => void;
  onPlayLevel: (level: Level) => void;
}

const ALL_ACHIEVEMENTS = [
  { id: 'first_code', title: 'Анхны Код (First Code)', xp: 50 },
  { id: 'python_beginner', title: 'Python Анхан Шат (Beginner)', xp: 100 },
  { id: 'decision_maker', title: 'Нөхцөлт Шалгагч (Decision Maker)', xp: 150 },
  { id: 'loop_master', title: 'Давталтын Мастер (Loop Master)', xp: 200 },
  { id: 'data_wizard', title: 'Өгөгдлийн Шидтэн (Data Wizard)', xp: 250 },
  { id: 'perfect_score', title: 'Төгс Гүйцэтгэл (Perfect Score)', xp: 100 },
  { id: 'speed_coder', title: 'Хурдан Кодлогч (Speed Coder)', xp: 150 },
  { id: 'python_warrior', title: 'Кибер Дайчин (Python Warrior)', xp: 300 },
  { id: 'boss_slayer', title: 'Босс Ялагч (Boss Slayer)', xp: 500 },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  profile,
  setProfile,
  settings,
  onExit,
  onLogoutAdmin,
  onPlayLevel,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'students' | 'levels' | 'leaderboard' | 'system'>('students');
  const [notification, setNotification] = useState<string | null>(null);

  // Form states for profile editing
  const [nameInput, setNameInput] = useState(profile.name);
  const [xpInput, setXpInput] = useState(String(profile.totalXp));
  const [scoreInput, setScoreInput] = useState(String(profile.totalScore));
  const [bestScoreInput, setBestScoreInput] = useState(String(profile.bestScore));
  const [streakInput, setStreakInput] = useState(String(profile.streakDays));

  // Registered Students Roster state
  const [studentsList, setStudentsList] = useState<StudentProfile[]>(() => storage.loadAllStudents());
  const [singleStudentName, setSingleStudentName] = useState('');
  const [singleStudentGrade, setSingleStudentGrade] = useState('10-2');
  const [singleStudentLevel, setSingleStudentLevel] = useState('1');
  const [singleStudentXp, setSingleStudentXp] = useState('0');

  // Batch students enrollment state
  const [batchNamesText, setBatchNamesText] = useState('');
  const [batchGrade, setBatchGrade] = useState('10-2');
  const [batchLevel, setBatchLevel] = useState('1');
  const [batchXp, setBatchXp] = useState('0');

  // Leaderboard management state
  const [leaderboardList, setLeaderboardList] = useState<Omit<LeaderboardEntry, 'isCurrentStudent'>[]>(
    () => storage.loadLeaderboardRaw()
  );
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('10-2');
  const [newStudentXp, setNewStudentXp] = useState('1500');
  const [newStudentLevels, setNewStudentLevels] = useState('7');
  const [newStudentBadge, setNewStudentBadge] = useState('Code Cadet');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Student Enrollment Handlers
  const handleEnrollSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = singleStudentName.trim();
    if (!trimmed) return;
    soundFx.click(settings.soundEnabled);

    const lvl = Math.min(12, Math.max(1, parseInt(singleStudentLevel, 10) || 1));
    const xp = Math.max(0, parseInt(singleStudentXp, 10) || 0);

    storage.createNewStudent(trimmed, singleStudentGrade, lvl, xp);
    const updated = storage.loadAllStudents();
    setStudentsList(updated);
    setSingleStudentName('');
    showNotice(`Сурагч "${trimmed}" (${singleStudentGrade}) амжилттай бүртгэгдлээ!`);
  };

  const handleBatchEnrollStudents = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchNamesText.trim()) return;
    soundFx.click(settings.soundEnabled);

    const lines = batchNamesText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    const lvl = Math.min(12, Math.max(1, parseInt(batchLevel, 10) || 1));
    const xp = Math.max(0, parseInt(batchXp, 10) || 0);

    let count = 0;
    for (const name of lines) {
      storage.createNewStudent(name, batchGrade, lvl, xp);
      count++;
    }

    const updated = storage.loadAllStudents();
    setStudentsList(updated);
    setBatchNamesText('');
    showNotice(`Нийт ${count} сурагчийг (${batchGrade}) жагсаалтаар амжилттай бүртгэлээ!`);
  };

  const handleSwitchToStudent = (st: StudentProfile) => {
    soundFx.click(settings.soundEnabled);
    setProfile(st);
    setNameInput(st.name);
    setXpInput(String(st.totalXp));
    setScoreInput(String(st.totalScore));
    setBestScoreInput(String(st.bestScore));
    setStreakInput(String(st.streakDays));
    showNotice(`Идэвхтэй тоглогчийг "${st.name}" (${st.grade || 'Cadet'}) болгож шилжүүллээ!`);
  };

  const handleDeleteStudentRecord = (id: string, name: string) => {
    if (confirm(`Сурагч "${name}"-г системээс хасахдаа итгэлтэй байна уу?`)) {
      soundFx.click(settings.soundEnabled);
      const updated = storage.deleteStudent(id);
      setStudentsList(updated);
      showNotice(`Сурагч "${name}" амжилттай хасагдлаа.`);
    }
  };

  const handleQuickAdjustStudentXp = (st: StudentProfile, delta: number) => {
    soundFx.click(settings.soundEnabled);
    const newXp = Math.max(0, st.totalXp + delta);
    const updatedStudent: StudentProfile = {
      ...st,
      totalXp: newXp,
      totalScore: Math.max(st.totalScore, newXp * 2),
    };
    storage.upsertStudent(updatedStudent);
    if (profile.id === st.id || profile.name === st.name) {
      setProfile(updatedStudent);
      setXpInput(String(newXp));
    }
    setStudentsList(storage.loadAllStudents());
    showNotice(`${st.name}: ${delta > 0 ? `+${delta}` : delta} XP өөрчлөгдлөө`);
  };

  // Profile XP modifications
  const handleModifyXp = (amount: number) => {
    soundFx.click(settings.soundEnabled);
    setProfile((prev) => {
      const updated = Math.max(0, prev.totalXp + amount);
      setXpInput(String(updated));
      return { ...prev, totalXp: updated };
    });
    showNotice(`XP амжилттай өөрчлөгдлөө: ${amount > 0 ? `+${amount}` : amount}`);
  };

  const handleSaveProfileStats = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.click(settings.soundEnabled);

    const parsedXp = Math.max(0, parseInt(xpInput, 10) || 0);
    const parsedScore = Math.max(0, parseInt(scoreInput, 10) || 0);
    const parsedBest = Math.max(0, parseInt(bestScoreInput, 10) || 0);
    const parsedStreak = Math.max(0, parseInt(streakInput, 10) || 0);

    setProfile((prev) => ({
      ...prev,
      name: nameInput.trim() || 'Student',
      totalXp: parsedXp,
      totalScore: parsedScore,
      bestScore: parsedBest,
      streakDays: parsedStreak,
    }));

    showNotice('Сурагчийн мэдээлэл хадгалагдлаа!');
  };

  // Level controls
  const handleUnlockAllLevels = () => {
    soundFx.click(settings.soundEnabled);
    setProfile((prev) => ({
      ...prev,
      unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    }));
    showNotice('Бүх 12 түвшнийг нээлээ!');
  };

  const handleCompleteAllLevels = () => {
    soundFx.click(settings.soundEnabled);
    setProfile((prev) => ({
      ...prev,
      unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      currentLevel: 12,
    }));
    showNotice('Бүх 12 түвшнийг амжилттай давснаар тэмдэглэлээ!');
  };

  const handleResetLevels = () => {
    soundFx.click(settings.soundEnabled);
    setProfile((prev) => ({
      ...prev,
      currentLevel: 1,
      unlockedLevels: [1],
      completedLevels: [],
    }));
    showNotice('Түвшний ахицыг Level 1 болгож шинэчиллээ.');
  };

  const handleToggleLevelUnlocked = (lvlId: number) => {
    soundFx.click(settings.soundEnabled);
    setProfile((prev) => {
      const set = new Set(prev.unlockedLevels);
      if (set.has(lvlId)) {
        if (set.size > 1) set.delete(lvlId);
      } else {
        set.add(lvlId);
      }
      return { ...prev, unlockedLevels: Array.from(set).sort((a, b) => a - b) };
    });
  };

  const handleToggleLevelCompleted = (lvlId: number) => {
    soundFx.click(settings.soundEnabled);
    setProfile((prev) => {
      const set = new Set(prev.completedLevels);
      const unlocked = new Set(prev.unlockedLevels);
      if (set.has(lvlId)) {
        set.delete(lvlId);
      } else {
        set.add(lvlId);
        unlocked.add(lvlId);
      }
      return {
        ...prev,
        unlockedLevels: Array.from(unlocked).sort((a, b) => a - b),
        completedLevels: Array.from(set).sort((a, b) => a - b),
      };
    });
  };

  // Achievements controls
  const handleUnlockAllAchievements = () => {
    soundFx.click(settings.soundEnabled);
    setProfile((prev) => ({
      ...prev,
      unlockedAchievements: ALL_ACHIEVEMENTS.map((a) => a.id),
    }));
    showNotice('Бүх ололт амжилтуудыг нээлээ!');
  };

  const handleResetAchievements = () => {
    soundFx.click(settings.soundEnabled);
    setProfile((prev) => ({
      ...prev,
      unlockedAchievements: [],
    }));
    showNotice('Ололт амжилтуудыг цэвэрлэлээ.');
  };

  const handleToggleAchievement = (achId: string) => {
    soundFx.click(settings.soundEnabled);
    setProfile((prev) => {
      const set = new Set(prev.unlockedAchievements);
      if (set.has(achId)) {
        set.delete(achId);
      } else {
        set.add(achId);
      }
      return { ...prev, unlockedAchievements: Array.from(set) };
    });
  };

  // Leaderboard controls
  const handleAddStudentToLeaderboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    soundFx.click(settings.soundEnabled);

    const newEntry: Omit<LeaderboardEntry, 'isCurrentStudent'> = {
      id: `dev_${Date.now()}`,
      name: newStudentName.trim(),
      grade: newStudentGrade.trim(),
      xp: parseInt(newStudentXp, 10) || 0,
      completedCount: parseInt(newStudentLevels, 10) || 0,
      badge: newStudentBadge.trim() || 'Cadet',
    };

    const updated = [...leaderboardList, newEntry];
    setLeaderboardList(updated);
    storage.saveLeaderboardRaw(updated);
    setNewStudentName('');
    showNotice(`Сурагч ${newEntry.name} жагсаалтад амжилттай нэмэгдлээ!`);
  };

  const handleDeleteLeaderboardStudent = (id: string) => {
    soundFx.click(settings.soundEnabled);
    const updated = leaderboardList.filter((item) => item.id !== id);
    setLeaderboardList(updated);
    storage.saveLeaderboardRaw(updated);
    showNotice('Сурагч жагсаалтаас устгагдлаа.');
  };

  const handleUpdateStudentXp = (id: string, delta: number) => {
    soundFx.click(settings.soundEnabled);
    const updated = leaderboardList.map((item) => {
      if (item.id === id) {
        return { ...item, xp: Math.max(0, item.xp + delta) };
      }
      return item;
    });
    setLeaderboardList(updated);
    storage.saveLeaderboardRaw(updated);
  };

  const handleResetLeaderboardToDefault = () => {
    soundFx.click(settings.soundEnabled);
    storage.resetLeaderboard();
    const defaults = storage.loadLeaderboardRaw();
    setLeaderboardList(defaults);
    showNotice('Шилдэг сурагчдын жагсаалтыг үндсэн төлөвт нь орууллаа.');
  };

  // God Mode Preset
  const handleGodMode = () => {
    soundFx.complete(settings.soundEnabled);
    setProfile({
      name: 'Orgil (Lead Developer)',
      currentLevel: 12,
      unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      totalXp: 5000,
      totalScore: 9999,
      bestScore: 2450,
      streakDays: 30,
      lastActiveDate: new Date().toISOString().split('T')[0],
      unlockedAchievements: ALL_ACHIEVEMENTS.map((a) => a.id),
    });
    setNameInput('Orgil (Lead Developer)');
    setXpInput('5000');
    setScoreInput('9999');
    setBestScoreInput('2450');
    setStreakInput('30');
    showNotice('👑 Developer God Mode идэвхжлээ! (Max stats, all levels & achievements)');
  };

  // Export / Import
  const handleExportJson = () => {
    soundFx.click(settings.soundEnabled);
    const data = {
      profile,
      leaderboard: leaderboardList,
      exportDate: new Date().toISOString(),
      app: 'Tsonjin Code Quest',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tsonjin_quest_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Мэдээлэл JSON файлаар татагдлаа!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile) {
          setProfile(parsed.profile);
          setNameInput(parsed.profile.name);
          setXpInput(String(parsed.profile.totalXp));
        }
        if (parsed.leaderboard) {
          setLeaderboardList(parsed.leaderboard);
          storage.saveLeaderboardRaw(parsed.leaderboard);
        }
        soundFx.correct(settings.soundEnabled);
        showNotice('Мэдээлэл амжилттай импортлогдон сэргэлээ!');
      } catch {
        soundFx.error(settings.soundEnabled);
        showNotice('JSON файл буруу бүтэцтэй байна!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#131916] p-6 shadow-2xl sm:p-8">
        <div className="absolute top-0 right-0 h-40 w-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 shadow-inner">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  DEVELOPER CONSOLE
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
                  ONLINE • ORGIL
                </span>
              </div>
              <h1 className="text-2xl font-black text-white sm:text-3xl tracking-tight">
                Хөгжүүлэгчийн Удирдлагын Самбар (Admin Panel)
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Сурагчдын XP, түвшин, даалгаврууд болон системийн бүх датаг шууд удирдах цонх
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleGodMode}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 transition-colors hover:bg-amber-500/20"
              title="Give max XP, all levels and all achievements"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>God Mode</span>
            </button>
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-[#0B0F0D] px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-500/50 hover:text-white"
            >
              <span>Тоглоом руу буцах</span>
            </button>
            <button
              onClick={onLogoutAdmin}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/20 px-3.5 py-2 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-950/40 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Гарах (Lock)</span>
            </button>
          </div>
        </div>

        {/* Floating Notification */}
        {notification && (
          <div className="relative z-10 mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/50 p-3 text-xs font-medium text-emerald-300 animate-fadeIn">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="relative z-10 mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold font-mono transition-all ${
              activeTab === 'profile'
                ? 'bg-emerald-500 text-[#0B0F0D]'
                : 'bg-[#0B0F0D] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Сурагчийн Профайл & XP</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold font-mono transition-all ${
              activeTab === 'students'
                ? 'bg-emerald-500 text-[#0B0F0D]'
                : 'bg-[#0B0F0D] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Сурагчид Оруулах & Бүртгэл ({studentsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('levels')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold font-mono transition-all ${
              activeTab === 'levels'
                ? 'bg-emerald-500 text-[#0B0F0D]'
                : 'bg-[#0B0F0D] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Түвшин & Ололт Амжилт (Levels)</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold font-mono transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-emerald-500 text-[#0B0F0D]'
                : 'bg-[#0B0F0D] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Шилдэг Сурагчид (Leaderboard)</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold font-mono transition-all ${
              activeTab === 'system'
                ? 'bg-emerald-500 text-[#0B0F0D]'
                : 'bg-[#0B0F0D] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileCode2 className="h-3.5 w-3.5" />
            <span>Нөөцлөлт & Систем (Data/Reset)</span>
          </button>
        </div>
      </div>

      {/* Tab: Students Enrollment & Roster Management */}
      {activeTab === 'students' && (
        <div className="mt-6 space-y-6">
          {/* Top Quick Roster Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-[#131916] p-4 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-[#0B0F0D] text-emerald-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400">Нийт Бүртгэлтэй Сурагчид</div>
                <div className="text-2xl font-black font-mono text-white">
                  {studentsList.length} <span className="text-xs font-normal text-slate-400">хүүхэд</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#131916] p-4 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-[#0B0F0D] text-amber-400">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400">Одоо Идэвхтэй Тоглогч</div>
                <div className="text-lg font-bold font-mono text-emerald-400 truncate max-w-[180px]">
                  {profile.name} <span className="text-xs font-normal text-slate-400">({profile.grade || 'Cadet'})</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#131916] p-4 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-[#0B0F0D] text-emerald-400">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400">Түвшний Дундаж Ахиц</div>
                <div className="text-2xl font-black font-mono text-white">
                  Level {Math.round(studentsList.reduce((acc, s) => acc + s.currentLevel, 0) / (studentsList.length || 1))} / 12
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Forms for Single and Batch Student Enrollment */}
            <div className="lg:col-span-5 space-y-6">
              {/* Form 1: Single Student Enrollment */}
              <div className="rounded-3xl border border-slate-800/80 bg-[#131916] p-6 space-y-4">
                <div className="border-b border-slate-800/80 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-emerald-400" />
                    <span>Шинэ Сурагч Бүртгэж Оруулах</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Нэг сурагчийг өөрийн анги, эхлэх түвшин, XP-тэйгээр системд бүртгэнэ
                  </p>
                </div>

                <form onSubmit={handleEnrollSingleStudent} className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Сурагчийн Нэр (Овог, Нэр)</label>
                    <input
                      type="text"
                      placeholder="Жишээ: Тэмүүлэн Батбаяр"
                      value={singleStudentName}
                      onChange={(e) => setSingleStudentName(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-3 text-white focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1">Анги / Бүлэг</label>
                      <select
                        value={singleStudentGrade}
                        onChange={(e) => setSingleStudentGrade(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-3 text-white focus:border-emerald-500 focus:outline-none"
                      >
                        {ALL_CLASS_LABELS.map((label) => (
                          <option key={label} value={label}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Эхлэх Түвшин (1-12)</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={singleStudentLevel}
                        onChange={(e) => setSingleStudentLevel(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-3 text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Эхлэх XP (Бонус)</label>
                    <input
                      type="number"
                      min="0"
                      value={singleStudentXp}
                      onChange={(e) => setSingleStudentXp(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-3 text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-emerald-500 py-3 text-xs font-bold text-[#0B0F0D] hover:bg-emerald-400 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    + Сурагчийг Системд Бүртгэх
                  </button>
                </form>
              </div>

              {/* Form 2: Batch Student Import (Олноор нь оруулах) */}
              <div className="rounded-3xl border border-emerald-500/25 bg-[#131916] p-6 space-y-4">
                <div className="border-b border-slate-800/80 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <span>Олноор нь Оруулах (Batch Import)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ангийн сурагчдын нэрсийг мөр мөрөөр хуулж тавиад 1 товшилтоор бүгдийг оруулах
                  </p>
                </div>

                <form onSubmit={handleBatchEnrollStudents} className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Сурагчдын Нэрс (Мөр бүрт нэг нэр):
                    </label>
                    <textarea
                      rows={5}
                      value={batchNamesText}
                      onChange={(e) => setBatchNamesText(e.target.value)}
                      placeholder={`Бат-Эрдэнэ\nМөнх-Оргил\nЦэнгэл\nХонгорзул\nАнар`}
                      className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-3 text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1">Бүлэг / Анги</label>
                      <select
                        value={batchGrade}
                        onChange={(e) => setBatchGrade(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-3 text-white focus:border-emerald-500 focus:outline-none"
                      >
                        {ALL_CLASS_LABELS.map((label) => (
                          <option key={label} value={label}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Эхлэх Түвшин</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={batchLevel}
                        onChange={(e) => setBatchLevel(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-3 text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!batchNamesText.trim()}
                    className={`w-full rounded-xl py-3 text-xs font-bold transition-all ${
                      batchNamesText.trim()
                        ? 'bg-emerald-500 text-[#0B0F0D] hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    🚀 Жагсаалтын Бүх Сурагчдыг Нэг Доор Бүртгэх
                  </button>
                </form>
              </div>
            </div>

            {/* Right 7 Cols: Student Roster Table & Quick Controls */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-800/80 bg-[#131916] p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-emerald-400" />
                      <span>Бүртгэлтэй Сурагчдын Нэгдсэн Жагсаалт</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Сурагч бүрийн ахиц, XP, түвшин харах ба шууд тэр сурагчаар нэвтрэн тоглох
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      soundFx.click(settings.soundEnabled);
                      setStudentsList(storage.loadAllStudents());
                      showNotice('Жагсаалтыг шинэчлэн татлаа');
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#0B0F0D] px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white"
                  >
                    <RefreshCcw className="h-3 w-3" />
                    <span>Шинэчлэх</span>
                  </button>
                </div>

                <div className="overflow-x-auto max-h-[620px] overflow-y-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="sticky top-0 bg-[#131916] border-b border-slate-800 text-slate-400 z-10">
                      <tr>
                        <th className="py-2.5 px-3">Сурагч</th>
                        <th className="py-2.5 px-3">Анги</th>
                        <th className="py-2.5 px-3">Түвшин</th>
                        <th className="py-2.5 px-3">XP</th>
                        <th className="py-2.5 px-3">XP Засах</th>
                        <th className="py-2.5 px-3 text-right">Үйлдэл</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {studentsList.map((st) => {
                        const isActive = profile.id === st.id || profile.name.trim().toLowerCase() === st.name.trim().toLowerCase();

                        return (
                          <tr
                            key={st.id || st.name}
                            className={`transition-colors ${
                              isActive ? 'bg-emerald-950/25 border-l-2 border-emerald-400' : 'hover:bg-[#0B0F0D]/60'
                            }`}
                          >
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                    isActive
                                      ? 'bg-emerald-500 text-[#0B0F0D]'
                                      : 'bg-slate-800 text-slate-300'
                                  }`}
                                >
                                  {st.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-white flex items-center gap-1.5">
                                    <span>{st.name}</span>
                                    {isActive && (
                                      <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                                        ACTIVE
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    {st.email || `${st.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`}
                                  </div>
                                  <div className="text-[9px] text-slate-500">
                                    Давсан: {st.completedLevels.length}/12
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-slate-300">{st.grade || 'Cadet'}</td>

                            <td className="py-3 px-3">
                              <span className="rounded-md bg-slate-800 px-2 py-0.5 font-bold text-emerald-300">
                                Lvl {st.currentLevel}
                              </span>
                            </td>

                            <td className="py-3 px-3 font-bold text-emerald-400">
                              {st.totalXp.toLocaleString()} XP
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleQuickAdjustStudentXp(st, 100)}
                                  className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 hover:bg-emerald-950/40"
                                  title="+100 XP"
                                >
                                  +100
                                </button>
                                <button
                                  onClick={() => handleQuickAdjustStudentXp(st, 500)}
                                  className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 hover:bg-emerald-950/40"
                                  title="+500 XP"
                                >
                                  +500
                                </button>
                                <button
                                  onClick={() => handleQuickAdjustStudentXp(st, -100)}
                                  className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-rose-400 hover:bg-rose-950/40"
                                  title="-100 XP"
                                >
                                  -100
                                </button>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {!isActive && (
                                  <button
                                    onClick={() => handleSwitchToStudent(st)}
                                    className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500 hover:text-[#0B0F0D] transition-colors"
                                    title="Энэ сурагчаар нэвтрэн тоглох"
                                  >
                                    <UserCheck className="h-3 w-3" />
                                    <span>Нэвтрэх</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDeleteStudentRecord(st.id || st.name, st.name)}
                                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-950/30 hover:text-rose-400 transition-colors"
                                  title="Устгах"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Profile & XP Controller */}
      {activeTab === 'profile' && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Form */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-800/80 bg-[#131916] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-400" />
                <span>Сурагчийн Үзүүлэлтүүдийг Өөрчлөх</span>
              </h3>
              <span className="font-mono text-xs text-emerald-400">
                Current: {profile.totalXp.toLocaleString()} XP
              </span>
            </div>

            <form onSubmit={handleSaveProfileStats} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-400 mb-1">
                    Сурагчийн Нэр (Student Name)
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-3 font-mono text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-400 mb-1">
                    Нийт XP (Total XP)
                  </label>
                  <input
                    type="number"
                    value={xpInput}
                    onChange={(e) => setXpInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-3 font-mono text-sm text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-400 mb-1">
                    Нийт Оноо (Total Score)
                  </label>
                  <input
                    type="number"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-3 font-mono text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-400 mb-1">
                    Өдрийн Дараалал (Streak Days)
                  </label>
                  <input
                    type="number"
                    value={streakInput}
                    onChange={(e) => setStreakInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-3 font-mono text-sm text-amber-300 font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-[#0B0F0D] transition-all hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                >
                  Шинэчлэлийг Хадгалах (Save Changes)
                </button>
              </div>
            </form>

            {/* Quick XP Modifiers */}
            <div className="border-t border-slate-800/80 pt-4">
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-2">
                ⚡ Түргэн XP Тохируулгууд (Quick XP Boost / Penalty):
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleModifyXp(100)}
                  className="rounded-xl border border-emerald-500/30 bg-[#0B0F0D] px-3 py-1.5 font-mono text-xs font-bold text-emerald-400 hover:bg-emerald-950/30"
                >
                  +100 XP
                </button>
                <button
                  onClick={() => handleModifyXp(500)}
                  className="rounded-xl border border-emerald-500/30 bg-[#0B0F0D] px-3 py-1.5 font-mono text-xs font-bold text-emerald-400 hover:bg-emerald-950/30"
                >
                  +500 XP
                </button>
                <button
                  onClick={() => handleModifyXp(1000)}
                  className="rounded-xl border border-emerald-500/30 bg-[#0B0F0D] px-3 py-1.5 font-mono text-xs font-bold text-emerald-400 hover:bg-emerald-950/30"
                >
                  +1,000 XP
                </button>
                <button
                  onClick={() => handleModifyXp(-200)}
                  className="rounded-xl border border-rose-500/30 bg-[#0B0F0D] px-3 py-1.5 font-mono text-xs font-bold text-rose-400 hover:bg-rose-950/30"
                >
                  -200 XP
                </button>
                <button
                  onClick={() => handleModifyXp(-500)}
                  className="rounded-xl border border-rose-500/30 bg-[#0B0F0D] px-3 py-1.5 font-mono text-xs font-bold text-rose-400 hover:bg-rose-950/30"
                >
                  -500 XP
                </button>
                <button
                  onClick={() => {
                    soundFx.click(settings.soundEnabled);
                    setProfile((prev) => ({ ...prev, totalXp: 0 }));
                    setXpInput('0');
                    showNotice('XP 0 болж цэвэрлэгдлээ');
                  }}
                  className="rounded-xl border border-slate-700 bg-[#0B0F0D] px-3 py-1.5 font-mono text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Zero XP
                </button>
              </div>
            </div>
          </div>

          {/* Profile Overview Card */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#131916] p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <span>Шууд Үзүүлэлт (Live Preview)</span>
            </h3>

            <div className="rounded-2xl border border-slate-800 bg-[#0B0F0D] p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Нэр:</span>
                <span className="font-bold text-white">{profile.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Түвшин:</span>
                <span className="font-bold text-emerald-400">Level {profile.currentLevel}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Нийт XP:</span>
                <span className="font-bold text-emerald-400">{profile.totalXp.toLocaleString()} XP</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Нээгдсэн Түвшин:</span>
                <span className="font-bold text-white">{profile.unlockedLevels.length} / 12</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Давсан Түвшин:</span>
                <span className="font-bold text-white">{profile.completedLevels.length} / 12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Нээсэн Цол:</span>
                <span className="font-bold text-amber-300">
                  {profile.unlockedAchievements.length} / {ALL_ACHIEVEMENTS.length}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-emerald-400 block mb-1">💡 Хөгжүүлэгчийн Санамж:</span>
              Сурагч дасгалуудыг давтан хийх үед давхар XP бодогдохгүй байхаар засагдсан. Эндээс хүссэн хэмжээгээр шууд тохируулж болно.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Levels & Curriculum Control */}
      {activeTab === 'levels' && (
        <div className="mt-6 space-y-6">
          {/* Quick Level Actions */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#131916] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Түвшний Удирдлага (Levels 1 — 12)</h3>
                <p className="text-xs text-slate-400">
                  Түвшин бүрийг нээх, давснаар тэмдэглэх эсвэл шууд дасгал руу үсрэн шалгах боломжтой
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleUnlockAllLevels}
                  className="rounded-xl border border-emerald-500/30 bg-[#0B0F0D] px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-950/30"
                >
                  🔓 Бүх Түвшнийг Нээх
                </button>
                <button
                  onClick={handleCompleteAllLevels}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20"
                >
                  ✓ Бүгдийг Давснаар Тэмдэглэх
                </button>
                <button
                  onClick={handleResetLevels}
                  className="rounded-xl border border-slate-700 bg-[#0B0F0D] px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  ↺ Түвшнийг Цэвэрлэх (Reset)
                </button>
              </div>
            </div>

            {/* Level Matrix Grid */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {LEVELS.map((lvl) => {
                const isUnlocked = profile.unlockedLevels.includes(lvl.id);
                const isCompleted = profile.completedLevels.includes(lvl.id);

                return (
                  <div
                    key={lvl.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      isCompleted
                        ? 'border-emerald-500/40 bg-emerald-950/20'
                        : isUnlocked
                        ? 'border-slate-700/80 bg-[#0B0F0D]'
                        : 'border-slate-800/40 bg-[#0B0F0D]/60 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs mb-2">
                      <span className="font-bold text-white">
                        LEVEL {String(lvl.id).padStart(2, '0')}
                      </span>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                          lvl.difficulty === 'BOSS'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {lvl.difficulty}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-200 truncate">
                      {lvl.titleMn || lvl.title}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>+{lvl.xpReward} XP</span>
                      <span>{lvl.questions.length} дасгал</span>
                    </div>

                    {/* Toggle Checkboxes */}
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isUnlocked}
                          onChange={() => handleToggleLevelUnlocked(lvl.id)}
                          className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className={isUnlocked ? 'text-emerald-400' : 'text-slate-400'}>
                          Нээлттэй
                        </span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => handleToggleLevelCompleted(lvl.id)}
                          className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                          Давсан
                        </span>
                      </label>
                    </div>

                    {/* Quick Teleport Playtest */}
                    <button
                      onClick={() => onPlayLevel(lvl)}
                      className="mt-2.5 flex w-full items-center justify-center gap-1 rounded-xl bg-slate-800/80 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-emerald-500 hover:text-[#0B0F0D] transition-colors"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Энэ түвшинг тоглох</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements Controller */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#131916] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Ололт Амжилтын Удирдлага (Achievements)</h3>
                <p className="text-xs text-slate-400">Сурагчийн авсан бүх цол хэргэм, медалиудыг тохируулах</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleUnlockAllAchievements}
                  className="rounded-xl border border-emerald-500/30 bg-[#0B0F0D] px-3.5 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-950/30"
                >
                  Бүгдийг Нээх
                </button>
                <button
                  onClick={handleResetAchievements}
                  className="rounded-xl border border-slate-700 bg-[#0B0F0D] px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Цэвэрлэх
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ALL_ACHIEVEMENTS.map((ach) => {
                const isUnlocked = profile.unlockedAchievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    onClick={() => handleToggleAchievement(ach.id)}
                    className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition-all ${
                      isUnlocked
                        ? 'border-emerald-500/40 bg-emerald-950/20 text-white'
                        : 'border-slate-800 bg-[#0B0F0D] text-slate-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-xl font-mono text-xs ${
                          isUnlocked
                            ? 'bg-emerald-500 text-[#0B0F0D] font-bold'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isUnlocked ? '✓' : '•'}
                      </div>
                      <div>
                        <div className="text-xs font-semibold">{ach.title}</div>
                        <div className="text-[10px] font-mono text-emerald-400">+{ach.xp} XP</div>
                      </div>
                    </div>

                    <span className="font-mono text-xs text-slate-400">
                      {isUnlocked ? 'Нээлттэй' : 'Түгжээтэй'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Leaderboard Management */}
      {activeTab === 'leaderboard' && (
        <div className="mt-6 space-y-6">
          {/* Add Student Form */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#131916] p-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Plus className="h-4 w-4 text-emerald-400" />
              <span>Шинэ Сурагч Нэмэх (Add Student to Leaderboard)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Жагсаалтад өөр ангийн сурагч эсвэл шинэ хэрэглэгчийн үзүүлэлтийг оруулах
            </p>

            <form onSubmit={handleAddStudentToLeaderboard} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Сурагчийн Нэр</label>
                <input
                  type="text"
                  placeholder="Жишээ: Bat-Erdene T."
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-2.5 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Анги / Бүлэг</label>
                <select
                  value={newStudentGrade}
                  onChange={(e) => setNewStudentGrade(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-2.5 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  {ALL_CLASS_LABELS.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">XP Хэмжээ</label>
                <input
                  type="number"
                  placeholder="1500"
                  value={newStudentXp}
                  onChange={(e) => setNewStudentXp(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-2.5 font-mono text-xs text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Давсан Түвшин</label>
                <input
                  type="number"
                  placeholder="7"
                  value={newStudentLevels}
                  onChange={(e) => setNewStudentLevels(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] p-2.5 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-[#0B0F0D] hover:bg-emerald-400 transition-colors"
                >
                  + Сурагчийг Нэмэх
                </button>
              </div>
            </form>
          </div>

          {/* Leaderboard Table with Controls */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#131916] p-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-400" />
                  <span>Шилдэг Сурагчдын Жагсаалтыг Удирдах</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Хүссэн сурагчийн XP-г шууд өсгөх/бууруулах, устгах, шинэчлэх
                </p>
              </div>

              <button
                onClick={handleResetLeaderboardToDefault}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-[#0B0F0D] px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                <span>Анхны Төлөвт Буцаах (Default)</span>
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Нэр</th>
                    <th className="py-2.5 px-3">Анги</th>
                    <th className="py-2.5 px-3">XP</th>
                    <th className="py-2.5 px-3">Түвшин</th>
                    <th className="py-2.5 px-3">XP Тохируулах</th>
                    <th className="py-2.5 px-3 text-right">Устгах</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {leaderboardList.map((st, idx) => (
                    <tr key={st.id} className="hover:bg-[#0B0F0D]/60 transition-colors">
                      <td className="py-3 px-3 text-slate-400 font-bold">{idx + 1}</td>
                      <td className="py-3 px-3 font-semibold text-white">{st.name}</td>
                      <td className="py-3 px-3 text-slate-400">{st.grade}</td>
                      <td className="py-3 px-3 font-bold text-emerald-400">
                        {st.xp.toLocaleString()} XP
                      </td>
                      <td className="py-3 px-3 text-slate-300">{st.completedCount} / 12</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateStudentXp(st.id, 100)}
                            className="rounded-lg bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-emerald-400 hover:bg-emerald-950/40"
                          >
                            +100
                          </button>
                          <button
                            onClick={() => handleUpdateStudentXp(st.id, 500)}
                            className="rounded-lg bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-emerald-400 hover:bg-emerald-950/40"
                          >
                            +500
                          </button>
                          <button
                            onClick={() => handleUpdateStudentXp(st.id, -100)}
                            className="rounded-lg bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-rose-400 hover:bg-rose-950/40"
                          >
                            -100
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteLeaderboardStudent(st.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-950/30 hover:text-rose-400 transition-colors"
                          title="Устгах"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: System Data Backup & Purge */}
      {activeTab === 'system' && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-800/80 bg-[#131916] p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="h-4 w-4 text-emerald-400" />
              <span>Дата Экспорт & Импорт (Backup)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Бүх сурагчдын явц, тохиргоо болон шилдэг сурагчдын жагсаалтыг JSON файлд нөөцөлж татах эсвэл өөр төхөөрөмжөөс оруулж ирэх боломжтой.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleExportJson}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-[#0B0F0D] hover:bg-emerald-400 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Бүх Датаг JSON болгон Татах (Export)</span>
              </button>

              <label className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#0B0F0D] py-3 text-xs font-semibold text-slate-300 hover:border-emerald-500/50 hover:text-white cursor-pointer transition-colors">
                <Upload className="h-4 w-4" />
                <span>JSON Файлаас Сэргээх (Import)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-rose-900/30 bg-[#171315] p-6 space-y-4">
            <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-rose-400" />
              <span>Бүх Мэдээллийг Тэглэх (Factory Reset)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Анхаар: Энэ үйлдэл нь хөтчийн localStorage дээрх сурагчийн профайл, XP, тохиргоо, түвшний түүхийг бүрэн устгаж анхны төлөвт нь оруулна.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (confirm('Та тоглоомын бүх мэдээллийг анхны төлөвт нь оруулахдаа итгэлтэй байна уу?')) {
                    soundFx.error(settings.soundEnabled);
                    storage.resetAll();
                    setProfile(storage.loadProfile());
                    setLeaderboardList(storage.loadLeaderboardRaw());
                    showNotice('Бүх дата анхны төлөвт шилжлээ!');
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/20 py-3 text-xs font-bold text-rose-300 hover:bg-rose-500/30 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Бүх Санах Ойг Цэвэрлэх (Purge All Storage)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
