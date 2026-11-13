// A one-row spelling repair, not an exam/metadata approval. The ordinary v2
// registrar's out-of-scope consumer guard is deliberately not involved/changed.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { loadCanonical, buildCompiled, compiledOutputs, buildRegistryIndex } from './compile-meta-foundation.mjs';
import { loadActiveMetaRegistry, curriculumForQuestion } from './active-registry.mjs';

export const BINDING_COURSE_CORRECTION_SCHEMA = 'archive-binding-course-correction-request-v1';
export const BINDING_COURSE_CORRECTION_RECEIPT = 'archive-binding-course-correction-receipt-v1';
const CANON = 'archive/data/meta-foundation/canonical';
const BASE = `${CANON}/packs/middle1`;
const BINDINGS = `${BASE}/bindings.json`, PACK = `${BASE}/pack.json`;
const INDEX = `${CANON}/registry_index.json`;
const COMPILED = ['aliases', 'concept_registry', 'condition_registry', 'curriculum_bindings', 'taxonomy_registry', 'meta_foundation_compiled']
  .map(name => `archive/data/meta-foundation/compiled/${name}.json`);
const META = 'archive/data/question_metadata.json', IDENTITY = 'archive/data/question_identity_map.json';
const RUNTIME = 'archive/data/meta-foundation/runtime/middle1-v1.json';
const OVERRIDES = 'archive/data/archive2-item-review-overrides.json';
const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1';
const HEX = /^[a-f0-9]{64}$/;
const UID = /^qid_v1_[a-f0-9]{64}$/;
const fail = message => { throw new Error(`BINDING_COURSE_CORRECTION: ${message}`); };
export const stableBindingCorrectionJson = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
export const bindingCorrectionSha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const sha = bindingCorrectionSha256;
const rowSha = value => sha(stableBindingCorrectionJson(value));
const same = (a, b) => stableBindingCorrectionJson(a) === stableBindingCorrectionJson(b);
const json = value => JSON.stringify(value, null, 2) + '\n';
const text = value => typeof value === 'string' && value.trim();
const blob = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const nextPatch = version => /^\d+\.\d+\.\d+$/.test(version || '') ? version.replace(/\d+$/, n => String(Number(n) + 1)) : fail('pack version invalid');
const sortedRefs = refs => [...refs].sort((a, b) => a.path.localeCompare(b.path, 'en'));

function safe(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || relative.includes('\\') || relative.includes('\0') ||
      relative.split('/').some(p => !p || p === '.' || p === '..')) fail('unsafe path');
  const base = path.resolve(root), full = path.resolve(base, relative);
  if (!full.startsWith(base + path.sep)) fail('path outside repository');
  let current = base;
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) fail(`symlink path: ${relative}`);
  }
  return full;
}
const readBytes = (root, file) => fs.readFileSync(safe(root, file));
const read = (root, file) => JSON.parse(readBytes(root, file));
const unique = (rows, key, label) => {
  if (!Array.isArray(rows)) fail(`${label} array missing`);
  const out = new Map();
  for (const r of rows) { const k = r?.[key]; if (!text(k) || out.has(k)) fail(`${label} missing/duplicate ${key}`); out.set(k, r); }
  return out;
};
const tuple = r => [r.curriculum || r.curriculumKey, r.standardCourse || r.courseKey, r.standardUnitKey, r.subUnitKey ?? null, r.problemTypeKey];
const tupleWithoutCourse = r => { const t = tuple(r); return [t[0], ...t.slice(2)]; };
const receiptPath = req => `${RECEIPTS}/${req.requestId}.binding-course-correction.json`;

