// Actual Board projection regression for the confirmed 360px p2-iso baseline P1.
// Two equal base-angle labels must be distinct and associated with their own arcs.
// A native Chromium screenshot review remains the independent readability gate.
// Negative control: node this-file.mjs --baseline <9bf-or-a9-commit>
// Scope comparison: node this-file.mjs --compare-scope <pre-repair-commit>
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const unit = 'apmath/playground/next/labs/g7-polygons';
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = value => JSON.parse(JSON.stringify(value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const close = (a, b, why) => assert.ok(Math.abs(a - b) < 1e-7, `${why}: ${a} != ${b}`);
const angle = (v, p, q) => {
  const a = { x: p.x - v.x, y: p.y - v.y }, b = { x: q.x - v.x, y: q.y - v.y };
  return Math.atan2(Math.abs(a.x * b.y - a.y * b.x), a.x * b.x + a.y * b.y) * 180 / Math.PI;
};
function load(baseline) {
  const context = vm.createContext({ window: {}, document: { documentElement: { dataset: {} }, getElementById() {},
    createElement() { return {}; }, head: { append() {} }, addEventListener() {} } });
  for (const name of ['core', 't1', 't2', 't3', 't4']) {
    const file = `${unit}/${name}.js`;
    const source = baseline && name === 't2' ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  context.window.APLab = { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const scenes = context.window.APL_PG_GROUPS.flatMap(group => group.scenes);
  return { context, scenes, G: context.window.APL_PG, scene: id => scenes.find(s => s.id === id),
    state(id, patch = {}) { const s = { step: 1, revealed: false }; this.scene(id).enter(s); return Object.assign(s, patch); } };
}
const rt = load(arg('--baseline'));
function draw(runtime, W, H, tab, s = runtime.state('p2-iso'), id = 'p2-iso', thumb = false) {
  const b = Object.create(runtime.context.window.APLab.Board.prototype);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { top: 0, bottom: thumb ? 0 : 58, left: 0, right: 0 },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb, panes: null, paneId: null, focus: { x: [-2, 2], y: [-2, 2] }, texts: [], paths: [], arcs: [], marks: [], leaders: [] });
  b.ctx = { font: '16px sans-serif', save() {}, restore() {}, measureText(value) { return { width: runtime.G.textW(value, Number(this.font.match(/([\d.]+)px/)[1])) }; } };
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), world: points, options }); return b; };
  b.arc = (p, r, from, to, options = {}) => { b.arcs.push({ p, at: b.toS(p), r: r * b.k, from, to, options }); return b; };
  b.text = (p, value, options = {}) => {
    const at = b.toS(p), m = b.annotationSize(value, options), w = m.width - 6, h = m.height - 6;
    const x = at.x + (options.dx || 0), y = at.y + (options.dy || 0);
    b.texts.push({ text: String(value), p, x, y, l: x - w / 2, r: x + w / 2, t: y - h / 2, b: y + h / 2, options }); return b;
  };
  const leader = b.leader;
  b.leader = (anchor, label, options) => { const result = leader.call(b, anchor, label, options); b.leaders.push({ anchor, label, result, options }); return result; };
  for (const name of ['point', 'right', 'ticks', 'handle', 'circle']) b[name] = (...args) => { b.marks.push({ name, args }); return b; };
  const sc = runtime.scene(id); sc.draw(b, s, {}, { s, tab, scene: sc }); return b;
}
const pair = (b, m) => [m.B, m.C].map(p => b.texts.find(t => t.text === `${m.bb}°` && distance(t.p, p) < 1e-7));
const boxGap = (a, b) => Math.hypot(Math.max(a.l - b.r, b.l - a.r, 0), Math.max(a.t - b.b, b.t - a.b, 0));
function checkPair(b, m, why) {
  const labels = pair(b, m); assert.ok(labels.every(Boolean), `${why}: both equal base-angle values remain visible`);
  assert.ok(boxGap(...labels) >= 12, `${why}: labels read as one string, gap=${boxGap(...labels)}`);
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i], vertex = i === 0 ? m.B : m.C;
    assert.ok(label.l >= 0 && label.r <= b.W && label.t >= 0 && label.b <= b.H - b.insets.bottom, `${why}: value stays on screen`);
    const callout = b.leaders.find(l => distance(l.label, label) < 1e-7);
    if (callout) {
      assert.equal(callout.result.drawn, true, `${why}: outside value has a visible leader`);
      close(distance(callout.result.anchor, callout.anchor), 0, `${why}: actual leader anchor is not double-projected`);
      close(distance(callout.result.label, label), 0, `${why}: actual leader target matches its text`);
      for (const point of [callout.result.anchor, callout.result.label, callout.result.end]) assert.ok(point.x >= 0 && point.x <= b.W && point.y >= 0 && point.y <= b.H - b.insets.bottom, `${why}: actual leader is on canvas`);
      close(distance(callout.anchor, b.toS(vertex)), 30, `${why}: leader begins on its own angle arc`);
      const other = i === 0 ? m.C : m.B;
      const bisector = { x: (m.A.x - vertex.x) / distance(m.A, vertex) + (other.x - vertex.x) / distance(other, vertex),
        y: (m.A.y - vertex.y) / distance(m.A, vertex) + (other.y - vertex.y) / distance(other, vertex) };
      const screenVertex = b.toS(vertex), ray = { x: callout.anchor.x - screenVertex.x, y: callout.anchor.y - screenVertex.y };
      close(ray.x / 30, bisector.x / Math.hypot(bisector.x, bisector.y), 'leader points to the actual angle bisector');
      close(ray.y / 30, bisector.y / Math.hypot(bisector.x, bisector.y), 'leader points to the actual angle bisector');
      for (const otherLabel of b.texts) if (otherLabel !== label) assert.ok(boxGap(label, otherLabel) >= 2, `${why}: callout covers ${otherLabel.text}`);
    }
  }
}
for (const [W, H] of [[360, 387], [390, 411]]) {
  test(`p2-iso ${W}px initial two70° values have independent readable locations`, t => {
    const s = rt.state('p2-iso'), m = rt.scene('p2-iso').pg.model(s), b = draw(rt, W, H, 'explore', s);
    checkPair(b, m, `${W} initial`); t.diagnostic(`gap ${boxGap(...pair(b, m)).toFixed(2)}px`);
  });
  test(`p2-iso ${W}px every valid base angle, extension and review stage keeps the two values distinct`, () => {
    for (let bb = 40; bb <= 70; bb += 2) for (const progress of [0, .35, .7, 1]) for (const step of [0, 1, 2, 3]) {
      const s = rt.state('p2-iso', { pgIb: bb, pgIt: progress, step });
      const m = rt.scene('p2-iso').pg.model(s);
      for (const tab of ['explore', 'review']) checkPair(draw(rt, W, H, tab, s), m, `${W}/${bb}/${progress}/${step}/${tab}`);
    }
  });
}
test('base angle geometry, extension, reset and answer disclosure remain mathematically unchanged', () => {
  const sc = rt.scene('p2-iso');
  for (let bb = 40; bb <= 70; bb += 2) {
    const s = rt.state('p2-iso', { pgIb: bb }), m = sc.pg.model(s), saved = plain(m), q = plain(sc.pg.prob(m));
    close(distance(m.A, m.B), distance(m.A, m.C), 'AB=AC'); close(distance(m.A, m.C), distance(m.C, m.D), 'AC=CD');
    close(angle(m.B, m.A, m.C), bb, 'angleB'); close(angle(m.C, m.A, m.B), bb, 'angleACB'); close(angle(m.D, m.A, m.C), bb / 2, 'angleD');
    assert.equal(q.choices.filter(c => c.ok).length, 1);
    for (const [W, H] of [[360, 291], [390, 309]]) {
      const problem = draw(rt, W, H, 'problem', s);
      assert.equal(problem.texts.filter(t => t.text === `${bb}°`).length, 1, 'problem still shows only its one given angle');
      assert.ok(problem.texts.some(t => t.text === 'x'));
      assert.ok(!problem.texts.some(t => t.options.color === 'amber' && t.text === `${bb / 2}°`), 'no answer before solution');
      for (const step of [1, 2, 3]) {
        s.step = step; const b = draw(rt, W, H + 96, 'review', s);
        assert.equal(b.texts.some(t => t.options.color === 'amber' && t.text === `${bb / 2}°`), step === 3, 'original final-step disclosure');
      }
    }
    assert.deepEqual(plain(sc.pg.model(s)), saved); assert.deepEqual(plain(sc.pg.prob(sc.pg.model(s))), q); assert.equal(s.revealed, false);
    sc.actions().find(a => a.id === 'reset').run(s); assert.equal(s.pgIt, 0); assert.equal(s.playing, false);
    sc.enter(s); assert.equal(s.pgIt, 1); assert.equal(s.pgIb, 70);
  }
});
if (arg('--compare-scope')) test('other scenes, wide views, problem inputs, contours and thumbnails stay identical', () => {
  const old = load(arg('--compare-scope'));
  const picture = b => plain({ texts: b.texts, paths: b.paths, arcs: b.arcs, marks: b.marks, leaders: b.leaders });
  for (const sc of rt.scenes) {
    const s = rt.state(sc.id), z = old.state(sc.id), os = old.scene(sc.id);
    assert.deepEqual(plain(sc.pg.model(s)), plain(os.pg.model(z)), `${sc.id} model`);
    assert.deepEqual(plain(sc.pg.prob(sc.pg.model(s))), plain(os.pg.prob(os.pg.model(z))), `${sc.id} problem`);
    assert.deepEqual(plain(sc.steps(s)), plain(os.steps(z)), `${sc.id} solution`);
    for (const [W, H] of [[1039, 698], [820, 461], [683, 528], [390, 411], [360, 387]]) for (const tab of ['explore', 'review', 'problem']) {
      const b = draw(rt, W, H, tab, s, sc.id), a = draw(old, W, H, tab, z, sc.id);
      if (sc.id !== 'p2-iso' || W >= 560 || tab === 'problem') assert.deepEqual(picture(b), picture(a), `${sc.id}/${W}/${tab} unchanged`);
      else {
        assert.deepEqual(plain(b.paths.filter(p => p.options.color !== 'muted')), plain(a.paths.filter(p => p.options.color !== 'muted')), 'original contours/shades retained');
        assert.deepEqual(plain(b.arcs), plain(a.arcs), 'all real angle arcs unchanged'); assert.deepEqual(plain(b.marks), plain(a.marks), 'all vertices and equal-side marks unchanged');
      }
    }
    assert.deepEqual(picture(draw(rt, 240, 180, 'explore', s, sc.id, true)), picture(draw(old, 240, 180, 'explore', z, sc.id, true)), `${sc.id} thumbnail`);
  }
});
