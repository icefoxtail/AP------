# Source Inventory and Audit — 2025 팔마고 고1 2학기 중간

## Scope and result

Source inventory only. No similar questions were generated, and the locked JS or its assets were not modified. The assigned JS contains **23 question objects**, with unique, ordered source `id` values **1–23**. The task packet did not provide a separate `sourceQuestionId` field; this report records only exact IDs read from `window.questionBank[].id` and does not infer another identifier.

All 23 prompts, choices, and source solutions were read. The source-defined denominator is confirmed within the locked JS: one `window.questionBank` assignment, 23 objects, no duplicate or missing IDs, and no code after that assignment. External runtime mutation was outside this source-only scope.

## Locked source fingerprint

| Field | Value |
|---|---|
| Branch | `codex/alive-palma-25-h1-2mid` |
| HEAD | `330394489f6e90c5c7d5c7ae28623ab52ca824b9` |
| Exam title | `25_팔마고_2학기_중간_고1_기출` |
| Source | `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js` |
| Git blob SHA-1 | `4cfce909c023e5c4df4a759945c8cc3e0a63ec76` |
| File SHA-256 | `1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF` |
| Effective source-bank denominator | 23 |
| Source IDs | 1–23 in ascending order, all unique |

## Authority and Primary L2 candidates

RPM Primary v1.0 is the locked taxonomy authority. The 2022 공통수학2 course document marks L1/L2 as `RPM_VERIFIED` and L3/L4 as `CANONICAL_DRAFT`. The L1/L2 mappings below are source-structure candidates; exact L3/L4 anchors are not final blueprints and require the RPM-first lookup in the ALIVE extension contract.

| Canonical L1 | Canonical L2 | Source qids | Count |
|---|---|---|---:|
| 도형의 방정식 | 평면좌표 | 4, 9, 18 | 3 |
| 도형의 방정식 | 직선의 방정식 | 5, 23 | 2 |
| 도형의 방정식 | 원의 방정식 | 3, 6, 12, 19, 22 | 5 |
| 도형의 방정식 | 도형의 이동 | 7, 15, 17 | 3 |
| 집합과 명제 | 집합의 뜻과 포함 관계 | 1, 13 | 2 |
| 집합과 명제 | 집합의 연산 | 8, 10, 16, 20 | 4 |
| 집합과 명제 | 명제 | 2, 11, 14, 21 | 4 |

## Exam shape and workload

The source declares 19 five-choice multiple-choice and 4 constructed-response questions. Source difficulty counts are 하 3, 중 13, 상 7; `difficultyBucket` counts are 1:3, 2:6, 3:7, 4:5, 5:2. Point labels total 100; q21 is 5 points split into 2 and 3. Workload and extension estimates below describe source structure only; extension potential is not a production quota.

## Complete qid inventory

