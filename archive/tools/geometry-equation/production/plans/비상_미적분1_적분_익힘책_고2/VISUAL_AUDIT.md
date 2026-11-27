# 비상 미적분Ⅰ · 적분 익힘책 · 고2 — 문항/해설 전수 SVG Plan 감사

- 기준 `main`: `bf8281701675e3dda6151d3da88b355655f315ef` (2026-11-27). 대상 JS: `archive/exams/textbooks/비상_미적분1/비상_미적분1_적분_익힘책_고2/비상_미적분1_적분_익힘책_고2.js`, blob `296efc174b7caf3ce7dec29cb9dd10066d48cabc`.
- 같은 JS는 `archive/exams/textbooks/비상교육_미적분1/…`에도 **동일 Git blob**으로 복제되어 있다. 본 감사 분모는 중복을 제외한 24문항/48축이다. 원본 JS·PNG·SVG와 다른 라인에는 변경을 하지 않는다.
- 판정: 실행 가능한 **해설 plan 9개**, 원본 PNG 유지 2축, 엔진 기능 대기 1축, 근거 있는 EXEMPT 36축. 해설 전용 plan은 문제축의 미지 값·정답을 노출하지 않는다.
- 검증: 공식 `plan-lint.cjs`의 **각 plan 명시 경로**에 대해 `--shallow` 9/9 OK 및 full 9/9 OK. `sourceQuote` 9/9 원문 직접 포함, `sourceConditions` 각 mappedTo 구체 필드 확인. `DRAWN_FEATURE_PARITY`는 **실행 가능한 모델 필드↔원문 정보의 정적 1:1 확인**이며 실제 SVG 픽셀/화면 parity PASS가 아니다. 실제 렌더·PNG·학생 화면·A4·게시=NOT_RUN.
- 새 plan에는 루트 흰 배경 채움을 요청하지 않았다. `regions`는 수학적으로 적분하는 넓이/속도 부호 비교에 필요한 영역에만 사용했다. 그림이 없는 계산 문제에는 장식용 색면을 만들지 않는다.

