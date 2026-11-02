'use strict';
// The retention gate pins the whole-file digest of the shared RPM crosswalk in approved Meta. The crosswalk only grows,
// so a digest a sealed receipt recorded is accepted, but the record the Meta names is still checked against the CURRENT file.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const crypto = require('node:crypto');
const { validateAuthorityBinding } = require('../archive/tools/generated-meta-retention-gate.cjs');
const { sealedCrosswalkDigests, crosswalkDigestAccepted } = require('../archive/tools/sealed-crosswalk-digests.cjs');

const root = path.resolve(__dirname, '..');
const CROSSWALK = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json';
const REGISTRY = 'archive/generated/lite/v1/2022/H1/H22-C2-02-RELATION/extension-l4/registry.json';
const RECEIPTS = [
  'archive/data/generated-lite-consumer/v1/meta-browse-alias-receipt-20261009.json',
  'archive/data/generated-lite-consumer/v1/legacy-meta-evidence-323.json'
];
const PACKAGE = 'alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q23_PACKAGE.json';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlob = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');

function fixture(mutateCrosswalk) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'retention-crosswalk-digest-'));
  const put = (rel, bytes) => { fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); fs.writeFileSync(path.join(dir, rel), bytes); };
  const doc = JSON.parse(fs.readFileSync(path.join(root, CROSSWALK), 'utf8'));
  if (mutateCrosswalk) mutateCrosswalk(doc);
  put(CROSSWALK, `${JSON.stringify(doc, null, 2)}\n`);
  put(REGISTRY, fs.readFileSync(path.join(root, REGISTRY)));
  for (const rel of RECEIPTS) put(rel, fs.readFileSync(path.join(root, rel)));
  return dir;
}
function metaFor(pinned) {
  const item = JSON.parse(fs.readFileSync(path.join(root, PACKAGE), 'utf8')).items.find(x => x.uid === 'ALITE-PALMA25-2MID-Q23-C3');
  const s = item.meta;
  const registry = fs.readFileSync(path.join(root, REGISTRY));
  const meta = {
    rpmL1: s.rpmL1, rpmL2: s.rpmL2, rpmL3: s.rpmL3, rpmL4: s.generatedExtL4Id, rpmL4Namespace: 'GENERATED_EXT_L4',
    rpmPrimaryRecordId: 'H1-RPM-216', rpmAuthorityRef: CROSSWALK, rpmAuthoritySha256: pinned,
    generatedL4RegistryRef: REGISTRY, generatedL4RegistrySha256: sha(registry), generatedL4RegistryGitBlobSha1: gitBlob(registry),
    secondaryConceptKeys: [], crossConceptKeys: s.crossConceptKeys, conditionKeys: s.conditionKeys,
    sourceKind: 'generated', difficultyBucket: s.difficultyBucket, level: s.level, problemTypeKey: s.problemTypeKey, templateKey: s.templateKey,
    integrationPattern: s.integrationPattern, standardCourse: s.standardCourse, standardUnitKey: s.standardUnitKey, subUnitKey: s.subUnitKey
  };
  const question = { standardCourse: s.standardCourse, standardUnitKey: s.standardUnitKey, subUnitKey: s.subUnitKey };
  return { meta, question };
}
const sealed = () => [...sealedCrosswalkDigests(root, CROSSWALK)][0];

test('the sealed receipts record the digest that approved Meta still pins, for the crosswalk file only', () => {
  assert.match(sealed(), /^[a-f0-9]{64}$/);
  assert.equal(sealedCrosswalkDigests(root, 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-geometry.json').size, 0);
  assert.equal(crosswalkDigestAccepted(root, CROSSWALK, sealed(), 'b'.repeat(64)), true);
  assert.equal(crosswalkDigestAccepted(root, CROSSWALK, 'c'.repeat(64), 'b'.repeat(64)), false);
  assert.equal(crosswalkDigestAccepted(root, CROSSWALK, 'not-a-digest', 'b'.repeat(64)), false);
});

test('a pinned sealed digest passes when only rows the Meta does not depend on were added or changed', () => {
  const dir = fixture(doc => {
    const other = doc.records.find(row => row.id !== 'H1-RPM-216');
    other.problemTypeLabelKo = `${other.problemTypeLabelKo || ''} (changed)`;
    doc.records.push({ ...structuredClone(other), id: 'H1-RPM-999-TEST-ADDED' });
  });
  try {
    const { meta, question } = metaFor(sealed());
    assert.deepEqual(validateAuthorityBinding(dir, meta, question, 'ALITE-PALMA25-2MID-Q23-C3').issues, []);
    // the current digest of the (changed) file is accepted as before
    const current = sha(fs.readFileSync(path.join(dir, CROSSWALK)));
    assert.deepEqual(validateAuthorityBinding(dir, metaFor(current).meta, question, 'ALITE-PALMA25-2MID-Q23-C3').issues, []);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('an arbitrary digest, or a changed or missing dependent row, is still refused', () => {
  const unchanged = fixture();
  try {
    const { meta, question } = metaFor('d'.repeat(64));
    assert.ok(validateAuthorityBinding(unchanged, meta, question, 'ALITE-PALMA25-2MID-Q23-C3').issues.includes('RPM_AUTHORITY_BYTES_MISMATCH'));
  } finally { fs.rmSync(unchanged, { recursive: true, force: true }); }

  for (const mutate of [
    doc => { const row = doc.records.find(r => r.id === 'H1-RPM-216'); row.rpmPath = { ...row.rpmPath, l3: `${row.rpmPath.l3} (changed)` }; },
    doc => { doc.records.find(r => r.id === 'H1-RPM-216').subUnitKey = 'H22-C2-00-OTHER'; },
    doc => { doc.records = doc.records.filter(r => r.id !== 'H1-RPM-216'); }
  ]) {
    const dir = fixture(mutate);
    try {
      const { meta, question } = metaFor(sealed());
      const issues = validateAuthorityBinding(dir, meta, question, 'ALITE-PALMA25-2MID-Q23-C3').issues;
      assert.ok(issues.length > 0 && !issues.includes('RPM_AUTHORITY_BYTES_MISMATCH'), issues.join(','));
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  }
});
