// Native Chromium regression: sv4-1 at1024x768, first-entry formula card covers slant5.
// VM uses production Board and scene commands; actual candidate screenshots remain separate.
// Negative control: --baseline 9bf; historical scope check: --compare-scope d0bd8eed.
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
    fills: [], paintedText: [], fillStyle: '', strokeStyle: '', globalAlpha: 1, font: '16px sans-serif',
    measureText(text) {
      const size = Number(String(this.font).match(/([\d.]+)px/)?.[1] || 16);
      const width = [...String(text)].reduce((sum, c) => sum + size * (c.charCodeAt(0) >= 0x1100 ? 1 : c === ' ' ? .32 : .62), 0);
      return { width };
    },
    fillText(text, x, y) {
      assert.ok(Number.isFinite(x) && Number.isFinite(y));
      if (this.globalAlpha < .02 || !String(text).trim()) return;
      const size = Number(String(this.font).match(/([\d.]+)px/)?.[1] || 16), w = this.measureText(text).width;
      const l = this.textAlign === 'center' ? x - w / 2 : this.textAlign === 'right' ? x - w : x;
      const top = this.textBaseline === 'middle' ? y - size / 2 : y - size * .8;
      this.paintedText.push({ text: String(text), left: l, right: l + w, top, bottom: top + size, alpha: this.globalAlpha });
    },
    createRadialGradient: () => ({ addColorStop() {} }),
    beginPath() { current = []; contour = []; },
    moveTo(x, y) { contour = [{ x, y }]; current.push(contour); },
    lineTo(x, y) { contour.push({ x, y }); },
    closePath() {},
    fill() { this.fills.push({ style: this.fillStyle, alpha: this.globalAlpha, contours: current.map(p => p.slice()) }); },
    save() { saved.push({ fillStyle: this.fillStyle, strokeStyle: this.strokeStyle, globalAlpha: this.globalAlpha, font: this.font, textAlign: this.textAlign, textBaseline: this.textBaseline }); },
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
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const baselineRef = arg('--baseline');
// Historical equality is an additional local review, not a dependency of shallow CI checkouts.
const comparisonRef = arg('--compare-scope');
async function load(ref = baselineRef) {
  let context;
  const ready = [];
  const element = (tag) => tag === 'canvas' ? canvas() : { tagName: tag.toUpperCase(), dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, append() {} };
  const document = { getElementById() { return null; }, querySelector(selector) { return selector === '.apl-canvas-wrap' ? { clientWidth: context?.lab?.board?.W || 1000 } : null; }, createElement: element, createTextNode: (text) => ({ textContent: text }), addEventListener() {}, documentElement: element('html'), body: element('body'), head: element('head') };
  document.head.append = (el) => {
    if (el.tagName !== 'SCRIPT') return;
    const file = path.join(labs, el.src);
    const versioned = /g7-surface-volume\/t4\.js$/.test(el.src);
    const source = ref && versioned ? execFileSync('git', ['show', `${ref}:${path.relative(repo, file)}`], { cwd: repo, encoding: 'utf8' }) : fs.readFileSync(file, 'utf8');
    if (versioned) {
      const originalScene3 = context.APL_SV.scene3;
      context.APL_SV.scene3 = (...args) => {
        const d = originalScene3(...args), dim = d.dim;
        d.dim = (a, b, label, options) => {
          const result = dim(a, b, label, options);
          context.dimensionCalls?.push({ a: d.px(a), b: d.px(b), label, options, result });
          return result;
        };
        return d;
      };
    }
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
    const texts = [], textItems = [], paths = [], leaders = [], original = board._text, originalPath = board.path, originalLeader = board.leader;
    board.leader = function (anchor, label, options) { const result = originalLeader.call(this, anchor, label, options); leaders.push({ anchor, label, options, result }); return result; };
    board.path = function (points, options = {}) { paths.push({ points: points.map((p) => ({ x: p.x ?? p[0], y: p.y ?? p[1] })), options }); return originalPath.call(this, points, options); };
    board._text = function (x, y, text, options, screen) { if (text != null) { texts.push(String(text)); textItems.push({ x, y, text: String(text), options, screen }); } return original.call(this, x, y, text, options, screen); };
    try { context.dimensionCalls = []; const value = call(lab.scene.view, lab.s, lab); board.ctx.fills = []; board.ctx.paintedText = []; board.begin(); lab.scene.draw(board, lab.s, value, lab); board.end(); return { texts, textItems, paths, leaders, fills: board.ctx.fills, paintedText: board.ctx.paintedText, dimensions: context.dimensionCalls, value }; }
    finally { board._text = original; board.path = originalPath; board.leader = originalLeader; }
  };
  lab.api = context.APL_SV;
  lab.setViewportWidth = width => { context.innerWidth = width; };
  lab.resetRandom = () => { seed = 14791; };
  return lab;
}


