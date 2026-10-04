import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(scriptDir, '..', '..');
const intelligenceDir = path.join(repo, 'archive', 'tools', 'intelligence');
const reviewDir = path.join(repo, 'archive', '_generated', 'intelligence', 'phase3', 'sequential-review');
const outputDir = path.join(repo, 'reports', 'alive-source-recovery-p1-20260909');
const inputPath = path.join(outputDir, 'p1_historical_inputs.json');
const resultPath = path.join(outputDir, 'p1_engine_results.json');

const freshAdjudications = new Map([
  [765, { computed: '15', unique: true, contract: true, signals: [], rationale: '몫과 나머지가 주어진 완전한 다항식 곱을 전개하면 a=-3,b=-8,c=26으로 a+b+c=15이다.' }],
  [784, { computed: '5', unique: true, contract: true, signals: [], rationale: '현재 source question은 나머지 2x+3을 명시하고 있으므로 계수합은 5이고 저장 ③과 일치한다.' }],
  [787, { computed: 'k=4, f(1)=16', unique: true, contract: true, signals: [], rationale: '완전제곱 전개는 (x²+7x+8)²-4이므로 k=4, f(1)=16이다.' }],
  [788, { computed: 'UNDETERMINED', unique: false, contract: false, signals: ['MISSING_CONDITION', 'UNDERDETERMINED_STEM'], rationale: '두 이차방정식이 source stem에 없어 a+b를 독립적으로 결정할 수 없다.' }],
  [789, { computed: 'UNDETERMINED', unique: false, contract: false, signals: ['MISSING_CONDITION', 'UNDERDETERMINED_STEM'], rationale: '이차함수 식과 제한 구간이 source stem에 없어 최솟값 조건을 풀 수 없다.' }],
  [800, { computed: '$4\\sqrt{6}$', unique: false, contract: false, signals: ['DUPLICATE_CHOICES'], rationale: '독립 계산값은 4√6이고 ④·⑤가 동일하므로 선택지 식별이 유일하지 않다.' }],
  [890, { computed: 'UNDETERMINED', unique: false, contract: false, signals: ['MISSING_CONDITION', 'UNDERDETERMINED_STEM', 'INVALID_DOMAIN'], rationale: 'm만 자연수이고 n의 영역이 없어 m+n의 최솟값을 확정할 수 없다.' }],
  [903, { computed: '③ 3개', unique: true, contract: false, signals: ['INVALID_DOMAIN'], rationale: '가·나·라만 확실히 참이고 다는 반례가 있으며 마의 복소수 부등식은 정의역이 없다. 저장 ④와 독립 계산 ③이 충돌한다.' }],
  [939, { computed: '-20', unique: true, contract: false, signals: ['INVALID_DOMAIN', 'RESPONSE_FORM_DEFECT'], rationale: '두 근이 음수라 실수 제곱근이 아니며 복소 제곱근의 branch가 지정되지 않아 응답 계약을 확정할 수 없다.' }],
  [1134, { computed: '37', unique: true, contract: true, signals: [], rationale: 'z²이 음의 실수가 되는 a=-1에서 RHS=1이고 8주기인 수열의 300 이하 해는 37개이다.' }],
  [1135, { computed: '$-\\dfrac{15}{8}$', unique: true, contract: true, signals: [], rationale: '교점 좌표를 t,2t로 두면 k=-3+3t-2t²의 최댓값은 t=3/4에서 -15/8이다.' }],
  [1136, { computed: '없다', unique: true, contract: true, signals: [], rationale: '정확히 세 교점인 양의 a는 (-2+2√3)와 2에서 경계적으로 발생하며 최댓값은 없으므로 보기 없음이 맞다.' }],
  [1137, { computed: '61', unique: true, contract: true, signals: [], rationale: '조립제법 표에서 P=x³-2x²-5x+11이고 P(5)=61이다.' }],
  [1138, { computed: '$\\dfrac{896}{3}$', unique: true, contract: true, signals: [], rationale: '반지름은 1,3이고 부피합은 112π/3이므로 8a=896/3이다.' }],
  [1139, { computed: '3', unique: true, contract: true, signals: [], rationale: 'g=1/2,1,3/2의 해 개수는 각각 0,1,2이므로 합은 3이다.' }],
  [1169, { computed: '5', unique: true, contract: true, signals: [], rationale: '(x-1)² 인수 조건으로 a=-3,b=2이므로 b-a=5이다.' }],
  [1171, { computed: '-5', unique: true, contract: true, signals: [], rationale: 'x=-1을 항등식에 대입하면 a=-1,b=-4이므로 a+b=-5이다.' }],
  [1174, { computed: '6', unique: true, contract: true, signals: [], rationale: '몫과 나머지를 x+d로 두고 나눗셈 조건을 적용하면 d=-2,P(3)=6이다.' }],
  [1176, { computed: '-3', unique: true, contract: true, signals: [], rationale: 'u²=-i를 사용한 30항 합은 -17+14i이므로 a+b=-3이다.' }],
  [1178, { computed: '10', unique: true, contract: true, signals: [], rationale: '교점 수가 3인 수평선은 t=0,1,4,5이고 합은 10이다.' }],
  [1180, { computed: '1) 합: 5, 곱: 3  2) $24x^2-64x+8=0$', unique: true, contract: true, signals: [], rationale: '변환된 두 근의 합과 곱은 8/3,1/3이므로 계수 24 방정식은 24x²-64x+8=0이다.' }],
  [1181, { computed: '12', unique: true, contract: true, signals: [], rationale: '좌표화한 PQCR 넓이는 -3/4(t-2)²+12이므로 최댓값은 12이다.' }],
  [1184, { computed: '$8i$', unique: true, contract: true, signals: [], rationale: '주값 제곱근으로 항을 계산하면 7i+4i-3i=8i이다.' }],
  [1193, { computed: '42', unique: true, contract: true, signals: [], rationale: '두 나눗셈 표현을 비교하면 두 번째 나머지는 x+5이고 f(1)=4·9+6=42이다.' }],
  [1197, { computed: '43', unique: true, contract: true, signals: [], rationale: 'f-7=A(x+3)(x-1), 구간 최댓값으로 A=3이고 f(3)=43이다.' }],
  [1198, { computed: '199', unique: true, contract: true, signals: [], rationale: '(m,n)=(100,99)에서 합의 제곱이 -2i가 되므로 저장 198보다 큰 199가 가능하다.' }],
  [1199, { computed: 'UNDETERMINED', unique: false, contract: false, signals: ['UNDERDETERMINED_STEM'], rationale: 'Q(2)=0 branch와 P(2)=0 branch가 모두 가능하여 서로 다른 실수 해가 존재한다.' }],
  [1200, { computed: '4', unique: true, contract: true, signals: [], rationale: '짝함수 치환에서 y근의 합은 2m+3이고 ad+bc=-(2m+3)=-11이므로 m=4이다.' }],
  [1201, { computed: '직각삼각형($a$가 빗변)', unique: true, contract: true, signals: [], rationale: '식을 (a+b)(a²-b²-c²)로 인수분해하고 양의 변 조건을 적용하면 a²=b²+c²이다.' }],
  [1202, { computed: '(1) $\\sqrt{5}$ (2) $8\\sqrt{5}$ (3) $-144\\sqrt{5}$', unique: true, contract: true, signals: [], rationale: 'x³-y³=8√5, x³+y³=-18이므로 x⁶-y⁶=-144√5이다.' }],
  [1204, { computed: '120', unique: true, contract: true, signals: [], rationale: '연속 piecewise 함수와 직선의 교점 수를 구하면 m=2 및 m=-2+2√3이고 10S²=120이다.' }],
  [1804, { computed: '$\\sqrt{2}$', unique: true, contract: true, signals: [], rationale: 'a=1인 현재 source는 중심에서 곡선까지 거리 제곱 u²+u^-2의 최솟값 2를 주므로 r=√2이다.' }],
  [1878, { computed: '$x^2+y^2=5$', unique: true, contract: true, signals: [], rationale: 'source visual의 중심 O=(0,0), 원 위 점 (1,2)로부터 방정식은 x²+y²=5이다.' }],
  [1992, { computed: 'MULTI', unique: false, contract: true, answerCardinality: 'MULTIPLE', matchingChoiceIndices: [3, 5], signals: [], rationale: '마름모 조건은 a=1,5를 주어 a+b=6,14, 즉 ③·⑤ 모두를 요구한다.' }],
  [2003, { computed: '$48$', unique: true, contract: true, signals: [], rationale: 'a가 고정인 24개와 a와 한 원소를 전치하는 24개로 총 48개이다.' }],
  [2127, { computed: 'MULTI', unique: false, contract: true, answerCardinality: 'MULTIPLE', matchingChoiceIndices: [3, 5], signals: [], rationale: 'C⊂B⊂Aᶜ에서 ③과 ⑤가 항상 참이다.' }],
  [2149, { computed: 'UNDETERMINED', unique: false, contract: false, signals: ['MISSING_CONDITION', 'UNDERDETERMINED_STEM'], rationale: 'Q=∅ 특수 경우가 허용되어 ⑤의 참·거짓이 고정되지 않는다.' }],
  [2161, { computed: '$(2,1)$', unique: true, contract: true, signals: [], rationale: '현재 source는 좌표 변환을 명시하고 (u,v)→(v-1,3-u)로 (2,3)→(2,1)이다.' }],
  [2231, { computed: 'MULTI', unique: false, contract: true, answerCardinality: 'MULTIPLE', matchingChoiceIndices: [1, 2, 5], signals: [], rationale: '현재 stem이 가능한 값을 모두 고르도록 명시하고 b=1,a=1,2,5에서 ①·②·⑤가 모두 정답이다.' }],
  [2550, { computed: 'UNDETERMINED', unique: false, contract: false, signals: ['MISSING_CONDITION', 'UNDERDETERMINED_STEM'], rationale: 'A가 표본공간 전체이면 Aᶜ가 공집합이 되어 ㄱ의 조건부확률이 정의되지 않는다.' }],
]);