| 파일/qid | 축 | 판정·교육적 근거 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 적분익힘/q01 | 문항 | EXEMPT · 두 부정적분 식이 완결 | — | — | N/A | N/A |
| 적분익힘/q01 | 해설 | EXEMPT · 전개 및 적분상수 계산 | — | — | N/A | N/A |
| 적분익힘/q02 | 문항 | EXEMPT · 미분/적분 순서의 식 | — | — | N/A | N/A |
| 적분익힘/q02 | 해설 | EXEMPT · 연산 역관계 자체가 풀이 | — | — | N/A | N/A |
| 적분익힘/q03 | 문항 | EXEMPT · 주어진 적분구간과 식 | — | — | N/A | N/A |
| 적분익힘/q03 | 해설 | EXEMPT · 대입 및 구간 연결식 | — | — | N/A | N/A |
| 적분익힘/q04 | 문항 | EXEMPT · 미분할 함수 관계가 명시됨 | — | — | N/A | N/A |
| 적분익힘/q04 | 해설 | EXEMPT · 곱의 미분과 수치 대입 | — | — | N/A | N/A |
| 적분익힘/q05 | 문항 | EXEMPT · 극한과 도함수의 식 | — | — | N/A | N/A |
| 적분익힘/q05 | 해설 | EXEMPT · 미분계수 정의·적분상수 | — | — | N/A | N/A |
| 적분익힘/q06 | 문항 | EXEMPT · 적분으로 정의된 함수식 완결 | — | — | N/A | N/A |
| 적분익힘/q06 | 해설 | PLAN_READY · 극대/극소 순서 비교 | `polynomial-spike-v1` | `q06-solution.plan.json` | PASS/PASS | PASS(정적) · f(x) 계수, 극대 1/2, 극소 (1,1/6) |
| 적분익힘/q07 | 문항 | EXEMPT · 근과 계수·적분 경계가 식으로 확정 | — | — | N/A | N/A |
| 적분익힘/q07 | 해설 | EXEMPT · 근의 차를 쓰는 대수 전개 | — | — | N/A | N/A |
| 적분익힘/q08 | 문항 | EXEMPT · 주기 6과 적분값만으로 충분 | — | — | N/A | N/A |
| 적분익힘/q08 | 해설 | EXEMPT · 구간 평행이동 등식 | — | — | N/A | N/A |
| 적분익힘/q09 | 문항 | EXEMPT · 홀함수/상수의 대칭 적분 | — | — | N/A | N/A |
| 적분익힘/q09 | 해설 | EXEMPT · 홀함수 소거는 식으로 검증 | — | — | N/A | N/A |
| 적분익힘/q10 | 문항 | EXEMPT · 미분계수 극한식 | — | — | N/A | N/A |
| 적분익힘/q10 | 해설 | EXEMPT · 합성함수 도함수 계산 | — | — | N/A | N/A |
| 적분익힘/q11 | 문항 | EXEMPT · 삼차함수의 적분·미분 항등식 | — | — | N/A | N/A |
| 적분익힘/q11 | 해설 | EXEMPT · 계수비교만 수행 | — | — | N/A | N/A |
| 적분익힘/q12 | 문항 | EXEMPT · 매개변수 적분 항등식 | — | — | N/A | N/A |
| 적분익힘/q12 | 해설 | EXEMPT · 두 번 미분한 대수식 | — | — | N/A | N/A |
| 적분익힘/q13 | 문항 | EXEMPT · 움직이는 최솟값의 정의·구간 명확 | — | — | N/A | N/A |
| 적분익힘/q13 | 해설 | PLAN_READY · t≤1 및 t≥1 포락 함수 | `piecewise-polynomial-spike-v1` | `q13-solution.plan.json` | PASS/PASS | PASS(정적) · 곡선 2조각, t=1 접합, 부호 영역 3개 |
| 적분익힘/q14 | 문항 | EXEMPT · 두 포물선 식만으로 교점 결정 | — | — | N/A | N/A |
| 적분익힘/q14 | 해설 | PLAN_READY · 위/아래 곡선 확인 | `piecewise-polynomial-spike-v1` | `q14-solution.plan.json` | PASS/PASS | PASS(정적) · 포물선 2개, 교점 1·4, 넓이 영역 |
| 적분익힘/q15 | 문항 | EXEMPT · 삼차함수의 명시된 식 | — | — | N/A | N/A |
| 적분익힘/q15 | 해설 | PLAN_READY · x=1 중근/접함 | `piecewise-polynomial-spike-v1` | `q15-solution.plan.json` | PASS/PASS | PASS(정적) · 0·1 근, 극대 1/3, 넓이 0~1 |
| 적분익힘/q16 | 문항 | EXEMPT · 초기 위치와 속도식 | — | — | N/A | N/A |
| 적분익힘/q16 | 해설 | EXEMPT · 양의 구간 위치변화 적분 | — | — | N/A | N/A |
| 적분익힘/q17 | 문항 | EXEMPT · 계수 a 미지; 답 비노출 | — | — | N/A | N/A |
| 적분익힘/q17 | 해설 | PLAN_READY · a=9 확정 후 면적 | `piecewise-polynomial-spike-v1` | `q17-solution.plan.json` | PASS/PASS | PASS(정적) · 영점 0·2, 꼭짓점 (1,-9), 넓이 12 |
| 적분익힘/q18 | 문항 | KEEP_ORIGINAL · `q18.png`는 y=ax 미지로 유지 | 기존 PNG | — | N/A | 원본 실물 확인 · 원점/포물선/직선/4/색칠 넓이 |
| 적분익힘/q18 | 해설 | PLAN_READY · a=2 해설에서만 표시 | `piecewise-polynomial-spike-v1` | `q18-solution.plan.json` | PASS/PASS | PASS(정적) · 두 함수, 0·2 교점, 넓이 4/3 |
| 적분익힘/q19 | 문항 | EXEMPT · 0<a<b 및 동일 두 넓이 서술 | — | — | N/A | N/A |
| 적분익힘/q19 | 해설 | PLAN_READY · 대표 a=1,b=2를 caption에 명시 | `piecewise-polynomial-spike-v1` | `q19-solution.plan.json` | PASS/PASS | PASS(정적) · 영점 0·1·2, 부호별 두 영역 |
| 적분익힘/q20 | 문항 | KEEP_ORIGINAL · `q20.png`의 -2/0/1 교점과 상하 배치 일치 | 기존 PNG | — | N/A | 원본 실물 확인 · f/g 두 색 곡선·수직 점선·경계 |
| 적분익힘/q20 | 해설 | EXEMPT · 원본 문제 그래프에서 상하 관계 확인, 새 그림은 중복 | — | — | N/A | N/A |
| 적분익힘/q21 | 문항 | EXEMPT · 속도식만으로 거리 계산 가능 | — | — | N/A | N/A |
| 적분익힘/q21 | 해설 | PLAN_READY · 1에서 방향 전환 | `piecewise-polynomial-spike-v1` | `q21-solution.plan.json` | PASS/PASS | PASS(정적) · 속도 곡선, 음/양 두 영역 |
| 적분익힘/q22 | 문항 | EXEMPT · 두 점의 속도식과 출발 원점 | — | — | N/A | N/A |
| 적분익힘/q22 | 해설 | EXEMPT · 두 위치함수 같음 방정식으로 충분 | — | — | N/A | N/A |
| 적분익힘/q23 | 문항 | EXEMPT · 역함수와 정적분구간 명시 | — | — | N/A | N/A |
| 적분익힘/q23 | 해설 | ENGINE_CAPABILITY_PENDING · 역함수 넓이 관계의 독립 도식 필요 | `cubic-inverse-area` 미지원 | — | NOT_RUN | PENDING · cubic x³+1 ↔ ∛(x−1) 및 직사각형 차집합 영역 렌더 기능 필요 |
| 적분익힘/q24 | 문항 | EXEMPT · 미지 a/b 속도 조각 식과 위치조건 | — | — | N/A | N/A |
| 적분익힘/q24 | 해설 | PLAN_READY · 풀이로 정해진 a=6,b=3 | `piecewise-polynomial-spike-v1` | `q24-solution.plan.json` | PASS/PASS | PASS(정적) · t=2 접합, 1~2 음·2~3 양 영역 |

