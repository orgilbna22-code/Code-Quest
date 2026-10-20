"""
Tkinter User Interface for Tsonjin Code Quest
Cyber Minimalist Aesthetic: Green (#00C853), Black (#0B0F0D), White (#FFFFFF)
With Responsive Label Wrappers and Bilingual (English / Mongolian) Support
"""

import tkinter as tk
from tkinter import ttk, messagebox
from typing import Optional, Dict
from game import GameEngine

# Visual Theme Constants
COLOR_BG = "#0B0F0D"
COLOR_CARD = "#131A16"
COLOR_CARD_ELEVATED = "#1B241F"
COLOR_PRIMARY_GREEN = "#00C853"
COLOR_LIGHT_GREEN = "#69F0AE"
COLOR_TEXT_WHITE = "#FFFFFF"
COLOR_TEXT_MUTED = "#94A3B8"
COLOR_BORDER = "#1F2923"

FONT_DISPLAY = ("Helvetica", 20, "bold")
FONT_TITLE = ("Helvetica", 14, "bold")
FONT_BODY = ("Helvetica", 11)
FONT_MONO = ("Courier", 11)
FONT_SMALL = ("Helvetica", 9)

# Bilingual dictionary for Tkinter UI
TK_LANG = {
    "en": {
        "school": "TSONJIN CYBER BOARDING SCHOOL",
        "title": "TSONJIN CODE QUEST",
        "subtitle": "“Learn Python. Solve Problems. Level Up.”",
        "tagline": "“Tsonjin Cyber Boarding School • Python Learning Project”",
        "play": "1. PLAY",
        "levels": "2. LEVELS",
        "leaderboard": "3. LEADERBOARD",
        "profile": "4. PROFILE",
        "settings": "5. SETTINGS",
        "exit": "6. EXIT",
        "lang_btn": "Language: English (Switch to MN)",
        "back": "← MAIN MENU",
        "completed": "✓ COMPLETED",
        "start": "START →",
        "locked": "🔒 LOCKED",
        "score": "Score",
        "correct": "✓ Correct! +25 XP",
        "incorrect": "✕ Incorrect",
        "continue": "CONTINUE →",
        "level_complete": "LEVEL COMPLETE",
        "next_level": "NEXT LEVEL",
    },
    "mn": {
        "school": "ЦОНЖИН КИБЕР СУРГУУЛЬ",
        "title": "TSONJIN CODE QUEST",
        "subtitle": "“Python сур. Бодлого бод. Түвшин ахи.”",
        "tagline": "“Цонжин Кибер Дотуур Байртай Сургууль • Python Сургалтын Төсөл”",
        "play": "1. ТОГЛОХ",
        "levels": "2. ТҮВШИНГҮҮД",
        "leaderboard": "3. ТЭРГҮҮЛЭГЧИД",
        "profile": "4. ПРОФАЙЛ",
        "settings": "5. ТОХИРГОО",
        "exit": "6. ГАРАХ",
        "lang_btn": "Хэл: Монгол (Switch to EN)",
        "back": "← ҮНДСЭН ЦЭС",
        "completed": "✓ ДУУССАН",
        "start": "ЭХЛЭХ →",
        "locked": "🔒 ТҮГЖЭЭТЭЙ",
        "score": "Оноо",
        "correct": "✓ Зөв байна! +25 XP",
        "incorrect": "✕ Буруу байна",
        "continue": "ҮРГЭЛЖЛҮҮЛЭХ →",
        "level_complete": "ТҮВШИН ДУУСЛАА",
        "next_level": "ДАРААХ ТҮВШИН",
    }
}

