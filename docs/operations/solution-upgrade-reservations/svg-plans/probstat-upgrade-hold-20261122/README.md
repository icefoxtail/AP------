# 고2 확률과 통계 기출 UPGRADE·HOLD — 문항별 SVG plan 선행 작업

작성일: 2026-11-22 KST · 범위: **1학기 중간~2학기 기말 기출 감사에서 UPGRADE/HOLD로 지목된 문항** · 단계: **계획 초안 (NOT_RUN)**.

## 원칙과 집계

- 감사 원본: 1학기 lane20 `work/solution-upgrade-lane-20-20261121`의 59장 감사, 2학기 lane40 `work/solution-upgrade-lane-40-probstat-2sem-20261122`의 44장 감사. 원본 JS·인쇄본을 **이번 plan 작업에서 새로 전수 검수한 것은 아님**.
- 대상: **51개 시험지 / 127문항 = UPGRADE 117 + HOLD 10**. 각 문항마다 `items/<exam>/qNN/item.json`과 `plan.json`; 상세 원인·원본 경로·감사 SHA·후속 작업은 `index.json`.
- `plan.json`이 `{"status":"EXEMPT","reason":"..."}`인 문항은 **신규 SVG 제작 대상이 아님**을 뜻하며, 해당 JS/해설·메타데이터 수정은 **미적용** 상태다.
- 원탁 2건은 **8개/10개 표식이 모두 착석 인원이라는 기존 감사 주장을 재검토**했다. SVG 설명문에는 각각 **4명+4개 후보 틈**, **5명+5개 후보 틈**으로 구분돼 있어 머릿수 오류를 확정할 수 없다. 일단 `EXEMPT` + `ROUND_TABLE_SEAT_GAP_QA`로 두고 학생 화면에서 후보 틈의 시각적 구분을 확인한다. 엔진 unsupported나 결함 확정 판정은 **NOT_RUN**.
- 실제 엔진 입력 plan: **2문항 / 3파일**, 즉 2023 복성고 2학기 중간 **Q19 1개, Q20 (1)·(2) 각 1개**. `stat-chart-figure-v1` `NORMAL_CURVE` 사용. **plan lint, 엔진 렌더, PNG 눈 검수, Publish, JS 연결은 모두 NOT_RUN**.
- 나머지 **125문항**은 기존 그림 유지·이미지 복원·수학/원문 HOLD·단원 메타/텍스트 보완 또는 원탁 시각검수 대기로 구분된다. 신규 SVG가 필요 없는 문항에 억지 도형을 만들지 않는다.
- `index.json`의 `auditStatus`는 이전 감사에서의 **원래 HOLD/UPGRADE 상태**이지, 수정 적용·운영 배포 완료를 뜻하지 않는다. 새로운 계획 브랜치는 main이나 기존 JS/SVG/PNG를 건드리지 않는다.

## 실제 SVG 제작 우선순위

| 우선 | 문항 | 계획 | 게시 게이트 |
| --- | --- | --- | --- |
| 1 | 2023 복성고 2학기 중간 Q19 | `q19/plan.json` — N(360,6²) 근사 중앙 351~369의 좌우 음영 | 정확 이항확률과 교과 정규근사 차이를 풀이에 명시; 정답을 곡선에 쓰지 않음 |
| 1 | 동일 시험 Q20 (1) | `q20/plan.json` — N(70,10²), 90점 이상 오른쪽 꼬리 | 표 0.48에서 얻는 **약** 0.02와 진짜 정규 면적을 구별 |
| 1 | 동일 시험 Q20 (2) | `q20/part2.plan.json` — 상위 20% 꼬리, 모르는 점수 k | 답인 점수 78.4는 곡선 라벨에 노출하지 않음 |
| 2 | 2020 매산여고 1중 Q13 | `EXEMPT` + `ROUND_TABLE_SEAT_GAP_QA` — 기존 8표식은 4명+후보 4틈일 수 있음 | **실착석 7명과 후보 4틈을 학생이 혼동하는지** PNG 검사 후 재제작 결정 |
| 2 | 2021 효천고 1중 Q03 | `EXEMPT` + `ROUND_TABLE_SEAT_GAP_QA` — 기존 10표식은 5명+후보 5틈일 수 있음 | **실착석 8명과 후보 5틈을 학생이 혼동하는지** PNG 검사 후 재제작 결정 |
| 2 | 2022 효천고 1중 Q13 | `EXEMPT` + `BROKEN_SOLUTION_REFERENCE` | JS에 붙은 `assets/solutions/.../q13-solution.svg` 확인 불가. 실제 배포 경로와 PNG를 먼저 대조한 후 lattice-path 재계획 |
| 3 | 2024 매산여고 1기 Q23 | `EXEMPT` + `SOURCE_IMAGE_RECOVERY` | 인쇄본의 7개 주머니 **원본 그림 복구** 우선. 상상으로 SVG 생성 금지 |
| 3 | 2025 순천고 1중 Q12 | `EXEMPT` + `CONTENT_MATH_HOLD` | 원본 막힌 도로망에서 87/89 경로 수 충돌 해결 전 신규 SVG 금지 |
| 3 | 2022 금당고 1기 Q12 | `EXEMPT` + `KEEP_ORIGINAL_PNG` | 실제 원본 q12.png 존재. 임의의 σ 배율을 새로 만들어 비교곡선을 그리지 않음 |

## 다음 Codex/Claude Code 실행 순서

1. `index.json`의 `sourcePath`, `sourceBlobSha`, `auditPath`·`auditBlobSha`를 현재 작업 브랜치 원본과 재대조한다. 감사 참조 브랜치 내용이 main과 달라졌다면 **새 브랜치 기준으로 identity를 다시 고정**한다.
2. 엔진 가이드 `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`와 `docs/agents/visual-svg.md`를 읽고 위 **세 개 실입력 plan**을 `archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs`로 검사한다. `item.json`은 source JS 경로와 원문 ordinal을 보존한다. `publish.json`은 alt/caption/size 초안이므로 렌더 결과 `sizeClass`와 재대조한다.
3. **엔진**으로 3개 SVG를 렌더한다(수작업 SVG 금지). 각 600px PNG로 원본 인쇄본·문제·풀이와 **시각 검수**, 정확한 음영 경계·표의 반올림 표기 확인한다. **문항별 결과표와 렌더 로그**를 남긴다.
4. 좌석 2건은 기존 SVG의 `<title>/<desc>`가 후보 틈을 별도로 설명함을 우선 기록한다. 학생용 실제 PNG에서 틈 표식이 추가 착석인원처럼 보이는지 검수하고, 모호한 경우에만 엔진 capability 확인/수정한다. 원본 이미지 복구·원문 확정 HOLD/해설 텍스트·표 보정은 SVG와 별개 큐로 처리한다.
5. UPGRADE/HOLD 실제 JS 수정 + 승인된 SVG/PNG 연결 → parse/binding 검사 → math/source fidelity → Golden/Negative 및 학생 UI 실제 렌더 → 원본/유사시험지 사이의 연관 처리; **유사시험지로 전환은 이 검수 후**.

## 해석 주의

`EXEMPT`는 **문항 자체가 완성됐다는 뜻이 아니다**. 단지 ‘현재 수정 사유에 신규 SVG가 정답이 아니다’라는 뜻이다. 특히 HOLD 10건은 원본 조건·정답·채점의 해결 전까지 출고 금지. 이 커밋은 의도적으로 원본 시험 JS·이미지·기존 SVG를 변경하지 않고 계획 데이터만 담는다.
