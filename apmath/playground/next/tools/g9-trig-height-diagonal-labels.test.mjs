/** Actual initial labels must identify AH and AC rather than crossing another side.
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
const fixture = runtime => runtime.case('quadUnfold2x',q=>q.fig.p===4&&q.fig.q===4&&q.fig.th===45);
for(const id of heightIds)test(id+': the native five-view height value identifies AH instead of a sloping side',()=>{
 const s=rt.state(id),before=JSON.stringify(s),M=rt.scene(id).tg.model(s);
 for(const[W,EH]of views){const b=draw(rt,id,s,W,EH,'explore'),d=heightCheck(b,id+'/'+W);assert.equal(d.label.text.replace(/\s/g,''),('h='+rt.G.vcan(M.h)).replace(/\s/g,''));}
 assert.equal(JSON.stringify(s),before,'drawing does not change conditions or reveal state');
});
test('quadUnfold2x: both native phone problems retain a legible AC condition and its actual AC connector',()=>{
 const s=fixture(rt),before=JSON.stringify(s);
 for(const[W,,PH]of views.filter(v=>v[0]<560)){
  const b=draw(rt,'quadUnfold2x',s,W,PH),d=diagonalCheck(b,'quad '+W);assert.ok(d.link?.result.drawn,'the ambiguous value is visibly attached to AC');
  assert.ok(b.texts.some(t=>t.text==='45°')&&b.texts.some(t=>t.text==='BD = 4')&&b.texts.some(t=>t.text==='□ABCD의 넓이 = x'));
 }
 assert.equal(JSON.stringify(s),before);assert.equal(s.revealed,false);assert.equal(s.playing,false);
});
test('all nineteen standard base lengths retain their correct height value and angle conditions',t=>{
 let count=0;
 for(const id of heightIds)for(let a=2;a<=20;a++)for(const[W,EH]of views){
  const s=rt.state(id);s.t53a=a;const M=rt.scene(id).tg.model(s),b=draw(rt,id,s,W,EH,'explore');heightCheck(b,`${id}/${a}/${W}`);
  const expected=id==='std4560Height'?a/(1+1/Math.sqrt(3)):a*Math.sqrt(3)/2;
  assert.ok(Math.abs(M.h.v-expected)<1e-10);assert.ok(b.texts.some(t=>t.text==='60°'));assert.ok(b.texts.some(t=>t.text===(id==='std4560Height'?'45°':'30°')));count++;
 }
 t.diagnostic(`${count} complete allowed-base/native-view states`);
});
test('current diagonal questions keep the unknown and every staged unfolding while labels identify AC',t=>{
 const s=fixture(rt),scene=rt.scene('quadUnfold2x'),found=new Map([[s.q.key,plain(s.q)]]);
 // Exhaust the actual finite generator: 175 p/q/angle combinations minus the
 // 18 cases it explicitly excludes because the answer equals a given length.
 for(let n=0;n<6000&&found.size<157;n++){const q=scene.tg.gen();found.set(q.key,plain(q));}
 assert.equal(found.size,157,'all permitted current-question condition combinations were generated');
 const cases=[...found.values()];
 let count=0;
 for(const q of cases)for(const[W,,PH]of views)for(const step of[0,1,2,q.solution.steps.length]){
  s.q=plain(q);s.step=step||1;const before=JSON.stringify(s.q),tab=step?'review':'problem',b=draw(rt,'quadUnfold2x',s,W,PH,tab);
  diagonalCheck(b,`${q.key}/${W}/${step}`);assert.equal(JSON.stringify(s.q),before);
  assert.equal(s.revealed,false);assert.equal(s.playing,false);
  const last=step===q.solution.steps.length;assert.ok(b.texts.some(t=>t.text===(last?`□ABCD의 넓이 = ${q.ans[0]}`:'□ABCD의 넓이 = x')),'the original answer disclosure stage is unchanged');count++;
 }
 t.diagnostic(`${cases.length} actual generated conditions; ${count} question/view/stage renderings`);
});
if(arg('--compare-scope'))test('other scenes, mathematical models and original geometry remain unchanged',t=>{
 const old=load(arg('--compare-scope'));let count=0;
 for(const sc of rt.scenes){const s=rt.state(sc.id),z=old.state(sc.id),prev=old.scene(sc.id);
  assert.deepEqual(plain(sc.tg.model(s)),plain(prev.tg.model(z)));assert.deepEqual(plain(s.q),plain(z.q));assert.deepEqual(plain(sc.steps(s)),plain(prev.steps(z)));
  for(const[W,EH,PH]of views)for(const tab of['explore','problem','review']){
   s.step=z.step=1;const a=draw(rt,sc.id,s,W,tab==='explore'?EH:PH,tab),b=draw(old,sc.id,z,W,tab==='explore'?EH:PH,tab);
   const target=heightIds.includes(sc.id)&&tab==='explore'||sc.id==='quadUnfold2x'&&tab!=='explore';
   if(!target)assert.deepEqual(picture(a),picture(b),`${sc.id}/${W}/${tab}: unrelated rendering changed`);
   else{
    assert.deepEqual(plain(a.arcs),plain(b.arcs));assert.deepEqual(plain(a.marks),plain(b.marks));
    const geometry=x=>x.paths.filter(p=>!p.leader&&!(heightIds.includes(sc.id)&&p.options.color==='rose'&&p.options.width===3));
    assert.deepEqual(plain(geometry(a)),plain(geometry(b)),'original outline/fill/altitude/diagonals remain exact');
    assert.deepEqual(plain(a.focus),plain(b.focus),'the figure is not shrunk to make room for the label');
    const words=x=>x.texts.map(t=>t.text.replace(/\s/g,'')).sort();assert.deepEqual(words(a),words(b),'all original conditions and values are retained');
   }count++;
  }
 }
 for(const id of [...heightIds,'quadUnfold2x'])for(const tab of['explore','problem','review']){
  const s=rt.state(id),z=old.state(id);s.step=z.step=1;
  assert.deepEqual(picture(draw(rt,id,s,240,150,tab,true)),picture(draw(old,id,z,240,150,tab,true)),id+': thumbnail unchanged');
 }
 t.diagnostic(`${count} registered scene/view/tab comparisons,9 target thumbnails, and all51 models/current questions/steps`);
});
