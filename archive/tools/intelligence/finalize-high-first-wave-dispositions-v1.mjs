import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'high-first-wave-candidate-review', 'archive-high-first-wave-candidate-review-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'high-first-wave-dispositions');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function finalizeHighFirstWaveDispositionsV1() {
    const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
    const domains = review.domains.map(domain => ({
        standardUnitKey: domain.standardUnitKey,
        candidateCount: domain.candidateCount,
        reviewStatus: domain.reviewStatus,
        disposition: 'PROPOSED_ONLY_STANDARD_FALLBACK',
        runtimeTagging: 'STANDARD_UNIT_FALLBACK',
        productionUsable: false,
        reason: '후보 strong shortfall 또는 경계 중첩으로 고등 세부키 승격 gate 미달'
    }));
    const stableReport = {
        schemaVersion: 'archive-high-first-wave-dispositions-v1',
        reviewDigest: review.digest,
        status: 'FALLBACK_LOCKED',
        productionWriteAllowed: false,
        totals: {
            domains: domains.length,
            proposedOnlyFallback: domains.filter(domain => domain.disposition === 'PROPOSED_ONLY_STANDARD_FALLBACK').length,
            productionUsable: domains.filter(domain => domain.productionUsable).length
        },
        domains
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = finalizeHighFirstWaveDispositionsV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-high-first-wave-dispositions-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/high-first-wave-dispositions/archive-high-first-wave-dispositions-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
