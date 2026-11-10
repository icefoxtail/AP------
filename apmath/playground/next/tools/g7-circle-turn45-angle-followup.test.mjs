// Given B-angle visibility regression for the rl-turn45 rotating triangle.
// Native Chromium captures are reviewed independently; these are production-Board contracts.
// Negative control: node this-file --baseline <SHA>. This VM checks math and drawing commands;
// it does not replace a real browser, layout audit, or physical-device review.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const labs = path.join(root, 'labs');
const call = (value, ...args) => typeof value === 'function' ? value(...args) : value;
const numericArgs = { moveTo: [0, 1], lineTo: [0, 1], rect: [0, 1, 2, 3], fillRect: [0, 1, 2, 3], clearRect: [0, 1, 2, 3], arc: [0, 1, 2, 3, 4], ellipse: [0, 1, 2, 3, 4, 5, 6], fillText: [1, 2], strokeText: [1, 2], bezierCurveTo: [0, 1, 2, 3, 4, 5], quadraticCurveTo: [0, 1, 2, 3], setTransform: [0, 1, 2, 3, 4, 5] };
function canvas() {
  const keys=['font','fillStyle','strokeStyle','globalAlpha','lineWidth','lineCap','lineJoin','textAlign','textBaseline','shadowBlur','shadowColor','shadowOffsetX','shadowOffsetY'],stack=[];
  const state={measureText: (text) => ({ width: String(text).length * 8 })};
  state.save=()=>stack.push(Object.fromEntries(keys.map(k=>[k,state[k]])));
  state.restore=()=>{const old=stack.pop();if(old)for(const k of keys)if(old[k]===undefined)delete state[k];else state[k]=old[k];};
  const context = new Proxy(state, {
    get(target, key) {
      if (key in target) return target[key];
      return (...args) => {
        for (const index of numericArgs[key] || []) assert.ok(Number.isFinite(args[index]), `${String(key)} coordinate ${index} must be finite; got ${String(args[index])}`);
      };
    },
    set(target, key, value) { target[key] = value; return true; }
  });
  return { width: 1000, height: 650, getContext: () => context };
}

