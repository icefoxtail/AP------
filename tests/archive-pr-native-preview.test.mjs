import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { NATIVE_REQUEST_SCHEMA, DIFFICULTY_REQUEST_SCHEMA, selectNativeRequests, orderNativeRequests, applyNativeRequests,
  validateNativePreview, verifyNativeRequests, selectPendingNativeRequests, pendingNativeRequestPaths, SHADOW_RESTORE_PATHS } from '../tools/ci/archive-pr-native-preview.mjs';
import { DECISION_DOCUMENT } from '../archive/tools/meta-foundation/register-type-judgment.mjs';
const DECISION_SECTION = 'CURRENT fixture decision section';
import { CI_WORKFLOW_PATH, REGISTRATION_CHECKS, prRegistrationProofNeeded,
  producePrRegistrationProof, validateLocalRegistrationProof,
} from '../tools/ci/archive-pr-registration-proof.mjs';

import { preparePrRegistration } from '../tools/ci/archive-pr-registration-prepare.mjs';
import { registerDifficulty5 } from '../archive/tools/meta-foundation/register-difficulty5.mjs';
import { expectedRuntime } from '../archive/tools/meta-foundation/compile-meta-foundation.mjs';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
const copy = value => structuredClone(value);
const REQUEST = '.archive-meta-register/inbox/own-reviewed-exam.json';
const OTHER = '.archive-meta-register/inbox/other-owner-course.json';
const SOURCE = 'archive/exams/original/native.js';
const EVIDENCE = 'docs/operations/own-native-proof.json';
const DIFFICULTY_REQUEST = '.archive-meta-register/inbox/zz-reviewed-difficulty.json';
const DIFFICULTY_EVIDENCE = '.archive-meta-register/evidence/own-difficulty.json';
const META = 'archive/data/question_metadata.json';
const IDENTITY = 'archive/data/question_identity_map.json';
const BASIC_LINKS = 'archive/data/basic-scope-source-links.json';
const AUTHORITY = 'archive/data/meta-foundation/canonical/fixture/pack.json';
const RECEIPT = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/own-reviewed-exam.json';
const AUDIT_PRIOR_RECEIPT = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/prior-full-audit.json';
const PLANNED = [META, AUTHORITY, RECEIPT].sort();
const ALLOWED = [/^archive\/db\.js$/, /^archive\/data\/question_metadata\.json$/,
  /^archive\/data\/archive2-(?:catalog|canonical-input-manifest)\.json$/];

function sourceQualityHoldFixture(write) {
  const evidencePath = 'docs/operations/fixture-quality-hold-evidence.json';
  const evidence = json({ unresolved: 'synthetic source condition; no approval granted' });
  const evidenceRef = { path: evidencePath, sha256: sha(evidence) };
  write(evidencePath, evidence);
  const sourceArchiveFile = 'original/quality-held.js';
  const imagePath = 'archive/assets/images/quality-held.svg', image = '<svg/>\n';
  const questionUid = 'qid_v1_' + 'c'.repeat(64);
  const source = 'window.questions = ' + JSON.stringify([{ id: 1, questionUid,
    image: imagePath.slice('archive/'.length) }]) + ';\n';
  const receiptPath = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/fixture-quality-hold.json';
  const receipt = json({ approval: { evidenceRefs: [evidenceRef] } });
  write('archive/exams/' + sourceArchiveFile, source); write(imagePath, image); write(receiptPath, receipt);
  write('archive/data/meta-foundation/source-quality-holds-v1.json', json({
    schemaVersion: 'archive-source-quality-holds-v1', status: 'ACTIVE', records: [{
      holdId: 'fixture-quality-hold', status: 'HOLD', reasonCode: 'SOURCE_CONDITION_NOT_ESTABLISHED',
      questionUid, sourceArchiveFile, sourceOrdinal: 1, expectedQuestionCount: 1,
      sourceBlobSha1: createHash('sha1').update(`blob ${Buffer.byteLength(source)}\0`).update(source).digest('hex'),
      sourceSha256: sha(source), image: { path: imagePath, sha256: sha(image), bytes: Buffer.byteLength(image) },
      originalReceipt: { path: receiptPath, sha256: sha(receipt) },
      pendingRootEvidence: evidenceRef, independentEvidence: evidenceRef, unresolvedEvidence: evidenceRef,
      releasePolicy: 'EXPLICIT_SOURCE_EVIDENCE_RESOLUTION_REQUIRED',
    }],
  }));
}

const GEOMETRY_VERSION_PACK = 'archive/data/meta-foundation/canonical/packs/geometry-equations';
const GEOMETRY_VERSION_PROVIDER = '.archive-meta-register/inbox/zz-geometry-taxonomy-provider.json';
const GEOMETRY_VERSION_KEY = { curriculum: '2015', standardCourse: '수학(상)', standardUnitKey: 'H15-SA-09',
  subUnitKey: 'H15-SA-09-TRIANGLE_CENTROID_AREA', problemTypeKey: 'PT_COORD_CENTROID' };
function geometryVersionFixture(t, { mutateProvider, mutateConsumer, mutatePack, mutateBindings, secondProvider = false, providerConsumes = false } = {}) {
  const f = fixture(t, { partial: true, otherOwner: false, mutateRequest: request => {
    request.approval.type = 'REVIEW2'; request.approval.reviewPassCount = 2;
    request.items[0].after = { ...copy(GEOMETRY_VERSION_KEY), templateKey: 'TPL_EXISTING_CENTROID' };
    mutateConsumer?.(request);
  } });
  const pack = { packId: 'GEOMETRY_EQUATIONS', packVersion: '1.0.2', canonicalStatus: 'ACTIVE' };
  const bindings = { ownerPack: 'GEOMETRY_EQUATIONS', status: 'ACTIVE', bindings: [
    { ...copy(GEOMETRY_VERSION_KEY), ownerPack: 'GEOMETRY_EQUATIONS', status: 'ACTIVE' },
  ] };
  mutatePack?.(pack); mutateBindings?.(bindings);
  f.write(`${GEOMETRY_VERSION_PACK}/pack.json`, json(pack));
  f.write(`${GEOMETRY_VERSION_PACK}/bindings.json`, json(bindings));
  const provider = copy(f.request);
  provider.requestId = 'zz-geometry-taxonomy-provider';
  provider.items[0].questionUid = 'geometry-provider-uid'; provider.items[0].sourceOrdinal = 6;
  provider.items[0].after = providerConsumes ? copy(GEOMETRY_VERSION_KEY) : copy(BINDING_KEY);
  provider.registryChanges = [{ path: `${GEOMETRY_VERSION_PACK}/taxonomy.json`, collection: 'templates',
    match: { templateKey: 'TPL_NEW_GEOMETRY_TEMPLATE' }, before: null,
    after: { templateKey: 'TPL_NEW_GEOMETRY_TEMPLATE', parentProblemTypeKey: 'PT_COORD_CENTROID', status: 'ACTIVE' },
    evidenceRefs: copy(provider.approval.evidenceRefs) }];
  mutateProvider?.(provider); f.write(GEOMETRY_VERSION_PROVIDER, json(provider));
  const secondPath = '.archive-meta-register/inbox/zy-second-geometry-provider.json';
  if (secondProvider) {
    const second = copy(provider); second.requestId = 'zy-second-geometry-provider';
    second.items[0].questionUid = 'second-provider-uid'; second.items[0].sourceOrdinal = 7;
    second.registryChanges[0].match.templateKey = second.registryChanges[0].after.templateKey = 'TPL_SECOND_GEOMETRY_TEMPLATE';
    f.write(secondPath, json(second));
  }
  f.git('add', '.'); f.git('commit', '-qm', 'fixed geometry version dependency input');
  const headSha = f.git('rev-parse', 'HEAD');
  return { ...f, provider, pack, bindings, secondPath, headSha,
    select: () => selectNativeRequests({ root: f.root, baseSha: f.baseSha, headSha }),
    pending: () => selectPendingNativeRequests({ root: f.root, headSha }) };
}

test('geometry pack version dependency orders taxonomy-only provider before exact native consumers', t => {
  const f = geometryVersionFixture(t), selected = f.select();
  assert.deepEqual(selected.map(r => r.path), [GEOMETRY_VERSION_PROVIDER, REQUEST]);
  assert.deepEqual(f.pending(), selected);
  assert.deepEqual(orderNativeRequests([...selected].reverse()).map(r => r.path), [GEOMETRY_VERSION_PROVIDER, REQUEST]);
  assert.equal(selected[0].registryDependency.provides.length, 0, 'no fabricated ACTIVE binding addition');
  assert.equal(selected[0].geometryPackVersionDependency.provider, true);
  assert.deepEqual(selected[1].geometryPackVersionDependency.consumers[0].key, GEOMETRY_VERSION_KEY);
  assert.equal(selected[1].geometryPackVersionDependency.headSha, f.headSha);
  assert.equal(selected[1].geometryPackVersionDependency.packRef.sha256, sha(json(f.pack)));
  assert.equal(selected[1].geometryPackVersionDependency.bindingsRef.sha256, sha(json(f.bindings)));
});

test('geometry pack version dependency leaves provider-free selection without extra canonical reads', t => {
  const f = fixture(t, { partial: true, otherOwner: false,
    mutateRequest: r => { r.items[0].after = copy(GEOMETRY_VERSION_KEY); } });
  const selected = selectNativeRequests({ root: f.root, baseSha: f.baseSha, headSha: f.headSha });
  assert.deepEqual(selected.map(r => r.path), [REQUEST]);
  assert.equal(selected[0].geometryPackVersionDependency, undefined);
  assert.equal(fs.existsSync(path.join(f.root, `${GEOMETRY_VERSION_PACK}/pack.json`)), false);
});

for (const [name, change] of [
  ['other pack', r => { r.registryChanges[0].path = 'archive/data/meta-foundation/canonical/packs/middle2/taxonomy.json'; }],
  ['noncanonical path', r => { r.registryChanges[0].path = 'archive/data/meta-foundation/compiled/geometry-equations/taxonomy.json'; }],
  ['unrecognized collection', r => { r.registryChanges[0].collection = 'other'; }],
  ['no change', r => { r.registryChanges[0].before = copy(r.registryChanges[0].after); }],
]) test(`geometry pack version dependency does not infer a provider from ${name}`, t => {
  const f = geometryVersionFixture(t, { mutateProvider: change }), selected = f.select();
  assert.deepEqual(selected.map(r => r.path), [REQUEST, GEOMETRY_VERSION_PROVIDER]);
  assert.ok(selected.every(r => r.geometryPackVersionDependency === undefined));
});

for (const field of Object.keys(GEOMETRY_VERSION_KEY)) test(`geometry pack version dependency requires exact consumer ${field}`, t => {
  const f = geometryVersionFixture(t, { mutateConsumer: r => { r.items[0].after[field] += '-other'; } });
  const selected = f.select(); assert.deepEqual(selected.map(r => r.path), [REQUEST, GEOMETRY_VERSION_PROVIDER]);
  assert.equal(selected[0].geometryPackVersionDependency, undefined);
});

test('geometry pack version dependency never infers a missing after key from before', t => {
  const f = geometryVersionFixture(t, { mutateConsumer: r => {
    r.items[0].before = copy(GEOMETRY_VERSION_KEY); delete r.items[0].after.subUnitKey;
  } });
  const selected = f.select(); assert.deepEqual(selected.map(r => r.path), [REQUEST, GEOMETRY_VERSION_PROVIDER]);
  assert.equal(selected[0].geometryPackVersionDependency, undefined);
});

for (const [name, change, code] of [
  ['ambiguous ACTIVE binding', bindings => { bindings.bindings.push(copy(bindings.bindings[0])); }, /REGISTRY_VERSION_AMBIGUOUS/],
  ['wrong binding owner', bindings => { bindings.ownerPack = 'MIDDLE2'; }, /REGISTRY_VERSION_CONTEXT/],
  ['inactive binding document', bindings => { bindings.status = 'REVIEW_REQUIRED'; }, /REGISTRY_VERSION_CONTEXT/],
]) test(`geometry pack version dependency refuses ${name}`, t => {
  const f = geometryVersionFixture(t, { mutateBindings: change }); assert.throws(f.select, code);
});

test('geometry pack version dependency does not consume inactive or differently owned binding rows', t => {
  for (const mutateBindings of [b => { b.bindings[0].status = 'REVIEW_REQUIRED'; }, b => { b.bindings[0].ownerPack = 'MIDDLE2'; }]) {
    const f = geometryVersionFixture(t, { mutateBindings });
    assert.deepEqual(f.select().map(r => r.path), [REQUEST, GEOMETRY_VERSION_PROVIDER]);
  }
});

test('geometry pack version dependency refuses a wrong or inactive canonical pack', t => {
  for (const mutatePack of [p => { p.packId = 'MIDDLE2'; }, p => { p.canonicalStatus = 'REVIEW_REQUIRED'; }, p => { p.packVersion = 'current'; }]) {
    const f = geometryVersionFixture(t, { mutatePack }); assert.throws(f.select, /REGISTRY_VERSION_CONTEXT/);
  }
});

test('geometry pack version dependency uses immutable HEAD during postwrite reselection', t => {
  const f = geometryVersionFixture(t), before = f.select();
  f.write(`${GEOMETRY_VERSION_PACK}/pack.json`, json({ ...f.pack, packVersion: '1.0.3' }));
  f.write(`${GEOMETRY_VERSION_PACK}/bindings.json`, json({ ...f.bindings, bindings: [] }));
  assert.deepEqual(f.select(), before, 'selection is fixed; registrar still checks the actual worktree');
});

test('geometry pack version dependency waits for every selected provider', t => {
  const f = geometryVersionFixture(t, { secondProvider: true }), selected = f.select();
  assert.deepEqual(selected.map(r => r.path), [f.secondPath, GEOMETRY_VERSION_PROVIDER, REQUEST]);
  assert.deepEqual(orderNativeRequests([...selected].reverse()).map(r => r.path), [GEOMETRY_VERSION_PROVIDER, f.secondPath, REQUEST]);
});

test('geometry pack version dependency allows self-provided pack and refuses mutual provider consumers', t => {
  const f = geometryVersionFixture(t, { providerConsumes: true }), selected = f.select();
  assert.deepEqual(selected.map(r => r.path), [GEOMETRY_VERSION_PROVIDER, REQUEST]);
  assert.deepEqual(orderNativeRequests([selected[0]]).map(r => r.path), [GEOMETRY_VERSION_PROVIDER]);
  const cycle = geometryVersionFixture(t, { providerConsumes: true, secondProvider: true });
  assert.throws(cycle.select, /REGISTRY_DEPENDENCY_CYCLE/);
});

test('geometry pack version dependency preserves an existing binding cycle refusal', t => {
  const f = geometryVersionFixture(t), selected = copy(f.select());
  const provider = selected.find(r => r.path === GEOMETRY_VERSION_PROVIDER), consumer = selected.find(r => r.path === REQUEST);
  const other = copy(BINDING_KEY);
  consumer.registryDependency.provides = [{ path: 'archive/data/meta-foundation/canonical/packs/middle2/bindings.json', key: other }];
  provider.registryDependency.requires.push({ questionUid: 'geometry-provider-uid', sourceOrdinal: 6, key: other });
  assert.throws(() => orderNativeRequests(selected), /REGISTRY_DEPENDENCY_CYCLE/);
});

for (const [name, change, code] of [
  ['missing descriptor', selected => { delete selected[0].geometryPackVersionDependency; }, /REGISTRY_VERSION_DESCRIPTOR/],
  ['forged provider flag', selected => { selected[0].geometryPackVersionDependency.provider = false; }, /REGISTRY_VERSION_DESCRIPTOR/],
  ['unknown descriptor key', selected => { selected[1].geometryPackVersionDependency.skip = true; }, /REGISTRY_VERSION_DESCRIPTOR/],
  ['nonfixed context', selected => { selected[1].geometryPackVersionDependency.headSha = 'main'; }, /REGISTRY_VERSION_DESCRIPTOR/],
  ['wrong pack path', selected => { selected[1].geometryPackVersionDependency.packRef.path = 'archive/other.json'; }, /REGISTRY_VERSION_DESCRIPTOR/],
  ['different snapshot digest', selected => { selected[1].geometryPackVersionDependency.packRef.sha256 = 'f'.repeat(64); }, /REGISTRY_VERSION_CONTEXT/],
  ['unselected consumer', selected => { selected[1].geometryPackVersionDependency.consumers[0].questionUid = 'outside'; }, /REGISTRY_VERSION_DESCRIPTOR/],
  ['duplicate consumer', selected => { const d = selected[1].geometryPackVersionDependency; d.consumers.push(copy(d.consumers[0])); }, /REGISTRY_VERSION_DESCRIPTOR/],
]) test(`geometry pack version dependency rejects ${name}`, t => {
  const f = geometryVersionFixture(t), selected = copy(f.select()); change(selected);
  assert.throws(() => orderNativeRequests(selected), code);
});

test('geometry pack version dependency rejects a removed provider and duplicate request path', t => {
  const f = geometryVersionFixture(t), selected = f.select();
  assert.throws(() => orderNativeRequests(selected.filter(r => r.path === REQUEST)), /REGISTRY_VERSION_PROVIDER_NOT_SELECTED/);
  assert.throws(() => orderNativeRequests([...selected, selected[0]]), /DUPLICATE_REQUEST_PATH/);
});

test('geometry pack version dependency preserves the issued REVIEW2 row through the production compiler', t => {
  const f = geometryVersionFixture(t), selected = f.select();
  const runtimePath = 'archive/data/meta-foundation/runtime/geometry-equations-v1.json';
  const receiptPath = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/synthetic.json';
  const project = (version, row, receiptRow = row) => {
    const runtime = { packVersion: version, runtimeVersion: `GEOMETRY_EQUATIONS@${version}/reviewed-exam-v2`, records: [copy(row)] };
    const receipt = { schemaVersion: 'archive-reviewed-exam-meta-registration-v2', metadataRegistrationStatus: 'REGISTERED',
      requestId: 'synthetic', sourceArchiveFile: receiptRow.sourceArchiveFile,
      runtimeRecords: [copy(receiptRow)], appliedRecords: [copy(receiptRow)] };
    const read = p => {
      assert.ok(p === runtimePath || p === receiptPath, `unexpected compiler input: ${p}`);
      return copy(p === runtimePath ? runtime : receipt);
    };
    const projected = expectedRuntime({ packs: [{ meta: { packId: 'GEOMETRY_EQUATIONS', packVersion: version } }] }, read);
    assert.deepEqual(runtime.records, [row], 'projection must not mutate its input row');
    assert.deepEqual(receipt.runtimeRecords, [receiptRow], 'projection must not mutate its issued receipt');
    return JSON.parse(projected).records[0];
  };
  const execute = requests => {
    let version = '1.0.2', issued;
    for (const request of requests) {
      if (request.path === GEOMETRY_VERSION_PROVIDER) version = '1.0.3';
      else issued = { questionUid: 'fixture', metadataApprovalType: 'REVIEW2', approvalEvidence: [receiptPath],
        sourceArchiveFile: 'original/synthetic-geometry-fixture.js', sourceOrdinal: 1, sourceFingerprint: 'synthetic-fingerprint',
        metaFoundationPackId: 'GEOMETRY_EQUATIONS', metaFoundationPackVersion: version,
        metadataRevision: `meta-foundation:GEOMETRY_EQUATIONS@${version}:exam-review2-v2:synthetic` };
    }
    return { issued, afterCompile: project(version, issued) };
  };
  const good = execute(selected); assert.deepEqual(good.afterCompile, good.issued);
  assert.equal(good.issued.metadataRevision, 'meta-foundation:GEOMETRY_EQUATIONS@1.0.3:exam-review2-v2:synthetic');
  assert.equal(good.issued.metaFoundationPackVersion, '1.0.3');
  const inverse = execute([...selected].reverse());
  // The current compiler preserves an exact issued row; ordering still decides
  // the pack version at issuance and must not rely on a later compiler rewrite.
  assert.deepEqual(inverse.afterCompile, inverse.issued);
  assert.notDeepEqual(inverse.issued, good.issued);
  assert.equal(inverse.afterCompile.metadataRevision, 'meta-foundation:GEOMETRY_EQUATIONS@1.0.2:exam-review2-v2:synthetic');
  assert.equal(inverse.afterCompile.metaFoundationPackVersion, '1.0.2');
  const forged = { ...good.afterCompile, approvalEvidence: ['different'] };
  assert.notDeepEqual(forged, good.issued, 'whole-row evidence equality is not relaxed by ordering');
  assert.throws(() => project('1.0.3', forged, good.issued), /does not match its issued Native receipt/);
  assert.throws(() => project('1.0.3', { ...good.issued, sourceFingerprint: 'changed' }, good.issued),
    /does not match its issued Native receipt/, 'unchanged evidence cannot authorize a changed runtime row');
});

