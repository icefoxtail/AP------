// Production Board geometry contracts for three defects observed in Chromium.
// Text bounds below use conservative measured-width substitutes; independent
// Chromium screenshots remain the authority for legibility and visual quality.
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
const labPath = 'apmath/playground/next/labs/g8-pythagoras';
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = value => JSON.parse(JSON.stringify(value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const close = (a, b, why) => assert.ok(Math.abs(a - b) < 1e-7, `${why}: ${a} / ${b}`);
const affected = ['py5-tree', 'py6-iso', 'py8-quad'];
const compact = [[360, 291], [390, 309], [820, 397]];
const isoChips = [[10, 13], [16, 17], [12, 10], [24, 13], [14, 25], [18, 15], [20, 26], [16, 10]];

function load(baseline) {
  const document = { documentElement: { dataset: {} }, getElementById() {}, createElement() { return {}; }, head: { append() {} }, addEventListener() {} };
  const math = Object.create(Math); let seed = 0x12345678;
  math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const context = vm.createContext({ window: {}, document, Math: math });
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8']) {
    const file = `${labPath}/${name}.js`;
    const source = baseline && ['t5', 't6', 't8'].includes(name)
      ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' })
      : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  context.window.APLab = { clamp: (x, lo, hi) => Math.max(lo, Math.min(hi, x)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const groups = context.window.APL_PY_GROUPS, scenes = groups.flatMap(group => group.scenes);
  const defaults = Object.assign({}, ...groups.map(group => group.params));
  return { context, scenes, G: context.window.APL_PY, scene: id => scenes.find(scene => scene.id === id),
    state(id) { seed = 0x12345678; const s = Object.fromEntries(Object.entries(defaults).map(([key, param]) => [key, param.value])); this.scene(id).enter(s); s.step = 1; return s; } };
}
const rt = load(arg('--baseline'));

function draw(runtime, id, s, W, H, tab = 'problem', bottom = 58, thumb = false) {
  const b = Object.create(runtime.context.window.APLab.Board.prototype);
  const ctx = new Proxy({ font: '16px sans-serif', measureText(text) {
    const size = Number(this.font.match(/([.\d]+)px/)?.[1]) || 16;
    return { width: [...String(text)].reduce((sum, ch) => sum + size * (ch.charCodeAt(0) >= 0x1100 ? 1 : .64), 0) };
  } }, { get: (target, key) => key in target ? target[key] : () => {} });
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { left: 0, right: 0, top: 0, bottom },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb, panes: null, paneId: null, focus: { x: [-6, 6], y: [-6, 6] },
    ctx, paths: [], arcs: [], texts: [], marks: [] });
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), options }); return b; };
  b.seg = (p, q, options = {}) => b.path([p, q], options);
  b.circle = (p, r, options = {}) => { b.marks.push({ method: 'circle', at: b.toS(p), r: r * b.k, options }); return b; };
  b.arc = (p, r, a, z, options = {}) => { b.arcs.push({ at: b.toS(p), r: r * b.k, a, z, options }); return b; };
  b.text = (p, value, options = {}) => {
    const q = b.toS(p), size = b.annotationSize(value, options), x = q.x + (options.dx || 0), y = q.y + (options.dy || 0);
    const l = options.align === 'right' ? x - size.width : options.align === 'left' ? x : x - size.width / 2;
    b.texts.push({ text: String(value), p, x, y, options, l, r: l + size.width, t: y - size.height / 2, b: y + size.height / 2 }); return b;
  };
  for (const name of ['right', 'ticks', 'point', 'handle']) b[name] = (...args) => { b.marks.push({ method: name, args }); return b; };
  runtime.scene(id).draw(b, s, {}, { tab });
  return b;
}
const text = (b, value) => { const label = b.texts.find(item => item.text === value); assert.ok(label, `visible label ${value}`); return label; };
const picture = b => plain({ paths: b.paths, arcs: b.arcs, texts: b.texts, marks: b.marks });
const separate = (a, b, gap = 3) => a.r + gap <= b.l || b.r + gap <= a.l || a.b + gap <= b.t || b.b + gap <= a.t;
function visible(b, labels = b.texts) {
  for (const label of labels) assert.ok(label.l >= 3 && label.r <= b.W - 3 && label.t >= 3 && label.b <= b.H - b.insets.bottom - 3, `${label.text}: inside the unobscured stage`);
  for (const path of b.paths) for (const p of path.points) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
}
function pointSegment(p, a, z) {
  const dx = z.x - a.x, dy = z.y - a.y, t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
  return distance(p, { x: a.x + dx * t, y: a.y + dy * t });
}

