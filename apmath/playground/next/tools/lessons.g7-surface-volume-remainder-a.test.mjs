// Minimum safety checks for the new rolling-cylinder / triangular-solid lessons.
// Real Board drawing commands are exercised; this is not a mobile visual audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'labs/g7-surface-volume');
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const numeric = { moveTo: 2, lineTo: 2, rect: 4, fillRect: 4, clearRect: 4, arc: 5, ellipse: 7, fillText: 0, strokeText: 0, bezierCurveTo: 6, quadraticCurveTo: 4, setTransform: 6 };
function canvas() {
  const ctx = new Proxy({
    measureText: text => ({ width: String(text).length * 8 }),
    createLinearGradient: () => ({ addColorStop() {} }),
    createRadialGradient: () => ({ addColorStop() {} })
  }, { get(target, key) {
    if (key in target) return target[key];
    return (...args) => {
      for (let i = 0; i < (numeric[key] || 0); i++) assert.ok(Number.isFinite(args[i]), `${String(key)} coordinate ${i}: ${args[i]}`);
      if (key === 'fillText' || key === 'strokeText') assert.ok(Number.isFinite(args[1]) && Number.isFinite(args[2]), 'finite text position');
    };
  } });
  return { width: 390, height: 411, getContext: () => ctx };
}
function load() {
  const el = () => ({ dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {} }, append() {}, addEventListener() {}, querySelector() { return null; }, setAttribute() {} });
  const document = { documentElement: el(), head: el(), body: el(), querySelector() { return null; }, getElementById() { return null; }, createElement: el, addEventListener() {} };
  const sandbox = { document, console, Math, URLSearchParams, performance, setTimeout, clearTimeout, requestAnimationFrame: () => 0, cancelAnimationFrame() {}, innerWidth: 390, devicePixelRatio: 1, location: { hash: '', search: '', pathname: '/labs/g7-surface-volume.html' }, history: { replaceState() {} }, localStorage: { getItem() { return null; }, setItem() {} }, getComputedStyle: () => ({ getPropertyValue: key => key === '--font-ui' ? 'sans-serif' : key === '--m-glow' ? '0' : '#ffffff' }), matchMedia: () => ({ matches: false }), addEventListener() {} };
  sandbox.window = sandbox;
  const ctx = vm.createContext(sandbox);
  for (const file of ['apl-core.js', 'apl-board.js']) vm.runInContext(fs.readFileSync(path.join(root, 'kit', file), 'utf8'), ctx, { filename: file });
  for (const name of ['solid3d', 'dims', 'core', 'net', 't1', 't2', 't8', 't9', 'lesson', 'lesson-more']) vm.runInContext(fs.readFileSync(path.join(dir, name + '.js'), 'utf8'), ctx, { filename: name + '.js' });
  const oldSurface = ctx.APL_LESSONS['g7-surface-volume']['sv1-5'];
  vm.runInContext(fs.readFileSync(path.join(dir, 'lesson-remainder-a.js'), 'utf8'), ctx, { filename: 'lesson-remainder-a.js' });
  const lessons = ctx.APL_LESSONS['g7-surface-volume'];
  const scenes = ctx.APL_SV_GROUPS.flatMap(g => g.scenes);
  const params = Object.assign({}, ...ctx.APL_SV_GROUPS.map(g => g.params));
  const board = new ctx.APLab.Board(canvas(), { kind: 'figure', grid: false, interactive: false });
  board.resize(390, 411);
  const lab = { tab: 'review', board, invalidate() {}, _buildReview() {}, _buildProblem() {} };
  ctx.lab = lab;
  const scene = id => scenes.find(s => s.id === id);
  const state = (id, lesson, time = 0) => {
    const s = Object.fromEntries(Object.entries(params).map(([k, p]) => [k, p.value]));
    scene(id).enter(s, lab);
    const cs = video.compileLesson(lesson), at = video.stateAt(cs, time, { nums: s, sets: s, step: 0 });
    Object.assign(s, at.nums, at.sets, { step: at.step, lessonOn: true, lessonEntry: false });
    return s;
  };
  const draw = (id, s, tab = 'review') => {
    lab.scene = scene(id); lab.s = s; lab.tab = tab;
    const expectedStep = s.step, value = lab.scene.view(s, lab);
    s.step = expectedStep; // drawing after the player's state application
    const texts = [], originalText = board._text, originalPath = board.path;
    let paths = 0;
    board._text = function (x, y, text, options, screen) {
      if (text != null && options?.alpha !== 0) texts.push(String(text));
      return originalText.call(this, x, y, text, options, screen);
    };
    board.path = function (...args) { paths++; return originalPath.apply(this, args); };
    try { board.begin(); lab.scene.draw(board, s, value, lab); board.end(); }
    finally { board._text = originalText; board.path = originalPath; }
    return { texts, paths, value };
  };
  return { lessons, oldSurface, scene, state, draw, G: ctx.APL_SV };
}
const unit = load();
const groups = ['sv1-3', 'sv2-6', 'sv2-7', 'sv1-5'];
const newlyAdded = groups.flatMap(id => video.lessonList(unit.lessons[id]).filter(l => id !== 'sv1-5' || l.label === '부피').map(lesson => ({ id, lesson })));
const norm = s => String(s).replace(/\s/g, '');

test('new buttons register beside the existing surface lesson and validate without warnings', () => {
  assert.equal(unit.lessons['sv1-5'][0], unit.oldSurface, 'existing surface lesson is retained');
  for (const id of groups) {
    const v = video.validateLessonSet(unit.lessons[id]);
    assert.deepEqual(v.errors, [], id + ': ' + v.errors.join('; '));
    assert.deepEqual(v.warnings, [], id + ': ' + v.warnings.join('; '));
    assert.ok(unit.scene(id), id + ': actual scene exists');
  }
  assert.deepEqual(Array.from(video.lessonList(unit.lessons['sv1-3']), l => l.label), ['굴린 거리', '겉넓이']);
  for (const id of ['sv2-6', 'sv2-7', 'sv1-5']) assert.deepEqual(Array.from(video.lessonList(unit.lessons[id]), l => l.label), ['겉넓이', '부피']);
});

