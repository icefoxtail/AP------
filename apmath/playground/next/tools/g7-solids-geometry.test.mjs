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
  const sandbox = { document, console, Math, URLSearchParams, performance, setTimeout, clearTimeout, requestAnimationFrame: () => 0, cancelAnimationFrame() {}, devicePixelRatio: 1, location: { hash: '', search: '', pathname: '/labs/g7-solids.html' }, history: { replaceState() {} }, localStorage: { getItem() { return null; }, setItem() {} }, getComputedStyle: () => ({ getPropertyValue: (key) => key === '--font-ui' ? 'sans-serif' : key === '--m-glow' ? '0' : '#ffffff' }), matchMedia: () => ({ matches: false }), addEventListener: (event, fn) => { if (event === 'DOMContentLoaded') ready.push(fn); } };
  let seed = 14791;
  sandbox.Math = Object.create(Math);
  sandbox.Math.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  sandbox.window = sandbox;
  context = vm.createContext(sandbox);
  for (const filename of ['apl-core.js', 'apl-board.js']) vm.runInContext(fs.readFileSync(path.join(root, 'kit', filename), 'utf8'), context, { filename });
  let definition;
  context.APLab.createLab = (def) => { definition = def; };
  const html = fs.readFileSync(path.join(labs, 'g7-solids.html'), 'utf8');
  const script = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map((x) => x[1]).find((x) => x.includes('const MODULES ='));
  vm.runInContext(script, context, { filename: 'g7-solids.html' });
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
  lab.api = context.APL_SO;
  return lab;
}

const questionKey = (scene, state) => scene.so.prob(scene.so.model(state), state).key;
const shownAnswer = (lab) => { lab.s.soPick = null; lab.s.revealed = true; lab.s.step = call(lab.scene.steps, lab.s).length; };

await test('all 22 scenes relock manual answers when the actual question changes, including cloned shell scenes', async () => {
  const lab = await load();
  assert.equal(lab.list.length, 22);
  let controlChanges = 0, presetChanges = 0;
  for (const scene of lab.list) {
    lab.go(scene.id); lab.tab = 'problem'; call(scene.view, lab.s, lab);
    const initialKey = questionKey(scene, lab.s);
    shownAnswer(lab);
    for (let tries = 0; tries < 80 && questionKey(scene, lab.s) === initialKey; tries++) scene.so.reroll(lab.s);
    assert.notEqual(questionKey(scene, lab.s), initialKey, `${scene.id} produces a different question`);
    call(scene.view, lab.s, lab);
    assert.equal(lab.s.revealed, false, `${scene.id} no stale manual reveal after new givens`);
    assert.equal(lab.s.step, 1, `${scene.id} completed solution does not unlock new givens`);
    for (const key of call(scene.controls, lab.s)) {
      const param = lab.params[key];
      shownAnswer(lab);
      const before = questionKey(scene, lab.s);
      lab.s[key] = lab.s[key] === param.max ? param.min : param.max;
      param.onInput?.(lab.s, lab);
      const changed = questionKey(scene, lab.s) !== before;
      call(scene.view, lab.s, lab);
      assert.equal(lab.s.revealed, !changed, `${scene.id}/${key}: question identity determines reset`);
      if (changed) { controlChanges++; assert.equal(lab.s.step, 1); }
    }
    for (const preset of call(scene.presets, lab.s)) {
      shownAnswer(lab);
      const before = questionKey(scene, lab.s);
      preset.apply(lab.s, lab);
      const changed = questionKey(scene, lab.s) !== before;
      call(scene.view, lab.s, lab);
      assert.equal(lab.s.revealed, !changed, `${scene.id}/${preset.label}: presentation alone keeps the answer`);
      if (changed) presetChanges++;
    }
  }
  assert.ok(controlChanges > 0, 'actual visible controls changing a question were tested');
  assert.ok(presetChanges > 0, 'actual shape presets changing a question were tested');
});

