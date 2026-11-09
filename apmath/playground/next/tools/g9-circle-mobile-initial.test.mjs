/** Real Board coordinates for the six observed mobile problem regressions.
 * These contracts complement, and do not replace, independent Chromium review.
 * node tools/g9-circle-mobile-initial.test.mjs --baseline <before SHA>
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const unit = 'apmath/playground/next/labs/g9-circle';
const baselineAt = process.argv.indexOf('--baseline');
const baseline = baselineAt < 0 ? null : process.argv[baselineAt + 1];
const scopeAt = process.argv.indexOf('--compare-scope');
const scopeBaseline = scopeAt < 0 ? null : process.argv[scopeAt + 1];
const affected = ['c2-2', 'c4-3', 'c4-5', 'c4-6', 'c4-8', 'c5-3'];
const changedFiles = ['core', 't4'];
const plain = value => JSON.parse(JSON.stringify(value));
const distance = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
const same = (p, q) => distance(p, q) < 1e-7;
function load(before = null) {
  const context = vm.createContext({ window: {}, console, document: { documentElement: { dataset: {} },
    getElementById() {}, createElement() { return {}; }, head: { append() {} }, addEventListener() {} } });
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 'solutions']) {
    const file = `${unit}/${name}.js`;
    const source = before && changedFiles.includes(name) ? execFileSync('git', ['show', `${before}:${file}`], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
    if (name === 'core') {
      const G = context.window.APL_CI, original = G.ang;
      G.ang = (b, V, A, B, options = {}) => {
        const start = b.arcs.length, result = original(b, V, A, B, options);
        b.angles.push({ V: b.toS(V), A: b.toS(A), B: b.toS(B), world: { V, A, B }, options, arcs: b.arcs.slice(start), activeLayout: b.ciMobileProblem });
        return result;
      };
    }
  }
  context.window.APLab = { clamp: (value, lo, hi) => Math.max(lo, Math.min(hi, value)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const groups = context.window.APL_CI_GROUPS, scenes = groups.flatMap(group => group.scenes);
  const defaults = Object.assign({}, ...groups.map(group => group.params));
  return { context, G: context.window.APL_CI, scenes, scene: id => scenes.find(scene => scene.id === id),
    fresh(id) { const s = Object.fromEntries(Object.entries(defaults).map(([key, p]) => [key, p.value])); this.scene(id).enter(s); return s; } };
}
const runtime = load(baseline);
function draw(rt, id, state, W, H, tab = 'problem', reuse = null, thumb = false) {
  const proto = rt.context.window.APLab.Board.prototype, b = reuse || Object.create(proto);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { left: 0, right: 0, top: 0, bottom: 58 },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb, panes: null, paneId: null, focus: { x: [-6, 6], y: [-6, 6] },
    paths: [], circles: [], arcs: [], texts: [], angles: [], leaders: [], marks: [] });
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), world: points, options }); return b; };
  b.seg = (p, q, options = {}) => b.path([p, q], options);
  b.circle = (p, r, options = {}) => { b.circles.push({ at: b.toS(p), r: r * b.k, world: p, radius: r, options }); return b; };
  b.arc = (p, r, a, z, options = {}) => { b.arcs.push({ at: b.toS(p), r: r * b.k, a, z, options }); return b; };
  b.text = (p, value, options = {}) => {
    const at = b.toS(p), size = (options.size || 16) * b.fs * b._ts(), x = at.x + (options.dx || 0), y = at.y + (options.dy || 0);
    const width = rt.G.textW(value, size), height = size;
    b.texts.push({ text: String(value), p, x, y, box: { l: x - width / 2, r: x + width / 2, t: y - height / 2, b: y + height / 2 }, options }); return b;
  };
  b.leader = (at, label, options) => { const result = proto.leader.call(b, at, label, options); b.leaders.push({ at, label, options, result }); return result; };
  for (const name of ['right', 'ticks', 'point', 'handle']) b[name] = (...args) => { b.marks.push({ name, args }); return b; };
  const scene = rt.scene(id); scene.draw(b, state, {}, { tab, scene, s: state });
  return b;
}
function inside(b, why) {
  for (const c of b.circles) assert.ok(c.at.x - c.r >= 0 && c.at.x + c.r <= b.W && c.at.y - c.r >= 0 && c.at.y + c.r <= b.H - 58, `${why}: circle clipping`);
  for (const path of b.paths) for (const p of path.points) assert.ok(p.x >= 0 && p.x <= b.W && p.y >= 0 && p.y <= b.H - 58, `${why}: path clipping`);
  for (const t of b.texts) assert.ok(t.box.l >= 0 && t.box.r <= b.W && t.box.t >= 0 && t.box.b <= b.H - 58, `${why}: label clipping ${t.text}`);
}
function angleConnections(b, why) {
  for (const angle of b.angles.filter(angle => angle.options.label && !angle.options.noMark)) {
    const { options, V, A, B } = angle, arc = angle.arcs.find(arc => arc.options.sector);
    if (!arc) continue; // A true right-angle square has its own marker.
    const short = Math.min(distance(V, A), distance(V, B));
    assert.ok(arc.r > 0 && arc.r <= short * .4, `${why}: an angle arc reaches another vertex (${arc.r}/${short})`);
    for (const ring of angle.arcs) assert.ok(ring.r > 0, `${why}: every angle ring has positive radius`);
    const text = b.texts.find(text => text.text === options.label && same(text.p, angle.world.V));
    if (!text) continue; // The final solution replaces x by its answer.
    const anchor = text.options.leaderAnchor, arcMiddle = (arc.a + arc.z) / 2;
    const expected = { x: V.x + arc.r * Math.cos(arcMiddle), y: V.y + arc.r * Math.sin(arcMiddle) };
    assert.ok(anchor && same(b.toS(anchor), expected), `${why}: ${text.text} must identify its actual angle arc`);
    const link = b.leaders.find(link => same(link.at, expected) && same(link.label, { x: text.x, y: text.y }));
    assert.ok(link, `${why}: displaced/narrow angle value ${text.text} has no semantic connector`);
    assert.equal(link.options.color, text.options.color, `${why}: connector must match the angle value's color`);
    if (!link.result.drawn) assert.ok(Math.abs(text.x - expected.x) <= link.options.width / 2 + 5 && Math.abs(text.y - expected.y) <= link.options.height / 2 + 5,
      `${why}: an omitted connector is allowed only when the value already touches its angle arc`);
  }
}
for (const [W, H] of [[390, 309], [360, 291]]) for (const id of affected) {
  test(`${id} ${W}px first problem keeps its actual angles identifiable`, t => {
    const s = runtime.fresh(id), b = draw(runtime, id, s, W, H);
    const minimum = id === 'c5-3' ? 108 : 145;
    assert.ok(b.circles[0].r * 2 >= minimum, `${id}: circle diameter ${b.circles[0].r * 2}px is too small for the observed conditions`);
    inside(b, id); angleConnections(b, id);
    assert.ok(b.texts.some(text => /(?:^x$|=x$)/.test(text.text)), 'the requested value remains unknown');
    assert.ok(!s.revealed && !s.playing && !s.answerOpen);
    assert.equal(b.ciMobileProblem, undefined, 'frame-specific layout must not leak into another draw');
    t.diagnostic(`circle diameter ${Number(b.circles[0].r * 2).toFixed(2)}px; ${b.angles.length} actual angle markers`);
  });
}
test('all six problem families preserve question geometry and staged answers on both short mobile boards', () => {
  for (const id of affected) for (let seed = 0; seed < 30; seed++) {
    const scene = runtime.scene(id), s = runtime.fresh(id); s.ciPk = scene.ci.gen(runtime.G.seeded(`mobile-initial|${id}|${seed}`), seed);
    const key = JSON.stringify(s.ciPk), solution = scene.solution(s);
    assert.ok(Math.abs(solution.value - solution.question.chk[1]) < 1e-7, `${id}: existing mathematical answer retained`);
    for (const [W, H] of [[390, 309], [360, 291]]) {
      s.step = 1; const problem = draw(runtime, id, s, W, H), review = draw(runtime, id, s, W, H, 'review');
      for (const b of [problem, review]) { inside(b, `${id}/${seed}`); angleConnections(b, `${id}/${seed}`); }
      assert.deepEqual(plain(review.circles), plain(problem.circles), `${id}: first solution keeps the same circle`);
      assert.deepEqual(plain(review.texts), plain(problem.texts), `${id}: first solution keeps givens and unknowns`);
      s.step = solution.steps.length; const final = draw(runtime, id, s, W, H, 'review'); inside(final, `${id}/${seed}/final`);
      assert.ok(!final.texts.some(text => /(?:^x$|=x$)/.test(text.text)), `${id}: the final stage still resolves the unknown`);
      assert.equal(JSON.stringify(s.ciPk), key, `${id}: rendering never mutates the current question`);
      assert.ok(!s.revealed && !s.playing && !s.answerOpen);
    }
  }
});
test('the six-scene override leaves exploration, thumbnails, wider screens and all other scenes unchanged', () => {
  // CI needs no Git history. Reuse a board that has just rendered an affected
  // problem and compare its next draw with a fresh board. The optional local
  // --compare-scope SHA also checks every result against the previous source.
  const before = scopeBaseline ? load(scopeBaseline) : runtime;
  const picture = b => plain({ circles: b.circles, paths: b.paths, arcs: b.arcs, texts: b.texts, marks: b.marks });
  for (const scene of runtime.scenes) for (const [W, H] of [[360, 291], [390, 309], [683, 476], [1040, 606]]) for (const tab of ['problem', 'review', 'explore']) {
    if (W < 560 && tab !== 'explore' && affected.includes(scene.id)) continue;
    const s = runtime.fresh(scene.id), old = before.fresh(scene.id); s.step = old.step = 1;
    const reused = draw(runtime, 'c4-3', runtime.fresh('c4-3'), 360, 291), actual = draw(runtime, scene.id, s, W, H, tab, reused);
    assert.ok(actual.angles.every(angle => !angle.activeLayout), `${scene.id}/${W}/${tab}: angle override escaped its scope`);
    assert.deepEqual(picture(actual), picture(draw(before, scene.id, old, W, H, tab)), `${scene.id}/${W}/${tab}: out-of-scope render changed`);
  }
  for (const id of affected) {
    const s = runtime.fresh(id), b = draw(runtime, id, s, 360, 291);
    assert.deepEqual(picture(draw(runtime, id, s, 360, 291, 'explore', b)), picture(draw(before, id, before.fresh(id), 360, 291, 'explore')), `${id}: returning to exploration retains its framing`);
    assert.deepEqual(picture(draw(runtime, id, s, 240, 180, 'explore', null, true)), picture(draw(before, id, before.fresh(id), 240, 180, 'explore', null, true)), `${id}: thumbnail unchanged`);
  }
});
