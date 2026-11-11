// The production HTML, deferred scripts and actual Board run in this VM.
// Canvas calls are checked, but this is not a browser or mobile visual audit.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const page = path.join(root, 'labs/common-functions.html');
const call = (value, ...args) => typeof value === 'function' ? value(...args) : value;
const point = p => ({ x: p.x ?? p[0], y: p.y ?? p[1] });
const numericArgs = { moveTo: [0, 1], lineTo: [0, 1], rect: [0, 1, 2, 3], roundRect: [0, 1, 2, 3, 4], fillRect: [0, 1, 2, 3], clearRect: [0, 1, 2, 3], arc: [0, 1, 2, 3, 4], ellipse: [0, 1, 2, 3, 4, 5, 6], fillText: [1, 2], strokeText: [1, 2], bezierCurveTo: [0, 1, 2, 3, 4, 5], quadraticCurveTo: [0, 1, 2, 3], setTransform: [0, 1, 2, 3, 4, 5] };
function canvas() {
  const ops = [];
  let recordWhen = () => true;
  const ctx = new Proxy({ globalAlpha: 1, measureText: text => ({ width: String(text).length * 8 }), createLinearGradient() { return { addColorStop() {} }; }, createRadialGradient() { return { addColorStop() {} }; } }, {
    get(target, key) {
      if (key in target) return target[key];
      return (...args) => {
        for (const i of numericArgs[key] || []) assert.ok(Number.isFinite(args[i]), `${String(key)} coordinate ${i} must be finite; got ${String(args[i])}`);
        if (numericArgs[key] && recordWhen()) ops.push({ name: key, args });
      };
    },
    set(target, key, value) { target[key] = value; return true; }
  });
  return { width: 1000, height: 650, ops, recordWhen(fn) { recordWhen = fn; }, getContext: () => ctx, addEventListener() {}, getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 650 }) };
}

