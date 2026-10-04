import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const adjudicationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-adjudication', 'archive-subunit-conflict-adjudication-v1.json');
const gatesPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-gates', 'archive-subunit-conflict-gates-v2.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-dispositions');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function finalizeSubunitConflictDispositionsV1() {
    const adjudication = JSON.parse(fs.readFileSync(adjudicationPath, 'utf8'));
    const gates = JSON.parse(fs.readFileSync(gatesPath, 'utf8'));
    const gateByStandard = new Map(gates.pairs.map(pair => [pair.standardUnitKey, pair]));
    const dispositions = adjudication.recommendations.map(item => {
        const gate = gateByStandard.get(item.standardUnitKey);
        const gateStatus = gate?.gateStatus ?? 'NOT_APPLICABLE_STANDARD_UNIT';
        const failed = gateStatus !== 'PASSED_AI_CANDIDATE';
        const disposition = item.recommendation === 'SEPARATE_CANDIDATE_WITH_PRIMARY_GOAL_GUARD'
            ? 'DRAFT_RETAINED_STANDARD_FALLBACK'
            : 'STANDARD_UNIT_ONLY';
        return {
            pairKey: item.pairKey,
            standardUnitKey: item.standardUnitKey,
            subUnitKeys: item.subUnitKeys,
            recommendation: item.recommendation,
            gateStatus,
            disposition,
            runtimeTagging: 'STANDARD_UNIT_FALLBACK',
            productionUsable: false,
            reason: failed
                ? '승격 gate 미달 또는 보류 표본 잔존; 세부 태그를 실행 경로에 노출하지 않음'
                : 'gate 통과 후보이나 최종 운영 승인 전 fallback 유지'
        };
    });
    const stableReport = {
        schemaVersion: 'archive-subunit-conflict-dispositions-v1',
        adjudicationDigest: adjudication.digest,
        gatesDigest: gates.digest,
        status: 'FALLBACK_LOCKED',
        productionWriteAllowed: false,
        totals: {
            conflictPairs: dispositions.length,
            draftRetainedFallback: dispositions.filter(item => item.disposition === 'DRAFT_RETAINED_STANDARD_FALLBACK').length,
            standardUnitOnly: dispositions.filter(item => item.disposition === 'STANDARD_UNIT_ONLY').length,
            productionUsable: dispositions.filter(item => item.productionUsable).length
        },
        dispositions
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = finalizeSubunitConflictDispositionsV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-conflict-dispositions-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/subunit-conflict-dispositions/archive-subunit-conflict-dispositions-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
