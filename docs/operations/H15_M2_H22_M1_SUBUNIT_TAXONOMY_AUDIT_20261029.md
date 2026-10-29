# 2015 수학Ⅱ ↔ 2022 미적분Ⅰ 세부단원 전수 조사 (2026-10-29 / SCOPED AUDIT)

> STATUS: INVESTIGATION / WORK BRANCH. 이 문서 자체는 master key 변경이나 전체 문항 품질 PASS가 아니다.
> BASELINE Git main: `98f41917ad8d90e017e88259ea3fd11e08877f05`; compiled master blob `1f3036d29bd015e05ace084e1bc6f68a59e6bd8f`.
> 범위: 현재 compiled master 전체 구조 집계, H15-M2 51개/H22-M1 28개 신규 등록키 판정, `archive/exams/original/high/h2/{1mid,1final,2mid,2final}` 및 `similar/high/h2` 파일명 `수학II|미적분I` 71개 실제 JS 내용 조회. 고1·고3·textbooks·외부 미반영본과 모든 meta consumer까지 포괄한 repository-wide 사용처 전수 증명은 아님.

## 확인 결과
- master: 전체 1156 레코드, 표준단원 143, 세부단원 514.
- 2015 수학Ⅱ: 51개. 의미상 정상 대표키 9, 다의적·문항검토 7, 부모·자식 의미가 동떨어진 키 후보 35개.
- 2022 미적분Ⅰ: 28개 신규키. 다수가 RPM L3/L4 문제 유형의 세분이며 2015 L2 계승 없이 2026-10-29 PR #979에서 추가됨. 안정적 L2 확정으로 간주하지 말고 2015 매핑+RPM 정의로 재판정.
- 71개의 고2 원본·유사 JS 조회: 대부분 기존 H15-M2의 정상 조합 사용. 2023 매산고 수학Ⅱ 2기말 q16/q20이 `H15-M2-08-APPLICATION_OF_CALCULUS` 사용. 두 문항은 정적분으로 정의된 함수 문제여서 해당 branch에서 이미 공식 `H15-M2-08-DEFINITE_INTEGRAL`로 두 필드만 수정함. 결과는 branch 상태이며 main 미병합.
- 2026 금당고 2중간 미적분Ⅰ 21문항은 `subUnitKey` 공란; 2026 제일고 동급 시험지 22문항은 `subUnitKey`에 `H22-M1-01` 등 표준단원 부모 키를 그대로 사용. 정확한 전 문항 수학 판정 및 수정은 별도 대상.
- 2021 매산고 1중간 수학Ⅱ 20문항에는 세부단원 필드 자체가 없는 legacy 형식. 즉 71파일 모두 최신 세부단원 적용 상태는 아님.

## 판정 원칙
1. 표준단원(L1/L2 parent)은 문제의 주개념을 나타낸다. `subUnitKey`는 반드시 그 부모의 하위 개념이어야 한다. 단원 간 전제·보조 계산은 CrossConcept 또는 prerequisites/relations로 표현하고 부모로 등록하지 않는다.
2. 극한 아래 적분, 부정적분 아래 극한 등의 조합은 **문항별 예외가 아닌 세부단원 마스터의 계층 문제**로 취급한다. 단, 현재 사용 여부가 확정되지 않은 legacy key는 즉시 삭제·rename하지 않는다.
3. 2015↔2022는 **동일 개념 개체를 공유**하되 교육과정 출처·시기·단원번호를 분리한 1:N crosswalk를 사용한다. `H21`로 치환하지 않는다.
4. H22-M1의 새 키를 2015 문자열 치환만으로 일괄 승인하지 않는다. 2015 수학Ⅱ에는 9부모/2022 미적분Ⅰ에는 8부모이며 접선 단원이 합쳐졌다.
5. 2022 세부단원 재정리와 실제 JS remap은 문항 근거·원본·풀이 검증 및 검증된 ACTIVE master를 먼저 필요로 한다. L3/L4 초안 값을 L2로 승격하지 않는다.

