import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const queuePath = path.join(archiveDir, '_generated/intelligence/phase3/coverage-queue/archive-subunit-coverage-queue-v1.json');
const masterPath = path.join(archiveDir, 'data/master_tables/js_archive_tag_master.json');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/coverage-queue');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const pad = n => String(n).padStart(3, '0');
const compact = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, ' ').trim();

const cueOverrides = {
  EXPONENT_LAW: ['지수', '거듭제곱', '밑'], LOGARITHMIC_FUNCTION: ['로그'], EXPONENTIAL_FUNCTION: ['지수함수'],
  QUADRATIC_EQUATION: ['이차방정식', '근의 공식', '판별식', '인수분해', '근'], QUADRATIC_FUNCTION_GRAPH: ['이차함수', '꼭짓점', '축'], QUADRATIC_FUNCTION_APPLICATION: ['이차함수', '최댓값', '최솟값', '넓이'],
  LINEAR_FUNCTION_GRAPH: ['일차함수', '기울기', '절편'], LINEAR_FUNCTION_EQUATION_RELATION: ['일차방정식', '두 직선', '교점', '평행'],
  TRIANGLE_PROPERTIES: ['삼각형', '이등변', '직각삼각형', '합동', '내심', '외심', '무게중심'], QUADRILATERAL_PROPERTIES: ['평행사변형', '사다리꼴', '직사각형', '마름모', '정사각형'],
  SIMILAR_FIGURE: ['닮음', '닮은'], PARALLEL_LENGTH_RATIO: ['평행선', '선분의 길이의 비'], PYTHAGOREAN_THEOREM: ['피타고라스', '빗변'], PYTHAGOREAN_APPLICATION: ['피타고라스', '높이', '거리'],
  PROBABILITY_BASIC: ['확률', '사건', '표본공간'], PROBABILITY_COUNTING: ['경우의 수', '순열', '조합'], PERMUTATION: ['순열', '배열'], COMBINATION: ['조합'],
  CIRCULAR_PERMUTATION: ['원순열', '원탁'], DUPLICATE_PERMUTATION: ['중복순열', '중복'], STATISTICS_REPRESENTATIVE: ['평균', '중앙값', '최빈값'], DATA_INTERPRETATION: ['자료', '그래프'],
  FACTORIZATION: ['인수분해'], POLYNOMIAL_OPERATIONS: ['다항식', '전개'], LINEAR_EQUATION: ['일차방정식'], LINEAR_INEQUALITY: ['일차부등식'],
  TRIGONOMETRIC_EQUATION: ['삼각방정식', 'sin', 'cos', 'tan'], TRIGONOMETRIC_FUNCTION: ['삼각함수', 'sin', 'cos', 'tan'], TRIGONOMETRIC_GRAPH: ['삼각함수', '주기'],
  MATRIX_BASIC: ['행렬'], MATRIX_OPERATION: ['행렬', '행렬의 연산'], LIMIT: ['극한'], DERIVATIVE: ['미분', '도함수'], INTEGRAL: ['적분'],
  RATIONAL_NUMBER_OPERATIONS: ['유리수', '계산'], PRIME_FACTORIZATION: ['소인수분해'], GCD_LCM: ['최대공약수', '최소공배수']
};

