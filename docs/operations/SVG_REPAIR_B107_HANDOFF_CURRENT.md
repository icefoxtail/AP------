# B라인 SVG 엔진 후속 작업 장부

B라인 107건의 공식 렌더에서 10건이 `ARCHIVE_BOUND`였다. 성공 결과에 해당하는 SVG 9개와 엔진 변경은 [PR #3472](https://github.com/icefoxtail/AP------/pull/3472)에서 운영병합했다. 아래 97건은 2026-11-28 재검증 시점의 미해결 건이다. 담당자는 최신 `main`과 작업 중인 브랜치에서 후속 변경부터 확인한다.

기준 목록 SHA는 `93b1aa7a7165c7473b380a295a0bdc27eaf30622`이고, 원격 main에서 검증한 병합 SHA는 `a1a164913443610a6ef5c816c3f472696450454b`이다. 성공 판정에는 공식 lint와 `render-plan.mjs --accept-scored 1`의 `ARCHIVE_BOUND` 결과를 쓴다.

## 수리 순서

| 최종 오류 | 건수 | 다음 조치 |
| --- | ---: | --- |
| `LAYOUT_INVENTORY_INCOMPLETE` | 66 | 우선 소유 눈금과 라벨의 배치를 재현한다. 축 방향 이동과 반대편 배치, 짧은 지시선 후보를 순서대로 비교한다. 66건 중 57건에 미배치 축 눈금이 있다. |
| `TICK_LABEL_OWNER_LEADER_COORDINATE_INVALID` | 3 | 시작점과 끝점, 길이를 기록해 유한 좌표·최소 길이·최대 48px 중 어느 조건이 걸렸는지 확인한다. 배치 단계에서 동일 기준의 다른 후보를 찾는다. |
| `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 1 | 최종 SVG가 보고한 축 눈금의 간격과 정렬을 재현하고, 같은 장애물과 간격 기준으로 대체 경로를 선택한다. |
| `UNSUPPORTED_GRAPH_SCHEMA` | 15 | 배열형 mathPlan을 노드와 입력·출력 타입, 작도 근거가 기록된 정식 객체로 이관한다. 주어진 값과 유도값의 역할을 원문과 대조한다. |
| `COORDINATE_PANEL_NEEDS_HEADER_BAND` | 4 | 삼차 이상 그래프의 좌표 라벨을 점 지시선에 배치한다. 지시선으로 수용할 수 없는 경우 정식 상단 좌표 띠를 구현한다. |
| `COORDINATE_PANEL_TOO_TALL` | 2 | 그림 높이와 좌표 띠 높이를 별도로 확인하고, 중요한 좌표를 보존하면서 띠와 지시선을 적절히 배치한다. |
| `WORKER_TIMEOUT` | 6 | 같은 시간 한도로 반복 실패한 build 입력을 재현하고 함수별 실행 시간을 계측한다. 공통 병목이 확인되면 해당 계산만 최적화한다. |

## 미해결 97건

Plan 경로는 저장소 루트 기준이다. 미배치 라벨 열은 공식 렌더가 반환한 ID를 싣고, 반환값이 없는 경우 빈칸으로 둔다.

| 항목 | Plan 경로 | 문항 | 최종 오류 | 미배치 라벨 |
| --- | --- | --- | --- | --- |
| b001 | `archive/tools/geometry-equation/production/plans/미래엔_공통수학2_도형의방정식_대단원마무리_고1/q05-solution.plan.json` | q5 | `LAYOUT_INVENTORY_INCOMPLETE` | `curve-N-equation`, `tick-y-2-label` |
| b002 | `archive/tools/geometry-equation/production/plans/미래엔_대수_지수함수와로그함수_대단원마무리_고2/q13-solution.plan.json` | q13 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-1-label`, `tick-x-8-label` |
| b003 | `archive/tools/geometry-equation/production/plans/미래엔_대수_지수함수와로그함수_대단원마무리_고2/q18-solution.plan.json` | q18 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-2-label` |
| b004 | `archive/tools/geometry-equation/production/plans/미래엔_대수_지수함수와로그함수_중단원마무리_고2/q05-solution.plan.json` | q5 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label` |
| b005 | `archive/tools/geometry-equation/production/plans/미적분II_061_등비급수의합의활용_고2_유형은행1/q05-problem.plan.json` | q5 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-2-label` |
| b006 | `archive/tools/geometry-equation/production/plans/미적분II_082_지수함수로그함수의극한의활용1_고2_유형은행1/q03-problem.plan.json` | q3 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label` |
| b007 | `archive/tools/geometry-equation/production/plans/미적분II_090_미분가능을이용한미정계수결정_고2_유형은행1/q10-problem.plan.json` | q10 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label` |
| b008 | `archive/tools/geometry-equation/production/plans/미적분II_117_지수로그함수와삼각함수의극한의활용_고2_유형은행1/q04-problem.plan.json` | q4 | `LAYOUT_INVENTORY_INCOMPLETE` | `O-name`, `tick-x--1-label`, `tick-x--2-label`, `tick-x-1-label`, `tick-x-2-label` |
| b009 | `archive/tools/geometry-equation/production/plans/미적분II_258_구분구적법_고2_유형은행1/q01-problem.plan.json` | q1 | `LAYOUT_INVENTORY_INCOMPLETE` | `main-curve-name`, `tick-x-0.5-label`, `tick-x-1-label` |
| b010 | `archive/tools/geometry-equation/production/plans/미적분II_273_두도형의넓이가서로같은경우_고2_유형은행1/q03-problem.plan.json` | q3 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-2-label` |
| b011 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_도형의이동_집합_P102-105_20261023_유사50/q01-solution.plan.json` | qBV-BAKBAL-H-COM2-P102-Q01-T1-R1 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-1-label` |
| b012 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_도형의이동_집합_P102-105_20261023_유사50/q03-solution.plan.json` | qBV-BAKBAL-H-COM2-P102-Q01-S2-R1 | `TICK_LABEL_OWNER_LEADER_COORDINATE_INVALID` |  |
| b014 | `archive/exams/similar/high/h1/1mid/23_매산고_1학기_중간_고1_유사_plans/q11-solution.plan.json` | q11 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-1-label`, `tick-x-3-label` |
| b015 | `archive/exams/similar/high/h1/1mid/24_금당고_1학기_중간_고1_유사_plans/q19-solution.plan.json` | q19 | `LAYOUT_INVENTORY_INCOMPLETE` | `Q-name`, `curve-G-equation`, `tick-x-1-label`, `tick-x-1.666666667-label` |
| b016 | `archive/exams/similar/high/h1/1mid/24_여수고_1학기_중간_고1_유사_plans/q20-solution.plan.json` | q20 | `LAYOUT_INVENTORY_INCOMPLETE` | `overlay-name-sBC` |
| b017 | `archive/exams/similar/high/h1/1mid/25_팔마고_1학기_중간_고1_유사_plans/q08-solution.plan.json` | q8 | `LAYOUT_INVENTORY_INCOMPLETE` | `curve-quadratic-equation`, `tick-x-3-label`, `tick-y-1-label` |
| b018 | `archive/exams/similar/high/h1/2final/25_금당고_2학기_기말_고1_유사2_plans/q08-solution.plan.json` | q8 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x--1-label`, `tick-y-2-label` |
| b019 | `archive/exams/similar/high/h1/2final/25_순천고_2학기_기말_고1_유사3_plans/q23-solution.plan.json` | q23 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label`, `overlay-callout-lo`, `overlay-callout-ro`, `curve-left-start-coordinates` |
| b020 | `archive/exams/similar/high/h1/2mid/25_효천고_2학기_중간_고1_유사문제_plans/q18-solution.plan.json` | q18 | `COORDINATE_PANEL_TOO_TALL` |  |
| b021 | `archive/exams/similar/high/h2/1mid/23_매산여고_1학기_중간_고2_수학I_유사_plans/q21-solution.plan.json` | q21 | `WORKER_TIMEOUT` |  |
| b022 | `archive/exams/similar/high/h2/1mid/23_복성고_1학기_중간_고2_수학I_유사_plans/q13-problem.plan.json` | q13 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label`, `tick-y-9-label` |
| b023 | `archive/exams/similar/high/h2/1mid/23_복성고_1학기_중간_고2_수학I_유사_plans/q13-solution.plan.json` | q13 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label`, `tick-y-9-label` |
| b024 | `archive/exams/similar/high/h2/1mid/23_복성고_1학기_중간_고2_수학I_유사_plans/q21-problem.plan.json` | q21 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x--3-label`, `tick-x-3-label` |
| b026 | `archive/exams/similar/high/h2/1mid/23_순천고_1학기_중간_고2_수학I_유사_plans/q03-solution.plan.json` | q3 | `LAYOUT_INVENTORY_INCOMPLETE` | `B-name`, `E-coordinates` |
| b027 | `archive/exams/similar/high/h2/1mid/23_순천고_1학기_중간_고2_수학I_유사_plans/q12-problem.plan.json` | q12 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-2-label` |
| b028 | `archive/exams/similar/high/h2/1mid/23_순천고_1학기_중간_고2_수학I_유사_plans/q18-solution.plan.json` | q18 | `LAYOUT_INVENTORY_INCOMPLETE` | `reference-value` |
| b029 | `archive/exams/similar/high/h2/1mid/23_순천고_1학기_중간_고2_수학I_유사_plans/q22-solution.plan.json` | q22 | `LAYOUT_INVENTORY_INCOMPLETE` | `X-name` |
| b030 | `archive/exams/similar/high/h2/1mid/26_효천고_1학기_중간_고2_대수_유사2_plans/q16-solution.plan.json` | q16 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-12-label`, `tick-y-20-label` |
| b031 | `archive/exams/similar/high/h2/1mid/26_효천고_1학기_중간_고2_대수_유사2_plans/q23-solution.plan.json` | q23 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label` |
| b032 | `archive/exams/similar/high/h2/2final/25_매산고_2학기_기말_고2_수학II_유사_plans/q06-solution.plan.json` | q6 | `WORKER_TIMEOUT` |  |
| b033 | `archive/exams/similar/high/h2/2final/25_매산고_2학기_기말_고2_수학II_유사_plans/q17-solution.plan.json` | q17 | `COORDINATE_PANEL_NEEDS_HEADER_BAND` |  |
| b034 | `archive/exams/similar/high/h2/2final/25_매산고_2학기_기말_고2_수학II_유사_plans/q22-solution.plan.json` | q22 | `COORDINATE_PANEL_NEEDS_HEADER_BAND` |  |
| b035 | `archive/exams/similar/middle/m3/2mid/22_동산중_2학기_중간_중3_유사_plans/q14-problem.plan.json` | q14 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b036 | `archive/exams/similar/middle/m3/2mid/22_매산중_2학기_중간_중3_유사_plans/q14-problem.plan.json` | q14 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b037 | `archive/exams/similar/middle/m3/2mid/22_신흥중_2학기_중간_중3_유사_plans/q11-problem.plan.json` | q11 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b038 | `archive/exams/similar/middle/m3/2mid/22_신흥중_2학기_중간_중3_유사_plans/q13-problem.plan.json` | q13 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b039 | `archive/exams/similar/middle/m3/2mid/22_신흥중_2학기_중간_중3_유사_plans/q15-problem.plan.json` | q15 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b040 | `archive/exams/similar/middle/m3/2mid/22_신흥중_2학기_중간_중3_유사_plans/q20-problem.plan.json` | q20 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b041 | `archive/exams/similar/middle/m3/2mid/22_연향중_2학기_중간_중3_유사_plans/q05-problem.plan.json` | q5 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b042 | `archive/exams/similar/middle/m3/2mid/22_연향중_2학기_중간_중3_유사_plans/q16-problem.plan.json` | q16 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b043 | `archive/exams/similar/middle/m3/2mid/22_연향중_2학기_중간_중3_유사_plans/q19-problem.plan.json` | q19 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b044 | `archive/exams/similar/middle/m3/2mid/22_이수중_2학기_중간_중3_유사_plans/q08-problem.plan.json` | q8 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b045 | `archive/exams/similar/middle/m3/2mid/22_이수중_2학기_중간_중3_유사_plans/q09-problem.plan.json` | q9 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b046 | `archive/exams/similar/middle/m3/2mid/22_이수중_2학기_중간_중3_유사_plans/q11-problem.plan.json` | q11 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b047 | `archive/exams/similar/middle/m3/2mid/22_이수중_2학기_중간_중3_유사_plans/q21-problem.plan.json` | q21 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b048 | `archive/exams/similar/middle/m3/2mid/22_이수중_2학기_중간_중3_유사_plans/q22-problem.plan.json` | q22 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b049 | `archive/exams/similar/middle/m3/2mid/22_이수중_2학기_중간_중3_유사_plans/q23-problem.plan.json` | q23 | `UNSUPPORTED_GRAPH_SCHEMA` |  |
| b050 | `archive/exams/similar/high/h2/1mid/21_순천고_1학기_중간_고2_수학I_유사_plans/q04-solution.plan.json` | q4 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x--1-label`, `tick-x-1-label` |
| b052 | `archive/exams/similar/high/h2/1mid/21_제일고_1학기_중간_고2_수학I_유사_plans/q20-problem.plan.json` | q20 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-2-label` |
| b053 | `archive/exams/similar/high/h2/1mid/21_제일고_1학기_중간_고2_수학I_유사_plans/q20-solution.plan.json` | q20 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-2-label` |
| b055 | `archive/tools/geometry-equation/production/plans/21_팔마중_2학기_중간_중3_수학/q21-solution.plan.json` | q21 | `LAYOUT_INVENTORY_INCOMPLETE` | `length0`, `length1`, `length2`, `length3`, `length4`, `length5`, `length6`, `length7`, `length8` |
| b056 | `archive/tools/geometry-equation/production/plans/23_금당중_2학기_중간_중1_기출/q01-problem.plan.json` | q1 | `TICK_LABEL_OWNER_LEADER_COORDINATE_INVALID` |  |
| b057 | `archive/tools/geometry-equation/production/plans/23_금당중_2학기_중간_중1_기출/q01-solution.plan.json` | q1 | `TICK_LABEL_OWNER_LEADER_COORDINATE_INVALID` |  |
| b058 | `archive/tools/geometry-equation/production/plans/21_풍덕중_2학기_기말_중2_기출/q8-solution.plan.json` | q8 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-2-label` |
| b059 | `archive/tools/geometry-equation/production/plans/23_금당중_2학기_기말_중2_기출/q23-solution.plan.json` | q23 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label`, `required-point-2-coordinate-panel`, `required-point-1-name` |
| b060 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_학평기출_P66-70_20261022_유사50/q07-solution.plan.json` | qBV-BAKBAL-H-COM2-P67-Q03-T1-R3 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label`, `diameter` |
| b061 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_학평기출_P66-70_20261022_유사50/q08-solution.plan.json` | qBV-BAKBAL-H-COM2-P67-Q03-S1-R3 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label`, `tick-y-3-label`, `diameter` |
| b062 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P138-141_20261023_유사50/q42-solution.plan.json` | qBV-BAKBAL-H-COM2-P141-Q16-S1-R1 | `COORDINATE_PANEL_TOO_TALL` |  |
| b063 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P146-149_20261023_유사50/q17-solution.plan.json` | qBV-BAKBAL-H-COM2-P147-Q06-S1-R1 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` |  |
| b064 | `archive/tools/geometry-equation/production/plans/26_왕의중_1학기_기말_중2_기출/q17-problem.plan.json` | q17 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x--3-label`, `tick-y-3-label`, `tick-y-9-label` |
| b067 | `archive/exams/similar/high/h1/2final/25_효천고_2학기_기말_고1_유사3_plans/q08-solution.plan.json` | q8 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-1.5-label`, `tick-y-1-label` |
| b068 | `archive/exams/similar/high/h1/2final/25_효천고_2학기_기말_고1_유사3_plans/q11-solution.plan.json` | q11 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-2-label`, `curve-finv-equation`, `curve-f-start-coordinates` |
| b069 | `archive/exams/similar/high/h1/2final/25_효천고_2학기_기말_고1_유사3_plans/q12-solution.plan.json` | q12 | `LAYOUT_INVENTORY_INCOMPLETE` | `C-coordinates` |
| b070 | `archive/exams/similar/high/h1/2final/25_제일고_2학기_기말_고1_유사2_plans/q20-solution.plan.json` | q20 | `LAYOUT_INVENTORY_INCOMPLETE` | `overlay-segment-PQ-length` |
| b071 | `archive/exams/similar/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2_유사3_plans/q15-solution.plan.json` | q15 | `LAYOUT_INVENTORY_INCOMPLETE` | `overlay-segment-PQ-length` |
| b072 | `archive/tools/geometry-equation/production/plans/26_제일고_1학기_중간_고2_대수_유사/q18-solution.plan.json` | q18 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-2-label` |
| b074 | `archive/tools/geometry-equation/production/plans/비상_확률과통계_확률분포_중단원학습점검_고2/q11-solution.plan.json` | q11 | `WORKER_TIMEOUT` |  |
| b075 | `archive/tools/geometry-equation/production/plans/비상_확률과통계_통계_대단원학습평가_고2/q05-solution.plan.json` | q5 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-0.4-label`, `required-point-2-name`, `region-S-label` |
| b076 | `archive/tools/geometry-equation/production/plans/비상_미적분1_적분_대단원학습평가_고2/q08-solution.plan.json` | q8 | `WORKER_TIMEOUT` |  |
| b077 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_대단원학습평가_고2/q04-solution.plan.json` | q4 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x--1-label`, `tick-x-3-label` |
| b078 | `archive/tools/geometry-equation/production/plans/비상_대수_지수함수와로그함수_익힘책_고2/q23-solution.plan.json` | q23 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-1-label` |
| b079 | `archive/tools/geometry-equation/production/plans/비상_대수_지수함수와로그함수_익힘책_고2/q25-solution.plan.json` | q25 | `LAYOUT_INVENTORY_INCOMPLETE` | `M-name`, `tick-x-1-label` |
| b081 | `archive/tools/geometry-equation/production/plans/비상_대수_지수함수와로그함수_중단원학습점검_고2/q01-solution.plan.json` | q1 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label`, `B-coordinates` |
| b082 | `archive/tools/geometry-equation/production/plans/비상_대수_지수함수와로그함수_중단원학습점검_고2/q08-solution.plan.json` | q8 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x--2-label`, `tick-y-1-label`, `B-coordinates`, `overlay-segment-AB-length`, `overlay-segment-OH-length` |
| b083 | `archive/tools/geometry-equation/production/plans/비상_대수_지수함수와로그함수_중단원학습점검_고2/q12-problem.plan.json` | q12 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-1-label` |
| b084 | `archive/tools/geometry-equation/production/plans/비상_대수_지수함수와로그함수_중단원학습점검_고2/q12-solution.plan.json` | q12 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-1-label` |
| b085 | `archive/tools/geometry-equation/production/plans/비상_대수_지수함수와로그함수_중단원학습점검_고2/q16-solution.plan.json` | q16 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-1-label`, `tick-y-2-label`, `H-name`, `curve-log-equation`, `overlay-segment-PR-length`, `overlay-segment-QH-length` |
| b087 | `archive/tools/geometry-equation/production/plans/비상_대수_지수함수와로그함수_대단원학습평가_고2/q08-problem.plan.json` | q8 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label`, `tick-y-4-label` |
| b088 | `archive/tools/geometry-equation/production/plans/비상_대수_지수함수와로그함수_대단원학습평가_고2/q08-solution.plan.json` | q8 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label`, `tick-y-4-label` |
| b089 | `archive/tools/geometry-equation/production/plans/비상_기하_도형의방정식_중단원학습점검_고2/q04-solution.plan.json` | q4 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x--1-label`, `tick-y--0.6666666667-label` |
| b090 | `archive/tools/geometry-equation/production/plans/비상_공통수학1_이차방정식과이차함수_중단원학습점검_고1/q08-solution.plan.json` | q8 | `LAYOUT_INVENTORY_INCOMPLETE` | `curve-f-equation`, `tick-y-5-label` |
| b091 | `archive/tools/geometry-equation/production/plans/비상_공통수학1_이차방정식과이차함수_중단원학습점검_고1/q11-problem.plan.json` | q11 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x--2-label`, `tick-x-2-label`, `tick-y--4-label`, `tick-y-2-label` |
| b092 | `archive/tools/geometry-equation/production/plans/비상_공통수학1_이차방정식과이차함수_중단원학습점검_고1/q11-solution.plan.json` | q11 | `LAYOUT_INVENTORY_INCOMPLETE` | `curve-upper-equation`, `tick-x--2-label`, `tick-x-2-label`, `tick-y--4-label`, `tick-y-2-label`, `overlay-segment-AB-length`, `overlay-segment-DA-length` |
| b093 | `archive/tools/geometry-equation/production/plans/AP수학학원_1학기_기말_중1_모의고사_1회/q24-solution.plan.json` | q24 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x--2-label`, `tick-x-1-label`, `tick-y--2-label`, `D-name` |
| b094 | `archive/tools/geometry-equation/production/plans/비상_미적분1_적분_익힘책_고2/q18-solution.plan.json` | q18 | `WORKER_TIMEOUT` |  |
| b095 | `archive/tools/geometry-equation/production/plans/비상_미적분1_정적분의활용_중단원학습점검_고2/q04-solution.plan.json` | q4 | `WORKER_TIMEOUT` |  |
| b096 | `archive/tools/geometry-equation/production/plans/19_매산여고_1학기_중간_고2_수학I_유사/q06-solution.plan.json` | q6 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label` |
| b097 | `archive/tools/geometry-equation/production/plans/19_매산여고_1학기_중간_고2_수학I_유사/q18-solution.plan.json` | q18 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y-1-label` |
| b098 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q09-solution.json` | q9 | `COORDINATE_PANEL_NEEDS_HEADER_BAND` |  |
| b099 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q16-solution.json` | q16 | `COORDINATE_PANEL_NEEDS_HEADER_BAND` |  |
| b100 | `archive/tools/geometry-equation/production/plans/비상_미적분1_도함수의활용_중단원학습점검_고2/q03-solution.plan.json` | q3 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-1-label`, `B-name` |
| b101 | `archive/tools/geometry-equation/production/plans/비상_미적분1_도함수의활용_중단원학습점검_고2/q09-solution.plan.json` | q9 | `LAYOUT_INVENTORY_INCOMPLETE` | `overlay-line-lower-equation`, `overlay-line-upper-equation`, `tick-y--4-label` |
| b102 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_대단원학습평가_고2/q12-solution.plan.json` | q12 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-y--5-label`, `overlay-line-zero-equation` |
| b103 | `archive/tools/geometry-equation/production/plans/21_순천고_1학기_중간_고2_수학I_유사/q04-solution.plan.json` | q4 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x--1-label`, `tick-x-1-label` |
| b105 | `archive/tools/geometry-equation/production/plans/21_제일고_1학기_중간_고2_수학I_유사/q20-problem.plan.json` | q20 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-2-label` |
| b106 | `archive/tools/geometry-equation/production/plans/21_제일고_1학기_중간_고2_수학I_유사/q20-solution.plan.json` | q20 | `LAYOUT_INVENTORY_INCOMPLETE` | `tick-x-2-label` |
| b107 | `archive/tools/geometry-equation/production/plans/비상_공통수학2_도형의방정식_대단원학습평가_고1/q05-solution.plan.json` | q5 | `LAYOUT_INVENTORY_INCOMPLETE` | `C-name`, `D-name`, `H-name` |
