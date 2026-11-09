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
  const sandbox = { document, console, Math, URLSearchParams, performance, setTimeout, clearTimeout, requestAnimationFrame: () => 0, cancelAnimationFrame() {}, devicePixelRatio: 1, location: { hash: '', search: '', pathname: '/labs/g7-circle-sector.html' }, history: { replaceState() {} }, localStorage: { getItem() { return null; }, setItem() {} }, getComputedStyle: () => ({ getPropertyValue: (key) => key === '--font-ui' ? 'sans-serif' : key === '--m-glow' ? '0' : '#ffffff' }), matchMedia: () => ({ matches: false }), addEventListener: (event, fn) => { if (event === 'DOMContentLoaded') ready.push(fn); } };
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
    // Real shell keeps the previous tab through enter/focus, then switches to explore.
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
    board._text = function (x, y, text, options, screen) { if (text != null) { texts.push(String(text)); textItems.push({ x, y, text: String(text), options, screen }); } return original.call(this, x, y, text, options, screen); };
    try { const value = call(lab.scene.view, lab.s, lab); board.begin(); lab.scene.draw(board, lab.s, value, lab); board.end(); return { texts, textItems, value }; }
    finally { board._text = original; }
  };
  return lab;
}

function lengthValue(text) {
  let expression = text.replace(/\s*cm$/, '').replaceAll(' ', '').replaceAll('−', '-');
  if (expression.startsWith('≈')) return { value: Number(expression.slice(1)), approximate: true };
  let value = 0;
  for (const term of expression.match(/[+-]?[^+-]+/g) || []) {
    const match = /^([+-]?\d*)(π)?(?:\/(\d+))?$/.exec(term);
    assert.ok(match, `exact rational/π length: ${text}`);
    const numerator = ['', '+'].includes(match[1]) ? 1 : match[1] === '-' ? -1 : Number(match[1]);
    value += numerator * (match[2] ? Math.PI : 1) / Number(match[3] || 1);
  }
  return { value, approximate: false };
}
const movingReadout = (lab) => call(lab.scene.view, lab.s, lab).readouts.find((readout) => /지나간 길이|굴러간 거리/.test(readout.label));

await test('cut-out scenes show every original cut boundary before playback and after reset', async () => {
  const lab = await load();
  const cutScenes = lab.list.filter((scene) => scene.csPfx === 'f1');
  assert.ok(cutScenes.length > 0);
  for (const { id } of cutScenes) {
    const scene = lab.go(id), model = scene.csModel(lab.s);
    const original = lab.board.path, paths = [];
    lab.board.path = function (points, options) { paths.push({ points, options }); return original.call(this, points, options); };
    const samePath = (a, b, dx = 0) => a.length === b.length && a.every((p, i) => Math.abs(p.x - b[i].x - dx) < 1e-8 && Math.abs(p.y - b[i].y) < 1e-8);
    const visibleCuts = (dx = 0) => model.cuts.every((cut) => cut.polys.every((poly) => paths.some(({ points, options }) => samePath(points, poly, dx) && options.close && (options.alpha ?? 1) >= 0.75)));
    try {
      assert.equal(lab.s[scene.csKeys.kt], 0);
      lab.draw();
      assert.ok(visibleCuts(), `${id}: the given cut-out boundaries cannot depend on playback`);
      assert.equal(lab.s.revealed, false, 'showing the given figure does not reveal the answer');
      lab.s[scene.csKeys.kt] = 1; paths.length = 0; lab.draw();
      assert.ok(visibleCuts((model.box[2] - model.box[0]) * 1.3), `${id}: the cut pieces still travel horizontally`);
      call(scene.actions, lab.s).find((action) => action.id === 'reset').run(lab.s, lab);
      paths.length = 0; lab.draw();
      assert.equal(lab.s[scene.csKeys.kt], 0);
      assert.ok(visibleCuts(), `${id}: resetting keeps the original figure visible`);
    } finally { lab.board.path = original; }
  }
});