// These are product/approval values, not pack-envelope versions. Missing is
// represented explicitly so an absent canonical assignment cannot become PASS.
const SEMANTIC_FIELDS = ['questionUid', 'sourceFile', 'sourceOrdinal', 'sourceKind', 'sourceGrade', 'effectiveBrowseGrade', 'identityStatus',
  'sourceIntegrityStatus', 'sourceStatus', 'sourceFingerprint', 'assignmentFingerprint', 'currentSourceJsSha256',
  'curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4', 'nativeCurriculum', 'nativeL1', 'nativeL2', 'nativeL3', 'nativeL4',
  'standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit', 'problemTypeKey', 'templateKey',
  'crossConceptKeys', 'secondaryConceptKeys', 'conditionKeys', 'integrationPattern', 'difficultyBucket', 'level',
  'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility', 'reviewStatus', 'sourceReviewStatus',
  'tagStatus', 'tagConfidence', 'metadataStatus', 'metadataRevision', 'taxonomyStatus', 'foundationTaxonomyStatus',
  'nativeMetaStatus', 'canonicalAssignmentReasons', 'metadataConflicts', 'metaBinding', 'metaHintCurriculum',
  'metaHintPT', 'metaHintTPL', 'metaHintL3', 'metaStatus', 'directSelectable', 'verifiedEligible', 'metaCompleteness', 'metaBindingMode', 'defaultSelectable',
  'sourceQualityDisposition', 'sourceIssueHold', 'sourceDefectCandidate', 'semanticDisposition', 'basicSemanticDisposition',
  'curriculumApplicability', 'rpmL1', 'rpmL2', 'rpmL3', 'rpmL4', 'rpmSemanticStatus', 'rpmEvidenceDebtFields'];
function semanticRow(row) {
  if (!row) return null;
  const result = Object.fromEntries(SEMANTIC_FIELDS.map(k => [k, Object.hasOwn(row, k) ? row[k] : null]));
  const evidence = row.assignmentEvidence;
  result.assignmentApproval = evidence ? Object.fromEntries(['approvalStatus', 'taxonomyVersion', 'store',
    'sourceFingerprint', 'assignmentFingerprint', 'reviewEvidence'].map(k => [k, evidence[k] ?? null])) : null;
  return result;
}

export function captureBindingCourseConsumers(consumer, runtimeRows) {
  return runtimeRows.map(r => {
    const source = r.sourceArchiveFile || r.sourceFile;
    const resolved = consumer.resolvedBySource.get(`${source}#${Number(r.sourceOrdinal)}`);
    if (!resolved || resolved.questionUid !== r.questionUid) fail(`consumer UID missing/mismatch: ${r.questionUid}`);
    const page = consumer.pageByUid.get(r.questionUid);
    return { questionUid: r.questionUid, resolvedSha256: rowSha(semanticRow(resolved)), pageSha256: rowSha(semanticRow(page)),
      canonicalReasons: resolved.canonicalAssignmentReasons ?? null,
      assignmentApprovalStatus: resolved.assignmentEvidence?.approvalStatus ?? null,
      directSelectable: page?.directSelectable ?? null };
  }).sort((a, b) => a.questionUid.localeCompare(b.questionUid, 'en'));
}

async function officialConsumer(root) {
  // Imported lazily: the same gate dispatches this request type at final verify.
  const { loadConsumer } = await import('./verify-changed-uid-consumer-approval.mjs');
  return loadConsumer(root);
}

function validateCorrection(req) {
  const correction = req.correction;
  if (!correction || correction.path !== BINDINGS || correction.collection !== 'bindings' ||
      !correction.before || !correction.after) fail('one middle1 binding correction required');
  const b = correction.before, a = correction.after;
  if (b.standardCourse !== '中1 수학' || a.standardCourse !== '중1 수학' ||
      b.ownerPack !== 'MIDDLE1' || b.status !== 'ACTIVE' || !['2015', '2022'].includes(b.curriculum) ||
      !same({ ...b, standardCourse: a.standardCourse }, a)) fail('only the literal standardCourse spelling may change');
}

