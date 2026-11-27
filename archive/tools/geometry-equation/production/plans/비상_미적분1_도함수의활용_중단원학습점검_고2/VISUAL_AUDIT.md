# 비상 미적분Ⅰ · 도함수의 활용 · 중단원 학습 점검 · 고2 — SVG plan 검수

- 대상 JS: `archive/exams/textbooks/비상_미적분1/비상_미적분1_도함수의활용_중단원학습점검_고2/비상_미적분1_도함수의활용_중단원학습점검_고2.js`
- 원문 Git blob: `026093ece3fd0573ad325f9fb4a7e4347f507132`; 검토 시작 기준 main: `3233ca045e3bcf39415b717d59224fd312cca9e8`.
- 같은 내용의 `비상교육_미적분1` 폴더 JS와 그림은 Git blob 일치를 확인했다. 기존 시험지 JS·PNG는 수정하지 않는다.
- 14문항 × 문항/해설 2축 = **28축 전수**. 발문, 원문 그림 설명, 답·해설을 대조했다(`sourceVsPlan=REVIEWED`).
- 이 폴더의 `.plan.json`은 모두 production 공식 엔진용이며 `plan-lint.cjs --shallow`와 기본 full을 각각 통과했다. 각각의 상대 경로는 이 `VISUAL_AUDIT.md`가 놓인 디렉터리 기준이다.
- `DRAWN_FEATURE_PARITY=PASS`는 **원문 조건과 실사용 plan의 실제 그리기 필드를 대조한 정적 판정**이다. SVG 렌더·후보 PNG·학생 화면·A4 평가는 모두 `NOT_RUN`이며 그 시각 통과를 뜻하지 않는다.
- `EXEMPT`는 원문의 수식·풀이가 텍스트로 완결되고 별도 도형이 필수이지 않은 축이다. `KEEP_ORIGINAL`은 기제공 PNG를 유지하고 신생 plan으로 중복 재현하지 않는 축이다.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint (shallow/full) | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 도함수활용/q01 | 문항 | EXEMPT | 텍스트 접선 조건 | — | N/A | N/A |
| 도함수활용/q01 | 해설 | PLAN_READY | `piecewise-polynomial-spike-v1` | `q01-solution.plan.json` | PASS/PASS | PASS · 곡선·접점 T(1,2)·기울기 −3 접선, 극점 표시 |
| 도함수활용/q02 | 문항 | EXEMPT | 위치·속도 수식 | — | N/A | N/A |
| 도함수활용/q02 | 해설 | EXEMPT | 미분식·속도·가속도 계산 | — | N/A | N/A |
| 도함수활용/q03 | 문항 | EXEMPT | 접선·넓이 발문 | — | N/A | N/A |
| 도함수활용/q03 | 해설 | PLAN_READY | `polynomial-spike-v1` | `q03-solution.plan.json` | PASS/PASS | PASS · 접점 T·접선·절편 A/B·삼각형 변·직각표식·`fill:NONE` |
| 도함수활용/q04 | 문항 | EXEMPT | 두 함수의 공통 접선 조건 | — | N/A | N/A |
| 도함수활용/q04 | 해설 | PLAN_READY | `piecewise-polynomial-spike-v1` | `q04-solution.plan.json` | PASS/PASS | PASS · f/g 두 곡선·공통 접점 P·접선·정확한 극점 |
| 도함수활용/q05 | 문항 | EXEMPT | 평균값정리 수식 | — | N/A | N/A |
| 도함수활용/q05 | 해설 | PLAN_READY | `polynomial-spike-v1` | `q05-solution.plan.json` | PASS/PASS | PASS · 두 끝점·할선·c=1 접선의 평행 기울기 |
| 도함수활용/q06 | 문항 | EXEMPT | 도함수 판별식 | — | N/A | N/A |
| 도함수활용/q06 | 해설 | EXEMPT | a 범위의 대수적 판정 | — | N/A | N/A |
| 도함수활용/q07 | 문항 | KEEP_ORIGINAL | `q07.png` (도함수 원본) | — | N/A | ORIGINAL_PNG_REVIEWED · 축의 0·2, 아래로 열린 포물선 보존 |
| 도함수활용/q07 | 해설 | PLAN_READY | `polynomial-spike-v1` | `q07-solution.plan.json` | PASS/PASS | PASS · 원시함수의 극소 (0,3), 극대 (2,7) |
| 도함수활용/q08 | 문항 | EXEMPT | 닫힌구간 최솟값 계산 | — | N/A | N/A |
| 도함수활용/q08 | 해설 | EXEMPT | 양 끝점·정지점 함수값 대조 | — | N/A | N/A |
| 도함수활용/q09 | 문항 | EXEMPT | 교점 개수의 수식 조건 | — | N/A | N/A |
| 도함수활용/q09 | 해설 | PLAN_READY | `polynomial-spike-v1` | `q09-solution.plan.json` | PASS/PASS | PASS · 차함수·극대/극소·경계 높이 y=0,−4 |
| 도함수활용/q10 | 문항 | EXEMPT | 부등식과 구간 | — | N/A | N/A |
| 도함수활용/q10 | 해설 | EXEMPT | h(1) 최솟값의 부등식 | — | N/A | N/A |
| 도함수활용/q11 | 문항 | EXEMPT | 운동 위치함수 | — | N/A | N/A |
| 도함수활용/q11 | 해설 | EXEMPT | 속도 일치 시각·거리 | — | N/A | N/A |
| 도함수활용/q12 | 문항 | EXEMPT | 극값 존재 매개변수 | — | N/A | N/A |
| 도함수활용/q12 | 해설 | EXEMPT | 도함수의 세 실근 판정 | — | N/A | N/A |
| 도함수활용/q13 | 문항 | EXEMPT | 절댓값 방정식 | — | N/A | N/A |
| 도함수활용/q13 | 해설 | PLAN_READY | `polynomial-spike-v1` | `q13-solution.plan.json` | PASS/PASS | PASS · f(x)와 y=±11, 극대 11·극소 −16, 2+3교점 |
| 도함수활용/q14 | 문항 | EXEMPT | 평균속도·구간 | — | N/A | N/A |
| 도함수활용/q14 | 해설 | EXEMPT | 평균값정리·속도 비교 | — | N/A | N/A |

## 원본 대비 독립 점검 및 후속 절차

- 7개 해설 plan의 곡선 계수·정지점·교점·접선식은 원문 풀이에서 독립 재계산했다. 표시가 요구되는 접선·할선·기준선·다각형·직각표식은 `graphPlan.overlays`의 실제 필드에 있다. 설명에만 적고 도형에 없는 필수 표식은 확인되지 않았다.
- q03의 삼각형은 빈 면(`fill:"NONE"`)이다. 나머지 plan에는 흰색 배경 및 불필요한 면 채우기를 설정하지 않았다.
- q07 원본 문제 PNG는 문제의 단서를 이미 포함하므로 그대로 유지한다. 해설의 새 plan은 문제 축에 정답을 먼저 노출하지 않는다.
- `render/PNG/student/A4=NOT_RUN`: 이 역할의 결과는 plan 원본과 검수표이며, 운영 SVG 생성·바인딩·시각검수는 별도 렌더/게시 라인에서 시행한다.
