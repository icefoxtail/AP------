# Archive 2.0 확장 키 통합 후보 보고서 (2026-10-30)

S14b(사용자 지시 2026-10-29)의 부산물입니다. 정식 키와 Generated 전용 확장 키(EXT-*)를 사용 계층에서 한 트리로 보여 주기 위해 읽기 전용 해석기
(`archive/archive2-key-resolver.js`)를 만들면서 얻은 **통합 후보 목록**이며, 나중에 승격·alias 결정을 내릴 때 참고하는 자료입니다.
이 보고서는 어떤 키도 병합·개명·삭제하지 않았고, 정식 레지스트리와 RPM LOCKED 값, 원본 기출 문항도 건드리지 않았습니다.
재생성: `node archive/tools/report-archive2-extension-key-candidates.cjs`

## 0. 읽는 법

* 확장 키 정의는 `archive/generated/lite/v1/**/extension-meta|extension-l4|extension-l3/*.json`(및 있을 경우 `archive/data/meta-foundation/extensions/**`)에서 추출한 파생 색인
  `archive/data/archive2-extension-keys.json`에서 읽습니다(원본 파일은 읽기만 함). 부모는 정의가 스스로 밝힌 값(RPM 레코드 id, 확장 L3 키, L3 이름)만 사용하며, 이름 일치는 같은 교육과정 안에서만 인정합니다(2015↔2022 변환 없음).
* 부모 연결 상태: `RECORD`(RPM 레코드 id로 확정), `EXT_PARENT`(확장 L3 아래), `LABEL`/`LABEL_UNIT`(L3 이름이 유일하게 일치 / 표준단원으로 확정), `LABEL_AMBIGUOUS`(같은 이름이 여러 단원), `LABEL_UNRESOLVED`(현재 RPM 활성 crosswalk에 없는 이름), `CODE_ONLY`(L3 코드만 있음), `EXT_PARENT_NO_ANCHOR`(부모 확장 L3가 정식 부모를 못 찾음), `RECORD_UNKNOWN`, `NONE`.
* 사용 현황은 `archive/data/generated-lite-consumer/v1/index.json`의 생성 문항 행이 실제로 들고 있는 키를 센 값입니다(원본 기출 문항에는 확장 키가 없음을 테스트가 보증).
* 중복 판정은 휴리스틱입니다: 정규화한 이름(NFKC·공백/기호 제거) 일치, 슬롯 접두어(`B3 `) 제거 후 일치, 같은 부모 안에서 bigram Dice ≥ 0.80. **후보일 뿐이며 의미 동일 여부는 사람이 판단합니다.**

## 1. 요약

| 항목 | 값 |
| --- | --- |
| 정식 키(PT·TPL·연결 개념·조건) 수 | 1924 |
| RPM L3 노드(활성 crosswalk 기준) | 131 |
| 확장 키 정의 수 | 280 |
| 종류별 | cond=28, cross=28, l3=6, l4=195, pt=1, tpl=22 |
| 상태 구분(tier)별 | active=142, candidate=132, superseded=6 |
| 부모 연결됨 | 265 |
| 부모 없음/확인 불가(§2) | 15 |
| 부모 후보가 여러 개(§2b) | 0 |
| 정식 키와 같은 이름(§4) | 2 |
| 확장끼리 같은 이름 / 슬롯 접두어만 다름 / 비슷한 이름(§5) | 0 / 2 / 6 |
| 정의 없이 문항만 들고 있는 확장 키(§3) | 26 |
| 정식·확장 어느 쪽에도 없는 키를 가진 생성 문항 키 수(§3b) | 66 |
| 정의는 있으나 어떤 생성 문항도 쓰지 않는 확장 키 | 112 |
| 확장 키를 가진 생성 문항 / 전체 생성 문항 | 169 / 717 |
| 계승(superseded)으로 표시된 키 | 6 |

## 2. 부모가 없는(또는 확인되지 않는) 확장 키

“부모 필수” 규칙 기준으로 정식 RPM L3에 연결하지 못한 키입니다. 해결은 (a) 정의 파일에 부모 RPM 레코드 id를 기록하거나 (b) 현재 RPM에 없는 L3라면 정식 L3 신설·승격 판단이 필요합니다.

