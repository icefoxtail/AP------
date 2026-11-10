/** Contracts for eight visually confirmed narrow-screen regressions.
 * Real Board coordinates complement the independent Chromium screenshots.
 * Optional: --baseline SHA (negative control), --compare-scope SHA.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const unit = 'apmath/playground/next/labs/g9-trig-ratio';
const changed = ['core', 't2', 't4', 't5', 't6', 't7', 't8'];
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = x => JSON.parse(JSON.stringify(x));
const distance = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
const near = (p, q) => distance(p, q) < 1e-6;
const exploreIds = ['cut3060', 'r5-1', 'solid3DTrig'];
const problemIds = ['r2-2', 'sasAcuteLen', 'equilFormula', 'rhombusSquare', 'brokenTreeCone'];
function load(baseline) {
  let seed = 1;
  const math = Object.create(Math); math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; };
  const context = vm.createContext({ window: {}, console, Math: math, setTimeout() {}, document: { documentElement: { dataset: {} }, getElementById() { return true; }, addEventListener() {} } });
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8']) {
    const file = `${unit}/${name}.js`, source = baseline && changed.includes(name) ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
    if (name === 'core') {
      const G = context.window.APL_TG, original = G.ang;
      G.ang = (b, V, A, B, options = {}) => {
        const ai = b.arcs.length, ti = b.texts.length, result = original(b, V, A, B, options);
        b.angles.push({ V: b.toS(V), A: b.toS(A), B: b.toS(B), world: { V, A, B }, options, arcs: b.arcs.slice(ai), texts: b.texts.slice(ti) }); return result;
      };
    }
  }
  context.window.APLab = { clamp: (x, lo, hi) => Math.max(lo, Math.min(hi, x)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const groups = context.window.APL_TG_GROUPS, scenes = groups.flatMap(g => g.scenes), defaults = Object.assign({}, ...groups.map(g => g.params));
  return { context, G: context.window.APL_TG, scenes, scene: id => scenes.find(s => s.id === id),
    state(id) { seed = [...id].reduce((n, c) => (Math.imul(n, 31) + c.charCodeAt(0)) >>> 0, 719); const s = Object.fromEntries(Object.entries(defaults).map(([k, p]) => [k, p.value])); this.scene(id).enter(s); return s; },
    case(id, predicate) { const s = this.state(id); for (let n = 0; n < 1000; n++) { if (predicate(s.q)) return s; s.q = this.scene(id).tg.gen(); } throw Error('unreached question fixture: ' + id); } };
}
const rt = load(arg('--baseline'));
function draw(rt, id, s, W, H, tab = 'problem', thumb = false, insets = {}) {
  const proto = rt.context.window.APLab.Board.prototype, b = Object.create(proto);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { left: 0, right: 0, top: 0, bottom: 58, ...insets }, zoom: 1, panX: 0, panY: 0, fs: 1,
    thumb, panes: null, paneId: null, focus: { x: [-6, 6], y: [-6, 6] }, paths: [], arcs: [], texts: [], marks: [], leaders: [], angles: [] });
  b.annotationSize = (text, options = {}) => ({ width: rt.G.textW2(text, options.size || 14) + 6, height: (options.size || 14) + 6 });
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), world: points, options }); return b; };
  b.seg = (p, q, options = {}) => b.path([p, q], options);
  b.circle = (p, r, options = {}) => { b.marks.push({ method: 'circle', at: b.toS(p), r: r * b.k, options }); return b; };
  b.arc = (p, r, a, z, options = {}) => { b.arcs.push({ at: b.toS(p), r: r * b.k, a, z, options }); return b; };
  b.text = (p, text, options = {}) => {
    const at = b.toS(p), size = (options.size || 16) * b.fs * b._ts(), width = rt.G.textW2(text, size), align = options.align || 'center';
    const x = at.x + (options.dx || 0) + (align === 'left' ? width / 2 : align === 'right' ? -width / 2 : 0), y = at.y + (options.dy || 0);
    b.texts.push({ text: String(text), x, y, p, size, width, options }); return b;
  };
  b.leader = (a, z, options) => { const start = b.paths.length, result = proto.leader.call(b, a, z, options); b.paths.slice(start).forEach(p => { p.leader = true; }); b.leaders.push({ a, z, options, result }); return result; };
  for (const name of ['right', 'ticks', 'point', 'handle']) b[name] = (...args) => { b.marks.push({ method: name, args }); return b; };
  const scene = rt.scene(id); scene.draw(b, s, {}, { tab, scene, s }); return b;
}
const bounds = points => ({ x0: Math.min(...points.map(p => p.x)), x1: Math.max(...points.map(p => p.x)), y0: Math.min(...points.map(p => p.y)), y1: Math.max(...points.map(p => p.y)) });
const fillBounds = b => bounds(b.paths.filter(p => p.options.fill).flatMap(p => p.points));
const overlapping = (a, z, gap = 0) => Math.abs(a.x - z.x) < (a.width + z.width) / 2 + gap && Math.abs(a.y - z.y) < (a.size + z.size) / 2 + gap;
const linked = (b, at, label) => b.leaders.find(l => near(l.a, at) && Math.abs(l.z.x - label.x) <= 3 && Math.abs(l.z.y - label.y) <= 1 && l.result.drawn);
function inside(b, why) {
  for (const p of b.paths.flatMap(p => p.points)) assert.ok(p.x >= -1 && p.x <= b.W + 1 && p.y >= -1 && p.y <= b.H - 58 + 1, `${why}: path outside the unoccluded canvas`);
  for (const t of b.texts) assert.ok(t.x - t.width / 2 >= -1 && t.x + t.width / 2 <= b.W + 1 && t.y - t.size / 2 >= -1 && t.y + t.size / 2 <= b.H - 58 + 1, `${why}: text clipped/under toolbar: ${t.text}`);
}
function localAngles(b, why) {
  for (const a of b.angles.filter(a => a.options.label && a.arcs.some(x => x.options.sector))) {
    const arc = a.arcs.find(x => x.options.sector), short = Math.min(distance(a.V, a.A), distance(a.V, a.B));
    assert.ok(arc.r > 0 && arc.r < short * .42, `${why}: an angle marker reaches another vertex`);
    for (const label of a.texts) assert.ok(distance(label, a.V) < Math.min(distance(label, a.A), distance(label, a.B)) || b.leaders.some(l => distance(l.z, label) < 4), `${why}: ${label.text} is nearer another vertex without a connector`);
  }
}
function fixture(rt, id) {
  if (id === 'equilFormula') return rt.case(id, q => q.fig.kind === 'S' && Math.abs(q.fig.a - 6 * Math.sqrt(3)) < 1e-7);
  if (id === 'rhombusSquare') return rt.case(id, q => q.fig.ask === 'sa' && q.fig.th === 150 && q.fig.a === 4);
  if (id === 'brokenTreeCone') return rt.case(id, q => q.fig.kind === 'H' && q.fig.th === 30 && q.fig.d === 9);
  if (id === 'sasAcuteLen') return rt.case(id, q => q.fig.beta === 30 && q.fig.a === 4 && Math.abs(q.fig.c - 2 * Math.sqrt(3)) < 1e-7);
  return rt.state(id);
}
for (const [W, EH, PH] of [[390, 411, 309], [360, 387, 291]]) {
  test(`cut3060 ${W}: complete initial triangle and altitude value stay separate from 30-degree labels`, t => {
    const s = rt.state('cut3060'), b = draw(rt, 'cut3060', s, W, EH, 'explore'), M = rt.scene('cut3060').tg.model(s), box = fillBounds(b);
    assert.ok(box.x1 - box.x0 >= 146, 'original triangle is large enough for the given values before cutting');
    const height = b.texts.find(t => t.text === rt.G.vcan(M.ah)); assert.ok(height);
    for (const a of b.texts.filter(t => t.text === '30°')) assert.ok(!overlapping(height, a, 2), 'height and 30° must not overlap');
    assert.ok(b.leaders.some(l => Math.abs(l.a.x - b.toS({ x: 0, y: 0 }).x) < 1e-7 && Math.abs(l.z.y - height.y) < 1), 'height is tied to the vertical altitude');
    inside(b, 'cut3060'); t.diagnostic(`initial base ${Number(box.x1 - box.x0).toFixed(2)}px`);
  });
  test(`r5-1 ${W}: tower height does not read as a coefficient of apex x`, () => {
    const s = rt.state('r5-1'), b = draw(rt, 'r5-1', s, W, EH, 'explore');
    const height = b.texts.find(t => t.text === '6' && t.options.color === 'rose'), x = b.texts.find(t => t.text === 'x');
    assert.ok(height && x && height.y > x.y + 24 && !overlapping(height, x, 4), 'height is visibly below the apex angle labels');
    assert.ok(b.leaders.some(l => Math.abs(l.a.x - b.toS({ x: 0, y: 0 }).x) < 1e-7 && Math.abs(l.z.y - height.y) < 1), 'height identifies the vertical tower'); inside(b, 'r5-1');
  });
  test(`solid3DTrig ${W}: angle G remains distinct from vertex F and linked to G`, () => {
    const s = rt.state('solid3DTrig'), b = draw(rt, 'solid3DTrig', s, W, EH, 'explore'), label = b.texts.find(t => t.text === '∠G'), F = b.texts.find(t => t.text === 'F');
    assert.ok(label && F && !overlapping(label, F, 8));
    const G3 = rt.G.boxVerts(6, 6, 6)[6], p = rt.G.proj3(rt.G.camOf(s), G3), at = b.toS({ x: p.x, y: p.y });
    assert.ok(linked(b, at, label), 'angle name connects to the actual G vertex'); inside(b, 'solid3DTrig');
  });
  test(`r2-2 ${W}: two reference triangles and their special-angle conditions are legible`, t => {
    const s = fixture(rt, 'r2-2'), b = draw(rt, 'r2-2', s, W, PH), triangles = b.paths.filter(p => p.options.fill && p.points.length === 3);
    assert.equal(triangles.length, 2);
    for (const tri of triangles) { const z = bounds(tri.points); assert.ok(z.y1 - z.y0 >= 65, 'each reference triangle keeps readable legs'); }
    localAngles(b, 'r2-2'); inside(b, 'r2-2'); t.diagnostic(`triangle height ${Number(bounds(triangles[0].points).y1 - bounds(triangles[0].points).y0).toFixed(2)}px`);
  });
  test(`equilFormula ${W}: three 60-degree labels identify three separate corners`, t => {
    const s = fixture(rt, 'equilFormula'), b = draw(rt, 'equilFormula', s, W, PH), z = fillBounds(b), values = b.texts.filter(t => t.text === '60°');
    assert.ok(z.y1 - z.y0 >= 115); assert.equal(values.length, 3);
    for (let i = 0; i < values.length; i++) for (let j = 0; j < i; j++) assert.ok(!overlapping(values[i], values[j], 2));
    localAngles(b, 'equilFormula'); inside(b, 'equilFormula'); assert.ok(b.texts.some(t => /x/.test(t.text))); t.diagnostic(`triangle height ${Number(z.y1 - z.y0).toFixed(2)}px`);
  });
  test(`rhombusSquare ${W}: the obtuse angle does not cover the opposite vertex`, t => {
    const s = fixture(rt, 'rhombusSquare'), b = draw(rt, 'rhombusSquare', s, W, PH), z = fillBounds(b), a = b.angles.find(a => a.arcs.some(x => x.options.sector));
    assert.ok(z.y1 - z.y0 >= 130 && z.x1 - z.x0 >= 34, 'the narrow rhombus is recognisable');
    const arc = a.arcs.find(x => x.options.sector), value = b.texts.find(t => t.text === '150°');
    assert.ok(arc.r < (z.x1 - z.x0) * .4, 'obtuse arc stays near A rather than reaching C');
    const anchor = { x: a.V.x + arc.r, y: a.V.y }; assert.ok(value && linked(b, anchor, value), '150° is connected to the actual angle at A');
    inside(b, 'rhombusSquare'); t.diagnostic(`rhombus ${Number(z.x1 - z.x0).toFixed(2)}×${Number(z.y1 - z.y0).toFixed(2)}px`);
  });
  test(`brokenTreeCone ${W}: 30 degrees stays attached to the ground contact angle`, t => {
    const s = fixture(rt, 'brokenTreeCone'), b = draw(rt, 'brokenTreeCone', s, W, PH), a = b.angles.find(a => a.arcs.some(x => x.options.sector)), arc = a.arcs.find(x => x.options.sector);
    const value = b.texts.find(t => t.text === '30°'), am = (arc.a + arc.z) / 2, anchor = { x: arc.at.x + arc.r * Math.cos(am), y: arc.at.y + arc.r * Math.sin(am) };
    assert.ok(value && linked(b, anchor, value), 'ground-contact angle has a semantic connector');
    assert.ok(value.x > a.V.x + 10, 'angle value cannot be mistaken for the left trunk angle');
    assert.ok(distance(a.V, a.B) >= 80, 'ground segment is readable'); inside(b, 'brokenTreeCone'); t.diagnostic(`ground length ${distance(a.V, a.B).toFixed(2)}px`);
  });
  test(`sasAcuteLen ${W}: the given 30 degrees belongs to B rather than C or x`, t => {
    const s = fixture(rt, 'sasAcuteLen'), b = draw(rt, 'sasAcuteLen', s, W, PH), a = b.angles.find(a => a.arcs.some(x => x.options.sector)), arc = a.arcs.find(x => x.options.sector);
    const value = b.texts.find(t => t.text === '30°'), x = b.texts.find(t => t.text === 'x'), am = (arc.a + arc.z) / 2, anchor = { x: arc.at.x + arc.r * Math.cos(am), y: arc.at.y + arc.r * Math.sin(am) };
    assert.ok(value && linked(b, anchor, value), 'the given angle has a connector to the arc at B');
    assert.ok(distance(value, a.V) < Math.min(distance(value, a.A), distance(value, a.B)) && !overlapping(value, x, 8));
    assert.ok(arc.r < Math.min(distance(a.V, a.A), distance(a.V, a.B)) * .3);
    const z = fillBounds(b); assert.ok(z.x1 - z.x0 >= 160 && z.y1 - z.y0 >= 70, 'the whole given triangle is readable');
    assert.ok(b.texts.some(t => t.text === '2√3') && b.texts.some(t => t.text === 'BC = 4')); inside(b, 'sasAcuteLen');
    t.diagnostic(`triangle ${Number(z.x1 - z.x0).toFixed(2)}×${Number(z.y1 - z.y0).toFixed(2)}px`);
  });
}
for (const [W, H, bottom, right] of [[1039, 741, 56, 16], [820, 397, 60, 0], [683, 613, 56, 16], [390, 309, 60, 0], [360, 291, 60, 0]]) {
  test(`rhombusSquare native ${W}: the 150-degree given stays clear of C and belongs to A`, () => {
    const s = fixture(rt, 'rhombusSquare'), before = JSON.stringify(s.q), b = draw(rt, 'rhombusSquare', s, W, H, 'problem', false, { bottom, right });
    const quad = b.paths.find(p => p.options.fill && p.points.length === 4), A = quad.points[0], C = quad.points[2];
    const value = b.texts.find(t => t.text === '150°');
    assert.ok(value, 'the given angle is visible before answering');
    assert.ok(Math.abs(value.x - C.x) > value.width / 2 + 10 || Math.abs(value.y - C.y) > value.size / 2 + 10, 'opposite vertex C cannot cover the angle glyph');
    assert.ok(distance(value, A) < distance(value, C) || b.leaders.some(l => distance(l.z, value) < 4 && l.result.drawn), 'the angle value belongs to A, directly or by a connector');
    for (const name of ['A', 'C']) assert.ok(!overlapping(value, b.texts.find(t => t.text === name), 4), 'angle and vertex names are distinct');
    assert.ok(value.x - value.width / 2 >= 0 && value.x + value.width / 2 <= W && value.y - value.size / 2 >= 0 && value.y + value.size / 2 <= H - bottom);
    assert.ok(b.texts.some(t => t.text === '□ABCD의 넓이 = x'), 'the requested area remains hidden');
    assert.equal(JSON.stringify(s.q), before, 'rendering preserves the question and answer');
  });
}
test('cut animation, tower dragging and generated problem/solution conditions remain intact', () => {
  const cut = rt.scene('cut3060'), s = rt.state('cut3060');
  for (const L of [2, 6, 12]) for (const progress of [0, .5, 1]) {
    s.t2L = L; s.t2s = progress; const b = draw(rt, 'cut3060', s, 360, 387, 'explore'); inside(b, 'cut variation');
    assert.equal(b.paths.filter(p => p.options.fill).length, 2); assert.equal(cut.tg.model(s).L, L); assert.equal(cut.tg.model(s).t, progress);
  }
  cut.actions(s).find(a => a.id === 'reset').run(s); assert.equal(s.t2s, 0); assert.equal(s.playing, false);
  const tower = rt.state('r5-1'), b = draw(rt, 'r5-1', tower, 360, 387, 'explore'), handle = b.marks.find(x => x.method === 'handle' && x.args[0] === 'B');
  handle.args[2].drag({ x: -8, y: 0 }); assert.equal(tower.t51b, 8); assert.equal(rt.scene('r5-1').tg.model(tower).h, 6);
  for (const id of problemIds) {
    const state = rt.state(id), sc = rt.scene(id);
    for (let n = 0; n < 24; n++) {
      if (n) state.q = sc.tg.gen(); const q = JSON.stringify(state.q);
      for (const [W, H] of [[390, 309], [360, 291]]) for (const tab of ['problem', 'review']) {
        for (const step of tab === 'problem' ? [1] : Array.from({ length: state.q.solution.steps.length }, (_, i) => i + 1)) {
          state.step = step; const board = draw(rt, id, state, W, H, tab); inside(board, `${id}/${n}/${tab}/${step}`);
          assert.equal(JSON.stringify(state.q), q, 'rendering never changes the current problem, answer or solution');
          assert.ok(!state.revealed && !state.playing && !state.answerOpen);
        }
      }
    }
  }
});
if (arg('--compare-scope')) test('only the confirmed angle callout changes in narrow rhombus questions; other frames remain identical', t => {
  const old = load(arg('--compare-scope')), picture = b => plain({ paths: b.paths, arcs: b.arcs, texts: b.texts, marks: b.marks, leaders: b.leaders }); let count = 0, angleFrames = 0;
  for (const sc of rt.scenes) for (const [W, H] of [[1039, 672], [820, 461], [683, 548], [390, 309], [360, 291]]) for (const tab of ['explore', 'problem', 'review']) {
    if (W < 560 && ((exploreIds.includes(sc.id) && tab === 'explore') || (problemIds.includes(sc.id) && tab !== 'explore'))) continue;
    const s = sc.id === 'rhombusSquare' ? fixture(rt, sc.id) : rt.state(sc.id), p = sc.id === 'rhombusSquare' ? fixture(old, sc.id) : old.state(sc.id); s.step = p.step = 1;
    const a = draw(rt, sc.id, s, W, H, tab), z = draw(old, sc.id, p, W, H, tab);
    if (sc.id === 'rhombusSquare' && [820, 683].includes(W) && tab !== 'explore') {
      const quad = a.paths.find(p => p.options.fill && p.points.length === 4), A = quad.points[0], C = quad.points[2], value = a.texts.find(t => t.text === '150°');
      const unchanged = b => plain({ paths: b.paths.filter(p => !p.leader), arcs: b.arcs.filter(r => !near(r.at, A)), texts: b.texts.filter(t => t.text !== '150°'), marks: b.marks });
      assert.deepEqual(unchanged(a), unchanged(z), 'rhombus geometry and every other annotation are preserved');
      assert.ok(value && Math.abs(value.x - C.x) > value.width / 2 + 10, 'the corrected angle cannot occupy C');
      const angle = a.angles.find(v => near(v.V, A)), arc = angle.arcs.find(r => r.options.sector);
      assert.ok(linked(a, { x: A.x + arc.r, y: A.y }, value), 'the changed callout identifies the actual angle at A');
      assert.deepEqual(plain(s.q), plain(p.q)); angleFrames++;
    } else assert.deepEqual(picture(a), picture(z), `${sc.id}/${W}/${tab}`);
    count++;
  }
  for (const id of [...exploreIds, ...problemIds]) {
    const s = rt.state(id), p = old.state(id);
    assert.deepEqual(picture(draw(rt, id, s, 240, 180, 'explore', true)), picture(draw(old, id, p, 240, 180, 'explore', true)), id + ' thumbnail');
    assert.deepEqual(plain(rt.scene(id).tg.model(s)), plain(old.scene(id).tg.model(p))); assert.deepEqual(plain(s.q), plain(p.q));
  }
  assert.equal(count, 739);
  assert.equal(angleFrames, 4);
  for (const [W, H, bottom, right] of [[1039, 741, 56, 16], [683, 613, 56, 16]]) {
    const s = fixture(rt, 'rhombusSquare'), p = fixture(old, 'rhombusSquare');
    assert.deepEqual(picture(draw(rt, 'rhombusSquare', s, W, H, 'problem', false, { bottom, right })), picture(draw(old, 'rhombusSquare', p, W, H, 'problem', false, { bottom, right })), 'native PC and landscape tablet frames remain identical');
  }
  t.diagnostic(`${count - angleFrames + 2} complete frames identical; ${angleFrames} narrow rhombus frames preserve geometry and all non-angle annotations`);
});