function facts(root, req) {
  if (!/^original\/middle\/m1\/(?:1|2)(?:mid|final)\/[^/]+\.js$/.test(req.sourceArchiveFile || '')) fail('one original M1 exam required');
  validateCorrection(req);
  const { before: b, after: a } = req.correction;
  const cache = new Map();
  const bytes = file => { if (!cache.has(file)) cache.set(file, readBytes(root, file)); return cache.get(file); };
  const data = file => JSON.parse(bytes(file));
  const pack = data(PACK), index = data(INDEX), bindings = data(BINDINGS);
  if (pack.canonicalStatus !== 'ACTIVE' || pack.packId !== 'MIDDLE1' ||
      !pack.standardCourses?.includes(a.standardCourse) || pack.standardCourses.includes(b.standardCourse) ||
      !pack.curricula?.includes(a.curriculum) || !index.activePacks?.some(p => p.id === pack.packId && p.status === 'ACTIVE' && p.version === pack.packVersion))
    fail('ACTIVE pack / canonical target course / pack index required');
  const rowMatches = bindings.bindings?.map((r, i) => same(r, b) ? i : -1).filter(i => i >= 0) || [];
  if (rowMatches.length !== 1) fail('exact before binding missing/ambiguous');
  const allBindings = [];
  for (const p of index.activePacks || []) {
    const base = `${CANON}/packs/${p.id.toLowerCase().replaceAll('_', '-')}`;
    for (const r of data(`${base}/bindings.json`).bindings || []) allBindings.push(r);
  }
  if (allBindings.filter(r => r.status === 'ACTIVE' && same(tuple(r), tuple(b))).length !== 1 ||
      allBindings.some(r => r.status === 'ACTIVE' && same(tuple(r), tuple(a)))) fail('duplicate old/corrected binding tuple');
  const taxonomy = data(`${BASE}/taxonomy.json`);
  if (taxonomy.problemTypes?.filter(p => p.problemTypeKey === b.problemTypeKey && p.status === 'ACTIVE' && p.ownerPack === 'MIDDLE1').length !== 1)
    fail('ACTIVE unchanged PT required');
  data(`${BASE}/aliases.json`);
  // Bind every compiler input before the asynchronous consumer read. The plan
  // must compile this snapshot and refuse any concurrent raw input change.
  loadCanonical(data);
  for (const source of index.canonicalSources || []) bytes(source.path);
  for (const file of COMPILED) bytes(file);
  const metadata = data(META), identity = data(IDENTITY), overrides = data(OVERRIDES);
  const byUid = unique(metadata.records, 'questionUid', 'metadata'), ids = unique(identity.records, 'questionUid', 'identity');
  if (overrides.schemaVersion !== 'archive2-item-review-override-index-v1') fail('prior override index schema');
  const runtimeFiles = fs.readdirSync(safe(root, 'archive/data/meta-foundation/runtime')).filter(f => f.endsWith('.json') && f !== 'runtime-bridge-receipt.json').sort();
  const runtimeByUid = new Map(), runtimePackIds = new Set();
  for (const f of runtimeFiles) {
    const file = `archive/data/meta-foundation/runtime/${f}`, runtime = data(file);
    if (!text(runtime.packId) || runtimePackIds.has(runtime.packId) || !Array.isArray(runtime.records)) fail(`runtime pack/records missing or duplicate: ${file}`);
    runtimePackIds.add(runtime.packId);
    for (const r of runtime.records) {
      if (!UID.test(r.questionUid || '') || runtimeByUid.has(r.questionUid)) fail('runtime UID missing/duplicate');
      runtimeByUid.set(r.questionUid, { row: r, file, packId: runtime.packId });
    }
  }
  const runtime = data(RUNTIME);
  if (runtime.status !== 'ACTIVE' || runtime.packId !== pack.packId || runtime.packVersion !== pack.packVersion)
    fail('VERSION_PRECONDITION_FAILED: canonical and runtime must already have the same version');
  if (typeof runtime.runtimeVersion !== 'string' || !runtime.runtimeVersion.startsWith(`${pack.packId}@${pack.packVersion}/`))
    fail('runtime version envelope malformed');
  const matches = r => same(tupleWithoutCourse(r), tupleWithoutCourse(b)) && [b.standardCourse, a.standardCourse].includes(tuple(r)[1]);
  const affected = new Set();
  for (const r of metadata.records) if (matches(r)) affected.add(r.questionUid);
  for (const [uid, entry] of runtimeByUid) if (matches({ ...byUid.get(uid), ...entry.row })) affected.add(uid);
  if (!Array.isArray(b.supportingQuestionUids) || b.supportingItemCount !== b.supportingQuestionUids.length || new Set(b.supportingQuestionUids).size !== b.supportingQuestionUids.length)
    fail('binding supporting UID denominator');
  for (const uid of b.supportingQuestionUids) affected.add(uid);
  if (!affected.size) fail('existing approved consumers required');
  const preserved = [];
  for (const uid of [...affected].sort()) {
    const m = byUid.get(uid), id = ids.get(uid), entry = runtimeByUid.get(uid), r = entry?.row;
    if (!m || !id || !r || !UID.test(uid) || !matches(m) || !matches({ ...m, ...r }) ||
        m.standardCourse !== a.standardCourse || (r.standardCourse ?? m.standardCourse) !== a.standardCourse)
      fail(`old spelling / incomplete consumer cannot be migrated: ${uid}`);
    if (m.sourceArchiveFile !== req.sourceArchiveFile || id.sourceArchiveFile !== req.sourceArchiveFile ||
        r.sourceArchiveFile !== req.sourceArchiveFile || m.sourceOrdinal !== id.sourceOrdinal || m.sourceOrdinal !== r.sourceOrdinal ||
        entry.file !== RUNTIME || m.reviewStatus !== 'reviewed_pass' || r.reviewStatus !== 'reviewed_pass' ||
        !String(m.metadataStatus).startsWith('approved_') || !String(r.metadataStatus).startsWith('approved_') ||
        id.sourceFingerprint !== m.sourceFingerprint)
      fail(`foreign exam or unapproved preserved consumer: ${uid}`);
    for (const k of ['curriculum', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'problemTypeKey', 'templateKey', 'sourceFingerprint'])
      if (!same(m[k], r[k])) fail(`metadata/runtime provenance mismatch: ${uid}.${k}`);
    if (taxonomy.templates?.filter(t => t.templateKey === m.templateKey && t.parentProblemTypeKey === b.problemTypeKey && t.status === 'ACTIVE').length !== 1)
      fail(`ACTIVE unchanged template required: ${uid}`);
    const proofPath = `archive/data/meta-foundation/evidence/review-overrides/v1/${uid}.json`, proofBytes = bytes(proofPath), proof = JSON.parse(proofBytes);
    const indexed = overrides.records.filter(x => x.questionUid === uid);
    const decision = proof.latestAcceptedReview2;
    if (indexed.length !== 1 || indexed[0].evidenceReference !== proofPath.slice('archive/'.length) || indexed[0].evidenceSha256 !== sha(proofBytes) ||
        !same(Object.fromEntries(Object.entries(indexed[0]).filter(([k]) => !['evidenceReference', 'evidenceSha256'].includes(k))), proof) ||
        proof.schemaVersion !== 'archive-review2-runtime-override/v1' || proof.questionUid !== uid ||
        proof.sourceArchiveFile !== req.sourceArchiveFile || proof.sourceOrdinal !== m.sourceOrdinal || proof.sourceFingerprint !== m.sourceFingerprint ||
        !HEX.test(proof.sourceFingerprint || '') || !['PASS', 'REPAIR'].includes(decision?.status) || decision?.runtimePackId !== pack.packId ||
        !['decisionId', 'decisionReason', 'evidencePath', 'decisionAt'].every(k => text(decision[k]))) fail(`existing compact R2 proof mismatch: ${uid}`);
    preserved.push({ questionUid: uid, sourceOrdinal: m.sourceOrdinal, metadataRowSha256: rowSha(m), identityRowSha256: rowSha(id),
      runtimeRowSha256: rowSha(r), priorProof: { path: proofPath, sha256: sha(proofBytes) } });
  }
  const sourcePath = `archive/exams/${req.sourceArchiveFile}`, sourceBytes = bytes(sourcePath);
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(sourceBytes.toString('utf8'), context, { timeout: 5000 });
  const bank = context.window.questionBank || context.window.questions;
  if (!Array.isArray(bank) || !bank.length || metadata.records.filter(r => r.sourceArchiveFile === req.sourceArchiveFile).length !== bank.length ||
      identity.records.filter(r => r.sourceArchiveFile === req.sourceArchiveFile).length !== bank.length ||
      preserved.some(r => !Number.isInteger(r.sourceOrdinal) || r.sourceOrdinal < 1 || r.sourceOrdinal > bank.length)) fail('source/metadata/identity exam denominator');
  for (const row of preserved) {
    const q = bank[row.sourceOrdinal - 1], m = byUid.get(row.questionUid), id = ids.get(row.questionUid);
    const questionNo = String(q.sourceQuestionNo ?? q.id ?? '');
    if (!questionNo || questionNo !== m.sourceQuestionNo || questionNo !== id.sourceQuestionNo ||
        curriculumForQuestion({ ...q, sourceArchiveFile: req.sourceArchiveFile }) !== m.curriculum)
      fail(`current source question number/curriculum mismatch: ${row.questionUid}`);
    for (const k of ['standardCourse', 'standardUnitKey', 'subUnitKey', 'problemTypeKey', 'templateKey'])
      if (!same(q[k], m[k])) fail(`current source classification mismatch: ${row.questionUid}.${k}`);
  }
  return { cache, bytes, data, pack, index, bindings, runtime, taxonomy, rowIndex: rowMatches[0], preserved,
    expectedSourceBlobSha1: blob(sourceBytes), expectedSourceSha256: sha(sourceBytes), expectedQuestionCount: bank.length,
    runtimeRecordsSha256: rowSha(runtime.records), versionBefore: { packVersion: pack.packVersion, runtimeVersion: runtime.runtimeVersion },
    beforeDocuments: [BINDINGS, PACK, RUNTIME, INDEX].map(path => ({ path, sha256: rowSha(data(path)) })),
    beforeFiles: sortedRefs([...cache].map(([path, value]) => ({ path, sha256: sha(value), sizeBytes: value.length }))) };
}