## 대응표 (기존 표준단원 보존)
| 2015 parent | 2022 parent | 의미 |
|---|---|---|
| H15-M2-01 | H22-M1-01 | 함수의 극한 |
| H15-M2-02 | H22-M1-02 | 함수의 연속 |
| H15-M2-03 | H22-M1-03 | 미분계수 |
| H15-M2-04 | H22-M1-04 | 도함수 |
| H15-M2-05 | H22-M1-05 | 접선→도함수 활용 |
| H15-M2-06 | H22-M1-05 | 도함수 활용 |
| H15-M2-07 | H22-M1-06 | 부정적분 |
| H15-M2-08 | H22-M1-07 | 정적분 |
| H15-M2-09 | H22-M1-08 | 적분 활용 |

## H15-M2 등록 세부키 51개 후보 판정 (전 행)

KEEP_CANDIDATE=부모에 의미상 자연스럽고 실제 분류에 쓰는 대표키; SEMANTIC_REVIEW=의미가 넓거나 중복; MISPLACED_CANDIDATE=부모와 의미가 달라 신규 적용 금지 후보. 아직 active master 상태를 바꾸지 않았다.

| 기존 세부키 | 부모 라벨 | 세부 라벨 | 조사 판정 |
|---|---|---|---|
| `H15-M2-01-APPLICATION_OF_CALCULUS` | 함수의 극한 | 미분·적분의 활용 | MISPLACED_CANDIDATE |
| `H15-M2-01-CONTINUITY` | 함수의 극한 | 함수의 연속 | MISPLACED_CANDIDATE |
| `H15-M2-01-DERIVATIVE` | 함수의 극한 | 미분 | MISPLACED_CANDIDATE |
| `H15-M2-01-INTEGRAL` | 함수의 극한 | 적분 | MISPLACED_CANDIDATE |
| `H15-M2-01-LIMIT` | 함수의 극한 | 함수의 극한 | KEEP_CANDIDATE |
| `H15-M2-02-APPLICATION_OF_CALCULUS` | 함수의 연속 | 미분·적분의 활용 | MISPLACED_CANDIDATE |
| `H15-M2-02-CONTINUITY` | 함수의 연속 | 함수의 연속 | KEEP_CANDIDATE |
| `H15-M2-02-DERIVATIVE` | 함수의 연속 | 미분 | MISPLACED_CANDIDATE |
| `H15-M2-02-INTEGRAL` | 함수의 연속 | 적분 | MISPLACED_CANDIDATE |
| `H15-M2-02-LIMIT` | 함수의 연속 | 함수의 극한 | MISPLACED_CANDIDATE |
| `H15-M2-03-APPLICATION_OF_CALCULUS` | 미분계수 | 미분·적분의 활용 | MISPLACED_CANDIDATE |
| `H15-M2-03-CONTINUITY` | 미분계수 | 함수의 연속 | MISPLACED_CANDIDATE |
| `H15-M2-03-DERIVATIVE` | 미분계수 | 미분 | SEMANTIC_REVIEW |
| `H15-M2-03-DERIVATIVE_DEFINITION` | 미분계수 | 미분계수 | KEEP_CANDIDATE |
| `H15-M2-03-INTEGRAL` | 미분계수 | 적분 | MISPLACED_CANDIDATE |
| `H15-M2-03-LIMIT` | 미분계수 | 함수의 극한 | MISPLACED_CANDIDATE |
| `H15-M2-04-APPLICATION_OF_CALCULUS` | 도함수 | 미분·적분의 활용 | MISPLACED_CANDIDATE |
| `H15-M2-04-CONTINUITY` | 도함수 | 함수의 연속 | MISPLACED_CANDIDATE |
| `H15-M2-04-DERIVATIVE` | 도함수 | 도함수 | KEEP_CANDIDATE |
| `H15-M2-04-INTEGRAL` | 도함수 | 적분 | MISPLACED_CANDIDATE |
| `H15-M2-04-LIMIT` | 도함수 | 함수의 극한 | MISPLACED_CANDIDATE |
| `H15-M2-05-APPLICATION_OF_CALCULUS` | 접선의 방정식 | 미분·적분의 활용 | MISPLACED_CANDIDATE |
| `H15-M2-05-CONTINUITY` | 접선의 방정식 | 함수의 연속 | MISPLACED_CANDIDATE |
| `H15-M2-05-DERIVATIVE` | 접선의 방정식 | 미분 | MISPLACED_CANDIDATE |
| `H15-M2-05-INTEGRAL` | 접선의 방정식 | 적분 | MISPLACED_CANDIDATE |
| `H15-M2-05-LIMIT` | 접선의 방정식 | 함수의 극한 | MISPLACED_CANDIDATE |
| `H15-M2-05-TANGENT` | 접선의 방정식 | 접선의 방정식 | KEEP_CANDIDATE |
| `H15-M2-06-APPLICATION_OF_CALCULUS` | 도함수의 활용 | 미분·적분의 활용 | SEMANTIC_REVIEW |
| `H15-M2-06-CONTINUITY` | 도함수의 활용 | 함수의 연속 | MISPLACED_CANDIDATE |
| `H15-M2-06-DERIVATIVE` | 도함수의 활용 | 미분 | MISPLACED_CANDIDATE |
| `H15-M2-06-DERIVATIVE_APPLICATION` | 도함수의 활용 | 도함수의 활용 | KEEP_CANDIDATE |
| `H15-M2-06-INTEGRAL` | 도함수의 활용 | 적분 | MISPLACED_CANDIDATE |
| `H15-M2-06-LIMIT` | 도함수의 활용 | 함수의 극한 | MISPLACED_CANDIDATE |
| `H15-M2-07-APPLICATION_OF_CALCULUS` | 부정적분 | 미분·적분의 활용 | MISPLACED_CANDIDATE |
| `H15-M2-07-CONTINUITY` | 부정적분 | 함수의 연속 | MISPLACED_CANDIDATE |
| `H15-M2-07-DERIVATIVE` | 부정적분 | 미분 | MISPLACED_CANDIDATE |
| `H15-M2-07-INDEFINITE_INTEGRAL` | 부정적분 | 부정적분 | KEEP_CANDIDATE |
| `H15-M2-07-INTEGRAL` | 부정적분 | 적분 | SEMANTIC_REVIEW |
| `H15-M2-07-LIMIT` | 부정적분 | 함수의 극한 | MISPLACED_CANDIDATE |
| `H15-M2-08-APPLICATION_OF_CALCULUS` | 정적분 | 미분·적분의 활용 | SEMANTIC_REVIEW |
| `H15-M2-08-CONTINUITY` | 정적분 | 함수의 연속 | MISPLACED_CANDIDATE |
| `H15-M2-08-DEFINITE_INTEGRAL` | 정적분 | 정적분 | KEEP_CANDIDATE |
| `H15-M2-08-DERIVATIVE` | 정적분 | 미분 | MISPLACED_CANDIDATE |
| `H15-M2-08-INTEGRAL` | 정적분 | 적분 | SEMANTIC_REVIEW |
| `H15-M2-08-LIMIT` | 정적분 | 함수의 극한 | MISPLACED_CANDIDATE |
| `H15-M2-09-APPLICATION_OF_CALCULUS` | 적분의 활용 | 미분·적분의 활용 | SEMANTIC_REVIEW |
| `H15-M2-09-CONTINUITY` | 적분의 활용 | 함수의 연속 | MISPLACED_CANDIDATE |
| `H15-M2-09-DERIVATIVE` | 적분의 활용 | 미분 | MISPLACED_CANDIDATE |
| `H15-M2-09-INTEGRAL` | 적분의 활용 | 적분 | SEMANTIC_REVIEW |
| `H15-M2-09-INTEGRAL_APPLICATION` | 적분의 활용 | 적분의 활용 | KEEP_CANDIDATE |
| `H15-M2-09-LIMIT` | 적분의 활용 | 함수의 극한 | MISPLACED_CANDIDATE |

