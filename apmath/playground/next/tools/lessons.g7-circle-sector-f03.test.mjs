// F03 신규 8장면: 실제 장면 결속 · 독립 수학 · 공개 순서 · 되감기 · 일반 경로 회귀.
// 실행: node --test apmath/playground/next/tools/lessons.g7-circle-sector-f03.test.mjs
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
const SCENE_SOURCE = read('f03.js');
const json = (x) => JSON.parse(JSON.stringify(x, (_key, value) => typeof value === 'function' ? '[function]' : value));
const norm = (x) => core.normAnswer(typeof x === 'string' ? x : JSON.stringify(x));

function load(source = SCENE_SOURCE, lessons = true) {
  const sandbox = {
    window: {},
    document: { getElementById: () => null, createElement: () => ({}), head: { append() {} }, documentElement: { dataset: {} }, addEventListener() {} }
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'f03.js' });
  if (lessons) {
    vm.runInContext(read('lesson.js'), sandbox, { filename: 'lesson.js' });
    vm.runInContext(read('lesson-f03.js'), sandbox, { filename: 'lesson-f03.js' });
  }
  return sandbox.window;
}
const loaded = load();
const scenes = new Map(loaded.APL_CS_GROUPS.flatMap((g) => g.scenes).map((s) => [s.id, s]));
const ids = ['f3-rect-sector', 'f3-two-arcs', 'f3-crescent', 'f3-four-leaf', 'f3-two-circles', 'f3-half-sector', 'f3-leaf-area', 'f3-two-rects'];
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
    toS(p) { return { x: this.W / 2 + (p.x - (this.focus.x[0] + this.focus.x[1]) / 2) * this.k, y: (this.H - this.insets.bottom) / 2 + (p.y - (this.focus.y[0] + this.focus.y[1]) / 2) * this.k }; },
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
    Object.assign(s, { step, f3t: t }); lab.tab = tab;
    frames.push(drawing(scene, s, lab));
  }
  return crypto.createHash('sha256').update(JSON.stringify(frames)).digest('hex');
}

// f03-before-lessons.js: 실제 수정 직전 원본과 각 장면의 9상태를 비교한 hash입니다.
// 픽셀 캡처가 아니라 draw명령/view/focus의 원본 회귀 근거입니다.
const MANUAL_BASELINE = {
  "f3-leaf-len": "ec1f92283a99ccafc50da69466c47414cd5a38a1509a8ab47b5cd9dcae11dbf1",
  "f3-rect-sector": "edbdfaf41fa4672e225583ae8d431dd44992a3ecaee96197b43e2e562fc006bc",
  "f3-two-arcs": "8f1d9506ee13b505cb93da6b9cfa2a14186dcbc4b3cb1c162463c226cbfc61f3",
  "f3-crescent": "c11a8e827b7b7e775c682cbe079d15fbb7920b0e522b89104b962eee388ed518",
  "f3-four-leaf": "a0d400f091a84749213eee932be7d8033cef10d74d8942a71546934b728132b7",
  "f3-two-circles": "f27be2e4d8ba24ca9e8ef5378a815ab690bd084cfb1027fbb11ead61711733d8",
  "f3-half-sector": "e825d6322f6c6a57fb85916daddec666044274c19dfa702621dd222338b2eb0c",
  "f3-leaf-area": "ebac79f337955717c84a9c9247ab598c41cdc1baa7fa9393c11da96aefa59dd0",
  "f3-two-rects": "c35633aff25aa212dde6a1b5ee943c06651a0e02966abad543ac15e2548694c3"
};

