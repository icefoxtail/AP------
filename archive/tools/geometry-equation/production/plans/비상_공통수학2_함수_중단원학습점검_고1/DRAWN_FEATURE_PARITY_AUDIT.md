# DRAWN_FEATURE_PARITY 전수 검수 — 비상 공통수학2 함수 중단원 학습 점검

- 원문: `archive/exams/textbooks/비상교육_공통수학2/비상_공통수학2_함수_중단원학습점검_고1.js` — 12문항 × 발문/해설 = **24축**.
- 원본 문항 PNG: `q01_function-mapping.png`, `q07_composition-mappings.png`, `q10_inverse-function-graph.png` **3장**. 원문 JS에 해설 SVG·해설 PNG·손 SVG는 **없음**. 나머지 9문항 발문은 텍스트 수식이다.
- 이 폴더의 실행형 JSON **7개**는 `plan-lint.cjs --shallow`와 full 렌더/관측기 모두 OK(아래 표). 기하 도형 면 채움은 지시하지 않았다. 다만 대응도 엔진은 `<rect fill="#fff">`와 타원 `fill="#fff"`를 강제로 삽입하므로 흰색 배경/타원 무채움 **최종 통과가 아니다**.
- 표의 `PARITY-조건일치`는 기입한 수학 관계를 원문·원본 PNG와 대조했다는 뜻이고, **최종 SVG의 원본 픽셀/도형 1:1 인증과 다르다**. `조건일치/엔진대기`는 잔존 기능을 명시한다.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY: 원본 대비 실제 그려질 요소 |
|---|---|---|---|---|---|---|
| `함수`/01 | 문항 | ENGINE_CAPABILITY_PENDING | `set-diagram-figure-v1` | `q01-problem.plan.json` | OK/OK | **조건일치/배경대기**: X[-1,0,1,2], Y[0,1,2,3], 화살표 -1→1, 0→0, 1→1, 2→3, 미도달 Y=2. 원본의 파란 화살표는 이름 없는 화살표에 색만 지정하는 엔진 API가 없어 기본 검정으로 남음. |
| `함수`/01 | 해설 | ENGINE_CAPABILITY_PENDING | `set-diagram-figure-v1` | `q01-solution.plan.json` | OK/OK | **조건일치/배경대기**: 같은 네 대응을 유지하고 치역 Y의 0,1,3만 원소 강조. 원문 해설에 별도 이미지가 없음. |
| `함수`/02 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | 일대일·항등·상수 함수의 네 식 ㄱ~ㄹ만 제시, 원본 그림 없음. |
| `함수`/02 | 해설 | EXEMPT_TEXT_ONLY | — | — | — | ㄴ, ㄷ 일대일, ㄴ 항등, ㄱ 상수: 정의에 따른 문자·식 판별. |
| `함수`/03 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | 두 함수의 합성 계산식, 시각 조건 없음. |
| `함수`/03 | 해설 | EXEMPT_TEXT_ONLY | — | — | — | f∘f, g∘g, f∘g, g∘f 대입·전개 네 단계. |
| `함수`/04 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | 두 일차식의 역함수 계산, 원본 도형 없음. |
| `함수`/04 | 해설 | EXEMPT_TEXT_ONLY | — | — | — | 5x+2 ↔ (x-2)/5, -x/3+6 ↔ -3x+18 대수 풀이. |
| `함수`/05 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | x<0, x≥0 조각 식과 일대일대응 조건을 텍스트로 제시. |
| `함수`/05 | 해설 | PLAN_READY_EXAMPLE | `piecewise-polynomial-spike-v1` | `q05-solution-example.plan.json` | OK/OK | **조건일치/예시**: x=0의 연속점 (0,-1), 오른쪽 기울기 3, 왼쪽 기울기 a+2>0. a=0을 명시한 대표 사례로 전 구간 증가·미채움을 렌더; 모든 a>-2를 단일 고정 그래프라고 주장하지 않음. |
| `함수`/06 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | 합성식 g∘f, f∘g, h만 존재. |
| `함수`/06 | 해설 | EXEMPT_TEXT_ONLY | — | — | — | 치환으로 f(x)=2x+3 또는 2x+5, 도형 추론 없음. |
| `함수`/07 | 문항 | ENGINE_CAPABILITY_PENDING | `set-diagram-figure-v1` | `q07-problem.plan.json` | OK/OK | **조건일치/배경대기**: X→X→X 세 타원, f:2→4,3→2,4→3과 g:2→2,3→4,4→3, 원본 여섯 화살표·f/g 라벨을 모두 재구성. |
| `함수`/07 | 해설 | ENGINE_CAPABILITY_PENDING | `set-diagram-figure-v1` | `q07-solution-composition.plan.json` | OK/OK | **조건일치/배경대기**: g 다음 f 순서의 세 열로 바꾸어 3→4→3 경로 강조. 원문 해설의 합성 순서를 재현; 역함수 연쇄는 텍스트로 유지. |
| `함수`/08 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | f(x)=ax+b 및 두 함수값 조건. |
| `함수`/08 | 해설 | EXEMPT_TEXT_ONLY | — | — | — | a+b=2, 2a+b=3의 연립식. |
| `함수`/09 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | f⁻¹∘g의 값 조건만 주어진 대수 문항. |
| `함수`/09 | 해설 | EXEMPT_TEXT_ONLY | — | — | — | g(a)=f(2)=8에서 a=3. |
| `함수`/10 | 문항 | ENGINE_CAPABILITY_PENDING | **미지원:** `symbolic-axis-ticks-and-guide-projections-v1` | — | 대상 없음 | **원본 1:1 미달**: y=x 직선, y=f(x) 증가 곡선, x축 a,b,c,d,e·y축 a,b,c,d,e, x=b·c·d·e에서의 세로 점선 및 y=a·b·c·d·e 높이의 가로 점선, 연관 교점·수식 라벨. 기호의 수치를 제공하지 않아 임의 계수 대입 금지. |
| `함수`/10 | 해설 | ENGINE_CAPABILITY_PENDING | 위와 동일 | — | 대상 없음 | **원본 1:1 미달**: 그림에서 f(c)=b, f(b)=a, f⁻¹(d)=e를 추적할 정확한 수평·수직 지시선 필요. 원본에 해설 전용 이미지는 없음. |
| `함수`/11 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | X=[-2,2], Y=[-1,3], f(x)=ax+b의 정량 조건. |
| `함수`/11 | 해설 | PLAN_READY | `piecewise-polynomial-spike-v1` ×2 | `q11-solution-increasing.plan.json`, `q11-solution-decreasing.plan.json` | OK/OK | **조건일치**: 증가일 때 (-2,-1)→(2,3), 감소일 때 (-2,3)→(2,-1), 양 끝 닫힌 점과 서로 다른 기울기 ±1. 원본 별도 해설 이미지 없음. |
| `함수`/12 | 문항 | EXEMPT_TEXT_ONLY | — | — | — | f(x)=ax+2가 자기 역함수라는 식 조건. |
| `함수`/12 | 해설 | EXEMPT_TEXT_ONLY | — | — | f∘f=x에서 a=-1, f(1)=1; 원본 그림·보조선 없음. |