const flag = name => { const i=process.argv.indexOf(name); return i<0?null:process.argv[i+1]; };
const source = (file,revision) => revision && file.endsWith('/g7-circle-sector/rolling.js') ? execFileSync('git',['show',revision+':apmath/playground/next/labs/g7-circle-sector/rolling.js'],{encoding:'utf8'}) : fs.readFileSync(file,'utf8');
async function load(initialHash = '',revision=flag('--baseline')) {
  let context;
  const ready = [];
  const element = (tag) => tag === 'canvas' ? canvas() : { tagName: tag.toUpperCase(), dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, append() {} };
  const document = { getElementById() { return null; }, querySelector() { return null; }, createElement: element, createTextNode: (text) => ({ textContent: text }), addEventListener() {}, documentElement: element('html'), body: element('body'), head: element('head') };
  document.head.append = (el) => {
    if (el.tagName !== 'SCRIPT') return;
    vm.runInContext(source(path.join(labs, el.src),revision), context, { filename: el.src });
    el.onload?.();
  };
  const sandbox = { document, console, Math, URLSearchParams, performance, setTimeout, clearTimeout, requestAnimationFrame: () => 0, cancelAnimationFrame() {}, devicePixelRatio: 1, location: { hash: initialHash, search: '', pathname: '/labs/g7-circle-sector.html' }, history: { replaceState() {} }, localStorage: { getItem() { return null; }, setItem() {} }, getComputedStyle: () => ({ getPropertyValue: (key) => key === '--font-ui' ? 'sans-serif' : key === '--m-glow' ? '0' : '#ffffff' }), matchMedia: () => ({ matches: false }), addEventListener: (event, fn) => { if (event === 'DOMContentLoaded') ready.push(fn); } };
  sandbox.window = sandbox;
  context = vm.createContext(sandbox);
  for (const filename of ['apl-core.js', 'apl-board.js']) vm.runInContext(fs.readFileSync(path.join(root, 'kit', filename), 'utf8'), context, { filename });
  let definition;
  context.APLab.createLab = (def) => { definition = def; };
  const html = fs.readFileSync(path.join(labs, 'g7-circle-sector.html'), 'utf8');
  const script = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map((x) => x[1]).find((x) => x.includes('const PI = Math.PI'));
  vm.runInContext(script, context, { filename: 'g7-circle-sector.html' });
  ready.forEach((fn) => fn());
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.ok(definition, 'production module loader creates the lab');
  // The real shell clones scene definitions while adding group metadata.
  const list = definition.groups.flatMap((group) => group.scenes.map((scene) => ({ ...scene })));
  const board = new context.APLab.Board(canvas(), { ...definition.board, interactive: false });
  board.resize(1000, 650);
  const lab = { def: definition, list, board, index: 0, tab: 'explore', s: { ...definition.state }, params: { ...definition.params }, refs: {}, invalidate() {}, _buildReview() {}, get scene() { return this.list[this.index]; } };
  for (const [key, param] of Object.entries(lab.params)) lab.s[key] = param.value;
  context.lab = lab;
  lab._answerOpen = () => lab.s.revealed || lab.s.step >= call(lab.scene.steps, lab.s).length;
  lab._measureFocus = (scene) => {
    const value = call(scene.view, lab.s, lab), run = () => board.measure(() => scene.draw(board, lab.s, value, lab));
    let box = run(); if (!box) return null;
    const options = { margin: 0.08, px: 12 }, keep = { focus: board.focus, zoom: board.zoom, panX: board.panX, panY: board.panY };
    Object.assign(board, { focus: board.fitBox(box, options), zoom: 1, panX: 0, panY: 0 });
    box = run() || box; Object.assign(board, keep);
    return board.fitBox(box, options);
  };
  lab.go = (id) => {
    lab.index = list.findIndex((scene) => scene.id === id);
    assert.ok(lab.index >= 0, `scene ${id} exists`);
    // Match the real shell: the destination tab is set before enter/focus.
    lab.tab = 'explore';
    Object.assign(lab.s, { step: lab.scene.startStep ?? (lab.scene.steps ? 1 : 0), revealed: false, playing: false });
    board.kind = lab.scene.boardKind || definition.board.kind;
    definition.enter?.(lab.s, lab.scene, lab);
    lab.scene.enter?.(lab.s, lab);
    board.setFocus(call(lab.scene.focus, lab.s) || { x: [-10, 40], y: [-20, 15] }, true);
    lab.tab = 'explore';
    return lab.scene;
  };
  lab.draw = () => {
    const texts = [], textItems = [], original = board._text;
    board._text = function (x, y, text, options, screen) { if (text != null && !board._bbox) { texts.push(String(text)); textItems.push({ x, y, text: String(text), options, screen, size: board.annotationSize(text, options) }); } return original.call(this, x, y, text, options, screen); };
    try { const value = call(lab.scene.view, lab.s, lab); board.begin(); lab.scene.draw(board, lab.s, value, lab); board.end(); return { texts, textItems, value }; }
    finally { board._text = original; }
  };
  return lab;
}