const near = (a, b, note) => assert.ok(Math.abs(a - b) < 1e-8, `${note}: ${a} ~= ${b}`);
const ratio = (x) => x[0] / x[1];
const overlap = (r, distance) => 2 * r * r * Math.acos(distance / (2 * r)) - distance * Math.sqrt(4 * r * r - distance * distance) / 2;
function mathText(text) {
  let expression = String(text).replace(/\$/g, '').replace(/^AD\s*=\s*/, '').replace(/−/g, '-').replace(/°/g, '').replace(/\s+/g, '');
  expression = expression.replace(/\\(?:dfrac|frac)\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)').replace(/\\pi/g, 'π');
  assert.match(expression, /^[0-9π()+\-*/.]+$/, 'supported numeric answer: ' + text);
  expression = expression.replace(/(\d|\))(?=π|\()/g, '$1*').replace(/π(?=\d|\()/g, 'π*').replace(/π/g, '(Math.PI)');
  return Function('return (' + expression + ');')();
}
function independent(id, s) {
  switch (id) {
    case 'f3-rect-sector': {
      const r = s.f3b, sector = Math.PI * r * r / 4, ad = sector / r;
      return { answer: ad, sector, numbers: [r, 2, 4, 90, 360] };
    }
    case 'f3-two-arcs': {
      const a = s.f3a, height = Math.sqrt(a * a - (a / 2) ** 2);
      const interior = Math.atan2(height, a / 2), angle = Math.PI / 2 - interior;
      const sector = a * a * angle / 2;
      near(angle * 180 / Math.PI, 30, 'right angle minus geometric triangle angle');
      return { answer: a * a - 2 * sector, sector, square: a * a, numbers: [a, 2, 60, 90, 30, a * a / 3, 4, 1, 6, a * a, 360] };
    }
    case 'f3-crescent': {
      const a = s.f3e, r = a / 2, common = overlap(r, Math.sqrt(2) * r), large = Math.PI * a * a / 4, semi = Math.PI * r * r / 2;
      return { answer: large - (2 * semi - common), common, large, semi, numbers: [a, r, 90, 1, 2, 4, r * r] };
    }
    case 'f3-four-leaf': {
      const a = s.f3e, r = a / 2, leaf = overlap(r, Math.sqrt(2) * r);
      return { answer: 4 * leaf, leaf, quarter: Math.PI * r * r / 4, square: r * r, numbers: [a, r, 1, 2, 4, 90, a * a / 2, a * a] };
    }
    case 'f3-two-circles': {
      const r = s.f3r, d = r, hull = 2 * r * d + Math.PI * r * r;
      return { answer: hull - Math.PI * r * r, d, height: 2 * r, numbers: [r, 2, 2 * r, 2 * r * r] };
    }
    case 'f3-half-sector': {
      const diameter = s.f3q, r = diameter / 2, semi = Math.PI * r * r / 2, whole = Math.PI * diameter * diameter;
      return { answer: 360 * semi / whole, semi, whole, numbers: [diameter, r, 2, 1, r * r / 2, diameter * diameter, 360, whole / semi, 360 * semi / whole] };
    }
    case 'f3-leaf-area': {
      const a = s.f3a, leaf = overlap(a, Math.sqrt(2) * a);
      return { answer: leaf, quarter: Math.PI * a * a / 4, square: a * a, numbers: [a, 2, 90, 1, 4, a * a / 4, a * a / 2, a * a] };
    }
    case 'f3-two-rects': {
      const h = s.f3h, first = [0, 5], second = [5 - s.f3o, 9 - s.f3o];
      const commonWidth = Math.max(0, Math.min(first[1], second[1]) - Math.max(first[0], second[0]));
      const unionWidth = Math.max(first[1], second[1]) - Math.min(first[0], second[0]);
      return { answer: unionWidth * h, common: commonWidth * h, A: 5 * h, B: 4 * h, numbers: [5, 4, h, commonWidth, 5 * h, 4 * h, commonWidth * h, unionWidth * h] };
    }
  }
}
const resultNames = {
  'f3-rect-sector': 'AD', 'f3-two-arcs': '색칠한 넓이', 'f3-crescent': '초승달',
  'f3-four-leaf': '네 잎의 넓이', 'f3-two-circles': '색칠한 넓이',
  'f3-half-sector': '중심각 x', 'f3-leaf-area': '잎의 넓이', 'f3-two-rects': '합친 넓이'
};
for (const id of ids) {
  test(id + ': 실제 validator·원본 기본값·매개변수·정리 단계', () => {
    const lesson = lessons[id], scene = scenes.get(id), { s, lab } = entered(scene);
    assert.deepEqual(core.validateLessonSet(lesson), { errors: [], warnings: [] });
    for (const [key, num] of Object.entries(lesson.chapters[0].start)) {
      assert.equal(num, s[key], key + ' original enter default');
      const p = lab.params[key]; assert.ok(p, key + ' is a real registered parameter');
      assert.ok(num >= p.min && num <= p.max, key + ' in original range');
    }
    for (const chapter of lesson.chapters) for (const cue of chapter.cues) {
      if (cue.step !== undefined) assert.ok(cue.step >= 0 && cue.step <= scene.steps(s).length, 'real review step');
      for (const [key, value] of Object.entries(cue.to || {})) assert.ok(value >= lab.params[key].min && value <= lab.params[key].max, 'real animation range');
    }
  });
  test(id + ': 원본 모델·문제의 정답을 독립 계산으로 검산한다', () => {
    const { s } = state(id, 0), D = scenes.get(id).f3, M = D.model(s, true), math = independent(id, s);
    near(mathText(lessons[id].answer), math.answer, 'lesson answer from independent geometry');
    const problem = D.prob(M, s);
    if (problem.number) near(problem.number.answer, math.answer, 'actual problem numeric answer');
    else {
      const correct = problem.choices.filter((x) => x.ok);
      assert.equal(correct.length, 1, 'original question has one correct choice');
      // Compare source choice via its plain label; don't use it as the calculation oracle.
      const choice = correct[0].p.replace(/\s*cm(?:²)?/g, '').replace(/^\(|\)$/g, '');
      near(mathText(choice), math.answer, 'source correct choice matches independent result');
    }
    switch (id) {
      case 'f3-rect-sector': near(M.w, math.answer, 'unknown side'); near(M.rect, math.sector, 'equal whole areas'); near(M.P1, M.P2, 'equal colored regions'); break;
      case 'f3-two-arcs': near(ratio(M.one) * Math.PI, math.sector, 'one sector'); near(ratio(M.two) * Math.PI, 2 * math.sector, 'two sectors'); break;
      case 'f3-crescent': near(M.L.v, math.common, 'lens overlap by circle-intersection formula'); near(ratio(M.Q) * Math.PI, math.large, 'quarter'); near(ratio(M.D) * Math.PI, math.semi, 'semicircle'); break;
      case 'f3-four-leaf': near(M.leaf.v, math.leaf, 'single leaf intersection'); near(M.all.v, math.answer, 'four leaves'); near(ratio(M.qd) * Math.PI, math.quarter, 'quarter'); break;
      case 'f3-two-circles': near(M.area, math.answer, 'capsule less full circle'); near(M.d, math.d, 'mutual center condition'); break;
      case 'f3-half-sector': near(M.x, math.answer, 'equal-area angle'); near(M.hd, math.semi, 'semicircle'); near(M.sec, math.semi, 'equal-area sector'); near(M.P1, M.P2, 'equal colored regions'); break;
      case 'f3-leaf-area': near(M.leaf.v, math.answer, 'geometric circle overlap'); near(ratio(M.qd) * Math.PI, math.quarter, 'quarter'); break;
      case 'f3-two-rects': near(M.U, math.answer, 'union from interval endpoints'); near(M.O, math.common, 'overlap from interval intersection'); break;
    }
    const allowed = math.numbers;
    for (const chapter of lessons[id].chapters) for (const cue of chapter.cues) for (const match of (cue.say || '').matchAll(/\d+(?:\.\d+)?/g)) {
      assert.ok(allowed.some((x) => Math.abs(x - Number(match[0])) < 1e-8), 'explained number ' + match[0] + ': ' + cue.say);
    }
  });
  test(id + ': entry·각 자막·끝·다시 보기의 공개 상태', () => {
    const cs = core.compileLesson(lessons[id]), last = cs.cues.at(-1).at, scene = scenes.get(id);
    assert.ok(last >= cs.chapters.at(-1).at);
    const samples = new Set([0, cs.length, last - .001, last]);
    cs.cues.forEach((cue) => { samples.add(cue.at); if (cue.at) samples.add(cue.at - .001); if (cue.dur) { samples.add(cue.at + cue.dur / 2); samples.add(cue.at + cue.dur); } });
    for (const t of samples) {
      const x = frame(id, t), finalVisible = x.view.readouts.some((r) => r.label === resultNames[id]);
      assert.equal(finalVisible, t >= last, 'result readout at ' + t);
      assert.equal(x.s.f3Show, t >= last, 'final key at ' + t);
      assert.equal(x.view.status.tone === 'ok', t >= last, 'final status at ' + t);
      assert.equal(x.texts.some((v) => v.text === resultNames[id]), t >= last, 'result caption at ' + t);
      const text = x.texts.map((v) => v.text).join('|');
      if (id === 'f3-rect-sector' && x.s.f3Read < 2) assert.doesNotMatch(text, /4π/);
      if (id === 'f3-two-arcs' && x.s.f3Read < 1) assert.doesNotMatch(text, /60°/);
      if (id === 'f3-two-arcs' && x.s.f3Read < 2) assert.doesNotMatch(text, /30°/);
      if (id === 'f3-crescent' && x.s.f3Read < 1) assert.doesNotMatch(text, /9π/);
      if (id === 'f3-two-circles' && x.s.f3Read < 1) assert.doesNotMatch(text, /12 cm/);
      if (id === 'f3-half-sector' && t < last) assert.doesNotMatch(text, /45°/);
      if (id === 'f3-leaf-area' && x.s.f3Read < 1) assert.doesNotMatch(text, /9π/);
      if (id === 'f3-two-rects' && x.s.f3Read < 1) assert.doesNotMatch(text, /15 cm²/);
      if (id === 'f3-two-rects' && x.s.f3Read < 2) assert.doesNotMatch(text, /12 cm²/);
      if (id === 'f3-two-rects' && x.s.f3Read < 4) assert.doesNotMatch(text, /6 cm²/);
    }
    const end = state(id, cs.length), begin = state(id, 0);
    Object.assign(end.s, { lessonEntry: true, lessonOn: false }); Object.assign(begin.s, { lessonEntry: true, lessonOn: false });
    assert.deepEqual(drawing(scene, end.s, end.lab), drawing(scene, begin.s, begin.lab), 'previous result does not leak on entry');
    const replay = core.stateAt(cs, 0, { nums: end.s, sets: end.s, step: end.s.step, part: end.s.part });
    const clean = core.stateAt(cs, 0, { nums: begin.s, sets: begin.s, step: begin.s.step, part: begin.s.part });
    assert.deepEqual(json(replay), json(clean), 'replay resets all written values');
  });
  test(id + ': 직접 해 보기에는 해설 키가 영향을 주지 않는다', () => {
    const scene = scenes.get(id);
    for (const tab of ['explore', 'review', 'problem']) {
      const { s, lab } = entered(scene); lab.tab = tab; Object.assign(s, { step: 3, f3t: .62 });
      const original = drawing(scene, s, lab);
      Object.assign(s, { f3Read: 99, f3Show: true, lessonOn: false, lessonEntry: false });
      assert.deepEqual(drawing(scene, s, lab), original, tab);
    }
  });
}

test('실등록 9장면 중 기존 잎 둘레 대본을 보존하고 잔여8개만 추가한다', () => {
  const context = { window: {} }; vm.createContext(context); vm.runInContext(read('lesson.js'), context);
  const before = context.window.APL_LESSONS['g7-circle-sector'];
  assert.equal(scenes.size, 9);
  assert.equal(ids.length, 8);
  assert.deepEqual(json(loaded.APL_LESSONS['g7-circle-sector']['f3-leaf-len']), json(before['f3-leaf-len']));
  assert.equal(Object.keys(loaded.APL_LESSONS['g7-circle-sector']).length, Object.keys(before).length + 8);
});

test('원본9장면×9상태의 일반 탐구·정리·문제 draw/view/focus를 보존한다', () => {
  assert.equal(Object.keys(MANUAL_BASELINE).length, 9);
  for (const [id, scene] of scenes) assert.equal(manualDigest(scene), MANUAL_BASELINE[id], id);
});

test('넓이가 같다는 조건의 진입 그림은 원본 정리 모델과 결속된다', () => {
  for (const id of ['f3-rect-sector', 'f3-half-sector']) {
    const scene = scenes.get(id), { s, lab } = state(id, 0);
    Object.assign(s, { lessonOn: false, lessonEntry: true });
    lab.tab = 'explore'; const entryFromExplore = drawing(scene, s, lab);
    lab.tab = 'review'; const entryFromReview = drawing(scene, s, lab);
    assert.deepEqual(entryFromExplore, entryFromReview, id + ': same true-condition entry regardless of former tab');
    const M = scene.f3.model(s, true);
    near(M.P1, M.P2, 'same colored areas');
  }
});

test('도형의 계산 결과는 해당 자막이 시작하는 순간 그림에도 나타난다', () => {
  const checks = [
    ['f3-rect-sector', 18, '4π cm²'], ['f3-two-arcs', 32, '27π/4 cm²'],
    ['f3-crescent', 15, '9π cm²'], ['f3-four-leaf', 24.5, 'π cm²'],
    ['f3-two-circles', 23, '12 cm'], ['f3-half-sector', 18, '18π cm²'],
    ['f3-leaf-area', 18, '9π cm²'], ['f3-two-rects', 10, '15 cm²'],
    ['f3-two-rects', 24.5, '2 cm']
  ];
  for (const [id, at, text] of checks) assert.ok(frame(id, at).texts.some((x) => x.text === text), id + ' at ' + at + ': ' + text);
});