| 키 | 종류 | 이름 | 상태 | 선언된 부모 단서 | 사용 문항 | 파일 |
| --- | --- | --- | --- | --- | --- | --- |
| EXT-COND-JEIL25-Q08-EXACT-LIAR-COUNT | cond | 거짓 발언자 수의 정확한 개수 | NONE | (없음) | 0 | …/H22-C2-06-CORE/extension-meta/jeil25_2final_q08_conditions.json |
| EXT-COND-JEIL25-Q08-UNIQUE-WINNER | cond | 당첨자 정확히 한 명 조건 | NONE | (없음) | 0 | …/H22-C2-06-CORE/extension-meta/jeil25_2final_q08_conditions.json |
| EXT-H1-2022-C2-CIRCLE-LINE-MULTI-ARC-DISTINCT-COUNT-001 | l4 | 다중 반원 교점·중복 제거 | CODE_ONLY | 코드: L3-1.3.2 | 1 | …/H22-C2-03-CIRCLE_EQUATION/extension-l4/palma-B01-generated-active.json |
| EXT-H1-2022-C2-CIRCLE-TANGENT-CONTACT-CHORD-INVERSE-001 | l4 | 접촉현 거리 역조건 | CODE_ONLY | 코드: L3-1.3.3 | 1 | …/H22-C2-03-CIRCLE_EQUATION/extension-l4/palma-B01-generated-active.json |
| EXT-H1-BSG26-ABS-DIFFERENCE-SIGN | l4 | 절댓값 차의 구간별 부호 전환 | EXT_PARENT_NO_ANCHOR | 확장 부모: EXT-H1-BSG26-ABS-PIECEWISE-L3 | 0 | …/H22-C-06-INEQUALITY/extension-l4/registry.json |
| EXT-H1-BSG26-ABS-DISTANCE-SUM-INTERVAL | l4 | 두 절댓값 거리합이 만드는 해구간 | EXT_PARENT_NO_ANCHOR | 확장 부모: EXT-H1-BSG26-ABS-PIECEWISE-L3 | 0 | …/H22-C-06-INEQUALITY/extension-l4/registry.json |
| EXT-H1-BSG26-ABS-GLOBAL-MINIMUM | l4 | 절댓값 합의 최솟값으로 해의 존재를 판정 | EXT_PARENT_NO_ANCHOR | 확장 부모: EXT-H1-BSG26-ABS-PIECEWISE-L3 | 0 | …/H22-C-06-INEQUALITY/extension-l4/registry.json |
| EXT-H1-BSG26-ABS-PARAMETER-INVERSE | l4 | 거리합의 해구간 끝점으로 변수 역산 | EXT_PARENT_NO_ANCHOR | 확장 부모: EXT-H1-BSG26-ABS-PIECEWISE-L3 | 0 | …/H22-C-06-INEQUALITY/extension-l4/registry.json |
| EXT-H1-BSG26-ABS-PIECEWISE-L3 | l3 | 절댓값을 포함한 부등식 | NONE | (없음) | 0 | …/H22-C-06-INEQUALITY/extension-l3/registry.json |
| EXT-H1-C08-L3-ADJACENCY-COLOR | l3 | 인접 영역 조건에 따른 색칠 경우의 수 | NONE | (없음) | 0 | …/H22-C-08-COUNTING_PRINCIPLE/extension-l3/registry.json |
| EXT-H1-C08-L3-DIGIT-CONSTRUCTION | l3 | 배수·나머지 제약을 갖는 자리수 구성 | NONE | (없음) | 0 | …/H22-C-08-COUNTING_PRINCIPLE/extension-l3/registry.json |
| EXT-H1-C09-L3-STATE-TRANSITION | l3 | 행렬로 나타낸 단계별 상태 이동과 경로 수 | NONE | (없음) | 0 | …/H22-C-09-MATRIX_OPERATION/extension-l3/registry.json |
| EXT-H1-C2-01-Q04-CONSTRAINED-DISTANCE-SUM | l4 | 직선·반직선 제약 아래 거리합 최적화 | LABEL_UNRESOLVED | L3 이름: 평면좌표: 두 점 사이 거리 및 거리합의 최솟값 | 0 | …/H22-C2-01-COORDINATE_METRIC/extension-l4/registry.json |
| EXT-H1-C2-01-Q04-DISTANCE-SUM-LOWER-BOUND | l4 | 평면 전체에서 두 거리의 합 최솟값 | LABEL_UNRESOLVED | L3 이름: 평면좌표: 두 점 사이 거리 및 거리합의 최솟값 | 0 | …/H22-C2-01-COORDINATE_METRIC/extension-l4/registry.json |
| EXT-H1-C2-01-Q04-INVERSE-DISTANCE-SUM | l4 | 위치·매개변수 제약과 거리합 최소 복원 | LABEL_UNRESOLVED | L3 이름: 평면좌표: 두 점 사이 거리 및 거리합의 최솟값 | 0 | …/H22-C2-01-COORDINATE_METRIC/extension-l4/registry.json |

### 2b. 같은 L3 이름이 여러 단원에 있어 자동으로 하나를 고르지 않은 키

_none_

## 3. 문항은 들고 있지만 어떤 확장 레지스트리에도 정의가 없는 키

문항 메타(`crossConceptKeys`/`conditionKeys`/`rpmL4`)에만 있고 `extension-meta`·`extension-l4`에 정의가 없는 키입니다. 해석기는 이 키도 `확장`으로 표시하고, 상위 개념은 문항 자신의 RPM 레코드에서만 추정(“문항 기록”)합니다. 정의 파일 보완 또는 정식 키 재사용 여부 결정이 필요합니다.

| 키 | 종류(접두어 기준) | 사용 문항 | 문항 기록상 상위 L3 |
| --- | --- | --- | --- |
| EXT-GD25-C2-05-Q02-DIVISIBILITY-PROPER-INCLUSION | l4(추정) | 1 | 부분집합 |
| EXT-GD25-C2-05-Q02-DOUBLE-INCLUSION-PARAMETER | l4(추정) | 1 | 부분집합 |
| EXT-GD25-C2-05-Q02-INTERSECTION-CONSTRAINED-SUBSET | l4(추정) | 1 | 부분집합 |
| EXT-GD25-C2-05-Q02-PARAMETER-SUBSET | l4(추정) | 1 | 부분집합 |
| EXT-GD25-C2-05-Q02-PROPER-SUBSET | l4(추정) | 1 | 부분집합 |
| EXT-GD25-C2-05-Q02-SET-OPERATION-INCLUSION | l4(추정) | 1 | 부분집합 |
| EXT-GD25-C2-05-Q02-SHIFTED-INTERVAL-INCLUSION | l4(추정) | 1 | 부분집합 |
| EXT-GD25-Q02-CC-ABS-BOUNDS | cross | 1 | 부분집합 |
| EXT-GD25-Q02-CC-DIVISIBILITY | cross | 1 | 부분집합 |
| EXT-GD25-Q02-CC-EMPTYSET | cross | 1 | 부분집합 |
| EXT-GD25-Q02-CC-EVEN | cross | 1 | 부분집합 |
| EXT-GD25-Q02-CC-INT-INTERVAL | cross | 1 | 부분집합 |
| EXT-GD25-Q02-CC-LINEAR-BOUNDS | cross | 1 | 부분집합 |
| EXT-GD25-Q02-CC-MULTIPLES | cross | 2 | 부분집합 |
| EXT-GD25-Q02-CC-NONMEMBER | cross | 1 | 부분집합 |
| EXT-GD25-Q02-CC-SET-DIFFERENCE | cross | 1 | 부분집합 |
| EXT-GD25-Q02-CC-SET-OPS | cross | 1 | 부분집합 |
| EXT-GD25-Q02-COND-INCLUSION-EXCLUSION | cond | 2 | 부분집합 |
| EXT-GD25-Q02-COND-ONE-INTERSECTION | cond | 1 | 부분집합 |
| EXT-GD25-Q02-COND-PROPER-INCLUSION | cond | 2 | 부분집합 |
| EXT-GD25-Q02-COND-SET-DIFFERENCE | cond | 1 | 부분집합 |
| EXT-H1-C2-05-GD25-Q01-EMPTY-SET-DECIDABILITY | l4(추정) | 1 | 집합과 원소 |
| EXT-H1-C2-05-GD25-Q01-MEASURED-RELATIVE | l4(추정) | 1 | 집합과 원소 |
| EXT-H1-C2-05-GD25-Q01-MULTI-CRITERION | l4(추정) | 2 | 집합과 원소 |
| EXT-H1-C2-05-GD25-Q01-PREDICATE-INDEPENDENT-CARDINALITY | l4(추정) | 1 | 집합과 원소 |
| EXT-H1-C2-05-GD25-Q01-SUBJECTIVE-NEUTRALIZATION | l4(추정) | 2 | 집합과 원소 |

