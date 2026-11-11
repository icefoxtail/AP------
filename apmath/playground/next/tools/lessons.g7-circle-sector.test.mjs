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
  'z3-sectorProof': { csR: [2, 12], csS: [30, 180], csT: [0, 100], csShowS: null, csShowArc: null, csShowWidth: null },
  'z3-circleProof': { csR: [2, 12], csN: null, csT: [0, 100], csShowS: null, csShowArc: null, csShowWidth: null },
  // basic.js build(): 'b'+id+'_'+키. sectorSpec 의 r 3~12 · th 10~350, 해설 전용 상태값 div(0~1)·ref(0 없음 · 1 원주 · 2 원의 넓이)
  '1209': { b1209_r: [3, 12], b1209_th: [10, 350], b1209_div: [0, 1], b1209_ref: [0, 2] },
  // f04.js makeScene(): PFX 'f4'+'_'+id+'_'+키. R 4~10, t 0~1, 해설이 켜는 show(결과 라벨·캡션·칩을 아끼는 표시)
  'f4-swirl': { f4_swirl_R: [4, 10], f4_swirl_t: [0, 1], f4_swirl_show: null },
  // f01.js makeScene(): PFX 'f1'. a 4~12, t 0~1, mode 0 넓이 · 1 둘레, 해설이 켜는 show
  'f1-ss2': { f1_ss2_a: [4, 12], f1_ss2_t: [0, 1], f1_ss2_mode: [0, 1], f1_ss2_show: null },
  // f03.js: s.f3a 한 변 2~12 · s.f3t 0~1, 해설이 켜는 f3Show
  'f3-leaf-len': { f3a: [2, 12], f3t: [0, 1], f3Show: null },
  // f05.js: s.f5A 반지름 2~8 · s.f5T 0~1 (이 장면은 숨길 정답이 그림에 없어 show 값이 없음)
  'f5-sq4': { f5A: [2, 8], f5T: [0, 1], f5BandRead: [0, 6] },
  // rolling.js: s.rlT 0~1(회전이 k/3 에서 90° 로 끝남), 해설이 켜는 rlShow
  'rl-rect': { rlT: [0, 1], rlShow: null, rlRead: [0, 3], rlFocus: [-1, 2], rlAngles: [0, 3] },
  // swept.js: gtQ 개집 한 변 1~6 · gtL 끈 1~16 · gtT 0~1, 해설이 켜는 gtShow
  'gt-kennel': { gtQ: [1, 6], gtL: [1, 16], gtT: [0, 1], gtShow: null, gtRead: [0, 3], gtCalc: [0, 3] },
  // 해설이 움직이는 값은 rlT(0~1)·gtT(0~1) 하나뿐이고 rlShow·gtShow 는 결과를 아끼는 표시(해설이 켬)
  'rl-tri': { rlT: [0, 1], rlShow: null, rlRead: [0, 3], rlFocus: [-1, 2], rlAngles: [0, 3] },
  'rl-turn60': { rlT: [0, 1], rlShow: null, rlRead: [0, 3], rlFocus: [-1, 2], rlAngles: [0, 3] },
  'gt-warehouse': { gtA: [2, 8], gtB: [2, 8], gtL: [1, 16], gtT: [0, 1], gtShow: null, gtRead: [0, 3], gtCalc: [0, 3] },
  'gt-tri': { gtS: [3, 10], gtL: [1, 16], gtT: [0, 1], gtShow: null, gtRead: [0, 3], gtCalc: [0, 3] },
  // swept.js sweepScene: swT 0~1, 결과 칩을 아끼는 표시 swShow(해설이 켬)
  'sw-square': { swA: [2, 6], swR: [1, 3], swT: [0, 1], swShow: null, swRead: [0, 5] },
  // basic.js build() 의 1102(u 0.5~2.5 · t1 10~60 · t2 10~80 · y 20~120)와 1609(sectorSpec)
  '1102': { b1102_u: [0.5, 2.5], b1102_t1: [10, 60], b1102_t2: [10, 80], b1102_y: [20, 120], b1102_show: [0, 1] },
  '1609': { b1609_r: [3, 12], b1609_th: [10, 350], b1609_div: [0, 1], b1609_ref: [0, 2] },
  // f01.js f1-star: a 6~16 · t 0~1 · mode · show / f04.js f4-slide: W 6~14 · r 2~5 · t 0~1 · show
  'f1-star': { f1_star_a: [6, 16], f1_star_t: [0, 1], f1_star_mode: [0, 1], f1_star_show: null },
  'f4-slide': { f4_slide_W: [6, 14], f4_slide_r: [2, 5], f4_slide_t: [0, 1], f4_slide_show: null },
  // html periScene('sector'): csR 2~12 · csA 30~300(15 단위) · csP 0~100(펼친 띠 위의 점 P)
  'z2-sector': { csR: [2, 12], csA: [30, 300], csP: [0, 100] },
  'z2-semi': { csR: [2, 12], csP: [0, 100] },
  'z2-quarter': { csR: [2, 12], csP: [0, 100] },
  'z2-segment': { csR: [2, 12], csS: [30, 180], csP: [0, 100], csShowChord: null },
  // basic.js sectorSpec 1610·1808: th 10~180(thMax 180)
  '1610': { b1610_r: [3, 12], b1610_th: [10, 180], b1610_div: [0, 1], b1610_ref: [0, 2] },
  '1808': { b1808_r: [3, 12], b1808_th: [10, 180], b1808_div: [0, 1], b1808_ref: [0, 2] },
  // f04.js 나머지 옮기기 장면
  'f4-sq12': { f4_sq12_a: [6, 16], f4_sq12_t: [0, 1], f4_sq12_show: null },
  'f4-slideq': { f4_slideq_W: [6, 14], f4_slideq_H: [4, 8], f4_slideq_r: [2, 6], f4_slideq_t: [0, 1], f4_slideq_show: null },
  'f4-inscr': { f4_inscr_r: [2, 6], f4_inscr_t: [0, 1], f4_inscr_show: null },
  'f4-ringmv': { f4_ringmv_R: [4, 12], f4_ringmv_r: [1, 11], f4_ringmv_th: [30, 90], f4_ringmv_t: [0, 1], f4_ringmv_show: null },
  // f01.js 빼기 장면(넓이 mode 0)
  'f1-ring': { f1_ring_R: [4, 12], f1_ring_r: [1, 11], f1_ring_th: [30, 360], f1_ring_t: [0, 1], f1_ring_mode: [0, 1], f1_ring_show: null },
  'f1-lens': { f1_lens_a: [4, 12], f1_lens_t: [0, 1], f1_lens_mode: [0, 1], f1_lens_show: null },
  'f1-ex22': { f1_ex22_a: [4, 12], f1_ex22_t: [0, 1], f1_ex22_mode: [0, 1], f1_ex22_show: null },
  // 값이 움직이지 않는 step 해설(교재 수치 그대로): 상태값 없음
  '1103': {},
  '1106': {},
  '1807': {},
  '1104': { b1104_baseShow: null },
  '1105': { b1105_baseShow: null },
  '1719': {},
  '1809': {},
  // f02 정리 탭 step 해설: 기본 수치는 enter 로 복원, f02Read 는 의미 설명 뒤 수식·값 공개
  'rot': { f02Read: null, f02Dims: null },
  'y12': { f02Read: null, f02Dims: null },
  'cc08': { f02Read: null, f02Dims: null },
  'sj1': { f02Read: null, f02Dims: null },
  'petal15': { f02Read: null, f02Dims: null },
  // f05 정리 탭 step 해설: 값은 장면 기본값 그대로
  'f5-ring': { f5A: [4, 20], f5B: [1, 19], f5C: [20, 170], f5T: [0, 1], f5Read: [0, 4], f5Given: [0, 2], f5Final: null },
  'f5-sn': { f5A: [2, 10], f5T: [0, 1], f5Read: [0, 4], f5Given: [0, 2], f5Final: null }
};
// 공유 URL/직접 탐구의 숫자를 이어받지 않도록 고정하는 교재 입력값의 실제 controls 범위.
const FIXED_SOURCE_RANGES = {
  '1103': { b1103_a: [1, 9], b1103_b: [1, 9], b1103_c: [1, 9] },
  '1106': { b1106_al: [30, 200], b1106_be: [10, 90], b1106_S: [36, 144] },
  '1807': { b1807_cof: [60, 180] },
  '1104': { b1104_al: [20, 70], b1104_r: [18, 54] },
  '1105': { b1105_be: [18, 60], b1105_r: [30, 90] },
  '1719': { b1719_n: [1, 9] },
  '1809': { b1809_i: [1, 5], b1809_r: [6, 12] },
  'rot': { f02_rot_r: [1, 6], f02_rot_th: [5, 180], f02_rot_sw: [0, 1], f02_rot_u: [0, 1] },
  'y12': { f02_y12_p: [1, 8], f02_y12_q: [1, 8], f02_y12_u: [0, 1] },
  'cc08': { f02_cc08_R: [4, 14], f02_cc08_u: [0, 1] },
  'sj1': { f02_sj1_a: [1, 8], f02_sj1_b: [1, 8], f02_sj1_u: [0, 1] },
  'petal15': { f02_petal15_a: [4, 16], f02_petal15_u: [0, 1] },
  'rl-rect': { rlT: [0, 1], rlW: [2, 8], rlH: [2, 8] },
  'rl-tri': { rlT: [0, 1], rlA: [2, 8] },
  'rl-turn60': { rlT: [0, 1], rlTd: [4, 12], rlTc: [20, 75] }
};
for (const [id, ranges] of Object.entries(FIXED_SOURCE_RANGES)) Object.assign(SCENE_STATE[id], ranges);

