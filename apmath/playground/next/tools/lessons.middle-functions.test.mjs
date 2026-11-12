// Mathematical domains, source attribution and native playback contracts.
// Browser visibility is checked separately by middle-functions-browser.mjs.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { labelsOutsideCanvas, toolbarOcclusions } from './middle-initial-figure-audit.mjs';

const NEXT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = vm.createContext({ window: {}, console });
for (const file of ['core', 'g7', 'g8', 'g9']) {
  vm.runInContext(fs.readFileSync(path.join(NEXT, 'labs/middle-functions', file + '.js'), 'utf8'), ctx, { filename: file + '.js' });
}
const M = ctx.window.APL_MF;
ctx.window.APLab = { clamp: (value, min, max) => Math.max(min, Math.min(max, value)) };
vm.runInContext(fs.readFileSync(path.join(NEXT, 'kit/apl-board.js'), 'utf8'), ctx, { filename: 'apl-board.js' });
const nativePointLabel = ctx.window.APLab.Board.prototype._pointLabel;
const nativeAxes = ctx.window.APLab.Board.prototype.axes;
const V = createRequire(import.meta.url)('../kit/apl-video-core.js');
const katex = createRequire(import.meta.url)('../kit/vendor/katex/katex.min.js');
const mathContext = vm.createContext({ window: { katex }, URLSearchParams, location: { search: '' },
  document: { documentElement: { setAttribute() {} } } });
vm.runInContext(fs.readFileSync(path.join(NEXT, 'kit/apl-core.js'), 'utf8'), mathContext, { filename: 'apl-core.js' });
const defs = Object.values(M.labs);
const plain = value => JSON.parse(JSON.stringify(value));

function cases(spec) {
  const base = M.defaults(spec), out = [base];
  for (const [key, variable] of Object.entries(spec.vars || {})) {
    out.push({ ...base, [key]: variable.min }, { ...base, [key]: variable.max });
  }
  for (const preset of spec.presets || []) out.push({ ...base, ...preset.values });
  let seed = 1777;
  for (let i = 0; i < 40; i++) {
    const values = { ...base };
    for (const [key, variable] of Object.entries(spec.vars || {})) {
      seed = (seed * 16807) % 2147483647;
      const step = variable.step || .01, count = Math.round((variable.max - variable.min) / step);
      values[key] = +(variable.min + (seed % (count + 1)) * step).toFixed(9);
    }
    out.push(values);
  }
  return out;
}
function finite(object, label) {
  if (typeof object === 'number') assert.ok(Number.isFinite(object), `${label}: non-finite number`);
  else if (object && typeof object === 'object') for (const [key, value] of Object.entries(object)) finite(value, `${label}.${key}`);
}
function validMath(text, label) {
  for (const match of String(text).matchAll(/\$([^$]+)\$/g)) {
    assert.doesNotThrow(() => katex.renderToString(match[1], { throwOnError: true, strict: 'ignore' }), `${label}: ${match[1]}`);
  }
  // The real HTML-aware shell treats a literal < as a tag boundary; valid
  // standalone KaTeX is insufficient when that leaves raw $ delimiters visible.
  assert.ok(!mathContext.window.APLab.renderMath(text).includes('$'), `${label}: native shell left an unrendered math delimiter in ${text}`);
}
function board(focus) {
  const points = [], paths = [], primitives = [];
  const b = { focus, k: 30, W: 390, H: 420, fs: 1, thumb: false,
    setFocus(f) { this.focus = f; }, grid() {}, axes() {},
    viewBox() { return { x0: this.focus.x[0], x1: this.focus.x[1], y0: this.focus.y[0], y1: this.focus.y[1] }; },
    point(p, opts = {}) { finite(p, 'draw.point'); points.push(p); primitives.push('point'); this.pointLabel(p, opts); return this; },
    handle(id, p, opts = {}) { finite(p, `draw.handle.${id}`); points.push(p); primitives.push('handle'); this.pointLabel(p, opts); return this; },
    pointLabel(p, opts) {
      if (opts.label) nativePointLabel.call({ _bbox: true, _P: p => p, toS: p => this.toS(p),
        _text(x, y) { finite({ x, y }, `native point label ${opts.label}`); }
      }, this.toS(p), opts);
    },
    line(p, slope) { finite(p, 'line origin'); if (typeof slope === 'number') finite(slope, 'slope'); primitives.push('line'); return this; },
    seg(p, q) { finite([p, q], 'segment'); if (p.x !== q.x || p.y !== q.y) primitives.push('segment'); return this; },
    path(p) { finite(p, 'path'); paths.push(p); if (p.length >= 2) primitives.push('path'); return this; },
    poly(p) { finite(p, 'polygon'); paths.push(p); if (p.length >= 3) primitives.push('polygon'); return this; },
    plot(fn, opts = {}) {
      assert.equal(typeof fn, 'function');
      const from = Math.max(this.focus.x[0], opts.from ?? -Infinity), to = Math.min(this.focus.x[1], opts.to ?? Infinity);
      let samples = 0;
      if (from < to) for (let i = 0; i < 10; i++) {
        const y = fn(from + (to - from) * (i + .5) / 10);
        assert.equal(typeof y, 'number'); if (Number.isFinite(y)) samples++;
      }
      if (samples >= 2) primitives.push('curve');
      return this;
    },
    text() { return this; }, stext() { return this; }, math() { return this; },
    vline() { primitives.push('line'); return this; }, hline() { primitives.push('line'); return this; }, circle() { primitives.push('circle'); return this; },
    right() { return this; }, ticks() { return this; }, arc() { return this; }, arrow() { return this; },
    color(c) { return c; },
    toS(p, y) { if (typeof p === 'number') p = { x: p, y }; return { x: 195 + p.x * 20, y: 210 - p.y * 20 }; },
    toW(x, y) { return { x: (x - 195) / 20, y: (210 - y) / 20 }; }
  };
  return { b, points, paths, primitives };
}

