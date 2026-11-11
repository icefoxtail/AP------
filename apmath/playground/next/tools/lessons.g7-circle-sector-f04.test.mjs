// F04 신규 2장면: 실제 장면 결속 · 독립 수학 · 공개 순서 · 되감기 · 일반 경로 회귀.
// 실행: node --test apmath/playground/next/tools/lessons.g7-circle-sector-f04.test.mjs
// Canvas 명령 기록은 코드 회귀 근거입니다. 실제 모바일 렌더/터치/잘림 검수 PASS를 뜻하지 않습니다.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCENE_DIR = path.resolve(HERE, '../labs/g7-circle-sector');
const read = (file) => fs.readFileSync(path.join(SCENE_DIR, file), 'utf8');
const SCENE_SOURCE = read('f04.js');
const json = (x) => JSON.parse(JSON.stringify(x, (_key, value) => typeof value === 'function' ? '[function]' : value));
const norm = (x) => core.normAnswer(typeof x === 'string' ? x : JSON.stringify(x));

function load(source = SCENE_SOURCE, lessons = true) {
  const sandbox = {
    window: {},
    document: { getElementById: () => null, createElement: () => ({}), head: { append() {} }, documentElement: { dataset: {} }, addEventListener() {} }
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'f04.js' });
  if (lessons) {
    vm.runInContext(read('lesson.js'), sandbox, { filename: 'lesson.js' });
    vm.runInContext(read('lesson-f04.js'), sandbox, { filename: 'lesson-f04.js' });
  }
  return sandbox.window;
}
const loaded = load();
const scenes = new Map(loaded.APL_CS_GROUPS.flatMap((g) => g.scenes).map((s) => [s.id, s]));
const ids = ['f4-circ2', 'f4-turn'];
const lessons = Object.fromEntries(ids.map((id) => [id, loaded.APL_LESSONS['g7-circle-sector'][id]]));

function entered(scene) {
  const s = { step: 0, part: null }, lab = { s, params: {}, tab: 'explore', invalidate() {}, _buildReview() {} };
  scene.enter(s, lab);
  return { s, lab };
}
function state(id, time) {
  const lesson = lessons[id], cs = core.compileLesson(lesson), scene = scenes.get(id), { s, lab } = entered(scene);
  const value = core.stateAt(cs, time, { nums: s, sets: s, step: 0, part: null });
  Object.assign(s, value.nums, value.sets, { step: value.step, part: value.part, lessonOn: true, lessonEntry: false });
  lab.tab = lesson.tab || 'explore';
  return { s, lab, cs };
}

// Draw API 명령과 텍스트만 기록합니다. browser/Canvas rendering을 흉내 내어 PASS시키지 않습니다.
function drawing(scene, s, lab) {
  const commands = [], texts = [];
  const record = (method, args) => commands.push([method, json(args)]);
  const b = {
    W: 390, H: 640, insets: { top: 0, left: 0, right: 0, bottom: 60 }, pad: 0.07, thumb: false,
    focus: { x: [-5, 5], y: [-4, 4] },
    get k() { return Math.min((this.W - this.insets.left - this.insets.right) * (1 - 2 * this.pad) / (this.focus.x[1] - this.focus.x[0]), (this.H - this.insets.top - this.insets.bottom) * (1 - 2 * this.pad) / (this.focus.y[1] - this.focus.y[0])); },
    _area() { return { x: 0, y: 0, w: this.W - this.insets.left - this.insets.right, h: this.H - this.insets.top - this.insets.bottom }; },
    toS(p, y) { if (typeof p === 'number') p = { x: p, y }; return { x: this.W / 2 + (p.x - (this.focus.x[0] + this.focus.x[1]) / 2) * this.k, y: (this.H - this.insets.bottom) / 2 - (p.y - (this.focus.y[0] + this.focus.y[1]) / 2) * this.k }; },
    _em: () => 0, color: (name, alpha) => name + ':' + (alpha ?? 1)
  };
  b.ctx = new Proxy({}, { get: (_target, method) => (...args) => record('ctx.' + method, args), set: (target, key, value) => { target[key] = value; record('ctx.set.' + key, [value]); return true; } });
  for (const method of ['arc', 'seg', 'circle', 'poly', 'path', 'point', 'angle', 'ticks', 'right', 'handle', 'text', 'stext']) {
    b[method] = (...args) => {
      record(method, args);
      if (method === 'text') texts.push({ text: String(args[1]), options: args[2] || {} });
      if (method === 'stext') texts.push({ text: String(args[2]), options: args[3] || {} });
      if (method === 'angle' && args[3]?.label) texts.push({ text: String(args[3].label), options: args[3] });
    };
  }
  const view = scene.view(s, lab);
  scene.draw(b, s, view, lab);
  const checkFinite = (x) => {
    if (typeof x === 'number') assert.ok(Number.isFinite(x), scene.id + ': finite draw argument');
    else if (x && typeof x === 'object') Object.values(x).forEach(checkFinite);
  };
  checkFinite(commands);
  return { commands, texts, view: json(view), focus: json(b.focus) };
}
function frame(id, time) { const { s, lab } = state(id, time); return { ...drawing(scenes.get(id), s, lab), s }; }
function manualDigest(scene) {
  const frames = [];
  for (const [tab, step, t] of [['explore', 0, 0], ['explore', 0, .26], ['explore', 0, .62], ['explore', 0, 1], ['review', 0, 0], ['review', 1, 0], ['review', 3, .38], ['review', 20, 1], ['problem', 0, 0]]) {
    const { s, lab } = entered(scene);
    Object.assign(s, { step, [scene.csKeys.kt]: t }); lab.tab = tab;
    frames.push(drawing(scene, s, lab));
  }
  return crypto.createHash('sha256').update(JSON.stringify(frames)).digest('hex');
}