await test('continuous motion reports the actual angle/distance, including just before completion', async () => {
  const lab = await load();
  for (const radius of [2, 6, 12]) {
    lab.go('z0-center'); lab.s.csR = radius;
    for (const angle of [0, 15, 90, 104.25, 359, 359.5, 360]) {
      lab.s.csQ = angle;
      const readout = movingReadout(lab), result = lengthValue(readout.value);
      assert.equal(result.approximate, !Number.isInteger(angle));
      assert.ok(Math.abs(result.value - radius * angle * Math.PI / 180) <= (result.approximate ? 0.005 : 1e-10));
      const texts = lab.draw().texts;
      if (angle > 0) assert.ok(texts.some((text) => text.includes(readout.value)), 'drawing and readout use the same measurement');
    }
    lab.go('z0-diameter'); lab.s.csR = radius;
    for (const percent of [0, 30, 30.25, 50, 99.75, 100]) {
      lab.s.csD = percent;
      const result = lengthValue(movingReadout(lab).value);
      assert.equal(result.approximate, !Number.isInteger(percent));
      assert.ok(Math.abs(result.value - 2 * radius * Math.PI * percent / 100) <= (result.approximate ? 0.005 : 1e-10));
    }
    lab.s.csD = 99.75;
    call(lab.scene.actions, lab.s).find((action) => action.id === 'play').run(lab.s);
    assert.equal(lab.s.csD, 99.75, 'resuming an unfinished roll does not restart it');
    lab.draw();
    lab.board.handles.find((handle) => handle.id === 'roll').drag({ x: Math.PI, y: 0 });
    assert.equal(lab.s.csD, 50, 'dragging half a turn updates the same progress');
    assert.equal(lab.s.playing, false);
    assert.ok(Math.abs(lengthValue(movingReadout(lab).value).value - radius * Math.PI) < 1e-10);
    call(lab.scene.actions, lab.s).find((action) => action.id === 'reset').run(lab.s);
    assert.equal(lab.s.csD, 0);
    assert.equal(lengthValue(movingReadout(lab).value).value, 0);
  }
});

await test('boundary trace distance agrees with the same point on the full perimeter', async () => {
  const lab = await load();
  for (const [id, degrees, lineCount] of [['z2-semi', 180, 2], ['z2-quarter', 90, 2], ['z2-sector', 120, 2], ['z2-segment', 60, 1]]) {
    for (const radius of [2, 6, 12]) {
      lab.go(id); Object.assign(lab.s, { csR: radius, csA: degrees, csS: degrees });
      const total = radius * degrees * Math.PI / 180 + lineCount * radius;
      for (const percent of [0, 1, 33, 50, 76, 99, 100, 33.3333]) {
        lab.s.csP = percent;
        const result = lengthValue(movingReadout(lab).value);
        assert.equal(result.approximate, !Number.isInteger(percent));
        assert.ok(Math.abs(result.value - total * percent / 100) <= (result.approximate ? 0.005 : 1e-10), `${id} r=${radius}, progress=${percent}`);
      }
    }
  }
  lab.go('z2-segment'); Object.assign(lab.s, { csS: 90, csP: 100 });
  assert.equal(movingReadout(lab).value, '계산 안 함', 'an arbitrary chord does not introduce an out-of-curriculum decimal answer');
});

await test('perimeter and proof problems hide derived answers, and review reveals perimeter one boundary at a time', async () => {
  const lab = await load();
  lab.go('z2-sector'); lab.tab = 'problem'; lab.s.csP = 100;
  let result = lab.draw();
  assert.ok(!result.texts.some((text) => /합계|3π|펼친 둘레/.test(text)));
  assert.ok(!JSON.stringify(result.value).includes('3π'));
  lab.tab = 'review'; lab.s.step = 1;
  result = lab.draw();
  assert.ok(!result.texts.some((text) => /3π|합계/.test(text)), 'a completed exploration cannot leak the final distance while returning to review step 1');
  assert.ok(!JSON.stringify(result.value).includes('3π'));
  lab.s.csP = 0;
  result = lab.draw();
  assert.ok(!result.texts.some((text) => /3π|합계/.test(text)));
  lab.s.step = 2;
  result = lab.draw();
  assert.ok(result.texts.some((text) => text.includes('3π')));
  assert.ok(!result.texts.some((text) => text.includes('합계')));
  lab.s.step = 4;
  result = lab.draw();
  assert.ok(result.texts.some((text) => text.includes('합계 3π + 12 cm')));
  for (const id of ['z3-circleProof', 'z3-sectorProof']) {
    lab.go(id); lab.tab = 'problem'; lab.s.csT = 100;
    result = lab.draw();
    assert.ok(!result.texts.some((text) => /가로 →|세로 →|S =|호 l =/.test(text)), id);
    assert.equal(result.value.readouts.length, 1);
  }
});