function fixture(t, { partial = false, identityOnly = false, difficultyOnly = false, pairedDifficulty = false, auditPreservation = false, auditSourcePreservation = false, finalQaPreservation = false, basicPreservation = false, directType = false, decisionDoc = false, otherOwner = true, mutateRequest } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'native-preview-fixture-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, text, target = root) => {
    fs.mkdirSync(path.dirname(path.join(target, file)), { recursive: true });
    fs.writeFileSync(path.join(target, file), text);
  };
  const git = (...args) => {
    const r = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr); return r.stdout.trim();
  };
  git('init', '-q', '--initial-branch=main');
  git('config', 'user.name', 'fixture'); git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  for (const file of [...REGISTRATION_CHECKS.map(c => c.file), CI_WORKFLOW_PATH,
    'archive/build_db.py', 'archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs',
    'archive/tools/meta-foundation/compile-meta-foundation.mjs',
    'archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs',
    'archive/tools/meta-foundation/register-difficulty5.mjs',
    'archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs',
    'archive/tools/build-archive2-catalog.mjs', 'tools/ci/archive-pr-registration-prepare.mjs',
    'tools/ci/archive-pr-registration-proof.mjs', 'tools/ci/archive-pr-native-preview.mjs',
    'tools/ci/push-touches-paths.mjs']) write(file, '// fixed checker\n');
  write('tools/ci/archive-pages-registration.paths', [
    'archive/db.js', META, 'archive/data/archive2-catalog.json',
    'archive/data/archive2-canonical-input-manifest.json',
  ].join('\n') + '\n');
  write(SOURCE, 'window.questions = '+JSON.stringify(Array.from({length:partial?24:1},(_,i)=>({id:i+1})))+';\n');
  write(EVIDENCE, json({ reviewed: 'fixture approval evidence, without student content' }));
  if (decisionDoc) write(DECISION_DOCUMENT, '# metadata decision fixture\n\n' + DECISION_SECTION + '\n');
  sourceQualityHoldFixture(write);
  if (auditSourcePreservation) write(AUDIT_PRIOR_RECEIPT, json({
    schemaVersion: 'archive-reviewed-exam-meta-registration-v2', metadataRegistrationStatus: 'REGISTERED',
    requestId: path.posix.basename(AUDIT_PRIOR_RECEIPT, '.json'), sourceArchiveFile: 'original/native.js',
    totalQuestions: 24, newMetadataApprovals: 0, preservedMetadataApprovals: 24,
    approval: { type: 'META_PIPELINE_AUDIT', sourceRebind: { schemaVersion: 'archive-native-audit-preservation-v1' } },
    auditPreservation: { requestSnapshot: { schemaVersion: NATIVE_REQUEST_SCHEMA,
      requestId: path.posix.basename(AUDIT_PRIOR_RECEIPT, '.json'), sourceArchiveFile: 'original/native.js',
      expectedQuestionCount: 24, approval: { type: 'META_PIPELINE_AUDIT' },
      items: Array.from({ length: 24 }, (_, i) => ({ questionUid: 'historical-' + (i + 1), sourceOrdinal: i + 1 })) } },
  }));
  write(DIFFICULTY_EVIDENCE, json({ schemaVersion: 'archive-difficulty5-reviewed-correction-v1', rows: [] }));
  write(META, json({ records: [{ questionUid: 'fixture', before: true }] }));
  write(IDENTITY, json({ records: [{ questionUid: 'fixture', sourceFingerprint: 'old' }] }));
  write(BASIC_LINKS, json({ records: [] }));
  write(AUTHORITY, json({ version: 'before' }));
  if (otherOwner) write(OTHER, json({ schemaVersion: 'standalone-course-fixture', requestId: 'other-owner-course' }));
  write('archive/db.js', 'old projection\n');
  write('archive/data/archive2-catalog.json', json({ projection: 'old' }));
  const manifest = target => write('archive/data/archive2-canonical-input-manifest.json', json({
    schemaVersion: 'archive2-canonical-input-manifest-v1', files: [
      { path: 'data/archive2-catalog.json', sha256: sha(fs.readFileSync(path.join(target, 'archive/data/archive2-catalog.json'))) },
    ],
  }), target);
  manifest(root);
  git('add', '.'); git('commit', '-qm', 'fixed base including other owner inbox');
  const baseSha = git('rev-parse', 'HEAD');
  const evidenceRef = { path: EVIDENCE, sha256: sha(fs.readFileSync(path.join(root, EVIDENCE))) };
  const difficultyRequest = { schemaVersion: DIFFICULTY_REQUEST_SCHEMA,
    gemini: { schemaVersion: 'v1', requestId: 'own-reviewed-difficulty', sourceArchiveFile: 'original/native.js',
      latestBlobSha: git('rev-parse', `HEAD:${SOURCE}`), items: [{ questionUid: 'fixture', ordinal: partial ? 5 : 1,
        before: { level: '중' }, after: { difficultyBucket: 2, difficultyConfidence: 'high', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL' } }] },
    reviewedCorrection: { schemaVersion: 'archive-difficulty5-reviewed-correction-v1', approvalRef: 'fixed reviewed fixture',
      evidencePath: DIFFICULTY_EVIDENCE, evidenceSha256: sha(fs.readFileSync(path.join(root, DIFFICULTY_EVIDENCE))), rows: [] } };
  if (auditPreservation && partial) {
    const first = difficultyRequest.gemini.items[0];
    difficultyRequest.gemini.items = Array.from({ length: 24 }, (_, i) => ({ ...copy(first), ordinal: i + 1,
      questionUid: i + 1 === first.ordinal ? first.questionUid : 'whole-source-' + (i + 1) }));
  }
  const request = difficultyOnly ? difficultyRequest : { schemaVersion: NATIVE_REQUEST_SCHEMA, requestId: 'own-reviewed-exam',
    sourceArchiveFile: 'original/native.js', expectedSourceBlobSha1: git('rev-parse', `HEAD:${SOURCE}`),
    expectedQuestionCount: partial ? 24 : 1, ...(partial ? {scope:'PARTIAL_UIDS'} : {}),
    ...(identityOnly ? {registrationMode:'IDENTITY_FINGERPRINT_ONLY'} : {}),
    approval: { type: directType ? 'DIRECT_JUDGMENT' : 'FINAL_QA', evidenceRefs: [evidenceRef] },
    ...(directType ? { fieldScope: 'TYPE_ONLY' } : {}),
    registryChanges: [], items: [{ questionUid: 'fixture', sourceOrdinal: partial ? 5 : 1, evidenceRefs: [evidenceRef] }],
  };
  if (auditPreservation) {
    request.approval.type = 'META_PIPELINE_AUDIT';
    request.approval.sourceRebind = { schemaVersion: 'archive-native-audit-preservation-v1', requestPath: REQUEST,
      difficultyRequestRef: { path: DIFFICULTY_REQUEST, sha256: sha(json(difficultyRequest)) } };
  }
  if (finalQaPreservation) {
    Object.assign(request.approval, { metadataReviewed: true, approvedBy: 'fixture existing approval preservation',
      sourceRebind: { priorReceiptRef: evidenceRef } });
    Object.assign(request.items[0], { before: {}, after: {} });
  }
  if (auditSourcePreservation) {
    const priorReceiptRef = { path: AUDIT_PRIOR_RECEIPT, sha256: sha(fs.readFileSync(path.join(root, AUDIT_PRIOR_RECEIPT))) };
    Object.assign(request.approval, { type: 'META_PIPELINE_AUDIT', metadataReviewed: true,
      approvedBy: 'fixture existing FULL audit subset preservation', evidenceRefs: [priorReceiptRef],
      sourceRebind: { schemaVersion: 'archive-native-audit-source-preservation-v1', requestPath: REQUEST,
        priorCommit: baseSha, priorReceiptRef } });
    Object.assign(request.items[0], { before: {}, after: {}, reason: 'unchanged subset; no new approval', evidenceRefs: [priorReceiptRef] });
  }
  if (basicPreservation) {
    request.schemaVersion = 'archive-basic-scope-rebind-request-v1'; delete request.scope; delete request.registryChanges;
    request.approval.type = 'BASIC_SCOPE_REBIND'; request.approval.sourceReview = { schemaVersion: 'archive-basic-scope-current-source-preservation-v1' };
    request.items[0].after = { sourceFingerprint: 'a'.repeat(64), contentFingerprint: 'b'.repeat(64) };
    difficultyRequest.reviewedCorrection.rows = [{ questionUid: 'fixture', ordinal: partial ? 5 : 1, before: request.items[0].after }];
  }
  mutateRequest?.(request);
  write(REQUEST, json(request));
  if (pairedDifficulty) write(DIFFICULTY_REQUEST, json(difficultyRequest));
  git('add', '--', REQUEST, ...(pairedDifficulty ? [DIFFICULTY_REQUEST] : [])); git('commit', '-qm', 'own request only');
  const headSha = git('rev-parse', 'HEAD'), repo = 'owner/repository';
  const event = { number: 17, repository: { id: 101, full_name: repo }, pull_request: {
    number: 17, base: { sha: baseSha, repo: { id: 101 } }, head: { sha: headSha, repo: { id: 101 } },
  } };
  const calls = [], hook = {};
  const run = (program, args, target = root) => {
    calls.push({ program, args, root: target });
    if (program === 'git') {
      const r = spawnSync(program, args, { cwd: target, encoding: 'utf8' });
      if (r.status !== 0) throw Error(`FIXTURE_GIT:${r.stderr}`); return r.stdout;
    }
    if (args[0].replaceAll('\\','/').endsWith('/register-reviewed-exam-meta-source.mjs')) {
      const requestPath = args[args.indexOf('--request') + 1];
      assert.equal(requestPath, REQUEST, 'an unchanged other-owner inbox must not run');
      const req = JSON.parse(fs.readFileSync(path.join(target, requestPath), 'utf8'));
      const replay = fs.existsSync(path.join(target, RECEIPT));
      const phase = args.includes('--verify-projection') ? 'projection' : args.includes('--write') ? 'write' : 'dry-run';
      hook[phase]?.(target);
      if (phase === 'projection' && !replay) throw Error('FIXTURE_RECEIPT_REQUIRED');
      const identityRepair=req.registrationMode==='IDENTITY_FINGERPRINT_ONLY';
      const basic=['archive-basic-scope-current-source-preservation-v1','archive-basic-native-source-hold-preservation-v1','archive-reviewed-native-basic-parent-v1']
        .includes(req.approval.sourceReview?.schemaVersion);
      const newBasic=req.approval.sourceReview?.schemaVersion==='archive-reviewed-native-basic-parent-v1';
      const direct = req.approval?.type === 'DIRECT_JUDGMENT';
      const result = { status: 'PASS', requestId: req.requestId, totalQuestions: req.items.length, replay,
        ...(direct ? { fieldScope: 'TYPE_ONLY', typeApprovals: req.items.length, newMetadataApprovals: 0 } : {}),
        ...(req.scope==='PARTIAL_UIDS'?{scope:req.scope,partialUidCount:req.items.length,expectedQuestionCount:req.expectedQuestionCount}:{}),
        ...(identityRepair?{registrationMode:req.registrationMode,metadataChanged:false,newMetadataApprovals:0,
          ...(phase==='projection'?{consumerLanes:{identityBindings:req.items.length,newMetadataApprovals:0}}:{})}:{}),
        ...(req.approval.sourceRebind?{newMetadataApprovals:0,preservedMetadataApprovals:req.items.length}:{}),
        ...(basic?{newMetadataApprovals:newBasic?req.items.length:0,preservedMetadataApprovals:newBasic?0:req.items.length,advancedApprovals:0,metadataValuesChanged:false,expectedQuestionCount:req.expectedQuestionCount,
          ...(newBasic?{newBasicParentApprovals:req.items.length,newDifficultyJudgments:0,newBlindReviews:0,newReview2:0}:{})}:{}),
        plannedPaths: replay ? [] : identityRepair ? [IDENTITY, RECEIPT].sort() : basic ? [META,IDENTITY,BASIC_LINKS,RECEIPT].sort() : PLANNED,
        consumerSearchStatus: phase === 'projection' ? identityRepair ? 'IDENTITY_BINDINGS_VERIFIED' : direct ? 'TYPE_FIELDS_VERIFIED' : 'STATIC_VALUES_VERIFIED' : 'NOT_RUN' };
      if (phase === 'write' && !replay) {
        if(identityRepair)write(IDENTITY,json({records:[{questionUid:'fixture',sourceFingerprint:'current'}]}),target);
        else {
          const metadata = auditPreservation || basic ? JSON.parse(fs.readFileSync(path.join(target, META), 'utf8'))
            : { records: [{ questionUid: 'fixture' }] };
          Object.assign(metadata.records[0], { after: true }); write(META, json(metadata), target);
          if (basic) { write(IDENTITY,json({records:[{questionUid:'fixture',sourceFingerprint:'current'}]}),target);write(BASIC_LINKS,json({records:[{questionUid:'fixture'}]}),target); }
          else write(AUTHORITY, json({ version: 'after' }), target);
        }
        write(RECEIPT, json({ requestSha256: sha(fs.readFileSync(path.join(target, REQUEST))), source: req.expectedSourceBlobSha1 }), target);
        hook.afterWrite?.(target);
      }
      return json(hook.result?.(phase, result, target) || result);
    }
    if (args[0].replaceAll('\\','/').endsWith('/register-difficulty5.mjs')) {
      const requestPath = args[args.indexOf('--request') + 1];
      assert.equal(requestPath, difficultyOnly ? REQUEST : DIFFICULTY_REQUEST);
      const req = JSON.parse(fs.readFileSync(path.join(target, requestPath), 'utf8'));
      const phase = args.includes('--verify-projection') ? 'projection' : args.includes('--write') ? 'write' : 'dry-run';
      hook.difficultyPhase?.(phase, target);
      const meta = JSON.parse(fs.readFileSync(path.join(target, META), 'utf8'));
      const replay = meta.records[0].difficultyBucket === 2, verify = phase === 'projection';
      if (verify && !replay) throw Error('FIXTURE_DIFFICULTY_NOT_APPLIED');
      const count = req.gemini.items.length, changedFields = !verify && !replay ? 4 * count : 0;
      const result = { status: 'PASS', mode: req.reviewedCorrection === undefined
        ? verify ? 'verify-projection' : phase === 'write' ? 'write' : 'dry-run'
        : verify ? 'verify-reviewed-correction' : phase === 'write' ? 'write-reviewed-correction' : 'dry-run-reviewed-correction',
        requestId: req.gemini.requestId, sourceArchiveFile: req.gemini.sourceArchiveFile, sourceBlobSha: req.gemini.latestBlobSha,
        items: req.gemini.items.map(item => ({ questionUid: item.questionUid, ordinal: item.ordinal })),
        summary: { total: count, APPLY: !verify && !replay ? count : 0, ALREADY_REGISTERED: !verify && replay ? count : 0,
          SKIP_INVALID: 0, CONFLICT: 0, VERIFIED: verify ? count : 0, changedFields, written: phase === 'write' && changedFields > 0 },
        ptTpl: 'UNTOUCHED_NOT_IN_SCOPE' };
      if (phase === 'write' && !replay) {
        Object.assign(meta.records[0], req.gemini.items[0].after); write(META, json(meta), target);
        hook.afterDifficultyWrite?.(target);
      }
      return json(hook.difficultyResult?.(phase, result, target) || result);
    }
    if (args[0].replaceAll('\\','/').endsWith('/verify-changed-uid-consumer-approval.mjs')) {
      hook.consumer?.(target);
      const files=[REQUEST,...(pairedDifficulty?[DIFFICULTY_REQUEST]:[])];
      const exams=files.map(file=>{const req=JSON.parse(fs.readFileSync(path.join(target,file),'utf8'));
        const identityRepair=req.registrationMode==='IDENTITY_FINGERPRINT_ONLY';
        const preservation=Boolean(req.approval?.sourceRebind);
        const count=(req.gemini?.items||req.items).length;
        const basic=Boolean(req.approval?.sourceReview);
        const newBasic=req.approval?.sourceReview?.schemaVersion==='archive-reviewed-native-basic-parent-v1';
        const direct=req.approval?.type==='DIRECT_JUDGMENT';
        return { file, kind: req.schemaVersion===DIFFICULTY_REQUEST_SCHEMA?'difficulty5-ratings':direct?'direct-type-judgment':identityRepair?'identity-fingerprint-repair':newBasic?'basic-parent-registration':basic?'basic-approval-preservation':preservation?'native-approval-preservation':'reviewed-exam-v2',
          exam:req.gemini?.requestId||req.examUid||req.sourceArchiveFile,
          sourceFile:'original/native.js',changed:count,checked:count,passed:count,skippedUnchanged:0,
          ...(direct?{approvalCreated:false,newMetadataApprovals:0,directTypeApprovals:count,typeNotDisplayed:0,expectedQuestionCount:req.expectedQuestionCount}:{}),
          ...(identityRepair?{approvalCreated:false,newMetadataApprovals:0,identityBindings:1}:{}),
          ...(preservation?{approvalCreated:false,newMetadataApprovals:0,preservedMetadataApprovals:1,
            approvalType:req.approval.type,expectedQuestionCount:req.expectedQuestionCount}:{}),
          ...(basic?{approvalCreated:newBasic,newMetadataApprovals:newBasic?count:0,advancedApprovals:0,preservedMetadataApprovals:newBasic?0:1,expectedQuestionCount:req.expectedQuestionCount,
            ...(newBasic?{newBasicParentApprovals:count,newDifficultyJudgments:0,newBlindReviews:0,newReview2:0}:{})}:{}) };});
      const total=exams.reduce((n,e)=>n+e.changed,0);
      return json(hook.consumerResult || { status: 'PASS', counts: { changed: total, checked: total, passed: total, skippedUnchanged: 0 },
        exams,
        failures: [], unobservedFields: [], assignmentPending: hook.assignmentPending || [] });
    }
    if (program === 'python3') {
      write('archive/db.js', 'new projection\n', target);
      write('archive/data/archive2-catalog.json', json({ projection: 'new' }), target); manifest(target);
    }
    return '';
  };
  const options = { root, repo, event, expectedSha: headSha, runId: 41, runAttempt: 1, run };
  const selected = () => selectNativeRequests({ root, baseSha, headSha });
  const produce = () => producePrRegistrationProof(options);
  const validate = proof => validateLocalRegistrationProof({ ...options, proof });
  const native = preview => validateNativePreview({ root, baseSha, headSha, preview, run, allowedGenerated: ALLOWED });
  const snapshot = () => {
    const records = [];
    const walk = dir => { for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name === '.git') continue;
      const full = path.join(dir, item.name);
      if (item.isDirectory()) walk(full); else records.push([path.relative(root, full), sha(fs.readFileSync(full))]);
    } };
    walk(root); return { status: git('status', '--porcelain', '--untracked-files=all'), files: records.sort() };
  };
  const assertShadowsRemoved = () => { for (const call of calls) if (call.root !== root) assert.equal(fs.existsSync(call.root), false, call.root); };
  return { root, write, git, baseSha, headSha, request, selected, produce, validate, native, snapshot,
    assertShadowsRemoved, calls, hook, run };
}

const BINDING_KEY = { curriculum: '2015', standardCourse: '중2 수학', standardUnitKey: 'M2-06',
  subUnitKey: 'M2-06-PARALLEL_LENGTH_RATIO', problemTypeKey: 'PT_QUADRILATERAL_PROPERTIES' };
const BINDING_PROVIDER = '.archive-meta-register/inbox/zz-binding-provider.json';
function bindingDependencyFixture(t, { mutateProvider, unchangedProvider = false } = {}) {
  const f = fixture(t, { partial: true, otherOwner: false,
    mutateRequest: r => { r.items[0].after = copy(BINDING_KEY); } });
  const provider = copy(f.request);
  provider.requestId = 'zz-binding-provider';
  provider.items[0].questionUid = 'provider-uid'; provider.items[0].sourceOrdinal = 6;
  provider.registryChanges = [{ path: 'archive/data/meta-foundation/canonical/packs/middle2/bindings.json',
    collection: 'bindings', match: copy(BINDING_KEY), before: null,
    after: { ...copy(BINDING_KEY), status: 'ACTIVE', ownerPack: 'MIDDLE2' },
    evidenceRefs: copy(provider.approval.evidenceRefs) }];
  mutateProvider?.(provider);
  f.write(BINDING_PROVIDER, json(provider));
  f.git('add', BINDING_PROVIDER); f.git('commit', '-qm', 'selected add-only binding provider');
  const baseSha = unchangedProvider ? f.git('rev-parse', 'HEAD') : f.baseSha;
  if (unchangedProvider) {
    f.request.items[0].after.level = '중'; f.write(REQUEST, json(f.request));
    f.git('add', REQUEST); f.git('commit', '-qm', 'consumer only');
  }
  return { ...f, provider, baseSha, headSha: f.git('rev-parse', 'HEAD'),
    select: () => selectNativeRequests({ root: f.root, baseSha, headSha: f.git('rev-parse', 'HEAD') }) };
}

test('selected add-only binding provider precedes its exact consumer in PR and main previews', t => {
  const f = bindingDependencyFixture(t), pr = f.select();
  assert.deepEqual(pr.map(r => r.path), [BINDING_PROVIDER, REQUEST]);
  assert.deepEqual(selectPendingNativeRequests({ root: f.root, headSha: f.headSha }).map(r => r.path),
    [BINDING_PROVIDER, REQUEST]);
  assert.deepEqual(orderNativeRequests([...pr].reverse()).map(r => r.path), [BINDING_PROVIDER, REQUEST]);
  assert.equal(pr[0].registryDependency.provides.length, 1);
  assert.deepEqual(pr[1].registryDependency.requires[0].key, BINDING_KEY);
});

for (const field of Object.keys(BINDING_KEY)) test(`binding dependency does not cross a different ${field}`, t => {
  const mutateProvider = r => {
    r.registryChanges[0].match[field] += '-other'; r.registryChanges[0].after[field] += '-other';
  };
  const f = bindingDependencyFixture(t, { mutateProvider });
  assert.deepEqual(f.select().map(r => r.path), [REQUEST, BINDING_PROVIDER]);
  const inherited = bindingDependencyFixture(t, { mutateProvider, unchangedProvider: true });
  assert.deepEqual(inherited.select().map(r => r.path), [REQUEST]);
});

for (const [name, mutateProvider] of [
  ['replacement', r => { r.registryChanges[0].before = { previous: true }; }],
  ['inactive row', r => { r.registryChanges[0].after.status = 'REVIEW_REQUIRED'; }],
  ['another collection', r => { r.registryChanges[0].collection = 'problemTypes'; }],
  ['noncanonical path', r => { r.registryChanges[0].path = 'archive/data/meta-foundation/compiled/bindings.json'; }],
  ['mismatched exact match', r => { r.registryChanges[0].match.subUnitKey += '-other'; }],
]) test(`binding dependency leaves ${name} to the unchanged registrar guards`, t => {
  const f = bindingDependencyFixture(t, { mutateProvider });
  assert.deepEqual(f.select().map(r => r.path), [REQUEST, BINDING_PROVIDER]);
  const inherited = bindingDependencyFixture(t, { mutateProvider, unchangedProvider: true });
  assert.deepEqual(inherited.select().map(r => r.path), [REQUEST]);
});

test('binding dependency selects only its exact unchanged HEAD provider before the changed consumer', t => {
  const f = bindingDependencyFixture(t, { unchangedProvider: true });
  const selected = f.select();
  assert.deepEqual(selected.map(r => r.path), [BINDING_PROVIDER, REQUEST]);
  assert.deepEqual(selected[0].inheritedBindingProvider, {
    baseSha: f.baseSha, requestSha256: sha(json(f.provider)),
    requiredBy: [{ requestPath: REQUEST, questionUid: 'fixture', sourceOrdinal: 5, key: BINDING_KEY }],
  });
  assert.equal(selected[1].inheritedBindingProvider, undefined);
  assert.equal(f.calls.length, 0, 'selection itself never executes a registrar');
});

function changeOnlyBindingConsumer(f) {
  const baseSha = f.git('rev-parse', 'HEAD');
  f.request.items[0].reason = `changed consumer input after ${baseSha}`;
  f.write(REQUEST, json(f.request)); f.git('add', REQUEST); f.git('commit', '-qm', 'consumer input only');
  const headSha = f.git('rev-parse', 'HEAD');
  return { root: f.root, baseSha, headSha };
}

test('binding provider closure follows transitive exact dependencies and rejects their cycle', t => {
  const f = bindingDependencyFixture(t);
  const secondKey = { ...BINDING_KEY, problemTypeKey: 'PT_SECOND' };
  const secondPath = '.archive-meta-register/inbox/zzz-second-provider.json';
  f.provider.items[0].after = copy(secondKey);
  const second = copy(f.provider); second.requestId = 'second-provider';
  second.items[0].questionUid = 'second-uid'; second.items[0].sourceOrdinal = 7;
  second.registryChanges[0].match = copy(secondKey);
  second.registryChanges[0].after = { ...copy(secondKey), status: 'ACTIVE', ownerPack: 'MIDDLE2' };
  f.write(BINDING_PROVIDER, json(f.provider)); f.write(secondPath, json(second));
  f.git('add', BINDING_PROVIDER, secondPath); f.git('commit', '-qm', 'pending transitive provider');
  let input = changeOnlyBindingConsumer(f), selected = selectNativeRequests(input);
  assert.deepEqual(selected.map(r => r.path), [secondPath, BINDING_PROVIDER, REQUEST]);
  assert.equal(selected[0].inheritedBindingProvider.requiredBy[0].requestPath, BINDING_PROVIDER);
  assert.equal(selected[1].inheritedBindingProvider.requiredBy[0].requestPath, REQUEST);
  second.items[0].after = copy(BINDING_KEY); f.write(secondPath, json(second));
  f.git('add', secondPath); f.git('commit', '-qm', 'cyclic pending provider');
  f.request.items[0].reason = 'next consumer revision';
  input = changeOnlyBindingConsumer(f);
  assert.throws(() => selectNativeRequests(input), /REGISTRY_DEPENDENCY_CYCLE/);
});

test('binding provider closure rejects two exact providers even if only its consumer changed', t => {
  const f = bindingDependencyFixture(t), duplicate = copy(f.provider);
  duplicate.requestId = 'duplicate-provider'; duplicate.items[0].questionUid = 'duplicate-uid';
  const file = '.archive-meta-register/inbox/duplicate-provider.json';
  f.write(file, json(duplicate)); f.git('add', file); f.git('commit', '-qm', 'second pending exact provider');
  assert.throws(() => selectNativeRequests(changeOnlyBindingConsumer(f)), /REGISTRY_DEPENDENCY_AMBIGUOUS/);
  assert.equal(f.calls.length, 0);
});

test('binding provider closure excludes unrelated providers, including an unrelated ambiguous key', t => {
  const f = bindingDependencyFixture(t);
  for (const name of ['unrelated-a', 'unrelated-b']) {
    const req = copy(f.provider); req.requestId = name; req.items[0].questionUid = name;
    for (const value of [req.registryChanges[0].match, req.registryChanges[0].after]) value.subUnitKey += '-unrelated';
    const file = `.archive-meta-register/inbox/${name}.json`;
    f.write(file, json(req)); f.git('add', file);
  }
  f.git('commit', '-qm', 'unrelated pending inputs');
  const input = changeOnlyBindingConsumer(f);
  assert.deepEqual(selectNativeRequests(input).map(r => r.path), [BINDING_PROVIDER, REQUEST]);
});

test('binding provider closure uses Git dispatch and rejects selected working-copy drift', t => {
  const f = bindingDependencyFixture(t, { unchangedProvider: true });
  f.write(BINDING_PROVIDER, json({ ...f.provider, requestId: 'forged' }));
  assert.throws(f.select, /REQUEST_NOT_FIXED/);
  const foreign = bindingDependencyFixture(t, { unchangedProvider: true, mutateProvider: r => {
    r.registryChanges[0].match.curriculum = '2022'; r.registryChanges[0].after.curriculum = '2022';
  } });
  const forged = copy(foreign.provider);
  forged.registryChanges[0].match = copy(BINDING_KEY);
  Object.assign(forged.registryChanges[0].after, BINDING_KEY);
  foreign.write(BINDING_PROVIDER, json(forged));
  foreign.write('.archive-meta-register/inbox/untracked-provider.json', json(forged));
  assert.deepEqual(foreign.select().map(r => r.path), [REQUEST]);
});

test('binding provider closure cannot use a deleted or nested provider and retains source/evidence gates', t => {
  const deleted = bindingDependencyFixture(t, { unchangedProvider: true });
  deleted.git('rm', BINDING_PROVIDER); deleted.git('commit', '-qm', 'deleted pending provider');
  assert.deepEqual(deleted.select().map(r => r.path), [REQUEST]);
  const nested = bindingDependencyFixture(t, { unchangedProvider: true });
  nested.write('.archive-meta-register/inbox/nested/provider.json', json(nested.provider));
  nested.git('rm', BINDING_PROVIDER); nested.git('add', '.archive-meta-register/inbox/nested/provider.json');
  nested.git('commit', '-qm', 'foreign nested provider');
  assert.deepEqual(nested.select().map(r => r.path), [REQUEST]);
  const drift = bindingDependencyFixture(t, { unchangedProvider: true });
  drift.write(EVIDENCE, json({ altered: true }));
  assert.throws(drift.select, /EVIDENCE_DRIFT/);
  drift.write(EVIDENCE, drift.git('show', `HEAD:${EVIDENCE}`) + '\n');
  drift.write(SOURCE, fs.readFileSync(path.join(drift.root, SOURCE), 'utf8') + '\n');
  drift.git('add', SOURCE); drift.git('commit', '-qm', 'unreviewed source bytes');
  assert.throws(drift.select, /SOURCE_NOT_FIXED/);
});

// Model an actual registrar dependency, rather than just testing array order:
// the consumer refuses until the canonical row has been officially written.
function bindingProofRunner(f) {
  const bindingPath = f.provider.registryChanges[0].path;
  const files = [BINDING_PROVIDER, REQUEST], read = (target, file) => JSON.parse(fs.readFileSync(path.join(target, file), 'utf8'));
  const writes = [];
  const run = (program, args, target = f.root) => {
    if (args[0]?.endsWith('/register-reviewed-exam-meta-source.mjs')) {
      const file = args[args.indexOf('--request') + 1]; assert.ok(files.includes(file));
      const request = read(target, file), receiptPath = `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${request.requestId}.json`;
      const replay = fs.existsSync(path.join(target, receiptPath));
      const phase = args.includes('--verify-projection') ? 'projection' : args.includes('--write') ? 'write' : 'dry';
      if (file === REQUEST || phase === 'projection') {
        if (!fs.existsSync(path.join(target, bindingPath))) throw Error('ACTIVE_BINDING_MISSING');
        assert.deepEqual(read(target, bindingPath), f.provider.registryChanges[0].after);
      }
      const plannedPaths = replay ? [] : [META, receiptPath, ...(file === BINDING_PROVIDER ? [bindingPath] : [])].sort();
      if (phase === 'projection') assert.equal(replay, true);
      if (phase === 'write' && !replay) {
        if (file === BINDING_PROVIDER) f.write(bindingPath, json(request.registryChanges[0].after), target);
        const metadata = read(target, META), item = request.items[0];
        metadata.records = metadata.records.filter(r => r.questionUid !== item.questionUid);
        metadata.records.push({ questionUid: item.questionUid, ...item.after });
        metadata.records.sort((a, b) => a.questionUid.localeCompare(b.questionUid, 'en'));
        f.write(META, json(metadata), target);
        f.write(receiptPath, json({ requestSha256: sha(fs.readFileSync(path.join(target, file))) }), target);
        writes.push({ target, file });
      }
      return json({ status: 'PASS', requestId: request.requestId, totalQuestions: 1, replay,
        scope: 'PARTIAL_UIDS', partialUidCount: 1, expectedQuestionCount: 24, plannedPaths,
        consumerSearchStatus: phase === 'projection' ? 'STATIC_VALUES_VERIFIED' : 'NOT_RUN' });
    }
    if (args[0]?.endsWith('/verify-changed-uid-consumer-approval.mjs')) {
      const requested = args.flatMap((value, i) => value === '--request' ? [args[i + 1]] : []);
      assert.deepEqual(requested, files);
      const exams = requested.map(file => {
        const request = read(target, file), row = read(target, META).records.find(r => r.questionUid === request.items[0].questionUid);
        assert.deepEqual(row, { questionUid: request.items[0].questionUid, ...request.items[0].after });
        return { file, kind: 'reviewed-exam-v2', sourceFile: request.sourceArchiveFile,
          changed: 1, checked: 1, passed: 1, skippedUnchanged: 0 };
      });
      return json({ status: 'PASS', counts: { changed: 2, checked: 2, passed: 2, skippedUnchanged: 0 },
        exams, failures: [], unobservedFields: [], assignmentPending: [] });
    }
    return f.run(program, args, target);
  };
  return { run, writes };
}

test('PR proof producer, preparation, Consumer and immutable replay all include the required unchanged provider', t => {
  const f = bindingDependencyFixture(t, { unchangedProvider: true }), runner = bindingProofRunner(f);
  const repo = 'owner/repository', options = { root: f.root, repo, expectedSha: f.headSha, runId: 41, runAttempt: 1,
    event: { number: 17, repository: { id: 101, full_name: repo }, pull_request: {
      base: { sha: f.baseSha, repo: { id: 101 } }, head: { sha: f.headSha, repo: { id: 101 } } } }, run: runner.run };
  const before = fs.readFileSync(path.join(f.root, BINDING_PROVIDER)), proof = producePrRegistrationProof(options);
  assert.equal(proof.status, 'PASS');
  assert.deepEqual(proof.nativePreview.requests.map(r => [r.path, r.questionCount, r.sourceQuestionCount]),
    [[BINDING_PROVIDER, 1, 24], [REQUEST, 1, 24]]);
  assert.deepEqual(proof.nativePreview.plans.map(r => r.requestPath), [BINDING_PROVIDER, REQUEST]);
  assert.deepEqual(runner.writes.filter(r => r.target === f.root).map(r => r.file), [BINDING_PROVIDER, REQUEST]);
  const snapshot = f.snapshot();
  assert.equal(validateLocalRegistrationProof({ ...options, proof }).reusable, true);
  assert.deepEqual(f.snapshot(), snapshot);
  assert.deepEqual(fs.readFileSync(path.join(f.root, BINDING_PROVIDER)), before);
  const shadowTargets = [...new Set(runner.writes.filter(r => r.target !== f.root).map(r => r.target))];
  assert.ok(shadowTargets.length > 0);
  for (const target of shadowTargets) assert.equal(fs.existsSync(target), false);
  const forged = copy(proof); forged.nativePreview.requests.shift();
  assert.throws(() => validateLocalRegistrationProof({ ...options, proof: forged }), /INPUT_MANIFEST_MISMATCH/);
});

test('missing or refused exact providers cannot be replaced by a foreign key or execute the consumer', t => {
  const missing = bindingDependencyFixture(t, { unchangedProvider: true, mutateProvider: r => {
    r.registryChanges[0].match.curriculum = '2022'; r.registryChanges[0].after.curriculum = '2022';
  } }), runner = bindingProofRunner(missing);
  assert.throws(() => applyNativeRequests({ root: missing.root, requests: missing.select(), run: runner.run }), /ACTIVE_BINDING_MISSING/);
  assert.deepEqual(runner.writes, []);
  const refused = bindingDependencyFixture(t, { unchangedProvider: true }), calls = [];
  assert.throws(() => applyNativeRequests({ root: refused.root, requests: refused.select(), run: (_program, args) => {
    calls.push(args[args.indexOf('--request') + 1]); throw Error('PROVIDER_OFFICIAL_REFUSAL');
  } }), /PROVIDER_OFFICIAL_REFUSAL/);
  assert.deepEqual(calls, [BINDING_PROVIDER]);
});

test('binding dependency does not infer missing after keys from before or source', t => {
  const f = bindingDependencyFixture(t); f.request.items[0].before = copy(BINDING_KEY);
  delete f.request.items[0].after.subUnitKey; f.write(REQUEST, json(f.request));
  f.git('add', REQUEST); f.git('commit', '-qm', 'incomplete consumer stays registrar-owned');
  assert.deepEqual(f.select().map(r => r.path), [REQUEST, BINDING_PROVIDER]);
});

test('binding dependency rejects duplicate providers and cycles while allowing self-provided keys', t => {
  const f = bindingDependencyFixture(t), selected = f.select(), provider = selected.find(r => r.path === BINDING_PROVIDER);
  assert.deepEqual(orderNativeRequests([provider]).map(r => r.path), [BINDING_PROVIDER]);
  const duplicate = copy(provider); duplicate.path = '.archive-meta-register/inbox/duplicate-provider.json';
  assert.throws(() => orderNativeRequests([...selected, duplicate]), /REGISTRY_DEPENDENCY_AMBIGUOUS/);
  const consumer = selected.find(r => r.path === REQUEST), cyclicProvider = copy(provider), cyclicConsumer = copy(consumer);
  const secondKey = { ...BINDING_KEY, problemTypeKey: 'PT_SECOND' };
  cyclicConsumer.registryDependency.provides = [{ path: provider.registryDependency.provides[0].path, key: secondKey }];
  cyclicProvider.registryDependency.requires.push({ questionUid: 'provider-uid', sourceOrdinal: 6, key: secondKey });
  assert.throws(() => orderNativeRequests([cyclicConsumer, cyclicProvider]), /REGISTRY_DEPENDENCY_CYCLE/);
});

test('inbox-only PR selects its fixed v2 request and leaves unchanged course inbox untouched', t => {
  const f = fixture(t), beforeHead = f.git('rev-parse', 'HEAD');
  assert.equal(prRegistrationProofNeeded([REQUEST]), true);
  assert.deepEqual(f.selected().map(r => r.path), [REQUEST]);
  const other = fs.readFileSync(path.join(f.root, OTHER)), proof = f.produce();
  assert.equal(proof.status, 'PASS');
  assert.deepEqual(proof.nativePreview.plans[0].plannedPaths, PLANNED);
  assert.deepEqual(proof.nativePreview.checks.map(c => c.id), ['native-projection', 'native-consumer']);
  assert.deepEqual(fs.readFileSync(path.join(f.root, OTHER)), other);
  assert.equal(fs.existsSync(path.join(f.root, REQUEST)), true, 'preview never consumes its inbox');
  assert.equal(f.git('rev-parse', 'HEAD'), beforeHead);
  const before = f.snapshot();
  assert.equal(f.validate(proof).reusable, true);
  assert.deepEqual(f.snapshot(), before, 'successful local reuse is read-only');
  f.assertShadowsRemoved();
  const actualWrites = f.calls.filter(c => c.root === f.root && c.args.includes('--write') && c.args[0].replaceAll('\\','/').endsWith('/register-reviewed-exam-meta-source.mjs'));
  assert.equal(actualWrites.length, 1, 'verify-local writes only its isolated shadow');
});

test('basic preservation keeps its full source denominator and requires exact rebind before paired difficulty', t => {
  const f = fixture(t, { basicPreservation: true, partial: true, pairedDifficulty: true });
  const selected = f.selected(), basic = selected.find(r => r.kind === 'basic-approval-preservation'), difficulty = selected.find(r => r.kind === 'difficulty5-ratings');
  assert.equal(basic.questionCount, 1); assert.equal(basic.sourceQuestionCount, 24);
  assert.deepEqual(orderNativeRequests([difficulty,basic]).map(r => r.path),[REQUEST,DIFFICULTY_REQUEST]);
  const proof = f.produce();
  const consumer = proof.nativePreview.checks.find(c => c.id === 'native-consumer');
  assert.deepEqual(consumer.preservedBasicApprovals,{requests:1,preservedMetadataApprovals:1,newMetadataApprovals:0,advancedApprovals:0});
  assert.equal(f.validate(proof).reusable,true);
});

test('basic preservation dependency refuses stale before fingerprints, changed source and ambiguous ownership', t => {
  const f=fixture(t,{basicPreservation:true,pairedDifficulty:true}),selected=f.selected();
  const basic=selected.find(r=>r.kind==='basic-approval-preservation'),difficulty=selected.find(r=>r.kind==='difficulty5-ratings');
  const bad=copy(difficulty);bad.difficultyBeforeBindings[0].sourceFingerprint='0'.repeat(64);
  assert.throws(()=>orderNativeRequests([bad,basic]),/BASIC_DEPENDENCY_FINGERPRINT/);
  const missing=copy(difficulty);missing.difficultyBeforeBindings=[];
  assert.throws(()=>orderNativeRequests([missing,basic]),/BASIC_DEPENDENCY_FINGERPRINT/);
  const source=copy(difficulty);source.source.sha256='0'.repeat(64);
  assert.throws(()=>orderNativeRequests([source,basic]),/BASIC_DEPENDENCY_SOURCE/);
  const duplicate=copy(basic);duplicate.path=OTHER;
  assert.throws(()=>orderNativeRequests([basic,duplicate,difficulty]),/BASIC_DEPENDENCY_AMBIGUOUS/);
});

test('basic preservation proof rejects new approvals, missing preserved counts, foreign outputs and informational assignment debt', t => {
  for(const field of ['newMetadataApprovals','advancedApprovals','preservedMetadataApprovals','expectedQuestionCount']) {
    const f=fixture(t,{basicPreservation:true});
    f.hook.result=(phase,result)=>({...result,[field]:field==='preservedMetadataApprovals'?0:99});
    assert.throws(()=>f.produce(),/DRY_RUN_NOT_PASS/);
  }
  const bad=fixture(t,{basicPreservation:true});
  bad.hook.result=(phase,result)=>({...result,plannedPaths:phase==='dry-run'?[...result.plannedPaths,AUTHORITY]:result.plannedPaths});
  assert.throws(()=>bad.produce(),/BASIC_PRESERVATION_OUTPUT_SCOPE/);
  const pending=fixture(t,{basicPreservation:true,pairedDifficulty:true});
  pending.hook.assignmentPending=[{exam:'own-reviewed-difficulty',qid:1,uid:'fixture',reason:'assignment_missing'}];
  assert.throws(()=>pending.produce(),/CONSUMER_NOT_PASS/);
});

const nativeBasicHold = request => {
  request.approval.sourceReview.schemaVersion = 'archive-basic-native-source-hold-preservation-v1';
};

test('native basic hold retains its named schema and actual selected/full counts through the complete preview', t => {
  const f=fixture(t,{basicPreservation:true,partial:true,pairedDifficulty:true,mutateRequest:nativeBasicHold});
  const selected=f.selected(),basic=selected.find(r=>r.kind==='basic-approval-preservation');
  assert.equal(basic.basicPreservation.schemaVersion,'archive-basic-native-source-hold-preservation-v1');
  assert.equal(basic.questionCount,1);assert.equal(basic.sourceQuestionCount,24);
  assert.deepEqual(selected.map(r=>r.path),[REQUEST,DIFFICULTY_REQUEST]);
  const proof=f.produce();assert.equal(proof.status,'PASS');
  const consumer=proof.nativePreview.checks.find(c=>c.id==='native-consumer');
  assert.deepEqual(consumer.preservedBasicApprovals,{requests:1,preservedMetadataApprovals:1,newMetadataApprovals:0,advancedApprovals:0});
  assert.equal(f.validate(proof).reusable,true);f.assertShadowsRemoved();
});

test('native basic hold preview rejects unknown schemas, wrong approval type and scope mixing', t => {
  for(const mutate of [
    r=>{r.approval.sourceReview.schemaVersion+='-unknown';},
    r=>{r.approval.type='FINAL_QA';},
    r=>{r.scope='PARTIAL_UIDS';},
    r=>{r.registrationMode='IDENTITY_FINGERPRINT_ONLY';},
  ]) {
    const f=fixture(t,{basicPreservation:true,mutateRequest:r=>{nativeBasicHold(r);mutate(r);}});
    assert.throws(()=>f.selected(),/BASIC_PRESERVATION_SCOPE/);
  }
});

test('native basic hold preview still requires official preserved counts, zero new approval and strict Consumer evidence', t => {
  for(const field of ['newMetadataApprovals','advancedApprovals','preservedMetadataApprovals','expectedQuestionCount']) {
    const f=fixture(t,{basicPreservation:true,mutateRequest:nativeBasicHold});
    f.hook.result=(phase,result)=>({...result,[field]:field==='preservedMetadataApprovals'?0:99});
    assert.throws(()=>f.produce(),/DRY_RUN_NOT_PASS/);
  }
  const pending=fixture(t,{basicPreservation:true,pairedDifficulty:true,mutateRequest:nativeBasicHold});
  pending.hook.assignmentPending=[{exam:'own-reviewed-difficulty',qid:1,uid:'fixture',reason:'assignment_missing'}];
  assert.throws(()=>pending.produce(),/CONSUMER_NOT_PASS/);
});

test('partial preview binds one selected UID separately from its 24-question fixed source',t=>{
  const f=fixture(t,{partial:true}),selected=f.selected();
  assert.equal(selected[0].questionCount,1);assert.equal(selected[0].sourceQuestionCount,24);
  assert.equal(selected[0].scope,'PARTIAL_UIDS');
  assert.deepEqual(selected[0].selectedItems,[{questionUid:'fixture',sourceOrdinal:5}]);
  const proof=f.produce(),before=f.snapshot();
  assert.equal(proof.status,'PASS');assert.equal(f.validate(proof).reusable,true);
  assert.deepEqual(f.snapshot(),before);f.assertShadowsRemoved();
  const forged=copy(proof.nativePreview);forged.requests[0].selectedItems[0].questionUid='foreign';
  assert.throws(()=>f.native(forged),/INPUT_MANIFEST_MISMATCH/);
});

test('partial selection rejects malformed scope, duplicate UIDs/ordinals and a false source denominator',t=>{
  const cases=[
    [r=>{delete r.scope;},/QUESTION_COUNT/],
    [r=>{r.scope='OTHER';},/REQUEST_SCOPE/],
    [r=>{r.expectedQuestionCount=23;},/SOURCE_DENOMINATOR/],
    [r=>{r.items=[];},/QUESTION_COUNT/],
    [r=>{r.items[0].sourceOrdinal=25;},/SELECTED_UID_SCOPE/],
    [r=>{r.items[0].sourceOrdinal=1.5;},/SELECTED_UID_SCOPE/],
    [r=>{r.items.push({...r.items[0],sourceOrdinal:6});},/SELECTED_UID_SCOPE/],
    [r=>{r.items.push({...r.items[0],questionUid:'other'});},/SELECTED_UID_SCOPE/],
    [r=>{r.registrationMode='UNKNOWN';},/REGISTRATION_MODE/],
  ];
  for(const [mutateRequest,error] of cases) {
    const f=fixture(t,{partial:true,mutateRequest});assert.throws(()=>f.selected(),error);
  }
});

test('partial dry-run, write and projection each bind both denominators and the explicit scope',t=>{
  for(const phase of ['dry-run','write','projection'])for(const mutation of [
    r=>({...r,totalQuestions:24}),r=>({...r,partialUidCount:2}),r=>({...r,expectedQuestionCount:1}),r=>({...r,scope:undefined}),
  ]) {
    const f=fixture(t,{partial:true});f.hook.result=(p,result)=>p===phase?mutation(result):result;
    assert.throws(()=>f.produce(),phase==='dry-run'?/DRY_RUN_NOT_PASS/:phase==='write'?/WRITE_PLAN_MISMATCH/:/PROJECTION_NOT_VERIFIED/);
  }
});

test('partial Consumer counts cannot substitute the whole exam or omit the selected UID',t=>{
  for(const count of [0,24]) {
    const f=fixture(t,{partial:true}),counts={changed:count,checked:count,passed:count,skippedUnchanged:0};
    f.hook.consumerResult={status:'PASS',counts,exams:[{file:REQUEST,kind:'reviewed-exam-v2',sourceFile:'original/native.js',...counts}],
      failures:[],unobservedFields:[],assignmentPending:[]};
    assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);
  }
});

