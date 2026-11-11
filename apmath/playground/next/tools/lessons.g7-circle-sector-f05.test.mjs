// F05 신규 8장면: 실제 장면 결속 · 독립 수학 · 공개 순서 · 되감기 · 일반 경로 회귀.
// 실행: node --test apmath/playground/next/tools/lessons.g7-circle-sector-f05.test.mjs
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
const SCENE_SOURCE = read('f05.js');
const json = (x) => JSON.parse(JSON.stringify(x, (_key, value) => typeof value === 'function' ? '[function]' : value));
const norm = (x) => core.normAnswer(typeof x === 'string' ? x : JSON.stringify(x));

function load(source = SCENE_SOURCE, lessons = true) {
  const sandbox = {
    window: {},
    document: { getElementById: () => null, createElement: () => ({}), head: { append() {} }, documentElement: { dataset: {} }, addEventListener() {} }
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'f05.js' });
  if (lessons) {
    vm.runInContext(read('lesson.js'), sandbox, { filename: 'lesson.js' });
    vm.runInContext(read('lesson-f05.js'), sandbox, { filename: 'lesson-f05.js' });
  }
  return sandbox.window;
}
const loaded = load();
const scenes = new Map(loaded.APL_CS_GROUPS.flatMap((g) => g.scenes).map((s) => [s.id, s]));
const ids = ['f5-ring240', 'f5-star', 'f5-lens', 'f5-cut', 'f5-track', 'f5-rect', 'f5-tri3', 'f5-line'];
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
    color: (name, alpha) => name + ':' + (alpha ?? 1)
  };
  b.ctx = new Proxy({}, { get: (_target, method) => (...args) => record('ctx.' + method, args), set: (target, key, value) => { target[key] = value; record('ctx.set.' + key, [value]); return true; } });
  for (const method of ['arc', 'seg', 'circle', 'poly', 'point', 'angle', 'ticks', 'right', 'handle', 'text', 'stext']) {
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
    Object.assign(s, { step, f5T: t }); lab.tab = tab;
    frames.push(drawing(scene, s, lab));
  }
  return crypto.createHash('sha256').update(JSON.stringify(frames)).digest('hex');
}

// 병합 직후 원본 6533d858361540e1f5f4b2b57025fe5667892775의 f05.js에서 생성.
// 장면별 9개 상태의 draw 명령·view·focus를 합친 hash. CI에서 Git history 접근 불필요.
const MANUAL_BASELINE = {
  "f5-sn": "15509f49dfb10f469a00f056c6025ba51694f682dce8dfd80d326eed5f34812e",
  "f5-ring": "51677d74f2b2f79f6ef3b1d4325e8e620e96f190870fd2f555cc7f8fe59316b6",
  "f5-ring240": "6724c1973cf124ec51469980a5d24f7c6b2301b34450b65bf8fb79d8bfa53471",
  "f5-star": "a58f25a645a61064032df81999fb31ecfdbe270353aec50e95754e4bba1b8a23",
  "f5-lens": "b265d0765823a3653ef5de125405a9a569e1c7d9af23465d1904277fbd52c92b",
  "f5-cut": "556926172e1130f1c773936816f4d4f905c77510056627761cde6c4459c8d2e4",
  "f5-track": "1da4859962bd6ceadd7699c9720e92629a5d62f27ec439701e03503147b6a607",
  "f5-sq4": "0c3d19d863dfaddaf1221b9b7a60002addd9dab488a78a0f153a7b550f45d8e8",
  "f5-rect": "6eb99513281e29029931194684e6277800fecd003ff35429d0b74535e0678ccd",
  "f5-tri3": "47f8519ac6e1e96e91311118b8a38dae1d164611a128db1f97f70b47441c9ddb",
  "f5-line": "baf3440ef2f6e7c8e96daf05ac1ffc7bf5b93b4c2bcadf89f93a5b1e85f45b02"
};