for (const [W, H] of compact) test(`py5-tree ${W}px AB/AC conditions remain distinct and attached to their sides`, () => {
  for (const tab of ['problem', 'review']) for (const shade of ['all', 'ab']) for (const [p, q] of [[12, 6], [6, 12], [4, 3], [12, 12]]) {
    const s = rt.state('py5-tree'); s.pyQ = { pyTa: p, pyTb: q, pyT1: 30, pyT2: 60, pyShade: shade };
    const b = draw(rt, 'py5-tree', s, W, H, tab), w = Math.hypot(p, q);
    const A = { x: p * p / w, y: -p * q / w }, B = { x: 0, y: 0 }, C = { x: w, y: 0 };
    const ab = text(b, `AB=${p}`), ac = text(b, `AC=${q}`);
    assert.ok(separate(ab, ac, 12), 'two given lengths cannot merge into one number');
    for (const [label, u, v, color] of [[ab, A, B, 'sky'], [ac, A, C, 'green']]) {
      const source = b.toS(rt.G.mid(u, v)), target = { x: label.x - (label.options.dx || 0), y: label.y };
      assert.ok(b.paths.some(path => path.options.color === color && path.points.length === 2 && distance(path.points[0], source) < 1e-7 && distance(path.points[1], target) < 1e-7), 'condition connects to the actual side midpoint');
      for (const name of ['A', 'B', 'C']) assert.ok(separate(label, text(b, name)), 'condition is separate from vertex ' + name);
    }
    visible(b, [ab, ac, text(b, 'A'), text(b, 'B'), text(b, 'C')]);
    close(rt.G.angBetween(A, B, C), 90, 'original right angle');
    assert.equal(s.pyPick, null);
    assert.doesNotMatch(b.texts.map(label => label.text).join('|'), /BC²=|AB²=|AC²=/, 'first problem/review step does not show the computed areas');
  }
});

for (const [W, H] of [[360, 307], [390, 326]]) test(`py5-tree ${W}px small square names are clear of the original triangle vertices`, () => {
  for (const theta of [25, 40, 65]) {
    const s = rt.state('py5-tree'); s.pyT1 = theta;
    const b = draw(rt, 'py5-tree', s, W, H, 'explore');
    const names = ['S₁', 'S₂', 'S₃', 'S₄'].map(name => text(b, name));
    for (const label of names) for (const name of ['A', 'B', 'C']) assert.ok(separate(label, text(b, name)), `${label.text} does not cover vertex ${name}`);
    visible(b, names);
  }
});

for (const [W, H] of compact) test(`py6-iso ${W}px x belongs to AH rather than the AC equality mark`, () => {
  for (const tab of ['problem', 'review']) {
    const s = rt.state('py6-iso'); s.pyQ = { pyIb: 14, pyIl: 25, pyKind: 0 };
    const b = draw(rt, 'py6-iso', s, W, H, tab), x = text(b, 'x');
    const A = b.toS({ x: 0, y: -24 }), Hpt = b.toS({ x: 0, y: 0 }), C = b.toS({ x: 7, y: 0 });
    assert.ok(pointSegment(x, A, Hpt) + 8 < pointSegment(x, A, C), 'unknown is visibly attached to the altitude');
    assert.ok(distance(x, rt.G.mid(A, C)) > 24, 'unknown stays clear of the same-length tick on AC');
    const altitude = b.paths.filter(path => path.options.color === 'rose' && path.points.length === 2);
    assert.ok(altitude.some(path => distance(path.points[0], A) < 1e-7));
    assert.ok(altitude.some(path => distance(path.points[1], Hpt) < 1e-7));
    assert.ok(altitude.every(path => pointSegment(x, ...path.points) >= 12), 'height line leaves the label readable');
    text(b, '14'); assert.equal(b.texts.filter(label => label.text === '25').length, 2);
    assert.ok(!b.texts.some(label => label.text === '24'), 'height answer remains hidden initially');
    visible(b); assert.equal(s.pyPick, null);
  }
});