test('identity-only preview verifies exact bindings while preserving metadata and creating no approval',t=>{
  const f=fixture(t,{partial:true,identityOnly:true}),beforeMeta=fs.readFileSync(path.join(f.root,META));
  const proof=f.produce();assert.equal(proof.status,'PASS');
  assert.equal(proof.nativePreview.requests[0].kind,'identity-fingerprint-repair');
  assert.deepEqual(fs.readFileSync(path.join(f.root,META)),beforeMeta);
  assert.equal(f.validate(proof).reusable,true);f.assertShadowsRemoved();
});

test('identity-only preview rejects a semantic approval result, missing bindings or a mislabeled Consumer result',t=>{
  for(const mutate of [
    r=>({...r,consumerSearchStatus:'STATIC_VALUES_VERIFIED'}),r=>({...r,newMetadataApprovals:1}),
    r=>({...r,metadataChanged:true}),r=>({...r,consumerLanes:{identityBindings:24,newMetadataApprovals:0}}),
  ]) {
    const f=fixture(t,{partial:true,identityOnly:true});f.hook.result=(p,r)=>p==='projection'?mutate(r):r;
    assert.throws(()=>f.produce(),/PROJECTION_NOT_VERIFIED/);
  }
  for(const change of [{kind:'reviewed-exam-v2'},{newMetadataApprovals:1},{approvalCreated:true},{identityBindings:24}]) {
    const f=fixture(t,{partial:true,identityOnly:true});
    f.hook.consumerResult={status:'PASS',counts:{changed:1,checked:1,passed:1,skippedUnchanged:0},exams:[{
      file:REQUEST,kind:'identity-fingerprint-repair',sourceFile:'original/native.js',changed:1,checked:1,passed:1,skippedUnchanged:0,
      newMetadataApprovals:0,approvalCreated:false,identityBindings:1,...change}],failures:[],unobservedFields:[],assignmentPending:[]};
    assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);
  }
});

test('reviewed difficulty preview binds selected UIDs and evidence without creating a semantic receipt', t => {
  const f=fixture(t,{partial:true,difficultyOnly:true}),selected=f.selected();
  assert.equal(selected[0].kind,'difficulty5-ratings');
  assert.equal(selected[0].questionCount,1);assert.equal(selected[0].sourceQuestionCount,24);
  assert.deepEqual(selected[0].selectedItems,[{questionUid:'fixture',sourceOrdinal:5}]);
  assert.deepEqual(selected[0].evidence.map(r=>r.path),[DIFFICULTY_EVIDENCE]);
  assert.equal(selected[0].receiptPath,undefined);
  const identity=fs.readFileSync(path.join(f.root,IDENTITY)),authority=fs.readFileSync(path.join(f.root,AUTHORITY));
  const proof=f.produce();assert.equal(proof.status,'PASS');
  assert.deepEqual(proof.nativePreview.plans,[{requestPath:REQUEST,replay:false,plannedPaths:[META]}]);
  assert.equal(fs.existsSync(path.join(f.root,RECEIPT)),false);
  assert.deepEqual(fs.readFileSync(path.join(f.root,IDENTITY)),identity);
  assert.deepEqual(fs.readFileSync(path.join(f.root,AUTHORITY)),authority);
  const before=f.snapshot();assert.equal(f.validate(proof).reusable,true);assert.deepEqual(f.snapshot(),before);f.assertShadowsRemoved();
  fs.appendFileSync(path.join(f.root,DIFFICULTY_EVIDENCE),'\n');
  assert.throws(()=>f.validate(proof),/EVIDENCE_DRIFT/);
});

function ordinaryDifficultyRequest(request) {
  delete request.reviewedCorrection;
  request.gemini.requestId = 'luna-diff5-20261112-합성_시험지';
}