await test('all seven rolling scenes send finite coordinates through the actual Board adapter', async () => {
  const lab = await load();
  for (const id of ['rl-rect', 'rl-tri', 'rl-rtri', 'rl-turn60', 'rl-turn45', 'rl-semi', 'rl-square']) {
    const scene = lab.go(id);
    for (const progress of [0, 0.2, 0.5, 1]) { lab.s.rlT = progress; assert.ok(lab.draw().texts.includes('l'), id); }
    lab.tab = 'review';
    for (let step = 1; step <= call(scene.steps, lab.s).length; step++) { lab.s.step = step; assert.ok(lab.draw().texts.includes('l'), `${id} step=${step}`); }
    lab.tab = 'problem'; lab.s.step = 1; lab.s.revealed = false;
    lab.draw();
  }
});

await test('manual answer reveal resets on changed numeric givens and survives pure motion across every current scene', async () => {
  const lab = await load();
  const motion = (key) => ['csQ', 'csD', 'csP', 'csT', 'f3t', 'f5T', 'rlT', 'swT', 'gtT', 'bx01_t'].includes(key) || /^f[14]_.+_t$/.test(key) || /^f02_.+_(u|sw)$/.test(key);
  for (const scene of lab.list) {
    lab.go(scene.id); lab.tab = 'problem';
    call(scene.view, lab.s, lab);
    const controls = call(scene.controls, lab.s), numeric = controls.find((key) => !motion(key));
    assert.ok(numeric, `${scene.id} has numeric givens`);
    lab.s.revealed = true; lab.s.step = call(scene.steps, lab.s).length;
    const param = lab.params[numeric];
    lab.s[numeric] += lab.s[numeric] < param.max ? param.step : -param.step;
    call(scene.view, lab.s, lab);
    assert.equal(lab.s.revealed, false, scene.id);
    assert.equal(lab.s.step, scene.startStep || 1, `${scene.id} resets completed steps`);
    const progress = controls.find(motion);
    if (progress) {
      call(scene.view, lab.s, lab);
      lab.s.revealed = true; lab.s.step = call(scene.steps, lab.s).length;
      const range = lab.params[progress];
      lab.s[progress] = lab.s[progress] === range.max ? range.min : range.max;
      call(scene.view, lab.s, lab);
      assert.equal(lab.s.revealed, true, `${scene.id} preserves reveal when only motion changes`);
    }
  }
});

await test('perimeter focus includes the strip after entering from a hidden-answer problem tab', async () => {
  const lab = await load();
  // Drawing-surface sizes exercise desktop/tablet/mobile proportions; real browser
  // viewport layout remains the separate Playwright gate.
  for (const [width, height] of [[1039, 612], [820, 470], [623, 455], [390, 410]]) {
    lab.board.resize(width, height);
    for (const id of ['z2-semi', 'z2-quarter', 'z2-sector', 'z2-segment']) {
      lab.tab = 'explore'; lab.go(id);
      const fromExplore = JSON.stringify(lab.board.focus);
      lab.tab = 'problem'; lab.go(id);
      assert.equal(JSON.stringify(lab.board.focus), fromExplore, `${id} ${width}×${height}: prior tab cannot remove the strip from the fit`);
      for (const progress of [1, 33, 100]) {
        lab.s.csP = progress;
        const { textItems } = lab.draw();
        assert.ok(textItems.some((item) => item.text.startsWith('합계') || item.text.startsWith('현의 길이')));
        for (const item of textItems) {
          const half = (item.options.size || 13) / 2;
          assert.ok(item.y - half >= 0 && item.y + half <= height, `${id} ${width}×${height} p=${progress}: ${item.text} at y=${item.y}`);
        }
      }
      lab.tab = 'review'; lab.s.step = 1; lab.s.csP = 100;
      const { texts, textItems } = lab.draw();
      assert.ok(!texts.some((text) => text.startsWith('합계')), 'keeping layout does not reveal an answer');
      for (const item of textItems) assert.ok(item.y >= 0 && item.y <= height, `${id} returning to step1 retains a visible strip`);
    }
  }
});

