import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const SOURCE_FINGERPRINT_FIELDS = Object.freeze(['content', 'choices', 'answer', 'solution', 'image']);
export const DIFFICULTY_EVIDENCE_FIELDS = Object.freeze([
  'questionUid', 'sourceArchiveFile', 'sourceOrdinal', 'sourceFingerprint',
  'conceptCount', 'conditionInterpretation', 'strategyChoice',
  'nonRoutineTransformation', 'caseBranching', 'rangeConstraint',
  'integerConstraint', 'existenceCheck', 'decisiveInsight', 'executionBurden'
]);
export const DIFFICULTY_BUCKETS = Object.freeze([1, 2, 3, 4, 5]);
export const FIXTURE_ALLOWLIST_PATH = 'archive/data/metadata-fixture-allowlist.json';
export const H1_AUDIT_MANIFEST_PATH = 'archive/data/metadata-foundation-h1-audit-manifest.json';

const GENERIC_DECISIVE_VALUES = Object.freeze([
  '따라서', '그러므로', '정리하면', '계산하면', '조건을 이용하면', '값을 구한다',
  '답을 얻는다', '위 식에서', '핵심은', '[키포인트]'
]);
const DECISIVE_HEADING_PREFIX = /^(?:\[키포인트\]|조건 정리|풀이 방향|정석 풀이|풀이 과정|결론|계산\/도식 확인|따라서 정답|정답은|따라서|그러므로|정답)(?:\s*[:：\-]\s*|\s+)?/u;
const DECISIVE_MARKER_ONLY = /^(?:\[키포인트\]|조건 정리|풀이 방향|정석 풀이|풀이 과정|결론|계산\/도식 확인|따라서 정답|정답은|따라서|그러므로|정답)[\s:：\-.,!?。]*$/u;
const DECISIVE_ANTIFORMALISM_PATTERNS = Object.freeze([
  ['따라서', /따라서/u], ['그러므로', /그러므로/u], ['정리하면', /정리하면/u],
  ['계산하면', /계산하면/u], ['위 식에서', /위\s*식에서/u], ['핵심은', /핵심\s*은/u],
  ['[키포인트]', /\[키포인트\]/u], ['정석 풀이', /정석\s*풀이/u], ['풀이 방향', /풀이\s*방향/u],
  ['조건 정리', /조건\s*정리/u], ['풀이 과정', /풀이\s*과정/u], ['계산/도식 확인', /계산\/도식\s*확인/u],
  ['결론', /결론/u], ['정답은', /정답은/u]
]);
const MATHEMATICAL_OBJECT_PATTERN = /(?:\$[^$]+\$|[A-Za-z](?:_[A-Za-z0-9]+)?(?:\^[A-Za-z0-9]+)?|다항식|다항식식|방정식|부등식|함수|직선|원|점|좌표|집합|명제|근|계수|인수|기울기|거리|반지름|넓이|둘레|수열|삼각형|선분|교점|해집합|조건|구간|확률|행렬|벡터|각|변|변환)/gu;
const MATHEMATICAL_ACTIONS = Object.freeze([
  ['대입', /대입/u], ['정리', /정리/u], ['계산', /계산/u], ['설정', /두자|놓자|놓고|두고/u],
  ['나눗셈', /나누/u], ['비교', /비교/u], ['치환', /치환/u], ['변형', /변형/u],
  ['전개', /전개/u], ['인수분해', /인수분해/u], ['적용', /적용/u], ['이용', /이용/u],
  ['만족성검토', /만족|성립/u], ['세우기', /세우/u], ['판별', /판별/u], ['검산', /검산|대입하여 확인|확인/u],
  ['결정', /결정/u], ['분류', /분류/u], ['구하기', /구하|찾/u], ['도출', /얻|나타내/u], ['표현', /표현/u]
]);