const ids=['rl-rect','rl-tri','rl-rtri','rl-turn60','rl-turn45','rl-semi','rl-square'];
const views=[{W:1039,H:536,top:57,right:16,bottom:56},{W:820,H:397,top:56,right:0,bottom:60},{W:683,H:378,top:57,right:16,bottom:56},{W:390,H:345,top:56,right:0,bottom:60},{W:360,H:327,top:56,right:0,bottom:60}];
const plain=value=>JSON.parse(JSON.stringify(value));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const midpoint=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
const intersect=(a,b,gap=0)=>a.left<b.right+gap&&a.right>b.left-gap&&a.top<b.bottom+gap&&a.bottom>b.top-gap;
function box(t){const {width,height}=t.size;return {left:t.x-width/2,right:t.x+width/2,top:t.y-height/2,bottom:t.y+height/2};}
function setup(lab,id,view,tab='explore',step=1,t=0){lab.go(id);lab.tab=tab;lab.s.step=step;lab.s.rlT=t;lab.board.resize(view.W,view.H);lab.board.setInsets({top:view.top,right:view.right,bottom:view.bottom,left:0});return lab;}
function capture(lab){
  const b=lab.board,restore=[],leaders=[],segments=[],arcs=[],polys=[],rawArcs=[];
  const wrap=(obj,key,fn)=>{const original=obj[key];obj[key]=fn(original);restore.push(()=>obj[key]=original);};
  wrap(b,'leader',original=>function(a,p,o){const result=original.call(this,a,p,o);leaders.push({options:plain(o),result:plain(result)});return result;});
  wrap(b,'seg',original=>function(a,p,o={}){segments.push({from:this.toS(a),to:this.toS(p),world:plain([a,p]),options:plain(o)});return original.call(this,a,p,o);});
  wrap(b,'poly',original=>function(points,o={}){polys.push({world:plain(points),screen:points.map(p=>this.toS(p)),options:plain(o)});return original.call(this,points,o);});
  wrap(b,'arc',original=>function(c,r,start,end,o={}){arcs.push({at:this.toS(c),r:r*this.k,start,end,options:plain(o)});return original.call(this,c,r,start,end,o);});
  wrap(b.ctx,'arc',original=>function(x,y,r,start,end,cw){rawArcs.push({at:{x,y},r,start,end,cw,color:this.strokeStyle,lineWidth:this.lineWidth});return original.call(this,x,y,r,start,end,cw);});
  try {const f=lab.draw();return {...f,leaders,segments,arcs,polys,rawArcs,focus:plain(b.focus)};}finally{restore.reverse().forEach(fn=>fn());}
}

function pointOnArc(a, u) { const theta=a.start+(a.end-a.start)*u; return {x:a.at.x+a.r*Math.cos(theta),y:a.at.y+a.r*Math.sin(theta)}; }
function crossing(rect,a,b,pad=0){
  let lo=0,hi=1;
  for(const [v,d,min,max]of [[a.x,b.x-a.x,rect.left-pad,rect.right+pad],[a.y,b.y-a.y,rect.top-pad,rect.bottom+pad]]){
    if(Math.abs(d)<1e-10){if(v<min||v>max)return false;}
    else{const q=(min-v)/d,r=(max-v)/d;lo=Math.max(lo,Math.min(q,r));hi=Math.min(hi,Math.max(q,r));if(lo>hi)return false;}
  }
  return true;
}
function givenCondition(lab,f,why){
  const shape=f.polys.find(p=>p.options.fill==='ink'); assert.ok(shape,`${why}: current triangle is drawn`);
  const [B,C,A]=shape.screen, ba={x:A.x-B.x,y:A.y-B.y},bc={x:C.x-B.x,y:C.y-B.y};
  const deg=Math.acos(Math.max(-1,Math.min(1,(ba.x*bc.x+ba.y*bc.y)/Math.hypot(ba.x,ba.y)/Math.hypot(bc.x,bc.y))))*180/Math.PI;
  assert.ok(Math.abs(deg-lab.s.cfg.deg)<1e-7,`${why}: given angle agrees with the actual rigid triangle`);
  const arc=f.rawArcs.find(a=>dist(a.at,B)<1e-7&&Math.abs(a.r-22)<1e-7&&Math.abs(a.lineWidth-2*lab.board.lw)<1e-7);
  assert.ok(arc,`${why}: given B-angle mark remains painted at B`);
  const anchor=pointOnArc(arc,.5),preferred={x:B.x+(anchor.x-B.x)*37/22,y:B.y+(anchor.y-B.y)*37/22};
  const leader=f.leaders.find(l=>l.options.ref==='rolling-given-angle');
  const candidates=f.textItems.filter(t=>t.text===`${Math.round(deg)}°`&&t.options.color==='amber');
  assert.ok(candidates.length,`${why}: given angle value is drawn`);
  const expected=leader?.result?.label||preferred;
  const label=candidates.sort((a,b)=>dist(a,expected)-dist(b,expected))[0];
  if(leader){
    assert.ok(leader.result?.drawn,`${why}: moved angle callout has a painted connector`);
    assert.ok(dist(leader.result.anchor,anchor)<1e-7,`${why}: connector reaches the actual B-angle arc, not the rotation centre`);
    assert.ok(dist(label,leader.result.label)<1e-7,`${why}: connector is attached to the given value`);
    assert.ok(f.segments.some(s=>s.options.ref==='rolling-given-angle'&&dist(s.from,anchor)<1e-7&&dist(s.to,leader.result.end)<1e-7),`${why}: connector output is actually painted`);
  }else assert.ok(dist(label,preferred)<1e-7,`${why}: unchanged given label belongs to the B-angle mark`);
  const bounds=box(label),b=lab.board;
  assert.ok(bounds.left>=4&&bounds.right<=b.W-(b.W<560?26:4)&&bounds.top>=b.insets.top+2&&bounds.bottom<=b.H-b.insets.bottom-2,`${why}: given angle remains in the unobscured stage`);
  for(const other of f.textItems)if(other!==label)assert.ok(!intersect(bounds,box(other),1),`${why}: B angle overlaps ${other.text}`);
  for(const a of f.arcs.filter(a=>a.options.width===5&&a.options.part!=null)){
    const steps=Math.ceil(Math.abs(a.end-a.start)*a.r/.5);
    for(let i=1;i<=steps;i++)assert.ok(!crossing(bounds,pointOnArc(a,(i-1)/steps),pointOnArc(a,i/steps),a.options.width/2),`${why}: moving-point trajectory covers the given B angle`);
  }
  return {label,leader};
}