test('ordinary difficulty selects the exact main inbox and PR inputs without inventing review evidence', t => {
  const f = fixture(t, { partial: true, difficultyOnly: true, otherOwner: false, mutateRequest: ordinaryDifficultyRequest });
  const selected = f.selected(), main = selectPendingNativeRequests({ root: f.root, headSha: f.headSha });
  assert.deepEqual(main, selected);
  assert.equal(selected[0].kind, 'difficulty5-ratings');
  assert.equal(selected[0].difficultyRegistrationMode, 'ordinary-ratings');
  assert.equal(selected[0].difficultySourceBlobSha1, f.request.gemini.latestBlobSha);
  assert.equal(selected[0].requestId, 'luna-diff5-20261112-합성_시험지');
  assert.equal(selected[0].sourceQuestionCount, 24);
  assert.deepEqual(selected[0].selectedItems, [{ questionUid: 'fixture', sourceOrdinal: 5 }]);
  assert.deepEqual(selected[0].evidence, []);
  assert.equal(selected[0].receiptPath, undefined);
  const identity = fs.readFileSync(path.join(f.root, IDENTITY)), authority = fs.readFileSync(path.join(f.root, AUTHORITY));
  const proof = f.produce();
  assert.equal(proof.status, 'PASS');
  assert.deepEqual(proof.nativePreview.plans, [{ requestPath: REQUEST, replay: false, plannedPaths: [META] }]);
  assert.equal(proof.nativePreview.checks.find(c => c.id === 'native-consumer').difficultyOnly.newAdvancedMetadataApprovals, 0);
  assert.equal(fs.existsSync(path.join(f.root, RECEIPT)), false);
  assert.deepEqual(fs.readFileSync(path.join(f.root, IDENTITY)), identity);
  assert.deepEqual(fs.readFileSync(path.join(f.root, AUTHORITY)), authority);
  const before = f.snapshot();
  assert.equal(f.validate(proof).reusable, true); assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('ordinary main temporary preparation uses the official difficulty modes and preserves the inbox', t => {
  const f = fixture(t, { difficultyOnly: true, otherOwner: false, mutateRequest: ordinaryDifficultyRequest });
  const requestBytes = fs.readFileSync(path.join(f.root, REQUEST));
  const report = preparePrRegistration({ root: f.root, eventName: 'push',
    event: { before: f.baseSha, after: f.headSha }, expectedSha: f.headSha, run: f.run });
  assert.equal(report.state, 'PREPARED');
  assert.deepEqual(report.pendingRequestPaths, [REQUEST]);
  assert.equal(report.nativePreview.requests[0].difficultyRegistrationMode, 'ordinary-ratings');
  assert.equal(report.nativePreview.checks.find(c => c.id === 'native-consumer').outcome, 'success');
  assert.deepEqual(fs.readFileSync(path.join(f.root, REQUEST)), requestBytes);
  assert.equal(f.git('rev-parse', 'HEAD'), f.headSha);
});

test('unchanged ordinary difficulty stays outside a later unrelated PR selection', t => {
  const f = fixture(t, { difficultyOnly: true, otherOwner: false, mutateRequest: ordinaryDifficultyRequest });
  f.write('tools/ci/unrelated-fixture.mjs', '// later unrelated change\n');
  f.git('add', '--', 'tools/ci/unrelated-fixture.mjs'); f.git('commit', '-qm', 'later unrelated code');
  const headSha = f.git('rev-parse', 'HEAD');
  assert.deepEqual(selectNativeRequests({ root: f.root, baseSha: f.headSha, headSha }), []);
  assert.equal(selectPendingNativeRequests({ root: f.root, headSha }).length, 1);
});

test('ordinary difficulty fails closed for malformed scope, correction claims and unknown main schemas', t => {
  for (const [mutate, error] of [
    [r => { r.gemini.schemaVersion = 'unknown'; }, /DIFFICULTY_APPROVAL/],
    [r => { r.gemini.requestId = ''; }, /REQUEST_ID/],
    [r => { r.gemini.requestId = 'id\nforged'; }, /REQUEST_ID/],
    [r => { r.gemini.items = []; }, /QUESTION_COUNT/],
    [r => { r.gemini.items = [null]; }, /SELECTED_UID_SCOPE/],
    [r => { r.gemini.items.push({ ...r.gemini.items[0], ordinal: 6 }); }, /SELECTED_UID_SCOPE/],
    [r => { r.gemini.items[0].ordinal = 25; }, /SOURCE_DENOMINATOR/],
    [r => { r.gemini.latestBlobSha = '0'.repeat(40); }, /SOURCE_NOT_FIXED/],
    [r => { r.gemini.sourceArchiveFile = '../native.js'; }, /UNSAFE_PATH/],
    [r => { r.reviewedCorrection = null; }, /DIFFICULTY_APPROVAL/],
    [r => { r.reviewedCorrection = {}; }, /DIFFICULTY_APPROVAL/],
    [r => { r.schemaVersion = 'unknown-difficulty-request'; }, /PENDING_SCHEMA_UNSUPPORTED/],
  ]) {
    const f = fixture(t, { partial: true, difficultyOnly: true, otherOwner: false,
      mutateRequest: r => { ordinaryDifficultyRequest(r); mutate(r); } });
    assert.throws(() => selectPendingNativeRequests({ root: f.root, headSha: f.headSha }), error);
    assert.equal(f.calls.filter(c => c.program !== 'git').length, 0);
  }
  const request = fixture(t, { difficultyOnly: true, otherOwner: false, mutateRequest: ordinaryDifficultyRequest });
  fs.appendFileSync(path.join(request.root, REQUEST), '\n');
  assert.throws(request.selected, /REQUEST_NOT_FIXED/);
  const source = fixture(t, { difficultyOnly: true, otherOwner: false, mutateRequest: ordinaryDifficultyRequest });
  fs.appendFileSync(path.join(source.root, SOURCE), '\n');
  assert.throws(source.selected, /SOURCE_NOT_FIXED/);
});

test('ordinary difficulty keeps the official CRLF binding but rejects any other source drift', t => {
  const f = fixture(t, { difficultyOnly: true, otherOwner: false, mutateRequest: ordinaryDifficultyRequest });
  const originalBlob = f.request.gemini.latestBlobSha;
  const source = fs.readFileSync(path.join(f.root, SOURCE), 'utf8').replace(/\n/g, '\r\n');
  f.write(SOURCE, source); f.git('add', '--', SOURCE); f.git('commit', '-qm', 'exact CRLF source snapshot');
  const headSha = f.git('rev-parse', 'HEAD');
  const [selected] = selectPendingNativeRequests({ root: f.root, headSha });
  assert.equal(selected.difficultySourceBlobSha1, originalBlob);
  assert.notEqual(selected.source.blobSha1, originalBlob);
  assert.equal(selected.source.sha256, sha(source));
  f.write(SOURCE, source.replace('id', 'changedField'));
  f.git('add', '--', SOURCE); f.git('commit', '-qm', 'non-newline source change');
  assert.throws(() => selectPendingNativeRequests({ root: f.root, headSha: f.git('rev-parse', 'HEAD') }), /SOURCE_NOT_FIXED/);
});

test('draft difficulty with a text fingerprint on every item does not bind the whole-file blob; any other request still does', t => {
  const asDraft = (withFingerprint) => request => {
    ordinaryDifficultyRequest(request);
    request.approvalType = 'DRAFT_SINGLE_MODEL'; request.judge = 'draft-model';
    request.gemini.items.forEach((item, i) => { if (withFingerprint || i) item.textBindingFingerprint = 'a'.repeat(64); });
  };
  const drift = (f, expectFixed) => {
    f.write(SOURCE, fs.readFileSync(path.join(f.root, SOURCE), 'utf8').replace('id', 'changedField'));
    f.git('add', '--', SOURCE); f.git('commit', '-qm', 'source change after the request');
    const run = () => selectPendingNativeRequests({ root: f.root, headSha: f.git('rev-parse', 'HEAD') });
    if (expectFixed) assert.equal(run().length, 1); else assert.throws(run, /SOURCE_NOT_FIXED/);
  };
  drift(fixture(t, { difficultyOnly: true, otherOwner: false, mutateRequest: asDraft(true) }), true);
  drift(fixture(t, { difficultyOnly: true, otherOwner: false, mutateRequest: asDraft(false) }), false);
});

test('ordinary difficulty rejects partial registrar success, wrong modes and foreign output mutations', t => {
  for (const phase of ['dry-run', 'write', 'projection']) for (const mutate of [
    r => ({ ...r, mode: 'dry-run-reviewed-correction' }),
    r => ({ ...r, summary: { ...r.summary, SKIP_INVALID: 1 } }),
    r => ({ ...r, summary: { ...r.summary, CONFLICT: 1 } }),
    r => ({ ...r, sourceBlobSha: '0'.repeat(40) }),
    r => ({ ...r, items: [{ questionUid: 'foreign', ordinal: 1 }] }),
  ]) {
    const f = fixture(t, { difficultyOnly: true, otherOwner: false, mutateRequest: ordinaryDifficultyRequest });
    f.hook.difficultyResult = (p, r) => p === phase ? mutate(r) : r;
    assert.throws(f.produce, /DIFFICULTY_RESULT_(NOT_PASS|UID_SCOPE)/);
  }
  for (const file of [SOURCE, IDENTITY, AUTHORITY]) {
    const f = fixture(t, { difficultyOnly: true, otherOwner: false, mutateRequest: ordinaryDifficultyRequest });
    f.hook.afterDifficultyWrite = root => f.write(file, 'undeclared write\n', root);
    assert.throws(f.produce, /UNDECLARED_NATIVE_OUTPUT/);
  }
});

function ordinaryOfficialFixture(t, mutate) {
  const f = fixture(t, { partial: true, difficultyOnly: true, otherOwner: false, mutateRequest: ordinaryDifficultyRequest });
  const records = Array.from({ length: 24 }, (_, i) => {
    const q = { id: i + 1 }, questionUid = i === 4 ? 'fixture' : `synthetic-uid-${i + 1}`;
    return { questionUid, sourceArchiveFile: 'original/native.js', sourceOrdinal: i + 1,
      sourceFingerprint: sha(JSON.stringify({ content: null, choices: null, answer: null, solution: null, image: null })),
      contentFingerprint: sha(JSON.stringify({ content: null, choices: null, image: null })),
      level: '중', metadataApprovalType: 'MAIN_MERGE', reviewStatus: 'review_required', sourceQuestionNo: q.id,
      ...(i === 4 ? { difficultyBucket: 2, difficultyConfidence: 'high', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL' } : {}) };
  });
  const identity = records.map(r => ({ questionUid: r.questionUid, sourceArchiveFile: r.sourceArchiveFile,
    sourceOrdinal: r.sourceOrdinal, sourceQuestionNo: r.sourceQuestionNo, sourceFingerprint: r.sourceFingerprint }));
  f.request.gemini.items.push({ ...copy(f.request.gemini.items[0]), questionUid: records[5].questionUid, ordinal: 6 });
  mutate?.({ request: f.request, records, identity });
  f.write(META, json({ records })); f.write(IDENTITY, json({ records: identity })); f.write(REQUEST, json(f.request));
  f.git('add', '--', META, IDENTITY, REQUEST); f.git('commit', '-qm', 'synthetic exact ordinary registrar inputs');
  const headSha = f.git('rev-parse', 'HEAD'), officialResults = [];
  const run = (program, args, root = f.root) => {
    if (program === 'git') return f.run(program, args, root);
    if (args[0].replaceAll('\\','/').endsWith('/register-difficulty5.mjs')) {
      const request = JSON.parse(fs.readFileSync(path.join(root, args[args.indexOf('--request') + 1]), 'utf8'));
      const result = registerDifficulty5({ root, request, write: args.includes('--write'), verifyProjection: args.includes('--verify-projection') });
      officialResults.push(copy(result)); return json(result);
    }
    return f.run(program, args, root);
  };
  return { ...f, headSha, run, officialResults, select: () => selectPendingNativeRequests({ root: f.root, headSha }) };
}

test('ordinary preview invokes the real registrar for mixed replay, metadata-only write and exact projection', t => {
  const f = ordinaryOfficialFixture(t), selected = f.select();
  const before = JSON.parse(fs.readFileSync(path.join(f.root, META), 'utf8')).records;
  const protectedBytes = [SOURCE, IDENTITY, AUTHORITY, REQUEST].map(file => [file, fs.readFileSync(path.join(f.root, file))]);
  assert.deepEqual(applyNativeRequests({ root: f.root, requests: selected, run: f.run }),
    [{ requestPath: REQUEST, replay: false, plannedPaths: [META] }]);
  assert.equal(f.officialResults[0].summary.APPLY, 1); assert.equal(f.officialResults[0].summary.ALREADY_REGISTERED, 1);
  const after = JSON.parse(fs.readFileSync(path.join(f.root, META), 'utf8')).records;
  const difficultyFields = new Set(['difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility']);
  const withoutDifficulty = row => Object.fromEntries(Object.entries(row).filter(([key]) => !difficultyFields.has(key)));
  assert.deepEqual(after.map(withoutDifficulty), before.map(withoutDifficulty));
  assert.deepEqual(after.filter(r => r.sourceOrdinal !== 6), before.filter(r => r.sourceOrdinal !== 6));
  assert.equal(after[5].difficultyBucket, 2);
  assert.deepEqual(applyNativeRequests({ root: f.root, requests: selected, run: f.run }),
    [{ requestPath: REQUEST, replay: true, plannedPaths: [] }]);
  assert.equal(verifyNativeRequests({ root: f.root, requests: selected, run: f.run })[0].outcome, 'success');
  assert.equal(f.officialResults.at(-1).mode, 'verify-projection');
  assert.equal(f.officialResults.at(-1).summary.VERIFIED, 2);
  assert.equal(f.officialResults.at(-1).summary.changedFields, 0);
  for (const [file, bytes] of protectedBytes) assert.deepEqual(fs.readFileSync(path.join(f.root, file)), bytes);
  assert.equal(fs.existsSync(path.join(f.root, RECEIPT)), false);
});

test('ordinary preview cannot convert real registrar invalid rows, conflicts or UID drift to success', t => {
  for (const mutate of [
    ({ request }) => { request.gemini.items[1].after.difficultyBucket = 9; },
    ({ request }) => { request.gemini.items[1].after.difficultyConfidence = 'invented'; },
    ({ records }) => { records[5].difficultyBucket = 4; },
  ]) {
    const f = ordinaryOfficialFixture(t, mutate), before = fs.readFileSync(path.join(f.root, META));
    assert.throws(() => applyNativeRequests({ root: f.root, requests: f.select(), run: f.run }), /DIFFICULTY_RESULT_NOT_PASS/);
    assert.deepEqual(fs.readFileSync(path.join(f.root, META)), before);
  }
  const f = ordinaryOfficialFixture(t, ({ identity }) => { identity[5].questionUid = 'unrelated-identity'; });
  assert.throws(() => applyNativeRequests({ root: f.root, requests: f.select(), run: f.run }), /ordinal\/questionUid mismatch/);
});

function initialDifficultyFixture(t, mutate) {
  return fixture(t, { partial: true, difficultyOnly: true, otherOwner: false, mutateRequest: request => {
    delete request.reviewedCorrection;
    request.gemini.requestId = 'luna-diff5-20261112-시험_난도';
    mutate?.(request);
  } });
}

test('initial difficulty main preview runs the official lane and Consumer without semantic authority or inbox consumption', t => {
  const f = initialDifficultyFixture(t), options = laterCodePush(f);
  const inputs = [REQUEST, SOURCE, IDENTITY, AUTHORITY].map(file => [file, fs.readFileSync(path.join(f.root, file))]);
  const requests = selectPendingNativeRequests({ root: f.root, headSha: options.expectedSha });
  assert.equal(requests.length, 1);
  assert.equal(requests[0].kind, 'difficulty5-ratings');
  assert.equal(requests[0].difficultyRegistrationMode, 'ordinary-ratings');
  assert.equal(requests[0].requestId, f.request.gemini.requestId);
  assert.equal(requests[0].questionCount, 1); assert.equal(requests[0].sourceQuestionCount, 24);
  assert.deepEqual(requests[0].selectedItems, [{ questionUid: 'fixture', sourceOrdinal: 5 }]);
  assert.deepEqual(requests[0].evidence, []); assert.equal(requests[0].receiptPath, undefined);
  const phases = []; f.hook.difficultyPhase = phase => phases.push(phase);
  const result = preparePrRegistration(options);
  assert.equal(result.state, 'PREPARED');
  assert.deepEqual(phases, ['dry-run', 'write', 'projection']);
  assert.deepEqual(result.nativePreview.plans, [{ requestPath: REQUEST, replay: false, plannedPaths: [META] }]);
  assert.deepEqual(result.nativePreview.checks.map(row => row.id), ['native-projection', 'native-consumer']);
  assert.equal(result.nativePreview.checks[1].difficultyOnly.newAdvancedMetadataApprovals, 0);
  assert.equal(fs.existsSync(path.join(f.root, RECEIPT)), false);
  for (const [file, bytes] of inputs) assert.deepEqual(fs.readFileSync(path.join(f.root, file)), bytes, file);
  assert.equal(f.git('rev-parse', 'HEAD'), options.expectedSha);
});

test('initial difficulty changed PR and cached proof retain exact request, source and official result mode', t => {
  const f = initialDifficultyFixture(t), selected = f.selected();
  assert.equal(selected[0].difficultyRegistrationMode, 'ordinary-ratings');
  const proof = f.produce(), before = f.snapshot();
  assert.equal(proof.status, 'PASS'); assert.equal(f.validate(proof).reusable, true);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
  const forged = copy(proof); delete forged.nativePreview.requests[0].difficultyRegistrationMode;
  assert.throws(() => f.validate(forged), /INPUT_MANIFEST_MISMATCH/);
});

for (const [name, mutate, error] of [
  ['empty request id', r => { r.gemini.requestId = ''; }, /REQUEST_ID/],
  ['nonstring request id', r => { r.gemini.requestId = 123; }, /REQUEST_ID/],
  ['control character request id', r => { r.gemini.requestId = 'luna\t난도\x1b'; }, /REQUEST_ID/],
  ['wrong payload schema', r => { r.gemini.schemaVersion = 'other'; }, /DIFFICULTY_APPROVAL/],
  ['duplicate UID', r => { r.gemini.items.push({ ...copy(r.gemini.items[0]), ordinal: 6 }); }, /SELECTED_UID_SCOPE/],
  ['out-of-bank ordinal', r => { r.gemini.items[0].ordinal = 25; }, /SOURCE_DENOMINATOR/],
  ['explicit null correction', r => { r.reviewedCorrection = null; }, /DIFFICULTY_APPROVAL/],
  ['unknown correction schema', r => { r.reviewedCorrection = { schemaVersion: 'unknown' }; }, /DIFFICULTY_APPROVAL/],
]) test(`initial difficulty refuses ${name} before any write`, t => {
  const f = initialDifficultyFixture(t, mutate);
  assert.throws(() => selectPendingNativeRequests({ root: f.root, headSha: f.headSha }), error);
  assert.equal(f.calls.length, 0); assert.equal(fs.existsSync(path.join(f.root, RECEIPT)), false);
});

test('initial difficulty fixed snapshot refuses changed request or source bytes', t => {
  for (const file of [REQUEST, SOURCE]) {
    const f = initialDifficultyFixture(t);
    fs.appendFileSync(path.join(f.root, file), '\n');
    assert.throws(() => selectPendingNativeRequests({ root: f.root, headSha: f.headSha }), /REQUEST_NOT_FIXED|SOURCE_NOT_FIXED/);
    assert.equal(f.calls.length, 0);
  }
});

for (const refusal of ['SKIP_INVALID', 'CONFLICT', 'reviewed-mode']) test(`initial difficulty refuses official ${refusal} instead of bypassing the lane`, t => {
  const f = initialDifficultyFixture(t), options = laterCodePush(f);
  f.hook.difficultyResult = (phase, result) => phase !== 'dry-run' ? result : refusal === 'reviewed-mode'
    ? { ...result, mode: 'dry-run-reviewed-correction' }
    : { ...result, summary: { ...result.summary, APPLY: 0, [refusal]: result.summary.total, changedFields: 0 } };
  assert.throws(() => preparePrRegistration(options), /DIFFICULTY_RESULT_NOT_PASS/);
  assert.equal(f.calls.filter(call => call.args.includes('--write')).length, 0);
});

test('initial difficulty projection and typed Consumer failures remain fatal', t => {
  for (const failure of ['projection', 'consumer']) {
    const f = initialDifficultyFixture(t), options = laterCodePush(f);
    if (failure === 'projection') f.hook.difficultyResult = (phase, result) => phase === 'projection'
      ? { ...result, summary: { ...result.summary, VERIFIED: 0, ALREADY_REGISTERED: 1 } } : result;
    else f.hook.consumerResult = { status: 'FAIL', counts: {}, failures: ['synthetic consumer defect'] };
    assert.throws(() => preparePrRegistration(options), /DIFFICULTY_RESULT_NOT_PASS|CONSUMER_NOT_PASS/);
  }
});

test('initial difficulty cannot write identity or canonical authority', t => {
  for (const file of [IDENTITY, AUTHORITY]) {
    const f = initialDifficultyFixture(t), options = laterCodePush(f);
    f.hook.afterDifficultyWrite = target => f.write(file, '{"forged":true}\n', target);
    assert.throws(() => preparePrRegistration(options), /UNDECLARED_NATIVE_OUTPUT/);
  }
});

test('initial difficulty does not infer a basic-preservation fingerprint dependency', t => {
  const f = fixture(t, { partial: true, basicPreservation: true, pairedDifficulty: true, otherOwner: false });
  const raw = JSON.parse(fs.readFileSync(path.join(f.root, DIFFICULTY_REQUEST), 'utf8'));
  delete raw.reviewedCorrection; f.write(DIFFICULTY_REQUEST, json(raw));
  f.git('add', DIFFICULTY_REQUEST); f.git('commit', '-qm', 'initial difficulty has no reviewed before binding');
  assert.throws(() => selectPendingNativeRequests({ root: f.root, headSha: f.git('rev-parse', 'HEAD') }), /BASIC_DEPENDENCY_FINGERPRINT/);
});

test('identity repair and reviewed difficulty run in the same preview before strict projection', t => {
  const f=fixture(t,{partial:true,identityOnly:true,pairedDifficulty:true});
  f.hook.projection=target=>assert.equal(JSON.parse(fs.readFileSync(path.join(target,META),'utf8')).records[0].difficultyBucket,2);
  assert.deepEqual(f.selected().map(r=>r.kind),['identity-fingerprint-repair','difficulty5-ratings']);
  const proof=f.produce();assert.equal(proof.status,'PASS');
  assert.deepEqual(proof.nativePreview.plans.map(p=>p.plannedPaths),[[IDENTITY,RECEIPT].sort(),[META]]);
  const writes=f.calls.filter(c=>c.root===f.root&&c.args.includes('--write')&&/register-(reviewed-exam-meta-source|difficulty5)\.mjs$/.test(c.args[0]));
  assert.equal(writes.length,2);assert.match(writes[0].args[0],/register-reviewed-exam-meta-source/);assert.match(writes[1].args[0],/register-difficulty5/);
  const before=f.snapshot();assert.equal(f.validate(proof).reusable,true);assert.deepEqual(f.snapshot(),before);f.assertShadowsRemoved();
});

test('audit preservation follows its exact difficulty input in apply, projection and shadow replay', t => {
  const f=fixture(t,{pairedDifficulty:true,auditPreservation:true});
  const assertDifficultyApplied=target=>assert.equal(JSON.parse(fs.readFileSync(path.join(target,META),'utf8')).records[0].difficultyBucket,2);
  for(const phase of ['dry-run','write','projection'])f.hook[phase]=assertDifficultyApplied;
  assert.deepEqual(f.selected().map(r=>r.path),[DIFFICULTY_REQUEST,REQUEST]);
  const proof=f.produce();
  assert.equal(proof.status,'PASS');
  assert.deepEqual(proof.nativePreview.plans.map(p=>p.requestPath),[DIFFICULTY_REQUEST,REQUEST]);
  assert.deepEqual(proof.nativePreview.requests[1].sourceRebind,
    {schemaVersion:'archive-native-audit-preservation-v1',difficultyRequestRef:f.request.approval.sourceRebind.difficultyRequestRef});
  assert.equal(proof.nativePreview.requests[1].kind,'native-approval-preservation');
  assert.equal(proof.nativePreview.requests[1].preservedApprovalType,'META_PIPELINE_AUDIT');
  f.validate(proof);
  assertDifficultyApplied(f.root);
  for(const target of new Set(f.calls.map(c=>c.root))) {
    const writes=f.calls.filter(c=>c.root===target&&c.args.includes('--write')&&c.args.includes('--request'));
    if(!writes.length)continue;
    assert.deepEqual(writes.map(c=>c.args[c.args.indexOf('--request')+1]),[DIFFICULTY_REQUEST,REQUEST]);
  }
  f.assertShadowsRemoved();
});

test('partial audit preview preserves its selected count and whole-source D5 dependency through shadow and Consumer proof', t => {
  const f=fixture(t,{partial:true,pairedDifficulty:true,auditPreservation:true}),[difficulty,audit]=f.selected();
  assert.equal(difficulty.questionCount,24);assert.equal(difficulty.sourceQuestionCount,24);
  assert.equal(audit.scope,'PARTIAL_UIDS');assert.equal(audit.questionCount,1);assert.equal(audit.sourceQuestionCount,24);
  assert.deepEqual(audit.selectedItems,[{questionUid:'fixture',sourceOrdinal:5}]);
  const proof=f.produce();assert.equal(proof.status,'PASS');
  assert.deepEqual(proof.nativePreview.plans.map(p=>p.requestPath),[DIFFICULTY_REQUEST,REQUEST]);
  assert.deepEqual(proof.nativePreview.checks.find(c=>c.id==='native-consumer').preservedNativeApprovals,
    {requests:1,preservedMetadataApprovals:1,newMetadataApprovals:0,approvalTypes:['META_PIPELINE_AUDIT']});
  assert.equal(f.validate(proof).reusable,true);f.assertShadowsRemoved();
});

test('partial audit preview refuses a narrowed whole-source D5 dependency or substituted selected UID',t=>{
  const f=fixture(t,{partial:true,pairedDifficulty:true,auditPreservation:true}),selected=f.selected();
  for(const mutate of [
    d=>{d.sourceQuestionCount=1;},d=>{d.questionCount=1;},d=>{d.selectedItems=d.selectedItems.slice(0,23);},
    d=>{d.selectedItems[23].sourceOrdinal=23;},d=>{d.selectedItems[23].sourceOrdinal=25;},
    d=>{d.selectedItems[23].questionUid=d.selectedItems[22].questionUid;},
  ]){const bad=copy(selected);mutate(bad[0]);assert.throws(()=>orderNativeRequests(bad),/AUDIT_DEPENDENCY_DENOMINATOR/);}
  const replaced=copy(selected);replaced[0].selectedItems.find(i=>i.sourceOrdinal===5).questionUid='another-UID';
  assert.throws(()=>orderNativeRequests(replaced),/AUDIT_DEPENDENCY_UID_SCOPE/);
  assert.equal(f.calls.length,0);
});

test('FINAL_QA partial source preservation verifies selected approval separately from the full source count', t => {
  const f=fixture(t,{partial:true,finalQaPreservation:true}),proof=f.produce();
  assert.equal(proof.status,'PASS');
  const [request]=proof.nativePreview.requests;
  assert.equal(request.kind,'native-approval-preservation');assert.equal(request.preservedApprovalType,'FINAL_QA');
  assert.equal(request.questionCount,1);assert.equal(request.sourceQuestionCount,24);
  assert.equal(f.validate(proof).reusable,true);f.assertShadowsRemoved();
  const checks=verifyNativeRequests({root:f.root,requests:f.selected(),run:f.run});
  assert.deepEqual(checks.find(c=>c.id==='native-consumer').preservedNativeApprovals,
    {requests:1,preservedMetadataApprovals:1,newMetadataApprovals:0,approvalTypes:['FINAL_QA']});
});

test('source-only audit subset reaches PR and main preview, official phases and typed Consumer without a D5 edge', t => {
  const f = fixture(t, { partial: true, auditSourcePreservation: true, otherOwner: false });
  const [selected] = f.selected();
  assert.equal(selected.kind, 'native-approval-preservation');
  assert.equal(selected.preservedApprovalType, 'META_PIPELINE_AUDIT');
  assert.equal(selected.sourceRebind, undefined, 'source-only preservation does not fabricate a D5 dependency');
  assert.equal(selected.auditSourcePreservation.schemaVersion, 'archive-native-audit-source-preservation-v1');
  assert.equal(selected.auditSourcePreservation.priorCommit, f.baseSha);
  assert.equal(selected.questionCount, 1); assert.equal(selected.sourceQuestionCount, 24);
  assert.deepEqual(selectPendingNativeRequests({ root: f.root, headSha: f.headSha }), f.selected());
  const proof = f.produce(); assert.equal(proof.status, 'PASS');
  assert.deepEqual(proof.nativePreview.checks.find(c => c.id === 'native-consumer').preservedNativeApprovals,
    { requests: 1, preservedMetadataApprovals: 1, newMetadataApprovals: 0, approvalTypes: ['META_PIPELINE_AUDIT'] });
  assert.equal(f.validate(proof).reusable, true); f.assertShadowsRemoved();
});

for (const [name, mutation, error = /AUDIT_SOURCE_PRESERVATION_SCOPE/] of [
  ['wrong approval type', r => { r.approval.type = 'FINAL_QA'; }],
  ['missing metadata review', r => { delete r.approval.metadataReviewed; }],
  ['full scope', r => { delete r.scope; }],
  ['whole selection disguised as subset', r => { r.expectedQuestionCount = 1; }],
  ['source review mixed into an item', r => { r.items[0].sourceReview = {}; }],
  ['changed before', r => { r.items[0].before = { difficultyBucket: 2 }; }],
  ['changed after', r => { r.items[0].after = { templateKey: 'NEW' }; }],
  ['registry write', r => { r.registryChanges = [{}]; }],
  ['identity-only mode', r => { r.registrationMode = 'IDENTITY_FINGERPRINT_ONLY'; }],
  ['unknown source-only option', r => { r.approval.sourceRebind.allow = true; }],
  ['nonimmutable prior commit', r => { r.approval.sourceRebind.priorCommit = 'main'; }],
  ['wrong self request path', r => { r.approval.sourceRebind.requestPath = OTHER; }],
  ['wrong prior directory', r => { r.approval.sourceRebind.priorReceiptRef.path = EVIDENCE; }],
  ['unbound item prior evidence', r => { r.items[0].evidenceRefs = []; }],
  ['unbound approval prior evidence', r => { r.approval.evidenceRefs = []; }],
  ['mixed difficulty dependency', r => { r.approval.sourceRebind.difficultyRequestRef = { path: DIFFICULTY_REQUEST, sha256: 'a'.repeat(64) }; }, /AUDIT_DEPENDENCY_SCOPE/],
  ['unknown preservation subtype', r => { r.approval.sourceRebind.schemaVersion = 'unreviewed-audit-source'; }, /PRESERVATION_SCOPE/],
  ['duplicate selected UID', r => { r.items.push({ ...r.items[0], sourceOrdinal: 6 }); }, /SELECTED_UID_SCOPE/],
]) test(`source-only audit preview refuses ${name}`, t => {
  const f = fixture(t, { partial: true, auditSourcePreservation: true, otherOwner: false, mutateRequest: mutation });
  assert.throws(f.selected, error);
  assert.throws(() => selectPendingNativeRequests({ root: f.root, headSha: f.headSha }), error);
  assert.equal(f.calls.length, 0);
});

test('source-only audit preview retains fixed evidence/source checks and official refusal/count guards', t => {
  for (const [file, expected] of [[AUDIT_PRIOR_RECEIPT, /EVIDENCE_DRIFT/], [SOURCE, /SOURCE_NOT_FIXED/]]) {
    const f = fixture(t, { partial: true, auditSourcePreservation: true });
    f.write(file, fs.readFileSync(path.join(f.root, file), 'utf8') + '\n');
    assert.throws(f.selected, expected);
  }
  for (const phase of ['dry-run', 'write', 'projection']) {
    const refused = fixture(t, { partial: true, auditSourcePreservation: true });
    refused.hook[phase] = () => { throw Error('STRICT_PRIOR_FULL_AUDIT_REPLAY_REFUSED'); };
    assert.throws(refused.produce, /STRICT_PRIOR_FULL_AUDIT_REPLAY_REFUSED/);
    const promoted = fixture(t, { partial: true, auditSourcePreservation: true });
    promoted.hook.result = (p, result) => p === phase ? { ...result, newMetadataApprovals: 1 } : result;
    assert.throws(promoted.produce, /DRY_RUN_NOT_PASS|WRITE_PLAN_MISMATCH|PROJECTION_NOT_VERIFIED/);
  }
});

function historicalAuditSourceFixture(t, { mutateReceipt, mutateRequest, extraLiveHistoricalRef = false } = {}) {
  const f = fixture(t, { partial: true, auditSourcePreservation: true, otherOwner: false });
  const historicalCanonical = 'archive/data/meta-foundation/crosswalks/fixture-history.json';
  const consumedInbox = '.archive-meta-register/inbox/consumed-old-ratings.json';
  const priorSource = fs.readFileSync(path.join(f.root, SOURCE));
  const priorCanonical = json({ revision: 'historical immutable authority' });
  const priorConsumed = json({ historicalOnly: 'consumed snapshot; no current inbox writer' });
  f.write(historicalCanonical, priorCanonical); f.write(consumedInbox, priorConsumed);
  const receipt = JSON.parse(fs.readFileSync(path.join(f.root, AUDIT_PRIOR_RECEIPT), 'utf8'));
  receipt.approval.evidenceRefs = [
    { path: SOURCE, sha256: sha(priorSource) }, { path: historicalCanonical, sha256: sha(priorCanonical) },
    { path: consumedInbox, sha256: sha(priorConsumed) },
  ];
  mutateReceipt?.(receipt);
  f.write(AUDIT_PRIOR_RECEIPT, json(receipt));
  f.git('add', '.'); f.git('commit', '-qm', 'immutable full audit and its consumed historical inputs');
  const priorCommit = f.git('rev-parse', 'HEAD');
  const priorRef = { path: AUDIT_PRIOR_RECEIPT, sha256: sha(json(receipt)) };
  const currentSource = Buffer.concat([priorSource, Buffer.from('// disjoint current source metadata snapshot\n')]);
  const currentCanonical = json({ revision: 'current separately registered authority' });
  f.write(SOURCE, currentSource); f.write(historicalCanonical, currentCanonical);
  fs.unlinkSync(path.join(f.root, consumedInbox));
  f.request.expectedSourceBlobSha1 = createHash('sha1').update(`blob ${currentSource.length}\0`).update(currentSource).digest('hex');
  f.request.approval.sourceRebind.priorCommit = priorCommit;
  f.request.approval.sourceRebind.priorReceiptRef = priorRef;
  f.request.approval.evidenceRefs = [priorRef]; f.request.items[0].evidenceRefs = [priorRef];
  if (extraLiveHistoricalRef) f.request.approval.evidenceRefs.push(receipt.approval.evidenceRefs[1]);
  mutateRequest?.(f.request, { f, priorCommit, priorRef, receipt });
  f.write(REQUEST, json(f.request)); f.git('add', '.'); f.git('commit', '-qm', 'current exact source-only audit subset');
  const headSha = f.git('rev-parse', 'HEAD'), repo = 'owner/repository';
  const options = { root: f.root, repo, expectedSha: headSha, runId: 41, runAttempt: 1, run: f.run,
    event: { number: 17, repository: { id: 101, full_name: repo }, pull_request: {
      base: { sha: f.baseSha, repo: { id: 101 } }, head: { sha: headSha, repo: { id: 101 } },
    } } };
  return { ...f, headSha, priorCommit, priorRef, priorSource, currentSource, historicalCanonical, priorCanonical,
    currentCanonical, consumedInbox, priorConsumed, options,
    selected: () => selectNativeRequests({ root: f.root, baseSha: f.baseSha, headSha }),
    produce: () => producePrRegistrationProof(options),
    validate: proof => validateLocalRegistrationProof({ ...options, proof }) };
}

test('source-only FULL audit history stays in immutable Git while shadow stages current source and canonical inputs', t => {
  const f = historicalAuditSourceFixture(t), observations = [];
  for (const phase of ['dry-run', 'write', 'projection']) f.hook[phase] = target => {
    const historical = file => {
      const result = spawnSync('git', ['show', `${f.priorCommit}:${file}`], { cwd: target });
      assert.equal(result.status, 0); return result.stdout;
    };
    assert.equal(sha(historical(SOURCE)), sha(f.priorSource));
    assert.equal(sha(historical(f.historicalCanonical)), sha(f.priorCanonical));
    assert.equal(sha(historical(f.consumedInbox)), sha(f.priorConsumed));
    assert.equal(sha(fs.readFileSync(path.join(target, SOURCE))), sha(f.currentSource));
    assert.equal(sha(fs.readFileSync(path.join(target, f.historicalCanonical))), sha(f.currentCanonical));
    assert.equal(fs.existsSync(path.join(target, f.consumedInbox)), false);
    observations.push({ phase, shadow: target !== f.root });
  };
  const selected = f.selected();
  assert.deepEqual(selected[0].evidence.map(ref => ref.path), [AUDIT_PRIOR_RECEIPT]);
  const proof = f.produce(), before = f.snapshot();
  assert.equal(proof.status, 'PASS'); assert.equal(f.validate(proof).reusable, true);
  assert.ok(observations.some(row => row.shadow && row.phase === 'write'));
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

for (const [name, mutateReceipt] of [
  ['non-audit schema', r => { r.schemaVersion = 'unreviewed-receipt'; }],
  ['unregistered receipt', r => { r.metadataRegistrationStatus = 'PENDING'; }],
  ['partial prior scope', r => { r.scope = 'PARTIAL_UIDS'; }],
  ['non-audit prior approval', r => { r.approval.type = 'FINAL_QA'; }],
  ['different source', r => { r.sourceArchiveFile = 'original/foreign.js'; }],
  ['new approval claim', r => { r.newMetadataApprovals = 1; }],
  ['wrong FULL denominator', r => { r.totalQuestions = 23; }],
  ['partial request snapshot', r => { r.auditPreservation.requestSnapshot.scope = 'PARTIAL_UIDS'; }],
]) test(`source-only history staging rejects ${name} even when Git and current bytes agree`, t => {
  const f = historicalAuditSourceFixture(t, { mutateReceipt });
  assert.throws(f.selected, /AUDIT_SOURCE_PRIOR_FULL/);
  assert.equal(f.calls.length, 0);
});

test('source-only history staging rejects wrong immutable commit, digest and receipt path', t => {
  const wrongCommit = historicalAuditSourceFixture(t, { mutateRequest: (r, { f }) => { r.approval.sourceRebind.priorCommit = f.baseSha; } });
  assert.throws(wrongCommit.selected, /AUDIT_SOURCE_PRIOR_GIT/);
  const wrongHash = historicalAuditSourceFixture(t, { mutateRequest: r => {
    const ref = { ...r.approval.sourceRebind.priorReceiptRef, sha256: 'f'.repeat(64) };
    r.approval.sourceRebind.priorReceiptRef = ref; r.approval.evidenceRefs = [ref]; r.items[0].evidenceRefs = [ref];
  } });
  assert.throws(wrongHash.selected, /EVIDENCE_DRIFT/);
  const wrongPath = historicalAuditSourceFixture(t, { mutateRequest: (r, { f, receipt }) => {
    const ref = { path: AUDIT_PRIOR_RECEIPT.replace('.json', '-other.json'), sha256: sha(json(receipt)) };
    f.write(ref.path, json(receipt)); f.git('add', ref.path); f.git('commit', '-qm', 'same bytes at unrelated receipt path');
    r.approval.sourceRebind.priorCommit = f.git('rev-parse', 'HEAD');
    r.approval.sourceRebind.priorReceiptRef = ref; r.approval.evidenceRefs = [ref]; r.items[0].evidenceRefs = [ref];
  } });
  assert.throws(wrongPath.selected, /AUDIT_SOURCE_PRIOR_FULL/);
});

test('source-only prior history does not exempt a separate current approval evidence reference', t => {
  const f = historicalAuditSourceFixture(t, { extraLiveHistoricalRef: true });
  assert.throws(f.selected, /EVIDENCE_DRIFT/); assert.equal(f.calls.length, 0);
});

test('source-only historical staging still requires official FULL replay in the independent shadow', t => {
  const f = historicalAuditSourceFixture(t), proof = f.produce();
  f.hook['dry-run'] = target => { if (target !== f.root) throw Error('IMMUTABLE_FULL_AUDIT_REPLAY_REFUSED'); };
  const before = f.snapshot(); assert.throws(() => f.validate(proof), /IMMUTABLE_FULL_AUDIT_REPLAY_REFUSED/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('preservation refuses claimed new approvals or missing preservation counts in every official phase', t => {
  for(const phase of ['dry-run','write','projection'])for(const change of [
    {newMetadataApprovals:1},{preservedMetadataApprovals:0},{preservedMetadataApprovals:24},
    {newMetadataApprovals:undefined},{preservedMetadataApprovals:undefined},
  ]) {
    const f=fixture(t,{partial:true,finalQaPreservation:true});
    f.hook.result=(p,r)=>p===phase?{...r,...change}:r;
    assert.throws(()=>f.produce(),/DRY_RUN_NOT_PASS|WRITE_PLAN_MISMATCH|PROJECTION_NOT_VERIFIED/);
  }
});

test('preservation Consumer cannot skip the selected UID, promote its type, or claim another scope', t => {
  for(const change of [
    {kind:'reviewed-exam-v2'},{newMetadataApprovals:1},{approvalCreated:true},{preservedMetadataApprovals:0},
    {preservedMetadataApprovals:24},{preservedMetadataApprovals:undefined},{approvalType:'REVIEW2'},
    {expectedQuestionCount:1},{expectedQuestionCount:undefined},{changed:0,checked:0,passed:0,skippedUnchanged:1},
  ]) {
    const f=fixture(t,{partial:true,finalQaPreservation:true});
    const exam={file:REQUEST,kind:'native-approval-preservation',sourceFile:'original/native.js',changed:1,checked:1,passed:1,skippedUnchanged:0,
      newMetadataApprovals:0,approvalCreated:false,preservedMetadataApprovals:1,approvalType:'FINAL_QA',expectedQuestionCount:24,...change};
    f.hook.consumerResult={status:'PASS',counts:Object.fromEntries(['changed','checked','passed','skippedUnchanged'].map(k=>[k,exam[k]])),
      exams:[exam],failures:[],unobservedFields:[],assignmentPending:[]};
    assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);
  }
  const f=fixture(t,{partial:true,finalQaPreservation:true});
  f.hook.assignmentPending=[{exam:'original/native.js',qid:5,uid:'fixture',reason:'assignment_missing'}];
  assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);
});

test('audit dependency ordering leaves unrelated requests in their original order', t => {
  const f=fixture(t,{pairedDifficulty:true,auditPreservation:true}),[difficulty,audit]=f.selected();
  const unrelated=copy(audit);delete unrelated.sourceRebind;unrelated.path='.archive-meta-register/inbox/unrelated.json';
  const identity=copy(unrelated);identity.path='.archive-meta-register/inbox/identity.json';identity.kind='identity-fingerprint-repair';
  identity.scope='PARTIAL_UIDS';identity.registrationMode='IDENTITY_FINGERPRINT_ONLY';
  assert.deepEqual(orderNativeRequests([identity,audit,unrelated,difficulty]).map(r=>r.path),
    [identity.path,unrelated.path,difficulty.path,audit.path]);
  assert.deepEqual(orderNativeRequests([unrelated,identity,difficulty]).map(r=>r.path),
    [unrelated.path,identity.path,difficulty.path]);
  const calls=[];
  applyNativeRequests({root:f.root,requests:[audit,difficulty],run:(...args)=>{calls.push(args);return f.run(...args);}});
  assert.equal(calls[0][1][calls[0][1].indexOf('--request')+1],DIFFICULTY_REQUEST);
});

for(const [name,mutation,error] of [
  ['missing selected request',r=>{r.approval.sourceRebind.difficultyRequestRef.path=OTHER;},/AUDIT_DEPENDENCY_NOT_SELECTED/],
  ['incorrect raw SHA',r=>{r.approval.sourceRebind.difficultyRequestRef.sha256='0'.repeat(64);},/AUDIT_DEPENDENCY_SHA/],
  ['self dependency',r=>{r.approval.sourceRebind.difficultyRequestRef.path=REQUEST;},/AUDIT_DEPENDENCY_KIND/],
  ['non-inbox reference',r=>{r.approval.sourceRebind.difficultyRequestRef.path=EVIDENCE;},/AUDIT_DEPENDENCY_REF/],
  ['unsafe reference',r=>{r.approval.sourceRebind.difficultyRequestRef.path='.archive-meta-register/inbox/../zz-reviewed-difficulty.json';},/AUDIT_DEPENDENCY_REF/],
  ['different approval kind',r=>{r.approval.type='FINAL_QA';},/AUDIT_DEPENDENCY_SCOPE/],
  ['different subtype',r=>{r.approval.sourceRebind.schemaVersion='other-preservation';},/AUDIT_DEPENDENCY_SCOPE/],
  ['different own request path',r=>{r.approval.sourceRebind.requestPath=DIFFICULTY_REQUEST;},/AUDIT_DEPENDENCY_SCOPE/],
  ['unsupported preservation scope',r=>{r.scope='PARTIAL_EXAM';},/AUDIT_DEPENDENCY_SCOPE/],
])test(`audit dependency rejects ${name}`,t=>{
  const f=fixture(t,{pairedDifficulty:true,auditPreservation:true,mutateRequest:mutation});
  assert.throws(()=>f.selected(),error);
  assert.equal(f.calls.length,0);
});

test('audit dependency never selects an unchanged request or accepts another source',t=>{
  const f=fixture(t,{pairedDifficulty:true,auditPreservation:true}),selected=f.selected();
  assert.throws(()=>orderNativeRequests(selected.filter(r=>r.path!==DIFFICULTY_REQUEST)),/AUDIT_DEPENDENCY_NOT_SELECTED/);
  for(const field of ['path','blobSha1','sha256']) {
    const changed=copy(selected);changed[0].source[field]+='different';
    assert.throws(()=>orderNativeRequests(changed),/AUDIT_DEPENDENCY_SOURCE/);
  }
  assert.throws(()=>orderNativeRequests([...selected,selected[0]]),/DUPLICATE_REQUEST_PATH/);
  const cyclic=copy(selected);cyclic[0].sourceRebind=copy(cyclic[1].sourceRebind);
  cyclic[0].sourceRebind.difficultyRequestRef.path=cyclic[1].path;
  assert.throws(()=>orderNativeRequests(cyclic),/AUDIT_DEPENDENCY_SCOPE/);
});

test('reviewed difficulty refuses malformed selected scope, unbound evidence and incomplete official results', t => {
  for(const [mutateRequest,error] of [
    [r=>{r.gemini.items.push({...r.gemini.items[0],ordinal:6});},/SELECTED_UID_SCOPE/],
    [r=>{r.gemini.items[0].ordinal=25;},/SOURCE_DENOMINATOR/],
    [r=>{r.reviewedCorrection.evidenceSha256='0'.repeat(64);},/EVIDENCE_DRIFT/],
    [r=>{r.gemini.latestBlobSha='0'.repeat(40);},/SOURCE_NOT_FIXED/],
    [r=>{r.reviewedCorrection.schemaVersion='unreviewed';},/DIFFICULTY_APPROVAL/],
  ]){const f=fixture(t,{partial:true,difficultyOnly:true,mutateRequest});assert.throws(()=>f.selected(),error);}
  for(const phase of ['dry-run','write','projection'])for(const mutation of [
    r=>({...r,summary:{...r.summary,total:24}}),
    r=>({...r,summary:{...r.summary,CONFLICT:1}}),
    r=>({...r,ptTpl:'APPROVED'}),
    r=>({...r,items:[{questionUid:'foreign',ordinal:5}]}),
  ]){
    const f=fixture(t,{partial:true,difficultyOnly:true});f.hook.difficultyResult=(p,r)=>p===phase?mutation(r):r;
    assert.throws(()=>f.produce(),/DIFFICULTY_RESULT_(NOT_PASS|UID_SCOPE)/);
  }
});

test('reviewed difficulty cannot write identity or canonical authority and consumer cannot omit the request', t => {
  for(const file of [SOURCE,IDENTITY,AUTHORITY]){
    const f=fixture(t,{difficultyOnly:true});f.hook.afterDifficultyWrite=target=>f.write(file,'undeclared write\n',target);
    assert.throws(()=>f.produce(),/UNDECLARED_NATIVE_OUTPUT/);
  }
  const f=fixture(t,{partial:true,identityOnly:true,pairedDifficulty:true});
  f.hook.consumerResult={status:'PASS',counts:{changed:1,checked:1,passed:1,skippedUnchanged:0},exams:[{
    file:REQUEST,kind:'identity-fingerprint-repair',sourceFile:'original/native.js',changed:1,checked:1,passed:1,skippedUnchanged:0,
    newMetadataApprovals:0,approvalCreated:false,identityBindings:1}],failures:[],unobservedFields:[],assignmentPending:[]};
  assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);
});

test('difficulty-only proof preserves exactly attributed informational assignments and zero advanced approvals', t => {
  const f=fixture(t,{partial:true,difficultyOnly:true});
  f.hook.assignmentPending=[{exam:'own-reviewed-difficulty',qid:5,uid:'fixture',reason:'assignment_missing'}];
  const proof=f.produce(),info=proof.nativePreview.checks.find(c=>c.id==='native-consumer').difficultyOnly;
  assert.equal(info.newAdvancedMetadataApprovals,0);
  assert.equal(info.informationalAssignmentPendingCount,1);
  assert.deepEqual(info.informationalAssignmentPendingByRequest,[{requestPath:REQUEST,questionCount:1}]);
  assert.match(info.informationalAssignmentPendingSha256,/^[a-f0-9]{64}$/);
  const before=f.snapshot();assert.equal(f.validate(proof).reusable,true);assert.deepEqual(f.snapshot(),before);
  const forged=copy(proof.nativePreview);delete forged.checks[1].difficultyOnly;
  assert.throws(()=>f.native(forged),/CHECKS_INCOMPLETE/);
  f.assertShadowsRemoved();
});

test('informational assignment allowance refuses wrong/missing scope, other reasons, duplicates and native overlaps', t => {
  const pending={exam:'own-reviewed-difficulty',qid:5,uid:'fixture',reason:'assignment_missing'};
  for(const mutation of [
    r=>({...r,exam:'other-exam'}),r=>({...r,qid:6}),r=>({...r,uid:'other-uid'}),
    r=>({...r,reason:'approval_failed'}),r=>({...r,reason:undefined}),r=>({...r,qid:undefined}),r=>({...r,uid:undefined}),
  ]){const f=fixture(t,{partial:true,difficultyOnly:true});f.hook.assignmentPending=[mutation(pending)];assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);}
  const duplicate=fixture(t,{partial:true,difficultyOnly:true});duplicate.hook.assignmentPending=[pending,pending];
  assert.throws(()=>duplicate.produce(),/CONSUMER_NOT_PASS/);
  for(const identityOnly of [false,true]){
    const f=fixture(t,{partial:true,identityOnly});
    f.hook.assignmentPending=[{...pending,exam:'original/native.js'}];
    assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);
    const overlap=fixture(t,{partial:true,identityOnly,pairedDifficulty:true});
    overlap.hook.assignmentPending=[pending];assert.throws(()=>overlap.produce(),/CONSUMER_NOT_PASS/);
  }
  const missing=fixture(t,{partial:true,difficultyOnly:true});
  missing.hook.consumerResult={status:'PASS',counts:{changed:1,checked:1,passed:1,skippedUnchanged:0},
    exams:[{file:REQUEST,kind:'difficulty5-ratings',exam:'own-reviewed-difficulty',sourceFile:'original/native.js',changed:1,checked:1,passed:1,skippedUnchanged:0}],failures:[],unobservedFields:[]};
  assert.throws(()=>missing.produce(),/CONSUMER_NOT_PASS/);
});

for (const [label, file, message] of [
  ['request', REQUEST, /REQUEST_NOT_FIXED/], ['approval evidence', EVIDENCE, /EVIDENCE_DRIFT/],
  ['source', SOURCE, /SOURCE_NOT_FIXED/],
]) test(`${label} raw SHA drift cannot reuse a proof`, t => {
  const f = fixture(t), proof = f.produce();
  fs.appendFileSync(path.join(f.root, file), '\n');
  const before = f.snapshot();
  assert.throws(() => f.validate(proof), message);
  assert.deepEqual(f.snapshot(), before, 'a rejected reuse must not mutate current inputs or native output');
  f.assertShadowsRemoved();
});

test('official writer cannot change source or an undeclared canonical output', t => {
  for (const file of [SOURCE, 'archive/data/meta-foundation/canonical/unrelated.json']) {
    const f = fixture(t); f.hook.afterWrite = target => f.write(file, 'undeclared write\n', target);
    assert.throws(() => f.produce(), /UNDECLARED_NATIVE_OUTPUT/);
  }
});

test('dry-run must be read-only and official stage failures never yield a proof', t => {
  const mutating = fixture(t);
  mutating.hook['dry-run'] = target => mutating.write(AUTHORITY, 'illegal dry-run mutation\n', target);
  assert.throws(() => mutating.produce(), /UNDECLARED_NATIVE_OUTPUT/);
  for (const phase of ['dry-run', 'write', 'projection', 'consumer']) {
    const f = fixture(t); f.hook[phase] = () => { throw Error(`OFFICIAL_${phase}_FAILED`); };
    assert.throws(() => f.produce(), new RegExp(`OFFICIAL_${phase}_FAILED`));
  }
});

test('denominator and projection outcome are required beyond a PASS label', t => {
  const f = fixture(t);
  f.hook.consumerResult = { status: 'PASS', counts: { changed: 1, checked: 0, passed: 0, skippedUnchanged: 0 },
    failures: [], unobservedFields: [], assignmentPending: [] };
  assert.throws(() => f.produce(), /CONSUMER_NOT_PASS/);
  const g = fixture(t); g.hook.result = (phase, result) => phase === 'projection' ? { ...result, consumerSearchStatus: 'NOT_RUN' } : result;
  assert.throws(() => g.produce(), /PROJECTION_NOT_VERIFIED/);
});

test('official KEEP counts are accepted only with complete per-request projection and Consumer denominators', t => {
  const f = fixture(t);
  f.hook.consumerResult = { status: 'PASS', counts: { changed: 0, checked: 0, passed: 0, skippedUnchanged: 1 },
    exams: [{ file: REQUEST, kind: 'reviewed-exam-v2', sourceFile: 'original/native.js', changed: 0, checked: 0, passed: 0, skippedUnchanged: 1 }],
    failures: [], unobservedFields: [], assignmentPending: [] };
  const proof = f.produce();
  assert.equal(f.validate(proof).reusable, true);
  f.hook.consumerResult.exams[0].sourceFile = 'original/other.js';
  const before = f.snapshot();
  assert.throws(() => f.validate(proof), /CONSUMER_NOT_PASS/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('a forged allowlist and refreshed output hashes cannot authorize an unrelated canonical file', t => {
  const f = fixture(t), proof = f.produce(), forged = copy(proof.nativePreview);
  const extra = 'archive/data/meta-foundation/canonical/unrelated.json'; f.write(extra, 'forged\n');
  forged.plans[0].plannedPaths.push(extra); forged.plans[0].plannedPaths.sort();
  forged.outputs.push({ path: extra, sha256: sha('forged\n'), sizeBytes: 7 }); forged.outputs.sort((a, b) => a.path.localeCompare(b.path));
  const before = f.snapshot();
  assert.throws(() => f.native(forged), /PLAN_MANIFEST_MISMATCH/);
  assert.deepEqual(f.snapshot(), before, 'failed shadow re-plan cannot mutate actual checkout');
  f.assertShadowsRemoved();
});

test('new native authority bytes must match official HEAD re-plan despite a rewritten manifest', t => {
  const f = fixture(t), proof = f.produce(), forged = copy(proof.nativePreview);
  const bytes = 'forged authority\n'; f.write(AUTHORITY, bytes);
  Object.assign(forged.outputs.find(r => r.path === AUTHORITY), { sha256: sha(bytes), sizeBytes: Buffer.byteLength(bytes) });
  const before = f.snapshot();
  assert.throws(() => f.native(forged), /NATIVE_AUTHORITY_OUTPUT_DRIFT/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('missing planned output and projection failure reject reuse without checkout mutation or leaked shadow', t => {
  const f = fixture(t), proof = f.produce(), missing = copy(proof.nativePreview);
  missing.outputs = missing.outputs.filter(r => r.path !== RECEIPT);
  let before = f.snapshot();
  assert.throws(() => f.native(missing), /OUTPUT_MANIFEST_MISMATCH/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
  f.hook.projection = () => { throw Error('PROJECTION_FAILED_DURING_REUSE'); };
  before = f.snapshot();
  assert.throws(() => f.validate(proof), /PROJECTION_FAILED_DURING_REUSE/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('shadow registration failure cleans independent files and never writes the real checkout', t => {
  const f = fixture(t), proof = f.produce(), before = f.snapshot();
  f.hook.afterWrite = target => { if (target !== f.root) throw Error('SHADOW_WRITE_FAILED'); };
  assert.throws(() => f.validate(proof), /SHADOW_WRITE_FAILED/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

function rendererAssetProofFixture(t) {
  const f = fixture(t, { otherOwner: false });
  const assets = ['archive/assets/renderer/그림 one.svg', 'archive/assets/renderer/nested/solution.png'];
  for (const file of assets) f.write(file, `prior reviewed bytes: ${file}\n`);
  f.git('add', '--', 'archive/assets'); f.git('commit', '-qm', 'prior renderer snapshot');
  const baseSha = f.git('rev-parse', 'HEAD');
  const refs = assets.map(file => {
    f.write(file, `current independently reviewed bytes: ${file}\n`);
    return { path: file, sha256: sha(fs.readFileSync(path.join(f.root, file))) };
  });
  f.write(EVIDENCE, json({ schemaVersion: 'fixture-exact-renderer-review-v1', assets: refs }));
  const evidenceRef = { path: EVIDENCE, sha256: sha(fs.readFileSync(path.join(f.root, EVIDENCE))) };
  f.request.approval.evidenceRefs = [evidenceRef]; f.request.items[0].evidenceRefs = [evidenceRef];
  f.write(REQUEST, json(f.request));
  f.git('add', '--', 'archive/assets', EVIDENCE, REQUEST); f.git('commit', '-qm', 'current renderer-bound request');
  const headSha = f.git('rev-parse', 'HEAD'), repo = 'owner/repository', observations = [];
  for (const phase of ['dry-run', 'write', 'projection']) f.hook[phase] = target => {
    const review = JSON.parse(fs.readFileSync(path.join(target, EVIDENCE), 'utf8'));
    for (const ref of review.assets) {
      const full = path.join(target, ref.path);
      if (!fs.existsSync(full) || sha(fs.readFileSync(full)) !== ref.sha256)
        throw Error('LIVE_RENDERER_BYTES_CHANGED');
      if (target !== f.root && fs.existsSync(path.join(f.root, ref.path)))
        assert.notEqual(fs.statSync(full).ino, fs.statSync(path.join(f.root, ref.path)).ino,
          'shadow assets must not share mutable inodes with the original checkout');
    }
    observations.push({ phase, target });
  };
  const options = { root: f.root, repo, expectedSha: headSha, runId: 41, runAttempt: 1, run: f.run,
    event: { number: 17, repository: { id: 101, full_name: repo }, pull_request: {
      base: { sha: baseSha, repo: { id: 101 } }, head: { sha: headSha, repo: { id: 101 } } } } };
  return { ...f, assets, refs, observations, options, baseSha, headSha,
    produce: () => producePrRegistrationProof(options),
    validate: proof => validateLocalRegistrationProof({ ...options, proof }),
    native: preview => validateNativePreview({ root: f.root, baseSha, headSha, preview, run: f.run, allowedGenerated: ALLOWED }) };
}

test('verify-local replays renderer-bound registration with exact HEAD assets in an independent shadow', t => {
  const f = rendererAssetProofFixture(t), proof = f.produce(), before = f.snapshot();
  assert.equal(proof.status, 'PASS');
  assert.equal(f.validate(proof).reusable, true);
  assert.ok(f.observations.some(row => row.target !== f.root && row.phase === 'dry-run'));
  assert.ok(f.observations.some(row => row.target !== f.root && row.phase === 'write'));
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('shadow restores immutable HEAD assets but never makes changed live renderer bytes acceptable', t => {
  const f = rendererAssetProofFixture(t), proof = f.produce();
  f.write(f.assets[0], 'unreviewed same-path mutation\n');
  const before = f.snapshot();
  assert.throws(() => f.native(proof.nativePreview), /LIVE_RENDERER_BYTES_CHANGED/);
  assert.ok(f.observations.some(row => row.target !== f.root && row.phase === 'write'),
    'the immutable shadow succeeds before live projection refuses the changed asset');
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('missing live renderer bytes still reject proof reuse after successful immutable shadow replay', t => {
  const f = rendererAssetProofFixture(t), proof = f.produce();
  fs.unlinkSync(path.join(f.root, f.assets[1]));
  const before = f.snapshot();
  assert.throws(() => f.native(proof.nativePreview), /LIVE_RENDERER_BYTES_CHANGED/);
  assert.ok(f.observations.some(row => row.target !== f.root && row.phase === 'write'));
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

function rendererLiveInputProofFixture(t, mutateEvidence) {
  const f = fixture(t, { otherOwner: false });
  const files = ['tools/check-reviewed-problem-renderer-browser.cjs', 'archive/engine.html',
    'apmath/css/student-navigation.css', 'archive/vendor/nanum-myeongjo/fixture.woff2'];
  const removed = 'tools/consumed-historical-helper.cjs', changed = 'tools/current-historical-helper.cjs';
  const unrelated = 'tools/unrelated-renderer.cjs';
  for (const file of [...files, removed, changed, unrelated]) f.write(file, `fixed synthetic input: ${file}\n`);
  f.git('add', '.'); f.git('commit', '-qm', 'exact renderer input references');
  const baseSha = f.git('rev-parse', 'HEAD');
  const ref = file => {
    const bytes = fs.readFileSync(path.join(f.root, file));
    return { commit: baseSha, path: file, gitBlobSha1: f.git('rev-parse', `${baseSha}:${file}`),
      sha256: sha(bytes), bytes: bytes.length };
  };
  const refs = files.map(ref), historicalRefs = [ref(removed), ref(changed)];
  const evidence = { schemaVersion: 'synthetic-live-ui-inputs-v1', captureHelperRef: refs[0],
    servedFiles: refs.slice(1), historicalRefs,
    unrelatedShortRef: { path: unrelated, sha256: ref(unrelated).sha256 } };
  mutateEvidence?.(evidence, f);
  f.write(changed, 'current HEAD bytes must win over the historical reference\n');
  fs.unlinkSync(path.join(f.root, removed));
  const changedSha = sha(fs.readFileSync(path.join(f.root, changed)));
  f.write(EVIDENCE, json(evidence));
  const evidenceRef = { path: EVIDENCE, sha256: sha(json(evidence)) };
  f.request.approval.evidenceRefs = [evidenceRef]; f.request.items[0].evidenceRefs = [evidenceRef];
  f.write(REQUEST, json(f.request)); f.git('add', '.'); f.git('commit', '-qm', 'renderer request and current historical paths');
  const headSha = f.git('rev-parse', 'HEAD'), repo = 'owner/repository', observations = [];
  for (const phase of ['dry-run', 'write', 'projection']) f.hook[phase] = target => {
    for (const input of refs) {
      const full = path.join(target, input.path);
      if (!fs.existsSync(full) || sha(fs.readFileSync(full)) !== input.sha256)
        throw Error('LIVE_UI_INPUT_BYTES_CHANGED');
      if (target !== f.root && fs.existsSync(path.join(f.root, input.path)))
        assert.notEqual(fs.statSync(full).ino, fs.statSync(path.join(f.root, input.path)).ino);
    }
    assert.equal(fs.existsSync(path.join(target, removed)), false, 'historical-only files stay in Git');
    assert.equal(sha(fs.readFileSync(path.join(target, changed))), changedSha, 'restore current HEAD, never old reference bytes');
    if (target !== f.root) assert.equal(fs.existsSync(path.join(target, unrelated)), false, 'unrelated and short refs are not adopted');
    observations.push({ phase, target });
  };
  const options = { root: f.root, repo, expectedSha: headSha, runId: 41, runAttempt: 1, run: f.run,
    event: { number: 17, repository: { id: 101, full_name: repo }, pull_request: {
      base: { sha: baseSha, repo: { id: 101 } }, head: { sha: headSha, repo: { id: 101 } } } } };
  return { ...f, files, refs, observations, options,
    produce: () => producePrRegistrationProof(options),
    validate: proof => validateLocalRegistrationProof({ ...options, proof }),
    native: preview => validateNativePreview({ root: f.root, baseSha, headSha, preview, run: f.run, allowedGenerated: ALLOWED }) };
}

test('shadow restores exact HEAD helper runtime and font refs from selected evidence only', t => {
  const f = rendererLiveInputProofFixture(t), proof = f.produce(), before = f.snapshot();
  assert.equal(proof.status, 'PASS'); assert.equal(f.validate(proof).reusable, true);
  assert.ok(f.observations.some(row => row.target !== f.root && row.phase === 'dry-run'));
  assert.ok(f.observations.some(row => row.target !== f.root && row.phase === 'write'));
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

for (const [name, mutate] of [
  ['same-size runtime drift', f => {
    const file = path.join(f.root, f.files[1]), bytes = fs.readFileSync(file); bytes[0] ^= 1; fs.writeFileSync(file, bytes);
  }],
  ['missing live helper', f => fs.unlinkSync(path.join(f.root, f.files[0]))],
]) test(`shadow UI input restoration cannot approve ${name}`, t => {
  const f = rendererLiveInputProofFixture(t), proof = f.produce(); mutate(f); const before = f.snapshot();
  assert.throws(() => f.native(proof.nativePreview), /LIVE_UI_INPUT_BYTES_CHANGED/);
  assert.ok(f.observations.some(row => row.target !== f.root && row.phase === 'write'),
    'exact HEAD shadow succeeds before the unchanged live registrar guard rejects drift');
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('shadow UI input restoration preserves an official registrar refusal', t => {
  const f = rendererLiveInputProofFixture(t), proof = f.produce(), before = f.snapshot();
  f.hook['dry-run'] = target => { if (target !== f.root) throw Error('FULL_NATIVE_REFUSED'); };
  assert.throws(() => f.validate(proof), /FULL_NATIVE_REFUSED/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('shadow UI input restoration refuses unsafe declared reference paths', t => {
  const f = rendererLiveInputProofFixture(t, evidence => {
    evidence.extraRef = { ...evidence.captureHelperRef, path: '../outside-workspace' };
  }), proof = f.produce(), before = f.snapshot();
  assert.throws(() => f.native(proof.nativePreview), /UNSAFE_PATH/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('shadow UI input restoration refuses a tracked symlink reference', t => {
  const f = rendererLiveInputProofFixture(t, (evidence, fixture) => {
    const file = 'tools/symlink-input.cjs';
    fs.symlinkSync('check-reviewed-problem-renderer-browser.cjs', path.join(fixture.root, file));
    evidence.extraRef = { ...evidence.captureHelperRef, path: file };
  }), proof = f.produce(), before = f.snapshot();
  assert.throws(() => f.native(proof.nativePreview), /SHADOW_REFERENCE_NOT_REGULAR/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('post-state replay does not replace the initial official output plan with an empty list', t => {
  const f = fixture(t), proof = f.produce(), requests = f.selected();
  assert.deepEqual(applyNativeRequests({ root: f.root, requests, run: f.run }), [
    { requestPath: REQUEST, replay: true, plannedPaths: [] },
  ]);
  const forged = copy(proof.nativePreview); forged.plans[0] = { requestPath: REQUEST, replay: true, plannedPaths: [] };
  forged.outputs = [];
  const before = f.snapshot();
  assert.throws(() => f.native(forged), /PLAN_MANIFEST_MISMATCH/);
  assert.equal(f.validate(proof).reusable, true);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});


function laterCodePush(f) {
  const baseSha = f.git('rev-parse', 'HEAD');
  f.write('tests/unrelated-code.test.js', '// subsequent code push while the native writer is pending\n');
  f.git('add', '--', 'tests/unrelated-code.test.js'); f.git('commit', '-qm', 'later code-only push');
  const headSha = f.git('rev-parse', 'HEAD');
  return { root: f.root, eventName: 'push', event: { before: baseSha, after: headSha }, expectedSha: headSha, run: f.run };
}

function laterCodePr(f) {
  const baseSha=f.git('rev-parse','HEAD');
  // This checker change ordinarily needs no archive materialization. An exact
  // inherited preservation still has to supply a coherent temporary receipt.
  f.write(CI_WORKFLOW_PATH,'// subsequent code-only PR while registration is pending\n');
  f.git('add','--',CI_WORKFLOW_PATH);f.git('commit','-qm','later code-only PR');
  const headSha=f.git('rev-parse','HEAD'),repo='owner/repository';
  return {root:f.root,repo,event:{number:17,repository:{id:101,full_name:repo},pull_request:{
    number:17,base:{sha:baseSha,repo:{id:101}},head:{sha:headSha,repo:{id:101}}}},
    expectedSha:headSha,runId:41,runAttempt:1,run:f.run};
}

const PRIOR_NATIVE = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/previous-native.json';
const NATIVE_RUNTIME = 'archive/data/meta-foundation/runtime/middle-geometry-v1.json';
function fingerprintReassessmentFixture(t, { mutateRequest, mutateBaseline } = {}) {
  const f = fixture(t, { partial: true, otherOwner: false });
  const record = { questionUid: 'fixture', sourceArchiveFile: 'original/native.js', sourceOrdinal: 5,
    sourceFingerprint: 'a'.repeat(64), contentFingerprint: 'b'.repeat(64),
    metadataApprovalType: 'FINAL_QA', metadataStatus: 'approved_semantic_review', metaFoundationStatus: 'ACTIVE',
    defaultSelectable: true, standardUnitKey: 'M2-06', subUnitKey: 'M2-06-PARALLEL_LENGTH_RATIO',
    problemTypeKey: 'PT_QUADRILATERAL_PROPERTIES', templateKey: 'TPL_FIXED', level: '중',
    fieldStatus: { problemType: 'approved_final_qa', template: 'approved_final_qa' },
    metadataRevision: 'previous-native', approvalEvidence: [PRIOR_NATIVE] };
  const identity = { questionUid: 'fixture', sourceArchiveFile: record.sourceArchiveFile, sourceOrdinal: 5,
    sourceFingerprint: record.sourceFingerprint };
  const runtimeRecord = { ...copy(record), approvedSourceFingerprint: record.sourceFingerprint, runtimeSelectable: true };
  const metadata = { records: [copy(record)] }, identities = { records: [copy(identity)] };
  const runtime = { status: 'ACTIVE', records: [copy(runtimeRecord)], generatedFrom: { 'reviewedExam_previous-native': PRIOR_NATIVE } };
  const prior = { schemaVersion: 'archive-reviewed-exam-meta-registration-v2', requestId: 'previous-native',
    sourceArchiveFile: record.sourceArchiveFile, approval: { type: 'FINAL_QA', metadataReviewed: true,
      evidenceRefs: copy(f.request.approval.evidenceRefs) },
    metadataRegistrationStatus: 'REGISTERED', totalQuestions: 1, expectedQuestionCount: 24, scope: 'PARTIAL_UIDS', partialUidCount: 1,
    appliedRecords: [copy(record)], appliedIdentityRecords: [copy(identity)], runtimeRecords: [copy(runtimeRecord)],
    outputDigests: [{ path: NATIVE_RUNTIME, sha256: sha(json(runtime)) }] };
  mutateBaseline?.({ metadata, identities, runtime, prior });
  f.write(META, json(metadata)); f.write(IDENTITY, json(identities)); f.write(NATIVE_RUNTIME, json(runtime));
  f.write(PRIOR_NATIVE, json(prior));
  const priorRef = { path: PRIOR_NATIVE, sha256: sha(json(prior)) };
  Object.assign(f.request.approval, { metadataReviewed: true, approvedBy: 'current source reviewer',
    evidenceRefs: [...f.request.approval.evidenceRefs, priorRef] });
  Object.assign(f.request.items[0], { before: { sourceFingerprint: record.sourceFingerprint, contentFingerprint: record.contentFingerprint },
    after: { sourceFingerprint: 'c'.repeat(64), contentFingerprint: 'd'.repeat(64) },
    identityBefore: { sourceFingerprint: record.sourceFingerprint },
    sourceReview: { schemaVersion: 'archive-reviewed-source-reassessment-v1', reviewCommit: f.headSha,
      reviewPath: EVIDENCE, reviewRef: copy(f.request.approval.evidenceRefs[0]) },
    evidenceRefs: copy(f.request.approval.evidenceRefs) });
  mutateRequest?.(f.request);
  f.write(REQUEST, json(f.request)); f.git('add', '.'); f.git('commit', '-qm', 'existing approval and pending fingerprint-only source review');
  const options = laterCodePr(f);
  const select = () => selectNativeRequests({ root: f.root, baseSha: options.event.pull_request.base.sha, headSha: options.expectedSha });
  return { ...f, options, select, prior };
}

test('an inherited fingerprint-only current source review is limited to exact existing native approval rows', t => {
  const f = fingerprintReassessmentFixture(t), selected = f.select();
  assert.equal(selected.length, 1);
  assert.equal(selected[0].questionCount, 1); assert.equal(selected[0].sourceQuestionCount, 24);
  assert.deepEqual(selected[0].inheritedFingerprintReassessment.priorReceiptRef,
    { path: PRIOR_NATIVE, sha256: sha(json(f.prior)) });
  assert.equal(selected[0].inheritedFingerprintReassessment.headSha, f.options.expectedSha);
  assert.equal(selected[0].inheritedFingerprintReassessment.runtimePath, NATIVE_RUNTIME);
  assert.equal(f.calls.length, 0, 'selection alone cannot approve or register current source');
});

for (const [name, mutateRequest] of [
  ['a semantic after value', r => { r.items[0].after.templateKey = 'TPL_NEW'; }],
  ['a semantic before value', r => { r.items[0].before.level = '중'; }],
  ['a registry addition', r => { r.registryChanges = [{ before: null }]; }],
  ['missing current sourceReview', r => { delete r.items[0].sourceReview; }],
  ['an additional review opt-in', r => { r.items[0].sourceReview.retainedFields = ['templateKey']; }],
  ['a separate fingerprint rebind', r => { r.items[0].rebind = {}; }],
  ['another approval type', r => { r.approval.type = 'REVIEW2'; }],
  ['no prior native approval evidence', r => { r.approval.evidenceRefs = r.approval.evidenceRefs.slice(0, 1); }],
]) test(`inherited reassessment cannot adopt ${name}`, t => {
  const f = fingerprintReassessmentFixture(t, { mutateRequest });
  assert.deepEqual(f.select(), []); assert.equal(f.calls.length, 0);
});

for (const [name, mutateBaseline] of [
  ['metadata value drift', x => { x.metadata.records[0].templateKey = 'TPL_OTHER'; }],
  ['identity drift', x => { x.identities.records[0].sourceFingerprint = 'f'.repeat(64); }],
  ['runtime value drift', x => { x.runtime.records[0].level = '상'; }],
  ['a newly unapproved UID', x => { x.prior.appliedRecords[0].questionUid = 'other-uid'; }],
  ['an incorrect source ordinal', x => { x.prior.appliedRecords[0].sourceOrdinal = 6; }],
]) test(`inherited reassessment rejects ${name} before any writer runs`, t => {
  const f = fingerprintReassessmentFixture(t, { mutateBaseline });
  assert.throws(f.select, /INHERITED_REASSESSMENT_EXISTING_APPROVAL/);
  assert.equal(f.calls.length, 0);
});

test('inherited reassessment rejects the wrong runtime receipt, denominator and prior receipt digest', t => {
  const runtime = fingerprintReassessmentFixture(t, { mutateBaseline: x => { x.runtime.generatedFrom = {}; } });
  assert.throws(runtime.select, /INHERITED_REASSESSMENT_RUNTIME_BINDING/);
  const denominator = fingerprintReassessmentFixture(t, { mutateBaseline: x => { x.prior.expectedQuestionCount = 23; } });
  assert.throws(denominator.select, /INHERITED_REASSESSMENT_PRIOR_SCOPE/);
  const digest = fingerprintReassessmentFixture(t, { mutateRequest: r => { r.approval.evidenceRefs[1].sha256 = 'f'.repeat(64); } });
  assert.throws(digest.select, /INHERITED_REASSESSMENT_RECEIPT_DRIFT/);
});

function reassessmentRunner(f, { mutateApproved, mutateIdentity, mutateRuntime, refuseReview = false } = {}) {
  const read = (target, file) => JSON.parse(fs.readFileSync(path.join(target, file), 'utf8'));
  return (program, args, target = f.root) => {
    if (args[0]?.endsWith('/register-reviewed-exam-meta-source.mjs')) {
      assert.equal(args[args.indexOf('--request') + 1], REQUEST);
      if (refuseReview) throw Error('OFFICIAL_CURRENT_SOURCE_REVIEW_REFUSED');
      const request = read(target, REQUEST), replay = fs.existsSync(path.join(target, RECEIPT));
      const projection = args.includes('--verify-projection');
      if (projection) assert.equal(replay, true);
      const plannedPaths = replay ? [] : [META, IDENTITY, NATIVE_RUNTIME, RECEIPT].sort();
      if (args.includes('--write') && !replay) {
        const metadata = read(target, META), row = metadata.records[0];
        Object.assign(row, request.items[0].after, { metadataRevision: 'current-reviewed-source', approvalEvidence: [PRIOR_NATIVE, RECEIPT] });
        mutateApproved?.(row);
        const identity = read(target, IDENTITY); identity.records[0].sourceFingerprint = row.sourceFingerprint;
        const runtime = read(target, NATIVE_RUNTIME); Object.assign(runtime.records[0], row, { approvedSourceFingerprint: row.sourceFingerprint });
        mutateIdentity?.(identity.records[0]); mutateRuntime?.(runtime.records[0]);
        f.write(META, json(metadata), target); f.write(IDENTITY, json(identity), target); f.write(NATIVE_RUNTIME, json(runtime), target);
        f.write(RECEIPT, json({ schemaVersion: 'archive-reviewed-exam-meta-registration-v2', requestId: request.requestId,
          approval: { type: 'FINAL_QA' }, sourceArchiveFile: request.sourceArchiveFile,
          sourceBlobSha1: request.expectedSourceBlobSha1, sourceRawSha256: sha(fs.readFileSync(path.join(target, SOURCE))),
          scope: 'PARTIAL_UIDS', totalQuestions: 1, partialUidCount: 1, expectedQuestionCount: 24,
          appliedRecords: copy(metadata.records), appliedIdentityRecords: copy(identity.records), runtimeRecords: copy(runtime.records) }), target);
      }
      return json({ status: 'PASS', requestId: request.requestId, totalQuestions: 1, replay,
        scope: 'PARTIAL_UIDS', partialUidCount: 1, expectedQuestionCount: 24, plannedPaths,
        consumerSearchStatus: projection ? 'STATIC_VALUES_VERIFIED' : 'NOT_RUN' });
    }
    return f.run(program, args, target);
  };
}

test('fingerprint-only inherited preview still requires official source review, projection, Consumer and immutable replay', t => {
  const f = fingerprintReassessmentFixture(t), options = { ...f.options, run: reassessmentRunner(f) };
  const proof = producePrRegistrationProof(options);
  assert.equal(proof.status, 'PASS');
  assert.ok(proof.nativePreview.requests[0].inheritedFingerprintReassessment);
  const current = JSON.parse(fs.readFileSync(path.join(f.root, META), 'utf8')).records[0];
  assert.equal(current.templateKey, f.prior.appliedRecords[0].templateKey);
  assert.equal(current.metadataApprovalType, 'FINAL_QA');
  assert.equal(current.sourceFingerprint, 'c'.repeat(64));
  const before = f.snapshot(); assert.equal(validateLocalRegistrationProof({ ...options, proof }).reusable, true);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
  const refused = fingerprintReassessmentFixture(t);
  assert.throws(() => producePrRegistrationProof({ ...refused.options, run: reassessmentRunner(refused, { refuseReview: true }) }),
    /OFFICIAL_CURRENT_SOURCE_REVIEW_REFUSED/);
  assert.equal(fs.existsSync(path.join(refused.root, RECEIPT)), false);
});

for (const [name, mutateApproved] of [
  ['classification', row => { row.templateKey = 'TPL_UNREVIEWED'; }],
  ['difficulty', row => { row.level = '상'; }],
  ['approval type', row => { row.metadataApprovalType = 'REVIEW2'; }],
  ['old approval evidence', row => { row.approvalEvidence = [RECEIPT]; }],
]) test(`fingerprint-only inherited preview rejects a writer changing ${name}`, t => {
  const f = fingerprintReassessmentFixture(t);
  assert.throws(() => producePrRegistrationProof({ ...f.options, run: reassessmentRunner(f, { mutateApproved }) }),
    /INHERITED_REASSESSMENT_CHANGED_APPROVAL_VALUES/);
});

for (const [name, options, expected] of [
  ['a foreign identity field', { mutateIdentity: row => { row.foreignBinding = 'unreviewed'; } }, /CHANGED_IDENTITY_VALUES/],
  ['runtime classification', { mutateRuntime: row => { row.templateKey = 'TPL_UNREVIEWED'; } }, /CHANGED_RUNTIME_VALUES/],
  ['runtime difficulty', { mutateRuntime: row => { row.level = '상'; } }, /CHANGED_RUNTIME_VALUES/],
  ['runtime readiness', { mutateRuntime: row => { row.runtimeSelectable = false; } }, /CHANGED_RUNTIME_VALUES/],
]) test(`fingerprint-only inherited preview also rejects ${name}`, t => {
  const f = fingerprintReassessmentFixture(t);
  assert.throws(() => producePrRegistrationProof({ ...f.options, run: reassessmentRunner(f, options) }), expected);
});

test('fingerprint-only preservation is rechecked after projection and Consumer, not only after writing', t => {
  const f = fingerprintReassessmentFixture(t);
  f.hook.consumer = target => {
    const metadata = JSON.parse(fs.readFileSync(path.join(target, META), 'utf8'));
    const issued = JSON.parse(fs.readFileSync(path.join(target, RECEIPT), 'utf8'));
    metadata.records[0].templateKey = 'TPL_LATE_CHANGE'; issued.appliedRecords[0].templateKey = 'TPL_LATE_CHANGE';
    f.write(META, json(metadata), target); f.write(RECEIPT, json(issued), target);
  };
  assert.throws(() => producePrRegistrationProof({ ...f.options, run: reassessmentRunner(f) }), /CHANGED_APPROVAL_VALUES/);
});

test('code-only PR preserves an exact inherited partial FINAL_QA approval through the official projection and Consumer',t=>{
  const f=fixture(t,{partial:true,finalQaPreservation:true}),options=laterCodePr(f);
  const baseSha=options.event.pull_request.base.sha,headSha=options.expectedSha;
  const beforeRequest=fs.readFileSync(path.join(f.root,REQUEST)),other=fs.readFileSync(path.join(f.root,OTHER));
  const selected=selectNativeRequests({root:f.root,baseSha,headSha});
  assert.deepEqual(selected.map(r=>r.path),[REQUEST]);
  assert.deepEqual(selected[0].inheritedPreservation,{baseSha,requestSha256:sha(beforeRequest)});
  assert.equal(selected[0].kind,'native-approval-preservation');
  assert.equal(selected[0].questionCount,1);assert.equal(selected[0].sourceQuestionCount,24);
  const proof=producePrRegistrationProof(options);
  assert.equal(proof.preparation.state,'PREPARED');assert.deepEqual(proof.nativePreview.requests,selected);
  assert.deepEqual(proof.nativePreview.checks.find(c=>c.id==='native-consumer').preservedNativeApprovals,
    {requests:1,preservedMetadataApprovals:1,newMetadataApprovals:0,approvalTypes:['FINAL_QA']});
  assert.equal(validateLocalRegistrationProof({...options,proof}).reusable,true);
  assert.deepEqual(fs.readFileSync(path.join(f.root,REQUEST)),beforeRequest,'preview never consumes the inherited request');
  assert.deepEqual(fs.readFileSync(path.join(f.root,OTHER)),other,'unrelated inherited requests stay untouched');
  assert.equal(f.git('rev-parse','HEAD'),headSha);f.assertShadowsRemoved();
});

for(const [name,mutate]of [
  ['a nonempty semantic before',r=>{r.items[0].before={templateKey:'OLD'};}],
  ['a nonempty semantic after',r=>{r.items[0].after={templateKey:'NEW'};}],
  ['registry additions',r=>{r.registryChanges=[{path:AUTHORITY,after:{status:'ACTIVE'}}];}],
  ['full-exam scope',r=>{delete r.scope;}],
  ['another approval type',r=>{r.approval.type='REVIEW2';}],
  ['an unreviewed approval',r=>{r.approval.metadataReviewed=false;}],
  ['an audit dependency',r=>{r.approval.sourceRebind.schemaVersion='archive-native-audit-preservation-v1';}],
  ['an item fingerprint repair',r=>{r.items[0].rebind={priorSourceBlobSha1:'a'.repeat(40)};}],
  ['an item source reassessment',r=>{r.items[0].sourceReview={reviewCommit:'a'.repeat(40)};}],
  ['identity-only mode',r=>{r.registrationMode='IDENTITY_FINGERPRINT_ONLY';}],
])test(`code-only PR does not adopt inherited preservation with ${name}`,t=>{
  const f=fixture(t,{partial:true,finalQaPreservation:true,mutateRequest:mutate}),options=laterCodePr(f);
  assert.deepEqual(selectNativeRequests({root:f.root,baseSha:options.event.pull_request.base.sha,headSha:options.expectedSha}),[]);
  assert.equal(f.calls.filter(c=>c.program!=='git').length,0);
});

test('inherited preservation rejects working-copy request drift and a changed source snapshot',t=>{
  const f=fixture(t,{partial:true,finalQaPreservation:true}),options=laterCodePr(f);
  const select=()=>selectNativeRequests({root:f.root,baseSha:options.event.pull_request.base.sha,headSha:options.expectedSha});
  const original=fs.readFileSync(path.join(f.root,REQUEST));
  f.write(REQUEST,original.toString()+'\n');assert.throws(select,/REQUEST_NOT_FIXED/);f.write(REQUEST,original);
  f.write(SOURCE,fs.readFileSync(path.join(f.root,SOURCE),'utf8')+'\n');
  f.git('add','--',SOURCE);f.git('commit','-qm','later source change without a reviewed rebind');
  options.expectedSha=f.git('rev-parse','HEAD');
  assert.throws(select,/SOURCE_NOT_FIXED/);assert.equal(f.calls.filter(c=>c.program!=='git').length,0);
});

test('changed preservation keeps ordinary changed-input ownership and cannot masquerade as inherited',t=>{
  const f=fixture(t,{partial:true,finalQaPreservation:true}),options=laterCodePr(f);
  f.write(REQUEST,json({...f.request,items:f.request.items.map(item=>({...item,reason:'changed request input'}))}));
  f.git('add','--',REQUEST);f.git('commit','-qm','changed preservation input');
  const selected=selectNativeRequests({root:f.root,baseSha:options.event.pull_request.base.sha,headSha:f.git('rev-parse','HEAD')});
  assert.deepEqual(selected.map(r=>r.path),[REQUEST]);assert.equal(selected[0].inheritedPreservation,undefined);
});

test('working-copy forgery and deleted inherited requests cannot expand the fixed preservation selection',t=>{
  const ordinary=fixture(t,{partial:true}),ordinaryPr=laterCodePr(ordinary),forged=copy(ordinary.request);
  Object.assign(forged.approval,{type:'FINAL_QA',metadataReviewed:true,approvedBy:'forged local dispatcher',
    sourceRebind:{priorReceiptRef:forged.approval.evidenceRefs[0]}});
  Object.assign(forged.items[0],{before:{},after:{}});ordinary.write(REQUEST,json(forged));
  ordinary.write('.archive-meta-register/inbox/untracked-preservation.json',json({...forged,requestId:'untracked'}));
  assert.deepEqual(selectNativeRequests({root:ordinary.root,baseSha:ordinaryPr.event.pull_request.base.sha,headSha:ordinaryPr.expectedSha}),[]);
  const preserved=fixture(t,{partial:true,finalQaPreservation:true}),preservedPr=laterCodePr(preserved);
  fs.unlinkSync(path.join(preserved.root,REQUEST));
  assert.throws(()=>selectNativeRequests({root:preserved.root,baseSha:preservedPr.event.pull_request.base.sha,headSha:preservedPr.expectedSha}),/ENOENT/);
  preserved.git('add','--',REQUEST);preserved.git('commit','-qm','remove the inherited request');
  assert.deepEqual(selectNativeRequests({root:preserved.root,baseSha:preservedPr.event.pull_request.base.sha,headSha:preserved.git('rev-parse','HEAD')}),[]);
  assert.equal([...ordinary.calls,...preserved.calls].filter(c=>c.program!=='git').length,0);
});

test('inherited preservation cannot bypass an official registrar refusal or claim a new approval',t=>{
  const f=fixture(t,{partial:true,finalQaPreservation:true}),options=laterCodePr(f);
  f.hook['dry-run']=()=>{throw Error('FIXTURE_SELECTED_QUESTION_CHANGED');};
  assert.throws(()=>producePrRegistrationProof(options),/SELECTED_QUESTION_CHANGED/);
  assert.equal(f.calls.filter(c=>c.args.includes('--write')).length,0);
  delete f.hook['dry-run'];f.hook.result=(_phase,result)=>({...result,newMetadataApprovals:1});
  assert.throws(()=>producePrRegistrationProof(options),/DRY_RUN_NOT_PASS/);
  assert.equal(f.calls.filter(c=>c.args.includes('--write')).length,0);
});

test('main code-only push applies the fixed pending inbox then checks projection and typed Consumer without consuming it', t => {
  const f = fixture(t, { partial: true, otherOwner: false });
  const options = laterCodePush(f), headSha = options.expectedSha;
  assert.deepEqual(selectNativeRequests({ root: f.root, baseSha: options.event.before, headSha }), [],
    'the same code-only PR still owns no unchanged request');
  const requests = selectPendingNativeRequests({ root: f.root, headSha });
  assert.deepEqual(requests.map(r => r.path), [REQUEST]);
  assert.equal(requests[0].questionCount, 1); assert.equal(requests[0].sourceQuestionCount, 24);
  const input = fs.readFileSync(path.join(f.root, REQUEST)), phases = [];
  f.hook.result = (phase, result) => { phases.push(phase); return result; };
  f.hook.projection = target => assert.equal(JSON.parse(fs.readFileSync(path.join(target, 'archive/data/archive2-catalog.json'))).projection, 'new');
  const result = preparePrRegistration(options);
  assert.equal(result.state, 'PREPARED');
  assert.deepEqual(result.pendingRequestPaths, [REQUEST]);
  assert.deepEqual(result.nativePreview.requests, requests);
  assert.deepEqual(result.nativePreview.checks.map(c => c.id), ['native-projection', 'native-consumer']);
  assert.deepEqual(phases, ['dry-run', 'write', 'projection']);
  assert.ok(result.nativePreview.outputs.some(r => r.path === RECEIPT));
  assert.deepEqual(fs.readFileSync(path.join(f.root, REQUEST)), input, 'only the production writer consumes inbox files');
  assert.equal(f.git('rev-parse', 'HEAD'), headSha, 'temporary verification creates no commit');
});

test('main pending inventory is exact HEAD, excluding later untracked and nested inbox files', t => {
  const f = fixture(t, { otherOwner: false });
  f.write('.archive-meta-register/inbox/untracked.json', json({ schemaVersion: NATIVE_REQUEST_SCHEMA }));
  f.write('.archive-meta-register/inbox/nested/child.json', '{}');
  assert.deepEqual(pendingNativeRequestPaths({ root: f.root, headSha: f.headSha }), [REQUEST]);
  assert.deepEqual(selectPendingNativeRequests({ root: f.root, headSha: f.headSha }).map(r => r.path), [REQUEST]);
  assert.throws(() => pendingNativeRequestPaths({ root: f.root, headSha: 'main' }), /PENDING_SNAPSHOT_SHA/);
  f.write(REQUEST, json({ ...f.request, requestId: 'uncommitted-replacement' }));
  assert.throws(() => selectPendingNativeRequests({ root: f.root, headSha: f.headSha }), /REQUEST_NOT_FIXED/);
});

test('unknown pending main schemas fail before any write while unchanged other-owner PR isolation remains intact', t => {
  const f = fixture(t), options = laterCodePush(f);
  assert.deepEqual(selectNativeRequests({ root: f.root, baseSha: options.event.before, headSha: options.expectedSha }), []);
  assert.throws(() => preparePrRegistration(options), /PENDING_SCHEMA_UNSUPPORTED/);
  assert.equal(f.calls.filter(c => c.program !== 'git').length, 0);
  assert.equal(fs.existsSync(path.join(f.root, RECEIPT)), false);
});

test('pending main requests reject missing or stale committed source and immutable evidence', t => {
  for (const variant of ['missing-source', 'changed-source', 'changed-evidence']) {
    const f = fixture(t, { otherOwner: false });
    if (variant === 'missing-source') f.git('rm', '--', SOURCE);
    else f.write(variant === 'changed-source' ? SOURCE : EVIDENCE, variant === 'changed-source' ? 'window.questions=[{id:1,changed:true}];' : '{"changed":true}');
    f.git('add', '-u'); f.git('commit', '-qm', variant);
    const options = laterCodePush(f);
    assert.throws(() => preparePrRegistration(options), /MISSING_FILE|SOURCE_NOT_FIXED|EVIDENCE_DRIFT/, variant);
    assert.equal(f.calls.filter(c => c.program !== 'git').length, 0, variant);
  }
});

test('main temporary preview rejects actual projection and Consumer failures rather than continuing the suite', t => {
  for (const failure of ['projection', 'consumer']) {
    const f = fixture(t, { otherOwner: false }), options = laterCodePush(f);
    if (failure === 'projection') f.hook.result = (phase, result) => phase === 'projection' ? { ...result, consumerSearchStatus: 'NOT_RUN' } : result;
    else f.hook.consumerResult = { status: 'FAIL', counts: {}, failures: ['consumer defect'] };
    assert.throws(() => preparePrRegistration(options), failure === 'projection' ? /PROJECTION_NOT_VERIFIED/ : /CONSUMER_NOT_PASS/);
    assert.equal(f.git('rev-parse', 'HEAD'), options.expectedSha);
    assert.equal(fs.existsSync(path.join(f.root, REQUEST)), true);
  }
});

test('main pending audit subset keeps the full D5 dependency and its established order', t => {
  const f = fixture(t, { partial: true, auditPreservation: true, pairedDifficulty: true, otherOwner: false });
  const options = laterCodePush(f), selected = selectPendingNativeRequests({ root: f.root, headSha: options.expectedSha });
  assert.deepEqual(selected.map(r => r.path), [DIFFICULTY_REQUEST, REQUEST]);
  assert.equal(selected[0].questionCount, 24); assert.equal(selected[1].questionCount, 1);
  const result = preparePrRegistration(options);
  assert.equal(result.state, 'PREPARED');
  assert.equal(result.nativePreview.checks[1].preservedNativeApprovals.newMetadataApprovals, 0);
});

test('main fixed pending snapshot preserves exact basic-before-D5 order and zero new approvals',t=>{
  const f=fixture(t,{partial:true,basicPreservation:true,pairedDifficulty:true,otherOwner:false});
  const options=laterCodePush(f),selected=selectPendingNativeRequests({root:f.root,headSha:options.expectedSha});
  assert.deepEqual(selected.map(r=>r.path),[REQUEST,DIFFICULTY_REQUEST]);
  assert.equal(selected[0].kind,'basic-approval-preservation');
  assert.equal(selected[0].questionCount,1);assert.equal(selected[0].sourceQuestionCount,24);
  const result=preparePrRegistration(options);assert.equal(result.state,'PREPARED');
  assert.equal(result.nativePreview.checks[1].preservedBasicApprovals.newMetadataApprovals,0);
  assert.equal(result.nativePreview.checks[1].preservedBasicApprovals.advancedApprovals,0);
  assert.equal(f.git('rev-parse','HEAD'),options.expectedSha);
  assert.ok(fs.existsSync(path.join(f.root,REQUEST))&&fs.existsSync(path.join(f.root,DIFFICULTY_REQUEST)));
});

const newBasicPreviewFixture = t => fixture(t, { partial: true, basicPreservation: true, pairedDifficulty: true,
  mutateRequest: r => { r.approval.sourceReview.schemaVersion = 'archive-reviewed-native-basic-parent-v1'; } });
test('new BASIC parent is explicitly counted and ordered before its exact separate difficulty input', t => {
  const f = newBasicPreviewFixture(t), selected = f.selected(), basic = selected.find(r => r.kind === 'basic-parent-registration');
  assert.equal(basic.questionCount, 1); assert.equal(basic.sourceQuestionCount, 24); assert.equal(basic.basicPreservation.newBasicParent, true);
  assert.deepEqual(orderNativeRequests([...selected].reverse()).map(r => r.path), [REQUEST, DIFFICULTY_REQUEST]);
  const proof = f.produce();
  const stage = proof.nativePreview.checks.find(s => s.id === 'native-consumer');
  assert.deepEqual(stage.newBasicParentApprovals, { requests: 1, newBasicParentApprovals: 1, preservedMetadataApprovals: 0, advancedApprovals: 0 });
  assert.equal(stage.preservedBasicApprovals, undefined);
});
test('new BASIC preview refuses a preservation label, unknown subtype, or unbound D5 predecessor', t => {
  const f = newBasicPreviewFixture(t), selected = f.selected(), basic = selected.find(r => r.kind === 'basic-parent-registration');
  basic.kind = 'basic-approval-preservation'; assert.throws(() => orderNativeRequests(selected), /BASIC_PRESERVATION_SCOPE/);
  const g = newBasicPreviewFixture(t), requests = g.selected(), d5 = requests.find(r => r.kind === 'difficulty5-ratings');
  d5.difficultyBeforeBindings[0].contentFingerprint = 'f'.repeat(64); assert.throws(() => orderNativeRequests(requests), /BASIC_DEPENDENCY_FINGERPRINT/);
  const h = fixture(t, { basicPreservation: true, mutateRequest: r => { r.approval.sourceReview.schemaVersion = 'archive-reviewed-native-basic-parent-v2'; } });
  assert.throws(h.selected, /BASIC_PRESERVATION_SCOPE/);
});
test('new BASIC proof rejects false preserved counts, advanced approval, and unchecked parent in Consumer', t => {
  for (const change of [r => { r.newBasicParentApprovals = 0; }, r => { r.preservedMetadataApprovals = 1; }, r => { r.advancedApprovals = 1; }]) {
    const f = newBasicPreviewFixture(t); f.hook.result = (phase, result) => { change(result); return result; };
    assert.throws(() => applyNativeRequests({ root: f.root, requests: f.selected(), run: f.run }), /DRY_RUN_NOT_PASS/);
  }
  const f = newBasicPreviewFixture(t), requests = f.selected(); applyNativeRequests({ root: f.root, requests, run: f.run });
  const output = JSON.parse(f.run(process.execPath, ['archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs']));
  output.exams[0].approvalCreated = false; f.hook.consumerResult = output;
  assert.throws(() => verifyNativeRequests({ root: f.root, requests, run: f.run }), /CONSUMER_NOT_PASS/);
});

// Ancestor proof closure regression: preserving existing native approvals does not
// infer a new approval or select another pending request.
function ancestralEvidenceFixture(t, { mutateLeafRef, missingLeaf = false, cycle = false } = {}) {
  const f = fixture(t, { partial: true, finalQaPreservation: true, otherOwner: false });
  const leafPath = '.archive-meta-register/evidence/ancestor-native-review.json';
  const priorPath = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/prior.json';
  const ancestorPath = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/ancestor.json';
  const unrelatedPath = '.archive-meta-register/evidence/unrelated-owner.json';
  const leafBytes = json({ reviewed: 'immutable fixture evidence' });
  const leafRef = { path: leafPath, sha256: sha(leafBytes) };
  mutateLeafRef?.(leafRef);
  if (!missingLeaf) f.write(leafPath, leafBytes);
  f.write(unrelatedPath, json({ unrelated: true }));
  const ancestorBytes = json({ schemaVersion: 'archive-reviewed-exam-meta-registration-v2',
    approval: { evidenceRefs: cycle ? [{ path: priorPath, sha256: '0'.repeat(64) }] : [leafRef] } });
  const ancestorRef = { path: ancestorPath, sha256: sha(ancestorBytes) };
  f.write(ancestorPath, ancestorBytes);
  const priorBytes = json({ schemaVersion: 'archive-reviewed-exam-meta-registration-v2',
    approval: { evidenceRefs: [ancestorRef, leafRef] } });
  const priorRef = { path: priorPath, sha256: sha(priorBytes) };
  f.write(priorPath, priorBytes);
  f.request.approval.evidenceRefs = [priorRef];
  f.request.approval.sourceRebind.priorReceiptRef = priorRef;
  f.request.items[0].evidenceRefs = [priorRef];
  f.write(REQUEST, json(f.request));
  f.git('add', '.'); f.git('commit', '-qm', 'fixed transitive native receipt evidence');
  const headSha = f.git('rev-parse', 'HEAD'), repo = 'owner/repository';
  const event = { number: 17, repository: { id: 101, full_name: repo }, pull_request: {
    number: 17, base: { sha: f.baseSha, repo: { id: 101 } }, head: { sha: headSha, repo: { id: 101 } },
  } };
  const options = { root: f.root, repo, event, expectedSha: headSha, runId: 41, runAttempt: 1, run: f.run };
  return { ...f, headSha, leafPath, leafBytes, leafRef, priorPath, ancestorPath, unrelatedPath,
    refs: [priorRef, ancestorRef, leafRef],
    selected: () => selectNativeRequests({ root: f.root, baseSha: f.baseSha, headSha }),
    produce: () => producePrRegistrationProof(options),
    validate: proof => validateLocalRegistrationProof({ ...options, proof }) };
}

test('shadow re-plan includes fixed transitive native receipt evidence without adopting unrelated files', t => {
  const f = ancestralEvidenceFixture(t);
  f.hook['dry-run'] = target => {
    for (const ref of f.refs) assert.equal(sha(fs.readFileSync(path.join(target, ref.path))), ref.sha256);
    if (target !== f.root) assert.equal(fs.existsSync(path.join(target, f.unrelatedPath)), false);
  };
  const proof = f.produce(), before = f.snapshot();
  assert.equal(f.validate(proof).reusable, true);
  assert.deepEqual(f.snapshot(), before);
  assert.deepEqual(proof.nativePreview.requests[0].evidence.map(ref => ref.path).sort(),
    f.refs.map(ref => ref.path).sort(), 'a repeated leaf is copied and fingerprinted exactly once');
  assert.equal(proof.nativePreview.requests.length, 1, 'evidence closure never selects another request');
  f.assertShadowsRemoved();
});

for (const [name, options, error] of [
  ['missing leaf', { missingLeaf: true }, /MISSING_FILE/],
  ['wrong leaf hash', { mutateLeafRef: ref => { ref.sha256 = '0'.repeat(64); } }, /EVIDENCE_DRIFT/],
  ['malformed leaf hash', { mutateLeafRef: ref => { ref.sha256 = 'not-a-digest'; } }, /EVIDENCE_SHA/],
  ['unsafe leaf path', { mutateLeafRef: ref => { ref.path = '../outside.json'; } }, /UNSAFE_PATH/],
  ['cyclic receipt reference', { cycle: true }, /EVIDENCE_CYCLE/],
]) test(`transitive native evidence rejects ${name} before official registration`, t => {
  const f = ancestralEvidenceFixture(t, options), before = f.snapshot();
  assert.throws(() => f.produce(), error);
  assert.deepEqual(f.snapshot(), before);
  assert.equal(f.calls.some(call => call.args[0]?.endsWith('/register-reviewed-exam-meta-source.mjs')), false);
});

test('transitive native evidence rejects worktree drift and symlinks on proof reuse', t => {
  for (const symlink of [false, true]) {
    const f = ancestralEvidenceFixture(t), proof = f.produce();
    if (symlink) {
      fs.rmSync(path.join(f.root, f.leafPath));
      fs.symlinkSync(path.join(f.root, EVIDENCE), path.join(f.root, f.leafPath));
    } else fs.appendFileSync(path.join(f.root, f.leafPath), '\n');
    const before = f.snapshot();
    assert.throws(() => f.validate(proof), symlink ? /SYMLINK/ : /EVIDENCE_DRIFT/);
    assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
  }
});

test('transitive evidence must match fixed Git even when its worktree hash matches every reference', t => {
  const f = ancestralEvidenceFixture(t), changedBytes = f.leafBytes + '\n';
  const leafRef = { path: f.leafPath, sha256: sha(changedBytes) };
  f.write(f.leafPath, changedBytes);
  const ancestor = JSON.parse(fs.readFileSync(path.join(f.root, f.ancestorPath), 'utf8'));
  ancestor.approval.evidenceRefs = [leafRef]; f.write(f.ancestorPath, json(ancestor));
  const prior = JSON.parse(fs.readFileSync(path.join(f.root, f.priorPath), 'utf8'));
  prior.approval.evidenceRefs = [{ path: f.ancestorPath, sha256: sha(json(ancestor)) }, leafRef];
  f.write(f.priorPath, json(prior));
  const priorRef = { path: f.priorPath, sha256: sha(json(prior)) };
  f.request.approval.evidenceRefs = [priorRef]; f.request.items[0].evidenceRefs = [priorRef];
  f.request.approval.sourceRebind.priorReceiptRef = priorRef; f.write(REQUEST, json(f.request));
  f.git('add', '--', f.ancestorPath, f.priorPath, REQUEST);
  f.git('commit', '-qm', 'references cannot authorize an uncommitted evidence leaf');
  const before = f.snapshot();
  assert.throws(() => selectNativeRequests({ root: f.root, baseSha: f.baseSha, headSha: f.git('rev-parse', 'HEAD') }), /EVIDENCE_NOT_FIXED/);
  assert.deepEqual(f.snapshot(), before);
});

test('complete transitive input staging cannot turn an official ancestor rejection into a reusable proof', t => {
  const f = ancestralEvidenceFixture(t), proof = f.produce(), before = f.snapshot();
  f.hook['dry-run'] = target => {
    if (target !== f.root) {
      assert.equal(sha(fs.readFileSync(path.join(target, f.leafPath))), f.leafRef.sha256);
      throw Error('OFFICIAL_ANCESTOR_APPROVAL_REJECTED');
    }
  };
  assert.throws(() => f.validate(proof), /OFFICIAL_ANCESTOR_APPROVAL_REJECTED/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

for (const label of ['absent', 'empty']) {
  test(`ordinary positive native preservation still rejects ${label} approval evidence on its original receipt`, t => {
    const f = ancestralEvidenceFixture(t);
    const prior = JSON.parse(fs.readFileSync(path.join(f.root, f.priorPath), 'utf8'));
    if (label === 'empty') prior.approval.evidenceRefs = [];
    else delete prior.approval.evidenceRefs;
    const bytes = json(prior), priorRef = { path: f.priorPath, sha256: sha(bytes) };
    f.write(f.priorPath, bytes);
    f.request.approval.evidenceRefs = [priorRef];
    f.request.approval.sourceRebind.priorReceiptRef = priorRef;
    f.request.items[0].evidenceRefs = [priorRef];
    f.write(REQUEST, json(f.request));
    f.git('add', '.'); f.git('commit', '-qm', 'positive original receipt lacks approval evidence');
    const headSha = f.git('rev-parse', 'HEAD');
    assert.throws(() => selectNativeRequests({ root: f.root, baseSha: f.baseSha, headSha }), /EVIDENCE_REQUIRED/);
  });
}

function historicalPreservedRpmFixture(t, { unreachableHistory = false, mutateCurrent } = {}) {
  const f = fixture(t, { partial: true, finalQaPreservation: true, otherOwner: false });
  const priorPath = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/historical-rpm-prior.json';
  const crosswalkPath = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
  const runtimePath = 'archive/data/meta-foundation/runtime/middle2-v1.json';
  const rpmPath = { majorUnit: 'unit', midUnit: 'subunit', l3: 'method', l4: 'variant' };
  const crosswalk = { schemaVersion: 'rpm-primary-active-crosswalk-v1', status: 'ACTIVE_REFERENCE', grade: 'M2',
    records: [{ id: 'M2-RPM-136', curriculum: '2022', scope: 'M2-1', rpmPath, mappingStatus: 'RPM_ONLY' }] };
  const crosswalkRef = { path: crosswalkPath, sha256: sha(json(crosswalk)) };
  const sourceBytes = fs.readFileSync(path.join(f.root, SOURCE));
  const row = { questionUid: 'fixture', sourceArchiveFile: 'original/native.js', sourceOrdinal: 5,
    metadataApprovalType: 'FINAL_QA', metadataStatus: 'approved_semantic_review', metaFoundationStatus: 'ACTIVE',
    defaultSelectable: true, approvalEvidence: [priorPath], rpmPrimaryId: 'M2-RPM-136', curriculum: '2022', courseKey: 'M2-1' };
  const identity = { questionUid: 'fixture', sourceArchiveFile: row.sourceArchiveFile, sourceOrdinal: 5, sourceFingerprint: 'a'.repeat(64) };
  const runtimeRecord = { ...copy(row), sourceIdentity: 'original/native.js#5', runtimeSelectable: true };
  const prior = { schemaVersion: 'archive-reviewed-exam-meta-registration-v2', metadataRegistrationStatus: 'REGISTERED',
    requestId: 'historical-rpm-prior', requestSha256: 'b'.repeat(64), sourceArchiveFile: row.sourceArchiveFile,
    scope: 'PARTIAL_UIDS', totalQuestions: 1, partialUidCount: 1, expectedQuestionCount: 24,
    sourceBlobSha1: f.git('rev-parse', `HEAD:${SOURCE}`), sourceRawSha256: sha(sourceBytes),
    approval: { type: 'FINAL_QA', metadataReviewed: true, approvedBy: 'original independent reviewer', evidenceRefs: [crosswalkRef] },
    appliedRecords: [copy(row)], appliedIdentityRecords: [copy(identity)], runtimeRecords: [copy(runtimeRecord)],
    rpmPrimaryBindings: [{ questionUid: 'fixture', sourceOrdinal: 5, recordId: 'M2-RPM-136', crosswalkRef,
      curriculum: '2022', scope: 'M2-1', rpmPath, authorityUse: 'RPM_PATH_PROVENANCE_ONLY', selectsPtTpl: false }],
    outputDigests: [{ path: runtimePath, sha256: 'c'.repeat(64) }] };
  f.write(META, json({ records: [row] })); f.write(IDENTITY, json({ records: [identity] }));
  f.write(runtimePath, json({ status: 'ACTIVE', generatedFrom: { reviewedExam_historical_rpm_unused: 'unrelated',
    ['reviewedExam_' + prior.requestId]: priorPath }, records: [runtimeRecord] }));
  f.write(crosswalkPath, json(crosswalk)); f.write(priorPath, json(prior));
  f.git('add', '.');
  let issuedCommit;
  if (unreachableHistory) {
    issuedCommit = f.git('commit-tree', f.git('write-tree'), '-p', f.git('rev-parse', 'HEAD'), '-m', 'unmerged historical bytes');
    f.git('update-ref', 'refs/heads/unmerged-issued-snapshot', issuedCommit);
  } else { f.git('commit', '-qm', 'issued exact partial FINAL_QA RPM provenance'); issuedCommit = f.git('rev-parse', 'HEAD'); }
  const current = copy(crosswalk); current.records.push({ id: 'M2-RPM-UNRELATED', curriculum: '2015', scope: 'M2-1' });
  f.write(crosswalkPath, json(current));
  const source = Array.from({ length: 24 }, (_, i) => ({ id: i + 1 })); source[0].tagConfidence = 'reviewed-disjoint-metadata';
  f.write(SOURCE, 'window.questions = ' + JSON.stringify(source) + ';\n');
  const priorRef = { path: priorPath, sha256: sha(json(prior)) };
  f.request.approval.evidenceRefs = [priorRef]; f.request.approval.sourceRebind = { priorReceiptRef: priorRef };
  f.request.items[0].evidenceRefs = [priorRef]; f.request.expectedSourceBlobSha1 = f.git('hash-object', SOURCE);
  f.write(REQUEST, json(f.request));
  mutateCurrent?.({ f, prior, current, row, identity, runtimeRecord, priorPath, crosswalkPath, runtimePath, priorRef });
  f.git('add', '.'); f.git('commit', '-qm', 'current unrelated crosswalk expansion and source-only preservation');
  const headSha = f.git('rev-parse', 'HEAD');
  return { ...f, headSha, issuedCommit, priorPath, priorRef, crosswalkPath, runtimePath, crosswalkRef,
    selected: () => selectNativeRequests({ root: f.root, baseSha: f.baseSha, headSha }),
    pending: () => selectPendingNativeRequests({ root: f.root, headSha }) };
}

test('historical preserved RPM crosswalk stages current bytes with exact issued ancestor provenance', t => {
  const f = historicalPreservedRpmFixture(t), before = f.snapshot();
  const selected = f.selected(); assert.equal(selected.length, 1);
  const row = selected[0], history = row.historicalRpmEvidence;
  assert.equal(history.length, 1); assert.equal(history[0].historicalRef.commit, f.issuedCommit);
  assert.equal(history[0].historicalRef.sha256, f.crosswalkRef.sha256);
  assert.equal(history[0].priorReceiptRef.sha256, f.priorRef.sha256);
  assert.equal(history[0].selectedRecords[0].recordId, 'M2-RPM-136');
  const currentSha = sha(fs.readFileSync(path.join(f.root, f.crosswalkPath)));
  assert.notEqual(currentSha, f.crosswalkRef.sha256);
  assert.equal(row.evidence.find(r => r.path === f.crosswalkPath).sha256, currentSha);
  assert.deepEqual(f.pending(), selected); assert.deepEqual(f.snapshot(), before);
  assert.equal(f.calls.some(c => c.program !== 'git'), false, 'staging issues no approval');
});

for (const [name, mutateCurrent, expected] of [
  ['selected metadata', ({ f, row }) => f.write(META, json({ records: [{ ...row, difficultyBucket: 5 }] })), /EXISTING_APPROVAL/],
  ['selected identity', ({ f, identity }) => f.write(IDENTITY, json({ records: [{ ...identity, sourceFingerprint: 'd'.repeat(64) }] })), /EXISTING_APPROVAL/],
  ['selected runtime', ({ f, runtimeRecord, runtimePath, priorPath }) => f.write(runtimePath, json({ status: 'ACTIVE', generatedFrom: { 'reviewedExam_historical-rpm-prior': priorPath }, records: [{ ...runtimeRecord, runtimeSelectable: false }] })), /EXISTING_APPROVAL/],
  ['runtime receipt binding', ({ f, runtimeRecord, runtimePath }) => f.write(runtimePath, json({ status: 'ACTIVE', generatedFrom: {}, records: [runtimeRecord] })), /RUNTIME_BINDING/],
  ['selected RPM row', ({ f, current, crosswalkPath }) => { current.records[0].mappingStatus = 'CHANGED'; f.write(crosswalkPath, json(current)); }, /SELECTED_RECORD_CHANGED/],
  ['unknown field on selected RPM row', ({ f, current, crosswalkPath }) => { current.records[0].unreviewedAlias = true; f.write(crosswalkPath, json(current)); }, /SELECTED_RECORD_CHANGED/],
  ['duplicate RPM record', ({ f, current, crosswalkPath }) => { current.records.push(copy(current.records[0])); f.write(crosswalkPath, json(current)); }, /CROSSWALK_SCOPE/],
  ['foreign crosswalk grade', ({ f, current, crosswalkPath }) => { current.grade = 'M3'; f.write(crosswalkPath, json(current)); }, /CROSSWALK_SCOPE/],
  ['inactive crosswalk', ({ f, current, crosswalkPath }) => { current.status = 'DRAFT'; f.write(crosswalkPath, json(current)); }, /CROSSWALK_SCOPE/],
  ['new semantic after value', ({ f }) => { f.request.items[0].after = { difficultyBucket: 5 }; f.write(REQUEST, json(f.request)); }, /EVIDENCE_DRIFT/],
  ['ordinary request without source rebind', ({ f }) => { delete f.request.approval.sourceRebind; f.write(REQUEST, json(f.request)); }, /EVIDENCE_DRIFT/],
  ['direct stale crosswalk reference', ({ f, prior }) => { f.request.approval.evidenceRefs.push(prior.approval.evidenceRefs[0]); f.request.items[0].evidenceRefs.push(prior.approval.evidenceRefs[0]); f.write(REQUEST, json(f.request)); }, /EVIDENCE_DRIFT/],
]) test(`historical preserved RPM crosswalk rejects ${name}`, t => {
  const f = historicalPreservedRpmFixture(t, { mutateCurrent }), before = f.snapshot();
  assert.throws(() => f.selected(), expected); assert.deepEqual(f.snapshot(), before);
});

test('historical preserved RPM crosswalk rejects matching bytes on an unmerged side branch', t => {
  const f = historicalPreservedRpmFixture(t, { unreachableHistory: true });
  assert.throws(() => f.selected(), /IMMUTABLE_REFERENCE/);
});

test('historical preserved RPM crosswalk still rejects current worktree drift', t => {
  const f = historicalPreservedRpmFixture(t);
  fs.appendFileSync(path.join(f.root, f.crosswalkPath), '\n');
  assert.throws(() => f.selected(), /EVIDENCE_NOT_FIXED/);
});

test('historical preserved RPM crosswalk cannot bypass an official registrar refusal', t => {
  const f = historicalPreservedRpmFixture(t), selected = f.selected(), before = f.snapshot();
  f.hook['dry-run'] = () => { throw Error('OFFICIAL_PRIOR_WHOLE_QUESTION_REJECTED'); };
  assert.throws(() => applyNativeRequests({ root: f.root, requests: selected, run: f.run }), /OFFICIAL_PRIOR_WHOLE_QUESTION_REJECTED/);
  assert.deepEqual(f.snapshot(), before);
});

test('historical preserved RPM crosswalk cannot claim a new approval from a preservation plan', t => {
  const f = historicalPreservedRpmFixture(t), selected = f.selected();
  f.hook.result = (_phase, result) => ({ ...result, newMetadataApprovals: 1 });
  assert.throws(() => applyNativeRequests({ root: f.root, requests: selected, run: f.run }), /DRY_RUN_NOT_PASS/);
});

for (const [name, mutate] of [
  ['missing issued RPM bindings', prior => { delete prior.rpmPrimaryBindings; }],
  ['wrong cohort denominator', prior => { prior.expectedQuestionCount = 23; }],
  ['wrong prior approval type', prior => { prior.approval.type = 'REVIEW2'; }],
  ['missing prior source blob binding', prior => { delete prior.sourceBlobSha1; }],
  ['wrong prior source raw digest', prior => { prior.sourceRawSha256 = '0'.repeat(64); }],
  ['foreign RPM selection authority', prior => { prior.rpmPrimaryBindings[0].selectsPtTpl = true; }],
]) test(`historical preserved RPM crosswalk rejects re-sealed ${name}`, t => {
  const f = historicalPreservedRpmFixture(t, { mutateCurrent: ({ f, prior, priorPath }) => {
    mutate(prior); const raw = json(prior), ref = { path: priorPath, sha256: sha(raw) };
    f.write(priorPath, raw); f.request.approval.sourceRebind.priorReceiptRef = ref;
    f.request.approval.evidenceRefs = [ref]; f.request.items[0].evidenceRefs = [ref]; f.write(REQUEST, json(f.request));
  } });
  assert.throws(() => f.selected(), /PRESERVED_RPM_HISTORY_/);
});


// Synthetic E032 history tests the preview boundary, not new approval evidence.
const E032_SOURCE = 'original/middle/m2/2final/22_풍덕중_2학기_기말_중2_기출.js';
const E032_PRIOR = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-binding68-20261115-E032.json';
const E032_REQUEST = '.archive-meta-register/inbox/e032-subset-preview-fixture.json';
const E032_RUNTIME = 'archive/data/meta-foundation/runtime/middle2-v1.json';
const E032_PAIRS = [
 ['qid_v1_f288a19bf33c38b84c2c2436478bfba2bafd4b275fa60568af686eeab5732363',2],
 ['qid_v1_9172cf1ec90c0cc3af91cab63dcfa4b68fa61065882343e82812a4d86d780f85',3],
 ['qid_v1_bed808c0cecc90e30621de4a5b961290d1ce0b95e943d07155962ed483cc39c8',4],
 ['qid_v1_df579118439a5d43dc8408f65e435810dd1ef11b29053720e135ca1120ec50f0',5],
 ['qid_v1_45204c832c0632b1cad11ec4c9e766abfddf38680628e9af0beb70538e68ece7',6],
 ['qid_v1_9ec4baa4cded9d949b8ca60ced0a095a03b5d438f48f1a57fde1cc7dfeb956d6',7],
 ['qid_v1_7a44e50d6c7fb8fddcd4b1791abe9bd4987c5e1dc4d6e6aafca725c7c62a7f6a',9]
];
function subsetPreviewFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'e032-subset-preview-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (p, data) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), data); };
  const git = (...args) => { const r = spawnSync('git', args, { cwd: root, encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr); return r.stdout.trim(); };
  const blob = b => createHash('sha1').update(`blob ${Buffer.byteLength(b)}\0`).update(b).digest('hex');
  const sourceBytes = bank => 'window.questionBank = ' + JSON.stringify(bank) + ';\n';
  git('init', '-q', '--initial-branch=main'); git('config', 'user.name', 'synthetic-preview');
  git('config', 'user.email', 'fixture@example.invalid'); git('config', 'commit.gpgsign', 'false');
  const proofPath = 'docs/operations/e032-preview-fixture-proof.json', proof = json({ kind: 'synthetic-only' });
  write(proofPath, proof); const proofRef = { path: proofPath, sha256: sha(proof) };
  const oldBank = Array.from({ length: 24 }, (_, i) => ({ id: i + 1, content: 'Synthetic item ' + (i + 1), answer: 'fixture', solution: 'fixture' }));
  const oldBytes = sourceBytes(oldBank), priorId = path.posix.basename(E032_PRIOR, '.json');
  const metadata = E032_PAIRS.map(([questionUid, sourceOrdinal]) => ({ questionUid, sourceArchiveFile: E032_SOURCE, sourceOrdinal,
    sourceFingerprint: sha(json(oldBank[sourceOrdinal - 1])), contentFingerprint: sha(json(oldBank[sourceOrdinal - 1])),
    metaFoundationPackId: 'MIDDLE2', metaFoundationPackVersion: '1.0.3', metadataApprovalType: 'FINAL_QA',
    metadataRevision: 'meta-foundation:MIDDLE2@1.0.3:exam-final_qa-v2:' + priorId, approvalEvidence: [E032_PRIOR],
    difficultyBucket: 3, difficultyConfidence: 'high', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
    verifiedEligible: false, automaticAssignmentEligible: false }));
  const identities = metadata.map(r => ({ questionUid: r.questionUid, sourceArchiveFile: E032_SOURCE, sourceOrdinal: r.sourceOrdinal, sourceFingerprint: r.sourceFingerprint }));
  const runtime = metadata.map(r => ({ ...copy(r), sourceIdentity: E032_SOURCE + '#' + r.sourceOrdinal }));
  const prior = { schemaVersion: 'archive-reviewed-exam-meta-registration-v2', requestId: priorId, requestSha256: sha('synthetic old request'),
    metadataRegistrationStatus: 'REGISTERED', examUid: 'synthetic-e032', sourceArchiveFile: E032_SOURCE,
    sourceBlobSha1: blob(oldBytes), sourceRawSha256: sha(oldBytes), expectedQuestionCount: 24, scope: 'PARTIAL_UIDS',
    totalQuestions: 7, partialUidCount: 7, approval: { type: 'FINAL_QA', metadataReviewed: true, approvedBy: 'synthetic-prior', evidenceRefs: [proofRef] },
    appliedRecords: copy(metadata), appliedIdentityRecords: copy(identities), runtimeRecords: copy(runtime), fingerprintRepairs: [], nativeParentBindings: [] };
  write(E032_PRIOR, json(prior)); write('archive/exams/' + E032_SOURCE, oldBytes);
  write(META, json({ records: metadata })); write(IDENTITY, json({ records: identities })); write(E032_RUNTIME, json({ status: 'ACTIVE', records: runtime }));
  git('add', '.'); git('commit', '-qm', 'synthetic original seven'); const priorCommit = git('rev-parse', 'HEAD');
  const bank = copy(oldBank); for (const [, ordinal] of E032_PAIRS.slice(4)) bank[ordinal - 1].solutionImage = 'assets/synthetic-changed-' + ordinal + '.svg';
  write('archive/exams/' + E032_SOURCE, sourceBytes(bank)); git('add', '.'); git('commit', '-qm', 'synthetic changed neighbours');
  const baseSha = git('rev-parse', 'HEAD'), ref = { path: E032_PRIOR, sha256: sha(json(prior)) };
  const request = { schemaVersion: NATIVE_REQUEST_SCHEMA, requestId: 'e032-subset-preview-fixture', examUid: prior.examUid,
    sourceArchiveFile: E032_SOURCE, expectedSourceBlobSha1: blob(sourceBytes(bank)), expectedQuestionCount: 24, scope: 'PARTIAL_UIDS', registryChanges: [],
    approval: { type: 'FINAL_QA', metadataReviewed: true, approvedBy: 'preservation-only', evidenceRefs: [ref],
      sourceRebind: { schemaVersion: 'archive-native-partial-subset-preservation-v1', priorCommit, currentCommit: baseSha,
        priorReceiptRef: ref, selectedQuestionUids: E032_PAIRS.slice(0, 4).map(r => r[0]), excludedQuestionUids: E032_PAIRS.slice(4).map(r => r[0]) } },
    items: E032_PAIRS.slice(0, 4).map(([questionUid, sourceOrdinal]) => ({ questionUid, sourceOrdinal, before: {}, after: {},
      reason: 'Synthetic unchanged authority preservation', evidenceRefs: [ref] })) };
  const seal = () => { write(E032_REQUEST, json(request)); git('add', '.'); git('commit', '--allow-empty', '-qm', 'synthetic preview request'); return git('rev-parse', 'HEAD'); };
  return { root, write, git, blob, sourceBytes, oldBank, bank, metadata, identities, runtime, prior, request, baseSha, seal, proofPath };
}

test('E032 subset preview selects only four with the original denominator and zero new approvals', t => {
  const f = subsetPreviewFixture(t), headSha = f.seal();
  const rows = selectNativeRequests({ root: f.root, baseSha: f.baseSha, headSha });
  assert.equal(rows.length, 1); const r = rows[0];
  assert.equal(r.kind, 'native-approval-preservation'); assert.equal(r.questionCount, 4); assert.equal(r.sourceQuestionCount, 24);
  assert.deepEqual(r.selectedItems, E032_PAIRS.slice(0, 4).map(([questionUid, sourceOrdinal]) => ({ questionUid, sourceOrdinal })));
  assert.equal(r.partialSubsetPreservation.priorApprovalCount, 7);
  assert.equal(r.partialSubsetPreservation.preservedMetadataApprovals, 4); assert.equal(r.partialSubsetPreservation.newMetadataApprovals, 0);
  assert.deepEqual(selectPendingNativeRequests({ root: f.root, headSha }), rows);
  const before = json(rows), oldEvidence = fs.readFileSync(path.join(f.root, E032_PRIOR));
  for (const [p, records] of [[META, f.metadata], [E032_RUNTIME, f.runtime]]) {
    const after = copy(records); for (const row of after.slice(0, 4)) { row.metadataRevision += ':issued'; row.approvalEvidence.push(r.receiptPath); }
    f.write(p, json({ records: after }));
  }
  assert.equal(json(selectNativeRequests({ root: f.root, baseSha: f.baseSha, headSha })), before,
    'post-registration re-selection authenticates the same immutable HEAD inputs; issued state is checked by the registrar');
  assert.deepEqual(fs.readFileSync(path.join(f.root, E032_PRIOR)), oldEvidence);
});

for (const [name, mutate] of [
  ['unknown preservation schema', f => { f.request.approval.sourceRebind.schemaVersion += '-unknown'; }],
  ['non-partial request', f => { delete f.request.scope; }],
  ['empty selected set', f => { f.request.items = []; }],
  ['duplicate selected UID', f => { f.request.items[1] = copy(f.request.items[0]); }],
  ['excluded UID injection', f => { [f.request.items[0].questionUid, f.request.items[0].sourceOrdinal] = E032_PAIRS[4]; }],
  ['missing excluded partition', f => { f.request.approval.sourceRebind.excludedQuestionUids.pop(); }],
  ['after patch instead of preservation', f => { f.request.items[0].after.difficultyBucket = 1; }],
  ['new registry approval', f => { f.request.registryChanges.push({ evidenceRefs: f.request.approval.evidenceRefs }); }],
  ['foreign approval type', f => { f.request.approval.type = 'REVIEW2'; }],
  ['forged prior receipt digest', f => { f.request.approval.sourceRebind.priorReceiptRef.sha256 = 'f'.repeat(64); }],
  ['missing fixed historical commit', f => { f.request.approval.sourceRebind.priorCommit = 'f'.repeat(40); }],
  ['wrong historical source pin', f => { f.request.approval.sourceRebind.priorCommit = f.baseSha; }],
  ['wrong current source pin', f => { f.request.approval.sourceRebind.currentCommit = f.request.approval.sourceRebind.priorCommit; }],
  ['selected current metadata drift', f => { f.metadata[0].difficultyBucket = 1; f.write(META, json({ records: f.metadata })); }],
  ['selected current runtime evidence drift', f => { f.runtime[0].approvalEvidence.push('unapproved'); f.write(E032_RUNTIME, json({ records: f.runtime })); }],
  ['selected current identity drift', f => { f.identities[0].sourceFingerprint = 'f'.repeat(64); f.write(IDENTITY, json({ records: f.identities })); }],
  ['changed selected whole question', f => { f.bank[1].content += ' changed'; f.write('archive/exams/' + E032_SOURCE, f.sourceBytes(f.bank)); f.git('add', '.'); f.git('commit', '-qm', 'synthetic unapproved change'); f.request.approval.sourceRebind.currentCommit = f.git('rev-parse', 'HEAD'); f.request.expectedSourceBlobSha1 = f.blob(f.sourceBytes(f.bank)); }],
]) test('E032 subset preview rejects ' + name, t => {
  const f = subsetPreviewFixture(t); mutate(f); const headSha = f.seal();
  assert.throws(() => selectNativeRequests({ root: f.root, baseSha: f.baseSha, headSha }));
});

test('E032 subset preview keeps immutable evidence and source working-copy tamper guards', t => {
  const f = subsetPreviewFixture(t), headSha = f.seal();
  f.write(f.proofPath, json({ changed: true }));
  assert.throws(() => selectNativeRequests({ root: f.root, baseSha: f.baseSha, headSha }), /EVIDENCE_DRIFT/);
});
test('E032 subset preview refuses a registrar result promoting seven or granting new approval', t => {
  const f = subsetPreviewFixture(t), headSha = f.seal();
  const requests = selectNativeRequests({ root: f.root, baseSha: f.baseSha, headSha });
  for (const [totalQuestions, preservedMetadataApprovals, newMetadataApprovals] of [[7, 7, 0], [4, 4, 4]]) {
    const run = () => json({ status: 'PASS', requestId: f.request.requestId, scope: 'PARTIAL_UIDS', totalQuestions,
      partialUidCount: totalQuestions, expectedQuestionCount: 24, preservedMetadataApprovals, newMetadataApprovals,
      replay: false, plannedPaths: [META, requests[0].receiptPath] });
    assert.throws(() => applyNativeRequests({ root: f.root, requests, run, guard: false }), /DRY_RUN_NOT_PASS/);
  }
});

import { hydrateFixedNativeServedInputs, rederiveNativePlans,
  attachNativeRegistryVersionDependencies } from '../tools/ci/archive-pr-native-preview.mjs';

// Synthetic Git history for the staging contract only. No Native/visual
// approval is inferred from these fixture records or the stubbed registrar.
const SHADOW_TECH = 'docs/operations/m2-problem21-continuity-20261116/student-ui-technical-v1.json';
const SHADOW_WRAP = 'docs/operations/m2-family3-problem-continuity-20261116/binding-e015-v1.json';
const SHADOW_SOURCE = 'archive/exams/original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js';
const SHADOW_UIDS = ['qid_v1_3c72535bb4d43798192918e723d32bd646b2415bde8c5e8ad872b445496b7bfd',
  'qid_v1_76b2be613350f59166e128170c6f38b6150078c9ed44e727733d5de0bbf76942'];

function servedShadowFixture(t, mutate = {}) {
  const f = fixture(t, { partial: true });
  const readonly = ['archive/engine.html', ...Array.from({ length: 90 }, (_, i) => `archive/shadow-fixture-${i}.js`), 'archive/shadow-fixture-style.css',
    'archive/vendor/nanum-myeongjo/shadow-fixture.woff2', 'archive/data/svg-accessibility-index.js'];
  const sources = [SHADOW_SOURCE, 'archive/exams/original/middle/m2/2mid/shadow-other-a.js',
    'archive/exams/original/middle/m2/2mid/shadow-other-b.js'];
  for (const file of readonly) f.write(file, `fixed synthetic renderer bytes ${file}\n`);
  for (const file of sources) f.write(file, fs.readFileSync(path.join(f.root, SOURCE)));
  f.write('archive/unrelated-not-served.js', '// must never be staged\n');
  f.git('add', '--', ...readonly, ...sources, 'archive/unrelated-not-served.js'); f.git('commit', '-qm', 'synthetic capture checkout');
  const captureCommit = f.git('rev-parse', 'HEAD');
  const at = (commit, file) => {
    const r = spawnSync('git', ['show', `${commit}:${file}`], { cwd: f.root });
    assert.equal(r.status, 0, String(r.stderr));
    return { commit, path: file, gitBlobSha1: f.git('rev-parse', `${commit}:${file}`), sha256: sha(r.stdout), bytes: r.stdout.length };
  };
  const font = at(captureCommit, readonly[92]);
  const technical = { schemaVersion: 'archive-m2-problem24-student-ui-preview-v1',
    status: 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING', checkoutCommit: captureCommit,
    items: Array.from({ length: 24 }, (_, i) => ({ sourceRef: at(captureCommit, sources[i % 3]) })),
    servedFiles: [...readonly, META, ...sources].map(file => at(captureCommit, file)),
    studentFontResources: Array.from({ length: 40 }, (_, i) => ({ ...font, resourceId: sha(`font resource ${i}`), status: 200, kind: 'FONT' })) };
  mutate.technical?.(technical, f);
  f.write(SHADOW_TECH, json(technical)); f.git('add', '--', SHADOW_TECH); f.git('commit', '-qm', 'synthetic fixed technical inventory');
  const technicalCommit = f.git('rev-parse', 'HEAD');
  const wrapper = { schemaVersion: 'archive-m2-family3-problem-continuity-binding-v1',
    scope: 'EXACT_M2_E017_Q6_E015_Q7_Q8_PROBLEM_DISPLAY', sourceArchiveFile: SHADOW_SOURCE.slice('archive/exams/'.length),
    selectedQuestionUids: [...SHADOW_UIDS], studentUiTechnicalRef: at(technicalCommit, SHADOW_TECH) };
  mutate.wrapper?.(wrapper, f);
  f.write(SHADOW_WRAP, json(wrapper)); f.git('add', '--', SHADOW_WRAP); f.git('commit', '-qm', 'synthetic fixed wrapper');
  const reviewCommit = f.git('rev-parse', 'HEAD'), wrapperRef = { path: SHADOW_WRAP, sha256: sha(fs.readFileSync(path.join(f.root, SHADOW_WRAP))) };
  const technicalRef = { path: SHADOW_TECH, sha256: sha(fs.readFileSync(path.join(f.root, SHADOW_TECH))) };
  Object.assign(f.request, { sourceArchiveFile: SHADOW_SOURCE.slice('archive/exams/'.length), expectedSourceBlobSha1: at(captureCommit, SHADOW_SOURCE).gitBlobSha1 });
  f.request.approval = { type: 'FINAL_QA', metadataReviewed: true, evidenceRefs: [wrapperRef, technicalRef] };
  f.request.items = SHADOW_UIDS.map((questionUid, i) => ({ questionUid, sourceOrdinal: 7 + i,
    evidenceRefs: [wrapperRef, technicalRef], sourceReview: { m2Family3ProblemContinuity: {
      schemaVersion: 'archive-m2-family3-problem-continuity-v1', reviewCommit, reviewRef: wrapperRef } } }));
  mutate.request?.(f.request, f);
  f.write(REQUEST, json(f.request)); f.git('add', '--', REQUEST); f.git('commit', '-qm', 'synthetic selected family request');
  const headSha = f.git('rev-parse', 'HEAD');
  const selected = () => selectNativeRequests({ root: f.root, baseSha: f.baseSha, headSha });
  const newShadow = () => {
    const shadow = fs.mkdtempSync(path.join(os.tmpdir(), 'native-served-shadow-test-'));
    t.after(() => fs.rmSync(shadow, { recursive: true, force: true })); return shadow;
  };
  const hydrate = (shadow = newShadow(), requests = selected(), head = headSha) =>
    hydrateFixedNativeServedInputs({ root: f.root, shadow, headSha: head, requests });
  const repo = 'owner/repository', options = { root: f.root, repo, expectedSha: headSha, runId: 41, runAttempt: 1, run: f.run,
    event: { number: 17, repository: { id: 101, full_name: repo }, pull_request: {
      base: { sha: f.baseSha, repo: { id: 101 } }, head: { sha: headSha, repo: { id: 101 } } } } };
  f.hook.consumerResult = { status: 'PASS', counts: { changed: 2, checked: 2, passed: 2, skippedUnchanged: 0 },
    exams: [{ file: REQUEST, kind: 'reviewed-exam-v2', exam: f.request.sourceArchiveFile,
      sourceFile: f.request.sourceArchiveFile, changed: 2, checked: 2, passed: 2, skippedUnchanged: 0 }],
    failures: [], unobservedFields: [], assignmentPending: [] };
  return { ...f, readonly, sources, technical, wrapper, captureCommit, technicalCommit, reviewCommit, headSha,
    at, selected, newShadow, hydrate, options };
}

test('served shadow restores 93 missing files and checks one existing file without sharing mutable inodes', t => {
  const f = servedShadowFixture(t), shadow = f.newShadow(), before = f.snapshot();
  const existing = 'archive/data/svg-accessibility-index.js';
  f.write(existing, fs.readFileSync(path.join(f.root, existing)), shadow);
  const inode = fs.statSync(path.join(shadow, existing)).ino;
  const inputs = f.hydrate(shadow);
  assert.equal(inputs.length, 94); assert.equal(fs.statSync(path.join(shadow, existing)).ino, inode);
  for (const ref of inputs) {
    const p = path.join(shadow, ref.path);
    assert.equal(sha(fs.readFileSync(p)), ref.sha256);
    assert.notEqual(fs.statSync(p).ino, fs.statSync(path.join(f.root, ref.path)).ino);
  }
  assert.equal(fs.existsSync(path.join(shadow, 'archive/unrelated-not-served.js')), false);
  assert.deepEqual(f.snapshot(), before);
});

test('served shadow leaves dynamic source, metadata and identity post-state bytes untouched', t => {
  const f = servedShadowFixture(t), shadow = f.newShadow();
  for (const file of [META, IDENTITY, ...f.sources]) f.write(file, `post-state ${file}\n`, shadow);
  const before = [META, IDENTITY, ...f.sources].map(file => [file, fs.readFileSync(path.join(shadow, file))]);
  assert.equal(f.hydrate(shadow).length, 94);
  for (const [file, bytes] of before) assert.deepEqual(fs.readFileSync(path.join(shadow, file)), bytes);
});

test('served shadow proof revalidation uses original registrar plan and retains strict live checks', t => {
  const f = servedShadowFixture(t), seen = [];
  for (const phase of ['dry-run', 'write', 'projection']) f.hook[phase] = target => {
    for (const file of f.readonly) {
      const expected = f.technical.servedFiles.find(ref => ref.path === file);
      assert.equal(sha(fs.readFileSync(path.join(target, file))), expected.sha256, 'LIVE_SERVED_CODE_DRIFT');
    }
    seen.push({ phase, shadow: target !== f.root });
  };
  const proof = producePrRegistrationProof(f.options), before = f.snapshot();
  assert.equal(proof.status, 'PASS');
  assert.equal(validateLocalRegistrationProof({ ...f.options, proof }).reusable, true);
  assert.ok(seen.some(row => row.shadow && row.phase === 'write'));
  assert.ok(seen.some(row => !row.shadow && row.phase === 'projection'));
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

for (const [name, mutation, error] of [
  ['unknown technical schema', { technical: d => { d.schemaVersion = 'unbound-ui'; } }, /SHADOW_LIVE_INVENTORY/],
  ['incomplete served inventory', { technical: d => { d.servedFiles.pop(); } }, /SHADOW_LIVE_INVENTORY/],
  ['duplicate served path', { technical: d => { d.servedFiles[1] = d.servedFiles[0]; } }, /SHADOW_LIVE_INVENTORY/],
  ['served raw digest forgery', { technical: d => { d.servedFiles[0].sha256 = '0'.repeat(64); } }, /SHADOW_LIVE_DIGEST/],
  ['served Git blob forgery', { technical: d => { d.servedFiles[0].gitBlobSha1 = '0'.repeat(40); } }, /SHADOW_LIVE_DIGEST/],
  ['served byte count forgery', { technical: d => { d.servedFiles[0].bytes++; } }, /SHADOW_LIVE_DIGEST/],
  ['different served checkout', { technical: d => { d.servedFiles[0].commit = '0'.repeat(40); } }, /SHADOW_LIVE_CAPTURE_COMMIT/],
  ['path traversal', { technical: d => { d.servedFiles[0].path = 'archive/../outside.js'; } }, /UNSAFE_PATH/],
  ['absolute path', { technical: d => { d.servedFiles[0].path = '/tmp/outside.js'; } }, /UNSAFE_PATH/],
  ['Git internals path', { technical: d => { d.servedFiles[0].path = '.git/config'; } }, /SHADOW_LIVE_PATH/],
  ['arbitrary documentation path', { technical: d => { d.servedFiles[0].path = 'docs/private.json'; } }, /SHADOW_LIVE_PATH/],
  ['writable identity input', { technical: d => { d.servedFiles[0].path = IDENTITY; } }, /SHADOW_LIVE_PATH/],
  ['unbound font', { technical: d => { d.studentFontResources[0].sha256 = '0'.repeat(64); } }, /SHADOW_LIVE_FONT/],
  ['duplicate font resource', { technical: d => { d.studentFontResources[1] = d.studentFontResources[0]; } }, /SHADOW_LIVE_FONT/],
  ['foreign dynamic source', { technical: d => { d.items[0].sourceRef.path = 'archive/exams/original/high/h1/foreign.js'; } }, /SHADOW_LIVE_DYNAMIC_SCOPE/],
  ['wrapper source mismatch', { wrapper: d => { d.sourceArchiveFile = 'original/foreign.js'; } }, /SHADOW_LIVE_REQUEST|SHADOW_LIVE_PROFILE/],
  ['wrapper UID mismatch', { wrapper: d => { d.selectedQuestionUids = ['foreign-uid']; } }, /SHADOW_LIVE_PROFILE/],
  ['technical path outside profile', { wrapper: d => { d.studentUiTechnicalRef.path = 'docs/operations/another.json'; } }, /SHADOW_LIVE_PROFILE/],
  ['missing approval binding', { request: d => { d.approval.evidenceRefs = d.approval.evidenceRefs.slice(0, 1); } }, /SHADOW_LIVE_UNBOUND_INVENTORY/],
  ['missing item binding', { request: d => { d.items[0].evidenceRefs = d.items[0].evidenceRefs.slice(0, 1); } }, /SHADOW_LIVE_UNBOUND_INVENTORY/],
  ['outside selected UID', { request: d => { d.items[0].questionUid = 'foreign-uid'; } }, /SHADOW_LIVE_REQUEST/],
  ['unknown marker schema', { request: d => { d.items[0].sourceReview.m2Family3ProblemContinuity.schemaVersion = 'unknown'; } }, /SHADOW_LIVE_PROFILE/],
  ['missing marker in mixed request', { request: d => { delete d.items[0].sourceReview.m2Family3ProblemContinuity; } }, /SHADOW_LIVE_REQUEST/],
  ['missing historical wrapper commit', { request: d => { d.items[0].sourceReview.m2Family3ProblemContinuity.reviewCommit = '0'.repeat(40); } }, /SHADOW_LIVE_REGULAR_BLOB/],
]) test(`served shadow rejects ${name}`, t => {
  const f = servedShadowFixture(t, mutation), shadow = f.newShadow();
  assert.throws(() => f.hydrate(shadow), error);
  assert.deepEqual(fs.readdirSync(shadow), [], 'invalid authority never stages partial input');
});

for (const file of ['archive/engine.html', 'archive/shadow-fixture-0.js', 'archive/shadow-fixture-style.css', 'archive/vendor/nanum-myeongjo/shadow-fixture.woff2'])
  test(`served shadow rejects live byte drift in ${file}`, t => {
    const f = servedShadowFixture(t), selected = f.selected(), shadow = f.newShadow();
    f.write(file, 'modified current byte'); const before = f.snapshot();
    assert.throws(() => f.hydrate(shadow, selected), /SHADOW_LIVE_WORKTREE_DRIFT/);
    assert.deepEqual(f.snapshot(), before); assert.deepEqual(fs.readdirSync(shadow), []);
  });

test('served shadow refuses changed HEAD code even when worktree agrees with that changed HEAD', t => {
  const f = servedShadowFixture(t); f.write('archive/engine.html', 'new unreviewed engine');
  f.git('add', '--', 'archive/engine.html'); f.git('commit', '-qm', 'unreviewed engine');
  const headSha = f.git('rev-parse', 'HEAD'), requests = selectNativeRequests({ root: f.root, baseSha: f.baseSha, headSha });
  assert.throws(() => f.hydrate(f.newShadow(), requests, headSha), /SHADOW_LIVE_HEAD_DRIFT/);
});

test('served shadow refuses missing live input and a regular-file symlink substitution', t => {
  const f = servedShadowFixture(t), selected = f.selected(), target = path.join(f.root, 'archive/engine.html');
  fs.unlinkSync(target); assert.throws(() => f.hydrate(f.newShadow(), selected), /MISSING_FILE/);
  fs.symlinkSync('shadow-fixture-0.js', target);
  assert.throws(() => f.hydrate(f.newShadow(), selected), /SYMLINK/);
});

test('served shadow refuses a preexisting shadow mismatch without overwriting it', t => {
  const f = servedShadowFixture(t), shadow = f.newShadow(), file = 'apmath/css/student-navigation.css';
  const ref = f.technical.servedFiles.find(row => row.path === 'archive/engine.html');
  f.write(ref.path, 'independent shadow drift', shadow);
  assert.throws(() => f.hydrate(shadow), /SHADOW_LIVE_EXISTING_DRIFT/);
  assert.equal(fs.readFileSync(path.join(shadow, ref.path), 'utf8'), 'independent shadow drift');
});

test('served shadow refuses forged selected descriptors and a different checkout HEAD', t => {
  const f = servedShadowFixture(t), descriptors = f.selected(); descriptors[0].sha256 = '0'.repeat(64);
  assert.throws(() => f.hydrate(f.newShadow(), descriptors), /SHADOW_LIVE_REQUEST/);
  assert.throws(() => f.hydrate(f.newShadow(), f.selected(), f.captureCommit), /SHADOW_LIVE_HEAD/);
});

test('served shadow never expands an ordinary request with no explicit family marker', t => {
  const f = fixture(t), shadow = fs.mkdtempSync(path.join(os.tmpdir(), 'native-served-ordinary-'));
  t.after(() => fs.rmSync(shadow, { recursive: true, force: true }));
  assert.deepEqual(hydrateFixedNativeServedInputs({ root: f.root, shadow, headSha: f.headSha, requests: f.selected() }), []);
  assert.deepEqual(fs.readdirSync(shadow), []);
  assert.deepEqual(attachNativeRegistryVersionDependencies({ root: '/not-a-checkout', headSha: 'invalid', requests: [] }), []);
});

test('type-only direct judgment is previewed as its own kind with the registrar and Consumer states it really returns',t=>{
  const f=fixture(t,{partial:true,directType:true});
  const selected=f.selected();
  assert.equal(selected[0].kind,'direct-type-judgment');assert.equal(selected[0].questionCount,1);assert.equal(selected[0].sourceQuestionCount,24);
  const proof=f.produce();assert.equal(proof.status,'PASS');
  assert.equal(proof.nativePreview.requests[0].kind,'direct-type-judgment');
  assert.equal(f.validate(proof).reusable,true);f.assertShadowsRemoved();
});

test('type-only direct judgment request passes the shadow re-verification because the shadow carries the head decision document',t=>{
  assert.ok(SHADOW_RESTORE_PATHS.includes(DECISION_DOCUMENT), 'the restore list reads the registrar constant');
  const f=fixture(t,{partial:true,directType:true,decisionDoc:true});
  const proof=f.produce(),seen=[];
  // The same check the real registrar makes on a first registration (register-type-judgment checkDecisionDocument).
  const decision=target=>{const full=path.join(target,DECISION_DOCUMENT);
    if(!fs.existsSync(full))throw Error('decision document missing: '+DECISION_DOCUMENT);
    if(!fs.readFileSync(full,'utf8').includes(DECISION_SECTION))throw Error('decision section not found in '+DECISION_DOCUMENT);
    seen.push(target!==f.root);};
  f.hook['dry-run']=decision;f.hook.write=decision;
  assert.equal(f.validate(proof).reusable,true);
  assert.ok(seen.includes(true),'the check ran inside a shadow, not only in the live checkout');
  f.assertShadowsRemoved();
});

test('type-only direct judgment request still fails the shadow re-verification when the head has no decision document',t=>{
  const f=fixture(t,{partial:true,directType:true});
  const proof=f.produce();
  f.hook['dry-run']=target=>{if(!fs.existsSync(path.join(target,DECISION_DOCUMENT)))throw Error('decision document missing: '+DECISION_DOCUMENT);};
  assert.throws(()=>f.validate(proof),/decision document missing/);
  f.assertShadowsRemoved();
});

test('type-only direct judgment preview refuses a registrar result that is not a verified type-only replay',t=>{
  const cases=[
    r=>({...r,consumerSearchStatus:'STATIC_VALUES_VERIFIED'}),r=>({...r,consumerSearchStatus:'NOT_RUN'}),
    r=>({...r,typeApprovals:2}),r=>({...r,newMetadataApprovals:1}),r=>({...r,fieldScope:undefined}),r=>({...r,replay:false}),
  ];
  for(const mutate of cases){
    const f=fixture(t,{partial:true,directType:true});f.hook.result=(p,r)=>p==='projection'?mutate(r):r;
    assert.throws(()=>f.produce(),/PROJECTION_NOT_VERIFIED/);
  }
});

test('type-only direct judgment preview refuses a Consumer result of another kind or with unaccounted rows',t=>{
  const mutations=[e=>({...e,kind:'reviewed-exam-v2'}),e=>({...e,directTypeApprovals:0}),e=>({...e,newMetadataApprovals:1}),e=>({...e,approvalCreated:true}),
    e=>({...e,expectedQuestionCount:1}),e=>({...e,directTypeApprovals:2,typeNotDisplayed:-1}),e=>({...e,directTypeApprovals:1.5,typeNotDisplayed:-0.5}),e=>({...e,typeNotDisplayed:undefined}),
    e=>({...e,directTypeApprovals:'1',typeNotDisplayed:0})];
  for(const mutate of mutations){
    const f=fixture(t,{partial:true,directType:true});
    const base={changed:1,checked:1,passed:1,skippedUnchanged:0};
    f.hook.consumerResult={status:'PASS',counts:base,exams:[mutate({file:REQUEST,kind:'direct-type-judgment',sourceFile:'original/native.js',...base,
      approvalCreated:false,newMetadataApprovals:0,directTypeApprovals:1,typeNotDisplayed:0,expectedQuestionCount:24})],failures:[],unobservedFields:[],assignmentPending:[]};
    assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);
  }
  // a row the catalog does not display is still accounted for (typeNotDisplayed), not a failure
  const f=fixture(t,{partial:true,directType:true}),base={changed:1,checked:1,passed:1,skippedUnchanged:0};
  f.hook.consumerResult={status:'PASS',counts:base,exams:[{file:REQUEST,kind:'direct-type-judgment',sourceFile:'original/native.js',...base,
    approvalCreated:false,newMetadataApprovals:0,directTypeApprovals:0,typeNotDisplayed:1,expectedQuestionCount:24}],failures:[],unobservedFields:[],assignmentPending:[]};
  const out=f.produce();
  assert.equal(out.status,'PASS');
  assert.deepEqual(out.nativePreview.checks.find(c=>c.id==='native-consumer').directTypeJudgments,{requests:1,newMetadataApprovals:0,directTypeApprovals:0,typeNotDisplayed:1});
});
