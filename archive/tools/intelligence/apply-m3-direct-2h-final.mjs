import crypto from 'node:crypto';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Apply-only recorder. Mother decisions are supplied by the final packet;
// this helper mutates only the 2H target records in question_metadata.json.
// Archive canonical subUnit fields are validated against the compiled master
// before any sidecar write is permitted.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const root = path.resolve(archiveDir, '..');
const dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging', '2H');
const finalPath = path.join(dir, 'M3_DIRECT_2H_FINAL.json');
const inventoryPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'M3_FRESH_INVENTORY.json');
const metadataPath = path.join(archiveDir, 'data', 'question_metadata.json');
const masterPath = path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
const sha256File = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const identityKey = record => `${record?.sourceArchiveFile || ''}#${record?.sourceOrdinal ?? ''}`;
const recordsOf = packet => Array.isArray(packet) ? packet : (packet?.records || packet?.results || []);

const UNIT_BY_L1 = {
    '삼각비': { standardUnitKey: 'M3-05', foundationL1Key: '2015-M3-05-TRIG_RATIO' },
    '원의 성질': { standardUnitKey: 'M3-06', foundationL1Key: '2015-M3-06-CIRCLE_PROPERTIES' },
    '통계': { standardUnitKey: 'M3-07', foundationL1Key: '2015-M3-07-STATISTICS' }
};
const SUBUNIT_BY_L2 = {
    'L2-1.1': { subUnitKey: 'M3-05-TRIG_RATIO' },
    'L2-1.2': { subUnitKey: 'M3-05-TRIG_RATIO_APPLICATION' },
    'L2-2.1': { subUnitKey: 'M3-06-CIRCLE_LINE' },
    'L2-2.2': { subUnitKey: 'M3-06-CIRCLE_INSCRIBED_ANGLE' },
    'L2-3.1': { subUnitKey: 'M3-07-STATISTICS_REPRESENTATIVE' },
    'L2-3.2': { subUnitKey: 'M3-07-STATISTICS_DATA_INTERPRETATION' }
};

function gitChangedPaths() {
    const result = spawnSync('git', ['diff', '--name-only', 'HEAD', '--'], { cwd: root, encoding: 'utf8' });
    return result.status === 0 ? result.stdout.split(/\r?\n/).filter(Boolean).map(value => value.replaceAll('\\', '/')) : [];
}

function masterIndexes() {
    const entries = Array.isArray(read(masterPath)) ? read(masterPath) : recordsOf(read(masterPath));
    const byKey = new Map(entries.map(entry => [entry.key, entry]));
    for (const [key, expected] of Object.entries(UNIT_BY_L1)) {
        const standard = byKey.get(expected.standardUnitKey);
        if (!standard || standard.keyType !== 'standardUnitKey' || standard.labelKo !== key) throw new Error(`compiled master standardUnit validation failed ${expected.standardUnitKey}`);
    }
    for (const mapping of Object.values(SUBUNIT_BY_L2)) {
        const sub = byKey.get(mapping.subUnitKey);
        if (!sub || sub.keyType !== 'subUnitKey' || !sub.parentKey || !byKey.has(sub.parentKey) || sub.standardUnitKey !== sub.parentKey || sub.labelKo !== sub.subUnit) throw new Error(`compiled master subUnit validation failed ${mapping.subUnitKey}`);
    }
    return { entries, byKey };
}

