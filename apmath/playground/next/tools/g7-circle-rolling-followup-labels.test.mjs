// Source-bound followup glyph/leader regression for rolling scenes.
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
function conditionLabels(frame){return frame.textItems.filter(t=>/^r=| cm$/.test(t.text)||t.options?.part!=null&&/°$/.test(t.text));}
function readable(lab,frame,why){
  const W=lab.board.W,H=lab.board.H;
  for(const t of conditionLabels(frame)){
    const a=box(t);
    assert.ok(a.left>=4&&a.right<=W-(W<560?26:4)&&a.top>=lab.board.insets.top+2&&a.bottom<=H-lab.board.insets.bottom-2,`${why}: ${t.text} in unobscured stage ${JSON.stringify(a)}`);
    for(const other of frame.textItems){if(other===t)continue;assert.ok(!intersect(a,box(other),1),`${why}: ${t.text} overlaps ${other.text}`);}
  }
}
function attached(lab,frame,why){
  let count=0;
  for(const l of frame.leaders){
    assert.equal(l.options.px,true,`${why}: screen coordinate API`);
    const r=l.result;assert.ok(r?.drawn&&r.end,`${why}: connector is actually painted`);
    const text=frame.textItems.find(t=>Math.abs(t.x-r.label.x)<1e-7&&Math.abs(t.y-r.label.y)<1e-7);assert.ok(text,`${why}: connector terminates at the moved glyph`);
    const q=box(text);assert.ok(!intersect({left:r.end.x,right:r.end.x,top:r.end.y,bottom:r.end.y},q),`${why}: connector stops outside the text`);
    assert.ok(frame.segments.some(s=>s.options.ref===l.options.ref&&dist(s.from,r.anchor)<1e-7&&dist(s.to,r.end)<1e-7),`${why}: returned coordinates match the painted segment`);
    if(l.options.ref==='rolling-given-length'){
      const p=frame.polys.find(p=>p.options.fill==='ink');assert.ok(p.screen.some((a,i)=>dist(midpoint(a,p.screen[(i+1)%p.screen.length]),r.anchor)<1e-7),`${why}: original side midpoint`);
    }else if(l.options.ref==='rolling-radius'){
      assert.ok(frame.segments.some(s=>s.options.part===l.options.part&&s.options.dash?.join()==='5,4'&&dist(midpoint(s.from,s.to),r.anchor)<1e-7),`${why}: actual displayed radius midpoint`);
    }else if(l.options.ref==='rolling-central-angle'){
      const centered=frame.rawArcs.filter(a=>Math.abs(a.r-18)<1e-7&&Math.abs(a.lineWidth-2.2*lab.board.lw)<1e-7);
      const possible=[...centered,...frame.arcs.filter(a=>a.options.part===l.options.part&&a.options.width===5)];
      assert.ok(possible.some(a=>dist({x:a.at.x+a.r*Math.cos((a.start+a.end)/2),y:a.at.y+a.r*Math.sin((a.start+a.end)/2)},r.anchor)<1e-7),`${why}: the present angle arc, never the future full sweep`);
    }else assert.fail(`${why}: unknown annotation role`);
    count++;
  }
  return count;
}

// Source-bound CI42634591500 actual board dimensions/rlT. Each also occurred in
// paper; theme does not alter this geometry. Pixel/real glyph review is separate.
const nativeCases=[
  ['rl-rect','review',3,0,323],
  ['rl-tri','explore',1,.5,327],['rl-tri','explore',1,1,327],['rl-tri','explore',1,.07823529411764704,327],['rl-tri','explore',1,.20509905549463467,327],
  ['rl-tri','review',3,0,327],['rl-tri','review',4,0,327],['rl-tri','review',5,0,327],
  ['rl-rtri','explore',1,.5,323],['rl-rtri','explore',1,.07821588235294115,327],['rl-rtri','explore',1,.13346827906382597,327],['rl-rtri','review',3,0,323],
  ['rl-turn60','explore',1,.5,327],['rl-turn60','explore',1,1,327],['rl-turn60','explore',1,.46363281407323914,327],['rl-turn60','review',4,0,327],['rl-turn60','review',5,0,327],
  ['rl-turn45','explore',1,.5,327],['rl-turn45','explore',1,.1564117647058824,327],['rl-turn45','explore',1,.3484779827967883,327],
  ['rl-square','explore',1,.5,327]
];
for(const id of ids.filter(id=>id!=='rl-semi'))await test(`${id}: native followup length/angle values remain distinct and attached`,async()=>{
  const lab=await load();let leaders=0;
  for(const[,tab,step,t,H]of nativeCases.filter(c=>c[0]===id)){
    setup(lab,id,{...views.at(-1),H},tab,step,t);const f=capture(lab);readable(lab,f,`${id}/${tab}${step}/t${t}`);leaders+=attached(lab,f,id);
    assert.ok(f.polys.some(p=>p.options.fill==='ink'),'current rigid polygon remains drawn');
  }
  assert.ok(leaders>0,'an actually moved annotation is connected to its mathematical object');
});

