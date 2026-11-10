// Production scene/Board regression checks. This VM checks math and drawing commands;
// it does not replace a real browser, layout audit, or physical-device review.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
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

async function load() {
  let context;
  const ready = [];
  const element = (tag) => tag === 'canvas' ? canvas() : { tagName: tag.toUpperCase(), dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, append() {} };
  const document = { getElementById() { return null; }, querySelector() { return null; }, createElement: element, createTextNode: (text) => ({ textContent: text }), addEventListener() {}, documentElement: element('html'), body: element('body'), head: element('head') };
  document.head.append = (el) => {
    if (el.tagName !== 'SCRIPT') return;
    vm.runInContext(fs.readFileSync(path.join(labs, el.src), 'utf8'), context, { filename: el.src });
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
    try { const value = call(lab.scene.view, lab.s, lab); board.begin(); lab.scene.draw(board, lab.s, value, lab); board.end(); return { texts, textItems, paths, value }; }
    finally { board._text = original; board.path = originalPath; }
  };
  lab.api = context.APL_SV;
  lab.setViewportWidth = width => { context.innerWidth = width; };
  return lab;
}

// The mobile contents tab is24px wide in source-bound Chromium captures. Its
// left edge must stay8px outside the original solid, including the base rim.
await test('frustum problem rim remains outside the mobile contents tab', async t => {
  const lab = await load(), original = lab.api.coneNet;
  let rendered, checked = 0;
  lab.api.coneNet = (...args) => (rendered = original(...args));
  try {
    for (const [w, h] of [[390, 309], [360, 291]]) for (const bottom of [58, 60]) {
      lab.setViewportWidth(w);
      for (const family of ['A', 'B', 'C']) for (let k = 2; k <= 5; k++) for (let j = 1; j < k; j++) {
        const scene = lab.go('sv2-4');
        Object.assign(lab.s, { svTri4: family, s4K: k, s4J: j, svMode: 'surf' });
        lab.tab = 'problem'; lab.board.resize(w, h); lab.board.setInsets({ bottom });
        const drawing = lab.draw(), M = scene.sv.model(lab.s);
        const points = rendered.tp.flatMap(piece => piece.pts).map(p => rendered.D.px(p));
        const right = Math.max(...points.map(p => p.x)), left = Math.min(...points.map(p => p.x));
        assert.ok(right <= w - 32, `${w}px ${family}/${k}/${j}: original rim x=${right} is clear of contents tab at x=${w - 24}`);
        assert.ok(left >= 4, `${w}px: opposite side remains in view`);
        assert.ok(points.every(p => p.y >= 4 && p.y <= h - bottom - 4), 'original solid remains above the bottom toolbar');
        if (family === 'A' && k === 2 && j === 1) {
          assert.ok(right - left >= 280, 'default original frustum remains large enough to read');
          for (const given of ['반지름 3', '반지름 6', '모선 5', '높이 4']) assert.ok(drawing.texts.includes(given), `${given} remains visible`);
        }
        const expectedArea = Math.PI * ((M.r1 + M.r2) * Math.hypot(M.r2 - M.r1, M.hf) + M.r1 ** 2 + M.r2 ** 2);
        const expectedVolume = Math.PI * M.hf * (M.r1 ** 2 + M.r1 * M.r2 + M.r2 ** 2) / 3;
        assert.ok(Math.abs(lab.api.vnum(M.surf) - expectedArea) < 1e-8, 'independent frustum area');
        assert.ok(Math.abs(lab.api.vnum(M.vol) - expectedVolume) < 1e-8, 'independent frustum volume');
        const q = scene.sv.prob(M);
        assert.ok(Math.abs(lab.api.vnum(q.choices.find(c => c.ok).val) - expectedArea) < 1e-8, 'current question keeps the same mathematical answer');
        assert.equal(lab._answerOpen(), false);
        assert.doesNotMatch(scene.problem.text(lab.s), /class="sv-ch (?:ok|bad)"|class="sv-fb/);
        checked++;
      }
    }
  } finally { lab.api.coneNet = original; }
  t.diagnostic(`${checked} production drawings; two mobile sizes and58/60px bottom reservations`);
});

await test('frustum initial solid, unfolding and reset preserve all conditions and answer stages', async () => {
  const lab = await load(), original = lab.api.coneNet;
  let rendered;
  lab.api.coneNet = (...args) => (rendered = original(...args));
  try {
    for (const [w, h] of [[390, 326], [360, 307]]) {
      lab.setViewportWidth(w);
      const scene = lab.go('sv2-4'); lab.board.resize(w, h); lab.board.setInsets({ bottom: 58 });
      const initial = lab.draw(), model = JSON.stringify(scene.sv.model(lab.s));
      const initialShape = JSON.stringify(rendered.tp.map(p => p.pts));
      lab.s.playing = true; scene.tick(lab.s, scene.sv.anim.dur / 2, lab);
      lab.draw(); const middleShape = JSON.stringify(rendered.tp.map(p => p.pts));
      scene.tick(lab.s, scene.sv.anim.dur / 2, lab);
      lab.draw(); const finalShape = JSON.stringify(rendered.tp.map(p => p.pts));
      assert.notEqual(initialShape, middleShape); assert.notEqual(middleShape, finalShape);
      assert.equal(lab.s.s4T, 1); assert.equal(lab.s.playing, false);
      assert.equal(JSON.stringify(scene.sv.model(lab.s)), model);
      lab.s.s4T = 0; const reset = lab.draw();
      assert.equal(JSON.stringify(rendered.tp.map(p => p.pts)), initialShape);
      assert.deepEqual(reset.texts, initial.texts);
      lab.go('sv1-1'); lab.go('sv2-4'); lab.board.setInsets({ bottom: 58 }); lab.draw();
      assert.equal(JSON.stringify(rendered.tp.map(p => p.pts)), initialShape, 'reentry restores the original solid');
      lab.tab = 'review';
      for (let step = 0; step < scene.steps(lab.s).length; step++) {
        lab.s.step = step; assert.equal(scene.view(lab.s, lab).formula, null);
      }
      lab.s.step = scene.steps(lab.s).length;
      assert.ok(scene.view(lab.s, lab).formula, 'final formula still becomes available');
    }
  } finally { lab.api.coneNet = original; }
});
