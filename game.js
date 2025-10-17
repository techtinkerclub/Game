/* =========================
   Tech Tinker Boss Battle — Engine
   ========================= */
(() => {
  const DATA = window.TTC_DATA; // from questions.js
  if(!DATA || !DATA.weeks) {
    alert('questions.js missing or malformed (window.TTC_DATA.weeks)');
    return;
  }

  const $ = s => document.querySelector(s);
  const byId = id => document.getElementById(id);
  const screenLevels = byId('screen-levels');
  const screenGame = byId('screen-game');
  const screenResults = byId('screen-results');
  const SKEY = 'ttcBossBattleV2';
  const defaultSettings = { timer:true };
  const state = loadState();

  function loadState(){
    let s = { unlocked: ['1'], stars: 0, clears: {}, best:{}, settings: defaultSettings };
    try {
      const raw = localStorage.getItem(SKEY);
      if(raw) Object.assign(s, JSON.parse(raw));
    } catch(e){}
    return s;
  }
  function save(){ localStorage.setItem(SKEY, JSON.stringify(state)); }
  function reset(){
    localStorage.removeItem(SKEY);
    location.reload();
  }
  byId('reset').onclick = reset;

  /* ---------- Build Level Cards ---------- */
  function renderLevels(){
    screenLevels.innerHTML = '';
    const ids = Object.keys(DATA.weeks).sort((a,b)=>(+a)-(+b));
    const cleared = Object.keys(state.clears).length;
    byId('progress-pill').textContent = `Progress: ${cleared}/${ids.length}`;
    byId('stars').textContent = `⭐ ${state.stars}`;

    ids.forEach(id => {
      const w = DATA.weeks[id];
      const locked = !state.unlocked.includes(id) && !w.forceUnlock;
      const totalQ = getQuestionListForWeek(id).length;
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${w.title || `Week ${id}`}</h3>
        <div class="small">${w.description || ''}</div>
        <div class="row">
          <span class="tag">${totalQ} Qs</span>
          ${state.clears[id] ? `<span class="tag">Cleared ✓</span>` : ``}
          ${locked ? `<span class="lock">🔒 Locked</span>` : `<span class="spacer"></span>`}
        </div>
        <div class="row">
          <button ${locked?'disabled class="ghost"':''} data-id="${id}">${state.clears[id]?'Replay':'Start'}</button>
        </div>`;
      screenLevels.appendChild(card);
    });

    screenLevels.querySelectorAll('button[data-id]').forEach(b=>{
      b.addEventListener('click', ()=>startLevel(b.dataset.id));
    });
  }

  /* ---------- Mechanics helpers ---------- */
  function getWeekConfig(id){
    const w = DATA.weeks[id] || {};
    // Defaults + overrides
    return {
      hearts: 3,
      hpMode: 'questions',       // 'questions' | 'multiplier' (hp = questions * hpMultiplier)
      hpMultiplier: 1,
      streakBonusEvery: 3,       // every N correct adds +1 damage
      quickBonusWindowMs: 7000,  // +1 dmg if within window & streak threshold met
      enableCombos: true,
      timerPerQuestionSec: 0,    // 0 = no per-question hard timer
      mixFromWeeks: [],          // e.g., ["1","2","3"] to mix pools
      bonusOnPerfect: 2,         // ⭐ for perfect
      bonusOnClear: 1,           // ⭐ for normal clear
      ...w.config
    };
  }

  function getQuestionListForWeek(id){
    const w = DATA.weeks[id];
    const cfg = getWeekConfig(id);
    let list = [];
    if(cfg.mixFromWeeks && cfg.mixFromWeeks.length){
      cfg.mixFromWeeks.forEach(mid=>{
        const mw = DATA.weeks[mid];
        if(mw?.questions?.length) list = list.concat(mw.questions.map(q=>({...q,_origin:mid})));
      });
    }
    if(w?.questions?.length){
      list = list.concat(w.questions.map(q=>({...q,_origin:id})));
    }
    // De-duplicate (by id if present)
    const seen = new Set();
    const dedup = [];
    for(const q of list){
      const key = q.id || q.question + '|' + (q.code||'');
      if(!seen.has(key)){ seen.add(key); dedup.push(q); }
    }
    // Shuffle for Final Battle
    if(w?.config?.shuffleQuestions) shuffle(dedup);
    return dedup;
  }

  /* ---------- Game runtime ---------- */
  let G = null; // current run

  function startLevel(id){
    const cfg = getWeekConfig(id);
    const questions = getQuestionListForWeek(id);
    const hpMax = (cfg.hpMode === 'multiplier') ? Math.ceil(questions.length * Math.max(1, cfg.hpMultiplier)) : questions.length;

    G = {
      id, cfg,
      questions,
      idx: 0,
      hp: hpMax, hpMax,
      hearts: cfg.hearts,
      streak: 0,
      usedHint: false,
      hintBank: state.stars,
      incorrect: [],
      startTime: Date.now(),
      perQStart: Date.now()
    };

    screenLevels.style.display = 'none';
    screenResults.style.display = 'none';
    screenGame.style.display = '';
    renderHud();
    nextQuestion();
  }

  function renderHud(){
    // hearts
    const hearts = byId('hearts'); hearts.innerHTML='';
    for(let i=0;i<G.cfg.hearts;i++){
      const s = document.createElement('span');
      if(i>=G.hearts) s.classList.add('off');
      hearts.appendChild(s);
    }
    // boss hp
    byId('hp').style.width = `${(G.hp/G.hpMax)*100}%`;
    byId('streak').textContent = `Streak: ${G.streak}`;
    byId('hintLeft').textContent = `⭐ Hints: ${G.hintBank}`;
    byId('timer').textContent = state.settings.timer
      ? (G.cfg.timerPerQuestionSec>0
          ? `⏱️ ${Math.max(0, G.cfg.timerPerQuestionSec - Math.floor((Date.now()-G.perQStart)/1000))}s`
          : `⏱️ ${Math.max(0, Math.floor((Date.now()-G.startTime)/1000))}s`)
      : '⏱️ off';
  }
  setInterval(()=>{ if(screenGame.style.display!=='none' && state.settings.timer) renderHud(); }, 500);

  byId('useHint').onclick = ()=>{
    if(G.hintBank<=0){ toast('No hints left! Earn ⭐ by perfect clears.'); return; }
    if(!G.current || !G.current.hint){ toast('No hint for this one.'); return; }
    G.usedHint=true; G.hintBank--; renderHud();
    byId('explain').innerHTML = `<em>Hint:</em> ${G.current.hint}`;
  };
  byId('quit').onclick = ()=>{
    if(confirm('Quit this level? Progress for this run will be lost.')){
      screenGame.style.display='none';
      screenResults.style.display='none';
      screenLevels.style.display='';
      renderLevels();
    }
  };

  function nextQuestion(){
    const q = G.questions[G.idx];
    G.current = q;
    byId('explain').textContent = '';
    const panel = byId('qpanel');

    if(!q){ finishLevel(false); return; }

    G.perQStart = Date.now();

    let html = `
      <div class="row">
        <div class="tag">Q ${G.idx+1} / ${G.questions.length}</div>
        ${q.difficulty?`<div class="tag">${q.difficulty}</div>`:''}
        ${q.definition?`<div class="tag">Definition</div>`:''}
      </div>
      <h2 style="margin:6px 0 6px">${q.question}</h2>`;
    if(q.code){ html += `<div class="qcode">${q.code}</div>`; }

    if(q.type === 'multiple-choice'){
      html += `<div class="options" id="opts"></div>`;
      panel.innerHTML = html;
      const opts = byId('opts');
      q.options.forEach((opt, i)=>{
        const b = document.createElement('button');
        b.textContent = opt;
        b.onclick = ()=>answerMC(i);
        opts.appendChild(b);
      });
    } else if(q.type === 'drag-drop'){
      const terms = q.terms.slice();
      const defs = q.definitions.slice();
      shuffle(terms); shuffle(defs);
      html += `
        <div class="drag-wrap">
          <div><strong>Terms</strong><div id="tiles"></div></div>
          <div><strong>Definitions</strong><div id="buckets"></div></div>
        </div>
        <div class="note small">Drag a term onto its matching definition, then Submit.</div>
        <div class="row" style="margin-top:10px"><button id="submitDD">Submit</button></div>`;
      panel.innerHTML = html;

      const tiles = byId('tiles');
      const buckets = byId('buckets');

      defs.forEach(d=>{
        const b = document.createElement('div');
        b.className='bucket'; b.dataset.def = d;
        b.textContent = d;
        b.ondragover = e=>e.preventDefault();
        b.ondrop = e=>{
          const term = e.dataTransfer.getData('text/plain');
          b.dataset.term = term;
        };
        buckets.appendChild(b);
      });
      terms.forEach(t=>{
        const tile = document.createElement('div');
        tile.className='tile'; tile.textContent=t; tile.draggable=true;
        tile.ondragstart = e=> e.dataTransfer.setData('text/plain', t);
        tiles.appendChild(tile);
      });

      byId('submitDD').onclick = ()=>{
        // evaluate
        let ok=0, total=q.terms.length;
        const originalDefs = q.definitions;
        document.querySelectorAll('.bucket').forEach(b=>{
          const dropped = b.dataset.term;
          const originalIdx = originalDefs.indexOf(b.dataset.def);
          // correctMatches stores index in definitions for each term index
          // We need to find which term matches this definition index:
          const termIdx = q.correctMatches.indexOf(originalIdx);
          const expectedTerm = q.terms[termIdx];
          if(dropped && dropped===expectedTerm){ ok++; b.classList.add('correct'); }
          else { b.classList.add('wrong'); }
        });
        settleAnswer(ok===total, q.explanation||'');
      };
    } else {
      panel.innerHTML = html + `<div class="note">Unsupported type: ${q.type}</div>`;
    }
    renderHud();
  }

  function answerMC(i){
    const q = G.current;
    const opts = byId('opts').children;
    for(let k=0;k<opts.length;k++) opts[k].disabled = true;
    const correct = (i===q.correct);
    if(correct) opts[i].classList.add('good');
    else {
      opts[i].classList.add('bad');
      if(opts[q.correct]) opts[q.correct].classList.add('good');
    }
    settleAnswer(correct, q.explanation||'', {chosen:i});
  }

  function settleAnswer(correct, explanation, meta={}){
    const exp = byId('explain');
    // Per-question hard timer (if configured)
    if(G.cfg.timerPerQuestionSec>0){
      const elapsed = (Date.now()-G.perQStart)/1000;
      if(elapsed > G.cfg.timerPerQuestionSec){
        correct = false;
        explanation = `Time’s up! ${explanation||''}`;
      }
    }

    if(correct){
      let bonus = 0;
      G.streak++;
      const fast = (Date.now()-G.perQStart) < G.cfg.quickBonusWindowMs;
      const streakBonus = (G.cfg.enableCombos && G.streak>0 && (G.streak % G.cfg.streakBonusEvery === 0)) ? 1 : 0;
      if(state.settings.timer && fast && streakBonus) bonus = 1;
      const dmg = 1 + streakBonus + bonus;
      G.hp = Math.max(0, G.hp - dmg);
      exp.innerHTML = `✅ <strong>Correct!</strong> ${explanation ? ('<br>'+explanation):''}
        ${streakBonus?'<br><span class="small">Combo! Extra damage 🔥</span>':''}`;
      toast(`Hit! −${dmg} HP`);
    } else {
      G.incorrect.push({q:G.current, chosen:meta.chosen});
      G.streak = 0;
      G.hearts--;
      exp.innerHTML = `❌ <strong>Not quite.</strong> ${explanation ? ('<br>'+explanation):''}`;
      toast('Ouch! You lost a heart 💔');
    }

    renderHud();

    setTimeout(()=>{
      if(G.hearts<=0){ finishLevel(true); return; }
      if(G.hp<=0){ finishLevel(false); return; }
      G.idx++;
      G.perQStart = Date.now();
      nextQuestion();
    }, 650);
  }

  /* ---------- Results ---------- */
  function finishLevel(gameOver){
    screenGame.style.display='none';
    screenResults.style.display='';
    const title = byId('resTitle');
    const summary = byId('resSummary');
    const review = byId('reviewList'); review.innerHTML='';

    if(gameOver){
      title.textContent = 'Game Over';
      summary.textContent = `You reached question ${G.idx+1} of ${G.questions.length}. Try again!`;
    } else {
      title.textContent = 'Level Complete! 🎉';
      const perfect = G.incorrect.length===0 && G.hearts>0;
      const earned = perfect ? G.cfg.bonusOnPerfect : G.cfg.bonusOnClear;
      state.stars += earned;
      state.clears[G.id] = true;

      // unlock next week (unless this is final)
      const ids = Object.keys(DATA.weeks).sort((a,b)=>(+a)-(+b));
      const nextIdx = ids.indexOf(G.id)+1;
      if(ids[nextIdx] && !state.unlocked.includes(ids[nextIdx])){
        state.unlocked.push(ids[nextIdx]);
      }
      save();

      summary.innerHTML = `Boss defeated with <strong>${G.hearts}</strong> heart(s) left.<br>
                           You earned ⭐ <strong>${earned}</strong> ${perfect?'(perfect clear!)':''}`;
    }

    if(G.incorrect.length){
      G.incorrect.forEach(({q,chosen})=>{
        const li = document.createElement('li');
        if(q.type==='multiple-choice'){
          li.innerHTML = `<strong>Q:</strong> ${q.question}<br>
                          <span class="small">Your answer:</span> ${q.options?.[chosen] ?? '—'}<br>
                          <span class="small">Correct:</span> ${q.options?.[q.correct]}<br>
                          <span class="small">${q.explanation || ''}</span>`;
        } else {
          li.innerHTML = `<strong>Q:</strong> ${q.question}<br><span class="small">${q.explanation||''}</span>`;
        }
        review.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'Flawless! Nothing to review.';
      review.appendChild(li);
    }

    byId('retry').onclick = ()=>startLevel(G.id);
    byId('back').onclick = ()=>{
      screenResults.style.display='none';
      screenLevels.style.display='';
      renderLevels();
    };
  }

  /* ---------- Utils ---------- */
  function toast(msg){
    const t = byId('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 1200);
  }
  function shuffle(a){
    for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }

  /* ---------- Init ---------- */
  renderLevels();

})();
