import type * as THREE from "three";

type ChromePerformance = Performance & { memory?: { usedJSHeapSize: number } };

// Dev-only overlay. Call begin() at the start of a frame and end() after rendering.
// Numbers are collected every frame but the text only refreshes every REFRESH_MS,
// so the overlay itself costs almost nothing.
export class PerfStats {
  REFRESH_MS = 500;
  dom: HTMLDivElement;
  renderer: THREE.WebGLRenderer;

  frames = 0;
  cpuTotal = 0;
  cpuWorst = 0;
  gapWorst = 0;
  frameStart = 0;
  lastEnd = 0;
  windowStart = performance.now();

  constructor(container: HTMLElement, renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.dom = document.createElement("div");
    this.dom.style.cssText =
      "position:fixed;top:8px;left:8px;padding:6px 8px;border-radius:4px;" +
      "font:12px/1.4 ui-monospace,monospace;color:#9f9;background:rgba(0,0,0,0.7);" +
      "white-space:pre;pointer-events:none;z-index:10";
    container.appendChild(this.dom);
  }

  begin() {
    this.frameStart = performance.now();
  }

  end() {
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

    this.dom.textContent =
      `fps    ${Math.round((this.frames * 1000) / elapsed)}  (worst frame ${this.gapWorst.toFixed(1)} ms)\n` +
      `cpu    ${(this.cpuTotal / this.frames).toFixed(2)} ms  (worst ${this.cpuWorst.toFixed(2)} ms)\n` +
      `calls  ${calls}\n` +
      `tris   ${triangles}\n` +
      `gpu    ${geometries} geometries, ${textures} textures` +
      (heap === undefined ? "" : `\nheap   ${(heap / 1048576).toFixed(1)} MB`);

    this.frames = 0;
    this.cpuTotal = 0;
    this.cpuWorst = 0;
    this.gapWorst = 0;
    this.windowStart = now;
  }

  dispose() {
    this.dom.remove();
  }
}