// Read-only request builder: the model selects the exact binding; hashes and
// impact denominators come from current canonical files, never hand-written.
export async function createBindingCourseCorrectionRequest({ root, requestId, sourceArchiveFile, requestedBy, reason, before }) {
  const req = { schemaVersion: BINDING_COURSE_CORRECTION_SCHEMA, requestId, sourceArchiveFile, requestedBy, reason,
    correction: { path: BINDINGS, collection: 'bindings', before, after: { ...before, standardCourse: '중1 수학' } } };
  const f = facts(root, req);
  const consumerBefore = captureBindingCourseConsumers(await officialConsumer(root), f.runtime.records);
  return { ...req, expectedSourceBlobSha1: f.expectedSourceBlobSha1, expectedSourceSha256: f.expectedSourceSha256,
    expectedQuestionCount: f.expectedQuestionCount, beforeFiles: f.beforeFiles,
    beforeDocuments: f.beforeDocuments, versionBefore: f.versionBefore, expectedConsumerStateSha256: rowSha(consumerBefore),
    runtimeRecordsSha256: f.runtimeRecordsSha256, preservedConsumers: f.preserved };
}

function validateRequestShape(req) {
  const allowed = ['schemaVersion', 'requestId', 'sourceArchiveFile', 'requestedBy', 'reason', 'correction',
    'expectedSourceBlobSha1', 'expectedSourceSha256', 'expectedQuestionCount', 'beforeFiles', 'beforeDocuments', 'versionBefore',
    'expectedConsumerStateSha256', 'runtimeRecordsSha256', 'preservedConsumers'];
  if (req.schemaVersion !== BINDING_COURSE_CORRECTION_SCHEMA || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,90}$/.test(req.requestId || '') ||
      !text(req.requestedBy) || !text(req.reason) || Object.keys(req).some(k => !allowed.includes(k)) ||
      !same(Object.keys(req.correction || {}).sort(), ['after', 'before', 'collection', 'path']) ||
      !HEX.test(req.expectedConsumerStateSha256 || '')) fail('request schema/scope; no approval or metadata delta accepted');
  validateCorrection(req);
}