const near = (a, b, note) => assert.ok(Math.abs(a - b) < 1e-9, `${note}: ${a} ~= ${b}`);
const value = (x) => x.n / x.d * Math.PI + x.c;
function independent(id, s) {
  const r = s.f5A;
  switch (id) {
    case 'f5-ring240': {
      const outer = r + s.f5B, angle = (360 - s.f5C) / 360;
      return { pi: 2 * (outer + r) * angle, straight: 2 * s.f5B,
        pieces: [2 * Math.PI * outer * angle, s.f5B, 2 * Math.PI * r * angle, s.f5B],
        numbers: [r, s.f5B, s.f5C, outer, 360, 360 - s.f5C, 2, 32, 3, 16] };
    }
    case 'f5-star': {
      const radius = r / 2, quarter = Math.PI * radius / 2;
      return { pi: 8 * quarter / Math.PI, straight: 0, pieces: Array(8).fill(quarter), numbers: [r, radius, 2, 4, 90, 8, 12] };
    }
    case 'f5-lens': {
      // 2개 원의 중심 사이 거리=반지름. 교점의 높이는 피타고라스로 독립 계산.
      const d = r, height = Math.sqrt(r * r - (d / 2) ** 2), angle = 2 * Math.atan2(height, d / 2);
      const arc = r * angle;
      near(angle * 180 / Math.PI, 120, 'lens geometric central angle');
      return { pi: 2 * arc / Math.PI, straight: 0, pieces: [arc, arc], numbers: [r, 2, 60, 120, 360, 8, 16] };
    }
    case 'f5-cut': {
      const inner = s.f5B, rest = 2 * r - 2 * inner;
      return { pi: r + inner, straight: rest, pieces: [Math.PI * r, rest, Math.PI * inner], numbers: [r, inner, 2, 1, 180, r + inner] };
    }
    case 'f5-track': {
      const straight = s.f5B;
      return { pi: 2 * r, straight: 2 * straight, pieces: [straight, Math.PI * r, straight, Math.PI * r], numbers: [r, straight, 2, 1, 180, 2 * straight] };
    }
    case 'f5-rect': {
      // 중심을 이은 직사각형: 가로2r, 세로2r(n−1)의 둘레가 직선의 합.
      const straight = 2 * (2 * r + 2 * r * (s.f5B - 1));
      return { pi: 2 * r, straight, angles: [90, 90, 90, 90], edges: 2 * s.f5B, numbers: [r, s.f5B * 2, 2 * r, straight, 90, 360, 4, 2] };
    }
    case 'f5-tri3': {
      const centers = [[0, 0], [2 * r, 0], [r, Math.sqrt(3) * r]], lengths = centers.map((p, i) => Math.hypot(p[0] - centers[(i + 1) % 3][0], p[1] - centers[(i + 1) % 3][1]));
      lengths.forEach((x) => near(x, 2 * r, 'triangle center distances'));
      // 검산은 코사인 법칙으로 내각60°를 독립 계산. 접선과 반지름이 직교하므로 호의 중심각은 외각120°.
      const inner = Math.acos((lengths[0] ** 2 + lengths[1] ** 2 - lengths[2] ** 2) / (2 * lengths[0] * lengths[1])) * 180 / Math.PI;
      near(inner, 60, 'triangle inner angle');
      return { pi: 2 * r, straight: lengths.reduce((a, b) => a + b, 0), angles: Array(3).fill(180 - inner), edges: 3, numbers: [r, 2 * r, 3, 6 * r, 60, 180, 120, 360, 2] };
    }
    case 'f5-line': {
      const span = 2 * r * (s.f5B - 1);
      return { pi: 2 * r, straight: 2 * span, angles: [180, 180], edges: 2 * (s.f5B - 1), numbers: [r, s.f5B, 2 * r, 2 * span, 180, 360, 2] };
    }
    default: throw new Error(id);
  }
}

