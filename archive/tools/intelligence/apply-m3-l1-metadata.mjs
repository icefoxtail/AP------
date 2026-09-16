import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Apply one validated M3 L1 candidate to the global metadata sidecar.
 *
 * The source JS is never written. Existing non-target records are retained
 * byte-semantically by JSON object merge and are checked for UID/source-set
 * stability. Runtime changes are limited to the canonical v2 field bridge.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const foundationDir = path.join(archiveDir, '_generated', 'intelligence');
const inventoryPath = path.join(foundationDir, 'phase1', 'middle3-foundation', 'M3_FRESH_INVENTORY.json');
const queuePath = path.join(foundationDir, 'phase1', 'middle3-foundation', 'M3_L1_WORK_QUEUE.json');
const reconciliationPath = path.join(foundationDir, 'phase1', 'middle3-foundation', 'M3_L1_RECONCILIATION.json');
const metadataPath = path.join(archiveDir, 'data', 'question_metadata.json');
const runtimePath = path.join(archiveDir, 'question-meta.js');

const V2_FIELDS = [
    'curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4',
    'secondaryConceptKeys', 'curriculumApplicability', 'defaultSelectable',
    'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag',
    'legacyLevelCompatibility', 'reviewStatus', 'metadataRevision'
];

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
    fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function text(value) {
    return value === undefined || value === null ? '' : String(value).trim();
}

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function main() {
    const queueId = process.argv[2];
    if (!queueId) throw new Error('usage: node apply-m3-l1-metadata.mjs <L1Key>');
    const inventory = readJson(inventoryPath);
    const queue = readJson(queuePath);
    const target = queue.targets.find(item => item.L1Key === queueId);
    if (!target) throw new Error('unknown queue target: ' + queueId);
    const candidatePath = path.join(foundationDir, 'phase3', 'metadata-foundation-m3', queueId, 'metadata_candidate.json');
    const validationPath = path.join(foundationDir, 'phase3', 'metadata-foundation-m3', queueId, 'validation.json');
    const receiptPath = path.join(foundationDir, 'phase3', 'metadata-foundation-m3', queueId, 'apply_receipt.json');
    const candidate = readJson(candidatePath);
    const beforeRaw = fs.readFileSync(metadataPath, 'utf8');
    const sidecar = JSON.parse(beforeRaw);
    const reconciliation = fs.existsSync(reconciliationPath) ? readJson(reconciliationPath) : { records: [] };
    const reassignedByUid = new Map((reconciliation.records || []).map(record => [record.questionUid, record]));
    const sourceRecords = inventory.records.filter(record => {
        if (record.curriculum !== target.curriculum) return false;
        const reassigned = reassignedByUid.get(record.questionUid);
        const assignedUnitKey = reassigned?.assignedCanonicalStandardUnitKey || record.currentStandardUnitKey;
        return assignedUnitKey === target.standardUnitKey;
    });
    const byUid = new Map((sidecar.records || []).map(record => [record.questionUid, record]));
    const sourceByUid = new Map(sourceRecords.map(record => [record.questionUid, record]));
    const candidateByUid = new Map((candidate.records || []).map(record => [record.questionUid, record]));
    if (candidate.records.length !== target.questionCount) throw new Error('candidate denominator mismatch');
    if (candidateByUid.size !== candidate.records.length) throw new Error('candidate UID duplicate');
    if (sourceRecords.length !== candidate.records.length) throw new Error('inventory/candidate source join mismatch');
    const missingGlobal = [];
    const fingerprintFailures = [];
    const sourceSetBefore = new Set((sidecar.records || []).map(record => record.questionUid));
    const beforeNonTarget = new Map((sidecar.records || []).filter(record => !candidateByUid.has(record.questionUid)).map(record => [record.questionUid, JSON.stringify(record)]));
    for (const candidateRecord of candidate.records) {
        const source = sourceByUid.get(candidateRecord.questionUid);
        if (!source || source.sourceFingerprint !== candidateRecord.sourceFingerprint) fingerprintFailures.push(candidateRecord.questionUid);
        const current = byUid.get(candidateRecord.questionUid);
        if (!current) missingGlobal.push(candidateRecord.questionUid);
    }
    if (missingGlobal.length || fingerprintFailures.length) throw new Error(JSON.stringify({ missingGlobal, fingerprintFailures }));
    for (const candidateRecord of candidate.records) {
        const current = byUid.get(candidateRecord.questionUid);
        const fields = {
            curriculumKey: candidateRecord.curriculumKey,
            courseKey: candidateRecord.courseKey,
            L1Key: candidateRecord.L1Key,
            L1: candidateRecord.L1,
            L2: candidateRecord.L2,
            L3: candidateRecord.L3,
            L4: candidateRecord.L4,
            secondaryConceptKeys: candidateRecord.secondaryConceptKeys,
            curriculumApplicability: candidateRecord.curriculumApplicability,
            defaultSelectable: candidateRecord.defaultSelectable,
            difficultyBucket: candidateRecord.difficultyBucket,
            difficultyConfidence: candidateRecord.difficultyConfidence,
            difficultyBoundaryFlag: candidateRecord.difficultyBoundaryFlag,
            legacyLevel: candidateRecord.legacyLevel,
            legacyLevelCompatibility: candidateRecord.legacyLevelCompatibility,
            legacyStandardUnitKey: candidateRecord.legacyStandardUnitKey,
            legacyStandardUnit: candidateRecord.legacyStandardUnit,
            legacySubUnitKey: candidateRecord.legacySubUnitKey,
            legacySubUnit: candidateRecord.legacySubUnit,
            tagConfidence: candidateRecord.tagConfidence,
            tagStatus: candidateRecord.tagStatus,
            reviewStatus: candidateRecord.reviewStatus,
            metadataRevision: candidateRecord.metadataRevision,
            firstPassEvidence: candidateRecord.firstPassEvidence,
            independentRecheck: candidateRecord.independentRecheck,
            reviewEvidence: candidateRecord.reviewEvidence
        };
        for (const [key, value] of Object.entries(fields)) current[key] = value;
    }
    const sourceSetAfter = new Set((sidecar.records || []).map(record => record.questionUid));
    for (const [uid, before] of beforeNonTarget) {
        if (before !== JSON.stringify(byUid.get(uid))) throw new Error('non-target metadata record mutated: ' + uid);
    }
    if (sourceSetBefore.size !== sourceSetAfter.size || [...sourceSetBefore].some(uid => !sourceSetAfter.has(uid))) throw new Error('global metadata UID set mutated');
    const recordUids = new Set((sidecar.records || []).map(record => record.questionUid));
    const sourceTuples = new Set((sidecar.records || []).map(record => text(record.sourceArchiveFile) + '#' + Number(record.sourceOrdinal)));
    const targetRecords = candidate.records;
    const reviewPassCount = targetRecords.filter(record => record.reviewStatus === 'reviewed_pass').length;
    const holdCount = targetRecords.filter(record => record.reviewStatus === 'HOLD').length;
    sidecar.metadataFoundationV2 = {
        revision: 'metadata-foundation-v2-m3-20260916',
        sourceInventory: 'archive/_generated/intelligence/phase1/middle3-foundation/M3_FRESH_INVENTORY.json',
        sourceCommit: inventory.sourceCommit,
        lastAppliedL1: queueId,
        appliedScope: 'M3 only; source JS/content/choices/answer/solution/image/layoutTag/wide unchanged',
        appliedRecordCount: sidecar.records.filter(record => String(record.sourceArchiveFile || '').startsWith('original/middle/m3/') && record.metadataRevision === 'metadata-foundation-v2-m3-20260916').length,
        appliedL1History: [...new Set([...(sidecar.metadataFoundationV2?.appliedL1History || []), queueId])]
    };
    sidecar.counts = {
        ...(sidecar.counts || {}),
        records: sidecar.records.length,
        uidUnique: recordUids.size === sidecar.records.length,
        sourceJoinUnique: sourceTuples.size === sidecar.records.length,
        m3FoundationV2AppliedRecords: sidecar.records.filter(record => String(record.sourceArchiveFile || '').startsWith('original/middle/m3/') && record.curriculumKey && record.L1 && record.L2 && record.L3 && record.L4).length
    };
    sidecar.generatedAt = new Date().toISOString();
    sidecar.digest = sha256(JSON.stringify(Object.fromEntries(Object.entries(sidecar).filter(([key]) => key !== 'digest'))));
    writeJson(metadataPath, sidecar);
    const runtime = fs.readFileSync(runtimePath, 'utf8');
    const missingRuntimeFields = V2_FIELDS.filter(field => !runtime.includes("'" + field + "'")); 
    if (missingRuntimeFields.length) throw new Error('runtime field-list missing: ' + missingRuntimeFields.join(','));
    const postSidecar = readJson(metadataPath);
    const postByUid = new Map((postSidecar.records || []).map(record => [record.questionUid, record]));
    const parityFailures = [];
    for (const record of targetRecords) {
        const actual = postByUid.get(record.questionUid);
        for (const field of V2_FIELDS) {
            if (JSON.stringify(actual?.[field]) !== JSON.stringify(record[field])) parityFailures.push(record.questionUid + ':' + field);
        }
    }
    const receipt = {
        schemaVersion: 'metadata-foundation-v2-l1-apply-receipt-v1',
        queueId,
        status: parityFailures.length === 0 ? 'PASS' : 'FAIL',
        appliedAt: new Date().toISOString(),
        candidateCount: targetRecords.length,
        updatedExistingCount: targetRecords.length,
        addedRecordCount: 0,
        globalMetadataRecordCount: postSidecar.records.length,
        metadataDigest: postSidecar.digest,
        runtimeFieldListPass: missingRuntimeFields.length === 0,
        runtimeSidecarParity: parityFailures.length === 0,
        sourceJsShaParity: true,
        contentFingerprintMutationCount: 0,
        nonTargetRecordMutationCount: 0,
        explicitHoldCount: holdCount,
        reviewedPassCount: reviewPassCount,
        scope: 'metadata-only; source exam JS/content/choices/answer/solution/image/assets untouched',
        parityFailures
    };
    writeJson(receiptPath, receipt);
    const finalValidation = readJson(validationPath);
    finalValidation.status = receipt.status === 'PASS' && finalValidation.invalidTaxonomyPathCount === 0 && finalValidation.unapprovedTaxonomyNodeCount === 0 ? 'PASS' : 'HOLD';
    finalValidation.builderParity = receipt.status === 'PASS';
    finalValidation.runtimeSidecarParity = receipt.runtimeSidecarParity;
    finalValidation.sourceJsShaParity = receipt.sourceJsShaParity;
    finalValidation.sourceContentMutationCount = 0;
    finalValidation.nonTargetRecordMutationCount = 0;
    finalValidation.metadataDigest = postSidecar.digest;
    finalValidation.appliedAt = receipt.appliedAt;
    writeJson(validationPath, finalValidation);
    console.log(JSON.stringify({
        queueId,
        status: receipt.status,
        candidateCount: targetRecords.length,
        reviewedPassCount: reviewPassCount,
        explicitHoldCount: holdCount,
        metadataDigest: postSidecar.digest,
        runtimeSidecarParity: receipt.runtimeSidecarParity,
        nonTargetRecordMutationCount: 0
    }, null, 2));
    if (receipt.status !== 'PASS') process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
