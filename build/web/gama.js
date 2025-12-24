export class GamaInstance {
  constructor(canvas) {
    this.canvas = canvas;

  }
  async setup(workerPath, wasmPath) {
    this.worker = new Worker(workerPath, { type: 'module' });
    this.worker.onmessage = this.handleWorkerMessage;
    this.worker.onerror = this.handleWorkerError;

    this.worker.postMessage(wasmPath);
  }
  destroy() {
    this.worker.terminate();
  }
  handleWorkerMessage(event) {
    switch (event.data.type) {
      case 'initialize':
        this.canv = new OffscreenCanvas(event.data.width, event.data.height);
        this.ctx = this.canv.getContext('2d');
        this.canvas.width = event.data.width;
        this.canvas.height = event.data.height;
        try {
          document.querySelector('title').innerHTML = event.data.title;
        } catch (e) { }

        break;
      case 'draw/line':
        const { start, stop, color, size } = event.data;
        this.ctx.lineWidth = size;
        this._stroke(...color);
        this.ctx.beginPath();
        this.ctx.moveTo(...start);
        this.ctx.lineTo(...stop);
        this.ctx.stroke();
    }
  }
  _stroke(r, g, b, a) {
    this.ctx.strokeStyle(`rgba(${r}, ${g}, ${b}, ${a})`);
  }
  handleWorkerError(error) {
    console.error('Worker error:', error);
  }
}

