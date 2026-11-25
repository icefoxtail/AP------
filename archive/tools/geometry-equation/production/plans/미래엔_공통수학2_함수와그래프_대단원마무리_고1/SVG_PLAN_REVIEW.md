# 미래엔 공통수학Ⅱ — 함수와 그래프 대단원 마무리 / 첫 묶음 q01–q09

- 원본 JS: `archive/exams/textbooks/미래엔_공통수학2/미래엔_공통수학2_함수와그래프_대단원마무리_고1/미래엔_공통수학2_함수와그래프_대단원마무리_고1.js`
- 원본 SHA-256: `3d5e542c788da039d0e5da0591e680b4890b644e349e9d5f355806f80b2cabf6`
- 범위: 전체 17문항 중 q01–q09, 문제 9축 + 해설 9축. q10–q17 미작업.
- 저장 규칙: 이 폴더의 `qNN-problem.plan.json`, `qNN-solution.plan.json`만 실제 제작 plan이다. EXEMPT 판정용 가짜 JSON은 없다.

| qid | 문제 그림 판정·개별 사유 | 해설 그림 판정·개별 사유 | 실제 제작 plan | shallow / full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- |
| q01 | EXEMPT — 제곱을 7로 나눈 나머지라는 규칙은 식으로 완전히 주어진다 | BENEFICIAL — 서로 다른 입력이 같은 나머지에 모이는 치역 이해 | `q01-solution.plan.json` | PASS / PASS | PASS |
| q02 | EXEMPT — 두 x값에서 함수가 같다는 대입식으로 결정된다 | EXEMPT — 연립일차방정식 계산 외 위치·그래프 관계가 없다 | — | N/A | N/A |
| q03 | EXEMPT — 절댓값 함수와 자연수 매개변수 조건은 텍스트로 완결된다 | BENEFICIAL — a=3에서 두 조각의 증가방향과 접속점 (1,−3) | `q03-solution.plan.json` | PASS / PASS | PASS |
| q04 | EXEMPT — 항등함수·상수함수의 정의를 그대로 대입한다 | EXEMPT — f(3), g(1) 두 값의 산술합이며 대응도는 반복이다 | — | N/A | N/A |
| q05 | EXEMPT — 네 원소의 구간별 함수식과 합성 횟수가 명시된다 | BENEFICIAL — 네 원소가 4회 만에 복귀하는 순환 화살표 | `q05-solution.plan.json` | PASS / PASS | PASS |
| q06 | EXEMPT — 일차함수의 역함수 값은 일차식 하나로 계산한다 | EXEMPT — f(a)=6을 푸는 단순 계산, 그래프 중복 | — | N/A | N/A |
| q07 | EXEMPT — 역함수·합성조건을 두 일차 등식으로 바꿀 수 있다 | EXEMPT — 두 일차식의 기울기·절편 계산, 별도 도식 유익성이 낮다 | — | N/A | N/A |
| q08 | EXEMPT — 5개 원소와 정해진 함숫값 조건이 텍스트에 모두 있다 | BENEFICIAL — 일대일대응에서 마지막 4→5를 강제하는 전단사 화살표 | `q08-solution.plan.json` | PASS / PASS | PASS |
| q09 | EXEMPT — 치환으로 f의 일차식이 정해진다 | EXEMPT — 일차식의 역함수 계산만 필요하고 추가 그림은 중복 | — | N/A | N/A |

## 실제로 그려지는 필드 대조

1. **q01 해설**: `diagram.columns[0]`에 X={1,2,3,4,5}, 오른쪽 열은 무한 공역 Y를 잘못 유한화한 것이 아닌 **계산된 치역 R={1,2,4}**. `arrows`는 정확히 `[1,4,2,2,4]`로 간다. 같은 나머지 2에 3·4, 4에 2·5가 함께 도착한다.
2. **q03 해설**: `graphPlan.pieces`가 x<1의 `x−4`(기울기 1)와 x≥1의 `5x−8`(기울기 5)를 그린다. `breakpoints`의 실제 수치 좌표 `(1,−3)`은 두 식 모두 만족하고 `requiredPoints[P]`에 같은 값이 그려진다. a=3은 해설에서 **계산된 값**이며 문제 그림에 새로 노출되지 않는다.
3. **q05 해설**: `diagram.arrows`의 차례는 `0→2, 2→4, 4→6, 6→0`; 네 화살표가 있어 4회 합성 항등이라는 풀이와 일치한다.
4. **q08 해설**: `diagram.arrows`의 차례는 `1→3, 2→4, 3→2, 4→5, 5→1`; 치역을 빠뜨리거나 두 출력으로 보내는 입력이 없다. `4→5`는 풀이에서 도출된 사실로 해설축에만 들어간다.

검증: 공식 `plan-lint.cjs --shallow` **4/4 PASS**, 공식 full **4/4 PASS**. 별도 독립 Node 대조로 표시되는 매핑 값·그래프 계수와 실제 원문을 검증해 `DRAWN_FEATURE_PARITY` **4/4 PASS**. 면 채움 0, 문제 정답 노출 0. SVG 렌더·PNG 육안·학생 화면·A4·JS 연결은 모두 **NOT_RUN**이며 출고 완료로 주장하지 않는다.
