// 원과 부채꼴(g7-circle-sector) 해설(lesson) 검사 — node --test, 브라우저 불필요
// 실행: node --test apmath/playground/next/tools/lessons.g7-circle-sector.test.mjs
// 이 파일이 검사하는 것(해설마다):
//   1) 형식: kit/apl-video-core.js validateLessonSet/validateLesson (장 수·장별 쇼츠 규칙·경고 없음·set/to 시작값·label)
//   2) 상태값: 해설이 쓰는 상태값 이름·범위가 SCENE_STATE 표와 같고, tab:'review' 는 정리 탭이 같은 문제를 그리는 장면(REVIEW_OK)에만
//   3) 자막의 모든 숫자가 장면 공식으로 다시 계산한 값(FACTS)이다 — 새 수학 주장 금지
//   4) 정답은 마지막 장의 마지막 자막에서만 나온다(조기 노출 금지)
//   5) 장면 소스: 해설 전용 그림·정답 아끼기가 재생 중(s.lessonOn)에만 작동한다
// 새 해설을 더할 때는 SCENE_STATE · FACTS(· 정리 탭이면 REVIEW_OK)에 그 해설의 값을 함께 적습니다.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');
const DIR = path.dirname(fileURLToPath(import.meta.url));
const labsDir = path.resolve(DIR, '../labs');
const SCENE_DIR = path.join(labsDir, 'g7-circle-sector');
const read = (f) => fs.readFileSync(path.join(SCENE_DIR, f), 'utf8');
const html = fs.readFileSync(SCENE_DIR + '.html', 'utf8');

function loadAll(files) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  for (const f of files) vm.runInContext(read(f), sandbox, { filename: f });
  return sandbox.window;
}
const LESSONS = (loadAll(['lesson.js']).APL_LESSONS || {})['g7-circle-sector'] || {};
const VIDEOS = (loadAll(['video.js']).APL_VIDEOS || {})['g7-circle-sector'] || {};

/* 해설이 쓰는 상태값 이름과 범위(null = 범위 검사 없음: 문자·표시 값). */
const SCENE_STATE = {
  'z3-sectorProof': { csR: [2, 12], csS: [30, 180], csT: [0, 100], csShowS: null },
  'z3-circleProof': { csR: [2, 12], csN: null, csT: [0, 100], csShowS: null },
  // basic.js build(): 'b'+id+'_'+키. sectorSpec 의 r 3~12 · th 10~350, 해설 전용 상태값 div(0~1)·ref(0 없음 · 1 원주 · 2 원의 넓이)
  '1209': { b1209_r: [3, 12], b1209_th: [10, 350], b1209_div: [0, 1], b1209_ref: [0, 2] },
  // f04.js makeScene(): PFX 'f4'+'_'+id+'_'+키. R 4~10, t 0~1, 해설이 켜는 show(결과 라벨·캡션·칩을 아끼는 표시)
  'f4-swirl': { f4_swirl_R: [4, 10], f4_swirl_t: [0, 1], f4_swirl_show: null },
  // f01.js makeScene(): PFX 'f1'. a 4~12, t 0~1, mode 0 넓이 · 1 둘레, 해설이 켜는 show
  'f1-ss2': { f1_ss2_a: [4, 12], f1_ss2_t: [0, 1], f1_ss2_mode: [0, 1], f1_ss2_show: null },
  // f03.js: s.f3a 한 변 2~12 · s.f3t 0~1, 해설이 켜는 f3Show
  'f3-leaf-len': { f3a: [2, 12], f3t: [0, 1], f3Show: null },
  // f05.js: s.f5A 반지름 2~8 · s.f5T 0~1 (이 장면은 숨길 정답이 그림에 없어 show 값이 없음)
  'f5-sq4': { f5A: [2, 8], f5T: [0, 1] },
  // rolling.js: s.rlT 0~1(회전이 k/3 에서 90° 로 끝남), 해설이 켜는 rlShow
  'rl-rect': { rlT: [0, 1], rlShow: null },
  // swept.js: gtQ 개집 한 변 1~6 · gtL 끈 1~16 · gtT 0~1, 해설이 켜는 gtShow
  'gt-kennel': { gtQ: [1, 6], gtL: [1, 16], gtT: [0, 1], gtShow: null },
  // basic.js build() 의 1102(u 0.5~2.5 · t1 10~60 · t2 10~80 · y 20~120)와 1609(sectorSpec)
  '1102': { b1102_u: [0.5, 2.5], b1102_t1: [10, 60], b1102_t2: [10, 80], b1102_y: [20, 120] },
  '1609': { b1609_r: [3, 12], b1609_th: [10, 350], b1609_div: [0, 1], b1609_ref: [0, 2] }
};

