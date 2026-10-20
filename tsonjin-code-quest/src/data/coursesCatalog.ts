/**
 * Scalable Course Catalog with Grade-Aware Recommendations
 * Categories:
 * - CORE PROGRAMMING: Python, C++
 * - WEB: HTML, CSS, JavaScript, TypeScript
 * - DEVELOPER TOOLS: Git, GitHub, VS Code, Terminal Basics
 * - COMPUTER SCIENCE: Programming Fundamentals, Algorithms, Data Structures, Problem Solving, Computational Thinking, Time Complexity
 * - DATA: Data Analysis with Python, Pandas Basics, Data Visualization, Statistics for Programmers
 * - DATABASE: SQL, Database Fundamentals, PostgreSQL Basics
 * - WEB DEVELOPMENT: Frontend Fundamentals, React Basics, Next.js Basics, REST APIs, Backend Fundamentals
 * - AI: AI Fundamentals, Machine Learning Basics, Responsible AI, Prompt Engineering Basics
 * - SYSTEMS: Linux Fundamentals, Command Line, Computer Hardware Basics, Operating Systems Basics
 * - SECURITY: Cybersecurity Fundamentals, Online Safety, Password Security, Web Security Concepts, Secure Coding Basics
 */

export type CourseDifficulty = 'BEGINNER' | 'FOUNDATION' | 'INTERMEDIATE' | 'ADVANCED';

export type CourseCategory =
  | 'CORE PROGRAMMING'
  | 'WEB'
  | 'DEVELOPER TOOLS'
  | 'COMPUTER SCIENCE'
  | 'DATA'
  | 'DATABASE'
  | 'WEB DEVELOPMENT'
  | 'AI'
  | 'SYSTEMS'
  | 'SECURITY';

export interface CatalogCourse {
  id: string;
  title: string;
  titleMn: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  recommendedGrade: number; // e.g. 6 for Grade 6+
  durationHours: number;
  lessonsCount: number;
  exercisesCount: number;
  projectsCount: number;
  icon: string;
  description: string;
  descriptionMn: string;
  isAvailableNow: boolean;
  syllabusHighlights: string[];
  trackCode?: 'python' | 'cpp' | 'catalog';
}

