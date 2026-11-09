// Regression for the independently observed X-name occlusion in t4-2.
// Real Chromium images remain a separate required visual gate.
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

function load(baseline) {
  const document = { documentElement: { dataset: {} }, getElementById() {}, createElement() { return {}; }, head: { append() {} }, addEventListener() {} };
  const context = vm.createContext({ window: {}, document, console });
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7']) {
    const file = `${labPath}/${name}.js`;
    const source = baseline && name === 't4'
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
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { left: 0, right: 16, top: 0, bottom },
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
const box = (b, value) => { const q = b.trLabels.find(t => t.text === value); assert.ok(q, `visible ${value}`); return q; };

test('the upper ray name clears the actual status-badge band in every initial viewport', () => {
  for (const [W, H] of views) for (const tab of ['explore']) {
    const s = rt.state('t4-2'); s.step = 1;
    const b = draw(rt, 't4-2', s, W, H, tab, 56);
    assert.ok(box(b, 'X').t >= 48, `X must clear the badge bottom42 plus6px at ${W}: ${box(b,'X').t}`);
    for (const name of ['O', 'X', 'Y', 'P', 'E', 'F']) text(b, name);
    const g = rt.scene('t4-2').tr.model(s).g;
    for (const [a,z] of [[g.O,g.X],[g.O,g.Y],[g.P,g.E],[g.P,g.F],[g.O,g.P]]) {
      assert.ok(b.paths.some(path => path.points.length === 2 && distance(path.points[0],b.toS(a)) < 1e-7 && distance(path.points[1],b.toS(z)) < 1e-7), 'the given rays, perpendiculars and bisector remain visible');
    }
    unobscured(b);
  }
});

test('varying both perpendicular distances preserves a readable upper-ray name and the equal-distance relation', () => {
  const sc = rt.scene('t4-2');
  for (let h = 15; h <= 40; h++) for (const d1 of [2,4,8]) for (const d2 of [2,4,8]) for (const [W,H] of views) {
    const s = rt.state(sc.id); Object.assign(s,{trBh:h,trB1:d1,trB2:d2});
    const before = JSON.stringify(s), m = sc.tr.model(s), b = draw(rt,sc.id,s,W,H,'explore',56);
    assert.ok(box(b,'X').t >= 48, `status clearance ${W}, ${h}, ${d1}, ${d2}`);
    close(distance(m.g.P,m.g.E),d1,'PE'); close(distance(m.g.P,m.g.F),d2,'PF');
    assert.equal(m.eq,d1===d2); assert.equal(JSON.stringify(s),before,'render must not mutate parameters');
  }
});

test('reentry restores the original distance conditions and the repaired first picture', () => {
  const fresh=rt.state('t4-2'), edited={...fresh,trB1:8,trB2:2,trBh:40,playing:true,trShow:'opened'};
  rt.scene('t4-2').enter(edited);
  assert.equal(edited.trB1,4); assert.equal(edited.trB2,4); assert.equal(edited.trBh,25); assert.equal(edited.playing,false);
  assert.deepEqual(picture(draw(rt,'t4-2',edited,683,548,'explore',56)),picture(draw(rt,'t4-2',fresh,683,548,'explore',56)));
});

if (arg('--compare-scope')) test('only the status-bearing t4-2 framing changes; math, hidden answers, and neighboring scenes remain exact', () => {
  const prior=load(arg('--compare-scope'));
  for(const id of ['t4-1','t4-2','t4-3','t4-4','t4-5','t4-6']) {
    const s=rt.state(id), old=prior.state(id), a=rt.scene(id), z=prior.scene(id);
    assert.deepEqual(plain(a.tr.model(s)),plain(z.tr.model(old))); assert.equal(a.problem.text(s),z.problem.text(old)); assert.deepEqual(plain(a.steps(s)),plain(z.steps(old)));
    for (const [W,H] of views) for (const tab of ['explore','problem','review']) for (const thumb of [false,true]) {
      if(id==='t4-2' && tab==='explore' && !thumb) continue;
      s.step=1;old.step=1;
      assert.deepEqual(picture(draw(rt,id,s,W,H,tab,56,thumb)),picture(draw(prior,id,old,W,H,tab,56,thumb)),`${id}/${W}/${tab}/${thumb}`);
    }
  }
});
