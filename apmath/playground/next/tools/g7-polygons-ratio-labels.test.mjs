// Actual Board projection regression for the confirmed 360px p4-ratio initial-condition P1.
// Both ratio labels must remain distinct and connected to their own colored segment.
// A native Chromium screenshot review remains the independent readability gate.
// Negative control: node this-file.mjs --baseline <9bf-or-a9-commit>
// Scope comparison: node this-file.mjs --compare-scope <pre-repair-commit>
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
  const a = { x: p.x - v.x, y: p.y - v.y }, b = { x: q.x - v.x, y: q.y - v.y };
  return Math.atan2(Math.abs(a.x * b.y - a.y * b.x), a.x * b.x + a.y * b.y) * 180 / Math.PI;
};
function load(baseline, mutation) {
  const context = vm.createContext({ window: {}, document: { documentElement: { dataset: {} }, getElementById() {},
    createElement() { return {}; }, head: { append() {} }, addEventListener() {} } });
  for (const name of ['core', 't1', 't2', 't3', 't4']) {
    const file = `${unit}/${name}.js`;
    const source = baseline && name === 't4' ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(name === 't4' && mutation ? mutation(source) : source, context, { filename: file });
  }
  context.window.APLab = { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const scenes = context.window.APL_PG_GROUPS.flatMap(group => group.scenes);
  return { context, scenes, G: context.window.APL_PG, scene: id => scenes.find(s => s.id === id),
    state(id, patch = {}) { const s = { step: 1, revealed: false }; this.scene(id).enter(s); return Object.assign(s, patch); } };
}
const rt = load(arg('--baseline'));
function draw(runtime, W, H, tab, s = runtime.state('p4-ratio'), id = 'p4-ratio', thumb = false) {
  const b = Object.create(runtime.context.window.APLab.Board.prototype);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { top: 0, bottom: thumb ? 0 : 58, left: 0, right: 0 },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb, panes: null, paneId: null, focus: { x: [-2, 2], y: [-2, 2] }, texts: [], paths: [], arcs: [], marks: [], leaders: [] });
  b.ctx = { font: '16px sans-serif', save() {}, restore() {}, measureText(value) { return { width: runtime.G.textW(value, Number(this.font.match(/([\d.]+)px/)[1])) }; } };
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), world: points, options }); return b; };
  b.arc = (p, r, from, to, options = {}) => { b.arcs.push({ p, at: b.toS(p), r: r * b.k, from, to, options }); return b; };
  b.text = (p, value, options = {}) => {
    const at = b.toS(p), m = b.annotationSize(value, options), w = m.width - 6, h = m.height - 6;
    const x = at.x + (options.dx || 0), y = at.y + (options.dy || 0);
    b.texts.push({ text: String(value), p, x, y, l: x - w / 2, r: x + w / 2, t: y - h / 2, b: y + h / 2, options }); return b;
  };
  const leader = b.leader;
  b.leader = (anchor, label, options) => { const result = leader.call(b, anchor, label, options); b.leaders.push({ anchor, label, result, options }); return result; };
  for (const name of ['point', 'right', 'ticks', 'handle', 'circle']) b[name] = (...args) => { b.marks.push({ name, args }); return b; };
  const sc = runtime.scene(id); sc.draw(b, s, {}, { s, tab, scene: sc }); return b;
}
const gap = (a, b) => Math.hypot(Math.max(a.l - b.r, b.l - a.r, 0), Math.max(a.t - b.b, b.t - a.b, 0));
function checkConditions(b, m, why) {
  const labels = [b.texts.find(t => t.text === `내각 ${m.a}`), b.texts.find(t => t.text === `외각 ${m.bb}`)];
  assert.ok(labels.every(Boolean), `${why}: the original two ratio conditions are present`);
  assert.ok(gap(...labels) >= 12, `${why}: the two conditions overlap/read as one string, gap=${gap(...labels)}`);
  const regions = b.paths.filter(p => p.options.fill === 'sky' || p.options.fill === 'rose');
  assert.equal(regions.length, 2, 'both colored ratio regions remain visible');
  const [inside, outside] = regions;
  const insideWidth = inside.world[1].x - inside.world[0].x;
  const outsideWidth = outside.world[1].x - outside.world[0].x;
  close(insideWidth / outsideWidth, m.a / m.bb, 'the drawn partition has exactly the given ratio');
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i], region = regions[i];
    assert.ok(label.l >= 8 && label.r <= b.W - 8 && label.t >= 8 && label.b <= b.H - b.insets.bottom - 8, `${why}: ${label.text} is fully on screen`);
    const leader = b.leaders.find(l => distance(l.label, label) < 1e-7);
    assert.ok(leader?.result.drawn, `${why}: ${label.text} has a visible line to its own region`);
    close(leader.result.anchor.x, (region.points[0].x + region.points[1].x) / 2, 'rendered leader points to the middle of the correct colored interval');
    close(leader.result.anchor.y, region.points[0].y, 'rendered leader points to the bar upper edge');
    close(leader.result.label.x, label.x, 'rendered leader label x matches text');
    close(leader.result.label.y, label.y, 'rendered leader label y matches text');
    for (const point of [leader.result.anchor, leader.result.label, leader.result.end]) assert.ok(point.x >= 0 && point.x <= b.W && point.y >= 0 && point.y <= b.H - b.insets.bottom, `${why}: rendered leader remains on canvas`);
    assert.ok(gap({ l: leader.result.end.x, r: leader.result.end.x, t: leader.result.end.y, b: leader.result.end.y }, label) >= 2, 'leader stops before the text box');
    assert.ok(b.paths.some(p => p.points.length === 2 && distance(p.points[0], leader.result.anchor) < 1e-7 && distance(p.points[1], leader.result.end) < 1e-7), 'production path actually draws the verified leader endpoints');
    for (const other of b.texts) if (other !== label) assert.ok(gap(label, other) >= 4, `${why}: ${label.text} covers ${other.text}`);
  }
  assert.ok(b.texts.some(t => t.text === `${m.a} : ${m.bb}`), 'ratio value retained');
  assert.ok(b.texts.some(t => t.text === '정n각형 → n = ?'), 'the unknown remains explicitly unknown');
  assert.equal(b.arcs.length, 0, 'the answer circle/polygon sectors are not visible in the problem');
  assert.ok(!b.texts.some(t => /n = (?!\?)/.test(t.text)), 'no numeric n is disclosed');
  return gap(...labels);
}
test('calibration rejects the former double-projected leader and unsupported option names', () => {
  const mutated = load(null, source => source.replace('{ ...sizes[i], px: true, color: v.color, lineWidth: 1.2, gap: 2 }', '{ color: v.color, width: 1.2, labelWidth: sizes[i].width, labelHeight: sizes[i].height, endGap: 2 }'));
  const s = mutated.state('p4-ratio'), b = draw(mutated, 360, 291, 'problem', s);
  assert.throws(() => checkConditions(b, mutated.scene('p4-ratio').pg.model(s), 'wrong API mutation'), /rendered leader/);
});
for (const [W, H] of [[360, 291], [390, 309]]) {
  test(`p4-ratio ${W}px default problem separates inner3 and outer2`, t => {
    const s = rt.state('p4-ratio'), m = rt.scene('p4-ratio').pg.model(s), b = draw(rt, W, H, 'problem', s);
    t.diagnostic(`condition gap ${checkConditions(b, m, `${W} initial`).toFixed(2)}px`);
  });
  test(`p4-ratio ${W}px all 36 input ratios preserve readable conditions and no early answer`, () => {
    for (let a = 1; a <= 9; a++) for (let bb = 1; bb <= 4; bb++) {
      const s = rt.state('p4-ratio', { pgQa: a, pgQb: bb }), m = rt.scene('p4-ratio').pg.model(s);
      checkConditions(draw(rt, W, H, 'problem', s), m, `${W}/${a}:${bb}`);
      close(m.I + m.eps, 180, 'inner plus outer equals180'); close(m.I / m.eps, a / bb, 'inner:outer matches input');
      close(m.nn, 2 * (a + bb) / bb, 'n follows360/exterior');
      const q = rt.scene('p4-ratio').pg.prob(m);
      assert.ok(q.stem.includes(`${a} : ${bb}`)); assert.equal(q.choices.filter(c => c.ok).length, 1);
      assert.equal(m.valid, Number.isInteger(2 * (a + bb) / bb) && m.nn >= 3);
      assert.equal(s.revealed, false);
    }
  });
}
test('presets/reset and solution stages retain the ratio model and original answer timing', () => {
  const sc = rt.scene('p4-ratio');
  for (const preset of sc.pg.presets()) {
    const s = rt.state('p4-ratio'); preset.apply(s); const m = sc.pg.model(s);
    checkConditions(draw(rt, 360, 291, 'problem', s), m, preset.label);
    for (const step of [0, 1, 2, 3]) {
      s.step = step; const b = draw(rt, 360, 387, 'review', s);
      assert.equal(b.arcs.length > 0, step >= 2, 'ring appears only at the existing second solution step');
      assert.deepEqual(plain(sc.pg.model(s)), plain(m), 'changing disclosure step leaves math unchanged');
    }
    sc.enter(s); assert.equal(s.pgQa, 3); assert.equal(s.pgQb, 2);
  }
});
if (arg('--compare-scope')) test('other scenes, wide views, all nonproblem states, bar geometry and thumbnails stay identical', () => {
  const old = load(arg('--compare-scope'));
  const picture = b => plain({ texts: b.texts, paths: b.paths, arcs: b.arcs, marks: b.marks, leaders: b.leaders });
  for (const sc of rt.scenes) {
    const s = rt.state(sc.id), z = old.state(sc.id), os = old.scene(sc.id);
    assert.deepEqual(plain(sc.pg.model(s)), plain(os.pg.model(z)), `${sc.id} model`);
    assert.deepEqual(plain(sc.pg.prob(sc.pg.model(s))), plain(os.pg.prob(os.pg.model(z))), `${sc.id} problem`);
    assert.deepEqual(plain(sc.steps(s)), plain(os.steps(z)), `${sc.id} solution`);
    for (const [W, H] of [[1039, 698], [820, 461], [683, 528], [390, 309], [360, 291]]) for (const tab of ['explore', 'review', 'problem']) {
      const b = draw(rt, W, H, tab, s, sc.id), a = draw(old, W, H, tab, z, sc.id);
      if (sc.id !== 'p4-ratio' || W >= 560 || tab !== 'problem') assert.deepEqual(picture(b), picture(a), `${sc.id}/${W}/${tab} unchanged`);
      else {
        assert.deepEqual(plain(b.paths.filter(p => p.options.fill || p.options.color === 'ink')), plain(a.paths), 'ratio regions and contour unchanged');
        assert.deepEqual(plain(b.arcs), plain(a.arcs)); assert.deepEqual(plain(b.marks), plain(a.marks));
        assert.deepEqual(plain(b.texts.filter(t => !/^내각 |^외각 /.test(t.text))), plain(a.texts.filter(t => !/^내각 |^외각 /.test(t.text))), 'all other annotations unchanged');
      }
    }
    assert.deepEqual(picture(draw(rt, 240, 180, 'explore', s, sc.id, true)), picture(draw(old, 240, 180, 'explore', z, sc.id, true)), `${sc.id} thumbnail`);
  }
  const sc = rt.scene('p4-ratio'), os = old.scene('p4-ratio');
  for (let a = 1; a <= 9; a++) for (let bb = 1; bb <= 4; bb++) for (const step of [0, 1, 2, 3]) {
    const s = rt.state(sc.id, { pgQa: a, pgQb: bb, step }), z = old.state(sc.id, { pgQa: a, pgQb: bb, step });
    for (const tab of ['explore', 'review']) assert.deepEqual(picture(draw(rt, 360, 387, tab, s)), picture(draw(old, 360, 387, tab, z)), `nonproblem ${a}:${bb}/${step}/${tab}`);
  }
});
