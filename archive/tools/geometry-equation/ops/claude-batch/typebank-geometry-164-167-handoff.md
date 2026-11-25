# 고2 유형은행 기하 164–167 문제 그림 plan 인계 (2026-11-26)

## 범위·원본 증거

- 대상: `archive/exams/types/high/h2/` 기하 164–167, **4 JS·실제 `[그림:]` 25 qid**. 168까지 추가하면 31문항이므로 이번 배치에 넣지 않았다.
- 시작 `origin/main`: `195a55159d89be74597b35c78c64cb814770fe09` (직전 PR #3055 병합 후). 제출 직전 최신 `origin/main` `da4d1f6fb5c949ec30de73186c26af5017e9f547`으로 재기준화(중복 수정 없음).
- JS 원본 blob: 164 `8a1405a274054500f5ff11a8764fdd3e5e771662`, 165 `af8b0469c387a5e79ef06c22c3cb0d41b8704f0d`, 166 `e8022a05ac068472a6d5640b75c49950ef81744a`, 167 `3a3ea621f677cb634db8d1c68ada2daad526e46a`.
- 실제 문항의 발문·해설·정답·그림 문구를 `window.questionBank`에서 각 qid로 확인했다. 수학 모델은 주어진 위치·거리·직교·내분·정사영을 실수 좌표와 벡터로 독립 검증했다.
- `plan` 루트: `archive/tools/geometry-equation/production/plans/`, 규칙 `<원본 JS stem>/qNN-problem.plan.json`.
  - `P164` = `기하_164_두평면의교선이주어질때-두평면의이면각을_고2_유형은행1`
  - `P165` = `기하_165_두평면의교선이주어질때-두평면의이면각을_고2_유형은행1`
  - `P166` = `기하_166_두평면의교선을알수없을때-두평면의이면각_고2_유형은행1`
  - `P167` = `기하_167_정사영의넓이를이용한이면각구하기_고2_유형은행1`

## 문항별 plan·source-to-field 판정

| 원본/qid | 기하 축 | capability | plan (위 루트 기준) | shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|
| 164/q01 | 알려진 교선·정사영 | 미지원 | — | NOT_RUN/NOT_RUN | ENGINE_CAPABILITY_PENDING |
| 164/q02 | 알려진 교선·정사영 | solid-figure-v1 | `P164/q02-problem.plan.json` | PASS/PASS | PASS |
| 164/q03 | 알려진 교선·정사영 | solid-figure-v1 | `P164/q03-problem.plan.json` | PASS/PASS | PASS |
| 164/q04 | 알려진 교선·정사영 | 미지원 | — | NOT_RUN/NOT_RUN | ENGINE_CAPABILITY_PENDING |
| 164/q05 | 알려진 교선·정사영 | solid-figure-v1 | `P164/q05-problem.plan.json` | PASS/PASS | PASS |
| 164/q06 | 알려진 교선·정사영 | solid-figure-v1 | `P164/q06-problem.plan.json` | PASS/PASS | PASS |
| 164/q07 | 알려진 교선·정사영 | solid-figure-v1 | `P164/q07-problem.plan.json` | PASS/PASS | PASS |
| 164/q08 | 알려진 교선·정사영 | solid-figure-v1 | `P164/q08-problem.plan.json` | PASS/PASS | PASS |
| 164/q09 | 알려진 교선·정사영 | solid-figure-v1 | `P164/q09-problem.plan.json` | PASS/PASS | PASS |
| 164/q10 | 알려진 교선·정사영 | solid-figure-v1 | `P164/q10-problem.plan.json` | PASS/PASS | PASS |
| 165/q01 | 알려진 교선·정사영 | 미지원 | — | NOT_RUN/NOT_RUN | ENGINE_CAPABILITY_PENDING |
| 165/q02 | 알려진 교선·정사영 | 미지원 | — | NOT_RUN/NOT_RUN | ENGINE_CAPABILITY_PENDING |
| 165/q03 | 알려진 교선·정사영 | solid-figure-v1 | `P165/q03-problem.plan.json` | PASS/PASS | PASS |
| 165/q04 | 알려진 교선·정사영 | solid-figure-v1 | `P165/q04-problem.plan.json` | PASS/PASS | PASS |
| 165/q05 | 알려진 교선·정사영 | solid-figure-v1(부분) | `P165/q05-problem.plan.json` | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 166/q01 | 교선 미지 이면각 | solid-figure-v1 | `P166/q01-problem.plan.json` | PASS/PASS | PASS |
| 166/q02 | 교선 미지 이면각 | solid-figure-v1 | `P166/q02-problem.plan.json` | PASS/PASS | PASS |
| 166/q03 | 교선 미지 이면각 | 미지원 | — | NOT_RUN/NOT_RUN | ENGINE_CAPABILITY_PENDING |
| 166/q04 | 교선 미지 이면각 | solid-figure-v1 | `P166/q04-problem.plan.json` | PASS/PASS | PASS |
| 166/q05 | 교선 미지 이면각 | solid-figure-v1 | `P166/q05-problem.plan.json` | PASS/PASS | PASS |
| 167/q01 | 정사영 넓이·이면각 | solid-figure-v1 | `P167/q01-problem.plan.json` | PASS/PASS | PASS |
| 167/q02 | 정사영 넓이·이면각 | solid-figure-v1 | `P167/q02-problem.plan.json` | PASS/PASS | PASS |
| 167/q03 | 정사영 넓이·이면각 | solid-figure-v1 | `P167/q03-problem.plan.json` | PASS/PASS | PASS |
| 167/q04 | 정사영 넓이·이면각 | solid-figure-v1 | `P167/q04-problem.plan.json` | PASS/PASS | PASS |
| 167/q05 | 정사영 넓이·이면각 | solid-figure-v1 | `P167/q05-problem.plan.json` | PASS/PASS | PASS |

## 검수 게이트·제약

1. 원문 25개 그림 슬롯 정확 대응. 중복 작성 0. 실제 `solid-figure-v1` 문제 plan 20개. 별도 문서만으로 만들어진 가짜 plan은 없음.
2. `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <20개 절대/상대 경로>`: **20/20 PASS**. `--shallow` 없는 full 검사도 **20/20 PASS**.
3. 별도 원문-필드 대조: `sourceQuote`의 원본 접두 일치, `sourceConditions[*].mappedTo` 실제 존재, `caption`/접근성, 원문 점·색칠한 다각형·숫자 치수·직각 표식·등호 표식·교선 등 그림으로 출력할 필드, 수학적 위치 및 수직 관계를 독립 확인. **19/25 DRAWN_FEATURE_PARITY PASS**, **6/25 ENGINE_CAPABILITY_PENDING**. `sourceQuote`는 엔진 최대 길이 200자 제한에 따라 일부 원문 그림 설명의 정확한 200자 접두를 보존하며, 원문 전체는 해당 JS가 정본이다.
4. 165/q05는 별도 주의. 높이 `4√6`, 정사영 `P′HQ`가 한 변 4 정삼각형이고 `P∈BC`, `Q∈EF`인 실좌표 plan은 맞다. 다만 현 `space.segments` 최대 16개 때문에 직육면체 12모서리 + 공간/정사영 삼각형과 수선에 필요한 총 18선을 동시에 그리지 못해 **입체의 숨은 모서리 `CG`, `DH` 두 개를 생략**했다. `plan-lint=PASS`여도 **DRAWN_FEATURE_PARITY=ENGINE_CAPABILITY_PENDING**. 엔진 `SPACE_SEGMENT_LIMIT` 확대 또는 입체 보조점 임의 정확 좌표 지원 후 재작성·재검수한다.
5. 164/q01: 정육면체 윗면의 반지름 `√6`인 원 + 대각면 AFGD 함께 표현 필요. 164/q04: 정육면체 내접구를 대각면 BCHE로 잘라 원형 단면 표시 필요. 165/q01: BCD의 내접원과 기울어진 ACD 면 위 도형 S의 역정사영 필요. 165/q02: 원기둥의 기울어진 절단 타원 필요. 166/q03: 정육면체 밑면 내접원과 평면 AFC 필요. 모두 현 그림 계약의 미지원 구성요소이므로 `ENGINE_CAPABILITY_PENDING`, 무허가 SVG·PNG·가짜 대체 그림 없음.
6. 문제 SVG 렌더·PNG·학생 화면·A4 검사는 **모두 NOT_RUN** (후속 안티그래비티 담당). 정답·최종 수치를 문제 그림의 캡션·라벨에 쓰지 않음. 이번 배치는 **problem** plan만 취급하므로 해설 그림의 완료/면제를 뜻하지 않음.

## 후속 액션

- 안티그래비티: `main`의 19 parity PASS plan을 공식 엔진으로 SVG/PNG 렌더, 학생/A4 실물 검수, 정답 노출 여부 재검수 후 JS 연결·게시. 165/q05 부분 plan은 렌더 후에도 완료로 간주하지 말 것.
- 엔진 담당: 위 미지원 6 qid의 기능을 보강하여 plan 수정 및 `DRAWN_FEATURE_PARITY` 재검수. 지원되지 않는 요소를 캡션으로 대신하거나 수작업 SVG로 이 라인에서 메우지 말 것.
- 다음 묶음은 **기하 168번부터** 실제 `[그림:]` 20–30슬롯을 다시 계산해 계속; 기하 205종 완료 뒤에만 미적분Ⅱ로 진행.