await test('perpendicular cuts display the exact geometric radius and distinguish a hollow solid counterexample', async () => {
  const lab = await load(), scene = lab.go('s2-1');
  let conditions = 0;
  // Independently intersect the generating profile segments with the cutting plane.
  for (const kind of ['cone', 'frus']) for (let R = 2; R <= 15; R++) for (let r = 1; r < (kind === 'cone' ? 2 : R); r++) for (let percent = 4; percent <= 96; percent++) {
    Object.assign(lab.s, { soK2: kind, soSR: R, soSr: r, soSH: 7, soU: percent / 100 });
    const model = scene.so.model(lab.s), hits = [];
    const profile = model.sol.poly;
    for (let i = 0; i < profile.length; i++) {
      const a = profile[i], b = profile[(i + 1) % profile.length];
      if ((a[1] <= model.u && b[1] > model.u) || (b[1] <= model.u && a[1] > model.u)) {
        const fraction = (model.u - a[1]) / (b[1] - a[1]);
        hits.push(a[0] + fraction * (b[0] - a[0]));
      }
    }
    const independent = Math.max(...hits);
    assert.ok(Math.abs(model.ru - independent) < 1e-10);
    const value = scene.so.view(model).readouts.find((item) => item.label === '단면의 반지름').value;
    assert.ok(!value.includes('≈'), 'hundredth-height samples have exact terminating decimal radii');
    assert.ok(Math.abs(Number(value.replace(' cm', '')) - independent) < 1e-10, `${kind}, R=${R}, r=${r}, cut=${percent}%: ${value}`);
    conditions++;
  }
  assert.equal(conditions, 11067);
  Object.assign(lab.s, { soK2: 'cone', soSR: 2, soSH: 7, soU: 0.04 });
  assert.ok(lab.draw().texts.includes('반지름 r = 1.92 cm'));
  lab.s.soU = Math.PI / 10;
  assert.ok(lab.draw().texts.some((text) => text.startsWith('반지름 r ≈ ')), 'continuous non-terminating positions use an approximation sign');
  const value = scene.so.view(scene.so.model(lab.s));
  assert.match(value.rule, /원기둥·원뿔·원뿔대·구/);
  assert.match(value.notes, /속이 빈 원기둥/);
  assert.match(value.notes, /구는 그때도 원/);
});

await test('shortest-path equality rejects a slightly longer rim or bent path for every allowed cone', async () => {
  const lab = await load(), scene = lab.go('s4-1');
  for (let r = 1; r <= 7; r++) for (let R = 2 * r; R <= 15; R++) {
    if ((360 * r) % R) continue;
    Object.assign(lab.s, { soTr: r, soTR: R, soMode: 'rim' });
    let model = scene.so.model(lab.s);
    const direct = Math.hypot(model.A2.x - model.A.x, model.A2.y - model.A.y);
    assert.ok(model.rim > direct, `rim is strictly longer: r=${r}, R=${R}`);
    assert.equal(scene.so.view(model).status.tone, 'info', `r=${r}, R=${R} must not call a longer rim shortest`);
    lab.s.soMode = 'via';
    scene.so.presets(lab.s).find((preset) => preset.label === '현의 중점').apply(lab.s);
    model = scene.so.model(lab.s);
    const midpoint = { x: (model.A.x + model.A2.x) / 2, y: (model.A.y + model.A2.y) / 2 };
    assert.ok(Math.hypot(model.M.x - midpoint.x, model.M.y - midpoint.y) < 1e-10, `midpoint must reach O at 180 degrees: r=${r}, R=${R}`);
    assert.ok(Math.abs(model.via - direct) < 1e-10);
    assert.equal(scene.so.view(model).status.tone, 'ok');
    lab.s.soMs += 0.02;
    model = scene.so.model(lab.s);
    assert.ok(model.via > direct);
    assert.equal(scene.so.view(model).status.tone, 'info', 'a nearby bent path is not exactly straight');
  }
});

await test('a 180-degree cone does not mark the equivalent apex route as a wrong answer', async () => {
  const lab = await load(), scene = lab.go('s4-1');
  for (let r = 1; r <= 7; r++) {
    Object.assign(lab.s, { soTr: r, soTR: 2 * r });
    const model = scene.so.model(lab.s), q = scene.so.prob(model, lab.s);
    assert.ok(Math.abs(model.chord - 2 * model.R) < 1e-10);
    assert.equal(q.choices.filter((choice) => choice.ok).length, 1);
    assert.ok(!q.choices.some((choice) => !choice.ok && /꼭짓점을 지나|가장 높은 곳/.test(choice.p)), 'equivalent 2R route cannot be an incorrect distractor');
    assert.match(scene.so.steps(model)[1], /M이 선분 AA′ 위에 있으면 같은 길이/);
  }
});

