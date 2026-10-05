import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const resamplesPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'independent-subunit-resamples', 'archive-independent-subunit-resamples-v1.json');
const adjudicationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'independent-subunit-adjudication', 'archive-independent-subunit-adjudication-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'independent-subunit-gates');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function checkIndependentSubunitGatesV1() {
    const resamples = JSON.parse(fs.readFileSync(resamplesPath, 'utf8'));
    const adjudication = JSON.parse(fs.readFileSync(adjudicationPath, 'utf8'));
    const adjudicationByKey = new Map(adjudication.pairs.map(pair => [pair.standardUnitKey, pair]));
    const pairs = resamples.pairs.map(resample => {
        const adjudicated = adjudicationByKey.get(resample.standardUnitKey);
        const strongCounts = Object.fromEntries(Object.entries(resample.strongByGoal).map(([key, samples]) => [key, samples.length]));
        const boundaryCount = resample.boundary.length;
        const boundaryAgreementRate = boundaryCount === 0 ? 0 : adjudicated.boundaryConfirmed / boundaryCount;
        const coverageReady = boundaryCount >= 20 && Object.values(strongCounts).every(count => count >= 20);
        const accuracyReady = boundaryAgreementRate >= 0.9;
        const agreementReady = adjudicated.boundaryReviewRequired === 0;
        const passed = coverageReady && accuracyReady && agreementReady;
        return {
            standardUnitKey: resample.standardUnitKey,
            strongCounts,
            boundaryCount,
            boundaryConfirmed: adjudicated.boundaryConfirmed,
            boundaryReviewRequired: adjudicated.boundaryReviewRequired,
            boundaryAgreementRate: Number(boundaryAgreementRate.toFixed(3)),
            coverageReady,
            accuracyReady,
            agreementReady,
            gateStatus: passed ? 'PASSED_AI_CANDIDATE' : 'FAIL_CLOSED_INDEPENDENT_BOUNDARY',
            productionUsable: false,
            reason: passed ? '독립 표본 gate 충족; 최종 승인 전 대기' : '독립 경계 표본의 수·합의율·보류 조건 중 하나 이상 미달'
        };
    });
    const stableReport = {
        schemaVersion: 'archive-independent-subunit-gates-v1',
        resamplesDigest: resamples.digest,
        adjudicationDigest: adjudication.digest,
        productionWriteAllowed: false,
        gatePolicy: {
            boundarySampleMin: 20,
            strongSampleMinPerKey: 20,
            boundaryAccuracyMin: 0.9,
            boundaryReviewRequiredMax: 0
        },
        totals: {
            pairs: pairs.length,
            passedAiCandidates: pairs.filter(pair => pair.gateStatus === 'PASSED_AI_CANDIDATE').length,
            failedClosed: pairs.filter(pair => pair.gateStatus === 'FAIL_CLOSED_INDEPENDENT_BOUNDARY').length
        },
        pairs
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = checkIndependentSubunitGatesV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-independent-subunit-gates-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/independent-subunit-gates/archive-independent-subunit-gates-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
