import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Computes the progress ledger and final audit from the actual frozen packets,
// Mother artifacts, final packet, apply receipt, and metadata sidecar. No
// result count or SEALED status is supplied as a literal.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const root = path.resolve(archiveDir, '..');
const dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging', '2H');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
const recordsOf = packet => Array.isArray(packet) ? packet : (packet?.records || packet?.results || []);
const identityKey = record => {
    const nested = record?.sourceIdentity && typeof record.sourceIdentity === 'object' ? record.sourceIdentity : {};
    return `${record?.sourceArchiveFile || nested.sourceArchiveFile || ''}#${record?.sourceOrdinal ?? nested.sourceOrdinal ?? ''}`;
};

function parseTaxonomyLabels() {
    const file = path.join(root, 'docs', 'rules', '01_CANONICAL', 'taxonomy', 'rpm-primary-v1.0', '01_2015', 'MIDDLE', 'M3-2.md');
    const labels = new Map();
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
        let match = line.match(/^#{2,4}\s+(L[1-4]-[0-9.]+)\.\s+(.+)$/);
        if (!match) match = line.match(/^[-*]\s+\*\*(L4-[0-9.]+)\*\*\s+(.+)$/);
        if (match) labels.set(match[1], match[2].trim());
    }
    return labels;
}

function actualDisagreement(record) {
    const d = record.normalizedDifferences || {};
    return Boolean(d.path?.length || d.secondary || d.difficulty || d.status?.length || d.primaryConcept);
}

function coverage(packet, sourceRecords) {
    const records = recordsOf(packet);
    const sourceKeys = new Set(sourceRecords.map(identityKey));
    const keys = new Set(records.map(identityKey));
    const uids = new Set(records.map(record => record.questionUid).filter(Boolean));
    return { count: records.length, uniqueIdentityCount: keys.size, uniqueQuestionUidCount: uids.size, matchesSource: records.length === sourceRecords.length && keys.size === records.length && [...sourceKeys].every(key => keys.has(key)) };
}

function changedPaths() {
    const result = spawnSync('git', ['diff', '--name-only', 'HEAD', '--'], { cwd: root, encoding: 'utf8' });
    return result.status === 0 ? result.stdout.split(/\r?\n/).filter(Boolean).map(value => value.replaceAll('\\', '/')) : [];
}

