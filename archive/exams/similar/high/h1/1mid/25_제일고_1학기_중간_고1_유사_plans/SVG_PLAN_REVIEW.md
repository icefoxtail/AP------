# 2025 제일고 고1 1학기 중간 유사 — 문제·해설 2축 그림 판정

- 기준 JS: `archive/exams/similar/high/h1/1mid/25_제일고_1학기_중간_고1_유사.js` (`da3726a34f99d1bcbd52aa6bcbbf23582e478ba7`)
- 범위: Q01~Q22, 총 22문항 × 2축 = 44개 판정. 본 배치에서 JS·기존 SVG 자체는 수정하지 않는다.
- 제작용 plan 경로: 이 문서와 같은 `_plans` 폴더의 `qNN-solution.plan.json`. `EXEMPT`를 나타내는 가짜 plan 파일은 작성하지 않는다.
- 단계 구분: plan은 향후 엔진 렌더용 설계 파일이며 실제 렌더·PNG·학생 화면·A4 점검은 `NOT_RUN`이다.

| QID | 문제 축 판정 및 개별 사유 | 해설 축 판정 및 개별 사유 | 작성 plan | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- |
| 01 | EXEMPT — 항등식 계수 비교만 필요 | EXEMPT — 세 계수 계산을 도형으로 복제할 가치 없음 | — | N/A |
| 02 | EXEMPT — 한 점 대입의 나머지 계산 | EXEMPT — P(1) 대입식 자체가 해설 완결 | — | N/A |
| 03 | EXEMPT — 조립제법 표가 발문 HTML 수식에 이미 있음 | EXEMPT — 계수 연산 순서를 식으로 직접 확인 가능 | — | N/A |
| 04 | EXEMPT — 인수 후보 대입 판정 | EXEMPT — 함수 모양보다 P(2) 계산이 핵심 | — | N/A |
| 05 | EXEMPT — 몫·나머지 두 대입 관계 | EXEMPT — P(2)=(2−1)Q(2)+4가 충분 | — | N/A |
| 06 | EXEMPT — 대칭식과 곱셈 공식 | EXEMPT — 수치 항등식 전개 중복 | — | N/A |
| 07 | EXEMPT — 인수·중복 인수의 대수 조건 | EXEMPT — 80+a=0을 그림이 설명하지 못함 | — | N/A |
| 08 | EXEMPT — 거듭제곱 나머지의 모듈러 계산 | EXEMPT — 40≡1 (mod 39)라는 식이 핵심 | — | N/A |
| 09 | EXEMPT — 허근의 대수적 성질 | EXEMPT — α³=1 치환식 중복 그림 불필요 | — | N/A |
| 10 | EXEMPT — 복소수 문장 참·거짓 선택 | EXEMPT — 정의와 반례를 문장으로 비교 | — | N/A |
| 11 | EXEMPT — 복소수 덧셈·곱셈 | EXEMPT — 실수부·허수부의 연산 식 중복 | — | N/A |
| 12 | EXEMPT — 제곱근 나눗셈의 정의역 조건 | EXEMPT — 정수 범위를 식으로 열거하여 완결 | — | N/A |
| 13 | EXEMPT — 교점 좌표 2개와 이동 규칙이 텍스트에 주어짐 | BENEFICIAL — 두 근이 x+2에서 왼쪽으로 2 이동하는 대응 비교 | `q13-solution.plan.json` | PASS — 두 행의 −3·6 / −5·4가 실제 `points[].value`에 있음 |
| 14 | EXEMPT — 두 판별식의 부호 비교 | EXEMPT — 매개변수 부등식 교집합의 수식 계산 | — | N/A |
| 15 | EXEMPT — i의 거듭제곱 주기 합산 | EXEMPT — 복소수 항 묶기 계산이며 도형 불필요. 단 JS 해설 `[해설생성불가]` 별도 내용 결함 | — | N/A |
| 16 | EXEMPT — k가 자유 변수라 단일 원래 그래프가 정해지지 않음 | BENEFICIAL — 서로 다른 k의 포물선 두 개에 같은 접선이 닿는 예시 | `q16-solution.plan.json` | PASS — 두 포물선·접선의 정확한 계수와 식 라벨이 `curves`에 있음 |
| 17 | EXEMPT — 허근과 다항식의 조건식 | EXEMPT — 복소근 조건을 실평면 그래프로 왜곡할 우려 | — | N/A |
| 18 | REQUIRED — 정사각형·EF·P와 PMBN의 인접관계가 필요하나 E,F의 변 소속이 발문에서 누락 | BENEFICIAL — 수선·가로 10−t·세로 6+4t/5 관계를 나타내야 하나 동일 누락 | 미작성 (`CONTENT_CONDITION_MISSING`) | EVIDENCE_DEBT: 발문은 E,F가 어느 변 위인지 말하지 않음 |
| 19 | EXEMPT — 공통 인수와 합차공식 | EXEMPT — 인수분해 식 전개 중복 | — | N/A |
| 20 | EXEMPT — 몫과 나머지의 항등식 | EXEMPT — P(−1), P(1), P(2) 대입으로 완결 | — | N/A |
| 21 | EXEMPT — 켤레복소수의 실수 조건 | EXEMPT — x=±6 대입으로 0 제외, 그래프 불필요 | — | N/A |
| 22 | EXEMPT — 이차식·정의역만으로 답이 유일 | BENEFICIAL — 꼭짓점 x=1에서 양 끝점까지 거리 4·1 대조 | `q22-solution.plan.json` | PASS — −3·1·2가 `points[].value`, 4·1이 `spans[].label`에 있음 |

