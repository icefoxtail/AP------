// 시험지 쪽 안의 읽는 순서(왼쪽 단 위→아래, 오른쪽 단 위→아래)가 항상 문항 번호 오름차순인지 지킨다.
// 이유: 일반 문항 사이에 한 단 전체를 쓰는 서술형(subjective-2up)이 끼면 빈 칸을 뒤 문항이 채워 21→23→22처럼
// 읽혔다. 사용자 결정(2026-11-18): 번호 순서대로, 빈 자리·쪽 수 증가는 괜찮다.
// 배치 코드는 두 벌(원본 열기의 layout-authority, 문제지 만들기·서버 PDF의 exam-render-executor)이라 둘이 같은 배치를 내는지도 본다.
// 시험지 데이터는 파일을 읽어 "모든 쪽이 오름차순"만 단언한다(쪽·문항 번호를 박지 않는다).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Authority = require('../archive/layout-authority.js');
const Executor = require('../archive/exam-render-executor.js');

const TAGS = { n: '', two: 'subjective-2up', four: 'subjective-4up', full: 'fullwidth' };

// 쪽마다 읽는 순서를 같은 모양으로 맞춘다: { wide: i } 또는 { cols: [[i...],[i...]], rows: [[row...],[row...]] | null }
function authorityPages(tags, qpp) {
  const layout = Authority.planLegacyProductionLayout({
    pageGeometry: { usableHeight: 1000, columns: 2, qpp },
    blocks: tags.map((tag, i) => ({ blockId: 'b' + i, questionKey: 'b' + i, measuredHeight: 10, layoutTag: tag }))
  });
  return layout.pages.map(page => {
    const wide = page.itemPlacements.find(item => item.columnSpan > 1);
    if (wide) return { wide: Number(wide.blockId.slice(1)) };
    const special = page.itemPlacements.some(item => item.slotSpanRows > 1);
    return {
      cols: page.columns.map(column => column.items.map(item => Number(item.blockId.slice(1)))),
      rows: special ? page.columns.map(column => column.items.map(item => item.slotRowStart)) : null
    };
  });
}

function executorPages(tags, qpp) {
  const items = tags.map(tag => ({ q: { layoutTag: tag }, box: {} }));
  const indexOf = new Map(items.map((item, i) => [item, i]));
  return Executor.buildSlotPages(items, qpp, null).map(page => {
    if (page.wideItem) return { wide: indexOf.get(page.wideItem) };
    const special = page.placements.some(entry => entry.span > 1);
    if (!special) {
      // 특수 칸이 없는 쪽은 번호순으로 ceil(n/2)씩 나눠 왼쪽·오른쪽 단에 쌓는다(렌더러와 같은 규칙).
      const ordered = page.placements.map(entry => indexOf.get(entry.item));
      const split = Math.ceil(ordered.length / 2);
      return { cols: [ordered.slice(0, split), ordered.slice(split)], rows: null };
    }
    const column = col => page.placements.filter(entry => entry.col === col).sort((a, b) => a.row - b.row);
    return {
      cols: [0, 1].map(col => column(col).map(entry => indexOf.get(entry.item))),
      rows: [0, 1].map(col => column(col).map(entry => entry.row))
    };
  });
}

const readingOrder = pages => pages.flatMap(page => page.wide !== undefined ? [page.wide] : page.cols.flat());

function assertAscending(pages, count, label) {
  const sequence = readingOrder(pages);
  assert.deepEqual(sequence, Array.from({ length: count }, (_, i) => i), label + ': 읽는 순서가 번호 오름차순이고 누락·중복이 없어야 한다');
}

// 뒤바뀌던 사례와 인접 경우를 직접 적는다(번호는 0부터).
test('일반 1개 → 서술형 → 일반: 서술형은 빈 오른쪽 단 맨 위에, 다음 일반은 다음 쪽 (왼쪽 n, n+2 / 오른쪽 n+1 로 읽히지 않는다)', () => {
  for (const planner of [authorityPages, executorPages]) {
    const pages = planner([TAGS.n, TAGS.two, TAGS.n, TAGS.n], 4);
    assert.deepEqual(pages.map(page => page.cols), [[[0], [1]], [[2], [3]]]);
    assert.deepEqual(pages[0].rows, [[0], [0]]);
  }
});

