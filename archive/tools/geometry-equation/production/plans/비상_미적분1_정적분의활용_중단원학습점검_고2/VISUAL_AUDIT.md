# 비상 미적분Ⅰ · 정적분의 활용 중단원 학습 점검 · 고2 — 문항/해설 전수 SVG Plan 감사

- 재검수 기준 `main`: `23ab9081821faa5db55f7d1355abac03813e336e` (2026-11-27). 사용자 지정 JS: `archive/exams/textbooks/비상교육_미적분1/비상_미적분1_정적분의활용_중단원학습점검_고2/비상_미적분1_정적분의활용_중단원학습점검_고2.js`, blob `861faafbf00af6972c991167112e81959c4a7997`.
- `비상교육_미적분1` 경로에도 **동일 Git blob**으로 복제돼 있으므로 중복 제외 13문항/26축으로 집계. 원본 JS·원본 PNG·SVG·다른 라인 변경 없음.
- 실행 가능한 **해설 plan 10개**, 원본 PNG 유지 5축, 구체적 사유가 있는 EXEMPT 11축. 원본 이미지는 `q06`~`q09`, `q12`의 실제 PNG를 모두 열어 선·점선·식·영역 표식과 해설의 조건을 대조했다.
- 공식 `plan-lint.cjs` 명시 파일 인자 기준 shallow 10/10 OK, full 10/10 OK. `sourceQuote` 10/10 원문 직접 포함, `sourceConditions.mappedTo` 정적 대조. `DRAWN_FEATURE_PARITY`의 정적 표시는 수학과 **그려지는 데이터 필드의 대응**이지 SVG 실물·학생 화면 PASS를 뜻하지 않는다. q03과 q07 플랜을 재설계한 뒤 각각 full lint 재통과. 렌더·PNG 새 그림·학생 화면·A4·JS 게시=NOT_RUN(공식 렌더 시도는 브라우저 시작 preflight에서 실패).
- **2026-11-27 수정:** q03 해설의 거리를 구할 음영이 원래 1~3까지 채워져 있었으나 실제 계산 범위는 0~2이므로 **음영을 0~1·1~2로 한정**했다(2~3 구간의 곡선은 변위 설명용으로만 유지). q07 해설에는 원본의 `(4,2)`·`(2,-2)`에서 축까지의 **수직·수평 점선 4개**를 공식 `overlays.points/guides`로 추가했다. 새 SVG를 보지 못했으므로 렌더 패리티는 NOT_VERIFIED다.
- 루트 흰색 background fill은 넣지 않았다. `regions`의 LIGHT 채움은 실제 문제·해설에서 필요한 넓이/거리 구역에 한정하며 이외의 면은 무채움이다.

