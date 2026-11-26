# 20_금당중_2학기_중간_중2_수학: QID/축 별 DRAWN_FEATURE_PARITY 검수

- 원문 24 qid × 2 축 = 48행. 공식 플랜 45개, shallow/full 모두 PASS.
- 텍스트 축은 EXEMPT_NO_VISUAL. 원본 스캔 불일치는 EVIDENCE_DEBT. 엔진 기능 부족은 ENGINE_CAPABILITY_PENDING이며 아래 필요 기능을 명시한다.
- 렌더/PNG/학생화면/A4: 환경 장애(Chrome 배포본 없음)로 NOT_RUN. plan-lint PASS와 최종 학생용 SVG parity 검수를 동일시하지 않는다.
- 새 plan은 손 SVG나 명시적 흰색 배경·불필요한 면 채움을 포함하지 않는다. 표와 벤다이어그램의 의미 있는 강조는 예외다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 금당/01 | problem | B=70°, C=40°, BC=6과 이등변 선분 판정 | construction-spike-v1 | q01-problem.plan.json | PASS/PASS | PASS |
| 금당/01 | solution | B=70°, C=40°, BC=6과 이등변 선분 판정 | construction-spike-v1 | q01-solution.plan.json | PASS/PASS | PASS |
| 금당/02 | problem | 원본 q02.png에 6번 도형·프로그램 UI가 잘못 잘려 들어옴; 본문/해설의 동일선분 5개는 구현 | 원본 q02 정상 스캔 재확보 | q02-problem.plan.json | PASS/PASS | EVIDENCE_DEBT |
| 금당/02 | solution | 원본 PNG가 다른 문항; 본문·해설의 외각 20→40→60→80 추적은 구현 | 원본 q02 정상 스캔 재확보 | q02-solution.plan.json | PASS/PASS | EVIDENCE_DEBT |
| 금당/03 | problem | 기하 프로그램 화면의 툴바/측정창 미지원; 수학적 선분·각은 구현 | DYNAMIC_GEOMETRY_SCREENSHOT_UI | q03-problem.plan.json | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 금당/03 | solution | B=C, A의 각 이등분선 AD와 D의 직각 | construction-spike-v1 | q03-solution.plan.json | PASS/PASS | PASS |
| 금당/04 | problem | 네 직각삼각형의 빗변 7·예각 40°/50°·RHA 비교 | composite-panels-v1 | q04-problem.plan.json | PASS/PASS | PASS |
| 금당/04 | solution | 네 직각삼각형의 빗변 7·예각 40°/50°·RHA 비교 | composite-panels-v1 | q04-solution.plan.json | PASS/PASS | PASS |
| 금당/05 | problem | A=48°, B/ED 직각, BC=DC 등분선 | construction-spike-v1 | q05-problem.plan.json | PASS/PASS | PASS |
| 금당/05 | solution | A=48°, B/ED 직각, BC=DC 등분선 | construction-spike-v1 | q05-solution.plan.json | PASS/PASS | PASS |
| 금당/06 | problem | 세 변의 수직이등분선·점선 PD/PE/PF·직각 | construction-spike-v1 | q06-problem.plan.json | PASS/PASS | PASS |
| 금당/06 | solution | 세 변의 수직이등분선·점선 PD/PE/PF·직각 | construction-spike-v1 | q06-solution.plan.json | PASS/PASS | PASS |
| 금당/07 | problem | 외심 OA/OB/OC와 29°·31°·x | construction-spike-v1 | q07-problem.plan.json | PASS/PASS | PASS |
| 금당/07 | solution | 외심 OA/OB/OC와 29°·31°·x | construction-spike-v1 | q7-solution.plan.json | PASS/PASS | PASS |
| 금당/08 | problem | 내심 IA/IB/IC와 29°·31°·x | construction-spike-v1 | q08-problem.plan.json | PASS/PASS | PASS |
| 금당/08 | solution | 내심 IA/IB/IC와 29°·31°·x | construction-spike-v1 | q8-solution.plan.json | PASS/PASS | PASS |
| 금당/09 | problem | 외심의 반지름 연결과 B=50° | construction-spike-v1 | q09-problem.plan.json | PASS/PASS | PASS |
| 금당/09 | solution | 외심의 반지름 연결과 B=50° | construction-spike-v1 | q9-solution.plan.json | PASS/PASS | PASS |
| 금당/10 | problem | 기존 4cm가 CE로 잘못 붙음 → 원본 ID=4cm 수선으로 수정 | construction-spike-v1 | q10-problem.plan.json | PASS/PASS | PASS |
| 금당/10 | solution | 기존 4cm가 CE로 잘못 붙음 → 원본 ID=4cm 수선으로 수정 | construction-spike-v1 | q10-solution.plan.json | PASS/PASS | PASS |
| 금당/11 | problem | 내심을 통과한 연장선 AD/BE와 C=58° | construction-spike-v1 | q11-problem.plan.json | PASS/PASS | PASS |
| 금당/11 | solution | 내심을 통과한 연장선 AD/BE와 C=58° | construction-spike-v1 | q11-solution.plan.json | PASS/PASS | PASS |
| 금당/12 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 금당/12 | solution | 예각/직각/둔각의 외심·내심 위치 비교 | composite-panels-v1 | q12-solution.plan.json | PASS/PASS | PASS |
| 금당/13 | problem | 원본 q13.png가 사실상 빈 캡처; 발문 9·12·15·직각·원은 구현 | 원본 q13 정상 스캔 재확보 | q13-problem.plan.json | PASS/PASS | EVIDENCE_DEBT |
| 금당/13 | solution | 9·12·15 직각삼각형 외접원(원본 PNG 재단이 비어 있음) | construction-spike-v1 | q13-solution.plan.json | PASS/PASS | PASS |
| 금당/14 | problem | 기존 x/y 꼭짓점 오류 → A 외각 x, C 내각 y | construction-spike-v1 | q14-problem.plan.json | PASS/PASS | PASS |
| 금당/14 | solution | 기존 x/y 꼭짓점 오류 → A 외각 x, C 내각 y | construction-spike-v1 | q14-solution.plan.json | PASS/PASS | PASS |
| 금당/15 | problem | B=60°, BC=5인 평행사변형의 대각·대변 관계 | construction-spike-v1 | q15-problem.plan.json | PASS/PASS | PASS |
| 금당/15 | solution | B=60°, BC=5인 평행사변형의 대각·대변 관계 | construction-spike-v1 | q15-solution.plan.json | PASS/PASS | PASS |
| 금당/16 | problem | 원본 프로그램의 측정 패널과 수치 목록을 실제 그림에 재현하지 못함 | MEASUREMENT_UI_PANEL_AND_GEOMETRY_SOFTWARE_CHROME | q16-problem.plan.json | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 금당/16 | solution | 원본 기하 프로그램 화면의 대각선 O·EF·OE=OF | construction-spike-v1 | q16-solution.plan.json | PASS/PASS | PASS |
| 금당/17 | problem | 중점 M/N과 MD/BN, 같은 길이·평행 표시 | construction-spike-v1 | q17-problem.plan.json | PASS/PASS | PASS |
| 금당/17 | solution | 중점 M/N과 MD/BN, 같은 길이·평행 표시 | construction-spike-v1 | q17-solution.plan.json | PASS/PASS | PASS |
| 금당/18 | problem | 네 접기/자르기 단계를 패널로 복원했으나 단계 간 진행 화살표가 빠짐 | COMPOSITE_PANEL_SEQUENCE_CONNECTOR_ARROWS | q18-problem.plan.json | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 금당/18 | solution | 접기→접기→자르기→펼치기 네 단계와 마름모 대각선 | construction-spike-v1 | q18-solution.plan.json | PASS/PASS | PASS |
| 금당/19 | problem | 원본은 E·F가 BD 위; JS 해설은 BC/CD에 대한 수선. 해설의 실제 수선을 기준으로 작성 | 문항 에셋/해설 정의 상충, 원본 정오표 필요 | q19-problem.plan.json | PASS/PASS | EVIDENCE_DEBT |
| 금당/19 | solution | 해설의 직각수선은 정확하지만 시험지 원본 E·F 배치와 1:1 불일치 | 문항 에셋/해설 정의 상충, 원본 정오표 필요 | q19-solution.plan.json | PASS/PASS | EVIDENCE_DEBT |
| 금당/20 | problem | AC 위 E, BEC=69°, EDA와 정사각형 대각선 | construction-spike-v1 | q20-problem.plan.json | PASS/PASS | PASS |
| 금당/20 | solution | AC 위 E, BEC=69°, EDA와 정사각형 대각선 | construction-spike-v1 | q20-solution.plan.json | PASS/PASS | PASS |
| 금당/21 | problem | 6·8·10, 세 접점 D/E/F, 내접원 반지름 2 | construction-spike-v1 | q21-problem.plan.json | PASS/PASS | PASS |
| 금당/21 | solution | 6·8·10, 세 접점 D/E/F, 내접원 반지름 2 | construction-spike-v1 | q21-solution.plan.json | PASS/PASS | PASS |
| 금당/22 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 금당/22 | solution | ㄱ 연꼴·ㄴ 등변사다리꼴·ㄷ 대각·ㄹ 대각선 이등분 네 조건 | composite-panels-v1 | q22-solution.plan.json | PASS/PASS | PASS |
| 금당/23 | problem | 직사각형 AC/BD 대각선과 B/C 직각·합동 | construction-spike-v1 | q23-problem.plan.json | PASS/PASS | PASS |
| 금당/23 | solution | 직사각형 AC/BD 대각선과 B/C 직각·합동 | construction-spike-v1 | q23-solution.plan.json | PASS/PASS | PASS |
| 금당/24 | problem | 원본 s04.png의 결정 상자·예/아니요 분기 화살표·경로를 재현할 엔진이 없음 | FLOWCHART_DECISION_NODES_BRANCH_LABELS_AND_ARROWS | — | — | ENGINE_CAPABILITY_PENDING |
| 금당/24 | solution | 대각선 길이·수직·이등분에 따른 네 사각형 분류 흐름도 | composite-panels-v1 | q24-solution.plan.json | PASS/PASS | PASS |

