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


function outline(drawing) {
  const points = drawing.paths.filter(p => p.options.color === 'ink').flatMap(p => p.screen);
  assert.ok(points.length >= 16, 'the original solid has its own visible edges');
  const x0 = Math.min(...points.map(p => p.x)), x1 = Math.max(...points.map(p => p.x));
  const y0 = Math.min(...points.map(p => p.y)), y1 = Math.max(...points.map(p => p.y));
  return { x0, x1, y0, y1, width: x1 - x0, height: y1 - y0, points };
}
function setup(lab, id, w, h, bottom = 58) {
  lab.setViewportWidth(w); const scene = lab.go(id);
  lab.board.resize(w, h); lab.board.setInsets({ bottom }); return scene;
}
const mobile = [[390, 326], [360, 307]];

await test('mobile initial frustum keeps its base and side relations large enough to inspect', async t => {
  const lab = await load();
  for (const [w, h] of mobile) for (const bottom of [58, 60]) {
    const sc = setup(lab, 'p1-3', w, h, bottom), d = lab.draw(), box = outline(d);
    t.diagnostic(`${w}/${bottom}: frustum ${box.width.toFixed(2)} by ${box.height.toFixed(2)}`);
    assert.ok(box.width >= 130 && box.height >= 90, `${w}px: original frustum ${box.width} by ${box.height} is too small for its three face labels`);
    const names = ['윗밑면', '아랫밑면', '사다리꼴'];
    const labels = names.map(name => d.textItems.find(item => item.text === name));
    assert.ok(labels.every(Boolean));
    for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
      const a = labels[i], b = labels[j];
      assert.ok(Math.abs(a.y - b.y) >= (a.size + b.size) / 2 + 2, `${a.text}/${b.text}: face labels remain vertically separate`);
    }
    assert.ok(box.points.every(p => p.x >= 4 && p.x <= w - 4 && p.y >= 4 && p.y <= h - bottom - 4));
    assert.match(JSON.stringify(sc.ph.view(sc.ph.model(lab.s))), /6 · 12 · 8/, 'the count conditions remain in the student panel');
    assert.ok(d.texts.includes('잘라 낸 각뿔'));
  }
});

await test('mobile initial cube section keeps the original cube clear of the true-shape inset', async t => {
  const lab = await load();
  for (const [w, h] of mobile) for (const bottom of [58, 60]) {
    setup(lab, 'p4-1', w, h, bottom); const d = lab.draw(), box = outline(d);
    t.diagnostic(`${w}/${bottom}: cube ${box.width.toFixed(2)} by ${box.height.toFixed(2)}`);
    assert.ok(box.width >= 110 && box.height >= 140, `${w}px: original cube ${box.width} by ${box.height} is too small beside its section points`);
    assert.ok(box.x0 >= 100, 'the original cube stays right of the unchanged80px true-shape inset');
    assert.ok(box.points.every(p => p.x >= 4 && p.x <= w - 4 && p.y >= 4 && p.y <= h - bottom - 4));
    assert.equal(d.handles.filter(h => h.id === 'plane').length, 1, 'the cutting-plane drag handle is preserved');
    assert.ok(d.texts.includes('실제 모양')); assert.ok(d.texts.includes('단면: 정육각형 (6개의 변)'));
  }
});

