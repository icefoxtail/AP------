'use strict';

// Evidence-bounded legacy Meta projection for the immutable 2026-10-09 323 UID cutover.
// This edits only index/shard metadataProjection fields; generated source questions,
// approval state, and answer-bearing content are never rewritten.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '../..');
const INDEX_REL = 'archive/data/generated-lite-consumer/v1/index.json';
const CUTOVER_REL = 'archive/data/generated-lite-consumer/v1/meta-retention-cutover-20261009.json';
const CROSSWALK_REL = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json';
const RPM_MASTER_REL = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const LEDGER_REL = 'archive/data/generated-lite-consumer/v1/legacy-meta-evidence-323.json';
const SCHEMA = 'PROBLEM_BANK_META_PROJECTION_V1';
const UNVERIFIED_DIFFICULTY_UIDS = new Set([
  'ALITE-20261008-HYC26-Q18-001', 'ALITE-20261008-HYC26-Q18-002', 'ALITE-20261008-HYC26-Q18-004',
  'ALITE-20261008-HYC26-Q20-001', 'ALITE-20261008-HYC26-Q20-002', 'ALITE-20261008-HYC26-Q20-003', 'ALITE-20261008-HYC26-Q20-004'
]);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const fileSha = rel => sha(fs.readFileSync(path.join(ROOT, rel)));
const readJson = rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const canonical = value => JSON.stringify(sort(value));
function sort(value) {
  if (Array.isArray(value)) return value.map(sort);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, sort(value[k])]));
  return value;
}
function gitBlobSha(bytes) {
  return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
}
function sourceQuestions(rel) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), sandbox, { timeout: 2000, filename: rel });
  if (!Array.isArray(sandbox.window.questionBank)) throw new Error(`SOURCE_QUESTION_BANK_INVALID:${rel}`);
  return sandbox.window.questionBank;
}
function sourceMetaRel(sourceRel) {
  const rel = sourceRel.replace('/shards/', '/metadata/').replace(/\.js$/, '.json');
  if (rel === sourceRel) throw new Error(`SOURCE_METADATA_PATH_UNRESOLVED:${sourceRel}`);
  return rel;
}
function labelMatches(raw, expected) {
  if (typeof raw !== 'string' || typeof expected !== 'string') return false;
  const value = raw.trim();
  // Legacy label-only form is accepted as-is. New code|label forms retain the
  // code and are compared by their complete suffix; no code-stripping rewrite occurs.
  if (value === expected) return true;
  const delimiter = value.lastIndexOf('|');
  return delimiter > 0 && value.slice(delimiter + 1).trim() === expected;
}
function deriveMetaBrowsePath(input, records) {
  const rows = Array.isArray(records) ? records : [];
  const authority = arguments[2] || {};
  if (!['RPM_LOCKED', 'RPM_EXISTING_DRAFT'].includes(input?.rpmL4Namespace)) return { status: 'UNKNOWN', reason: 'RPM_NAMESPACE_UNKNOWN' };
  if (input.rpmL4Namespace === 'RPM_LOCKED' && authority.status !== 'LOCKED') return { status: 'UNKNOWN', reason: 'RPM_LOCKED_AUTHORITY_UNVERIFIED' };
  if (input.rpmL4Namespace === 'RPM_EXISTING_DRAFT' &&
      (!/CANONICAL_DRAFT/i.test(authority.policyL3L4 || '') || !input.rpmDraftAuthorityRef || !/^[a-f0-9]{64}$/i.test(input.rpmDraftAuthoritySha256 || '')))
    return { status: 'UNKNOWN', reason: 'RPM_DRAFT_AUTHORITY_UNVERIFIED' };
  const matches = rows.filter(row => row.id === input?.rpmPrimaryRecordId || row.id === input?.recordId);
  if (matches.length !== 1) return { status: 'UNKNOWN', reason: matches.length ? 'RPM_RECORD_ID_AMBIGUOUS' : 'RPM_RECORD_ID_NOT_FOUND' };
  const row = matches[0];
  const path = row.rpmPath || {};
  const parentMatches = row.standardCourse === input.standardCourse && row.standardUnitKey === input.standardUnitKey && row.subUnitKey === input.subUnitKey;
  const labelsMatch = labelMatches(input.rpmL1, path.majorUnit) && labelMatches(input.rpmL2, path.midUnit) &&
    labelMatches(input.rpmL3, path.l3) && labelMatches(input.rpmL4, path.l4);
  const bucket = input.difficultyBucket;
  const bucketExact = Number.isInteger(bucket) && bucket >= 1 && bucket <= 5 && bucket === input.expectedDifficultyBucket;
  if (!parentMatches || !labelsMatch || !bucketExact) return { status: 'UNKNOWN', reason: !parentMatches ? 'RPM_PARENT_MISMATCH' : !labelsMatch ? 'RPM_LABEL_MISMATCH' : 'DIFFICULTY_EVIDENCE_MISMATCH' };
  return { status: 'EXACT_AUTHORITY_ALIAS', metaBrowsePath: { L1: path.majorUnit, L2: path.midUnit, L3: path.l3, L4: path.l4 }, authority: { id: row.id, standardCourse: row.standardCourse, standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey } };
}
function shaRecord(rel, bytes) {
  return { path: rel, sha256: sha(bytes), gitBlobSha1: gitBlobSha(bytes) };
}
function valueFrom(...values) { return values.find(v => v !== undefined && v !== null && v !== '') ?? null; }
function addEvidence(evidence, fullEvidence, debt, field, value, ref, reason, status = 'EXACT_SOURCE') {
  if (value === undefined || value === null || value === '') {
    evidence[field] = { status: 'UNKNOWN', evidenceKey: `${field}` };
    fullEvidence[field] = { status: 'UNKNOWN', ref: ref || null, reason: reason || 'NO_EXACT_SOURCE_VALUE' };
    debt.push({ field, status: 'EVIDENCE_DEBT', reason: reason || 'NO_EXACT_SOURCE_VALUE' });
    return null;
  }
  evidence[field] = { status, evidenceKey: `${field}` };
  fullEvidence[field] = { status, ref, reason: reason || null };
  return value;
}
function nestedRecord(parsed, uid) {
  if (parsed?.generatedQuestionUid === uid) return parsed;
  const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed.records) ? parsed.records : [];
  const matches = rows.filter(row => row.uid === uid || row.generatedUid === uid || row.generatedQuestionUid === uid || row.questionUid === uid);
  if (matches.length !== 1) return null;
  return matches[0];
}
function compactFieldEvidence(fieldEvidence, sourceRefs) {
  const refKeyByPath = new Map(Object.entries(sourceRefs).map(([key, ref]) => [ref?.path, key]));
  const keysFor = ref => {
    if (!ref) return [];
    if (Array.isArray(ref)) return [...new Set(ref.flatMap(keysFor))];
    if (ref.path) return refKeyByPath.has(ref.path) ? [refKeyByPath.get(ref.path)] : [];
    if (typeof ref === 'object') return [...new Set(Object.values(ref).flatMap(keysFor))];
    return [];
  };
  return Object.fromEntries(Object.entries(fieldEvidence).map(([field, entry]) => [field, {
    status: entry.status,
    sourceRefKeys: keysFor(entry.ref),
    reason: entry.reason || null
  }]));
}
function createProjection({ uid, row, record, consumerQuestion, sourceQuestion, metaRow, crosswalkById, refs, namespaceEvidence }) {
  const projection = { schemaVersion: SCHEMA, uid, status: 'LEGACY_NOT_RECERTIFIED' };
  const evidenceByField = {};
  const fullEvidence = {};
  const evidenceDebt = [];
  const sourceMeta = metaRow?.classification || metaRow?.meta || metaRow || {};
  const sourceQuestionMeta = metaRow?.question || {};
  const q = consumerQuestion || {};
  const s = sourceQuestion || {};
  const sourceRef = refs.source;
  const consumerRef = refs.consumerShardBefore;
  const metaRef = refs.meta;
  const fieldSources = {};
  const choose = (field, candidates) => {
    const found = candidates.find(item => item.value !== undefined && item.value !== null && item.value !== '');
    fieldSources[field] = found?.ref || null;
    return found?.value ?? null;
  };
  const curriculum = {
    standardCourse: choose('standardCourse', [{ value: s.standardCourse, ref: sourceRef }, { value: q.standardCourse, ref: consumerRef }, { value: sourceQuestionMeta.standardCourse, ref: metaRef }, { value: record.standardCourse, ref: consumerRef }]),
    standardUnitKey: choose('standardUnitKey', [{ value: s.standardUnitKey, ref: sourceRef }, { value: q.standardUnitKey, ref: consumerRef }, { value: sourceQuestionMeta.standardUnitKey, ref: metaRef }, { value: record.standardUnitKey, ref: consumerRef }]),
    subUnitKey: choose('subUnitKey', [{ value: s.subUnitKey, ref: sourceRef }, { value: q.subUnitKey, ref: consumerRef }, { value: sourceQuestionMeta.subUnitKey, ref: metaRef }, { value: record.subUnitKey, ref: consumerRef }])
  };
  for (const [field, value] of Object.entries(curriculum)) {
    projection[field] = addEvidence(evidenceByField, fullEvidence, evidenceDebt, field, value, fieldSources[field], 'CURRICULUM_VALUE_MISSING');
  }
  const candidateIds = [record.rpmPrimary?.recordId, record.rpmPrimary?.id, metaRow?.rpmPrimaryRecordId, metaRow?.rpmCrosswalkId,
    metaRow?.rpmPrimary?.recordId, metaRow?.rpmPrimary?.id, sourceMeta.rpmPrimary?.recordId, sourceMeta.rpmPrimary?.id, sourceMeta.rpmPrimaryRecordId]
    .filter(value => typeof value === 'string' && value.length);
  const rpmId = candidateIds[0] || null;
  const cross = rpmId ? crosswalkById.get(rpmId) : null;
  const candidateLabelsL3 = [record.rpmPrimary?.l3, sourceMeta.rpmPrimary?.l3, sourceMeta.rpmL3, sourceMeta.rpmL3Label].filter(v => typeof v === 'string' && v.length);
  const candidateLabelsL4 = [record.rpmPrimary?.l4, sourceMeta.rpmPrimary?.l4, sourceMeta.rpmL4, sourceMeta.rpmL4Label].filter(v => typeof v === 'string' && v.length);
  const crossMatches = Boolean(cross &&
    new Set(candidateIds).size === 1 &&
    cross.standardCourse === curriculum.standardCourse &&
    cross.standardUnitKey === curriculum.standardUnitKey &&
    cross.subUnitKey === curriculum.subUnitKey &&
    candidateLabelsL3.every(value => value === cross.rpmPath?.l3) && candidateLabelsL4.every(value => value === cross.rpmPath?.l4) &&
    (candidateLabelsL3.length > 0) && (candidateLabelsL4.length > 0) &&
    (!sourceMeta.l1 || sourceMeta.l1 === cross.standardUnitKey) &&
    (!sourceMeta.l2 || sourceMeta.l2 === cross.subUnitKey));
  const mappingAttempt = {
    candidateRecordId: rpmId,
    candidateLabels: {
      l1: valueFrom(sourceMeta.rpmL1, sourceMeta.l1),
      l2: valueFrom(sourceMeta.rpmL2, sourceMeta.l2),
      l3: valueFrom(record.rpmPrimary?.l3, sourceMeta.rpmPrimary?.l3, sourceMeta.rpmL3),
      l4: valueFrom(record.rpmPrimary?.l4, sourceMeta.rpmPrimary?.l4, sourceMeta.rpmL4)
    },
    crosswalkCandidateFound: Boolean(cross),
    exactParentAndLabelMatch: crossMatches,
    authorityRef: refs.crosswalk.path,
    authoritySha256: refs.crosswalk.sha256
  };
  const namespace = namespaceEvidence?.policyDraft === true ? 'RPM_EXISTING_DRAFT' : namespaceEvidence?.policyLocked === true ? 'RPM_LOCKED' : null;
  const rpmFields = {
    rpmPrimaryRecordId: crossMatches ? rpmId : null,
    rpmL1: crossMatches ? cross.rpmPath?.majorUnit : null,
    rpmL2: crossMatches ? cross.rpmPath?.midUnit : null,
    rpmL3: crossMatches ? cross.rpmPath?.l3 : null,
    rpmL4: crossMatches ? cross.rpmPath?.l4 : null,
    rpmL4Namespace: crossMatches ? namespace : null,
    rpmDraftAuthorityRef: crossMatches && namespace === 'RPM_EXISTING_DRAFT' ? namespaceEvidence.ref : null,
    rpmDraftAuthoritySha256: crossMatches && namespace === 'RPM_EXISTING_DRAFT' ? namespaceEvidence.sha256 : null
  };
  for (const [field, value] of Object.entries(rpmFields)) {
    const reason = !namespace && crossMatches ? 'RPM_NAMESPACE_AUTHORITY_UNCLEAR' : rpmId && !crossMatches ? 'RPM_CROSSWALK_PARENT_OR_LABEL_MISMATCH' : 'EXACT_RPM_CROSSWALK_NOT_FOUND';
    const sourceField = field === 'rpmPrimaryRecordId' ? 'recordId' : field === 'rpmL3' ? 'l3' : field === 'rpmL4' ? 'l4' : null;
    const consumerValue = sourceField ? valueFrom(record.rpmPrimary?.[sourceField], sourceField === 'recordId' ? record.rpmPrimary?.id : null) : null;
    const metaValue = sourceField ? valueFrom(metaRow?.rpmPrimary?.[sourceField], sourceField === 'recordId' ? metaRow?.rpmPrimary?.id : null,
      sourceMeta.rpmPrimary?.[sourceField], sourceField === 'recordId' ? sourceMeta.rpmPrimary?.id : null) : null;
    const sourceRefs = [consumerValue ? consumerRef : null, metaValue ? metaRef : null].filter(Boolean);
    if ((field === 'rpmL1' || field === 'rpmL2') && !sourceRefs.length) sourceRefs.push(sourceRef);
    const fieldRef = field === 'rpmL4Namespace' || field.startsWith('rpmDraftAuthority') ? namespaceEvidence?.refDetails :
      { sources: sourceRefs, authority: refs.crosswalk };
    projection[field] = addEvidence(evidenceByField, fullEvidence, evidenceDebt, field, value, fieldRef, reason);
  }
  const scalarSources = {
    problemTypeKey: choose('problemTypeKey', [{ value: q.problemTypeKey, ref: consumerRef }, { value: s.problemTypeKey, ref: sourceRef }, { value: sourceQuestionMeta.problemTypeKey, ref: metaRef }, { value: sourceMeta.problemTypeKey, ref: metaRef }, { value: crossMatches ? cross.problemTypeKey : null, ref: refs.crosswalk }]),
    templateKey: choose('templateKey', [{ value: q.templateKey, ref: consumerRef }, { value: s.templateKey, ref: sourceRef }, { value: sourceQuestionMeta.templateKey, ref: metaRef }, { value: sourceMeta.templateKey, ref: metaRef }, { value: crossMatches ? cross.templateKey : null, ref: refs.crosswalk }]),
    difficultyBucket: choose('difficultyBucket', [{ value: q.difficultyBucket, ref: consumerRef }, { value: s.difficultyBucket, ref: sourceRef }, { value: sourceQuestionMeta.difficultyBucket, ref: metaRef }, { value: sourceMeta.difficultyBucket, ref: metaRef }]),
    level: choose('level', [{ value: q.level, ref: consumerRef }, { value: s.level, ref: sourceRef }, { value: sourceQuestionMeta.level, ref: metaRef }, { value: sourceMeta.level, ref: metaRef }])
  };
  for (const [field, value] of Object.entries(scalarSources)) {
    let exact = value;
    let reason = `${field.toUpperCase()}_VALUE_MISSING`;
    if (field === 'difficultyBucket' && UNVERIFIED_DIFFICULTY_UIDS.has(uid)) { exact = null; reason = 'AUDITED_DIFFICULTY_EVIDENCE_DEBT_NO_INDEPENDENT_1_TO_5_EVIDENCE'; }
    if (field === 'difficultyBucket' && (!Number.isInteger(value) || value < 1 || value > 5)) { exact = null; reason = 'DIFFICULTY_NOT_EXACT_INTEGER_1_TO_5'; }
    if (field === 'problemTypeKey' && crossMatches && cross.problemTypeKey && value && value !== cross.problemTypeKey) { exact = null; reason = 'PROBLEM_TYPE_CROSSWALK_MISMATCH'; }
    if (field === 'templateKey' && crossMatches && cross.templateKey && value && value !== cross.templateKey) { exact = null; reason = 'TEMPLATE_CROSSWALK_MISMATCH'; }
    projection[field] = addEvidence(evidenceByField, fullEvidence, evidenceDebt, field, exact, fieldSources[field], reason);
  }
  // No empty arrays or NONE values are inferred for the three semantic fields.
  for (const field of ['crossConceptKeys', 'conditionKeys', 'integrationPattern']) {
    const value = sourceMeta[field] !== undefined ? sourceMeta[field] : null;
    projection[field] = addEvidence(evidenceByField, fullEvidence, evidenceDebt, field, value,
      value === null ? null : metaRef, `${field.toUpperCase()}_NO_EXACT_LEGACY_EVIDENCE`);
  }
  projection.approval = row.approval || record.approval || null;
  projection.reviewStatus = row.reviewStatus || record.reviewStatus || null;
  projection.consumerSelectable = row.consumerSelectable === true;
  projection.evidenceByField = evidenceByField;
  projection.evidenceDebt = evidenceDebt;
  projection.evidenceLedgerRef = LEDGER_REL;
  projection.physicalStorageBucketKey = row.l2;
  projection.sourceKind = row.sourceKind || 'generated';
  projection.rpmMappingStatus = crossMatches && namespace ? 'EXACT_CROSSWALK' : 'EVIDENCE_DEBT';
  return { projection, fieldEvidence: fullEvidence, mappingAttempt };
}

