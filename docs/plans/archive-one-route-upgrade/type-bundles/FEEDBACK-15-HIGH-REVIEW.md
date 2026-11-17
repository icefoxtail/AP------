# FEEDBACK-15c 고등·교과서 묶음 재검토

- 기준 결과: data/type-bundles-20261117 9781c265 (A 최종 118묶음·3,196줄).
- ACTIVE 정의 확인: main 905cdbd6e58c43af0fceec699a318db81bd71b4e, compiled taxonomy_registry.json의 키·정의·ownerPack·status.
- 고등 소량묶음에 속한 각 문항의 기존 독립 결정단계 근거와 기존 정의를 비교. 특정 흡수/배제 확인을 위해 동아 순열·조합, 팔마고 부정, 백발백중 자취의 본문·해설을 직접 재확인했다.
- 다른 판정 줄의 PT/TPL을 정답으로 가져오지 않음. 기존 묶음의 자기 판정 step을 재검토 자료로 사용.

## 변경
- 미적분/미적분Ⅱ 동일 개념 급수: 12+11=23줄로 통합. 수열극한: 6+1=7줄로 통합. 2022 과목명 미적분Ⅱ로 정규화하고 courseAliases로 원과목명 보존.
- 기하와벡터 미분법과 미적분Ⅱ 미분법은 과목 자체가 동일 개정명 쌍이 아니므로 통합하지 않고 관련키로 연결.
- 전체 동일 한글 이름 묶음은 학년/과목별 보존하고 relatedKeys에 상호 NPT ID 연결.
- 조건의 부정 1줄: PT_TRUTH_SET_RELATION로 흡수. 원문 p:|x|>2의 거짓 범위/여집합 |x|≤2 결정은 같은 공통수학2 팩 정의와 일치. 양화사 없는 조건이므로 PT_QUANTIFIER_NEGATION 흡수는 하지 않음.