test('four connected native labs retain all three learning tiers', () => {
  assert.deepEqual(defs.map(d => d.id).sort(), ['g7-coordinate-graphs', 'g7-proportion', 'g8-linear-functions', 'g9-quadratic-functions']);
  for (const def of defs) {
    const compiled = M.compile(def.id);
    assert.deepEqual(Array.from(compiled.groups, g => g.id), ['concept', 'basic', 'advanced']);
    assert.equal(Object.keys(compiled.lessons).length, def.scenes.length);
    assert.equal(compiled.stagedReveal, true);
  }
});

test('common fractions, focus bounds and reciprocal branch separation', () => {
  assert.equal(M.frac(6, -8), '-\\frac{3}{4}');
  assert.equal(M.f(2 / 3), '\\frac{2}{3}');
  assert.equal(M.n(-0.00001), '0');
  const focus = M.box([{ x: -10, y: 3 }, { x: 6, y: -9 }]);
  assert.ok(focus.x[0] < -10 && focus.x[1] > 6 && focus.y[0] < -9 && focus.y[1] > 3);
  const plots = [];
  M.inverse({ k: 20, plot(fn, options) { plots.push({ fn, options }); } }, -12);
  assert.equal(plots.length, 2);
  assert.ok(plots[0].options.to < 0 && plots[1].options.from > 0);
  assert.equal(plots[0].fn(-3), 4);
  assert.equal(plots[1].fn(3), -4);
});

test('partial point-label offsets remain finite in the unchanged native Board', () => {
  const rendered = [];
  const native = { _bbox: true, _P: p => p, toS: p => p,
    _text(x, y, label) { finite({ x, y }, label); rendered.push({ x, y }); } };
  const b = { point(p, opts) { nativePointLabel.call(native, p, opts); } };
  M.point(b, { x: 100, y: 100 }, 'A', { dx: -20 });
  M.point(b, { x: 100, y: 100 }, 'B', { dy: 20 });
  M.point(b, { x: 100, y: 100 }, 'C', { dx: 0, dy: 0 });
  M.point(b, { x: 100, y: 100 }, 'D', { toward: { x: 82, y: 100 } });
  assert.deepEqual(rendered, [{ x: 80, y: 90 }, { x: 110, y: 120 }, { x: 100, y: 100 }, { x: 118, y: 100 }]);
});

