# 26_효천고_1학기_기말_고1_유사 — 문항·해설 2축 전수 SVG 품질 감사

- 대상: `archive/exams/similar/high/h1/1final/26_효천고_1학기_기말_고1_유사.js`
- **26문항 × 문제·해설 = 52축**. 각 축마다 발문·해설·현재 SVG/기출 원본 에셋과의 관계를 검사했다.
- `EXEMPT`는 그림이 문제 조건에 추가 정보를 주지 않아 해설·발문 수식만으로 충분하다는 판정이며, 누락된 그림의 PASS를 뜻하지 않는다.
- `FIELD_PASS`는 원문 수치·점·곡선·범위·표식 → plan JSON 필드를 정적으로 대조한 판정이다. 실제 새 SVG 렌더·PNG·학생 화면·A4 비교는 **NOT_RUN**이므로 시각적 1:1 출고 합격을 의미하지 않는다.
- 모든 신규 JSON은 공식 `plan-lint.cjs --shallow` / full에 통과했다. 기존 plan은 보존하고 새로운 plan은 `production/plans/<stem>/`에만 추가했다. 시험지 JS·원본 이미지 에셋은 변경하지 않았다.
- 기존 엔진 SVG 다수의 루트 `<rect fill="#fff">`는 엔진 캔버스 공통 출력이며 plan 필드만으로 억제할 수 없다. **투명 배경을 요구하는 경우 ENGINE_CAPABILITY_PENDING: TRANSPARENT_CANVAS**. 실내 면 채움은 신설 plan에 요구하지 않았고, 삼각형 넓이를 묻는 순천여고 q23 해설의 삼각형 강조만 예외다.
- 원본 기출과 유사판은 수치가 달라 **동일 픽셀**이 아니라 도형의 의미·인접·선·치수·표식·라벨 구조를 비교한다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 26_효천고_1학기_기말_고1_유사/q01 | problem | EXEMPT — 행렬 차원 판별; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q01 | solution | EXEMPT — 행렬 차원 판별; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q02 | problem | EXEMPT — 순열·조합 정의; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q02 | solution | EXEMPT — 순열·조합 정의; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q03 | problem | EXEMPT — 행렬 상등식; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q03 | solution | EXEMPT — 행렬 상등식; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q04 | problem | EXEMPT — 이차함수 x절편의 합; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q04 | solution | REPLAN — 기존 이차함수 해설 SVG와 plan EXEMPT 불일치: 근 −2,7·꼭짓점 보강 | `polynomial-spike-v1` | `q04-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_효천고_1학기_기말_고1_유사/q05 | problem | KEEP — 기존 교점 −4,1과 두 포물선·점선·함수명 표시 유지 | `piecewise-polynomial-spike-v1` | `archive/exams/similar/high/h1/1final/26_효천고_1학기_기말_고1_유사_plans/q05-problem.plan.json` | PASS/PASS | EXISTING_SVG_STRUCTURE_SEEN · WHITE_CANVAS_PENDING |
| 26_효천고_1학기_기말_고1_유사/q05 | solution | EXEMPT — 두 포물선 교점과 f<g; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q06 | problem | EXEMPT — 복소수 거듭제곱 합; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q06 | solution | EXEMPT — 복소수 거듭제곱 합; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q07 | problem | EXEMPT — 두 판별식 조건; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q07 | solution | EXEMPT — 두 판별식 조건; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q08 | problem | EXEMPT — 매개변수별 꼭짓점 위치; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q08 | solution | REPLAN — 기존 분기형 매개변수 SVG와 plan EXEMPT 불일치: a=3 분기·a=7 영점 보강 | `multi-curve-figure-v1` | `q08-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_효천고_1학기_기말_고1_유사/q09 | problem | EXEMPT — 소인수 지수별 약수 수; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q09 | solution | EXEMPT — 소인수 지수별 약수 수; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q10 | problem | BLOCKED — 일렬 징검돌 7개+시작/도착 아이콘 및 1·2칸 화살표의 전용 primitive 부재 | ENGINE_CAPABILITY_PENDING (STEPPING_STONE_PATH) | — | N/A | ENGINE_CAPABILITY_PENDING |
| 26_효천고_1학기_기말_고1_유사/q10 | solution | BLOCKED — 8칸 도약의 두 경우 분기·재귀 누적 경로 표시 primitive 부재 | ENGINE_CAPABILITY_PENDING (STEPPING_STONE_RECURRENCE) | — | N/A | ENGINE_CAPABILITY_PENDING |
| 26_효천고_1학기_기말_고1_유사/q11 | problem | EXEMPT — 연립 이차부등식 무해 조건; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q11 | solution | REPLAN — 두 열린 해 구간이 맞닿는 경계 a=2를 닫힌 매개변수 점으로 보강 | `number-line-figure-v1` | `q11-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_효천고_1학기_기말_고1_유사/q12 | problem | EXEMPT — 서로 다른 공연팀 나열; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q12 | solution | EXEMPT — 서로 다른 공연팀 나열; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q13 | problem | EXEMPT — 이차함수 차의 부호; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q13 | solution | REPLAN — 기존 h=f−g 포물선 SVG의 두 근 −1,3과 꼭짓점(1,−8) 필드화 | `polynomial-spike-v1` | `q13-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_효천고_1학기_기말_고1_유사/q14 | problem | EXEMPT — 중복 자리 숫자 배열; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q14 | solution | EXEMPT — 중복 자리 숫자 배열; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q15 | problem | EXEMPT — 세 자리수 조건별 경우; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q15 | solution | EXEMPT — 세 자리수 조건별 경우; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q16 | problem | EXEMPT — 행렬 기본 법칙의 반례; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q16 | solution | EXEMPT — 행렬 기본 법칙의 반례; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q17 | problem | EXEMPT — 행렬 세제곱 항등식; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q17 | solution | EXEMPT — 행렬 세제곱 항등식; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q18 | problem | EXEMPT — 공통 접선과 두 이차함수 꼭짓점; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q18 | solution | REPLAN — 공통접선 y=−2x·두 포물선·두 꼭짓점·두 접점의 시각적 인과관계 누락 | `multi-curve-figure-v1` | `q18-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_효천고_1학기_기말_고1_유사/q19 | problem | EXEMPT — 열벡터 합산; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q19 | solution | EXEMPT — 열벡터 합산; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q20 | problem | EXEMPT — 허수 제곱근의 계산; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q20 | solution | EXEMPT — 허수 제곱근의 계산; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q21 | problem | EXEMPT — 삼차방정식 인수분해; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q21 | solution | EXEMPT — 삼차방정식 인수분해; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q22 | problem | EXEMPT — 절댓값 합과 수평 기준 y=7; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q22 | solution | REPLAN — 기존 해설 SVG의 세 직선 조각·기준 y=7 점선·교점 −4,3을 실행형 복구 | `multi-curve-figure-v1` | `q22-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_효천고_1학기_기말_고1_유사/q23 | problem | EXEMPT — 연쇄부등식 정수해 3개; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q23 | solution | REPLAN — 정수 4,5,6만 허용하는 매개변수 범위 7<a≤9의 경계 보강 | `number-line-figure-v1` | `q23-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_효천고_1학기_기말_고1_유사/q24 | problem | KEEP — 기존 f·g 교점 x=1,7, 점선과 함수명 표시 유지 | `piecewise-polynomial-spike-v1` | `archive/exams/similar/high/h1/1final/26_효천고_1학기_기말_고1_유사_plans/q24-problem.plan.json` | PASS/PASS | EXISTING_SVG_STRUCTURE_SEEN · WHITE_CANVAS_PENDING |
| 26_효천고_1학기_기말_고1_유사/q24 | solution | REPLAN — 기존 해설 SVG의 h(x)=(x−4)²−9 근·꼭짓점·구간 끝점을 실행형 복구 | `polynomial-spike-v1` | `q24-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_효천고_1학기_기말_고1_유사/q25 | problem | EXEMPT — 행렬 거듭제곱·파라미터; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q25 | solution | EXEMPT — 행렬 거듭제곱·파라미터; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q26 | problem | EXEMPT — 공연 놀이기구 인원 분배; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_효천고_1학기_기말_고1_유사/q26 | solution | EXEMPT — 공연 놀이기구 인원 분배; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |

**집계:** 52축 = 실행형 신규 8 / 기존 엔진 plan 2 / 엔진 기능 대기 2 / EXEMPT 40.

**검수 한계:** 신규 SVG 및 픽셀 1:1 검수는 실행되지 않았고, 기존 원본·유사 그림의 정적 구조와 JSON 필드 대응만 확인했다.
