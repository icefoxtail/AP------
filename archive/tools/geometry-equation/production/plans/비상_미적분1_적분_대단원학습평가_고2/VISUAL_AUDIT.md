# 비상 미적분Ⅰ · 적분 · 대단원 학습 평가 · 고2 — 2축 SVG plan 검수

- 대상 JS: `archive/exams/textbooks/비상교육_미적분1/비상_미적분1_적분_대단원학습평가_고2/비상_미적분1_적분_대단원학습평가_고2.js`
- 원본 blob `98e12c4ad1757736b3309fac2d2ec9a6b5d38767`; 재검수 기준 main `23ab9081821faa5db55f7d1355abac03813e336e`.
- 사용자 경로의 `비상교육_미적분1` 복제 JS 및 두 PNG 모두 Git blob 일치를 확인했다. 기존 JS와 PNG는 수정하지 않는다.
- **14문항의 문항 14축 + 해설 14축 = 28축 전수**. 발문·정답·해설·원본 그림을 대조했다(`sourceVsPlan=REVIEWED`).
- 제작용 `.plan.json` 7개는 전부 공식 엔진에서 shallow/full lint PASS. `KEEP_ORIGINAL` 2축은 문제 조건을 이미 정확히 갖는 PNG를 그대로 유지한다. `EXEMPT`는 추가 그림이 풀이에 보탤 독립 정보를 갖지 않는 축이다.
- `DRAWN_FEATURE_PARITY=PASS`는 **원본·풀이 대비 실제 그리기 필드의 정적 1:1 대응**이다. SVG 렌더·후보 PNG·학생 화면·A4 검수·JS 게시 연결은 `NOT_RUN`이며 정적 PASS를 실물 PASS로 바꾸지 않는다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 적분평가/q01 | 문항 | EXEMPT · 부정적분 항등식 | — | — | N/A | N/A |
| 적분평가/q01 | 해설 | EXEMPT · 양변 미분 계산 | — | — | N/A | N/A |
| 적분평가/q02 | 문항 | EXEMPT · 부정적분의 차 | — | — | N/A | N/A |
| 적분평가/q02 | 해설 | EXEMPT · 적분상수 확정 | — | — | N/A | N/A |
| 적분평가/q03 | 문항 | EXEMPT · 정적분의 매개변수 | — | — | N/A | N/A |
| 적분평가/q03 | 해설 | EXEMPT · 다항식 적분으로 a 결정 | — | — | N/A | N/A |
| 적분평가/q04 | 문항 | EXEMPT · 절댓값 피적분식 | — | — | N/A | N/A |
| 적분평가/q04 | 해설 | PLAN_READY | `piecewise-polynomial-spike-v1` | `q04-solution.plan.json` | PASS/PASS | PASS · x=1 분할·두 넓이 |
| 적분평가/q05 | 문항 | EXEMPT · 적분으로 정의된 f | — | — | N/A | N/A |
| 적분평가/q05 | 해설 | PLAN_READY | `polynomial-spike-v1` | `q05-solution.plan.json` | PASS/PASS | PASS · 극대(1,5/6)·극소(2,2/3) |
| 적분평가/q06 | 문항 | KEEP_ORIGINAL · 이등분 면적 | 기존 `q06.png` | — | N/A | 원본 PNG 실물 점검 · 곡선 2개·y=1·의미 있는 연두색 영역 |
| 적분평가/q06 | 해설 | EXEMPT · 기존 문제 PNG로 경계 충분 | — | — | N/A | N/A |
| 적분평가/q07 | 문항 | EXEMPT · 포물선과 직선의 넓이 발문 | — | — | N/A | N/A |
| 적분평가/q07 | 해설 | 보강 · 꼭짓점 분수 좌표의 정확 표기 미지정 → V 라벨 | `piecewise-polynomial-spike-v1` | `q07-solution.plan.json` | PASS/PASS | PASS(정적) · V(1/2,−1/4), 교점 1·4, 영역 9/2 |
| 적분평가/q08 | 문항 | KEEP_ORIGINAL · 속도 그래프 | 기존 `q08.png` | — | N/A | 원본 PNG 실물 점검 · 꺾은선 4개·1/3/4/5 점선 |
| 적분평가/q08 | 해설 | 재설계 · 원본의 1~5·2/−1/−2 눈금 누락, A점 불필요한 수평점선 → 축 눈금·수직점선 보정 | `piecewise-polynomial-spike-v1` | `q08-solution.plan.json` | PASS/PASS | PASS(정적) · 원본 4직선·1/3/4/5 수직점선·음수 3영역·k=−3 |
| 적분평가/q09 | 문항 | EXEMPT · 속도 함수 식 | — | — | N/A | N/A |
| 적분평가/q09 | 해설 | PLAN_READY | `piecewise-polynomial-spike-v1` | `q09-solution.plan.json` | PASS/PASS | PASS · 정지시각 5·거리 삼각형 |
| 적분평가/q10 | 문항 | EXEMPT · 함수방정식 | — | — | N/A | N/A |
| 적분평가/q10 | 해설 | EXEMPT · 정의·미분·적분식 | — | — | N/A | N/A |
| 적분평가/q11 | 문항 | EXEMPT · 합/곱의 도함수 | — | — | N/A | N/A |
| 적분평가/q11 | 해설 | EXEMPT · 인수분해와 조건 대조 | — | — | N/A | N/A |
| 적분평가/q12 | 문항 | EXEMPT · 미지 함수의 적분 항등식 | — | — | N/A | N/A |
| 적분평가/q12 | 해설 | EXEMPT · 상수 결정 및 수치 적분 | — | — | N/A | N/A |
| 적분평가/q13 | 문항 | EXEMPT · 항등식과 면적 발문 | — | — | N/A | N/A |
| 적분평가/q13 | 해설 | 보강 · 극솟점의 정확 분수 좌표 미지정 → M(4,−32/3) | `piecewise-polynomial-spike-v1` | `q13-solution.plan.json` | PASS/PASS | PASS(정적) · 근 0·6, 극소(4,−32/3), 아래쪽 면적 36 |
| 적분평가/q14 | 문항 | EXEMPT · 속도 함수 식 | — | — | N/A | N/A |
| 적분평가/q14 | 해설 | PLAN_READY | `piecewise-polynomial-spike-v1` | `q14-solution.plan.json` | PASS/PASS | PASS · 방향전환 1·3, 속도 최대 2, 부호별 두 넓이 |