## 엔진 기능 대기 — 최종 DRAWN_FEATURE_PARITY가 아닌 이유

1. **`set-diagram-figure-v1`의 `transparentBackground` 및 타원 `fill:none`**: 현재 `production/set-diagram-v1.mjs`에서 전체 흰색 `<rect>`와 각 타원의 `fill="#fff"`가 강제된다. q01·q07 발문/해설 4개 플랜은 이 문제 때문에 완전한 무채움 검수를 통과했다고 할 수 없다. 원본 q01의 함수 이름 없는 파란 화살표에 색을 지정하는 옵션도 필요하다(라벨이 새로 생기면 원본과 불일치).
2. **`symbolic-axis-ticks-and-guide-projections-v1`**: q10 원본처럼 두 축의 a,b,c,d,e 문자를 값으로 정하지 않은 채 순서대로 표시하고, 추적되는 교점에서 축까지 가로·세로 점선을 자동 생성하며, 실제 함수식이 제공되지 않은 증가 곡선의 개형을 허용해야 한다. 현재 수치 기반 단일·다중 곡선 계획으로는 원문 1:1이 불가능하다. 손 SVG, 임의의 숫자 대입, 플랜을 가장한 상태 JSON은 만들지 않았다.
3. `plan-lint` OK는 수학 플랜 렌더·독립 관측기의 승인이지, 원본 PNG와 도형 특징·색상·흰 배경까지 동일하다는 증명은 아니다. q10은 명시적 **PENDING**이며 q01·q07은 배경·색이 남는다. 이번 커밋에서 원본 JS/PNG나 엔진은 수정하지 않는다.
