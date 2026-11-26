# 23_향림중_1학기_중간_중3_유사 q01~q24 — 문제·해설 SVG plan 감사

- 작업 시작 main `fb8676ae86b7c084a70d0b01b9c3ebe59d2e9f86`; 원본 JS blob `33bf75d8f163548f043709a6068a14e2d0356d0f`.
- 문항 24개, 문제축 24개+해설축 24개=48축. REQUIRED 3, BENEFICIAL 2, EXEMPT 43.
- 기존 문제 그림 plan q15·q19·q22는 최신 main에서 발견한 파일이다. q15·q22는 보존했고, q19의 빗변/밑변 조건과 맞지 않는 좌표(높이 14)를 정확한 높이 `8*sqrt(3)`으로 수정했다. q06·q23 해설 plan 2개를 새로 썼다. 기존 JS·SVG·PNG는 건드리지 않았다.
- `plan-lint --shallow`: 5/5 OK. `plan-lint` full: **3/5 OK, 2/5 ENV_BLOCKED**(q15, q19 construction: 공식 외부 Python `visual_engine` 미설치; `ModuleNotFoundError`). 두 항목을 임의 PASS로 기록하지 않는다.
- DRAWN_FEATURE_PARITY: **3축 PASS**(q06 해설, q22 문제, q23 해설 — 공식 number-line model/spec의 실제 그리기 필드 대조). **2축 NOT_VERIFIED/ENV_BLOCKED**(q15·q19 문제 — 공식 construction Math 모델·plan 필드는 검토했으나 full에서 SVG prepare에 필요한 Python 엔진 부재). 단순 lint OK와 패리티 PASS를 혼동하지 않는다.
- 최종 SVG/PNG 렌더, 학생 화면 및 A4 시각검수, JS 자산 연결은 모두 **NOT_RUN**. 이미 소스에 있는 기존 자산 경로는 변경하지 않았다.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY | 개별 판단 이유 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 23_향림중_1학기_중간_중3_유사/q01 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 제곱근 정의와 5개 문장 참·거짓 판별로 도식 없이 충분하다. |
| 23_향림중_1학기_중간_중3_유사/q01 | 해설 | EXEMPT | — | — | N/A | EXEMPT | ±4, √36, 0의 제곱근을 식으로 바로 비교한다. |
| 23_향림중_1학기_중간_중3_유사/q02 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 유리수·무리수의 수식 판별 보기이다. |
| 23_향림중_1학기_중간_중3_유사/q02 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 각 근호를 간단히 하여 유리수 여부를 식으로 확인한다. |
| 23_향림중_1학기_중간_중3_유사/q03 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 다섯 근호 등식의 산술 정확성 판별이다. |
| 23_향림중_1학기_중간_중3_유사/q03 | 해설 | EXEMPT | — | — | N/A | EXEMPT | √(x²)=|x| 계산만으로 잘못된 등식을 찾는다. |
| 23_향림중_1학기_중간_중3_유사/q04 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 양·음 제곱근과 곱의 값 계산이다. |
| 23_향림중_1학기_중간_중3_유사/q04 | 해설 | EXEMPT | — | — | N/A | EXEMPT | a=3, b=−√7 대입 식으로 끝난다. |
| 23_향림중_1학기_중간_중3_유사/q05 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 75/x가 제곱수가 되게 하는 소인수 조건이다. |
| 23_향림중_1학기_중간_중3_유사/q05 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 75=3·5² 소인수분해로 x=3을 계산한다. |
| 23_향림중_1학기_중간_중3_유사/q06 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 범위 내 자연수 합을 묻기 때문에 6·7·8을 문제 그림으로 미리 제시하면 정답 단서가 된다. |
| 23_향림중_1학기_중간_중3_유사/q06 | 해설 | BENEFICIAL | number-line-figure-v1 | q06-solution.plan.json | shallow PASS / full PASS | PASS | 5<x<17/2의 열린 구간과 정수점 6·7·8을 표시해 해 집합을 확인한다. |
| 23_향림중_1학기_중간_중3_유사/q07 | 문제 | EXEMPT | — | — | N/A | EXEMPT | √2·√20의 배수에 대한 자리 이동 계산이다. |
| 23_향림중_1학기_중간_중3_유사/q07 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 100의 제곱근 배율을 적용하는 계산 과정으로 충분하다. |
| 23_향림중_1학기_중간_중3_유사/q08 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 근호식의 동치변형으로 a,b 값을 찾는다. |
| 23_향림중_1학기_중간_중3_유사/q08 | 해설 | EXEMPT | — | — | N/A | EXEMPT | √108=6√3과 √(108/18)=√6 식으로 직접 결정한다. |
| 23_향림중_1학기_중간_중3_유사/q09 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 다섯 근호식에서 a의 대소를 비교한다. |
| 23_향림중_1학기_중간_중3_유사/q09 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 10·3·17·7·2의 수치 대조가 명확하다. |
| 23_향림중_1학기_중간_중3_유사/q10 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 제곱근의 크기와 부등식의 부호 비교이다. |
| 23_향림중_1학기_중간_중3_유사/q10 | 해설 | EXEMPT | — | — | N/A | EXEMPT | √4<√6, √9<√10 등 각 부등식 대조로 완결한다. |
| 23_향림중_1학기_중간_중3_유사/q11 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 근호 분수의 유리화·나눗셈 계산이다. |
| 23_향림중_1학기_중간_중3_유사/q11 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 모든 항이 √5 동류근호가 되도록 정리한다. |
| 23_향림중_1학기_중간_중3_유사/q12 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 다섯 실수의 정렬 그림은 묻는 세 번째 답을 미리 보여 준다. |
| 23_향림중_1학기_중간_중3_유사/q12 | 해설 | EXEMPT | — | — | N/A | EXEMPT | √10−√5 등 각 근호식의 상·하한을 이용한 정렬이 원문에 이미 완결되어 보조 그림은 중복된다. |
| 23_향림중_1학기_중간_중3_유사/q13 | 문제 | EXEMPT | — | — | N/A | EXEMPT | a<0<b에서 절댓값 식을 단순화한다. |
| 23_향림중_1학기_중간_중3_유사/q13 | 해설 | EXEMPT | — | — | N/A | EXEMPT | b−a>0, a<0, b>0을 식으로 정리하면 충분하다. |
| 23_향림중_1학기_중간_중3_유사/q14 | 문제 | EXEMPT | — | — | N/A | EXEMPT | −1<a<b<0의 역수·제곱근 부등식 판별이다. |
| 23_향림중_1학기_중간_중3_유사/q14 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 0<−b<−a<1이라는 식과 다섯 보기의 부호 판정으로 충분하다. |
| 23_향림중_1학기_중간_중3_유사/q15 | 문제 | REQUIRED | construction-spike-v1 | q15-problem.plan.json (기존 유지) | shallow PASS / full ENV_BLOCKED | NOT_VERIFIED / ENV_BLOCKED | 위 4x+5, 왼쪽 3x, 아래 띠 높이 2와 남은 윗부분 색칠을 보여 주는 기존 문제 그림이 정보 구조에 필요하다. |
| 23_향림중_1학기_중간_중3_유사/q15 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 문제 그림의 남은 높이 3x−2와 (4x+5)(3x−2) 식 계산만 필요하다. |
| 23_향림중_1학기_중간_중3_유사/q16 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 98²의 곱셈공식 선택 문제이다. |
| 23_향림중_1학기_중간_중3_유사/q16 | 해설 | EXEMPT | — | — | N/A | EXEMPT | (100−2)² 전개로 답을 구한다. |
| 23_향림중_1학기_중간_중3_유사/q17 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 다섯 전개식 중 옳지 않은 식을 고르는 문제이다. |
| 23_향림중_1학기_중간_중3_유사/q17 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 합차 공식을 전개해 우변과 비교하면 충분하다. |
| 23_향림중_1학기_중간_중3_유사/q18 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 근호 분모 통분·유리화 계산이다. |
| 23_향림중_1학기_중간_중3_유사/q18 | 해설 | EXEMPT | — | — | N/A | EXEMPT | (√5−1)²−(√5+1)²를 나누어 단순화한다. |
| 23_향림중_1학기_중간_중3_유사/q19 | 문제 | REQUIRED | construction-spike-v1 | q19-problem.plan.json (기존 교정) | shallow PASS / full ENV_BLOCKED | NOT_VERIFIED / ENV_BLOCKED | 직각삼각형과 빗변 b·밑변 2a·직각 표시는 문제의 주어진 관계이다. 기존 점 A 높이 14 오류를 8√3으로 교정하여 AB=16, BC=8, ∠ACB=90°를 독립 계산 확인했다. |
| 23_향림중_1학기_중간_중3_유사/q19 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 문제의 직각삼각형을 재사용해 피타고라스식 h=8√3과 넓이 계산을 글로 충분히 설명한다. |
| 23_향림중_1학기_중간_중3_유사/q20 | 문제 | EXEMPT | — | — | N/A | EXEMPT | xy=−8에서 식을 전개·단순화한다. |
| 23_향림중_1학기_중간_중3_유사/q20 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 주어진 식을 −4xy로 만드는 항등식 계산으로 충분하다. |
| 23_향림중_1학기_중간_중3_유사/q21 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 세 근호 항의 계산을 요구하는 서술형이다. |
| 23_향림중_1학기_중간_중3_유사/q21 | 해설 | EXEMPT | — | — | N/A | EXEMPT | √216=6√6과 18/√6=3√6으로 정리해 덧셈한다. |
| 23_향림중_1학기_중간_중3_유사/q22 | 문제 | REQUIRED | number-line-figure-v1 | q22-problem.plan.json (기존 유지) | shallow PASS / full PASS | PASS | 모눈의 1×2 직각삼각형과 수직선에서 AD=AQ·BC=BP의 길이 이동이 문제의 핵심이다. P·Q의 최종 값은 숨긴다. |
| 23_향림중_1학기_중간_중3_유사/q22 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 문제의 작도 그림을 재사용하고 √5, P·Q의 위치, 거리 계산을 식으로 설명한다. |
| 23_향림중_1학기_중간_중3_유사/q23 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 정수·소수 부분을 묻기에 미리 수직선에 값을 배치하면 정답 노출이 된다. |
| 23_향림중_1학기_중간_중3_유사/q23 | 해설 | BENEFICIAL | number-line-figure-v1 | q23-solution.plan.json | shallow PASS / full PASS | PASS | 5<√30<6 및 3<1+√7<4의 위치를 같은 척도의 분리된 행에서 확인한다. |
| 23_향림중_1학기_중간_중3_유사/q24 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 두 다항식의 전개와 A,B,C 계수 비교를 요구한다. |
| 23_향림중_1학기_중간_중3_유사/q24 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 합차 공식 및 완전제곱 공식으로 5x²+10xy+6y²를 계산한다. |

