# 고2 유형은행 기하 159~163 — 문제 그림 plan 인계 (2026-11-26)

## 범위 및 근거

- 작업 유형군: `정사면체 → 정사영의 길이 → 교선에 수직이 아닌 정사영 → 정사영 넓이1`. 기하 205종을 먼저 완성한 뒤 미적분Ⅱ로 간다. 다음 후보는 기하 164.
- 기준: `origin/main` `b1b3876`에서 별도 worktree 브랜치 `work/typebank-geometry-159-163-plans-20261126` 시작. 155~158 배치는 PR #3052로 이미 병합됨. 기존 159~163 plan 없음, 동일 범위의 열린 PR 없음(작업 시작 시 점검).
- 오직 `archive/exams/types/high/h2/` 다섯 JS 원문의 실제 `[그림: ...]`을 1차 분모로 확인. JS 본문·정답·해설 및 시험지·교과서는 변경하지 않음. `kind:problem`만 해당하고 `kind:solution`을 완료한 것으로 보지 않음.
- 원문 blob SHA: 159 `28aa361123757e2667e72a43fa3bb1f1f5d3af17`, 160 `3d7ee10803ef81e1af76f67bfb967d34f6f6911e`, 161 `a9081bb4da3992ec9034c7e9d5738c6a2fdb2045`, 162 `8797619ab73431f8942e99ddceb36f19c9ccc18b`, 163 `21b136f5730b48bb5b7bd76094a6a0fe010a5feb`.
- 총 5 JS / 문제 그림 28 qid / 실사용 `solid-figure-v1` plan 24개. plan-lint `--shallow` 24/24 PASS, full 24/24 PASS. **원문-렌더 필드 DRAWN_FEATURE_PARITY 22/28 PASS**. 미완료 6개 중 **작성된 부분 plan 2개, 계획 불가 4개**.
- 검수는 원문 `[그림]`과 plan의 `sourceConditions[].mappedTo` 실제 경로를 개별 대조하고, 독립 3D 좌표 계산으로 선분 길이·수선·각도·정사영 위치를 확인한 **plan 필드 검사**다. SVG/PNG 생성 및 학생 화면·A4의 시각검수는 `NOT_RUN`; 안티그래비티가 후속 수행해야 한다.

## 파일·qid별 원문/필드 대조

`P159`~`P163`은 아래의 정확한 stem을 뜻한다. 표의 `P159/q01` 등은 `archive/tools/geometry-equation/production/plans/<P159의 stem>/q01-problem.plan.json`으로 유일하게 해석한다. `—`는 **plan JSON 미작성**이지 EXEMPT가 아니다.

| 단축 | 정확한 원본·plan 디렉터리 stem |
| --- | --- |
| P159 | `기하_159_정사면체_고2_유형은행1` |
| P160 | `기하_160_정사영의길이_고2_유형은행1` |
| P161 | `기하_161_정사영의길이-각의크기구하기_고2_유형은행1` |
| P162 | `기하_162_교선에수직이아닌정사영의길이_고2_유형은행1` |
| P163 | `기하_163_정사영의넓이1_고2_유형은행1` |