test('일반 2개 뒤 서술형, 서술형 뒤 일반들, 서술형 연속은 지금 배치 그대로다', () => {
  for (const planner of [authorityPages, executorPages]) {
    assert.deepEqual(planner([TAGS.n, TAGS.n, TAGS.two], 4).map(page => page.cols), [[[0, 1], [2]]]);
    assert.deepEqual(planner([TAGS.two, TAGS.n, TAGS.n], 4).map(page => page.cols), [[[0], [1, 2]]]);
    assert.deepEqual(planner([TAGS.two, TAGS.two, TAGS.two], 4).map(page => page.cols), [[[0], [1]], [[2], []]]);
  }
});

test('서술형이 쪽 끝에 걸리면 다음 쪽 첫 단으로 간다 (6문항·8문항 쪽도 같다)', () => {
  for (const planner of [authorityPages, executorPages]) {
    // qpp 4: 일반 3개로 한 쪽이 차고(2+1) 서술형은 다음 쪽 왼쪽 단
    assert.deepEqual(planner([TAGS.n, TAGS.n, TAGS.n, TAGS.two], 4).map(page => page.cols), [[[0, 1], [2]], [[3], []]]);
    // qpp 6: 한 단은 3행. 일반 2개 뒤 서술형은 오른쪽 단 전체, 그 뒤 일반은 다음 쪽
    assert.deepEqual(planner([TAGS.n, TAGS.n, TAGS.two, TAGS.n], 6).map(page => page.cols), [[[0, 1], [2]], [[3], []]]);
    // qpp 6: 일반 1개 → 서술형 → 일반: 왼쪽 단 아래 두 칸은 비운다
    const six = planner([TAGS.n, TAGS.two, TAGS.n], 6);
    assert.deepEqual(six.map(page => page.cols), [[[0], [1]], [[2], []]]);
    assert.deepEqual(six[0].rows, [[0], [0]]);
    // qpp 8: 한 단은 4행
    assert.deepEqual(planner([TAGS.n, TAGS.n, TAGS.n, TAGS.two, TAGS.n], 8).map(page => page.cols), [[[0, 1, 2], [3]], [[4], []]]);
  }
});

test('서술형이 없는 쪽은 번호순으로 ceil(n/2)씩 나눈다 (마지막 두 문항이 한 단에 쌓이지 않는다)', () => {
  for (const planner of [authorityPages, executorPages]) {
    // 서술형이 있는 문서의 맨 뒤 쪽: 5개가 남으면 왼쪽 3, 오른쪽 2
    const pages = planner([TAGS.two, TAGS.n, TAGS.n, TAGS.n, TAGS.n, TAGS.n, TAGS.two], 8);
    assert.deepEqual(pages.map(page => page.cols), [[[0], [1, 2, 3, 4]], [[5], [6]]]);
    const tail = planner([TAGS.two, TAGS.full, TAGS.n, TAGS.n, TAGS.n, TAGS.n, TAGS.n], 8);
    assert.deepEqual(tail.map(page => page.wide !== undefined ? page.wide : page.cols), [[[0], []], 1, [[2, 3, 4], [5, 6]]]);
  }
});

// 모든 조합: 길이 ≤ 6, 태그 {일반, 서술형, 4up, 전체폭}, 쪽당 2·4·6·8문항
function* sequences(maxLength) {
  const alphabet = Object.keys(TAGS);
  function* build(prefix) {
    if (prefix.length) yield prefix;
    if (prefix.length === maxLength) return;
    for (const key of alphabet) yield* build(prefix.concat(key));
  }
  yield* build([]);
}

test('합성 조합 전부: 쪽 안 읽는 순서는 항상 번호 오름차순이고 두 계획기가 같은 배치를 낸다', () => {
  let checked = 0;
  for (const qpp of [2, 4, 6, 8]) {
    for (const keys of sequences(6)) {
      const tags = keys.map(key => TAGS[key]);
      const label = `qpp=${qpp} ${keys.join(',')}`;
      const authority = authorityPages(tags, qpp);
      const executor = executorPages(tags, qpp);
      assertAscending(authority, tags.length, 'authority ' + label);
      assertAscending(executor, tags.length, 'executor ' + label);
      assert.deepEqual(executor, authority, '두 계획기 배치가 같아야 한다: ' + label);
      // 서술형은 항상 한 단의 맨 위에서 시작한다
      for (const page of authority) {
        if (page.wide !== undefined || !page.rows) continue;
        page.cols.forEach((column, col) => column.forEach((index, order) => {
          if (tags[index] === TAGS.two) assert.equal(page.rows[col][order], 0, '서술형은 단 맨 위: ' + label);
        }));
      }
      checked += 1;
    }
  }
  assert.ok(checked > 1000);
});

