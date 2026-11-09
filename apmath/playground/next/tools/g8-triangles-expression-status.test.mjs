// Regression for the independently observed A-name occlusion in t1-7.
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
    const source = baseline && name === 't1'
      ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' })
      : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  context.window.APLab = { clamp: (x, lo, hi) => Math.max(lo, Math.min(hi, x)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const groups = context.window.APL_TR_GROUPS, scenes = groups.flatMap(group => group.scenes);
  const defaults = Object.assign({}, ...groups.map(group => group.params));
  return { context, scenes, G: context.window.APL_TR, scene: id => scenes.find(scene => scene.id === id),
    state(id) { const s = {step:1,revealed:false,playing:false,...Object.fromEntries(Object.entries(defaults).map(([key, param]) => [key, param.value]))}; this.scene(id).enter(s); return s; } };
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




const views = [[1039,652,16,56],[820,461,0,60],[683,528,16,56],[390,411,0,60],[360,387,0,60]];
function frame(runtime,s,v,tab='explore',thumb=false) {
 const [W,H,right,bottom]=v;void right;return draw(runtime,'t1-7',s,W,H,tab,bottom,thumb);
}
const box=(b,value)=>{const q=b.trLabels.find(t=>t.text===value);assert.ok(q,`name ${value} exists`);return q;};
function clearsBadge(b,label,badge){return label.r<=badge.l-6||label.l>=badge.r+6||label.b<=badge.t-6||label.t>=badge.b+6;}
const badgeFor=v=>v[2]?{l:v[0]-209,r:v[0]-12,t:12,b:42.1875}:{l:10,r:207,t:v[1]-40.1875,b:v[1]-10};

test('native tablet-landscape A is visible below the status badge, with the original two expressions',()=>{
 const s=rt.state('t1-7'),b=frame(rt,s,views[2]);
 assert.ok(clearsBadge(b,box(b,'A'),badgeFor(views[2])),'A must clear the real status badge by6px');
 assert.ok(box(b,'A').t>=48,'A stays below the badge band');
 assert.ok(b.texts.some(t=>t.text==='5x−6=19 cm'));assert.ok(b.texts.some(t=>t.text==='2x+3=13 cm'));
 for(const name of ['A','B','C'])box(b,name);unobscured(b);
 assert.equal(s.revealed,false);assert.equal(s.playing,false);
});
test('all initial viewports and all x-control values retain A and the unchanged equations',t=>{
 let count=0;
 for(const v of views)for(let x=2;x<=9;x++){
  const s=rt.state('t1-7');s.trExprX=x;const before=JSON.stringify(s),m=rt.scene('t1-7').tr.model(s),b=frame(rt,s,v);
  assert.ok(clearsBadge(b,box(b,'A'),badgeFor(v)),`A badge clearance ${v[0]}/${x}`);
  assert.equal(m.L1,5*x-6);assert.equal(m.L2,2*x+3);assert.equal(m.eq,x===3);assert.equal(JSON.stringify(s),before);
  assert.ok(b.paths.some(p=>p.points.length===3&&p.options.width===3.6),'original triangle outline remains');
  count++;
 }
 t.diagnostic(`${count} native viewport/control states`);
});
test('reentry returns the visible initial A and resets the equation conditions',()=>{
 const s=rt.state('t1-7'),z={...s,trExprX:9,trQ:{p:2,q:4,r:3,sv:1},playing:true};rt.scene('t1-7').enter(z);
 assert.equal(z.trExprX,5);assert.equal(z.playing,false);assert.deepEqual(picture(frame(rt,z,views[2])),picture(frame(rt,s,views[2])));
});
if(arg('--compare-scope'))test('only desktop t1-7 framing changes; models, questions, steps and other drawings stay exact',t=>{
 const old=load(arg('--compare-scope'));let comparisons=0;
 for(const id of rt.scenes.filter(x=>x.id.startsWith('t1-')).map(x=>x.id)){
  const s=rt.state(id),z=old.state(id),a=rt.scene(id),c=old.scene(id);
  assert.deepEqual(plain(a.tr.model(s)),plain(c.tr.model(z)));assert.equal(a.problem.text(s),c.problem.text(z));assert.deepEqual(plain(a.steps(s)),plain(c.steps(z)));
  for(const v of views)for(const tab of ['explore','problem','review'])for(const thumb of [false,true]){
   s.step=z.step=1;const b=id==='t1-7'?frame(rt,s,v,tab,thumb):draw(rt,id,s,v[0],v[1],tab,v[3],thumb),p=id==='t1-7'?frame(old,z,v,tab,thumb):draw(old,id,z,v[0],v[1],tab,v[3],thumb);
   if(id==='t1-7'&&v[2]>0&&tab==='explore'&&!thumb){assert.deepEqual(b.texts.map(x=>x.text).sort(),p.texts.map(x=>x.text).sort());}
   else assert.deepEqual(picture(b),picture(p),`${id}/${v[0]}/${tab}/${thumb}`);
   comparisons++;
  }
 }
 t.diagnostic(`${comparisons} scope comparisons, all7 t1 models/questions/steps`);
});
