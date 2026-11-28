# VISUAL_AUDIT — 22_효천고_1학기_기말_고2_수학I_유사

- 대상 JS: `archive/exams/similar/high/h2/1final/22_효천고_1학기_기말_고2_수학I_유사.js` — **25문항, 문제축 25 + 해설축 25 = 50축**.
- 분류: **REQUIRED 0 / BENEFICIAL 8 / EXEMPT 42**. 현행 유사 JS의 모든 시각 조건은 글로 완결되므로 원본 기출에 PNG가 있더라도 REQUIRED로 자동 승격하지 않았다.
- 제작 기준: **현행 유사 JS의 content·choices·answer·solution**. 아래 25개 문항에서 이 네 필드와 원본 자료를 각각 대조하였다. `qNN-problem`은 문제축, `qNN-solution`은 해설축의 독립 plan이다.
- 공식 JSON: **8개** (`q06-problem`, `q12-problem`, `q17-solution`, `q18-solution`, `q21-problem`, `q21-solution`, `q25-problem`, `q25-solution`). 신규 공식 등록 8개: 레거시 q06은 원형 검산·편입 1개, 레거시 q12는 조건을 엄밀히 반영하도록 좌표 교정 후 편입 1개, 순수 새 설계 6개. 원래 공식 폴더/plan은 없었고 수정 0개.

## 모든 문항의 독립 문제·해설축 판정

| 문항 | 문제축: 판정·근거·공식 plan | 해설축: 판정·근거·공식 plan |
|---|---|---|
| q01 | **EXEMPT** — 제2·4항과 등차수열 공차가 문자로 완전 정의; plan 없음 | **EXEMPT** — 공차 3과 a₆=4의 대수 계산만으로 완결; plan 없음 |
| q02 | **EXEMPT** — 초항·공비만으로 일반항 지정; plan 없음 | **EXEMPT** — 2의 거듭제곱 정리로 완결; plan 없음 |
| q03 | **EXEMPT** — 1²부터 10²까지의 합 수식 자체가 충분; plan 없음 | **EXEMPT** — 제곱합 공식 대입으로 완결; plan 없음 |
| q04 | **EXEMPT** — 연속 분수의 패턴이 수식에 명시; plan 없음 | **EXEMPT** — 부분분수 망원합으로 완결; plan 없음 |
| q05 | **EXEMPT** — 7항·첫끝항·등차조건을 문장에 명시; plan 없음 | **EXEMPT** — 중항 성질과 대칭합으로 완결; plan 없음 |
| q06 | **BENEFICIAL** — AB=6, BC=4√2, 끼인각 135°의 실제 배치가 면적 공식 이해를 돕는다; `q06-problem.plan.json` | **EXEMPT** — 정답 12는 두 변과 사인값의 직접 곱셈; plan 없음 |
| q07 | **EXEMPT** — 5개 주기 후보를 모두 함수식으로 전달; plan 없음 | **EXEMPT** — sin·tan·절댓값·배각 주기 비교로 완결; plan 없음 |
| q08 | **EXEMPT** — a,b>0과 최댓값 6이 문자·수식에 명시; plan 없음 | **EXEMPT** — 코사인의 상한 1로 a+b=6을 즉시 얻음; plan 없음 |
| q09 | **EXEMPT** — S₃·S₉ 값이 문자로 명시; plan 없음 | **EXEMPT** — 연립 일차방정식으로 aₙ=4n−10; plan 없음 |
| q10 | **EXEMPT** — 로그 차 조건이 수식으로 명시; plan 없음 | **EXEMPT** — 공비 로그의 차수로 10 계산; plan 없음 |
| q11 | **EXEMPT** — 두 유한합의 모든 항이 수식에 주어짐; plan 없음 | **EXEMPT** — 내부 항을 2k+1로 정리하고 n=12 계산; plan 없음 |
| q12 | **BENEFICIAL** — 원 지름 AB와 원주점 P, AP=5, θ의 관계를 실제 원·선분으로 보인다; `q12-problem.plan.json` | **EXEMPT** — 원주각 직각과 이배각 항등식으로 1/4 계산; plan 없음 |
| q13 | **EXEMPT** — 복리 이율·입금 시점·개월·근삿값을 모두 문자로 제공; plan 없음 | **EXEMPT** — 월초 복리 합 공식으로 7,515,000원; plan 없음 |
| q14 | **EXEMPT** — 귀납법 빈칸 f,g가 완전한 식으로 제시; plan 없음 | **EXEMPT** — g(2)−f(k)=4의 문자식 정리; plan 없음 |
| q15 | **EXEMPT** — 합 Sₙ과 ㄱㄴㄷ 명제가 문자로 주어짐; plan 없음 | **EXEMPT** — 차분과 로그 성질로 ㄴㄷ 판정; plan 없음 |
| q16 | **EXEMPT** — 홀짝 항별 차분·a₁=a₆ 조건이 수식으로 주어짐; plan 없음 | **EXEMPT** — 두 등차부분열로 a₁₇+a₁₈=114; plan 없음 |
| q17 | **EXEMPT** — 사인 방정식과 반열린 정의역이 명시; plan 없음 | **BENEFICIAL** — 여섯 주기 사인곡선과 감소 직선의 교점 수를 검산에 활용; `q17-solution.plan.json` |
| q18 | **EXEMPT** — α·β·γ·δ를 최초 두 교점으로 각각 정의; plan 없음 | **BENEFICIAL** — t=4kx의 한 주기와 y=±a의 순서를 대표 a=1/2로 보인다; `q18-solution.plan.json` |
| q19 | **EXEMPT** — 두 함수와 αₙ<βₙ, 합 1..24가 수식에 명시; plan 없음 | **EXEMPT** — 교점 x=n,n+1과 제곱근 망원합=4; plan 없음 |
| q20 | **EXEMPT** — 초항·구간별 점화식·a₂₃ 조건이 완전 명시; plan 없음 | **EXEMPT** — 정수화한 수열의 최초 주기 2k+1과 k=5 계산; plan 없음 |
| q21 | **BENEFICIAL** — 두 겹친 원·A–O₁–O₂ 및 C–O₂–D 순서·θ₁₂₃의 위치가 복잡해 도식이 유익; `q21-problem.plan.json` | **BENEFICIAL** — 코사인법칙으로 얻은 반지름·CO₂를 실제 선분에 표시; `q21-solution.plan.json` |
| q22 | **EXEMPT** — S₃,S₆로 등비수열 일반항 구하도록 문자 명시; plan 없음 | **EXEMPT** — r³=8, a₁=3 정리만으로 완결; plan 없음 |
| q23 | **EXEMPT** — Sₙ=n²+3n, 유한가중합이 명시; plan 없음 | **EXEMPT** — aₖ=2k+2와 합 공식으로 880; plan 없음 |
| q24 | **EXEMPT** — 삼각지수부등식과 0≤x<2π를 완전 명시; plan 없음 | **EXEMPT** — t=cos x, 이차부등식 해석으로 구간 얻음; plan 없음 |
| q25 | **BENEFICIAL** — 원내접 사각형 ABCD와 두 연장선 교점 E·길이·θ를 한 배치로 확인; `q25-problem.plan.json` | **BENEFICIAL** — 대각선 BD·∠BCD=120°·닮음으로 얻은 CD, ED를 실제 도형에 표기; `q25-solution.plan.json` |

