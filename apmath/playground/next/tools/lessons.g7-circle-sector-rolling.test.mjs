// 실제 rolling.js와 Board의 수학·그리기 명령 회귀 검사입니다.
// 이 VM 검사는 390×844 실제 브라우저 검수/캡처를 대신하지 않습니다.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCENE_DIR = path.join(ROOT, 'labs/g7-circle-sector');
const read = (name) => fs.readFileSync(path.join(SCENE_DIR, name), 'utf8');
const copy = (value) => JSON.parse(JSON.stringify(value));
const numericArgs = { moveTo: [0, 1], lineTo: [0, 1], rect: [0, 1, 2, 3], fillRect: [0, 1, 2, 3], clearRect: [0, 1, 2, 3], arc: [0, 1, 2, 3, 4], ellipse: [0, 1, 2, 3, 4, 5, 6], fillText: [1, 2], strokeText: [1, 2], bezierCurveTo: [0, 1, 2, 3, 4, 5], quadraticCurveTo: [0, 1, 2, 3], setTransform: [0, 1, 2, 3, 4, 5] };
function canvas() {
  const commands = [];
  const context = new Proxy({ measureText: (text) => ({ width: String(text).length * 8 }) }, {
    get(target, key) {
      if (key in target) return target[key];
      return (...args) => {
        commands.push([String(key), ...args]);
        for (const index of numericArgs[key] || []) assert.ok(Number.isFinite(args[index]), `${String(key)} coordinate ${index}: ${String(args[index])}`);
      };
    },
    set(target, key, value) { commands.push(['set', String(key), value]); target[key] = value; return true; }
  });
  return { width: 390, height: 550, getContext: () => context, commands };
}

