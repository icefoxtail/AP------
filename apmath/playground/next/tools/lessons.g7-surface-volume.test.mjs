// 겉넓이·부피(g7-surface-volume) 해설 검사 (node --test, 브라우저 불필요)
// labs/g7-surface-volume/lesson-more.js 의 해설을 kit/apl-video-core.js 로 검사하고,
//  · 상태값 이름·값 범위가 장면 소스(t1~t9.js)와 같은지
//  · 자막의 모든 숫자가 장면 공식으로 다시 계산한 값인지
//  · 정답이 마지막 장보다 먼저 나오지 않는지(검사기) + 결과를 미리 그리는 그림 쪽이 s.lessonOn / svShowV 로 막혀 있는지(소스 확인)
// 를 확인합니다. sv1-1 해설의 검사는 tools/video.test.mjs 에 있습니다.
// 실행: node --test apmath/playground/next/tools/lessons.*.test.mjs
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
const labDir = path.resolve(DIR, '../labs/g7-surface-volume');
const src = (f) => fs.readFileSync(path.join(labDir, f), 'utf8');

function loadMore() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src('lesson.js'), sandbox, { filename: 'lesson.js' });
  const base = new Set(Object.keys(sandbox.window.APL_LESSONS['g7-surface-volume']));
  vm.runInContext(src('lesson-more.js'), sandbox, { filename: 'lesson-more.js' });
  const all = sandbox.window.APL_LESSONS['g7-surface-volume'];
  return Object.fromEntries(Object.entries(all).filter(([id]) => !base.has(id)));
}
const lessons = loadMore();

// 장면이 lab.s 에 등록하는 상태값(이름: [최소, 최대] 또는 null=숫자 아님). 소스(init·P(...) 범위)와 어긋나면 아래 「소스 확인」 테스트가 실패합니다.
const COMMON = { svYaw: [-180, 180], svPitch: [-30, 85], svShowV: null };
const SCENE_STATE = {
  'sv1-4': { sA: [2, 15], sB: [2, 15], sH: [2, 20], sT4: [0, 1], svShape: null },
  'sv3-1': { s6R: [1, 15], s6T: [0, 1] },
  'sv2-2': { s2r: [2, 15], s2G: [3, 17], s2U: [0, 1] },
  'sv4-1': { s41K: [1, 3], s41T: [0, 1], svTri: null, svAxis: null, svMode: null },
  'sv2-5': { s5A: [4, 24], s5B: [1, 23], s5T: [0, 1], svKind5: null, svMode: null },
  'sv2-3': { s3K: [1, 5], s3U: [0, 1], svTri: null, svMode: null, sv23Started: null },
  'sv2-4': { s4K: [2, 5], s4J: [1, 4], s4T: [0, 1], svTri4: null, svMode: null }
};
// 장면 소스에서 확인할 상태값 정의(파일, 정규식) — 이름이 장면에 실제로 있는지
const SOURCE_KEYS = {
  'sv1-4': ['t1.js', ['sA:', 'sB:', 'sH:', 'sT4:']],
  'sv3-1': ['t3.js', ['s6R:', 's6T:']],
  'sv2-2': ['t2.js', ['s2r:', 's2G:', 's2U:']],
  'sv4-1': ['t4.js', ['s41K:', 's41T:', "s.svTri = 'A'", "s.svAxis = 'long'"]],
  'sv2-5': ['t2.js', ['s5A:', 's5B:', 's5T:', "s.svKind5 = 'frus'"]],
  'sv2-3': ['t2.js', ['s3K:', 's3U:', "s.svTri = 'A'; s.s3K = 1; s.svMode = 'surf'; s.sv23Started = false"]],
  'sv2-4': ['t2.js', ['s4K:', 's4J:', 's4T:', "s.svTri4 = 'A'; s.s4K = 2; s.s4J = 1"]]
};
// 정리 탭 풀이 단계 수(장면의 steps 길이): 해설의 step 은 1~이 값
const STEP_COUNT = { 'sv1-4': 3, 'sv3-1': 3, 'sv2-2': 3, 'sv4-1:겉넓이': 3, 'sv4-1:부피': 3, 'sv2-5:겉넓이': 3, 'sv2-3:겉넓이': 3, 'sv2-3:부피': 3, 'sv2-4:겉넓이': 4 };