await test('manual rolling slider input pauses automatic motion in all seven rolling scenes', async () => {
  const lab = await load();
  for (const id of ['rl-rect', 'rl-tri', 'rl-rtri', 'rl-turn60', 'rl-turn45', 'rl-semi', 'rl-square']) {
    const scene = lab.go(id);
    assert.equal(lab.s.playing, true, `${id} entry starts its established demonstration`);
    lab.s.rlT = 0.007;
    lab.params.rlT.onInput?.(lab.s, lab);
    scene.tick(lab.s, 1 / 60, lab);
    assert.equal(lab.s.rlT, 0.007, `${id} manual value survives the following animation frame`);
    assert.equal(lab.s.playing, false);
    assert.equal(lab.s.rlHold, 0);
    call(scene.actions, lab.s).find((action) => action.id === 'play').run(lab.s, lab);
    scene.tick(lab.s, 1 / 60, lab);
    assert.ok(lab.s.rlT > 0.007, 'explicit replay still continues motion');
  }
});


await test('review formulas stay staged across all 86 scenes, including a completed exploration animation', async () => {
  const lab = await load();
  assert.equal(lab.list.length, 86);
  const alreadyStaged = new Set(lab.def.groups.filter((group) => ['basic', 'basic-advanced'].includes(group.id)).flatMap((group) => group.scenes.map((scene) => scene.id)).concat('1101'));
  for (const scene of lab.list) {
    lab.go(scene.id); lab.tab = 'review'; lab.s.step = 1; lab.s.revealed = false;
    const value = call(scene.view, lab.s, lab);
    if (!alreadyStaged.has(scene.id)) assert.equal(value.formula || '', '', `${scene.id}: no complete formula before the last step`);
  }
  for (const id of ['f1-star', 'f1-ring', 'f4-sq12', 'f4-circ2']) {
    const scene = lab.go(id);
    lab.s[scene.csKeys.kt] = 1;
    lab.tab = 'review'; lab.s.step = 1;
    const { texts } = lab.draw();
    assert.ok(!texts.includes(id.startsWith('f4-') ? scene.csModel(lab.s).cap.res.l : '색칠한 부분의 넓이'), `${id}: completed explore progress must not reveal the final result in review step 1`);
  }
});

await test('area questions recover their own solution after perimeter exploration and the mixed question explains both quantities', async () => {
  const lab = await load();
  for (const id of ['f1-star', 'f1-ring']) {
    const scene = lab.go(id);
    call(scene.presets, lab.s).find((preset) => preset.label === '둘레').apply(lab.s, lab);
    lab.tab = 'review'; lab.s.step = call(scene.steps, lab.s).length;
    assert.match(call(scene.steps, lab.s).at(-1), /둘레/);
    lab.draw(); lab.tab = 'problem'; lab.draw(); lab.tab = 'review'; lab.draw();
    assert.equal(lab._answerOpen(), false, 'finishing a perimeter proof cannot open an area answer');
    assert.match(call(scene.steps, lab.s).at(-1), /색칠한 부분/);
    assert.match(call(scene.steps, lab.s).at(-1), /cm²/);
    lab.tab = 'explore'; lab.draw();
    assert.match(call(scene.steps, lab.s).at(-1), /둘레/, 'returning to explore preserves the chosen perimeter principle');
  }
  const mixed = lab.go('f1-ss2'); lab.tab = 'problem'; lab.draw(); lab.tab = 'review'; lab.draw();
  const steps = call(mixed.steps, lab.s);
  assert.equal(steps.length, 8, 'four perimeter steps then four area steps');
  assert.match(steps[3], /둘레/); assert.match(steps[7], /색칠한 부분/);
  for (let step = 1; step < steps.length; step++) {
    lab.s.step = step; assert.equal(lab._answerOpen(), false, 'both requested quantities must be completed');
    lab.draw();
  }
});

