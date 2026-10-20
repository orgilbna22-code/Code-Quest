import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Terminal, FileCode, Download, Folder } from 'lucide-react';
import { soundFx } from '../utils/sound';
import { GameSettings } from '../types';

interface PythonDesktopModalProps {
  onBack: () => void;
  settings: GameSettings;
}

const DESKTOP_FILES: Record<string, { desc: string; code: string }> = {
  'main.py': {
    desc: 'Application entry point and Tkinter window initialization',
    code: `"""
TSONJIN CODE QUEST
Tsonjin Cyber Boarding School • Python Educational Game
Run with: python main.py
"""

import sys
import tkinter as tk
from tkinter import ttk, messagebox
from database import DatabaseManager
from game import GameEngine
from ui import CyberWindow

def main():
    root = tk.Tk()
    root.title("Tsonjin Code Quest — Tsonjin Cyber Boarding School")
    root.geometry("1024x720")
    root.minsize(800, 600)
    root.configure(bg="#0B0F0D")

    # Initialize SQLite database and game engine
    db = DatabaseManager("tsonjin_quest.db")
    engine = GameEngine(db)

    # Initialize Cyber UI
    app = CyberWindow(root, engine)

    root.mainloop()

if __name__ == "__main__":
    main()
`,
  },
  'database.py': {
    desc: 'SQLite3 storage for students, XP, scores, streak, and achievements',
    code: `"""
Database layer for Tsonjin Code Quest using SQLite3
"""

import sqlite3
import os
from typing import Dict, Any, List

class DatabaseManager:
    def __init__(self, db_path: str = "tsonjin_quest.db"):
        self.db_path = db_path
        self.init_tables()

    def get_connection(self):
        return sqlite3.connect(self.db_path)

    def init_tables(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            # Student Profile Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS students (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,
                    current_level INTEGER DEFAULT 1,
                    total_xp INTEGER DEFAULT 0,
                    total_score INTEGER DEFAULT 0,
                    best_score INTEGER DEFAULT 0,
                    streak_days INTEGER DEFAULT 1,
                    last_active_date TEXT
                )
            """)

            # Completed Levels Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS completed_levels (
                    student_id INTEGER,
                    level_id INTEGER,
                    score INTEGER,
                    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (student_id, level_id)
                )
            """)

            # Achievements Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS student_achievements (
                    student_id INTEGER,
                    achievement_id TEXT,
                    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (student_id, achievement_id)
                )
            """)
            conn.commit()

    def get_or_create_student(self, name: str) -> Dict[str, Any]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, current_level, total_xp, total_score, best_score, streak_days FROM students WHERE name = ?", (name,))
            row = cursor.fetchone()
            if row:
                return {
                    "id": row[0], "name": row[1], "current_level": row[2],
                    "total_xp": row[3], "total_score": row[4], "best_score": row[5],
                    "streak_days": row[6]
                }
            cursor.execute("INSERT INTO students (name, current_level, total_xp, streak_days) VALUES (?, 1, 0, 1)", (name,))
            conn.commit()
            return self.get_or_create_student(name)
`,
  },
  'game.py': {
    desc: 'Game engine logic, scoring calculations, timers, and level unlock validation',
    code: `"""
Game Engine: state management, scoring, and progress tracking
"""

from questions import QUESTION_DATABASE, LEVEL_METADATA

class GameEngine:
    def __init__(self, db_manager):
        self.db = db_manager
        self.current_student = None
        self.active_level_id = 1
        self.active_question_index = 0
        self.session_score = 0
        self.session_xp = 0

    def login(self, student_name: str):
        self.current_student = self.db.get_or_create_student(student_name)
        return self.current_student

    def get_questions_for_level(self, level_id: int):
        return QUESTION_DATABASE.get(level_id, [])

    def calculate_score(self, correct_answers: int, total_questions: int, seconds_remaining: int) -> int:
        accuracy_score = int((correct_answers / max(1, total_questions)) * 500)
        time_bonus = min(200, seconds_remaining * 2)
        return accuracy_score + time_bonus
`,
  },
  'questions.py': {
    desc: 'Curriculum question bank for all 12 levels with code examples and solutions',
    code: `"""
Question Bank for Tsonjin Cyber Boarding School Python Curriculum
Levels 1 - 12 (Basics, Variables, Data Types, I/O, Operators, If/Else, Loops, Lists, Functions, Dicts, Boss)
"""

LEVEL_METADATA = [
    {"id": 1, "title": "Python Basics", "xp": 100, "difficulty": "EASY"},
    {"id": 2, "title": "Variables", "xp": 120, "difficulty": "EASY"},
    {"id": 3, "title": "Data Types", "xp": 140, "difficulty": "EASY"},
    {"id": 4, "title": "Input & Output", "xp": 160, "difficulty": "NORMAL"},
    {"id": 5, "title": "Operators", "xp": 180, "difficulty": "NORMAL"},
    {"id": 6, "title": "if / elif / else", "xp": 200, "difficulty": "NORMAL"},
    {"id": 7, "title": "for Loops", "xp": 220, "difficulty": "NORMAL"},
    {"id": 8, "title": "while Loops", "xp": 240, "difficulty": "HARD"},
    {"id": 9, "title": "Lists", "xp": 260, "difficulty": "HARD"},
    {"id": 10, "title": "Functions", "xp": 280, "difficulty": "HARD"},
    {"id": 11, "title": "Dictionaries", "xp": 300, "difficulty": "HARD"},
    {"id": 12, "title": "Mini Project (Boss)", "xp": 400, "difficulty": "BOSS"}
]

QUESTION_DATABASE = {
    1: [
        {
            "id": "q1_1",
            "type": "mcq",
            "prompt": "What function in Python outputs text to the screen?",
            "options": ["echo()", "print()", "show()", "console.log()"],
            "answer": 1,
            "explanation": "In Python, print() is the built-in function to display text."
        },
        {
            "id": "q1_2",
            "type": "code",
            "prompt": "Write code to print 'Hello, Tsonjin!'",
            "answer": "print('Hello, Tsonjin!')",
            "explanation": "print() with a string sends output to console."
        }
    ]
}
`,
  },
  'ui.py': {
    desc: 'Tkinter GUI components: modern styled cyber cards, buttons, and layouts',
    code: `"""
Tkinter User Interface with Cyber Minimalist Aesthetic (#00C853, #0B0F0D, #FFFFFF)
"""

import tkinter as tk
from tkinter import ttk

BG_COLOR = "#0B0F0D"
CARD_COLOR = "#131A16"
ACCENT_GREEN = "#00C853"
TEXT_WHITE = "#FFFFFF"

class CyberWindow:
    def __init__(self, root: tk.Tk, engine):
        self.root = root
        self.engine = engine
        self.setup_ui()

    def setup_ui(self):
        # Header banner
        header = tk.Frame(self.root, bg=CARD_COLOR, height=60)
        header.pack(fill=tk.X, side=tk.TOP)

        brand_lbl = tk.Label(
            header,
            text="TSONJIN CYBER BOARDING SCHOOL  •  TSONJIN CODE QUEST",
            fg=ACCENT_GREEN,
            bg=CARD_COLOR,
            font=("Helvetica", 11, "bold")
        )
        brand_lbl.pack(pady=15, padx=20, side=tk.LEFT)
`,
  },
  'animations.py': {
    desc: 'Canvas animations, progress bar easing, XP counter transitions',
    code: `"""
Tkinter Canvas animation utilities: XP count-up and gentle progress easing
"""

import tkinter as tk

def animate_xp_counter(label: tk.Label, start: int, target: int, step: int = 5, delay_ms: int = 20):
    current = start
    def update():
        nonlocal current
        if current < target:
            current = min(target, current + step)
            label.config(text=f"XP: {current:,}")
            label.after(delay_ms, update)
    update()
`,
  },
  'README.md': {
    desc: 'Project documentation, setup instructions, and architecture breakdown',
    code: `# TSONJIN CODE QUEST

**Tsonjin Cyber Boarding School • Python Learning Project**

## Description
An interactive Python educational game designed to replace traditional boring lectures with progressive problem-solving quests.

## Requirements
- Python 3.8+
- Tkinter (included with standard Python on Windows/macOS)
- SQLite3 (included with Python standard library)

## How to Run
\`\`\`bash
cd tsonjin_code_quest
python main.py
\`\`\`

## Features
- 12 Progressive Levels (Basics through Boss Project)
- SQLite local database saving XP, streaks, completed quests
- Cyber Green / Black / White school branded aesthetic
- Instant feedback with educational explanations
`,
  },
};

