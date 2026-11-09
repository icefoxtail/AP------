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
  const sandbox = { document, console, Math, URLSearchParams, performance, setTimeout, clearTimeout, requestAnimationFrame: () => 0, cancelAnimationFrame() {}, devicePixelRatio: 1, location: { hash: '', search: '', pathname: '/labs/g7-area.html' }, history: { replaceState() {} }, localStorage: { getItem() { return null; }, setItem() {} }, getComputedStyle: () => ({ getPropertyValue: (key) => key === '--font-ui' ? 'sans-serif' : key === '--m-glow' ? '0' : '#ffffff' }), matchMedia: () => ({ matches: false }), addEventListener: (event, fn) => { if (event === 'DOMContentLoaded') ready.push(fn); } };
  sandbox.window = sandbox;
  context = vm.createContext(sandbox);
  for (const filename of ['apl-core.js', 'apl-board.js']) vm.runInContext(fs.readFileSync(path.join(root, 'kit', filename), 'utf8'), context, { filename });
  let definition;
  context.APLab.createLab = (def) => { definition = def; };
  const html = fs.readFileSync(path.join(labs, 'g7-area.html'), 'utf8');
  const script = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map((x) => x[1]).find((x) => x.includes('const MODULES ='));
  vm.runInContext(script, context, { filename: 'g7-area.html' });
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
    const texts = [], labels = [], paths = [], original = board._text, originalPath = board.path;
    board.path = function (points, options = {}) { paths.push({ points: points.map((p) => ({ x: p.x ?? p[0], y: p.y ?? p[1] })), options }); return originalPath.call(this, points, options); };
    board._text = function (x, y, text, ...args) { if (text != null) { texts.push(String(text)); labels.push({ text: String(text), x, y, size: (args[0]?.size || 13) * board.fs * board._ts(), width: board.ctx.measureText(String(text)).width, align: args[0]?.align || 'center' }); } return original.call(this, x, y, text, ...args); };
    try { const value = call(lab.scene.view, lab.s, lab); board.begin(); lab.scene.draw(board, lab.s, value, lab); board.end(); return { texts, labels, paths, value }; }
    finally { board._text = original; board.path = originalPath; }
  };
  lab.api = context.APL_AR;
  return lab;
}

const area = (points) => Math.abs(points.reduce((sum, p, i) => { const q = points[(i + 1) % points.length]; return sum + p.x * q.y - p.y * q.x; }, 0) / 2);
function exactValue(tex) {
  const str = tex.replace(/\\text\{cm\}(?:\^2)?/, '').trim();
  const fraction = /^\\frac\{(-?\d+)\}\{(\d+)\}$/.exec(str);
  return fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(str);
}

await test('numeric formula results stay hidden until the last review step in all area scenes', async () => {
  const lab = await load();
  for (const scene of lab.list) {
    lab.go(scene.id);
    const inquiry = call(scene.view, lab.s, lab), count = call(scene.steps, lab.s).length;
    assert.ok(inquiry.formula, `${scene.id}: inquiry retains its principle`);
    lab.tab = 'review';
    for (let step = 0; step < count; step++) {
      lab.s.step = step;
      assert.equal(call(scene.view, lab.s, lab).formula, null, `${scene.id}: no future calculation at step ${step}`);
    }
    lab.s.step = count;
    assert.equal(call(scene.view, lab.s, lab).formula, inquiry.formula, `${scene.id}: final step reveals the current calculation`);
  }
});

await test('changed problem givens close manually opened answers in every area scene; presentation alone preserves them', async () => {
  const lab = await load();
  for (const scene of lab.list) {
    lab.go(scene.id); lab.tab = 'problem';
    call(scene.view, lab.s, lab);
    lab.s.revealed = true; lab.s.step = call(scene.steps, lab.s).length;
    const numeric = call(scene.controls, lab.s).find((key) => key !== scene.ar.anim?.key);
    const param = lab.params[numeric];
    lab.s[numeric] += lab.s[numeric] < param.max ? param.step : -param.step;
    call(scene.view, lab.s, lab);
    assert.equal(lab.s.revealed, false, scene.id);
    assert.equal(lab.s.step, 1, `${scene.id} completed steps reset`);
    if (scene.ar.anim) {
      call(scene.view, lab.s, lab);
      lab.s.revealed = true; lab.s.step = call(scene.steps, lab.s).length;
      lab.s[scene.ar.anim.key] = 0.57;
      call(scene.view, lab.s, lab);
      assert.equal(lab.s.revealed, true, `${scene.id} animation does not create a new question`);
    }
  }
  lab.go('b2-para'); call(lab.scene.view, lab.s, lab); lab.s.revealed = true; lab.s.step = 3;
  lab.s.b2Mode = 0; call(lab.scene.view, lab.s, lab);
  assert.equal(lab.s.revealed, true, 'changing the visible base preserves the solved question');
  lab.s.b2K = 1; call(lab.scene.view, lab.s, lab);
  assert.equal(lab.s.revealed, false, 'a numeric shape preset creates a new question');
  lab.go('c1-trap'); call(lab.scene.view, lab.s, lab); lab.s.revealed = true; lab.s.step = 3;
  lab.s.c1Mode = 0; call(lab.scene.view, lab.s, lab);
  assert.equal(lab.s.revealed, true, 'changing proof method preserves the question');
  lab.s.c1H += 1; call(lab.scene.view, lab.s, lab);
  assert.equal(lab.s.revealed, false, 'changing a stated height resets even a base-length question');
});