// 숫자·정답 문자열 자체를 source의 정답 문자열과만 비교하지 않습니다.
// 위 독립 기하 계산 → model의 각 조각/합 → 자막과 마지막 카드의 순서로 대조합니다.
for (const id of ids) {
  test(id + ': 실제 등록 장면과 구조·상태 범위가 결속된다', () => {
    const lesson = lessons[id], scene = scenes.get(id);
    assert.ok(scene && lesson);
    assert.deepEqual(core.validateLessonSet(lesson), { errors: [], warnings: [] });
    const { s, lab } = entered(scene);
    assert.deepEqual(json(lesson.chapters[0].start), Object.fromEntries(Object.keys(lesson.chapters[0].start).map((k) => [k, s[k]])), 'uses the scene enter defaults');
    for (const [key, num] of Object.entries(lesson.chapters[0].start)) {
      assert.ok(lab.params[key], 'actual parameter exists: ' + key);
      const p = lab.params[key];
      assert.ok(num >= p.min && num <= p.max, 'within actual range: ' + key);
      near((num - p.min) / p.step, Math.round((num - p.min) / p.step), 'matches parameter step: ' + key);
    }
    const lastStep = scene.steps(s).length;
    for (const chapter of lesson.chapters) for (const cue of chapter.cues) {
      if (cue.step != null) assert.ok(cue.step <= lastStep, 'review step exists');
      if (cue.to) for (const [key, v] of Object.entries(cue.to)) assert.ok(v >= lab.params[key].min && v <= lab.params[key].max, 'animated parameter in range');
    }
  });

  test(id + ': 독립 기하 계산이 원본 조각·정답·자막 숫자와 일치한다', () => {
    const { s } = state(id, 0), scene = scenes.get(id), model = scene.f5Model(s), math = independent(id, s), lesson = lessons[id];
    near(value(model.total), math.pi * Math.PI + math.straight, 'total circumference');
    near(model.total.n / model.total.d, math.pi, 'pi coefficient');
    near(model.total.c, math.straight, 'straight length');
    if (math.pieces) model.P.forEach((p, i) => near(value(p.len), math.pieces[i], 'boundary piece ' + i));
    if (math.angles) {
      assert.equal(model.E, math.edges);
      model.arcs.forEach((a, i) => near(a.deg, math.angles[i], 'exterior arc ' + i));
      near(model.curveVal, math.pi * Math.PI, 'combined arc length');
      near(math.angles.reduce((a, b) => a + b, 0), 360, 'all exterior angles');
    }
    const answer = `${Math.round(math.pi)}π${math.straight ? '+' + Math.round(math.straight) : ''}`;
    assert.equal(norm(lesson.answer), answer, 'answer derives from independent values');
    const allowed = new Set(math.numbers);
    for (const chapter of lesson.chapters) for (const cue of chapter.cues) for (const n of cue.say.matchAll(/\d+(?:\.\d+)?/g)) {
      assert.ok(allowed.has(Number(n[0])), 'caption number has an independent meaning: ' + n[0] + ' in ' + cue.say);
    }
  });

  test(id + ': 최초 진입·전 장·되감기에서 정답을 아끼고 마지막에 공개한다', () => {
    const cs = core.compileLesson(lessons[id]), finalCue = cs.cues.at(-1), scene = scenes.get(id);
    assert.equal(finalCue.at >= cs.chapters.at(-1).at, true);
    const samples = new Set([0, cs.length, finalCue.at - .001, finalCue.at]);
    for (const c of cs.cues) { samples.add(c.at); if (c.at) samples.add(c.at - .001); if (c.dur) samples.add(c.at + c.dur / 2); }
    for (const t of samples) {
      const result = frame(id, t), flat = norm(result.texts.map((x) => x.text).concat([JSON.stringify(result.view)]));
      assert.equal(flat.includes(norm(lessons[id].answer)), t >= finalCue.at, 'answer reveal at t=' + t);
      if (scene.f5Kind === 'piece') {
        const model = scene.f5Model(result.s), known = result.s.f5Read;
        for (let gi = known; gi < model.groups.length; gi++) for (const i of model.groups[gi].idx) {
          const p = model.P[i];
          if (p.kind !== 'arc') continue; // 직선의 주어진 길이는 처음부터 보일 수 있습니다.
          assert.equal(result.texts.some((x) => x.options.ref === 'p' + i && x.text === (p.labelText || p.text)), false, 'unexplained arc value at t=' + t);
        }
      } else {
        const readStage = result.s.f5BandRead, text = result.texts.map((x) => x.text).join('|');
        if (readStage < 2) assert.doesNotMatch(text, /직선 부분| × \d+ = /, 'straight sum not yet explained');
        if (readStage < 3) assert.doesNotMatch(text, /(?:60|90|120|180)°/, 'arc angles not yet explained');
        if (readStage < 4) assert.doesNotMatch(text, /중심각의 합/, 'angle sum not yet explained');
        if (readStage < 5) assert.doesNotMatch(text, /원 하나의 둘레/, 'curve value not yet explained');
      }
    }
    const end = state(id, cs.length), initial = state(id, 0);
    end.s.lessonEntry = true; end.s.lessonOn = false;
    initial.s.lessonEntry = true; initial.s.lessonOn = false;
    assert.deepEqual(drawing(scene, end.s, end.lab), drawing(scene, initial.s, initial.lab), 'entry ignores previous final reveal state');
    const replay = core.stateAt(cs, 0, { nums: end.s, sets: end.s, step: end.s.step, part: end.s.part });
    const fresh = core.stateAt(cs, 0, { nums: initial.s, sets: initial.s, step: initial.s.step, part: initial.s.part });
    assert.deepEqual(json(replay), json(fresh), 'replay resets every written key');
  });

  test(id + ': 직접 해 보기에서 해설 전용 값이 그림·패널을 바꾸지 않는다', () => {
    const scene = scenes.get(id);
    for (const tab of ['explore', 'review', 'problem']) {
      const { s, lab } = entered(scene); lab.tab = tab;
      Object.assign(s, { step: 3, f5T: .62 });
      const before = drawing(scene, s, lab);
      Object.assign(s, { f5Given: 2, f5Read: 99, f5Final: true, f5BandRead: 6, lessonOn: false, lessonEntry: false });
      assert.deepEqual(drawing(scene, s, lab), before, tab + ' ignores lesson-only flags');
    }
  });
}

