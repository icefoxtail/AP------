// 라벨 겹침·잘림 계산 함수 검사 (node --test, 브라우저 불필요)
// 실행: node --test apmath/playground/next/tools/label-sweep.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  overlapPairs, clipBoxes, analyze, sameText, genRange, formatRanges,
} from './label-sweep-lib.mjs';

test('겹치는 상자: 교집합이 작은 상자의 15% 이상이면 겹침', () => {
  const A = { str: '240°', l: 0, r: 100, t: 0, b: 50 };       // 넓이 5000
  const B = { str: '넓이 96π cm²', l: 80, r: 180, t: 0, b: 50 }; // 교집합 20×50=1000, 비율 0.2
  const pairs = overlapPairs([A, B], 0.15);
  assert.equal(pairs.length, 1);
  assert.equal(pairs[0].a.str, '240°');
  assert.equal(pairs[0].b.str, '넓이 96π cm²');
});

test('맞닿기만 한 상자는 겹침이 아니다', () => {
  const A = { str: 'A', l: 0, r: 100, t: 0, b: 50 };
  const B = { str: 'B', l: 100, r: 200, t: 0, b: 50 }; // x=100 에서 변만 닿음
  assert.equal(overlapPairs([A, B], 0.15).length, 0);
});

test('아주 조금 겹쳐도 15% 미만이면 겹침이 아니다', () => {
  const A = { str: 'A', l: 0, r: 100, t: 0, b: 50 };     // 5000
  const B = { str: 'B', l: 95, r: 195, t: 0, b: 50 };     // 교집합 5×50=250, 비율 0.05
  assert.equal(overlapPairs([A, B], 0.15).length, 0);
});

test('후광 쌍(좌표 차 1px 이내)은 같은 글자로 보고 겹침에서 뺀다', () => {
  const A = { str: 'X', l: 0, r: 100, t: 0, b: 50 };
  const B = { str: 'X', l: 0.5, r: 100.5, t: 0.5, b: 50.5 }; // 완전히 겹치지만 같은 글자
  assert.equal(overlapPairs([A, B], 0.15).length, 0);
});

test('캔버스 밖으로 4px 이상 나간 상자는 잘림', () => {
  const boxes = [
    { str: '왼쪽 나감', l: -10, r: 50, t: 0, b: 20 },
    { str: '안쪽', l: 0, r: 50, t: 0, b: 20 },
    { str: '오른쪽 나감', l: 390, r: 410, t: 0, b: 20 }, // width 400 → 400+4=404
    { str: '약간만', l: -3, r: 50, t: 0, b: 20 },        // 4px 미만 → 잘림 아님
  ];
  const clips = clipBoxes(boxes, 400, 300, 4);
  assert.equal(clips.length, 2);
  assert.equal(clips[0].side, 'left');
  assert.equal(clips[1].side, 'right');
});

test('analyze 는 2단계: 15% 이상 겹침, 4~15% 맞닿음, 4% 미만은 깨끗', () => {
  const A = { str: 'A', l: 0, r: 100, t: 0, b: 50 };              // 5000
  const over = { str: 'O', l: 80, r: 180, t: 0, b: 50 };            // 교집합 1000 → 0.20
  const near = { str: 'N', l: 0, r: 100, t: 48, b: 98 };            // 교집합 100×2=200 → 0.04
  const far = { str: 'F', l: 0, r: 100, t: 49, b: 99 };             // 교집합 100×1=100 → 0.02
  const r1 = analyze([A, over], 400, 300);
  assert.equal(r1.overlaps.length, 1);
  assert.equal(r1.touches.length, 0);
  const r2 = analyze([A, near], 400, 300);
  assert.equal(r2.overlaps.length, 0);
  assert.equal(r2.touches.length, 1);
  assert.equal(r2.touches[0].b, 'N');
  const r3 = analyze([A, far], 400, 300);
  assert.equal(r3.overlaps.length, 0);
  assert.equal(r3.touches.length, 0);
});