## 유지 사유(억지 흡수 방지)
- NPT_H1_NEGATION: 같은 공통수학2 SETS_PROPOSITIONS 팩. 조건 p의 거짓인 범위를 여집합으로 구하므로 ACTIVE 정의의 진리집합·여집합과 참·거짓 연결에 해당한다. 모든·어떤이 없는 문항이므로 PT_QUANTIFIER_NEGATION으로는 흡수하지 않는다.
- NPT_H1_PERMUTATION: H1_FOUNDATION의 PT_H1_PERMUTATION_COMBINATION_CALCULATION은 주어진 nPr·nCr 값의 계산과 합·차로 정의되어 있다. 이 문항은 순열 등식에서 미지 n을 결정하므로 정의 확장 없이 흡수하지 않는다.
- NPT_H1_COMBINATION: PT_H1_CONSECUTIVE_COMBINATION_RATIO는 연속 조합의 비, 계산 키는 값의 합·차이다. 이 문항의 조합 대칭성으로 아래첨자 r을 결정하는 구조와 다르다.
- NPT_H2_EXPONENTIAL_FUNCTION: ALGEBRA_2022에는 지수방정식·부등식은 있으나 정의역에서 지수함수의 극값을 정하는 PT가 없다. PT_FUNCTION_EXTREMUM은 고1 FUNCTIONS_GRAPHS 팩이므로 교차 팩 흡수하지 않는다.
- NPT_H1_LOCUS: 실제 발문 PA²−PB²=4는 등거리 조건이 아니므로 PT_COORD_EQUIDISTANT로 흡수할 수 없다. 거리제곱 차의 자취를 보존한다.
- NPT_H1_SET_AGGREGATION: 두 문항 모두 원소의 곱을 구한다. PT_SET_AGGREGATE는 원소의 합만 정의하므로 억지 흡수하지 않는다.
- NPT_H1_INTEGER_REMAINDER: 동일 팩의 대우·귀류·명제판정과 달리 정수의 홀짝을 전개하여 나머지 수치를 계산한다. 중1 성질 키는 다른 학년 팩이다.
- NPT_H1_FUNCTION_MODEL: 평균속력을 거리/시간으로 새 함수식으로 세우는 문항이다. PT_FUNCTION_RECOVERY는 합성/입력치환 복원, PT_RATIONAL_EXPRESSION은 이미 주어진 유리식 계산으로 정의되어 모델링을 덮지 않는다.
- NPT_H1_EXPONENT_LAWS: 정수 거듭제곱의 합동식이며 복소수 주기·다항식 나머지정리와 다르다. 대수 팩의 지수법칙은 관련키만 유지한다.
- NPT_H1_LINEAR_EQUATION: 단일 일차방정식의 계수0·상수항 비0에 의한 해 없음 판정이다. PT_H1_SYSTEM_EQUATION은 둘 이상 방정식의 연립이므로 흡수하지 않는다.
- NPT_H1_QUADRATIC_EQUATION: 두 문항은 근 대입 차수낮추기와 근의공식 정수성이다. PT_H1_ROOT_COEFFICIENT_RELATION의 근의 합·곱, PT_H1_QUADRATIC_DISCRIMINANT의 실근 존재/위치 중 어느 하나도 전체를 덮지 않는다.
- NPT_PROB_COUNTING: 경로 점화, 격자 계수, 약수 계수, 합·곱 법칙 혼합이다. 확통 ACTIVE 순열·중복순열·조합은 이 전체를 덮지 않고 PT_H1_COUNTING_PRINCIPLE_GENERAL은 고1 팩이다.
- NPT_PROB_INTEGER_PARTITION: 짝수의 순서 없는 정수 분할을 열거한다. 동일 물체를 고정 수의 상자에 분배하는 중복조합 정의와 달리 분할수 구조이므로 유지한다.
- NPT_PROB_EXPONENT_LAWS: 확통 팩에 정수 거듭제곱 나머지 PT가 없다. 다른 과목 팩의 지수법칙과 관련키로 연결한다.
- NPT_PROB_PERMUTATION_COMBINATION: 7건은 순열·중복순열·조합·중복조합의 기호를 동시에 계산/구별한다. 동일 확통 팩의 세 개별 PT 중 하나로 전체를 흡수하면 다른 구조가 소실된다.
- NPT_MATH1_SYSTEM_INEQUALITY: 지수부등식과 로그부등식을 각각 풀고 교집합을 취한다. PT_LOG_INEQUALITY_DOMAIN은 로그 치환 구간·다항부등식 교집합, PT_LOG_FUNCTION_INEQUALITY는 로그 단조성으로 정의되어 지수+로그 연립 전체를 덮지 않는다.
- NPT_ALGEBRA_SET: 유한집합 닫힘 조건으로 거듭제곱 집합을 강제하여 로그합을 구한다. PT_SET_CONSTRUCTION은 공통수학2 팩이므로 대수 문항에 교차 팩 흡수하지 않는다.
- NPT_GEOMETRY_VECTOR_DIFFERENTIATION: 음함수·매개변수 미분이다. PT_DERIVATIVE_RULE_EVALUATION은 다항함수/곱함수/다항식나눗셈 관계 미분으로 좁아 덮지 않는다.
- NPT_H1_DIVISOR: 소인수 지수별 약수 개수·합을 다룬다. PT_H1_NUMBER_THEORETIC_COUNTING은 카드 두 수 공약수 포함배제이고 중1 약수 PT는 다른 학년이다.
- NPT_H1_MATRIX: 일반 행렬의 비가환성·영인자 명제 참거짓을 반례/증명으로 판정한다. 개별 성분계산·방정식·거듭제곱 항등식 PT 하나가 전체 법칙판정을 덮지 않는다.
- NPT_GEOMETRY_CONIC: 포물선·타원·쌍곡선·직선을 거리자취 정의로 비교한다. 특정 한 곡선의 정의/방정식 PT 중 하나로 전체 분류를 흡수하지 않는다.
- NPT_CALCULUS2_DIFFERENTIATION: 몫의 미분과 합성 로그미분이며 다항함수·곱함수만 명시된 PT_DERIVATIVE_RULE_EVALUATION보다 범위가 넓다.

## 검증
- 고등 단독 패치 적용 118→116묶음, UID 3,196개 정확 보존, 참조/고유성/개수/대표 UID 검사 PASS.
- absorbInto는 ACTIVE 키 존재 확인. relatedKeys는 ACTIVE PT 또는 현재 제안 NPT ID 존재 확인 PASS.
- 통합 후 같은 이름 상호 NPT 연결 24개.
- 원격 커밋·push 없음. 정본·등록기·시험지 JS 변경 없음.
- apply-high.py는 현재 산출물에 필드 단위 적용하며 중등 담당 변경 후 실행.
