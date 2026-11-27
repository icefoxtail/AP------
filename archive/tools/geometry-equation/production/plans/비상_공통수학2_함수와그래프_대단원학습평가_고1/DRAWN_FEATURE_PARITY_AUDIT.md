# DRAWN_FEATURE_PARITY 전수 검수 — 비상 공통수학2 함수와 그래프 대단원 학습 평가

- 원문: `archive/exams/textbooks/비상교육_공통수학2/비상_공통수학2_함수와그래프_대단원학습평가_고1.js`, **17문항 × 발문·해설 34축**.
- 원본 문항 PNG 네 장: `q02_bijection-graph-choices.png`, `q05_composition-mappings.png`, `q06_inverse-functions-graph.png`, `q17_radical-function-graph.png`. 해당 JS 문항들의 해설 SVG·해설 PNG는 **0건**. 텍스트 문항에 없는 기하를 원본 그림인 양 추가하지 않는다.
- 이 디렉터리의 실행형 플랜 **16개** 모두 `plan-lint.cjs --shallow` 및 full OK. 원본 ②·⑥·⑰의 그림은 정확한 수식이 없는 **개형**이므로 예시 수치는 실제 발문 데이터가 아님을 명시했다. 독립 플랜을 모아도 원본 5지선다 한 장으로 렌더되는 기능이 없거나 기호축을 직접 쓰지 못하는 곳은 **ENGINE_CAPABILITY_PENDING**으로 남긴다.
- 원본 이미지 에셋을 확대 대조해 실선·점선·격자·원소·화살표·교점·함수 라벨을 세었다. 표의 `조건일치`는 소스 조건과 그려지는 특징의 수학적 일치를 의미한다. **원본 이미지 전 요소를 가린다거나 흰 배경 제거까지 끝냈다는 뜻이 아니다.**

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY: 원문에 소유된 특징 |
|---|---|---|---|---|---|---|
| `함수와그래프`/01 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | f(x)=x²−2x와 g(x)=ax+b가 정의역 {1,2}에서 같다는 두 수식 조건. |
| `함수와그래프`/01 | 해설 | EXEMPT_TEXT_ONLY | — | — | — | (1,-1),(2,0)의 두 함수값을 연립해 a=1,b=-2로 도출; 그림 원본 없음. |
| `함수와그래프`/02 | 문항 | ENGINE_CAPABILITY_PENDING | `polynomial-spike-v1`, `piecewise-polynomial-spike-v1` ×3, `stat-chart-figure-v1` | `q02-option01-problem.plan.json`, `q02-option02-problem.plan.json`, `q02-option03-problem.plan.json`, `q02-option04-problem.plan.json`, `q02-option05-problem.plan.json` | 다섯 파일 모두 OK/OK | **개별 도형 조건일치/통합 1:1 미달**: ① 아래 포물선, ② 원점 V, ③ 격자 점 네 개(두 점이 같은 높이), ④ x축 위 수평선, ⑤ y축 아래 꺾이는 단조 증가 두 직선. 원본은 5패널 2+2+1 배열·①~⑤ 번호. 각 그래프 계수/눈금은 원본에 없으므로 대표 개형, 통합 패널·수치 비표시 대기. ③은 stat 엔진 강제 흰 바탕. |
| `함수와그래프`/02 | 해설 | PLAN_REUSES_PROBLEM | 위 5개 | 위 다섯 플랜 재사용 | OK/OK | ①·② 두 입력이 같은 y, ③ y높이 중복, ④ 상수, ⑤ 전 실수 일대일대응을 비교. 원본 해설에 별도 도형 없음; ⑤가 답임을 발문용 플랜에 표시하지 않음. |
| `함수와그래프`/03 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | f∘g=g∘f인 일차함수 대입식. |
| `함수와그래프`/03 | 해설 | EXEMPT_TEXT_ONLY | — | — | — | 각 합성의 상수항을 비교해 a=2. |
| `함수와그래프`/04 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | f=3x−1, g=x²+2의 합성과 f의 역함수 계산. |
| `함수와그래프`/04 | 해설 | EXEMPT_TEXT_ONLY | — | — | — | f∘g=3x²+5, f⁻¹=(x+1)/3 전개. |
| `함수와그래프`/05 | 문항 | ENGINE_CAPABILITY_PENDING | `set-diagram-figure-v1` | `q05-problem.plan.json` | OK/OK | **조건일치/배경대기**: X={1,3,5} 세 타원, f:1→3,3→5,5→1; g:1→5,3→3,5→1, 여섯 화살표와 f/g 라벨. 타원 및 전체 흰 배경은 엔진 강제. |
| `함수와그래프`/05 | 해설 | ENGINE_CAPABILITY_PENDING | `set-diagram-figure-v1` | `q05-solution-composition.plan.json` | OK/OK | **조건일치/배경대기**: f→g⁻¹→f 네 열로 분리하고 3→5→1→3을 강조, 역읽기 방향 보완. 원본 별도 해설 이미지 없음. |
| `함수와그래프`/06 | 문항 | ENGINE_CAPABILITY_PENDING | **미지원:** `symbolic-multi-curve-guide-projections-v1` | — | 대상 없음 | **원본 1:1 미달**: y=f(x) 볼록 상승 가지, y=g(x) 오목 상승 가지, y=x 대각선 3선, 원점, x/y축 a,b,c,d,e 기호 눈금, 가로·세로 점선 투영, f/g 라벨, 세 곡선 교점 e. 계수·문자값 미제공으로 수치 고정 금지. |
| `함수와그래프`/06 | 해설 | ENGINE_CAPABILITY_PENDING | 위와 동일 | — | 대상 없음 | **원본 1:1 미달**: 그림의 점선으로 f⁻¹(b)=c, g⁻¹(c)=b, (f∘g)⁻¹(b)=b를 추적해야 한다. 도식의 모든 기호 눈금·보조선 없이는 검수 통과 아님. |
| `함수와그래프`/07 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | 유리식 덧셈·뺄셈 대수 연산만 있음. |
| `함수와그래프`/07 | 해설 | EXEMPT_TEXT_ONLY | — | — | — | 인수분해·통분·원식 정의역에서의 약분, 그래프 원본 없음. |
| `함수와그래프`/08 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | (2,-2) 대칭 중심 및 f(3)=4b를 글로 제시. |
| `함수와그래프`/08 | 해설 | PLAN_READY | `rational-spike-v1` | `q08-solution.plan.json` | OK/OK | **조건일치**: x=2·y=-2 점선 점근선의 교점은 (2,-2), f=(-2x−2)/(x−2), 점 (3,-8); 색칠 없음. 원본 별도 해설 그림 없음. |
| `함수와그래프`/09 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | y=√(-5x+a)-2, 정의역 [-8,0] 및 최솟값 1을 텍스트로 제시. |
| `함수와그래프`/09 | 해설 | PLAN_READY | `sqrt-affine-spike-v1` | `q09-solution.plan.json` | OK/OK | **조건일치**: a=9, 감소하는 닫힌 가지, 양 끝 (-8,5),(0,1)에 점·좌표 라벨, 불필요한 채움 없음. |
| `함수와그래프`/10 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | y=-√(4x+3)의 평행이동과 x축 대칭을 문장으로 제시. |
| `함수와그래프`/10 | 해설 | PLAN_READY | `sqrt-affine-spike-v1` | `q10-solution.plan.json` | OK/OK | **조건일치**: 결과 y=√(4x−1)-2, 시작 (1/4,-2), x절편 (5/4,0), 오른쪽으로 증가, 면색 없음. 중간 이동 2단계는 식으로 확인. |
| `함수와그래프`/11 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | y=√(3x+4)-1의 성질을 묻는 다섯 문장, 원본 이미지 없음. |
| `함수와그래프`/11 | 해설 | PLAN_READY | `sqrt-affine-spike-v1` | `q11-solution.plan.json` | OK/OK | **조건일치**: 시작 (-4/3,-1), x절편 (-1,0), y절편 (0,1), 제Ⅰ·Ⅱ·Ⅲ사분면만 통과, 도메인·치역 관계 보존. |
| `함수와그래프`/12 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | 1~9의 양수 약수 개수로 정의된 함수, 원본 도형 없음. |
| `함수와그래프`/12 | 해설 | EXEMPT_TEXT_ONLY | — | — | 1↦1, 2/3/5/7↦2, 4/9↦3, 6/8↦4를 수식·열거로 완전 제시. 9개 원소의 단일 열 대응도는 현재 엔진 상한 8로 지원하지 않지만 원문에도 그림이 없고 독해에 불필요함. |
| `함수와그래프`/13 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | f(x)=|x+1|+ax−2가 일대일대응인 a 범위 질문. |
| `함수와그래프`/13 | 해설 | PLAN_READY_EXAMPLES | `piecewise-polynomial-spike-v1` ×2 | `q13-solution-example.plan.json`, `q13-solution-negative-example.plan.json` | OK/OK | **조건일치/대표값**: 꺾임 x=-1, 증가 a=2의 두 양의 기울기 1·3 및 감소 a=-2의 음의 기울기 -3·-1을 개별 렌더. a>1 또는 a<-1을 각각 예시로 검증. 모든 실수 a의 좌표를 지정한 것은 아님. |
| `함수와그래프`/14 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | (f∘g)(1)=-3 등 합성 조건. |
| `함수와그래프`/14 | 해설 | EXEMPT_TEXT_ONLY | — | — | — | a=2, f⁻¹(1)=0, (g∘f⁻¹)(1)=-1, 대수로 충분. |
| `함수와그래프`/15 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | 80 km/h 0.5시간, 60 km/h x시간의 두 구간 상황. 원본 경로 그림 없음. |
| `함수와그래프`/15 | 해설 | EXEMPT_TEXT_ONLY | — | — | 거리 40+60x, 시간 0.5+x의 비를 계산해 y=(40+60x)/(0.5+x). |
| `함수와그래프`/16 | 문항 | EXEMPT_TEXT_ONLY | — | — | f(x)=√(2x-a)+b, 최솟값 5, 역함숫값 조건 텍스트. |
| `함수와그래프`/16 | 해설 | PLAN_READY | `sqrt-affine-spike-v1` | `q16-solution.plan.json` | OK/OK | **조건일치**: a=-4,b=5, 시작 (-2,5), 역함수 조건 f(0)=7의 점 (0,7), 증가 근호 가지·미채움. |
| `함수와그래프`/17 | 문항 | ENGINE_CAPABILITY_PENDING | `sqrt-affine-spike-v1`의 정성 예시 + **미지원: symbolic-radical-endpoint-guides-v1** | `q17-problem-example.plan.json` | OK/OK | **부분일치/원본 1:1 미달**: a>0,b<0,c>0에 부합하는 예시 a=2,b=-2,c=1의 시작점 (2,1), 오른쪽 증가 가지. 원본은 문자계수만 있고 **x=-b, y=c를 축에 투영하는 수평·수직 점선과 문자 라벨**이 필수인데 현재 예시 플랜은 이를 재현하지 못함. |
| `함수와그래프`/17 | 해설 | ENGINE_CAPABILITY_PENDING | `rational-spike-v1`의 정성 예시 | `q17-solution-example.plan.json` | OK/OK | **조건일치/상징적 1:1 미달**: a>0,b<0,c>0의 예시 y=2/(x−2)−1에서 x=-b>0, y=-c<0 점근선 두 개와 제Ⅱ사분면을 지나지 않는 가지를 확인. 계수 미제공, 원본 해설 그림 없음. |

