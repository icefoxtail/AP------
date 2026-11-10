const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const archiveRoot = path.resolve(__dirname, '..', 'archive');
const mixerHtml = fs.readFileSync(path.join(archiveRoot, 'mixer.html'), 'utf8');
const unitJs = fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.js'), 'utf8');

function slice(source, from, to) {
  const start = source.indexOf(from);
  const end = source.indexOf(to, start);
  assert.ok(start >= 0 && end > start, `source markers not found: ${from} .. ${to}`);
  return source.slice(start, end);
}

// 두 화면은 같은 보관 규칙을 각자 가지고 있으므로 같은 시나리오를 둘 다에 적용한다.
const variants = [
  ['mixer.html', slice(mixerHtml, 'const MIXED_SNAPSHOT_INDEX_KEY', 'function openMixedEngine')],
  ['unit-past-exams.js', slice(unitJs, 'const MIXED_SNAPSHOT_INDEX_KEY', 'async function prepareOutputEnvelope')],
];

function fakeLocalStorage(initial = {}, { quotaChars = Infinity } = {}) {
  const data = new Map(Object.entries(initial));
  const used = () => [...data].reduce((sum, [k, v]) => sum + k.length + String(v).length, 0);
  return {
    data,
    get length() { return data.size; },
    key: index => [...data.keys()][index] ?? null,
    getItem: key => (data.has(key) ? data.get(key) : null),
    setItem(key, value) {
      const next = String(value);
      const before = data.get(key);
      data.set(key, next);
      if (used() > quotaChars) {
        if (before === undefined) data.delete(key); else data.set(key, before);
        const error = new Error('quota'); error.name = 'QuotaExceededError'; throw error;
      }
    },
    removeItem: key => { data.delete(key); },
  };
}

function load(source, localStorage) {
  const context = vm.createContext({ localStorage, JSON, Map, Set, Number, Math, Date, console });
  vm.runInContext(`${source}\nthis.storeMixedSnapshot = storeMixedSnapshot;`, context);
  return context.storeMixedSnapshot;
}

const protectedKeys = {
  APMATH_SESSION: '{"role":"teacher"}',
  archive2WorkspaceDraft: '{"cart":[1,2,3]}',
  APMATH_UNIT_PAST_ASSIGN_unit_a: '{"pending":true}',
  mixedQuestionsLegacy: 'not a snapshot pair',
  'mixedQuestions_unit-past-user-work': 'existing user work',
  'mixedMeta_archive2-saved-old-paper-old-batch': 'saved paper meta',
};

for (const [name, source] of variants) {
  test(`${name}: 오래된 mixedQuestions_/mixedMeta_ 쌍만 정리하고 다른 키는 지우지 않는다`, () => {
    const initial = { ...protectedKeys };
    const base = 1_700_000_000_000;
    for (let i = 0; i < 25; i++) {
      initial[`mixedQuestions_mix_${base + i}`] = 'q'.repeat(20);
      initial[`mixedMeta_mix_${base + i}`] = 'm';
    }
    const storage = fakeLocalStorage(initial);
    const store = load(source, storage);
    const key = `mix_${base + 1000}`;
    const result = store(key, [{ id: 1 }], { title: 't' });
    assert.equal(result.ok, true);
    assert.ok(storage.data.has(`mixedQuestions_${key}`) && storage.data.has(`mixedMeta_${key}`), 'new pair is stored');
    const remaining = [...storage.data.keys()].filter(k => /^mixedQuestions_mix_/.test(k));
    assert.ok(remaining.length <= 10, `kept ${remaining.length} snapshot pairs, expected at most 10`);
    assert.ok(storage.data.has(`mixedQuestions_mix_${base + 24}`), 'newest older pair is kept');
    assert.ok(!storage.data.has(`mixedQuestions_mix_${base}`), 'oldest pair is removed');
    assert.ok(!storage.data.has(`mixedMeta_mix_${base}`), 'oldest meta is removed with its pair');
    for (const [k, v] of Object.entries(protectedKeys)) assert.equal(storage.data.get(k), v, `${k} must not be touched`);
  });

  test(`${name}: 용량 초과면 더 줄여 한 번 다시 시도하고, 끝내 실패하면 ok:false를 돌려준다`, () => {
    const base = 1_700_000_000_000;
    const initial = { ...protectedKeys };
    for (let i = 0; i < 9; i++) initial[`mixedQuestions_mix_${base + i}`] = 'q'.repeat(400);
    const storage = fakeLocalStorage(initial, { quotaChars: Object.entries(initial).reduce((s, [k, v]) => s + k.length + v.length, 0) + 600 });
    const store = load(source, storage);
    const questions = [{ text: 'x'.repeat(900) }];
    const result = store(`mix_${base + 5000}`, questions, {});
    assert.equal(result.ok, true, 'retry after the quota prune must succeed');
    assert.ok(storage.data.has(`mixedQuestions_mix_${base + 5000}`));
    for (const [k, v] of Object.entries(protectedKeys)) assert.equal(storage.data.get(k), v, `${k} must not be touched`);

    const tiny = fakeLocalStorage({ ...protectedKeys }, { quotaChars: Object.entries(protectedKeys).reduce((s, [k, v]) => s + k.length + v.length, 0) + 50 });
    const failed = load(source, tiny)(`mix_${base + 9000}`, [{ text: 'y'.repeat(5000) }], {});
    assert.equal(failed.ok, false);
    assert.ok(!tiny.data.has(`mixedQuestions_mix_${base + 9000}`), 'no half-written pair is left behind');
    for (const [k, v] of Object.entries(protectedKeys)) assert.equal(tiny.data.get(k), v, `${k} must not be touched`);
  });
}

test('mixer.html과 단원별 기출은 쓰기 오류를 숨기지 않는다', () => {
  assert.doesNotMatch(mixerHtml, /localStorage\.setItem\('mixedQuestions_' \+ sessionKey/, 'mixer must use the guarded store');
  assert.match(mixerHtml, /storeMixedSnapshot\(sessionKey, exportCart, meta\)/);
  assert.match(mixerHtml, /if \(!stored\.ok\)[\s\S]{0,200}alert\(/);
  assert.doesNotMatch(unitJs, /localStorage\.setItem\(`mixedQuestions_\$\{paper\.snapshotKey\}`/);
  assert.match(unitJs, /legacySnapshotStored === false\) throw new Error/);
});
