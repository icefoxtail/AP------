import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..', '..');
const evidenceDir = path.join(repoRoot, 'archive', 'data', 'meta-foundation', 'evidence', 'middle-geometry', 'v1');
const ledgerPath = path.join(evidenceDir, 'item_level_assignment_928.json');

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
    fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

function apply() {
    const ledger = readJson(ledgerPath);
    const batchFiles = fs.readdirSync(evidenceDir)
        .filter(file => /^difficulty_blind_batch_\d+.*\.json$/.test(file))
        .sort();
    const byUid = new Map(ledger.records.map(record => [record.questionUid, record]));
    const seen = new Set();
    const batchReports = [];
    for (const file of batchFiles) {
        const batch = readJson(path.join(evidenceDir, file));
        for (const decision of batch.records || []) {
            if (seen.has(decision.questionUid)) throw new Error(`duplicate blind decision across batches: ${decision.questionUid}`);
            const record = byUid.get(decision.questionUid);
            if (!record) throw new Error(`blind decision UID not in ledger: ${decision.questionUid}`);
            const expectedSource = `${record.sourceArchiveFile}#${record.sourceOrdinal}`;
            if (decision.source !== expectedSource) throw new Error(`blind decision source mismatch for ${decision.questionUid}: ${decision.source} != ${expectedSource}`);
            if (!record.problemTypeKey) throw new Error(`route-out cannot receive mapped blind decision: ${decision.questionUid}`);
            seen.add(decision.questionUid);
            record.difficultyBucket = decision.difficultyBucket;
            record.difficultyConfidence = decision.difficultyConfidence;
            record.difficultyBoundaryFlag = decision.difficultyBoundaryFlag;
            record.heuristicCandidate = false;
            record.difficultyReviewStatus = 'BLIND_REVIEWED_PENDING_FREEZE';
            record.reviewStatus = 'BLIND_REVIEWED_PENDING_FREEZE';
            record.legacyLevelCompatibility = 'UNKNOWN';
            record.eligibilityStatus = 'PENDING_LEGACY_COMPARE_AND_RECHECK';
            record.defaultSelectable = false;
            record.evidence.blindReview = {
                batchId: batch.batchId,
                status: 'BLIND_REVIEWED',
                inputs: batch.blindInputs,
                hiddenInputs: batch.hiddenInputs,
                reason: decision.reason
            };
        }
        batchReports.push({ batchId: batch.batchId, file, count: (batch.records || []).length, status: batch.status });
    }
    const mapped = ledger.records.filter(record => Boolean(record.problemTypeKey));
    const progress = {
        schemaVersion: 'middle-geometry-blind-review-progress-v1',
        status: seen.size === mapped.length ? 'BLIND_REVIEW_COMPLETE_PENDING_FREEZE' : 'BLIND_REVIEW_IN_PROGRESS',
        denominator: 923,
        reviewedCount: seen.size,
        remainingCount: mapped.length - seen.size,
        batchCount: batchReports.length,
        batches: batchReports,
        legacyUsedDuringBlind: false,
        automaticPromotion: false,
        nextStart: mapped.length - seen.size > 0 ? 'next unreviewed mapped UID batch' : 'blind freeze → legacy compare → trigger union'
    };
    ledger.blindReview = progress;
    ledger.status = progress.status === 'BLIND_REVIEW_COMPLETE_PENDING_FREEZE' ? 'CANDIDATE_BLIND_REVIEW_COMPLETE_PENDING_FREEZE' : 'CANDIDATE_BLIND_REVIEW_IN_PROGRESS';
    writeJson(ledgerPath, ledger);
    const m2Path = path.join(evidenceDir, 'm2_item_level_l3_ledger_402.json');
    const m3Path = path.join(evidenceDir, 'm3_stage2_l3_fresh_assignment_526.json');
    const m2 = readJson(m2Path);
    const m3 = readJson(m3Path);
    const records = new Map(ledger.records.map(record => [record.questionUid, record]));
    m2.records = m2.records.map(record => records.get(record.questionUid) || record);
    m3.records = m3.records.map(record => records.get(record.questionUid) || record);
    m2.blindReview = progress;
    m3.blindReview = progress;
    writeJson(m2Path, m2);
    writeJson(m3Path, m3);
    writeJson(path.join(evidenceDir, 'difficulty_blind_progress_923.json'), progress);
    console.log(JSON.stringify(progress, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) apply();
