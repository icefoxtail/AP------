// c4-5 actual initial/review regression: the radius name was printed on AB.
// Use the production Board and queued-label renderer; Chromium visual review
// is an additional gate. --baseline <SHA> must reproduce the old failure.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const unit = 'apmath/playground/next/labs/g9-circle';
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = x => JSON.parse(JSON.stringify(x));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const same = (a, b) => distance(a, b) < 1e-7;
function load(before) {
  const context = vm.createContext({ window: {}, document: { documentElement: { dataset: {} }, getElementById() {},
    createElement() { return {}; }, head: { append() {} }, addEventListener() {} } });
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 'solutions']) {
    const file = `${unit}/${name}.js`;
    const source = before && name === 't4' ? execFileSync('git', ['show', `${before}:${file}`], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  context.window.APLab = { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const groups = context.window.APL_CI_GROUPS, scenes = groups.flatMap(g => g.scenes), params = Object.assign({}, ...groups.map(g => g.params));
  return { context, scenes, G: context.window.APL_CI, scene: id => scenes.find(s => s.id === id),
    fresh(id) { const s = Object.fromEntries(Object.entries(params).map(([k, p]) => [k, p.value])); this.scene(id).enter(s); return s; } };
}
const rt = load(arg('--baseline'));
function draw(runtime, id, s, W, H, tab = 'problem', thumb = false) {
  const proto = runtime.context.window.APLab.Board.prototype, b = Object.create(proto);
  Object.assign(b, { W, H, kind: 'figure', aspect: '1:1', pad: .02, fs: 1, thumb, panes: null, paneId: null,
    zoom: 1, panX: 0, panY: 0, insets: { top: 0, bottom: thumb ? 0 : 60, left: 0, right: 0 }, focus: { x: [-6, 6], y: [-6, 6] },
    texts: [], paths: [], circles: [], arcs: [], marks: [], leaders: [], inLeader: false });
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), world: points, options, leader: b.inLeader }); return b; };
  b.circle = (p, r, options = {}) => { b.circles.push({ at: b.toS(p), r: r * b.k, world: p, radius: r, options }); return b; };
  b.arc = (p, r, a, z, options = {}) => { b.arcs.push({ at: b.toS(p), r: r * b.k, a, z, options }); return b; };
  b.text = (p, text, options = {}) => { const q = b.toS(p); b.texts.push({ text: String(text), p, x: q.x + (options.dx || 0), y: q.y + (options.dy || 0), options }); return b; };
  b.leader = (anchor, label, options) => {
    b.inLeader = true;
    let result;
    try { result = proto.leader.call(b, anchor, label, options); } finally { b.inLeader = false; }
    b.leaders.push({ anchor, label, options, result }); return result;
  };
  for (const name of ['right', 'ticks', 'point', 'handle']) b[name] = (...args) => { b.marks.push({ name, args }); return b; };
  const sc = runtime.scene(id); sc.draw(b, s, {}, { tab, scene: sc, s }); return b;
}