await test('trapezoid wing answers and solution arithmetic preserve exact fractions throughout slider ranges', async () => {
  const lab = await load();
  const scene = lab.go('b4-wing');
  for (let B = 6; B <= 12; B++) for (let d = 2; d <= 8; d++) for (let H = 3; H <= 8; H++) {
    Object.assign(lab.s, { b4B: B, b4D: d, b4H: H });
    const M = scene.ar.model(lab.s), geometry = scene.ar.geo(M), Q = scene.ar.prob(M, lab.s), correct = Q.choices.filter((choice) => choice.ok);
    assert.equal(correct.length, 1);
    const independent = area([geometry.Av, geometry.Bv, geometry.O]);
    assert.ok(Math.abs(exactValue(correct[0].t) - independent) < 1e-9, `${B}, ${d}, ${H}`);
    assert.ok(Math.abs(M.X - M.Y - exactValue(correct[0].t)) < 1e-9);
  }
  Object.assign(lab.s, { b4B: 10, b4D: 6, b4H: 6 });
  assert.match(scene.problem.answer(lab.s), /\\frac\{45\}\{4\}/);
  assert.match(scene.steps(lab.s).at(-1), /30 − 75\/4 = 45\/4/);
  lab.tab = 'problem';
  assert.ok(lab.draw().texts.some((text) => text.includes('75}{4')));
});

await test('rectangle counts actual horizontal rows and keeps its inquiry synchronized with size', async () => {
  const lab = await load();
  lab.go('a1-rect'); Object.assign(lab.s, { a1W: 6, a1H: 4, a1T: 0.5 });
  const result = lab.draw();
  const cells = result.paths.filter((p) => p.options.fill && p.points.length === 4 && Math.abs(area(p.points) - 1) < 1e-9);
  assert.equal(cells.length, 12);
  assert.equal(new Set(cells.map((p) => Math.min(...p.points.map((v) => v.y)))).size, 2, 'two full horizontal rows');
  assert.ok(result.texts.includes('2줄 × 6칸 = 12칸'));
  Object.assign(lab.s, { a1W: 7, a1H: 5 });
  assert.match(call(lab.scene.question, lab.s), /가로 7칸, 세로 5칸/);
});

// Convex clipping of drawn pieces: a separate geometry calculation verifies that
// final packing neither overlaps pieces nor loses area, including slanted roads.
function intersection(subject, clip) {
  const signed = clip.reduce((sum, p, i) => { const q = clip[(i + 1) % clip.length]; return sum + p.x * q.y - p.y * q.x; }, 0), sign = Math.sign(signed);
  let out = subject;
  for (let i = 0; i < clip.length && out.length; i++) {
    const a = clip[i], b = clip[(i + 1) % clip.length], input = out;
    const side = (p) => sign * ((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x));
    out = [];
    for (let j = 0; j < input.length; j++) {
      const p = input[j], q = input[(j + 1) % input.length], sp = side(p), sq = side(q);
      if (sp >= -1e-9) out.push(p);
      if ((sp >= -1e-9) !== (sq >= -1e-9)) { const t = sp / (sp - sq); out.push({ x: p.x + t * (q.x - p.x), y: p.y + t * (q.y - p.y) }); }
    }
  }
  return out;
}

await test('grass reassembly preserves disjoint area and finishes as a rectangle for straight and slanted roads', async () => {
  const lab = await load();
  lab.go('c3-road');
  for (const W of [10, 14, 18]) for (const H of [6, 8, 10]) for (const x of [1, 2, 4]) for (const mode of [0, 1]) for (const progress of [0, 0.2, 0.55, 0.85, 1]) {
    Object.assign(lab.s, { c3W: W, c3H: H, c3X: x, c3Mode: mode, c3T: progress });
    const pieces = lab.draw().paths.filter((p) => ['green', 'amber'].includes(p.options.fill)).map((p) => p.points);
    assert.equal(pieces.length, 4);
    const expected = (W - x) * (H - x);
    assert.ok(Math.abs(pieces.reduce((sum, p) => sum + area(p), 0) - expected) < 1e-8);
    for (let i = 0; i < pieces.length; i++) for (let j = i + 1; j < pieces.length; j++) assert.ok(area(intersection(pieces[i], pieces[j])) < 1e-8, `${W}/${H}/${x}/${mode}/${progress} pieces stay disjoint`);
    if (progress === 1) {
      const all = pieces.flat(), width = Math.max(...all.map((p) => p.x)) - Math.min(...all.map((p) => p.x)), height = Math.max(...all.map((p) => p.y)) - Math.min(...all.map((p) => p.y));
      assert.ok(Math.abs(width * height - expected) < 1e-8, 'packed pieces fill the resulting rectangle');
    }
  }
  Object.assign(lab.s, { c3W: 14, c3H: 8, c3X: 2, c3T: 1 });
  lab.board.resize(390, 410);
  const result = lab.draw(), pieces = result.paths.filter((p) => p.options.fill === 'green').flatMap((p) => p.points), ys = pieces.map((p) => lab.board.toS(p).y);
  assert.ok(Math.max(...ys) - Math.min(...ys) >= 210, 'mobile result uses meaningful stage height');
  assert.ok(result.texts.includes('12 × 6 = 72m²'));
});


