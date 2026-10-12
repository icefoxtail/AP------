'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  PURPOSES,
  classifyPurpose,
  formatChoiceForDisplay,
  createMockSelection,
  replaceVariant,
  regenerateUnlocked
} = require('../archive/generated-mock-selection.js');

function row(sourceQid, purpose, number, difficultyBucket) {
  return {
    uid: `ALITE-PALMA25-2MID-Q${String(sourceQid).padStart(2, '0')}-${purpose}${number}`,
    sourceQid,
    sourceExamBlobSha: '4cfce909c023e5c4df4a759945c8cc3e0a63ec76',
    metaProjection: { difficultyBucket }
  };
}

const allPurposes = ['A', 'B', 'C'];

test('choice display closes one unmatched leading math delimiter and preserves balanced or escaped dollars', () => {
  assert.equal(formatChoiceForDisplay('$x+1$'), '$x+1$');
  assert.equal(formatChoiceForDisplay('$(x-5)^2+(y+4)^2=13'), '$(x-5)^2+(y+4)^2=13$');
  assert.equal(formatChoiceForDisplay('\\$5'), '\\$5');
  assert.equal(formatChoiceForDisplay('price \\$5'), 'price \\$5');
});

test('learning-purpose labels keep their meaning separate from numeric difficulty', () => {
  assert.deepEqual(
    PURPOSES.map(({ key, label, description }) => [key, label, description]),
    [
      ['A', '유형 익히기', '원본의 핵심 풀이를 유지하며 같은 유형을 연습합니다.'],
      ['B', '응용 넓히기', '조건이나 개념 연결을 바꾼 문제로 풀이를 확장합니다.'],
      ['C', '심화 도전하기', '여러 판단이나 개념을 연결해 해결합니다.']
    ]
  );
  assert.equal(classifyPurpose(row(1, 'C', 2, 2)), 'C');
  assert.equal(classifyPurpose({ uid: 'ALITE-OLDER-Q01-P01' }), null);
});

