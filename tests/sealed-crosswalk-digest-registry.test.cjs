'use strict';
// Append-only registry of sealed crosswalk digests (archive/data/meta-foundation/crosswalks/sealed-digests.v1.json).
// A seal is evidence that a digest was a real version of that crosswalk file, never an exemption: it is accepted only
// for the exact path and the row the Meta names must still be intact in the CURRENT file.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { validateAuthorityBinding } = require('../archive/tools/generated-meta-retention-gate.cjs');
const seal = require('../archive/tools/sealed-crosswalk-digests.cjs');

const root = path.resolve(__dirname, '..');
const CROSSWALK_DIR = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/';
const CROSSWALK = `${CROSSWALK_DIR}high1.json`;
const OTHER = `${CROSSWALK_DIR}high2-geometry.json`;
const REGISTRY = 'archive/generated/lite/v1/2022/H1/H22-C2-02-RELATION/extension-l4/registry.json';
const PACKAGE = 'alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q23_PACKAGE.json';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlob = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const entry = (overrides = {}) => ({
  path: CROSSWALK, sha256: 'a'.repeat(64), gitBlobSha1: 'b'.repeat(40), sealedAt: '2026-11-03T00:00:00.000Z', sealedBy: 'test', reason: 'test', ...overrides
});
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'sealed-crosswalk-registry-'));
const put = (dir, rel, bytes) => { fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); fs.writeFileSync(path.join(dir, rel), bytes); };

test('the committed registry is valid and seals the current digest of every crosswalk file', () => {
  const entries = seal.readRegistryEntries(root);
  assert.deepEqual(seal.validateRegistryEntries(entries), []);
  const files = fs.readdirSync(path.join(root, CROSSWALK_DIR)).filter(name => name.endsWith('.json'));
  assert.ok(files.length > 0);
  for (const name of files) {
    const bytes = fs.readFileSync(path.join(root, CROSSWALK_DIR, name));
    assert.equal(seal.crosswalkDigestIsSealed(root, CROSSWALK_DIR + name, sha(bytes)), true, `${name} current digest is sealed`);
  }
});

test('every committed seal that is reachable in git history equals a real version of its crosswalk file', () => {
  let verified = 0;
  for (const row of seal.readRegistryEntries(root)) {
    let bytes;
    try {
      execFileSync('git', ['cat-file', '-e', `${row.gitBlobSha1}^{blob}`], { cwd: root, stdio: 'ignore' });
      bytes = execFileSync('git', ['cat-file', 'blob', row.gitBlobSha1], { cwd: root, maxBuffer: 1 << 28 });
    } catch { continue; } // blob not present in a shallow or partial clone
    assert.equal(gitBlob(bytes), row.gitBlobSha1, `${row.path} blob sha1`);
    assert.equal(sha(bytes), row.sha256, `${row.path} sha256 equals the blob it names`);
    verified++;
  }
  assert.ok(verified > 0, 'at least one seal could be checked against git objects');
});

test('registry validation rejects malformed and duplicate entries', () => {
  assert.deepEqual(seal.validateRegistryEntries([entry(), entry({ sha256: 'c'.repeat(64) }), entry({ path: OTHER })]), []);
  const bad = [
    [entry({ sha256: 'A'.repeat(64) }), 'SHA256_INVALID'],
    [entry({ sha256: 'a'.repeat(63) }), 'SHA256_INVALID'],
    [entry({ sha256: 'g'.repeat(64) }), 'SHA256_INVALID'],
    [entry({ gitBlobSha1: 'b'.repeat(39) }), 'GIT_BLOB_SHA1_INVALID'],
    [entry({ path: 'archive/data/other/high1.json' }), 'PATH_NOT_UNDER_CROSSWALKS'],
    [entry({ path: `${CROSSWALK_DIR}../../x.json` }), 'PATH_NOT_NORMALIZED'],
    [entry({ path: `${CROSSWALK_DIR}high1.txt` }), 'PATH_NOT_UNDER_CROSSWALKS'],
    [entry({ path: seal.REGISTRY_REL }), 'PATH_IS_REGISTRY'],
    [entry({ sealedAt: 'yesterday' }), 'SEALED_AT_INVALID'],
    [entry({ sealedBy: '' }), 'SEALED_BY_INVALID'],
    [entry({ reason: undefined }), 'REASON_INVALID'],
    [{ ...entry(), extra: 1 }, 'UNKNOWN_KEYS']
  ];
  for (const [row, code] of bad) assert.ok(seal.validateRegistryEntries([row]).some(issue => issue.includes(code)), code);
  assert.deepEqual(seal.validateRegistryEntries([entry(), entry({ sealedAt: '2026-11-04T00:00:00.000Z', sealedBy: 'other' })]), [], 'exact duplicates (same path, sha256, blob) are tolerated');
  assert.ok(seal.validateRegistryEntries([entry(), entry({ gitBlobSha1: 'c'.repeat(40) })]).some(issue => issue.includes('CONFLICTING_GIT_BLOB_SHA1')));
  assert.deepEqual(seal.validateRegistryEntries([entry(), entry({ path: OTHER })]), [], 'same digest for two paths is two distinct entries');
  assert.deepEqual(seal.validateRegistryEntries('nope'), ['ENTRIES_NOT_ARRAY']);
});