await test('rotation and folding labels stay synchronized until the real end, and replay does not reset early', async () => {
  const lab = await load();
  for (const id of ['s1-1', 's1-2', 's1-3', 's1-4', 's1-5', 's2-4', 's2-5', 's3-1']) {
    const scene = lab.go(id), key = scene.so.anim.key, angle = id === 's2-5' ? 180 : 360;
    lab.s[key] = 0.995;
    const value = call(scene.view, lab.s, lab);
    assert.equal(value.status.tone, 'info', id);
    if (id === 's2-5') assert.ok(!lab.draw().texts.some((text) => text.includes('꼭 겹쳐져요')), 'drawing cannot claim a finished fold before 180 degrees');
    assert.match(value.status.text, new RegExp(String(0.995 * angle).replace('.', '\\.')), `${id} exact intermediate angle`);
    assert.ok(!lab.params[key].format(lab.s[key]).includes('한 바퀴'));
    lab.s[key] = 0.9995; lab.s.playing = false;
    const play = call(scene.actions).find((action) => action.id === 'play');
    assert.notEqual(call(play.label, lab.s), '다시 재생');
    play.run(lab.s, lab);
    assert.equal(lab.s[key], 0.9995, `${id} resumes remaining motion`);
    scene.tick(lab.s, 0.1, lab);
    assert.equal(lab.s[key], 1);
    assert.equal(call(scene.view, lab.s, lab).status.tone, 'ok');
    play.run(lab.s, lab);
    assert.equal(lab.s[key], 0, `${id} completed replay starts at zero`);
  }
});

await test('dependent length sliders and point presets retain the actual geometric value', async () => {
  const lab = await load();
  for (const [id, small, large] of [['s1-3', 'soRT', 'soRB'], ['s1-6', 'soVr', 'soVR'], ['s2-1', 'soSr', 'soSR'], ['s3-5', 'soF1', 'soF2'], ['s4-4', 'soTf', 'soTg']]) {
    lab.go(id);
    lab.s[large] = lab.params[large].min; lab.s[small] = lab.params[small].max;
    lab.params[small].onInput?.(lab.s, lab);
    assert.equal(lab.s[small], lab.s[large] - 1, `${id} smaller length display is valid after input`);
    lab.s[large] = lab.params[large].max; lab.s[small] = lab.params[small].max;
    lab.params[large].onInput?.(lab.s, lab);
    lab.s[large] = lab.params[large].min;
    lab.params[large].onInput?.(lab.s, lab);
    assert.equal(lab.s[small], lab.s[large] - 1, `${id} lowering the larger length updates the paired slider`);
  }
  const scene = lab.go('s4-3');
  lab.s.soTr = 1; lab.s.soTp = 20;
  lab.params.soTp.onInput?.(lab.s, lab);
  assert.equal(lab.s.soTp, 6);
  scene.so.presets(lab.s).find((preset) => preset.label.includes('180')).apply(lab.s);
  assert.equal(lab.s.soTp, 2);
  assert.equal(scene.so.model(lab.s).p, lab.s.soTp);
  lab.s.soTr = 7; lab.params.soTr.onInput?.(lab.s, lab); lab.s.soTp = 14;
  lab.s.soTr = 2; lab.params.soTr.onInput?.(lab.s, lab);
  assert.equal(lab.s.soTp, 4);
});

await test('area and shortest-distance results appear only at their stated solution step', async () => {
  const lab = await load();
  for (const [id, expression, final] of [['s2-6', /원뿔대의 높이 =/, 4], ['s3-1', /옆넓이 =/, 4], ['s3-4', /조각의 넓이 합 =|넓이 ≈/, 4], ['s4-1', /AA′ =/, 3], ['s4-2', /AA′ =/, 4], ['s4-3', /PP′ =/, 4], ['s4-4', /AA′ =/, 4]]) {
    const scene = lab.go(id); lab.tab = 'review';
    if (scene.so.anim) lab.s[scene.so.anim.key] = 1;
    if (id === 's4-1') { lab.s.soTr = 1; lab.s.soTR = 6; call(scene.view, lab.s, lab); }
    for (let step = 1; step <= final; step++) {
      lab.s.step = step;
      const texts = lab.draw().texts;
      assert.equal(texts.some((text) => expression.test(text)), step === final, `${id} step ${step}`);
    }
    lab.tab = 'problem'; lab.s.revealed = false; lab.s.step = 1;
    assert.ok(!lab.draw().texts.some((text) => expression.test(text)), `${id} problem has no final result label`);
  }
  lab.go('s4-2'); lab.s.soAng = 180; lab.tab = 'review';
  for (const step of [1, 2, 3, 4]) { lab.s.step = step; assert.equal(lab.draw().texts.some((text) => /AA′ =/.test(text)), step === 4); }
  lab.go('s4-3'); lab.s.soAng3 = 180; lab.tab = 'review';
  for (const step of [1, 2, 3]) { lab.s.step = step; assert.equal(lab.draw().texts.some((text) => /PP′ =/.test(text)), step === 3); }
});

