# 2021 제일고 고2 수학I 1학기 중간 유사 — 24문항·48축 시각 판정

- 대상: `../21_제일고_1학기_중간_고2_수학I_유사.js` (`main` 기준 24문항)
- 문제 축은 해설에만 등장하는 값·좌표를 공개하지 않는다. 면 채움 사용하지 않음. 기존 JS/SVG/PNG/완료 plan은 수정하지 않음.
- `qNN-[축]`는 현재 `_plans/` 폴더의 `qNN-problem.plan.json` / `qNN-solution.plan.json`. `EXEMPT`는 판정만 있고 가짜 제작 plan 없음.

| qid | 문제 축 판정·개별 사유 | 해설 축 판정·개별 사유 | 실제 plan·PARITY |
| --- | --- | --- | --- |
| q01 | EXEMPT — 로그 합을 정리하는 계산식 | EXEMPT — 지수·로그 법칙과 상수값 계산 | 없음 |
| q02 | EXEMPT — 지수부등식 하나와 자연수 조건 | EXEMPT — 밑 통일 및 일차부등식으로 수치 확인 | 없음 |
| q03 | EXEMPT — 사분면·탄젠트 값만 주며 문제 그림은 사인 값을 암시 | BENEFICIAL — 제2사분면 3:4:5 직각삼각형과 부호 | `q03-solution` / PASS: P(−4,3), 가로 4·세로 3·빗변 5·직각 |
| q04 | EXEMPT — 부등호에 의한 사분면 추론 | EXEMPT — sin·cos 부호에 관한 논리 전개로 완결 | 없음 |
| q05 | EXEMPT — 삼각방정식 두 근의 합, 그림에 두 근을 미리 표시하면 답을 암시 | BENEFICIAL — sin(x+π/6)의 두 x축 교점 확인 | `q05-solution` / PASS: SIN 곡선·π눈금 5/6,11/6·중심선 교점 |
| q06 | EXEMPT — 두 로그 곱의 이차식 치환 | EXEMPT — t=log₃ x 치환의 두 대수근으로 완결 | 없음 |
| q07 | EXEMPT — 주어진 지수함수와 두 점의 y좌표로 a,b의 로그값 결정 | EXEMPT — b−a는 두 로그값의 차이로 계산, 관계 시각 중복 | 없음 |
| q08 | REQUIRED — 로그곡선의 점 A와 축 위 B,C 및 정사각형 D의 상대적 배치가 발문 이해의 핵심 | BENEFICIAL — A(9,2), D(11,2)와 BC=2로 좌표 계산을 연결 | `q08-problem` / PASS: LOGARITHMIC 곡선·ABCD 네 선분·BC length=2·좌표 비노출; `q08-solution` / PASS: A/D의 계산된 좌표 표기 |
| q09 | EXEMPT — 임의 a의 지수함수 평행이동·대칭 조건 | EXEMPT — 지수부 4−x=0의 값 대입으로 상수 독립점 결정, 특정 밑 예시는 범위를 왜곡 | 없음 |
| q10 | EXEMPT — sin−cos의 값만 주어진 항등식 | EXEMPT — 제곱 및 곱 항등식으로 바로 계산 | 없음 |
| q11 | EXEMPT — 역함수 교점의 x좌표와 파라미터 조건을 기호로 명시 | BENEFICIAL / ENGINE_CAPABILITY_PENDING — 두 교점의 y=x 대칭 및 증가·감소 분기를 그래프로 설명할 가치가 있으나 정확한 밑 `a=8^(1/7)`을 현재 지수·로그 그래프 base 계약이 수용하지 못함 | 제작 plan 없음. 필요 기능: 일반 양의 대수적 밑/7제곱근 밑 표현, 역함수와 두 교점 `(1,1),(8,8)` 표시 |
| q12 | EXEMPT — 로그 표현의 최댓값, 정의역은 식으로 결정됨 | BENEFICIAL — 로그 단조성 때문에 안쪽 x(16−x)의 꼭짓점이 최대를 결정 | `q12-solution` / PASS: 이차곡선·열린 끝점·꼭짓점 (8,64) |
| q13 | EXEMPT — 모든 실수에서 이차식 비음수 및 θ 범위 | EXEMPT — 판별식과 cos의 단조성으로 구간 경계가 결정, 그래프는 식 중복 | 없음 |
| q14 | EXEMPT — 두 부채꼴의 호·반지름 관계를 총합으로 표현 | EXEMPT — 반지름 합·제곱합의 대수적 풀이로 명확, 3라디안 도형 복제는 새로운 필수 관계 없음 | 없음 |
| q15 | EXEMPT — 이차함수의 세 값과 로그부등식 | EXEMPT — f(x)=x(8−x)/3, 진수 및 자연수 구간 검토로 완결 | 없음 |
| q16 | EXEMPT — 지수 연쇄 관계와 xyz=60 | EXEMPT — 로그 밑변환·소거로 완결, 추가 시각 관계 없음 | 없음 |
| q17 | REQUIRED — 사인곡선에 내접한 직사각형·BC=4의 공간적 구조가 문제 조건 핵심 | BENEFICIAL — 대칭축 x=3, 좌우 x=1,5 및 높이 1/2의 산출 과정 | `q17-problem` / PASS: SIN ratePi=1/6, A/B/C/D 네 점과 BC 길이 4, x값·높이 비노출; `q17-solution` / PASS: 두 위쪽 점 좌표와 높이 눈금 표시 |
| q18 | EXEMPT — 삼각함수식의 최솟값 | EXEMPT — AM-GM 등식조건과 sin x의 범위가 수식만으로 완결 | 없음 |
| q19 | EXEMPT — 실근의 개수 함수 f(a,n)의 합 | EXEMPT — 짝홀과 a의 부호에 따른 수열 셈; 단순 수직선·표는 해설 반복 | 없음 |
| q20 | REQUIRED / ENGINE_CAPABILITY_PENDING — 지수·로그 세 곡선의 교점 A/B/C 상대 위치 이해가 핵심. 세 곡선은 실행 plan, 다만 교점 이름 3개를 정확히 자동 생성할 기능 부족 | BENEFICIAL / ENGINE_CAPABILITY_PENDING — f·g 역함수의 y=x 대칭과 B/C 비교를 도식화, 암시적 초월함수 교점 이름 정확 배치 기능 부족 | `q20-problem`·`q20-solution` / shallow·full lint 별도 확인. 3곡선 및 해설 y=x는 실제 필드에 존재, `A/B/C` 이름·정확한 교점 마커는 미지원. 필요 기능: EXPONENTIAL×LOGARITHMIC 및 LOGARITHMIC×LOGARITHMIC의 암시적 교점 자동 계산·고유 이름·라벨 표시 |
| q21 | EXEMPT — 지수방정식의 정수 매개변수 조건 | EXEMPT — t=2^x에 관한 두 양근의 판별식·합·곱으로 완결 | 없음 |
| q22 | EXEMPT — 특정 삼각함수 값의 곱 | EXEMPT — 표준각·음각 값 대입으로 완결 | 없음 |
| q23 | EXEMPT — 진폭·최대최소·두 최대 x값을 바탕으로 상수를 구하므로 그래프는 답의 일부를 암시 | BENEFICIAL — 중심선, 진폭, 주기 4π, 시작점 3π/4을 실물 관계로 확인 | `q23-solution` / PASS: COS, 극점·주기·π 눈금 |
| q24 | EXEMPT — 반감기·지수모형이 기호와 기간으로 명확함 | BENEFICIAL — 반감기 30년마다 절반이 되고 120년에 1/16에 도달함을 그래프로 확인 | `q24-solution` / PASS: EXPONENTIAL 계수·(0,1),(30,1/2),(120,1/16) |

## 집계·후속 경계

- 문제 축 **24/24**: REQUIRED 3(완성 2, PENDING 1), EXEMPT 21. 해설 축 **24/24**: BENEFICIAL 9(완성 7, PENDING 2), EXEMPT 15. 총 48축 판정.
- 실행용 plan **11개**: `q03-S`, `q05-S`, `q08-P/S`, `q12-S`, `q17-P/S`, `q20-P/S`, `q23-S`, `q24-S`. **완전한 DRAWN_FEATURE_PARITY PASS 9**, 미지원 2(plan 존재) + 1(plan 없음).
- `q11-S`는 임의 밑의 7제곱근 정확 표현, `q20-P/S`는 초월함수 쌍의 암시적 교점 정확 계산/라벨 기능이 들어와야 최종 PARITY PASS 가능하다. 캡션의 설명을 실제로 그려진 교점 마커로 간주하지 않는다.
- 공식 `plan-lint.cjs` shallow **11/11 PASS**, full **11/11 PASS** (정본 글꼴 SHA-256 `194018e6…`, SymPy/MathJax 의존성). 엔진 SVG 렌더·PNG 육안·학생 화면·A4·JS 자산 연결은 **NOT_RUN** (후속 엔진 실행·게시 담당).
