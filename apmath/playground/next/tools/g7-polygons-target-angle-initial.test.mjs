// Coordinate regressions for the independently observed p4-join/p4-fan labels.
// Uses production Board projection, fraction sizing and leader clipping; font
// width is approximated here. Independent native Chromium review is required.
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
const unit = 'apmath/playground/next/labs/g7-polygons';
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = value => JSON.parse(JSON.stringify(value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const close = (a, b, why) => assert.ok(Math.abs(a - b) < 1e-7, `${why}: ${a} != ${b}`);
const angle = (v, p, q) => {
  const x = { x: p.x - v.x, y: p.y - v.y }, y = { x: q.x - v.x, y: q.y - v.y };
  return Math.atan2(Math.abs(x.x * y.y - x.y * y.x), x.x * y.x + x.y * y.y) * 180 / Math.PI;
};

function load(baseline) {
  const context = vm.createContext({ window: {}, document: { documentElement: { dataset: {} }, getElementById() {},
    createElement() { return {}; }, head: { append() {} }, addEventListener() {} } });
  for (const name of ['core', 't1', 't2', 't3', 't4']) {
    const file = `${unit}/${name}.js`;
    const source = baseline && name === 't4' ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  context.window.APLab = { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const scenes = context.window.APL_PG_GROUPS.flatMap(group => group.scenes);
  return { context, scenes, G: context.window.APL_PG, scene: id => scenes.find(scene => scene.id === id),
    state(id, patch = {}) { const s = { step: 0, revealed: false }; this.scene(id).enter(s); return Object.assign(s, patch); } };
}
const rt = load(arg('--baseline'));

function draw(runtime, id, W, H, tab, s = runtime.state(id), bottom = 58, thumb = false) {
  const b = Object.create(runtime.context.window.APLab.Board.prototype);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { top: 0, bottom, left: 0, right: 0 },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb, panes: null, paneId: null, focus: { x: [-2, 2], y: [-2, 2] },
    texts: [], points: [], arcs: [], paths: [], leaders: [], marks: [] });
  b.ctx = { font: '16px sans-serif', save() {}, restore() {},
    measureText(value) { return { width: runtime.G.textW(value, Number(this.font.match(/([\d.]+)px/)[1])) }; } };
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), world: points, options }); return b; };
  b.arc = (p, r, from, to, options = {}) => { b.arcs.push({ p, at: b.toS(p), r: r * b.k, from, to, options }); return b; };
  b.point = (p, options = {}) => { b.points.push({ p, ...b.toS(p), r: options.r || 4, options }); return b; };
  b.text = (p, value, options = {}) => {
    const q = b.toS(p), m = b.annotationSize(value, options), w = m.width - 6, h = m.height - 6;
    const x = q.x + (options.dx || 0), y = q.y + (options.dy || 0);
    const l = options.align === 'left' ? x : options.align === 'right' ? x - w : x - w / 2;
    b.texts.push({ text: String(value), p, x, y, l, r: l + w, t: y - h / 2, b: y + h / 2, options }); return b;
  };
  const leader = b.leader;
  b.leader = (anchor, label, options) => { const result = leader.call(b, anchor, label, options); b.leaders.push({ anchor, label, options, result }); return result; };
  for (const name of ['right', 'ticks', 'handle', 'circle']) b[name] = (...args) => { b.marks.push({ name, args }); return b; };
  const sc = runtime.scene(id); sc.draw(b, s, {}, { s, tab, scene: sc }); return b;
}
const overlap = (a, b) => Math.min(a.r, b.r) - Math.max(a.l, b.l) > 1 && Math.min(a.b, b.b) - Math.max(a.t, b.t) > 1;
const pointGap = (label, p) => Math.hypot(Math.max(label.l - p.x, 0, p.x - label.r), Math.max(label.t - p.y, 0, p.y - label.b)) - p.r;
function clearTarget(b, label, why) {
  assert.ok(label, `${why}: the asked angle has a label`);
  assert.ok(label.l >= 0 && label.r <= b.W && label.t >= 0 && label.b <= b.H - b.insets.bottom, `${why}: target stays inside the usable stage`);
  for (const p of b.points) assert.ok(pointGap(label, p) >= 1, `${why}: ${label.text} covers a vertex point, gap=${pointGap(label, p)}`);
  for (const other of b.texts) if (other !== label) assert.ok(!overlap(label, other), `${why}: target overlaps ${other.text}`);
  const leader = b.leaders.find(l => distance(l.label, label) < 1e-7 && l.result?.drawn);
  assert.ok(leader, `${why}: an outside label is visibly connected to its actual angle`);
  return leader;
}
function targetAt(b, vertex) {
  return b.texts.find(t => t.options.color === 'amber' && distance(t.p, vertex) < 1e-7);
}
function verifyLeaderAngle(b, leader, vertex, first, second, expected, why) {
  close(angle(vertex, first, second), expected, `${why} independent angle`);
  const p = b.toS(vertex), end = leader.result.end, dx = end.x - leader.anchor.x, dy = end.y - leader.anchor.y;
  const t = Math.max(0, Math.min(1, ((p.x - leader.anchor.x) * dx + (p.y - leader.anchor.y) * dy) / (dx * dx + dy * dy)));
  const gap = distance(p, { x: leader.anchor.x + t * dx, y: leader.anchor.y + t * dy });
  const pointRadius = Math.max(...b.points.filter(q => distance(q.p, vertex) < 1e-7).map(q => q.r));
  assert.ok(gap >= pointRadius + 1, `${why}: the leader must identify the angle instead of passing through its vertex dot`);
  if (Math.abs(expected - 90) < 1e-7) {
    const square = b.marks.find(m => m.name === 'right' && distance(m.args[0], vertex) < 1e-7 && m.args[3].color === 'amber');
    assert.ok(square, `${why}: an exact right angle retains its square marker`);
    const p = b.toS(vertex), a = b.toS(first), z = b.toS(second);
    const u = { x: (a.x - p.x) / distance(a, p) + (z.x - p.x) / distance(z, p), y: (a.y - p.y) / distance(a, p) + (z.y - p.y) / distance(z, p) };
    const length = Math.hypot(u.x, u.y), r = square.args[3].size * Math.SQRT2;
    close(distance(leader.anchor, { x: p.x + u.x / length * r, y: p.y + u.y / length * r }), 0, `${why}: leader begins at the actual right-angle square`);
    return;
  }
  const sectors = b.arcs.filter(a => a.options.sector && a.options.fill === 'amber' && distance(a.p, vertex) < 1e-7);
  assert.ok(sectors.length > 0, `${why}: the original angle still has a shaded sector`);
  const target = sectors.find(a => Math.abs(Math.abs(a.to - a.from) * 180 / Math.PI - expected) < 1e-7);
  assert.ok(target, `${why}: the displayed sector agrees with the geometric target`);
  const a = (target.from + target.to) / 2;
  close(distance(leader.anchor, { x: target.at.x + Math.cos(a) * target.r, y: target.at.y + Math.sin(a) * target.r }), 0, `${why}: leader begins on the correct arc`);
}

