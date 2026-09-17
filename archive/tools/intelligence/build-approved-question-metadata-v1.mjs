import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import {
    computeDifficultyBucket,
    DIFFICULTY_BUCKETS,
    isRegisteredTestFixtureSource,
    loadFixtureAllowlist,
    loadCanonicalRpmMaster,
    normalizeSourceFile,
    objectDigest,
    validateCanonicalSelection,
    validateBlindDifficultyEvidence,
    validateHoldEvidence,
    validateIdentityCardinality,
    validateIndependentRecheckRecord,
    validateRepresentationRuleWitness,
    validateSourceBinding
} from './metadata-foundation-gates.mjs';

/**
 * Build the approved Phase 1B metadata sidecar.
 *
 * This builder deliberately promotes only evidence already accepted by the
 * archive classification output or a semantic-review ledger with
 * `reviewed_pass`. Candidate-only tags remain explicit review holds.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const identityPath = path.join(archiveDir, 'data', 'question_identity_map.json');
const classificationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'complete-subunit-classification', 'archive-complete-subunit-classification-v1.json');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'review');
const outputJsonPath = path.join(archiveDir, 'data', 'question_metadata.json');
const outputRuntimePath = path.join(archiveDir, 'question-meta.js');
const tagMasterPath = path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json');
const revision = 'archive-metadata-v1-phase1b-20260825';

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function makeSourceFingerprint(question) {
    return sha256(JSON.stringify({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        answer: question?.answer ?? null,
        solution: question?.solution ?? null,
        image: question?.image ?? null
    }));
}

function makeContentFingerprint(question) {
    return sha256(JSON.stringify({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        image: question?.image ?? null
    }));
}

function normalizeFile(value) {
    return normalizeSourceFile(value);
}

function readArchiveQuestions(fullPath) {
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(fullPath, 'utf8'), context, { filename: fullPath, timeout: 1500 });
    const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
    if (!Array.isArray(questions)) throw new Error(`questions array not found: ${fullPath}`);
    return questions;
}

function readSourceQuestionMap(identity) {
    const byUid = new Map();
    const files = new Map();
    for (const record of identity.records) {
        const sourceFile = normalizeFile(record.sourceArchiveFile);
        if (!files.has(sourceFile)) files.set(sourceFile, []);
        files.get(sourceFile).push(record);
    }
    for (const [sourceFile, records] of files) {
        const questions = readArchiveQuestions(path.join(archiveDir, 'exams', sourceFile));
        for (const record of records) {
            const question = questions[Number(record.sourceOrdinal) - 1];
            if (!question) throw new Error(`source join failed: ${sourceFile}#${record.sourceOrdinal}`);
            byUid.set(record.questionUid, question);
        }
    }
    return byUid;
}

function readReviewedPassOverrides() {
    const overrides = new Map();
    for (const file of fs.readdirSync(reviewDir).filter(name => name.endsWith('.json'))) {
        const report = JSON.parse(fs.readFileSync(path.join(reviewDir, file), 'utf8'));
        for (const item of report.reviews || []) {
            if (item.review?.disposition !== 'reviewed_pass') continue;
            if (overrides.has(item.questionUid)) throw new Error(`duplicate reviewed_pass UID: ${item.questionUid}`);
            const candidate = item.candidate || {};
            overrides.set(item.questionUid, {
                questionUid: item.questionUid,
                subUnitKey: String(candidate.subUnitKeyCandidate || '').trim(),
                subUnit: String(candidate.subUnitCandidate || '').trim(),
                conceptClusterKey: String(candidate.conceptClusterKeyCandidate || '').trim(),
                problemTypeKey: String(candidate.problemTypeKeyCandidate || '').trim(),
                templateKey: String(candidate.templateKeyCandidate || '').trim(),
                difficultyBucket: String(candidate.difficultyBucketCandidate || '').trim(),
                sourceArchiveFile: item.sourceArchiveFile,
                sourceOrdinal: item.sourceOrdinal,
                sourceFingerprint: item.sourceFingerprint,
                curriculumKey: candidate.curriculumKey || item.curriculumKey,
                L1: candidate.L1 || item.L1,
                L2: candidate.L2 || item.L2,
                L3: candidate.L3 || item.L3,
                L4: candidate.L4 || item.L4,
                curriculumApplicability: candidate.curriculumApplicability || item.curriculumApplicability,
                defaultSelectable: candidate.defaultSelectable ?? item.defaultSelectable,
                difficultyEvidence: candidate.difficultyEvidence || item.difficultyEvidence || null,
                independentRecheckEvidence: item.independentRecheckEvidence || candidate.independentRecheckEvidence || null,
                independentRecheck: item.independentRecheck || candidate.independentRecheck || null,
                representationRuleApplied: candidate.representationRuleApplied ?? item.representationRuleApplied,
                representationRuleWitness: candidate.representationRuleWitness || item.representationRuleWitness,
                reviewStatus: item.reviewStatus,
                holdEvidence: item.holdEvidence || candidate.holdEvidence,
                reviewSource: `archive/_generated/intelligence/phase1/pilot/review/${file}`
            });
        }
    }
    return overrides;
}

function nonEmpty(value) {
    return value !== undefined && value !== null && String(value).trim() !== '';
}

function pick(...values) {
    return values.find(nonEmpty) ?? '';
}

function readCanonicalSubUnitLabels() {
    const master = JSON.parse(fs.readFileSync(tagMasterPath, 'utf8'));
    const labels = {};
    for (const row of Array.isArray(master) ? master : []) {
        const key = String(row?.subUnitKey || row?.key || '').trim();
        const label = String(row?.subUnit || row?.labelKo || '').trim();
        if (row?.keyType !== 'subUnitKey' || !key || !label) continue;
        labels[key] = label;
    }
    if (!Object.keys(labels).length) throw new Error('canonical subunit label map is empty');
    return labels;
}

export function validateClassificationArtifactBinding(identityRecord, classified, question) {
    return validateSourceBinding(identityRecord, classified, question);
}

export function validateReviewedMetadataPromotion(reviewed, identityRecord, question, canonical) {
    const errors = [];
    const binding = validateSourceBinding(identityRecord, reviewed, question);
    errors.push(...binding.errors);
    const recheckPacket = reviewed.independentRecheck || reviewed.independentRecheckEvidence || reviewed;
    const recheck = validateIndependentRecheckRecord(recheckPacket, identityRecord, question, canonical);
    errors.push(...recheck.errors);
    const evidence = { ...reviewed, ...recheckPacket };
    errors.push(...validateRepresentationRuleWitness(evidence, identityRecord, question).errors);
    errors.push(...validateHoldEvidence(evidence, identityRecord, question).errors);
    if (reviewed.difficultyEvidence && recheckPacket.independentDifficultyEvidence && objectDigest(reviewed.difficultyEvidence) !== objectDigest(recheckPacket.independentDifficultyEvidence)) errors.push('DIFFICULTY_EVIDENCE_DIGEST_MISMATCH');
    return { ok: errors.length === 0, errors };
}

function buildMetadata({ identityInput = null, classificationInput = null, previousMetadataInput = undefined, reviewedPassInput = null, sourceQuestionsInput = null, canonicalInput = null } = {}) {
    const identityRaw = identityInput ? JSON.stringify(identityInput) : fs.readFileSync(identityPath, 'utf8');
    const classificationRaw = classificationInput ? JSON.stringify(classificationInput) : fs.readFileSync(classificationPath, 'utf8');
    const identity = identityInput || JSON.parse(identityRaw);
    const classification = classificationInput || JSON.parse(classificationRaw);
    const canonical = canonicalInput || loadCanonicalRpmMaster(repoRoot);
    const fixtureAllowlist = loadFixtureAllowlist(repoRoot);
    // Rebuilding the current sidecar must not erase previously approved
    // semantic fields for unchanged source questions.  The source JS remains
    // authoritative for production fields; the prior sidecar is only a
    // carry-forward for fields that are absent from the current source and
    // whose source fingerprint is unchanged.
    const previousMetadata = previousMetadataInput !== undefined ? previousMetadataInput : (fs.existsSync(outputJsonPath)
        ? JSON.parse(fs.readFileSync(outputJsonPath, 'utf8'))
        : null);
    const previousByUid = new Map((previousMetadata?.records || []).map(record => [record.questionUid, record]));
    if (!Array.isArray(identity.records) || !Array.isArray(classification.records)) throw new Error('identity/classification records missing');
    const sourceQuestions = sourceQuestionsInput || readSourceQuestionMap(identity);
    const canonicalSubUnitLabels = readCanonicalSubUnitLabels();
    const cardinality = validateIdentityCardinality(identity.records, classification.records, { fixtureAllowlist: fixtureAllowlist.paths });
    if (!cardinality.ok) throw new Error(`metadata cardinality gate failed: ${cardinality.errors.join(',')}`);
    const productionIdentityRecords = identity.records.filter(record => !isRegisteredTestFixtureSource(record.sourceArchiveFile, fixtureAllowlist.paths));
    const productionClassificationRecords = classification.records.filter(record => !isRegisteredTestFixtureSource(record.sourceArchiveFile, fixtureAllowlist.paths));
    const classificationByUid = new Map(productionClassificationRecords.map(record => [record.questionUid, record]));
    const reviewedPass = reviewedPassInput || readReviewedPassOverrides();
    const records = [];
    const sourceByKey = new Map();
    const sourceFingerprintFailures = [];
    const sourceClassificationConflicts = [];
    const staleReviewedConflicts = [];

    const canonicalSelectionFailures = [];
    for (const identityRecord of productionIdentityRecords) {
        const uid = identityRecord.questionUid;
        // Test fixtures remain in the identity/runtime regression corpus but
        // are intentionally outside the production classification snapshot.
        // Keep them in the sidecar with explicit empty metadata; a missing
        // classification for a real archive question must still block build.
        const classified = classificationByUid.get(uid) || (
            isRegisteredTestFixtureSource(identityRecord.sourceArchiveFile, fixtureAllowlist.paths)
                ? { standardUnitKey: '', standardUnit: '', classification: {} }
                : null
        );
        const question = sourceQuestions.get(uid);
        if (!classified || !question) throw new Error(`metadata join failed: ${uid}`);
        const classificationBinding = validateClassificationArtifactBinding(identityRecord, classified, question);
        if (!classificationBinding.ok) sourceFingerprintFailures.push({ questionUid: uid, artifact: 'classification', errors: classificationBinding.errors });
        const classificationData = classified.classification || {};
        if (classificationData.status === 'FOUNDATION_DEFECT_CANDIDATE' || classificationData.classificationDepth === 'no_fit') throw new Error(`classification foundation defect hold: ${uid}`);
        const reviewed = reviewedPass.get(uid);
        if (reviewed) {
            const reviewPromotion = validateReviewedMetadataPromotion(reviewed, identityRecord, question, canonical);
            if (!reviewPromotion.ok) throw new Error(`reviewed metadata promotion gate failed: ${uid}:${reviewPromotion.errors.join(',')}`);
        }
        const sourceFingerprint = makeSourceFingerprint(question);
        const previous = previousByUid.get(uid);
        const previousMatchesSource = Boolean(previous && previous.sourceFingerprint === sourceFingerprint);
        const carryForward = previousMatchesSource ? previous : null;
        if (identityRecord.sourceFingerprint && identityRecord.sourceFingerprint !== sourceFingerprint) {
            sourceFingerprintFailures.push({
                questionUid: uid,
                sourceArchiveFile: normalizeFile(identityRecord.sourceArchiveFile),
                sourceOrdinal: Number(identityRecord.sourceOrdinal),
                identityFingerprint: identityRecord.sourceFingerprint,
                currentFingerprint: sourceFingerprint
            });
        }
        const standardUnitKey = pick(question.standardUnitKey, classified.standardUnitKey);
        const standardUnit = pick(question.standardUnit, classified.standardUnit);
        const standardCourse = pick(question.standardCourse, question.course, classified.standardCourse);
        const sourceSubUnitKey = pick(question.subUnitKey, question.sub_unit_key);
        const sourceSubUnit = pick(question.subUnit, question.sub_unit);
        const classifiedSubUnitKey = pick(classificationData.subUnitKey);
        const classifiedSubUnit = pick(classificationData.subUnit);
        const reviewedSubUnitKey = pick(reviewed?.subUnitKey);
        const reviewedSubUnit = pick(reviewed?.subUnit);
        if (sourceSubUnitKey && classifiedSubUnitKey && sourceSubUnitKey !== classifiedSubUnitKey) {
            sourceClassificationConflicts.push({ questionUid: uid, field: 'subUnitKey', source: sourceSubUnitKey, classification: classifiedSubUnitKey });
        }
        if (sourceSubUnit && classifiedSubUnit && sourceSubUnit !== classifiedSubUnit) {
            sourceClassificationConflicts.push({ questionUid: uid, field: 'subUnit', source: sourceSubUnit, classification: classifiedSubUnit });
        }
        if (sourceSubUnitKey && reviewedSubUnitKey && sourceSubUnitKey !== reviewedSubUnitKey) {
            staleReviewedConflicts.push({ questionUid: uid, field: 'subUnitKey', source: sourceSubUnitKey, reviewed: reviewedSubUnitKey });
        }
        if (sourceSubUnit && reviewedSubUnit && sourceSubUnit !== reviewedSubUnit) {
            staleReviewedConflicts.push({ questionUid: uid, field: 'subUnit', source: sourceSubUnit, reviewed: reviewedSubUnit });
        }
        // Production values are authoritative.  Classification/review values
        // may fill a blank, but may never overwrite production.
        const subUnitKey = pick(sourceSubUnitKey, reviewedSubUnitKey, classifiedSubUnitKey);
        const subUnit = pick(sourceSubUnit, reviewedSubUnit, classifiedSubUnit);
        const conceptClusterKey = pick(question.conceptClusterKey, reviewed?.conceptClusterKey, carryForward?.conceptClusterKey, classificationData.conceptClusterKey);
        const problemTypeKey = pick(reviewed?.problemTypeKey, question.problemTypeKey, question.typeKey, carryForward?.problemTypeKey);
        const templateKey = pick(reviewed?.templateKey, question.templateKey, carryForward?.templateKey);
        const recheckPacket = reviewed?.independentRecheck || reviewed?.independentRecheckEvidence || null;
        const difficultyEvidence = reviewed ? (recheckPacket?.independentDifficultyEvidence || null) : null;
        if (reviewed?.difficultyEvidence && difficultyEvidence && objectDigest(reviewed.difficultyEvidence) !== objectDigest(difficultyEvidence)) throw new Error(`difficulty evidence digest mismatch: ${uid}`);
        if (difficultyEvidence) {
            const difficultyBinding = validateSourceBinding(identityRecord, difficultyEvidence, question);
            if (!difficultyBinding.ok) throw new Error(`difficulty evidence binding failed: ${uid}:${difficultyBinding.errors.join(',')}`);
            const difficultyEvidenceValidation = validateBlindDifficultyEvidence(difficultyEvidence);
            if (!difficultyEvidenceValidation.ok) throw new Error(`difficulty evidence invalid: ${uid}:${difficultyEvidenceValidation.errors.join(',')}`);
        }
        const difficultyDecision = computeDifficultyBucket(difficultyEvidence);
        const difficultyBucket = difficultyDecision.difficultyBucket;
        const semanticallyReviewed = Boolean(reviewed && (reviewed.independentRecheck || reviewed.independentRecheckEvidence) && (reviewed.problemTypeKey || reviewed.templateKey || reviewed.conceptClusterKey));
        const sourceMetadataVerification = sourceSubUnitKey ? 'PRESERVED_SOURCE_UNVERIFIED' : (semanticallyReviewed ? 'INDEPENDENT_SEMANTIC_VERIFIED' : 'UNVERIFIED');
        const canonicalSelection = value => value?.canonicalSelection || value?.classification || value || null;
        const hasCanonicalSelection = value => Boolean(value && ['curriculumKey', 'L1', 'L2', 'L3', 'L4', 'curriculumApplicability', 'defaultSelectable'].some(field => value[field] !== undefined && value[field] !== null && value[field] !== ''));
        const sourceSelection = canonicalSelection(question);
        const classificationSelection = canonicalSelection({ ...classified, ...(classified.classification || {}) });
        const reviewedSelection = canonicalSelection(reviewed);
        const carryForwardSelection = canonicalSelection(carryForward);
        for (const [origin, value] of [['source', sourceSelection], ['classification', classificationSelection], ['reviewed', reviewedSelection], ['carry-forward', carryForwardSelection]]) {
            if (!hasCanonicalSelection(value)) continue;
            const canonicalResult = validateCanonicalSelection(value, canonical);
            if (!canonicalResult.ok) canonicalSelectionFailures.push({ questionUid: uid, origin, errors: canonicalResult.errors });
        }
        const selectedCanonical = reviewed?.L1 ? {
            curriculumKey: reviewed.curriculumKey,
            L1: reviewed.L1,
            L2: reviewed.L2,
            L3: reviewed.L3,
            L4: reviewed.L4,
            curriculumApplicability: reviewed.curriculumApplicability,
            defaultSelectable: reviewed.defaultSelectable
        } : (question?.L1 ? {
            curriculumKey: question.curriculumKey,
            L1: question.L1,
            L2: question.L2,
            L3: question.L3,
            L4: question.L4,
            curriculumApplicability: question.curriculumApplicability,
            defaultSelectable: question.defaultSelectable
        } : (classified?.L1 ? {
            curriculumKey: classified.curriculumKey,
            L1: classified.L1,
            L2: classified.L2,
            L3: classified.L3,
            L4: classified.L4,
            curriculumApplicability: classified.curriculumApplicability,
            defaultSelectable: classified.defaultSelectable
        } : (carryForward?.L1 ? {
            curriculumKey: carryForward.curriculumKey,
            L1: carryForward.L1,
            L2: carryForward.L2,
            L3: carryForward.L3,
            L4: carryForward.L4,
            curriculumApplicability: carryForward.curriculumApplicability,
            defaultSelectable: carryForward.defaultSelectable
        } : null)));
        const derivedFieldStatus = {
            standardUnit: 'approved_source',
            subUnit: sourceSubUnitKey || sourceSubUnit ? 'preserved_unverified' : (semanticallyReviewed ? 'approved_semantic_review' : 'approved_classification'),
            concept: semanticallyReviewed ? 'approved_semantic_review' : 'approved_classification',
            problemType: problemTypeKey ? (semanticallyReviewed ? 'approved_semantic_review' : 'approved_source') : 'manual_review_pending',
            template: templateKey ? (semanticallyReviewed ? 'approved_semantic_review' : 'approved_source') : 'manual_review_pending',
            difficulty: DIFFICULTY_BUCKETS.includes(difficultyBucket) ? 'approved_source' : 'manual_review_pending'
        };
        const fieldStatus = {
            ...(carryForward?.fieldStatus && !reviewed ? carryForward.fieldStatus : derivedFieldStatus),
            ...(sourceMetadataVerification === 'PRESERVED_SOURCE_UNVERIFIED' ? { subUnit: 'preserved_unverified' } : {})
        };
        const record = {
            questionUid: uid,
            sourceArchiveFile: normalizeFile(identityRecord.sourceArchiveFile),
            sourceOrdinal: Number(identityRecord.sourceOrdinal),
            sourceQuestionNo: identityRecord.sourceQuestionNo ?? null,
            sourceFingerprint,
            contentFingerprint: makeContentFingerprint(question),
            standardCourse,
            standardUnitKey,
            standardUnit,
            ...(selectedCanonical?.curriculumKey ? { curriculumKey: selectedCanonical.curriculumKey } : (carryForward?.curriculumKey ? { curriculumKey: carryForward.curriculumKey } : {})),
            ...(carryForward?.courseKey ? { courseKey: carryForward.courseKey } : {}),
            ...(selectedCanonical?.L1 ? { L1: selectedCanonical.L1 } : {}),
            ...(selectedCanonical?.L2 ? { L2: selectedCanonical.L2 } : {}),
            ...(selectedCanonical?.L3 ? { L3: selectedCanonical.L3 } : {}),
            ...(selectedCanonical?.L4 ? { L4: selectedCanonical.L4 } : {}),
            ...(Array.isArray(carryForward?.secondaryConceptKeys) ? { secondaryConceptKeys: carryForward.secondaryConceptKeys } : {}),
            ...(selectedCanonical?.curriculumApplicability ? { curriculumApplicability: selectedCanonical.curriculumApplicability } : {}),
            ...(selectedCanonical?.defaultSelectable !== undefined ? { defaultSelectable: selectedCanonical.defaultSelectable } : {}),
            subUnitKey,
            subUnit,
            conceptClusterKey,
            problemTypeKey,
            templateKey,
            difficultyBucket,
            difficultyConfidence: difficultyDecision.reviewStatus === 'READY' ? 'medium' : 'low',
            difficultyEvidence,
            sourceMetadataVerification,
            sourceStandardUnitKey: standardUnitKey,
            sourceSubUnitKey,
            ...(recheckPacket?.representationRuleApplied !== undefined ? { representationRuleApplied: recheckPacket.representationRuleApplied } : (reviewed?.representationRuleApplied !== undefined ? { representationRuleApplied: reviewed.representationRuleApplied } : {})),
            ...(recheckPacket?.representationRuleWitness ? { representationRuleWitness: recheckPacket.representationRuleWitness } : (reviewed?.representationRuleWitness ? { representationRuleWitness: reviewed.representationRuleWitness } : {})),
            tagConfidence: carryForward?.tagConfidence && !reviewed ? carryForward.tagConfidence : (semanticallyReviewed ? 'high' : String(classificationData.confidence || 'rule_inferred')),
            tagStatus: carryForward?.tagStatus && !reviewed ? carryForward.tagStatus : (semanticallyReviewed ? 'approved_semantic_review' : 'approved_subunit_concept_partial'),
            ...(carryForward?.reviewStatus ? { reviewStatus: carryForward.reviewStatus } : {}),
            metadataStatus: sourceMetadataVerification === 'PRESERVED_SOURCE_UNVERIFIED' ? 'pending_semantic_verification' : (semanticallyReviewed ? 'approved_semantic_review' : 'approved_partial_with_explicit_holds'),
            fieldStatus,
            metadataRevision: revision,
            approvalEvidence: carryForward?.approvalEvidence && !reviewed
                ? carryForward.approvalEvidence
                : (semanticallyReviewed ? [reviewed.reviewSource] : ['archive/_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-classification-v1.json'])
        };
        if (difficultyDecision.reviewStatus === 'HOLD') record.reviewStatus = 'HOLD';
        if (difficultyDecision.reviewStatus === 'HOLD') {
            record.holdEvidence = {
                reason: 'blind difficulty evidence missing or invalid',
                missingEvidence: difficultyDecision.errors.length ? difficultyDecision.errors : ['blind_difficulty_evidence'],
                questionUid: identityRecord.questionUid,
                sourceArchiveFile: normalizeFile(identityRecord.sourceArchiveFile),
                sourceOrdinal: Number(identityRecord.sourceOrdinal),
                sourceFingerprint,
                contentFingerprint: makeContentFingerprint(question)
            };
        }
        const recordHold = validateHoldEvidence(record, identityRecord, question);
        if (!recordHold.ok) throw new Error(`HOLD evidence gate failed: ${uid}:${recordHold.errors.join(',')}`);
        const recordRepresentation = validateRepresentationRuleWitness(record, identityRecord, question);
        if (!recordRepresentation.ok) throw new Error(`representation evidence gate failed: ${uid}:${recordRepresentation.errors.join(',')}`);
        records.push(record);
        const sourceKey = `${record.sourceArchiveFile}#${record.sourceOrdinal}`;
        if (sourceByKey.has(sourceKey)) throw new Error(`duplicate source metadata key: ${sourceKey}`);
        sourceByKey.set(sourceKey, record);
    }

    records.sort((a, b) => a.questionUid.localeCompare(b.questionUid, 'en'));
    const counts = {
        records: records.length,
        uidUnique: new Set(records.map(record => record.questionUid)).size === records.length,
        sourceJoinUnique: sourceByKey.size === records.length,
        semanticallyReviewed: records.filter(record => record.metadataStatus === 'approved_semantic_review').length,
        explicitProblemTypeHolds: records.filter(record => record.fieldStatus.problemType === 'manual_review_pending').length,
        explicitTemplateHolds: records.filter(record => record.fieldStatus.template === 'manual_review_pending').length,
        explicitDifficultyHolds: records.filter(record => record.fieldStatus.difficulty === 'manual_review_pending').length
    };
    const productionWriteAllowed = records.length > 0 && records.every(record => record.sourceMetadataVerification === 'INDEPENDENT_SEMANTIC_VERIFIED' && DIFFICULTY_BUCKETS.includes(record.difficultyBucket) && record.reviewStatus !== 'HOLD');
    if (counts.records !== productionIdentityRecords.length || !counts.uidUnique || !counts.sourceJoinUnique) throw new Error('metadata cardinality gate failed');
    if (sourceFingerprintFailures.length || sourceClassificationConflicts.length) {
        throw new Error(`metadata approval blocked: ${JSON.stringify({ sourceFingerprintFailures: sourceFingerprintFailures.length, sourceClassificationConflicts: sourceClassificationConflicts.length, conflictSample: sourceClassificationConflicts.slice(0, 5) })}`);
    }
    if (canonicalSelectionFailures.length) throw new Error(`canonical RPM selection gate failed: ${JSON.stringify(canonicalSelectionFailures.slice(0, 5))}`);
    const stable = {
        schemaVersion: 'archive-question-metadata-v1',
        metadataRevision: revision,
        generatedAt: new Date().toISOString(),
        approvalStatus: productionWriteAllowed ? 'APPROVED_SEMANTIC_RECHECKED' : 'APPROVED_PARTIAL_WITH_EXPLICIT_HOLDS',
        productionWriteAllowed,
        promotionPolicy: {
            candidateOnlyTagsPromoted: false,
            reviewedPassOnlyForSemanticTags: true,
            unknownFieldsRemainExplicit: true,
            sourceJsWrites: false,
            databaseWrites: false
        },
        sourceDigests: {
            identityMap: sha256(JSON.stringify(productionIdentityRecords)),
            completeClassification: sha256(classificationRaw),
            tagMaster: sha256(fs.readFileSync(tagMasterPath, 'utf8'))
        },
        canonicalSubUnitLabels,
        consistency: {
            sourceFingerprintFailures: sourceFingerprintFailures.length,
            sourceClassificationConflicts: sourceClassificationConflicts.length,
            staleReviewedConflicts: staleReviewedConflicts.length,
            productionValuesWinOnMerge: true
        },
        reviewedPassCount: reviewedPass.size,
            counts: { ...counts, excludedFixtureIdentityCount: cardinality.excludedFixtureIdentityCount, excludedFixtureClassificationCount: cardinality.excludedFixtureClassificationCount },
        records
    };
    return { ...stable, digest: sha256(JSON.stringify(stable)) };
}

function runtimeSourceLegacy(report) {
    return `// Generated by archive/tools/intelligence/build-approved-question-metadata-v1.mjs\n(function(){\n  const state = { data: null, byUid: new Map(), bySource: new Map() };\n  function sourceFile(value) { return String(value || '').replace(/\\\\/g, '/').replace(/^\\.?\\/?archive\\/exams\\//, '').replace(/^\\.?\\/?exams\\//, '').replace(/^\\/+/, '').replace(/[?#].*$/, '').trim(); }\n  function get(questionUidInput, sourceFileInput, ordinal) {\n    const questionUid = String(questionUidInput || '').trim();\n    if (questionUid && state.byUid.has(questionUid)) return state.byUid.get(questionUid);\n    const file = sourceFile(sourceFileInput);\n    const n = Number(ordinal);\n    if (file && Number.isInteger(n) && n > 0) return state.bySource.get(file + '#' + n) || null;\n    return null;\n  }\n  window.getArchiveQuestionMetadata = function(ref) {\n    const value = ref || {};\n    return get(value.questionUid || value.sourceQuestionUid, value.sourceArchiveFile || value.sourceFile, value.sourceOrdinal || value.sourceQuestionOrdinal);\n  };\n  window.mergeArchiveQuestionMetadata = function(question, ref) {\n    const q = question || {};\n    const meta = window.getArchiveQuestionMetadata(ref);\n    if (!meta) return q;\n    const merged = { ...q };\n    for (const field of ['standardCourse','standardUnitKey','standardUnit','subUnitKey','subUnit','conceptClusterKey','problemTypeKey','templateKey','difficultyBucket','tagConfidence','tagStatus','metadataStatus','metadataRevision']) {\n      if (meta[field] !== undefined && meta[field] !== null && String(meta[field]).trim() !== '') merged[field] = meta[field];\n    }\n    merged._archiveMetadata = meta;\n    return merged;\n  };\n  window.__ARCHIVE_METADATA_READY__ = fetch(new URL('data/question_metadata.json', document.baseURI))\n    .then(response => { if (!response.ok) throw new Error('metadata sidecar HTTP ' + response.status); return response.json(); })\n    .then(data => {\n      state.data = data;\n      for (const record of data.records || []) {\n        state.byUid.set(record.questionUid, record);\n        state.bySource.set(record.sourceArchiveFile + '#' + record.sourceOrdinal, record);\n      }\n      window.ARCHIVE_QUESTION_METADATA = data;\n      return data;\n    })\n    .catch(error => { console.warn('[metadata] approved sidecar load failed:', error); return null; });\n})();\n`;
}

function runtimeSource(report) {
    return `// Generated by archive/tools/intelligence/build-approved-question-metadata-v1.mjs
(function(){
  const state = { data: null, byUid: new Map(), bySource: new Map() };
  const requiredRecordFields = ['questionUid','sourceArchiveFile','sourceOrdinal','sourceFingerprint','contentFingerprint','curriculumKey','L1','L2','L3','L4','curriculumApplicability','defaultSelectable','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','sourceMetadataVerification'];
  function isPromotableData(data) {
    return Boolean(data && data.productionWriteAllowed === true && data.approvalStatus === 'APPROVED_SEMANTIC_RECHECKED' && Array.isArray(data.records) && data.records.length > 0 && data.records.every(record => requiredRecordFields.every(field => record[field] !== undefined && record[field] !== null && record[field] !== '') && record.sourceMetadataVerification === 'INDEPENDENT_SEMANTIC_VERIFIED' && Number.isInteger(record.difficultyBucket) && record.difficultyBucket >= 1 && record.difficultyBucket <= 5 && record.reviewStatus !== 'HOLD'));
  }
  const canonicalSubUnitLabels = Object.freeze(${JSON.stringify(report.canonicalSubUnitLabels)});
  window.ARCHIVE_SUBUNIT_LABELS = canonicalSubUnitLabels;
  window.getArchiveSubUnitLabel = function(key, fallback) {
    const normalizedKey = String(key || '').trim();
    return String(canonicalSubUnitLabels[normalizedKey] || fallback || '').trim();
  };
  function sourceFile(value) { return String(value || '').replace(/\\\\/g, '/').replace(/^\\.?\\/?archive\\/exams\\//, '').replace(/^\\.?\\/?exams\\//, '').replace(/^\\/+/, '').replace(/[?#].*$/, '').trim(); }
  function get(questionUidInput, sourceFileInput, ordinal) {
    if (!state.data) return null;
    const questionUid = String(questionUidInput || '').trim();
    if (questionUid && state.byUid.has(questionUid)) return state.byUid.get(questionUid);
    const file = sourceFile(sourceFileInput);
    const n = Number(ordinal);
    if (file && Number.isInteger(n) && n > 0) return state.bySource.get(file + '#' + n) || null;
    return null;
  }
  window.getArchiveQuestionMetadata = function(ref) {
    const value = ref || {};
    return get(value.questionUid || value.sourceQuestionUid, value.sourceArchiveFile || value.sourceFile, value.sourceOrdinal || value.sourceQuestionOrdinal);
  };
  window.mergeArchiveQuestionMetadata = function(question, ref) {
    const q = question || {};
    const meta = window.getArchiveQuestionMetadata(ref);
    if (!meta) return q;
    const merged = { ...q };
    const conflicts = {};
    for (const field of ['curriculumKey','courseKey','L1','L2','L3','L4','secondaryConceptKeys','curriculumApplicability','defaultSelectable','standardCourse','standardUnitKey','standardUnit','sourceStandardUnitKey','subUnitKey','subUnit','sourceSubUnitKey','sourceMetadataVerification','conceptClusterKey','problemTypeKey','templateKey','difficultyBucket','difficultyEvidence','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','tagConfidence','tagStatus','reviewStatus','metadataStatus','metadataRevision']) {
      const sourceValue = merged[field];
      const metadataValue = meta[field];
      const sourceText = sourceValue === undefined || sourceValue === null ? '' : String(sourceValue).trim();
      const metadataText = metadataValue === undefined || metadataValue === null ? '' : String(metadataValue).trim();
      if (!sourceText && metadataText) merged[field] = metadataValue;
      else if (sourceText && metadataText && sourceText !== metadataText) conflicts[field] = { source: sourceValue, metadata: metadataValue };
    }
    merged._archiveMetadata = meta;
    if (Object.keys(conflicts).length) {
      merged._archiveMetadataConflicts = conflicts;
      merged._archiveMetadataMergeStatus = 'SOURCE_CONFLICT_HOLD';
    }
    return merged;
  };
  window.__ARCHIVE_METADATA_READY__ = fetch(new URL('data/question_metadata.json', document.baseURI))
    .then(response => { if (!response.ok) throw new Error('metadata sidecar HTTP ' + response.status); return response.json(); })
    .then(data => {
      if (!isPromotableData(data)) return null;
      state.data = data;
      for (const record of data.records || []) {
        state.byUid.set(record.questionUid, record);
        state.bySource.set(record.sourceArchiveFile + '#' + record.sourceOrdinal, record);
      }
      window.ARCHIVE_QUESTION_METADATA = data;
      return data;
    })
    .catch(error => { console.warn('[metadata] approved sidecar load failed:', error); return null; });
})();
`;
}

export { buildMetadata };

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    const report = buildMetadata();
    fs.mkdirSync(path.dirname(outputJsonPath), { recursive: true });
    fs.writeFileSync(outputJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(outputRuntimePath, runtimeSource(report), 'utf8');
    console.log(JSON.stringify({
        json: path.relative(repoRoot, outputJsonPath).replaceAll('\\', '/'),
        runtime: path.relative(repoRoot, outputRuntimePath).replaceAll('\\', '/'),
        digest: report.digest,
        counts: report.counts,
        reviewedPassCount: report.reviewedPassCount,
        approvalStatus: report.approvalStatus
    }, null, 2));
}
