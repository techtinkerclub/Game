class MenuScene {
  constructor(manager) {
    this.m = manager;
  }

  init() {
    const controls = document.getElementById('controls');
    controls.innerHTML = '';

    const startBtn = document.createElement('button');
    startBtn.textContent = '▶ Loops Lagoon';
    startBtn.onclick = () => this.m.set(new LoopsLagoon(this.m));
    controls.appendChild(startBtn);
  }

  draw() {
    background(248);
    push();
    textAlign(CENTER, CENTER);
    textSize(28);
    text('🗺️ CodeQuest Island', width / 2, height / 2 - 30);
    textSize(18);
    text('Choose a biome to learn a skill.\nStart with Loops Lagoon.', width / 2, height / 2 + 10);
    pop();
  }
}