const plain = value => JSON.parse(JSON.stringify(value));
const views = [
  { name: 'pc', width: 1039, height: 656, viewport: 1440, insets: { right: 16, bottom: 56 } },
  { name: 'portrait', width: 820, height: 461, viewport: 820, insets: { bottom: 74 } },
  { name: 'landscape', width: 683, height: 452, viewport: 1024, insets: { right: 16, bottom: 56 } },
  { name: 'mobile', width: 390, height: 411, viewport: 390, insets: { bottom: 60 } },
  { name: 'small-mobile', width: 360, height: 387, viewport: 360, insets: { bottom: 60 } }
];
function setView(lab, view) { lab.setViewportWidth(view.viewport); lab.board.resize(view.width, view.height); lab.board.setInsets(view.insets); }
const bodySignature = d => JSON.stringify({ paths: d.paths, fills: d.fills, text: d.textItems });
function slantLabel(d) { return d.paintedText.find(t => /^모선\(빗변\)/.test(t.text)); }
function overlaps(a, b, margin = 0) { return a.left < b.right + margin && a.right > b.left - margin && a.top < b.bottom + margin && a.bottom > b.top - margin; }
function card(view, mode = 'surf') { return { left: view.width - 232, right: view.width - 12, top: 12, bottom: mode === 'surf' ? 186 : 152 }; }

await test('native683x452 original triangle and slant5 stay clear of the actual formula-card rectangle', async t => {
  const lab = await load(); lab.go('sv4-1'); const view = views[2]; setView(lab, view);
  const drawing = lab.draw(), label = slantLabel(drawing); assert.ok(label); assert.ok(drawing.value.card);
  assert.ok(!overlaps(label, card(view), 8), `slant ${JSON.stringify(label)} overlaps actual formula card ${JSON.stringify(card(view))}`);
  t.diagnostic(`slantlabel=${JSON.stringify(label)}; boardscale=${lab.board.k}`);
  assert.equal(lab.s.s41T, 0); assert.equal(lab._answerOpen(), false);
});

function dimensionOwnership(drawing) {
  const d = drawing.dimensions.find(x => /^모선\(빗변\)/.test(x.label));
  assert.ok(d?.result?.box, 'real dimension operation provides the value box');
  const { A2, B2, n, box } = d.result;
  for (const [actual, edge] of [[A2, d.a], [B2, d.b]]) {
    assert.ok(Math.abs(Math.hypot(actual.x - edge.x, actual.y - edge.y) - 20) < 1e-7, 'dimension endpoint is exactly20px from its actual slant edge endpoint');
    assert.ok(Math.abs((actual.x - edge.x) - n.x * 20) < 1e-7);
    assert.ok(Math.abs((actual.y - edge.y) - n.y * 20) < 1e-7);
  }
  const label = slantLabel(drawing);
  assert.ok(Math.abs((box.x0 + box.x1) / 2 - (label.left + label.right) / 2) < 1e-7, 'painted value belongs to the real dimension box');
  assert.ok(Math.abs((box.y0 + box.y1) / 2 - (label.top + label.bottom) / 2) < 1e-7);
}