function sourceLookup() {
  const lookup = new Map();
  for (const file of scanExamBank().files) {
    const sourceArchiveFile = file.sourceFile.replace(/^archive\/exams\//, '');
    for (const question of file.questions) lookup.set(`${sourceArchiveFile}#${question.originalIndex + 1}`, question);
  }
  return lookup;
}
function sourcePayload(source) {
  if (!source) return null;
  return { standardCourse: source.standardCourse ?? '', standardUnitKey: source.standardUnitKey ?? '', standardUnit: source.standardUnit ?? '', level: source.level ?? '', questionType: source.questionType ?? '', content: source.content ?? '', choices: Array.isArray(source.choices) ? source.choices : [], answer: source.answer ?? '', solution: source.solution ?? '', image: source.image ?? '', tags: Array.isArray(source.tags) ? source.tags : [] };
}
function candidateCues(item) {
  const values = [item.subUnit ?? '', item.conceptClusterKey ?? '', ...(cueOverrides[item.conceptClusterKey] ?? [])];
  return [...new Set(values.flatMap(value => String(value).match(/[가-힣]{2,}|[A-Z][A-Z_]{3,}/g) ?? []))].filter(value => value.length >= 2);
}
function classify(record, activeByStandard) {
  const source = record.source;
  if (!source?.content || !source.solution || String(source.content).includes('[그래프필요]') || String(source.content).includes('[도형필요]')) {
    return { disposition: 'EVIDENCE_MISSING_HOLD', proposedSubUnitKey: '', proposedSubUnit: '', contentCueHits: [], solutionCueHits: [], rationale: '원문·해설 또는 필수 시각자료 근거가 부족하여 세부키를 확정하지 않는다.' };
  }
  const candidates = activeByStandard.get(record.standardUnitKey) ?? [];
  if (!candidates.length) return { disposition: 'STANDARD_UNIT_FALLBACK', proposedSubUnitKey: '', proposedSubUnit: '', contentCueHits: [], solutionCueHits: [], rationale: '현재 active master에 해당 표준단원의 세부키가 없어 표준단원 fallback으로 유지한다.' };
  const content = compact(`${source.content} ${(source.choices ?? []).join(' ')}`);
  const solution = compact(source.solution);
  const scored = candidates.map(item => {
    const cues = candidateCues(item);
    const contentCueHits = cues.filter(cue => content.includes(cue));
    const solutionCueHits = cues.filter(cue => solution.includes(cue));
    return { item, contentCueHits, solutionCueHits, score: contentCueHits.length + solutionCueHits.length, independent: contentCueHits.length > 0 && solutionCueHits.length > 0 };
  }).sort((a, b) => b.score - a.score || a.item.subUnitKey.localeCompare(b.item.subUnitKey, 'en'));
  const top = scored[0];
  const second = scored[1];
  if (top?.independent && top.score >= 2 && (!second || top.score > second.score)) {
    return { disposition: 'PILOT_CANDIDATE', proposedSubUnitKey: top.item.subUnitKey, proposedSubUnit: top.item.subUnit, contentCueHits: top.contentCueHits, solutionCueHits: top.solutionCueHits, rationale: '본문과 해설이 같은 active master 세부키를 독립적으로 지지하는 PILOT 후보. 운영 반영 전 샘플·경계 승인 필요.' };
  }
  return { disposition: 'PILOT_REVIEW_REQUIRED', proposedSubUnitKey: top?.independent ? top.item.subUnitKey : '', proposedSubUnit: top?.independent ? top.item.subUnit : '', contentCueHits: top?.contentCueHits ?? [], solutionCueHits: top?.solutionCueHits ?? [], rationale: '본문·해설 단서가 없거나 복수 세부키가 경쟁하여 자동 확정하지 않는다.' };
}

function processBatch(batchNumber, queue, lookup, activeByStandard) {
  const queueRecords = queue.records.filter(record => record.reviewBatch === batchNumber);
  const packetRecords = queueRecords.map(record => ({ ...record, reviewStatus: 'PENDING_INDEPENDENT_REVIEW', source: sourcePayload(lookup.get(`${record.sourceArchiveFile}#${record.sourceOrdinal}`)) }));
  const packetStable = { schemaVersion: `archive-subunit-review-batch-${pad(batchNumber)}-v1`, queueDigest: queue.digest, batchNumber, batchSize: queue.batchSize, productionWriteAllowed: false, totals: { records: packetRecords.length, sourceJoinFailures: packetRecords.filter(record => !record.source).length, semanticCandidates: packetRecords.filter(record => record.semanticStatus !== 'unresolved').length, missingSourceContent: packetRecords.filter(record => !record.source?.content).length }, records: packetRecords };
  const packet = { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(packetStable)), ...packetStable };
  fs.writeFileSync(path.join(outputDir, `archive-subunit-review-batch-${pad(batchNumber)}-v1.json`), `${JSON.stringify(packet, null, 2)}\n`);
  const records = packetRecords.map(record => { const decision = classify(record, activeByStandard); return { reviewOrder: record.reviewOrder, questionUid: record.questionUid, sourceArchiveFile: record.sourceArchiveFile, sourceOrdinal: record.sourceOrdinal, standardUnitKey: record.standardUnitKey, standardUnit: record.standardUnit, semanticStatus: record.semanticStatus, proposedSubUnitKey: decision.proposedSubUnitKey, proposedSubUnit: decision.proposedSubUnit, contentCueHits: decision.contentCueHits, solutionCueHits: decision.solutionCueHits, disposition: decision.disposition, productionUsable: false, rationale: decision.rationale }; });
  const counts = {}; for (const record of records) counts[record.disposition] = (counts[record.disposition] ?? 0) + 1;
  const stable = { schemaVersion: `archive-subunit-coverage-batch-${pad(batchNumber)}-adjudication-v1`, sourceDigest: packet.digest, masterDigest: sha256(JSON.stringify([...activeByStandard.values()].flat())), productionWriteAllowed: false, totals: { records: records.length, disposition: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))), pilotCandidates: counts.PILOT_CANDIDATE ?? 0, fallbackRecords: counts.STANDARD_UNIT_FALLBACK ?? 0, reviewRequired: (counts.PILOT_REVIEW_REQUIRED ?? 0) + (counts.EVIDENCE_MISSING_HOLD ?? 0) }, records };
  const report = { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
  fs.writeFileSync(path.join(outputDir, `archive-subunit-coverage-batch-${pad(batchNumber)}-adjudication-v1.json`), `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
  const activeByStandard = new Map();
  for (const item of master.filter(item => item.keyType === 'subUnitKey' && item.status === 'active')) (activeByStandard.get(item.standardUnitKey) ?? activeByStandard.set(item.standardUnitKey, []).get(item.standardUnitKey)).push(item);
  const lookup = sourceLookup();
  const results = [];
  for (let batchNumber = 2; batchNumber <= 35; batchNumber += 1) { const report = processBatch(batchNumber, queue, lookup, activeByStandard); results.push({ batchNumber, digest: report.digest, totals: report.totals }); }
  fs.writeFileSync(path.join(outputDir, 'archive-subunit-coverage-batches-002-035-progress-v1.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), productionWriteAllowed: false, batches: results }, null, 2)}\n`);
  console.log(JSON.stringify(results, null, 2));
}