await test('completed grass reassembly uses the mobile stage below the HUD and reveals its area in the final step', async () => {
  const lab = await load();
  lab.go('c3-road');
  Object.assign(lab.s, { c3W: 14, c3H: 8, c3X: 2, c3T: 1 });
  lab.board.resize(390, 410);
  // The actual mobile shell reserves its bottom row for status and zoom tools.
  lab.board.setInsets({ top: 0, right: 0, bottom: 70, left: 0 });
  lab.tab = 'review'; lab.s.step = 2;
  const second = lab.draw();
  assert.equal(second.texts.some((text) => text.includes('72m²')), false, 'step 2 shows the completed rectangle, before the area calculation in step 3');
  lab.s.step = 3;
  const result = lab.draw();
  const pieces = result.paths.filter((p) => p.options.fill === 'green').flatMap((p) => p.points);
  const screen = pieces.map((p) => lab.board.toS(p));
  const ys = screen.map((p) => p.y);
  assert.ok(Math.max(...ys) - Math.min(...ys) >= 220, 'the final rectangle stays large with the actual HUD reservation');
  assert.ok(result.texts.includes('12 × 6 = 72m²'));
  assert.equal(result.paths.some((p) => p.options.dash && p.options.color === 'sky'), false, 'the unused original field no longer reserves space after assembly');
  assert.ok(Math.min(...ys) >= 12 && Math.max(...ys) <= 410 - 70 - 78, 'shape and two-line caption leave room for the real mobile tools');
});

await test('landscape-tablet road captions clear the floating bottom tools without exposing step-two area', async () => {
  const lab = await load();
  lab.go('c3-road');
  Object.assign(lab.s, { c3W: 14, c3H: 8, c3X: 2, c3Mode: 1 });
  // 1024×768 Chromium: 683×438 canvas, with the toolbar in its bottom 48px.
  lab.board.resize(683, 438);
  lab.board.setInsets({ top: 0, right: 16, bottom: 0, left: 0 });
  for (const progress of [0.85, 1]) {
    lab.s.c3T = progress;
    const result = lab.draw(), caption = result.labels.find((v) => v.text.includes('(돌려서)') || v.text.includes('72m²'));
    assert.ok(caption, 'the current calculation is present');
    assert.ok(caption.y + caption.size / 2 <= 438 - 52, 'caption stays above the real toolbar with a 4px gap');
  }
  lab.tab = 'review'; lab.s.step = 2;
  const second = lab.draw();
  assert.equal(second.texts.some((text) => text.includes('72m²')), false);
  lab.s.step = 3;
  const third = lab.draw(), answer = third.labels.find((v) => v.text.includes('72m²'));
  assert.ok(answer && answer.y + answer.size / 2 <= 438 - 52);
});