## 정밀 원본 대비 및 엔진 필드 검수

1. **q06 기존 원본:** `q06.png`의 `y=x²`, `y=ax²`, y축 및 `y=1` 경계, 이등분 영역의 연두색 채움은 모두 문제 조건이다. 이 색칠은 장식이 아니므로 제거하지 않는다. 문제에는 답 `a=4`를 노출하지 않는다. 해설은 이 원본을 그대로 참조해 넓이를 계산할 수 있다.
2. **q08 기존 원본 및 새 해설:** 원본 PNG의 (0,0)→(1,2)→(3,−2)→(4,−1)→(5,k) 꺾은선과 t=2 교차, t=1·3·4·5의 점선을 직접 확인했다. 이전 plan은 원본의 축 숫자들을 모두 비웠고 A(1,2)의 y축까지 불필요하게 수평선을 추가했다. 새 plan은 1·2·3·4·5의 t축 숫자와 2·−1·−2·해설값 −3의 v축 숫자를 `axisTickValues`에 넣고, `ga.axis:"x"`로 t=1의 수직점선만 남겼다. 나머지 g(c,d,e)는 원본의 수평·수직 가이드를 보존한다. 해설에서만 `k=−3`을 표시하고 부호별 면 채움 4개를 유지한다.
3. **q04:** `(x²−1)/(x+1)`의 부호를 [0,2]에서 검토해 `|x−1|`로 줄였다. x=1의 꺾임과 넓이 1/2씩은 `pieces`, `breakpoints`, `regions`에 구현했다.
4. **q05:** `f'(x)=(x−1)(x−2)`와 `f(1)=5/6`, `f(2)=2/3`를 확인했다. 곡선은 x≥0 표시구간만 사용하며 좌표가 실제 `overlays.points`로 표시된다.
5. **q07:** 교점 x=1,4와 `m=4`의 직선 `y=4x−4`, 포물선 `y=x²−x` 사이에서 9/2 영역을 `referenceLines`·`regions`로 구현했다.
6. **q09:** `v(t)=20−4t`, t=5 정지, 0≤t≤5의 면적 50을 선분 및 적분 영역 필드로 표시했다.
7. **q13:** `f(x)=x³/3−2x²`, x=0,6 교점, (4,−32/3) 극소, 아래쪽 영역의 넓이 36을 대조했다.
8. **q14:** `v(t)=−3(t−1)(t−3)`의 t=2 최댓값3 및 t=1,3 방향 전환, 0..1의 음의 면적4, 1..3의 양의 면적4를 각각 보이는 필드로 반영했다.
9. **재검수 q07/q13:** `graphPlan.exactCoordinates`에 V(1/2,−1/4)와 M(4,−32/3)를 넣어 원문 수학값과 좌표 라벨이 정확히 일치하도록 보강했다. q08을 포함한 7개 플랜 공식 shallow/full lint 모두 PASS(두 시험지 합계 11/11).

새 plan에는 **흰색 바탕 채움이나 불필요한 면 채움이 없다**. 새로 적용한 LIGHT 영역은 발문 또는 해설에서 넓이·이동거리 계산의 대상으로 삼는 곳뿐이다. `render/PNG/student/A4=NOT_RUN`이며, 손 SVG 및 JS 미존재 자산 경로 삽입을 하지 않았다.
