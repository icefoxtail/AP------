# VISUAL_AUDIT — 23_강남여고_1학기_기말_고2_수학I_유사

- 대상 JS: `archive/exams/similar/high/h2/1final/23_강남여고_1학기_기말_고2_수학I_유사.js` — **25문항, 문제축 25 + 해설축 25 = 50축**.
- 분류: **REQUIRED 0 / BENEFICIAL 7 / EXEMPT 43**. 현행 유사 JS는 기출 그림에만 있는 숨은 조건 없이 모든 수학적 조건을 텍스트로 명시한다. 그림이 원래 있었다는 사실만으로 REQUIRED 판정하지 않았다.
- 제작 기준: 현행 유사 JS의 `content`, `choices`, `answer`, `solution`. 독립 축마다 아래 근거와 plan 대응을 기록했다.
- 공식 JSON: **7개** (`q06-problem`, `q20-problem`, `q21-problem`, `q21-solution`, `q23-problem`, `q23-solution`, `q25-solution`). 공식 폴더 신규 7개: 레거시 q23을 엄밀 기하 좌표로 교정·편입 1개, 새 설계 6개. 기존 공식 plan 수정·보존 0개.

## 모든 문항의 독립 문제·해설축 판정

| 문항 | 문제축: 판정·근거·공식 plan | 해설축: 판정·근거·공식 plan |
|---|---|---|
| q01 | **EXEMPT** — 두 유한합과 계수 4,3이 수식에 명시; plan 없음 | **EXEMPT** — 합의 선형성으로 50 산출; plan 없음 |
| q02 | **EXEMPT** — 초항 1/27과 공비 3이 수식에 명시; plan 없음 | **EXEMPT** — 지수법칙으로 a₆=9; plan 없음 |
| q03 | **EXEMPT** — 제4·7항으로 공차를 결정; plan 없음 | **EXEMPT** — 공차 4를 계산해 a₁₂=45; plan 없음 |
| q04 | **EXEMPT** — Sₙ=2ⁿ−5의 식만으로 충분; plan 없음 | **EXEMPT** — S₅−S₄=16 계산; plan 없음 |
| q05 | **EXEMPT** — 3배 제곱합의 범위·항이 완전 명시; plan 없음 | **EXEMPT** — 제곱합 공식으로 165; plan 없음 |
| q06 | **BENEFICIAL** — a=BC=8, c=AB=15와 sin(A+C)=1/5를 한 가능한 삼각형에 배치; `q06-problem.plan.json` | **EXEMPT** — sin(A+C)=sin B와 면적 공식으로 12; plan 없음 |
| q07 | **EXEMPT** — 초항 23·공차 −3, 음수 조건으로 충분; plan 없음 | **EXEMPT** — 26−3n<0의 첫 자연수 9; plan 없음 |
| q08 | **EXEMPT** — 외접원 반지름 10·둘레 36은 문자로 완결; plan 없음 | **EXEMPT** — 사인법칙을 세 변에 합산하여 9/5; plan 없음 |
| q09 | **EXEMPT** — 등차·등비 조건 자체는 문자로 완전하지만 상호 모순; 그림으로 교정 불가; plan 없음 | **EXEMPT** — 자연수 해가 없고 인수분해가 잘못됨. 아래 CONTENT_CONFLICT_SOURCE에 반례 기록; plan 없음 |
| q10 | **EXEMPT** — S₅=55, S₉=153이 수식에 명시; plan 없음 | **EXEMPT** — a₃=11,a₅=17,d=3,a₈=26; plan 없음 |
| q11 | **EXEMPT** — 삼각형 AB=6, A=95°, B=40°를 문자로 완전 제공; plan 없음 | **EXEMPT** — C=45°와 사인법칙으로 R=3√2; plan 없음 |
| q12 | **EXEMPT** — 등비 a₄=15, a₂a₃=45를 문자로 제시; plan 없음 | **EXEMPT** — a₁=3, r³=5에서 a₇=75; plan 없음 |
| q13 | **EXEMPT** — 초항·분기별 점화식·n≤25가 모두 명시; plan 없음 | **EXEMPT** — 주기 4의 n=4,8,...,24가 6개; plan 없음 |
| q14 | **EXEMPT** — 초항 2·공차 2·합 범위가 문자로 명시; plan 없음 | **EXEMPT** — Sₖ=k(k+1)과 망원합 14/15; plan 없음 |
| q15 | **EXEMPT** — 두 중첩 유한합을 수식으로 지정; plan 없음 | **EXEMPT** — 내부합 k, n=19; plan 없음 |
| q16 | **EXEMPT** — b≠c와 삼각함수·변 정의가 글로 완결; plan 없음 | **EXEMPT** — 코사인법칙으로 a²=b²+c², A=π/2; plan 없음 |
| q17 | **EXEMPT** — 일반항 −4cos(nπ)와 합 상한을 명시; plan 없음 | **EXEMPT** — 홀수항 모두 4이므로 m=12; plan 없음 |
| q18 | **EXEMPT** — 귀납법 텍스트 빈칸 가·나·다가 완전 제시; plan 없음 | **EXEMPT** — f(2)=1/9, g(3)=13, h(12)=1/13에서 1/9; plan 없음 |
| q19 | **EXEMPT** — 두 인물의 복리 조건·월초·근삿값 모두 제시; plan 없음 | **EXEMPT** — 5,030,000−4,824,000=206,000원; plan 없음 |
| q20 | **BENEFICIAL** — 단위 정사각형 격자와 A₀..Aₙ, 수직 높이2가 삼각형의 구조를 명확히 함; `q20-problem.plan.json` | **EXEMPT** — Sₙ=n으로 연립하여 a=2, b=−4, 2a+b=0; plan 없음 |
| q21 | **BENEFICIAL** — 외접원 O·현 BC·거리 OM=2와 A각·양변비의 배치가 유익; `q21-problem.plan.json` | **BENEFICIAL** — 반지름 R=6, 현 BC=8√2, 높이 관계를 실제 선분으로 표시; `q21-solution.plan.json` |
| q22 | **EXEMPT** — 실수 2,a,b 등비와 두 로그가 수식에 명시; plan 없음 | **EXEMPT** — a=4,b=8로 a+b=12; plan 없음 |
| q23 | **BENEFICIAL** — AB=4, AC=8, A=120°와 각이등분선 AD를 표시; `q23-problem.plan.json` | **BENEFICIAL** — 두 60° 부분삼각형의 넓이 분할과 AD=8/3을 실제 선분에 표기; `q23-solution.plan.json` |
| q24 | **EXEMPT** — 등차항·근호 유한합 조건으로 충분; plan 없음 | **EXEMPT** — 유리화한 망원합에서 n=18; plan 없음 |
| q25 | **EXEMPT** — 사인비 8:7:5와 반각 식이 수식으로 명시; plan 없음 | **BENEFICIAL** — 사인법칙으로 얻은 변의 비 8:7:5를 대표 삼각형에 표시; `q25-solution.plan.json` |

