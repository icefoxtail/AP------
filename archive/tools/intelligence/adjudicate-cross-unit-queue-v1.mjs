import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* Human-style adjudication output for the cross-unit queue. Non-production by design. */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const phase1Dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1');
const queuePath = path.join(phase1Dir, 'master-audit', 'cross-unit-adjudication', 'cross-unit-adjudication-queue-v1.json');
const outputDir = path.join(phase1Dir, 'master-audit', 'cross-unit-adjudication');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const CANDIDATE_RULES = {
    'H15-SA-03|복소수': { targetKey: 'H15-SA-04', targetLabel: '복소수', targetOrder: 4, targetSubUnit: 'suffix_or_complex_operation', rationale: '문항 본문·해설이 모두 복소수 연산/표현이며 현재 키는 인수분해다.' },
    'H22-A-02|삼각함수': { targetKey: 'H22-A-04', targetLabel: '삼각함수', targetOrder: 4, targetSubUnit: 'H22-A-04-TRIGONOMETRIC_BASIC', rationale: '문항 본문이 sin/cos 함수 조건을 사용하며 현재 지수함수 키와 불일치한다.' },
    'H22-C-03|지수함수': { targetKey: 'H22-A-02', targetLabel: '지수함수', targetOrder: 2, targetSubUnit: 'H22-A-02-EXPONENTIAL_FUNCTION', rationale: '문항 본문·해설이 지수함수 그래프와 지수식에 집중되어 있다.' },
    'H22-C-06|로그함수': { targetKey: 'H22-A-03', targetLabel: '로그함수', targetOrder: 3, targetSubUnit: 'H22-A-03-LOGARITHMIC_FUNCTION', rationale: '문항 본문·해설이 로그함수의 정의역·그래프·성질에 집중되어 있다.' },
    'H22-C-06|이차방정식과 이차함수': { targetKey: 'H22-C-05', targetLabel: '이차방정식과 이차함수', targetOrder: 5, targetSubUnit: 'H22-C-05-QUADRATIC_FUNCTION_APPLICATION', rationale: '문항 본문이 이차함수식의 최솟값을 묻고 현재 여러 방정식 키와 불일치한다.' },
    'H15-SA-04|이차방정식': { targetKey: 'H15-SA-05', targetLabel: '이차방정식', targetOrder: 5, targetSubUnit: 'quadratic_equation_by_content', rationale: '7개 문항의 본문이 모두 이차방정식이며, 중근·무실근은 판별식, 근을 구하는 서술형은 이차방정식 풀이, 나머지는 방정식 기본으로 세부단원을 정할 수 있다.' },
    'H15-SA-02|방정식과 부등식': {
        targetSubUnit: 'mixed_equation_parent_by_content',
        rationale: '복소수 문항은 H15-SA-04, 이차방정식 문항은 H15-SA-05로 문항별 부모와 세부단원을 분리한다.',
        targetForQuestion(ref) {
            const content = String(ref.content || '');
            if (/복소수|\bi\b|z\\bar|z\s*=|sqrt\{-1\}/.test(content)) {
                const subUnitKey = /한 근이|복소수.*근/.test(content) ? 'H15-SA-04-COMPLEX_ROOT' : 'H15-SA-04-COMPLEX_OPERATION';
                return { targetKey: 'H15-SA-04', targetLabel: '복소수', targetOrder: 4, subUnitKey };
            }
            const subUnitKey = /서로 다른 두 실근|실근/.test(content) ? 'H15-SA-05-DISCRIMINANT' : 'H15-SA-05-EQUATION_BASIC';
            return { targetKey: 'H15-SA-05', targetLabel: '이차방정식', targetOrder: 5, subUnitKey };
        }
    },
    'H15-M1-02|삼각함수': {
        targetSubUnit: 'trigonometry_by_content',
        rationale: '7개 문항이 모두 삼각함수·삼각방정식 내용이며 그래프·방정식·삼각비 관계에 따라 H15-M1-05~07로 분리한다.',
        targetForQuestion(ref) {
            const content = String(ref.content || '');
            if (/그래프/.test(content)) return { targetKey: 'H15-M1-06', targetLabel: '삼각함수의 그래프', targetOrder: 6, subUnitKey: 'H15-M1-06-TRIGONOMETRIC_GRAPH' };
            if (/방정식|모든 근/.test(content)) return { targetKey: 'H15-M1-07', targetLabel: '삼각방정식과 삼각부등식', targetOrder: 7, subUnitKey: 'H15-M1-07-TRIGONOMETRIC_EQUATION' };
            if (/sin\^3|cos\^3|최댓값|두 근이.*sin|cos\^2/.test(content)) return { targetKey: 'H15-M1-05', targetLabel: '삼각함수의 뜻과 값', targetOrder: 5, subUnitKey: 'H15-M1-05-TRIGONOMETRIC_RELATION' };
            return { targetKey: 'H15-M1-05', targetLabel: '삼각함수의 뜻과 값', targetOrder: 5, subUnitKey: 'H15-M1-05-TRIGONOMETRIC_DEFINITION' };
        }
    },
    'H15-SA-05|이차방정식과 이차함수': { targetKey: 'H15-SA-05', targetLabel: '이차방정식', targetOrder: 5, targetSubUnit: 'preserve_target_parent', rationale: '현재 부모키와 세부단원이 이차방정식·이차함수 관계에 일치하므로 canonical standardUnit 라벨만 복구한다.' },
    'H15-SA-05|이차함수': { targetKey: 'H15-SA-05', targetLabel: '이차방정식', targetOrder: 5, targetSubUnit: 'preserve_target_parent', rationale: '현재 부모키와 세부단원이 이차함수 관계 문항에 일치하므로 canonical standardUnit 라벨만 복구한다.' },
    'H15-SB-02|함수': { targetKey: 'H15-SB-03', targetLabel: '함수', targetOrder: 3, targetSubUnit: 'H15-SB-03-FUNCTION_RELATION', rationale: '원문 인접 문항과 출제 구간이 함수 단원으로 일치하며, 현재 명제 부모의 세부단원만 잘못 붙어 있다.' },
    'H15-SA-06|여러 가지 방정식과 부등식': {
        targetSubUnit: 'mixed_sa06_by_content',
        rationale: '근과 계수 부모에 잘못 묶인 3문항을 고차방정식·절댓값 부등식·연립부등식으로 분리한다.',
        targetForQuestion(ref) {
            const content = String(ref.content || '');
            if (/연립부등식/.test(content)) return { targetKey: 'H15-SA-08', targetLabel: '여러 가지 부등식', targetOrder: 8, subUnitKey: 'H15-SA-08-SYSTEM_INEQUALITY' };
            if (/\|x-4\||절댓값/.test(content)) return { targetKey: 'H15-SA-08', targetLabel: '여러 가지 부등식', targetOrder: 8, subUnitKey: 'H15-SA-08-ABSOLUTE_INEQUALITY' };
            return { targetKey: 'H15-SA-07', targetLabel: '여러 가지 방정식', targetOrder: 7, subUnitKey: 'H15-SA-07-HIGHER_EQUATION' };
        }
    },
    'H22-A-01|지수함수와 로그함수': { targetKey: 'H22-A-01', targetLabel: '지수와 로그', targetOrder: 1, targetSubUnit: 'preserve_target_parent', rationale: '현재 부모키와 세부단원이 지수·로그 내용에 일치하므로 canonical standardUnit 라벨만 복구한다.' },
    'H22-A-05|방정식': { targetKey: 'H22-A-05', targetLabel: '사인법칙과 코사인법칙', targetOrder: 5, targetSubUnit: 'preserve_target_parent', rationale: '삼각형 내심·넓이 문항이 현재 사인법칙·코사인법칙 부모와 일치한다.' },
    'H22-C-01|지수의 뜻과 성질': { targetKey: 'H22-A-01', targetLabel: '지수와 로그', targetOrder: 1, targetSubUnit: 'H22-A-01-EXPONENT_LOG', rationale: '9개 문항 모두 n제곱근·지수의 뜻과 성질이며 공통수학 다항식 부모와 불일치한다.' },
    'H22-C-02|지수법칙': { targetKey: 'H22-A-01', targetLabel: '지수와 로그', targetOrder: 1, targetSubUnit: 'H22-A-01-EXPONENT_LOG', rationale: '12개 문항 모두 지수법칙·거듭제곱·근호 지수 변형이며 항등식 부모와 불일치한다.' },
    'H22-C-04|로그의 뜻': {
        targetSubUnit: 'mixed_log_definition',
        rationale: '로그 정의·계산 문항은 지수와 로그, 로그 정의역 조건 문항은 로그함수로 분리한다.',
        targetForQuestion(ref) {
            const content = String(ref.content || '');
            if (/모든 실수.*값이 존재|정의역|로그_?a\(/.test(content)) return { targetKey: 'H22-A-03', targetLabel: '로그함수', targetOrder: 3, subUnitKey: 'H22-A-03-LOGARITHMIC_FUNCTION' };
            return { targetKey: 'H22-A-01', targetLabel: '지수와 로그', targetOrder: 1, subUnitKey: 'H22-A-01-EXPONENT_LOG' };
        }
    },
    'H22-C-05|로그의 성질': { targetKey: 'H22-A-01', targetLabel: '지수와 로그', targetOrder: 1, targetSubUnit: 'H22-A-01-EXPONENT_LOG', rationale: '9개 문항이 로그 성질·계산·로그를 이용한 지수 성장/부등식 내용이며 이차방정식 부모와 불일치한다.' },
    'H22-C-06|이차함수': { targetKey: 'H22-C-05', targetLabel: '이차방정식과 이차함수', targetOrder: 5, targetSubUnit: 'quadratic_function_by_content', rationale: '22개 문항이 이차함수·이차방정식과 이차함수 관계 내용이며 여러 가지 방정식 부모와 불일치한다.' },
    'H22-C-07|여러 가지 방정식': { targetKey: 'H22-C-06', targetLabel: '여러 가지 방정식과 부등식', targetOrder: 6, targetSubUnit: 'equation_by_content', rationale: '5개 문항이 연립·고차방정식 내용이며 합의 법칙과 곱의 법칙 부모와 불일치한다.' },
    'H22-C-07|지수·로그 방정식': { targetKey: 'H22-A-01', targetLabel: '지수와 로그', targetOrder: 1, targetSubUnit: 'H22-A-01-EXPONENT_LOG', rationale: '12개 문항이 지수·로그 방정식과 그 활용이며 합의 법칙과 곱의 법칙 부모와 불일치한다.' },
    'H22-C-08|여러 가지 부등식': { targetKey: 'H22-C-06', targetLabel: '여러 가지 방정식과 부등식', targetOrder: 6, targetSubUnit: 'H22-C-06-INEQUALITY_BASIC', rationale: '2개 문항이 절댓값·이차부등식 내용이며 순열과 조합 부모와 불일치한다.' },
    'H22-C-08|지수·로그 부등식': { targetKey: 'H22-A-01', targetLabel: '지수와 로그', targetOrder: 1, targetSubUnit: 'H22-A-01-EXPONENT_LOG', rationale: '7개 문항이 지수·로그 부등식이며 순열과 조합 부모와 불일치한다.' },
    'H22-C-09|경우의 수': { targetKey: 'H22-C-08', targetLabel: '순열과 조합', targetOrder: 8, targetSubUnit: 'H22-C-08-CORE', rationale: '3개 문항이 경우의 수·조합 내용이며 행렬 부모와 불일치한다.' },
    'H22-C-09|삼각함수의 뜻과 값': { targetKey: 'H22-A-04', targetLabel: '삼각함수', targetOrder: 4, targetSubUnit: 'H22-A-04-TRIGONOMETRIC_BASIC', rationale: '11개 문항이 삼각함수의 뜻·값·부채꼴·삼각비 내용이며 행렬 부모와 불일치한다.' },
    'M1-02|최대공약수와 최소공배수': { targetKey: 'M1-01', targetLabel: '소인수분해', targetOrder: 1, targetSubUnit: 'gcd_lcm', rationale: '두 문항 모두 최대공약수·최소공배수 조건을 직접 사용하므로 M1-01-GCD_LCM으로 정규화한다.' },
    'M1-04|기본 도형': { targetKey: 'M1-05', targetLabel: '기본도형', targetOrder: 5, targetSubUnit: 'preserve_target_parent', rationale: '문항 내용과 현재 subUnitKey가 기본 도형 부모에 일치한다.' },
    'M1-04|정수와 유리수의 계산': { targetKey: 'M1-02', targetLabel: '정수와 유리수', targetOrder: 2, targetSubUnit: 'preserve_target_parent', rationale: '문항 내용과 현재 subUnitKey가 정수와 유리수의 계산 부모에 일치한다.' },
    'M1-05|평면도형': { targetKey: 'M1-06', targetLabel: '평면도형의 성질', targetOrder: 6, targetSubUnit: 'preserve_target_parent', rationale: '문항 내용과 현재 subUnitKey가 평면도형 부모에 일치한다.' },
    'M1-06|입체도형': { targetKey: 'M1-07', targetLabel: '입체도형의 성질', targetOrder: 7, targetSubUnit: 'preserve_target_parent', rationale: '문항 내용과 현재 subUnitKey가 입체도형 부모에 일치한다.' },
    'M1-07|통계': { targetKey: 'M1-08', targetLabel: '자료의 정리와 해석', targetOrder: 8, targetSubUnit: 'preserve_target_parent', rationale: '문항 내용과 현재 subUnitKey가 통계·자료 정리 부모에 일치한다.' },
    'M2-02|식의 계산': { targetKey: 'M2-01', targetLabel: '수와 식', targetOrder: 1, targetSubUnit: 'algebra_by_content', rationale: '57개 문항이 모두 중2 수와 식 내용이며, 잘못 붙은 부등식·입체도형 suffix는 본문 지수/다항식 연산으로 재판정한다.' },
    'M2-03|일차함수': { targetKey: 'M2-04', targetLabel: '일차함수와 그래프', targetOrder: 4, targetSubUnit: 'linear_function_by_content', rationale: '16개 문항이 모두 일차함수·일차방정식 그래프 내용이며 한 문항만 잘못된 연립방정식 suffix를 사용한다.' },
    'M2-06|삼각형과 사각형의 성질': { targetKey: 'M2-05', targetLabel: '도형의 성질', targetOrder: 5, targetSubUnit: 'preserve_target_parent', rationale: '문항 내용과 현재 subUnitKey가 도형의 성질 부모에 일치한다.' },
    'M3-03|인수분해': { targetKey: 'M3-02', targetLabel: '다항식의 곱셈과 인수분해', targetOrder: 2, targetSubUnit: 'factorization_basic', rationale: '69개 문항이 모두 인수분해·완전제곱·공통인수 내용이며 현재 표준부모만 M3-02로 이동하면 된다.' },
    'M1-03|정수와 유리수': { targetKey: 'M1-02', targetLabel: '정수와 유리수', targetOrder: 2, targetSubUnit: 'preserve_target_parent', rationale: '문항 본문·현재 subUnitKey가 정수와 유리수 단원과 일치한다.' },
    'M1-03|좌표평면과 그래프': { targetKey: 'M1-04', targetLabel: '좌표평면과 그래프', targetOrder: 4, targetSubUnit: 'preserve_target_parent', rationale: '문항 본문·현재 subUnitKey가 좌표평면과 그래프 단원과 일치한다.' },
    'M2-03|일차부등식': { targetKey: 'M2-02', targetLabel: '일차부등식', targetOrder: 2, targetSubUnit: 'inequality_by_existing_suffix', rationale: '문항 본문이 일차부등식이며 일부 기존 subUnitKey만 현재 부모키로 잘못 붙어 있다.' },
    'M3-04|이차방정식': { targetKey: 'M3-03', targetLabel: '이차방정식', targetOrder: 3, targetSubUnit: 'preserve_target_parent', rationale: '문항 본문·현재 subUnitKey가 이차방정식 단원과 일치한다.' }
};

function targetSubUnit(rule, ref) {
    if (rule.targetSubUnit === 'preserve_target_parent') return ref.subUnitKey;
    if (rule.targetSubUnit === 'inequality_by_existing_suffix') return ref.subUnitKey.includes('WORD') ? 'M2-02-LINEAR_INEQUALITY_WORD' : 'M2-02-LINEAR_INEQUALITY';
    if (rule.targetSubUnit === 'quadratic_equation_by_content') {
        const content = String(ref.content || '');
        if (/중근|실근을 가지지|실근을 갖지/.test(content)) return 'H15-SA-05-DISCRIMINANT';
        if (/올바른 두 근|근을 구하려고/.test(content)) return 'H15-SA-05-QUADRATIC_SOLVING';
        return 'H15-SA-05-EQUATION_BASIC';
    }
    if (rule.targetSubUnit === 'algebra_by_content') {
        const content = String(ref.content || '');
        if (/\^A|\^B|\^a|\^b|거듭제곱|지수/.test(content)) return 'M2-01-EXPONENT_LAW';
        return 'M2-01-POLYNOMIAL_OPERATIONS';
    }
    if (rule.targetSubUnit === 'linear_function_by_content') {
        if (ref.subUnitKey.startsWith('M2-04-')) return ref.subUnitKey;
        return 'M2-04-LINEAR_FUNCTION_BASIC';
    }
    if (rule.targetSubUnit === 'factorization_basic') return 'M3-02-FACTORIZATION';
    if (rule.targetSubUnit === 'gcd_lcm') return 'M1-01-GCD_LCM';
    if (rule.targetSubUnit === 'quadratic_function_by_content') {
        const content = String(ref.content || '');
        if (/이차방정식/.test(content)) return 'H22-C-05-QUADRATIC_EQUATION';
        if (/최댓값|최솟값|최대|최소|직사각형|로봇|용기|집의 밑면|삼각형/.test(content)) return 'H22-C-05-QUADRATIC_FUNCTION_APPLICATION';
        if (/그래프|교점|접점|접할/.test(content)) return 'H22-C-05-QUADRATIC_FUNCTION_GRAPH';
        return 'H22-C-05-QUADRATIC_FUNCTION_APPLICATION';
    }
    if (rule.targetSubUnit === 'equation_by_content') {
        const content = String(ref.content || '');
        if (/연립/.test(content)) return 'H22-C-06-SYSTEM_OF_EQUATIONS';
        if (/삼차|사차|고차|세 정수 근|네 실근/.test(content)) return 'H22-C-06-HIGHER_EQUATION';
        return 'H22-C-06-EQUATION_BASIC';
    }
    if (rule.targetSubUnit === 'suffix_or_complex_operation') {
        if (ref.subUnitKey.endsWith('COMPLEX_BASIC')) return 'H15-SA-04-COMPLEX_BASIC';
        if (ref.subUnitKey.endsWith('COMPLEX_OPERATION')) return 'H15-SA-04-COMPLEX_OPERATION';
        return 'H15-SA-04-COMPLEX_OPERATION';
    }
    return rule.targetSubUnit;
}

function resolveQuestionTarget(rule, ref) {
    if (typeof rule.targetForQuestion === 'function') return rule.targetForQuestion(ref);
    return { targetKey: rule.targetKey, targetLabel: rule.targetLabel, targetOrder: rule.targetOrder, subUnitKey: targetSubUnit(rule, ref) };
}

export function adjudicateQueue() {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    const groups = queue.groups.map(group => {
        const rule = CANDIDATE_RULES[group.standardUnitKey + '|' + group.observedLabel];
        if (!rule) return { ...group, adjudication: 'CONTENT_REVIEW_HOLD', productionUsable: false, adjudicationRationale: '문항별 교육과정·세부단원 근거가 더 필요하다.' };
        const questionRefs = group.questionRefs.map(ref => {
            const target = resolveQuestionTarget(rule, ref);
            return { ...ref, proposedStandardUnitKey: target.targetKey, proposedStandardUnit: target.targetLabel, proposedStandardUnitOrder: target.targetOrder, proposedSubUnitKey: target.subUnitKey };
        });
        const targetKeys = [...new Set(questionRefs.map(ref => ref.proposedStandardUnitKey))];
        const targetLabels = [...new Set(questionRefs.map(ref => ref.proposedStandardUnit))];
        return { ...group, adjudication: 'CANDIDATE_CONFIRMED_NONPRODUCTION', productionUsable: false, adjudicationRationale: rule.rationale, proposedStandardUnitKey: targetKeys.length === 1 ? targetKeys[0] : 'MIXED', proposedStandardUnit: targetLabels.length === 1 ? targetLabels[0] : '문항별 분리', proposedStandardUnitOrder: targetKeys.length === 1 ? questionRefs[0].proposedStandardUnitOrder : null, questionRefs };
    });
    const candidateQuestions = groups.filter(group => group.adjudication === 'CANDIDATE_CONFIRMED_NONPRODUCTION').reduce((sum, group) => sum + group.affectedQuestionCount, 0);
    const holdQuestions = groups.filter(group => group.adjudication === 'CONTENT_REVIEW_HOLD').reduce((sum, group) => sum + group.affectedQuestionCount, 0);
    const payload = { schemaVersion: 'phase1-cross-unit-adjudication-v1', sourceQueueDigest: queue.digest, productionWriteAllowed: false, status: 'REVIEW_COMPLETE_NONPRODUCTION', totals: { groups: groups.length, questions: queue.totals.questions, candidateConfirmedGroups: groups.filter(group => group.adjudication === 'CANDIDATE_CONFIRMED_NONPRODUCTION').length, candidateConfirmedQuestions: candidateQuestions, holdGroups: groups.filter(group => group.adjudication === 'CONTENT_REVIEW_HOLD').length, holdQuestions }, groups };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(payload)), ...payload };
}

