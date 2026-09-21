# Tech Tinker: System Rescue

A small, dependency-free mission game for revising the coding ideas covered in Tech Tinker Club's micro:bit sessions. Children restore six glitched lab systems by mastering coding challenges.

## What it does

- Six progressive system-repair missions, one for each teaching week.
- 72 questions stored separately from the game engine.
- Multiple-choice and matching questions.
- Three-point system-integrity mechanic with missed challenges returning for a second chance.
- Three-star level ratings, best times, streaks and local progress.
- Two learning hints per battle.
- Keyboard, mouse, touch and mobile support.
- No accounts, server, build step or external JavaScript dependencies.

## Files

- `index.html` — GitHub Pages entry point and accessible page structure.
- `Index.html` — backwards-compatible redirect to `index.html`.
- `styles.css` — responsive game styling.
- `game.js` — gameplay, progress, scoring and accessibility logic.
- `questions.js` — question bank/content.

## Running locally

Because the project is static, serve the repository with any simple local web server and open `index.html`. For example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Question data

Questions live in `window.TTC_DATA.weeks` inside `questions.js`.

Multiple-choice questions use:

```js
{
  id: "w1-q1",
  question: "Question text",
  type: "multiple-choice",
  options: ["A", "B", "C", "D"],
  correct: 0,
  explanation: "Why the answer is correct.",
  hint: "A useful prompt."
}
```

Matching questions retain the existing `drag-drop` data type for compatibility, but the UI deliberately uses tap/click matching so it works reliably on touchscreens and keyboards:

```js
{
  id: "w1-q6",
  question: "Match each term to its definition.",
  type: "drag-drop",
  terms: ["Event", "Sequence"],
  definitions: ["Something that triggers code", "Order of instructions"],
  correctMatches: [0, 1],
  explanation: "Explanation",
  hint: "Hint"
}
```

Each value in `correctMatches` is the definition index for the corresponding term.

## Progress and scoring

Progress is stored only in the browser's local storage.

- A system comes online only when every challenge has been mastered.
- A wrong answer costs one heart and the question is re-queued if the player still has hearts.
- 3 stars: no mistakes.
- 2 stars: one mistake.
- 1 star: level cleared with more mistakes.
- Replaying can improve a saved rating, but never reduces it.
- Existing `ttcBossBattleV2` progress is migrated to the v3 format.

## Maintenance checks

Before publishing question changes:

1. Keep question IDs unique.
2. For multiple choice, make sure `correct` points to a real option.
3. For matching, keep `terms`, `definitions` and `correctMatches` the same length.
4. Include an explanation and hint for every question.
5. Check the game at desktop width and around 390 px mobile width.
6. Test at least one multiple-choice question, one matching question, a wrong-answer retry, a hint and a completed level.

The project intentionally stays framework-free so it remains easy to understand, edit and host on GitHub Pages.
