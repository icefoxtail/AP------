// Mathematical domains, source attribution and native playback contracts.
// Browser visibility is checked separately by middle-functions-browser.mjs.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const NEXT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = vm.createContext({ window: {}, console });
for (const file of ['core', 'g7', 'g8', 'g9']) {
  vm.runInContext(fs.readFileSync(path.join(NEXT, 'labs/middle-functions', file + '.js'), 'utf8'), ctx, { filename: file + '.js' });
}
const M = ctx.window.APL_MF;
const V = createRequire(import.meta.url)('../kit/apl-video-core.js');
const katex = createRequire(import.meta.url)('../kit/vendor/katex/katex.min.js');
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
}
function board(focus) {
  const points = [], paths = [], primitives = [];
  const b = { focus, k: 30, W: 390, H: 420, fs: 1, thumb: false,
    setFocus(f) { this.focus = f; }, grid() {}, axes() {},
    viewBox() { return { x0: this.focus.x[0], x1: this.focus.x[1], y0: this.focus.y[0], y1: this.focus.y[1] }; },
    point(p) { finite(p, 'draw.point'); points.push(p); primitives.push('point'); return this; },
    handle(id, p) { finite(p, `draw.handle.${id}`); points.push(p); primitives.push('handle'); return this; },
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
    }
  });
  test(`${tag}: native one-click chapters, restart state and numerical ranges`, () => {
    const lesson = M.lessonFor(spec), validation = V.validateLesson(lesson);
    assert.deepEqual(validation.errors, [], `${tag}: ${validation.errors.join('; ')}`);
    assert.deepEqual(validation.warnings, [], `${tag}: ${validation.warnings.join('; ')}`);
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
