// Loops Lagoon — program a robot with F/L/R and a Repeat count to reach the ⭐

class LoopsLagoon {
  constructor(manager) {
    this.m = manager;
    this.gridSize = 7;
    this.cell = 64;
    this.margin = 24;
    this.cols = this.gridSize;
    this.rows = this.gridSize;

    // Level config
    this.level = {
      start: { r: this.rows - 1, c: 0, dir: 'E' }, // bottom-left, facing East
      goal:  { r: 0, c: this.cols - 1 },           // top-right
      rocks: [ {r:4,c:2}, {r:3,c:2}, {r:2,c:2}, {r:1,c:4} ]
    };

    this.dirOrder = ['N','E','S','W'];
    this.dirVec = { N:{r:-1,c:0}, E:{r:0,c:1}, S:{r:1,c:0}, W:{r:0,c:-1} };

    this.resetState();
  }

  resetState() {
    const s = this.level.start;
    this.player = { r: s.r, c: s.c, dir: s.dir };
    this.sequence = [];     // array of 'F','L','R'
    this.repeatCount = 2;   // default Repeat ×2
    this.running = false;
    this.runSteps = [];
    this.outcome = '';      // '', 'win', 'blocked', 'offgrid', 'stopped'
    this.stepTicker = 0;
    this.stepDelay = 12;    // frames per step
  }

  init() {
    const controls = document.getElementById('controls');
    controls.innerHTML = '';

    // Command buttons
    const btnF = document.createElement('button'); btnF.textContent = 'F';
    const btnL = document.createElement('button'); btnL.textContent = 'L';
    const btnR = document.createElement('button'); btnR.textContent = 'R';
    btnF.onclick = () => { if(!this.running) this.sequence.push('F'); };
    btnL.onclick = () => { if(!this.running) this.sequence.push('L'); };
    btnR.onclick = () => { if(!this.running) this.sequence.push('R'); };

    // Edit sequence
    const backBtn = document.createElement('button'); backBtn.textContent = '⟵ Back';
    backBtn.onclick = () => { if(!this.running) this.sequence.pop(); };
    const clearBtn = document.createElement('button'); clearBtn.textContent = 'Clear';
    clearBtn.onclick = () => { if(!this.running) this.sequence = []; };

    // Repeat selector
    const repDec = document.createElement('button'); repDec.textContent = '– Repeat';
    const repInc = document.createElement('button'); repInc.textContent = '+ Repeat';
    const repLabel = document.createElement('span'); repLabel.className = 'pill'; repLabel.textContent = 'Repeat ×2';
    repDec.onclick = () => { if(!this.running && this.repeatCount > 1){ this.repeatCount--; repLabel.textContent = `Repeat ×${this.repeatCount}`; } };
    repInc.onclick = () => { if(!this.running && this.repeatCount < 9){ this.repeatCount++; repLabel.textContent = `Repeat ×${this.repeatCount}`; } };

    // Run/Reset
    const runBtn = document.createElement('button'); runBtn.textContent = '▶ Run';
    runBtn.onclick = () => this.prepareRun();
    const resetBtn = document.createElement('button'); resetBtn.textContent = '↺ Reset';
    resetBtn.onclick = () => this.resetState();

    // Exit to menu
    const menuBtn = document.createElement('button'); menuBtn.textContent = '🏝️ Menu';
    menuBtn.onclick = () => this.m.set(new MenuScene(this.m));

    [btnF, btnL, btnR, backBtn, clearBtn, repDec, repLabel, repInc, runBtn, resetBtn, menuBtn]
      .forEach(el => controls.appendChild(el));
  }

  prepareRun() {
    if(this.running || this.sequence.length === 0) return;
    // Build runSteps by repeating the entire sequence:
    this.runSteps = [];
    for(let i=0; i<this.repeatCount; i++) this.runSteps.push(...this.sequence);

    // Reset player to start for each run
    const s = this.level.start;
    this.player = { r: s.r, c: s.c, dir: s.dir };
    this.outcome = '';
    this.running = true;
    this.stepTicker = 0;
  }