// 정리 탭(tab:'review')은 정리 탭이 같은 문제를 그리고 구하는 값을 단계별로만 보여 주는 것을 확인한 장면에만 켭니다.
const REVIEW_OK = new Set(['1209', '1102', '1609']);

/* 자막이 말하는 숫자를 장면 공식으로 다시 계산한 값. 해설마다 허용 숫자 집합(자막에 나오는 모든 숫자는 여기에 있어야 함)과 계산 근거를 적습니다. */
const FACTS = {
  'z3-sectorProof': () => { const r = 6, th = 120; return { allowed: [r, th, 12, (r * th) / 180, (r * th) / 360, (r * r * th) / 360, 1, 2], note: 'r=6 θ=120 조각 12 l=4π 가로 2π S=12π' }; },
  'f3-leaf-len': () => {
    const a = 6, arc = (a * 90) / 180, tot = 2 * arc; // 호 하나 = 2π·a·90/360 = (a/2)π, 둘 = aπ
    assert.deepEqual([arc, tot], [3, 6]);
    return { allowed: [a, 90, 180, 360, 2, arc, tot], note: 'a=6 · 90°+90°=180° · 호 하나 3π · 둘레 3π+3π=6π' };
  },
  'f5-sq4': () => {
    const r = 3, straight = 2 * r, n = 4, line = straight * n, deg = 90 * n, circ = 2 * r; // 직선 부분 6×4, 중심각의 합 360°, 원 하나 2π·3 = 6π
    assert.deepEqual([line, deg, circ], [24, 360, 6]);
    return { allowed: [r, straight, n, line, 90, deg, 2, circ], note: 'r=3 직선 6×4=24 · 90°×4=360° · 원 하나 2π×3=6π · 끈 24+6π' };
  },
  'rl-rect': () => {
    const w = 3, h = 4, d = Math.hypot(w, h), arcs = [w / 2, d / 2, h / 2], sum = arcs.reduce((x, y) => x + y, 0); // 반지름 r 인 90° 호 = (r/2)π
    assert.deepEqual([d, ...arcs, sum], [5, 1.5, 2.5, 2, 6]);
    return { allowed: [w, h, d, 90, 2, 3, 5, sum], note: 'AB=3 AD=4 BD=5 · 호 3π/2, 5π/2, 2π · 합 6π' };
  },
  'gt-kennel': () => {
    const Q = 2, L = 4, big = (L * L * 270) / 360, small = (Q * Q * 90) / 360, area = big + 2 * small; // π 의 계수
    assert.deepEqual([big, small, area], [12, 1, 14]);
    return { allowed: [Q, L, 270, 90, big, small, area], note: '개집 2 · 끈 4 · 큰 부채꼴 12π(r=4,270°) · 작은 부채꼴 π 둘 · 14π' };
  },
  '1102': () => {
    const t1 = 30, t2 = 45, arc1 = 6, arc3 = 15, x = (arc1 * t2) / t1, y = (t1 * arc3) / arc1; // 호 : 호 = 중심각 : 중심각
    assert.deepEqual([x, y, x + y], [9, 75, 84]);
    return { allowed: [t1, t2, arc1, arc3, x, y, x + y], note: '6:x=30:45 → 9 · 6:15=30:y → 75 · x+y=84' };
  },
  '1609': () => {
    const r = 9, S = 27, circle = r * r, k = circle / S; // 넓이의 π 계수
    assert.deepEqual([circle, circle / S, 360 / k], [81, 3, 120]);
    return { allowed: [r, 2, S, circle, 1, 3, 360, 120], note: 'r=9 · 27π÷81π=1/3 · 360°×1/3=120°' };
  },
  'z3-circleProof': () => {
    const r = 6, N = 16, circ = 2 * r, half = r, S = r * r; // π 의 계수
    assert.deepEqual([circ, half, S], [12, 6, 36]);
    return { allowed: [r, N, circ, half, S, 1, 2], note: 'r=6 조각 16 원주 12π 가로 6π(=πr) 세로 6 S=36π' };
  },
  '1209': (lesson) => {
    const r = 12, th = 120, k = 360 / th, circ = 2 * r, area = r * r, l = circ / k, S = area / k; // π 의 계수
    assert.deepEqual([k, circ, area, l, S], [3, 24, 144, 8, 48]);
    assert.equal((r * th) / 180, l, '호 = (rθ/180)π');
    assert.equal((r * r * th) / 360, S, '넓이 = (r²θ/360)π');
    const common = [r, th, k, 360, 1], arcOnly = [circ, l, 2], areaOnly = [area, S, 2];
    return { allowed: [...common, ...(lesson.label === '호의 길이' ? arcOnly : areaOnly)], note: 'r=12 θ=120 360÷120=3 / 원주 24π 호 8π / 원의 넓이 144π 넓이 48π' };
  },
  'f4-swirl': () => {
    const R = 6, r = R / 2, S = (R * R) / 2; // 큰 반원의 넓이 ½πR²
    assert.deepEqual([r, S], [3, 18]);
    return { allowed: [R, r, 180, 1, 2, S], note: 'R=6 r=3 180° ½×π×6²=18π' };
  },
  'f1-ss2': () => {
    const a = 6, whole = (a * a * 90) / 360, rr = a / 2, part = (rr * rr) / 2, res = whole - part; // π 의 계수
    assert.deepEqual([whole, rr, part, res], [9, 3, 4.5, 4.5]);
    return { allowed: [a, 90, 360, whole, rr, 1, 2], note: 'a=6 부채꼴 9π · 반원 반지름 3 · 넓이 9π/2(분자 9, 분모 2)' };
  }
};