for (const [W, H, inquiryH] of [[360, 291, 307], [390, 309, 326]]) {
  test(`p4-join ${W}px keeps the P-angle label outside the adjacent A-angle and AB`, () => {
    for (const bottom of [58, 60]) for (const tab of ['explore', 'problem', 'review']) {
      const s = rt.state('p4-join', { step: 3 }), m = rt.scene('p4-join').pg.model(s);
      const b = draw(rt, 'p4-join', W, tab === 'explore' ? inquiryH : H, tab, s, bottom), label = targetAt(b, m.g.P);
      const leader = clearTarget(b, label, `${W}/${bottom}/${tab}`);
      assert.ok(label.r < b.toS(m.g.P).x - 20, 'P target stays outside the polygon instead of resembling AB or an A-angle value');
      verifyLeaderAngle(b, leader, m.g.P, m.g.Q, m.g.A, m.base, 'P target');
      assert.equal(label.text, tab === 'problem' ? 'x' : `${rt.G.fracText(m.base)}°`);
    }
  });
  test(`p4-fan ${W}px keeps x separate from vertex C and links it to the A-angle`, t => {
    for (const bottom of [58, 60]) {
      const s = rt.state('p4-fan'), m = rt.scene('p4-fan').pg.model(s), b = draw(rt, 'p4-fan', W, H, 'problem', s, bottom);
      const label = b.texts.find(t => t.text === 'x'), leader = clearTarget(b, label, `${W}/${bottom}`);
      verifyLeaderAngle(b, leader, m.at(0), m.at(1), m.at(m.k + 1), m.kk, 'A target');
      const shortestSide = distance(b.toS(m.at(0)), b.toS(m.at(1)));
      assert.ok(b.arcs.filter(a => a.options.sector && a.options.fill === 'amber').every(a => a.r < .8 * shortestSide), 'the target arc fits on its actual short side');
      assert.ok(!b.texts.some(t => t.text === `${rt.G.fracText(m.kk)}°`), 'the answer stays unknown');
      t.diagnostic(`x-to-C-point clearance ${pointGap(label, b.points.find(p => distance(p.p, m.at(2)) < 1e-7)).toFixed(2)}px`);
    }
  });
}