// f01.js ctxOf/open(): 의미·전체 넓이·파낸 넓이·둘레 조각은 설명한 시점마다 별도로 공개합니다.
for (const id of ['ss2', 'star', 'ring', 'lens', 'ex22']) Object.assign(SCENE_STATE['f1-' + id], {
  [`f1_${id}_givenShow`]: null, [`f1_${id}_wholeShow`]: null, [`f1_${id}_partShow`]: null, [`f1_${id}_edgeShow`]: [0, 3]
});

// 정리 탭(tab:'review')은 정리 탭이 같은 문제를 그리고 구하는 값을 단계별로만 보여 주는 것을 확인한 장면에만 켭니다.
const REVIEW_OK = new Set(['1209', '1102', '1609', 'z2-sector', 'z2-semi', 'z2-quarter', 'z2-segment', '1610', '1808', 'f1-ss2#둘레', 'f1-star#둘레', '1103', '1106', '1807', '1104', '1105', '1719', '1809', 'rot', 'petal15', 'f5-ring', 'f5-sn', 'y12#둘레', 'y12#넓이', 'cc08#둘레', 'cc08#넓이', 'sj1#둘레', 'sj1#넓이']);

const keyOf = (id, lesson) => id + '#' + lesson.label;

/* 자막이 말하는 숫자를 장면 공식으로 다시 계산한 값. 해설마다 허용 숫자 집합(자막에 나오는 모든 숫자는 여기에 있어야 함)과 계산 근거를 적습니다. */
const FACTS = {
  'z3-sectorProof': () => { const r = 6, th = 120; return { allowed: [r, th, 360, 12, (r * th) / 180, (r * th) / 360, (r * r * th) / 360, 1, 2], note: 'r=6 θ=120 조각 12 l=2πrθ/360=4π 가로 2π S=12π' }; },
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
    return { allowed: [Q, L, 270, 90, 180, 360, 2, big, small, area], note: '개집 2 · 끈 4 · 큰 부채꼴 12π(r=4,270°) · 작은 부채꼴 π 둘 · 14π' };
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
  'f1-star': (lesson) => {
    if (lesson.label === '둘레') { const a = 10, r = a / 2, n = 4, arc = (2 * r) / n; assert.equal(n * arc, a); return { allowed: [a, r, 2, 1, n], note: 'a=10 r=5 · 호 하나 5π/2 · 4×5π/2=10π' }; }
    const a = 10, r = a / 2, whole = a * a, part = r * r; // 사분원 4개 = 원 1개(π 의 계수 r²)
    assert.deepEqual([r, whole, part], [5, 100, 25]);
    return { allowed: [a, r, 1, 2, 4, whole, part], note: 'a=10 · r=5 · 사분원 4개 = 원 1개 · 정사각형 100 · 원 25π · 100−25π' };
  },
  'f4-slide': () => {
    const W = 10, r = 3, H = 2 * r, area = W * H;
    assert.deepEqual([H, area], [6, 60]);
    return { allowed: [W, r, 2, H, area], note: '가로 10 · 반지름 3 · 세로 2×3=6 · 10×6=60' };
  },
  'z2-sector': () => {
    const r = 6, deg = 90, arc = (r * deg) / 180, lines = 2 * r; // 호 = 2π·6·90/360 = 3π, 반지름 둘 6+6 = 12
    assert.deepEqual([arc, lines], [3, 12]);
    return { allowed: [r, deg, 2, 360, arc, lines], note: 'r=6 90° · 호 2πrθ/360=3π · 반지름 6, 6 · 3π+6+6=3π+12' };
  },
  'z2-semi': () => { const r = 6, arc = r, dia = 2 * r; assert.deepEqual([arc, dia], [6, 12]); return { allowed: [1, 2, arc, dia], note: '반원호 2πr×1/2=6π · 지름 12 · 6π+12' }; },
  'z2-quarter': () => { const r = 6, arc = (r * 90) / 180; assert.equal(arc, 3); return { allowed: [r, 2, 90, 360, arc, 2 * r], note: '사분원호 2πr×90/360=3π · 반지름 6, 6 · 3π+12' }; },
  'z2-segment': () => { const r = 6, arc = (r * 60) / 180; assert.equal(arc, 2); return { allowed: [60, 360, arc, r], note: '활꼴 60° · 호 2πr×60/360=2π · 현 6(=반지름) · 2π+6' }; },
  '1610': () => {
    const l = 4, th = 80; // 2πr·80/360 = 4π → r = 4·360/(2·80) = 9
    const R = (l * 360) / (2 * th), S = (R * R * th) / 360;
    assert.deepEqual([R, S], [9, 18]);
    return { allowed: [l, th, 360, 2, 9, R * R, S], note: '호 4π · 80° · 2/9 · r=9 · 81π × 2/9 = 18π' };
  },
  '1808': () => {
    const l = 3, th = 45, circ = (l * 360) / th, r = circ / 2;
    assert.deepEqual([circ, r], [24, 12]);
    return { allowed: [l, th, 360, 1, 8, 2, circ, r], note: '호 3π · 45° · 1/8 · 원주 24π · r=12' };
  },
  'f4-sq12': () => { const a = 12, S = (a * a) / 2; assert.equal(S, 72); return { allowed: [a, 1, 2, S], note: 'a=12 · ½×12×12=72' }; },
  'f4-slideq': () => { const W = 10, H = 6, r = 4; assert.equal(W * H, 60); return { allowed: [W, H, r, W * H], note: '가로 10 · 세로 6 · r=4 · 60' }; },
  'f4-inscr': () => { const r = 4, s2 = 2 * r; assert.equal(r * s2, 32); return { allowed: [s2, r, 180, r * s2], note: '한 변 8 · r=4 · 180° · 4×8=32' }; },
  'f4-ringmv': () => { const R = 6, r = 3, th = 60, S = (R * R * th) / 360; assert.equal(S, 6); return { allowed: [R, r, th, 360, 2, S], note: 'R=6 r=3 60° · π×6²×60/360=6π' }; },
  'f1-ring': () => {
    const R = 6, r = 3, th = 90, big = (R * R * th) / 360, small = (r * r * th) / 360, res = big - small; // π 의 계수
    assert.deepEqual([big, small, res], [9, 2.25, 6.75]);
    const den = 360 / th, num = (big - small) * den; // 작은 부채꼴 = 9π/4, 색칠 = 27π/4
    return { allowed: [R, r, th, 360, 2, big, den, num], note: 'R=6 r=3 90° · 큰 9π · 작은 9π/4 · 27π/4' };
  },
  'f1-lens': () => {
    const a = 8, sq = a * a; // 잎 = 2·(π·64/4) − 64 = 32π − 64, 색칠 = 64 − (32π − 64) = 128 − 32π
    assert.deepEqual([2 * 16, sq, 2 * sq], [32, 64, 128]);
    return { allowed: [a, 2, 4, 32, sq, 2 * sq], note: 'a=8 · 정사각형 64 · 사분원 2×πa²/4 · 잎 32π−64 · 128−32π' };
  },
  'f1-ex22': () => {
    const a = 4, sq = a * a, quarter = (a * a) / 4, half = ((a / 2) ** 2) / 2, white = quarter - half; // π 의 계수
    assert.deepEqual([sq, quarter, half, white], [16, 4, 2, 2]);
    return { allowed: [a, a / 2, sq, quarter, half], note: 'a=4 · 정사각형 16 · 사분원 4π − 반원 2π = 2π · 16−2π' };
  },
  '1103': () => { const [a, b, c] = [3, 5, 7], tot = a + b + c, u = 360 / tot; assert.equal(u * a, 72); return { allowed: [a, b, c, tot, 360, u, u * a], note: '3:5:7 · 15칸 · 한 칸 24° · 72°' }; },
  '1106': () => { const S = 24, al = 120, be = 40, x = (S * be) / al; assert.equal(x, 8); return { allowed: [al, S, be, 1, 3, x], note: '24π:x=120:40 · x=8π' }; },
  '1807': () => { const cof = 105, n = 3; assert.equal(cof / n, 35); return { allowed: [cof, n, cof / n], note: '∠COF=105° · 3등분 · 35°' }; },
  '1104': () => { const al = 40, arc = 4, cod = 180 - 2 * al, x = (arc * cod) / al; assert.deepEqual([cod, x], [100, 10]); return { allowed: [al, arc, 180, 2, cod, x], note: '40° · 4π · 180−2×40=100° · 4π:CD=40:100 → 10π' }; },
  '1105': () => { const be = 42, arc = 7, aoc = 180 - 2 * be, x = (arc * aoc) / be; assert.deepEqual([aoc, x], [96, 16]); return { allowed: [be, arc, 180, 2, aoc, x], note: '42° · 7π · 180−2×42=96° · 7π:AC=42:96 → 16π' }; },
  '1719': () => { const aoc = (180 * 4) / 5, boc = 180 - aoc, x = (180 - aoc) / 2; assert.deepEqual([boc, aoc, x], [36, 144, 18]); return { allowed: [4, 1, 180, boc, aoc, 2, x], note: '4:1 · 36° · 144° · (180−144)÷2=18°' }; },
  '1809': () => { const n = 5, th = (180 * (n - 2)) / n, S = (10 * 10 * th) / 360; assert.deepEqual([th, S], [108, 30]); return { allowed: [180, n, 2, 10, th, 360, S], note: '정오각형 108° · π×10²×108/360=30π' }; },
  'rot': () => { const r = 3, th = 60, R = 2 * r, S = (R * R * th) / 360; assert.equal(S, 6); return { allowed: [r, 2, 1, 9, R, th, 360, S], note: '반지름 3 반원 ½π3²=9π/2 · 부채꼴 반지름 6, 60° · π6²60/360=6π' }; },
  'y12#둘레': () => { const R = 5, a = 2, b = 3, tot = R + a + b; assert.equal(R, a + b); return { allowed: [1, 2, R, a, b, tot], note: '반지름 5·2·3 · 호 5π+2π+3π=10π' }; },
  'y12#넓이': () => { const R = 5, a = 2, b = 3, big = (R * R) / 2, sa = (a * a) / 2, sb = (b * b) / 2, x = big - sa - sb; assert.equal(x, 6); return { allowed: [1, 2, R, a, b, 25, 9, x], note: '25π/2 − 2π − 9π/2 = 6π' }; },
  'cc08#둘레': () => { const R = 10, r = R / 2, tot = 2 * R + 2 * r + 2 * r; assert.equal(tot, 40); return { allowed: [2, R, r, 2 * R, 2 * r, tot], note: '20π+10π+10π=40π' }; },
  'cc08#넓이': () => { const R = 10, r = R / 2, x = R * R - 2 * r * r; assert.equal(x, 50); return { allowed: [2, R, r, R * R, r * r, x], note: '100π−25π−25π=50π' }; },
  'sj1#둘레': () => { const a = 2, b = 4, R = (a + b) / 2, p = a / 2, q = b / 2, tot = R + p + q; assert.equal(tot, 6); return { allowed: [1, 2, R, p, q, tot], note: '반지름 3·1·2 · 3π+π+2π=6π' }; },
  'sj1#넓이': () => { const a = 2, b = 4, R = (a + b) / 2, p = a / 2, q = b / 2, x = (R * R) / 2 + (p * p) / 2 - (q * q) / 2; assert.equal(x, 3); return { allowed: [1, 2, R, p, q, 9, x], note: '9π/2+π/2−2π=3π' }; },
  'petal15': () => { const a = 8, r = a / 2, one = (r * r * 60) / 360, tot = 3 * 8; assert.ok(Math.abs(one - 8 / 3) < 1e-12); return { allowed: [a, r, 60, 360, 1, 2, 3, 8, tot / 3], note: '한 변 8 · 반지름 4 · 꽃잎 π4²60/360=8π/3 · 3개 8π' }; },
  'f5-ring': () => { const A = 15, B = 10, C = 72, o = (2 * A * C) / 360, i = (2 * B * C) / 360, line = A - B; assert.deepEqual([o, i, line], [6, 4, 5]); return { allowed: [2, A, C, 360, B, line, o, i, o + i, line * 2], note: '15 10 72° · 바깥 호 6π · 아랫변 5 · 안쪽 호 4π · 옆변 5 · 합 10π+10' }; },
  'f5-sn': () => { const A = 4, d = 3 * A, arcs = [A, A / 2, A, A / 2].map((r) => (2 * r * 180) / 360); assert.deepEqual(arcs, [4, 2, 4, 2]); return { allowed: [d, A, A / 2, 2 * A, 180, 360, 1, 2, 3, 4, arcs.reduce((x, y) => x + y, 0)], note: 'AD=12 · 반지름 4·2·4·2 · 호 4π 2π 4π 2π · 합 12π' }; },
  'rl-tri': () => { const a = 3, th = 180 - 60, arc = (2 * a * th) / 360, tot = 2 * arc; assert.deepEqual([th, arc, tot], [120, 2, 4]); return { allowed: [a, 180, 60, th, 2, 360, arc, tot], note: '한 변 3 · 중심각 180°−60°=120° · 호 2π 둘 · 4π' }; },
  'gt-warehouse': () => { const A = 5, B = 4, L = 7, big = (L * L * 270) / 360, d = (L - B) ** 2 / 4, bb = (L - A) ** 2 / 4, tot = big + d + bb; assert.deepEqual([L - B, L - A, big, d, bb, tot], [3, 2, 36.75, 2.25, 1, 40]); return { allowed: [A, B, L, L - B, L - A, 270, 90, 180, 360, 2, 147, 4, 9, tot], note: '가로 5 · 세로 4 · 끈 7 · 남은 끈 3, 2 · 큰 부채꼴 147π/4 · 9π/4 · π · 합 40π' }; },
  'sw-square': () => { const a = 3, r = 1, rect = a * (2 * r), n = 4, area = rect * n, sec = (2 * r) ** 2; assert.deepEqual([rect, area, sec], [6, 24, 4]); return { allowed: [r, a, 2 * r, 2, rect, n, area, 90, 360, sec], note: '변 3 · 반지름 1 · 직사각형 3×2=6 · 4개 24 · 부채꼴 4개 = 반지름 2인 원 π·2²=4π · 24+4π' }; },
  'rl-turn60': () => { const r = 9, th = 180 - 60, arc = (2 * r * th) / 360; assert.deepEqual([th, arc], [120, 6]); return { allowed: [r, 60, 180, th, 2, 360, arc], note: 'AC=9 · ∠ACB=60° · 중심각 180°−60°=120° · 호 2π·9·120/360=6π' }; },
  'gt-tri': () => { const S = 8, L = 10, small = (L - S) ** 2 / 3, big = (L * L * 300) / 360, tot = Math.round((big + 2 * small) * 1e9) / 1e9; assert.equal(tot, 86); return { allowed: [S, L, L - S, 2, 60, 180, 360, 300, 120, 250, 3, 4, tot], note: '한 변 8 · 끈 10 · 남은 끈 2 · 큰 부채꼴 250π/3(300°) · 작은 부채꼴 4π/3 둘(120°) · 86π' }; },
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
  'f1-ss2': (lesson) => {
    if (lesson.label === '둘레') { const a = 6, h = a / 2, semi = 2 * h * 0.5, quarter = 2 * a * 0.25; assert.deepEqual([semi, quarter], [3, 3]); return { allowed: [2, h, a, 1, 4], note: '반원의 호 3π · 부채꼴의 호 2π×6×1/4=3π · 한 변 6 · 6π+6' }; }
    const a = 6, whole = (a * a * 90) / 360, rr = a / 2, part = (rr * rr) / 2, res = whole - part; // π 의 계수
    assert.deepEqual([whole, rr, part, res], [9, 3, 4.5, 4.5]);
    return { allowed: [a, 90, 360, whole, rr, 1, 2], note: 'a=6 부채꼴 9π · 반원 반지름 3 · 넓이 9π/2(분자 9, 분모 2)' };
  }
};
// 둘레·넓이 두 해설을 가진 f02 장면: 해설 label 로 나눈 항목을 부릅니다
for (const id of ['y12', 'cc08', 'sj1']) FACTS[id] = (lesson) => FACTS[id + '#' + lesson.label]();