await test('mobile axial section has readable size and the actual cut uses pale red', async () => {
  const lab = await load(); lab.go('s2-3'); lab.board.resize(390, 410);
  const result = lab.draw();
  const candidates = result.paths.filter((item) => item.options.fill && item.points.length >= 3).map((item) => {
    const points = item.points.map((point) => lab.board.toS(point));
    const box = { x0: Math.min(...points.map((point) => point.x)), x1: Math.max(...points.map((point) => point.x)), y0: Math.min(...points.map((point) => point.y)), y1: Math.max(...points.map((point) => point.y)) };
    return { item, box, area: (box.x1 - box.x0) * (box.y1 - box.y0) };
  }).filter(({ box }) => (box.y0 + box.y1) / 2 > lab.board.H * 0.65).sort((a, b) => b.area - a.area);
  assert.ok(candidates.length);
  const { item, box } = candidates[0];
  assert.ok(Math.min(box.x1 - box.x0, box.y1 - box.y0) >= 90, 'default 6×6 cross section needs room for its dimension and half-area labels');
  assert.equal(item.options.fill, 'red');
  assert.ok(item.options.fillAlpha <= 0.24, 'cut fill stays pale enough to see the axis and comparison');
});

await test('a point near the cone apex gets a clearly labelled enlarged partial net', async () => {
  const lab = await load(); lab.go('s4-3'); lab.board.resize(390, 410);
  Object.assign(lab.s, { soTr: 7, soTp: 1 });
  const result = lab.draw();
  const triangle = result.paths.find((item) => item.options.fill === 'green' && item.points.length === 3);
  assert.ok(triangle);
  const points = triangle.points.map((point) => lab.board.toS(point));
  assert.ok(Math.max(...points.map((point) => point.x)) - Math.min(...points.map((point) => point.x)) >= 120, 'the key OPP′ triangle must be legible at the smallest OP');
  assert.ok(result.texts.includes('P까지의 전개도 확대'), 'independent magnification is explicit');
  assert.ok(result.texts.includes('PP′ = 1 cm'));
  assert.equal(lab.scene.so.model(lab.s).p, 1, 'magnification does not change the actual point or answer');
});

await test('the rearrangement handle stays below the area result at both radius extremes', async () => {
  const lab = await load(); lab.go('s3-4'); lab.board.resize(390, 410);
  for (const [r, R] of [[1, 2], [2, 6], [14, 15]]) {
    Object.assign(lab.s, { soNr: r, soNR: R, soNq: 1 });
    const handles = [], previous = lab.board.handle;
    lab.board.handle = function (id, point, options) { handles.push({ id, point }); return previous.call(this, id, point, options); };
    let result;
    try { result = lab.draw(); } finally { lab.board.handle = previous; }
    const area = result.textItems.find((item) => /조각의 넓이 합 =|넓이 ≈/.test(item.text));
    assert.ok(area);
    // Board.text applies world-to-screen conversion and dx/dy before _text.
    const areaY = area.y;
    const handleY = lab.board.toS(handles.find((item) => item.id === 'q').point).y;
    assert.ok(handleY - areaY >= 24, `r=${r}, R=${R}: result and handle must not overlap`);
    assert.ok(handleY <= lab.board.H - 12, 'handle remains on the drawing surface');
  }
});

await test('half-section labels use the actual polygon area for cylinders, cones, and frustums', async () => {
  const lab = await load(), scene = lab.go('s2-3');
  const polygonArea = (points) => Math.abs(points.reduce((sum, p, i) => { const q = points[(i + 1) % points.length]; return sum + p[0] * q[1] - p[1] * q[0]; }, 0)) / 2;
  for (const kind of ['cyl', 'cone', 'frus']) for (let R = 2; R <= 15; R++) for (let r = 1; r < (kind === 'frus' ? R : 2); r++) for (let H = 3; H <= 20; H++) {
    Object.assign(lab.s, { soK2: kind, soSR: R, soSr: r, soSH: H });
    const model = scene.so.model(lab.s), half = polygonArea(model.sol.poly);
    assert.ok(Math.abs(model.area / 2 - half) < 1e-10, `${kind} R=${R}, r=${r}, h=${H}`);
  }
  for (const [kind, expected] of [['cyl', 'r × h = 18'], ['cone', '단면의 반쪽 = 9'], ['frus', '단면의 반쪽 = 12']]) {
    Object.assign(lab.s, { soK2: kind, soSR: 3, soSr: 1, soSH: 6 });
    assert.ok(lab.draw().texts.includes(expected), `${kind} uses its own area formula in the coloured half`);
  }
});

