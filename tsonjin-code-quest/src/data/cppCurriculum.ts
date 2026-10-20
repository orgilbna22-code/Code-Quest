/**
 * Comprehensive Modern C++ Curriculum for Tsonjin Cyber Academy
 * Structured as 6 Progressive Stages:
 * BEGINNER -> INTERMEDIATE -> ADVANCED -> PROJECTS -> ALGORITHMS -> PROBLEM SOLVING
 *
 * Full compliance with Modern C++20 standards, RAII, STL, OOP, Templates,
 * sandboxed execution, and interactive pedagogical visualizations.
 */

export interface CppTestCase {
  input?: string;
  expectedOutput: string;
  description: string;
}

export interface CppExercise {
  id: string;
  title: string;
  titleMn: string;
  difficulty: 'Very Easy' | 'Easy' | 'Medium' | 'Hard' | 'Challenge';
  category:
    | 'Variables'
    | 'Input/Output'
    | 'Conditions'
    | 'Loops'
    | 'Functions'
    | 'Arrays'
    | 'Strings'
    | 'Vectors'
    | 'Pointers'
    | 'Classes'
    | 'STL'
    | 'Algorithms'
    | 'Debugging'
    | 'Problem Solving'
    | 'Projects';
  description: string;
  descriptionMn: string;
  starterCode: string;
  solutionCode: string;
  testCases: CppTestCase[];
  hints: string[];
  hintsMn: string[];
}

export interface CppQuizQuestion {
  question: string;
  questionMn: string;
  options: string[];
  optionsMn: string[];
  correctIndex: number;
  explanation: string;
  explanationMn: string;
}

export interface CppProject {
  id: string;
  title: string;
  titleMn: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  summaryMn: string;
  fileTree: string[];
  mainCode: string;
  headerCode?: string;
  explanation: string;
  explanationMn: string;
}

export interface CppLevel {
  id: number;
  trackStage: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROJECTS' | 'ALGORITHMS' | 'PROBLEM_SOLVING';
  stageTitle: string;
  stageTitleMn: string;
  title: string;
  titleMn: string;
  icon: string;
  summary: string;
  summaryMn: string;
  theory: string;
  theoryMn: string;
  codeSnippet: string;
  exercises: CppExercise[];
  quiz: CppQuizQuestion[];
  xpReward: number;
  hasVisualizer?: 'pointer' | 'memory' | 'algorithm' | 'comparison';
}

// =========================================================================
// 1. ALL 6 STAGES CURRICULUM LEVELS
// =========================================================================

