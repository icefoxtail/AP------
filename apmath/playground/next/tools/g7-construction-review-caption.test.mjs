// Coordinate regression for the actually observed c6-3 review caption clipping.
// Production Board projection is used; conservative font boxes supplement the
// separate native Chromium visual gate. No browser result is inferred here.
// Negative control: node this-file.mjs --baseline <commit>
// Unchanged scope: node this-file.mjs --compare-scope <commit>
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const unit = 'apmath/playground/next/labs/g7-construction';
const changed = new Set(['t6']);
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = value => JSON.parse(JSON.stringify(value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const overlap = (a, b, gap = 0) => Math.min(a.r, b.r) - Math.max(a.l, b.l) > -gap && Math.min(a.b, b.b) - Math.max(a.t, b.t) > -gap;

function load(baseline) {
  const context = vm.createContext({ window: {}, document: { documentElement: { dataset: {} }, getElementById() {},
    createElement() { return {}; }, head: { append() {} }, addEventListener() {} } });
  vm.runInContext('let seed=81273; Math.random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}', context);
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6']) {
    const file = `${unit}/${name}.js`;
    const source = baseline && changed.has(name)
      ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' })
      : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  context.window.APLab = { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const scenes = context.window.APL_CN_GROUPS.flatMap(group => group.scenes);
  return { context, scenes, G: context.window.APL_CN, scene: id => scenes.find(scene => scene.id === id),
    state(id, patch = {}) { const s = { step: 0, revealed: false }; this.scene(id).enter(s); return Object.assign(s, patch); } };
}
const rt = load(arg('--baseline'));

function draw(runtime, id, W, H, tab = 'explore', patch = {}, bottom = 58) {
  const b = Object.create(runtime.context.window.APLab.Board.prototype);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { top: 0, bottom, left: 0, right: 0 },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb: false, panes: null, paneId: null,
    focus: { x: [-2, 2], y: [-2, 2] }, texts: [], points: [], arcs: [], paths: [], marks: [], handles: [] });
  const fonts = [];
  b.font = 'sans-serif';
  b.ctx = { font: '13px sans-serif', save() { fonts.push(this.font); }, restore() { this.font = fonts.pop(); },
    measureText(text) { const size = Number(this.font.match(/([\d.]+)px/)[1]);
      return { width: [...String(text)].reduce((n, ch) => n + size * (/\s/.test(ch) ? .32 : ch.charCodeAt(0) >= 0x1100 ? 1 : .70), 0) }; } };
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), world: plain(points), options }); return b; };
  b.arc = (p, radius, from, to, options = {}) => { b.arcs.push({ p: plain(p), at: b.toS(p), radius: radius * b.k, from, to, options }); return b; };
  b.point = (p, options = {}) => { b.points.push({ p: plain(p), ...b.toS(p), r: options.r || 4, options }); return b; };
  b.text = (p, value, options = {}) => {
    const q = b.toS(p), text = String(value), size = (options.size || 13) * b.fs * b._ts();
    // Slightly wider Latin bounds include the heavy font's side bearings.
    const width = [...text].reduce((sum, ch) => sum + size * (/\s/.test(ch) ? .32 : ch.charCodeAt(0) >= 0x1100 ? 1 : .70), 0);
    const x = q.x + (options.dx || 0), y = q.y + (options.dy || 0), l = options.align === 'left' ? x : options.align === 'right' ? x - width : x - width / 2;
    b.texts.push({ text, p: plain(p), x, y, l, r: l + width, t: y - size / 2, b: y + size / 2, options }); return b;
  };
  for (const name of ['right', 'ticks', 'circle', 'leader']) b[name] = (...args) => { b.marks.push({ name, args: plain(args) }); return b; };
  b.handle = (id, p, options) => { b.handles.push({ id, p: plain(p), at: b.toS(p), options }); return b; };
  const sc = runtime.scene(id), s = runtime.state(id, patch), lab = { s, tab, scene: sc };
  let v = sc.view(s, lab);
  // A generated question first establishes its own key; only then does the
  // student select a review step. Respect the production reset at that boundary.
  if (tab === 'review') { s.step = patch.step || 1; v = sc.view(s, lab); }
  sc.draw(b, s, v, lab);
  b.state = s; return b;
}
const named = (b, text) => { const t = b.texts.find(t => t.text === text); assert.ok(t, `missing ${text}`); return t; };
const allNamed = (b, text) => b.texts.filter(t => t.text === text);
function clear(label, others, why) {
  for (const other of others) if (label !== other) assert.ok(!overlap(label, other, 1), `${why}: ${label.text} overlaps ${other.text}`);
}
function inside(label, b, why) {
  assert.ok(label.l >= 2 && label.r <= b.W - 2 && label.t >= 2 && label.b <= b.H - b.insets.bottom - 2,
    `${why}: ${label.text} extends beyond the usable canvas: ${JSON.stringify({ l: label.l, r: label.r, t: label.t, b: label.b })}`);
}