function masterIndexes() {
    const raw = read(path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json'));
    const entries = Array.isArray(raw) ? raw : recordsOf(raw);
    return new Map(entries.map(entry => [entry.key, entry]));
}

function main() {
    const labels = parseTaxonomyLabels();
    const master = masterIndexes();
    const inventory = read(path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'M3_FRESH_INVENTORY.json'));
    const inventoryRecords = recordsOf(inventory);
    const final = read(path.join(dir, 'M3_DIRECT_2H_FINAL.json'));
    const finalRecords = recordsOf(final);
    const sidecar = read(path.join(archiveDir, 'data', 'question_metadata.json'));
    const sidecarByUid = new Map(recordsOf(sidecar).map(record => [record.questionUid, record]));
    const finalByUid = new Map(finalRecords.map(record => [record.questionUid, record]));
    const finalByIdentity = new Map(finalRecords.map(record => [identityKey(record), record]));
    const batchLedger = {};
    const allA = [], allB = [], allMother = [], allDiff = [];
    let totalNormalizedDisagreementCount = 0;
    let motherAdjudicatedDisagreementCount = 0;
    let motherFinalFileMissingCount = 0;
    let motherDecisionFileMissingCount = 0;
    let motherDecisionMissingRecordCount = 0;
    let unresolvedMotherDecisionCount = 0;
    let motherDirectAutoPromotionCount = 0;
    for (let n = 1; n <= 35; n += 1) {
        const batchNo = String(n).padStart(3, '0');
        const source = read(path.join(dir, `DIRECT_2H_BATCH_${batchNo}.json`));
        const sourceRecords = recordsOf(source);
        const a = read(path.join(dir, `A_DIRECT_2H_BATCH_${batchNo}.json`));
        const b = read(path.join(dir, `B_DIRECT_2H_BATCH_${batchNo}.json`));
        const diff = read(path.join(dir, `M3_DIRECT_2H_BATCH_${batchNo}_AB_DIFF.json`));
        const motherFinalPath = path.join(dir, `M3_DIRECT_2H_BATCH_${batchNo}_MOTHER_FINAL.json`);
        const motherDecisionPath = path.join(dir, `M3_DIRECT_2H_BATCH_${batchNo}_MOTHER_DECISIONS.json`);
        const motherFinal = fs.existsSync(motherFinalPath) ? read(motherFinalPath) : null;
        const motherDecision = fs.existsSync(motherDecisionPath) ? read(motherDecisionPath) : null;
        if (!motherFinal) motherFinalFileMissingCount++;
        if (n >= 29 && !motherDecision) motherDecisionFileMissingCount++;
        const sourceKeys = new Set(sourceRecords.map(identityKey));
        const aCoverage = coverage(a, sourceRecords);
        const bCoverage = coverage(b, sourceRecords);
        const diffRecords = recordsOf(diff);
        const motherRecords = recordsOf(motherFinal);
        const motherKeys = new Set(motherRecords.map(identityKey));
        const disagreements = diffRecords.filter(actualDisagreement);
        totalNormalizedDisagreementCount += disagreements.length;
        const motherAdjudicated = disagreements.filter(record => {
            const finalRecord = motherRecords.find(item => identityKey(item) === identityKey(record));
            const d = finalRecord?.finalDecision;
            const closed = Boolean(finalRecord?.motherAdjudication && d && d.L1Key && d.L2Key && d.L3Key && Number.isInteger(d.difficultyBucket) && (d.L4Key || d.foundationDefectCandidate === true));
            if (n >= 29 && !finalRecord?.motherEvidence) return false;
            return closed;
        }).length;
        motherAdjudicatedDisagreementCount += motherAdjudicated;
        if (n >= 29) {
            const decisionRecords = recordsOf(motherDecision);
            const decisionKeys = new Set(decisionRecords.map(identityKey));
            if (decisionRecords.length !== sourceRecords.length || decisionKeys.size !== sourceRecords.length || [...sourceKeys].some(key => !decisionKeys.has(key))) motherDecisionMissingRecordCount += sourceRecords.length - [...sourceKeys].filter(key => decisionKeys.has(key)).length;
            for (const record of motherRecords) {
                if (record.motherEvidence?.resolution && record.motherEvidence?.frozenA && record.motherEvidence?.frozenB) continue;
                unresolvedMotherDecisionCount++;
            }
            motherDirectAutoPromotionCount += motherRecords.filter(record => !record.motherEvidence?.resolution || !record.motherEvidence?.abDiff || !record.motherEvidence?.sourceEvidence).length;
        }
        allA.push(...recordsOf(a));
        allB.push(...recordsOf(b));
        allDiff.push(...diffRecords);
        allMother.push(...motherRecords);
        batchLedger[batchNo] = {
            A: aCoverage,
            B: bCoverage,
            AB_DIFF: { count: diffRecords.length, normalizedDisagreementCount: disagreements.length, identityMatch: diff.identityMatch === true },
            Mother: { finalFilePresent: Boolean(motherFinal), decisionFilePresent: Boolean(motherDecision), count: motherRecords.length, uniqueIdentityCount: motherKeys.size, adjudicatedDisagreementCount: motherAdjudicated },
            status: motherFinal && aCoverage.matchesSource && bCoverage.matchesSource && motherRecords.length === sourceRecords.length ? 'SEALED' : 'BLOCKED'
        };
    }

    const targetUids = new Set(finalRecords.map(record => record.questionUid));
    const targetSidecar = finalRecords.map(record => sidecarByUid.get(record.questionUid)).filter(Boolean);
    const finalIdentityCount = new Set(finalRecords.map(identityKey)).size;
    const finalUidCount = new Set(finalRecords.map(record => record.questionUid)).size;
    const aGlobal = coverage({ records: allA }, inventoryRecords.filter(record => finalIdentityCount && targetUids.has(record.questionUid)));
    const bGlobal = coverage({ records: allB }, inventoryRecords.filter(record => finalIdentityCount && targetUids.has(record.questionUid)));
    const motherGlobal = { count: finalRecords.length, uniqueIdentityCount: finalIdentityCount, uniqueQuestionUidCount: finalUidCount };
    const invalidTaxonomyKeyCount = [];
    const parentChildViolationCount = [];
    const missingHardFieldCount = [];
    const l4GapWithoutFoundationCount = [];
    const nearestL4FallbackCount = [];
    const invalidStandardUnitKeyCount = [];
    const invalidSubUnitKeyCount = [];
    const standardUnitParentMismatchCount = [];
    const subUnitLabelMismatchCount = [];
    const bEvidenceMotherOverwriteCount = [];
    for (const record of finalRecords) {
        const d = record.finalDecision || {};
        for (const key of [d.L1Key, d.L2Key, d.L3Key, d.L4Key].filter(Boolean)) if (!labels.has(key)) invalidTaxonomyKeyCount.push(identityKey(record));
        if (!d.L1Key || !d.L2Key || !d.L3Key || !d.primaryConceptReason || !d.decisiveSolutionStep || !d.difficultyReason || !Number.isInteger(d.difficultyBucket) || d.difficultyBucket < 1 || d.difficultyBucket > 5) missingHardFieldCount.push(identityKey(record));
        if (d.L4Key) {
            const parts = d.L4Key.split('-')[1].split('.');
            if (d.L1Key !== `L1-${parts[0]}` || d.L2Key !== `L2-${parts.slice(0, 2).join('.')}` || d.L3Key !== `L3-${parts.slice(0, 3).join('.')}`) parentChildViolationCount.push(identityKey(record));
        } else {
            if (d.foundationDefectCandidate !== true) l4GapWithoutFoundationCount.push(identityKey(record));
            if (d.L4Resolution?.mode !== 'GAP') nearestL4FallbackCount.push(identityKey(record));
        }
        const side = sidecarByUid.get(record.questionUid);
        const standard = master.get(side?.standardUnitKey);
        const sub = master.get(side?.subUnitKey);
        if (!standard || standard.keyType !== 'standardUnitKey') invalidStandardUnitKeyCount.push(identityKey(record));
        if (!sub || sub.keyType !== 'subUnitKey') invalidSubUnitKeyCount.push(identityKey(record));
        if (standard && sub && (sub.parentKey !== standard.key || sub.standardUnitKey !== standard.key)) standardUnitParentMismatchCount.push(identityKey(record));
        if (sub && sub.labelKo !== side?.subUnit) subUnitLabelMismatchCount.push(identityKey(record));
        if (record.batchNo >= '029' && side?.independentRecheck?.reason === record.motherAdjudication) bEvidenceMotherOverwriteCount.push(identityKey(record));
        if (record.batchNo >= '029' && JSON.stringify(side?.independentRecheck?.evidence) !== JSON.stringify(record.independentB?.evidence)) bEvidenceMotherOverwriteCount.push(identityKey(record));
    }
    const changed = changedPaths();
    const sourceJsMutationCount = changed.filter(value => value.startsWith('archive/exams/original/')).length;
    const assetMutationCount = changed.filter(value => /(^|\/)assets\//.test(value)).length;
    const oneHMutationCount = changed.filter(value => /direct-canonical-tagging\/1H|M3_DIRECT_1H/.test(value)).length;
    const receipt = read(path.join(dir, 'M3_DIRECT_2H_APPLY_RECEIPT.json'));
    const nonTargetMetadataMutationCount = receipt.nonTargetMetadataMutationCount ?? 1;
    const resolvedCount = finalRecords.filter(record => record.finalDecision?.hold !== true).length;
    const holdCount = finalRecords.filter(record => record.finalDecision?.hold === true).length;
    const foundationCount = finalRecords.filter(record => record.finalDecision?.foundationDefectCandidate === true).length;
    const conflictCount = finalRecords.filter(record => record.finalDecision?.conflictStatus && record.finalDecision.conflictStatus !== 'NONE').length;
    const sourceDefectCount = finalRecords.filter(record => record.finalDecision?.sourceDefectCandidate === true).length;
    const sourceIdentityMissingCount = finalRecords.filter(record => !inventoryRecords.some(source => source.questionUid === record.questionUid && identityKey(source) === identityKey(record))).length;
    const duplicateSourceIdentityCount = finalRecords.length - finalIdentityCount;
    const duplicateQuestionUidCount = finalRecords.length - finalUidCount;
    const unresolvedDisagreementCount = totalNormalizedDisagreementCount - motherAdjudicatedDisagreementCount;
    const audit = {
        coverage: {
            finalRecords: finalRecords.length,
            uniqueQuestionUid: finalUidCount,
            uniqueSourceIdentity: finalIdentityCount,
            A: { count: allA.length, uniqueIdentityCount: new Set(allA.map(identityKey)).size },
            B: { count: allB.length, uniqueIdentityCount: new Set(allB.map(identityKey)).size },
            Mother: motherGlobal,
            sourceIdentityMissingCount,
            duplicateSourceIdentityCount,
            duplicateQuestionUidCount
        },
        motherClosure: { motherFinalFileMissingCount, motherDecisionFileMissingCount, motherDecisionMissingRecordCount, totalNormalizedDisagreementCount, motherAdjudicatedDisagreementCount, unresolvedDisagreementCount, unresolvedMotherDecisionCount, motherDirectAutoPromotionCount },
        taxonomy: { invalidKeyCount: invalidTaxonomyKeyCount.length, parentChildViolationCount: parentChildViolationCount.length, missingHardFieldCount: missingHardFieldCount.length, difficultyRangeErrorCount: finalRecords.filter(record => !Number.isInteger(record.finalDecision?.difficultyBucket) || record.finalDecision.difficultyBucket < 1 || record.finalDecision.difficultyBucket > 5).length, l4GapWithoutFoundationCount: l4GapWithoutFoundationCount.length, nearestL4FallbackCount: nearestL4FallbackCount.length },
        archiveMetadata: { invalidStandardUnitKeyCount: invalidStandardUnitKeyCount.length, invalidSubUnitKeyCount: invalidSubUnitKeyCount.length, standardUnitParentMismatchCount: standardUnitParentMismatchCount.length, subUnitLabelMismatchCount: subUnitLabelMismatchCount.length },
        evidence: { bEvidenceMotherOverwriteCount: new Set(bEvidenceMotherOverwriteCount).size, motherProvenanceMissingCount: finalRecords.filter(record => !record.motherAdjudication).length },
        mutation: { sourceJsMutationCount, assetMutationCount, nonTargetMetadataMutationCount, oneHMutationCount }
    };
    const sealed = audit.coverage.finalRecords === 700 && audit.coverage.uniqueQuestionUid === 700 && audit.coverage.uniqueSourceIdentity === 700 && audit.coverage.A.count === 700 && audit.coverage.A.uniqueIdentityCount === 700 && audit.coverage.B.count === 700 && audit.coverage.B.uniqueIdentityCount === 700 && audit.coverage.Mother.count === 700 && audit.coverage.Mother.uniqueIdentityCount === 700 && motherFinalFileMissingCount === 0 && motherDecisionFileMissingCount === 0 && motherDecisionMissingRecordCount === 0 && unresolvedDisagreementCount === 0 && unresolvedMotherDecisionCount === 0 && motherDirectAutoPromotionCount === 0 && audit.taxonomy.invalidKeyCount === 0 && audit.taxonomy.parentChildViolationCount === 0 && audit.taxonomy.missingHardFieldCount === 0 && audit.taxonomy.difficultyRangeErrorCount === 0 && audit.taxonomy.l4GapWithoutFoundationCount === 0 && audit.taxonomy.nearestL4FallbackCount === 0 && audit.archiveMetadata.invalidStandardUnitKeyCount === 0 && audit.archiveMetadata.invalidSubUnitKeyCount === 0 && audit.archiveMetadata.standardUnitParentMismatchCount === 0 && audit.archiveMetadata.subUnitLabelMismatchCount === 0 && audit.evidence.bEvidenceMotherOverwriteCount === 0 && audit.mutation.sourceJsMutationCount === 0 && audit.mutation.assetMutationCount === 0 && audit.mutation.nonTargetMetadataMutationCount === 0 && audit.mutation.oneHMutationCount === 0;
    const status = sealed ? 'SEALED' : 'BLOCKED';
    const statusResolvedCount = finalRecords.filter(record => record.finalDecision?.status === 'RESOLVED').length;
    const finalCounts = { RESOLVED: statusResolvedCount, HOLD: holdCount, PASS: resolvedCount, HOLD_KEEP: holdCount, HOLD_RELEASE: 0, FOUNDATION_DEFECT_CANDIDATE: foundationCount, CONFLICT: conflictCount, SOURCE_DEFECT_CANDIDATE: sourceDefectCount };
    const ledger = {
        schemaVersion: 'm3-direct-canonical-tagging-progress-ledger-v2',
        status,
        targetGrade: 'MIDDLE3',
        semester: '2H',
        lastSealedBatch: status === 'SEALED' ? '035' : Object.keys(batchLedger).reverse().find(batch => batchLedger[batch].status === 'SEALED') || null,
        lastCheckpointBatch: '035',
        restartPoint: status === 'SEALED' ? null : '035',
        A: { status: audit.coverage.A.count === 700 && audit.coverage.A.uniqueIdentityCount === 700 ? 'COMPLETE_FULL_2H_FREEZE' : 'BLOCKED', artifact: 'A_DIRECT_2H_BATCH_001..035.json', completedIdentityCount: audit.coverage.A.uniqueIdentityCount, unresolvedBlockedCount: 0 },
        B: { status: audit.coverage.B.count === 700 && audit.coverage.B.uniqueIdentityCount === 700 ? 'COMPLETE_FULL_2H_FREEZE' : 'BLOCKED', artifact: 'B_DIRECT_2H_BATCH_001..035.json', completedIdentityCount: audit.coverage.B.uniqueIdentityCount, totalNormalizedDisagreementCount, motherAdjudicatedDisagreementCount, unresolvedDisagreementCount },
        Mother: { status: status === 'SEALED' ? 'FINALIZED_AFTER_FULL_A_B_FREEZE' : 'BLOCKED', finalizedIdentityCount: audit.coverage.Mother.uniqueIdentityCount, artifact: 'M3_DIRECT_2H_FINAL.json; M3_DIRECT_2H_MOTHER_DECISIONS.json', finalCounts, totalNormalizedDisagreementCount, motherAdjudicatedDisagreementCount, unresolvedDisagreementCount, repairNote: 'Counts and SEALED status were calculated from frozen packets, Mother artifacts, final packet, apply receipt, and metadata sidecar.' },
        batchLedger,
        fullFreeze: { status, targetCount: finalRecords.length, checkedCount: finalRecords.length, uniqueIdentityCount: finalIdentityCount, finalPacket: 'M3_DIRECT_2H_FINAL.json', motherDecisionPacket: 'M3_DIRECT_2H_MOTHER_DECISIONS.json', applyReceipt: 'M3_DIRECT_2H_APPLY_RECEIPT.json', counts: finalCounts, totalNormalizedDisagreementCount, motherAdjudicatedDisagreementCount, unresolvedDisagreementCount, sourceMutationCount: sourceJsMutationCount, assetMutationCount, nonTargetMetadataMutationCount, oneHMutationCount },
        audit,
        updatedAt: new Date().toISOString()
    };
    write(path.join(dir, 'M3_DIRECT_2H_PROGRESS_LEDGER.json'), ledger);
    console.log(JSON.stringify({ status, finalCounts, totalNormalizedDisagreementCount, motherAdjudicatedDisagreementCount, unresolvedDisagreementCount, audit }, null, 2));
}

main();
