// Regression for the actual gt-tri review radius hidden by the contents handle.
// Restore full labels while keeping each calculation attached to its own arc.
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
    const source = revision && el.src === 'g7-circle-sector/swept.js' ? (fs.existsSync(revision) ? fs.readFileSync(revision, 'utf8') : execFileSync('git', ['show', `${revision}:apmath/playground/next/labs/g7-circle-sector/swept.js`], { cwd: path.resolve(root, '../../..'), encoding: 'utf8' })) : fs.readFileSync(path.join(labs, el.src), 'utf8');
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
const mobile = [[360, 387], [390, 411]];
function render(lab, id, W, H, tab, step = 1, values = {}) {
  const b = lab.board; b.resize(W, H);
  lab.go(id); lab.tab = tab; Object.assign(lab.s, values);
  // enter() resets insets; the shell then installs the actual stage geometry.
  b.setInsets({ top: 0, right: 0, bottom: 60, left: 0 });
  call(lab.scene.view, lab.s, lab); lab.s.step = step;
  const arcs = [], paths = [], leaders = [], originalArc = b.arc, originalPath = b.path, originalLeader = b.leader;
  b.arc = function(p, r, start, end, options) { arcs.push(plain({ p, r, start, end, options })); return originalArc.apply(this, arguments); };
  b.path = function(points, options) { paths.push(plain({ points, options, leader: !!b._testingLeader })); return originalPath.apply(this, arguments); };
  b.leader = function(anchor,label,options) { let result; b._testingLeader=true;try{result=originalLeader.apply(this,arguments);}finally{b._testingLeader=false;} leaders.push(plain({anchor,label,options,result}));return result; };
  try { return { ...lab.draw(), arcs, paths, leaders, state: plain(lab.s), focus: plain(b.focus) }; }
  finally { b.arc = originalArc; b.path = originalPath; b.leader = originalLeader; }
}
function bounds(b, item) {
  const size = b.annotationSize(item.text, item.options);
  return { left: item.x - size.width / 2, right: item.x + size.width / 2, top: item.y - size.height / 2, bottom: item.y + size.height / 2 };
}
const overlap = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));


function paintBox(b, item) {
  const size = b.annotationSize(item.text, item.options), align = item.options.align || 'center';
  const left = align === 'left' ? item.x - 3 : align === 'right' ? item.x - size.width + 3 : item.x - size.width / 2;
  return { left, right: left + size.width, top: item.y - size.height / 2, bottom: item.y + size.height / 2 };
}
function checkAnimalAndRope(lab, d, label) {
  const goat = d.textItems.find(item => item.text === '염소');
  const rope = d.textItems.find(item => item.text === `${lab.s.gtL} m` && item.options.color === 'rose');
  assert.ok(goat && rope, `${label}: animal and full given rope length exist`);
  const a = paintBox(lab.board, goat), r = paintBox(lab.board, rope);
  assert.equal(overlap(a, r), 0, `${label}: animal name and given rope length must not overlap`);
  assert.ok(a.left >= 3 && a.right <= 357 && a.top >= 3 && a.bottom <= 291 - 60 - 3, `${label}: animal label stays within the usable stage`);
  assert.equal(d.state.revealed, false); assert.equal(d.state.playing, false);
  return {goat,rope};
}