### 3b. 정식 레지스트리에도 확장 네임스페이스(EXT-)에도 없는 키를 가진 생성 문항

`GEN_PT_*`·`GEN_TPL_*`·`GEN_CC_*`·`GEN_COND_*`, `GEN-TPL-*`, `TPL_GD*`, 한글 자유 문구처럼 EXT 접두어가 없는 키입니다. 해석기는 이 값을 배지 없이 그대로 보여 줍니다(임의로 `확장`으로 간주하지 않음). 정식 키로 대체/alias할지, EXT 네임스페이스로 옮길지는 후속 결정 사항입니다.

| 키 | 종류 | 필드 | 사용 문항 |
| --- | --- | --- | --- |
| COND_DISTINCT_ROOTS | cond | conditionKeys | 9 |
| GEN_CC_EMPTY_SET | cross | crossConceptKeys | 3 |
| GEN_CC_GD25_Q03_ABS | cross | crossConceptKeys | 2 |
| GEN_CC_GD25_Q03_QUADRATIC | cross | crossConceptKeys | 3 |
| GEN_CC_GD25_Q04_INEQUALITY | cross | crossConceptKeys | 1 |
| GEN_CC_GD25_Q04_QUADRATIC_RANGE | cross | crossConceptKeys | 1 |
| GEN_CC_MEASURED_AVERAGE_EXTREMA | cross | crossConceptKeys | 1 |
| GEN_CC_QUADRATIC_EQUATION_ROOTS | cross | crossConceptKeys | 3 |
| GEN_CC_QUADRATIC_INEQUALITY | cross | crossConceptKeys | 1 |
| GEN_COND_GD25_Q03_ABS | cond | conditionKeys | 2 |
| GEN_COND_GD25_Q03_DUPLICATE | cond | conditionKeys | 1 |
| GEN_COND_GD25_Q03_INTEGER | cond | conditionKeys | 2 |
| GEN_COND_GD25_Q03_NATURAL_BOUND | cond | conditionKeys | 1 |
| GEN_COND_GD25_Q03_PAIR | cond | conditionKeys | 3 |
| GEN_COND_GD25_Q04_CONJUNCTION | cond | conditionKeys | 1 |
| GEN_COND_GD25_Q04_COUNT | cond | conditionKeys | 1 |
| GEN_COND_GD25_Q04_CYCLE | cond | conditionKeys | 1 |
| GEN_COND_GD25_Q04_FINITE_DOMAIN | cond | conditionKeys | 1 |
| GEN_COND_GD25_Q04_INTEGER_RANGE | cond | conditionKeys | 1 |
| GEN_COND_GD25_Q04_THREE_PROPS | cond | conditionKeys | 1 |
| GEN_COND_GD25_Q04_TWO_DIRECTIONS | cond | conditionKeys | 1 |
| GEN_COND_IMPOSSIBLE_GUARD | cond | conditionKeys | 3 |
| GEN_COND_MEASURED_THRESHOLD | cond | conditionKeys | 1 |
| GEN_COND_OBJECTIVE_THRESHOLD | cond | conditionKeys | 1 |
| GEN_COND_SUBJECTIVE_PREDICATE | cond | conditionKeys | 6 |
| GEN_PT_SET_DECIDABILITY | pt | problemTypeKey | 9 |
| GEN_TPL_SET_ALWAYS_TRUE_FALSE_GUARD | tpl | templateKey | 1 |
| GEN_TPL_SET_EMPTY_TRAP | tpl | templateKey | 1 |
| GEN_TPL_SET_FIVE_CASE_COUNT | tpl | templateKey | 1 |
| GEN_TPL_SET_MEASURED_RELATIVE | tpl | templateKey | 1 |
| GEN_TPL_SET_PREDICATE_INDEPENDENT_COUNT | tpl | templateKey | 1 |
| GEN_TPL_SET_SINGLE_OBJECTIVE | tpl | templateKey | 1 |
| GEN_TPL_SET_SINGLE_SUBJECTIVE | tpl | templateKey | 1 |
| GEN_TPL_SET_THREE_CRITERIA | tpl | templateKey | 1 |
| GEN_TPL_SET_UNSATISFIABLE_GUARD | tpl | templateKey | 1 |
| GEN-TPL-GD25-Q12-B1 | tpl | templateKey | 1 |
| GEN-TPL-GD25-Q12-B2 | tpl | templateKey | 1 |
| GEN-TPL-GD25-Q12-B3 | tpl | templateKey | 1 |
| GEN-TPL-GD25-Q12-C1 | tpl | templateKey | 1 |
| GEN-TPL-GD25-Q12-C2 | tpl | templateKey | 1 |
| GEN-TPL-GD25-Q12-C3 | tpl | templateKey | 1 |
| GEN-TPL-GD25-Q12-REAL-LINEAR | tpl | templateKey | 3 |
| GEN-TPL-GD25-Q14-ITERATE-INDEX-COUNT | tpl | templateKey | 1 |
| GEN-TPL-GD25-Q14-PARAM-RECOVERY | tpl | templateKey | 1 |
| TPL_GD25_Q09_B1 | tpl | templateKey | 1 |
| TPL_GD25_Q09_B2 | tpl | templateKey | 1 |
| TPL_GD25_Q09_B3 | tpl | templateKey | 1 |
| TPL_GD25_Q09_C1 | tpl | templateKey | 1 |
| TPL_GD25_Q09_C2 | tpl | templateKey | 1 |
| TPL_GD25_Q09_C3 | tpl | templateKey | 1 |
| TPL_GD25_Q10_B1 | tpl | templateKey | 1 |
| TPL_GD25_Q10_B2 | tpl | templateKey | 1 |
| TPL_GD25_Q10_B3 | tpl | templateKey | 1 |
| TPL_GD25_Q10_C1 | tpl | templateKey | 1 |
| TPL_GD25_Q10_C2 | tpl | templateKey | 1 |
| TPL_GD25_Q10_C3 | tpl | templateKey | 1 |
| TPL_GD25_Q11_B1 | tpl | templateKey | 1 |
| TPL_GD25_Q11_B2 | tpl | templateKey | 1 |
| TPL_GD25_Q11_B3 | tpl | templateKey | 1 |
| TPL_GD25_Q11_C1 | tpl | templateKey | 1 |
| TPL_GD25_Q11_C2 | tpl | templateKey | 1 |
| TPL_GD25_Q11_C3 | tpl | templateKey | 1 |
| 경우 나누기 | cross | crossConceptKeys | 14 |
| 도형에서 경계선 공유 여부 | cross | crossConceptKeys | 15 |
| 이차방정식 | cross | crossConceptKeys | 10 |
| 중등 입체도형 | cross | crossConceptKeys | 10 |

