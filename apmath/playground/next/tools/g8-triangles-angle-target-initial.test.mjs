// Screen-coordinate contracts for independently observed duplicate A-angle
// labels and an incenter-angle target misplaced onto side BC. Real browser
// captures and independent visual review remain a separate validation gate.
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
const ids = ['t5-1', 't5-2', 't5-5', 't5-6', 't6-5'];
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


const views = [[1039, 672], [820, 461], [683, 548], [390, 411], [360, 387]];
const labelBox = (b, value) => {
  const t = text(b, value), box = (b.trLabels || []).find(q => q.text === value && Math.abs((q.l + q.r) / 2 - t.x) < 1);
  assert.ok(box, `layout bounds for ${value}`); return box;
};
const lineDistance = (p, a, z) => Math.abs((z.x - a.x) * (p.y - a.y) - (z.y - a.y) * (p.x - a.x)) / distance(a, z);

test('t5-1 unknown radius OB has a visible callout to OB and stays clear of the chords', () => {
  for (const [W, H] of mobile) for (const tab of ['problem', 'review']) {
    const s = rt.state('t5-1'); s.step = 1;
    const sc = rt.scene('t5-1'), M = sc.tr.model(s), b = draw(rt, sc.id, s, W, H, tab);
    const x = text(b, 'x'), O = b.toS(M.g.O), B = b.toS(M.g.B), C = b.toS(M.g.C);
    const anchor = { x: (O.x + B.x) / 2, y: (O.y + B.y) / 2 };
    const link = b.leaders.find(q => distance(q.a, anchor) < 1e-7 && distance(q.z, x) < 1e-7);
    assert.ok(link?.result.drawn, 'the external value is visibly connected to the midpoint of radius OB');
    assert.ok(distance(x, O) > b.k + 12, 'the short value is outside the congested circle');
    assert.ok(lineDistance(x, B, C) > 20, 'x clears the chord and its equality tick');
    assert.ok(distance(x, O) > 18 && distance(x, B) > 18, 'the radius value is distinct from both endpoint names');
    text(b, '6 cm'); unobscured(b);
  }
});

test('t5-5 central-angle x is explicitly linked to O and separated from apex A and chord BC', () => {
  for (const [W, H] of mobile) for (const tab of ['problem', 'review']) {
    const s = rt.state('t5-5'); s.step = 1;
    const sc = rt.scene('t5-5'), M = sc.tr.model(s), b = draw(rt, sc.id, s, W, H, tab);
    const x = text(b, 'x'), O = b.toS(M.g.O), A = b.toS(M.g.A), B = b.toS(M.g.B), C = b.toS(M.g.C);
    assert.ok(distance(x, O) + 12 < distance(x, A), 'the unknown is attached to the central angle at O');
    assert.ok(lineDistance(x, B, C) > 20, 'the central-angle callout clears chord BC');
    const link = b.leaders.find(q => distance(q.a, O) < 1e-7 && distance(q.z, x) < 1e-7);
    assert.ok(link?.result.drawn, 'the external callout is visibly connected to its actual O vertex');
    assert.ok(b.arcs.some(q => distance(q.at, O) < 1e-7 && q.r > 8), 'the angle at O retains its marker');
    close(rt.G.angBetween(M.g.O, M.g.B, M.g.C), 360 - 2 * M.a, 'obtuse inscribed-angle relation');
    text(b, '112°'); assert.ok(!b.texts.some(q => q.text === '136°'), 'the requested central angle is still hidden'); unobscured(b);
  }
});

test('t5-6 inquiry inscribed-angle value identifies C with a leader and stays apart from center-angle values', () => {
  for (const [W, H] of [[390, 411], [360, 387]]) {
    const s = rt.state('t5-6'), sc = rt.scene('t5-6'), M = sc.tr.model(s), b = draw(rt, sc.id, s, W, H, 'explore');
    const q = text(b, '40°'), C = b.toS(M.g.C), O = b.toS(M.g.O);
    assert.ok(distance(q, C) + 8 < distance(q, O), '40° belongs to C, not to the center-angle group');
    const link = b.leaders.find(l => distance(l.z, q) < 1e-7 && distance(l.a, C) < 30);
    assert.ok(link?.result.drawn && distance(link.a, C) < distance(link.a, O), 'the external label connects to the actual C-angle arc');
    for (const value of ['80°', '120°', '160°']) assert.ok(distance(q, text(b, value)) > 30, 'inscribed and central-angle values stay distinct');
    close(rt.G.angBetween(M.g.C, M.g.A, M.g.B), M.ab / 2, 'central angle / 2'); unobscured(b);
  }
});

