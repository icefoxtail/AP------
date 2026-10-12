import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const archive = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const repo = path.resolve(archive, '..');
const ledgerDir = path.join(archive, 'data/legacy-similar-reviewed');
const identityPath = path.join(archive, 'data/question_identity_map.json');
const metadataPath = path.join(archive, 'data/question_metadata.json');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const json = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const pathOf = (x) => String(x || '').replace(/\\/g, '/');
const sourceHash = (q) => sha(JSON.stringify({
  content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
  answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null,
}));
const bodyHash = (q) => sha(JSON.stringify({
  content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
  image: q.image ?? null,
}));
const gitBlob = (content) => crypto.createHash('sha1')
  .update('blob ' + Buffer.byteLength(content) + '\0').update(content).digest('hex');
const requireAssert = (cond, reason) => { if (!cond) throw new Error('LEGACY_REVIEW_BIND_FAIL: ' + reason); };
const normalized = (v) => JSON.stringify(v);
function verifyMaster(row, master, taxonomy, bindings, conditions) {
  const scope = master.records.find((r) => r.curriculum === row.rpmCurriculum &&
    r.scope === row.rpmCourse && r.majorUnit === row.rpmL1 && r.midUnit === row.rpmL2);
  requireAssert(scope, 'RPM_L1_L2 q' + row.qid);
  const L3 = scope.concepts.find((r) => r.concept === row.rpmL3);
  requireAssert(L3, 'RPM_L3 q' + row.qid);
  if (row.rpmL4) requireAssert(L3.problemTypes.some((r) => r.problemType === row.rpmL4), 'RPM_L4 q' + row.qid);
  else requireAssert(row.metaDebt.includes('NO_EQUIVALENT_RPM_L4'), 'RPM_L4 HOLD evidence q' + row.qid);
  if (row.problemTypeKey) {
    requireAssert(taxonomy.problemTypes.some((r) => r.problemTypeKey === row.problemTypeKey), 'PT master q' + row.qid);
    requireAssert(bindings.bindings.some((r) => r.curriculum === row.rpmCurriculum &&
      r.standardUnitKey === row.standardUnitKey && r.subUnitKey === row.subUnitKey &&
      r.problemTypeKey === row.problemTypeKey), 'PT curriculum binding q' + row.qid);
    requireAssert(taxonomy.templates.some((r) => r.templateKey === row.templateKey &&
      r.parentProblemTypeKey === row.problemTypeKey), 'TPL parent q' + row.qid);
  } else requireAssert(!row.templateKey && row.metaDebt.includes('NO_VERIFIED_PT_TPL_BINDING'), 'PT HOLD q' + row.qid);
  for (const key of row.conditionKeys || []) requireAssert(conditions.conditions.some((r) => r.conditionKey === key), 'condition q' + row.qid);
  requireAssert(Array.isArray(row.crossConceptKeys), 'cross concept array q' + row.qid);
  requireAssert(Number.isInteger(row.independentDifficulty1to5) &&
    row.independentDifficulty1to5 >= 1 && row.independentDifficulty1to5 <= 5, 'difficulty q' + row.qid);
}
export function applyReviewedLegacySimilarLedgers() {
  if (!fs.existsSync(ledgerDir)) return { status: 'NO_LEDGER' };
  const files = fs.readdirSync(ledgerDir).filter((x) => x.endsWith('.review.json')).sort();
  if (!files.length) return { status: 'NO_LEDGER' };
  const originalIdentityText = fs.readFileSync(identityPath, 'utf8');
  const originalMetadataText = fs.readFileSync(metadataPath, 'utf8');
  const identity = JSON.parse(originalIdentityText), metadata = JSON.parse(originalMetadataText);
  const identityByUid = new Map(identity.records.map((r) => [r.questionUid, r]));
  const metadataByUid = new Map(metadata.records.map((r) => [r.questionUid, r]));
  const master = json(path.join(repo, 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json'));
  const taxonomy = json(path.join(archive, 'data/meta-foundation/compiled/taxonomy_registry.json'));
  const bindings = json(path.join(archive, 'data/meta-foundation/compiled/curriculum_bindings.json'));
  const conditions = json(path.join(archive, 'data/meta-foundation/compiled/condition_registry.json'));
  const touched = new Set();
  let updated = 0;
  for (const name of files) {
    const ledger = json(path.join(ledgerDir, name));
    requireAssert(ledger.schemaVersion === 'JS_ARCHIVE_LEGACY_SIMILAR_TARGET_REVIEW_V1' &&
      ledger.preserveUid === true && ledger.regenerateQid9 === false &&
      Array.isArray(ledger.questions) && ledger.questions.length === 22, 'ledger contract ' + name);
    const sourceFile = pathOf(ledger.sourceFile);
    requireAssert(sourceFile.startsWith('similar/') && !sourceFile.includes('..'), 'source path ' + name);
    const code = fs.readFileSync(path.join(archive, 'exams', sourceFile));
    requireAssert(gitBlob(code).toLowerCase() === ledger.sourceGitBlobSha.toLowerCase(), 'whole JS frozen blob ' + name);
    const scope = { window: {}, console: { log() {}, warn() {}, error() {} } };
    vm.createContext(scope);
    vm.runInContext(code.toString('utf8'), scope, { filename: sourceFile, timeout: 3000 });
    const questions = scope.window.questionBank;
    requireAssert(Array.isArray(questions) && questions.length === ledger.questions.length, 'question count ' + name);
    requireAssert(ledger.questions.every((row, i) => Number(row.qid) === i + 1 &&
      Number(row.sourceOrdinal) === i + 1), 'ordinal exact order ' + name);
    for (const row of ledger.questions) {
      const q = questions[row.sourceOrdinal - 1];
      const id = identityByUid.get(row.questionUid), meta = metadataByUid.get(row.questionUid);
      requireAssert(id && meta && q && Number(q.id) === Number(row.qid) &&
        pathOf(id.sourceArchiveFile) === sourceFile && pathOf(meta.sourceArchiveFile) === sourceFile &&
        Number(id.sourceOrdinal) === row.sourceOrdinal &&
        Number(meta.sourceOrdinal) === row.sourceOrdinal, 'existing UID/sourceQid/provenance q' + row.qid);
      requireAssert(!touched.has(row.questionUid), 'duplicate UID ' + row.questionUid);
      touched.add(row.questionUid);
      requireAssert(q.answer === row.independentAnswer, 'reviewed answer changed q' + row.qid);
      requireAssert(row.sourceFingerprint === sourceHash(q) && row.sourceBodyFingerprint === bodyHash(q),
        'frozen per-item content/solution digest q' + row.qid);
      requireAssert(q.standardUnitKey === row.standardUnitKey && q.subUnitKey === row.subUnitKey &&
        q.standardUnit === row.standardUnit && q.subUnit === row.subUnit, 'physical canonical unit mismatch q' + row.qid);
      requireAssert([meta.sourceFingerprint, row.sourceFingerprint].includes(row.oldSourceFingerprint) ||
        meta.sourceFingerprint === row.sourceFingerprint, 'unrecognized prior fingerprint q' + row.qid);
      requireAssert([meta.contentFingerprint, row.sourceBodyFingerprint].includes(row.oldSourceBodyFingerprint) ||
        meta.contentFingerprint === row.sourceBodyFingerprint, 'unrecognized prior body fingerprint q' + row.qid);
      verifyMaster(row, master, taxonomy, bindings, conditions);
      const patch = {
        sourceFingerprint: row.sourceFingerprint,
        contentFingerprint: row.sourceBodyFingerprint,
        standardCourse: q.standardCourse, standardUnitKey: row.standardUnitKey, standardUnit: row.standardUnit,
        subUnitKey: row.subUnitKey, subUnit: row.subUnit,
        curriculumKey: row.rpmCurriculum, courseKey: row.rpmCourse,
        L1: row.rpmL1, L2: row.rpmL2, L3: row.rpmL4 ? row.rpmL3 : '', L4: row.rpmL4 || '',
        rpmL1: row.rpmL1, rpmL2: row.rpmL2, rpmL3: row.rpmL3, rpmL4: row.rpmL4,
        rpmCurriculum: row.rpmCurriculum,
        rpmPathStatus: row.rpmL4 ? 'CONFIRMED' : 'HOLD_NO_EQUIVALENT_PATH',
        rpmSemanticStatus: row.rpmL4 ? 'CONFIRMED' : 'HOLD',
        rpmSemanticReason: row.rpmL4 ? '' : 'Reviewed source has no equivalent canonical RPM L4',
        rpmEvidenceDebtFields: row.metaDebt,
        rpmProjectionRevision: 'archive-registration-target-source-rpm-projection-v1',
        problemTypeKey: row.problemTypeKey || '',
        templateKey: row.templateKey || '',
        crossConceptKeys: row.crossConceptKeys || [],
        conditionKeys: row.conditionKeys || [],
        integrationPattern: row.integrationPattern || '',
        difficultyBucket: row.independentDifficulty1to5,
        difficultyConfidence: 'medium',
        difficultyBoundaryFlag: row.qid === 7 ? 'B34' : 'NONE',
        legacyLevelCompatibility: row.qid === 7 ? 'BORDERLINE_ACCEPTABLE' : 'NORMAL',
        sourceType: 'LEGACY_SIMILAR',
        reviewStatus: 'reviewed_pass',
        metadataStatus: row.metaDebt.length ? 'approved_partial_with_explicit_holds' : 'approved_semantic_review',
        fieldStatus: {
          ...meta.fieldStatus,
          standardUnit: 'approved_reviewed',
          subUnit: 'approved_reviewed',
          problemType: row.problemTypeKey ? 'approved_reviewed' : 'manual_review_pending',
          template: row.templateKey ? 'approved_reviewed' : 'manual_review_pending',
          difficulty: 'approved_reviewed',
        },
        approvalEvidence: [...new Set([...(meta.approvalEvidence || []), 'archive/data/legacy-similar-reviewed/' + name])],
      };
      if (normalized(Object.fromEntries(Object.keys(patch).map((k) => [k, meta[k]]))) !== normalized(patch)) {
        Object.assign(meta, patch);
        updated++;
      }
      if (id.sourceFingerprint !== row.sourceFingerprint) {
        requireAssert(id.sourceFingerprint === row.oldSourceFingerprint, 'identity old fingerprint q' + row.qid);
        id.sourceFingerprint = row.sourceFingerprint;
        updated++;
      }
    }
  }
  if (!updated) return { status: 'ALREADY_BOUND', uidCount: touched.size };
  const stableIdentity = { ...identity };
  delete stableIdentity.identityDigest;
  delete stableIdentity.generatedAt;
  identity.identityDigest = sha(JSON.stringify(stableIdentity));
  const identityOut = JSON.stringify(identity, null, 2) + '\n';
  fs.writeFileSync(identityPath, identityOut);
  metadata.sourceDigests = { ...metadata.sourceDigests, identityMap: sha(identityOut) };
  metadata.registrationSync = {
    ...(metadata.registrationSync || {}),
    legacySimilarReviewedLedger: files,
    legacySimilarUidCount: touched.size,
    preservation: 'existing UID/sourceQuestionNo/provenance; no QID9',
  };
  delete metadata.digest;
  metadata.digest = sha(JSON.stringify(metadata));
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2) + '\n');
  return { status: 'BOUND_REVIEWED_EXISTING_UIDS', uidCount: touched.size, updated };
}
