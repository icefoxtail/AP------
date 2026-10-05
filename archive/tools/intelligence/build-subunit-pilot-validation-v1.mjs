import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const queueDir = path.join(archiveDir, '_generated/intelligence/phase3/coverage-queue');
const masterPath = path.join(archiveDir, 'data/master_tables/js_archive_tag_master.json');
const coverageSummaryPath = path.join(archiveDir, '_generated/intelligence/phase3/coverage-queue/archive-subunit-coverage-all-progress-v1.json');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/subunit-pilot-validation');
const outputPath = path.join(outputDir, 'archive-subunit-pilot-validation-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const pad = n => String(n).padStart(3, '0');
const compact = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, ' ').trim();
const cueOverrides = { EXPONENT_LAW: ['지수', '거듭제곱', '밑'], LOGARITHMIC_FUNCTION: ['로그'], EXPONENTIAL_FUNCTION: ['지수함수'], QUADRATIC_EQUATION: ['이차방정식', '근의 공식', '판별식', '인수분해', '근'], QUADRATIC_FUNCTION_GRAPH: ['이차함수', '꼭짓점', '축'], QUADRATIC_FUNCTION_APPLICATION: ['이차함수', '최댓값', '최솟값', '넓이'], LINEAR_FUNCTION_GRAPH: ['일차함수', '기울기', '절편'], LINEAR_FUNCTION_EQUATION_RELATION: ['일차방정식', '두 직선', '교점', '평행'], TRIANGLE_PROPERTIES: ['삼각형', '이등변', '직각삼각형', '합동', '내심', '외심', '무게중심'], QUADRILATERAL_PROPERTIES: ['평행사변형', '사다리꼴', '직사각형', '마름모', '정사각형'], SIMILAR_FIGURE: ['닮음', '닮은'], PARALLEL_LENGTH_RATIO: ['평행선', '선분의 길이의 비'], PYTHAGOREAN_THEOREM: ['피타고라스', '빗변'], PYTHAGOREAN_APPLICATION: ['피타고라스', '높이', '거리'], PROBABILITY_BASIC: ['확률', '사건', '표본공간'], PROBABILITY_COUNTING: ['경우의 수', '순열', '조합'], PERMUTATION: ['순열', '배열'], COMBINATION: ['조합'], CIRCULAR_PERMUTATION: ['원순열', '원탁'], DUPLICATE_PERMUTATION: ['중복순열', '중복'], STATISTICS_REPRESENTATIVE: ['평균', '중앙값', '최빈값'], DATA_INTERPRETATION: ['자료', '그래프'], FACTORIZATION: ['인수분해'], POLYNOMIAL_OPERATIONS: ['다항식', '전개'], LINEAR_EQUATION: ['일차방정식'], LINEAR_INEQUALITY: ['일차부등식'], TRIGONOMETRIC_EQUATION: ['삼각방정식', 'sin', 'cos', 'tan'], TRIGONOMETRIC_FUNCTION: ['삼각함수', 'sin', 'cos', 'tan'], TRIGONOMETRIC_GRAPH: ['삼각함수', '주기'], MATRIX_BASIC: ['행렬'], MATRIX_OPERATION: ['행렬', '행렬의 연산'], LIMIT: ['극한'], DERIVATIVE: ['미분', '도함수'], INTEGRAL: ['적분'], RATIONAL_NUMBER_OPERATIONS: ['유리수', '계산'], PRIME_FACTORIZATION: ['소인수분해'], GCD_LCM: ['최대공약수', '최소공배수'] };

function cuesFor(item) { const values = [item.subUnit ?? '', ...(cueOverrides[item.conceptClusterKey] ?? [])]; return [...new Set(values.flatMap(value => String(value).match(/[가-힣]{2,}|[A-Z][A-Z_]{3,}/g) ?? []))].filter(value => value.length >= 2); }
function scoreRecord(record, siblings) {
  const content = compact(`${record.source?.content ?? ''} ${(record.source?.choices ?? []).join(' ')}`);
  const solution = compact(record.source?.solution ?? '');
  const scored = siblings.map(item => { const cues = cuesFor(item); const contentHits = cues.filter(cue => content.includes(cue)); const solutionHits = cues.filter(cue => solution.includes(cue)); return { item, contentHits, solutionHits, contentScore: contentHits.length, solutionScore: solutionHits.length, totalScore: contentHits.length + solutionHits.length }; }).sort((a, b) => b.totalScore - a.totalScore || a.item.subUnitKey.localeCompare(b.item.subUnitKey, 'en'));
  const contentRank = [...scored].sort((a, b) => b.contentScore - a.contentScore || a.item.subUnitKey.localeCompare(b.item.subUnitKey, 'en'));
  const solutionRank = [...scored].sort((a, b) => b.solutionScore - a.solutionScore || a.item.subUnitKey.localeCompare(b.item.subUnitKey, 'en'));
  const unique = (rank, field) => rank[0] && rank[0][field] > 0 && (!rank[1] || rank[0][field] > rank[1][field]) ? rank[0].item.subUnitKey : null;
  const contentLabel = unique(contentRank, 'contentScore'); const solutionLabel = unique(solutionRank, 'solutionScore');
  const primaryLabel = scored[0] && scored[0].totalScore > 0 && (!scored[1] || scored[0].totalScore > scored[1].totalScore) ? scored[0].item.subUnitKey : null;
  return { contentLabel, solutionLabel, primaryLabel, ranked: scored.slice(0, 4).map(item => ({ subUnitKey: item.item.subUnitKey, contentHits: item.contentHits, solutionHits: item.solutionHits, contentScore: item.contentScore, solutionScore: item.solutionScore, totalScore: item.totalScore })) };
}

