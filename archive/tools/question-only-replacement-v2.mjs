import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

export const QUESTION_ONLY_AUTHORITY_SCHEMA = 'JS_ARCHIVE_QUESTION_ONLY_REPLACEMENT_AUTHORITY_V1';
const QUALITY_CONTRACT = 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const blob = value => {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
};
const array = value => Array.isArray(value) ? value : [];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const norm = value => String(value || '').replaceAll('\\', '/');

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

function issue(issues, code) { issues.push(code); }

export function validateQuestionOnlyReplacement({
  evidence, row, questions, repoRoot, assetRoot, artifactRawSha256, artifactGitBlobSha,
  authorityRef, authority,
}) {
  const issues = [];
  const summary = { qid: Number(row?.qid), scope: 'QUESTION_ONLY', sourceParity: 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT' };
  const qid = Number(row?.qid);
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
  if (auth.userDirective !== '두 건은 수정프로토콜로 수정 후 마감 처리해') issue(issues, 'QUESTION_ONLY_AUTHORITY_DIRECTIVE_MISMATCH');

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
      || ledger.originalQ19?.sourceParityClaim !== 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT') issue(issues, 'QUESTION_ONLY_HISTORY_LEDGER_BINDING_INVALID');
    const history = array(ledger.historyCopies);
    const historyPaths = new Set(history.map(item => norm(item?.path)));
    if (!history.length || history.some(item => item?.readForReplacementAnswer !== false)) issue(issues, 'QUESTION_ONLY_HISTORY_COPY_SCOPE_INVALID');
    for (const entry of history) {
      try {
        const file = inside(repoRoot, entry.path);
        if (sha(fs.readFileSync(file)) !== entry.sha256) issue(issues, 'QUESTION_ONLY_HISTORY_COPY_SHA_MISMATCH');
      } catch { issue(issues, 'QUESTION_ONLY_HISTORY_COPY_MISSING'); }
    }
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
  if (!candidate || !same(candidate.choices, fields.choices) || candidate.answer !== fields.answer
    || !String(fields.cardinality || '').trim() || answerReview?.schemaVersion !== 'QUESTION_ONLY_REPLACEMENT_MATH_CHECK_V2'
    || answerReview.examUid !== evidence.examUid || Number(answerReview.qid) !== qid
    || answerReview.candidateArtifactSha256 !== artifactRawSha256 || answerReview.answer !== candidate.answer
    || answerReview.answerCardinality !== 1 || answerReview.usesStoredOriginalAnswerOrSolutionAsAuthority !== false
    || !same(answerReview.choicesAudit?.filter(item => item.matches).map(item => item.choice), [candidate.answer])) issue(issues, 'QUESTION_ONLY_ANSWER_BINDING_INVALID');
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
      || review.authorityRef?.sha256 !== authorityRef?.sha256) issue(issues, 'QUESTION_ONLY_META_REVIEW_BINDING_INVALID');
    metaBindingSha256 = sha(bytes);
  } catch { issue(issues, 'QUESTION_ONLY_META_REVIEW_MISSING'); }

  const visual = row?.visual || {}, axisVisual = axes.visualSvg || {};
  const problemRef = visual.problem?.ref, solutionRef = visual.solution?.ref;
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

  const render = row?.actualRender || {};
  if (render.status !== 'CAPTURED_REVIEW_REQUIRED' || render.renderPassAsserted !== false
    || (render.r3LayoutReviewStatus || render.R3LayoutReviewStatus) !== 'PENDING'
    || render.creatorScreenInspection !== 'ACTUALLY_OPENED_AND_INSPECTED_Q19'
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
