/* ==========================================================================
   AP Math Lab Kit · 무대 엔진 (apl-board.js)
   - 캔버스 위에 좌표계·격자·곡선·도형·라벨·드래그 핸들을 그리는 공용 엔진입니다.
   - kind: 'cartesian'(수학 좌표, y 위쪽) | 'figure'(도형 설계 좌표, y 아래쪽)
   - 항상 가로·세로 1:1 축척을 지켜 수직·각도·길이가 그림에서도 정확하게 보입니다.
     예외(선택): aspect:'free' — 가로축이 시간처럼 세로축과 단위가 다른 그래프(위치-시간·속도-시간)용입니다.
       · 가로 배율은 focus.x 로, 세로 배율은 창(pane)마다 focusY(없으면 focus.y)로 따로 정해 창을 가득 채웁니다.
       · 기본값은 1:1 이며 옵션을 주지 않은 실험실의 동작은 전혀 바뀌지 않습니다.
       · free 에서 격자·눈금 간격은 step/tickStep(가로), stepY/tickStepY(세로)로 따로 줍니다. autoFit(measure/fitBox)과 원·호는 지원하지 않습니다(원·호 반지름은 가로 배율).
   - 라벨은 화면 픽셀 크기로 그려 확대·축소·모바일에서도 읽을 수 있게 유지합니다.
   - 색은 이름(ink/sky/rose/amber/green/violet/red/orange/muted)으로 쓰며 테마에 따라 바뀝니다.
     기존 실험실의 헥사 색을 그대로 넘겨도 같은 뜻의 의미색으로 자동 변환됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const APLab = window.APLab;
  const clamp = APLab.clamp;
  const NAMES = ['ink', 'sky', 'rose', 'amber', 'green', 'violet', 'red', 'orange', 'muted'];

  function niceStep(raw) {
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const f = raw / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  }
  function fmtTick(v, step) {
    let d = 0; // 눈금 간격(2.5, 0.25 등)이 필요로 하는 만큼만 소수 자리를 씁니다
    while (d < 6 && Math.abs(step * Math.pow(10, d) - Math.round(step * Math.pow(10, d))) > 1e-9) d++;
    const s = (Math.abs(v) < 1e-9 ? 0 : v).toFixed(d);
    return s.replace('-', '−');
  }

  class Board {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.labelLayer = opts.labelLayer || null;
      this.kind = opts.kind || 'cartesian';
      this.focus = opts.focus || { x: [-5, 5], y: [-4, 4] };
      this.pad = opts.pad == null ? 0.07 : opts.pad;
      this.aspect = opts.aspect === 'free' ? 'free' : '1:1'; // 'free' = 가로·세로 배율을 따로 정함(위 설명)
      this.insets = { top: 0, right: 0, bottom: 0, left: 0 };
      this.zoom = 1;
      this.panX = 0;
      this.panY = 0;
      this.minZoom = opts.minZoom || 0.3;
      this.maxZoom = opts.maxZoom || 8;
      this.pannable = opts.pannable !== false;
      this.zoomable = opts.zoomable !== false;
      this.interactive = opts.interactive !== false;
      this.onInteract = opts.onInteract || (() => {});
      this.onDragState = opts.onDragState || (() => {});
      this.onPanDrag = opts.onPanDrag || null; // 지정하면 빈 곳 끌기 = 회전(3D 궤도) 등으로 바뀝니다
      this.lw = 1;
      this.fs = 1;
      this.hr = 1;
      this.handles = [];
      this.hoverId = null;
      this.dragging = null;
      this.activeHandle = null;
      this.emph = null;
      this.panes = null;
      this.paneId = null;
      this.W = 1;
      this.H = 1;
      this.dpr = 1;
      this.exporting = false;
      this.thumb = !!opts.thumb;
      this._labels = new Map();
      this._used = new Set();
      this.colors = {};
      this.readTheme();
      if (this.interactive) this._bind();
      if (!this.thumb) this._observe();
    }

    /* ---------- 테마 ---------- */
    readTheme() {
      const cs = getComputedStyle(document.documentElement);
      const g = (n) => cs.getPropertyValue(n).trim();
      for (const n of NAMES) this.colors[n] = g('--m-' + n) || '#ffffff';
      this.colors.halo = g('--m-halo') || 'rgba(0,0,0,.9)';
      this.colors.grid = g('--m-grid');
      this.colors.gridMajor = g('--m-grid-major');
      this.colors.axis = g('--m-axis');
      this.colors.tick = g('--m-tick');
      this.colors.stage = g('--stage');
      this.colors.stageHi = g('--stage-hi');
      this.colors.stageLo = g('--stage-lo');
      this.glowOn = g('--m-glow') !== '0';
      this.font = g('--font-ui') || 'sans-serif';
    }
    setTeach(on) {
      this.lw = on ? 1.35 : 1;
      this.fs = on ? 1.3 : 1;
      this.hr = on ? 1.3 : 1;
    }
    /** 이름·헥사·rgba 모두 받아 현재 테마의 색으로 돌려줍니다. */
    color(c, alpha) {
      if (c == null) c = 'ink';
      let base;
      let a = alpha;
      if (this.colors[c]) base = this.colors[c];
      else {
        const p = APLab.parseColor(c);
        if (!p) return c;
        const name = APLab.legacyHue(p);
        base = name === 'halo' ? this.colors.halo : this.colors[name];
        if (a == null) a = p.a;
      }
      if (a == null || a >= 1) return base;
      return APLab.rgba(base, a);
    }

    /* ---------- 크기 & 좌표 ---------- */
    _observe() {
      const host = this.canvas.parentElement;
      if (!host || typeof ResizeObserver === 'undefined') return;
      this._ro = new ResizeObserver(() => {
        if (this.resize()) this.onInteract('resize');
      });
      this._ro.observe(host);
      this.resize();
    }
    resize(w, h) {
      const host = this.canvas.parentElement;
      const rect = w ? { width: w, height: h } : host.getBoundingClientRect();
      const W = Math.max(1, Math.round(rect.width));
      const H = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      if (W === this.W && H === this.H && dpr === this.dpr) return false;
      this.W = W;
      this.H = H;
      this.dpr = dpr;
      this.canvas.width = Math.round(W * dpr);
      this.canvas.height = Math.round(H * dpr);
      return true;
    }
    setFocus(box, reset = true) {
      this.focus = box;
      if (reset) this.fit();
    }
    fit() {
      this.zoom = 1;
      this.panX = 0;
      this.panY = 0;
    }
    setInsets(ins) {
      Object.assign(this.insets, ins);
    }
    setPanes(list) {
      this.panes = list && list.length ? list : null;
      this.paneId = this.panes ? this.panes[0].id : null;
    }
    use(id) {
      this.paneId = id;
      return this;
    }
    /** 맞춤 계산용 영역: 무대 위 칩·배지가 차지한 가장자리(insets)를 뺀 곳에 도형을 배치합니다. */
    _area() {
      const i = this.panes ? { top: 0, right: 0, bottom: 0, left: 0 } : this.insets;
      return { x: i.left, y: i.top, w: Math.max(10, this.W - i.left - i.right), h: Math.max(10, this.H - i.top - i.bottom) };
    }
    /** 그리기(격자·축) 영역: 항상 캔버스 전체(또는 창 분할 영역) */
    _drawRect(id) {
      if (this.panes) return this._paneRect(id);
      return { x: 0, y: 0, w: this.W, h: this.H };
    }
    paneRect(id) {
      return this._paneRect(id == null ? this.paneId : id);
    }
    _paneRect(id) {
      const a = this._area();
      if (!this.panes) return a;
      let y = a.y;
      for (const p of this.panes) {
        const ph = a.h * p.frac;
        if (p.id === id) return { x: a.x, y, w: a.w, h: ph, pane: p };
        y += ph;
      }
      return a;
    }
    get k() {
      const a = this._area();
      const f = this.focus;
      const fw = f.x[1] - f.x[0];
      const fh = f.y[1] - f.y[0];
      const padPx = this.pad * Math.min(a.w, a.h);
      if (this.aspect === 'free') return Math.max(0.0001, ((a.w - padPx * 2) / fw) * this.zoom); // free: k = 가로 배율
      let availH = a.h;
      if (this.panes) availH = a.h * this.panes[0].frac;
      const k0 = Math.min((a.w - padPx * 2) / fw, (availH - padPx * 2) / fh);
      return Math.max(0.0001, k0 * this.zoom);
    }
    /** 세로 배율. 1:1 이면 k 와 같고, free 이면 지금 창(paneId)의 focusY(없으면 focus.y)를 창 높이에 맞춥니다. */
    get ky() {
      if (this.aspect !== 'free') return this.k;
      const r = this._paneRect(this.paneId);
      const a = this._area();
      const f = this.focus;
      const fy = (r.pane && r.pane.focusY) || f.y;
      let padY = this.pad * Math.min(a.w, a.h);
      if (this.panes) padY = Math.min(padY, r.h * 0.1);
      return Math.max(0.0001, ((r.h - padY * 2) / Math.max(1e-9, fy[1] - fy[0])) * this.zoom);
    }
    _origin() {
      const f = this.focus;
      const cx = (f.x[0] + f.x[1]) / 2;
      let cy = (f.y[0] + f.y[1]) / 2;
      const r = this._paneRect(this.paneId);
      if (r.pane && r.pane.focusY) cy = (r.pane.focusY[0] + r.pane.focusY[1]) / 2;
      const k = this.k;
      return { cx, cy, sx: r.x + r.w / 2 + this.panX, sy: r.y + r.h / 2 + this.panY, k, ky: this.aspect === 'free' ? this.ky : k };
    }
    toS(x, y) {
      if (typeof x === 'object') ({ x, y } = x);
      const bb = this._bbox;
      if (bb && Number.isFinite(x) && Number.isFinite(y)) {
        if (x < bb.x0) bb.x0 = x;
        if (x > bb.x1) bb.x1 = x;
        if (y < bb.y0) bb.y0 = y;
        if (y > bb.y1) bb.y1 = y;
      }
      const o = this._origin();
      const sy = this.kind === 'figure' ? o.sy + (y - o.cy) * o.ky : o.sy - (y - o.cy) * o.ky;
      return { x: o.sx + (x - o.cx) * o.k, y: sy };
    }
    toW(sx, sy) {
      const o = this._origin();
      const y = this.kind === 'figure' ? o.cy + (sy - o.sy) / o.ky : o.cy - (sy - o.sy) / o.ky;
      return { x: o.cx + (sx - o.sx) / o.k, y };
    }
    /** 현재 화면에 보이는 세계 좌표 범위 */
    viewBox() {
      const r = this._drawRect(this.paneId);
      const a = this.toW(r.x, r.y);
      const b = this.toW(r.x + r.w, r.y + r.h);
      return { x0: Math.min(a.x, b.x), x1: Math.max(a.x, b.x), y0: Math.min(a.y, b.y), y1: Math.max(a.y, b.y) };
    }
    zoomAt(f, sx, sy) {
      if (sx == null) {
        const a = this._area();
        sx = a.x + a.w / 2;
        sy = a.y + a.h / 2;
      }
      const before = this.toW(sx, sy);
      this.zoom = clamp(this.zoom * f, this.minZoom, this.maxZoom);
      const after = this.toS(before.x, before.y);
      this.panX += sx - after.x;
      this.panY += sy - after.y;
    }

    /* ---------- 프레임 ---------- */
    begin(opts = {}) {
      const c = this.ctx;
      c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      c.clearRect(0, 0, this.W, this.H);
      if (this.exporting || this.thumb) this._paintBg();
      this.handles = [];
      this.emph = opts.emph || null;
      this._used.clear();
      if (this.panes) this.paneId = this.panes[0].id;
      return this;
    }
    _paintBg() {
      const c = this.ctx;
      const g = c.createRadialGradient(this.W / 2, this.H * 0.42, 10, this.W / 2, this.H * 0.42, Math.max(this.W, this.H) * 0.75);
      g.addColorStop(0, this.colors.stageHi || '#162a22');
      g.addColorStop(0.55, this.colors.stage || '#0f1d18');
      g.addColorStop(1, this.colors.stageLo || '#0a1511');
      c.fillStyle = g;
      c.fillRect(0, 0, this.W, this.H);
    }
    end() {
      if (!this.labelLayer) return;
      for (const [key, el] of this._labels) {
        if (!this._used.has(key)) {
          if (!el.hidden) el.hidden = true;
        }
      }
    }
    /** 강조(연결 하이라이트) 판정: ref 또는 part가 지정된 요소만 영향받습니다. */
    _em(o) {
      const e = this.emph;
      if (!e || !o) return 0;
      if (o.ref != null && e.ref != null) return o.ref === e.ref || (Array.isArray(o.ref) && o.ref.includes(e.ref)) ? 1 : -1;
      if (o.part != null && e.part != null) return o.part === e.part ? 1 : -1;
      return 0;
    }
    _stroke(o, defW = 2.4) {
      const c = this.ctx;
      const em = this._em(o);
      let a = o.alpha;
      let w = (o.width == null ? defW : o.width) * this.lw;
      if (em === -1) {
        a = (a == null ? 1 : a) * 0.22;
        w = Math.max(1, w * 0.6);
      } else if (em === 1) w += 2.2;
      c.strokeStyle = this.color(o.color, a);
      c.lineWidth = w;
      c.lineCap = o.cap || 'round';
      c.lineJoin = 'round';
      const d = o.dash === true ? [6, 5] : o.dash;
      c.setLineDash(d && d.length ? d.map((v) => v * this.lw) : []);
      if (this.glowOn && (o.glow || em === 1)) {
        c.shadowColor = this.color(o.color, 0.75);
        c.shadowBlur = em === 1 ? 14 : 8;
      } else {
        c.shadowBlur = 0;
      }
    }
    _fill(o) {
      const em = this._em(o);
      let a = o.fillAlpha;
      if (em === -1) a = (a == null ? 0.18 : a) * 0.25;
      else if (em === 1 && a != null) a = Math.min(0.5, a * 1.6);
      return this.color(o.fill, a);
    }
    clip() {
      const r = this._paneRect(this.paneId);
      const c = this.ctx;
      c.beginPath();
      c.rect(r.x, r.y, r.w, r.h);
      c.clip();
      return this;
    }

    /* ---------- 배경: 격자와 축 ---------- */
    grid(o = {}) {
      const c = this.ctx;
      const r = this._drawRect(this.paneId);
      const k = this.k;
      c.save();
      c.beginPath();
      c.rect(r.x, r.y, r.w, r.h);
      c.clip();
      if (this.kind === 'figure') {
        const step = (o.step || 38) * k;
        if (step > 6 && !this._bbox) {
          const org = this.toS(0, 0);
          c.strokeStyle = this.colors.grid;
          c.lineWidth = 1;
          c.beginPath();
          for (let x = (org.x - r.x) % step + r.x; x < r.x + r.w; x += step) { c.moveTo(Math.round(x) + 0.5, r.y); c.lineTo(Math.round(x) + 0.5, r.y + r.h); }
          for (let y = (org.y - r.y) % step + r.y; y < r.y + r.h; y += step) { c.moveTo(r.x, Math.round(y) + 0.5); c.lineTo(r.x + r.w, Math.round(y) + 0.5); }
          c.stroke();
        }
        c.restore();
        return this;
      }
      const vb = this.viewBox();
      const step = o.step || niceStep(34 / k);
      const major = step * (o.majorEvery || 5);
      // free 에서만 세로 간격이 따로입니다(1:1 에서는 가로와 같아 기존 동작 그대로)
      const stepY = this.aspect === 'free' ? o.stepY || niceStep(34 / this.ky) : step;
      const majorY = stepY * (o.majorEvery || 5);
      c.lineWidth = 1;
      const lines = (isMajor) => {
        c.beginPath();
        for (let x = Math.ceil(vb.x0 / step) * step; x <= vb.x1; x += step) {
          const m = Math.abs(x / major - Math.round(x / major)) < 1e-6;
          if (m !== isMajor) continue;
          const s = this.toS(x, 0).x;
          c.moveTo(Math.round(s) + 0.5, r.y);
          c.lineTo(Math.round(s) + 0.5, r.y + r.h);
        }
        for (let y = Math.ceil(vb.y0 / stepY) * stepY; y <= vb.y1; y += stepY) {
          const m = Math.abs(y / majorY - Math.round(y / majorY)) < 1e-6;
          if (m !== isMajor) continue;
          const s = this.toS(0, y).y;
          c.moveTo(r.x, Math.round(s) + 0.5);
          c.lineTo(r.x + r.w, Math.round(s) + 0.5);
        }
        c.stroke();
      };
      c.strokeStyle = this.colors.grid;
      lines(false);
      c.strokeStyle = this.colors.gridMajor;
      lines(true);
      c.restore();
      return this;
    }
    axes(o = {}) {
      if (this.kind === 'figure') return this;
      const c = this.ctx;
      const r = this._drawRect(this.paneId);
      const k = this.k;
      const org = this.toS(0, 0);
      c.save();
      c.beginPath();
      c.rect(r.x, r.y, r.w, r.h);
      c.clip();
      c.strokeStyle = this.colors.axis;
      c.lineWidth = 1.4 * this.lw;
      c.setLineDash([]);
      c.beginPath();
      if (org.y >= r.y && org.y <= r.y + r.h) { c.moveTo(r.x, org.y); c.lineTo(r.x + r.w, org.y); }
      if (org.x >= r.x && org.x <= r.x + r.w) { c.moveTo(org.x, r.y); c.lineTo(org.x, r.y + r.h); }
      c.stroke();
      // 화살표 끝
      c.fillStyle = this.colors.axis;
      const arrow = (x, y, ang) => {
        c.save();
        c.translate(x, y);
        c.rotate(ang);
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(-9, -4.5);
        c.lineTo(-9, 4.5);
        c.closePath();
        c.fill();
        c.restore();
      };
      if (org.y >= r.y && org.y <= r.y + r.h) arrow(r.x + r.w - 2, org.y, 0);
      if (org.x >= r.x && org.x <= r.x + r.w) arrow(org.x, r.y + 2, -Math.PI / 2);
      if (o.ticks !== false) {
        const vb = this.viewBox();
        const step = o.tickStep || niceStep(46 / k);
        const stepY = this.aspect === 'free' ? o.tickStepY || niceStep(46 / this.ky) : step;
        c.font = `600 ${11.5 * this.fs}px ${this.font}`;
        c.fillStyle = this.colors.tick;
        c.textAlign = 'center';
        c.textBaseline = 'top';
        const ty = clamp(org.y + 6, r.y + 4, r.y + r.h - 18);
        for (let x = Math.ceil(vb.x0 / step) * step; x <= vb.x1; x += step) {
          if (Math.abs(x) < step / 2) continue;
          const s = this.toS(x, 0).x;
          c.fillText(fmtTick(x, step), s, ty);
          c.fillRect(s - 0.5, org.y - 3, 1, 6);
        }
        c.textAlign = 'right';
        c.textBaseline = 'middle';
        const tx = clamp(org.x - 7, r.x + 26, r.x + r.w - 4);
        for (let y = Math.ceil(vb.y0 / stepY) * stepY; y <= vb.y1; y += stepY) {
          if (Math.abs(y) < stepY / 2) continue;
          const s = this.toS(0, y).y;
          c.fillText(fmtTick(y, stepY), tx, s);
          c.fillRect(org.x - 3, s - 0.5, 6, 1);
        }
        c.textAlign = 'right';
        c.textBaseline = 'top';
        c.fillText('O', org.x - 6, org.y + 5);
        c.font = `italic 600 ${13 * this.fs}px ${this.font}`;
        c.textAlign = 'right';
        c.textBaseline = 'bottom';
        if (o.xLabel !== false) c.fillText(o.xLabel || 'x', r.x + r.w - 6, org.y - 6);
        c.textAlign = 'left';
        c.textBaseline = 'top';
        if (o.yLabel !== false) c.fillText(o.yLabel || 'y', org.x + 8, r.y + 4);
      }
      c.restore();
      return this;
    }

    /* ---------- 그리기 원시 함수 ---------- */
    _P(p) {
      return Array.isArray(p) ? { x: p[0], y: p[1] } : p;
    }
    path(pts, o = {}) {
      if (pts.length < 2) return this;
      const c = this.ctx;
      c.save();
      c.beginPath();
      pts.forEach((p, i) => {
        const s = this.toS(this._P(p));
        i ? c.lineTo(s.x, s.y) : c.moveTo(s.x, s.y);
      });
      if (o.close) c.closePath();
      if (o.fill) {
        c.fillStyle = this._fill(o);
        c.fill();
      }
      if (o.color !== null && o.stroke !== false) {
        this._stroke(o);
        c.stroke();
      }
      c.restore();
      return this;
    }
    seg(p, q, o = {}) {
      return this.path([p, q], o);
    }
    /** 점 p를 지나는 기울기 m의 직선(또는 점 q를 지나는 직선)을 화면 끝까지 */
    line(p, mOrQ, o = {}) {
      p = this._P(p);
      let dx, dy;
      if (typeof mOrQ === 'number') { dx = 1; dy = mOrQ; }
      else if (mOrQ && mOrQ.vertical) { dx = 0; dy = 1; }
      else { const q = this._P(mOrQ); dx = q.x - p.x; dy = q.y - p.y; }
      const len = Math.hypot(dx, dy) || 1;
      dx /= len;
      dy /= len;
      let t0, t1;
      if (o.extent != null) {
        const e = o.extent;
        if (Array.isArray(e)) { t0 = e[0]; t1 = e[1]; } else { t0 = -e; t1 = e; }
        // extent는 x방향 거리(기존 실험실과 같은 의미)
        const sx = Math.abs(dx) > 1e-9 ? 1 / dx : 1;
        t0 *= Math.abs(sx);
        t1 *= Math.abs(sx);
      } else {
        const vb = this.viewBox();
        const R = Math.hypot(vb.x1 - vb.x0, vb.y1 - vb.y0) * 1.2 + Math.hypot(p.x, p.y);
        t0 = -R;
        t1 = R;
      }
      return this.path([{ x: p.x + dx * t0, y: p.y + dy * t0 }, { x: p.x + dx * t1, y: p.y + dy * t1 }], o);
    }
    vline(x, o = {}) {
      const vb = this.viewBox();
      return this.seg({ x, y: vb.y0 - 1 }, { x, y: vb.y1 + 1 }, o);
    }
    hline(y, o = {}) {
      const vb = this.viewBox();
      return this.seg({ x: vb.x0 - 1, y }, { x: vb.x1 + 1, y }, o);
    }
    poly(pts, o = {}) {
      return this.path(pts, { ...o, close: true });
    }
    /** y = f(x) 그래프. 불연속(값 폭주)에서 선을 끊습니다. */
    plot(f, o = {}) {
      const c = this.ctx;
      const vb = this.viewBox();
      const x0 = Math.max(o.from == null ? -Infinity : o.from, vb.x0 - 0.2);
      const x1 = Math.min(o.to == null ? Infinity : o.to, vb.x1 + 0.2);
      if (!(x1 > x0)) return this;
      const k = this.k;
      const n = Math.min(4000, Math.ceil(((x1 - x0) * k) / (o.res || 1.5)));
      const dx = (x1 - x0) / n;
      const r = this._drawRect(this.paneId);
      c.save();
      this._stroke(o, 3);
      c.beginPath();
      let pen = false;
      let prev = null;
      for (let i = 0; i <= n; i++) {
        const x = i === n ? x1 : x0 + i * dx;
        const y = f(x);
        if (!Number.isFinite(y)) { pen = false; prev = null; continue; }
        const s = this.toS(x, y);
        if (prev && Math.abs(s.y - prev.y) > r.h * 1.5) pen = false;
        if (s.y < r.y - r.h * 4 || s.y > r.y + r.h * 5) { pen = false; prev = s; continue; }
        pen ? c.lineTo(s.x, s.y) : c.moveTo(s.x, s.y);
        pen = true;
        prev = s;
      }
      c.stroke();
      c.restore();
      return this;
    }
    circle(center, rad, o = {}) {
      return this.arc(center, rad, 0, Math.PI * 2, o);
    }
    /** 세계 좌표 각도(라디안, 수학 방향)로 호를 그립니다. figure 좌표계에서는 화면 각도 그대로입니다. */
    arc(center, rad, a0, a1, o = {}) {
      const c = this.ctx;
      const s = this.toS(this._P(center));
      const R = rad * this.k;
      c.save();
      c.beginPath();
      // figure: 화면 각도(시계 방향 증가) 그대로 / cartesian: 수학 각도(반시계 방향 증가)
      if (this.kind === 'figure') c.arc(s.x, s.y, R, a0, a1, !!o.ccw);
      else c.arc(s.x, s.y, R, -a0, -a1, !o.cw);
      if (o.sector) { c.lineTo(s.x, s.y); c.closePath(); }
      if (o.fill) { c.fillStyle = this._fill(o); c.fill(); }
      if (o.color !== null && o.stroke !== false) { this._stroke(o); c.stroke(); }
      c.restore();
      return this;
    }
    /** 각 표시: 꼭짓점 v에서 p1→p2 쪽으로. rings=호 개수, label=각 이름 */
    angle(v, p1, p2, o = {}) {
      const c = this.ctx;
      v = this.toS(this._P(v));
      p1 = this.toS(this._P(p1));
      p2 = this.toS(this._P(p2));
      const t1 = Math.atan2(p1.y - v.y, p1.x - v.x);
      const t2 = Math.atan2(p2.y - v.y, p2.x - v.x);
      const d = ((t2 - t1 + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      const r = (o.r || 26) * (this.thumb ? 0.7 : 1);
      const col = o.color || 'amber';
      const em = this._em(o);
      c.save();
      c.beginPath();
      c.moveTo(v.x, v.y);
      c.arc(v.x, v.y, r, t1, t1 + d, d < 0);
      c.closePath();
      c.fillStyle = this.color(col, em === -1 ? 0.04 : 0.15);
      c.fill();
      c.strokeStyle = this.color(col, em === -1 ? 0.25 : 1);
      c.lineWidth = 2 * this.lw;
      c.setLineDash([]);
      for (let i = 0; i < (o.rings || 1); i++) {
        const rr = r - i * 4.5;
        if (rr > 4) { c.beginPath(); c.arc(v.x, v.y, rr, t1, t1 + d, d < 0); c.stroke(); }
      }
      c.restore();
      if (o.label) {
        const m = t1 + d / 2;
        const lr = r + (o.labelGap || 14);
        this._text(v.x + Math.cos(m) * lr, v.y + Math.sin(m) * lr, o.label, { color: col, size: o.size || 12.5, align: 'center', baseline: 'middle', weight: 800, ref: o.ref, part: o.part });
      }
      return this;
    }
    /** 직각 표시 */
    right(v, p1, p2, o = {}) {
      const c = this.ctx;
      v = this.toS(this._P(v));
      p1 = this.toS(this._P(p1));
      p2 = this.toS(this._P(p2));
      const n = (a, b) => { const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1; return { x: dx / l, y: dy / l }; };
      const size = (o.size || 12) * (this.thumb ? 0.7 : 1);
      const d1 = n(v, p1), d2 = n(v, p2);
      const a = { x: v.x + d1.x * size, y: v.y + d1.y * size };
      const b = { x: a.x + d2.x * size, y: a.y + d2.y * size };
      const e = { x: v.x + d2.x * size, y: v.y + d2.y * size };
      const col = o.color || 'amber';
      c.save();
      c.beginPath();
      c.moveTo(v.x, v.y); c.lineTo(a.x, a.y); c.lineTo(b.x, b.y); c.lineTo(e.x, e.y); c.closePath();
      c.fillStyle = this.color(col, 0.18);
      c.fill();
      c.beginPath();
      c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.lineTo(e.x, e.y);
      c.strokeStyle = this.color(col);
      c.lineWidth = 1.9 * this.lw;
      c.setLineDash([]);
      c.stroke();
      c.restore();
      return this;
    }
    /** 같은 길이 표시(눈금) */
    ticks(p, q, o = {}) {
      const c = this.ctx;
      p = this.toS(this._P(p));
      q = this.toS(this._P(q));
      const m = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
      const l = Math.hypot(q.x - p.x, q.y - p.y) || 1;
      const d = { x: (q.x - p.x) / l, y: (q.y - p.y) / l };
      const nrm = { x: -d.y, y: d.x };
      const size = o.size || 6.5;
      const count = o.count || 1;
      c.save();
      c.strokeStyle = this.color(o.color || 'amber');
      c.lineWidth = 2.1 * this.lw;
      c.setLineDash([]);
      for (let i = 0; i < count; i++) {
        const off = (i - (count - 1) / 2) * 4.5;
        const cc = { x: m.x + d.x * off, y: m.y + d.y * off };
        c.beginPath();
        c.moveTo(cc.x - nrm.x * size, cc.y - nrm.y * size);
        c.lineTo(cc.x + nrm.x * size, cc.y + nrm.y * size);
        c.stroke();
      }
      c.restore();
      return this;
    }
    /** 점(고정). label은 화면 픽셀 오프셋(dx, dy)으로 배치 */
    point(p, o = {}) {
      const c = this.ctx;
      const s = this.toS(this._P(p));
      const em = this._em(o);
      const col = o.color || 'ink';
      const r = (o.r || 5) * (this.thumb ? 0.75 : 1) * (em === 1 ? 1.25 : 1);
      c.save();
      c.setLineDash([]);
      c.beginPath();
      c.arc(s.x, s.y, r, 0, Math.PI * 2);
      if (o.hollow) {
        c.fillStyle = this.colors.halo;
        c.fill();
        c.lineWidth = 2.4;
        c.strokeStyle = this.color(col, em === -1 ? 0.3 : 1);
        c.stroke();
      } else {
        c.fillStyle = this.color(col, em === -1 ? 0.3 : 1);
        if (this.glowOn && o.glow !== false) { c.shadowColor = this.color(col, 0.7); c.shadowBlur = 8; }
        c.fill();
        c.shadowBlur = 0;
        c.lineWidth = 1.8;
        c.strokeStyle = this.colors.halo;
        c.stroke();
      }
      c.restore();
      if (o.label) this._pointLabel(s, o);
      return this;
    }
    _pointLabel(s, o) {
      let dx = o.dx, dy = o.dy, align = o.align || 'left';
      if (dx == null && dy == null) {
        if (o.toward) {
          const t = this.toS(this._P(o.toward));
          const vx = s.x - t.x, vy = s.y - t.y, l = Math.hypot(vx, vy) || 1;
          dx = (vx / l) * 18;
          dy = (vy / l) * 18;
          align = 'center';
        } else { dx = 10; dy = -10; }
      }
      // 무대 가장자리(도구 막대 포함)에 닿으면 라벨을 점의 반대쪽으로 넘깁니다 — 점을 끌어 가장자리로 가도 잘리지 않습니다.
      if (!this._bbox && !this.thumb && align !== 'center') {
        const c = this.ctx;
        const size = (o.size || 12.5) * this.fs * this._ts();
        c.save();
        c.font = `800 ${size}px ${this.font}`;
        const w = c.measureText(String(o.label)).width;
        c.restore();
        const right = this.W - (this.panes ? 0 : this.insets.right) - 6;
        const x0 = align === 'left' ? s.x + dx : s.x + dx - w; // 지금 라벨의 왼쪽 끝
        if (x0 < 6 || x0 + w > right) {
          const flipped = align === 'left' ? s.x - dx - w : s.x - dx;
          if ((dx >= 0) === (align === 'left') && flipped >= 6 && flipped + w <= right) {
            dx = -dx;
            align = align === 'left' ? 'right' : 'left';
          } else {
            // 양쪽 다 넘치는 긴 라벨: 점 바로 위(위가 좁으면 아래)에 놓고 무대 안으로 밀어 넣습니다.
            align = 'left';
            dx = clamp(s.x - w / 2, 6, Math.max(6, right - w)) - s.x;
            dy = s.y - size * 1.6 > size ? -size * 1.6 : size * 1.6;
          }
        }
        const y = s.y + dy;
        if ((y < size && dy < 0) || (y > this.H - size && dy > 0)) dy = -dy;
      }
      this._text(s.x + dx, s.y + dy, o.label, { color: o.labelColor || o.color || 'ink', size: o.size || 12.5, weight: 800, align, baseline: o.baseline || 'middle', ref: o.ref, part: o.part });
    }
    /** 드래그 가능한 핸들: 후광(halo)과 고리로 '움직일 수 있음'을 알려 줍니다. */
    handle(id, p, o = {}) {
      const c = this.ctx;
      const w = this._P(p);
      const s = this.toS(w);
      const col = o.color || 'amber';
      const hot = this.hoverId === id || (this.dragging && this.dragging.id === id);
      const active = this.activeHandle === id;
      const R = (o.r || 6.5) * this.hr * (this.thumb ? 0.8 : 1);
      c.save();
      c.setLineDash([]);
      if (!this.thumb) {
        c.beginPath();
        c.arc(s.x, s.y, R + (this.dragging && this.dragging.id === id ? 15 : hot ? 12 : 9), 0, Math.PI * 2);
        c.fillStyle = this.color(col, hot ? 0.3 : 0.2);
        c.fill();
        if (active && this._kbFocus) {
          c.lineWidth = 2;
          c.strokeStyle = this.color('ink', 0.85);
          c.setLineDash([3, 3]);
          c.stroke();
          c.setLineDash([]);
        }
      }
      c.beginPath();
      c.arc(s.x, s.y, R, 0, Math.PI * 2);
      c.fillStyle = this.color(col);
      if (this.glowOn) { c.shadowColor = this.color(col, 0.8); c.shadowBlur = 10; }
      c.fill();
      c.shadowBlur = 0;
      c.lineWidth = 2.4;
      c.strokeStyle = this.colors.halo;
      c.stroke();
      c.restore();
      if (o.label) this._pointLabel(s, { ...o, color: col });
      if (!this.thumb) this.handles.push({ id, x: s.x, y: s.y, w, drag: o.drag, step: o.step, ky: this.aspect === 'free' ? this.ky : undefined, priority: o.priority || 0, label: o.ariaLabel || o.label || id });
      return this;
    }
    /** 캔버스 글자(후광 포함). p는 세계 좌표. */
    text(p, str, o = {}) {
      const s = this.toS(this._P(p));
      return this._text(s.x + (o.dx || 0), s.y + (o.dy || 0), str, o);
    }
    /** 화면 좌표 글자(자동 맞춤 계산에서는 빠집니다) */
    stext(x, y, str, o = {}) {
      return this._text(x, y, str, o, true);
    }
    /** 도형(figure) 좌표계에서 화면이 작아 도형이 줄어들면 라벨도 조금(최대 22%) 줄여 겹침을 줄입니다. */
    _ts() {
      if (this.kind !== 'figure' || this.thumb) return 1;
      return clamp(0.55 + 0.45 * this.k, 0.78, 1);
    }
    _text(x, y, str, o = {}, screen = false) {
      if (str == null || str === '') return this;
      const c = this.ctx;
      const em = this._em(o);
      const size = (o.size || 13) * this.fs * (this.thumb ? 0.78 : this._ts());
      c.save();
      c.font = `${o.weight || 750} ${size}px ${this.font}`;
      c.textAlign = o.align || 'center';
      c.textBaseline = o.baseline || 'alphabetic';
      if (this._bbox && !screen) {
        // 재는 중: 글자 상자를 '세계 기준점 + 화면 픽셀 크기'로 기록(fitBox가 배율과 함께 풉니다)
        const w = c.measureText(String(str)).width;
        const al = c.textAlign, bl = c.textBaseline;
        const l = al === 'center' ? -w / 2 : al === 'right' || al === 'end' ? -w : 0;
        const t = bl === 'middle' ? -size / 2 : bl === 'top' || bl === 'hanging' ? 0 : bl === 'bottom' ? -size : -size * 0.8;
        const ref = this.toW(x, y);
        this._bbox.texts.push({ x: ref.x, y: ref.y, l: l - 3, r: l + w + 3, t: t - 3, b: t + size + 3 });
      }
      c.setLineDash([]);
      c.shadowBlur = 0;
      if (o.halo !== false) {
        c.lineJoin = 'round';
        c.lineWidth = 4;
        c.strokeStyle = this.colors.halo;
        c.strokeText(str, x, y);
      }
      c.fillStyle = this.color(o.color || 'ink', em === -1 ? 0.3 : o.alpha);
      c.fillText(str, x, y);
      c.restore();
      return this;
    }
    /** KaTeX 수식 라벨(HTML 오버레이). 썸네일·내보내기에서는 plain 문자열로 대신 그립니다. */
    math(key, p, texSrc, o = {}) {
      const s = this.toS(this._P(p));
      const x = s.x + (o.dx || 0);
      const y = s.y + (o.dy || 0);
      if (!this.labelLayer || this.thumb || this.exporting) {
        if (o.plain) this._text(x, y, o.plain, { color: o.color, size: o.size || 13, align: 'center', baseline: 'middle' });
        return this;
      }
      this._used.add(key);
      let el = this._labels.get(key);
      if (!el) {
        el = document.createElement('div');
        el.className = 'apl-mlabel';
        this.labelLayer.append(el);
        this._labels.set(key, el);
      }
      if (el.hidden) el.hidden = false;
      const html = APLab.tex(texSrc);
      if (el.__h !== html) { el.__h = html; el.innerHTML = html; }
      el.classList.toggle('box', !!o.box);
      el.style.setProperty('--c', this.color(o.color || 'ink'));
      const ax = o.anchor === 'left' ? '0%' : o.anchor === 'right' ? '-100%' : '-50%';
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(${ax}, -50%)`;
      return this;
    }
    clearLabels() {
      for (const el of this._labels.values()) el.remove();
      this._labels.clear();
    }

    /* ---------- 상호작용: 포인터·핀치·휠·키보드 ---------- */
    _bind() {
      const cv = this.canvas;
      const pts = new Map();
      let pinch = null;
      let pan = null;
      const local = (e) => {
        const r = cv.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      };
      const hit = (p, touch) => {
        const tol = touch ? 30 : 20;
        let best = null;
        let bd = Infinity;
        for (const h of this.handles) {
          const raw = Math.hypot(h.x - p.x, h.y - p.y);
          const d = raw - (h.priority || 0) * 8;
          if (raw < tol && d < bd) { bd = d; best = h; }
        }
        return best;
      };
      cv.addEventListener('pointerdown', (e) => {
        if (e.button && e.button !== 0) return;
        cv.focus({ preventScroll: true });
        this._kbFocus = false;
        const p = local(e);
        pts.set(e.pointerId, p);
        try { cv.setPointerCapture(e.pointerId); } catch (_) {}
        if (pts.size === 2 && this.zoomable) {
          const [a, b] = [...pts.values()];
          pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
          this.dragging = null;
          pan = null;
          return;
        }
        const h = hit(p, e.pointerType === 'touch');
        if (h && h.drag) {
          const wp = this.toW(p.x, p.y);
          this.dragging = { id: h.id, off: { x: h.w.x - wp.x, y: h.w.y - wp.y }, drag: h.drag };
          this.activeHandle = h.id;
          cv.classList.add('is-dragging');
          this.onDragState(true, h.id);
          this.onInteract('drag-start');
        } else if (this.pannable) {
          pan = { x: p.x, y: p.y };
          cv.classList.add('is-dragging');
        }
        e.preventDefault();
      });
      cv.addEventListener('pointermove', (e) => {
        const p = local(e);
        if (pts.has(e.pointerId)) pts.set(e.pointerId, p);
        if (pinch && pts.size >= 2) {
          const [a, b] = [...pts.values()];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          this.panX += mx - pinch.mx;
          this.panY += my - pinch.my;
          if (pinch.d > 10) this.zoomAt(d / pinch.d, mx, my);
          pinch = { d, mx, my };
          this.onInteract('view');
          return;
        }
        if (this.dragging) {
          const wp = this.toW(p.x, p.y);
          this.dragging.drag({ x: wp.x + this.dragging.off.x, y: wp.y + this.dragging.off.y }, e);
          this.onInteract('drag');
          return;
        }
        if (pan) {
          if (this.onPanDrag) this.onPanDrag(p.x - pan.x, p.y - pan.y);
          else {
            this.panX += p.x - pan.x;
            this.panY += p.y - pan.y;
          }
          pan = { x: p.x, y: p.y };
          this.onInteract('view');
          return;
        }
        if (e.pointerType !== 'touch') {
          const h = hit(p, false);
          const id = h && h.drag ? h.id : null;
          if (id !== this.hoverId) {
            this.hoverId = id;
            cv.classList.toggle('on-handle', !!id);
            this.onInteract('hover');
          }
        }
      });
      const up = (e) => {
        pts.delete(e.pointerId);
        if (pts.size < 2) pinch = null;
        if (this.dragging) {
          this.dragging = null;
          this.onDragState(false);
          this.onInteract('drag-end');
        }
        pan = null;
        cv.classList.remove('is-dragging');
      };
      cv.addEventListener('pointerup', up);
      cv.addEventListener('pointercancel', up);
      cv.addEventListener('pointerleave', (e) => {
        if (e.pointerType !== 'touch' && this.hoverId && !this.dragging) {
          this.hoverId = null;
          cv.classList.remove('on-handle');
          this.onInteract('hover');
        }
      });
      cv.addEventListener('wheel', (e) => {
        if (!this.zoomable) return;
        e.preventDefault();
        const p = local(e);
        const f = Math.exp(-clamp(e.deltaY, -120, 120) * (e.ctrlKey ? 0.01 : 0.0018));
        this.zoomAt(f, p.x, p.y);
        this.onInteract('view');
      }, { passive: false });
      cv.addEventListener('dblclick', (e) => {
        const p = local(e);
        if (!hit(p, false)) { this.fit(); this.onInteract('view'); }
      });
      cv.addEventListener('keydown', (e) => {
        const dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
        if (e.key === 'Tab') return;
        if (!dirs[e.key]) {
          if (e.key === 'n' || e.key === 'N') {
            const ids = this.handles.filter((h) => h.drag).map((h) => h.id);
            if (ids.length) {
              const i = ids.indexOf(this.activeHandle);
              this.activeHandle = ids[(i + 1) % ids.length];
              this._kbFocus = true;
              this.onInteract('hover');
              e.preventDefault();
              e.stopPropagation();
            }
          }
          return;
        }
        const list = this.handles.filter((h) => h.drag);
        if (!list.length) return;
        let h = list.find((x) => x.id === this.activeHandle) || list[0];
        this.activeHandle = h.id;
        this._kbFocus = true;
        const [dx, dy] = dirs[e.key];
        const step = h.step || (e.shiftKey ? 40 : 8) / this.k;
        const stepY = h.step || (e.shiftKey ? 40 : 8) / (h.ky || this.k); // free: 창마다 세로 배율이 다름
        const sy = this.kind === 'figure' ? -dy : dy;
        h.drag({ x: h.w.x + dx * step, y: h.w.y + sy * stepY }, e);
        this.onInteract('drag');
        e.preventDefault();
        e.stopPropagation();
      });
    }

    /**
     * 그리기 함수를 한 번 '재기만' 하여 도형이 차지하는 세계 좌표 범위와 글자 상자(texts)를 구합니다(자동 맞춤).
     * 잰 그림은 지우고 강조 상태는 유지하므로 draw 안에서 불러도 됩니다.
     */
    measure(drawFn) {
      const outer = this._bbox; // 재는 중에 다시 재는 경우(장면 안에서 맞춤)
      this._bbox = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity, texts: [] };
      const keep = this.labelLayer;
      const emph = this.emph;
      this.labelLayer = null;
      try { this.begin({ emph }); drawFn(); } catch (e) { console.warn('measure', e); }
      this.labelLayer = keep;
      const bb = this._bbox;
      this._bbox = outer;
      this.begin({ emph });
      return bb.x1 > bb.x0 && bb.y1 > bb.y0 ? bb : null;
    }
    /**
     * 점 범위(x0~y1)와 글자 상자(texts)가 모두 무대 안에 들어오는 focus를 구합니다.
     * 글자는 확대해도 크기가 같은 화면 픽셀이라, 배율 k를 이분 탐색으로 풀어 라벨이 잘리지 않는 가장 큰 그림을 찾습니다.
     * margin: 점 범위에 비례한 숨 쉴 공간, px: 가장자리에 더 둘 화면 픽셀
     */
    fitBox(bb, { margin = 0.06, px = 10 } = {}) {
      const a = this._area();
      const padPx = this.pad * Math.min(a.w, a.h);
      const W = a.w - padPx * 2, H = a.h - padPx * 2;
      const sg = this.kind === 'figure' ? 1 : -1; // 화면 y 방향
      const mx = (bb.x1 - bb.x0) * margin, my = (bb.y1 - bb.y0) * margin;
      const texts = bb.texts || [];
      const X = [{ v: bb.x0 - mx, l: -px, r: 0 }, { v: bb.x1 + mx, l: 0, r: px }, ...texts.map((t) => ({ v: t.x, l: t.l - px, r: t.r + px }))];
      const Y = [{ v: sg * (bb.y0 - my), l: -px, r: px }, { v: sg * (bb.y1 + my), l: -px, r: px }, ...texts.map((t) => ({ v: sg * t.y, l: t.t - px, r: t.b + px }))];
      const span = (items, k) => {
        let lo = Infinity, hi = -Infinity;
        for (const it of items) {
          lo = Math.min(lo, it.v * k + it.l);
          hi = Math.max(hi, it.v * k + it.r);
        }
        return { lo, hi };
      };
      const fits = (k) => { const x = span(X, k), y = span(Y, k); return x.hi - x.lo <= W && y.hi - y.lo <= H; };
      let lo = 0, hi = Math.min(W / Math.max(1e-9, bb.x1 - bb.x0 + 2 * mx), H / Math.max(1e-9, bb.y1 - bb.y0 + 2 * my));
      if (!fits(1e-9)) { // 글자만으로도 넘치면(아주 작은 화면) 점 범위만 맞춥니다
        X.length = 2; Y.length = 2;
      }
      for (let i = 0; i < 40; i++) {
        const mid = (lo + hi) / 2;
        if (fits(mid)) lo = mid; else hi = mid;
      }
      const k = Math.max(lo, 1e-6);
      const sx = span(X, k), sy = span(Y, k);
      const cx = (sx.lo + sx.hi) / 2 / k, cy = (sg * (sy.lo + sy.hi)) / 2 / k;
      // 무대 전체가 아니라 '내용(라벨 포함)의 범위'를 돌려줍니다 → 나중에 무대 크기·여백이 바뀌어도 그 비율대로 다시 맞춰집니다.
      const hw = (sx.hi - sx.lo) / k / 2, hh = (sy.hi - sy.lo) / k / 2;
      return { x: [cx - hw, cx + hw], y: [cy - hh, cy + hh] };
    }

    /* ---------- 이미지 내보내기 ---------- */
    snapshot(draw, extraCanvas) {
      this.exporting = true;
      draw();
      this.exporting = false;
      const out = document.createElement('canvas');
      out.width = this.canvas.width;
      out.height = this.canvas.height;
      const c = out.getContext('2d');
      c.drawImage(this.canvas, 0, 0);
      if (extraCanvas) c.drawImage(extraCanvas, 0, 0);
      draw();
      return out;
    }
  }

  /** 정적 썸네일: 같은 그리기 함수를 작은 캔버스에 한 번 그립니다. */
  Board.renderThumb = function (canvas, opts, drawFn) {
    const b = new Board(canvas, { ...opts, interactive: false, thumb: true });
    const r = canvas.getBoundingClientRect();
    b.resize(r.width || 240, r.height || 150);
    b.pad = opts.pad == null ? 0.05 : opts.pad;
    b.begin();
    try { drawFn(b); } catch (e) { console.warn('thumb', e); }
    return b;
  };

  APLab.Board = Board;
})();
