import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const pilotPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'metadata-pilot-20260820.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'review');

/** Final human semantic-review batch for every remaining auto_medium candidate. */
const decisions = {
    qid_v1_c70d30edca03dce3ae98aeeaea2e0de04c0a4113903f23a65cc8ec90edd32148: { disposition: 'partial_manual_review', note: '15°를 이루는 직각삼각형의 삼각비를 구하는 문항이다. 피타고라스 길이 계산 후보는 핵심 단원을 잘못 잡았다.' },
    qid_v1_d16501aaf63624d73d5e8c08dfe30fc30fd0fedbba620dfa9e7e660a3a1c32b5: { disposition: 'reviewed_pass', note: '일차함수의 절편과 두 삼각형 넓이 비로 교점을 구한다. 일차함수 그래프 후보가 일치한다.' },
    qid_v1_da0667223334e1e3addecfa01e853557bf94d01166857d3271db14429e5953e9: { disposition: 'partial_manual_review', note: '부등호 조건을 치환해 중복조합을 적용하는 조합 문항이다. 확률 경우 분류 후보는 오분류다.' },
    qid_v1_e538a587965dedb8c32235009b1baf38fefb22b20ce5ec26c8477513d5c4f25a: { disposition: 'partial_manual_review', note: '좌표평면에서 삼각형 무게중심과 거리 제곱합의 최소를 구한다. 피타고라스 후보는 핵심 유형과 다르다.' },
    qid_v1_e7380972e367fcca30dbe6cfeb14ab7447bb0c326200383e43fa3bb4b7601aae: { disposition: 'partial_manual_review', note: '유리계수 다항방정식의 무리근 켤레성과 치환된 방정식의 근을 다룬다. 이차방정식 판별식 후보는 오분류다.' },
    qid_v1_e74349be7994bdfbf134b7281c3b811e7d7dd5442dc027f353c63437fbda0a23: { disposition: 'partial_manual_review', note: '삼차함수, 접선, 절댓값 형태 h(x), 도함수 조건을 결합한 미적분 문항이다. 판별식 후보는 맞지 않는다.' },
    qid_v1_da7c0dc30fbdd538feb4f4a4d70ada227051eff8221fa1e8897ef4c5b1b1dcf6: { disposition: 'partial_manual_review', note: '삼차방정식을 인수분해한 뒤 이차식의 두 근이 구간에 있는 조건을 판정한다. 여러 가지 방정식의 근 분리 문항으로 별도 검토가 필요하다.' },
    qid_v1_f9c2e487344cf0eb074733d83d19d87de4c4101993496bbf64c12bb090ff65f7: { disposition: 'partial_manual_review', note: '서로 다른 빵의 제한 배분을 경우로 나누어 세는 문항이다. 확률 경우 분류 후보는 조합·배분 유형을 정확히 나타내지 못한다.' },
    qid_v1_fb7ec71424e2a59eff083828fcf4cd873b7bbefb887c7c6dc4791ea660e14cfa: { disposition: 'partial_manual_review', note: '지름에 대한 원주각과 cos 배각 공식을 적용한다. 피타고라스는 보조 계산일 뿐 핵심은 사인·코사인법칙/삼각함수다.' },
    qid_v1_d955df581b45ac8df8403eb2c68cdf330f02c4f40f8b1882b487bdbccee6e956: { disposition: 'reviewed_pass', note: '흰 공 수를 미지수로 두고 확률식을 세워 구한다. 경우의 수·확률 후보가 원문·해설과 일치한다.' },
    qid_v1_dae274cb2ec304a5e2bd854ac3d05b7af18ff8a9a2720fed024df2b6cae9efdb: { disposition: 'reviewed_pass', note: '선분과 일차방정식 그래프의 교점이 선분 범위에 있는지 판정한다. 일차함수·두 점 템플릿 후보가 일치한다.' },
    qid_v1_dbf1c8a783e191f08cabd1b446c2825ecfe61a15628663375ab76cbb5c1242c4: { disposition: 'reviewed_pass', note: '기울기 부호로 일차함수 그래프의 방향을 판정한다. 일차함수 그래프 후보가 일치한다.' },
    qid_v1_ff0ea73f93714321abb5ca64d49de0202cce0cbe33c65dd66d965c9904b7d153: { disposition: 'reviewed_pass', note: '주어진 일차함수에 입력값을 대입해 함수값을 구한다. 일차함수 그래프 후보가 일치한다.' },
    qid_v1_b787d9bab647db310fb29e812b7fbc540a9f37f96e11e4ea028cb38020b6cc9e: { disposition: 'partial_manual_review', note: '접선과 반지름의 수직 관계 및 원의 중심을 이용하는 원의 성질 문항이다. 피타고라스 후보는 보조 계산에 치우쳐 있다.' },
    qid_v1_e008cc68f69707730a000c9063558b24f6d943a0d3701d34f05dbdfc8f088e8a: { disposition: 'partial_manual_review', note: '직각삼각형의 빗변과 한 예각으로 합동을 판단한다. 피타고라스 길이 계산 후보는 핵심 도형 성질과 맞지 않는다.' },
    qid_v1_f267a46179b0b74d1907a495314f08cecc72fa79608ddb747213a778b62de3ad: { disposition: 'partial_manual_review', note: '두 직각삼각형의 탄젠트 관계로 둘레를 구하는 삼각비 문항이다. 피타고라스 후보는 핵심 단원을 잘못 잡았다.' }
};

