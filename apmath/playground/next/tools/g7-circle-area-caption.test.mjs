// Regression for the observed 1106 mobile area condition covered by point D.
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
function setup(lab,W,H,tab,step=1,values={}){
  lab.board.resize(W,H);lab.go('1106');lab.tab=tab;
  Object.assign(lab.s,values);lab.board.setInsets({top:tab==='explore'?49:0,right:0,left:0,bottom:60});
  lab.draw();lab.s.step=step;return lab.draw();
}
function box(b,item){
  const size=b.annotationSize(item.text,item.options),align=item.options.align||'center';
  const x=item.x+(align==='left'?size.width/2:align==='right'?-size.width/2:0);
  return {x0:x-size.width/2,x1:x+size.width/2,y0:item.y-size.height/2,y1:item.y+size.height/2};
}
function clearCaption(lab,frame,why){
  const b=lab.board,label=frame.textItems.find(t=>t.options.color==='rose'&&t.text.includes('넓이'));
  assert.ok(label,'the complete pink area condition is drawn');
  const rect=box(b,label),alpha=lab.s.b1106_al*Math.PI/180,beta=lab.s.b1106_be*Math.PI/180;
  assert.ok(rect.x0>=0&&rect.x1<=b.W-24&&rect.y0>=b.insets.top-1&&rect.y1<=b.H-b.insets.bottom,`${why}: complete value and cm² remain visible`);
  for(const [name,angle] of [['A',Math.PI-alpha/2],['B',Math.PI+alpha/2],['C',-beta/2],['D',beta/2]]){
    const p=b.toS(100*Math.cos(angle),-100*Math.sin(angle));
    const near={x:Math.max(rect.x0,Math.min(rect.x1,p.x)),y:Math.max(rect.y0,Math.min(rect.y1,p.y))};
    const halo=lab.tab==='explore'&&['A','D'].includes(name)?16:6;
    assert.ok(Math.hypot(p.x-near.x,p.y-near.y)>=halo+4,`${why}: caption clears ${name} and its halo`);
    const nameLabel=frame.textItems.find(t=>t.text===name);assert.ok(nameLabel);
    const n=box(b,nameLabel);
    assert.ok(!(rect.x0<n.x1+4&&rect.x1>n.x0-4&&rect.y0<n.y1+4&&rect.y1>n.y0-4),`${why}: caption clears point name ${name}`);
  }
  const given=frame.textItems.find(t=>t.options.color==='amber'&&t.text.includes('넓이')),g=box(b,given);
  assert.ok(!(rect.x0<g.x1+4&&rect.x1>g.x0-4&&rect.y0<g.y1+4&&rect.y1>g.y0-4),`${why}: the two area conditions remain separate`);
}

await test('1106 default mobile exploration and problem keep the entire area condition clear of D',async()=>{
  const lab=await load('',flag('--baseline'));
  for(const [W,exploreH,problemH]of [[360,387,291],[390,411,309]])for(const [tab,step]of [['explore',1],['problem',1],['review',1],['review',2]]){
    const frame=setup(lab,W,tab==='problem'?problemH:exploreH,tab,step);
    clearCaption(lab,frame,`${W}/${tab}/${step}`);
    const label=frame.textItems.find(t=>t.options.color==='rose'&&t.text.includes('넓이'));
    assert.equal(label.text.includes('?'),tab==='problem'||(tab==='review'&&step===1),'the original answer-disclosure step is preserved');
    assert.ok(lab.board.k*100>=50,'caption placement preserves an identifiable original circle');
    assert.equal(lab.s.revealed,false);
  }
});

await test('changing either angle or the whole-circle area preserves all pink conditions and draggable endpoints',async t=>{
  const lab=await load('',flag('--baseline'));let frames=0;
  for(const [W,H]of [[360,387],[390,411]])for(const S of [36,72,108,144])for(let al=30;al<=200;al+=10)for(let be=10;be<=90;be+=10){
    const frame=setup(lab,W,H,'explore',1,{b1106_S:S,b1106_al:al,b1106_be:be});
    clearCaption(lab,frame,`${W}/${S}/${al}/${be}`);
    assert.ok(lab.board.handles.some(h=>h.id==='A'&&typeof h.drag==='function'));
    assert.ok(lab.board.handles.some(h=>h.id==='D'&&typeof h.drag==='function'));frames++;
  }
  t.diagnostic(`${frames} mobile control combinations`);
});

if(flag('--compare'))await test('the repair preserves wide pictures, actual geometry and every math/reveal result',async t=>{
  const current=await load(),previous=await load('',flag('--compare'));let cases=0;
  for(const [W,H]of [[1039,672],[820,461],[683,548],[390,411],[360,387]])for(const tab of ['explore','problem','review'])for(const step of [1,2]){
    const a=setup(current,W,H,tab,step),b=setup(previous,W,H,tab,step);
    assert.equal(current.scene.problem.text(current.s),previous.scene.problem.text(previous.s));
    assert.equal(current.scene.problem.answer(current.s),previous.scene.problem.answer(previous.s));
    assert.deepEqual(plain(call(current.scene.steps,current.s)),plain(call(previous.scene.steps,previous.s)));
    assert.deepEqual(plain(a.value),plain(b.value));
    if(W>=560)assert.deepEqual(plain(a.textItems),plain(b.textItems),'wide captions and their positions are unchanged');
    for(const id of ['A','D']){
      const aHandle=current.board.handles.find(h=>h.id===id),bHandle=previous.board.handles.find(h=>h.id===id);
      if(aHandle||bHandle)assert.deepEqual(plain(aHandle.w),plain(bHandle.w),'drag endpoints retain their world coordinates');
    }
    cases++;
  }
  t.diagnostic(`${cases} comparison states; wide outputs and math are unchanged`);
});