function build({ write = false } = {}) {
  const indexBytes = fs.readFileSync(path.join(ROOT, INDEX_REL));
  const index = JSON.parse(indexBytes.toString('utf8'));
  const previousLedger = fs.existsSync(path.join(ROOT, LEDGER_REL)) ? readJson(LEDGER_REL) : null;
  const previousRowsByUid = new Map((previousLedger?.records || []).map(row => [row.uid, row]));
  const cutover = readJson(CUTOVER_REL);
  const crossBytes = fs.readFileSync(path.join(ROOT, CROSSWALK_REL));
  const crosswalk = JSON.parse(crossBytes.toString('utf8'));
  const rpmMasterBytes = fs.readFileSync(path.join(ROOT, RPM_MASTER_REL));
  const rpmMaster = JSON.parse(rpmMasterBytes.toString('utf8'));
  const policyL3L4 = rpmMaster.policy?.L3L4 || '';
  const namespaceEvidence = {
    policyDraft: /CANONICAL_DRAFT/i.test(policyL3L4),
    policyLocked: /RPM_VERIFIED/i.test(policyL3L4),
    ref: RPM_MASTER_REL,
    sha256: sha(rpmMasterBytes),
    refDetails: shaRecord(RPM_MASTER_REL, rpmMasterBytes)
  };
  if (cutover.schemaVersion !== 'GENERATED_META_RETENTION_CUTOVER_V1' || cutover.legacyCount !== 323 || cutover.legacyUids?.length !== 323 || new Set(cutover.legacyUids).size !== 323) throw new Error('LEGACY_323_ROSTER_INVALID');
  if (!Array.isArray(index.records) || index.approvedCount !== index.records.length) throw new Error('CONSUMER_INDEX_COUNT_INVALID');
  const legacy = new Set(cutover.legacyUids);
  const crosswalkById = new Map();
  for (const row of crosswalk.records || crosswalk.items || []) if (row.id) crosswalkById.set(row.id, row);
  // The canonical high1 file currently stores direct records at the root array.
  if (Array.isArray(crosswalk)) for (const row of crosswalk) if (row.id) crosswalkById.set(row.id, row);
  const shardCache = new Map();
  const sourceCache = new Map();
  const metaCache = new Map();
  const ledgerRows = [];
  let projected = 0;
  const seen = new Set();
  for (const row of index.records) {
    const uid = row.uid;
    if (!uid || seen.has(uid)) throw new Error(`DUPLICATE_OR_INVALID_INDEX_UID:${uid}`);
    seen.add(uid);
    if (!legacy.has(uid)) continue;
    const shardRel = `archive/${row.shard}`;
    if (!shardRel.startsWith('archive/data/generated-lite-consumer/v1/')) throw new Error(`CONSUMER_SHARD_OUT_OF_SCOPE:${uid}`);
    let shardEntry = shardCache.get(shardRel);
    if (!shardEntry) {
      const bytes = fs.readFileSync(path.join(ROOT, shardRel));
      shardEntry = { data: JSON.parse(bytes.toString('utf8')), bytes, changed: false, rel: shardRel };
      shardCache.set(shardRel, shardEntry);
    }
    const records = shardEntry.data.records || [];
    const matches = records.filter(x => x.generatedUid === uid && x.localOrdinal === row.localOrdinal);
    if (matches.length !== 1) throw new Error(`CONSUMER_UID_ORDINAL_NOT_UNIQUE:${uid}`);
    const record = matches[0];
    const question = record.question || {};
    if (record.l2 !== row.l2 || question.subUnitKey !== row.l2) throw new Error(`UID_OR_STORAGE_BUCKET_MISMATCH:${uid}`);
    const sourceRel = record.sourceShard;
    let sourceEntry = sourceCache.get(sourceRel);
    if (!sourceEntry) {
      const bytes = fs.readFileSync(path.join(ROOT, sourceRel));
      sourceEntry = { questions: sourceQuestions(sourceRel), bytes, rel: sourceRel };
      sourceCache.set(sourceRel, sourceEntry);
    }
    const metaRel = sourceMetaRel(sourceRel);
    let metaEntry = metaCache.get(metaRel);
    if (!metaEntry) {
      const bytes = fs.readFileSync(path.join(ROOT, metaRel));
      metaEntry = { document: JSON.parse(bytes.toString('utf8')), bytes, rel: metaRel };
      metaCache.set(metaRel, metaEntry);
    }
    const metaRow = nestedRecord(metaEntry.document, uid);
    const sourceMatches = sourceEntry.questions.filter(x => Number(x.id) === Number(record.localOrdinal));
    if (sourceMatches.length !== 1) throw new Error(`SOURCE_UID_ORDINAL_NOT_UNIQUE:${uid}`);
    const refs = {
      source: shaRecord(sourceRel, sourceEntry.bytes),
      meta: shaRecord(metaRel, metaEntry.bytes),
      crosswalk: shaRecord(CROSSWALK_REL, crossBytes),
      rpmMaster: namespaceEvidence.refDetails,
      // Reuse the first-run raw target hash so the projection is byte-stable and
      // rerunnable after index/shard files have gained these metadata-only fields.
      consumerShardBefore: previousRowsByUid.get(uid)?.sourceEvidence?.consumerShardBefore || shaRecord(shardRel, shardEntry.bytes)
    };
    const built = createProjection({ uid, row, record, consumerQuestion: question, sourceQuestion: sourceMatches[0], metaRow, crosswalkById, refs, namespaceEvidence });
    const projection = built.projection;
    const expectedQuestionBody = JSON.stringify({ uid: question.uid, content: question.content, choices: question.choices, answer: question.answer, solution: question.solution, image: question.image });
    const oldRecordProjection = record.metaProjection;
    const oldQuestionProjection = question.metaProjection;
    const oldIndexProjection = row.metaProjection;
    if ((oldRecordProjection && canonical(oldRecordProjection) !== canonical(projection)) ||
        (oldQuestionProjection && canonical(oldQuestionProjection) !== canonical(projection)) ||
        (oldIndexProjection && canonical(oldIndexProjection) !== canonical(projection))) throw new Error(`EXISTING_PROJECTION_DRIFT:${uid}`);
    record.metaProjection = projection;
    question.metaProjection = projection;
    row.metaProjection = projection;
    const afterBody = JSON.stringify({ uid: question.uid, content: question.content, choices: question.choices, answer: question.answer, solution: question.solution, image: question.image });
    if (expectedQuestionBody !== afterBody) throw new Error(`STUDENT_CONTENT_MUTATED:${uid}`);
    ledgerRows.push({ uid, status: 'LEGACY_NOT_RECERTIFIED', sourceEvidence: refs, fieldEvidence: compactFieldEvidence(built.fieldEvidence, refs), mappingAttempt: built.mappingAttempt, studentPayloadSha256: sha(Buffer.from(expectedQuestionBody)), approval: { approval: row.approval || record.approval || null, reviewStatus: row.reviewStatus || record.reviewStatus || null, consumerSelectable: row.consumerSelectable === true }, storageBucketKey: row.l2, fieldStatus: Object.fromEntries(Object.entries(projection.evidenceByField).map(([k, v]) => [k, v.status])), evidenceDebt: projection.evidenceDebt });
    projected++;
    shardEntry.changed = true;
  }
  const missing = cutover.legacyUids.filter(uid => !seen.has(uid));
  if (missing.length) throw new Error(`LEGACY_UIDS_MISSING_FROM_INDEX:${missing.slice(0, 5).join(',')}`);
  if (projected !== 323) throw new Error(`LEGACY_PROJECTION_COUNT_INVALID:${projected}`);
  const consumerHashes = new Map();
  for (const entry of shardCache.values()) if (entry.changed) {
    const bytes = Buffer.from(`${JSON.stringify(entry.data, null, 2)}\n`);
    consumerHashes.set(entry.rel.slice('archive/'.length), { ref: { path: entry.rel, sha256: sha(bytes), gitBlobSha1: gitBlobSha(bytes) }, bytes });
  }
  for (const indexRow of index.records) {
    const after = consumerHashes.get(indexRow.shard);
    if (!after) continue;
    if (Object.hasOwn(indexRow, 'consumerShardGitSha')) indexRow.consumerShardGitSha = after.ref.gitBlobSha1;
    if (Object.hasOwn(indexRow, 'shardGitBlobSha')) indexRow.shardGitBlobSha = after.ref.gitBlobSha1;
    if (Object.hasOwn(indexRow, 'consumerShardSha256')) indexRow.consumerShardSha256 = after.ref.sha256;
  }
  for (const item of ledgerRows) {
    const indexRow = index.records.find(row => row.uid === item.uid);
    item.sourceEvidence.consumerShardAfter = consumerHashes.get(indexRow.shard).ref;
  }
  const ledger = {
    schemaVersion: 'GENERATED_LEGACY_META_EVIDENCE_V1',
    cutoverPath: CUTOVER_REL,
    cutoverSha256: fileSha(CUTOVER_REL),
    cutoverGitBlobSha1: gitBlobSha(fs.readFileSync(path.join(ROOT, CUTOVER_REL))),
    sourceIndexBaseline: previousLedger?.sourceIndexBaseline || shaRecord(INDEX_REL, indexBytes),
    crosswalk: shaRecord(CROSSWALK_REL, crossBytes),
    rpmDraftPolicy: namespaceEvidence.refDetails,
    scope: 'EXACT_323_CUTOVER_UIDS_METADATA_ONLY',
    approvalMeaning: 'LEGACY_NOT_RECERTIFIED; approval fields reflect existing Consumer state only',
    projectedCount: projected,
    records: ledgerRows
  };
  if (write) {
    for (const entry of shardCache.values()) if (entry.changed) fs.writeFileSync(path.join(ROOT, entry.rel), consumerHashes.get(entry.rel.slice('archive/'.length)).bytes);
    fs.writeFileSync(path.join(ROOT, INDEX_REL), `${JSON.stringify(index, null, 2)}\n`);
    fs.writeFileSync(path.join(ROOT, LEDGER_REL), `${JSON.stringify(ledger, null, 2)}\n`);
  }
  return { projected, shardCount: [...shardCache.values()].filter(x => x.changed).length, ledger, write };
}

if (require.main === module) {
  const write = process.argv.includes('--write');
  try {
    const result = build({ write });
    console.log(JSON.stringify({ status: 'PASS', projected: result.projected, shardCount: result.shardCount, ledger: LEDGER_REL, write }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ status: 'FAIL', error: error.message }, null, 2));
    process.exitCode = 1;
  }
}

module.exports = { build, createProjection, canonical, shaRecord, deriveMetaBrowsePath, compactFieldEvidence, SCHEMA };