const plainText = (say) => String(say).replace(/\\frac\{?(\d+)\}?\{?(\d+)\}?/g, '$1/$2').replace(/\*\*/g, '');
const numbersOf = (say) => (plainText(say).match(/\d+(?:\.\d+)?/g) || []).map(Number);
const sayList = (lesson) => lesson.chapters.map((ch) => ch.cues.filter((c) => c.say).map((c) => c.say));

const entries = Object.entries(LESSONS).flatMap(([id, v]) => core.lessonList(v).map((lesson, k) => ({ id, k, lesson, list: core.lessonList(v) })));

test('해설 파일이 있고 모든 해설 장면이 SCENE_STATE·FACTS 표에 있다', () => {
  assert.ok(entries.length >= 1);
  for (const { id } of entries) { assert.ok(SCENE_STATE[id], `${id}: SCENE_STATE`); assert.ok(FACTS[id], `${id}: FACTS`); }
});

test('해설과 영상 대본이 같은 장면에 겹치지 않는다(해설이 영상의 상위 형태라 입구가 둘이면 혼란)', () => {
  for (const id of Object.keys(LESSONS)) assert.ok(!Object.hasOwn(VIDEOS, id), `${id}: 해설로 대체한 영상 대본은 지웁니다`);
});

for (const id of new Set(entries.map((e) => e.id))) {
  test(`해설 묶음 ${id}: 해설 1~3개, 둘 이상이면 label(6자 이하·겹침 없음)·set 키 공통`, () => {
    const v = core.validateLessonSet(LESSONS[id]);
    assert.deepEqual(v.errors, [], v.errors.join('\n'));
  });
}