test('a specified numeric difficulty filters candidates without treating purpose as difficulty', () => {
  const rows = [
    row(1, 'A', 1, 2), row(1, 'C', 1, 4),
    row(2, 'A', 1, 3), row(2, 'C', 1, 2),
    row(3, 'B', 1, 2)
  ];
  const result = createMockSelection(rows, {
    sourceCount: 4,
    purposes: ['A', 'C'],
    mode: 'specified',
    difficulty: 2,
    random: () => 0
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.items.map(item => item.row.uid), [
    'ALITE-PALMA25-2MID-Q01-A1',
    'ALITE-PALMA25-2MID-Q02-C1'
  ]);
  assert.deepEqual(result.missingSourceQids, [3, 4]);
  assert.deepEqual(result.difficultyCounts, { 2: 2 });
});

test('numeric difficulty reads both flat and nested approved metadata shapes', () => {
  const rows = [
    { uid: 'ALITE-PALMA25-2MID-Q05-A1', sourceQid: 5, sourcePurposeGroup: 'A', difficultyBucket: 5 },
    { uid: 'ALITE-PALMA25-2MID-Q09-B1', sourceQid: 9, meta: { difficultyBucket: 3 } }
  ];
  const result = createMockSelection(rows, {
    sourceCount: 9,
    purposes: ['A', 'B'],
    mode: 'specified',
    difficulty: 5,
    random: () => 0
  });
  const nestedResult = createMockSelection(rows, {
    sourceCount: 9,
    purposes: ['A', 'B'],
    mode: 'specified',
    difficulty: 3,
    random: () => 0
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.items.map(item => item.row.uid), ['ALITE-PALMA25-2MID-Q05-A1']);
  assert.deepEqual(result.missingSourceQids, [1, 2, 3, 4, 6, 7, 8, 9]);
  assert.equal(nestedResult.ok, true);
  assert.deepEqual(nestedResult.items.map(item => item.row.uid), ['ALITE-PALMA25-2MID-Q09-B1']);
});

test('mixed quotas assign exact difficulty counts while using each source qid once', () => {
  const rows = [
    row(1, 'A', 1, 1), row(1, 'B', 1, 2),
    row(2, 'A', 1, 1),
    row(3, 'A', 1, 2), row(3, 'C', 1, 3)
  ];
  const result = createMockSelection(rows, {
    sourceCount: 3,
    purposes: allPurposes,
    mode: 'mixed',
    quotas: { 1: 1, 2: 2, 3: 0, 4: 0, 5: 0 },
    random: () => 0
  });

  assert.equal(result.ok, true);
  assert.equal(result.items.length, 3);
  assert.equal(new Set(result.items.map(item => item.row.sourceQid)).size, 3);
  assert.deepEqual(result.difficultyCounts, { 1: 1, 2: 2 });
  assert.deepEqual(result.items.map(item => item.row.sourceQid), [1, 2, 3]);
});

test('mixed quotas fail closed when they would require reusing a source qid', () => {
  const result = createMockSelection([row(1, 'A', 1, 1), row(1, 'B', 1, 2)], {
    sourceCount: 2,
    purposes: allPurposes,
    mode: 'mixed',
    quotas: { 1: 1, 2: 1, 3: 0, 4: 0, 5: 0 },
    random: () => 0
  });

  assert.equal(result.ok, false);
  assert.equal(result.errorCode, 'MIXED_QUOTA_UNAVAILABLE');
  assert.deepEqual(result.items, []);
  assert.deepEqual(result.coveredSourceQids, []);
  assert.ok((result.shortfallByDifficulty[1] || 0) + (result.shortfallByDifficulty[2] || 0) > 0);
});

test('mixed quotas report how many questions exceed the source paper size', () => {
  const result = createMockSelection([row(1, 'A', 1, 1), row(2, 'A', 1, 2)], {
    sourceCount: 2,
    purposes: ['A'],
    mode: 'mixed',
    quotas: { 1: 2, 2: 1, 3: 0, 4: 0, 5: 0 },
    random: () => 0
  });

  assert.equal(result.ok, false);
  assert.equal(result.errorCode, 'MIXED_QUOTA_UNAVAILABLE');
  assert.equal(result.sourceCountShortfall, 1);
  assert.deepEqual(result.items, []);
});

test('random mode chooses one eligible candidate per covered source qid and reports uncovered qids', () => {
  const rows = [
    row(1, 'A', 1, 2), row(1, 'A', 2, 2), row(1, 'B', 1, 3),
    row(2, 'C', 1, 4), row(2, 'B', 1, 3),
    row(4, 'A', 1, 1)
  ];
  const result = createMockSelection(rows, {
    sourceCount: 5,
    purposes: ['A', 'B'],
    mode: 'random',
    random: () => 0
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.items.map(item => item.row.sourceQid), [1, 2, 4]);
  assert.equal(new Set(result.items.map(item => item.row.uid)).size, 3);
  assert.deepEqual(result.missingSourceQids, [3, 5]);
});

test('replacement stays on the source qid, matches the requested purpose and difficulty, and avoids selected UIDs', () => {
  const current = row(1, 'A', 1, 2);
  const alreadySelected = row(2, 'A', 1, 2);
  const alternative = row(1, 'A', 2, 2);
  const wrongPurpose = row(1, 'C', 1, 2);
  const wrongDifficulty = row(1, 'A', 3, 3);
  const result = replaceVariant({
    currentRow: current,
    selectedRows: [current, alreadySelected],
    rows: [current, alreadySelected, alternative, wrongPurpose, wrongDifficulty],
    purposes: ['A'],
    mode: 'specified',
    difficulty: 2,
    random: () => 0
  });

  assert.equal(result.ok, true);
  assert.equal(result.row.uid, alternative.uid);
  assert.equal(result.row.sourceQid, current.sourceQid);
});

test('regeneration preserves locked UIDs and replaces unlocked slots without duplicates', () => {
  const locked = row(1, 'A', 1, 2);
  const unlocked = row(2, 'A', 1, 2);
  const alternate = row(2, 'A', 2, 2);
  const result = regenerateUnlocked({
    items: [{ row: locked, locked: true }, { row: unlocked, locked: false }],
    rows: [locked, unlocked, alternate],
    purposes: ['A'],
    mode: 'random',
    random: () => 0
  });

  assert.equal(result.ok, true);
  assert.equal(result.items[0].row.uid, locked.uid);
  assert.equal(result.items[0].locked, true);
  assert.equal(result.items[1].row.uid, alternate.uid);
  assert.equal(new Set(result.items.map(item => item.row.uid)).size, 2);
});

test('approved Palma QID9 rows use every covered source qid once and report only true coverage gaps', () => {
  const indexPath = path.join(__dirname, '../archive/data/generated-lite-consumer/v1/index.json');
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const candidates = index.records.filter(record =>
    record.sourceExamBlobSha === '4cfce909c023e5c4df4a759945c8cc3e0a63ec76' &&
    record.consumerSelectable === true &&
    !index.excludedHoldUids.includes(record.uid) &&
    /^ALITE-PALMA25-2MID-Q\d+-[ABC][123]$/.test(record.uid)
  );
  const result = createMockSelection(candidates, {
    sourceCount: 23,
    purposes: allPurposes,
    mode: 'random',
    random: () => 0
  });

  assert.ok(candidates.length > 0);
  assert.ok(candidates.every(record => record.consumerSelectable === true));
  assert.ok(candidates.every(record => record.approval !== 'HOLD'));
  assert.equal(result.ok, true);
  const sourceQids = [...new Set(candidates.map(record => record.sourceQid))].sort((a, b) => a - b);
  const expectedMissing = Array.from({ length: 23 }, (_, i) => i + 1).filter(qid => !sourceQids.includes(qid));
  assert.deepEqual(result.items.map(item => item.row.sourceQid), sourceQids);
  assert.deepEqual(result.missingSourceQids, expectedMissing);
  assert.equal(new Set(result.items.map(item => item.row.uid)).size, sourceQids.length);
  assert.equal(Object.values(result.difficultyCounts).reduce((sum, count) => sum + count, 0), sourceQids.length);
});

test('the actual Palma pool satisfies a five-level mixed quota within the interaction budget', () => {
  const index = JSON.parse(fs.readFileSync(path.join(__dirname, '../archive/data/generated-lite-consumer/v1/index.json'), 'utf8'));
  const candidates = index.records.filter(record =>
    record.sourceExamBlobSha === '4cfce909c023e5c4df4a759945c8cc3e0a63ec76' &&
    record.consumerSelectable === true &&
    !index.excludedHoldUids.includes(record.uid) &&
    /^ALITE-PALMA25-2MID-Q\d+-[ABC][123]$/.test(record.uid)
  );
  const started = Date.now();
  const result = createMockSelection(candidates, {
    sourceCount: 23,
    purposes: allPurposes,
    mode: 'mixed',
    quotas: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 },
    random: () => 0
  });
  const elapsedMs = Date.now() - started;

  assert.equal(result.ok, true);
  assert.equal(result.items.length, 5);
  assert.deepEqual(result.difficultyCounts, { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 });
  assert.equal(new Set(result.items.map(item => item.row.sourceQid)).size, 5);
  assert.ok(elapsedMs < 500, `selection took ${elapsedMs}ms for the real indexed Palma pool`);
});
