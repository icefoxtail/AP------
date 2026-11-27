# 매산고 2026년 1학기 중간 고1 유사: SVG 플랜 전수 감사

- 대상: `archive/exams/similar/high/h1/1mid/26_매산고_1학기_중간_고1_유사.js` (20문항 × 발문/해설 = **40축**)
- 운영 플랜: `archive/tools/geometry-equation/production/plans/26_매산고_1학기_중간_고1_유사/`
- 기존 `_plans` 40축 shallow 재검증: **40/40 OK**. 운영 JSON 8개에 대해 shallow/full: **8/8 OK**.
- `DRAWN_FEATURE_PARITY`: **문항 텍스트·원본 기출 에셋·현재 유사 SVG·plan 수학요소 정적 대조**이다. 렌더된 신규 SVG의 화면상 1:1 일치는 Chromium 부재로 `RENDER_NOT_RUN`이며 PASS로 기재하지 않는다.
- 모든 신규 JSON은 직접 SVG 코드를 쓰지 않았고, `plan-lint.cjs` 정식 엔진의 심층 검사에서 통과했다. 면 채움은 원문이 요구하지 않을 경우 선언하지 않거나 `NONE`이다.

## 40축 전수 판정

| 파일/qid | 축 | 기존결함/판정 | capability | plan 경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 26_매산고_1학기_중간_고1_유사.js / q01 | 발문 | EXEMPT — 다항식 계수; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q01 | 해설 | EXEMPT — 다항식 계수; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q02 | 발문 | EXEMPT — 항등식 계수 비교; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q02 | 해설 | EXEMPT — 항등식 계수 비교; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q03 | 발문 | EXEMPT — 세제곱 차 인수분해; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q03 | 해설 | EXEMPT — 세제곱 차 인수분해; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q04 | 발문 | EXEMPT — 폐구간 이차함수 극값; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q04 | 해설 | 기존 꼭짓점·양 끝점 표기 정확, 유지 | `piecewise-polynomial-spike-v1` | [q04-solution.plan.json](q04-solution.plan.json) | OK / OK | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| 26_매산고_1학기_중간_고1_유사.js / q05 | 발문 | EXEMPT — 몫과 나머지; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q05 | 해설 | EXEMPT — 몫과 나머지; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q06 | 발문 | EXEMPT — 수의 나머지; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q06 | 해설 | EXEMPT — 수의 나머지; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q07 | 발문 | EXEMPT — 인수정리; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q07 | 해설 | EXEMPT — 인수정리; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q08 | 발문 | EXEMPT — 켤레복소수 성질; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q08 | 해설 | EXEMPT — 켤레복소수 성질; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q09 | 발문 | EXEMPT — 판별식의 부호; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q09 | 해설 | EXEMPT — 판별식의 부호; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q10 | 발문 | EXEMPT — 이차함수 x축 접점 조건; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q10 | 해설 | 접선과 x축 표시 정확, 유지 | `piecewise-polynomial-spike-v1` | [q10-solution.plan.json](q10-solution.plan.json) | OK / OK | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| 26_매산고_1학기_중간_고1_유사.js / q11 | 발문 | EXEMPT — 포물선과 직선의 접선; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q11 | 해설 | 직선·포물선의 접점 및 무리수 좌표 정확, 유지 | `piecewise-polynomial-spike-v1` | [q11-solution.plan.json](q11-solution.plan.json) | OK / OK | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| 26_매산고_1학기_중간_고1_유사.js / q12 | 발문 | EXEMPT — 복소수 순허수; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q12 | 해설 | EXEMPT — 복소수 순허수; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q13 | 발문 | EXEMPT — 복소수 상등·근계수; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q13 | 해설 | EXEMPT — 복소수 상등·근계수; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q14 | 발문 | EXEMPT — 이차함수 두 근; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q14 | 해설 | x절편 2점·꼭짓점 표기 정확, 유지 | `piecewise-polynomial-spike-v1` | [q14-solution.plan.json](q14-solution.plan.json) | OK / OK | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| 26_매산고_1학기_중간_고1_유사.js / q15 | 발문 | 기출의 두 실선과 대조해 점선 참조곡선을 실선 g로 변경, 교점 지시선 보존 | `piecewise-polynomial-spike-v1` | [q15-problem.plan.json](q15-problem.plan.json) | OK / OK | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| 26_매산고_1학기_중간_고1_유사.js / q15 | 해설 | 차함수의 근·최댓값 정확, 유지 | `piecewise-polynomial-spike-v1` | [q15-solution.plan.json](q15-solution.plan.json) | OK / OK | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| 26_매산고_1학기_중간_고1_유사.js / q16 | 발문 | EXEMPT — 곱셈공식; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q16 | 해설 | EXEMPT — 곱셈공식; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q17 | 발문 | EXEMPT — 복소수 거듭제곱; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q17 | 해설 | EXEMPT — 복소수 거듭제곱; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q18 | 발문 | EXEMPT — 두 포물선과 수평선; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q18 | 해설 | 두 포물선·교점 및 수평선 y=3,5 유지 | `piecewise-polynomial-spike-v1` | [q18-solution.plan.json](q18-solution.plan.json) | OK / OK | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| 26_매산고_1학기_중간_고1_유사.js / q19 | 발문 | EXEMPT — 삼차식 나머지정리; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q19 | 해설 | EXEMPT — 삼차식 나머지정리; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q20 | 발문 | EXEMPT — 두 이차방정식 근의 개수; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_매산고_1학기_중간_고1_유사.js / q20 | 해설 | 미지함수 추론 결과의 꼭짓점·양 끝점·두 수평선 유지 | `piecewise-polynomial-spike-v1` | [q20-solution.plan.json](q20-solution.plan.json) | OK / OK | STATIC_RELATION_MATCH·RENDER_NOT_RUN |

