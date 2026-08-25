import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const adjudicationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'independent-high-candidate-adjudication', 'archive-independent-high-candidate-adjudication-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'independent-high-candidate-gates');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function checkIndependentHighCandidateGatesV1() {
    const adjudication = JSON.parse(fs.readFileSync(adjudicationPath, 'utf8'));
    const domains = adjudication.domains.map(domain => {
        const candidateStrongReady = domain.candidates.every(candidate => candidate.strongCount >= 10);
        const coverageReady = domain.sampleCount >= 50;
        const boundaryReady = domain.boundaryCount >= 20;
        const agreementRate = domain.sampleCount === 0 ? 0 : domain.confirmed / domain.sampleCount;
        const accuracyReady = agreementRate >= 0.9;
        const passed = coverageReady && candidateStrongReady && boundaryReady && accuracyReady && domain.reviewRequired === 0;
        return {
            standardUnitKey: domain.standardUnitKey,
            sampleCount: domain.sampleCount,
            confirmed: domain.confirmed,
            reviewRequired: domain.reviewRequired,
            boundaryCount: domain.boundaryCount,
            boundaryConfirmed: domain.boundaryConfirmed,
            agreementRate: Number(agreementRate.toFixed(3)),
            coverageReady,
            candidateStrongReady,
            boundaryReady,
            accuracyReady,
            gateStatus: passed ? 'PASSED_AI_CANDIDATE' : 'FAIL_CLOSED_INDEPENDENT_HIGH',
            productionUsable: false
        };
    });
    const stableReport = {
        schemaVersion: 'archive-independent-high-candidate-gates-v1',
        adjudicationDigest: adjudication.digest,
        productionWriteAllowed: false,
        policy: {
            minimumSamples: 50,
            minimumStrongPerCandidate: 10,
            minimumBoundarySamples: 20,
            agreementMin: 0.9,
            reviewRequiredMax: 0
        },
        totals: {
            domains: domains.length,
            passedAiCandidates: domains.filter(domain => domain.gateStatus === 'PASSED_AI_CANDIDATE').length,
            failedClosed: domains.filter(domain => domain.gateStatus === 'FAIL_CLOSED_INDEPENDENT_HIGH').length
        },
        domains
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = checkIndependentHighCandidateGatesV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-independent-high-candidate-gates-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/independent-high-candidate-gates/archive-independent-high-candidate-gates-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
