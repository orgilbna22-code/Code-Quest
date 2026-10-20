"""
Subtle animation utilities for Tkinter UI
Includes XP number easing, progress bar animation, and error shake.
"""

from typing import Callable

def animate_xp_counter(label, start_val: int, end_val: int, step: int = 10, delay_ms: int = 25):
    """Gradually increments XP counter on a Tkinter label."""
    current = start_val
    def _step():
        nonlocal current
        if current < end_val:
            current = min(end_val, current + step)
            try:
                label.config(text=f"{current:,} XP")
                label.after(delay_ms, _step)
            except Exception:
                pass
        else:
            try:
                label.config(text=f"{end_val:,} XP")
            except Exception:
                pass
    _step()

def shake_widget(widget, offsets=(-6, 6, -4, 4, 0), delay_ms=40):
    """Creates a gentle error shake effect on a widget."""
    try:
        orig_x = widget.winfo_x()
        def _shake(idx=0):
            if idx < len(offsets):
                widget.place_configure(x=orig_x + offsets[idx])
                widget.after(delay_ms, lambda: _shake(idx + 1))
            else:
                widget.place_configure(x=orig_x)
        _shake()
    except Exception:
        pass
