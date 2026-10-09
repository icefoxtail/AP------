'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { buildPlan } = require('../archive/tools/build-generated-meta-browse-aliases.cjs');

const root = path.resolve(__dirname, '..');
const indexRel = 'archive/data/generated-lite-consumer/v1/index.json';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

test('post-cutover aliases are exact, UID-scoped, digest-bound, and leave Meta/source bytes unchanged', () => {
  const indexPath = path.join(root, indexRel);
  const rawBefore = fs.readFileSync(indexPath);
  const indexBefore = JSON.parse(rawBefore.toString('utf8'));
  const plan = buildPlan(root);
  const rawAfter = fs.readFileSync(indexPath);
  assert.deepEqual(rawAfter, rawBefore, 'planning must not mutate the shared index');
  assert.equal(plan.scope, 'EXACT_POST_CUTOVER_23_UIDS_INDEX_ONLY');
  assert.equal(plan.dispositions.length, 23);
  assert.equal(plan.aliasCount, 19);
  assert.equal(plan.evidenceDebtCount, 4);
  assert.equal(new Set(plan.dispositions.map(row => row.uid)).size, 23);
  const byUid = new Map(indexBefore.records.map(row => [row.uid, row]));
  for (const item of plan.aliases) {
    const row = byUid.get(item.uid);
    assert.ok(row);
    assert.equal(item.metaBrowsePath.status, 'EXACT_AUTHORITY_ALIAS');
    assert.equal(item.metaBrowsePath.metaFinalSha256, row.metaFinalSha256);
    const authorityBytes = fs.readFileSync(path.join(root, item.metaBrowsePath.authorityRef));
    assert.equal(hash(authorityBytes), item.metaBrowsePath.authoritySha256);
    const rowBefore = canonicalMeta(row.meta);
    assert.equal(canonicalMeta(row.meta), rowBefore, 'approved raw Meta stays unchanged');
    if (item.metaBrowsePath.rpmL4Namespace === 'GENERATED_EXT_L4') {
      assert.equal(item.metaBrowsePath.L4, row.meta.rpmL4, 'EXT L4 retains its explicit extension ID and label');
      assert.ok(item.metaBrowsePath.parentRecordIds.length > 0);
    } else {
      assert.equal(item.metaBrowsePath.recordId, row.meta.rpmPrimaryRecordId);
      assert.match(item.metaBrowsePath.L1, /.+/);
      assert.match(item.metaBrowsePath.L4, /.+/);
    }
  }
  const unknown = plan.dispositions.filter(row => row.status === 'EVIDENCE_DEBT').map(row => row.uid).sort();
  assert.deepEqual(unknown, [
    'ALITE-B01-2025PALMA-0003',
    'B05_Q09_C01_CENTROID_RATIO_RECOVERY',
    'B05_Q18_C01_CENTROID_AREA_SIDE_RECOVERY',
    'B06_Q23_C01_PARAMETER_INTERSECTION_EQUIDISTANCE'
  ].sort());

  const futureIndex = JSON.parse(rawBefore.toString('utf8'));
  futureIndex.records.push({ uid: 'ALITE-SYNTHETIC-FUTURE-0347', sourceKind: 'generated', consumerSelectable: true });
  futureIndex.approvedCount = futureIndex.records.length;
  const futurePlan = buildPlan(root, { indexDocument: futureIndex });
  assert.deepEqual(futurePlan.dispositions, plan.dispositions, 'new registrations stay outside the historical 23 UID compatibility scope');
  assert.deepEqual(futurePlan.aliases, plan.aliases);

  const withdrawnIndex = JSON.parse(rawBefore.toString('utf8'));
  withdrawnIndex.records = withdrawnIndex.records.filter(row => row.uid !== 'ALITE-B01-2025PALMA-0001');
  const withdrawalPlan = buildPlan(root, { indexDocument: withdrawnIndex });
  const withdrawn = withdrawalPlan.dispositions.find(row => row.uid === 'ALITE-B01-2025PALMA-0001');
  assert.equal(withdrawn.status, 'INACTIVE_WITHDRAWN_FROM_INDEX');
  assert.equal(withdrawalPlan.dispositions.length, 23);
});

function canonicalMeta(meta) {
  const sort = value => Array.isArray(value) ? value.map(sort) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, sort(value[key])])) : value;
  return JSON.stringify(sort(meta));
}