await test('rolling fallback questions keep the same point and conditions in review, including a stationary point', async () => {
  const lab = await load(), square = lab.go('rl-square');
  lab.s.cfg = { a: 4, track: 0, rolls: 3 }; lab.s.rlS = 4;
  lab.tab = 'review'; lab.s.step = call(square.steps, lab.s).length; lab.draw();
  assert.match(call(square.steps, lab.s).at(-1), /점 A/);
  lab.tab = 'problem'; lab.draw();
  assert.match(call(square.problem.text, lab.s), /점 C/);
  assert.equal(lab._answerOpen(), false, 'a fallback is a different question, not a solved exploration');
  lab.tab = 'review'; lab.draw();
  assert.match(call(square.steps, lab.s).at(-1), /점 C/);
  assert.ok(!call(square.steps, lab.s).at(-1).includes('대각선의 길이'));
  lab.tab = 'explore'; lab.draw();
  assert.match(call(square.steps, lab.s).at(-1), /점 A/);
  const turn = lab.go('rl-turn60');
  lab.s.cfg = { d: 12, at: 'C', deg: 60, track: 0, rolls: 1 };
  lab.s.rlTd = 12; lab.s.rlTc = 60;
  lab.tab = 'problem'; lab.draw();
  assert.match(call(turn.problem.text, lab.s), /점 A가 움직인 거리를 묻는 기본 조건/);
  assert.ok(!call(turn.problem.text, lab.s).includes('대각선이 정수가 아니'), 'the alternate-point fallback is not falsely explained as an irrational diagonal');
  const triangle = lab.go('rl-rtri');
  lab.s.cfg = { a: 3, beta: 60, track: 1, rolls: 1 };
  lab.tab = 'problem'; lab.draw();
  assert.match(call(triangle.problem.text, lab.s), /점 C가 움직인/);
  assert.ok(!call(triangle.problem.text, lab.s).includes('NaN'));
  assert.match(call(triangle.problem.answer, lab.s), /0/);
  lab.tab = 'review'; lab.draw();
  assert.match(call(triangle.steps, lab.s).at(-1), /점 C.*0/);
});


await test('the ring angle label stays clear of its radius handle and dragging still controls the true radius', async () => {
  const lab = await load(), scene = lab.go('f1-ring'); lab.board.resize(390, 410);
  lab.board.setInsets({ top: 0, right: 0, bottom: 64, left: 0 });
  for (const angle of [30, 60, 90, 180, 210, 300, 345]) for (const [R, r] of [[4, 1], [6, 3], [12, 1], [12, 11]]) {
    lab.s[scene.csKeys.K('R')] = R; lab.s[scene.csKeys.K('r')] = r; lab.s[scene.csKeys.K('th')] = angle;
    const handles = [], original = lab.board.handle;
    lab.board.handle = function (id, point, options) { handles.push({ id, point, options }); return original.call(this, id, point, options); };
    let drawing;
    try { drawing = lab.draw(); } finally { lab.board.handle = original; }
    const label = drawing.textItems.find((item) => item.text === `${angle}°`), handle = handles.find((item) => item.id === 'r');
    assert.ok(label && handle);
    const hp = lab.board.toS(handle.point);
    assert.ok(Math.hypot(hp.x - label.x, hp.y - label.y) >= 28, `${angle}°, R${R}, r${r}: angle must remain readable beside the handle`);
    const caption = drawing.textItems.find((item) => item.text.startsWith('전체 ('));
    if (caption) assert.ok(Math.abs(caption.y - label.y) >= 26, 'the angle does not move into the area caption');
    const chosen = (R - 1) / Math.sqrt(2);
    handle.options.drag({ x: chosen, y: chosen });
    assert.equal(lab.s[scene.csKeys.K('r')], R - 1, 'radial drag reads distance from the actual centre');
  }
});

