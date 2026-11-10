// Real Board coordinate contracts for sm1-corr's mobile corner-mark collision.
// Chromium screenshots and an independent visual review remain required.
// Negative control: node this-file.mjs --baseline <SHA>
// Preservation: node this-file.mjs --compare-scope <SHA>
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const lab = 'apmath/playground/next/labs/g8-similarity';
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = value => JSON.parse(JSON.stringify(value));
const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
const close = (a, b, why) => assert.ok(Math.abs(a - b) < 1e-7, `${why}: ${a} != ${b}`);

function load(baseline) {
  const context = vm.createContext({ window: {}, console, document: { documentElement: { dataset: {} }, getElementById: () => true, addEventListener() {} } });
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 'solutions']) {
    const file = `${lab}/${name}.js`;
    const source = baseline && name === 't1' ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  context.window.APLab = { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const scenes = context.window.APL_SM_GROUPS.flatMap(group => group.scenes);
  return { context, scenes, G: context.window.APL_SM, scene: id => scenes.find(scene => scene.id === id),
    state(id = 'sm1-corr') { const s = {}; this.scene(id).enter(s); return s; } };
}
const rt = load(arg('--baseline'));

function draw(runtime, s, W, H, tab = 'problem', bottom = 58, id = 'sm1-corr', thumb = false) {
  const b = Object.create(runtime.context.window.APLab.Board.prototype);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { left: 0, right: 0, top: 0, bottom },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb, panes: null, paneId: null, focus: { x: [-5, 5], y: [-4, 4] },
    paths: [], arcs: [], rights: [], marks: [], texts: [] });
  // Only the optional unchanged-scene comparison needs font measurements for
  // unrelated curved dimension lines. Corner-clearance checks use no font data.
  b.ctx = { font: '16px sans-serif', save() {}, restore() {},
    measureText(str) { return { width: runtime.G.textW(str, Number(this.font.match(/([\d.]+)px/)[1])) }; } };
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), options }); return b; };
  b.arc = (p, r, from, to, options = {}) => { b.arcs.push({ p, at: b.toS(p), r: r * b.k, from, to, options }); return b; };
  b.right = (p, q, z, options = {}) => { b.rights.push({ p, at: b.toS(p), q, z, options }); return b; };
  b.text = (p, text, options = {}) => { b.texts.push({ p, at: b.toS(p), text: String(text), options }); return b; };
  for (const name of ['point', 'ticks', 'handle', 'leader', 'circle']) b[name] = (...args) => { b.marks.push({ name, args }); return b; };
  const scene = runtime.scene(id); scene.draw(b, s, {}, { tab, s, scene });
  return b;
}

function verifyCorners(b, m, n, why) {
  const polys = [rt.G.geo.trap(m, 0), rt.G.geo.trap(n, 6 * m + 1.5 * Math.max(m, n) + 1.5)];
  const clearances = [];
  for (const pts of polys) {
    const [A, B, C, D] = pts;
    const at = p => b.toS(p), arcs = p => b.arcs.filter(a => a.options.color === 'rose' && dist(a.at, at(p)) < 1e-6);
    const right = p => b.rights.find(a => dist(a.at, at(p)) < 1e-6);
    const ca = arcs(C), ba = arcs(B), da = right(D), aa = right(A);
    assert.equal(ca.length, 2, `${why}: C/G keeps exactly two corresponding-angle arcs`);
    assert.equal(ba.length, 1, `${why}: B/F keeps exactly one corresponding-angle arc`);
    assert.ok(da && aa, `${why}: both right-angle squares remain visible`);
    const radii = ca.map(a => a.r).sort((a, b) => a - b), short = dist(at(C), at(D));
    const clearance = short - radii[1] - da.options.size;
    assert.ok(clearance >= 3, `${why}: C arc and D square need separate corners; gap=${clearance.toFixed(3)}px`);
    assert.ok(radii[0] > 2 && radii[1] - radii[0] > 2, `${why}: both concentric arcs remain distinct, positive radii`);
    for (const arc of ca) close(Math.abs(arc.to - arc.from) * 180 / Math.PI, rt.G.angBetween(C, B, D), 'actual obtuse angle');
    close(Math.abs(ba[0].to - ba[0].from) * 180 / Math.PI, rt.G.angBetween(B, A, C), 'actual acute angle');
    close(rt.G.angBetween(A, B, D), 90, 'right angle A'); close(rt.G.angBetween(D, A, C), 90, 'right angle D');
    clearances.push(clearance);
  }
  for (const p of b.paths.flatMap(item => item.points)) assert.ok(p.x >= 0 && p.x <= b.W && p.y >= 0 && p.y <= b.H - b.insets.bottom, `${why}: original contour stays in the usable stage`);
  return clearances;
}