| 파일/qid | 축 | 판정·교육적 근거 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 활용점검/q01 | 문항 | EXEMPT · 포물선 식만으로 경계 계산 | — | — | N/A | N/A |
| 활용점검/q01 | 해설 | PLAN_READY · x축 아래 포물선 면적 | `piecewise-polynomial-spike-v1` | `q01-solution.plan.json` | PASS/PASS | STATIC_SOURCE_PLAN_REVIEWED / RENDER_NOT_RUN · 영점 -1·5, 꼭짓점(2,-9), 아래 영역 |
| 활용점검/q02 | 문항 | EXEMPT · 두 포물선 식으로 위치 결정 | — | — | N/A | N/A |
| 활용점검/q02 | 해설 | PLAN_READY · 두 곡선 사이 넓이 | `piecewise-polynomial-spike-v1` | `q02-solution.plan.json` | PASS/PASS | STATIC_SOURCE_PLAN_REVIEWED / RENDER_NOT_RUN · 위/아래 곡선, 교점 1·3, 넓이 |
| 활용점검/q03 | 문항 | EXEMPT · 초기 위치와 속도식이 확정 | — | — | N/A | N/A |
| 활용점검/q03 | 해설 | CORRECTED · 이동거리 0~2의 음영을 1~3에서 1~2로 수정 | `piecewise-polynomial-spike-v1` | `q03-solution.plan.json` | PASS/PASS | 정적 면적 구간 대조 · 0~1 양·1~2 음, 2~3 무채움, RENDER_NOT_RUN |
| 활용점검/q04 | 문항 | EXEMPT · 미지 a인 곡선식을 변형하면 해결 | — | — | N/A | N/A |
| 활용점검/q04 | 해설 | PLAN_READY · 확정값 a=4에서만 도식화 | `piecewise-polynomial-spike-v1` | `q04-solution.plan.json` | PASS/PASS | STATIC_SOURCE_PLAN_REVIEWED / RENDER_NOT_RUN · 0 접함, 3 근, (2,-16), 넓이27 |
| 활용점검/q05 | 문항 | EXEMPT · 점 (1,2)과 곡선이 주어짐 | — | — | N/A | N/A |
| 활용점검/q05 | 해설 | PLAN_READY · 접선/다른 교점의 두 영역 경계 | `piecewise-polynomial-spike-v1` | `q05-solution.plan.json` | PASS/PASS | STATIC_SOURCE_PLAN_REVIEWED / RENDER_NOT_RUN · 접선 y=3x-1, 교점 -2·1, 넓이 |
| 활용점검/q06 | 문항 | KEEP_ORIGINAL · `q06.png`는 미지 a를 노출하지 않음 | 기존 PNG | — | N/A | 원본 실물 확인 · y=x²-2x·y=ax·x축·2·두 면적 |
| 활용점검/q06 | 해설 | EXEMPT · 원본 문제 PNG가 이등분의 관계를 이미 보여줌 | — | — | N/A | N/A |
| 활용점검/q07 | 문항 | KEEP_ORIGINAL · `q07.png` 대칭·교점·음영 정확 | 기존 PNG | — | N/A | 원본 실물 확인 · x=2/4 점선, (2,-2), V와 포물선 |
| 활용점검/q07 | 해설 | CORRECTED · 원본의 x=2·4, y=-2·2 점선 누락 보강 | `piecewise-polynomial-spike-v1` | `q07-solution.plan.json` | PASS/PASS | 정적 점선 4개·포물선/V 교점 0·4·두 영역 대응, RENDER_NOT_RUN |
| 활용점검/q08 | 문항 | KEEP_ORIGINAL · `q08.png`의 세 영역 A·B·C 필요 색칠 | 기존 PNG | — | N/A | 원본 실물 확인 · 두 함수, A/B/C, x=4·7·9 점선 |
| 활용점검/q08 | 해설 | EXEMPT · 주어진 영역 12·6·5의 부호합이면 완결 | — | — | N/A | N/A |
| 활용점검/q09 | 문항 | KEEP_ORIGINAL · `q09.png` 역함수와 x/y축 면적 | 기존 PNG | — | N/A | 원본 실물 확인 · f 포물선, g 역함수, 원점·2 눈금·영역 |
| 활용점검/q09 | 해설 | EXEMPT · 기존 그림으로 역함수 대칭과 넓이 관계 설명 | — | — | N/A | N/A |
| 활용점검/q10 | 문항 | EXEMPT · 두 구간별 속도 함수가 명시됨 | — | — | N/A | N/A |
| 활용점검/q10 | 해설 | PLAN_READY · 속도-높이 관계 | `piecewise-polynomial-spike-v1` | `q10-solution.plan.json` | PASS/PASS | STATIC_SOURCE_PLAN_REVIEWED / RENDER_NOT_RUN · 접합 (10,5), 0~10과 10~12 두 넓이 |
| 활용점검/q11 | 문항 | EXEMPT · 속도 함수식만으로 적분 가능 | — | — | N/A | N/A |
| 활용점검/q11 | 해설 | PLAN_READY · 속도 0 시점과 귀환 시점 차이 | `piecewise-polynomial-spike-v1` | `q11-solution.plan.json` | PASS/PASS | STATIC_SOURCE_PLAN_REVIEWED / RENDER_NOT_RUN · 방향전환 2, 귀환 8/3, 부호 영역 |
| 활용점검/q12 | 문항 | KEEP_ORIGINAL · `q12.png`에 A·B가 분리돼 있음 | 기존 PNG | — | N/A | 원본 실물 확인 · y절편 k, x축, A와 B만의 채움 |
| 활용점검/q12 | 해설 | PLAN_READY · k=6을 해설에 한해 표시 | `piecewise-polynomial-spike-v1` | `q12-solution.plan.json` | PASS/PASS | STATIC_SOURCE_PLAN_REVIEWED / RENDER_NOT_RUN · 대칭축3, 근3±√3, A:B=1:2 |
| 활용점검/q13 | 문항 | EXEMPT · 두 점의 속도식과 초기 좌표 명확 | — | — | N/A | N/A |
| 활용점검/q13 | 해설 | PLAN_READY · 위치차 0의 양의 해 3개 | `polynomial-spike-v1` | `q13-solution.plan.json` | PASS/PASS | STATIC_SOURCE_PLAN_REVIEWED / RENDER_NOT_RUN · D(t)=3-t(t-3)², (1,-1)·(3,3) 극값 |