## 4. 정식 키와 같은 이름(또는 alias)을 가진 확장 키

정식 레지스트리(`taxonomy_registry`/`concept_registry`/`condition_registry`)의 같은 종류 키와 이름 또는 alias가 정규화 후 일치합니다. “alias, not rename” 규칙에 따라 정식 키로의 alias 연결 후보입니다(자동 연결하지 않음).

| 확장 키 | 종류 | 이름 | 정식 키 | 정식 이름 | 확장 키 상태 | 파일 |
| --- | --- | --- | --- | --- | --- | --- |
| EXT-CROSS-H1-C2-03-Q12-POINT-LINE-DISTANCE | cross | 점과 직선 사이의 거리 | CC_POINT_LINE_DISTANCE | 점과 직선 사이의 거리 | SUPERSEDED_NOT_TO_RELEASE | …/H22-C2-03-TANGENT/extension-meta/palma-q12-cross-concepts.json |
| EXT-CROSS-H1-C2-03-Q12-POINT-LINE-DISTANCE | cross | 점과 직선 사이의 거리 | CC_POINT_TO_LINE_DISTANCE | 점과 직선 사이의 거리 | SUPERSEDED_NOT_TO_RELEASE | …/H22-C2-03-TANGENT/extension-meta/palma-q12-cross-concepts.json |

### 4b. 정식 키 id를 비교 대상으로 직접 적은 확장 키

_none_

## 5. 확장 키끼리 겹치는 후보

### 5a. 이름이 정규화 후 완전히 같은 서로 다른 키

_none_

### 5b. 슬롯 접두어(`B3 ` 등)를 떼면 이름이 같은 키

| 종류 | 이름(접두어 제외) | 키 | 파일 |
| --- | --- | --- | --- |
| l4 | 근호 정의역 조건 확장 | EXT-GD25-Q10-CEILING-BOUND, EXT-GD25-Q10-LINEAR-RADICAND, EXT-GD25-Q10-NONINTEGER-ENDPOINT, EXT-GD25-Q10-PARITY-COUNT, EXT-GD25-Q10-REVERSE-DOMAIN-COUNT, EXT-GD25-Q10-SPLIT-INTERVALS | …/H22-C2-09-FUNCTION_BASIC/extension-l4/geumdang-2025-2final-q10-registry.json |
| l4 | 집합 포함관계 추가 조건 유형 | EXT-GD25-Q11-ALL-CANDIDATES-SUM, EXT-GD25-Q11-FILTER-MULTIPLE, EXT-GD25-Q11-LCM-EXTRA-FILTER, EXT-GD25-Q11-MINMAX-PRODUCT, EXT-GD25-Q11-SET-OPERATIONS-BOUND, EXT-GD25-Q11-SET-OPERATIONS-RANGE | …/H22-C2-05-CORE/extension-l4/geumdang-2025-2final-q11-registry.json |

### 5c. 같은 상위 L3 안에서 이름이 비슷한 키(Dice ≥ 0.80)

