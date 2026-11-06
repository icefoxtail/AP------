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
    board._text = function (x, y, text, ...args) { if (text != null) { texts.push(String(text)); labels.push({ text: String(text), x, y, size: (args[0]?.size || 13) * board.fs * board._ts() }); } return original.call(this, x, y, text, ...args); };
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