## ENGINE_CAPABILITY_PENDING — 필요한 기능

1. **`composite-panels-v1`에서 서로 다른 그래프 family 5종을 한 번에 배치하는 2×2+1 보기 레이아웃 및 보기 번호 바인딩**: q02 원본의 포물선, 절댓값, 이산 격자 점, 상수직선, 꺾인 단조 선형함수를 하나의 비교지면으로 생성해야 한다. 각각 실제 렌더 가능한 JSON 5개는 준비했지만, 서로 다른 `polynomial`·`piecewise-polynomial`·`SCATTER`를 섞는 5패널 통합은 계약에서 거절된다. 입력에 없는 계숫값과 눈금 글자는 숨기고 관계만 그리는 정성 그래프 모드가 필요하다. stat 산점도는 `production/stat-chart-v1.mjs`에서 흰 배경을 삽입한다.
2. **`symbolic-multi-curve-guide-projections-v1`**: q06의 두 미지 함수 f,g와 y=x를 한 판에 그리고, a,b,c,d,e라는 축 눈금 기호·가로/세로 점선·교차를 지정 수치 없이 연계해야 한다. 임의의 실제 함수식을 붙이면 정확한 원본 재현이 아니므로 플랜을 만들지 않았다.
3. **`sqrt-affine-spike-v1`의 `symbolicEndpointLabels`·`endpointProjectionGuides`**: q17의 시작점 (-b,c)을 문자로 표시하고 x/y축까지 각각 점선 지시선을 그려야 한다. 임의 계수 예시는 수학적 부호만 재현한다. 같은 문항의 유리함수 해설도 수치가 아니라 점근선 기호 `x=-b`, `y=-c`로 표시하는 기능이 있어야 정확한 문자 플랜이 된다.
4. **`set-diagram-figure-v1`의 배경·타원 무채움**: q05의 두 플랜은 전체 흰 `<rect>` 및 타원 `fill="#fff"` 강제 출력이 남는다. q02의 산점도도 흰 배경 강제. 엔진/에셋은 담당 범위 밖이므로 바꾸지 않았다.
5. 이 문서는 **문항·해설 양축 전수 감수 결과**이며 `plan-lint`와 `DRAWN_FEATURE_PARITY`를 혼동하지 않는다. 발문용 원본 PNG는 손대지 않았고, 엔진 지원 후 각 PNG와 최종 결과의 누락 표식·라벨·겹침·배경을 다시 대조해야 완전한 1:1이다.