test('all joining polygons and every selectable fan vertex preserve separate target labels and exact angles', () => {
  for (const W of [360, 390]) {
    const H = W === 360 ? 291 : 309, inquiryH = W === 360 ? 307 : 326;
    for (let n = 3; n <= 8; n++) for (let m = 3; m <= 8; m++) {
      const s = rt.state('p4-join', { pgJn: n, pgJm: m, step: 3 }), model = rt.scene('p4-join').pg.model(s);
      if (!model.valid) continue;
      close(angle(model.g.P, model.g.Q, model.g.A), model.base, 'joined polygons retain the actual base angle');
      for (const tab of ['explore', 'problem', 'review']) {
        const b = draw(rt, 'p4-join', W, tab === 'explore' ? inquiryH : H, tab, s);
        clearTarget(b, targetAt(b, model.g.P), `join ${n}/${m}/${W}/${tab}`);
      }
    }
    for (let n = 5; n <= 12; n++) for (let v = 0; v < n; v++) for (let k = 2; k <= Math.min(4, n - 2); k++) {
      const s = rt.state('p4-fan', { pgFn: n, pgFv: v, pgFk: k }), model = rt.scene('p4-fan').pg.model(s);
      const b = draw(rt, 'p4-fan', W, H, 'problem', s), label = b.texts.find(t => t.text === 'x');
      const leader = clearTarget(b, label, `fan ${n}/${v}/${k}/${W}`);
      verifyLeaderAngle(b, leader, model.at(0), model.at(1), model.at(k + 1), model.kk, `fan ${n}/${v}/${k}`);
      assert.equal(rt.scene('p4-fan').pg.prob(model).choices.filter(c => c.ok).length, 1);
    }
  }
});

test('initial solution, animation, reset and reentry preserve the original geometry and answer stages', () => {
  for (const id of ['p4-join', 'p4-fan']) {
    const sc = rt.scene(id), s = rt.state(id), originalModel = plain(sc.pg.model(s)), question = plain(sc.pg.prob(sc.pg.model(s)));
    for (const step of [0, 1]) {
      s.step = step; const b = draw(rt, id, 360, 291, 'review', s);
      assert.ok(!b.texts.some(t => t.text === 'x'), 'the original initial construction step does not disclose a target value');
      if (id === 'p4-join') assert.ok(!targetAt(b, sc.pg.model(s).g.P), 'P-angle answer appears only at its existing final stage');
    }
    s.step = sc.steps(s).length; const end = draw(rt, id, 360, 291, 'review', s);
    assert.ok(end.texts.some(t => t.text.includes(id === 'p4-join' ? '∠APQ' : '∠BAD')), 'the original final relation remains available');
    if (id === 'p4-join') {
      for (const value of [0, .45, 1]) {
        s.pgJt = value; const b = draw(rt, id, 360, 307, 'explore', s);
        assert.equal(b.paths.filter(p => p.options.close && p.options.color === 'ink').length, 2, 'both original regular polygons remain visible throughout the animation');
        if (value < .8) assert.ok(!targetAt(b, sc.pg.model(s).g.P), 'no target on the unjoined moving shapes');
      }
      sc.actions().find(a => a.id === 'reset').run(s);
      assert.equal(s.pgJt, 0); assert.equal(s.playing, false);
      sc.enter(s); assert.equal(s.pgJt, 1, 'reentry keeps the original registered starting arrangement');
    }
    assert.deepEqual(plain(sc.pg.model(s)), originalModel);
    assert.deepEqual(plain(sc.pg.prob(sc.pg.model(s))), question);
    assert.equal(s.revealed, false, 'rendering never opens the answer');
  }
});

if (arg('--compare-scope')) test('wide views, thumbnails, unrelated scenes, all models and original contours remain unchanged', () => {
  const previous = load(arg('--compare-scope'));
  const picture = b => plain({ paths: b.paths, arcs: b.arcs, points: b.points, texts: b.texts, marks: b.marks, leaders: b.leaders });
  for (const sc of rt.scenes) {
    const s = rt.state(sc.id), z = previous.state(sc.id), old = previous.scene(sc.id);
    assert.deepEqual(plain(sc.pg.model(s)), plain(old.pg.model(z)), `${sc.id} model`);
    assert.deepEqual(plain(sc.pg.prob(sc.pg.model(s))), plain(old.pg.prob(old.pg.model(z))), `${sc.id} problem`);
    assert.deepEqual(plain(sc.steps(s)), plain(old.steps(z)), `${sc.id} solution`);
    for (const [W, H] of [[1039, 643], [820, 461], [683, 435], [390, 309], [360, 291]]) for (const tab of ['explore', 'problem', 'review']) {
      const b = draw(rt, sc.id, W, H, tab, s), a = draw(previous, sc.id, W, H, tab, z);
      const changed = W < 560 && ((sc.id === 'p4-join' && tab !== 'review') || (sc.id === 'p4-fan' && tab === 'problem'));
      if (!changed) assert.deepEqual(picture(b), picture(a), `${sc.id}/${W}/${tab}`);
      else {
        const contours = b => plain(b.paths.filter(p => p.options.color !== 'muted'));
        assert.deepEqual(contours(b), contours(a), 'original contour, diagonal and shade geometry retained');
        assert.deepEqual(plain(b.points), plain(a.points), 'all original vertices retained');
        assert.deepEqual(plain(b.marks), plain(a.marks), 'drag handles and equal-side marks retained');
      }
    }
    assert.deepEqual(picture(draw(rt, sc.id, 240, 180, 'explore', s, 0, true)), picture(draw(previous, sc.id, 240, 180, 'explore', z, 0, true)), `${sc.id} thumbnail`);
  }
});
