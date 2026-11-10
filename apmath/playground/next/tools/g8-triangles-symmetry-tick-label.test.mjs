// Source-bound native t1-6: angle values obscure PB/PC congruence ticks on phones and portrait tablet.
// Production Board ticks and leader returns; actual Chromium candidate review is separate.
// --baseline <9bf> reproduces failure; --compare-scope <d0> checks unrelated scenes.
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
const ids = ['t1-6'];
const mobile = [[390, 309], [360, 291]];

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
    state(id) { const s = Object.fromEntries(Object.entries(defaults).map(([key, param]) => [key, param.value])); this.scene(id).enter(s); return s; } };
}
const rt = load(arg('--baseline'));

function draw(runtime, id, s, W, H, tab = 'problem', bottom = 58, thumb = false) {
  const proto = runtime.context.window.APLab.Board.prototype, b = Object.create(proto);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { left: 0, right: [1039,683].includes(W) ? 16 : 0, top: 0, bottom },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb, panes: null, paneId: null, focus: { x: [-6, 6], y: [-6, 6] },
    paths: [], arcs: [], texts: [], marks: [], leaders: [], tickLines: [], lw: 1 });
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), options }); return b; };
  b.seg = (p, q, options = {}) => b.path([p, q], options);
  b.circle = (p, r, options = {}) => { b.marks.push({ method: 'circle', at: b.toS(p), r: r * b.k, options }); return b; };
  b.arc = (p, r, a, z, options = {}) => { b.arcs.push({ at: b.toS(p), r: r * b.k, a, z, options }); return b; };
  b.text = (p, text, options = {}) => {
    const q = b.toS(p), size = (options.size || 16) * b.fs * b._ts();
    b.texts.push({ text: String(text), p, x: q.x + (options.dx || 0), y: q.y + (options.dy || 0), size, options }); return b;
  };
  b.leader = (a, z, options) => { const result = proto.leader.call(b, a, z, options); b.leaders.push({ a, z, options, result }); return result; };
  let strokePoints = [], saved = [];
  b.color = value => value;
  b.ctx = { font: '16px sans-serif', strokeStyle: '', lineWidth: 1,
    save() { saved.push({ font: this.font, strokeStyle: this.strokeStyle, lineWidth: this.lineWidth }); },
    restore() { Object.assign(this, saved.pop() || {}); }, setLineDash() {}, beginPath() { strokePoints = []; },
    moveTo(x, y) { strokePoints.push({ x, y }); }, lineTo(x, y) { strokePoints.push({ x, y }); },
    stroke() { b.tickLines.push({ points: strokePoints.slice(), color: this.strokeStyle, width: this.lineWidth }); },
    measureText(value) { const size = Number(this.font.match(/([\d.]+)px/)?.[1] || 16); return { width: runtime.G.textW(value, size) }; }
  };
  b.ticks = (...args) => { b.marks.push({ method: 'ticks', args }); return proto.ticks.call(b, ...args); };
  for (const name of ['right', 'point', 'handle']) b[name] = (...args) => { b.marks.push({ method: name, args }); return b; };
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



function overlaps(a, z, margin = 0) { return a.l < z.r + margin && a.r > z.l - margin && a.t < z.b + margin && a.b > z.t - margin; }
function tickBoxes(b) { return b.tickLines.filter(x => x.color === 'rose').map(x => ({ l: Math.min(...x.points.map(p => p.x)) - x.width / 2, r: Math.max(...x.points.map(p => p.x)) + x.width / 2, t: Math.min(...x.points.map(p => p.y)) - x.width / 2, b: Math.max(...x.points.map(p => p.y)) + x.width / 2 })); }
function blueValues(b, M) { return b.texts.filter(t => t.text === `${M.th}°` && t.options.color === 'sky'); }
function labelBounds(b, item) { const box = b.trLabels.find(x => x.text === item.text && Math.abs((x.l + x.r) / 2 - item.x) < 1e-7 && Math.abs((x.t + x.b) / 2 - item.y) < 1e-7); assert.ok(box); return box; }
function checkTicks(b, M, why) {
  const ticks = tickBoxes(b); assert.equal(ticks.length, 4, 'two actual Board tick strokes on each equal side');
  const values = blueValues(b, M); assert.equal(values.length, 2);
  for (const item of values) for (const tick of ticks) assert.ok(!overlaps(labelBounds(b,item), tick, 4), `${why}: angle${item.text} obscures an equality tick`);
}
test('360,390 and820 initial angle values leave both PB and PC equality marks visible',()=>{
 for(const[W,H]of[[360,387],[390,411],[820,461]]){
  const s=rt.state('t1-6'),M=rt.scene('t1-6').tr.model(s),b=draw(rt,'t1-6',s,W,H,'explore',60);checkTicks(b,M,`${W}initial`);
  for(const item of blueValues(b,M))ownsAngle(b,M,item);
 }
});