// Exercise the real native axes with known glyph/font metrics; this fixture has
// no DOM globals and records both text and untouched axis/tick drawing commands.
function axisBoard({ dpr = 1, origin = { x: 160, y: 120 }, cssScale = 1 } = {}) {
  const texts = [], geometry = [], stack = [], W = 320, H = 240;
  const canvasRect = { left: 100, top: 50, width: W * cssScale, height: H * cssScale };
  const c = { font: '13px sans-serif', textAlign: 'left', textBaseline: 'alphabetic', direction: 'ltr',
    save() { stack.push({ font: this.font, textAlign: this.textAlign, textBaseline: this.textBaseline }); },
    restore() { Object.assign(this, stack.pop()); },
    getTransform() { return { a: dpr, b: 0, c: 0, d: dpr, e: 0, f: 0 }; },
    measureText(value) {
      const size = +this.font.match(/([\d.]+)px/)[1];
      const width = [...String(value)].reduce((sum, ch) => sum + (ch.charCodeAt(0) > 255 ? .9 : .6) * size, 0);
      const left = this.textAlign === 'right' ? -width : this.textAlign === 'center' ? -width / 2 : 0;
      const top = ({ top: .1, middle: -.4, bottom: -.9 })[this.textBaseline] ?? -.8;
      const fontTop = ({ top: -.15, middle: -.65, bottom: -1.15 })[this.textBaseline] ?? -.95;
      return { width, actualBoundingBoxLeft: -left + (this.font.includes('italic') ? 1 : 0), actualBoundingBoxRight: left + width,
        actualBoundingBoxAscent: -top * size, actualBoundingBoxDescent: (top + .8) * size,
        fontBoundingBoxAscent: -fontTop * size, fontBoundingBoxDescent: (fontTop + 1.3) * size };
    },
    fillText(value, x, y) {
      const m = this.measureText(value);
      texts.push({ text: String(value), x, y, arguments: arguments.length,
        left: x - m.actualBoundingBoxLeft, right: x + m.actualBoundingBoxRight,
        top: y - m.actualBoundingBoxAscent, bottom: y + m.actualBoundingBoxDescent,
        fontBox: { left: x - m.actualBoundingBoxLeft, right: x + m.actualBoundingBoxRight,
          top: y - m.fontBoundingBoxAscent, bottom: y + m.fontBoundingBoxDescent } });
    }
  };
  for (const method of ['beginPath', 'rect', 'clip', 'setLineDash', 'moveTo', 'lineTo', 'stroke', 'translate', 'rotate', 'closePath', 'fill', 'fillRect']) c[method] = (...args) => geometry.push([method, ...args]);
  const b = { ctx: c, W, H, k: 20, ky: 20, fs: 1, lw: 1, font: 'sans-serif', kind: 'cartesian', colors: {},
    canvas: { width: W * dpr, height: H * dpr, getBoundingClientRect: () => canvasRect },
    _drawRect: () => ({ x: 0, y: 0, w: W, h: H }), axes: nativeAxes,
    toS: (x, y) => ({ x: origin.x + 20 * x, y: origin.y - 20 * y }),
    viewBox: () => ({ x0: -origin.x / 20, x1: (W - origin.x) / 20, y0: (origin.y - H) / 20, y1: origin.y / 20 }) };
  const element = (r, visible = true) => ({ hidden: !visible, checkVisibility: () => visible,
    getBoundingClientRect: () => ({ left: canvasRect.left + r.left * cssScale, right: canvasRect.left + r.right * cssScale,
      top: canvasRect.top + r.top * cssScale, bottom: canvasRect.top + r.bottom * cssScale,
      width: (r.right - r.left) * cssScale, height: (r.bottom - r.top) * cssScale }) });
  return { b, texts, geometry, element, canvas: { cssWidth: W, cssHeight: H } };
}
const numericAxisText = row => /^[−-]?\d+(?:\.\d+)?$/.test(row.text);
function checkBoundedAxes(actual, original, options, obstacles = []) {
  assert.deepEqual(actual.geometry, original.geometry, 'native lines, arrows and every tick stay unchanged');
  assert.equal(labelsOutsideCanvas(actual.texts, actual.canvas).length, 0, 'unchanged actual-glyph audit boundary');
  assert.equal(labelsOutsideCanvas(actual.texts.map(t => t.fontBox), actual.canvas).length, 0, 'conservative font-box boundary');
  const ticks = actual.texts.filter(numericAxisText);
  assert.ok(ticks.length >= 6, 'readable numbered ticks remain');
  for (const tick of ticks) assert.ok(original.texts.some(r => r.text === tick.text && r.x === tick.x && r.y === tick.y), `tick ${tick.text} retains its exact coordinate`);
  for (const label of [options.xLabel || 'x', options.yLabel || 'y']) {
    assert.equal(actual.texts.filter(t => t.text === label).length, 1, `complete axis name and unit ${label}`);
    assert.equal(actual.texts.find(t => t.text === label).arguments, 3, 'do not pass undefined maxWidth to Canvas');
  }
  for (const obstacle of obstacles) {
    assert.equal(toolbarOcclusions(actual.texts, obstacle).length, 0, 'visible tool/TOC/status does not cover a glyph');
    assert.equal(toolbarOcclusions(actual.texts.map(t => t.fontBox), obstacle).length, 0, 'font box also avoids the overlay');
  }
}