// 수정 전 f04-before-lessons.js의 8장면×9상태입니다. draw명령 회귀이며 실화면 PASS가 아닙니다.
const MANUAL_BASELINE = {
  "f4-sq12": "3de7ec844fe501f2573ced7f03d2866c145ec29527ef976d4635e243ac8bdfef",
  "f4-circ2": "8271c4fa7d8f12f8da204924f309f9e0c2a6da9ed126e96b0bfa211fb304bcb8",
  "f4-turn": "594e75aeb1976314f4a2a0a09fe260a1a9f795ae95ab6eb8a78326715d0a8170",
  "f4-slide": "35aa1895f027c746bd24d963612093965628c9dd5e4cdfa93e2e482d6c402209",
  "f4-slideq": "d099aa203d52071c281e9ac8adbfecddf562088d38d6a8ef01711fe9b5cd168c",
  "f4-swirl": "7b7ea8ffdc8953ceff15fb781f8a7c9f9ab71c45926dbdab103d00fbf588905e",
  "f4-inscr": "f7ceff06fd1fbf754666c07a39fe89f9cf77016fac2817385f807eed37c34c45",
  "f4-ringmv": "3753fcc0d1c0466e41530838de32d15d1d8291638c183fdf4ccb7dcf6fa0fa44"
};

