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

// A registration receipt used to be tied to the whole exam file (its sourceRawSha256 had to equal the current file hash), so one edited choice, explanation
// or figure unregistered every question of the exam. It is bound per row now (the row's stem and choices); the file bytes are not a gate.
function productionBundle() {
  const archiveDir = path.resolve(__dirname, '../archive');
  const manifest = JSON.parse(fs.readFileSync(path.join(archiveDir, 'data/archive2-canonical-input-manifest.json'), 'utf8'));
  const resources = {}, files = {};
  for (const row of manifest.files) {
    const bytes = Buffer.from(fs.readFileSync(path.resolve(archiveDir, row.path), 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n'));
    if (row.path.endsWith('.json')) resources[row.path] = JSON.parse(bytes.toString('utf8'));
    files[row.path] = { sha256: row.sha256 };
  }
  return { manifest, projectionVersion: manifest.projectionVersion, files, resources };
}

test('changing the whole-file bytes of an exam does not unregister its rows (a row is dropped only when its stem or choices changed without a reviewed rebind, see archive2-canonical-projection)', () => {
  const core = require('../archive/archive2-core.js');
  const bundle = productionBundle();
  const baseline = core.Canonical.resolveCatalog({ versionBundle: bundle });
  const registeredFiles = new Set(baseline.records.filter(row => row.reviewedExamRegistration).map(row => row.sourceFile));
  assert.ok(registeredFiles.size > 0);
  const countRegistered = data => data.records.filter(row => row.reviewedExamRegistration).length;
  // Every registered exam file now has other bytes (any edit of any row, explanation or figure changes the file hash), and no raw-byte entry matches.
  const packed = bundle.resources['data/archive2-catalog.json'];
  const other = (sha) => (sha[0] === '0' ? '1' : '0') + sha.slice(1);
  packed.sourceHashes = packed.sourceHashes.map(([file, sha]) => [file, registeredFiles.has(file) ? other(sha) : sha]);
  packed.sourceRawHashes = [];
  const edited = core.Canonical.resolveCatalog({ versionBundle: bundle });
  assert.equal(countRegistered(edited), countRegistered(baseline), 'registered rows must not depend on the whole-file hash');
  assert.deepEqual(
    edited.records.filter(row => row.reviewedExamRegistration).map(row => row.questionUid).sort(),
    baseline.records.filter(row => row.reviewedExamRegistration).map(row => row.questionUid).sort(),
  );
});

// A registration receipt can record a field as empty/UNKNOWN (an exam registered with `difficultyBucket: null`). That must never erase a value the question
// already shows (the catalog row's own value stays), while a receipt that has a real value still wins. Structural, no operating counts: the fixture gives a
// registered row a catalog difficulty of 3 and checks that the resolved row keeps 3.
test('a registration overlay with an empty field never erases an existing value, a real receipt value still wins', () => {
  const core = require('../archive/archive2-core.js');
  const resolveWith = (mutate) => {
    const bundle = productionBundle();
    // Plain rows instead of the packed form, so a row's catalog value can be set directly.
    const plain = { ...core.Canonical.decodeCatalog(bundle.resources['data/archive2-catalog.json']) };
    delete plain.encoding;
    bundle.resources['data/archive2-catalog.json'] = plain;
    mutate(bundle);
    return core.Canonical.resolveCatalog({ versionBundle: bundle });
  };
  const overlayRow = (bundle, uid) => {
    for (const resource of Object.values(bundle.resources)) {
      if (!resource || !Array.isArray(resource.records)) continue;
      const hit = resource.records.find(row => row && row.questionUid === uid && Object.hasOwn(row, 'difficultyBucket'));
      if (hit) return hit;
    }
    return null;
  };
  const probe = productionBundle();
  const baseline = core.Canonical.resolveCatalog({ versionBundle: probe });
  const registered = baseline.records.filter(row => row.reviewedExamRegistration);
  const blankReceipt = registered.filter(row => [null, '', 'UNKNOWN'].includes(overlayRow(probe, row.questionUid)?.difficultyBucket)).slice(0, 3);
  const realReceipt = registered.filter(row => Number(overlayRow(probe, row.questionUid)?.difficultyBucket) >= 1).slice(0, 3);
  assert.ok(blankReceipt.length > 0 && realReceipt.length > 0, 'registered rows with a blank and with a real receipt difficulty exist');
  const resolved = resolveWith((bundle) => {
    const catalogRows = new Map(bundle.resources['data/archive2-catalog.json'].records.map(row => [row.questionUid, row]));
    for (const row of blankReceipt) catalogRows.get(row.questionUid).difficultyBucket = 3;
  });
  const find = (rows, uid) => rows.records.find(row => row.questionUid === uid);
  for (const row of blankReceipt) {
    assert.ok(find(resolved, row.questionUid).reviewedExamRegistration, 'still registered');
    assert.equal(find(resolved, row.questionUid).difficultyBucket, 3, 'a blank receipt difficulty keeps the existing 3');
  }
  for (const row of realReceipt) {
    assert.equal(find(resolved, row.questionUid).difficultyBucket, overlayRow(probe, row.questionUid).difficultyBucket, 'a real receipt value wins');
  }
});