const views = [[1039,741],[820,396.59375],[683,613],[390,309],[360,291]];
function pointDistance(P,A,B){const dx=B.x-A.x,dy=B.y-A.y,t=Math.max(0,Math.min(1,((P.x-A.x)*dx+(P.y-A.y)*dy)/(dx*dx+dy*dy)));return distance(P,{x:A.x+t*dx,y:A.y+t*dy});}
function verifyRadius(b,M,expected,requireLeader=false){
 const O=b.toS({x:0,y:0}),B=b.toS(M.g.B),C=b.toS(M.g.C),A=b.toS(M.g.A),f=M.q.A0===60?0.3:0.5,anchor={x:O.x+(B.x-O.x)*f,y:O.y+(B.y-O.y)*f};
 const label=b.texts.find(t=>same(t.p,{x:M.g.B.x*f,y:M.g.B.y*f}));
 assert.ok(label,'radius label remains present');assert.equal(label.text,expected,'given radius/hidden answer follows the original stage');
 const link=b.leaders.find(l=>same(l.result.label,label));assert.ok(link?.result,'radius label requests a connector to OB');
 if(requireLeader)assert.ok(link.result.drawn,'the observed initial case renders its radius connector');
 assert.ok(same(link.result.anchor,anchor),'connector begins at its specified point on OB');
 if(link.result.drawn)assert.ok(b.paths.some(p=>p.leader&&p.points.length===2&&same(p.points[0],anchor)&&same(p.points[1],link.result.end)),'rendered connector matches the recorded anchor');
 else assert.ok(pointDistance(label,O,B)+6<Math.min(pointDistance(label,A,B),pointDistance(label,A,C),pointDistance(label,B,C)),'a connector too short to draw is allowed only when the name is already unambiguously closest to OB '+JSON.stringify({q:M.q,W:b.W,H:b.H,label,distances:[pointDistance(label,O,B),pointDistance(label,A,B),pointDistance(label,A,C),pointDistance(label,B,C)]}));
 const cross=P=>(B.x-O.x)*(P.y-O.y)-(B.y-O.y)*(P.x-O.x);
 assert.ok(cross(label)*cross(C)>0,'radius name is on the open C side of OB, not the AB side');
 const box=b.ciLabels.find(r=>r.text===label.text&&Math.abs((r.l+r.r)/2-label.x)<1e-7);
 assert.ok(box,'check the final queued glyph bounds');
 assert.ok(box.l>=12&&box.r<=b.W-12&&box.t>=0&&box.b<=b.H-b.insets.bottom-10,'whole radius glyph is visible');
 assert.ok(pointDistance(label,A,B)>(box.r-box.l)/2+2,'radius name clears the unrelated AB side');
 assert.ok(b.paths.some(p=>!p.leader&&p.world.length===2&&same(p.world[0],{x:0,y:0})&&same(p.world[1],M.g.B)),'original radius line is still drawn');
}
test('c4-5 initial and review radius identifies OB at every native viewport',()=>{
 const s=rt.fresh('c4-5'),sc=rt.scene('c4-5'),M=sc.ci.model(s,{problem:true});
 for(const [W,H]of views)for(const tab of ['problem','review']){s.step=1;verifyRadius(draw(rt,sc.id,s,W,H,tab),M,'x',true);}
});
test('all six question kinds keep their givens, exact answers and reveal stages',t=>{
 let count=0;
 for(let kind=0;kind<6;kind++)for(let a=2;a<=9;a++)for(const [W,H]of views){
  const s=rt.fresh('c4-5'),sc=rt.scene('c4-5');s.ciPk={kind,A0:[30,45,60][kind%3],a,ask:kind<3?'R':'BC',key:`s${kind}.${a}`};
  const M=sc.ci.model(s,{problem:true}),Q=sc.ci.prob(M,s),sol=sc.solution(s),expected=kind<3?a:2*a*Math.sin(s.ciPk.A0*Math.PI/180);
  assert.equal(Q.choices.filter(c=>c.ok).length,1);assert.ok(Math.abs(Q.chk[0]-expected)<1e-8&&Math.abs(Q.chk[1]-expected)<1e-8,'same sine-rule model and answer');
  verifyRadius(draw(rt,sc.id,s,W,H),M,kind<3?'x':String(a));count++;
  for(let step=1;step<=sol.steps.length;step++){s.step=step;verifyRadius(draw(rt,sc.id,s,W,H,'review'),M,kind<3?(step===sol.steps.length?String(sol.display):'x'):String(a));count++;}
  assert.equal(sc.ci.prob(M,s).stem,Q.stem);
 }
 t.diagnostic(`${count} actual Board question/view/stage states`);
});
if(arg('--compare-scope'))test('other pictures, all mathematical models and original construction geometry remain exact',t=>{
 const old=load(arg('--compare-scope')),picture=b=>plain({paths:b.paths,texts:b.texts,circles:b.circles,arcs:b.arcs,marks:b.marks,leaders:b.leaders}),geometry=b=>plain({paths:b.paths.filter(p=>!p.leader),circles:b.circles,arcs:b.arcs,marks:b.marks});let count=0;
 for(const sc of rt.scenes)for(const [W,H]of views)for(const tab of ['explore','problem','review']){
  const s=rt.fresh(sc.id),z=old.fresh(sc.id);s.step=z.step=1;const x=draw(rt,sc.id,s,W,H,tab),y=draw(old,sc.id,z,W,H,tab);
  assert.deepEqual(plain(s),plain(z));assert.equal(sc.problem.text(s),old.scene(sc.id).problem.text(z));assert.deepEqual(plain(sc.solution(s)),plain(old.scene(sc.id).solution(z)));
  assert.deepEqual(geometry(x),geometry(y),sc.id+': construction geometry');
  if(sc.id!=='c4-5'||tab==='explore')assert.deepEqual(picture(x),picture(y),sc.id+': unchanged drawing');count++;
 }
 assert.deepEqual(picture(draw(rt,'c4-5',rt.fresh('c4-5'),240,180,'explore',true)),picture(draw(old,'c4-5',old.fresh('c4-5'),240,180,'explore',true)),'thumbnail preserved');
 t.diagnostic(`${count} scene/view/tab comparisons`);
});
