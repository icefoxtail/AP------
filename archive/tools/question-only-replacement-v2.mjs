import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { STUDENT_FIELDS, studentAssetRefs } from './archive-student-bundle.mjs';

export const QUESTION_ONLY_AUTHORITY_SCHEMA = 'JS_ARCHIVE_QUESTION_ONLY_REPLACEMENT_AUTHORITY_V1';
const QUALITY_CONTRACT = 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';
const STUDENT_CHOICE_FIELDS = new Set(['text', 'content', 'value', 'answer']);
const LEGACY_Q19_EXAM_UID = '22_연향중_1학기_기말_중2_기출';
const Q22_EXAM_UID = '24_순천여고_1학기_중간_고2_확률과통계';
const LEGACY_Q19_PROFILE = Object.freeze({ key: 'LEGACY_Q19', examUid: LEGACY_Q19_EXAM_UID, qid: 19 });
const Q22_PROFILE = Object.freeze({ key: 'SUN-CHEON-YEO-PROB-Q22', examUid: Q22_EXAM_UID, qid: 22, responseForm: 'SHORT_ANSWER' });
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const blob = value => {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
};
const array = value => Array.isArray(value) ? value : [];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const norm = value => String(value || '').replaceAll('\\', '/');

export function questionOnlyReplacementProfile(examUid, qid) {
  const targetQid = Number(qid);
  if (targetQid === LEGACY_Q19_PROFILE.qid && examUid === LEGACY_Q19_PROFILE.examUid) return LEGACY_Q19_PROFILE;
  if (targetQid === Q22_PROFILE.qid && examUid === Q22_PROFILE.examUid) return Q22_PROFILE;
  return null;
}

function inside(root, relative) {
  if (!relative || path.isAbsolute(relative)) throw new Error('QUESTION_ONLY_RELATIVE_PATH_REQUIRED');
  const target = path.resolve(root, ...norm(relative).split('/'));
  if (!target.startsWith(path.resolve(root) + path.sep)) throw new Error('QUESTION_ONLY_PATH_ESCAPE');
  if (fs.existsSync(target)) {
    const real = fs.realpathSync(target), base = fs.realpathSync(root), rel = path.relative(base, real);
    if (rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) throw new Error('QUESTION_ONLY_SYMLINK_ESCAPE');
  }
  return target;
}

function loadBank(bytes, label) {
  const box = { window: {} };
  const context = vm.createContext(box);
  vm.runInContext(bytes.toString('utf8'), context, { filename: label, timeout: 5000 });
  const questions = box.window.questionBank || box.window.questions;
  if (!Array.isArray(questions) || !questions.length) throw new Error('QUESTION_ONLY_BANK_REQUIRED');
  return questions;
}

function projectStudentQuestion(question, qid) {
  const student = Object.fromEntries([...STUDENT_FIELDS]
    .filter(key => Object.hasOwn(question || {}, key))
    .map(key => [key, question[key]]));
  if (student.id === undefined) student.id = qid;
  if (Array.isArray(student.choices)) {
    student.choices = student.choices.map(choice => choice && typeof choice === 'object' && !Array.isArray(choice)
      ? Object.fromEntries(Object.entries(choice).filter(([key]) => STUDENT_CHOICE_FIELDS.has(key)))
      : choice);
  }
  return student;
}

function currentStudentProjectionIssues(bundle, questions, assetRoot, sourceRawSha256, sourceGitBlobSha) {
  const issues = [];
  const qids = questions.map(question => Number(question?.id ?? question?.qid));
  if (bundle?.schemaVersion !== 'JS_ARCHIVE_STUDENT_BUNDLE_V2'
    || bundle.sourceRawSha256 !== sourceRawSha256 || bundle.sourceRawBlobSha1 !== sourceGitBlobSha
    || Number(bundle.questionCount) !== qids.length || !same(bundle.qids, qids)
    || array(bundle.rows).length !== qids.length || !same(bundle.whitelist, [...STUDENT_FIELDS])
    || bundle.adapterProvenance?.answersRead !== false
    || bundle.adapterProvenance?.originalBundleMutated !== false
    || array(bundle.adapterProvenance?.studentFieldsDropped).length !== 0) {
    issues.push('QUESTION_ONLY_Q22_CURRENT_STUDENT_BUNDLE_BINDING_INVALID');
  }
  for (let index = 0; index < qids.length; index += 1) {
    const qid = qids[index], sourceQuestion = questions[index], row = array(bundle?.rows)[index];
    const projected = projectStudentQuestion(sourceQuestion, qid);
    const expectedPayloadSha = sha(Buffer.from(JSON.stringify(projected), 'utf8'));
    const expectedAssetMap = new Map();
    const pendingRefs = [...studentAssetRefs(projected)];
    for (let refIndex = 0; refIndex < pendingRefs.length; refIndex += 1) {
      const ref = String(pendingRefs[refIndex]).replaceAll('\\', '/');
      if (expectedAssetMap.has(ref)) continue;
      try {
        const file = inside(assetRoot, ref), bytes = fs.readFileSync(file);
        expectedAssetMap.set(ref, { ref, sha256: sha(bytes), file });
        if (ref.toLowerCase().endsWith('.svg')) {
          for (const match of bytes.toString('utf8').matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)/gi)) {
            const target = match[1];
            if (/^(?:data:|#)/.test(target)) continue;
            const dependency = path.posix.normalize(path.posix.join(path.posix.dirname(ref), target));
            if (!expectedAssetMap.has(dependency)) pendingRefs.push(dependency);
          }
        }
      } catch { issues.push(`QUESTION_ONLY_Q22_CURRENT_SOURCE_ASSET_INVALID:q${qid}`); }
    }
    const expectedAssets = [...expectedAssetMap.values()];
    const declaredAssets = array(row?.assets);
    const declaredPairs = declaredAssets.map(asset => [asset?.ref, asset?.sha256]).sort((a, b) => String(a[0]).localeCompare(String(b[0])));
    const expectedPairs = expectedAssets.map(asset => [asset.ref, asset.sha256]).sort((a, b) => String(a[0]).localeCompare(String(b[0])));
    if (!row || Number(row.qid) !== qid || !same(row.student, projected)
      || row.studentPayloadSha256 !== expectedPayloadSha
      || Object.keys(row).some(key => !['qid', 'student', 'studentPayloadSha256', 'assets', 'originalStudentPayloadSha256'].includes(key))
      || !same(declaredPairs, expectedPairs)) {
      issues.push(`QUESTION_ONLY_Q22_CURRENT_STUDENT_PROJECTION_MISMATCH:q${qid}`);
    }
    for (const asset of declaredAssets) {
      const expected = expectedAssets.find(item => item.ref === asset?.ref);
      try {
        const declaredPath = fs.realpathSync(asset.path);
        const expectedPath = expected && fs.realpathSync(expected.file);
        if (!expected || declaredPath !== expectedPath || asset.sha256 !== expected.sha256) {
          issues.push(`QUESTION_ONLY_Q22_CURRENT_STUDENT_ASSET_BINDING_MISMATCH:q${qid}`);
        }
      } catch { issues.push(`QUESTION_ONLY_Q22_CURRENT_STUDENT_ASSET_PATH_INVALID:q${qid}`); }
    }
  }
  return issues;
}

function issue(issues, code) { issues.push(code); }

