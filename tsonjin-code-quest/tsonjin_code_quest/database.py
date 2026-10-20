"""
Database layer for Tsonjin Code Quest using SQLite3
Handles persistence for students, levels, scores, streak, and achievements.
"""

import sqlite3
import os
from datetime import datetime, date
from typing import Dict, Any, List, Optional

class DatabaseManager:
    def __init__(self, db_path: str = "tsonjin_quest.db"):
        self.db_path = db_path
        self.init_database()

    def get_connection(self) -> sqlite3.Connection:
        return sqlite3.connect(self.db_path)

    def init_database(self) -> None:
        """Create necessary tables if they do not exist."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Students table
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

            # Completed levels table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS completed_levels (
                    student_id INTEGER,
                    level_id INTEGER,
                    score INTEGER,
                    xp_earned INTEGER,
                    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (student_id, level_id),
                    FOREIGN KEY (student_id) REFERENCES students(id)
                )
            """)

            # Achievements table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS student_achievements (
                    student_id INTEGER,
                    achievement_id TEXT,
                    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (student_id, achievement_id),
                    FOREIGN KEY (student_id) REFERENCES students(id)
                )
            """)

            # Pre-seed leaderboard peers if empty
            cursor.execute("SELECT COUNT(*) FROM students")
            if cursor.fetchone()[0] == 0:
                sample_peers = [
                    ("Temuulen B.", 11, 2650, 4800, 950, 7),
                    ("Nomin E.", 10, 2320, 4100, 920, 5),
                    ("Anand G.", 9, 1980, 3500, 890, 4),
                    ("Khuslen M.", 8, 1750, 3100, 850, 3),
                    ("Enkhjin T.", 6, 1420, 2400, 810, 2),
                    ("Bilguun O.", 5, 1150, 1900, 780, 2),
                ]
                cursor.executemany("""
                    INSERT INTO students (name, current_level, total_xp, total_score, best_score, streak_days, last_active_date)
                    VALUES (?, ?, ?, ?, ?, ?, date('now'))
                """, sample_peers)

            conn.commit()

    def get_or_create_student(self, name: str) -> Dict[str, Any]:
        """Fetch existing student or create new profile."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, name, current_level, total_xp, total_score, best_score, streak_days, last_active_date
                FROM students WHERE name = ?
            """, (name,))
            row = cursor.fetchone()
            
            today_str = str(date.today())
            if row:
                student = {
                    "id": row[0],
                    "name": row[1],
                    "current_level": row[2],
                    "total_xp": row[3],
                    "total_score": row[4],
                    "best_score": row[5],
                    "streak_days": row[6],
                    "last_active_date": row[7]
                }
                return student

            # Create new
            cursor.execute("""
                INSERT INTO students (name, current_level, total_xp, total_score, best_score, streak_days, last_active_date)
                VALUES (?, 1, 0, 0, 0, 1, ?)
            """, (name, today_str))
            conn.commit()
            return self.get_or_create_student(name)

    def record_level_completion(self, student_id: int, level_id: int, score: int, xp_earned: int) -> None:
        """Update student stats and unlock next level."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO completed_levels (student_id, level_id, score, xp_earned)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(student_id, level_id) DO UPDATE SET
                    score = MAX(score, excluded.score),
                    xp_earned = MAX(xp_earned, excluded.xp_earned)
            """, (student_id, level_id, score, xp_earned))

            cursor.execute("""
                UPDATE students
                SET total_xp = total_xp + ?,
                    total_score = total_score + ?,
                    best_score = MAX(best_score, ?),
                    current_level = MAX(current_level, ?)
                WHERE id = ?
            """, (xp_earned, score, score, level_id + 1, student_id))
            
            conn.commit()

    def get_completed_levels(self, student_id: int) -> List[int]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT level_id FROM completed_levels WHERE student_id = ?", (student_id,))
            return [r[0] for r in cursor.fetchall()]

    def get_leaderboard(self) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT name, current_level, total_xp, total_score, best_score, streak_days
                FROM students
                ORDER BY total_xp DESC
                LIMIT 10
            """)
            rows = cursor.fetchall()
            return [
                {
                    "name": r[0],
                    "current_level": r[1],
                    "total_xp": r[2],
                    "total_score": r[3],
                    "best_score": r[4],
                    "streak_days": r[5]
                }
                for r in rows
            ]