test('두 줄짜리 글의 줄 간격(세로 1.5px 미만 걸침)은 맞닿음이 아니다', () => {
  const L1 = { str: '색칠한 부분의 넓이는?', l: 0, r: 120, t: 0, b: 18.5 };
  const L2 = { str: '조각을 옮겨 보세요', l: 0, r: 120, t: 17.6, b: 36.1 }; // 세로 0.9px 걸침(비율 0.049)
  const r = analyze([L1, L2], 400, 300);
  assert.equal(r.touches.length, 0);
  assert.equal(r.overlaps.length, 0);
  const L3 = { str: '붙은줄', l: 0, r: 120, t: 14, b: 32.5 };          // 세로 4.5px 걸침 → 잡힘
  assert.equal(analyze([L1, L3], 400, 300).touches.length + analyze([L1, L3], 400, 300).overlaps.length, 1);
});

test('--stack-px: 위아래로 쌓인 줄의 세로 겹침 4.5px 미만을 눈감아 줄 수 있다', () => {
  const A = { str: 'r=9', l: 0, r: 40, t: 0, b: 22 };
  const B = { str: '60°', l: 2, r: 42, t: 18, b: 40 };               // 세로 4px 걸침(비율 0.18)
  assert.equal(analyze([A, B], 400, 300).overlaps.length, 1);          // 기본: 겹침
  assert.equal(analyze([A, B], 400, 300, 0.15, 4, 0.04, 4.5).overlaps.length, 0);
  assert.equal(analyze([A, B], 400, 300, 0.15, 4, 0.04, 4.5).touches.length, 0);
});

test('analyze 기준은 옵션으로 바꿀 수 있다', () => {
  const A = { str: 'A', l: 0, r: 100, t: 0, b: 50 };
  const B = { str: 'B', l: 90, r: 190, t: 0, b: 50 };               // 0.10
  assert.equal(analyze([A, B], 400, 300).touches.length, 1);
  assert.equal(analyze([A, B], 400, 300, 0.08).overlaps.length, 1);   // 겹침 기준 8%
  assert.equal(analyze([A, B], 400, 300, 0.15, 4, 0.2).touches.length, 0); // 맞닿음 기준 20% → 안 잡힘
});

test('analyze 는 겹침·잘림을 문자열로 요약한다', () => {
  const boxes = [
    { str: 'A', l: 0, r: 100, t: 0, b: 50 },
    { str: 'B', l: 80, r: 180, t: 0, b: 50 },
    { str: 'C', l: -10, r: 10, t: 100, b: 120 },
  ];
  const r = analyze(boxes, 400, 300, 0.15, 4);
  assert.equal(r.overlaps.length, 1);
  assert.equal(r.overlaps[0].a, 'A');
  assert.equal(r.clips.length, 1);
  assert.equal(r.clips[0].str, 'C');
});

test('구간 묶기: [60,70,80,200] → 60~80, 200', () => {
  assert.equal(formatRanges([60, 70, 80, 200], 10), '60~80, 200');
  assert.equal(formatRanges([300, 310, 320, 330], 10), '300~330');
  assert.equal(formatRanges([200], 10), '200');
  assert.equal(formatRanges([]), '');
  // step 을 주지 않으면 최대공약수로 추정(60,70,80 은 10 간격)
  assert.equal(formatRanges([60, 70, 80, 200]), '60~80, 200');
});

test('genRange: from~to 를 step 간격으로(끝 포함), float 잡음 없이', () => {
  const a = genRange(10, 350, 10);
  assert.equal(a.length, 35);
  assert.equal(a[0], 10);
  assert.equal(a[a.length - 1], 350);
  const b = genRange(0, 1, 0.02);
  assert.equal(b.length, 51);
  assert.equal(b[0], 0);
  assert.equal(b[50], 1);
  assert.ok(b.every((v, i) => v === parseFloat((i * 0.02).toFixed(6)) || v === Math.round((i * 0.02) * 100) / 100));
});

test('글자 내용이 다르면 같은 자리라도 후광이 아니다', () => {
  const A = { str: 'B', l: 0, r: 10, t: 0, b: 10 };
  const B = { str: 'C', l: 0, r: 10, t: 0, b: 10 };
  assert.equal(overlapPairs([A, B], 0.15).length, 1);
});

test('sameText: 네 모서리 좌표 차가 모두 1px 이내', () => {
  assert.equal(sameText({ l: 0, r: 10, t: 0, b: 10 }, { l: 0.5, r: 10.5, t: 0.5, b: 10.5 }), true);
  assert.equal(sameText({ l: 0, r: 10, t: 0, b: 10 }, { l: 2, r: 10, t: 0, b: 10 }), false);
});
