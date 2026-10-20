"""
Game Engine for Tsonjin Code Quest
Handles student session, level progression, XP calculations, and evaluation.
"""

from typing import Dict, Any, List, Optional
from database import DatabaseManager
from questions import LEVELS_DATA

class GameEngine:
    def __init__(self, db: DatabaseManager):
        self.db = db
        self.current_student: Optional[Dict[str, Any]] = None
        self.levels = LEVELS_DATA
        self.active_level: Optional[Dict[str, Any]] = None
        self.current_question_idx = 0
        self.correct_count = 0
        self.score = 0
        self.xp_earned = 0

    def login(self, name: str) -> Dict[str, Any]:
        """Login or register student."""
        self.current_student = self.db.get_or_create_student(name)
        return self.current_student

    def get_completed_levels(self) -> List[int]:
        if not self.current_student:
            return []
        return self.db.get_completed_levels(self.current_student["id"])

    def is_level_unlocked(self, level_id: int) -> bool:
        if level_id == 1:
            return True
        if not self.current_student:
            return False
        completed = self.get_completed_levels()
        return (level_id - 1) in completed or level_id <= self.current_student["current_level"]

    def start_level(self, level_id: int) -> bool:
        """Start playing a level if unlocked."""
        if not self.is_level_unlocked(level_id):
            return False
        
        for lvl in self.levels:
            if lvl["id"] == level_id:
                self.active_level = lvl
                self.current_question_idx = 0
                self.correct_count = 0
                self.score = 0
                self.xp_earned = 0
                return True
        return False

    def answer_question(self, user_answer: Any) -> Dict[str, Any]:
        """Evaluate student answer and return feedback."""
        if not self.active_level:
            return {"correct": False, "explanation": "No active level"}

        questions = self.active_level["questions"]
        q = questions[self.current_question_idx]
        
        is_correct = False
        if q["type"] in ("mcq", "predict", "tf"):
            is_correct = (user_answer == q["answer"])
        elif q["type"] == "code":
            clean_user = str(user_answer).strip().replace("'", '"')
            clean_ans = str(q["answer"]).strip().replace("'", '"')
            is_correct = (clean_user == clean_ans)

        if is_correct:
            self.correct_count += 1
            self.score += 100
            self.xp_earned += 25
        else:
            self.score = max(0, self.score - 20)

        return {
            "correct": is_correct,
            "explanation": q["explanation"],
            "current_question": self.current_question_idx + 1,
            "total_questions": len(questions)
        }

    def next_question(self) -> bool:
        """Advance to next question, returns False if level finished."""
        if not self.active_level:
            return False
        self.current_question_idx += 1
        return self.current_question_idx < len(self.active_level["questions"])

    def finish_level(self, seconds_left: int = 60) -> Dict[str, Any]:
        """Finish level, commit XP and scores to SQLite."""
        if not self.active_level or not self.current_student:
            return {}

        bonus_xp = self.active_level["xp"]
        total_xp = self.xp_earned + bonus_xp
        time_bonus = max(0, seconds_left * 2)
        total_score = self.score + time_bonus

        self.db.record_level_completion(
            student_id=self.current_student["id"],
            level_id=self.active_level["id"],
            score=total_score,
            xp_earned=total_xp
        )

        # Refresh student profile
        self.current_student = self.db.get_or_create_student(self.current_student["name"])

        return {
            "level_id": self.active_level["id"],
            "score": total_score,
            "xp_earned": total_xp,
            "correct_count": self.correct_count,
            "total_questions": len(self.active_level["questions"])
        }