test('t5-2 initial A condition is drawn once, above AB, while the original right triangle and circle remain visible', () => {
  for (const [W, H] of views) {
    const s = rt.state('t5-2'), sc = rt.scene('t5-2'), M = sc.tr.model(s), b = draw(rt, sc.id, s, W, H, 'explore');
    const labels = b.texts.filter(q => q.text === '50°');
    assert.equal(labels.length, 1, 'AO and AB are the same ray: the given 50° must appear only once');
    const box = labelBox(b, '50°'), A = b.toS(M.g.A), B = b.toS(M.g.B), O = b.toS(M.g.O);
    assert.ok(box.b < Math.min(A.y, B.y) - 4, 'the A-angle value is clear of diameter AB');
    assert.ok(distance(labels[0], A) < distance(labels[0], O), 'the value belongs to A, not to center O');
    assert.ok(b.arcs.some(a => distance(a.at, A) < 1e-7 && a.r > 20), 'the single A-angle label retains its arc');
    for (const name of ['A', 'B', 'C', 'O', '40°', '4 cm', '8 cm']) text(b, name);
    const circle = b.marks.find(q => q.method === 'circle'); assert.ok(circle && circle.r > 50);
    close(rt.G.angBetween(M.g.C, M.g.A, M.g.B), 90, 'right angle at C');
    close(distance(M.g.O, M.g.A), distance(M.g.O, M.g.B), 'O stays at the diameter midpoint');
    close(distance(M.g.O, M.g.A), distance(M.g.O, M.g.C), 'O stays the circumcenter');
    unobscured(b);
  }
});

test('t5-2 all supported angles retain one A value and preserve the model on inquiry/reentry', () => {
  const sc = rt.scene('t5-2'), fresh = rt.state(sc.id);
  for (let angle = 20; angle <= 70; angle += 2) for (const [W, H] of views) {
    const s = { ...fresh, trPa: angle }, M = sc.tr.model(s), before = JSON.stringify(s), b = draw(rt, sc.id, s, W, H, 'explore');
    assert.equal(b.texts.filter(q => q.text === `${angle}°`).length, 1, 'one given angle value at A');
    assert.equal(JSON.stringify(s), before, 'draw does not mutate state');
    close(rt.G.angBetween(M.g.A, M.g.B, M.g.C), angle, 'A angle matches the selected value');
    close(rt.G.angBetween(M.g.B, M.g.C, M.g.A), 90 - angle, 'complementary angle at B');
  }
  const s = { ...fresh, trPa: 70, playing: true, trShow: 'opened' }; sc.enter(s);
  assert.equal(s.trShow, null); assert.equal(s.playing, false); assert.equal(s.trPa, 50);
  assert.deepEqual(picture(draw(rt, sc.id, s, 360, 387, 'explore')), picture(draw(rt, sc.id, fresh, 360, 387, 'explore')));
});

function checkBicLabel(b, M, value) {
  const I = b.toS(M.g.I), B = b.toS(M.g.B), C = b.toS(M.g.C), t = text(b, value), box = labelBox(b, value);
  assert.ok(box.b <= Math.min(B.y, C.y) - 6, `${value}: angle label must remain above side BC`);
  assert.ok(box.t >= I.y + 5, `${value}: label stays below its I-angle vertex`);
  assert.ok(distance(t, text(b, 'I')) >= 22, 'the requested angle and incenter name stay distinct');
  assert.ok(box.l > Math.min(B.x, C.x) && box.r < Math.max(B.x, C.x), 'the angle label stays within the horizontal extent of triangle IBC');
}

