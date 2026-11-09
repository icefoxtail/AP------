// Actual initial face geometry is required even when the classification table has ink.
// Node contracts complement the required independent Chromium images.
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
  const context = new Proxy({ measureText: (text) => ({ width: String(text).length * 8 }), createLinearGradient: () => ({ addColorStop() {} }), createRadialGradient: () => ({ addColorStop() {} }) }, {
    get(target, key) {
      if (key in target) return target[key];
      return (...args) => {
        for (const index of numericArgs[key] || []) assert.ok(Number.isFinite(args[index]), `${String(key)} coordinate ${index} must be finite; got ${String(args[index])}`);
      };
    },
    set(target, key, value) { target[key] = value; return true; }
  });
  return { width: 1000, height: 650, getContext: () => context, addEventListener() {} };
}

async function load(baseline) {
  let context;
  const ready = [];
  const element = (tag) => tag === 'canvas' ? canvas() : { tagName: tag.toUpperCase(), dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, append() {} };
  const document = { getElementById() { return null; }, querySelector() { return null; }, createElement: element, createTextNode: (text) => ({ textContent: text }), addEventListener() {}, documentElement: element('html'), body: element('body'), head: element('head') };
  document.head.append = (el) => {
    if (el.tagName !== 'SCRIPT') return;
    const source = baseline && el.src === 'g7-polyhedra/t2.js' ? execFileSync('git',['show',baseline+':apmath/playground/next/labs/'+el.src],{cwd:path.resolve(root,'../../..'),encoding:'utf8'}) : fs.readFileSync(path.join(labs,el.src),'utf8');
    vm.runInContext(source, context, { filename: el.src });
    el.onload?.();
  };
  const sandbox = { innerWidth: 1440, document, console, Math, URLSearchParams, performance, setTimeout, clearTimeout, requestAnimationFrame: () => 0, cancelAnimationFrame() {}, devicePixelRatio: 1, location: { hash: '', search: '', pathname: '/labs/g7-polyhedra.html' }, history: { replaceState() {} }, localStorage: { getItem() { return null; }, setItem() {} }, getComputedStyle: () => ({ getPropertyValue: (key) => key === '--font-ui' ? 'sans-serif' : key === '--m-glow' ? '0' : '#ffffff' }), matchMedia: () => ({ matches: false }), addEventListener: (event, fn) => { if (event === 'DOMContentLoaded') ready.push(fn); } };
  let seed = 14791;
  sandbox.Math = Object.create(Math);
  sandbox.Math.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  sandbox.window = sandbox;
  context = vm.createContext(sandbox);
  for (const filename of ['apl-core.js', 'apl-board.js']) vm.runInContext(fs.readFileSync(path.join(root, 'kit', filename), 'utf8'), context, { filename });
  let definition;
  context.APLab.createLab = (def) => { definition = def; };
  const html = fs.readFileSync(path.join(labs, 'g7-polyhedra.html'), 'utf8');
  const script = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map((x) => x[1]).find((x) => x.includes('const MODULES ='));
  vm.runInContext(script, context, { filename: 'g7-polyhedra.html' });
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
    const box = board.measure(() => scene.draw(board, lab.s, call(scene.view, lab.s, lab), lab));
    return box ? board.fitBox(box, { margin: 0.08, px: 12 }) : null;
  };
  lab.go = (id) => {
    lab.index = list.findIndex((scene) => scene.id === id);
    assert.ok(lab.index >= 0, `scene ${id} exists`);
    lab.tab = 'explore';
    Object.assign(lab.s, { step: lab.scene.startStep ?? (lab.scene.steps ? 1 : 0), revealed: false, playing: false });
    board.kind = lab.scene.boardKind || definition.board.kind;
    definition.enter?.(lab.s, lab.scene, lab);
    lab.scene.enter?.(lab.s, lab);
    board.setFocus(call(lab.scene.focus, lab.s) || { x: [-10, 40], y: [-20, 15] }, true);
    return lab.scene;
  };
  lab.draw = () => {
    const texts = [], textItems = [], paths = [], handles = [], original = board._text, originalPath = board.path, originalHandle = board.handle;
    board.path = function (points, options = {}) { paths.push({ points: points.map((p) => ({ x: p.x ?? p[0], y: p.y ?? p[1] })), screen: points.map(p => board.toS(p)), options }); return originalPath.call(this, points, options); };
    board.handle = function (id, point, options = {}) { handles.push({ id, point, screen: board.toS(point), options }); return originalHandle.call(this, id, point, options); };
    board._text = function (x, y, text, options, screen) { if (text != null) { texts.push(String(text)); textItems.push({ x, y, text: String(text), options, screen, size: (options?.size || 13) * board.fs * board._ts() }); } return original.call(this, x, y, text, options, screen); };
    try { const value = call(lab.scene.view, lab.s, lab); board.begin(); lab.scene.draw(board, lab.s, value, lab); board.end(); return { texts, textItems, paths, handles, value }; }
    finally { board._text = original; board.path = originalPath; board.handle = originalHandle; }
  };
  lab.api = context.APL_PH;
  lab.setViewportWidth = width => { context.innerWidth = width; };
  return lab;
}


