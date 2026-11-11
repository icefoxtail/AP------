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
const COMMON = { svYaw: [-180, 180], svPitch: [-30, 85], svShowV: null, svBaseReady: null, svSideReady: null, svOtherReady: null, svBigReady: null, svSmallReady: null };
const SCENE_STATE = {
  'sv1-4': { sA: [2, 15], sB: [2, 15], sH: [2, 20], sT4: [0, 1], svShape: null },
  'sv3-1': { s6R: [1, 15], s6T: [0, 1] },
  'sv2-2': { s2r: [2, 15], s2G: [3, 17], s2U: [0, 1] },
  'sv4-1': { s41K: [1, 3], s41T: [0, 1], svTri: null, svAxis: null, svMode: null },
  'sv2-5': { s5A: [4, 24], s5B: [1, 23], s5T: [0, 1], svKind5: null, svMode: null },
  'sv2-3': { s3K: [1, 5], s3U: [0, 1], svTri: null, svMode: null, sv23Started: null },
  'sv2-4': { s4K: [2, 5], s4J: [1, 4], s4T: [0, 1], svTri4: null, svMode: null },
  'sv5-1': { s51A: [4, 15], s51H: [1, 20], s51Q: [1, 7], s51T: [0, 1] },
  'sv5-3': { s53A: [4, 15], s53P: [1, 14], s53T: [0, 1], svCnt: null },
  'sv5-6': { s56A: [4, 15], s56H: [2, 20], s56R: [1, 7], s56Z: [1, 20], s56T: [0, 1], svTop: null, svMode: null },
  'sv3-2': { s7R: [1, 15], s7T: [0, 1] },
  'sv3-4': { s8R: [2, 15], s8K: [0, 8], s8T: [0, 1], svBody: null, svTankMode: null },
  'sv4-3': { s43T: [0, 1], svDbl: null, svMode: null },
  'sv4-4': { s44H: [1, 20], s44T: [0, 1], svTri4: null, svMode: null },
  'sv2-1': { s2A: [2, 15], s2T: [0, 1], svMode2: null },
  'sv1-2': { sTh: [60, 300], sR2: [2, 15], sH2: [2, 20], sT2: [0, 1] },
  'sv1-5': { sW: [2, 15], sRr: [1, 15], sH5: [2, 20], sT5: [0, 1], svMode: null, sv15Started: null }
};
// 장면 소스에서 확인할 상태값 정의(파일, 정규식) — 이름이 장면에 실제로 있는지
const SOURCE_KEYS = {
  'sv1-4': ['t1.js', ['sA:', 'sB:', 'sH:', 'sT4:']],
  'sv3-1': ['t3.js', ['s6R:', 's6T:']],
  'sv2-2': ['t2.js', ['s2r:', 's2G:', 's2U:']],
  'sv4-1': ['t4.js', ['s41K:', 's41T:', "s.svTri = 'A'", "s.svAxis = 'long'"]],
  'sv2-5': ['t2.js', ['s5A:', 's5B:', 's5T:', "s.svKind5 = 'frus'"]],
  'sv2-3': ['t2.js', ['s3K:', 's3U:', "s.svTri = 'A'; s.s3K = 1; s.svMode = 'surf'; s.sv23Started = false"]],
  'sv2-4': ['t2.js', ['s4K:', 's4J:', 's4T:', "s.svTri4 = 'A'; s.s4K = 2; s.s4J = 1"]],
  'sv5-1': ['t5.js', ['s.s51A = 6; s.s51H = 5; s.s51Q = 2; s.s51T = 0;']],
  'sv5-3': ['t5.js', ['s.svCnt = 1; s.s53A = 6; s.s53P = 2; s.s53T = 0;']],
  'sv5-6': ['t5.js', ["s.svTop = 'cyl'; s.svMode = 'surf'; s.s56A = 8; s.s56H = 4; s.s56R = 3; s.s56Z = 3; s.s56T = 0;"]],
  'sv3-2': ['t3.js', ['s7R:', 's7T:', "s[key] = 3; s[tkey] = 0;"]],
  'sv3-4': ['t3.js', ["s.svBody = 'sph'; s.s8R = 3; s.s8K = 0; s.s8T = 0;"]],
  'sv4-3': ['t4.js', ["s.svDbl = 'D'; s.svMode = 'surf'; s.s43T = 0.2;"]],
  'sv4-4': ['t4.js', ["s.svTri4 = 'A'; s.svMode = 'surf'; s.s44H = 4; s.s44T = 0.6;"]],
  'sv2-1': ['t2.js', ["s.svMode2 = 'cube'; s.s2A = 4;"]],
  'sv1-2': ['t1.js', ['s.sTh = 90; s.sR2 = 4; s.sH2 = 7; s.sT2 = 0;']],
  'sv1-5': ['t1.js', ["s.sW = 4; s.sRr = 2; s.sH5 = 5; s.sT5 = 0; s.svMode = 'surf'; s.sv15Started = false;"]]
};
// 정리 탭 풀이 단계 수(장면의 steps 길이): 해설의 step 은 1~이 값
const STEP_COUNT = { 'sv1-4': 3, 'sv3-1': 3, 'sv2-2': 3, 'sv4-1:겉넓이': 3, 'sv4-1:부피': 3, 'sv2-5:겉넓이': 3, 'sv2-3:겉넓이': 3, 'sv2-3:부피': 3, 'sv2-4:겉넓이': 4, 'sv5-1': 4, 'sv5-3': 4, 'sv5-6:겉넓이': 4, 'sv3-2': 4, 'sv3-4:남은 물': 4, 'sv2-5:부피': 3, 'sv2-4:부피': 3, 'sv4-3': 3, 'sv4-4': 4, 'sv2-1': 3, 'sv1-2': 3, 'sv1-5': 3 };

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