test('new adapter bounds real native axis text at DPR1/DPR2 without changing tick positions', () => {
  const options = { tickStep: 2, xLabel: '시간(초)', yLabel: '거리(m)' };
  for (const dpr of [1, 2]) {
    const raw = axisBoard({ dpr }), bounded = axisBoard({ dpr });
    raw.b.axes(options); const original = bounded.b.ctx.fillText;
    assert.ok(labelsOutsideCanvas(raw.texts, raw.canvas).length > 0, 'fixture reproduces partial edge ticks');
    M.axes(bounded.b, options);
    assert.equal(bounded.b.ctx.fillText, original);
    checkBoundedAxes(bounded, raw, options);
    assert.ok(bounded.texts.filter(numericAxisText).length < raw.texts.filter(numericAxisText).length);
  }
});

test('new adapter avoids actual visible overlays with canvas offsets/scaling and preserves axis units', () => {
  const options = { tickStep: 2, xLabel: '시간(분)', yLabel: '정사각형 개수' };
  const raw = axisBoard({ dpr: 2, cssScale: 2 }), bounded = axisBoard({ dpr: 2, cssScale: 2 });
  const toolbar = { left: 100, right: 320, top: 195, bottom: 240 }, toc = { left: 280, right: 320, top: 75, bottom: 135 }, status = { left: 166, right: 270, top: 0, bottom: 40 };
  const lab = { ui: { tools: bounded.element(toolbar), status: bounded.element(status) }, toc: { ui: { handle: bounded.element(toc) } } };
  raw.b.axes(options); M.axes(bounded.b, options, lab);
  checkBoundedAxes(bounded, raw, options, [toolbar, toc, status]);
  for (const name of [options.xLabel, options.yLabel]) {
    const before = raw.texts.find(t => t.text === name), after = bounded.texts.find(t => t.text === name);
    assert.ok(before.x !== after.x || before.y !== after.y, `${name} moves away from its actual occluder`);
  }
  const hidden = axisBoard(), absent = axisBoard();
  M.axes(absent.b, options);
  M.axes(hidden.b, options, { ui: { tools: hidden.element({ left: 0, right: 320, top: 0, bottom: 240 }, false) } });
  assert.deepEqual(hidden.texts, absent.texts, 'hidden UI never reserves canvas space');
});

test('panning cannot create a fake origin and the fillText guard is local even after errors', () => {
  const options = { tickStep: 2, xLabel: 't(초)', yLabel: 'h(m)' };
  const raw = axisBoard({ origin: { x: -100, y: 400 } }), bounded = axisBoard({ origin: { x: -100, y: 400 } });
  raw.b.axes(options); M.axes(bounded.b, options);
  checkBoundedAxes(bounded, raw, options);
  assert.equal(bounded.texts.filter(t => t.text === 'O').length, 0, 'true origin is outside the canvas');
  const original = bounded.b.ctx.fillText;
  bounded.b.axes = () => { throw Error('native drawing failed'); };
  assert.throws(() => M.axes(bounded.b), /native drawing failed/);
  assert.equal(bounded.b.ctx.fillText, original, 'finally restores the existing instrumentation/native method');
  bounded.b.ctx.fillText('P', -20, -20);
  assert.equal(bounded.texts.at(-1).text, 'P', 'subsequent scene labels are never filtered by the axis helper');
  assert.doesNotThrow(() => M.axes({ axes() {} }), 'the existing mathematical VM board needs no DOM/canvas');
});

