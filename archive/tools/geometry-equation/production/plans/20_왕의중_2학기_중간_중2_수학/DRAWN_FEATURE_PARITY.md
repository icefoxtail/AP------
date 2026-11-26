# 20_왕의중_2학기_중간_중2_수학: QID/축 별 DRAWN_FEATURE_PARITY 검수

- 원문 24 qid × 2 축 = 48행. 공식 플랜 29개, shallow/full 모두 PASS.
- 텍스트 축은 EXEMPT_NO_VISUAL. 원본 스캔 불일치는 EVIDENCE_DEBT. 엔진 기능 부족은 ENGINE_CAPABILITY_PENDING이며 아래 필요 기능을 명시한다.
- 렌더/PNG/학생화면/A4: 환경 장애(Chrome 배포본 없음)로 NOT_RUN. plan-lint PASS와 최종 학생용 SVG parity 검수를 동일시하지 않는다.
- 새 plan은 손 SVG나 명시적 흰색 배경·불필요한 면 채움을 포함하지 않는다. 표와 벤다이어그램의 의미 있는 강조는 예외다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 왕의/01 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/01 | solution | 두 평행 직선의 동일 기울기와 y절편 3/2, -1/2 | multi-curve-figure-v1 | q01-solution.plan.json | PASS/PASS | PASS |
| 왕의/02 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/02 | solution | x=2 수직선과 (2,1), y축 평행 | construction-spike-v1 | q02-solution.plan.json | PASS/PASS | PASS |
| 왕의/03 | problem | 두 식 라벨, 교점 (3,1)과 좌표축 투영 | multi-curve-figure-v1 | q03-problem.plan.json | PASS/PASS | PASS |
| 왕의/03 | solution | 두 식 라벨, 교점 (3,1)과 좌표축 투영 | multi-curve-figure-v1 | q3-solution.plan.json | PASS/PASS | PASS |
| 왕의/04 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/04 | solution | 양의 기울기, 음의 y절편, (0,-1)·(2,0) 좌표 | multi-curve-figure-v1 | q04-solution.plan.json | PASS/PASS | PASS |
| 왕의/05 | problem | B 외각 60°, C=30°, AB=5cm과 미지 BC | construction-spike-v1 | q05-problem.plan.json | PASS/PASS | PASS |
| 왕의/05 | solution | B 외각 60°, C=30°, AB=5cm과 미지 BC | construction-spike-v1 | q5-solution.plan.json | PASS/PASS | PASS |
| 왕의/06 | problem | 직각이등변삼각형, BD=6, CE=4와 수선 D/E | construction-spike-v1 | q06-problem.plan.json | PASS/PASS | PASS |
| 왕의/06 | solution | 직각이등변삼각형, BD=6, CE=4와 수선 D/E | construction-spike-v1 | q6-solution.plan.json | PASS/PASS | PASS |
| 왕의/07 | problem | 내심의 세 수선·직각과 각 이등분; 원문에 없는 숫자 각도 제거 | construction-spike-v1 | q07-problem.plan.json | PASS/PASS | PASS |
| 왕의/07 | solution | 내심의 세 수선·직각과 각 이등분; 원문에 없는 숫자 각도 제거 | construction-spike-v1 | q7-solution.plan.json | PASS/PASS | PASS |
| 왕의/08 | problem | AB=AC, AD 각 이등분·중점 D·선분 위 P | construction-spike-v1 | q08-problem.plan.json | PASS/PASS | PASS |
| 왕의/08 | solution | AB=AC, AD 각 이등분·중점 D·선분 위 P | construction-spike-v1 | q8-solution.plan.json | PASS/PASS | PASS |
| 왕의/09 | problem | C 직각, AC=BC=AD, DE⊥AB와 EC=5 | construction-spike-v1 | q09-problem.plan.json | PASS/PASS | PASS |
| 왕의/09 | solution | C 직각, AC=BC=AD, DE⊥AB와 EC=5 | construction-spike-v1 | q9-solution.plan.json | PASS/PASS | PASS |
| 왕의/10 | problem | 외심 O·내심 I 및 BOC=100° | construction-spike-v1 | q10-problem.plan.json | PASS/PASS | PASS |
| 왕의/10 | solution | 외심 O·내심 I 및 BOC=100° | construction-spike-v1 | q10-solution.plan.json | PASS/PASS | PASS |
| 왕의/11 | problem | 외심 중심각 비 2:4:3, 80°/160°/120° | construction-spike-v1 | q11-problem.plan.json | PASS/PASS | PASS |
| 왕의/11 | solution | 외심 중심각 비 2:4:3, 80°/160°/120° | construction-spike-v1 | q11-solution.plan.json | PASS/PASS | PASS |
| 왕의/12 | problem | 내심 I를 지나는 DE∥BC와 AB/AC 교점 | construction-spike-v1 | q12-problem.plan.json | PASS/PASS | PASS |
| 왕의/12 | solution | 내심 I를 지나는 DE∥BC와 AB/AC 교점 | construction-spike-v1 | q12-solution.plan.json | PASS/PASS | PASS |
| 왕의/13 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/13 | solution | 이 시험 문항은 시각도 없이 텍스트 풀이로 완결됨 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/14 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/14 | solution | 이 시험 문항은 시각도 없이 텍스트 풀이로 완결됨 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/15 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/15 | solution | 이 시험 문항은 시각도 없이 텍스트 풀이로 완결됨 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/16 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/16 | solution | 이 시험 문항은 시각도 없이 텍스트 풀이로 완결됨 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/17 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/17 | solution | 서로 겹치지 않는 딸기·오렌지 사건의 합집합 | set-diagram-figure-v1 | q17-solution.plan.json | PASS/PASS | PASS |
| 왕의/18 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/18 | solution | 이 시험 문항은 시각도 없이 텍스트 풀이로 완결됨 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/19 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/19 | solution | 36칸 주사위 표의 자연수 해에 해당하는 5칸 | stat-chart-figure-v1 | q19-solution.plan.json | PASS/PASS | PASS |
| 왕의/20 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/20 | solution | 토·일요일 비/맑음 확률 수형도 | stat-chart-figure-v1 | q20-solution.plan.json | PASS/PASS | PASS |
| 왕의/21 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/21 | solution | 두 점(-1,6),(5,6)을 지난 수평선 y=6 | multi-curve-figure-v1 | q21-solution.plan.json | PASS/PASS | PASS |
| 왕의/22 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/22 | solution | 세 직선의 동시 교점 (5,-3) | multi-curve-figure-v1 | q22-solution.plan.json | PASS/PASS | PASS |
| 왕의/23 | problem | BC=8, OB=OC=6, 외접원 둘레 12π | construction-spike-v1 | q23-problem.plan.json | PASS/PASS | PASS |
| 왕의/23 | solution | BC=8, OB=OC=6, 외접원 둘레 12π | construction-spike-v1 | q23-solution.plan.json | PASS/PASS | PASS |
| 왕의/24 | problem | 문제 발문만으로 완결되는 텍스트 축; 별도 문제 SVG 없음 | EXEMPT | — | — | EXEMPT_NO_VISUAL |
| 왕의/24 | solution | 로봇 신호 A/B를 한 번만 맞히는 두 갈래 경로 | stat-chart-figure-v1 | q24-solution.plan.json | PASS/PASS | PASS |

## 결함·기능 보류 요약


## 기계 검수와 남은 범위

- 판정 {"EXEMPT_NO_VISUAL":19,"PASS":29}.
- `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <두 폴더의 *.plan.json>` / `<동일 경로>` full: 모두 PASS.
- Chrome 없는 환경에서 실제 `render-plan.mjs` 호출은 `ARCHIVE_PREFLIGHT_FAIL`(measure)로 종료되었다. 학생 화면 및 A4 시각 검수/게시를 완료했다고 주장하지 않는다.
- `drawn-feature-parity-audit.json`의 `drawnFieldInventory`가 caption에만 존재하는 표식을 필드 존재로 잘못 세지 않도록 문제 축/해설 축을 구별한다.