test('t6-5 initial x stays inside angle BIC rather than on side BC, with its own arc and incenter name', () => {
  for (const [W, H] of mobile) for (const bottom of [58, 60]) for (const tab of ['problem', 'review']) {
    const s = rt.state('t6-5'); s.step = 1;
    const sc = rt.scene('t6-5'), M = sc.tr.model(s), b = draw(rt, sc.id, s, W, H, tab, bottom);
    checkBicLabel(b, M, 'x');
    assert.ok(b.arcs.some(a => distance(a.at, b.toS(M.g.I)) < 1e-7 && a.r > 10), 'the target angle retains a visible arc at I');
    for (const name of ['A', 'B', 'C', 'I', '60°']) text(b, name);
    assert.ok(!b.texts.some(t => t.text === '120°'), 'the requested angle is not revealed initially');
    close(rt.G.angBetween(M.g.I, M.g.B, M.g.C), 120, 'independent initial angle BIC');
    unobscured(b);
  }
});

test('t6-5 angle targets remain clear of BC across supported shapes, reverse questions, and the final answer stage', () => {
  const sc = rt.scene('t6-5'), fresh = rt.state(sc.id);
  for (const a of [20, 25, 30, 35, 40]) for (const z of [20, 25, 30, 35, 40]) for (const variant of [0, 1]) for (const [W, H] of mobile) {
    const s = { ...fresh, trNa: a, trNb: z, trV: variant }, M = sc.tr.model(s), model = JSON.stringify(M), question = sc.problem.text(s), steps = sc.steps(s);
    close(rt.G.angBetween(M.g.I, M.g.B, M.g.C), 90 + rt.G.angBetween(M.g.A, M.g.B, M.g.C) / 2, 'BIC=90+A/2');
    s.step = 1;
    for (const tab of ['problem', 'review']) checkBicLabel(draw(rt, sc.id, s, W, H, tab), M, variant === 0 ? 'x' : `${M.bic}°`);
    for (let step = 1; step <= steps.length; step++) {
      s.step = step; const b = draw(rt, sc.id, s, W, H, 'review');
      if (variant === 0) checkBicLabel(b, M, step === steps.length ? `${M.bic}°` : 'x');
      unobscured(b);
    }
    assert.equal(JSON.stringify(sc.tr.model(s)), model); assert.equal(sc.problem.text(s), question);
  }
});

if (arg('--compare-scope')) test('all models/questions/answers and all unrelated scene pictures are unchanged', () => {
  const old = load(arg('--compare-scope'));
  for (const sc of rt.scenes) {
    const s = rt.state(sc.id), previous = old.state(sc.id), oldSc = old.scene(sc.id);
    assert.deepEqual(plain(sc.tr.model(s)), plain(oldSc.tr.model(previous)), sc.id + ' model');
    assert.equal(sc.problem?.text(s), oldSc.problem?.text(previous), sc.id + ' question');
    assert.deepEqual(plain(sc.steps(s)), plain(oldSc.steps(previous)), sc.id + ' answer stages');
    for (const [W, H] of views) for (const tab of ['explore', 'problem', 'review']) {
      s.step = previous.step = 1;
      if (sc.id === 't5-2' && tab === 'explore' || ['t5-1', 't5-5', 't6-5'].includes(sc.id) && W < 560 && tab !== 'explore' || sc.id === 't5-6' && W < 560 && tab === 'explore') continue;
      assert.deepEqual(picture(draw(rt, sc.id, s, W, H, tab)), picture(draw(old, sc.id, previous, W, H, tab)), `${sc.id}/${W}/${tab}`);
    }
  }
  for (const id of ids) for (const v of [0, 1, 2]) {
    const s = rt.state(id), previous = old.state(id); s.trV = previous.trV = v;
    assert.deepEqual(plain(rt.scene(id).tr.model(s)), plain(old.scene(id).tr.model(previous)), `${id} variant ${v} model`);
    assert.equal(rt.scene(id).problem.text(s), old.scene(id).problem.text(previous), `${id} variant ${v} problem`);
    assert.deepEqual(plain(rt.scene(id).steps(s)), plain(old.scene(id).steps(previous)), `${id} variant ${v} answer stages`);
  }
});
