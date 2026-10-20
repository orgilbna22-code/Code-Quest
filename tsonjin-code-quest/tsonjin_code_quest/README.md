# TSONJIN CODE QUEST
**Tsonjin Cyber Boarding School • Python Learning Project**

> “Learn Python. Solve Problems. Level Up.”

---

## 1. Project Overview
**Tsonjin Code Quest** is an educational coding game designed specifically for students at **Tsonjin Cyber Boarding School**. It transforms standard programming lessons into an engaging series of progressive missions, coding puzzles, output predictions, and interactive boss battles.

The application features a minimalist, cyber-inspired visual identity built on the school's signature palette:
- **Primary Green:** `#00C853` (Highlights, XP, Success, Active States)
- **Deep Cyber Black:** `#0B0F0D` (Canvas, Surfaces)
- **Crisp White:** `#FFFFFF` (Headings, Clear Typography)

---

## 2. Key Features
- **12 Progressive Curriculum Levels:**
  - Level 1: Python Basics (`print()`, comments)
  - Level 2: Variables (naming, assignment, updates)
  - Level 3: Data Types (`str`, `int`, `float`, `bool`)
  - Level 4: Input & Output (`input()`, f-strings)
  - Level 5: Operators (arithmetic, comparison, boolean)
  - Level 6: Conditionals (`if` / `elif` / `else`)
  - Level 7: Loops (`for`, `range()`)
  - Level 8: While Loops (conditions, counters, `break`)
  - Level 9: Lists (indexing, `.append()`, `len()`)
  - Level 10: Functions (`def`, parameters, `return`)
  - Level 11: Dictionaries (key-value pairs)
  - Level 12: Mini Project (Final Cyber Pass Boss Challenge)
- **Diverse Question Formats:**
  1. Multiple Choice Questions (MCQ)
  2. True / False
  3. Find the Correct Code
  4. Find the Error (Debugging)
  5. Predict the Output
  6. Fill in the Blank
  7. Live Python Code Challenges
- **Educational Explanations:** Every question explains the underlying computer science reasoning—not just indicating right or wrong.
- **Complete XP & Score Engine:** Earn XP for correct solutions, accuracy multipliers, and speed bonuses.
- **SQLite Database Persistence:** Automatically stores student profiles, XP, best scores, completed levels, and streaks.
- **School Leaderboard:** Displays peer rankings for Tsonjin Cyber Boarding School students.
- **Dual Platform:**
  - Full React web application with in-browser Python runner, Web Audio sound effects, and bilingual English/Mongolian support.
  - Standalone desktop Python package utilizing Tkinter and SQLite3.

---

## 3. Project Structure
```text
tsonjin_code_quest/
│
├── main.py            # Desktop application entry point & Tkinter window setup
├── database.py        # SQLite3 schema, migrations, student persistence
├── game.py            # Game engine, level state machine, scoring, unlocks
├── questions.py       # Comprehensive 12-level question bank & explanations
├── ui.py              # Tkinter GUI cards, buttons, HUD, and layout
├── animations.py      # XP easing and visual shake feedback
├── assets/            # School logos, crest, icons
└── README.md          # Technical documentation
```

---

## 4. Requirements & Installation
### Requirements
- **Python 3.8+**
- **Tkinter** (included with standard Python on Windows and macOS; on Ubuntu/Debian Linux install via `sudo apt install python3-tk`)
- **SQLite3** (built into the Python standard library)

### How to Run Locally
```bash
# 1. Navigate to the project directory
cd tsonjin_code_quest

# 2. Launch the application
python main.py
```

---

## 5. How SQLite Works
The database is initialized in `database.py` with three core tables:
1. `students`: Stores `id`, `name`, `current_level`, `total_xp`, `total_score`, `best_score`, and `streak_days`.
2. `completed_levels`: Stores many-to-one records linking `student_id` to `level_id`, along with the student's highest score.
3. `student_achievements`: Records unlocked badge identifiers per student.

When a student finishes a quest, `record_level_completion()` executes an atomic transaction that updates the student's XP, unlocks the next level, and records completion timestamps.

---

## 6. How the Question System Works
Each level in `questions.py` contains:
- `concept`: A short, non-intimidating explanation of the topic.
- `example`: A clean Python code snippet.
- `questions`: A list of question dictionaries containing:
  - `type`: Question category (`mcq`, `predict`, `tf`, `code`).
  - `prompt`: The challenge text presented to the student.
  - `options`: List of selectable choices (for multiple-choice questions).
  - `answer`: The 0-indexed correct option or string solution.
  - `explanation`: The pedagogical reason explaining *why* the answer is correct.

---

## 7. How to Add New Levels or Questions
To add a new level, open `questions.py` and append an entry to `LEVELS_DATA`:

```python
{
    "id": 13,
    "title": "Object-Oriented Python",
    "subtitle": "Classes and Objects",
    "description": "Create cyber bot classes with attributes and methods.",
    "difficulty": "HARD",
    "xp": 350,
    "concept": "A class is a blueprint for creating objects.",
    "example": "class Cadet:\n    def __init__(self, name):\n        self.name = name",
    "questions": [
        {
            "id": "q13_1",
            "type": "mcq",
            "prompt": "What keyword defines a class in Python?",
            "options": ["class", "struct", "object", "type"],
            "answer": 0,
            "explanation": "The 'class' keyword creates a new class blueprint in Python."
        }
    ]
}
```

---

## 8. Future Improvements
- Cloud syncing with school Firestore or PostgreSQL backend.
- Multiplayer coding duels between Tsonjin students.
- Audio speech synthesis for code reading accessibility.
- Mongolian language audio narration.

---
*Created for Tsonjin Cyber Boarding School • Learn Python. Build Your Future.*