function checkReviewLabels(lab,d,label){
 const formulas=d.textItems.filter(t=>/^r = .*−/.test(t.text)&&t.options.ref==='B');
 const rightBoundary=lab.board.W-32,letters=d.textItems.filter(t=>/^[ABC]$/.test(t.text));
 for(const item of formulas){
  const box=paintBox(lab.board,item);
  assert.ok(box.left>=4&&box.right<=rightBoundary,`${label}: full radius ${item.text} is left of the contents handle`);
  assert.ok(box.top>=4&&box.bottom<lab.board.H-lab.board.insets.bottom-4,`${label}: full radius is inside the usable stage`);
  for(const letter of letters)assert.equal(overlap(box,paintBox(lab.board,letter)),0,`${label}: radius does not cover ${letter.text}`);
 }
 for(const link of d.leaders){
  assert.equal(link.options.px,true);assert.equal(link.result.drawn,true,'connector is actually painted');
  for(const name of ['anchor','label','end']){
   const point=link.result[name];assert.ok(point.x>=4&&point.x<=lab.board.W-4&&point.y>=4&&point.y<lab.board.H-lab.board.insets.bottom-4,`${label}: actual ${name} stays visible`);
  }
  assert.ok(formulas.some(item=>Math.abs(item.x-link.result.label.x)<1e-7&&Math.abs(item.y-(link.result.label.y-8))<1e-7),'connector belongs to the final displayed radius calculation');
  assert.ok(d.arcs.some(arc=>arc.options?.sector&&arc.options?.ref===link.options.ref&&Math.abs(Math.hypot(link.result.anchor.x-lab.board.toS(arc.p).x,link.result.anchor.y-lab.board.toS(arc.p).y)-arc.r*lab.board.k)<1e-6),'connector anchor lies on its own identified small sector arc');
  assert.ok(d.paths.some(path=>path.leader&&path.points.length===2&&Math.hypot(lab.board.toS(path.points[0]).x-link.result.anchor.x,lab.board.toS(path.points[0]).y-link.result.anchor.y)<1e-6&&Math.hypot(lab.board.toS(path.points[1]).x-link.result.end.x,lab.board.toS(path.points[1]).y-link.result.end.y)<1e-6),'the painted connector uses the verified anchor and endpoint');
 }
 return formulas;
}

await test('the actual360px review radius remains complete and points to its small sector',async()=>{
 const lab=await load('',baseline);
 for(const step of [2,3,4]){
  const d=render(lab,'gt-tri',360,387,'review',step);
  assert.ok(checkReviewLabels(lab,d,`step${step}`).some(t=>t.text==='r = 10−8 = 2'));
  assert.equal(d.leaders.length,1,'the previously covered radius has its own connector');
 }
});

await test('every permitted triangle/rope pair preserves full staged radius calculations on both phones',async()=>{
 const lab=await load('',baseline);let states=0;
 for(const [W,H]of [[360,387],[390,411]])for(let side=3;side<=10;side++)for(let rope=1;rope<=Math.floor(1.5*side);rope++)for(const step of [2,3,4]){
  const d=render(lab,'gt-tri',W,H,'review',step,{gtS:side,gtL:rope});checkReviewLabels(lab,d,`${W}/${side}/${rope}/${step}`);
  assert.equal(d.state.gtS,side);assert.equal(d.state.gtL,rope);assert.equal(d.state.playing,false);states++;
 }
 assert.equal(states,456);
});

if(arg('--compare-scope'))await test('all initial scenes, original arcs, question values and reveal stages are preserved',async()=>{
 const now=await load(),old=await load('',arg('--compare-scope'));
 const views=[[1039,741],[820,397],[683,613],[390,411],[360,387]];
 for(const id of ['gt-kennel','gt-warehouse','gt-tri','gt-hex','gt-spiral'])for(const [W,H]of views)for(const tab of ['explore','problem','review'])for(const step of tab==='review'?[1,2,3,4]:[1]){
  const a=render(now,id,W,H,tab,step),b=render(old,id,W,H,tab,step);
  assert.deepEqual(a.arcs,b.arcs);assert.deepEqual(a.paths.filter(p=>!p.leader),b.paths.filter(p=>!p.leader));assert.deepEqual(a.focus,b.focus);assert.deepEqual(a.state,b.state);
  assert.deepEqual(plain(a.value),plain(b.value));assert.deepEqual(plain(call(now.scene.steps,now.s)),plain(call(old.scene.steps,old.s)));
  if(id!=='gt-tri'||W>=560||tab!=='review'||step<2){assert.deepEqual(a.paths,b.paths);assert.deepEqual(plain(a.textItems),plain(b.textItems));}
  else{
   const changed=t=>t.options.ref==='B'&&(/^r = .*−/.test(t.text)||t.text==='120°');
   assert.deepEqual(plain(a.textItems.filter(t=>!changed(t))),plain(b.textItems.filter(t=>!changed(t))));
  }
 }
});

