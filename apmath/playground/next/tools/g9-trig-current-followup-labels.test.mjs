/** Source-pinned native current-question regressions from Chromium run42657437025.
 * Later revealed AH values and the BD condition must stay on their real target.
 * Production Board coordinates and returned connector geometry complement actual Chromium.
 * --baseline SHA is a negative control; --compare-scope SHA checks preserved behavior.
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
const changed = ['t5', 't7'];
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = x => JSON.parse(JSON.stringify(x));
const distance = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
const near = (p, q) => distance(p, q) < 1e-6;
const heightIds = ['std4560Height', 'std3060Mountain'];
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

const views = [[1039,672,741], [820,461,397], [683,548,613], [390,411,309], [360,387,291]];
const picture = b => plain({ paths: b.paths, arcs: b.arcs, texts: b.texts, marks: b.marks, leaders: b.leaders });
function labelBox(b,t) {
 const x=b._tgBoxes.find(q=>q.s===t.text && Math.abs((q.y0+q.y1)/2-t.y)<1e-7 && Math.abs((q.x0+q.x1)/2-t.x)<3);
 assert.ok(x,'final measured label box exists: '+t.text); return x;
}
const pointIn = (p,q,g=0) => p.x >= q.x0-g && p.x <= q.x1+g && p.y >= q.y0-g && p.y <= q.y1+g;
const overlap = (a,z,g=0) => a.x0 < z.x1+g && a.x1 > z.x0-g && a.y0 < z.y1+g && a.y1 > z.y0-g;
function crosses(a,z,p,q) {
 const cross=(u,v,w)=>(v.x-u.x)*(w.y-u.y)-(v.y-u.y)*(w.x-u.x);
 return cross(a,z,p)*cross(a,z,q) <= 0 && cross(p,q,a)*cross(p,q,z) <= 0 &&
  Math.max(Math.min(a.x,z.x),Math.min(p.x,q.x)) <= Math.min(Math.max(a.x,z.x),Math.max(p.x,q.x)) &&
  Math.max(Math.min(a.y,z.y),Math.min(p.y,q.y)) <= Math.min(Math.max(a.y,z.y),Math.max(p.y,q.y));
}
function touchesBox(a,z,q,gap=3) {
 const r={x0:q.x0-gap,x1:q.x1+gap,y0:q.y0-gap,y1:q.y1+gap};
 if(pointIn(a,r)||pointIn(z,r))return true;
 const ps=[{x:r.x0,y:r.y0},{x:r.x1,y:r.y0},{x:r.x1,y:r.y1},{x:r.x0,y:r.y1}];
 return ps.some((p,i)=>crosses(a,z,p,ps[(i+1)%4]));
}
function verifyLabel(b,t,why) {
 const q=labelBox(b,t);
 assert.ok(q.x0>=4&&q.x1<=b.W-4&&q.y0>=3&&q.y1<=b.H-b.insets.bottom-3,why+': full label is inside the usable stage');
 for(const other of b._tgBoxes)if(other!==q)assert.ok(!overlap(q,other,1),why+': label covers '+other.s);
 return q;
}
function checkLeader(b,link,anchor,label,why,inlineTarget=anchor) {
 assert.equal(link.options.px,true,why+': actual screen-coordinate API');
 assert.ok(near(link.result.anchor,anchor),why+': actual returned anchor matches the stated segment');
 assert.ok(Math.abs(link.result.label.x-label.x)<3&&Math.abs(link.result.label.y-label.y)<1e-7,why+': returned label matches the painted glyph');
 if(link.result.drawn){
  for(const p of[link.result.anchor,link.result.label,link.result.end])assert.ok(p.x>=0&&p.x<=b.W&&p.y>=0&&p.y<=b.H-b.insets.bottom,why+': actual connector remains visible');
  assert.ok(b.paths.some(p=>p.leader&&p.points.length===2&&near(p.points[0],link.result.anchor)&&near(p.points[1],link.result.end)),why+': the verified endpoint is actually painted');
 }else assert.ok(pointIn(inlineTarget,labelBox(b,label)),why+': an undrawn connector is valid only for a label directly on its target');
}
function heightCheck(b,why) {
 const altitude=b.paths.find(p=>p.options.color==='ink'&&p.options.width===5&&p.points.length===2);
 assert.ok(altitude);const [A,H]=altitude.points,anchor={x:(A.x+H.x)/2,y:(A.y+H.y)/2};
 const t=b.texts.find(t=>t.options.color==='rose'),q=verifyLabel(b,t,why);
 for(const side of b.paths.filter(p=>p.options.color==='ink'&&p.options.width===2.6))assert.ok(!touchesBox(...side.points,q),why+': height text sits on an oblique side');
 const links=b.leaders.filter(l=>near(l.result?.anchor||{},anchor)&&Math.abs(l.result.label.y-t.y)<1e-7);
 if(links.length){
  assert.ok(b.paths.some(p=>p.options.color==='rose'&&p.options.width===3&&near(p.points[0],A)&&near(p.points[1],H)),why+': AH itself is highlighted with the height-value color');
  for(const link of links)checkLeader(b,link,anchor,t,why,{x:anchor.x,y:t.y});
 }
 return {label:t,altitude,box:q,relocated:!!links.length};
}
function diagonalCheck(b,why){
 const diagonals=b.paths.filter(p=>p.points.length===2&&p.options.color==='violet'&&p.options.dash);
 assert.equal(diagonals.length,2);const ac=diagonals[0].points,bd=diagonals[1].points;
 const t=b.texts.find(t=>/^AC = /.test(t.text)),q=verifyLabel(b,t,why);
 assert.ok(!touchesBox(...bd,q),why+': AC length lies on diagonal BD');
 const anchor={x:ac[0].x*.72+ac[1].x*.28,y:ac[0].y*.72+ac[1].y*.28};
 const link=b.leaders.find(l=>near(l.result?.anchor||{},anchor)&&Math.abs(l.result.label.y-t.y)<1e-7);
 if(link){checkLeader(b,link,anchor,t,why);assert.ok(link.result.drawn);assert.ok(!crosses(anchor,link.result.end,...bd),why+': AC connector crosses the other diagonal');}
 return {label:t,link,ac,bd};
}

const heightFixture = (runtime, id, ask) => runtime.case(id, q => q.fig.a0 === 4 && q.fig.ask === ask);
const diagonalFixture = runtime => runtime.case('quadUnfold2x', q => q.fig.p === 10 && q.fig.q === 4 && q.fig.th === 45);
const nativeViews = [
 { W:1039, problem:741, review:741, explore:672.4375 },
 { W:820, problem:397, review:461, explore:461 },
 { W:683, problem:613, review:613, explore:548 },
 { W:390, problem:309, review:411, explore:411 },
 { W:360, problem:291, review:387, explore:387 }
];
function drawCurrent(runtime,id,state,view,step) {
 state.step=step||1;
 return draw(runtime,id,state,view.W,step?view.review:view.problem,step?'review':'problem');
}
function anglesStayAtGivenVertices(b, why) {
 const altitude=b.paths.find(p=>p.options.color==='ink'&&p.options.width===5),[A]=altitude.points;
 for(const color of ['sky','green']) {
  const angle=b.angles.find(a=>a.options.color===color&&a.options.label);
  assert.ok(angle,why+': the given angle is rendered');
  const label=angle.texts.find(t=>t.text===angle.options.label);assert.ok(label);
  const q=verifyLabel(b,label,why+'/'+label.text),center={x:label.x,y:label.y};
  assert.ok(distance(center,angle.V)<distance(center,A),why+': a base-angle value migrates to the apex');
  const shortest=Math.min(distance(angle.V,angle.A),distance(angle.V,angle.B));
  assert.ok(angle.options.r<=shortest*.4+1e-6,why+': an angle sector consumes its adjacent short side');
  assert.ok(!pointIn(A,q,4),why+': angle text covers apex A');
 }
}
function bdCheck(b,why) {
 const ds=b.paths.filter(p=>p.points.length===2&&p.options.color==='violet'&&p.options.dash);assert.equal(ds.length,2);
 const ac=ds[0].points,bd=ds[1].points,t=b.texts.find(t=>/^BD = /.test(t.text));assert.ok(t);
 const q=verifyLabel(b,t,why);assert.ok(!touchesBox(...ac,q),why+': BD length lies on diagonal AC');
 const link=b.leaders.find(l=>Math.abs(l.result.label.x-t.x)<3&&Math.abs(l.result.label.y-t.y)<1e-7);
 if(link) {
  const anchor=link.result.anchor,dx=bd[1].x-bd[0].x,dy=bd[1].y-bd[0].y,len2=dx*dx+dy*dy,f=((anchor.x-bd[0].x)*dx+(anchor.y-bd[0].y)*dy)/len2;
  assert.ok(Math.abs((anchor.x-bd[0].x)*dy-(anchor.y-bd[0].y)*dx)<1e-6&&f>.08&&f<.92,why+': returned connector starts inside the actual BD segment');
  checkLeader(b,link,anchor,t,why);assert.ok(link.result.drawn);
  assert.ok(!crosses(anchor,link.result.end,...ac),why+': the BD connector crosses AC');
  for(const other of b._tgBoxes)if(other!==q)assert.ok(!touchesBox(anchor,link.result.end,other,0),why+': BD connector crosses '+other.s);
 }
 return {label:t,link,ac,bd};
}

test('native BC4/45/60/CH=x keeps the revealed AH=6−2√3 on AH through review4 and review5',()=>{
 const s=heightFixture(rt,'std4560Height','ch');assert.equal(s.q.fig.work.h,'6−2√3');
 for(const v of nativeViews)for(const step of [4,5]) {
  const b=drawCurrent(rt,'std4560Height',s,v,step);const h=heightCheck(b,'std4560Height/'+v.W+'/'+step);
  assert.equal(h.label.text,s.q.fig.work.h);assert.equal(s.q.fig.L.CH,'x');
 }
});
test('native BC4/30/60 final AH=2√3 remains on AH rather than the sloping AC',()=>{
 const s=heightFixture(rt,'std3060Mountain','h');assert.equal(s.q.fig.work.h,'2√3');
 for(const v of nativeViews) {const h=heightCheck(drawCurrent(rt,'std3060Mountain',s,v,5),'mountain/'+v.W);assert.equal(h.label.text,'2√3');}
});
test('returned narrow BC4/CH=x problem keeps its original triangle and each base angle recognizable',()=>{
 for(const v of nativeViews.filter(v=>v.W<560)) {
  const s=heightFixture(rt,'std4560Height','ch'),b=drawCurrent(rt,'std4560Height',s,v,0);
  const altitude=b.paths.find(p=>p.options.color==='ink'&&p.options.width===5);assert.ok(distance(...altitude.points)>=100,'the original AH should not be reduced to a 58px diagram');
  anglesStayAtGivenVertices(b,'returned problem/'+v.W);assert.ok(b.texts.some(t=>t.text==='CH = x'));assert.ok(b.texts.some(t=>t.text==='BC = 4'));
  assert.ok(!b.texts.some(t=>t.text===s.q.fig.work.h),'no derived AH value appears before review');
 }
});
test('native AC10/BD4/45 problem, every review step and return preserve the BD condition at BD',()=>{
 const s=diagonalFixture(rt);
 for(const v of nativeViews)for(const step of [0,1,2,3,4,5]) {
  const b=drawCurrent(rt,'quadUnfold2x',s,v,step),d=bdCheck(b,'native BD/'+v.W+'/'+step);diagonalCheck(b,'native AC/'+v.W+'/'+step);
  if(v.W===360&&step===1)assert.ok(d.link?.result.drawn,'ambiguous native BD condition has an actual BD connector');
  assert.equal(d.label.text,'BD = 4');
 }
});
test('all20 generated standard-height conditions keep exact math, target association and staged disclosure',t=>{
 let count=0;
 for(const id of heightIds) {
  const sc=rt.scene(id),s=rt.state(id),cases=new Map(),expected=id==='std4560Height'?15:5;
  for(let i=0;i<4000&&cases.size<expected;i++){const q=sc.tg.gen();cases.set(q.key,plain(q));}
  assert.equal(cases.size,expected);
  for(const q of cases.values())for(const v of nativeViews)for(const step of [0,1,2,3,4,5]) {
   s.q=plain(q);const before=JSON.stringify(s.q);const b=drawCurrent(rt,id,s,v,step),f=s.q.fig;
   assert.equal(JSON.stringify(s.q),before);assert.equal(s.revealed,false);assert.equal(s.playing,false);
   const h=f.a0/(1/Math.tan(f.pair[0]*Math.PI/180)+(f.same?-1:1)/Math.tan(f.pair[1]*Math.PI/180));assert.ok(Math.abs(f.R.h-h)<1e-9);
   const knownHeight=step===5||f.ask!=='h'&&step>=2;
   if(knownHeight)heightCheck(b,id+'/'+q.key+'/'+v.W+'/'+step);
   if(v.W<560)anglesStayAtGivenVertices(b,id+'/'+q.key+'/'+v.W+'/'+step);
   if(f.ask==='h'&&step<5)assert.ok(b.texts.some(t=>t.text==='x'&&t.options.color==='amber'),'the unknown AH stays amber and unknown');
   for(const angle of f.pair)assert.ok(b.texts.some(t=>t.text===angle+'°'));
   assert.ok(b.texts.some(t=>t.text===(step===5?f.work[f.ask]:f.ask==='h'?'x':f.ask.toUpperCase()+' = x')),'the original answer stage is retained');count++;
  }
 }
 t.diagnostic(`${count} question/view/stage renderings from20 actual generator conditions`);
});
test('all157 diagonal questions keep AC and BD distinct across real problem/review canvas heights',t=>{
 const sc=rt.scene('quadUnfold2x'),s=rt.state('quadUnfold2x'),cases=new Map();
 for(let i=0;i<6000&&cases.size<157;i++){const q=sc.tg.gen();cases.set(q.key,plain(q));}assert.equal(cases.size,157);
 let count=0;
 for(const q of cases.values())for(const v of nativeViews)for(const step of [0,1,2,5]) {
  s.q=plain(q);const before=JSON.stringify(s.q),b=drawCurrent(rt,'quadUnfold2x',s,v,step);bdCheck(b,q.key+'/'+v.W+'/'+step);diagonalCheck(b,q.key+'/'+v.W+'/'+step);
  assert.equal(JSON.stringify(s.q),before);assert.equal(s.revealed,false);assert.equal(s.playing,false);
  const m=q.solution.math;assert.ok(Math.abs(m.answer-m.p*m.q*Math.sin(m.angle*Math.PI/180)/2)<1e-8);
  assert.ok(b.texts.some(t=>t.text===(step===5?`□ABCD의 넓이 = ${q.ans[0]}`:'□ABCD의 넓이 = x')));count++;
 }
 t.diagnostic(`${count} current diagonal renderings from157 actual generator conditions`);
});
if(arg('--compare-scope'))test('all models/questions/steps and all unrelated/exploration/thumbnail drawings remain unchanged',t=>{
 const old=load(arg('--compare-scope'));let count=0;
 for(const sc of rt.scenes) {
  const s=rt.state(sc.id),z=old.state(sc.id),prev=old.scene(sc.id);
  assert.deepEqual(plain(sc.tg.model(s)),plain(prev.tg.model(z)));assert.deepEqual(plain(s.q),plain(z.q));assert.deepEqual(plain(sc.steps(s)),plain(prev.steps(z)));
  for(const v of nativeViews)for(const tab of ['explore','problem','review']) {
   s.step=z.step=1;const H=tab==='explore'?v.explore:tab==='review'?v.review:v.problem;
   const a=draw(rt,sc.id,s,v.W,H,tab),b=draw(old,sc.id,z,v.W,H,tab),target=[...heightIds,'quadUnfold2x'].includes(sc.id)&&tab!=='explore';
   if(!target)assert.deepEqual(picture(a),picture(b),sc.id+'/'+v.W+'/'+tab);
   else {
    const geometry=x=>x.paths.filter(p=>!p.leader&&p.options.color==='ink').map(p=>({world:p.world,options:p.options}));assert.deepEqual(plain(geometry(a)),plain(geometry(b)),'the mathematical outline and AH stay unchanged');
    assert.deepEqual(a.texts.map(t=>t.text).sort(),b.texts.map(t=>t.text).sort(),'all original labels and values retained');
   }count++;
  }
 }
 for(const id of [...heightIds,'quadUnfold2x'])for(const tab of ['explore','problem','review']) {
  const s=rt.state(id),z=old.state(id);assert.deepEqual(picture(draw(rt,id,s,240,150,tab,true)),picture(draw(old,id,z,240,150,tab,true)));
 }
 t.diagnostic(`${count} scene/view/tab comparisons,9 target thumbnails; all51 models/current questions/steps`);
});