await test('notes preserve the circle equality principle without disclosing the unknown angle before the final step', async () => {
  const lab = await load();
  for (const diameter of [6, 12, 18]) {
    const scene = lab.go('f3-half-sector'); lab.s.f3q = diameter;
    lab.tab = 'problem'; lab.draw(); lab.tab = 'review';
    const finalStep = call(scene.steps, lab.s).length;
    for (let step = 0; step < finalStep; step++) {
      lab.s.step = step; lab.s.revealed = false;
      const { value } = lab.draw();
      assert.doesNotMatch(value.notes, /x\s*=\s*45/, `diameter ${diameter}, step ${step}: the unknown angle is not a prior hint`);
      assert.match(value.notes, /지름/, 'the useful radius-versus-diameter warning remains');
      assert.match(value.rule, /공통 부분/, 'the equality principle remains');
    }
    lab.s.step = finalStep;
    assert.match(lab.draw().value.notes, /x\s*=\s*45/);
    lab.s.step = 1; lab.s.revealed = true;
    assert.match(lab.draw().value.notes, /x\s*=\s*45/, 'an explicit answer reveal remains respected');
  }
});

await test('variable-angle and spiral notes stay consistent with the current givens', async () => {
  const lab = await load();
  lab.go('f5-ring240'); lab.s.f5C = 60; lab.tab = 'review'; lab.s.step = 1;
  assert.doesNotMatch(lab.draw().value.notes, /잘라 낸 각\(120°\)/, 'a 60° cut is not described as a 120° cut');
  lab.go('gt-spiral'); lab.tab = 'review';
  for (const side of [2, 3, 4, 5]) {
    lab.s.gtP = side; lab.s.step = 1;
    const notes = lab.draw().value.notes;
    assert.ok(notes.includes(`${side}, ${2 * side}, ${3 * side}`), `the increasing radii agree with side ${side}`);
    assert.match(notes, /바깥각 60°/, 'the valid exterior-angle principle remains');
  }
});

await test('perimeter chips disclose only the current boundary until its sum step', async () => {
  const lab = await load();
  for (const [id, total] of [['f1-star', '10\\pi'], ['f1-ss2', '6\\pi+6'], ['f1-ring', '\\dfrac{9\\pi}{2}+6']]) {
    const scene = lab.go(id);
    lab.s[scene.csKeys.kt] = 1;
    call(scene.presets, lab.s).find((preset) => preset.label === '둘레').apply(lab.s, lab);
    if (id === 'f1-ss2') { lab.tab = 'problem'; lab.draw(); }
    lab.tab = 'review';
    const lastPerimeterStep = id === 'f1-star' ? 3 : 4;
    for (let step = 1; step < lastPerimeterStep; step++) {
      lab.s.step = step;
      const chips = lab.draw().value.chips || [];
      assert.ok(!chips.map((chip) => chip.tex).join(' ').includes(total), `${id} step ${step}: no perimeter total in the diagram badge`);
    }
    lab.s.step = lastPerimeterStep;
    assert.ok(lab.draw().value.chips.map((chip) => chip.tex).join(' ').includes(total), `${id}: the completed sum is shown`);
    if (id === 'f1-ss2') {
      lab.s.step = 5;
      assert.ok(!lab.draw().value.chips.map((chip) => chip.tex).join(' ').includes('\\dfrac{9\\pi}{2}'), 'the area answer remains hidden in its first step');
      lab.s.step = 8;
      assert.ok(lab.draw().value.chips.map((chip) => chip.tex).join(' ').includes('\\dfrac{9\\pi}{2}'), 'the area sum appears in its own last step');
    }
  }
});