export const COURSE_CATALOG: CatalogCourse[] = [
  // 1. CORE PROGRAMMING
  {
    id: 'course_python_foundations',
    title: 'Python Foundations',
    titleMn: 'Python Програмчлалын Үндэс',
    category: 'CORE PROGRAMMING',
    difficulty: 'BEGINNER',
    recommendedGrade: 6,
    durationHours: 32,
    lessonsCount: 24,
    exercisesCount: 80,
    projectsCount: 5,
    icon: '🐍',
    description: 'Complete hands-on beginner programming track with interactive console challenges and boss battles.',
    descriptionMn: 'Интерактив консол сорилтууд, босс даалгавартай Python хэлний анхлан суралцагчийн үндсэн хөтөлбөр.',
    isAvailableNow: true,
    syllabusHighlights: ['Variables & Output', 'Conditionals & If-Else', 'Loops & Iteration', 'Lists & Dictionaries', 'Final Boss Project'],
    trackCode: 'python',
  },
  {
    id: 'course_cpp_foundations',
    title: 'Modern C++ Foundations',
    titleMn: 'Орчин Үеийн C++20 Үндэс',
    category: 'CORE PROGRAMMING',
    difficulty: 'FOUNDATION',
    recommendedGrade: 7,
    durationHours: 48,
    lessonsCount: 30,
    exercisesCount: 95,
    projectsCount: 6,
    icon: '⚡',
    description: 'Rigorous C++20 systems foundation: memory layout, pointers, STL, classes, and algorithmic problem solving.',
    descriptionMn: 'Санах ойн бүтэц, заагч (pointers), STL, класс болон алгоритмын бодлого бүхий C++20 цогц сургалт.',
    isAvailableNow: true,
    syllabusHighlights: ['Compilation & Types', 'Pointers & References', 'OOP Encapsulation', 'STL Vectors & Maps', 'Two Sum & Algorithms'],
    trackCode: 'cpp',
  },

  // 2. WEB
  {
    id: 'course_html_css',
    title: 'HTML & CSS Essentials',
    titleMn: 'HTML & CSS Веб Бүтээх Үндэс',
    category: 'WEB',
    difficulty: 'BEGINNER',
    recommendedGrade: 6,
    durationHours: 20,
    lessonsCount: 16,
    exercisesCount: 45,
    projectsCount: 4,
    icon: '🌐',
    description: 'Learn modern semantic HTML5, CSS3 flexbox/grid layout, and responsive mobile-first design.',
    descriptionMn: 'Семантик HTML5, CSS Flexbox/Grid ба гар утсанд тохирох орчин үеийн веб зохиомж.',
    isAvailableNow: true,
    syllabusHighlights: ['Semantic Elements', 'CSS Box Model', 'Flexbox & CSS Grid', 'Responsive Media Queries', 'Personal Portfolio'],
  },
  {
    id: 'course_js_ts',
    title: 'JavaScript & TypeScript Core',
    titleMn: 'JavaScript ба TypeScript Хөгжүүлэлт',
    category: 'WEB',
    difficulty: 'FOUNDATION',
    recommendedGrade: 8,
    durationHours: 35,
    lessonsCount: 22,
    exercisesCount: 65,
    projectsCount: 5,
    icon: '📜',
    description: 'From JavaScript asynchronous programming and DOM manipulation to strict TypeScript static types.',
    descriptionMn: 'JavaScript асинхрон горим, DOM-оос эхлээд TypeScript-ийн статик төрөл, интерфэйс хүртэл.',
    isAvailableNow: true,
    syllabusHighlights: ['ES6+ Syntax', 'DOM Manipulation', 'Async/Await & Fetch', 'TypeScript Interfaces', 'Strict Typing'],
  },

  // 3. DEVELOPER TOOLS
  {
    id: 'course_git_github',
    title: 'Git, GitHub & VS Code Essentials',
    titleMn: 'Git, GitHub ба Хөгжүүлэгчийн Хэрэгслүүд',
    category: 'DEVELOPER TOOLS',
    difficulty: 'BEGINNER',
    recommendedGrade: 6,
    durationHours: 15,
    lessonsCount: 12,
    exercisesCount: 30,
    projectsCount: 2,
    icon: '🐙',
    description: 'Master version control, commits, branching, merging, and modern VS Code extensions.',
    descriptionMn: 'Хувилбарын удирдлага, салбар (branches), нэгтгэх (merge) болон VS Code код засварлагчийн тохиргоо.',
    isAvailableNow: true,
    syllabusHighlights: ['Git Init & Commit', 'Branching & Merging', 'GitHub Pull Requests', 'VS Code Shortcuts', 'Terminal CLI'],
  },

  // 4. COMPUTER SCIENCE
  {
    id: 'course_cs_fundamentals',
    title: 'Computer Science & Computational Thinking',
    titleMn: 'Компьютерын Шинжлэх Ухаан ба Тооцооллын Сэтгэлгээ',
    category: 'COMPUTER SCIENCE',
    difficulty: 'BEGINNER',
    recommendedGrade: 6,
    durationHours: 18,
    lessonsCount: 14,
    exercisesCount: 40,
    projectsCount: 3,
    icon: '🧠',
    description: 'Binary systems, logic gates, abstraction, decomposition, and algorithmic patterns for young coders.',
    descriptionMn: 'Хоёртын тооллын систем, логик хаалга, алгоритмын сэтгэлгээг анхан шатнаас суралцах.',
    isAvailableNow: true,
    syllabusHighlights: ['Binary & Hexadecimal', 'Boolean Logic', 'Algorithmic Decomposition', 'Pattern Recognition', 'Pseudocode'],
  },
  {
    id: 'course_dsa',
    title: 'Data Structures & Algorithms',
    titleMn: 'Өгөгдлийн Бүтэц ба Алгоритмууд',
    category: 'COMPUTER SCIENCE',
    difficulty: 'INTERMEDIATE',
    recommendedGrade: 9,
    durationHours: 45,
    lessonsCount: 28,
    exercisesCount: 85,
    projectsCount: 5,
    icon: '🌲',
    description: 'Arrays, Linked Lists, Stacks, Queues, Binary Trees, Big-O Time Complexity, and Search/Sort algorithms.',
    descriptionMn: 'Массив, Холбоост жагсаалт, Мод, Big-O хугацааны нарийвчлал ба олимпиад бодлогын үндэс.',
    isAvailableNow: true,
    syllabusHighlights: ['Big-O Analysis', 'Stack & Queue', 'Binary Search Trees', 'Recursion & Dynamic Programming', 'Graph Basics'],
  },

  // 5. DATA
  {
    id: 'course_data_python',
    title: 'Data Analysis with Python & Pandas',
    titleMn: 'Python Өгөгдлийн Шинжилгээ ба Pandas',
    category: 'DATA',
    difficulty: 'INTERMEDIATE',
    recommendedGrade: 8,
    durationHours: 28,
    lessonsCount: 18,
    exercisesCount: 50,
    projectsCount: 4,
    icon: '📊',
    description: 'Inspect datasets, compute statistics, clean data with Pandas, and plot interactive charts.',
    descriptionMn: 'Өгөгдөл цэвэрлэх, Pandas сан, статистик тооцоолол ба график диаграм зурах.',
    isAvailableNow: true,
    syllabusHighlights: ['Pandas DataFrames', 'Data Cleaning', 'Aggregation & GroupBy', 'Matplotlib / Seaborn', 'Real-world Analytics'],
  },

  // 6. DATABASE
  {
    id: 'course_sql_databases',
    title: 'SQL & Database Fundamentals',
    titleMn: 'SQL ба Өгөгдлийн Сангийн Үндэс',
    category: 'DATABASE',
    difficulty: 'FOUNDATION',
    recommendedGrade: 8,
    durationHours: 24,
    lessonsCount: 16,
    exercisesCount: 55,
    projectsCount: 3,
    icon: '🗄️',
    description: 'Relational data modeling, table normalization, SELECT queries, JOIN operations, and PostgreSQL basics.',
    descriptionMn: 'Харилцаат өгөгдлийн сан, хүснэгтийн бүтэц, SQL SELECT, JOIN, индекс ба найдвартай өгөгдөл хадгалалт.',
    isAvailableNow: true,
    syllabusHighlights: ['Relational Schema Design', 'SELECT, WHERE, ORDER BY', 'INNER & LEFT JOINs', 'Aggregates & GROUP BY', 'Transactions & ACID'],
  },

  // 7. WEB DEVELOPMENT
  {
    id: 'course_react_frontend',
    title: 'Frontend Fundamentals & React',
    titleMn: 'Фронтенд Хөгжүүлэлт ба React',
    category: 'WEB DEVELOPMENT',
    difficulty: 'INTERMEDIATE',
    recommendedGrade: 9,
    durationHours: 36,
    lessonsCount: 22,
    exercisesCount: 60,
    projectsCount: 5,
    icon: '⚛️',
    description: 'Component architecture, useState/useEffect hooks, state management, and modern component design.',
    descriptionMn: 'Компонент архитектур, React Hooks, төлөв удирдах арга ба хурдтай веб апп бүтээх.',
    isAvailableNow: true,
    syllabusHighlights: ['JSX & Components', 'Props & State Management', 'Hooks (useState, useEffect)', 'REST API Integration', 'Production SPA Build'],
  },
  {
    id: 'course_backend_apis',
    title: 'Backend Fundamentals & REST APIs',
    titleMn: 'Бэкэнд Хөгжүүлэлт ба REST API',
    category: 'WEB DEVELOPMENT',
    difficulty: 'INTERMEDIATE',
    recommendedGrade: 10,
    durationHours: 32,
    lessonsCount: 20,
    exercisesCount: 50,
    projectsCount: 4,
    icon: '🔌',
    description: 'Server architecture with Node.js/Express, routing, middleware, JSON payloads, and JWT authentication.',
    descriptionMn: 'Сервер талын кодчлол, API чиглүүлэлт, хүсэлт хариу боловсруулах ба баталгаажуулалт.',
    isAvailableNow: true,
    syllabusHighlights: ['HTTP Protocols', 'Express Server Setup', 'CRUD REST Endpoints', 'Middleware & Error Handling', 'JWT & Secure Sessions'],
  },

  // 8. AI
  {
    id: 'course_ai_fundamentals',
    title: 'AI Fundamentals & Responsible AI',
    titleMn: 'Хиймэл Оюуны Үндэс ба Ёс Зүйт AI',
    category: 'AI',
    difficulty: 'FOUNDATION',
    recommendedGrade: 7,
    durationHours: 20,
    lessonsCount: 14,
    exercisesCount: 35,
    projectsCount: 3,
    icon: '🤖',
    description: 'How neural networks work, prompt engineering principles, machine learning concepts, and AI safety ethics.',
    descriptionMn: 'Машин сургалтын үндсэн ойлголт, нейрон сүлжээ, Промпт инженерчлэл ба AI-г хариуцлагатай ашиглах ёс зүй.',
    isAvailableNow: true,
    syllabusHighlights: ['How LLMs Work', 'Prompt Engineering', 'Supervised vs Unsupervised ML', 'Model Hallucinations & Bias', 'Ethics in AI'],
  },

  // 9. SYSTEMS
  {
    id: 'course_linux_systems',
    title: 'Linux Fundamentals & Command Line',
    titleMn: 'Linux Үйлдлийн Систем ба Терминал',
    category: 'SYSTEMS',
    difficulty: 'FOUNDATION',
    recommendedGrade: 8,
    durationHours: 18,
    lessonsCount: 14,
    exercisesCount: 40,
    projectsCount: 2,
    icon: '🐧',
    description: 'File system hierarchies, bash scripting, permissions, process management, and remote SSH workflows.',
    descriptionMn: 'Linux файлын систем, Bash скрипт, эрх тохируулах (chmod/chown), процессууд ба серверийн удирдлага.',
    isAvailableNow: true,
    syllabusHighlights: ['Filesystem Navigation', 'File Permissions', 'Pipes & Redirection', 'Process Control (ps, kill)', 'Bash Automation'],
  },

  // 10. SECURITY (Defensive only)
  {
    id: 'course_defensive_security',
    title: 'Defensive Cybersecurity & Online Safety',
    titleMn: 'Кибер Аюулгүй Байдал ба Хамгаалалт',
    category: 'SECURITY',
    difficulty: 'BEGINNER',
    recommendedGrade: 6,
    durationHours: 16,
    lessonsCount: 12,
    exercisesCount: 35,
    projectsCount: 2,
    icon: '🛡️',
    description: 'Defensive safety: password hygiene, multi-factor authentication, phishing defenses, and secure coding basics.',
    descriptionMn: 'Хамгаалалтын кибер аюулгүй байдал: нууц үгийн соёл, 2FA, фишинг халдлагаас сэргийлэх ба аюулгүй кодчлол.',
    isAvailableNow: true,
    syllabusHighlights: ['Password Entropy & 2FA', 'Phishing & Social Engineering', 'HTTPS & Encryption Basics', 'SQL Injection Defense', 'Safe Web Habits'],
  },
];

/**
 * Grade 6 Recommended Starter Learning Path
 */
export const GRADE_6_STARTER_PATH_IDS = [
  'course_cs_fundamentals',
  'course_python_foundations',
  'course_defensive_security',
  'course_git_github',
  'course_html_css',
];
