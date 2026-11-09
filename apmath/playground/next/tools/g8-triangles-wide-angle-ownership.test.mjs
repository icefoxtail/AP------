// Source-bound regression for t5-5 distant desktop angle labels and
// t6-5 tablet-portrait incenter value misplaced onto side BC. Real browser
// captures and independent visual review remain a separate validation gate.
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
const ids = ['t5-1', 't5-2', 't5-5', 't5-6', 't6-5'];
const mobile = [[390, 309], [360, 291]];

function load(baseline) {
  const document = { documentElement: { dataset: {} }, getElementById() {}, createElement() { return {}; }, head: { append() {} }, addEventListener() {} };
  const context = vm.createContext({ window: {}, document, console });
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7']) {
    const file = `${labPath}/${name}.js`;
    const source = baseline && ['t5', 't6'].includes(name)
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
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { left: 0, right: [1039,683].includes(W) ? 16 : 0, top: 0, bottom },
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
const labelBox = (b, value) => {
  const t = text(b, value), box = (b.trLabels || []).find(q => q.text === value && Math.abs((q.l + q.r) / 2 - t.x) < 1);
  assert.ok(box, `layout bounds for ${value}`); return box;
};
const lineDistance = (p, a, z) => Math.abs((z.x - a.x) * (p.y - a.y) - (z.y - a.y) * (p.x - a.x)) / distance(a, z);


const nativeViews = [[1039,741,56],[820,397,60],[683,613,56],[390,309,60],[360,291,60]];
function checkO5(b,M,variant,why){
 const O=b.toS(M.g.O),A=b.toS(M.g.A),B=b.toS(M.g.B),C=b.toS(M.g.C);
 const central=text(b,variant===0?'x':`${M.boc}°`),apex=text(b,variant===0?`${M.a}°`:'x');
 assert.ok(distance(central,O)+10<distance(central,A),`${why}: O angle belongs to O`);
 const link=b.leaders.find(l=>distance(l.result?.anchor||{x:-999,y:-999},O)<1e-7&&distance(l.result?.label||{x:-999,y:-999},central)<1e-7);
 assert.ok(link?.result.drawn,`${why}: O angle has a real leader to O`);
 for(const p of [link.result.anchor,link.result.label,link.result.end])assert.ok(p.x>=0&&p.x<=b.W&&p.y>=0&&p.y<=b.H-b.insets.bottom,`${why}: O leader remains in stage`);
 if(b.W>=560){assert.ok(distance(apex,A)<=72,`${why}: A value is too remote (${distance(apex,A)}px)`);assert.ok(distance(apex,A)+12<Math.min(distance(apex,O),distance(apex,B),distance(apex,C)),`${why}: A value has ambiguous owner`);
  const callout=b.leaders.find(l=>distance(l.result?.anchor||{x:-999,y:-999},A)<1e-7&&distance(l.result?.label||{x:-999,y:-999},apex)<1e-7);assert.ok(callout?.result.drawn,`${why}: A label explicitly connects to A`);
  for(const p of[callout.result.anchor,callout.result.label,callout.result.end])assert.ok(p.x>=0&&p.x<=b.W&&p.y>=0&&p.y<=b.H-b.insets.bottom,'A leader remains on screen');}
 assert.ok(b.arcs.some(a=>distance(a.at,O)<1e-7&&a.r>8),`${why}: original O angle arc visible`);
 close(rt.G.angBetween(M.g.A,M.g.B,M.g.C),M.a,'angleA geometry');close(rt.G.angBetween(M.g.O,M.g.B,M.g.C),M.boc,'angleBOC geometry');
 assert.ok(!b.texts.some(t=>t.text===(variant===0?`${M.boc}°`:`${M.a}°`)&&distance(t.p,variant===0?M.g.O:M.g.A)<1e-7),'requested angle remains hidden initially; an equal numeric given at another vertex is allowed');
}
function checkN5(b,M,variant,why){
 const I=b.toS(M.g.I),B=b.toS(M.g.B),C=b.toS(M.g.C),value=variant===0?'x':`${M.bic}°`,q=text(b,value),box=labelBox(b,value);
 assert.ok(box.b<=Math.min(B.y,C.y)-6,`${why}: angle x is on sideBC (${box.b}/${B.y})`);
 assert.ok(box.t>=I.y+5,`${why}: angle value stays within IBC`);
 assert.ok(distance(q,text(b,'I'))>=22,`${why}: incenter name and angle are distinct`);
 assert.ok(b.arcs.some(a=>distance(a.at,I)<1e-7&&a.r>5),'the true I angle retains an arc');
 close(rt.G.angBetween(M.g.I,M.g.B,M.g.C),90+M.al,'BIC=90+A/2');
}
test('t5-5 all five native viewports attach both given and unknown angles to their actual vertices',t=>{
 for(const [W,H,bot]of nativeViews)for(const variant of[0,1])for(const tab of['problem',...([1039,360].includes(W)?['review']:[])]){
  const s=rt.state('t5-5');s.trV=variant;s.step=1;const M=rt.scene('t5-5').tr.model(s),b=draw(rt,'t5-5',s,W,tab==='review'&&W===360?387:H,tab,bot);checkO5(b,M,variant,`${W}/${variant}/${tab}`);
  if(W>=560)t.diagnostic(`${W}px A label distance ${distance(text(b,variant===0?'112°':'x'),b.toS(M.g.A)).toFixed(2)}px`);
 }
});
test('t5-5 all supported obtuse and base angles retain explicit O association on wide layouts',()=>{
 const sc=rt.scene('t5-5');
 for(let a=100;a<=130;a+=2)for(let c=15;c<=40;c++)for(const [W,H,bot]of nativeViews.slice(0,3))for(const variant of[0,1]){
  const s={...rt.state(sc.id),trQa:a,trQb:c,trV:variant};checkO5(draw(rt,sc.id,s,W,H,'problem',bot),sc.tr.model(s),variant,`${W}/${a}/${c}/${variant}`);
 }
});
test('t6-5 tablet and desktop angle values fit the actual I-to-BC space',t=>{
 const sc=rt.scene('t6-5');
 for(const [W,H,bot]of nativeViews)for(const variant of[0,1])for(const tab of['problem',...([1039,360].includes(W)?['review']:[])]){
  const s={...rt.state(sc.id),trV:variant,step:1},M=sc.tr.model(s),b=draw(rt,sc.id,s,W,tab==='review'&&W===360?387:H,tab,bot);checkN5(b,M,variant,`${W}/${variant}/${tab}`);
  t.diagnostic(`${W}px BC clearance ${(b.toS(M.g.B).y-labelBox(b,variant===0?'x':'120°').b).toFixed(2)}px`);
 }
});
test('t6-5 all supported angle inputs and reverse problem retain the interior angle target',()=>{
 const sc=rt.scene('t6-5');
 for(let a=20;a<=40;a++)for(let z=20;z<=40;z++)for(const [W,H,bot]of nativeViews.slice(0,3))for(const variant of[0,1]){
  const s={...rt.state(sc.id),trNa:a,trNb:z,trV:variant},M=sc.tr.model(s);checkN5(draw(rt,sc.id,s,W,H,'problem',bot),M,variant,`${W}/${a}/${z}/${variant}`);
 }
});
function checkO6(b,M,why){
 const C=b.toS(M.g.C),O=b.toS(M.g.O),x=text(b,'x');
 assert.ok(distance(x,C)+8<distance(x,O),`${why}: inscribed x is closer to O than its true C vertex`);
 for(const t of b.texts.filter(t=>/^[1-6]$/.test(t.text)))assert.ok(distance(t,x)>=22,`${why}: x is mixed with central ratio ${t.text}`);
 assert.ok(b.arcs.some(a=>distance(a.at,C)<1e-7&&a.r>8),'C angle retains its own arc');
 if(b.W>=560&&b.k<140){
  const link=b.leaders.find(l=>distance(l.result?.label||{x:-999,y:-999},x)<1e-7&&distance(l.result?.anchor||{x:-999,y:-999},C)<35);
  assert.ok(link?.result.drawn,'compact external C value has an actual leader to its own arc');
  close(distance(link.result.anchor,C),Math.min(34,.24*b.k),'C leader anchor lies on its actual arc');
  for(const p of[link.result.anchor,link.result.label,link.result.end])assert.ok(p.x>=0&&p.x<=b.W&&p.y>=0&&p.y<=b.H-b.insets.bottom,'C leader remains within stage');
 }
 assert.ok(!b.texts.some(t=>distance(t.p,M.g.C)<1e-7&&t.text===`${M.ab/2}°`),'inscribed answer remains hidden');
 close(rt.G.angBetween(M.g.C,M.g.A,M.g.B),M.ab/2,'inscribed angle = half central angle');
}
test('t5-6 five native problem sizes keep inscribed x at C rather than inside central-angle ratios',()=>{
 const s=rt.state('t5-6'),M=rt.scene('t5-6').tr.model(s);
 for(const[W,H,bot]of nativeViews)checkO6(draw(rt,'t5-6',s,W,H,'problem',bot),M,`${W}initial`);
});
test('t5-6 all216 ratio inputs preserve C ownership on the three wider native boards',()=>{
 const sc=rt.scene('t5-6');
 for(let a=1;a<=6;a++)for(let z=1;z<=6;z++)for(let c=1;c<=6;c++)for(const[W,H,bot]of nativeViews.slice(0,3)){
  const s={...rt.state(sc.id),trRa:a,trRb:z,trRc:c},M=sc.tr.model(s);checkO6(draw(rt,sc.id,s,W,H,'problem',bot),M,`${W}/${a}:${z}:${c}`);
 }
});
if(arg('--compare-scope'))test('models/questions/answer stages and all other scene/state pictures are unchanged',()=>{
 const old=load(arg('--compare-scope'));
 for(const sc of rt.scenes){const s=rt.state(sc.id),z=old.state(sc.id),prev=old.scene(sc.id);
  assert.deepEqual(plain(sc.tr.model(s)),plain(prev.tr.model(z)),sc.id+'model');assert.equal(sc.problem?.text(s),prev.problem?.text(z),sc.id+'problem');assert.deepEqual(plain(sc.steps(s)),plain(prev.steps(z)),sc.id+'steps');
  for(const [W,H,bot]of nativeViews)for(const tab of['explore','problem','review']){
   s.step=z.step=1;
   if(['t5-5','t5-6','t6-5'].includes(sc.id)&&W>=560&&tab!=='explore')continue;
   assert.deepEqual(picture(draw(rt,sc.id,s,W,H,tab,bot)),picture(draw(old,sc.id,z,W,H,tab,bot)),`${sc.id}/${W}/${tab}`);
  }
 }
 for(const id of['t5-5','t5-6','t6-5'])for(const variant of[0,1,2]){
  const s={...rt.state(id),trV:variant},z={...old.state(id),trV:variant};const sc=rt.scene(id),prev=old.scene(id);
  assert.deepEqual(plain(sc.tr.model(s)),plain(prev.tr.model(z)));assert.equal(sc.problem.text(s),prev.problem.text(z));assert.deepEqual(plain(sc.steps(s)),plain(prev.steps(z)));
  for(let step=1;step<=sc.steps(s).length;step++){s.step=z.step=step;assert.equal(sc.problem.answer(s),prev.problem.answer(z),'final answer remains the same');}
 }
});
