'use strict';
// 휴대폰 조작 줄 "⋯" 메뉴의 "쪽당 2문항 / 4문항" 항목(archive2-reader-controls.js). 실제 Chrome(390폭) 확인은 PR 본문에 있고, 여기서는 결함 조건만 지킨다:
// 항목이 보이면 안 되는 곳(engine.html의 qppSwitchEligible이 아닌 화면, 해설·정답 탭, 그 함수가 없는 mixed_engine)에서 안 보이는지,
// 고른 값은 engine.html의 chooseArchiveQpp 하나로만 가는지(두 번째 구현 없음).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const reader = read('archive/archive2-reader-controls.js');
const engine = read('archive/engine.html');
const mixed = read('archive/mixed_engine.html');

function sliceFunction(source, header) {
  const start = source.indexOf(header);
  assert.notEqual(start, -1, `${header} exists`);
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`${header} not closed`);
}

function harness({ eligible = true, mode = 'exam', withEngineFunctions = true, qpp = 4 } = {}) {
  const calls = { chosen: [], menuClosed: 0 };
  const items = [2, 4].map(value => {
    const classes = new Set();
    return { dataset: { qpp: String(value) }, attrs: {}, classes, setAttribute(k, v) { this.attrs[k] = v; }, classList: { toggle: (name, on) => (on ? classes.add(name) : classes.delete(name)) } };
  });
  const group = { hidden: true, querySelectorAll: () => items };
  const select = { value: mode };
  const doc = { getElementById: id => (id === 'archive2-reader-qpp' ? group : id === 'archive2-reader-mode' ? select : null) };
  const rootObj = { AppState: undefined };
  if (withEngineFunctions) {
    rootObj.qppSwitchEligible = () => eligible;
    rootObj.chooseArchiveQpp = async value => { calls.chosen.push(value); };
  }
  const sandbox = { document: doc, root: rootObj, Number, String, selectedMode: () => 'exam', AppState: { qpp }, setMenu: () => { calls.menuClosed++; } };
  vm.createContext(sandbox);
  vm.runInContext([
    sliceFunction(reader, 'function qppItemsAvailable()'),
    sliceFunction(reader, 'function syncQpp()'),
    sliceFunction(reader, 'async function chooseQpp(value)'),
  ].join('\n'), sandbox);
  return { sandbox, calls, group, items };
}

test('원본 기출(engine.html) 첫 화면 시험 탭에서만 보이고, 지금 값에 눌린 표시가 붙는다', () => {
  const h = harness({ qpp: 4 });
  h.sandbox.syncQpp();
  assert.equal(h.group.hidden, false);
  assert.deepEqual(h.items.map(item => item.attrs['aria-checked']), ['false', 'true']);
});

test('보이면 안 되는 곳에서는 숨긴다: 원본이 아닌 화면·해설·정답 탭·engine 함수가 없는 mixed_engine', () => {
  for (const options of [{ eligible: false }, { mode: 'sol' }, { mode: 'ans' }, { withEngineFunctions: false }]) {
    const h = harness(options);
    h.group.hidden = false;
    h.sandbox.syncQpp();
    assert.equal(h.group.hidden, true, JSON.stringify(options));
  }
  assert.ok(!/chooseArchiveQpp|qppSwitchEligible/.test(mixed), 'mixed_engine에는 쪽당 선택 함수가 없다');
});

test('고른 값은 engine.html의 chooseArchiveQpp 하나로 간다(두 번째 구현 없음)', async () => {
  const h = harness();
  await h.sandbox.chooseQpp('2');
  assert.deepEqual(Array.from(h.calls.chosen), [2]);
  assert.equal(h.calls.menuClosed, 1, '메뉴는 닫힌다');
  const hidden = harness({ eligible: false });
  await hidden.sandbox.chooseQpp('2');
  assert.deepEqual(Array.from(hidden.calls.chosen), []);
  assert.ok(/async function chooseArchiveQpp\(value\)/.test(engine));
  assert.ok(!/localStorage|APMATH_ARCHIVE2_ORIGINAL_QPP|setArchiveQpp/.test(reader), '저장·다시 그리기 코드를 reader가 따로 갖지 않는다');
});

test('조작 줄 JS·CSS를 부르는 두 페이지의 ?v=가 같다', () => {
  for (const asset of ['archive2-reader-controls.js', 'archive2-reader-controls.css']) {
    const stamp = html => (html.match(new RegExp(`${asset.replace(/\./g, '\\.')}\\?v=([^"']+)`)) || [])[1];
    assert.ok(stamp(engine), `${asset} in engine`);
    assert.equal(stamp(engine), stamp(mixed), asset);
  }
});
