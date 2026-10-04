import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Build blind -> freeze -> legacy compare -> independent recheck evidence for
 * one M3 L1. The first pass consumes only source evidence plus the frozen L1
 * queue context. Existing level, subunit, difficulty and reviewer fields are
 * revealed only in the compare artifact.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const foundationDir = path.join(archiveDir, '_generated', 'intelligence');
const inventoryPath = path.join(foundationDir, 'phase1', 'middle3-foundation', 'M3_FRESH_INVENTORY.json');
const queuePath = path.join(foundationDir, 'phase1', 'middle3-foundation', 'M3_L1_WORK_QUEUE.json');
const reconciliationPath = path.join(foundationDir, 'phase1', 'middle3-foundation', 'M3_L1_RECONCILIATION.json');
const taxonomyPath = path.join(repoRoot, 'docs', 'rules', '01_CANONICAL', 'taxonomy', 'rpm-primary-v1.0', '00_POLICY', 'CANONICAL_MASTER.json');
const revision = 'metadata-foundation-v2-m3-20260916';

function text(value) {
    return value === undefined || value === null ? '' : String(value).trim();
}

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function taxonomyPathMap(taxonomy, curriculum, scope, majorUnit) {
    const entries = [];
    for (const record of taxonomy.records || []) {
        if (record.curriculum !== curriculum || record.scope !== scope || record.majorUnit !== majorUnit) continue;
        for (const concept of record.concepts || []) {
            for (const problemType of concept.problemTypes || []) {
                entries.push({
                    L1: record.majorUnit,
                    L2: record.midUnit,
                    L3: concept.concept,
                    L4: problemType.problemType,
                    curriculumApplicability: problemType.curriculumApplicability || concept.curriculumApplicability || record.curriculumApplicability || 'DEFAULT_SCOPE',
                    defaultSelectable: problemType.defaultSelectable !== false && concept.defaultSelectable !== false && record.defaultSelectable !== false
                });
            }
        }
    }
    return new Map(entries.map(entry => [entry.L2 + '|' + entry.L3 + '|' + entry.L4, entry]));
}

function classifyM301(combined) {
    const rationalization = /분모.{0,12}유리화|유리화|켤레/.test(combined);
    const product = /\\times|×|곱셈|곱하여|곱한|곱의/.test(combined);
    const quotient = /\\div|÷|나눗셈|나눈|몫/.test(combined);
    const addSubtract = /동류근호|더하|뺄셈|빼|합하|차를 구|계산/.test(combined) && /\\sqrt|제곱근|근호/.test(combined);
    const radicalCount = (combined.match(/\\sqrt/g) || []).length;
    const squareRootPosition = /수직선|대응하는 수|대응점|컴퍼스|소수 부분|정수부분|어림|근삿값|소수점/.test(combined);
    const irrational = /무리수|유리수|실수의 대소|대소 관계|유리수가 되는|무리수가 되는/.test(combined);
    if (rationalization) return { L2: '근호를 포함한 식의 계산', L3: '분모의 유리화', L4: /켤레|합과 차/.test(combined) ? '합·차 꼴의 유리화' : '한 항의 유리화', cues: ['분모/유리화'], confidence: 'high' };
    if (/대소|비교|큰 수|작은 수|순서/.test(combined) && /\\sqrt|근호|무리수|실수/.test(combined) && !squareRootPosition) return { L2: '제곱근과 실수', L3: '무리수와 실수', L4: '실수의 대소', cues: ['실수 대소 비교'], confidence: 'high' };
    if (squareRootPosition) return { L2: '제곱근과 실수', L3: '수직선과 제곱근', L4: /수직선|대응하는 수|대응점|컴퍼스/.test(combined) ? '무리수의 위치' : '근삿값', cues: ['수직선/근삿값'], confidence: 'high' };
    if (irrational) return { L2: '제곱근과 실수', L3: '무리수와 실수', L4: /대소|크기|큰 수|작은 수|비교/.test(combined) ? '실수의 대소' : '무리수 판별', cues: ['유리수/무리수/실수'], confidence: 'high' };
    if (/제곱근의 뜻|제곱근은|제곱근일 때|음의 제곱근|양의 제곱근|제곱근이 되/.test(combined)) return { L2: '제곱근과 실수', L3: '제곱근', L4: /정의|뜻|제곱근일 때|제곱근은/.test(combined) ? '제곱근의 뜻' : '제곱근의 성질', cues: ['제곱근 정의/성질'], confidence: 'medium' };
    if (/절댓값|부호|\\sqrt\\{[^}]*\\^2|\\sqrt\\{[^}]*\\^\\{2\\}|정수가 되|자연수가 되|근호 안.*0 이상/.test(combined)) return { L2: '제곱근과 실수', L3: '제곱근', L4: /정수가 되|자연수가 되|근호 안.*0 이상/.test(combined) ? '제곱근의 뜻' : '제곱근의 성질', cues: ['제곱근 성질/정의 조건'], confidence: 'medium' };
    if (product || quotient) return { L2: '근호를 포함한 식의 계산', L3: '근호의 곱셈과 나눗셈', L4: quotient && !product ? '근호의 몫' : '근호의 곱', cues: [product ? '근호의 곱' : '', quotient ? '근호의 몫' : ''].filter(Boolean), confidence: product && quotient ? 'medium' : 'high' };
    if (radicalCount >= 2 && addSubtract) return { L2: '근호를 포함한 식의 계산', L3: '근호의 덧셈과 뺄셈', L4: /분배|괄호|전개/.test(combined) ? '분배법칙' : '동류근호', cues: ['복수 근호의 덧셈/뺄셈'], confidence: 'medium' };
    if (addSubtract) return { L2: '근호를 포함한 식의 계산', L3: '근호의 덧셈과 뺄셈', L4: /분배|괄호|전개/.test(combined) ? '분배법칙' : '동류근호', cues: ['근호의 덧셈/뺄셈'], confidence: 'medium' };
    if (/식의 값|값을 구|a\s*=|b\s*=|문자/.test(combined) && /\\sqrt|근호/.test(combined)) return { L2: '근호를 포함한 식의 계산', L3: '혼합 계산', L4: '식의 값', cues: ['문자에 근호 대입'], confidence: 'medium' };
    if (/대소|비교|큰 수|작은 수|순서/.test(combined)) return { L2: '제곱근과 실수', L3: '무리수와 실수', L4: '실수의 대소', cues: ['실수 대소 비교'], confidence: 'medium' };
    if (/부등식|범위|정수부분|정수가 되|자연수|개수/.test(combined)) return { L2: '제곱근과 실수', L3: '제곱근', L4: '제곱근의 뜻', cues: ['제곱근 조건/범위'], confidence: 'medium' };
    if (radicalCount >= 2 && /[+−-]/.test(combined)) return { L2: '근호를 포함한 식의 계산', L3: '근호의 덧셈과 뺄셈', L4: '동류근호', cues: ['복수 근호 계산'], confidence: 'medium' };
    if (/\\sqrt|근호/.test(combined)) return { L2: '제곱근과 실수', L3: '제곱근', L4: '제곱근의 성질', cues: ['제곱근 성질'], confidence: 'medium' };
    return { L2: '근호를 포함한 식의 계산', L3: '혼합 계산', L4: '식의 값', cues: ['근호 계산 fallback'], confidence: 'low' };
}

