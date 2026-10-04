import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/*
 * Content-based adjudication for label variants that are not safe aliases.
 * This report is non-production by design. It records an auditable inference
 * before a separate promotion step writes the canonical fields.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const phase1Dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1');
const sourcePath = path.join(phase1Dir, 'master-audit', 'label-variants', 'master-label-variant-inventory-v1.json');
const masterPath = path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json');
const outputDir = path.join(phase1Dir, 'master-audit', 'manual-label-adjudication');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const STANDARD_ORDERS = {
    'H15-M1-01': 1,
    'H15-M1-02': 2,
    'H15-SA-01': 1,
    'H15-SA-02': 2,
    'H15-SA-03': 3
};

const FILE_MAESAN = 'original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js';
const FILE_YEOCHEON = 'original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js';
const FILE_YEOSU = 'original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js';
const FILE_HANYEONG = 'original/high/h1/1mid/23_한영고_1학기_중간_고1_기출.js';

function keyFor(file, ordinal) { return file + '#' + ordinal; }

function target(targetStandardUnitKey, targetSubUnitKey, rationale) {
    return { targetStandardUnitKey, targetSubUnitKey, rationale };
}

/* Explicit question-level decisions prevent a broad source label from being
 * treated as a single curriculum unit. All target keys already exist in the
 * master table; no new key is invented by this adjudicator. */
