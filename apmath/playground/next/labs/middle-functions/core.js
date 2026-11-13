/* Middle-school functions: small content adapter for the existing AP Lab kit.
 * Cartesian geometry, touch/keyboard handles, zoom/pan, shell and one-click
 * playback remain owned by kit/apl-*.js. This module only supplies common
 * mathematical drawing helpers, isolated scene state and content registration.
 * No Archive question/answer data is loaded or changed by the student runtime.
 */
(function () {
  'use strict';
  const labs = Object.create(null);
  const tiers = { concept: '개념', basic: '기본', advanced: '심화' };
  const call = (fn, ...args) => typeof fn === 'function' ? fn(...args) : fn;
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const p = (x, y) => ({ x, y });
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function n(value, digits = 2) {
    if (!Number.isFinite(value)) return '정의되지 않음';
    const rounded = +value.toFixed(digits);
    return String(Object.is(rounded, -0) ? 0 : rounded).replace('-', '−');
  }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; }
  function frac(a, b) {
    if (!Number.isFinite(a) || !Number.isFinite(b) || Math.abs(b) < 1e-12) return '\\text{정의되지 않음}';
    if (!Number.isInteger(a) || !Number.isInteger(b)) return f(a / b);
    if (b < 0) { a = -a; b = -b; }
    const g = gcd(a, b); a /= g; b /= g;
    return b === 1 ? String(a) : `${a < 0 ? '-' : ''}\\frac{${Math.abs(a)}}{${b}}`;
  }
  function f(value) {
    if (!Number.isFinite(value)) return '\\text{정의되지 않음}';
    for (let den = 1; den <= 1000; den++) {
      const num = Math.round(value * den);
      if (Math.abs(value - num / den) < 1e-9) return frac(num, den);
    }
    return n(value, 3).replace('−', '-');
  }
  const signed = v => `${v < 0 ? '−' : '+'}${n(Math.abs(v))}`;
  function box(points, opts = {}) {
    const pts = points.filter(q => q && Number.isFinite(q.x) && Number.isFinite(q.y));
    if (opts.origin !== false) pts.push(p(0, 0));
    if (!pts.length) return { x: [-5, 5], y: [-5, 5] };
    const pad = opts.pad == null ? 1.5 : opts.pad, minSpan = opts.minSpan || 8;
    const range = key => {
      const lo = Math.min(...pts.map(q => q[key])), hi = Math.max(...pts.map(q => q[key]));
      const half = Math.max(minSpan / 2, (hi - lo) / 2 + pad), mid = (hi + lo) / 2;
      return [mid - half, mid + half];
    };
    return { x: range('x'), y: range('y') };
  }
  const line = (b, a, intercept, opts = {}) => b.line(p(0, intercept), a, { color: 'sky', width: 3, ...opts });
  const curve = (b, fn, opts = {}) => b.plot(fn, { color: 'sky', width: 3, ...opts });
  function inverse(b, k, opts = {}) {
    // Two separate native paths guarantee that no segment crosses x=0.
    const gap = Math.max(1e-5, Math.min(0.05, 0.5 / Math.max(1, b.k)));
    curve(b, x => k / x, { ...opts, from: opts.from, to: Math.min(-gap, opts.to == null ? -gap : opts.to) });
    curve(b, x => k / x, { ...opts, from: Math.max(gap, opts.from == null ? gap : opts.from), to: opts.to });
  }
  // The native point-label API expects both pixel offsets when either is set.
  // Leave an offset-free option untouched so its automatic/toward placement works.
  const pointOptions = opts => opts.dx != null || opts.dy != null
    ? { ...opts, dx: opts.dx ?? 10, dy: opts.dy ?? -10 } : opts;
  const point = (b, P, name, opts = {}) => b.point(P, { r: 5, size: 14, color: 'sky', label: name, ...pointOptions(opts) });
  const label = (b, P, text, opts = {}) => b.text(P, text, { size: 14, color: 'ink', align: 'center', ...opts });
  function projection(b, P, opts = {}) {
    const o = { color: 'muted', width: 1.5, dash: [5, 4], ...opts };
    b.seg(p(P.x, 0), P, o); b.seg(p(0, P.y), P, o);
  }
  function axisOccluders(b, lab) {
    const canvas = b.canvas?.getBoundingClientRect?.();
    if (!canvas?.width || !canvas?.height) return [];
    const sx = b.W / canvas.width, sy = b.H / canvas.height;
    return [lab?.ui?.tools, lab?.toc?.ui?.handle, lab?.ui?.status].flatMap(el => {
      if (!el?.getBoundingClientRect || el.hidden || el.isConnected === false) return [];
      if (el.checkVisibility) {
        if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return [];
      } else {
        const style = el.ownerDocument?.defaultView?.getComputedStyle?.(el);
        if (style && (style.display === 'none' || style.visibility === 'hidden' || +style.opacity === 0)) return [];
      }
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return [];
      return [{ left: (r.left - canvas.left) * sx, right: (r.right - canvas.left) * sx,
        top: (r.top - canvas.top) * sy, bottom: (r.bottom - canvas.top) * sy }];
    });
  }
  // Keep native axis geometry/spacing. Only its text is bounded for these labs:
  // a partial/covered number is omitted at its original tick; names retain units.
  function axes(b, options = {}, lab) {
    const c = b.ctx;
    if (!c?.fillText || !c.measureText || b.thumb || b._bbox || !(b.W > 0 && b.H > 0)) return b.axes(options);
    const r = b._drawRect ? b._drawRect(b.paneId) : { x: 0, y: 0, w: b.W, h: b.H };
    const safe = { left: Math.max(0, r.x) + 2, right: Math.min(b.W, r.x + r.w) - 2,
      top: Math.max(0, r.y) + 2, bottom: Math.min(b.H, r.y + r.h) - 2 };
    const obstacles = axisOccluders(b, lab), names = [];
    const overlap = (a, z) => a.left < z.right + 2 && a.right > z.left - 2 && a.top < z.bottom + 2 && a.bottom > z.top - 2;
    const fits = (a, avoid) => a.left >= safe.left && a.right <= safe.right && a.top >= safe.top && a.bottom <= safe.bottom && !avoid.some(z => overlap(a, z));
    const original = c.fillText, origin = b.toS(0, 0);
    c.fillText = function (value, x, y, maxWidth) {
      const text = String(value), m = this.measureText(text), size = +(this.font.match(/([\d.]+)px/)?.[1] || 13);
      const scale = Number.isFinite(maxWidth) && maxWidth < m.width ? maxWidth / m.width : 1, width = m.width * scale;
      const right = this.textAlign === 'right' || (this.textAlign === 'end' && this.direction !== 'rtl') || (this.textAlign === 'start' && this.direction === 'rtl');
      const left = this.textAlign === 'center' ? -width / 2 : right ? -width : 0;
      const top = ({ top: 0, hanging: -.2, middle: -.6, bottom: -1.2, ideographic: -1.2 })[this.textBaseline] ?? -.9;
      // Include font-box/fallback bounds as well as actual glyphs (italic bearings
      // and font ascent can exceed the advance width and the nominal font size).
      const xs = [x + left, x + left + width], ys = [y + top * size, y + (top + 1.2) * size];
      if (Number.isFinite(m.actualBoundingBoxLeft) && Number.isFinite(m.actualBoundingBoxRight)) xs.push(x - m.actualBoundingBoxLeft * scale, x + m.actualBoundingBoxRight * scale);
      for (const kind of ['actual', 'font']) if (Number.isFinite(m[`${kind}BoundingBoxAscent`]) && Number.isFinite(m[`${kind}BoundingBoxDescent`])) ys.push(y - m[`${kind}BoundingBoxAscent`], y + m[`${kind}BoundingBoxDescent`]);
      const sx = b.W / (b.canvas?.width || b.W), sy = b.H / (b.canvas?.height || b.H);
      const t = this.getTransform ? this.getTransform() : { a: 1 / sx, b: 0, c: 0, d: 1 / sy, e: 0, f: 0 };
      const a = t.a * sx, d = t.d * sy, bc = t.b * sy, cc = t.c * sx, det = a * d - bc * cc;
      if (!Number.isFinite(det) || Math.abs(det) < 1e-10) return original.apply(this, arguments);
      const points = xs.flatMap(px => ys.map(py => ({ x: a * px + cc * py + t.e * sx, y: bc * px + d * py + t.f * sy })));
      const bounds = { left: Math.min(...points.map(p => p.x)), right: Math.max(...points.map(p => p.x)), top: Math.min(...points.map(p => p.y)), bottom: Math.max(...points.map(p => p.y)) };
      const axis = /\bitalic\b/.test(this.font) && (text === (options.xLabel || 'x') ? 'x' : text === (options.yLabel || 'y') ? 'y' : null);
      if (!axis) {
        // O must never be clamped to an edge when the true origin is off screen.
        if (text === 'O' && !(origin.x >= r.x && origin.x <= r.x + r.w && origin.y >= r.y && origin.y <= r.y + r.h)) return;
        if (fits(bounds, obstacles)) return original.apply(this, arguments);
        return;
      }
      const avoid = [...obstacles, ...names];
      let dx = 0, dy = 0;
      if (!fits(bounds, avoid)) {
        const x0 = safe.left - bounds.left, x1 = safe.right - bounds.right, y0 = safe.top - bounds.top, y1 = safe.bottom - bounds.bottom;
        if (x0 > x1 || y0 > y1) return;
        const xx = [clamp(0, x0, x1), x0, x1], yy = [clamp(0, y0, y1), y0, y1];
        for (const z of avoid) { xx.push(z.left - bounds.right - 2, z.right - bounds.left + 2); yy.push(z.top - bounds.bottom - 2, z.bottom - bounds.top + 2); }
        let best = Infinity;
        for (const tx of xx) for (const ty of yy) {
          const shifted = { left: bounds.left + tx, right: bounds.right + tx, top: bounds.top + ty, bottom: bounds.bottom + ty };
          const score = axis === 'x' ? tx * tx + 4 * ty * ty : 4 * tx * tx + ty * ty;
          if (score < best && fits(shifted, avoid)) { best = score; dx = tx; dy = ty; }
        }
        if (!Number.isFinite(best)) return;
      }
      names.push({ left: bounds.left + dx, right: bounds.right + dx, top: bounds.top + dy, bottom: bounds.bottom + dy });
      const nx = x + (d * dx - cc * dy) / det, ny = y + (a * dy - bc * dx) / det;
      return arguments.length > 3 ? original.call(this, value, nx, ny, maxWidth) : original.call(this, value, nx, ny);
    };
    try { return b.axes(options); } finally { c.fillText = original; }
  }
  function riseRun(b, P, Q, opts = {}) {
    const corner = p(Q.x, P.y), o = { color: 'green', width: 2.4, ...opts };
    b.seg(P, corner, o); b.seg(corner, Q, o);
    if (opts.dxLabel) label(b, p((P.x + Q.x) / 2, P.y), opts.dxLabel, { color: o.color, dy: 18 });
    if (opts.dyLabel) label(b, p(Q.x, (P.y + Q.y) / 2), opts.dyLabel, { color: o.color, dx: 16, align: 'left' });
  }
  const polygon = (b, pts, opts = {}) => b.poly(pts, { color: 'green', width: 2, fill: 'green', fillAlpha: 0.13, ...opts });
  function drag(b, ctx, id, P, opts = {}) {
    const { x, y, ...style } = opts;
    b.handle(`${ctx.spec.id}:${id}`, P, { color: 'amber', size: 14, ...pointOptions(style),
      drag(q) { const next = {}; if (x) next[x] = q.x; if (y) next[y] = q.y; ctx.set(next); }
    });
  }
  const prefix = (spec, key) => `mf_${spec.id.replace(/-/g, '_')}__${key}`;
  function defaults(spec) {
    const v = { ...(spec.state || {}) };
    for (const [key, variable] of Object.entries(spec.vars || {})) v[key] = variable.value;
    return v;
  }
  function values(spec, state) {
    const v = defaults(spec);
    for (const key of Object.keys(v)) if (state[prefix(spec, key)] !== undefined) v[key] = state[prefix(spec, key)];
    return v;
  }
  function assign(spec, state, next, quantize = false) {
    for (let [key, value] of Object.entries(next)) {
      const variable = spec.vars && spec.vars[key];
      if (variable) {
        value = clamp(Number(value), variable.min, variable.max);
        if (quantize && variable.step) value = variable.min + Math.round((value - variable.min) / variable.step) * variable.step;
        value = +clamp(value, variable.min, variable.max).toFixed(10);
      }
      if (!(key in defaults(spec))) throw Error(`Unknown scene state ${spec.id}.${key}`);
      state[prefix(spec, key)] = value;
    }
  }
  function context(spec, state, lab, v, model) {
    const count = (call(spec.steps, v, model) || []).length;
    return { spec, state, lab, step: state.step || 0, solved: !!state.revealed || state.step >= (spec.finalStep || count),
      set(next) {
        assign(spec, state, next, true);
        state.step = 0; state.revealed = false;
        if (lab) { lab._tween = null; lab.invalidate(true); }
      }
    };
  }
  function sourceLabel(spec) {
    const s = spec.source || {};
    if (s.kind === 'supplement') return s.label || '개념 보충 장면';
    return s.label || 'Archive 기출 유형을 바탕으로 조건을 재구성한 장면';
  }
  function lessonFor(spec) {
    const v = defaults(spec), model = spec.model(v);
    const raw = call(spec.lesson, v, model);
    if (!raw) throw Error(`Missing one-click lesson: ${spec.id}`);
    const lesson = JSON.parse(JSON.stringify(raw));
    const map = object => Object.fromEntries(Object.entries(object || {}).map(([k, val]) => [prefix(spec, k), val]));
    const nums = Object.fromEntries(Object.entries(v).filter(([, val]) => typeof val === 'number'));
    const flags = Object.fromEntries(Object.entries(v).filter(([, val]) => typeof val !== 'number'));
    // Numeric modes also use set (an instantaneous change, never a tween through
    // an invalid coefficient). The native player requires every set key to be
    // reset explicitly in the first cue as well as numeric start values.
    for (const ch of lesson.chapters) for (const cue of ch.cues || []) {
      for (const key of Object.keys(cue.set || {})) {
        if (!(key in v)) throw Error(`Unknown lesson state ${spec.id}.${key}`);
        flags[key] = v[key];
      }
    }
    lesson.chapters.forEach((chapter, i) => {
      chapter.start = map(i === 0 ? { ...nums, ...(chapter.start || {}) } : chapter.start);
      chapter.cues = chapter.cues.map((cue, j) => ({ ...cue,
        ...(cue.to ? { to: map(cue.to) } : {}),
        ...(cue.set || (i === 0 && j === 0 && Object.keys(flags).length) ? { set: map(i === 0 && j === 0 ? { ...flags, ...(cue.set || {}) } : cue.set) } : {})
      }));
    });
    return lesson;
  }
  function sceneFor(spec) {
    const compute = state => { const v = values(spec, state); return { v, model: spec.model(v) }; };
    const from = (field, state, lab) => {
      const { v, model } = compute(state);
      return call(spec[field], v, model, context(spec, state, lab, v, model));
    };
    const sc = {
      id: spec.id, title: spec.title, short: spec.short || spec.title,
      boardKind: 'cartesian', aspect: spec.aspect || '1:1', startStep: 0,
      source: spec.source, _mf: spec,
      controls: Object.keys(spec.vars || {}).filter(key => !spec.vars[key].hidden).map(key => prefix(spec, key)),
      // Native exploration may opt into a tighter initial fit; proof builders
      // keep using the authored spec.focus unless they opt in separately.
      focus: state => from(spec.nativeFocus ? 'nativeFocus' : 'focus', state) || { x: [-6, 6], y: [-6, 6] },
      enter(state, lab) { assign(spec, state, defaults(spec)); if (lab) lab.board.fit(); },
      question: state => from('question', state),
      guide: state => from('guide', state),
      steps: state => from('steps', state),
      reviewTitles: { steps: '그림으로 따라가는 풀이', solution: '풀이와 원리 확인' },
      solution: { standardTitle: '그림과 식으로 확인', standardTag: tiers[spec.tier],
        standard: state => ({ steps: `<ol>${(from('steps', state) || []).map(s => `<li>${s}</li>`).join('')}</ol>`, note: sourceLabel(spec) }) },
      presets: (spec.presets || []).map(preset => ({ label: preset.label,
        apply(state, lab) { assign(spec, state, preset.values, true); state.step = 0; state.revealed = false; lab.board.fit(); } })),
      actions: [{ id: `reset-${spec.id}`, label: '처음 값으로', icon: 'reset', run(state, lab) {
        if (lab.video && lab.video.state !== 'idle') lab.video.close();
        assign(spec, state, defaults(spec)); state.step = 0; state.revealed = false; lab.board.fit();
      } }],
      draw(b, state, view, lab) {
        const { v, model } = compute(state), ctx = context(spec, state, lab, v, model);
        b.setFocus(call(spec.nativeFocus || spec.focus, v, model) || { x: [-6, 6], y: [-6, 6] }, false);
        b.grid(call(spec.grid, v, model) || {});
        axes(b, call(spec.axes, v, model) || {}, lab);
        spec.draw(b, v, model, ctx);
      },
      view(state, lab) {
        const { v, model } = compute(state), ctx = context(spec, state, lab, v, model);
        const notes = call(spec.notes, v, model, ctx);
        return {
          chips: call(spec.chips, v, model, ctx) || [],
          readouts: call(spec.readouts, v, model, ctx) || [],
          summary: ctx.solved ? call(spec.answer, v, model) : null,
          notes: ctx.solved && notes ? (Array.isArray(notes) ? notes.join('<br>') : notes) : null,
          guide: call(spec.guide, v, model, ctx),
          tip: spec.tip || '그래프를 확대하거나 옮겼다면 그림 맞춤을 누르세요. 처음 값으로는 문제의 수치를 되돌립니다.'
        };
      }
    };
    if (spec.tier !== 'concept' || spec.problem) sc.problem = {
      tag: sourceLabel(spec), autoSnap: false,
      text: state => from('question', state), answer: state => from('answer', state),
      note: sourceLabel(spec)
    };
    return sc;
  }
  function register(def) {
    if (!def || !def.id || labs[def.id]) throw Error(`Duplicate or missing middle function lab: ${def && def.id}`);
    const seen = new Set();
    for (const spec of def.scenes) {
      if (!spec.id || seen.has(spec.id) || !tiers[spec.tier]) throw Error(`Invalid scene in ${def.id}: ${spec.id}`);
      seen.add(spec.id);
      for (const key of ['model', 'draw', 'question', 'guide', 'steps', 'answer', 'lesson']) if (!spec[key]) throw Error(`${def.id}:${spec.id} missing ${key}`);
    }
    labs[def.id] = def;
  }
  function compile(id) {
    const spec = labs[id]; if (!spec) throw Error(`Unknown middle function lab: ${id}`);
    const params = {}, state = {}, lessons = {};
    for (const scene of spec.scenes) {
      for (const [key, variable] of Object.entries(scene.vars || {})) params[prefix(scene, key)] = { ...variable,
        onInput(s, lab) { s.step = 0; s.revealed = false; if (variable.onInput) variable.onInput(s, lab); } };
      for (const [key, value] of Object.entries(scene.state || {})) state[prefix(scene, key)] = value;
      lessons[scene.id] = lessonFor(scene);
    }
    return {
      id, title: spec.title, courseName: spec.courseName, unit: spec.unit,
      courseColor: 'var(--m-sky)', home: `../index.html#${spec.course}`,
      stackFractions: true, stagedReveal: true,
      board: { kind: 'cartesian', pad: 0.09, minZoom: 0.4, maxZoom: 6 },
      params, state, lessons,
      groups: Object.entries(tiers).map(([tier, title]) => ({ id: tier, title, short: title,
        scenes: spec.scenes.filter(scene => scene.tier === tier).map(sceneFor) })).filter(group => group.scenes.length)
    };
  }
  function mount(id) {
    const def = compile(id);
    window.APL_LESSONS = window.APL_LESSONS || {};
    window.APL_LESSONS[id] = def.lessons;
    window.APLab.createLab(def);
    const loading = document.getElementById('mf-loading'); if (loading) loading.remove();
  }
  window.APL_MF = { labs, tiers, register, compile, mount, defaults, values, prefix, lessonFor,
    n, f, frac, signed, clamp, p, box, line, curve, inverse, point, label, projection, axes, riseRun, polygon, drag, esc };
})();
