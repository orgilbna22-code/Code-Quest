import React, { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  Terminal,
  BookOpen,
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
  Code,
  Cpu,
  Globe,
  Users,
} from 'lucide-react';
import { GameSettings, StudentProfile } from '../types';
import { translations } from '../utils/i18n';
import { soundFx } from '../utils/sound';

interface OrientationModalProps {
  settings: GameSettings;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onBack: () => void;
}

export const OrientationModal: React.FC<OrientationModalProps> = ({
  settings,
  profile,
  setProfile,
  onBack,
}) => {
  const t = translations[settings.language];
  const [activeTab, setActiveTab] = useState<'school' | 'history' | 'principles'>('school');
  const [hasClaimed, setHasClaimed] = useState<boolean>(() =>
    profile.unlockedAchievements.includes('orientation_completed')
  );

  const isMn = settings.language === 'mn';

  const handleClaimBonus = () => {
    if (hasClaimed) return;
    soundFx.complete(settings.soundEnabled);
    setHasClaimed(true);
    setProfile((prev) => ({
      ...prev,
      totalXp: prev.totalXp + 50,
      unlockedAchievements: Array.from(new Set([...prev.unlockedAchievements, 'orientation_completed'])),
    }));
  };

  const handleTabSwitch = (tab: 'school' | 'history' | 'principles') => {
    soundFx.click(settings.soundEnabled);
    setActiveTab(tab);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{t.back}</span>
      </button>

      {/* Main Dossier Header */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#131916] p-6 shadow-2xl sm:p-10">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Shield className="h-4 w-4" />
              <span>{isMn ? 'АКАДЕМИЙН ТАНИЛЦУУЛГА & УДИРТГАЛ' : 'CYBER DOSSIER & ORIENTATION'}</span>
            </div>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-4xl">
              {isMn ? 'ЦОНЖИН КИБЕР СУРГУУЛЬ & PYTHON ТҮҮХ' : 'TSONJIN ACADEMY & PYTHON ODYSSEY'}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              {t.orientationSubtitle}
            </p>
          </div>

          {/* Claim Bonus XP Button */}
          <div className="shrink-0">
            {!hasClaimed ? (
              <button
                onClick={handleClaimBonus}
                className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-xs font-bold text-[#0B0F0D] hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all"
              >
                <Zap className="h-4 w-4 fill-current" />
                <span>{t.claimReward}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-400 font-mono">
                <CheckCircle2 className="h-4 w-4" />
                <span>{t.claimedReward}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-800/80 pb-4">
          <button
            onClick={() => handleTabSwitch('school')}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold font-mono transition-all ${
              activeTab === 'school'
                ? 'bg-emerald-500 text-[#0B0F0D]'
                : 'bg-[#0B0F0D] text-slate-400 hover:text-white hover:border-emerald-500/40 border border-slate-800/80'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>{t.tabSchool}</span>
          </button>

          <button
            onClick={() => handleTabSwitch('history')}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold font-mono transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-[#0B0F0D]'
                : 'bg-[#0B0F0D] text-slate-400 hover:text-white hover:border-emerald-500/40 border border-slate-800/80'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>{t.tabHistory}</span>
          </button>

          <button
            onClick={() => handleTabSwitch('principles')}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold font-mono transition-all ${
              activeTab === 'principles'
                ? 'bg-emerald-500 text-[#0B0F0D]'
                : 'bg-[#0B0F0D] text-slate-400 hover:text-white hover:border-emerald-500/40 border border-slate-800/80'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>{t.tabPrinciples}</span>
          </button>
        </div>

        {/* Tab 1: Tsonjin Cyber Boarding School */}
        {activeTab === 'school' && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-3xl border border-slate-800/80 bg-[#0B0F0D] p-5">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold font-mono">
                  <Cpu className="h-4 w-4" />
                  <span>{isMn ? 'АЛСЫН ХАРАА' : 'VISION'}</span>
                </div>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {isMn
                    ? 'Монгол улсын ирээдүйн программ хангамжийн архитекторууд, хиймэл оюун ухааны инженерууд болон кибер аюулгүй байдлын шилдэг мэргэжилтнүүдийг бэлтгэх тэргүүлэх сургууль.'
                    : 'Cultivating the next generation of Mongolian software architects, AI engineers, and cybersecurity defenders through an intensive, world-class curriculum.'}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800/80 bg-[#0B0F0D] p-5">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold font-mono">
                  <Users className="h-4 w-4" />
                  <span>{isMn ? 'ДОТУУР БАЙРНЫ ОРЧИН' : 'BOARDING ETHOS'}</span>
                </div>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {isMn
                    ? '24/7 өндөр технологийн бүтээлч орчин, бие биенээ дэмжин суралцах хамт олон, сахилга бат, эрүүл амьдралын хэв маяг, төсөлд суурилсан сургалтын систем.'
                    : 'An immersive 24/7 residential campus fostering disciplined coding habits, peer problem-solving, healthy living, and real-world software creation.'}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800/80 bg-[#0B0F0D] p-5">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold font-mono">
                  <Globe className="h-4 w-4" />
                  <span>{isMn ? 'ДИЖИТАЛ ТУСГААР ТОГТНОЛ' : 'DIGITAL SOVEREIGNTY'}</span>
                </div>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {isMn
                    ? 'Мэдлэг чадвараараа дэлхийд өрсөлдөж, эх орныхоо мэдээллийн аюулгүй байдал, технологийн хөгжлийг авч явах шинэ үеийн кибер дайчид.'
                    : 'Empowering young cadets with advanced computational logic to build secure technological foundations for Mongolia and compete on the global stage.'}
                </p>
              </div>
            </div>

            {/* School Creed Box */}
            <div className="rounded-3xl border border-emerald-500/25 bg-[#1A221E]/70 p-6">
              <h3 className="font-mono text-sm font-bold text-emerald-400 uppercase tracking-wider">
                {isMn ? 'ЦОНЖИН СУРАГЧИЙН ТАНГАРАГ' : 'THE TSONJIN CADET CODE'}
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-slate-200 leading-relaxed list-disc list-inside">
                <li>{isMn ? 'Бид өдөр бүр код бичиж, бодлого бодож ур чадвараа ахиулна.' : 'We commit to writing clean, readable, and robust code every single day.'}</li>
                <li>{isMn ? 'Алдаанаас (Bug) айхгүй, харин түүнийг шийдвэрлэх боломж гэж харна.' : 'We embrace debugging as an opportunity to sharpen our analytical intellect.'}</li>
                <li>{isMn ? 'Хиймэл оюун ухаан, кибер хамгаалалтын технологийг хүн төрөлхтөнд ээлтэйгээр ашиглана.' : 'We harness AI and cyber engineering for constructive, ethical innovation.'}</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Python Origins & History */}
        {activeTab === 'history' && (
          <div className="mt-8 space-y-6">
            <div className="rounded-3xl border border-slate-800/80 bg-[#0B0F0D] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isMn ? 'Python Хэрхэн Үүссэн Бэ?' : 'How Python Was Born'}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">1989 – 1991 • Guido van Rossum • CWI, Netherlands</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                {isMn
                  ? 'Python хэлийг 1989 оны зул сарын баярын амралтаараа Нидерландын математикч, программист Гуидо ван Россум (Guido van Rossum) эхлүүлж, 1991 онд анх нийтэд танилцуулсан түүхтэй. Тэрээр C болон ABC хэлнүүдийн сул талыг засч, уншихад хамгийн ойлгомжтой, цэвэрхэн, бичихэд хялбар хэл бүтээхийг зорьсон юм.'
                  : 'Python was created during the winter holidays of 1989 by Dutch computer scientist Guido van Rossum and released in 1991. Van Rossum sought to create an elegant language that prioritized human readability over cryptic machine syntax, bridging the gap between high-level shell scripting and low-level C programming.'}
              </p>

              <div className="mt-4 rounded-2xl border border-slate-800/80 bg-[#131916] p-4 text-xs text-slate-300">
                <strong className="text-emerald-400 font-mono">
                  {isMn ? 'Могой биш, харин Комеди!' : 'Not a Snake, but a Comedy Show!'}
                </strong>
                <p className="mt-1">
                  {isMn
                    ? 'Олон хүн Python-ийг аварга могойтой холбон боддог ч үнэндээ Гуидо ван Россум Английн BBC телевизийн алдарт "Monty Python\'s Flying Circus" хэмээх хошин шогийн нэвтрүүлгийн шүтэн бишрэгч байсан тул уг нэрээр нэрлэжээ.'
                    : 'Contrary to popular belief, Python is not named after the reptile. Van Rossum was an avid fan of the classic British BBC comedy series "Monty Python\'s Flying Circus".'}
                </p>
              </div>
            </div>

            {/* Why Python Dominates Today */}
            <div className="rounded-3xl border border-slate-800/80 bg-[#0B0F0D] p-6">
              <h3 className="text-sm font-bold text-emerald-400 font-mono uppercase tracking-wider">
                {isMn ? 'Яагаад Python Өнөөдөр Дэлхийн №1 Хэл Болов?' : 'Why Python Dominates Modern Computing'}
              </h3>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="rounded-2xl border border-slate-800/80 bg-[#131916] p-3">
                  <strong className="text-white">1. Artificial Intelligence</strong>
                  <p className="mt-1 text-slate-400">
                    {isMn ? 'PyTorch, TensorFlow, Gemini зэрэг хиймэл оюуны бүх сангууд Python дээр тулгуурладаг.' : 'De-facto engine of machine learning, LLMs, and neural networks.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800/80 bg-[#131916] p-3">
                  <strong className="text-white">2. Cybersecurity & Hacking</strong>
                  <p className="mt-1 text-slate-400">
                    {isMn ? 'Сүлжээний шинжилгээ, аюулгүй байдлын шалгалт болон автоматжуулалтын гол зэвсэг.' : 'Scripting penetration tests, packet crafting, and automated threat defense.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800/80 bg-[#131916] p-3">
                  <strong className="text-white">3. Human Readability</strong>
                  <p className="mt-1 text-slate-400">
                    {isMn ? 'Цэг таслал, хаалтад баригдахгүй, англи хэл шиг шууд ойлгогддог синтакс.' : 'Clean indentation and English-like structure minimizes cognitive friction.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: The Zen of Python */}
        {activeTab === 'principles' && (
          <div className="mt-8 space-y-6">
            <div className="rounded-3xl border border-slate-800/80 bg-[#0B0F0D] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  {isMn ? 'PYTHON-ИЙ ЗЭН НОМЛОЛ (THE ZEN OF PYTHON)' : 'THE ZEN OF PYTHON (PEP 20)'}
                </div>
                <span className="font-mono text-xs text-slate-500">Tim Peters</span>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-[#070A08] p-4 font-mono text-xs text-emerald-300 space-y-1 overflow-x-auto">
                <div>&gt;&gt;&gt; import this</div>
                <div className="text-slate-400 pt-2"># Core Axioms of Software Craftsmanship:</div>
                <div>Beautiful is better than ugly.</div>
                <div>Explicit is better than implicit.</div>
                <div>Simple is better than complex.</div>
                <div>Complex is better than complicated.</div>
                <div>Readability counts.</div>
                <div>Special cases aren't special enough to break the rules.</div>
                <div>Now is better than never.</div>
              </div>

              <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                {isMn
                  ? 'Python хэлний гол нууц нь кодоо аль болох товчхон бичихдээ бус, харин бусад хүн болон ирээдүйн өөрөө уншихад шууд ойлгогдохоор цэвэрхэн, уншигдахуйц байлгахад оршдог. Цонжин Кибер Сургуульд бид энэ зарчмыг ягштал баримталдаг.'
                  : 'The essence of Python is not writing the most compact code, but writing code that is undeniably transparent and readable to your team. At Tsonjin Cyber Boarding School, we teach software design as a rigorous discipline of clarity.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