export function validateQuestionOnlyReplacement({
  evidence, row, questions, repoRoot, assetRoot, artifactRawSha256, artifactGitBlobSha,
  authorityRef, authority,
}) {
  const issues = [];
  const summary = { qid: Number(row?.qid), scope: 'QUESTION_ONLY', sourceParity: 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT' };
  const qid = Number(row?.qid);
  const profile = questionOnlyReplacementProfile(evidence?.examUid, qid);
  if (!profile) issue(issues, 'QUESTION_ONLY_TARGET_PROFILE_NOT_ALLOWLISTED');
  const scopeQids = evidence?.replacementEvidenceScope?.qids || evidence?.targetScope?.qids;
  const fullExamStageClosure = evidence?.replacementEvidenceScope?.fullExamStageClosure ?? evidence?.targetScope?.fullExamStageClosure;
  const scopeTarget = Number(evidence?.targetScope?.qid ?? evidence?.targetScope?.qids?.[0] ?? scopeQids?.[0]);
  if (!Number.isInteger(qid) || fullExamStageClosure !== false || !same(scopeQids, [qid])
    || scopeTarget !== qid || evidence?.targetScope?.replacementOnly !== true
    || (evidence?.sourceIdentity?.currentCandidateQuestionUidStatus !== 'RECOMPUTE_AT_REGISTRATION'
      && evidence?.targetScope?.candidateNotProduction !== true)) issue(issues, 'QUESTION_ONLY_SCOPE_BINDING_REQUIRED');
  if (array(evidence?.rows).length !== 1 || String(row?.sourceMode || '').toUpperCase() !== 'QUESTION_ONLY'
    || String(row?.replacementMode || '').toUpperCase() !== 'QUESTION_ONLY') issue(issues, 'QUESTION_ONLY_MODE_PAIR_REQUIRED');
  if (row?.sourceMode === 'ALIVE_REPLACEMENT' || row?.replacementMode === 'ALIVE_REPLACEMENT'
    || row?.provenanceEvidence?.questionOnlyReplacement && row?.sourceMode !== 'QUESTION_ONLY'
    || evidence?.replacementMode && evidence.replacementMode !== 'QUESTION_ONLY'
    || evidence?.replacementProvenance?.mode && evidence.replacementProvenance.mode !== 'QUESTION_ONLY'
    || row?.provenanceEvidence?.aliveReplacement) issue(issues, 'QUESTION_ONLY_ALIVE_RELABEL_FORBIDDEN');

  const authRef = evidence?.questionOnlyReplacementAuthorityRef || row?.questionOnlyReplacementAuthorityRef;
  if (!authorityRef || !authority || !authRef || norm(authRef.path) !== norm(authorityRef.path)
    || authRef.sha256 !== authorityRef.sha256) issue(issues, 'QUESTION_ONLY_AUTHORITY_REF_REQUIRED');
  const auth = authority || {};
  if (auth.schemaVersion !== QUESTION_ONLY_AUTHORITY_SCHEMA || auth.qualityContractVersion !== QUALITY_CONTRACT
    || auth.executionLine !== 'CODEX' || auth.stage !== 'CREATE' || auth.authorityType !== 'ROOT_DELEGATED'
    || auth.status !== 'AUTHORIZED' || auth.examUid !== evidence?.examUid || Number(auth.qid) !== qid
    || Number(auth.sourceOrdinal) !== Number(evidence?.sourceIdentity?.sourceOrdinal) || auth.replacementScope !== 'QUESTION_ONLY'
    || auth.sourceParityClaim !== 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT'
    || !String(auth.reason || '').trim()) issue(issues, 'QUESTION_ONLY_AUTHORITY_INVALID');
  if (profile?.key === LEGACY_Q19_PROFILE.key && auth.userDirective !== '두 건은 수정프로토콜로 수정 후 마감 처리해') issue(issues, 'QUESTION_ONLY_AUTHORITY_DIRECTIVE_MISMATCH');
  if (profile?.key === Q22_PROFILE.key && !String(auth.userDirective || '').trim()) issue(issues, 'QUESTION_ONLY_AUTHORITY_DIRECTIVE_REQUIRED');

  if (!repoRoot || !assetRoot || !Array.isArray(questions) || !artifactRawSha256 || !artifactGitBlobSha) {
    issue(issues, 'QUESTION_ONLY_VALIDATION_INPUTS_REQUIRED');
    return { ok: false, issues, summary };
  }
  const authFile = authorityRef?.path ? inside(repoRoot, authorityRef.path) : null;
  if (!authFile || !fs.existsSync(authFile) || !authorityRef?.sha256
    || sha(fs.readFileSync(authFile)) !== authorityRef.sha256) issue(issues, 'QUESTION_ONLY_AUTHORITY_FILE_SHA_MISMATCH');
  if (auth.candidate?.rawSha256 !== artifactRawSha256 || auth.candidate?.gitBlobSha !== artifactGitBlobSha
    || evidence?.artifactRawSha256 !== artifactRawSha256) issue(issues, 'QUESTION_ONLY_CANDIDATE_SHA_MISMATCH');

  const sourcePath = norm(auth.source?.path || evidence?.sourceIdentity?.sourceArchiveFile);
  const sourceFile = sourcePath ? inside(repoRoot, sourcePath) : null;
  let sourceBytes = null, sourceBank = [];
  if (!sourceFile || !fs.existsSync(sourceFile)) issue(issues, 'QUESTION_ONLY_SOURCE_FILE_MISSING');
  else {
    sourceBytes = fs.readFileSync(sourceFile);
    if (sha(sourceBytes) !== auth.source?.rawSha256 || blob(sourceBytes) !== auth.source?.gitBlobSha
      || evidence?.sourceIdentity?.baselineSourceRawSha256 !== auth.source?.rawSha256) issue(issues, 'QUESTION_ONLY_SOURCE_SHA_MISMATCH');
    try { sourceBank = loadBank(sourceBytes, sourcePath); }
    catch { issue(issues, 'QUESTION_ONLY_SOURCE_BANK_INVALID'); }
  }
  const candidateIds = questions.map(question => Number(question?.id));
  const sourceIds = sourceBank.map(question => Number(question?.id));
  if (!same(candidateIds, sourceIds) || Number(auth.sourceOrdinal) !== candidateIds.indexOf(qid) + 1
    || !candidateIds.includes(qid)) issue(issues, 'QUESTION_ONLY_QID_OR_DENOMINATOR_CHANGED');
  const original = sourceBank.find(question => Number(question?.id) === qid);
  const candidate = questions.find(question => Number(question?.id) === qid);
  if (!original || !candidate) issue(issues, 'QUESTION_ONLY_TARGET_SLOT_MISSING');
  if (profile?.key === Q22_PROFILE.key && original && original.image != null && original.image !== '') {
    issue(issues, 'QUESTION_ONLY_Q22_SOURCE_PROBLEM_IMAGE_MUST_REMAIN_UNCLAIMED');
  }
  if (original && candidate) {
    const changed = sourceBank.filter(question => {
      const current = questions.find(item => Number(item?.id) === Number(question.id));
      return !same(question, current);
    }).map(question => Number(question.id));
    if (!same(changed, [qid])) issue(issues, 'QUESTION_ONLY_NON_TARGET_PARITY_FAIL');
    if (Number(row?.sourceSlotUid?.sourceOrdinal ?? row?.sourceOrdinal ?? qid) !== qid) issue(issues, 'QUESTION_ONLY_SLOT_BINDING_INVALID');
    if (!String(row?.sourceSlotUid || '').trim()) issue(issues, 'QUESTION_ONLY_SOURCE_SLOT_UID_REQUIRED');
  }

  const provenance = row?.provenanceEvidence?.questionOnlyReplacement || {};
  const sourceMode = row?.sourceMode;
  const sourceParity = evidence?.sourceParity;
  if (sourceMode !== 'QUESTION_ONLY' || row?.replacementMode !== 'QUESTION_ONLY'
    || (provenance.originalSourceSha256 || provenance.originalSourceRawSha256) !== auth.source?.rawSha256
    || provenance.originalSourceGitBlobSha !== auth.source?.gitBlobSha
    || provenance.originalTextRecovered !== false || provenance.pdfReviewed !== false
    || !String(provenance.reason || '').trim()
    || sourceParity?.status !== 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT'
    || sourceParity?.sourceLiteralParityClaimed !== false) issue(issues, 'QUESTION_ONLY_SOURCE_PARITY_MUST_REMAIN_UNCLAIMED');
  if (profile?.key === Q22_PROFILE.key
    && (provenance.originalProblemImageRef != null || provenance.originalProblemImageSha256 != null
      || provenance.sourceImageActuallyOpened === true)) issue(issues, 'QUESTION_ONLY_Q22_SOURCE_IMAGE_CLAIM_FORBIDDEN');

  const ledgerRel = norm(provenance.preservedHistoryLedger || evidence?.replacementProvenance?.preservedHistoryLedger);
  let ledger = null, historyProof = null;
  try { ledger = JSON.parse(fs.readFileSync(inside(repoRoot, ledgerRel), 'utf8')); }
  catch { issue(issues, 'QUESTION_ONLY_HISTORY_LEDGER_REQUIRED'); }
  if (ledger) {
    if (ledger.schemaVersion !== 'JS_ARCHIVE_QUESTION_ONLY_REPLACEMENT_LEDGER_V1'
      || ledger.examUid !== evidence.examUid || Number(ledger.qid) !== qid
      || ledger.replacementMode !== 'QUESTION_ONLY' || ledger.candidateArtifactSha256 !== artifactRawSha256
      || ledger.source?.sha256 !== auth.source?.rawSha256 || ledger.source?.gitBlobSha !== auth.source?.gitBlobSha
      || ledger.source?.candidateChangedOnlyQid !== qid || ledger.source?.unchangedQidsSemanticParity !== `${Math.max(0, candidateIds.length - 1)}/${Math.max(0, candidateIds.length - 1)}`
      || (profile?.key === LEGACY_Q19_PROFILE.key
        && ledger.originalQ19?.sourceParityClaim !== 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT')) issue(issues, 'QUESTION_ONLY_HISTORY_LEDGER_BINDING_INVALID');
    const history = array(ledger.historyCopies);
    const historyPaths = new Set(history.map(item => norm(item?.path)));
    if (!history.length || history.some(item => item?.readForReplacementAnswer !== false)) issue(issues, 'QUESTION_ONLY_HISTORY_COPY_SCOPE_INVALID');
    for (const entry of history) {
      try {
        const file = inside(repoRoot, entry.path);
        if (sha(fs.readFileSync(file)) !== entry.sha256) issue(issues, 'QUESTION_ONLY_HISTORY_COPY_SHA_MISMATCH');
      } catch { issue(issues, 'QUESTION_ONLY_HISTORY_COPY_MISSING'); }
    }
    if (profile?.key === LEGACY_Q19_PROFILE.key) {
      const sourceHoldCopy = history.find(item => /scoped-R1-current-source-refresh\.receipt\.json$/i.test(norm(item?.path)));
      const originalSourceCopy = history.find(item => /history\/original-source\.js$/i.test(norm(item?.path)));
      const originalImageCopy = history.find(item => /history\/q19\.png$/i.test(norm(item?.path)));
      const originalFreezeCopy = history.find(item => /R1\.changed-scope\.independent-freeze\.json$/i.test(norm(item?.path)));
      if (!sourceHoldCopy || !originalSourceCopy || !originalImageCopy || !originalFreezeCopy) issue(issues, 'QUESTION_ONLY_TRUE_HOLD_HISTORY_REQUIRED');
      else {
        if (originalSourceCopy.sha256 !== auth.source?.rawSha256
          || originalImageCopy.sha256 !== ledger.originalQ19?.problemImageSha256) issue(issues, 'QUESTION_ONLY_SOURCE_OR_ASSET_HISTORY_SHA_MISMATCH');
        try {
          const holdBytes = fs.readFileSync(inside(repoRoot, sourceHoldCopy.path));
          const freezeBytes = fs.readFileSync(inside(repoRoot, originalFreezeCopy.path));
          const holdReceipt = JSON.parse(holdBytes.toString('utf8'));
          if (holdReceipt.status !== 'SCOPED_REVIEW_COMPLETE_WITH_SOURCE_HOLD'
            || holdReceipt.scopeOnly !== true || holdReceipt.fullExamR1Pass !== false
            || holdReceipt.current?.rawSha256 !== auth.source?.rawSha256
            || holdReceipt.current?.rawBufferBlobSha1 !== auth.source?.gitBlobSha
            || norm(holdReceipt.target?.productionRelativePath) !== sourcePath
            || Number(holdReceipt.q19Hold?.qid) !== qid || holdReceipt.q19Hold?.status !== 'SOURCE_HOLD'
            || holdReceipt.q19Hold?.observedEvidence?.imageSha256 !== ledger.originalQ19?.problemImageSha256
            || array(holdReceipt.q19Hold?.observedEvidence?.missingFields).length < 1) issue(issues, 'QUESTION_ONLY_TRUE_HOLD_NOT_PROVEN');
          historyProof = {
            ledgerPath: ledgerRel,
            ledgerSha256: sha(fs.readFileSync(inside(repoRoot, ledgerRel))),
            holdReceiptPath: sourceHoldCopy.path,
            holdReceiptSha256: sha(holdBytes),
            originalFreezePath: originalFreezeCopy.path,
            originalFreezeSha256: sha(freezeBytes),
            originalSourceSha256: auth.source.rawSha256,
            originalProblemImageSha256: ledger.originalQ19.problemImageSha256,
          };
        } catch { issue(issues, 'QUESTION_ONLY_TRUE_HOLD_RECEIPT_INVALID'); }
      }
      if (Number(ledger.originalQ19?.sameSlot ?? ledger.replacement?.sameSlot) !== qid
        || ledger.originalQ19?.sourceImageActuallyOpened !== true
        || (provenance.originalProblemImageSha256 && ledger.originalQ19?.problemImageSha256 !== provenance.originalProblemImageSha256)
        || ledger.source?.candidateChangedOnlyQid !== qid) issue(issues, 'QUESTION_ONLY_ORIGINAL_SLOT_OR_ASSET_BINDING_INVALID');
      try {
        const originalImage = inside(path.join(repoRoot, 'archive'), norm(ledger.originalQ19?.problemImageRef).replace(/^assets\//, 'assets/'));
        if (sha(fs.readFileSync(originalImage)) !== ledger.originalQ19?.problemImageSha256
          || original?.image !== ledger.originalQ19?.problemImageRef) issue(issues, 'QUESTION_ONLY_ORIGINAL_ASSET_SHA_MISMATCH');
      } catch { issue(issues, 'QUESTION_ONLY_ORIGINAL_ASSET_MISSING'); }
    } else if (profile?.key === Q22_PROFILE.key) {
      const originalSourceCopy = history.find(item => /history\/original-source\.js$/i.test(norm(item?.path)));
      const target = ledger.originalTarget || {};
      const holdEvidence = auth.holdEvidence || {};
      const readEvidence = (ref, label) => {
        try {
          const file = inside(repoRoot, norm(ref?.path));
          const bytes = fs.readFileSync(file);
          if (!ref?.sha256 || sha(bytes) !== ref.sha256) throw new Error('SHA');
          const historyCopy = history.find(item => norm(item?.path) === norm(ref.path));
          if (!historyCopy || historyCopy.sha256 !== ref.sha256 || historyCopy.readForReplacementAnswer !== false) {
            throw new Error('HISTORY');
          }
          return { value: JSON.parse(bytes.toString('utf8')), bytes, path: ref.path, sha256: ref.sha256 };
        } catch {
          issue(issues, `QUESTION_ONLY_Q22_${label}_EVIDENCE_INVALID`);
          return null;
        }
      };
      const readHistoryJson = (ref, label) => {
        try {
          const file = inside(repoRoot, norm(ref?.path));
          const bytes = fs.readFileSync(file);
          if (!ref?.sha256 || sha(bytes) !== ref.sha256) throw new Error('SHA');
          const historyCopy = history.find(item => norm(item?.path) === norm(ref.path));
          if (!historyCopy || historyCopy.sha256 !== ref.sha256 || historyCopy.readForReplacementAnswer !== false) {
            throw new Error('HISTORY');
          }
          return { value: JSON.parse(bytes.toString('utf8')), path: ref.path, sha256: ref.sha256 };
        } catch {
          issue(issues, `QUESTION_ONLY_Q22_${label}_HISTORY_INVALID`);
          return null;
        }
      };
      const sameRefPath = (left, right) => {
        try {
          const resolve = value => path.isAbsolute(value)
            ? fs.realpathSync(value)
            : fs.realpathSync(inside(repoRoot, norm(value)));
          return Boolean(left && right && resolve(left) === resolve(right));
        } catch { return false; }
      };
      const r1Bound = readEvidence(holdEvidence.r1Ref, 'R1');
      const r2Bound = readEvidence(holdEvidence.r2Ref, 'R2');
      const r1 = r1Bound?.value, r2 = r2Bound?.value;
      const r1Row = array(r1?.rows).find(item => Number(item?.qid) === qid);
      const r2Row = array(r2?.rows).find(item => Number(item?.qid) === qid);
      if (!originalSourceCopy || originalSourceCopy.sha256 !== auth.source?.rawSha256
        || target.qid !== qid || target.problemImageRef !== null || target.problemImageSha256 !== null
        || target.sourceImageActuallyOpened !== false || target.sourceParityClaim !== 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT'
        || original?.image != null && original.image !== ''
        || ledger.source?.candidateChangedOnlyQid !== qid) issue(issues, 'QUESTION_ONLY_Q22_ORIGINAL_SLOT_OR_SOURCE_BINDING_INVALID');
      if (ledger.schemaVersion !== 'JS_ARCHIVE_QUESTION_ONLY_REPLACEMENT_LEDGER_V1'
        || ledger.originalQ19 !== undefined) issue(issues, 'QUESTION_ONLY_Q22_HISTORY_SCHEMA_INVALID');
      const freezeBound = r1 ? readHistoryJson(r1.independentFreeze, 'ORIGINAL_FREEZE') : null;
      const oldBundleBound = r1 ? readHistoryJson({
        path: r1.independentFreeze?.studentBundlePath,
        sha256: r1.independentFreeze?.studentBundleSha256,
      }, 'ORIGINAL_STUDENT_BUNDLE') : null;
      const currentBundleBound = r1 ? readHistoryJson(r1.currentStudentBundle, 'CURRENT_STUDENT_BUNDLE') : null;
      const metaPlanBound = r1 ? readHistoryJson(r1.metaRepairScopePlan, 'META_REPAIR_SCOPE_PLAN') : null;
      const metaLedgerBound = r1 ? readHistoryJson(r1.metaCorrectionLedger, 'META_CORRECTION_LEDGER') : null;
      const r1FreezeValidityRef = holdEvidence.r1FreezeValidityRef;
      const freezeValidityBound = r1 ? readHistoryJson(r1FreezeValidityRef, 'FREEZE_VALIDITY') : null;
      const freeze = freezeBound?.value, oldBundle = oldBundleBound?.value;
      const currentBundle = currentBundleBound?.value, metaPlan = metaPlanBound?.value;
      const metaLedger = metaLedgerBound?.value, freezeValidity = freezeValidityBound?.value;
      const freezeRow = array(freeze?.rows).find(item => Number(item?.qid) === qid);
      const oldBundleRow = array(oldBundle?.rows).find(item => Number(item?.qid) === qid);
      const currentBundleRow = array(currentBundle?.rows).find(item => Number(item?.qid) === qid);
      const freezeAssetPairs = assetRow => array(assetRow?.assets)
        .map(asset => [asset?.ref, asset?.sha256]).sort((a, b) => String(a[0]).localeCompare(String(b[0])));
      const q22FreezeAssetsEqual = same(freezeAssetPairs(oldBundleRow), freezeAssetPairs(currentBundleRow));
      const currentProjectionIssues = currentBundle
        ? currentStudentProjectionIssues(currentBundle, sourceBank, assetRoot, auth.source?.rawSha256, auth.source?.gitBlobSha)
        : ['QUESTION_ONLY_Q22_CURRENT_STUDENT_BUNDLE_MISSING'];
      issues.push(...currentProjectionIssues);
      const metaScopeQids = [11, 14];
      const correctionQids = array(metaLedger?.corrections).map(item => Number(item?.qid)).sort((a, b) => a - b);
      const postfreezeQids = array(freezeValidity?.rows).map(item => Number(item?.qid)).sort((a, b) => a - b);
      if (!freezeBound || freeze?.schemaVersion !== 'JS_ARCHIVE_IMMUTABLE_BLIND_FREEZE_V1'
        || freeze.stage !== 'R1' || freeze.sourceRawSha256 !== r1?.independentFreeze?.sourceRawSha256
        || !freezeRow || array(freeze.rows).length !== candidateIds.length
        || !same(array(freeze.rows).map(item => Number(item?.qid)), candidateIds)
        || !same(array(freeze.studentQidOrder), candidateIds)
        || !sameRefPath(freeze.studentBundle?.path, r1?.independentFreeze?.studentBundlePath)
        || freeze.studentBundle?.sha256 !== r1?.independentFreeze?.studentBundleSha256
        || !oldBundleBound || oldBundle?.schemaVersion !== 'JS_ARCHIVE_STUDENT_BUNDLE_V2'
        || oldBundle.sourceRawSha256 !== freeze.sourceRawSha256
        || !same(oldBundle.qids, candidateIds) || array(oldBundle.rows).length !== candidateIds.length
        || !oldBundleRow || !currentBundleRow
        || oldBundleRow.studentPayloadSha256 !== currentBundleRow.studentPayloadSha256
        || oldBundleRow.studentPayloadSha256 !== r1Row?.studentPayloadSha256
        || !same(oldBundleRow.student, currentBundleRow.student) || !q22FreezeAssetsEqual
        || !same(freezeRow.independentAnswer, r1Row?.independentAnswer)) {
        issue(issues, 'QUESTION_ONLY_Q22_ORIGINAL_FREEZE_REUSE_INVALID');
      }
      if (!currentBundleBound || r1?.currentStudentBundle?.sourceRawSha256 !== auth.source?.rawSha256
        || currentBundle?.sourceRawSha256 !== auth.source?.rawSha256
        || Number(r1?.currentStudentBundle?.questionCount) !== candidateIds.length
        || !sameRefPath(r1?.currentStudentBundle?.path, currentBundleBound?.path)) {
        issue(issues, 'QUESTION_ONLY_Q22_CURRENT_STUDENT_BUNDLE_BINDING_INVALID');
      }
      if (!metaPlanBound || !same(metaPlan?.scopeQids?.map(Number).sort((a, b) => a - b), metaScopeQids)
        || metaPlan?.outsideScopeParity !== 'EXACT'
        || !sameRefPath(metaPlan?.originalFreeze?.path, r1?.independentFreeze?.path)
        || metaPlan?.originalFreeze?.sha256 !== r1?.independentFreeze?.sha256
        || !sameRefPath(metaPlan?.oldBundle?.path, r1?.independentFreeze?.studentBundlePath)
        || metaPlan?.oldBundle?.sha256 !== r1?.independentFreeze?.studentBundleSha256
        || !sameRefPath(metaPlan?.currentBundle?.path, r1?.currentStudentBundle?.path)
        || metaPlan?.currentBundle?.sha256 !== r1?.currentStudentBundle?.sha256) {
        issue(issues, 'QUESTION_ONLY_Q22_META_REPAIR_SCOPE_PROOF_INVALID');
      }
      if (!metaLedgerBound || !same(metaLedger?.changedQids?.map(Number).sort((a, b) => a - b), metaScopeQids)
        || !same(correctionQids, metaScopeQids)
        || metaLedger?.sourceBeforeRawSha256 !== freeze?.sourceRawSha256
        || metaLedger?.sourceAfterRawSha256 !== auth.source?.rawSha256
        || !String(metaLedger?.studentBodyAndAssetsParity || '').startsWith('EXACT_ALL_23_QIDS')
        || !String(metaLedger?.unchangedQidsDeepObjectParity || '').startsWith('PASS')) {
        issue(issues, 'QUESTION_ONLY_Q22_META_CORRECTION_LEDGER_INVALID');
      }
      if (!freezeValidityBound || r1FreezeValidityRef?.path !== r1?.postfreezeDisclosure?.metaRepairScopePath
        || r1FreezeValidityRef?.sha256 !== r1?.postfreezeDisclosure?.metaRepairScopeSha256
        || !same(r1?.postfreezeDisclosure?.metaRepairScopeQids?.map(Number).sort((a, b) => a - b), metaScopeQids)
        || freezeValidity?.schemaVersion !== 'JS_ARCHIVE_POSTFREEZE_DISCLOSURE_V2'
        || freezeValidity?.sourceRawSha256 !== auth.source?.rawSha256
        || freezeValidity?.originalFreezeSourceRawSha256 !== freeze?.sourceRawSha256
        || freezeValidity?.studentParity !== 'EXACT'
        || !same(postfreezeQids, metaScopeQids)
        || !sameRefPath(freezeValidity?.originalFreeze?.path, r1?.independentFreeze?.path)
        || freezeValidity?.originalFreeze?.sha256 !== r1?.independentFreeze?.sha256
        || !sameRefPath(freezeValidity?.studentBundle?.path, r1?.independentFreeze?.studentBundlePath)
        || freezeValidity?.studentBundle?.sha256 !== r1?.independentFreeze?.studentBundleSha256) {
        issue(issues, 'QUESTION_ONLY_Q22_FREEZE_VALIDITY_PROOF_INVALID');
      }
      if (!r1Bound || r1?.schemaVersion !== 'JS_ARCHIVE_STAGE_EVIDENCE_v2'
        || r1.qualityContractVersion !== QUALITY_CONTRACT || r1.executionLine !== 'CODEX' || r1.stage !== 'R1'
        || r1.examUid !== evidence?.examUid || r1.artifactRawSha256 !== auth.source?.rawSha256
        || r1.artifactSha !== auth.source?.gitBlobSha || !r1Row
        || Number(r1.questionCount) !== candidateIds.length || array(r1.rows).length !== candidateIds.length
        || r1Row.verdict !== 'PASS' || r1Row.independentAnswerFrozenBeforeStoredAnswer !== true
        || r1Row.itemStatusDisposition !== 'TRUE_ITEM_HOLD_NONUNIQUE'
        || r1.independentFreeze?.sourceRawSha256 !== freeze?.sourceRawSha256
        || r1.currentStudentBundle?.sourceRawSha256 !== auth.source?.rawSha256) {
        issue(issues, 'QUESTION_ONLY_Q22_R1_TRUE_HOLD_NOT_PROVEN');
      }
      if (!r2Bound || r2?.qualityContractVersion !== QUALITY_CONTRACT || r2.executionLine !== 'CODEX' || r2.stage !== 'R2'
        || r2.examUid !== evidence?.examUid || r2.artifactRawSha256 !== auth.source?.rawSha256
        || r2.artifactSha !== auth.source?.gitBlobSha || !r2Row
        || Number(r2.freeze?.qidCount) !== candidateIds.length || array(r2.rows).length !== candidateIds.length
        || Number(r2.studentParity?.qidCount) !== candidateIds.length || r2.studentParity?.allQids !== 'MATCH'
        || r2Row.verdict !== 'PASS' || r2Row.itemHoldStatus !== 'TRUE_ITEM_HOLD_NONUNIQUE'
        || !array(r2.itemHoldQids).includes(qid)
        || r2.freeze?.status !== 'FROZEN_BEFORE_STORED_ANSWER_DISCLOSURE'
        || r2.freeze?.sourceRawSha256 !== auth.source?.rawSha256 || r2.studentParity?.status !== 'PASS'
        || r2.studentParity?.sourceRawSha256 !== auth.source?.rawSha256
        || r2.r1Evidence?.sha256 !== r1Bound?.sha256 || !sameRefPath(r2.r1Evidence?.path, r1Bound?.path)) {
        issue(issues, 'QUESTION_ONLY_Q22_R2_TRUE_HOLD_NOT_PROVEN');
      }
      historyProof = r1Bound && r2Bound ? {
        ledgerPath: ledgerRel,
        ledgerSha256: sha(fs.readFileSync(inside(repoRoot, ledgerRel))),
        originalSourcePath: originalSourceCopy?.path || null,
        originalSourceSha256: originalSourceCopy?.sha256 || null,
        r1Path: r1Bound.path,
        r1Sha256: r1Bound.sha256,
        r2Path: r2Bound.path,
        r2Sha256: r2Bound.sha256,
        originalFreezePath: freezeBound?.path || null,
        originalFreezeSha256: freezeBound?.sha256 || null,
        originalFreezeSourceRawSha256: freeze?.sourceRawSha256 || null,
        originalStudentBundlePath: oldBundleBound?.path || null,
        originalStudentBundleSha256: oldBundleBound?.sha256 || null,
        currentStudentBundlePath: currentBundleBound?.path || null,
        currentStudentBundleSha256: currentBundleBound?.sha256 || null,
        currentStudentBundleSourceRawSha256: currentBundle?.sourceRawSha256 || null,
        r1FreezeValidityPath: freezeValidityBound?.path || null,
        r1FreezeValiditySha256: freezeValidityBound?.sha256 || null,
        metaRepairScopePlanPath: metaPlanBound?.path || null,
        metaRepairScopePlanSha256: metaPlanBound?.sha256 || null,
        metaCorrectionLedgerPath: metaLedgerBound?.path || null,
        metaCorrectionLedgerSha256: metaLedgerBound?.sha256 || null,
        q22StudentPayloadSha256: currentBundleRow?.studentPayloadSha256 || null,
        q22AssetRefsAndShas: freezeAssetPairs(currentBundleRow),
        originalProblemImageRef: null,
        originalProblemImageSha256: null,
      } : null;
    }
  }

  const fields = row?.answerAudit || {};
  let answerReview = null;
  let answerReviewSha256 = null;
  try {
    const file = inside(repoRoot, norm(fields.evidenceRef));
    const bytes = fs.readFileSync(file);
    answerReview = JSON.parse(bytes.toString('utf8'));
    answerReviewSha256 = sha(bytes);
  } catch { issue(issues, 'QUESTION_ONLY_ANSWER_EVIDENCE_MISSING'); }
  const q22WrittenAnswerAudit = answerReview?.writtenAnswerAudit || {};
  const q22WrittenAnswerInvalid = profile?.key === Q22_PROFILE.key
    && (candidate?.questionType !== 'short_answer' || array(candidate?.choices).length !== 0
      || typeof candidate?.answer !== 'string' || !candidate.answer.trim()
      || fields.responseForm !== Q22_PROFILE.responseForm || Number(fields.cardinality) !== 1
      || answerReview?.responseForm !== Q22_PROFILE.responseForm
      || q22WrittenAnswerAudit.status !== 'PASS'
      || q22WrittenAnswerAudit.answerSha256 !== sha(Buffer.from(String(candidate?.answer ?? ''), 'utf8'))
      || q22WrittenAnswerAudit.answerCardinality !== 1
      || q22WrittenAnswerAudit.noDistinctAlternative !== true
      || !String(q22WrittenAnswerAudit.uniquenessReason || '').trim());
  const q22ChoiceAuditForbidden = profile?.key === Q22_PROFILE.key
    && array(answerReview?.choicesAudit).length !== 0;
  const q22ChoiceShapeInvalid = profile?.key === Q22_PROFILE.key
    && array(fields.choices).length !== 0;
  const q19ChoiceAuditInvalid = profile?.key === LEGACY_Q19_PROFILE.key
    && !same(answerReview?.choicesAudit?.filter(item => item.matches).map(item => item.choice), [candidate?.answer]);
  if (!candidate || !same(candidate.choices, fields.choices) || candidate.answer !== fields.answer
    || !String(fields.cardinality || '').trim() || answerReview?.schemaVersion !== 'QUESTION_ONLY_REPLACEMENT_MATH_CHECK_V2'
    || answerReview.examUid !== evidence.examUid || Number(answerReview.qid) !== qid
    || answerReview.candidateArtifactSha256 !== artifactRawSha256 || answerReview.answer !== candidate.answer
    || answerReview.answerCardinality !== 1 || answerReview.usesStoredOriginalAnswerOrSolutionAsAuthority !== false
    || q19ChoiceAuditInvalid || q22WrittenAnswerInvalid || q22ChoiceAuditForbidden || q22ChoiceShapeInvalid) {
    issue(issues, 'QUESTION_ONLY_ANSWER_BINDING_INVALID');
  }
  const solutionSha = candidate ? sha(Buffer.from(String(candidate.solution ?? ''), 'utf8')) : null;
  const axes = row?.axisEvidence || {
    questionLayout: row?.questionLayout, solutionLayout: row?.solutionLayout,
    meta: row?.meta, visualSvg: row?.visual,
  };
  const solutionLayout = axes.solutionLayout || {};
  if (!candidate || row.solutionSha256 !== solutionSha || solutionLayout.solutionSha256 !== solutionSha
    || !['PASS', 'REPLACEMENT_CANDIDATE'].includes(String(solutionLayout.status || '').toUpperCase())
    || (row.smallBoardContinuityStatus !== 'PASS' && solutionLayout.smallBoardContinuityStatus !== 'PASS')) issue(issues, 'QUESTION_ONLY_SOLUTION_BINDING_INVALID');

  const metaKeys = ['standardCourse','standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern'];
  const metaEvidence = axes.meta || row?.meta || {};
  for (const key of metaKeys) if (!same(candidate?.[key], metaEvidence?.[key])) issue(issues, `QUESTION_ONLY_META_BINDING_MISMATCH:${key}`);
  const difficultyKeys = ['difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility'];
  for (const key of difficultyKeys) if (!same(candidate?.[key], row?.difficulty?.[key])) issue(issues, `QUESTION_ONLY_DIFFICULTY_BINDING_MISMATCH:${key}`);
  if (candidate?.level !== row?.difficulty?.level) issue(issues, 'QUESTION_ONLY_DIFFICULTY_LEVEL_BINDING_MISMATCH');
  let difficultyReviewSha256 = null;
  try {
    const difficultyFile = inside(repoRoot, norm(row?.difficulty?.evidenceRef));
    const bytes = fs.readFileSync(difficultyFile), review = JSON.parse(bytes.toString('utf8'));
    const own = review.ownCurrentPass || {};
    if (review.schemaVersion !== 'JS_ARCHIVE_DIFFICULTY_CURRENT_PASS_V1' || review.examUid !== evidence.examUid
      || Number(review.qid) !== qid || review.candidateArtifactSha256 !== artifactRawSha256
      || review.sourceMode !== 'QUESTION_ONLY' || review.replacedItemDifficultyCopied !== false
      || own.difficultyBucket !== candidate?.difficultyBucket || own.difficultyConfidence !== candidate?.difficultyConfidence
      || own.difficultyBoundaryFlag !== candidate?.difficultyBoundaryFlag || own.legacyLevel !== candidate?.level
      || own.legacyLevelCompatibility !== candidate?.legacyLevelCompatibility) issue(issues, 'QUESTION_ONLY_DIFFICULTY_REVIEW_BINDING_INVALID');
    difficultyReviewSha256 = sha(bytes);
  } catch { issue(issues, 'QUESTION_ONLY_DIFFICULTY_REVIEW_MISSING'); }

  let metaBindingSha256 = null;
  try {
    const metaFile = inside(repoRoot, norm(metaEvidence?.extensionRef));
    const bytes = fs.readFileSync(metaFile), review = JSON.parse(bytes.toString('utf8'));
    if (review.schemaVersion !== 'JS_ARCHIVE_GENERATED_ONLY_BINDING_CANDIDATE_V1'
      || review.target?.examUid !== evidence.examUid || Number(review.target?.qid) !== qid
      || review.artifact?.sha256 !== artifactRawSha256 || review.artifact?.gitBlobSha !== artifactGitBlobSha
      || review.scope?.onlyThisCandidateQid !== true || review.scope?.targetUidCount !== 1
      || review.authorityRef?.sha256 !== authorityRef?.sha256
      || (profile?.key === Q22_PROFILE.key && review.replacedItemMetaCopied !== false)) {
      issue(issues, 'QUESTION_ONLY_META_REVIEW_BINDING_INVALID');
    }
    metaBindingSha256 = sha(bytes);
  } catch { issue(issues, 'QUESTION_ONLY_META_REVIEW_MISSING'); }

  const visual = row?.visual || {}, axisVisual = axes.visualSvg || {};
  const problemRef = visual.problem?.ref, solutionRef = visual.solution?.ref;
  if (profile?.key === LEGACY_Q19_PROFILE.key) {
    if (!candidate || candidate.image !== problemRef || candidate.solutionImage !== solutionRef
      || (axisVisual.problem?.ref || axisVisual.problem?.assetRef) !== problemRef
      || (axisVisual.solution?.ref || axisVisual.solution?.assetRef) !== solutionRef) issue(issues, 'QUESTION_ONLY_VISUAL_REF_BINDING_INVALID');
    for (const [kind, ref, expectedA, expectedB] of [
      ['problem', problemRef, visual.problem?.sha256, axisVisual.problem?.sha256 || axisVisual.problem?.assetSha256],
      ['solution', solutionRef, visual.solution?.sha256, axisVisual.solution?.sha256 || axisVisual.solution?.assetSha256],
    ]) {
      try {
        const file = inside(assetRoot, ref);
        const bytes = fs.readFileSync(file), actual = sha(bytes);
        if (actual !== expectedA || actual !== expectedB) issue(issues, `QUESTION_ONLY_VISUAL_SHA_MISMATCH:${kind}`);
        const authAsset = array(auth.candidate?.assets).find(item => item?.kind === kind);
        if (!authAsset || authAsset.ref !== ref || authAsset.sha256 !== actual
          || (authAsset.gitBlobSha && authAsset.gitBlobSha !== blob(bytes))) issue(issues, `QUESTION_ONLY_AUTHORITY_ASSET_BINDING_INVALID:${kind}`);
      } catch { issue(issues, `QUESTION_ONLY_VISUAL_ASSET_MISSING:${kind}`); }
    }
    if (array(auth.candidate?.assets).length !== 2) issue(issues, 'QUESTION_ONLY_AUTHORITY_ASSET_DENOMINATOR_INVALID');
    if (visual.problem?.necessity !== 'VISUAL_REQUIRED' || visual.problem?.disposition !== 'KEEP'
      || visual.solution?.disposition !== 'ADD' || !String(visual.solution?.benefitReason || visual.solution?.reason || '').trim()
      || axisVisual.problem?.necessity !== 'VISUAL_REQUIRED' || axisVisual.solution?.necessity !== 'VISUAL_OPTIONAL'
      || (axisVisual.solution?.staticGeometryStatus !== 'PASS' && axisVisual.solution?.geometryEvidence !== 'PASS')
      || axisVisual.solution?.renderPassAsserted === true
      || !String(visual.solution?.geometryEvidenceRef || '').trim()) issue(issues, 'QUESTION_ONLY_VISUAL_EVIDENCE_INCOMPLETE');
    try {
      const geometryFile = inside(repoRoot, norm(visual.solution?.geometryEvidenceRef));
      const geometry = JSON.parse(fs.readFileSync(geometryFile, 'utf8'));
      if (!String(geometry.schemaVersion || '').includes('GEOMETRY') || geometry.backend !== 'STANDARD_SVG') issue(issues, 'QUESTION_ONLY_GEOMETRY_EVIDENCE_INVALID');
    } catch { issue(issues, 'QUESTION_ONLY_GEOMETRY_EVIDENCE_MISSING'); }
  } else if (profile?.key === Q22_PROFILE.key) {
    const refOrNull = value => value == null || value === '' ? null : value;
    if (!candidate || refOrNull(candidate.image) !== refOrNull(problemRef)
      || refOrNull(candidate.solutionImage) !== refOrNull(solutionRef)
      || refOrNull(axisVisual.problem?.ref ?? axisVisual.problem?.assetRef) !== refOrNull(problemRef)
      || refOrNull(axisVisual.solution?.ref ?? axisVisual.solution?.assetRef) !== refOrNull(solutionRef)) {
      issue(issues, 'QUESTION_ONLY_VISUAL_REF_BINDING_INVALID');
    }
    if ((!refOrNull(problemRef) && (visual.problem?.ref !== null || axisVisual.problem?.ref !== null))
      || (!refOrNull(solutionRef) && (visual.solution?.ref !== null || axisVisual.solution?.ref !== null))) {
      issue(issues, 'QUESTION_ONLY_VISUAL_NULL_REF_MUST_BE_EXPLICIT');
    }
    const expectedAssets = [];
    for (const [kind, refValue, expectedA, expectedB] of [
      ['problem', refOrNull(problemRef), visual.problem?.sha256, axisVisual.problem?.sha256 || axisVisual.problem?.assetSha256],
      ['solution', refOrNull(solutionRef), visual.solution?.sha256, axisVisual.solution?.sha256 || axisVisual.solution?.assetSha256],
    ]) {
      if (!refValue) {
        if (expectedA !== null || expectedB !== null) issue(issues, `QUESTION_ONLY_VISUAL_NULL_SHA_FORBIDDEN:${kind}`);
        continue;
      }
      try {
        const file = inside(assetRoot, refValue);
        const bytes = fs.readFileSync(file), actual = sha(bytes);
        if (actual !== expectedA || actual !== expectedB) issue(issues, `QUESTION_ONLY_VISUAL_SHA_MISMATCH:${kind}`);
        const authAsset = array(auth.candidate?.assets).find(item => item?.kind === kind);
        if (!authAsset || authAsset.ref !== refValue || authAsset.sha256 !== actual
          || (authAsset.gitBlobSha && authAsset.gitBlobSha !== blob(bytes))) issue(issues, `QUESTION_ONLY_AUTHORITY_ASSET_BINDING_INVALID:${kind}`);
        expectedAssets.push({ kind, ref: refValue, sha256: actual, ...(authAsset?.gitBlobSha ? { gitBlobSha: blob(bytes) } : {}) });
      } catch { issue(issues, `QUESTION_ONLY_VISUAL_ASSET_MISSING:${kind}`); }
    }
    const extras = [];
    const collectAssetRefs = (kind, value, index = '') => {
      if (typeof value === 'string' && value.trim()) {
        extras.push({ kind: index ? `${kind}:${index}` : kind, ref: value });
      } else if (Array.isArray(value)) {
        value.forEach((item, itemIndex) => collectAssetRefs(kind, item, String(itemIndex)));
      } else if (value && typeof value === 'object') {
        const ref = value.ref || value.path || value.assetRef || value.imageRef;
        if (typeof ref === 'string' && ref.trim()) extras.push({ kind: value.kind || kind, ref });
        else Object.entries(value).filter(([key]) => /(?:ref|path|image|asset)$/i.test(key))
          .forEach(([key, item]) => collectAssetRefs(`${kind}:${key}`, item));
      }
    };
    for (const field of ['images', 'visualAsset', 'assets']) collectAssetRefs(field, candidate?.[field]);
    const seenAssets = new Set(expectedAssets.map(item => `${item.kind}:${item.ref}`));
    for (const extra of extras) {
      const key = `${extra.kind}:${extra.ref}`;
      if (seenAssets.has(key)) continue;
      seenAssets.add(key);
      try {
        const file = inside(assetRoot, extra.ref);
        const bytes = fs.readFileSync(file), actual = sha(bytes);
        const authAsset = array(auth.candidate?.assets).find(item => item?.kind === extra.kind && item?.ref === extra.ref);
        if (!authAsset || authAsset.sha256 !== actual
          || (authAsset.gitBlobSha && authAsset.gitBlobSha !== blob(bytes))) issue(issues, `QUESTION_ONLY_AUTHORITY_ASSET_BINDING_INVALID:${extra.kind}`);
        expectedAssets.push({ kind: extra.kind, ref: extra.ref, sha256: actual, ...(authAsset?.gitBlobSha ? { gitBlobSha: blob(bytes) } : {}) });
      } catch { issue(issues, `QUESTION_ONLY_VISUAL_ASSET_MISSING:${extra.kind}`); }
    }
    const actualAssets = array(auth.candidate?.assets).map(item => ({
      kind: item?.kind, ref: item?.ref, sha256: item?.sha256,
      ...(item?.gitBlobSha ? { gitBlobSha: item.gitBlobSha } : {}),
    })).sort((a, b) => `${a.kind}:${a.ref}`.localeCompare(`${b.kind}:${b.ref}`));
    expectedAssets.sort((a, b) => `${a.kind}:${a.ref}`.localeCompare(`${b.kind}:${b.ref}`));
    if (!same(actualAssets, expectedAssets)) issue(issues, 'QUESTION_ONLY_AUTHORITY_ASSET_DENOMINATOR_INVALID');
    const validNecessity = new Set(['VISUAL_REQUIRED', 'VISUAL_BENEFICIAL', 'VISUAL_OPTIONAL', 'VISUAL_EXEMPT']);
    const validDisposition = new Set(['KEEP', 'ADD', 'EXEMPT']);
    for (const [kind, refValue, decision, axisDecision] of [
      ['problem', refOrNull(problemRef), visual.problem || {}, axisVisual.problem || {}],
      ['solution', refOrNull(solutionRef), visual.solution || {}, axisVisual.solution || {}],
    ]) {
      if (!validNecessity.has(decision.necessity) || !validDisposition.has(decision.disposition)
        || decision.necessity !== axisDecision.necessity) issue(issues, `QUESTION_ONLY_VISUAL_TRIAGE_INCOMPLETE:${kind}`);
      if (refValue && (decision.disposition === 'EXEMPT' || decision.necessity === 'VISUAL_EXEMPT')) {
        issue(issues, `QUESTION_ONLY_VISUAL_ASSET_EXEMPT_WITH_REF:${kind}`);
      }
      if (!refValue && (decision.necessity !== 'VISUAL_EXEMPT' || decision.disposition !== 'EXEMPT'
        || !String(decision.reason || decision.benefitReason || '').trim())) {
        issue(issues, `QUESTION_ONLY_VISUAL_EXEMPTION_UNSUPPORTED:${kind}`);
      }
      if (refValue && decision.disposition === 'ADD' && !String(decision.reason || decision.benefitReason || '').trim()) {
        issue(issues, `QUESTION_ONLY_VISUAL_ADD_REASON_REQUIRED:${kind}`);
      }
      if (kind === 'solution' && refValue && (!String(decision.geometryEvidenceRef || '').trim()
        || (axisDecision.staticGeometryStatus !== 'PASS' && axisDecision.geometryEvidence !== 'PASS')
        || axisDecision.renderPassAsserted === true || !/\.svg(?:$|[?#])/i.test(refValue))) {
        issue(issues, 'QUESTION_ONLY_GEOMETRY_EVIDENCE_INCOMPLETE');
      }
    }
    if (solutionRef) {
      try {
        const geometryFile = inside(repoRoot, norm(visual.solution?.geometryEvidenceRef));
        const geometry = JSON.parse(fs.readFileSync(geometryFile, 'utf8'));
        if (!String(geometry.schemaVersion || '').includes('GEOMETRY') || geometry.backend !== 'STANDARD_SVG') issue(issues, 'QUESTION_ONLY_GEOMETRY_EVIDENCE_INVALID');
      } catch { issue(issues, 'QUESTION_ONLY_GEOMETRY_EVIDENCE_MISSING'); }
    }
  }

  const render = row?.actualRender || {};
  if (render.status !== 'CAPTURED_REVIEW_REQUIRED' || render.renderPassAsserted !== false
    || (render.r3LayoutReviewStatus || render.R3LayoutReviewStatus) !== 'PENDING'
    || render.creatorScreenInspection !== `ACTUALLY_OPENED_AND_INSPECTED_Q${qid}`
    || !render.captureReport || !render.captureReportSha256 || !render.desktopSolutionScreenshot) issue(issues, 'QUESTION_ONLY_CAPTURE_EVIDENCE_INCOMPLETE');
  try {
    const captureFile = inside(repoRoot, norm(render.captureReport));
    const captureBytes = fs.readFileSync(captureFile), capture = JSON.parse(captureBytes.toString('utf8'));
    if (sha(captureBytes) !== render.captureReportSha256 || capture.status !== 'CAPTURED_REVIEW_REQUIRED'
      || capture.renderPass !== false || !array(capture.qids).includes(qid)
      || capture.artifactSha !== artifactGitBlobSha || capture.loadedJs?.sha256 !== artifactRawSha256) issue(issues, 'QUESTION_ONLY_CAPTURE_BINDING_INVALID');
    const solCase = array(capture.cases).find(item => item.id === 'sol/desktop');
    const shot = array(solCase?.captures).find(item => array(item.qids).includes(qid))?.image;
    if (!shot?.path || norm(shot.path) !== norm(render.desktopSolutionScreenshot)) issue(issues, 'QUESTION_ONLY_SOLUTION_CAPTURE_BINDING_INVALID');
    else if (sha(fs.readFileSync(inside(repoRoot, shot.path))) !== shot.sha256) issue(issues, 'QUESTION_ONLY_SOLUTION_SCREENSHOT_SHA_MISMATCH');
  } catch { issue(issues, 'QUESTION_ONLY_CAPTURE_REPORT_MISSING'); }

  summary.candidateFieldBindings = candidate ? {
    artifactRawSha256,
    qid,
    slotOrdinal: Number(auth.sourceOrdinal),
    studentSha256: sha(Buffer.from(JSON.stringify(Object.fromEntries(['id','category','originalCategory','questionType','layoutTag','tags','wide','content','choices','image'].map(key => [key, candidate[key]]))))),
    answerSha256: sha(Buffer.from(String(candidate.answer ?? ''))),
    solutionSha256: solutionSha,
    metaSha256: sha(Buffer.from(JSON.stringify(Object.fromEntries(metaKeys.map(key => [key, candidate[key]]))))),
    difficultySha256: sha(Buffer.from(JSON.stringify(Object.fromEntries([...difficultyKeys, 'level'].map(key => [key, candidate[key]]))))),
    visualSha256: sha(Buffer.from(JSON.stringify(Object.fromEntries(['image','images','visualAsset','imageSize','solutionImage','solutionImageSize','solutionImageLayout','solutionImageAlt','solutionImageCaption','assets'].map(key => [key, candidate[key]]))))),
    answerReviewSha256,
    difficultyReviewSha256,
    metaBindingSha256,
    historicalEvidence: historyProof,
  } : null;
  summary.authorityPath = authorityRef?.path || null;
  summary.authoritySha256 = authorityRef?.sha256 || null;
  summary.sourcePath = sourcePath || null;
  summary.sourceRawSha256 = auth.source?.rawSha256 || null;
  summary.sourceGitBlobSha = auth.source?.gitBlobSha || null;
  summary.changedQids = sourceBank.length && candidate ? sourceBank.filter(question => {
    const current = questions.find(item => Number(item.id) === Number(question.id));
    return !same(question, current);
  }).map(question => Number(question.id)) : [];
  return { ok: issues.length === 0, issues, summary };
}
