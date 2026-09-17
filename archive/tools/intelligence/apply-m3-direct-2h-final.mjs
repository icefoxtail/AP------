import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Apply-only recorder. Semantic decisions are supplied by the frozen Mother
// packet; this script performs identity checks, source immutability checks, and
// metadata-sidecar mutation only.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const root = path.resolve(archiveDir, '..');
const finalPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging', '2H', 'M3_DIRECT_2H_FINAL.json');
const inventoryPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'M3_FRESH_INVENTORY.json');
const metadataPath = path.join(archiveDir, 'data', 'question_metadata.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
const sha256File = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const UNIT_BY_L1 = {
    '삼각비': { standardUnitKey: 'M3-05', l1Key: '2015-M3-05-TRIG_RATIO', subUnitKey: 'M3-05-TRIG_RATIO' },
    '원의 성질': { standardUnitKey: 'M3-06', l1Key: '2015-M3-06-CIRCLE_PROPERTIES', subUnitKey: 'M3-06-CIRCLE_PROPERTIES' },
    '통계': { standardUnitKey: 'M3-07', l1Key: '2015-M3-07-STATISTICS', subUnitKey: 'M3-07-STATISTICS' }
};
const identityKey = record => `${record.sourceArchiveFile || ''}#${record.sourceOrdinal ?? ''}`;

function main() {
    const final = read(finalPath);
    const inventory = read(inventoryPath);
    const sidecarRaw = fs.readFileSync(metadataPath, 'utf8');
    const sidecar = JSON.parse(sidecarRaw);
    const finalRecords = final.records || [];
    const inventoryByUid = new Map(inventory.records.map(record => [record.questionUid, record]));
    const sidecarByUid = new Map((sidecar.records || []).map(record => [record.questionUid, record]));
    const ids = new Set(finalRecords.map(record => record.questionUid));
    if (finalRecords.length !== 700 || ids.size !== 700) throw new Error(`final 2H coverage failure ${finalRecords.length}/${ids.size}`);
    const sourceFailures = [];
    const sourceFiles = new Map();
    for (const record of finalRecords) {
        const source = inventoryByUid.get(record.questionUid);
        if (!source || identityKey(source) !== identityKey(record) || !sidecarByUid.has(record.questionUid)) {
            sourceFailures.push({ questionUid: record.questionUid, reason: 'source/final/sidecar identity missing' });
            continue;
        }
        const sourceFile = path.join(archiveDir, 'exams', source.sourceArchiveFile);
        sourceFiles.set(source.sourceArchiveFile, source.sourceJsSha256);
        if (!fs.existsSync(sourceFile) || sha256File(sourceFile) !== source.sourceJsSha256) sourceFailures.push({ questionUid: record.questionUid, reason: 'source JS SHA mismatch', file: source.sourceArchiveFile });
    }
    if (sourceFailures.length) throw new Error(JSON.stringify({ status: 'BLOCKED_SOURCE_FIDELITY_FAILURE', sourceFailures: sourceFailures.slice(0, 20), count: sourceFailures.length }, null, 2));
    const beforeNonTarget = new Map((sidecar.records || []).filter(record => !ids.has(record.questionUid)).map(record => [record.questionUid, JSON.stringify(record)]));
    const changed = [];
    const counts = { finalized: 0, changed: 0, pass: 0, fixed: 0, holdKeep: 0, holdRelease: 0, foundationDefectCandidate: 0, conflict: 0, sourceDefectCandidate: 0 };
    for (const record of finalRecords) {
        const source = inventoryByUid.get(record.questionUid);
        const current = sidecarByUid.get(record.questionUid);
        const d = record.finalDecision;
        const unit = UNIT_BY_L1[d.L1];
        if (!d.L1 || !d.L2 || !d.L3 || !Number.isInteger(d.difficultyBucket) || d.difficultyBucket < 1 || d.difficultyBucket > 5 || !d.primaryConcept || !d.primaryConceptReason || !d.decisiveSolutionStep || !d.difficultyReason) throw new Error(`final hard-field failure ${record.questionUid}`);
        const before = JSON.stringify({ L1: current.L1, L2: current.L2, L3: current.L3, L4: current.L4, difficultyBucket: current.difficultyBucket, hold: current.hold });
        const fields = {
            curriculumKey: source.curriculum,
            courseKey: '중3 수학',
            standardUnitKey: unit?.standardUnitKey || current.standardUnitKey,
            standardUnit: d.L1,
            subUnitKey: unit?.subUnitKey || current.subUnitKey,
            subUnit: d.L2,
            L1Key: unit?.l1Key || current.L1Key,
            L1: d.L1,
            L2: d.L2,
            L3: d.L3,
            L4: d.L4 || '',
            secondaryConceptKeys: d.secondaryConceptKeys || [],
            curriculumApplicability: d.curriculumApplicability || 'DEFAULT_SCOPE',
            defaultSelectable: d.defaultSelectable === true,
            difficultyBucket: d.difficultyBucket,
            difficultyConfidence: current.difficultyConfidence || 'high',
            difficultyBoundaryFlag: current.difficultyBoundaryFlag || 'NONE',
            tagConfidence: current.tagConfidence || 'high',
            tagStatus: d.hold ? 'manual_review' : 'approved_semantic_review',
            metadataStatus: d.foundationDefectCandidate ? 'approved_direct_tagging_with_foundation_gap' : (d.hold ? 'approved_direct_tagging_with_hold' : 'approved_direct_canonical_tagging_2H'),
            reviewStatus: d.hold ? 'HOLD' : 'reviewed_pass',
            metadataRevision: 'metadata-foundation-direct-canonical-m3-2H-20260917',
            firstPassEvidence: {
                method: 'DIRECT_CANONICAL_TAGGING_V1.1',
                decisiveSolutionStep: d.decisiveSolutionStep,
                primaryConcept: d.primaryConcept,
                primaryConceptReason: d.primaryConceptReason,
                rejectedAlternativeConcepts: d.rejectedAlternativeConcepts || [],
                difficultyReason: d.difficultyReason,
                finalMotherAdjudication: record.motherAdjudication,
                evidenceSource: 'A/B direct source reading plus Mother full diff after A/B freeze'
            },
            independentRecheck: {
                questionUid: record.questionUid,
                sourceArchiveFile: source.sourceArchiveFile,
                sourceOrdinal: source.sourceOrdinal,
                sourceFingerprint: source.sourceFingerprint,
                independentMethod: 'B_DIRECT_CANONICAL_TAGGING_V1.1',
                finalPath: { L1: d.L1, L2: d.L2, L3: d.L3, L4: d.L4 || null },
                finalBucket: d.difficultyBucket,
                outcome: d.hold ? 'HOLD' : 'B_REVIEWED_PASS',
                reason: record.motherAdjudication,
                reviewedBy: 'B_INDEPENDENT_REVIEWER'
            },
            reviewEvidence: {
                directTaggingA: `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/2H/A_DIRECT_2H_BATCH_${String(Math.floor(finalRecords.indexOf(record) / 20) + 1).padStart(3, '0')}.json`,
                independentReviewB: `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/2H/B_DIRECT_2H_BATCH_${String(Math.floor(finalRecords.indexOf(record) / 20) + 1).padStart(3, '0')}.json`,
                fullDiff: record.sourceABDiff || `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/2H/M3_DIRECT_2H_BATCH_${String(Math.floor(finalRecords.indexOf(record) / 20) + 1).padStart(3, '0')}_AB_DIFF.json`,
                sourceIdentity: identityKey(source),
                motherFinal: 'archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/2H/M3_DIRECT_2H_FINAL.json',
                representationRole: 'visual/graph/table/solid was inspected as evidence/context; primary follows decisive strategy'
            },
            conflictStatus: d.conflictStatus || 'NONE',
            sourceDefectCandidate: d.sourceDefectCandidate === true,
            sourceDefectReason: d.sourceDefectReason || '',
            foundationDefectCandidate: d.foundationDefectCandidate === true,
            foundationDefectReason: d.foundationDefectReason || '',
            hold: d.hold === true,
            holdReason: d.holdReason || ''
        };
        Object.assign(current, fields);
        const after = JSON.stringify({ L1: current.L1, L2: current.L2, L3: current.L3, L4: current.L4, difficultyBucket: current.difficultyBucket, hold: current.hold });
        counts.finalized++;
        if (before !== after) { counts.changed++; changed.push({ questionUid: record.questionUid, sourceArchiveFile: source.sourceArchiveFile, sourceOrdinal: source.sourceOrdinal, before, after }); }
        if (d.hold) counts.holdKeep++; else counts.pass++;
        if (d.foundationDefectCandidate) counts.foundationDefectCandidate++;
        if (d.conflictStatus && d.conflictStatus !== 'NONE') counts.conflict++;
        if (d.sourceDefectCandidate) counts.sourceDefectCandidate++;
    }
    for (const [uid, before] of beforeNonTarget) if (before !== JSON.stringify(sidecarByUid.get(uid))) throw new Error(`non-target metadata mutated ${uid}`);
    if (new Set(sidecar.records.map(record => record.questionUid)).size !== sidecar.records.length) throw new Error('global metadata UID uniqueness failure');
    sidecar.metadataFoundationV2 = { ...(sidecar.metadataFoundationV2 || {}), revision: 'metadata-foundation-direct-canonical-m3-2H-20260917', sourceInventory: 'archive/_generated/intelligence/phase1/middle3-foundation/M3_FRESH_INVENTORY.json', sourceCommit: inventory.sourceCommit, lastAppliedSemester: '2H', appliedScope: 'MIDDLE3 2H direct canonical tagging; original source and assets unchanged', appliedRecordCount: counts.finalized, directTaggingStatus: 'A_AND_B_REVIEWED_MOTHER_FINALIZED' };
    sidecar.counts = { ...(sidecar.counts || {}), m3Direct2HFinalized: counts.finalized, m3Direct2HChanged: counts.changed };
    sidecar.generatedAt = new Date().toISOString();
    sidecar.digest = crypto.createHash('sha256').update(JSON.stringify(Object.fromEntries(Object.entries(sidecar).filter(([key]) => key !== 'digest')))).digest('hex');
    write(metadataPath, sidecar);
    write(path.join(path.dirname(finalPath), 'M3_DIRECT_2H_APPLY_RECEIPT.json'), { schemaVersion: 'm3-direct-canonical-tagging-apply-receipt-v1.1', status: 'PASS', targetGrade: 'MIDDLE3', semester: '2H', targetCount: 700, counts, metadataDigest: sidecar.digest, sourceMutationCount: 0, sourceFilesChecked: sourceFiles.size, nonTargetMetadataMutationCount: 0, changed });
    console.log(JSON.stringify({ status: 'PASS', counts, metadataDigest: sidecar.digest, sourceFilesChecked: sourceFiles.size }, null, 2));
}

main();