| 종류 | 키 | 이름 | 유사도 | 상위 L3 |
| --- | --- | --- | --- | --- |
| l4 | EXT-GD25-Q16-LEFT-NEGATIVE-ENDPOINT ↔ EXT-GD25-Q16-RIGHT-NEGATIVE-ENDPOINT | 제1·제3·제4사분면 판정 ↔ 제2·제3·제4사분면 판정 | 0.8 | 유리함수의 활용 |
| l4 | EXT-GD25-Q16-LEFT-NEGATIVE-ENDPOINT ↔ EXT-GD25-Q16-THREE-QUADRANT-RIGHT-FALL | 제1·제3·제4사분면 판정 ↔ 제1·제2·제4사분면 판정 | 0.8 | 유리함수의 활용 |
| l4 | EXT-GD25-Q16-RIGHT-NEGATIVE-ENDPOINT ↔ EXT-GD25-Q16-THREE-QUADRANT-RIGHT-FALL | 제2·제3·제4사분면 판정 ↔ 제1·제2·제4사분면 판정 | 0.8 | 유리함수의 활용 |
| l4 | EXT-GD25-Q16-THREE-QUADRANT-LEFT-RISE ↔ EXT-GD25-Q16-THREE-QUADRANT-RIGHT-FALL | 제1·제2·제3사분면 판정 ↔ 제1·제2·제4사분면 판정 | 0.8 | 유리함수의 활용 |
| l4 | EXT-H1-BSG26-B03-QUAD-INT-COUNT-INVERSE ↔ EXT-H1-BSG26-QUAD-INTEGER-SUM-INVERSE | 이차부등식 정수해의 수·합으로 매개변수 역산 ↔ 정수해의 합으로 이차부등식 매개변수 역산 | 0.8 | 이차부등식 |
| l4 | EXT-L4-JEIL25-Q07-TWO-TANGENT-PRODUCT ↔ EXT-L4-JEIL25-Q07-TWO-TANGENT-SUM | 외부점 두 접선의 기울기 곱 ↔ 외부점 두 접선의 기울기 합 | 0.9 | 원의 접선 |

## 6. 계승·후보 상태의 확장 키

`tier`는 상태 문자열에서 읽은 표시용 구분이며 사용 가능 여부를 가르지 않습니다(사용자 정책: 검수 상태로 사용을 제한하지 않음).

### 6a. 계승(superseded)으로 기록된 키

| 키 | 종류 | 이름 | 상태 | 사용 문항 | 파일 |
| --- | --- | --- | --- | --- | --- |
| EXT-CROSS-H1-C2-03-Q12-CHORD-PYTHAGORAS | cross | 현의 중점과 피타고라스 정리 | SUPERSEDED_NOT_TO_RELEASE | 0 | …/H22-C2-03-TANGENT/extension-meta/palma-q12-cross-concepts.json |
| EXT-CROSS-H1-C2-03-Q12-POINT-LINE-DISTANCE | cross | 점과 직선 사이의 거리 | SUPERSEDED_NOT_TO_RELEASE | 0 | …/H22-C2-03-TANGENT/extension-meta/palma-q12-cross-concepts.json |
| EXT-CROSS-H1-C2-03-Q12-QUADRATIC-ROOTS | cross | 매개변수 이차방정식의 두 해 | SUPERSEDED_NOT_TO_RELEASE | 0 | …/H22-C2-03-TANGENT/extension-meta/palma-q12-cross-concepts.json |
| EXT-CROSS-H1-C2-03-Q12-TANGENT-PYTHAGORAS | cross | 접선·반지름이 만드는 직각삼각형 | SUPERSEDED_NOT_TO_RELEASE | 0 | …/H22-C2-03-TANGENT/extension-meta/palma-q12-cross-concepts.json |
| EXT-H1-BSG26-ABS-GLOBAL-MINIMUM | l4 | 절댓값 합의 최솟값으로 해의 존재를 판정 | SUPERSEDED_BY_EXACT_EXISTING_RPM_PRIMARY | 0 | …/H22-C-06-INEQUALITY/extension-l4/registry.json |
| EXT-H1-BSG26-ABS-PARAMETER-INVERSE | l4 | 거리합의 해구간 끝점으로 변수 역산 | SUPERSEDED_BY_EXACT_EXISTING_RPM_PRIMARY | 0 | …/H22-C-06-INEQUALITY/extension-l4/registry.json |

### 6b. 사용 중인 후보(candidate) 단계 키

