// Production scene + Board coordinate contracts for the four independently
// observed congruence and center question defects. These checks do not substitute for Chromium
// screenshots or independent visual review.
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
const labPath = 'apmath/playground/next/labs/g8-triangles';
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = value => JSON.parse(JSON.stringify(value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const close = (a, b, why) => assert.ok(Math.abs(a - b) < 1e-7, `${why}: ${a} / ${b}`);
const ids = ['t3-6', 't3-7', 't7-4', 't7-5'];
const mobile = [[390, 309], [360, 291]];

function load(baseline) {
  const document = { documentElement: { dataset: {} }, getElementById() {}, createElement() { return {}; }, head: { append() {} }, addEventListener() {} };
  const context = vm.createContext({ window: {}, document, console });
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7']) {
    const file = `${labPath}/${name}.js`;
    const source = baseline && ['core', 't3', 't7'].includes(name)
      ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' })
      : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  context.window.APLab = { clamp: (x, lo, hi) => Math.max(lo, Math.min(hi, x)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const groups = context.window.APL_TR_GROUPS, scenes = groups.flatMap(group => group.scenes);
  const defaults = Object.assign({}, ...groups.map(group => group.params));
  return { context, scenes, G: context.window.APL_TR, scene: id => scenes.find(scene => scene.id === id),
    state(id) { const s = Object.fromEntries(Object.entries(defaults).map(([key, param]) => [key, param.value])); this.scene(id).enter(s); return s; } };
}
const rt = load(arg('--baseline'));

function draw(runtime, id, s, W, H, tab = 'problem', bottom = 58, thumb = false) {
  const proto = runtime.context.window.APLab.Board.prototype, b = Object.create(proto);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { left: 0, right: 0, top: 0, bottom },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb, panes: null, paneId: null, focus: { x: [-6, 6], y: [-6, 6] },
    paths: [], arcs: [], texts: [], marks: [], leaders: [] });
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), options }); return b; };
  b.seg = (p, q, options = {}) => b.path([p, q], options);
  b.circle = (p, r, options = {}) => { b.marks.push({ method: 'circle', at: b.toS(p), r: r * b.k, options }); return b; };
  b.arc = (p, r, a, z, options = {}) => { b.arcs.push({ at: b.toS(p), r: r * b.k, a, z, options }); return b; };
  b.text = (p, text, options = {}) => {
    const q = b.toS(p), size = (options.size || 16) * b.fs * b._ts();
    b.texts.push({ text: String(text), p, x: q.x + (options.dx || 0), y: q.y + (options.dy || 0), size, options }); return b;
  };
  b.leader = (a, z, options) => { const result = proto.leader.call(b, a, z, options); b.leaders.push({ a, z, options, result }); return result; };
  for (const name of ['right', 'ticks', 'point', 'handle']) b[name] = (...args) => { b.marks.push({ method: name, args }); return b; };
  const scene = runtime.scene(id); scene.draw(b, s, {}, { tab, scene, s });
  return b;
}
const text = (b, value) => { const label = b.texts.find(item => item.text === value); assert.ok(label, `visible label ${value}`); return label; };
const picture = b => plain({ paths: b.paths, arcs: b.arcs, texts: b.texts, marks: b.marks, leaders: b.leaders });
function unobscured(b) {
  for (const label of b.trLabels || []) {
    assert.ok(label.l >= 5 && label.r <= b.W - 5 && label.t >= 3 && label.b <= b.H - b.insets.bottom - 3,
      `${label.text}: inside the unobscured stage`);
  }
  for (const path of b.paths) for (const p of path.points) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
}

function kite(M) {
  const a = M.a * Math.PI / 180, x = Math.cos(a) ** 2, y = Math.cos(a) * Math.sin(a);
  return { A: { x: 0, y: 0 }, B: { x, y: -y }, C: { x: 1, y: 0 }, D: { x, y } };
}
const bounds = (b, value) => { const box = b.trLabels.find(q => q.text === value); assert.ok(box, `bounds for ${value}`); return box; };
const linkTo = (b, label, point, why) => {
  const link = b.leaders.find(q => distance(q.z, label) < 1e-7);
  assert.ok(link && link.result.drawn, why + ': visible connector');
  assert.ok(distance(link.a, point) < 1e-7, why + ': connector begins at the actual geometric source');
};