export const CPP_LEVELS: CppLevel[] = [
  // -----------------------------------------------------------------------
  // STAGE 1: BEGINNER (101 - 105)
  // -----------------------------------------------------------------------
  {
    id: 101,
    trackStage: 'BEGINNER',
    stageTitle: 'Beginner Foundations',
    stageTitleMn: 'Анхан шат: Суурь ойлголт',
    title: 'What is C++? & Compiler Process',
    titleMn: 'C++ гэж юу вэ? Компиляторын ажиллагаа',
    icon: '⚡',
    summary: 'Understand how C++ source code is compiled into native CPU machine instructions, main(), and std::cout.',
    summaryMn: 'C++ эх код хэрхэн компилятороор машинаар уншигдах хурдан код болон хөрвөдөг, main() ба cout ойлголт.',
    theory: `### What is C++?
C++ is a high-performance compiled programming language created by Bjarne Stroustrup in 1979. Unlike interpreted languages, C++ compiles directly into CPU machine instructions.

### The Compilation Process
1. **Preprocessor (#include)**: Injects library headers.
2. **Compiler (g++, clang++)**: Translates C++ syntax into assembly & machine code.
3. **Linker**: Combines compiled object files and libraries into an executable.

### Anatomy of Minimal C++
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, Cyber Cadet!" << endl;
    return 0; // 0 indicates successful termination
}
\`\`\``,
    theoryMn: `### C++ гэж юу вэ?
C++ бол 1979 онд бүтээгдсэн, өндөр хурдтай, шууд CPU машин код болон хөрвөдөг хэл юм.

### Компиляторын ажиллагаа:
1. **Preprocessor**: '#include' зэрэг сангуудыг кодонд оруулна.
2. **Compiler**: C++ бичлэгийг шалгаж машин код (machine code) болгоно.
3. **Linker**: Шаардлагатай сангуудтай холбон ажиллах файл (.exe) үүсгэнэ.`,
    codeSnippet: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_hello',
        title: 'Print Hello World',
        titleMn: 'Hello World хэвлэх',
        difficulty: 'Very Easy',
        category: 'Input/Output',
        description: 'Write a C++ program that prints "Hello, World!" to the console using std::cout.',
        descriptionMn: 'std::cout ашиглан "Hello, World!" гэж дэлгэцэнд хэвлэх C++ програм бич.',
        starterCode: `#include <iostream>
using namespace std;

int main() {
    // Write your code here
    
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Hello, World!',
            description: 'Outputs Hello, World!',
          },
        ],
        hints: ['Use cout << "Hello, World!" << endl;', 'Do not forget the semicolon ; at the end of the statement.'],
        hintsMn: ['cout << "Hello, World!" << endl; гэж бичнэ.', 'Мөрийн төгсгөлд цэг таслал ; тавихаа бүү мартаарай.'],
      },
    ],
    quiz: [
      {
        question: 'Why does C++ require a compilation step instead of running directly like Python?',
        questionMn: 'Яагаад C++ код Python шиг шууд ажиллахгүй, компиляци шаарддаг вэ?',
        options: [
          'Because C++ transforms into native CPU machine instructions for maximum speed',
          'Because C++ cannot run on modern computers',
          'To make the code run slower for debugging',
          'Because C++ does not have a runtime environment',
        ],
        optionsMn: [
          'Учир нь C++ нь хамгийн өндөр хурдтай ажиллахын тулд шууд CPU-ийн машин код болж хөрвөдөг',
          'Учир нь C++ орчин үеийн компьютер дээр ажиллах боломжгүй',
          'Кодыг алдаа шалгах зорилгоор удаашруулахын тулд',
          'Учир нь C++-д ажиллах орчин байдаггүй тул',
        ],
        correctIndex: 0,
        explanation: 'Compiling directly to native CPU machine code is what gives C++ its unmatched execution speed.',
        explanationMn: 'Шууд CPU-ийн машин код болон хөрвөдөг тул C++ нь асар өндөр хурдтай ажилладаг.',
      },
    ],
    xpReward: 50,
    hasVisualizer: 'comparison',
  },

  {
    id: 102,
    trackStage: 'BEGINNER',
    stageTitle: 'Beginner Foundations',
    stageTitleMn: 'Анхан шат: Суурь ойлголт',
    title: 'Variables, Data Types & Operators',
    titleMn: 'Хувьсагч, Өгөгдлийн төрөл ба Үйлдлүүд',
    icon: '📦',
    summary: 'Master strongly-typed variables (int, double, char, bool, string) and arithmetic/logical operators.',
    summaryMn: 'Төрөлтэй хувьсагчид (int, double, char, bool, string) болон арифместик, логик үйлдлүүдтэй ажиллах.',
    theory: `### Strongly Typed C++
In C++, every variable must have a designated type:
- \`int\`: Integers (4 bytes, e.g. -5, 42)
- \`double\`: Floating point numbers (8 bytes, e.g. 3.1415)
- \`char\`: Single character in single quotes (1 byte, e.g. 'A')
- \`bool\`: true or false (1 byte)
- \`string\`: Text string (from \`<string>\`)

### Arithmetic & Modulo
Operators: \`+\`, \`-\`, \`*\`, \`/\`, \`%\` (remainder).
Note: Integer division \`7 / 2\` produces \`3\`. For decimals use \`7.0 / 2\` (yields \`3.5\`).`,
    theoryMn: `### C++ Өгөгдлийн төрлүүд:
- \`int\`: Бүхэл тоо (-5, 42)
- \`double\`: Бутархай тоо (3.1415)
- \`char\`: Ганц тэмдэгт ('A')
- \`bool\`: Үнэн эсвэл худал (true / false)
- \`string\`: Текст мөр`,
    codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int a = 15;
    int b = 4;
    cout << "Sum: " << (a + b) << endl;
    cout << "Remainder: " << (a % b) << endl;
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_add',
        title: 'Add Two Numbers',
        titleMn: 'Хоёр тооны нийлбэр олох',
        difficulty: 'Very Easy',
        category: 'Variables',
        description: 'Declare two integer variables a = 25 and b = 17. Calculate their sum and print "Sum: 42".',
        descriptionMn: 'a = 25 ба b = 17 гэсэн хоёр хувьсагч зарлаж, нийлбэрийг нь "Sum: 42" гэж хэвлэ.',
        starterCode: `#include <iostream>
using namespace std;

int main() {
    int a = 25;
    int b = 17;
    // Calculate and print: Sum: 42
    
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

int main() {
    int a = 25;
    int b = 17;
    int sum = a + b;
    cout << "Sum: " << sum << endl;
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Sum: 42',
            description: 'Computes sum of 25 and 17 correctly',
          },
        ],
        hints: ['int sum = a + b;', 'cout << "Sum: " << sum << endl;'],
        hintsMn: ['int sum = a + b; гэж нийлбэрийг хадгална.', 'cout << "Sum: " << sum << endl; гэж хэвлэнэ.'],
      },
      {
        id: 'cpp_ex_age',
        title: 'Age Calculator',
        titleMn: 'Нас тооцоолуур',
        difficulty: 'Easy',
        category: 'Variables',
        description: 'Given birthYear = 2008 and currentYear = 2026, calculate the age and output "Age: 18".',
        descriptionMn: 'birthYear = 2008 ба currentYear = 2026 өгөгдсөн бол насыг тооцоолж "Age: 18" гэж хэвлэ.',
        starterCode: `#include <iostream>
using namespace std;

int main() {
    int birthYear = 2008;
    int currentYear = 2026;
    // Output: Age: 18
    
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

int main() {
    int birthYear = 2008;
    int currentYear = 2026;
    int age = currentYear - birthYear;
    cout << "Age: " << age << endl;
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Age: 18',
            description: 'Correctly outputs Age: 18',
          },
        ],
        hints: ['Subtract birthYear from currentYear.'],
        hintsMn: ['currentYear-ээс birthYear-ийг хасна.'],
      },
    ],
    quiz: [
      {
        question: 'What is the result of integer division: 7 / 2 in C++?',
        questionMn: 'C++-д бүхэл тооны хуваах үйлдэл 7 / 2 ямар үр дүн өгөх вэ?',
        options: ['3', '3.5', '4', 'Compile error'],
        optionsMn: ['3', '3.5', '4', 'Компиляторын алдаа'],
        correctIndex: 0,
        explanation: 'When both operands are integers, C++ performs integer truncation, discarding the decimal fraction.',
        explanationMn: 'Хоёр бүхэл тоог хуваахад C++ бутархай хэсгийг хаяж бүхэл хэсгийг (3) авдаг.',
      },
    ],
    xpReward: 60,
  },

  {
    id: 103,
    trackStage: 'BEGINNER',
    stageTitle: 'Beginner Foundations',
    stageTitleMn: 'Анхан шат: Суурь ойлголт',
    title: 'Conditionals: if, else, switch',
    titleMn: 'Нөхцөлт шалгалт: if, else, switch',
    icon: '🔀',
    summary: 'Branch code execution using if, else if, else, and switch statements.',
    summaryMn: 'if, else if, else болон switch ашиглан програмын салаалсан логик бүтээх.',
    theory: `### Conditional Statements
Conditionals allow programs to make decisions:
\`\`\`cpp
int power = 85;
if (power >= 80) {
    cout << "Shields Optimal" << endl;
} else if (power >= 40) {
    cout << "Shields Nominal" << endl;
} else {
    cout << "Shield Warning!" << endl;
}
\`\`\`

### Switch Statements
For discrete matching on integers or characters:
\`\`\`cpp
char rank = 'A';
switch (rank) {
    case 'A': cout << "Commander" << endl; break;
    case 'B': cout << "Officer" << endl; break;
    default: cout << "Cadet" << endl;
}
\`\`\``,
    theoryMn: `### Нөхцөлт шалгалт
Нөхцөлт шалгалт нь логик үнэн/худал эсэхээс хамаарч өөр өөр код ажиллуулах боломж олгодог.
\`switch\` команд нь тодорхой тоо эсвэл тэмдэгтийн утгыг олон сонголтоор шалгахад хэрэглэгдэнэ.`,
    codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int num = 14;
    if (num % 2 == 0) {
        cout << "Even" << endl;
    } else {
        cout << "Odd" << endl;
    }
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_even_odd',
        title: 'Even or Odd',
        titleMn: 'Тэгш эсвэл Сондгой шалгах',
        difficulty: 'Easy',
        category: 'Conditions',
        description: 'Given n = 28, check if it is even or odd. Print "Even" if divisible by 2, otherwise "Odd".',
        descriptionMn: 'n = 28 тоо өгөгдсөн бол тэгш эсэхийг шалгаж "Even" эсвэл "Odd" гэж хэвлэ.',
        starterCode: `#include <iostream>
using namespace std;

int main() {
    int n = 28;
    // Check if even or odd
    
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

int main() {
    int n = 28;
    if (n % 2 == 0) {
        cout << "Even" << endl;
    } else {
        cout << "Odd" << endl;
    }
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Even',
            description: 'Identifies 28 as Even',
          },
        ],
        hints: ['Use modulo operator: if (n % 2 == 0)'],
        hintsMn: ['Үлдэгдэл шалгах: if (n % 2 == 0)'],
      },
      {
        id: 'cpp_ex_largest_three',
        title: 'Largest of Three Numbers',
        titleMn: 'Гурван тооны ихийг олох',
        difficulty: 'Easy',
        category: 'Conditions',
        description: 'Given x = 45, y = 82, z = 33, find the maximum number and output "Largest: 82".',
        descriptionMn: 'x = 45, y = 82, z = 33 тоонуудын хамгийн ихийг олж "Largest: 82" гэж хэвлэ.',
        starterCode: `#include <iostream>
using namespace std;

int main() {
    int x = 45, y = 82, z = 33;
    // Find largest
    
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

int main() {
    int x = 45, y = 82, z = 33;
    int maxVal = x;
    if (y > maxVal) maxVal = y;
    if (z > maxVal) maxVal = z;
    cout << "Largest: " << maxVal << endl;
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Largest: 82',
            description: 'Outputs Largest: 82',
          },
        ],
        hints: ['Compare y and z against initial maxVal = x.'],
        hintsMn: ['maxVal = x гэж аваад y болон z-тэй харьцуулна.'],
      },
    ],
    quiz: [
      {
        question: 'What happens in a C++ switch statement if you forget the `break;` statement?',
        questionMn: 'C++ switch команд дотор `break;` бичихээ мартвал юу болох вэ?',
        options: [
          'Execution falls through to the next case (Fallthrough)',
          'It causes a compilation error',
          'The computer restarts',
          'The program skips all cases',
        ],
        optionsMn: [
          'Дараагийн case рүү шууд үргэлжлэн ажиллана (Fallthrough)',
          'Компиляторын алдаа заана',
          'Компьютер дахин ачаална',
          'Бүх case-ийг алгасна',
        ],
        correctIndex: 0,
        explanation: 'Without a break statement, C++ falls through and executes the code in subsequent cases.',
        explanationMn: 'break байхгүй бол C++ дараагийн case-ийн кодыг шалгалгүй шууд дараалан ажиллуулдаг.',
      },
    ],
    xpReward: 70,
  },

  {
    id: 104,
    trackStage: 'BEGINNER',
    stageTitle: 'Beginner Foundations',
    stageTitleMn: 'Анхан шат: Суурь ойлголт',
    title: 'Loops: for, while, do-while',
    titleMn: 'Давталт: for, while, do-while',
    icon: '🔁',
    summary: 'Master deterministic for loops, while condition loops, and do-while loops.',
    summaryMn: 'Тоолуурт for давталт, нөхцөлт while болон do-while давталтуудыг эзэмших.',
    theory: `### For Loops
Best when iteration count is known in advance:
\`\`\`cpp
for (int i = 1; i <= 5; ++i) {
    cout << i << " ";
}
\`\`\`

### While Loops
Best when looping depends on an evolving condition:
\`\`\`cpp
int energy = 100;
while (energy > 0) {
    energy -= 25;
}
\`\`\`

### Do-While
Guaranteed to execute the body at least once before checking condition:
\`\`\`cpp
int count = 0;
do {
    count++;
} while (count < 3);
\`\`\``,
    theoryMn: `### Давталтын төрлүүд:
1. **for**: Хэдэн удаа давтах нь тодорхой үед ашиглана.
2. **while**: Нөхцөл үнэн байх хугацаанд давтана.
3. **do-while**: Нөхцөлөөс үл хамааран дор хаяж 1 удаа заавал ажиллана.`,
    codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int sum = 0;
    for (int i = 1; i <= 10; ++i) {
        sum += i;
    }
    cout << "Sum: " << sum << endl;
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_sum_n',
        title: 'Sum 1 to N',
        titleMn: '1-ээс N хүртэлх нийлбэр',
        difficulty: 'Easy',
        category: 'Loops',
        description: 'Using a for loop, calculate the sum of numbers from 1 to 10 and print "Sum: 55".',
        descriptionMn: 'for давталт ашиглан 1-ээс 10 хүртэлх тооны нийлбэрийг олж "Sum: 55" гэж хэвлэ.',
        starterCode: `#include <iostream>
using namespace std;

int main() {
    // Sum numbers 1 to 10
    
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

int main() {
    int sum = 0;
    for (int i = 1; i <= 10; ++i) {
        sum += i;
    }
    cout << "Sum: " << sum << endl;
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Sum: 55',
            description: 'Computes sum of 1..10 = 55',
          },
        ],
        hints: ['Initialize int sum = 0; then loop from 1 to 10.'],
        hintsMn: ['int sum = 0; гэж эхлүүлээд 1-ээс 10 хүртэл давтан нэмнэ.'],
      },
      {
        id: 'cpp_ex_mult_table',
        title: 'Multiplication Table',
        titleMn: 'Хүрд хэвлэх',
        difficulty: 'Easy',
        category: 'Loops',
        description: 'Print the 5 times table up to 5 * 3: "5 * 1 = 5", "5 * 2 = 10", "5 * 3 = 15".',
        descriptionMn: '5-ын хүрдийн эхний 3 мөрийг хэвлэ: "5 * 1 = 5", "5 * 2 = 10", "5 * 3 = 15".',
        starterCode: `#include <iostream>
using namespace std;

int main() {
    int n = 5;
    // Output 5 * 1 to 5 * 3
    
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

int main() {
    int n = 5;
    for (int i = 1; i <= 3; ++i) {
        cout << n << " * " << i << " = " << (n * i) << endl;
    }
    return 0;
}`,
        testCases: [
          {
            expectedOutput: '5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15',
            description: 'Outputs multiplication table',
          },
        ],
        hints: ['Loop from 1 to 3 and format with cout.'],
        hintsMn: ['1-ээс 3 хүртэл давтаж хэвлэнэ.'],
      },
    ],
    quiz: [
      {
        question: 'Which loop is guaranteed to execute its code block at least once?',
        questionMn: 'Аль давталт нь кодын блокоо дор хаяж 1 удаа заавал ажиллуулдаг вэ?',
        options: ['do-while', 'while', 'for', 'foreach'],
        optionsMn: ['do-while', 'while', 'for', 'foreach'],
        correctIndex: 0,
        explanation: 'do-while checks its test condition at the bottom of the loop, ensuring the block runs at least once.',
        explanationMn: 'do-while нь нөхцөлөө төгсгөлд нь шалгадаг тул эхний удаад заавал ажилладаг.',
      },
    ],
    xpReward: 70,
  },

  {
    id: 105,
    trackStage: 'BEGINNER',
    stageTitle: 'Beginner Foundations',
    stageTitleMn: 'Анхан шат: Суурь ойлголт',
    title: 'Functions & Scope',
    titleMn: 'Функц, Параметр ба Хамрах хүрээ',
    icon: '🧩',
    summary: 'Write reusable, modular functions with parameters, return types, and overloading.',
    summaryMn: 'Дахин ашиглагдах функц, параметрууд, буцаах утга болон overloading эзэмших.',
    theory: `### Modular Functions
Functions promote code reuse and the DRY (Don't Repeat Yourself) principle:
\`\`\`cpp
int add(int a, int b) {
    return a + b;
}
\`\`\`

### Function Overloading
In C++, multiple functions can share the exact same name as long as their parameter lists differ in count or types:
\`\`\`cpp
int multiply(int a, int b) { return a * b; }
double multiply(double a, double b) { return a * b; }
\`\`\``,
    theoryMn: `### Функц
Функц нь нэг зорилготой кодыг нэгтгэн дахин дахин ашиглах боломж олгодог.
C++-д ижил нэртэй боловч өөр төрлийн параметртэй олон функц зэрэг зарлаж болдог (Overloading).`,
    codeSnippet: `#include <iostream>
using namespace std;

double calculateAverage(double a, double b, double c) {
    return (a + b + c) / 3.0;
}

int main() {
    cout << "Average: " << calculateAverage(10, 20, 30) << endl;
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_average',
        title: 'Average of Numbers',
        titleMn: 'Тоонуудын дундаж олох',
        difficulty: 'Easy',
        category: 'Functions',
        description: 'Write a function `double avg(double a, double b, double c)` that returns the mean. In main(), call it with 12, 18, 30 and print "Avg: 20".',
        descriptionMn: '3 тооны дунджийг олдог `double avg(double a, double b, double c)` функц бичиж, main-д 12, 18, 30-аар дуудан "Avg: 20" гэж хэвлэ.',
        starterCode: `#include <iostream>
using namespace std;

// Write your avg function here

int main() {
    // Call and print Avg: 20
    
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

double avg(double a, double b, double c) {
    return (a + b + c) / 3.0;
}

int main() {
    cout << "Avg: " << avg(12, 18, 30) << endl;
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Avg: 20',
            description: 'Calculates mean of 12, 18, 30',
          },
        ],
        hints: ['return (a + b + c) / 3.0;'],
        hintsMn: ['return (a + b + c) / 3.0; гэж буцаана.'],
      },
    ],
    quiz: [
      {
        question: 'What is Function Overloading in C++?',
        questionMn: 'C++ хэлэнд Function Overloading гэж юу вэ?',
        options: [
          'Multiple functions having the same name but different parameters',
          'A function calling itself repeatedly until crash',
          'A function that takes too much memory',
          'Replacing a function with a macro',
        ],
        optionsMn: [
          'Ижил нэртэй боловч өөр өөр параметртэй олон функц байх',
          'Функц өөрийгөө дуудсаар байгаад унах',
          'Хэт их санах ой зарцуулах',
          'Функцийг макроор солих',
        ],
        correctIndex: 0,
        explanation: 'Overloading allows functions to share a name if their signature (parameters) distinguishes them.',
        explanationMn: 'Параметрүүдийн төрөл эсвэл тоо нь өөр бол ижил нэртэй функцүүдийг зэрэг тодорхойлж болдог.',
      },
    ],
    xpReward: 80,
  },

  // -----------------------------------------------------------------------
  // STAGE 2: INTERMEDIATE (106 - 110)
  // -----------------------------------------------------------------------
  {
    id: 106,
    trackStage: 'INTERMEDIATE',
    stageTitle: 'Intermediate Mastery',
    stageTitleMn: 'Дунд шат: Массив, Стринг & Санах ой',
    title: 'Arrays & std::string Operations',
    titleMn: 'Массив ба Текстэн мөр (std::string)',
    icon: '📊',
    summary: 'Work with contiguous memory arrays, string indexing, reversal, and substring manipulation.',
    summaryMn: 'Массив, тэмдэгт мөр (string)-ийн индекс, урвуулах, хайх үйлдлүүдийг эзэмших.',
    theory: `### Contiguous Memory Arrays
Arrays store elements of identical type in consecutive memory locations:
\`\`\`cpp
int arr[5] = {10, 20, 30, 40, 50};
cout << arr[0]; // 10
\`\`\`

### Modern std::string
C++ strings provide rich member methods:
\`\`\`cpp
string word = "CyberQuest";
cout << word.length(); // 10
cout << word.substr(0, 5); // "Cyber"
\`\`\``,
    theoryMn: `### Массив ба std::string
Массив нь ижил төрлийн өгөгдлийг RAM санах ойд дараалуулан байршуулдаг.
std::string нь урт нь өөрчлөгддөг, хайлт болон дэд мөр таслах (.substr()) зэрэг олон боломжтой сан юм.`,
    codeSnippet: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string text = "Cyber";
    string reversed = "";
    for (int i = text.length() - 1; i >= 0; --i) {
        reversed += text[i];
    }
    cout << "Reversed: " << reversed << endl;
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_reverse_string',
        title: 'Reverse a String',
        titleMn: 'Текстэн мөрийг урвуулах',
        difficulty: 'Medium',
        category: 'Strings',
        description: 'Given string s = "CYBER", reverse the string and print "Reversed: REBYC".',
        descriptionMn: 's = "CYBER" мөрийг урвуулан "Reversed: REBYC" гэж хэвлэ.',
        starterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "CYBER";
    // Reverse s and print: Reversed: REBYC
    
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "CYBER";
    string rev = "";
    for (int i = s.length() - 1; i >= 0; --i) {
        rev += s[i];
    }
    cout << "Reversed: " << rev << endl;
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Reversed: REBYC',
            description: 'Reverses CYBER to REBYC',
          },
        ],
        hints: ['Loop backwards starting from s.length() - 1 down to 0.'],
        hintsMn: ['s.length() - 1-ээс эхлэн 0 хүртэл арагшаа давтана.'],
      },
      {
        id: 'cpp_ex_count_vowels',
        title: 'Count Vowels',
        titleMn: 'Эгшиг үсэг тоолох',
        difficulty: 'Medium',
        category: 'Strings',
        description: 'Count vowels (a, e, i, o, u) in "academy" and output "Vowels: 3".',
        descriptionMn: '"academy" үгийн эгшиг үсгийн тоог олж "Vowels: 3" гэж хэвлэ.',
        starterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string word = "academy";
    // Count vowels
    
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string word = "academy";
    int count = 0;
    for (char c : word) {
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            count++;
        }
    }
    cout << "Vowels: " << count << endl;
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Vowels: 3',
            description: 'Counts 3 vowels in academy',
          },
        ],
        hints: ['Check if character is a, e, i, o, or u.'],
        hintsMn: ['Тэмдэгт бүрийг a, e, i, o, u эсэхээр шалгана.'],
      },
    ],
    quiz: [
      {
        question: 'What is the index of the first element in any C++ array or string?',
        questionMn: 'C++ массив болон string-ийн хамгийн эхний элементийн индекс хэд байдаг вэ?',
        options: ['0', '1', '-1', 'Undefined'],
        optionsMn: ['0', '1', '-1', 'Тодорхойгүй'],
        correctIndex: 0,
        explanation: 'C++ is zero-indexed, meaning the first element always resides at index [0].',
        explanationMn: 'C++ нь 0-ээр эхэлсэн индекс ашигладаг тул эхний элемент [0] байна.',
      },
    ],
    xpReward: 80,
  },

  {
    id: 107,
    trackStage: 'INTERMEDIATE',
    stageTitle: 'Intermediate Mastery',
    stageTitleMn: 'Дунд шат: Массив, Стринг & Санах ой',
    title: 'Modern STL: std::vector & Range-based Loops',
    titleMn: 'Modern C++: std::vector ба Range-based давталт',
    icon: '🚀',
    summary: 'Dynamic contiguous arrays, push_back, size, and modern range-for loops (for (auto x : vec)).',
    summaryMn: 'Хэмжээ нь динамик vector, push_back үйлдэл болон орчин үеийн range-based давталт.',
    theory: `### Why std::vector?
Unlike fixed C-style arrays, \`std::vector\` manages dynamic heap allocation automatically:
- Expands automatically with \`push_back()\`
- Cleans up its own memory when destroyed (RAII)
- Safe bounds and continuous cache locality

### Range-based For Loops
Modern C++ replaces verbose index loops:
\`\`\`cpp
vector<int> numbers = {10, 20, 30};
for (const auto& num : numbers) {
    cout << num << " ";
}
\`\`\``,
    theoryMn: `### std::vector давуу тал
Энгийн массивын оронд std::vector ашигласнаар:
- Хэмжээг урьдчилан заах шаардлагагүй, \`push_back()\`-ээр өөрөө томорно.
- Дуусах үедээ санах ойгоо өөрөө цэвэрлэнэ (RAII).
- \`for (const auto& x : v)\` хэлбэрээр маш цэвэрхэн уншигдана.`,
    codeSnippet: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {4, 7, 2, 9};
    nums.push_back(10);
    int sum = 0;
    for (int n : nums) sum += n;
    cout << "Total: " << sum << endl;
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_vector_stats',
        title: 'Vector Statistics',
        titleMn: 'Векторын статистик',
        difficulty: 'Medium',
        category: 'Vectors',
        description: 'Given vector<int> v = {12, 45, 7, 23, 89}, find the max element and sum. Print "Max: 89 | Sum: 176".',
        descriptionMn: 'v = {12, 45, 7, 23, 89} вектороос хамгийн их тоо ба нийлбэрийг олж "Max: 89 | Sum: 176" гэж хэвлэ.',
        starterCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {12, 45, 7, 23, 89};
    // Find max and sum
    
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {12, 45, 7, 23, 89};
    int maxVal = v[0];
    int sum = 0;
    for (int num : v) {
        if (num > maxVal) maxVal = num;
        sum += num;
    }
    cout << "Max: " << maxVal << " | Sum: " << sum << endl;
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Max: 89 | Sum: 176',
            description: 'Computes max 89 and sum 176',
          },
        ],
        hints: ['Iterate through vector using range-based loop.'],
        hintsMn: ['Вектороор давталт хийж max ба sum-ийг тооцоолно.'],
      },
    ],
    quiz: [
      {
        question: 'Which method dynamically appends a new element to the back of a std::vector?',
        questionMn: 'std::vector-ийн ард шинэ элемент нэмдэг функц аль нь вэ?',
        options: ['push_back()', 'append()', 'add()', 'insert_back()'],
        optionsMn: ['push_back()', 'append()', 'add()', 'insert_back()'],
        correctIndex: 0,
        explanation: 'vector.push_back(value) appends the value to the end of the dynamic array.',
        explanationMn: 'push_back() нь векторын төгсгөлд шинэ элементийг нэмдэг.',
      },
    ],
    xpReward: 90,
  },

  {
    id: 108,
    trackStage: 'INTERMEDIATE',
    stageTitle: 'Intermediate Mastery',
    stageTitleMn: 'Дунд шат: Массив, Стринг & Санах ой',
    title: 'Pointers, References & Memory Addresses',
    titleMn: 'Pointers, References ба Санах ойн хаяг',
    icon: '🎯',
    summary: 'Visually understand memory addresses (&), raw pointers (*), and references with zero fear.',
    summaryMn: 'Санах ойн хаяг (&), заагч (*) болон reference-ийг визуал диаграммаар ойлгох.',
    theory: `### What is a Pointer?
A pointer is simply a variable that stores a **memory address** (where another variable lives in RAM):
\`\`\`cpp
int x = 42;
int* ptr = &x; // ptr stores memory address of x (&x)
cout << *ptr;  // Dereference: prints 42
*ptr = 100;    // Changes x directly in RAM!
\`\`\`

### References vs Pointers
A reference (\`int& ref = x;\`) is an alias (nickname). It cannot be null and doesn't need \`*\` to dereference.`,
    theoryMn: `### Pointer (Заагч) гэж юу вэ?
Хувьсагч санах ойд (RAM) хаягтай байдаг.
Pointer бол уг хаягийг хадгалдаг хувьсагч юм:
- \`&\`: Хаяг авах оператор (Address-of)
- \`*\`: Заасан хаяг дахь утгыг авах оператор (Dereference)

Жишээ: \`*ptr = 100;\` гэж бичвэл уг хаягт буй хувьсагчийг шууд өөрчилнө.`,
    codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int gold = 50;
    int* p = &gold;
    *p = 100; // Directly updates gold in memory
    cout << "Gold: " << gold << endl;
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_pointer_deref',
        title: 'Pointer Modification',
        titleMn: 'Заагчаар утга өөрчлөх',
        difficulty: 'Medium',
        category: 'Pointers',
        description: 'Declare int score = 10. Create a pointer int* ptr = &score. Use *ptr to update score to 99 and print "Updated: 99".',
        descriptionMn: 'score = 10 зарлаад, ptr заагчаар уг утгыг 99 болгон өөрчилж "Updated: 99" гэж хэвлэ.',
        starterCode: `#include <iostream>
using namespace std;

int main() {
    int score = 10;
    // Create pointer and update via *ptr
    
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

int main() {
    int score = 10;
    int* ptr = &score;
    *ptr = 99;
    cout << "Updated: " << score << endl;
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Updated: 99',
            description: 'Score is modified to 99 via pointer dereference',
          },
        ],
        hints: ['int* ptr = &score;', '*ptr = 99;'],
        hintsMn: ['int* ptr = &score; гэж заагч үүсгэнэ.', '*ptr = 99; гэж утгыг өөрчилнө.'],
      },
    ],
    quiz: [
      {
        question: 'Which operator retrieves the memory address of an existing variable?',
        questionMn: 'Хувьсагчийн RAM санах ойн хаягийг авдаг оператор аль нь вэ?',
        options: ['& (Address-of)', '* (Dereference)', '-> (Arrow)', '# (Hash)'],
        optionsMn: ['& (Address-of)', '* (Dereference)', '-> (Arrow)', '# (Hash)'],
        correctIndex: 0,
        explanation: '&x gives the memory address where variable x is located in RAM.',
        explanationMn: '& тэмдэгт нь хувьсагчийн санах ойн хаягийг буцаадаг.',
      },
    ],
    xpReward: 95,
    hasVisualizer: 'pointer',
  },

  {
    id: 109,
    trackStage: 'INTERMEDIATE',
    stageTitle: 'Intermediate Mastery',
    stageTitleMn: 'Дунд шат: Массив, Стринг & Санах ой',
    title: 'Stack vs Heap & Modern RAII',
    titleMn: 'Stack vs Heap санах ой ба RAII зарчим',
    icon: '🧠',
    summary: 'Demystify Stack vs Heap memory and understand smart pointers (std::unique_ptr) with zero memory leaks.',
    summaryMn: 'Stack ба Heap санах ойн ялгаа болон memory leak-ээс хамгаалах smart pointers (unique_ptr).',
    theory: `### Stack vs Heap Memory
1. **Stack**: Ultra fast, automatic lifetime. Local variables exist here and vanish when the function returns.
2. **Heap**: Large, dynamic storage. In old C++, allocated with \`new\` and freed with \`delete\`.

### Modern C++: RAII & Smart Pointers
Raw \`new\` and \`delete\` easily cause leaks. Modern C++ uses \`std::unique_ptr\`:
\`\`\`cpp
#include <memory>
auto ptr = make_unique<int>(100);
// Automatically freed when ptr leaves scope! No delete needed!
\`\`\``,
    theoryMn: `### Stack vs Heap
- **Stack**: Функцийн доторх хувьсагчид үүсээд, функц дуусмагц автоматаар устана (маш хурдан).
- **Heap**: Хэмжээ ихтэй өгөгдлийг динамикаар хуваарилна.

### Modern C++ RAII:
Хуучин \`new\` ба \`delete\` ашиглахын оронд \`std::unique_ptr\` ашигладаг. Энэ нь цар хүрээнээс гарахад санах ойг автоматаар устгаж, memory leak-ээс бүрэн хамгаална.`,
    codeSnippet: `#include <iostream>
#include <memory>
using namespace std;

int main() {
    auto val = make_unique<int>(250);
    cout << "Heap Value: " << *val << endl;
    // Automatically cleaned up here safely!
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_prime_checker',
        title: 'Prime Number Checker',
        titleMn: 'Анхны тоо шалгагч',
        difficulty: 'Medium',
        category: 'Algorithms',
        description: 'Given n = 29, check if it is prime. Output "Prime: Yes" or "Prime: No".',
        descriptionMn: 'n = 29 тоо өгөгдсөн бол анхны тоо мөн эсэхийг шалгаж "Prime: Yes" гэж хэвлэ.',
        starterCode: `#include <iostream>
using namespace std;

int main() {
    int n = 29;
    // Check if n is prime
    
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

int main() {
    int n = 29;
    bool isPrime = (n > 1);
    for (int i = 2; i * i <= n; ++i) {
        if (n % i == 0) {
            isPrime = false;
            break;
        }
    }
    cout << "Prime: " << (isPrime ? "Yes" : "No") << endl;
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Prime: Yes',
            description: 'Identifies 29 as prime',
          },
        ],
        hints: ['Check divisibility up to square root of n: i * i <= n.'],
        hintsMn: ['i * i <= n хүртэл хуваагдах эсэхийг шалгана.'],
      },
    ],
    quiz: [
      {
        question: 'What is the primary benefit of std::unique_ptr over raw pointers?',
        questionMn: 'std::unique_ptr-ийн энгийн raw pointer-оос ялгарах гол давуу тал юу вэ?',
        options: [
          'It automatically deallocates memory when out of scope, preventing memory leaks',
          'It doubles CPU clock speed',
          'It can only store prime numbers',
          'It disables the compiler',
        ],
        optionsMn: [
          'Цар хүрээнээс гарахад санах ойг автоматаар чөлөөлж memory leak-ээс сэргийлдэг',
          'CPU-ийн хурдыг 2 дахин өсгөдөг',
          'Зөвхөн анхны тоо хадгалдаг',
          'Компиляторыг унтраадаг',
        ],
        correctIndex: 0,
        explanation: 'unique_ptr guarantees automatic deterministic cleanup via RAII without manual delete.',
        explanationMn: 'unique_ptr нь RAII зарчмаар санах ойг автоматаар чөлөөлдөг.',
      },
    ],
    xpReward: 95,
    hasVisualizer: 'memory',
  },

  // -----------------------------------------------------------------------
  // STAGE 3: ADVANCED (OOP & TEMPLATES) (110 - 114)
  // -----------------------------------------------------------------------
  {
    id: 110,
    trackStage: 'ADVANCED',
    stageTitle: 'Advanced Architecture',
    stageTitleMn: 'Гүнзгий шат: Объект Хандалтат & Templates',
    title: 'OOP: Classes, Objects & Encapsulation',
    titleMn: 'ОХП: Класс, Объект ба Хамгаалалт (Encapsulation)',
    icon: '🏛️',
    summary: 'Construct robust classes with private member variables, public getters/setters, and constructors.',
    summaryMn: 'Класс, байгуулагч (constructor), private хамгаалагдсан хувьсагчид болон public аргуудыг бүтээх.',
    theory: `### Object-Oriented Principles
Classes bind data attributes and member methods into a cohesive unit:
\`\`\`cpp
class Student {
private:
    string name;
    int xp;
public:
    // Constructor
    Student(string n, int x) : name(n), xp(x) {}

    void addXp(int amount) { xp += amount; }
    int getXp() const { return xp; }
};
\`\`\`

### Access Modifiers
- \`private\`: Accessible only within the class (Encapsulation).
- \`public\`: Accessible from external calling code.`,
    theoryMn: `### Класс ба Хамгаалалт
- \`private\`: Зөвхөн тухайн классын дотор хандах боломжтой (өгөгдлийг хамгаална).
- \`public\`: Гаднаас дуудаж ажиллуулах аргууд (функцүүд).
- **Constructor**: Объект анх үүсэхэд хувьсагчдыг зөв утгаар эхлүүлнэ.`,
    codeSnippet: `#include <iostream>
#include <string>
using namespace std;

class Robot {
private:
    string model;
    int battery;
public:
    Robot(string m, int b) : model(m), battery(b) {}
    void recharge() { battery = 100; }
    int getBattery() const { return battery; }
};

int main() {
    Robot bot("CyberBot-X", 40);
    bot.recharge();
    cout << "Battery: " << bot.getBattery() << "%" << endl;
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_class_account',
        title: 'Bank Account Simulator',
        titleMn: 'Банкны дансны класс',
        difficulty: 'Medium',
        category: 'Classes',
        description: 'Create an Account class with private int balance initialized to 200. Implement deposit(int) and getBalance(). Deposit 150 and print "Balance: $350".',
        descriptionMn: 'balance = 200 анхны утгатай Account класс үүсгэж, deposit(150) хийн "Balance: $350" гэж хэвлэ.',
        starterCode: `#include <iostream>
using namespace std;

// Define Account class here

int main() {
    // Instantiate, deposit 150, output Balance: $350
    
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

class Account {
private:
    int balance;
public:
    Account(int initial) : balance(initial) {}
    void deposit(int amt) { balance += amt; }
    int getBalance() const { return balance; }
};

int main() {
    Account acc(200);
    acc.deposit(150);
    cout << "Balance: $" << acc.getBalance() << endl;
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Balance: $350',
            description: 'Computes correct balance after deposit',
          },
        ],
        hints: ['Keep balance private and provide public deposit and getBalance methods.'],
        hintsMn: ['balance-ийг private болгож, deposit болон getBalance-ийг public болгоно.'],
      },
    ],
    quiz: [
      {
        question: 'Why should member variables like account balance be kept private?',
        questionMn: 'Яагаад balance зэрэг өгөгдлийг private байлгах ёстой вэ?',
        options: [
          'To enforce encapsulation and prevent unauthorized modifications',
          'To make the code compile 10x faster',
          'Because C++ does not allow public variables',
          'To hide code from the CPU',
        ],
        optionsMn: [
          'Encapsulation зарчмаар хамгаалж, гаднаас дур мэдэн буруу өөрчлөхөөс сэргийлэх',
          '10 дахин хурдан компиляци хийхийн тулд',
          'C++-д public хувьсагч зөвшөөрдөггүй тул',
          'Кодыг CPU-ээс нуухын тулд',
        ],
        correctIndex: 0,
        explanation: 'Encapsulation shields private internal state from invalid external mutations.',
        explanationMn: 'Encapsulation нь дотоод өгөгдлийг гаднаас хууль бусаар өөрчлөхөөс хамгаалдаг.',
      },
    ],
    xpReward: 100,
  },

  {
    id: 111,
    trackStage: 'ADVANCED',
    stageTitle: 'Advanced Architecture',
    stageTitleMn: 'Гүнзгий шат: Объект Хандалтат & Templates',
    title: 'Inheritance, Polymorphism & Virtual Functions',
    titleMn: 'Удамшил (Inheritance) ба Полиморфизм (Virtual Functions)',
    icon: '🧬',
    summary: 'Design base and derived classes with virtual functions, override, and dynamic dispatch.',
    summaryMn: 'Суурь класс, удамшсан класс, virtual функц ба динамик полиморфизм бүтээх.',
    theory: `### Inheritance
Derived classes inherit fields and methods from a base class:
\`\`\`cpp
class Entity {
public:
    virtual void attack() { cout << "Basic Strike" << endl; }
};

class CyberKnight : public Entity {
public:
    void attack() override { cout << "Plasma Blade!" << endl; }
};
\`\`\`

### Virtual Functions & Dynamic Polymorphism
The \`virtual\` keyword instructs C++ to resolve method calls at runtime using a Virtual Table (vtable) based on the actual object type.`,
    theoryMn: `### Удамшил ба Полиморфизм
- **Inheritance (Удамшил)**: Нэг класс нөгөө классынхаа шинж чанарыг өвлөн авах.
- **Virtual Function**: Суурь классын функцийг дэд класс дээрээ өөрийнхөөрөө дахин тодорхойлох (\`override\`). Ингэснээр ажиллах явцад зөв функц автоматаар дуудагддаг.`,
    codeSnippet: `#include <iostream>
using namespace std;

class Hero {
public:
    virtual void speak() { cout << "I am a Cadet." << endl; }
};

class Master : public Hero {
public:
    void speak() override { cout << "I am a Cyber Master!" << endl; }
};

int main() {
    Hero* h = new Master();
    h->speak();
    delete h;
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_inheritance',
        title: 'Hero & Mage Inheritance',
        titleMn: 'Баатрын удамшил',
        difficulty: 'Hard',
        category: 'Classes',
        description: 'Create base class Character with virtual void act() printing "Moving". Derive Mage and override act() to print "Casting Spell". In main, call Mage act().',
        descriptionMn: 'Character суурь класс үүсгэж, Mage дэд классд act() функцийг override хийн "Casting Spell" гэж хэвлэ.',
        starterCode: `#include <iostream>
using namespace std;

// Base class and derived class

int main() {
    // Instantiate Mage and call act()
    
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

class Character {
public:
    virtual void act() { cout << "Moving" << endl; }
};

class Mage : public Character {
public:
    void act() override { cout << "Casting Spell" << endl; }
};

int main() {
    Mage mage;
    mage.act();
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Casting Spell',
            description: 'Mage overrides base class act() method',
          },
        ],
        hints: ['Use public inheritance: class Mage : public Character'],
        hintsMn: ['class Mage : public Character гэж удамшуулна.'],
      },
    ],
    quiz: [
      {
        question: 'What is the purpose of the virtual keyword in C++?',
        questionMn: 'C++-д virtual түлхүүр үгийн үндсэн зорилго юу вэ?',
        options: [
          'To enable runtime dynamic polymorphism via virtual table dispatch',
          'To make functions run inside virtual reality headsets',
          'To compress the code size',
          'To prevent functions from being called',
        ],
        optionsMn: [
          'Runtime полиморфизмыг дэмжиж, обьектын төрлийн дагуу зөв функцийг динамикаар дуудах',
          'VR төхөөрөмж дээр ажиллуулах',
          'Кодын хэмжээг шахах',
          'Функц дуудагдахаас сэргийлэх',
        ],
        correctIndex: 0,
        explanation: 'Virtual functions ensure the correct derived override is called even through a base pointer.',
        explanationMn: 'Суурь заагчаар дамжуулан дуудахад ч дэд классын зөв функцийг дуудах боломж олгодог.',
      },
    ],
    xpReward: 110,
  },

  {
    id: 112,
    trackStage: 'ADVANCED',
    stageTitle: 'Advanced Architecture',
    stageTitleMn: 'Гүнзгий шат: Объект Хандалтат & Templates',
    title: 'Templates & Generic Programming',
    titleMn: 'Templates: Ерөнхий програмчлал ба STL Алгоритмууд',
    icon: '🔮',
    summary: 'Write type-independent code using function templates, class templates, and STL algorithms (std::sort).',
    summaryMn: 'Төрлөөс хамаарахгүй ерөнхий функц (templates) ба STL эрэмбэлэх алгоритмууд.',
    theory: `### What are Templates?
Templates enable writing code that works with ANY data type without code duplication:
\`\`\`cpp
template <typename T>
T getMaximum(T a, T b) {
    return (a > b) ? a : b;
}
\`\`\`
The compiler stamps out concrete versions for \`int\`, \`double\`, \`string\`, etc., at compile-time with zero runtime overhead!`,
    theoryMn: `### Templates гэж юу вэ?
Templates нь дурын өгөгдлийн төрөл (int, double, string)-тэй ажиллах нэг загвар функц эсвэл класс бичих боломж олгодог.
Компилятор нь тухайн төрөлд зориулсан хувилбарыг компиляцийн үед автоматаар бүтээдэг.`,
    codeSnippet: `#include <iostream>
#include <algorithm>
#include <vector>
using namespace std;

template <typename T>
T myMax(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    cout << "Max Int: " << myMax(10, 25) << endl;
    cout << "Max Double: " << myMax(3.14, 2.71) << endl;
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_sort_numbers',
        title: 'Sorting Numbers',
        titleMn: 'Тоонуудыг эрэмбэлэх',
        difficulty: 'Medium',
        category: 'Algorithms',
        description: 'Using vector<int> v = {42, 12, 88, 3, 25}, sort it in ascending order using std::sort and print the first and last element: "Min: 3 | Max: 88".',
        descriptionMn: 'v = {42, 12, 88, 3, 25} векторыг std::sort ашиглан эрэмбэлээд "Min: 3 | Max: 88" гэж хэвлэ.',
        starterCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {42, 12, 88, 3, 25};
    // Sort and print Min: 3 | Max: 88
    
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {42, 12, 88, 3, 25};
    sort(v.begin(), v.end());
    cout << "Min: " << v.front() << " | Max: " << v.back() << endl;
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Min: 3 | Max: 88',
            description: 'Sorts vector and retrieves min/max',
          },
        ],
        hints: ['Call sort(v.begin(), v.end()); then v.front() and v.back().'],
        hintsMn: ['sort(v.begin(), v.end()); хийгээд v.front() болон v.back()-ийг авна.'],
      },
    ],
    quiz: [
      {
        question: 'When does C++ instantiate template functions?',
        questionMn: 'C++ хэзээ template функцийн бодит хувилбарыг үүсгэдэг вэ?',
        options: [
          'At compile time (Zero runtime overhead)',
          'Only when user clicks a button',
          'At server startup',
          'Never',
        ],
        optionsMn: [
          'Компиляцийн үед (Compile-time, хурдад огт саадгүй)',
          'Хэрэглэгч товч дарах үед',
          'Сервер асах үед',
          'Хэзээ ч үүсгэдэггүй',
        ],
        correctIndex: 0,
        explanation: 'Templates are compile-time code generators with zero runtime penalty.',
        explanationMn: 'Templates нь компиляцийн үед ажилладаг тул ажиллах хурдыг огт удаашруулдаггүй.',
      },
    ],
    xpReward: 110,
  },

  // -----------------------------------------------------------------------
  // STAGE 4: REAL PROJECTS (113 - 114)
  // -----------------------------------------------------------------------
  {
    id: 113,
    trackStage: 'PROJECTS',
    stageTitle: 'Production Projects',
    stageTitleMn: 'Төслүүд: Бодит бүтэцтэй системүүд',
    title: 'Professional C++ Project Architecture',
    titleMn: 'Мэргэжлийн C++ Төслийн Бүтэц (.h, .cpp, Build)',
    icon: '📁',
    summary: 'Learn industry directory structure: include/, src/main.cpp, header guards (#pragma once), and compilation.',
    summaryMn: 'Бодит төслийн бүтэц: include/, src/, #pragma once толгой файл ба олон файлт компиляци.',
    theory: `### Professional C++ Directory Layout
\`\`\`text
project/
├── CMakeLists.txt
├── README.md
├── include/
│   └── BankAccount.h
├── src/
│   ├── BankAccount.cpp
│   └── main.cpp
└── tests/
    └── test_main.cpp
\`\`\`

### Header Files (.h / .hpp) vs Implementation (.cpp)
- **Header**: Declares class interfaces, function signatures, and \`#pragma once\` guards.
- **Implementation (.cpp)**: Contains the actual definition logic.
- **Linker**: Glues compiled object files into the final executable.`,
    theoryMn: `### Мэргэжлийн C++ Төслийн Бүтэц
- **include/**: .h толгой файлууд (функц, классын загвар).
- **src/**: .cpp файлууд (бодит код, логик).
- **#pragma once**: Толгой файл олон дахин дуудагдахаас сэргийлдэг хамгаалалт.`,
    codeSnippet: `#include <iostream>
using namespace std;

// Header representation:
class Logger {
public:
    static void log(const string& msg) {
        cout << "[CYBER-LOG] " << msg << endl;
    }
};

int main() {
    Logger::log("System boot sequence initialized.");
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_project_logger',
        title: 'Modular Logger Project',
        titleMn: 'Модульчлагдсан Логгер төсөл',
        difficulty: 'Medium',
        category: 'Projects',
        description: 'Implement a static Logger class with method log(string msg) that prefixes "[SYSTEM] " and output "[SYSTEM] Ready".',
        descriptionMn: 'log(msg) функцтэй Logger класс үүсгэж "[SYSTEM] Ready" гэж хэвлэ.',
        starterCode: `#include <iostream>
#include <string>
using namespace std;

// Implement Logger class

int main() {
    // Call Logger::log("Ready")
    
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <string>
using namespace std;

class Logger {
public:
    static void log(const string& msg) {
        cout << "[SYSTEM] " << msg << endl;
    }
};

int main() {
    Logger::log("Ready");
    return 0;
}`,
        testCases: [
          {
            expectedOutput: '[SYSTEM] Ready',
            description: 'Logger prefixes [SYSTEM]',
          },
        ],
        hints: ['Use static void log(const string& msg) { cout << "[SYSTEM] " << msg << endl; }'],
        hintsMn: ['static функц тодорхойлж cout << "[SYSTEM] " << msg << endl; гэж бичнэ.'],
      },
    ],
    quiz: [
      {
        question: 'What is the purpose of `#pragma once` in a C++ header file?',
        questionMn: 'C++ толгой файлын эхэнд `#pragma once` бичдэгийн зорилго юу вэ?',
        options: [
          'To prevent the header file from being included multiple times during compilation',
          'To execute the program only once',
          'To delete the file after compiling',
          'To disable comments',
        ],
        optionsMn: [
          'Компиляцийн үед тухайн толгой файл олон дахин дуудагдаж давхардахаас сэргийлэх',
          'Програмыг зөвхөн ганц удаа ажиллуулахын тулд',
          'Компиляци дуусмагц файлыг устгах',
          'Тайлбаруудыг унтраах',
        ],
        correctIndex: 0,
        explanation: '#pragma once ensures the preprocessor includes the header contents only once per translation unit.',
        explanationMn: '#pragma once нь компилятор файлын агуулгыг давхардуулан оруулахаас сэргийлдэг.',
      },
    ],
    xpReward: 120,
  },

  // -----------------------------------------------------------------------
  // STAGE 5: ALGORITHMS (114)
  // -----------------------------------------------------------------------
  {
    id: 114,
    trackStage: 'ALGORITHMS',
    stageTitle: 'Algorithms & Complexity',
    stageTitleMn: 'Алгоритм: Хоёртын хайлт ба Big-O',
    title: 'Binary Search & Big-O Time Complexity',
    titleMn: 'Хоёртын хайлт (Binary Search) ба O(log N)',
    icon: '🔮',
    summary: 'Implement logarithmic divide-and-conquer search O(log N) compared against linear O(N) scans.',
    summaryMn: 'Хувааж шийдвэрлэх зарчимтай, O(log N) хурдтай Хоёртын хайлт алгоритмыг хэрэгжүүлэх.',
    theory: `### Binary Search: O(log N) Speed
On a sorted list of 1,000,000 items:
- Linear search requires up to 1,000,000 steps.
- Binary search inspects the midpoint and discards half the array: requires at most **20 steps**!

\`\`\`cpp
int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // Not found
}
\`\`\``,
    theoryMn: `### Хоёртын хайлт (Binary Search)
Эрэмбэлэгдсэн массив дээр 1,000,000 элемент байхад:
- Энгийн шугаман хайлт хамгийн ихдээ 1,000,000 алхам хийнэ.
- Хоёртын хайлт голын элементтэй харьцуулж талыг нь хаядаг тул ердөө **20 алхамд** олно!`,
    codeSnippet: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int target = 23;
    int low = 0, high = arr.size() - 1, foundIdx = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) { foundIdx = mid; break; }
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    cout << "Index: " << foundIdx << endl;
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_binary_search',
        title: 'Binary Search Implementation',
        titleMn: 'Хоёртын хайлт хэрэгжүүлэх',
        difficulty: 'Hard',
        category: 'Algorithms',
        description: 'Given sorted vector<int> arr = {3, 9, 14, 27, 35, 49, 62, 88}, find the index of target = 35. Output "Found at index: 4".',
        descriptionMn: 'arr = {3, 9, 14, 27, 35, 49, 62, 88} массиваас 35-ыг хайж "Found at index: 4" гэж хэвлэ.',
        starterCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> arr = {3, 9, 14, 27, 35, 49, 62, 88};
    int target = 35;
    // Implement binary search
    
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> arr = {3, 9, 14, 27, 35, 49, 62, 88};
    int target = 35;
    int low = 0, high = arr.size() - 1;
    int ans = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            ans = mid;
            break;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    cout << "Found at index: " << ans << endl;
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Found at index: 4',
            description: 'Finds element 35 at index 4',
          },
        ],
        hints: ['Use while (low <= high) and calculate mid = low + (high - low) / 2.'],
        hintsMn: ['low <= high нөхцөлтэй давталт ашиглан mid-ийг тооцоолно.'],
      },
    ],
    quiz: [
      {
        question: 'What prerequisite is required before Binary Search can be performed on an array?',
        questionMn: 'Хоёртын хайлт хийхийн тулд массив заавал ямар байх ёстой вэ?',
        options: [
          'The array must be sorted in order',
          'The array must contain only odd numbers',
          'The array must have fewer than 10 items',
          'The array must be allocated on the heap',
        ],
        optionsMn: [
          'Массив заавал эрэмбэлэгдсэн (sorted) байх ёстой',
          'Зөвхөн сондгой тоонууд байх ёстой',
          '10-аас бага элементтэй байх ёстой',
          'Зөвхөн heap дээр үүссэн байх ёстой',
        ],
        correctIndex: 0,
        explanation: 'Binary Search relies on comparing against the midpoint, which only cuts the search space if the data is sorted.',
        explanationMn: 'Өгөгдөл эрэмбэлэгдсэн үед л голын элементээр талыг нь хаяж чаддаг.',
      },
    ],
    xpReward: 120,
    hasVisualizer: 'algorithm',
  },

  // -----------------------------------------------------------------------
  // STAGE 6: PROBLEM SOLVING (115)
  // -----------------------------------------------------------------------
  {
    id: 115,
    trackStage: 'PROBLEM_SOLVING',
    stageTitle: 'Competitive Problem Solving',
    stageTitleMn: 'Бодлого бодолт: Олимпиад & Ярилцлагын даалгавар',
    title: 'Two Sum & Efficient Hash Lookups',
    titleMn: 'Хоёр тооны нийлбэр (Two Sum) ба Оновчлол',
    icon: '⚡',
    summary: 'Solve the famous Two Sum problem using optimal O(N) lookup logic instead of naive O(N^2) brute force.',
    summaryMn: 'О(N^2) удаан аргын оронд O(N) оновчлол ашиглан Two Sum бодлогыг шийдвэрлэх.',
    theory: `### The Two Sum Problem
Given an array and target sum, find two distinct indices that add up to the target.
- Brute Force: Two nested loops -> \`O(N^2)\`
- Optimal Hash / Traversal: One pass -> \`O(N)\``,
    theoryMn: `### Two Sum бодлого
Өгөгдсөн массив ба нийлбэр (target)-ийн хувьд нийлбэр нь уг тоотой тэнцэх хоёр индексийг олох бодлого.
Давхар давталтаар O(N^2) хийхийн оронд оновчтой O(N) аргаар шийдэх нь мэргэжлийн инженер хүний чадвар юм.`,
    codeSnippet: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    // Indices 0 and 1 (2 + 7 = 9)
    for (int i = 0; i < nums.size(); ++i) {
        for (int j = i + 1; j < nums.size(); ++j) {
            if (nums[i] + nums[j] == target) {
                cout << "Pair: " << i << ", " << j << endl;
                return 0;
            }
        }
    }
    return 0;
}`,
    exercises: [
      {
        id: 'cpp_ex_two_sum',
        title: 'Two Sum Solver',
        titleMn: 'Two Sum бодлого',
        difficulty: 'Challenge',
        category: 'Problem Solving',
        description: 'Given vector<int> nums = {3, 2, 4} and target = 6, find the indices that sum to 6. Output "Pair: 1, 2".',
        descriptionMn: 'nums = {3, 2, 4} ба target = 6 үед нийлбэр нь 6 болох индексүүдийг олж "Pair: 1, 2" гэж хэвлэ.',
        starterCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {3, 2, 4};
    int target = 6;
    // Find pair that sums to target
    
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {3, 2, 4};
    int target = 6;
    for (int i = 0; i < nums.size(); ++i) {
        for (int j = i + 1; j < nums.size(); ++j) {
            if (nums[i] + nums[j] == target) {
                cout << "Pair: " << i << ", " << j << endl;
                return 0;
            }
        }
    }
    return 0;
}`,
        testCases: [
          {
            expectedOutput: 'Pair: 1, 2',
            description: 'Finds indices 1 and 2 summing to 6',
          },
        ],
        hints: ['Check every pair (i, j) where j > i.'],
        hintsMn: ['j > i байх (i, j) хосуудыг шалгана.'],
      },
    ],
    quiz: [
      {
        question: 'What is the time complexity of the nested two-loop approach for Two Sum?',
        questionMn: 'Хоёр давхар давталттай Two Sum аргын хугацааны нарийвчлал ямар байх вэ?',
        options: ['O(N^2)', 'O(1)', 'O(log N)', 'O(N!)'],
        optionsMn: ['O(N^2)', 'O(1)', 'O(log N)', 'O(N!)'],
        correctIndex: 0,
        explanation: 'Comparing every element with every other element generates N * (N - 1) / 2 steps, which is O(N^2).',
        explanationMn: 'Элемент бүрийг бусадтай харьцуулахад N * (N - 1) / 2 үйлдэл буюу O(N^2) хугацаа шаардагдана.',
      },
    ],
    xpReward: 150,
  },
];

