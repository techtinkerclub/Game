class SceneManager {
  constructor() {
    this.current = null;
  }

  set(scene) {
    this.current = scene;
    if (this.current.init) this.current.init();
  }

  update() {
    if (this.current && this.current.update) this.current.update();
  }

  draw() {
    if (this.current && this.current.draw) this.current.draw();
  }

  keyPressed(key) {
    if (this.current && this.current.keyPressed) this.current.keyPressed(key);
  }

  mousePressed() {
    if (this.current && this.current.mousePressed) this.current.mousePressed();
  }
}