const extraCases = [
  { caseId: 'shape-movement-hyocheon-q19', sourceArchiveFile: 'original/high/h1/2mid/21_효천고_2학기_중간_고1_기출.js', sourceOrdinal: 19, historicalStatus: 'HISTORICAL_SOURCE_DEFECT', sourceEvidenceRef: 'archive/analysis/shape-movement-20260904/FINAL_RECHECK.md#21-효천고-2중간-q19', adjudication: { computed: 'UNDETERMINED', unique: false, contract: false, signals: ['OTHER_SOURCE_DEFECT'], rationale: 'a=0은 y축 위 교점이 아니고 a=1은 두 직선이 완전히 겹쳐 고유 교점이 없어 발문이 성립하지 않는다.' } },
  { caseId: 'set-visual-q18-multiple-answer', sourceArchiveFile: 'original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js', sourceOrdinal: 18, historicalStatus: 'HISTORICAL_SOURCE_DEFECT', sourceEvidenceRef: 'archive/analysis/2026-09-02-set-visual-correction-protocol-final.md#q18', adjudication: { computed: '9', unique: true, contract: true, signals: [], rationale: '현재 source stem은 양의 정수 n을 명시하고 n=9 하나만 남으므로 historical missing-condition label은 stale이다.' } },
  { caseId: 'visual-audit-source-blocked-q21', sourceArchiveFile: 'original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js', sourceOrdinal: 21, historicalStatus: 'HISTORICAL_SOURCE_BLOCKED', sourceEvidenceRef: 'archive/tools/logic-visual-audit/reports/phase2_repair_ledger.json#SOURCE_BLOCKED', adjudication: { computed: '(1) (가) $\\dfrac{a+b}{2}$, (나) $\\sqrt{ab}$, (다) $\\dfrac{(a-b)^2}{4}$, (라) $a=b$ (2) 최대 넓이 $40$, 작은 직사각형의 가로 $\\dfrac52$, 세로 $4$', unique: true, contract: true, signals: [], rationale: '현재 archive JS와 q21 visual이 모두 존재하며 독립 계산은 최대 넓이 40이다. historical visual audit SOURCE_BLOCKED label은 current source recheck에서 해소된다.' } },
];

