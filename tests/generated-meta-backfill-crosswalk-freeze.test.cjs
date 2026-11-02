'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { build } = require('../archive/tools/backfill-generated-meta.cjs');

const root = path.resolve(__dirname, '..');
const crosswalkPath = path.join(root, 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json');
const ledgerPath = path.join(root, 'archive/data/generated-lite-consumer/v1/legacy-meta-evidence-323.json');
const crosswalk = () => JSON.parse(fs.readFileSync(crosswalkPath, 'utf8'));
const ledger = () => JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
// A legacy projection that is mapped to a crosswalk row (the row it depends on).
const dependentRecord = () => ledger().records.find(row => row.uid === 'ALITE-20261008-HYC26-Q05-002');

test('frozen legacy projections stay valid when crosswalk rows they do not depend on are added or changed', () => {
  const dependentIds = new Set(ledger().records.map(row => row.mappingAttempt?.candidateRecordId).filter(Boolean));
  const doc = crosswalk();
  const unrelated = doc.records.find(row => !dependentIds.has(row.id));
  assert.ok(unrelated);
  unrelated.problemTypeLabelKo = `${unrelated.problemTypeLabelKo || ''} (changed)`;
  doc.records.push({ ...structuredClone(unrelated), id: 'H1-RPM-999-TEST-ADDED' });
  const run = build({ write: false, crosswalkDocument: doc });
  assert.equal(run.projected, 323);
  // The digest the ledger was sealed with is kept (no re-certification), and no stored row changes.
  const stored = ledger();
  assert.deepEqual(run.ledger.crosswalk, stored.crosswalk);
  assert.deepEqual(run.ledger.records, stored.records);
});

test('a changed, retargeted or missing dependent crosswalk row is still EXISTING_PROJECTION_EVIDENCE_DRIFT', () => {
  const id = dependentRecord().mappingAttempt.candidateRecordId;
  assert.ok(id);
  const mutate = fn => {
    const doc = crosswalk();
    fn(doc.records, doc.records.find(row => row.id === id));
    return doc;
  };
  const drift = doc => assert.throws(() => build({ write: false, crosswalkDocument: doc }), /EXISTING_PROJECTION_EVIDENCE_DRIFT:.*:crosswalk/);
  drift(mutate((records, row) => { row.rpmPath = { ...row.rpmPath, l4: `${row.rpmPath.l4} (changed)` }; }));
  drift(mutate((records, row) => { row.standardUnitKey = 'H22-C-00-NOT-THE-FROZEN-UNIT'; }));
  drift(mutate((records, row) => { row.subUnitKey = 'H22-C-00-NOT-THE-FROZEN-SUB-UNIT'; }));
  drift(mutate((records, row) => { records.splice(records.indexOf(row), 1); }));
});

test('the shared crosswalk as committed reproduces every frozen legacy projection', () => {
  const run = build({ write: false });
  const stored = ledger();
  assert.equal(run.projected, 323);
  assert.deepEqual(run.ledger.records, stored.records);
  assert.deepEqual(run.ledger.crosswalk, stored.crosswalk);
});

// Post-cutover browse aliases pin the crosswalk digest of their approval time in the approved Meta.
const { buildPlan } = require('../archive/tools/build-generated-meta-browse-aliases.cjs');

test('browse aliases survive crosswalk rows they do not depend on, and fail closed when a dependent row changes', () => {
  const base = buildPlan(root);
  assert.equal(base.aliasCount, 19);
  const dependent = base.aliases.map(item => item.metaBrowsePath.recordId).filter(Boolean);
  assert.ok(dependent.length > 0);

  const unrelatedDoc = crosswalk();
  unrelatedDoc.records.push({ ...structuredClone(unrelatedDoc.records.find(row => !dependent.includes(row.id))), id: 'H1-RPM-999-TEST-ADDED' });
  const unrelated = buildPlan(root, { crosswalkDocument: unrelatedDoc });
  assert.equal(unrelated.aliasCount, base.aliasCount);
  assert.deepEqual(unrelated.dispositions.map(row => [row.uid, row.status, row.L4]), base.dispositions.map(row => [row.uid, row.status, row.L4]));

  const changedDoc = crosswalk();
  const row = changedDoc.records.find(item => item.id === dependent[0]);
  row.rpmPath = { ...row.rpmPath, l4: `${row.rpmPath.l4} (changed)` };
  const changed = buildPlan(root, { crosswalkDocument: changedDoc });
  assert.ok(changed.aliasCount < base.aliasCount);
  assert.ok(changed.dispositions.some(item => item.status === 'EVIDENCE_DEBT' && item.reason === 'RPM_LABEL_MISMATCH'));

  const missingDoc = crosswalk();
  missingDoc.records = missingDoc.records.filter(item => item.id !== dependent[0]);
  assert.ok(buildPlan(root, { crosswalkDocument: missingDoc }).aliasCount < base.aliasCount);
});
