# SVG Plan 16건: 수정프로토콜 / 엔진개선 분리 장부 (2026-11-28)

## 범위와 판정 원칙

- 기준: `work/plan-repair-debt-fix-20261128` (`70a6d69f484215b2769d77019e300231116d5947`).
- 선행 540개 중 공식 shallow lint가 실패한 Plan 16개만 재분류한다. 기존의 `SOURCE_*` placeholder는 제작 Plan 또는 PASS가 아니다.
- **수정프로토콜 8건**: JS 문장·해설·도형 조건/자료의 불일치 또는 원본 도식의 필수 정보 누락을 먼저 해소해야 한다. 정답을 맞추려고 임의 좌표·자료를 생성하지 않는다.
- **엔진개선 8건**: 수학적 요구가 특정되지만 공식 엔진 계약으로 정확히 표현하기 어려운 도형·통계·선택지 조판. 엔진 기능 추가와 각 항목 Plan 이행을 별개로 기록한다.
- PLAN_ONLY: 실제 SVG 렌더·PNG 시각검수·게시 모두 `NOT_RUN`; `ARCHIVE_BOUND`/PASS를 선언하지 않는다. 원 시험지 JS·SVG는 이 장부 작업에서 수정하지 않았다.

## 수정프로토콜 8건

| 배치·번호 | Plan (`archive/exams/similar/middle/m3/` 이하) | 정확한 장애 | 다음 수정프로토콜 단계 |
| --- | --- | --- | --- |
| 01·25 | `2final/17_팔마중_2학기_기말_중3_유사_plans/q20-problem.plan.json` | 접선·할선 풀이에 AP=AT=3, PT=6이 함께 나와 삼각형 APT가 일직선으로 퇴화함. | 주어진 점의 순서·각 조건 및 해설의 전개를 수학 재검산한 뒤 JS 수정안 승인. |
| 02·17 | `2final/17_신흥중_2학기_기말_중3_유사_plans/q23-problem.plan.json` | DE=9, EB=3, E가 OC 중점, AB가 지름인 배치는 풀이의 반지름 6을 대입하면 명명 점의 중복 가능성이 생김. | 원문 도식과 점의 상대적 위치 확인. 중복·비퇴화 가능성을 판정한 뒤 좌표 작성. |
| 03·29 | `2final/21_왕의중_2학기_기말_중3_유사_plans/q18-problem.plan.json` | 전체 학생 20명의 산점도를 요구하나 현재 JS에서 5점만 특정됨. | 원도표에서 나머지 15점의 좌표를 복원하거나 도표를 요구하는 조건 자체를 정정. |
| 04·25 | `2final/16_왕의중_2학기_기말_중3_유사_plans/q18-problem.plan.json` | 접선·할선 풀이의 AP=AT=4, PT=8은 삼각형 APT를 퇴화시킴. | 길이·각·접선 조건의 정합성 확인 및 JS 수정안 확정. |
| 05·21 | `2final/21_매산중_2학기_기말_중3_유사_plans/q20-problem.plan.json` | 학생 20명의 산점도와 A~E 다섯 점을 언급하지만 실제 점 좌표가 없음. | 실제 도표 또는 점 데이터 확보. 20점의 좌표를 추측해 넣지 않음. |
| 07·17 | `1mid/23_연향중_1학기_중간_중3_유사_plans/q16-problem.plan.json` | 큰 직사각형에서 L자형을 제거하는 서술만으로 제거 영역의 배치·절단 위치가 특정되지 않음. | 원도식의 경계/치수 확인, 복원된 배치에 맞춰 Plan 작성. |
| 07·19 | `2final/15_왕의중_2학기_기말_중3_유사_plans/q16-problem.plan.json` | (가)~(라) 네 원주각 판정 그림의 배치가 텍스트만으로 불명확하고 해설 일부 점·삼각형 관계가 기하적으로 의심됨. | 각 선택지 원도식과 해설 점 관계를 대조하고 수정프로토콜로 확정. |
| 08·20 | `2final/23_풍덕중_2학기_기말_중3_유사_plans/q13-problem.plan.json` | “서로 외접하는 두 원의 공통현”은 일반적인 외접 조건과 양립하지 않음(공통점 하나). | 외접/교차 및 현의 대상이 정확히 무엇인지 원문·JS를 정정한 다음 Plan 작성. |

이 8건은 엔진 기능이 부족하다고 확정된 것이 아니다. 모두 `SOURCE_CORRECTION_REQUIRED / NOT_RUN`이며 이 장부만으로 JS나 정답을 자동 변경하지 않는다.

## 엔진개선 8건