const questions = [
  ...[40, 25, 30, 35, 45, 50, 55, 60, 65, 70, 75].map(th => ({ kind: 0, x: 4, k: 2, m: 1, n: 9, th, p: 2, q: 10, k0: 0 })),
  { kind: 1, p: 2, x: 4, q: 17, th: 25, k0: 0 },
  { kind: 1, p: 4, x: 8, q: 8, th: 40, k0: 0 },
  { kind: 1, p: 4, x: 12, q: 17, th: 65, k0: 0 }
];

for (const [W, H] of [[360, 387], [390, 411]]) {
  test(`c6-3 review step2 keeps the common-angle explanation inside ${W}px`, () => {
    for (const cnPk of questions) {
      const b = draw(rt, 'c6-3', W, H, 'review', { step: 2, cnPk });
      const captions = b.texts.filter(t => /BAE|90°/.test(t.text));
      assert.ok(captions.length, 'the angle relation must remain visible');
      const text = captions.map(t => t.text).join(' ');
      for (const required of ['∠BAE', '∠DAG', '90°', '∠EAD', `${cnPk.th}°`]) assert.ok(text.includes(required), `missing mathematical explanation ${required}`);
      for (const label of captions) {
        inside(label, b, `review step2 angle ${cnPk.th}`);
        clear(label, captions, 'caption rows');
        assert.ok(label.t > Math.max(...b.texts.filter(t => /^[AB]$/.test(t.text)).map(t => t.b)) + 5, 'caption remains below A and B');
      }
      assert.equal(b.state.revealed, false, 'the answer disclosure state is unchanged');
      assert.equal(b.state.cnKt, 0, 'the relation step precedes the rotation');
    }
  });
}

test('c6-3 caption does not change the two square shapes or the problem answer', () => {
  for (const cnPk of questions) {
    const b = draw(rt, 'c6-3', 360, 387, 'review', { step: 2, cnPk });
    const squares = b.paths.filter(p => p.options.close && p.world.length === 4 && p.options.color === 'ink');
    assert.equal(squares.length, 2, 'both complete original squares are drawn');
    for (const square of squares) {
      const edges = square.world.map((p, i) => ({ x: square.world[(i + 1) % 4].x - p.x, y: square.world[(i + 1) % 4].y - p.y }));
      const lengths = edges.map(e => Math.hypot(e.x, e.y));
      for (let i = 0; i < 4; i++) {
        assert.ok(Math.abs(lengths[i] - lengths[0]) < 1e-8, 'square sides stay equal');
        assert.ok(Math.abs(edges[i].x * edges[(i + 1) % 4].x + edges[i].y * edges[(i + 1) % 4].y) < 1e-8, 'square angles remain right angles');
      }
    }
    assert.equal(cnPk.kind ? cnPk.p * cnPk.x + cnPk.q : cnPk.k * cnPk.x + cnPk.m, cnPk.kind ? cnPk.th : cnPk.n, 'sample problem equation remains exact');
    assert.ok(!b.texts.some(t => /x\s*=/.test(t.text)), 'step2 does not reveal the final x solution');
  }
});

const compare = arg('--compare-scope');
if (compare) {
  const old = load(compare);
  const shapes = b => plain({ paths: b.paths, points: b.points, arcs: b.arcs, marks: b.marks, handles: b.handles.map(h => ({ id: h.id, p: h.p, at: h.at })) });
  test('c6-3 geometry, state, question and every unrelated caption stay unchanged', () => {
    for (const cnPk of questions) {
      const a = rt.state('c6-3', { cnPk }), z = old.state('c6-3', { cnPk });
      assert.deepEqual(plain(a), plain(z));
      const m = rt.scene('c6-3').cn.model(a), n = old.scene('c6-3').cn.model(z);
      assert.deepEqual(plain(m), plain(n));
      assert.deepEqual(plain(rt.scene('c6-3').cn.prob(m)), plain(old.scene('c6-3').cn.prob(n)));
      assert.deepEqual(plain(rt.scene('c6-3').cn.steps(m)), plain(old.scene('c6-3').cn.steps(n)));
      for (const [W, H] of [[360, 387], [390, 411], [623, 448], [820, 740], [1039, 676]]) {
        for (const tab of ['explore', 'problem', 'review']) for (const step of tab === 'review' ? [1, 2, 3, 4] : [0]) {
          const x = draw(rt, 'c6-3', W, H, tab, { cnPk, step }), y = draw(old, 'c6-3', W, H, tab, { cnPk, step });
          assert.deepEqual(shapes(x), shapes(y), `${W}/${tab}/${step} geometry`);
          assert.deepEqual(plain(x.state), plain(y.state));
          if (!(W < 560 && tab === 'review' && step === 2)) assert.deepEqual(plain(x.texts), plain(y.texts), `${W}/${tab}/${step} unrelated text`);
        }
      }
    }
  });
}
