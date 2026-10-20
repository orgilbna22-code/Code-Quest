import React, { useState } from 'react';
import {
  BookOpen,
  ArrowLeft,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
  Code2,
  FolderGit2,
} from 'lucide-react';
import {
  COURSE_CATALOG,
  CatalogCourse,
  CourseCategory,
  GRADE_6_STARTER_PATH_IDS,
} from '../data/coursesCatalog';
import { StudentProfile, GameSettings } from '../types';
import { translations } from '../utils/i18n';
import { soundFx } from '../utils/sound';
import { SpatialCard3D } from './SpatialCard3D';

interface CoursesScreenProps {
  profile: StudentProfile;
  settings: GameSettings;
  onBack: () => void;
  onSelectTrack: (track: 'python' | 'cpp') => void;
  onGoToLevels: () => void;
}

const CATEGORIES: ('ALL' | CourseCategory)[] = [
  'ALL',
  'CORE PROGRAMMING',
  'WEB',
  'DEVELOPER TOOLS',
  'COMPUTER SCIENCE',
  'DATA',
  'DATABASE',
  'WEB DEVELOPMENT',
  'AI',
  'SYSTEMS',
  'SECURITY',
];

export const CoursesScreen: React.FC<CoursesScreenProps> = ({
  profile,
  settings,
  onBack,
  onSelectTrack,
  onGoToLevels,
}) => {
  const isMn = settings.language === 'mn';
  const t = translations[settings.language];

  const [activeCategory, setActiveCategory] = useState<'ALL' | CourseCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CatalogCourse | null>(null);

  const studentGradeNum = profile.gradeNumber || 10;

  // Filter courses
  const filteredCourses = COURSE_CATALOG.filter((c) => {
    const matchesCat = activeCategory === 'ALL' || c.category === activeCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.titleMn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const grade6StarterCourses = COURSE_CATALOG.filter((c) =>
    GRADE_6_STARTER_PATH_IDS.includes(c.id)
  );

  const handleLaunchCourse = (course: CatalogCourse) => {
    soundFx.click(settings.soundEnabled);
    if (course.trackCode === 'python') {
      onSelectTrack('python');
      onGoToLevels();
    } else if (course.trackCode === 'cpp') {
      onSelectTrack('cpp');
      onGoToLevels();
    } else {
      setSelectedCourse(course);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/15 pb-6">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-3 flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isMn ? 'БУЦАХ' : 'BACK'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase font-mono">
            <BookOpen className="h-3.5 w-3.5 shrink-0" />
            <span>TSONJIN CYBER ACADEMY · SCALABLE CURRICULUM</span>
          </div>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {isMn ? 'Хичээлийн Каталог' : 'Course Catalog'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
            {isMn
              ? `Сурагчийн одоогийн анги: Grade ${profile.grade || '10-2'}. Хичээлүүд нас зааж түгжигдэхгүй бөгөөд зөвлөмж түвшингээр ангилагдсан.`
              : `Your grade: Grade ${profile.grade || '10-2'}. Courses use recommended grade difficulty and are open for any cadet ready to learn.`}
          </p>
        </div>

        {/* Grade 6 Starter Path Badge */}
        <div className="rounded-2xl border border-emerald-500/25 bg-[#0e1612] p-4 font-mono text-xs max-w-xs shrink-0">
          <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
            <GraduationCap className="h-4 w-4" />
            <span>GRADE 6 RECOMMENDED STARTER</span>
          </div>
          <p className="text-[11px] text-slate-300">
            {isMn
              ? '6-р ангид Компьютерын үндэс, Python суурь, Аюулгүй байдал, Git эхлүүлнэ.'
              : 'Computer Basics, Python Foundations, Safety & Git recommended for starters.'}
          </p>
        </div>
      </div>

      {/* Grade 6 Recommended Carousel / Highlights */}
      <div className="rounded-3xl border border-emerald-500/20 bg-[#0d1310] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white font-mono uppercase">
              {isMn ? '6-р Ангийн Зөвлөмж Хөтөлбөр (Visual & Beginner-Friendly)' : 'Grade 6 Recommended Starter Path'}
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">5 Courses</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {grade6StarterCourses.map((c) => (
            <div
              key={c.id}
              onClick={() => handleLaunchCourse(c)}
              className="group cursor-pointer rounded-2xl border border-emerald-500/20 bg-[#070b09] p-3.5 hover:border-emerald-400 hover:bg-[#0f1712] transition-all"
            >
              <div className="text-2xl mb-1.5">{c.icon}</div>
              <div className="font-bold text-xs text-white line-clamp-1 group-hover:text-emerald-300">
                {isMn ? c.titleMn : c.title}
              </div>
              <div className="mt-1 text-[10px] font-mono text-emerald-400 font-semibold">
                Grade {c.recommendedGrade}+ · {c.difficulty}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Category Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isMn
                ? 'Хичээл хайх (Python, C++, SQL, React, Linux, AI, Security...)'
                : 'Search courses (Python, C++, SQL, React, Linux, AI, Security...)'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0a0f0c] border border-emerald-500/20 text-xs font-mono text-emerald-300 outline-none focus:border-emerald-500/60 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 bg-[#0a0f0c] p-1.5 rounded-2xl border border-emerald-500/20 text-xs font-mono">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                soundFx.click(settings.soundEnabled);
                setActiveCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-black font-extrabold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
          const isPythonOrCpp = course.trackCode === 'python' || course.trackCode === 'cpp';

          return (
            <SpatialCard3D key={course.id} intensity={5}>
              <div className="flex h-full flex-col justify-between rounded-3xl border border-emerald-500/25 bg-[#0e1612]/90 p-6 backdrop-blur-xl hover:border-emerald-400 transition-all">
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      {course.difficulty}
                    </span>
                    <span className="text-slate-400 font-semibold">
                      Recommended: <strong className="text-emerald-400">Grade {course.recommendedGrade}+</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{course.icon}</span>
                    <div>
                      <h3 className="font-bold text-base text-white">
                        {isMn ? course.titleMn : course.title}
                      </h3>
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        {course.category}
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {isMn ? course.descriptionMn : course.description}
                  </p>

                  {/* Highlights */}
                  <div className="mt-4 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Syllabus Highlights:</span>
                    <div className="flex flex-wrap gap-1 text-[11px] font-mono">
                      {course.syllabusHighlights.slice(0, 3).map((item) => (
                        <span key={item} className="rounded bg-[#070b09] px-2 py-0.5 text-slate-300 border border-slate-800">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Meta & Action */}
                <div className="mt-6 pt-4 border-t border-emerald-500/15">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mb-4 text-slate-300">
                    <div className="rounded-xl bg-[#070b09] p-2 border border-slate-800">
                      <div className="text-[10px] text-slate-500">Lessons</div>
                      <div className="font-bold text-white">{course.lessonsCount}</div>
                    </div>
                    <div className="rounded-xl bg-[#070b09] p-2 border border-slate-800">
                      <div className="text-[10px] text-slate-500">Exercises</div>
                      <div className="font-bold text-white">{course.exercisesCount}</div>
                    </div>
                    <div className="rounded-xl bg-[#070b09] p-2 border border-slate-800">
                      <div className="text-[10px] text-slate-500">Projects</div>
                      <div className="font-bold text-white">{course.projectsCount}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLaunchCourse(course)}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition-all shadow-md active:scale-[0.99]"
                  >
                    <span>
                      {isPythonOrCpp
                        ? isMn
                          ? 'Интерактив Сургалт Эхлэх'
                          : 'Launch Interactive Studio'
                        : isMn
                        ? 'Дэлгэрэнгүй Хөтөлбөр Харах'
                        : 'View Course Syllabus'}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </SpatialCard3D>
          );
        })}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-xl rounded-3xl border border-emerald-500/30 bg-[#0e1612] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCourse.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isMn ? selectedCourse.titleMn : selectedCourse.title}
                  </h3>
                  <div className="text-xs font-mono text-emerald-400">
                    Recommended: Grade {selectedCourse.recommendedGrade}+ · {selectedCourse.difficulty}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="text-slate-400 hover:text-white font-mono text-xs"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <p>{isMn ? selectedCourse.descriptionMn : selectedCourse.description}</p>

              <div>
                <span className="font-mono font-bold text-emerald-300 uppercase">
                  {isMn ? 'Сургалтын бүтэц:' : 'Complete Modules:'}
                </span>
                <ul className="mt-2 space-y-1.5">
                  {selectedCourse.syllabusHighlights.map((hl, i) => (
                    <li key={hl} className="flex items-center gap-2 font-mono">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>
                        Module {i + 1}: {hl}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-[#070b09] p-3 border border-slate-800 text-[11px] font-mono text-slate-400">
                Duration: ~{selectedCourse.durationHours} hours · {selectedCourse.lessonsCount} Lessons ·{' '}
                {selectedCourse.exercisesCount} Exercises · {selectedCourse.projectsCount} Capstone Projects
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-black hover:bg-emerald-400"
              >
                Ойлголоо (Done)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