const segments = { advanced: [11, 6], track_h1: [8, 1], track_h2: [6, 2], track_m2: [9, 4], visual: [9, 3] };
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function countBy(items, field) {
    const counts = {};
    for (const item of items) counts[item[field]] = (counts[item[field]] || 0) + 1;
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function selectBatch(items) {
    const byCohort = Object.groupBy(items.filter(item => item.candidate.tagStatus === 'auto_medium'), item => item.cohort);
    const selected = [];
    for (const [cohort, [start, count]] of Object.entries(segments)) {
        const candidates = (byCohort[cohort] || []).sort((a, b) => a.questionUid.localeCompare(b.questionUid));
        if (candidates.length < start + count) throw new Error(`${cohort}: insufficient auto_medium records for batch 4`);
        selected.push(...candidates.slice(start, start + count));
    }
    return selected;
}

function summaryMarkdown(report) {
    const rows = Object.entries(report.totals.dispositions).map(([name, count]) => `| ${name} | ${count} |`).join('\n');
    return `# Phase 1 Pilot — Medium-Confidence Semantic Review, Batch 4\n\n- Reviewed: ${report.totals.reviewedBatchRecords} auto_medium candidates\n- Total auto_medium reviewed: ${report.totals.totalAutoMediumReviewed} / ${report.totals.autoMediumCandidates}\n- Total pilot records reviewed so far: ${report.totals.totalPilotReviewed}\n- Remaining pilot records: ${report.totals.remainingPending}\n- Production metadata write: none\n\n## Dispositions\n\n| Disposition | Count |\n|---|---:|\n${rows}\n\n## Result\n\nAll 70 auto_medium candidates have now received a manual semantic decision. Eleven in this final batch were retained for manual review because their candidate metadata described a secondary technique rather than the primary mathematical topic.\n`;
}

export function reviewMediumPilotBatchFour() {
    const pilot = JSON.parse(fs.readFileSync(pilotPath, 'utf8'));
    const batch = selectBatch(pilot.items);
    const missing = batch.filter(item => !decisions[item.questionUid]).map(item => item.questionUid);
    if (missing.length || Object.keys(decisions).length !== batch.length) throw new Error(`review decision set mismatch: ${missing.join(', ')}`);
    const prior = JSON.parse(fs.readFileSync(path.join(outputDir, 'medium-batch-3-semantic-review.json'), 'utf8'));
    const reviews = batch.map(item => ({ questionUid: item.questionUid, cohort: item.cohort, sourceArchiveFile: item.sourceArchiveFile, sourceOrdinal: item.sourceOrdinal, existingMetadata: item.existingMetadata, candidate: item.candidate, review: decisions[item.questionUid] }));
    const autoMediumCandidates = pilot.items.filter(item => item.candidate.tagStatus === 'auto_medium').length;
    const stableReport = {
        schemaVersion: 'phase1-pilot-medium-batch-4-review-v1',
        pilotDigest: pilot.digest,
        productionWriteAllowed: false,
        batchSelection: 'final lexical question UID segment in all remaining auto_medium cohorts',
        totals: {
            autoMediumCandidates,
            reviewedBatchRecords: reviews.length,
            totalAutoMediumReviewed: autoMediumCandidates,
            remainingAutoMedium: 0,
            totalPilotReviewed: prior.totals.totalPilotReviewed + reviews.length,
            remainingPending: pilot.items.length - prior.totals.totalPilotReviewed - reviews.length,
            dispositions: countBy(reviews.map(item => ({ disposition: item.review.disposition })), 'disposition'),
            cohorts: countBy(reviews, 'cohort')
        },
        reviews
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = reviewMediumPilotBatchFour();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'medium-batch-4-semantic-review.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'medium-batch-4-semantic-review.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase1/pilot/review/medium-batch-4-semantic-review.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