await test('all seven initial/reset/reentry pictures and initial problems retain original disclosure and behavior',async()=>{
  const lab=await load();
  for(const view of views)for(const id of ids){
    setup(lab,id,view);const first=capture(lab);assert.equal(first.leaders.length,0,'no followup callouts at first entry');
    assert.ok(!first.textItems.some(t=>/^r=/.test(t.text)),'no future sweep result at first entry');
    const answer=plain(lab.scene.problem.answer(lab.s)),steps=plain(call(lab.scene.steps,lab.s));
    const shape=first.polys.find(p=>p.options.fill==='ink').world;
    lab.scene.actions(lab.s).find(a=>a.id==='play').run(lab.s);lab.scene.tick(lab.s,.1,lab);assert.ok(lab.s.rlT>0&&lab.s.rlT<1);
    const moved=capture(lab),moving=moved.polys.find(p=>p.options.fill==='ink').world;
    for(let i=0;i<shape.length;i++)for(let j=i+1;j<shape.length;j++)assert.ok(Math.abs(dist(shape[i],shape[j])-dist(moving[i],moving[j]))<1e-7,'rigid motion preserved');
    const h=lab.board.handles.find(h=>h.id==='roll');assert.equal(typeof h.drag,'function');h.drag({x:1e9,y:0});assert.equal(lab.s.rlT,1);assert.equal(lab.s.playing,false);
    lab.scene.actions(lab.s).find(a=>a.id==='reset').run(lab.s);assert.equal(lab.s.rlT,0);assert.deepEqual(plain(capture(lab)),plain(first));
    setup(lab,id,view);assert.deepEqual(plain(capture(lab)),plain(first));
    lab.tab='problem';const problem=capture(lab);assert.equal(problem.leaders.length,0);assert.equal(lab.s.revealed,false);assert.ok(!problem.textItems.some(t=>/^r=/.test(t.text)));
    assert.deepEqual(plain(lab.scene.problem.answer(lab.s)),answer);assert.deepEqual(plain(call(lab.scene.steps,lab.s)),steps);
  }
});

if(flag('--compare-scope'))await test('source comparison preserves all initial drawing commands, semicircle, model, trajectories and camera',async t=>{
  const current=await load(),old=await load('',flag('--compare-scope'));let count=0;
  const geometry=f=>plain({focus:f.focus,polys:f.polys,arcs:f.arcs,segments:f.segments.filter(s=>!String(s.options.ref||'').startsWith('rolling-')),rawArcs:f.rawArcs,value:f.value});
  for(const view of views)for(const id of ids)for(const[tab,step,progress]of [['explore',1,0],['problem',1,0],['review',1,0],['explore',1,.125],['explore',1,.5],['explore',1,1],['review',3,0]]){
    setup(current,id,view,tab,step,progress);setup(old,id,view,tab,step,progress);
    const a=capture(current),b=capture(old);
    assert.deepEqual(geometry(a),geometry(b),`${id}/${view.W}/${tab}${step}/${progress}: mathematical drawing and camera`);
    if(id==='rl-semi'||tab==='problem'||progress===0&&tab==='explore'||tab==='review'&&step===1)assert.deepEqual(plain(a),plain(b),`${id}/${view.W}/${tab}${step}: unchanged initial/semicircle drawing`);
    assert.deepEqual(plain(current.scene.problem.answer(current.s)),plain(old.scene.problem.answer(old.s)));assert.deepEqual(plain(call(current.scene.steps,current.s)),plain(call(old.scene.steps,old.s)));count++;
  }
  t.diagnostic(`${count} source comparisons; actual after Chromium review remains NOT_RUN`);
});