function validateRequest(root, req) {
  validateRequestShape(req);
  const f = facts(root, req);
  for (const k of ['expectedSourceBlobSha1', 'expectedSourceSha256', 'expectedQuestionCount', 'runtimeRecordsSha256', 'beforeFiles', 'beforeDocuments', 'versionBefore'])
    if (!same(req[k], f[k])) fail(`stale/incorrect ${k}`);
  if (!same(req.preservedConsumers, f.preserved)) fail('preserved consumer set/hash mismatch; missing/extra/changed impact UID');
  const active = loadActiveMetaRegistry(root);
  if (active.status !== 'ACTIVE') fail(`active registry unavailable: ${active.errors.join(', ')}`);
  return f;
}

function plan(root, req, f, beforeConsumer) {
  const version = nextPatch(f.pack.packVersion);
  const bindings = structuredClone(f.bindings); bindings.bindings[f.rowIndex] = structuredClone(req.correction.after);
  const pack = { ...f.pack, packVersion: version };
  const runtime = { ...f.runtime, packVersion: version, runtimeVersion: f.runtime.runtimeVersion.replace(`${f.pack.packId}@${f.pack.packVersion}/`, `${f.pack.packId}@${version}/`) };
  if (!same(runtime.records, f.runtime.records) || !same({ ...runtime, packVersion: f.runtime.packVersion, runtimeVersion: f.runtime.runtimeVersion }, f.runtime)) fail('runtime record/envelope scope');
  const docs = new Map([[BINDINGS, bindings], [PACK, pack]]);
  const reader = file => docs.has(file) ? docs.get(file) : f.data(file);
  const canonical = loadCanonical(reader), compiled = buildCompiled(canonical), output = compiledOutputs(canonical, compiled);
  output.set(BINDINGS, json(bindings)); output.set(PACK, json(pack)); output.set(RUNTIME, json(runtime));
  output.set(INDEX, json(buildRegistryIndex(canonical, output, file => output.get(file) ?? f.bytes(file).toString('utf8'))));
  for (const [file, value] of [...output]) if (fs.existsSync(safe(root, file)) && readBytes(root, file).equals(Buffer.from(value))) output.delete(file);
  const beforeRuntimeUids = f.runtime.records.map(r => r.questionUid).sort();
  const receipt = { schemaVersion: BINDING_COURSE_CORRECTION_RECEIPT, requestId: req.requestId, requestSha256: rowSha(req),
    operation: 'BINDING_COURSE_SPELLING_CORRECTION', status: 'CORRECTED_EXISTING_BINDING', approvalCreated: false,
    sourceArchiveFile: req.sourceArchiveFile, expectedSourceBlobSha1: req.expectedSourceBlobSha1,
    correction: req.correction, packVersionBefore: f.pack.packVersion, packVersionAfter: version,
    protectedFiles: f.beforeFiles.filter(r => !output.has(r.path)), runtimeRecordsSha256: f.runtimeRecordsSha256,
    preservedConsumers: f.preserved, runtimeConsumerUids: beforeRuntimeUids, consumerBefore: beforeConsumer,
    consumerBeforeSha256: rowSha(beforeConsumer), outputs: [...output].map(([path, value]) => ({ path, sha256: sha(value) })),
    metadataApprovalStatus: 'NOT_CREATED', examFinalQaStatus: 'NOT_EVALUATED', consumerVerification: 'REQUIRES_POST_BUILD_COMPARISON' };
  output.set(receiptPath(req), json(receipt));
  return { output, receipt };
}

