// Regression for the actual gt-kennel review270-degree caption covered by rope text.
// Keep the given rope length and first sector angle separately readable.
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
// Actual9bf PC/360 native-review stages and three other measured canvas sizes.
const views = [[1039, 741], [820, 461], [683, 435], [390, 411], [360, 387]];
function render(lab, id, W, H, tab, step = 1, values = {}) {
  const b = lab.board; b.resize(W, H);
  lab.go(id); lab.tab = tab; Object.assign(lab.s, values);
  // enter() resets insets; the shell then installs the actual stage geometry.
  b.setInsets({ top: 0, right: W === 1039 || W === 683 ? 16 : 0, bottom: W === 1039 || W === 683 ? 56 : 60, left: 0 });
  call(lab.scene.view, lab.s, lab); lab.s.step = step;
  const arcs = [], paths = [], leaders = [], originalArc = b.arc, originalPath = b.path, originalLeader = b.leader;
  b.arc = function(p, r, start, end, options) { arcs.push(plain({ p, r, start, end, options })); return originalArc.apply(this, arguments); };
  b.path = function(points, options) { paths.push(plain({ points, options, leader: !!b._testingLeader })); return originalPath.apply(this, arguments); };
  b.leader = function(anchor,label,options) { let result; b._testingLeader=true;try{result=originalLeader.apply(this,arguments);}finally{b._testingLeader=false;} leaders.push(plain({anchor,label,options,result}));return result; };
  try { return { ...lab.draw(), arcs, paths, leaders, state: plain(lab.s), focus: plain(b.focus) }; }
  finally { b.arc = originalArc; b.path = originalPath; b.leader = originalLeader; }
}
function paintBox(b, item) {
  const size = b.annotationSize(item.text, item.options), align = item.options.align || 'center';
  const left = align === 'left' ? item.x - 3 : align === 'right' ? item.x - size.width + 3 : item.x - size.width / 2;
  return { left, right: left + size.width, top: item.y - size.height / 2, bottom: item.y + size.height / 2 };
}
const gap = (a, b) => Math.max(a.left - b.right, b.left - a.right, a.top - b.bottom, b.top - a.bottom);
// annotationSize deliberately reserves3px on each side of measured text.
const glyphBox = (b, t) => { const box = paintBox(b, t); return { left: box.left + 3, right: box.right - 3, top: box.top + 3, bottom: box.bottom - 3 }; };
function near(actual, expected, label) { assert.ok(Math.abs(actual - expected) < 1e-7, `${label}: ${actual} vs ${expected}`); }
function checkLabels(lab, drawing, label) {
  const b = lab.board;
  const rope = drawing.textItems.find(t => t.text === `끈 ${lab.s.gtL} m`);
  const captions = drawing.textItems.filter(t => t.options.ref === 'A' && (t.text.startsWith('r = ') || t.text === '270°'));
  assert.ok(rope, `${label}: given rope length remains visible`);
  assert.equal(captions.length, 2, `${label}: both the first sector radius and 270° remain visible`);
  const ropeBox = paintBox(b, rope);
  for (const caption of captions) assert.ok(gap(glyphBox(b, rope), glyphBox(b, caption)) >= 4 - 1e-7, `${label}: rope value is separate from ${caption.text}`);
  assert.ok(ropeBox.left >= 4 && ropeBox.right <= b.W - 4 && ropeBox.top >= 4 && ropeBox.bottom <= b.H - b.insets.bottom - 4, `${label}: full rope value stays in the visible stage`);
  const links = drawing.leaders.filter(l => l.options.ref === 'rope');
  assert.ok(links.length <= 1, `${label}: at most one rope-value connector`);
  for (const link of links) {
    assert.equal(link.options.px, true);
    const size = b.annotationSize(rope.text, rope.options);
    near(link.options.width, size.width, 'actual connector box width');
    near(link.options.height, size.height, 'actual connector box height');
    assert.equal(link.result.drawn, true, `${label}: connector is actually painted`);
    near(link.result.label.x, rope.x, 'connector label x');
    near(link.result.label.y, rope.y, 'connector label y');
    const line = drawing.paths.find(p => !p.leader && p.options.ref === 'rope');
    assert.ok(line && line.points.length === 2, `${label}: original straight rope remains`);
    const endpoints = line.points.map(p => b.toS(p));
    near(link.result.anchor.x, (endpoints[0].x + endpoints[1].x) / 2, 'actual rope midpoint x');
    near(link.result.anchor.y, (endpoints[0].y + endpoints[1].y) / 2, 'actual rope midpoint y');
    const painted = drawing.paths.find(p => p.leader && p.options.ref === 'rope');
    assert.ok(painted && painted.points.length === 2, `${label}: real connector path exists`);
    for (const [p, expected] of [[painted.points[0], link.result.anchor], [painted.points[1], link.result.end]]) {
      const actual = b.toS(p); near(actual.x, expected.x, 'painted leader x'); near(actual.y, expected.y, 'painted leader y');
    }
    for (const other of drawing.textItems.filter(t => t !== rope)) assert.ok(gap(ropeBox, paintBox(b, other)) >= 4 - 1e-7, `${label}: relocated rope value clears ${other.text}`);
    for (const point of [link.result.anchor, link.result.label, link.result.end]) assert.ok(point.x >= 4 && point.x <= b.W - 4 && point.y >= 4 && point.y <= b.H - b.insets.bottom - 4, `${label}: verified leader coordinates remain visible`);
  }
  assert.equal(drawing.state.revealed, false); assert.equal(drawing.state.playing, false);
  return links.length;
}