const plainText = (say) => String(say).replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '$1/$2').replace(/\\frac(\d)(\d)/g, '$1/$2').replace(/\*\*/g, '');
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
  for (const { id, lesson } of entries) assert.equal(lesson.tab === 'review', REVIEW_OK.has(id) || REVIEW_OK.has(keyOf(id, lesson)), `${id}: tab 은 REVIEW_OK 장면에만`);
});

test('z3-sectorProof·z3-circleProof: 결론 라벨은 해설이 csShowS 를 켤 때까지 아끼고(장면 소스), 결론 자막과 함께 켠다', () => {
  assert.match(html, /const guided = !!\(st\.lessonOn \|\| st\.lessonEntry\)/, '해설 진입·재생 표시');
  assert.match(html, /if \(!guided \|\| \(st\.lessonOn && st\.csShowS\)\) T\(b, \{ x: xc, y: Yb \}/, 'S 라벨은 진입에서 보류하고 결론 자막에서 공개');
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
    if (name === 'f01') {
      assert.match(src, /const lesson = !problem && !!\(s\.lessonOn \|\| s\.lessonEntry\), entry = !!s\.lessonEntry/);
      assert.match(src, /const open = \(key\) => !lesson \|\| \(!entry && !!s\[K\(key\)\]\)/);
      assert.match(src, /lessonHold: !open\('show'\)/, 'f01: 해설 진입·재생에서만 hold');
    } else {
      assert.match(src, /const lesson = \(sp\.id === 'circ2' \|\| sp\.id === 'turn'\) && !!\(s\.lessonOn \|\| s\.lessonEntry\)/, 'f04: 신규 두 장면의 해설 진입·재생 범위');
      assert.match(src, /lessonHold: lesson \? !!\(s\.lessonEntry \|\| !s\[K\('show'\)\]\) : !!\(s\.lessonOn && !s\[K\('show'\)\]\)/, 'f04: 신규 장면은 진입에서 보류, 기존 장면은 재생 중 show까지 보류');
    }
    assert.match(src, /w === 'r' \? \(c\.lessonHold \? 0 : seg01\(c\.res, 0\.2, 0\.8\)\) : 1\)/, `${name}: 결과 라벨은 hold 동안 0`);
    assert.match(src, /c\.res > 0\.5 && !c\.lessonHold/, `${name}: 결과 칩`);
    assert.match(src, /c\.lessonHold \? 0 : seg01\(res, 0\.5, 1\)/, `${name}: 결과 캡션`);
  }
  // f03·rolling·swept 의 같은 장치: 해설 재생 중에만 정답을 아끼는 hold
  assert.match(read('f03.js'), /hold: !thumb && !!\(\(s\.lessonOn \|\| \(lesson && s\.lessonEntry\)\) && !s\.f3Show\)/, 'f03 hold');
  assert.match(read('f03.js'), /if \(!C\.hold\) tx\(b, C, m, piP\(M\.arc\)/, 'f03 정답 줄');
  assert.match(read('rolling.js'), /const hold = !!\(s\.lessonOn && !s\.rlShow\)/, 'rolling hold');
  assert.match(read('rolling.js'), /allDone && !hold/, 'rolling 띠 제목');
  assert.match(read('swept.js'), /const hold = lesson && \(s\.lessonEntry \|\| !s\.gtShow\)/, 'swept hold');
  assert.match(read('swept.js'), /done && !hold/, 'swept 칩·요약');
  // basic.js: 해설 진입 화면(lessonEntry)은 정리 탭 0단계 그림으로(구하는 값 「?」), 일반 화면은 그대로
  assert.match(basic, /const entry = mode0 === 'explore' && !!s\.lessonEntry;/, 'basic 진입 화면');
  assert.match(f04, /hideRes: true/, 'f4-swirl: 결과가 나오면 r=3 라벨을 지우는 표시(재생 중에만)');
  assert.match(f04, /c\.s && c\.s\.lessonOn && it\.hideRes/, 'hideRes 는 재생 중에만');
  // 해설이 이 표시를 쓰는 규칙: show 는 첫 장 at:0 에서 false, 결론 자막에서 true
  for (const [id, key] of [['f4-swirl', 'f4_swirl_show'], ['f1-ss2', 'f1_ss2_show'], ['f3-leaf-len', 'f3Show'], ['rl-rect', 'rlShow'], ['gt-kennel', 'gtShow'], ['rl-tri', 'rlShow'], ['gt-warehouse', 'gtShow'], ['sw-square', 'swShow'], ['rl-turn60', 'rlShow'], ['gt-tri', 'gtShow'], ['f4-sq12', 'f4_sq12_show'], ['f4-slideq', 'f4_slideq_show'], ['f4-inscr', 'f4_inscr_show'], ['f4-ringmv', 'f4_ringmv_show'], ['f1-ring', 'f1_ring_show'], ['f1-lens', 'f1_lens_show'], ['f1-ex22', 'f1_ex22_show']]) {
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

test('z2-sector: 점 P 목표값이 경계 길이 비율(호 3π, 반지름 6, 6)로 다시 계산한 값과 같다', () => {
  const lesson = core.lessonList(LESSONS['z2-sector'])[0];
  const arc = 3 * Math.PI, total = arc + 12, cum1 = (100 * arc) / total, cum2 = (100 * (arc + 6)) / total;
  const ends = lesson.chapters.map((ch) => ch.cues.flatMap((c) => (c.to && c.to.csP != null ? [c.to.csP] : [])).at(-1));
  assert.ok(Math.abs(ends[0] - cum1) < 1e-9 && Math.abs(ends[1] - cum2) < 1e-9 && ends[2] === 100, '경계 끝에서 멈춤(정확한 값이라야 점 P 라벨이 「3π cm」처럼 깨끗이 나옴)');
  assert.deepEqual(Array.from(lesson.chapters.flatMap((ch) => ch.cues.filter((c) => c.step !== undefined).map((c) => c.step))), [1, 2, 3, 4], '정리 탭 단계: 1(조건) → 2(호 계산) → 3(둘째 선) → 4(합계, 마지막 자막)');
  assert.ok(lesson.chapters[0].cues.find((c) => c.step === 2).say.includes('\\pi'), '호 결과 공개는 계산 자막과 함께');
  const lastCue = lesson.chapters.at(-1).cues.at(-1);
  assert.ok(lastCue.step === 4 && lastCue.say.includes('3\\pi+12'), '합계는 마지막 자막과 함께(step 4)');
  assert.ok(lesson.chapters.flatMap((ch) => ch.cues).every((c) => !(c.to && c.step !== undefined)), '같은 칸에 to 와 step 을 함께 쓰지 않는다');
});

test('z2-semi·quarter·segment: 점 P 목표값이 경계 길이 비율로 다시 계산한 값과 같고 step 이 호 → (둘째 선) → 합계 순서', () => {
  const P = Math.PI, want = {
    'z2-semi': { cum: [(100 * 6 * P) / (6 * P + 12)], steps: [1, 2, 3] },
    'z2-quarter': { cum: [(100 * 3 * P) / (3 * P + 12), (100 * (3 * P + 6)) / (3 * P + 12)], steps: [1, 2, 3, 4] },
    'z2-segment': { cum: [(100 * 2 * P) / (2 * P + 6)], steps: [1, 2, 3] }
  };
  for (const [id, w] of Object.entries(want)) {
    const lesson = core.lessonList(LESSONS[id])[0];
    const ends = lesson.chapters.map((ch) => ch.cues.flatMap((c) => (c.to && c.to.csP != null ? [c.to.csP] : [])).at(-1));
    w.cum.forEach((v, i) => assert.ok(Math.abs(ends[i] - v) < 1e-9, id + ' csP ' + i));
    assert.equal(ends.at(-1), 100, id + ' 끝은 100');
    assert.deepEqual(Array.from(lesson.chapters.flatMap((ch) => ch.cues.filter((c) => c.step !== undefined).map((c) => c.step))), w.steps, id + ' step');
    assert.ok(lesson.chapters[0].cues.find((c) => c.step === 2).say.includes('\\pi'), id + ' 호 결과 공개는 계산 자막과 함께');
    assert.ok(lesson.chapters.flatMap((ch) => ch.cues).every((c) => !(c.to && c.step !== undefined)), id + ' to 와 step 같은 칸 금지');
    assert.ok(lesson.chapters.at(-1).cues.at(-1).step === w.steps.at(-1), id + ' 합계는 마지막 자막과 함께');
  }
});

test('basic.js sectorSpec: thMax<350 장면(1610·1808)도 재생·진입 화면에서만 원 전체와 틀을 보인다', () => {
  const basic = read('basic.js');
  assert.match(basic, /if \(\(q\.lessonOn \|\| q\.lessonEntry\) && thMax < 350\) g\.reserve/);
  assert.match(basic, /if \(thMax < 350\) g\.arc\(O, R, thMax, 360,/);
});

test('f02.js: 해설 진입 화면은 결론 칩을 숨기고, 재생 중(lessonOn)에만 조각이 갈라지는 정도와 그림 틀을 해설 step 에 맞춘다', () => {
  const f02 = read('f02.js');
  assert.match(f02, /if \(s\.lessonEntry\) v\.chips = \[\];/);
  assert.match(f02, /!b\.thumb && s\.lessonOn && st\.tab === 'review'/);
  assert.match(f02, /s\.dragging && !s\.lessonOn && b\.__f02Focus/);
});

test('swept.js sweepView: 해설 재생 중에는 swShow 가 켜질 때까지 결과 칩·요약을 아낀다', () => {
  assert.match(read('swept.js'), /const done = t >= 0\.96 && \(!lesson \|\| \(!s\.lessonEntry && s\.swShow\)\);/);
  assert.match(read('swept.js'), /swT: \{ value: 0, min: 0, max: 1/);
});

test('rolling.js: 호가 하나뿐인 장면은 해설 재생 중 호의 길이(정답)도 hold 한다', () => {
  const rolling = read('rolling.js');
  assert.match(rolling, /const sole = hold && M\.arcs\.length === 1;/);
  assert.match(rolling, /const partial = sole \|\| M\.arcs\.some/);
  assert.match(rolling, /fracOf\(a\) >= 1 - 1e-9 && !sole && \(!s\.lessonOn \|\| s\.rlRead == null \|\| a\.arc < s\.rlRead\) \?/);
});

test('f05.js: 해설 진입 화면·재생 중에는 「▶ 재생하면…」 안내(해설 ▶ 와 헷갈림)를 뺀다', () => {
  assert.match(read('f05.js'), /s\.lessonEntry \|\| s\.lessonOn \? '' : '▶ 재생하면 조각마다 길이를 구해요'/);
});

// 정답(answer)이 장면 값으로 계산한 결과와 같다 — 숫자는 장면 공식에서 계산하고 TeX 로 적어 normAnswer 로 비교
const PI = (k) => (k === 1 ? '\\pi' : k + '\\pi');
const EXPECT = {
  'z3-sectorProof': () => PI((6 * 6 * 120) / 360),
  'z3-circleProof': () => PI(6 * 6),
  '1209#호의 길이': () => PI((2 * 12 * 120) / 360),
  '1209#넓이': () => PI((12 * 12 * 120) / 360),
  '1102': () => String((6 * 45) / 30 + (30 * 15) / 6),
  '1609': () => (360 * (27 / 81)) + '°',
  '1610': () => { const r = (4 * 360) / (2 * 80); return PI((r * r * 80) / 360); },
  '1808': () => String((3 * 360) / 45 / 2),
  'z2-sector': () => PI((6 * 90) / 180) + '+' + (2 * 6),
  'z2-semi': () => PI(6) + '+' + (2 * 6),
  'z2-quarter': () => PI((6 * 90) / 180) + '+' + (2 * 6),
  'z2-segment': () => PI((6 * 60) / 180) + '+' + 6,
  'f4-swirl': () => PI((6 * 6) / 2),
  'f1-ss2#넓이': () => { const w = (6 * 6 * 90) / 360, p = (3 * 3) / 2; return PI(w) + '-\\frac{' + PI(2 * p) + '}{2}=\\frac{' + PI(2 * (w - p)) + '}{2}'; },
  'f1-ss2#둘레': () => PI(2 * 3 * 0.5 + 2 * 6 * 0.25) + '+' + 6,
  'f1-star#넓이': () => (10 * 10) + '-' + PI((10 / 2) ** 2),
  'f1-star#둘레': () => PI(4 * ((2 * 5) / 4)),
  'f4-slide': () => String(10 * (2 * 3)),
  'f3-leaf-len': () => PI(2 * ((6 * 90) / 180)),
  'f5-sq4': () => 4 * (2 * 3) + '+' + PI(2 * 3),
  'rl-rect': () => PI(3 / 2 + 5 / 2 + 2),
  'gt-kennel': () => PI((4 * 4 * 270) / 360 + 2 * ((2 * 2 * 90) / 360)),
  'f4-sq12': () => String((12 * 12) / 2),
  'f4-slideq': () => String(10 * 6),
  'f4-inscr': () => String(4 * (2 * 4)),
  'f4-ringmv': () => PI((6 * 6 * 60) / 360),
  'f1-ring': () => { const big = (6 * 6 * 90) / 360; return PI(big) + '-\\frac{' + PI(big) + '}{4}=\\frac{' + PI(big * 3) + '}{4}'; },
  'f1-lens': () => (2 * 8 * 8) + '-' + PI(2 * ((8 * 8) / 4)), // 64 − (32π − 64) = 128 − 32π
  'f1-ex22': () => (4 * 4) + '-' + PI(2),
  '1103': () => (360 * 3) / 15 + '°',
  '1106': () => PI((24 * 40) / 120),
  '1807': () => 105 / 3 + '°',
  '1104': () => PI((4 * (180 - 2 * 40)) / 40),
  '1105': () => PI((7 * (180 - 2 * 42)) / 42),
  '1719': () => (180 - (180 * 4) / 5) / 2 + '°',
  '1809': () => PI((10 * 10 * ((180 * 3) / 5)) / 360),
  'rot': () => PI((6 * 6 * 60) / 360),
  'y12#둘레': () => PI(5 + 2 + 3),
  'y12#넓이': () => PI(25 / 2 - 2 - 9 / 2),
  'cc08#둘레': () => PI(20 + 10 + 10),
  'cc08#넓이': () => PI(100 - 25 - 25),
  'sj1#둘레': () => PI(3 + 1 + 2),
  'sj1#넓이': () => PI(9 / 2 + 1 / 2 - 2),
  // 정답을 식 전체로 둔 이유: 장면 라벨 「+ 8π/3」 안에 「8π」 글자가 있어, 값만 두면 감사가 「정답이 결론 전에 그려짐」으로 오판합니다(식 전체는 마지막에만 나옴)
  'petal15': () => '3\\times\\frac{' + PI(Math.round(((4 * 4 * 60) / 360) * 3 * 1e9) / 1e9) + '}{3}=' + PI(Math.round(3 * ((4 * 4 * 60) / 360) * 1e9) / 1e9),
  'f5-ring': () => PI((2 * 15 * 72) / 360 + (2 * 10 * 72) / 360) + '+' + 2 * (15 - 10),
  'f5-sn': () => PI(4 + 2 + 4 + 2),
  'rl-tri': () => PI(2 * ((2 * 3 * 120) / 360)),
  'gt-warehouse': () => PI((7 * 7 * 270) / 360 + (3 * 3 * 90) / 360 + (2 * 2 * 90) / 360),
  'sw-square': () => 3 * 2 * 4 + '+' + PI((2 * 1) ** 2),
  'rl-turn60': () => PI((2 * 9 * 120) / 360),
  'gt-tri': () => PI(Math.round(((10 * 10 * 300) / 360 + 2 * ((2 * 2 * 120) / 360)) * 1e9) / 1e9)
};
test('해설마다 answer 가 장면 값으로 계산한 정답과 같다', () => {
  for (const { id, lesson, list } of entries) {
    const key = list.length > 1 ? id + '#' + lesson.label : id;
    assert.ok(EXPECT[key], key + ': EXPECT 표');
    const want = EXPECT[key]();
    assert.equal(core.normAnswer(lesson.answer), core.normAnswer(want), key + ' answer');
  }
});

// production HTML 모듈 로더와 실제 scene.enter 를 사용해 그림의 수치를 얻습니다.
// DOM/캔버스 가독성을 검증하는 브라우저 검수와는 별개의 수학·데이터 결속 검사입니다.
async function loadSourceLab() {
  let definition, context;
  const ready = [];
  const document = {
    documentElement: { dataset: {} }, getElementById() { return null; }, querySelector() { return null; },
    createElement(tag) { return { tagName: tag.toUpperCase(), remove() {} }; }, addEventListener() {},
    head: { append(el) {
      if (el.tagName !== 'SCRIPT') return;
      vm.runInContext(fs.readFileSync(path.join(labsDir, el.src), 'utf8'), context, { filename: el.src });
      el.onload();
    } }
  };
  const sandbox = {
    document, console, Math, URLSearchParams, location: { hash: '', search: '', pathname: '' }, history: { replaceState() {} },
    APLab: { clamp: (v, a, b) => Math.max(a, Math.min(b, v)), esc: (s) => String(s), renderMath: (s) => s, createLab: (d) => { definition = d; } },
    addEventListener: (type, fn) => { if (type === 'DOMContentLoaded') ready.push(fn); }
  };
  sandbox.window = sandbox;
  context = vm.createContext(sandbox);
  const script = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map((x) => x[1]).find((s) => s.includes('const PI = Math.PI'));
  assert.ok(script, 'production inline scene definitions');
  vm.runInContext(script, context, { filename: 'g7-circle-sector.html' });
  ready.forEach((fn) => fn());
  await Promise.resolve();
  await Promise.resolve();
  assert.ok(definition, 'production module loader creates the lab');
  return definition;
}
const SOURCE_LAB = await loadSourceLab();
const SOURCE_SCENES = new Map(SOURCE_LAB.groups.flatMap((g) => g.scenes).map((scene) => [scene.id, scene]));
function playbackInput(id, lesson) {
  const scene = SOURCE_SCENES.get(id);
  assert.ok(scene, `${id}: 실제 장면이 있어야 합니다`);
  const s = { ...SOURCE_LAB.state };
  for (const [key, param] of Object.entries(SOURCE_LAB.params)) s[key] = param.value;
  // apl-player.play → apl-shell.goScene 은 같은 장면 재생에도 enter 를 다시 호출합니다.
  // 그러므로 start 가 없는 step형 해설도 기본값 복원 결과로 검산해야 합니다.
  scene.enter?.(s, null);
  return Object.assign(s, lesson.chapters[0].start || {});
}

// answer 를 수치로도 읽어 표현 방식(9π/2, (9/2)π, 전체 등식)이 검산/선공개 검사를 우회하지 못하게 합니다.
// 임의 JS를 실행하지 않는 작은 사칙연산 파서입니다. 변수·단위가 섞인 자막은 이 파서의 대상이 아닙니다.
function arithmeticValue(tex) {
  let src = String(tex).replace(/[$\s°]/g, '').replace(/\\(?:left|right)/g, '').replace(/\\(?:times|cdot)/g, '*').replace(/\\pi/g, 'π').replace(/−/g, '-');
  for (let prev; prev !== src;) {
    prev = src;
    src = src.replace(/\\(?:d?frac|tfrac)\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))');
  }
  src = src.replace(/\\frac(\d)(\d)/g, '($1/$2)').replace(/\{/g, '(').replace(/\}/g, ')');
  const raw = src.match(/\d+(?:\.\d+)?|π|[()+\-*/]/g) || [];
  if (!raw.length || raw.join('') !== src) throw new Error(`순수 수식이 아님: ${tex}`);
  const tokens = [];
  const endsAtom = (t) => t === ')' || t === 'π' || /^\d/.test(t || '');
  const startsAtom = (t) => t === '(' || t === 'π' || /^\d/.test(t || '');
  for (const token of raw) {
    if (endsAtom(tokens.at(-1)) && startsAtom(token)) tokens.push('*');
    tokens.push(token);
  }
  let i = 0;
  function atom() {
    const t = tokens[i++];
    if (t === '+') return atom();
    if (t === '-') return -atom();
    if (t === 'π') return Math.PI;
    if (t === '(') { const v = sum(); if (tokens[i++] !== ')') throw new Error('닫는 괄호 누락'); return v; }
    if (/^\d/.test(t || '')) return Number(t);
    throw new Error(`수식 피연산자 오류: ${tex}`);
  }
  function product() {
    let v = atom();
    while (tokens[i] === '*' || tokens[i] === '/') { const op = tokens[i++], rhs = atom(); v = op === '*' ? v * rhs : v / rhs; }
    return v;
  }
  function sum() {
    let v = product();
    while (tokens[i] === '+' || tokens[i] === '-') { const op = tokens[i++], rhs = product(); v = op === '+' ? v + rhs : v - rhs; }
    return v;
  }
  const value = sum();
  if (i !== tokens.length || !Number.isFinite(value)) throw new Error(`수식 해석 실패: ${tex}`);
  return value;
}
const near = (a, b) => Math.abs(a - b) < 1e-8;
const arc = (r, theta) => 2 * Math.PI * r * theta / 360;
const sector = (r, theta) => Math.PI * r ** 2 * theta / 360;

// 원본 문제의 수치를 실제 초기 상태에서 읽되, 제작 코드의 정답/모델 함수는 호출하지 않고 독립 공식으로 계산합니다.
const SOURCE_CALC = {
  'z3-sectorProof': (s) => sector(s.csR, s.csS),
  'z3-circleProof': (s) => Math.PI * s.csR ** 2,
  '1209': (s, l) => l.label === '호의 길이' ? arc(s.b1209_r, s.b1209_th) : sector(s.b1209_r, s.b1209_th),
  '1102': (s) => { const givenArc = s.b1102_u * s.b1102_t1 / 5, otherArc = s.b1102_u * s.b1102_y / 5; return givenArc * s.b1102_t2 / s.b1102_t1 + s.b1102_t1 * otherArc / givenArc; },
  '1103': (s) => 360 * s.b1103_a / (s.b1103_a + s.b1103_b + s.b1103_c),
  '1104': (s) => arc(s.b1104_r, 180 - 2 * s.b1104_al),
  '1105': (s) => arc(s.b1105_r, 180 - 2 * s.b1105_be),
  '1106': (s) => { const givenArea = Math.PI * s.b1106_S * s.b1106_al / 360; return givenArea * s.b1106_be / s.b1106_al; },
  '1609': (s) => 360 * sector(s.b1609_r, s.b1609_th) / (Math.PI * s.b1609_r ** 2),
  '1610': (s) => { const givenArc = arc(s.b1610_r, s.b1610_th), r = givenArc * 360 / (2 * Math.PI * s.b1610_th); return sector(r, s.b1610_th); },
  '1719': (s) => (180 - 180 * s.b1719_n / (s.b1719_n + 1)) / 2,
  '1807': (s) => s.b1807_cof / 3,
  '1808': (s) => arc(s.b1808_r, s.b1808_th) * 360 / s.b1808_th / (2 * Math.PI),
  '1809': (s) => { const n = [3, 4, 5, 6, 8][s.b1809_i - 1]; return sector(s.b1809_r, 180 * (n - 2) / n); },
  'z2-sector': (s) => arc(s.csR, s.csA) + 2 * s.csR,
  'z2-semi': (s) => arc(s.csR, 180) + 2 * s.csR,
  'z2-quarter': (s) => arc(s.csR, 90) + 2 * s.csR,
  'z2-segment': (s) => arc(s.csR, s.csS) + 2 * s.csR * Math.sin(s.csS * Math.PI / 360),
  'f4-swirl': (s) => sector(s.f4_swirl_R, 180),
  'f1-ss2': (s, l) => l.label === '둘레' ? arc(s.f1_ss2_a, 90) + arc(s.f1_ss2_a / 2, 180) + s.f1_ss2_a : sector(s.f1_ss2_a, 90) - sector(s.f1_ss2_a / 2, 180),
  'f1-star': (s, l) => l.label === '둘레' ? 4 * arc(s.f1_star_a / 2, 90) : s.f1_star_a ** 2 - 4 * sector(s.f1_star_a / 2, 90),
  'f4-slide': (s) => s.f4_slide_W * 2 * s.f4_slide_r,
  'f3-leaf-len': (s) => 2 * arc(s.f3a, 90),
  'f5-sq4': (s) => 4 * 2 * s.f5A + 4 * arc(s.f5A, 90),
  'rl-rect': (s) => { assert.equal(s.cfg.track, 0); assert.equal(s.cfg.rolls, 3); return [s.cfg.w, Math.hypot(s.cfg.w, s.cfg.h), s.cfg.h].reduce((v, r) => v + arc(r, 90), 0); },
  'gt-kennel': (s) => { assert.ok(s.gtL >= s.gtQ && s.gtL <= 2 * s.gtQ, '인접 모서리 두 곳까지만 닿는 조건'); return sector(s.gtL, 270) + 2 * sector(s.gtL - s.gtQ, 90); },
  'f4-sq12': (s) => s.f4_sq12_a ** 2 / 2,
  'f4-slideq': (s) => s.f4_slideq_W * s.f4_slideq_H,
  'f4-inscr': (s) => (2 * s.f4_inscr_r) ** 2 / 2,
  'f4-ringmv': (s) => sector(s.f4_ringmv_R, s.f4_ringmv_th),
  'f1-ring': (s) => sector(s.f1_ring_R, s.f1_ring_th) - sector(s.f1_ring_r, s.f1_ring_th),
  'f1-lens': (s) => 2 * s.f1_lens_a ** 2 - 2 * sector(s.f1_lens_a, 90),
  'f1-ex22': (s) => s.f1_ex22_a ** 2 - (sector(s.f1_ex22_a, 90) - sector(s.f1_ex22_a / 2, 180)),
  'rot': (s) => sector(2 * s.f02_rot_r, s.f02_rot_th),
  'y12': (s, l) => { const p = s.f02_y12_p, q = s.f02_y12_q; return l.label === '둘레' ? arc(p + q, 180) + arc(p, 180) + arc(q, 180) : sector(p + q, 180) - sector(p, 180) - sector(q, 180); },
  'cc08': (s, l) => { const R = s.f02_cc08_R; return l.label === '둘레' ? arc(R, 360) + 2 * arc(R / 2, 360) : sector(R, 360) - 2 * sector(R / 2, 360); },
  'sj1': (s, l) => { const p = s.f02_sj1_a / 2, q = s.f02_sj1_b / 2; return l.label === '둘레' ? arc(p + q, 180) + arc(p, 180) + arc(q, 180) : sector(p + q, 180) + sector(p, 180) - sector(q, 180); },
  'petal15': (s) => 3 * sector(s.f02_petal15_a / 2, 60),
  'f5-ring': (s) => arc(s.f5A, s.f5C) + arc(s.f5B, s.f5C) + 2 * (s.f5A - s.f5B),
  'f5-sn': (s) => [s.f5A, s.f5A / 2, s.f5A, s.f5A / 2].reduce((v, r) => v + arc(r, 180), 0),
  'rl-tri': (s) => { assert.equal(s.cfg.track, 0); assert.equal(s.cfg.rolls, 2); return 2 * arc(s.cfg.a, 180 - 60); },
  'gt-warehouse': (s) => { assert.ok(s.gtL >= Math.max(s.gtA, s.gtB) && s.gtL <= s.gtA + s.gtB); return sector(s.gtL, 270) + sector(s.gtL - s.gtA, 90) + sector(s.gtL - s.gtB, 90); },
  'sw-square': (s) => 4 * s.swA * (2 * s.swR) + Math.PI * (2 * s.swR) ** 2,
  'rl-turn60': (s) => { assert.equal(s.cfg.at, 'C'); assert.equal(s.cfg.track, 2); assert.equal(s.cfg.rolls, 1); return arc(s.cfg.d, 180 - s.cfg.deg); },
  'gt-tri': (s) => { assert.ok(s.gtL >= s.gtS && 2 * (s.gtL - s.gtS) <= s.gtS, '뒷변 쪽 두 작은 부채꼴이 겹치지 않는 조건'); return sector(s.gtL, 300) + 2 * sector(s.gtL - s.gtS, 120); }
};

for (const { id, lesson, list } of entries) {
  const name = list.length > 1 ? `${id}[${lesson.label}]` : id;
  test(`독립 검산 ${name}: 실제 장면 초기값으로 계산한 정답과 해설 등식의 모든 항이 일치`, () => {
    assert.ok(SOURCE_CALC[id], `${id}: 실제 상태값을 읽는 검산 공식`);
    const s = playbackInput(id, lesson), want = SOURCE_CALC[id](s, lesson);
    assert.ok(Number.isFinite(want), `${id}: 유한한 수학 결과`);
    for (const expression of lesson.answer.split('=')) assert.ok(near(arithmeticValue(expression), want), `${name}: ${expression} ≠ ${want}`);
  });
  test(`선공개 수치 검사 ${name}: 전체식 answer 도 최종 수치와 같은 앞 장의 계산 결과를 숨기지 못한다`, () => {
    const answer = arithmeticValue(lesson.answer.split('=').at(-1));
    for (const ch of lesson.chapters.slice(0, -1)) for (const cue of ch.cues) {
      for (const match of String(cue.say || '').matchAll(/\$([^$]+)\$/g)) for (const expression of match[1].split('=')) {
        // 아직 계산하지 않은 대입식은 허용합니다. 예: 2π×10+2π×5+2π×5.
        // 검사 대상은 40π나 9π/2처럼 계산해 공개한 수치 결과입니다.
        if (/\\(?:times|cdot)|[×*^]/.test(expression)) continue;
        let value;
        try { value = arithmeticValue(expression); } catch { continue; }
        assert.ok(!near(value, answer), `${name}: 마지막 장 전 정답 수치 공개: ${cue.say}`);
      }
    }
  });
}

test('cc08 원 둘레 정리 단계는 반원 계수 ½를 원의 둘레 공식으로 잘못 안내하지 않는다', () => {
  const lesson = core.lessonList(LESSONS.cc08)[0], s = playbackInput('cc08', lesson);
  const steps = SOURCE_SCENES.get('cc08').steps(s);
  assert.doesNotMatch(steps[1], /½|\\frac12|\\frac\{1\}\{2\}/, '원은 중심각 360°이므로 원 둘레 2πr에 ½를 곱하지 않습니다');
});

// Canvas/DOM을 표시하지 않는 명령 기록기: 공개 시점과 수동 화면 회귀만 검증합니다.
// 390×844 실제 브라우저 캡처의 대체물이 아닙니다.
function f02Recorder() {
  const ctx = () => new Proxy({ measureText: (text) => ({ width: String(text).length * 8 }) }, { get: (o, k) => k in o ? o[k] : () => {} });
  const canvas = () => ({ width: 390, height: 326, getContext: () => ctx() });
  const document = { documentElement: { dataset: {} }, getElementById() {}, createElement: (tag) => tag === 'canvas' ? canvas() : {}, head: { append() {} }, addEventListener() {} };
  const context = vm.createContext({ window: {}, document });
  vm.runInContext(read('f02.js'), context, { filename: 'f02.js' });
  const scenes = new Map(context.window.APL_CS_GROUPS.flatMap((g) => g.scenes).map((s) => [s.id, s]));
  return (id, patch, tab) => {
    const scene = scenes.get(id), s = { step: 1, ...patch };
    scene.enter(s, null);
    Object.assign(s, patch);
    const calls = [], b = {
      kind: 'figure', k: 24, fs: 1, font: 'sans-serif', dpr: 1, canvas: canvas(), ctx: ctx(), _ts: () => 1,
      color: (name, alpha) => `${name}:${alpha}`, toS: (x, y) => ({ x: 195 + x * 24, y: 163 + y * 24 }),
      fitBox: (bb) => bb, setFocus: (focus) => { b.focus = focus; },
      path: (points, options) => calls.push(['path', points, options]),
      point: (point, options) => calls.push(['point', point, options]),
      text: (point, text, options) => calls.push(['text', point, String(text), options]),
      handle: (id, point) => calls.push(['handle', id, point])
    };
    const lab = { tab, invalidate() {} }, view = scene.view(s, lab);
    scene.draw(b, s, view, lab);
    return { view, calls: JSON.parse(JSON.stringify(calls)), texts: calls.filter((c) => c[0] === 'text').map((c) => c[2]) };
  };
}
const recordF02 = f02Recorder();

test('rot: 반지름 의미를 설명할 때 9π/2 칩을 보류하고 계산 자막에서만 연다', () => {
  const held = recordF02('rot', { lessonOn: true, f02Read: false, step: 1 }, 'review');
  const shown = recordF02('rot', { lessonOn: true, f02Read: true, step: 1 }, 'review');
  assert.equal(held.view.chips.length, 0);
  assert.equal(held.view.formula, '');
  assert.ok(held.texts.includes('3 cm'), '설명하는 반원의 반지름은 그림에 남아 있습니다');
  assert.ok(shown.view.chips.some((c) => c.tex.includes('9') && c.tex.includes('2')), '계산 허용 시 반원 넓이 칩');
});

test('rot: 분리한 조각이 돌아오는 첫 프레임에도 부채꼴의 6 cm·60° 조건이 보인다', () => {
  const first = recordF02('rot', { lessonOn: true, f02Read: false, step: 4, f02uShow: 1 }, 'review');
  assert.ok(first.texts.includes('6 cm'));
  assert.equal(first.texts.filter((s) => s === '60°').length, 1, '중심각은 한 번 표시');
});

for (const [id, radii] of [['y12', [5, 2, 3]], ['sj1', [3, 1, 2]], ['cc08', [10, 5]]]) {
  test(`${id}: 분리한 그림의 반지름을 먼저 보이고 f02Read 이후 둘레·넓이 식을 연다`, () => {
    for (const step of [2, 5]) {
      const patch = { lessonOn: true, step, f02uShow: 1, f02Dims: true };
      const hidden = recordF02(id, { ...patch, f02Read: false, f02Dims: false }, 'review');
      assert.ok(hidden.texts.every((text) => !/^r = /.test(text)), '의미 설명 전 파생 반지름 보류');
      const held = recordF02(id, { ...patch, f02Read: false }, 'review');
      const shown = recordF02(id, { ...patch, f02Read: true }, 'review');
      assert.equal(held.view.chips.length, 0);
      for (const r of radii) assert.ok(held.texts.includes(`r = ${r} cm`), `${id} step${step}: 반지름 ${r} 표시`);
      assert.ok(held.texts.every((text) => !/[π×²]/.test(text)), '뜻을 설명하는 동안 조각 계산식·값 보류');
      assert.ok(shown.view.chips.length > 0, '계산 자막 이후 식 칩');
      assert.ok(shown.texts.some((text) => /π/.test(text)), '계산 자막 이후 그림의 식');
    }
  });
}

test('f02: f02Read 값은 lessonOn 밖 탐구·수동 정리·문제의 그림 명령과 칩을 바꾸지 않는다', () => {
  for (const id of ['rot', 'y12', 'sj1', 'cc08', 'petal15']) for (const tab of ['explore', 'review', 'problem']) for (const step of [1, 2, 4, 5]) {
    const patch = { lessonOn: false, step, f02uShow: 1 };
    const held = recordF02(id, { ...patch, f02Read: false, f02Dims: false }, tab);
    const shown = recordF02(id, { ...patch, f02Read: true, f02Dims: true }, tab);
    assert.deepEqual(held.calls, shown.calls, `${id} ${tab} step${step}: 수동 그림`);
    assert.equal(JSON.stringify(held.view.chips), JSON.stringify(shown.view.chips), `${id} ${tab} step${step}: 수동 칩`);
  }
});
