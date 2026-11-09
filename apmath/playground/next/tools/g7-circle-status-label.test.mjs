// Regression for the observed1207 landscape alpha name hidden by the status badge.
// Source comparisons change basic.js only; the shared real Board is retained.
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
  const context = new Proxy({ measureText: (text) => ({ width: String(text).length * 8 }) }, {
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
    const source = revision && el.src === 'g7-circle-sector/basic.js' ? execFileSync('git', ['show', `${revision}:apmath/playground/next/labs/g7-circle-sector/basic.js`], { cwd: path.resolve(root, '../../..'), encoding: 'utf8' }) : fs.readFileSync(path.join(labs, el.src), 'utf8');
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

const flag=name=>{const i=process.argv.indexOf(name);return i<0?null:process.argv[i+1];};
const plain=value=>JSON.parse(JSON.stringify(value));

const views=[[1039,630,16,56],[820,461,0,60],[683,510,16,56],[390,411,0,60],[360,387,0,60]];
function setup(lab,id,view,tab='explore',patch={}){
 const [W,H,right,bottom]=view;lab.board.resize(W,H);lab.go(id);lab.tab=tab;Object.assign(lab.s,patch);
 // The lab enter hook clears insets; the shell computes stage insets afterwards.
 lab.board.setInsets({top:0,right,bottom,left:0});
 lab.board.setFocus(call(lab.scene.focus,lab.s),true);return lab.draw();
}
function box(b,t){const m=b.annotationSize(t.text,t.options),align=t.options.align||'center';return {x0:t.x-(align==='right'?m.width:align==='center'?m.width/2:0),x1:t.x+(align==='left'?m.width:align==='center'?m.width/2:0),y0:t.y-m.height/2,y1:t.y+m.height/2};}
function alpha(lab,frame,why){
 const t=frame.textItems.find(x=>x.text==='α');assert.ok(t,why+': alpha remains drawn');const r=box(lab.board,t);
 assert.ok(r.y0>=66-1e-8,why+': complete alpha clears the landscape badge '+JSON.stringify({t,r}));
 assert.ok(r.x0>=4&&r.x1<=lab.board.W-4&&r.y1<=lab.board.H-lab.board.insets.bottom,why+': alpha remains on stage');
 const h=lab.board.handles.find(h=>h.id==='A');assert.ok(h&&typeof h.drag==='function',why+': original endpoint remains draggable');
 const at=lab.board.toS(h.w);assert.ok(Math.hypot(t.x-at.x,t.y-at.y)<=42,why+': alpha still identifies its own endpoint');
 for(const q of frame.textItems.filter(x=>!['α','O'].includes(x.text))){const z=box(lab.board,q);assert.ok(!(r.x0<z.x1+2&&r.x1>z.x0-2&&r.y0<z.y1+2&&r.y1>z.y0-2),why+': alpha distinct from '+q.text);}
}
await test('1207 initial landscape alpha is fully visible below the real status band',async()=>{
 const lab=await load('',flag('--baseline'));alpha(lab,setup(lab,'1207',views[2]),'initial');
 const before=plain(lab.s);setup(lab,'1101',views[2]);const frame=setup(lab,'1207',views[2]);alpha(lab,frame,'return');
 assert.equal(lab.s.b1207_al,before.b1207_al);assert.equal(lab.s.b1207_be,before.b1207_be);assert.equal(lab.s.revealed,false);
});
await test('every allowed alpha and radius keeps the label visible and actual drag mathematics intact',async t=>{
 const lab=await load('',flag('--baseline'));let count=0;
 for(let a=10;a<=130;a+=5)for(let r=3;r<=9;r++){
  const f=setup(lab,'1207',views[2],'explore',{b1207_al:a,b1207_r:r});alpha(lab,f,`${a}/${r}`);
  const h=lab.board.handles.find(h=>h.id==='A'),expected=(20+a)*Math.PI/180;
  assert.ok(Math.abs(h.w.x-100*Math.cos(expected))<1e-7&&Math.abs(h.w.y+100*Math.sin(expected))<1e-7,'circle endpoint retains its actual world angle');
  h.drag({x:100*Math.cos(Math.PI/3),y:-100*Math.sin(Math.PI/3)});assert.equal(lab.s.b1207_al,40,'drag still updates alpha with the original orientation and snapping');count++;
 }
 t.diagnostic(`${count} actual Board angle/radius states`);
});
if(flag('--compare'))await test('only the colliding1207 name changes; all scene mathematics and other pictures remain intact',async t=>{
 const a=await load(),z=await load('',flag('--compare'));let count=0;
 for(const sc of a.list)for(const view of views)for(const tab of ['explore','problem','review']){
  const x=setup(a,sc.id,view,tab),y=setup(z,sc.id,view,tab);
  assert.deepEqual(plain(x.value),plain(y.value),sc.id+': status/readouts unchanged');
  assert.deepEqual(plain(a.s),plain(z.s),sc.id+': full mathematical state unchanged');
  assert.deepEqual(plain(a.board.focus),plain(z.board.focus),sc.id+': fit unchanged');
  const texts=frame=>plain(frame.textItems.filter(q=>!(sc.id==='1207'&&tab==='explore'&&view[2]>0&&q.text==='α')));
  assert.deepEqual(texts(x),texts(y),sc.id+': other labels unchanged');
  assert.deepEqual(plain(a.board.handles.map(h=>({id:h.id,w:h.w}))),plain(z.board.handles.map(h=>({id:h.id,w:h.w}))),sc.id+': handles unchanged');count++;
 }
 t.diagnostic(`${count} scene/view/tab comparisons`);
});