| 배치·번호 | Plan (`archive/exams/similar/middle/m3/` 이하) | 필요한 엔진 계약과 작업 상태 |
| --- | --- | --- |
| 01·20 | `1final/20_연향중_1학기_기말_중3_유사_plans/q20-problem.plan.json` | 두 이차함수의 가로 대응/색칠 영역을 수학적으로 명세하는 `multi-curve` 영역 모델 확장 필요. `ENGINE_CAPABILITY_PENDING`. |
| 02·12 | `1final/17_경북대도중_1학기_기말_중3_유사_plans/q18-problem.plan.json` | **3개 반 도수분포다각형과 점수 중앙값 눈금**. 엔진 브랜치에 `FREQUENCY_POLYGON` 3계열·`xTickMode:MIDPOINT` 추가, Plan 전환. 공식 shallow/full lint OK; 실렌더 `NOT_RUN`. |
| 02·13 | `1final/17_경북대도중_1학기_기말_중3_유사_plans/q21-problem.plan.json` | **A/B/C 세 계열의 묶음 막대그래프**. 엔진 브랜치에 `GROUPED_BAR`·관측기 검사 추가, Plan 전환. 공식 shallow lint OK; 실렌더 `NOT_RUN`. |
| 02·18 | `2final/21_연향중_2학기_기말_중3_유사_plans/q07-problem.plan.json` | 탑의 3차원 지면 도형 및 30°/45°/60°와 `120√3`의 정확한 기하 조건 유지. 정확식 좌표·각 표시 계약 검토 필요. `ENGINE_CAPABILITY_PENDING`(구현 방식 미확정). |
| 03·14 | `1final/17_경북환호여중_1학기_기말_중3_유사_plans/q13-problem.plan.json` | **포물선 5개 보기의 동일 축척·2열 격자**. 엔진 브랜치에 `composite-panels-v1.choiceGrid` 추가, Plan 전환. 공식 shallow lint OK; 실렌더 `NOT_RUN`. |
| 04·16 | `1final/16_동원중_1학기_기말_중3_유사_plans/q20-problem.plan.json` | **포물선 선택지 ①~⑤**. 위 `choiceGrid` 계약 사용, 문제 그림에서 공식·정답 미노출 처리, Plan 전환. 공식 shallow lint OK; 실렌더 `NOT_RUN`. |
| 04·24 | `2final/16_왕의중_2학기_기말_중3_유사_plans/q13-problem.plan.json` | 두 접선과 원주각·주어진 각 40°/112°를 일치시키는 정확 기하 구성 검토 필요. `ENGINE_CAPABILITY_PENDING`(정확 기하 구성 판정 전). |
| 08·12 | `2final/19_왕운중_2학기_기말_중3_유사_plans/q17-problem.plan.json` | 원에 내접한 사각형과 두 연장선 교점, 25°/35° 각을 만족하는 정확 구성 검토 필요. `ENGINE_CAPABILITY_PENDING`(정확 기하 구성 판정 전). |

엔진 쪽은 별도 `work/plan-repair-engine-16-20261128` 브랜치에서 기능·관측기·계약·대표 Plan·회귀 테스트를 함께 변경한다. 기능이 들어간 항목도 실제 렌더 전에는 `ARCHIVE_BOUND`나 PASS가 아니다.

## 인계·실행 여부

| 구분 | 수 | 현재 결과 |
| --- | ---: | --- |
| 대상 | 16 | 16건 재분류 |
| 수정프로토콜 | 8 | 원도식/JS 재확인 필요, Plan PASS 0 |
| 엔진개선 | 8 | 4건 기능·Plan 이행 및 shallow lint OK, 나머지 4건 개선 대기 |
| 공식 shallow lint (수정 Plan만) | 4 | 4 OK / 0 FAIL |
| 엔진 회귀 단위 테스트 | 3 | 3 통과 |
| 실제 렌더·시각검수·게시 | 0 | 전부 `NOT_RUN` |

원문 재확인 시 수학적 모순이 아닌 단순 문구 누락임이 밝혀지면 `SOURCE_CORRECTION_REQUIRED`에서 Plan 수리로 바로 옮긴다. 반대로 기하 구성의 정확식이 기존 계약으로 가능하면 엔진 변경 없이 Plan만 작성한다. 분류는 수정 가능한 작업 큐이며 진짜 엔진 미지원 확정 판정과 구별한다.

**검증 한계:** 신규 그래프 격자 2건의 full lint는 체크아웃 환경에 폰트 `NotoSansKR.ttf`가 없어 조판 단계가 `ENOENT`로 끝났다. 이를 기능 미지원이나 Plan FAIL로 해석하지 않는다(`EVIDENCE_DEBT`). 통계 도수분포다각형 1건은 shallow/full lint 모두 OK다. 실제 렌더는 사용자 지정 PLAN_ONLY에 따라 전체 `NOT_RUN`이다.
