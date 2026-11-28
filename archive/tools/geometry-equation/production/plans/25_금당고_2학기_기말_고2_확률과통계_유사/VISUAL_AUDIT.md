# 25_금당고_2학기_기말_고2_확률과통계_유사 — 문항·해설 전축 DRAWN_FEATURE_PARITY 감사

## 2026-11-28 독립 재검증 (금당고 7번 문제축 메타데이터 수정)

- 기준 `origin/main`: `6dc7e32c842c0be77a0bcfdd54b540d2c24e3e72` (직전 #3425의 병합 SHA를 최신으로 가정하지 않고 원격 재조회). 원문 JS 20문항·해설 20개 = **40축**을 각각 확인. 열린 PR **82개 전부**의 변경 파일에서 대상 JS 및 두 production plan 폴더 충돌 **0건**.
- 공식 production plan **10개 유지 / 1개 수정 / 신규 0**. 문제 2축(REQUIRED), 해설 9축(BENEFICIAL), 나머지 29축(EXEMPT: 발문·해설의 텍스트 수식, 표, 확률 연산으로 충분). `_plans/` 자료와 원본 기출의 자산은 production plan 수에 포함하지 않는다. 수정 파일은 오직 `q07-problem.plan.json`이며 그래프 수학 필드는 불변이다.
- **확인·수정한 결함:** q07 문제축의 `caption`, `accessibilityDescription`, `sourceConditions[].condition`, `newVisualInformation[]`에 발문이 요구하지 않은 풀이 중간값 `a=1/3`이 글자로 명시되어 있었다. 이 네 필드에서 정답 유출 문구를 제거하고 `a`는 미지수라는 중립적 설명으로 교체했다. 실제 그래프의 내부 수치 좌표는 실행에 필요하므로 그대로 유지하되 축 라벨·설명에 풀이값을 써서는 안 된다. 과거 제작 기록 중 이 문구를 인용한 줄은 당시 상태이며 이 상단 수정 결과가 우선한다.
- 공식 JSON 파싱·필수 필드 **11/11 PASS**, `plan-lint.cjs` **shallow 11/11 PASS**, **full 11/11 PASS** (각 FAIL 0 / SKIP 0). 발문·해설 조건과 곡선 계수·눈금·구간·음영·점 이름 및 메타데이터 정정의 수동 `STATIC_FIELD_PARITY` **11/11 PASS**. 다만 실제 plan 렌더 결과를 읽은 것이 아니므로 `DRAWN_FEATURE_PARITY` **PASS 0 / FAIL 0 / `RENDER_NOT_RUN` 11**이다.
- **원 기출 ≠ 현행 유사판**: 원 기출 q07 PNG는 꺾임점 x=3, 5와 끝점 x=6, 현행 유사판은 A(2,a), B(3,a), C(5,0)이다. 원 기출 q16 PNG는 O→Q(5), 이동 +3/−2, 유사판 q16.svg는 O→Q(4), 이동 +2/−1이다. 두 건 **`ORIGINAL_EXAM_PNG_CONFLICT`**. 현행 유사 JS 및 직접 연결된 SVG를 우선하며 기출 PNG를 그대로 베끼지 않는다. 기출의 풀이 SVG도 서로 다른 계수·조건을 가진 **`ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`**다.
- 유사판 q16.svg를 별도 래스터 검사한 결과 O(0), Q(4), 오른쪽 화살표·눈금·점 이름이 확인되며 불필요한 흰 배경 rect는 없다. 이는 **기존 자산** 관측으로, official plan 출력의 시각적 PASS가 아니다. `chromium --version`은 런처까지만 실행되고 `/usr/lib/chromium/chromium` 부재로 실패한다. **`RENDER_NOT_RUN`**.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | EXEMPT: 독립 두 사건의 수치 조건 | EXEMPT: 곱셈 공식으로 완결 | 없음 | — | EXEMPT | N/A | 수식으로 사건 포함관계가 충분함 |
| 02 | EXEMPT: 확률분포표를 본문 표로 제시 | EXEMPT: 기대값의 가중합 | 없음 | — | EXEMPT | N/A | 표를 SVG로 중복하지 않음 |
| 03 | EXEMPT: 연속/이산형 판별 언어문항 | EXEMPT: 사례 비교 | 없음 | — | EXEMPT | N/A | 좌표·영역 지시 없음 |
| 04 | EXEMPT: 이항분포 모수 명시 | EXEMPT: 평균·분산·표준편차 대입 | 없음 | — | EXEMPT | N/A | 수치만 계산 |
| 05 | EXEMPT: 선형변환의 두 모멘트 | EXEMPT: 연립방정식 | 없음 | — | EXEMPT | N/A | 변환 그래프 불필요 |
| 06 | EXEMPT: 학년별 2×2 분할표 | EXEMPT: 빈도와 조건부확률 산출 | 없음 | — | EXEMPT | N/A | 본문 표로 조건 완결 |
| 07 | REQUIRED: 사다리꼴 밀도함수의 네 꼭짓점 | BENEFICIAL: [1,3]의 밀도 아래 확률 넓이 | 유사 없음; 기출 `q7-solution-v2.svg` | `q07-problem.plan.json` **메타데이터 수정**, `q07-solution.plan.json` 유지 | PASS (2축) | RENDER_NOT_RUN (2축) | `ORIGINAL_EXAM_PNG_CONFLICT`: 기출 q07_graph.png의 꺾임 3·5·6과 유사본 2·3·5가 다름. 문제 `caption`·접근성 설명 등의 `a=1/3` 해설정보 노출을 제거; 실제 그림의 내부 a=1/3이 축 라벨에 노출되지 않는지는 렌더 후 확인 필요 |
| 08 | EXEMPT: 정규분포와 이동 구간 수식 | BENEFICIAL: 평균 52 기준 [48,56] 대칭 음영 | 유사 없음; 기출 `q8-solution-v2.svg` | `q08-solution.plan.json` | PASS | RENDER_NOT_RUN | 원 기출 N(40,16)과 달라 `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`; 유사 N(52,5²) 우선 |
| 09 | EXEMPT: 신뢰구간 폭 조건 수치 | BENEFICIAL: 표준정규 −1.96~1.96 중심 영역 | 없음 | `q09-solution.plan.json` | PASS | RENDER_NOT_RUN | 0.95 영역 및 양쪽 임계값 대응 확인 |
| 10 | EXEMPT: 공장별 분율을 서술 | EXEMPT: 베이즈 계산으로 충분 | 유사 없음; 기출 `q10-solution.svg` | — | EXEMPT | N/A | 기출 45%/55%와 유사 30%/70% 차이; SVG 변형 직접 복제하지 않음 |
| 11 | EXEMPT: N(60,8²)와 합격 비율 | BENEFICIAL: 상위 7%·72점 오른쪽 꼬리 | 유사 없음; 기출 `q11-solution-v2.svg` | `q11-solution.plan.json` | PASS | RENDER_NOT_RUN | 기출의 평균 320점과 조건 다름: `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT` |
| 12 | EXEMPT: 합·불량기준 수치 | BENEFICIAL: 표본평균 56 이하, 불량 개수 36 이하 두 패널 | 유사 없음; 기출 `q12-solution-v2.svg` | `q12-solution.plan.json` | PASS | RENDER_NOT_RUN | 표본평균 N(60,2²), 불량 개수 근사 N(50,7²)를 분리; 기출 장난감 조건과 다름 |
| 13 | EXEMPT: 두 상자의 모수·가격 경계 | BENEFICIAL: A/B의 300g 이상 두 확률 영역 | 유사 없음; 기출 `q13-solution-v2.svg` | `q13-solution.plan.json` | PASS | RENDER_NOT_RUN | 303/304·σ 6/4와 확률 0.69/0.84; 기출 크림빵과 계수 다름 |
| 14 | EXEMPT: 공 세 개 비복원 순서 규칙 | EXEMPT: 경우 열거와 분산 계산 | 없음 | — | EXEMPT | N/A | 그림보다 규칙표·수식이 정확함 |
| 15 | EXEMPT: 두 정규밀도·관계식 명시 | BENEFICIAL: X/Y 두 곡선과 X의 [21,28.5] 음영 | 유사 없음; 기출 `q15-solution.svg` | `q15-solution.plan.json` | PASS | RENDER_NOT_RUN | 기출 f(24)=g(28)과 유사 f(30)=g(34) 다름: `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT` |
| 16 | REQUIRED: 본문에서 지시한 O·Q 수직선 | BENEFICIAL: +2/−1 방향·길이 보조선 | **유사 `q16.svg`**; 기출 PNG | `q16-problem.plan.json`, `q16-solution.plan.json` | PASS (2축) | RENDER_NOT_RUN (2축) | `ORIGINAL_EXAM_PNG_CONFLICT`: 기출 Q(5)와 유사 Q(4), 이동 규칙까지 다름; 직접 연결 유사 q16.svg 우선 |
| 17 | EXEMPT: 주머니 성공확률·평균·분산 | EXEMPT: 이항모수 연립 | 없음 | — | EXEMPT | N/A | 위치 관계 필요 없음 |
| 18 | EXEMPT: 초기하 표의 경우 수 | EXEMPT: 분포표 및 기대·분산 계산 | 없음 | — | EXEMPT | N/A | 분포표는 텍스트로 제공 |
| 19 | EXEMPT: 정규모집단·신뢰구간 조건 | BENEFICIAL: X와 표본평균의 13·9.7 임계 영역 | 유사 없음; 기출 `q19-solution.svg` | `q19-solution.plan.json` | PASS | RENDER_NOT_RUN | N(10,6²), N(10,0.6²) 및 n=100; 기출 다른 상수라 SVG 변형 충돌 |
| 20 | EXEMPT: 주머니 교환 개수·사건 조건 | EXEMPT: 조합 조건부확률 계산 | 없음 | — | EXEMPT | N/A | 사건 집합은 부등식·조합으로 충분 |

**축 합계:** 20문항 = 문제 20축 + 해설 20축 = 40축. REQUIRED 2 / BENEFICIAL 9 / EXEMPT 29. 기존 11개 plan의 수식·경계·색칠 필드는 현행 유사 JS 조건과 일치하며 손 SVG 수정·엔진 외 생성은 하지 않았다. 새 Chromium 실행 가능성 점검에서 `/usr/bin/chromium`은 실제 본체 `/usr/lib/chromium/chromium` 부재로 종료 127을 반환했다. 따라서 공식 plan 렌더·PNG·학생 화면 육안대조는 **`RENDER_NOT_RUN`**이며 실제 시각 PASS가 아니다. 기출 PNG와 JS의 충돌은 JS가 현행 제작 대상이므로 원본 계수를 옮기지 않았다. 다른 작업에서 발견한 `MULTI_CURVE_INVERSE_CUBIC`·`PIECEWISE_POLYNOMIAL_UPPERCASE_FUNCTION_NAME`은 본 시험지에는 해당하지 않는다. 통계 그림의 기본 흰 배경은 공식 렌더를 확인할 수 없으므로 투명화 성공을 주장하지 않는다.

---

## 이전 제작 당시 감사 기록 (역사적 근거·건수; 현재 재검증은 위 표 우선)

- 원문: `archive/exams/similar/high/h2/2final/25_금당고_2학기_기말_고2_확률과통계_유사.js` / 최신 main 기준 원문 조건·수학·에셋을 각각 직접 대조.
- **20문항·40축 전수:** 엔진 실행형 JSON **11**, 독립 그림 EXEMPT **29**, 미지원 **0**.
- 실제 연결된 원본 SVG **1개** 중 흰색 배경 rect **0개** 발견. 원본은 변경하지 않고 새 plan에 불필요한 바탕/면 채움을 넣지 않음.
- plan-lint shallow/full: **11/11 PASS**. 정적 1:1은 발문·원본 도형의 점/선/눈금/면적 ↔ plan의 실제 그려지는 필드를 확인한 결과다.
- Chrome 실물 실행 본체 없음: 렌더·PNG·학생화면·A4 **RENDER_NOT_RUN**. 픽셀·시각적 결과는 PASS가 아님.
- 원문 JS, 기존 원본 SVG/PNG, 다른 시험지, 엔진 소스는 변경하지 않았음. 이 장부와 실행형 JSON만 본 경로에 추가.

| 파일/qid | 축 | 기존결함/판정·실제 복원 | 원문 이미지/발문 | 원본 배경 | capability | plan 경로 | plan-lint shallow/full | sourceVsPlan | DRAWN_FEATURE_PARITY | 렌더 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q01 | 문항 | EXEMPT: 독립사건의 곱셈정리: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q01 | 해설 | EXEMPT: 독립사건의 곱셈정리: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q02 | 문항 | EXEMPT: 확률변수의 기댓값: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q02 | 해설 | EXEMPT: 확률변수의 기댓값: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q03 | 문항 | EXEMPT: 연속확률변수: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q03 | 해설 | EXEMPT: 연속확률변수: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q04 | 문항 | EXEMPT: 이항분포의 평균과 분산: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q04 | 해설 | EXEMPT: 이항분포의 평균과 분산: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q05 | 문항 | EXEMPT: 확률변수의 일차변환: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q05 | 해설 | EXEMPT: 확률변수의 일차변환: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q06 | 문항 | EXEMPT: 분할표의 조건부확률: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q06 | 해설 | EXEMPT: 분할표의 조건부확률: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q07 | 문항 | PLAN: 발문에 명시된 O(0,0)·A(2,a)·B(3,a)·C(5,0) 등변 높이 a의 사다리꼴 꺾은선. 실제 풀이값 a=1/3은 축 라벨에 노출하지 않음 | `원문 발문·해설` | — | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_금당고_2학기_기말_고2_확률과통계_유사/q07-problem.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q07 | 해설 | PLAN: A·B 높이 a=1/3, x=1에서 f=1/6, 사다리꼴 전체 면적 1과 [1,3]의 정답 면적 7/12 | `원문 발문·해설` | — | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_금당고_2학기_기말_고2_확률과통계_유사/q07-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q08 | 문항 | EXEMPT: 정규분포 구간의 확률: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q08 | 해설 | PLAN: N(52,5²), 길이 8을 고정한 최적 구간 [48,56]의 평균 52 기준 좌우 대칭 음영 | `원문 발문·해설` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_금당고_2학기_기말_고2_확률과통계_유사/q08-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q09 | 문항 | EXEMPT: 모평균의 신뢰구간과 표본의 크기: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q09 | 해설 | PLAN: 95% 신뢰구간의 표준정규 임계 −1.96·1.96과 중심 영역 0.95 | `원문 발문·해설` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_금당고_2학기_기말_고2_확률과통계_유사/q09-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q10 | 문항 | EXEMPT: 전확률과 베이즈 정리: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q10 | 해설 | EXEMPT: 전확률과 베이즈 정리: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q11 | 문항 | EXEMPT: 정규분포의 표준화와 백분위수: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q11 | 해설 | PLAN: 응시자 상위 7%의 오른쪽 꼬리 X≥72, N(60,8²), z≥1.5 | `원문 발문·해설` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_금당고_2학기_기말_고2_확률과통계_유사/q11-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q12 | 문항 | EXEMPT: 표본평균과 이항분포의 정규분포 근사: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q12 | 해설 | PLAN: 1차 표본평균 N(60,2²)의 X̄≤56과 2차 불량개수 근사 N(50,7²)의 Y≤36을 별도 패널로 묘사 | `원문 발문·해설` | — | `composite-panels-v1` | `archive/tools/geometry-equation/production/plans/25_금당고_2학기_기말_고2_확률과통계_유사/q12-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q13 | 문항 | EXEMPT: 표본평균의 분포와 독립사건: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q13 | 해설 | PLAN: 독립 A·B 상자 표본평균 N(303,6²)·N(304,4²), 가격 20000원 경계 300g와 P=0.69·0.84 | `원문 발문·해설` | — | `composite-panels-v1` | `archive/tools/geometry-equation/production/plans/25_금당고_2학기_기말_고2_확률과통계_유사/q13-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q14 | 문항 | EXEMPT: 비복원추출의 확률변수와 분산: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q14 | 해설 | EXEMPT: 비복원추출의 확률변수와 분산: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q15 | 문항 | EXEMPT: 정규분포의 대칭성과 표준화: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q15 | 해설 | PLAN: 같은 표준편차 3의 X~N(27,3²), Y~N(37,3²); 조건 f(30)=g(34) 및 구간 21≤X≤28.5 정답 0.6687 | `원문 발문·해설` | — | `composite-panels-v1` | `archive/tools/geometry-equation/production/plans/25_금당고_2학기_기말_고2_확률과통계_유사/q15-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q16 | 문항 | PLAN: 원본 q16.svg와 1:1: 수직선의 출발점 O(0), 도착점 Q(4), 눈금·점 이름. 정답 이동 경로는 문제 그림에 비노출 | `archive/assets/images/25_금당고_2학기_기말_고2_확률과통계_유사/q16.svg` | 배경 rect 없음 | `number-line-figure-v1` | `archive/tools/geometry-equation/production/plans/25_금당고_2학기_기말_고2_확률과통계_유사/q16-problem.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q16 | 해설 | PLAN: 원본 O(0)·Q(4)를 보전하고 1회 시행 때 +2(확률 2/3)와 −1(확률 1/3)의 방향·길이 화살표를 보충 | `원문 발문·해설` | — | `number-line-figure-v1` | `archive/tools/geometry-equation/production/plans/25_금당고_2학기_기말_고2_확률과통계_유사/q16-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q17 | 문항 | EXEMPT: 이항분포의 평균과 분산으로 모수 구하기: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q17 | 해설 | EXEMPT: 이항분포의 평균과 분산으로 모수 구하기: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q18 | 문항 | EXEMPT: 초기하형 확률분포와 평균·분산: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q18 | 해설 | EXEMPT: 초기하형 확률분포와 평균·분산: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q19 | 문항 | EXEMPT: 모평균·표본크기·모표준편차 결정(신뢰구간): 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q19 | 해설 | PLAN: 조건 P(X≥13)+P(X̄≥9.7)=1, 모집단 N(10,6²)·표본평균 N(10,(3/5)²)을 각각 표현. n=100, 임계 대칭 | `원문 발문·해설` | — | `composite-panels-v1` | `archive/tools/geometry-equation/production/plans/25_금당고_2학기_기말_고2_확률과통계_유사/q19-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q20 | 문항 | EXEMPT: 교환 후 상태 조건의 조건부확률: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_금당고_2학기_기말_고2_확률과통계_유사/q20 | 해설 | EXEMPT: 교환 후 상태 조건의 조건부확률: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