await test('frustum separation, limits, spin, reentry and current-question reveal remain intact', async () => {
  const lab = await load();
  for (const [w, h] of mobile) {
    const sc = setup(lab, 'p1-3', w, h), first = lab.draw(), firstOutline = outline(first);
    const S = JSON.stringify(sc.ph.model(lab.s).S);
    for (const sep of [0, 0.35, 0.7, 1]) {
      lab.s.phSep = sep; const d = lab.draw();
      assert.equal(JSON.stringify(sc.ph.model(lab.s).S), S, 'separation never changes the original frustum');
      if (sep <= 0.7) assert.deepEqual(outline(d), firstOutline, 'original scale remains steady throughout joining/separation');
      assert.equal(d.texts.includes('잘라 낸 각뿔'), sep > 0.01);
    }
    for (let n = 3; n <= 8; n++) for (const cut of [0.2, 0.5, 0.8]) {
      Object.assign(lab.s, { phN8: n, phCut: cut }); lab.draw(); const M = sc.ph.model(lab.s);
      assert.equal(M.c.F, n + 2); assert.equal(M.c.E, 3 * n); assert.equal(M.c.V, 2 * n);
      const z0 = Math.min(...M.S.V.map(p => p.z)), z1 = Math.max(...M.S.V.map(p => p.z));
      assert.ok(Math.abs((z1 - z0) - 2.4 * (1 - cut)) < 1e-8, 'independent truncation height');
    }
    lab.go('p1-3'); lab.board.resize(w, h); lab.board.setInsets({ bottom: 58 });
    assert.deepEqual(outline(lab.draw()), firstOutline, 'reentry restores the initial diagram');
    sc.actions(lab.s).find(a => a.id === 'spin').run(lab.s); const yaw = lab.s.phYaw;
    sc.tick(lab.s, 0.5, lab); assert.equal(lab.s.phYaw, yaw + 13); lab.draw();
    lab.go('p1-3'); lab.tab = 'problem'; const problem = lab.draw();
    assert.equal(lab._answerOpen(), false); assert.doesNotMatch(sc.problem.text(lab.s), /class="ph-ch (?:ok|bad)"/);
    lab.tab = 'review'; lab.s.step = 0; const review = lab.draw();
    assert.deepEqual(review.paths, problem.paths, 'question review starts with the same original solid');
    assert.equal(review.value.formula, null);
  }
});

await test('cube section presets, true plane dragging and question answer stages retain their geometry', async () => {
  const lab = await load();
  for (const [w, h] of mobile) {
    const sc = setup(lab, 'p4-1', w, h), first = lab.draw();
    for (const preset of sc.presets(lab.s)) {
      preset.apply(lab.s); const d = lab.draw(), M = sc.ph.model(lab.s), box = outline(d);
      assert.ok(box.points.every(p => p.x >= 4 && p.x <= w - 4 && p.y >= 4 && p.y <= h - 58 - 4));
      assert.equal(M.name, preset.label);
      for (const p of M.sec.pts) assert.ok(Math.abs(p.x + Math.tan(lab.s.phTa * Math.PI / 180) * p.y + Math.tan(lab.s.phTb * Math.PI / 180) * p.z - lab.s.phTd * (1 + Math.abs(Math.tan(lab.s.phTa * Math.PI / 180)) + Math.abs(Math.tan(lab.s.phTb * Math.PI / 180)))) < 1e-7, 'each section vertex lies on the independently evaluated cutting plane');
    }
    lab.go('p4-1'); lab.board.resize(w, h); lab.board.setInsets({ bottom: 58 });
    const d = lab.draw(), handle = d.handles.find(h => h.id === 'plane');
    handle.options.drag({ x: 1e4, y: handle.point.y }); assert.equal(Math.abs(lab.s.phTd), 1);
    assert.equal(sc.ph.model(lab.s).sec.count, 0, 'dragging to the cube boundary retains the zero-area contact state'); lab.draw();
    lab.s.phTd = 0.4; lab.draw(); assert.ok(sc.ph.model(lab.s).sec.count >= 3);
    lab.go('p4-1'); lab.board.resize(w, h); lab.board.setInsets({ bottom: 58 });
    assert.deepEqual(outline(lab.draw()), outline(first), 'reentry restores the original cube');
    lab.tab = 'problem'; const problem = lab.draw();
    assert.equal(lab._answerOpen(), false);
    assert.ok(problem.texts.includes('정육면체의 세 모서리 위의 점 P, Q, R'));
    assert.ok(!problem.paths.some(p => p.options.fill === 'red'));
    lab.tab = 'review'; lab.s.step = 0; const review = lab.draw();
    assert.deepEqual(review.paths, problem.paths, 'initial review does not reveal the section');
    lab.s.step = 2; assert.ok(lab.draw().paths.some(p => p.options.fill === 'red'), 'the section is revealed at its original solution step');
    lab.s.step = 4; assert.ok(lab.draw().texts.some(s => s.startsWith('단면은 ')), 'the final named section remains available');
  }
});
