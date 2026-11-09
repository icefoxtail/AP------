// Production scene + Board coordinate contracts for the five independently
// observed mobile question defects. These checks do not substitute for Chromium
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
const ids = ['t5-1', 't5-3', 't5-6', 't6-1', 't6-5'];
const mobile = [[390, 309], [360, 291]];

function load(baseline) {
  const document = { documentElement: { dataset: {} }, getElementById() {}, createElement() { return {}; }, head: { append() {} }, addEventListener() {} };
  const context = vm.createContext({ window: {}, document, console });
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7']) {
    const file = `${labPath}/${name}.js`;
    const source = baseline && ['t5', 't6'].includes(name)
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

test('t5-1 original circumcircle is large enough to distinguish the three midpoints and radii', t => {
  for (const [W, H] of mobile) for (const bottom of [58, 60]) for (const tab of ['problem', 'review']) {
    const s = rt.state('t5-1'); s.step = 1;
    const b = draw(rt, 't5-1', s, W, H, tab, bottom), g = rt.scene('t5-1').tr.model(s).g;
    const circle = b.marks.find(mark => mark.method === 'circle');
    t.diagnostic(`${W}/${bottom}/${tab}: diameter ${2 * circle.r}`);
    assert.ok(2 * circle.r >= (tab === 'problem' ? 155 : 130), 'initial circumcircle must not collapse under its midpoint/radius labels');
    for (const name of ['O', 'A', 'B', 'C', 'D', 'E', 'F']) text(b, name);
    text(b, '6 cm'); text(b, 'x'); unobscured(b);
    const O = b.toS(g.O);
    for (const name of ['A', 'B', 'C']) close(distance(O, b.toS(g[name])), circle.r, 'vertex on the original circumcircle');
    for (const [name, a, z] of [['D', 'B', 'C'], ['E', 'C', 'A'], ['F', 'A', 'B']]) {
      close(distance(g[name], g[a]), distance(g[name], g[z]), `${name} remains the midpoint`);
      assert.ok(distance(b.toS(g[name]), O) >= 20, 'a midpoint is distinguishable from O');
    }
    assert.equal(s.trShow, null, 'the answer remains closed');
  }
});

test('t5-3 given 30 degrees identifies vertex A, and 60 degrees identifies vertex B', () => {
  for (const [W, H] of mobile) for (const bottom of [58, 60]) for (const tab of ['problem', 'review']) {
    const s = rt.state('t5-3'); s.step = 1;
    const b = draw(rt, 't5-3', s, W, H, tab, bottom), g = rt.scene('t5-3').tr.model(s).g;
    const A = b.toS(g.A), B = b.toS(g.B), O = b.toS(g.O), a = text(b, '30°'), z = text(b, '60°');
    assert.ok(distance(a, A) + 4 < distance(a, O), '30° must be attached to A, not positioned over O');
    assert.ok(distance(z, B) < distance(z, O), '60° stays at B');
    const link = b.leaders.find(item => distance(item.z, a) < 1e-7);
    assert.ok(link && link.result.drawn && distance(link.a, A) < distance(link.a, O), 'external 30° label connects to its actual A-angle marker');
    close(rt.G.angBetween(g.A, g.B, g.C), 30, 'actual A angle');
    close(rt.G.angBetween(g.B, g.A, g.C), 60, 'actual B angle');
    close(rt.G.angBetween(g.C, g.A, g.B), 90, 'actual C angle');
    text(b, '10 cm'); text(b, 'x'); unobscured(b);
  }
});

test('t5-6 x belongs to the inscribed angle at C and is separate from center O and its ratios', () => {
  for (const [W, H] of mobile) for (const bottom of [58, 60]) for (const tab of ['problem', 'review']) {
    const s = rt.state('t5-6'); s.step = 1;
    const scene = rt.scene('t5-6'), M = scene.tr.model(s), b = draw(rt, scene.id, s, W, H, tab, bottom);
    const x = text(b, 'x'), C = b.toS(M.g.C), O = b.toS(M.g.O);
    assert.ok(distance(x, C) + 4 < distance(x, O), 'x must stay near the actual C angle, away from the center');
    for (const ratio of ['2', '3', '4']) assert.ok(distance(text(b, ratio), x) >= 22, 'x is distinct from the central ratio labels');
    assert.ok(distance(text(b, 'O'), x) >= 22, 'x does not overlap O');
    close(rt.G.angBetween(M.g.C, M.g.A, M.g.B), 360 * M.a / (M.a + M.b + M.c) / 2, 'independent inscribed-angle calculation');
    unobscured(b);
  }
});

for (const id of ['t6-1', 't6-5']) test(`${id} the given apex angle stays attached to A and clear of incenter I`, () => {
  for (const [W, H] of mobile) for (const bottom of [58, 60]) for (const tab of ['problem', 'review']) {
    const s = rt.state(id); s.step = 1;
    const M = rt.scene(id).tr.model(s), b = draw(rt, id, s, W, H, tab, bottom);
    const A = b.toS(M.g.A), I = b.toS(M.g.I), a = text(b, '60°');
    assert.ok(distance(a, A) + 4 < distance(a, I), '60° is the angle at A, not a label on I');
    assert.ok(distance(a, text(b, 'I')) >= 28, 'the angle condition and incenter name remain separate');
    assert.ok(distance(a, text(b, 'x')) >= 24, 'the given angle and requested angle remain separate');
    close(rt.G.angBetween(M.g.A, M.g.B, M.g.C), 60, 'actual apex angle');
    close(rt.G.angBetween(M.g.A, M.g.B, M.g.I), 30, 'actual bisected apex angle');
    if (id === 't6-1') {
      const ring = b.marks.find(mark => mark.method === 'circle'); assert.ok(ring && ring.r > 30, 'the incircle remains visible');
      const link = b.leaders.find(item => distance(item.z, a) < 1e-7);
      assert.ok(link && link.result.drawn && distance(link.a, A) < distance(link.a, I), 'external apex condition connects to the A-angle marker');
    }
    unobscured(b);
  }
});

test('independent angle/radius math, parameter limits, reset and answer stages survive the mobile framing', () => {
  for (const id of ids) {
    const sc = rt.scene(id), fresh = rt.state(id), variants = [];
    for (let v = 0; v < (id === 't5-6' ? 2 : 3); v++) variants.push({ trV: v });
    if (id === 't5-1') variants.push({ trOa: 45, trOb: 75, trOr: 3 }, { trOa: 75, trOb: 45, trOr: 10 });
    if (id === 't5-3') variants.push({ trSr: 3 }, { trSr: 9 });
    if (id === 't5-6') for (const [a, b, c] of [[1, 1, 1], [1, 2, 3], [6, 1, 1], [6, 6, 6], [3, 4, 5]]) variants.push({ trRa: a, trRb: b, trRc: c });
    if (id.startsWith('t6')) for (const a of [20, 30, 40]) for (const b of [20, 30, 40]) variants.push({ trNa: a, trNb: b });
    for (const values of variants) {
      const s = { ...fresh, ...values }, M = sc.tr.model(s), initialModel = JSON.stringify(M), question = sc.problem.text(s), steps = sc.steps(s);
      for (const [W, H] of mobile) for (const tab of ['problem', 'review']) {
        s.step = 1; const first = draw(rt, id, s, W, H, tab); unobscured(first);
        assert.ok(first.texts.some(item => item.text === 'x') || s.trV === 2 && ['t5-1', 't6-1'].includes(id), 'unknown remains unknown until the answer stage');
        for (let step = 1; step <= steps.length; step++) { s.step = step; unobscured(draw(rt, id, s, W, H, 'review')); }
        assert.equal(JSON.stringify(sc.tr.model(s)), initialModel, 'rendering/steps do not alter the original mathematical model');
        assert.equal(sc.problem.text(s), question, 'rendering/steps do not alter question or reveal its answer');
      }
      if (id.startsWith('t5')) {
        const g = M.g; close(distance(g.O, g.A), distance(g.O, g.B), 'OA = OB'); close(distance(g.O, g.A), distance(g.O, g.C), 'OA = OC');
        if (id === 't5-6') close(rt.G.angBetween(g.C, g.A, g.B), M.ab / 2, 'central angle / 2');
      } else {
        const g = M.g;
        const toLine = (p, q) => Math.abs((q.x - p.x) * (g.I.y - p.y) - (q.y - p.y) * (g.I.x - p.x)) / distance(p, q);
        close(toLine(g.A, g.B), toLine(g.B, g.C), 'incenter distances to AB/BC'); close(toLine(g.A, g.B), toLine(g.C, g.A), 'incenter distances to AB/CA');
        close(rt.G.angBetween(g.I, g.B, g.C), 90 + rt.G.angBetween(g.A, g.B, g.C) / 2, 'independent BIC calculation');
      }
    }
    const changed = { ...fresh, ...variants.at(-1), trShow: 'opened', playing: true }; sc.enter(changed);
    assert.deepEqual(plain(sc.tr.model(changed)), plain(sc.tr.model(fresh)), 'reentry restores the original model');
    assert.equal(changed.trShow, null); assert.equal(changed.playing, false);
    assert.deepEqual(picture(draw(rt, id, changed, 360, 291)), picture(draw(rt, id, fresh, 360, 291)), 'reentry restores the initial picture');
  }
});

if (arg('--compare-scope')) test('wide stages, inquiry pictures, thumbnails, other scenes and all question math are unchanged', () => {
  const before = load(arg('--compare-scope'));
  for (const scene of rt.scenes) {
    const s = rt.state(scene.id), previous = before.state(scene.id);
    assert.deepEqual(plain(scene.tr.model(s)), plain(before.scene(scene.id).tr.model(previous)), scene.id + ' model');
    assert.equal(scene.problem?.text(s), before.scene(scene.id).problem?.text(previous), scene.id + ' question');
    assert.deepEqual(plain(scene.steps(s)), plain(before.scene(scene.id).steps(previous)), scene.id + ' steps');
    for (const [W, H] of [[1039, 672], [820, 461], [683, 548], [390, 309], [360, 291]]) for (const tab of ['explore', 'problem', 'review']) {
      s.step = previous.step = 1;
      if (W < 560 && ids.includes(scene.id) && tab !== 'explore') continue;
      assert.deepEqual(picture(draw(rt, scene.id, s, W, H, tab)), picture(draw(before, scene.id, previous, W, H, tab)), `${scene.id}/${W}/${tab}`);
    }
    assert.deepEqual(picture(draw(rt, scene.id, s, 240, 180, 'explore', 0, true)), picture(draw(before, scene.id, previous, 240, 180, 'explore', 0, true)), scene.id + ' thumbnail');
  }
});