| 키 | 종류 | 이름 | 상태 | 사용 문항 | 파일 |
| --- | --- | --- | --- | --- | --- |
| EXT-CC-H1-Q18-ANGLE-BISECTOR | cross | 각의 이등분선과 BC의 내분비 | GENERATED_ACTIVE_CREATOR_CANDIDATE_ONLY | 9 | …/H22-C2-01-GEOMETRY_APPLICATION/extension-meta/palma-q18-cross-concepts-conditions.json |
| EXT-COND-H1-Q18-PARAMETER-RANGE | cond | 양수 매개변수와 자연수의 넓이 경계 | GENERATED_ACTIVE_CREATOR_CANDIDATE_ONLY | 3 | …/H22-C2-01-GEOMETRY_APPLICATION/extension-meta/palma-q18-cross-concepts-conditions.json |
| EXT-COND-H1-Q18-SIDE-RATIO | cond | 두 이웃변의 길이비 조건 | GENERATED_ACTIVE_CREATOR_CANDIDATE_ONLY | 6 | …/H22-C2-01-GEOMETRY_APPLICATION/extension-meta/palma-q18-cross-concepts-conditions.json |
| EXT-COND-H1-Q20-EXACTLY-ONE-BOUND | cond | 정확히 한 모임에만 속한 인원 조건 | GENERATED_ACTIVE_CREATOR_CANDIDATE_ONLY | 4 | …/H22-C2-05-CORE/extension-meta/palma-q20-cross-concepts-conditions.json |
| EXT-COND-H1-Q20-NONPARTICIPANT-EXACT | cond | 어느 모임에도 속하지 않은 학생 인원 고정 | GENERATED_ACTIVE_CREATOR_CANDIDATE_ONLY | 1 | …/H22-C2-05-CORE/extension-meta/palma-q20-cross-concepts-conditions.json |
| EXT-COND-H1-Q20-UNION-LOWER-BOUND | cond | 적어도 한 모임에 속한 인원 하한 | GENERATED_ACTIVE_CREATOR_CANDIDATE_ONLY | 3 | …/H22-C2-05-CORE/extension-meta/palma-q20-cross-concepts-conditions.json |
| EXT-CROSS-H1-C2-06-INTERVAL-INCLUSION | cross | 부등식 진리집합의 구간 포함 | GENERATED_ACTIVE_CANDIDATE_SCOPE | 4 | …/H22-C2-06-CORE/extension-meta/palma-q11-cross-concepts.json |
| EXT-CROSS-H1-C2-06-ROOT-SET | cross | 방정식 근의 집합 비교 | GENERATED_ACTIVE_CANDIDATE_SCOPE | 1 | …/H22-C2-06-CORE/extension-meta/palma-q11-cross-concepts.json |
| EXT-GD25-C2-06-Q05-DISJOINT-TRUTHSETS | l4 | 배반되는 진리집합 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-C2-06-Q05-INTERVAL-CONTAINMENT | l4 | 절댓값 이동 구간과 필요조건 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-C2-06-Q05-PARTIAL-OVERLAP | l4 | 부분적으로 겹치는 진리집합 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-CC-ABSOLUTE-INEQUALITY | cross | 절댓값 일차부등식 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-CC-ABSOLUTE-SQUARE | cross | 절댓값과 제곱의 동치 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-CC-QUADRATIC-ROOTS | cross | 이차방정식의 근 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-CC-REAL-INEQUALITY | cross | 실수 부등식의 포함 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-CC-SET-INTERSECTION | cross | 진리집합의 교집합 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-CC-SET-OVERLAP | cross | 진리집합 일부 공통 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-CC-SQUARE-SIGN | cross | 실수의 제곱과 부호 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-COND-EQUIVALENT-TRUTHSETS | cond | 동일한 진리집합 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-COND-MOVING-INTERVAL | cond | 이동 구간의 포함 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-COND-NECESSARY-NOT-SUFFICIENT | cond | 필요조건이되 충분조건은 아님 | GENERATED_CANDIDATE_BRANCH_ONLY | 2 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-TPL-PARAM-NECESSITY-BOUNDARY | tpl | 매개변수에 따른 필요조건의 경계 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-TPL-QUADRATIC-ROOTSET-EQUIVALENCE | tpl | 이차방정식 해집합의 필요충분 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-TPL-SHIFTED-INTERVAL-INCLUSION | tpl | 이동 구간의 필요조건 판정 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-TPL-TRUTHSET-DISJOINT | tpl | 서로소 진리집합의 필요충분 판정 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q05-TPL-TRUTHSET-OVERLAP | tpl | 일부 겹치는 진리집합의 관계 판정 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-06-CORE/extension-l4/geumdang-2025-2final-q05-registry.json |
| EXT-GD25-Q06-COND-RESTRICTED-DOMAIN-BIJECTION | cond | 정의역 부분집합 제한을 통한 전단사 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_BASIC/extension-l4/geumdang-2025-2final-q06-registry.json |
| EXT-GD25-Q06-L4-BIJECTION-PARAM | l4 | 역함수 존재를 만드는 매개변수 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_BASIC/extension-l4/geumdang-2025-2final-q06-registry.json |
| EXT-GD25-Q06-L4-PARAM-PERMUTATION | l4 | 대응의 순열과 미지수 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_BASIC/extension-l4/geumdang-2025-2final-q06-registry.json |
| EXT-GD25-Q06-L4-REMAINING-MAPPINGS | l4 | 부분 대응으로부터 전단사 개수 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_BASIC/extension-l4/geumdang-2025-2final-q06-registry.json |
| EXT-GD25-Q06-L4-RESTRICT-BIJECTION | l4 | 정의역 제한과 일대일 대응 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_BASIC/extension-l4/geumdang-2025-2final-q06-registry.json |
| EXT-GD25-Q06-TPL-BIJECTION-PARAMETER | tpl | 매개변수로 일대일 대응 완성 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_BASIC/extension-l4/geumdang-2025-2final-q06-registry.json |
| EXT-GD25-Q06-TPL-PARAMETRIC-BIJECTION-PERMUTATION | tpl | 매개변수 경우 분리 전단사 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_BASIC/extension-l4/geumdang-2025-2final-q06-registry.json |
| EXT-GD25-Q06-TPL-PARTIAL-MAPPING-BIJECTION-COUNT | tpl | 부분 대응 고정 후 전단사 개수 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_BASIC/extension-l4/geumdang-2025-2final-q06-registry.json |
| EXT-GD25-Q06-TPL-RESTRICTED-DOMAIN-BIJECTION | tpl | 정의역 제한으로 전단사 구성 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_BASIC/extension-l4/geumdang-2025-2final-q06-registry.json |
| EXT-GD25-Q07-CC-COEFFICIENT-EQUALITY | cross | 항등식 계수 비교 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_COMPOSITION/extension-l4/geumdang-2025-2final-q07-registry.json |
| EXT-GD25-Q07-CC-RADICAL-DOMAIN | cross | 무리식 정의역 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_COMPOSITION/extension-l4/geumdang-2025-2final-q07-registry.json |
| EXT-GD25-Q07-COND-ALL-REAL-IDENTITY | cond | 모든 실수에서 두 합성식 상등 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_COMPOSITION/extension-l4/geumdang-2025-2final-q07-registry.json |
| EXT-GD25-Q07-COND-RADICAL-COMPOSITION-DOMAIN | cond | 무리함수 합성의 정의역 경계 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_COMPOSITION/extension-l4/geumdang-2025-2final-q07-registry.json |
| EXT-GD25-Q07-L4-COMMUTATION-IDENTITY | l4 | 모든 실수에서 합성교환 항등식 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_COMPOSITION/extension-l4/geumdang-2025-2final-q07-registry.json |
| EXT-GD25-Q07-L4-COMMUTING-VALUE | l4 | 합성 순서 교환에 따른 일치값 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_COMPOSITION/extension-l4/geumdang-2025-2final-q07-registry.json |
| EXT-GD25-Q07-L4-COMPOSITION-ORDER | l4 | 합성 순서 교환의 계산 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_COMPOSITION/extension-l4/geumdang-2025-2final-q07-registry.json |
| EXT-GD25-Q07-L4-QUADRATIC-PARAMETER | l4 | 합성의 제곱식과 매개변수 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_COMPOSITION/extension-l4/geumdang-2025-2final-q07-registry.json |
| EXT-GD25-Q07-L4-TRIPLE-COMPOSITION | l4 | 세 함수의 순차 합성 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_COMPOSITION/extension-l4/geumdang-2025-2final-q07-registry.json |
| EXT-GD25-Q07-TPL-COMPOSITION-COMMUTING-VALUE | tpl | 합성 순서 교환에서 값 일치 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_COMPOSITION/extension-l4/geumdang-2025-2final-q07-registry.json |
| EXT-GD25-Q07-TPL-COMPOSITION-IDENTITY-COEFFICIENT | tpl | 합성항등식의 계수 비교 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_COMPOSITION/extension-l4/geumdang-2025-2final-q07-registry.json |
| EXT-GD25-Q07-TPL-COMPOSITION-ORDER-DIFFERENCE | tpl | 합성 순서별 함수값 차 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_COMPOSITION/extension-l4/geumdang-2025-2final-q07-registry.json |
| EXT-GD25-Q07-TPL-COMPOSITION-QUADRATIC-PARAM | tpl | 합성의 이차조건과 매개변수 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_COMPOSITION/extension-l4/geumdang-2025-2final-q07-registry.json |
| EXT-GD25-Q07-TPL-TRIPLE-COMPOSITION | tpl | 삼중 함수 합성값 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_COMPOSITION/extension-l4/geumdang-2025-2final-q07-registry.json |
| EXT-GD25-Q08-CC-COMPOSITION | cross | 역함수 합성 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-CC-RATIONAL | cross | 유리함수와 역함수 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-COND-IDENTITY | cond | 모든 실수에서 항등식 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-COND-INVERSE-DOMAIN-EXCLUSION | cond | 유리함수의 분모 영점과 역함수 정의역 배제 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-INVERSE-COMPOSITION | l4 | 정함수와 역함수의 합성 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-INVERSE-COMPOSITION-IDENTITY | l4 | 역함수 합성 항등식 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-INVERSE-PARAMETER | l4 | 역함수값에서 일차계수 구하기 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-INVERSE-TWO-VALUE-SUM | l4 | 두 역함숫값의 합에서 매개변수 결정 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-PT-INVERSE-COMPOSITION-COEFFICIENT | pt | 역함수 합성 항등식 계수 결정 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-RATIONAL-INVERSE-VALUES | l4 | 유리함수의 역함수 특정값 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-TPL-INVERSE-COMPOSITION-COEFFICIENT | tpl | 역함수 합성 항등식의 계수 결정 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-TPL-INVERSE-COMPOSITION-IDENTITY | tpl | 정함수·역함수 합성 항등식 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-TPL-INVERSE-OUTPUT-PARAM | tpl | 역함숫값 조건으로 계수 결정 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-TPL-INVERSE-TWO-CONSTRAINTS | tpl | 함수값과 역함숫값 조건 연립 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-TPL-INVERSE-TWO-VALUE-SUM | tpl | 두 역함숫값의 합과 매개변수 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-TPL-RATIONAL-INVERSE-SUM | tpl | 유리함수 역함숫값 합 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-GD25-Q08-TWO-INVERSE-CONSTRAINTS | l4 | 두 역함수값 조건 연립 | GENERATED_CANDIDATE_BRANCH_ONLY | 1 | …/H22-C2-07-FUNCTION_INVERSE/extension-l4/geumdang-2025-2final-q08-registry.json |
| EXT-L4-H1-Q18-CENTROID-AREA-RELATION | l4 | 무게중심의 부분면적 비와 역산 | GENERATED_ACTIVE_CREATOR_CANDIDATE_ONLY | 3 | …/H22-C2-01-GEOMETRY_APPLICATION/extension-l4/palma-q18-registry.json |
| EXT-L4-H1-Q18-CENTROID-DIRECT-AREA | l4 | 내심·무게중심을 이용한 부분 넓이 | GENERATED_ACTIVE_CREATOR_CANDIDATE_ONLY | 3 | …/H22-C2-01-GEOMETRY_APPLICATION/extension-l4/palma-q18-registry.json |
| EXT-L4-H1-Q18-CENTROID-PARAMETER | l4 | 무게중심 부분넓이의 매개변수 판정 | GENERATED_ACTIVE_CREATOR_CANDIDATE_ONLY | 3 | …/H22-C2-01-GEOMETRY_APPLICATION/extension-l4/palma-q18-registry.json |

