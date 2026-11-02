const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { catalog } = require('./helpers/archive2-scope-harness.cjs');
const ProblemBankMeta = require('../archive/problem-bank-meta.js');

// Registered reviewed exams record their RPM path as `rpmPrimaryPath {L1..L4}` (not flat rpmL1..4).
// The search card must show that registered path instead of "RPM L1~L4 미지정".
const sourceHash = new Map(catalog.sourceHashes || []);
const view = record => ProblemBankMeta.projectOriginal({ ...record, currentSourceJsSha256: sourceHash.get(record.sourceFile) || '' });
const runtimeDir = path.resolve(__dirname, '../archive/data/meta-foundation/runtime');
const overlayRows = new Map();
for (const name of fs.readdirSync(runtimeDir).filter(file => file.endsWith('-v1.json'))) {
  const data = JSON.parse(fs.readFileSync(path.join(runtimeDir, name), 'utf8'));
  for (const row of data.records || []) if (row.questionUid) overlayRows.set(row.questionUid, row);
}

test('a registered similar exam row shows its rpmPrimaryPath as RPM L1-L4', () => {
  const record = catalog.records.find(row => row.sourceFile.endsWith('25_강남여고_2학기_기말_고2_확률과통계_유사.js') && String(row.sourceQuestionNo) === '22');
  assert.ok(record && record.reviewedExamRegistration, 'registered row exists');
  const shown = view(record);
  assert.deepEqual([shown.rpmL1, shown.rpmL2, shown.rpmL3, shown.rpmL4], ['통계', '확률분포', '정규분포', '정규분포의 표준화']);
  assert.equal(shown.rpmSemanticStatus, 'DIRECT_ACTIVE');
});

test('every registered row whose overlay records rpmPrimaryPath shows exactly that path', () => {
  let checked = 0;
  for (const record of catalog.records) {
    if (!record.reviewedExamRegistration) continue;
    const overlay = overlayRows.get(record.questionUid);
    const recorded = overlay?.rpmPrimaryPath;
    if (!recorded || !recorded.L1) continue;
    const shown = view(record);
    for (const level of ['L1', 'L2', 'L3', 'L4']) {
      if (recorded[level]) assert.equal(shown['rpm' + level], recorded[level], `${record.sourceFile}#${record.sourceOrdinal} ${level}`);
    }
    checked += 1;
  }
  assert.ok(checked >= 70, `registered rows with rpmPrimaryPath checked: ${checked}`);
});