## 근거 자료 비교 및 충돌 분리

1. 기출 JS: `archive/exams/original/high/h2/1final/22_효천고_1학기_기말_고2_수학I.js`. 기출 PNG: `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q06.png`, `q08.png`, `q12.png`, `q18.png`, `q21.png`, `q25.png`. 기출 해설 SVG: `q6-solution.svg`, `q12-solution.svg`, `q17-solution.svg`, `q18-solution.svg`, `q19-solution.svg`, `q21-solution-v2.svg`, `q24-solution.svg`, `q25-solution-v2.svg`. 파일 유무 및 도형 구조·텍스트를 대조했다. 번호가 붙은 SVG 변형은 같은 원본으로 덮어쓰지 않았다.
2. 직접 연결된 유사 SVG: `archive/assets/images/22_효천고_1학기_기말_고2_수학I_유사/q06-problem.svg`, `q12-problem.svg`. 레거시 JSON: `archive/exams/similar/high/h2/1final/22_효천고_1학기_기말_고2_수학I_유사_plans/q06-problem.plan.json`, `q12-problem.plan.json`. 원본 레거시 파일·원본 SVG에는 손대지 않았다.
3. **ORIGINAL_EXAM_PNG_CONFLICT**: q06 PNG는 AB=8·BC=2√2·∠B=135°, 현행 유사 JS는 AB=6·BC=4√2·∠B=135°이다. q12 PNG는 지름 4√5·AP=7, 현행 JS는 2√10·AP=5이다. q18 PNG의 함수는 `sin(3kx)`, 현행 JS는 `sin(4kx)`이고 최초 두 위·아래 수평선 교점 문제로 서술한다. q25 기출 JS는 AB=BC=2·AD=3이며 현행 유사는 AB=BC=3·AD=5; PNG는 원내접·연장선 도형의 배치 참고만 한다. q21 기출 JS의 AB 등 수치 또한 현행 유사 JS와 다르므로 기출 PNG의 배치만 참고하고 수치는 유사 JS를 우선한다.
4. **ORIGINAL_EXAM_SVG_VARIANT_CONFLICT**: `q21-solution-v2.svg`와 `q25-solution-v2.svg`는 대응 기출의 도형 관계 확인용이며 현행 유사의 변경 수치가 보장된 공식 plan으로 간주하지 않았다. `q17-solution.svg`, `q18-solution.svg`는 교점 관계, `q19-solution.svg`, `q24-solution.svg`는 설명 보조자료로 대조하되 현행 q17(구간 0..12, 기출 0..10)·q18(4kx, 기출 3kx)의 차이를 유지했다.
5. 공식 엔진 대상은 `production/plans/22_효천고_1학기_기말_고2_수학I_유사/`이다. 레거시 q06 좌표는 AB=6, BC=4√2, ∠B=135°를 정확히 만족했다. 레거시 q12는 예전 좌표 AB=50, AP=40이라 **원문 비율 5/(2√10)과 달라서** 공식 편입본만 O=(0,0), A=(−√10,0), B=(√10,0), P=(√10/4,5√6/4)로 교정했다. 이에 따라 실제 AB=2√10, AP=5, OP=√10, ∠APB=90°를 독립 SymPy로 확인했다.
6. `CONTENT_CONFLICT_SOURCE`: 현행 효천고 25문항에서 별도 자기모순을 확인하지 않았다. **ENGINE_CAPABILITY_PENDING: 없음.** 관련 없는 기능 요청을 이 시험지에 이식하지 않았다.