await test('area question review preserves its givens and answers the requested part, not a different inquiry result', async () => {
  const lab = await load();
  const cases = [];
  for (const [B, H] of [[4, 3], [8, 5], [12, 8]]) cases.push(['b3-rail', { b3B: B, b3H: H }, B * H / 2, 'cm²']);
  for (const [m, n, h] of [[1, 6, 2], [3, 2, 8], [6, 1, 4]]) for (const q of [0, 1]) cases.push(['b5-ratio', { b5M: m, b5N: n, b5H: h, b5Q: q }, (q ? n : m) * h / 2, 'cm²']);
  for (const [a, B, H] of [[2, 6, 3], [4, 10, 6], [6, 12, 7]]) for (const q of [0, 1, 2]) cases.push(['c1-trap', { c1A: a, c1B: B, c1H: H, c1Q: q, c1Mode: 1 - (q % 2) }, q === 0 ? a + B : q === 1 ? (a + B) * H / 2 : a * H / 2, q === 0 ? 'cm' : 'cm²']);
  for (const [id, params, answer, unit] of cases) {
    const scene = lab.go(id); Object.assign(lab.s, params);
    lab.tab = 'problem'; const questionDrawing = lab.draw();
    const Q = scene.ar.prob(scene.ar.model(lab.s), lab.s);
    assert.equal(exactValue(Q.choices.find((choice) => choice.ok).t), answer, `${id}: independently calculated answer`);
    lab.tab = 'review'; lab.s.step = 1;
    const reviewDrawing = lab.draw(), steps = call(scene.steps, lab.s);
    assert.deepEqual(reviewDrawing.paths, questionDrawing.paths, `${id}: review keeps the question diagram`);
    assert.deepEqual(reviewDrawing.texts, questionDrawing.texts, `${id}: no unrelated height or inquiry labels`);
    assert.equal(reviewDrawing.value.formula, null);
    assert.ok(steps.at(-1).includes(`= ${lab.api.exactN(answer)}${unit}`), `${id}: final step answers the requested quantity (${answer}${unit}), got ${steps.at(-1)}`);
    if (id === 'b5-ratio') {
      assert.ok(steps.at(-1).includes(params.b5Q ? 'ADC' : 'ABD'));
      assert.ok(questionDrawing.texts.includes(`${params.b5M}k`) && questionDrawing.texts.includes(`${params.b5N}k`), 'a ratio does not pretend to give lengths in cm');
      assert.equal(steps.join(' ').includes(`h=${params.b5H}`), false, 'the problem never supplies a numeric height');
    }
    lab.s.step = steps.length;
    assert.ok(call(scene.view, lab.s, lab).formula.includes(steps.at(-1)), 'final formula explains the current question');
  }
});

await test('inquiry completion does not unlock independent area questions and each flow retains its progress', async () => {
  const lab = await load();
  for (const id of ['b3-rail', 'b5-ratio', 'c1-trap']) {
    const scene = lab.go(id), inquirySteps = call(scene.steps, lab.s);
    lab.tab = 'review'; lab.s.step = inquirySteps.length;
    call(scene.view, lab.s, lab);
    lab.tab = 'problem'; call(scene.view, lab.s, lab);
    assert.equal(lab.s.step, 1, `${id}: new question starts at its first step`);
    assert.equal(lab._answerOpen(), false, `${id}: inquiry completion is not question completion`);
    lab.tab = 'review'; lab.s.step = 2; call(scene.view, lab.s, lab);
    lab.tab = 'explore'; call(scene.view, lab.s, lab);
    assert.deepEqual(call(scene.steps, lab.s), inquirySteps);
    assert.equal(lab.s.step, inquirySteps.length, 'returning to inquiry preserves its progress');
    lab.tab = 'problem'; call(scene.view, lab.s, lab);
    assert.equal(lab.s.step, 2, 'returning to the same question preserves its progress');
    const numeric = call(scene.controls, lab.s).find((key) => key !== scene.ar.anim?.key);
    lab.s[numeric] += lab.params[numeric].step;
    call(scene.view, lab.s, lab);
    assert.equal(lab.s.step, 1, 'new givens reset question progress');
    assert.equal(lab._answerOpen(), false);
  }
});

await test('trapezoid wings keep the mobile question large and all given labels above its toolbar', async () => {
  const lab = await load();
  lab.go('b4-wing'); lab.tab = 'problem';
  lab.board.resize(390, 310);
  lab.board.setInsets({ top: 0, right: 0, bottom: 70, left: 0 });
  const result = lab.draw(), g = lab.scene.ar.geo(lab.scene.ar.model(lab.s));
  const vertices = [g.Av, g.Bv, g.Cv, g.Dv].map((p) => lab.board.toS(p));
  assert.ok(Math.max(...vertices.map((p) => p.x)) - Math.min(...vertices.map((p) => p.x)) >= 190, 'default trapezoid is at least 190px wide in the actual mobile canvas');
  for (const label of result.labels) assert.ok(label.x >= 20 && label.x <= 370 && label.y - label.size / 2 >= 0 && label.y + label.size / 2 <= 240, `${label.text} stays in the usable stage`);
});

await test('unknown altitudes remain symbolic in the diagram until their solving step', async () => {
  const lab = await load();
  for (const id of ['b1-rt', 'b2-para']) for (const size of [1, 2, 3]) {
    lab.go(id);
    if (id === 'b1-rt') Object.assign(lab.s, { b1K: size, b1T: 1 });
    else Object.assign(lab.s, { b2K: size - 1, b2A: 6 + size });
    const model = lab.scene.ar.model(lab.s), unknown = id === 'b1-rt' ? 'h' : 'h₂';
    const numericLabel = `${unknown} = ${lab.api.fmtN(id === 'b1-rt' ? model.h : model.h2)}`;
    lab.tab = 'review';
    for (const step of [0, 1, 2]) {
      lab.s.step = step;
      const draw = lab.draw();
      assert.equal(draw.texts.some(text => text.includes(numericLabel)), false, `${id}: ${numericLabel} is not available at step ${step}`);
      if (id === 'b2-para' && step === 2) {
        assert.ok(draw.texts.includes('h₂ = ?'));
        assert.ok(draw.texts.includes(`넓이 = ${model.c} × h₂ = ${model.A}`), 'second-base equation keeps the unknown symbolic');
      }
    }
    lab.s.step = 3;
    assert.ok(lab.draw().texts.some(text => text.includes(numericLabel)), `${id}: solving step reveals its current height`);
  }
});

