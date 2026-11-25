# SVG 제작용 plan 및 DRAWN_FEATURE_PARITY — 25 효천고 2학기 기말 고1 유사3 Q01–Q12

- 출처: `archive/exams/similar/high/h1/2final/25_효천고_2학기_기말_고1_유사3.js`
- 원본 SHA-256: `29ff15c566b1f26d80d0cb7f2ececa4b7eb3b4a4ebe5871f079e04815f47a125`; Git blob: `933f62f54ab1a5f3408b58dc7ae3c2c9e0628f3a`.
- 범위: Q01–Q12, 문제 12축·해설 12축 = **24축**. REQUIRED 0, BENEFICIAL 6, EXEMPT 18. 제작용 JSON **6개**.
- `sourceVsPlan=REVIEWED`(6건); `DRAWN_FEATURE_PARITY=PASS`(6건); `ENGINE_CAPABILITY_PENDING=0`. EXEMPT 18축은 사유를 문항별로 남겼으며 plan 분모에 넣지 않음.
- 검사: `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <6 plans>` 및 full `--jobs 2 <6 plans>`: 각각 6/6 OK, FAIL 0, SKIP 0(배치 17개 합산 검사에서 확인).
- 실제 SVG·PNG 렌더, 학생 화면, A4 인쇄, JS `solutionImage` 실물 재연결·배포 검사는 **NOT_RUN**. 기존 JS의 그림 참조는 수정하지 않음.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY · 개별 사유 |
|---|---|---|---|---|---|---|
| 효천고 유사3/Q01 | 문제 | EXEMPT | — | — | — | EXEMPT — 명제·조건 문장 식별로 완결 |
| 효천고 유사3/Q01 | 해설 | EXEMPT | — | — | — | EXEMPT — 약수 반례와 명제 판별만 필요 |
| 효천고 유사3/Q02 | 문제 | EXEMPT | — | — | — | EXEMPT — 유한 정의역 함수값의 대수적 일치 |
| 효천고 유사3/Q02 | 해설 | EXEMPT | — | — | — | EXEMPT — 두 입력값 대입과 연립계산 |
| 효천고 유사3/Q03 | 문제 | EXEMPT | — | — | — | EXEMPT — 조각함수·이차함수의 합성값 계산 |
| 효천고 유사3/Q03 | 해설 | EXEMPT | — | — | — | EXEMPT — 음수·양수 분기에 대입하는 순차계산 |
| 효천고 유사3/Q04 | 문제 | EXEMPT | — | — | — | EXEMPT — 역함수 통과점과 일차함수식만 제시 |
| 효천고 유사3/Q04 | 해설 | EXEMPT | — | — | — | EXEMPT — f(4)=5와 f(k)=7의 계산 |
| 효천고 유사3/Q05 | 문제 | EXEMPT | — | — | — | EXEMPT — 연속 분수의 소거 계산 |
| 효천고 유사3/Q05 | 해설 | EXEMPT | — | — | — | EXEMPT — 부분분수 소거가 도식 없이 완결 |
| 효천고 유사3/Q06 | 문제 | EXEMPT | — | — | — | EXEMPT — P−Q=∅, Qᶜ∪R=U를 기호로 모두 제시 |
| 효천고 유사3/Q06 | 해설 | BENEFICIAL | `set-diagram-figure-v1` | `q06-solution.plan.json` | PASS/PASS | PASS — 중첩된 P⊆Q⊆R의 실제 세 겹 경계 |
| 효천고 유사3/Q07 | 문제 | EXEMPT | — | — | — | EXEMPT — 필요충분조건 명제 세 가지가 수식으로 완결 |
| 효천고 유사3/Q07 | 해설 | BENEFICIAL | `set-diagram-figure-v1` | `q07-solution.plan.json` | PASS/PASS | PASS — ㄱ·ㄴ·ㄷ 조건의 반례별 P/Q 소속 표시 |
| 효천고 유사3/Q08 | 문제 | EXEMPT | — | — | — | EXEMPT — 선택지 자체가 그래프 개형·이동·절편을 평가하여 정답 단서 방지 |
| 효천고 유사3/Q08 | 해설 | BENEFICIAL | `multi-curve-figure-v1` | `q08-solution.plan.json` | PASS/PASS | PASS — 왼쪽으로 열린 두 √ 그래프와 (2,−1), (3/2,0) |
| 효천고 유사3/Q09 | 문제 | EXEMPT | — | — | — | EXEMPT — 정수 함수방정식의 대입 조건 |
| 효천고 유사3/Q09 | 해설 | EXEMPT | — | — | — | EXEMPT — f(0)=0과 f(3)+f(−3)=36의 계산 |
| 효천고 유사3/Q10 | 문제 | EXEMPT | — | — | — | EXEMPT — 나머지 함수가 주어져 있고 반복경로를 먼저 보이면 답 노출 |
| 효천고 유사3/Q10 | 해설 | BENEFICIAL | `set-diagram-figure-v1` | `q10-solution.plan.json` | PASS/PASS | PASS — 1→5→4→6→2→3→1, 6개 화살표와 4·5단계 강조 |
| 효천고 유사3/Q11 | 문제 | EXEMPT | — | — | — | EXEMPT — 역함수 조건과 교점 좌표만 제시해 그래프는 풀이 단계 |
| 효천고 유사3/Q11 | 해설 | BENEFICIAL | `multi-curve-figure-v1` | `q11-solution.plan.json` | PASS/PASS | PASS — f, f⁻¹, y=x와 (0,2),(2,0),(4,4) |
| 효천고 유사3/Q12 | 문제 | EXEMPT | — | — | — | EXEMPT — 대칭축 두 직선의 교점을 그리면 미지 중심 노출 |
| 효천고 유사3/Q12 | 해설 | BENEFICIAL | `multi-curve-figure-v1` | `q12-solution.plan.json` | PASS/PASS | PASS — 점근선 x=3,y=1, 중심 C(3,1), 기울기 ±1 대칭축 |

