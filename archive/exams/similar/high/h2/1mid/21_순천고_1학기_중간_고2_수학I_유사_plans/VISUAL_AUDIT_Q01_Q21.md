# 2021 순천고 고2 수학I 1학기 중간 유사 — 21문항·42축 시각 판정

- 대상: `../21_순천고_1학기_중간_고2_수학I_유사.js` (`main` 기준 21문항)
- 기준: 현재 JS의 발문·보기·해설 각각 확인, 문제/해설 축 독립 판단. 아래의 plan은 모두 정식 geometry-equation 엔진 입력이며 손 SVG나 JS 이미지 연결은 없음.
- 표의 `qNN-[축]`는 이 폴더의 `qNN-problem.plan.json` / `qNN-solution.plan.json`이다. `EXEMPT`에는 가짜 plan JSON을 만들지 않았다.

| qid | 문제 축 판정·개별 사유 | 해설 축 판정·개별 사유 | 실제 plan·PARITY |
| --- | --- | --- | --- |
| q01 | EXEMPT — 근호의 참·거짓 선지 판별, 도형 조건 없음 | EXEMPT — 각 근호의 부호·정의 대입으로 풀이 완결 | 없음 |
| q02 | EXEMPT — 대수·복소수 근호 등식 비교 | EXEMPT — 선지별 거듭제곱 계산으로 설명 완결 | 없음 |
| q03 | EXEMPT — 로그 값 및 성질의 대수 비교 | EXEMPT — 밑 변환·로그 성질 수식 전개 | 없음 |
| q04 | EXEMPT — ㄱ~ㄹ 함수의 개별 명제 참·거짓을 묻는 발문, 답을 암시하는 그래프 배제 | BENEFICIAL — ㄹ의 `log x⁴`와 `4log x`는 음수 정의역에서 그래프가 달라서 시각화 유익 | `q04-solution` / PASS: 양의 x 공통 가지와 음의 x 추가 가지가 서로 다른 LOGARITHMIC 필드에 존재 |
| q05 | EXEMPT — 로그함수 항등식의 조건 판별 | EXEMPT — 곱셈 로그법칙만으로 직접 설명 | 없음 |
| q06 | EXEMPT — pH 농도 비례식의 주어진 수치 | EXEMPT — 로그 성질에 의한 pH 차이 계산, 그래프는 식의 반복 | 없음 |
| q07 | EXEMPT — 선택지 각도의 360° 나머지 직접 비교, 답을 드러내는 동경 그림 불필요 | BENEFICIAL — 60°와 300° 동경이 다른 사분면에 있음을 시각 구분 | `q07-solution` / PASS: 원·두 동경 선분·60°/300° 각 호 |
| q08 | EXEMPT — 사분면과 삼각함수의 합을 수식으로 완전 지정 | EXEMPT — 부호 검토 및 제곱 항등식 계산만으로 완결, 임의 단위원 점은 추가 관계 없음 | 없음 |
| q09 | EXEMPT — 삼각함수 각 변환의 기호식 평가 | EXEMPT — 각 변환 공식 4개와 제곱합 항등식, 도해 중복 | 없음 |
| q10 | EXEMPT — 범위와 cos 방정식으로 모든 해가 결정되며 문제 그래프는 풀이 시점의 교점을 암시 | BENEFICIAL — 두 주기, 네 교점 및 대칭에 따른 근의 합을 보임 | `q10-solution` / PASS: COS 두 주기·수평선 y=2/5·교점수 4 |
| q11 | EXEMPT — 제곱근/유리 지수 정의조건의 논리 판별 | EXEMPT — x>0 정의조건의 문장 추론 외 위치 관계 없음 | 없음 |
| q12 | EXEMPT — 로그방정식 매개변수 a의 실근 개수 조건 | EXEMPT — 진수 조건과 이차방정식 후보의 부호 점검, 선택된 고정 곡선 없음 | 없음 |
| q13 | EXEMPT — 소인수분해를 이용한 지수 지수 비교 | EXEMPT — 지수 일치 조건을 대수적으로 풀이, 그림 무관 | 없음 |
| q14 | BENEFICIAL — 지수곡선·x축·수직 점근선 사이의 닫힌 경계 이해, 격자점 수는 비노출 | BENEFICIAL — 정수 열 x=3,4와 각각의 y 상한 3,11을 도식화 | `q14-problem` / PASS: 지수곡선, x축, x=4 점선; `q14-solution` / PASS: 점·수직선분까지 그려짐 |
| q15 | EXEMPT — 치환 이차방정식의 서로 다른 양근 조건 | EXEMPT — 판별식·근의 합·곱 부등식으로 완결 | 없음 |
| q16 | EXEMPT — 부채꼴의 둘레와 넓이 조건이 기호로 명확함 | BENEFICIAL — 넓이 S=7r−r²의 꼭짓점과 최대를 비교 | `q16-solution` / PASS: 이차식 계수, 0<r<7, 꼭짓점 (7/2,49/4) |
| q17 | EXEMPT — 최댓값·최솟값과 연속 최대 x값이 정확히 주어짐 | BENEFICIAL — 코사인 진폭 3·중심선 4·주기 8π를 그래프로 확인 | `q17-solution` / PASS: COS 계수, 구간, 극점·눈금 |
| q18 | EXEMPT — 원은 주어졌지만 θ의 사분면 자체가 추론 대상이라 문제 그림에 정답 암시 위험 | BENEFICIAL — 제4사분면 3:4:5 직각삼각형과 A(4,−3) | `q18-solution` / PASS: 반지름 5 원·세 선분 길이·직각표식·A 좌표 |
| q19 | EXEMPT — 함수식과 대칭 항등식의 참·거짓 판별 | EXEMPT — 각 함수의 짝함수·주기 분석이 대수식으로 완결, 일부 보기만 그린 곡선은 오해 소지 | 없음 |
| q20 | EXEMPT — 주기·이동·치역·개형 자체를 묻기 때문에 문제 그림은 과제 답을 미리 제공 | BENEFICIAL — 원 함수의 한 주기 개형·평행이동·최대 최소 | `q20-solution` / PASS: COS, π~7π, y=1/−5/−2 극점·눈금 |
| q21 | EXEMPT — 로그 정의와 법칙의 네 증명 요청 | EXEMPT — 임의의 a,M,N에 대한 기호적 증명으로 완결 | 없음 |

## 집계·후속 경계

- 문제 축 **21/21**: BENEFICIAL 1, EXEMPT 20. 해설 축 **21/21**: BENEFICIAL 8, EXEMPT 13. 총 42축 판정.
- 실행용 plan **9개**: `q04-S`, `q07-S`, `q10-S`, `q14-P/S`, `q16-S`, `q17-S`, `q18-S`, `q20-S`.
- DRAWN_FEATURE_PARITY: **9/9 PASS**, ENGINE_CAPABILITY_PENDING **0**. 수식·개형·표식은 각 plan의 `sourceConditions[].mappedTo`와 그려지는 `graphPlan` / `mathPlan` / `planeMarks` 필드로 개별 대조했다.
- 공식 `plan-lint.cjs` shallow **9/9 PASS**, full **9/9 PASS** (정본 글꼴 SHA-256 `194018e6…`, SymPy/MathJax 의존성). 실제 SVG 렌더·PNG 육안·학생 화면·A4·JS 자산 연결: **NOT_RUN** (후속 엔진 실행·게시 담당).
