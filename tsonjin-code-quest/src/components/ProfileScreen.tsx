import React, { useState } from 'react';
import {
  User,
  Flame,
  Award,
  BookOpen,
  Star,
  Edit2,
  Check,
  ArrowLeft,
  Trophy,
  Mail,
  GraduationCap,
  Cpu,
  Layers,
  Code2,
  FolderGit2,
  Zap,
  AtSign,
  Phone,
  Shield,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { StudentProfile, GameSettings } from '../types';
import { translations } from '../utils/i18n';
import { soundFx } from '../utils/sound';
import { SpatialCard3D } from './SpatialCard3D';
import { CPP_LEVELS } from '../data/cppCurriculum';
import { LEVELS } from '../data/curriculum';
import { storage } from '../utils/storage';
import { maskMongolianPhone, formatMongolianPhone } from '../utils/security';
import { formatGradeClass, promoteStudentGrade } from '../utils/gradeSystem';

interface ProfileScreenProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  settings: GameSettings;
  onBack: () => void;
  onViewAchievements: () => void;
  onOpenCourses?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  setProfile,
  settings,
  onBack,
  onViewAchievements,
  onOpenCourses,
}) => {
  const isMn = settings.language === 'mn';
  const t = translations[settings.language];

  // Edit display name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  // Edit username state (rate-limited, uniqueness verified)
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(profile.username || 'orgil');
  const [usernameFeedback, setUsernameFeedback] = useState<{ success?: string; error?: string } | null>(null);

  // Grade promotion state modal/confirmation
  const [showPromoteConfirm, setShowPromoteConfirm] = useState(false);
  const [promotionFeedback, setPromotionFeedback] = useState<string | null>(null);

  // Level calculations
  const pythonLevel = Math.max(1, profile.completedLevels.length || 1);
  const cppCompletedCount = (profile.cppCompletedLevels || []).length;
  const cppLevel = Math.max(1, cppCompletedCount || 1);
  const cppXp = profile.cppXp || 0;
  const totalCombinedXp = profile.totalXp + cppXp;
  const overallDeveloperLevel = Math.max(1, Math.floor(totalCombinedXp / 250) + 1);

  const cppExercisesCount = (profile.cppCompletedExercises || []).length || Math.min(cppCompletedCount * 2, 25);
  const cppProjectsCount = (profile.cppCompletedProjects || []).length || (cppCompletedCount >= 10 ? 3 : cppCompletedCount >= 5 ? 1 : 0);

  const currentGradeNum = profile.gradeNumber || 10;
  const currentSection = profile.classSection || 2;
  const formattedGradeStr = formatGradeClass(currentGradeNum, currentSection);

  const handleSaveName = () => {
    soundFx.click(settings.soundEnabled);
    const trimmed = nameInput.trim();
    if (trimmed) {
      const updated = { ...profile, name: trimmed };
      setProfile(updated);
      storage.saveProfile(updated);
    }
    setIsEditingName(false);
  };

  const handleSaveUsername = () => {
    soundFx.click(settings.soundEnabled);
    setUsernameFeedback(null);
    const res = storage.changeUsername(profile, usernameInput);
    if (res.success && res.profile) {
      setProfile(res.profile);
      setUsernameFeedback({ success: isMn ? 'Хэрэглэгчийн нэр амжилттай солигдлоо!' : 'Username updated successfully!' });
      setIsEditingUsername(false);
      setTimeout(() => setUsernameFeedback(null), 3500);
    } else {
      setUsernameFeedback({ error: res.error || 'Failed to update username' });
    }
  };

  const handlePromoteGrade = () => {
    soundFx.complete(settings.soundEnabled);
    const nextRes = promoteStudentGrade(currentGradeNum, currentSection);
    const updated = storage.promoteStudent(profile, currentSection);
    setProfile(updated);
    setShowPromoteConfirm(false);
    setPromotionFeedback(
      isMn
        ? `Баяр хүргэе! Та ${nextRes.label} анги руу дэвшин орлоо. Бүх XP, хичээл, төсөл, streak хэвээр хадгалагдсан!`
        : `Congratulations! Promoted to Grade ${nextRes.label}. All XP, lessons, projects, and streak are completely preserved!`
    );
    setTimeout(() => setPromotionFeedback(null), 5000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{isMn ? 'БУЦАХ' : 'BACK'}</span>
      </button>

      {/* Promotion or Username Alert */}
      {promotionFeedback && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-mono font-bold text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{promotionFeedback}</span>
        </div>
      )}

      {usernameFeedback?.error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs font-mono text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{usernameFeedback.error}</span>
        </div>
      )}

      {usernameFeedback?.success && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-mono text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{usernameFeedback.success}</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-[#131916] p-6 shadow-2xl sm:p-8 backdrop-blur-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-emerald-500/40 bg-[#0B0F0D] text-3xl shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              {profile.avatar || '⚡'}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">
                  TSONJIN CYBER CADET
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-slate-300 flex items-center gap-1 font-bold">
                  <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
                  GRADE {formattedGradeStr}
                </span>
                <span className="text-slate-600">·</span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                  ROLE: {profile.role || 'STUDENT'}
                </span>
              </div>

              {/* Display Name */}
              {isEditingName ? (
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="rounded-xl border border-emerald-500 bg-[#0B0F0D] px-3 py-1 text-lg font-bold text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    className="rounded-xl bg-emerald-500 p-1.5 text-[#0B0F0D] hover:bg-emerald-400 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-3">
                  <h2 className="text-2xl font-black text-white sm:text-3xl">
                    {profile.name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setNameInput(profile.name);
                      setIsEditingName(true);
                    }}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Edit Display Name"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Unique Username (@username) vs Display Name */}
              <div className="mt-1 flex items-center gap-2 font-mono text-xs text-slate-400">
                {isEditingUsername ? (
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">@</span>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="new_username"
                      className="rounded-lg border border-emerald-500 bg-[#070b09] px-2 py-0.5 text-xs text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveUsername}
                      className="rounded-lg bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-black hover:bg-emerald-400"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingUsername(false)}
                      className="text-slate-500 text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">@{profile.username || 'orgil'}</span>
                    <span className="text-slate-600">(Unique Username)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setUsernameInput(profile.username || 'orgil');
                        setIsEditingUsername(true);
                      }}
                      className="text-slate-500 hover:text-white transition-colors text-[10px] underline ml-1"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              {/* Contact info: Official Google Gmail & Masked Mongolian Phone */}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{profile.email || 'orgilbna22@gmail.com'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{profile.phone ? maskMongolianPhone(profile.phone) : '+976 •••• 2233'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Master Developer Level Badge & Grade Promotion Button */}
          <div className="space-y-2 text-center sm:text-right min-w-[200px]">
            <div className="rounded-2xl border border-emerald-500/30 bg-[#0B0F0D] p-4 text-center sm:text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                {isMn ? 'Нийт Програмист Зэрэг' : 'Overall Mastery'}
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                Developer Level {overallDeveloperLevel}
              </div>
              <div className="text-[11px] font-mono text-emerald-400/80 mt-0.5">
                {totalCombinedXp.toLocaleString()} Total XP
              </div>
            </div>

            {/* Yearly Grade Promotion Action */}
            {currentGradeNum < 12 ? (
              <button
                type="button"
                onClick={() => setShowPromoteConfirm(true)}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2 px-3 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-sm"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>Дэвшин суралцах ({currentGradeNum} → {currentGradeNum + 1})</span>
              </button>
            ) : (
              <div className="text-center font-mono text-[11px] text-amber-400 py-1">
                🎓 12-р анги (Төгсөх анги)
              </div>
            )}
          </div>
        </div>

        {/* Promotion Confirmation Drawer */}
        {showPromoteConfirm && (
          <div className="my-4 rounded-2xl border border-amber-500/40 bg-[#16120b] p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>ЖИЛ БҮРИЙН АНГИ ДЭВШИХ ҮЙЛДЭЛ (Grade Promotion)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Та {currentGradeNum}-р ангиас <strong>{currentGradeNum + 1}-р анги</strong> руу дэвших гэж байна.
              Таны бүх XP ({totalCombinedXp} XP), үзсэн хичээлүүд, төслүүд, сургалтын түүх, streak өдрүүд бүрэн хадгалагдана. Данс устахгүй.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handlePromoteGrade}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400"
              >
                Тийм, Анги дэвших ({currentGradeNum + 1}-р анги)
              </button>
              <button
                type="button"
                onClick={() => setShowPromoteConfirm(false)}
                className="rounded-xl border border-slate-700 bg-[#0B0F0D] px-4 py-2 text-xs text-slate-300 hover:text-white"
              >
                Болих
              </button>
            </div>
          </div>
        )}

        {/* TRACK-BY-TRACK LEVEL COMPARISON & BREAKDOWN */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Python Track Stats */}
          <SpatialCard3D intensity={6}>
            <div className="rounded-2xl border border-emerald-500/20 bg-[#0e1612] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🐍</span>
                  <span className="font-bold text-sm text-white font-mono">Python Track</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                  Level {pythonLevel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="rounded-xl bg-[#070b09] p-2.5 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">XP</div>
                  <div className="text-base font-bold text-emerald-400">{profile.totalXp.toLocaleString()}</div>
                </div>
                <div className="rounded-xl bg-[#070b09] p-2.5 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Quests</div>
                  <div className="text-base font-bold text-white">{profile.completedLevels.length} / 12</div>
                </div>
                <div className="rounded-xl bg-[#070b09] p-2.5 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Streak</div>
                  <div className="text-base font-bold text-amber-400">{profile.streakDays}d</div>
                </div>
              </div>
            </div>
          </SpatialCard3D>

          {/* C++ Track Stats */}
          <SpatialCard3D intensity={6}>
            <div className="rounded-2xl border border-cyan-500/20 bg-[#091414] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <span className="font-bold text-sm text-white font-mono">C++ Track</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                  Level {cppLevel}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="rounded-xl bg-[#070b09] p-2 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">C++ XP</div>
                  <div className="text-sm font-bold text-cyan-400">{cppXp.toLocaleString()}</div>
                </div>
                <div className="rounded-xl bg-[#070b09] p-2 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Lessons</div>
                  <div className="text-sm font-bold text-white">{cppCompletedCount} / {CPP_LEVELS.length}</div>
                </div>
                <div className="rounded-xl bg-[#070b09] p-2 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Exercises</div>
                  <div className="text-sm font-bold text-white">{cppExercisesCount}</div>
                </div>
                <div className="rounded-xl bg-[#070b09] p-2 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Projects</div>
                  <div className="text-sm font-bold text-white">{cppProjectsCount}</div>
                </div>
              </div>
            </div>
          </SpatialCard3D>
        </div>

        {/* Quick Links: Achievements & Course Catalog */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-[#1A221E]/60 p-5">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-sm font-bold text-white">
                  {isMn ? 'Амжилтууд & Батламжууд' : 'Unlocked Honors & Badges'}
                </div>
                <div className="text-xs text-slate-400">
                  {profile.unlockedAchievements.length} Badges earned
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onViewAchievements}
              className="rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-[#0B0F0D] hover:bg-emerald-400 transition-colors shrink-0"
            >
              ҮЗЭХ →
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-[#1A221E]/60 p-5">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-sm font-bold text-white">
                  {isMn ? 'Хичээлийн Бүрэн Каталог' : 'Expandable Course Catalog'}
                </div>
                <div className="text-xs text-slate-400">
                  Grade {currentGradeNum}+ Recommended
                </div>
              </div>
            </div>
            {onOpenCourses && (
              <button
                type="button"
                onClick={onOpenCourses}
                className="rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-[#0B0F0D] hover:bg-emerald-400 transition-colors shrink-0"
              >
                КАТАЛОГ →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