## 7. 승격 검토용 사용량 상위 확장 키

부모가 연결된 확장 키 중 생성 문항에서 많이 쓰이는 순서입니다(승격 우선순위의 참고값일 뿐 판단이 아님).

| 키 | 종류 | 이름 | 상위 L3 | 부모 상태 | 사용 문항 |
| --- | --- | --- | --- | --- | --- |
| EXT-CC-H1-Q13-COMBINATION-COUNTING | cross | 짝수 선택의 조합 및 곱셈원리 | 부분집합 | RECORD | 9 |
| EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION | cross | 정수 약수의 양·음수 대응 | 부분집합 | RECORD | 9 |
| EXT-CC-H1-Q18-ANGLE-BISECTOR | cross | 각의 이등분선과 BC의 내분비 | 삼각형의 무게중심 | RECORD | 9 |
| EXT-CROSS-H1-C2-06-Q14-QUADRATIC-EXTREMA | cross | 이차함수 꼭짓점·최댓값 또는 최솟값 | 명제와 조건 | RECORD | 9 |
| EXT-COND-H1-Q16-SUBSET-INCLUSION | cond | 집합 사이의 포함관계 조건 | 집합의 연산법칙 | RECORD | 6 |
| EXT-COND-H1-Q18-SIDE-RATIO | cond | 두 이웃변의 길이비 조건 | 삼각형의 무게중심 | RECORD | 6 |
| EXT-H1-C2-05-Q13-SIGNED-PRODUCT | l4 | 정수 약수의 곱의 부호를 만족하는 부분집합 | 부분집합 | RECORD | 5 |
| EXT-H1-C2-06-Q02-QUANTIFIER-NEGATION | l4 | 양화 명제의 부정과 매개변수 구간 역산 | 명제와 조건 | LABEL | 5 |
| EXT-COND-H1-Q20-EXACTLY-ONE-BOUND | cond | 정확히 한 모임에만 속한 인원 조건 | 교집합과 합집합 | RECORD | 4 |
| EXT-CROSS-H1-C2-06-INTERVAL-INCLUSION | cross | 부등식 진리집합의 구간 포함 | 필요조건·충분조건 | LABEL | 4 |
| EXT-H1-C2-03-Q12-CONTACT-CHORD | l4 | 외부점의 두 접점과 접점의 현 | 원의 접선 | LABEL | 4 |
| EXT-COND-H1-Q18-PARAMETER-RANGE | cond | 양수 매개변수와 자연수의 넓이 경계 | 삼각형의 무게중심 | RECORD | 3 |
| EXT-COND-H1-Q20-UNION-LOWER-BOUND | cond | 적어도 한 모임에 속한 인원 하한 | 교집합과 합집합 | RECORD | 3 |
| EXT-CROSS-H1-C2-06-Q14-INTEGER-PARAMETER-COUNT | cross | 매개변수 정수 범위와 경계 원소의 개수 | 명제와 조건 | RECORD | 3 |
| EXT-H1-C2-02-Q05-PERP-BISECTOR-APPLICATION | l4 | 수직이등분선을 이용한 점·넓이·외심 문제 | 직선의 방정식 | LABEL | 3 |
| EXT-H1-C2-02-Q05-PERP-BISECTOR-CORE | l4 | 수직이등분선의 방정식—중점과 수직 조건 | 직선의 방정식 | LABEL | 3 |
| EXT-H1-C2-03-Q12-CONTACT-REVERSE | l4 | 접점 현과 접선 길이 역조건 | 원의 접선 | LABEL | 3 |
| EXT-H1-C2-05-Q13-FIXED-SIZE-PARITY | l4 | 원소 수 조건과 곱의 부호를 결합한 부분집합 계수 | 부분집합 | RECORD | 3 |
| EXT-L4-H1-Q18-CENTROID-AREA-RELATION | l4 | 무게중심의 부분면적 비와 역산 | 삼각형의 무게중심 | RECORD | 3 |
| EXT-L4-H1-Q18-CENTROID-DIRECT-AREA | l4 | 내심·무게중심을 이용한 부분 넓이 | 삼각형의 무게중심 | RECORD | 3 |
| EXT-L4-H1-Q18-CENTROID-PARAMETER | l4 | 무게중심 부분넓이의 매개변수 판정 | 삼각형의 무게중심 | RECORD | 3 |
| EXT-COND-H1-Q13-EXACT-CARDINALITY | cond | 부분집합 원소 수 4개 | 부분집합 | RECORD | 2 |
| EXT-COND-H1-Q13-REQUIRED-ELEMENT | cond | 음수 -1 필수 포함 | 부분집합 | RECORD | 2 |
| EXT-COND-H1-Q14-X-INTERVAL | cond | x의 제한 정의역 0≤x≤2 | 명제와 조건 | RECORD | 2 |
| EXT-CROSS-H1-C2-06-Q14-INTERVAL-EXTREMA | cross | 닫힌 구간 위 이차함수의 최댓값 | 명제와 조건 | RECORD | 2 |
| EXT-GD25-Q05-COND-NECESSARY-NOT-SUFFICIENT | cond | 필요조건이되 충분조건은 아님 | 필요조건·충분조건 | RECORD | 2 |
| EXT-H1-C2-02-Q05-PERP-BISECTOR-PARAMETER | l4 | 매개변수·자취 조건을 만족하는 수직이등분선 | 직선의 방정식 | LABEL | 2 |
| EXT-H1-C2-03-Q12-CONTACT-CHORD-LENGTH | l4 | 접점의 현 길이 | 원의 접선 | LABEL | 2 |
| EXT-H1-C2-05-Q01-SET-DEFINITION | l4 | 원소 판정 기준의 명확성 | 집합과 원소 | RECORD | 2 |
| EXT-H1-C2-06-Q14-RESTRICTED-DOMAIN | l4 | 제한된 정의역에서 양화명제 부정의 참 조건 | 명제와 조건 | RECORD | 2 |

