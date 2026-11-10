// Actual Board projection regression for the confirmed p2-2 360px initial P1.
// The bottom angle value must not be covered by the two sum captions.
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
const unit = 'apmath/playground/next/labs/g7-parallel';
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = value => JSON.parse(JSON.stringify(value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const close = (a, b, why) => assert.ok(Math.abs(a - b) < 1e-7, `${why}: ${a} != ${b}`);
const angle = (v, p, q) => {
  const a = { x: p.x - v.x, y: p.y - v.y }, b = { x: q.x - v.x, y: q.y - v.y };
  return Math.atan2(Math.abs(a.x * b.y - a.y * b.x), a.x * b.x + a.y * b.y) * 180 / Math.PI;
};
function load(baseline) {
  const context = vm.createContext({ window: {}, document: { documentElement: { dataset: {} }, getElementById() {},
    createElement() { return {}; }, head: { append() {} }, addEventListener() {} } });
  let seed = 14791;
  context.Math = Object.create(Math);
  context.Math.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  for (const name of ['kit', 't1', 't2', 't3', 't4']) {
    const file = `${unit}/${name}.js`;
    const source = baseline && name === 't2' ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  context.window.APLab = { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const scenes = context.window.APL_PA_GROUPS.flatMap(group => group.scenes);
  return { context, scenes, G: context.window.APL_PA_KIT, scene: id => scenes.find(s => s.id === id),
    state(id, patch = {}) { seed = 14791; const s = { step: 1, revealed: false }; this.scene(id).enter(s); return Object.assign(s, patch); } };
}
const rt = load(arg('--baseline'));
function draw(runtime, W, H, tab, s = runtime.state('p2-2'), id = 'p2-2', thumb = false) {
  const b = Object.create(runtime.context.window.APLab.Board.prototype);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { top: 0, bottom: thumb ? 0 : 58, left: 0, right: 0 },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb, panes: null, paneId: null, focus: runtime.scene(id).focus(s), texts: [], paths: [], arcs: [], marks: [], leaders: [] });
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
function validate(b, m, why) {
  const vertex = m.V.at(-1), target = b.texts.find(t => t.text === `${m.W.at(-1).val}°` && distance(t.p, vertex) < 1e-7);
  const captions = b.texts.filter(t => /^(오른쪽|왼쪽)으로/.test(t.text));
  assert.ok(target); assert.equal(captions.length, 2);
  for (const caption of captions) assert.ok(gap(target, caption) >= 8, `${why}: bottom angle ${target.text} meets sum caption, gap=${gap(target, caption)}`);
  assert.ok(target.l >= 4 && target.r <= b.W - 4 && target.t >= 0 && target.b <= b.H - b.insets.bottom, 'bottom condition is on screen');
  for (const label of b.texts) if (label !== target) assert.ok(gap(target, label) >= 3, `${why}: angle covers ${label.text}`);
  const leader = b.leaders.find(l => distance(l.result?.label || { x: -999,y: -999 }, target) < 1e-7);
  assert.ok(leader?.result.drawn, 'outside label has an actual drawn leader');
  for (const point of [leader.result.anchor, leader.result.label, leader.result.end]) assert.ok(point.x >= 0 && point.x <= b.W && point.y >= 0 && point.y <= b.H - b.insets.bottom, 'actual leader endpoints stay on screen');
  const w = m.W.at(-1), result = rt.G.wedge({ ...b, arc() {}, right() {}, text() {}, leader: null }, w.V,w.d1,w.d2,{text:'',r:25});
  const expected = b.toS(rt.G.at(w.V,result.bis,22/b.k));
  close(distance(leader.result.anchor, expected),0,'leader begins at its own actual angle arc');
  assert.ok(b.paths.some(p => p.points.length === 2 && distance(p.points[0],leader.result.anchor)<1e-7 && distance(p.points[1],leader.result.end)<1e-7),'production path draws the verified endpoints');
  return gap(target,captions[0]);
}
for (const [W,H] of [[360,307],[390,326]]) {
  test(`p2-2 ${W}px bottom given angle remains separate from both sum captions`, t => {
    const s=rt.state('p2-2'),m=rt.scene('p2-2').pa.model(s),b=draw(rt,W,H,'explore',s);t.diagnostic(`bottom angle-to-caption gap ${validate(b,m,`${W}initial`).toFixed(2)}px`);
  });
  test(`p2-2 ${W}px 1–3 bends and every endpoint angle preserve label ownership`, () => {
    for (let k=1;k<=3;k++) for(let last=30;last<=80;last++) for(const rest of [30,55,80]) for(const aux of [0,1]) {
      const patch={kK:k,uA:rest,uB:rest,uC:rest,uD:rest,zAux:aux,step:3};patch[['uA','uB','uC','uD'][k]]=last;
      const s=rt.state('p2-2',patch),m=rt.scene('p2-2').pa.model(s);
      close(m.sumR,m.sumL,'alternating angle sums');
      for(const tab of ['explore','review'])validate(draw(rt,W,H,tab,s),m,`${W}/${k}/${last}/${rest}/${aux}/${tab}`);
    }
  });
}
test('problem unknown, sum identity, handle mutations and reset retain original behavior',()=>{
 const sc=rt.scene('p2-2');
 for(let k=1;k<=3;k++)for(let target=0;target<=k+1;target++){
  const s=rt.state('p2-2',{kK:k,zTar:target}),m=sc.pa.model(s),q=sc.pa.prob(m),b=draw(rt,360,291,'problem',s);
  assert.equal(q.choices.filter(c=>c.ok).length,1);close(q.choices.find(c=>c.ok).v,m.W[target].val,'unknown value');
  assert.ok(b.texts.some(t=>t.text==='x'&&distance(t.p,m.V[target])<1e-7));assert.ok(!b.texts.some(t=>/으로 열린/.test(t.text)),'sum caption remains hidden in problem');
  const live=draw(rt,360,307,'explore',s),handle=live.marks.find(x=>x.name==='handle'&&x.args[0]==='hEndB');assert.ok(handle);handle.args[2].drag({x:m.V[k+1].x+1,y:m.V[k+1].y});assert.ok(s[['uA','uB','uC','uD'][k]]>=30&&s[['uA','uB','uC','uD'][k]]<=80);
  sc.enter(s);assert.equal(s.kK,2);assert.equal(s.uC,60);assert.equal(s.zAux,0);assert.equal(s.playing,false);
 }
});
if(arg('--compare-scope'))test('all other scenes and normal problem/review/wide layouts remain unchanged',()=>{
 const old=load(arg('--compare-scope'));const signature=b=>plain({texts:b.texts,paths:b.paths,arcs:b.arcs,marks:b.marks,leaders:b.leaders});
 for(const sc of rt.scenes){const s=rt.state(sc.id),z=old.state(sc.id),os=old.scene(sc.id);
  assert.deepEqual(plain(sc.pa.model(s)),plain(os.pa.model(z)));assert.deepEqual(plain(sc.pa.prob(sc.pa.model(s))),plain(os.pa.prob(os.pa.model(z))));assert.deepEqual(plain(sc.steps(s)),plain(os.steps(z)));
  for(const [W,H]of[[1039,656],[820,461],[683,528],[390,326],[360,307]])for(const tab of['explore','review','problem']){
   const a=draw(rt,W,H,tab,s,sc.id),b=draw(old,W,H,tab,z,sc.id);
   if(sc.id!=='p2-2'||W>=560||tab!=='explore')assert.deepEqual(signature(a),signature(b),`${sc.id}/${W}/${tab}`);
   else{assert.deepEqual(plain(a.paths.filter(p=>p.options.color!=='muted')),plain(b.paths.filter(p=>p.options.color!=='muted')));assert.deepEqual(plain(a.arcs),plain(b.arcs));assert.deepEqual(plain(a.marks),plain(b.marks));}
  }
  assert.deepEqual(signature(draw(rt,240,180,'explore',s,sc.id,true)),signature(draw(old,240,180,'explore',z,sc.id,true)),`${sc.id}thumb`);
 }
});
