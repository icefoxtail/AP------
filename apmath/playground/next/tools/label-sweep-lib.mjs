/* ==========================================================================
   라벨 겹침·잘림 계산 (브라우저 없이 시험 가능한 순수 함수)
   label-sweep.mjs(Playwright)가 페이지에서 모은 글자 상자 목록을 받아
   겹침·잘림을 판정하고, 깨끗한 값을 구간으로 묶어 표시합니다.

   글자 상자(box) 형식: { str, l, r, t, b }
     - l, r : 왼쪽·오른쪽 x (화면 픽셀, l < r)
     - t, b : 위·아래 y (화면 픽셀, t < b)
   ========================================================================== */

/** 두 상자가 사실상 같은 글자(후광 중복)인지: 네 모서리 좌표 차가 모두 1px 이내(글자 내용이 있으면 같아야 함). */
export function sameText(a, b) {
  if (a.str != null && b.str != null && a.str !== b.str) return false;
  return Math.abs(a.l - b.l) <= 1 && Math.abs(a.r - b.r) <= 1 && Math.abs(a.t - b.t) <= 1 && Math.abs(a.b - b.b) <= 1;
}

/**
 * 두 글자 상자의 교집합 넓이가 작은 상자 넓이의 ratio(기본 15%) 이상인 쌍을 돌려줍니다.
 * 후광으로 같은 글자를 두 번 그려 생긴 자기 겹침(좌표 차 1px 이내)과 줄 간격 수준(1.5px 미만)의 닿음은 제외합니다.
 */
export function overlapPairs(boxes, ratio = 0.15, minPx = 1.5, stackPx = minPx) {
  const pairs = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      if (sameText(a, b)) continue;
      const ix = Math.min(a.r, b.r) - Math.max(a.l, b.l);
      const iy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
      if (ix <= 0 || iy <= 0) continue; // 맞닿기만 함
      // 가로로 minPx(기본 1.5px) 미만, 세로로 stackPx(기본 1.5px) 미만만 걸친 것은 줄 간격(글자 상자의 위아래 여백)이
      // 살짝 닿은 것이라 눈에는 깨끗합니다. 글자 상자는 위아래로 글자 크기의 여백을 품어서, 위아래로 쌓인 두 줄은
      // 세로 4px 안팎까지 상자가 겹쳐도 글자는 붙지 않습니다(--stack-px 4.5 로 그만큼 눈감아 볼 수 있음)(두 줄짜리 설명 글, 예: 「색칠한 부분의 넓이는?」/「조각을 옮겨 보세요」).
      if (ix < minPx || iy < stackPx) continue;
      const inter = ix * iy;
      const areaA = (a.r - a.l) * (a.b - a.t);
      const areaB = (b.r - b.l) * (b.b - b.t);
      const minArea = Math.min(areaA, areaB);
      if (minArea <= 0) continue;
      const r = inter / minArea;
      if (r >= ratio) pairs.push({ a, b, ratio: r, ix, iy, hMin: Math.min(a.b - a.t, b.b - b.t), wMin: Math.min(a.r - a.l, b.r - b.l) });
    }
  }
  return pairs;
}

/**
 * 캔버스(width×height) 밖으로 px(기본 4px) 이상 나간 글자 상자를 돌려줍니다.
 * 돌려주는 항목은 어느 쪽으로 나갔는지 side(left|right|top|bottom)를 함께 가집니다.
 */
export function clipBoxes(boxes, width, height, px = 4) {
  const out = [];
  for (const b of boxes) {
    const side =
      b.l <= -px ? 'left' :
      b.r >= width + px ? 'right' :
      b.t <= -px ? 'top' :
      b.b >= height + px ? 'bottom' : null;
    if (side) out.push({ ...b, side });
  }
  return out;
}

/**
 * 상자 목록을 받아 겹침·맞닿음·잘림 요약을 돌려줍니다(문자열과 비율만 남김).
 * - 겹침(overlaps): 교집합이 작은 상자의 overlapRatio(기본 15%) 이상
 * - 맞닿음(touches): touchRatio(기본 4%) 이상 overlapRatio 미만. 학생 눈에는 글자가 붙어 보여 불편합니다.
 * touchRatio 가 overlapRatio 보다 크면 overlapRatio 로 맞춥니다(맞닿음 구간이 비게 됨).
 */
export function analyze(boxes, width, height, overlapRatio = 0.15, clipPx = 4, touchRatio = 0.04, stackPx = 1.5) {
  const lo = Math.min(touchRatio, overlapRatio);
  const overlaps = [];
  const touches = [];
  for (const { a, b, ratio, ix, iy, hMin, wMin } of overlapPairs(boxes, lo, 1.5, stackPx)) {
    (ratio >= overlapRatio ? overlaps : touches).push({ a: a.str, b: b.str, ratio, ix, iy, hMin, wMin });
  }
  return {
    overlaps,
    touches,
    clips: clipBoxes(boxes, width, height, clipPx).map((b) => ({ str: b.str, side: b.side })),
  };
}

/** 소수 표기(float 잡음 제거) */
function fmtNum(x) {
  return String(parseFloat(x.toFixed(6)));
}

/** step 의 소수 자릿수(예: 0.02 → 2, 10 → 0) */
function decimalsOf(step) {
  const s = String(step);
  if (s.includes('e') || !s.includes('.')) return 0;
  return s.split('.')[1].replace(/0+$/, '').length;
}

/** from~to 를 step 간격으로(끝 포함). float 누적 오차는 반올림으로 정리. */
export function genRange(from, to, step) {
  const dec = decimalsOf(step);
  const f = Math.pow(10, dec);
  const n = Math.round((to - from) / step);
  const out = [];
  for (let i = 0; i <= n; i++) {
    const v = from + i * step;
    out.push(Math.round(v * f) / f);
  }
  return out;
}

/** 연속값의 최소 간격(최대공약수)을 step 으로 추정 */
function inferStep(v) {
  let g = 0;
  for (let i = 1; i < v.length; i++) {
    const d = Math.round((v[i] - v[i - 1]) * 1e6);
    g = gcd(g, d);
  }
  return g / 1e6;
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a || 1;
}

/**
 * 깨끗한(결함 없는) 값 목록을 사람이 읽기 쉽게 구간으로 묶습니다.
 * 예: [60,70,80,200] → "60~80, 200" (step 10이면 60·70·80은 연속)
 * step 을 주지 않으면 연속 차의 최대공약수로 추정합니다.
 */
export function formatRanges(values, step) {
  const v = [...values].sort((a, b) => a - b);
  if (!v.length) return '';
  if (step == null) step = inferStep(v);
  const out = [];
  let start = v[0];
  let prev = v[0];
  const push = () => out.push(start === prev ? fmtNum(start) : `${fmtNum(start)}~${fmtNum(prev)}`);
  for (let i = 1; i < v.length; i++) {
    if (step > 0 && Math.abs(v[i] - prev - step) < 1e-9) {
      prev = v[i];
      continue;
    }
    push();
    start = prev = v[i];
  }
  push();
  return out.join(', ');
}
