let mgr;

function setup() {
  const holder = document.getElementById('sketch-holder');
  const c = createCanvas(10,10);
  c.parent(holder);
  mgr = new SceneManager();
  mgr.set(new MenuScene(mgr));
}

function draw() {
  mgr.update();
  mgr.draw();
}

function keyPressed() {
  mgr.keyPressed?.(key);
}