await test('inverse construction and symmetry questions explicitly exclude only mathematically false choices', async () => {
  const lab = await load(), inverse = lab.go('s1-6');
  const model = inverse.so.model(lab.s), q = inverse.so.prob(model, lab.s);
  // Reflecting the half-profile across its axis preserves the radial envelope after revolving.
  const originalRadii = model.sol.poly.map(([r, y]) => [Math.abs(r), y]);
  const reflectedRadii = model.sol.poly.map(([r, y]) => [Math.abs(-r), y]);
  assert.deepEqual(reflectedRadii, originalRadii);
  assert.match(q.stem, /한쪽에 놓여/);
  assert.ok(q.choices.some((choice) => !choice.ok && /같은 입체를 만들 수 있지만/.test(choice.hint)), 'mirrored figure is excluded by the explicit one-side condition, not a false revolution claim');
  const symmetry = lab.go('s2-5');
  for (const pk of ['cyl', 'cone', 'frus', 'sphere']) {
    lab.s.soPK = pk;
    const question = symmetry.so.prob(symmetry.so.model(lab.s), lab.s);
    assert.equal(question.choices.filter((choice) => choice.ok).length, 1);
    assert.ok(!question.choices.some((choice) => !choice.ok && choice.p === '대칭축은 회전축에 수직인 직선이다.'), 'a circle or rectangle also has a perpendicular symmetry axis');
    assert.ok(!question.choices.some((choice) => !choice.ok && choice.p === '항상 원이다.'), 'every axial cut of the sphere is a circle');
  }
});



await test('cone-removal sliders expose only attainable dimensions and preserve each selected legal value', async () => {
  const lab = await load();
  const scene = lab.go('s2-6');
  const dimensionKeys = call(scene.controls, lab.s).slice(0, 2);
  for (const key of dimensionKeys) {
    const param = lab.params[key];
    for (const ratio of [1, 2, 3]) for (let value = param.min; value <= param.max; value += param.step) {
      lab.go('s2-6'); lab.s.soC = ratio; lab.params.soC.onInput(lab.s, lab);
      lab.s[key] = value; param.onInput(lab.s, lab);
      assert.equal(lab.s[key], value, `${key} must accept its advertised ${value}`);
      const m = scene.so.model(lab.s);
      assert.ok(Number.isInteger(m.rs) && Number.isInteger(m.hs), 'cut radius and height remain natural numbers');
      assert.equal(key === dimensionKeys[0] ? m.R : m.H, value, 'model and displayed input agree');
      for (const dimensionKey of dimensionKeys) {
        const definition = lab.params[dimensionKey], v = lab.s[dimensionKey];
        assert.ok(v >= definition.min && v <= definition.max);
        assert.equal((v - definition.min) % definition.step, 0);
      }
    }
  }
  for (let R = 2; R <= 14; R += 2) for (let H = 4; H <= 20; H += 2) for (const ratio of [1, 2, 3]) {
    lab.go('s2-6');
    lab.s[dimensionKeys[0]] = R; lab.s[dimensionKeys[1]] = H; lab.s.soC = ratio;
    lab.params.soC.onInput(lab.s, lab);
    const m = scene.so.model(lab.s);
    assert.equal(lab.s.soC, ratio, 'every advertised cutting ratio remains selectable');
    assert.ok(Number.isInteger(m.rs) && Number.isInteger(m.hs));
    assert.equal(m.R, lab.s[dimensionKeys[0]]);
    assert.equal(m.H, lab.s[dimensionKeys[1]]);
  }
  lab.go('s2-1'); lab.s.soSR = 5; lab.params.soSR.onInput?.(lab.s, lab);
  assert.equal(lab.params.soSR.step, 1, 'other sections retain integer radius controls');
  assert.equal(lab.scene.so.model(lab.s).d.R, 5, 'odd radii remain available in other scenes');
});

await test('mobile cone-removal radius label stays separate from the comparison heading', async () => {
  const lab = await load(); lab.go('s2-6');
  lab.board.resize(390, 414); lab.board.setInsets({ top: 0, right: 0, bottom: 64, left: 0 });
  const result = lab.draw();
  const radius = result.textItems.find((item) => item.text === 'R = 4');
  const heading = result.textItems.find((item) => item.text === '두 밑면(원)');
  assert.ok(radius && heading);
  assert.ok(heading.y - radius.y >= 28, 'the main solid radius and two-base comparison heading need their own lines');
});