## 후속 검수 경계

1. Q13·Q22에는 이미 `archive/assets/images/25_제일고_1학기_중간_고1_유사/`의 해설 SVG가 JS에 연결되어 있다. 신규 plan은 공식 엔진 재현·교체 시 사용하며 기존 SVG를 자동 대체하거나 본 배치에서 JS 링크를 수정하지 않는다.
2. Q18의 해설은 `D(0,0), E(5,0), F(0,4)`를 전제하지만 발문에는 `E∈DC`, `F∈DA` 또는 이에 준하는 변 소속·정확한 배치가 없다. 해당 정보를 발문에 추가하거나 승인된 기하 배치를 먼저 확인해야 문제 그림이 허위 조건을 생성하지 않는다. `ENGINE_CAPABILITY_PENDING`이 아니라 `CONTENT_CONDITION_MISSING`으로 분리한다.
3. Q15 해설은 `[해설생성불가]`로, SVG 제작 여부와 별개의 학생 내용 결함이다. 본 plan-only 배치에서 JS는 변경하지 않는다.
4. 실제 SVG 생성·렌더, PNG 실물·학생 화면·A4 확인 및 학생용 연결은 `NOT_RUN`. `plan-lint` 통과가 시각검수 완료는 아니다.

## plan-lint 및 필드 1:1 재대조

- 2026-11-26, 원격 기준 main `b1b387659fbf953ef8bdf0d066f21b44c4aadf08`. 공식 `archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs`로 세 JSON 파일을 **각각 명시 전달**하여 검사(디렉터리만 전달하면 `*.plan.json`을 수집하지 않는 검사기 구현 주의).
- `--shallow`: Q13·Q16·Q22 **3/3 OK, FAIL 0, SKIP 0**.
- full: Q13·Q16·Q22 **3/3 OK, FAIL 0, SKIP 0**. `production/dependency-lock.json`에서 요구한 Noto Sans KR 파일의 SHA-256 `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252`를 검증해 공급하고, `runtime-package-lock.json`의 Node 의존성을 설치한 별도 작업 환경에서 실행함.
- Q13: 첫 행 A=−3·B=6, 둘째 행 C=−5·D=4. 이동량 각각 −2. 네 값과 두 행 라벨 모두 실제 그려지는 `numberLine.rows[].points/label`에 있음; 문제에는 정답 그림 없음.
- Q16: k=0 → `y=x²`, k=1 → `y=x²−4x+9`; 공통 직선 `y=5x/2−25/16`. 두 차이는 각각 `(x−5/4)²`, `(x−13/4)²`로 이중근이므로 접점 x=5/4·13/4를 독립 대조. `graphPlan.curves`의 세 식과 색·라벨이 실제 곡선 필드에 있고, 단순 예시 두 개임을 caption에 표시. 채움 없음, 문제에 정답 노출 없음.
- Q22: 왼쪽 L=−3, 대칭축 T=1, 오른쪽 R=2. LT=4·TR=1의 값은 `numberLine.rows[0].spans[].label`로 그려짐; caption에만 있는 거리값이 아님.
- 필수 점·좌표·선분·라벨·각·직각표식·비율 대조 결과: 위 세 계획에서 요구된 필드 누락 0. 이 세 그림은 평면각·직각표식 요구가 없으므로 해당 항목 N/A. Q18은 필수 도형 자체가 발문 위치 누락으로 미작성, `DRAWN_FEATURE_PARITY` PASS에 포함하지 않음.
- `ENGINE_CAPABILITY_PENDING`: 0축. `CONTENT_CONDITION_MISSING`: Q18 문제·해설 2축. **모든 44축 시각 완료를 주장하지 않음**.