| 파일/qid | 축 | 판정 | capability | plan 경로 | shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 159/q01 | 정사면체·선분/평면각 | 제작 | solid-figure-v1 | P159/q01 | PASS/PASS | PASS |
| 159/q02 | 정사면체·무게중심 | 제작 | solid-figure-v1 | P159/q02 | PASS/PASS | PASS |
| 159/q03 | 정사면체·내분점 | 제작 | solid-figure-v1 | P159/q03 | PASS/PASS | PASS |
| 159/q04 | 정사면체·꼬인 두 직선 | 부분 제작 | solid-figure-v1 + ENGINE_CAPABILITY_PENDING(β) | P159/q04 | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 159/q05 | 정사면체·이면각 | 제작 | solid-figure-v1 | P159/q05 | PASS/PASS | PASS |
| 159/q06 | 정사면체·중점 이면각 | 제작 | solid-figure-v1 | P159/q06 | PASS/PASS | PASS |
| 160/q01 | 정사영 길이·직선/평면 | 제작 | solid-figure-v1(space) | P160/q01 | PASS/PASS | PASS |
| 160/q02 | 정사영 길이·정사각뿔 | 제작 | solid-figure-v1 | P160/q02 | PASS/PASS | PASS |
| 160/q03 | 정사영 길이·원기둥 내부 단면 | 미작성 | ENGINE_CAPABILITY_PENDING | — | NOT_RUN | ENGINE_CAPABILITY_PENDING |
| 160/q04 | 정사영 길이·정사각형 | 제작 | solid-figure-v1(space) | P160/q04 | PASS/PASS | PASS |
| 160/q05 | 정사영 길이·정육면체 | 제작 | solid-figure-v1 | P160/q05 | PASS/PASS | PASS |
| 160/q06 | 정사영 길이·대각평면 | 제작 | solid-figure-v1 | P160/q06 | PASS/PASS | PASS |
| 160/q07 | 정사영 길이·정사면체 | 제작 | solid-figure-v1 | P160/q07 | PASS/PASS | PASS |
| 161/q01 | 정사영 길이·원기둥 둘레 점 | 미작성 | ENGINE_CAPABILITY_PENDING | — | NOT_RUN | ENGINE_CAPABILITY_PENDING |
| 161/q02 | 선분/평면각·정육면체 | 제작 | solid-figure-v1 | P161/q02 | PASS/PASS | PASS |
| 161/q03 | 세 평면·직육면체 대각선 | 제작 | solid-figure-v1 | P161/q03 | PASS/PASS | PASS |
| 162/q01 | 교선·정삼각형 | 제작 | solid-figure-v1(space) | P162/q01 | PASS/PASS | PASS |
| 162/q02 | 교선과 45도인 선분 | 제작 | solid-figure-v1(space) | P162/q02 | PASS/PASS | PASS |
| 162/q03 | 교선과 30도인 선분 | 제작 | solid-figure-v1(space) | P162/q03 | PASS/PASS | PASS |
| 162/q04 | 사각뿔·옆면 정사영 | 제작 | solid-figure-v1 | P162/q04 | PASS/PASS | PASS |
| 162/q05 | 직육면체·수선발 | 제작 | solid-figure-v1 | P162/q05 | PASS/PASS | PASS |
| 163/q01 | 정사영 넓이 관계 유도 | 제작 | solid-figure-v1(space) | P163/q01 | PASS/PASS | PASS |
| 163/q02 | 정삼각형 정사영 넓이 | 제작 | solid-figure-v1(space) | P163/q02 | PASS/PASS | PASS |
| 163/q05 | 이등변삼각형 → 정삼각형 | 미작성 | SOURCE_GEOMETRY_INCONSISTENT | — | NOT_RUN | SOURCE_GEOMETRY_INCONSISTENT |
| 163/q06 | 삼각기둥의 경사 절단면 | 부분 제작 | solid-figure-v1 + ENGINE_CAPABILITY_PENDING(무기명 절단) | P163/q06 | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 163/q07 | 공간 정사각형 → 마름모 | 제작 | solid-figure-v1(space) | P163/q07 | PASS/PASS | PASS |
| 163/q08 | 정육각뿔·이면각 | 제작 | solid-figure-v1 | P163/q08 | PASS/PASS | PASS |
| 163/q09 | 세 반평면·도형 A의 정사영 | 미작성 | ENGINE_CAPABILITY_PENDING | — | NOT_RUN | ENGINE_CAPABILITY_PENDING |

## 미완료 6개 — 후속 작업 입력

