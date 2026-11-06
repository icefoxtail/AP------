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
