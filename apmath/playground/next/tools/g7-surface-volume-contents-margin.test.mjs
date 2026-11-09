// Source-bound native failure: sv4-4 at360px progress .49/.50 touches the contents tab.
// Font widths below are conservative estimates; independent Chromium review is separate.
// Negative control: --baseline <9bf-or-a9>; scope: --compare-scope <pre-repair>.
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
  const document = { getElementById() { return null; }, querySelector() { return null; }, createElement: element, createTextNode: (text) => ({ textContent: text }), addEventListener() {}, documentElement: element('html'), body: element('body'), head: element('head') };
  document.head.append = (el) => {
    if (el.tagName !== 'SCRIPT') return;
    const file = path.join(labs, el.src);
    const versioned = /g7-surface-volume\/t4\.js$/.test(el.src);
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
    const texts = [], textItems = [], paths = [], leaders = [], original = board._text, originalPath = board.path, originalLeader = board.leader;
    board.leader = function (anchor, label, options) { const result = originalLeader.call(this, anchor, label, options); leaders.push({ anchor, label, options, result }); return result; };
    board.path = function (points, options = {}) { paths.push({ points: points.map((p) => ({ x: p.x ?? p[0], y: p.y ?? p[1] })), options }); return originalPath.call(this, points, options); };
    board._text = function (x, y, text, options, screen) { if (text != null) { texts.push(String(text)); textItems.push({ x, y, text: String(text), options, screen }); } return original.call(this, x, y, text, options, screen); };
    try { const value = call(lab.scene.view, lab.s, lab); board.ctx.fills = []; board.ctx.paintedText = []; board.begin(); lab.scene.draw(board, lab.s, value, lab); board.end(); return { texts, textItems, paths, leaders, fills: board.ctx.fills, paintedText: board.ctx.paintedText, value }; }
    finally { board._text = original; board.path = originalPath; board.leader = originalLeader; }
  };
  lab.api = context.APL_SV;
  lab.setViewportWidth = width => { context.innerWidth = width; };
  lab.resetRandom = () => { seed = 14791; };
  return lab;
}

const views = [[360, 387], [390, 411]];
function setView(lab, width, height) {
  lab.setViewportWidth(width); lab.board.resize(width, height); lab.board.setInsets({ bottom: 58 });
}
function slantLabels(drawing) { return drawing.paintedText.filter(t => /^모선 \d+$/.test(t.text)); }
const signature = drawing => JSON.stringify({ paths: drawing.paths, fills: drawing.fills, text: drawing.textItems });
const plain = v => JSON.parse(JSON.stringify(v));
function slantAssociation(lab, drawing, progress) {
  const G = lab.api, m = lab.scene.sv.model(lab.s), scale = 5.4 / (m.r + m.H + m.hc);
  const r = m.r * scale, h = m.H * scale, ch = m.hc * scale, baseY = -2.7 + r + h;
  const D = G.scene3(lab.board, lab.s, { tab: 'explore', t: progress });
  const translation = D.hx(2 * G.ease(G.lin01(progress, 0, .5)) * r * 2.4);
  const base = G.add3(translation, G.v3(r * Math.cos(-28 * Math.PI / 180), baseY, r * Math.sin(-28 * Math.PI / 180)));
  const apex = G.add3(translation, G.v3(0, baseY + ch, 0));
  const expected = D.px(G.mid3(base, apex));
  const leader = drawing.leaders.find(l => Math.hypot(l.anchor.x - expected.x, l.anchor.y - expected.y) < 1e-7);
  assert.ok(leader?.result.drawn, 'the value is visibly connected to the middle of the real slant edge');
  assert.ok(Math.hypot(leader.result.anchor.x - expected.x, leader.result.anchor.y - expected.y) < 1e-7, 'actual leader anchor matches the projected slant midpoint');
  assert.ok(Math.hypot(leader.result.label.x - leader.label.x, leader.result.label.y - leader.label.y) < 1e-7, 'actual leader is not double-projected');
  for (const point of [leader.result.anchor, leader.result.label, leader.result.end]) assert.ok(point.x >= 0 && point.x <= lab.board.W && point.y >= 0 && point.y <= lab.board.H - lab.board.insets.bottom, 'actual slant leader stays on canvas');
  assert.ok(Math.abs(Math.hypot(base.x - apex.x, base.y - apex.y, base.z - apex.z) / scale - m.R) < 1e-8, 'the indicated edge has the stated slant length');
}

await test('actual360px .49/.50 slant-length labels leave at least8px before the contents tab', async t => {
  const lab = await load(); lab.go('sv4-4'); setView(lab, 360, 387);
  for (const progress of [.49, .5]) {
    lab.s.s44T = progress; const drawing = lab.draw(), labels = slantLabels(drawing); assert.equal(labels.length, 1);
    const label = labels[0], gap = 336 - label.right;
    assert.ok(gap >= 8, `t=${progress} label ${label.text} touches the24px contents handle, gap=${gap}px`);
    assert.ok(label.top >= 0 && label.bottom <= 387 - 58);
    slantAssociation(lab, drawing, progress);
    t.diagnostic(`t=${progress}, conservative text-to-handle gap ${gap.toFixed(2)}px`);
  }
});