function loadBDecisions(labels) {
    const output = new Map();
    for (let n = 1; n <= 35; n += 1) {
        const batchNo = String(n).padStart(3, '0');
        const packet = read(path.join(dir, `B_DIRECT_2H_BATCH_${batchNo}.json`));
        for (const record of recordsOf(packet)) {
            const d = record.finalDecision || record.decision || record.independentDecision || {};
            const pathKeys = [1, 2, 3, 4].map(level => {
                const value = d[`L${level}Key`] ?? d[`L${level}`] ?? d[`L${level}Label`] ?? d[`l${level}Key`] ?? d[`l${level}`] ?? (level === 4 ? d.l4Resolution?.L4Key : '');
                if (typeof value === 'string') {
                    const match = value.match(/(?:M3-2-)?(L\d-\d(?:\.\d+)*)\b/);
                    if (match) return match[1];
                }
                return value || '';
            });
            const rawDifficulty = record.difficultyBucket ?? d.difficultyBucket ?? record.difficulty?.difficultyBucket ?? record.difficulty?.bucket ?? d.difficulty ?? record.difficulty ?? null;
            const difficulty = Number.isInteger(rawDifficulty) ? rawDifficulty : ({ EASY: 1, MEDIUM: 3, HARD: 4 }[String(rawDifficulty).toUpperCase()] ?? null);
            output.set(identityKey(record), {
                sourceArchiveFile: record.sourceArchiveFile || record.sourceIdentity?.sourceArchiveFile || '',
                sourceOrdinal: record.sourceOrdinal ?? record.sourceIdentity?.sourceOrdinal ?? null,
                path: pathKeys.some(Boolean) ? pathKeys : null,
                finalBucket: Number.isInteger(difficulty) ? difficulty : null,
                outcome: record.reviewOutcome || record.reviewStatus || record.status || '',
                status: record.status || record.reviewStatus || d.status || '',
                hold: record.hold === true || d.hold === true,
                holdReason: record.holdReason || d.holdReason || '',
                foundationDefectCandidate: record.foundationDefectCandidate === true || d.foundationDefectCandidate === true,
                foundationDefectReason: record.foundationDefectReason || d.foundationDefectReason || '',
                sourceDefectCandidate: record.sourceDefectCandidate === true || d.sourceDefectCandidate === true,
                sourceDefectReason: record.sourceDefectReason || d.sourceDefectReason || '',
                reason: record.reviewReason || record.reason || d.primaryConceptReason || d.reason || '',
                evidence: record.independentEvidence || record.reviewEvidence || record.sourceReadAudit || { independentDecision: record.independentDecision || record.decision || null },
                reviewedBy: 'B_INDEPENDENT_REVIEWER'
            });
        }
    }
    return output;
}

function pathLabels(snapshot, master) {
    if (!snapshot?.path) return null;
    return snapshot.path.map((key, index) => key ? (master.get(key)?.labelKo || key) : null).reduce((result, value, index) => {
        result[['L1', 'L2', 'L3', 'L4'][index]] = value;
        return result;
    }, {});
}

