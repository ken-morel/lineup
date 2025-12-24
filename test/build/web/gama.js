export class GamaInstance {
  constructor(canvas) {
    this.elt = canvas;
    this.ectx = canvas.getContext('2d');
  }
  async setup(workerPath, wasmPath) {
    this.worker = new Worker(workerPath, { type: 'module' });
    this.worker.onmessage = (msg) => this.handleWorkerMessage(this, msg);
    this.worker.onerror = this.handleWorkerError;

    this.worker.postMessage(wasmPath);
    this.offset = { x: 0, y: 0 };
  }
  destroy() {
    console.info("stopping worker");
    this.worker.terminate();
  }
  yield() {
    requestAnimationFrame(() => {
      this.ectx.clearRect(0, 0, this.ectx.canvas.width, this.ectx.canvas.height);
      this.ectx.drawImage(this.canv, 0, 0);
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.worker.postMessage(null);
    });
  }
  handleWorkerMessage(gama, event) {
    const d = event.data;
    if (d == null) { // loop completed, save and wait for next frame
      this.yield();
      return;
    }
    switch (d.type) {
      case 'initialize':
        console.log("received initialize message from gama", d);
        gama.canv = new OffscreenCanvas(d.width, d.height);
        gama.ctx = gama.canv.getContext('2d');
        gama.canv.width = d.width;
        gama.canv.height = d.height;
        gama.size = { x: d.width, y: d.height };
        gama.applySize();
        try {
          document.querySelector('title').innerHTML = d.title;
        } catch (e) { }
        this.yield();
        break;
      case 'draw/line':
        var { start, stop, color, size } = d;
        gama.ctx.beginPath();
        gama.ctx.moveTo(...gama._c_coord(...start));
        gama.ctx.lineTo(...gama._c_coord(...stop));
        gama._stroke(...color);
        gama.ctx.lineWidth = gama._c_one(size);
        gama.ctx.stroke();
        break;
      case 'set/bg':
        gama.elt.style.backgroundColor = gama._col(...d.color);
        break;
      case 'draw/rect':
        var { pos, size, color } = d;
        gama._fill(...color);
        var [x, y] = gama._c_coord(...pos);
        var [w, h] = [gama._c_one(size[0]), gama._c_one(size[1])];
        gama.ctx.fillRect(x - w / 2, y - h / 2, w, h);
        break;
    }
  }
  applySize() {
    this.elt.width = this.canv.width;
    this.elt.height = this.canv.height;
  }
  _col(r, g, b, a) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  _stroke(...col) {
    this.ctx.strokeStyle = this._col(...col);
  }
  _fill(...col) {
    this.ctx.fillStyle = this._col(...col);
  }
  handleWorkerError(error) {
    console.error('Worker error:', error);
  }


  _c_coord(x, y) {
    let norm_x = (x + 1.0) * 0.5
    let norm_y = (1.0 - y) * 0.5 // Invert Y-axis for screen coordinates

    return [norm_x * this.size.x + this.offset.x, norm_y * this.size.y +
      this.offset.y];
  }

  _js_coord(x, y) {
    let norm_x = (x - this.offset.x) / this.size.x
    let norm_y = (y - this.offset.y) / this.size.y

    return [(norm_x * 2) - 1.0, 1.0 - (norm_y * 2)]
  }

  _c_one(v) {
    return v * this.size.x * 0.5
  }

  _js_one(v) {
    return (v * 2) / p.canvas.width;
  }

  _c_rect(x, y, w, h) {
    let gx, gy = this._c_coord(x, y)

    let gw = w * 0.5 * this.size.x
    let gh = h * 0.5 * this.size.y

    return [gx - gw / 2, gy - gh / 2, gw, gh];
  }
}