test('a malformed registry file makes the digest check fail closed instead of silently accepting', () => {
  const dir = tmp();
  try {
    put(dir, seal.REGISTRY_REL, JSON.stringify({ schemaVersion: seal.REGISTRY_SCHEMA, entries: [entry({ sha256: 'zz' })] }));
    assert.throws(() => seal.crosswalkDigestAccepted(dir, CROSSWALK, 'a'.repeat(64), 'b'.repeat(64)), /SEALED_DIGEST_REGISTRY_INVALID/);
    put(dir, seal.REGISTRY_REL, JSON.stringify({ schemaVersion: seal.REGISTRY_SCHEMA, entries: [entry(), entry({ gitBlobSha1: 'c'.repeat(40) })] }));
    assert.throws(() => seal.crosswalkDigestAccepted(dir, CROSSWALK, 'a'.repeat(64), 'b'.repeat(64)), /CONFLICTING_GIT_BLOB_SHA1/);
    put(dir, seal.REGISTRY_REL, '{not json');
    assert.throws(() => seal.crosswalkDigestAccepted(dir, CROSSWALK, 'a'.repeat(64), 'b'.repeat(64)), /SEALED_DIGEST_REGISTRY_INVALID/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('a digest sealed for path A is not accepted for path B; an unsealed non-current digest is refused', () => {
  const dir = tmp();
  try {
    put(dir, seal.REGISTRY_REL, seal.serializeRegistry([entry()]));
    const current = 'f'.repeat(64);
    assert.equal(seal.crosswalkDigestAccepted(dir, CROSSWALK, 'a'.repeat(64), current), true);
    assert.equal(seal.crosswalkDigestAccepted(dir, OTHER, 'a'.repeat(64), current), false);
    assert.equal(seal.crosswalkDigestStatus(dir, OTHER, 'a'.repeat(64), current), 'NOT_SEALED');
    assert.equal(seal.crosswalkDigestAccepted(dir, CROSSWALK, 'e'.repeat(64), current), false);
    assert.equal(seal.crosswalkDigestStatus(dir, CROSSWALK, 'e'.repeat(64), current), 'NOT_SEALED');
    assert.equal(seal.crosswalkDigestStatus(dir, CROSSWALK, current, current), 'CURRENT');
    assert.equal(seal.crosswalkDigestStatus(dir, CROSSWALK, 'xyz', current), 'MALFORMED');
    assert.equal(seal.crosswalkDigestAccepted(dir, CROSSWALK, 'A'.repeat(64), current), true, 'hex case is not significant');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('planSeal appends exactly the bytes it was given, idempotently, and refuses an entry outside crosswalks/', () => {
  const dir = tmp();
  try {
    const bytes = Buffer.from('{"records":[]}\n');
    const first = seal.sealCrosswalkDigest(dir, { path: CROSSWALK, bytes, sealedBy: 'unit-test', reason: 'unit', now: new Date('2026-11-03T01:02:03.000Z') });
    assert.equal(first.changed, true);
    const written = seal.readRegistryEntries(dir);
    assert.deepEqual(written, [{ path: CROSSWALK, sha256: sha(bytes), gitBlobSha1: gitBlob(bytes), sealedAt: '2026-11-03T01:02:03.000Z', sealedBy: 'unit-test', reason: 'unit' }]);
    const snapshot = fs.readFileSync(path.join(dir, seal.REGISTRY_REL));
    assert.equal(seal.sealCrosswalkDigest(dir, { path: CROSSWALK, bytes, sealedBy: 'other-tool', reason: 'again' }).changed, false);
    assert.deepEqual(fs.readFileSync(path.join(dir, seal.REGISTRY_REL)), snapshot, 'second seal leaves the file byte-identical');
    const second = seal.sealCrosswalkDigest(dir, { path: OTHER, bytes, sealedBy: 'unit-test', reason: 'unit' });
    assert.equal(second.changed, true);
    assert.equal(seal.readRegistryEntries(dir).length, 2, 'same bytes under another path is a separate seal');
    assert.deepEqual(seal.readRegistryEntries(dir).map(row => row.path), [OTHER, CROSSWALK].sort(), 'entries are kept sorted by (path, sha256)');
    assert.deepEqual(seal.readRegistryEntries(dir).find(row => row.path === CROSSWALK), written[0], 'earlier entries are kept as they were');
    assert.throws(() => seal.planSeal(dir, { path: 'archive/data/elsewhere/high1.json', bytes, sealedBy: 'x', reason: 'y' }), /PATH_NOT_UNDER_CROSSWALKS/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

// ---- the row-level check stays: a sealed digest never excuses a changed or missing row ----
function fixture({ mutate, registryEntries }) {
  const dir = tmp();
  const original = fs.readFileSync(path.join(root, CROSSWALK));
  const doc = JSON.parse(original.toString('utf8'));
  if (mutate) mutate(doc);
  put(dir, CROSSWALK, `${JSON.stringify(doc, null, 2)}\n`);
  put(dir, REGISTRY, fs.readFileSync(path.join(root, REGISTRY)));
  if (registryEntries) put(dir, seal.REGISTRY_REL, seal.serializeRegistry(registryEntries(sha(original))));
  return { dir, pinned: sha(original) };
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
  return { meta, question: { standardCourse: s.standardCourse, standardUnitKey: s.standardUnitKey, subUnitKey: s.subUnitKey } };
}
const addUnrelatedRow = doc => { doc.records.push({ ...structuredClone(doc.records.find(row => row.id !== 'H1-RPM-216')), id: 'H1-RPM-999-TEST-ADDED' }); };
const check = (dir, pinned) => { const { meta, question } = metaFor(pinned); return validateAuthorityBinding(dir, meta, question, 'ALITE-PALMA25-2MID-Q23-C3'); };

test('a registry-sealed digest passes after unrelated rows were appended, and the bytes read are reported for sealing', () => {
  const f = fixture({ mutate: addUnrelatedRow, registryEntries: digest => [entry({ sha256: digest })] });
  try {
    const result = check(f.dir, f.pinned);
    assert.deepEqual(result.issues, []);
    const bytes = fs.readFileSync(path.join(f.dir, CROSSWALK));
    assert.equal(result.crosswalk.path, CROSSWALK);
    assert.equal(result.crosswalk.sha256, sha(bytes));
    assert.equal(result.crosswalk.gitBlobSha1, gitBlob(bytes));
    assert.notEqual(result.crosswalk.sha256, f.pinned);
  } finally { fs.rmSync(f.dir, { recursive: true, force: true }); }
});

test('an unsealed, non-current digest still fails with CROSSWALK_DIGEST_NOT_SEALED', () => {
  const f = fixture({ mutate: addUnrelatedRow });
  try {
    const issues = check(f.dir, f.pinned).issues;
    assert.ok(issues.includes('RPM_AUTHORITY_BYTES_MISMATCH'), issues.join(','));
    assert.ok(issues.includes(`CROSSWALK_DIGEST_NOT_SEALED:${CROSSWALK}`), issues.join(','));
  } finally { fs.rmSync(f.dir, { recursive: true, force: true }); }
});

test('a digest sealed only for another crosswalk path does not rescue a Meta pinned to this path', () => {
  const f = fixture({ mutate: addUnrelatedRow, registryEntries: digest => [entry({ path: OTHER, sha256: digest })] });
  try {
    const issues = check(f.dir, f.pinned).issues;
    assert.ok(issues.includes('RPM_AUTHORITY_BYTES_MISMATCH') && issues.some(issue => issue.startsWith('CROSSWALK_DIGEST_NOT_SEALED')), issues.join(','));
  } finally { fs.rmSync(f.dir, { recursive: true, force: true }); }
});

test('a sealed digest whose referenced row changed or disappeared still fails the row check', () => {
  for (const mutate of [
    doc => { const row = doc.records.find(r => r.id === 'H1-RPM-216'); row.rpmPath = { ...row.rpmPath, l3: `${row.rpmPath.l3} (changed)` }; },
    doc => { doc.records.find(r => r.id === 'H1-RPM-216').subUnitKey = 'H22-C2-00-OTHER'; },
    doc => { doc.records = doc.records.filter(r => r.id !== 'H1-RPM-216'); }
  ]) {
    const f = fixture({ mutate, registryEntries: digest => [entry({ sha256: digest })] });
    try {
      const issues = check(f.dir, f.pinned).issues;
      assert.ok(issues.length > 0, 'row change must fail');
      assert.ok(!issues.includes('RPM_AUTHORITY_BYTES_MISMATCH') && !issues.some(issue => issue.startsWith('CROSSWALK_DIGEST_NOT_SEALED')), 'the digest itself is sealed; the row check is what fails');
    } finally { fs.rmSync(f.dir, { recursive: true, force: true }); }
  }
});

test('two branches sealing the same digest merge by textual union, validate, and dedupe to one entry', () => {
  const dir = tmp();
  try {
    const bytes = Buffer.from('{"records":[1]}\n');
    const base = entry({ sha256: 'a'.repeat(64) });
    put(dir, seal.REGISTRY_REL, seal.serializeRegistry([base]));
    const baseBytes = fs.readFileSync(path.join(dir, seal.REGISTRY_REL));
    const branch = (sealedBy, extra) => {
      fs.writeFileSync(path.join(dir, seal.REGISTRY_REL), baseBytes);
      seal.sealCrosswalkDigest(dir, { path: CROSSWALK, bytes, sealedBy, reason: sealedBy, now: new Date(sealedBy === 'branch-a' ? '2026-11-03T01:00:00Z' : '2026-11-03T02:00:00Z') });
      if (extra) seal.sealCrosswalkDigest(dir, { path: OTHER, bytes: Buffer.from('other\n'), sealedBy, reason: sealedBy });
      return fs.readFileSync(path.join(dir, seal.REGISTRY_REL), 'utf8');
    };
    const a = branch('branch-a', false);
    const b = branch('branch-b', true);
    const rows = text => text.split('\n').filter(line => line.startsWith('    {')).map(line => line.trim().replace(/,$/, ''));
    const union = [...new Set([...rows(a), ...rows(b)])];
    assert.ok(union.length > new Set([...rows(a)]).size + 1, 'the two branches wrote different lines for the same digest (different sealedAt/sealedBy)');
    const merged = `{\n  "schemaVersion": "${seal.REGISTRY_SCHEMA}",\n  "entries": [\n    ${union.join(',\n    ')}\n  ]\n}\n`;
    put(dir, seal.REGISTRY_REL, merged);
    const entries = seal.readRegistryEntries(dir);
    assert.deepEqual(seal.validateRegistryEntries(JSON.parse(merged).entries), []);
    assert.equal(entries.filter(row => row.path === CROSSWALK && row.sha256 === sha(bytes)).length, 1, 'deduped to one entry');
    assert.equal(entries.length, 3, 'base + shared digest + the other branch\'s extra seal');
    assert.equal(seal.crosswalkDigestAccepted(dir, CROSSWALK, sha(bytes), 'f'.repeat(64)), true);
    // the next write rewrites the file deduplicated and sorted
    seal.sealCrosswalkDigest(dir, { path: OTHER, bytes: Buffer.from('third\n'), sealedBy: 'c', reason: 'c' });
    assert.equal(seal.parseRegistry(fs.readFileSync(path.join(dir, seal.REGISTRY_REL))).length, 4);
    assert.equal(fs.readFileSync(path.join(dir, seal.REGISTRY_REL), 'utf8').split('\n').filter(line => line.startsWith('    {')).length, 4);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