await test('returning before the first area step removes final result captions', async () => {
  const lab = await load();
  for (const [id, pattern] of [['a1-rect', /24cm²/], ['b4-wing', /S₁ = S₂ =/], ['c2-frame', /48 − \(8\+6\+15\) = 19/]]) {
    lab.go(id); lab.tab = 'review'; lab.s.step = call(lab.scene.steps, lab.s).length;
    assert.ok(lab.draw().texts.some(text => pattern.test(text)), `${id}: final result is available after solving`);
    lab.s.step = 0;
    const start = lab.draw();
    assert.equal(start.texts.some(text => pattern.test(text)), false, `${id}: previous-to-start relocks the final result`);
    assert.equal(start.value.formula, null);
    if (id === 'b4-wing') assert.equal(start.texts.includes('10'), false, 'the area-only proof does not invent a given base length');
  }
});

function labelBox(label) {
  const x0 = label.x - (label.align === 'left' ? 0 : label.align === 'right' ? label.width : label.width / 2);
  return { x0, x1: x0 + label.width, y0: label.y - label.size / 2, y1: label.y + label.size / 2 };
}
function segmentHitsBox(a, b, box) {
  let lo = 0, hi = 1;
  const dx = b.x - a.x, dy = b.y - a.y;
  for (const [p, q] of [[-dx, a.x - box.x0], [dx, box.x1 - a.x], [-dy, a.y - box.y0], [dy, box.y1 - a.y]]) {
    if (p === 0) { if (q < 0) return false; }
    else { const t = q / p; if (p < 0) lo = Math.max(lo, t); else hi = Math.min(hi, t); if (lo > hi) return false; }
  }
  return true;
}

await test('both parallelogram height labels remain clear of the other altitude and canvas edges', async () => {
  const lab = await load();
  for (const [W,H,bottom] of [[390,310,70],[820,516,70],[683,438,0],[1039,786,0]]) for (let K = 0; K < 3; K++) for (let a = 6; a <= 12; a++) {
    lab.go('b2-para'); Object.assign(lab.s, { b2K:K, b2A:a }); lab.tab='review';
    lab.board.resize(W,H); lab.board.setInsets({top:0,right:0,left:0,bottom});
    lab.draw(); lab.s.step=3;
    const result=lab.draw(), M=lab.scene.ar.model(lab.s), [B,C,D,A]=lab.scene.ar.geo(M).pg;
    assert.ok(result.texts.includes(`h₂ = ${lab.api.fmtN(M.h2)}`), 'the inspected state actually displays both heights');
    const vx=D.x-C.x, vy=D.y-C.y, t=((A.x-C.x)*vx+(A.y-C.y)*vy)/(vx*vx+vy*vy), F={x:C.x+t*vx,y:C.y+t*vy};
    const label=result.labels.find(x=>x.text.startsWith('h₁ =')), box=labelBox(label);
    assert.ok(box.x0>=0 && box.x1<=W && box.y0>=0 && box.y1<=H-bottom, `${K}/${a}/${W}: given height label is visible`);
    assert.equal(segmentHitsBox(lab.board.toS(A),lab.board.toS(F),{x0:box.x0-3,x1:box.x1+3,y0:box.y0-3,y1:box.y1+3}),false, `${K}/${a}/${W}: second altitude does not cross the given height`);
  }
});

await test('ratio vertex names, dimension ticks and current-question caption occupy separate rows', async () => {
  const lab=await load();
  for (const [W,H,bottom] of [[390,310,70],[820,516,70],[683,438,0],[1039,786,0]]) for (const [m,n] of [[1,6],[3,2],[6,1]]) for (const q of [0,1]) {
    lab.go('b5-ratio'); Object.assign(lab.s,{b5M:m,b5N:n,b5H:8,b5Q:q}); lab.tab='problem';
    lab.board.resize(W,H);lab.board.setInsets({top:0,right:0,left:0,bottom});const result=lab.draw();
    const D=labelBox(result.labels.find(x=>x.text==='D')), left=labelBox(result.labels.find(x=>x.text===`${m}k`)), right=labelBox(result.labels.find(x=>x.text===`${n}k`));
    const baseline=lab.board.toS({x:m,y:0}).y, caption=labelBox(result.labels.find(x=>x.text.startsWith('△ABC =')));
    assert.ok(D.y1+5 <= Math.min(left.y0,right.y0), 'D is above the dimension label row with a readable gap');
    assert.ok(Math.max(left.y1,right.y1)+5<=caption.y0, 'the area/ratio caption is below both dimension labels');
    assert.ok(caption.y1<=H-bottom && baseline<D.y0);
    if (W===390 && m===3 && n===2) {
      const leftPoint=lab.board.toS({x:0,y:0}),rightPoint=lab.board.toS({x:m+n,y:0});
      assert.ok(rightPoint.x-leftPoint.x>=55, 'the question uses the space left by absent inquiry calculations');
    }
  }
});

