/** Existing SAS obtuse AH/AB overlap captured in source-bound Chromium run42655280685.
 * Real Board projection and returned/painted leader endpoints, not mocked leader inputs.
 * --baseline SHA is a negative control; --compare-scope SHA proves limited scope.
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
const changed = ['t4'];
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = x => JSON.parse(JSON.stringify(x));
const distance = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
const near = (p, q) => distance(p, q) < 1e-6;
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
function draw(rt, id, s, W, H, tab = 'problem', thumb = false) {
  const proto = rt.context.window.APLab.Board.prototype, b = Object.create(proto);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { left: 0, right: [1039, 683].includes(W) ? 16 : 0, top: 0, bottom: [1039, 683].includes(W) ? 56 : 60 }, zoom: 1, panX: 0, panY: 0, fs: 1,
    thumb, panes: null, paneId: null, focus: { x: [-6, 6], y: [-6, 6] }, paths: [], arcs: [], texts: [], marks: [], leaders: [], angles: [] });
  const saved = []; b.font = 'sans-serif';
  b.ctx = { font: '800 16px sans-serif', save() { saved.push(this.font); }, restore() { this.font = saved.pop(); },
    measureText(text) { const size = Number(this.font.match(/([\d.]+)px/)?.[1] || 16); return { width: rt.G.textW2(text, size) }; } };
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), world: points, options, leader: !!b._recordingLeader }); return b; };
  b.seg = (p, q, options = {}) => b.path([p, q], options);
  b.circle = (p, r, options = {}) => { b.marks.push({ method: 'circle', at: b.toS(p), r: r * b.k, options }); return b; };
  b.arc = (p, r, a, z, options = {}) => { b.arcs.push({ at: b.toS(p), r: r * b.k, a, z, options }); return b; };
  b.text = (p, text, options = {}) => {
    const at = b.toS(p), size = (options.size || 16) * b.fs * b._ts(), width = b.annotationSize(text, options).width - 6, align = options.align || 'center';
    const x = at.x + (options.dx || 0) + (align === 'left' ? width / 2 : align === 'right' ? -width / 2 : 0), y = at.y + (options.dy || 0);
    b.texts.push({ text: String(text), x, y, p, size, width, options }); return b;
  };
  b.leader = (a, z, options) => { let result; b._recordingLeader = true; try { result = proto.leader.call(b, a, z, options); } finally { b._recordingLeader = false; } b.leaders.push({ a, z, options, result }); return result; };
  for (const name of ['right', 'ticks', 'point', 'handle']) b[name] = (...args) => { b.marks.push({ method: name, args }); return b; };
  const scene = rt.scene(id); scene.draw(b, s, {}, { tab, scene, s }); return b;
}

const id = 'sasObtuseLen';
const views = [
  { W: 1039, explore: 672, problem: 741 }, { W: 820, explore: 461, problem: 397 },
  { W: 683, explore: 548, problem: 613 }, { W: 390, explore: 411, problem: 309 }, { W: 360, explore: 387, problem: 291 }
];
const picture = b => plain({ paths: b.paths, arcs: b.arcs, texts: b.texts, marks: b.marks, leaders: b.leaders });
const boxOf = (b, t) => b._tgBoxes.find(q => q.s === t.text && Math.abs((q.y0 + q.y1) / 2 - t.y) < 1e-6 && Math.abs((q.x0 + q.x1) / 2 - t.x) < 3);
function segmentMeetsBox(a, z, q, gap = 2) {
  const inside = p => p.x >= q.x0 - gap && p.x <= q.x1 + gap && p.y >= q.y0 - gap && p.y <= q.y1 + gap;
  if (inside(a) || inside(z)) return true;
  const cross = (p, r, s) => (r.x - p.x) * (s.y - p.y) - (r.y - p.y) * (s.x - p.x);
  const corners = [{ x: q.x0 - gap, y: q.y0 - gap }, { x: q.x1 + gap, y: q.y0 - gap }, { x: q.x1 + gap, y: q.y1 + gap }, { x: q.x0 - gap, y: q.y1 + gap }];
  return corners.some((p, i) => {
    const r = corners[(i + 1) % 4];
    return cross(a, z, p) * cross(a, z, r) <= 0 && cross(p, r, a) * cross(p, r, z) <= 0 &&
      Math.max(Math.min(a.x, z.x), Math.min(p.x, r.x)) <= Math.min(Math.max(a.x, z.x), Math.max(p.x, r.x)) &&
      Math.max(Math.min(a.y, z.y), Math.min(p.y, r.y)) <= Math.min(Math.max(a.y, z.y), Math.max(p.y, r.y));
  });
}
function checkHeight(b, why) {
  const t = b.texts.find(t => t.options.color === 'violet' && t.text !== 'H'); assert.ok(t, why + ': AH value exists');
  const q = boxOf(b, t); assert.ok(q);
  const altitude = b.paths.find(p => p.options.color === 'violet' && p.options.width === 3.2);
  assert.ok(altitude, why + ': actual AH is present');
  const [A, H] = altitude.points, anchor = { x: (A.x + H.x) / 2, y: (A.y + H.y) / 2 };
  const outline = b.paths.find(p => p.options.color === 'ink' && p.options.width === 3.4);
  const [pa, pb, pc] = outline.points;
  for (const side of [[pa, pb], [pa, pc]]) assert.ok(!segmentMeetsBox(...side, q), why + ': height label covers an oblique side');
  assert.ok(q.x0 >= 4 && q.x1 <= b.W - 4 && q.y0 >= 3 && q.y1 <= b.H - b.insets.bottom - 3, why + ': full AH value is visible');
  const link = b.leaders.find(l => near(l.result.anchor, anchor) && Math.abs(l.result.label.y - t.y) < 1e-6);
  if (link) {
    assert.equal(link.options.px, true, why + ': connector uses the real pixel API');
    assert.ok(near(link.result.anchor, anchor), why + ': actual connector starts on AH');
    assert.ok(Math.abs(link.result.label.x - t.x) < 3 && Math.abs(link.result.label.y - t.y) < 1e-6, why + ': returned label matches the painted value');
    assert.ok(link.result.drawn, why + ': an outside value has a visible connector');
    assert.ok(q.x1 < A.x - 8, why + ': callout stays on the empty side of AH');
    assert.ok(b.paths.some(p => p.leader && p.points.length === 2 && near(p.points[0], link.result.anchor) && near(p.points[1], link.result.end)), why + ': returned connector endpoint is actually painted');
    for (const p of [link.result.anchor, link.result.end, link.result.label]) assert.ok(p.x >= 0 && p.x <= b.W && p.y >= 0 && p.y <= b.H - b.insets.bottom, why + ': connector is inside the usable stage');
  }
  return { t, q, link, altitude };
}

test('source-bound original AB6/BC4/B120 initial height stays distinct from AB and AC in all five viewports', () => {
  for (const v of views) {
    const s = rt.state(id), b = draw(rt, id, s, v.W, v.explore, 'explore'), h = checkHeight(b, 'native/' + v.W);
    assert.equal(h.t.text, 'AH = 3√3');
    if (v.W !== 1039) assert.ok(h.link, 'original non-PC collision has an explicit AH connector');
    for (const q of b._tgBoxes) if (q !== h.q) {
      assert.ok(!(h.q.x0 < q.x1 + 1 && h.q.x1 > q.x0 - 1 && h.q.y0 < q.y1 + 1 && h.q.y1 > q.y0 - 1), 'native AH value is separate from ' + q.s);
      if (h.link) assert.ok(!segmentMeetsBox(h.link.result.anchor, h.link.result.end, q, 0), 'native AH connector does not cross ' + q.s);
    }
    assert.equal(s.playing, false); assert.equal(s.revealed, false);
  }
});
test('all obtuse control values preserve AH mathematics and an unambiguous height association', t => {
  let count = 0;
  for (let c = 2; c <= 12; c++) for (let a = 2; a <= 16; a++) for (let beta = 100; beta <= 170; beta += 5) {
    const s = rt.state(id); Object.assign(s, { t43c: c, t43a: a, t44b: beta });
    const m = rt.scene(id).tg.model(s); assert.ok(Math.abs(m.ah.v - c * Math.sin(beta * Math.PI / 180)) < 1e-9);
    for (const v of views) {
      checkHeight(draw(rt, id, s, v.W, v.explore, 'explore'), `controls/${c}/${a}/${beta}/${v.W}`); count++;
    }
  }
  t.diagnostic(`${count} projected control states across all five actual canvas sizes`);
});
test('all generated questions retain their hidden height and AC answer stages', t => {
  const s = rt.state(id), sc = rt.scene(id), cases = new Map();
  for (let n = 0; n < 5000 && cases.size < 72; n++) { const q = sc.tg.gen(); cases.set(q.key, plain(q)); }
  assert.equal(cases.size, 72); let count = 0;
  for (const q of cases.values()) for (const v of views) for (const step of [0, 1, 2, 3, 4, 5]) {
    s.q = plain(q); s.step = step || 1;
    const original = JSON.stringify(s.q), b = draw(rt, id, s, v.W, step ? v.explore : v.problem, step ? 'review' : 'problem');
    assert.equal(JSON.stringify(s.q), original); assert.equal(s.revealed, false); assert.equal(s.playing, false);
    const height = b.texts.filter(t => t.options.color === 'violet' && t.text !== 'H');
    if (step >= 2) { assert.equal(height.length, 1); assert.equal(checkHeight(b, `${q.key}/${v.W}/${step}`).t.text, q.fig.work.ah); }
    else assert.equal(height.length, 0, 'derived AH stays hidden before the existing second review step');
    assert.ok(b.texts.some(t => t.text === (step === 5 ? q.fig.work.ac : 'x')), 'AC answer follows the existing final stage');
    count++;
  }
  t.diagnostic(`${count} question/view/stage cases from all72 generator conditions`);
});
if (arg('--compare-scope')) test('mathematical models/questions/stages and all other scenes remain byte-equivalent in the render harness', t => {
  const old = load(arg('--compare-scope')); let count = 0;
  for (const sc of rt.scenes) {
    const s = rt.state(sc.id), z = old.state(sc.id), prev = old.scene(sc.id);
    assert.deepEqual(plain(sc.tg.model(s)), plain(prev.tg.model(z))); assert.deepEqual(plain(s.q), plain(z.q)); assert.deepEqual(plain(sc.steps(s)), plain(prev.steps(z)));
    for (const v of views) for (const tab of ['explore', 'problem', 'review']) {
      s.step = z.step = 1;
      const H = tab === 'problem' ? v.problem : v.explore, a = draw(rt, sc.id, s, v.W, H, tab), b = draw(old, sc.id, z, v.W, H, tab);
      if (sc.id !== id || tab !== 'explore') assert.deepEqual(picture(a), picture(b), sc.id + '/' + v.W + '/' + tab);
      else {
        const geometry = x => x.paths.filter(p => !p.leader).map(p => ({ world: p.world, options: p.options }));
        assert.deepEqual(plain(geometry(a)), plain(geometry(b)), 'original model geometry and colored regions are unchanged');
        assert.deepEqual(a.texts.map(t => t.text).sort(), b.texts.map(t => t.text).sort(), 'all original values retained');
        if (!a.leaders.some(l => l.options.px)) assert.deepEqual(picture(a), picture(b), 'clear normal layout remains identical');
      }
      count++;
    }
  }
  for (const tab of ['explore', 'problem', 'review']) assert.deepEqual(picture(draw(rt, id, rt.state(id), 240, 150, tab, true)), picture(draw(old, id, old.state(id), 240, 150, tab, true)));
  t.diagnostic(`${count} scene/view/tab comparisons,3 unchanged target thumbnails,51 models/questions/stages`);
});