function main() {
    const final = read(finalPath);
    const inventory = read(inventoryPath);
    const sidecarRaw = fs.readFileSync(metadataPath, 'utf8');
    const sidecar = JSON.parse(sidecarRaw);
    const master = masterIndexes();
    const finalRecords = recordsOf(final);
    const inventoryRecords = recordsOf(inventory);
    const inventoryByUid = new Map(inventoryRecords.map(record => [record.questionUid, record]));
    const sidecarRecords = recordsOf(sidecar);
    const sidecarByUid = new Map(sidecarRecords.map(record => [record.questionUid, record]));
    const ids = new Set(finalRecords.map(record => record.questionUid));
    const sourceIds = new Set(finalRecords.map(identityKey));
    if (finalRecords.length !== 700 || ids.size !== 700 || sourceIds.size !== 700) throw new Error(`final 2H coverage failure ${finalRecords.length}/${ids.size}/${sourceIds.size}`);
    if (sidecarByUid.size !== sidecarRecords.length) throw new Error('global metadata UID uniqueness failure before apply');
    const bByIdentity = loadBDecisions(master.byKey);
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
    const targetByUid = new Map(finalRecords.map(record => [record.questionUid, record]));
    const beforeNonTarget = new Map(sidecarRecords.filter(record => !targetByUid.has(record.questionUid)).map(record => [record.questionUid, JSON.stringify(record)]));
    const changed = [];
    const counts = { finalized: 0, changed: 0, pass: 0, fixed: 0, holdKeep: 0, holdRelease: 0, foundationDefectCandidate: 0, conflict: 0, sourceDefectCandidate: 0 };
    for (const record of finalRecords) {
        const source = inventoryByUid.get(record.questionUid);
        const current = sidecarByUid.get(record.questionUid);
        const d = record.finalDecision || {};
        const unit = UNIT_BY_L1[d.L1];
        const subunit = SUBUNIT_BY_L2[d.L2Key];
        const standard = unit ? master.byKey.get(unit.standardUnitKey) : null;
        const canonicalSubunit = subunit ? master.byKey.get(subunit.subUnitKey) : null;
        if (!current || !unit || !subunit || !standard || !canonicalSubunit) throw new Error(`canonical mapping unavailable ${record.questionUid}`);
        if (!d.L1 || !d.L2 || !d.L3 || !Number.isInteger(d.difficultyBucket) || d.difficultyBucket < 1 || d.difficultyBucket > 5 || !d.primaryConceptReason || !d.decisiveSolutionStep || !d.difficultyReason) throw new Error(`final hard-field failure ${record.questionUid}`);
        if (canonicalSubunit.keyType !== 'subUnitKey' || canonicalSubunit.parentKey !== standard.key || canonicalSubunit.standardUnitKey !== standard.key || canonicalSubunit.labelKo !== canonicalSubunit.subUnit) throw new Error(`canonical subUnit gate failure ${record.questionUid}`);
        const b = record.independentB || bByIdentity.get(identityKey(record));
        if (!b) throw new Error(`B provenance missing ${record.questionUid}`);
        const before = JSON.stringify({ ...current });
        const bFinalPath = pathLabels(b, master.byKey);
        const fields = {
            curriculumKey: source.curriculumKey || source.curriculum || '2015',
            courseKey: '중3 수학',
            standardUnitKey: standard.key,
            standardUnit: standard.labelKo,
            subUnitKey: canonicalSubunit.key,
            subUnit: canonicalSubunit.labelKo,
            conceptClusterKey: canonicalSubunit.conceptClusterKey || current.conceptClusterKey,
            L1Key: unit.foundationL1Key,
            L1: d.L1,
            L2Key: d.L2Key,
            L2: d.L2,
            L3Key: d.L3Key,
            L3: d.L3,
            L4Key: d.L4Key || '',
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
            legacyStandardUnitKey: standard.key,
            legacyStandardUnit: standard.labelKo,
            legacySubUnitKey: canonicalSubunit.key,
            legacySubUnit: canonicalSubunit.labelKo,
            firstPassEvidence: {
                method: 'DIRECT_CANONICAL_TAGGING_V1.2',
                decisiveSolutionStep: d.decisiveSolutionStep,
                primaryConcept: d.primaryConcept,
                primaryConceptReason: d.primaryConceptReason,
                rejectedAlternativeConcepts: d.rejectedAlternativeConcepts || [],
                difficultyReason: d.difficultyReason,
                finalMotherAdjudication: record.motherAdjudication,
                evidenceSource: 'Frozen A/B packets plus AB_DIFF plus Mother source content/choices/answer/solution adjudication'
            },
            independentRecheck: {
                questionUid: record.questionUid,
                sourceArchiveFile: source.sourceArchiveFile,
                sourceOrdinal: source.sourceOrdinal,
                sourceFingerprint: source.sourceFingerprint,
                independentMethod: 'B_DIRECT_CANONICAL_TAGGING_V1.1',
                finalPath: bFinalPath,
                finalBucket: b.finalBucket,
                outcome: b.outcome,
                status: b.status,
                hold: b.hold,
                holdReason: b.holdReason,
                foundationDefectCandidate: b.foundationDefectCandidate,
                foundationDefectReason: b.foundationDefectReason,
                sourceDefectCandidate: b.sourceDefectCandidate,
                sourceDefectReason: b.sourceDefectReason,
                reason: b.reason,
                evidence: b.evidence,
                reviewedBy: 'B_INDEPENDENT_REVIEWER'
            },
            reviewEvidence: {
                directTaggingA: `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/2H/A_DIRECT_2H_BATCH_${record.batchNo}.json`,
                independentReviewB: record.sourceB,
                fullDiff: record.sourceABDiff,
                sourceIdentity: identityKey(source),
                motherFinal: `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/2H/M3_DIRECT_2H_BATCH_${record.batchNo}_MOTHER_FINAL.json`,
                motherDecision: record.sourceMotherDecision,
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
        const after = JSON.stringify(current);
        counts.finalized++;
        if (before !== after) { counts.changed++; changed.push({ questionUid: record.questionUid, sourceArchiveFile: source.sourceArchiveFile, sourceOrdinal: source.sourceOrdinal, before, after }); }
        if (d.hold) counts.holdKeep++; else counts.pass++;
        if (d.foundationDefectCandidate) counts.foundationDefectCandidate++;
        if (d.conflictStatus && d.conflictStatus !== 'NONE') counts.conflict++;
        if (d.sourceDefectCandidate) counts.sourceDefectCandidate++;
    }
    for (const [uid, before] of beforeNonTarget) if (before !== JSON.stringify(sidecarByUid.get(uid))) throw new Error(`non-target metadata mutated ${uid}`);
    if (new Set(sidecarRecords.map(record => record.questionUid)).size !== sidecarRecords.length) throw new Error('global metadata UID uniqueness failure after apply');
    const changedPaths = gitChangedPaths();
    const sourceMutationCount = changedPaths.filter(value => value.startsWith('archive/exams/original/')).length;
    const assetMutationCount = changedPaths.filter(value => /(^|\/)assets\//.test(value)).length;
    const oneHMutationCount = changedPaths.filter(value => /direct-canonical-tagging\/1H|M3_DIRECT_1H/.test(value)).length;
    if (sourceMutationCount || assetMutationCount || oneHMutationCount) throw new Error(JSON.stringify({ sourceMutationCount, assetMutationCount, oneHMutationCount }, null, 2));
    sidecar.metadataFoundationV2 = { ...(sidecar.metadataFoundationV2 || {}), revision: 'metadata-foundation-direct-canonical-m3-2H-20260917', sourceInventory: 'archive/_generated/intelligence/phase1/middle3-foundation/M3_FRESH_INVENTORY.json', sourceCommit: inventory.sourceCommit, lastAppliedSemester: '2H', appliedScope: 'MIDDLE3 2H direct canonical tagging; original source and assets unchanged', appliedRecordCount: counts.finalized, directTaggingStatus: 'A_AND_B_REVIEWED_MOTHER_FINALIZED' };
    sidecar.counts = { ...(sidecar.counts || {}), m3Direct2HFinalized: counts.finalized, m3Direct2HChanged: counts.changed };
    sidecar.generatedAt = new Date().toISOString();
    sidecar.digest = crypto.createHash('sha256').update(JSON.stringify(Object.fromEntries(Object.entries(sidecar).filter(([key]) => key !== 'digest')))).digest('hex');
    write(metadataPath, sidecar);
    write(path.join(dir, 'M3_DIRECT_2H_APPLY_RECEIPT.json'), { schemaVersion: 'm3-direct-canonical-tagging-apply-receipt-v1.2', status: 'PASS', targetGrade: 'MIDDLE3', semester: '2H', targetCount: finalRecords.length, counts, metadataDigest: sidecar.digest, sourceMutationCount, assetMutationCount, sourceFilesChecked: sourceFiles.size, nonTargetMetadataMutationCount: 0, oneHMutationCount, bEvidenceMotherOverwriteCount: 0, changed });
    console.log(JSON.stringify({ status: 'PASS', counts, metadataDigest: sidecar.digest, sourceFilesChecked: sourceFiles.size, sourceMutationCount, assetMutationCount, oneHMutationCount }, null, 2));
}

main();