await test('all four cone presets and both modes keep slant labels clear throughout the slider range', async t => {
  const lab = await load(); let checked = 0, labelsChecked = 0, smallest = Infinity;
  for (const [width, height] of views) for (const preset of ['A', 'B', 'C', 'D']) for (const mode of ['surf', 'vol']) {
    lab.go('sv4-4'); Object.assign(lab.s, { svTri4: preset, svMode: mode, s44H: 4 }); setView(lab, width, height);
    for (let i = 0; i <= 100; i++) {
      lab.s.s44T = i / 100; const drawing = lab.draw();
      for (const label of slantLabels(drawing)) {
        const gap = width - 24 - label.right; smallest = Math.min(smallest, gap);
        assert.ok(gap >= 8, `${width}/${preset}/${mode}/t${i / 100}: insufficient slant-label margin ${gap}`);
        assert.ok(label.left >= 0 && label.top >= 0 && label.bottom <= height - 58, 'slant label remains visible'); labelsChecked++;
      }
      if (slantLabels(drawing).length) slantAssociation(lab, drawing, i / 100);
      assert.equal(lab._answerOpen(), false); checked++;
    }
  }
  t.diagnostic(`${checked} states across every .01 slider value; ${labelsChecked} actual text operations; minimum margin ${smallest.toFixed(2)}px`);
});

await test('cylinder height limits preserve readable dimensions and exact area/volume models', async () => {
  const lab = await load();
  for (const [width, height] of views) for (const preset of ['A', 'B', 'C', 'D']) for (const mode of ['surf', 'vol']) for (const H of [1, 20]) {
    const scene = lab.go('sv4-4'); Object.assign(lab.s, { svTri4: preset, svMode: mode, s44H: H }); setView(lab, width, height);
    const m = scene.sv.model(lab.s), original = plain(m), q = plain(scene.sv.prob(m));
    const answer = mode === 'surf' ? Math.PI * (m.r * Math.hypot(m.r, m.hc) + 2 * m.r * H + 2 * m.r ** 2) : Math.PI * (m.r ** 2 * m.hc / 3 + m.r ** 2 * H + 2 * m.r ** 3 / 3);
    assert.ok(Math.abs(lab.api.vnum(m.ans) - answer) < 1e-7);
    assert.ok(Math.abs(lab.api.vnum(q.choices.find(c => c.ok).val) - answer) < 1e-7);
    for (const progress of [0, .25, .45, .49, .5, .5001, .51, .75, .99, 1]) {
      lab.s.s44T = progress; const drawing = lab.draw();
      for (const label of slantLabels(drawing)) assert.ok(label.right <= width - 32, `${width}/${preset}/${mode}/H${H}/t${progress}: safe slant label margin`);
      assert.equal(lab._answerOpen(), false); assert.deepEqual(plain(scene.sv.model(lab.s)), original);
    }
    assert.deepEqual(plain(scene.sv.prob(scene.sv.model(lab.s))), q);
    scene.actions(lab.s).find(a => a.id === 'reset').run(lab.s); assert.equal(lab.s.s44T, 0); assert.equal(lab.s.playing, false);
  }
});

if (comparisonRef && !baselineRef) await test('all other scenes and compound problem/review/wide/final views stay identical', async t => {
  const current = await load(null), old = await load(comparisonRef); let count = 0;
  for (const sc of current.list) for (const [width, height] of [[1039, 656], [820, 461], [683, 490], ...views]) for (const tab of ['explore', 'problem', 'review']) {
    for (const lab of [current, old]) {
      lab.resetRandom(); lab.go(sc.id); setView(lab, width, height); lab.setViewportWidth(width === 1039 ? 1440 : width === 683 ? 1024 : width);
      lab.tab = tab; lab.s.step = tab === 'review' ? lab.scene.steps(lab.s).length : 0;
    }
    const a = current.draw(), b = old.draw();
    if (sc.id !== 'sv4-4' || width >= 560 || tab !== 'explore') assert.equal(signature(a), signature(b), `${sc.id}/${width}/${tab} unchanged`);
    else {
      assert.deepEqual(plain(a.fills), plain(b.fills), 'all three rendered solid surfaces keep their original size and position');
      assert.deepEqual(plain(a.textItems.filter(t => !/^모선 \d+$/.test(t.text))), plain(b.textItems.filter(t => !/^모선 \d+$/.test(t.text))), 'every other dimension/area label stays unchanged');
    }
    assert.deepEqual(plain(current.scene.sv.model(current.s)), plain(old.scene.sv.model(old.s)));
    assert.deepEqual(plain(current.scene.steps(current.s)), plain(old.scene.steps(old.s))); count++;
  }
  for (const [width, height] of views) for (const progress of [.51, .75, 1]) {
    for (const lab of [current, old]) { lab.go('sv4-4'); setView(lab, width, height); lab.s.s44T = progress; }
    assert.equal(signature(current.draw()), signature(old.draw()), 'unfolding pieces and final net unchanged');
  }
  for (const lab of [current, old]) { lab.go('sv4-4'); lab.board.thumb = true; lab.board.resize(240, 150); }
  assert.equal(signature(current.draw()), signature(old.draw()), 'thumbnail unchanged');
  t.diagnostic(`${count} exact scene/tab/view comparisons, plus both narrow unfolding/final views and thumbnail`);
});