function renderMarkdown(report) {
    const lines = ['# 교차 단원 문항별 adjudication 결과', '', '- 상태: REVIEW_COMPLETE_NONPRODUCTION', '- production 반영: 0건', '- 후보 확정(비운영): ' + report.totals.candidateConfirmedQuestions + '문항', '- 추가 검토 보류: ' + report.totals.holdQuestions + '문항', '', '## 그룹 결과', '', '| 현재 key | 관측 라벨 | 문항 수 | 판정 | 제안 key |', '|---|---|---:|---|---|'];
    for (const group of report.groups) lines.push('| ' + group.standardUnitKey + ' | ' + group.observedLabel + ' | ' + group.affectedQuestionCount + ' | ' + group.adjudication + ' | ' + (group.proposedStandardUnitKey || '') + ' |');
    lines.push('', '후보 확정 항목도 `productionUsable=false`로 유지했다. 실제 JS 승격 전에는 proposed subUnitKey의 부모 정합성, 후보/운영 바이트 동기화, DB·index·identity·QA를 다시 통과시켜야 한다.', '');
    return lines.join('\n');
}

function main() {
    const report = adjudicateQueue();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'cross-unit-adjudication-v1.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(outputDir, 'cross-unit-adjudication-v1.md'), renderMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: outputDir, digest: report.digest, totals: report.totals, productionWriteAllowed: report.productionWriteAllowed }, null, 2));
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