await test('a static trapezoid question uses the stage for its actual shape and keeps captions centered', async () => {
  const lab=await load();
  for (const q of [0,1,2]) {
    lab.go('c1-trap');Object.assign(lab.s,{c1A:4,c1B:10,c1H:6,c1Q:q});lab.tab='problem';
    lab.board.resize(390,310);lab.board.setInsets({top:0,right:0,left:0,bottom:70});const result=lab.draw();
    const vertices=lab.scene.ar.geo(lab.scene.ar.model(lab.s)).trap.map(p=>lab.board.toS(p)), xs=vertices.map(p=>p.x);
    assert.ok(Math.max(...xs)-Math.min(...xs)>=185, `q${q}: the unused rotating copy does not shrink the question`);
    const caption=labelBox(result.labels.find(x=>x.text.startsWith(q===0?'사다리꼴 2개':q===1?'사다리꼴의 넓이':'삼각형 ACD')));
    assert.ok(caption.x0>=0 && caption.x1<=390 && caption.y1<=240, `q${q}: current question caption fits`);
  }
});

await test('ratio current-question captions clear the landscape toolbar', async () => {
  const lab=await load();
  for (const [W,H,bottom] of [[683,438,0],[683,570,0],[667,612,0]]) for (const [m,n] of [[1,6],[3,2],[6,1]]) for (const h of [2,8]) {
    lab.go('b5-ratio'); Object.assign(lab.s,{b5M:m,b5N:n,b5H:h,b5Q:0}); lab.tab='problem';
    lab.board.resize(W,H);lab.board.setInsets({top:0,right:0,left:0,bottom});const result=lab.draw();
    const caption=labelBox(result.labels.find(x=>x.text.startsWith('△ABC =')));
    assert.ok(caption.y1<=H-50, `${m}:${n}/h${h}: given area and ratio stay above the actual toolbar row`);
  }
});

function screenBounds(board, points) {
  const q = points.map((p) => board.toS(p));
  return { x0: Math.min(...q.map(p => p.x)), x1: Math.max(...q.map(p => p.x)), y0: Math.min(...q.map(p => p.y)), y1: Math.max(...q.map(p => p.y)) };
}
function visibleDrawing(lab, result, width, height, bottom) {
  for (const path of result.paths) for (const p of path.points) {
    const q = lab.board.toS(p);
    assert.ok(q.x >= 0 && q.x <= width && q.y >= 0 && q.y <= height - bottom, `clipped path ${JSON.stringify(q)}`);
  }
  for (const label of result.labels) {
    const box = labelBox(label);
    assert.ok(box.x0 >= 0 && box.x1 <= width && box.y0 >= 0 && box.y1 <= height - bottom, `clipped label ${label.text}: ${JSON.stringify(box)}`);
  }
}

await test('c1-trap initial mobile trapezoid keeps its sides clear of the height label throughout rotation', async (t) => {
  const lab = await load();
  for (const [W, H] of [[390, 326], [360, 307]]) for (const bottom of [58, 60]) {
    const scene = lab.go('c1-trap'); lab.board.resize(W, H); lab.board.setInsets({ top: 0, right: 0, bottom, left: 0 });
    const initial = lab.draw(), shape = initial.paths.find(p => p.options.fill === 'sky');
    const box = screenBounds(lab.board, shape.points);
    assert.ok(box.x1 - box.x0 >= 120 && box.y1 - box.y0 >= 70, `${W}/${bottom}: trapezoid ${box.x1-box.x0}×${box.y1-box.y0}px is too small for its givens`);
    t.diagnostic(`c1-trap ${W}×${H}, inset ${bottom}: ${(box.x1-box.x0).toFixed(2)}×${(box.y1-box.y0).toFixed(2)}px`);
    assert.equal(initial.paths.filter(p => p.options.fill === 'green').length, 0, 'initial inquiry shows the original without revealing the rotated copy');
    assert.equal(area(shape.points), 42);
    const checkHeight = (drawing) => {
      const height = drawing.labels.find(x => x.text === `높이 ${lab.s.c1H}cm`);
      const textBox = labelBox({ ...height, width: lab.api.textW(height.text, height.size) });
      const points = scene.ar.geo(scene.ar.model(lab.s)).trap.map(p => lab.board.toS(p));
      for (let i = 0; i < points.length; i++) assert.equal(segmentHitsBox(points[i], points[(i+1)%points.length], { x0: textBox.x0-3, x1: textBox.x1+3, y0: textBox.y0-3, y1: textBox.y1+3 }), false, 'given height must not erase a trapezoid side');
      assert.ok(textBox.x0 >= 0 && textBox.x1 <= W && textBox.y0 >= 0 && textBox.y1 <= H-bottom);
      visibleDrawing(lab, drawing, W, H, bottom);
    };
    checkHeight(initial);
    scene.actions(lab.s).find(a => a.id === 'play').run(lab.s); scene.tick(lab.s, 3, lab);
    assert.equal(lab.s.c1T, .5); checkHeight(lab.draw());
    scene.tick(lab.s, 3, lab); assert.equal(lab.s.c1T, 1); assert.equal(lab.s.playing, false);
    const final = lab.draw(); checkHeight(final);
    const copy = final.paths.find(p => p.options.fill === 'green');
    assert.ok(copy && Math.abs(area(copy.points)-42)<1e-9, 'rotated copy has the same area');
    assert.ok(Math.abs(area(shape.points)+area(copy.points)-(4+10)*6)<1e-9, 'two trapezoids make the stated parallelogram area');
    assert.equal(final.value.readouts.length, 3); assert.ok(final.value.formula.includes('42'));
    scene.actions(lab.s).find(a => a.id === 'reset').run(lab.s);
    assert.deepEqual(lab.draw().paths, initial.paths);
    for (const [a, B, h] of [[2, 12, 2], [6, 6, 8], [2, 6, 8]]) {
      Object.assign(lab.s, { c1A: a, c1B: B, c1H: h, c1T: 0 }); checkHeight(lab.draw());
      assert.equal(scene.ar.model(lab.s).S, (a+B)*h/2);
    }
    lab.go('c1-trap'); lab.board.setInsets({ top: 0, right: 0, bottom, left: 0 });
    assert.deepEqual(lab.draw().paths, initial.paths, 'reentry restores the original inquiry');
    lab.tab='review'; lab.s.step=1; assert.equal(lab.draw().value.formula, null);
    lab.s.step=3; assert.ok(lab.draw().value.formula.includes('42'));
  }
});

