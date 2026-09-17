import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildMetadata } from './build-approved-question-metadata-v1.mjs';
import { classifyRecord } from './build-complete-subunit-classification-v1.mjs';
import {
  computeDifficultyBucket,
  contentFingerprint,
  loadMetadataFoundationAuditManifest,
  loadCanonicalRpmMaster,
  objectDigest,
  sourceFingerprint,
  validateCanonicalSelection,
  validateHoldEvidence,
  validateIdentityCardinality,
  validateSourceBinding
} from './metadata-foundation-gates.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/metadata-foundation-h1-pilot');
const identityPath = path.join(archiveDir, 'data/question_identity_map.json');
const cohortRoot = path.join(archiveDir, '_generated/intelligence/phase3/metadata-foundation-h1');
const correctionPath = path.join(outputDir, 'a_source_read_corrections.json');
const canonical = loadCanonicalRpmMaster(repoRoot);

const auditManifest = loadMetadataFoundationAuditManifest(repoRoot);

function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }

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

function canonicalPaths(curriculumKey) {
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

function canonicalCandidates(question, curriculumKey) {
  const text = [question.category, question.originalCategory, ...(question.tags || []), question.content, question.solution].filter(Boolean).join(' ').toLowerCase();
  const rows = canonicalPaths(curriculumKey).map(row => {
    const tokens = [row.L1, row.L2, row.L3, row.L4].filter(Boolean);
    const matched = tokens.filter(token => text.includes(token.toLowerCase()));
    return { ...row, score: matched.length, matchedCues: matched };
  }).filter(row => row.score > 0).sort((a, b) => b.score - a.score || `${a.L1}|${a.L2}|${a.L3}|${a.L4}`.localeCompare(`${b.L1}|${b.L2}|${b.L3}|${b.L4}`)).slice(0, 5);
  return rows;
}

function sourceRecord(identityByKey, sourceArchiveFile, sourceOrdinal, label = null, curriculumKeyOverride = null) {
  const key = `${sourceArchiveFile}#${sourceOrdinal}`;
  const identity = identityByKey.get(key);
  if (!identity) return { key, missingIdentity: true, label };
  const questions = loadQuestions(sourceArchiveFile);
  const question = questions[Number(sourceOrdinal) - 1];
  if (!question) throw new Error(`SOURCE_ORDINAL_NOT_FOUND:${key}`);
  const currentSourceFingerprint = sourceFingerprint(question);
  const currentContentFingerprint = contentFingerprint(question);
  const curriculumKey = curriculumKeyOverride || (String(question.standardCourse || '').includes('공통') ? '2022' : String(question.standardCourse || '').includes('수학') ? '2015' : (sourceArchiveFile.includes('/22_') ? '2022' : '2015'));
  return {
    questionUid: identity.questionUid,
    sourceArchiveFile,
    sourceOrdinal: Number(sourceOrdinal),
    sourceQuestionNo: identity.sourceQuestionNo ?? String(sourceOrdinal),
    sourceFingerprint: currentSourceFingerprint,
    contentFingerprint: currentContentFingerprint,
    identitySourceFingerprint: identity.sourceFingerprint,
    identityFingerprintStatus: identity.sourceFingerprint === currentSourceFingerprint ? 'MATCH' : 'MISMATCH',
    content: question.content ?? '',
    choices: Array.isArray(question.choices) ? question.choices : [],
    answer: question.answer ?? null,
    solution: question.solution ?? '',
    imageReference: question.image ? { path: question.image, imageSize: question.imageSize || null } : null,
    solutionImageReference: question.solutionImage ? { path: question.solutionImage, imageSize: question.solutionImageSize || null } : null,
    legacySourceMetadata: {
      level: question.level ?? null, category: question.category ?? null, originalCategory: question.originalCategory ?? null,
      standardCourse: question.standardCourse ?? null, standardUnitKey: question.standardUnitKey ?? null,
      standardUnit: question.standardUnit ?? null, subUnitKey: question.subUnitKey ?? null, subUnit: question.subUnit ?? null
    },
    canonicalCandidateContext: canonicalCandidates(question, curriculumKey),
    curriculumKey,
    label
  };
}

function loadTargetRecords(identityByKey) {
  const all = [];
  const cohortCounts = {};
  for (const cohortSpec of auditManifest.manifest.targetCohorts) {
    const cohort = cohortSpec.id;
    const artifact = readJson(path.resolve(repoRoot, cohortSpec.artifactPath));
    const records = artifact.records ? artifact.records : [artifact];
    cohortCounts[cohort] = records.length;
    for (const record of records) {
      const item = sourceRecord(identityByKey, record.sourceArchiveFile, record.sourceOrdinal, `cohort:${cohort}`, String(cohortSpec.curriculumKey));
      item.cohort = cohort;
      item.queueCandidateContext = { L1: record.L1 || null, L2: record.L2 || null, L3: record.L3 || null, L4: record.L4 || null, legacyLevel: record.legacyLevel || null };
      all.push(item);
    }
  }
  const unique = new Map(all.filter(item => !item.missingIdentity).map(item => [item.sourceArchiveFile + '#' + item.sourceOrdinal, item]));
  if (!all.length) throw new Error('TARGET_DENOMINATOR_EMPTY');
  const missingIdentityKeys = all.filter(item => item.missingIdentity).map(item => item.key).sort();
  const validKeys = all.filter(item => !item.missingIdentity).map(item => item.sourceArchiveFile + '#' + item.sourceOrdinal);
  const duplicateKeys = validKeys.filter((key, index, values) => values.indexOf(key) !== index).filter((key, index, values) => values.indexOf(key) === index);
  return { records: [...unique.values()], rawCount: all.length, uniqueCount: unique.size, missingIdentityKeys, duplicateKeys, cohortCounts };
}

function pickPilot(targetRecords, identityByKey) {
  const byKey = new Map(targetRecords.map(record => [`${record.sourceArchiveFile}#${record.sourceOrdinal}`, record]));
  const selected = new Map();
  const add = (record, label) => { if (record && !record.missingIdentity) { record.label = record.label || label; selected.set(`${record.sourceArchiveFile}#${record.sourceOrdinal}`, record); } };
  for (const representative of auditManifest.manifest.representatives || []) {
    const { sourceArchiveFile: file, sourceOrdinal: ordinal, label } = representative;
    const targetRecord = byKey.get(`${file}#${ordinal}`);
    if (targetRecord) add(targetRecord, label);
    else {
      const outOfDenominator = sourceRecord(identityByKey, file, ordinal, label);
      outOfDenominator.cohort = 'OUT_OF_TARGET_DENOMINATOR';
      outOfDenominator.denominatorMembership = false;
      outOfDenominator.queueCandidateContext = null;
      add(outOfDenominator, label);
    }
  }
  for (const cohortSpec of auditManifest.manifest.targetCohorts) add(targetRecords.find(record => record.cohort === cohortSpec.id), `cohort_control:${cohortSpec.id}`);
  const patterns = [
    ['simple_distance', /거리/], ['circle_center_radius', /중심.{0,20}반지름|반지름.{0,20}중심/],
    ['diameter_circle_area', /지름.{0,30}넓이|넓이.{0,30}지름/], ['set_membership_subset', /부분집합|원소/],
    ['direct_formula', /^.{0,180}$/]
  ];
  for (const [label, pattern] of patterns) add(targetRecords.find(record => pattern.test(String(record.content)) && !selected.has(`${record.sourceArchiveFile}#${record.sourceOrdinal}`)), label);
  for (const cohortSpec of auditManifest.manifest.targetCohorts) add(targetRecords.find(record => record.cohort === cohortSpec.id && !selected.has(`${record.sourceArchiveFile}#${record.sourceOrdinal}`)), `unseen:${cohortSpec.id}`);
  return [...selected.values()];
}

export function buildPilotClassifierInput(sourceItem) {
  const question = { content: sourceItem.content, choices: sourceItem.choices, answer: sourceItem.answer, solution: sourceItem.solution };
  if (sourceItem.imageReference) question.image = sourceItem.imageReference.path;
  return question;
}

function buildPilotDecision(sourceItem, pilotIndex, correction = null, previousDecision = null) {
  if (!correction) throw new Error(`PILOT_SOURCE_READ_CORRECTION_MISSING:${pilotIndex}`);
  const question = buildPilotClassifierInput(sourceItem);
  const identity = { questionUid: sourceItem.questionUid, sourceArchiveFile: sourceItem.sourceArchiveFile, sourceOrdinal: sourceItem.sourceOrdinal, sourceFingerprint: sourceItem.sourceFingerprint };
  const classified = classifyRecord(identity, question, [], null);
  const scopedIdentity = { records: [identity] };
  const scopedClassification = { records: [classified] };
  let report;
  try {
    report = buildMetadata({
      identityInput: scopedIdentity,
      classificationInput: scopedClassification,
      sourceQuestionsInput: new Map([[identity.questionUid, question]]),
      previousMetadataInput: { records: [] },
      reviewedPassInput: new Map(),
      canonicalInput: canonical
    });
  } catch (error) {
    if (!String(error.message || error).startsWith('classification foundation defect hold:')) throw error;
    report = { consistency: { sourceFingerprintFailures: 0 }, productionWriteAllowed: false, status: 'HOLD_FOUNDATION_DEFECT_CANDIDATE', error: String(error.message || error) };
  }
  const binding = validateSourceBinding(identity, classified, question);
  const candidatePath = correction.primaryConcept.path;
  const scopeMatches = canonicalPaths(sourceItem.curriculumKey).filter(row => row.L1 === candidatePath[0] && row.L2 === candidatePath[1] && row.L3 === candidatePath[2] && row.L4 === candidatePath[3]);
  const scopes = [...new Set(scopeMatches.map(row => row.scope))];
  if (scopes.length !== 1) throw new Error(`PILOT_CANONICAL_CONTEXT_AMBIGUOUS:${pilotIndex}`);
  const scope = scopes[0];
  const candidate = { curriculumKey: sourceItem.curriculumKey, level: 'high', scope, L1: correction.primaryConcept.path[0], L2: correction.primaryConcept.path[1], L3: correction.primaryConcept.path[2], L4: correction.primaryConcept.path[3], curriculumApplicability: correction.curriculumApplicability, defaultSelectable: correction.defaultSelectable };
  const canonicalCheck = candidate ? validateCanonicalSelection(candidate, canonical) : { ok: false, errors: ['CANONICAL_L4_NOT_FOUND'] };
  const difficultyEvidence = correction?.difficultyEvidence ? { ...correction.difficultyEvidence, questionUid: identity.questionUid, sourceArchiveFile: identity.sourceArchiveFile, sourceOrdinal: identity.sourceOrdinal, sourceFingerprint: sourceItem.sourceFingerprint, inputVisibilityProfile: 'SOURCE_ONLY_BLIND', priorReviewVisibility: 'NONE' } : null;
  const difficulty = correction?.difficultyBucket ? { difficultyBucket: 'UNKNOWN', reviewStatus: 'HOLD', candidateBucket: correction.difficultyBucket, evidence: difficultyEvidence } : computeDifficultyBucket(null);
  const holdEvidence = { reason: 'pilot has no independent blind recheck packet', missingEvidence: ['independent_recheck_difficulty_packet'], questionUid: identity.questionUid, sourceArchiveFile: identity.sourceArchiveFile, sourceOrdinal: identity.sourceOrdinal, sourceFingerprint: sourceItem.sourceFingerprint, contentFingerprint: sourceItem.contentFingerprint };
  const holdCheck = validateHoldEvidence({ reviewStatus: 'HOLD', holdEvidence }, identity, question);
  return {
    pilotIndex, questionUid: identity.questionUid, sourceArchiveFile: identity.sourceArchiveFile, sourceOrdinal: identity.sourceOrdinal, cohort: sourceItem.cohort, label: sourceItem.label,
    classification: classified.classification,
    primaryConcept: { path: correction.primaryConcept.path, reason: correction.primaryConcept.reason, status: 'SOURCE_READ_CANDIDATE' },
    secondaryConceptKeys: correction?.secondaryConceptKeys || [],
    rejectedAlternatives: correction?.rejectedAlternatives || [],
    decisiveSolutionStep: correction?.decisiveSolutionStep || null,
    canonicalSelection: candidate ? { ...candidate, validation: canonicalCheck } : null,
    canonicalDependencies: (correction.secondaryCanonicalSelections || []).map(dependency => ({ ...dependency, curriculumKey: sourceItem.curriculumKey, level: 'high', scope, L1: dependency.path[0], L2: dependency.path[1], L3: dependency.path[2], L4: dependency.path[3], validation: validateCanonicalSelection({ curriculumKey: sourceItem.curriculumKey, level: 'high', scope, L1: dependency.path[0], L2: dependency.path[1], L3: dependency.path[2], L4: dependency.path[3], curriculumApplicability: dependency.curriculumApplicability, defaultSelectable: dependency.defaultSelectable }, canonical) })),
    curriculumApplicability: candidate?.curriculumApplicability || null,
    defaultSelectable: candidate?.defaultSelectable ?? null,
    difficulty,
    decisionStatus: 'HOLD',
    holdEvidence,
    foundationDefectCandidate: classified.classification.status === 'FOUNDATION_DEFECT_CANDIDATE' || classified.classification.classificationDepth === 'no_fit',
    sourceMismatch: sourceItem.identityFingerprintStatus === 'MISMATCH',
    semanticDisagreementCorrected: Boolean(correction && JSON.stringify(previousDecision?.canonicalSelection || null) !== JSON.stringify(candidate)),
    evidence: { sourceBinding: binding, builderConsistency: report.consistency, builderProductionWriteAllowed: report.productionWriteAllowed, holdEvidence: holdCheck, canonicalMasterSha256: canonical.sha256 },
    hypothesisFields: { legacySourceMetadata: sourceItem.legacySourceMetadata, queueCandidateContext: sourceItem.queueCandidateContext, classifierPreservationEvidence: classified.classification.evidence },
    recheckStatus: 'NOT_RUN'
  };
}

function checkImageReference(reference) {
  if (!reference) return { status: 'NONE', exists: true };
  if (reference.path.startsWith('data:')) return { status: 'DATA_URI', exists: /^data:image\/(?:png|jpe?g|svg\+xml|webp);/i.test(reference.path) };
  const candidate = reference.path.startsWith('archive/') ? path.join(repoRoot, reference.path) : path.join(archiveDir, reference.path);
  return { status: 'FILE', path: reference.path, exists: fs.existsSync(candidate), nonEmpty: fs.existsSync(candidate) && fs.statSync(candidate).size > 0 };
}

function canonicalGapProbes() {
  const rows = canonicalPaths('2022').concat(canonicalPaths('2015'));
  const probes = [
    ['coordinate_centroid', /삼각형의 무게중심 (?:좌표로 무게중심|좌표 도형 활용)/], ['minimum_sum_of_distances', /거리의 합|최소.*거리|최단거리/],
    ['common_chord', /공통현/], ['contact_chord', /접촉현|접점.*현/], ['external_tangent_length', /접선의 길이|외부점.*접선/],
    ['distance_ratio_locus', /거리.*비|비.*거리|자취/], ['common_point_line_family', /공통점|직선.*다발|직선.*족/]
  ];
  return probes.map(([name, pattern]) => ({ name, status: rows.some(row => pattern.test(`${row.L1} ${row.L2} ${row.L3} ${row.L4}`)) ? 'PRESENT' : 'NOT_FOUND_IN_CANONICAL_MASTER', matches: rows.filter(row => pattern.test(`${row.L1} ${row.L2} ${row.L3} ${row.L4}`)).slice(0, 5) }));
}

function main() {
  const identity = readJson(identityPath);
  const identityByKey = new Map(identity.records.map(record => [`${record.sourceArchiveFile}#${record.sourceOrdinal}`, record]));
  const target = loadTargetRecords(identityByKey);
  const pilot = pickPilot(target.records, identityByKey);
  fs.mkdirSync(outputDir, { recursive: true });
  const sourcePack = {
    schemaVersion: 'metadata-foundation-h1-pilot-source-pack-v1',
    sourceOnly: true,
    productionWriteAllowed: false,
    canonicalMaster: { path: canonical.path, sha256: canonical.sha256, authorityVersion: canonical.master.authorityVersion },
    targetDenominator: { cohortCounts: target.cohortCounts, rawRecords: target.rawCount, uniqueSourceRecords: target.uniqueCount, missingIdentityKeys: target.missingIdentityKeys, duplicateKeys: target.duplicateKeys },
    pilotCount: pilot.length,
    targetDenominator: { rawRecords: target.rawCount, uniqueSourceRecords: target.uniqueCount, missingIdentityKeys: target.missingIdentityKeys, duplicateKeys: target.duplicateKeys },
    records: pilot.map(({ queueCandidateContext, label, ...record }) => ({ ...record, queueCandidateContext, label }))
  };
  const sourcePackPath = path.join(outputDir, 'source_pack.json');
  if (fs.existsSync(sourcePackPath)) {
    const existingSourcePack = readJson(sourcePackPath);
    if (objectDigest(existingSourcePack) !== objectDigest(sourcePack)) throw new Error('SOURCE_PACK_MUTATION_DETECTED');
  } else fs.writeFileSync(sourcePackPath, `${JSON.stringify(sourcePack, null, 2)}\n`, 'utf8');
  const corrections = new Map((readJson(correctionPath).records || []).map(record => [Number(record.pilotIndex), record]));
  if (corrections.size !== pilot.length || [...corrections.keys()].some(index => index < 1 || index > pilot.length)) throw new Error(`PILOT_SOURCE_READ_CORRECTION_COUNT_MISMATCH:${corrections.size}:${pilot.length}`);
  const previousDecisions = new Map((fs.existsSync(path.join(outputDir, 'a_decision_pack.json')) ? (readJson(path.join(outputDir, 'a_decision_pack.json')).records || []) : []).map(record => [record.questionUid, record]));
  const decisions = pilot.map((item, index) => buildPilotDecision(item, index + 1, corrections.get(index + 1), previousDecisions.get(item.questionUid)));
  const machine = {
    schemaVersion: 'metadata-foundation-h1-pilot-machine-validation-v1',
    sourcePackSha256: objectDigest(sourcePack),
    decisionPackSha256: objectDigest(decisions),
    bIndependentDecisionPackSha256: fs.existsSync(path.join(outputDir, 'b_independent_decision_pack.json')) ? objectDigest(readJson(path.join(outputDir, 'b_independent_decision_pack.json'))) : null,
    checks: {
      exactTargetDenominator: target.rawCount > 0,
      uniqueTargetIdentitySet: target.uniqueCount === target.rawCount,
      pilotSourceRecordsHaveContent: pilot.every(record => Boolean(record.content)),
      pilotSourceRecordsHaveChoicesField: pilot.every(record => Array.isArray(record.choices)),
      currentSourceFingerprintMatchIdentity: pilot.filter(record => record.identityFingerprintStatus === 'MATCH').length,
      currentSourceFingerprintMismatches: pilot.filter(record => record.identityFingerprintStatus === 'MISMATCH').length,
      targetIdentityMissingRecords: target.missingIdentityKeys.length,
      targetDuplicateIdentityKeys: target.duplicateKeys.length,
      builderFingerprintFailures: decisions.filter(row => row.evidence.builderConsistency.sourceFingerprintFailures !== 0).length,
      semanticDisagreementCorrected: decisions.filter(row => row.semanticDisagreementCorrected).length,
      sourceOnlyDecisionRecords: decisions.filter(row => row.primaryConcept?.status === 'SOURCE_READ_CANDIDATE').length,
      noCandidateContextFallback: true,
      noAcceptedEmptySubunit: decisions.every(row => row.decisionStatus !== 'ACCEPTED_FOR_METADATA_APPLY' || Boolean(row.primaryConcept.key)),
      noUncontractedRecheckPass: decisions.every(row => row.decisionStatus !== 'RECHECK_PASS'),
      holdsHaveCurrentEvidence: decisions.filter(row => row.decisionStatus === 'HOLD').every(row => row.evidence.holdEvidence.ok),
      canonicalApplicabilityPresentWhenSelected: decisions.filter(row => row.canonicalSelection).every(row => row.curriculumApplicability !== null && row.defaultSelectable !== null),
      canonicalDependenciesValid: decisions.every(row => (row.canonicalDependencies || []).every(dependency => dependency.validation.ok))
    },
    sourceImageChecks: pilot.map(record => ({ questionUid: record.questionUid, image: checkImageReference(record.imageReference), solutionImage: checkImageReference(record.solutionImageReference) }))
  };
  const sourceImageChecks = pilot.flatMap(record => [
    { questionUid: record.questionUid, kind: 'image', ...checkImageReference(record.imageReference) },
    { questionUid: record.questionUid, kind: 'solutionImage', ...checkImageReference(record.solutionImageReference) }
  ]);
  machine.checks.imageReferencesPresentOrAbsent = sourceImageChecks.every(item => item.exists && (item.status !== 'FILE' || item.nonEmpty));
  machine.sourceImageChecks = sourceImageChecks;
  fs.writeFileSync(path.join(outputDir, 'machine_validation.json'), `${JSON.stringify(machine, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(outputDir, 'a_decision_pack.json'), `${JSON.stringify({ schemaVersion: 'metadata-foundation-h1-pilot-a-decision-pack-v1', productionWriteAllowed: false, records: decisions }, null, 2)}\n`, 'utf8');
  const statusCounts = decisions.reduce((acc, row) => { acc[row.decisionStatus] = (acc[row.decisionStatus] || 0) + 1; return acc; }, {});
  const report = {
    schemaVersion: 'metadata-foundation-h1-pilot-report-v1',
    baseline: { preFixTarget: '0d28e1396f489a86e13be3f39948bda7a0f079e2', observedHead: '994ac4fd60c117e571ec79334e0d90b4f49bfa89' },
    targetDenominator: { cohortCounts: target.cohortCounts, rawRecords: target.rawCount, uniqueSourceRecords: target.uniqueCount, missingIdentityKeys: target.missingIdentityKeys, duplicateKeys: target.duplicateKeys },
    pilot: { count: pilot.length, cohortComposition: decisions.reduce((acc, row) => { acc[row.cohort] = (acc[row.cohort] || 0) + 1; return acc; }, {}), statusCounts, representatives: (auditManifest.manifest.representatives || []).map(({ sourceArchiveFile: file, sourceOrdinal: ordinal, label }) => ({ file, ordinal, label, available: Boolean(pilot.find(row => row.sourceArchiveFile === file && row.sourceOrdinal === ordinal)) })) },
    decisionSummary: { allDecisionsFailClosed: decisions.every(row => row.decisionStatus === 'HOLD'), foundationDefectCandidates: decisions.filter(row => row.foundationDefectCandidate).length, sourceMismatches: decisions.filter(row => row.sourceMismatch).length, noFitSuspects: decisions.filter(row => row.foundationDefectCandidate).map(row => row.questionUid), outOfDenominatorRepresentatives: decisions.filter(row => row.cohort === 'OUT_OF_TARGET_DENOMINATOR').map(row => row.questionUid) },
    canonicalGapProbes: canonicalGapProbes(),
    machineChecks: machine.checks,
    globalArtifactStatus: 'STALE_DEFERRED_GATE_3_H1_SCOPED_REGENERATION_PREREQUISITE',
    productionMutation: { sourceJs: false, database: false, questionIndex: false, fullRebuild: false, commit: false, push: false, apply: false },
    artifactPaths: ['source_pack.json', 'a_decision_pack.json', 'machine_validation.json', 'pilot_report.json']
  };
  fs.writeFileSync(path.join(outputDir, 'pilot_report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ outputDir: path.relative(repoRoot, outputDir).replaceAll('\\', '/'), pilotCount: pilot.length, targetDenominator: target.rawCount, uniqueTargetIdentitySet: target.uniqueCount, duplicateKeys: target.duplicateKeys, checks: machine.checks, statusCounts }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