function rollingHarness(source = read('rolling.js')) {
  const element = (tag) => tag === 'canvas' ? canvas() : { tagName: tag.toUpperCase(), dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, append() {} };
  const document = { getElementById() { return null; }, createElement: element, documentElement: element('html'), body: element('body'), head: element('head'), addEventListener() {} };
  const context = vm.createContext({ document, console, Math, URLSearchParams, performance, setTimeout, clearTimeout, requestAnimationFrame: () => 0, cancelAnimationFrame() {}, devicePixelRatio: 1, location: { hash: '', search: '' }, getComputedStyle: () => ({ getPropertyValue: (key) => key === '--font-ui' ? 'sans-serif' : key === '--m-glow' ? '0' : '#ffffff' }), matchMedia: () => ({ matches: false }), addEventListener() {} });
  context.window = context;
  for (const name of ['apl-core.js', 'apl-board.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, 'kit', name), 'utf8'), context, { filename: name });
  vm.runInContext(source, context, { filename: 'rolling.js' });
  vm.runInContext(read('lesson.js'), context, { filename: 'lesson.js' });
  vm.runInContext(read('lesson-rolling.js'), context, { filename: 'lesson-rolling.js' });
  const group = context.APL_CS_GROUPS.find((g) => g.id === 'rolling');
  const board = new context.APLab.Board(canvas(), { kind: 'figure', interactive: false });
  board.resize(390, 550);
  board.setInsets({ top: 48, bottom: 42, left: 4, right: 12 });
  const lab = { board, list: group.scenes, params: { ...group.params }, s: {}, index: 0, tab: 'explore', invalidate() {}, _buildReview() {}, get scene() { return this.list[this.index]; } };
  context.lab = lab;
  lab._answerOpen = () => lab.s.revealed || lab.s.step >= lab.scene.steps(lab.s).length;
  lab.go = (id) => {
    lab.index = lab.list.findIndex((scene) => scene.id === id);
    assert.ok(lab.index >= 0, `production scene ${id}`);
    lab.s = { step: 1, revealed: false, playing: false };
    for (const [key, param] of Object.entries(lab.params)) lab.s[key] = param.value;
    lab.tab = 'explore';
    lab.scene.enter(lab.s, lab);
    board.setFocus(lab.scene.focus(lab.s), true);
    return lab.scene;
  };
  lab.draw = () => {
    const texts = [], textItems = [], points = [], originalText = board._text, originalPoint = board.point;
    board._text = function (x, y, text, options, screen) { if (text != null && !board._bbox) { texts.push(String(text)); textItems.push({ x, y, text: String(text), options, screen }); } return originalText.call(this, x, y, text, options, screen); };
    board.point = function (p, options) { points.push({ p: { ...p }, options: { ...options } }); return originalPoint.call(this, p, options); };
    board.canvas.commands.length = 0;
    try {
      const value = lab.scene.view(lab.s, lab);
      board.begin(); lab.scene.draw(board, lab.s, value, lab); board.end();
      return { texts, textItems, points, value: copy(value), commands: copy(board.canvas.commands) };
    } finally { board._text = originalText; board.point = originalPoint; }
  };
  return { lab, group, lessons: context.APL_LESSONS['g7-circle-sector'] };
}

const { lessons: ALL } = rollingHarness();
const IDS = ['rl-rtri', 'rl-turn45', 'rl-semi', 'rl-square'];
const LESSONS = Object.fromEntries(IDS.map((id) => [id, ALL[id]]));
const close = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-9, `${message}: ${a} / ${b}`);
const arc = (radius, degrees) => 2 * Math.PI * radius * degrees / 360;
// 생산 모델/정답 문자열을 기대값으로 쓰지 않고, 원본 조건의 기하 관계로 각 자취를 따로 계산합니다.
const independent = {
  'rl-rtri': (c) => { const angleA = 180 - 90 - c.beta, AB = c.a / Math.cos(c.beta * Math.PI / 180); return [arc(c.a, 180 - 90), arc(AB, 180 - angleA)]; },
  'rl-turn45': (c) => { const angleC = 180 - 90 - c.deg; return [arc(c.d, 180 - angleC)]; },
  'rl-semi': (c) => [arc(c.R, 90), Math.PI * c.R, arc(c.R, 90)],
  'rl-square': (c) => [arc(c.a, 180 - 90), 0, arc(c.a, 180 - 90)]
};
function piValue(tex) {
  const expr = tex.replace(/\$/g, '').trim();
  const f = /^\\frac\{(\d+)\\pi\}\{(\d+)\}$/.exec(expr);
  if (f) return Number(f[1]) * Math.PI / Number(f[2]);
  const k = /^\\frac\{(\d+)\}\{(\d+)\}\\pi$/.exec(expr);
  if (k) return Number(k[1]) * Math.PI / Number(k[2]);
  const n = /^(\d*)\\pi$/.exec(expr);
  assert.ok(n, `single exact π expression: ${expr}`);
  return Number(n[1] || 1) * Math.PI;
}
function timeline(lab, lesson) {
  const cs = core.compileLesson(lesson), base = { nums: { ...lab.s }, sets: {}, step: 1, part: null };
  return (time) => {
    const st = core.stateAt(cs, time, base);
    Object.assign(lab.s, st.nums, st.sets, { lessonOn: true, lessonEntry: false, playing: false });
    return { cs, st, draw: lab.draw() };
  };
}

test('굴리기 잔여 4장면: 기존 해설과 중복 없이 실제 장면에 등록되고 validator 오류·경고가 없다', () => {
  assert.equal(Object.keys(LESSONS).length, 4);
  for (const id of IDS) {
    const { lab } = rollingHarness(), scene = lab.go(id), lesson = LESSONS[id];
    const { errors, warnings } = core.validateLessonSet(lesson);
    assert.deepEqual(errors, [], id); assert.deepEqual(warnings, [], id);
    const start = lesson.chapters[0].start;
    for (const sl of scene.rl.sliders) {
      assert.equal(start[sl.param], scene.rl.base[sl.key], `${id}/${sl.param}: source given`);
      assert.ok(start[sl.param] >= sl.min && start[sl.param] <= sl.max);
    }
    assert.equal(start.rlT, 0);
    assert.match(scene.question(lab.s), /점|중심/);
    assert.ok(scene.steps(lab.s).length > 1);
    assert.equal(lesson.answerText, lesson.answer + ' cm');
    for (const chapter of lesson.chapters) for (const cue of chapter.cues) {
      for (const key of Object.keys(cue.to || {})) assert.equal(key, 'rlT', '회전 진행만 보간');
      for (const [key, value] of Object.entries(cue.set || {})) {
        assert.ok(['rlRead', 'rlFocus', 'rlShow', 'rlAngle', 'rlAngles'].includes(key), key);
        if (key === 'rlFocus') assert.ok(Number.isInteger(value) && value >= -1 && value < scene.rl.base.rolls);
        if (key === 'rlRead' || key === 'rlAngles') assert.ok(Number.isInteger(value) && value >= 0 && value <= scene.rl.base.rolls);
      }
    }
  }
});

for (const id of IDS) {
  test(`${id}: 원본 조건에서 독립 계산한 자취 합이 정답과 일치한다`, () => {
    const { lab } = rollingHarness(), scene = lab.go(id), c = scene.rl.base, lengths = independent[id](c);
    close(lengths.reduce((a, b) => a + b, 0), piValue(LESSONS[id].answer), '기하 계산과 lesson 정답');
    const coefficients = lengths.map((v) => v / Math.PI);
    const expected = { 'rl-rtri': [1.5, 5], 'rl-turn45': [6], 'rl-semi': [4.5, 9, 4.5], 'rl-square': [2, 0, 2] }[id];
    coefficients.forEach((coefficient, i) => close(coefficient, expected[i], `부분 ${i}`));
    // 원본의 제시 정답도 독립 계산과 대조합니다. 객관식 번호는 수치 계산에 쓰지 않습니다.
    const original = scene.problem.answer(lab.s).match(/\$([^$]+)\$/)?.[1];
    close(piValue(original), lengths.reduce((a, b) => a + b, 0), '원본 정답');
  });

  test(`${id}: 각 자막 시점의 실제 그림·띠에서 수치 공개 순서와 자동 종료를 지킨다`, () => {
    const { lab } = rollingHarness(); lab.go(id);
    const lesson = LESSONS[id], at = timeline(lab, lesson), cs = core.compileLesson(lesson);
    const finalCue = cs.says.at(-1).at, answer = core.normAnswer(lesson.answer);
    const times = new Set([0, cs.length]);
    for (let t = 0; t <= cs.length; t += 1) times.add(t);
    for (const say of cs.says) { times.add(say.at); if (say.at > 0) times.add(say.at - 0.01); }
    for (const time of [...times].sort((a, b) => a - b)) {
      const { draw, st } = at(time);
      assert.ok(Number.isFinite(lab.s.rlT) && lab.s.rlT >= 0 && lab.s.rlT <= 1);
      for (const item of draw.textItems) assert.ok(Number.isFinite(item.x) && Number.isFinite(item.y));
      if (time < finalCue) {
        assert.equal(lab.s.rlShow, false, `${time}: final flag`);
        assert.equal(draw.value.summary, null, `${time}: summary`);
        assert.ok(!draw.value.tape.title.includes('='), `${time}: 합계 제목 보류`);
        for (const text of draw.texts) assert.ok(!core.normAnswer(text).includes(answer), `${time}: canvas final number`);
      }
      for (const segment of draw.value.tape.segments) if (/π/.test(segment.text)) {
        const index = ['㉠', '㉡', '㉢'].findIndex((s) => segment.text.startsWith(s));
        assert.ok(index < lab.s.rlRead, `${time}: 호 ${index} 계산 전 노출`);
      }
      const centralAngles = draw.textItems.filter((it) => it.options?.part != null && /°/.test(it.text));
      for (const item of centralAngles) {
        // 정사각형은 가운데 회전에서 자취가 없으므로 두 번째 호는 회전 3에 속합니다.
        const rotation = id === 'rl-square' && item.options.part === 1 ? 2 : item.options.part;
        assert.ok(rotation < lab.s.rlAngles, `${time}: 중심각은 설명 후 공개: ${item.text}`);
      }
      assert.ok(st.say >= 0, '이어진 시간에 자막 존재');
    }
    const end = at(cs.length);
    close(lab.s.rlT, 1, '자동 재생 끝 진행률');
    assert.equal(lab.s.rlShow, true);
    assert.ok(end.draw.value.summary.includes('='));
    assert.ok(end.draw.value.tape.segments.every((s) => /π/.test(s.text)));
    const again = at(0);
    close(lab.s.rlT, 0, '다시 보기 첫 상태');
    assert.equal(lab.s.rlRead, 0); assert.equal(lab.s.rlShow, false);
    assert.equal(again.draw.value.summary, null);
  });
}

test('rl-turn45·turn60: 회전 중 점 A와 도착점 A′를 실제 그림에서 함께 식별한다', () => {
  for (const id of ['rl-turn45', 'rl-turn60']) {
    const { lab } = rollingHarness(); lab.go(id);
    Object.assign(lab.s, { lessonOn: true, rlT: 0.3, rlRead: 0, rlAngles: 0, rlAngle: false, rlFocus: 0, rlShow: false });
    const d = lab.draw();
    assert.ok(d.texts.includes('A'), id + ': moving A');
    assert.ok(d.texts.includes('A′'), id + ': destination A′');
    assert.ok(d.points.some((p) => p.options.color === 'rose' && p.options.hollow && p.options.r === 5));
  }
});

test('rl-rtri·turn45: 계산한 나머지 내각은 유도 자막에서만 연다', () => {
  const rtri = rollingHarness().lab; rtri.go('rl-rtri');
  Object.assign(rtri.s, { lessonOn: true, rlT: 0, rlAngle: false, rlAngles: 0 });
  assert.ok(!rtri.draw().texts.includes('30°'));
  rtri.s.rlAngle = true; assert.ok(rtri.draw().texts.includes('30°'));
  const turn = rollingHarness().lab; turn.go('rl-turn45');
  Object.assign(turn.s, { lessonOn: true, rlT: 0, rlAngle: false, rlAngles: 0 });
  assert.equal(turn.draw().texts.filter((s) => s === '45°').length, 1, '주어진 B만');
  turn.s.rlAngle = true; assert.equal(turn.draw().texts.filter((s) => s === '45°').length, 2, '계산한 C까지');
});

test('rl-square: 가운데 회전 내내 추적점 C는 움직이지 않는다', () => {
  const { lab } = rollingHarness(); lab.go('rl-square');
  const points = [];
  for (const rlT of [1 / 3, 0.4, 0.5, 0.6, 2 / 3]) {
    Object.assign(lab.s, { lessonOn: true, rlT, rlFocus: 1, rlRead: 1, rlAngles: 1, rlShow: false });
    const point = lab.draw().points.find((p) => p.options.color === 'rose' && p.options.r === 7);
    assert.ok(point); points.push(point.p);
  }
  points.forEach((point) => { close(point.x, points[0].x, 'C.x'); close(point.y, points[0].y, 'C.y'); });
});

test('rl-semi: 둥근 부분으로 구르는 동안 O는 수평으로 9π cm 이동한다', () => {
  const { lab } = rollingHarness(); lab.go('rl-semi');
  const points = [];
  for (const rlT of [1 / 3, 0.5, 2 / 3]) {
    Object.assign(lab.s, { lessonOn: true, rlT, rlFocus: 1, rlRead: 1, rlAngles: 1, rlShow: false });
    points.push(lab.draw().points.find((p) => p.options.color === 'rose' && p.options.r === 7).p);
  }
  close(points[0].y, points[1].y, '중간 높이'); close(points[0].y, points[2].y, '끝 높이');
  close(points[2].x - points[0].x, 9 * Math.PI, '중심의 수평 변위');
});

test('굴리기 7장면: lesson 전용 키는 수동 탐구·정리·문제의 명령과 값을 바꾸지 않는다', () => {
  for (const id of ['rl-rect', 'rl-tri', 'rl-turn60', ...IDS]) for (const tab of ['explore', 'review', 'problem']) {
    for (const progress of [0, 0.5, 1]) {
      const samples = [];
      for (const enabled of [false, true]) {
        const { lab } = rollingHarness(); lab.go(id); lab.tab = tab;
        Object.assign(lab.s, { lessonOn: false, lessonEntry: false, rlT: progress, step: 3, rlRead: enabled ? 3 : 0, rlAngles: enabled ? 3 : 0, rlFocus: enabled ? -1 : 0, rlAngle: enabled, rlShow: enabled });
        const draw = lab.draw(); samples.push({ commands: draw.commands, value: draw.value });
      }
      assert.deepEqual(samples[0], samples[1], `${id}/${tab}/${progress}`);
    }
  }
});
