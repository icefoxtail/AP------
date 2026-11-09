// c1-1 native 390/360/820 problem regression: OM's unknown was printed on OB.
// Use the production Board and queued-label renderer; Chromium visual review
// is an additional gate. --baseline <SHA> must reproduce the old failure.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const unit = 'apmath/playground/next/labs/g9-circle';
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = x => JSON.parse(JSON.stringify(x));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const same = (a, b) => distance(a, b) < 1e-7;
function load(before) {
  const context = vm.createContext({ window: {}, document: { documentElement: { dataset: {} }, getElementById() {},
    createElement() { return {}; }, head: { append() {} }, addEventListener() {} } });
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 'solutions']) {
    const file = `${unit}/${name}.js`;
    const source = before && name === 't1' ? execFileSync('git', ['show', `${before}:${file}`], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  context.window.APLab = { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const groups = context.window.APL_CI_GROUPS, scenes = groups.flatMap(g => g.scenes), params = Object.assign({}, ...groups.map(g => g.params));
  return { context, scenes, G: context.window.APL_CI, scene: id => scenes.find(s => s.id === id),
    fresh(id) { const s = Object.fromEntries(Object.entries(params).map(([k, p]) => [k, p.value])); this.scene(id).enter(s); return s; } };
}
const rt = load(arg('--baseline'));
function draw(runtime, id, s, W, H, tab = 'problem', thumb = false) {
  const proto = runtime.context.window.APLab.Board.prototype, b = Object.create(proto);
  Object.assign(b, { W, H, kind: 'figure', aspect: '1:1', pad: .02, fs: 1, thumb, panes: null, paneId: null,
    zoom: 1, panX: 0, panY: 0, insets: { top: 0, bottom: thumb ? 0 : 60, left: 0, right: 0 }, focus: { x: [-6, 6], y: [-6, 6] },
    texts: [], paths: [], circles: [], arcs: [], marks: [], leaders: [], inLeader: false });
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), world: points, options, leader: b.inLeader }); return b; };
  b.circle = (p, r, options = {}) => { b.circles.push({ at: b.toS(p), r: r * b.k, world: p, radius: r, options }); return b; };
  b.arc = (p, r, a, z, options = {}) => { b.arcs.push({ at: b.toS(p), r: r * b.k, a, z, options }); return b; };
  b.text = (p, text, options = {}) => { const q = b.toS(p); b.texts.push({ text: String(text), p, x: q.x + (options.dx || 0), y: q.y + (options.dy || 0), options }); return b; };
  b.leader = (anchor, label, options) => {
    b.inLeader = true;
    let result;
    try { result = proto.leader.call(b, anchor, label, options); } finally { b.inLeader = false; }
    b.leaders.push({ anchor, label, options, result }); return result;
  };
  for (const name of ['right', 'ticks', 'point', 'handle']) b[name] = (...args) => { b.marks.push({ name, args }); return b; };
  const sc = runtime.scene(id); sc.draw(b, s, {}, { tab, scene: sc, s }); return b;
}
function verifyTarget(b, M, expected = 'x') {
  const t = b.texts.find(t => t.text === expected || t.text === `OM=${expected}`);
  assert.ok(t, 'the requested OM quantity remains visible');
  const O = b.toS({ x: 0, y: 0 }), Mm = b.toS(M.g.M), anchor = { x: (O.x + Mm.x) / 2, y: (O.y + Mm.y) / 2 };
  const link = b.leaders.find(l => same(l.result.label, t));
  assert.ok(link?.result.drawn, 'OM value needs a rendered connector to its own segment, not OB');
  assert.ok(same(link.result.anchor, anchor), 'actual returned leader anchor is OM midpoint');
  assert.ok(b.paths.some(p => p.leader && p.points.length === 2 && same(p.points[0], anchor) && same(p.points[1], link.result.end)), 'actual leader path uses the verified anchor/end pixels');
  const box = b.ciLabels.find(x => x.text === t.text && Math.abs((x.l + x.r) / 2 - t.x) < 1e-7);
  assert.ok(box, 'measure the final placed glyph, not its requested offset');
  const circle = b.circles[0];
  assert.ok(box.l >= circle.at.x + circle.r + 6, 'the OM value must be clear of the neighboring radius OB and circle outline');
  assert.ok(box.l >= 12 && box.r <= b.W - 12 && box.t >= 0 && box.b <= b.H - b.insets.bottom - 10, 'target text remains within the usable stage');
  for (const p of [link.result.anchor, link.result.label, link.result.end]) assert.ok(p.x >= 0 && p.x <= b.W && p.y >= 0 && p.y <= b.H - b.insets.bottom, 'returned leader endpoints are visible screen coordinates');
  assert.ok(b.paths.some(p => !p.leader && p.world.length === 2 && same(p.world[0], { x: 0, y: 0 }) && same(p.world[1], M.g.M)), 'the original perpendicular OM is still drawn');
  return box.l - circle.at.x - circle.r;
}
for (const [W, H] of [[390, 309], [360, 291], [820, 396.59375]]) test(`c1-1 ${W}px initial unknown points to OM, clear of OB`, t => {
  const s = rt.fresh('c1-1'), M = rt.scene('c1-1').ci.model(s, { problem: true });
  const gap = verifyTarget(draw(rt, 'c1-1', s, W, H), M);
  assert.equal(s.ciPk.kind, 0); assert.equal(s.ciPick, null); assert.equal(s.playing, false);
  t.diagnostic(`target glyph is ${gap.toFixed(2)}px beyond the circle outline`);
});
function verifyUnlinkedTarget(b, M, expected) {
  const t = b.texts.find(t => t.text === expected);
  assert.ok(t, 'the unchanged inline OM value remains visible');
  const box = b.ciLabels.find(x => x.text === t.text && Math.abs((x.l + x.r) / 2 - t.x) < 1e-7);
  const O = b.toS({ x: 0, y: 0 }), B = b.toS(M.g.B);
  const obX = y => O.x + (B.x - O.x) * (y - O.y) / (B.y - O.y);
  assert.ok(Math.min(obX(box.t), obX(box.b)) - box.r >= 6, 'inline target glyph has actual clearance from the slanted OB radius');
  assert.ok(t.x - O.x < obX(t.y) - t.x, 'an inline target remains nearer OM than OB');
}
test('all supported OM questions preserve the original geometry and staged answer', () => {
  const base = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [15, 20, 25], [10, 24, 26]];
  const triples = base.concat(base.map(([a, d, R]) => [d, a, R]));
  for (const [am, om, R] of triples) for (const [W, H] of [[1039, 741], [820, 396.59375], [683, 613], [390, 309], [360, 291]]) {
    const sc = rt.scene('c1-1'), s = rt.fresh(sc.id);
    s.ciPk = { kind: 0, am, om, R, key: `b0.${am}.${om}.${R}` };
    const M = sc.ci.model(s, { problem: true }), Q = sc.ci.prob(M, s), sol = sc.solution(s);
    assert.equal(Q.choices.filter(c => c.ok).length, 1);
    assert.ok(Math.abs(M.d ** 2 + M.am ** 2 - M.R ** 2) < 1e-7, 'same Pythagorean model');
    assert.deepEqual(plain(Q.chk), [om, om]);
    const initial = draw(rt, sc.id, s, W, H);
    if (initial.texts.some(t => t.text === 'OM=x')) verifyTarget(initial, M);
    else verifyUnlinkedTarget(initial, M, 'x');
    for (let step = 1; step <= sol.steps.length; step++) {
      s.step = step; const last = step === sol.steps.length, b = draw(rt, sc.id, s, W, H, 'review');
      const expected = last ? String(sol.display) : 'x', linked = b.texts.some(t => t.text === `OM=${expected}`);
      if (linked) verifyTarget(b, M, expected); else verifyUnlinkedTarget(b, M, expected);
      assert.equal(b.texts.some(t => t.text === 'OM=x' || t.text === 'x'), !last, 'answer is not revealed before the existing final step');
      if (last) assert.ok(b.texts.some(t => t.text === `OM=${sol.display}` || t.text === String(sol.display)), 'the existing replacement still reveals the same OM answer');
    }
    assert.equal(sc.ci.prob(M, s).stem, Q.stem, 'review keeps the current question');
  }
});
if (arg('--compare-scope')) test('other scenes, question variants, exploration and wider layouts stay unchanged', () => {
  const old = load(arg('--compare-scope'));
  const picture = b => plain({ paths: b.paths, texts: b.texts, circles: b.circles, arcs: b.arcs, marks: b.marks, leaders: b.leaders });
  const geometry = b => plain({ paths: b.paths.filter(p => !p.leader), circles: b.circles, arcs: b.arcs, marks: b.marks });
  for (const sc of rt.scenes.filter(sc => /^c1-/.test(sc.id))) for (const [W, H] of [[1039, 741], [820, 396.59375], [683, 613], [390, 309], [360, 291]]) for (const tab of ['problem', 'review', 'explore']) {
    const s = rt.fresh(sc.id), z = old.fresh(sc.id); s.step = z.step = 1;
    assert.equal(sc.problem.text(s), old.scene(sc.id).problem.text(z));
    assert.deepEqual(plain(sc.solution(s)), plain(old.scene(sc.id).solution(z)));
    const a = draw(rt, sc.id, s, W, H, tab), b = draw(old, sc.id, z, W, H, tab);
    assert.deepEqual(geometry(a), geometry(b), `${sc.id}/${W}/${tab}: original geometry unchanged`);
    if (sc.id !== 'c1-1' || [1039, 683].includes(W) || tab === 'explore') assert.deepEqual(picture(a), picture(b), `${sc.id}/${W}/${tab}: non-target rendering unchanged`);
  }
  for (const kind of [1, 2]) for (const [W, H] of [[390, 309], [360, 291], [820, 396.59375]]) for (const tab of ['problem', 'review']) {
    const s = rt.fresh('c1-1'), z = old.fresh('c1-1'); s.ciPk.kind = z.ciPk.kind = kind; s.step = z.step = 1;
    assert.deepEqual(picture(draw(rt, 'c1-1', s, W, H, tab)), picture(draw(old, 'c1-1', z, W, H, tab)), `kind${kind}/${W}/${tab}`);
  }
  assert.deepEqual(picture(draw(rt, 'c1-1', rt.fresh('c1-1'), 240, 180, 'explore', true)), picture(draw(old, 'c1-1', old.fresh('c1-1'), 240, 180, 'explore', true)), 'thumbnail unchanged');
});