## 독립 수학 검산

- q06 넓이 12, q12 cos(2θ)=1/4, q17 사인·직선의 반열린 구간 내 서로 다른 교점 6개(120,000 분할 교차검산), q18 네 교점의 변환 각도 합 4π 및 최대 k=3을 확인했다.
- q19 (x−n)²=x−n의 두 근 n,n+1과 망원합 4, q20 최초 복귀 이동 2k+1·22의 홀수 약수 11→k=5를 재검산했다.
- q21 공통 반지름 3, AB=2, O₁D=4√2, CO₂=14/3, CD=23/3와 C–O₂–D 공선성을 SymPy로 재계산했다.
- q25 동일 원의 반지름 √57/3에 A,B,C,D 네 점이 있고 AB=BC=3, AD=5, CD=2, ED=38/5, cos∠BAD=1/2, sin∠AEB=5√3/38을 독립 확인했다.
- 그 밖의 등차·등비·로그·복리·귀납법·유한합·삼각부등식 답과 선택지 순서를 각 현행 JS 해설에 대조했다. 해설축 정적 증거는 수학적 검산이지 실제 렌더 검수를 뜻하지 않는다.

## 공식 실행형 JSON별 검증

| 검사 | 상태 |
|---|---|
| JSON 파싱 / 공식 Schema·엔진 계약 | 8/8 PASS |
| 공식 Shallow lint | 8/8 PASS |
| 공식 Full lint | 8/8 PASS |
| STATIC_FIELD_PARITY | 8/8 PASS — 문항 원문·문제/해설축 분리·길이·각·정의역·캡션 대응 |
| DRAWN_FEATURE_PARITY | 8/8 PASS — 정적 구성요소의 `displaySegments`, `displayCircles`, `planeMarks.angles`, `expressionLabels`, 등길이/선분 표식을 계획값과 대조 |
| 실제 SVG 렌더 | **8/8 RENDER_NOT_RUN** — `chromium --version` exit 127, `/usr/lib/chromium/chromium` 부재 |
| 실제 시각 검수 | **NOT_RUN** — 위 정적 PASS와 구별 |

**증거 경계**: JSON·공식 Shallow/Full lint는 실제 Chrome 기반 SVG 렌더 및 캡처 검증이 아니다. 원본 기출·레거시·직접 연결 유사 SVG는 읽기/비교 대상으로만 사용하였으며 어떤 손 SVG도 생성·수정하지 않았다.
