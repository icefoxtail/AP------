#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SCHEMA = 'JS_ARCHIVE_CREATE_FALSE_HOLD_ADJUDICATION_V1';
const HISTORY_SCHEMA = 'JS_ARCHIVE_CREATE_FALSE_HOLD_HISTORY_V1';
const Q24_DISPLAY_FIELDS = ['solutionImage', 'solutionImageSize', 'solutionImageLayout'];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlobSha = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const fail = (code, detail = '') => { throw new Error(detail ? `${code}:${detail}` : code); };
const repoFile = (root, rel) => {
  const input = String(rel || '');
  const file = path.isAbsolute(input) ? path.resolve(input) : path.resolve(root, input);
  if (!file.startsWith(path.resolve(root) + path.sep)) fail('PATH_OUTSIDE_REPOSITORY', rel);
  return file;
};
import vm from 'node:vm';
function bank(source) {
  const box = { window: {} };
  vm.runInNewContext(source, box, { timeout: 5000 });
  const questions = box.window.questionBank || box.window.questions;
  if (!Array.isArray(questions)) fail('QUESTION_BANK_REQUIRED');
  return questions;
}

export function prepareFalseHoldAdjudication({ root = ROOT, exam, evidence, adjudication }) {
  const examFile = repoFile(root, exam), evidenceFile = repoFile(root, evidence), adjudicationFile = repoFile(root, adjudication);
  const examBytes = fs.readFileSync(examFile), evidenceRaw = fs.readFileSync(evidenceFile, 'utf8');
  const evidenceObject = JSON.parse(evidenceRaw), adjudicationBytes = fs.readFileSync(adjudicationFile);
  const decision = JSON.parse(adjudicationBytes.toString('utf8'));
  if (decision.schemaVersion !== SCHEMA || decision.qualityContractVersion !== 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006' || decision.executionLine !== 'CODEX') fail('ADJUDICATION_SCHEMA_OR_CONTRACT_INVALID');
  if (decision.stage !== 'CREATE' || decision.qid !== 24 || decision.status !== 'FALSE_HOLD_CLEARED' || decision.scopeOnly !== true || decision.fullExamCreateComplete !== false) fail('ADJUDICATION_SCOPE_INVALID');
  const examRel = path.relative(root, examFile).replaceAll('\\', '/');
  const adjudicationRel = path.relative(root, adjudicationFile).replaceAll('\\', '/');
  if (evidenceObject.stage !== 'CREATE' || evidenceObject.examPath !== examRel || decision.examUid !== path.basename(examRel, '.js')) fail('EXAM_IDENTITY_MISMATCH');
  const currentSha = sha(examBytes);
  const isSupersession = decision.revision === 2;
  if (!isSupersession && (decision.sourceBinding?.rawSha256 !== currentSha || evidenceObject.examSha256 !== `sha256:${currentSha}`)) fail('CURRENT_SOURCE_SHA_MISMATCH');
  const questions = bank(examBytes.toString('utf8'));
  const q = questions.find(row => Number(row.id) === 24);
  if (!q) fail('Q24_REQUIRED');
  const hashValue = value => sha(Buffer.from(String(value ?? '')));
  const bindings = decision.sourceBinding;
  if (bindings.qidContentSha256 !== hashValue(q.content) || bindings.qidChoicesSha256 !== sha(Buffer.from(JSON.stringify(q.choices ?? [])))
    || bindings.qidAnswerSha256 !== hashValue(q.answer) || bindings.qidSolutionSha256 !== hashValue(q.solution)) fail('Q24_STUDENT_OR_SOLUTION_BINDING_MISMATCH');
  if (bindings.currentStudentPayloadSha256 !== bindings.baselineStudentPayloadSha256 || decision.studentSourceMutated !== false || decision.solutionMutated !== false) fail('Q24_MUTATION_FORBIDDEN');
  const assetRef = decision.assetBinding?.ref;
  if (assetRef !== q.image) fail('Q24_ASSET_REFERENCE_MISMATCH');
  const assetFile = repoFile(root, `archive/${assetRef}`);
  const assetBytes = fs.readFileSync(assetFile);
  if (decision.assetBinding?.sha256 !== sha(assetBytes) || decision.assetBinding?.opened !== true) fail('Q24_ASSET_SHA_OR_OPEN_REQUIRED');
  const holdRef = decision.falseHoldAdjudication || {};
  const holdFile = repoFile(root, holdRef.priorHoldPath || '');
  const holdBytes = fs.readFileSync(holdFile);
  if (sha(holdBytes) !== holdRef.priorHoldSha256 || holdRef.priorHoldPreservedUnchanged !== true) fail('ORIGINAL_HOLD_BINDING_MISMATCH');
  const freezeFile = repoFile(root, holdRef.originalFreezePath || '');
  if (sha(fs.readFileSync(freezeFile)) !== holdRef.originalFreezeSha256 || holdRef.originalFreezePreservedUnchanged !== true) fail('ORIGINAL_FREEZE_BINDING_MISMATCH');
  if (!Array.isArray(holdRef.proof) || holdRef.proof.length < 3 || !holdRef.proof[0].includes('[ABC]=[DBC]') || !holdRef.proof[1].includes('[OBC]') || !holdRef.proof[2].includes('3:5')) fail('ADJUDICATION_PROOF_INCOMPLETE');
  const row = (evidenceObject.questionRows || []).find(item => Number(item.qid) === 24);
  const existing = evidenceObject.falseHoldAdjudications || [];
  if (!row) fail('Q24_PHYSICAL_ROW_REQUIRED');
  if (isSupersession) {
    return prepareSupersedingAdjudication({ root, examRel, examBytes, currentSha, questions, q, evidenceObject, evidenceRaw, adjudicationBytes, adjudicationRel, decision, row, existing, assetBytes });
  }
  if (row.sourceExact?.status === 'PASS' && row.solutionMath?.status === 'PASS') {
    const prior = existing.find(item => Number(item.qid) === 24);
    const digest = sha(adjudicationBytes);
    if (prior?.adjudicationSha256 === digest && row.sourceExactAdjudicationRef?.sha256 === digest && row.solutionMathAdjudicationRef?.sha256 === digest) {
      const held = new Set();
      for (const qRow of evidenceObject.questionRows || []) if (Object.values(qRow).some(value => value && typeof value === 'object' && value.status === 'HOLD')) held.add(Number(qRow.qid));
      for (const mRow of evidenceObject.metaRows || []) if (mRow.result === 'HOLD') held.add(Number(mRow.qid));
      return { next: evidenceObject, entry: prior, itemHoldCount: held.size, alreadyApplied: true };
    }
    fail('Q24_FALSE_HOLD_ALREADY_ADJUDICATED');
  }
  if (row.sourceExact?.status !== 'HOLD' || row.solutionMath?.status !== 'HOLD') fail('FALSE_HOLD_NOT_CURRENTLY_HELD');
  if (existing.some(item => Number(item.qid) === 24)) fail('Q24_FALSE_HOLD_ALREADY_ADJUDICATED');
  const physicalRefs = [...(evidenceObject.sourceRefreshReviewV1?.receipts || [])];
  const staleCopy = physicalRefs.find(ref => ref.durablePath?.endsWith('.e5244fadc8814dae986c7363ace83e6dbd693aaae68cbdda99ba4173522169a0.json'));
  const staleCopySha = staleCopy ? sha(fs.readFileSync(repoFile(root, staleCopy.durablePath))) : null;
  const entry = {
    schemaVersion: HISTORY_SCHEMA,
    qid: 24,
    adjudicationPath: adjudicationRel,
    adjudicationSha256: sha(adjudicationBytes),
    originalHold: { path: holdRef.priorHoldPath, sha256: holdRef.priorHoldSha256 },
    originalFreeze: { path: holdRef.originalFreezePath, sha256: holdRef.originalFreezeSha256 },
    durableReceiptCopy: staleCopy ? { path: staleCopy.durablePath, declaredSha256: staleCopy.sha256, actualSha256: `sha256:${staleCopySha}`, parity: staleCopy.sha256 === `sha256:${staleCopySha}` ? 'MATCH' : 'MISMATCH_PRESERVED' } : null,
    currentSourceSha256: currentSha,
    currentAssetSha256: sha(assetBytes),
    clearedAxes: ['sourceExact', 'solutionMath'],
    priorStatuses: { sourceExact: row.sourceExact, solutionMath: row.solutionMath },
  };
  const next = JSON.parse(evidenceRaw);
  const nextRow = (next.questionRows || []).find(item => Number(item.qid) === 24);
  next.falseHoldAdjudications = [...existing, entry];
  nextRow.sourceExact = { status: 'PASS', evidence: 'q24 false HOLD cleared by hash-bound CREATE adjudication; see falseHoldAdjudications[0]' };
  nextRow.solutionMath = { status: 'PASS', evidence: 'q24 corrected proof adjudication; unchanged solution SHA bound; see falseHoldAdjudications[0]' };
  nextRow.sourceExactAdjudicationRef = { path: adjudicationRel, sha256: entry.adjudicationSha256, qid: 24 };
  nextRow.solutionMathAdjudicationRef = { path: adjudicationRel, sha256: entry.adjudicationSha256, qid: 24 };
  const held = new Set();
  for (const qRow of next.questionRows || []) if (Object.values(qRow).some(value => value && typeof value === 'object' && value.status === 'HOLD')) held.add(Number(qRow.qid));
  for (const mRow of next.metaRows || []) if (mRow.result === 'HOLD') held.add(Number(mRow.qid));
  next.summary = { ...(next.summary || {}), itemHoldCount: held.size };
  const priorHistory = Array.isArray(next.falseHoldAdjudicationHistory) ? next.falseHoldAdjudicationHistory : [];
  next.falseHoldAdjudicationHistory = [...priorHistory, { schemaVersion: HISTORY_SCHEMA, qid: 24, sourceExact: entry.priorStatuses.sourceExact, solutionMath: entry.priorStatuses.solutionMath, entrySha256: sha(Buffer.from(JSON.stringify(entry))) }];
  return { next, entry, itemHoldCount: held.size };
}

function prepareSupersedingAdjudication({ root, examRel, examBytes, currentSha, questions, q, evidenceObject, evidenceRaw, adjudicationBytes, adjudicationRel, decision, row, existing, assetBytes }) {
  const previousEntry = existing.find(item => Number(item.qid) === 24);
  if (!previousEntry || previousEntry.schemaVersion !== HISTORY_SCHEMA) fail('Q24_PRIOR_ADJUDICATION_REQUIRED');
  const supersedes = decision.supersedes || {};
  const previousPath = repoFile(root, supersedes.path || '');
  const previousBytes = fs.readFileSync(previousPath);
  const previousSha = sha(previousBytes);
  const recordedV1 = previousEntry.supersededAdjudication || { path: previousEntry.adjudicationPath, sha256: previousEntry.adjudicationSha256 };
  if (supersedes.path !== recordedV1.path || supersedes.sha256 !== previousSha || recordedV1.sha256 !== previousSha) fail('SUPERSEDES_V1_PATH_OR_SHA_MISMATCH');
  const previous = JSON.parse(previousBytes.toString('utf8'));
  if (previous.schemaVersion !== SCHEMA || previous.revision != null || previous.qid !== 24 || previous.examUid !== decision.examUid
    || previous.stage !== 'CREATE' || previous.status !== 'FALSE_HOLD_CLEARED' || previous.scopeOnly !== true || previous.fullExamCreateComplete !== false) fail('SUPERSEDED_V1_ADJUDICATION_INVALID');

  const deltaBinding = decision.sourceDeltaBinding || {};
  const manifestFile = repoFile(root, deltaBinding.manifestPath || '');
  const manifestBytes = fs.readFileSync(manifestFile);
  const manifestSha = sha(manifestBytes);
  if (deltaBinding.manifestSha256 !== manifestSha) fail('Q24_DELTA_MANIFEST_SHA_MISMATCH');
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  const expectedFields = Q24_DISPLAY_FIELDS;
  const baselineSha = previous.sourceBinding?.rawSha256;
  if (manifest.schemaVersion !== 'JS_ARCHIVE_Q24_ONLY_SOURCE_DELTA_V1' || manifest.examUid !== decision.examUid
    || manifest.baseline?.path !== examRel || manifest.baseline?.sha256 !== baselineSha
    || typeof manifest.candidate?.path !== 'string' || !manifest.candidate.path.includes('q24-visual-repair') || manifest.candidate?.sha256 !== currentSha
    || manifest.candidate?.gitBlobSha !== deltaBinding.currentSourceGitBlobSha1
    || deltaBinding.baselineSourceRawSha256 !== baselineSha || deltaBinding.currentSourceRawSha256 !== currentSha
    || JSON.stringify(manifest.semanticDiff?.changedQids) !== '[24]'
    || JSON.stringify(manifest.displayFields?.changedFields) !== JSON.stringify(expectedFields)
    || JSON.stringify(manifest.machineDiffChecks?.allNonTargetQidsDeepEqual) !== 'true'
    || manifest.machineDiffChecks?.allChecksPass !== true) fail('Q24_DELTA_MANIFEST_BINDING_INVALID');
  if (manifest.rawSourceDelta?.strippedCandidateSha256 !== baselineSha || manifest.rawSourceDelta?.removingAllThreeInsertedLinesRestoresBaselineByteForByte !== true) fail('Q24_DELTA_RAW_RECONSTRUCTION_INVALID');

  // The byte-bound manifest is independently checked by removing exactly the three declared q24 display lines.
  const expectedLines = [
    `    "solutionImage": ${JSON.stringify(q.solutionImage)},`,
    `    "solutionImageSize": ${JSON.stringify(q.solutionImageSize)},`,
    `    "solutionImageLayout": ${JSON.stringify(q.solutionImageLayout)},`,
  ];
  if (JSON.stringify(manifest.rawSourceDelta?.insertedLines) !== JSON.stringify(expectedLines.map(line => line.trim()))) fail('Q24_DELTA_INSERTED_LINES_INVALID');
  if (q.solutionImage !== 'assets/images/24_금당중_1학기_기말_중2_기출/q24-solution.svg' || q.solutionImageSize !== 'full' || q.solutionImageLayout !== 'fullwidth') fail('Q24_DISPLAY_FIELDS_INVALID');
  let strippedText = examBytes.toString('utf8');
  const exactBlock = expectedLines.join('\n') + '\n';
  const blockCount = strippedText.split(exactBlock).length - 1;
  if (blockCount !== 1) fail('Q24_DELTA_INSERTED_BLOCK_NOT_UNIQUE');
  strippedText = strippedText.replace(exactBlock, '');
  const strippedBytes = Buffer.from(strippedText);
  if (sha(strippedBytes) !== baselineSha || sha(strippedBytes) !== manifest.rawSourceDelta.strippedCandidateSha256) fail('Q24_DELTA_BASELINE_RECONSTRUCTION_MISMATCH');
  const baselineQuestions = bank(strippedText);
  if (baselineQuestions.length !== questions.length || baselineQuestions.some((baseQ, index) => Number(baseQ.id) !== Number(questions[index].id))) fail('Q24_DELTA_QID_DENOMINATOR_CHANGED');
  for (let index = 0; index < questions.length; index++) {
    const baseQ = baselineQuestions[index], currentQ = questions[index];
    if (Number(currentQ.id) !== 24) {
      if (JSON.stringify(baseQ) !== JSON.stringify(currentQ)) fail(`NON_TARGET_SOURCE_DELTA:q${currentQ.id}`);
      continue;
    }
    for (const key of new Set([...Object.keys(baseQ), ...Object.keys(currentQ)])) {
      if (expectedFields.includes(key)) continue;
      if (JSON.stringify(baseQ[key] ?? null) !== JSON.stringify(currentQ[key] ?? null)) fail(`Q24_UNAUTHORIZED_SOURCE_DELTA:${key}`);
    }
    if (JSON.stringify(Object.keys(currentQ).filter(key => !Object.hasOwn(baseQ, key)).sort()) !== JSON.stringify([...expectedFields].sort())) fail('Q24_ADDED_FIELDS_INVALID');
  }
  const priorBinding = previous.sourceBinding || {};
  if (priorBinding.rawSha256 !== baselineSha || priorBinding.currentStudentPayloadSha256 !== decision.sourceBinding?.currentStudentPayloadSha256
    || priorBinding.baselineStudentPayloadSha256 !== decision.sourceBinding?.baselineStudentPayloadSha256
    || decision.sourceBinding?.rawSha256 !== currentSha || decision.sourceBinding?.path !== examRel
    || decision.sourceBinding?.rawBufferGitBlobSha1 !== deltaBinding.currentSourceGitBlobSha1
    || gitBlobSha(examBytes) !== deltaBinding.currentSourceGitBlobSha1 || gitBlobSha(examBytes) !== manifest.candidate?.gitBlobSha) fail('Q24_SUPERSESSION_SOURCE_BINDING_INVALID');
  const currentHash = value => sha(Buffer.from(String(value ?? '')));
  if (priorBinding.qidContentSha256 !== currentHash(q.content) || priorBinding.qidChoicesSha256 !== sha(Buffer.from(JSON.stringify(q.choices ?? [])))
    || priorBinding.qidAnswerSha256 !== currentHash(q.answer) || priorBinding.qidSolutionSha256 !== currentHash(q.solution)
    || decision.sourceBinding?.qidContentSha256 !== priorBinding.qidContentSha256
    || decision.sourceBinding?.qidChoicesSha256 !== priorBinding.qidChoicesSha256
    || decision.sourceBinding?.qidAnswerSha256 !== priorBinding.qidAnswerSha256
    || decision.sourceBinding?.qidSolutionSha256 !== priorBinding.qidSolutionSha256
    || previous.assetBinding?.ref !== q.image || decision.assetBinding?.ref !== q.image
    || previous.assetBinding?.sha256 !== sha(assetBytes) || decision.assetBinding?.sha256 !== sha(assetBytes)
    || previous.sourceBinding?.currentStudentPayloadSha256 !== previous.sourceBinding?.baselineStudentPayloadSha256
    || decision.sourceBinding?.currentStudentPayloadSha256 !== decision.sourceBinding?.baselineStudentPayloadSha256
    || decision.studentSourceMutated !== false || decision.solutionMutated !== false) fail('Q24_SUPERSESSION_STUDENT_OR_ASSET_MISMATCH');
  if (row.sourceExact?.status !== 'PASS' || row.solutionMath?.status !== 'PASS') fail('Q24_PRIOR_PHYSICAL_CLEARANCE_NOT_BOUND_TO_V1');
  if (JSON.stringify(previousEntry.originalHold) !== JSON.stringify({ path: decision.falseHoldAdjudication?.priorHoldPath, sha256: decision.falseHoldAdjudication?.priorHoldSha256 })
    || JSON.stringify(previousEntry.originalFreeze) !== JSON.stringify({ path: decision.falseHoldAdjudication?.originalFreezePath, sha256: decision.falseHoldAdjudication?.originalFreezeSha256 })) fail('Q24_ORIGINAL_HOLD_FREEZE_HISTORY_CHANGED');
  if (previousEntry.priorStatuses?.sourceExact?.status !== 'HOLD' || previousEntry.priorStatuses?.solutionMath?.status !== 'HOLD') fail('Q24_ORIGINAL_HOLD_STATUS_NOT_PRESERVED');

  const held = new Set();
  for (const qRow of evidenceObject.questionRows || []) if (Object.values(qRow).some(value => value && typeof value === 'object' && value.status === 'HOLD')) held.add(Number(qRow.qid));
  for (const mRow of evidenceObject.metaRows || []) if (mRow.result === 'HOLD') held.add(Number(mRow.qid));
  if (held.size !== 0 || Number(evidenceObject.summary?.itemHoldCount) !== 0) fail('Q24_SUPERSESSION_REQUIRES_ZERO_ITEM_HOLD');

  const next = JSON.parse(evidenceRaw);
  const visualRow = buildQ24VisualEvidenceRow({ root, currentSha, q, decision });
  const v1PhysicalEntryHistory = previousEntry.supersededAdjudication?.v1PhysicalEntryHistory || (() => {
    const history = { ...previousEntry, adjudicationPath: supersedes.path, adjudicationSha256: previousSha, currentSourceSha256: baselineSha };
    delete history.supersededAdjudication;
    return history;
  })();
  const entry = { ...previousEntry, supersededAdjudication: { path: supersedes.path, sha256: previousSha, v1PhysicalEntryHistory }, durableReceiptCopy: null, adjudicationPath: adjudicationRel,
    adjudicationSha256: sha(adjudicationBytes), currentSourceSha256: currentSha, currentAssetSha256: sha(assetBytes) };
  const alreadyApplied = previousEntry.adjudicationPath === adjudicationRel && previousEntry.adjudicationSha256 === entry.adjudicationSha256
    && row.sourceExactAdjudicationRef?.path === adjudicationRel && row.sourceExactAdjudicationRef?.sha256 === entry.adjudicationSha256
    && row.solutionMathAdjudicationRef?.path === adjudicationRel && row.solutionMathAdjudicationRef?.sha256 === entry.adjudicationSha256
    && evidenceObject.examSha256 === `sha256:${currentSha}` && evidenceObject.finalArtifactGitBlob === deltaBinding.currentSourceGitBlobSha1
    && JSON.stringify((evidenceObject.visualRows || []).find(item => Number(item.qid) === 24) || null) === JSON.stringify(visualRow)
    && Number(evidenceObject.summary?.linkedSolutionVisualCount) === 1 && Number(evidenceObject.summary?.visualEvidenceRows) === 1
    && previousEntry.durableReceiptCopy == null && Boolean(previousEntry.supersededAdjudication?.v1PhysicalEntryHistory);
  const pointsToV1 = row.sourceExactAdjudicationRef?.path === supersedes.path && row.sourceExactAdjudicationRef?.sha256 === previousSha
    && row.solutionMathAdjudicationRef?.path === supersedes.path && row.solutionMathAdjudicationRef?.sha256 === previousSha;
  const pointsToV2 = row.sourceExactAdjudicationRef?.path === adjudicationRel && row.sourceExactAdjudicationRef?.sha256 === entry.adjudicationSha256
    && row.solutionMathAdjudicationRef?.path === adjudicationRel && row.solutionMathAdjudicationRef?.sha256 === entry.adjudicationSha256;
  const pointsToRevisedV2 = previousEntry.adjudicationPath === adjudicationRel
    && previousEntry.adjudicationSha256 !== entry.adjudicationSha256
    && previousEntry.currentSourceSha256 === currentSha
    && row.sourceExactAdjudicationRef?.path === adjudicationRel
    && row.sourceExactAdjudicationRef?.sha256 === previousEntry.adjudicationSha256
    && row.solutionMathAdjudicationRef?.path === adjudicationRel
    && row.solutionMathAdjudicationRef?.sha256 === previousEntry.adjudicationSha256
    && Boolean(previousEntry.supersededAdjudication?.v1PhysicalEntryHistory);
  if (!alreadyApplied && !pointsToV1 && !pointsToV2 && !pointsToRevisedV2) fail('Q24_PRIOR_PHYSICAL_CLEARANCE_NOT_BOUND_TO_V1');
  next.falseHoldAdjudications = (next.falseHoldAdjudications || []).map(item => Number(item.qid) === 24 ? entry : item);
  const nextRow = next.questionRows.find(item => Number(item.qid) === 24);
  nextRow.sourceExactAdjudicationRef = { path: adjudicationRel, sha256: entry.adjudicationSha256, qid: 24 };
  nextRow.solutionMathAdjudicationRef = { path: adjudicationRel, sha256: entry.adjudicationSha256, qid: 24 };
  const nextVisualRows = [...(next.visualRows || [])];
  const visualIndex = nextVisualRows.findIndex(item => Number(item.qid) === 24);
  if (visualIndex >= 0) nextVisualRows[visualIndex] = visualRow;
  else nextVisualRows.push(visualRow);
  next.visualRows = nextVisualRows;
  next.summary = { ...(next.summary || {}), linkedSolutionVisualCount: 1, visualEvidenceRows: 1 };
  next.examSha256 = `sha256:${currentSha}`;
  next.finalArtifactGitBlob = deltaBinding.currentSourceGitBlobSha1;
  return { next: alreadyApplied ? evidenceObject : next, entry, itemHoldCount: 0, superseded: true, alreadyApplied };
}

function buildQ24VisualEvidenceRow({ root, currentSha, q, decision }) {
  const visual = decision.visualAxes?.solutionVisual || {};
  const ref = visual.ref;
  if (!ref || ref !== q.solutionImage || visual.need !== 'BENEFICIAL' || visual.r1Verdict !== 'PASS'
    || visual.r3Verdict !== 'PASS_QID_24_SOLUTION_DESKTOP' || visual.fontAndLabelReadability !== 'PASS'
    || visual.clipping !== 'NONE' || visual.mathJaxErrors !== 0) fail('Q24_SOLUTION_VISUAL_ADJUDICATION_INVALID');
  const svgBytes = fs.readFileSync(repoFile(root, `archive/${ref}`));
  const svgSha = sha(svgBytes);
  if (svgSha !== visual.sha256) fail('Q24_SOLUTION_SVG_SHA_MISMATCH');

  const geometryFileRef = visual.geometryEvidencePath;
  const geometryFile = repoFile(root, geometryFileRef || '');
  const geometryBytes = fs.readFileSync(geometryFile);
  if (sha(geometryBytes) !== visual.geometryEvidenceSha256) fail('Q24_VISUAL_PHYSICAL_EVIDENCE_SHA_MISMATCH');
  const geometryEvidence = JSON.parse(geometryBytes.toString('utf8'));
  const geometryItem = (geometryEvidence.items || []).find(item => Number(item.qid) === 24);
  if (geometryEvidence.schemaVersion !== 'APMATH_VISUAL_PHYSICAL_EVIDENCE_v1' || geometryEvidence.denominator !== 1 || !geometryItem
    || geometryItem.finalSvgSha256 !== `sha256:${svgSha}` || geometryItem.finalSvgGitBlobSha !== gitBlobSha(svgBytes)
    || !Array.isArray(geometryItem.expectedFacts) || geometryItem.expectedFacts.length < 5
    || !Array.isArray(geometryItem.observedFacts) || geometryItem.observedFacts.length < 5
    || geometryItem.observedFacts.some(item => item.result !== 'PASS' || !item.observation)
    || !Array.isArray(geometryItem.actualSvgPrimitives) || geometryItem.actualSvgPrimitives.length < 5) fail('Q24_VISUAL_PHYSICAL_EVIDENCE_INVALID');
  if (geometryItem.expectedFacts.some(fact => !fact.id || !fact.statement)) fail('Q24_VISUAL_EXPECTED_FACTS_INCOMPLETE');

  const r3Binding = decision.reviewBindings?.r3 || {};
  const r3File = repoFile(root, r3Binding.path || '');
  const r3Bytes = fs.readFileSync(r3File);
  if (sha(r3Bytes) !== r3Binding.sha256) fail('Q24_R3_RENDER_REVIEW_SHA_MISMATCH');
  const r3 = JSON.parse(r3Bytes.toString('utf8'));
  const solCase = (r3.cases || []).find(item => item.id === 'sol/desktop');
  const solutionAsset = (r3.assetBindings || []).find(item => item.ref === ref && item.loadedInMode === 'sol');
  const renderedPixels = solCase?.solutionImageCssPixels;
  if (r3.schemaVersion !== 'JS_ARCHIVE_R3_QID_TARGETED_ACTUAL_RENDER_REVIEW_V2' || r3.executionLine !== 'CODEX'
    || r3.examUid !== decision.examUid || Number(r3.qid) !== 24 || r3.wholeExamR3Status !== 'NOT_CLAIMED'
    || r3.formalRenderPassClaimed !== false || r3.artifact?.sha256 !== currentSha
    || solCase?.status !== 'PASS' || solCase.candidateSha256 !== currentSha
    || JSON.stringify(renderedPixels) !== '[514.28125,640]' || solCase.mathErrors !== 0
    || solCase.solutionSvgDecode !== 'PASS' || solCase.layoutReview !== 'PASS'
    || !String(solCase.findingResolution || '').includes('without clipping')
    || solCase.capture?.sha256 !== visual.r3ScreenshotSha256
    || !solutionAsset || solutionAsset.sha256 !== svgSha || JSON.stringify(solutionAsset.renderedCssPixels) !== '[514.28125,640]') fail('Q24_R3_RENDER_REVIEW_INVALID');

  const expectedFacts = geometryItem.expectedFacts.map(({ id, statement }) => ({ id, statement }));
  const observedFacts = geometryItem.observedFacts.map(({ id, observation, result }) => ({ id, observation, result }));
  const topologyExpected = expectedFacts.map(fact => fact.statement).join(' | ');
  const topologyObserved = observedFacts.map(fact => `${fact.id}: ${fact.observation}`).join(' | ');
  const renderExpected = 'solution SVG rendered at 514.28125×640 CSS px; no clipping; MathJax errors=0';
  const renderObserved = `solutionImageCssPixels=${renderedPixels.join('×')}; clipping=NONE; MathJax errors=${solCase.mathErrors}; screenshotSha256=${solCase.capture.sha256}`;
  return {
    qid: 24,
    result: 'PASS',
    assetPath: ref,
    assetSha256: `sha256:${svgSha}`,
    expectedFacts,
    observedFacts,
    checks: [
      { method: 'TOPOLOGY_COMPUTE', result: 'PASS', predicate: 'Hash-bound SVG primitives realize all expected geometric and area relations.', expected: topologyExpected, observed: topologyObserved },
      { method: 'TARGETED_RENDER', result: 'PASS', predicate: 'The q24 solution SVG is legible at the actual fullwidth desktop render with no clipping or MathJax errors.', expected: renderExpected, observed: renderObserved },
    ],
  };
}

export function applyFalseHoldAdjudication({ root = ROOT, exam, evidence, adjudication, mode = 'dry-run' }) {
  const evidenceFile = repoFile(root, evidence);
  const result = prepareFalseHoldAdjudication({ root, exam, evidence, adjudication });
  if (mode === 'write') {
    if (result.alreadyApplied) fail('Q24_FALSE_HOLD_ALREADY_ADJUDICATED');
    fs.writeFileSync(evidenceFile, JSON.stringify(result.next, null, 2) + '\n');
  }
  else if (mode === 'check') {
    const current = result.next;
    const row = current.questionRows?.find(item => Number(item.qid) === 24);
    const ref = current.falseHoldAdjudications?.find(item => Number(item.qid) === 24);
    const currentEvidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));
    const currentQ24 = currentEvidence.questionRows?.find(item => Number(item.qid) === 24);
    const currentRef = currentEvidence.falseHoldAdjudications?.find(item => Number(item.qid) === 24);
    const closed = result.superseded
      ? currentEvidence.examSha256 === `sha256:${result.entry.currentSourceSha256}` && currentEvidence.finalArtifactGitBlob === result.next.finalArtifactGitBlob
        && currentQ24?.sourceExactAdjudicationRef?.sha256 === result.entry.adjudicationSha256 && currentQ24?.solutionMathAdjudicationRef?.sha256 === result.entry.adjudicationSha256
        && currentRef?.adjudicationSha256 === result.entry.adjudicationSha256
      : result.alreadyApplied;
    if (!closed || row?.sourceExact?.status !== 'PASS' || row?.solutionMath?.status !== 'PASS' || !ref || ref.adjudicationSha256 !== result.entry.adjudicationSha256 || Number(current.summary?.itemHoldCount) !== result.itemHoldCount) fail('CHECK_FALSE_HOLD_CLOSEOUT_MISMATCH');
    return { disposition: 'CHECK_PASS_QID_SCOPED_FALSE_HOLD_ADJUDICATION', itemHoldCount: result.itemHoldCount, entry: ref };
  }
  return { disposition: mode === 'write' ? (result.superseded ? 'WRITE_QID_SCOPED_FALSE_HOLD_SUPERSESSION' : 'WRITE_QID_SCOPED_FALSE_HOLD_ADJUDICATION') : 'DRY_RUN_QID_SCOPED_FALSE_HOLD_ADJUDICATION', itemHoldCount: result.itemHoldCount, entry: result.entry };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const argv = process.argv.slice(2), args = { mode: 'dry-run' };
    for (let i = 0; i < argv.length; i++) {
      if (['--exam', '--evidence', '--adjudication'].includes(argv[i])) args[argv[i].slice(2)] = argv[++i];
      else if (['--dry-run', '--write', '--check'].includes(argv[i])) args.mode = argv[i].slice(2);
      else fail('UNKNOWN_ARGUMENT', argv[i]);
    }
    if (!args.exam || !args.evidence || !args.adjudication) fail('EXAM_EVIDENCE_ADJUDICATION_REQUIRED');
    console.log(JSON.stringify(applyFalseHoldAdjudication(args), null, 2));
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
    process.exitCode = 2;
  }
}