const plainText = (say) => String(say).replace(/\\frac(\d)(\d)/g, '$1/$2').replace(/\*\*/g, '');
const numbersOf = (say) => (plainText(say).match(/\d+(?:\.\d+)?/g) || []).map(Number);
const chapterCues = (lesson) => lesson.chapters.flatMap((ch) => ch.cues);
const sayList = (lesson) => lesson.chapters.map((ch) => ch.cues.filter((c) => c.say).map((c) => c.say));
const norm = (s) => String(s).replace(/\s+/g, '');

const all = Object.entries(lessons).flatMap(([id, v]) => core.lessonList(v).map((l) => [id, l]));

test('해설이 하나 이상 있고 묶음 검사(label 중복·상태값 시작값)가 통과한다', () => {
  assert.ok(all.length >= 1);
  for (const [id, v] of Object.entries(lessons)) assert.deepEqual(core.validateLessonSet(v).errors, [], `${id}: 해설 묶음`);
});

for (const [id, lesson] of all) {
  const name = `${id}${lesson.label ? ':' + lesson.label : ''}`;

  test(`해설 ${name}: 형식(장 수·장별 쇼츠 규칙·경고 없음)과 정답 조기 노출 없음`, () => {
    const v = core.validateLesson(lesson);
    assert.deepEqual(v.errors, [], v.errors.join('\n'));
    assert.deepEqual(v.warnings, [], v.warnings.join('\n'));
    assert.ok(lesson.chapters.length >= 2 && lesson.chapters.length <= 4, '장 2~4개');
    lesson.chapters.forEach((ch, i) => assert.ok(ch.length >= 8 && ch.length <= 15, `chapters[${i}] ${ch.length}초`));
    assert.ok(lesson.answer && lesson.answerText && lesson.summary && lesson.task);
    assert.equal(lesson.tab, 'review');
    // 결과를 그림이 미리 그리지 않도록 해설이 첫 장 at:0 에서 svShowV 를 끄고 마지막 장 결론 자막에서만 켠다
    const cues = chapterCues(lesson), shows = cues.filter((c) => c.set && 'svShowV' in c.set);
    assert.equal(shows[0].set.svShowV, false, 'svShowV 는 false 로 시작');
    assert.equal(shows[0].at, 0, '시작값은 첫 장 at:0 칸');
    assert.ok(lesson.chapters[0].cues.includes(shows[0]), '시작값은 첫 장에');
    const on = shows.filter((c) => c.set.svShowV === true);
    assert.equal(on.length, 1, 'svShowV 를 켜는 칸은 하나');
    assert.ok(lesson.chapters.at(-1).cues.includes(on[0]), '결과는 마지막 장에서만 켠다');
    const ans = norm(lesson.answer.replace(/\$/g, ''));
    assert.ok(lesson.chapters.at(-1).cues.some((c) => c.say && norm(c.say).includes(ans)), '정답은 마지막 장 자막에');
  });

  test(`해설 ${name}: 상태값 이름·값 범위·정리 탭 단계가 장면과 같다`, () => {
    const key = SCENE_STATE[id];
    assert.ok(key, `${id}: SCENE_STATE 표`);
    const known = { ...COMMON, ...key };
    const seen = [];
    lesson.chapters.forEach((ch, i) => {
      Object.entries(ch.start || {}).forEach(([k, v]) => seen.push([`chapters[${i}].start`, k, v]));
      ch.cues.forEach((c, j) => {
        Object.entries(c.to || {}).forEach(([k, v]) => seen.push([`chapters[${i}].cues[${j}].to`, k, v]));
        Object.entries(c.set || {}).forEach(([k, v]) => seen.push([`chapters[${i}].cues[${j}].set`, k, v]));
        if (c.step !== undefined) assert.ok(c.step >= 1 && c.step <= (STEP_COUNT[`${id}:${lesson.label}`] || STEP_COUNT[id]), `chapters[${i}].cues[${j}].step ${c.step} 이 장면 단계 수 밖`);
      });
    });
    for (const [where, k, v] of seen) {
      assert.ok(Object.hasOwn(known, k), `${where}.${k} 은 장면 ${id} 의 상태값이 아닙니다`);
      const r = known[k];
      if (r) assert.ok(typeof v === 'number' && v >= r[0] && v <= r[1], `${where}.${k}=${v} 이 범위 ${r?.join('~')} 밖`);
    }
    const [file, names] = SOURCE_KEYS[id];
    const text = src(file);
    for (const n of names) assert.ok(text.includes(n), `${file} 에 ${n} 정의가 있어야 합니다`);
  });
}

