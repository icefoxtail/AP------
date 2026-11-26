# 왕운중 2023 중3 1학기 중간 유사2 — SVG 플랜 검토 (1차 12문항)

- 대상: `23_왕운중_1학기_중간_중3_유사2.js`의 `id=1`~`12` (24축). `id=13`~`24`는 이번 회차 미검토.
- 문제(`content`·보기)와 해설(`solution`)을 독립 2축으로 판정. `EXEMPT`는 사유 기록만 하고 렌더 가능한 빈 plan을 생성하지 않는다.
- 원문 JS 변경 없음. 이번 계획의 SVG 렌더, 실물 PNG, 학생 화면, A4 및 JS 이미지 연결은 전부 `NOT_RUN`.

| qid | 문제 축 판정 및 이유 | 해설 축 판정 및 이유 |
| --- | --- | --- |
| q01 | **EXEMPT** — 제곱근 간단히 하기 다섯 식의 오류 찾기. | **EXEMPT** — 다섯 근호를 `a√b`로 바꾸는 단계별 대수식이 충분. |
| q02 | **EXEMPT** — `(2x−3)(x+5)` 전개 후 계수 차를 묻는 식. | **EXEMPT** — 분배법칙·동류항 묶기만 사용. |
| q03 | **EXEMPT** — 여섯 수의 유리수·무리수 여부를 수식으로 판단. | **EXEMPT** — 각 값의 분류·근호 정리로 충분; 수직선은 반복. |
| q04 | **EXEMPT** — 완전제곱식 두 개의 계수 비교. | **EXEMPT** — `a=25`, `b=12`를 전개 계수만으로 도출. |
| q05 | **EXEMPT** — 읽어야 할 제곱근표가 HTML 표로 본문에 이미 있다. | **EXEMPT** — 각 행·열의 교점과 두 수의 합이 글과 표만으로 추적 가능. |
| q06 | **EXEMPT** — 별도 HTML 제곱근표 제공, `√323` 자리 변환만 필요. | **EXEMPT** — `√3.23×10`과 표 3.2행/3열의 숫자를 글로 완결. |
| q07 | **EXEMPT** — 무리수 대소관계가 보기 식으로 완결. | **EXEMPT** — 비교·이항·제곱근 환산의 설명에 시각적 구성 없음. |
| q08 | **EXEMPT** — `55²−45²` 합차 공식을 이용한 산술. | **EXEMPT** — `(55+45)(55−45)` 계산이 직접적이므로 그림은 장식. |
| q09 | **BENEFICIAL** — 점 A(3), 가로 1·세로 2 직각삼각형의 빗변, 양의 방향으로 옮긴 미지점 P를 시각화. `q09-problem.plan.json`. 정답 값 표기는 금지. | **BENEFICIAL** — 빗변 `√5`를 컴퍼스로 옮겨 `P=3+√5`가 되는 과정을 시각화. `q09-solution.plan.json`. |
| q10 | **EXEMPT** — `2x²+7x+3` 인수분해 후 일차식 합 계산. | **EXEMPT** — 십자곱 조건을 식 `(2x+1)(x+3)`으로 직접 확인 가능. |
| q11 | **EXEMPT** — 다섯 다항식의 완전제곱식 성립 여부 비교. | **EXEMPT** — 계수 조건과 식 전개를 명시, 도형 없이 완결. |
| q12 | **EXEMPT** — 근호 포함 곱셈·나눗셈의 식 계산. | **EXEMPT** — 인수 정리와 `√3·√3=3` 계산 자체가 해설. |

## q09 원문 ↔ 실제 그려지는 필드 비교

| 원문 정보 | 문제 plan 필드 | 해설 plan 필드 | 별도 PARITY 판단 |
| --- | --- | --- | --- |
| 시작점 A(3) | `numberLine.rows[0].points[0]` = `A`, `value:3`, 값 표시 | 동일 | PASS — 점과 값 |
| 밑변 길이 1 | `numberLine.constructions[0].source.from=[3,0]`, `to=[4,2]`: 가로 한 격자 칸 | 동일 | PASS — 1단위 실제 격자 간격 |
| 높이 2 | 위 source의 두 격자 행 (`to[1]=2`) | 동일 | PASS — 2단위 실제 격자 간격 |
| 직각삼각형 | source의 수평·수직 격자선과 `[3,0]`→`[4,2]` 빗변 | 동일 | **ENGINE_CAPABILITY_PENDING** — GRID 작도에는 직각 *네모 표식*을 출력하는 필드가 없음. 직각성은 보이지만 원문이 말한 직각 표식까지 그린 것은 아님. |
| 양의 방향 이동 | `arc.side=RIGHT`, `hits[0].branch=RIGHT`, 반지름 `sqrt(5)` | 동일 | PASS — A에서 P로 호가 오른쪽으로 이동 |
| 미지점 P의 값 | `points[1].value=3+sqrt(5)`은 엔진의 위치 계산용, **`showValue:false`** | **`showValue:true`**, P 아래 `3+√5` 표기 | PASS — 문제 정답 비노출 / 해설 과정·결과 표기 |
| 면 채움 | 설정 없음 | 설정 없음 | PASS — 흰 바탕·선분과 점만 |

### 이번 배치의 기술 상태와 인계

- 공식 `plan-lint.cjs --shallow`: q09-problem **PASS**, q09-solution **PASS**.
- 공식 `plan-lint.cjs`(full): q09-problem **PASS**, q09-solution **PASS**. 수직선 capability의 공식 전개·모델·패널 크기 검사 경로 확인(수직선에서는 full도 Python/MathJax를 호출하지 않음).
- `DRAWN_FEATURE_PARITY`: 두 plan 모두 **ENGINE_CAPABILITY_PENDING**. 부족한 기능은 **`number-line-figure-v1`의 `constructions.source.grid`에서 직각 꼭짓점 `[4,0]`에 네모 직각표식을 생성하는 옵션**(예: `rightAngleAt`), 해당 표식의 관측기 확인이다. 사각표식 누락을 `caption`만으로 PASS 처리하지 않는다. 구현 범위는 시험지 라인 밖이므로 엔진 담당 후속 작업.
- 실제 렌더·PNG 눈검수·학생 화면·A4·JS `image/solutionImage` 게시: **NOT_RUN**. 본 문서의 `PASS`는 lint에만 해당한다.
- 검수 집계: `12문항 × 2축=24축`, 문제 EXEMPT 11 / BENEFICIAL 1, 해설 EXEMPT 11 / BENEFICIAL 1. 실 plan 2개, lint shallow/full 각 2 PASS, PARITY PASS 0 / ENGINE_CAPABILITY_PENDING 2.