## H22-M1 신규 세부키 28개

- `H22-M1-01-LIMIT_VALUE_CALC`: 극한값 계산 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-01-LIMIT_PROPERTIES`: 극한의 성질 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-01-LIMIT_INFINITY`: 무한대에서의 극한 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-01-LIMIT_PARAMETER`: 극한 조건을 이용한 함수 결정 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-01-LIMIT_GEOMETRY`: 도형과 함수의 극한 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-02-CONTINUITY_POINT`: 한 점에서의 연속 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-02-CONTINUITY_GRAPH`: 그래프와 함수의 연속 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-02-CONTINUITY_CONDITION`: 연속 조건과 미정계수 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-03-DERIVATIVE_DEFINITION`: 미분계수의 정의와 계산 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-03-DIFFERENTIABILITY_CONDITION`: 미분가능 조건 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-04-DERIVATIVE_CALCULATION`: 도함수 계산 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-04-DERIVATIVE_EQUATION`: 도함수의 방정식 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-04-DERIVATIVE_FUNCTION_DETERMINATION`: 도함수 조건을 이용한 함수 결정 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-05-ROLLE_MEAN_VALUE`: 롤의 정리와 평균값 정리 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-05-TANGENT_LINE`: 접선의 방정식 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-05-INCREASE_DECREASE`: 함수의 증가와 감소 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-05-EXTREMA_MAXIMUM_MINIMUM`: 극값과 최대·최소 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-05-ROOT_COUNT`: 방정식의 근의 개수와 그래프 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-05-GEOMETRIC_APPLICATION`: 도함수와 그래프의 도형 활용 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-06-ANTIDERIVATIVE_CONCEPT`: 부정적분의 뜻 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-06-POLYNOMIAL_INTEGRATION`: 다항함수의 부정적분 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-06-INITIAL_CONDITION`: 적분상수와 초기조건 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-07-DEFINITE_INTEGRAL_CALCULATION`: 정적분의 계산 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-07-DEFINITE_INTEGRAL_PROPERTIES`: 정적분의 성질 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-07-VARIABLE_LIMIT_INTEGRAL`: 정적분과 함수의 관계 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-08-AREA`: 정적분을 이용한 넓이 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-08-DISTANCE`: 속도와 거리 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)
- `H22-M1-08-GEOMETRIC_APPLICATION`: 정적분의 도형 활용 — 검토 대상(L2 세부단원 vs RPM L3/L4 구분)

## 안전한 후속 수리 순서
1. master-usage 실제 파일 전 범위(원본/유사/교재/기타)·자동 소비자·검색 인덱스에서 키 사용처 inventory를 정확히 뽑고 zero-use 판단을 확정.
2. H15-M2 51개의 9 KEEP / 7 REVIEW / 35 MISPLACED를 문항 수준 재판정. 사용된 비정합 키는 올바른 parent/subunit과 보조개념 축으로 remap하고 변경 전후 protected source diff 검증.
3. H22-M1 28개를 L2와 RPM L3/L4로 분리하여 기존 2015 대응 키를 최대한 재사용하는 canonical 대응표 작성; 매산고 2026 Library CREATE 21문항도 보정.
4. legacy 2021 매산고와 2026 제일고/금당고 신규 43문항의 `subUnitKey` 결손·부모오용을 별도 실제 문항 검토 후 수리.
5. master 마크다운+JSON, exam-scoped 변경, 등록기·필터·소비자 영향 최소 점검 후 stage-gated 반영. 아무 문항도 주개념·보조개념 판정 없이 자동 변경하거나 삭제하지 않음.