test('three-line playback shows both parallel cases and ends at the common point', () => {
  const spec = M.labs['g8-linear-functions'].scenes.find(s => s.id === 'triangle-degeneracy');
  const lesson = V.compileLesson(M.lessonFor(spec)), initial = M.defaults(spec), seed = {};
  for (const [key, value] of Object.entries(initial)) seed[M.prefix(spec, key)] = value;
  const base = { nums: { ...seed }, sets: { ...seed }, step: 0, part: null };
  for (const [time, slope] of [[3, 2], [10, -.5], [20, -1 - initial.b], [lesson.length, -1 - initial.b]]) {
    const frame = V.stateAt(lesson, time, base);
    const values = M.values(spec, { ...seed, ...frame.nums, ...frame.sets }), model = spec.model(values);
    assert.equal(values.trial, slope);
    const { b, points, primitives } = board(spec.focus(values, model));
    spec.draw(b, values, model, { step: frame.step, solved: frame.step === 4 });
    assert.ok(!primitives.includes('polygon'), 'a degeneracy cue must not show a filled triangle');
    if (slope === 2) assert.equal(model.Q, null, 'the first pair is parallel');
    else if (slope === -.5) assert.equal(model.R, null, 'the second pair is parallel');
    else {
      for (const q of [model.P, model.Q, model.R]) { assert.equal(q.x, 1); assert.equal(q.y, -1); }
      assert.equal(points.length, 1, 'one common point, without overlapping P/Q/R labels');
    }
  }
});

test('quadratic moving-area playback ends at the first target-area configuration', () => {
  const spec = M.labs['g9-quadratic-functions'].scenes.find(s => s.id === 'moving-area');
  const lesson = V.compileLesson(M.lessonFor(spec)), initial = M.defaults(spec), seed = {};
  for (const [key, value] of Object.entries(initial)) seed[M.prefix(spec, key)] = value;
  const end = V.stateAt(lesson, lesson.length, { nums: seed, sets: seed, step: 0, part: null });
  const values = M.values(spec, { ...seed, ...end.nums, ...end.sets });
  const model = spec.model(values);
  assert.equal(end.step, 4);
  assert.ok(Math.abs(values.time - model.early) < 1e-9);
  assert.ok(Math.abs(model.area - values.target) < 1e-9);
  assert.ok(Math.abs(model.P.y * model.Q.x / 2 - values.target) < 1e-9);
});