function parseHistoricalCandidates() {
  const rows = [];
  const names = fs.readdirSync(intelligenceDir).filter(name => name.startsWith('adjudicate-sequential-batch-') && name.endsWith('.mjs'));
  for (const name of names) {
    const match = name.match(/adjudicate-sequential-batch-(\d+)-/);
    if (!match) continue;
    const batch = String(Number(match[1])).padStart(3, '0');
    const reviewPath = path.join(reviewDir, `archive-sequential-subunit-review-batch-${batch}-v1.json`);
    if (!fs.existsSync(reviewPath)) continue;
    const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
    const bySequence = new Map(review.records.map(record => [Number(record.sequenceOrder), record]));
    const text = fs.readFileSync(path.join(intelligenceDir, name), 'utf8');
    const decisionPattern = /(\d+)\s*:\s*\[\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]*)['"]\s*,\s*(['"])((?:\\.|(?!\4).)*?)\4\s*\]/g;
    let decision;
    while ((decision = decisionPattern.exec(text))) {
      if (!['ANSWER_SOURCE_DEFECT_HOLD', 'EVIDENCE_MISSING_HOLD', 'ANSWER_WORDING_HOLD'].includes(decision[2])) continue;
      const record = bySequence.get(Number(decision[1]));
      if (!record) continue;
      rows.push({
        sequenceOrder: Number(decision[1]),
        historicalStatus: decision[2],
        historicalKey: decision[3],
        historicalRationale: decision[5],
        sourceArchiveFile: record.sourceArchiveFile,
        sourceOrdinal: Number(record.sourceOrdinal),
        historicalQuestionUid: record.questionUid,
        sourceEvidenceRef: `archive/_generated/intelligence/phase3/sequential-review/archive-sequential-subunit-review-batch-${batch}-v1.json#${record.sequenceOrder}`,
      });
    }
  }
  return rows.sort((left, right) => left.sequenceOrder - right.sequenceOrder);
}