function checkReceiptFiles(root, req) {
  validateRequestShape(req);
  const file = receiptPath(req), receipt = read(root, file);
  const version = nextPatch(req.versionBefore?.packVersion);
  if (receipt.schemaVersion !== BINDING_COURSE_CORRECTION_RECEIPT || receipt.requestId !== req.requestId ||
      receipt.requestSha256 !== rowSha(req) || receipt.approvalCreated !== false || receipt.metadataApprovalStatus !== 'NOT_CREATED' ||
      receipt.operation !== 'BINDING_COURSE_SPELLING_CORRECTION' || receipt.status !== 'CORRECTED_EXISTING_BINDING' ||
      receipt.examFinalQaStatus !== 'NOT_EVALUATED' || receipt.sourceArchiveFile !== req.sourceArchiveFile ||
      receipt.expectedSourceBlobSha1 !== req.expectedSourceBlobSha1 || receipt.runtimeRecordsSha256 !== req.runtimeRecordsSha256 ||
      !same(receipt.correction, req.correction) || !same(receipt.preservedConsumers, req.preservedConsumers) ||
      rowSha(receipt.consumerBefore) !== receipt.consumerBeforeSha256 || receipt.consumerBeforeSha256 !== req.expectedConsumerStateSha256 ||
      receipt.packVersionBefore !== req.versionBefore?.packVersion || receipt.packVersionAfter !== version) fail('receipt request/provenance mismatch');
  const beforeFiles = unique(req.beforeFiles, 'path', 'before files');
  if (req.beforeFiles.some(ref => !HEX.test(ref.sha256 || '') || !Number.isSafeInteger(ref.sizeBytes) || ref.sizeBytes < 0)) fail('before file hash/size missing');
  const runtime = read(root, RUNTIME);
  if (rowSha(runtime.records) !== receipt.runtimeRecordsSha256 ||
      !same(runtime.records.map(r => r.questionUid).sort(), receipt.runtimeConsumerUids)) fail('preserved runtime records/UID drift');
  const pack = read(root, PACK);
  if (pack.packVersion !== version || runtime.packVersion !== version)
    fail('corrected pack/runtime version mismatch');
  const currentBindings = read(root, BINDINGS), matching = currentBindings.bindings.map((r, i) => same(r, req.correction.after) ? i : -1).filter(i => i >= 0);
  if (matching.length !== 1) fail('corrected binding missing/ambiguous');
  const previousBindings = structuredClone(currentBindings); previousBindings.bindings[matching[0]] = req.correction.before;
  const index = read(root, INDEX), previousIndex = structuredClone(index);
  for (const entry of previousIndex.activePacks || []) if (entry.id === 'MIDDLE1') entry.version = req.versionBefore.packVersion;
  for (const ref of [...(previousIndex.canonicalSources || []), ...(previousIndex.compiledArtifacts || [])]) {
    const before = beforeFiles.get(ref.path);
    if (!before) fail(`unbound compiler input/output: ${ref.path}`);
    ref.sha256 = before.sha256; ref.sizeBytes = before.sizeBytes;
  }
  const reconstructed = new Map([[BINDINGS, previousBindings], [PACK, { ...pack, packVersion: req.versionBefore.packVersion }],
    [INDEX, previousIndex],
    [RUNTIME, { ...runtime, packVersion: req.versionBefore.packVersion, runtimeVersion: req.versionBefore.runtimeVersion }]]);
  if (!same([...unique(req.beforeDocuments, 'path', 'before documents').keys()].sort(), [...reconstructed.keys()].sort()) ||
      req.beforeDocuments.some(ref => rowSha(reconstructed.get(ref.path)) !== ref.sha256))
    fail('mutation beyond the one course field / version envelope / derived index');
  if (runtime.runtimeVersion !== req.versionBefore.runtimeVersion.replace(`MIDDLE1@${req.versionBefore.packVersion}/`, `MIDDLE1@${version}/`))
    fail('runtime version envelope mismatch');

  // Never trust a receipt's self-declared output/protection lists. Regenerate
  // deterministic outputs from the preserved canonical state, then derive both
  // exact sets from the request-bound baseline. This also checks unchanged
  // compiled files and prevents a receipt from hiding an unrelated mutation.
  const canonical = loadCanonical(path => {
    if (!beforeFiles.has(path)) fail(`unbound compiler input: ${path}`);
    return read(root, path);
  });
  const expected = compiledOutputs(canonical, buildCompiled(canonical));
  if (!same([...expected.keys()].sort(), [...COMPILED].sort())) fail('compiler output scope changed');
  expected.set(BINDINGS, json(currentBindings)); expected.set(PACK, json(pack)); expected.set(RUNTIME, json(runtime));
  expected.set(INDEX, json(buildRegistryIndex(canonical, expected, path => expected.get(path) ?? readBytes(root, path).toString('utf8'))));
  for (const [path, value] of [...expected]) {
    if (!beforeFiles.has(path)) fail(`unbound output baseline: ${path}`);
    if (sha(value) === beforeFiles.get(path).sha256) expected.delete(path);
  }
  if (![BINDINGS, PACK, RUNTIME, INDEX].every(path => expected.has(path))) fail('required correction output missing');
  const outputRefs = sortedRefs([...expected].map(([path, value]) => ({ path, sha256: sha(value) })));
  const protectedRefs = sortedRefs(req.beforeFiles.filter(ref => !expected.has(ref.path)));
  if (!Array.isArray(receipt.outputs) || !Array.isArray(receipt.protectedFiles) ||
      !same(sortedRefs(receipt.outputs), outputRefs) || !same(sortedRefs(receipt.protectedFiles), protectedRefs))
    fail('receipt output/protected file set mismatch');
  for (const ref of [...protectedRefs, ...outputRefs]) {
    const bytes = readBytes(root, ref.path);
    if (sha(bytes) !== ref.sha256 || (ref.sizeBytes !== undefined && bytes.length !== ref.sizeBytes)) fail(`receipt file drift: ${ref.path}`);
  }
  return { receipt, runtime };
}

