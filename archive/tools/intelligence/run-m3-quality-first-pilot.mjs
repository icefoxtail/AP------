import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const foundationDir = path.join(archiveDir, '_generated', 'intelligence');
const inventoryPath = path.join(foundationDir, 'phase1', 'middle3-foundation', 'M3_FRESH_INVENTORY.json');
const sidecarPath = path.join(archiveDir, 'data', 'question_metadata.json');
const outputDir = path.join(foundationDir, 'phase1', 'middle3-foundation', 'quality-first-pilot');

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

const cases = [
    {
        id: 'P01',
        file: 'original/middle/m3/1mid/19_금당중_1학기_중간_중3_기출.js',
        ordinal: 1,
        expected: { L1: '실수와 그 연산', L2: '제곱근과 실수', L3: '제곱근', L4: '제곱근의 뜻', bucket: 1, confidence: 'high', boundary: 'NONE', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '제곱근의 정의 x²=5를 각 보기의 관계에 적용해 판정한다.', primaryConcept: '제곱근의 뜻', primaryConceptReason: '문항이 제곱근의 정의와 양·음의 제곱근을 직접 묻는다.', rejectedAlternativeConcepts: ['제곱근의 성질: 식 변형 계산이 결정적이지 않음', '근호의 계산: 계산식 정리가 목적이 아님'], taxonomyReason: '정의 확인이 primary이며 수치나 표현 형식은 보조적이다.', difficultyReason: '한 정의를 직접 적용하고 전략 선택·분기·숨은 조건이 없다.' }
    },
    {
        id: 'P02',
        file: 'original/middle/m3/1mid/21_금당중_1학기_중간_중3_기출.js',
        ordinal: 7,
        expected: { L1: '실수와 그 연산', L2: '제곱근과 실수', L3: '수직선과 제곱근', L4: '근삿값', bucket: 3, confidence: 'medium', boundary: 'B23', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '제곱근표의 인접 제곱값을 대조해 √5와 √6의 소수 첫째 자리 수를 결정한다.', primaryConcept: '근삿값', primaryConceptReason: '표를 읽는 형식보다 제곱근의 근삿값 경계를 판정하는 절차가 결정적이다.', rejectedAlternativeConcepts: ['무리수의 위치: 수직선 위치를 묻지 않음', '실수의 대소: 두 무리수의 일반 비교가 목적이 아님'], taxonomyReason: '표는 evidence/representation이고 근삿값 판정이 L4다.', difficultyReason: '표의 조건 해석과 경계 선택이 필요해 직접 계산보다 한 단계 높다.' }
    },
    {
        id: 'P03',
        file: 'original/middle/m3/1mid/19_금당중_1학기_중간_중3_기출.js',
        ordinal: 11,
        expected: { L1: '실수와 그 연산', L2: '근호를 포함한 식의 계산', L3: '분모의 유리화', L4: '한 항의 유리화', bucket: 2, confidence: 'high', boundary: 'B12', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '분모의 √6을 √6으로 곱해 분모를 6으로 바꾼다.', primaryConcept: '한 항의 유리화', primaryConceptReason: '정답을 만드는 결정 절차가 단일 근호 분모의 유리화다.', rejectedAlternativeConcepts: ['합·차 꼴의 유리화: 켤레식 분모가 아님', '근호의 곱: 곱셈은 유리화의 수단일 뿐'], taxonomyReason: '단일 항 분모를 유리수로 만드는 정확한 L4다.', difficultyReason: '방법이 즉시 결정되는 표준 적용이며 계산 부담만으로 상향하지 않는다.' }
    },
    {
        id: 'P04',
        file: 'original/middle/m3/1mid/21_왕운중_1학기_중간_중3_기출.js',
        ordinal: 19,
        expected: { L1: '실수와 그 연산', L2: '제곱근과 실수', L3: '무리수와 실수', L4: '실수의 대소', bucket: 4, confidence: 'medium', boundary: 'B34', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: 'A, B, C의 근호식을 직접 같은 형태로 단순 비교하지 않고 차이를 계산해 순서를 확정한다.', primaryConcept: '실수의 대소', primaryConceptReason: '결정적인 부담은 서로 다른 근호식을 비교하는 전략 선택과 부호 판단이다.', rejectedAlternativeConcepts: ['근호의 계산: 식 정리는 비교를 위한 중간 단계', '근삿값: 근삿값표 사용이 핵심이 아님'], taxonomyReason: '표현된 식의 소재가 아니라 대소 비교 전략을 primary로 둔다.', difficultyReason: '여러 비교식과 부호/차이 해석이 결합되어 표준 직접 적용보다 높다.' }
    },
    {
        id: 'P05',
        file: 'original/middle/m3/1final/22_신흥중_1학기_기말_중3_기출c.js',
        ordinal: 1,
        expected: { L1: '다항식의 곱셈과 인수분해', L2: '다항식의 곱셈', L3: '곱셈공식', L4: '두 일차식의 곱', bucket: 2, confidence: 'high', boundary: 'B12', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '두 일차식의 곱을 전개해 xy 계수와 y² 계수를 비교한다.', primaryConcept: '두 일차식의 곱', primaryConceptReason: '곱셈공식을 역으로 적용하는 다항식 전개가 결정적이다.', rejectedAlternativeConcepts: ['인수분해: 주어진 곱을 분해하는 것이 아니라 전개함', '식의 값: 수치 대입이 목적이 아님'], taxonomyReason: '두 일차식의 곱 공식 자체가 반복 가능한 L4다.', difficultyReason: '공식 적용과 계수 비교가 한 번 결합되지만 전략 선택은 제한적이다.' }
    },
    {
        id: 'P06',
        file: 'original/middle/m3/1final/22_이수중_1학기_기말_중3_기출c.js',
        ordinal: 22,
        expected: { L1: '다항식의 곱셈과 인수분해', L2: '인수분해', L3: '인수분해 공식', L4: '합과 차', bucket: 3, confidence: 'high', boundary: 'B23', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '65²−35²를 (65+35)(65−35)로 바꾸어 근호 안을 계산한다.', primaryConcept: '합과 차', primaryConceptReason: '문항이 다른 풀이를 금지하고 제곱의 차 인수분해를 결정 전략으로 요구한다.', rejectedAlternativeConcepts: ['제곱식: 합차 구조가 핵심', '근호의 계산: 인수분해를 적용한 뒤의 후속 계산'], taxonomyReason: '인수분해를 이용한 수의 계산보다 공식 중심의 합과 차 path를 선택한다.', difficultyReason: '공식 선택은 명시되지만 근호와 수 계산이 결합된다.' }
    },
    {
        id: 'P07',
        file: 'original/middle/m3/1final/22_신흥중_1학기_기말_중3_기출c.js',
        ordinal: 21,
        expected: { L1: '다항식의 곱셈과 인수분해', L2: '인수분해', L3: '인수분해의 활용', L4: '조건식', bucket: 4, confidence: 'high', boundary: 'B34', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '대수막대의 총 넓이 x²+4x+3을 (x+1)(x+3)으로 인수분해해 직사각형의 두 변을 정한다.', primaryConcept: '인수분해의 활용', primaryConceptReason: '타일/직사각형은 representation이고, 변 길이를 결정하는 인수분해가 primary다.', rejectedAlternativeConcepts: ['이차함수: 함수 그래프나 함숫값을 사용하지 않음', '도형 활용(곱셈공식): 결정식이 인수분해 결과임'], taxonomyReason: 'source-unit M3-04가 아니라 실제 해결 전략에 맞는 M3-02 path다.', difficultyReason: '넓이 조건을 식으로 모델링하고 인수분해 결과를 역으로 해석한다.', conflict: 'source unit과 blind primary가 다르지만 HOLD 사유가 아니다.' }
    },
    {
        id: 'P08',
        file: 'original/middle/m3/1final/22_신흥중_1학기_기말_중3_기출c.js',
        ordinal: 18,
        expected: { L1: '이차방정식', L2: '이차방정식의 활용', L3: '도형', L4: '길이·넓이', bucket: 4, confidence: 'high', boundary: 'B34', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '접힌 직사각형의 넓이 x(60−2x)=400을 세우고 이차방정식을 인수분해해 x를 구한다.', primaryConcept: '이차방정식의 활용', primaryConceptReason: '접기 도형은 context이고, 미지 길이를 결정하는 넓이 방정식과 이차방정식 풀이가 결정적이다.', rejectedAlternativeConcepts: ['이차함수의 그래프: 그래프 해석을 하지 않음', '도형 자체: 도형 공식은 방정식 모델의 입력'], taxonomyReason: 'source-unit M3-04보다 결정 전략인 이차방정식 활용을 우선한다.', difficultyReason: '상황 모델링과 두 해의 조건 해석이 결합된다.', conflict: 'source unit과 blind primary가 다르지만 HOLD 사유가 아니다.' }
    },
    {
        id: 'P09',
        file: 'original/middle/m3/1final/25_연향중_1학기_기말_중3_기출c.js',
        ordinal: 8,
        expected: { L1: '이차함수', L2: '이차함수와 그 그래프', L3: '그래프와 식', L4: '점의 좌표', bucket: 2, confidence: 'high', boundary: 'B12', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '각 보기의 (x,y)를 y=2x²에 대입해 그래프 위 조건을 확인한다.', primaryConcept: '점의 좌표', primaryConceptReason: '그래프 그림보다 함수식과 좌표의 만족 관계가 결정적이다.', rejectedAlternativeConcepts: ['그래프의 모양: 포물선 형태를 판정하지 않음', '함숫값: 일반적인 함수값 계산이 아니라 점의 소속 확인'], taxonomyReason: '그래프는 representation이고 식-점 관계가 primary다.', difficultyReason: '식에 좌표를 직접 대입하는 표준 적용이다.' }
    },
    {
        id: 'P10',
        file: 'original/middle/m3/1final/25_왕운중_1학기_기말_중3_기출c.js',
        ordinal: 11,
        expected: { L1: '이차함수', L2: '이차함수와 그 그래프', L3: '이차함수의 뜻', L4: '이차함수 판별', bucket: 3, confidence: 'high', boundary: 'B23', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '식을 전개한 뒤 x²의 계수 2a−4가 0이 되는 a를 제외한다.', primaryConcept: '이차함수 판별', primaryConceptReason: '두 곱의 전개와 이차항 계수의 존재 조건이 결정적이다.', rejectedAlternativeConcepts: ['그래프와 계수: 그래프 조건을 사용하지 않음', '이차방정식: 방정식의 해를 구하는 문항이 아님'], taxonomyReason: '식의 최고차항 조건에 맞는 판별 L4다.', difficultyReason: '전개와 계수 조건 해석이 결합된다.' }
    },
    {
        id: 'P11',
        file: 'original/middle/m3/2final/22_매산중_2학기_기말_중3_기출.js',
        ordinal: 1,
        expected: { L1: '삼각비', L2: '삼각비', L3: '삼각비의 뜻', L4: 'sin·cos·tan', bucket: 2, confidence: 'high', boundary: 'B12', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '직각삼각형에서 주어진 각에 대해 sin/cos/tan을 대변·인접변·빗변 비로 대응한다.', primaryConcept: 'sin·cos·tan', primaryConceptReason: '직각삼각형 그림보다 삼각비 정의의 대응이 결정적이다.', rejectedAlternativeConcepts: ['직각삼각형의 변: 길이 계산이 주목적이 아님', '특수각 계산: 특수각 공식이 핵심이 아님'], taxonomyReason: '도형은 context이고 삼각비 정의 path를 선택한다.', difficultyReason: '정의에 직접 대응하며 전략 선택이 없다.' }
    },
    {
        id: 'P12',
        file: 'original/middle/m3/2final/22_매산중_2학기_기말_중3_기출.js',
        ordinal: 2,
        expected: { L1: '삼각비', L2: '삼각비의 활용', L3: '측정 문제', L4: '높이·거리', bucket: 3, confidence: 'medium', boundary: 'B23', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '원뿔 단면의 직각삼각형에서 주어진 각과 모선으로 높이를 삼각비로 구한다.', primaryConcept: '높이·거리', primaryConceptReason: '원뿔은 입체 representation이고 단면 직각삼각형의 삼각비가 결정적이다.', rejectedAlternativeConcepts: ['입체도형: 입체 부피/겉넓이를 구하지 않음', '삼각비의 뜻: 정의를 넘어 길이 역산'], taxonomyReason: '입체가 있어도 실제 풀이 전략이 삼각비 길이 계산이면 활용 path다.', difficultyReason: '입체를 단면으로 해석하고 미지 높이를 역산한다.' }
    },
    {
        id: 'P13',
        file: 'original/middle/m3/2final/22_매산중_2학기_기말_중3_기출.js',
        ordinal: 3,
        expected: { L1: '삼각비', L2: '삼각비의 활용', L3: '측정 문제', L4: '높이·거리', bucket: 3, confidence: 'high', boundary: 'B23', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '그림자 길이와 앙각으로 tan을 세워 나무 높이를 구한다.', primaryConcept: '높이·거리', primaryConceptReason: '실생활 소재는 context이고 높이 측정 삼각비가 결정적이다.', rejectedAlternativeConcepts: ['앙각·부각: 각 자체보다 높이 산출이 목적', '도형 length: 삼각비가 핵심 도구'], taxonomyReason: '측정 목적과 삼각비 역산에 맞는 L4다.', difficultyReason: '조건을 직각삼각형에 모델링하고 미지 높이를 역산한다.' }
    },
    {
        id: 'P14',
        file: 'original/middle/m3/2final/22_매산중_2학기_기말_중3_기출.js',
        ordinal: 16,
        expected: { L1: '원의 성질', L2: '원과 직선', L3: '원의 접선', L4: '접선 조건으로 각 구하기', bucket: 3, confidence: 'high', boundary: 'B23', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '접선-현 정리로 접선각을 같은 현의 원주각으로 옮겨 x,y를 구한다.', primaryConcept: '접선 조건으로 각 구하기', primaryConceptReason: '질문의 goal과 solution 모두 접선-현 정리가 각을 결정한다.', rejectedAlternativeConcepts: ['원주각과 중심각: 중심각 관계가 결정적이지 않음', '접선 길이: 길이를 구하지 않음'], taxonomyReason: '접선이 등장했기 때문이 아니라 접선-현 각 정리가 핵심이라 원과 직선이다.', difficultyReason: '접선각을 원주각으로 변환하고 삼각형 각과 결합한다.' }
    },
    {
        id: 'P15',
        file: 'original/middle/m3/2final/22_매산중_2학기_기말_중3_기출.js',
        ordinal: 17,
        expected: { L1: '원의 성질', L2: '원주각', L3: '원주각의 활용', L4: '내접사각형의 각', bucket: 2, confidence: 'high', boundary: 'B12', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '원에 내접한 사각형의 마주 보는 두 각의 합 180°와 직선각을 적용한다.', primaryConcept: '내접사각형의 각', primaryConceptReason: '사각형 내부 각의 관계가 결정적이고 접선/현 길이는 없다.', rejectedAlternativeConcepts: ['원의 접선: 접선이 없음', '중심각과 원주각: 중심각을 사용하지 않음'], taxonomyReason: '내접각 정리가 primary인 원주각 활용 path다.', difficultyReason: '보각 관계를 직접 적용하는 표준 문제다.' }
    },
    {
        id: 'P16',
        file: 'original/middle/m3/2final/22_매산중_2학기_기말_중3_기출.js',
        ordinal: 14,
        expected: { L1: '원의 성질', L2: '원주각', L3: '원주각의 활용', L4: '복합 각 추론', bucket: 3, confidence: 'medium', boundary: 'B23', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '두 반지름이 만드는 이등변삼각형의 밑각과 일직선 각을 연결해 x를 구한다.', primaryConcept: '복합 각 추론', primaryConceptReason: 'specific visual labels are needed but solution exposes a multi-step angle relation; representation alone is not the reason.', rejectedAlternativeConcepts: ['원의 접선: 접선 정리가 없음', '원주각과 중심각: 원주각 정리가 직접 사용되지 않음'], taxonomyReason: 'locked taxonomy has a composite angle path; no nearest node is invented.', difficultyReason: 'visual condition and two angle relations are combined; validated source image is available.' }
    },
    {
        id: 'P17',
        file: 'original/middle/m3/2final/25_왕운중_2학기_기말_중3_기출.js',
        ordinal: 3,
        expected: { L1: '원의 성질', L2: '원과 직선', L3: '원의 접선', L4: '접선 조건으로 길이 구하기', bucket: 3, confidence: 'medium', boundary: 'B23', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '외접 사각형의 맞은편 변 길이 합 관계로 CD와 x를 정한다.', primaryConcept: '접선 조건으로 길이 구하기', primaryConceptReason: '외접원은 네 변이 원에 접하는 조건이고 길이 관계가 결정적이다.', rejectedAlternativeConcepts: ['내접사각형의 각: 각이 아니라 변 길이를 묻음', '원주각: 원주각 계산이 없음'], taxonomyReason: '접선 조건의 길이 결과에 맞추며 외접 표현 자체만으로 nearest fallback하지 않는다.', difficultyReason: '접선 사각형의 맞은편 변 관계를 해석해야 한다.' }
    },
    {
        id: 'P18',
        file: 'original/middle/m3/2final/23_풍덕중_2학기_기말_중3_기출.js',
        ordinal: 22,
        expected: { L1: '원의 성질', L2: '원과 직선', L3: '원의 접선', L4: '접선 조건으로 각 구하기', bucket: 4, confidence: 'medium', boundary: 'B34', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '두 접선이 만드는 각과 원주각/중심각을 연결해 외부 점의 각을 구한다.', primaryConcept: '접선 조건으로 각 구하기', primaryConceptReason: '두 접선과 접점 사이 각의 관계가 solution의 결정 전략이다.', rejectedAlternativeConcepts: ['원주각의 활용: 원주각은 보조 변환', '접선 길이: 길이 계산이 목적이 아님'], taxonomyReason: 'goal이 두 접선의 각이므로 원과 직선의 각 L4다.', difficultyReason: '원주각에서 중심각으로 역변환하고 접선각을 산출한다.' }
    },
    {
        id: 'P19',
        file: 'original/middle/m3/2final/22_연향중_2학기_기말_중3_기출.js',
        ordinal: 7,
        expected: { L1: '통계', L2: '대푯값과 산포도', L3: '대푯값', L4: '평균·중앙값·최빈값', bucket: 1, confidence: 'high', boundary: 'NONE', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '자료를 정렬해 가운데 두 값의 평균으로 중앙값을 구한다.', primaryConcept: '평균·중앙값·최빈값', primaryConceptReason: '자료 해석의 핵심이 중앙값 정의의 직접 적용이다.', rejectedAlternativeConcepts: ['산점도: 시각자료가 없음', '분산: 산포 계산이 없음'], taxonomyReason: '대푯값 정의를 묻는 exact L4다.', difficultyReason: '정렬과 중앙값 정의를 직접 적용한다.' }
    },
    {
        id: 'P20',
        file: 'original/middle/m3/2final/22_신흥중_2학기_기말_중3_기출.js',
        ordinal: 22,
        expected: { L1: '통계', L2: '대푯값과 산포도', L3: '산포도', L4: '분산', bucket: 3, confidence: 'high', boundary: 'B23', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '평균에서의 편차 제곱을 합해 자료 수로 나누어 분산을 구한다.', primaryConcept: '분산', primaryConceptReason: '표/자료 형식이 아니라 편차 제곱 평균이라는 산포 전략이 결정적이다.', rejectedAlternativeConcepts: ['표준편차: 제곱근을 추가로 구하지 않음', '대푯값: 평균은 분산 계산의 중간값'], taxonomyReason: '분산 exact L4를 선택한다.', difficultyReason: '편차를 만들고 제곱·합·나눗셈의 구조를 유지해야 한다.' }
    },
    {
        id: 'P21',
        file: 'original/middle/m3/2final/22_연향중_2학기_기말_중3_기출.js',
        ordinal: 13,
        expected: { L1: '통계', L2: '상관관계', L3: '산점도', L4: '산점도 읽기', bucket: 2, confidence: 'high', boundary: 'B12', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '산점도에서 y>x 기준선보다 위에 있는 점을 세어 조건을 만족하는 학생 수를 구한다.', primaryConcept: '산점도 읽기', primaryConceptReason: '상관 방향이 아니라 좌표 조건을 산점도에서 읽는 것이 결정적이다.', rejectedAlternativeConcepts: ['상관관계 해석: 증가/감소 경향을 묻지 않음', '표 자료 해석: points on scatterplot이 source evidence'], taxonomyReason: '산점도는 representation이지만 좌표 조건 읽기가 반복 가능한 L4다.', difficultyReason: '기준선 조건을 해석해 점을 세는 직접 적용이다.' }
    },
    {
        id: 'P22',
        file: 'original/middle/m3/2final/23_순여중_2학기_기말_중3_기출.js',
        ordinal: 19,
        expected: { L1: '통계', L2: '상관관계', L3: '상관관계', L4: '상관관계가 약한 경우', bucket: 3, confidence: 'medium', boundary: 'B23', applicability: 'DEFAULT_SCOPE', selectable: true, hold: false, defect: false },
        evidence: { decisiveSolutionStep: '지워진 점을 제외한 산점도의 전체 방향에 증가/감소 경향이 없는지 판단한다.', primaryConcept: '상관관계가 약한 경우', primaryConceptReason: '산점도 형식보다 두 변량의 경향 유무를 해석하는 개념이 goal이다.', rejectedAlternativeConcepts: ['산점도 읽기: 특정 좌표를 세는 문항이 아님', '양의/음의 상관관계: 뚜렷한 방향이 없다는 판단'], taxonomyReason: 'locked taxonomy의 약한 상관관계 L4로 표현한다.', difficultyReason: '삭제된 점을 제외하고 전체 경향을 재구성한다.' }
    },
    {
        id: 'P23',
        file: 'original/middle/m3/2mid/23_왕운중_2학기_중간_중3_수학.js',
        ordinal: 18,
        expected: { L1: '', L2: '', L3: '', L4: '', bucket: 'UNKNOWN', confidence: 'UNKNOWN', boundary: 'UNKNOWN', applicability: 'UNKNOWN', selectable: false, hold: true, defect: true },
        evidence: { decisiveSolutionStep: '접기 대칭으로 길이를 옮긴 뒤 피타고라스 정리로 FC를 구한다.', primaryConcept: '피타고라스 정리의 활용', primaryConceptReason: '결정 전략이 locked M3 taxonomy의 실수·다항식·방정식·함수·삼각비·원·통계 path에 포함되지 않는다.', rejectedAlternativeConcepts: ['M3-06 원의 성질: 원/현/접선이 없음', 'M3-05 삼각비: 삼각비를 사용하지 않음'], taxonomyReason: '적합한 M3 L4 없음; nearest-L4 강제 금지.', difficultyReason: 'M3 taxonomy applicability를 결정할 수 없어 UNKNOWN/HOLD.', holdReason: '실제 decisive concept이 M2-07로 보이며 source folder/visual 형식만으로 HOLD하는 것은 아님.', foundationDefectReason: 'M3 production folder와 current unit에 M3 외 concept이 들어온 scope defect candidate.' }
    },
    {
        id: 'P24',
        file: 'original/middle/m3/2mid/23_풍덕중_2학기_중간_중3_수학.js',
        ordinal: 19,
        expected: { L1: '', L2: '', L3: '', L4: '', bucket: 'UNKNOWN', confidence: 'UNKNOWN', boundary: 'UNKNOWN', applicability: 'UNKNOWN', selectable: false, hold: true, defect: true },
        evidence: { decisiveSolutionStep: '정사면체를 정삼각형과 직각삼각형으로 분해해 밑면 넓이와 높이를 구한 뒤 부피를 계산한다.', primaryConcept: '입체도형 부피와 피타고라스', primaryConceptReason: '결정 전략이 M3 locked taxonomy의 어느 L1에도 적합하지 않다.', rejectedAlternativeConcepts: ['M3-05 삼각비: 삼각비를 사용하지 않음', 'M3-01 제곱근: 근호 계산은 입체 부피 풀이의 결과/중간 단계'], taxonomyReason: '적합한 M3 L4 없음; 입체라는 표현만으로 다른 L4에 넣지 않는다.', difficultyReason: 'M3 taxonomy applicability를 결정할 수 없어 UNKNOWN/HOLD.', holdReason: '실제 decisive concept이 M2-07/입체 geometry이며 representation 자체가 HOLD 사유가 아님.', foundationDefectReason: 'M3 production folder와 current unit에 M3 외 concept이 들어온 scope defect candidate.' }
    }
];