for (const def of defs) for (const spec of def.scenes) {
  const tag = `${def.id}:${spec.id}`;
  test(`${tag}: source, current values, mathematical domains and initial geometry`, () => {
    const source = spec.source;
    assert.ok(['archive-adapted', 'supplement'].includes(source?.kind), `${tag}: explicit source kind`);
    if (source.kind === 'archive-adapted') {
      assert.ok(source.types?.length && source.refs?.length, `${tag}: source types and exact references`);
      for (const ref of source.refs) assert.match(ref, /\.js#q.+@\d+$/, `${tag}: source identity`);
    } else assert.ok(source.reason, `${tag}: why the supplement is needed`);
    const scene = M.compile(def.id).groups.flatMap(g => g.scenes).find(s => s.id === spec.id);
    for (const values of cases(spec)) {
      const model = spec.model(values); finite(model, tag);
      const focus = typeof spec.focus === 'function' ? spec.focus(values, model) : spec.focus;
      assert.ok(focus?.x?.length === 2 && focus?.y?.length === 2, `${tag}: explicit graph bounds`);
      finite(focus, tag);
      assert.ok(focus.x[0] < focus.x[1] && focus.y[0] < focus.y[1]);
      const steps = typeof spec.steps === 'function' ? spec.steps(values, model) : spec.steps;
      assert.ok(steps.length >= 3 && steps.every(s => typeof s === 'string' && s.trim()), `${tag}: meaningful steps`);
      for (const step of steps) validMath(step, tag);
      assert.equal(spec.finalStep || steps.length, steps.length, `${tag}: final reveal agrees with native shell`);
      if (spec.verify) assert.deepEqual(Array.from(spec.verify(values, model)), [], `${tag}: ${JSON.stringify(values)}`);
      const state = { step: 0, revealed: false };
      for (const [key, value] of Object.entries(values)) state[M.prefix(spec, key)] = value;
      assert.ok(scene.question(state)?.trim(), `${tag}: current question`);
      validMath(scene.question(state), tag);
      const view = scene.view(state);
      assert.equal(view.summary, null, `${tag}: final answer is concealed on entry`);
      const { b, points, primitives } = board(focus);
      scene.draw(b, state, view);
      assert.ok(primitives.length > 0, `${tag}: no initial mathematical object beyond the grid and axes`);
      for (const point of points) assert.ok(point.x >= focus.x[0] - 1e-7 && point.x <= focus.x[1] + 1e-7 && point.y >= focus.y[0] - 1e-7 && point.y <= focus.y[1] + 1e-7,
        `${tag}: primary point outside focus ${JSON.stringify({ point, focus, values })}`);
      state.step = steps.length;
      const finalView = scene.view(state);
      assert.ok(typeof finalView.summary === 'string' && finalView.summary.trim(), `${tag}: final answer available`);
      validMath(finalView.summary, tag);
      scene.draw(b, state, finalView);
      for (let step = 1; step < steps.length; step++) {
        state.step = step;
        scene.draw(b, state, scene.view(state));
      }
      for (const point of points) assert.ok(point.x >= focus.x[0] - 1e-7 && point.x <= focus.x[1] + 1e-7 && point.y >= focus.y[0] - 1e-7 && point.y <= focus.y[1] + 1e-7,
        `${tag}: revealed point outside focus ${JSON.stringify({ point, focus, values })}`);
    }
  });
  test(`${tag}: native one-click chapters, restart state and numerical ranges`, () => {
    const lesson = M.lessonFor(spec), validation = V.validateLesson(lesson);
    assert.deepEqual(validation.errors, [], `${tag}: ${validation.errors.join('; ')}`);
    assert.deepEqual(validation.warnings, [], `${tag}: ${validation.warnings.join('; ')}`);
    for (const chapter of lesson.chapters) for (const cue of chapter.cues) if (cue.say) validMath(cue.say, `${tag}: caption`);
    const compiled = V.compileLesson(lesson), initial = M.defaults(spec), seed = {};
    for (const [key, value] of Object.entries(initial)) seed[M.prefix(spec, key)] = value;
    const playbackBase = { nums: { ...seed }, sets: { ...seed }, step: 0, part: null };
    for (let i = 0; i <= 100; i++) {
      const frame = V.stateAt(compiled, compiled.length * i / 100, playbackBase);
      const state = { ...seed, ...frame.nums, ...frame.sets };
      for (const [key, variable] of Object.entries(spec.vars || {})) {
        const value = state[M.prefix(spec, key)];
        assert.ok(Number.isFinite(value) && value >= variable.min - 1e-8 && value <= variable.max + 1e-8, `${tag}: lesson parameter ${key} outside range`);
      }
      const values = M.values(spec, state), model = spec.model(values);
      finite(model, `${tag}: playback ${i}%`);
      if (spec.verify) assert.deepEqual(Array.from(spec.verify(values, model)), [], `${tag}: playback invariants ${i}%`);
    }
    const end = V.stateAt(compiled, compiled.length, playbackBase);
    const replay = V.stateAt(compiled, 0, { nums: { ...seed, ...end.nums }, sets: { ...seed, ...end.sets }, step: end.step, part: end.part });
    const first = V.stateAt(compiled, 0, playbackBase);
    assert.deepEqual(plain(replay), plain(first), `${tag}: deterministic replay from the end state`);
  });
}
