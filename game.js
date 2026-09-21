/* ============================================================
   Tech Tinker Boss Battle — game engine v3
   Static, dependency-free and designed to run on GitHub Pages.
   ============================================================ */
(() => {
  'use strict';

  const DATA = window.TTC_DATA;
  if (!DATA || !DATA.weeks || typeof DATA.weeks !== 'object') {
    document.body.innerHTML = '<main style="padding:2rem;font-family:system-ui;color:white;background:#090d18;min-height:100vh"><h1>Game data could not be loaded</h1><p>Please check that <code>questions.js</code> is present and valid.</p></main>';
    return;
  }

  const STORAGE_KEY = 'ttcBossBattleV3';
  const LEGACY_STORAGE_KEY = 'ttcBossBattleV2';
  const DEFAULT_SETTINGS = Object.freeze({ timer: true });
  const SYSTEM_NAMES = ['Boot Sequence', 'Randomiser Core', 'Logic Router', 'Sensor Array', 'Loop Engine', 'Main Control'];
  const SYSTEM_PATTERNS = [
    ['00100','01110','10101','00100','01110'],
    ['10001','00000','00100','00000','10001'],
    ['00100','00100','11111','01010','10001'],
    ['00100','01110','11111','00100','00100'],
    ['01110','10001','10001','10001','01110'],
    ['10101','01110','11111','01110','10101']
  ];

  const byId = (id) => document.getElementById(id);
  const levelScreen = byId('screen-levels');
  const gameScreen = byId('screen-game');
  const resultsScreen = byId('screen-results');
  const levelGrid = byId('level-grid');

  let toastTimer = null;
  let timerTicker = null;
  let G = null;
  let inputLocked = false;
  let selectedMatchTerm = null;

  const state = loadState();

  function getWeekIds() {
    return Object.keys(DATA.weeks).sort((a, b) => Number(a) - Number(b));
  }

  function createFreshState() {
    return {
      version: 3,
      unlocked: ['1'],
      clears: {},
      best: {},
      ratings: {},
      settings: { ...DEFAULT_SETTINGS }
    };
  }

  function normaliseState(candidate) {
    const fresh = createFreshState();
    const ids = getWeekIds();
    if (!candidate || typeof candidate !== 'object') return fresh;

    const unlocked = Array.isArray(candidate.unlocked)
      ? candidate.unlocked.map(String).filter((id) => ids.includes(id))
      : ['1'];

    fresh.unlocked = Array.from(new Set(['1', ...unlocked]));
    fresh.clears = candidate.clears && typeof candidate.clears === 'object' ? { ...candidate.clears } : {};
    fresh.best = candidate.best && typeof candidate.best === 'object' ? { ...candidate.best } : {};
    fresh.ratings = candidate.ratings && typeof candidate.ratings === 'object' ? { ...candidate.ratings } : {};
    fresh.settings = {
      ...DEFAULT_SETTINGS,
      ...(candidate.settings && typeof candidate.settings === 'object' ? candidate.settings : {})
    };
    fresh.settings.timer = Boolean(fresh.settings.timer);

    for (const id of ids) {
      if (!fresh.clears[id]) delete fresh.clears[id];
      const rating = Number(fresh.ratings[id]);
      fresh.ratings[id] = Number.isFinite(rating) ? Math.max(0, Math.min(3, Math.round(rating))) : 0;
    }

    return fresh;
  }

  function migrateLegacyState() {
    try {
      const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!raw) return null;
      const legacy = JSON.parse(raw);
      const migrated = createFreshState();
      if (Array.isArray(legacy.unlocked)) migrated.unlocked = Array.from(new Set(['1', ...legacy.unlocked.map(String)]));
      if (legacy.clears && typeof legacy.clears === 'object') migrated.clears = { ...legacy.clears };
      if (legacy.best && typeof legacy.best === 'object') migrated.best = { ...legacy.best };
      if (legacy.settings && typeof legacy.settings === 'object') migrated.settings = { ...DEFAULT_SETTINGS, ...legacy.settings };
      for (const id of Object.keys(migrated.clears)) migrated.ratings[id] = 1;
      return migrated;
    } catch (_) {
      return null;
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return normaliseState(JSON.parse(raw));
    } catch (_) {
      // Fall through to a clean state or legacy migration.
    }
    return normaliseState(migrateLegacyState() || createFreshState());
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      // The game remains playable if storage is blocked.
    }
  }

  function totalStars() {
    return getWeekIds().reduce((sum, id) => sum + (Number(state.ratings[id]) || 0), 0);
  }

  function clearedCount() {
    return getWeekIds().filter((id) => Boolean(state.clears[id])).length;
  }

  function cleanWeekTitle(title, id) {
    const fallback = `Week ${id}`;
    if (!title) return fallback;
    return String(title).replace(new RegExp(`^Week\\s+${id}\\s*:\\s*`, 'i'), '').trim() || fallback;
  }

  function getWeekConfig(id) {
    const week = DATA.weeks[id] || {};
    return {
      hearts: 3,
      hints: 2,
      mixFromWeeks: [],
      shuffleQuestions: false,
      ...week.config
    };
  }

  function getQuestionListForWeek(id) {
    const week = DATA.weeks[id] || {};
    const cfg = getWeekConfig(id);
    let questions = [];

    if (Array.isArray(cfg.mixFromWeeks)) {
      for (const sourceId of cfg.mixFromWeeks) {
        const source = DATA.weeks[String(sourceId)];
        if (Array.isArray(source?.questions)) {
          questions.push(...source.questions.map((q) => ({ ...q, _origin: String(sourceId) })));
        }
      }
    }

    if (Array.isArray(week.questions)) {
      questions.push(...week.questions.map((q) => ({ ...q, _origin: id })));
    }

    const seen = new Set();
    questions = questions.filter((q, index) => {
      const key = q.id || `${q.question || 'question'}|${q.code || ''}|${index}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (cfg.shuffleQuestions) shuffle(questions);
    return questions;
  }

  function buildLedMatrix(index, stateName = 'ready') {
    const matrix = document.createElement('div');
    matrix.className = `led-matrix ${stateName}`;
    matrix.setAttribute('aria-hidden', 'true');
    const rows = SYSTEM_PATTERNS[index] || SYSTEM_PATTERNS[SYSTEM_PATTERNS.length - 1];
    rows.join('').split('').forEach((bit) => {
      const led = document.createElement('span');
      if (bit === '1') led.classList.add('on');
      matrix.appendChild(led);
    });
    return matrix;
  }

  function renderSystemMatrix(target, index, stateName = 'ready') {
    if (!target) return;
    target.replaceChildren(buildLedMatrix(index, stateName));
  }

  function renderHeaderStats() {
    const ids = getWeekIds();
    const maxStars = ids.length * 3;
    byId('stars').textContent = `⭐ ${totalStars()} / ${maxStars}`;
    byId('progress-pill').textContent = `${clearedCount()} / ${ids.length} online`;
  }

  function renderLevels() {
    levelGrid.replaceChildren();
    renderHeaderStats();

    const ids = getWeekIds();
    ids.forEach((id, index) => {
      const week = DATA.weeks[id] || {};
      const locked = !state.unlocked.includes(id) && !week.forceUnlock;
      const rating = Number(state.ratings[id]) || 0;
      const best = state.best[id] || {};
      const card = document.createElement('article');
      card.className = `card${locked ? ' locked' : ''}${state.clears[id] ? ' completed' : ''}`;

      const top = document.createElement('div');
      top.className = 'card-top';
      const weekNumber = document.createElement('div');
      weekNumber.className = 'week-number';
      weekNumber.textContent = `System ${id}`;
      const matrixState = locked ? 'locked' : state.clears[id] ? 'complete' : 'ready';
      top.append(weekNumber, buildLedMatrix(index, matrixState));

      const title = document.createElement('h3');
      title.textContent = SYSTEM_NAMES[index] || `System ${id}`;

      const topic = document.createElement('div');
      topic.className = 'card-topic';
      topic.textContent = cleanWeekTitle(week.title, id);

      const description = document.createElement('p');
      description.className = 'card-description';
      description.textContent = week.description || 'Coding challenge';

      const meta = document.createElement('div');
      meta.className = 'card-meta';
      const questionCount = getQuestionListForWeek(id).length;
      meta.innerHTML = `<span class="tag">${questionCount} challenges</span><span class="tag system-status ${locked ? 'offline' : state.clears[id] ? 'online' : 'ready'}">${locked ? 'OFFLINE' : state.clears[id] ? 'ONLINE' : 'READY'}</span>`;

      const stars = buildStars(rating, `Week ${id}: ${rating} of 3 stars`);
      stars.classList.add('level-stars');

      const footer = document.createElement('div');
      footer.className = 'card-footer';
      const info = document.createElement('div');
      info.className = locked ? 'lock-note' : 'best-time';
      if (locked) {
        const previous = ids[index - 1];
        info.textContent = previous ? `Restore System ${previous} to unlock` : 'Offline';
      } else if (best.seconds) {
        info.textContent = `Best ${formatTime(best.seconds)}`;
      } else if (state.clears[id]) {
        info.textContent = 'Online · improve your rating';
      } else {
        info.textContent = 'Awaiting repair';
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.disabled = locked;
      button.textContent = locked ? 'Offline' : state.clears[id] ? 'Re-run' : 'Repair';
      button.addEventListener('click', () => startLevel(id));

      footer.append(info, button);
      card.append(top, title, topic, description, meta, stars, footer);
      levelGrid.appendChild(card);
    });
  }

  function buildStars(rating, ariaLabel) {
    const wrap = document.createElement('div');
    wrap.setAttribute('role', 'img');
    wrap.setAttribute('aria-label', ariaLabel);
    for (let i = 1; i <= 3; i += 1) {
      const star = document.createElement('span');
      star.textContent = '★';
      if (i > rating) star.className = 'empty';
      wrap.appendChild(star);
    }
    return wrap;
  }

  function showScreen(name) {
    levelScreen.hidden = name !== 'levels';
    gameScreen.hidden = name !== 'game';
    resultsScreen.hidden = name !== 'results';
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  function startLevel(id) {
    const week = DATA.weeks[id];
    if (!week) return;

    const questions = getQuestionListForWeek(id);
    if (!questions.length) {
      toast('This level has no questions yet.');
      return;
    }

    const cfg = getWeekConfig(id);
    G = {
      id,
      week,
      cfg,
      questions,
      queue: questions.map((q) => ({ q, retry: false })),
      current: null,
      mastered: new Set(),
      hearts: Math.max(1, Number(cfg.hearts) || 3),
      streak: 0,
      bestStreak: 0,
      mistakes: 0,
      hintsLeft: Math.max(0, Number(cfg.hints) || 0),
      hintsUsed: 0,
      review: new Map(),
      startTime: Date.now(),
      finishedAt: null
    };

    inputLocked = false;
    selectedMatchTerm = null;
    const systemIndex = Number(id) - 1;
    byId('battle-week').textContent = week.title || `Week ${id}`;
    byId('battle-title').textContent = SYSTEM_NAMES[systemIndex] || `System ${id}`;
    byId('boss-label').textContent = `SYSTEM ${id} · REPAIR MODE`;
    renderSystemMatrix(byId('boss-avatar'), systemIndex, 'repairing');
    byId('explain').hidden = true;
    showScreen('game');
    renderHud();
    nextQuestion();
    startTimerTicker();
  }

  function startTimerTicker() {
    stopTimerTicker();
    timerTicker = window.setInterval(() => {
      if (G && !gameScreen.hidden) renderTimer();
    }, 500);
  }

  function stopTimerTicker() {
    if (timerTicker) window.clearInterval(timerTicker);
    timerTicker = null;
  }

  function updateRepairMatrix(mastered, total) {
    const leds = Array.from(byId('boss-avatar')?.querySelectorAll('.led-matrix span.on') || []);
    const litCount = total > 0 ? Math.round((leds.length * mastered) / total) : 0;
    leds.forEach((led, index) => led.classList.toggle('repaired', index < litCount));
  }

  function renderTimer() {
    if (!G) return;
    const elapsed = Math.max(0, Math.floor(((G.finishedAt || Date.now()) - G.startTime) / 1000));
    byId('timer').textContent = formatTime(elapsed);
    byId('timer-wrap').hidden = !state.settings.timer;
  }

  function renderHud() {
    if (!G) return;

    const hearts = byId('hearts');
    hearts.replaceChildren();
    for (let i = 0; i < G.cfg.hearts; i += 1) {
      const heart = document.createElement('span');
      heart.className = `heart${i >= G.hearts ? ' off' : ''}`;
      heart.textContent = '◆';
      heart.setAttribute('aria-hidden', 'true');
      hearts.appendChild(heart);
    }
    hearts.setAttribute('aria-label', `${G.hearts} of ${G.cfg.hearts} integrity points remaining`);

    const total = G.questions.length;
    const mastered = G.mastered.size;
    const repairPercent = total ? Math.max(0, (mastered / total) * 100) : 0;
    const hpBar = document.querySelector('.hp-bar');
    byId('hp').style.width = `${repairPercent}%`;
    hpBar?.setAttribute('aria-valuenow', String(Math.round(repairPercent)));
    byId('boss-hp-text').textContent = `${mastered} / ${total} repaired`;
    byId('boss-avatar')?.style.setProperty('--repair-progress', `${repairPercent}%`);
    updateRepairMatrix(mastered, total);
    byId('mastered').textContent = `${mastered} / ${total}`;
    byId('streak').textContent = String(G.streak);
    byId('hintLeft').textContent = String(G.hintsLeft);
    byId('useHint').disabled = G.hintsLeft <= 0 || inputLocked || !G.current?.q?.hint;
    renderTimer();
  }

  function nextQuestion() {
    if (!G) return;
    if (G.mastered.size >= G.questions.length) {
      finishLevel(false);
      return;
    }

    const item = G.queue.shift();
    if (!item) {
      // Defensive recovery: requeue any question not yet mastered.
      G.queue = G.questions
        .filter((q) => !G.mastered.has(questionKey(q)))
        .map((q) => ({ q, retry: true }));
      if (!G.queue.length) {
        finishLevel(false);
        return;
      }
      G.current = G.queue.shift();
    } else {
      G.current = item;
    }

    inputLocked = false;
    selectedMatchTerm = null;
    const feedback = byId('explain');
    feedback.hidden = true;
    feedback.className = 'feedback';
    feedback.replaceChildren();

    renderQuestion(G.current.q, G.current.retry);
    renderHud();
  }

  function renderQuestion(q, isRetry) {
    const panel = byId('qpanel');
    panel.replaceChildren();

    const head = document.createElement('div');
    head.className = 'question-head';
    const count = document.createElement('div');
    count.className = 'question-count';
    count.textContent = `${G.mastered.size} mastered · ${G.questions.length - G.mastered.size} to go`;
    head.appendChild(count);
    if (isRetry) {
      const retry = document.createElement('div');
      retry.className = 'retry-badge';
      retry.textContent = 'Second chance';
      head.appendChild(retry);
    }

    const title = document.createElement('h2');
    title.textContent = q.question || 'Question';

    panel.append(head, title);

    if (q.code) {
      const code = document.createElement('pre');
      code.className = 'qcode';
      code.textContent = q.code;
      panel.appendChild(code);
    }

    if (q.type === 'multiple-choice') {
      renderMultipleChoice(panel, q);
    } else if (q.type === 'drag-drop') {
      renderMatchingQuestion(panel, q);
    } else {
      const unsupported = document.createElement('p');
      unsupported.textContent = `Unsupported question type: ${q.type || 'unknown'}`;
      panel.appendChild(unsupported);
    }

    requestAnimationFrame(() => {
      const first = panel.querySelector('button:not(:disabled)');
      first?.focus({ preventScroll: true });
    });
  }

  function renderMultipleChoice(panel, q) {
    const options = document.createElement('div');
    options.className = 'options';
    options.id = 'opts';

    (q.options || []).forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-button';
      button.dataset.optionIndex = String(index);
      button.innerHTML = `<span class="option-key" aria-hidden="true">${index + 1}</span><span>${escapeHtml(option)}</span>`;
      button.setAttribute('aria-label', `${index + 1}. ${option}`);
      button.addEventListener('click', () => answerMultipleChoice(index));
      options.appendChild(button);
    });

    panel.appendChild(options);
  }

  function renderMatchingQuestion(panel, q) {
    const intro = document.createElement('p');
    intro.className = 'match-intro';
    intro.textContent = 'Choose a term, then choose its matching definition. Tap a matched definition to change it.';

    const layout = document.createElement('div');
    layout.className = 'match-layout';
    const termsCol = document.createElement('div');
    const defsCol = document.createElement('div');
    termsCol.className = 'match-column';
    defsCol.className = 'match-column';
    termsCol.innerHTML = '<div class="match-column-title">Terms</div>';
    defsCol.innerHTML = '<div class="match-column-title">Definitions</div>';

    const termOrder = shuffle([...q.terms.keys()]);
    const defOrder = shuffle([...q.definitions.keys()]);
    G.matchState = { assignments: new Map(), termOrder, defOrder };

    for (const termIndex of termOrder) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'match-term';
      button.dataset.termIndex = String(termIndex);
      button.textContent = q.terms[termIndex];
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => selectMatchTerm(termIndex));
      termsCol.appendChild(button);
    }

    for (const defIndex of defOrder) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'match-definition';
      button.dataset.defIndex = String(defIndex);
      button.dataset.definition = q.definitions[defIndex];
      button.addEventListener('click', () => chooseMatchDefinition(defIndex));
      defsCol.appendChild(button);
    }

    layout.append(termsCol, defsCol);

    const actions = document.createElement('div');
    actions.className = 'match-actions';
    const submit = document.createElement('button');
    submit.id = 'submit-match';
    submit.type = 'button';
    submit.textContent = 'Check matches';
    submit.disabled = true;
    submit.addEventListener('click', submitMatches);
    actions.appendChild(submit);

    panel.append(intro, layout, actions);
    refreshMatchUi();
  }

  function selectMatchTerm(termIndex) {
    if (inputLocked || !G?.matchState) return;
    selectedMatchTerm = selectedMatchTerm === termIndex ? null : termIndex;
    refreshMatchUi();
  }

  function chooseMatchDefinition(defIndex) {
    if (inputLocked || !G?.matchState) return;
    const assignments = G.matchState.assignments;

    if (selectedMatchTerm == null) {
      if (assignments.has(defIndex)) {
        selectedMatchTerm = assignments.get(defIndex);
        assignments.delete(defIndex);
        refreshMatchUi();
      } else {
        toast('Choose a term first.');
      }
      return;
    }

    for (const [existingDef, termIndex] of assignments.entries()) {
      if (termIndex === selectedMatchTerm) assignments.delete(existingDef);
    }
    assignments.set(defIndex, selectedMatchTerm);
    selectedMatchTerm = null;
    refreshMatchUi();
  }

  function refreshMatchUi() {
    if (!G?.matchState || !G.current?.q) return;
    const q = G.current.q;
    const assignments = G.matchState.assignments;
    const pairedTerms = new Set(assignments.values());

    document.querySelectorAll('.match-term').forEach((button) => {
      const termIndex = Number(button.dataset.termIndex);
      const selected = termIndex === selectedMatchTerm;
      button.classList.toggle('selected', selected);
      button.classList.toggle('paired', pairedTerms.has(termIndex));
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });

    document.querySelectorAll('.match-definition').forEach((button) => {
      const defIndex = Number(button.dataset.defIndex);
      const assignedTerm = assignments.get(defIndex);
      const definition = q.definitions[defIndex];
      button.replaceChildren();
      const defText = document.createElement('span');
      defText.textContent = definition;
      button.appendChild(defText);
      if (assignedTerm != null) {
        const pair = document.createElement('span');
        pair.className = 'paired-with';
        pair.textContent = `← ${q.terms[assignedTerm]}`;
        button.appendChild(pair);
        button.setAttribute('aria-label', `${definition}. Matched with ${q.terms[assignedTerm]}. Tap to change.`);
      } else {
        button.setAttribute('aria-label', definition);
      }
    });

    const submit = byId('submit-match');
    if (submit) submit.disabled = assignments.size !== q.terms.length;
  }

  function submitMatches() {
    if (inputLocked || !G?.current?.q || !G.matchState) return;
    const q = G.current.q;
    const assignments = G.matchState.assignments;
    let correctCount = 0;

    document.querySelectorAll('.match-definition').forEach((button) => {
      button.disabled = true;
      const defIndex = Number(button.dataset.defIndex);
      const termIndex = assignments.get(defIndex);
      const expectedDef = q.correctMatches?.[termIndex];
      const correct = expectedDef === defIndex;
      button.classList.add(correct ? 'correct' : 'wrong');
      if (correct) {
        correctCount += 1;
      } else if (expectedDef != null) {
        const correction = document.createElement('span');
        correction.className = 'correct-match';
        correction.textContent = `Correct: ${q.terms[q.correctMatches.indexOf(defIndex)] || 'review this pair'}`;
        button.appendChild(correction);
      }
    });
    document.querySelectorAll('.match-term').forEach((button) => { button.disabled = true; });
    const submit = byId('submit-match');
    if (submit) submit.disabled = true;

    const correct = correctCount === q.terms.length;
    settleAnswer(correct, {
      answerSummary: correct ? 'All pairs matched correctly.' : `${correctCount} of ${q.terms.length} pairs were correct.`
    });
  }

  function answerMultipleChoice(index) {
    if (inputLocked || !G?.current?.q) return;
    const q = G.current.q;
    const buttons = Array.from(document.querySelectorAll('.option-button'));
    buttons.forEach((button) => { button.disabled = true; });

    const correct = index === q.correct;
    if (buttons[q.correct]) buttons[q.correct].classList.add('good');
    if (!correct && buttons[index]) buttons[index].classList.add('bad');

    settleAnswer(correct, {
      chosenIndex: index,
      answerSummary: correct
        ? `Correct: ${q.options?.[q.correct] || ''}`
        : `Your answer: ${q.options?.[index] || '—'} · Correct: ${q.options?.[q.correct] || '—'}`
    });
  }

  function settleAnswer(correct, meta = {}) {
    if (!G || inputLocked) return;
    inputLocked = true;
    const q = G.current.q;
    const key = questionKey(q);
    const boss = byId('boss-avatar');
    boss.classList.remove('hit', 'combo-hit', 'fault');
    void boss.offsetWidth;

    let comboMessage = '';
    if (correct) {
      G.mastered.add(key);
      G.streak += 1;
      G.bestStreak = Math.max(G.bestStreak, G.streak);
      if (G.streak > 0 && G.streak % 3 === 0) comboMessage = `⚡ Clean compile ×${G.streak}! Repair boost!`;
      boss.classList.add(comboMessage ? 'combo-hit' : 'hit');
    } else {
      G.mistakes += 1;
      G.streak = 0;
      G.hearts = Math.max(0, G.hearts - 1);
      boss.classList.add('fault');
      recordReview(q, meta);
      if (G.hearts > 0) G.queue.push({ q, retry: true });
    }

    renderHud();
    showAnswerFeedback(correct, q, meta, comboMessage);

    if (!correct && G.hearts <= 0) {
      const continueButton = byId('continueBtn');
      if (continueButton) continueButton.textContent = 'See results';
    }
  }

  function showAnswerFeedback(correct, q, meta, comboMessage) {
    const feedback = byId('explain');
    feedback.hidden = false;
    feedback.className = `feedback ${correct ? 'correct' : 'incorrect'}`;
    feedback.replaceChildren();

    const row = document.createElement('div');
    row.className = 'feedback-row';
    const copy = document.createElement('div');
    copy.className = 'feedback-copy';
    const heading = document.createElement('strong');
    heading.textContent = correct ? '✅ Circuit repaired.' : '⚠️ Fault found — this challenge will return.';
    const explanation = document.createElement('div');
    explanation.textContent = q.explanation || meta.answerSummary || '';
    copy.append(heading, explanation);

    if (q.definition) {
      const definition = document.createElement('div');
      definition.className = 'definition-note';
      definition.textContent = q.definition;
      copy.appendChild(definition);
    }

    if (!correct && meta.answerSummary) {
      const answerLine = document.createElement('div');
      answerLine.style.marginTop = '6px';
      answerLine.textContent = meta.answerSummary;
      copy.appendChild(answerLine);
    }
    if (comboMessage) {
      const combo = document.createElement('span');
      combo.className = 'combo';
      combo.textContent = comboMessage;
      copy.appendChild(combo);
    }

    const next = document.createElement('button');
    next.type = 'button';
    next.id = 'continueBtn';
    next.textContent = 'Next question';
    next.addEventListener('click', continueAfterFeedback);
    row.append(copy, next);
    feedback.appendChild(row);
    next.focus({ preventScroll: true });
  }

  function continueAfterFeedback() {
    if (!G) return;
    if (G.hearts <= 0) {
      finishLevel(true);
      return;
    }
    if (G.mastered.size >= G.questions.length) {
      finishLevel(false);
      return;
    }
    nextQuestion();
  }

  function recordReview(q, meta) {
    const key = questionKey(q);
    const existing = G.review.get(key) || { q, attempts: [] };
    existing.attempts.push(meta);
    G.review.set(key, existing);
  }

  function useHint() {
    if (!G || inputLocked || G.hintsLeft <= 0 || !G.current?.q?.hint) {
      if (G && G.hintsLeft <= 0) toast('No diagnostic hints left in this mission.');
      return;
    }
    G.hintsLeft -= 1;
    G.hintsUsed += 1;
    renderHud();

    const feedback = byId('explain');
    feedback.hidden = false;
    feedback.className = 'feedback hint';
    feedback.replaceChildren();
    const copy = document.createElement('div');
    copy.className = 'feedback-copy';
    const heading = document.createElement('strong');
    heading.textContent = '🔎 Diagnostic hint';
    const text = document.createElement('div');
    text.textContent = G.current.q.hint;
    copy.append(heading, text);
    feedback.appendChild(copy);
  }

  function finishLevel(gameOver) {
    if (!G) return;
    G.finishedAt = Date.now();
    stopTimerTicker();

    const elapsed = Math.max(0, Math.floor((G.finishedAt - G.startTime) / 1000));
    const correctAttempts = G.mastered.size;
    const totalAttempts = correctAttempts + G.mistakes;
    const accuracy = totalAttempts ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
    const title = byId('resTitle');
    const kicker = byId('results-kicker');
    const icon = byId('results-icon');
    const summary = byId('resSummary');
    const starWrap = byId('result-stars');
    const stats = byId('result-stats');
    const reviewList = byId('reviewList');
    const reviewDetails = byId('review-details');
    const reviewCount = byId('review-count');

    reviewList.replaceChildren();
    stats.replaceChildren();
    starWrap.replaceChildren();

    let rating = 0;
    if (gameOver) {
      kicker.textContent = 'REPAIR PAUSED';
      icon.textContent = '🛠️';
      title.textContent = 'System still unstable';
      summary.textContent = `You repaired ${G.mastered.size} of ${G.questions.length} circuits. Review the faults and try the mission again — your completed systems stay saved.`;
    } else {
      rating = G.mistakes === 0 ? 3 : G.mistakes === 1 ? 2 : 1;
      kicker.textContent = 'SYSTEM RESTORED';
      icon.textContent = rating === 3 ? '🏆' : '🎉';
      title.textContent = rating === 3 ? 'Flawless repair!' : 'System restored!';
      summary.textContent = rating === 3
        ? 'Every circuit repaired without losing integrity. Excellent work.'
        : 'Every circuit repaired. The challenges that caused faults are saved below for a quick review.';

      state.clears[G.id] = true;
      const previousRating = Number(state.ratings[G.id]) || 0;
      state.ratings[G.id] = Math.max(previousRating, rating);

      const previousBest = state.best[G.id] || {};
      const shouldReplaceBest = !previousBest.seconds
        || rating > (previousBest.rating || 0)
        || (rating === (previousBest.rating || 0) && elapsed < previousBest.seconds);
      if (shouldReplaceBest) {
        state.best[G.id] = {
          rating,
          seconds: elapsed,
          mistakes: G.mistakes,
          hintsUsed: G.hintsUsed,
          bestStreak: G.bestStreak
        };
      }

      const ids = getWeekIds();
      const next = ids[ids.indexOf(G.id) + 1];
      if (next && !state.unlocked.includes(next)) state.unlocked.push(next);
      saveState();
    }

    const displayRating = gameOver ? 0 : rating;
    const starNode = buildStars(displayRating, `${displayRating} of 3 stars this run`);
    while (starNode.firstChild) starWrap.appendChild(starNode.firstChild);

    addResultStat(stats, 'Mastered', `${G.mastered.size}/${G.questions.length}`);
    addResultStat(stats, 'Accuracy', `${accuracy}%`);
    addResultStat(stats, 'Best streak', String(G.bestStreak));
    addResultStat(stats, 'Time', state.settings.timer ? formatTime(elapsed) : 'Hidden');

    if (G.review.size) {
      reviewDetails.hidden = false;
      reviewCount.textContent = `(${G.review.size})`;
      for (const { q, attempts } of G.review.values()) {
        const li = document.createElement('li');
        const question = document.createElement('div');
        question.className = 'review-question';
        question.textContent = q.question;
        const explanation = document.createElement('div');
        explanation.textContent = q.explanation || 'Review this question before trying again.';
        li.append(question, explanation);
        if (attempts.length > 1) {
          const attemptsLine = document.createElement('div');
          attemptsLine.textContent = `Missed ${attempts.length} times in this run.`;
          li.appendChild(attemptsLine);
        }
        reviewList.appendChild(li);
      }
    } else {
      reviewDetails.hidden = true;
      reviewCount.textContent = '';
    }

    showScreen('results');
    renderHeaderStats();
    byId('retry').focus({ preventScroll: true });
  }

  function addResultStat(parent, label, value) {
    const item = document.createElement('div');
    item.className = 'result-stat';
    const labelEl = document.createElement('span');
    labelEl.textContent = label;
    const valueEl = document.createElement('strong');
    valueEl.textContent = value;
    item.append(labelEl, valueEl);
    parent.appendChild(item);
  }

  function exitBattle() {
    if (!G) {
      showScreen('levels');
      return;
    }
    const hasProgress = G.mastered.size > 0 || G.mistakes > 0;
    if (!hasProgress || window.confirm('Exit this mission? This run will be discarded, but your restored systems and best results stay saved.')) {
      stopTimerTicker();
      G = null;
      showScreen('levels');
      renderLevels();
    }
  }

  function openDialog(id) {
    const dialog = byId(id);
    if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
  }

  function resetProgress() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (_) {}
    Object.assign(state, createFreshState());
    saveState();
    byId('reset-dialog')?.close();
    byId('settings-dialog')?.close();
    stopTimerTicker();
    G = null;
    renderLevels();
    showScreen('levels');
    toast('Progress reset. System 1 is ready.');
  }

  function toast(message) {
    const node = byId('toast');
    node.textContent = message;
    node.classList.add('show');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node.classList.remove('show'), 1800);
  }

  function questionKey(q) {
    return q.id || `${q.question || ''}|${q.code || ''}`;
  }

  function formatTime(seconds) {
    const value = Math.max(0, Math.floor(Number(seconds) || 0));
    const minutes = Math.floor(value / 60);
    const secs = value % 60;
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function handleGlobalKeydown(event) {
    if (!G || gameScreen.hidden) return;
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || document.querySelector('dialog[open]')) return;

    if (event.key.toLowerCase() === 'h' && !inputLocked) {
      event.preventDefault();
      useHint();
      return;
    }

    if (event.key === 'Enter' && inputLocked && byId('continueBtn')) {
      event.preventDefault();
      continueAfterFeedback();
      return;
    }

    if (!inputLocked && /^[1-9]$/.test(event.key)) {
      const index = Number(event.key) - 1;
      const button = document.querySelector(`.option-button[data-option-index="${index}"]`);
      if (button && !button.disabled) {
        event.preventDefault();
        button.click();
      }
    }
  }

  byId('useHint').addEventListener('click', useHint);
  byId('quit').addEventListener('click', exitBattle);
  byId('retry').addEventListener('click', () => G && startLevel(G.id));
  byId('back').addEventListener('click', () => {
    G = null;
    renderLevels();
    showScreen('levels');
  });
  byId('help').addEventListener('click', () => openDialog('help-dialog'));
  byId('settings').addEventListener('click', () => {
    byId('setting-timer').checked = state.settings.timer;
    openDialog('settings-dialog');
  });
  byId('setting-timer').addEventListener('change', (event) => {
    state.settings.timer = Boolean(event.target.checked);
    saveState();
    renderTimer();
  });
  byId('reset').addEventListener('click', () => openDialog('reset-dialog'));
  byId('confirm-reset').addEventListener('click', (event) => {
    event.preventDefault();
    resetProgress();
  });
  document.addEventListener('keydown', handleGlobalKeydown);

  renderLevels();
  showScreen('levels');
})();
