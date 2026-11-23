'use strict';

// 배치 계획기 세 갈래를 같은 입력으로 비교하는 상설 하네스 (엔진 견고화 3단계의 첫 조각, 통합 자체는 다음 작업).
//   A. archive/layout-authority.js planLegacyProductionLayout   (원본 열기 쪽 배치 계획)
//   B. archive/exam-render-executor.js buildSlotPages           (문제지 만들기·단원별 기출·서버 PDF 옛 갈래)
//   C. archive/equal-slot-engine.js plan                        (쪽당 4문항 균등 칸 엔진, 기본 갈래)
// 입력은 일반 문항(n)과 한 단 전체(two = subjective-2up)의 모든 조합(길이 7까지)이다. 시험지 내용을 고정하지 않고 성질만 본다.
//  1) 세 계획기 모두 읽는 순서가 번호 오름차순이고 누락·중복이 없다.
//  2) 어느 문항이 어느 쪽에 놓이는지(쪽 구성)가 세 계획기에서 같다.
//  3) A와 B는 단·행까지 같다.
//  4) C는 문항이 꽉 찬 쪽(칸 4개를 다 쓴 쪽)에서는 A와 단·행까지 같고, 덜 찬 쪽(마지막 쪽 등)에서만 단 나누기가 다르다
//     (A·B는 한 쪽의 일반 문항을 ceil(n/2)씩 두 단으로 나누고, C는 고정 칸 4개를 왼쪽 단부터 채운다). 통합할 때 이 차이를 하나로 정해야 한다.
const test = require('node:test');
const assert = require('node:assert/strict');
const Authority = require('../archive/layout-authority.js');
const Executor = require('../archive/exam-render-executor.js');
const EqualSlot = require('../archive/equal-slot-engine.js');

const TAG = { n: '', two: 'subjective-2up' };

// 쪽마다 [왼쪽 단 문항들, 오른쪽 단 문항들]. 한 단 전체 문항은 번호 뒤에 W를 붙인다.
function authority(tags) {
  const layout = Authority.planLegacyProductionLayout({
    pageGeometry: { usableHeight: 1000, columns: 2, qpp: 4 },
    blocks: tags.map((tag, i) => ({ blockId: 'b' + i, questionKey: 'b' + i, measuredHeight: 10, layoutTag: TAG[tag] }))
  });
  return layout.pages.map(page => page.columns.map(column => column.items.map(item => String(Number(item.blockId.slice(1))) + (item.slotSpanRows > 1 ? 'W' : ''))));
}
function executor(tags) {
  const items = tags.map(tag => ({ q: { layoutTag: TAG[tag] }, box: {} }));
  const indexOf = new Map(items.map((item, i) => [item, i]));
  return Executor.buildSlotPages(items, 4, null).map(page => {
    if (page.wideItem) return [[indexOf.get(page.wideItem) + 'W'], []];
    if (!page.placements.some(entry => entry.span > 1)) {
      const ordered = page.placements.map(entry => String(indexOf.get(entry.item)));
      const split = Math.ceil(ordered.length / 2);
      return [ordered.slice(0, split), ordered.slice(split)];
    }
    return [0, 1].map(col => page.placements.filter(entry => entry.col === col).sort((a, b) => a.row - b.row).map(entry => String(indexOf.get(entry.item)) + (entry.span > 1 ? 'W' : '')));
  });
}
function equalSlot(tags) {
  const items = tags.map((tag, i) => ({ i, tag }));
  return EqualSlot.plan(items, item => (item.tag === 'two' ? 2 : 1)).map(page => {
    const columns = [[], []];
    for (const slot of page) if (slot.item) columns[slot.column].push(String(slot.item.i) + (slot.span === 2 ? 'W' : ''));
    return columns;
  });
}

const number = label => Number(String(label).replace('W', ''));
const readingOrder = pages => pages.flatMap(page => page.flat().map(number));
const membership = pages => pages.map(page => page.flat().map(number).sort((a, b) => a - b));
// 칸 4개를 다 쓴 쪽인가(일반 1칸 + 한 단 전체 2칸으로 센다)
const cells = page => page.flat().reduce((sum, label) => sum + (String(label).endsWith('W') ? 2 : 1), 0);

const sequences = [];
(function build(prefix) {
  if (prefix.length) sequences.push(prefix);
  if (prefix.length < 7) for (const tag of ['n', 'two']) build([...prefix, tag]);
}([]));

test('세 계획기: 읽는 순서는 번호 오름차순이고 쪽 구성이 같다', () => {
  assert.ok(sequences.length >= 200, 'enumeration covers many shapes');
  for (const tags of sequences) {
    const label = tags.join(',');
    const results = { authority: authority(tags), executor: executor(tags), equalSlot: equalSlot(tags) };
    const expected = tags.map((_, i) => i);
    for (const [name, pages] of Object.entries(results)) assert.deepEqual(readingOrder(pages), expected, `${name} [${label}]: 읽는 순서`);
    assert.deepEqual(membership(results.executor), membership(results.authority), `[${label}] A·B 쪽 구성`);
    assert.deepEqual(membership(results.equalSlot), membership(results.authority), `[${label}] A·C 쪽 구성`);
  }
});

test('세 계획기: A·B는 단·행까지 같고, C는 꽉 찬 쪽에서는 A와 같다 (덜 찬 쪽의 단 나누기만 다르다)', () => {
  let partialDiffers = 0;
  for (const tags of sequences) {
    const label = tags.join(',');
    const a = authority(tags), b = executor(tags), c = equalSlot(tags);
    assert.deepEqual(b, a, `[${label}] A·B 같은 배치`);
    assert.equal(c.length, a.length, `[${label}] 쪽 수`);
    a.forEach((page, index) => {
      if (cells(page) === 4) assert.deepEqual(c[index], page, `[${label}] 쪽 ${index + 1}: 꽉 찬 쪽은 C도 같은 단·행`);
      else if (JSON.stringify(c[index]) !== JSON.stringify(page)) partialDiffers += 1;
    });
  }
  // 알려진 차이가 실제로 있음을 고정한다(통합 때 이 값이 0이 되면 이 단언과 위 설명을 함께 고친다).
  assert.ok(partialDiffers > 0, '덜 찬 쪽의 단 나누기 차이(ceil(n/2) 나누기 대 왼쪽 단부터 채우기)');
});