await test('rl-turn45 actual 360px middle and dragged frames keep the B-angle condition visible',async()=>{
  const lab=await load();
  for(const progress of [.5,.3484779827967883]){
    setup(lab,'rl-turn45',views.at(-1),'explore',1,progress);
    const f=capture(lab),result=givenCondition(lab,f,`actual 360/${progress}`);
    assert.ok(result.leader,'the original overlapping condition is connected to the B-angle mark');
  }
});

await test('given B angle remains readable across all slider angle/length values and the five real stage sizes',async t=>{
  const lab=await load(); let count=0;
  for(const view of views)for(let d=4;d<=12;d++)for(let deg=20;deg<=70;deg+=5)for(const progress of [.3484779827967883,.5,1]){
    setup(lab,'rl-turn45',view,'explore',1,progress);lab.s.cfg={...lab.s.cfg,d,deg};
    givenCondition(lab,capture(lab),`${view.W}/${d}/${deg}/${progress}`);count++;
  }
  t.diagnostic(`${count} production Board condition/trajectory/glyph checks; real Chromium after review is still required`);
});

if(flag('--compare-scope'))await test('other rolling scenes, all initial tabs, and turn45 math/trajectories keep their production behavior',async t=>{
  const current=await load(),old=await load('',flag('--compare-scope')); let count=0;
  const geometry=f=>plain({focus:f.focus,polys:f.polys,arcs:f.arcs,rawArcs:f.rawArcs,value:f.value,segments:f.segments.filter(s=>!String(s.options.ref||'').startsWith('rolling-'))});
  for(const view of views)for(const id of ids)for(const[tab,step,progress]of [['explore',1,0],['problem',1,0],['review',1,0],['explore',1,.3484779827967883],['explore',1,.5],['explore',1,1],['review',3,0]]){
    setup(current,id,view,tab,step,progress);setup(old,id,view,tab,step,progress);
    const a=capture(current),b=capture(old);assert.deepEqual(geometry(a),geometry(b),`${id}/${view.W}/${tab}/${progress}: physical geometry and projection`);
    if(id!=='rl-turn45'||tab==='problem'||progress===0&&tab==='explore'||tab==='review'&&step===1)assert.deepEqual(plain(a),plain(b),`${id}/${view.W}/${tab}/${progress}: outside repair scope`);
    assert.deepEqual(plain(current.scene.problem.answer(current.s)),plain(old.scene.problem.answer(old.s)));
    assert.deepEqual(plain(call(current.scene.steps,current.s)),plain(call(old.scene.steps,old.s)));count++;
  }
  t.diagnostic(`${count} exact scope/model comparisons`);
});
