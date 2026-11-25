# 2025 금당고 고1 2학기 기말 유사2 — 문제·해설 2축 SVG plan 검수

- 대상 JS: `archive/exams/similar/high/h1/2final/25_금당고_2학기_기말_고1_유사2.js`, Q01~Q22 (22문항, 44축).
- 직접 대조한 JS Git blob: `846a0eb87e4a6f97aac5edbc114c6fbed37989ea`.
- 최초 원격 `main` 점검: `ebe100516966e9962cbfd6c994d2886ac9b89dbc`. PR #3056은 별도 **제일고 1학기 중간** 22문항 전체를 다루는 열린 작업이므로 제일고는 중복 진행하지 않음. 금당고 유사2를 변경하는 열린 PR은 확인되지 않음.
- 이 장부와 실행 plan 2개만 신규 작성. 유사 세트 경로 규칙대로 `<stem>_plans/`에 저장. 시험지 JS·기존 SVG·유형은행·교과서·엔진은 수정하지 않음.
- 기존 `image`/`solutionImage`에 연결된 그림은 재생산하지 않음. 그 자산은 새 plan의 PARITY 및 실제 렌더 품질 검사 대상으로 세지 않고 `EXISTING_ASSET / NOT_RUN`으로 표시한다. 기존 그림이 있다고 해서 무조건 새 plan이 필요한 것은 아니다.

