import * as THREE from "three";

type ChromePerformance = Performance & { memory?: { usedJSHeapSize: number } };
type TimerQueryExt = { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number };

const DRAWING_BUFFER_SIZE = new THREE.Vector2();

// Dev-only overlay. Call begin() at the start of a frame and end() after rendering.
// Numbers are collected every frame but the text only refreshes every REFRESH_MS,
// so the overlay itself costs almost nothing.
//
// GPU time uses a WebGL timer query. Results arrive a few frames late, so only one
// query is in flight at a time and the GPU number is an average of sampled frames.
export class PerfStats {
  REFRESH_MS = 500;
  dom: HTMLDivElement;
  renderer: THREE.WebGLRenderer;
  gl: WebGL2RenderingContext;
  timerExt: TimerQueryExt | null;
  query: WebGLQuery | null;
  queryOpen = false;
  queryPending = false;

  frames = 0;
  cpuTotal = 0;
  cpuWorst = 0;
  gpuTotal = 0;
  gpuSamples = 0;
  gapWorst = 0;
  frameStart = 0;
  lastEnd = 0;
  windowStart = performance.now();

  constructor(container: HTMLElement, renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.gl = renderer.getContext() as WebGL2RenderingContext;
    this.timerExt = this.gl.getExtension("EXT_disjoint_timer_query_webgl2");
    this.query = this.timerExt ? this.gl.createQuery() : null;
    this.dom = document.createElement("div");
    this.dom.style.cssText =
      "position:fixed;top:8px;left:8px;padding:6px 8px;border-radius:4px;" +
      "font:12px/1.4 ui-monospace,monospace;color:#9f9;background:rgba(0,0,0,0.7);" +
      "white-space:pre;pointer-events:none;z-index:10";
    container.appendChild(this.dom);
  }

  begin() {
    this.frameStart = performance.now();
    if (!this.query || !this.timerExt) return;

    if (this.queryPending) this.pollQuery(this.query, this.timerExt);
    if (!this.queryPending) {
      this.gl.beginQuery(this.timerExt.TIME_ELAPSED_EXT, this.query);
      this.queryOpen = true;
      this.queryPending = true;
    }
  }

  pollQuery(query: WebGLQuery, ext: TimerQueryExt) {
    const disjoint = this.gl.getParameter(ext.GPU_DISJOINT_EXT);
    const available = this.gl.getQueryParameter(query, this.gl.QUERY_RESULT_AVAILABLE);
    if (!available && !disjoint) return;

    // A disjoint event (GPU reset, power change) makes the result meaningless; drop it.
    if (available && !disjoint) {
      this.gpuTotal += this.gl.getQueryParameter(query, this.gl.QUERY_RESULT) / 1e6;
      this.gpuSamples++;
    }
    this.queryPending = false;
  }

  end() {
    if (this.queryOpen && this.timerExt) {
      this.gl.endQuery(this.timerExt.TIME_ELAPSED_EXT);
      this.queryOpen = false;
    }

    const now = performance.now();
    const cpu = now - this.frameStart;
    this.frames++;
    this.cpuTotal += cpu;
    if (cpu > this.cpuWorst) this.cpuWorst = cpu;
    if (this.lastEnd > 0 && now - this.lastEnd > this.gapWorst) this.gapWorst = now - this.lastEnd;
    this.lastEnd = now;

    const elapsed = now - this.windowStart;
    if (elapsed < this.REFRESH_MS) return;

    const { calls, triangles } = this.renderer.info.render;
    const { geometries, textures } = this.renderer.info.memory;
    const heap = (performance as ChromePerformance).memory?.usedJSHeapSize;
    const size = this.renderer.getDrawingBufferSize(DRAWING_BUFFER_SIZE);
    const gpu = this.gpuSamples > 0 ? `${(this.gpuTotal / this.gpuSamples).toFixed(2)} ms` : "n/a";

    this.dom.textContent =
      `fps    ${Math.round((this.frames * 1000) / elapsed)}  (worst frame ${this.gapWorst.toFixed(1)} ms)\n` +
      `cpu    ${(this.cpuTotal / this.frames).toFixed(2)} ms  (worst ${this.cpuWorst.toFixed(2)} ms)\n` +
      `gpu    ${gpu}\n` +
      `pixels ${size.x}x${size.y} @ ${this.renderer.getPixelRatio()}x\n` +
      `calls  ${calls}\n` +
      `tris   ${triangles}\n` +
      `mem    ${geometries} geometries, ${textures} textures` +
      (heap === undefined ? "" : `\nheap   ${(heap / 1048576).toFixed(1)} MB`);

    this.frames = 0;
    this.cpuTotal = 0;
    this.cpuWorst = 0;
    this.gpuTotal = 0;
    this.gpuSamples = 0;
    this.gapWorst = 0;
    this.windowStart = now;
  }

  dispose() {
    if (this.query) this.gl.deleteQuery(this.query);
    this.dom.remove();
  }
}