## 원문 ↔ 실제 그리기 필드 대조

1. **Q06 해설:** `diagram.kind=VENN`, `diagram.subset=["P","Q","R"]`. `P-Q=∅`와 `Qᶜ∪R=U`에서 유도되는 순서 `P⊆Q⊆R`를 원 경계로 표시; 색칠 없음.
2. **Q07 해설:** `diagram.kind=MEMBERSHIP_TABLE`; ㄱ의 (0,0)과 비영점, ㄴ의 (1,−1) `P only`, ㄷ의 (3,−1) `Q only`를 각각 `elements[].in`으로 검사. 설명문만 아니라 표 칸으로 표시.
3. **Q08 해설:** `graphPlan.curves[g,f]`에서 `g=√(−2x)`, `f=√(4−2x)−1`, 왼쪽 정의역 범위; `overlays.points[Z,S]`가 각각 `(3/2,0)`, `(2,−1)`. 제3사분면에 점을 찍지 않음.
4. **Q10 해설:** `diagram.arrows` 6개는 `f(n)=5n mod 7`의 `1→5,2→3,3→1,4→6,5→4,6→2`와 전수 일치. `highlight.arrows`가 `1→5→4→6→2→3` 다섯 단계를 표시.
5. **Q11 해설:** `f(x)=√(2x+1)+1`, `f⁻¹(x)=x²/2−x (x≥1)`, `y=x`를 `curves`에 별도로 놓고 `overlays.points`에 `(0,2)`, `(2,0)`, `(4,4)`를 표시. 역함수 자동 생성이 현재 계수 형태를 지원하지 않아 수학적으로 동치인 이차곡선 반쪽을 공식 capability로 사용.
6. **Q12 해설:** `RATIONAL` 분자 `[7,1]`·분모 `[-3,1]`에서 점근선 `x=3,y=1`; 대칭축 `LINE[-2,1]`, `LINE[4,-1]`; `overlays.points[C]=(3,1)`을 실제 점으로 표시.

### 공통 정책

- 문제용 plan 미지 정답·선택지 번호 비노출. 제작용 SVG 파일이나 JS 가짜 `image` 참조를 만들지 않음.
- `fill`·`regions` 사용 없음. 축 텍스트와 수학적 요소는 `sourceConditions[].mappedTo`의 실재 필드에 연결.
- 수치·원소 소속·곡선 구간·선형식·점근선·마커를 원문과 재계산하여 `sourceVsPlan=REVIEWED`로 판정; lint PASS를 실물 렌더 PASS로 대체하지 않음.
