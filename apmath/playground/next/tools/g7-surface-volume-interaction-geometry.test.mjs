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
const baselineRef = process.env.APMATH_SV_INTERACTION_BASE_REF || null;
// Historical equality is an additional local review, not a dependency of shallow CI checkouts.
const comparisonRef = process.env.APMATH_SV_INTERACTION_COMPARE_REF || null;
async function load(ref = baselineRef) {
  let context;
  const ready = [];
  const element = (tag) => tag === 'canvas' ? canvas() : { tagName: tag.toUpperCase(), dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, append() {} };
  const document = { getElementById() { return null; }, querySelector() { return null; }, createElement: element, createTextNode: (text) => ({ textContent: text }), addEventListener() {}, documentElement: element('html'), body: element('body'), head: element('head') };
  document.head.append = (el) => {
    if (el.tagName !== 'SCRIPT') return;
    const file = path.join(labs, el.src);
    const versioned = /g7-surface-volume\/t[24]\.js$/.test(el.src);
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


const views = [
  [1440, 1039, 656, 58], [820, 820, 461, 58], [1024, 683, 490, 58],
  [390, 390, 411, 58], [360, 360, 387, 58]
];
const area = pts => Math.abs(pts.reduce((sum, p, i) => {
  const q = pts[(i + 1) % pts.length]; return sum + p.x * q.y - q.x * p.y;
}, 0)) / 2;
function fillArea(drawing, color) {
  return drawing.fills.filter(f => f.style.startsWith(`${color}:`) && f.alpha > 0)
    .reduce((sum, f) => sum + f.contours.reduce((s, pts) => s + area(pts), 0), 0);
}
function setView(lab, v) {
  lab.setViewportWidth(v[0]); lab.board.resize(v[1], v[2]); lab.board.setInsets({ bottom: v[3] });
}
function bounds(points) {
  return { x0: Math.min(...points.map(p => p.x)), x1: Math.max(...points.map(p => p.x)), y0: Math.min(...points.map(p => p.y)), y1: Math.max(...points.map(p => p.y)) };
}
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
const signature = drawing => JSON.stringify({ paths: drawing.paths, fills: drawing.fills, text: drawing.textItems });

await test('compound solid keeps all three components visible across the 50% transition', async t => {
  const lab = await load(); let checked = 0;
  for (const view of views) for (const family of ['A', 'B', 'C', 'D']) for (const H of [1, 4, 20]) {
    lab.go('sv4-4'); Object.assign(lab.s, { svTri4: family, s44H: H, svMode: 'surf' }); setView(lab, view);
    for (const p of [0, 0.45, 0.49, 0.5, 0.5001, 0.51, 0.55, 0.65, 0.75, 0.9, 0.99, 1]) {
      lab.s.s44T = p; const drawing = lab.draw();
      for (const [color, name] of [['violet', 'cone'], ['green', 'cylinder'], ['sky', 'hemisphere']]) {
        assert.ok(fillArea(drawing, color) > 40, `${view[0]}px ${family} H${H} t=${p}: ${name} must retain a nondegenerate visible surface`);
      }
      const pts = drawing.fills.flatMap(f => f.contours.flat());
      assert.ok(pts.every(p => p.x >= -0.1 && p.x <= view[1] + 0.1 && p.y >= -0.1 && p.y <= view[2] - view[3] + 0.1), `${view[0]}px H${H} t=${p}: core surfaces stay inside the usable stage`);
      assert.equal(lab._answerOpen(), false); checked++;
    }
  }
  t.diagnostic(`${checked} production frames; each of three visible surface groups checked separately`);
});

await test('compound intermediate surfaces unfold by rigid hinges without shrinking or flattening the hemisphere', async t => {
  const lab = await load(), original = lab.api.netDraw;
  let nets = [], checked = 0;
  lab.api.netDraw = (D, net, poses, style) => {
    const out = original(D, net, poses, style);
    nets.push({ net, out }); return out;
  };
  try {
    for (const family of ['A', 'B', 'C', 'D']) for (const H of [1, 4, 20]) {
      lab.go('sv4-4'); Object.assign(lab.s, { svTri4: family, s44H: H, svMode: 'surf' }); setView(lab, views[4]);
      const modelBefore = JSON.stringify(lab.scene.sv.model(lab.s));
      for (const p of [0.5001, 0.51, 0.55, 0.75, 0.99]) {
        nets = []; lab.s.s44T = p; const drawing = lab.draw();
        assert.equal(nets.length, 2, 'cone and cylinder use the production hinge net renderer');
        for (const { net, out } of nets) for (const q of out.filter(q => q.pc.tag === 'lat')) {
          const pts = net.pieces[q.k].pts;
          for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
            assert.ok(Math.abs(dist(pts[i], pts[j]) - dist(q.pts[i], q.pts[j])) < 1e-8, 'all edge and diagonal lengths of each surface piece are invariant'); checked++;
          }
        }
        assert.ok(fillArea(drawing, 'sky') > 40, 'the hemisphere remains a visible curved solid throughout');
        assert.equal(JSON.stringify(lab.scene.sv.model(lab.s)), modelBefore);
      }
    }
  } finally { lab.api.netDraw = original; }
  t.diagnostic(`${checked} independent pairwise distance invariants across transformed surface pieces`);
});

await test('compound playback, final net, reset and reentry retain their distinct states and answer locks', async () => {
  const lab = await load();
  for (const view of [views[0], views[4]]) {
    const scene = lab.go('sv4-4'); setView(lab, view); lab.s.s44T = 0;
    const start = signature(lab.draw());
    const play = scene.actions(lab.s).find(a => a.id === 'play'); play.run(lab.s);
    scene.tick(lab.s, scene.sv.anim.dur / 2, lab); assert.equal(lab.s.s44T, 0.5);
    const middle = lab.draw();
    for (const c of ['violet', 'green', 'sky']) assert.ok(fillArea(middle, c) > 40);
    scene.tick(lab.s, scene.sv.anim.dur / 2, lab); assert.equal(lab.s.s44T, 1); assert.equal(lab.s.playing, false);
    const end = lab.draw(); assert.notEqual(signature(middle), start); assert.notEqual(signature(end), signature(middle));
    for (const label of ['원뿔 옆면', '원기둥 옆면', '반구']) assert.ok(end.texts.some(text => text.trim() === label));
    scene.actions(lab.s).find(a => a.id === 'reset').run(lab.s); assert.equal(lab.s.s44T, 0); assert.equal(signature(lab.draw()), start);
    lab.go('sv1-1'); lab.go('sv4-4'); setView(lab, view); assert.equal(signature(lab.draw()), start);
    lab.tab = 'problem'; lab.draw(); assert.equal(lab._answerOpen(), false); assert.doesNotMatch(scene.problem.text(lab.s), /class="sv-ch (?:ok|bad)"|class="sv-fb/);
    lab.tab = 'review';
    for (let step = 0; step < scene.steps(lab.s).length; step++) { lab.s.step = step; assert.equal(scene.view(lab.s, lab).formula, null); }
    lab.s.step = scene.steps(lab.s).length; assert.ok(scene.view(lab.s, lab).formula);
  }
});

await test('frustum unfolding and upper base stay outside the mobile contents tab at every sampled progress', async t => {
  const lab = await load(), original = lab.api.coneNet; let rendered, checked = 0;
  lab.api.coneNet = (...args) => (rendered = original(...args));
  try {
    for (const [w, h] of [[360, 387], [390, 411]]) for (const family of ['A', 'B', 'C']) for (let k = 2; k <= 5; k++) for (let j = 1; j < k; j++) {
      lab.go('sv2-4'); Object.assign(lab.s, { svTri4: family, s4K: k, s4J: j, svMode: 'surf' }); setView(lab, [w, w, h, 58]);
      for (const p of [0, 0.1, 0.25, 0.49, 0.5, 0.51, 0.75, 0.9, 1]) {
        lab.s.s4T = p; lab.draw(); const pts = rendered.tp.flatMap(q => q.pts).map(q => rendered.D.px(q));
        const b = bounds(pts); assert.ok(b.x1 <= w - 32, `${w}px ${family}/${k}/${j} t=${p}: right contour x=${b.x1} leaves8px before the24px contents tab`);
        assert.ok(b.x0 >= 4 && b.y0 >= 4 && b.y1 <= h - 58 - 4, 'all surface pieces stay inside the stage'); checked++;
      }
      lab.tab = 'review'; lab.s.step = 1; lab.s.s4T = 1; lab.draw();
      assert.ok(Math.max(...rendered.tp.flatMap(q => q.pts).map(q => rendered.D.px(q).x)) <= w - 32, 'current review net also clears the tab');
      lab.s.step = lab.scene.steps(lab.s).length; lab.draw();
      assert.ok(Math.max(...rendered.tp.flatMap(q => q.pts).map(q => rendered.D.px(q).x)) <= w - 32, 'final review net still clears the tab');
    }
  } finally { lab.api.coneNet = original; }
  t.diagnostic(`${checked} production unfolding frames, plus120 review states`);
});

await test('independent area and volume equations remain exact for both repaired scenes', async () => {
  const lab = await load();
  for (const id of ['sv4-4', 'sv2-4']) for (const family of id === 'sv4-4' ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C']) for (const mode of ['surf', 'vol']) {
    const scene = lab.go(id); Object.assign(lab.s, { svTri4: family, svMode: mode, s44H: 7, s4K: 5, s4J: 2 });
    const M = scene.sv.model(lab.s);
    const expected = id === 'sv4-4' ? mode === 'surf' ? Math.PI * (M.r * Math.hypot(M.r, M.hc) + 2 * M.r * M.H + 2 * M.r ** 2) : Math.PI * (M.r ** 2 * M.hc / 3 + M.r ** 2 * M.H + 2 * M.r ** 3 / 3) : mode === 'surf' ? Math.PI * ((M.r1 + M.r2) * Math.hypot(M.r2 - M.r1, M.hf) + M.r1 ** 2 + M.r2 ** 2) : Math.PI * M.hf * (M.r1 ** 2 + M.r1 * M.r2 + M.r2 ** 2) / 3;
    assert.ok(Math.abs(lab.api.vnum(M.ans) - expected) < 1e-8);
    assert.ok(Math.abs(lab.api.vnum(scene.sv.prob(M).choices.find(c => c.ok).val) - expected) < 1e-8);
    const integral = scene.sv.check(lab.s); assert.ok(Math.abs(integral.ans - integral.model) < 2e-6 * Math.abs(expected));
  }
});

if (comparisonRef && !baselineRef) await test('untargeted scenes, compound initial/final/problem/review and normal-width frustum drawings are unchanged', async t => {
  const current = await load(null), old = await load(comparisonRef); let checked = 0;
  for (const scene of current.list) {
    for (const view of [views[0], views[4]]) for (const tab of ['explore', 'problem', 'review']) {
      const id = scene.id;
      if (id === 'sv2-4' && view[0] === 360 && tab !== 'problem') continue;
      for (const lab of [current, old]) { lab.resetRandom(); lab.go(id); setView(lab, view); lab.tab = tab; lab.s.step = tab === 'review' ? lab.scene.steps(lab.s).length : 0; }
      assert.equal(signature(current.draw()), signature(old.draw()), `${id} ${view[0]} ${tab} unchanged`); checked++;
      assert.equal(JSON.stringify(current.scene.sv.model(current.s)), JSON.stringify(old.scene.sv.model(old.s)));
      assert.equal(JSON.stringify(current.scene.steps(current.s)), JSON.stringify(old.scene.steps(old.s)));
    }
  }
  for (const view of views) for (const mode of ['surf', 'vol']) for (const p of [0, 0.25, 0.49, 1]) {
    for (const lab of [current, old]) { lab.resetRandom(); lab.go('sv4-4'); setView(lab, view); lab.s.svMode = mode; lab.s.s44T = p; }
    assert.equal(signature(current.draw()), signature(old.draw()), `compound ${view[0]} ${mode} t=${p} unchanged`); checked++;
  }
  for (const lab of [current, old]) { lab.go('sv4-4'); lab.board.thumb = true; lab.board.resize(240, 150); }
  assert.equal(signature(current.draw()), signature(old.draw()), 'thumbnail unchanged'); checked++;
  t.diagnostic(`${checked} exact production draw-command comparisons; mathematical models and solution text also unchanged`);
});
