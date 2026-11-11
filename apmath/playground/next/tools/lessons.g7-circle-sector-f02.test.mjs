// F02 잔여 3장면·5해설. 실제 장면/Board의 계산·그리기 명령 검사입니다.
// 실제 390×844 브라우저 화면 검수는 별도이며 이 VM 검사로 대체하지 않습니다.
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
const DIR = path.join(ROOT, 'labs/g7-circle-sector');
const read = (name) => fs.readFileSync(path.join(DIR, name), 'utf8');
const plain = (value) => JSON.parse(JSON.stringify(value));
const close = (a, b, note) => assert.ok(Math.abs(a - b) < 1e-8, `${note}: ${a} / ${b}`);
const numericArgs = { moveTo: [0, 1], lineTo: [0, 1], rect: [0, 1, 2, 3], fillRect: [0, 1, 2, 3], clearRect: [0, 1, 2, 3], arc: [0, 1, 2, 3, 4], ellipse: [0, 1, 2, 3, 4, 5, 6], fillText: [1, 2], strokeText: [1, 2], bezierCurveTo: [0, 1, 2, 3, 4, 5], quadraticCurveTo: [0, 1, 2, 3], setTransform: [0, 1, 2, 3, 4, 5] };
function f02Harness(source = read('f02.js'), hash = '') {
  const trace = []; let canvasId = 0;
  const canvas = () => {
    const id = canvasId++;
    const ctx = new Proxy({ measureText: (text) => ({ width: String(text).length * 8 }) }, {
      get(target, key) {
        if (key in target) return target[key];
        return (...args) => {
          for (const index of numericArgs[key] || []) assert.ok(Number.isFinite(args[index]), `${String(key)} coordinate ${index}: ${String(args[index])}`);
          trace.push([id, String(key), ...args.map((arg) => arg && typeof arg.getContext === 'function' ? { canvas: arg.id, width: arg.width, height: arg.height } : arg)]);
        };
      },
      set(target, key, value) { trace.push([id, 'set', String(key), value]); target[key] = value; return true; }
    });
    return { id, width: 390, height: 550, getContext: () => ctx };
  };
  const element = (tag) => tag === 'canvas' ? canvas() : { tagName: tag.toUpperCase(), dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, append() {} };
  const document = { getElementById() { return null; }, createElement: element, documentElement: element('html'), body: element('body'), head: element('head'), addEventListener() {} };
  const context = vm.createContext({ document, console, Math, URLSearchParams, performance, setTimeout, clearTimeout, requestAnimationFrame: () => 0, cancelAnimationFrame() {}, devicePixelRatio: 1, location: { hash, search: '' }, getComputedStyle: () => ({ getPropertyValue: (key) => key === '--font-ui' ? 'sans-serif' : key === '--m-glow' ? '0' : '#ffffff' }), matchMedia: () => ({ matches: false }), addEventListener() {} });
  context.window = context;
  for (const name of ['apl-core.js', 'apl-board.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, 'kit', name), 'utf8'), context, { filename: name });
  vm.runInContext(source, context, { filename: 'f02.js' });
  vm.runInContext(read('lesson-f02.js'), context, { filename: 'lesson-f02.js' });
  const group = context.APL_CS_GROUPS.find((g) => g.id === 'f02');
  const board = new context.APLab.Board(canvas(), { kind: 'figure', interactive: false });
  board.resize(390, 550); board.setInsets({ top: 48, bottom: 42, left: 4, right: 12 });
  const lab = { board, list: group.scenes, params: {}, s: {}, index: 0, tab: 'explore', invalidate() {}, _buildReview() {}, get scene() { return this.list[this.index]; } };
  context.lab = lab;
  lab.go = (id) => {
    lab.index = lab.list.findIndex((s) => s.id === id); assert.ok(lab.index >= 0, id);
    lab.s = { step: 1, revealed: false, playing: false }; lab.tab = 'explore';
    lab.scene.enter(lab.s, lab); board.setFocus({ x: [-10, 40], y: [-15, 15] }, true);
    return lab.scene;
  };
  lab.draw = () => {
    const texts = [], textItems = [], paths = [], originalText = board._text, originalPath = board.path;
    board._text = function (x, y, text, options, screen) { if (text != null && !board._bbox) { texts.push(String(text)); textItems.push({ x, y, text: String(text), options, screen }); } return originalText.call(this, x, y, text, options, screen); };
    board.path = function (p, options) { paths.push({ p: plain(p), options: plain(options || {}) }); return originalPath.call(this, p, options); };
    trace.length = 0;
    try {
      const view = lab.scene.view(lab.s, lab); board.begin(); lab.scene.draw(board, lab.s, view, lab); board.end();
      return { texts, textItems, paths, view: plain(view), commands: plain(trace) };
    } finally { board._text = originalText; board.path = originalPath; }
  };
  return { lab, lessons: context.APL_LESSONS['g7-circle-sector'] };
}
const LESSONS = f02Harness().lessons;
const ENTRIES = Object.entries(LESSONS).flatMap(([id, set]) => core.lessonList(set).map((lesson) => ({ id, lesson, name: id + (lesson.label ? '/' + lesson.label : '') })));

// 임의 코드를 실행하지 않는 수식 파서. 원본의 정답과 자막 등식의 수치를 비교합니다.
function numberOf(tex) {
  let src = String(tex).replace(/[$\s°]/g, '').replace(/\\(?:left|right)/g, '').replace(/\\(?:times|cdot)/g, '*').replace(/\\div/g, '/').replace(/\\pi/g, 'π').replace(/−/g, '-');
  for (let prev; prev !== src;) { prev = src; src = src.replace(/\\(?:d?frac|tfrac)\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))'); }
  src = src.replace(/\\frac(\d)(\d)/g, '($1/$2)').replace(/\{/g, '(').replace(/\}/g, ')');
  const raw = src.match(/\d+(?:\.\d+)?|π|[()+\-*/^]/g) || [];
  if (!raw.length || raw.join('') !== src) throw new Error(`숫자 식이 아님: ${tex}`);
  const tokens = [], ends = (t) => t === ')' || t === 'π' || /^\d/.test(t || ''), starts = (t) => t === '(' || t === 'π' || /^\d/.test(t || '');
  for (const token of raw) { if (ends(tokens.at(-1)) && starts(token)) tokens.push('*'); tokens.push(token); }
  let i = 0;
  function atom() { const t = tokens[i++]; if (t === '+') return atom(); if (t === '-') return -atom(); if (t === 'π') return Math.PI; if (t === '(') { const v = sum(); assert.equal(tokens[i++], ')'); return v; } if (/^\d/.test(t || '')) return Number(t); throw new Error(`operand ${tex}`); }
  function power() { const v = atom(); if (tokens[i] === '^') { i++; return v ** power(); } return v; }
  function product() { let v = power(); while (tokens[i] === '*' || tokens[i] === '/') { const op = tokens[i++], r = power(); v = op === '*' ? v * r : v / r; } return v; }
  function sum() { let v = product(); while (tokens[i] === '+' || tokens[i] === '-') { const op = tokens[i++], r = product(); v = op === '+' ? v + r : v - r; } return v; }
  const result = sum(); assert.equal(i, tokens.length); assert.ok(Number.isFinite(result)); return result;
}
const wanted = (id, label, s) => {
  if (id === 'lune13') {
    const p = s.f02_lune13_p, q = s.f02_lune13_q, c = Math.hypot(p, q);
    const combined = Math.PI * (p / 2) ** 2 / 2 + Math.PI * (q / 2) ** 2 / 2 + p * q / 2 - Math.PI * (c / 2) ** 2 / 2;
    close(combined, p * q / 2, '세 반원의 넓이 합·차'); return combined;
  }
  const R = s[`f02_${id}_R`], n = s[`f02_${id}_n`], r = R / n, fraction = id === 'nc' ? 1 : 1 / 2;
  return label === '둘레' ? (2 * Math.PI * R + n * 2 * Math.PI * r) * fraction : (Math.PI * R * R - n * Math.PI * r * r) * fraction;
};
function start(lab, lesson) {
  const cs = core.compileLesson(lesson), base = { nums: { ...lab.s }, sets: {}, step: 1, part: null };
  lab.tab = 'review';
  return (time, settle = false) => {
    const st = core.stateAt(cs, time, base);
    Object.assign(lab.s, st.nums, st.sets, { step: st.step, part: st.part, lessonOn: true, lessonEntry: false, playing: false });
    let draw = lab.draw();
    if (settle) for (let j = 0; j < 32; j++) {
      const before = lab.s.f02uShow;
      draw = lab.draw();
      if (Math.abs(lab.s.f02uShow - before) < 1e-10) break;
    }
    return { cs, st, draw };
  };
}

test('F02 신규3장면·5해설: 공식 validator 무우회, 개념별 라벨, 실제 controls 범위', () => {
  assert.equal(ENTRIES.length, 5);
  for (const [id, set] of Object.entries(LESSONS)) { const v = core.validateLessonSet(set); assert.deepEqual(v.errors, [], id); assert.deepEqual(v.warnings, [], id); }
  for (const id of ['nc', 'ns']) assert.deepEqual(Array.from(LESSONS[id], (l) => l.label), ['둘레', '넓이']);
  for (const { id, lesson } of ENTRIES) {
    const { lab } = f02Harness(); lab.go(id);
    assert.equal(lesson.tab, 'review');
    for (const [key, value] of Object.entries(lesson.chapters[0].start)) { const p = lab.params[key]; assert.ok(p, key); assert.ok(value >= p.min && value <= p.max, key); }
    for (const ch of lesson.chapters) for (const c of ch.cues) {
      assert.ok(!/[\u0000-\u0008\u000b-\u001f]/.test(c.say || ''), 'TeX 이스케이프에 제어 문자 없음');
      for (const [key, value] of Object.entries(c.set || {})) {
        assert.ok(['f02Read', 'f02Dims', 'f02Calc', 'f02Final', 'f02Split'].includes(key), key);
        if (key === 'f02Calc') assert.ok(Number.isInteger(value) && value >= 0 && value <= 3);
        else assert.equal(typeof value, 'boolean');
      }
    }
  }
});

for (const { id, lesson, name } of ENTRIES) {
  test(`${name}: source 초기값의 독립 계산과 정답·자막의 모든 숫자 등식이 일치한다`, () => {
    const { lab } = f02Harness(); lab.go(id); Object.assign(lab.s, lesson.chapters[0].start);
    close(numberOf(lesson.answer), wanted(id, lesson.label, lab.s), name);
    assert.equal(lesson.answerText.endsWith(id !== 'lune13' && lesson.label === '둘레' ? ' cm' : ' cm²'), true);
    for (const ch of lesson.chapters) for (const cue of ch.cues) for (const [, tex] of (cue.say || '').matchAll(/\$([^$]+)\$/g)) {
      if (!tex.includes('=') || /r/.test(tex.replace(/\\(?:frac|times|div|pi)/g, ''))) continue;
      const expressions = tex.split('=').filter(Boolean), values = expressions.map(numberOf);
      values.forEach((value) => close(value, values[0], cue.say));
    }
  });

  test(`${name}: 진입·각 자막·끝·다시 보기에서 계산 공개와 도형 표시를 지킨다`, () => {
    const { lab } = f02Harness(); lab.go(id);
    Object.assign(lab.s, { lessonEntry: true, f02Calc: 3, f02Final: true, f02Dims: true, f02Split: true, [`f02_${id}_u`]: 1 });
    const entry = lab.draw();
    assert.equal(entry.view.chips.length, 0); assert.equal(entry.view.readouts.length, 0); assert.equal(entry.view.formula, '');
    assert.ok(!entry.texts.some((t) => /π|^r =|^\+ /.test(t)), '진입은 문제 그림·주어진 길이만');
    lab.go(id);
    const at = start(lab, lesson), cs = core.compileLesson(lesson), finalAt = cs.says.at(-1).at;
    const times = new Set([0, cs.length]);
    for (const say of cs.says) { times.add(say.at); if (say.at > 0) times.add(say.at - 0.01); }
    for (let t = 0; t < cs.length; t += 0.5) times.add(t);
    for (const time of [...times].sort((a, b) => a - b)) {
      const { draw } = at(time, true);
      assert.ok(draw.paths.length > 0, `${time}: 그림 명령 존재`);
      for (const item of draw.textItems) assert.ok(Number.isFinite(item.x) && Number.isFinite(item.y));
      assert.equal(draw.view.readouts.length, 0); assert.equal(draw.view.parts.length, 0); assert.equal(draw.view.formula, '');
      if (time < finalAt) {
        assert.equal(lab.s.f02Final, false, `${time}: 정답 flag`);
        const numericLabels = draw.texts.filter((t) => /^[+−]?\s*[\dπ]/.test(t) && !/cm|지름|r\s*=|²|×/.test(t));
        for (const text of numericLabels) {
          let v; try { v = numberOf(text); } catch { continue; }
          assert.ok(Math.abs(v - numberOf(lesson.answer)) > 1e-8, `${time}: 최종값 ${text} 선공개`);
        }
        for (const chip of draw.view.chips) for (const part of chip.tex.split('=')) {
          if (/\\times|\^/.test(part)) continue;
          assert.ok(Math.abs(numberOf(part) - numberOf(lesson.answer)) > 1e-8, `${time}: chip 최종값 선공개 ${part}`);
        }
      }
      if (!lab.s.f02Dims) assert.ok(!draw.texts.some((t) => /^r =/.test(t)), `${time}: 반지름 뜻 설명 전 보류`);
      if (lab.s.f02Calc === 0) assert.ok(!draw.texts.some((t) => /π/.test(t)), `${time}: 계산 전 수식·값 보류`);
      if (id === 'lune13' && !lab.s.f02Final) assert.ok(!draw.texts.includes('+ 6'), `${time}: 삼각형 넓이는 마지막까지 보류`);
    }
    const end = at(cs.length, true); assert.equal(lab.s.f02Final, true);
    assert.equal(end.draw.view.chips.length, 1); close(numberOf(end.draw.view.chips[0].tex), numberOf(lesson.answer), '마지막 칩');
    const replay = at(0, true); assert.equal(lab.s.f02Calc, 0); assert.equal(lab.s.f02Final, false); assert.equal(replay.draw.view.chips.length, 0);
  });
}

test('lune13: 세 반원 지름을 유지하고 반지름·조각 결과를 각각 설명한 뒤 공개한다', () => {
  const { lab } = f02Harness(); lab.go('lune13'); const at = start(lab, LESSONS.lune13);
  const initial = at(0, true).draw; for (const value of ['4 cm', '3 cm', 'BC = 5 cm']) assert.ok(initial.texts.includes(value), value);
  const split = at(12, true).draw; for (const value of ['지름 4 cm', '지름 3 cm', '지름 5 cm']) assert.ok(split.texts.includes(value), value);
  const radii = at(17, true).draw; for (const value of ['r = 2 cm', 'r = (3/2) cm', 'r = (5/2) cm']) assert.ok(radii.texts.includes(value), value);
  const ab = at(24, true).draw; assert.ok(ab.texts.includes('+ 2π')); assert.ok(!ab.texts.includes('+ 9π/8')); assert.ok(!ab.texts.includes('− 25π/8'));
  const ac = at(29, true).draw; assert.ok(ac.texts.includes('+ 9π/8')); assert.ok(!ac.texts.includes('− 25π/8'));
  const bc = at(38, true).draw; assert.ok(bc.texts.includes('− 25π/8')); assert.ok(!bc.texts.includes('+ 6'));
  const triangle = at(50, true).draw; assert.ok(triangle.texts.includes('4 cm') && triangle.texts.includes('3 cm')); assert.equal(triangle.view.chips.length, 0);
});

test('nc/ns: 작은 조각의 수를 바꿔도 둘레는 같고 넓이는 원본 공식에 맞게 달라진다', () => {
  for (const id of ['nc', 'ns']) {
    const { lab } = f02Harness(); const scene = lab.go(id);
    for (const R of [4, 6, 12]) for (const n of [2, 3, 4, 5]) {
      Object.assign(lab.s, { [`f02_${id}_R`]: R, [`f02_${id}_n`]: n });
      const answers = [...scene.problem.answer(lab.s).matchAll(/\$([^$]+)\$/g)].map((m) => m[1].split('\\text')[0]);
      close(numberOf(answers[0]), wanted(id, '둘레', lab.s), `${id}/${R}/${n} perimeter`);
      close(numberOf(answers[1]), wanted(id, '넓이', lab.s), `${id}/${R}/${n} area`);
      close(numberOf(answers[0]), (id === 'nc' ? 4 : 2) * Math.PI * R, '둘레의 n 독립성');
    }
  }
});

test('lune13: 원본의 모든 정수 직각삼각형에서 반원 상쇄와 삼각형 면적이 일치한다', () => {
  const { lab } = f02Harness(), scene = lab.go('lune13');
  for (const [p, q] of [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [9, 12], [12, 9]]) {
    Object.assign(lab.s, { f02_lune13_p: p, f02_lune13_q: q });
    const answer = scene.problem.answer(lab.s).match(/\$([^$]+)\$/)[1].split('\\text')[0];
    close(numberOf(answer), wanted('lune13', null, lab.s), `${p}/${q}`);
    const c = Math.hypot(p, q); assert.equal(Number.isInteger(c), true);
    close(Math.PI * p * p / 8 + Math.PI * q * q / 8, Math.PI * c * c / 8, '두 작은 반원 = 큰 반원');
  }
});

test('공유 링크의 다른 값에서 시작해도 각 해설은 교재 입력값으로 재생한다', () => {
  for (const { id, lesson } of ENTRIES) {
    const changed = id === 'lune13' ? 'f02_lune13_p=6&f02_lune13_q=8' : `f02_${id}_R=12&f02_${id}_n=4`;
    const { lab } = f02Harness(undefined, `#s=${id}&${changed}`); lab.go(id);
    const at = start(lab, lesson); at(0, true);
    for (const [key, value] of Object.entries(lesson.chapters[0].start)) assert.equal(lab.s[key], value, key);
    close(wanted(id, lesson.label, lab.s), numberOf(lesson.answer), id);
  }
});

test('새 해설 공개 키는 수동 탐구·정리·문제의 그림과 view에 영향을 주지 않는다', () => {
  for (const id of ['lune13', 'nc', 'ns']) for (const tab of ['explore', 'review', 'problem']) for (const step of [1, 2, 3, 4, 5, 6]) {
    const draws = [];
    for (const enabled of [false, true]) {
      const { lab } = f02Harness(); lab.go(id); lab.tab = tab;
      Object.assign(lab.s, { lessonOn: false, lessonEntry: false, step, f02uShow: 1, [`f02_${id}_u`]: 1, f02Read: enabled, f02Dims: enabled, f02Calc: enabled ? 3 : 0, f02Final: enabled, f02Split: enabled });
      const draw = lab.draw(); draws.push({ commands: draw.commands, view: draw.view });
    }
    assert.deepEqual(draws[0], draws[1], `${id}/${tab}/${step}`);
  }
});

test('lune13: 마지막 장의 첫 draw부터 삼각형의4·3조건이 보이고 정답6은 아직 숨긴다', () => {
  const { lab } = f02Harness(); lab.go('lune13');
  const at = start(lab, LESSONS.lune13);
  at(47, true);
  assert.equal(lab.s.f02uShow, 1, '직전 장에서는 세 반원과 삼각형을 모두 떼어 놓은 상태');
  const firstFrame = at(50, false).draw; // 애니메이션을 안정화하지 않고 실제 첫 draw만 검사합니다.
  for (const value of ['4 cm', '3 cm', 'BC = 5 cm']) assert.ok(firstFrame.texts.includes(value), '첫 계산 자막의 주어진 길이: ' + value);
  assert.equal(lab.s.f02Final, false);
  assert.ok(!firstFrame.texts.includes('+ 6'));
  assert.ok(!firstFrame.texts.includes('6'));
  assert.deepEqual(firstFrame.view.chips, []);
  assert.deepEqual(firstFrame.view.readouts, []);
});

test('nc/ns: 해설 질문은 원본 문제의 고정 조건에 맞고 수동 질문은 보존한다', () => {
  for (const id of ['nc', 'ns']) {
    const { lab } = f02Harness(); const scene = lab.go(id);
    const shape = id === 'nc' ? '원' : '반원';
    const manual = `큰 ${shape}의 지름을 n등분해 작은 ${shape} n개를 빼면, 둘레는 n이 바뀌어도 변할까요?`;
    for (const [R, n] of [[6, 3], [10, 5]]) {
      Object.assign(lab.s, { [`f02_${id}_R`]: R, [`f02_${id}_n`]: n, lessonOn: false, lessonEntry: false });
      assert.equal(scene.question(lab.s), manual, id + ': 수동 탐구 질문 보존');
      const problem = scene.problem.text(lab.s);
      const originalStem = problem.slice(0, problem.indexOf('</div>') + 6).replace(/<[^>]*>/g, '').trim();
      for (const flags of [{ lessonEntry: true, lessonOn: false }, { lessonEntry: false, lessonOn: true }]) {
        Object.assign(lab.s, flags);
        const question = scene.question(lab.s);
        assert.equal(question, originalStem, id + ': 실제 문제 문장에 결속');
        assert.ok(question.includes(`${R} cm`) && question.includes(`${n}등분`), '현재 수학 조건 보존');
        assert.match(question, /둘레의 길이와 넓이를 각각 구하시오/);
        assert.doesNotMatch(question, /정답|π|n이 바뀌어도/);
      }
      Object.assign(lab.s, { lessonEntry: false, lessonOn: false });
      assert.equal(scene.question(lab.s), manual, '직접 해 보기 복귀');
    }
  }
});

test('ns 빠른 풀이: 반원 전체 둘레와 호를 구별하고 원의 둘레 문구는 보존한다', () => {
  for (const id of ['ns', 'nc']) {
    const { lab } = f02Harness(); const scene = lab.go(id);
    for (const R of [4, 6, 12]) for (const n of [2, 3, 4, 5]) {
      Object.assign(lab.s, { [`f02_${id}_R`]: R, [`f02_${id}_n`]: n });
      const quick = scene.solution.quick(lab.s).steps, r = R / n;
      if (id === 'ns') {
        assert.ok(quick.startsWith(`작은 반원 ${n}개의 호의 길이의 합 = 큰 반원 하나의 호의 길이.`));
        assert.ok(!quick.includes(`작은 반원 ${n}개의 둘레`));
        const smallArcSum = Array.from({ length: n }, () => Math.PI * r).reduce((a, b) => a + b, 0);
        const smallFullPerimeterSum = Array.from({ length: n }, () => Math.PI * r + 2 * r).reduce((a, b) => a + b, 0);
        const bigArc = Math.PI * R;
        close(smallArcSum, bigArc, '같은 것은 작은 반원의 호 길이 합과 큰 반원의 호');
        close(smallFullPerimeterSum - smallArcSum, 2 * R, '반원 전체 둘레에는 지름의 합만큼 더 들어 있음');
        assert.ok(smallFullPerimeterSum > bigArc, '전체 둘레를 큰 호와 같다고 쓰면 오류');
        const result = quick.match(/곧 ([^ ]+) cm예요/)[1];
        close(numberOf(result), bigArc + smallArcSum, '색칠한 부분의 경계는 두 종류의 호 합');
      } else {
        assert.ok(quick.startsWith(`작은 원 ${n}개의 둘레의 합 = 큰 원 하나의 둘레.`));
        close(n * 2 * Math.PI * r, 2 * Math.PI * R, '원일 때는 전체 둘레끼리 같음');
      }
    }
  }
});