const near = (a, b, why) => assert.ok(Math.abs(a - b) < 1e-8, `${why}: ${a} ~= ${b}`);
const qv = ([n, d]) => n / d;
const exprValue = (v) => qv(v.c) + Math.PI * qv(v.p) + Math.sqrt(3) * qv(v.s);
const shoelace = (pts) => Math.abs(pts.reduce((a, p, i) => { const next = pts[(i + 1) % pts.length]; return a + p.x * next.y - next.x * p.y; }, 0)) / 2;
function expected(id, s) {
  const scene = scenes.get(id), r = s[scene.csKeys.K('r')];
  if (id === 'f4-circ2') {
    // 두 원을 감싼 도형(2개의 반원 + 중심 사이 거리×지름)에서 원 하나를 빼기.
    const centerDistance = r, diameter = 2 * r;
    const hull = Math.PI * r * r + centerDistance * diameter;
    return { answer: hull - Math.PI * r * r, radius: r, diameter, numbers: [r, 2, diameter, centerDistance * diameter] };
  }
  // 실제 부채꼴의 두 반지름은 AB와 AB′. AB는 원래 반원의 지름입니다.
  const degrees = s[scene.csKeys.K('th')], R = r + r;
  const area = (degrees * Math.PI / 180) * R * R / 2;
  return { answer: area, radius: r, diameter: R, degrees, coefficient: area / Math.PI, numbers: [r, R, degrees, 360, 1, 360 / degrees, 2, area / Math.PI] };
}
for (const id of ids) {
  test(id + ': 실제 validator·기본값·상태 범위를 통과한다', () => {
    const lesson = lessons[id], scene = scenes.get(id), { s, lab } = entered(scene);
    assert.deepEqual(core.validateLessonSet(lesson), { errors: [], warnings: [] });
    for (const [key, v] of Object.entries(lesson.chapters[0].start)) {
      assert.equal(v, s[key], key + ' original default'); assert.ok(lab.params[key]);
      assert.ok(v >= lab.params[key].min && v <= lab.params[key].max, key + ' range');
    }
    for (const chapter of lesson.chapters) for (const cue of chapter.cues) for (const [key, value] of Object.entries(cue.to || {})) assert.ok(value >= lab.params[key].min && value <= lab.params[key].max, 'real motion range');
  });
  test(id + ': 독립 기하 계산과 실제 조각·목표도형·문제 정답이 일치한다', () => {
    const { s } = state(id, 0), scene = scenes.get(id), M = scene.csModel(s), result = expected(id, s), choices = scene.csChoices(s);
    near(exprValue(M.resX), result.answer, 'formula value');
    near(exprValue(choices.vals[choices.ok]), result.answer, 'actual question answer');
    const points = M.target[0], area = shoelace(points);
    assert.ok(Math.abs(area - result.answer) < result.answer * .001, 'target polygon area independently measured');
    if (id === 'f4-circ2') {
      const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
      near(Math.max(...xs) - Math.min(...xs), result.radius, 'rectangle width = center distance');
      near(Math.max(...ys) - Math.min(...ys), result.diameter, 'rectangle height = diameter');
      near(M.pieces[0].tf.dx, -result.radius, 'horizontal translation');
      for (let i = 0; i < M.pieces[0].polys[0].length; i++) {
        near(M.pieces[0].polys[0][i].y, M.pieces[0].dst[0][i].y, 'translation preserves each height');
      }
      assert.equal(norm(lessons[id].answer), String(Math.round(result.answer)));
    } else {
      const [sector, rotated, original] = M.shade0;
      near(shoelace(rotated), shoelace(original), 'congruent semicircle polygons');
      near(shoelace(sector), area, 'target is original sector');
      for (const point of sector.slice(1)) near(Math.hypot(point.x, point.y), result.diameter, 'sector radius equals diameter');
      near(M.pieces[0].tf.ang, -result.degrees, 'inverse rotation angle');
      assert.equal(norm(lessons[id].answer), Math.round(result.coefficient) + 'π');
    }
    for (const chapter of lessons[id].chapters) for (const cue of chapter.cues) for (const match of cue.say.matchAll(/\d+(?:\.\d+)?/g)) assert.ok(result.numbers.some((x) => Math.abs(x - Number(match[0])) < 1e-8), 'independent number ' + match[0] + ': ' + cue.say);
  });
  test(id + ': 마지막 자막 전 정답·계산을 공개하지 않고 재진입·다시 보기를 초기화한다', () => {
    const cs = core.compileLesson(lessons[id]), scene = scenes.get(id), K = scene.csKeys.K, last = cs.cues.at(-1).at;
    const samples = new Set([0, cs.length, last - .001, last]);
    for (const cue of cs.cues) { samples.add(cue.at); if (cue.at) samples.add(cue.at - .001); if (cue.dur) { samples.add(cue.at + cue.dur / 2); samples.add(cue.at + cue.dur); } }
    for (const t of samples) {
      const x = frame(id, t), text = norm(x.texts.map((y) => y.text).concat([JSON.stringify(x.view)]));
      assert.equal(text.includes(norm(lessons[id].answer)), t >= last, 'answer appears at ' + t);
      assert.equal(x.view.status.tone === 'ok', t >= last, 'result status');
      assert.equal(x.s[K('show')], t >= last, 'show key');
      if (id === 'f4-circ2' && x.s[K('read')] < 2) assert.doesNotMatch(x.texts.map((y) => y.text).join('|'), /12 cm/);
      if (id === 'f4-turn' && x.s[K('read')] < 1) assert.doesNotMatch(x.texts.map((y) => y.text).join('|'), /6 cm/);
    }
    const begin = state(id, 0), end = state(id, cs.length);
    Object.assign(begin.s, { lessonOn: false, lessonEntry: true }); Object.assign(end.s, { lessonOn: false, lessonEntry: true });
    assert.deepEqual(drawing(scene, begin.s, begin.lab), drawing(scene, end.s, end.lab), 'entry resets displayed calculation states');
    const base = (x) => ({ nums: x.s, sets: x.s, step: x.s.step, part: x.s.part });
    assert.deepEqual(json(core.stateAt(cs, 0, base(begin))), json(core.stateAt(cs, 0, base(end))), 'all replay keys reset');
  });
  test(id + ': 반지름·지름 라벨은 자막과 동시에 정확한 선분을 가리킨다', () => {
    const samples = id === 'f4-circ2'
      ? [[0, '반지름 r = 6 cm'], [4.5, '중심 거리 = 6 cm'], [23, '지름 = 12 cm'], [23, '가로 6 cm']]
      : [[0, '반원 r = 3 cm'], [4.5, '지름 AB = 6 cm'], [23, '부채꼴 반지름 AB = 6 cm'], [28, '원의 1/6']];
    for (const [t, value] of samples) assert.ok(frame(id, t).texts.some((x) => x.text === value), id + ' t=' + t + ': ' + value);
    const x = frame(id, 23), result = expected(id, x.s);
    const diameter = x.commands.filter(([method, args]) => method === 'seg' && Math.abs(Math.hypot(args[1].x - args[0].x, args[1].y - args[0].y) - result.diameter) < 1e-8);
    assert.ok(diameter.length, 'actual marked segment spans a diameter');
  });
  test(id + ': 첫1초 내 도형 강조가 시작하고 수동 화면은 잔여키를 무시한다', () => {
    assert.notDeepEqual(frame(id, .9).commands, frame(id, 0).commands, 'first second has an actual draw change');
    const scene = scenes.get(id), K = scene.csKeys.K;
    for (const tab of ['explore', 'review', 'problem']) {
      const { s, lab } = entered(scene); lab.tab = tab; Object.assign(s, { step: 3, [K('t')]: .62 });
      const before = drawing(scene, s, lab);
      Object.assign(s, { lessonOn: false, lessonEntry: false, [K('read')]: 99, [K('show')]: true });
      assert.deepEqual(drawing(scene, s, lab), before, tab);
    }
  });
}