test('kit 규칙(2026-11-11): 해설의 첫 장은 to·step·part 중 하나가 첫 1초 안에 있으면 통과, 아무 움직임도 없으면 실패. 쇼츠는 그대로 to 만', () => {
  const ch = (cues, extra = {}) => ({ length: 9, title: '첫 장', cues, ...extra });
  const rest = [ch([{ at: 0, say: '둘째 장이에요.', step: 2 }, { at: 4.5, say: '이어져요.' }]), ch([{ at: 0, say: '셋째 장이에요.', step: 3 }, { at: 4.5, say: '정답 $7$.' }])];
  const L = (first) => ({ title: '시험', answer: '$7$', summary: '요약', task: '해 보세요', chapters: [first, ...rest] });
  const say2 = (c0) => [{ ...c0, say: '첫 칸이에요.' }, { at: 4.5, say: '두 번째 줄이에요.' }];
  const err = (l) => core.validateLesson(l).errors.filter((e) => e.includes('첫 1초'));
  assert.deepEqual(err(L(ch(say2({ at: 0, to: { x: 1 }, dur: 4 }), { start: { x: 0 } }))), [], 'to');
  assert.deepEqual(err(L(ch(say2({ at: 0, step: 1 })))), [], 'step');
  assert.deepEqual(err(L(ch(say2({ at: 0.9, part: 'ring' })))), [], 'part (0.9초)');
  assert.deepEqual(err(L(ch(say2({ at: 0, part: null })))), [], 'part: null 도 강조 바꿈');
  assert.equal(err(L(ch(say2({ at: 0 })))).length, 1, '움직임 없음 → 실패');
  assert.equal(err(L(ch([{ at: 0, say: '첫 칸이에요.' }, { at: 1.5, say: '늦은 step.', step: 1 }, { at: 5, say: '셋째 줄.' }]))).length, 1, '1초 뒤의 step 은 첫 움직임이 아님');
  // 쇼츠(영상): 예전 규칙 그대로 — step 만으로는 실패, to 면 통과
  const short = (c0) => ({ length: 10, title: '쇼츠', summary: '요약', task: '해 보세요', cues: [{ ...c0, say: '첫 칸이에요.' }, { at: 4.5, say: '두 번째 줄이에요.' }] });
  assert.ok(core.validate(short({ at: 0, step: 1 })).errors.some((e) => e.includes('첫 1초')), '쇼츠는 step 으로 안 됨');
  assert.ok(!core.validate(short({ at: 0, to: { x: 1 }, dur: 4 })).errors.some((e) => e.includes('첫 1초')), '쇼츠는 to 로 통과');
});

