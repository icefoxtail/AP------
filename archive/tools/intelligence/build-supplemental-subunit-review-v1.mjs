import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const cuesPath = path.join(archiveDir, 'data', 'master_tables', 'subunit_conflict_goal_cues_v1.json');
const resamplesPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'independent-subunit-resamples', 'archive-independent-subunit-resamples-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const compact = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, '').replace(/[·,\.()[\]{}:;!?/\\+*=<>~%\-]/g, '');
const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();

function existingUids(resamples) {
    return new Set(resamples.pairs.flatMap(pair => [
        ...Object.values(pair.strongByGoal).flat(),
        ...pair.boundary,
        ...pair.disagreement
    ]).map(sample => sample.questionUid));
}

function rankCandidates(pair, records, used) {
    return records.filter(record => record.standardUnitKey === pair.standardUnitKey && !used.has(record.questionUid)).map(record => {
        const text = compact(`${record.content} ${record.solution}`);
        const hits = Object.fromEntries(pair.keys.map(key => [key, pair.goals[key].cues.filter(cue => text.includes(compact(cue)))]));
        const counts = pair.keys.map(key => hits[key].length);
        return { ...record, hits, counts, total: counts[0] + counts[1], balance: Math.min(...counts), mixed: counts[0] > 0 && counts[1] > 0 };
    });
}

function selectDiverse(candidates, limit, used) {
    const selected = [];
    const sourceCounts = new Map();
    const ordered = [...candidates].sort((a, b) => b.balance - a.balance || b.total - a.total || a.questionUid.localeCompare(b.questionUid));
    for (const passLimit of [1, 2, Number.POSITIVE_INFINITY]) {
        for (const candidate of ordered) {
            if (selected.length >= limit) break;
            if (used.has(candidate.questionUid)) continue;
            const count = sourceCounts.get(candidate.sourceArchiveFile) ?? 0;
            if (count >= passLimit) continue;
            selected.push(candidate);
            used.add(candidate.questionUid);
            sourceCounts.set(candidate.sourceArchiveFile, count + 1);
        }
    }
    return selected;
}

function detail(candidate, sampleType, pair, qualifiesForBoundaryCoverage) {
    return {
        questionUid: candidate.questionUid,
        sourceArchiveFile: candidate.sourceArchiveFile,
        sourceOrdinal: candidate.sourceOrdinal,
        standardUnitKey: candidate.standardUnitKey,
        subUnitKeys: pair.keys,
        sampleType,
        qualifiesForBoundaryCoverage,
        cueHits: candidate.hits,
        contentText: clean(candidate.content),
        solutionText: clean(candidate.solution),
        manualDecision: 'PENDING_MANUAL_REVIEW',
        productionWriteAllowed: false
    };
}

export function buildSupplementalSubunitReviewV1() {
    const cues = JSON.parse(fs.readFileSync(cuesPath, 'utf8'));
    const resamples = JSON.parse(fs.readFileSync(resamplesPath, 'utf8'));
    const used = existingUids(resamples);
    const records = [];
    for (const file of scanExamBank().files) {
        const sourceArchiveFile = file.sourceFile.replace('archive/exams/', '');
        for (const question of file.questions) records.push({
            questionUid: `${sourceArchiveFile}#${question.originalIndex + 1}`,
            sourceArchiveFile,
            sourceOrdinal: question.originalIndex + 1,
            standardUnitKey: question.standardUnitKey,
            content: `${question.content ?? ''} ${(question.choices ?? []).join(' ')}`,
            solution: question.solution ?? ''
        });
    }
    const plan = [
        { standardUnitKey: 'M2-05', mixedLimit: 10, singleLimit: 0 },
        { standardUnitKey: 'M3-03', mixedLimit: 20, singleLimit: 6 }
    ];
    const pairs = plan.map(item => {
        const pair = cues.pairs.find(candidate => candidate.standardUnitKey === item.standardUnitKey);
        const candidates = rankCandidates(pair, records, used);
        const mixed = selectDiverse(candidates.filter(candidate => candidate.mixed), item.mixedLimit, used);
        const single = selectDiverse(candidates.filter(candidate => !candidate.mixed && candidate.total > 0), item.singleLimit, used);
        return {
            standardUnitKey: item.standardUnitKey,
            subUnitKeys: pair.keys,
            poolCount: candidates.length,
            requestedMixed: item.mixedLimit,
            requestedSingleGoalAudit: item.singleLimit,
            actualMixed: mixed.length,
            actualSingleGoalAudit: single.length,
            samples: [
                ...mixed.map(candidate => detail(candidate, 'supplemental_mixed_boundary', pair, true)),
                ...single.map(candidate => detail(candidate, 'supplemental_single_goal_audit', pair, false))
            ]
        };
    });
    const stableReport = {
        schemaVersion: 'archive-supplemental-subunit-review-v1',
        sourceResamplesDigest: resamples.digest,
        productionWriteAllowed: false,
        status: 'SUPPLEMENTAL_REVIEW_PENDING',
        policy: {
            mixedSamplesOnlyCountTowardBoundaryCoverage: true,
            singleGoalAuditsNeverCountTowardBoundaryCoverage: true,
            sourceAndMasterWrites: false
        },
        totals: {
            pairs: pairs.length,
            samples: pairs.reduce((sum, pair) => sum + pair.samples.length, 0),
            mixedBoundaryCandidates: pairs.reduce((sum, pair) => sum + pair.actualMixed, 0),
            singleGoalAudits: pairs.reduce((sum, pair) => sum + pair.actualSingleGoalAudit, 0)
        },
        pairs
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = buildSupplementalSubunitReviewV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-supplemental-subunit-review-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-supplemental-subunit-review-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