## 원문·원본 기출 그림 대비 핵심 요소 1:1 대조

| qid/축 | 원문/기출 에셋의 필수 요소 → 운영 플랜 확인 | 최종 그림 판정 |
|---|---|---|
| q04-solution | 0≤x≤3, V(2,1), A(0,5), B(3,2) | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| q10-solution | m=13/8, y=(x−7/8)², T(7/8,0) | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| q11-solution | k=1−4√2, y=x−1과 T(√2,√2−1)에서 접함 | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| q14-solution | a=2, A(2,0), B(10,0), V(6,−16) | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| q15-problem | 기출 PNG는 x=2,5; 유사문항은 x=1,6으로 정합 변형; f/g 실선, 각 x에서 축까지 점선 | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| q15-solution | h=f−g=−(x−1)(x−6), A(1,0), B(6,0), V(7/2,25/4) | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| q18-solution | C(−1,3), D(2,6), y=3에서 중복, y=5에서 서로 다른 4교점 | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| q20-solution | V(5,−50/3), A(0,25/3), B(10,25/3), 접선 y=−50/3 | STATIC_RELATION_MATCH·RENDER_NOT_RUN |

## 남은 엔진 기능과 최종 렌더 상태

- `TRANSPARENT_CANVAS_OPTION`: 새 엔진 출력을 만들 때 루트의 흰색 `<rect fill="#fff">`를 제거하는 **plan-level 투명 배경 옵션**이 없다. 이 기능은 `ENGINE_CAPABILITY_PENDING`; 외부 SVG 파일에서 손으로 요소를 지우지 않는다.
- 렌더러의 브라우저 실행파일 `/usr/lib/chromium/chromium`이 없는 환경이라 최종 SVG 합성·배치 검사 및 완전한 DRAWN_FEATURE_PARITY 시각 검증은 수행할 수 없었다. 새 렌더 증거가 없으므로 `RENDER_NOT_RUN`을 유지한다.

## 재현

```bash
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow archive/tools/geometry-equation/production/plans/26_매산고_1학기_중간_고1_유사/*.plan.json
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs archive/tools/geometry-equation/production/plans/26_매산고_1학기_중간_고1_유사/*.plan.json
```
