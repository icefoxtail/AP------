// Regression for the six confirmed gt-kennel mobile review captures where the
// right-side radius formula was covered by the table-of-contents handle.
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
    const source = revision && el.src === 'g7-circle-sector/swept.js' ? execFileSync('git', ['show', `${revision}:apmath/playground/next/labs/g7-circle-sector/swept.js`], { cwd: path.resolve(root, '../../..'), encoding: 'utf8' }) : fs.readFileSync(path.join(labs, el.src), 'utf8');
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

await test('gt-kennel review steps 2–4 keep the full radius calculation left of the actual right-hand overlay', async () => {
  const lab = await load('', baseline), b = lab.board;
  for (const [W, H] of mobile) for (const step of [2, 3, 4]) {
    const d = render(lab, 'gt-kennel', W, H, 'review', step);
    const rightLabels = d.textItems.filter(q => q.options?.ref === 'B');
    assert.ok(rightLabels.length >= 2, 'the right sector keeps its radius and angle');
    assert.equal(rightLabels.map(q => q.text).join('').replaceAll(' ', ''), 'r=4−2=290°', 'line wrapping preserves the complete radius expression and angle');
    const overlay = { left: W - 24, right: W, top: 0, bottom: H - 60 };
    for (const item of rightLabels) {
      const box = bounds(b, item);
      assert.ok(box.right <= W - 32 + 1e-7, `${W}/step${step}: ${item.text} clears the 24px handle plus an 8px gap`);
      assert.equal(overlap(box, overlay), 0, 'the painted radius label does not enter the handle strip');
      assert.ok(box.top >= 3 && box.bottom <= H - 60 - 3, 'each wrapped line remains on the usable stage');
    }
    const C = d.textItems.find(q => q.text === 'C'); assert.ok(C);
    for (const item of rightLabels) assert.equal(overlap(bounds(b, item), bounds(b, C)), 0, 'moving the formula does not cover corner C');
    assert.equal(lab.s.gtT, 0); assert.equal(lab.s.revealed, false);
  }
});

await test('every supported kennel side/rope pair keeps complete stage formulas and exact sector areas', async () => {
  const lab = await load('', baseline), b = lab.board;
  for (const [W, H] of mobile) for (let q = 1; q <= 6; q++) for (let L = 1; L <= 2 * q; L++) for (const step of [2, 3, 4]) {
    const d = render(lab, 'gt-kennel', W, H, 'review', step, { gtQ: q, gtL: L });
    for (const item of d.textItems.filter(q => q.options?.ref === 'B')) {
      const box = bounds(b, item); assert.ok(box.right <= W - 32 + 1e-7, `${q}/${L}/${W}: right-side label clears the handle strip`);
    }
    const sectors = d.arcs.filter(q => q.options?.sector);
    const radius = Math.max(0, L - q), smallCount = radius > 0 ? (step === 2 ? 1 : 2) : 0;
    assert.equal(sectors.length, 1 + smallCount, 'only reachable corner sectors are shown at the specified proof stage');
    const actualPi = sectors.reduce((sum, a) => sum + a.r * a.r * Math.abs(a.end - a.start) / (2 * Math.PI), 0);
    const expectedPi = .75 * L * L + .25 * smallCount * radius * radius;
    assert.ok(Math.abs(actualPi - expectedPi) < 1e-7, 'independent 270-degree main + reachable 90-degree corner areas');
    assert.equal(lab.s.gtL, L); assert.equal(lab.s.gtQ, q);
  }
});

await test('reset and reentry restore the original kennel, rope and unrevealed problem', async () => {
  const lab = await load('', baseline), b = lab.board;
  render(lab, 'gt-kennel', 360, 387, 'explore'); const fresh = lab.draw();
  lab.s.gtT = 1; lab.s.playing = true;
  call(lab.scene.actions, lab.s).find(a => a.id === 'reset').run(lab.s, lab);
  assert.equal(lab.s.gtT, 0); assert.equal(lab.s.playing, false);
  assert.deepEqual(plain(lab.draw().textItems), plain(fresh.textItems));
  lab.go('gt-warehouse'); lab.go('gt-kennel'); assert.equal(lab.s.gtT, 0); assert.equal(lab.s.revealed, false);
  const p = render(lab, 'gt-kennel', 360, 291, 'problem'), rope = p.textItems.find(t => t.text === '4 m'), dog = p.textItems.find(t => t.text === '강아지');
  assert.ok(rope && dog && dog.y > rope.y, 'the prior rope/dog initial-label repair is retained');
});

if (arg('--compare-scope')) await test('all geometry, problem/review values and other scene drawing commands are unchanged', async () => {
  const current = await load(), old = await load('', arg('--compare-scope'));
  const ids = ['gt-kennel', 'gt-warehouse', 'gt-tri', 'gt-hex', 'gt-spiral'];
  for (const id of ids) for (const [W, H] of [[1039, 699], [820, 462], [683, 529], ...mobile]) for (const tab of ['explore', 'problem', 'review']) for (const step of tab === 'review' ? [1, 2, 3, 4] : [1]) {
    const a = render(current, id, W, H, tab, step), z = render(old, id, W, H, tab, step);
    assert.deepEqual(a.arcs, z.arcs, `${id}/${W}/${tab}/${step}: sector geometry`);
    assert.deepEqual(a.paths, z.paths, `${id}/${W}/${tab}/${step}: original fence/rope geometry`);
    assert.deepEqual(a.focus, z.focus); assert.deepEqual(a.state, z.state);
    assert.deepEqual(plain(a.value), plain(z.value), 'all problem, answer and readout data stay identical');
    assert.deepEqual(plain(call(current.scene.steps, current.s)), plain(call(old.scene.steps, old.s)));
    if (id !== 'gt-kennel' || W >= 560 || tab !== 'review' || step < 2) assert.deepEqual(plain(a.textItems), plain(z.textItems), 'non-target labels are unchanged');
  }
});