await test('the actual360px first review preserves separate rope and270-degree labels', async () => {
  const lab = await load('', baseline);
  const first = render(lab, 'gt-kennel', 360, 387, 'review');
  assert.equal(checkLabels(lab, first, '360/Q2/L4'), 1);
  render(lab, 'gt-kennel', 360, 387, 'review', 4);
  const back = render(lab, 'gt-kennel', 360, 387, 'review', 1);
  assert.deepEqual(plain(back.textItems), plain(first.textItems), 'returning to step1 restores the same separate givens');
});

await test('all permitted kennel and rope values keep their captions visible in five measured stages', async () => {
  const lab = await load('', baseline); let count = 0, moved = 0;
  for (const [W, H] of views) for (let q = 1; q <= 6; q++) for (let length = 1; length <= 2 * q; length++) {
    const d = render(lab, 'gt-kennel', W, H, 'review', 1, { gtQ: q, gtL: length });
    moved += checkLabels(lab, d, `${W}/Q${q}/L${length}`);
    assert.equal(d.state.gtQ, q); assert.equal(d.state.gtL, length); count++;
  }
  assert.equal(count, 210); assert.ok(moved > 0);
});

if (arg('--compare-scope')) await test('only crowded kennel step1 rope text moves; figures, numbers, other goats and reveal stages are identical', async () => {
  const current = await load(), previous = await load('', arg('--compare-scope')); let pairs = 0;
  const compare = (id, W, H, tab, step, values = {}) => {
    const a = render(current, id, W, H, tab, step, values), b = render(previous, id, W, H, tab, step, values);
    assert.deepEqual(a.arcs, b.arcs); assert.deepEqual(a.paths.filter(p => !p.leader), b.paths.filter(p => !p.leader));
    assert.deepEqual(a.focus, b.focus); assert.deepEqual(a.state, b.state); assert.deepEqual(plain(a.value), plain(b.value));
    assert.deepEqual(plain(call(current.scene.steps, current.s)), plain(call(previous.scene.steps, previous.s)));
    assert.deepEqual(plain(current.scene.csd?.make(current.s)), plain(previous.scene.csd?.make(previous.s)));
    const changed = id === 'gt-kennel' && tab === 'review' && step === 1 && a.leaders.some(l => l.options.ref === 'rope');
    if (changed) {
      const rope = t => /^끈 .* m$/.test(t.text);
      assert.deepEqual(plain(a.textItems.filter(t => !rope(t))), plain(b.textItems.filter(t => !rope(t))));
      assert.deepEqual(a.texts, b.texts, 'no text, answer or intermediate result is added or removed');
    } else { assert.deepEqual(a.paths, b.paths); assert.deepEqual(plain(a.textItems), plain(b.textItems)); }
    pairs++;
  };
  for (const id of ['gt-kennel', 'gt-warehouse', 'gt-tri', 'gt-hex', 'gt-spiral']) for (const [W, H] of views) for (const tab of ['explore', 'problem', 'review']) for (const step of tab === 'review' ? [1, 2, 3, 4] : [1]) compare(id, W, H, tab, step);
  for (const [W, H] of views) for (let q = 1; q <= 6; q++) for (let length = 1; length <= 2 * q; length++) compare('gt-kennel', W, H, 'review', 1, { gtQ: q, gtL: length });
  assert.equal(pairs, 360);
  const wide = render(current, 'gt-kennel', 1039, 741, 'review');
  assert.equal(wide.leaders.filter(l => l.options.ref === 'rope').length, 0, 'the originally readable PC default stays unchanged');
});