test('f05 신규 8개: 기존 3개 해설을 유지하고 미등록 ring2는 추가하지 않는다', () => {
  const sandbox = { window: {} }; vm.createContext(sandbox);
  vm.runInContext(read('lesson.js'), sandbox);
  const before = sandbox.window.APL_LESSONS['g7-circle-sector'];
  for (const id of ['f5-sq4', 'f5-ring', 'f5-sn']) assert.deepEqual(json(loaded.APL_LESSONS['g7-circle-sector'][id]), json(before[id]));
  assert.equal(scenes.has('f5-ring2'), false);
  assert.equal(loaded.APL_LESSONS['g7-circle-sector']['f5-ring2'], undefined);
  assert.equal(Object.keys(loaded.APL_LESSONS['g7-circle-sector']).length, Object.keys(before).length + 8);
});

test('f05 원본 전체 11장면: 탐구·정리·문제 Canvas 명령/패널은 수정 전과 동일하다', () => {
  assert.equal(Object.keys(MANUAL_BASELINE).length, scenes.size);
  for (const [id, scene] of scenes) assert.equal(manualDigest(scene), MANUAL_BASELINE[id], id + ': original manual drawing/view/focus');
});

test('새로 설명한 반지름·각만 그림에 나타난다', () => {
  for (const [id, before, after, valueText] of [
    ['f5-ring240', 4.499, 4.5, '8 cm'], ['f5-ring240', 8.999, 9, '240°'],
    ['f5-star', 8.999, 9, '3 cm'], ['f5-lens', 8.999, 9, '60°'],
    ['f5-lens', 17.499, 17.5, '120°'], ['f5-cut', 4.499, 4.5, '4 cm']
  ]) {
    assert.equal(frame(id, before).texts.some((x) => x.text === valueText), false, id + ': before ' + valueText);
    assert.equal(frame(id, after).texts.some((x) => x.text === valueText), true, id + ': after ' + valueText);
  }
});

test('첫 자막의 주어진 길이는 그림에서도 확인할 수 있다', () => {
  const expected = {
    'f5-ring240': ['4 cm'], 'f5-star': ['6 cm'], 'f5-lens': ['12 cm'],
    'f5-cut': ['지름 8 cm', '반지름 8 cm'], 'f5-track': ['10 cm', '5 cm'],
    'f5-rect': ['4 cm'], 'f5-tri3': ['5 cm'], 'f5-line': ['4 cm']
  };
  for (const [id, given] of Object.entries(expected)) {
    const texts = frame(id, 0).texts.map((x) => x.text);
    for (const valueText of given) assert.ok(texts.includes(valueText), id + ': visible given ' + valueText);
  }
});