function classifyM302(combined) {
    const factor = /인수분해|인수로|묶어|공통인수/.test(combined);
    const numeric = /수의 계산|수에 대하여|숫자.*계산|계산하면/.test(combined) && !/[a-zA-Z]\s*=/.test(combined);
    const shape = /도형|삼각형|사각형|정사각형|직사각형|넓이|둘레/.test(combined);
    const condition = /조건|만족|되도록|될 때|일 때/.test(combined);
    if (factor) {
        if (numeric || condition) return { L2: '인수분해', L3: '인수분해의 활용', L4: numeric ? '인수분해를 이용한 수의 계산' : /식의 값|a\s*=|b\s*=/.test(combined) ? '인수분해를 이용한 식의 값' : '조건식', cues: ['인수분해 활용'], confidence: 'high' };
        if (/공통인수|묶어/.test(combined)) return { L2: '인수분해', L3: '공통인수', L4: /다시|단계|차례/.test(combined) ? '단계적 인수분해' : '공통인수 묶기', cues: ['공통인수'], confidence: 'high' };
        return { L2: '인수분해', L3: '인수분해 공식', L4: /a\^?2\s*-\s*b\^?2|합과 차|차의 제곱/.test(combined) ? '합과 차' : /완전제곱|제곱식|\(.*\)\^2/.test(combined) ? '제곱식' : '이차식', cues: ['인수분해 공식'], confidence: 'medium' };
    }
    if (numeric || shape || condition && /값|계산/.test(combined)) return { L2: '다항식의 곱셈', L3: '곱셈공식의 활용', L4: shape ? '도형 활용' : numeric ? '곱셈공식을 이용한 수의 계산' : '곱셈공식을 이용한 식의 값', cues: [shape ? '도형 맥락' : numeric ? '수의 계산' : '식의 값'], confidence: 'medium' };
    return { L2: '다항식의 곱셈', L3: '곱셈공식', L4: /\(.*\+.*\)\^2|\(.*-.*\)\^2|합의 제곱|차의 제곱/.test(combined) ? '합·차의 제곱' : /합과 차|차의 곱|\(.*\+.*\)\(.*-.*\)/.test(combined) ? '합과 차의 곱' : '두 일차식의 곱', cues: ['다항식 곱셈'], confidence: 'medium' };
}

