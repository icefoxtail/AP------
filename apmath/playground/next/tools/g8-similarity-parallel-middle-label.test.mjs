// Actual Board projection/leader contracts for sm3-multi's FG unknown.
// Native Chromium screenshots remain the independent student-readability gate.
// Negative: node this-file.mjs --baseline c45901b8e4d375b7aa73ff291f9cd2af1908f1b1
// Preservation: node this-file.mjs --compare-scope <pre-repair-commit>
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const lab = 'apmath/playground/next/labs/g8-similarity';
const arg = key => { const i = process.argv.indexOf(key); return i < 0 ? null : process.argv[i + 1]; };
const plain = v => JSON.parse(JSON.stringify(v));
const distance = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
const close = (a, b, why) => assert.ok(Math.abs(a - b) < 1e-7, `${why}: ${a} != ${b}`);
function load(baseline) {
  const context = vm.createContext({ window: {}, console, document: { documentElement: { dataset: {} }, getElementById: () => true, addEventListener() {} } });
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 'solutions']) {
    const file = `${lab}/${name}.js`, source = baseline && name === 't3'
      ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  context.window.APLab = { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const scenes = context.window.APL_SM_GROUPS.flatMap(group => group.scenes);
  return { context, scenes, G: context.window.APL_SM, scene: id => scenes.find(s => s.id === id),
    state(id = 'sm3-multi') { const s = {}; this.scene(id).enter(s); return s; } };
}
const rt = load(arg('--baseline'));
function draw(runtime, state, W, H, tab = 'problem', bottom = 58, id = 'sm3-multi', thumb = false) {
  const b = Object.create(runtime.context.window.APLab.Board.prototype);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { top: 0, bottom, left: 0, right: 0 },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb, panes: null, paneId: null, focus: { x: [-5, 5], y: [-4, 4] },
    texts: [], paths: [], arcs: [], marks: [], leaders: [] });
  b.ctx = { font: '16px sans-serif', save() {}, restore() {},
    measureText(value) { return { width: runtime.G.textW(value, Number(this.font.match(/([\d.]+)px/)[1])) }; } };
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), world: points, options }); return b; };
  b.arc = (p, r, from, to, options = {}) => { b.arcs.push({ p, at: b.toS(p), r: r * b.k, from, to, options }); return b; };
  b.text = (p, value, options = {}) => {
    const at = b.toS(p), m = b.annotationSize(value, options), x = at.x + (options.dx || 0), y = at.y + (options.dy || 0);
    b.texts.push({ p, text: String(value), x, y, l: x - m.width / 2, r: x + m.width / 2, t: y - m.height / 2, b: y + m.height / 2, options }); return b;
  };
  const leader = b.leader;
  b.leader = (anchor, label, options) => { const result = leader.call(b, anchor, label, options); b.leaders.push({ result, options }); return result; };
  for (const name of ['point', 'right', 'ticks', 'handle', 'circle']) b[name] = (...args) => { b.marks.push({ name, args }); return b; };
  const scene = runtime.scene(id); scene.draw(b, state, {}, { s: state, scene, tab }); return b;
}
function intersects(a, z, r) {
  let lo = 0, hi = 1;
  for (const [v, d, min, max] of [[a.x, z.x - a.x, r.l, r.r], [a.y, z.y - a.y, r.t, r.b]]) {
    if (Math.abs(d) < 1e-9) { if (v < min || v > max) return false; }
    else { const x = (min - v) / d, y = (max - v) / d; lo = Math.max(lo, Math.min(x, y)); hi = Math.min(hi, Math.max(x, y)); }
    if (lo > hi) return false;
  }
  return true;
}
function checkFG(runtime, b, s, final = false, why = '') {
  const p = s.smPk, g = runtime.G.geo.multiGeo(p.a, p.bb, p.c, p.r), F = b.toS(g.F), G = b.toS(g.Gp), D = b.toS(g.D), E = b.toS(g.E);
  const labels = b.texts.filter(t => t.text === (final ? String(g.FG) : 'x') && t.options.leaderAnchor
    && Math.abs(t.options.leaderAnchor.y - g.F.y) < 1e-7 && t.options.color === 'amber');
  assert.equal(labels.length, 1, `${why}: exactly the queried FG label is drawn`);
  const label = labels[0], narrow = Math.abs(F.y - D.y) < 36;
  assert.ok(!intersects(D, E, { l: label.l - 3, r: label.r + 3, t: label.t - 3, b: label.b + 3 }), `${why}: FG label touches the distinct DE segment`);
  assert.ok(label.l >= 8 && label.r <= b.W - 8 && label.t >= 8 && label.b <= b.H - b.insets.bottom - 8, `${why}: FG label is in the usable stage`);
  if (narrow) {
    const leader = b.leaders.find(l => l.result?.drawn && distance(l.result.label, label) < 1e-7);
    assert.ok(leader, `${why}: the close parallel lines require a rendered connector to FG`);
    const { anchor, label: painted, end } = leader.result;
    close(anchor.y, F.y, `${why}: actual connector belongs to FG, not DE`);
    assert.ok(anchor.x > F.x && anchor.x < G.x, `${why}: actual connector begins inside FG`);
    close(painted.x, label.x, 'returned label x matches painted text'); close(painted.y, label.y, 'returned label y matches painted text');
    assert.ok(label.l > G.x + 10, `${why}: the callout is outside the crowded parallel strip`);
    assert.ok(b.paths.some(p => p.points.length === 2 && distance(p.points[0], anchor) < 1e-7 && distance(p.points[1], end) < 1e-7), 'the real Board leader path uses the verified screen coordinates');
    for (const point of [anchor, painted, end]) assert.ok(point.x >= 0 && point.x <= b.W && point.y >= 0 && point.y <= b.H - b.insets.bottom, 'actual connector remains on screen');
    for (const other of b.texts) if (other !== label) {
      assert.ok(label.r <= other.l || label.l >= other.r || label.b <= other.t || label.t >= other.b, `${why}: FG label covers ${other.text}`);
      assert.ok(!intersects(anchor, end, other), `${why}: connector passes through ${other.text}`);
    }
  }
  return { gap: Math.abs(F.y - D.y), label, g };
}
for (const [W, H] of [[360, 291], [390, 309]]) test(`sm3-multi ${W}px reproduced FG unknown is separated from DE`, t => {
  for (const bottom of [58, 60]) {
    const s = rt.state(); assert.deepEqual(plain(s.smPk), { seed: 1, a: 3, bb: 1, c: 1, r: 2, kind: 1 });
    const b = draw(rt, s, W, H, 'problem', bottom), result = checkFG(rt, b, s, false, `${W}/${bottom}`);
    t.diagnostic(`parallel gap ${result.gap.toFixed(2)}px; x center ${result.label.x.toFixed(2)},${result.label.y.toFixed(2)}`);
    assert.ok(b.texts.some(t => t.text === '6' && t.options.color === 'sky'), 'DE=6 remains given');
    assert.ok(b.texts.some(t => t.text === '10' && t.options.color === 'green'), 'BC=10 remains given');
    assert.equal(s.revealed, false);
  }
});
test('every legal FG question keeps its own segment connection and original solution disclosure', () => {
  const sc = rt.scene('sm3-multi'); let checked = 0;
  for (let a = 1; a <= 3; a++) for (let bb = 1; bb <= 3; bb++) for (let c = 1; c <= 3; c++) for (let r = 2; r <= 4; r++) {
    const s = rt.state(); s.smPk = { seed: 1, a, bb, c, r, kind: 1 };
    const model = plain(sc.sm.model(s)), question = sc.problem.text(s), sol = sc.sm.solution(s);
    close(sol.answer, r * (a + bb), 'independently calculated FG');
    for (const [W, H] of [[360, 291], [390, 309], [820, 461], [683, 548], [1039, 672]]) {
      checkFG(rt, draw(rt, s, W, H), s, false, `${a}/${bb}/${c}/${r}/${W}/problem`); checked++;
      if (W < 560) for (let step = 1; step <= sol.steps.length; step++) {
        s.step = step; const final = step === sol.steps.length, b = draw(rt, s, W, H, 'review');
        checkFG(rt, b, s, final, `${a}/${bb}/${c}/${r}/${W}/step${step}`); checked++;
        assert.equal(b.texts.some(t => t.text === 'x'), !final, 'unknown is replaced only at the original final step');
      }
    }
    assert.deepEqual(plain(sc.sm.model(s)), model, 'drawing and solution steps preserve math');
    assert.equal(sc.problem.text(s), question); assert.equal(s.revealed, false);
  }
  assert.equal(checked, 1215);
});
test('reentry restores the original unknown and all three parallel segments', () => {
  const sc = rt.scene('sm3-multi'), s = rt.state(); Object.assign(s, { step: 5, playing: true, revealed: true });
  s.smPk = { seed: 7, a: 1, bb: 3, c: 2, r: 4, kind: 1 }; sc.enter(s);
  assert.deepEqual(plain(s), plain(rt.state())); const b = draw(rt, s, 360, 291); checkFG(rt, b, s);
  assert.equal(b.paths.filter(p => p.options.color === 'green' && p.options.width === 3.6).length, 2, 'DE and FG remain visible in addition to the original triangle BC');
});
if (arg('--compare-scope')) test('other scenes, contours, givens, non-FG questions and normal spacing stay identical', () => {
  const old = load(arg('--compare-scope')), picture = b => plain({ texts: b.texts, paths: b.paths, arcs: b.arcs, marks: b.marks, leaders: b.leaders });
  for (const sc of rt.scenes) {
    const s = rt.state(sc.id), z = old.state(sc.id), os = old.scene(sc.id);
    assert.deepEqual(plain(sc.sm.model(s)), plain(os.sm.model(z)), `${sc.id} model`);
    assert.equal(sc.problem?.text(s), os.problem?.text(z), `${sc.id} question`);
    assert.deepEqual(plain(sc.steps(s)), plain(os.steps(z)), `${sc.id} solution`);
    for (const [W, H] of [[1039, 672], [820, 461], [683, 548], [390, 309], [360, 291]]) for (const tab of ['explore', 'review', 'problem']) {
      const a = draw(rt, s, W, H, tab, 58, sc.id), b = draw(old, z, W, H, tab, 58, sc.id);
      if (sc.id !== 'sm3-multi' || W >= 560 || tab === 'explore') assert.deepEqual(picture(a), picture(b), `${sc.id}/${W}/${tab}`);
      else {
        assert.deepEqual(plain(a.paths.filter(p => p.options.color !== 'muted')), plain(b.paths.filter(p => p.options.color !== 'muted')), 'original shapes and solution highlights are unchanged');
        assert.deepEqual(plain(a.marks), plain(b.marks)); assert.deepEqual(plain(a.arcs), plain(b.arcs));
        assert.deepEqual(plain(a.texts.filter(t => t.text !== 'x')), plain(b.texts.filter(t => t.text !== 'x')), 'all original given values and point names are unchanged');
      }
    }
    assert.deepEqual(picture(draw(rt, s, 240, 180, 'explore', 0, sc.id, true)), picture(draw(old, z, 240, 180, 'explore', 0, sc.id, true)), `${sc.id} thumbnail`);
  }
  for (let a = 1; a <= 3; a++) for (let bb = 1; bb <= 3; bb++) for (let c = 1; c <= 3; c++) for (let r = 2; r <= 4; r++) for (const kind of [0, 2]) {
    const s = rt.state(), z = old.state(); s.smPk = z.smPk = { seed: 1, a, bb, c, r, kind };
    for (const tab of ['problem', 'review']) assert.deepEqual(picture(draw(rt, s, 360, 291, tab)), picture(draw(old, z, 360, 291, tab)), `unchanged DE/BC question ${a}/${bb}/${c}/${r}/${kind}/${tab}`);
  }
});