test('한 쪽 문항 수보다 많은 연속 일반 문항은 단마다 위에서 아래로 채워진다 (쪽당 2·4·6·8)', () => {
  for (const qpp of [2, 4, 6, 8]) {
    const tags = Array.from({ length: qpp * 2 + 1 }, () => '');
    for (const planner of [authorityPages, executorPages]) {
      const pages = planner(tags, qpp);
      assertAscending(pages, tags.length, `qpp=${qpp}`);
      assert.equal(pages[0].cols.flat().length, qpp);
    }
  }
});

// 실제 시험지: 서술형이 들어 있는 원본·유사 시험지 전부를 쪽당 4·6·8문항으로 넣어 모든 쪽이 오름차순인지만 본다.
function examFiles() {
  const root = path.resolve(__dirname, '../archive/exams');
  const found = [];
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'assets' || entry.name.endsWith('_plans')) continue;
        walk(full);
      } else if (entry.name.endsWith('.js')) found.push(full);
    }
  };
  for (const sub of ['original', 'similar']) if (fs.existsSync(path.join(root, sub))) walk(path.join(root, sub));
  return found;
}

function loadTags(file) {
  const source = fs.readFileSync(file, 'utf8');
  if (!/subjective-[24]up/.test(source)) return null;
  const context = { console };
  context.window = context;
  vm.runInNewContext(source, context, { filename: file });
  const questions = context.questionBank || (context.examData && context.examData.questions) || [];
  const tags = questions.map(q => ({ 'subjective-2up': TAGS.two, 'subjective-4up': TAGS.four, fullwidth: TAGS.full }[q.layoutTag] || ''));
  return tags.some(tag => tag === TAGS.two || tag === TAGS.four) ? tags : null;
}

test('서술형이 들어 있는 실제 시험지는 모든 쪽이 번호 오름차순으로 읽히고 두 계획기가 같다', () => {
  let exams = 0;
  for (const file of examFiles()) {
    const tags = loadTags(file);
    if (!tags) continue;
    exams += 1;
    for (const qpp of [4, 6, 8]) {
      const label = `${path.basename(file)} qpp=${qpp}`;
      const authority = authorityPages(tags, qpp);
      assertAscending(authority, tags.length, label);
      assert.deepEqual(executorPages(tags, qpp), authority, '두 계획기 배치가 같아야 한다: ' + label);
    }
  }
  assert.ok(exams > 0, '서술형이 있는 시험지를 하나 이상 찾아야 한다');
});

test('채움 순서는 번호만 바꾸지 않는다: 같은 입력은 두 번 돌려도 같다', () => {
  const tags = [TAGS.n, TAGS.two, TAGS.n, TAGS.four, TAGS.n, TAGS.full, TAGS.n];
  assert.deepEqual(authorityPages(tags, 8), authorityPages(tags, 8));
  assert.deepEqual(executorPages(tags, 8), executorPages(tags, 8));
});

test('폴백 사다리: 칸을 키운 문항(tall·row)도 번호 순서를 깨지 않는다', () => {
  const items = Array.from({ length: 7 }, (_, i) => ({ q: { layoutTag: '', no: i }, box: {} }));
  const indexOf = new Map(items.map((item, i) => [item, i]));
  const sequenceOf = pages => pages.flatMap(page => {
    if (page.wideItem) return [indexOf.get(page.wideItem)];
    const special = page.placements.some(entry => entry.span > 1 || (entry.colSpan || 1) > 1);
    const ordered = page.placements.slice();
    if (!special) return ordered.map(entry => indexOf.get(entry.item));
    return ordered.sort((a, b) => a.col - b.col || a.row - b.row).map(entry => indexOf.get(entry.item));
  });
  for (const qpp of [4, 6, 8]) {
    for (let pick = 0; pick < items.length; pick += 1) {
      for (const step of [{ span: 2 }, { row: true }, { page: true }]) {
        const pages = Executor.buildSlotPages(items, qpp, new Map([[items[pick], step]]));
        assert.deepEqual(sequenceOf(pages), items.map((_, i) => i), `qpp=${qpp} pick=${pick} step=${JSON.stringify(step)}`);
      }
    }
  }
});