await test('four triangle presets, both axes and modes preserve all dimensions across the first rotation half', async t => {
  const lab = await load(); let checked = 0, minGap = Infinity;
  for (const [key, maxK] of Object.entries({ A: 3, B: 2, C: 2, D: 1 })) for (let k = 1; k <= maxK; k++) for (const axis of ['long', 'short']) for (const mode of ['surf', 'vol']) {
    lab.go('sv4-1'); Object.assign(lab.s, { svTri: key, s41K: k, svAxis: axis, svMode: mode }); setView(lab, views[2]);
    for (let n = 0; n < 50; n++) {
      lab.s.s41T = n / 100; const drawing = lab.draw(), label = slantLabel(drawing); assert.ok(label);
      for (const text of drawing.paintedText) {
        assert.ok(!overlaps(text, card(views[2], mode), 8), `${key}/${k}/${axis}/${mode}/t${n / 100}: ${text.text} enters formula card`);
        assert.ok(text.left >= 0 && text.right <= 683 && text.top >= 0 && text.bottom <= 452 - 56, 'dimension stays inside usable stage');
      }
      const gap = card(views[2]).left - label.right; minGap = Math.min(minGap, gap);
      dimensionOwnership(drawing); assert.equal(lab._answerOpen(), false); checked++;
    }
    const m = lab.scene.sv.model(lab.s);
    assert.ok(Math.abs(Math.hypot(m.r, m.h) - m.R) < 1e-9);
    assert.ok(Math.abs(lab.api.vnum(m.tot) - Math.PI * m.r * (m.r + m.R)) < 1e-8);
    assert.ok(Math.abs(lab.api.vnum(m.vol) - Math.PI * m.r ** 2 * m.h / 3) < 1e-8);
    assert.ok(lab.scene.sv.prob(m).stem.includes(String(m.hyp)), 'original hypotenuse condition remains in the question');
  }
  t.diagnostic(`${checked} states; smallest slantlabel-to-card horizontal gap ${minGap.toFixed(2)}px`);
});

await test('initial, moving, completed and reset states retain the original mathematical scene and reveal boundary', async () => {
  const lab = await load(); lab.go('sv4-1'); setView(lab, views[2]);
  const initial = lab.draw(), model = plain(lab.scene.sv.model(lab.s));
  for (const progress of [.1, .49, .5, .75, 1]) {
    lab.s.s41T = progress; const d = lab.draw(); assert.ok(d.paths.length > 0); assert.deepEqual(plain(lab.scene.sv.model(lab.s)), model); assert.equal(lab._answerOpen(), false);
  }
  lab.s.s41T = 0; assert.equal(bodySignature(lab.draw()), bodySignature(initial));
  lab.go('sv4-1'); setView(lab, views[2]); assert.equal(bodySignature(lab.draw()), bodySignature(initial));
  lab.tab = 'problem'; const problem = lab.draw(); assert.ok(!problem.value.card); assert.equal(lab._answerOpen(), false);
  assert.ok(problem.texts.some(x => x.startsWith('모선(빗변)')));
  assert.equal(lab.scene.sv.steps(model).length, 3);
});

if (comparisonRef) await test('only narrow wide-stage exploration framing changes; all other30-scene states stay byte-equivalent', async t => {
  const current = await load(null), old = await load(comparisonRef); let checked = 0;
  for (const scene of current.list) for (const view of views) for (const tab of ['explore', 'problem', 'review']) {
    current.go(scene.id); old.go(scene.id); current.tab = old.tab = tab; setView(current, view); setView(old, view);
    current.resetRandom(); old.resetRandom();
    const a = current.draw(), b = old.draw();
    assert.deepEqual(plain(current.scene.sv.model(current.s)), plain(old.scene.sv.model(old.s)));
    assert.deepEqual(plain(a.value), plain(b.value));
    if (scene.id === 'sv4-1' && view.name === 'landscape' && tab === 'explore') {
      assert.ok(Math.abs(current.board.k - old.board.k) < 1e-9, 'default original triangle keeps its exact pixel size');
      assert.notEqual(bodySignature(a), bodySignature(b));
    } else assert.equal(bodySignature(a), bodySignature(b), `${scene.id}/${view.name}/${tab}: unrelated rendered scene changed`);
    checked++;
  }
  t.diagnostic(`${checked} scene/view/tab comparisons preserve all unrelated drawing commands and models`);
});
