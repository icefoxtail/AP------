// Regression for the actual 390x844 target-risk-15 review capture: the final
// 30-degree P-angle callout left the canvas. Use production Board projection,
// annotation sizing (including fractions), angle marks and leader clipping.
// Font widths are a deterministic approximation; final Chromium visual review
// remains required. Negative control: node this-file.mjs --baseline <commit>.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const unit = 'apmath/playground/next/labs/g7-polygons';
const arg = name => { const at = process.argv.indexOf(name); return at < 0 ? null : process.argv[at + 1]; };
const plain = value => JSON.parse(JSON.stringify(value));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const near = (a, b, why) => assert.ok(Math.abs(a - b) < 1e-7, `${why}: ${a} != ${b}`);

function load(commit) {
  const context = vm.createContext({ window: {}, document: { documentElement: { dataset: {} }, getElementById() {},
    createElement() { return {}; }, head: { append() {} }, addEventListener() {} } });
  for (const name of ['core', 't1', 't2', 't3', 't4']) {
    const file = `${unit}/${name}.js`;
    const code = commit && name === 't4'
      ? execFileSync('git', ['show', `${commit}:${file}`], { cwd: root, encoding: 'utf8' })
      : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(code, context, { filename: file });
  }
  context.window.APLab = { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const scenes = context.window.APL_PG_GROUPS.flatMap(group => group.scenes);
  return { context, G: context.window.APL_PG, scenes, scene: id => scenes.find(sc => sc.id === id),
    state(id, values = {}) { const s = { step: 0, revealed: false }; this.scene(id).enter(s); return Object.assign(s, values); } };
}

const current = load(arg('--baseline'));
function draw(runtime, id, dimensions, tab, state) {
  const { W, H, bottom = 60, left = 0, right = 0, thumb = false, fontScale = 1 } = dimensions;
  const b = Object.create(runtime.context.window.APLab.Board.prototype);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { top: 0, bottom, left, right },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb, panes: null, paneId: null, focus: { x: [-2, 2], y: [-2, 2] },
    texts: [], points: [], arcs: [], paths: [], leaders: [], marks: [] });
  b.ctx = { font: '16px sans-serif', save() {}, restore() {}, measureText(value) {
    const size = Number(this.font.match(/([\d.]+)px/)[1]);
    // This one measured value reproduces the reported 30-degree Chromium box.
    return { width: fontScale * (String(value) === '30°' ? 26.6015625 * size / 15 : runtime.G.textW(value, size)) };
  } };
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), world: points, options }); return b; };
  b.arc = (p, radius, from, to, options = {}) => { b.arcs.push({ p, at: b.toS(p), radius: radius * b.k, from, to, options }); return b; };
  b.point = (p, options = {}) => { b.points.push({ p, ...b.toS(p), radius: options.r || 4, options }); return b; };
  b.text = (p, value, options = {}) => {
    const at = b.toS(p), size = b.annotationSize(value, options), w = size.width - 6, h = size.height - 6;
    const x = at.x + (options.dx || 0), y = at.y + (options.dy || 0);
    const l = options.align === 'left' ? x : options.align === 'right' ? x - w : x - w / 2;
    b.texts.push({ text: String(value), p, x, y, l, r: l + w, t: y - h / 2, b: y + h / 2, options }); return b;
  };
  const leader = b.leader;
  b.leader = (anchor, label, options) => {
    const result = leader.call(b, anchor, label, options);
    b.leaders.push({ anchor, label, options, result }); return result;
  };
  for (const name of ['right', 'ticks', 'handle', 'circle']) b[name] = (...args) => { b.marks.push({ name, args }); return b; };
  const scene = runtime.scene(id);
  scene.draw(b, state, {}, { s: state, tab, scene });
  return b;
}