## 원본 이미지와 DRAWN_FEATURE_PARITY 핵심

1. **q06 문제 PNG:** 음영은 전체 도형이 x축으로 이등분되는 관계를 지시하므로 삭제하면 안 된다. x=2 표식과 곡선 y=x²-2x, 미지 직선 y=ax가 모두 있다. 해설에서 `(a+2)^3=16`이 도출되지만 문제축에 이 값을 숨긴다. 새 해설 복제 그림이 필요하지 않다.
2. **q07 문제 PNG:** 수평 점선 y=2와 y=-2, 수직 점선 x=2·4, 포물선 꼭짓점 (2,-2), V 그래프 꼭짓점 (2,0), 넓이 음영이 있다. 해설 plan은 `referenceCurves[g].pieces` 2개와 `breakpoints` x=2, `requiredPoints`의 두 꼭짓점 및 `regions` 두 개로 대응한다. 추가한 `overlays.guides[gp,gv]`는 각각 (4,2), (2,-2)에서 양 축으로 내리는 점선이다. 원본에는 별도 점 이름이 없으므로 추가 점의 `unnamed:true`를 유지한다.
3. **q08 문제 PNG:** 두 수식 없는 곡선의 교차/영역 A=12, B=6, C=5를 정확히 준다. 함수의 수식을 마음대로 만들면 오답 소지가 있어 기존 그래프를 유지한다. 해당 색칠은 정적분 부호 문제의 본질이므로 없애지 않는다.
4. **q09 문제 PNG:** 정의역 x≥2인 포물선 y=(x−2)²와 역함수 y=2+√x를 표시하며 x/y축 사이 색칠은 넓이의 대상이다. 기존 충분한 시각자료를 억지로 재제작하지 않는다.
5. **q12:** 문제 PNG에는 계수 k가 미지인 상태로 남고, 해설에서만 k=6, 근 3±√3, 꼭짓점 (3,-3) 및 두 실제 적분영역 A/B를 `regions`로 그린다. `∫₀^{3−√3} f=2√3`, `−∫_{3−√3}^{3+√3} f=4√3`을 별도 계산으로 검산했다.
6. **q04:** 원본 다항함수의 전체 정의역을 주장하는 대신 그래프는 `-1<x<7/2`의 초점 구간만 보여 준다(원문 곡선식과 x=0·3 및 면적 27은 그대로다). 엔진 full 관측기의 `PIECEWISE_POLY_ARM_TOO_SHORT`를 좁은 팔로 오판하지 않도록 그림의 실제 표시 구간을 명시했고 full lint를 다시 통과했다.
7. **q13:** 속도 2개를 그린 척하는 것이 아니라, 만날 조건 `xP=xQ`에 대응하는 실제 위치차 D(t) 한 곡선만 그린다. 양의 시간에서 세 번 x축을 가로지르는 것은 `(1,-1)` 극소·`(3,3)` 극대와 `D(0)=3`·끝쪽 하강으로 확인된다.

`render/PNG/student/A4/JS publication=NOT_RUN`, 검수된 플랜은 후속 공식 엔진 렌더·실물 대비 대상으로 남는다. 원본 PNG 5개는 지시선/점선/라벨을 눈으로 확인했으며 원래 넓이 표시를 이유 없이 제거하지 않는다.
