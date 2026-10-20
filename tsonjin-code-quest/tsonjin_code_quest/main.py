"""
TSONJIN CODE QUEST
Tsonjin Cyber Boarding School • Python Educational Game
Run with: python main.py
"""

import sys
import tkinter as tk
from database import DatabaseManager
from game import GameEngine
from ui import CyberWindow

def main():
    root = tk.Tk()
    root.title("Tsonjin Code Quest — Tsonjin Cyber Boarding School")
    root.geometry("1000x700")
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