await test('c2-frame initial mobile triangle stays distinguishable from its corner markers and drag handles', async (t) => {
  const lab = await load();
  // 58px is the shell reservation contract; 60px reproduces the baseline
  // Chromium screenshots, where the 360px rectangle was only 28.16×21.12px.
  for (const [W, H] of [[390, 326], [360, 307]]) for (const bottom of [58, 60]) {
    const scene = lab.go('c2-frame');
    lab.board.resize(W, H); lab.board.setInsets({ top: 0, right: 0, bottom, left: 0 });
    const initial = lab.draw(), main = initial.paths.find(p => p.options.fill === 'sky' && p.points.length === 3);
    assert.ok(main && main.options.fillAlpha > 0, 'the original triangle has a visible fill before animation');
    const box = screenBounds(lab.board, main.points);
    assert.ok(box.x1 - box.x0 >= 150 && box.y1 - box.y0 >= 120, `${W}/${bottom}: original triangle only ${box.x1 - box.x0}×${box.y1 - box.y0}px`);
    t.diagnostic(`c2-frame ${W}×${H}, inset ${bottom}: triangle bounds ${(box.x1 - box.x0).toFixed(2)}×${(box.y1 - box.y0).toFixed(2)}px`);
    for (const name of ['A', 'B', 'C', '①', '②', '③', '가로 8칸', '6칸']) assert.ok(initial.texts.includes(name), `missing original condition ${name}`);
    const handles = lab.board.handles;
    assert.deepEqual(Array.from(handles, h => h.id), ['A', 'B']);
    assert.ok(Math.hypot(handles[0].x - handles[1].x, handles[0].y - handles[1].y) >= 70, 'drag halos must not cover the original triangle together');
    visibleDrawing(lab, initial, W, H, bottom);
    assert.equal(lab.s.c2T, 0); assert.equal(lab.s.playing, false); assert.equal(lab.s.revealed, false);
    assert.equal(initial.value.readouts.length, 3, 'the existing calculation panel remains available');
    assert.ok(initial.value.formula.includes('19'), 'the correct calculation remains in the inquiry panel');
    assert.ok(Math.abs(area(main.points) - 19) < 1e-9);
    scene.actions(lab.s).find(a => a.id === 'play').run(lab.s); scene.tick(lab.s, 2, lab);
    assert.equal(lab.s.c2T, .5);
    const middle = lab.draw(); visibleDrawing(lab, middle, W, H, bottom);
    scene.tick(lab.s, 2, lab); assert.equal(lab.s.c2T, 1); assert.equal(lab.s.playing, false);
    const final = lab.draw(); visibleDrawing(lab, final, W, H, bottom);
    const pieces = final.paths.filter(p => p.options.fill === 'rose');
    assert.equal(pieces.length, 3);
    assert.ok(Math.abs(pieces.reduce((sum, p) => sum + area(p.points), 0) + area(main.points) - 48) < 1e-9, 'separating corners preserves the original rectangle area');
    scene.actions(lab.s).find(a => a.id === 'reset').run(lab.s);
    assert.deepEqual(lab.draw().paths, initial.paths, 'reset restores the first drawing');
    const dragA = lab.board.handles.find(h => h.id === 'A'), dragB = lab.board.handles.find(h => h.id === 'B');
    dragA.drag({ x: 0, y: 4 }); dragB.drag({ x: 5, y: 6 });
    const dragged = lab.draw(), M = scene.ar.model(lab.s), triangle = dragged.paths.find(p => p.options.fill === 'sky');
    assert.equal(M.a, 4); assert.equal(M.x, 5);
    assert.ok(Math.abs(area(triangle.points) - exactValue(scene.ar.prob(M).choices.find(c => c.ok).t)) < 1e-9, 'dragged geometry and current answer agree');
    visibleDrawing(lab, dragged, W, H, bottom);
    lab.go('c2-frame'); lab.board.setInsets({ top: 0, right: 0, bottom, left: 0 });
    assert.deepEqual(lab.draw().paths, initial.paths, 'reentry with the shell insets restores the original drawing');
  }
});