// =========================================================================
// 2. COMPREHENSIVE C++ PROJECTS CATALOG (Beginner, Intermediate, Advanced)
// =========================================================================

export const CPP_PROJECTS_CATALOG: CppProject[] = [
  {
    id: 'proj_calculator',
    title: 'Console Scientific Calculator',
    titleMn: 'Консол Тооцоолуур',
    difficulty: 'Beginner',
    summary: 'A clean interactive CLI calculator supporting basic arithmetic, power, and square roots.',
    summaryMn: 'Үндсэн арифместик болон зэрэг, язгуур тооцоолох консол тооцоолуур.',
    fileTree: ['calculator/', '├── src/', '│   └── main.cpp', '└── README.md'],
    mainCode: `#include <iostream>
using namespace std;

int main() {
    char op = '+';
    double a = 15.5, b = 4.5;
    double result = 0;
    switch (op) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': result = (b != 0) ? a / b : 0; break;
    }
    cout << "Calculation: " << a << " " << op << " " << b << " = " << result << endl;
    return 0;
}`,
    explanation: 'Demonstrates modular switch conditionals, precision arithmetic, and safe division.',
    explanationMn: 'Switch нөхцөл, бутархай тооны арифместик болон 0-д хуваахаас сэргийлэх логик.',
  },
  {
    id: 'proj_bank_sim',
    title: 'Bank Account Simulator & Ledger',
    titleMn: 'Банкны Дансны Систем',
    difficulty: 'Intermediate',
    summary: 'Object-oriented banking engine with encapsulated balance, deposit/withdraw auditing, and ledger logging.',
    summaryMn: 'Encapsulation зарчмаар хамгаалагдсан, орлого/зарлагын түүх хөтлөх банкны систем.',
    fileTree: [
      'bank_system/',
      '├── include/',
      '│   └── Account.h',
      '├── src/',
      '│   ├── Account.cpp',
      '│   └── main.cpp',
      '└── README.md',
    ],
    mainCode: `#include <iostream>
#include <string>
using namespace std;

class BankAccount {
private:
    string owner;
    int balance;
public:
    BankAccount(string o, int initial) : owner(o), balance(initial) {}
    void deposit(int amt) { balance += amt; }
    bool withdraw(int amt) {
        if (amt <= balance) {
            balance -= amt;
            return true;
        }
        return false;
    }
    int getBalance() const { return balance; }
};

int main() {
    BankAccount acc("Orgil", 500);
    acc.deposit(200);
    acc.withdraw(150);
    cout << "Final Balance: $" << acc.getBalance() << endl;
    return 0;
}`,
    explanation: 'Enforces data encapsulation, validation rules, and member methods.',
    explanationMn: 'Өгөгдлийг хамгаалж, зөвшөөрөгдсөн аргаар гүйлгээ хийх загварчлал.',
  },
  {
    id: 'proj_console_rpg',
    title: 'Text-Based Cyber RPG Battle Engine',
    titleMn: 'Консол Кибер RPG Тоглоом',
    difficulty: 'Advanced',
    summary: 'Full polymorphism engine with Player and Enemy hierarchy, turn-based battle loop, and special abilities.',
    summaryMn: 'Удамшил, полиморфизм бүхий баатрууд болон дайснуудын ээлжит тулааны тоглоом.',
    fileTree: [
      'cyber_rpg/',
      '├── include/',
      '│   ├── Entity.h',
      '│   └── Warrior.h',
      '├── src/',
      '│   └── main.cpp',
      '└── README.md',
    ],
    mainCode: `#include <iostream>
using namespace std;

class Entity {
public:
    virtual void attack() = 0; // Pure virtual
};

class CyberKnight : public Entity {
public:
    void attack() override {
        cout << "[CYBER KNIGHT] Deals 45 Plasma Damage!" << endl;
    }
};

int main() {
    CyberKnight knight;
    knight.attack();
    return 0;
}`,
    explanation: 'Uses pure virtual abstract classes and dynamic dispatch.',
    explanationMn: 'Абстракт класс болон virtual функц ашигласан загвар.',
  },
];