for (const [W, H] of [[360, 307], [390, 326]]) test(`py8-quad ${W}px vertex names remain separate from both equations while rotating`, () => {
  for (const rotation of [0, 20, 45, 70, 90]) for (const values of [[3, 4, 5, 2], [1, 12, 12, 1], [12, 1, 1, 12]]) {
    const s = rt.state('py8-quad'); [s.pyQa, s.pyQb, s.pyQc, s.pyQd] = values; s.pyQr = rotation;
    const M = rt.scene('py8-quad').py.model(s), b = draw(rt, 'py8-quad', s, W, H, 'explore');
    const first = text(b, `${M.AB2}+${M.CD2}=${M.AB2 + M.CD2}`), second = text(b, `${M.DA2}+${M.BC2}=${M.DA2 + M.BC2}`);
    for (const name of ['A', 'B', 'C', 'D']) assert.ok(text(b, name).b + 5 <= first.t, 'equation is below the lowest vertex name');
    assert.ok(first.b + 2 <= second.t, 'equations remain on separate rows');
    visible(b, [first, second, ...['A', 'B', 'C', 'D'].map(name => text(b, name))]);
    close(M.AB2 + M.CD2, M.DA2 + M.BC2, 'opposite-square sums');
  }
});

test('current problem, solution stages, control changes and reentry preserve the mathematical model and reveal timing', () => {
  for (const [base, leg] of isoChips) for (const kind of [0, 1]) {
    const s = rt.state('py6-iso'); s.pyQ = { pyIb: base, pyIl: leg, pyKind: kind };
    const scene = rt.scene('py6-iso'), M = scene.py.model(rt.G.qState(s));
    close(M.hi * M.hi + M.half * M.half, M.leg * M.leg, 'height relationship');
    const problem = scene.problem.text(s), steps = plain(scene.steps(s));
    s.pyIb = 4; s.pyIl = 26;
    assert.equal(scene.problem.text(s), problem); assert.deepEqual(plain(scene.steps(s)), steps);
    for (const step of [1, 3, steps.length]) {
      s.step = step;
      const b = draw(rt, scene.id, s, 360, 291, 'review'), unknown = b.texts.some(label => label.text === 'x');
      assert.equal(unknown, step < steps.length, 'unknown is kept until the final step');
      if (kind === 0 && step === steps.length) text(b, String(M.hi));
    }
  }
  for (const id of affected) {
    const scene = rt.scene(id), s = rt.state(id), original = plain(scene.py.model(s));
    const problem = scene.problem.text(s), steps = plain(scene.steps(s));
    for (const preset of scene.presets(s)) preset.apply(s, {});
    assert.equal(scene.problem.text(s), problem); assert.deepEqual(plain(scene.steps(s)), steps);
    scene.enter(s);
    assert.deepEqual(plain(scene.py.model(s)), original, 'reentry restores the original diagram');
    assert.equal(s.playing, false); assert.equal(s.pyPick, null);
  }
});

if (arg('--compare-scope')) test('untargeted scenes, normal wide layouts and all thumbnails keep identical drawing commands and questions', t => {
  const previous = load(arg('--compare-scope')); let count = 0;
  const views = [[1039, 741, 0], [683, 613, 176], [820, 397, 58], [390, 309, 58], [360, 291, 58]];
  for (const scene of rt.scenes) {
    const s = rt.state(scene.id), old = previous.state(scene.id);
    assert.equal(scene.problem.text(s), previous.scene(scene.id).problem.text(old), scene.id + ': question');
    assert.equal(scene.problem.answer(s), previous.scene(scene.id).problem.answer(old), scene.id + ': answer');
    assert.deepEqual(plain(scene.steps(s)), plain(previous.scene(scene.id).steps(old)), scene.id + ': solution');
    for (const [W, H, bottom] of views) for (const tab of ['explore', 'problem', 'review']) {
      if (affected.includes(scene.id) && W !== 1039) continue;
      assert.deepEqual(picture(draw(rt, scene.id, s, W, H, tab, bottom)), picture(draw(previous, scene.id, old, W, H, tab, bottom)), `${scene.id}/${W}/${tab}`); count++;
    }
    assert.deepEqual(picture(draw(rt, scene.id, s, 160, 100, 'explore', 0, true)), picture(draw(previous, scene.id, old, 160, 100, 'explore', 0, true)), scene.id + ': thumbnail'); count++;
  }
  t.diagnostic(`${count} untargeted production Board frames are unchanged`);
});