| qid | 문제 축 판정과 개별 사유 | 해설 축 판정과 개별 사유 | 실제 신규 plan 또는 기존 자산 | 신규 plan DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- |
| Q01 | EXEMPT — 집합인지는 '가깝다/많다'의 기준 모호성 판별로 충분 | EXEMPT — 원소를 확정할 수 있는지 언어·열거로 검사 | — | N/A |
| Q02 | EXEMPT — 12의 약수 집합과 부분집합 보기만 대조 | EXEMPT — 원소 포함 여부의 직접 열거·배제 | — | N/A |
| Q03 | EXEMPT — 두 집합이 같은 원소를 가진다는 식 조건 | EXEMPT — a−1=5, b+3=7의 단순 대응식 | — | N/A |
| Q04 | EXEMPT — 대우 참·거짓에 관한 기호 명제 | EXEMPT — 대우 q→¬p를 식으로 이미 제시 | — | N/A |
| Q05 | EXEMPT — 두 진리집합을 부등식으로 모두 명시 | BENEFICIAL — P=[1,5], Q=[1,4]의 포함관계 시각화; 기존 SVG 연결 | 기존 `q05-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q06 | REQUIRED — '그림과 같을 때'의 함수 X→Y 화살표가 문제 조건; 기존 문제 SVG 연결 | BENEFICIAL — f(1)=f(2)=2와 치역·일대일성 비교; 기존 해설 SVG 연결 | 기존 `q06-problem.svg`, `q06-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q07 | EXEMPT — 두 함수의 합성값 대입식 | EXEMPT — f(2)=1, g(1)=1+a의 대수 계산 | — | N/A |
| Q08 | EXEMPT — 미정 a,b를 확정해 그리면 답을 먼저 노출함 | BENEFICIAL — f와 f⁻¹의 y=x 대칭 및 (2,7)↔(7,2), (13,5) 대응 | `q08-solution.plan.json` | PASS |
| Q09 | EXEMPT — 대칭축 두 식만으로 조건이 완전하며 미지 k 그래프는 답 유출 | BENEFICIAL — 대칭축 교점과 유리함수 점근선·관통점; 기존 SVG 연결 | 기존 `q09-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q10 | EXEMPT — 근호의 실수 조건은 발문 식 자체에 있음 | BENEFICIAL — -4≤x<3의 정수해 7개 범위; 기존 SVG 연결 | 기존 `q10-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q11 | EXEMPT — 약수 집합의 포함 조건을 기호로 명시 | BENEFICIAL — A₆⊆Aₙ⊆A₂₄의 포함 구조·후보 정수 비교; 기존 SVG 연결 | 기존 `q11-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q12 | EXEMPT — 두 실수에 대한 함의는 수식·문장으로 완결 | BENEFICIAL — 반례 경계 x>2, y>−1과 3x+4y>2의 관계; 기존 SVG 연결 | 기존 `q12-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q13 | EXEMPT — xy=12와 목적식 3x+4y는 완전한 대수 조건 | EXEMPT — 산술·기하평균 등호 3x=4y를 식으로 바로 확인 | — | N/A |
| Q14 | EXEMPT — 함수 x↦x+3 mod4가 문장으로 정의됨 | BENEFICIAL — 0→3→2→1→0의 4주기 순환; 기존 SVG 연결 | 기존 `q14-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q15 | EXEMPT — k 미정의 포물선·역함수 교점을 특정하면 정답 노출 | BENEFICIAL — y=x 위 두 교점 간 거리와 대칭; 기존 SVG 연결 | 기존 `q15-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q16 | REQUIRED — 발문이 무리함수의 '그림'을 직접 조건으로 사용; 기존 문제 SVG 연결 | BENEFICIAL — 시작점·통과점으로 얻은 유리함수의 점근선과 사분면; 기존 SVG 연결 | 기존 `q16-problem.svg`, `q16-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q17 | EXEMPT — 집합 A,B,C와 원소 합·개수 조건은 문장·식으로 완결 | BENEFICIAL — 개수로 얻는 정수 구간 [32,47]와 약수 조건으로 좁힌 35,42를 한 눈금에서 구별 | `q17-solution.plan.json` | PASS |
| Q18 | EXEMPT — 미지 k의 직선을 특정하고 지름원까지 그리면 풀이의 핵심을 선공개 | BENEFICIAL — ∠APB=90°인 자취인 지름원과 직선-원의 거리; 기존 SVG 연결 | 기존 `q18-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q19 | EXEMPT — k 미정인 절댓값 이차함수의 삼근 구조를 정답 위치로 고정하지 않음 | BENEFICIAL — 절댓값 이차곡선과 수평선의 교점 3개; 기존 SVG 연결 | 기존 `q19-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q20 | EXEMPT — 미지 a,b인 구간별 함수를 선결정하여 보여 주지 않음 | BENEFICIAL — x=2 분기에서 두 치역이 서로 겹치지 않는 역함수 조건; 기존 SVG 연결 | 기존 `q20-solution.svg` | EXISTING_ASSET / NOT_RUN |
| Q21 | EXEMPT — 서로소의 뜻과 유한집합 두 개가 정확히 주어짐 | EXEMPT — a+1≠1,3,5라는 세 식 반복 그림은 추가 정보 없음; 기존 SVG는 그대로 유지 | 기존 `q21-solution.svg` 보존 | EXISTING_ASSET / NOT_RUN |
| Q22 | EXEMPT — 미지 k 직선의 정확한 위치를 제시하면 가능한 범위를 선공개 | BENEFICIAL — 무리함수와 움직이는 직선의 두 교점·경계 접점; 기존 SVG 연결 | 기존 `q22-solution.svg` | EXISTING_ASSET / NOT_RUN |

**축 합계:** 문제 22 = REQUIRED 2(둘 다 기존 그림 연결) + EXEMPT 20. 해설 22 = BENEFICIAL 15(신규 plan 2, 기존 연결 13) + EXEMPT 7. 신규 plan 총 2개, 파일 총 3개(장부 포함). 기존 그림의 시각 품질은 본 plan-only 작업에서 `NOT_RUN`이며, 판정에서 누락된 문항·축은 0개다.

## DRAWN_FEATURE_PARITY — 원문과 엔진 출력 가능 필드의 독립 1:1 검증

| plan | 원문으로부터의 독립 계산 | 실제 그려지는 필드 | 판정 |
| --- | --- | --- | --- |
| `q08-solution` | f(−1)=1, f(2)=7 ⇒ f(x)=2x+3. 역함수 y=(x−3)/2, 역대응 (2,7)↔(7,2), f⁻¹(13)=5 | `graphPlan.curves[f]` LINE `[3,2]`, `curves[inverse].inverseOf=f`(정확 영역 `[-1,15]`), `curves[mirror]` 점선 y=x, `overlays.points[A,B,C,D]` = (−1,1),(2,7),(7,2),(13,5), 표시 눈금 x·y | **PASS** |
| `q17-solution` | A={2,3,5,7}, A∩C=∅. 12≤4+⌊k/4⌋≤15 ⇒ 32≤k≤47. 그 범위에서 약수의 일자리 소수 합이 12인 k는 35,42뿐 | `numberLine.rows[0].pieces` 닫힌 [32,47]·`integerPoints:true`; `rows[1].points[K1,K2]`=35,42 및 `within:1`로 앞 구간에 속함 판정 | **PASS** |

- 별도 재계산 스크립트(커밋하지 않은 임시 검사)로 Q08의 직선·역함수 식, 대응 좌표·x축/y축 눈금·대칭선과 Q17의 유한 정수 전수 탐색(1≤k≤500), 닫힌 구간·점 값·구간 포함 관계를 비교했다. 코드의 출력: 두 plan 모두 `DRAWN_FEATURE_PARITY PASS`.
- Q08의 실제 표시선은 3개, 실제 표시점은 4개이며 문제축에 미리 그린 정답 그래프는 없다. Q17의 문제축도 신규 그림이 없어 답을 노출하지 않는다. 신규 plan 2건 모두 색을 칠하는 `regions`/`polygons`가 없고, Q17의 BLUE는 수직선 **선분 색**일 뿐 면 채움이 아니다.
- 각도·직각표식·도형 변 길이는 이 2개 **함수/수직선 plan**의 원문에 요구되지 않아 N/A. `sourceConditions.mappedTo` 문장만 확인한 것이 아니라 `curves`, `points`, `pieces`의 **실제 렌더 필드**까지 대조했다.
- `ENGINE_CAPABILITY_PENDING`: 0건. 실제 SVG/PNG 렌더, 학생 화면, A4, JS 연결은 **NOT_RUN**. lint·수학적 필드 동치만으로 학생 시각품질 완료를 주장하지 않는다.

## 공식 검사

- `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow archive/exams/similar/high/h1/2final/25_금당고_2학기_기말_고1_유사2_plans/*.plan.json` ⇒ 2 OK / 0 FAIL / 0 SKIP.
- 같은 명령에서 `--shallow`을 제거한 full ⇒ 2 OK / 0 FAIL / 0 SKIP.
- full 의존성: `production/dependency-lock.json`에 고정된 Noto Sans KR 해시 `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252` 확인, `runtime-package-lock.json`의 npm `ci` 설치. 설치 파일과 임시 검산 코드는 Git에 포함하지 않음.
- 검수 분모를 줄이지 않았으며 둘 다 실제 렌더 가능한 capability를 사용한다. 가짜 `EXEMPT` JSON이나 수작업 SVG는 만들지 않았다.