export function verifyBindingCourseCorrectionWithConsumer({ root, request, consumer }) {
  const { receipt, runtime } = checkReceiptFiles(root, request);
  const after = captureBindingCourseConsumers(consumer, runtime.records);
  if (!same(after, receipt.consumerBefore)) {
    const before = new Map(receipt.consumerBefore.map(r => [r.questionUid, r]));
    const changed = after.filter(r => !same(r, before.get(r.questionUid))).map(r => r.questionUid);
    fail(`consumer classification/approval/selection changed: ${changed.join(', ')}`);
  }
  return { status: 'PASS', verificationKind: 'EXISTING_CONSUMERS_PRESERVED', approvalCreated: false,
    bindingRowsCorrected: 1, affectedBindingUidCount: receipt.preservedConsumers.length, checkedRuntimeUids: after.length,
    sourceArchiveFile: request.sourceArchiveFile, receiptPath: receiptPath(request) };
}

export async function registerBindingCourseCorrection({ root, request: req, write = false, verifyProjection = false }) {
  if (write && verifyProjection) fail('--verify-projection is read-only');
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,90}$/.test(req?.requestId || '')) fail('requestId invalid');
  const file = receiptPath(req);
  if (fs.existsSync(safe(root, file))) {
    const checked = checkReceiptFiles(root, req);
    if (verifyProjection) return verifyBindingCourseCorrectionWithConsumer({ root, request: req, consumer: await officialConsumer(root) });
    return { status: 'REPLAY', approvalCreated: false, consumerVerification: 'NOT_RUN', receiptPath: file, checkedRuntimeUids: checked.runtime.records.length };
  }
  if (verifyProjection) fail('correction receipt required before --verify-projection');
  const f = validateRequest(root, req);
  const baseline = captureBindingCourseConsumers(await officialConsumer(root), f.runtime.records);
  if (rowSha(baseline) !== req.expectedConsumerStateSha256) fail('consumer baseline drift');
  const { output, receipt } = plan(root, req, f, baseline);
  if (!write) return { status: 'DRY_RUN', approvalCreated: false, consumerVerification: 'POST_BUILD_NOT_RUN',
    affectedBindingUidCount: f.preserved.length, checkedRuntimeUids: baseline.length, plannedPaths: [...output.keys()] };
  for (const ref of f.beforeFiles) if (sha(readBytes(root, ref.path)) !== ref.sha256) fail(`input changed during plan: ${ref.path}`);
  const backups = new Map([...output.keys()].map(file => [file, fs.existsSync(safe(root, file)) ? readBytes(root, file) : null]));
  try {
    for (const [file, value] of output) { const full = safe(root, file); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, value); }
    checkReceiptFiles(root, req);
  } catch (error) {
    for (const [file, value] of backups) { if (value === null) fs.rmSync(safe(root, file), { force: true }); else fs.writeFileSync(safe(root, file), value); }
    throw error;
  }
  return { status: 'REGISTERED_CORRECTION', approvalCreated: false, consumerVerification: 'POST_BUILD_NOT_RUN',
    affectedBindingUidCount: receipt.preservedConsumers.length, checkedRuntimeUids: baseline.length, receiptPath: file };
}