## 공식 엔진 모델·실제 그리기 대상 필드 대조

1. **q06 해설**: 공식 `solveNumberLineFigure`→`numberLineFigureSpec`의 SET r1 축 x1=132,x2=460,y=128, band lo 5 x=191.803922 OPEN·hi 17/2 x=392.196078 OPEN, integer dots 6 x=249.058824·7 x=306.313725·8 x=363.568627 생성 및 라벨 6·7·8 생성. 원문 해설의 자연수 해와 정확히 일치한다.
2. **q15 문제 (기존)**: 원문은 4x+5×3x 직사각형에서 아래 높이 2를 제외하고 위를 색칠한다. 기존 plan 원시 점은 A(0,6) B(0,0) C(13,0) D(13,6) E(0,2) F(13,2)이며 x=2인 대표 비율이 성립한다. planeMarks.regions BLUE [A,D,F,E], dimensions 4x+5·3x·2가 plan에 있다. 다만 외부 Python 렌더러 미설치로 이 필드의 실제 그리기 spec 여부는 **NOT_VERIFIED**이다.
3. **q19 문제 (기존 교정)**: 기존 A(8,14)의 빗변 길이는 √260으로 실제 조건 b=16과 불일치하였다. 정확한 A(8,8√3), B(0,0), C(8,0)으로 바꾸었다. 공식 `construction.execute` 모델이 A 좌표에 expression `8*sqrt(3)`을 정확히 유지함을 확인했다. 독립 SymPy 계산: AB=16, BC=8, CA=8√3, (A−C)·(B−C)=0. plan에는 sAB 라벨 b, sBC 라벨 2a, C의 rightAngle이 있다. 외부 Python 렌더러 미설치로 표식의 실제 그리기 spec 여부는 **NOT_VERIFIED**이다.
4. **q22 문제 (기존)**: 공식 spec POINTS A(2) x=203.357503, B(3) x=280.642497, P(3−√5) x=107.827996, Q(2+√5) x=376.172004. 원래 점 이름 A·B·P·Q 표시, P·Q 값 숨김. 각각 반지름 √5의 좌우 작도 호 및 1×2 모눈 출처 선분·보조격자·끝점 D/C 라벨을 실제 spec 필드로 확인했다. 문제에서 P·Q의 계산값은 글로 보여 주지 않는다.
5. **q23 해설**: 공식 spec 4행 동일 척도. 1행 5(x=354.26087),6(x=400.782609); 2행 √30(x=376.462233); 3행 3(x=261.217391),4(x=307.73913); 4행 1+√7(x=291.258865). 가깝게 붙는 근호 라벨은 행을 분리해 보존하고 값·행 라벨을 실제 spec에서 확인하였다.

