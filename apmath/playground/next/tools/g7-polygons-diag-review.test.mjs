// Production Board checks for the independently observed mobile p4-diag first-review label.
// Drawing-command geometry is checked here; native Chromium readability is a separate gate.
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

function load(baseline, sourceFile) {
  const context = vm.createContext({ window: {}, document: { documentElement: { dataset: {} }, getElementById() {},
    createElement() { return {}; }, head: { append() {} }, addEventListener() {} } });
  for (const name of ['core', 't1', 't2', 't3', 't4']) {
    const file = `${unit}/${name}.js`;
    const source = sourceFile && name === 't4' ? fs.readFileSync(sourceFile, 'utf8') : baseline && name === 't4' ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, file), 'utf8');
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
  close(distance(leader.anchor, target.at), target.r, `${why}: leader begins at the actual arc radius`);
  const a = Math.atan2(leader.anchor.y - target.at.y, leader.anchor.x - target.at.x), sweep = target.to - target.from;
  const directed = ((sweep < 0 ? -1 : 1) * (a - target.from) + Math.PI * 4) % (Math.PI * 2);
  assert.ok(directed > 1e-7 && directed < Math.abs(sweep) - 1e-7, `${why}: leader starts within the correct B-angle arc, not another angle or ray`);
}


function intersects(p, q, box, pad = 0) {
  let lo = 0, hi = 1;
  for (const [axis, a, z] of [['x', box.l - pad, box.r + pad], ['y', box.t - pad, box.b + pad]]) {
    const d = q[axis] - p[axis];
    if (Math.abs(d) < 1e-9) { if (p[axis] < a || p[axis] > z) return false; }
    else { const u = (a - p[axis]) / d, v = (z - p[axis]) / d; lo = Math.max(lo, Math.min(u, v)); hi = Math.min(hi, Math.max(u, v)); }
  }
  return lo <= hi;
}
function checkFirst(b, model, why) {
  const label = targetAt(b, model.B);
  assert.equal(label?.text, `${rt.G.fracText(model.I)}°`, `${why}: the original interior angle stays exact`);
  assert.ok(!intersects(b.toS(model.A), b.toS(model.C), label, 2), `${why}: interior value must not cover diagonal AC or resemble an angle at P`);
  assert.ok(label.r <= b.W - 26, `${why}: value stays clear of the24px contents tab`);
  const leader = clearTarget(b, label, why);
  verifyLeaderAngle(b, leader, model.B, model.A, model.C, model.I, why);
  for (const p of b.paths.filter(p => p.options.color === 'ink' || p.options.color === 'green')) {
    const pts = p.options.close ? p.points.concat(p.points[0]) : p.points;
    for (let i = 1; i < pts.length; i++) assert.ok(!intersects(pts[i - 1], pts[i], label, 2), `${why}: value stays separate from the polygon and both diagonals`);
  }
  for (const p of b.points) {
    const a = leader.anchor, z = leader.result.end, dx = z.x - a.x, dy = z.y - a.y;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
    assert.ok(distance(p, { x: a.x + t * dx, y: a.y + t * dy }) >= p.r + 1, `${why}: the leader must not run through a vertex or intersection point`);
  }
  return label;
}
for (const [W, H] of [[360, 387], [390, 410.75]]) {
  test(`p4-diag ${W}px first-review value belongs to B and clears AC/P`, t => {
    for (const bottom of [58, 60]) {
      const s = rt.state('p4-diag', { step: 1 }), m = rt.scene('p4-diag').pg.model(s), b = draw(rt, 'p4-diag', W, H, 'review', s, bottom);
      const label = checkFirst(b, m, `${W}/${bottom}`);
      assert.equal(label.text, '108°');
      assert.ok(!b.texts.some(t => t.text === '72°'), 'the answer at P is not revealed by the first step');
      t.diagnostic(`B interior value at ${label.x.toFixed(2)},${label.y.toFixed(2)}; actual B arc radius ${b.arcs.find(a => a.options.sector).r.toFixed(2)}px`);
    }
  });
}