| QID | Source unit | Primary L2 candidate | Level / bucket | Format / points | Decisive source structure | Workload | Visual references |
|---:|---|---|---|---|---|---|---|
| 1 | 집합 | 집합과 명제 → 집합의 뜻과 포함 관계 | 하 / 1 | 객관식 (3.5점) | 주관적 기준과 객관적 정수 조건을 구분한다. | light | — |
| 2 | 명제 | 집합과 명제 → 명제 | 하 / 1 | 객관식 (3.5점) | 절댓값 부등식의 여집합과 등호 경계를 처리한다. | light | — |
| 3 | 원의 방정식 | 도형의 방정식 → 원의 방정식 | 하 / 1 | 객관식 (3.5점) | 중심 좌표 부호와 반지름 제곱을 식에 대응한다. | light | — |
| 4 | 평면좌표 | 도형의 방정식 → 평면좌표 | 중 / 2 | 객관식 (3.7점) | 변수점과 두 고정점의 거리 합을 읽고 등호 성립 자취를 확인한다. | standard | — |
| 5 | 직선의 방정식 | 도형의 방정식 → 직선의 방정식 | 중 / 2 | 객관식 (3.7점) | 중점과 수직 기울기를 결합해 직선식을 정한다. | standard | — |
| 6 | 원의 방정식 | 도형의 방정식 → 원의 방정식 | 중 / 2 | 객관식 (3.7점) | 중심-직선 거리와 반지름, 접하는 경계 포함을 처리한다. | standard | — |
| 7 | 도형의 이동 | 도형의 방정식 → 도형의 이동 | 중 / 3 | 객관식 (4점) | 이동된 두 중심을 구해 공통 이등분선 조건을 쓴다. | standard | — |
| 8 | 집합 | 집합과 명제 → 집합의 연산 | 중 / 2 | 객관식 (4점) | 배수 집합 합집합에서 교집합을 최소공배수 배수로 세어 뺀다. | standard | — |
| 9 | 평면좌표 | 도형의 방정식 → 평면좌표 | 중 / 3 | 객관식 (4점) | 그림의 세 변 비를 읽어 내분점과 무게중심 좌표를 구한다. | standard | assets/images/25_팔마고_2학기_중간_고1_기출/q09.png |
| 10 | 집합 | 집합과 명제 → 집합의 연산 | 중 / 2 | 객관식 (4.3점) | 음영이 A와 B에 있고 C에는 없는 부분임을 나타낸다. | standard | assets/images/25_팔마고_2학기_중간_고1_기출/q10.png |
| 11 | 명제 | 집합과 명제 → 명제 | 중 / 3 | 객관식 (4.3점) | 다섯 조건쌍의 방향별 함의 및 반례를 검토한다. | standard | — |
| 12 | 원의 방정식 | 도형의 방정식 → 원의 방정식 | 중 / 3 | 객관식 (4.3점) | 접점이 만족하는 접선식으로 현의 직선식을 얻고 중심에서 거리를 구한다. | standard | — |
| 13 | 집합 | 집합과 명제 → 집합의 뜻과 포함 관계 | 상 / 4 | 객관식 (4.5점) | 가능 원소를 6의 영 아닌 약수로 제한하고 음수 선택의 짝홀 및 공집합 제외를 센다. | heavy | — |
| 14 | 명제 | 집합과 명제 → 명제 | 중 / 3 | 객관식 (4.5점) | 모든 x에 대한 엄격 부등식의 부정을 존재 명제로 바꾸고 최댓값 조건을 쓴다. | standard | — |
| 15 | 도형의 이동 | 도형의 방정식 → 도형의 이동 | 중 / 3 | 객관식 (4.5점) | 방정식 변수 치환이 원의 중심을 어디로 보내는지 보기별 확인한다. | standard | assets/images/25_팔마고_2학기_중간_고1_기출/q15.png |
| 16 | 집합 | 집합과 명제 → 집합의 연산 | 상 / 4 | 객관식 (4.8점) | 전제 포함관계를 간단히 해 네 집합식을 판정한다. | heavy | — |
| 17 | 도형의 이동 | 도형의 방정식 → 도형의 이동 | 상 / 5 | 객관식 (4.8점) | P의 두 반사상을 써서 둘레 하한과 등호 가능한 배치를 다룬다. | heavy | assets/images/25_팔마고_2학기_중간_고1_기출/q17.png; solution q17-solution.svg |
| 18 | 평면좌표 | 도형의 방정식 → 평면좌표 | 상 / 4 | 객관식 (5.2점) | 각의 이등분선 정리로 H를 찾고 centroid와 거리로 넓이를 구한다. | heavy | —; solution q18-solution.svg |
| 19 | 원의 방정식 | 도형의 방정식 → 원의 방정식 | 상 / 5 | 객관식 (5.2점) | 큰 원과 두 반원의 교점수를 합산하며 끝점 중복·접선 경계를 제외한다. | heavy | assets/images/25_팔마고_2학기_중간_고1_기출/q19.png |
| 20 | 집합 | 집합과 명제 → 집합의 연산 | 중 / 2 | 서술형 (4점) | 전체 인원과 두 집합의 크기로 교집합 범위 및 양 끝 실현을 설명한다. | standard | — |
| 21 | 명제 | 집합과 명제 → 명제 | 중 / 3 | 서술형 (5점) | p,q 진리집합과 r≡not-p를 이용해 집합 포함관계의 방향을 판정한다. | standard | — |
| 22 | 원의 방정식 | 도형의 방정식 → 원의 방정식 | 상 / 4 | 서술형 (5점) | 세 직선 교점과 직각성을 이용해 빗변 중점·반지름을 구한다. | heavy | —; solution q22-solution.svg |
| 23 | 직선의 방정식 | 도형의 방정식 → 직선의 방정식 | 상 / 4 | 서술형 (6점) | 두 거리조건을 평행선 쌍으로 바꾸고 네 교점 평행사변형의 넓이를 구한다. | heavy | —; solution q23-solution.svg |

## Visual dependencies and byte verification

Student-facing figures are referenced only by q9, q10, q15, q17, and q19. I opened each PNG at original resolution. Four linked SVGs are `solutionImage` assets only and are not required to understand the student prompt; their paths, bytes, Git blobs, and SHA-256 values were checked. No claim of visual render QA is made for solution-only SVGs. No question references a table.