for (const { id, k, lesson, list } of entries) {
  const name = `${id}${list.length > 1 ? `[${lesson.label}]` : ''}`;
  test(`해설 ${name}: 형식(장 2~6 · 장마다 8~15초 · 자막 2~3줄 · 경고 없음)`, () => {
    const v = core.validateLesson(lesson);
    assert.deepEqual(v.errors, [], v.errors.join('\n'));
    assert.deepEqual(v.warnings, [], v.warnings.join('\n'));
    assert.ok(lesson.answer, '문항형 해설은 answer 를 적어 조기 노출 검사를 받습니다');
    lesson.chapters.forEach((ch, i) => assert.ok(ch.length >= 8 && ch.length <= 15, `chapters[${i}] ${ch.length}초`));
  });

  test(`해설 ${name}: 상태값 이름·범위가 SCENE_STATE 표와 같다`, () => {
    const known = SCENE_STATE[id], seen = [];
    lesson.chapters.forEach((ch, i) => {
      Object.entries(ch.start || {}).forEach(([key, v]) => seen.push([`chapters[${i}].start`, key, v]));
      ch.cues.forEach((c, j) => {
        Object.entries(c.to || {}).forEach(([key, v]) => seen.push([`chapters[${i}].cues[${j}].to`, key, v]));
        Object.entries(c.set || {}).forEach(([key, v]) => seen.push([`chapters[${i}].cues[${j}].set`, key, v]));
      });
    });
    for (const [where, key, v] of seen) {
      assert.ok(Object.hasOwn(known, key), `${where}.${key} 은 장면 ${id} 의 상태값이 아닙니다`);
      const r = known[key];
      if (r && typeof v === 'number') assert.ok(Number.isFinite(v) && v >= r[0] && v <= r[1], `${where}.${key}=${v} 이 범위 ${r[0]}~${r[1]} 밖`);
    }
  });

  test(`해설 ${name}: 자막의 모든 숫자가 장면 공식으로 다시 계산한 값이다`, () => {
    const f = FACTS[id](lesson, k);
    const allowed = new Set(f.allowed);
    for (const s of sayList(lesson).flat()) numbersOf(s).forEach((n) => assert.ok(allowed.has(n), `자막 「${s}」 의 숫자 ${n} 은 허용 집합(${f.note})에 없습니다`));
  });

  test(`해설 ${name}: 정답은 마지막 장의 마지막 자막에서만 나온다`, () => {
    const ans = core.normAnswer(lesson.answer), says = sayList(lesson);
    assert.ok(!core.normAnswer(lesson.title).includes(ans), '해설 제목에 정답');
    lesson.chapters.forEach((ch, i) => {
      if (i < lesson.chapters.length - 1) assert.ok(!core.normAnswer(ch.title).includes(ans), `chapters[${i}] 제목에 정답`);
      says[i].forEach((s, j) => { if (!(i === says.length - 1 && j === says[i].length - 1)) assert.ok(!core.normAnswer(s).includes(ans), `정답이 마지막 자막보다 먼저 나옴: ${s}`); });
    });
    assert.ok(core.normAnswer(says.at(-1).at(-1)).includes(ans), '마지막 자막이 결론(정답)');
  });

  test(`해설 ${name}: 이어 붙인 시간 계산이 닫히고 끝 값이 마지막 목표값과 같다`, () => {
    const cs = core.compileLesson(lesson);
    const base = { nums: { ...(lesson.chapters[0].start || {}) }, sets: {}, step: 0, part: null };
    assert.equal(cs.length, lesson.chapters.reduce((a, ch) => a + ch.length, 0));
    for (let t = 0; t <= cs.length + 1e-9; t += 0.25) Object.values(core.stateAt(cs, Math.min(t, cs.length), base).nums).forEach((v) => assert.ok(Number.isFinite(v)));
    const end = core.stateAt(cs, cs.length, base), want = {};
    lesson.chapters.forEach((ch) => { Object.assign(want, ch.start || {}); ch.cues.forEach((c) => Object.assign(want, c.to || {})); });
    Object.entries(want).forEach(([key, v]) => assert.ok(Math.abs(end.nums[key] - v) < 1e-9, `${key} 끝 값`));
  });
}

test('tab:review 는 정리 탭이 같은 문제를 그리는 장면(REVIEW_OK)에만 쓴다', () => {
  for (const { id, lesson } of entries) assert.equal(lesson.tab === 'review', REVIEW_OK.has(id), `${id}: tab 은 REVIEW_OK 장면에만`);
});