function decisiveText(value) {
  return String(value || '')
    .replace(/<br\s*\/?\s*>/giu, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\\n/g, '\n')
    .replace(/\u00a0/g, ' ')
    .split(/\r?\n/)
    .map(line => line.replace(/^\s*\[[^\]]+\]\s*/u, '').trim())
    .filter(Boolean);
}

function stripDecisiveHeading(value) {
  let line = String(value || '').trim();
  let previous;
  do {
    previous = line;
    line = line.replace(DECISIVE_HEADING_PREFIX, '').trim();
  } while (line !== previous);
  return line;
}

function isGenericDecisiveValue(value) {
  const normalized = stripDecisiveHeading(value).replace(/[\s:：\-.,!?。]+$/u, '').trim();
  return !normalized || DECISIVE_MARKER_ONLY.test(normalized) || GENERIC_DECISIVE_VALUES.includes(normalized);
}

export function decisiveAntiFormalismViolations(value) {
  const text = String(value || '').trim();
  // A substantive proof may legitimately contain words such as “따라서” or
  // “정리하면”.  Anti-formalism is about a marker/heading being used as the
  // decisive step by itself, not about those words occurring in a real step.
  if (!isGenericDecisiveValue(text)) return [];
  return DECISIVE_ANTIFORMALISM_PATTERNS.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
}

function evidenceParts(value) {
  const line = stripDecisiveHeading(value);
  const mathematicalObjects = [...new Set(line.match(MATHEMATICAL_OBJECT_PATTERN) || [])].slice(0, 12);
  const action = MATHEMATICAL_ACTIONS.find(([, pattern]) => pattern.test(line));
  const hasRelation = /(?:=|≤|≥|<|>|≠|±|→|⇒|\$[^$]*\$)/u.test(line);
  const hasConclusion = /(?:이므로|따라서|그러므로|이면|일 때|만족|성립|얻(?:는다|어)|결정(?:된다|한다)|된다|이다|인 경우|불가능|가능|최댓값|최솟값|해는|답은|값은)/u.test(line);
  const resultingConditionOrConclusion = hasRelation || hasConclusion ? line : '';
  return { line, mathematicalObjects, mathematicalAction: action?.[0] || (hasRelation ? '등식·조건 도출' : hasConclusion ? '결론 판정' : ''), resultingConditionOrConclusion };
}

export function loadMetadataFoundationAuditManifest(repositoryRoot) {
  const manifestPath = path.join(repositoryRoot, H1_AUDIT_MANIFEST_PATH);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.scope !== 'HIGH1_ONLY') throw new Error('AUDIT_MANIFEST_SCOPE_INVALID');
  if (!Array.isArray(manifest.targetCohorts) || manifest.targetCohorts.length === 0) throw new Error('AUDIT_MANIFEST_TARGET_COHORTS_MISSING');
  for (const cohort of manifest.targetCohorts) {
    if (!cohort.id || !cohort.artifactPath || !cohort.curriculumKey) throw new Error('AUDIT_MANIFEST_COHORT_INVALID');
  }
  return { path: manifestPath, manifest };
}

