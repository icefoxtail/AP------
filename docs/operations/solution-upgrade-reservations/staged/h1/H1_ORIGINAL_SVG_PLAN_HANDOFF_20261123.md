# 고1 기출 SVG 플랜 → 공식 엔진 작업자 인계 (2026-11-23)

> **현재 산출물은 PLAN_ONLY다.** JSON 플랜은 저장했지만 실제 SVG 엔진 렌더, 생성 PNG 시각검수, 학생 화면, A4, 게시, 운영 장부 갱신은 **NOT_RUN**. `plan-lint` 통과를 SVG/학생용 PASS로 바꾸지 말 것.

## 1. 범위·소스·브랜치

- 저장소: `icefoxtail/AP------`
- 이 인계의 브랜치: `work/h1-original-1final-qa-plans-20261122` (고1 기출 플랜 작업 브랜치; `main`으로 무검증 병합 금지)
- 대상: `archive/exams/original/high/h1/{1mid,1final,2mid,2final}/`의 **고등학교 1학년 기출**만. 고2, 유사, 유형, 교과서, 문제집 제외.
- 플랜 경로: `docs/plans/archive-one-route-upgrade/svg-plans-expanded/original/high/h1/`
- 공식 원장: `archive/tools/geometry-equation/production/exam-figure-ledger/high/h1/`
- 그림 작업 정본: `docs/agents/visual-svg.md`, `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`, `archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md`.
- 이전 인계/검수 근거: [2026-11-22 플랜 작성 기록](H1_ORIGINAL_SVG_PLAN_HANDOFF_20261122.md), [1학기 기말 문제 그림 112개 시각검증](H1_1FINAL_ORIGINAL_PROBLEM_IMAGE_QA_112_20261122.md).

## 2. 고정된 현재 상태

2026-11-22 마지막 플랜 변경 시점의 공식 정적 검사 결과다. 실제 엔진 렌더 성적이 아니다.

| 학기 | 보관 플랜 JSON | 정적 `plan-lint` |
| --- | ---: | --- |
| 1학기 중간 `1mid` | 10 | 전부 OK |
| 1학기 기말 `1final` | 32 | 전부 OK |
| 2학기 중간 `2mid` | 55 | 전부 OK |
| 2학기 기말 `2final` | 23 | 전부 OK |
| **합계** | **120** | **120 OK / 0 FAIL / 0 SKIP** |

`120`은 JSON 파일 개수이며 **서로 다른 120문항이 새 렌더를 기다린다는 뜻이 아니다.** 이미 게시된 문항의 역사적 플랜과 한 문항을 여러 플랜으로 나눈 사례도 포함된다. 전부 무조건 재게시하지 말 것.

현재 브랜치에 포함된 고1 장부 **211개 시험지 파일 / 4,556개 항목**의 OPEN 분류와 플랜 존재 여부를 다시 연결한 결과:

| OPEN 상태 | 장부 항목 | 해당 문항의 플랜 있음 | 플랜 없음 |
| --- | ---: | ---: | ---: |
| `OPEN_LAYOUT` | 14 | **14** | **0** |
| `OPEN_UNSUPPORTED` | 53 | 47 | 6 |
| `OPEN_CONTENT` | 10 | 5 | 5 |
| **합계** | **77** | **66** | **11** |

`OPEN_LAYOUT` 플랜 작성은 14/14 완료. 나머지 11건은 원인 확정 전 무작정 JSON을 만들어 `OK`로 처리하지 않는다. `OPEN_UNSUPPORTED`는 엔진 기능·표현 가능성, `OPEN_CONTENT`는 원문·수학·해설의 불일치부터 확인한다. 장부 상태를 플랜 존재만으로 닫지 말 것.

## 3. 플랜이 없는 예외 11문항 — 조사 큐

