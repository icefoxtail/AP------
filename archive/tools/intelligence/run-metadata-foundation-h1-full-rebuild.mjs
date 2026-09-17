import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import {
  contentFingerprint,
  buildMachineValidationArtifact,
  deriveDecisiveSolutionEvidence,
  loadMetadataFoundationAuditManifest,
  loadCanonicalRpmMaster,
  machineValidationDigest,
  objectDigest,
  sourceFingerprint,
  validateDecisiveSolutionEvidence,
  validateCanonicalSelection,
  validateHoldEvidence,
  validateSourceGroundedReason,
  verifyMachineValidationDigest
} from './metadata-foundation-gates.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/metadata-foundation-h1-full-rebuild');
const identityPath = path.join(archiveDir, 'data/question_identity_map.json');
const canonical = loadCanonicalRpmMaster(repoRoot);
const identityOverlayPath = path.join(outputDir, 'identity_repair_overlay.json');
const auditManifest = loadMetadataFoundationAuditManifest(repoRoot);

function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
function sha256(value) { return crypto.createHash('sha256').update(String(value)).digest('hex'); }
function writeJsonIfChanged(filePath, value) {
  const serialized = `${JSON.stringify(value, null, 2)}\n`;
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === serialized) return false;
  fs.writeFileSync(filePath, serialized, 'utf8');
  return true;
}

function loadQuestions(sourceFile) {
  const fullPath = path.join(archiveDir, 'exams', sourceFile);
  if (!fs.existsSync(fullPath)) throw new Error(`SOURCE_PATH_NOT_FOUND:${sourceFile}`);
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(fullPath, 'utf8'), context, { filename: fullPath, timeout: 3000 });
  const questions = context.window.questionBank || context.window.questions;
  if (!Array.isArray(questions)) throw new Error(`QUESTION_BANK_MISSING:${sourceFile}`);
  return questions;
}

function assetCheck(reference) {
  if (!reference) return { status: 'NONE', exists: true, nonEmpty: true };
  if (String(reference).startsWith('data:')) return { status: 'DATA_URI', exists: /^data:image\/(?:png|jpe?g|svg\+xml|webp);/i.test(reference), nonEmpty: true };
  const fullPath = String(reference).startsWith('archive/') ? path.join(repoRoot, reference) : path.join(archiveDir, reference);
  return { status: 'FILE', path: reference, exists: fs.existsSync(fullPath), nonEmpty: fs.existsSync(fullPath) && fs.statSync(fullPath).size > 0 };
}

function canonicalRows(curriculumKey) {
  const rows = [];
  for (const record of canonical.master.records || []) {
    if (String(record.curriculum) !== String(curriculumKey) || String(record.level) !== 'high') continue;
    for (const concept of record.concepts || []) for (const problemType of concept.problemTypes || []) rows.push({
      curriculumKey: String(record.curriculum), level: String(record.level), scope: String(record.scope),
      L1: String(record.majorUnit || ''), L2: String(record.midUnit || ''), L3: String(concept.concept || ''), L4: String(problemType.problemType || ''),
      curriculumApplicability: problemType.curriculumApplicability || concept.curriculumApplicability || record.curriculumApplicability || 'DEFAULT_SCOPE',
      defaultSelectable: problemType.defaultSelectable ?? concept.defaultSelectable ?? record.defaultSelectable
    });
  }
  return rows;
}

function blindCanonicalCandidates(source, curriculumKey) {
  const text = [source.content, source.solution].filter(Boolean).join(' ').toLowerCase();
  return canonicalRows(curriculumKey).map(row => {
    const matched = [row.L1, row.L2, row.L3, row.L4].filter(token => token && text.includes(token.toLowerCase()));
    const score = (row.L4 && text.includes(row.L4.toLowerCase()) ? 8 : 0) + (row.L3 && text.includes(row.L3.toLowerCase()) ? 5 : 0) + (row.L2 && text.includes(row.L2.toLowerCase()) ? 3 : 0) + (row.L1 && text.includes(row.L1.toLowerCase()) ? 1 : 0);
    return { ...row, score, matchedCues: matched };
  }).sort((a, b) => b.score - a.score || `${a.scope}|${a.L1}|${a.L2}|${a.L3}|${a.L4}`.localeCompare(`${b.scope}|${b.L1}|${b.L2}|${b.L3}|${b.L4}`));
}