export function validateDecisiveSolutionEvidence(evidence, source = null) {
  const errors = [];
  const step = String(evidence?.decisiveSolutionStep || '').trim();
  if (!step || isGenericDecisiveValue(step)) errors.push('DECISIVE_STEP_GENERIC_OR_EMPTY');
  const antiFormalismViolations = decisiveAntiFormalismViolations(step);
  if (antiFormalismViolations.length) errors.push(`DECISIVE_STEP_ANTIFORMALISM:${antiFormalismViolations.join('|')}`);
  const parts = evidenceParts(step);
  const mathematicalObjects = Array.isArray(evidence?.mathematicalObjects) ? evidence.mathematicalObjects : parts.mathematicalObjects;
  const mathematicalAction = String(evidence?.mathematicalAction || parts.mathematicalAction).trim();
  const resulting = String(evidence?.resultingConditionOrConclusion || parts.resultingConditionOrConclusion).trim();
  if (!mathematicalObjects.length) errors.push('DECISIVE_STEP_MATHEMATICAL_OBJECT_MISSING');
  if (!mathematicalAction) errors.push('DECISIVE_STEP_MATHEMATICAL_ACTION_MISSING');
  if (!resulting || !/(?:=|≤|≥|<|>|≠|±|→|⇒|이므로|따라서|그러므로|이면|만족|성립|얻|결정|된다|이다|가능|불가능|최댓값|최솟값|해는|답은|값은)/u.test(resulting)) errors.push('DECISIVE_STEP_RESULT_MISSING');
  if (!Array.isArray(evidence?.usedEvidence) || evidence.usedEvidence.length === 0) errors.push('DECISIVE_STEP_USED_EVIDENCE_MISSING');
  if (!evidence?.sourceIdentity || !evidence.sourceIdentity.questionUid || !evidence.sourceIdentity.sourceArchiveFile || !Number.isInteger(Number(evidence.sourceIdentity.sourceOrdinal))) errors.push('DECISIVE_STEP_SOURCE_IDENTITY_MISSING');
  if (!/^[a-f0-9]{64}$/u.test(String(evidence?.sourceEvidenceHash || ''))) errors.push('DECISIVE_STEP_SOURCE_EVIDENCE_HASH_MISSING');
  if (source) {
    const expectedIdentity = {
      questionUid: source.questionUid,
      sourceArchiveFile: normalizeSourceFile(source.sourceArchiveFile),
      sourceOrdinal: Number(source.sourceOrdinal)
    };
    for (const field of Object.keys(expectedIdentity)) if (evidence?.sourceIdentity?.[field] !== expectedIdentity[field]) errors.push(`DECISIVE_STEP_${field.toUpperCase()}_MISMATCH`);
    const expectedHash = sha256(JSON.stringify({
      sourceIdentity: expectedIdentity,
      content: source.content ?? null,
      choices: Array.isArray(source.choices) ? source.choices : null,
      answer: source.answer ?? null,
      solution: source.solution ?? null,
      image: source.image ?? null,
      decisiveSolutionStep: step
    }));
    if (evidence.sourceEvidenceHash !== expectedHash) errors.push('DECISIVE_STEP_SOURCE_EVIDENCE_HASH_MISMATCH');
  }
  return { ok: errors.length === 0, errors, parts: { line: step, mathematicalObjects, mathematicalAction, resultingConditionOrConclusion: resulting } };
}

export function deriveDecisiveSolutionEvidence(source, identity) {
  const lines = decisiveText(source?.solution);
  const candidates = [];
  for (let index = 0; index < lines.length; index++) {
    for (const width of [1, 2, 3]) {
      const line = lines.slice(index, index + width).join(' ').replace(/\s+/g, ' ').trim();
      if (!line || isGenericDecisiveValue(line)) continue;
      if (decisiveAntiFormalismViolations(line).length) continue;
      const parts = evidenceParts(line);
      if (!parts.mathematicalObjects.length || !parts.mathematicalAction || !parts.resultingConditionOrConclusion) continue;
      const sourceIdentity = { questionUid: identity.questionUid, sourceArchiveFile: normalizeSourceFile(identity.sourceArchiveFile), sourceOrdinal: Number(identity.sourceOrdinal) };
      const evidence = {
        decisiveSolutionStep: line,
        usedEvidence: [
          { field: 'solution', excerpt: line },
          ...(source?.content && parts.mathematicalObjects.some(object => String(source.content).includes(String(object).replace(/[$]/g, ''))) ? [{ field: 'content', excerpt: String(source.content).slice(0, 240) }] : []),
          ...(source?.image ? [{ field: 'image', reference: source.image }] : [])
        ],
        mathematicalObjects: parts.mathematicalObjects,
        mathematicalAction: parts.mathematicalAction,
        resultingConditionOrConclusion: parts.resultingConditionOrConclusion,
        sourceIdentity,
        sourceEvidenceHash: sha256(JSON.stringify({ sourceIdentity, content: source?.content ?? null, choices: Array.isArray(source?.choices) ? source.choices : null, answer: source?.answer ?? null, solution: source?.solution ?? null, image: source?.image ?? null, decisiveSolutionStep: line }))
      };
      const validation = validateDecisiveSolutionEvidence(evidence, sourceIdentityWithPayload(source, identity));
      if (validation.ok) return { ...evidence, validation };
      candidates.push({ evidence, validation });
    }
  }
  return { decisiveSolutionStep: null, usedEvidence: [], mathematicalObjects: [], mathematicalAction: '', resultingConditionOrConclusion: '', sourceIdentity: { questionUid: identity.questionUid, sourceArchiveFile: normalizeSourceFile(identity.sourceArchiveFile), sourceOrdinal: Number(identity.sourceOrdinal) }, sourceEvidenceHash: sha256(JSON.stringify({ sourceIdentity: { questionUid: identity.questionUid, sourceArchiveFile: normalizeSourceFile(identity.sourceArchiveFile), sourceOrdinal: Number(identity.sourceOrdinal) }, content: source?.content ?? null, choices: Array.isArray(source?.choices) ? source.choices : null, answer: source?.answer ?? null, solution: source?.solution ?? null, image: source?.image ?? null, decisiveSolutionStep: null })), validation: { ok: false, errors: ['DECISIVE_STEP_NO_SUBSTANTIVE_SOURCE_LINE'] }, rejectedCandidates: candidates.slice(0, 5).map(candidate => candidate.validation.errors) };
}