for (const [W, H] of mobile) test(`t3-6 ${W}px x identifies C, clear of the right angle at B`, () => {
  for (const tab of ['problem', 'review']) for (const v of [0, 2]) for (const a of [20, 40, 70]) {
    const s = rt.state('t3-6'); s.trV = v; s.trKa = a; s.step = 1;
    const M = rt.scene('t3-6').tr.model(s), g = kite(M), b = draw(rt, 't3-6', s, W, H, tab), x = text(b, 'x');
    const C = b.toS(g.C), B = b.toS(g.B), D = b.toS(g.D);
    assert.ok(distance(x, C) + 8 < Math.min(distance(x, B), distance(x, D)), 'x belongs to C rather than either right-angle vertex');
    linkTo(b, x, C, 'external x');
    close(rt.G.angBetween(g.B, g.A, g.C), 90, 'right angle B');
    close(rt.G.angBetween(g.D, g.A, g.C), 90, 'right angle D');
    close(rt.G.angBetween(g.C, g.B, g.D), 180 - 2 * a, 'target angle BCD');
    text(b, `${v === 0 ? 2 * a : a}°`);
    for (const arc of b.arcs) {
      const V = Object.values(g).find(p => distance(b.toS(p), arc.at) < 1e-7);
      if (V) assert.ok(arc.r < Math.min(...Object.values(g).filter(p => p !== V).map(p => distance(p, V))) * b.k * .5, 'arc stays local to its vertex');
    }
    assert.equal(s.trShow, null); unobscured(b);
  }
});

for (const [W, H] of mobile) test(`t3-7 ${W}px original triangle is distinct from its right-angle marks`, t => {
  for (const tab of ['problem', 'review']) {
    const s = rt.state('t3-7'); s.step = 1;
    const M = rt.scene('t3-7').tr.model(s), b = draw(rt, 't3-7', s, W, H, tab), g = M.g;
    const box = rt.G.bboxOf([g.A, g.B, g.C]), height = (box.y1 - box.y0) * b.k;
    t.diagnostic(`${W}/${tab}: initial triangle height ${height.toFixed(2)}px`);
    assert.ok(height >= (tab === 'problem' ? 140 : 100), 'basic triangle cannot collapse under the angle/equality marks');
    assert.ok(distance(text(b, 'x'), b.toS(g.A)) > 28, 'area x is separate from the right-angle square at A');
    for (const name of ['A', 'B', 'C', 'D', 'E']) text(b, name);
    text(b, `${M.m} cm`); text(b, `${M.n} cm`);
    close(Math.abs(rt.G.polyArea([g.A, g.B, g.C])), M.tri, 'original triangle area');
    close(distance(g.A, g.B), distance(g.A, g.C), 'AB = AC');
    close(rt.G.angBetween(g.A, g.B, g.C), 90, 'right angle at A');
    assert.equal(s.trShow, null); unobscured(b);
  }
});

for (const [W, H] of mobile) test(`t7-4 ${W}px the given radius identifies OD, separate from OA=x`, () => {
  for (const tab of ['problem', 'review']) {
    const s = rt.state('t7-4'); s.step = 1;
    const M = rt.scene('t7-4').tr.model(s), b = draw(rt, 't7-4', s, W, H, tab);
    const od = b.toS({ x: 0, y: .25 }), oa = b.toS({ x: 0, y: -.5 });
    const given = text(b, `${M.r} cm`), x = text(b, 'x');
    assert.ok(distance(given, od) + 3 < distance(given, oa), 'given length is at OD rather than OA');
    assert.ok(distance(x, oa) < distance(x, od), 'unknown radius belongs to OA');
    assert.ok(distance(given, x) >= 45, 'given radius and x remain visibly separate');
    linkTo(b, given, od, 'OD given');
    close(M.R, 2 * M.r, 'equilateral circumradius is twice the inradius');
    close(M.h, 3 * M.r, 'equilateral altitude is three inradii');
    assert.equal(s.trShow, null); unobscured(b);
  }
});

for (const [W, H] of mobile) test(`t7-5 ${W}px the role legend is below the original triangle and conditions`, () => {
  for (const tab of ['problem', 'review']) {
    const s = rt.state('t7-5'); s.step = 1;
    const M = rt.scene('t7-5').tr.model(s), b = draw(rt, 't7-5', s, W, H, tab);
    const base = Math.max(b.toS(M.B).y, b.toS(M.C).y);
    const legend = b.trLabels.filter(box => /외심|수선의 발/.test(box.text));
    assert.ok(legend.some(box => /외심/.test(box.text)) && legend.some(box => /수선의 발/.test(box.text)), 'point roles remain explained');
    for (const box of legend) assert.ok(box.t > base + 35, `${box.text}: legend cannot cover BC or point names`);
    for (const name of ['A', 'B', 'C', 'O', 'D', 'x']) text(b, name);
    text(b, `BC = ${2 * M.m} cm`);
    close(distance(M.B, M.DO), distance(M.C, M.DO), 'circumcenter perpendicular foot is the midpoint');
    close(distance(M.O, M.B), distance(M.O, M.C), 'OB = OC');
    assert.equal(s.trShow, null); unobscured(b);
  }
});