function main() {
    const inventory = readJson(inventoryPath);
    const byTuple = new Map(inventory.records.map(record => [record.sourceArchiveFile + '#' + record.sourceOrdinal, record]));
    const sidecar = readJson(sidecarPath);
    const sidecarByUid = new Map((sidecar.records || []).map(record => [record.questionUid, record]));
    const blind = [];
    for (const item of cases) {
        const source = byTuple.get(item.file + '#' + item.ordinal);
        if (!source) throw new Error('pilot source tuple missing: ' + item.file + '#' + item.ordinal);
        blind.push({
            pilotCaseId: item.id,
            sourceArchiveFile: item.file,
            sourceOrdinal: item.ordinal,
            questionUid: source.questionUid,
            sourceFingerprint: source.sourceFingerprint,
            curriculumKey: source.curriculum,
            courseKey: source.courseKey,
            sourceEvidence: {
                content: source.sourceFieldSnapshot.content,
                choices: source.sourceFieldSnapshot.choices,
                solution: source.sourceFieldSnapshot.solution,
                image: source.sourceFieldSnapshot.image,
                visualDependency: source.visualDependency,
                sharedMaterialDependency: source.sharedMaterialDependency
            },
            blindDecision: {
                ...item.expected,
                secondaryConceptKeys: [],
                decisiveSolutionStep: item.evidence.decisiveSolutionStep,
                primaryConcept: item.evidence.primaryConcept,
                primaryConceptReason: item.evidence.primaryConceptReason,
                rejectedAlternativeConcepts: item.evidence.rejectedAlternativeConcepts,
                taxonomyReason: item.evidence.taxonomyReason,
                difficultyReason: item.evidence.difficultyReason,
                holdReason: item.evidence.holdReason || '',
                foundationDefectReason: item.evidence.foundationDefectReason || '',
                conflictStatus: item.evidence.conflict || 'NONE'
            },
            legacyFieldsRevealed: false
        });
    }
    const uidSet = blind.map(record => record.questionUid).sort();
    const freeze = {
        schemaVersion: 'metadata-foundation-quality-first-initial-blind-pilot-v1',
        targetGrade: 'MIDDLE3',
        stage: 'GATE_1_INITIAL_BLIND_PILOT',
        status: 'A_BLIND_FREEZE',
        generatedAt: new Date().toISOString(),
        blindRule: 'existing metadata/L1/L2/L3/L4/difficulty/level/HOLD/conflict/reviewer/queue/source-unit omitted from A decision',
        representationRule: 'visual/graph/table/solid is evidence/context only and never primary taxonomy by itself',
        count: blind.length,
        uidSetSha: sha256(uidSet.join('\n')),
        records: blind
    };
    writeJson(path.join(outputDir, 'M3_INITIAL_BLIND_PILOT_A.json'), freeze);
    writeJson(path.join(outputDir, 'M3_INITIAL_BLIND_PILOT_FREEZE.json'), {
        schemaVersion: 'metadata-foundation-quality-first-pilot-freeze-v1',
        status: 'FROZEN_BEFORE_EXISTING_METADATA_REVEAL',
        count: blind.length,
        uidSetSha: freeze.uidSetSha,
        legacyFieldsRevealed: false
    });
    const compare = blind.map(record => {
        const existing = sidecarByUid.get(record.questionUid) || null;
        const a = record.blindDecision;
        const existingPath = existing ? { L1: existing.L1 || '', L2: existing.L2 || '', L3: existing.L3 || '', L4: existing.L4 || '' } : null;
        const existingDiff = existing ? {
            difficultyBucket: existing.difficultyBucket,
            difficultyConfidence: existing.difficultyConfidence,
            difficultyBoundaryFlag: existing.difficultyBoundaryFlag,
            legacyLevelCompatibility: existing.legacyLevelCompatibility,
            reviewStatus: existing.reviewStatus,
            L1: existing.L1,
            L2: existing.L2,
            L3: existing.L3,
            L4: existing.L4,
            metadataRevision: existing.metadataRevision
        } : null;
        return {
            pilotCaseId: record.pilotCaseId,
            questionUid: record.questionUid,
            sourceArchiveFile: record.sourceArchiveFile,
            sourceOrdinal: record.sourceOrdinal,
            blindDecision: a,
            existingMetadataRevealedAfterFreeze: existingDiff,
            pathAgreement: Boolean(existingPath && existingPath.L1 === a.L1 && existingPath.L2 === a.L2 && existingPath.L3 === a.L3 && existingPath.L4 === a.L4),
            existingRecordPresent: Boolean(existing),
            comparisonOnly: true
        };
    });
    const structuralFindings = [
        { id: 'PILOT-RC-001', category: 'GENERATION_ENGINE_DEFECT', status: 'CONFIRMED', finding: 'current builder filters source records by currentStandardUnitKey and queue target before primary classification; pilot P07/P08 demonstrate content-first L1 transfer cases', impact: 'source-unit anchoring can suppress or misplace valid primary taxonomy paths' },
        { id: 'PILOT-RC-002', category: 'GENERATION_ENGINE_DEFECT', status: 'CONFIRMED', finding: 'current classifier branches on keyword cues and has fallback L4 paths; pilot P16/P23/P24 demonstrate that a cue or nearest path cannot replace decisive strategy/path evidence', impact: 'L3/L4 can be assigned without exact canonical fit; out-of-scope items can be forced or mishandled' },
        { id: 'PILOT-RC-003', category: 'DIFFICULTY_ENGINE_DEFECT', status: 'CONFIRMED', finding: 'current difficulty output is structuralScore/boolean evidence and lacks decisiveSolutionStep/difficultyReason as required by the new contract', impact: 'bucket decisions are not reproducible from math evidence' },
        { id: 'PILOT-RC-004', category: 'REVIEW_GATE_DEFECT', status: 'CONFIRMED', finding: 'current independent_recheck is invoked by the same build process and reruns the same classifier; it is not a separate B context', impact: 'a wrong first-pass result can be re-packaged as RECHECK_PASS' },
        { id: 'PILOT-RC-005', category: 'EVIDENCE_PIPELINE_DEFECT', status: 'CONFIRMED', finding: 'apply/validation receipts contained writer-supplied parity claims rather than recomputing every protected-field and runtime comparison', impact: 'fake validation can mask source or sidecar drift' },
        { id: 'PILOT-RC-006', category: 'SOURCE_METADATA_DEFECT', status: 'CONFIRMED', finding: 'two original M3 source records have decisive M2-07/solid-geometry concepts while living in M3 source scope', impact: 'must remain explicit foundation defect candidates; source JS must not be changed' }
    ];
    const pathDisagreements = compare.filter(record => !record.pathAgreement).length;
    const pilotReport = {
        schemaVersion: 'metadata-foundation-quality-first-initial-pilot-compare-v1',
        targetGrade: 'MIDDLE3',
        stage: 'GATE_1_INITIAL_BLIND_PILOT',
        status: 'PILOT_FIX_REQUIRED',
        blindFreeze: 'M3_INITIAL_BLIND_PILOT_FREEZE.json',
        records: compare,
        summary: {
            total: compare.length,
            existingRecordMissing: compare.filter(record => !record.existingRecordPresent).length,
            pathDisagreements,
            blindHoldCount: compare.filter(record => record.blindDecision.hold).length,
            foundationDefectCandidateCount: compare.filter(record => record.blindDecision.defect).length,
            actualIndependentReviewer: false,
            structuralGateFailureCount: structuralFindings.length
        },
        structuralFindings
    };
    writeJson(path.join(outputDir, 'M3_INITIAL_BLIND_PILOT_COMPARE.json'), pilotReport);
    writeJson(path.join(outputDir, 'M3_INITIAL_BLIND_PILOT_ROOT_CAUSE_INPUT.json'), {
        schemaVersion: 'metadata-foundation-quality-first-root-cause-input-v1',
        status: 'GATE_1_FAILED_CONTINUE_TO_GATE_2',
        targetGrade: 'MIDDLE3',
        rootCauseFindings: structuralFindings,
        pilotPathDisagreements: pathDisagreements,
        note: 'Existing agreement is comparison evidence only and is not accepted as proof of correctness.'
    });
    console.log(JSON.stringify({
        status: pilotReport.status,
        count: compare.length,
        pathDisagreements,
        blindHolds: pilotReport.summary.blindHoldCount,
        foundationDefectCandidates: pilotReport.summary.foundationDefectCandidateCount,
        rootCauseFindings: structuralFindings.length,
        outputDir: path.relative(repoRoot, outputDir).replaceAll('\\', '/')
    }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