## 8. 정의는 있으나 사용 중인 생성 문항이 없는 키

112개(후보 단계 포함). 문항이 아직 등록되지 않았거나 정의만 먼저 기록된 키입니다. 목록은 `archive/data/archive2-extension-keys.json`과 위 규칙으로 다시 계산할 수 있어 여기서는 종류별 개수만 적습니다.

| 종류 | 미사용 정의 수 |
| --- | --- |
| cond | 3 |
| cross | 7 |
| l3 | 6 |
| l4 | 94 |
| tpl | 2 |

## 9. 한계

* RPM 부모 해석은 현재 고등 1학년 활성 crosswalk(`crosswalks/rpm-primary-v1.0/high1.json`)만 사용합니다. 다른 학년의 확장 키가 생기면 해석기가 레코드 id 접두어로 해당 crosswalk를 추가로 읽습니다(코드 변경 없음).
* 일부 정의(예: GD25 Q15)는 라벨 없이 키 목록만 있어 이름 대신 키가 표시됩니다.
* 문항 표시용 `rpmL4`가 `KEY|이름` 형태인 행은 이름을 정의 라벨 대신 보조로 사용합니다.
* 이 목록은 파생 색인 생성 시점의 스냅샷입니다. 정의 파일이 늘면 `node archive/tools/build-archive2-extension-keys.mjs`(색인)와 이 보고서 생성기를 다시 실행합니다.