test('question variants, numerical models, answer stages, animation and reset remain intact', () => {
  for (const id of ids) {
    const sc = rt.scene(id), fresh = rt.state(id), variants = [];
    for (let v = 0; v < (id === 't3-7' ? 2 : 3); v++) variants.push({ trV: v });
    if (id === 't3-6') for (const a of [20, 40, 70]) variants.push({ trKa: a });
    if (id === 't3-7') for (const m of [2, 4, 8]) for (const e of [0, 2, 6]) variants.push({ trUm: m, trUe: e });
    if (id === 't7-4') for (const r of [2, 3, 6]) variants.push({ trMr: r });
    for (const changes of variants) {
      const s = { ...fresh, ...changes }, model = JSON.stringify(sc.tr.model(s)), question = sc.problem.text(s), steps = sc.steps(s);
      for (const [W, H] of mobile) {
        s.step = 1; const first = draw(rt, id, s, W, H); unobscured(first);
        assert.ok(first.texts.some(q => q.text === 'x') || id === 't7-5' && s.trV === 2, 'target remains unknown initially');
        for (let step = 1; step <= steps.length; step++) { s.step = step; unobscured(draw(rt, id, s, W, H, 'review')); }
        assert.equal(JSON.stringify(sc.tr.model(s)), model); assert.equal(sc.problem.text(s), question);
        assert.equal(s.trShow, null);
      }
    }
    const reset = { ...fresh, ...variants.at(-1), trShow: 'shown', playing: true }; sc.enter(reset);
    assert.deepEqual(plain(sc.tr.model(reset)), plain(sc.tr.model(fresh)));
    assert.equal(reset.trShow, null); assert.equal(reset.playing, false);
    assert.deepEqual(picture(draw(rt, id, reset, 360, 291)), picture(draw(rt, id, fresh, 360, 291)));
  }
  const sc = rt.scene('t3-6'), s = rt.state('t3-6'), M = sc.tr.model(s);
  for (const progress of [0, .5, 1]) { s.trKt = progress; unobscured(draw(rt, sc.id, s, 360, 387, 'explore')); assert.deepEqual(plain(sc.tr.model(s)), plain(M)); }
});

if (arg('--compare-scope')) test('all other scenes, wide screens, inquiry and thumbnails are unchanged', t => {
  const before = load(arg('--compare-scope')); let frames = 0;
  for (const scene of rt.scenes) {
    const s = rt.state(scene.id), old = before.state(scene.id), prior = before.scene(scene.id);
    assert.deepEqual(plain(scene.tr.model(s)), plain(prior.tr.model(old)), scene.id + ' model');
    assert.equal(scene.problem?.text(s), prior.problem?.text(old), scene.id + ' question');
    assert.deepEqual(plain(scene.steps(s)), plain(prior.steps(old)), scene.id + ' answer stages');
    for (const [W, H] of [[1039, 672], [820, 461], [683, 548], [390, 309], [360, 291]]) for (const tab of ['explore', 'problem', 'review']) {
      if (W < 560 && ids.includes(scene.id) && tab !== 'explore') continue;
      s.step = old.step = 1;
      assert.deepEqual(picture(draw(rt, scene.id, s, W, H, tab)), picture(draw(before, scene.id, old, W, H, tab)), `${scene.id}/${W}/${tab}`); frames++;
    }
    assert.deepEqual(picture(draw(rt, scene.id, s, 240, 180, 'explore', 0, true)), picture(draw(before, scene.id, old, 240, 180, 'explore', 0, true)), scene.id + ' thumbnail'); frames++;
  }
  for (let step = 1; step <= rt.scene('t7-5').steps({ ...rt.state('t7-5'), trV: 2 }).length; step++) {
    const s = { ...rt.state('t7-5'), trV: 2, step }, old = { ...before.state('t7-5'), trV: 2, step };
    assert.deepEqual(picture(draw(rt, 't7-5', s, 360, 291, 'review')), picture(draw(before, 't7-5', old, 360, 291, 'review')), 'side-by-side statement review remains unchanged'); frames++;
  }
  t.diagnostic(`${frames} out-of-scope frames remain exactly equal`);
});