test('all allowed n/selected vertices retain separate labels and a leader anchored on the actual B angle', t => {
  let checked = 0;
  for (const [W, H] of [[360, 387], [390, 410.75]]) for (const bottom of [58, 60]) {
    for (let n = 5; n <= 12; n++) for (let v = 0; v < n; v++) {
      const s = rt.state('p4-diag', { pgDn: n, pgDv: v, step: 1 }), m = rt.scene('p4-diag').pg.model(s);
      const b = draw(rt, 'p4-diag', W, H, 'review', s, bottom);
      checkFirst(b, m, `n${n}/v${v}/${W}×${H}/${bottom}`);
      assert.equal(s.revealed, false); checked++;
    }
  }
  t.diagnostic(`${checked} actual review-stage dimensions across every selectable vertex`);
});

test('exact polygon angles, question and staged answer disclosure survive review navigation and reentry', () => {
  const sc = rt.scene('p4-diag');
  for (let n = 5; n <= 12; n++) {
    const s = rt.state('p4-diag', { pgDn: n }), model = plain(sc.pg.model(s));
    close(angle(model.B, model.A, model.C), 180 - 360 / n, 'independent interior angle');
    close(angle(model.P, model.A, model.B), 360 / n, 'independent asked intersection angle');
    const correct = sc.pg.prob(sc.pg.model(s)).choices.filter(c => c.ok);
    assert.equal(correct.length, 1);
    for (const step of [0, 1, 2, 3, 1]) {
      s.step = step; const b = draw(rt, 'p4-diag', 360, 387, 'review', s);
      if (step === 1) checkFirst(b, sc.pg.model(s), `return n${n}`);
      const target = b.texts.find(t => distance(t.p, sc.pg.model(s).P) < 1e-7 && t.text.endsWith('°'));
      assert.equal(!!target, step >= 3, 'the asked angle appears only at its original final solution step');
      assert.equal(s.revealed, false);
    }
    const problem = draw(rt, 'p4-diag', 360, 291, 'problem', s);
    assert.equal(problem.texts.filter(t => t.text === 'x').length, 1);
    assert.deepEqual(plain(sc.pg.model(s)), model, 'drawing and solution navigation do not change the geometry');
    sc.enter(s); assert.equal(s.pgDn, 5); assert.equal(s.pgDv, 0); assert.equal(s.revealed, false);
  }
});

if (arg('--compare-source')) test('all other scenes, states, contours and conditions stay unchanged from the frozen pre-repair file', t => {
  const old = load(null, arg('--compare-source')); let checked = 0;
  const picture = b => plain({ paths: b.paths, arcs: b.arcs, points: b.points, texts: b.texts, marks: b.marks, leaders: b.leaders });
  for (const sc of rt.scenes) {
    const previous = old.scene(sc.id);
    for (const [W, H] of [[1039, 787], [820, 461], [683, 613], [390, 410.75], [360, 387]]) for (const tab of ['explore', 'problem', 'review']) for (const step of [0, 1, 2, 3]) {
      const s = rt.state(sc.id, { step }), z = old.state(sc.id, { step });
      const after = draw(rt, sc.id, W, H, tab, s), before = draw(old, sc.id, W, H, tab, z);
      if (!(sc.id === 'p4-diag' && tab === 'review' && step === 1 && W < 560)) {
        assert.deepEqual(picture(after), picture(before), `${sc.id}/${W}/${tab}/${step}`); checked++;
      } else {
        assert.deepEqual(plain(after.paths.filter(p => p.options.color !== 'muted')), plain(before.paths.filter(p => p.options.color !== 'muted')), 'original polygon and diagonal geometry is unchanged');
        assert.deepEqual(plain(after.points), plain(before.points), 'original points are unchanged');
      }
      assert.deepEqual(plain(sc.pg.model(s)), plain(previous.pg.model(z)));
      assert.deepEqual(plain(sc.steps(s)), plain(previous.steps(z)));
      assert.deepEqual(plain(sc.pg.prob(sc.pg.model(s))), plain(previous.pg.prob(previous.pg.model(z))));
    }
    assert.deepEqual(picture(draw(rt, sc.id, 240, 180, 'explore', rt.state(sc.id), 0, true)), picture(draw(old, sc.id, 240, 180, 'explore', old.state(sc.id), 0, true)), `${sc.id} thumbnail`);
    checked++;
  }
  t.diagnostic(`${checked} exact drawing comparisons including other owners' frozen join/fan changes`);
});
