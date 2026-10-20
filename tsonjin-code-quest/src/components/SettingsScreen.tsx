import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  Clock,
  Globe,
  Trash2,
  CheckCircle2,
  Shield,
  Smartphone,
  Laptop,
  LogOut,
  History,
  Lock,
  Key,
} from 'lucide-react';
import { GameSettings, StudentProfile } from '../types';
import { translations } from '../utils/i18n';
import { soundFx } from '../utils/sound';
import { storage, INITIAL_PROFILE } from '../utils/storage';
import { UserSession, SecurityAuditLogEntry } from '../utils/security';

interface SettingsScreenProps {
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onBack: () => void;
  onOpenAdmin?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  setSettings,
  profile,
  setProfile,
  onBack,
  onOpenAdmin,
}) => {
  const t = translations[settings.language];
  const isMn = settings.language === 'mn';

  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Security tabs & sessions
  const [sessions, setSessions] = useState<UserSession[]>(() => storage.loadSessions());
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLogEntry[]>(() => storage.loadAuditLogs());
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);

  const toggleSound = () => {
    setSettings((prev) => {
      const next = !prev.soundEnabled;
      soundFx.click(next);
      const updated = { ...prev, soundEnabled: next };
      storage.saveSettings(updated);
      return updated;
    });
  };

  const toggleAnimations = () => {
    soundFx.click(settings.soundEnabled);
    setSettings((prev) => {
      const updated = { ...prev, animationsEnabled: !prev.animationsEnabled };
      storage.saveSettings(updated);
      return updated;
    });
  };

  const toggleTimer = () => {
    soundFx.click(settings.soundEnabled);
    setSettings((prev) => {
      const updated = { ...prev, timerEnabled: !prev.timerEnabled };
      storage.saveSettings(updated);
      return updated;
    });
  };

  const handleLanguageChange = (lang: 'en' | 'mn') => {
    soundFx.click(settings.soundEnabled);
    setSettings((prev) => {
      const updated = { ...prev, language: lang };
      storage.saveSettings(updated);
      return updated;
    });
  };

  const handleResetProgress = () => {
    soundFx.click(settings.soundEnabled);
    storage.resetAll();
    setProfile(INITIAL_PROFILE);
    setResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const handleRevokeSession = (id: string) => {
    soundFx.click(settings.soundEnabled);
    const updated = storage.revokeSession(id);
    setSessions(updated);
    setSecuritySuccess(isMn ? 'Төхөөрөмж амжилттай салгагдлаа' : 'Device disconnected');
    setTimeout(() => setSecuritySuccess(null), 3000);
  };

  const handleLogoutAllOther = () => {
    soundFx.click(settings.soundEnabled);
    const updated = storage.revokeAllOtherSessions();
    setSessions(updated);
    setSecuritySuccess(isMn ? 'Бусад бүх төхөөрөмжөөс гарлаа!' : 'Logged out of all other devices!');
    setTimeout(() => setSecuritySuccess(null), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{isMn ? 'БУЦАХ' : 'BACK'}</span>
      </button>

      <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-[#131916] p-6 shadow-2xl sm:p-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          SYSTEM <span className="text-emerald-400">{t.settings}</span>
        </h2>
        <p className="mt-1 text-sm text-slate-400 font-mono">
          Configure gameplay preferences, audio, and secure session management
        </p>

        {resetSuccess && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-400 font-mono">
            <CheckCircle2 className="h-4 w-4" />
            <span>All student progress and quest history have been reset successfully!</span>
          </div>
        )}

        {securitySuccess && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-400 font-mono">
            <CheckCircle2 className="h-4 w-4" />
            <span>{securitySuccess}</span>
          </div>
        )}

        <div className="mt-8 space-y-6 divide-y divide-slate-800/80">
          {/* Sound Setting */}
          <div className="flex items-center justify-between pt-6 first:pt-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800/80 bg-[#0B0F0D] text-emerald-400">
                {settings.soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-slate-500" />}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{t.sound}</div>
                <div className="text-xs text-slate-400">Tactile retro SFX on answers and navigation</div>
              </div>
            </div>

            <button
              onClick={toggleSound}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Animations Setting */}
          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800/80 bg-[#0B0F0D] text-emerald-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{t.animations}</div>
                <div className="text-xs text-slate-400">WebGL 3D background animation and spatial effects</div>
              </div>
            </div>

            <button
              onClick={toggleAnimations}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                settings.animationsEnabled ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.animationsEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Challenge Timer */}
          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800/80 bg-[#0B0F0D] text-emerald-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{t.timer}</div>
                <div className="text-xs text-slate-400">Gentle countdown timer with bonus score rewards</div>
              </div>
            </div>

            <button
              onClick={toggleTimer}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                settings.timerEnabled ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.timerEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800/80 bg-[#0B0F0D] text-emerald-400">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{t.language}</div>
                <div className="text-xs text-slate-400">Select interface language for Tsonjin students</div>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-2xl border border-slate-800/80 bg-[#0B0F0D] p-1 font-mono text-xs">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`rounded-xl px-3 py-1.5 font-bold transition-colors ${
                  settings.language === 'en'
                    ? 'bg-emerald-500 text-[#0B0F0D]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('mn')}
                className={`rounded-xl px-3 py-1.5 font-bold transition-colors ${
                  settings.language === 'mn'
                    ? 'bg-emerald-500 text-[#0B0F0D]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Монгол
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* STRONGER ACCOUNT SECURITY & SESSIONS MANAGEMENT */}
          {/* ============================================================ */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-[#0B0F0D] text-emerald-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>SECURITY & SESSIONS</span>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                      SECURE
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Signed-in devices, recent login activity, and session revocation
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogoutAllOther}
                className="rounded-xl border border-rose-500/40 bg-rose-950/20 px-3 py-1.5 text-xs font-mono font-bold text-rose-400 hover:bg-rose-950/40 transition-colors"
              >
                Logout All Other Devices
              </button>
            </div>

            {/* Signed-in devices */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0a0f0c] p-4 space-y-3">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                Signed-In Devices ({sessions.length})
              </span>
              <div className="divide-y divide-slate-800/60">
                {sessions.map((sess) => (
                  <div key={sess.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#131916] text-slate-400">
                        {sess.device.includes('iPhone') ? <Smartphone className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{sess.device}</span>
                          {sess.isCurrent && (
                            <span className="rounded bg-emerald-400/20 px-1.5 py-0.2 text-[9px] font-mono text-emerald-400 font-bold">
                              THIS DEVICE
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {sess.browser} · {sess.os} · IP {sess.ipMasked} · Active: {sess.lastActive}
                        </div>
                      </div>
                    </div>

                    {!sess.isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleRevokeSession(sess.id)}
                        className="rounded-lg bg-slate-800 px-2 py-1 text-[11px] font-mono text-slate-300 hover:bg-rose-950 hover:text-rose-300 transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent login activity / Audit Log */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0a0f0c] p-4 space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-emerald-400" />
                <span>Recent Security Audit Log</span>
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between rounded-lg bg-[#070b09] p-2 border border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-emerald-400 uppercase font-bold">[{log.action}]</span>
                      <span className="text-slate-300">{log.details}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Developer Admin Console */}
          {onOpenAdmin && (
            <div className="pt-6">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/40 bg-[#0B0F0D] text-emerald-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Хөгжүүлэгчийн Самбар (Admin Panel)</div>
                    <div className="text-xs text-slate-400">XP, түвшин, хүмүүсийн оноо, дата удирдах систем</div>
                  </div>
                </div>
                <button
                  onClick={onOpenAdmin}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-[#0B0F0D] hover:bg-emerald-400 transition-colors shrink-0"
                >
                  Нэвтрэх (Open Admin)
                </button>
              </div>
            </div>
          )}

          {/* Reset Progress */}
          <div className="pt-6">
            {!resetConfirm ? (
              <button
                onClick={() => setResetConfirm(true)}
                className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>{t.resetProgress}</span>
              </button>
            ) : (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-4">
                <div className="text-xs font-bold text-rose-400">
                  Are you sure? This will wipe all completed quests and reset XP to 0.
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleResetProgress}
                    className="rounded-xl bg-rose-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-600"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setResetConfirm(false)}
                    className="rounded-xl border border-slate-700 bg-[#0B0F0D] px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