구성 plan의 수학 모델 확인은 공식 도구를 이용했으나, q15·q19는 전체 SVG prepare/표식 위치를 실행하지 못하였으므로 PASS로 대체하지 않는다. 모든 그림의 실제 SVG·PNG 눈 검수 및 학생 화면·A4는 후속 렌더 담당이다.

## lint 실측과 명확한 장애

- 공식 명령: `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <5개 plan>` → **5 OK / 0 FAIL / 0 SKIP / exit 0**.
- 공식 full: `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs <5개 plan>` → **3 OK / 2 FAIL / 0 SKIP / exit 1**. q15·q19 construction의 오류는 `ModuleNotFoundError: No module named 'visual_engine'`; 코드나 수학 증명 실패가 아니라 이 실행기에 공식 외부 Python visual_engine 배포본이 빠진 환경 장애이다. 엔진/검사기를 임의 대체하거나 검사를 완화하지 않았다.
- full PASS q06 해설·q22 문제·q23 해설. full **ENV_BLOCKED** q15·q19 문제. 원본 HTML/PNG 시각 확인, 학생 화면/A4는 **NOT_RUN**.
- 기존 별도 미해결: 왕운중 유사3 q23 문제·해설 EVIDENCE_DEBT 2축; 풍덕중 유사1 q21 해설 소문자 a,b,c 수직선 라벨 ENGINE_CAPABILITY_PENDING 1축. 이번 판정과 섞지 않는다.