## 결함·기능 보류 요약

- q02/problem: EVIDENCE_DEBT — 원본 q02.png에 6번 도형·프로그램 UI가 잘못 잘려 들어옴; 본문/해설의 동일선분 5개는 구현; 원본 q02 정상 스캔 재확보.
- q02/solution: EVIDENCE_DEBT — 원본 PNG가 다른 문항; 본문·해설의 외각 20→40→60→80 추적은 구현; 원본 q02 정상 스캔 재확보.
- q03/problem: ENGINE_CAPABILITY_PENDING — 기하 프로그램 화면의 툴바/측정창 미지원; 수학적 선분·각은 구현; DYNAMIC_GEOMETRY_SCREENSHOT_UI.
- q13/problem: EVIDENCE_DEBT — 원본 q13.png가 사실상 빈 캡처; 발문 9·12·15·직각·원은 구현; 원본 q13 정상 스캔 재확보.
- q16/problem: ENGINE_CAPABILITY_PENDING — 원본 프로그램의 측정 패널과 수치 목록을 실제 그림에 재현하지 못함; MEASUREMENT_UI_PANEL_AND_GEOMETRY_SOFTWARE_CHROME.
- q18/problem: ENGINE_CAPABILITY_PENDING — 네 접기/자르기 단계를 패널로 복원했으나 단계 간 진행 화살표가 빠짐; COMPOSITE_PANEL_SEQUENCE_CONNECTOR_ARROWS.
- q19/problem: EVIDENCE_DEBT — 원본은 E·F가 BD 위; JS 해설은 BC/CD에 대한 수선. 해설의 실제 수선을 기준으로 작성; 문항 에셋/해설 정의 상충, 원본 정오표 필요.
- q19/solution: EVIDENCE_DEBT — 해설의 직각수선은 정확하지만 시험지 원본 E·F 배치와 1:1 불일치; 문항 에셋/해설 정의 상충, 원본 정오표 필요.
- q24/problem: ENGINE_CAPABILITY_PENDING — 원본 s04.png의 결정 상자·예/아니요 분기 화살표·경로를 재현할 엔진이 없음; FLOWCHART_DECISION_NODES_BRANCH_LABELS_AND_ARROWS.

## 기계 검수와 남은 범위

- 판정 {"PASS":37,"EVIDENCE_DEBT":5,"ENGINE_CAPABILITY_PENDING":4,"EXEMPT_NO_VISUAL":2}.
- `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <두 폴더의 *.plan.json>` / `<동일 경로>` full: 모두 PASS.
- Chrome 없는 환경에서 실제 `render-plan.mjs` 호출은 `ARCHIVE_PREFLIGHT_FAIL`(measure)로 종료되었다. 학생 화면 및 A4 시각 검수/게시를 완료했다고 주장하지 않는다.
- `drawn-feature-parity-audit.json`의 `drawnFieldInventory`가 caption에만 존재하는 표식을 필드 존재로 잘못 세지 않도록 문제 축/해설 축을 구별한다.