## 고위험 feature parity와 후속 인계

1. `q18.png`: 원본 문제 그림에서 직선 기울기 a의 값을 쓰지 않아야 한다. 해설 plan만 `referenceLines[g]`로 y=2x, 교점 `0,2`, `regions[S]`로 넓이 4/3을 그린다. 면 채움은 실제 적분 영역에 한정한다.
2. `q20.png`: 원본에는 x=-2·0·1에서 수직 점선, 두 서로 다른 곡선 및 위쪽/아래쪽 전환이 이미 있다. 곡선의 수식이 주어지지 않아 숫자를 임의로 채운 허구의 대체 그래프를 생성하지 않는다.
3. `q13`의 g(t)는 `[-1,1]`에서는 f(t), `[1,2]`에서는 -4이며, `pieces`·`breakpoints`가 실제로 곡선을 그린다. 적분값 -4의 구간별 부호는 3개 `regions`에서 드러난다.
4. `q19`: 본질은 축 위에 0,a,b와 같은 넓이이다. `a=1,b=2`는 **해설을 위한 정규화 표본**이고 원문이 a=1이라고 한 것이 아니다. 최종 값은 b/a=2다.
5. `q23`: 현재 `multi-curve-figure-v1`의 `inverseOf`는 삼차의 역인 세제곱근 가지를 지원하지 않고, 원문 기하학적 설명에 필요한 큰 직사각형/작은 직사각형 차집합을 함께 그려야 한다. 필요한 capability: 단조 삼차 곡선 및 역곡선, y=x 대칭, `x=1,2`, `y=2,9` 경계와 두 적분영역의 정확한 면적 합. **캡션만 있는 가짜 plan을 만들지 않았다.** 렌더/게시 담당자가 엔진 확장 뒤 새 플랜과 실제 PNG 1:1 검증을 수행해야 한다.
6. 실제 rendered SVG·PNG·학생 화면·A4 및 JS에 새 image 참조 삽입은 요청된 plan 라인 밖의 후속 작업이다. 현 시점 `NOT_RUN`이며 시각 게시 완료가 아니다.
