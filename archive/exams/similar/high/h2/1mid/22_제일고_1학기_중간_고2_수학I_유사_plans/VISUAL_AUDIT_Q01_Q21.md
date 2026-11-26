# 2022 제일고 고2 수학I 1학기 중간 유사 — SVG plan 2축 감사 q01–q21

## 범위·기준

- 소스: `22_제일고_1학기_중간_고2_수학I_유사.js`, 실제 `questionBank` id 1~21 전수.
- 검사 축: 문제 21·해설 21 = 42축. 원문 JS의 `image` 필드는 없고, 기존 `_plans` 및 동일 qid 감사 기록도 없었다.
- `REQUIRED` 0, `BENEFICIAL` 4(q10·q16·q17·q18 해설), `EXEMPT` 38.
- 신규 공식 capability 계획 3개: q10 `multi-curve-figure-v1`, q16·q17 `trigonometric-spike-v1`. SVG 직접 작성 없음.
- q18 해설은 정확한 밑 `a=∛6`을 쓰는 지수·로그 두 곡선이 교육적으로 유익하나, `multi-curve`의 `base`는 분모·분자 1000 이하의 유리수만 허용하여 `ENGINE_CAPABILITY_PENDING`으로 남겼다. 임의 유리수로 바꾼 그림은 만들지 않는다.
- `plan-lint.cjs --shallow` 3건 모두 **ENV_BLOCKED**; full 3건 모두 **ENV_BLOCKED**. 실제 명령은 실행했으나 `ModuleNotFoundError: No module named 'visual_engine'`로 공식 Python `frame_graph` 진입 전 실패했다. 따라서 PASS 0건. 로컬 공식 Python 의존성 `.tmp/apmath-visual-engine/dependencies/python` 및 `visual_engine` 제공 필요.
- `DRAWN_FEATURE_PARITY` 3건 **NOT_VERIFIED**, q18 **ENGINE_CAPABILITY_PENDING**. 정확한 plan 필드와 source/solution의 수학 조건은 수기·독립 Node 계산으로 대조했으나, 공식 모델·spec·SVG·Chrome/A4 렌더는 실행 불가. 정식 PASS 0축이다.
- 판정은 원문에 없는 도형을 가정하지 않고, 문제 그림으로 정답이 드러날 수 있는 경우 원문 수식만 유지했다. `EXEMPT`는 실행형 plan 미작성이다.

## 문항별 독립 판정