## 근거 자료 비교 및 충돌 분리

1. 기출 JS: `archive/exams/original/high/h2/1final/23_강남여고_1학기_기말_고2_수학I.js`. 기출 PNG는 `archive/assets/images/23_강남여고_1학기_기말_고2_수학I/q21.png`, `q23.png`; 기출 해설 SVG는 `q6-solution.svg`, `q11-solution.svg`, `q20-replacement.svg`, `q20-replacement-solution.svg`, `q20-readable-v3.svg`, `q20-solution-v2.svg`, `q20-quality-v4.svg`, `q21-solution.svg`, `q21-solution-v2.svg`, `q25-solution.svg`. `-v2`, `-v3`, `-v4` 변형은 각자 다른 자료로 대조했다.
2. 직접 연결된 유사 SVG: `archive/assets/images/23_강남여고_1학기_기말_고2_수학I_유사/q23-problem.svg`. 레거시 q23: `archive/exams/similar/high/h2/1final/23_강남여고_1학기_기말_고2_수학I_유사_plans/q23-problem.plan.json`. 기출·유사 SVG와 레거시 폴더는 모두 읽기 대상으로만 사용했다.
3. **ORIGINAL_EXAM_PNG_CONFLICT**: q23 PNG는 `AB=6, AC=12, A=120°`, 현행 유사 q23은 `AB=4, AC=8, A=120°`이다. q21 PNG는 외접원·내접삼각형 배치만 참고하고, 기출 JS의 `cos A=1/4, OM=1`을 현행 유사 `cos A=1/3, OM=2`에 섞지 않았다. 기출 q06은 `a=9,c=12,sin(A+C)=1/6`인 반면 현행 유사에서는 `a=8,c=15,sin(A+C)=1/5`로 바뀌었다.
4. **ORIGINAL_EXAM_SVG_VARIANT_CONFLICT**: q20의 `q20-replacement-solution.svg`에는 `S_n=n/2`, `q20-solution-v2.svg`에는 '높이 1'로 기출 높이 1에 맞춘 예시가 있다. `q20-quality-v4.svg` 및 `q20-readable-v3.svg`에는 A₀..A₄와 C인 기출 n=4 도식이 있다. 그러나 **현행 유사 q20은 높이 2, Sₙ=n**이므로 이 SVG들을 그대로 편입하지 않고 정사각형 격자 n=3의 엄밀 대표 도식을 새로 계획했다. q21의 `q21-solution.svg`는 `R=4, OM=1, cos A=1/4`라고 적어 **현행 유사 `R=6, OM=2, cos A=1/3`과 충돌**한다. `q21-solution-v2.svg`도 기출 관련 변형으로 분리해 확인했고, 현재 JS 기준으로 새 공식 좌표/라벨을 썼다. `q20-replacement.svg` 역시 기출 표본용이다.
5. 레거시 q23의 C 높이 97/14, D 높이 97/42는 120°·AC=8을 **엄밀히** 만족하지 않는 근사 좌표였다. 공식 편입본만 A=(0,0), B=(4,0), C=(−4,4√3), D=(4/3,4√3/3)로 교정하여 AB=4, AC=8, ∠A=120°, AD=8/3, BD:DC=1:2를 독립 SymPy로 확인했다. 레거시 원본은 보존했다.
6. **CONTENT_CONFLICT_SOURCE — q09, 현행 유사 JS 자체의 미해결 수학적 자기모순**: 자연수 `a,b`, `−3,a,b` 등차에서 `b=2a+3`; `a,6,b` 등비에서 `ab=36`. 따라서 `2a²+3a−36=0`, 판별식 **297=9×33은 완전제곱이 아니므로 자연수 해가 없다**. JS 해설의 `(2a+9)(a−4)`는 전개하면 `2a²+a−36`으로 원래 이차식과 다르다. 제시 답 `a=4,b=11`도 `ab=44≠36`이고, 선택지 ② `137`은 조건을 만족하는 정답이 아니다. **시험지 JS는 허용 변경 범위 밖이므로 수정하지 않는다**. 이것은 기출 PNG 또는 엔진 능력 문제와 별개다.
7. **ENGINE_CAPABILITY_PENDING: 없음.** 정사각형 격자는 엔진 `SOURCE_POINT`와 점선 `displaySegments`, 높이·단위길이는 `planeMarks`로 구성했다. 특정 미지원 기능을 임의 근사하지 않았다.