1. `기하_159_...` q04: 원문의 꼬인 직선 `CD`와 `BE`가 만드는 `β`를 하나의 **실제** 각 호로 표현하는 엔진 보조 평행이동/방향벡터 호가 없다. 현재 plan은 정사면체·E 중점·BE 선분 및 `α=∠ADC`만 렌더 필드에 갖는다. `β`를 임의의 다른 각으로 표시하거나 caption에만 적고 PASS로 세지 않는다.
2. `기하_160_...` q03: 밑면 반지름 2인 **원기둥에 내접한 비축 단면 직사각형 ABCD**, `BC=2`, 밑면과 45°의 이면각을 원기둥 위에 표현하는 `CYLINDER`+정확한 임의 단면/교점 합성이 미지원. `section:AXIAL|LEVEL`로 바꾸면 원문과 달라진다. plan 미작성.
3. `기하_161_...` q01: 원기둥 윗밑면 **원둘레**의 이름 있는 점 P, 아랫밑면 중심 O 및 OP·밑면각 θ를 함께 표기하는 `CYLINDER` 원둘레 보조점/세그먼트 기능 미지원. 원의 중심에 P를 붙여 왜곡하지 않는다. plan 미작성.
4. `기하_163_...` q05: **엔진 문제가 아니라 원문 3D 기하의 모순을 발견.** `AB=AC=√7, BC=2√3`이면 중선/높이 `AM=2`, 정사영이 한 변 2인 정삼각형이면 `B′C′=2`, `A′M′=√3`. 투영 전 `AM⊥BC`, 후에도 `A′M′⊥B′C′`이므로 직교정사영의 두 원래 직교 축 중 적어도 하나는 길이가 유지돼야 한다. 그러나 `2√3→2`와 `2→√3` 모두 줄었다. 실제로 존재하는 입체/투영의 1:1 plan을 거짓 생성할 수 없다. 원문 검토·정정 후 재계획.
5. `기하_163_...` q06: 측면이 있는 삼각기둥에 경사면 `EFP`를 정확한 30°로 칠한 부분 plan은 lint 통과. 하지만 원문에 **꼭짓점 명칭이 없는** 삼각기둥의 실제 절단 외형을 엔진의 `cuts.through`가 익명 참조 모서리로 지정할 수 없어, 임의로 만든 E/F/G/A/B/C/P/M 글자가 그림에 뜬다. 무기명 경사 절단·단면 색칠 기능 보강 후 이 이름을 제거해야 parity PASS.
6. `기하_163_...` q09: 세 개의 **반평면** α·β·γ와 임의 면적 도형 A 및 β·γ 위의 도형 정사영 두 개가 필요하다. 엔진 `space.planes`는 전체 평행사변형 평면만 지원하고 임의 폐곡선 도형의 면적·복수 정사영은 지원하지 않는다. 30°만 호로 그리고 24·12 면적을 caption에 적어 완료 처리하면 안 된다.

## 별도 검수 결과 및 해석

- 28개 실제 source 슬롯과 24개 plan 경로를 교차 대조. 원문의 `[그림]`에서 잘라 온 `sourceQuote`, 접근성 설명, 항목별 `sourceConditions` 117개가 존재하는 JSON 렌더 필드 경로에 정확히 매핑됨. 보이는 길이 치수 29개, 직각 19개, 각 호 17개, 면 채움 12개를 개별 검사. `sourceConditions`/caption만 존재하는 항목은 parity로 계산하지 않음.
- 독립 공간 좌표 확인: 160/q01은 원 선분 9·정사영 6; 160/q04 정사영 정사각형은 `6×3√2`; 162/q01 정사영 `A′B=2√7`; 162/q02 `AB′=√10`; 162/q03 `A′B′=3√13`; 163/q07 원 정사각형 한 변 4·정사영 마름모 한 변 `√10`·BD 길이 유지. 모든 공간 plan의 수치 각·직각을 벡터 내적으로 다시 계산해 불일치 0개.
- 원문에 없는 답 값·단위·최종 풀이 값을 그림에 넣지 않음. 문자 매개변수 `a,b,c,θ`가 주어지지 않은 문항은 내부 대표 모델 비율만 결정하고 출력 라벨은 원문 문자대로 유지. `kind:problem` 이외 해설 plan은 만들지 않음.
- `SVG_TO_CREATE`, `PNG_TO_CREATE`, `학생 화면/A4 시각 검수: NOT_RUN`, `JS 연결·게시: NOT_RUN` — 운영 병합 이후 안티그래비티 후속 업무.
