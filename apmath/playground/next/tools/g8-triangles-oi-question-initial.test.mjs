// Production scene + Board contracts for the independently observed t7-1
// mobile problem: A condition displaced to O/I and B target pointing at I. These checks do not substitute for Chromium
// screenshots or independent visual review.
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
const labPath = 'apmath/playground/next/labs/g8-triangles';
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = value => JSON.parse(JSON.stringify(value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const close = (a, b, why) => assert.ok(Math.abs(a - b) < 1e-7, `${why}: ${a} / ${b}`);
const ids = ['t7-1'];
const mobile = [[390, 309], [360, 291]];

function load(baseline) {
  const document = { documentElement: { dataset: {} }, getElementById() {}, createElement() { return {}; }, head: { append() {} }, addEventListener() {} };
  const context = vm.createContext({ window: {}, document, console });
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7']) {
    const file = `${labPath}/${name}.js`;
    const source = baseline && name === 't7'
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
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { left: 0, right: 0, top: 0, bottom },
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

const layouts = [[390, 309, 411], [360, 291, 387]];
const toLabel = (b, label) => b.leaders.find(link => distance(link.z, label) < 1e-7);
const crossAngle = (V, P, Q) => Math.atan2(Math.abs((P.x - V.x) * (Q.y - V.y) - (P.y - V.y) * (Q.x - V.x)),
  (P.x - V.x) * (Q.x - V.x) + (P.y - V.y) * (Q.y - V.y)) * 180 / Math.PI;

test('t7-1 initial original triangle is large enough to separate A from O and I', t => {
  for (const [W, H, RH] of layouts) for (const bottom of [58, 60]) for (const tab of ['problem', 'review']) {
    const s = rt.state('t7-1'); s.step = 1;
    const b = draw(rt, 't7-1', s, W, tab === 'problem' ? H : RH, tab, bottom);
    const g = rt.scene('t7-1').tr.model(s).g, A = b.toS(g.A), B = b.toS(g.B), C = b.toS(g.C);
    t.diagnostic(`${W}/${bottom}/${tab}: height=${B.y-A.y}, base=${C.x-B.x}`);
    assert.ok(B.y - A.y >= 140, 'initial triangle must have enough height for the given apex condition and two centers');
    assert.ok(C.x - B.x >= 136, 'both legs and the distinct B target remain visible');
    for (const name of ['A', 'B', 'C', 'O', 'I']) text(b, name);
    unobscured(b);
  }
});

test('t7-1 given apex value connects to its actual A arc, not to the central points', () => {
  for (const a of [40,44,48,52,56,60,64,68,72,76,80,84,88]) for (const v of [0,1,2])
    for (const [W,H,RH] of layouts) for (const tab of ['problem','review']) {
      const s = { ...rt.state('t7-1'), trMa:a, trV:v, step:1 }, M = rt.scene('t7-1').tr.model(s);
      const b = draw(rt,'t7-1',s,W,tab==='problem'?H:RH,tab), A=b.toS(M.g.A), O=b.toS(M.g.O), I=b.toS(M.g.I);
      const given=text(b,`${a}°`), link=toLabel(b,given);
      assert.ok(distance(given,A)+12<Math.min(distance(given,O),distance(given,I)), `${a}/${v}/${W}: given belongs to A`);
      assert.ok(link?.result.drawn, 'the external condition has an actual visible leader');
      const arc=b.arcs.find(arc=>distance(arc.at,A)<1e-7 && Math.abs(distance(link.a,A)-arc.r)<1e-6);
      assert.ok(arc, 'leader starts at the actual A angle marker');
      close(crossAngle(A,b.toS(M.g.B),link.a),a/2,'leader anchor bisects the given A angle');
      assert.ok(distance(link.a,A)<Math.min(distance(link.a,O),distance(link.a,I)),'A leader does not point to O/I');
      unobscured(b);
    }
});

test('t7-1 x points to the actual B angle while remaining separate from O/I and side BC', () => {
  for (const a of [40,44,48,52,56,60,64,68,72,76,80,84,88]) for (const v of [0,1,2])
    for (const [W,H,RH] of layouts) for (const tab of ['problem','review']) {
      const s={...rt.state('t7-1'),trMa:a,trV:v,step:1}, M=rt.scene('t7-1').tr.model(s);
      const kind=M.same?'ibc':['obi','obc','diff'][v]; if(kind==='diff')continue;
      const b=draw(rt,'t7-1',s,W,tab==='problem'?H:RH,tab), B=b.toS(M.g.B), O=b.toS(M.g.O), I=b.toS(M.g.I), C=b.toS(M.g.C);
      const x=text(b,'x'),link=toLabel(b,x), ends=kind==='obi'?[O,I]:kind==='obc'?[O,C]:[I,C];
      assert.ok(x.x<B.x-12 && x.y<B.y-10,'x is outside B, not printed on BC or beside I');
      assert.ok(link?.result.drawn,'B target has an explicit visible leader');
      assert.ok(distance(link.a,B)+8<Math.min(distance(link.a,O),distance(link.a,I)),'leader starts near B, away from O/I');
      close(crossAngle(B,ends[0],link.a),crossAngle(B,ends[0],ends[1])/2,'leader identifies the actual requested B angle');
      const arc=b.arcs.find(arc=>distance(arc.at,B)<1e-7 && Math.abs(distance(link.a,B)-arc.r)<1e-6);
      assert.ok(arc,'leader begins on the corresponding B arc');
      assert.ok(distance(x,text(b,`${a}°`))>30,'given condition and target stay distinct');
      unobscured(b);
    }
});

test('t7-1 centers, independent angle math, current-question steps and reentry remain intact', () => {
  const sc=rt.scene('t7-1');
  for(const a of [40,52,56,60,64,76,88])for(const v of [0,1,2]) {
    const s={...rt.state('t7-1'),trMa:a,trV:v}, M=sc.tr.model(s), original=JSON.stringify(M), question=sc.problem.text(s), steps=sc.steps(s);
    const g=M.g; close(crossAngle(g.A,g.B,g.C),a,'actual apex');
    close(distance(g.O,g.A),distance(g.O,g.B),'circumcenterOA=OB');close(distance(g.O,g.B),distance(g.O,g.C),'circumcenterOB=OC');
    close(crossAngle(g.B,g.C,g.I),(180-a)/4,'independent incenter B half-angle');
    close(crossAngle(g.B,g.O,g.I),Math.abs((90-a)-(180-a)/4),'independent requested OBI');
    for(const [W,H,RH] of layouts) {
      const first=draw(rt,'t7-1',s,W,H);unobscured(first);
      assert.ok(!first.texts.some(t=>/^x\s*=/.test(t.text)),'initial figure does not expose a result');
      if(!M.same)for(const name of ['O','I']) {
        const label=text(first,name),link=toLabel(first,label);assert.ok(link?.result.drawn,`${name} name explicitly connects to its point`);
        close(distance(link.a,first.toS(g[name])),0,`${name} leader source is the original center`);
      }
      for(let step=1;step<=steps.length;step++){s.step=step;unobscured(draw(rt,'t7-1',s,W,RH,'review'));}
      assert.equal(JSON.stringify(sc.tr.model(s)),original,'review preserves mathematical model');assert.equal(sc.problem.text(s),question,'review preserves current question');
    }
    const changed={...s,trShow:'opened',playing:true};sc.enter(changed);const fresh=rt.state('t7-1');
    assert.deepEqual(plain(sc.tr.model(changed)),plain(sc.tr.model(fresh)));assert.equal(changed.trShow,null);assert.equal(changed.playing,false);
    assert.deepEqual(picture(draw(rt,'t7-1',changed,360,291)),picture(draw(rt,'t7-1',fresh,360,291)),'reentry restores first picture');
  }
});

if(arg('--compare-scope'))test('other t7 scenes, wide states, inquiry, thumbnails, questions and steps are unchanged', t=>{
  const old=load(arg('--compare-scope'));let frames=0;
  for(const id of ['t7-1','t7-2','t7-3','t7-4','t7-5'])for(const v of [0,1,2]) {
    const s={...rt.state(id),trV:v}, prev={...old.state(id),trV:v};
    assert.deepEqual(plain(rt.scene(id).tr.model(s)),plain(old.scene(id).tr.model(prev)));assert.equal(rt.scene(id).problem.text(s),old.scene(id).problem.text(prev));assert.deepEqual(plain(rt.scene(id).steps(s)),plain(old.scene(id).steps(prev)));
    for(const [W,H]of [[1039,672],[820,461],[683,548],[390,411],[360,387]])for(const tab of ['explore','problem','review']) {
      if(id==='t7-1'&&W<560&&tab!=='explore')continue;
      s.step=prev.step=1;assert.deepEqual(picture(draw(rt,id,s,W,H,tab)),picture(draw(old,id,prev,W,H,tab)),`${id}/${v}/${W}/${tab}`);frames++;
    }
    assert.deepEqual(picture(draw(rt,id,s,240,180,'explore',0,true)),picture(draw(old,id,prev,240,180,'explore',0,true)));frames++;
  }
  t.diagnostic(`${frames} exact unchanged draw outputs`);
});