await test('mobile perimeter and thin-ring dimension labels remain separated', async () => {
  const lab = await load(); lab.board.resize(390, 410);
  const star = lab.go('f1-star');
  lab.board.setInsets({ top: 60, right: 0, bottom: 58, left: 0 });
  call(star.presets, lab.s).find((preset) => preset.label === '둘레').apply(lab.s, lab);
  lab.tab = 'review'; lab.s.step = 3;
  const arcLabels = lab.draw().textItems.filter((item) => item.text === '5π/2');
  assert.equal(arcLabels.length, 4);
  const arcBox = (item) => {
    const left = item.x - (item.options.align === 'left' ? 0 : item.options.align === 'right' ? 44 : 22);
    return { left, right: left + 44, top: item.y - 14, bottom: item.y + 14 };
  };
  for (let i = 0; i < arcLabels.length; i++) for (let j = i + 1; j < arcLabels.length; j++) {
    const a = arcBox(arcLabels[i]), b = arcBox(arcLabels[j]);
    assert.ok(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top, 'four fraction labels must not form a pile at the star centre');
  }
  const ring = lab.go('f1-ring');
  lab.board.setInsets({ top: 60, right: 0, bottom: 58, left: 0 });
  for (const angle of [30, 60, 90, 180, 210, 300, 345]) {
    Object.assign(lab.s, { [ring.csKeys.K('R')]: 12, [ring.csKeys.K('r')]: 11, [ring.csKeys.K('th')]: angle });
    for (const tab of ['explore', 'problem', 'review']) {
      lab.tab = tab; lab.s.step = 1;
      const items = lab.draw().textItems;
      const outer = items.find((item) => item.text === 'R=12'), inner = items.find((item) => item.text === 'r=11');
      assert.ok(outer && inner);
      assert.ok(Math.abs(outer.x - inner.x) >= 44 || Math.abs(outer.y - inner.y) >= 21, `${angle}° ${tab}: R and r remain separately readable`);
    }
  }
});

await test('compound-arc captions reserve the toolbar row without covering the figure', async () => {
  const lab = await load(), scenes = lab.list.filter((scene) => scene.f5Kind === 'piece');
  assert.equal(scenes.length, 7);
  for (const [width, height, bottom] of [[1039, 742, 0], [683, 614, 0], [683, 540, 0], [820, 516, 58], [390, 410, 58]]) {
    lab.board.resize(width, height);
    for (const scene of scenes) for (const tab of ['explore', 'review']) {
      lab.go(scene.id); lab.board.setInsets({ top: 0, right: width > 900 ? 16 : 0, bottom, left: 0 });
      lab.tab = tab; lab.draw(); // Settle the current problem identity before advancing its steps.
      const expectedStep = tab === 'review' ? call(scene.steps, lab.s).length : 1;
      lab.s.step = expectedStep;
      const drawing = lab.draw(), captions = drawing.textItems.filter((item) => item.screen);
      assert.equal(lab.s.step, expectedStep, `${scene.id}: inspect the requested step`);
      assert.equal(captions.length, 2, `${scene.id}: retain both useful caption lines`);
      if (tab === 'review') assert.equal(captions[1].text, scene.f5Model(lab.s).sumText, `${scene.id}: inspect the complete perimeter sum`);
      const toolbarTop = height - Math.max(bottom, 58);
      for (const line of captions) assert.ok(line.y + (line.options.size || 15) * 0.3 < toolbarTop, `${scene.id} ${width}×${height} ${tab}: ${line.text} must stay above the toolbar row`);
      const box = scene.f5Def.bbox(lab.s, scene.f5Model(lab.s)), figureBottom = lab.board.toS({ x: (box.x0 + box.x1) / 2, y: box.y1 }).y;
      assert.ok(figureBottom + 16 < captions[0].y, `${scene.id}: the raised captions must not overlap the figure`);
    }
  }
});

await test('unfolded perimeter labels remain above the toolbar and clear of the main figure', async () => {
  const lab = await load();
  for (const [width, height, bottom] of [[1039, 612, 0], [683, 614, 0], [683, 494, 0], [820, 516, 58], [390, 410, 58]]) {
    lab.board.resize(width, height);
    for (const id of ['z2-semi', 'z2-quarter', 'z2-sector', 'z2-segment']) {
      const scene = lab.go(id);
      lab.board.setInsets({ top: 0, right: width > 850 ? 16 : 0, bottom, left: 0 });
      lab.s.csP = 33; lab.draw();
      for (const tab of ['explore', 'review']) {
        lab.tab = tab; lab.s.step = tab === 'review' ? 1 : call(scene.steps, lab.s).length;
        const drawing = lab.draw(), labels = drawing.textItems.filter((item) => item.options.dy === 24);
        assert.ok(labels.length >= 2, `${id}: inspect every strip component label`);
        const toolbarTop = height - Math.max(bottom, 58);
        for (const item of labels) assert.ok(item.y + (item.options.size || 15) / 2 < toolbarTop, `${id} ${width}×${height}: ${item.text} stays above tools`);
        const strip = lab.board.handles.find((handle) => handle.id === 'P');
        const figureBottom = lab.board.toS({ x: 0, y: ['z2-sector', 'z2-segment'].includes(id) ? 1 : 0 }).y;
        assert.ok(strip.y - 60 > figureBottom, `${id}: the strip's distance label stays clear of the figure`);
      }
    }
  }
});