test('z3-sectorProof·z3-circleProof: 결론 라벨은 해설이 csShowS 를 켤 때까지 아끼고(장면 소스), 결론 자막과 함께 켠다', () => {
  assert.match(html, /if \(!\(st\.lessonOn && !st\.csShowS\)\) T\(b, \{ x: xc, y: Yb \}/, 'S 라벨 표시 조건');
  for (const id of ['z3-sectorProof', 'z3-circleProof']) {
    const lesson = core.lessonList(LESSONS[id])[0];
    assert.equal(lesson.chapters[0].cues[0].set.csShowS, false, `${id}: 첫 장 at:0 에서 csShowS=false`);
    const last = lesson.chapters.at(-1).cues;
    assert.ok(last.some((c) => c.set && c.set.csShowS === true && c.say && core.normAnswer(c.say).includes(core.normAnswer(lesson.answer))), `${id}: 결론 자막과 함께 csShowS`);
    assert.ok(lesson.chapters.slice(0, -1).every((ch) => ch.cues.every((c) => !(c.set && c.set.csShowS === true))), `${id}: 앞 장은 csShowS 를 켜지 않는다`);
  }
});

test('z3-circleProof: 장면 소스의 조각 수 기본값 16 · 반지름 6 · 라벨이 csT 55 부터', () => {
  assert.match(html, /'z3-circleProof': \{ csR: 6, csN: 16, csT: 0 \}/);
  assert.match(html, /st\.csT >= 55/);
  assert.match(html, /가로 → πr =/);
});

test('장면 소스: 해설 전용 그림·정답 아끼기는 재생 중(lessonOn)에만 작동한다(탐구·정리·문제 화면은 그대로)', () => {
  const basic = read('basic.js'), f01 = read('f01.js'), f04 = read('f04.js');
  // basic.js sectorSpec: div·ref 는 q.lessonOn 안에서만 그리고, 해설 전용 상태값 기본값은 0
  assert.match(basic, /state: \{ div: 0, ref: 0 \}/);
  assert.match(basic, /if \(q\.lessonOn\) \{\s*\n\s*const u = gcd\(Math\.round\(th\), 360\)/, 'div·ref 그림은 q.lessonOn 일 때만');
  assert.match(basic, /o\.chipsF && !\(q\.lessonOn && step < 1\)/, '해설 재생 중 step 0 에서는 정답 칩을 아낌');
  // f01·f04: lessonHold = 재생 중이면서 해설이 show 를 켜기 전
  for (const [name, src] of [['f01', f01], ['f04', f04]]) {
    assert.match(src, /lessonHold: !!\(s\.lessonOn && !s\[K\('show'\)\]\)/, `${name}: lessonHold`);
    assert.match(src, /w === 'r' \? \(c\.lessonHold \? 0 : seg01\(c\.res, 0\.2, 0\.8\)\) : 1\)/, `${name}: 결과 라벨은 hold 동안 0`);
    assert.match(src, /c\.res > 0\.5 && !c\.lessonHold/, `${name}: 결과 칩`);
    assert.match(src, /c\.lessonHold \? 0 : seg01\(res, 0\.5, 1\)/, `${name}: 결과 캡션`);
  }
  // f03·rolling·swept 의 같은 장치: 해설 재생 중에만 정답을 아끼는 hold
  assert.match(read('f03.js'), /hold: !thumb && !!\(s\.lessonOn && !s\.f3Show\)/, 'f03 hold');
  assert.match(read('f03.js'), /if \(!C\.hold\) tx\(b, C, m, piP\(M\.arc\)/, 'f03 정답 줄');
  assert.match(read('rolling.js'), /const hold = !!\(s\.lessonOn && !s\.rlShow\)/, 'rolling hold');
  assert.match(read('rolling.js'), /allDone && !hold/, 'rolling 띠 제목');
  assert.match(read('swept.js'), /const hold = !!\(s\.lessonOn && !s\.gtShow\)/, 'swept hold');
  assert.match(read('swept.js'), /done && !hold/, 'swept 칩·요약');
  // basic.js: 해설 진입 화면(lessonEntry)은 정리 탭 0단계 그림으로(구하는 값 「?」), 일반 화면은 그대로
  assert.match(basic, /const entry = mode0 === 'explore' && !!s\.lessonEntry;/, 'basic 진입 화면');
  assert.match(f04, /hideRes: true/, 'f4-swirl: 결과가 나오면 r=3 라벨을 지우는 표시(재생 중에만)');
  assert.match(f04, /c\.s && c\.s\.lessonOn && it\.hideRes/, 'hideRes 는 재생 중에만');
  // 해설이 이 표시를 쓰는 규칙: show 는 첫 장 at:0 에서 false, 결론 자막에서 true
  for (const [id, key] of [['f4-swirl', 'f4_swirl_show'], ['f1-ss2', 'f1_ss2_show'], ['f3-leaf-len', 'f3Show'], ['rl-rect', 'rlShow'], ['gt-kennel', 'gtShow']]) {
    const lesson = core.lessonList(LESSONS[id])[0];
    assert.equal(lesson.chapters[0].cues[0].set[key], false, `${id}: 첫 장 at:0 에서 ${key}=false`);
    const last = lesson.chapters.at(-1).cues.at(-1);
    assert.equal(last.set[key], true, `${id}: 마지막 자막과 함께 ${key}=true`);
  }
});

test('SCENE_STATE 표가 장면 소스의 상태값 이름·범위와 같다', () => {
  const basic = read('basic.js'), f01 = read('f01.js'), f03 = read('f03.js'), f04 = read('f04.js'), f05 = read('f05.js'), rolling = read('rolling.js'), swept = read('swept.js');
  // basic.js: 상태값 접두어 'b'+id, sectorSpec 의 r 3~12 · th 10~350, 1102 의 u·t1·t2·y 범위
  assert.match(basic, /const pre = 'b' \+ spec\.id \+ '_';/);
  assert.match(basic, /r: \{ value: o\.def\.r, min: 3, max: 12/);
  assert.match(basic, /thMin = o\.thMin \|\| 10, thMax = o\.thMax \|\| 350/);
  for (const id of ['1209', '1609', '1102']) assert.match(basic, new RegExp(`id: '${id}'`), `basic.js 에 ${id}`);
  const s1102 = basic.slice(basic.indexOf("id: '1102'"), basic.indexOf("id: '1103'"));
  for (const re of [/u: \{ value: 1, min: 0\.5, max: 2\.5/, /t1: \{ value: 30, min: 10, max: 60/, /t2: \{ value: 45, min: 10, max: 80/, /y: \{ value: 75, min: 20, max: 120/]) assert.match(s1102, re);
  // f01(PFX f1) ss2: a 4~12 · t 0~1 · mode / f04(PFX f4) swirl: R 4~10
  assert.match(f01, /const PFX = 'f1'/);
  assert.match(f01.slice(f01.indexOf("id: 'ss2'"), f01.indexOf("id: 'ss2'") + 600), /k: 'a'[^}]*min: 4, max: 12/);
  assert.match(f01, /PARAMS\[kt\] = \{ value: 0, min: 0, max: 1/);
  assert.match(f04, /const PFX = 'f4'/);
  assert.match(f04.slice(f04.indexOf("id: 'swirl'"), f04.indexOf("id: 'swirl'") + 600), /k: 'R'[^}]*min: 4, max: 10/);
  assert.match(f04, /PARAMS\[kt\] = \{ value: 0, min: 0, max: 1/);
  // f03 leaf-len: f3a 2~12 · f3t 0~1 / f05 sq4: f5A 2~8 · f5T 0~1 / rolling rl-rect: rlT 0~1 / swept gt-kennel: gtQ 1~6 · gtL 1~16 · gtT 0~1
  assert.match(f03, /id: 'f3-leaf-len'/);
  assert.match(f03, /f3a: \{ value: 6, min: 2, max: 12/);
  assert.match(f03, /const PARAM_T = \{\s*value: 0, min: 0, max: 1/);
  assert.match(f05, /id: 'f5-sq4'/);
  assert.match(f05, /f5A: \{ label: '반지름 r', min: 2, max: 8, step: 1, value: A\.r0/);
  assert.match(f05, /id: 'f5-sq4'[^\n]*r0: 3/);
  assert.match(f05, /const DEF_T = \{ value: 0, min: 0, max: 1/);
  assert.match(rolling, /id: 'rl-rect'/);
  assert.match(rolling, /rlT: \{\s*value: 0, min: 0, max: 1/);
  assert.match(swept, /id: 'gt-kennel'/);
  assert.match(swept, /gtT: \{ value: 0, min: 0, max: 1/);
  assert.match(swept, /gtQ: \{ value: 2, min: 1, max: 6/);
  assert.match(swept, /gtL: \{ value: 5, min: 1, max: 16/);
});