function sourceIdentityWithPayload(source, identity) {
  return { ...identity, content: source?.content, choices: source?.choices, answer: source?.answer, solution: source?.solution, image: source?.image };
}

export function normalizeSourceFile(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\\/g, '/')
    .replace(/^\.?\/?archive\/exams\//, '')
    .replace(/^\.?\/?exams\//, '')
    .replace(/^\/+/, '')
    .replace(/[?#].*$/, '')
    .trim();
}

export function isTestFixtureSource(value) {
  return normalizeSourceFile(value).startsWith('test-fixtures/');
}

export function loadFixtureAllowlist(repositoryRoot) {
  const filePath = path.join(repositoryRoot, FIXTURE_ALLOWLIST_PATH);
  const manifest = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const paths = new Set((manifest.productionDenominatorExcludedPaths || []).map(normalizeSourceFile));
  if (!paths.size || [...paths].some(value => !value || value.startsWith('test-fixtures/') === false)) throw new Error('FIXTURE_ALLOWLIST_INVALID');
  return { path: filePath, paths };
}

export function isRegisteredTestFixtureSource(value, fixtureAllowlist) {
  return Boolean(fixtureAllowlist?.has(normalizeSourceFile(value)) && isTestFixtureSource(value));
}

export function sourceFingerprint(question) {
  return sha256(JSON.stringify({
    content: question?.content ?? null,
    choices: Array.isArray(question?.choices) ? question.choices : null,
    answer: question?.answer ?? null,
    solution: question?.solution ?? null,
    image: question?.image ?? null
  }));
}

export function contentFingerprint(question) {
  return sha256(JSON.stringify({
    content: question?.content ?? null,
    choices: Array.isArray(question?.choices) ? question.choices : null,
    image: question?.image ?? null
  }));
}

export function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

export function objectDigest(value) {
  return sha256(canonicalJson(value));
}

// The digest basis is the exact object persisted as machine_validation.json.
// Keep construction and hashing together so optional checks cannot be added
// after the seal has already been calculated.
export function buildMachineValidationArtifact(machine, imageChecks) {
  if (!machine || typeof machine !== 'object' || Array.isArray(machine)) throw new Error('MACHINE_VALIDATION_OBJECT_REQUIRED');
  if (!Array.isArray(imageChecks)) throw new Error('MACHINE_VALIDATION_IMAGE_CHECKS_REQUIRED');
  return { ...machine, imageChecks };
}

export function machineValidationDigest(machineValidationArtifact) {
  return objectDigest(machineValidationArtifact);
}

export function verifyMachineValidationDigest(machineValidationArtifact, expectedDigest) {
  const actualDigest = machineValidationDigest(machineValidationArtifact);
  return { ok: actualDigest === expectedDigest, actualDigest, expectedDigest };
}

function reasonTokens(value) {
  return [...new Set(String(value || '').match(/[가-힣A-Za-z0-9]{2,}/gu) || [])];
}

export function validateSourceGroundedReason(reason, source, identity, { field = 'reason' } = {}) {
  const errors = [];
  const text = String(reason || '').trim();
  if (text.length < 40) errors.push(`${field.toUpperCase()}_TOO_SHORT`);
  const expectedKey = `${normalizeSourceFile(identity?.sourceArchiveFile)}#${Number(identity?.sourceOrdinal)}`;
  if (!text.includes(expectedKey)) errors.push(`${field.toUpperCase()}_IDENTITY_ANCHOR_MISSING`);
  const sourceTokens = reasonTokens(`${source?.content || ''} ${source?.solution || ''}`);
  if (!sourceTokens.some(token => text.includes(token))) errors.push(`${field.toUpperCase()}_SOURCE_ANCHOR_MISSING`);
  if (/^(?:source-only|independent recheck|metadata hold|not available)[\s:.,-]*$/iu.test(text)) errors.push(`${field.toUpperCase()}_GENERIC`);
  return { ok: errors.length === 0, errors };
}

export function validateIdentityCardinality(identityRecords, classificationRecords, { includeFixtures = false, fixtureAllowlist = new Set(['test-fixtures/render-authority-golden.js']) } = {}) {
  const isFixture = record => isRegisteredTestFixtureSource(record.sourceArchiveFile, fixtureAllowlist);
  const identity = (identityRecords || []).filter(record => includeFixtures || !isFixture(record));
  const classification = (classificationRecords || []).filter(record => includeFixtures || !isFixture(record));
  const identityUids = new Set(identity.map(record => String(record.questionUid || '').trim()).filter(Boolean));
  const classificationUids = new Set(classification.map(record => String(record.questionUid || '').trim()).filter(Boolean));
  const missingClassification = [...identityUids].filter(uid => !classificationUids.has(uid)).sort();
  const orphanClassification = [...classificationUids].filter(uid => !identityUids.has(uid)).sort();
  const duplicateIdentity = identity.length - identityUids.size;
  const duplicateClassification = classification.length - classificationUids.size;
  const errors = [];
  if (missingClassification.length) errors.push(`CLASSIFICATION_MISSING:${missingClassification.length}`);
  if (orphanClassification.length) errors.push(`CLASSIFICATION_ORPHAN:${orphanClassification.length}`);
  if (duplicateIdentity) errors.push(`IDENTITY_DUPLICATE:${duplicateIdentity}`);
  if (duplicateClassification) errors.push(`CLASSIFICATION_DUPLICATE:${duplicateClassification}`);
  return {
    ok: errors.length === 0,
    errors,
    identityCount: identity.length,
    classificationCount: classification.length,
    missingClassification,
    orphanClassification,
    duplicateIdentity,
    duplicateClassification,
    excludedFixtureIdentityCount: (identityRecords || []).length - identity.length,
    excludedFixtureClassificationCount: (classificationRecords || []).length - classification.length
  };
}

export function validateSourceBinding(identityRecord, artifact, question) {
  const errors = [];
  const expectedFile = normalizeSourceFile(identityRecord?.sourceArchiveFile);
  const actualFile = normalizeSourceFile(artifact?.sourceArchiveFile);
  if (!artifact?.questionUid || artifact.questionUid !== identityRecord?.questionUid) errors.push('QUESTION_UID_MISMATCH');
  if (!actualFile || actualFile !== expectedFile) errors.push('SOURCE_FILE_MISMATCH');
  if (Number(artifact?.sourceOrdinal) !== Number(identityRecord?.sourceOrdinal)) errors.push('SOURCE_ORDINAL_MISMATCH');
  const currentFingerprint = sourceFingerprint(question);
  const currentContentFingerprint = contentFingerprint(question);
  if (!artifact?.sourceFingerprint || artifact.sourceFingerprint !== currentFingerprint) errors.push('SOURCE_FINGERPRINT_MISMATCH');
  if (artifact?.contentFingerprint !== undefined && artifact.contentFingerprint !== currentContentFingerprint) errors.push('CONTENT_FINGERPRINT_MISMATCH');
  return {
    ok: errors.length === 0,
    errors,
    expected: {
      questionUid: identityRecord?.questionUid,
      sourceArchiveFile: expectedFile,
      sourceOrdinal: Number(identityRecord?.sourceOrdinal),
      sourceFingerprint: currentFingerprint,
      contentFingerprint: currentContentFingerprint
    }
  };
}

function canonicalPaths(master, curriculumKey) {
  const paths = [];
  for (const record of master?.records || []) {
    if (curriculumKey && String(record.curriculum) !== String(curriculumKey)) continue;
    for (const concept of record.concepts || []) {
      for (const problemType of concept.problemTypes || []) {
        paths.push({
          curriculum: String(record.curriculum || ''),
          level: String(record.level || ''),
          scope: String(record.scope || ''),
          L1: String(record.majorUnit || ''),
          L2: String(record.midUnit || ''),
          L3: String(concept.concept || ''),
          L4: String(problemType.problemType || ''),
          curriculumApplicability: problemType.curriculumApplicability || concept.curriculumApplicability || record.curriculumApplicability || 'DEFAULT_SCOPE',
          defaultSelectable: problemType.defaultSelectable ?? concept.defaultSelectable ?? record.defaultSelectable
        });
      }
    }
  }
  return paths;
}

export function loadCanonicalRpmMaster(repositoryRoot) {
  const masterPath = path.join(repositoryRoot, 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json');
  const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
  if (master.authorityStatus !== 'LOCKED' || master.authorityVersion !== 'RPM_PRIMARY_TAXONOMY_v1.0') throw new Error('CANONICAL_RPM_MASTER_NOT_LOCKED');
  return { path: masterPath, sha256: sha256(fs.readFileSync(masterPath, 'utf8')), master };
}

export function validateCanonicalSelection(selection, masterBundle) {
  const required = ['curriculumKey', 'L1', 'L2', 'L3', 'L4', 'curriculumApplicability', 'defaultSelectable'];
  const errors = required.filter(field => !String(selection?.[field] ?? '').trim()).map(field => `CANONICAL_FIELD_MISSING:${field}`);
  if (errors.length) return { ok: false, errors, match: null };
  const paths = canonicalPaths(masterBundle?.master || masterBundle, selection.curriculumKey);
  const scopedPaths = paths.filter(row => (!selection.level || row.level === String(selection.level)) && (!selection.scope || row.scope === String(selection.scope)));
  const matches = scopedPaths.filter(row => row.L1 === selection.L1 && row.L2 === selection.L2 && row.L3 === selection.L3 && row.L4 === selection.L4);
  if (matches.length > 1 && (!selection.level || !selection.scope)) return { ok: false, errors: ['CANONICAL_SELECTION_AMBIGUOUS_CONTEXT'], match: null };
  const match = matches[0];
  if (!match) return { ok: false, errors: ['CANONICAL_L4_NOT_FOUND'], match: null };
  if (selection.curriculumApplicability && selection.curriculumApplicability !== match.curriculumApplicability) errors.push('CANONICAL_APPLICABILITY_MISMATCH');
  const expectedSelectable = match.curriculumApplicability === 'RPM_EXTENDED_CANDIDATE' || match.curriculumApplicability === 'RPM_EXTENDED' ? false : match.defaultSelectable;
  if (selection.defaultSelectable !== undefined && Boolean(selection.defaultSelectable) !== Boolean(expectedSelectable)) errors.push('CANONICAL_DEFAULT_SELECTABLE_MISMATCH');
  if (match.curriculumApplicability === 'RPM_EXTENDED_CANDIDATE' && selection.defaultSelectable !== false) errors.push('RPM_EXTENDED_CANDIDATE_MUST_BE_FALSE');
  return { ok: errors.length === 0, errors, match };
}

function boolean(value) { return typeof value === 'boolean'; }

export function validateBlindDifficultyEvidence(evidence) {
  const errors = [];
  for (const field of DIFFICULTY_EVIDENCE_FIELDS) if (evidence?.[field] === undefined || evidence?.[field] === null || evidence?.[field] === '') errors.push(`DIFFICULTY_EVIDENCE_MISSING:${field}`);
  if (evidence?.priorReviewVisibility !== 'NONE' || evidence?.inputVisibilityProfile !== 'SOURCE_ONLY_BLIND') errors.push('DIFFICULTY_NOT_BLIND');
  if (evidence?.legacyLevel !== undefined || evidence?.currentLevel !== undefined || evidence?.currentDifficultyBucket !== undefined || evidence?.existingDifficultyBucket !== undefined || evidence?.priorDifficultyBucket !== undefined) errors.push('DIFFICULTY_ANCHOR_PRESENT');
  if (!Number.isInteger(evidence?.conceptCount) || evidence.conceptCount < 0) errors.push('DIFFICULTY_CONCEPT_COUNT_INVALID');
  if (!['low', 'medium', 'high'].includes(evidence?.conditionInterpretation)) errors.push('DIFFICULTY_CONDITION_INTERPRETATION_INVALID');
  for (const field of ['strategyChoice', 'nonRoutineTransformation', 'caseBranching', 'rangeConstraint', 'integerConstraint', 'existenceCheck', 'decisiveInsight']) if (!boolean(evidence?.[field])) errors.push(`DIFFICULTY_BOOLEAN_INVALID:${field}`);
  if (!['low', 'medium', 'high'].includes(evidence?.executionBurden)) errors.push('DIFFICULTY_EXECUTION_BURDEN_INVALID');
  return { ok: errors.length === 0, errors };
}

export function computeDifficultyBucket(evidence) {
  const validation = validateBlindDifficultyEvidence(evidence);
  if (!validation.ok) return { difficultyBucket: 'UNKNOWN', reviewStatus: 'HOLD', errors: validation.errors };
  const interpretation = { low: 0, medium: 1, high: 2 }[evidence.conditionInterpretation];
  const strategicSignal = evidence.strategyChoice || evidence.nonRoutineTransformation || evidence.caseBranching || evidence.existenceCheck || evidence.decisiveInsight || interpretation > 0 || evidence.conceptCount > 1 || evidence.rangeConstraint || evidence.integerConstraint;
  if (!strategicSignal) return { difficultyBucket: 1, reviewStatus: 'READY', errors: [] };
  let score = interpretation + Math.min(evidence.conceptCount, 3) + (evidence.strategyChoice ? 2 : 0) + (evidence.nonRoutineTransformation ? 2 : 0) + (evidence.caseBranching ? 2 : 0) + (evidence.rangeConstraint ? 1 : 0) + (evidence.integerConstraint ? 1 : 0) + (evidence.existenceCheck ? 1 : 0) + (evidence.decisiveInsight ? 3 : 0);
  if (evidence.executionBurden === 'medium') score += 1;
  if (evidence.executionBurden === 'high') score += 1;
  const highLevelEvidence = evidence.decisiveInsight && evidence.conditionInterpretation === 'high' && (evidence.strategyChoice || evidence.nonRoutineTransformation) && (evidence.caseBranching || evidence.existenceCheck || evidence.conceptCount >= 3);
  const difficultyBucket = highLevelEvidence && score >= 10 ? 5 : score <= 3 ? 2 : score <= 6 ? 3 : 4;
  return { difficultyBucket, reviewStatus: 'READY', errors: [] };
}

export function validateRepresentationRuleWitness(value, identityRecord = null, question = null) {
  const witness = value?.representationRuleWitness;
  const errors = [];
  if (value?.representationRuleApplied === true) {
    if (!witness || !witness.ruleId || !witness.predicate || !witness.inputs || !witness.sourceEvidenceHash) errors.push('REPRESENTATION_RULE_WITNESS_REQUIRED');
    if (identityRecord && question) {
      const expected = { questionUid: identityRecord.questionUid, sourceArchiveFile: normalizeSourceFile(identityRecord.sourceArchiveFile), sourceOrdinal: Number(identityRecord.sourceOrdinal), sourceFingerprint: sourceFingerprint(question), contentFingerprint: contentFingerprint(question) };
      for (const field of Object.keys(expected)) if (witness?.[field] !== expected[field]) errors.push(`REPRESENTATION_WITNESS_${field.toUpperCase()}_MISMATCH`);
      if (witness?.sourceEvidenceHash !== sha256(JSON.stringify(expected))) errors.push('REPRESENTATION_WITNESS_HASH_MISMATCH');
    }
  }
  return { ok: errors.length === 0, errors };
}

export function validateHoldEvidence(value, identityRecord = null, question = null) {
  const errors = [];
  if (value?.reviewStatus === 'HOLD') {
    if (!value.holdEvidence || !value.holdEvidence.reason || !Array.isArray(value.holdEvidence.missingEvidence) || value.holdEvidence.missingEvidence.length === 0) errors.push('HOLD_DECISIVE_EVIDENCE_REQUIRED');
    if (identityRecord && question) {
      const expected = { questionUid: identityRecord.questionUid, sourceArchiveFile: normalizeSourceFile(identityRecord.sourceArchiveFile), sourceOrdinal: Number(identityRecord.sourceOrdinal), sourceFingerprint: sourceFingerprint(question), contentFingerprint: contentFingerprint(question) };
      for (const field of Object.keys(expected)) if (value?.holdEvidence?.[field] !== expected[field]) errors.push(`HOLD_EVIDENCE_${field.toUpperCase()}_MISMATCH`);
    }
  }
  return { ok: errors.length === 0, errors };
}

export function validateIndependentRecheckRecord(record, identityRecord, question, masterBundle) {
  const errors = [];
  const binding = validateSourceBinding(identityRecord, record, question);
  errors.push(...binding.errors);
  if (record?.inputVisibilityProfile !== 'SOURCE_ONLY_BLIND' || record?.priorReviewVisibility !== 'NONE') errors.push('RECHECK_NOT_SOURCE_ONLY_BLIND');
  if (record?.firstPassEvidence !== undefined || record?.legacyLevel !== undefined || record?.currentLevel !== undefined || record?.currentDifficultyBucket !== undefined || record?.difficultyBucket !== undefined) errors.push('RECHECK_PRESELECTED_FIELDS_PRESENT');
  const semantic = record?.independentSemanticClassification;
  if (!semantic) errors.push('INDEPENDENT_SEMANTIC_PACKET_MISSING');
  else errors.push(...validateCanonicalSelection(semantic, masterBundle).errors);
  const difficulty = validateBlindDifficultyEvidence(record?.independentDifficultyEvidence);
  if (!difficulty.ok) errors.push(...difficulty.errors);
  const witness = validateRepresentationRuleWitness(record, identityRecord, question);
  errors.push(...witness.errors);
  const hold = validateHoldEvidence(record, identityRecord, question);
  errors.push(...hold.errors);
  if ((record?.status === 'RECHECK_PASS' || record?.finalDisposition === 'ACCEPTED_FOR_METADATA_APPLY') && errors.length) errors.push('RECHECK_ACCEPTANCE_EVIDENCE_INVALID');
  return { ok: errors.length === 0, errors };
}