await test('polygon kind remains a legal category throughout problem-snap tween frames', async () => {
  const lab = await load(), scene = lab.go('1809');
  const kinds = ['정삼각형', '정사각형', '정오각형', '정육각형', '정팔각형'];
  const shell = { performance: { now: () => 0 }, requestAnimationFrame: () => 1 };
  shell.window = shell;
  shell.matchMedia = () => ({ matches: false });
  shell.APLab = { clamp: (v, min, max) => Math.max(min, Math.min(max, v)), $$: () => [] };
  vm.createContext(shell);
  vm.runInContext(fs.readFileSync(path.join(root, 'kit/apl-shell.js'), 'utf8'), shell);
  const proto = shell.APLab.Lab.prototype;
  let frameCount = 0;
  Object.assign(lab, {
    ui: { panes: { explore: {}, review: {}, problem: {} } },
    _tabAvailable: () => true, _syncTabAttr() {}, _placeControls() {}, _fitProblemStage() {}, _saveHashSoon() {},
    _loop: proto._loop, tween: proto.tween, _autoSnap: proto._autoSnap,
    render() {
      const raw = lab.s.b1809_i;
      const kind = kinds[Math.round(raw) - 1];
      assert.equal(lab.params.b1809_i.format(raw, lab.s), kind);
      assert.ok(call(scene.problem.text, lab.s).includes(kind), 'the problem names the displayed category');
      assert.ok(call(scene.steps, lab.s)[0].includes(kind), 'the derivation uses the same category');
      lab.draw(); // All real Board coordinates must be finite; no fractional array lookup may throw.
      assert.equal(lab.s.b1809_i, raw, 'normalizing the lookup must not overwrite the tween state');
      frameCount++;
    }
  });
  for (let from = 1; from <= 5; from++) {
    lab.go('1809'); lab.s.b1809_i = from;
    proto.setTab.call(lab, 'problem');
    for (const ms of [0, 45, 90, 180, 270, 360]) proto._frame.call(lab, ms);
    assert.equal(lab._tween, null, 'the actual shell tween completes without leaving a pending frame');
    assert.equal(lab.s.b1809_i, 3, 'the original problem-snap target stays unchanged');
  }
  assert.equal(frameCount, 30);
});

await test('the narrow sector preset keeps its arc label inside the stage with the original arc anchor', async () => {
  const lab = await load(), board = lab.board;
  for (const [width, height, bottom, right] of [[390, 410, 60, 0], [820, 516, 60, 0], [683, 614, 0, 16], [1039, 742, 0, 16]]) {
    board.resize(width, height); board.setInsets({ top: 0, left: 0, right, bottom });
    lab.go('1610');
    const last = call(lab.scene.presets, lab.s).at(-1);
    last.apply(lab.s, lab);
    assert.equal(lab.s.b1610_r, 12); assert.equal(lab.s.b1610_th, 45);
    const leaders = [], original = board.leader;
    board.leader = function (anchor, label, options) { leaders.push({ anchor, label }); return original.call(this, anchor, label, options); };
    let drawing;
    try { drawing = lab.draw(); } finally { board.leader = original; }
    const label = drawing.textItems.find((item) => item.text === '호 3π cm');
    assert.ok(label, 'the given arc length remains visible');
    const metrics = board.annotationSize(label.text, label.options);
    assert.ok(label.x + metrics.width / 2 <= width - right - 8, 'the complete arc label clears the right stage edge');
    if (width === 390) {
      assert.ok(label.options.dy <= -32, 'only the crowded mobile label moves above its arc midpoint');
      const expected = [100 * Math.cos(Math.PI / 8), -100 * Math.sin(Math.PI / 8)];
      assert.ok(leaders.some(({ anchor }) => Math.hypot(anchor[0] - expected[0], anchor[1] - expected[1]) < 1e-8), 'the leader still starts at the actual arc midpoint');
    }
  }
});