function loadRecords() {
  const records = [];
  for (let batch = 1; batch <= 35; batch += 1) {
    const packet = JSON.parse(fs.readFileSync(path.join(queueDir, `archive-subunit-review-batch-${pad(batch)}-v1.json`), 'utf8'));
    const adjudication = JSON.parse(fs.readFileSync(path.join(queueDir, `archive-subunit-coverage-batch-${pad(batch)}-adjudication-v1.json`), 'utf8'));
    const byOrder = new Map(adjudication.records.map(record => [record.reviewOrder, record]));
    for (const record of packet.records) records.push({ ...record, adjudication: byOrder.get(record.reviewOrder) });
  }
  return records.sort((a, b) => a.reviewOrder - b.reviewOrder);
}

function sampleForKey(key, allRecords, siblings) {
  const eligible = allRecords.filter(record => record.standardUnitKey === key.standardUnitKey && record.source?.content && record.source?.solution && !String(record.source.content).includes('[그래프필요]') && !String(record.source.content).includes('[도형필요]'));
  const evaluated = eligible.map(record => ({ record, evidence: scoreRecord(record, siblings) }));
  const strong = evaluated.filter(item => item.record.adjudication?.disposition === 'PILOT_CANDIDATE' && item.record.adjudication?.proposedSubUnitKey === key.subUnitKey).slice(0, 20);
  const boundary = evaluated.filter(item => { const ranked = item.evidence.ranked; return ranked.length > 1 && Math.abs((ranked[0].totalScore ?? 0) - (ranked[1].totalScore ?? 0)) <= 1; }).slice(0, 20);
  const disagreement = evaluated.filter(item => item.evidence.contentLabel && item.evidence.solutionLabel && item.evidence.contentLabel !== item.evidence.solutionLabel).slice(0, 10);
  const serialize = (items, sampleType) => items.map(item => ({ reviewOrder: item.record.reviewOrder, questionUid: item.record.questionUid, sourceArchiveFile: item.record.sourceArchiveFile, sourceOrdinal: item.record.sourceOrdinal, sampleType, proposedSubUnitKey: item.record.adjudication?.proposedSubUnitKey ?? '', independent: item.evidence }));
  const samples = [...serialize(strong, 'strong'), ...serialize(boundary, 'boundary'), ...serialize(disagreement, 'disagreement')];
  const strongSamples = samples.filter(sample => sample.sampleType === 'strong'); const boundarySamples = samples.filter(sample => sample.sampleType === 'boundary');
  const compared = samples.filter(sample => sample.independent.contentLabel && sample.independent.solutionLabel); const sourceAgreement = compared.length ? compared.filter(sample => sample.independent.contentLabel === sample.independent.solutionLabel).length / compared.length : 0;
  const boundaryResolved = boundarySamples.length ? boundarySamples.filter(sample => sample.independent.primaryLabel).length / boundarySamples.length : 0;
  const candidateAgreement = strongSamples.length ? strongSamples.filter(sample => sample.independent.primaryLabel === key.subUnitKey).length / strongSamples.length : 0;
  const status = strongSamples.length >= 10 && boundarySamples.length >= 10 && sourceAgreement >= 0.85 && boundaryResolved >= 0.90 && candidateAgreement >= 0.90 ? 'APPROVED_CANDIDATE' : 'REVIEW_REQUIRED';
  return { standardUnitKey: key.standardUnitKey, subUnitKey: key.subUnitKey, subUnit: key.subUnit, sampleCounts: { strong: strongSamples.length, boundary: boundarySamples.length, disagreement: samples.filter(sample => sample.sampleType === 'disagreement').length, total: samples.length }, metrics: { sourceSolutionAgreementRate: Number(sourceAgreement.toFixed(4)), boundaryResolutionRate: Number(boundaryResolved.toFixed(4)), candidateAgreementRate: Number(candidateAgreement.toFixed(4)) }, status, productionUsable: false, samples, reason: status === 'APPROVED_CANDIDATE' ? '표본 규모·본문/해설 일치·경계 분리 기준을 모두 통과한 승인 후보. master 반영 전 사용자 승인이 필요하다.' : '표본 규모 또는 본문·해설 일치/경계 분리 기준 미달. 표준단원 fallback과 수동 검토를 유지한다.' };
}

export function buildSubunitPilotValidationV1() {
  const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
  const active = master.filter(item => item.keyType === 'subUnitKey' && item.status === 'active');
  const coverageSummary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
  const proposedKeys = Object.keys(coverageSummary.proposedSubUnits);
  const keys = active.filter(item => proposedKeys.includes(item.subUnitKey));
  const allRecords = loadRecords(); const byStandard = new Map(); for (const item of active) (byStandard.get(item.standardUnitKey) ?? byStandard.set(item.standardUnitKey, []).get(item.standardUnitKey)).push(item);
  const entries = keys.map(key => sampleForKey(key, allRecords, byStandard.get(key.standardUnitKey) ?? [key]));
  const stable = { schemaVersion: 'archive-subunit-pilot-validation-v1', productionWriteAllowed: false, sourcePolicy: { contentAndSolutionRequired: true, visualMarkerRequiresManualReview: true, approvalThresholds: { minimumStrongSamples: 10, minimumBoundarySamples: 10, sourceSolutionAgreement: 0.85, boundaryResolution: 0.90, candidateAgreement: 0.90 } }, totals: { proposedKeys: entries.length, approvedCandidates: entries.filter(entry => entry.status === 'APPROVED_CANDIDATE').length, reviewRequired: entries.filter(entry => entry.status === 'REVIEW_REQUIRED').length, samples: entries.reduce((sum, entry) => sum + entry.sampleCounts.total, 0) }, entries };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = buildSubunitPilotValidationV1(); fs.mkdirSync(outputDir, { recursive: true }); fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}