class CyberWindow:
    def __init__(self, root: tk.Tk, engine: GameEngine):
        self.root = root
        self.engine = engine
        self.language = "en"
        
        # Configure main window
        self.root.title("Tsonjin Code Quest — Tsonjin Cyber Boarding School")
        self.root.configure(bg=COLOR_BG)
        
        # Container frame for switching screens
        self.container = tk.Frame(self.root, bg=COLOR_BG)
        self.container.pack(fill=tk.BOTH, expand=True)

        # Login automatically with default cadet
        self.engine.login("Orgil")
        
        # Show Main Menu
        self.show_main_menu()

    @property
    def t(self) -> Dict[str, str]:
        return TK_LANG[self.language]

    def toggle_language(self):
        self.language = "mn" if self.language == "en" else "en"
        self.show_main_menu()

    def clear_container(self):
        for widget in self.container.winfo_children():
            widget.destroy()

    # ==========================================
    # 1. MAIN MENU
    # ==========================================
    def show_main_menu(self):
        self.clear_container()
        t = self.t

        wrapper = tk.Frame(self.container, bg=COLOR_BG)
        wrapper.pack(fill=tk.BOTH, expand=True, padx=20, pady=15)

        # Language switcher bar at top right
        lang_bar = tk.Frame(wrapper, bg=COLOR_BG)
        lang_bar.pack(fill=tk.X, pady=(0, 5))
        
        tk.Button(
            lang_bar,
            text=t["lang_btn"],
            command=self.toggle_language,
            bg=COLOR_CARD,
            fg=COLOR_PRIMARY_GREEN,
            font=FONT_SMALL,
            relief=tk.FLAT,
            padx=10,
            pady=4,
            cursor="hand2"
        ).pack(side=tk.RIGHT)

        # Top section: School branding (Guaranteed wrap / boundary protection)
        school_lbl = tk.Label(
            wrapper,
            text=t["school"],
            fg=COLOR_PRIMARY_GREEN,
            bg=COLOR_BG,
            font=("Helvetica", 11, "bold"),
            justify=tk.CENTER,
            wraplength=600
        )
        school_lbl.pack(pady=(5, 5))

        # Main title
        title_lbl = tk.Label(
            wrapper,
            text=t["title"],
            fg=COLOR_TEXT_WHITE,
            bg=COLOR_BG,
            font=("Helvetica", 24, "bold"),
            wraplength=700
        )
        title_lbl.pack(pady=5)

        # Subtitle
        sub_lbl = tk.Label(
            wrapper,
            text=t["subtitle"],
            fg=COLOR_TEXT_MUTED,
            bg=COLOR_BG,
            font=("Helvetica", 11, "italic"),
            wraplength=600
        )
        sub_lbl.pack(pady=(0, 15))

        # Menu Buttons Frame
        btn_frame = tk.Frame(wrapper, bg=COLOR_BG)
        btn_frame.pack(pady=10)

        btn_specs = [
            (t["play"], self.action_play, COLOR_PRIMARY_GREEN, COLOR_BG),
            (t["levels"], self.show_level_select, COLOR_CARD, COLOR_TEXT_WHITE),
            (t["leaderboard"], self.show_leaderboard, COLOR_CARD, COLOR_TEXT_WHITE),
            (t["profile"], self.show_profile, COLOR_CARD, COLOR_TEXT_WHITE),
            (t["settings"], self.show_settings, COLOR_CARD, COLOR_TEXT_WHITE),
            (t["exit"], self.root.quit, COLOR_BG, COLOR_TEXT_MUTED)
        ]

        for text, cmd, bg_col, fg_col in btn_specs:
            btn = tk.Button(
                btn_frame,
                text=text,
                command=cmd,
                bg=bg_col,
                fg=fg_col,
                activebackground=COLOR_LIGHT_GREEN if bg_col == COLOR_PRIMARY_GREEN else COLOR_CARD_ELEVATED,
                activeforeground=COLOR_BG if bg_col == COLOR_PRIMARY_GREEN else COLOR_TEXT_WHITE,
                font=("Helvetica", 11, "bold"),
                relief=tk.FLAT,
                width=30,
                pady=9,
                cursor="hand2"
            )
            btn.pack(pady=4)

        # Footer
        footer_lbl = tk.Label(
            wrapper,
            text=t["tagline"],
            fg=COLOR_TEXT_MUTED,
            bg=COLOR_BG,
            font=("Helvetica", 9),
            wraplength=650
        )
        footer_lbl.pack(side=tk.BOTTOM, pady=10)

    def action_play(self):
        curr_lvl = self.engine.current_student["current_level"] if self.engine.current_student else 1
        if self.engine.start_level(curr_lvl):
            self.show_gameplay()
        else:
            self.show_level_select()

    # ==========================================
    # 2. LEVEL SELECT SCREEN
    # ==========================================
    def show_level_select(self):
        self.clear_container()
        t = self.t

        wrapper = tk.Frame(self.container, bg=COLOR_BG)
        wrapper.pack(fill=tk.BOTH, expand=True, padx=25, pady=15)

        # Header
        top_bar = tk.Frame(wrapper, bg=COLOR_BG)
        top_bar.pack(fill=tk.X, pady=(0, 15))

        back_btn = tk.Button(
            top_bar,
            text=t["back"],
            command=self.show_main_menu,
            bg=COLOR_CARD,
            fg=COLOR_TEXT_MUTED,
            relief=tk.FLAT,
            padx=12,
            pady=6,
            cursor="hand2"
        )
        back_btn.pack(side=tk.LEFT)

        title = tk.Label(
            top_bar,
            text="SELECT QUEST LEVEL",
            fg=COLOR_TEXT_WHITE,
            bg=COLOR_BG,
            font=FONT_TITLE
        )
        title.pack(side=tk.LEFT, padx=15)

        # Grid of Level Cards
        grid_frame = tk.Frame(wrapper, bg=COLOR_BG)
        grid_frame.pack(fill=tk.BOTH, expand=True)

        completed = self.engine.get_completed_levels()

        for idx, lvl in enumerate(self.engine.levels):
            row = idx // 4
            col = idx % 4

            is_unlocked = self.engine.is_level_unlocked(lvl["id"])
            is_done = lvl["id"] in completed

            card = tk.Frame(
                grid_frame,
                bg=COLOR_CARD if is_unlocked else "#0E1411",
                highlightbackground=COLOR_PRIMARY_GREEN if is_done else COLOR_BORDER,
                highlightthickness=1,
                padx=12,
                pady=12
            )
            card.grid(row=row, column=col, padx=6, pady=6, sticky="nsew")

            num_lbl = tk.Label(
                card,
                text=f"{lvl['id']:02d}",
                fg=COLOR_PRIMARY_GREEN if is_unlocked else COLOR_TEXT_MUTED,
                bg=card["bg"],
                font=("Helvetica", 13, "bold")
            )
            num_lbl.pack(anchor="w")

            title_lbl = tk.Label(
                card,
                text=lvl["title"],
                fg=COLOR_TEXT_WHITE if is_unlocked else COLOR_TEXT_MUTED,
                bg=card["bg"],
                font=("Helvetica", 10, "bold"),
                wraplength=140
            )
            title_lbl.pack(anchor="w", pady=(2, 4))

            status_text = t["completed"] if is_done else (t["start"] if is_unlocked else t["locked"])
            status_fg = COLOR_PRIMARY_GREEN if (is_done or is_unlocked) else COLOR_TEXT_MUTED

            action_btn = tk.Button(
                card,
                text=status_text,
                command=lambda l_id=lvl["id"]: self.start_selected_level(l_id),
                state=tk.NORMAL if is_unlocked else tk.DISABLED,
                bg=COLOR_CARD_ELEVATED if is_unlocked else "#0A0D0B",
                fg=status_fg,
                relief=tk.FLAT,
                font=FONT_SMALL,
                cursor="hand2" if is_unlocked else "arrow"
            )
            action_btn.pack(fill=tk.X, pady=(8, 0))

    def start_selected_level(self, level_id: int):
        if self.engine.start_level(level_id):
            self.show_gameplay()

    # ==========================================
    # 3. GAMEPLAY SCREEN
    # ==========================================
    def show_gameplay(self):
        self.clear_container()
        t = self.t
        lvl = self.engine.active_level
        q_idx = self.engine.current_question_idx
        q = lvl["questions"][q_idx]

        wrapper = tk.Frame(self.container, bg=COLOR_BG)
        wrapper.pack(fill=tk.BOTH, expand=True, padx=30, pady=15)

        # Status Bar
        status_bar = tk.Frame(wrapper, bg=COLOR_CARD, padx=15, pady=8)
        status_bar.pack(fill=tk.X, pady=(0, 15))

        tk.Label(
            status_bar,
            text=f"LEVEL {lvl['id']:02d}: {lvl['title'].upper()}",
            fg=COLOR_PRIMARY_GREEN,
            bg=COLOR_CARD,
            font=("Helvetica", 10, "bold")
        ).pack(side=tk.LEFT)

        tk.Label(
            status_bar,
            text=f"Q {q_idx + 1} / {len(lvl['questions'])}",
            fg=COLOR_TEXT_WHITE,
            bg=COLOR_CARD,
            font=("Helvetica", 10)
        ).pack(side=tk.LEFT, padx=15)

        tk.Label(
            status_bar,
            text=f"{t['score']}: {self.engine.score}  |  +{self.engine.xp_earned} XP",
            fg=COLOR_LIGHT_GREEN,
            bg=COLOR_CARD,
            font=("Helvetica", 10, "bold")
        ).pack(side=tk.RIGHT)

        # Question Prompt Card
        q_card = tk.Frame(wrapper, bg=COLOR_CARD, padx=20, pady=15)
        q_card.pack(fill=tk.BOTH, expand=True)

        prompt_lbl = tk.Label(
            q_card,
            text=q["prompt"],
            fg=COLOR_TEXT_WHITE,
            bg=COLOR_CARD,
            font=("Helvetica", 12, "bold"),
            wraplength=600,
            justify=tk.LEFT
        )
        prompt_lbl.pack(anchor="w", pady=(0, 15))

        # Options / Input
        self.feedback_frame = tk.Frame(q_card, bg=COLOR_CARD)

        if q["type"] in ("mcq", "predict", "tf"):
            for idx, opt in enumerate(q["options"]):
                opt_btn = tk.Button(
                    q_card,
                    text=f"{chr(65+idx)})  {opt}",
                    command=lambda i=idx: self.handle_answer(i),
                    bg=COLOR_BG,
                    fg=COLOR_TEXT_WHITE,
                    activebackground=COLOR_CARD_ELEVATED,
                    activeforeground=COLOR_PRIMARY_GREEN,
                    font=FONT_BODY,
                    relief=tk.FLAT,
                    anchor="w",
                    padx=12,
                    pady=8,
                    cursor="hand2"
                )
                opt_btn.pack(fill=tk.X, pady=3)

        elif q["type"] == "code":
            self.code_entry = tk.Text(
                q_card,
                height=3,
                bg=COLOR_BG,
                fg=COLOR_PRIMARY_GREEN,
                insertbackground=COLOR_PRIMARY_GREEN,
                font=FONT_MONO,
                padx=8,
                pady=8
            )
            self.code_entry.insert("1.0", '# Type Python code\n')
            self.code_entry.pack(fill=tk.X, pady=8)

            run_btn = tk.Button(
                q_card,
                text="RUN CODE",
                command=lambda: self.handle_answer(self.code_entry.get("1.0", tk.END)),
                bg=COLOR_PRIMARY_GREEN,
                fg=COLOR_BG,
                font=("Helvetica", 10, "bold"),
                relief=tk.FLAT,
                pady=6,
                cursor="hand2"
            )
            run_btn.pack(fill=tk.X)

        self.feedback_frame.pack(fill=tk.X, pady=(15, 0))

    def handle_answer(self, ans):
        t = self.t
        res = self.engine.answer_question(ans)
        
        for w in self.feedback_frame.winfo_children():
            w.destroy()

        result_txt = t["correct"] if res["correct"] else t["incorrect"]
        result_fg = COLOR_PRIMARY_GREEN if res["correct"] else "#EF4444"

        tk.Label(
            self.feedback_frame,
            text=result_txt,
            fg=result_fg,
            bg=COLOR_CARD,
            font=("Helvetica", 11, "bold")
        ).pack(anchor="w")

        tk.Label(
            self.feedback_frame,
            text=res["explanation"],
            fg=COLOR_TEXT_WHITE,
            bg=COLOR_CARD,
            font=FONT_BODY,
            wraplength=550,
            justify=tk.LEFT
        ).pack(anchor="w", pady=(4, 10))

        next_btn = tk.Button(
            self.feedback_frame,
            text=t["continue"],
            command=self.advance_question,
            bg=COLOR_PRIMARY_GREEN,
            fg=COLOR_BG,
            font=("Helvetica", 10, "bold"),
            relief=tk.FLAT,
            padx=16,
            pady=6,
            cursor="hand2"
        )
        next_btn.pack(anchor="e")

    def advance_question(self):
        if self.engine.next_question():
            self.show_gameplay()
        else:
            summary = self.engine.finish_level()
            self.show_level_complete(summary)

    # ==========================================
    # 4. LEVEL COMPLETE SCREEN
    # ==========================================
    def show_level_complete(self, summary):
        self.clear_container()
        t = self.t

        wrapper = tk.Frame(self.container, bg=COLOR_BG)
        wrapper.pack(fill=tk.BOTH, expand=True, padx=30, pady=25)

        card = tk.Frame(wrapper, bg=COLOR_CARD, padx=25, pady=25, highlightbackground=COLOR_PRIMARY_GREEN, highlightthickness=1)
        card.pack(pady=15)

        tk.Label(
            card,
            text=f"╔══════════════════════╗\n{t['level_complete']}\n╚══════════════════════╝",
            fg=COLOR_PRIMARY_GREEN,
            bg=COLOR_CARD,
            font=FONT_MONO,
            justify=tk.CENTER
        ).pack(pady=8)

        tk.Label(
            card,
            text=f"⭐ {t['score']}: {summary.get('score', 0)}\n⚡ XP: +{summary.get('xp_earned', 0)}\n✓ Correct: {summary.get('correct_count', 0)}/{summary.get('total_questions', 0)}",
            fg=COLOR_TEXT_WHITE,
            bg=COLOR_CARD,
            font=("Helvetica", 12),
            justify=tk.LEFT
        ).pack(pady=12)

        btn_box = tk.Frame(card, bg=COLOR_CARD)
        btn_box.pack(pady=8)

        tk.Button(
            btn_box,
            text=t["next_level"],
            command=lambda: self.start_selected_level(self.engine.active_level["id"] + 1),
            bg=COLOR_PRIMARY_GREEN,
            fg=COLOR_BG,
            font=("Helvetica", 10, "bold"),
            relief=tk.FLAT,
            padx=12,
            pady=6,
            cursor="hand2"
        ).pack(side=tk.LEFT, padx=4)

        tk.Button(
            btn_box,
            text=t["back"],
            command=self.show_main_menu,
            bg=COLOR_CARD_ELEVATED,
            fg=COLOR_TEXT_WHITE,
            font=("Helvetica", 10),
            relief=tk.FLAT,
            padx=12,
            pady=6,
            cursor="hand2"
        ).pack(side=tk.LEFT, padx=4)

    # ==========================================
    # 5. LEADERBOARD SCREEN
    # ==========================================
    def show_leaderboard(self):
        self.clear_container()
        t = self.t

        wrapper = tk.Frame(self.container, bg=COLOR_BG)
        wrapper.pack(fill=tk.BOTH, expand=True, padx=30, pady=15)

        back_btn = tk.Button(
            wrapper,
            text=t["back"],
            command=self.show_main_menu,
            bg=COLOR_CARD,
            fg=COLOR_TEXT_MUTED,
            relief=tk.FLAT,
            padx=12,
            pady=5,
            cursor="hand2"
        )
        back_btn.pack(anchor="w", pady=(0, 10))

        tk.Label(
            wrapper,
            text="TSONJIN CODE QUEST — LEADERBOARD",
            fg=COLOR_TEXT_WHITE,
            bg=COLOR_BG,
            font=FONT_TITLE
        ).pack(anchor="w", pady=4)

        lead_list = self.engine.db.get_leaderboard()

        table = tk.Frame(wrapper, bg=COLOR_CARD, padx=15, pady=12)
        table.pack(fill=tk.BOTH, expand=True, pady=8)

        for rank, cadet in enumerate(lead_list, 1):
            row_frame = tk.Frame(table, bg=COLOR_CARD)
            row_frame.pack(fill=tk.X, pady=4)

            rank_fg = COLOR_PRIMARY_GREEN if rank == 1 else COLOR_TEXT_MUTED
            tk.Label(row_frame, text=f"{rank:02d}.", fg=rank_fg, bg=COLOR_CARD, font=("Helvetica", 10, "bold"), width=3, anchor="w").pack(side=tk.LEFT)
            tk.Label(row_frame, text=cadet["name"], fg=COLOR_TEXT_WHITE, bg=COLOR_CARD, font=FONT_BODY, width=18, anchor="w").pack(side=tk.LEFT)
            tk.Label(row_frame, text=f"{cadet['total_xp']:,} XP", fg=COLOR_PRIMARY_GREEN, bg=COLOR_CARD, font=("Helvetica", 10, "bold")).pack(side=tk.RIGHT)

    # ==========================================
    # 6. PROFILE SCREEN
    # ==========================================
    def show_profile(self):
        self.clear_container()
        t = self.t
        student = self.engine.current_student or {}

        wrapper = tk.Frame(self.container, bg=COLOR_BG)
        wrapper.pack(fill=tk.BOTH, expand=True, padx=30, pady=15)

        tk.Button(
            wrapper,
            text=t["back"],
            command=self.show_main_menu,
            bg=COLOR_CARD,
            fg=COLOR_TEXT_MUTED,
            relief=tk.FLAT,
            padx=12,
            pady=5,
            cursor="hand2"
        ).pack(anchor="w", pady=(0, 8))

        card = tk.Frame(wrapper, bg=COLOR_CARD, padx=25, pady=20)
        card.pack(fill=tk.X, pady=8)

        tk.Label(card, text="TSONJIN STUDENT PROFILE", fg=COLOR_PRIMARY_GREEN, bg=COLOR_CARD, font=("Helvetica", 10, "bold")).pack(anchor="w")
        tk.Label(card, text=student.get("name", "Student"), fg=COLOR_TEXT_WHITE, bg=COLOR_CARD, font=FONT_DISPLAY).pack(anchor="w", pady=(0, 10))

        stats = [
            ("LEVEL", f"{student.get('current_level', 1):02d}"),
            ("XP", f"{student.get('total_xp', 0):,}"),
            ("STREAK", f"🔥 {student.get('streak_days', 1)} DAYS"),
            ("BEST SCORE", f"{student.get('best_score', 0)}")
        ]

        grid = tk.Frame(card, bg=COLOR_CARD)
        grid.pack(fill=tk.X, pady=8)

        for col, (label, val) in enumerate(stats):
            box = tk.Frame(grid, bg=COLOR_BG, padx=12, pady=8)
            box.grid(row=0, column=col, padx=4, sticky="nsew")
            tk.Label(box, text=label, fg=COLOR_TEXT_MUTED, bg=COLOR_BG, font=FONT_SMALL).pack(anchor="w")
            tk.Label(box, text=val, fg=COLOR_TEXT_WHITE, bg=COLOR_BG, font=("Helvetica", 11, "bold")).pack(anchor="w")

    # ==========================================
    # 7. SETTINGS SCREEN
    # ==========================================
    def show_settings(self):
        self.clear_container()
        t = self.t

        wrapper = tk.Frame(self.container, bg=COLOR_BG)
        wrapper.pack(fill=tk.BOTH, expand=True, padx=30, pady=15)

        tk.Button(
            wrapper,
            text=t["back"],
            command=self.show_main_menu,
            bg=COLOR_CARD,
            fg=COLOR_TEXT_MUTED,
            relief=tk.FLAT,
            padx=12,
            pady=5,
            cursor="hand2"
        ).pack(anchor="w", pady=(0, 8))

        tk.Label(wrapper, text="SYSTEM SETTINGS", fg=COLOR_TEXT_WHITE, bg=COLOR_BG, font=FONT_TITLE).pack(anchor="w", pady=4)

        card = tk.Frame(wrapper, bg=COLOR_CARD, padx=18, pady=18)
        card.pack(fill=tk.X, pady=8)

        tk.Label(card, text="Audio & Sounds: Active (Synthesized tones)", fg=COLOR_TEXT_WHITE, bg=COLOR_CARD, font=FONT_BODY).pack(anchor="w", pady=4)
        tk.Label(card, text="Animations: Enabled", fg=COLOR_TEXT_WHITE, bg=COLOR_CARD, font=FONT_BODY).pack(anchor="w", pady=4)
        tk.Label(card, text=f"Active Language: {self.language.upper()}", fg=COLOR_PRIMARY_GREEN, bg=COLOR_CARD, font=("Helvetica", 11, "bold")).pack(anchor="w", pady=4)

        tk.Button(
            card,
            text=t["lang_btn"],
            command=self.toggle_language,
            bg=COLOR_PRIMARY_GREEN,
            fg=COLOR_BG,
            font=("Helvetica", 10, "bold"),
            relief=tk.FLAT,
            padx=12,
            pady=6,
            cursor="hand2"
        ).pack(anchor="w", pady=(8, 0))