const DECISIONS = new Map([
    // 25_매산고: source label “지수함수와 로그함수” is split by content.
    [keyFor(FILE_MAESAN, 2), target('H15-M1-01', 'H15-M1-01-EXPONENT', '음의 제곱근과 n제곱근의 값을 다루므로 지수의 뜻과 성질로 판정했다.')],
    [keyFor(FILE_MAESAN, 4), target('H15-M1-02', 'H15-M1-02-LOGARITHM', '상용로그의 지표·가수와 로그 계산을 다루므로 로그의 뜻과 성질로 판정했다.')],
    [keyFor(FILE_MAESAN, 6), target('H15-M1-01', 'H15-M1-01-EXPONENT', '음의 지수와 거듭제곱식의 변형을 다루므로 지수의 뜻과 성질로 판정했다.')],
    [keyFor(FILE_MAESAN, 7), target('H15-M1-02', 'H15-M1-02-LOGARITHM', '로그함수의 정의역·증가성과 함수값을 묻는 로그 내용으로 판정했다.')],
    [keyFor(FILE_MAESAN, 8), target('H15-M1-02', 'H15-M1-02-LOGARITHM', '로그의 밑 조건과 진수 조건을 묻는 로그 내용으로 판정했다.')],
    [keyFor(FILE_MAESAN, 9), target('H15-M1-02', 'H15-M1-02-EXPONENT_LOG_APPLICATION', '지진 규모·에너지의 로그 모델을 실제 상황에 적용하므로 지수와 로그의 활용으로 판정했다.')],
    [keyFor(FILE_MAESAN, 10), target('H15-M1-02', 'H15-M1-02-LOGARITHM', '곱셈공식으로 로그의 진수를 정리한 뒤 로그값을 구하므로 로그의 뜻과 성질로 판정했다.')],
    [keyFor(FILE_MAESAN, 13), target('H15-M1-01', 'H15-M1-01-EXPONENT', '4^x와 2^x의 치환으로 지수방정식의 실근 조건을 분석하므로 지수의 뜻과 성질로 판정했다.')],
    [keyFor(FILE_MAESAN, 14), target('H15-M1-01', 'H15-M1-01-EXPONENT', '3^x-n과 역함수의 교점에 대한 지수식 분석이 핵심이므로 지수의 뜻과 성질로 판정했다.')],
    [keyFor(FILE_MAESAN, 15), target('H15-M1-02', 'H15-M1-02-LOGARITHM', '밑변환공식과 상용로그 성질을 사용하므로 로그의 뜻과 성질로 판정했다.')],
    [keyFor(FILE_MAESAN, 16), target('H15-M1-02', 'H15-M1-02-LOGARITHM', '상용로그의 정의와 주어진 로그값을 직접 사용하는 문항이므로 로그의 뜻과 성질로 판정했다.')],
    [keyFor(FILE_MAESAN, 17), target('H15-M1-02', 'H15-M1-02-EXPONENT_LOG_APPLICATION', '지수식과 로그식의 연립 조건을 함께 변형해 해를 구하므로 지수와 로그의 활용으로 판정했다.')],
    [keyFor(FILE_MAESAN, 19), target('H15-M1-01', 'H15-M1-01-EXPONENT', 'a^x+a^-x 형태의 거듭제곱식 관계를 이용하므로 지수의 뜻과 성질로 판정했다.')],
    [keyFor(FILE_MAESAN, 21), target('H15-M1-02', 'H15-M1-02-EXPONENT_LOG_APPLICATION', '로그방정식의 진수 조건과 근의 개수를 함께 분석하므로 지수와 로그의 활용으로 판정했다.')],

    // 23_여천고: source label “다항식” is split across operations and factorization.
    [keyFor(FILE_YEOCHEON, 1), target('H15-SA-01', 'H15-SA-01-POLYNOMIAL_BASIC', '두 다항식의 합·차를 이용한 계수 계산이므로 다항식의 기본 연산으로 판정했다.')],
    [keyFor(FILE_YEOCHEON, 3), target('H15-SA-01', 'H15-SA-01-POLYNOMIAL_DIVISION', '다항식 나눗셈의 몫·나머지 항등식을 변형하는 문항이므로 다항식의 나눗셈으로 판정했다.')],
    [keyFor(FILE_YEOCHEON, 4), target('H15-SA-01', 'H15-SA-01-POLYNOMIAL_BASIC', '곱셈공식 변형으로 다항식 값을 계산하므로 다항식의 기본 연산으로 판정했다.')],
    [keyFor(FILE_YEOCHEON, 5), target('H15-SA-03', 'H15-SA-03-FACTORIZATION', '인수정리와 조립제법으로 인수분해하는 문항이므로 인수분해로 판정했다.')],
    [keyFor(FILE_YEOCHEON, 8), target('H15-SA-03', 'H15-SA-03-FACTORIZATION', '다항식의 인수분해와 인수의 곱 조건을 사용하므로 인수분해로 판정했다.')],
    [keyFor(FILE_YEOCHEON, 9), target('H15-SA-03', 'H15-SA-03-FACTORIZATION', '차의 제곱·거듭제곱 차를 인수분해해 약수를 판정하므로 인수분해로 판정했다.')],
    [keyFor(FILE_YEOCHEON, 19), target('H15-SA-02', 'H15-SA-02-REMAINDER_FACTOR', '서로 다른 나눗셈의 나머지 조건을 결합해 나머지다항식을 구하므로 나머지정리와 인수정리로 판정했다.')],
    [keyFor(FILE_YEOCHEON, 21), target('H15-SA-03', 'H15-SA-03-FACTORIZATION', '연속한 네 인수의 곱을 완전제곱꼴로 정리하는 문항이므로 인수분해로 판정했다.')],

    // 23_여수여고: source label “나머지정리와 인수분해” is split by the actual operation.
    [keyFor(FILE_YEOSU, 5), target('H15-SA-02', 'H15-SA-02-REMAINDER_FACTOR', '나눗셈 항등식에서 새로운 나머지를 구하는 문항이므로 나머지정리와 인수정리로 판정했다.')],
    [keyFor(FILE_YEOSU, 6), target('H15-SA-02', 'H15-SA-02-IDENTITY', 'x의 값과 무관하게 성립하는 등식인지 계수와 전개로 확인하므로 항등식과 계수비교로 판정했다.')],
    [keyFor(FILE_YEOSU, 7), target('H15-SA-02', 'H15-SA-02-IDENTITY', '항등식의 재배열과 x=1 대입을 통해 계수를 찾는 과정이 핵심이므로 항등식과 계수비교로 판정했다.')],
    [keyFor(FILE_YEOSU, 8), target('H15-SA-02', 'H15-SA-02-REMAINDER_FACTOR', '나머지정리와 인수정리로 P(0), P(1), P(-2) 조건을 결합하므로 나머지정리와 인수정리로 판정했다.')],
    [keyFor(FILE_YEOSU, 9), target('H15-SA-03', 'H15-SA-03-FACTORIZATION', '두 변수 다항식을 두 일차식의 곱으로 분해하는 문항이므로 인수분해로 판정했다.')],
    [keyFor(FILE_YEOSU, 10), target('H15-SA-03', 'H15-SA-03-FACTORIZATION', '두 일차식을 인수로 갖는 삼차식을 완전히 분해하므로 인수분해로 판정했다.')],
    [keyFor(FILE_YEOSU, 20), target('H15-SA-02', 'H15-SA-02-REMAINDER_FACTOR', '주어진 함수값을 이용해 나눗셈의 몫과 나머지를 정하므로 나머지정리와 인수정리로 판정했다.')],

    // 23_한영고: the same source label split by content.
    [keyFor(FILE_HANYEONG, 6), target('H15-SA-02', 'H15-SA-02-REMAINDER_FACTOR', '한 점에서의 나머지와 다른 점에서의 인수 조건을 함께 사용하므로 나머지정리와 인수정리로 판정했다.')],
    [keyFor(FILE_HANYEONG, 7), target('H15-SA-03', 'H15-SA-03-FACTORIZATION', '인수분해로 f(21)을 계산하는 문항이므로 인수분해로 판정했다.')],
    [keyFor(FILE_HANYEONG, 12), target('H15-SA-03', 'H15-SA-03-FACTORIZATION', '원기둥 부피의 삼차식을 일차식의 곱으로 분해해 겉넓이를 구하므로 인수분해로 판정했다.')],
    [keyFor(FILE_HANYEONG, 14), target('H15-SA-02', 'H15-SA-02-REMAINDER_FACTOR', '고차 나눗셈의 몫·나머지 조건과 나머지정리를 결합하므로 나머지정리와 인수정리로 판정했다.')],
    [keyFor(FILE_HANYEONG, 16), target('H15-SA-02', 'H15-SA-02-IDENTITY', '모든 x에서 항상 성립하는 일차식의 계수·상수 조건을 구하므로 항등식과 계수비교로 판정했다.')]
]);