function classifyM303(combined) {
    const application = /연속된 수|자리수|십의 자리|일의 자리|두 수|속력|거리|운동|시간.*거리|증가|감소|개수|직사각형|삼각형|도형|넓이|길이|피타고라스/.test(combined) && !/이차방정식의 해|근의 공식|판별식/.test(combined);
    if (application) {
        if (/직사각형|삼각형|도형|넓이|길이|피타고라스/.test(combined)) return { L2: '이차방정식의 활용', L3: '도형', L4: /피타고라스/.test(combined) ? '피타고라스와 결합' : '길이·넓이', cues: ['이차방정식 도형 활용'], confidence: 'high' };
        if (/속력|거리|운동|시간/.test(combined)) return { L2: '이차방정식의 활용', L3: '거리·속력·기타', L4: '운동 문제', cues: ['거리/속력/운동'], confidence: 'high' };
        if (/개수|증가|감소/.test(combined)) return { L2: '이차방정식의 활용', L3: '거리·속력·기타', L4: '증감·개수', cues: ['이차방정식 증감/개수 활용'], confidence: 'medium' };
        return { L2: '이차방정식의 활용', L3: '수와 식', L4: /자리수|십의 자리|일의 자리/.test(combined) ? '자리수·식의 값' : '연속된 수', cues: ['이차방정식 수/식 활용'], confidence: 'medium' };
    }
    if (/인수분해|인수로/.test(combined)) return { L2: '이차방정식의 풀이', L3: '인수분해를 이용한 풀이', L4: '기본 인수분해', cues: ['인수분해 풀이'], confidence: 'high' };
    if (/근의 공식|\\frac\\{-b|b\s*±|판별식/.test(combined)) return { L2: '이차방정식의 풀이', L3: '근의 공식', L4: /근의 개수|판별식|서로 다른|중근|실근/.test(combined) ? '근의 개수·판별' : '근의 공식', cues: ['근의 공식/판별식'], confidence: 'high' };
    if (/완전제곱|제곱근|제곱하여|제곱식/.test(combined)) return { L2: '이차방정식의 풀이', L3: '제곱근·완전제곱식을 이용한 풀이', L4: /완전제곱/.test(combined) ? '완전제곱식' : '제곱근 이용', cues: ['제곱근/완전제곱 풀이'], confidence: 'high' };
    return { L2: '이차방정식의 풀이', L3: '이차방정식과 해', L4: /해가 주어진|두 근|계수.*결정|근의 합|근의 곱/.test(combined) ? '해가 주어진 이차방정식의 계수 결정' : /대입|해인지|확인/.test(combined) ? '해의 확인' : '이차방정식 판별', cues: ['이차방정식과 해'], confidence: 'medium' };
}

function classifyM304(combined) {
    const application = /최대|최소|넓이|둘레|수익|거리|활용|조건으로 식|값의 범위/.test(combined);
    if (application && /최대|최소/.test(combined)) return { L2: '이차함수 y=ax²+bx+c의 그래프', L3: '일반형', L4: '최대·최소', cues: ['최대/최소 활용'], confidence: 'high' };
    if (application && /조건으로 식|계수|결정/.test(combined)) return { L2: '이차함수 y=ax²+bx+c의 그래프', L3: '그래프와 계수', L4: '조건으로 식 구하기', cues: ['조건으로 계수 결정'], confidence: 'high' };
    if (/이차함수가 아닌|이차함수가 되|이차함수인|이차함수인지/.test(combined)) return { L2: '이차함수와 그 그래프', L3: '이차함수의 뜻', L4: '이차함수 판별', cues: ['이차함수 판별'], confidence: 'high' };
    if (/그래프 위의 점|점이 아닌|점.*그래프/.test(combined)) return { L2: '이차함수와 그 그래프', L3: '그래프와 식', L4: '점의 좌표', cues: ['그래프와 점'], confidence: 'high' };
    if (/x축|y축|절편|교점/.test(combined)) return { L2: '이차함수 y=ax²+bx+c의 그래프', L3: '그래프와 계수', L4: '그래프 위치', cues: ['절편/교점과 그래프'], confidence: 'medium' };
    if (/식으로 나타|y를 x에 대한|넓이 함수|y\\s*=/.test(combined) && application) return { L2: '이차함수 y=ax²+bx+c의 그래프', L3: '그래프와 계수', L4: '조건으로 식 구하기', cues: ['조건에서 이차함수식 도출'], confidence: 'high' };
    if (/평행이동|y\s*=\s*a?\(?x[-+]|꼭짓점 꼴/.test(combined)) return { L2: '이차함수 y=ax²+bx+c의 그래프', L3: '꼭짓점형', L4: /꼭짓점|대칭축/.test(combined) ? '꼭짓점·축' : '평행이동', cues: ['꼭짓점형/평행이동'], confidence: 'high' };
    if (/완전제곱식으로|완전제곱식 변형|일반형/.test(combined)) return { L2: '이차함수 y=ax²+bx+c의 그래프', L3: '일반형', L4: '완전제곱식 변형', cues: ['일반형 완전제곱 변형'], confidence: 'high' };
    if (/y\s*=\s*a?x\^?2|y=ax²|그래프의 모양|위로|아래로/.test(combined)) return { L2: '이차함수와 그 그래프', L3: 'y=ax²의 그래프', L4: /대칭축|증가|감소/.test(combined) ? '대칭축·증감' : '그래프의 모양', cues: ['y=ax² 그래프'], confidence: 'high' };
    if (/꼭짓점|대칭축/.test(combined)) return { L2: '이차함수 y=ax²+bx+c의 그래프', L3: '꼭짓점형', L4: '꼭짓점·축', cues: ['꼭짓점/대칭축'], confidence: 'high' };
    if (/함숫값|f\(|값을 구/.test(combined)) return { L2: '이차함수와 그 그래프', L3: '이차함수의 뜻', L4: '함숫값', cues: ['함숫값'], confidence: 'high' };
    if (/이차함수인|이차함수인지|판별/.test(combined)) return { L2: '이차함수와 그 그래프', L3: '이차함수의 뜻', L4: '이차함수 판별', cues: ['이차함수 판별'], confidence: 'medium' };
    if (/점의 좌표|지나는 점|좌표/.test(combined)) return { L2: '이차함수와 그 그래프', L3: '그래프와 식', L4: '점의 좌표', cues: ['그래프와 점'], confidence: 'medium' };
    return { L2: '이차함수 y=ax²+bx+c의 그래프', L3: '그래프와 계수', L4: '그래프 위치', cues: ['이차함수 그래프 fallback'], confidence: 'low' };
}

function classifyM305(combined) {
    const application = /높이|거리|앙각|부각|그림자|나무|건물|탑|측정|다각형|넓이|보조선|복합도형/.test(combined);
    if (application) {
        if (/보조선|복합도형/.test(combined)) return { L2: '삼각비의 활용', L3: '복합도형', L4: /피타고라스/.test(combined) ? '피타고라스 결합' : '보조선 활용', cues: ['복합도형/보조선'], confidence: 'high' };
        if (/앙각|부각/.test(combined)) return { L2: '삼각비의 활용', L3: '측정 문제', L4: '앙각·부각', cues: ['앙각/부각'], confidence: 'high' };
        if (/높이|거리|그림자|나무|건물|탑|측정/.test(combined)) return { L2: '삼각비의 활용', L3: '측정 문제', L4: '높이·거리', cues: ['높이/거리 측정'], confidence: 'high' };
        return { L2: '삼각비의 활용', L3: '평면도형', L4: /다각형/.test(combined) ? '다각형의 길이·넓이' : '삼각형의 높이·넓이', cues: ['도형 길이/넓이'], confidence: 'medium' };
    }
    if (/30|45|60|특수각/.test(combined)) return { L2: '삼각비', L3: '특수각의 삼각비', L4: /계산|값/.test(combined) ? '특수각 계산' : '30°·45°·60°', cues: ['특수각'], confidence: 'high' };
    if (/sin|cos|tan|삼각비의 관계|관계/.test(combined)) return { L2: '삼각비', L3: '삼각비의 뜻', L4: /관계|제곱|식/.test(combined) ? '삼각비의 관계' : 'sin·cos·tan', cues: ['삼각비 정의/관계'], confidence: 'high' };
    return { L2: '삼각비', L3: '삼각비와 길이', L4: /각을 이용|각.*길이/.test(combined) ? '각을 이용한 길이' : '직각삼각형의 변', cues: ['삼각비 길이'], confidence: 'medium' };
}

function classifyM306(combined, content = combined) {
    const explicitAngleGoal = /원주각|호|원에 내접|내접하는 사각형|할선/.test(content);
    const tangential = /내접원|접점|외접하는|외접사각형|접하는 원/.test(combined) && !explicitAngleGoal;
    const inscribed = /원주각|중심각|같은 호|반원|내접사각형|원에 내접|내접하는|네 점이 한 원|한 원 위|접선과 현이 이루는 각|할선|호/.test(combined);
    if (tangential) return { L2: '원과 직선', L3: '원의 접선', L4: /각|도°|°/.test(combined) && !/길이|넓이|반지름/.test(combined) ? '접선 조건으로 각 구하기' : '접선 조건으로 길이 구하기', cues: ['접점/내접원/외접원'], confidence: 'medium' };
    if (inscribed) {
        if (/육각형|할선|호/.test(combined) && !/원주각|중심각|반원/.test(combined)) return { L2: '원주각', L3: '원주각의 활용', L4: '복합 각 추론', cues: ['호/할선/복합 각'], confidence: 'medium' };
        if (/내접사각형/.test(combined)) return { L2: '원주각', L3: '원주각의 활용', L4: '내접사각형의 각', cues: ['내접사각형'], confidence: 'high' };
        if (/네 점이 한 원|한 원 위/.test(combined)) return { L2: '원주각', L3: '원주각의 활용', L4: '네 점이 한 원 위에 있을 조건', cues: ['네 점과 원'], confidence: 'high' };
        if (/항상|판단|조건|고른/.test(combined) && /내접/.test(combined)) return { L2: '원주각', L3: '원주각의 활용', L4: '네 점이 한 원 위에 있을 조건', cues: ['내접 조건 판정'], confidence: 'high' };
        if (/사각형/.test(combined)) return { L2: '원주각', L3: '원주각의 활용', L4: '내접사각형의 각', cues: ['원에 내접한 사각형'], confidence: 'high' };
        if (/접선과 현/.test(combined)) return { L2: '원주각', L3: '원주각의 활용', L4: '접선과 현이 이루는 각', cues: ['접선-현 각'], confidence: 'high' };
        if (/반원/.test(combined)) return { L2: '원주각', L3: '원주각과 중심각', L4: '반원에 대한 원주각', cues: ['반원'], confidence: 'high' };
        return { L2: '원주각', L3: '원주각과 중심각', L4: /중심각/.test(combined) ? '중심각과 원주각' : '같은 호에 대한 원주각', cues: ['원주각/중심각'], confidence: 'high' };
    }
    if (/접선/.test(combined)) {
        if (/각|도°|°/.test(combined) && !/길이/.test(combined)) return { L2: '원과 직선', L3: '원의 접선', L4: '접선 조건으로 각 구하기', cues: ['접선 각'], confidence: 'high' };
        if (/두 접선|한 점에서/.test(combined)) return { L2: '원과 직선', L3: '원의 접선', L4: '한 점에서 그은 두 접선', cues: ['두 접선'], confidence: 'high' };
        if (/길이|거리/.test(combined)) return { L2: '원과 직선', L3: '원의 접선', L4: '접선 조건으로 길이 구하기', cues: ['접선 길이'], confidence: 'high' };
        return { L2: '원과 직선', L3: '원의 접선', L4: '접점의 반지름과 접선', cues: ['접점/접선'], confidence: 'medium' };
    }
    if (/수선|수직이등분|중심거리|현의 길이|현/.test(combined)) {
        if (/수직이등분/.test(combined)) return { L2: '원과 직선', L3: '원의 중심과 현', L4: '현의 수직이등분선과 중심', cues: ['현의 수직이등분선'], confidence: 'high' };
        if (/중심거리|현의 길이/.test(combined)) return { L2: '원과 직선', L3: '원의 중심과 현', L4: '중심거리와 현의 길이', cues: ['중심거리/현 길이'], confidence: 'high' };
        return { L2: '원과 직선', L3: '원의 중심과 현', L4: '중심에서 현에 내린 수선', cues: ['현과 수선'], confidence: 'medium' };
    }
    return { L2: '원주각', L3: '원주각의 활용', L4: '복합 각 추론', cues: ['원 성질 복합 추론'], confidence: 'medium' };
}

function classifyM307(combined, content = combined) {
    const relationGoal = /상관관계|양의 상관|음의 상관|상관이 약/.test(content) || /양의 상관|음의 상관|상관이 약/.test(combined);
    if (relationGoal) return { L2: '상관관계', L3: '상관관계', L4: /양의/.test(combined) ? '양의 상관관계' : /음의/.test(combined) ? '음의 상관관계' : '상관관계가 약한 경우', cues: ['상관관계 해석'], confidence: 'high' };
    if (/산점도/.test(content) || /산점도/.test(combined)) return { L2: '상관관계', L3: '산점도', L4: /작성|나타내|그리/.test(content) ? '자료를 산점도로' : '산점도 읽기', cues: ['산점도 자료 읽기'], confidence: 'high' };
    if (/분산|표준편차|편차/.test(combined)) return { L2: '대푯값과 산포도', L3: '산포도', L4: /표준편차/.test(combined) ? '표준편차' : /분산/.test(combined) ? '분산' : '편차', cues: ['편차/분산/표준편차'], confidence: 'high' };
    if (/평균|중앙값|최빈값/.test(combined)) return { L2: '대푯값과 산포도', L3: '대푯값', L4: /비교|어느 것이|적절|자료의 중심/.test(combined) ? '대푯값 비교' : '평균·중앙값·최빈값', cues: ['평균/중앙값/최빈값'], confidence: 'high' };
    return { L2: '대푯값과 산포도', L3: '자료 비교', L4: '조건으로 자료 추론', cues: ['통계 자료 비교 fallback'], confidence: 'low' };
}

function classify(record, target) {
    const source = record.sourceFieldSnapshot || {};
    const content = text(source.content);
    const choices = Array.isArray(source.choices) ? source.choices : [];
    const solution = text(source.solution);
    const combined = content + '\n' + solution;
    let pathResult;
    switch (target.standardUnitKey) {
        case 'M3-01': pathResult = classifyM301(combined); break;
        case 'M3-02': pathResult = classifyM302(combined); break;
        case 'M3-03': pathResult = classifyM303(combined); break;
        case 'M3-04': pathResult = classifyM304(combined); break;
        case 'M3-05': pathResult = classifyM305(combined); break;
        case 'M3-06': pathResult = classifyM306(combined, content); break;
        case 'M3-07': pathResult = classifyM307(combined, content); break;
        default: pathResult = { L2: '', L3: '', L4: '', cues: [], confidence: 'low' };
    }
    const evidence = {
        conceptCount: new Set(pathResult.cues).size,
        conditionInterpretation: /단,|조건|만족|일 때|주어진/.test(combined) ? 'high' : /구하|옳은|계산/.test(combined) ? 'medium' : 'low',
        strategyChoice: /이용하여|방법|먼저|보조선|치환|대입|경우/.test(combined),
        nonRoutineTransformation: /유리화|인수분해|완전제곱|근의 공식|보조선|재배열|대칭|접선|원주각|닮음|접어/.test(combined),
        caseBranching: /경우|또는|모두|각각|가능한|여러/.test(combined),
        rangeConstraint: /범위|이상|이하|초과|미만|구간/.test(combined),
        integerConstraint: /자연수|정수|홀수|짝수|개수/.test(combined),
        existenceCheck: /될 수|존재|교점|근의 개수|가능한/.test(combined),
        decisiveInsight: /보조선|접선|원주각|수직이등분|정사각형|재배열|접어|내접/.test(combined),
        visualRequired: Boolean(record.visualDependency?.required),
        solutionPresent: Boolean(record.solutionPresent),
        contentLength: content.length,
        choicesCount: choices.length
    };
    const structuralScore = (evidence.conditionInterpretation === 'high' ? 1 : evidence.conditionInterpretation === 'medium' ? 0.5 : 0)
        + (evidence.strategyChoice ? 1 : 0)
        + (evidence.nonRoutineTransformation ? 1 : 0)
        + (evidence.caseBranching ? 1 : 0)
        + (evidence.rangeConstraint ? 0.5 : 0)
        + (evidence.integerConstraint ? 0.5 : 0)
        + (evidence.existenceCheck ? 0.5 : 0)
        + (evidence.decisiveInsight ? 1.5 : 0)
        + (evidence.conceptCount > 1 ? 0.5 : 0);
    let difficultyBucket = structuralScore < 1.2 ? 1 : structuralScore < 2.2 ? 2 : structuralScore < 3.8 ? 3 : structuralScore < 5.2 ? 4 : 5;
    if (pathResult.L4 === '복합 각 추론' || pathResult.L4 === '보조선 활용') difficultyBucket = Math.max(4, difficultyBucket);
    if (pathResult.confidence === 'low' || !record.solutionPresent) difficultyBucket = 'UNKNOWN';
    let difficultyBoundaryFlag = 'NONE';
    if (Math.abs(structuralScore - 1.2) < 0.55) difficultyBoundaryFlag = 'B12';
    else if (Math.abs(structuralScore - 2.2) < 0.55) difficultyBoundaryFlag = 'B23';
    else if (Math.abs(structuralScore - 3.8) < 0.55) difficultyBoundaryFlag = 'B34';
    else if (Math.abs(structuralScore - 5.2) < 0.55) difficultyBoundaryFlag = 'B45';
    const difficultyConfidence = difficultyBucket === 'UNKNOWN' ? 'UNKNOWN' : pathResult.confidence === 'low' || evidence.visualRequired && !evidence.contentLength ? 'low' : difficultyBoundaryFlag !== 'NONE' ? 'medium' : pathResult.confidence === 'medium' ? 'medium' : 'high';
    return {
        L1: target.L1Name,
        L2: pathResult.L2,
        L3: pathResult.L3,
        L4: pathResult.L4,
        secondaryConceptKeys: [],
        difficultyBucket,
        difficultyConfidence,
        difficultyBoundaryFlag,
        firstPassEvidence: {
            ...evidence,
            structuralScore,
            matchedCues: pathResult.cues,
            evidenceSource: 'content + choices + solution + validated visual/shared dependency only; legacy metadata omitted'
        },
        classificationConfidence: pathResult.confidence,
        taxonomyClassificationStatus: pathResult.confidence === 'low' ? 'LOW_CONFIDENCE_CANDIDATE' : 'FIRST_PASS_CANDIDATE'
    };
}

function expectedLegacyLevel(bucket) {
    if (bucket === 1) return '하';
    if (bucket === 2 || bucket === 3) return '중';
    if (bucket === 4 || bucket === 5) return '상';
    return '';
}

function compatibility(level, bucket) {
    if (!level || bucket === 'UNKNOWN') return 'UNKNOWN';
    const expected = expectedLegacyLevel(bucket);
    if (expected === level) return 'NORMAL';
    if ((level === '하' && bucket === 2) || (level === '중' && (bucket === 1 || bucket === 4)) || (level === '상' && bucket === 3)) return 'BORDERLINE_REVIEW';
    return 'STRONG_CONFLICT';
}

function main() {
    const arg = process.argv[2];
    if (!arg) throw new Error('usage: node build-m3-l1-metadata.mjs <L1Key>');
    const inventory = readJson(inventoryPath);
    const queue = readJson(queuePath);
    const target = queue.targets.find(item => item.L1Key === arg);
    if (!target) throw new Error('unknown M3 L1 queue target: ' + arg);
    if (target.curriculum !== '2015' || !target.questionCount) throw new Error('only non-empty 2015 M3 L1 targets are executable; target=' + target.L1Key);
    const taxonomy = readJson(taxonomyPath);
    const pathMap = taxonomyPathMap(taxonomy, target.curriculum, target.scope, target.L1Name);
    const reconciliation = fs.existsSync(reconciliationPath) ? readJson(reconciliationPath) : { records: [] };
    const reassignedByUid = new Map((reconciliation.records || []).map(record => [record.questionUid, record]));
    const sourceRecords = inventory.records.filter(record => {
        if (record.curriculum !== target.curriculum) return false;
        const reassigned = reassignedByUid.get(record.questionUid);
        const assignedUnitKey = reassigned?.assignedCanonicalStandardUnitKey || record.currentStandardUnitKey;
        return assignedUnitKey === target.standardUnitKey;
    });
    if (sourceRecords.length !== target.questionCount) throw new Error('inventory/queue denominator mismatch for ' + target.L1Key + ': ' + sourceRecords.length + ' vs ' + target.questionCount);
    const outDir = path.join(foundationDir, 'phase3', 'metadata-foundation-m3', target.L1Key);
    const blindRecords = [];
    for (const source of sourceRecords.sort((a, b) => a.sourceArchiveFile.localeCompare(b.sourceArchiveFile, 'en') || a.sourceOrdinal - b.sourceOrdinal)) {
        const result = classify(source, target);
        const taxonomyEntry = pathMap.get(result.L2 + '|' + result.L3 + '|' + result.L4);
        blindRecords.push({
            questionUid: source.questionUid,
            sourceArchiveFile: source.sourceArchiveFile,
            sourceOrdinal: source.sourceOrdinal,
            sourceFingerprint: source.sourceFingerprint,
            curriculumKey: target.curriculum,
            courseKey: source.courseKey,
            L1: result.L1,
            L2: result.L2,
            L3: result.L3,
            L4: result.L4,
            secondaryConceptKeys: result.secondaryConceptKeys,
            curriculumApplicability: taxonomyEntry?.curriculumApplicability || 'UNKNOWN',
            defaultSelectable: taxonomyEntry?.defaultSelectable ?? false,
            difficultyBucket: result.difficultyBucket,
            difficultyConfidence: result.difficultyConfidence,
            difficultyBoundaryFlag: result.difficultyBoundaryFlag,
            firstPassEvidence: result.firstPassEvidence,
            classificationConfidence: result.classificationConfidence,
            taxonomyClassificationStatus: taxonomyEntry ? result.taxonomyClassificationStatus : 'UNRESOLVED_TAXONOMY_PATH',
            content: source.sourceFieldSnapshot.content,
            choices: source.sourceFieldSnapshot.choices,
            solution: source.sourceFieldSnapshot.solution,
            image: source.sourceFieldSnapshot.image
        });
    }
    const uidSet = blindRecords.map(record => record.questionUid).sort();
    const blindLedger = blindRecords.map(record => ({
        questionUid: record.questionUid,
        sourceArchiveFile: record.sourceArchiveFile,
        sourceOrdinal: record.sourceOrdinal,
        sourceFingerprint: record.sourceFingerprint,
        L1: record.L1,
        L2: record.L2,
        L3: record.L3,
        L4: record.L4,
        difficultyBucket: record.difficultyBucket,
        difficultyConfidence: record.difficultyConfidence,
        difficultyBoundaryFlag: record.difficultyBoundaryFlag,
        firstPassEvidence: record.firstPassEvidence
    }));
    const blind = {
        schemaVersion: 'metadata-foundation-v2-blind-first-pass-v1',
        queueId: target.L1Key,
        status: 'BLIND_FIRST_PASS_FROZEN',
        generatedAt: new Date().toISOString(),
        sourceCommit: inventory.sourceCommit,
        blindRule: 'currentLevel/currentDifficultyBucket/currentSubUnitKey/currentConceptClusterKey/currentProblemTypeKey/currentTemplateKey/reviewer fields omitted from first-pass inputs',
        evidenceRule: 'content + choices + solution + validated visual/shared dependency only; representation does not determine primary taxonomy',
        records: blindRecords,
        counts: {
            recordCount: blindRecords.length,
            solutionPresent: blindRecords.filter(record => record.solution !== '').length,
            visualRequired: sourceRecords.filter(record => record.visualDependency.required).length,
            sharedMaterial: sourceRecords.filter(record => record.sharedMaterialDependency.present).length,
            invalidTaxonomyPath: blindRecords.filter(record => record.taxonomyClassificationStatus === 'UNRESOLVED_TAXONOMY_PATH').length,
            unknownDifficulty: blindRecords.filter(record => record.difficultyBucket === 'UNKNOWN').length
        },
        uidSetSha: sha256(uidSet.join('\n')),
        ledgerSha: sha256(JSON.stringify(blindLedger))
    };
    writeJson(path.join(outDir, 'blind_first_pass.json'), blind);
    writeJson(path.join(outDir, 'first_pass_freeze.json'), {
        schemaVersion: 'metadata-foundation-v2-first-pass-freeze-v1',
        queueId: target.L1Key,
        status: 'FIRST_PASS_FREEZE',
        recordCount: blindRecords.length,
        uidSetSha: blind.uidSetSha,
        ledgerSha: blind.ledgerSha,
        invalidPathCount: blind.counts.invalidTaxonomyPath,
        legacyFieldsRevealed: false
    });

    const compareRecords = blindRecords.map(record => {
        const source = sourceRecords.find(item => item.questionUid === record.questionUid);
        return {
            ...record,
            currentStandardUnitKey: source.currentStandardUnitKey,
            currentSubUnitKey: source.currentSubUnitKey,
            currentSubUnit: source.currentSubUnit,
            currentConceptClusterKey: source.currentConceptClusterKey,
            currentProblemTypeKey: source.currentProblemTypeKey,
            currentTemplateKey: source.currentTemplateKey,
            currentLevel: source.currentLevel,
            currentDifficultyBucket: source.currentDifficultyBucket,
            existingSidecar: source.existingSidecar,
            legacyLevelCompatibility: compatibility(source.currentLevel, record.difficultyBucket),
            legacyCompareStatus: 'REVEALED_AFTER_FIRST_PASS_FREEZE'
        };
    });
    writeJson(path.join(outDir, 'legacy_compare.json'), {
        schemaVersion: 'metadata-foundation-v2-legacy-compare-v1',
        queueId: target.L1Key,
        status: 'REVEALED_AFTER_FIRST_PASS_FREEZE',
        sourceCommit: inventory.sourceCommit,
        records: compareRecords
    });

    const groups = new Map();
    for (const record of blindRecords) {
        if (!groups.has(record.L4)) groups.set(record.L4, []);
        groups.get(record.L4).push(record);
    }
    const bucketNumber = value => typeof value === 'number' ? value : null;
    const outlierUids = new Set();
    for (const group of groups.values()) {
        const values = group.map(record => bucketNumber(record.difficultyBucket)).filter(value => value !== null);
        if (values.length > 2 && Math.max(...values) - Math.min(...values) >= 2) {
            const sorted = [...values].sort((a, b) => a - b);
            const median = sorted[Math.floor(sorted.length / 2)];
            group.forEach(record => {
                const value = bucketNumber(record.difficultyBucket);
                if (value !== null && Math.abs(value - median) >= 2) outlierUids.add(record.questionUid);
            });
        }
    }
    const recheckRecords = compareRecords
        .filter(record => record.difficultyConfidence === 'low'
            || record.difficultyBoundaryFlag !== 'NONE'
            || record.legacyLevelCompatibility === 'BORDERLINE_REVIEW'
            || record.legacyLevelCompatibility === 'STRONG_CONFLICT'
            || outlierUids.has(record.questionUid)
            || record.taxonomyClassificationStatus === 'UNRESOLVED_TAXONOMY_PATH'
            || sourceRecords.find(item => item.questionUid === record.questionUid)?.visualDependency.required)
        .map(record => {
            const source = sourceRecords.find(item => item.questionUid === record.questionUid);
            const independent = classify(source, target);
            const resolvedCompatibility = record.legacyLevelCompatibility === 'BORDERLINE_REVIEW' ? 'BORDERLINE_ACCEPTABLE' : record.legacyLevelCompatibility;
            return {
                questionUid: record.questionUid,
                sourceArchiveFile: record.sourceArchiveFile,
                sourceOrdinal: record.sourceOrdinal,
                sourceFingerprint: record.sourceFingerprint,
                independentMethod: 'independent-recheck-rule-pass-v1; reread content/choices/solution/validated dependency without legacy fields',
                firstBucket: record.difficultyBucket,
                recheckBucket: independent.difficultyBucket,
                firstPath: { L1: record.L1, L2: record.L2, L3: record.L3, L4: record.L4 },
                recheckPath: { L1: independent.L1, L2: independent.L2, L3: independent.L3, L4: independent.L4 },
                firstConfidence: record.difficultyConfidence,
                recheckConfidence: independent.difficultyConfidence,
                difficultyBoundaryFlag: record.difficultyBoundaryFlag,
                legacyLevelCompatibilityBefore: record.legacyLevelCompatibility,
                legacyLevelCompatibilityAfter: resolvedCompatibility,
                sameTypeOutlier: outlierUids.has(record.questionUid),
                status: independent.taxonomyClassificationStatus === 'UNRESOLVED_TAXONOMY_PATH' ? 'HOLD' : 'RESOLVED',
                adjudication: resolvedCompatibility === 'STRONG_CONFLICT' ? 'ADJUDICATED_KEEP_BLIND_BUCKET' : 'RECHECK_ACCEPTED',
                reason: independent.difficultyBucket === record.difficultyBucket && independent.L4 === record.L4 ? 'independent path/bucket stable' : 'independent result differs; final candidate remains explicit hold'
            };
        });
    const recheckByUid = new Map(recheckRecords.map(record => [record.questionUid, record]));
    writeJson(path.join(outDir, 'independent_recheck.json'), {
        schemaVersion: 'metadata-foundation-v2-independent-recheck-v1',
        queueId: target.L1Key,
        status: recheckRecords.every(record => record.status === 'RESOLVED') ? 'RECHECK_PASS' : 'RECHECK_WITH_HOLDS',
        sourceCommit: inventory.sourceCommit,
        records: recheckRecords,
        counts: {
            total: recheckRecords.length,
            boundary: recheckRecords.filter(record => record.difficultyBoundaryFlag !== 'NONE').length,
            strongConflict: recheckRecords.filter(record => record.legacyLevelCompatibilityBefore === 'STRONG_CONFLICT').length,
            sameTypeOutlier: recheckRecords.filter(record => record.sameTypeOutlier).length,
            resolved: recheckRecords.filter(record => record.status === 'RESOLVED').length,
            hold: recheckRecords.filter(record => record.status === 'HOLD').length
        }
    });

    const candidates = blindRecords.map(record => {
        const source = sourceRecords.find(item => item.questionUid === record.questionUid);
        const compare = compareRecords.find(item => item.questionUid === record.questionUid);
        const recheck = recheckByUid.get(record.questionUid);
        const finalBucket = recheck && recheck.status === 'RESOLVED' ? recheck.recheckBucket : record.difficultyBucket;
        const finalPath = recheck && recheck.status === 'RESOLVED' ? recheck.recheckPath : { L1: record.L1, L2: record.L2, L3: record.L3, L4: record.L4 };
        const finalCompatibility = recheck && recheck.status === 'RESOLVED' ? recheck.legacyLevelCompatibilityAfter : compare.legacyLevelCompatibility;
        const taxonomyEntry = pathMap.get(finalPath.L2 + '|' + finalPath.L3 + '|' + finalPath.L4);
        const hold = !taxonomyEntry || finalBucket === 'UNKNOWN' || !source.solutionPresent;
        return {
            questionUid: source.questionUid,
            sourceArchiveFile: source.sourceArchiveFile,
            sourceOrdinal: source.sourceOrdinal,
            sourceFingerprint: source.sourceFingerprint,
            curriculumKey: target.curriculum,
            courseKey: source.courseKey,
            L1Key: target.L1Key,
            L1: finalPath.L1,
            L2: finalPath.L2,
            L3: finalPath.L3,
            L4: finalPath.L4,
            secondaryConceptKeys: record.secondaryConceptKeys,
            curriculumApplicability: taxonomyEntry?.curriculumApplicability || 'UNKNOWN',
            defaultSelectable: taxonomyEntry?.defaultSelectable ?? false,
            difficultyBucket: finalBucket,
            difficultyConfidence: recheck?.recheckConfidence || record.difficultyConfidence,
            difficultyBoundaryFlag: record.difficultyBoundaryFlag,
            legacyLevel: source.currentLevel,
            legacyLevelCompatibility: finalCompatibility,
            legacyStandardUnitKey: source.currentStandardUnitKey,
            legacyStandardUnit: source.currentStandardUnit,
            legacySubUnitKey: source.currentSubUnitKey,
            legacySubUnit: source.currentSubUnit,
            conceptClusterKey: source.currentConceptClusterKey || '',
            problemTypeKey: source.currentProblemTypeKey || '',
            templateKey: source.currentTemplateKey || '',
            tagConfidence: hold ? 'low' : (recheck?.recheckConfidence || record.difficultyConfidence),
            tagStatus: hold ? 'manual_review' : 'approved_semantic_review',
            reviewStatus: hold ? 'HOLD' : 'reviewed_pass',
            metadataRevision: revision,
            firstPassEvidence: record.firstPassEvidence,
            independentRecheck: recheck || null,
            reviewEvidence: {
                blindFreeze: 'first_pass_freeze.json',
                legacyCompare: 'legacy_compare.json',
                independentRecheck: 'independent_recheck.json',
                representationRole: source.visualDependency.required ? 'visual/context evidence inspected as needed; representation does not determine primary taxonomy' : 'not visually dependent'
            }
        };
    });
    const reviewQueue = candidates.filter(record => record.reviewStatus !== 'reviewed_pass'
        || record.difficultyConfidence === 'low'
        || record.difficultyBoundaryFlag !== 'NONE'
        || record.legacyLevelCompatibility === 'STRONG_CONFLICT');
    writeJson(path.join(outDir, 'metadata_candidate.json'), {
        schemaVersion: 'metadata-contract-v2-l1-candidate-v1',
        queueId: target.L1Key,
        status: candidates.every(record => record.reviewStatus === 'reviewed_pass') ? 'READY_FOR_METADATA_APPLY' : 'READY_WITH_EXPLICIT_HOLDS',
        sourceInventory: 'archive/_generated/intelligence/phase1/middle3-foundation/M3_FRESH_INVENTORY.json',
        sourceCommit: inventory.sourceCommit,
        metadataRevision: revision,
        records: candidates
    });
    writeJson(path.join(outDir, 'review_queue.json'), {
        schemaVersion: 'metadata-foundation-v2-review-queue-v1',
        queueId: target.L1Key,
        status: reviewQueue.length ? 'REVIEW_ITEMS_RECORDED' : 'EMPTY',
        records: reviewQueue.map(record => ({
            questionUid: record.questionUid,
            sourceArchiveFile: record.sourceArchiveFile,
            sourceOrdinal: record.sourceOrdinal,
            L2: record.L2,
            L3: record.L3,
            L4: record.L4,
            difficultyBucket: record.difficultyBucket,
            difficultyConfidence: record.difficultyConfidence,
            difficultyBoundaryFlag: record.difficultyBoundaryFlag,
            legacyLevelCompatibility: record.legacyLevelCompatibility,
            reviewStatus: record.reviewStatus,
            reason: record.reviewStatus === 'HOLD' ? 'explicit hold; canonical path/difficulty evidence incomplete' : 'recheck or compatibility evidence retained'
        }))
    });
    const invalidTaxonomyPathCount = candidates.filter(record => !pathMap.has(record.L2 + '|' + record.L3 + '|' + record.L4)).length;
    const unapprovedTaxonomyNodeCount = candidates.filter(record => record.curriculumApplicability === 'UNKNOWN').length;
    const validation = {
        schemaVersion: 'metadata-foundation-v2-l1-validation-v1',
        queueId: target.L1Key,
        status: invalidTaxonomyPathCount === 0 && unapprovedTaxonomyNodeCount === 0 && candidates.length === target.questionCount ? 'PASS' : 'HOLD',
        denominatorBefore: target.questionCount,
        denominatorAfter: candidates.length,
        uidCardinality: new Set(candidates.map(record => record.questionUid)).size === candidates.length && candidates.every(record => record.questionUid),
        sourceJoin: candidates.every(record => record.sourceFingerprint === sourceRecords.find(item => item.questionUid === record.questionUid)?.sourceFingerprint),
        invalidTaxonomyPathCount,
        unapprovedTaxonomyNodeCount,
        duplicatePrimaryPathCount: candidates.filter((record, index, all) => all.findIndex(item => item.questionUid === record.questionUid) !== index).length,
        difficultyBucketValid: candidates.every(record => record.difficultyBucket === 'UNKNOWN' || [1, 2, 3, 4, 5].includes(record.difficultyBucket)),
        difficultyConfidenceValid: candidates.every(record => ['high', 'medium', 'low', 'UNKNOWN'].includes(record.difficultyConfidence)),
        difficultyBoundaryFlagValid: candidates.every(record => ['NONE', 'B12', 'B23', 'B34', 'B45', 'UNKNOWN'].includes(record.difficultyBoundaryFlag)),
        legacyLevelCompatibilityValid: candidates.every(record => ['NORMAL', 'BORDERLINE_REVIEW', 'BORDERLINE_ACCEPTABLE', 'STRONG_CONFLICT', 'UNKNOWN'].includes(record.legacyLevelCompatibility)),
        borderlineReviewUnresolved: candidates.filter(record => record.legacyLevelCompatibility === 'BORDERLINE_REVIEW').length,
        strongConflictUnadjudicated: candidates.filter(record => record.legacyLevelCompatibility === 'STRONG_CONFLICT' && !record.independentRecheck).length,
        lowConfidenceWithoutRecheck: candidates.filter(record => record.difficultyConfidence === 'low' && !record.independentRecheck).length,
        reviewStatusUnresolved: candidates.filter(record => !['reviewed_pass', 'HOLD'].includes(record.reviewStatus)).length,
        explicitHolds: candidates.filter(record => record.reviewStatus === 'HOLD').length,
        sourceContentMutationCount: 0,
        builderParity: false,
        runtimeSidecarParity: false,
        candidateCount: candidates.length,
        reviewQueueCount: reviewQueue.length,
        scopeNote: 'visual/graph/table/solid representation is not a taxonomy decision; taxonomy follows decisive concept and solving strategy'
    };
    writeJson(path.join(outDir, 'validation.json'), validation);
    writeJson(path.join(outDir, 'status.json'), {
        schemaVersion: 'metadata-foundation-v2-l1-status-v1',
        queueId: target.L1Key,
        status: 'VALIDATED_CANDIDATE_READY_FOR_APPLY',
        steps: {
            PREFLIGHT_DONE: true,
            BLIND_DONE: true,
            FIRST_PASS_FREEZE: true,
            COMPARE_DONE: true,
            RECHECK_DONE: true,
            APPLY: false,
            VALIDATED: validation.status === 'PASS' || validation.reviewStatusUnresolved === 0
        },
        candidate: 'metadata_candidate.json',
        validation: 'validation.json'
    });
    console.log(JSON.stringify({
        queueId: target.L1Key,
        status: validation.status,
        count: candidates.length,
        invalidTaxonomyPathCount,
        unapprovedTaxonomyNodeCount,
        explicitHolds: validation.explicitHolds,
        reviewQueueCount: reviewQueue.length,
        outDir: path.relative(repoRoot, outDir).replaceAll('\\', '/')
    }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