  update() {
    if(!this.running || this.outcome) return;

    this.stepTicker++;
    if(this.stepTicker < this.stepDelay) return;
    this.stepTicker = 0;

    if(this.runSteps.length === 0) {
      // Finished sequence → check goal
      if(this.player.r === this.level.goal.r && this.player.c === this.level.goal.c) {
        this.outcome = 'win';
      } else {
        this.outcome = 'stopped';
      }
      this.running = false;
      return;
    }

    const cmd = this.runSteps.shift();
    if(cmd === 'L' || cmd === 'R') {
      this.player.dir = this.turn(this.player.dir, cmd);
      return;
    }

    if(cmd === 'F') {
      const next = { r: this.player.r + this.dirVec[this.player.dir].r,
                     c: this.player.c + this.dirVec[this.player.dir].c };
      if(!this.inBounds(next) || this.hitRock(next)) {
        this.outcome = this.inBounds(next) ? 'blocked' : 'offgrid';
        this.running = false;
        return;
      }
      this.player = { ...next, dir: this.player.dir };
      // Early win check if we ended exactly on the goal and no steps remain
      if(this.player.r === this.level.goal.r && this.player.c === this.level.goal.c &&
         this.runSteps.length === 0) {
        this.outcome = 'win';
        this.running = false;
      }
    }
  }

  inBounds(p) { return p.r >= 0 && p.c >= 0 && p.r < this.rows && p.c < this.cols; }
  hitRock(p) { return this.level.rocks.some(o => o.r === p.r && o.c === p.c); }

  turn(dir, cmd) {
    const i = this.dirOrder.indexOf(dir);
    if(cmd === 'L') return this.dirOrder[(i + 3) % 4];
    if(cmd === 'R') return this.dirOrder[(i + 1) % 4];
    return dir;
  }

  drawGrid() {
    const w = this.cols * this.cell;
    const h = this.rows * this.cell;
    translate(this.margin, this.margin);

    // Board
    stroke(220); fill(250);
    rect(0, 0, w, h, 12);

    // Cells
    for(let r=0; r<this.rows; r++){
      for(let c=0; c<this.cols; c++){
        noFill(); stroke(235);
        rect(c*this.cell, r*this.cell, this.cell, this.cell);
      }
    }

    // Rocks
    this.level.rocks.forEach(o => {
      fill(200, 80, 80); noStroke();
      rect(o.c*this.cell + 8, o.r*this.cell + 8, this.cell - 16, this.cell - 16, 8);
    });

    // Goal (star)
    const g = this.level.goal;
    noStroke(); fill(255, 195, 0);
    const cx = g.c*this.cell + this.cell/2, cy = g.r*this.cell + this.cell/2;
    push();
    translate(cx, cy);
    beginShape();
    for (let i=0; i<5; i++){
      const a = -PI/2 + i*2*PI/5;
      const x1 = cos(a)*16, y1 = sin(a)*16;
      const x2 = cos(a+PI/5)*6, y2 = sin(a+PI/5)*6;
      vertex(x1,y1); vertex(x2,y2);
    }
    endShape(CLOSE);
    pop();

    // Player (robot)
    const p = this.player;
    const px = p.c*this.cell + this.cell/2, py = p.r*this.cell + this.cell/2;
    fill(90,130,255); noStroke();
    circle(px, py, this.cell*0.55);

    // Direction arrow
    stroke(255); strokeWeight(3);
    const dv = this.dirVec[p.dir];
    line(px, py, px + dv.c*(this.cell*0.28), py + dv.r*(this.cell*0.28));
    strokeWeight(1);

    // Sequence banner
    resetMatrix();
    fill(0); noStroke(); textAlign(CENTER);
    textSize(16);
    const seq = this.sequence.length ? this.sequence.join(' ') : '(empty)';
    text(`Sequence: ${seq}   |   Repeat ×${this.repeatCount}`, width/2, this.margin*0.9);
  }

  drawOutcome() {
    if(!this.outcome) return;
    const msg = {
      win:     '🎉 Success! You reached the star!',
      blocked: '⛔ Blocked by a rock — adjust your plan.',
      offgrid: '🌀 Oops! You fell off the map.',
      stopped: '😺 Sequence finished but not at the goal. Add more or increase Repeat.'
    }[this.outcome] || this.outcome;
    fill(0); textAlign(CENTER); textSize(18);
    text(msg, width/2, height - 20);
  }

  draw() {
    background(245);
    const canvasW = this.cols*this.cell + this.margin*2;
    const canvasH = this.rows*this.cell + this.margin*2;
    resizeCanvas(canvasW, canvasH);
    this.drawGrid();
    this.drawOutcome();
  }
}