function buildMaster() {
    const rows = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
    const standards = new Map(rows.filter(row => row.keyType === 'standardUnitKey').map(row => [row.key, row]));
    const subUnits = new Map(rows.filter(row => row.keyType === 'subUnitKey').map(row => [row.key, row]));
    return { standards, subUnits };
}

export function adjudicateManualVariants() {
    const inventory = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    const { standards, subUnits } = buildMaster();
    const sourceEntries = inventory.entries.filter(entry => entry.decision === 'manual_review_required');
    const groups = [];
    const missingDecisions = [];
    const invalidTargets = [];
    let questionCount = 0;

    for (const entry of sourceEntries) {
        const questionRefs = entry.questionRefs.map(ref => {
            const decision = DECISIONS.get(keyFor(ref.sourceArchiveFile, ref.sourceOrdinal));
            if (!decision) {
                missingDecisions.push(keyFor(ref.sourceArchiveFile, ref.sourceOrdinal));
                return { ...ref, adjudication: 'HOLD_MISSING_DECISION' };
            }
            const standard = standards.get(decision.targetStandardUnitKey);
            const subUnit = subUnits.get(decision.targetSubUnitKey);
            if (!standard || !subUnit || subUnit.standardUnitKey !== decision.targetStandardUnitKey) {
                invalidTargets.push({ ref: keyFor(ref.sourceArchiveFile, ref.sourceOrdinal), targetStandardUnitKey: decision.targetStandardUnitKey, targetSubUnitKey: decision.targetSubUnitKey });
            }
            return {
                ...ref,
                adjudication: 'INFERRED_CONFIRMED',
                proposedStandardUnitKey: decision.targetStandardUnitKey,
                proposedStandardUnit: standard?.labelKo || '',
                proposedStandardUnitOrder: STANDARD_ORDERS[decision.targetStandardUnitKey] ?? null,
                proposedSubUnitKey: decision.targetSubUnitKey,
                proposedSubUnit: subUnit?.labelKo || '',
                inferenceConfidence: 'category_or_cue_inferred',
                inferenceDepth: 'complete_category',
                evidence: {
                    sourceDisposition: 'MANUAL_LABEL_CONTENT_INFERRED',
                    observedLabel: entry.observedLabel,
                    currentStandardUnitKey: entry.standardUnitKey,
                    currentSubUnitKey: ref.subUnitKey,
                    rationale: decision.rationale
                }
            };
        });
        questionCount += questionRefs.filter(ref => ref.adjudication === 'INFERRED_CONFIRMED').length;
        const targetKeys = [...new Set(questionRefs.filter(ref => ref.proposedStandardUnitKey).map(ref => ref.proposedStandardUnitKey))];
        groups.push({
            sourceStandardUnitKey: entry.standardUnitKey,
            documentedLabel: entry.documentedLabel,
            observedLabel: entry.observedLabel,
            affectedQuestionCount: entry.affectedQuestionCount,
            adjudication: questionRefs.every(ref => ref.adjudication === 'INFERRED_CONFIRMED') ? 'INFERRED_CONFIRMED' : 'HOLD_MISSING_DECISION',
            proposedStandardUnitKey: targetKeys.length === 1 ? targetKeys[0] : 'MIXED',
            questionRefs
        });
    }

    const payload = {
        schemaVersion: 'phase1-manual-label-adjudication-v1',
        sourceInventoryDigest: inventory.digest,
        productionWriteAllowed: false,
        status: 'REVIEW_COMPLETE_NONPRODUCTION',
        totals: {
            groups: groups.length,
            questions: sourceEntries.reduce((sum, entry) => sum + entry.affectedQuestionCount, 0),
            inferredConfirmedGroups: groups.filter(group => group.adjudication === 'INFERRED_CONFIRMED').length,
            inferredConfirmedQuestions: questionCount,
            holdGroups: groups.filter(group => group.adjudication !== 'INFERRED_CONFIRMED').length,
            holdQuestions: groups.filter(group => group.adjudication !== 'INFERRED_CONFIRMED').reduce((sum, group) => sum + group.affectedQuestionCount, 0)
        },
        missingDecisions,
        invalidTargets,
        groups
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(payload)), ...payload };
}

