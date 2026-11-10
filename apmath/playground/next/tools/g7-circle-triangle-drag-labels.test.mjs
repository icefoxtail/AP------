// Regression for the actual legacy triangle AC=5 label covered by the dragged C handle.
// Keep original side values, right-triangle models and answer stages intact.
// This checks real scene/Board commands; Chromium visual review stays separate.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const labs = path.join(root, 'labs');
const call = (value, ...args) => typeof value === 'function' ? value(...args) : value;
const numericArgs = { moveTo: [0, 1], lineTo: [0, 1], rect: [0, 1, 2, 3], fillRect: [0, 1, 2, 3], clearRect: [0, 1, 2, 3], arc: [0, 1, 2, 3, 4], ellipse: [0, 1, 2, 3, 4, 5, 6], fillText: [1, 2], strokeText: [1, 2], bezierCurveTo: [0, 1, 2, 3, 4, 5], quadraticCurveTo: [0, 1, 2, 3], setTransform: [0, 1, 2, 3, 4, 5] };
function canvas() {
  // Side-condition widths follow the actual9bf Chromium glyph measurements:
  // AC=5/6 40px, BC=8 38px, BC=12 45px. Other values retain digit width.
  const textWidth = text => {
    const s = String(text), side = s.match(/^(AC|BC)=(\d+)$/);
    return side ? (side[1] === 'AC' ? 32 : 30) + [...side[2]].reduce((n, digit) => n + (digit === '1' ? 7 : 8), 0) : s === 'C' ? 10 : s.length * 8;
  };
  const context = new Proxy({ measureText: (text) => ({ width: textWidth(text) }) }, {
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

async function load(initialHash = '', revision = null) {
  let context;
  const ready = [];
  const element = (tag) => tag === 'canvas' ? canvas() : { tagName: tag.toUpperCase(), dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, append() {} };
  const document = { getElementById() { return null; }, querySelector() { return null; }, createElement: element, createTextNode: (text) => ({ textContent: text }), addEventListener() {}, documentElement: element('html'), body: element('body'), head: element('head') };
  document.head.append = (el) => {
    if (el.tagName !== 'SCRIPT') return;
    const source = revision && el.src === 'g7-circle-sector/f01.js' ? (fs.existsSync(revision) ? fs.readFileSync(revision, 'utf8') : execFileSync('git', ['show', `${revision}:apmath/playground/next/labs/g7-circle-sector/f01.js`], { cwd: path.resolve(root, '../../..'), encoding: 'utf8' })) : fs.readFileSync(path.join(labs, el.src), 'utf8');
    vm.runInContext(source, context, { filename: el.src });
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
    board._text = function (x, y, text, options, screen) { if (text != null && !board._bbox) { texts.push(String(text)); textItems.push({ x, y, text: String(text), options, screen }); } return original.call(this, x, y, text, options, screen); };
    try { const value = call(lab.scene.view, lab.s, lab); board.begin(); lab.scene.draw(board, lab.s, value, lab); board.end(); return { texts, textItems, value }; }
    finally { board._text = original; }
  };
  return lab;
}



const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = x => JSON.parse(JSON.stringify(x));
const baseline = arg('--baseline');
const views = [[1039,535,68,16,56],[820,461,67,0,60],[683,415,68,16,56],[390,411,67,0,60],[360,387,67,0,60]];
const pairs = [[3,4],[4,3],[5,12],[12,5],[6,8],[8,6],[8,15],[15,8],[9,12],[12,9]];
const near = (a,b,label) => assert.ok(Math.abs(a-b)<1e-7,`${label}: ${a} vs ${b}`);
function render(lab,id,view,tab='explore',values={},step=1,hot='none'){
 const [W,H,top,right,bottom]=view,b=lab.board;
 b.resize(W,H);lab.go(id);lab.tab=tab;Object.assign(lab.s,values,{step});
 b.setInsets({top:tab==='problem'?0:top,right,bottom,left:0});
 b.hoverId=hot==='hover'?'C':null;b.dragging=hot==='drag'?{id:'C'}:null;
 const paths=[],orig=b.path;
 b.path=function(points,options){paths.push(plain({points,options}));return orig.apply(this,arguments);};
 try{
  const d=lab.draw();
  return {...d,paths,handles:plain(b.handles.map(({drag,...h})=>h)),focus:plain(b.focus),state:plain(lab.s),model:lab.scene.csModel?plain(lab.scene.csModel(lab.s)):null,choices:lab.scene.csChoices?plain(lab.scene.csChoices(lab.s,lab)):null};
 }finally{b.path=orig;}
}
function box(b,item,pad=0){
 const size=b.annotationSize(item.text,item.options);
 return {left:item.x-size.width/2+pad,right:item.x+size.width/2-pad,top:item.y-size.height/2+pad,bottom:item.y+size.height/2-pad};
}
const boxGap=(a,b)=>Math.max(a.left-b.right,b.left-a.right,a.top-b.bottom,b.top-a.bottom);
const pointBoxDistance=(p,rect)=>Math.hypot(Math.max(0,rect.left-p.x,p.x-rect.right),Math.max(0,rect.top-p.y,p.y-rect.bottom));
function check(lab,d,label){
 const b=lab.board,handle=d.handles.find(h=>h.id==='C');assert.ok(handle,`${label}: C remains draggable`);
 const conditions=d.textItems.filter(t=>/^(AC|BC)=/.test(t.text)),name=d.textItems.find(t=>t.text==='C');
 assert.equal(conditions.length,2);assert.ok(name);
 for(const t of conditions){
  const glyph=box(b,t,3);
  assert.ok(pointBoxDistance(handle,glyph)>=6.5*b.hr+3-1e-7,`${label}: ${t.text} is clear of the C control point`);
  const full=box(b,t);
  assert.ok(full.left>=3&&full.right<=b.W-b.insets.right-3&&full.top>=b.insets.top+4&&full.bottom<=b.H-b.insets.bottom-4,`${label}: ${t.text} remains inside the unoccluded stage`);
  if(t.options.dy!==-14){
   const halo=6.5*b.hr+(b.dragging?.id==='C'?15:b.hoverId==='C'?12:9);
   assert.ok(pointBoxDistance(handle,full)>=halo+4,`${label}: moved condition clears even the active halo`);
   assert.ok(boxGap(full,box(b,name))>=7.9,`${label}: side value and C name remain separate`);
   for(const other of d.textItems.filter(x=>x!==t))assert.ok(boxGap(full,box(b,other))>=4,`${label}: relocated value clears ${other.text}`);
  }
 }
 assert.equal(d.state.revealed,false);assert.equal(d.state.playing,false);
 return conditions;
}
function withoutPresentationTag(m){const out=plain(m);out.fig.forEach(it=>delete it.triangleSide);return out;}

await test('the recorded360px5-12-13 drag leaves the complete AC=5 condition clear of C',async()=>{
 const lab=await load('#s=f1-tri',baseline);
 for(const hot of ['none','hover','drag']){
  const d=render(lab,'f1-tri',views[4],'explore',{f1_tri_AC:5,f1_tri_BC:12},1,hot);
  const h=d.handles.find(h=>h.id==='C');near(h.x,46.85526112683306,'actual native handle x');near(h.y,145.04476459994856,'actual native handle y');
  const items=check(lab,d,`360/5/12/${hot}`);
  assert.ok(items.find(t=>t.text==='AC=5').options.dy < -14,'only the covered named condition moves above C');
 }
});

await test('all ten integer triangles keep both side conditions readable across five stages and animation progress',async()=>{
 const lab=await load('#s=f1-tri',baseline);let frames=0;
 for(const view of views)for(const [AC,BC]of pairs)for(const t of [0,.15,.5,.76,1]){
  const d=render(lab,'f1-tri',view,'explore',{f1_tri_AC:AC,f1_tri_BC:BC,f1_tri_t:t});check(lab,d,`${view[0]}/${AC}/${BC}/${t}`);
  const [A,B,C]=d.model.cuts[0].polys[0],AB=Math.hypot(AC,BC);
  near(Math.hypot(C.x-A.x,C.y-A.y),AC,'AC preserved');near(Math.hypot(C.x-B.x,C.y-B.y),BC,'BC preserved');near(Math.hypot(B.x-A.x,B.y-A.y),AB,'integer diameter preserved');
  near((A.x-C.x)*(B.x-C.x)+(A.y-C.y)*(B.y-C.y),0,'C remains a right angle');near(Math.hypot(C.x,C.y),AB/2,'C remains on the semicircle');
  const value=x=>x.c[0]/x.c[1]+Math.PI*x.p[0]/x.p[1]+Math.sqrt(3)*x.s[0]/x.s[1];
  near(value(d.model.wholeX),Math.PI*AB*AB/8,'semicircle area');near(value(d.model.partX),AC*BC/2,'removed triangle area');near(value(d.model.resX),Math.PI*AB*AB/8-AC*BC/2,'remaining area');frames++;
 }
 assert.equal(frames,250);
});

if(arg('--compare-scope'))await test('original6-8 initial display, otherF01 scenes, problem figures, geometry and answers are unchanged',async()=>{
 const now=await load('#s=f1-tri'),old=await load('#s=f1-tri',arg('--compare-scope'));let states=0;
 for(const id of now.list.filter(s=>s.csPfx==='f1').map(s=>s.id))for(const view of views)for(const tab of ['explore','problem','review'])for(const t of [0,.5,1]){
  const key=`${id.replace('-','_')}_t`,a=render(now,id,view,tab,{[key]:t},tab==='review'?4:1),b=render(old,id,view,tab,{[key]:t},tab==='review'?4:1);
  assert.deepEqual(a.paths,b.paths);assert.deepEqual(a.handles,b.handles);assert.deepEqual(a.focus,b.focus);assert.deepEqual(a.state,b.state);assert.deepEqual(plain(a.value),plain(b.value));assert.deepEqual(a.choices,b.choices);
  assert.deepEqual(withoutPresentationTag(a.model),withoutPresentationTag(b.model));
  assert.deepEqual(plain(a.textItems),plain(b.textItems),`${id}/${view[0]}/${tab}/${t}: default labels unchanged`);states++;
 }
 assert.equal(states,270); // Six current F01 scenes with the legacy-triangle route.
 for(const [AC,BC]of pairs)for(const view of views)for(const tab of ['explore','problem','review']){
  const values={f1_tri_AC:AC,f1_tri_BC:BC},a=render(now,'f1-tri',view,tab,values),b=render(old,'f1-tri',view,tab,values);
  assert.deepEqual(a.paths,b.paths);assert.deepEqual(a.handles,b.handles);assert.deepEqual(a.focus,b.focus);assert.deepEqual(a.state,b.state);assert.deepEqual(a.choices,b.choices);assert.deepEqual(plain(a.value),plain(b.value));assert.deepEqual(withoutPresentationTag(a.model),withoutPresentationTag(b.model));
  assert.deepEqual(plain(call(now.scene.steps,now.s)),plain(call(old.scene.steps,old.s)));assert.equal(call(now.scene.problem.text,now.s),call(old.scene.problem.text,old.s));assert.equal(call(now.scene.problem.answer,now.s),call(old.scene.problem.answer,old.s));
  if(tab==='problem')assert.deepEqual(plain(a.textItems),plain(b.textItems));
  else{
   const unchanged=t=>!/^AC=|^BC=/.test(t.text);assert.deepEqual(plain(a.textItems.filter(unchanged)),plain(b.textItems.filter(unchanged)));assert.deepEqual(a.texts,b.texts);
  }
 }
 // Exercise the real drag callback, including snapping, rather than setting only params.
 for(const angle of [1,15,30,45,60,75,89]){
  const outputs=[];
  for(const lab of [now,old]){
   const sc=lab.go('f1-tri'),h=sc.csModel(lab.s).handles.find(h=>h.id==='C');
   h.drag({x:5*Math.cos(angle*Math.PI/90),y:5*Math.sin(angle*Math.PI/90)},{set:(key,v)=>{lab.s[`f1_tri_${key}`]=v;}});
   outputs.push([lab.s.f1_tri_AC,lab.s.f1_tri_BC]);
  }
  assert.deepEqual(outputs[0],outputs[1]);assert.ok(Number.isInteger(Math.hypot(...outputs[0])));
 }
});
