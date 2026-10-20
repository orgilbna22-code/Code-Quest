"""
Questions database and curriculum for Tsonjin Code Quest
Tsonjin Cyber Boarding School • Python Learning System
"""

from typing import Dict, Any, List

LEVELS_DATA: List[Dict[str, Any]] = [
    {
        "id": 1,
        "title": "Python Basics",
        "subtitle": "Learn print() and comments",
        "description": "Start your journey at Tsonjin Cyber Boarding School. Master screen output and code documentation.",
        "difficulty": "EASY",
        "xp": 100,
        "concept": "print() displays messages on the screen. Comments begin with # and are ignored by Python.",
        "example": 'print("Hello, Tsonjin!")  # Greeting',
        "questions": [
            {
                "id": "q1_1",
                "type": "mcq",
                "prompt": "What built-in function does Python use to output text to the screen?",
                "options": ["echo()", "print()", "display()", "show()"],
                "answer": 1,
                "explanation": "In Python, print() is the built-in function to display text on the console."
            },
            {
                "id": "q1_2",
                "type": "predict",
                "prompt": "What does this code output?\nprint('Tsonjin')\nprint('Code Quest')",
                "options": [
                    "Tsonjin Code Quest on one line",
                    "Tsonjin and Code Quest on separate lines",
                    "Error",
                    "print('Tsonjin')"
                ],
                "answer": 1,
                "explanation": "Each print() call automatically appends a newline character, printing on separate lines."
            },
            {
                "id": "q1_3",
                "type": "tf",
                "prompt": "Lines that begin with the '#' symbol are executed as instructions by Python.",
                "options": ["True", "False"],
                "answer": 1,
                "explanation": "False. Lines starting with # are comments and are completely ignored by the interpreter."
            },
            {
                "id": "q1_4",
                "type": "code",
                "prompt": "Write code to print 'Hello, Tsonjin!'",
                "answer": 'print("Hello, Tsonjin!")',
                "explanation": 'Using print("Hello, Tsonjin!") outputs the exact text to standard output.'
            }
        ]
    },
    {
        "id": 2,
        "title": "Variables",
        "subtitle": "Store and manipulate data in memory",
        "description": "Variables are named containers in computer memory for student names, scores, and values.",
        "difficulty": "EASY",
        "xp": 120,
        "concept": "Variables store values. Assign them with =. Python variables are dynamically typed and case-sensitive.",
        "example": 'student_name = "Orgil"\nxp = 250\nprint(student_name)',
        "questions": [
            {
                "id": "q2_1",
                "type": "mcq",
                "prompt": "Which of the following is a VALID variable name in Python?",
                "options": ["2nd_cadet", "cadet-name", "cadet_name", "class"],
                "answer": 2,
                "explanation": "cadet_name is valid. Variables cannot start with digits, cannot contain dashes, and cannot be keywords."
            },
            {
                "id": "q2_2",
                "type": "predict",
                "prompt": "What does this print?\nxp = 100\nxp = 250\nprint(xp)",
                "options": ["100", "250", "350", "Error"],
                "answer": 1,
                "explanation": "Variables can be reassigned. The value 100 was overwritten by 250."
            },
            {
                "id": "q2_3",
                "type": "code",
                "prompt": "Create a variable school = 'Tsonjin' and print it.",
                "answer": 'school = "Tsonjin"\nprint(school)',
                "explanation": "Assigning school = 'Tsonjin' stores the string, and print(school) outputs it."
            }
        ]
    },
    {
        "id": 3,
        "title": "Data Types",
        "subtitle": "Strings, Integers, Floats, Booleans",
        "description": "Learn the four core primitive types in Python.",
        "difficulty": "EASY",
        "xp": 140,
        "concept": "str (text in quotes), int (integers), float (decimals), bool (True or False).",
        "example": 'name = "Temuulen"\nage = 16\ngpa = 3.9\nis_cadet = True',
        "questions": [
            {
                "id": "q3_1",
                "type": "mcq",
                "prompt": "What data type is the value 42.0 in Python?",
                "options": ["int", "float", "str", "bool"],
                "answer": 1,
                "explanation": "Because it has a decimal point, 42.0 is categorized as a float."
            },
            {
                "id": "q3_2",
                "type": "predict",
                "prompt": "What is the output of:\na = '10'\nb = '20'\nprint(a + b)",
                "options": ["30", "1020", "Error", "10 20"],
                "answer": 1,
                "explanation": "Adding two strings concatenates them together into '1020'."
            }
        ]
    },
    {
        "id": 4,
        "title": "Input & Output",
        "subtitle": "User input and f-string formatting",
        "description": "Make interactive programs with input() and formatted f-strings.",
        "difficulty": "NORMAL",
        "xp": 160,
        "concept": "input() always returns a string. f-strings f'Hello {name}' format variables inside strings cleanly.",
        "example": 'name = "Nomin"\nprint(f"Cadet {name} is ready.")',
        "questions": [
            {
                "id": "q4_1",
                "type": "mcq",
                "prompt": "What data type does the input() function return?",
                "options": ["int", "str", "float", "bool"],
                "answer": 1,
                "explanation": "input() always returns user input as a string (str)."
            }
        ]
    },
    {
        "id": 5,
        "title": "Operators",
        "subtitle": "Arithmetic, Comparison & Logical",
        "description": "Calculate formulas and test conditions with Python operators.",
        "difficulty": "NORMAL",
        "xp": 180,
        "concept": "% gives the remainder, // is floor division, == checks equality, and/or combine boolean conditions.",
        "example": 'print(10 % 3)  # 1\nprint(5 > 2 and 3 < 10)  # True',
        "questions": [
            {
                "id": "q5_1",
                "type": "mcq",
                "prompt": "What is the result of 14 % 4 in Python?",
                "options": ["3", "2", "3.5", "0"],
                "answer": 1,
                "explanation": "14 divided by 4 is 3 with a remainder of 2. % returns the remainder."
            }
        ]
    },
    {
        "id": 6,
        "title": "if / elif / else",
        "subtitle": "Conditional decision making",
        "description": "Give your program intelligence with conditional branching.",
        "difficulty": "NORMAL",
        "xp": 200,
        "concept": "Use if, elif, and else with indented blocks (4 spaces) and colons (:).",
        "example": 'if score >= 90:\n    print("Honors")\nelse:\n    print("Pass")',
        "questions": [
            {
                "id": "q6_1",
                "type": "predict",
                "prompt": "What will this print?\npoints = 75\nif points >= 90:\n    print('Gold')\nelif points >= 70:\n    print('Silver')\nelse:\n    print('Bronze')",
                "options": ["Gold", "Silver", "Bronze", "Error"],
                "answer": 1,
                "explanation": "75 is not >= 90, but it is >= 70, so 'Silver' prints."
            }
        ]
    },
    {
        "id": 7,
        "title": "for Loops",
        "subtitle": "Iterating over sequences with range()",
        "description": "Repeat tasks automatically with for loops and range().",
        "difficulty": "NORMAL",
        "xp": 220,
        "concept": "range(start, stop) generates integers from start up to stop - 1.",
        "example": 'for i in range(3):\n    print(f"Step {i}")',
        "questions": [
            {
                "id": "q7_1",
                "type": "predict",
                "prompt": "How many times does this loop run?\nfor i in range(4):\n    print('Cyber')",
                "options": ["3", "4", "5", "Infinite"],
                "answer": 1,
                "explanation": "range(4) produces 0, 1, 2, 3, which is 4 iterations."
            }
        ]
    },
    {
        "id": 8,
        "title": "while Loops",
        "subtitle": "Condition-driven loops",
        "description": "Repeat while a condition is True. Use break to exit.",
        "difficulty": "HARD",
        "xp": 240,
        "concept": "While loops run as long as condition evaluates to True. Avoid infinite loops by updating state.",
        "example": 'energy = 3\nwhile energy > 0:\n    energy -= 1',
        "questions": [
            {
                "id": "q8_1",
                "type": "mcq",
                "prompt": "Which keyword immediately exits a while loop?",
                "options": ["stop", "exit", "break", "return"],
                "answer": 2,
                "explanation": "break terminates the active loop immediately."
            }
        ]
    },
    {
        "id": 9,
        "title": "Lists",
        "subtitle": "Ordered collections and indexing",
        "description": "Store multiple items in an ordered list with 0-based indexing.",
        "difficulty": "HARD",
        "xp": 260,
        "concept": "Use [] for lists, index 0 for first element, .append() to add items.",
        "example": 'cadets = ["Orgil", "Nomin"]\ncadets.append("Anand")',
        "questions": [
            {
                "id": "q9_1",
                "type": "mcq",
                "prompt": "What is the index of the FIRST item in a Python list?",
                "options": ["1", "0", "-1", "None"],
                "answer": 1,
                "explanation": "Python lists are zero-indexed, starting at index 0."
            }
        ]
    },
    {
        "id": 10,
        "title": "Functions",
        "subtitle": "Reusable code blocks with def",
        "description": "Package instructions into named functions with parameters and returns.",
        "difficulty": "HARD",
        "xp": 280,
        "concept": "Define with def name(params): and send results back with return.",
        "example": 'def add(a, b):\n    return a + b\nprint(add(5, 3))',
        "questions": [
            {
                "id": "q10_1",
                "type": "mcq",
                "prompt": "Which keyword defines a function in Python?",
                "options": ["func", "def", "function", "define"],
                "answer": 1,
                "explanation": "def is Python's keyword to define a function."
            }
        ]
    },
    {
        "id": 11,
        "title": "Dictionaries",
        "subtitle": "Key-value data structures",
        "description": "Store associations and structured student records in dictionaries.",
        "difficulty": "HARD",
        "xp": 300,
        "concept": "Dictionaries use {key: value} mapping. Access with dict[key].",
        "example": 'cadet = {"name": "Bilguun", "xp": 1150}\nprint(cadet["name"])',
        "questions": [
            {
                "id": "q11_1",
                "type": "mcq",
                "prompt": "Which brackets are used to declare a dictionary?",
                "options": ["[]", "()", "{}", "<>"],
                "answer": 2,
                "explanation": "Curly braces {} are used to declare Python dictionaries."
            }
        ]
    },
    {
        "id": 12,
        "title": "Mini Project (Boss Challenge)",
        "subtitle": "Tsonjin Cyber Pass Verification System",
        "description": "The ultimate synthesis project for Tsonjin Cyber Boarding School.",
        "difficulty": "BOSS",
        "xp": 400,
        "concept": "Integrate variables, conditionals, functions, and lists to build access control.",
        "example": 'def verify(score):\n    return "PASS" if score >= 70 else "RETRY"',
        "questions": [
            {
                "id": "q12_1",
                "type": "mcq",
                "prompt": "What construct is best for checking multiple threshold grades (90, 80, 70)?",
                "options": ["if / elif / else", "Infinite while loop", "Single print", "List variable"],
                "answer": 0,
                "explanation": "An if / elif / else ladder cleanly handles hierarchical conditional branches."
            }
        ]
    }
]