test('new answers agree with independent geometry and actual scene models', () => {
  const sub = (a, b) => a.map((v, i) => v - b[i]);
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const area = (a, b, c) => Math.hypot(...cross(sub(b, a), sub(c, a))) / 2;
  const A = [0, 0, 0], B = [6, 0, 0], C = [0, 0, 8], apex = [0, 9, 0];
  const base = area(A, C, B), sides = area(A, B, apex) + area(B, C, apex) + area(C, A, apex);
  const pyramid = Math.abs(cross(B, C).reduce((sum, v, i) => sum + v * apex[i], 0)) / 6;
  assert.deepEqual([base, sides, pyramid], [24, 114, 72]);
  const expected = {
    'sv1-3': { per: 2 * Math.PI * 3, tot: 2 * Math.PI * 3 ** 2 + 2 * Math.PI * 3 * 5 },
    'sv2-6': { surface: base + sides, volume: pyramid },
    'sv2-7': { surface: base * 1.25 + sides * .75, volume: pyramid * (1 - .5 ** 3) },
    'sv1-5': { S: 4 * 4 + Math.PI * 2 ** 2 / 2, vol: (4 * 4 + Math.PI * 2 ** 2 / 2) * 5 }
  };
  for (const { id, lesson } of newlyAdded) {
    const s = unit.state(id, lesson), m = unit.scene(id).sv.model(s);
    for (const [key, value] of Object.entries(expected[id])) assert.ok(Math.abs(unit.G.vnum(m[key]) - value) < 1e-9, id + ':' + key);
    const answerKey = id === 'sv1-3' ? lesson.label === '굴린 거리' ? 'per' : 'tot' : id === 'sv1-5' ? 'vol' : lesson.label === '부피' ? 'volume' : 'surface';
    const answerValue = video.normAnswer(lesson.answer).split('+').reduce((sum, term) => sum + (term.endsWith('π') ? Number(term.slice(0, -1)) * Math.PI : Number(term)), 0);
    assert.ok(Math.abs(answerValue - unit.G.vnum(m[answerKey])) < 1e-9, id + ': lesson answer matches verified geometry');
  }
});

test('all new cue states draw finite geometry and hold the final numeric answer until its final cue', t => {
  let frames = 0;
  for (const { id, lesson } of newlyAdded) {
    const cs = video.compileLesson(lesson), answer = video.normAnswer(lesson.answer);
    const first = unit.state(id, lesson, 0), entry = unit.draw(id, { ...first, lessonOn: false, lessonEntry: true });
    assert.ok(entry.paths > 2, `${id}:${lesson.label}: first-frame geometry exists`);
    assert.ok(!entry.texts.map(norm).join('|').includes(answer), `${id}:${lesson.label}: entry hides answer`);
    assert.deepEqual(Array.from(entry.value.readouts), []);
    for (const time of [...new Set([...cs.cues.map(c => c.at), cs.length])]) {
      const s = unit.state(id, lesson, time), rendered = unit.draw(id, s);
      assert.ok(rendered.paths > 2, `${id}:${lesson.label}@${time}: geometry exists`);
      const visible = rendered.texts.map(norm).join('|');
      assert.equal(visible.includes(answer), !!s.svShowV, `${id}:${lesson.label}@${time}: ${answer} disclosure; labels ${visible}`);
      frames++;
    }
    const end = unit.state(id, lesson, cs.length);
    const rewound = video.stateAt(cs, 0, { nums: end, sets: end, step: end.step });
    assert.equal(rewound.sets.svShowV, false, 'replay locks the previous final answer');
    for (const key of ['svBaseReady', 'svSideReady', 'svOtherReady', 'svBigReady', 'svSmallReady']) assert.equal(rewound.sets[key], false, `${id}: ${key} resets`);
  }
  t.diagnostic(`${frames} cue frames; actual 390×844 mobile visual QA remains pending`);
});

test('existing surface values wait for their captions while manual exploration retains numbers', () => {
  for (const [id, animation, hidden] of [
    ['sv1-2', 'sT2', ['4π', '14π']],
    ['sv1-5', 'sT5', ['16+2π', '10π']],
    ['sv2-2', 's2U', ['9π', '21π']],
    ['sv2-3', 's3U', ['9π', '15π']],
    ['sv2-4', 's4T', ['36π', '45π']]
  ]) {
    const lesson = video.lessonList(unit.lessons[id]).find(l => !l.label || l.label === '겉넓이');
    const s = unit.state(id, lesson, 0);
    Object.assign(s, { [animation]: 1, step: 1 });
    const hiddenText = unit.draw(id, s).texts.map(norm).join('|');
    for (const value of hidden) assert.ok(!hiddenText.includes(value), `${id}: early ${value}`);
    const manual = unit.draw(id, { ...s, lessonOn: false, lessonEntry: false }, 'explore');
    const openFlags = unit.draw(id, { ...s, lessonOn: false, lessonEntry: false, svBaseReady: true, svSideReady: true, svOtherReady: true, svBigReady: true, svSmallReady: true }, 'explore');
    assert.deepEqual(manual.texts, openFlags.texts, `${id}: lesson flags do not change manual drawing`);
    const manualText = norm(JSON.stringify([manual.texts, manual.value.readouts]));
    assert.ok(hidden.some(value => manualText.includes(value)), `${id}: manual numerical labels or readouts remain`);
  }
});