| QID | Field | Locked path | Type / dimensions / size | SHA-256 | Git blob SHA-1 |
|---:|---|---|---|---|---|
| 9 | `image` | `archive/assets/images/25_팔마고_2학기_중간_고1_기출/q09.png` | png 389x362, 3131 bytes | `2C82FBFCE30952D66A417B721553A7F0D4D2F6EC13856BDD554BE0EF375EFFC8` | `cbf45514a2bffb7fd659faec127729db18b80b20` |
| 10 | `image` | `archive/assets/images/25_팔마고_2학기_중간_고1_기출/q10.png` | png 335x304, 2802 bytes | `FAF23A3E032087CAE6FB7FA5F08D14F7F385700E1F40E4C1EA75CCD35DE05037` | `8d36594569ac701328a4d5597618843729f6c372` |
| 15 | `image` | `archive/assets/images/25_팔마고_2학기_중간_고1_기출/q15.png` | png 501x300, 2498 bytes | `233A03D9988D1F462012ED4BEAC71C3105894B203070710A601D25116F7C9621` | `1efe88f4eb3e1ea37fa43c23ab6655504bb0b9a4` |
| 17 | `image` | `archive/assets/images/25_팔마고_2학기_중간_고1_기출/q17.png` | png 396x362, 3687 bytes | `59FC4974308DDFE6F7BA8A6EC013B008635BD3635B6449447FB732B3F6105FEA` | `e90a3d2c1e20fa34bf38d9ac4306f62d1b6a7f80` |
| 17 | `solutionImage` | `archive/assets/images/25_팔마고_2학기_중간_고1_기출/q17-solution.svg` | svg 760x480, 2224 bytes | `2BBE3C901E673504162F9F036FEC74EB551FCAAE9F39E7B17CA514AF46F73ADB` | `c6a72aa26f563579e8b2e18f0bb4c5ca9c431c3e` |
| 18 | `solutionImage` | `archive/assets/images/25_팔마고_2학기_중간_고1_기출/q18-solution.svg` | svg 760x480, 1677 bytes | `554CB79393A0E47E19142F7760DB21A433A7062A29FEA5C3D4AD39B1BBCA61D0` | `6b4b46edab922da7f890370823161de925328ce1` |
| 19 | `image` | `archive/assets/images/25_팔마고_2학기_중간_고1_기출/q19.png` | png 497x394, 3257 bytes | `716D7AA89291167E880C6C109B792056D3A5739CB0A4CF25DFB75DA3BFB5B479` | `0a9db38d23e3e51909e8149381a43e94d1cdd06b` |
| 22 | `solutionImage` | `archive/assets/images/25_팔마고_2학기_중간_고1_기출/q22-solution.svg` | svg 760x480, 1595 bytes | `D0D04E1D4C25B000D360CB2C31341F477D426AEBA963C7CCB2669505327F495C` | `ef89e865d87372ec60c380fe4b9c837fae97d340` |
| 23 | `solutionImage` | `archive/assets/images/25_팔마고_2학기_중간_고1_기출/q23-solution.svg` | svg 760x480, 1690 bytes | `D3FF24683F3E2D88D1FB39ED9D938AD6B032F1D55B7A2D46BE8132DF8A765C17` | `8524bc9834a1b5417b20dc018a062a800b62eecd` |

Figure observations: q9 shows triangle OAB and division points C,D,E; q10 shows A∩B outside C shaded; q15 shows two unit circles on coordinate axes; q17 shows the circle, line, and constrained points A,B,P,Q,R; q19 shows the outer circle and two semicircle outlines. These observations come from direct inspection of the five referenced question PNGs.

## Shared conditions

No exam-wide shared stem or condition spans separate questions. Local conditions: q13 has two set restrictions; q16 has a subset premise (HOLD); q20 fixes the class total and two set sizes; q21 reuses p,q across two parts; q23 applies two distance constraints to all four distinct points.

## Source findings and unresolved points

- **HOLD — sourceQuestionId field absent:** no such field was supplied in the task packet. Source qids above are exact JS `id` values only.
- **HOLD — q11 variable scope:** the stem declares only x and y real, while option ⑤ and the source solution use z. Confirm or correct the source wording through authorized provenance before design.
- **HOLD — q16 set braces:** the prompt prints `B⊂{U−(Aᶜ∪Bᶜ)}`, while its source solution treats the condition as `B⊆A∩B`. Preserve the exact source and resolve before design.
- **Source text note — q20:** the stem says “마팔고”; the exam title says “팔마고”. Preserve the original wording.
- No source PDF was supplied for page-level transcription parity; this is a locked-JS-and-assets audit.
- Runtime model and reasoning effort were not exposed by the worker interface; no Luna model or effort is claimed.

## Read authority

- `alive/06_EXECUTION/ALIVE_LITE_CONTINUATION_CURRENT.md`
- `alive/06_EXECUTION/ALIVE_LITE_EXECUTION_RULES.md`
- `alive/06_EXECUTION/ALIVE_LITE_FULL_SCAN_ADAPTIVE_BATCH_TWO_CHAT_CONTRACT_v1.md`
- `alive/06_EXECUTION/ALIVE_LITE_SOURCE_BLUEPRINT_EXHAUSTION_CONTRACT_v0.1.md`
- `alive/06_EXECUTION/ALIVE_LITE_L3_L4_EXTENSION_DISCOVERY_CONTRACT_v1.md`
- `docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/RPM_PRIMARY_POLICY.md`
- `docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/02_2022/HIGH/공통수학2.md`
- `docs/reports/metadata-foundation-v2/taxonomy/JS_ARCHIVE_TAXONOMY_RPM_PRIMARY_v1.0_ACCEPTANCE.md`
