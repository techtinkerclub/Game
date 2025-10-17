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
        /* PASTE your full Week 1 questions[] exactly as you provided */
      ],
      "config": {
        "hearts": 3
      }
    },
    "2": {
      "title": "Week 2: Events & Random",
      "description": "Button events, dice rolling, randomness, simple probability.",
      "locked": false,
      "questions": [
        /* Week 2 questions[] */
      ]
    },
    "3": {
      "title": "Week 3: Conditionals (If/Else)",
      "description": "Comparisons, branching, fairness. Rock–Paper–Scissors.",
      "locked": false,
      "questions": [
        /* Week 3 questions[] */
      ]
    },
    "4": {
      "title": "Week 4: Variables & Thresholds",
      "description": "Storing values, comparing to limits, using sensors (light & temperature).",
      "locked": false,
      "questions": [
        /* Week 4 questions[] */
      ]
    },
    "5": {
      "title": "Week 5: Loops & First Game",
      "description": "repeat/for/while/forever loops; timing (millis); sprites and simple game logic.",
      "locked": false,
      "questions": [
        /* Week 5 questions[] */
      ]
    },
    "6": {
      "title": "Week 6: Core Mechanics — Loops, Logic, Timing & Coordinates",
      "description": "Reusable challenge set mixing loops, variables, timing, coordinates, and debugging.",
      "locked": false,
      "questions": [
        /* Week 6 questions[] */
      ]
    },

    /* ====== Weeks 7–12 (optional now) ======
       Add them over time exactly like Weeks 1–6.
       Example empty shell (leave questions empty until ready):
    */
    "7": { "title":"Week 7", "description":"TBD", "locked": true, "questions": [] },
    "8": { "title":"Week 8", "description":"TBD", "locked": true, "questions": [] },
    "9": { "title":"Week 9", "description":"TBD", "locked": true, "questions": [] },
    "10": { "title":"Week 10", "description":"TBD", "locked": true, "questions": [] },
    "11": { "title":"Week 11", "description":"TBD", "locked": true, "questions": [] },
    "12": { "title":"Week 12", "description":"TBD", "locked": true, "questions": [] },

    /* ====== Week 13 — FINAL BATTLE ======
       Pulls from all earlier weeks (1–12), shuffles, and turns up the difficulty.
       You can also add unique Week 13-only questions by putting them in questions[].
    */
    "13": {
      "title": "Week 13: Final Battle — The Debug Dragon",
      "description": "The ultimate test: mixed topics, faster decisions, bigger boss.",
      "locked": true,
      "questions": [
        /* (Optional) Add extra unique hard questions here, they’ll be added on top of the mixed pool */
      ],
      "config": {
        "hearts": 4,
        "hpMode": "multiplier",
        "hpMultiplier": 1.5,           /* boss HP is 1.5× total questions */
        "streakBonusEvery": 2,         /* combos every 2 correct answers */
        "quickBonusWindowMs": 5000,    /* must answer within 5s to earn quick bonus */
        "enableCombos": true,
        "timerPerQuestionSec": 12,     /* hard per-question timer */
        "shuffleQuestions": true,
        "mixFromWeeks": ["1","2","3","4","5","6","7","8","9","10","11","12"],
        "bonusOnPerfect": 3,           /* ⭐ reward boost */
        "bonusOnClear": 2
      }
    }
  }
};