function renderMarkdown(report) {
    const lines = [
        '# 수동 라벨 변형 문항별 adjudication',
        '',
        '- 상태: ' + report.status,
        '- production 반영: 0건',
        '- 문항별 추론 확정: ' + report.totals.inferredConfirmedQuestions + '문항',
        '- 추가 보류: ' + report.totals.holdQuestions + '문항',
        '',
        '## 적용 원칙',
        '',
        '- 원본 출처 라벨을 창작하지 않고, 발문·수식·정답·해설에서 재현 가능한 단원 근거만 기록한다.',
        '- 모든 제안 키는 현재 master table에 존재하며, 새 키를 생성하지 않는다.',
        '- 추론 근거는 sidecar에 보존하고 운영 JS에는 최종 메타데이터만 기록한다.',
        '',
        '## 문항별 결과',
        '',
        '| 현재 key | 관측 라벨 | 문항 수 | 판정 | 제안 key |',
        '|---|---|---:|---|---|'
    ];
    for (const group of report.groups) lines.push('| ' + group.sourceStandardUnitKey + ' | ' + group.observedLabel + ' | ' + group.affectedQuestionCount + ' | ' + group.adjudication + ' | ' + group.proposedStandardUnitKey + ' |');
    lines.push('', '문항별 rationale와 현재/제안 subUnitKey는 JSON sidecar의 `questionRefs[].evidence`에서 확인할 수 있다.', '');
    return lines.join('\n');
}

function main() {
    const report = adjudicateManualVariants();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'manual-label-adjudication-v1.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(outputDir, 'manual-label-adjudication-v1.md'), renderMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: outputDir, digest: report.digest, totals: report.totals, missingDecisions: report.missingDecisions.length, invalidTargets: report.invalidTargets.length }, null, 2));
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