function loadQuestion(relativeFile, ordinal) {
  const absolute = path.join(repo, 'archive', 'exams', relativeFile);
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(absolute, 'utf8'), context, { timeout: 2000, filename: absolute });
  const question = (context.window.questionBank || []).find(item => Number(item.id) === Number(ordinal));
  if (!question) throw new Error(`source question not found: ${relativeFile}#${ordinal}`);
  return { question, sourcePath: absolute };
}

function enrich(row) {
  const { question, sourcePath } = loadQuestion(row.sourceArchiveFile, row.sourceOrdinal);
  const sourceIdentity = `${row.sourceArchiveFile}#${row.sourceOrdinal}`;
  const imagePath = question.image ? path.join(repo, 'archive', question.image) : null;
  const imageExists = Boolean(imagePath && fs.existsSync(imagePath));
  return {
    ...row,
    caseId: row.caseId || `historical-seq-${row.sequenceOrder}`,
    sourceIdentity,
    sourceQuestionUid: sourceIdentity,
    sourcePath,
    sourceQuestion: question,
    sourceJsSha256: `sha256:${sha256(fs.readFileSync(sourcePath))}`,
    actualSourceStatus: imagePath && !imageExists ? 'ARCHIVE_JS_PRESENT_VISUAL_MISSING' : 'ARCHIVE_JS_PRESENT',
    visualDependency: Boolean(question.image),
    visualEvidenceAvailable: imageExists,
    freshAdjudication: row.adjudication || freshAdjudications.get(row.sequenceOrder) || null,
  };
}