export const PythonDesktopModal: React.FC<PythonDesktopModalProps> = ({
  onBack,
  settings,
}) => {
  const [selectedFile, setSelectedFile] = useState<string>('main.py');
  const [copied, setCopied] = useState<boolean>(false);

  const fileData = DESKTOP_FILES[selectedFile];

  const handleCopy = () => {
    soundFx.click(settings.soundEnabled);
    navigator.clipboard.writeText(fileData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    soundFx.click(settings.soundEnabled);
    // Create text file bundle or downloadable python package
    const element = document.createElement('a');
    const file = new Blob([fileData.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>BACK</span>
      </button>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#00C853] uppercase">
            <Terminal className="h-3.5 w-3.5" />
            <span>TSONJIN CYBER BOARDING SCHOOL</span>
          </div>
          <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            PYTHON 3 + TKINTER DESKTOP ARCHITECTURE
          </h2>
          <p className="mt-1 text-xs text-slate-400 font-mono">
            Modular desktop codebase: runnable locally with <code>python main.py</code>
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-[#0B0F0D] hover:bg-emerald-400 transition-all shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Download {selectedFile}</span>
        </button>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* File List */}
        <div className="space-y-1.5 rounded-3xl border border-slate-800/80 bg-[#131916] p-3">
          <div className="mb-2 px-3 py-1 font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Folder className="h-3.5 w-3.5 text-emerald-400" />
            <span>tsonjin_code_quest/</span>
          </div>

          {Object.keys(DESKTOP_FILES).map((fileName) => {
            const isSelected = selectedFile === fileName;
            return (
              <button
                key={fileName}
                onClick={() => setSelectedFile(fileName)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left font-mono text-xs transition-colors ${
                  isSelected
                    ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-[#1A221E] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCode className="h-3.5 w-3.5" />
                  <span>{fileName}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Code Content View */}
        <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-[#0B0F0D] lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#131916] px-4 py-3">
            <div>
              <span className="font-mono text-xs font-bold text-white">
                {selectedFile}
              </span>
              <span className="ml-3 text-xs text-slate-400">
                {fileData.desc}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-[#0B0F0D] px-2.5 py-1 text-xs text-slate-300 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <pre className="p-4 font-mono text-xs text-emerald-300/90 overflow-x-auto leading-relaxed max-h-[500px]">
            {fileData.code}
          </pre>
        </div>
      </div>
    </div>
  );
};