await test('b5-ratio initial mobile triangles leave separate readable S₁ and S₂ regions', async (t) => {
  const lab = await load();
  for (const [W, H] of [[390, 326], [360, 307]]) for (const bottom of [58, 60]) {
    const scene = lab.go('b5-ratio'); lab.board.resize(W, H); lab.board.setInsets({ top: 0, right: 0, bottom, left: 0 });
    const initial = lab.draw(), pieces = initial.paths.filter(p => ['sky', 'rose'].includes(p.options.fill));
    assert.equal(pieces.length, 2);
    const box = screenBounds(lab.board, pieces.flatMap(p => p.points));
    assert.ok(box.y1 - box.y0 >= 130, `${W}/${bottom}: initial triangle height ${box.y1 - box.y0}px crowds both area labels`);
    t.diagnostic(`b5-ratio ${W}×${H}, inset ${bottom}: triangle bounds ${(box.x1 - box.x0).toFixed(2)}×${(box.y1 - box.y0).toFixed(2)}px`);
    const marks = initial.labels.filter(x => ['S₁', 'S₂'].includes(x.text)).map(x => labelBox({ ...x, width: lab.api.textW(x.text, x.size) }));
    assert.equal(marks.length, 2);
    assert.ok(marks[0].x1 + 4 <= marks[1].x0, 'two coloured area labels keep a readable gap');
    visibleDrawing(lab, initial, W, H, bottom);
    assert.equal(lab.s.b5T, 0); assert.equal(lab.s.playing, false); assert.equal(lab.s.revealed, false);
    assert.equal(initial.value.readouts.length, 4, 'all area calculations remain in the existing panel');
    assert.ok(Math.abs(area(pieces[0].points) - 12) < 1e-9 && Math.abs(area(pieces[1].points) - 8) < 1e-9);
    for (const progress of [.5, 1]) {
      lab.s.b5T = progress; const changed = lab.draw(); visibleDrawing(lab, changed, W, H, bottom);
      const moved = changed.paths.filter(p => ['sky', 'rose'].includes(p.options.fill));
      assert.ok(Math.abs(moved.reduce((sum, p) => sum + area(p.points), 0) - 20) < 1e-9);
    }
    scene.actions(lab.s).find(a => a.id === 'reset').run(lab.s);
    assert.deepEqual(lab.draw().paths, initial.paths, 'reset restores the two original triangles');
    lab.go('b5-ratio'); lab.board.setInsets({ top: 0, right: 0, bottom, left: 0 });
    assert.deepEqual(lab.draw().paths, initial.paths, 'reentry with the shell insets restores the initial ratio diagram');
  }
});

await test('mobile caption allocation preserves problem and review conditions and clears common wide insets', async () => {
  const lab = await load();
  for (const id of ['c2-frame', 'b5-ratio']) for (const [W, H, bottom, right] of [[390, 309, 58, 0], [360, 291, 60, 0], [820, 420, 60, 0], [683, 455, 60, 16], [1039, 623, 60, 16]]) {
    const scene = lab.go(id); lab.board.resize(W, H); lab.board.setInsets({ top: 0, right, bottom, left: 0 });
    lab.tab = 'problem'; const problem = lab.draw(); visibleDrawing(lab, problem, W, H, bottom);
    assert.equal(lab.s.revealed, false);
    const answer = exactValue(scene.ar.prob(scene.ar.model(lab.s)).choices.find(c => c.ok).t);
    assert.equal(answer, id === 'c2-frame' ? 19 : 12);
    lab.tab = 'review'; lab.s.step = 1; const first = lab.draw(); visibleDrawing(lab, first, W, H, bottom);
    assert.equal(first.value.formula, null, 'first review step does not reveal the final calculation');
    lab.s.step = call(scene.steps, lab.s).length;
    const final = lab.draw(); visibleDrawing(lab, final, W, H, bottom);
    assert.ok(final.value.formula.includes(String(answer)), 'final review retains the current calculation in its panel');
  }
});