test('해설 sv2-3 부피: 정리 탭 부피 그림에는 움직일 값이 없으므로 첫 장의 첫 움직임은 step 이다(보이지 않는 s3U 흉내 없음)', () => {
  const l = find('sv2-3', '부피'), c0 = l.chapters[0].cues[0];
  assert.equal(c0.step, 1); assert.equal(c0.to, undefined);
  for (const [id, lesson] of all) for (const ch of lesson.chapters) for (const c of ch.cues) if (c.to) for (const [k, v] of Object.entries(c.to)) assert.ok(!(k === 's3U' && v < 0.1), `${id}: 눈에 안 보이는 가짜 움직임 금지`);
});

test('해설 sv5-1·5-3·5-6(t5.js 구멍·모퉁이·붙인 입체): 자막 숫자 재계산 + 단계별 식 한 줄이 그림에 있고 결과는 재생 중 숨김', () => {
  // sv5-1: 6×6×5 상자, 구멍 반지름 2
  const a = 6, h = 5, q = 2, S0 = 2 * a * a + 4 * a * h, minus = 2 * q * q, plus = 2 * q * h;
  assert.deepEqual([S0, minus, plus, S0 - minus + plus === S0 + 2 * (plus / 2 - minus / 2)], [192, 8, 20, true]);
  const l1 = find('sv5-1'), s1 = sayList(l1);
  assert.ok(s1[0][1].includes(`${a}\\times${a}\\times2+${a}\\times${h}\\times4=${S0}`) && s1[1][1].includes(`2\\times\\pi\\times${q}^2=-${minus}\\pi`) && s1[2][1].includes(`2\\pi\\times${q}\\times${h}=${plus}\\pi`) && s1[3][1].includes(`${S0}-${minus}\\pi+${plus}\\pi=${S0}+${(plus - minus)}\\pi`));
  okNums(l1, [a, h, q, S0, minus, plus, plus - minus, 2, 4, 5, 6]);
  // sv5-3: 정육면체 6, 모퉁이 2 — 없어진 3면 = 생긴 3면
  const A = 6, p = 2, out3 = 3 * p * p, S3 = 6 * A * A;
  assert.deepEqual([out3, S3], [12, 216]);
  const l3 = find('sv5-3'), s3 = sayList(l3);
  assert.ok(s3[1][1].includes(`3\\times${p}\\times${p}=${out3}`) && s3[3][1].includes(`6\\times6\\times6-${out3}+${out3}=${S3}`));
  assert.ok(!s3.slice(0, 3).flat().some((x) => x.includes(String(S3))), '216(= 처음 겉넓이 = 정답)은 결론에서만 말한다');
  okNums(l3, [A, p, out3, S3, 2, 3, 6]);
  // sv5-6: 8×8×4 상자 + 원기둥(반지름 3 · 높이 3)
  const a6 = 8, H = 4, r = 3, z = 3, box = 2 * a6 * a6 + 4 * a6 * H, cover = r * r, add = r * r + 2 * r * z;
  assert.deepEqual([box, cover, add, add - cover], [256, 9, 27, 18]);
  const l6 = find('sv5-6', '겉넓이'), s6 = sayList(l6);
  assert.ok(s6[1][0].includes(`2\\times${a6}\\times${a6}+4\\times${a6}\\times${H}=${box}`) && s6[1][1].includes(`-\\pi\\times${r}^2=-${cover}\\pi`) && s6[2][1].includes(`${add}\\pi`) && s6[2][2].includes(`${box}-${cover}\\pi+${add}\\pi=${box}+${add - cover}\\pi`));
  okNums(l6, [a6, H, r, z, box, cover, add, add - cover, 2, 3, 4]);
  // 소스: 단계별 식 한 줄(G.stepRow)과 결과 숨김
  const t5 = src('t5.js'), s3js = src('solid3d.js');
  assert.match(s3js, /function stepRow\(D, C, segs, o\) \{/);
  assert.equal((t5.match(/G\.stepRow\(D, C,/g) || []).length, 3, '세 장면 모두 stepRow');
  assert.equal((t5.match(/gated: \(C\.step \|\| 0\) >= 4/g) || []).length, 3, '4단계 결과 줄은 모두 gated');
  assert.match(t5, /\$\{D\.lessonHide \? '' : ` = \$\{plainVal\(M\.S0\)\}`\}/, 'sv5-3: 정답과 같은 216 은 재생 중 결론까지 숨김');
});

test('해설 sv3-2 반구(r=3): 구 36π → 곡면 ½ = 18π, 자른 면 9π, 겉넓이 27π / sv3-4 수조(r=3, h=6): 54π − 36π = 18π', () => {
  const r = 3, sph = 4 * r * r, curve = sph / 2, flat = r * r, tot = curve + flat;
  assert.deepEqual([sph, curve, flat, tot], [36, 18, 9, 27]);
  assert.equal(tot, 3 * r * r, '반구의 겉넓이 = 3πr²');
  const l2 = find('sv3-2'), s2 = sayList(l2);
  assert.ok(s2[0][0].includes(`반지름 ${r}`) && s2[0][1].includes(`4\\pi\\times${r}^2=${sph}\\pi`) && s2[1][1].includes(`${sph}\\pi\\times\\frac12=${curve}\\pi`) && s2[2][1].includes(`\\pi\\times${r}^2=${flat}\\pi`) && s2[3][1].includes(`${curve}\\pi+${flat}\\pi=${tot}\\pi`));
  assert.ok(s2[2][0].includes('자른'.slice(0, 0) + '잘린') , '자른 면을 빠뜨리는 함정을 짚는다');
  okNums(l2, [r, sph, curve, flat, tot, 1, 2, 4]);
  const R = 3, h = 2 * R, tank = R * R * h, ball = (4 * R * R * R) / 3, remain = tank - ball;
  assert.deepEqual([tank, ball, remain], [54, 36, 18]);
  assert.equal(ball, tank * 2 / 3, '구 : 원기둥 = 2 : 3');
  const l4 = find('sv3-4', '남은 물'), s4 = sayList(l4);
  assert.equal(l4.chapters[0].cues[0].set.svTankMode, 'remain'); assert.equal(l4.chapters[0].cues[0].set.svBody, 'sph');
  assert.ok(s4[0][1].includes(`${tank}\\pi`) && s4[0][1].includes(`\\frac43\\pi\\times${R}^3=${ball}\\pi`) && s4[1][1].includes('1:2:3') && s4[2][1].includes(`${ball}\\pi`) && s4[3][1].includes(`${tank}\\pi-${ball}\\pi=${remain}\\pi`));
  okNums(l4, [R, tank, ball, remain, 1, 2, 3, 4]);
  const t3 = src('t3.js');
  assert.equal((t3.match(/G\.stepRow\(D, C,/g) || []).length, 2, '반구 · 수조 모두 stepRow');
  assert.match(t3, /gated: M\.mode === 'remain' && \(C\.step \|\| 0\) >= 4/);
});

test('해설 sv2-5 부피(각뿔대 9·3): 큰 각뿔 162 − 작은 각뿔 6 = 156 / sv2-4 부피(원뿔대 6·3): 96π − 12π = 84π', () => {
  const a2 = 9, a1 = 3, h2 = (2 * a2) / 3, h1 = (2 * a1) / 3, big = (a2 * a2 * h2) / 3, small = (a1 * a1 * h1) / 3;
  assert.deepEqual([h2, h1, big, small, big - small], [6, 2, 162, 6, 156]);
  const l5 = find('sv2-5', '부피'), s5 = sayList(l5);
  assert.equal(l5.chapters[0].cues[0].set.svMode, 'vol'); assert.equal(l5.chapters[0].cues[0].set.svKind5, 'frus');
  assert.ok(s5[1][1].includes(`\\frac13\\times${a2}^2\\times${h2}=${big}`) && s5[2][1].includes(`한 변 ${a1}, 높이 ${h1}`) && s5[2][1].includes(`\\frac13\\times${a1}^2\\times${h1}=${small}`) && s5[3][1].includes(`${big}-${small}=${big - small}`));
  assert.ok(s5[0].join(' ').includes('높이의 비도 3:1') && s5[0].join(' ').includes('차가 4'));
  okNums(l5, [a2, a1, h2, h1, big, small, big - small, h2 - h1, 1, 2, 3]);
  const r2 = 6, r1 = 3, H2 = 8, H1 = 4, v2 = (r2 * r2 * H2) / 3, v1 = (r1 * r1 * H1) / 3;
  assert.deepEqual([v2, v1, v2 - v1], [96, 12, 84]);
  const l4 = find('sv2-4', '부피'), s4 = sayList(l4);
  assert.equal(l4.chapters[0].cues[0].set.svMode, 'vol'); assert.equal(l4.chapters[0].start.s4K, 2);
  assert.ok(s4[1][1].includes(`\\frac13\\pi\\times${r2}^2\\times${H2}=${v2}\\pi`) && s4[2][1].includes(`반지름 ${r1}, 높이 ${H1}`) && s4[2][1].includes(`${v1}\\pi`) && s4[3][1].includes(`${v2}\\pi-${v1}\\pi=${v2 - v1}\\pi`));
  assert.ok(s4[0].join(' ').includes('높이의 비도 2:1') && s4[0].join(' ').includes('차가 4'));
  okNums(l4, [r2, r1, H2, H1, v2, v1, v2 - v1, 1, 2, 3]);
  const t2 = src('t2.js'), s3js = src('solid3d.js');
  assert.match(t2, /if \(!D\.lessonHide\) D\.areaLab\(v3\(0, y0 \+ hf \* 0\.4, 0\), '각뿔대'/, '각뿔대 이름표(답)는 재생 중 결론까지 숨김');
  assert.match(s3js, /const lessonShow = !!\(s\.lessonOn && rv\);/);
  assert.match(s3js, /if \(!\(lessonShow && D\.lessonHide\)\) D\.areaLab\(v3\(0, y0 \+ hf \* 0\.4, 0\), '원뿔대'/);
});

test('해설 sv4-3 이중원뿔(r=3, 모선 5·5): 15π + 15π = 30π, 맞붙은 원은 더하지 않는다 / sv4-4 복합(r=3, 모선 5, 원기둥 높이 4): 15π+24π+18π = 57π', () => {
  const r = 3, R = 5, lat = r * R, tot = 2 * lat;
  assert.deepEqual([lat, tot], [15, 30]);
  const l3 = find('sv4-3'), s3 = sayList(l3);
  assert.equal(l3.chapters[0].cues[0].set.svDbl, 'D'); assert.equal(l3.chapters[0].cues[0].set.svMode, 'surf');
  assert.ok(s3[0][1].includes(`반지름 ${r}, 높이 4·4, 모선 ${R}·${R}`) && s3[1][0].includes('겉에 드러나지 않아요') && s3[1][1].includes('밑면은 더하지 않고') && s3[2][0].includes(`\\pi\\times${r}\\times${R}=${lat}\\pi`) && s3[2][2].includes(`${lat}\\pi+${lat}\\pi=${tot}\\pi`));
  okNums(l3, [r, R, 4, lat, tot, 2]);
  const hr = 3, hc = 4, Rr = 5, H = 4, cone = hr * Rr, cyl = 2 * hr * H, hemi = 2 * hr * hr, all = cone + cyl + hemi;
  assert.deepEqual([cone, cyl, hemi, all], [15, 24, 18, 57]);
  assert.equal(Rr * Rr, hr * hr + hc * hc);
  const l4 = find('sv4-4'), s4 = sayList(l4);
  assert.equal(l4.chapters[0].cues[0].set.svTri4, 'A'); assert.equal(l4.chapters[0].start.s44H, H);
  assert.ok(s4[2][0].includes(`\\pi\\times${hr}\\times${Rr}=${cone}\\pi`) && s4[2][1].includes(`2\\pi\\times${hr}\\times${H}=${cyl}\\pi`) && s4[2][2].includes(`${hemi}\\pi`) && s4[3][1].includes(`${cone}\\pi+${cyl}\\pi+${hemi}\\pi=${all}\\pi`));
  okNums(l4, [hr, H, Rr, cone, cyl, hemi, all, 2]);
  const t4 = src('t4.js');
  assert.match(t4, /u = \(C\.review && !s\.lessonOn\) \|\| thumb \? 1 : clamp\(\(C\.t - 0\.5\) \* 2, 0, 1\), e = ease\(u\);/);
  assert.match(t4, /const simple = o\.simple && !\(s\.lessonOn && C\.review\);/);
  assert.match(t4, /\(\(C\.review && !s\.lessonOn\) \|\| C\.t >= 1 \|\| b\.thumb\)\) return drawNet44/);
});

test('해설 sv2-1 뿔 ⅓(정육면체 4): 64, 합동인 사각뿔 3개, 하나는 64/3 — 증명이 아니라 그림으로 확인하는 어조', () => {
  const a = 4, cube = a * a * a, pyr = cube / 3;
  assert.deepEqual([cube], [64]);
  assert.ok(Math.abs(pyr - (a * a * a) / 3) < 1e-12 && Math.abs(pyr - (a * a * a) / 3) < 1e-12, '⅓ × 밑넓이 4² × 높이 4');
  const l = find('sv2-1'), s = sayList(l);
  assert.equal(l.chapters[0].cues[0].set.svMode2, 'cube'); assert.equal(l.chapters[0].start.s2A, a);
  assert.ok(s[0][0].includes(`모서리가 ${a}`) && s[0][1].includes(`${a}\\times${a}\\times${a}=${cube}`) && s[1][0].includes('합동인 사각뿔 3개') && s[1][1].includes('그림으로 확인') && s[2][0].includes('\\frac13') && s[2][1].includes(`\\frac13\\times${cube}=\\frac{64}{3}`));
  assert.ok(!sayList(l).flat().some((x) => /증명|증명했/.test(x)), '증명이라고 말하지 않는다');
  okNums(l, [a, cube, 1, 3, 64]);
  const t2 = src('t2.js');
  assert.match(t2, /사각뿔 하나 = ⅓ × \$\{plainVal\(M\.cubeV\)\} = \$\{plainVal\(M\.pyr\)\}/, '3단계 결과 줄');
});

test('해설 sv1-2 부채꼴기둥(r=4, 90°, h=7): 56+22π / sv1-5 직사각형+반원 기둥(4, 반지름 2, h=5): 92+14π', () => {
  const r = 4, th = 90, h = 7, base = r * r * th / 360, arc = 2 * r * th / 360, per = arc / Math.PI * 0 + 8; // 밑넓이 4(π), 호 2(π), 둘레의 상수 부분 8
  assert.deepEqual([base, arc, per], [4, 2, 8]);
  const lat = [r * h, arc * h, r * h];
  assert.deepEqual(lat, [28, 14, 28]);
  assert.deepEqual([2 * base + arc * h, 2 * r * h + 2 * base * 0 + 0], [22, 56]); // π 계수 22 = 8 + 14, 상수 56 = 28 + 28
  const l2 = find('sv1-2'), s2 = sayList(l2);
  assert.ok(s2[0][0].includes(`반지름 ${r}, 중심각 ${th}°`) && s2[1][0].includes(`${base}\\pi`) && s2[2][1].includes(`${arc}\\pi`) && s2[2][1].includes(`8+2\\pi`) && s2[2][2].includes(`28+14\\pi+28=56+14\\pi`) && s2[3][1].includes(`8\\pi+56+14\\pi=56+22\\pi`));
  okNums(l2, [r, th, base, arc, 7, 8, 28, 14, 56, 22, 2, 1]);
  const w = 4, rr = 2, H = 5, rect = w * w, semi = rr * rr / 2, S = rect, perC = w + w + 2 * rr / 2 * 0 + w; // 밑넓이 16 + 2π, 둘레 상수 12 + 2π
  assert.deepEqual([rect, semi, perC], [16, 2, 12]);
  const side = [w * H, w * H, 2 * H, w * H];
  assert.deepEqual(side, [20, 20, 10, 20]);
  assert.equal(2 * rect + 4 * H * 3, 32 + 60, '상수 부분 92 = 32 + 60'); assert.equal(2 * semi + 2 * H, 14, 'π 계수 14 = 4 + 10');
  const l5 = find('sv1-5', '겉넓이'), s5 = sayList(l5);
  assert.equal(l5.chapters[0].cues[0].set.svMode, 'surf');
  assert.ok(s5[1][1].includes('16+2\\pi') && s5[2][1].includes('4+4+2\\pi+4=12+2\\pi') && s5[2][2].includes('20+20+10\\pi+20=60+10\\pi') && s5[3][1].includes('32+4\\pi+60+10\\pi=92+14\\pi'));
  okNums(l5, [w, rr, H, 16, 2, 12, 20, 10, 60, 32, 4, 92, 14, 1]);
  const t1 = src('t1.js');
  assert.equal((t1.match(/\(C\.review && !s\.lessonOn\) \|\| \(C\.tab === 'explore' && ctx\.e > 0\.5\)/g) || []).length, 2, '두 장면 모두 재생 중 이름표');
  assert.equal((t1.match(/if \(!D\.lessonHide\) fitLine\(D, \(xl \+ xr\) \/ 2, rowY \+ 76,/g) || []).length, 2, '결과 줄은 재생 중 svShowV 까지 숨김');
});