const targetAt = (b, p) => b.texts.find(t => t.options.color === 'amber' && dist(t.p, p) < 1e-7);
const overlaps = (a, b) => Math.min(a.r, b.r) > Math.max(a.l, b.l) + 1 && Math.min(a.b, b.b) > Math.max(a.t, b.t) + 1;
function verifyTarget(runtime, state, b, tab, why) {
  const m = runtime.scene('p4-join').pg.model(state), label = targetAt(b, m.g.P);
  assert.ok(label, `${why}: target angle is still displayed`);
  assert.equal(label.text, tab === 'problem' ? 'x' : `${runtime.G.fracText(m.base)}°`);
  assert.ok(label.l >= b.insets.left + 4 && label.r <= b.W - b.insets.right - 4,
    `${why}: complete angle label must stay inside the canvas: ${JSON.stringify(label)}`);
  assert.ok(label.t >= 4 && label.b <= b.H - b.insets.bottom - 4, `${why}: complete label stays above the toolbar`);
  for (const other of b.texts) if (other !== label) assert.ok(!overlaps(label, other), `${why}: target overlaps ${other.text}`);
  for (const point of b.points) {
    const gap = Math.hypot(Math.max(label.l - point.x, 0, point.x - label.r), Math.max(label.t - point.y, 0, point.y - label.b));
    assert.ok(gap > point.radius + 1, `${why}: target covers a vertex`);
  }
  const leader = b.leaders.find(item => dist(item.label, label) < 1e-7);
  assert.ok(leader?.result.drawn, `${why}: the callout visibly identifies its original angle`);
  const a = { x: m.g.A.x - m.g.P.x, y: m.g.A.y - m.g.P.y };
  const q = { x: m.g.Q.x - m.g.P.x, y: m.g.Q.y - m.g.P.y };
  const independentAngle = Math.atan2(Math.abs(a.x * q.y - a.y * q.x), a.x * q.x + a.y * q.y) * 180 / Math.PI;
  near(independentAngle, m.base, `${why}: geometric angle agrees with its displayed value`);
  const arc = b.arcs.find(item => dist(item.p, m.g.P) < 1e-7 && item.options.sector && item.options.fill === 'amber');
  assert.ok(arc, `${why}: target keeps its original shaded angle marker`);
  near(Math.abs(arc.to - arc.from) * 180 / Math.PI, independentAngle, `${why}: marker represents the same P-angle`);
  const middle = (arc.from + arc.to) / 2;
  near(dist(leader.anchor, { x: arc.at.x + Math.cos(middle) * arc.radius, y: arc.at.y + Math.sin(middle) * arc.radius }), 0,
    `${why}: leader begins on the P-angle arc, not A or AB`);
  assert.equal(b.paths.filter(p => p.options.close && p.options.color === 'ink').length, 2, `${why}: both original polygons remain visible`);
  return label;
}

for (const [W, H] of [[390, 411], [360, 387]]) test(`p4-join ${W}px final 3+3 polygon review keeps the complete 30-degree callout`, t => {
  const state = current.state('p4-join', { pgJn: 3, pgJm: 3, pgJl: 4, step: 3 });
  const board = draw(current, 'p4-join', { W, H }, 'review', state);
  const label = verifyTarget(current, state, board, 'review', `${W}x${H}/3+3`);
  t.diagnostic(`actual-sized target box [${label.l.toFixed(3)}, ${label.r.toFixed(3)}] × [${label.t.toFixed(3)}, ${label.b.toFixed(3)}]`);
});

test('every valid joining pair keeps its callout in the usable stage at short and tall mobile heights', () => {
  const profiles = [{ W: 360, H: 291, bottom: 58 }, { W: 390, H: 309, bottom: 58 },
    { W: 360, H: 387 }, { W: 390, H: 411 }, { W: 390, H: 620 }, { W: 559, H: 700, left: 8, right: 16 }];
  for (const dimensions of profiles) for (let n = 3; n <= 8; n++) for (let m = 3; m <= 8; m++) {
    for (const length of [2, 4, 8]) for (const tab of ['explore', 'problem', 'review']) {
      const state = current.state('p4-join', { pgJn: n, pgJm: m, pgJl: length, step: 3 });
      if (!current.scene('p4-join').pg.model(state).valid) continue;
      const before = plain(state), board = draw(current, 'p4-join', dimensions, tab, state);
      verifyTarget(current, state, board, tab, `${dimensions.W}x${dimensions.H}/${n}+${m}/${length}/${tab}`);
      assert.deepEqual(plain(state), before, 'placing a callout must not mutate lesson state');
    }
  }
});