function derivedUid(sourceArchiveFile, sourceOrdinal) { return `qid_v1_${sha256(`${sourceArchiveFile}#${sourceOrdinal}`)}`; }

function loadRawEntries(identity, overlay = { additions: [], fingerprintUpdates: [] }) {
  const baseIdentityByKey = new Map(identity.records.map(record => [`${record.sourceArchiveFile}#${record.sourceOrdinal}`, record]));
  const identityByKey = new Map([...baseIdentityByKey, ...(overlay.additions || []).map(record => [`${record.sourceArchiveFile}#${record.sourceOrdinal}`, record])]);
  const fingerprintUpdates = new Map((overlay.fingerprintUpdates || []).map(record => [record.key, record]));
  const entries = [];
  const cohortCounts = {};
  for (const cohortSpec of auditManifest.manifest.targetCohorts) {
    const cohort = cohortSpec.id;
    const curriculumKey = String(cohortSpec.curriculumKey);
    const artifact = readJson(path.resolve(repoRoot, cohortSpec.artifactPath));
    const oldRecords = artifact.records ? artifact.records : [artifact];
    cohortCounts[cohort] = oldRecords.length;
    for (const old of oldRecords) {
      const sourceArchiveFile = old.sourceArchiveFile;
      const sourceOrdinal = Number(old.sourceOrdinal);
      const key = `${sourceArchiveFile}#${sourceOrdinal}`;
      const baseIdentityRecord = baseIdentityByKey.get(key) || null;
      const identityRecord = identityByKey.get(key) || null;
      const repair = fingerprintUpdates.get(key);
      const questions = loadQuestions(sourceArchiveFile);
      const question = questions[sourceOrdinal - 1];
      if (!question) throw new Error(`SOURCE_ORDINAL_NOT_FOUND:${key}`);
      const currentSourceFingerprint = sourceFingerprint(question);
      const currentContentFingerprint = contentFingerprint(question);
      entries.push({
        key, cohort, curriculumKey, sourceArchiveFile, sourceOrdinal,
        questionUid: identityRecord?.questionUid || derivedUid(sourceArchiveFile, sourceOrdinal),
        identitySourceFingerprint: repair?.sourceFingerprint || identityRecord?.sourceFingerprint || null,
        identityStatus: identityRecord ? ((repair?.sourceFingerprint || identityRecord.sourceFingerprint) === currentSourceFingerprint ? 'MATCH' : 'MISMATCH') : 'IDENTITY_RECORD_MISSING',
        identityResolution: baseIdentityRecord ? (repair ? 'FINGERPRINT_UPDATE_PROVEN' : 'IDENTITY_MAP') : (identityRecord ? 'SCOPED_IDENTITY_REPAIRED_SOURCE_PRESENT' : 'IDENTITY_RECORD_MISSING'),
        currentSourceFingerprint, currentContentFingerprint,
        source: {
          content: question.content ?? '', choices: Array.isArray(question.choices) ? question.choices : [], answer: question.answer ?? null,
          solution: question.solution ?? '', image: question.image ?? null, imageSize: question.imageSize ?? null,
          solutionImage: question.solutionImage ?? null, solutionImageSize: question.solutionImageSize ?? null
        },
        legacySourceMetadata: { level: question.level ?? null, category: question.category ?? null, originalCategory: question.originalCategory ?? null, standardCourse: question.standardCourse ?? null, standardUnitKey: question.standardUnitKey ?? null, standardUnit: question.standardUnit ?? null, subUnitKey: question.subUnitKey ?? null, subUnit: question.subUnit ?? null },
        oldQueueMetadata: { L1: old.L1 || null, L2: old.L2 || null, L3: old.L3 || null, L4: old.L4 || null, legacyLevel: old.legacyLevel || null }
      });
    }
  }
  if (!entries.length) throw new Error('RAW_DENOMINATOR_EMPTY');
  const uniqueKeys = new Set(entries.map(entry => entry.key));
  const originalMissingIdentityKeys = entries.filter(entry => !baseIdentityByKey.has(entry.key)).map(entry => entry.key).sort();
  const missingIdentityKeys = entries.filter(entry => entry.identityStatus === 'IDENTITY_RECORD_MISSING').map(entry => entry.key).sort();
  const duplicateKeys = entries.map(entry => entry.key).filter((key, index, values) => values.indexOf(key) !== index).filter((key, index, values) => values.indexOf(key) === index);
  return { entries, cohortCounts, uniqueCount: uniqueKeys.size, originalMissingIdentityKeys, missingIdentityKeys, duplicateKeys, rawCount: entries.length };
}

function sourcePackRecord(entry) {
  return {
    questionUid: entry.questionUid, sourceArchiveFile: entry.sourceArchiveFile, sourceOrdinal: entry.sourceOrdinal,
    curriculumKey: entry.curriculumKey, sourceFingerprint: entry.currentSourceFingerprint, contentFingerprint: entry.currentContentFingerprint,
    identitySourceFingerprint: entry.identitySourceFingerprint, identityStatus: entry.identityStatus, identityResolution: entry.identityResolution,
    content: entry.source.content, choices: entry.source.choices, answer: entry.source.answer, solution: entry.source.solution,
    imageReference: entry.source.image ? { path: entry.source.image, imageSize: entry.source.imageSize } : null,
    solutionImageReference: entry.source.solutionImage ? { path: entry.source.solutionImage, imageSize: entry.source.solutionImageSize } : null
  };
}

function compactEvidence(value, limit = 180) {
  return String(value || '').replace(/\s+/gu, ' ').trim().slice(0, limit);
}

function sourceIdentityKey(source) {
  return `${source.sourceArchiveFile}#${Number(source.sourceOrdinal)}`;
}

function pathText(candidate) {
  return candidate?.path?.length ? candidate.path.join(' > ') : '선택 경로 없음';
}

function reasonNextAction(classificationStatus, routingEvidence, holdEvidence) {
  if (classificationStatus === 'CONFLICT') return '현재 원문과 historical fingerprint를 독립 대조하여 identity reconciliation을 완료한다';
  if (classificationStatus === 'AMBIGUOUS_PRIMARY') return routingEvidence.nextAction;
  if (classificationStatus === 'FOUNDATION_DEFECT_CANDIDATE') return routingEvidence.nextAction;
  if (classificationStatus === 'EVIDENCE_INSUFFICIENT') return '원문 선택지·도형 증거를 추가 대조한 뒤 locked canonical adjudication을 수행한다';
  return holdEvidence.missingEvidence.includes('independent_recheck_packet')
    ? '현재 source-only 입력을 고정한 independent semantic/difficulty recheck를 수행한다'
    : 'identity reconciliation 증거를 독립 검토한다';
}

function buildTaxonomyReason(source, decisiveEvidence, routingEvidence, canonicalCandidate, classificationStatus, holdEvidence) {
  const key = sourceIdentityKey(source);
  const anchor = compactEvidence(source.content || decisiveEvidence.decisiveSolutionStep, 150);
  const proof = compactEvidence(`${decisiveEvidence.mathematicalAction}: ${decisiveEvidence.resultingConditionOrConclusion}`, 180);
  const nextAction = reasonNextAction(classificationStatus, routingEvidence, holdEvidence);
  if (classificationStatus === 'CONFLICT') {
    return `${key} 원문 '${anchor}'의 source-grounded 핵심은 ${proof}이지만 live source fingerprint와 historical identity가 충돌한다. identity가 해소되지 않았으므로 taxonomy primary path를 보류하며, 다음 조치는 ${nextAction}이다.`;
  }
  if (classificationStatus === 'AMBIGUOUS_PRIMARY') {
    const tied = routingEvidence.candidates.filter(candidate => candidate.score === routingEvidence.candidates[0]?.score).slice(0, 3).map(candidate => [candidate.L1, candidate.L2, candidate.L3, candidate.L4].join(' > ')).join(' / ');
    return `${key} 원문 '${anchor}'에서 ${proof}이 확인되지만 locked RPM source-cue 검색의 동점 후보가 ${tied || '복수 경로'}로 남아 어느 L4가 결정적인지 판정할 수 없다. tie를 임의 선택하지 않고, 다음 조치는 ${nextAction}이다.`;
  }
  if (classificationStatus === 'FOUNDATION_DEFECT_CANDIDATE') {
    return `${key} 원문 '${anchor}'는 ${proof}을 실제로 요구하고 반복 핵심 단서 ${routingEvidence.sourceConcept.repeatedCoreTypes.join(', ')}를 보인다. locked RPM 검색에는 eligible L4가 없어 foundation defect candidate로만 보류하며, 다음 조치는 ${nextAction}이다.`;
  }
  if (classificationStatus === 'EVIDENCE_INSUFFICIENT') {
    return `${key} 원문 '${anchor}'에서 ${proof}까지는 읽히지만 source-only evidence로 unique eligible L4를 확정할 수 없다. lexical no-fit만으로 path를 만들지 않으며, 다음 조치는 ${nextAction}이다.`;
  }
  return `${key} 원문 '${anchor}'의 ${proof}이 locked RPM 경로 '${pathText(canonicalCandidate ? { path: [canonicalCandidate.L1, canonicalCandidate.L2, canonicalCandidate.L3, canonicalCandidate.L4] } : null)}'와 직접 맞물린다. taxonomy는 이 source evidence를 primary 근거로 유지하지만 independent recheck 전까지 HOLD이며, 다음 조치는 ${nextAction}이다.`;
}

function buildDifficultyReason(source, decisiveEvidence, difficultyEvidence, classificationStatus, holdEvidence) {
  const key = sourceIdentityKey(source);
  const anchor = compactEvidence(source.content || decisiveEvidence.decisiveSolutionStep, 150);
  const evidence = compactEvidence(decisiveEvidence.decisiveSolutionStep || source.solution, 180);
  const signals = [
    `조건 해석=${difficultyEvidence.conditionInterpretation}`,
    difficultyEvidence.strategyChoice ? '전략 선택 있음' : '전략 선택 단서 없음',
    difficultyEvidence.nonRoutineTransformation ? '비정형 변형 있음' : '비정형 변형 단서 없음',
    difficultyEvidence.caseBranching ? '경우 분기 있음' : '경우 분기 없음',
    difficultyEvidence.rangeConstraint ? '범위 조건 있음' : '범위 조건 없음',
    difficultyEvidence.integerConstraint ? '정수 조건 있음' : '정수 조건 없음',
    difficultyEvidence.existenceCheck ? '존재성 점검 있음' : '존재성 점검 없음',
    difficultyEvidence.decisiveInsight ? '핵심 통찰 단서 있음' : '핵심 통찰 단서 없음'
  ].join(', ');
  const gap = holdEvidence.missingEvidence.join(', ');
  const nextAction = reasonNextAction(classificationStatus, { nextAction: 'independent semantic/difficulty recheck를 수행한다' }, holdEvidence);
  return `${key} 원문 '${anchor}'와 해설 근거 '${evidence}'를 기준으로 ${signals}을 확인했다. source-only 단계에서는 이 실제 전략·조건 증거를 기록할 뿐 difficultyBucket을 추정하지 않고 UNKNOWN/HOLD로 둔다. 현재 정확한 evidence gap은 ${gap}이며, 다음 조치는 ${nextAction}이다.`;
}

export function isSubstantiveDecisiveStep(value) {
  return deriveDecisiveSolutionEvidence({ solution: value }, { questionUid: 'validation-only', sourceArchiveFile: 'validation-only.js', sourceOrdinal: 1 }).validation.ok;
}

const SOURCE_CORE_TYPE_CUES = [
  ['distance', /두 점 사이의 거리|거리 공식|거리/u], ['circle', /원의 방정식|원\s*의\s*방정식|중심과 반지름|접선|현/u],
  ['centroid', /무게중심|중선|삼각형의 중심/u], ['internal_external_division', /내분|외분|내분점|외분점/u],
  ['set_operation', /합집합|교집합|여집합|부분집합|집합의 연산/u], ['proposition', /역|이|대우|명제|조건명제/u],
  ['polynomial', /인수분해|다항식|이차식|계수 비교/u], ['line_equation', /직선의 방정식|직선 방정식|기울기/u]
];

function countMatches(text, pattern) { return [...String(text).matchAll(new RegExp(pattern.source, `${pattern.flags.replace('g', '')}g`))].length; }

function sourceConceptEvidence(source, decisiveStep) {
  const text = `${source.content || ''} ${source.solution || ''}`;
  const signals = SOURCE_CORE_TYPE_CUES.map(([key, pattern]) => ({ key, count: countMatches(text, pattern) })).filter(signal => signal.count > 0);
  const repeatedCoreTypes = signals.filter(signal => signal.count >= 2).map(signal => signal.key);
  return { signals, repeatedCoreTypes, decisiveStep: decisiveStep || null, sourceEvidenceHash: sha256(JSON.stringify({ content: source.content, solution: source.solution, decisiveStep })) };
}

function foundationRoutingEvidence(source, decisiveEvidence, candidatePool, candidates, tiedTop, canonicalCandidate) {
  const sourceConcept = sourceConceptEvidence(source, decisiveEvidence.decisiveSolutionStep);
  const canonicalSearch = {
    authorityVersion: canonical.master.authorityVersion, masterPath: canonical.path, masterSha256: canonical.sha256,
    curriculumKey: source.curriculumKey, searchedPathCount: canonicalRows(source.curriculumKey).length, scoreThreshold: 8,
    searchMode: 'LOCKED_RPM_MASTER_SOURCE_CUES', candidateCount: candidates.length,
    candidates: candidatePool.slice(0, 10).map(candidate => ({ curriculumKey: candidate.curriculumKey, level: candidate.level, scope: candidate.scope, L1: candidate.L1, L2: candidate.L2, L3: candidate.L3, L4: candidate.L4, score: candidate.score, curriculumApplicability: candidate.curriculumApplicability, defaultSelectable: candidate.defaultSelectable })),
    tiedTopCandidates: tiedTop.map(candidate => ({ curriculumKey: candidate.curriculumKey, level: candidate.level, scope: candidate.scope, L1: candidate.L1, L2: candidate.L2, L3: candidate.L3, L4: candidate.L4, score: candidate.score, curriculumApplicability: candidate.curriculumApplicability, defaultSelectable: candidate.defaultSelectable })),
    tieState: tiedTop.length ? 'TIED_TOP' : canonicalCandidate ? 'UNIQUE_TOP' : 'NO_ELIGIBLE_CANDIDATE'
  };
  const concreteFoundationEvidence = !canonicalCandidate && candidates.length === 0 && !tiedTop.length && sourceConcept.repeatedCoreTypes.length > 0 && decisiveEvidence.validation.ok === true && canonicalSearch.searchedPathCount > 0;
  const whyNoFit = tiedTop.length
    ? 'top canonical source-cue candidates are tied; ambiguity is not evidence of a taxonomy defect'
    : concreteFoundationEvidence
      ? `source repeats core type cue(s) ${sourceConcept.repeatedCoreTypes.join(', ')}; exact locked RPM search returned no eligible L4 fit`
      : 'lexical no-fit or low score alone does not establish a canonical foundation defect';
  const nextAction = tiedTop.length ? 'independent canonical adjudication with course/level/scope context' : concreteFoundationEvidence ? 'canonical master defect review with source evidence' : 'source-only semantic review and canonical adjudication';
  return { sourceConcept, decisiveStep: decisiveEvidence.decisiveSolutionStep || null, decisiveEvidenceValidation: decisiveEvidence.validation, canonicalSearch, candidates: canonicalSearch.candidates, tieState: canonicalSearch.tieState, whyNoFit, nextAction, concreteFoundationEvidence };
}

function blindRecord(entry) {
  const source = sourcePackRecord(entry);
  const candidatePool = blindCanonicalCandidates(source, entry.curriculumKey);
  const candidates = candidatePool.filter(candidate => candidate.score >= 8);
  const top = candidates[0] || null;
  const tiedTop = top ? candidates.filter(candidate => candidate.score === top.score && `${candidate.scope}|${candidate.L1}|${candidate.L2}|${candidate.L3}|${candidate.L4}` !== `${top.scope}|${top.L1}|${top.L2}|${top.L3}|${top.L4}`) : [];
  const canonicalCandidate = top && tiedTop.length === 0 ? top : null;
  const canonicalSelection = canonicalCandidate ? validateCanonicalSelection(canonicalCandidate, canonical) : { ok: false, errors: [top ? 'CANONICAL_CONTEXT_AMBIGUOUS_OR_INSUFFICIENT' : 'CANONICAL_L4_NOT_FOUND'], match: null };
  const decisiveEvidence = deriveDecisiveSolutionEvidence({
    content: source.content, choices: source.choices, answer: source.answer, solution: source.solution,
    image: source.imageReference?.path || null
  }, { questionUid: source.questionUid, sourceArchiveFile: source.sourceArchiveFile, sourceOrdinal: source.sourceOrdinal });
  const routingEvidence = foundationRoutingEvidence(source, decisiveEvidence, candidatePool, candidates, tiedTop, canonicalCandidate);
  const text = `${source.content} ${source.solution}`;
  const difficultyEvidence = {
    questionUid: source.questionUid, sourceArchiveFile: source.sourceArchiveFile, sourceOrdinal: source.sourceOrdinal, sourceFingerprint: source.sourceFingerprint,
    inputVisibilityProfile: 'SOURCE_ONLY_BLIND', priorReviewVisibility: 'NONE', conceptCount: canonicalCandidate ? 1 : 0,
    conditionInterpretation: /단,|조건|만족|일 때|이면|때문에/.test(text) ? 'medium' : 'low',
    strategyChoice: /이용|먼저|두자|나누|비교|정리/.test(text), nonRoutineTransformation: /치환|완전제곱|변형|대우|드모르간/.test(text),
    caseBranching: /\(i\)|\(ii\)|경우|각각/.test(text), rangeConstraint: /범위|이하|이상|보다 작|보다 크/.test(text), integerConstraint: /정수|자연수/.test(text),
    existenceCheck: /존재|가능|교점|실근/.test(text), decisiveInsight: /핵심|발상|아이디어|결정적/.test(text), executionBurden: /\n.{0,80}\n.{0,80}\n/.test(source.solution) ? 'medium' : 'low',
    reason: 'source-only blind feature extraction; no legacy level/current difficulty/queue metadata used'
  };
  const holdEvidence = {
    reason: entry.identityStatus === 'MISMATCH' ? 'source identity fingerprint reconciliation unresolved' : tiedTop.length ? 'canonical candidates tied at the top; adjudication evidence is missing' : routingEvidence.concreteFoundationEvidence ? 'source-grounded canonical foundation-defect evidence requires independent review' : !canonicalCandidate ? 'source-only lexical/no-fit evidence is insufficient for promotion' : 'independent recheck packet not supplied in Gate 4 A',
    missingEvidence: entry.identityStatus === 'MISMATCH' ? ['identity_fingerprint_reconciliation'] : tiedTop.length ? ['canonical_adjudication_evidence'] : routingEvidence.concreteFoundationEvidence ? ['independent_recheck_semantic_packet', 'canonical_foundation_defect_review'] : !decisiveEvidence.validation.ok ? ['decisive_source_evidence'] : ['independent_recheck_semantic_packet', 'independent_recheck_difficulty_packet'],
    questionUid: source.questionUid, sourceArchiveFile: source.sourceArchiveFile, sourceOrdinal: source.sourceOrdinal,
    sourceFingerprint: source.sourceFingerprint, contentFingerprint: source.contentFingerprint
  };
  const holdValidation = validateHoldEvidence({ reviewStatus: 'HOLD', holdEvidence }, { questionUid: source.questionUid, sourceArchiveFile: source.sourceArchiveFile, sourceOrdinal: source.sourceOrdinal }, entry.source);
  const classificationStatus = entry.identityStatus === 'MISMATCH' || entry.identityStatus === 'IDENTITY_RECORD_MISSING'
    ? 'CONFLICT'
    : tiedTop.length > 0
      ? 'AMBIGUOUS_PRIMARY'
      : routingEvidence.concreteFoundationEvidence
        ? 'FOUNDATION_DEFECT_CANDIDATE'
        : !canonicalCandidate
        ? 'EVIDENCE_INSUFFICIENT'
          : 'HOLD_KEEP';
  const taxonomyReason = buildTaxonomyReason(source, decisiveEvidence, routingEvidence, canonicalCandidate, classificationStatus, holdEvidence);
  const difficultyReason = buildDifficultyReason(source, decisiveEvidence, difficultyEvidence, classificationStatus, holdEvidence);
  difficultyEvidence.reason = difficultyReason;
  const taxonomyReasonValidation = validateSourceGroundedReason(taxonomyReason, entry.source, source, { field: 'taxonomyReason' });
  const difficultyReasonValidation = validateSourceGroundedReason(difficultyReason, entry.source, source, { field: 'difficultyReason' });
  return {
    questionUid: source.questionUid, sourceArchiveFile: source.sourceArchiveFile, sourceOrdinal: source.sourceOrdinal, curriculumKey: source.curriculumKey, identityStatus: entry.identityStatus,
    sourceFingerprint: source.sourceFingerprint, contentFingerprint: source.contentFingerprint,
    decisiveSolutionStep: decisiveEvidence.decisiveSolutionStep,
    usedEvidence: decisiveEvidence.usedEvidence,
    mathematicalObjects: decisiveEvidence.mathematicalObjects,
    mathematicalAction: decisiveEvidence.mathematicalAction,
    resultingConditionOrConclusion: decisiveEvidence.resultingConditionOrConclusion,
    sourceIdentity: decisiveEvidence.sourceIdentity,
    sourceEvidenceHash: decisiveEvidence.sourceEvidenceHash,
    taxonomyReason, taxonomyReasonValidation,
    primaryConcept: canonicalCandidate ? { path: [canonicalCandidate.L1, canonicalCandidate.L2, canonicalCandidate.L3, canonicalCandidate.L4], reason: `source-only canonical match from current content/solution cues: ${canonicalCandidate.matchedCues.join(', ')}` } : { path: null, reason: tiedTop.length ? 'canonical ambiguity requires adjudication' : canonicalSelection.errors.join(', ') },
    rejectedAlternativeConcepts: candidates.slice(1, 4).map(candidate => ({ path: [candidate.L1, candidate.L2, candidate.L3, candidate.L4], reason: 'lower-scoring source-only canonical candidate; not selected without stronger current-source evidence' })),
    secondaryConceptKeys: [], canonicalSelection: canonicalCandidate ? { ...canonicalCandidate, validation: canonicalSelection } : null,
    foundationRoutingEvidence: routingEvidence,
    curriculumApplicability: canonicalCandidate?.curriculumApplicability || null, defaultSelectable: canonicalCandidate?.defaultSelectable ?? null,
    difficultyEvidence, difficultyBucket: 'UNKNOWN', difficultyStatus: 'HOLD', holdEvidence, holdEvidenceValidation: holdValidation,
    difficultyReason, difficultyReasonValidation,
    foundationDefectCandidate: classificationStatus === 'FOUNDATION_DEFECT_CANDIDATE', conflict: classificationStatus === 'CONFLICT' || classificationStatus === 'AMBIGUOUS_PRIMARY', classificationStatus,
    decisiveSolutionStepEvidenceHash: decisiveEvidence.sourceEvidenceHash,
    decisionStatus: 'HOLD', recheckStatus: 'NOT_RUN', productionWriteAllowed: false
  };
}

function chunks(entries) {
  const result = []; let current = [];
  for (const entry of entries) {
    const visual = Boolean(entry.source.image || entry.source.solutionImage);
    const limit = visual ? 15 : 25;
    if (current.length >= limit) { result.push(current); current = []; }
    current.push(entry);
  }
  if (current.length) result.push(current);
  return result;
}

function validateBlindRecordAgainstSource(record, entry) {
  const proof = validateDecisiveSolutionEvidence({
    decisiveSolutionStep: record.decisiveSolutionStep,
    usedEvidence: record.usedEvidence,
    mathematicalObjects: record.mathematicalObjects,
    mathematicalAction: record.mathematicalAction,
    resultingConditionOrConclusion: record.resultingConditionOrConclusion,
    sourceIdentity: record.sourceIdentity,
    sourceEvidenceHash: record.sourceEvidenceHash
  }, {
    questionUid: entry.questionUid,
    sourceArchiveFile: entry.sourceArchiveFile,
    sourceOrdinal: entry.sourceOrdinal,
    content: entry.source.content,
    choices: entry.source.choices,
    answer: entry.source.answer,
    solution: entry.source.solution,
    image: entry.source.image
  });
  const taxonomy = validateSourceGroundedReason(record.taxonomyReason, entry.source, entry, { field: 'taxonomyReason' });
  const difficulty = validateSourceGroundedReason(record.difficultyReason, entry.source, entry, { field: 'difficultyReason' });
  return { ok: proof.ok && taxonomy.ok && difficulty.ok, proof, taxonomy, difficulty };
}

function main() {
  const identity = readJson(identityPath);
  const overlay = fs.existsSync(identityOverlayPath) ? readJson(identityOverlayPath) : { additions: [], fingerprintUpdates: [] };
  const target = loadRawEntries(identity, overlay);
  const fingerprintMismatches = target.entries.filter(entry => entry.identityStatus === 'MISMATCH');
  const reconciliation = {
    schemaVersion: 'metadata-foundation-h1-source-identity-reconciliation-v1',
    productionWriteAllowed: false, rawDenominator: target.rawCount, uniqueIdentityBoundRecords: target.entries.filter(entry => entry.identityStatus !== 'IDENTITY_RECORD_MISSING').length,
    originalMissingIdentityKeys: target.originalMissingIdentityKeys, missingIdentityKeysAfterScopedRepair: target.missingIdentityKeys,
    repairedRecords: target.entries.filter(entry => entry.identityResolution === 'SCOPED_IDENTITY_REPAIRED_SOURCE_PRESENT').map(entry => ({ key: entry.key, questionUid: entry.questionUid, sourceExists: true, identityStatus: entry.identityStatus, sourceFingerprint: entry.currentSourceFingerprint, sourceContentFingerprint: entry.currentContentFingerprint })),
    fingerprintMismatches: fingerprintMismatches.map(entry => ({ key: entry.key, sourceExists: true, identityStatus: entry.identityStatus, identitySourceFingerprint: entry.identitySourceFingerprint, sourceFingerprint: entry.currentSourceFingerprint, sourceContentFingerprint: entry.currentContentFingerprint }))
  };
  fs.mkdirSync(outputDir, { recursive: true });
  writeJsonIfChanged(path.join(outputDir, 'source_identity_reconciliation.json'), reconciliation);
  const sourceEntries = target.entries.map(sourcePackRecord);
    const sourcePack = { schemaVersion: 'metadata-foundation-h1-full-rebuild-source-pack-v1', sourceOnly: true, productionWriteAllowed: false, targetDenominator: { raw: target.rawCount, uniqueIdentityBound: target.entries.filter(entry => entry.identityStatus !== 'IDENTITY_RECORD_MISSING').length, originalMissingIdentityKeys: target.originalMissingIdentityKeys, missingIdentityKeysAfterScopedRepair: target.missingIdentityKeys, cohortCounts: target.cohortCounts, duplicateKeys: target.duplicateKeys }, canonicalMaster: { path: canonical.path, sha256: canonical.sha256, authorityVersion: canonical.master.authorityVersion }, records: sourceEntries };
  writeJsonIfChanged(path.join(outputDir, 'source_pack.json'), sourcePack);
  const batchList = chunks(target.entries);
  const expectedBatchIds = new Set(batchList.map((_, index) => `batch-${String(index + 1).padStart(3, '0')}`));
  const staleBatchIds = fs.readdirSync(outputDir, { withFileTypes: true })
    .filter(item => item.isDirectory() && /^batch-\d{3}$/u.test(item.name) && !expectedBatchIds.has(item.name))
    .map(item => item.name)
    .sort();
  if (staleBatchIds.length) throw new Error(`STALE_BATCH_ARTIFACTS_PRESENT:${staleBatchIds.join(',')}`);
  const batchSummaries = [];
  const allBlind = [];
  for (let index = 0; index < batchList.length; index++) {
    const batchEntries = batchList[index]; const batchId = `batch-${String(index + 1).padStart(3, '0')}`; const batchDir = path.join(outputDir, batchId); fs.mkdirSync(batchDir, { recursive: true });
    const batchSource = { schemaVersion: 'metadata-foundation-h1-batch-source-pack-v1', sourceOnly: true, batchId, records: batchEntries.map(sourcePackRecord) };
    writeJsonIfChanged(path.join(batchDir, 'source_pack.json'), batchSource);
    const blind = batchEntries.map(entry => blindRecord(entry)); allBlind.push(...blind);
    fs.writeFileSync(path.join(batchDir, 'blind_decision_pack.json'), `${JSON.stringify({ schemaVersion: 'metadata-foundation-h1-batch-blind-decision-pack-v1', batchId, sourceOnly: true, priorReviewVisibility: 'NONE', productionWriteAllowed: false, records: blind }, null, 2)}\n`, 'utf8');
    const oldComparison = batchEntries.map((entry, rowIndex) => { const decision = blind[rowIndex]; const old = entry.oldQueueMetadata; const blindPath = decision.primaryConcept.path ? decision.primaryConcept.path.join(' > ') : null; const oldPath = [old.L1, old.L2, old.L3, old.L4].every(Boolean) ? [old.L1, old.L2, old.L3, old.L4].join(' > ') : null; return { questionUid: entry.questionUid, sourceArchiveFile: entry.sourceArchiveFile, sourceOrdinal: entry.sourceOrdinal, oldPath, blindPath, semanticDisagreement: oldPath !== blindPath, oldLegacyLevel: old.legacyLevel, blindDifficultyBucket: decision.difficultyBucket, sourceMetadataHypothesis: entry.legacySourceMetadata }; });
    fs.writeFileSync(path.join(batchDir, 'old_comparison.json'), `${JSON.stringify({ schemaVersion: 'metadata-foundation-h1-batch-old-comparison-v1', batchId, priorUsedForDecision: false, records: oldComparison }, null, 2)}\n`, 'utf8');
    const imageChecks = batchEntries.flatMap(entry => [{ questionUid: entry.questionUid, kind: 'image', ...assetCheck(entry.source.image) }, { questionUid: entry.questionUid, kind: 'solutionImage', ...assetCheck(entry.source.solutionImage) }]);
    const machine = { schemaVersion: 'metadata-foundation-h1-batch-machine-validation-v1', batchId, checks: {
      rawCount: batchEntries.length,
      sourceContentPresent: batchEntries.every(entry => Boolean(entry.source.content)),
      choicesFieldPresent: batchEntries.every(entry => Array.isArray(entry.source.choices)),
      sourceImageChecksPass: imageChecks.every(check => check.exists && check.nonEmpty),
      sourceBindingMatchCount: batchEntries.filter(entry => entry.identityStatus === 'MATCH').length,
      sourceBindingMismatchCount: batchEntries.filter(entry => entry.identityStatus !== 'MATCH').length,
      identityConflictHoldPass: blind.every(record => record.identityStatus !== 'MISMATCH' || (record.classificationStatus === 'CONFLICT' && record.foundationDefectCandidate === false && record.holdEvidence?.missingEvidence?.includes('identity_fingerprint_reconciliation'))),
      canonicalPassCount: blind.filter(record => record.canonicalSelection?.validation?.ok).length,
      canonicalNoFitCount: blind.filter(record => record.foundationDefectCandidate).length,
      evidenceCompletenessPass: blind.every((record, rowIndex) => validateBlindRecordAgainstSource(record, batchEntries[rowIndex]).ok),
      taxonomyReasonPass: blind.every((record, rowIndex) => validateBlindRecordAgainstSource(record, batchEntries[rowIndex]).taxonomy.ok),
      difficultyReasonPass: blind.every((record, rowIndex) => validateBlindRecordAgainstSource(record, batchEntries[rowIndex]).difficulty.ok),
      foundationEvidencePass: blind.every(record => !record.foundationDefectCandidate || (record.foundationRoutingEvidence?.sourceConcept?.repeatedCoreTypes?.length > 0 && record.foundationRoutingEvidence?.decisiveEvidenceValidation?.ok === true && record.foundationRoutingEvidence?.canonicalSearch?.searchedPathCount > 0 && record.foundationRoutingEvidence?.canonicalSearch?.tieState === 'NO_ELIGIBLE_CANDIDATE' && record.foundationRoutingEvidence?.whyNoFit && record.foundationRoutingEvidence?.nextAction)),
      ambiguityRoutingPass: blind.every(record => record.foundationRoutingEvidence?.tieState !== 'TIED_TOP' || ((record.classificationStatus === 'AMBIGUOUS_PRIMARY' && record.conflict && !record.foundationDefectCandidate && record.holdEvidence?.missingEvidence?.includes('canonical_adjudication_evidence')) || record.classificationStatus === 'CONFLICT')),
      lexicalNoFitHoldPass: blind.every(record => record.foundationRoutingEvidence?.tieState !== 'NO_ELIGIBLE_CANDIDATE' || record.foundationDefectCandidate || record.classificationStatus === 'EVIDENCE_INSUFFICIENT' || record.classificationStatus === 'CONFLICT'),
      holdEvidencePass: blind.every(record => record.holdEvidenceValidation.ok),
      decisiveSolutionStepPlaceholderCount: blind.filter(record => !isSubstantiveDecisiveStep(record.decisiveSolutionStep)).length,
      noBareBooleanAcceptance: blind.every(record => record.decisionStatus !== 'RECHECK_PASS' && record.decisionStatus !== 'ACCEPTED_FOR_METADATA_APPLY'),
      semanticDisagreementCount: oldComparison.filter(record => record.semanticDisagreement).length
    } };
    const machineValidationArtifact = buildMachineValidationArtifact(machine, imageChecks);
    writeJsonIfChanged(path.join(batchDir, 'machine_validation.json'), machineValidationArtifact);
    const persistedMachineValidationArtifact = readJson(path.join(batchDir, 'machine_validation.json'));
    const persistedMachineDigest = verifyMachineValidationDigest(persistedMachineValidationArtifact, machineValidationDigest(machineValidationArtifact));
    if (!persistedMachineDigest.ok || !Array.isArray(persistedMachineValidationArtifact.imageChecks)) throw new Error(`MACHINE_VALIDATION_PERSISTENCE_MISMATCH:${batchId}`);
    const seal = { schemaVersion: 'metadata-foundation-h1-batch-seal-v1', batchId, sourcePackDigest: objectDigest(batchSource), blindDecisionPackDigest: objectDigest({ records: blind }), oldComparisonDigest: objectDigest({ records: oldComparison }), machineValidationDigest: persistedMachineDigest.actualDigest, productionWriteAllowed: false, status: 'SEALED_FOR_B_REVIEW', records: batchEntries.length };
    writeJsonIfChanged(path.join(batchDir, 'batch_seal.json'), seal);
    batchSummaries.push({ batchId, count: batchEntries.length, sourcePackDigest: seal.sourcePackDigest, blindDecisionPackDigest: seal.blindDecisionPackDigest, machineValidationDigest: seal.machineValidationDigest, semanticDisagreementCount: machine.checks.semanticDisagreementCount, canonicalPassCount: machine.checks.canonicalPassCount, foundationDefectCandidateCount: machine.checks.canonicalNoFitCount, sourceBindingMismatchCount: machine.checks.sourceBindingMismatchCount, decisiveSolutionStepPlaceholderCount: machine.checks.decisiveSolutionStepPlaceholderCount, stagingEvidencePass: machine.checks.sourceImageChecksPass && machine.checks.identityConflictHoldPass && machine.checks.evidenceCompletenessPass && machine.checks.taxonomyReasonPass && machine.checks.difficultyReasonPass && machine.checks.foundationEvidencePass && machine.checks.ambiguityRoutingPass && machine.checks.lexicalNoFitHoldPass && machine.checks.holdEvidencePass && machine.checks.decisiveSolutionStepPlaceholderCount === 0 && machine.checks.noBareBooleanAcceptance });
  }
  const unresolvedFingerprintConflicts = target.entries.filter(entry => entry.identityStatus === 'MISMATCH').length;
  const sourceBinding = { ok: target.missingIdentityKeys.length === 0 && target.duplicateKeys.length === 0 && unresolvedFingerprintConflicts === 0, errors: [...(target.missingIdentityKeys.length ? [`IDENTITY_RECORD_MISSING:${target.missingIdentityKeys.length}`] : []), ...(unresolvedFingerprintConflicts ? [`IDENTITY_FINGERPRINT_CONFLICT:${unresolvedFingerprintConflicts}`] : []), ...(target.duplicateKeys.length ? [`IDENTITY_DUPLICATE:${target.duplicateKeys.length}`] : [])], identityCount: target.entries.filter(entry => entry.identityStatus !== 'IDENTITY_RECORD_MISSING').length, rawCount: target.entries.length, missingIdentityKeys: target.missingIdentityKeys, originalMissingIdentityKeys: target.originalMissingIdentityKeys, duplicateKeys: target.duplicateKeys, unresolvedFingerprintConflicts };
  const category = record => record.classificationStatus;
  const categoryCounts = allBlind.reduce((acc, record) => { const key = category(record); acc[key] = (acc[key] || 0) + 1; return acc; }, {});
  const oldDiffCount = batchSummaries.reduce((sum, batch) => sum + batch.semanticDisagreementCount, 0);
  const allFingerprintMismatchCount = target.entries.filter(entry => entry.identityStatus === 'MISMATCH').length;
  const decisiveSolutionStepPlaceholderCount = allBlind.filter(record => !isSubstantiveDecisiveStep(record.decisiveSolutionStep)).length;
  const exclusiveStatusCounts = allBlind.reduce((acc, record) => { const key = category(record); acc[key] = (acc[key] || 0) + 1; return acc; }, {});
  const fixedOverlapByStatus = allBlind.filter(record => record.semanticDisagreement).reduce((acc, record) => { const key = category(record); acc[key] = (acc[key] || 0) + 1; return acc; }, {});
  const fixedOverlapTotal = Object.values(fixedOverlapByStatus).reduce((sum, value) => sum + value, 0);
  const stagingEvidencePass = batchSummaries.every(batch => batch.stagingEvidencePass);
  const summary = { schemaVersion: 'metadata-foundation-h1-full-rebuild-summary-v1', targetManifest: { path: auditManifest.path, sha256: objectDigest(auditManifest.manifest), targetCohortCount: auditManifest.manifest.targetCohorts.length }, sourcePackDigest: objectDigest(sourcePack), total: target.rawCount, checked: allBlind.length, batchCount: batchSummaries.length, batchSummaries, totals: { PASS: 0, FIXED: fixedOverlapTotal, HOLD_KEEP: exclusiveStatusCounts.HOLD_KEEP || 0, HOLD_RELEASE: 0, FOUNDATION_DEFECT_CANDIDATE: exclusiveStatusCounts.FOUNDATION_DEFECT_CANDIDATE || 0, CONFLICT: exclusiveStatusCounts.CONFLICT || 0, AMBIGUOUS_PRIMARY: exclusiveStatusCounts.AMBIGUOUS_PRIMARY || 0, EVIDENCE_INSUFFICIENT: exclusiveStatusCounts.EVIDENCE_INSUFFICIENT || 0, decisiveSolutionStepPlaceholderCount }, evidence: { recordCount: allBlind.length, sourceEvidenceMissingCount: allBlind.filter(record => !record.sourceEvidenceHash || !record.usedEvidence?.length || !record.mathematicalObjects?.length || !record.mathematicalAction || !record.resultingConditionOrConclusion).length, uniqueSourceEvidenceHashCount: new Set(allBlind.map(record => record.sourceEvidenceHash)).size, stagingEvidencePass }, accounting: { exclusiveStatusTotal: allBlind.length, fixedOverlapTotal, fixedOverlapByStatus }, identity: { raw: target.rawCount, uniqueIdentityBound: target.entries.filter(entry => entry.identityStatus !== 'IDENTITY_RECORD_MISSING').length, originalMissingIdentityKeys: target.originalMissingIdentityKeys, missingIdentityKeysAfterScopedRepair: target.missingIdentityKeys, duplicateKeys: target.duplicateKeys, fingerprintMismatchCount: fingerprintMismatches.length, gate: sourceBinding }, productionMutation: { sourceJs: false, metadataSidecar: false, database: false, questionIndex: false, fullRebuild: false, commit: false, push: false }, aStatus: stagingEvidencePass ? 'A_READY_FOR_REVIEW' : 'A_EVIDENCE_INSUFFICIENT', releaseReadiness: 'BLOCKED_UNRESOLVED_IDENTITY_AND_INDEPENDENT_RECHECK', globalArtifactStatus: 'NOT_USED_AS_AUTHORITY_STALE_DEFERRED', allDecisionsFailClosed: allBlind.every(record => record.decisionStatus === 'HOLD'), allNoPromotion: allBlind.every(record => record.decisionStatus !== 'RECHECK_PASS' && record.decisionStatus !== 'ACCEPTED_FOR_METADATA_APPLY') };
  fs.writeFileSync(path.join(outputDir, 'full_rebuild_summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(outputDir, 'full_rebuild_report.md'), `# Metadata Foundation H1 Full Rebuild — Gate 4 A\n\n- TOTAL: ${summary.total}\n- CHECKED: ${summary.checked}\n- Batches: ${summary.batchCount}\n- PASS: 0\n- FIXED (old-vs-blind disagreement overlap): ${summary.totals.FIXED}\n- HOLD_KEEP: ${summary.totals.HOLD_KEEP}\n- HOLD_RELEASE: 0\n- FOUNDATION_DEFECT_CANDIDATE: ${summary.totals.FOUNDATION_DEFECT_CANDIDATE}\n- AMBIGUOUS_PRIMARY: ${summary.totals.AMBIGUOUS_PRIMARY}\n- EVIDENCE_INSUFFICIENT: ${summary.totals.EVIDENCE_INSUFFICIENT}\n- CONFLICT: ${summary.totals.CONFLICT}\n- Exclusive status total: ${summary.accounting.exclusiveStatusTotal}\n- Decisive-step placeholders: ${summary.totals.decisiveSolutionStepPlaceholderCount}\n- Raw denominator: ${summary.total}\n- Unique identity-map-bound records after scoped repair: ${summary.identity.uniqueIdentityBound}\n- Original missing identity records: ${summary.identity.originalMissingIdentityKeys.length}\n- Missing identity records after scoped repair: ${summary.identity.missingIdentityKeysAfterScopedRepair.length}\n- Fingerprint mismatches: ${summary.identity.fingerprintMismatchCount}\n- Production mutation: none\n- Global sidecar: stale/deferred; not used as decision authority\n\nAll ${summary.total} raw records were source-loaded and processed in source-only blind batches. Every A decision is HOLD; no RECHECK_PASS or ACCEPTED_FOR_METADATA_APPLY was emitted.\n`, 'utf8');
  console.log(JSON.stringify({ outputDir: path.relative(repoRoot, outputDir).replaceAll('\\', '/'), total: summary.total, checked: summary.checked, batchCount: summary.batchCount, totals: summary.totals, identity: summary.identity, allDecisionsFailClosed: summary.allDecisionsFailClosed }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