아래 목록은 현행 장부의 OPEN 상태와 **해당 `q<번호>-solution*.json`의 부재**를 함께 확인한 것이다. 장부 `reason`에는 구체 원인이 기재되지 않았으므로 결함 원인을 추측하여 확정하지 않는다.

| 우선 | 학기 | 시험지 | 문항 | 상태 |
| --- | --- | --- | ---: | --- |
| 내용 확인 | 1mid | `25_팔마고_1학기_중간_고1_기출` | 14 | `OPEN_CONTENT` |
| 내용 확인 | 1mid | `25_순천여고_1학기_중간_고1_기출` | 6 | `OPEN_CONTENT` |
| 내용 확인 | 1final | `20_금당고_1학기_기말_고1_기출` | 11 | `OPEN_CONTENT` |
| 내용 확인 | 1final | `21_매산여고_1학기_기말_고1_기출` | 19 | `OPEN_CONTENT` |
| 내용 확인 | 1final | `26_효천고_1학기_기말_고1_기출` | 17 | `OPEN_CONTENT` |
| 기능 확인 | 1mid | `19_순천여고_1학기_중간_고1_기출` | 22 | `OPEN_UNSUPPORTED` |
| 기능 확인 | 2mid | `21_매산고_2학기_중간_고1_기출` | 9 | `OPEN_UNSUPPORTED` |
| 기능 확인 | 2mid | `21_제일고_2학기_중간_고1_기출` | 4 | `OPEN_UNSUPPORTED` |
| 기능 확인 | 2mid | `21_제일고_2학기_중간_고1_기출` | 11 | `OPEN_UNSUPPORTED` |
| 기능 확인 | 2final | `20_순천여고_2학기_기말_고1_기출` | 18 | `OPEN_UNSUPPORTED` |
| 기능 확인 | 2final | `24_효천고_2학기_기말_고1_수학` | 10 | `OPEN_UNSUPPORTED` |

각 문항의 현행 JS `content/choices/answer/solution/image/solutionImage`와 실제 문제/해설 자산을 읽는다. 정확한 내용과 지원 primitive가 결정되면 플랜을 추가하고 정적 검사한다. 엔진 미지원이면 수동 SVG로 우회하지 말고 해당 항목을 OPEN으로 유지하고 구체적인 공백을 보고한다.

## 4. 특별 인계: 플랜 수정 8건과 분리 6건

2026-11-22에는 검사에서 걸린 기존 8개를 보완하고, 한 그림에 다 담기 어려운 사례의 누락을 막기 위해 보충 6개를 작성했다. 모두 `plan-lint` OK다.

- 2mid 2020 제일고 q5, 2022 제일고 q13 / 2final 2024 효천고 q18: 복합 2패널을 `columns:1`로 정리.
- 2mid 2026 복성고 q12의 **두 번째 해설** / 2final 2020 매산고 q14의 **두 번째 해설**: 학생이 해설을 읽는 데 필요한 그래프 축 눈금 보강.
- **2mid 2021 팔마고 q19:** `q19-solution.json` 및 `q19-solution-2.json`~`-4.json` 총 4개가 각각 집합식의 단계 하나를 표시.
- **2mid 2019 복성고 q13:** `q13-solution.json`의 `a=3,2` 비교 + `q13-solution-2.json`의 `a=-2` 반례.
- **2mid 2022 금당고 q1:** `q1-solution.json`의 도식 ①·③ + `q1-solution-2.json`의 ②·④ + `q1-solution-3.json`의 ⑤. 전 5개 대응 사례는 보존했지만 세 파일은 각각 별도 플랜이다.

**중요:** 현재 원본 JS의 `solutionImage`가 단일 슬롯인 곳에 복수 플랜이 자동으로 한 이미지가 되지 않는다. 마지막 세 문항은 원본 그림 및 현행 게시 SVG의 학생 가독성을 먼저 확인한다. 복수 SVG로 게시할 별도 지원이 없으면 **기존 양호한 이미지를 유지**하고 엔진 결합 지원 이슈로 기록한다. 손으로 SVG를 붙이거나 플랜 일부만 그려서 동등한 전체 교체라고 주장하지 말 것.