test('measured wider glyphs and fractional angle values also stay in bounds', () => {
  for (const [n, m] of [[3, 3], [3, 7], [5, 7], [7, 8], [8, 8]]) for (const W of [360, 390]) {
    const state = current.state('p4-join', { pgJn: n, pgJm: m, step: 3 });
    const board = draw(current, 'p4-join', { W, H: 411, fontScale: 1.25 }, 'review', state);
    verifyTarget(current, state, board, 'review', `${W}/${n}+${m}/wide-font`);
  }
});

test('problem unknown, review disclosure, joining animation and reset preserve their existing stages', () => {
  const scene = current.scene('p4-join');
  for (const [n, m] of [[3, 3], [5, 5], [5, 7]]) {
    const state = current.state('p4-join', { pgJn: n, pgJm: m, pgJl: 4 });
    const model = plain(scene.pg.model(state)), problem = plain(scene.pg.prob(scene.pg.model(state)));
    const initial = draw(current, 'p4-join', { W: 390, H: 411 }, 'problem', state);
    assert.equal(targetAt(initial, scene.pg.model(state).g.P).text, 'x', 'the question retains its unknown');
    for (const step of [0, 1, 2]) {
      state.step = step;
      const board = draw(current, 'p4-join', { W: 390, H: 411 }, 'review', state);
      assert.equal(targetAt(board, scene.pg.model(state).g.P), undefined, 'the target value is not disclosed before the final step');
    }
    state.step = 3;
    verifyTarget(current, state, draw(current, 'p4-join', { W: 390, H: 411 }, 'review', state), 'review', 'existing final step');
    for (const progress of [0, .4, .7]) {
      state.pgJt = progress;
      const board = draw(current, 'p4-join', { W: 390, H: 411 }, 'explore', state);
      assert.equal(targetAt(board, scene.pg.model(state).g.P), undefined, 'unjoined polygons do not display the joined target');
      assert.equal(board.paths.filter(p => p.options.close && p.options.color === 'ink').length, 2);
    }
    scene.actions().find(action => action.id === 'reset').run(state);
    assert.equal(state.pgJt, 0); assert.equal(state.playing, false); assert.equal(state.revealed, false);
    assert.deepEqual(plain(scene.pg.model(state)), model);
    assert.deepEqual(plain(scene.pg.prob(scene.pg.model(state))), problem);
  }
});

if (arg('--compare-scope')) test('unaffected scenes, wide screens, thumbnails and all mathematical content are identical', () => {
  const previous = load(arg('--compare-scope'));
  const picture = b => plain({ paths: b.paths, arcs: b.arcs, points: b.points, texts: b.texts, marks: b.marks, leaders: b.leaders });
  for (const scene of current.scenes) for (const dimensions of [{ W: 1039, H: 643 }, { W: 820, H: 620 },
    { W: 683, H: 435 }, { W: 390, H: 411 }, { W: 360, H: 387 }, { W: 240, H: 180, bottom: 0, thumb: true }]) {
    for (const tab of ['explore', 'problem', 'review']) {
      const state = current.state(scene.id, { step: 3 }), oldState = previous.state(scene.id, { step: 3 });
      const oldScene = previous.scene(scene.id);
      assert.deepEqual(plain(scene.pg.model(state)), plain(oldScene.pg.model(oldState)), `${scene.id} model`);
      assert.deepEqual(plain(scene.pg.prob(scene.pg.model(state))), plain(oldScene.pg.prob(oldScene.pg.model(oldState))), `${scene.id} problem`);
      assert.deepEqual(plain(scene.steps(state)), plain(oldScene.steps(oldState)), `${scene.id} solution`);
      const now = draw(current, scene.id, dimensions, tab, state), before = draw(previous, scene.id, dimensions, tab, oldState);
      if (scene.id !== 'p4-join' || dimensions.W >= 560 || dimensions.thumb) assert.deepEqual(picture(now), picture(before), `${scene.id}/${dimensions.W}/${tab}`);
      else {
        const contours = b => plain(b.paths.filter(p => p.options.color !== 'muted'));
        assert.deepEqual(contours(now), contours(before), 'unchanged original contours and construction lines');
        assert.deepEqual(plain(now.arcs), plain(before.arcs), 'unchanged actual angle marks');
        assert.deepEqual(plain(now.points), plain(before.points), 'unchanged named vertices');
        assert.deepEqual(plain(now.marks), plain(before.marks), 'unchanged equal-side marks and handles');
      }
    }
  }
});