/* ------------------------------------------------------------------------------------------------ 자막 숫자 재계산 */
const find = (id, label) => all.find(([i, l]) => i === id && (label === undefined || l.label === label))[1];
const okNums = (lesson, allowed) => {
  const set = new Set(allowed);
  for (const s of sayList(lesson).flat()) numbersOf(s).forEach((n) => assert.ok(set.has(n), `자막 「${s}」 의 숫자 ${n} 은 장면 공식으로 나오는 값이 아닙니다`));
};

test('해설 sv1-4: 직사각형 기둥(4×3, 높이 5) 부피 12×5 = 60 을 자막이 그대로 따른다', () => {
  const l = find('sv1-4'), st = l.chapters[0].start;
  const a = st.sA, b = st.sB, h = st.sH, S = a * b, V = S * h;
  assert.deepEqual([a, b, h, S, V], [4, 3, 5, 12, 60]);
  const say = sayList(l);
  assert.ok(say[1][0].includes(`가로 ${a}, 세로 ${b}`) && say[1][1].includes(`${a}\\times${b}=${S}`));
  assert.ok(say[2][1].includes(`${S}\\times1`) && say[2][1].includes(`${S}\\times${h}`));
  assert.ok(say[3][1].includes(`${S}\\times${h}=${V}`));
  okNums(l, [a, b, h, S, V, 1]);
  const t1 = src('t1.js');
  assert.match(t1, /if \(C\.review && !b\.thumb && st >= 3 && !D\.lessonHide\) G\.sumRows\(D, \[\[\{ t: `부피 = \$\{plainVal\(M\.S\)\} × \$\{M\.h\} = \$\{plainVal\(M\.vol\)\} cm³`/, '결과 줄은 정리 탭 3단계 · 해설 재생 중에는 svShowV 뒤');
  assert.match(t1, /sT4: P\('판 쌓기', 0, 1,/);
  assert.match(t1, /init: \(s\) => \{ s\.svShape = 'rect'; s\.sA = 4; s\.sB = 3; s\.sK = 1; s\.sU = 3; s\.sR = 3; s\.sH = 5; s\.sT4 = 1; \}/);
});

test('해설 sv3-1: 반지름 3 구 — 단면 9π, 원 4개, 겉넓이 4×9π = 36π', () => {
  const l = find('sv3-1'), r = l.chapters[0].start.s6R, one = r * r, tot = 4 * one;
  assert.deepEqual([r, one, tot], [3, 9, 36]);
  assert.equal(tot, 4 * r * r);
  const say = sayList(l);
  assert.ok(say[0][0].includes(`반지름 ${r}`) && say[0][1].includes(`\\pi\\times${r}^2=${one}\\pi`));
  assert.ok(say[1][0].includes('원 4개'));
  assert.ok(say[1][1].includes('전개도는 아니에요'), '원 4개는 넓이를 비교한 그림이지 전개도가 아니라고 말한다(장면 안내와 같음)');
  assert.ok(say[2][1].includes(`${one}\\pi\\times4=${tot}\\pi`));
  okNums(l, [r, one, tot, 4, 2]);
  const t3 = src('t3.js');
  assert.match(t3, /if \(e > 0\.9 && !narrow && !D\.lessonHide\) b\.text\(/, '넓은 그림의 「넓이 비교 … = 36π」 줄은 svShowV 뒤');
  assert.match(t3, /if \(C\.review && narrow && !b\.thumb && st >= 3 && !D\.lessonHide\) G\.sumRows\(/, '좁은 그림의 결과 줄');
  assert.match(t3, /init: \(s\) => \{ s\.s6R = 3; s\.s6T = 0; \}/);
});

test('해설 sv2-2: 원뿔 r=3·모선 5 — 호 6π, 옆넓이 ½×5×6π = 15π, 밑넓이 9π, 겉넓이 24π (= πr²+πrl)', () => {
  const l = find('sv2-2'), st = l.chapters[0].start, r = st.s2r, R = st.s2G, S = r * r, arc = 2 * r, lat = (R * arc) / 2, tot = S + lat;
  assert.deepEqual([r, R, S, arc, lat, tot], [3, 5, 9, 6, 15, 24]);
  assert.equal(lat, r * R, '옆넓이 = πrl');
  const say = sayList(l);
  assert.ok(say[0][1].includes(`모선 ${R}`));
  assert.ok(say[1][1].includes(`2\\pi\\times${r}=${arc}\\pi`));
  assert.ok(say[2][0].includes(`\\frac12\\times${R}\\times${arc}\\pi=${lat}\\pi`));
  assert.ok(say[2][1].includes(`\\pi\\times${r}^2=${S}\\pi`));
  assert.ok(say[2][2].includes(`${S}\\pi+${lat}\\pi=${tot}\\pi`));
  okNums(l, [r, R, S, arc, lat, tot, 1, 2]); // 1, 2 는 ½ 의 숫자
  const t2 = src('t2.js');
  assert.match(t2, /D\.areaLab\(c0, '밑넓이', plainVal\(M\.S\), \{ dx: -0\.4 \* rr, dy: -0\.04 \* rr, maxW: rr \* 1\.05, alpha: flatA \}\);/, '정리 탭에도 밑넓이');
  assert.match(t2, /if \(C\.review && !C\.problem && st >= 3 && flatA > 0\.95 && !D\.lessonHide\) G\.sumRows\(/, '결과 줄은 해설 재생 중 svShowV 뒤');
  assert.match(t2, /init: \(s\) => \{ s\.s2r = 3; s\.s2G = 5; s\.s2U = 0; \}/);
});

for (const label of ['겉넓이', '부피']) {
  test(`해설 sv4-1:${label}: 3-4-5 삼각형을 길이 4인 변(축)으로 돌린 원뿔 (r=3, h=4, 모선 5)`, () => {
    const l = find('sv4-1', label), c0 = l.chapters[0].cues[0].set, r = 3, h = 4, R = 5, S = r * r, arc = 2 * r, lat = (R * arc) / 2, tot = S + lat, vol = (S * h) / 3;
    assert.deepEqual([S, arc, lat, tot, vol], [9, 6, 15, 24, 12]);
    assert.equal(R * R, r * r + h * h, '3-4-5 직각삼각형');
    assert.equal(c0.svTri, 'A'); assert.equal(c0.svAxis, 'long'); assert.equal(c0.svMode, label === '겉넓이' ? 'surf' : 'vol');
    assert.equal(l.chapters[0].start.s41K, 1);
    const say = sayList(l);
    assert.ok(say[0][0].includes(`길이 ${h}인 변`) && say[0][1].includes(`높이 ${h}`) && say[0][1].includes(`반지름 ${r}`) && say[0][1].includes(`모선 ${R}`));
    if (label === '겉넓이') {
      assert.ok(say[1][1].includes(`모선 ${R}`) && say[1][1].includes(`${arc}\\pi`));
      assert.ok(say[2][0].includes(`\\frac12\\times${R}\\times${arc}\\pi=${lat}\\pi`) && say[2][1].includes(`\\pi\\times${r}^2=${S}\\pi`) && say[2][2].includes(`${lat}\\pi+${S}\\pi=${tot}\\pi`));
      okNums(l, [r, h, R, S, arc, lat, tot, 1, 2]);
    } else {
      assert.ok(say[1][1].includes(`\\pi\\times${r}^2=${S}\\pi`));
      assert.ok(say[2][1].includes(`\\frac13\\times${S}\\pi\\times${h}=${vol}\\pi`));
      okNums(l, [r, h, R, S, vol, 1, 2, 3]); // 2 는 반지름 제곱의 지수
    }
    const t4 = src('t4.js');
    assert.match(t4, /const lessonRun = rvw && s\.lessonOn;/, '해설 재생 중 정리 탭도 돌리기 → 펼치기');
    assert.match(t4, /t2 = b\.thumb \? 1 : rvw && !lessonRun \? 1 :/);
  });
}

test('해설 sv2-5 겉넓이: 정사각뿔대(윗면 3, 아랫면 9, 옆면의 높이 5) — 밑면 9+81 = 90, 옆면 ½×(3+9)×5 = 30, 4개 120, 겉넓이 210', () => {
  const l = find('sv2-5', '겉넓이'), st = l.chapters[0].start, a = st.s5A, b = st.s5B, hs = 5, base = a * a + b * b, side = ((a + b) * hs) / 2, four = 4 * side, tot = base + four;
  assert.deepEqual([a, b, base, side, four, tot], [9, 3, 90, 30, 120, 210]);
  assert.equal(l.chapters[0].cues[0].set.svKind5, 'frus'); assert.equal(l.chapters[0].cues[0].set.svMode, 'surf');
  const say = sayList(l);
  assert.ok(say[1][1].includes(`${b}^2+${a}^2=${b * b}+${a * a}=${base}`));
  assert.ok(say[2][1].includes(`\\frac12\\times(${b}+${a})\\times${hs}=${side}`));
  assert.ok(say[3].join('').includes(`${side}\\times4+${b * b}+${a * a}=${tot}`), '결론 자막: 30×4 + 9 + 81 = 210 (그림의 결과 줄 「= 120 + 9 + 81 = 210」과 같은 식)');
  okNums(l, [a, b, hs, base, side, four, tot, 1, 2, 4, b * b, a * a]);
});

test('해설 sv2-3: 원뿔 r=3·h=4·모선 5 — 겉넓이에는 모선(옆넓이 15π, 밑넓이 9π, 24π), 부피에는 높이(⅓×9π×4 = 12π)', () => {
  const surf = find('sv2-3', '겉넓이'), vol = find('sv2-3', '부피'), r = 3, h = 4, R = 5, S = r * r, arc = 2 * r, lat = (R * arc) / 2, tot = S + lat, v = (S * h) / 3;
  assert.deepEqual([S, arc, lat, tot, v], [9, 6, 15, 24, 12]);
  assert.equal(R * R, r * r + h * h);
  assert.equal(surf.chapters[0].cues[0].set.svMode, 'surf'); assert.equal(vol.chapters[0].cues[0].set.svMode, 'vol');
  for (const l of [surf, vol]) { assert.equal(l.chapters[0].cues[0].set.svTri, 'A'); assert.equal(l.chapters[0].start.s3K, 1); assert.ok(sayList(l)[0][0].includes(`반지름 ${r}, 높이 ${h}, 모선 ${R}`)); }
  assert.ok(sayList(surf)[0][1].includes(`모선 ${R}`) && sayList(surf)[0][1].includes(`높이 ${h}는 안 써요`), '겉넓이: 모선을 쓰고 높이는 안 쓴다');
  assert.ok(sayList(vol)[0][1].includes(`높이 ${h}를 쓰고 모선 ${R}는 안 써요`), '부피: 높이를 쓰고 모선은 안 쓴다');
  const s = sayList(surf);
  assert.ok(s[1][0].includes(`모선 ${R}`) && s[1][1].includes(`2\\pi\\times${r}=${arc}\\pi`));
  assert.ok(s[2][0].includes(`\\frac12\\times${R}\\times${arc}\\pi=${lat}\\pi`) && s[2][1].includes(`\\pi\\times${r}^2=${S}\\pi`) && s[2][2].includes(`${lat}\\pi+${S}\\pi=${tot}\\pi`));
  okNums(surf, [r, h, R, S, arc, lat, tot, 1, 2]);
  const w = sayList(vol);
  assert.ok(w[1][1].includes(`\\pi\\times${r}^2=${S}\\pi`) && w[2][1].includes(`\\frac13\\times${S}\\pi\\times${h}=${v}\\pi`));
  okNums(vol, [r, h, R, S, v, 1, 2, 3]);
  const t2 = src('t2.js');
  assert.match(t2, /t: !surf \? 0 : C\.problem \? 0 : rv && !s\.lessonOn \? 1 : C\.t,/, '해설 재생 중 정리 탭도 펼침을 따른다');
  assert.match(t2, /if \(!surf && rv && s\.lessonOn && !b\.thumb\) \{/, '재생 중 부피: 밑넓이 + 합 식');
  assert.match(src('solid3d.js'), /const lbl = \(!\(o\.textbookReview && C\.review\) && !o\.cleanFrustum\) \|\| !!\(s\.lessonOn && C\.review\);/);
});

test('해설 sv2-4 겉넓이: 원뿔대(반지름 6·3, 모선 10·5) — 60π − 15π = 45π, 9π + 36π, 겉넓이 90π', () => {
  const l = find('sv2-4', '겉넓이'), st = l.chapters[0].start, r2 = 3 * st.s4K, r1 = 3 * st.s4J, R2 = 10, R1 = 5, big = r2 * R2, small = r1 * R1, ring = big - small, top = r1 * r1, bot = r2 * r2, tot = ring + top + bot;
  assert.deepEqual([r2, r1, big, small, ring, top, bot, tot], [6, 3, 60, 15, 45, 9, 36, 90]);
  assert.equal(R2 / R1, r2 / r1, '큰 원뿔과 작은 원뿔은 닮은꼴(모선 비 = 반지름 비)');
  assert.equal(l.chapters[0].cues[0].set.svTri4, 'A'); assert.equal(l.chapters[0].cues[0].set.svMode, 'surf');
  const say = sayList(l);
  assert.ok(say[1][0].includes(`반지름 ${R2}`) && say[1][0].includes(`${2 * r2}\\pi`) && say[1][1].includes(`\\pi\\times${r2}\\times${R2}=${big}\\pi`));
  assert.ok(say[1][2].includes(`\\pi\\times${r1}\\times${R1}=${small}\\pi`));
  assert.ok(say[2][1].includes(`${big}\\pi-${small}\\pi=${ring}\\pi`) && say[2][2].includes(`${ring}\\pi+${top}\\pi+${bot}\\pi=${tot}\\pi`));
  okNums(l, [r2, r1, R2, R1, big, small, ring, top, bot, tot, 2 * r2, 2]); // 2 는 「원 2개」
  const t2 = src('t2.js'), s3 = src('solid3d.js');
  assert.match(t2, /t: C\.problem \? 0 : rv && !s\.lessonOn \? 1 : C\.t, problem: C\.problem, review: rv, hl,/);
  assert.match(s3, /const ringRow = o\.cleanFrustum && s\.lessonOn && hl\.ring === 2 \?/);
  assert.match(s3, /옆넓이 = 큰 부채꼴 − 작은 부채꼴 = \$\{V0\.big\} − \$\{V0\.small\} = \$\{V0\.ring\}/);
});