## 5. 문제 그림 시각검증 후속

- 1final 현행 JS `questionBank[*].image` 참조 **112개(45종)**: PNG 108 + SVG 4 파일 존재·열기·실제 접촉시트/개별 판독 수행. **문제 그림** 기준 결함 예약 11건(HOLD 3, TIDY 8).
- 그중 **문제용 신규 엔진 플랜 3건**: 2019 강남여고 q21, 2021 팔마고 q4, 2022 강남여고 q16. 정답 선공개 없이 주어진 도형만 그리도록 작성됨.
- 나머지 PNG 결함(스캔 본문 혼입, 흐릿한 사진·원 경계 등)은 원본 PDF와 대조하여 원본 크롭/복원을 우선한다. **사진·삽화까지 억지로 SVG 작도하지 않는다.**
- 과거 체크포인트 `216/328, 11종·112개 잔여`와 이번 현행 `112개(45종)`는 문항별 교집합이 확인되지 않아 같은 분모가 아니다. **고1 전체 시각검증 잔여 0이라고 선언 금지.**
- 2mid 검수 별도 브랜치 `work/h1-2mid-original-visual-qa-20261122`의 HOLD/TIDY도 원본 대조·학생 화면 검증이 필요하다.

## 6. 다음 SVG 작업자의 실행 순서와 완료 조건

1. 브랜치의 이 인계서와 위 정본 3개, `main`의 최신 해당 기출 JS·실제 이미지, 현행 장부를 읽는다. 필요한 파일만 대조하며 기존 `PUBLISHED`·`EXEMPT`를 무작정 새 작업으로 늘리지 않는다.
2. 대상 qid마다 **문제용/해설용 슬롯을 분리**하고, 기존 이미지의 품질과 플랜의 실제 수학·도형 관계를 교차검증한다. `OPEN_CONTENT`는 먼저 내용 정확성, `OPEN_UNSUPPORTED`는 엔진 primitive 가능성을 조사한다.
3. `AUTHOR_GUIDE.md`에 따라 공식 엔진으로만 SVG를 생성한다. `item.json`은 해당 **현행 JS 파일과 ordinal**에 결속한다. 손그림·수동 SVG/XML 조립은 금지한다. `plan-lint` 통과는 렌더 통과가 아니다.
4. 렌더 결과의 `ARCHIVE_BOUND`, PNG 실제 육안, 문항 수치·식·좌표·라벨, 문제 그림의 정답 노출 금지, 해설 그림의 충분한 과정 정보, 학생 PC/모바일·A4 인쇄 가독성을 각각 확인한다. 실패하면 플랜 수정 후 재검증하거나 근거와 함께 OPEN 유지.
5. 검수 통과 결과만 공식 `publish-exam`/`ledger-upsert` 경로에 따라 게시·장부 변경한다. `main`에 무검증 병합 금지. 브랜치·커밋·문항별 `PASS/FAILED/UNSUPPORTED/NOT_RUN` 및 실제 렌더 결과를 보고한다.

정적 플랜 검사 예시(리포지토리 루트, Bash; **렌더는 실행하지 않음**):

```bash
mapfile -t plans < <(rg --files docs/plans/archive-one-route-upgrade/svg-plans-expanded/original/high/h1 -g '*.json' | rg '/q[0-9]+-(problem|solution)(-[0-9]+)?\.json$')
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --jobs 4 "${plans[@]}"
```

> **이 인계서의 종료 조건:** 고1 기출 플랜 JSON 정적 검사는 120/120 OK로 준비되어 있고, 11개의 미작성 예외는 개별 조사 큐에 명시되어 있다. **엔진 실행·시각검증·게시·학생 화면 최종 QA는 아직 수행하지 않았다.**