test('circ2 원본 보기 오류 수정: r=5의 50 중복만 고치고 전허용정수에서 정답은 유일하다', () => {
  const scene = scenes.get('f4-circ2'), { s } = entered(scene);
  for (let r = 3; r <= 10; r++) {
    s.f4_circ2_r = r;
    const choices = scene.csChoices(s), values = choices.vals.map(exprValue), answer = expected('f4-circ2', s).answer;
    assert.equal(values.filter((v) => Math.abs(v - answer) < 1e-8).length, 1, 'one numerical answer for r=' + r);
    near(values[choices.ok], answer, 'correct answer');
    assert.equal(new Set(values.map((v) => v.toFixed(8))).size, 5, 'all five options distinct');
    near(values[0], r === 5 ? r * r : 10 * r, 'only duplicate option changes');
  }
});

test('turn 전허용 정수반지름·15°각에서 부채꼴 공식과 회전 조각이 일치한다', () => {
  const scene = scenes.get('f4-turn'), { s } = entered(scene);
  for (let r = 2; r <= 6; r++) for (let theta = 30; theta <= 150; theta += 15) {
    Object.assign(s, { f4_turn_r: r, f4_turn_th: theta });
    const M = scene.csModel(s), result = expected('f4-turn', s), choices = scene.csChoices(s);
    near(exprValue(M.resX), result.answer, 'sector formula');
    near(exprValue(choices.vals[choices.ok]), result.answer, 'question formula');
    near(shoelace(M.shade0[1]), shoelace(M.shade0[2]), 'rotation preserves semicircle area');
  }
});

test('기존6해설 보존·신규2추가·원본8장면×9수동상태 draw/view/focus 동등', () => {
  const context = { window: {} }; vm.createContext(context); vm.runInContext(read('lesson.js'), context);
  const original = context.window.APL_LESSONS['g7-circle-sector'];
  assert.equal(scenes.size, 8);
  for (const id of ['f4-sq12', 'f4-slide', 'f4-slideq', 'f4-swirl', 'f4-inscr', 'f4-ringmv']) assert.deepEqual(json(loaded.APL_LESSONS['g7-circle-sector'][id]), json(original[id]));
  assert.equal(Object.keys(loaded.APL_LESSONS['g7-circle-sector']).length, Object.keys(original).length + 2);
  assert.equal(Object.keys(MANUAL_BASELINE).length, 8);
  for (const [id, scene] of scenes) assert.equal(manualDigest(scene), MANUAL_BASELINE[id], id + ': manual regression');
});

test('실제 색칠 다각형의 evenodd 넓이도 독립 공식과 일치한다', () => {
  // 원본 csCheck는 draw에 쓰이는 다각형을 360×360 격자로 적분합니다.
  // 비교값은 별도 expected() 기하 계산이며 모델의 expected 필드를 정답 근거로 쓰지 않습니다.
  for (const id of ids) {
    const { s } = state(id, 0), scene = scenes.get(id), measurement = scene.csCheck(s), exact = expected(id, s).answer;
    for (const key of ['before', 'after', 'target']) assert.ok(Math.abs(measurement[key] - exact) <= exact * .004, id + ' ' + key + ': original filled region vs independent formula');
    if (id === 'f4-circ2') assert.ok(measurement.xor < exact * .004, 'translated pieces fill the rectangle without a residual region');
  }
});
