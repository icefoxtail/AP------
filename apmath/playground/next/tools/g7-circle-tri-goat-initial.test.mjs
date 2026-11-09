// Regression for the confirmed gt-tri 360px initial problem where the animal
// name overlaps the given rope length; geometry and answer stages stay intact.
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
  const arcs = [], paths = [], originalArc = b.arc, originalPath = b.path;
  b.arc = function(p, r, start, end, options) { arcs.push(plain({ p, r, start, end, options })); return originalArc.apply(this, arguments); };
  b.path = function(points, options) { paths.push(plain({ points, options })); return originalPath.apply(this, arguments); };
  try { return { ...lab.draw(), arcs, paths, state: plain(lab.s), focus: plain(b.focus) }; }
  finally { b.arc = originalArc; b.path = originalPath; }
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

await test('the small-mobile initial triangular-fence problem separates the animal from the 10 m condition', async () => {
  const lab = await load('', baseline);
  const d = render(lab, 'gt-tri', 360, 291, 'problem');
  checkAnimalAndRope(lab, d, 'default');
  assert.ok(d.texts.includes('8 m'));
  assert.ok(d.texts.includes('A') && d.texts.includes('B') && d.texts.includes('C'));
  assert.equal(d.arcs.filter(item => item.options?.sector).length, 0, 'the unknown swept area is not revealed in the problem');
});

await test('all supported triangular side/rope pairs retain separate labels and unrevealed problem geometry', async () => {
  const lab = await load('', baseline); let count=0;
  for (let side=3;side<=10;side++) for(let rope=1;rope<=Math.floor(1.5*side);rope++) {
    const d=render(lab,'gt-tri',360,291,'problem',1,{gtS:side,gtL:rope});
    checkAnimalAndRope(lab,d,`${side}/${rope}`);
    assert.equal(d.state.gtS,side);assert.equal(d.state.gtL,rope);
    assert.equal(d.arcs.filter(item=>item.options?.sector).length,0);
    count++;
  }
  assert.equal(count,76);
});

if(arg('--compare-scope')) await test('only the compact triangular-fence animal caption changes; all geometry and answer data remain exact', async () => {
  const current=await load(),old=await load('',arg('--compare-scope'));
  const views=[[1039,741],[820,397],[683,613],[390,309],[360,291]];
  for(const id of ['gt-kennel','gt-warehouse','gt-tri','gt-hex','gt-spiral'])for(const [W,H]of views)for(const tab of ['explore','problem','review'])for(const step of tab==='review'?[1,2,3,4]:[1]){
    const a=render(current,id,W,H,tab,step),z=render(old,id,W,H,tab,step);
    assert.deepEqual(a.arcs,z.arcs);assert.deepEqual(a.paths,z.paths);assert.deepEqual(a.focus,z.focus);assert.deepEqual(a.state,z.state);
    assert.deepEqual(plain(a.value),plain(z.value));
    assert.deepEqual(plain(call(current.scene.steps,current.s)),plain(call(old.scene.steps,old.s)));
    if(id==='gt-tri'&&W===360&&tab==='problem')assert.deepEqual(plain(a.textItems.filter(t=>t.text!=='염소')),plain(z.textItems.filter(t=>t.text!=='염소')));
    else assert.deepEqual(plain(a.textItems),plain(z.textItems),`${id}/${W}/${tab}/${step}: unaffected labels`);
  }
});