function ownsAngle(b, M, item) {
 const V=distance(item.p,M.g.B)<1e-7?M.g.B:M.g.C,a0=Math.atan2(M.g.D.y-V.y,M.g.D.x-V.x),a1=Math.atan2(M.P.y-V.y,M.P.x-V.x);
 const d=((a1-a0+Math.PI*3)%(Math.PI*2))-Math.PI,am=a0+d/2;
 const expected=b.toS({x:V.x+Math.cos(am)*30/b.k,y:V.y+Math.sin(am)*30/b.k});
 const leader=b.leaders.find(l=>distance(l.result?.label||{x:-999,y:-999},item)<1e-7);
 assert.ok(leader?.result.drawn,'relocated value has a visible actual Board leader');
 close(distance(leader.result.anchor,expected),0,'leader starts at the original angle arc');
 close(distance(leader.result.anchor,b.toS(V)),30,'anchor is on the original30px arc');
 for(const q of[leader.result.anchor,leader.result.label,leader.result.end])assert.ok(q.x>=0&&q.x<=b.W&&q.y>=0&&q.y<=b.H-b.insets.bottom,'actual leader stays on usable stage');
 assert.ok(b.arcs.some(q=>distance(q.at,b.toS(V))<1e-7&&Math.abs(q.r-30)<1e-7&&q.options.color==='sky'),'same actual angle arc retained');
}
test('every allowed apex/P position keeps equal-side ticks and actual angle ownership across all five native views',t=>{
 let count=0;
 for(let a=40;a<=120;a+=2)for(let th=10;th<=Math.max(11,(180-a)/2-5);th++)for(const[W,H,bot]of[[360,387,60],[390,411,60],[820,461,60],[683,528,56],[1039,652,56]]){
  const s={...rt.state('t1-6'),trPa:a,trPt:th},M=rt.scene('t1-6').tr.model(s),b=draw(rt,'t1-6',s,W,H,'explore',bot);
  checkTicks(b,M,`${W}/${a}/${th}`);for(const item of blueValues(b,M)){
   const V=distance(item.p,M.g.B)<1e-7?M.g.B:M.g.C,v=b.toS(V),a0=Math.atan2(M.g.D.y-V.y,M.g.D.x-V.x),a1=Math.atan2(M.P.y-V.y,M.P.x-V.x);
   const sweep=((a1-a0+Math.PI*3)%(Math.PI*2))-Math.PI,la=Math.atan2(item.y-v.y,item.x-v.x);
   const position=((Math.sign(sweep)*(la-a0))%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
   if(position>Math.abs(sweep)+1e-7)ownsAngle(b,M,item);
  }unobscured(b);
  close(distance(M.P,M.g.B),distance(M.P,M.g.C),'PB=PC');close(rt.G.angBetween(M.g.B,M.g.D,M.P),M.th,'PBC angle');close(rt.G.angBetween(M.g.B,M.g.A,M.P),M.rest,'ABP angle');count++;
 }
 t.diagnostic(`${count} native-size states cover sliders and the wider P-drag domain`);
});
test('P drag, original conditions, review disclosure and reentry remain intact',()=>{
 const sc=rt.scene('t1-6'),s=rt.state(sc.id),M=sc.tr.model(s),b=draw(rt,sc.id,s,360,387,'explore',60);
 const handle=b.marks.find(x=>x.method==='handle'&&x.args[0]==='P');assert.ok(handle?.args[2]?.drag);
 handle.args[2].drag({x:-Math.tan(30*Math.PI/180),y:0});assert.equal(s.trPt,30);close(distance(sc.tr.model(s).P,sc.tr.model(s).g.B),distance(sc.tr.model(s).P,sc.tr.model(s).g.C),'drag preserves equal sides');
 sc.enter(s);assert.equal(s.trPt,20);assert.equal(picture(draw(rt,sc.id,s,360,387,'explore',60)).arcs.length,picture(b).arcs.length);
 for(const v of[0,1]){
  s.trV=v;const p=draw(rt,sc.id,s,360,291,'problem',60);assert.ok(p.texts.some(t=>t.text==='x'),'unknown remains displayed');
  const ans=v===0?M.rest:180-2*M.th;assert.ok(!p.texts.some(t=>t.text===`x=${ans}°`),'initial question does not show computed answer');
  for(let step=1;step<sc.steps(s).length;step++){s.step=step;const r=draw(rt,sc.id,s,360,387,'review',60);assert.ok(!r.texts.some(t=>t.text===`x=${ans}°`),'answer appears only at its original final stage');}
 }
});
if(arg('--compare-scope'))test('only t1-6 tick-adjacent exploration value placement changes; other registered scene behavior and geometry remain exact',t=>{
 const old=load(arg('--compare-scope'));let count=0;
 for(const sc of rt.scenes){const s=rt.state(sc.id),z=old.state(sc.id),prev=old.scene(sc.id);
  assert.deepEqual(plain(sc.tr.model(s)),plain(prev.tr.model(z)));assert.equal(sc.problem?.text(s),prev.problem?.text(z));assert.deepEqual(plain(sc.steps(s)),plain(prev.steps(z)));
  for(const[W,H,bot]of[[1039,652,56],[820,461,60],[683,528,56],[390,411,60],[360,387,60]])for(const tab of['explore','problem','review']){
   s.step=z.step=1;const a=draw(rt,sc.id,s,W,H,tab,bot),b=draw(old,sc.id,z,W,H,tab,bot);
   if(sc.id==='t1-6'&&tab==='explore'){
    assert.deepEqual(plain(a.arcs),plain(b.arcs),'all existing angle arcs keep exact geometry');assert.deepEqual(plain(a.marks),plain(b.marks),'all existing points, handles and equal-side ticks stay exact');
    if(W===1039)assert.deepEqual(picture(a),picture(b),'unobstructed PC initial placement stays exact');
   }else assert.deepEqual(picture(a),picture(b),`${sc.id}/${W}/${tab}: unrelated drawing changed`);count++;
  }
 }
 t.diagnostic(`${count} scene/view/tab comparisons plus ${rt.scenes.length} registered models/questions/steps`);
});