const arg = name => { const i=process.argv.indexOf(name);return i<0?null:process.argv[i+1]; };
const views=[[1039,698,56,16],[820,461,60,0],[683,528,56,16],[390,411,60,0],[360,387,60,0]];
const clean=value=>JSON.parse(JSON.stringify(value));
function setup(lab,view,id='p2-6') { const [w,h,bottom,right]=view;lab.setViewportWidth(w);lab.go(id);lab.board.resize(w,h);lab.board.setInsets({bottom,right}); }
const faces=d=>d.paths.filter(p=>p.options.ref==='p2-6-base-face');
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function verifyFaces(lab,d,p,q) {
  const f=faces(d);assert.equal(f.length,q,'the selected faces must exist independently of table ink');
  const O=f[0].screen[0],all=f.flatMap(f=>f.screen),xs=all.map(p=>p.x),ys=all.map(p=>p.y);
  assert.ok(Math.max(...ys)-Math.min(...ys)>=80,'the actual face cluster has a visible vertical span');
  assert.ok(Math.max(...xs)-Math.min(...xs)>=50,'the face cluster does not collapse to a line');
  for(const poly of f){
    assert.equal(poly.screen.length,p,'each face has the selected number of vertices');assert.ok(dist(poly.screen[0],O)<1e-6,'all faces share their first vertex');
    assert.ok(poly.options.fillAlpha>=.2 && poly.options.width>=2,'the given faces have visible fill and outlines');
    const edges=poly.screen.map((a,i)=>dist(a,poly.screen[(i+1)%p]));assert.ok(Math.min(...edges)>18);
    for(const e of edges)assert.ok(Math.abs(e-edges[0])<1e-6,'every drawn face is regular with equal side lengths');
    const a=poly.screen[1],z=poly.screen.at(-1);const angle=Math.acos(Math.max(-1,Math.min(1,((a.x-O.x)*(z.x-O.x)+(a.y-O.y)*(z.y-O.y))/(dist(a,O)*dist(z,O)))))*180/Math.PI;
    assert.ok(Math.abs(angle-(180-360/p))<1e-7,'the common-vertex angle matches the selected regular polygon');
    assert.ok(poly.screen.every(a=>a.x>=4&&a.x<=lab.board.W-4&&a.y>=4&&a.y<=lab.board.H-lab.board.insets.bottom-4),'every face is in the visible stage above the tools');
  }
  const cells=d.paths.filter(p=>p.options.close&&!p.options.ref);assert.equal(cells.length,16,'all table choices remain');
  const tableBottom=Math.max(...cells.flatMap(p=>p.screen.map(p=>p.y)));
  assert.ok(Math.min(...ys)>tableBottom+8,'actual faces do not obscure the table');
  assert.ok(d.texts.includes('O'),'the common vertex is named');
}

await test('p2-6 shows its original five regular triangular faces before any action at all five viewports',async()=>{
 const lab=await load(arg('--baseline'));
 for(const view of views){setup(lab,view);assert.equal(lab.s.playing,false);verifyFaces(lab,lab.draw(),3,5);}
});
await test('every selectable p/q has the actual regular faces and preserves the model angle sum',async()=>{
 const lab=await load(arg('--baseline'));
 for(const view of views)for(let p=3;p<=6;p++)for(let q=3;q<=6;q++){
  setup(lab,view);Object.assign(lab.s,{phPp:p,phQq:q});const before=JSON.stringify(lab.s),m=lab.scene.ph.model(lab.s);verifyFaces(lab,lab.draw(),p,q);
  assert.equal(m.sum,q*(180-360/p));assert.equal(JSON.stringify(lab.s),before,'draw does not mutate the controls');
 }
});
await test('all sixteen table selections remain draggable and reentry restores five triangles',async()=>{
 const lab=await load(arg('--baseline'));
 for(const view of views){setup(lab,view);const first=lab.draw();
  for(let p=3;p<=6;p++)for(let q=3;q<=6;q++){
   const d=lab.draw(),cell=d.paths.filter(p=>p.options.close&&!p.options.ref)[(p-3)*4+q-3];
   const target={x:cell.screen.reduce((n,p)=>n+p.x,0)/4,y:cell.screen.reduce((n,p)=>n+p.y,0)/4};
   d.handles.find(h=>h.id==='cell').options.drag(lab.board.toW(target.x,target.y));assert.equal(lab.s.phPp,p);assert.equal(lab.s.phQq,q);verifyFaces(lab,lab.draw(),p,q);
  }
  setup(lab,view);assert.equal(lab.s.phPp,3);assert.equal(lab.s.phQq,5);assert.deepEqual(clean(lab.draw().paths),clean(first.paths));
 }
});
if(arg('--compare-scope'))await test('question givens, all reveal stages, thumbnails and every other polyhedron scene stay exact',async()=>{
 const now=await load(),old=await load(arg('--compare-scope'));
 for(const view of views){setup(now,view);setup(old,view);
  for(const p of [3,4,5])for(const tab of ['problem','review'])for(const step of [0,1,2,3,4]){
   for(const lab of [now,old]){lab.s.phQ={p};lab.tab=tab;lab.s.step=step;}
   const a=now.draw(),b=old.draw();assert.deepEqual(clean(a.paths),clean(b.paths));assert.deepEqual(a.texts,b.texts);assert.equal(now.scene.problem.text(now.s),old.scene.problem.text(old.s));
  }
  for(const lab of [now,old]){setup(lab,view);lab.board.thumb=true;}
  assert.deepEqual(clean(now.draw().paths),clean(old.draw().paths));now.board.thumb=false;old.board.thumb=false;
 }
 for(const id of now.list.map(s=>s.id).filter(id=>id!=='p2-6'))for(const view of views){
  setup(now,view,id);setup(old,view,id);assert.deepEqual(clean(now.scene.ph.model(now.s)),clean(old.scene.ph.model(old.s)));assert.deepEqual(clean(now.draw().paths),clean(old.draw().paths),id);assert.deepEqual(now.draw().texts,old.draw().texts,id);
 }
});
