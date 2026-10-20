import React, { useState } from 'react';
import { Shield, KeyRound, User, Lock, AlertCircle, Eye, EyeOff, X } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  soundEnabled: boolean;
}

export const ADMIN_CREDENTIALS = {
  username: 'Orgil',
  password: 'Passw0rd.0813',
};

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  soundEnabled,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.click(soundEnabled);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (trimmedUser === ADMIN_CREDENTIALS.username && trimmedPass === ADMIN_CREDENTIALS.password) {
      soundFx.correct(soundEnabled);
      setError(null);
      onSuccess();
    } else {
      soundFx.error(soundEnabled);
      setError('Хэрэглэгчийн нэр эсвэл нууц үг буруу байна! (Invalid developer credentials)');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F0D]/90 p-4 backdrop-blur-md">
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#131916] p-6 shadow-2xl sm:p-8 ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-28 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="relative z-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 shadow-inner">
            <Shield className="h-7 w-7" />
          </div>
          <div className="mt-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            TSONJIN CYBER BOARDING SCHOOL
          </div>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            Хөгжүүлэгчийн Нэвтрэх
          </h2>
          <p className="mt-1 text-xs text-slate-300">
            Developer Admin Portal (Зөвхөн эрх бүхий хөгжүүлэгчид)
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="relative z-10 mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 mt-6 space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
              Хөгжүүлэгчийн Нэр (Username)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
                placeholder="Developer name..."
                required
                autoFocus
                className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] py-3 pl-10 pr-4 font-mono text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
              Нууц Үг (Password)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Developer password..."
                required
                className="w-full rounded-xl border border-slate-800 bg-[#0B0F0D] py-3 pl-10 pr-11 font-mono text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-[#0B0F0D] transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-[0.98]"
            >
              <KeyRound className="h-4 w-4" />
              <span>Нэвтрэх (Authenticate)</span>
            </button>
          </div>
        </form>

        <div className="mt-5 text-center">
          <p className="text-[11px] font-mono text-slate-300">
            Authorized admin credentials required.
          </p>
        </div>
      </div>
    </div>
  );
};