export async function load({ allowMissingLessons = false } = {}) {
  const ready = [], listeners = new Map(), loaded = [], missing = [];
  let context, definition;
  const listen = (event, fn) => {
    if (event === 'DOMContentLoaded') ready.push(fn);
    else { const list = listeners.get(event) || []; list.push(fn); listeners.set(event, list); }
  };
  const element = tag => tag === 'canvas' ? canvas() : { tagName: tag.toUpperCase(), dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, append() {}, remove() {} };
  const document = { readyState: 'loading', compatMode: 'CSS1Compat', getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; }, createElement: element, createTextNode: text => ({ textContent: text }), addEventListener: listen, documentElement: element('html'), body: element('body'), head: element('head') };
  const runExternal = src => {
    const filename = path.resolve(path.dirname(page), src);
    assert.ok(filename.startsWith(root + path.sep), 'page script remains within the local production tree');
    if (allowMissingLessons && /common-functions\/lesson-[ab]\.js$/.test(src) && !fs.existsSync(filename)) { missing.push(src); return; }
    vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename });
    loaded.push(src);
  };
  document.head.append = el => { if (el.tagName === 'SCRIPT') { runExternal(el.src); el.onload?.(); } };
  const sandbox = { innerWidth: 1440, document, console, URLSearchParams, performance, setTimeout, clearTimeout, requestAnimationFrame: () => 0, cancelAnimationFrame() {}, devicePixelRatio: 1, navigator: { userAgent: 'node-vm' }, location: { hash: '', search: '', pathname: '/labs/common-functions.html' }, history: { replaceState() {} }, localStorage: { getItem() { return null; }, setItem() {} }, getComputedStyle: () => ({ getPropertyValue: key => key === '--font-ui' ? 'sans-serif' : key === '--m-glow' ? '0' : '#ffffff' }), matchMedia: () => ({ matches: false, addEventListener() {} }), addEventListener: listen };
  let seed = 14791;
  sandbox.Math = Object.create(Math);
  sandbox.Math.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  sandbox.window = sandbox;
  context = vm.createContext(sandbox);
  const html = fs.readFileSync(page, 'utf8'), deferred = [];
  for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const src = script[1].match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (src) {
      if (/\bdefer\b/i.test(script[1])) deferred.push(src);
      else runExternal(src);
    } else if (script[2].trim()) vm.runInContext(script[2], context, { filename: page });
  }
  for (const src of deferred) runExternal(src);
  // Keep the production script order. Only shell UI construction is replaced;
  // source closures, lesson installation and drawing functions remain actual code.
  assert.ok(context.APLab?.createLab, 'production shell exports createLab');
  context.APLab.createLab = def => {
    definition = def;
    // PROB.attach immediately installs getters closed over this shell object.
    // Preserve its identity when adding the actual Board and runtime methods.
    context.lab = {
      def, list: def.groups.flatMap(group => group.scenes.map(scene => ({ ...scene, groupId: group.id }))),
      index: 0, tab: 'explore', s: { ...def.state }, params: { ...def.params }, refs: {},
      invalidate() {}, _buildReview() {}, _buildProblem() {},
      goScene(i) { this.index = i; }, setTab(tab) { this.tab = tab; }, setStep(n) { this.s.step = n; },
      get scene() { return this.list[this.index]; }
    };
    for (const [key, param] of Object.entries(context.lab.params)) context.lab.s[key] = param.value;
    return context.lab;
  };
  document.readyState = 'interactive';
  for (const fn of ready) fn();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.ok(definition, 'production inline page creates the lab');
  const list = context.lab.list;
  assert.ok(Array.isArray(list), 'the production page exposes its original scenes');
  const surface = canvas(), board = new context.APLab.Board(surface, { ...definition.board, interactive: false });
  board.resize(1000, 650);
  // Source auto-fit paints stage 99 only into Board.measure. Those calls are
  // geometry measurements, not student-visible canvas frames or answer leaks.
  surface.recordWhen(() => !board._bbox);
  const lab = context.lab;
  Object.assign(lab, { board, loaded, missing, html });
  lab._answerOpen = () => lab.s.revealed || lab.s.step >= (call(lab.scene.steps, lab.s) || []).length;
  lab.measureFocus = scene => {
    const value = call(scene.view, lab.s, lab) || {};
    const run = () => board.measure(() => (scene.draw || definition.draw)(board, lab.s, value, lab));
    let box = run();
    if (!box) return null;
    if (board.panes) {
      const dx = (box.x1 - box.x0) * .1 + 46, dy = (box.y1 - box.y0) * .08 + 30;
      return { x: [box.x0 - dx, box.x1 + dx], y: [box.y0 - dy, box.y1 + dy] };
    }
    const options = { margin: .08, px: 12 };
    const keep = { focus: board.focus, zoom: board.zoom, panX: board.panX, panY: board.panY };
    Object.assign(board, { focus: board.fitBox(box, options), zoom: 1, panX: 0, panY: 0 });
    box = run() || box;
    Object.assign(board, keep);
    return board.fitBox(box, options);
  };
  lab.go = id => {
    lab.index = list.findIndex(scene => scene.id === id);
    assert.ok(lab.index >= 0, `scene ${id} exists`);
    lab.tab = 'explore';
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false, step: lab.scene.startStep ?? 0, revealed: false, playing: false });
    board.kind = lab.scene.boardKind || definition.board.kind;
    definition.enter?.(lab.s, lab.scene, lab);
    lab.scene.enter?.(lab.s, lab);
    board.aspect = (lab.scene.aspect || definition.board.aspect) === 'free' ? 'free' : '1:1';
    board.setPanes(call(lab.scene.panes, lab.s) || null);
    let focus = call(lab.scene.focus, lab.s) || call(definition.board.focus, lab.s);
    if (!focus && (lab.scene.autoFit || definition.board.autoFit)) focus = lab.measureFocus(lab.scene);
    if (focus) board.setFocus(focus, true);
    return lab.scene;
  };
  // Record actual Board primitives and direct canvas labels together.
  // Persistent recorders also preserve any source-installed drawing hooks.
  let frame;
  const originals = Object.fromEntries(['_text', 'path', 'plot', 'point', 'handle', 'arc', 'circle'].map(key => [key, board[key]]));
  board.path = function (ps, options = {}) { if (!this._bbox) frame?.paths.push({ points: ps.map(point), options }); return originals.path.call(this, ps, options); };
  board.plot = function (f, options = {}) {
    if (frame && !this._bbox) {
      const vb = this.viewBox(), lo = Math.max(options.from ?? -Infinity, vb.x0), hi = Math.min(options.to ?? Infinity, vb.x1);
      const samples = Array.from({ length: 5 }, (_, i) => { const x = lo + (hi - lo) * i / 4; return { x, y: f(x) }; }).filter(p => Number.isFinite(p.x) && Number.isFinite(p.y));
      frame.plots.push({ samples, options, from: lo, to: hi, evaluate: f });
    }
    return originals.plot.call(this, f, options);
  };
  board.circle = function (p, radius, options = {}) { if (!this._bbox) frame?.circles.push({ center: point(p), radius, options }); return originals.circle.call(this, p, radius, options); };
  board.arc = function (p, radius, from, to, options = {}) { if (!this._bbox) frame?.arcs.push({ center: point(p), radius, from, to, options }); return originals.arc.call(this, p, radius, from, to, options); };
  board.point = function (p, options = {}) { if (!this._bbox) frame?.points.push({ point: point(p), options }); return originals.point.call(this, p, options); };
  board.handle = function (id, p, options = {}) { if (!this._bbox) frame?.handles.push({ id, point: point(p), options }); return originals.handle.call(this, id, p, options); };
  board._text = function (x, y, text, options, screen) { if (frame && !this._bbox && text != null) { frame.texts.push(String(text)); frame.textItems.push({ x, y, text: String(text), options, screen }); } return originals._text.call(this, x, y, text, options, screen); };
  lab.draw = () => {
    frame = { texts: [], textItems: [], paths: [], plots: [], points: [], handles: [], arcs: [], circles: [] };
    surface.ops.length = 0;
    try {
      board.setPanes(call(lab.scene.panes, lab.s) || null);
      const value = call(lab.scene.view, lab.s, lab);
      board.begin(); lab.scene.draw(board, lab.s, value, lab); board.end();
      const canvasText = surface.ops.filter(op => op.name === 'fillText' || op.name === 'strokeText').map(op => String(op.args[0]));
      return { ...frame, boardTexts: frame.texts, texts: [...frame.texts, ...canvasText], canvasText, value, canvas: surface.ops.slice(), focus: board.focus, viewBox: board.viewBox() };
    } finally { frame = null; }
  };
  lab.newProblem = () => {
    const selector = lab.scene.id.startsWith('b9-') ? '[data-b9-new]' : '[data-old-new]';
    const hit = { hasAttribute: name => selector === '[' + name + ']', getAttribute: () => null };
    for (const fn of listeners.get('click') || []) fn({ target: { closest: wanted => wanted === selector ? hit : null } });
  };
  lab.api = context.APL_CF_SOURCE;
  lab.lessonApi = context.APL_CF_LESSONS;
  lab.video = context.APLab.videoCore;
  lab.math = context.Math;
  return lab;
}
