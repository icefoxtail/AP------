// Production scene/Board regression checks. This VM checks math and drawing commands;
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
  let current = [], contour = [], saved = [];
  const context = new Proxy({
    fills: [], fillStyle: '', strokeStyle: '', globalAlpha: 1,
    measureText: (text) => ({ width: String(text).length * 8 }),
    createRadialGradient: () => ({ addColorStop() {} }),
    beginPath() { current = []; contour = []; },
    moveTo(x, y) { contour = [{ x, y }]; current.push(contour); },
    lineTo(x, y) { contour.push({ x, y }); },
    closePath() {},
    fill() { this.fills.push({ style: this.fillStyle, alpha: this.globalAlpha, contours: current.map(p => p.slice()) }); },
    save() { saved.push({ fillStyle: this.fillStyle, strokeStyle: this.strokeStyle, globalAlpha: this.globalAlpha }); },
    restore() { Object.assign(this, saved.pop() || {}); }
  }, {
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

const repo = path.resolve(root, '../../..');
const baselineRef = process.env.APMATH_SV_TILES_BASE_REF || null;
// Historical equality is an additional local review, not a dependency of shallow CI checkouts.
const comparisonRef = process.env.APMATH_SV_TILES_COMPARE_REF || null;
async function load(ref = baselineRef) {
  let context;
  const ready = [];
  const element = (tag) => tag === 'canvas' ? canvas() : { tagName: tag.toUpperCase(), dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, append() {} };
  const document = { getElementById() { return null; }, querySelector() { return null; }, createElement: element, createTextNode: (text) => ({ textContent: text }), addEventListener() {}, documentElement: element('html'), body: element('body'), head: element('head') };
  document.head.append = (el) => {
    if (el.tagName !== 'SCRIPT') return;
    const file = path.join(labs, el.src);
    const versioned = /g7-surface-volume\/t5\.js$/.test(el.src);
    const source = ref && versioned ? execFileSync('git', ['show', `${ref}:${path.relative(repo, file)}`], { cwd: repo, encoding: 'utf8' }) : fs.readFileSync(file, 'utf8');
    vm.runInContext(source, context, { filename: el.src });
    el.onload?.();
  };
  const sandbox = { innerWidth: 1440, document, console, Math, URLSearchParams, performance, setTimeout, clearTimeout, requestAnimationFrame: () => 0, cancelAnimationFrame() {}, devicePixelRatio: 1, location: { hash: '', search: '', pathname: '/labs/g7-surface-volume.html' }, history: { replaceState() {} }, localStorage: { getItem() { return null; }, setItem() {} }, getComputedStyle: () => ({ getPropertyValue: (key) => key === '--font-ui' ? 'sans-serif' : key === '--m-glow' ? '0' : '#ffffff' }), matchMedia: () => ({ matches: false }), addEventListener: (event, fn) => { if (event === 'DOMContentLoaded') ready.push(fn); } };
  let seed = 14791;
  sandbox.Math = Object.create(Math);
  sandbox.Math.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  sandbox.window = sandbox;
  context = vm.createContext(sandbox);
  for (const filename of ['apl-core.js', 'apl-board.js']) vm.runInContext(fs.readFileSync(path.join(root, 'kit', filename), 'utf8'), context, { filename });
  let definition;
  context.APLab.createLab = (def) => { definition = def; };
  const html = fs.readFileSync(path.join(labs, 'g7-surface-volume.html'), 'utf8');
  const script = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map((x) => x[1]).find((x) => x.includes('const MODULES ='));
  vm.runInContext(script, context, { filename: 'g7-surface-volume.html' });
  ready.forEach((fn) => fn());
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.ok(definition, 'production module loader creates the lab');
  // The real shell clones scene definitions while adding group metadata.
  const list = definition.groups.flatMap((group) => group.scenes.map((scene) => ({ ...scene })));
  const board = new context.APLab.Board(canvas(), { ...definition.board, interactive: false });
  board.resize(1000, 650);
  // Symbolic paint names let the VM distinguish the three components; no pixels are synthesized.
  board.color = (name, alpha = 1) => `${name}:${alpha}`;
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
    const texts = [], textItems = [], paths = [], original = board._text, originalPath = board.path;
    board.path = function (points, options = {}) { paths.push({ points: points.map((p) => ({ x: p.x ?? p[0], y: p.y ?? p[1] })), options }); return originalPath.call(this, points, options); };
    board._text = function (x, y, text, options, screen) { if (text != null) { texts.push(String(text)); textItems.push({ x, y, text: String(text), options, screen }); } return original.call(this, x, y, text, options, screen); };
    try { const value = call(lab.scene.view, lab.s, lab); board.ctx.fills = []; board.begin(); lab.scene.draw(board, lab.s, value, lab); board.end(); return { texts, textItems, paths, fills: board.ctx.fills, value }; }
    finally { board._text = original; board.path = originalPath; }
  };
  lab.api = context.APL_SV;
  lab.setViewportWidth = width => { context.innerWidth = width; };
  lab.resetRandom = () => { seed = 14791; };
  return lab;
}


const views = [[1440,1039,656],[820,820,461],[1024,683,490],[390,390,411],[360,360,387]];
function prepare(lab, view, id='sv5-6', tab='review', progress=1, step=1, top='cyl') {
  lab.go(id);lab.tab=tab;lab.s.step=step;
  Object.assign(lab.s,{s56T:progress,svTop:top,svMode:'surf'});
  lab.setViewportWidth(view[0]);lab.board.resize(view[1],view[2]);lab.board.setInsets({bottom:58});
  lab.scene.view(lab.s,lab);lab.s.step=step;
}
function render(lab) {
  const rows=[],original=lab.api.drawTileRows;
  lab.api.drawTileRows=(D,R,cx,top)=>{rows.push(JSON.parse(JSON.stringify(R)));return original(D,R,cx,top);};
  try{return {...lab.draw(),rows};}finally{lab.api.drawTileRows=original;}
}
const geometry=d=>JSON.stringify({paths:d.paths,fills:d.fills});
const signature=d=>JSON.stringify({paths:d.paths,fills:d.fills,text:d.textItems});
const tileLabels=d=>d.rows.flatMap(R=>R.rows.flatMap(L=>L.tiles.flatMap(q=>[q.label,q.lab,q.cap,q.capt].filter(Boolean))));

await test('moving narrow review tiles retain their faces without overlapping computed labels',async t=>{
  const lab=await load();let checked=0;
  for(const v of views.slice(3))for(const top of ['cyl','cone'])for(const progress of [0.61,0.65,0.6593706,0.7,0.8,0.9,0.94]){
    prepare(lab,v,'sv5-6','review',progress,1,top);const d=render(lab);
    assert.ok(d.paths.length>=3,'basic solid or its moving faces remain rendered');
    const te=lab.api.ease(lab.api.lin01(progress,0.5,0.95));
    if(d.rows.length&&te<0.999)assert.equal(tileLabels(d).length,0,`${v[0]} ${top} ${progress}: moving calculations must not pile up`);
    assert.ok(!d.texts.some(x=>x.startsWith('겉넓이 = 면 넓이의 합 =')),'early review does not disclose final total');checked++;
  }
  t.diagnostic(`${checked} production draw states; actual Chromium visual review remains separate`);
});
await test('settled review restores every tile value and reveals total only at its final step',async t=>{
  const lab=await load();let checked=0;
  for(const v of views)for(const top of ['cyl','cone'])for(const step of [1,2,3,4]){
    prepare(lab,v,'sv5-6','review',1,step,top);const d=render(lab);
    assert.ok(tileLabels(d).length>=8,'settled faces retain their calculated values and captions');
    assert.equal(d.texts.some(x=>x.startsWith('겉넓이 = 면 넓이의 합 =')),step===4,`final total disclosure ${v[0]} ${top} step ${step}`);checked++;
  }
  t.diagnostic(`${checked} settled states including both round-top families`);
});
await test('returning from the final step keeps the total locked until that step is selected again',async()=>{
  const lab=await load();prepare(lab,views[4],'sv5-6','review',1,4);assert.ok(render(lab).texts.some(x=>x.startsWith('겉넓이 = 면 넓이의 합 =')));
  lab.s.step=1;assert.ok(!render(lab).texts.some(x=>x.startsWith('겉넓이 = 면 넓이의 합 =')));assert.equal(lab._answerOpen(),false);
  lab.tab='problem';assert.ok(!render(lab).texts.some(x=>x.startsWith('겉넓이 = 면 넓이의 합 =')));
  lab.go('sv5-6');assert.equal(lab.s.s56T,0);assert.equal(lab.s.revealed,false);assert.ok(render(lab).paths.length>3);
});
if(comparisonRef)await test('label-only repair preserves every sampled face, initial state, math and other scene',async t=>{
  const current=await load(null),old=await load(comparisonRef);let count=0;
  for(const v of views)for(const top of ['cyl','hemi','cone'])for(const tab of ['explore','problem','review'])for(const p of [0,0.5,0.6593706,1]){
    prepare(current,v,'sv5-6',tab,p,4,top);prepare(old,v,'sv5-6',tab,p,4,top);const a=render(current),b=render(old);
    assert.ok(geometry(a)===geometry(b),`geometry ${v[0]} ${top} ${tab} ${p}`);
    assert.equal(JSON.stringify(current.scene.sv.model(current.s)),JSON.stringify(old.scene.sv.model(old.s)));
    if(tab!=='review'||v[1]>=560||p===1||top==='hemi')assert.ok(signature(a)===signature(b),`outside label change ${v[0]} ${top} ${tab} ${p}`);count++;
  }
  for(const id of current.list.map(x=>x.id).filter(x=>x!=='sv5-6'))for(const v of views)for(const tab of ['explore','problem','review']){
    prepare(current,v,id,tab);prepare(old,v,id,tab);assert.ok(signature(render(current))===signature(render(old)),`${id} ${v[0]} ${tab}`);count++;
  }
  t.diagnostic(`${count} exact drawing/model comparisons against ${comparisonRef}`);
});
