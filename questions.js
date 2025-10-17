/*  questions.js — content only
    You can add new weeks by adding another key in weeks: { "7": {...}, "8": {...} } etc.
    Each week may optionally include a `config` object to tweak difficulty.
*/
window.TTC_DATA = {
  weeks: {
    /* ====== Paste your full Week 1..6 objects here, unchanged ======
       Example stub structure (REMOVE stubs and paste your real data):
    */
    "1": {
      "title": "Week 1: Intro to Microcontrollers",
      "description": "Hardware, inputs/outputs, MakeCode basics, events & sequencing.",
      "locked": false,
      "questions": [
        {
          "id": "w1-q1",
          "question": "Which statement best describes the role of the microcontroller inside a micro:bit?",
          "type": "multiple-choice",
          "options": [
            "It processes sensor inputs and controls outputs according to your code",
            "It only stores your program in memory",
            "It powers the LEDs and buttons directly without processing",
            "It connects the micro:bit to the internet"
          ],
          "correct": 0,
          "explanation": "The microcontroller is the 'brain' — it runs your program, reading inputs and sending signals to outputs.",
          "definition": "MICROCONTROLLER — a small processor that executes code and manages inputs/outputs in embedded systems.",
          "difficulty": "medium",
          "hint": "Think of it as the part that actually runs your code and decides what to do next."
        },
        {
          "id": "w1-q2",
          "question": "Which example shows the micro:bit receiving information from its surroundings?",
          "type": "multiple-choice",
          "options": [
            "Detecting motion using the accelerometer",
            "Showing an arrow on the screen",
            "Playing a sound through the speaker",
            "Flashing the LEDs in a pattern"
          ],
          "correct": 0,
          "explanation": "The accelerometer senses movement — an input from the environment. The other options send information outward, making them outputs.",
          "difficulty": "hard",
          "hint": "Ask yourself: is the micro:bit reading or displaying information?"
        },
        {
          "id": "w1-q3",
          "question": "In the code below, which block ensures the text appears only one time before the heart starts flashing?",
          "type": "multiple-choice",
          "code": "on start\n  show string \"Hello!\"\nforever\n  show icon Heart\n  pause(500)\n  clear screen\n  pause(500)",
          "options": ["forever", "on start", "show string \"Hello!\"", "pause(500)"],
          "correct": 1,
          "explanation": "Anything inside 'on start' runs just once. The 'forever' loop repeats endlessly, but 'on start' finishes after its commands.",
          "difficulty": "medium-hard",
          "hint": "Only one block type is designed for setup instructions that don’t repeat."
        },
        {
          "id": "w1-q4",
          "question": "If you upload this code to the micro:bit, what will you see happen and why?",
          "type": "multiple-choice",
          "code": "forever\n  show string \"Hi\"",
          "options": [
            "It scrolls 'Hi' endlessly because there’s no stop condition",
            "It only shows 'Hi' once because the display clears automatically",
            "It shows 'Hi' five times, matching the number of LEDs",
            "It waits for button A before showing 'Hi'"
          ],
          "correct": 0,
          "explanation": "Because the text is inside a 'forever' block, it repeats continuously without stopping until the micro:bit is reset or turned off.",
          "difficulty": "medium-hard",
          "hint": "Does anything in the code tell it to stop?"
        },
        {
          "id": "w1-q5",
          "question": "The LED grid on a micro:bit can both show light and measure light levels. What type of device is it mostly considered?",
          "type": "multiple-choice",
          "options": [
            "Both input and output, but mainly output",
            "Only an input device",
            "A storage device for variables",
            "A power source for sensors"
          ],
          "correct": 0,
          "explanation": "While the LED matrix can detect light levels, its primary role is to display information — so it’s mainly an output device.",
          "difficulty": "medium-hard",
          "hint": "It can sense light but that’s not its main purpose."
        },
        {
          "id": "w1-q6",
          "question": "Match each term to its definition.",
          "type": "drag-drop",
          "terms": ["Event", "Sequence", "Debug"],
          "definitions": ["Order of instructions", "Something that triggers code", "Find and fix errors"],
          "correctMatches": [1, 0, 2],
          "explanation": "Event triggers code; sequence is order; debug means fix mistakes.",
          "difficulty": "medium",
          "hint": "Cause → Event; order → Sequence; fixing → Debug."
        },
        {
          "id": "w1-q7",
          "question": "Where can you test your micro:bit program without using the real device?",
          "type": "multiple-choice",
          "options": [
            "In the MakeCode simulator on the screen",
            "By opening the MICROBIT drive on your computer",
            "By plugging in the battery pack only",
            "In the serial data window"
          ],
          "correct": 0,
          "explanation": "The MakeCode simulator runs your program virtually and lets you try buttons, shaking and LEDs on screen.",
          "definition": "SIMULATOR — a virtual version of the micro:bit you can test inside MakeCode.",
          "difficulty": "medium-hard",
          "hint": "Which one shows a working virtual micro:bit on your screen?"
        },
        {
          "id": "w1-q8",
          "question": "Which statement about 'on button A pressed' is true?",
          "type": "multiple-choice",
          "options": ["It runs in a loop automatically", "It runs only when A is pressed", "It runs only at start", "It never runs"],
          "correct": 1,
          "explanation": "Event code runs when the event happens — here, pressing Button A.",
          "difficulty": "hard",
          "hint": "It waits for something to happen."
        },
        {
          "id": "w1-q9",
          "question": "What is a program?",
          "type": "multiple-choice",
          "options": ["A single instruction", "Random blocks", "A set of instructions a computer follows", "An image on the LED matrix"],
          "correct": 2,
          "explanation": "A program is a precise sequence of instructions.",
          "definition": "PROGRAM — a precise list of instructions a computer follows.",
          "difficulty": "hard",
          "hint": "Think of a recipe for a computer."
        },
        {
          "id": "w1-q10",
          "question": "Why might your program not appear on the micro:bit after download?",
          "type": "multiple-choice",
          "options": ["Wrong cable (charge-only)", "Didn’t click Download", "Micro:bit not connected", "Any of these"],
          "correct": 3,
          "explanation": "All of these are common causes.",
          "difficulty": "hard",
          "hint": "Check the obvious steps and connections."
        },
        {
          "id": "w1-q11",
          "question": "Which example shows input → process → output in the correct order?",
          "type": "multiple-choice",
          "options": ["LED → add numbers → button", "Button → compare numbers → show icon", "Speaker → random → LED", "Battery → program → USB"],
          "correct": 1,
          "explanation": "Input (button) → processing/logic → output (display).",
          "difficulty": "hard",
          "hint": "First comes data in, then thinking, then feedback out."
        },
        {
          "id": "w1-q12",
          "question": "Which block would you use to run code continuously during the entire program?",
          "type": "multiple-choice",
          "options": ["on start", "on shake", "forever", "on button B pressed"],
          "correct": 2,
          "explanation": "The forever loop keeps running as long as the program runs.",
          "difficulty": "medium",
          "hint": "Think of a heartbeat the program always follows."
        }
      ]
    },
    "2": {
      "title": "Week 2: Events & Random",
      "description": "Button events, dice rolling, randomness, simple probability.",
      "locked": false,
      "questions": [
        {
          "id": "w2-q1",
          "question": "When does the code inside the block 'on button A pressed' actually run?",
          "type": "multiple-choice",
          "options": [
            "Whenever any button is pressed",
            "Only when button A is pressed down",
            "Every few seconds automatically",
            "When button A is released"
          ],
          "correct": 1,
          "explanation": "The code runs only when button A is pressed down. Other buttons or automatic timing don’t trigger it.",
          "difficulty": "medium",
          "hint": "It listens for one exact action on one button."
        },
        {
          "id": "w2-q2",
          "question": "What does 'random 1 to 6' give you?",
          "type": "multiple-choice",
          "options": ["Always 6", "Always 1", "Any whole number from 1 to 6", "A decimal number"],
          "correct": 2,
          "explanation": "It behaves like a fair six-sided die.",
          "definition": "RANDOM — the computer chooses by chance from a range.",
          "difficulty": "easy",
          "hint": "Think dice."
        },
        {
          "id": "w2-q3",
          "question": "What is an event in programming?",
          "type": "multiple-choice",
          "options": ["A type of sensor", "A mistake in code", "Something that triggers code to run", "A kind of loop"],
          "correct": 2,
          "explanation": "Events trigger code when they occur (press, shake, start).",
          "difficulty": "easy",
          "hint": "It’s the “when” that makes code start."
        },
        {
          "id": "w2-q4",
          "question": "This dice roller runs when you press Button A. What happens each time you press it?",
          "type": "multiple-choice",
          "code": "on button A pressed\n  set roll to random 1 to 6\n  show number roll",
          "options": [
            "It picks a new number from 1 to 6 and shows it",
            "It keeps showing the same number every time",
            "It adds 1 to the previous roll and shows that",
            "It shows all six numbers quickly one after another"
          ],
          "correct": 0,
          "explanation": "Each button A press sets a new random value between 1 and 6, then displays that single number.",
          "difficulty": "medium-hard",
          "hint": "Think about what the 'random 1 to 6' block does on each button press."
        },
        {
          "id": "w2-q5",
          "question": "What is the chance of rolling a 4 on a fair six-sided die?",
          "type": "multiple-choice",
          "options": ["1 in 2", "1 in 4", "1 in 6", "1 in 10"],
          "correct": 2,
          "explanation": "Each face has equal probability: 1/6.",
          "difficulty": "medium",
          "hint": "How many faces are there?"
        },
        {
          "id": "w2-q6",
          "question": "If a die is rolled 60 times, about how many 3s would you expect?",
          "type": "multiple-choice",
          "options": ["About 5", "About 10", "About 20", "About 30"],
          "correct": 1,
          "explanation": "Expected frequency ≈ total × probability = 60 × 1/6 = 10.",
          "difficulty": "medium",
          "hint": "Multiply the number of trials by the chance."
        },
        {
          "id": "w2-q7",
          "question": "Which block lets you react to movement of the micro:bit?",
          "type": "multiple-choice",
          "options": ["on shake", "on start", "forever", "show number"],
          "correct": 0,
          "explanation": "The accelerometer triggers the shake event.",
          "difficulty": "medium",
          "hint": "It’s tied to the accelerometer."
        },
        {
          "id": "w2-q8",
          "question": "Match the event to when it triggers.",
          "type": "drag-drop",
          "terms": ["on start", "on button A pressed", "on shake", "forever"],
          "definitions": ["Runs when device turns on", "Runs when A is pressed", "Runs when moved", "Runs continuously"],
          "correctMatches": [0, 1, 2, 3],
          "explanation": "Each event maps to a different trigger; forever has no trigger.",
          "difficulty": "medium",
          "hint": "Think: beginning, button, motion, always."
        },
        {
          "id": "w2-q9",
          "question": "What message might the micro:bit show when you press Button A?",
          "type": "multiple-choice",
          "code": "on button A pressed\n  set x to random 1 to 10\n  if x > 5 then\n    show string \"Big\"\n  else\n    show string \"Small\"",
          "options": [
            "It shows 'Big' or 'Small' depending on the random number",
            "It always shows 'Big' because 10 is the largest number",
            "It shows 'Small' because x starts at 0",
            "It shows both 'Big' and 'Small' one after another"
          ],
          "correct": 0,
          "explanation": "Each time you press A, a random number 1–10 is picked. If that number is greater than 5, 'Big' appears; otherwise 'Small'.",
          "difficulty": "medium-hard",
          "hint": "Remember: '>' means greater than."
        },
        {
          "id": "w2-q10",
          "question": "What is shown for this coin flip?",
          "type": "multiple-choice",
          "code": "on button B pressed\n  set flip to random 0 to 1\n  if flip = 0 then\n    show string \"Heads\"\n  else\n    show string \"Tails\"",
          "options": ["Heads only", "Tails only", "Heads or Tails", "Error"],
          "correct": 2,
          "explanation": "Random 0 to 1 maps perfectly to a fair coin.",
          "difficulty": "hard",
          "hint": "Two possible values → two possible messages."
        },
        {
          "id": "w2-q11",
          "question": "When this code runs, you sometimes see two different numbers flash quickly. Why?",
          "type": "multiple-choice",
          "code": "on button A pressed\n  show number random 1 to 6\n  show number random 1 to 6",
          "options": [
            "Because each call to 'random 1 to 6' generates a new value right away",
            "Because the same random value is shown twice at high speed",
            "Because the micro:bit remembers the first number and repeats it",
            "Because the button is pressed for too long"
          ],
          "correct": 0,
          "explanation": "Both lines use 'random 1 to 6', so two independent random numbers are shown in quick succession.",
          "difficulty": "hard",
          "hint": "Does the code reuse the first random value or call it again?"
        },
        {
          "id": "w2-q12",
          "question": "After pressing Button A five times, what number will the micro:bit show, and why?",
          "type": "multiple-choice",
          "code": "on start\n  set count to 0\non button A pressed\n  change count by 1\n  show number count",
          "options": [
            "5, because 'count' increases by 1 each time and keeps its value",
            "1, because 'count' resets to 0 on every press",
            "A random number between 1 and 5",
            "0, because the program only runs 'on start'"
          ],
          "correct": 0,
          "explanation": "The variable 'count' keeps increasing — 1, 2, 3, 4, 5 — with each press.",
          "difficulty": "hard",
          "hint": "Does 'set count to 0' happen each time you press the button?"
        }
      ]
    },
    "3": {
      "title": "Week 3: Conditionals (If/Else)",
      "description": "Comparisons, branching, fairness. Rock–Paper–Scissors.",
      "locked": false,
      "questions": [
        {
          "id": "w3-q1",
          "question": "What does the else part of an if–else do?",
          "type": "multiple-choice",
          "options": ["Runs when the if is true", "Runs when the if is false", "Runs always", "Never runs"],
          "correct": 1,
          "explanation": "Else handles the “otherwise” case when the if condition isn’t met.",
          "difficulty": "easy",
          "hint": "Think: backup plan."
        },
        {
          "id": "w3-q2",
          "question": "Look at this code. Which symbol is checking if the score is exactly 10?",
          "type": "multiple-choice",
          "code": "if score = 10 then\n  show string \"Winner!\"",
          "options": [">", "<", "=", "≠"],
          "correct": 2,
          "explanation": "The '=' sign checks equality.",
          "difficulty": "hard",
          "hint": "It compares, not adds."
        },
        {
          "id": "w3-q3",
          "question": "The micro:bit picks a random number 1 to 3 to play Rock–Paper–Scissors. What must the code do next to decide who wins?",
          "type": "multiple-choice",
          "options": [
            "Use if–else blocks to compare your choice and the random pick",
            "Use 'show string' to display all three options at once",
            "Add 3 to the random number to get the winner",
            "Wait 1 second before showing a smiley"
          ],
          "correct": 0,
          "explanation": "After choosing randomly, the program compares both choices using if–else logic.",
          "difficulty": "medium-hard",
          "hint": "How does the program decide which move wins?"
        },
        {
          "id": "w3-q4",
          "question": "What message appears for x = 7?",
          "type": "multiple-choice",
          "code": "on button A pressed\n  set x to 7\n  if x > 5 then\n    show string \"Big\"\n  else\n    show string \"Small\"",
          "options": ["Big", "Small", "Both", "Nothing"],
          "correct": 0,
          "explanation": "7 > 5 is true, so it shows “Big”.",
          "difficulty": "medium",
          "hint": "Is 7 greater than 5?"
        },
        {
          "id": "w3-q5",
          "question": "What’s the output if number = 5?",
          "type": "multiple-choice",
          "code": "set number to 5\nif number < 5 then\n  show string \"Low\"\nelse if number = 5 then\n  show string \"Equal\"\nelse\n  show string \"High\"",
          "options": ["Low", "Equal", "High", "Nothing"],
          "correct": 1,
          "explanation": "The second condition matches exactly.",
          "difficulty": "medium",
          "hint": "Check the exact equality branch."
        },
        {
          "id": "w3-q6",
          "question": "If a coin is fair, what’s the chance of Heads?",
          "type": "multiple-choice",
          "options": ["1/2", "1/3", "1/6", "Depends on the day"],
          "correct": 0,
          "explanation": "A fair coin has two equally likely outcomes.",
          "difficulty": "medium",
          "hint": "How many equally likely outcomes are there?"
        },
        {
          "id": "w3-q7",
          "question": "Which condition correctly checks for a tie?",
          "type": "multiple-choice",
          "code": "set player to \"Rock\"\nset computer to \"Rock\"\nif ???? then\n  show string \"Tie!\"",
          "options": ["player ≠ computer", "player = computer", "computer = \"Paper\"", "player = \"Scissors\""],
          "correct": 1,
          "explanation": "A tie occurs when both choices are equal.",
          "difficulty": "medium",
          "hint": "Same on both sides."
        },
        {
          "id": "w3-q8",
          "question": "Match the comparison to an example that makes it true.",
          "type": "drag-drop",
          "terms": ["x > 3", "x = 5", "x < 2", "x ≠ 4"],
          "definitions": ["x is 6", "x is 5", "x is 1", "x is 3"],
          "correctMatches": [0, 1, 2, 3],
          "explanation": "Each example satisfies the comparison shown.",
          "difficulty": "medium",
          "hint": "Plug in the numbers mentally."
        },
        {
          "id": "w3-q9",
          "question": "What does it show when A is pressed?",
          "type": "multiple-choice",
          "code": "on button A pressed\n  set roll to random 1 to 6\n  if roll = 6 then\n    show icon \"trophy\"\n  else\n    show number roll",
          "options": ["Always a trophy", "Always the number", "Trophy for 6; otherwise the number", "Nothing"],
          "correct": 2,
          "explanation": "It branches on a special case: a roll of 6.",
          "difficulty": "hard",
          "hint": "Which value triggers the special icon?"
        },
        {
          "id": "w3-q10",
          "question": "What will the display show?",
          "type": "multiple-choice",
          "code": "set a to 3\nset b to 7\nif a > b then\n  show string \"A\"\nelse if a = b then\n  show string \"Equal\"\nelse\n  show string \"B\"",
          "options": ["A", "Equal", "B", "Nothing"],
          "correct": 2,
          "explanation": "3 > 7 is false; 3 = 7 is false; it falls through to “B”.",
          "difficulty": "hard",
          "hint": "Compare 3 and 7 in order."
        },
        {
          "id": "w3-q11",
          "question": "Why can’t this ever show \"B\"?",
          "type": "multiple-choice",
          "code": "set n to 90\nif n >= 90 then\n  show string \"A\"\nelse if n >= 90 then\n  show string \"B\"\nelse\n  show string \"C\"",
          "options": [
            "Because the second condition repeats the first",
            "Because n isn’t a number",
            "Because else must come first",
            "Because >= doesn’t work"
          ],
          "correct": 0,
          "explanation": "The second branch is unreachable since it duplicates the first condition.",
          "difficulty": "hard",
          "hint": "Look for a repeated test."
        },
        {
          "id": "w3-q12",
          "question": "What message appears when the code runs?",
          "type": "multiple-choice",
          "code": "set temp to 20\nset light to 30\nif temp >= 18 and light >= 50 then\n  show string \"Go Outside\"\nelse\n  show string \"Stay In\"",
          "options": ["Go Outside", "Stay In", "Both", "Nothing"],
          "correct": 1,
          "explanation": "Both conditions must be true; light is too low.",
          "difficulty": "hard",
          "hint": "and means both must pass."
        }
      ]
    },
    "4": {
      "title": "Week 4: Variables & Thresholds",
      "description": "Storing values, comparing to limits, using sensors (light & temperature).",
      "locked": false,
      "questions": [
        {
          "id": "w4-q1",
          "question": "What is a variable used for in MakeCode?",
          "type": "multiple-choice",
          "options": [
            "To store a value that can change while the program runs",
            "To repeat blocks over and over",
            "To read values from sensors like light or temperature",
            "To play sounds or show icons"
          ],
          "correct": 0,
          "explanation": "A variable is a named space in memory where the program keeps a value that can change, such as a score or sensor reading.",
          "difficulty": "medium",
          "hint": "It’s like a labelled box you can open and replace what’s inside."
        },
        {
          "id": "w4-q2",
          "question": "What does 'change score by 5' do if score was 10?",
          "type": "multiple-choice",
          "options": ["Sets it to 5", "Sets it to 10", "Sets it to 15", "Sets it to 50"],
          "correct": 2,
          "explanation": "It adds 5 to the current value: 10 + 5 = 15.",
          "difficulty": "easy",
          "hint": "This operation adds, it doesn’t replace."
        },
        {
          "id": "w4-q3",
          "question": "In a micro:bit program, what does a threshold represent?",
          "type": "multiple-choice",
          "options": [
            "A limit value that decides when something should happen",
            "The exact sensor reading at the start of the program",
            "A random number between two limits",
            "The highest possible temperature the micro:bit can read"
          ],
          "correct": 0,
          "explanation": "A threshold is a boundary value used to trigger an action — for example, if light level < 100, turn on a torch.",
          "difficulty": "medium",
          "hint": "It’s the line between 'go' and 'stop' conditions."
        },
        {
          "id": "w4-q4",
          "question": "If the classroom light level is 80, what message appears when this code runs?",
          "type": "multiple-choice",
          "code": "set lightLevel to light level\nif lightLevel < 50 then\n  show string \"Too Dark!\"\nelse\n  show string \"OK\"",
          "options": ["\"Too Dark!\"", "\"OK\"", "\"Too Dark!\" then \"OK\"", "Nothing"],
          "correct": 1,
          "explanation": "The condition is false when lightLevel = 80, so it shows 'OK'.",
          "difficulty": "hard",
          "hint": "Which branch runs when the condition is false?"
        },
        {
          "id": "w4-q5",
          "question": "What is health after running?",
          "type": "multiple-choice",
          "code": "set health to 100\nchange health by -20\nset health to health * 2",
          "options": ["60", "80", "160", "200"],
          "correct": 2,
          "explanation": "100 - 20 = 80; 80 × 2 = 160.",
          "difficulty": "medium",
          "hint": "Apply steps in order."
        },
        {
          "id": "w4-q6",
          "question": "Match each variable operation to its effect.",
          "type": "drag-drop",
          "terms": ["set score to 10", "change score by 5", "set score to score + 1", "set score to 0"],
          "definitions": ["Makes score 10", "Adds 5 to score", "Adds 1 to score", "Resets score to 0"],
          "correctMatches": [0, 1, 2, 3],
          "explanation": "“set” replaces the value; “change by” adds/subtracts.",
          "difficulty": "medium",
          "hint": "Replace vs. add."
        },
        {
          "id": "w4-q7",
          "question": "What will display when temp = 35?",
          "type": "multiple-choice",
          "code": "set temp to temperature (onboard sensor)\nset threshold to 30\nif temp > threshold then\n  show string \"Too Hot!\"\nelse\n  show string \"OK\"",
          "options": ["Too Hot!", "OK", "35", "Nothing"],
          "correct": 0,
          "explanation": "35 > 30 is true, so it shows 'Too Hot!'.",
          "difficulty": "medium",
          "hint": "Compare the numbers directly."
        },
        {
          "id": "w4-q8",
          "question": "Which code correctly stores the current light sensor reading into a variable?",
          "type": "multiple-choice",
          "options": [
            "set light to light level",
            "set light to 50",
            "set light to 'Light'",
            "set light to temperature"
          ],
          "correct": 0,
          "explanation": "The command stores the live sensor reading into the variable.",
          "difficulty": "medium-hard",
          "hint": "Only one uses the actual light sensor reading."
        },
        {
          "id": "w4-q9",
          "question": "Where does the temperature value come from in micro:bit projects?",
          "type": "multiple-choice",
          "options": ["Onboard temperature sensor", "An external sensor is mandatory", "The light sensor", "The USB cable"],
          "correct": 0,
          "explanation": "We use the micro:bit’s onboard sensor.",
          "difficulty": "hard",
          "hint": "No extra hardware this week."
        },
        {
          "id": "w4-q10",
          "question": "You want your plant monitor to warn only when it’s cold and dark. Which line should fill the blank?",
          "type": "multiple-choice",
          "code": "set temp to temperature (onboard)\nset light to light level (onboard)\nif __________ then\n  show string \"Cold & Dark\"",
          "options": ["temp < 18", "light < 50", "temp < 18 and light < 50", "temp < 18 or light < 50"],
          "correct": 2,
          "explanation": "and requires both conditions to be true.",
          "difficulty": "hard",
          "hint": "Which condition checks that both sensors are below their limits?"
        },
        {
          "id": "w4-q11",
          "question": "What’s the logic mistake?",
          "type": "multiple-choice",
          "code": "set temp to temperature\nif temp > 30 and temp > 40 then\n  show string \"Hot!\"\nelse\n  show string \"OK\"",
          "options": ["Nothing’s wrong", "Use or instead of and", "The first comparison is redundant; effectively temp > 40", "Use = instead of >"],
          "correct": 2,
          "explanation": "If both conditions are '>', the larger threshold dominates.",
          "difficulty": "hard",
          "hint": "Which comparison is stricter?"
        },
        {
          "id": "w4-q12",
          "question": "What does the code display?",
          "type": "multiple-choice",
          "code": "set points to 10\nchange points by 15\nset points to points * 2\nshow number points",
          "options": ["25", "50", "35", "40"],
          "correct": 1,
          "explanation": "10 + 15 = 25; 25 × 2 = 50.",
          "difficulty": "hard",
          "hint": "Follow each step carefully."
        }
      ]
    },
    "5": {
      "title": "Week 5: Loops & First Game",
      "description": "repeat/for/while/forever loops; timing (millis); sprites and simple game logic.",
      "locked": false,
      "questions": [
        {
          "id": "w5-q1",
          "question": "What does a FOREVER loop do?",
          "type": "multiple-choice",
          "options": ["Runs once", "Runs a fixed number of times", "Keeps running continuously", "Never runs"],
          "correct": 2,
          "explanation": "It repeats as long as the program is active.",
          "difficulty": "easy",
          "hint": "Think: the main heartbeat of a game."
        },
        {
          "id": "w5-q2",
          "question": "What does 'repeat 3 times' do?",
          "type": "multiple-choice",
          "options": ["Runs forever", "Runs exactly 3 times", "Runs randomly", "Runs until a condition is met"],
          "correct": 1,
          "explanation": "It iterates a fixed number of times.",
          "difficulty": "easy",
          "hint": "Count the passes."
        },
        {
          "id": "w5-q3",
          "question": "What is an ITERATION?",
          "type": "multiple-choice",
          "options": ["A type of sprite", "One pass through the loop", "A kind of bug", "A timing unit"],
          "correct": 1,
          "explanation": "Each cycle of a loop is an iteration.",
          "difficulty": "easy",
          "hint": "Imagine stepping through a dance routine once."
        },
        {
          "id": "w5-q4",
          "question": "What will this code make the micro:bit do?",
          "type": "multiple-choice",
          "code": "forever\n  repeat 5 times\n    show icon \"heart\"\n    pause 200\n    show icon \"small heart\"\n    pause 200\n  clear screen\n  pause 800",
          "options": [
            "Show one heart that never changes",
            "Show five heartbeats, then pause briefly, repeating forever",
            "Show a random sequence of icons",
            "Show five hearts once and then stop"
          ],
          "correct": 1,
          "explanation": "The inner 'repeat 5' loop creates five quick heartbeats; the outer 'forever' repeats the pattern.",
          "difficulty": "medium-hard",
          "hint": "Think about how the inner loop runs inside the forever loop."
        },
        {
          "id": "w5-q5",
          "question": "What numbers will be shown?",
          "type": "multiple-choice",
          "code": "set counter to 1\nrepeat 5 times\n  show number counter\n  change counter by 1\n  pause 500",
          "options": ["1,2,3,4,5", "0,1,2,3,4", "5,4,3,2,1", "Always 1"],
          "correct": 0,
          "explanation": "It starts at 1 and increments after each display.",
          "difficulty": "medium",
          "hint": "Check the starting value."
        },
        {
          "id": "w5-q6",
          "question": "What does using 'millis' (elapsed ms) help with?",
          "type": "multiple-choice",
          "options": [
            "Drawing sprites only",
            "Measuring time between actions for smooth speed control",
            "Changing the screen size",
            "Fixing syntax errors"
          ],
          "correct": 1,
          "explanation": "millis/elapsed time lets you time updates precisely (e.g., speed).",
          "difficulty": "medium",
          "hint": "Think: timers and intervals."
        },
        {
          "id": "w5-q7",
          "question": "What movement happens on the LED screen?",
          "type": "multiple-choice",
          "code": "set sprite to create sprite at x 0 y 2\nrepeat 4 times\n  change sprite x by 1\n  pause 150",
          "options": ["Moves left 4 steps", "Moves right 4 steps", "Does not move", "Teleports randomly"],
          "correct": 1,
          "explanation": "Changing x by +1 four times moves it 4 columns to the right.",
          "difficulty": "medium-hard",
          "hint": "Positive x goes right; negative x goes left."
        },
        {
          "id": "w5-q8",
          "question": "Match each loop type to what it does in a program.",
          "type": "drag-drop",
          "terms": ["forever", "repeat N times", "while (condition)", "for index 1..N"],
          "definitions": [
            "Repeats a specific number of times, then stops",
            "Steps through numbers in order, useful for counting or indexing",
            "Keeps running endlessly while the program is active",
            "Repeats as long as a test remains true"
          ],
          "correctMatches": [2, 0, 3, 1],
          "explanation": "forever never ends; repeat N stops; while depends on a condition; for iterates a sequence.",
          "difficulty": "medium-hard",
          "hint": "Think: endless / fixed / condition / counting."
        },
        {
          "id": "w5-q9",
          "question": "How many times will it run?",
          "type": "multiple-choice",
          "code": "set c to 10\nwhile c > 5\n  show number c\n  change c by -2",
          "options": ["2 times", "3 times", "5 times", "Forever"],
          "correct": 1,
          "explanation": "c takes values 10, 8, 6 then stops (3 passes).",
          "difficulty": "hard",
          "hint": "Track c step by step."
        },
        {
          "id": "w5-q10",
          "question": "This loop is part of a game timer. What happens when the code runs?",
          "type": "multiple-choice",
          "code": "set counter to 9\nwhile counter > 0\n    if counter < 0 then\n        change counter by -1\n    pause 100",
          "options": ["Counts to 0 and stops", "Infinite loop", "Runs exactly 9 times", "Crashes immediately"],
          "correct": 1,
          "explanation": "The if never runs (condition counter < 0 is never true), so counter never changes; loop never ends.",
          "hint": "Does the if condition ever become true?",
          "difficulty": "hard"
        },
        {
          "id": "w5-q11",
          "question": "What is printed at the end?",
          "type": "multiple-choice",
          "code": "set s to 0\nfor i from 1 to 4\n  change s by i\nshow number s",
          "options": ["4", "6", "10", "12"],
          "correct": 2,
          "explanation": "1+2+3+4 = 10.",
          "difficulty": "hard",
          "hint": "Add the range 1..4."
        },
        {
          "id": "w5-q12",
          "question": "What pattern of beeps will you hear?",
          "type": "multiple-choice",
          "code": "set wait to 600\nrepeat 3 times\n  play tone C\n  pause wait\n  change wait by -200",
          "options": ["Equal spacing", "Faster each time", "One long beep", "Only once"],
          "correct": 1,
          "explanation": "The pause shrinks each iteration, so beeps come quicker.",
          "difficulty": "hard",
          "hint": "Watch the pause value change."
        }
      ]
    },
    "6": {
      "title": "Week 6: Core Mechanics — Loops, Logic, Timing & Coordinates",
      "description": "Reusable challenge set mixing loops, variables, timing, coordinates, and debugging.",
      "locked": false,
      "questions": [
        {
          "id": "w6-q1",
          "question": "A loop updates a sprite once per iteration and then pauses for 80 ms. Approximately how many updates happen in 2 seconds?",
          "type": "multiple-choice",
          "options": ["20", "25", "40", "80"],
          "correct": 1,
          "explanation": "2,000 ms / 80 ms ≈ 25 iterations (rounding down).",
          "difficulty": "medium",
          "hint": "Convert seconds to milliseconds first."
        },
        {
          "id": "w6-q2",
          "question": "A sprite starts at x = 2 on the bottom row of the LED grid. The code runs three times. Where will the sprite end up?",
          "type": "multiple-choice",
          "code": "set x = 2\nrepeat 3 times\n  if x > 0 then change x by -1\nend",
          "options": ["Off screen (past the edge)", "At the left edge", "One step left of the start position", "Same place as it started"],
          "correct": 1,
          "explanation": "Each loop step moves the sprite one space left while x > 0. After two moves it reaches x = 0, and the last if does nothing because x is no longer greater than 0.",
          "difficulty": "medium",
          "hint": "Imagine the sprite moving left one step each loop until it reaches the edge."
        },
        {
          "id": "w6-q3",
          "question": "A program increments the score when an event occurs. It begins with score = 3 and speed = 200 ms. The event happens 7 times; each time the score increments by 1 and the speed decreases by 10. What are the final values?",
          "type": "multiple-choice",
          "options": [
            "score = 7, speed = 130",
            "score = 10, speed = 130",
            "score = 10, speed = 120",
            "score = 7, speed = 120"
          ],
          "correct": 1,
          "explanation": "Increment means increase — here the score increases by 1 each time (3 + 7 = 10). The speed decreases by 10 each time (200 − 70 = 130 ms).",
          "difficulty": "medium",
          "hint": "Increment means 'increase by' — think about how both values change each event."
        },
        {
          "id": "w6-q4",
          "question": "Look at this game loop. What happens when the sprite touches an obstacle?",
          "type": "multiple-choice",
          "code": "forever\n  move sprite by 1\n  if sprite is touching obstacle then\n    game over\n  show number score",
          "options": [
            "The score shows one more time after game over",
            "The score keeps updating forever",
            "The game stops immediately after game over, so anything after that line doesn’t run",
            "The loop restarts from the top after game over"
          ],
          "correct": 2,
          "explanation": "In MakeCode, 'game over' ends the program. Any code after it — even in the same loop — will not run.",
          "difficulty": "hard",
          "hint": "When the game ends, does the micro:bit still keep running the forever loop?"
        },
        {
          "id": "w6-q5",
          "question": "A micro:bit should play an alarm only if it’s dark and Button A is pressed. When will the sound play?",
          "type": "multiple-choice",
          "code": "if light < 50 and button A is pressed then\n    play sound 'alarm'\nelse\n    stop all sounds",
          "options": [
            "Only when it’s dark and Button A is pressed",
            "Whenever it’s dark, even if Button A isn’t pressed",
            "Whenever Button A is pressed, no matter the light",
            "It never plays because the light test comes first"
          ],
          "correct": 0,
          "explanation": "Both conditions must be true at the same time — dark and button pressed — for the alarm to play. The 'and' block joins two tests together.",
          "difficulty": "medium-hard",
          "hint": "Both parts of the 'and' must be true together."
        },
        {
          "id": "w6-q6",
          "question": "What is the value of c after the loop finishes?",
          "type": "multiple-choice",
          "code": "set c = 1\nrepeat 5 times\n  change c by 2\nend",
          "options": ["7", "9", "11", "12"],
          "correct": 2,
          "explanation": "c increases by 2 five times: 1 + 10 = 11.",
          "difficulty": "medium",
          "hint": "Repeated addition."
        },
        {
          "id": "w6-q7",
          "question": "About how many times does count increase during ~1 second of running?",
          "type": "multiple-choice",
          "code": "set count = 0\nset start = millis()\nwhile millis() < start + 1000\n  change count by 1\n  pause (50)\nend",
          "options": ["10", "15", "20", "50"],
          "correct": 2,
          "explanation": "≈ 1000/50 = 20 increments (ignoring small overheads).",
          "difficulty": "hard",
          "hint": "Divide total time by pause time."
        },
        {
          "id": "w6-q8",
          "question": "How many times does 'plot' run on a 5×5 LED grid?",
          "type": "multiple-choice",
          "code": "for x from 0 to 4\n  for y from 0 to 4\n    plot (x, y)\n  end\nend",
          "options": ["5", "10", "20", "25"],
          "correct": 3,
          "explanation": "5×5 = 25 total iterations.",
          "difficulty": "easy",
          "hint": "Multiply the sizes of both ranges."
        },
        {
          "id": "w6-q9",
          "question": "After the loop, what are x and dir?",
          "type": "multiple-choice",
          "code": "set x = 2\nset dir = +1\nrepeat 6 times\n  if x = 4 then set dir = -1\n  if x = 0 then set dir = +1\n  change x by dir\nend",
          "options": [
            "x = 0, dir = -1",
            "x = 0, dir = +1",
            "x = 2, dir = -1",
            "x = 4, dir = -1"
          ],
          "correct": 0,
          "explanation": "Trace: 2→3→4 (flip next)→3→2→1→0; after 6 steps, x = 0 and dir is -1 (flip would occur next).",
          "difficulty": "hard",
          "hint": "Check when dir flips: before or after moving?"
        },
        {
          "id": "w6-q10",
          "question": "Why does the score remain 0?",
          "type": "multiple-choice",
          "code": "set score = 0\nforever\n  if event then change score by 1\n  set score = 0\nend",
          "options": [
            "The event never happens",
            "The score is reset to 0 every loop iteration",
            "Variables cannot be changed inside forever",
            "The change block only works once"
          ],
          "correct": 1,
          "explanation": "The reset happens on every pass, wiping any increment.",
          "difficulty": "medium",
          "hint": "Look at where 'set score = 0' is placed."
        },
        {
          "id": "w6-q11",
          "question": "A sprite starts at x = 1 on the bottom row of the micro:bit screen. The code below runs twice. Where does the sprite end up?",
          "type": "multiple-choice",
          "code": "set x = 1\nrepeat 2 times\n  if x < 3 then change x by 2 else change x by -1\nend",
          "options": ["x = 0", "x = 1", "x = 2", "x = 3"],
          "correct": 2,
          "explanation": "First loop: 1 < 3 so x becomes 3. Second loop: 3 < 3 is false, so x changes by −1 and becomes 2. Final x = 2.",
          "difficulty": "medium-hard",
          "hint": "Follow each step: check the condition, then change x accordingly."
        },
        {
          "id": "w6-q12",
          "question": "A sprite moves across the screen in a forever loop. Where should the 'change score by 1' block go if you want the score to increase every time the sprite reaches the edge?",
          "type": "multiple-choice",
          "options": [
            "Inside the loop, after checking if sprite is touching the edge",
            "At the very top of the loop, before any checks",
            "Outside the loop, after the forever block",
            "Anywhere in the code — it doesn’t matter"
          ],
          "correct": 0,
          "explanation": "You need to check the edge first, then increase the score inside the loop when that condition is true. Code outside the loop only runs once at the start.",
          "difficulty": "medium",
          "hint": "Forever loops repeat actions — things outside them happen only once."
        }
      ]
    }
  }
};