// Keep the helper synchronous while avoiding a global crypto import in the data table.
const crypto = await import('node:crypto');
function sha256(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex'); }

function dedupe(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = row.sourceIdentity;
    if (!map.has(key)) map.set(key, row);
    else {
      const prior = map.get(key);
      prior.historicalSources = [...(prior.historicalSources || []), { caseId: row.caseId, sourceEvidenceRef: row.sourceEvidenceRef, historicalStatus: row.historicalStatus }];
    }
  }
  return [...map.values()].sort((left, right) => left.sourceIdentity.localeCompare(right.sourceIdentity));
}

fs.mkdirSync(outputDir, { recursive: true });
const existingInputs = fs.existsSync(inputPath) ? JSON.parse(fs.readFileSync(inputPath, 'utf8')) : null;
if (existingInputs && Number(existingInputs.denominator) >= 100 && !fs.existsSync(reviewDir)) {
  const python = process.env.PYTHON || 'python';
  const run = spawnSync(python, [path.join(scriptDir, 'run_p1_engine.py'), '--input', inputPath, '--output', resultPath], { cwd: repo, encoding: 'utf8' });
  process.stdout.write(run.stdout || '');
  process.stderr.write(run.stderr || '');
  if (run.status !== 0) process.exit(run.status ?? 1);
  console.log(JSON.stringify({ inputPath: path.relative(repo, inputPath), resultPath: path.relative(repo, resultPath), denominator: existingInputs.denominator, activeCases: existingInputs.activeCases.length, blockedEvidenceCases: existingInputs.blockedEvidenceCases.length }, null, 2));
  process.exit(0);
}
const historical = parseHistoricalCandidates();
const selected = historical.filter(row => row.historicalStatus !== 'ANSWER_WORDING_HOLD');
const historicalRows = selected.map(enrich);
const extras = extraCases.map(enrich);
const inventory = dedupe([...historicalRows, ...extras]);
const activeCases = inventory.filter(row => row.freshAdjudication && row.historicalStatus !== 'EVIDENCE_MISSING_HOLD');
const blockedEvidenceCases = inventory.filter(row => row.historicalStatus === 'EVIDENCE_MISSING_HOLD');
const payload = {
  schemaVersion: 'ALIVE_SOURCE_RECOVERY_P1_OFFLINE_INPUTS_v1',
  baselineReference: '616e28c87cca735d53bab63087b4a680a84a76f1',
  sourceRecoveryPolicy: 'SHADOW_AUTO_RECOVER',
  recoveryAuthority: 'SHADOW_ONLY',
  productionAdoptionStatus: 'NOT_AUTHORIZED',
  denominator: inventory.length,
  historicalCandidateHoldCount: selected.length,
  inventory,
  activeCases,
  blockedEvidenceCases,
};
fs.writeFileSync(inputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const python = process.env.PYTHON || 'python';
const run = spawnSync(python, [path.join(scriptDir, 'run_p1_engine.py'), '--input', inputPath, '--output', resultPath], { cwd: repo, encoding: 'utf8' });
process.stdout.write(run.stdout || '');
process.stderr.write(run.stderr || '');
if (run.status !== 0) process.exit(run.status ?? 1);
console.log(JSON.stringify({ inputPath: path.relative(repo, inputPath), resultPath: path.relative(repo, resultPath), denominator: inventory.length, activeCases: activeCases.length, blockedEvidenceCases: blockedEvidenceCases.length }, null, 2));