| qid | 축 | 판정 | 구체적 사유·실제 plan | lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|
| q01 | 문제 | EXEMPT | 지수·근호·로그 참거짓 선지의 대수 조건만 묻는다. | N/A | EXEMPT |
| q01 | 해설 | EXEMPT | 세제곱 인수분해 등 선지별 식 변환으로 판정한다. | N/A | EXEMPT |
| q02 | 문제 | EXEMPT | 로그 진수 이차식 및 닫힌 정의역이 식으로 정확히 지정된다. | N/A | EXEMPT |
| q02 | 해설 | EXEMPT | `(x−3)²+32` 완전제곱과 x=3 포함 여부로 최솟값이 확정된다. | N/A | EXEMPT |
| q03 | 문제 | EXEMPT | A·B·C의 로그값 합은 순수 식 계산이다. | N/A | EXEMPT |
| q03 | 해설 | EXEMPT | 로그 곱셈·밑변환을 항별로 계산한다. | N/A | EXEMPT |
| q04 | 문제 | EXEMPT | 로그 밑 조건과 이차 진수의 전 실수 양수 조건을 묻는다. | N/A | EXEMPT |
| q04 | 해설 | EXEMPT | 정수 a 범위는 밑·판별식 부등식의 교집합으로 구한다. | N/A | EXEMPT |
| q05 | 문제 | EXEMPT | 지수식의 최솟값/최댓값은 t=3ˣ로 치환해 계산한다. | N/A | EXEMPT |
| q05 | 해설 | EXEMPT | 포물선 그림 없이 `(t−3)²+5`와 `0<t≤9`로 극값을 판단한다. | N/A | EXEMPT |
| q06 | 문제 | EXEMPT | 광섬유 거리와 신호 세기의 지수 모델이 식으로 주어져 장식 도해가 불필요하다. | N/A | EXEMPT |
| q06 | 해설 | EXEMPT | `(1/3)^{x/5}=1/27` 동치식의 지수 비교로 끝난다. | N/A | EXEMPT |
| q07 | 문제 | EXEMPT | 로그식의 정수 여부와 주어진 x 범위는 수치 조건만으로 판단한다. | N/A | EXEMPT |
| q07 | 해설 | EXEMPT | `5log x`의 정수 경우와 곱 계산으로 해결하며 수직선 중복이다. | N/A | EXEMPT |
| q08 | 문제 | EXEMPT | 필터 통과 횟수별 잔존율은 반복 곱셈 조건으로 완전히 정해진다. | N/A | EXEMPT |
| q08 | 해설 | EXEMPT | 지수부등식에 로그를 적용해 최소 자연수를 결정한다. | N/A | EXEMPT |
| q09 | 문제 | EXEMPT | 동등한 세 거듭제곱과 역수 관계는 순수 기호 계산이다. | N/A | EXEMPT |
| q09 | 해설 | EXEMPT | 공통 밑 치환·로그 선형 결합으로 x를 계산한다. | N/A | EXEMPT |
| q10 | 문제 | EXEMPT | 주기 2·기본 조각의 식이 모두 발문에 명시돼 별도 문제 그림이 정답 n을 암시할 수 있다. | N/A | EXEMPT |
| q10 | 해설 | BENEFICIAL | `q10-solution.plan.json`: 4개 `ABSOLUTE_VALUE` 조각 f=3−3\|x−(2k+1)\| (k=0..3), `LOGARITHMIC` 밑 4 한 곡선. 각 정수 구간 교차를 예시로 보여 준다. 원래 n=4는 해설에서 얻은 값; [0,8] 예시임을 caption 명시. | shallow/full ENV_BLOCKED | NOT_VERIFIED |
| q11 | 문제 | EXEMPT | a,b의 로그 대소 비교는 1<a<b 조건이 전부다. | N/A | EXEMPT |
| q11 | 해설 | EXEMPT | 밑의 증가성과 밑변환 성질로 ㄱ·ㄴ·ㄷ을 따로 검증한다. | N/A | EXEMPT |
| q12 | 문제 | EXEMPT | θ와 5θ의 원점대칭 동경은 각 차가 홀수 π배라는 조건으로 충분하다. | N/A | EXEMPT |
| q12 | 해설 | EXEMPT | `(5−1)θ=(2k+1)π`의 정수해 범위를 세므로 원 그림은 중복이다. | N/A | EXEMPT |
| q13 | 문제 | EXEMPT | 부채꼴의 둘레 24와 면적 최대는 반지름·호길이 식으로 주어진다. | N/A | EXEMPT |
| q13 | 해설 | EXEMPT | `S=12r−r²`의 완전제곱으로 최대를 구하며 부채꼴 도해는 장식이다. | N/A | EXEMPT |
| q14 | 문제 | EXEMPT | P(−3,a)와 tanθ=−4/3, a>0의 사분면·비율이 텍스트로 확정된다. | N/A | EXEMPT |
| q14 | 해설 | EXEMPT | 3:4:5 직각삼각형 좌표 대입과 삼각함수 정의로 끝난다. | N/A | EXEMPT |
| q15 | 문제 | EXEMPT | 표준각 사인·코사인·탄젠트 계산식이다. | N/A | EXEMPT |
| q15 | 해설 | EXEMPT | 주기·부호·기준각의 항등식만 이용한다. | N/A | EXEMPT |
| q16 | 문제 | EXEMPT | f=sin(πx/4), x≥0 및 수평선 3/4가 모두 명시돼 문제 그림 없이 해석 가능하다. | N/A | EXEMPT |
| q16 | 해설 | BENEFICIAL | `q16-solution.plan.json`: `SIN`, ratePi=1/4, x∈[0,10], y=3/4 기준선, 교점 3개와 극값·주기 눈금. α+β=4, γ−α=8의 대칭·주기 직관. | shallow/full ENV_BLOCKED | NOT_VERIFIED |
| q17 | 문제 | EXEMPT | 최고 4·최저 −4 및 극값 x 위치를 수치로 이미 준다. 풀이값을 반영한 문제 그림은 계수를 선공개한다. | N/A | EXEMPT |
| q17 | 해설 | BENEFICIAL | `q17-solution.plan.json`: `SIN`, a=4, b=1/2, phasePi=−1/12, x∈[0,4π], 극값 눈금 7π/6·19π/6·±4. 반주기 2π를 표시한다. | shallow/full ENV_BLOCKED | NOT_VERIFIED |
| q18 | 문제 | EXEMPT | 두 함수식·축 절편 A,B·수평/수직 교점 C,D를 관계로 완전히 정의한다. 임의 그림은 미정 a 배치를 고정할 위험이 있다. | N/A | EXEMPT |
| q18 | 해설 | BENEFICIAL | A(0,3), B(3,0), C(a³+2,3), D(3,a³+2)의 곡선과 사각형 넓이 분해는 그림이 유익하다. 단, 해설 확정 a=∛6을 정확한 `EXPONENTIAL`·`LOGARITHMIC` `base`로 지정할 공식 지원이 없다. | plan 없음 / ENGINE_CAPABILITY_PENDING | ENGINE_CAPABILITY_PENDING |
| q19 | 문제 | EXEMPT | 로그부등식의 정의역 및 정수해 합을 묻는 순수 수식 조건이다. | N/A | EXEMPT |
| q19 | 해설 | EXEMPT | 밑변환과 진수 조건·정수 구간을 계산한다. | N/A | EXEMPT |
| q20 | 문제 | EXEMPT | 절댓값 삼각함수 등식과 θ 범위는 식·부호로 충분히 주어진다. | N/A | EXEMPT |
| q20 | 해설 | EXEMPT | 절댓값을 풀어 사인·코사인의 부호별 구간을 구한다. 원 그림은 중복이다. | N/A | EXEMPT |
| q21 | 문제 | EXEMPT | P,Q,R의 좌표와 삼각형 넓이가 모든 기하 정보를 제공한다. | N/A | EXEMPT |
| q21 | 해설 | EXEMPT | x좌표의 간격 1을 이용한 사다리꼴 넓이 차로 면적을 직접 계산한다. | N/A | EXEMPT |