for (const [W, H, inquiryH] of [[390, 309, 412], [360, 291, 388]]) {
  test(`sm1-corr ${W}px initial correspondence marks do not cover the adjacent corner`, t => {
    for (const bottom of [58, 60]) for (const tab of ['explore', 'problem', 'review']) {
      const s = rt.state(), b = draw(rt, s, W, tab === 'explore' ? inquiryH : H, tab, bottom);
      const { m, n } = tab === 'explore' ? { m: s.smM, n: s.smN } : s.smPk;
      const gaps = verifyCorners(b, m, n, `${W}/${bottom}/${tab}`);
      t.diagnostic(`${W}/${bottom}/${tab}: CD/HG corner clearances ${gaps.map(x => x.toFixed(2)).join('/')}px`);
      for (const name of 'ABCDEFGH') assert.ok(b.texts.some(t => t.text === name), `vertex ${name} retained`);
      assert.equal(s.revealed, false); assert.equal(s.playing, false);
    }
  });
}

test('all legal sizes and question branches keep separate angle marks without changing math or answer stages', () => {
  const sc = rt.scene('sm1-corr');
  for (const m of [1, 2, 3, 4]) for (const n of [1, 2, 3, 4]) for (const kind of [0, 1, 2]) {
    const s = rt.state(); Object.assign(s, { smM: m, smN: n, smPk: { seed: 1, m, n, kind, given: 0, ask: 2 } });
    const before = plain(s), question = sc.problem.text(s), M = sc.sm.model(s), sol = sc.sm.solution(s);
    close(sol.answer, (kind === 2 ? 16 : 2) * n, 'independent perimeter/corresponding-side calculation');
    for (const side of M.sides) close(side.b / side.a, n / m, 'all corresponding side ratios');
    for (const [W, H] of [[390, 309], [360, 291]]) for (const tab of ['explore', 'problem', 'review']) {
      s.step = 1; const b = draw(rt, s, W, H, tab); verifyCorners(b, m, n, `${m}:${n}/${kind}/${W}/${tab}`);
      if (kind !== 2 && tab !== 'explore') assert.ok(b.texts.some(t => t.text === 'x'), 'the asked length remains unknown initially');
      if (tab === 'review') {
        s.step = sol.steps.length; const final = draw(rt, s, W, H, tab); verifyCorners(final, m, n, 'final review');
        if (kind !== 2) assert.ok(final.texts.some(t => t.text === String(2 * n)), 'the target appears at the existing final step');
      }
      assert.equal(sc.problem.text(s), question); assert.deepEqual(plain(sc.sm.model(s)), plain(M));
      assert.equal(s.revealed, false);
    }
    s.step = before.step; assert.deepEqual(plain(s), before, 'drawing changes no parameters or answer state');
  }
  const dirty = rt.state(); Object.assign(dirty, { smM: 4, smN: 1, step: 4, playing: true, revealed: true }); sc.enter(dirty);
  assert.deepEqual(plain(dirty), plain(rt.state()), 'reentry restores the original diagram and locked answer');
});

if (arg('--compare-scope')) test('all original contours, labels, questions, wide pictures and other scenes are unchanged', () => {
  const previous = load(arg('--compare-scope'));
  const picture = b => plain({ paths: b.paths, arcs: b.arcs, rights: b.rights, marks: b.marks, texts: b.texts });
  for (const sc of rt.scenes) {
    const s = rt.state(sc.id), old = previous.state(sc.id);
    assert.deepEqual(plain(sc.sm.model(s)), plain(previous.scene(sc.id).sm.model(old)), `${sc.id} model`);
    assert.equal(sc.problem?.text(s), previous.scene(sc.id).problem?.text(old), `${sc.id} question`);
    assert.deepEqual(plain(sc.steps(s)), plain(previous.scene(sc.id).steps(old)), `${sc.id} solution`);
    for (const [W, H] of [[1039, 672], [820, 461], [683, 548], [390, 309], [360, 291]]) for (const tab of ['explore', 'problem', 'review']) {
      const a = draw(rt, s, W, H, tab, 58, sc.id), z = draw(previous, old, W, H, tab, 58, sc.id);
      if (sc.id === 'sm1-corr' && W < 560) {
        assert.deepEqual(plain(a.paths), plain(z.paths), 'mobile original contours and shaded regions unchanged');
        assert.deepEqual(plain(a.texts), plain(z.texts), 'mobile given values, point names and unknown labels unchanged');
        assert.deepEqual(plain(a.marks), plain(z.marks), 'mobile point locations unchanged');
      } else assert.deepEqual(picture(a), picture(z), `${sc.id}/${W}/${tab}`);
    }
    assert.deepEqual(picture(draw(rt, s, 240, 180, 'explore', 0, sc.id, true)), picture(draw(previous, old, 240, 180, 'explore', 0, sc.id, true)), `${sc.id} thumbnail unchanged`);
  }
});