## 독립 수학 검산

- q06 BA=15, BC=8, sin B=1/5인 가능한 예각 B의 정확 좌표로 넓이 12를 확인했다. 예각/둔각 경우를 한 그림으로 독점 주장하지 않았다.
- q20 현행 높이 2에서 Sₙ=n, a=2,b=−4이며 2a+b=0; q21 R=6, OM=2, BC=8√2, CA:AB=2:3, cos A=1/3, 넓이 256√2/9와 a+b=265를 SymPy로 확인했다.
- q23 AB=4, AC=8, ∠A=120°, AD=8/3, 면적 8√3과 이등분 비 BD:DC=1:2를 확인했다. q25 대표 세 변 a:b:c=8:7:5에서 cos A=1/7, p=2를 확인했다.
- 등차/등비 합·점화식·삼각방정식·사인법칙·로그·귀납법·적립금·망원합의 답과 선택지 배열은 각 현행 JS 해설에 대조했다. **q09는 반례가 있으므로 정답/해설 정합성 FAIL(콘텐츠 원문 자체)**이며, 다른 24문항에서 별도 자기모순은 확인되지 않았다.

## 공식 실행형 JSON별 검증

| 검사 | 상태 |
|---|---|
| JSON 파싱 / 공식 Schema·엔진 계약 | 7/7 PASS |
| 공식 Shallow lint | 7/7 PASS |
| 공식 Full lint | 7/7 PASS |
| STATIC_FIELD_PARITY | 7/7 PASS — 유사 JS의 숫자·각·정의역·문항축 및 풀이축 분리 대조 |
| DRAWN_FEATURE_PARITY | 7/7 PASS — 실제 JSON의 점·선·원·각도·높이2·단위 간격·표식 필드에 대한 **정적 구성요소 감사** |
| 실제 SVG 렌더 | **7/7 RENDER_NOT_RUN** — `chromium --version` exit 127, `/usr/lib/chromium/chromium` 부재 |
| 실제 시각 검수 | **NOT_RUN** — 정적 plan 감사와 다름 |

**증거 경계**: 정적 lint와 SymPy 검산은 Chromium SVG 렌더나 실제 출력물의 시각 검수 PASS를 뜻하지 않는다. q09의 JS 콘텐츠 문제는 인접 원본·엔진을 편집하여 우회하지 않았다.