## 실제 필드 대조·미해결 해결 조건

| plan | source/solution과 대조한 입력 필드 | 독립 확인 | 공식 엔진/실제 렌더 상태 |
|---|---|---|---|
| q10 solution | f 조각 x=[0,2],[2,4],[4,6],[6,8], 각각 꼭짓점 (1,3),(3,3),(5,3),(7,3), x=0,2,4,6,8에서 y=0, 로그 밑 4, x∈[1,8], 면 채움·정답 직접 라벨 없음 | 모든 조각 양끝 0·가운데 3; x=1~8의 매 단위 구간 하나씩 교차; 전체 교점 4³−1=63은 해설과 별도 일치 | 모델/spec/SVG NOT_VERIFIED |
| q16 solution | 주기 8, x∈[0,10], y=3/4, 교점 3개, x=2 극대 1·x=6 극소 −1, 무채움 | 수치 탐색 α≈1.08, β≈2.92, γ≈9.08, α+β=4, γ−α=8 | 모델/spec/SVG NOT_VERIFIED |
| q17 solution | a=4, b=1/2, c=π/12, 최고/최저 ±4, x=7π/6·19π/6, 반주기 2π, 무채움 | `4sin(7π/12−π/12)=4`; `4sin(19π/12−π/12)=−4` | 모델/spec/SVG NOT_VERIFIED |
| q18 solution | 미정 계수로 정의된 원문 두 함수, 해설 정답 a³=6, 정확한 밑 ∛6 | 수식 유도는 소스 해설에 존재 | **ENGINE_CAPABILITY_PENDING**: `multi-curve`에 유리수 이외의 정확한 지수·로그 공통 밑 지원 필요. 임의 근삿값 금지 |

공식 `plan-lint.cjs`는 세 계획을 **각각 명시 경로로** shallow와 full에서 실행했으며, 두 명령 모두 3/3 `ModuleNotFoundError`(종료 1)이다. 디렉터리 입력 시 `0개`로 나오는 명령은 검증에 포함하지 않았다. `ENV_BLOCKED`는 엔진 기능 부재가 아니라 실행기 의존성 부재다. 해결 조건: 정식 `visual_engine`을 제공하는 실행기에서 shallow+full 재실행, 모델/스펙의 렌더 대상 필드와 실제 SVG/PNG 및 학생 화면·A4 필요 검수. 검증 전 PARITY PASS 전환 금지.

원문 JS, 기출·유형은행·교과서·엔진 코드에는 수정 없음.
